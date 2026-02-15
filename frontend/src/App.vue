<script setup>
import { onMounted, ref } from "vue";
import TopBar from "./components/TopBar.vue";
import AuthModal from "./components/AuthModal.vue";
import HomeView from "./views/HomeView.vue";
import PostDetailView from "./views/PostDetailView.vue";
import ProjectView from "./views/ProjectView.vue";
import AdminView from "./views/AdminView.vue";
import { isAuthor, restoreSession } from "./stores/blogStore";

const showAuthPanel = ref(false);
const authMode = ref("login");
const activeView = ref("home");
const selectedPostId = ref(1);

function openAuth(mode) {
  authMode.value = mode;
  showAuthPanel.value = true;
}

function navigate(view) {
  if (view === "admin" && !isAuthor.value) return;
  activeView.value = view;
}

function openPost(postId) {
  selectedPostId.value = postId;
  activeView.value = "detail";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToHome() {
  activeView.value = "home";
}

onMounted(() => {
  restoreSession();
});
</script>

<template>
  <div class="page">
    <TopBar :active-view="activeView" @open-auth="openAuth" @navigate="navigate" />
    <main class="container">
      <HomeView v-if="activeView === 'home'" @open-post="openPost" />
      <PostDetailView v-else-if="activeView === 'detail'" :post-id="selectedPostId" @back="backToHome" />
      <ProjectView v-else-if="activeView === 'project'" />
      <AdminView v-else-if="activeView === 'admin'" />
    </main>

    <AuthModal
      v-if="showAuthPanel"
      :mode="authMode"
      @close="showAuthPanel = false"
      @change-mode="authMode = $event"
    />
  </div>
</template>
