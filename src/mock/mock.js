// src/mock/mock.js
import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '../services/axios'; // 引入配置好的 axios 实例
import Mock from 'mockjs'; // 引入 mockjs 用于生成随机数据

// 创建 Mock 适配器实例，拦截 axiosInstance 的请求
// 注意：mock 拦截的是 baseURL ('/api') 之后的部分
const mock = new MockAdapter(axiosInstance, { delayResponse: 300 }); // 模拟 300ms 延迟



// --- 模拟后端 Result<T> 结构 ---
const Result = {
    success: (data = null) => ({ code: 1, msg: 'success', data }),
    error: (msg, code = 0) => ({ code, msg, data: null }),
    unauthorized: (msg = '未登录') => ({ code: 401, msg, data: null }),
    forbidden: (msg = '禁止访问') => ({ code: 403, msg, data: null }), // 模拟 ForbiddenException
    notFound: (msg = '资源不存在') => ({ code: 404, msg, data: null }), // 模拟 ResourceNotFoundException
    duplicate: (msg = '重复插入元素') => ({ code: 409, msg, data: null }), // 模拟 DuplicateKeyException (使用 409 Conflict)
    badRequest: (msg = '非法参数') => ({ code: 400, msg, data: null }), // 模拟 IllegalArgumentException
    serverError: (msg = '系统错误，请联系管理员') => ({ code: 500, msg, data: null }), // 模拟通用 Exception
};



// --- 模拟数据库和状态 ---
let db = {
    users: [
        { id: 1, username: 'admin', password: 'password123', email: 'admin@example.com', avatar: '/images/pic2.png', role: 1, createTime: Mock.Random.datetime() },
        { id: 2, username: 'user', password: 'password123', email: 'user@example.com', avatar: '/images/personal_icon.jpg', role: 0, createTime: Mock.Random.datetime() }
    ],
    tags: [
        { id: 1, name: '技术' },
        { id: 2, name: '生活' },
        { id: 3, name: '随笔' }
    ],
    blogs: [
        { id: 1, userId: 1, title: Mock.Random.ctitle(5, 15), content: Mock.Random.cparagraph(10, 20), createTime: Mock.Random.datetime(), updateTime: Mock.Random.datetime(), tagIds: [1] },
        { id: 2, userId: 2, title: Mock.Random.ctitle(5, 15), content: Mock.Random.cparagraph(15, 25), createTime: Mock.Random.datetime(), updateTime: Mock.Random.datetime(), tagIds: [2, 3] }
    ],
    blog_tags: [
        { blog_id: 1, tag_id: 1 },
        { blog_id: 2, tag_id: 2 },
        { blog_id: 2, tag_id: 3 },
    ],
};

const stats = {
    total_posts: db.blogs.length,
    total_words: db.blogs.reduce((sum, p) => sum + p.content.length, 0),
    unique_visitors: 1234,
    total_views: 5678,
    uptime_seconds: 123456
}

// 接口模拟
mock.onGet('/stats').reply(config =>{
    return [200, Result.success(stats)]; // 将 stats 对象包装在 data 字段中，以符合 axios 的响应结构
})

let nextUserId = 3;
let nextBlogId = 3;
let nextTagId = 4;
// ... 其他 ID 计数器

// 模拟 JWT token (简单模拟，实际应更复杂)
const generateToken = (userId, role) => `mockToken-${userId}-${role}-${Date.now()}`;
const parseToken = (token) => {
    if (!token || !token.startsWith('Bearer ')) return null;
    const parts = token.substring(7).split('-');
    if (parts.length >= 3 && parts[0] === 'mockToken') {
        return { userId: parseInt(parts[1], 10), role: parseInt(parts[2], 10) };
    }
    return null;
};

// --- 模拟认证检查 ---
// 返回解析后的用户信息 { userId, role } 或 null
const checkAuth = (config, requiredRole = null) => {
    const token = config.headers?.Authorization;
    const userInfo = parseToken(token);

    if (!userInfo) {
        return { authenticated: false, reason: Result.unauthorized() }; // 未登录
    }

    // 检查角色权限
    if (requiredRole !== null && userInfo.role !== requiredRole) {
        // 这里模拟管理员权限检查
        if (requiredRole === 1) {
            return { authenticated: false, reason: Result.forbidden('需要管理员权限') };
        }
        // 可以添加其他角色检查
    }


    // 可以在这里模拟 token 过期
    // const tokenTime = parseInt(token.split('-')[3], 10);
    // if (Date.now() - tokenTime > 3600 * 1000) { // 假设 1 小时过期
    //     return { authenticated: false, reason: Result.unauthorized('令牌无效或已过期') };
    // }

    return { authenticated: true, user: userInfo }; // 认证通过
};

