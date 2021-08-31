import 'babel-polyfill'
import 'core-js'
import 'es6-shim'
import Es6Promise from 'es6-promise'
import Vue from 'vue'
import App from './App'
import style from '../../assets/style/reset.scss'
import axios from '../../http'
import serverConfig from '../../serverConfig'
import { SetCookies , GetCookies, DelCookies } from '../../utils/setCookies'
import tools from '../../utils/tools'
import Toast from '../../components/Toast/index'
Vue.use(Toast)
// import VConsole from 'vconsole' 
// let vConsole = new VConsole()
Es6Promise.polyfill()
tools.setRem()
Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.prototype.$server = serverConfig;
Vue.prototype.$setCookie = SetCookies;
Vue.prototype.$getCookie = GetCookies;
Vue.prototype.$delCookie = DelCookies;
new Vue({
  el: '#app',
  render: h => h(App)
})
