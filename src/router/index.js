import { createRouter, createWebHistory } from 'vue-router'
import ContentLayout from '@/layout/ContentLayout.vue'
import BlogCatalogue from '@/pages/BlogCatalogue.vue'
import Category from '@/pages/Category.vue'
import CategoryList from '@/pages/CategoryList.vue'
import BlogDetail from '@/pages/BlogDetail.vue'
import About from '@/pages/About.vue'
import Register from "@/pages/Register.vue";
import Login from "@/pages/Login.vue";

const routes = [
    { path: '/', component: ContentLayout ,
        children: [
        { path: '/', component: BlogCatalogue },
        { path: 'category',  component: Category},
        { path: 'category/:categoryId',  component: CategoryList},
        { path: 'about',  component: About },
        { path: 'post/:postId',  component: BlogDetail},
    ]},
    { path: '/register', component: Register},
    { path: '/login',  component: Login},
    { path: '/:catchAll(.*)', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

// | 路由路径                    | 组件名                | 描述                           |
// | ----------------------- | ------------------ | ---------------------------- |
// | `/`                     | `BlogCatalogue`    | 博客首页                         |
// | `/category`             | `CategoryPage`     | 分类总览页面                       |
// | `/category/:categoryId` | `CategoryListPage` | 某个具体分类的文章列表（如 `/category/1`） |
// | `/about`                | `AboutPage`        | 关于我页面                        |
// | `/post/:postId`         | `BlogDetail`       | 文章详情页面（如 `/post/123`）        |
// | `/register`             | `RegisterPage`     | 注册页面                         |
// | `/login`                | `LoginPage`        | 登录页面                         |
// | `/:catchAll(.*)`        | 重定向到 `/`           | 404 时重定向首页                   |