// --- 认证接口 Mock ---

// POST /api/auth/login
mock.onPost('/auth/login').reply(config => {
    const { username, password } = JSON.parse(config.data);
    const user = db.users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = generateToken(user.id, user.role);
        // 实际项目中 token 会存储在 localStorage
        // localStorage.setItem('authToken', token);
        return [200, Result.success(token)];//mock要求必须返回个状态码
    } else {
        // 模拟 IllegalArgumentException
        return [200, Result.badRequest('用户名或密码错误')];
    }
});

// POST /api/auth/register
mock.onPost('/auth/register').reply(config => {
    const { username, password, email, avatar } = JSON.parse(config.data);

    // 模拟 DuplicateKeyException
    if (db.users.some(u => u.username === username)) {
        return [200, Result.duplicate(`用户名 '${username}' 已存在`)];
    }
    if (db.users.some(u => u.email === email)) {
        return [200, Result.duplicate(`邮箱 '${email}' 已注册`)];
    }

    const newUser = {
        id: nextUserId++,
        username,
        password, // 实际后端会加密
        email,
        avatar: avatar || `/avatars/default.png`,
        role: 0, // 默认普通用户
        createTime: new Date().toISOString()
    };
    db.users.push(newUser);
    // 返回不含密码的用户信息
    const { password: _, ...userToReturn } = newUser;
    return [200, Result.success(userToReturn)];
});

// GET /api/auth/me (获取当前登录用户信息)
mock.onGet('/auth/me').reply(config => {
    const authCheck = checkAuth(config); // 使用已有的 checkAuth 进行 token 验证

    if (!authCheck.authenticated) {
        return [200, authCheck.reason]; // 如果 token 无效或未提供，返回未授权
    }

    // Token 有效，根据 token 中的 userId (在 checkAuth 的 user 对象中) 查找用户
    const loggedInUser = db.users.find(u => u.id === authCheck.user.userId);

    if (loggedInUser) {
        // 返回用户信息，但不包括密码
        const { password, ...userToReturn } = loggedInUser;
        return [200, Result.success(userToReturn)];
    } else {
        // 这种情况理论上不应该发生，如果 token 有效但找不到用户，说明数据不一致
        return [200, Result.error('根据Token未找到有效用户', 404)];
    }
});


// POST /api/auth/logout
mock.onPost('/auth/logout').reply(config => {
    const auth = checkAuth(config);
    if (!auth.authenticated) return [200, auth.reason]; // 或者直接返回 401 [401, auth.reason]

    // 模拟登出成功
    // 实际项目中会清除 localStorage 的 token
    // localStorage.removeItem('authToken');
    return [200, Result.success()];
});


// --- 博客模块 Mock ---

// POST /api/blogs (需要登录)
mock.onPost('/blogs').reply(config => {
    const auth = checkAuth(config);
    if (!auth.authenticated) return [200, auth.reason]; // 返回模拟的 401 Result

    const { title, content, tagIds = [] } = JSON.parse(config.data);
    if (!title || !content) {
        return [200, Result.badRequest('标题和内容不能为空')];
    }

    const newBlog = {
        id: nextBlogId++,
        userId: auth.user.userId,
        title,
        content,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        tagIds // 存储关联的 tag ID
    };
    db.blogs.push(newBlog);

    // 更新 blog_tags 关联表
    tagIds.forEach(tagId => {
        if (db.tags.some(t => t.id === tagId)) { // 确保 tag 存在
            db.blog_tags.push({ blog_id: newBlog.id, tag_id: tagId });
        }
    });

    return [200, Result.success(newBlog)];
});

// DELETE /api/blogs/{id} (需要登录，管理员或作者本人)
mock.onDelete(/\/blogs\/\d+$/).reply(config => {
    const auth = checkAuth(config);
    if (!auth.authenticated) return [200, auth.reason];

    const blogId = parseInt(config.url.split('/').pop(), 10);
    const blogIndex = db.blogs.findIndex(b => b.id === blogId);

    if (blogIndex === -1) {
        return [200, Result.notFound(`博客 ID ${blogId} 不存在`)];
    }

    const blog = db.blogs[blogIndex];

    // 权限检查：必须是管理员(role=1)或者博客作者本人
    if (auth.user.role !== 1 && blog.userId !== auth.user.userId) {
        return [200, Result.forbidden('无权删除此博客')];
    }

    // 删除博客
    db.blogs.splice(blogIndex, 1);
    // 删除关联的 blog_tags 记录
    db.blog_tags = db.blog_tags.filter(bt => bt.blog_id !== blogId);

    return [200, Result.success()];
});

