<template>
    <div>
        <el-row :gutter="20">
            <!-- v-if="flags.includes(items.code)" -->            
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col> 
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
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){                     
        return {
            flags:[],
            typeList:[
                {
                    name:'社源CPA活动统计',
                    pathInfo:'/activityStatistics/cpaTwo/cpaList',
                    code:'activity:webactivity:evaluation'
                }
            ], 
            titleList:[                            
                        {
                            name:'统计',
                            pathInfo:''
                        },
                        {
                            name:'活动数据统计',
                            pathInfo:'/activityStatistics'
                        } ,
                        {
                            name:'活动统计目录',
                            pathInfo:''
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
    components:{
        breadcrumb
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../../components/formSynthesisPlugin/my-component.css";
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


