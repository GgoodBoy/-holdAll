<template>
    <view class="silder-pluge justifyContent1">
        <view class="control-item prve" @click="prveOrNextEven(-1)">
            <image class='img-css' :src="prevIcon" />
        </view>
        <view class="pressBox">
            <view class="leftSlot"></view>
            <view class="pressBox-one">
                <van-slider bar-height="2px" use-button-slot :value="percentageVal" active-color="#C30D23" inactive-color="#f4f4f4" @drag-end='dragEnd' @drag='onDrag' @change="onChange">
                    <div slot="button" class="bar-btn" ref="barBtn">{{currentTimeResolve}}/{{durationResolve}}</div>
                </van-slider>
            </view>
            <view class="rightSlot"></view>
        </view>
        <view  class="control-item next" @click="prveOrNextEven(1)">
            <image class="img-css" :src="nextIcon" />
        </view>
    </view>
</template>
<script>
    import {mapState,mapActions} from 'vuex'
    import nextIcon from '../../static/courseDetail/next.png' 
    import prevIcon from '../../static/courseDetail/prev.png'
    const formatSeconds = value =>{
    let m = parseInt(value % 3600 / 60)
    let s = parseInt(value % 3600 % 60)
    let mStr = m<10?`0${m}`:m;
    let sStr = s<10?`0${s}`:s;
    if(value<3600){
        return `${mStr}:${sStr}`
    }else{
        let h = parseInt(value/3600)
        let hStr = h<10?`0${h}`:h;
        return `${hStr}:${mStr}:${sStr}`
    }
};
    export default {
            data() {
                return {  
                    nextIcon:nextIcon,//左右上一首下一首按钮
                    prevIcon:prevIcon,//左右上一首下一首按钮
                    durationResolve:'00:00',
                    currentTimeResolve:'00:00',
                    percentageVal:0,//当亲滚动条比例
                    onDragType:false//滚动条拖拽过成中的状态
                }
            },
            props: ['duration','currentTime'],   
            onReady: function (res) {
            }, 
            watch:{
                duration(cur,old){
                    if(cur){
                        this.durationResolve = formatSeconds(Math.floor(cur));
                    }
                },  
                currentTime(cur,old){
                    if(cur!=old){
                        this.currentTimeResolve = formatSeconds(Math.floor(cur));
                        this.percentageVal=this.percentageEven(cur);
                    }
                }                               
            },
            computed:{
                ...mapState(['statusCourseChoose','lessonListNum'])
            },                         
            mounted(){},               
            methods: {
                ...mapActions(['setStatusCourseChoose']),
                //上一首下一首事件
                prveOrNextEven(numType){
                    if(numType==-1){
                        if(this.statusCourseChoose>=1){
                            let nums = this.statusCourseChoose+numType;
                            this.setStatusCourseChoose(nums);
                        }else{
                            this.setStatusCourseChoose(0);
                        }
                    }else{                 
                        if(this.statusCourseChoose==(this.lessonListNum-1)){
                            this.setStatusCourseChoose(this.statusCourseChoose);
                        }else{
                            let nums = this.statusCourseChoose+numType;
                            this.setStatusCourseChoose(nums);
                        }                        
                    }         
                },                
                //拖动进度条时触发
                onDrag(val){
                    if(!this.onDragType){
                        this.onDragType = true;
                        this.$emit('onDragEven',{type:true});
                    }
                },
                //结束拖动时触发
                dragEnd(val){
                    this.onDragType = false;
                    this.$emit('onDragEven',{type:false});
                },
                //进度值改变后触发
                onChange(val){
                    //获取当前拖拽的时间点；
                    let currentTimes = Number(val.detail)*Number(this.duration)/100;
                    this.$emit('setDataToHttp',{timeInfo:currentTimes});
                },
                //数据变动比例；
                percentageEven(data){
                    // let bals =Math.floor(Number(data)/Number(this.duration)*100); 
                    let bals =(Number(data)/Number(this.duration)*100).toFixed(2);
                    if(bals>0){
                        return bals;
                    }else{   
                        return 0;    
                    }
                }                
            }    
    }
</script>
<style lang="scss">
.justifyContent1{
    justify-content: space-between;
}
.justifyContent2{
    justify-content: center;
}
.silder-pluge{
    width: 690rpx;
    margin: 0 auto;
    position: relative;
    display: flex;
    // justify-content: space-between;
    flex-direction: row;
    align-items: center;
    .control-item{
        width: 50rpx;
        height: 56rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .img-css{
            width: 21rpx;
            height: 24rpx;
            display: block;
        }
    }
    .pressBox{
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 604rpx;
        .pressBox-one{
            width: 480rpx;
        }
        .leftSlot{
            width: 67rpx;
            height: 2px;
            background: #C30D23;
        }
        .rightSlot{
            width: 67rpx;
            height: 2px;
            background: #F4F4F4;
        }        
        .bar-btn{
            background-color: #C30D23;
            border-radius: 33rpx;
            width:134rpx;
            height:33rpx;
            line-height: 33rpx;
            font-size: 18rpx;
            color: #fff;
            text-align: center;
            position: relative;
            z-index: 1;
        }        
    }
}
</style>