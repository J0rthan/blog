<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { getAllPosts } from "./lib/posts";

const posts = getAllPosts();
const selectedSlug = ref("");
const isProjectsView = ref(false);
const selectedTag = ref("全部");
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

const filteredPosts = computed(() => {
  if (selectedTag.value === "全部") return posts;
  return posts.filter((post) => (post.tags || []).includes(selectedTag.value));
});

const latestPosts = computed(() => filteredPosts.value.slice(0, 10));
const relatedPosts = computed(() => {
  if (!selectedPost.value) return [];
  return posts.filter((post) => post.slug !== selectedPost.value.slug).slice(0, 4);
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
        <div class="masthead-spacer"></div>
      </div>
      <nav class="top-nav">
        <button class="nav-link" :class="{ active: activeNav === 'home' }" @click="openHome">首页</button>
        <button class="nav-link" :class="{ active: activeNav === 'projects' }" @click="openProjects">项目</button>
      </nav>
    </header>

    <main v-if="posts.length > 0" class="page-wrap">
      <section v-if="isProjectsView" class="projects-page">
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
          <p>{{ filteredPosts[0] ? filteredPosts[0].title : "暂无匹配标签的文章" }}</p>
        </div>

        <section class="home-grid">
          <aside class="latest-panel">
            <h3>最近发表</h3>
            <button v-for="post in latestPosts" :key="post.slug" class="latest-item" @click="openPost(post.slug)">
              <p class="latest-title">{{ post.title }}</p>
              <p class="latest-meta">{{ post.date }} · {{ post.wordCount }} 字</p>
            </button>
          </aside>

          <aside class="tag-filter-panel">
            <h3>按标签筛选</h3>
            <p class="filter-count">当前筛选：{{ selectedTag }}（{{ filteredPosts.length }} 篇）</p>
            <div class="tag-filter-list">
              <button
                class="tag-filter-btn"
                :class="{ active: selectedTag === '全部' }"
                @click="selectedTag = '全部'"
              >
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
          </aside>
        </section>

        <section class="card-grid" v-if="filteredPosts.length > 0">
          <article v-for="post in filteredPosts" :key="post.slug" class="news-card" @click="openPost(post.slug)">
            <div class="card-tags" v-if="post.tags && post.tags.length > 0">
              <span class="chip" v-for="tag in post.tags" :key="`${post.slug}-${tag}`">{{ tag }}</span>
            </div>
            <p class="chip" v-else>{{ categoryOf(post) }}</p>
            <h3>{{ post.title }}</h3>
            <p>{{ post.summary }}</p>
            <div class="meta-row">
              <span>{{ post.date }}</span>
              <span>{{ post.wordCount }} 字</span>
            </div>
          </article>
        </section>

        <section v-else class="empty-filter">
          <p>这个标签下还没有文章。</p>
        </section>
      </section>

      <section v-else class="detail-page">
        <article class="article-shell">
          <button class="back-btn" @click="backToList">Back to Newsroom</button>
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
