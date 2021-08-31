<template>
    <view class="personal-page" :style="{paddingTop:lowerVersion?'0':paddingTop+'px'}">
        <Header :title="'书房'"></Header>
        <view class="content">
            <view class="user-info">
                <image :src="bgd" class="bgd"></image>
                <!-- <view class="bgd"></view> -->
                <image :src="userInfo.avatar" class="head"></image>
                <view class="name">{{userInfo.nickname}}</view>
            </view>
            <view class="tab">
                <view class="tab-item" :class="{'active':type==1}" @tap="switchTab(1)">我的课程</view>
                <view class="tab-item" :class="{'active':type==2}" @tap="switchTab(2)">我的订单</view>
                <view class="line" :class="{'move':type==2}"></view>
            </view>
            <view class="component">
                <view class="box" v-if="type==1">
                    <myCourse></myCourse>
                </view>
                <view class="box" v-else>
                    <order></order>
                </view>
            </view>
        </view>
        <MiniAudio v-if="audioData.show" :cur="cur" :curList="curList"></MiniAudio>
    </view>
</template>
<script>
import {mapState,mapActions} from 'vuex'
import Header from '../../wxcomponents/Header'
import myCourse from './myCourse'
import order from './order'
import MiniAudio from '../../wxcomponents/miniAudio.vue'
import bgd from '../../static/bgd.png'
const app = getApp()
export default {
    data(){
        return{
            paddingTop:0,
            userInfo:{},
            bgd:bgd,
            type:1,
            timer:null,
            cur:'0',
            curList:[],
            firsterBool:true,//定时器第一次锁
            clearIntervalbool:true,
            lowerVersion:false
        }
    },
    components:{Header,myCourse,order,MiniAudio},
    created(){
        this.paddingTop = app.globalData.statusBarHeight+44;
        this.lowerVersion = app.globalData.lowerVersion;
    },
    onShow(){       
        this.getwxUserInfo(); 
        this.curList = this.$store.state.timeArry;
        this.clearIntervalbool=true;
        clearInterval(this.timer);
        const backgroundAudioManager = wx.getBackgroundAudioManager();
        if(this.audioData.show){
            this.timer = setInterval(() => {
                if(this.clearIntervalbool){
                    if(this.firsterBool){
                        this.cur = Math.floor(backgroundAudioManager.currentTime);
                        var firster=this.curList[this.curList.length-1];
                        if(this.cur>firster){
                            var nums = this.cur-firster;
                            if(nums>0){
                                for (var i = 0; i < nums; i++) { 
                                    this.curList.push(firster+i);
                                }
                            }
                        }
                        this.firsterBool = false;
                    }else{
                        this.cur = Math.floor(backgroundAudioManager.currentTime);
                        if(this.cur!=this.curList[this.curList.length-1]){
                            this.curList.push(this.cur);
                        }
                    }
                }else{
                    clearInterval(this.timer);
                }                  
            }, 1000);
        }
    },
    onHide(){
        clearInterval(this.timer);
        this.clearIntervalbool = false;
    },
    onUnload(){
        clearInterval(this.timer);
        this.clearIntervalbool = false;
    },    
    computed:{
        ...mapState(['audioData','timeArry'])
    },
    onPageScroll(){
        console.log(1)
    },
    methods:{
        switchTab(type){
            this.type = type
        },
        getwxUserInfo(){
            this.userInfo={};          
            let userInfo = wx.getStorageSync('userInfo');
            if(userInfo){
                let users = JSON.parse(userInfo);
                this.userInfo = JSON.parse(userInfo);
                console.log('userInfo',userInfo);
            }         
        }
    }
}
</script>
<style lang="scss">
    .personal-page{
        background: rgba(244,244,244,1);
        box-sizing: border-box;
        height: 100vh;
        .content{
            height:100%;
            .user-info{
                height: 312rpx;
                position: relative;
                text-align: center;
                .bgd{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top:0;
                    left: 0;
                    z-index: 1;
                    background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/m/mp/personal.png')no-repeat 50% 50% / cover;
                }
                // background: ;
                .head{
                    height: 144rpx;
                    width: 144rpx;
                    border-radius: 50%;
                    margin:150rpx 0 10rpx 0;
                    position: relative;
                    z-index: 2;
                }
                .name{
                    font-size: 36rpx;
                    color:#333333;
                    position: relative;
                    z-index: 2;
                    font-weight: 500;
                }
            }
            .tab{
                display: flex;
                align-items: top;
                position: relative;
                height: 80rpx;
                margin-top:130rpx;
                .tab-item{
                    flex:1;
                    color:#666666;
                    font-size: 32rpx;
                    text-align: center;
                    &.active{
                        color:#C30D23;
                    }
                }
                .line{
                    position: absolute;
                    width: 50%;
                    left: 0;
                    top:20rpx;
                    text-align: center;
                    transition: all 0.3s;
                    &.move{
                        transform: translateX(100%);
                    }
                    &::after{
                        content:'';
                        height: 2px;
                        width: 130rpx;
                        background: #C30D23;
                        border-radius: 8rpx;
                        display: inline-block;
                    }
                }   
            }
            .component{
                height: calc(100% - 520rpx);
                position: relative;
                .box{
                    padding-bottom:30rpx;
                    box-sizing: border-box;
                    position: absolute;
                    top:0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                }
            }
        }
    }
</style>