<template>
    <scroll-view :class="className" scroll-y lower-threshold="100" scroll-top='0' :style="{height:height+'px'}" :refresher-enabled="refresh" :refresher-triggered="refreshFlag" @refresherpulling="refreshPull" @refresherrefresh="refreshing" @scrolltolower="scrollEvent">
        <slot></slot>
        <view class="loading-container"><Loading v-if="loading"></Loading></view>
        <view class="text" v-if="finished" v-show="!textFlag">{{text||'没有更多数据了~'}}</view>
    </scroll-view>
</template>
<script>
import Loading from './Loading'
export default {
    data(){
        return{
            refreshFlag:false
        }
    },
    props:['className','height','loading','finished','refresh','text','textFlag'],
    components:{Loading},
    methods:{
        refreshPull(){
            this.refreshFlag = true;
        },
        refreshing(){
            if(this.refresh){
                this.$emit('pullRefresh',()=>{
                    this.refreshFlag = false;
                })
            }else{
                this.refreshFlag = false;
            }            
        },
        scrollEvent(){
            if(this.finished||this.loading) return;
            this.$emit('load')
        }
    },
}
</script>
<style lang="scss" scoped>
    .loading-container{
        margin:20rpx 0;
    }
    .text{
        margin:20rpx 0;
        color:#999;
        font-size: 28rpx;
        text-align: center;
    }
</style>