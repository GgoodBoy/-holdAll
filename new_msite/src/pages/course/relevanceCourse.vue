<template>
    <div class="relevance-course-wrap" v-if="courseList.length>0" :class="courseList.length==1?'only-one':''">
        <div class="relevance-box">
            <p class="comp-title">课程推荐</p>
            <div class="course-container clearfix" ref="container" :class="courseList.length==1?'one':''">
                <courseItem1 v-if="courseList.length==1" :data="courseList[0]" :className="'hasBorder'"/>
                <div class="course-list clearfix"  v-if="courseList.length>1">
                    <courseItem2 v-for="(item,index) in courseList" :key="index" :data="item" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import courseItem1 from '@/components/courseRow1'
import courseItem2 from "@/components/courseRow2";
export default {
    data(){
        return {
            courseList:[],
        }
    },
    props:['courseData','isExistRelevance'],
    components:{courseItem1,courseItem2},
    created(){
        
    },
    mounted(){
        this.getRelatedCourseList()
    },
    methods:{
        getRelatedCourseList(){
            let query = {
                courseId:this.courseData.id
            }
            this.$http.post(this.$server.getRelatedCourseList,query).then(res=>{
                if(res.data.status==200){
                    this.courseList = res.data.content;
                    this.$emit('update:isExistRelevance',res.data.content.length>0)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .relevance-course-wrap{
        padding: 0.3rem 0;
        background: #fff;
        margin-bottom: 0.1rem;
        .relevance-box{
            height: 100%;
            background: #fff;
            .comp-title{
                color:#333333;
                font-size: 0.3rem;
                line-height: 0.3rem;
                padding:0 0.18rem;
                position: relative;
                margin:0 0.3rem 0.3rem;
                &::before{
                    content:'';
                    display: block;
                    width: 0.04rem;
                    height: 0.28rem;
                    background: #CC0033;
                    position: absolute;
                    top:0;
                    left: 0;
                }
            }
            .course-container{
                overflow-x: scroll;
                overflow-y: hidden;
                -webkit-overflow-scrolling: touch;
                position: relative;
                height: 4.26rem;
                &.one{
                    height: auto!important;
                    padding:0 0.2rem;
                }
                .course-list{
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    height: 3.96rem;
                    position: absolute;
                    top: 0;
                    left: 0;
                    padding: 0 0.2rem;
                }
            }
        }
    }
    ::-webkit-scrollbar {/*隐藏滚轮*/
        display: none;
    }
</style>
