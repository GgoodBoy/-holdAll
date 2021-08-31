import Vue from 'vue'
export let store = Vue.observable({
    receiveStatus:false
})
export let mutations = {
    setReceiveStatus(data){
        store.receiveStatus = data;
    }
}
// export default new Vuex.Store({
//     state,actions,mutations
//   })