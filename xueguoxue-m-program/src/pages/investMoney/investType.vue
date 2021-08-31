<template>
    <view>
        <view class="user-pluge"> 
        <view class="img-css">
            <image :src="courseDataInfo.courseSurfacePlot" webp lazy-load/>
        </view>
        <view class="user-txt">
            <view class="txt-css">
                <text>{{courseDataInfo.courseTitle}}</text>
            </view>
            <view class="txt-css">
                <!-- <text style="color:#C30323">{{spikePrice}}夫子币</text> -->
                <text style="color:#C30323;font-family:'PingFangSC-Medium';">{{courseDataInfo.courseSellingPrice}}夫子币</text>
            </view>  
        </view>
    </view>
    <view class="type-pluge"> 
        <!-- <view class="type-1">
            <text>折  扣</text>
            <text>{{courseDataInfo.timeLimitDiscount||0}}折</text>
        </view>  -->
        <view class="type-1" v-if="isJoinAssemble=='false'||Number(isSpellCourseBuy)==1">
            <text>减  价</text>
            <text style="font-family:'PingFangSC-Medium';">{{courseDataInfo.reducePrice||0}}元</text>
        </view>               
        <!-- <view class="type-2" v-if="timeLimitType!=2"> -->
        <view class="type-2" v-if="isJoinAssemble=='false'||Number(isSpellCourseBuy)==1">
            <view class="type-2-1">
                <text>优惠券</text>
            </view>
            <view class="type-2-2" v-if="iosOrAndroid=='Android'" @click="selectCouponEven">
                <text :class="{ 'colorText1': !colorType,'colorText2': colorType }">{{selectObjsName}}</text>
                <image :src="icon1" mode="widthFix"/>
            </view>
            <view class="type-2-2" v-if="iosOrAndroid=='IOS'">
                <text>{{selectObjsName}}</text>
                <image :src="icon1" mode="widthFix"/>
            </view>            
        </view>
        <view class="type-3">
            <text>支   付</text>
            <!-- //timeLimitType==2秒杀已经不存在了 -->
            <!-- <text style="color:#C30323">{{timeLimitType==2?spikePrice:moneyRepase}}币</text>   -->
            <text style="color:#C30323;font-family:'PingFangSC-Medium';">{{(isJoinAssemble=='true'&&Number(isSpellCourseBuy)!=1)?spikePrice:moneyRepase}}币</text>     
                   
        </view>
        <view class="investType">
            <button type="primary" @click="coursePay" v-if="iosOrAndroid=='Android'">微信支付</button>
            <text v-if="iosOrAndroid=='IOS'" style="color:#C30323">在App store搜索“学国学网”立即购买</text>
        </view>
        <view class="contentTips">
            <text>• 您购买的商品为虑拟内容服务，购买 后不支持退单、转让、退换，请斟酌确认。</text>
            <text>
                • 购买后可以“书房”查看已购课程。
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
            selectObjsName:''
        }
    },
    props:['xgxwType','courseId','timeLimitType','spikePrice','selectObjsOther','isJoinAssemble','assembleCourseId','isSpellCourseBuy','selectSpellListId'],
    created(){
        this.equipmentType();
        this.userinfos = JSON.parse(wx.getStorageSync('userInfo'));
    },    
    watch:{
        courseId(news,olds){
            if(news&&news!=olds){
                this.getMoneyCourse();
            }
        },
        buyIsOK(news,olds){
            var that = this;
            if(news){
                let spellIstrue = false;
                if(this.isJoinAssemble=='true'&&this.spikePrice>0&&Number(this.isSpellCourseBuy)!=1){
                    spellIstrue = 1;
                }else{
                    spellIstrue = 2;
                }
                wx.navigateTo({
                    url:'./completeOver?id='+Number(this.courseId)+'&orderId='+ that.orderId+'&reducedPrice='+that.reducedPrice+'&courseDataReducedPrice='+that.courseDataInfo.reducePrice+'&spellIstrue='+spellIstrue
                }) 
            }
        },
        selectObjsOther(news,olds) {
                if(JSON.stringify(news)!=JSON.stringify(olds)){
                    var moneys = 0;
                        moneys = this.proving(JSON.stringify((Math.ceil(Number(this.courseDataInfo.courseSellingPrice)*100)-Math.ceil(Number(this.courseDataInfo.reducePrice)*100))/100),2);
                        this.itemsCouponList.forEach((datael,indexs)=>{
                            if(datael.id==news.value){
                                this.selectRadioId = indexs;
                            }
                        });
                        console.log("moneys",moneys)
                        console.log("news.reducedPrice",news.reducedPrice)
                        if(moneys-Number(news.reducedPrice)>0){
                            this.moneyRepase = this.proving(JSON.stringify(Math.ceil((Number(moneys)*100)-Math.ceil(Number(news.reducedPrice)*100))/100),2);
                        }else{
                            this.moneyRepase = 0;
                        }    
                    this.selectObjsName = news.label;
                    this.courseMonyId = news.value;
                    console.log("this.moneyRepase",this.moneyRepase)
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
                url = this.$server.getWechatOrderForCourseInfoCourses;       
            }
            if(Number(this.xgxwType)==1||Number(this.xgxwType)==2){
                query['buyDaysType'] = this.xgxwType;
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
							this.itemsCouponList =res.data.content;	
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
                            if(Number(this.isSpellCourseBuy)==3){
                                query = {
                                    courseId:this.courseId,
                                    registerSource:2,
                                    paymentType:5,
                                    openId:this.userinfos.openId,
                                    mytype:1,
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
                                    mytype:1,
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
                                mytype:1
                            }
                        }else{
                            query = {
                                courseId:this.courseId,
                                registerSource:2,
                                paymentType:5,
                                openId:this.userinfos.openId,
                                userCouponsId:this.courseMonyId,
                                mytype:1
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
                            this.buyIsOK = true;
                        }                        
                    }else{
                        if(this.moneyRepase>0){
                                this.weiXinPay(param,this);
                        }else{
                                this.buyIsOK = true;
                        }                        
                    }
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
                    success: function (res) {
                    },
                    fail: function (res) {
                        uni.showToast({
                            title: '支付取消',
                            duration: 2000,
                            icon: 'none'
                        });
                    },
                    complete: function (res) {
                        console.log('res',JSON.stringify(res));
                        if(res.errMsg=='requestPayment:ok'){
                            setTimeout(()=>{
                                that.buyIsOK = true;
                            },300);
                        }else{
                            that.buyIsOK = false;
                        }                                            
                    }
            })
        }        
    }
}
</script>
<style lang="scss">
.colorText1{
    color: #C3C3C3;
}
.colorText2{
    color: #C30D23;
}
.user-pluge{
  display: flex;
  flex-direction: row;
  .img-css{
      width: 263rpx;
      height: 160rpx;
      border-radius: 6px;
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
      padding: 0 0 0 20rpx;
      .txt-css{
          height: 80rpx;
          display: flex;
          align-items: center;
        //   justify-content: flex-start;
      }
     .txt-css:nth-child(1) text{
          font-size: 28rpx;
          color:#1A1A1AFF;
          font-weight: 700;
      }
     .txt-css:nth-child(2) text{
          font-size: 24rpx;
          color:#C30323FF;
      }
  }
}
.type-pluge{
    display: flex;
    flex-direction: column;
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
    }
    .type-2{
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
    }
    .contentTips{
        display: flex;
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
    .investType{
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
</style>
<style>
</style>