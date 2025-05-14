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
        <el-button @click="router.push('/login')">去登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { uploadImage } from '@/services/api'
import { register } from '@//services/api'

const router = useRouter()
const defaultAvatar = "/images/personal_icon.jpg"
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  avatar: ''
})

// 注册功能
async function handleRegister() {
  if (form.password !== form.confirmPassword) {
    ElMessage.warning('两次密码不一致')
    return
  }
  if (!form.username || !form.password || !form.email) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    // 拿出除了确认密码之外的属性
    const { confirmPassword, ...user } = form
    await register(user) // 使用统一 API 方法
    ElMessage.success('注册成功，请登录')
    await router.push('/login')
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '注册失败:'+err.message)
  }
}


// 上传图片
const customUpload = async (options) => {
  const formData = new FormData()
  formData.append('file', options.file)
  try {
    const res = await uploadImage(formData)
    console.log("上传成功，头像地址：", res.data.data.url)
    form.avatar = res.data.data.url
  } catch (err) {
    ElMessage.error('头像上传失败')
  }
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
