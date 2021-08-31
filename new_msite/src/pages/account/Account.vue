<template>
	<div class="header-nav">
		<Header :name="'我的账户'"/>
		<router-link to="/user/detail" class="detail">明细</router-link>
		<div class="remaining">
			<div class="remaining-num">
				{{coinBalance}}
			</div>
			<div class="remaining-word c9a">
				可用余额（夫子币）
			</div>
		</div>
		<div v-if="coinDefault.length==0" style="text-align:center">
			<van-loading type="spinner" style="display:inline-block" />
		</div>
		<ul class="clearfix">
			<li class="item fl" v-for="(item,index) in coinDefault" :key="index" @click="checkDefault(item,index)" :class="{'active':index===defaultIndex}">
                <h3 class="tc recharge-num">{{item.coinsName}}</h3>
                <p class="tc actual-num">（¥{{item.priceAndroid.toFixed(2)}}）</p>
            </li>
		</ul>
		<div class="sure-button" @click="surePay">
			立即充值
		</div>
		<div class="explain-title">
			<p class="c3a">充值说明</p>
		</div>
		<div class="explain-con c9a">
			<p>1.充值金额无使用期限，充值成功后无法退换，不可提现；</p>
			<p>2.如果遇到无法充值、充值失败等问题，可关注学国学网微信公众号，解决你的问题。</p>
		</div>
		<transition name="fade">
			<ChoicePayWay v-if="showPayWay" :showPayWay.sync="showPayWay" :coinId="coinId" v-on:openDialog="openDialog"></ChoicePayWay>
		</transition>
		
	</div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import Header from '@/components/Header.vue'
import ChoicePayWay from "./choicePayWay.vue"
function getQueryString(key){
		var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
		var result = window.location.search.substr(1).match(reg);
		return result?decodeURIComponent(result[2]):null;
	}
export default {
	data(){
		return {
			coinDefault:[],
			defaultIndex:'',
			showPayWay:false,
			coinId:'',
			// openId:'',
			coinBalance:''
		}
	},
	watch:{
		showPayWay(cur,old){
			if(cur){
				let audioData = Object.assign({},this.audioData,{bottom:'3.2rem'})
                this.setAudioData(audioData)
			}else{
				let audioData = Object.assign({},this.audioData,{bottom:'8px'})
                this.setAudioData(audioData)
			}
		}
	},
	computed:{
		...mapState(['hasOpenApp','audioData']),
	},
	created(){
		this.init()
		this.getUserInfo()
		this.getCoinsList()
	},
	methods:{
		...mapActions(['setAudioData']),
		/**
		 * 获取余额
		 */
		getUserInfo(){
			this.$http.post(this.$server.getUserInfoById,{}).then(res =>{
				if(res.data.status == 200){
					this.coinBalance = res.data.content.coinBalance.toFixed(2)
				}
			})
		},
		/**
		 * 获取夫子币列表
		 */
		getCoinsList(){
			this.$http.post(this.$server.getCoinsList,{}).then(res=>{
				if(res.data.status == 200){
					this.coinDefault = res.data.content;
				}
			})
		},
		onClickLeft(){
			let path = sessionStorage.getItem('buyToAccount')
			if(path){
				sessionStorage.removeItem('buyToAccount')
				this.$router.go(-1)
			}else{
				this.$router.replace('/user')
			}	
		},
		checkDefault(item,index) {
			this.coinId = item.id;
            this.diyNum = "";
            if (this.defaultIndex === index) {
				this.defaultIndex = "";
				this.coinId = ''
            }else {
                this.defaultIndex = index;
			}
        },
        surePay(){
        	if (this.coinId=='') {
				this.$toast('请选择充值金额');
				return;
			}
			this.showPayWay = true;
		},
		init(){
			var ua = window.navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
				this.supportAli = false;
			}else{
				let wechatType = localStorage.getItem("wechatType")
				if(wechatType){
					this.$dialog.confirm({
						title:'提示',
						message: "请确认微信支付是否已完成",
						confirmButtonColor:"#D40015",
						confirmButtonText:'支付成功',
						cancelButtonText:'关闭'
					}).then(() => {
						this.checkOrder()
					}).catch(() => {
						localStorage.removeItem("wechatType")
						localStorage.removeItem("orderId");
					});
				}
			}
		},
		openDialog(){
			this.$dialog.confirm({
				title:'提示',
				message: "请确认微信支付是否已完成",
				confirmButtonColor:"#D40015",
				confirmButtonText:'支付成功',
				cancelButtonText:'关闭'
			}).then(() => {
				this.checkOrder()
			}).catch(() => {
				localStorage.removeItem("wechatType")
				localStorage.removeItem("orderId");
			});
		},
		/**
		 * 检查微信支付订单
		 */
		checkOrder(){
			let orderId = localStorage.getItem("orderId");
			if(orderId){
				let query = {
					outTradeNo:orderId,
					paymentType:2
				}
				this.$http.post(this.$server.checkOrder,query).then(res=>{
					localStorage.removeItem("wechatType")
					localStorage.removeItem("orderId");
					if(res.data.status == 200){
						this.getUserInfo()
						this.getCoinsList()
					}
				})
			}
		}
	},
	components:{
		ChoicePayWay,Header
	},
}

</script>

<style lang="scss" scoped>
.header-nav{
	position: relative;
}
.go-back{
	width: .5rem;
	height: .5rem;
	vertical-align: middle;
}
.detail{
	position: absolute;
	right: 0;
	top:0;
	color:#B4272D;
	padding: 0 0.3rem;
	background: #fff;
	z-index: 10;
	font-size: 0.3rem;
	line-height: 1rem;
}
.remaining{
	text-align: center;
	padding: .75rem 0 .45rem;
	.remaining-num{
		font-weight: bold;
		font-size: .6rem;
		margin-bottom: .4rem;
	}
	.remaining-word{
		font-size: .32rem;
	}
}
ul{
	padding-left: .4rem;
	.item {
        width:1.92rem;
		height:1.22rem;
        margin: .25rem 0 0 0.2rem;
        color: #B4272D;
        background: #fff;
        border: 1px solid #F1F1F1;
        border-radius: .1rem;
        .recharge-num {
            font-size: 0.3rem;
            padding: 0.2rem 0 0.13rem;
        }
        .actual-num {
            font-size: 0.24rem;
        }
        &.active {
            background: #B4272D;
            color: #fff;
            border: 1px solid transparent;
        }
    }
}
.sure-button{
	width: 5rem;
	height: .88rem;
	margin: .6rem auto .35rem;
	line-height: .88rem;
}
.explain-title{
	border-bottom: 1px solid #F1F1F1;
	p{
		padding-left: .22rem;
		line-height: .88rem;
		font-size: .3rem;
	}
}
.explain-con{
	padding: .27rem .3rem;
	font: .24rem/.45rem "";
}
</style>
<style lang="scss">
	.header-nav {
		.van-hairline--bottom::after{
			width: 0;
		}
		.van-nav-bar__title{
			font: normal .32rem/.88rem "";
		}
		.van-nav-bar__right a{
			color: #B4272D;
			font-size: .26rem;
		}
	}
	
</style>