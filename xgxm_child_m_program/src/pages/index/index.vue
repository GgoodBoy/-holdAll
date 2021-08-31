<template>
	<view class="index-page" :style="{paddingTop:lowerVersion?'94px':paddingTop+'px'}" @touchstart="touchStartEvent" @touchend="touchEndEvent">
		<Skeleton v-if="!init"/>
		<Header :title="'学国学网少儿版'" v-if="init" :returnBools="false" :padTop="paddingTop"></Header>
		<block v-for="(item,index) in dataInfo" :key="index">
			<recommendTeacher :dataInfo="item" v-if='item.subModule==10'/>
			<classifyNew :dataInfo="item" v-if='item.subModule==2'/> 
			<advertising :dataInfo="item" v-if='item.subModule==8'/>
			<limitedtime :dataInfo="item" v-if='item.subModule==4'/>
			<classCourse :dataInfo="item" v-if='item.subModule==11'/>
			<assemble :dataInfo="item" v-if='item.subModule==14'/>
		</block>
		<MiniAudio v-if="audioData.show" :cur="cur"></MiniAudio>
		<!-- <MiniAudio :cur="cur"></MiniAudio> -->
	</view>
</template>
<script>
	const app = getApp()
	import {mapState,mapActions} from 'vuex'
	import Skeleton from '../../wxcomponents/skeleton'
	import Loading from '../../wxcomponents/Loading'
	import searchIcon from '../../static/search-icon.png'
	import searchIcon1 from '../../static/search-icon-1.png'
	import userIcon from '../../static/user-icon.png'
	import Header from '../../wxcomponents/Header'
	import classifyNew from "./classifyNew.vue";//标签导航
	import advertising from "./advertising.vue";//通栏广告
	import limitedtime from './limitedtime';//限时专区
	import recommendTeacher from "./recommendTeacher.vue";//名师推进啊
	import classCourse from './classCourse';//分类
	import assemble from './assemble.vue';//拼团
	import MiniAudio from '../../wxcomponents/miniAudio.vue' 
	export default {
		data() {
			return {
				paddingTop:0,
				loading:true,
				init:false,
				dataInfo:[
					// {subModule:1,style:1,ahprrList:[{imgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/83834aee-9039-47eb-b8e8-8ac03e2359f4.jpg'}]},
					// {subModule:2,ahprrList:[
					// 	{imgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/ac5d70b3-238b-4013-ae30-65e2990cfe6b.jpg',title:'测试数据'},
					// 	{imgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/ac5d70b3-238b-4013-ae30-65e2990cfe6b.jpg',title:'测试数据'},
					// 	{imgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/ac5d70b3-238b-4013-ae30-65e2990cfe6b.jpg',title:'测试数据'},
					// 	{imgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/ac5d70b3-238b-4013-ae30-65e2990cfe6b.jpg',title:'测试数据'}
					// ]},
					// {subModule:3,name:'测试标题',style:1,ahprrList:[{imgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/a3d54eff-4c1b-42d9-98e3-43296b8c1772.jpg'}]},
					// {subModule:5,name:'测试标题',style:1,ahprrList:[{imgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/a3d54eff-4c1b-42d9-98e3-43296b8c1772.jpg'}]},
					// {subModule:6,name:'测试标题',style:1,ahprrList:[
					// 	{imgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/1220accb-bf2e-4c38-ae7f-2fdb4b0286b3.jpg',courseType:1,title:'测试',courseIntro:'测试',planPeriodNum:0,courseBrowsCount:0,lectureTeacherList:[{name:'测试'}]},
					// 	{imgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/1220accb-bf2e-4c38-ae7f-2fdb4b0286b3.jpg',courseType:1,title:'测试',courseIntro:'测试',planPeriodNum:0,courseBrowsCount:0,lectureTeacherList:[{name:'测试'}]},
					// ]},
				],
				searchIcon:searchIcon,
				searchIcon1:searchIcon1,
				userIcon:userIcon,
				authed:false,
				timer:null,
				cur:0,
				curList:[],
				firsterBool:true,//定时器第一次锁
				clearIntervalbool:true,
				homeColumnId:'',
				lowerVersion:false
			}
		},
		created(){},
		onLoad(){
			this.getWechatColumnList()
			this.lowerVersion = app.globalData.lowerVersion;
			this.paddingTop = app.globalData.statusBarHeight+68;
		},	
		onHide(){
			clearInterval(this.timer);
			this.clearIntervalbool = false;		
		},
		onUnload(){
			clearInterval(this.timer);
			this.clearIntervalbool = false;
		}, 		
		onShow(){
			if(this.lowerVersion){
				var authReturn  = wx.getStorageSync('authFirst');
				if(authReturn){
					wx.removeStorageSync('authFirst');
				}
			}	
			// this.getUserInfoEven();	
			this.curList = this.$store.state.timeArry;
			this.clearIntervalbool=true;
			clearInterval(this.timer);
			const backgroundAudioManager = wx.getBackgroundAudioManager();
			if(this.audioData.show){
				this.timer = setInterval(() => {
					if(this.clearIntervalbool){
						if(this.firsterBool){
							this.cur = Math.floor(backgroundAudioManager.currentTime);
							var firster=this.curList[this.curList.length-1];
							if(this.cur>firster){
								var nums = this.cur-firster;
								if(nums>0){
									for (var i = 0; i < nums; i++) {
										this.curList.push(firster+i);
									}
								}
							}
							this.firsterBool = false;
						}else{
							this.cur = Math.floor(backgroundAudioManager.currentTime);
							if(this.cur!=this.curList[this.curList.length-1]){
								this.curList.push(this.cur);
							}
						}
					}else{
						clearInterval(this.timer);
					}
				}, 1000);
			}
			wx.getSetting({
				success:(res)=>{
					if(res.authSetting['scope.userInfo']){
						this.authed = true;
					}else{
						this.authed = false;
					}
				}
			})
		},	
		mounted(){},
		onReady(){},
		onPullDownRefresh(){
			if(this.loading) return;
			this.getHomeData();
		},
		onShareAppMessage(res){
			return {
				title: '学国学网小程序',
				path: '/pages/index/index',
				imageUrl:'../../static/courseDetail/share.png'
			}
		},
		components:{
			Skeleton,Loading,Header,classifyNew,limitedtime,advertising,classCourse,MiniAudio,recommendTeacher,assemble
		},
		computed:{
			...mapState(['audioData','timeArry'])
		},
		methods: {
			...mapActions(['setAudioData']),
			/**
			 * 授权成功
			 */
			getUserInfoEvent(e){
				if(e.detail.userInfo){
					this.$login(e.detail,this.goPersonal)
				}
			},
			getUserInfoEven(){
				let users = wx.getStorageSync('userInfo');
				let userinfos = wx.getStorageSync('userInfo');
				if(!users){
					wx.showToast({
							title: userinfos.nickname||'无1',
							icon: 'none',
							mask:false,
							duration: 1500//持续的时间
					}) 	
				}else{
					wx.showToast({
							title: userinfos.nickname||'有1',
							icon: 'none',
							mask:false,
							duration: 1500//持续的时间
					})					
				}				
			},			
			goPersonal(){
				let userInfo = wx.getStorageSync('userInfo')
				if(userInfo){
					wx.switchTab({
						url: '/pages/index/myPage'
					})					
				}else{
					uni.navigateTo({
						url: `/pages/auth/index`
					});
				}
			},
			goSearch(){
				uni.navigateTo({
                    url: '/pages/search/index'
                });
			},
			getWechatColumnList(){
				let query = {
					type:4
				}
				// wx.clearStorage();
				this.$http.post(this.$server.getWechatColumnList,query).then(res=>{
					if(res.data.status==200){
						this.homeColumnId = res.data.content[0].id;
						this.getHomeData();
					}
				})
			},
			getHomeData(){
				this.loading = true;
				wx.stopPullDownRefresh()
				if(this.init){
					wx.showLoading({
						title:'加载中...',
						mask:true
					})
				}
				let query = {
					type:4,
					homeColumnId:this.homeColumnId,
					pageNo:1,
					pageSize:100
				}
				this.$http.post(this.$server.getWechatHomeInfo,query).then(res=>{
					if(res.data.status==200){
						this.dataInfo = res.data.content;
					}
					this.loading = false;
					this.init = true;
					wx.hideLoading()
				}).catch(()=>{
					this.loading = false;
					wx.hideLoading()
				})
			},
			touchStartEvent(e){
				
			},
			touchEndEvent(e){
				
			}			
		}
	}
