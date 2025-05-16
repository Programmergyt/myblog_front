<template>
  <div class="markdown-publisher-container">
    <div class="editor-header">
      <el-button
          @click="router.push('/')"
          :icon="ArrowLeft"
          circle
          title="返回列表"
          class="back-button"
      />
      <el-input
          v-model="articleTitle"
          placeholder="请输入文章标题"
          class="title-input"
          size="large"
      />
      <TagSidebar
          :show-management="false"
          v-model:selectedTags="selectedTagIdsAsString"
          @tags-refreshed="handleTagsRefreshed"
          class="tag-sidebar-wrapper"
      />
      <el-button
          type="primary"
          @click="handlePublish"
          :loading="isPublishing"
          size="large"
          class="publish-button"
      >
        发布文章
      </el-button>
    </div>

    <MdEditor
        v-model="articleContent"
        :toolbars="toolbars"
        @onUploadImg="handleUploadImg"
        :language="editorLanguage"
        :theme="editorTheme"
        style="height: calc(100vh - 160px);"
    class="main-editor"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // 1. 引入 useRouter
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ElMessage, ElButton } from 'element-plus'; // 引入 ElButton
import { ArrowLeft } from '@element-plus/icons-vue'; // 引入图标
import { uploadImage, postBlog, getCurrentUser } from '@/services/api.js';
import TagSidebar from '@/components/TagSideBar.vue';

const router = useRouter(); // 2. 获取 router 实例

// --- 编辑器配置 ---
const editorLanguage = ref('zh-CN');
const editorTheme = ref('light');
const toolbars = [
  'bold', 'underline', 'italic', '-',
  'title', 'strikeThrough', 'sub', 'sup', 'quote', 'unorderedList', 'orderedList', 'task', '-',
  'codeRow', 'code', 'link', 'image', 'table', 'mermaid', 'katex', '-',
  'revoke', 'next', 'save', '=',
  'pageFullscreen', 'fullscreen', 'preview', 'htmlPreview', 'catalog',
];

// --- 文章数据 ---
const articleTitle = ref('');
const articleContent = ref('');
const selectedTagIds = ref([]);
const availableTagsFromSidebar = ref([]);

const selectedTagIdsAsString = computed({
  get: () => selectedTagIds.value.map(String),
  set: (val) => {
    selectedTagIds.value = val.map(id => Number(id)).filter(id => !isNaN(id));
  }
});

// --- 用户数据 ---
const currentUser = ref(null);

// --- 状态控制 ---
const isPublishing = ref(false);

// --- 方法 ---

const handleTagsRefreshed = ({ availableTags, tagsMap }) => {
  availableTagsFromSidebar.value = availableTags;
};

const handleUploadImg = async (files, callback) => {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await uploadImage(formData);
      if (response && response.data && response.data.code === 1 && response.data.data && response.data.data.url) {
        return response.data.data.url;
      } else {
        ElMessage.error(`图片 ${file.name} 上传失败: ${response?.data?.msg || '响应格式错误'}`);
        return null;
      }
    } catch (error) {
      console.error('图片上传异常:', error);
      ElMessage.error(`图片 ${file.name} 上传异常: ${error.message}`);
      return null;
    }
  });
  try {
    const urls = await Promise.all(uploadPromises);
    callback(urls.filter(url => url !== null));
  } catch (error) {
    ElMessage.error('部分图片上传失败');
    callback([]);
  }
};

const handlePublish = async () => {
  if (!articleTitle.value.trim()) {
    ElMessage.warning('请输入文章标题');
    return;
  }
  if (!articleContent.value.trim()) {
    ElMessage.warning('请输入文章内容');
    return;
  }
  if (selectedTagIds.value.length === 0) {
    ElMessage.warning('请至少选择一个标签');
    return;
  }

  isPublishing.value = true;
  const blogData = {
    title: articleTitle.value,
    content: articleContent.value,
    tagIds: selectedTagIds.value,
  };
  try {
    const response = await postBlog(blogData);
    if (response && response.data && response.data.code === 1) {
      ElMessage.success('文章发布成功！');
      articleTitle.value = '';
      articleContent.value = '';
      selectedTagIds.value = [];
      const postId = response.data.data.id;
      await router.push(`/post/${postId}`);
    } else {
      ElMessage.error(`发布失败: ${response?.data?.msg || '未知错误'}`);
    }
  } catch (error) {
    console.error('发布文章异常:', error);
    ElMessage.error(`发布文章异常: ${error.message}`);
  } finally {
    isPublishing.value = false;
  }
};

const fetchCurrentUser = async () => {
  try {
    const response = await getCurrentUser();
    if (response && response.data && response.data.code === 1) {
      currentUser.value = response.data.data;
    } else {
      console.warn('获取用户信息失败或未登录:', response?.data?.msg);
    }
  } catch (error) {
    console.error('获取用户信息异常:', error);
  }
};

onMounted(() => {
  fetchCurrentUser();
});

</script>

<style scoped>
.markdown-publisher-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f5f7; /* 这个背景会应用于 ContentLayout 的 .main-content 内部 */
  /* 为了让编辑器高度计算准确，确保容器本身不设置固定高度或100vh */
}

.editor-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-shrink: 0; /* 防止头部被压缩 */
}

.back-button {
  margin-right: 15px; /* 与标题输入框的间距 */
}

.title-input {
  flex-grow: 1;
  margin-right: 20px;
}

.title-input :deep(.el-input__wrapper) {
  box-shadow: none !important;
  font-size: 1.1em;
}

.tag-sidebar-wrapper {
  margin-right: 20px;
  min-width: 200px; /* 调整最小宽度以适应下拉框 */
  max-width: 350px; /* 调整最大宽度 */
  /* height: 50px; */ /* 移除固定高度，让 el-select 自适应 */
  /* overflow: hidden; */ /* 移除，el-select 的下拉部分需要显示 */
  display: flex; /* 新增，使其能参与 flex 布局 */
  align-items: center; /* 新增 */
}

.tag-sidebar-wrapper :deep(.tags-display-area h3) {
  display: none;
}

.tag-sidebar-wrapper :deep(.tags-display-area) {
  padding-bottom: 0;
  width: 100%; /* 让内部 select 撑满 */
}


.publish-button {
  min-width: 120px;
  flex-shrink: 0;
}

.main-editor {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  flex-grow: 1; /* 编辑器占据剩余的垂直空间 */
  height: calc(100% - 77px); /* 假设 .editor-header 高度约为 62px + 15px margin-bottom */
  /* 或者保持之前的 calc(100vh - 200px) 如果那个效果更好 */
}
</style>