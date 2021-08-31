<template>
	<view class="guess-container">
		<view class="name">{{dataInfo.name}}</view>    
        <block v-if="dataInfo.style==1">
            <view class="dot-box">
                <view class="dot-item" :class="current==index?'active':''" v-for="(item,index) in dotIndex" :key="index"></view>
            </view>
            <swiper class="course-box style1" circular @change="currentChange" autoplay>
                <block v-for="(item,index) in dataInfo.ahprrList" :key="index">
                    <swiper-item>
                        <CourseItem1 :courseData="item"/>
                    </swiper-item>
                </block>
            </swiper>
        </block>
        <block v-if="dataInfo.style==2">
            <view class="dot-box">
                <view class="dot-item" :class="current==index?'active':''" v-for="(item,index) in dotIndexArr" :key="index"></view>
            </view>
            <swiper class="course-box style2" circular @change="currentChange" >
                <block v-for="(item,index) in swiperArr" :key="index">
                    <swiper-item>
                        <view class="item">
                            <block v-for="(option,i) in item" :key="i">
                                <view class="option">
                                    <CourseItem2 :courseData="option"/>
                                </view>
                            </block>
                        </view>
                    </swiper-item>
                </block>
            </swiper>
        </block>
	</view>
</template>  
<script>
    import CourseItem1 from '../../wxcomponents/CourseItem1.vue'
    import CourseItem2 from '../../wxcomponents/CourseItem2.vue'
	export default {
		data() {
			return {
				current:0
			}
		},
		props:['dataInfo'],
		created(){

		},
		mounted(){

		},
		components:{
            CourseItem1,CourseItem2
		},
		computed:{
			dotIndex(){
                return this.dataInfo.ahprrList.map((item,index)=>{
                    return index; 
                })
            },
            swiperArr(){
                if(this.dataInfo.style==2){
                    let res = [],arr = this.dataInfo.ahprrList;
                    for (let index = 0; index < arr.length; index += 2) {
                        if(arr[index+1]){
                            res.push([arr[index], arr[index + 1]]);
                        }else{
                            res.push([arr[index]]);
                        }
                    }
                    return res;
                }
                return []
            },
            dotIndexArr(){
                if(this.swiperArr.length==0){
                    return []
                }
                return this.swiperArr.map((item,index)=>{
                    return index; 
                }) 
            }
        },
		methods: {
			currentChange(e){
                this.current = e.target.current;
            }
		}
	}
</script>

<style lang="scss">
	.guess-container{
        position: relative;
        padding: 0 30rpx;
		margin-top: 50rpx;
        .name{
            display: block;
            font-size: 36rpx;
            line-height: 32rpx;
            height: 36rpx;
            padding: 0 20rpx;
            border-left:6rpx solid #C30D23;
            margin-bottom: 30rpx;
            font-family: 'PingFangSC-Medium';
        }
        .course-box{
            &.style1{
                background: #fff;
                height: 190rpx;
                padding: 20rpx 0 0 0;
            }
            &.style2{
                height: 370rpx;
            }
            .item{
                display: flex;
                justify-content: space-between;
            }
            .option{
                width: 332rpx;
            }
        }
        .dot-box{
            position: absolute;
            display: flex;
            right: 30rpx;
            top:20rpx;
            .dot-item{
                border-radius: 50%;
                height: 12rpx;
                width: 12rpx;
                background: #dfdfdf;
                margin: 0 6rpx;
                &.active{
                    background: #c30d23;
                }
            }
        }
    }
</style>
