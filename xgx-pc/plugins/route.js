import LoadingBar from '~/components/LoadingBar/index'
import { getCookie } from "../utils/cache.js";
let temp = {}
export default ({ app,redirect }) => {
    app.router.beforeEach((to, from,next) => {
        if(temp.LoadingBar){
            temp.LoadingBar.end();
            temp.LoadingBar = null;
        }
        setTimeout(()=>{
            temp.LoadingBar = LoadingBar;
            temp.LoadingBar.start();
        },100)
        setTimeout(()=>{
            if(temp.LoadingBar){
                temp.LoadingBar.end();
                temp.LoadingBar = null;
            }
        },3000)
        next()
    })
    app.router.afterEach((to, from) => {
        setTimeout(()=>{
            if(temp.LoadingBar){
                temp.LoadingBar.end();
                temp.LoadingBar = null;
            }
        },300)
    })
}