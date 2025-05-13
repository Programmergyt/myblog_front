<template>
  <el-card class="register-card">
    <h2>注册</h2>
    <el-form :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="form.confirmPassword" type="password" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="customUpload"
            name="file"
        >
          <el-avatar :src="form.avatar || defaultAvatar" class="avatar" />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleRegister">注册</el-button>
        <el-button @click="goToLogin">去登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { uploadAvatar } from '@/services/api'

const router = useRouter()

const defaultAvatar = "/images/personal_icon.jpg"

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  avatar: ''
})

function handleUploadSuccess(response) {
  form.avatar = response.url
}

async function handleRegister() {
  if (form.password !== form.confirmPassword) {
    ElMessage.warning('两次密码不一致')
    return
  }
  try {
    const { confirmPassword, ...user } = form
    await axios.post('/api/auth/register', user)
    ElMessage.success('注册成功，请登录')
    await router.push('/login')
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '注册失败')
  }
}

// 自定义上传逻辑
const customUpload = async (options) => {
  const formData = new FormData()
  formData.append('file', options.file)

  try {
    const res = await uploadAvatar(formData)
    handleUploadSuccess(res)
  } catch (err) {
    ElMessage.error('头像上传失败')
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<style scoped>
.register-card {
  width: 500px;
  margin: 80px auto;
}
.avatar {
  width: 80px;
  height: 80px;
  cursor: pointer;
}
</style>
