import Es6Promise from 'es6-promise'
import 'babel-polyfill'
import 'core-js'
import 'es6-shim'
import Vant from 'vant';
import md5 from 'js-md5';
import Vue from 'vue'
import App from './App'
import router from './router'
import { Lazyload } from 'vant';
import 'vant/lib/index.css';
import axios from './axios/index.js'
import { SetCookies ,  GetCookies, DelCookies ,setLocalStorage ,getLocalStorage} from './utils/setCookies.js'
import serverConfig from './axios/apiConfig'
import store from './store'
import utils from './utils/index'
import regExp from './utils/regExp'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import hls from 'videojs-contrib-hls'
import VideoPlayer from 'vue-video-player';
import "video.js/dist/video-js.css"
import "vue-video-player/src/custom-theme.css"
import isLogin from './utils/login'
Vue.config.productionTip = false
Es6Promise.polyfill()
// import VConsole from 'vconsole' //import vconsole
// let vConsole = new VConsole() // 初始化


Vue.use(Vant);

Vue.use(VueAwesomeSwiper)
Vue.use(Lazyload);
Vue.use(hls)
Vue.use(VideoPlayer)

Vue.prototype.$http = axios;
Vue.prototype.$server = serverConfig;
Vue.prototype.$isLogin = isLogin;
Vue.prototype.$setCookie = SetCookies;
Vue.prototype.$getCookie = GetCookies;
Vue.prototype.$delCookie = DelCookies;
Vue.prototype.$setLocalStorage = setLocalStorage;
Vue.prototype.$getLocalStorage = getLocalStorage;
Vue.prototype.$md5 = md5;
Vue.prototype.$utils = utils;
Vue.prototype.$regExp = regExp;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
