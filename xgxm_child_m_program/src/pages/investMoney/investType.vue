<template>
    <view>
        <view class="user-pluge"> 
            <view class="img-css">
                <image :src="courseDataInfo.courseSurfacePlot"  webp lazy-load/>
            </view>
            <view class="user-txt">
                <view class="txt-css">
                    <text>{{courseDataInfo.courseTitle}}</text>
                </view>
                <view class="txt-css">
                    <text style="color:#C30323;font-family:'PingFangSC-Medium';">{{courseDataInfo.courseSellingPrice||0}}夫子币</text>
                </view>  
            </view>
        </view>
        <view class="type-pluge"> 
            <view class="type-1" v-if="isJoinAssemble=='false'||Number(isSpellCourseBuy)==1">
                <text>减  价</text>
                <text style="font-family:'PingFangSC-Medium';">{{courseDataInfo.reducePrice||0}}元</text>
            </view>                          
            <view class="type-2" v-if="isJoinAssemble=='false'||Number(isSpellCourseBuy)==1">
                <view class="type-2-1">
                    <text>优惠券</text>
                </view>
                <view class="type-2-2" v-if="iosOrAndroid=='Android'" @click="selectCouponEven">
                    <text :class="{ 'colorText1': !colorType,'colorText2': colorType }">{{selectObjsName}}</text>
                    <image v-show="colorType" :src="icon1" mode="widthFix"/>
                </view>
                <view class="type-2-2" v-if="iosOrAndroid=='IOS'">
                    <text>{{selectObjsName}}</text>
                    <image :src="icon1" mode="widthFix"/>
                </view>            
            </view>
            <view class="type-3">
                <text>支   付</text>
                <text style="color:#C30323;font-family:'PingFangSC-Medium';">{{(isJoinAssemble=='true'&&Number(isSpellCourseBuy)!=1)?spikePrice:moneyRepase}}币</text>
            </view>
            <view class="investType">
                <button type="primary" @click="coursePay" v-if="iosOrAndroid=='Android'">微信支付</button>
                <text v-if="iosOrAndroid=='IOS'" style="color:#C30323">在App store搜索“学国学网”立即购买</text>
            </view>
        </view>   
        <view class="tipsContent">
            <view class="contentTips">
                <text>• 您购买的商品为虑拟内容服务，购买 后不支持退单、转让、退换，请斟酌确认。</text>
                <text>
                    • 购买后可以“我的”查看已购课程。
                </text>
                <text>
                    • 您也可以在应用商店内搜索“学国学网”下载并安装，课程同步有效。
                </text>            
            </view>            
        </view> 
    </view>
</template>

