<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { getAllPosts } from "./lib/posts";

const posts = getAllPosts();
const selectedSlug = ref("");
const isDonateView = ref(false);
const isProjectsView = ref(false);
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

const featuredPost = computed(() => posts[0] || null);
const gridPosts = computed(() => posts);
const latestPosts = computed(() => posts.slice(0, 8));
const relatedPosts = computed(() => {
  if (!selectedPost.value) return [];
  return posts.filter((post) => post.slug !== selectedPost.value.slug).slice(0, 4);
});

function openPost(slug) {
  selectedSlug.value = slug;
  window.location.hash = `#/post/${slug}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToList() {
  selectedSlug.value = "";
  isDonateView.value = false;
  isProjectsView.value = false;
  window.location.hash = "#/";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openHome() {
  selectedSlug.value = "";
  isDonateView.value = false;
  isProjectsView.value = false;
  window.location.hash = "#/";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openProjects() {
  selectedSlug.value = "";
  isDonateView.value = false;
  isProjectsView.value = true;
  window.location.hash = "#/projects";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openDonate() {
  selectedSlug.value = "";
  isDonateView.value = true;
  isProjectsView.value = false;
  window.location.hash = "#/donate";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function syncFromHash() {
  if (window.location.hash === "#/donate") {
    selectedSlug.value = "";
    isDonateView.value = true;
    isProjectsView.value = false;
    return;
  }

  if (window.location.hash === "#/projects") {
    selectedSlug.value = "";
    isDonateView.value = false;
    isProjectsView.value = true;
    return;
  }

  const match = window.location.hash.match(/^#\/post\/([a-z0-9-]+)$/i);
  if (!match) {
    selectedSlug.value = "";
    isDonateView.value = false;
    isProjectsView.value = false;
    return;
  }

  const slug = match[1];
  isDonateView.value = false;
  isProjectsView.value = false;
  selectedSlug.value = posts.some((post) => post.slug === slug) ? slug : "";
}

function categoryOf(post) {
  return post.tags[0] || "头条";
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
        <p class="brand-sub">All voices matter</p>
        <h1 class="brand">Daily Notes</h1>
        <button class="subscribe-btn" @click="openDonate">打赏</button>
      </div>
      <nav class="top-nav">
        <button class="nav-link" :class="{ active: activeNav === 'home' }" @click="openHome">首页</button>
        <button class="nav-link" :class="{ active: activeNav === 'projects' }" @click="openProjects">项目</button>
      </nav>
    </header>

    <main v-if="posts.length > 0" class="page-wrap">
      <section v-if="isDonateView" class="donate-page">
        <article class="donate-shell">
          <button class="back-btn" @click="backToList">Back to Newsroom</button>
          <h2>感谢支持</h2>
          <p>扫描下方收款码即可打赏。</p>
          <img class="donate-qr" src="/payment-qr.svg" alt="收款码" />
          <p class="donate-tip">如需替换为你的收款码，请覆盖 `frontend/public/payment-qr.svg`。</p>
        </article>
      </section>

      <section v-else-if="isProjectsView" class="projects-page">
        <div class="headline-strip">
          <span>Projects</span>
          <p>这里展示我正在做和做过的项目</p>
        </div>
        <section class="projects-grid">
          <article class="project-card" v-for="project in projects" :key="project.name">
            <h3>{{ project.name }}</h3>
            <p>{{ project.summary }}</p>
            <div class="meta-row">
              <span>{{ project.stack }}</span>
              <a :href="project.link">查看</a>
            </div>
          </article>
        </section>
      </section>

      <section v-else-if="!isDetailView" class="list-page">
        <div class="headline-strip">
          <span>Latest</span>
          <p>{{ featuredPost ? featuredPost.title : "欢迎来到我的博客" }}</p>
        </div>

        <section class="home-grid">
          <article class="hero-story" v-if="featuredPost" @click="openPost(featuredPost.slug)">
            <div class="hero-media">
              <div class="hero-tint"></div>
            </div>
            <div class="hero-content">
              <p class="chip">{{ categoryOf(featuredPost) }}</p>
              <h2>{{ featuredPost.title }}</h2>
              <p>{{ featuredPost.summary }}</p>
              <div class="meta-row">
                <span>{{ featuredPost.date }}</span>
                <span>{{ featuredPost.wordCount }} 字</span>
              </div>
            </div>
          </article>

          <aside class="latest-panel">
            <h3>Latest Stories</h3>
            <button
              v-for="post in latestPosts"
              :key="post.slug"
              class="latest-item"
              @click="openPost(post.slug)"
            >
              <p class="latest-title">{{ post.title }}</p>
              <p class="latest-meta">{{ post.date }}</p>
            </button>
          </aside>
        </section>

        <section class="card-grid">
          <article v-for="post in gridPosts" :key="post.slug" class="news-card" @click="openPost(post.slug)">
            <p class="chip">{{ categoryOf(post) }}</p>
            <h3>{{ post.title }}</h3>
            <p>{{ post.summary }}</p>
            <div class="meta-row">
              <span>{{ post.date }}</span>
              <span>{{ post.wordCount }} 字</span>
            </div>
          </article>
        </section>
      </section>

      <section v-else class="detail-page">
        <article class="article-shell">
          <button class="back-btn" @click="backToList">Back to Newsroom</button>
          <p class="chip">{{ categoryOf(selectedPost) }}</p>
          <h2>{{ selectedPost.title }}</h2>
          <div class="meta-row">
            <span>{{ selectedPost.date }}</span>
            <span>{{ selectedPost.wordCount }} 字</span>
          </div>
          <div class="markdown-body" v-html="selectedPost.html"></div>
        </article>

        <aside class="related-panel">
          <h3>Related</h3>
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