</script>

<style lang="scss">
	page{
			
	}
	.index-page{
		overflow: hidden;
		min-height: calc(100vh - 64px);
		// background:rgba(244,244,244,1);
		// &.finish{
		// 	background:rgba(244,244,244,1);
		// }
		.loading-container{
			position: fixed;
			top:0;
			left: 0;
			width: 100vw;
			height: 100vh;
			z-index: 2;
			background: rgba(255,255,255,0.8);
		}
		.loading-box{
			position: absolute;
			top:50%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
		.icons{
			position: fixed;
			top:0;
			left: 0;
			width: 30%;
			z-index: 1000;
			padding: 0 30rpx;
			line-height: 44px;
			height: 44px;
			display: flex;
			// background: #fff;
			align-items: center;
			&.long{
				width: 100%;
				box-sizing: border-box;
			}
			.search-icon-box{
				flex:1;
				border:1px solid #dfdfdf;
				height: 60rpx;
				border-radius: 30rpx;
				padding: 0 20rpx;
				display: flex;
				align-items: center;
				.icon{
					height: 36rpx;
					width: 36rpx;
				}
			}
			.user-icon,.search-icon{
				width: 68rpx;
				height: 68rpx;
				margin-right: 10rpx;
			}
			.auth-btn{
				position: absolute;
				opacity: 0;
				z-index: 2;
				width: 68rpx;
				height: 68rpx;
				left: 30rpx;
				bottom:10rpx;
			}
		}
	}
</style>

