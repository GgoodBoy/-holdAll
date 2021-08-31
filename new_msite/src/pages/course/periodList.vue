<template>
	<div class="catalog-wrap" :class="periodList.length>5?'pd':''">
        <p class="comp-title">
			<span>目录</span>
			<span class="ref" v-if="courseData.isExistCircle==1" @click="scrollTo(1)">圈子</span>
			<span class="ref" @click="scrollTo(2)">介绍</span>
			<span class="ref" v-if="isExistRelevance" @click="scrollTo(3)">推荐</span>
			<span class="ref" @click="scrollTo(4)">评论</span>			
		</p>
		<div v-if="periodList.length>5" class="s-btn" :class="open?'open':''" @click="open=!open"><van-icon name="arrow-down"/></div>
		<ul :class="open?'open':''">
			<li v-for="(item,i) in periodList" :key="i" class="catalog-item" ref="catalogItem">
				<div class="catalog-item-top clearfix">
					<p class="sort">第{{item.sort}}节</p>
					<p class="title textEllipsis">{{item.title}}</p>
				</div>
				<div class="catalog-item-bottom clearfix">
					<p class="duration">{{item.targetDurationText}}</p>
					<p class="progress" v-if="item.progress&&item.progress!='0%'">学习进度 {{item.progress}}</p>
					<div class="icon-area"  @click="goSection(item.id,item.isTry,item,i)">
						<div class="play-status">
							<div class="is-cooperativePlatforms" v-if="cooperativePlatformsData.xxtId&&cooperativePlatformsData.xxtId.length>0"><i :class="currentPeriodId==item.id&&startPlay&&knowledgeIdInCourse==''?'playing':''"></i></div>
							<div class="else" v-else>
								<div class="is-vip" v-if="courseData.isVip==1"><i :class="currentPeriodId==item.id&&startPlay&&knowledgeIdInCourse==''?'playing':''"></i></div>
								<div class="else" v-else>
									<div class="is-buy" v-if="courseData.isBuy>0"><i :class="currentPeriodId==item.id&&startPlay&&knowledgeIdInCourse==''?'playing':''"></i></div>
									<div class="else" v-else>
										<div class="is-free" v-if="courseData.isFree>0"><i :class="currentPeriodId==item.id&&startPlay&&knowledgeIdInCourse==''?'playing':''"></i></div>
										<div class="else" v-else>
											<div class="time-limit-free" v-if="courseData.timeLimitType==0&&isStart"><i :class="currentPeriodId==item.id&&startPlay&&knowledgeIdInCourse==''?'playing':''"></i></div>
											<div class="else" v-else>
												<div class="is-friendShare" v-if="item.isFriendShare==true">
													<i :class="currentPeriodId==item.id&&startPlay&&knowledgeIdInCourse==''?'playing':''"></i>
												</div>
												<div class="else" v-else>
													<div class="is-try" v-if="item.isTry>0">
														<i class="playing" v-if="currentPeriodId==item.id&&startPlay&&knowledgeIdInCourse==''"></i>
														<p v-else>{{courseData.courseType==1?'试看':'试听'}}</p>
													</div>
													<div class="else" v-else>
														<div class="is-lock"><i></i></div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import playing from '@/assets/image/playing.gif'
