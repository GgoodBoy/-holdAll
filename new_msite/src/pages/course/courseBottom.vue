<template>
	<div class="course-bottom-wrap">
        <div class="btns">
			<p v-if="canLearn" class="can-learn"></p>
			<p v-else>购买</p>
		</div>
		<div class="btn-area" >
			<div v-if="canLearn" class="can-learn"></div>
			<div v-else class="cannot-learn">
				<p v-if="courseData.isJoinAssemble==1" class="clearfix un-normal">
					<span class="assemble" @click="goBuy">拼团({{parseFloat(courseData.assemblePrice)}}币)</span>
					<span class="ori" @click="toOrder">原价({{parseFloat(courseData.sellingPrice)}}币)</span>
				</p>
				<p v-else @click="toOrder" class="normal">购买</p>
			</div>
		</div>
	</div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
export default {
	props:["courseData","isCurrent","showShare","channelAvaliDayPrice","buyType","assembleQuery"],
	data(){
		return {
			isLogin:false,
			isStart:false,
			isTryListen:false,
			canLearn:false,//是否能够学习课程
			thumbsUpCourseFlag:false,//是否已经点赞
			timer:null,
			time:'',
			timeDes:'',
            limitFlag:false,
            ms:99,
            msTimer:'',
			timeLimitTypeArr:['限时免费','限时折扣','限时秒杀'],
			type2:false
		}
	},
	computed:{
		...mapState(['audioData','isVip','isIos']),
		type1(){
			return this.time!=''&&!this.canLearn
		},
	},
	watch:{
		type1(cur,old){
			if(cur){
				let audioData = Object.assign({},this.audioData,{bottom:'1.9rem'})
				this.setAudioData(audioData)
			}
		},
		type2(cur,old){
			if(cur){
				let audioData = Object.assign({},this.audioData,{bottom:'1.1rem'})
				this.setAudioData(audioData)
			}
		}
	},
	created(){
		this.thumbsUpCourseFlag = this.courseData.thumbsUpCourseFlag==1?true:false;
		if(this.courseData.timeLimitType>=0&&this.courseData.timeLimitBeginAt&&this.courseData.nowServerTime){
			let begin = new Date(this.courseData.timeLimitBeginAt.replace(/-/g, '/')).getTime();
			let now = new Date(this.courseData.nowServerTime.replace(/-/g, '/')).getTime()
			this.isStart = now>=begin?true:false
		}
		if(this.courseData.isVip==1||this.courseData.isBuy>0||this.courseData.isFree>0||(this.courseData.timeLimitType==0&&this.isStart)){
			this.canLearn = true;
		}else{
			this.canLearn = false;
		}
		if(this.courseData.courseType==2){
			if(this.courseData.isVip!=1&&this.courseData.isBuy==0&&(this.courseData.isFree==0||(this.courseData.timeLimitType==0&&!this.isStart))&&this.courseData.isTrySee>0){
				this.isTryListen = true;
			}
		}
		
		this.isLogin = this.$getCookie('uInfo');
	},
	mounted(){
		setTimeout(()=>{
			this.type2 = this.courseData.timeLimitType<=0&&!this.canLearn
		},1)
	},
	methods:{
		...mapActions(['setAudioData']),
		/**是否进行倒计时 */
		isStartCountDown(timeLimitBeginAt,timeLimitEndAt,nowServerTime){
			if(timeLimitEndAt && timeLimitBeginAt){
				let begin = new Date(timeLimitBeginAt.replace(/-/g, '/')).getTime();
				let end = new Date(timeLimitEndAt.replace(/-/g, '/')).getTime();
				let now = new Date(nowServerTime.replace(/-/g,'/')).getTime()
				switch(true){
					case now<begin:
						this.timeDes = '距离活动开始还有';
						this.startCountDown(begin,now,1)
						break;
					case now>=begin&&now<end:
						this.timeDes = '距离活动结束还有';
						this.startCountDown(end,now,2)
						break;
					case now>=end:
						this.timeDes = '';
						clearInterval(this.timer)
						break;
				}
			}
		},
		/**
		 * 开始倒计时
		 */
		startCountDown(time1,time2,status){
			let time = parseInt((time1-time2)/1000)
			let date;
			if(time>=0){
				// if(time>=259200){
				// 	this.time = parseInt(time/ 86400)+'天';
				// 	this.ms = ''
				// 	return;
				// }
				let h = parseInt((time-parseInt(time/ 86400)*86400 )/3600)<10?'0'+parseInt((time-parseInt(time/ 86400)*86400 )/3600):parseInt((time-parseInt(time/ 86400)*86400 )/3600);
				let m = parseInt(time % 3600 / 60)<10?'0'+parseInt(time % 3600 / 60):parseInt(time % 3600 / 60);
				let s = parseInt(time % 3600 % 60)<10?'0'+parseInt(time % 3600 % 60):parseInt(time % 3600 % 60)
				if(status==1||status==2){
					let day = parseInt(time/ 86400)>0?parseInt(time/ 86400) + '天':''
					this.time = day+h+ ':' + m + ':' + s ;
					this.timer = setInterval(()=>{
						time--;
						let curTime = new Date().getTime();
						let temp = parseInt((time1-curTime)/1000);
						if(time>=0){
							let h = parseInt((time-parseInt(time/ 86400)*86400 )/3600)<10?'0'+parseInt((time-parseInt(time/ 86400)*86400 )/3600):parseInt((time-parseInt(time/ 86400)*86400 )/3600);
							let m = parseInt(time % 3600 / 60)<10?'0'+parseInt(time % 3600 / 60):parseInt(time % 3600 / 60);
							let s = parseInt(time % 3600 % 60)<10?'0'+parseInt(time % 3600 % 60):parseInt(time % 3600 % 60);
							let day = parseInt(time/ 86400)>0?parseInt(time/ 86400) + '天':''
							this.time = day+h+ ':' + m + ':' + s ;
							if(time-temp>=3){
								time = temp;
								this.time = parseInt(time/ 86400) + '天'+h+ ':' + m + ':' + s ;
							}
						}else{
							this.time = ''
							this.limitFlag = true
							clearInterval(this.timer)
							this.getCourseInfo()
						}
					},1000)
					let ms = 99;
					this.msTimer = setInterval(()=>{
						ms--;
						this.ms = ms<10?'0'+ms:ms;
						if(time<=0){
							this.ms = '00'
							clearInterval(this.msTimer)
						}
						if(ms<=0){
							ms = 99;
						}
					},10)
				}
			}
		},
		getCourseInfo(){

		},
		/**
		 * 去免费试听
		 */
		freeList(){
			this.$router.push(`/course/${this.courseData.id}/FreeSection`)
		},
		/**
		 * 打开客服
		 */
		openCustumer(){
			window.qimoChatClick();
		},
		/**
		 * 去购买课程
		 */
		toOrder(){
			if(!this.isLogin){
				sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth');
				// this.$dialog.confirm({
				// 	message: '<p>使用APP支付购买课程</p><p>可享有更多积分和优惠券</p>',
				// 	confirmButtonColor:"#D40015",
				// 	confirmButtonText:'继续',
				// 	cancelButtonText:'APP内购买'
				// }).then(() => {
				// 	sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				// 	this.$router.push('/auth');
				// }).catch(() => {
				// 	if(this.isIos){
				// 		window.location.href=`xueguoxuewang://type=course&courseId=${this.$route.params.courseId}`
				// 		setTimeout(()=>{
				// 			var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden 
				// 			if(typeof hidden =="undefined" || hidden ==false){
				// 				window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
				// 			}
				// 		}, 2500);
				// 	}else{
				// 		// window.location.href= `xgx://Lessons/open?courseId=${this.$route.params.courseId}`
				// 		// setTimeout(()=>{
				// 		// 	var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden
				// 		// 	if(typeof hidden =="undefined" || hidden ==false){
				// 		// 		window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
				// 		// 	}
				// 		// }, 2500);
				// 		let a = document.createElement('a');
				// 		a.setAttribute('data-params', `{courseId:${this.$route.params.courseId}}`);
				// 		a.setAttribute('href', 'https://am7ilz.jmlk.co/AAHl');
				// 		a.setAttribute('data-jmlink', 'true');
				// 		a.setAttribute('data-auto', 'false');
				// 		document.body.appendChild(a);
				// 		setTimeout(() => {
				// 			this.$toast.clear()
				// 			a.click();
				// 		}, 2000);
				// 	}
				// });
			}else{
				if(this.courseData.timeLimitType==2&&this.isStart){
					let query = {
						courseId:this.courseData.id
					}
					this.$http.post(this.$server.verifyTimeLimitExpired,query).then(res=>{
						if(res.data.status==200){
							if(this.courseData.channelAvaliDay!=0){
								this.$emit('update:channelAvaliDayPrice',parseFloat(this.courseData.spikePrice))
								this.$emit('update:buyType','1')
								localStorage.setItem('aboutCourse',this.$route.path)
								this.$router.push({path:`/course/order/${this.courseData.id}`,query:{buyType:1,spikePrice:this.courseData.spikePrice}})
							}else{
								localStorage.setItem('aboutCourse',this.$route.path)
								this.$router.push({path:`/course/order/${this.courseData.id}`,query:{buyType:1,spikePrice:this.courseData.spikePrice}})
								// this.$dialog.confirm({
								// 	message: '<p>使用APP支付购买课程</p><p>可享有更多积分和优惠券</p>',
								// 	confirmButtonColor:"#D40015",
								// 	confirmButtonText:'继续',
								// 	cancelButtonText:'APP内购买'
								// }).then(() => {
								// 	localStorage.setItem('aboutCourse',this.$route.path)
								// 	this.$router.push({path:`/course/order/${this.courseData.id}`,query:{buyType:1,spikePrice:this.courseData.spikePrice}})
								// }).catch(() => {
								// 	if(this.isIos){
								// 		window.location.href=`xueguoxuewang://type=course&courseId=${this.$route.params.courseId}`
								// 		setTimeout(()=>{
								// 			var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden 
								// 			if(typeof hidden =="undefined" || hidden ==false){
								// 				window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
								// 			}
								// 		}, 2500);
								// 	}else{
								// 		// window.location.href= `xgx://Lessons/open?courseId=${this.$route.params.courseId}`
								// 		// setTimeout(()=>{
								// 		// 	var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden
								// 		// 	if(typeof hidden =="undefined" || hidden ==false){
								// 		// 		window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
								// 		// 	}
								// 		// }, 2500);
								// 		let a = document.createElement('a');
								// 		a.setAttribute('data-params', `{courseId:${this.$route.params.courseId}}`);
								// 		a.setAttribute('href', 'https://am7ilz.jmlk.co/AAHl');
								// 		a.setAttribute('data-jmlink', 'true');
								// 		a.setAttribute('data-auto', 'false');
								// 		document.body.appendChild(a);
								// 		setTimeout(() => {
								// 			this.$toast.clear()
								// 			a.click();
								// 		}, 2000);
								// 	}
								// });
							}
						}
					})
				}else{
					if(this.courseData.channelAvaliDay!=0){
						this.$emit('update:channelAvaliDayPrice',parseFloat(this.courseData.sellingPrice))
						this.$emit('update:buyType','0')
						localStorage.setItem('aboutCourse',this.$route.path)
						this.$router.push(`/course/order/${this.courseData.id}`)
					}else{
						localStorage.setItem('aboutCourse',this.$route.path)
						this.$router.push(`/course/order/${this.courseData.id}`)
						// this.$dialog.confirm({
						// 	message: '<p>使用APP支付购买课程</p><p>可享有更多积分和优惠券</p>',
						// 	confirmButtonColor:"#D40015",
						// 	confirmButtonText:'继续',
						// 	cancelButtonText:'APP内购买'
						// }).then(() => {
						// 	localStorage.setItem('aboutCourse',this.$route.path)
						// 	this.$router.push(`/course/order/${this.courseData.id}`)
						// }).catch(() => {
						// 	if(this.isIos){
						// 		window.location.href=`xueguoxuewang://type=course&courseId=${this.$route.params.courseId}`
						// 		setTimeout(()=>{
						// 			var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden 
						// 			if(typeof hidden =="undefined" || hidden ==false){
						// 				window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
						// 			}
						// 		}, 2500);
						// 	}else{
						// 		// window.location.href= `xgx://Lessons/open?courseId=${this.$route.params.courseId}`
						// 		// setTimeout(()=>{
						// 		// 	var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden
						// 		// 	if(typeof hidden =="undefined" || hidden ==false){
						// 		// 		window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
						// 		// 	}
						// 		// }, 2500);
						// 		let a = document.createElement('a');
						// 		a.setAttribute('data-params', `{courseId:${this.$route.params.courseId}}`);
						// 		a.setAttribute('href', 'https://am7ilz.jmlk.co/AAHl');
						// 		a.setAttribute('data-jmlink', 'true');
						// 		a.setAttribute('data-auto', 'false');
						// 		document.body.appendChild(a);
						// 		setTimeout(() => {
						// 			this.$toast.clear()
						// 			a.click();
						// 		}, 2000);
						// 	}
						// });
					}
				}
			}
		},
		/**
         * 去开团
         */
        goBuy(){
            let uInfo = this.$getCookie('uInfo');
			if(!uInfo){
				sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth');
                // this.$dialog.confirm({
				// 	message: '<p>使用APP支付购买课程</p><p>可享有更多积分和优惠券</p>',
				// 	confirmButtonColor:"#D40015",
				// 	confirmButtonText:'继续',
				// 	cancelButtonText:'APP内购买'
				// }).then(() => {
				// 	sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				// 	this.$router.push('/auth');
				// }).catch(() => {
				// 	if(this.isIos){
				// 		window.location.href=`xueguoxuewang://type=course&courseId=${this.$route.params.courseId}`
				// 		setTimeout(()=>{
				// 			var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden 
				// 			if(typeof hidden =="undefined" || hidden ==false){
				// 				window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
				// 			}
				// 		}, 2500);
				// 	}else{
				// 		// window.location.href= `xgx://Lessons/open?courseId=${this.$route.params.courseId}`
				// 		// setTimeout(()=>{
				// 		// 	var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden
				// 		// 	if(typeof hidden =="undefined" || hidden ==false){
				// 		// 		window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
				// 		// 	}
				// 		// }, 2500);
				// 		let a = document.createElement('a');
				// 		a.setAttribute('data-params', `{courseId:${this.$route.params.courseId}}`);
				// 		a.setAttribute('href', 'https://am7ilz.jmlk.co/AAHl');
				// 		a.setAttribute('data-jmlink', 'true');
				// 		a.setAttribute('data-auto', 'false');
				// 		document.body.appendChild(a);
				// 		setTimeout(() => {
				// 			this.$toast.clear()
				// 			a.click();
				// 		}, 2000);
				// 	}
				// });
            }else{
                let params = {
                    courseId:this.courseData.id
                }
                this.$http.post(this.$server.verifyUserAssemble,params).then(res=>{
                    if(res.data.status==200){
                        if(res.data.content.isJoin==0){
							let query = {
								buyType:2,
								assembleType:1,
								assembleId:this.courseData.assembleCourseId,
								assemblePrice:this.courseData.assemblePrice
							}
							if(this.courseData.channelAvaliDay!=0){
								this.$emit('update:channelAvaliDayPrice',parseFloat(this.courseData.assemblePrice))
								localStorage.setItem('aboutCourse',this.$route.path)
								this.$emit('update:buyType','2')
								this.$emit('update:assembleQuery',JSON.stringify(query))
								this.$router.push({path:`/course/order/${this.$route.params.courseId}`,query:query})
							}else{
								localStorage.setItem('aboutCourse',this.$route.path)
								this.$router.push({path:`/course/order/${this.$route.params.courseId}`,query:query})
								// this.$dialog.confirm({
								// 	message: '<p>使用APP支付购买课程</p><p>可享有更多积分和优惠券</p>',
								// 	confirmButtonColor:"#D40015",
								// 	confirmButtonText:'继续',
								// 	cancelButtonText:'APP内购买'
								// }).then(() => {
								// 	localStorage.setItem('aboutCourse',this.$route.path)
								// 	this.$router.push({path:`/course/order/${this.$route.params.courseId}`,query:query})
								// }).catch(() => {
								// 	if(this.isIos){
								// 		window.location.href=`xueguoxuewang://type=course&courseId=${this.$route.params.courseId}`
								// 		setTimeout(()=>{
								// 			var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden 
								// 			if(typeof hidden =="undefined" || hidden ==false){
								// 				window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
								// 			}
								// 		}, 2500);
								// 	}else{
								// 		// window.location.href= `xgx://Lessons/open?courseId=${this.$route.params.courseId}`
								// 		// setTimeout(()=>{
								// 		// 	var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden
								// 		// 	if(typeof hidden =="undefined" || hidden ==false){
								// 		// 		window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
								// 		// 	}
								// 		// }, 2500);
								// 		let a = document.createElement('a');
								// 		a.setAttribute('data-params', `{courseId:${this.$route.params.courseId}}`);
								// 		a.setAttribute('href', 'https://am7ilz.jmlk.co/AAHl');
								// 		a.setAttribute('data-jmlink', 'true');
								// 		a.setAttribute('data-auto', 'false');
								// 		document.body.appendChild(a);
								// 		setTimeout(() => {
								// 			this.$toast.clear()
								// 			a.click();
								// 		}, 2000);
								// 	}
								// });
							}
                        }else if(res.data.content.isJoin==1){
                            this.$toast('您已参加过该团购')
                        }
                    }    
                })
            }
        },
		/**
		 * 去评论标签页
		 */
		goComment(type){
			if(!this.isLogin){
				sessionStorage.setItem('rediectUrl',this.$route.fullPath);
				this.$router.push('/auth')
			}else{
				localStorage.setItem("updateIsCurrentType",type);
				this.$emit("update:isCurrent","comment")
			}
		},
		setPeriodPoint(){
			if (!this.isLogin) {
				sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth');
	       	}else{
				if(this.thumbsUpCourseFlag){
					this.$toast("您已点赞，不能重复点赞")
				}else{
					this.$http.post(this.$server.setCoursePoint,{
						courseId:this.courseData.id,
					}).then(res=>{
						if(res.data.status ==200){
							this.thumbsUpCourseFlag = true;
							this.courseData.courseUserLikeCount++;
							if(res.data.content.totalNum&&res.data.content.totalNum>0){
								// this.$rewardPointsToast({
								// 	points:res.data.content.totalNum
								// })
								this.$toast(`+${res.data.content.totalNum}积分`)
							}
						}
					})
				}
			}
		},
		/**
		 * 课程分享
		 */
		openShare(){
			if (!this.isLogin) {
				sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth');
	       	}else{
				let ua = window.navigator.userAgent.toLowerCase();
				this.$http.post(this.$server.getCourseShareModelState,{}).then(res=>{
					if(res.data.status==200){
						let {isSet} = res.data.content;
						if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
							if(isSet==1){
								this.$router.push(`/courseSharePoster/${this.$route.params.courseId}`)
							}
						}else if (ua.match(/QQ/i) == "qq" && ua.match(/MQQbrowser/i)!='mqqbrowser') {
							if(isSet==1){
								this.$router.push(`/courseSharePoster/${this.$route.params.courseId}`)
							}
						}
						this.$emit("update:showShare", true);
					}
				})
			}
		}
	}
}

