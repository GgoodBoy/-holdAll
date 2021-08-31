<template>
	<view class="invest-page">
		<v-invertype :selectSpellListId='selectSpellListId' :xgxwType="(xgxwType==1||xgxwType==2)?xgxwType:''" :isSpellCourseBuy='isSpellCourseBuy' :isJoinAssemble='isJoinAssemble' :assembleCourseId='assembleCourseId' :spikePrice="spikePrice" :courseId='courseId' :timeLimitType="timeLimitType" :selectObjsOther='selectObjsOther'  @selectCoupon='selectCoupon'></v-invertype>
		<view v-if="popupState&&iosOrAndroid=='Android'">
			<v-popup :itemsCouponList="itemsCouponList" @closePages="closePages" :selectRadioId="selectRadioId" @setCouponVals='setCouponVals'></v-popup>
		</view>
	</view>
</template>  

<script>
	import {mapState,mapActions} from 'vuex'
	import invertypes_l from './investType.vue';
	import popup_l from './popUp.vue';
	export default {
		data() {
			return {
				courseId:'',
				popupState:false,//遮罩限时还是隐藏；
				itemsCouponList:[],
				userinfos:'',
				iosOrAndroid:'',
				selectObjsOther:'',
				selectRadioId:0,
				timeLimitType:'',
				spikePrice:'',			
				xgxwType:'',
				isJoinAssemble:false,
				assembleCourseId:'',
				isSpellCourseBuy:'',//开团还是普通购买
				selectSpellListId:''
			}
		},
		onLoad(option){
			this.courseId = option.id;
			this.timeLimitType = option.timeLimitType;
			this.spikePrice = option.spikePrice;
			this.userinfos = JSON.parse(wx.getStorageSync('userInfo'));
			this.isJoinAssemble = option.isJoinAssemble;
			this.xgxwType = Number(option.xgxwType);
			this.assembleCourseId = option.assembleCourseId;
			this.isSpellCourseBuy = option.isSpellCourseBuy;
			this.selectSpellListId = option.selectSpellListId;
		},		
		created(){
			this.equipmentType();
		},
		mounted(){
		},
		onShow(){
			// this.getCourseInfo(this.courseId);
		},
        onHide(){;
        },
        onUnload(){
        }, 		
		components:{
			'v-invertype':invertypes_l,
			'v-popup':popup_l
		},
		computed:{
			...mapState(['audioData','timeArry'])
		},
		methods: {
			getCourseInfo(id){
				var self = this;
				this.userinfos = wx.getStorageSync('userInfo');
				let query = {
					courseId:id,
					userId:this.userinfos.userId,
					token:this.userinfos.token
				}				
				this.$http.post(this.$server.getCourseInfoCourses,query,{urlType:true}).then(res=>{
					if(res.data.status==200){
						let dataInfo = res.data.content;
						if(Number(dataInfo.isFree)==1||Number(dataInfo.isVip)==1||dataInfo.isBuy==1||dataInfo.timeLimitType==0){
							wx.showToast({
								title: '已拥有当前课程',
								icon: 'none',
								mask:false,
								duration: 1500,//持续的时间
								success:function(){
									uni.redirectTo({
										url: `/pages/courseDetail/index?id=${id}`
									}); 
								},
							})
						}
					}
				})				
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
			closePages(){
				this.popupState = false;
			},
			//选择优惠券赋值
			setCouponVals(data){
				if(data.data.value){
					this.popupState = data.data.bul;
					this.selectObjsOther = {
						label:data.data.lable,
						value:data.data.value,
						reducedPrice:data.data.reducedPrice
					}
				}
			},
			//优惠券遮罩显示还是隐藏
			selectCoupon(data){
				this.popupState = true;
				this.itemsCouponList=data.itemsCouponList;
				this.selectRadioId = data.selectRadioId;
			}		
		}
	}
</script>

<style lang="scss">
.invest-page{
	padding: 30rpx;
}
</style>
