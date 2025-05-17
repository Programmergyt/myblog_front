<template>
  <div class="main-content">
    <el-row :gutter="20">
      <el-col :span="24">
        <BlogCard :post="post" />
      </el-col>
    </el-row>
    <MdPreview
        :modelValue="post.content || ''"
        class="blog-markdown-content"
    />
    <div class="button-wrapper" v-if="canDeletePost">
      <el-button type="danger" @click="handleDeletePost">删除博客</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'; // 1. 引入 computed
import { useRoute, useRouter } from 'vue-router'; // 2. 引入 useRouter (如果 router 是从这里导入的)
import { getBlogById, getAllTags, getCurrentUser, deleteBlog } from '@/services/api.js';
import BlogCard from '@/components/BlogCard.vue';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { ElMessage, ElMessageBox } from "element-plus";

const post = ref({
  id: null,
  userId: null, // 确保这个字段会从 getBlogById 获取
  title: '加载中...',
  content: '请稍候，内容加载中...',
  tagIds: [],
  categoryNames: []
});
const categoriesMap = ref({});
const route = useRoute();
const router = useRouter(); // 使用 useRouter() 获取 router 实例
const postId = parseInt(route.params.postId);

// 添加响应式变量存储当前用户信息和删除权限
const currentUser = ref(null);
const canDeletePost = computed(() => {
  if (!currentUser.value || !post.value || typeof post.value.userId === 'undefined') {
    return false; // 如果用户信息或文章作者信息缺失，则不能删除
  }
  // role为1是管理员，0是普通用户
  return currentUser.value.id === post.value.userId || currentUser.value.role === 1;
});

// 获取当前登录用户信息
const fetchCurrentUser = async () => {
  try {
    console.log('即将执行getCurrentUser')
    const userResponse = await getCurrentUser();
    if (userResponse && userResponse.data && userResponse.data.code === 1 && userResponse.data.data) {
      currentUser.value = userResponse.data.data;
      console.log('当前登录用户:', currentUser.value);
    } else {
      console.warn('获取当前用户信息失败或未登录:', userResponse?.data?.msg);
      currentUser.value = null; // 明确设置为 null，表示未登录或获取失败
    }
  } catch (error) {
    console.error('获取当前用户信息异常:', error);
    currentUser.value = null; // 出错也认为无权限
    // ElMessage.error('获取用户信息失败，部分操作可能受限'); // 可选：给用户一个通用提示
  }
};

// 点击删除博客按钮的处理函数
const handleDeletePost = async () => {
  // 权限检查现在由 canDeletePost 计算属性处理，按钮已通过 v-if 控制
  // 但为了双重保险和清晰，可以在这里再次校验（尽管如果按钮不可见，这个函数不会被调用）
  if (!canDeletePost.value) {
    ElMessage.error('您没有权限删除此文章');
    return;
  }

  // 确保 post.value 及其属性存在 (虽然 canDeletePost 已经间接检查了)
  if (!post.value || typeof post.value.id === 'undefined') {
    ElMessage.error('文章数据无效，无法删除');
    return;
  }

  ElMessageBox.confirm(
      `确定要删除文章 "${post.value.title || '这篇博客'}" 吗？此操作无法撤销。`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
      }
  )
      .then(async () => {
        try {
          console.log('即将执行deleteBlog')
          await deleteBlog(post.value.id);
          ElMessage.success('删除成功');
          await router.push('/');
        } catch (error) {
          console.error('删除文章时发生错误:', error);
          ElMessage.error('删除文章失败: ' + (error.response?.data?.msg || error.message || '未知错误'));
        }
      })
      .catch(() => {
        ElMessage.info('已取消删除');
      });
};

// 加载博客数据和当前用户信息
onMounted(async () => {
  // 首先获取当前用户信息，以便后续判断权限
  await fetchCurrentUser();

  try {
    console.log('已加载博客postId:', postId);
    console.log("即将执行getBlogById和getAllTags");
    const [postResData, categoryResData] = await Promise.all([
      getBlogById(postId).then(res => {
        if (res && res.data && res.data.code === 1) return res.data.data;
        throw new Error(res?.data?.msg || '获取博客详情失败');
      }),
      getAllTags().then(res => {
        if (res && res.data && res.data.code === 1) return res.data.data;
        throw new Error(res?.data?.msg || '获取标签列表失败');
      })
    ]);

    if (Array.isArray(categoryResData)) {
      categoriesMap.value = categoryResData.reduce((map, cat) => {
        map[cat.id] = cat.name;
        return map;
      }, {});
    }

    if (postResData) {
      postResData.categoryNames = (postResData.tagIds || []).map(id => categoriesMap.value[id] || '未知');
      post.value = postResData; // 确保 post.value.userId 被正确赋值
      console.log('文章详情已加载:', post.value);
    } else {
      console.error('未能获取到文章数据，postId:', postId);
      post.value.title = '文章未找到';
      post.value.content = '抱歉，无法加载指定的文章内容。';
    }
  } catch (e) {
    console.error('加载文章详情失败:', e.message || e);
    post.value.title = '加载失败';
    post.value.content = e.message || '加载文章详情时发生错误，请稍后再试。';
    // 如果是因为未找到博客，后端 mock 通常会返回特定的错误信息或 code，可以在这里处理
  }
});

</script>

<style>
/* ... 你的样式保持不变 ... */
.main-content {
  padding: 20px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.blog-markdown-content {
  margin-top: 20px;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end; /* 修改为靠右对齐 */
  margin-top: 20px;        /* 增加顶部间距 */
  padding-top: 20px;       /* 增加内上边距 */
  border-top: 1px solid #eee; /* 添加一个分隔线 */
}
</style>