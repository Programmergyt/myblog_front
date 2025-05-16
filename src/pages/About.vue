<template>
  <el-card class="about-card">
    <el-row>
      <el-col :span="6" class="avatar-container">
        <el-avatar :size="120" src="/images/personal_icon.jpg" />
      </el-col>
      <el-col :span="18">
        <h2>你好，我是博主GYT 👋</h2>
        <p>🗺 所在地：上海市徐汇区</p>
        <p>🎓 学校：华东理工大学</p>
        <p>💻 擅长：Vue、Java、Springboot、深度学习</p>
        <p>📖 自我介绍：一个热爱技术，热爱生活的开发者。</p>
        <p>🐧 QQ号：2403508140</p>
        <p>🐧 微信号：guodashai1234</p>
      </el-col>
    </el-row>
  </el-card>
<!--  <el-card>-->
<!--    &lt;!&ndash; 评论区 &ndash;&gt;-->
<!--    <CommentSection />-->
<!--  </el-card>-->
</template>

<script setup>
import {onMounted} from "vue";

onMounted(()=>{console.log("个人介绍已经加载")})
</script>


<style scoped>
.about-card {
  max-width: 800px;
  margin: 0 auto;
}
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
