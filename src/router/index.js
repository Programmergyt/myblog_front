import { createRouter, createWebHistory } from 'vue-router'
import ContentLayout from '@/layout/ContentLayout.vue'
import BlogCatalogue from '@/pages/BlogCatalogue.vue'
import BlogForm from '@/pages/BlogForm.vue'
import BlogDetail from '@/pages/BlogDetail.vue'
import About from '@/pages/About.vue'
import Register from "@/pages/Register.vue";
import Login from "@/pages/Login.vue";

const routes = [
    { path: '/', component: ContentLayout
        ,children: [
        { path: '/', component: BlogCatalogue },
        { path: '/blogform',  component: BlogForm},
        { path: 'about',  component: About },
        { path: 'post/:postId',  component: BlogDetail},
        ]
    },
    { path: '/register', component: Register},
    { path: '/login',  component: Login},
    { path: '/:catchAll(.*)', redirect: '/' }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

