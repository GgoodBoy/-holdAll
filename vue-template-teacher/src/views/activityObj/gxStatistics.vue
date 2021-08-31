<template>
    <div>
        <el-row :gutter="20">
            <el-col>
                <breadcrumb :menuList ='titleListName'></breadcrumb>
            </el-col>            
            <el-col>
                <elMenusGx :menuList ='titleList'></elMenusGx>
            </el-col>   
            <el-col class="lMarginTop30">
                <el-row :gutter="15" class="lLine40">
                    <el-col :span="6"><el-input v-model.trim="names"  @keyup.native="proving('names')"  placeholder="请输入内容"></el-input></el-col>
                    <el-col :span="2"><el-button v-if="$authJudge('activity:webactivity:statistics:select')" class="redBackColor butColorF" @click="seach(1)">查询</el-button></el-col>
                </el-row>
            </el-col>            
            <el-col class="lMarginTop10">
                <el-table
                :data="tableData"
                v-loading="loadingOne"
                border
                style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="H5测评名称"
                        align="center"
                        min-width="300">
                    </el-table-column>
                    <el-table-column
                        prop="visitCount"
                        label="访问量"
                        align="center"
                        min-width="100">
                    </el-table-column>  
                    <el-table-column
                        prop="evaluationCount"
                        label="完成测评数"
                        align="center"
                        min-width="100">
                    </el-table-column>                                                                           
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="60"
                        >
                        <template slot-scope="scope">
                            <el-row> 
                                <el-col class="lCenter-r">
                                    <el-button v-if="$authJudge('activity:webactivity:statistics:info')" type="text" class="black-btn" @click="channeDetailEven(scope.row)">详情</el-button>
                                </el-col> 
                            </el-row>                                                      
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
            <el-dialog
                :visible.sync="statisticsDialog"
                title=""
                max-height="300"
                width="35%">  
                <el-row>
                    <el-col>
                        <el-row :gutter="20">
                            <el-col :span="10" class="lCenter-r">
                                <el-input placeholder="请输入内容"  @keyup.native="proving('inputCourseTwo')" v-model.trim="inputCourseTwo"></el-input>
                            </el-col>
                            <el-col :span="4" class="lCenter-r">
                                <el-button class="redBackColor butColorF" @click="seach(2)">查找</el-button>
                            </el-col>                                                 
                        </el-row>
                    </el-col>
                    <el-col class="lMarginTop30">
                            <el-table
                                :data="tableDetail"
                                style="width: 100%"
                                v-loading="loadingTwo"
                                max-height="500"
                                border="">
                                <el-table-column
                                    prop="nickName"
                                    label="用户姓名/昵称"
                                    align="center"
                                    min-width="80">
                                </el-table-column>
                                <el-table-column
                                    prop="importUserCount"
                                    label="引入用户数量"
                                    align="center"
                                    min-width="60">
                                </el-table-column>
                                <el-table-column
                                    prop="peotryName"
                                    label="测评结果"
                                    align="center"
                                    min-width="100">
                                </el-table-column>                                
                            </el-table>
                            <div class="block">
                                <el-pagination
                                    background
                                    layout="prev, pager, next"
                                    @current-change="childPageValueSecond"
                                    :current-page.sync="pageAtionSecond.paginationPage"
                                    :total="pageAtionSecond.pageTotal">
                                </el-pagination>
                            </div>                             
                    </el-col>  
                </el-row>
            </el-dialog>                   
    </div>
</template>
<script>
import elMenusGx from "@/components/elMenu/elMenusGx";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data(){                     
        return {
            flags:[],
            tableData:[
                {
                    H5Name:"名字1",
                    commentNum:1,
                    pageView:0
                }
            ],
            tableDetail:[],
            titleListName:[
                            {
                                name:'活动',
                                pathInfo:'/activityObjList'
                            },
                            {
                                name:'H5活动',
                                pathInfo:''
                            }               
                ],
            titleList:[
                {
                    name:'测评管理',
                    pathInfo:'/activityObj/answer',
                    divCss:false
                },
                {
                    name:'题目库',
                    pathInfo:'/activityObj/itemBank',
                    divCss:false
                },
                {
                    name:'诗词库',
                    pathInfo:'/activityObj/poetryLibrary',
                    divCss:false
                },
                {
                    name:'设置',
                    pathInfo:'/activityObj/setUpGx',
                    divCss:false
                },
                {
                    name:'统计',
                    pathInfo:'/activityObj/gxStatistics',
                    divCss:true
                }                                
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },   
            pageAtionSecond:{
                pageTotal:0,
                paginationPage:1
            },               
            names:'',
            pageSize:10,
            pageNo:1,
            statisticsDialog:false,
            inputCourseTwo:'',
            loadingOne:false,
            loadingTwo:false,
            evaluationData:'',        
        }
    },
    created(){     
            this.getTableStatisticList(1);
    },
    components:{
        elMenusGx,
        breadcrumb
    },
    methods:{
        proving(val){
            var self = this;
            var reg = /^(?!.*\\.*$)/;        
            switch (val) {
                case 'inputCourseTwo':
                    if(!reg.test(self.inputCourseTwo)){
                        this.inputCourseTwo='';
                    }                    
                    break;
                case 'names':
                    if(!reg.test(self.names)){
                        this.names='';
                    }                    
                    break;                              
                default:
                    break;
            }    
        },          
        seach(num){
            switch (num) {
                case 1:
                    this.getTableStatisticList(1);
                    break;
                case 2:
                    this.detailTableList(1);
                    break;            
                default:
                    break;
            }
        },
        getTableStatisticList(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loadingOne = true;
            var params = {
                pageNo:self.pageNo,
                pageSize:self.pageSize,
                name:self.names
            };
            self.$http.get(self.$server.h5EvaluationList(params)).then(res=>{
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
                    self.pageAtion.paginationPage = num;
                    self.loadingOne = false;
               }
            })
            .catch(res => {
                    self.loadingOne = false;
            });                                    
        },
        detailTableList(num){
            var self = this;
            this.statisticsDialog = true;
            if(num){
                self.pageNo = num;
            }
            self.loadingTwo = true;
            var params = {
                pageNo:self.pageNo,
                pageSize:self.pageSize,
                evaluationId:self.evaluationData.id,
                name:self.inputCourseTwo
            };
            self.$http.get(self.$server.h5EvaluationId(params)).then(res=>{
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
                    self.tableDetail = listIds;
                    self.pageAtionSecond.pageTotal = contentdate.total;
                    self.pageAtionSecond.paginationPage = num;
                    self.loadingTwo = false;
               }
            })
            .catch(res => {
                    self.loadingTwo = false;
            });
        },
        channeDetailEven(data){
            this.evaluationData = data;
            this.detailTableList(1);
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getTableStatisticList(Number(num))
            }
        },   
        childPageValueSecond(num){
            if(Number(num)>0){
                this.detailTableList(Number(num));
            }
        },         
              
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        background: #fff;
    }
</style>


