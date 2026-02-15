<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { createPost, deleteCommentById, fetchPostComments, getPost, persistPostCategory, updatePostById } from "../api/posts";
import { fetchPosts, posts } from "../stores/blogStore";

const selectedPostId = ref(null);
const adminMessage = ref("");
const adminError = ref("");
const saving = ref(false);
const creating = ref(false);
const deletingCommentId = ref(null);
const comments = ref([]);

const postForm = reactive({
  title: "",
  summary: "",
  category: "",
  content: "",
});

const selectedPost = computed(() => posts.value.find((item) => Number(item.id) === Number(selectedPostId.value)) || null);

function fillFormByPost(post) {
  postForm.title = post?.title || "";
  postForm.summary = post?.summary || "";
  postForm.category = post?.category || "";
  postForm.content = post?.content || "";
}

function validatePostForm() {
  if (!postForm.title.trim() || !postForm.summary.trim() || !postForm.content.trim() || !postForm.category.trim()) {
    adminError.value = "标题、简介、分类、正文都不能为空";
    return false;
  }
  return true;
}

async function loadPostComments(postId) {
  try {
    const detail = await getPost(postId);
    const remoteComments = await fetchPostComments(postId);
    comments.value = remoteComments.length > 0 ? remoteComments : detail.comments || [];
    if (!postForm.content) {
      postForm.content = detail.content || "";
    }
  } catch (e) {
    comments.value = [];
    adminError.value = e?.message || "评论加载失败";
  }
}

async function selectPost(post) {
  selectedPostId.value = post.id;
  adminMessage.value = "";
  adminError.value = "";
  fillFormByPost(post);
  await loadPostComments(post.id);
}

async function savePost() {
  if (!selectedPostId.value) return;
  if (!validatePostForm()) return;
  saving.value = true;
  adminMessage.value = "";
  adminError.value = "";
  try {
    await updatePostById(selectedPostId.value, {
      title: postForm.title,
      summary: postForm.summary,
      category: postForm.category,
      content: postForm.content,
    });

    const target = selectedPost.value;
    if (target) {
      target.title = postForm.title;
      target.summary = postForm.summary;
      target.category = postForm.category;
      target.content = postForm.content;
      target.words = (postForm.content || "").length;
    }
    persistPostCategory(selectedPostId.value, postForm.category);
    adminMessage.value = "文章已保存";
  } catch (e) {
    adminError.value = e?.response?.data?.message || e?.message || "文章保存失败";
  } finally {
    saving.value = false;
  }
}

async function createNewPost() {
  if (!validatePostForm()) return;
  creating.value = true;
  adminMessage.value = "";
  adminError.value = "";
  try {
    const created = await createPost({
      title: postForm.title,
      summary: postForm.summary,
      category: postForm.category,
      content: postForm.content,
    });
    if (created?.id) {
      persistPostCategory(created.id, postForm.category);
    }
    adminMessage.value = "新文章已发布";
    await fetchPosts();

    const createdId = created?.id;
    if (createdId) {
      const post = posts.value.find((item) => Number(item.id) === Number(createdId));
      if (post) await selectPost(post);
    }
  } catch (e) {
    adminError.value = e?.response?.data?.message || e?.message || "发布文章失败";
  } finally {
    creating.value = false;
  }
}

async function removeComment(comment) {
  if (!selectedPostId.value) return;
  const commentId = comment?.commentId ?? comment?.id;
  if (!commentId) {
    adminError.value = "评论ID缺失，无法删除";
    return;
  }
  deletingCommentId.value = commentId;
  adminMessage.value = "";
  adminError.value = "";
  try {
    await deleteCommentById(selectedPostId.value, commentId);
    comments.value = comments.value.filter(
      (item) => String(item.commentId ?? item.id) !== String(commentId)
    );
    const target = selectedPost.value;
    if (target?.comments) {
      target.comments = target.comments.filter(
        (item) => String(item.commentId ?? item.id) !== String(commentId)
      );
    }
    adminMessage.value = "评论已删除";
  } catch (e) {
    adminError.value = e?.response?.data?.message || e?.message || "评论删除失败";
  } finally {
    deletingCommentId.value = null;
  }
}

onMounted(async () => {
  if (!posts.value.length) {
    await fetchPosts();
  }
  if (posts.value.length) {
    await selectPost(posts.value[0]);
  }
});
</script>

<template>
  <section class="simple-card admin-wrap">
    <h2>作者后台</h2>
    <p class="admin-tip">你可以在这里发布文章、修改文章、删除评论。</p>

    <div class="admin-grid">
      <aside class="admin-posts">
        <h3>文章列表</h3>
        <button
          v-for="post in posts"
          :key="post.id"
          class="admin-post-item"
          :class="{ active: Number(selectedPostId) === Number(post.id) }"
          @click="selectPost(post)"
        >
          {{ post.title }}
        </button>
      </aside>

      <section class="admin-editor">
        <h3>{{ selectedPostId ? "编辑文章" : "发布文章" }}</h3>
        <input v-model="postForm.title" type="text" placeholder="标题" />
        <textarea v-model="postForm.summary" rows="3" placeholder="简介"></textarea>
        <input v-model="postForm.category" type="text" placeholder="分类" />
        <textarea v-model="postForm.content" rows="9" placeholder="正文"></textarea>
        <div class="admin-actions-row">
          <button class="submit-btn" :disabled="!selectedPostId || saving || creating" @click="savePost">
            {{ saving ? "保存中..." : "保存修改" }}
          </button>
          <button class="bar-btn" :disabled="saving || creating" @click="createNewPost">
            {{ creating ? "发布中..." : "发布新文章" }}
          </button>
        </div>

        <h3>评论管理</h3>
        <ul class="comment-list">
          <li v-for="comment in comments" :key="comment.id" class="comment-item admin-comment-item">
            <div class="comment-meta">
              <strong>{{ comment.author || comment.userName || comment.username || "用户" }}</strong>
              <span>{{ comment.time }}</span>
            </div>
            <p>{{ comment.text }}</p>
            <button
              class="bar-btn"
              :disabled="String(deletingCommentId) === String(comment.commentId ?? comment.id)"
              @click="removeComment(comment)"
            >
              删除评论
            </button>
          </li>
          <li v-if="comments.length === 0" class="empty-comment">暂无评论</li>
        </ul>
      </section>
    </div>

    <p v-if="adminMessage" class="admin-msg ok">{{ adminMessage }}</p>
    <p v-if="adminError" class="admin-msg err">{{ adminError }}</p>
  </section>
</template>
