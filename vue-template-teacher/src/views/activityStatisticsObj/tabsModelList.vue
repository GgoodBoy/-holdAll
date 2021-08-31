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
                    name:'十二月活动数据统计',
                    pathInfo:'/activityStatistics/twelveActivity/activityStatistics',
                    code:'activity:webactivity:evaluation'
                },
                {
                    name:'菜根谭活动数据统计',
                    pathInfo:'/activityStatistics/caigenTan/cgtActivity',
                    code:'activity:webactivity:evaluation'
                },
                {
                    name:'元旦活动',
                    pathInfo:'/activityStatistics/newYearAction/activityStatistics',
                    code:'activity:webactivity:evaluation'
                },
                {
                    name:'新年福包活动',
                    pathInfo:'/activityStatistics/springFestival/index',
                    code:'activity:webactivity:evaluation'
                },
                {
                    name:'4.23世界读书日',
                    pathInfo:'/activityStatistics/worldBookDay/worldBookDayOne',
                    code:'activity:webactivity:evaluation'
                },
                {
                    name:'成语猜猜猜',
                    pathInfo:'/activityStatistics/idioms/index',
                    code:'activity:webactivity:evaluation'
                },
                {
                    name:'阅读节活动',
                    pathInfo:'/activityStatistics/packet/index',
                    code:'activity:webactivity:evaluation'
                }
                // ,
                // {
                //     name:'CPA活动统计',
                //     pathInfo:'/activityStatistics/cpaTwo/index',
                //     code:'activity:webactivity:evaluation'
                // }
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


