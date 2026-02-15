import { http } from './http'
const CATEGORY_CACHE_KEY = 'post_category_cache_v1'

function readCategoryCache() {
  try {
    return JSON.parse(localStorage.getItem(CATEGORY_CACHE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeCategoryCache(cache) {
  localStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(cache))
}

function getCachedCategory(postId) {
  if (postId === undefined || postId === null) return ''
  const cache = readCategoryCache()
  return cache[String(postId)] || ''
}

export function persistPostCategory(postId, category) {
  if (postId === undefined || postId === null) return
  const value = String(category || '').trim()
  if (!value) return
  const cache = readCategoryCache()
  cache[String(postId)] = value
  writeCategoryCache(cache)
}

function formatDateTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('zh-CN', { hour12: false })
}

function countWords(text) {
  if (!text) return 0
  return String(text).length
}

function normalizePostSummary(raw) {
  const content = raw?.content || ''
  const fallbackCategory = getCachedCategory(raw?.id)
  return {
    id: raw.id,
    authorName: raw.authorName,
    title: raw.title || '未命名文章',
    summary: raw.summary || '',
    content,
    exist: raw.exist,
    createdAt: raw.createdAt,
    modifiedAt: raw.modifiedAt,
    date: formatDateTime(raw.createdAt),
    words: countWords(content),
    category: raw?.category || fallbackCategory || '未分类',
    tags: [],
    comments: [],
  }
}

function normalizeComments(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map((item, idx) => ({
    id: item?.id ?? item?.commentId ?? `${Date.now()}-${idx}`,
    commentId: item?.commentId ?? item?.id ?? null,
    postId: item?.postId ?? item?.articleId ?? null,
    author:
      item?.author ||
      item?.authorName ||
      item?.userName ||
      item?.username ||
      item?.nickname ||
      item?.commenterName ||
      item?.creatorName ||
      item?.createdByName ||
      item?.user?.userName ||
      item?.user?.username ||
      item?.user?.nickname ||
      item?.author?.userName ||
      item?.author?.username ||
      item?.author?.nickname ||
      '',
    text: item?.text || item?.content || item?.comment || item?.body || '',
    time: formatDateTime(item?.createdAt || item?.time || item?.modifiedAt),
  }))
}

function normalizePostDetail(raw) {
  const content = raw?.content || raw?.body || ''
  const fallbackCategory = getCachedCategory(raw?.id)
  const rawComments =
    raw?.comments ||
    raw?.commentList ||
    raw?.commentResponses ||
    raw?.postComments ||
    raw?.commentVOList ||
    []
  return {
    id: raw?.id,
    authorName: raw?.authorName || '',
    title: raw?.title || '未命名文章',
    summary: raw?.summary || '',
    content,
    exist: raw?.exist ?? true,
    createdAt: raw?.createdAt,
    modifiedAt: raw?.modifiedAt,
    date: formatDateTime(raw?.createdAt),
    words: countWords(content),
    category: raw?.category || fallbackCategory || '未分类',
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
    comments: normalizeComments(rawComments),
  }
}

function unwrapResponseData(raw) {
  return raw?.data ?? raw?.result ?? raw ?? {}
}

export async function listPosts(params = { page: 0, size: 10 }) {
  const res = await http.get('/post/list', { params })
  const page = res.data || {}
  const content = Array.isArray(page.content) ? page.content : []

  return {
    ...page,
    content: content.map(normalizePostSummary),
  }
}

export async function getPost(id) {
  const res = await http.get(`/post/read/${id}`)
  return normalizePostDetail(unwrapResponseData(res.data))
}

export async function addPostComment(postId, text) {
  const res = await http.post(`/comment/submit/${postId}`, { text, content: text })
  return unwrapResponseData(res.data)
}

export async function fetchPostComments(postId) {
  const attempts = [
    () => http.get(`/comment/list/${postId}`),
    () => http.get(`/comment/post/${postId}`),
    () => http.get(`/comment/of-post/${postId}`),
    () => http.get('/comment/list', { params: { postId } }),
    () => http.get(`/post/${postId}/comments`),
  ]

  for (const run of attempts) {
    try {
      const res = await run()
      const payload = unwrapResponseData(res.data)
      const list = Array.isArray(payload)
        ? payload
        : payload?.content || payload?.comments || payload?.commentList || payload?.commentResponses || []
      return normalizeComments(list)
    } catch {
      // try next candidate endpoint
    }
  }

  return []
}

export async function updatePostById(postId, payload) {
  const attempts = [
    () => http.put(`/post/update/${postId}`, payload),
    () => http.post(`/post/update/${postId}`, payload),
    () => http.put(`/post/${postId}`, payload),
    () => http.patch(`/post/${postId}`, payload),
  ]

  for (const run of attempts) {
    try {
      const res = await run()
      return unwrapResponseData(res.data)
    } catch {
      // try next candidate endpoint
    }
  }

  throw new Error('文章更新接口未命中，请确认后端路由')
}

export async function createPost(payload) {
  const attempts = [
    () => http.post('/post/submit', payload),
    () => http.post('/post/create', payload),
    () => http.post('/post/add', payload),
  ]

  for (const run of attempts) {
    try {
      const res = await run()
      return unwrapResponseData(res.data)
    } catch {
      // try next candidate endpoint
    }
  }

  throw new Error('文章发布接口未命中，请确认后端路由')
}

export async function deleteCommentById(postId, commentId) {
  const attempts = [
    () => http.post(`/comment/delete/${postId}/${commentId}`),
  ]

  for (const run of attempts) {
    try {
      await run()
      return true
    } catch {
      // try next candidate endpoint
    }
  }

  throw new Error('评论删除失败，请检查是否为作者身份或 commentId 是否正确')
}
