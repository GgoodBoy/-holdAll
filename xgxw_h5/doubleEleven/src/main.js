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
import { SetCookies ,  GetCookies, DelCookies } from './setCookies.js'
// import VConsole from 'vconsole' 
// let vConsole = new VConsole() 
Es6Promise.polyfill()
Vue.config.productionTip = false
Vue.use(Vant);
Vue.prototype.$http = axios;
Vue.prototype.$server = serverConfig;
Vue.prototype.$setCookie = SetCookies;
Vue.prototype.$getCookie = GetCookies;
Vue.prototype.$delCookie = DelCookies;
(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
    recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        var width = clientWidth>=414?414:clientWidth
        docEl.style.fontSize = 100 * (width / 750) + 'px';
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
