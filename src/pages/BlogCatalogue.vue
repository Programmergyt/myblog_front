<template>
  <el-container style="padding: 0px; height: calc(100vh - 40px);">
    <el-aside width="250px" class="aside-container">
      <TagSidebar
          v-model:selectedTags="selectedTagIds"
          :show-management="true"
          @tags-refreshed="handleTagsRefreshed"
      />
    </el-aside>

    <el-main style="padding-left: 20px; overflow-y: auto;">
      <div class="actions-header">
        <el-button type="primary" @click="goToBlogForm" :icon="EditPen">
          写新博客
        </el-button>
      </div>

      <el-row :gutter="20" v-if="postsToDisplay.length">
        <el-col :span="24" v-for="post in postsToDisplay" :key="post.id" style="margin-bottom: 20px;">
          <BlogCard :post="post" />
        </el-col>
      </el-row>
      <el-empty
          :description="availableTagsForParent.length > 0 && selectedTagIds.length === 0 ? '请选择标签以显示文章' : '暂无匹配文章'"
          v-else
      />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs'
import BlogCard from '@/components/BlogCard.vue';
import { getBlogs, getCurrentUser } from '@/services/api.js'; // 1. 引入 getCurrentUser
import { ElMessage, ElButton, ElMessageBox } from 'element-plus'; // 引入 ElMessageBox
import { EditPen } from '@element-plus/icons-vue';
import TagSidebar from '@/components/TagSideBar.vue';

const router = useRouter();

const allPostsFromApi = ref([]);
const selectedTagIds = ref([]);
const availableTagsForParent = ref([]);
const idToNameCategoriesMap = ref({});
const firstTagsLoad = ref(true);

// 2. 添加 currentUser ref
const currentUser = ref(null);
const isCheckingAuth = ref(false); // 可选，用于表示正在获取用户信息

// 3. 获取当前登录用户信息的方法
const fetchCurrentUser = async () => {
  isCheckingAuth.value = true;
  try {
    const userResponse = await getCurrentUser(); // 调用 /api/auth/me
    // axios.js 拦截器会对 /auth/me 的未登录情况(code:401)返回 Promise.reject
    // 所以如果能走到这里，说明请求本身没被拦截器 reject (例如，publicPath 或者拦截器逻辑修改了)
    // 并且需要检查业务 code
    if (userResponse && userResponse.data && userResponse.data.code === 1 && userResponse.data.data) {
      currentUser.value = userResponse.data.data;
      console.log('BlogCatalogue: Current user:', currentUser.value);
    } else {
      // 可能是 code 非1，或者请求被拦截器放行但业务上未登录
      console.warn('BlogCatalogue: 获取当前用户信息失败或未登录:', userResponse?.data?.msg);
      currentUser.value = null;
    }
  } catch (error) {
    // 如果 getCurrentUser() Promise 被 reject (例如 axios 拦截器中因为 /auth/me 返回 401 而 reject)
    console.warn('BlogCatalogue: 获取当前用户信息时发生错误或未登录 (catch block):', error.message);
    currentUser.value = null; // 明确表示未登录
  } finally {
    isCheckingAuth.value = false;
  }
};


const handleTagsRefreshed = ({ availableTags, tagsMap }) => {
  availableTagsForParent.value = availableTags;
  idToNameCategoriesMap.value = tagsMap;

  if (firstTagsLoad.value && availableTags.length > 0 && selectedTagIds.value.length === 0) {
    selectedTagIds.value = availableTags.map(tag => tag.tagId);
    firstTagsLoad.value = false;
  }
};

onMounted(async () => {
  console.log('博客目录组件已加载');
  await fetchCurrentUser(); // 4. 在 onMounted 中调用

  try {
    const postRes = await getBlogs(null);
    const postResData = postRes.data.data; // 假设拦截器已处理外层包装

    allPostsFromApi.value = postResData.map(post => ({
      ...post,
      tagIds: (post.tagIds || []).map(id => String(id)),
    }));

  } catch (e) {
    console.error('加载首页数据失败:', e);
    ElMessage.error('加载数据失败，请稍后重试');
  }
});

const postsToDisplay = computed(() => {
  let filteredPosts = [];
  if (availableTagsForParent.value.length === 0 && allPostsFromApi.value.length > 0) {
    filteredPosts = [...allPostsFromApi.value];
  } else if (selectedTagIds.value.length === 0 && availableTagsForParent.value.length > 0) {
    filteredPosts = [];
  } else if (selectedTagIds.value.length > 0) {
    filteredPosts = allPostsFromApi.value.filter(post => {
      if (!post.tagIds || post.tagIds.length === 0) {
        return false;
      }
      return post.tagIds.some(tagId => selectedTagIds.value.includes(tagId));
    });
  } else {
    filteredPosts = [...allPostsFromApi.value];
  }
  return filteredPosts.map(post => ({
    ...post,
    categoryNames: (post.tagIds || []).map(id => idToNameCategoriesMap.value[String(id)] || '未知分类'),
  }));
});

// 5. 修改跳转方法
const goToBlogForm = async () => {
  // 确保用户信息已经尝试获取完毕
  if (isCheckingAuth.value) {
    ElMessage.info('正在检查用户状态，请稍候...');
    return;
  }

  if (currentUser.value) { // 用户已登录
    router.push('/blogform');
  } else { // 用户未登录
    ElMessageBox.confirm(
        '您需要登录才能写新博客，是否前往登录页面？',
        '提示',
        {
          confirmButtonText: '去登录',
          cancelButtonText: '取消',
          type: 'warning',
          draggable: true,
        }
    ).then(() => {
      router.push('/login');
    }).catch(() => {
      ElMessage.info('已取消操作');
    });
  }
};

</script>

<style scoped>
.aside-container {
  padding-right: 0px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}
.aside-container > :deep(.sidebar-content) {
  flex-grow: 1;
  overflow-y: auto;
}

.el-main {
  height: 100%;
}

.actions-header {
  margin-bottom: 20px;
  text-align: right;
}
</style>