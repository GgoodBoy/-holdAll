import 'babel-polyfill'
import 'core-js'
import 'es6-shim'
import Es6Promise from 'es6-promise'
import Vant from 'vant';
import 'vant/lib/index.css';
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './http.js'
import serverConfig from './serverConfig'
// import VConsole from 'vconsole' //import vconsole
// let vConsole = new VConsole() // 初始化
Es6Promise.polyfill()
Vue.config.productionTip = false
Vue.use(Vant);
Vue.prototype.$http = axios;
Vue.prototype.$server = serverConfig;
(function(){
  var docEl = document.documentElement,
    resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
    recalc = function () {
      var timer = setInterval(function(){
        var clientWidth = docEl.clientWidth;
        if(clientWidth&&clientWidth>0){
          docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
          clearInterval(timer)
        }
      },100)
    };
  if (!document.addEventListener) return;
  window.addEventListener(resizeEvt, recalc, false);
  recalc()
})()
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
