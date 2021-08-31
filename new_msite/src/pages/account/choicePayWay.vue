<template>
	<div class="pay-way-wrap">
		<div class="pay-way">
			<div @click="wxpay">
				<img :src="img1" alt="">
				<span class="c9a">微信支付</span>
			</div>
			<div  @click="alipay" v-if="supportAli">
				<img :src="img2" alt="">
				<span class="c9a">支付宝支付</span>
			</div>
			<div class="cancle" @click="cancle">
				<span>取消</span>
			</div>
		</div>
		
	</div>
</template>

<script>
// import returnCitySN from 'returnCitySN' 
import img1 from '@/assets/image/weixin.png'
import img2 from '@/assets/image/zhifubao.png'
function getQueryString(key){
	var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
	var result = window.location.hash.split("?")[1].match(reg);
	return result?decodeURIComponent(result[2]):null;
}
function onBridgeReady(data){
	let json = {
		"appId":data['appid'],     //公众号名称，由商户传入
		"timeStamp":data['timestamp'],         //时间戳，自1970年以来的秒数
		"nonceStr":data['nonce_str'], //随机串
		"package":'prepay_id'+'='+data['prepay_id'],
		"signType":data['sign_type'],         //微信签名方式：
		"paySign":data['sign'] //微信签名
	}
	WeixinJSBridge.invoke(
		'getBrandWCPayRequest', {
			"appId":data['appid'],     //公众号名称，由商户传入
			"timeStamp":data['timestamp'],         //时间戳，自1970年以来的秒数
			"nonceStr":data['nonce_str'], //随机串
			"package":'prepay_id'+'='+data['prepay_id'],
			"signType":data['sign_type'],         //微信签名方式：
			"paySign":data['sign'] //微信签名
		},
		(res)=>{
			if(res.err_msg == "get_brand_wcpay_request:ok" ) {
				this.$dialog.alert({
					message: '微信支付成功'
				}).then(() => {
					window.location.hash = 'user'
					window.location.reload();
				})
			}     

		}
	);
}
export default {
	data(){
		return {
			supportAli:true,
			img1:img1,
			img2:img2
			// openId:''
		}
	},
	props:['coinId'],
	created(){
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
			this.supportAli = false;
		}
	},
	methods:{
		cancle(){
			this.$emit("update:showPayWay",false)
		},
		alipay(){
			let query = {
				coinsId:this.coinId,
				paymentType:3,
				returnUrl:window.location.origin+'?type=1'
			}
			this.$http.post(this.$server.buyCoins,query).then(res=>{
				if(res.data.status == 200){
					let url = `https://openapi.alipay.com/gateway.do?${res.data.content.alipayInfo}`
					window.location.href = url
				}
			})
		},
		/**
		 * 微信支付
		 */
		wxpay(){
			let query = {
				coinsId:this.coinId,
				paymentType:2,
				returnUrl:encodeURIComponent(window.location.href),
			}
			this.$toast.loading({
				mask: false,
				loadingType:'spinner'
			});
			if (typeof WeixinJSBridge == "undefined"){
				this.$http.post(this.$server.buyCoins,query).then(res=>{
					if(res.data.status == 200){
						localStorage.setItem("wechatType","true")
						localStorage.setItem('orderId',res.data.content.wechatInfo.outTradeNo)
						this.$emit('openDialog','true')
						window.location.href = res.data.content.wechatInfo.mweb_url;
						// window.location.replace
					}
				})
			}else{
				var time = null;
				time = setInterval(()=>{
					let openId = localStorage.getItem('openId')
					if(openId&&openId!=''){
						query.openId = openId;
						// query.returnUrl = window.location.href;
						query.paymentType = 5
						this.$http.post(this.$server.buyCoins,query).then(res=>{
							if(res.data.status == 200){
								this.onBridgeReady(res.data.content.wechatInfo);
							}
						})
						clearInterval(time);
					}
					else{
						this.$toast('当前环境不支持公众号支付，请检查微信配置')
						clearInterval(time);
					}
				},1000)
			}
		},
		onBridgeReady(data){
			let json = {
				"appId":data['appid'],     //公众号名称，由商户传入
				"timeStamp":data['timestamp'],         //时间戳，自1970年以来的秒数
				"nonceStr":data['nonce_str'], //随机串
				"package":'prepay_id'+'='+data['prepay_id'],
				"signType":data['sign_type'],         //微信签名方式：
				"paySign":data['sign'] //微信签名
			}
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest', {
					"appId":data['appid'],     //公众号名称，由商户传入
					"timeStamp":data['timestamp'],         //时间戳，自1970年以来的秒数
					"nonceStr":data['nonce_str'], //随机串
					"package":'prepay_id'+'='+data['prepay_id'],
					"signType":data['sign_type'],         //微信签名方式：
					"paySign":data['sign'] //微信签名
				},
				(res)=>{
					if(res.err_msg == "get_brand_wcpay_request:ok" ) {
						this.$dialog.alert({
							message: '微信支付成功'
						}).then(() => {
							// window.location.hash = 'user/account'
							window.location.reload();
						})
					}     

				}
			);
		}
	}
}

</script>

<style lang="scss" scoped>
.pay-way-wrap{
	width: 100%;
	height: 100vh;
	background: rgba(0, 0, 0, .6);
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 20;
	.pay-way{
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		>div{
			text-align: center;
			background: #fff;
			line-height: .98rem;
			border-bottom: 1px solid #F9F9FB;
			img{
				width: .65rem;
				height: .65rem;
				vertical-align: middle;
			}
			span{
				display: inline-block;
				vertical-align: middle;
			}
		}
		.cancle{
			color: #CACACA;
			font-size: .32rem;
			background: #F5F5F5;
		}
	}
	
}
</style>