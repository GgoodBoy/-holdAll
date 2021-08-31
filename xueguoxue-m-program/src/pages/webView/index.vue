<template>
    <web-view :src="webUrl" v-if="webUrl.length>0" @load="loadSuccess" @error="loadError"></web-view>
</template>
<script>
export default {
    data(){
        return{
            webUrl:''
        }
    },
    props:['url'],
    onLoad(option){
        let time = new Date().getTime();
        this.webUrl = this.url+`?time=${time}`
    },
    onShow(){
        const backgroundAudioManager = wx.getBackgroundAudioManager();
        backgroundAudioManager.pause();
    },
    methods:{
        loadSuccess(){
            uni.hideLoading()
        },
        loadError(){
            uni.hideLoading()
        }
    }
}
</script>
<style lang="scss">

</style>