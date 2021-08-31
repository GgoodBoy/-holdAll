<template>
    <div>
        <el-row :gutter="20">
            <!-- v-if="flags.includes(items.code)" -->
            <el-col class="lMarginTop30" :span="6" v-for="(items,index) in typeList.filter(item=>item.show==true)" :key="index">
                <div class="typeStyle lSize18"  @click="$router.push(items.pathInfo)">
                {{items.name}}
                </div>
            </el-col>
        </el-row>                    
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data(){                     
        return {
            flags:[],
            typeList:[
                {
                    name:'H5活动',
                    pathInfo:'/activityObj/answer',
                    code:'activity:webactivity:evaluation'
                },
                {
                    name:'活动分享',
                    pathInfo:'/activityShare/share',
                    code:'activity:share'
                },
                {
                    name:'专题',
                    pathInfo:'/activityObj/specialList',
                    code:'activity:thematic'
                },
                {
                    name:'合作平台',
                    pathInfo:'/activityObj/cooperativeList',
                    code:'activity:cooperation'
                },
                {
                    name:'国学大礼包',
                    pathInfo:'/activityObj/giftPackList',
                    code:'activity:gift'
                },
                {
                    name:'新用户赠课',
                    pathInfo:'/activityObj/giveLessonList',
                    code:'activity:givecourse'
                },
                {
                    name:'赠课注册系统',
                    pathInfo:'/activityObj/giveCourseSystem',
                    code:'activity:activityregister'
                },
                {
                    name:'移动用户赠课弹窗',
                    pathInfo:'/activityObj/mobileFreeCourse',
                    code:'activity:mobilePopup'
                }                                                 
            ]
        }
    },
    created(){
        this.typeList.forEach(item=>{
            item.show = this.$authJudge(item.code);
        })
    },
    methods:{
    },
    components:{},
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.typeStyle{
    width: 100%;
    height: 100px;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 100px;
}
.typeStyle:hover{
    background-color:#ccc;
    color:#fff;
    cursor: pointer;
}
</style>


