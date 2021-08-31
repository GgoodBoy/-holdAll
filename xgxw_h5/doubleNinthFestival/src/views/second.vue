<template>
    <div class="second-page">
        <div class="box">
            <div class="box1">
                <p class="title">祝福语</p>
                <div class="text-area">
                    <textarea placeholder="手动编辑祝福" v-model="content" maxlength="50" :class="{'show':show}"></textarea>
                    <span class="num">{{content.length}}/50</span>
                </div>
            </div>
            <div class="box2">
                <p class="title">推荐祝福语:</p>
                <div class="swiper-box">
                    <van-swipe ref="mySwipe" class="my-swipe" :show-indicators="false" :loop="true" :touchable="false" @change="getWordIndex">
                        <van-swipe-item v-for="(item,index) in wordsArr" :key="index">
                            <div class="words-box">
                                <p v-for="(option,i) in item.words" :key="i">{{option}}</p>
                            </div>
                        </van-swipe-item>
                    </van-swipe>
                    <div class="prev" @click="mySwipeTo('prev')">
                        <van-icon name="arrow-left" />
                    </div>
                    <div class="next" @click="mySwipeTo('next')">
                        <van-icon name="arrow" />
                    </div>
                    <div class="btn" @click="takeWord">采用</div>
                </div>
            </div>
            <div class="box3">
                <div class="btn" @click="goNextPage"></div>
            </div>
        </div>
    </div>
</template>
<script>
import {store,mutations} from '../store'
export default {
    data(){
        return{
            content:'',
            wordsArr:[
                {words:['家有一老，如有一宝，','祝您身体健康！']},
                {words:['重阳佳节，','愿风携去我的祝愿和思念，','伴您开心快乐！']},
                {words:['我爱的人，','愿时光温柔以待！']},
                {words:['重阳节，','愿世间老人都健康长寿，','幸福安康！']},
                {words:['祝您宝刀不老','永远年轻！']},
                {words:['您们辛苦了，','有您们在一切安康！']},
                {words:['这辈子能做您们的孩子','是我最大的幸运！']},
                {words:['时间过的真快哦，','不小心，','我也被例入老年人行列，','祈福家人朋友安康！']},
            ],
            index:0,
            show:false
        }
    },
    computed:{
        step(){
            return store.step
        }
    },
    created(){
        if(this.step!=2){
            this.$router.replace('/')
        }
    },
    methods:{
        setContent:mutations.setContent,
        setPeople:mutations.setPeople,
        setStep:mutations.setStep,
        getWordIndex(index){
            this.index = index;
        },
        mySwipeTo(flag){
            if(flag=='prev'){
                this.$refs.mySwipe.prev()
            }else{
                this.$refs.mySwipe.next()
            }
        },
        takeWord(){
            this.content = this.wordsArr[this.index].words.join('')
            this.show = false;
            this.$nextTick(()=>{
                this.show = true;
                setTimeout(()=>{
                    this.show = false;
                },300)
            })
        },
        goNextPage(){
            if(this.content.length==0){
                this.$toast('请编辑祝福语');
                return;
            }
            let query = {
                type:3
            }
            this.$http.post(this.$server.point,query).then(res=>{
                if(res.data.status==200){
                    this.setPeople(res.data.content.num)
                }
            })
            this.setContent(this.content);
            this.setStep(3)
            this.$router.replace('/third')
        }
    }
}
</script>
<style lang="scss" scoped>
    .second-page{
        height: 100%;
        background: url('../assets/image/second_bgd.png')no-repeat 50% 50% / cover;
        .box{
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            text-align: center;
            width: 100%;
            padding: 0.3rem;
            .title{
                width: 100%;
                text-align: left;
                padding-left: 0.1rem;
            }
            .box1{
                margin-bottom: 0.75rem;
                p{
                    font-size: 0.36rem;
                    margin-bottom: 0.2rem;
                    font-weight: bold;
                }
                .text-area{
                    position: relative;
                    height: 3.14rem;
                    border-radius: 0.2rem;
                    border:2px solid #DF7835;
                    overflow: hidden;
                    background: #fff;
                }
                textarea{
                    width: 100%;
                    height: 100%;
                    padding: 0.3rem;
                    line-height: 0.48rem;
                    background: #fff;
                    outline: none;
                    resize: none;
                    font-size: 0.32rem;
                    border:none;
                    border-radius: 0.2rem;
                    &.show{
                        animation: show 0.3s linear both;
                    }
                }
                .num{
                    position: absolute;
                    right: 0.3rem;
                    bottom:0.3rem;
                    font-size: 0.32rem;
                    color:#999;
                }
            }
            .box2{
                .title{
                    font-size: 0.36rem;
                    margin-bottom: 0.2rem;
                    font-weight: bold;  
                }
                .swiper-box{
                    width: 100%;
                    height: 3.14rem;
                    border-radius: 0.2rem;
                    position: relative;
                    background: url('../assets/image/second_box.png')no-repeat 50% 50% / cover;
                    .next,.prev{
                        position: absolute;
                        top:50%;
                        padding: 0.1rem;
                        margin-top:-0.2rem;
                        font-size: 0;
                        z-index: 2;
                        i{
                            font-size: 0.36rem;
                            color:#fff;
                        }
                        &.prev{
                            left:0.1rem
                        }
                        &.next{
                            right: 0.1rem;
                        }
                    }
                    .btn{
                        position: absolute;
                        bottom:0.36rem;
                        width: 1.5rem;
                        height: 0.42rem;
                        font-size: 0.24rem;
                        line-height: 0.44rem;                   
                        box-shadow: 0px 4px 0px 0px rgba(147, 65, 12, 0.86);
                        border-radius: 0.2rem;
                        left: 50%;
                        margin-left:-0.75rem;
                        background: #FFEE5B;
                        z-index: 2;
                    }
                    .my-swipe{
                        height: 100%;
                        position: relative;
                        z-index: 1;
                        .van-swipe-item{
                            height: 80%;
                            position:relative;
                            .words-box{
                                position: absolute;
                                width: 90%;
                                text-align: center;
                                top:50%;
                                left: 50%;
                                transform: translate(-50%,-50%);
                                p{
                                    font-size: 0.34rem;
                                    line-height: 0.44rem;
                                    font-family: 'jiangxi';
                                }
                            }
                        }
                    }
                }
            }
            .box3{
                font-size: 0;
                margin-top:1.16rem;
                .btn{
                    display: inline-block;
                    width: 3.4rem;
                    height: 1.2rem;
                    background: url('../assets/image/second_btn.png')no-repeat 50% 50% / cover;
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
    @keyframes show{
        0%{
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    }
</style>