<template>
    <div class="integralDetail">
        <el-row :gutter="20" class="lLine40">
            <el-col :span="20">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>            
        </el-row>
        <el-row class="lMarginTop20">
            <el-col class="flexBox">
                    <el-button class="redBackColor butColorF" @click="exportDetail">导出</el-button>                                     
            </el-col>
            <el-col>
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                max-height="500"
                style="width: 100%">
                    <el-table-column
                        prop="cellphone"
                        label="手机号 "
                        align="center"
                        min-width="120">
                    </el-table-column>                
                    <el-table-column
                        prop="createdAt"
                        label="注册时间 "
                        align="center"
                        min-width="200"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="观看时间"
                        prop="studyDuration"
                        align="center"
                        min-width="80">                         
                    </el-table-column>                                                                         
                </el-table>                
            </el-col> 
        </el-row>                            
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    components:{
        breadcrumb
    },    
    data(){
        return {
            tableData:[],
            loading:false,
            titleList:[
                        {
                            name:'移动积分管理',
                            pathInfo:''
                        },
                        {
                            name:'积分数据绑定',
                            pathInfo:'/moveCount/integralDataStatistics'
                        },
                        {
                            name:'观看排行',
                            pathInfo:'/moveCount/integralDataSort'
                        },
                        {
                            name:'排行明细',
                            pathInfo:''
                        }                
            ],
            id:''                                      
        }
    },
    created(){        
        this.ids = this.$route.query.id;
        this.getStudylist(this.ids);     
    },
    props:[],
    computed:{},     
    methods:{     
        getStudylist(ids){    
            this.loading = true;          
            this.$http.get(this.$server.getSortDetail+ids).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   if(contentdate){
                        listIds = contentdate.map(function(element,index){
                            element.sortId = index+1;
                            return element;
                        });
                   };
                    this.tableData = listIds;
                    this.$nextTick(function(){
                        this.loading = false; 
                    }) 
               }
                console.log(res);
            })            
        },      
        exportDetail(){
            var url = this.$server.exportSortDetailList+this.ids+"?token="+getToken();
            window.open(url);            
        }            
    },
    watch: {}, 
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.integralDetail{
    .flexBox{
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }
    .block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }        
}
</style>


