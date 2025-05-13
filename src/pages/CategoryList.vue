// src/views/CategoryList.vue
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
import {ref, onMounted, watch} from 'vue'
import {useRoute} from 'vue-router'
import BlogCard from '@/components/BlogCard.vue'
import {getPostsByCategoryId, getAllCategories} from '@/services/api.js'

const posts = ref([])
const currentCategoryName = ref('')
const categoriesMap = ref({})

const route = useRoute()

// 将数据加载逻辑提取为函数
const loadData = async (categoryId) => {
  try {
    const [postRes, categoryRes] = await Promise.all([
      getPostsByCategoryId(categoryId),
      getAllCategories()
    ])

    categoriesMap.value = categoryRes.reduce((map, cat) => {
      map[cat.id] = cat.name
      return map
    }, {})

    currentCategoryName.value = categoriesMap.value[categoryId] || '未知分类'

    posts.value = postRes.map(post => ({
      ...post,
      categoryNames: post.categories.map(id => categoriesMap.value[id] || '未知')
    }))
  } catch (e) {
    console.error('加载分类文章失败', e)
  }
}

// 初始加载
onMounted(() => {
  const categoryId = route.params.categoryId
  loadData(categoryId)
})

// 路由变化时重新加载
watch(() => route.params.categoryId, (newId) => {
  loadData(newId)
})

</script>

<style scoped>
.common-layout {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
</style>