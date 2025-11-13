import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const articlesAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getBySlug: (slug) => api.get(`/articles/${slug}`),
  getLatest: (limit = 6) => api.get('/articles/latest', { params: { limit } }),
  getFeatured: () => api.get('/articles/featured'),
  getByCategory: (category, params) => api.get(`/articles/category/${category}`, { params }),
  search: (query, params) => api.get('/articles/search', { params: { q: query, ...params } }),
  like: (id) => api.post(`/articles/${id}/like`),
}

export const categoriesAPI = {
  getStats: () => api.get('/articles/stats/categories'),
}

export default api
