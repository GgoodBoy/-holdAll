import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'

Vue.use(Router)
const Index = () => import(/* webpackChunkName: "index" */ '@/pages/index')
const Receive = () => import(/* webpackChunkName: "receive" */ '@/pages/receive')
const Rule = () => import(/* webpackChunkName: "rule" */ '@/pages/rule')
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'/',
      name:'index',
      component:Index,
    },
    {
      path:'/receive',
      name:'receive',
      component:Receive,
    },
    {
      path:'/rule',
      name:'rule',
      component:Rule,
    }
  ]
})
