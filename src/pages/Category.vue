<template>
<!--  <el-card  class="category-card">-->
<!--    <h2 style="font-size: 40px;">文章分类</h2>-->
<!--    <el-space>-->
<!--      <el-tag-->
<!--          v-for="category in categories"-->
<!--          :key="category.id"-->
<!--          type="success"-->
<!--          effect="dark"-->
<!--          size="large"-->
<!--          @click="goToCategory(category.id)"-->
<!--          style="cursor: pointer; font-size: 20px; padding: 10px;"-->
<!--      >-->
<!--        {{ category.name }}-->
<!--      </el-tag>-->
<!--    </el-space>-->
<!--  </el-card>-->
</template>

<script setup>
// import { ref, onMounted } from 'vue'
// import { useRouter } from 'vue-router'
// import { getAllCategories } from '@/services/api.js'
//
// const categories = ref([])
// const router = useRouter()
//
// const goToCategory = (id) => {
//   router.push(`/category/${id}`)
// }
//
// onMounted(async () => {
//   try {
//     const res = await getAllCategories()
//     categories.value = res
//   } catch (e) {
//     console.error('获取分类失败', e)
//   }
// })
</script>

<style scoped>
.category-card {
  max-width: 1000px;
  margin: 50px auto;
  padding: 60px;
  min-width: 800px;
}
</style>