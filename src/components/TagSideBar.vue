<!--src/components/TagSideBar.vue-->
<template>
  <div class="sidebar-content" style="margin-right: 16px;" >
    <div class="tags-display-area">
      <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 1.1em; color: #333;">标签筛选</h3>
      <div class="tag-selector-container" v-if="internalTagSelectorCategories.length > 0">
        <el-tag
            v-for="category in internalTagSelectorCategories"
            :key="category.tagId"
            :type="isTagSelected(category.tagId) ? 'primary' : 'info'"
            effect="light"
            @click="toggleTagSelection(category.tagId)"
            class="custom-tag"
        >
          {{ category.tagName }}
        </el-tag>
      </div>
      <el-empty description="暂无可用标签" v-else />
    </div>
    <div class="tag-management-area" v-if="showManagement">
      <h4 style="margin-top: 0; margin-bottom: 10px; font-size: 1em; color: #333;">管理标签</h4>
      <el-input
          v-model="newTagName"
          placeholder="输入标签名"
          clearable
          style="margin-bottom: 8px;"
      />
      <div style="display: flex; gap: 8px;">
        <el-button type="primary" @click="handleAddTag" :loading="tagActionLoading">添加</el-button>
        <el-button type="danger" @click="handleDeleteTag" :loading="tagActionLoading">删除</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getAllTags, createTag, deleteTag } from '@/services/api.js'; // 确保路径正确
import { ElMessage } from 'element-plus';

const props = defineProps({
  selectedTags: { // 用于 v-model:selectedTags
    type: Array,
    default: () => []
  },
  showManagement: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:selectedTags', 'tags-refreshed']);

// 内部状态
const internalTagSelectorCategories = ref([]); // 格式: {tagId: string, tagName: string}
const internalIdToNameCategoriesMap = ref({});
const localSelectedTagIds = ref([...props.selectedTags]); // 本地副本，用于修改和同步
// 标签管理状态
const newTagName = ref('');
const tagActionLoading = ref(false);

// 监视父组件传入的 selectedTags，实现从父到子的同步
watch(() => props.selectedTags, (newValue) => {
// 避免不必要的更新和无限循环
  if (JSON.stringify(newValue) !== JSON.stringify(localSelectedTagIds.value)) {
    localSelectedTagIds.value = [...newValue];
  }

}, { deep: true });

const isTagSelected = (tagId) => {
  return localSelectedTagIds.value.includes(tagId);
};

const toggleTagSelection = (tagId) => {
  const index = localSelectedTagIds.value.indexOf(tagId);
  if (index === -1) {
    localSelectedTagIds.value.push(tagId);
  } else {
    localSelectedTagIds.value.splice(index, 1);
  }
  emit('update:selectedTags', [...localSelectedTagIds.value]); // 更新父组件
};

const fetchTags = async () => {
  tagActionLoading.value = true;
  try {
    const categoryRes = await getAllTags();
    const categoryResData = categoryRes.data.data;
    internalTagSelectorCategories.value = categoryResData.map(cat => ({
      tagId: String(cat.id),
      tagName: cat.name
    }));
    internalIdToNameCategoriesMap.value = categoryResData.reduce((map, cat) => {
      map[String(cat.id)] = cat.name;
      return map;
    }, {});
// 通知父组件标签已刷新，并传递标签列表和映射
    emit('tags-refreshed', {
      availableTags: [...internalTagSelectorCategories.value],
      tagsMap: { ...internalIdToNameCategoriesMap.value }
    });
  } catch (error) {
    console.error('获取标签列表失败 (TagSidebar):', error);
    ElMessage.error('获取标签列表失败');
  } finally {
    tagActionLoading.value = false;
  }
};

const handleAddTag = async () => {
  if (!newTagName.value.trim()) {
    ElMessage.warning('请输入标签名称');
    return;
  }
  tagActionLoading.value = true;
  try {
    await createTag({ name: newTagName.value.trim() });
    ElMessage.success(`标签 "${newTagName.value.trim()}" 添加成功`);
    newTagName.value = '';
    await fetchTags(); // 重新获取并通知父组件
  } catch (error) {
    console.error('添加标签失败 (TagSidebar):', error);
    const errMsg = error.message || '添加标签失败，请登录为管理员后再操作';
    ElMessage.error(errMsg);
  } finally {
    tagActionLoading.value = false;
  }
};

const handleDeleteTag = async () => {
  const tagNameToDelete = newTagName.value.trim();
  if (!tagNameToDelete) {
    ElMessage.warning('请输入要删除的标签名称');
    return;
  }
  const tagToDelete = internalTagSelectorCategories.value.find(tag => tag.tagName === tagNameToDelete);
  if (!tagToDelete) {
    ElMessage.error(`未找到名为 "${tagNameToDelete}" 的标签`);
    return;
  }

  tagActionLoading.value = true;
  try {
    await deleteTag(tagToDelete.tagId); // API应接受ID
    ElMessage.success(`标签 "${tagNameToDelete}" 删除成功`);
    newTagName.value = '';
// 如果删除的标签在已选列表中，则移除
    const selectedIndex = localSelectedTagIds.value.indexOf(tagToDelete.tagId);
    if (selectedIndex > -1) {
      localSelectedTagIds.value.splice(selectedIndex, 1);
      emit('update:selectedTags', [...localSelectedTagIds.value]); // 通知父组件
    }
    await fetchTags(); // 重新获取并通知父组件
  } catch (error) {
    console.error('删除标签失败 (TagSidebar):', error);
    const errMsg = error.message || '删除标签失败：标签可能与现有文章关联';
    ElMessage.error(errMsg);
  } finally {
    tagActionLoading.value = false;
  }
};

onMounted(async () => {
  await fetchTags();
});

</script>

<style scoped>
.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%; /* 确保填满父容器 (el-aside) */
}

.tags-display-area {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.tag-management-area {
  flex-shrink: 0;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.tag-selector-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.custom-tag {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.custom-tag:hover {
  opacity: 0.8;
}
</style>