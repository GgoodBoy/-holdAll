<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col :span="12">
                <breadcrumb :menuList ='titleList'></breadcrumb> 
            </el-col> 
            <el-col class="lRight-r lMarginTop20">
                <el-row :gutter="10">
                    <el-col :span="5">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                    placeholder="查找课程名称"
                                    class="search-form"
                                    maxlength="16"
                                    clearable
                                    width="100%"></el-input>   
                        </div>
                    </el-col>
                    <el-col :span="1" v-if="$authJudge('applat:matching:select')"><el-button type="primary" @click="findInfo">查询</el-button></el-col>
                    <el-col :span="2" v-if="$authJudge('applat:matching:add')" :offset="16"><el-button type="primary" @click="informatonEven('','add')">添加</el-button></el-col>
                </el-row>
            </el-col>
        </el-row>  
        <el-row>
            <el-col>
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
                        label="匹配内容"
                        align="center"
                        show-overflow-tooltip
                        min-width="250">
                        <template slot-scope="scope">
                                <div v-if="scope.row.type==2">
                                    <p>{{scope.row.title}}</p> 
                                    <div>{{scope.row.firstSentence}}</div>  
                                    <div>{{scope.row.secondSentence}}</div>    
                                    <div>{{scope.row.thirdSentence}}</div>                                                                    
                                    <div>{{scope.row.fourthSentence}}</div>
                                </div>
                                <div v-else class="programTexte">
                                    {{scope.row.content}}
                                </div>
                        </template>                        
                    </el-table-column>                    
                    <el-table-column
                        prop="courseName"
                        label="课程"
                        align="center"
                        show-overflow-tooltip
                        min-width="150"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="appointedTime"
                        label="指定显示日期"
                        align="center"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        label="管理"
                        align="center"
                        min-width="100"
                        >
                        <template slot-scope="scope">
                            <el-row>
                                <el-col :span="12" v-if="$authJudge('applat:matching:edit')"> 
                                     <el-button type="text" class="black-btn" @click="informatonEven(scope.row,'edit')">修改</el-button>                                   
                                </el-col>   
                                <el-col :span="12" v-if="$authJudge('applat:matching:del')">
                                    <el-button type="text" class="black-btn" @click="informatonEven(scope.row,'delete')">删除</el-button>
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
            title=""
            :visible.sync="pragramLIstDialog"
            width="400px"
            class="courseDialogCss"
            :show-close="true"
            :close-on-click-modal="false"
            center>
                <div style="text-align: center;width:100%;">
                    {{MessageText}}
                </div>            
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="pragramLIstDialogEven" v-show="MessageText.indexOf('诗词')==-1">确 定</el-button>
                    <el-button @click="pragramLIstDialog=false">取 消</el-button>
                </span>         
        </el-dialog>                                   
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){                                         
        return {
            title:'',
            value:'',
            loading:false,
            pragramLIstDialog:false,
            MessageText:'',
            tableData:[
                {
                    sortId:1,
                    poetryContent:{
                        name:'新秋夜寄诸弟',
                        one:'两地俱秋夕,',
                        two:'相望共星河。',
                        three:'高梧一叶下,',
                        four:'空斋归思多。'
                    },
                    courseName:'唐诗三百首',
                    specialDate:'2019-12-01s',
                    programType:1
                },
                {
                    sortId:2,
                    poetryContent:'新秋夜寄诸弟两地俱秋夕,相望共星河高梧一叶下空斋归思多。',
                    courseName:'唐诗三百首',
                    specialDate:'2019-12-01s',
                    programType:2
                }                
            ],
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            },
            pageNo:1,
            pageSize:10,            
            titleList:[
                {
                    name:'小程序',
                    pathInfo:''
                },                
                {
                    name:'课程匹配',
                    pathInfo:''
                }               
            ],
            selectData:''
        }
    },
    created(){
        if(this.environmenttarget=='prod'){
            this.urlScienceBools = 1;
        }else if(this.environmenttarget=='beta'){
            this.urlScienceBools = 2;
        }else{
            this.urlScienceBools = 1;
        };        
        this.getProgramList(1);
    },
    computed: {
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }
    },    
    components:{
        breadcrumb
    },    
    methods:{  
        pragramLIstDialogEven(){
            this.deleteProgramList();
        },
        informatonEven(data,state){
            this.selectData = data;
            switch (state) {
                case 'edit':
                    this.$router.push({path: "/smallProgram/creatProgram",query:{addOrEdit:'edit',dataInfo:data}});
                    break;
                case 'add':
                    this.$router.push({path: "/smallProgram/creatProgram",query:{addOrEdit:'add'}});
                    break; 
                case 'delete':
                    this.MessageText = '确定删除本匹配课程吗?';
                    this.pragramLIstDialog=true;
                    break;                                                                  
                default:
                    break;
            }
        },
        //删除当前列表;
        deleteProgramList(){
            this.$http.post(this.$server.courseMatchingDel({id:this.selectData.id})).then(res=>{
               if(res.status==200){
                   this.pragramLIstDialog = false;
                   if(this.tableData.length==1&&this.pageNo!=1){
                        this.getProgramList((Number(this.pageNo)-1));
                   }else{
                        this.getProgramList();
                   }
               }
            });            
        },
        //获取列表信息；
        getProgramList(num){
            var self = this;    
            if(self.title!=''){
                if(self.regularState(self.title)){
                    self.tableData = [];
                    self.pageAtion.pageTotal = 0;
                    self.pageAtion.paginationPage = 0;                
                    return;
                }
            }        
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            var params = {
                searchContent:self.title,
                pageNo:self.pageNo,
                pageSize:self.pageSize
            };
            self.$http.get(self.$server.courseMatchingGetPage(params)).then(res=>{
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
        },
        //特殊符号过滤
        regularState(data){
            var regEn = new RegExp("[`~!@#$^&*%()=|{}':;'\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；《》：”“'。，,.、？]"),
                reg = /^(?!.*\\.*$)/,
                reg1 = /^(?!.*\/\.*$)/;
                if(regEn.test(data)||!reg.test(data)||!reg1.test(data)){   
                    return true;
                }else{
                    return false;
                }
        },        
        findInfo(){
            this.getProgramList(1);
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getProgramList(Number(num))
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
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }
.programTexte{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;    
}
</style>


