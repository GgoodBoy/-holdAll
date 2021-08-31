<template>
    <view class="cover-pluge" v-if="dataIntroduce.length>0"> 
        <view class="catalogList">
            <view>介绍</view>
        </view>        
        <mp-html :content="text"/>
        <!-- <rich-text :nodes="text"></rich-text> -->
    </view>
</template>

<script>
import mpHtml from '@/wxcomponents/mp-html/mp-html'
export default {
    data() {
        return {
            
        }
    },
    computed:{
        text(){
            return this.dataIntroduce.replace(/<img([\s]+)/ig, '<img class="img"  style="max-width:100%!important;display:block" ')
        }
    },
    props:['dataIntroduce'],
    components:{mpHtml},
    onReady: function (res) {
    },
    created(){
       
    },
    methods: { }
        
}
</script>
<style lang="scss">
.cover-pluge{
    margin-top: 20rpx;
    padding: 30rpx;
    background: #fff;
    .catalogList{
        font-size:40rpx;
        font-weight:800;
        position: relative;
        margin-bottom: 30rpx;
        view{
            height: 40rpx;
            line-height: 40rpx;
            padding: 0 30rpx;
            font-size: 36rpx;
            color: #333;
            font-weight: 500;            
        }
    }
    .catalogList:before{
            content:'';
            height: 40rpx;
            width: 8rpx;
            bottom: 0;
            left: 10rpx;                
            display: block;   
            position: absolute;
            background: #C30D23;
    }        
    img{
        width: 100%;
        max-width: 100%;
        display: block;
    }
}
</style>
<style>
</style>