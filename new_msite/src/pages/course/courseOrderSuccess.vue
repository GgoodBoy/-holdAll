<template>
    <div class="order-success">
        <Header :name="'订单完成'"/>
        <div class="wrapper">
            <div class="result">
                <p><span class="label">订单号</span> : <span>{{orderId}}</span></p>
                <p><span class="label">{{paymentTypeName}}抵扣</span> : <span>{{realPayPrice}}</span></p>
                <p v-show="reducedPrice!=''&&reducedPrice>0"><span class="label">优惠券抵扣</span> : <span>{{reducedPrice}}</span></p>
                <p v-show="reducePrice!=''&&reducePrice>0"><span class="label">本单减价</span> : <span>{{reducePrice}}元</span></p>
                <p v-show="integralDeductionPrice!=''&&integralDeductionPrice>0"><span class="label">积分抵扣</span> : <span>{{integralDeductionPrice}}</span></p>
            </div>
            <div class="content">
                <img :src="success" />
                <p class="yongjin" @click="goPoster" v-if="showSharePoster==1">点我分享，最高可得{{showSharePosterPrice}}元佣金</p>
                <p class="tips">您已成功购买课程，马上去学习吧~</p>
                <div>
                    <div class="my-btn go-on" @click="buyCourse">继续购课</div>
                    <div class="my-btn go-course" @click="onClickLeft">查看课程</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import success from '@/assets/image/success.png'
import Header from '@/components/Header.vue'
import {mapState,mapActions} from 'vuex'
export default {
    data(){
        return {
            success:success,
            orderId:'',
            realPayPrice:'',
            reducedPrice:'',//优惠券优惠
            reducePrice:'',//减价（显示系列课程）
            integralDeductionPrice:'',
            showSharePoster:'',
            showSharePosterPrice:'10'  
        }
    },
    computed:{
		...mapState(['hasOpenApp']),
    },
    components:{Header},
    methods:{
        ...mapActions(['setBuySuccess','setDownLoadFlag']),
        onClickLeft(){
            let courseId = this.$route.params.courseId;
            if(courseId){
                sessionStorage.setItem('fromSuccess',true);
                this.$router.replace(`/course/${courseId}`)
            }
        },
        buyCourse(){
            this.$router.push('/')
        },
        goPoster(){
            this.setDownLoadFlag(true);
            return;
            let courseId = this.$route.params.courseId
            this.$router.push(`/course/poster/${courseId}`)
        }
    },
    created(){
        let query = localStorage.getItem('orderSuccess');
        if(query){
            query = JSON.parse(query);
            let aboutCourse = localStorage.getItem('aboutCourse')
            if(aboutCourse){
                localStorage.removeItem('aboutCourse')
            }
            localStorage.removeItem('orderSuccess');
            this.orderId = query.orderId
            this.realPayPrice = query.realPayPrice;
            this.reducedPrice = query.reducedPrice;
            this.reducePrice = query.reducePrice;
            this.paymentTypeName = query.paymentTypeName;
            this.integralDeductionPrice = query.integralDeductionPrice;
            this.showSharePoster = query.showSharePoster;
            this.showSharePosterPrice = query.showSharePosterPrice
            this.setBuySuccess(true)	
        }else{
            if(this.$route.query&&this.$route.query.orderId){
                this.orderId = this.$route.query.orderId
                this.realPayPrice = this.$route.query.realPayPrice
                this.reducedPrice = this.$route.query.reducedPrice
                this.reducePrice = this.$route.query.reducePrice
                this.paymentTypeName = this.$route.query.paymentTypeName
                this.integralDeductionPrice = this.$route.query.integralDeductionPrice
                this.showSharePoster = this.$route.query.showSharePoster
                this.showSharePosterPrice = this.$route.query.showSharePosterPrice
                this.setBuySuccess(true)
            }
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.setBuySuccess(false)
        next()
    }
}
</script>
<style lang="scss">
    .order-success{
        background: #F9F9FB;
        .go-back{
            width: 0.5rem;
            height: 0.5rem;
            vertical-align: middle;
        }
        .result{
            padding: 0.2rem 0.5rem;
            background: #fff;
            margin-bottom:0.3rem;
            p{
                font-size:0.28rem;
                padding:0.1rem 0;
                span{
                    display: inline-block;
                    vertical-align: middle;
                }
                .label{
                    text-align: justify;
                    text-align-last: justify;
                    width: 1.5rem;
                }
            }
        }
        .content{
            background: #fff;
            text-align: center;
            padding-top:1rem;
            img{
                display: inline-block;
                width: 72%;
            }
            p.yongjin{
                font-size: 0.32rem;
                color:#231B14;
                margin:1rem 0 -0.3rem 0;
               text-decoration:underline;
            }
            p.tips{
                color:#dfdfdf;
                font-size: 0.28rem;
                margin:0.8rem 0;
            }
            .my-btn{
                display: inline-block;
                vertical-align: middle;
                font-size: 0.32rem;
                border-radius: 25px;
                border:1px solid #C30D23;
                height: 0.84rem;
                line-height:0.8rem;
                letter-spacing: 1px;
                width: 2.36rem;
                &.go-on{
                    color:#C30D23;
                    margin-right: 0.6rem;
                    background: #fff;
                }
                &.go-course{
                    color:#fff;
                    background: #C30D23
                }   
            }
        }
    }
</style>
