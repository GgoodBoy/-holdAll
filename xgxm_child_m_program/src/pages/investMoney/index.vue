<template>
	<view class="invest-page" :style="{paddingTop:lowerVersion?'94px':paddingTop+'px'}">
		<Header :title="'订单'" :returnBools="true" :padTop="paddingTop"></Header>
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
	import Header from '../../wxcomponents/Header'
	const app = getApp();
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
				lowerVersion:false,
				paddingTop:0,			
				isJoinAssemble:false,
				assembleCourseId:'',
				isSpellCourseBuy:'',//开团还是普通购买
				selectSpellListId:''
			}
		},
		onLoad(option){
			this.lowerVersion = app.globalData.lowerVersion;
			this.courseId = option.id;
			this.timeLimitType = option.timeLimitType;
			this.spikePrice = option.spikePrice;
			this.xgxwType = Number(option.xgxwType);
			this.userinfos = JSON.parse(wx.getStorageSync('userInfo'));
			this.isJoinAssemble = option.isJoinAssemble;
			this.assembleCourseId = option.assembleCourseId;
			this.isSpellCourseBuy = option.isSpellCourseBuy;
			this.selectSpellListId = option.selectSpellListId;
		},		
		created(){
			this.paddingTop = app.globalData.statusBarHeight+68;
            this.leftHeight = app.globalData.lowerVersion?app.globalData.windowHeight:app.globalData.windowHeight-this.paddingTop;			
			this.equipmentType();
		},
		mounted(){
		},
		onShow(){
        },
        onHide(){;
        },
        onUnload(){
        }, 		
		components:{
			'v-invertype':invertypes_l,
			'v-popup':popup_l,
			'Header':Header
		},
		computed:{
			...mapState(['audioData','timeArry'])
		},
		methods: {
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
	// padding: 30rpx;
	// overflow: hidden;
	// height: calc(100vh - 64px);
	background:rgba(244,244,244,1);	
}
</style>
