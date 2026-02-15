<script setup>
import { computed, ref, watch } from "vue";
import { fetchPostComments, getPost } from "../api/posts";
import { activeUser, addComment, getPostById } from "../stores/blogStore";

const props = defineProps({
  postId: {
    type: Number,
    required: true
  }
});
const emit = defineEmits(["back"]);
const commentText = ref("");
const detailPost = ref(null);
const detailLoading = ref(false);
const detailError = ref("");

const post = computed(() => detailPost.value || getPostById(props.postId));

async function loadDetail() {
  detailLoading.value = true;
  detailError.value = "";
  try {
    const localPost = getPostById(props.postId);
    const localComments = localPost?.comments || detailPost.value?.comments || [];
    const [detail, remoteComments] = await Promise.all([
      getPost(props.postId),
      fetchPostComments(props.postId),
    ]);
    detailPost.value = {
      ...detail,
      comments:
        remoteComments.length > 0
          ? remoteComments
          : (detail.comments && detail.comments.length > 0)
            ? detail.comments
            : localComments,
    };
  } catch (e) {
    detailError.value = e?.response?.data?.message || e?.message || "加载文章详情失败";
    detailPost.value = null;
  } finally {
    detailLoading.value = false;
  }
}

watch(
  () => props.postId,
  () => {
    detailPost.value = null;
    loadDetail();
  },
  { immediate: true }
);

async function submitComment() {
  if (!post.value) return;
  const ok = await addComment(post.value.id, commentText.value);
  if (ok) {
    commentText.value = "";
    await loadDetail();
  }
}
</script>

<template>
  <section class="simple-card" v-if="detailLoading">
    <h2>加载中...</h2>
  </section>
  <section class="simple-card" v-else-if="detailError">
    <h2>加载失败</h2>
    <p>{{ detailError }}</p>
    <button class="back-btn" @click="emit('back')">返回首页</button>
  </section>
  <section class="post-detail" v-if="post">
    <div class="detail-top">
      <button class="back-btn" @click="emit('back')">← 返回文章列表</button>
    </div>
    <h2>{{ post.title }}</h2>
    <p class="detail-meta">{{ post.date }} · {{ post.words }} 字 · {{ post.category }}</p>
    <div class="tag-row">
      <span v-for="tag in post.tags" :key="tag"># {{ tag }}</span>
    </div>
    <p class="detail-content">{{ post.content }}</p>

    <div class="comment-box">
      <h3>评论区</h3>
      <p class="comment-tip" v-if="!activeUser">登录后可发表评论，当前可浏览全部评论。</p>
      <div class="comment-input">
        <textarea v-model="commentText" rows="3" placeholder="写下你的评论..." :disabled="!activeUser"></textarea>
        <button class="submit-btn" :disabled="!activeUser" @click="submitComment">发布评论</button>
      </div>
      <ul class="comment-list">
        <li v-for="comment in post.comments || []" :key="comment.id" class="comment-item">
          <div class="comment-meta">
            <strong>{{ comment.author || comment.userName || comment.username || comment.email || "用户" }}</strong>
            <span>{{ comment.time }}</span>
          </div>
          <p>{{ comment.text }}</p>
        </li>
        <li v-if="(post.comments || []).length === 0" class="empty-comment">暂无评论</li>
      </ul>
    </div>
  </section>
  <section class="simple-card" v-else>
    <h2>文章不存在</h2>
    <button class="back-btn" @click="emit('back')">返回首页</button>
  </section>
</template>
