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
        <el-button @click="router.push('/register')">去注册</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import {reactive} from 'vue'
import { useRouter } from 'vue-router'
import { login,getCurrentUser } from '@/services/api';
import {ElMessage} from "element-plus";

const router = useRouter()
const form = reactive({
  username: '',
  password: ''
})

console.log("登录页面已加载")
// 登录函数
async function handleLogin() {
  try {
    const res = await login(form)
    // 注意：这里 res.data 是 token 字符串，不是用户对象！
    // 如果你想存储用户信息，应该从响应中提取或通过 getUserInfo 接口获取
    localStorage.setItem('authToken', res.data.data) // 存储 token
    let CurrentUser;
    CurrentUser = await getCurrentUser()
    CurrentUser = CurrentUser.data.data
    localStorage.setItem('CurrentUser', CurrentUser)
    ElMessage.success('登录成功')
    await router.push('/')
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '登录失败')
  }
}

</script>

<style scoped>
.login-card {
  width: 400px;
  margin: 100px auto;
}
</style>
