import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Button, Dialog, Field, CellGroup,Toast,Loading } from 'vant';
// import scroll from 'vue-seamless-scroll'
import 'vant/lib/index.css';
import 'babel-polyfill'
import promise from 'es6-promise'
import { setRem } from 'utils/tools.js'
import { SetCookies, GetCookies, DelCookies } from './utils/setCookies'
import server from './serverConfig.js'
import axios from 'utils/axiosHttp.js'
// import eruda from 'eruda'
// eruda.init();
setRem();
promise.polyfill();
const app = createApp(App);
//vue3的注册全局注册方法
app.config.globalProperties.$server = server;
app.config.globalProperties.$http = axios;
app.config.globalProperties.$setCookie = SetCookies;
app.config.globalProperties.$getCookie = GetCookies;
app.config.globalProperties.$delCookie = DelCookies;
const modules = [router,Button, Dialog, Field, CellGroup,Toast,Loading];
for (const iterator of modules) {
    app.use(iterator)
}
app.mount('#app')