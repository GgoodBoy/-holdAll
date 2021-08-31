<template>
    <div class="membership-card-wrap">
        <div class="box">
            <van-icon name="close" class="close-icon" @click="setMembershipCardDialog('')"/>
            <p>{{membershipCardDialog}}</p>
            <div class="btn" @click="goPurchased"></div>
        </div>
    </div>
</template>
<script>
import {mapActions,mapState} from 'vuex'
export default {
    data(){
        return{

        }
    },
    computed:{
        ...mapState(['membershipCardDialog'])
    },
    methods:{
        ...mapActions(['setMembershipCardDialog']),
        goPurchased(){
            sessionStorage.removeItem('welcomeSpeechForMemberMake');
            this.setMembershipCardDialog('');
            window.location.href = `${this.$server.downLoad}`
        }
    }

}
</script>
<style lang="scss" scoped>
    .membership-card-wrap{
        position: fixed;
        top:0;
        left: 0;
        z-index: 111;
        background: rgba(0,0,0,0.7);
        width: 100%;
        height: 100vh;
        .box{
            position: absolute;
            top:50%;
            left: 50%;
            transform:translate(-50%,-50%);
            width:4.76rem;
            height:5.24rem;
            background: url('../../assets/image/activity_gift.gif')no-repeat 50% 50%/cover;
            p{
                color:#fff;
                font-size: 0.28rem;
                position: absolute;
                top:2.8rem;
                left: 0;
                padding: 0 0.4rem;
                width: 100%;
            }
            i{
                display: block;
                font-size: 0.48rem;
                position: absolute;
                right: 0;
                top:0.3rem;
                color:#fff;
            }
            .btn{
                position: absolute;
                bottom:0;
                left: 50%;
                width:3.58rem;
                height: 0.88rem;
                margin:0 0 -0.44rem -1.79rem;
                background: url('../../assets/image/activity_gift_btn.png')no-repeat 50% 50%/cover;
            }
        }
    }
</style>