import Vue from 'vue'
import LoadingBar from '~/components/LoadingBar/index'
import api from '~/api/index'
import * as utils from '~/utils/cache.js'
import regExp from '~/utils/regExp.js'
import VueLazyLoad from 'vue-lazyload'
import {Component} from 'vue-property-decorator'
Component.registerHooks(['head'])
const vLoading = require('~/assets/images/lazy-bg.png')
export default ()=>{
    Vue.use(VueLazyLoad,{
        loading:vLoading,
        error:vLoading
    })
    Vue.prototype.$loadingBar = LoadingBar;
    Vue.prototype.$server = api;
    Vue.prototype.$regExp = regExp;
    Vue.prototype.$getCookie = utils.getCookie;
    Vue.prototype.$setCookie = utils.setCookie;
}