// src/services/api.js
import axios from './axios'

// 博客文章相关
export const getAllPosts = () => axios.get('/posts')
export const getPostById = (id) => axios.get(`/posts/${id}`)

// 分类相关
export const getAllCategories = () => axios.get('/categories')
export const getPostsByCategoryId = (id) => axios.get(`/categories/${id}/posts`)

// 评论相关
export const getCommentsByPostId = (id) => axios.get(`/posts/${id}/comments`)
export const postComment = (id, data) => axios.post(`/posts/${id}/comments`, data)

// 站点统计
export const getStats = () => axios.get('/stats')