const iosDown = 'https://itunes.apple.com/cn/app/id1447039784?ls=1&mt=8'
function  coverString(subStr,str){
   var reg = eval("/"+subStr+"/ig");
   return reg.test(str);
}
const formatSeconds = (value) => {
    let h = parseInt(value/3600)
    let m = parseInt(value % 3600 / 60)
    let s = parseInt(value % 3600 % 60)
    let hStr = h<10?`0${h}`:h;
    let mStr = m<10?`0${m}`:m;
    let sStr = s<10?`0${s}`:s;
    return `${hStr}:${mStr}:${sStr}`
}
const androidDown = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.xueguoxue.xgxw2018';
export default {
	props:["courseData",'periodList','currentPeriodId','startPlay','channelAvaliDayPrice',"buyType","channelAvaliDayVisible","isExistRelevance"],
	data(){
		return {
			isStart:false,//限时免费是否开始
			memoryClickFlag:false,
			isChrome:false,
			open:false,
		}
	},
	computed:{
		...mapState(['isWx','isIos','audioData','knowledgeIdInCourse','isVip','searchToast','cooperativePlatformsData']),
	},
	created(){
		this.init()
	},
	mounted(){
	},
	methods:{
		...mapActions(['setAudioData','setSearchToast','setKnowledgeIdInCourse','setLastStudyPoint']),
		/**
		 * 是否在APP内部打开
		 */
		openInWebview(){
			var ua = navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') { // 微信浏览器判断
				return false
			} else if (ua.match(/QQ/i) == 'qq') { // QQ浏览器判断
				return false
			} else if (ua.match(/WeiBo/i) == "weibo") {
				return false
			} else {
				if (ua.match(/Android/i) != null) {
					return ua.match(/browser/i) == null
				} else if (ua.match(/iPhone/i) != null) {
					return ua.match(/safari/i) == null
				} else {
					return (ua.match(/macintosh/i) == null && ua.match(/windows/i) == null)
				}
			}
		},
		/**
		 * 播放小节
		 */
		goSection(targetId,isTry,item,index){
			if(this.knowledgeRouteState){
				this.setKnowledgeRouteState(false);
				this.$emit("update:currentPeriodId",-10);
			}
			//音频播放限制
			if(this.courseData.courseType==2){
				if(this.courseData.isVip==1||this.courseData.isBuy>0||this.courseData.isFree>0||(this.courseData.timeLimitType==0&&this.isStart)||isTry>0||item.isFriendShare||(this.cooperativePlatformsData.xxtId&&this.cooperativePlatformsData.xxtId.length>0)){
					let flag = this.openInWebview()
					if(!flag){
						if(this.isIos){
							let userAgent= navigator.userAgent.toLowerCase(); 
							let version=userAgent.match(/cpu (iphone )?os (.*?) like mac os/);
							let temp = version[2].split('_')[0]
							if(temp<=9){
								this.$dialog.confirm({
									confirmButtonColor:"#D40015",
									message: '当前ios版本<10.0.0，暂不支持浏览器端收听课程。是否立即前往APP？'
								}).then(() => {
									this.downLoadApp()
								}).catch(() => {
									
								});
								return false;
							}
						} //ios终端
						let ua = window.navigator.userAgent.toLowerCase()
						let uc = navigator.appVersion.split('UCBrowser/').length > 1;//uc浏览器
						let mqqbrowser = ua.includes('mqqbrowser')&&!ua.includes('micromessenger');//QQ浏览器
						let oppo = navigator.userAgent.includes('OppoBrowser');//oppo自带浏览器
						if(uc||mqqbrowser||oppo){
							this.$dialog.confirm({
								confirmButtonColor:"#D40015",
								message: `当前浏览器暂不支持收听，请更换浏览器收听课程，或者前往APP。是否立即前往APP？`
							}).then(() => {
								this.downLoadApp()
							}).catch(() => {
								
							});
							return false;
						}
						let isChrome = navigator.userAgent.includes('Chrome');
						let isQQ = navigator.userAgent.includes('QQ'||'qq');
						if(coverString('HONOR',navigator.userAgent)||coverString('Honor',navigator.userAgent)||coverString('HUAWEI',navigator.userAgent)||coverString('huawei',navigator.userAgent)){
							if(this.isWx||isChrome||isQQ){
								
							}else{
								this.$dialog.confirm({
									confirmButtonColor:"#D40015",
									message: '当前浏览器暂不支持收听，请更换浏览器，或者前往APP。是否立即前往APP？'
								}).then(() => {
									this.downloadApp()
								}).catch(() => {
									
								});
								return false;
							}
						}
					}
					if(targetId==this.currentPeriodId){
						if(this.startPlay){
							return false;
						}else{
							this.$emit("update:currentPeriodId",-2);
							if(item.getLastStudyPoint){
								this.setLastStudyPoint(-1)
							}else{
								if(item.lastStudyPoint){
									this.setLastStudyPoint(item.lastStudyPoint)
									item.getLastStudyPoint = true;
									this.$refs.catalogItem[index].setAttribute('id',targetId)
									this.$refs.catalogItem[index].setAttribute('getLastStudyPoint','true')
								}
							}
						}
					}else{
						this.$nextTick(()=>{
							this.$emit("update:currentPeriodId",targetId)
							let audioData = Object.assign({},this.audioData,{
								click:true,
							})
							this.setAudioData(audioData)
							if(item.getLastStudyPoint){
								this.setLastStudyPoint(-1)
							}else{
								if(item.lastStudyPoint){
									this.setLastStudyPoint(item.lastStudyPoint)
									item.getLastStudyPoint = true;
									this.$refs.catalogItem[index].setAttribute('id',targetId)
									this.$refs.catalogItem[index].setAttribute('getLastStudyPoint','true')	
								}
							}
						})
					}
				}else{
					let uInfo = this.$getCookie('uInfo');
					if(!uInfo){
						if(this.searchToast||this.memoryClickFlag){
							if(this.memoryClickFlag){
								this.memoryClickFlag = false;
								return;
							}
							this.$toast('请先登录之后再观看该小节');
							this.setSearchToast(false)
							return false;
						}
						this.setAudioData({})
						sessionStorage.setItem('rediectUrl',this.$route.fullPath)
						this.$router.push('/auth')
						// this.$dialog.confirm({
						// 	message: '<p>使用APP支付购买课程</p><p>可享有更多积分和优惠券</p>',
						// 	confirmButtonColor:"#D40015",
						// 	confirmButtonText:'继续',
						// 	cancelButtonText:'APP内购买'
						// }).then(() => {
						// 	this.setAudioData({})
						// 	sessionStorage.setItem('rediectUrl',this.$route.fullPath)
						// 	this.$router.push('/auth')
						// }).catch(() => {
						// 	this.downLoadApp()
						// });
						return false;
					}else{
						if(this.searchToast||this.memoryClickFlag){
							if(this.memoryClickFlag){
								this.memoryClickFlag = false;
								return;
							}
							this.$toast('请先购买之后再观看该小节');
							this.setSearchToast(false)
							return false;
						}
						this.toOrder()
						return false;
					}
				}
			}else{	
				if(this.courseData.isVip==1||this.courseData.isBuy>0||this.courseData.isFree>0||(this.courseData.timeLimitType==0&&this.isStart)||isTry>0||item.isFriendShare||(this.cooperativePlatformsData.xxtId&&this.cooperativePlatformsData.xxtId.length>0)){
					this.setKnowledgeIdInCourse('')
					if(targetId==this.currentPeriodId){
						if(this.startPlay){
							return false;
						}else{
							if(item.getLastStudyPoint){
								this.setLastStudyPoint(-1)
							}else{
								if(item.lastStudyPoint){
									this.setLastStudyPoint(item.lastStudyPoint)
									item.getLastStudyPoint = true;
								}
							}
							this.$emit("update:currentPeriodId",-1)
							this.memoryClickFlag = false;
						}
					}else{
						this.$emit('update:startPlay',false)
						this.memoryClickFlag = false;
						this.$nextTick(()=>{
							this.$emit("update:currentPeriodId",targetId)
							this.$emit('update:startPlay',true)
							if(item.getLastStudyPoint){
								this.setLastStudyPoint(-1)
							}else{
								if(item.lastStudyPoint){
									this.setLastStudyPoint(item.lastStudyPoint)
									item.getLastStudyPoint = true;
								}
							}
						})
					}
				}else{
					let uInfo = this.$getCookie('uInfo');
					if(!uInfo){
						if(this.searchToast||this.memoryClickFlag){
							if(this.memoryClickFlag){
								this.memoryClickFlag = false;
								return;
							}
							this.$toast('请先登录之后再观看该小节');
							this.setSearchToast(false)
							return false;
						}
						sessionStorage.setItem('rediectUrl',this.$route.fullPath)
						this.$router.push('/auth')
						// this.$dialog.confirm({
						// 	message: '<p>使用APP支付购买课程</p><p>可享有更多积分和优惠券</p>',
						// 	confirmButtonColor:"#D40015",
						// 	confirmButtonText:'继续',
						// 	cancelButtonText:'APP内购买'
						// }).then(() => {
						// 	sessionStorage.setItem('rediectUrl',this.$route.fullPath)
						// 	this.$router.push('/auth')
						// }).catch(() => {
						// 	this.downLoadApp()
						// });
					}else{
						if(this.searchToast||this.memoryClickFlag){
							if(this.memoryClickFlag){
								this.memoryClickFlag = false;
								return;
							}
							this.$toast('请先购买之后再观看该小节');
							this.setSearchToast(false)
							return false;
						}
						this.toOrder()
						return false;
					}
				}
			}
		},
		toOrder(){
			let uInfo = this.$getCookie('uInfo');
			if(!uInfo){
				sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
			}else{
				if(this.timeLimitType==2&&this.isStart){
					let query = {
						courseId:this.courseData.id
					}
					this.$http.post(this.$server.verifyTimeLimitExpired,query).then(res=>{
						if(res.data.status==200){
							this.$emit('update:channelAvaliDayPrice',parseFloat(this.courseData.spikePrice))
							this.$emit('update:buyType','1')
							localStorage.setItem('aboutCourse',this.$route.path)
							if(!this.courseData.channelAvaliDay||this.courseData.channelAvaliDay==0){
								this.$emit('update:channelAvaliDayVisible',true)
								return false;
							}	
							this.$router.push({path:`/course/order/${this.courseData.id}`,query:{buyType:1,spikePrice:this.courseData.spikePrice}})
						}
					})
				}else{
					let params = {
                    	courseId:this.courseData.id
					}
					this.$http.post(this.$server.verifyUserAssemble,params).then(res=>{
						if(res.data.status==200){
							if(res.data.content.isJoin==0){
								this.$emit('update:channelAvaliDayPrice',parseFloat(this.courseData.sellingPrice))
								this.$emit('update:buyType','0')
								localStorage.setItem('aboutCourse',this.$route.path)
								if(!this.courseData.channelAvaliDay||this.courseData.channelAvaliDay==0){
									this.$emit('update:channelAvaliDayVisible',true)
									return false;
								}
								this.$router.push(`/course/order/${this.courseData.id}`) 
							}else if(res.data.content.isJoin==1){
								this.$toast('您已参加过该团购')
							}
						}    
					})
				}
			}	
		},
		init(){
			if(this.courseData.timeLimitType>=0&&this.courseData.timeLimitBeginAt&&this.courseData.nowServerTime){
				let begin = new Date(this.courseData.timeLimitBeginAt.replace(/-/g, '/')).getTime();
				let now = new Date(this.courseData.nowServerTime.replace(/-/g, '/')).getTime()
				this.isStart = now>=begin?true:false
            }
            this.isChrome = navigator.userAgent.includes('Chrome')?true:false;
            this.periodList.forEach(item=>{
                item.targetDurationText = formatSeconds(item.targetDuration)
            })
            this.$nextTick(()=>{
                if(this.$route.query&&this.$route.query.periodId){
                    let index = this.periodList.findIndex(item=>item.id==this.$route.query.periodId);
                    if(index>=0){
						this.memoryClickFlag = true;
                        this.$nextTick(()=>{
                            this.$refs.catalogItem[index].click()
                        })
                    }else{
                        this.$toast('该课时已下架~');
                        setTimeout(()=>{
                            this.$refs.catalogItem[0].click()
                        },2500)
                    }
                }
            })
		},
		downLoadApp(){
			if(this.isIos){
				window.location.href=`xueguoxuewang://type=course&courseId=${this.$route.params.courseId}`
				setTimeout(()=>{
					var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden 
					if(typeof hidden =="undefined" || hidden ==false){
						window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
					}
				}, 2500);
			}else{
				// window.location.href= `xgx://Lessons/open?courseId=${this.$route.params.courseId}`
				// setTimeout(()=>{
				// 	var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden
				// 	if(typeof hidden =="undefined" || hidden ==false){
				// 		window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
				// 	}
				// }, 2500);
				let a = document.createElement('a');
				a.setAttribute('data-params', `{courseId:${this.$route.params.courseId}}`);
				a.setAttribute('href', 'https://am7ilz.jmlk.co/AAHl');
				a.setAttribute('data-jmlink', 'true');
				a.setAttribute('data-auto', 'false');
				document.body.appendChild(a);
				setTimeout(() => {
					this.$toast.clear()
					a.click();
				}, 2000);
			}
		},
		scrollTo(type){
			let h = Number(window.getComputedStyle(document.documentElement).fontSize.split("px")[0])*4.2;
			switch(true){
				case type==1:
					let top1 = this.startPlay?document.querySelector(".moments").offsetTop-h:document.querySelector(".moments").offsetTop;
					this.ScrollTopAnimation(top1,500)
					break;
				case type==2:
					let top2 = this.startPlay?document.querySelector(".course-intro").offsetTop-h:document.querySelector(".course-intro").offsetTop;
					this.ScrollTopAnimation(top2,500)
					break;
				case type==3:
					let top3 = this.startPlay?document.querySelector(".relevance-course-wrap").offsetTop-h:document.querySelector(".relevance-course-wrap").offsetTop;
					this.ScrollTopAnimation(top3,500)
					break;
				case type==4:
					let top4 = this.startPlay?document.querySelector(".comment-wrap-next").offsetTop-h:document.querySelector(".comment-wrap-next").offsetTop;
					this.ScrollTopAnimation(top4,500)
					break;			
			}
		},
		ScrollTopAnimation(number = 0, time){
			if (!time) {
				document.body.scrollTop = document.documentElement.scrollTop = number;
				return number;
			}
			const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
			let spacingInex = time / spacingTime; // 计算循环的次数
			let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 获取当前滚动条位置
			let everTop = (number - nowTop) / spacingInex; // 计算每次滑动的距离
			let scrollTimer = setInterval(() => {
				if (spacingInex > 0) {
					spacingInex--;
					this.ScrollTopAnimation(nowTop += everTop);
				} else {
					clearInterval(scrollTimer); // 清除计时器
				}
			}, spacingTime);
		}
	}
}

