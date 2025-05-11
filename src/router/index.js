import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import CategoryPage from '@/pages/CategoryPage.vue'
import CategoryListPage from '@/pages/CategoryListPage.vue'
import BlogDetail from '@/pages/BlogDetail.vue'
import AboutPage from '@/pages/AboutPage.vue'
import RegisterDialog from "@/pages/RegisterDialog.vue";

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/category', name: 'Category', component: CategoryPage },
    { path: '/category/:categoryId', name: 'CategoryList', component: CategoryListPage, props: true },
    { path: '/post/:postId', name: 'PostDetail', component: BlogDetail, props: true },
    // { path: '/register', name: 'Register', component: RegisterDialog, props: true },
    { path: '/about', name: 'About', component: AboutPage },
    { path: '/:catchAll(.*)', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
