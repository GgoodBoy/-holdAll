import Vue from 'vue'
import App from './App'
import http from './http/index'
import serverConfig from './http/serverConfig'
import login from './login'
import store from './store'
const formatSeconds = value =>{
  let m = parseInt(value % 3600 / 60)
  let s = parseInt(value % 3600 % 60)
  let mStr = m<10?`0${m}`:m;
  let sStr = s<10?`0${s}`:s;
  if(value<3600){
      return `${mStr}:${sStr}`
  }else{
      let h = parseInt(value/3600)
      let hStr = h<10?`0${h}`:h;
      return `${hStr}:${mStr}:${sStr}`
  }
};
Vue.config.productionTip = false;
App.mpType = 'app'
Vue.prototype.$http = http;
Vue.prototype.$server = serverConfig;
Vue.prototype.$login = login;
Vue.prototype.$formatSeconds = formatSeconds;
const app = new Vue({
  store,
  ...App
})
app.$mount()
