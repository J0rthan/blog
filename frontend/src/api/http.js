import axios from 'axios'

const TOKEN_EXPIRES_AT_KEY = 'token_expires_at'

export const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const expiresAt = Number(localStorage.getItem(TOKEN_EXPIRES_AT_KEY) || 0)
  if (expiresAt && Date.now() > expiresAt) {
    localStorage.removeItem('token')
    localStorage.removeItem('identity')
    localStorage.removeItem(TOKEN_EXPIRES_AT_KEY)
  }
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    // 401 统一处理：清 token、跳登录页等
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      // 可选：window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
