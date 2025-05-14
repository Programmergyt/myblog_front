<template>
<!--  <el-card shadow="hover" class="blog-card" @click="$router.push(`/post/${post.id}`)">-->
<!--    <h2>{{ post.title }}</h2>-->
<!--    <p class="summary">{{ post.summary }}</p>-->
<!--    <div class="meta">-->
<!--      <el-tag type="info">{{ post.create_time }}</el-tag>-->
<!--      &lt;!&ndash; 显示分类名 &ndash;&gt;-->
<!--      <el-tag-->
<!--          v-for="tag in post.categoryNames"-->
<!--          :key="tag"-->
<!--          type="success"-->
<!--          class="tag"-->
<!--      >-->
<!--        {{ tag }}-->
<!--      </el-tag>-->
<!--    </div>-->
<!--  </el-card>-->
</template>

<script setup>
// defineProps({
//   post: Object  // post 中包含 title、summary、create_time、categoryNames
// })
</script>

<style scoped>
.blog-card {
  margin-bottom: 20px;
  cursor: pointer;
  min-width: 600px;
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
