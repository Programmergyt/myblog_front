<template>
  <el-menu
      class="navbar"
      mode="horizontal"
      router
      :default-active="$route.path"
      style="display: flex; justify-content: space-between; align-items: center;"
  >
    <!--    外层 el-menu 设置了 justify-content: space-between，保证两侧分布。-->
    <!--    align-items: center 保证垂直居中对齐。-->
    <!-- 左侧菜单项容器 -->
    <div style="display: flex;">
      <el-menu-item index="/" style="font-size: 18px; padding: 20px;">博客</el-menu-item>
      <el-menu-item index="/category" style="font-size: 18px; padding: 20px;">做饭</el-menu-item>
      <el-menu-item index="/category/2" style="font-size: 18px; padding: 20px;">追番</el-menu-item>
      <el-menu-item index="/category/3" style="font-size: 18px; padding: 20px;">工具</el-menu-item>
      <el-menu-item index="/about" style="font-size: 18px; padding: 20px;">个人简介</el-menu-item>
    </div>
    <!-- 右侧登录/头像区域 -->
    <div>
      <el-button v-if="!isLoggedIn" type="primary" @click="goToLogin">登录</el-button>
      <el-dropdown v-else>
      <span class="el-dropdown-link">
        <el-avatar :src="user.avatar || defaultAvatar" size="small" />
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
import {useRoute, useRouter} from 'vue-router'
import { onMounted } from "vue";
import { ref, computed } from 'vue'
const $route = useRoute()
const router = useRouter()  // 它不会显式引入 router/index.js 文件，所以不会形成循环依赖。
onMounted(() => { console.log("导航栏已经加载", new Date()) })

const user = ref(JSON.parse(localStorage.getItem('user')) || {})
const isLoggedIn = computed(() => !!user.value.username)
const defaultAvatar = "C:\\Users\\Thinkbook\\Pictures\\Screenshots\\屏幕截图 2025-01-23 130604.png"

function goToLogin() {
  router.push('/login')
}

function logout() {
  localStorage.removeItem('user')
  location.reload()
}
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid #ebeef5;
  padding: 20px 40px; /* 增大上下和左右的内边距 */
}
</style>