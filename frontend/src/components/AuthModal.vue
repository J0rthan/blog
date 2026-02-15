<script setup>
import { reactive, ref } from "vue";
import { login, register } from "../stores/blogStore";

const props = defineProps({
  mode: {
    type: String,
    default: "login"
  }
});

const emit = defineEmits(["close", "change-mode"]);

const authForm = reactive({
  email: "",
  username: "",
  password: ""
});
const authMessage = ref("");

async function submit() {
  if (props.mode === "login") {
    const result = await login(authForm.email, authForm.password);
    authMessage.value = result.message;
    if (result.ok) emit("close");
    return;
  }

  const result = await register(
    authForm.email,
    authForm.password,
    authForm.username
  );
  authMessage.value = result.message;
  if (result.ok) emit("change-mode", "login");
}
</script>

<template>
  <div class="auth-panel-mask" @click.self="emit('close')">
    <section class="auth-panel">
      <div class="auth-tabs">
        <button :class="{ active: mode === 'login' }" @click="emit('change-mode', 'login')">登录</button>
        <button :class="{ active: mode === 'register' }" @click="emit('change-mode', 'register')">注册</button>
      </div>
      <form @submit.prevent="submit">
        <input v-model="authForm.email" type="text" placeholder="邮箱" />
        <input v-if="mode === 'register'" v-model="authForm.username" type="text" placeholder="用户名" />
        <input v-model="authForm.password" type="password" placeholder="密码" />
        <button class="submit-btn" type="submit">{{ mode === "login" ? "登录" : "注册" }}</button>
        <p class="auth-msg" v-if="authMessage">{{ authMessage }}</p>
      </form>
    </section>
  </div>
</template>
