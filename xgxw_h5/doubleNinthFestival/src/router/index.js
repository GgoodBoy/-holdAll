import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'

Vue.use(Router)
const Index = () => import(/* webpackChunkName: "index" */ '@/views/index')
const Second = () => import(/* webpackChunkName: "second" */ '@/views/second')
const Third = () => import(/* webpackChunkName: "third" */ '@/views/third')
const Fourth = () => import(/* webpackChunkName: "fourth" */ '@/views/fourth')
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'/',
      name:'index',
      component:Index,
    },
    {
      path:'/second',
      name:'second',
      component:Second,
    },
    {
      path:'/third',
      name:'third',
      component:Third,
    },
    {
      path:'/fourth',
      name:'fourth',
      component:Fourth,
    }
  ]
})
