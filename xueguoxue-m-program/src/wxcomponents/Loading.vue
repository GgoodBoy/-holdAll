<template>
    <view class="loading-box" >
        <view class='loading'>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
        </view>
    </view>
</template>
<script>
export default {
    data(){
        return{

        }
    }    
}
</script>
<style lang="scss" scoped>
    .loading{  
        width: 40rpx;
        height: 40rpx;
        position: relative;
        margin:0 auto;
        .item{
            position: absolute;
            top: 0;
            left: 50%;
            height: 100%;
            animation: load 1.2s ease infinite;
            border:none;
            outline: none;
            &:nth-of-type(1){
                transform: rotate(30deg);
                opacity: 1;
                animation-delay:0.1s;  
            }
            &:nth-of-type(2){
                transform: rotate(60deg);
                opacity: 0.9375;
                animation-delay:0.2s;  
            }
            &:nth-of-type(3){
                transform: rotate(90deg);
                opacity: 0.875;
                animation-delay:0.3s;  
            }
            &:nth-of-type(4){
                transform: rotate(120deg);
                opacity: 0.8125;
                animation-delay:0.4s;  
            }
            &:nth-of-type(5){
                transform: rotate(150deg);
                opacity: 0.75;
                animation-delay:0.5s;  
            }
            &:nth-of-type(6){
                transform: rotate(180deg);
                opacity: 0.6875;
                animation-delay:0.6s;  
            }
            &:nth-of-type(7){
                transform: rotate(210deg);
                opacity: 0.625;
                animation-delay:0.7s;  
            }
            &:nth-of-type(8){
                transform: rotate(240deg);
                opacity: 0.5625;
                animation-delay:0.8s;  
            }
            &:nth-of-type(9){
                transform: rotate(270deg);
                opacity: 0.5;
                animation-delay:0.9s;  
            }
            &:nth-of-type(10){
                transform: rotate(300deg);
                opacity: 0.4375;
                animation-delay:1s;  
            }
            &:nth-of-type(11){
                transform: rotate(330deg);
                opacity: 0.375;
                animation-delay:1.1s;  
            }
            &:nth-of-type(12){
                transform: rotate(360deg);
                opacity: 0.3125;
                animation-delay:1.2s;  
            }
            &::before{
                display: block;
                width: 2px;
                height: 25%;
                margin: 0 auto;
                background-color: #888;
                border-radius: 40%;
                content: ' ';
            }
        }
    }          
    @-webkit-keyframes load{
        0%{
            opacity: 1;
        }            
        100%{
            opacity: 0.2;
        }        
    }
</style>