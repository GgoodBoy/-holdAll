import Vue from 'vue'
export let store = Vue.observable({
    userInfo:{},
    inApp:false,
    posterIndex:0,
    testName:'',
    shakePoster:false,
    testAgain: false
})
export let mutations = {
    setUserInfo(data){
        store.userInfo = data;
    },
    setInApp(data){
        store.inApp = data;
    },
    setPosterIndex(data){
        store.posterIndex = data;
    },
    setShakePoster(data){
        store.shakePoster = data;
    },
    setTestName(data){
        store.testName = data;
    },
    setTestAgain(data){
        store.testAgain = data;
    }
}