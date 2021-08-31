import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'

Vue.use(Router)
const Index = () => import(/* webpackChunkName: "index" */ '@/views/index')
const Order = () => import(/* webpackChunkName: "order" */ '@/views/order')
const Result = () => import(/* webpackChunkName: "result" */ '@/views/result')
const Poster = () => import(/* webpackChunkName: "poster" */ '@/views/poster')
export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/index'
    },
    {
      path:'/index',
      name:'index',
      component:Index,
    },
    {
      path:'/order',
      name:'order',
      component:Order,
    },
    {
      path:'/result',
      name:'result',
      component:Result,
    },
    {
      path:'/poster',
      name:'poster',
      component:Poster,
    }
  ]
})
