<template>
  <div class="common-layout">
      <h2 style="font-size: 40px;">{{ currentCategoryName }}</h2>
      <el-row :gutter="20" v-if="posts.length">
        <el-col :span="24" v-for="post in posts" :key="post.id">
          <BlogCard :post="post" />
        </el-col>
      </el-row>
      <el-empty v-else description="该分类下暂无文章" :description-style="{ fontSize: '20px' }" />
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import BlogCard from '@/components/BlogCard.vue'
import {getPostsByCategoryId, getAllCategories} from '@/services/api'

const posts = ref([])
const currentCategoryName = ref('')
const categoriesMap = ref({})

const route = useRoute()
const categoryId = parseInt(route.params.categoryId)

onMounted(async () => {
  try {
    // 同时获取文章列表和所有分类
    const [postRes, categoryRes] = await Promise.all([
      getPostsByCategoryId(categoryId),
      getAllCategories()
    ])

    // 构建 id -> name 映射表
    categoriesMap.value = categoryRes.reduce((map, cat) => {
      map[cat.id] = cat.name
      return map
    }, {})

    // 设置当前分类名
    currentCategoryName.value = categoriesMap.value[categoryId] || '未知分类'

    // 将每篇文章中的 category ID 转换为分类名
    posts.value = postRes.map(post => ({
      ...post,
      categoryNames: post.categories.map(id => categoriesMap.value[id] || '未知')
    }))
  } catch (e) {
    console.error('加载分类文章失败', e)
  }
})
</script>

<style scoped>
.common-layout {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
</style>