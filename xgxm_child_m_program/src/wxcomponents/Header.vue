<template>
<!-- v-if="!lowerVersion" -->
    <view class="header" :style="{height:boxHeadBag+'px'}">
        <view class="status-bar" :style="{height:statusBarHeight+'px'}"></view>
        <view class="title" v-if="!lowerVersion">
            <view class="return-icon" @tap="returnPage" v-show="returnBools">
                <view class="img"></view>
            </view>
        </view>
        <view class="newTitle" :style="{marginTop:titleTop+'px'}">{{title}}</view>
        <view class="userSrearch" v-show="!isNoUserAndSearch">
            <!-- <view class="icons long" :style="{top:`${statusBarHeight}px`}" v-if="lowerVersion" :class="{ 'leftPxs1': returnBools, 'leftPxs2': !returnBools }">
                <image class="user-icon" v-if="searchUserIconType!=2?true:false" :src="userIcon" @click="goPersonal"></image>
                <view class="search-icon-box" @tap="goSearch" v-if="searchUserIconType!=1?true:false">
                    <image class="icon" :src="searchIcon1"></image>
                </view>
            </view> -->
            <!-- v-else -->
            <view v-if="!lowerVersion" class="icons" :style="{top:`${statusBarHeight}px`}" :class="{ 'leftPxs1': returnBools, 'leftPxs2': !returnBools }">
                <image class="user-icon" v-if="searchUserIconType!=2?true:false" :src="userIcon" @click="goPersonal"></image>
                <image class="search-icon" v-if="searchUserIconType!=1?true:false" :src="searchIcon" @tap="goSearch"></image>
            </view>          
            <view v-else class="icons leftPxs2" :style="{top:`${statusBarHeight}px`}">
                <image class="user-icon" v-if="searchUserIconType!=2?true:false" :src="userIcon" @click="goPersonal"></image>
                <image class="search-icon" v-if="searchUserIconType!=1?true:false" :src="searchIcon" @tap="goSearch"></image>
            </view>              
        </view>
    </view>
</template>
<script>
const app = getApp()
import userIcon from '../static/user-icon.png';
import searchIcon from '../static/search-icon.png'
import searchIcon1 from '../static/search-icon-1.png'
export default {
    data(){
        return{
            statusBarHeight:20,
            lowerVersion:false,
            currentPage:{},
            routeUrl:'',
            routeUrl1:'',
            //搜索
            userIcon:userIcon,
            searchIcon1:searchIcon1,
            searchIcon:searchIcon,
            boxHeadBag:94,
            titleTop:0
        }
    },
    props:['title','returnBools','padTop','searchUserIconType','isNoUserAndSearch'],
    created(){
        this.statusBarHeight = app.globalData.statusBarHeight; 
        this.lowerVersion = app.globalData.lowerVersion;
        let unmRpx = app.globalData.statusBarHeight-22;    
        this.boxHeadBag = unmRpx>0?(this.boxHeadBag+unmRpx):94;
        this.titleTop =  this.lowerVersion?44:0;
    },
    onUnload(){
        var pages = getCurrentPages()
    },
    mounted(){
        var pages = getCurrentPages()    //获取加载的页面
        if(pages.length>1){
            var currentPage = pages[pages.length - 2];
            this.routeUrl= currentPage.route;
        }
        var currentPage1 = pages[pages.length - 1];
        this.routeUrl1= currentPage1.route;
    },    
    onShow(){},
    methods:{
        goPersonal(){
            let userInfo = wx.getStorageSync('userInfo')
            if(userInfo){
                wx.switchTab({
                    url: '/pages/index/myPage'
                })	
                // wx.redirectTo({
                //     url: '/pages/index/myPage'
                // })	                				
            }else{
                uni.navigateTo({
                    url: `/pages/auth/index`
                });
            }            
        },
        goSearch(){
            uni.navigateTo({
                url: '/pages/search/index'
            });
        },        
        returnPage(){
            let userInfo = wx.getStorageSync('userInfo');
            if(!userInfo){
                if(this.routeUrl1=='pages/auth/index'){
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }else{
                    wx.switchTab({
                        url: '/pages/index/index'
                    })                    
                }
            }else{
                 if(this.routeUrl){
                    if(this.routeUrl=="pages/investMoney/index"){
                        wx.switchTab({
                            url: '/pages/index/index'
                        })	                        
                    }else{
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                 }else{
                        wx.navigateBack({
                            delta: 1
                        })                     
                 }  
            }  
        }
    }
}
</script>
<style lang="scss">
    .header{
        width: 100%;
        background: #fff;
        position: fixed;
        top:0;
        left: 0;
        z-index: 999;
        background: url('../static/headerBag.png') no-repeat;
        background-size:100% 100%; 
        .newTitle{
           text-align: center;
           font-size: 34rpx;
           font-weight: 700;
        } 
        .title{
            height: 44px;
            line-height: 44px;
            text-align: center;
            font-size: 36rpx;
            color:#333;
            font-weight:500;
            position: relative;
        }
        .return-icon{
            position: absolute;
            left: 0;
            top: 50%;
            padding: 20rpx;
            transform: translateY(-50%);
            .img{
                height: 36rpx;
                width: 36rpx;
                display: block;
                // background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/m/mp/return.png')no-repeat 50% 50% / cover;
                background: url('../static/return.png')no-repeat 50% 50% / cover;
            }
        }
        .userSrearch{
            .icons{
                position: fixed;
                width: 30%;
                z-index: 1000;
                padding: 0 30rpx;
                line-height: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                &.long{
                    width: 100%;
                    box-sizing: border-box;
                }
                .search-icon-box{
                    flex:1;
                    border:1px solid #dfdfdf;
                    height: 60rpx;
                    border-radius: 30rpx;
                    padding: 0 20rpx;
                    display: flex;
                    align-items: center;
                    .icon{
                        height: 36rpx;
                        width: 36rpx;
                    }
                }
                .user-icon,.search-icon{
                    width: 56rpx;
                    height: 56rpx;
                    margin-right: 10rpx;
                }
                .auth-btn{
                    position: absolute;
                    opacity: 0;
                    z-index: 2;
                    width: 68rpx;
                    height: 68rpx;
                    left: 30rpx;
                    bottom:10rpx;
                }
            }            
        }
    }
</style>
<style>
.leftPxs1{
    left:30px;
}
.leftPxs2{
    left:0;
}
</style>
