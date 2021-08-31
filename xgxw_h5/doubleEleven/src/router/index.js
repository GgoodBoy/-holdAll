import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'

Vue.use(Router)
const Index = () => import(/* webpackChunkName: "index" */ '@/views/index')
const Rule = () => import(/* webpackChunkName: "index" */ '@/views/rule')
export default new Router({
  mode:'hash',
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
      path:'/rule',
      name:'rule',
      component:Rule,
    }
  ]
})
