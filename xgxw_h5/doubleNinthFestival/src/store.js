import Vue from 'vue'
export let store = Vue.observable({
    step:1,
    userInfo:{},
    content:'',
    posterIndex:0,
    people:0
})
export let mutations = {
    setStep(data){
        store.step = data;
    },
    setUserInfo(data){
        store.userInfo = data;
    },
    setContent(data){
        store.content = data;
    },
    setPosterIndex(data){
        store.posterIndex = data;
    },
    setPeople(data){
        store.people = data
    }
}
// export default new Vuex.Store({
//     state,actions,mutations
//   })