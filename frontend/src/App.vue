<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { getAllPosts } from "./lib/posts";

const posts = getAllPosts();
const selectedSlug = ref("");
const isProjectsView = ref(false);

const searchQuery = ref("");
const selectedTag = ref("全部");
const sortMode = ref("newest");
const currentPage = ref(1);
const pageSize = 9;

const projects = [
  {
    name: "Markdown Blog",
    summary: "一个可直接部署到 Vercel 的静态博客，支持 Markdown 发文和字数统计。",
    stack: "Vue 3, Vite, Vercel",
    link: "#/",
  },
  {
    name: "Content Toolkit",
    summary: "内容创作小工具集合，包含标题生成、摘要提取和标签建议。",
    stack: "TypeScript, Node.js",
    link: "#/",
  },
  {
    name: "Reading Dashboard",
    summary: "个人阅读与笔记追踪面板，用于管理主题、进度和输出。",
    stack: "Vue 3, LocalStorage",
    link: "#/",
  },
];

const selectedPost = computed(() => {
  if (!selectedSlug.value) return null;
  return posts.find((post) => post.slug === selectedSlug.value) || null;
});

const isDetailView = computed(() => !!selectedPost.value);
const activeNav = computed(() => (isProjectsView.value ? "projects" : "home"));

const totalWordCount = computed(() => posts.reduce((sum, post) => sum + post.wordCount, 0));

const tagStats = computed(() => {
  const counter = new Map();
  for (const post of posts) {
    for (const tag of post.tags || []) {
      counter.set(tag, (counter.get(tag) || 0) + 1);
    }
  }

  return [...counter.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-Hans-CN"));
});

const baseFilteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return posts.filter((post) => {
    const tagMatched = selectedTag.value === "全部" || (post.tags || []).includes(selectedTag.value);
    if (!tagMatched) return false;
    if (!query) return true;

    const haystack = [post.title, post.summary, post.date, ...(post.tags || [])].join(" ").toLowerCase();
    return haystack.includes(query);
  });
});

const latestPosts = computed(() => {
  return [...baseFilteredPosts.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
});

const sortedPosts = computed(() => {
  const list = [...baseFilteredPosts.value];

  if (sortMode.value === "oldest") {
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sortMode.value === "words") {
    list.sort((a, b) => b.wordCount - a.wordCount);
  } else if (sortMode.value === "title") {
    list.sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"));
  } else {
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return list;
});

const totalPages = computed(() => Math.max(1, Math.ceil(sortedPosts.value.length / pageSize)));

const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return sortedPosts.value.slice(start, start + pageSize);
});

const relatedPosts = computed(() => {
  if (!selectedPost.value) return [];
  return posts
    .filter((post) => post.slug !== selectedPost.value.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);
});

watch([selectedTag, searchQuery, sortMode], () => {
  currentPage.value = 1;
});

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) currentPage.value = pageCount;
});

