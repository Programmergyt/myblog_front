// src/services/axios.js
import axios from 'axios';
import {ElMessage, ElMessageBox} from "element-plus";

// 创建 axios 实例
const instance = axios.create({
    baseURL: '/api', // 后端 API 的基础路径
    timeout: 10000 // 请求超时时间
});

// --- 请求拦截器 ---
// 在发送请求之前做些什么
instance.interceptors.request.use(config => {
    // 定义不需要携带 token 的路径列表 (例如登录、注册、公共查看接口)
    const publicPaths = [
        '/auth/login',
        '/auth/register',
        '/stats',
        '/about',
        '/blogs/upload',
        { method: 'get', url: /^\/blogs(\/\d+)?$/ }, // 匹配 /blogs 或 /blogs/123
        { method: 'get', url: '/tags' },
        // 其他公共接口...
        { method: 'get', url: '/recipes/search'},
        { method: 'get', url: '/animation'},
        '/tools/pdf/merge', // 工具类接口通常也无需登录
        '/tools/pdf/split',
        '/tools/folder/size',
        '/tools/folder/structure',
    ];

    // 检查当前请求是否在 publicPaths 中
    const isPublic = publicPaths.some(path => {
        if (typeof path === 'string') {
            return config.url === path;
        }
        if (typeof path === 'object' && path.method && path.url instanceof RegExp) {
            // 检查方法和 URL 正则表达式
            return config.method.toLowerCase() === path.method.toLowerCase() && path.url.test(config.url);
        }
        if (typeof path === 'object' && path.method && typeof path.url === 'string') {
            // 检查方法和 URL 字符串
            return config.method.toLowerCase() === path.method.toLowerCase() && config.url === path.url;
        }
        return false;
    });

    // 如果不是公共路径，则尝试从 localStorage 获取 token 并添加到请求头
    if (!isPublic) {
        const token = localStorage.getItem('authToken'); // 假设 token 存储在 localStorage 的 'authToken' 键中
        if (token) {
            // 按照后端 LoginCheckInterceptor 的要求，添加 'Bearer ' 前缀
            config.headers.Authorization = 'Bearer ' + token;
        } else {
            // 如果需要 token 但本地没有，可以选择取消请求或让后端处理（取决于业务逻辑）
            console.warn(`Request to ${config.url} requires authentication token, but none was found.`);
            // return Promise.reject('No authentication token found.'); // 取消请求
        }
    }

    return config; // 返回配置好的 config 对象
}, error => {
    // 对请求错误做些什么
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
});

// --- 响应拦截器 ---
// 对响应数据做点什么
instance.interceptors.response.use(response => {
    // 后端返回的数据结构是 { code: number, msg: string, data: any }
    const res = response.data;

    // 如果响应是文件流 (Blob)，直接返回 response，让调用方处理
    if (response.request.responseType === 'blob') {
        // 可以检查 response.headers['content-type'] 来确认文件类型
        // 例如：if (response.headers['content-type'] === 'application/pdf')
        return response; // 直接返回整个响应对象，包含 headers 和 data (Blob)
    }

    // 检查自定义的 code 字段
    if (res && typeof res.code !== 'undefined') {
        if (res.code === 1) { // 后端定义 1 为成功
            // 请求成功，直接返回 data 部分
            return response;
        } else {
            // 请求失败 (code !== 1)
            console.error('API Error:', res.msg || 'Unknown error');
            // 检查是否是未授权错误 (根据 LoginCheckInterceptor 返回的格式)
            if (res.code === 401 || res.msg === '未登录' || res.msg === '令牌无效或已过期') {
                console.warn('Authentication required or token expired. ');
                // 清除本地存储的 token
                localStorage.removeItem('authToken');
                // 返回一个被拒绝的 Promise，中断当前的调用链
                return Promise.reject(new Error(res.msg || 'Authentication Failed'));
            }
            return Promise.reject(new Error(res.msg || 'API request failed'));
        }
    } else {
        // 如果返回的数据结构不符合预期 { code, msg, data }
        // 但 HTTP 状态码是 2xx，可能是非标准成功响应或接口问题
        console.warn('Received non-standard successful response:', response);
        // 仍然返回数据，让调用方决定如何处理
        return response.data;
    }

}, error => {
    // 对响应错误做点什么 (HTTP 状态码不是 2xx)
    console.error('Response Interceptor Error:', error);

    if (error.response) {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        const status = error.response.status;
        const data = error.response.data; // 后端可能在错误响应体中包含信息

        console.error(`Error Status: ${status}`);
        if (data && data.msg) {
            console.error(`Error Message: ${data.msg}`);
        } else if (typeof data === 'string') {
            console.error(`Error Data: ${data}`);
        }


        if (status === 401) {
            // 未授权错误 (虽然我们期望后端在 200 响应中用 code=401，但也要处理 HTTP 401)
            console.warn('HTTP 401 Unauthorized. Redirecting to login.');
            localStorage.removeItem('authToken');
            // if (typeof window !== 'undefined') {
            //     window.location.href = '/login';
            // }
            return Promise.reject(new Error(data?.msg || 'Unauthorized'));
        } else if (status === 403) {
            // 禁止访问 (权限不足)
            return Promise.reject(new Error(data?.msg ||'Forbidden'));
        } else if (status === 404) {
            // 资源未找到
            return Promise.reject(new Error(data?.msg ||'Resource Not Found'));
        }
        // 其他 HTTP 错误状态码
        return Promise.reject(new Error(data?.msg || error.message || `HTTP Error ${status}`));

    } else if (error.request) {
        // 请求已发出，但没有收到响应 (例如网络问题、超时)
        console.error('No response received:', error.request);
        return Promise.reject(new Error('Network error or server did not respond.'));
    } else {
        // 在设置请求时触发了一个错误
        console.error('Error setting up request:', error.message);
        return Promise.reject(error);
    }
});

export default instance; // 导出配置好的实例
