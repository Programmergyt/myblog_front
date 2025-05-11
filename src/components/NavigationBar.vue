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
      <el-menu-item index="/register" style="font-size: 18px; padding: 20px;">追番</el-menu-item>
      <el-menu-item index="/category" style="font-size: 18px; padding: 20px;">工具</el-menu-item>
      <el-menu-item index="/about" style="font-size: 18px; padding: 20px;">个人简介</el-menu-item>
    </div>
    <!-- 右侧登录/头像区域 -->
    <div style="display: flex; align-items: center; padding-right: 20px;">
      <template v-if="!isLogin">
        <el-button type="primary" @click="showLogin = true">登录</el-button>
      </template>
      <template v-else>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link" style="cursor: pointer;">
            <el-avatar :src="avatarUrl" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </div>
  </el-menu>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from "vue";
import { ref } from 'vue';
const $route = useRoute()
onMounted(() => { console.log("导航栏已经加载", new Date()) })

const showLogin = ref(false);
const isLogin = ref(!!localStorage.getItem('token'));
const avatarUrl = ref(localStorage.getItem('avatar') || '');

// 登录成功后更新状态
function onLoginSuccess({ token, avatar }) {
  localStorage.setItem('token', token);
  localStorage.setItem('avatar', avatar || '');
  isLogin.value = true;
  avatarUrl.value = avatar;
}

// 退出登录
function handleCommand(command) {
  if (command === 'logout') {
    localStorage.removeItem('token');
    localStorage.removeItem('avatar');
    isLogin.value = false;
    avatarUrl.value = '';
  }
}
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid #ebeef5;
  padding: 20px 40px; /* 增大上下和左右的内边距 */
}
</style>