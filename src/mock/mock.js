// src/mock/mock.js
import MockAdapter from 'axios-mock-adapter'
import axios from '../services/axios'
import Mock from 'mockjs'

// （注意mock拦的是去掉 axios的`/api` 前缀后的路径）
// 创建 Mock 实例
const mock = new MockAdapter(axios, { delayResponse: 300 })

// 模拟数据
const categories = [
    { id: 1, name: 'Vue' },
    { id: 2, name: 'Java' },
    { id: 3, name: '生活' },
    { id: 4, name: '随笔' }
]

const posts = [
    {
        id: 1,
        title: 'Vue3 快速上手',
        summary: '介绍 Vue3 的基本使用方法。',
        content: `
# Vue3 快速上手指南

欢迎来到我的博客！这是第一篇 Vue3 教程内容。

![Vue Logo](/images/pic1.png)

## 特性介绍
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const increment = () => count.value++
    return { count, increment }
  }
}
- Composition API
- Teleport
- Suspense

感谢阅读！
## 示例代码
![代码截图](/images/pic2.png)
    `.trim(),
        create_time: '2025-04-18',
        categories: [1,2]
    },
    {
        id: 2,
        title: 'Spring Boot 构建 REST API',
        summary: 'Spring Boot 开发实战教程。',
        content: '完整内容：Spring Boot 是...',
        create_time: '2025-04-17',
        categories: [2,3]
    },
    {
        id: 3,
        title: '牛马',
        summary: '牛马博客搭建教程',
        content: '牛马博客是个狗子',
        create_time: '2025-04-19',
        categories: [3,4]
    }
]

const comments = {
    1: [
        { id: 1, post_id: 1, nickname: 'Tom', content: '写得太棒了！', create_time: '2025-04-18 10:00' }
    ],
    2: [
        { id: 2, post_id: 2, nickname: 'Jack', content: '写得太操蛋棒了！', create_time: '2025-04-19 10:00' }
    ],
    3: [
        { id: 3, post_id: 3, nickname: 'Jerry', content: '写得太他妈棒了！', create_time: '2025-04-20 10:00' }
    ]
}

const stats = {
    total_posts: posts.length,
    total_words: posts.reduce((sum, p) => sum + p.content.length, 0),
    unique_visitors: 1234,
    total_views: 5678,
    uptime_seconds: 123456
}

// 接口模拟
mock.onGet('/stats').reply(200, {
    data: stats // 将 stats 对象包装在 data 字段中，以符合 axios 的响应结构
})

mock.onGet('/posts').reply(200, posts)

mock.onGet(/\/posts\/\d+$/).reply(config => {
    const id = parseInt(config.url.split('/').pop())
    const post = posts.find(p => p.id === id)
    return post ? [200, post] : [404]
})

mock.onGet('/categories').reply(200, categories)

mock.onGet(/\/categories\/\d+\/posts/).reply(config => {
    const id = parseInt(config.url.split('/')[2])
    const result = posts.filter(post => post.categories.includes(id))
    return [200, result]
})

mock.onGet(/\/posts\/\d+\/comments/).reply(config => {
    const postId = parseInt(config.url.split('/')[2])
    return [200, comments[postId] || []]
})

mock.onPost(/\/posts\/\d+\/comments/).reply(config => {
    const postId = parseInt(config.url.split('/')[2])
    const { nickname, content, create_time } = JSON.parse(config.data)
    const newComment = {
        id: Date.now(),
        post_id: postId,
        nickname,
        content,
        create_time: create_time || new Date().toISOString() // 使用传入的时间或默认时间
    }
    if (!comments[postId]) comments[postId] = []
    comments[postId].push(newComment)
    return [200, { success: true, comment: newComment }] // 返回新评论数据
})

mock.onPost('/api/upload/avatar').reply(config => {
    return [
        200,
        {
            url: "/good.png"
        }
    ]
})