// PUT /api/blogs/{id} (需要登录，作者本人)
mock.onPut(/\/blogs\/\d+$/).reply(config => {
    const auth = checkAuth(config);
    if (!auth.authenticated) return [200, auth.reason];

    const blogId = parseInt(config.url.split('/').pop(), 10);
    const blogIndex = db.blogs.findIndex(b => b.id === blogId);

    if (blogIndex === -1) {
        return [200, Result.notFound(`博客 ID ${blogId} 不存在`)];
    }

    const blog = db.blogs[blogIndex];


    // 权限检查：必须是博客作者本人
    if (blog.userId !== auth.user.userId) {
        return [200, Result.forbidden('无权修改此博客')];
    }

    const { title, content, tagIds } = JSON.parse(config.data);

    // 更新博客内容
    const updatedBlog = {
        ...blog,
        title: title ?? blog.title, // 如果没提供 title，则保留原来的
        content: content ?? blog.content,
        updateTime: new Date().toISOString(),
        tagIds: tagIds ?? blog.tagIds // 如果没提供 tagIds，则保留原来的
    };
    db.blogs[blogIndex] = updatedBlog;

    // 更新 blog_tags 关联表 (先删后增)
    if (tagIds) { // 只有提供了 tagIds 才更新关联
        db.blog_tags = db.blog_tags.filter(bt => bt.blog_id !== blogId);
        tagIds.forEach(tagId => {
            if (db.tags.some(t => t.id === tagId)) {
                db.blog_tags.push({ blog_id: blogId, tag_id: tagId });
            }
        });
    }


    return [200, Result.success()]; // PUT 通常不返回 body，返回成功即可
});


// GET /api/blogs (公共接口，支持筛选)
mock.onGet('/blogs').reply(config => {
    const params = config.params || {};
    let filteredBlogs = [...db.blogs];

    // 按标题筛选 (模糊匹配)
    if (params.title) {
        filteredBlogs = filteredBlogs.filter(b => b.title.includes(params.title));
    }

    // 按标签筛选
    if (params.tagId) {
        const tagIdNum = parseInt(params.tagId, 10);
        const blogIdsWithTag = db.blog_tags.filter(bt => bt.tag_id === tagIdNum).map(bt => bt.blog_id);
        filteredBlogs = filteredBlogs.filter(b => blogIdsWithTag.includes(b.id));
    }

    // 按用户筛选
    if (params.userId) {
        const userIdNum = parseInt(params.userId, 10);
        filteredBlogs = filteredBlogs.filter(b => b.userId === userIdNum);
    }

    // 按时间筛选 (简单示例，仅支持 YYYY-MM-DD)
    if (params.startTime) {
        filteredBlogs = filteredBlogs.filter(b => new Date(b.createTime) >= new Date(params.startTime));
    }
    if (params.endTime) {
        // 结束时间通常包含当天，所以加一天
        const endDate = new Date(params.endTime);
        endDate.setDate(endDate.getDate() + 1);
        filteredBlogs = filteredBlogs.filter(b => new Date(b.createTime) < endDate);
    }

    // 模拟返回博客列表，可以添加分页逻辑
    // 为每个博客添加关联的 tag 完整信息 (可选)
    const blogsWithTags = filteredBlogs.map(blog => {
        const relatedTagIds = db.blog_tags.filter(bt => bt.blog_id === blog.id).map(bt => bt.tag_id);
        const tags = db.tags.filter(tag => relatedTagIds.includes(tag.id));
        // 查找作者信息 (可选)
        const author = db.users.find(u => u.id === blog.userId);
        const {password: _, ...authorInfo} = author || {}; // 移除密码

        return { ...blog, tags, author: authorInfo }; // 在返回结果中包含 tags 数组和作者信息
    });


    return [200, Result.success(blogsWithTags)];
});

