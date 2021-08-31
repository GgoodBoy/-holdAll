// import Vue from 'vue'
// import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

// Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// })
import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'

Vue.use(Router)
const Index = () => import(/* webpackChunkName: "index" */ '@/pages/index')
const MyFubao = () => import(/* webpackChunkName: "order" */ '@/pages/myFubao')
const RecordFubao = () => import(/* webpackChunkName: "result" */ '@/pages/recordFubao')
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
      path:'/myfubao',
      name:'myfubao',
      component:MyFubao,
    },
    {
      path:'/recordfubao',
      name:'recordfubao',
      component:RecordFubao,
    }
  ]
})

