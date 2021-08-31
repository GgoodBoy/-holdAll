<template>
    <div class="assemble-item-box" @click="goCourse(item)">
        <div class="assemble-item-left">
            <img :src="item.courseSurfacePlot"/>
            <img class="icon" :src="item.courseType==1?'../assets/image/video.png':'../assets/image/voice.png'"/>
        </div>
        <div class="assemble-item-right">
            <p class="course-name textEllipsis">{{item.courseTitle}}</p>
            <p class="assemble-time textEllipsis" v-show="item.successTime">拼团成功时间:{{item.successTime}}</p>
            <p class="assemble-status">{{item.isSuccess==1?'拼团成功，已支付':'拼团中'}}</p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:['item'],
    methods:{
        goCourse(obj){
           this.$router.push(`/course/${obj.courseId}`)
        }
    }
}
</script>
<style lang="scss" scoped>
    .assemble-item-box{
        padding: 0.2rem;
        .assemble-item-left{
            width:2.63rem;
            height: 1.6rem;
            border-radius: 3px;
            float: left;
            position: relative;
                img{
                width: 100%;
                height: 100%;
                border-radius: 3px;
            }
            .icon{
                position: absolute;
                left: 0.1rem;
                bottom:0.1rem;
                width: 0.36rem;
                height: 0.36rem;
            }
        }
        .assemble-item-right{
            float: left;
            width: calc(100% - 2.63rem);
            height: 1.6rem;
            padding-left: 0.2rem;
            position: relative;
            .course-name{
                color:#1A1A1A;
                position: absolute;
                top:0.06rem;
                left: 0.2rem;
                font-size: 0.28rem;
            }
            .assemble-time{
                color:#9A9A9A;
                height: 1.6rem;
                line-height: 1.6rem;
                font-size: 0.24rem;
            }
            .assemble-status{
                color:#B4272D;
                position: absolute;
                font-size: 0.26rem;
                bottom:0.06rem;
                left: 0.2rem;
            }
        }
    }
</style>
