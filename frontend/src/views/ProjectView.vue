<script setup>
import { projects } from "../stores/blogStore";

function openRepo(url) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}
</script>

<template>
  <section class="simple-card">
    <h2>项目</h2>
    <ul class="project-list">
      <li
        v-for="project in projects"
        :key="project.id"
        class="project-card"
        @click="openRepo(project.url)"
      >
        <strong>{{ project.name }}</strong>
        <p>{{ project.desc }}</p>
      </li>
    </ul>
  </section>
</template>
