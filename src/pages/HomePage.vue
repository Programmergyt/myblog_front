<template>
  <div>
    <el-row :gutter="20" v-if="posts.length">
      <el-col :span="24" v-for="post in posts" :key="post.id">
        <BlogCard :post="post" />
      </el-col>
    </el-row>
    <el-empty description="暂无文章" v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BlogCard from '@/components/BlogCard.vue'
import { getAllPosts, getAllCategories } from '@/services/api'

// ref 是用来声明响应式数据的函数。ref 会把一个普通的变量，变成可以被 Vue 自动追踪变化的变量。
const posts = ref([])
const categoriesMap = ref({})  // id -> name 映射

onMounted(async () => {
  try {
    const [postRes, categoryRes] = await Promise.all([
      getAllPosts(),
      getAllCategories()
    ])

    // 构建 id -> name 映射
    categoriesMap.value = categoryRes.reduce((map, cat) => {
      map[cat.id] = cat.name
      return map
    }, {})

    // 替换每篇 post 的 category id 为对应的名称
    posts.value = postRes.map(post => ({
      ...post,
      categoryNames: post.categories.map(id => categoriesMap.value[id] || '未知')
    }))
  } catch (e) {
    console.error('加载首页数据失败', e)
  }
})
</script>

