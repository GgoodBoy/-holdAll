<template>
    <view class="time-pluge" v-if="timeHideOrShow"> 
        <view class="time-1">
            <image :src="timeImg" />
        </view>
        <view class="time-2">{{timeLimitTypeArr[timeObj.limitType]}}</view>
        <view class="time-3">{{timeDes}}</view>
        <!-- <view class="time-4">{{time}}</view> -->
        <view class="time-5">
            <!-- <view class="libox">{{dayTime}}</view>
            <view class="limg">:</view> -->
            <view class="libox">{{hTime}}</view>
            <view class="limg">:</view>
            <view class="libox">{{mTime}}</view>
            <view class="limg">:</view>
            <view class="libox">{{stime}}</view>
        </view>
    </view>
</template>

<script>
import timeImg from '../../static/times.png'
export default {
    data() {
        return {
            timeImg:timeImg,
            timeLimitTypeArr:['限时免费','限时折扣','限时秒杀'],
			timer:null,
            time:'',
            timeDes:'',
            limitFlag:false,
            ms:99,
            msTimer:'',
            dayTime:'',
            hTime:'',
            mTime:'',
            stime:''
        }
    },
    onReady: function (res) {
    },
    props:['timeObj','timeHideOrShow'],
    created(){},   
    watch:{
        timeObj:{
            handler(newVal, oldVal) {
                if(newVal.limitType==0||newVal.limitType==1||newVal.limitType==2){
                   this.getAnalysisTime(newVal); 
                }
            },        
            immediate:true,    
            deep:true
        }
    },     
    methods:{ 
        //时间解析
        getAnalysisTime(data){
            let timeLimitType = data.limitType;
            if(timeLimitType>-1){
                let timeLimitBeginAt = data.timeStart;
                let timeLimitEndAt = data.timeEnd;
                let nowServerTime = data.nowServerTime;
                this.isStartCountDown(timeLimitBeginAt,timeLimitEndAt,nowServerTime)
            }
        },
        /**是否进行倒计时 */
		isStartCountDown(timeLimitBeginAt,timeLimitEndAt,nowServerTime){
			if(timeLimitEndAt && timeLimitBeginAt){
				let begin = new Date(timeLimitBeginAt.replace(/-/g, '/')).getTime();
				let end = new Date(timeLimitEndAt.replace(/-/g, '/')).getTime();
				let now = new Date(nowServerTime.replace(/-/g,'/')).getTime()
				switch(true){
					case now<begin:
						this.timeDes = '距离活动开始时间';
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
                    this.dayTime = parseInt(time/ 86400)>0?parseInt(time/ 86400):'00';
                    var hTimeNum = Number(this.dayTime)*24;
                    var hTimeAll = Number(hTimeNum)+ Number(h);
                    this.hTime = hTimeAll>0?hTimeAll:'00';
                    this.mTime = Number(m)>0?m:'00';
                    this.stime = Number(s)>0?s:'00';
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
                            this.dayTime = day = parseInt(time/ 86400)>0?parseInt(time/ 86400):'00';
                            var hTimeNum = Number(this.dayTime)*24;
                            var hTimeAll = Number(hTimeNum)+ Number(h);
                            this.hTime = hTimeAll>0?hTimeAll:'00';
                            this.mTime = Number(m)>0?m:'00';
                            this.stime = Number(s)>0?s:'00';                         
							if(time-temp>=3){
								time = temp;
                                this.time = parseInt(time/ 86400) + '天'+h+ ':' + m + ':' + s ;
                                this.dayTime = parseInt(time/ 86400)>0?parseInt(time/ 86400):'00';
                                var hTimeNum = Number(this.dayTime)*24;
                                var hTimeAll = Number(hTimeNum)+ Number(h);
                                this.hTime = hTimeAll>0?hTimeAll:'00';
                                this.mTime = Number(m)>0?m:'00';
                                this.stime = Number(s)>0?s:'00';                            
							}
						}else{
                            this.time = ''
                            this.dayTime = '00';
                            this.hTime = '00';
                            this.mTime = '00';
                            this.stime ='00';                             
							this.limitFlag = true
							clearInterval(this.timer)
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
    }
        
}
</script>
<style lang="scss">
.time-pluge{
    height: 80rpx;
    display: flex;
    width: 620rpx;
    margin: 20rpx auto 0;
    flex-direction: row;
    justify-content: space-around;
    background-image: linear-gradient(to right,#FACC22, #FE9D03, #FACC22);
    align-items: center;
    border-radius: 80rpx;
    padding: 0 30rpx;
    color: #fff;
    // position: fixed;
    // bottom: 27rpx;
    // left: 40rpx;
    // right: 40rpx;
    .time-1{
        width: 42rpx;
        height: 42rpx;
        margin-right: 6rpx;
        image{
            width: 100%;
            height: 100%;
        }
    }
    .time-2{
        font-size: 30rpx;
        font-weight: 700;
    }
    .time-3{
        font-size: 28rpx;
    }
    .time-4{
        font-size: 28rpx;
    }
    .time-5{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        .libox{
            // width: 40rpx;
            height: 40rpx;
            text-align: center;
            background: #fff;
            border-radius: 6rpx;
            color: #C30D23;
            line-height: 40rpx;
            padding: 4rpx 8rpx;
            font-size: 26rpx;
        }
        .limg{
            width: 24rpx;
            height: 40rpx;
            text-align: center;
            color: #fff;
            line-height: 40rpx;
        }
    }           
}
</style>