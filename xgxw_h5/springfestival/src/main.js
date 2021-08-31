// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import axios from './http'
import Es6Promise from 'es6-promise'
import serverConfig from './serverConfig'
import { SetCookies, GetCookies, DelCookies } from './utils/setCookies'
import tools from './utils/tools'
import Toast from './components/Toast/index'
Vue.use(Toast)
Es6Promise.polyfill()
tools.setRem()
Vue.config.productionTip = false
Vue.use(Vant);
Vue.prototype.$http = axios;
Vue.prototype.$server = serverConfig;
Vue.prototype.$setCookie = SetCookies;
Vue.prototype.$getCookie = GetCookies;
Vue.prototype.$delCookie = DelCookies;
/* eslint-disable no-new */
window.addEventListener('popstate', function (e) { router.isBack = true },false)
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

