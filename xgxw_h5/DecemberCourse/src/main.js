import 'babel-polyfill'
import 'core-js'
import 'es6-shim'
import Es6Promise from 'es6-promise'
import Vant from 'vant';
import 'vant/lib/index.css';
import Vue from 'vue'
import App from './App'
import axios from './http.js'
import serverConfig from './serverConfig'
import router from './router'
import { SetCookies ,  GetCookies, DelCookies } from './utils/setCookies.js'
import tools from './utils/tools'
// import VConsole from 'vconsole' 
// let vConsole = new VConsole() 
Es6Promise.polyfill()
tools.setRem()
Vue.config.productionTip = false
Vue.use(Vant);
Vue.prototype.$http = axios;
Vue.prototype.$server = serverConfig;
Vue.prototype.$setCookie = SetCookies;
Vue.prototype.$getCookie = GetCookies;
Vue.prototype.$delCookie = DelCookies;
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
