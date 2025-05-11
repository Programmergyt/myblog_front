<template>
  <el-dialog v-model="visible" title="登录" width="400px" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="loginForm" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密ss码" prop="password">
        <el-input type="password" v-model="form.password" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleLogin">登录</el-button>
      <el-button type="text" @click="$emit('switch-to-register')">还没有账号？注册</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, watch} from 'vue'
import axios from '@/services/axios.js'
import { ElMessage } from 'element-plus'

const props = defineProps(['visible'])
const emit = defineEmits(['update:visible', 'switch-to-register'])

const visible = ref(props.visible)
watch(() => props.visible, val => visible.value = val)
watch(visible, val => emit('update:visible', val))

const form = ref({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const loginForm = ref(null)

const handleLogin = () => {
  loginForm.value.validate(async valid => {
    if (valid) {
      try {
        const token = await axios.post('/auth/login', form.value)
        localStorage.setItem('token', token)
        ElMessage.success('登录成功')
        visible.value = false
        location.reload() // 登录后刷新页面或发出登录成功事件
      } catch (err) {
        ElMessage.error(err || '登录失败')
      }
    }
  })
}
</script>
