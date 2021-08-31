<template>
    <view class="image-box" :style="style">
        <view class="real-image" v-if="loaded"></view>
        <view class="lazy-image" v-else></view>
    </view>
</template>
<script>
export default {
    data(){
        return{
            loaded:false,
            style:{
                height:'auto',
                width:'auto'
            }
        }
    },
    props:['height','width'],
    created(){
        this.style = {
            height:`${this.height}px`,
            width:`${this.width}px`
        }
    }
}
</script>
<style lang="scss" scoped>
    .image-box{
        .real-image,.lazy-image{
            height: 100%;
            width: 100%;
        }
    }
</style>