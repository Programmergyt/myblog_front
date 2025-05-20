<template>
    <h3>评论区</h3>
    <el-form @submit.prevent="handleSubmit">
      <el-form-item label="昵称">
        <el-input v-model="nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="评论内容">
        <el-input
          v-model="content"
          type="textarea"
          :rows="4"
          placeholder="请输入评论内容"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">提交评论</el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <div v-if="comments.length">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="nickname">{{ comment.nickname }}</span>
          <span class="create-time">{{ comment.create_time }}</span>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
      </div>
    </div>
    <el-empty v-else description="暂无评论" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getCommentsByPostId, postComment } from '@/services/api'
import {useRoute} from "vue-router";

const route = useRoute()
const postId = route.params.postId
const comments = ref([])
const nickname = ref('')
const content = ref('')

// 拉取评论的函数
const loadData = async () => {
  try {
    const res = await getCommentsByPostId(postId)
    comments.value = res
  } catch (e) {
    console.error('获取评论失败', e)
  }
}

// 一开始就拉取评论
onMounted(loadData)

// 监听 postId 的变化，重新获取评论
watch(() => postId, loadData)

// 提交评论
const handleSubmit = async () => {
  if (!nickname.value || !content.value) {
    alert('昵称和评论内容不能为空')
    return
  }

  try {
    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    console.log(formattedTime)
    await postComment(props.postId, {
      nickname: nickname.value,
      content: content.value,
      create_time: formattedTime
    })
    // 重新获取评论列表
    await loadData()
    // 清空表单
    nickname.value = ''
    content.value = ''
  } catch (e) {
    console.error('提交评论失败', e)
  }
}

</script>

<style scoped>

.comment-item {
  margin-bottom: 20px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.nickname {
  font-weight: bold;
}

.create-time {
  color: #999;
}

.comment-content {
  color: #333;
}
</style>