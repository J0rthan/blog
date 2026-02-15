<script setup>
import { computed } from "vue";
import { activeUser, isAuthor, logout, searchKey } from "../stores/blogStore";

const props = defineProps({
  activeView: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["open-auth", "navigate"]);
const showSearch = computed(() => props.activeView === "home");
const displayName = computed(
  () => activeUser.value?.nickname || activeUser.value?.username || activeUser.value?.email || "已登录用户"
);
const canOpenAdmin = computed(() => isAuthor.value);
</script>

<template>
  <header class="top-bar">
    <nav class="nav-pill">
      <button class="nav-link" :class="{ active: activeView === 'home' }" @click="emit('navigate', 'home')">
        首页
      </button>
      <button class="nav-link" :class="{ active: activeView === 'project' }" @click="emit('navigate', 'project')">
        项目
      </button>
      <button
        v-if="canOpenAdmin"
        class="nav-link"
        :class="{ active: activeView === 'admin' }"
        @click="emit('navigate', 'admin')"
      >
        作者后台
      </button>
    </nav>

    <div class="bar-actions">
      <div class="search-wrap" v-if="showSearch">
        <input v-model="searchKey" type="text" placeholder="搜索文章标题/简介" />
      </div>
      <div v-if="activeUser" class="user-box">
        <span>{{ displayName }}</span>
        <button class="bar-btn" @click="logout">退出</button>
      </div>
      <div v-else class="auth-actions">
        <button class="bar-btn" @click="emit('open-auth', 'login')">登录</button>
        <button class="bar-btn main" @click="emit('open-auth', 'register')">注册</button>
      </div>
    </div>
  </header>
</template>
