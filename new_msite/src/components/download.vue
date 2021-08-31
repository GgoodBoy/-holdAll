<template>
    <div class="download-wrap">
        <div class="box">
            <van-icon name="close" class="close" @click="close"/>
            <p @click="goApp">下载学国学网APP</p>
        </div>
    </div>    
</template>
<script>
import {mapActions} from 'vuex'
export default {
    methods:{
        ...mapActions(['setDownLoadFlag']),
        goApp(){
            if(this.$route.params.courseId){
                window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`
            }else{
                window.location.href = `${this.$server.downLoad}`
            }   
        },
        close(){
            this.setDownLoadFlag(false);
        }
    }
}
</script>
<style lang="scss" scoped>
    .download-wrap{
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 9999;
        .box{
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 5.9rem;
            height: 1.6rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff;
            border-radius: 8px;
            i{
                position: absolute;
                font-size: 0.48rem;
                color:#fff;
                right: 0;
                top:-0.6rem;
            }
            p{
                width: 4rem;
                height: 0.8rem;
                line-height: 0.8rem;
                border-radius: 25px;
                color:#fff;
                font-size: 0.3rem;
                background-image: linear-gradient(#E62F45, #D51F35, #C71227);
                text-align: center;
            }
        }
    }
</style>