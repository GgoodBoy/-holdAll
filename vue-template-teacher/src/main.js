import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import $ from 'jquery'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import './assets/element-theme/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // permission control
import '@/styles/element-variables.scss'
import server from '@/serverConfig.js'
import {getPermissions,getUserRoutes,authJudge} from '@/utils/auth'
import { dynamicRoutes } from '@/router/routes'
import '../static/libs/ue/ueditor.config'
import 'babel-polyfill'
import 'core-js'
import 'es6-shim'
import '@/assets/style.css'
import '@/assets/style1.css'
import '@/assets/style2.css'
import '@/assets/style3.css'
import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import Editor from './components/editor/EditorNew.vue';
import tipsInfo from "./components/tipsComponent/tips.vue";
import directives from '@/directives.js'
Vue.component("Editor",Editor);
Vue.component('tipsInfo',tipsInfo)
Vue.use(VueQuillEditor);
Vue.use(ElementUI)
Vue.use(directives)

Vue.config.productionTip = false

/**
 * server
 */
import service from './utils/request'
Vue.prototype.$http = service;
Vue.prototype.$server = server;
Vue.prototype.environmenttarget = process.env.argv;
Vue.prototype.$getPermissions = getPermissions;
Vue.prototype.$authJudge = authJudge;
/**
 * utils
 */
import utils from './utils/index'
Vue.prototype.$utils = utils;
/**
 * common filter
 */
import * as filterList from './filters/index'

Object.keys(filterList).forEach(key => {
    Vue.filter(key, filterList[key])
})
router.beforeEach((to,from,next)=>{
    if(store.state.user.addRouteFlag){
        next();
        return;
    }
    if(to.path=='/login'||to.path=='/404'||from.path=='/login'){
        next();
        return;
    }
    if(to.path=='/login'){
        document.cookie.includes('xgx-user-tk');
        next(false)
        return;
    }
    
    let permissions = localStorage.getItem('permissions');
    if(permissions&&JSON.parse(permissions).length>0){
        if(router.options.routes.length<=4){
            let authArr = JSON.parse(permissions)
            let routes = getUserRoutes(authArr, dynamicRoutes, []);
            let allRoutes = [...router.options.routes,...routes]
            router.options.routes = allRoutes
            router.addRoutes(routes)
            router.addRoutes([{ path: '*', redirect: '/404', hidden: true ,meta:{}}])
            next({ ...to, replace: true })
        }else{
            next()
        }
    }else{
        if(to.meta.code){
            next('/login')
        }else{
            next()
        }
    }
    
})

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
