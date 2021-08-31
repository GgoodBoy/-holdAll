

<template>
    <div class="lLine40 headerDiv">
        <el-row>
            <!-- <el-col class="lLeft lSize16 lLine40"><span class="cursorCss" @click="$router.push('/assemble')">拼团课程</span><span> / </span><span>拼团明细</span></el-col> -->
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col> 
            <el-col class="lMarginTop20">
                <el-row :gutter="15">
                    <el-col class="lSize16-i" :span="5">
                        <div class="iSeachEven">
                            <el-input v-model.trim="inputCourse"
                                        placeholder="请输入课程名称"
                                        class="search-form"
                                        width="100%"
                                        @keyup.native="proving1"
                                        clearable
                                        ></el-input>
                        </div>
                    </el-col>
                    <el-col :span="3">
                            <el-button class="redBackColor butColorF"  @click="search">查询</el-button>
                    </el-col>
                </el-row>                
            </el-col>
            <el-col class="lMarginTop40">
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="50">
                    </el-table-column>
                    <el-table-column
                        prop="courseName"
                        label="课程"
                        align="center"
                        min-width="100">
                    </el-table-column>                    
                    <el-table-column
                        prop="createdAt"
                        label="开团时间"
                        align="center"
                        min-width="150">                                
                    </el-table-column>
                    <el-table-column
                        prop="createorName"
                        label="团长"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>   
                    <el-table-column
                        prop="peopleNum"
                        label="拼团人数"
                        align="center"
                        min-width="80">
                    </el-table-column>                                     
                    <el-table-column
                        prop="participatorsName"
                        :show-overflow-tooltip="true"
                        label="参团"
                        align="center"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        prop="assemblePrice"
                        label="拼团价"
                        align="center"
                        min-width="80">
                    </el-table-column>  
                    <el-table-column
                        prop="successTime"
                        label="成团时间"
                        align="center"
                        min-width="150">
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
import { getToken,setToken,removeToken} from '@/utils/auth';
import html2canvas from 'html2canvas';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import editimg1 from "../../../static/images/4.jpg";
export default {
    data(){                     
        return {
            tableData:[],
            pageSize:10,
            inputCourse:'',
            pageNo:1,
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            detailId:'',
            loading:false,            
            titleList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'拼团系统',
                            pathInfo:'/marketelist/assemble'
                        },
                        {
                            name:'拼团明细',
                            pathInfo:''
                        }
            ],      
        }
    },
    components:{
        breadcrumb
    },
    created(){
        this.detailId = this.$route.query['id'];
        this.getAssmbleDetailList(1);
    },
    methods:{
        selectable(){},
        courseSeach(){},
        //课程选择 
        courseChooseEven(){
            // this.getTableCourse(1);
            this.centerDialogList = true;
        },  
        getAssmbleDetailList(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }            
            var parems = {
                courseName:self.inputCourse,
                pageSize:self.pageSize,
                pageNo:self.pageNo,
                id:self.detailId
            };
            self.loading = true; 
            self.$http.get(self.$server.assembleId(parems)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                       if(!nextPage&&prePage!=0){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = (prePage+1)*10+index+1;
                                return element;
                            });
                        }else if(!prePage&&!nextPage){
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
                    self.pageAtion.paginationPage = num;
                    self.loading = false; 
               }
                console.log(res);
            }).catch((err)=>{
                self.loading=false;
            });                        
        },      
        search(){
            this.getAssmbleDetailList(1);
        },
        proving1(){},
        childPageValue(num){
            if(Number(num)>0){
                this.getAssmbleDetailList(Number(num))
            }            
        },          
    },
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px; 
    margin-bottom: 10px;     
}
.headerDiv .iSeachEven{
    width: 100%;
    position: relative;
}
.headerDiv .iSeachEven .el-icon-search{
    position: absolute;
    font-size: 18px;
    right: 10px;
    top: 10px;
    background: #fff;
    font-weight: 900;
}
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }
</style>


