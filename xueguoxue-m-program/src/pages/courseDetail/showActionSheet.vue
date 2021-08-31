
<template>
	<view>
		<view class="tui-actionsheet-class tui-actionsheet" :class="[show?'tui-actionsheet-show':'']">
			<!-- <view class="tui-tips" :style="{fontSize:size+'rpx',color:color}" v-if="tips">
				{{tips}}
			</view> -->
			<view class='tui-operate-box-all' :class="[isCancel?'tui-operate-box':'']">
				<block v-for="(item,index) in itemList" :key="index">
					<!-- hover-class="tui-actionsheet-hover" :style="{color:item.color || '#1a1a1a'}" -->
					<view class="tui-actionsheet-btn tui-actionsheet-divider"
						:class="[(!isCancel && index==itemList.length-1)?'tui-btn-last':'',(indexsMoney==index?'selectCssYes':'selectCssNo')]"
						:hover-stay-time="150" @click="handleClickItem(item,index)">
						<view>{{item.text}}</view>
						<view>{{item.moneys}}币</view>
					</view>
				</block>
				<button class="tui-actionsheet-cancel" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" v-if="isAuthorization"> 
					确定                       
				</button>			
				<view class="tui-actionsheet-cancel" :hover-stay-time="150" @click="handleClickCancel('ok')" v-else>确定</view>				
			</view>
			<image class='closeImg' :src="closesImg" @click="closeDials"/>
			 <!-- hover-class="tui-actionsheet-hover" -->
			<!-- <view class="tui-actionsheet-btn tui-actionsheet-cancel"
				:hover-stay-time="150" v-if="isCancel" @tap="handleClickCancel">取消</view> -->
		</view>
		<view class="tui-actionsheet-mask" :class="[show?'tui-mask-show':'']" @tap="handleClickMask"></view>
	</view>
</template>
 
<script>
	import closesImg from '../../static/courseDetail/closeTwo.png'
	export default {
		name: "tuiActionsheet",
		data() {
			return {
				closesImg:closesImg,
				selectData:{},
				indexsMoney:0
			}
		},
		props: {
			//点击遮罩 是否可关闭
			maskClosable: {
				type: Boolean,
				default: true
			},
			//当前选中的价格
			indexitem: {
				type: Number,
				default: 0
			},			
			//显示操作菜单
			show: {
				type: Boolean,
				default: false
			},
			isAuthorization:{
				type: Boolean,
				default: true				
			},
			//菜单按钮数组，自定义文本颜色，红色参考色：#e53a37
			itemList: {
				type: Array,
				default: function() {
					return [{
						text: "确定",
						color: "#1a1a1a"
					}]
				}
			},
			//提示文字
			// tips: {
			// 	type: String,
			// 	default: ""
			// },
			//提示文字颜色
			color: {
				type: String,
				default: "#9a9a9a"
			},
			//提示文字大小 rpx
			// size: {
			// 	type: Number,
			// 	default: 26
			// },
			//是否需要取消按钮
			isCancel: {
				type: Boolean,
				default: true
			}
		},
		watch:{
			itemList:{
				handler(newVal, oldVal) {
					if(newVal){
						this.selectData=newVal[this.indexsMoney];
					}
				},        
				immediate:true,    
				deep:true
			},			
		},
		created(){
			this.indexsMoney = Number(this.indexitem);
		},
		methods: {
			handleClickMask() {
				if (!this.maskClosable) return;
				this.handleClickCancel('no');
			},
			handleClickItem(item,index) {
				if (!this.show) return;
				this.indexsMoney = Number(index);
				this.selectData = item;
			},
			handleClickCancel(str) {
				this.$emit('selectIsOkCancel',{
					type:str=='ok'?true:false,
					data:this.selectData,
					indexitem:this.indexsMoney,
					e:''
				});
			},
			closeDials(){
				this.handleClickCancel('no');
			},
			decryptPhoneNumber(e){
				this.$emit('selectIsOkCancel',{
					type:true,
					data:this.selectData,
					indexitem:this.indexsMoney,
					e:e
				});				
			}
		}
	}
</script>
 
