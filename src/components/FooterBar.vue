<template>
  <el-footer class="footer">
    <div class="footer-text">
      备案号：京ICP备12345678号｜运行时间：{{ uptime }}｜
      文章数：{{ stats.totalPosts }}｜总字数：{{ stats.totalWords }}｜
      访问人数：{{ stats.uniqueVisitors }}｜总访问量：{{ stats.totalViews }}
    </div>
  </el-footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStats } from '../services/api'

const stats = ref({
  totalPosts: 0,
  totalWords: 0,
  uniqueVisitors: 0,
  totalViews: 0
})

const uptime = ref('0天 0小时 0分钟')

const updateUptime = (uptimeSeconds) => {
  const minutes = Math.floor(uptimeSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  uptime.value = `${days}天 ${hours % 24}小时 ${minutes % 60}分钟`
}

onMounted(async () => {
  try {
    const response = await getStats()
    console.log('获取统计信息成功', response.data)
    stats.value = {
      totalPosts: response.data.data.total_posts,
      totalWords: response.data.data.total_words,
      uniqueVisitors: response.data.data.unique_visitors,
      totalViews: response.data.data.total_views
    }
    updateUptime(response.data.data.uptime_seconds)
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
})
</script>

<style scoped>
.footer {
  background: #f5f5f5;
  text-align: center;
  padding: 15px 0;
  font-size: 14px;
  color: #666;
}
</style>