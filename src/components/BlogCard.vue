<template>
  <el-card
      shadow="hover"
      class="blog-card"
      @click="router.push(`/post/${post.id}`)"
  >
    <h2>{{ post.title }}</h2>
    <div class="meta">
      <el-tag type="info">{{ post.createTime }}</el-tag>
      <el-tag
          v-for="tag in post.categoryNames"
          :key="tag"
          type="success"
          class="tag"
      >
        {{ tag }}
      </el-tag>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
defineProps({
  post: Object,  // post 中包含 title、summary、create_time、categoryNames
})
</script>

<style scoped>
.blog-card {
  margin-bottom: 20px;
  cursor: pointer;
  min-width: 600px;
  width: 50%;
}
.summary {
  margin: 10px 0;
  color: #666;
}
.meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.tag {
  margin-top: 5px;
}
</style>
