// src/services/axios.js
import axios from 'axios'

// 创建 axios 实例
const instance = axios.create({
    baseURL: '/api',
    timeout: 5000
})

// 请求拦截器（在每次发送请求之前执行）
// 作用：从 localStorage 中读取 JWT 令牌，自动加入请求头中
// instance.interceptors.request.use(config => {
//     // 从本地存储中读取之前登录时保存的 token
//     const token = localStorage.getItem('token');
//
//     // 如果 token 存在，设置请求头 Authorization 字段
//     if (token) {
//         // 按照 JWT 标准格式，加上 Bearer 前缀（后端也按这个格式解析）
//         config.headers.Authorization = 'Bearer ' + token;
//     }
//
//     // 返回修改后的请求配置对象
//     return config;
//
// }, error => {
//     // 如果请求配置出错（很少见），返回错误
//     return Promise.reject(error);
// });

// 请求拦截器（可选启用）
instance.interceptors.request.use(config => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers.Authorization = 'Bearer ' + token;
    // }
    return config;
}, error => {
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    return response.data
}, error => {
    return Promise.reject(error);
});

// 响应拦截器（在每次接收到响应之后执行）
// 作用：判断后端返回的数据结构是否成功，并统一处理 JWT 过期等异常情况
// instance.interceptors.response.use(
//     response => {
//          const res = response.data; // 后端统一返回结构：{ code, msg, data }
//         return response.data
//         res.msg = undefined; // 可选：清理无用的提示信息，避免污染前端显示
//
//     //     if (res.code === 1) {
//     //         // 如果 code 为 1，表示成功，返回真正的数据部分（res.data）
//     //         return res.data;
//     //     } else {
//     //         // 如果 code 不是 1，表示失败，检查是否是 token 问题
//     //         if (res.code === 401 || res.msg === '令牌无效或已过期') {
//     //             // 如果是未登录或 token 过期，清除本地 token，并跳转到登录页
//     //             localStorage.removeItem('token');
//     //             window.location.href = '/login';
//     //         }
//     //
//     //         // 其他错误，向调用方抛出错误信息（res.msg）
//     //         return Promise.reject(res.msg);
//     //     }
//     // },
//     //
//     // error => {
//     //     // 如果是网络错误或者服务端返回 401 状态码（token 无效）
//     //     if (error.response && error.response.status === 401) {
//     //         // 清除本地 token，强制跳转登录页
//     //         localStorage.removeItem('token');
//     //         window.location.href = '/login';
//     //     }
//     //
//     //     // 其他错误，统一向调用方抛出
//     //     return Promise.reject(error);
//     }
// );

export default instance
