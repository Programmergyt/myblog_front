<!-- src/App.vue -->
<template>
  <AppLayout>
    <!--将router view传入AppLayout作为输入参数-->
    <router-view />
  </AppLayout>
</template>

<script setup>
// vue框架定义的组件就在script中进行引入，然后在template中进行使用
import AppLayout from '@/layout/AppLayout.vue'
</script>
