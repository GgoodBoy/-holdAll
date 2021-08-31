<template>
    <view class="auth-page" :style="{paddingTop:lowerVersion?'0':paddingTop+'px'}">
        <Header :title="'学国学网登录'"></Header>
        <view class="content">
            <view class="btn">
                <view class="icon"></view>
                <text>微信用户快速登录</text>
                <!-- <button open-type="getUserInfo" class="auth-btn" @getuserinfo="getUserInfo"/> -->
                <button class="auth-btn" @tap="getUserInfo"/>
                <button class="return-btn" @click="returnLogin">取消</button>
            </view>
            <view>
                <view class="word">登录即表示您同意并愿意遵守学国学网</view>
                <view class="word">
                    <text class="rule" @tap="openUrl(1)">《使用协议》</text>和<text class="rule" @tap="openUrl(2)">《隐私协议》</text>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
const app = getApp()
import Header from '../../wxcomponents/Header'
export default {
    data(){
        return{
            paddingTop:0,
            lowerVersion:false,
            from:''
        }
    },
    components:{Header},
    onLoad(options){
        this.paddingTop = app.globalData.statusBarHeight+44;
        this.lowerVersion = app.globalData.lowerVersion;
        if(options.from){
            this.from = options.from
        }
    },
    methods:{
        openUrl(type){
            if(type==1){
                uni.navigateTo({
                    url: `/pages/webView/index?url=https://xgxm.xueguoxue.com/invitation/registerAgreement.html`
                });
            }else{
                uni.navigateTo({
                    url: `/pages/webView/index?url=https://xgxm.xueguoxue.com/invitation/privacyAgreement.html`
                });
            }
        },
        // getUserInfo(e){
        getUserInfo(e){
            wx.getUserProfile({
                desc: '获取信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    if(res.userInfo){
                        this.$login(res,this.from)
                    }                   
                }
            })
            // if(e.detail.userInfo){
            //     this.$login(e.detail,this.from)
            // }
        },
        returnLogin(){
            wx.navigateBack()
        }
    }
}
</script>
<style lang="scss" scoped>
    page{
        background: #fff;
    }
    .auth-page{
        height: 100vh;
        box-sizing: border-box;
        position: relative;
        background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/m/mp/login_bgd.png')no-repeat 50% 50% / cover;
        .bgd{
            height: 100%;
            width: 100%;
            position: absolute;
            top:0;
            left: 0;
            z-index: 1;
        }
        .content{
            position: absolute;
            z-index: 2;
            top:40%;
            left:50%;
            transform: translate(-50%,-50%);
            .btn{
                border-radius: 44rpx;
                background: #1BAB1A;
                height: 88rpx;
                width: 560rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32rpx;
                color:#fff;
                position: relative;
                margin-bottom: 120rpx;
                .icon{
                    width: 44rpx;
                    height: 44rpx;
                    margin-right: 14rpx;
                    background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/m/mp/icon.png')no-repeat 50% 50% / cover;
                }
                .auth-btn{
                    position: absolute;
                    width:100%;
                    height: 100%;
                    left:0;
                    top:0;
                    z-index: 2;
                    opacity: 0;
                }
                .return-btn::after{ border: none; }
                .return-btn{
                    color:#333;
                    text-align:center;
                    background-color: #f4f4f4;
                    width:100%;
                    height: 100%;
                    position: absolute;
                    top: 100rpx;
                    border-radius: 44rpx;
                    font-size: 32rpx;
                }
            }
            .word{
                width: 560rpx;
                font-size: 24rpx;
                color:#999999;
                text-align: center;
                .rule{
                    color:#CC0033;
                }
            }
        }
    }
</style>