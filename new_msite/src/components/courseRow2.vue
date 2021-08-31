<template>
    <div class="clearfix fl">
        <div v-if="data" class="course-wrap" @click="goCourse(data.id)">
            <div class="course-img" v-lazy:background-image="lazyBgImg">
                <img :src="data.surfacePlot" alt="">
                <span class="course-tag tc" v-show="data.timeLimitType==0"></span>
                <span class="course-tag tg" v-show="data.timeLimitType==1"></span>
                <span class="course-tag ts" v-show="data.timeLimitType==2"></span>
                <img class="course-type" v-if="data.courseType == 1" :src="looks" alt="">
                <img class="course-type" v-if="data.courseType == 2" :src="hears" alt="">
            </div>
            <div class="course-info">
                <h2 class="course-title textEllipsis">{{data.title}}</h2>
                <p class="course-intro c9a textEllipsis">{{data.intro}}</p>
                <div class="course-definite clearfix">
                    <div class="fl">{{data.courseBrowsCount>10000?(data.courseBrowsCount/10000).toFixed(1)+'w+':data.courseBrowsCount}}人看过</div>
                    <div class="fr zan">{{data.courseUserLikeCount}}赞</div>
                </div>
                <div class="course-price" v-if="data.isVip==1">VIP</div>
                <div class="course-price" v-else>{{data.sellingPrice==0?'免费':`${data.sellingPrice}币`}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import looks from '@/assets/image/looks.png'
import hears from '@/assets/image/hears.png'
import img1 from '@/assets/image/lazy-bg-2.png'
export default {
    props:["data"],
    data(){
        return {
            looks:looks,
            hears:hears,             
            lazyBgImg:img1,
        }
    },
    methods:{
        ...mapActions(['setKnowledgeIdInCourse']),
        goCourse(id){
            this.setKnowledgeIdInCourse('')
            this.$nextTick(()=>{
                this.$router.push(`/course/${id}`)
            })
        }
    },
    computed:{
        ...mapState(['isVip']),
    },
    created(){
		// let uInfo = JSON.parse(this.$getCookie("uInfo"));
		// if(uInfo.isVip){
		// 	this.isVip = true;
        // }
	},
};
</script>

<style lang="scss" scoped>

.course-wrap {
    width: 3.45rem;
    height: 3.96rem;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(227, 227, 229, 1);
    border-radius: 0.1rem;
    margin: 0.1rem 0.1rem 0.3rem;
    overflow: hidden;
}
.course-img {
    width: 3.45rem;
    height: 2rem;
    position: relative;
    background-size: 100% 100%;
    img {
        width: 100%;
        height: 100%;
    }
    .course-tag {
        position: absolute;
        left: 0;
        top: 0;
        width: 1.14rem;
        height: 0.47rem;
        overflow: hidden;
        &.tc{
             background: url('../assets/image/xsmf.png') no-repeat;
            background-size: 100% 100%;
        }
        &.tg{
            background: url('../assets/image/xszk.png') no-repeat;
            background-size: 100% 100%;
        }
        &.ts{
             background: url('../assets/image/sec_kill.png') no-repeat;
            background-size: 100% 100%;
        }
    }
    .course-type{
        width: 0.52rem;
        height: 0.3rem;
        position: absolute;
        left: .1rem;
        bottom: .1rem;
    }
}
.course-info {

    padding: 0.2rem 0.2rem 0.3rem 0.2rem;
    .course-title {
        font-size: 0.3rem;
        color: rgba(26, 26, 26, 1);
    }
    .course-definite {
        padding: 0.03rem 0;
        font-size: 0.24rem;
        color: rgba(154, 154, 154, 1);
    }
    .course-intro{
        padding: 0.03rem 0;
          font-size: 0.24rem;
    }
    .course-price {
        font-size: 0.28rem;
        color: rgba(180, 39, 45, 1);
    }
    .zan {
        position: relative;
        // &:after {
        //     content: "";
        //     position: absolute;
        //     left: -0.3rem;
        //     width: 0.3rem;
        //     height: 0.3rem;
        //     background: url('../../assets/course-not-like.png') no-repeat;
        //     background-size: 100% 100%;
        // }
    }
}
</style>

