<template>
    <div class="index-page" >
        <p v-if="!finish" class="auth-tip">请在授权后使用</p>
        <template v-if="finish">
            <div class="box" :class="{'action':action}">
                <div class="box1">{{date}}</div>
                <div class="box2">
                    <p class="p1">农历九月初九</p>
                    <p class="p2">重阳节</p>
                    <p class="p3">再忙,也别忘了家人</p>
                </div>
                <div class="box3">
                    <p class="p1">我们总觉得时间还是很多</p>
                    <p class="p2">来日方长</p>
                    <p class="p3">却忽略了默默关心我们的家人</p>
                </div>
                <div class="box4">
                    <div class="btn" @click="goPage"></div>
                </div>
            </div>
            <p class="next" :class="{'action':action}" @click="nextEvent">跳过</p>
        </template>
    </div>
</template>
<script>
import {store,mutations} from '../store'
export default {
    data(){
        return{
            finish:false,
            action:false,
            clickFlag:false,
            date:'2020年10月25日'
        }
    },
    computed:{
        userInfo(){
            return store.userInfo
        }
    },
    watch:{
        userInfo(cur){
            if(cur.nickname){
                this.finish = true;
                setTimeout(() => {
                    this.action = true;
                }, 300);
            }
        }
    },
    created(){
        if(this.userInfo.nickname){
            this.finish = true;
            setTimeout(() => {
                this.action = true;
            }, 300);
        }
    },
    mounted(){
        document.querySelector('.box4').addEventListener('transitionend',(e)=>{
            this.clickFlag = true;
        })
    },
    methods:{
        setPeople:mutations.setPeople,
        setStep:mutations.setStep,
        goPage(){
            this.point(2);
            this.setStep(2)
            this.$router.replace('/second')
        },
        point(type){
            let query = {
                type:type
            }
            this.$http.post(this.$server.point,query).then(res=>{
                if(res.data.status==200){
                    this.setPeople(res.data.content.num)   
                }
            })
        },
        nextEvent(){
            this.setStep(2);
            this.point(1);
            this.$router.replace('/second');
        }
    }
}
</script>
<style lang="scss" scoped>
    .index-page{
        height: 100%;
        background: url('../assets/image/index_bgd.png')no-repeat 50% 50% / cover;
        position: relative;
        .auth-tip{
            color:#fff;
            font-size:0.4rem;
            text-align: center;
            position: absolute;
            width: 100%;
            top:50%;
            left:50%;
            transform: translate(-50%,-50%);
        }
        .next{
            position: absolute;
            right: 0.3rem;
            top:0.3rem;
            font-size: 0.36rem;
            opacity: 0;
            color:#fff;
            &.action{
                opacity: 1;
                transition: all 0.3s;
            }
        }
        .box{
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 6rem;
            text-align: center;
            &.action{
                .box1{
                    opacity: 1;
                    transform: translateY(0px);
                    transition: all 0.5s linear;
                }
                .box2{
                    .p1{
                        opacity: 1;
                        transform: translateY(0px);
                        transition: all 0.5s linear 1s;
                    }
                    .p2{
                        opacity: 1;
                        transform: translateY(0px);
                        transition: all 0.5s linear 2s;
                    }
                    .p3{
                        opacity: 1;
                        transform: translateY(0px);
                        transition: all 0.5s linear 3s;
                    }
                }
                .box3{
                    opacity: 1;
                    transform: translateY(0px);
                    transition: all 0.5s linear 4.5s;
                }
                .box4{
                    opacity: 1;
                    transform: translateY(0px);
                    transition: all 0.5s linear 6s;
                }
            }
            .box1{
                font-size: 0.4rem;
                color:#333;
                font-weight: bold;
                line-height: 0.44rem;
                margin-bottom: 1.5rem;
                transform:translateY(-5px);
                opacity: 0;
            }
            .box2{
                p{
                    font-family: 'jiangxi';
                    color:#000;
                    &.p1{
                        font-size: 0.64rem;
                        transform:translateY(-5px);
                        opacity: 0;
                    }
                    &.p2{
                        font-size: 1.4rem;
                        margin-bottom: 0.2rem;
                         transform:translateY(-5px);
                opacity: 0;
                    }
                    &.p3{
                        font-size: 0.64rem;
                         transform:translateY(-5px);
                opacity: 0;
                    }
                }
            }
            .box3{
                transform:translateY(-5px);
                opacity: 0;
                color:#666;
                font-size: 0.28rem;
                margin:0.5rem 0 2rem;
            }
            .box4{
                transform:translateY(0px);
                opacity: 0;
                .btn{
                    display: inline-block;
                    width: 3.42rem;
                    height: 1.2rem;
                    background: url('../assets/image/index_btn.png')no-repeat 50% 50% / cover;
                    -moz-user-select: none; 
                    -webkit-user-select: none; 
                    -ms-user-select: none; 
                    -khtml-user-select: none; 
                    user-select: none;
                    animation: scaleBtn 3s linear both infinite;
                }
            }
        }
    }
    
</style>