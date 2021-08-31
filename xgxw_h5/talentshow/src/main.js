import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Button,Dialog,Field,CellGroup,Toast,Loading,Tab,Tabs,Switch,Icon,Slider,DropdownMenu,DropdownItem} from 'vant';
import 'vant/lib/index.css';
import { setRem } from 'utils/tools.js'
import server from './serverConfig.js'
import axios from 'utils/axiosHttp.js'
// import eruda from 'eruda'
// eruda.init();
setRem(); 
const app = createApp(App);
//vue3的注册全局注册方法
app.config.globalProperties.$server = server;
app.config.globalProperties.$http = axios;
const modules = [router,Button,Dialog,Field,CellGroup,Toast,Loading,Tab,Tabs,Switch,Icon,Slider,DropdownMenu,DropdownItem];
for (const iterator of modules) {
    app.use(iterator)
}
app.mount('#app')
