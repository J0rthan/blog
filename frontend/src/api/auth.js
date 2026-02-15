import { http } from './http'

export async function loginApi(email, password) {
  const res = await http.post('/auth/login', { email, password })
  return res.data
}

export async function registerApi(email, password, userName) {
  const res = await http.post('/auth/register', { email, password, userName })
  return res.data
}

export async function meApi() {
  const res = await http.get('/auth/me')
  return res.data
}
