import { createRouter, createWebHashHistory } from 'vue-router'
import index from '../views/index.vue'

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "index" */ '@/views/index.vue'),//首页
    meta:{title:"国学智慧达人计划"}
  },
  {
    path: '/courseDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/courseDetail.vue'),
    meta:{title:"国学智慧达人计划"}
  },
  {
    path: '/tips',
    component: () => import(/* webpackChunkName: "about" */ '../views/tips.vue'),
    meta:{title:"国学智慧达人计划"}
  },
  {
    path: '/order',
    component: () => import(/* webpackChunkName: "about" */ '../views/order.vue'),
    meta:{title:"国学智慧达人计划"}
  }
]
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