<style lang="scss">
	.tui-actionsheet {
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
		visibility: hidden;
		transform: translate3d(0, 100%, 0);
		transform-origin: center;
		transition: all 0.3s ease-in-out;
		background: #fff;
		min-height: 100rpx;
		border-radius:20rpx 20rpx 0 0;
		overflow: hidden;
		padding-top: 72rpx;
		.closeImg{
			position: absolute;
			top: 19rpx;
			right: 19rpx;
			display:block;
			width:30rpx;
			height: 30rpx;
		}		
		.tui-operate-box-all{
			.tui-actionsheet-btn{
				width: 600rpx;
				height: 66rpx;
				display: flex;
				align-items: center;
				flex-direction: row;
				margin:auto;
				font-size: 26rpx;
				margin-bottom: 30rpx;
				border-radius: 66rpx;
				line-height:66rpx;
				background: #fff;
				justify-content:space-around;
				&.selectCssYes{
					border:6rpx solid #C30D23;
					color: #C30D23;
				}
				&.selectCssNo{
					border:1rpx solid #CCCCCC;
					color: #333;
				}
			}
		}
		.tui-operate-box {
			.tui-actionsheet-btn{
				text-align: center;
				position: relative;
				// padding:0 40rpx;
				&.tui-btn-last {
					padding-bottom: env(safe-area-inset-bottom);
				}		
			}
			// .tui-actionsheet-divider::before {
			// 	content: '';
			// 	width: 100%;
			// 	border-top: 1rpx solid #d9d9d9;
			// 	position: absolute;
			// 	top: 0;
			// 	left: 0;
			// 	-webkit-transform: scaleY(0.5);
			// 	transform: scaleY(0.5);
			// }						
		}		
			.tui-actionsheet-cancel{
				color: #fff;
				width: 600rpx;
				height: 66rpx;
				line-height: 66rpx;
				margin:auto;
				text-align: center;
				font-size: 26rpx;
				position: relative;
				border-radius:66rpx;								
				padding-bottom: env(safe-area-inset-bottom);
				background:#C30D23;	
				margin-bottom: 52rpx;			
			}	
		// .tui-actionsheet-btn{
		// 	width: 600rpx;
		// 	height: 66rpx;
		// 	margin:auto;
		// 	line-height: 66rpx;
		// 	background: #fff;
		// 	// display: flex;
		// 	// align-items: center;
		// 	// justify-content: center;
		// 	text-align: center;
		// 	font-size: 26rpx;
		// 	position: relative;
		// 	border-radius:66rpx;
		// 	&.tui-actionsheet-cancel{
		// 		color: #fff;
		// 		padding-bottom: env(safe-area-inset-bottom);
		// 		background:#C30D23;	
		// 		margin-bottom: 52rpx;			
		// 	}			
		// }				
	}
	.tui-actionsheet-show {
		transform: translate3d(0, 0, 0);
		visibility: visible;
	}
 
	/* .tui-tips {
		width: 100%;
		padding: 30rpx 60rpx;
		box-sizing: border-box;
		text-align: center;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
  */

 
	// .tui-actionsheet-btn {
	// 	width: 100%;
	// 	height: 100rpx;
	// 	background: #fff;
	// 	display: flex;
	// 	align-items: center;
	// 	justify-content: center;
	// 	text-align: center;
	// 	font-size: 36rpx;
	// 	position: relative;

	// }
 
	// .tui-btn-last {
	// 	padding-bottom: env(safe-area-inset-bottom);
	// }
 
	// .tui-actionsheet-divider::before {
	// 	content: '';
	// 	width: 100%;
	// 	border-top: 1rpx solid #d9d9d9;
	// 	position: absolute;
	// 	top: 0;
	// 	left: 0;
	// 	-webkit-transform: scaleY(0.5);
	// 	transform: scaleY(0.5);
	// }
 
	// .tui-actionsheet-cancel {
	// 	color: #1a1a1a;
	// 	padding-bottom: env(safe-area-inset-bottom);
	// }
 
	// .tui-actionsheet-hover {
	// 	background: #f7f7f9;
	// }
	.tui-actionsheet-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 9996;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}
	.tui-mask-show {
		opacity: 1;
		visibility: visible;
	}
</style>