// GET /api/blogs/{id} (公共接口)
mock.onGet(/\/blogs\/\d+$/).reply(config => {
    const blogId = parseInt(config.url.split('/').pop(), 10);
    const blog = db.blogs.find(b => b.id === blogId);

    if (blog) {
        // 添加关联的 tag 和作者信息
        const relatedTagIds = db.blog_tags.filter(bt => bt.blog_id === blog.id).map(bt => bt.tag_id);
        const tags = db.tags.filter(tag => relatedTagIds.includes(tag.id));
        const author = db.users.find(u => u.id === blog.userId);
        const {password: _, ...authorInfo} = author || {};

        return [200, Result.success({ ...blog, tags, author: authorInfo })];
    } else {
        return [200, Result.notFound(`博客 ID ${blogId} 不存在`)];
    }
});

// POST /api/blogs/upload (需要登录)
mock.onPost('/blogs/upload').reply(config => {
    // const auth = checkAuth(config);
    // if (!auth.authenticated) return [200, auth.reason];

    // 检查是否是 FormData
    if (!(config.data instanceof FormData)) {
        return [400, Result.badRequest('请求必须是 multipart/form-data 类型')];
    }
    const file = config.data.get('file');
    if (!file) {
        return [400, Result.badRequest('缺少 "file" 字段')];
    }

    // 模拟文件大小检查 MaxUploadSizeExceededException
    // const maxSize = 5 * 1024 * 1024; // 假设最大 5MB
    // if (file.size > maxSize) {
    //     return [200, Result.error(`上传文件大小超过限制: ${maxSize / 1024 / 1024}MB`, 413)]; // 413 Payload Too Large
    // }


    // 模拟上传成功，返回图片 URL
    // const mockImageUrl = `/uploads/images/mock-${Date.now()}-${file.name}`;
    // 调试版URL
    const mockImageUrl = `/images/pic1.png`;

    console.log(`Mock uploaded file ${file.name} to ${mockImageUrl}`);

    // 按照后端接口返回格式
    const responseData = {
        url: mockImageUrl,
        success: 1 // 适配某些编辑器如 Editor.md
    };
    return [200, Result.success(responseData)];
});

// POST /api/tags (需要管理员)
mock.onPost('/tags').reply(config => {
    const auth = checkAuth(config, 1); // 1 表示需要管理员权限
    if (!auth.authenticated) return [200, auth.reason];

    const { name } = JSON.parse(config.data);
    if (!name) {
        return [200, Result.badRequest('标签名称不能为空')];
    }

    // 模拟 DuplicateKeyException
    if (db.tags.some(t => t.name === name)) {
        return [200, Result.duplicate(`标签 '${name}' 已存在`)];
    }

    const newTag = {
        id: nextTagId++,
        name
    };
    db.tags.push(newTag);
    return [200, Result.success(newTag)];
});

// DELETE /api/tags/{id} (需要管理员)
mock.onDelete(/\/tags\/\d+$/).reply(config => {
    const auth = checkAuth(config, 1); // 需要管理员权限
    if (!auth.authenticated) return [200, auth.reason];

    const tagId = parseInt(config.url.split('/').pop(), 10);
    const tagIndex = db.tags.findIndex(t => t.id === tagId);

    if (tagIndex === -1) {
        return [200, Result.notFound(`标签 ID ${tagId} 不存在`)];
    }

    // 检查标签是否仍被博客使用 (可选，取决于后端逻辑)
    const isUsed = db.blog_tags.some(bt => bt.tag_id === tagId);
    if (isUsed) {
        // 可以返回错误，或者允许删除但解除关联
        return [200, Result.error(`标签 '${db.tags[tagIndex].name}' 正在被使用，无法删除`, 400)]; // 400 Bad Request
    }


    // 删除标签
    db.tags.splice(tagIndex, 1);
    // (如果允许删除被使用的标签，需要在这里解除 blog_tags 的关联)
    // db.blog_tags = db.blog_tags.filter(bt => bt.tag_id !== tagId);

    return [200, Result.success()];
});

// GET /api/tags (公共接口)
mock.onGet('/tags').reply(config => {
    return [200, Result.success(db.tags)];
});

// --- Fallback for unhandled requests ---
// mock.onAny().passThrough(); // 让未匹配的请求真实发送 (如果需要)
mock.onAny().reply(config => {
    console.warn(`Unhandled mock request: ${config.method.toUpperCase()} ${config.url}`);
    return [404, { message: 'Mock endpoint not found' }];
});


console.log('Mock adapter initialized.');

// 你可以在需要的时候移除 mock
// mock.restore();
