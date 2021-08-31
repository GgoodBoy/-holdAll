<template>
    <div class="order-page">
        <div class="top">
            <img :src="bgd"/>
            <div class="tips" v-if="tips1.length>0&&tips2.length>0">
                <p>{{tips1}}</p>
                <p>{{tips2}}</p>
            </div>
        </div>
        <div class="middle">
            <div class="box">
                <p class="tips">请选择支付方式</p>
                <div class="icons">
                    <div class="item wx" @click="paymentType=2">
                        <i class="icon"></i>
                        <p>微信支付</p>
                        <i class="active" v-show="paymentType==2"></i>
                    </div>
                    <div class="item zfb" @click="paymentType=3" v-if="!inWx">
                        <i class="icon"></i>
                        <p>支付宝支付</p>
                        <i class="active" v-show="paymentType==3"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom" @click="buyEvent"><span class="price">¥{{price}}</span><span class="unit"></span><span>确认支付</span></div>
    </div>    
</template>
<script>
import bgd1 from '../assets/image/order_bgd1.png'
// const course = '330,331,335,333'
const course = '9,660,631,7'
let name = ['']
export default {
    data(){
        return{
            bgd:bgd1,
            tips1:'',
            tips2:'',
            price:0,
            courseNames:[],
            courseIds:'',
            paymentType:2,
            inWx:false,
            totalPrice:196,
            salePrice:49
        }
    },
    beforeRouteLeave(to, from, next){
        sessionStorage.setItem('from','order')
        next()
    },
    created(){
        let from = sessionStorage.getItem('from');
        if(from){
            this.init()
        }else{
            this.$router.replace('/')
        }
    },
    methods:{
        init(){
            let courseNames = sessionStorage.getItem('courseNames')
            if(courseNames){
                this.courseNames = JSON.parse(courseNames);
                if(this.courseNames.length>0){
                    this.tips1 = '您好,检测到您已购买';
                    this.price = ((this.totalPrice*1000) - this.courseNames.length*(this.salePrice*1000))/1000;
                    let courseNameTemp = this.courseNames.map(item=>{
                        return item.name.includes('《')?item.name:`《${item.name}》`;
                    }).join('，')
                    this.tips2 = `${courseNameTemp}，将为您再优惠${this.courseNames.length*this.salePrice}元。`
                    let temp = []
                    course.split(',').forEach(item=>{
                        let _index = this.courseNames.findIndex(option=>option.id==item);
                        if(_index<0){
                            temp.push(item)
                        }
                    })
                    this.courseIds = temp.join(',')
                }else{
                    this.tips1 = '您好,';
                    this.tips2 = `本次订单优惠后金额仅需${this.totalPrice}元`;
                    this.courseIds = course
                    this.price = this.totalPrice
                }
            } 
            let ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                this.inWx = true;
            }else{
                let wechatType = localStorage.getItem("wechatType");
                if(wechatType){
					this.$dialog.confirm({
						title:'提示',
						message: "请确认微信支付是否已完成?",
						confirmButtonColor:"#D40015",
						confirmButtonText:'已完成支付',
						cancelButtonText:'关闭'
					}).then(() => {
						this.checkOrder();
					}).catch(() => {
						this.checkOrder();
					});
				}
            }
        },
        checkOrder(){
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            let orderId = localStorage.getItem("orderId");
            if(orderId){
				localStorage.removeItem("wechatType");
                localStorage.removeItem("orderId");
            }
            const query = {
                orderId:orderId
            }
            this.$http.post(this.$server.getBuyOrderState,query).then(res=>{
                setTimeout(()=>{
                    this.$toast.clear()
                },500)
                if(res.data.status==200){
                    if(res.data.content.orderStatus==1){
                        this.$router.replace('/result?flag=success')
                    }else{
                        this.$router.replace('/result?flag=fail')
                    }
                }else{
                    this.$router.replace('/result?flag=fail')
                }
            })
        },
        verifyCourse(){
            let query = {
                courseId:course
            }
            this.$http.post(this.$server.verifyCourse,query).then(res=>{
                this.$toast.clear()
                if(res.data.status==200){
                    sessionStorage.setItem('courseNames',JSON.stringify(res.data.content))
                    setTimeout(()=>{
                        this.init()
                    },1)
                }else{
                    this.$toast(res.data.message)
                }
            })
        },
        buyEvent(){
            this.verifyCourse()
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            if(this.paymentType==2){
                if (typeof WeixinJSBridge == "undefined"){
                    this.wxPayInOther()
                }else{
                    this.wxPayInWx()
                }
            }else{
                this.aliPay()
            }
        },
        /**
         * 外部浏览器微信支付
         */
        wxPayInOther(){
            const query = {
                courseIds:this.courseIds,
                paymentType:this.paymentType,
                returnUrl:encodeURIComponent(window.location.href)
            }
            this.$http.post(this.$server.createOrder,query).then(res=>{
                this.$toast.clear();
                if(res.data.status==200){
                    localStorage.setItem("wechatType","true")
                    localStorage.setItem('orderId',res.data.content.orderId)
                    window.location.href = res.data.content.wechatInfo.mweb_url;
                }else{
                    if(res.data.message=='交易失败'){
                        this.$router.replace('/result?flag=fail')
                    }
                }
            })
        },
        /**
         * 微信内支付
         */
        wxPayInWx(){
            let timer = setInterval(()=>{
                let openId = localStorage.getItem('activityOpenId')
                const query = {
                    courseIds:this.courseIds,
                    paymentType:5,
                    returnUrl:encodeURIComponent(window.location.href),
                    openId:openId
                }
                this.$http.post(this.$server.createOrder,query).then(res=>{
                    this.$toast.clear();
                    if(res.data.status==200){
                        let data = res.data.content.wechatInfo;
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                "appId":data['appid'],     
                                "timeStamp":data['timestamp'],         
                                "nonceStr":data['nonce_str'], 
                                "package":'prepay_id'+'='+data['prepay_id'],
                                "signType":data['sign_type'],         
                                "paySign":data['sign'] 
                            },
                            (res)=>{
                                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                                    this.$router.replace('/result?flag=success')
                                }     
                            }
                        )
                    }else{
                        if(res.data.message=='交易失败'){
                            this.$router.replace('/result?flag=fail')
                        }
                    }
                    clearInterval(timer);
                }).catch(()=>{
                    clearInterval(timer);
                })
            },500)
        },
        /**
         * 支付宝支付
         */
        aliPay(){
            const query = {
                courseIds:this.courseIds,
                paymentType:this.paymentType,
                returnUrl:window.location.href
            }
            this.$http.post(this.$server.createOrder,query).then(res=>{
                this.$toast.clear();
                if(res.data.status==200){
                    let url = `https://openapi.alipay.com/gateway.do?${res.data.content.alipayInfo}`
                    window.location.replace(url)
                }else{
                    if(res.data.message=='交易失败'){
                        this.$router.replace('/result?flag=fail')
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .order-page{
        width: 100%;
        position: relative;
        height: 100%;
        .top{
            position: relative;
            height: 5.82rem;
            img{
                display: block;
            }
            .tips{
                position: absolute;
                text-align: center;
                font-size: 0.34rem;
                line-height: 0.5rem;
                color:#fff;
                top:3.4rem;
                left: 5%;
                width: 90%;
                text-align: center;
            }
        }
        .middle{
            height: calc(100% - 6.88rem);
            background: #fff;
            position: relative;
            .box{
                position: absolute;
                top:50%;
                left: 50%;
                transform: translate(-50%,-50%);
                .tips{
                    font-size: 0.3rem;
                    color:#666;
                    text-align: center;
                    margin-bottom:1rem;
                }
                .icons{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .item{
                        position: relative;
                        display: flex;
                        flex-wrap: wrap;
                        width: 1.5rem;
                        justify-content: center;
                        .active{
                            position: absolute;
                            right: 0.1rem;
                            top:0;
                            display: block;
                            height: 0.4rem;
                            width: 0.4rem;
                            background:url('../assets/image/active.png') no-repeat 50% 50% / cover;
                        }
                        
                    }
                    p{
                        font-size: 0.28rem;
                        color:#666;
                        text-align: center;
                        margin:0.1rem 0;
                    }
                    .icon{
                        width: 1.3rem;
                        height: 1.3rem;
                        display: block;
                    }
                    .wx{
                        .icon{
                            background:url('../assets/image/weixin.png') no-repeat 50% 50% / cover;
                        }
                    }
                    .zfb{
                        margin-left: 0.92rem;
                        .icon{
                            background:url('../assets/image/zhifubao.png') no-repeat 50% 50% / cover;
                        }
                        p{

                        }
                    }
                }
            }
        }
        .bottom{
            height:1.06rem;
            width:100%;
            line-height: 1.06rem;
            background: rgba(195, 13, 35, 0.9);
            color:#fff;
            position: absolute;
            bottom:0;
            left: 0;
            font-size: 0.3rem;
            text-align: center;
            &:active{
                background:rgba(195, 13, 35, 1) ;
            }
            span{
                display: inline-block;
                vertical-align: middle;
                &.price{
                    font-size: 0.32rem;
                }
                &.unit{
                    margin:0 0.2rem;
                    width: 2px;
                    height: 14px;
                    background: #fff;
                    transform: rotate(20deg);
                }
            }
        }
    }
</style>