<script>
import icon_l from '../../static/investMoney/icon-1.png'
export default {

    data() {
        return {
            'icon1':icon_l,
            userinfos:'',
            courseDataInfo:'',
            openIds:'',
            buyIsOK:false,
            orderId:'',
            reducedPrice:'',
            iosOrAndroid:'',
            moneyRepase:0,
            selectObjs:{
                label:'无可用',
                value:'',
                reducedPrice:0	                
            },
            colorType:false,
            itemsCouponList:[],
            selectRadioId:0,
            courseMonyId:0,
            selectObjsName:'',
            lowerVersion:false
        }
    },
    props:['xgxwType','courseId','timeLimitType','spikePrice','selectObjsOther','isJoinAssemble','assembleCourseId','isSpellCourseBuy','selectSpellListId'],
    created(){
        this.equipmentType();
        this.userinfos = JSON.parse(wx.getStorageSync('userInfo'));
    },    
    onShow(){},
    watch:{
        courseId(news,olds){
            if(news&&news!=olds){
                this.getMoneyCourse();
            }
        },
        buyIsOK(news,olds){
            var that = this;
            if(news){
                wx.navigateTo({
                    url:'./completeOver?id='+Number(this.courseId)+'&orderId='+ that.orderId+'&reducedPrice='+that.reducedPrice
                }) 
            }
        },
        selectObjsOther(news,olds) {
                if(JSON.stringify(news)!=JSON.stringify(olds)){
                    var moneys = 0;
                            moneys = this.proving(JSON.stringify(Math.ceil((Number(this.courseDataInfo.courseSellingPrice)*100)-Math.ceil(Number(this.courseDataInfo.reducePrice)*100))/100),2);

                        this.itemsCouponList.forEach((datael,indexs)=>{
                            if(datael.id==news.value){
                                this.selectRadioId = indexs;
                            }
                        });
                        if(moneys-Number(news.reducedPrice)>0){
                           
                            this.moneyRepase = this.proving(JSON.stringify(Math.ceil((Number(moneys)*100)-Math.ceil(Number(news.reducedPrice)*100))/100),2);
                        }else{
                            this.moneyRepase = 0;
                        } 
                    this.selectObjsName = news.label;
                    this.courseMonyId = news.value;
                }
        }
    },
    onReady: function (res) {
    },
    methods: { 
        //判断当前设备类型是安卓还是ios;ios不能进行购买
        equipmentType(){
            var self = this;
            wx.getSystemInfo({
                success (res) {
                    var systems = res.system;
                    if(systems.indexOf('Android')>-1){
                         self.iosOrAndroid ='Android';
                    }else{
                        self.iosOrAndroid ='IOS';
                    }
                }
            })
        },        
        //获取下单页面的信息
        getMoneyCourse(){
            let url ='';
            let query ={};
            if(this.isJoinAssemble=='true'&&Number(this.isSpellCourseBuy)!=1){
                query = {
                    userId:this.userinfos.userId,
                    assembleCourseId:this.assembleCourseId,
                    token:this.userinfos.token
                }   
                url = this.$server.getSpellPlaceOrderInfo;                
            }else{
                query = {
                    userId:this.userinfos.userId,
                    courseId:this.courseId,
                    token:this.userinfos.token
                }   
                if(Number(this.xgxwType)==1||Number(this.xgxwType)==2){
                    query['buyDaysType'] = this.xgxwType;
                }           
                url = this.$server.getWechatOrderForCourseInfoCourses;
            }
            //isJoinAssemble  true:是拼团，不是拼团
            wx.showLoading();
            this.$http.post(url,query,{urlType:(this.isJoinAssemble=='true'&&Number(this.isSpellCourseBuy)!=1)?false:true}).then(res=>{
                if(res.data.status==200){
                    this.courseDataInfo = res.data.content;
                    this.getCouponCard();
                    wx.hideLoading();
                }
            })            
        },
        //选择优惠券
        selectCouponEven(){
            if(this.itemsCouponList.length>0){
                this.$emit('selectCoupon',{itemsCouponList:this.itemsCouponList,selectRadioId:this.selectRadioId});
            }
        },
			/**
			 * 获取优惠券
			 * courseId  courseId=1 课程ID
			 * userId	userId=1  用户ID
			 */
			getCouponCard(){
				let query = {
					courseId:this.courseId,
                    userId:this.userinfos.userId
                }				
                if(Number(this.xgxwType)==1||Number(this.xgxwType)==2){
                    query['buyDaysType'] = this.xgxwType;
                }                  
				this.$http.post(this.$server.getWechatUserCouponsListForBuyCourse,query).then(res=>{
					if(res.data.status==200){
						if(!res.data.content.length){
                            this.popupState = false;
                            this.colorType=false;
                            this.selectObjsName = '无可用';	
                            this.discountPaymentEven();												
						}else{
                            this.colorType=true;
                            var objsMy=[{
                                    id:-1,
                                    couponsTitle:'不使用',
                                    reducedPrice:0
                                }];
							this.itemsCouponList = res.data.content.concat(objsMy);
                            this.selectObjsName = res.data.content[0].couponsTitle;	
                            var moneys = 0;
                                moneys = this.courseDataInfo.courseSellingPrice-Number(this.courseDataInfo.reducePrice);
                            if(moneys-Number(res.data.content[0].reducedPrice)>0){
                                this.moneyRepase = this.proving(JSON.stringify(Math.ceil((Number(moneys)*100)-Math.ceil(Number(res.data.content[0].reducedPrice)*100))/100),2)
                            }else{
                                this.moneyRepase = 0;
                            }
                            this.courseMonyId = res.data.content[0].id;
                            this.popupState = false;
                        }
					}
				})				
            },	
        proving(data,num) {
            data = data.replace(/[^\d.]/g, '');
            data = data.replace(/^\./g, '');
            data = data.replace(/\.{2,}/g, '');
            data = data.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
            let index = -1
            for (let i in data) {
                if (data[i] === '.') {
                    index = i
                }
                if (index !== -1) {
                    if (i - index > num) {
                        data = data.substring(0, data.length-1)
                    }
                }
            }
            return data;
        },               
        //折扣计算价格
        discountPaymentEven(){
            var moneys = 0;    
            moneys = this.proving(JSON.stringify((Number(this.courseDataInfo.courseSellingPrice)*100-Number(this.courseDataInfo.reducePrice)*100)/100),2);     
            this.moneyRepase =  moneys; 
            this.courseMonyId = -1;
        },
        //购买课程
        coursePay(){
            let query = {};
                    if(this.isJoinAssemble=='true'&&Number(this.isSpellCourseBuy)!=1){
                        if(Number(this.isSpellCourseBuy)==3){//1是普通，2是开团，3是拼团 是不是使用拼团价格购买  
                            query = {
                                courseId:this.courseId,
                                registerSource:2,
                                paymentType:5,
                                openId:this.userinfos.openId,
                                mytype:2,
                                buyType:2,
                                assembleType:2,
                                joinAssembleRecordId:this.selectSpellListId
                            } 
                        }else{
                            query = {
                                courseId:this.courseId,
                                registerSource:2,
                                paymentType:5,
                                openId:this.userinfos.openId,
                                mytype:2,
                                buyType:2,
                                assembleType:1
                            }
                        } 
                    }else{
                        if(this.courseMonyId==-1){
                                query = {
                                    courseId:this.courseId,
                                    registerSource:2,
                                    paymentType:5,
                                    openId:this.userinfos.openId,
                                    mytype:2
                                }
                            
                        }else{
                            query = {
                                courseId:this.courseId,
                                registerSource:2,
                                paymentType:5,
                                openId:this.userinfos.openId,
                                userCouponsId:this.courseMonyId,
                                mytype:2
                            }
                        }
                    }
                if(Number(this.xgxwType)==1||Number(this.xgxwType)==2){
                    query['buyDaysType'] = this.xgxwType;
                }                      
            this.$http.post(this.$server.getCourseWechatBuyCourse,query,{urlType:true}).then(res=>{
                if(res.data.status==200){
                    var weixinInfo = res.data.content.wechatInfo;
                    var param = {
                        timeStamp:weixinInfo.timestamp,
                        nonceStr:weixinInfo.nonce_str,
                        package:weixinInfo.prepay_id,
                        signType:weixinInfo.sign_type,
                        paySign:weixinInfo.sign
                    };
                    this.orderId= res.data.content.orderId;
                    this.reducedPrice=res.data.content.reducedPrice;
                    if(this.isJoinAssemble=='true'&&Number(this.isSpellCourseBuy)!=1){
                        if(this.spikePrice>0){
                                this.weiXinPay(param,this);
                        }else{
                                wx.navigateTo({
                                    url:'./completeOver?id='+Number(this.courseId)+'&flag=success'
                                }) 
                        }                        
                    }else{
                        if(this.moneyRepase>0){
                                this.weiXinPay(param,this);
                        }else{
                                wx.navigateTo({
                                    url:'./completeOver?id='+Number(this.courseId)+'&flag=success'
                                }) 
                        }
                    }
                }else{
                    uni.showToast({
                        title: res.data.message,
                        duration: 2000,
                        icon: 'none'
                    });                                        
                }
            })           
        },
        weiXinPay(param,that) {
                wx.requestPayment({
                        timeStamp: param.timeStamp,
                        nonceStr: param.nonceStr,
                        package: 'prepay_id='+param.package,//prepay_id
                        signType: param.signType,//签名算法
                        paySign: param.paySign, //签名
                        success: (res)=>{
                            wx.navigateTo({
                                url:'./completeOver?id='+Number(this.courseId)+'&flag=success'
                            }) 
                        },
                        fail: (res)=>{
                            wx.navigateTo({
                                url:'./completeOver?id='+Number(this.courseId)+'&flag=fail'
                            }) 
                        },
                        complete: function (res) {                
                        }
                })
            }        
    }
        
}
</script>
<style lang="scss">
.colorText1{
    color: #333;
}
.colorText2{
    color: #C30D23;
}
.user-pluge{
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 24rpx;
    margin-top: 20rpx;
    width: 680rpx;
    margin:30rpx auto 0;
  .img-css{
      width: 680rpx;
      height: 387rpx;
      border-radius: 12px;
      overflow: hidden;
      image{
          display: block;
          width: 100%;
          height: 100%;
      }
  }
  .user-txt{
      display: flex;
      flex-direction: column;
      padding: 18rpx 40rpx;
     .txt-css:nth-child(1) text{
        color: #1A1A1A;
        font-size: 30rpx;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient: vertical;          
      }
      .txt-css:nth-child(2){
          text-align: right;
      }
     .txt-css:nth-child(2) text{
        color: #C30323;
        font-size: 28rpx;
      }
  }
}
.type-pluge{
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 24rpx;
    width: 680rpx;
    margin: 30rpx auto 0;
    padding: 0 0 30rpx 0;
    .type-1,.type-2,.type-3{
        display: flex;
        flex-direction: row;
        justify-content:space-between;
        align-items: center;
        font-size: 28rpx;
        height: 100rpx;
    }
    .type-1{
        color: #333333FF;
        padding: 0 40rpx;
    }
    .type-2{
        padding: 0 40rpx;
        .type-2-1{
            color: #333333FF;
        }
        .type-2-2{
            color: #C30D23FF;
            image{
                width: 22rpx;
                height: 22rpx;
            }
        }
    }
    .type-3{
        text:nth-child(2){
            color:#C30D23FF;
        }
        padding: 0 40rpx;
    }
    .investType{
        padding: 0 40rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        button{
            width: 360rpx;
            height: 94rpx;
            border-radius: 94rpx;
            font-size: 32rpx;
            line-height: 94rpx;
        }
        text{
            color: #C30D23FF;
            font-size: 26rpx;
            margin-top: 40rpx;
        }
    }
}
.tipsContent{
    padding: 20rpx 0;
    .contentTips{
        display: flex;
        padding: 0 40rpx;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        margin-top: 20rpx;
        color: #9A9A9AFF;
        text{
            font-size: 24rpx;
            color: #9A9A9AFF;
            line-height:60rpx;
        }
    
    }
}
</style>
<style>
</style>