import { createRouter, createWebHashHistory } from 'vue-router'
import index from '../views/index.vue'

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "index" */ '@/views/index.vue')//首页
  }
  // ,
  // {
  //   path: '/about',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
