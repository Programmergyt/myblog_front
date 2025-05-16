<template>
  <el-container style="padding: 0; height: calc(100vh - 40px);">
    <el-aside width="250px" class="aside-container">
      <TagSidebar
          v-model:selectedTags="selectedTagIds"
          :show-management="true"
          @tags-refreshed="handleTagsRefreshed"
      />
    </el-aside>

    <el-main style="/* width: 800px; */ padding-left: 20px; overflow-y: auto;">
      <div class="actions-header">
        <el-button type="primary" @click="router.push('/blogform')" :icon="EditPen">
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
import {computed, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router'; // 1. 引入 useRouter
import BlogCard from '@/components/BlogCard.vue';
import {getBlogs} from '@/services/api.js';
import {ElMessage, ElButton} from 'element-plus'; // 引入 ElButton (如果需要)
import {EditPen} from '@element-plus/icons-vue'; // 引入图标
import TagSidebar from '@/components/TagSideBar.vue';

const router = useRouter(); // 2. 获取 router 实例

// 存储从 API 获取的所有文章
const allPostsFromApi = ref([]);
// 存储当前选中的标签 ID 列表
const selectedTagIds = ref([]);

// 从 TagSidebar 获取的数据
const availableTagsForParent = ref([]);
const idToNameCategoriesMap = ref({});

const firstTagsLoad = ref(true);

const handleTagsRefreshed = ({availableTags, tagsMap}) => {
  availableTagsForParent.value = availableTags;
  idToNameCategoriesMap.value = tagsMap;

  if (firstTagsLoad.value && availableTags.length > 0 && selectedTagIds.value.length === 0) {
    selectedTagIds.value = availableTags.map(tag => tag.tagId);
    firstTagsLoad.value = false;
  }
};

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
    // 如果没有标签，也没有已选标签(比如初始状态)，但有文章，则显示所有文章
    filteredPosts = [...allPostsFromApi.value];
  }

  return filteredPosts.map(post => ({
    ...post,
    categoryNames: (post.tagIds || []).map(id => idToNameCategoriesMap.value[String(id)] || '未知分类')
  })).sort((a, b) => new Date(b.createTime) - new Date(a.createTime)); // 按创建时间降序排序
});

onMounted(async () => {
  try {
    const postRes = await getBlogs(null);
    const postResData = postRes.data.data;

    allPostsFromApi.value = postResData.map(post => ({
      ...post,
      tagIds: (post.tagIds || []).map(id => String(id)),
    }));
    console.log('博客目录组件已加载');
  } catch (e) {
    console.error('加载首页数据失败:', e);
    ElMessage.error('加载数据失败，请稍后重试');
  }
});

</script>

<style scoped>
.aside-container {
  padding-right: 0;
  border-right: 1px solid #e0e0e0;
  /* 让 TagSidebar 内部可以滚动，而不是整个 aside 滚动 */
  display: flex; /* 新增 */
  flex-direction: column; /* 新增 */
}

/* 如果 TagSidebar 内部没有很好地处理其高度和滚动，可能需要给 TagSidebar 组件本身或其包装器显式的高度 */
.aside-container > :deep(.sidebar-content) { /* 假设 TagSidebar 的根元素 class 是 sidebar-content */
  flex-grow: 1;
  overflow-y: auto;
}


.actions-header {
  margin-bottom: 20px;
  text-align: right; /* 让按钮靠右 */
}
</style>