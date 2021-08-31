<template>
    <view class="time-pluge" v-if="timeHideOrShow"> 
        <view class="time-1">
            <image class='img-css' :src="timeImg" />
        </view>
        <view class="time-2">{{timeLimitTypeArr[timeObj.limitType]}}</view>
        <view class="time-3">{{timeDes}}:</view>
        <view class="time-4">{{time}}</view>
    </view>
</template>

<script>
import timeImg from '../../static/courseDetail/time.png'
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
            msTimer:''          
        }
    },
    onReady: function (res) {
    },
    props:['timeObj','timeHideOrShow'],
    created(){},   
    watch:{
        timeObj:{
            handler(newVal, oldVal) {
                if(newVal.limitType!=""){
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
            let timeLimitType = data.limitType
            if(Number(timeLimitType)>0){
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
						this.timeDes = '距离活动结束时间';
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
    flex-direction: row;
    justify-content: space-around;
    background: rgba(255,59,59,0.6);
    align-items: center;
    border-radius: 80rpx;
    padding: 0 30rpx;
    color: #fff;
    position: fixed;
    bottom: 27rpx;
    left: 40rpx;
    right: 40rpx;
    .time-1{
        width: 42rpx;
        height: 42rpx;
        .img-css{
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
}
</style>