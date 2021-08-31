<template>
    <div class="course-info">
        <div class="course-info-block">
            <p class="course-title">{{courseData.title}}</p>
            <div class="textEllipsis course-base-info clearfix">
                <div class="l">
                    <p class="period-num">共{{courseData.planPeriodNum||'0'}}节/已更新{{courseData.actualPeriodNum||'0'}}节</p>
                    <p>丨</p>
                    <p class="brows-num">{{courseData.courseBrowsCount?courseData.courseBrowsCount+1>100000?'10w+':courseData.courseBrowsCount+1:0}}人学习</p>
                </div>
                <div class="r">
                    <p v-if="courseData.isFree>0">免费</p>
                    <div v-else>
                        <p v-if="courseData.isBuy>0||courseData.isVip==1"></p>
                        <p v-else>
                            <span v-if="courseData.timeLimitType>=0"></span>
                            <span v-else>{{courseData.sellingPrice}}币</span>
                            <!-- <span v-if="courseData.timeLimitType===0">{{isStart?'免费':courseData.sellingPrice}}</span>
                            <span v-else>{{courseData.timeLimitType==2&&isStart?courseData.spikePrice:courseData.sellingPrice}}币</span> -->
                        </p>
                    </div>
                </div>
            </div>
            <!-- <div class="tips" @click="openApp">下载学国学APP 领双十一5元优惠券 </div> -->
            <div>
                <p class="channel-buy-avaliday" v-if="courseData.channelBuyAvaliDay!=0">有效学习时间至：{{courseData.channelBuyAvaliDay}}</p>
            </div>
            <van-notice-bar
                v-if="noticeBarShow"
                :scrollable="noticeScroll"
                class="notice-bar"
                mode="closeable"
                left-icon="volume-o"
                :text="courseData.courseAdvertisementDetail.content"
                ref="myNoticeBar"
                @click.native="noticeBarClick($event)"
            />
        </div>
    </div>
</template>
<script>
const iosDown = 'https://itunes.apple.com/cn/app/id1447039784?ls=1&mt=8'
const androidDown = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.xueguoxue.xgxw2018';
export default {
    data(){
        return{
            isStart:false,
            noticeScroll:false,
            noticeBarShow:true,
        }
    },
    props:['courseData','copyDialogVisible','copyDialogstate','copyText'],
    created(){
        if(this.courseData.timeLimitType>=0&&this.courseData.timeLimitBeginAt&&this.courseData.nowServerTime){
            let begin = new Date(this.courseData.timeLimitBeginAt.replace(/-/g, '/')).getTime();
            let now = new Date(this.courseData.nowServerTime.replace(/-/g, '/')).getTime()
            this.isStart = now>=begin?true:false
        }
        this.noticeBarShow = this.courseData.isExistAdvertisement==1;
        setTimeout(()=>{
            if(!this.noticeBarShow) return;
            const target = this.$refs.myNoticeBar.$el.querySelector('.van-notice-bar__content');
            const containerLength = target.clientWidth;
            const scrollWidth = target.scrollWidth;
            this.noticeScroll = scrollWidth>containerLength;
            if(this.noticeScroll){
                this.noticeBarShow = false;
                this.$nextTick(()=>{
                    this.noticeBarShow = true;
                })
            }
        },1)
    },
    methods:{
        openApp(){
            const url = this.isIos?'xueguoxuewang://':'xgx://into/index'
            window.location.href=url
            setTimeout(()=>{
                var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden
                if(typeof hidden =="undefined" || hidden ==false){
                    window.location.href = this.$server.downLoad;
                }
            }, 2500);
        },
        noticeBarClick(e){
            if(e.target.nodeName.toLocaleLowerCase()!='i'){
                this.$emit('update:copyDialogstate',1)
                this.$emit("update:copyDialogVisible",true)
                this.$emit('update:copyText',this.courseData.courseAdvertisementDetail.wechatNumber)
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .course-info{
		background-color: #fff;
        margin-bottom: 0.1rem;
		position: relative;
        z-index: 2;
        /deep/ .notice-bar{
            height: 0.5rem;
            line-height: 0.5rem;
            margin-top:0.26rem;
            border-radius: 0.1rem;
            color:#C30D23;
            background: rgba(255, 219, 110, 0.62);
            padding:0 0.3rem;
            .van-notice-bar__left-icon{
                background: url('../../assets/image/laba.png')no-repeat 50% 50% /contain;
                min-width: auto;
                width: 0.28rem;
                height: 0.28rem;
                margin-right: 0.1rem;
                &::before{
                    content:'';
                    display: none;
                }
            }
            .van-notice-bar__content{
                font-size: 0.24rem;
            }
            .van-notice-bar__right-icon{
                top:0;
                right:0;
                margin-top:0;
                color:#666;
            }
            .van-notice-bar__wrap{
                margin-right: 0.1rem;
                height:0.5rem;
            }
        }
        .course-info-block{
            padding: .3rem;
        }
        .course-title{
			font-size: 0.32rem;
            color:#333;
			height:0.32rem;
			line-height: 0.32rem;
		}
        .tips{
            margin-top:0.2rem;
            font-size: 0.26rem;
            color:#C30D23;
        }
		.course-base-info{
			margin:0.2rem 0 0 0;
			line-height: 0.32rem;
			color:#999999;
            .l{
                float: left;
				font-size: 0;
                line-height: 0.32rem;
                p{
                    display: inline-block;
                    vertical-align: middle;
                    color:#999999;
                    font-size: 0.26rem;
                }
            }
            .r{
                float: right;
                color:#C30D23;
                font-size: 0.32rem;
				line-height: 0.32rem;
            }
		}
        .channel-buy-avaliday{
            height: 0.24rem;
            line-height: 0.24rem;
            color:#CC0033;
            margin:0.3rem 0;
        }
    }
</style>