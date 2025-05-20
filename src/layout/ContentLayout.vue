<!-- src/layouts/ContentLayout.vue -->
<template>
  <div class="layout">
    <NavigationBar />
    <el-main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <!-- 加上div才会让vue把整个组件块当作新节点，重新加载-->
          <!-- Vue 会根据 key 判断这是一个新的节点，从而强制重新渲染组件。-->
          <div :key="route.fullPath">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </el-main>
    <FooterBar />
  </div>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue'
import FooterBar from '@/components/FooterBar.vue'
console.log('内容页已加载')
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 100% ;
  margin: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;

}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>