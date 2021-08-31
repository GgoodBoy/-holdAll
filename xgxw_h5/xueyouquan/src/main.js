import 'babel-polyfill'
import 'core-js'
import 'es6-shim'
import Es6Promise from 'es6-promise'
import Vant from 'vant';
import 'vant/lib/index.css';
import { ImagePreview } from 'vant';
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './http.js'
import store from './store'

// import VConsole from 'vconsole' 
// let vConsole = new VConsole()
Es6Promise.polyfill()

Vue.use(Vant);
Vue.use(ImagePreview);

Vue.prototype.$http = axios;
(function(){
  var docEl = document.documentElement,
    resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
    recalc = function () {
      var timer = setInterval(function(){
        var clientWidth = docEl.clientWidth;
        if(clientWidth&&clientWidth>0){
          let width = clientWidth>=414?414:clientWidth
          docEl.style.fontSize = 100 * (width / 750) + 'px';
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
  store,
  router,
  render: h => h(App)
})
