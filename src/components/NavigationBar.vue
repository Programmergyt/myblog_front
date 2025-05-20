<template>
  <el-menu
      class="navbar"
      mode="horizontal"
      router
      :default-active="$route.path"
      style="display: flex; justify-content: space-between; align-items: center;"
  >
    <!-- 左侧菜单项容器 -->
    <div style="display: flex;">
      <el-menu-item index="/" style="font-size: 18px; padding: 20px;">博客</el-menu-item>
      <el-menu-item index="/" style="font-size: 18px; padding: 20px;">做饭</el-menu-item>
      <el-menu-item index="/" style="font-size: 18px; padding: 20px;">追番</el-menu-item>
      <el-menu-item index="/" style="font-size: 18px; padding: 20px;">工具</el-menu-item>
      <el-menu-item index="/about" style="font-size: 18px; padding: 20px;">个人简介</el-menu-item>
    </div>
    <!-- 右侧登录/头像区域 -->
    <div>
      <el-button v-if="!isLoggedIn" type="primary" @click="router.push('/login')">登录</el-button>
      <el-dropdown v-else>
      <span class="el-dropdown-link">
        <el-avatar :src="currentUser?.avatar || defaultAvatar" size="default" />
      </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { watch, onMounted, ref } from 'vue'// 导入 Vue 的组合式 API：watch 用于监听响应式变量，onMounted 用于组件挂载后执行逻辑，ref 创建响应式数据
import { ElMessage } from 'element-plus'// 导入 Element Plus 中的消息提示组件
import { getCurrentUser} from "@/services/api.js"

// 如果 ref 接收的是一个对象，它内部实际上会调用 reactive 来处理这个对象，而reactive的作用就是监听和反应
const isLoggedIn = ref(false)// 创建响应式变量 isLoggedIn，用于判断用户是否登录
const $route = useRoute()// 获取当前路由对象
const router = useRouter()// 获取路由实例，用于编程式导航
const defaultAvatar = "/images/personal_icon.jpg"// 默认头像路径
const currentUser = ref(null)// 当前登录用户信息

// 退出登录函数，清除用户信息，更新状态
function logout() {
  localStorage.removeItem('CurrentUser')
  localStorage.removeItem('authToken')
  currentUser.value = null
  isLoggedIn.value = false
  ElMessage.success('退出登录成功')
  console.log("退出登录")
}

// 监听路由变化，每次路由变更时都更新登录状态（比如页面跳转后重新渲染时）
watch(() => $route.fullPath, () => {
  const stored = localStorage.getItem('CurrentUser')
  isLoggedIn.value = !!stored  // 如果存在用户信息，则设为 true
  currentUser.value = stored ? JSON.parse(stored) : null  // 更新用户信息
})

// 页面加载时获取当前用户信息
onMounted(async () => {
  try {
    const res = await getCurrentUser()
    currentUser.value = res.data.data
    localStorage.setItem('CurrentUser', JSON.stringify(currentUser.value))
    isLoggedIn.value = true
    console.log("导航栏已经加载")
  } catch (error) {
    currentUser.value = null
    isLoggedIn.value = false
    console.log("导航栏加载失败")
    console.warn('获取用户失败', error)
  }
})
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid #ebeef5;
  padding: 20px 40px; /* 增大上下和左右的内边距 */
}
</style>