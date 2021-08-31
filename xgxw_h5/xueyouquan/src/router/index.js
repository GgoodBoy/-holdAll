import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'

Vue.use(Router)
const Index = () => import(/* webpackChunkName: "Course" */ '@/views/index.vue')
const Topic = () => import(/* webpackChunkName: "Course" */ '@/views/topic.vue')
export default new Router({
  mode:'hash',
  routes: [
    {
      path:'/details',
      name:'details',
      component:Index,
    },
    {
      path:'/topic',
      name:'topic',
      component:Topic,
    }
  ]
})
