<template>
    <div class="order-page">
        <div class="page-top">
            <p class="tips">商品信息</p>
            <div class="course-data">
                <div class="course-surface"><img :src="courseData.surfacePlot"/></div>
                <div class="text">
                    <p class="course-title">{{courseData.title}}</p>
                    <!-- <p class="course-price">{{courseData.sellingPrice}}币</p> -->
                    <!-- <p class="course-price" v-if="courseData.timeLimitType==2&&isStart">价格 : {{courseData.spikePrice}}币</p> -->
                    <p class="course-price">价格 : {{courseData.sellingPrice}}币</p>
                    <p class="channel-avaliday" v-if="courseData.channelAvaliDay!=0">{{courseData.channelAvaliDay}}前有效</p>
                </div>
            </div>
        </div>
        <div class="content">
            <div v-if="couponList.length>0" class="block coupon">
                <p class="tips">优惠券</p>
                <div class="coupon-box">
                    <i class="prev el-icon-arrow-left" @click="switchCoupon('prev')" v-if="couponList.length>3"></i>
                    <div class="coupon-list-box">
                        <ul class="list clearfix" :style="couponStyle">
                            <li class="item" v-for="(item,index) in couponList" :key="index" :class="item.couponType != 2 ?'all-reduction':'money-off'" @click="chioceItem(item)">
                                <div class="coupon-container">
                                    <div class="price" :class="item.couponType!=3?'status0':''">{{item.reducedPrice}}<span>元</span></div>
                                    <div class="info" :class="item.couponType!=3?'status0':''">
                                        <p class="coupon-type" v-if="item.couponType==2">满{{item.couponsMinAmount}}减{{item.reducedPrice}}元券</p>
                                        <p class="coupon-type" v-else>无门槛优惠券</p>
                                        <p class="coupon-time" v-show="item.couponType==3">{{item.beginAtStr}}-{{item.endAtStr}}</p>
                                        <p class="card-number">{{item.couponCode}}</p>
                                    </div>
                                    <i class="choose-icon" v-show="couponId==item.id"></i>
                                    <transition name="switchShade">
                                        <div class="coupon-shade-wrap" v-show="item.showText">
                                           {{item.useCourseTitle}}
                                        </div>     
                                    </transition>
                                </div>
                                <div class="coupon-explain clearfix" v-if="item.couponType==3">
                                    <p class="coupon-course textEllipsis" @click="textShow($event,item,index)">{{item.useCourseTitle}}</p>
                                </div>
                                <div class="coupon-explain clearfix" v-else>
                                    <p class="coupon-course">有效期：{{item.beginAtStr}}-{{item.endAtStr}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <i class="next el-icon-arrow-right" @click="switchCoupon('next')" v-if="couponList.length>3"></i>
                </div>
            </div>
            <div class="block discount clearfix" v-if="courseData.timeLimitType>=0&&isStart">
                <p class="tips">减价</p>
                <p class="data" >{{courseData.reducePrice}}元</p>
                <!-- <p class="data" v-else>0元</p> -->
            </div>
            <div class="order-box clearfix">
                <div class="explain">
                    <p>说明:</p>
                    <p>您购买的商品为虚拟商品，故在购买后不支持退单、转让、退换等服务。</p>
                    <p>完成支付后在学习中心中查看已购课程。</p>
                </div>
                <div class="course-order-data">
                    <div class="item ori-price">
                        <p class="label">课程金额</p>
                        <p>：</p>
                        <!-- <p class="value" v-if="courseData.timeLimitType==2&&isStart">¥{{courseData.spikePrice}}</p> -->
                        <p class="value">¥{{courseData.sellingPrice}}</p>
                        
                    </div>
                    <div class="item coupon-price">
                        <p class="label">优惠券</p>
                        <p>：</p>
                        <p class="value">-¥{{couponPrice}}</p>
                    </div>
                    <div class="item order-price">
                        <p class="label">应付金额</p>
                        <p>：</p>
                        <!-- <p class="value" v-if="courseData.timeLimitType==2&&isStart">¥{{courseData.spikePrice}}</p> -->
                        <p class="value">¥{{courseData.sellingPrice-couponPrice>0?(courseData.sellingPrice*1000-couponPrice*1000)/1000:0}}</p>
                    </div>
                    <div class="check-box">
                        <div class="wx-pay" :class="{'checked':paymentType=='wx'}" @click="paymentType='wx'">
                            <i class="icon"></i>
                            <p>微信支付</p>
                            <i class="check-icon"></i>
                        </div>
                        <div class="ali-pay" :class="{'checked':paymentType=='ali'}" @click="paymentType='ali'">
                            <i class="icon"></i>
                            <p>支付宝支付</p>
                            <i class="check-icon"></i>
                        </div>
                    </div>
                    <button class="primary-btn" @click="buyCourse">去支付</button>
                </div>
            </div>
        </div>
        <transition name="el-fade-in">
            <div class="code-dialog" v-show="codeFlag">
                <div class="code-box">
                    <p class="t">{{codeDialogTitle}}<i class="el-icon-circle-close close" @click="codeFlag=false"></i></p>
                    <div class="code-url" ref="qrCodeUrl"></div>
                    <div class="tips">
                        <p>{{codeDialogTips}}</p>
                        <p v-if="codeTime==0" class="re-buy-btn" @click="buyCourse">二维码已失效，点击重新获取</p>
                        <p v-else>距离二维码过期还有<span>{{codeTime}}</span>秒</p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script lang="ts">
import {Component,Vue,Watch} from 'vue-property-decorator'
import QRCode from 'qrcodejs2'
import { setTimeout, clearInterval, setInterval } from 'timers';
import {mapActions} from 'vuex'
let QRCode;
if(process.client) {
    QRCode = require('qrcodejs2')
}
@Component({
    beforeRouteLeave(to,from,next){
        clearInterval(this.timer);
        clearInterval(this.time)
        next()
    },
    methods:{
        ...mapActions(['setOrderData'])
    }
})
export default class Order extends Vue{
    courseId = ''//课程ID
    courseData = {}//课程信息
    couponList = []//优惠去演列表
    couponStyle = {}//优惠券列表style
    couponIndex = 0 
    couponId = 0
    couponPrice = 0
    conponX = 0
    paymentType = 'wx'
    codeFlag = false
    codeDialogTitle = '微信扫描支付'
    codeDialogTips = '支付宝扫描二维码以完成支付'
    codeTime = 0
    timer = null//轮询查订单状态
    time = null
    isStart = false
    @Watch("codeFlag")
    onCodeFlagChanged(val,old){
        if(!val){
            clearInterval(this.time);
            // clearInterval(this.timer)
            setTimeout(()=>{
                document.getElementsByClassName("code-url")[0].innerHTML = ''
            },300)
        }
    }
    created(){
        if(this.$route.query&&this.$route.query.id){
            this.courseId = this.$route.query.id
            this.$nextTick(()=>{
                this.getCourseInfo();
                this.getAvailableList()
            })
        }else{
            // alert('go back')
        }
    }
    /**
     * 获取课程信息
     */
    async getCourseInfo(){
        let query = {
            params:{}
        }
        let res = await this.$axios.$get(`${this.$server.getCourseInfo}/${this.courseId}`,query)
        if(res.status==200){
            let courseData = res.content;
            this.courseData = courseData;
            if(courseData.timeLimitType>=0&&courseData.timeLimitBeginAt&&courseData.nowServerTime){
                let begin = new Date(courseData.timeLimitBeginAt.replace(/-/g, '/')).getTime();
                let now = new Date(courseData.nowServerTime.replace(/-/g, '/')).getTime()
                this.isStart = now>=begin?true:false
            }
        }else{
            this.$router.replace('/home')
        }
    }
    /**
     * 购买课程页面查询可用优惠券列表
     */
    async getAvailableList(){
        let query = {
            params:{
                courseId:this.courseId
            }
        }
        let res = await this.$axios.$get(this.$server.getAvailableList,query);
        if(res.status==200){
            this.couponList = res.content
            this.couponList.forEach(item=>item.showText = false)
            this.$nextTick(()=>{
                if(this.couponList.length>3){
                    let length = this.couponList.length
                    let w = length*316+20*(length-1);
                    this.couponStyle = {width:`${w}px`}
                }
            })
        }
    }
    /**
     * 指定课程优惠券文本显示/隐藏
     */
    textShow(e,item,index){
        e.stopPropagation();
        // if(e.target.scrollWidth<=e.target.offsetWidth)return false;
        item.showText = !item.showText;
        this.$set(this.couponList,index,item)
    }
    /**
     * 选择优惠券
     */
    chioceItem(obj){
        if(this.couponId ==obj.id){
            this.couponId = 0;
            this.couponPrice = 0;
            return;
        }else{
            this.couponId = obj.id;
            this.couponPrice = obj.reducedPrice;
            return;
        }
    }
    /**
     * 切换优惠券列表
     */
    switchCoupon(flag){
        let distance = 316+20;
        if(flag=='next'){
            if(this.couponIndex==this.couponList.length-3) return;
            this.couponIndex++;
            this.$nextTick(()=>{
                this.conponX= this.couponIndex==this.couponList.length-3?-((this.couponIndex-1)*distance+247):-this.couponIndex*distance;
                this.couponStyle = Object.assign({},this.couponStyle,{
                    transform:`translateX(${this.conponX}px)`
                })
            })
        }else{
            if(this.couponIndex==0) return;
            this.couponIndex--;
            this.$nextTick(()=>{
                this.conponX = this.couponIndex==this.couponList.length-4?this.conponX+247: distance+this.conponX
                this.couponStyle = Object.assign({},this.couponStyle,{
                    transform:`translateX(${this.conponX}px)`
                })
            })
        }
    }
    /**
     * 生成二维码
     */
    createQRCode(url){
        let qrcode = new QRCode(this.$refs.qrCodeUrl, {
            text: url, // 二维码内容
        })
        setTimeout(()=>{
            document.querySelector('.code-url img').style.width="100%"
        },1)
    }
    /**
     * 购买课程
     */
    async buyCourse(){
        clearInterval(this.time)
        clearInterval(this.timer)
        let loadingInstance = this.$loading.service({
            background:'rgba(255,255,255,0)'
        });
        let query = {
            courseId:Number(this.courseId),
            paymentType:this.paymentType=='wx'?2:3,
            returnUrl:window.location.origin+'/course/result',
            sourceType:4,
            buyType:(this.courseData.timeLimitType==2&&this.isStart)?'1':''
        }
        if(this.couponPrice>0){
            query.userCouponsId = this.couponId;
        }
        let res = await this.$axios.$post(this.$server.buy,query)
        loadingInstance.close()
        if(res.status==200){
            if(this.courseData.sellingPrice-this.couponPrice<=0){
                this.setOrderData({
                    successFlag:true,
                    info:[
                        {label:'支付课程名称',value:this.courseData.title},
                        {label:'支付金额',value:'¥0'},
                        {label:'支付方式',value:this.paymentType=='wx'?'微信':'支付宝'}
                    ]
                })
                this.$router.replace(`/course/result?id=${this.courseId}`)
                return;
            }
            if(this.paymentType=='wx'){
                document.querySelector(".code-url").innerHTML = ''
                let url = res.content.wechatInfo.code_url
                this.createQRCode(url);
                this.timer = setInterval(()=>{
                    this.getBuyOrderState(res.content.orderId);
                },2000)
            }else{
                document.querySelector(".code-url").innerHTML = ''
                let alipayInfo = JSON.parse(res.content.alipayInfo)
                this.createQRCode(alipayInfo.alipay_trade_precreate_response.qr_code)
                this.timer = setInterval(()=>{
                    this.getBuyOrderState(res.content.orderId);
                },2000)
            }
            this.codeDialogTitle = this.paymentType=='wx'?'微信扫描支付':'支付宝扫描支付'
            this.codeDialogTips = this.paymentType=='wx'?'微信扫描二维码以完成支付':'支付宝扫描二维码以完成支付'
            this.codeTime = 45
            this.codeFlag = true;
            this.time = setInterval(()=>{
                this.codeTime--;
                if(this.codeTime<=0){
                    document.querySelector(".code-url").innerHTML = ''
                    this.createQRCode(window.location.href)
                    clearInterval(this.time);
                }
            },1000)
        }else{
            this.setOrderData({
                successFlag:false,
                errorText:res.message
            })
            this.$router.replace(`/course/result?id=${this.courseId}`)
        }
    }
    /**
     * 查询微信支付购买课程订单状态
     */
    async getBuyOrderState(orderId){
        let query = {
            params:{
                orderId
            }
        }
        let res = await this.$axios.$get(`${this.$server.getBuyOrderState}/${this.courseId}`,query)
        if(res.status==200){
            if(res.content.orderStatus==1){
                clearInterval(this.timer);
                let obj = {
                    successFlag:true,
                    info:[
                        {label:'支付课程名称',value:this.courseData.title},
                        {label:'支付金额',value:this.courseData.sellingPrice-this.couponPrice>0?('¥'+(this.courseData.sellingPrice*1000-this.couponPrice*1000)/1000):'¥0'},
                        {label:'支付方式',value:this.paymentType=='wx'?'微信':'支付宝'}
                    ]
                }
                 if(this.courseData.timeLimitType==2&&this.isStart){
                    let temp = obj.info.find(item=>item.label=='支付金额');
                    if(temp){
                        temp.value = '¥'+this.courseData.spikePrice;
                    }
                 }
                this.setOrderData(obj)
                this.$router.replace(`/course/result?id=${this.courseId}`)
            }
        }else{
            this.setOrderData({
                successFlag:false,
                errorText:res.message
            })
            this.$router.replace(`/course/result?id=${this.courseId}`)
        }
    }
}
</script>
<style lang="scss" scoped>
    .order-page{
        background: #F3F5F7;
        margin-top:30px;
        .page-top{
            width: 1200px;
            margin:0 auto;
            height: 250px;
            background: #fff;
            box-shadow:0px 2px 10px 0px rgba(230,230,230,1);
            border:1px solid rgba(243, 245, 247, 1);
            padding: 30px;
            .tips{
                margin:0 0 20px 0;
                font-size: 20px;
                color:#333333;
                font-weight:bold;
                line-height: 24px;
            }
            .course-data{
                font-size: 0;
                .course-surface{
                    width: 255px;
                    height: 143px;
                    margin-right: 23px;
                    display: inline-block;
                    vertical-align:top;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .text{
                    display: inline-block;
                    vertical-align:top;
                }
                .course-title{
                    font-size: 20px;
                    color:#333333;
                    line-height: 20px;
                    margin-bottom: 15px;
                }
                .course-price{
                    font-size: 22px;
                    color:#CC0033;
                    font-weight:bold;
                }
                .channel-avaliday{
                    color:#666666;
                    font-size: 14px;
                    margin-top:15px;
                }
            }
        }
        .content{
            width: 1200px;
            margin:30px auto 0;
            background: #fff;
            box-shadow:0px 2px 10px 0px rgba(230,230,230,1);
            border:1px solid rgba(243, 245, 247, 1);
            padding: 30px;
            .coupon{
                padding-bottom:40px;
                margin-bottom: 30px;
                border-bottom:1px solid #CCCCCC;
            }
            .tips{
                margin:0 0 20px 0;
                font-size: 20px;
                color:#333333;
                font-weight:bold;
                line-height: 24px;
            }
            .coupon-box{
                height: 115px;
                font-size: 0;
                .prev,.next{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 24px;
                }
                .prev{
                    margin-right: 6px;
                }
                .next{
                    margin-left: 6px;
                }
                .coupon-list-box{
                    display: inline-block;
                    vertical-align: middle;
                    width: 1078px;
                    height: 100%;
                    overflow: hidden;
                    .list{
                        display: block;
                        height: 100%;
                        transition: transform 0.3s ease-in;
                        .item{
                            float: left;
                            width: 316px;
                            height: 100%;
                            margin-right: 20px;
                            border-radius:4px;
                            position: relative;
                            &:last-child{
                               margin:0; 
                            }
                            &.money-off {
                                background: RGBA(219, 110, 110, 1) url('../../../assets/images/unused-1.png') no-repeat top left 100%/100%;
                            }
                            &.all-reduction {
                                background: RGBA(209, 149, 86, 1) url('../../../assets/images/unused-2.png') no-repeat top left 100%/100%;
                            }
                            .coupon-container {
                                height: 83px;
                                display: flex;
                                position: relative;
                                overflow: hidden;
                                border-radius:4px 4px 0 0;
                                .price {
                                    height: 100%;
                                    padding-top: 32px;
                                    align-self: center;
                                    padding-left: 13.5px;
                                    margin-right: 9px;
                                    font-size:28px;
                                    color: RGBA(255, 255, 255, 1);
                                    span:last-child {
                                        font-size: 17px;
                                        margin-left: 4px;
                                        vertical-align: middle;
                                    }
                                }
                                .info{
                                    color:rgba(255,255,255,1);
                                    margin-left: 4.5px;
                                    padding: 11px 0;
                                    &.status0{
                                        padding: 22px 0;
                                        p{line-height: 24px}
                                    }
                                    p{
                                        line-height: 20px;
                                        font-size:12px;
                                    }
                                }
                                .choose-icon{
                                    position:absolute;
                                    top:0;
                                    right: 0;
                                    width: 41px;
                                    height: 41px;
                                    display: inline-block;
                                    background: url('../../../assets/images/coupon_choose_icon.png')no-repeat 50% 50% /cover;
                                }
                                .coupon-type {
                                }
                                .time {
                                    font-size: 12px;
                                    margin-top: .25rem;
                                }
                                .card-number {
                                }
                            }
                            .coupon-explain {
                                height: 32px;
                                line-height: 32px;
                                word-break: break-all;
                                padding: 0 15px;
                                color: #ffffff;
                                p {
                                   font-size:12px;
                                }
                                .coupon-course{
                                    cursor: default;
                                }
                            }
                        }
                    }
                    .coupon-shade-wrap{
                        position: absolute;
                        top:0;
                        left: 0;
                        width: 100%;
                        height:100%;
                        background: rgba(0,0,0,0.7);
                        color:#fff;
                        border-radius:4px 4px 0 0;
                        padding: 10px;
                        font-size: 14px;
                        &.hidden{
                            display: none;
                        }
                        &.show{
                            display: block;
                        }
                    }
                }
            }
            .discount{
                padding: 0 0 30px 0;
                border-bottom:1px solid #CCCCCC;
                .tips{
                    font-size: 20px;
                    font-weight: bold;
                    color:#333;
                    line-height: 24px;
                    float: left;
                    margin:0px;
                }
                .data{
                    float: right;
                    font-size: 16px;
                    color:#333;
                    line-height: 24px;
                }
            }
            .order-box{
                padding:30px 0 100px 0;
                .explain{
                    float: left;
                    p{
                        color:#999999;
                        font-size: 14px;
                        line-height: 20px;
                    }
                }
                .course-order-data{
                    float: right;
                    .item{
                        margin:10px 0;
                        font-size: 0;
                        p{
                            display: inline-block;
                            vertical-align: middle;
                            font-size: 20px;
                        }
                        .label{
                            width: 140px;
                            text-align: right;
                            color:#666666;
                        }
                        .value{
                            width: 180px;
                            text-align: right;
                            color:#333333;
                        }
                        &.order-price{
                            .label{
                                font-size: 20px;
                                font-weight: bold;
                                 color:#333333;
                            }
                            .value{
                                color:#CC0033;
                                font-size: 24px;
                                font-weight: bold;
                            }
                        }
                    }
                    .check-box{
                        font-size: 0;
                        margin:40px 0 30px 0;
                        .checked{
                            border-color:#CC0033!important;
                            .check-icon{
                                display: block!important;
                            }
                        }
                        .wx-pay,.ali-pay{
                            cursor: pointer;
                            width: 150px;
                            height: 50px;
                            border:2px solid #CCCCCC;
                            display: inline-block;
                            vertical-align: middle;
                            font-size: 0;
                            line-height: 48px;
                            text-align: center;
                            position: relative;
                            .icon{
                                display: inline-block;
                                vertical-align: middle;
                                width: 29px;
                                height: 23px;
                            }
                            .check-icon{
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                width: 25px;
                                height: 25px;
                                background: url('../../../assets/images/check_icon.png')no-repeat 50% 50%/cover;
                                display: none;
                            }
                            p{
                                color:#333333;
                                font-size: 16px;
                                display: inline-block;
                                vertical-align: middle;
                                margin-left: 4px;
                            }
                        }
                        .wx-pay{margin-right: 40px}
                        .wx-pay i{background: url('../../../assets/images/wx_pay_icon.png')no-repeat 50% 50% /cover}
                        .ali-pay i{background: url('../../../assets/images/ali_pay_icon.png')no-repeat 50% 50% /cover}
                    }
                    button{
                        width: 150px!important;
                        float: right;
                    }
                }
            }
        }
        .code-dialog{
            position: fixed;
            top:0;
            left: 0;
            width: 100%;
            height:100%;
            background: rgba(0,0,0,0.7);
            z-index: 1000;
            .code-box{
                width: 474px;
                height: 488px;
                position: absolute;
                top:50%;
                left:50%;
                transform: translate(-50%,-50%);
                background: #fff;
                border-radius:6px;
                text-align: center;
                overflow: hidden;
                .t{
                    height: 56px;
                    line-height: 56px;
                    padding: 0 29px;
                    color:#6A6A6A;
                    font-size: 19px;
                    text-align: left;
                    background: #EDF1F7;
                    position: relative;
                    i{
                        font-size: 28px;
                        color:#CC0033;
                        position: absolute;
                        right: 20px;
                        top:14px;
                    }
                }
                .code-url{
                    width: 238px;
                    height: 238px;
                    margin:60px 0 20px 0;
                    display: inline-block;
                    overflow: hidden;
                }
                .tips{
                    p{
                        font-size: 22px;
                        color:#6A6A6A;
                        line-height: 28px;
                    }
                    span{
                         font-size: 22px;
                        color:#CC0033;
                    }
                }
                .re-buy-btn{
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
            img{
                width: 100%!important;
                height: 100%!important;
            }
        }
    }
    .switchShade-enter-active, .switchShade-leave-active {
        transition:all 0.3s;
    }
    .switchShade-enter, .switchShade-leave-to /* .fade-leave-active below version 2.1.8 */ { 
        transform: translateY(-100%)
    }
</style>
