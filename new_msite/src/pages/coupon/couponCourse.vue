<template>
    <div class="coupon-course-wrap">
        <Header :name="'优惠券可用课程'"/>
        <!-- <div class="header-nav">
            <van-nav-bar
                :style="{top:hasOpenApp?'0.98rem':'0px'}"
                title="优惠券可用课程"
                @click-left="onClickLeft">
                <img class="go-back" :src="'./static/img/common/go-left.png'" alt="" slot="left"/>
            </van-nav-bar>
        </div> -->
        <div class="content">
            <div class="list">
                <div class="nullImg" v-if="finish&&list.length==0">
                    <img :src="emptyImg"/>
                </div>
                <div v-else><courseItem v-for="(item,index) in list" :data="item" :key="index" :type="2"></courseItem></div>
            </div>
            <div class="loading-more" ref="more" v-show="loadFlag">
                <van-loading type="spinner" />
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import courseItem from '@/components/courseRow1.vue'
import Header from '@/components/Header.vue'
export default {
    data(){
        return {
            finish:false,
            list:[],
            loadFlag:true,
            couponId:''
        }
    },
    components:{courseItem,Header},
    computed:{
		...mapState(['hasOpenApp']),
    },
    created(){
        this.couponId = this.$route.query.couponId
        this.$nextTick(()=>{
            this.getCouponsInfo()
        })
    },
    methods:{
        onClickLeft(){
            this.$router.go(-1)
        },
        getCouponsInfo(){
            let params = {
                couponId:this.couponId
            }
            this.$http.post(this.$server.getCouponsInfoById,params).then(res=>{
                if(res.data.status == 200){
                    this.list = res.data.content.courseList;
                    this.loadFlag = false;
                    this.finish = true;
                }else if(res.data.status ==  500){
                   this.$router.push('/error')
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>
    .coupon-course-wrap{
        .content{
            .list{
                padding: 0 0.1rem;
            }
            .loading-more{
                padding: 0.25rem 0;
                text-align: center;
                .van-loading{
                    display: inline-block;
                }
            }
        }
    }
</style>
