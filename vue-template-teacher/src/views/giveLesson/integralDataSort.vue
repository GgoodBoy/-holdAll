<template>
    <div class="integralDataSort">
        <el-row :gutter="20" class="lLine40">
            <el-col :span="20">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>            
        </el-row>
        <el-row class="lMarginTop20">
            <el-col class="flexBox">
                    <el-input v-model.trim="title"
                        style="width:200px;margin-right:3px"
                        placeholder="输入课程名称查询"
                        class="search-form"
                        clearable
                        maxlength="20">
                    </el-input> 
                    <el-button class="redBackColor butColorF"  @click="seach('add')">搜索</el-button>                                     
            </el-col>
            <el-col>
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号 "
                        align="center"
                        min-width="50">
                    </el-table-column>                
                    <el-table-column
                        prop="courseName"
                        label="课程名称 "
                        align="center"
                        min-width="150"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="观看数量"
                        prop="visitNum"
                        align="center"
                        min-width="120">                         
                    </el-table-column> 
                    <el-table-column
                        label="观看总时长(秒)"
                        prop="studyDuration"
                        align="center"
                        min-width="120">                         
                    </el-table-column>                                                                                            
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="120"
                        >
                        <template slot-scope="scope"> 
                            <el-button type="text" @click='detailGoTo(scope.row)'>明细</el-button>                                              
                        </template>                        
                    </el-table-column>                                                                              
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
                </div>                
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
                            pathInfo:''
                        }               
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            pageSize:10,
            pageNo:1,
            title:'',                                     
        }
    },
    created(){        
        this.getStudylist(1);     
    },
    props:[],
    computed:{    
    },     
    methods:{       
        detailGoTo(data){
            this.$router.push({path:'/moveCount/integralDetail',query:{id:data.courseId}}); 
        },
        getStudylist(num){   
            if(num){
                this.pageNo = num;
            }
            this.loading = true; 
            const query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    searchContent:this.title
                }
            }            
            this.$http.get(this.$server.getVisitRankListSort,query).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                return element;
                            });                            
                        } 
                   };
                    this.tableData = listIds;
                    this.pageAtion.pageTotal = contentdate.total;
                    this.pageAtion.paginationPage = num;
                    this.$nextTick(function(){
                        this.loading = false; 
                    }) 
               }
                console.log(res);
            })            
        },          
        seach(){
            this.getStudylist(1);
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        }             
    },
    watch: {}, 
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.integralDataSort{
    .flexBox{
        display: flex;
        flex-direction: row;
        justify-content:flex-start;
        align-items: center;
        margin-bottom: 10px;
    }
    .block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }        
}
</style>


