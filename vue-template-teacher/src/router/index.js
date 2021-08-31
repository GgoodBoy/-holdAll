import Vue from 'vue'
import Router from 'vue-router'
import {staticRoutes} from './routes'

Vue.use(Router)

let router = new Router({
    mode: 'hash',
    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(savedPosition)
                }, 700)
            })
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    },
    routes: staticRoutes
});
export default router;
