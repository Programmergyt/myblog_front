<template>
  <el-card class="login-card">
    <h2>登录</h2>
    <el-form :model="form" label-width="70px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" autocomplete="username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" autocomplete="current-password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
        <el-button @click="goToRegister">去注册</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const form = reactive({
  username: '',
  password: ''
})

const router = useRouter()

async function handleLogin() {
  try {
    const res = await axios.post('/api/auth/login', form)
    localStorage.setItem('user', JSON.stringify(res.data))
    ElMessage.success('登录成功')
    router.push('/')
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '登录失败')
  }
}

function goToRegister() {
  router.push('/register')
}
</script>

<style scoped>
.login-card {
  width: 400px;
  margin: 100px auto;
}
</style>
