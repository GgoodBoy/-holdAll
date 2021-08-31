<template>
	<view class="course-box" :style="{'padding-bottom':(iosOrAndroid=='IOS')?138+'rpx':(objs.isJoinAssemble&&!objs.isBuy&&objs.isVip!=1&&iosOrAndroid=='Android')?98+'rpx':0}">
        <v-video 
		id="tabberPlugeId"
		v-if="showOrHide" 
		:iosOrAndroid='iosOrAndroid' 
		:courseIsSpellStates='courseIsSpellStates' 
		:datalist='catalogList' 
		@toVideoEven="toVideoEvens" 
		:objs="objs" 
		:imgUrls='imgUrls'
		:userCellphoneType='unserIsLogenType'
		:loginType='loginType'
		:periodObg='periodObg' 
		@setDataToHttp='setDataToHttp' 
		@isOkvideoOraudioType='isOkvideoOraudioType'
		@setIntervalVarEven='setIntervalVarEven'
		@chooseOrOpenCancel="chooseOrOpenCancel"
		:xgxwChannelData='xgxwChannelData'
		:selectMoneyData="selectMoneyData"
		></v-video>
		<v-audio 
		id="tabberPlugeId"
		v-else 
		:objs="objs" 
		:iosOrAndroid='iosOrAndroid'
		:courseIsSpellStates='courseIsSpellStates' 
		@toVideoEven="toVideoEvens" 
		:datalist='catalogList' 
		:versionType="versionType" 
		:userCellphoneType='unserIsLogenType'
		:loginType='loginType'		
		:changeDurationNew='changeDuration' 
		:periodObg='periodObg' 
		:imgUrls='imgUrls' 
		@lockNumEmit='lockNumEmit' 
		@progressEmit='progressEmit' 
		@isOkvideoOraudioType='isOkvideoOraudioType'
		@newdataInfo='newdataInfoEven'
		@chooseOrOpenCancel="chooseOrOpenCancel"
		:xgxwChannelData='xgxwChannelData'
		:selectMoneyData="selectMoneyData"
		></v-audio>
		<view class="course-one">
			<view :class="{ tabberPlugeCss: tabberIsActive }">
				<v-tabber @tabberSelectEmit='tabberSelectEmit'></v-tabber>
			</view>
			<v-cover :dataIntroduce='introduceInfo' v-if="tabPlugeType!=1"></v-cover>
			<v-list :datalist='catalogList' :timeHideOrShow='timeHideOrShow' :dataInfo="dataInfo" @toVideoEven="toVideoEvens" v-else></v-list>
		</view>
		<v-limit v-if="iosOrAndroid=='Android'" :timeObj='timeObj' :timeHideOrShow='timeHideOrShow'></v-limit>
		<MiniAudio v-if="audioData.show" :cur="cur" :curList="curList" :courseIds="dataInfo.id"></MiniAudio> 
		<v-showactionsheet :indexitem='selectIndex' :isAuthorization='showActionSheet.isAuthorization'  :tips="showActionSheet.tips" :itemList="showActionSheet.itemList" :show="showActionSheet.show" :maskClosable="showActionSheet.maskClosable" :isCancel="showActionSheet.isCancel" @selectIsOkCancel="selectIsOkCancel"></v-showactionsheet>
	</view>	
