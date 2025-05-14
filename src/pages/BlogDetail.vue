<template>
  <div>
<!--    <el-row :gutter="20">-->
<!--      <el-col :span="24">-->
<!--        <BlogCard :post="post" />-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    &lt;!&ndash; 渲染 Markdown &ndash;&gt;-->
<!--    <div v-html="renderedContent" class="markdown-body"></div>-->
<!--    &lt;!&ndash; 评论区 &ndash;&gt;-->
<!--    <el-card>-->
<!--      <CommentSection :postId="post.id" />-->
<!--    </el-card>-->
  </div>
</template>

<script setup>
// import { ref, onMounted } from 'vue'
// import { useRoute } from 'vue-router'
// import { getPostById, getAllCategories } from '@/services/api.js'
// import BlogCard from '@/components/BlogCard.vue'
// import CommentSection from '@/components/CommentSection.vue' // 引入评论区组件
// import MarkdownIt from 'markdown-it'
//
// const post = ref({})
// const renderedContent = ref('')
// const categoriesMap = ref({})  // id -> name 映射
//
// const route = useRoute()
// const postId = parseInt(route.params.postId)
//
// onMounted(async () => {
//   try {
//     const [postRes, categoryRes] = await Promise.all([
//       getPostById(postId),
//       getAllCategories()
//     ])
//
//     // 构建 id -> name 映射
//     categoriesMap.value = categoryRes.reduce((map, cat) => {
//       map[cat.id] = cat.name
//       return map
//     }, {})
//
//     // 替换 post 的 category id 为对应的名称
//     post.value = {
//       ...postRes,
//       categoryNames: postRes.categories.map(id => categoriesMap.value[id] || '未知')
//     }
//
//     // 使用 marked 渲染 markdown 为 HTML
//     const md = new MarkdownIt({
//       html: true,
//       linkify: true,
//     })
//     renderedContent.value = md.render(post.value.content || '')
//   } catch (e) {
//     console.error('加载文章详情失败', e)
//   }
// })
</script>