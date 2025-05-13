<!-- src/layouts/ContentLayout.vue -->
<template>
  <div class="layout">
    <NavigationBar />
    <el-main class="main-content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </el-main>
    <FooterBar />
  </div>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue'
import FooterBar from '@/components/FooterBar.vue'
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
  max-width: 1000px;
  margin: 0 auto;
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
