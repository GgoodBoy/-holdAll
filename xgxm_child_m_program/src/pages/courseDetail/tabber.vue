<template>
    <view class="tabber-pluge"> 
        <view class="tabber-same-css" :class="{'activeIsYes':isActive==index,'activeIsNo':isActive!=index}" @click="tabberSelect(item,index)" v-for="(item,index) in tabberList" :key="index">
            <view>{{item.name}}</view>
            <view :class="{'underlineYes':isActive==index,'underlineNo':isActive!=index}"></view>
        </view>     
    </view>
</template>

<script>
export default {

    data() {
        return {
            isActive:0,
            tabberList:[
                {
                    name:'介绍',
                    id:1
                },
                {
                    name:'目录',
                    id:2
                }
            ]
        }
    },
    onReady: function (res) {
    },
    methods: {   
        tabberSelect(data,index){
            this.isActive = index;
            this.$emit('tabberSelectEmit',{type:index});
        },  
    }
        
}
</script>
<style lang="scss">
 .tabber-pluge{
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: center;
     overflow-x: auto;
     border-bottom: 1px solid #f4f4f4;
     .tabber-same-css{
        width: 140rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
     }
 }
</style>
<style>
.underlineYes{
    height: 1px;
    width: 60rpx;
    border:1px solid #AE0C33;
    background-color: #AE0C33;
    margin-top: 24rpx;
}
.underlineNo{
    height: 1px;
    width: 60rpx;
    border:1px solid #fff;
    background-color: #fff;
    margin-top: 24rpx;
}
.activeIsYes{
    font-size: 36rpx;
    font-weight: 900;
    color: #333333FF;
}
.activeIsNo{
    font-size: 36rpx; 
    color: #666666FF;    
}
</style>