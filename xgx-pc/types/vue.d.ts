import VueRouter, { Route } from "vue-router";
import { NuxtAxiosInstance } from "@nuxtjs/axios"
import Vue from 'vue'
//import { string } from "_postcss-selector-parser@6.0.2@postcss-selector-parser";
// import * as Element from 'element-ui'
interface LoadingBar{
  init:Function
  start:Function
  end:Function
}
interface RegExpObj{
  phone:RegExp
  pwd:RegExp
}
declare module "vue/types/vue" {
    interface Vue {
      $router: VueRouter;
      $route: Route;
      $Message: any;
      $loadingBar:LoadingBar;
      setTest:Function,
      $server:Object,
      $axios:NuxtAxiosInstance,
      $regExp:RegExpObj,
      $getCookie:Function,
      $setCookie:Function,
    }
  }

declare module "*.vue" {
  export default Vue
}  
export = Element