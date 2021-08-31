<template>
    <div>
        <div class="page-header">
            <el-row>
                <el-col :span="6">
                     <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
                <el-col :span="2" :offset="16">
                    <el-button v-if="$authJudge('school:add')" type="primary" @click="exportDataList">导出</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="40"
                        :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                        prop="cellphone"
                        label="账号"
                        min-width="200"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="name"
                        label="学校"
                        align="center"
                        min-width="200"
                        :show-overflow-tooltip="true">
                    </el-table-column>     
                    <el-table-column
                        prop="gradeName"
                        label="班级"
                        align="center"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="createdAt"
                        label="注册时间"
                        align="center"
                        >
                    </el-table-column>                                       
                    <el-table-column
                        label="状态"
                        align="center"
                        min-width="100">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    {{scope.row.disableMark==1?'禁用':'启用'}}
                                </div>                                              
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
            </div>
        </div>
    </div>
</template>

<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            pageNo:1,
            pageSize:10,
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            },            
            total:10,
            tableData:[],
            loading:false,
            titleList:[
                        {
                            name:'学校管理',
                            pathInfo:'/schoolManage'
                        },
                        {
                            name:'详情',
                            pathInfo:''
                        }
                ],            
            //学校id
            schoolId:''
        };
    },
    components: {
        pagination,
        breadcrumb
    },
    watch: {},
    created() {
        this.schoolId = this.$route.query.userId;
        this.getSchoolList(1);
    },
    methods: {
        exportDataList(){
            var self = this;
            var parems = {
                token:getToken(),
                id:self.schoolId
            };
            self.download2(self.$server.schooleSchooleExport(parems));    
        },        
        download2(url) {
            try{ 
                    var elemIF = document.createElement("iframe");   
                    elemIF.src = url;   
                    elemIF.style.display = "none";   
                    document.body.appendChild(elemIF);   
                }catch(e){ 
                    zzrw.alert("下载异常！");
                }
        },         
        childPageValue(num){
            this.selectPageNum = Number(num);
            if(Number(num)>0){
                this.getSchoolList(Number(num))
            }            
        },        
        /**
         * 获取列表
         */
        getSchoolList(num){
            var self = this;
            self.loading = true;
            if(num){
                self.pageNo = num;
            }            
            let params = {
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                id:this.schoolId
            }
            this.$http.get(this.$server.schooleDetails(params)).then(res=>{
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
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = self.pageNo;
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
    .page-header {
        background: #fff;
        padding: 10px 30px 10px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-title {
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
        }
    }
    .page-content {
        background: #fff;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .editor-btn {
            color:#9E0E00;
            font-size: 14px;
            padding: 0;
            height: 36px;
            line-height: 36px;
        }
        .block{
            text-align: center;
            margin-top:60px;
            padding-bottom:60px;
        }
    }
</style>
<style>
/* body .el-table th.gutter {
    display: table-cell !important
} */
</style>


