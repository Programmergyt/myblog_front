import axios from './axios'; // 引入配置好的 axios 实例

// 打印 API 请求日志的辅助函数
const logApiCall = (apiName, ...args) => {
    console.log(`即将执行 API: ${apiName}`, ...args);
};

// 站点统计
export const getStats = () => {
    logApiCall('getStats');
    return axios.get('/stats');
};

// --- 认证接口 ---

/**
 * 用户登录
 * @param {object} credentials - 包含 username 和 password 的对象
 * @returns {Promise<string>} - 返回 JWT token
 */
export const login = (credentials) => {
    logApiCall('login', credentials);
    return axios.post('/auth/login', credentials);
};

/**
 * 用户注册
 * @param {object} userInfo - 包含 username, password, email, avatar 的用户对象
 * @returns {Promise<object>} - 返回注册成功的用户对象 (不含密码)
 */
export const register = (userInfo) => {
    logApiCall('register', userInfo);
    return axios.post('/auth/register', userInfo);
};

/**
 * 获取当前登录用户的信息
 * 需要携带认证 token (由 axios 请求拦截器自动添加)
 * @returns {Promise<object>} - 返回当前用户对象 { id, username, email, avatar, role, createTime }
 */
export const getCurrentUser = () => {
    logApiCall('getCurrentUser');
    return axios.get('/auth/me');
};

/**
 * 用户登出
 * @returns {Promise<void>}
 */
export const logout = () => {
    logApiCall('logout');
    return axios.post('/auth/logout');
};

// --- 博客模块 ---

/**
 * 发布新博客
 * @param {object} blogData - 包含 title, content, tagIds 的博客对象
 * @returns {Promise<object>} - 返回创建成功的博客对象
 */
export const postBlog = (blogData) => {
    logApiCall('postBlog', blogData);
    return axios.post('/blogs', blogData);
};

/**
 * 删除博客
 * @param {number|string} id - 博客 ID
 * @returns {Promise<void>}
 */
export const deleteBlog = (id) => {
    logApiCall('deleteBlog', id);
    return axios.delete(`/blogs/${id}`);
};

/**
 * 更新博客
 * @param {number|string} id - 博客 ID
 * @param {object} blogData - 更新的博客数据 (title, content, tagIds)
 * @returns {Promise<void>}
 */
export const updateBlog = (id, blogData) => {
    logApiCall('updateBlog', id, blogData);
    return axios.put(`/blogs/${id}`, blogData);
};

/**
 * 查询博客列表 (支持筛选)
 * @param {object} params - 查询参数对象，可选包含 title, tagId, userId, startTime, endTime
 * @returns {Promise<Array<object>>} - 返回博客列表
 */
export const getBlogs = (params) => {
    logApiCall('getBlogs', params);
    return axios.get('/blogs', { params });
};

/**
 * 获取单个博客详情
 * @param {number|string} id - 博客 ID
 * @returns {Promise<object>} - 返回博客详情对象
 */
export const getBlogById = (id) => {
    logApiCall('getBlogById', id);
    return axios.get(`/blogs/${id}`);
};

/**
 * 上传博客中的图片
 * @param {FormData} formData - 包含 'file' 字段的 FormData 对象
 * @returns {Promise<object>} - 返回包含图片 URL 的对象 { url: '...', success: 1 }
 */
export const uploadImage = (formData) => {
    logApiCall('uploadImage', formData);
    return axios.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // 指定请求类型为 multipart/form-data
        }
    });
};

/**
 * 创建新标签 (需要管理员权限)
 * @param {object} tagData - 包含 name 的标签对象
 * @returns {Promise<object>} - 返回创建成功的标签对象{id,name}
 */
export const createTag = (tagData) => {
    logApiCall('createTag', tagData);
    return axios.post('/tags', tagData);
};

/**
 * 删除标签 (需要管理员权限)
 * @param {number|string} id - 标签 ID
 * @returns {Promise<void>}
 */
export const deleteTag = (id) => {
    logApiCall('deleteTag', id);
    return axios.delete(`/tags/${id}`);
};

/**
 * 获取所有标签列表
 * @returns {Promise<Array<object>>} - 返回标签列表
 */
export const getAllTags = () => {
    logApiCall('getAllTags');
    return axios.get('/tags');
};