</template>  
<script>
	import video_l from './video.vue';//视频播器组件
	import audio_l from './audio.vue';//音频播器组件
	import tabber_l from './tabber.vue';//tab组件
	import list_l from './textList.vue';//课程目录列表组件
	import limittime_l from './limitedTime.vue';//限时购组件 
	import coverimg_l from './coverImg.vue';//课程目录列表组件
	import MiniAudio from '../../wxcomponents/miniAudio.vue'
	import showactionsheet_l from './showActionSheet.vue';//tab组件
	import {mapState,mapActions} from 'vuex';
	function compareVersion(v1, v2) {
		v1 = v1.split('.')
		v2 = v2.split('.')
		const len = Math.max(v1.length, v2.length)
		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}
		for (let i = 0; i < len; i++) {
			const num1 = parseInt(v1[i])
			const num2 = parseInt(v2[i])
			if (num1 > num2) {
			return 1
			} else if (num1 < num2) {
			return -1
			}
		}
		return 0
	}	
	export default {
		data() {
			return {
				showOrHide:false,//音频视频的显示和隐藏
				listOrcover:false,//主题和目录的显示和隐藏
				//视频信息
				objs:{
					surfacePlot:'',//视频封面图
					planPeriodNum:'',//课程数量
					sellingPrice:'',//销售价格
					title:'',//课程标题
					actualPeriodNum:'',//已经更新课程数；
					courseBrowsCount:'',//学习人数
					courseId:'',
					name:'',
					teacher:'',
					isbuy:false
				},
				//视频课时id;
				periodObg:{
					periodId:'',
					targetDuration:0,
					isTrySee:0,
					lastStudyPoint:0,
					newPath:false,
					courseId:0,
					firstTouch:true											
				},
				id:'',//课程id
				catalogList:[],//目录列表；
				introduceInfo:'',//介绍
				dataInfo:{},//进入详情获取的信息；
				//限时购组件
				timeObj:{
					timeStart:'',
					timeend:'',
					limitType:'',
					nowServerTime:false
				},
				timeHideOrShow:false,//限时购组件是否展示的状态
				//设定的定时器对象
				setIntervalVar:'',
				//播放时间长度；
				playLearnLong:0,//在非拖动播放时的时间值
				newDataValObj:'',//暂停，返回传递给后台需要保存的数据
				tabPlugeType:0,//tab组件切换时的状态；
				imgUrls:'',
				userinfos:'',
				timer:'',
				cur:'0',
				timerSint:'',//进度条更新
				studyPoint:[],//同集播放时间；
				changeDuration:0,//音频进度条时间；
				changeDurationVideo:0,//视频
				lockNumIndex:0,//拖动后缓存值设置；
				lockNumVideoIndex:0,
				versionType:false,
				firsterBool:true,//定时器第一次锁
				curList:[],
				clearIntervalbool:true,
				firsterBoolNext:true,
				removSinterVider:false,//是否退出详情页
				otStringVal:'',
				touchFirst:true,
				courseIsSpellStates:true,
				iosOrAndroid:'',
				tabberIsActive:false,
				videoOraudioHeight:0,
				loginType:false,
				unserIsLogenType:false,
				//下滑弹框价格
				showActionSheet: {
					show: false,
					maskClosable: true,
					// tips: "请选择申请节点身份，不同的节点消耗福卡不同",
					itemList: [],
					// size: 26,
					// isCancel: true,
					//是否授权
					isAuthorization:true
				},
				xgxwChannelData:{
					xgxwChannel:false,
					minVal:-1			
				},
				selectMoneyData:{
					moneys: -1,
					text: "",
					type: -1,
					e:''					
				},
				selectIndex:0,
			}
		},
		onLoad(option){
			//第二执行
			this.id = option.id;
			this.imgUrls = option.imgUrls;
			this.userinfos = wx.getStorageSync('userInfo');
		},
		onShareAppMessage: (res) => {
			var pages = getCurrentPages() //获取加载的页面
			var currentPage = pages[pages.length-1] //获取当前页面的对象
			var optionsId = currentPage.options.id;	
			var shareImgsName = JSON.parse(wx.getStorageSync('shareImgsName'));
			var shareImgsUrl = JSON.parse(wx.getStorageSync('shareImgsUrl'));
			if (res.from === 'button') {
				console.log("来自页面内转发按钮");
			}
			else {
				console.log("来自右上角转发菜单")
			}
			return {
				title:shareImgsName,
				path: '/pages/courseDetail/index?id='+optionsId,
				imageUrl: shareImgsUrl,
				success: (res) => {
					console.log("转发成功", res);
				},
				fail: (res) => {
					console.log("转发失败", res);
				}
			}
		},		
		onHide() {},
        onUnload(){
			if(!this.showOrHide&&this.audioData.courseId&&this.audioData.playerCreat){
				let temp = Object.assign({},this.audioData,{show:true})
				this.setAudioData(temp); 
				let tempTwo = Object.assign({},this.copyAudioData,{
					show:true
				});    
				this.$store.commit('SETCOPYAUDIODATA',tempTwo);
				this.clearIntervalbool = false;
				clearInterval(this.timerSint);
				// this.setTimeArryData(this.studyPoint);
				this.$store.commit('SETTimeARRYS', this.studyPoint)
				this.removSinter = true;
			}
			if(this.showOrHide){
				clearInterval(this.setIntervalVar);
				this.removSinterVider = true;
				var data = {
					periodId:this.periodObg.periodId,
					learnRate:this.videoData.studyPoint[this.videoData.studyPoint.length-1]||0,
					studyPoint:this.videoData.studyPoint,
					lastStudyPoint:this.videoData.studyPoint[this.videoData.studyPoint.length-1]||0
				}
				this.getCourseLastTime(data);
				clearInterval(this.timerVideos);
				this.inItData();
			}
			this.setAudioOrVideo('other');
		},
		onShow(){
			this.equipmentType();
			this.versionEven();			
			this.getUserInfoEven();			
			this.getCourseInfo(this.id);
			this.getVerifyIsEndEven(this.id);				
			if(this.audioData.courseId){
				this.curList = this.$store.state.timeArry;
				clearInterval(this.timer);
				const backgroundAudioManager = wx.getBackgroundAudioManager();
				if(this.audioData.show){
					this.timer = setInterval(() => {
						if(this.clearIntervalbool){
							if(this.firsterBoolNext){
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
								this.firsterBoolNext = false;
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
			}			
		},	
		created(){
			//第一执行
			this.versionEven();
			this.equipmentType();			
		},
		mounted(){},
		onPageScroll(res){
			const scrollTop = res.scrollTop;
			if(scrollTop>=this.videoOraudioHeight){
				this.tabberIsActive = true;
			}else{
				this.tabberIsActive = false;
			}			
		},
		components:{
			'v-video':video_l,
			'v-tabber':tabber_l,
			'v-list':list_l,
			'v-limit':limittime_l,
			'v-cover':coverimg_l,
			'v-audio':audio_l,
			'MiniAudio':MiniAudio,
			'v-showactionsheet':showactionsheet_l
		},
		computed:{
			...mapState(['audioData','copyAudioData','timeArry','audioOrVideo','videoData','localaudioListInfo','recordStartTime']),
		},
		methods: {	
			...mapActions(['setLessonListNums','setStatusCourseChoose','setRecordStartTime','setAudioData','setTimeArryData','setCourseaudioListInfoData','setLocalaudioListInfoData','setAudioOrVideo','setVideoDateEven']),
			inItData(){
				this.setVideoDateEven({
					studyPoint: [],
					statusCourseVidChoose: -1,
					playCourseVideState: false,
					catalogList:[]					
				});							
			},
			getUserInfoEven(){
				let users = wx.getStorageSync('userInfo');
				this.userinfos = wx.getStorageSync('userInfo');
				if(users){
					this.loginType = true;
					let userInfo = JSON.parse(users); 
					if(userInfo.cellphone){
						this.unserIsLogenType = true;
					}else{
						this.unserIsLogenType = false;
					}                
				}else{
					this.loginType = false;
					this.unserIsLogenType = false;
				}
			},			
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
			//判断自组建是否渲染完成
			isOkvideoOraudioType(data){
				//获取dom元素
				const query = uni.createSelectorQuery().in(this);
				query.select('#tabberPlugeId').boundingClientRect(data => {
					this.videoOraudioHeight = Number(data.height);
				}).exec();					
			},
			//拖拽赋值
			lockNumVidoEmit(data){
				this.lockNumVideoIndex = 0;
			},
			//拖动后赋值
			lockNumEmit(data){
				this.lockNumIndex = 0;
			},
			//进度条更新事件通知，进度条时间更新
			progressEmit(data){
				var self = this;
					clearInterval(self.timerSint);
					self.removSinter = data.type;
					var letAimeArry = this.$store.state.timeArry;
					this.studyPoint = letAimeArry;
					const backgroundAudioManager = data.objs;
					self.timerSint = setInterval(() => {
						if(!self.removSinter){
							if(self.lockNumIndex==0){
								setTimeout(()=>{
									self.changeDuration = Math.floor(backgroundAudioManager.currentTime);
									var lastNum = self.studyPoint[self.studyPoint.length-1];
									if(lastNum!=self.changeDuration){
										self.studyPoint.push(self.changeDuration);
										self.lockNumIndex = self.changeDuration;
									}
								},700);
							}else{	
								self.changeDuration = Math.floor(backgroundAudioManager.currentTime);
								if(this.firsterBool){
									var lastNum = self.studyPoint[self.studyPoint.length-1];
									if(self.changeDuration>lastNum){
										var nums = self.changeDuration-lastNum;
										if(nums>0){
											for (var i = 0; i < nums; i++) { 
												self.studyPoint.push(lastNum+i);
											}
										}
										this.firsterBool = false;
									}
								}else{
									var lastNum = self.studyPoint[self.studyPoint.length-1];
									if(lastNum!=self.changeDuration){
										self.studyPoint.push(self.changeDuration);
									}
								}
							}
						}else{	
							self.$store.commit('SETTimeARRYS', this.studyPoint)
							clearInterval(self.timerSint);
						}
					}, 1000); 
			},	
			//判断当前版本大小
			versionEven(){
				var self = this;
				const version = wx.getSystemInfoSync().SDKVersion;
				if (compareVersion(version, '1.9.94') >= 0){
					self.versionType = true;                
				}else{
					self.versionType = false;
				}				
			},
			//tab切换
			tabberSelectEmit(data){
				this.tabPlugeType = data.type;
			},
			//每一秒的数据传递覆盖
			newdataInfoEven(data){
				this.newDataValObj = data;
			},
			//记录手动操作保存数据
			setUserHandOperationData(courseId){
				var self = this; 	
				var userInfo = JSON.parse(wx.getStorageSync('userInfo')); 
				let newTime = parseInt(new Date().getTime()/1000)-Number(this.recordStartTime);
				let query = {
					userId:userInfo.userId,
					courseId:courseId,
					type:5,
					studyDuration:newTime
				}
				self.setRecordStartTime('');
				self.$http.post(self.$server.setsaveStudyBehavior,query,{urlType:true}).then(resInfo=>{
					if(resInfo.data.status==200){
						console.log("数据保存成功",query);              
					}
				});              
			},			
			//暂停传递数据事件触发；
			setDataToHttp(data){
				this.getCourseLastTime(data);
			},
			//暂停，切换页面调用接口；		
			getCourseLastTime(data){
				var self = this; 		
                wx.getNetworkType({
                    success (res) { 						
						if(data.studyPoint&&self.otStringVal!=data.studyPoint.toString()){
							self.otStringVal = data.studyPoint.toString();
							//暂停，切换页面调用接口；
							var realLearnRatelong = data.studyPoint.length;					
							let query = {
								periodId:data.periodId,//课时id 
								courseId:self.id,
								learnRate:data.learnRate,
								realLearnRate:realLearnRatelong,
								studyPoint:data.studyPoint.toString(),
								lastStudyPoint:data.lastStudyPoint
							};
							if (res.networkType == 'wifi'){
								query['netType'] = 2;
							}else{
								query['netType'] = 1;
							}		
							if(this.recordStartTime){
								self.setUserHandOperationData(self.objs.courseId);
							}
							self.$http.post(self.$server.savePeriodStudyRecordsUser,query).then(res=>{
								if(res.data.status==200){
									let temp = Object.assign({},self.videoData,{playCourseVideState:false,studyPoint:[]})
									self.setVideoDateEven(temp);  									
								}
							});	
						}
					}
				});						
			},		
			//页面定时器
			setIntervalVarEven(data){
				var self = this;
				if(data.bools){
					self.setIntervalVar = setInterval(()=>{
						self.playLearnLong ++;
					},1000); 
				}else{
					self.playLearnLong=0;
				}
			},	
			//课时选择传值;
			toVideoEvens(data){
				this.touchFirst	= false;
				var isFreeType = false;
				if(this.dataInfo.isFree==1||this.dataInfo.isBuy||this.dataInfo.timeLimitType==0||this.dataInfo.isVip==1){
					isFreeType = true;
				}
				if(this.audioOrVideo=='audio'){
					this.periodObg = {
						periodId:data.id,
						targetDuration:data.targetDuration,
						isTrySee:isFreeType?1:data.isTry,
						lastStudyPoint:data.lastStudyPoint,
						courseId:data.courseId,
						firstTouch:	this.touchFirst,
						newPath:true,			
					}
					let temp = Object.assign({},this.audioData,{periodId:data.id,total:this.$formatSeconds(data.targetDuration),courseId:data.courseId,playFlag:true,show:false})                 
					this.setAudioData(temp);
				}else{
					clearInterval(this.setIntervalVar);
					this.periodObg = {
						periodId:data.id,
						targetDuration:data.targetDuration,
						isTrySee:data.isTry,
						courseId:data.courseId,
						lastStudyPoint:data.lastStudyPoint,
						firstTouch:	this.touchFirst,
						newPath:true					
					}					
				}
			},
			getCourseInfo(id){
				var self = this;
				this.userinfos = wx.getStorageSync('userInfo');
				wx.showLoading();
				let query = {
					courseId:id,
					userId:this.userinfos.userId,
					token:this.userinfos.token
				}				
				this.$http.post(this.$server.getCourseInfoCourses,query,{urlType:true}).then(res=>{
					if(res.data.status==200){
							this.dataInfo = res.data.content;
							//封面图缓存起来
							wx.setStorageSync('shareImgsName',JSON.stringify(this.dataInfo.title))
							wx.setStorageSync('shareImgsUrl',JSON.stringify(this.dataInfo.surfacePlot))
							this.objs={
								surfacePlot:this.dataInfo.surfacePlot,//视频封面图
								planPeriodNum:this.dataInfo.planPeriodNum,//课程数量
								sellingPrice:this.dataInfo.sellingPrice,//销售价格
								title:this.dataInfo.title,//课程标题
								actualPeriodNum:this.dataInfo.actualPeriodNum,//已经更新课程数；
								courseBrowsCount:this.dataInfo.courseBrowsCount,//学习人数
								courseId:this.dataInfo.id,//课程id
								lectureTeacherList:this.dataInfo.lectureTeacherList,//课程老师列表
								isFree:this.dataInfo.isFree,//课程是不是免费
								isVip:this.dataInfo.isVip,//课程是不是vip,0不是，1是
								isBuy:this.dataInfo.isBuy,
								isTrySee:this.dataInfo.isBuy,
								timeLimitType:this.dataInfo.timeLimitType,
								spikePrice:this.dataInfo.spikePrice,
								isJoinAssemble:this.dataInfo.isJoinAssemble==1?true:false,
								assembleCourseId:this.dataInfo.assembleCourseId,
								assemblePrice:this.dataInfo.assemblePrice,
								originalPrice:this.dataInfo.originalPrice
							};
							this.introduceInfo = this.dataInfo.introduce.replace(/<img/gi, '<img width="100%!important"');
							this.timeObj={
								timeStart:this.dataInfo.timeLimitBeginAt,//限时购开始时间
								timeEnd:this.dataInfo.timeLimitEndAt,//限时购结束时间
								nowServerTime:this.dataInfo.nowServerTime,//当前服务器时间
								limitType:this.dataInfo.timeLimitType//限时购类型 0免费1打折2秒杀-1非限时购课程
							};
							if(Number(this.dataInfo.timeLimitType)==1||Number(this.dataInfo.timeLimitType)==2){
								this.timeHideOrShow = true;
							}else{
								this.timeHideOrShow = false;
							}	
							if(Number(this.dataInfo.courseType)==1){
								this.showOrHide = true;
								let temp = Object.assign({},this.videoData,{statusCourseVidChoose:-1})
								this.setVideoDateEven(temp); 
								this.setAudioOrVideo('video');
								this.$store.commit('SETAUDIOORVIDEOS','video');
							}else{
								this.setAudioOrVideo('audio');
								this.$store.commit('SETAUDIOORVIDEOS','audio');
								this.showOrHide = false;
							}
							if(this.dataInfo.xgxwChannel){
								this.showActionSheet.itemList=[];
								let nums = 0;
								if(Number(this.dataInfo.sellingPriceSevenDays)>0){
									this.showActionSheet.itemList.push({
											text: "7天观看有效期",
											type:1,
											moneys:this.dataInfo.sellingPriceSevenDays										
									});
								}
								if(Number(this.dataInfo.sellingPriceThirtyDays)>0){
									this.showActionSheet.itemList.push({
											text: "30天观看有效期",
											type:2,
											moneys:this.dataInfo.sellingPriceThirtyDays										
									});
								}
								if(Number(this.dataInfo.basicPrice)>0){
									this.showActionSheet.itemList.push({
											text: "永久观看有效期",
											type:3,
											moneys:this.dataInfo.basicPrice										
									});
								}
								if(Number(this.dataInfo.sellingPriceSevenDays)>0){
									nums=Number(this.dataInfo.sellingPriceSevenDays);
								}else if(Number(this.dataInfo.sellingPriceThirtyDays)>0){
									nums=Number(this.dataInfo.sellingPriceThirtyDays);
								}else{
									nums = -1;
								}
								if(nums>0){
									this.xgxwChannelData={
										xgxwChannel:true,
										minVal:nums
									};
								}else{
									this.xgxwChannelData={
										xgxwChannel:false,
										minVal:nums
									};									
								}
							}
							//获取目录信息
							this.getCourseCatalogInfo(id);
					}else{
						wx.hideLoading();
						uni.showToast({
							title: res.data.message,
							duration: 1000,
							icon: 'none',
							success: function(){
								wx.navigateTo({
										url: '../index/index'
								})
							}
						});							
					}
				})				
			},
			getCourseCatalogInfo(id){
				var self = this;
				let query = {
					courseId:id,
					token:this.userinfos.token
				}				
				this.$http.post(this.$server.getPeriodsListByCourseIdCourses,query,{urlType:true}).then(res=>{
					wx.hideLoading();
					if(res.data.status==200){
						this.catalogList = res.data.content;
						let lessList = res.data.content.length;
						this.setLessonListNums(lessList);
						if(Number(this.dataInfo.courseType)==1){
							const elementArrys =[];
							var indexofNum = [];
							this.catalogList.forEach((element,index)=>{
								elementArrys.push({
									periodId:element.id,
									courseId:this.dataInfo.id,
									targetDuration:element.targetDuration,
									isTrySee:element.isTry,
									lastStudyPoint:element.lastStudyPoint,
									newPath:false,
									firstTouch:	self.touchFirst									
								});
								if(this.objs.isbuy==1||this.objs.isVip==1||this.objs.timeLimitType==1){
									indexofNum=[0];
								}else{
									if(element.isTry==1){
										indexofNum.push(index);
									}
								}
							});
							if(!indexofNum.length){
								indexofNum =[0];
							}
							this.periodId = this.catalogList[indexofNum[0]].id;	
							this.periodObg = {
								periodId:this.catalogList[indexofNum[0]].id,
								targetDuration:this.catalogList[indexofNum[0]].targetDuration,
								isTrySee:this.catalogList[indexofNum[0]].isTry,
								lastStudyPoint:this.catalogList[indexofNum[0]].lastStudyPoint,
								newPath:false,
								courseId:this.catalogList[indexofNum[0]].courseId,
								firstTouch:	self.touchFirst		
							};
							let temp = Object.assign({},self.videoData,{catalogList:elementArrys})
							this.setVideoDateEven(temp); 							
						}else{
							/*
							*在是音频的情况下的场景分布，
							*第一种是全局音频不存在的情况下，
							*隐藏缩小版音频组件
							*绑定到状态值里面
							*/
							
							if(!this.audioData.playerCreat){ 
								//将音频目录列表存起来；
								const elementArrys =[];
								var indexofNum = [];
								this.catalogList.forEach((element,index)=>{
									elementArrys.push({
										periodId:element.id,
										courseId:this.dataInfo.id,
										targetDuration:element.targetDuration,
										isTrySee:element.isTry,
										lastStudyPoint:element.lastStudyPoint,
										newPath:false,
										firstTouch:	self.touchFirst									
									});
									if(this.objs.isbuy==1||this.objs.isVip==1||this.objs.timeLimitType==1){
										indexofNum=[0];
									}else{
										if(element.isTry==1){
											indexofNum.push(index);
										}
									}									
								});
								if(!indexofNum.length){
									indexofNum =[0];
								}								
								//抽取第一个对象
								this.periodId = this.catalogList[indexofNum[0]].id;	
								this.periodObg = {
									periodId:this.catalogList[indexofNum[0]].id,
									targetDuration:this.catalogList[indexofNum[0]].targetDuration,
									isTrySee:this.catalogList[indexofNum[0]].isTry,
									lastStudyPoint:this.catalogList[indexofNum[0]].lastStudyPoint,
									newPath:false,
									courseId:this.catalogList[indexofNum[0]].courseId,
									firstTouch:	self.touchFirst			
								}
								this.setStatusCourseChoose(-1);
								this.$store.commit('SETCOURSEAUDIOLISTINFO',elementArrys)											
							}							
							/*
							* 在是音频的情况下的场景分布，
							* 第二种是全局音频存在的情况下，
							* 但是进入的是不同的音频，
							* 保留缩小版音频组件
							*/							
							if(this.audioData.courseId&&this.objs.courseId!=this.audioData.courseId){
								//如果音频存在，则新的音频目录存在备用状态里
								const elementArrys =[];
								var indexofNum = [];
								this.catalogList.forEach((element,index)=>{
									elementArrys.push({
										periodId:element.id,
										courseId:this.dataInfo.id,
										targetDuration:element.targetDuration,
										isTrySee:element.isTry,
										lastStudyPoint:element.lastStudyPoint,
										newPath:false									
									});
									if(this.objs.isbuy==1||this.objs.isVip==1||this.objs.timeLimitType==1){
										indexofNum=[0];
									}else{
										if(element.isTry==1){
											indexofNum.push(index);
										}
									}
								});
								this.$store.commit('SETLOCALAUDIOLISTINFO',elementArrys);
								if(!indexofNum.length){
									indexofNum =[0];
								}
								//同时将新的目录的第一个复制给详情
								// this.setStatusCourseChoose(-1);
								this.periodObg = {
									periodId:this.catalogList[indexofNum[0]].id,
									targetDuration:this.catalogList[indexofNum[0]].targetDuration,
									isTrySee:this.catalogList[indexofNum[0]].isTry,
									lastStudyPoint:this.catalogList[indexofNum[0]].lastStudyPoint,
									newPath:false,
									courseId:this.catalogList[indexofNum[0]].courseId,
									firstTouch:	self.touchFirst			
								}
								let temp = Object.assign({},this.audioData,{show:true})
								this.setAudioData(temp);									
							}	

							/*
							* 在是音频的情况下的场景分布，
							* 第三种种是全局音频存在的情况下，
							* 进入的是同一个音频组件；
							* 此时保存的播放目录必须是当期正在播放的目录，
							* 不管是否播放都要隐藏当前缩小版音频组件
							*/	
							if(this.audioData.periodId&&Number(this.objs.courseId)==Number(this.audioData.courseId)){
								self.catalogList.forEach((element,index) => {
									if(Number(element.id)==Number(this.audioData.periodId)){
										self.periodObg = {
											periodId:element.id,
											targetDuration:element.targetDuration,
											isTrySee:element.isTry,
											lastStudyPoint:element.lastStudyPoint,
											newPath:false,
											courseId:element.courseId,
											firstTouch:	self.touchFirst			
										}								
									}
								});				
								let temp = Object.assign({},self.audioData,{show:false})
								this.setAudioData(temp); 		
								if(self.audioData.playFlag){
										/**
										 * 判断当前进入详情页的音频是不是同一个音频组件，
										 * 只有进入的是相同音频才会在存在全局唯一音频组件的同时迷你音频组件隐藏；
										 * 此时继续给进度条赋值更新
										 *  */
										const backgroundAudioManager = wx.getBackgroundAudioManager();
										self.progressEmit({type:false,objs:backgroundAudioManager});								
								}else{
										const backgroundAudioManager = wx.getBackgroundAudioManager();
										self.changeDuration = Math.floor(backgroundAudioManager.currentTime);
								}
							}
						}		
					}
				})				
			},
			//验证课程拼团是否已经结束
			getVerifyIsEndEven(id){
				let self = this; 	
				let query = {
					courseId:id,
					type:1
				}
				self.$http.post(self.$server.getVerifyIsEnd,query,{urlType:false}).then(resInfo=>{
					if(resInfo.data.status==200){
						if(resInfo.data.content.isEnd){
							this.courseIsSpellStates = true;
						}else{
							this.courseIsSpellStates = false;
						}
					}
				});
			},
			// 2021.4.29 7天30天价格设置点击弹窗
			chooseMenu() {
				this.showActionSheet.show = true;
			},
			// 选中弹窗关闭
			selectIsOkCancel(data) {
				if(data.type){
					this.selectMoneyData = data.data;
					this.selectIndex = data.indexitem;
				}
				this.showActionSheet.show = false;
			},
			//点开弹框
			chooseOrOpenCancel(data){
				this.showActionSheet.isAuthorization=data.type;
				this.showActionSheet.show = true;
			}
		}
	}
</script>

<style lang="scss">
.course-box{
	background: #F9F9FB;
	.course-one{
		margin-top: 20rpx;
		padding-top: 27rpx;
		background: #fff;
	}
}
.tabberPlugeCss{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background: #fff;
	z-index: 10000;
}
</style>