</script>

<style lang="scss" scoped>
	.course-bottom-wrap{
		width: 100%;	
		.btn-area{
			width: 100%;
			position: fixed;
			left: 50%;
			max-width: 414px;
			transform: translateX(-50%);
			bottom:0;
			z-index: 7;
			background: #fff;
			>div{
				font-size: 0.32rem;
				color:#fff;
				height: 1rem;
				text-align: center;
				width: 100%;
				&.can-learn{
					display: none;
				}
				.normal{
					background: #C30D23;
					line-height: 1rem;
				}
				.un-normal{
					display: block;
					box-shadow:0px -1px 8px 0px rgba(51,51,51,0.19);
					padding: 0 0.15rem;
				}
				.ori{
					color:#333333;
					font-size: 0.27rem;
					float: right;
					padding: 0.2rem;
					margin:0.09rem 0;
					min-width: 2.2rem;
				}
				.assemble{
					color:#fff;
					font-size: 0.27rem;
					padding: 0.2rem;
					float: right;
					min-width: 2.2rem;
					background-image: linear-gradient(#E62F45, #D51F35, #C71227);
					border-radius: 20px;
					margin:0.09rem 0;
				}

			}
		}
		.btns{
			p{
				font-size: 0.32rem;
				color:#fff;
				height: 1rem;
				line-height: 1rem;
				&.can-learn{
					display: none;
				}
			}
		}
		.timelimit-box{
			position: fixed;
			bottom:1.1rem;
			width: 100%;
			padding: 0 0.15rem;
			z-index: 3;
			max-width: 414px;
			left: 50%;
			transform: translateX(-50%);
			&.placeholder{
				position: relative;
				height: 0.7rem;
				bottom:0.1rem;
			}
			p{
				background: #CC0033;
				border-radius: 0.7rem;
				margin: auto !important;
				line-height: 0.7rem;
				color:#fff;
				i{
					height: 0.46rem;
					width: 0.46rem;
					background: url('../../assets/image/limit.png')no-repeat 50% 50% / cover;
					margin:0.13rem 0.13rem 0.13rem 0.2rem;
					float: left;
				}
				.right-box{
					float: left;
					position: relative;
					font-size: 0.28rem;
					margin-left: 0.34rem;
					&.status1{
						padding-right:1.45rem;
					}
					&.status2{
						padding-right:2.2rem;
					}
				}
				span{
					font-size: 0.28rem;
					line-height: 0.7rem;
					.count-down-time{
						position: absolute;
						top:0;
						&.status1{
							right:0rem;
						}
						&.status2{
							right:0.34rem;
						}
					}
					&.msec{
						position: absolute;
						right:0;
						top:0;
						
					}
				}
				.type-name{
					float: left!important;
					font-size: 0.28rem;
				}
			}
		}
	}
</style>