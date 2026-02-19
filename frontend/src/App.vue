<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { getAllPosts } from "./lib/posts";

const posts = getAllPosts();
const selectedSlug = ref("");

const selectedPost = computed(() => {
  if (selectedSlug.value) {
    return posts.find((post) => post.slug === selectedSlug.value) || null;
  }
  return posts[0] || null;
});

function openPost(slug) {
  selectedSlug.value = slug;
  window.location.hash = `#/post/${slug}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToList() {
  selectedSlug.value = "";
  window.location.hash = "#/";
}

function syncFromHash() {
  const match = window.location.hash.match(/^#\/post\/([a-z0-9-]+)$/i);
  if (!match) {
    selectedSlug.value = "";
    return;
  }

  const slug = match[1];
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
  <div class="layout">
    <header class="hero">
      <p class="eyebrow">Markdown Blog</p>
      <h1>我的博客</h1>
      <p>不需要登录注册。只要把新文章 `.md` 文件放进 `frontend/src/content/posts/`，重新部署就会自动发布。</p>
    </header>

    <main class="container" v-if="posts.length > 0">
      <section class="post-list" :class="{ compact: !!selectedPost }">
        <article
          v-for="post in posts"
          :key="post.slug"
          class="post-card"
          :class="{ active: selectedPost && selectedPost.slug === post.slug }"
          @click="openPost(post.slug)"
        >
          <h2>{{ post.title }}</h2>
          <p>{{ post.summary }}</p>
          <div class="post-meta">
            <span>{{ post.date }}</span>
            <span>{{ post.wordCount }} 字</span>
            <span>{{ post.readingMinutes }} 分钟阅读</span>
          </div>
          <div class="tag-row" v-if="post.tags.length > 0">
            <span v-for="tag in post.tags" :key="tag">#{{ tag }}</span>
          </div>
        </article>
      </section>

      <section class="post-detail" v-if="selectedPost">
        <button class="back-btn" @click="backToList">返回文章列表</button>
        <h2>{{ selectedPost.title }}</h2>
        <div class="detail-meta">
          <span>{{ selectedPost.date }}</span>
          <span>{{ selectedPost.wordCount }} 字</span>
          <span>{{ selectedPost.readingMinutes }} 分钟阅读</span>
        </div>
        <div class="markdown-body" v-html="selectedPost.html"></div>
      </section>
    </main>

    <section v-else class="empty-state">
      <h2>还没有文章</h2>
      <p>在 `frontend/src/content/posts/` 下添加第一篇 Markdown 文件即可。</p>
    </section>
  </div>
</template>
