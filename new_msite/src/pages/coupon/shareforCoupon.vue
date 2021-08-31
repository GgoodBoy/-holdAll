<template>
	<div class="receive-wrap">
		<div class="title">领取优惠券</div>
		<div class="bg" ref="bg">
			<div class="download">
				<div>
					<img :src="logo" alt="">
				</div>
				<div class="keyword">
					专注优秀传统文化教育与传播
				</div>
				<a class="down-btn" :href="isIos?'https://itunes.apple.com/cn/app/id1447039784?ls=1&mt=8':'http://a.app.qq.com/o/simple.jsp?pkgname=com.xueguoxue.xgxw2018'">
					立即打开
				</a>
			</div>
			<div v-if="!isSuccess" class="phone-wrap">
				<input type="tel" placeholder="输入手机号，领取优惠券" maxlength="11" :class="tips.length>0?'error':''" v-model="phone" @input="inputPhone" @blur="blurEvent">
				<p class="tips">{{tips}}</p>
				<div class="get-button" :class="agree?'':'disabled'" @click="receive">立即领取</div>
				<div class="protocol">
					<div class="checkbox" @click="changeCheckBox">
						<img v-show="!agree" :src="check" alt="">
						<img v-show="agree" :src="nocheck" alt="">
					</div>
					<span>我已阅读并同意学国学网</span><span class="rule" @click="openPop">活动规则</span>
				</div>
			</div>
			<div v-else class="success">
				<p class="success-title w">恭喜您领取成功!</p>
				<h1 class="w">{{reducedPrice?reducedPrice.toFixed(2):''}}</h1>
				<div class="line"></div>
				<div class="intorduce">
					<p>全站通用优惠券</p>
					<p>有效期：30天内有效</p>
					<p>优惠券已放入账户：<span>{{phoneStr}}</span> <span class="change" @click="changePhone">修改</span></p>
				</div>
				<div class="down-tip">
					<p>下载[学国学网]App，使用优惠券</p>
					<a class="down" :href="isIos?'https://itunes.apple.com/cn/app/id1447039784?ls=1&mt=8':'http://a.app.qq.com/o/simple.jsp?pkgname=com.xueguoxue.xgxw2018'">去下载</a>
				</div>
			</div>
		</div>
		<transition name='fade'>
			<div v-if="showRulesPop" class="rules-pop">
				<div class="rules">
					<p class="t">活动规则</p>
					<p class="content">1.注册后，你与邀请人分别获得一张 10元全站通用优惠券；</p>
					<p class="content">2.购买商品时，优惠券最多只能使用一张；</p>
					<p class="content">3.优惠券领取成功后，请在30天内注册，否则视为自动放弃；</p>
					<p class="content">4.在参与活动过程中，如发现违规行为（违规行为包括但不限于恶意批量注册、无效手机、虚假信息等）学国学网将封停账号，并撤销获得的相关赠品。</p>
					<div class="button" @click="closePop">
						关闭
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import Logo from '@/assets/image/logo.png'
import check from '@/assets/image/checkbox.png'
import nocheck from '@/assets/image/checkbox-in.png'
function getQueryString(key){
	var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	return result?decodeURIComponent(result[2]):null;
}
export default {
	data(){
		return {
            logo:Logo,
            check:check,
            nocheck:nocheck,
			isSuccess:false,
			agree:true,
			phone:'',
			tips:'',
			reducedPrice:'',
			userId:'',
			couponId:'',
			phoneStr:'',
			showRulesPop:false,
			isIos:false
		}
	},
	methods:{
		openPop(){
			this.showRulesPop=true;
		},
		closePop(){
			this.showRulesPop=false;
		},
		inputPhone(){
			this.tips = ''
		},
		changeCheckBox(){
			this.agree = !this.agree;
		},
		blurEvent(){
			 window.scroll(0,0);

		},
		receive(){
			if(!this.agree) return false;
			if(this.isSuccess)return false;
			let phone = this.phone;
			if(!phone){
				// this.$toast("手机号不能为空");
				this.tips = '手机号不能为空'
				return false;
			}
            if (
                !/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9]|16[0-9])\d{8}$/.test(
                    phone
                )
            ) {
				this.tips = '手机号输入错误'
                // this.$toast("手机号输入错误")
                return false;
			}
			let query = {
				shareUserId:this.userId,
				cellphone:phone,
				couponId:this.couponId
			}
			this.$http.post(this.$server.receiveCoupons,query).then(res=>{
				if(res.data.status == 200){
					this.reducedPrice = res.data.content.reducedPrice;
					this.tips = ''
					this.isSuccess = true;
					this.phoneStr = this.phone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
				}else{
					this.tips = res.data.message
				}
			})
		},
		changePhone(){
			this.isSuccess = false;
			this.phone = ''
		},
		wxshare(){
			let url = encodeURIComponent(window.location.href.split('#')[0])
			let cookie = this.$getCookie('uInfo');
			let userId = cookie ? JSON.parse(cookie).userid  : '';
			this.$http.get(`${this.$server.getWxConfig}?url=${url}&userId=${userId}`).then(res=>{
				if(res.data.status == 200){
                    let data = res.data.content;
                    let title = "免费领取【学国学网】优惠券，学习中华优秀传统文化"
                    let desc = "学国学网专注优秀传统文化教育"
                    let link = window.location.href
                    let imgUrl = "http://xgxw-pic.oss-cn-beijing.aliyuncs.com/hp/logo.png"
                    wx.config({
                        debug:false,
                        appId:data['appId'],
                        timestamp:data['timeStamp'],
                        nonceStr:data['nonceStr'],
                        signature:data['signature'],
                        jsApiList: [
                            'checkJsApi',
                            'updateAppMessageShareData',
                            'updateTimelineShareData',
                            'onMenuShareAppMessage',
                            'onMenuShareTimeline',
                            'onMenuShareQQ'
                        ]
                    }); 
                    wx.ready(function() {
                        wx.onMenuShareAppMessage({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                            // 用户点击了分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareTimeline({
                            title: title, // 分享标题
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            success: function () {
                            // 用户点击了分享后执行的回调函数
                            },
                        })
                        wx.onMenuShareQQ({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: link, // 分享链接
                            imgUrl: imgUrl, // 分享图标
                            success: function () {
                            // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                            // 用户取消分享后执行的回调函数
                            }
                        });
                    })
                }
            })
		}
	},
	created(){
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		this.isIos = isIOS?true:false;
	
		let data = window.location.hash.split('#/receiveCoupon?')[1].split("&")
		data.forEach(item=>{
			let temp = item.split('=');
			if(temp[0]=='userId'){
				this.userId = temp[1]
			}else if(temp[0]=='ticketId'){
				this.couponId = temp[1]
			}
		})
		this.wxshare();
		
	},
	mounted(){
		this.$refs.bg.style.height = window.screen.height+'px';
		const h = document.body.scrollHeight  // 用onresize事件监控窗口或框架被调整大小，先把一开始的高度记录下来
		

	}
}

