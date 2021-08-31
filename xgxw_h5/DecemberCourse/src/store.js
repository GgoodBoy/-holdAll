import Vue from 'vue'
export let store = Vue.observable({
    userInfo:{},
    posterShow:false,
    scrollTop:0,
    inApp:false,
})
export let mutations = {
    setUserInfo(data){
        store.userInfo = data;
    },
    setPosterShow(data){
        store.posterShow = data;
    },
    setScrollTop(data){
        store.scrollTop = data;
    },
    setInApp(data){
        store.inApp = data;
    }
}