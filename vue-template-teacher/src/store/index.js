import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import appConfig from './modules/appConfig'
import getters from './getters'
import homeConfig from './modules/homeConfig'
import goodsPage from './modules/goodsPage'
import wxStore from './modules/wxStoreConfig'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        user,
        appConfig,
        homeConfig,
        goodsPage,
        wxStore
    },
    getters
})

export default store