function openPost(slug) {
  selectedSlug.value = slug;
  isProjectsView.value = false;
  window.location.hash = `#/post/${slug}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToList() {
  selectedSlug.value = "";
  isProjectsView.value = false;
  window.location.hash = "#/";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openHome() {
  selectedSlug.value = "";
  isProjectsView.value = false;
  window.location.hash = "#/";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openProjects() {
  selectedSlug.value = "";
  isProjectsView.value = true;
  window.location.hash = "#/projects";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearFilters() {
  selectedTag.value = "全部";
  searchQuery.value = "";
  sortMode.value = "newest";
}

function gotoPage(page) {
  currentPage.value = Math.min(totalPages.value, Math.max(1, page));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function syncFromHash() {
  if (window.location.hash === "#/projects") {
    selectedSlug.value = "";
    isProjectsView.value = true;
    return;
  }

  const match = window.location.hash.match(/^#\/post\/([a-z0-9-]+)$/i);
  if (!match) {
    selectedSlug.value = "";
    isProjectsView.value = false;
    return;
  }

  const slug = match[1];
  isProjectsView.value = false;
  selectedSlug.value = posts.some((post) => post.slug === slug) ? slug : "";
}

onMounted(() => {
  syncFromHash();
  window.addEventListener("hashchange", syncFromHash);
});

onBeforeUnmount(() => {
  window.removeEventListener("hashchange", syncFromHash);
});
</script>

<template>
  <div class="news-site">
    <header class="site-header">
      <div class="masthead">
        <h1 class="brand">Blog</h1>
        <div class="header-search" v-if="!isProjectsView && !isDetailView">
          <input v-model.trim="searchQuery" type="text" placeholder="搜索文章标题、摘要、标签" />
        </div>
      </div>
      <nav class="top-nav">
        <button class="nav-link" :class="{ active: activeNav === 'home' }" @click="openHome">首页</button>
        <button class="nav-link" :class="{ active: activeNav === 'projects' }" @click="openProjects">项目</button>
      </nav>
      <div class="site-stats">
        <span>文章 {{ posts.length }}</span>
        <span>标签 {{ tagStats.length }}</span>
        <span>总字数 {{ totalWordCount }}</span>
      </div>
    </header>

    <main v-if="posts.length > 0" class="page-wrap">
      <section v-if="isProjectsView" class="projects-page">
        <section class="projects-grid">
          <article class="project-card" v-for="project in projects" :key="project.name">
            <h3>{{ project.name }}</h3>
            <p>{{ project.summary }}</p>
            <div class="meta-row">
              <span>{{ project.stack }}</span>
              <a :href="project.link" target="_blank" rel="noreferrer">查看</a>
            </div>
          </article>
        </section>
      </section>

      <section v-else-if="!isDetailView" class="list-page">
        <section class="latest-layout" v-if="latestPosts.length > 0">
          <article class="latest-main" @click="openPost(latestPosts[0].slug)">
            <p class="eyebrow">最新发布</p>
            <h2>{{ latestPosts[0].title }}</h2>
            <p>{{ latestPosts[0].summary }}</p>
            <div class="meta-row">
              <span>{{ latestPosts[0].date }}</span>
              <span>{{ latestPosts[0].wordCount }} 字</span>
            </div>
          </article>

          <div class="latest-side">
            <button
              class="latest-side-item"
              v-for="post in latestPosts.slice(1)"
              :key="post.slug"
              @click="openPost(post.slug)"
            >
              <p>{{ post.title }}</p>
              <span>{{ post.date }}</span>
            </button>
          </div>
        </section>

        <section class="content-shell">
          <div>
            <div class="section-head">
              <h3>全部文章</h3>
              <p>共 {{ sortedPosts.length }} 篇</p>
            </div>

            <section class="card-grid" v-if="pagedPosts.length > 0">
              <article v-for="post in pagedPosts" :key="post.slug" class="news-card" @click="openPost(post.slug)">
                <div class="card-tags" v-if="post.tags && post.tags.length > 0">
                  <span class="chip" v-for="tag in post.tags" :key="`${post.slug}-${tag}`">{{ tag }}</span>
                </div>
                <h3>{{ post.title }}</h3>
                <p>{{ post.summary }}</p>
                <div class="meta-row">
                  <span>{{ post.date }}</span>
                  <span>{{ post.wordCount }} 字</span>
                </div>
              </article>
            </section>

            <section v-else class="empty-filter">
              <p>没有匹配结果，换个关键词或者重置筛选。</p>
            </section>

            <section class="pagination">
              <button @click="gotoPage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
              <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
              <button @click="gotoPage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
            </section>
          </div>

          <aside class="sidebar-filter">
            <h3>筛选器</h3>
            <div class="sort-row">
              <label for="sortMode">排序</label>
              <select id="sortMode" v-model="sortMode">
                <option value="newest">最新优先</option>
                <option value="oldest">最早优先</option>
                <option value="words">字数优先</option>
                <option value="title">按标题</option>
              </select>
            </div>

            <div class="tag-filter-list">
              <button class="tag-filter-btn" :class="{ active: selectedTag === '全部' }" @click="selectedTag = '全部'">
                全部
              </button>
              <button
                v-for="tagItem in tagStats"
                :key="tagItem.name"
                class="tag-filter-btn"
                :class="{ active: selectedTag === tagItem.name }"
                @click="selectedTag = tagItem.name"
              >
                {{ tagItem.name }} ({{ tagItem.count }})
              </button>
            </div>

            <button class="clear-btn" @click="clearFilters">重置筛选</button>
          </aside>
        </section>
      </section>

      <section v-else class="detail-page">
        <article class="article-shell">
          <button class="back-btn" @click="backToList">返回列表</button>
          <div class="detail-tags" v-if="selectedPost.tags && selectedPost.tags.length > 0">
            <span class="detail-tag" v-for="tag in selectedPost.tags" :key="tag">{{ tag }}</span>
          </div>
          <h2>{{ selectedPost.title }}</h2>
          <div class="meta-row">
            <span>{{ selectedPost.date }}</span>
            <span>{{ selectedPost.wordCount }} 字</span>
          </div>
          <div class="markdown-body" v-html="selectedPost.html"></div>
        </article>

        <aside class="related-panel">
          <h3>相关文章</h3>
          <button v-for="post in relatedPosts" :key="post.slug" class="related-item" @click="openPost(post.slug)">
            <p>{{ post.title }}</p>
            <span>{{ post.date }}</span>
          </button>
        </aside>
      </section>
    </main>

    <section v-else class="empty-state">
      <h2>还没有文章</h2>
      <p>在 `frontend/src/content/posts/` 下添加第一篇 Markdown 文件即可。</p>
    </section>
  </div>
</template>
