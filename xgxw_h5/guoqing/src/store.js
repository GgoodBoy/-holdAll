import Vue from 'vue';

export let store =Vue.observable(
    {from:'',courseName:[]}
);
export let mutations={
    setFrom(data){
        store.from=data;
    },
    setCourseName(data){
        store.courseName = data;
    }
}