</script>

<style lang="scss" scoped>
.receive-wrap{
	// position: fixed;
	// width: 100%;
	// top:0;
	// left: 0;
}
.w{
	font-weight: bold
}
.rules-pop{
	width: 100%;
	height: 100vh;
	background: rgba(0, 0, 0, .6);
	position: fixed;
	left: 0;
	top: 0;
	z-index: 10;
	.rules{
		width: 5.7rem;
		background: #fff;
		border-radius: .2rem;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50% , -50%);
		padding: .4rem .45rem .4rem;
		color: #000000;
		.t{
			font-size: .32rem;
			margin-bottom: .4rem;
			text-align: center;
		}
		.content{
			font: .26rem/.37rem "";
			margin-bottom: .4rem;
		}
		.button{
			width: 4rem;
			height: .8rem;
			line-height: .8rem;
			border-radius: .4rem;
			text-align: center;
			color: #fff;
			font-size: .32rem;
			box-shadow: 0 .04rem .12rem rgba(180,39,45,0.3);
			background: #B4272D;
			margin: .2rem auto 0;
			
		}
	}
}
.title{
	background-color: #1C1B20;
	font-size: .32rem;
	color: #FFFFFF;
	line-height: .88rem;
	text-align: center;
	position:absolute;
	top:0;
	left: 0;
	z-index: 2;
	width: 100%;
}
.bg{
	background: url('../../assets/image/receive-coupon.png') no-repeat center center;
	width: 100%;
	background-size: 100% 100%;
	padding-top: 5rem;
	box-sizing: border-box;
	position: relative;
	.download{
		position: absolute;
		top: 0.88rem;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: rgba(255, 255, 255, .9);
		height: .98rem;
		padding: 0 .3rem 0 .3rem;
		img{
			width: 1.7rem;
			height: .6rem;
		}
		.keyword{
			margin-left: .2rem;
			font-size: .28rem;
			color: #3A3A3A;
		}
		.down-btn{
			width: 1.5rem;
			height: .6rem;
			border-radius: .3rem;
			background: #8B1B1F;
			font-size: .28rem;
			color: #fff;
			text-align: center;
			line-height: .6rem;
		}
	}
	.phone-wrap{
		// margin-top:1rem;
		position: absolute;
		top:60%;
		left: 50%;
		transform: translate(-50%,-50%);
		input{
			width: 5.3rem;
			height: .88rem;
			background: #ECECEC;
			border: 1px solid #DADADA;
			border-radius: .1rem;
			outline: none;
			text-align: center;
			display: block;
			margin: 0 auto;
			font-size: .32rem;
			&.error{
				border-color: #B4272D
			}
		}
		.tips{
			margin:0.15rem 0;
			color:#B4272D;
			line-height: 0.32rem;
			height: 0.32rem;
		}
		input::-webkit-input-placeholder{
			color: #9A9A9A;
			font-size: .32rem;
		}
		.get-button{
			border-radius: .1rem;
			margin: 0 auto 2rem;
			width: 5.3rem;
			height: .88rem;
			background-color: #B4272D;
			font-size:0.32rem;
			line-height: 0.88rem;
			text-align: center;
			color: #fff;
			&.disabled{
				background: #dfdfdf;
			}
		}
		.protocol{
			font-size: .24rem;
			color: #DFB9BB;
			text-align: center;
			font-size: .24rem;
			.checkbox{
				display: inline-block;
			}
			img{
				width: .3rem;
				height: .3rem;
				vertical-align: middle;
				margin-right: .15rem;
			}
			span{
				display: inline-block;
				vertical-align: middle;
			}
			.rule{
				color: #F9F9FB;
				text-decoration:underline;
			}
		}
	}
	.success{
		text-align: center;
		position: absolute;
		top:60%;
		left: 50%;
		transform: translate(-50%,-50%);
		width: 70%;
		.success-title{
			font-size: .32rem;
			color: #B4272D;
			margin-bottom: .25rem;
			// margin-top: -.4rem;
		}
		h1{
			font-size: .6rem;
			margin-bottom: .25rem;
			color: #B4272D;
		}
		.line{
			border-top: 1px solid #B4272D;
			border-bottom: 1px solid #B4272D;
			width: 2.4rem;
			height: .2rem;
			margin: 0 auto;
		}
		.intorduce{
			margin-top: .3rem;
			color: #CACACA;
			font-size: .28rem;
			line-height: .5rem;
			margin-bottom: 1.4rem;
			span{
				color: #B4272D;
				font-size: .28rem;
			}
			.change{
				font-size: .26rem;
				margin-left: .2rem;
			}
		}
		.down-tip{
			color: rgba(255, 255, 255, .5);
			font-size: .28rem;
			.down{
				margin-top: .4rem;
				font-size: .32rem;
				color: #fff;
				text-decoration:underline!important;
			}
		}
	}
}
</style>