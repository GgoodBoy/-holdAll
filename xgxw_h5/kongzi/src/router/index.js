import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'

Vue.use(Router)
const Index = () => import(/* webpackChunkName: "index" */ '@/views/index')
// const Share = () => import(/* webpackChunkName: "share" */ '@/views/share')
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'/',
      name:'index',
      component:Index,
    },
  ]
})
