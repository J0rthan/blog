<script setup>
import { onMounted } from "vue";
import {
  availableTags,
  errorMsg,
  fetchPosts,
  filteredPosts,
  loading,
  selectedTags,
  toggleTag,
} from "../stores/blogStore";

const emit = defineEmits(["open-post"]);

onMounted(() => {
  fetchPosts();
});

function openPost(id) {
  emit("open-post", id);
}
</script>

<template>
  <section class="article-list list-only article-layout">
    <aside class="tag-panel">
      <div class="tag-panel-head">
        <h3>标签筛选</h3>
      </div>
      <p v-if="availableTags.length === 0" class="empty-comment">暂无可筛选标签</p>
      <label v-for="tag in availableTags" :key="tag" class="tag-check">
        <input
          type="checkbox"
          :checked="selectedTags.includes(tag)"
          @change="toggleTag(tag)"
        />
        <span>{{ tag }}</span>
      </label>
    </aside>

    <div>
      <h2>文章列表</h2>
      <p v-if="loading">正在加载文章...</p>
      <p v-else-if="errorMsg">{{ errorMsg }}</p>
      <div class="post-grid">
        <button v-for="post in filteredPosts" :key="post.id" class="post-card" @click="openPost(post.id)">
          <h3>{{ post.title }}</h3>
          <p>{{ post.summary }}</p>
          <div class="post-meta">
            <span>{{ post.date }}</span>
            <span>{{ post.words }} 字</span>
            <span>{{ post.category }}</span>
          </div>
          <div class="tag-row">
            <span v-for="tag in (post.tags?.length ? post.tags : [post.category])" :key="tag"># {{ tag }}</span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>
