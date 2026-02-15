import { computed, ref } from "vue";
import { addPostComment, getPost, listPosts } from "../api/posts";
import { loginApi, meApi, registerApi } from "../api/auth";

const TOKEN_EXPIRES_AT_KEY = "token_expires_at";
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const ACTIVE_USER_CACHE_KEY = "active_user_cache";

export const searchKey = ref("");
export const activeUser = ref(null);
export const selectedTags = ref([]);

export const posts = ref([]);        // ✅ 后端加载后填充
export const loading = ref(false);   // ✅ 拉取状态
export const errorMsg = ref("");     // ✅ 错误信息
export const projects = ref([
  {
    id: 1,
    name: "博客前后端联调",
    desc: "基于 Vue + Spring Boot 的个人博客系统联调实践。",
    url: "https://github.com/J0rthan/blog_backend",
  },
  {
    id: 2,
    name: "评论系统优化",
    desc: "支持登录鉴权、评论提交和列表实时更新。",
    url: "https://github.com/your-account/your-repo-2",
  }
]);

function getPostTags(post) {
  const tags = Array.isArray(post?.tags) ? post.tags.filter(Boolean) : [];
  if (post?.category) tags.push(post.category);
  return [...new Set(tags)];
}

export const availableTags = computed(() => {
  const tagSet = new Set();
  posts.value.forEach((post) => {
    getPostTags(post).forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet);
});

export const filteredPosts = computed(() => {
  const key = searchKey.value.trim().toLowerCase();
  const tags = selectedTags.value;
  const bySearch = posts.value.filter((post) => {
    if (!key) return true;
    const title = (post.title || "").toLowerCase();
    const summary = (post.summary || "").toLowerCase();
    return title.includes(key) || summary.includes(key);
  });
  if (!tags.length) return bySearch;
  return bySearch.filter((post) => {
    const postTags = getPostTags(post);
    return tags.some((tag) => postTags.includes(tag));
  });
});

export function toggleTag(tag) {
  if (!tag) return;
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((item) => item !== tag);
    return;
  }
  selectedTags.value = [...selectedTags.value, tag];
}

export const pageInfo = ref({ number: 0, size: 10, totalElements: 0, totalPages: 0 });

function isAuthorIdentity(identity) {
  const value = String(identity || "").trim().toUpperCase();
  return value === "ADMIN" || value === "AUTHOR" || value.includes("ADMIN") || value.includes("AUTHOR");
}

function normalizeUser(raw, fallbackEmail = "") {
  const user = raw?.user ?? raw?.data ?? raw ?? {};
  const email = user.email || fallbackEmail || "";
  const username = user.userName || user.username || user.name || "";
  const identity = user.identity || user.role || user.userRole || "";
  return {
    id: user.userId ?? user.id ?? null,
    email,
    username,
    identity,
    isAuthor: isAuthorIdentity(identity),
    nickname: user.nickname || username || email || "已登录用户",
  };
}

function cacheActiveUser(user) {
  if (!user) return;
  localStorage.setItem(ACTIVE_USER_CACHE_KEY, JSON.stringify(user));
}

function readCachedUser() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVE_USER_CACHE_KEY) || "null");
  } catch {
    return null;
  }
}

export const isAuthor = computed(() => Boolean(activeUser.value?.isAuthor));

export async function fetchPosts() {
  loading.value = true;
  errorMsg.value = "";
  try {
    const page = await listPosts({
      page: pageInfo.value.number,
      size: pageInfo.value.size,
    });
    posts.value = page.content ?? [];
    await Promise.all(
      posts.value.map(async (post) => {
        if ((post.words ?? 0) > 0) return;
        try {
          const detail = await getPost(post.id);
          post.content = detail.content || post.content || "";
          post.words = (detail.content || "").length;
        } catch {
          post.words = (post.content || "").length;
        }
      })
    );
    pageInfo.value = {
      number: page.number ?? 0,
      size: page.size ?? pageInfo.value.size,
      totalElements: page.totalElements ?? 0,
      totalPages: page.totalPages ?? 0,
    };
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || e?.message || "加载文章失败";
  } finally {
    loading.value = false;
  }
}

export function getPostById(id) {
  return posts.value.find((post) => Number(post.id) === Number(id));
}

/** ✅ token 登录：调用后端，保存 token，并设置 activeUser */
export async function login(email, password) {
  try {
    const data = await loginApi(email, password);
    const token = data?.token || data?.data?.token || data?.result?.token;
    if (!token) return { ok: false, message: "登录接口未返回 token" };
    localStorage.setItem("token", token);
    localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(Date.now() + TOKEN_TTL_MS));
    const identity = data?.identity || data?.data?.identity || data?.result?.identity;
    if (identity) localStorage.setItem("identity", identity);
    const loginUser = normalizeUser(data, email);

    try {
      const me = await meApi();
      const meUser = normalizeUser(me, email);
      if (!meUser.identity && loginUser.identity) {
        meUser.identity = loginUser.identity;
        meUser.isAuthor = loginUser.isAuthor;
      }
      activeUser.value = meUser;
      cacheActiveUser(meUser);
    } catch {
      activeUser.value = loginUser;
      cacheActiveUser(loginUser);
    }

    return { ok: true, message: "" };
  } catch (e) {
    const msg = e?.response?.data?.message || "邮箱或密码错误。";
    return { ok: false, message: msg };
  }
}

export async function register(email, password, username) {
  if (!email?.trim() || !password?.trim() || !username?.trim()) {
    return { ok: false, message: "邮箱、用户名和密码不能为空。" };
  }

  try {
    await registerApi(email.trim(), password, username.trim());
    return { ok: true, message: "注册成功，请登录" };
  } catch (e) {
    const msg = e?.response?.data?.message || "注册失败，请稍后重试。";
    return { ok: false, message: msg };
  }
}

/** ✅ 刷新登录态：页面刷新后用 token 拉 /me 恢复 activeUser（可选但推荐） */
export async function restoreSession() {
  const token = localStorage.getItem("token");
  if (!token) return;
  const expiresAt = Number(localStorage.getItem(TOKEN_EXPIRES_AT_KEY) || 0);
  if (!expiresAt || Date.now() > expiresAt) {
    logout();
    return;
  }
  const savedIdentity = localStorage.getItem("identity") || "";
  const cachedUser = readCachedUser();
  if (cachedUser) {
    activeUser.value = cachedUser;
  }

  try {
    const me = await meApi();
    const meUser = normalizeUser(me);
    if (!meUser.identity && savedIdentity) {
      meUser.identity = savedIdentity;
      meUser.isAuthor = isAuthorIdentity(savedIdentity);
    }
    activeUser.value = meUser;
    cacheActiveUser(meUser);
  } catch (e) {
    if (e?.response?.status === 401) {
      logout();
    }
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("identity");
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(ACTIVE_USER_CACHE_KEY);
  activeUser.value = null;
}

/**  评论：建议也改成调用后端；先给一个最小兼容写法 */
export async function addComment(postId, text) {
  if (!activeUser.value) return false;
  const content = text.trim();
  if (!content) return false;

  try {
    const saved = await addPostComment(postId, content);
    const post = getPostById(postId);
    if (!post) return true;

    const raw = saved?.comment || saved || {};
    post.comments = post.comments || [];
    post.comments.unshift({
      id: raw.id ?? Date.now(),
      author: raw.author || raw.nickname || activeUser.value?.nickname || "我",
      text: raw.text || raw.content || content,
      time: raw.time || new Date().toLocaleString("zh-CN", { hour12: false })
    });
    return true;
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || e?.message || "评论发布失败";
    return false;
  }
}
