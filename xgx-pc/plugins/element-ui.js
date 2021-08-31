import Vue from 'vue'
import Element from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en'
import { Loading } from 'element-ui'
export default () => {
  Vue.use(Element)
  Vue.prototype.$loading = Loading;
}