</script>

<style lang="scss" scoped>
.catalog-wrap{
	background: #fff;
	margin-bottom:0.1rem;
    padding:0.3rem;
	position: relative;
	&.pd{
		padding: 0.3rem 0.3rem 0.6rem 0.3rem;
	}
   .comp-title{
        color:#333333;
        font-size: 0;
        line-height: 0.3rem;
        padding:0 0.18rem;
        position: relative;
        &::before{
            content:'';
            display: block;
            width: 0.04rem;
            height: 0.28rem;
            background: #CC0033;
            position: absolute;
            top:0.1rem;
            left: 0;
        }
		span{
			display: inline-block;
			vertical-align: middle;
			font-size: 0.3rem;
			margin-right: .1rem;
		}
		.ref{
			border: 1px solid #999;
			border-radius: 0.3rem;
			margin: 0.02rem 0.15rem 0;
			cursor: pointer;
			padding: 0.06rem 0.12rem;
		}
    }
	.s-btn{
		padding: 0.1rem;
		transition: all 0.3s;
		transform-origin: center;
		position: absolute;
		bottom:0;
		right: 0.36rem;
		i{
			font-size: 0.24rem;
			color:#666;
		}
		&.open{
			transform: rotate(180deg);
		}
	}
	ul{
		padding: 0.3rem 0;
		position: relative;
		max-height: 5.8rem;
		overflow: hidden;
		&.open{
			height: auto;
			max-height: none;
			overflow: auto;
		}
		li{
			font-size: .24rem;
			.catalog-item-top{
				font-size: 0.3rem;
				line-height: 0.3rem;
				color:#1A1A1A;
				.sort{
					float: left;
					width: 1.2rem;
				}
				.title{
					width: calc(100% - 1.8rem);
					float: left;
				}
			}
			.catalog-item-bottom{
				margin-top:0.2rem;
				line-height: .24rem;
				.duration{
					color:#9A9A9A;
					font-size: 0.24rem;
					float: left;
				}
				.progress{
					color:#c30d23;
					font-size: 0.24rem;
					float: left;
					margin-left: 0.24rem;
				}
				.icon-area{
					float: right;
					position: relative;
					bottom:0.24rem;
					width: 1.8rem;
					height: 0.68rem;
					.play-status{
						display: inline-block;
						vertical-align: middle;
						position: absolute;
						right:0;
						top:0;
						.is-vip,.is-buy,.is-free,.time-limit-free,.is-try,.is-friendShare,.is-cooperativePlatforms{
							padding: 0.1rem;
							i{
								width: 0.4rem;
								height: 0.4rem;
								display: block;
								background: url('../../assets/image/period-play.png')no-repeat 50% 50% / cover;
								&.playing{
									background: url('../../assets/image/playing.gif')no-repeat 50% 50% / cover;
								}
							}
						}
						.is-try p{
							width: .8rem;
							height: .48rem;
							background-color: #C52D3B;
							color: #fff;
							box-shadow: .02rem .02rem .09rem rgba(197,45,59,0.46);
							border-radius: .3rem;
							text-align: center;
							line-height: .48rem;
							font-size: 0.24rem;
						}
						.is-lock {
							padding: 0.1rem;
							i{
								display: block;
								width: 0.48rem;
								height: 0.48rem;
								background: url('../../assets/image/period-lock.png')no-repeat 50% 50% / cover;
							}
						}
					}
				}
			}
			.try{
				
			}
			.canplay{
				width: .5rem;
				height: .5rem;
			}
			.lock{
				width: .48rem;
				height: .48rem;
			}
		}
	}
	.buy-remind-pop{
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, .6);
		position: fixed;
		left: 0;
		top: 0;
		z-index: 155;
		.buy-remind{
			width: 5.9rem;
			height: 2.7rem;
			border-radius: .1rem;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50% , -50%);
			background: #fff;
			p{
				height: 0.66rem;
				line-height: 0.66rem;
				background: #EDF1F7;
				text-align: center;
				color: #333;
				font-size: .28rem;
				border-radius: .1rem 0.1rem 0 0;
			}
			.go-buy{
				margin: .6rem auto 0;
				width: 4.12rem;
				line-height: 0.88rem;
				height: 0.88rem;
			}
		}
		.close{
			position: absolute;
			left: 47%;
			top: 50%;
			transform: translate(250% , -200%);
			width: 1rem;
			height: 1rem;
			z-index: 5;
			text-align: center;
			i{
				color:#fff;
				font-size: 0.6rem;
				display: inline-block;
			}
			img{
				width: .6rem;
				height: .6rem;
				transform: translate(30% , 30%);
			}
		}
	}
	.period-details-dialog{
		position: fixed;
		top:0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 101;
		background: rgba(0,0,0,0.7);
		.box{
			position: absolute;
			width: 80%;
			top:50%;
			left: 50%;
			transform: translate(-50%,-50%);
			background: #fff;
			border-radius: 10px;
			overflow: hidden;
			padding-bottom:0.2rem;
			.title{
				height: 0.8rem;
				line-height: 0.8rem;
				background: #EDF1F7;
				font-size: 0.32rem;
				color:#6A6A6A;
				text-align: center;
			}
			.content{
				padding: 0.3rem;
				overflow: scroll;
				-webkit-overflow-scrolling: touch;
				max-height: 8rem;
				min-height: 2rem;
				word-wrap:break-word;
			}
			.bottom{
				text-align: center;
				// margin-top:0.2rem;
			}
			i{
				color:#CC0033;
				font-size: 0.48rem;
				text-align: center;
			}
		}
	}
}
</style>