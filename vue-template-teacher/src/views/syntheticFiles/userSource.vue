<template>
    <div>        
        <el-row class="lLine40 headerDiv">
            <!-- <el-col class="lLeft-r lSize18">来源管理</el-col> -->
            <el-col :span="18">
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
            </el-col>            
            <el-col>
                <el-row :gutter="10">
                    <el-col :span="4" class="lCenter-r">
                                <el-select v-model="statusValue" placeholder="请选择">
                                    <el-option
                                    v-for="item in optionStatus"
                                    :key="item.id"
                                    :label="item.originName"
                                    :value="item.id">
                                    </el-option>
                                </el-select>  
                    </el-col>
                    <el-col :span="2" v-if="$authJudge('user:origin:select')"><el-button class="redBackColor butColorF" @click="seach">查询</el-button></el-col>
                    <el-col :span="18" style="text-align: right;">
                        <el-button v-if="$authJudge('user:origin:add')" class="redBackColor butColorF" @click="channeRecord(null,false)">添加来源</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
             <el-col>
                <el-table
                :data="getWithdrawListData"
                border
                v-loading="loading"
                style="width: 100%">
                <el-table-column
                    prop="sortId"
                    align="center"
                    label="序号"
                    min-width="110"
                    :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                    prop="originName"
                    align="center"
                    label="来源名称"
                    min-width="130"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="id"
                    align="center"
                    label="来源名称ID"
                    min-width="60"
                    show-overflow-tooltip>
                </el-table-column>                
                <el-table-column
                    prop="userCount"
                    align="center"
                    min-width="80"
                    label="用户数量"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="creatorName"
                    align="center"
                    label="创建人"
                    min-width="80">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    label="创建时间"
                    min-width="120"
                    show-overflow-tooltip>
                </el-table-column>             
                <el-table-column
                    align="center"
                    label="操作"
                    min-width="100">
                        <template slot-scope="scope">
                            <el-row :gutter="10"> 
                                <el-col :span="8" v-if="$authJudge('finance:record')">
                                    <el-button type="text" v-if="$authJudge('user:origin:update')" class="black-btn" @click="channeRecord(scope.row,true)">编辑</el-button>
                                </el-col>                                                                                                                            
                                <el-col :span="8" v-if="$authJudge('user:origin:delete')">
                                    <el-button type="text" class="black-btn" @click="channeRemoveBatch(scope.row)">删除</el-button>
                                </el-col>
                            </el-row>                                                      
                        </template>                    
                </el-table-column>                                                
                </el-table>                 
             </el-col>
            <el-col class="block">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="childPageValue"
                    :current-page.sync="pageAtion.paginationPage"
                    :total="pageAtion.pageTotal">
                </el-pagination>
            </el-col>             
        </el-row>
        <el-dialog
        :visible.sync="centerDialogReject"
        :close-on-click-modal='false'
        :show-close="false"
        max-height="300"
        width="35%">  
            <el-row class="lSize16 lCenter-r">
                <el-col>
                    <el-input
                    type="text"
                    :rows="5"
                    placeholder="请输入内容"
                    :maxlength="8"
                    @keyup.native="proving"
                    v-model="textareaReject">
                    </el-input>                    
                </el-col>
                <el-col class="lMarginTop30">
                    <el-row>
                        <el-col :span="4" class="lCenter-r" :offset="7">
                            <el-button @click="allDialogIsNo">取消</el-button>
                        </el-col>  
                        <el-col :span="4" class="lCenter-r" :offset="1">
                            <el-button class="redBackColor butColorF" @click="examineIsOkReject">确定</el-button>
                        </el-col>
                    </el-row>                    
                </el-col>
            </el-row>
        </el-dialog>  
        <el-dialog
        :visible.sync="deleteDiloge"
        :close-on-click-modal='false'
        :show-close="false"
        max-height="300"
        width="35%">  
            <el-row class="lSize16 lCenter-r">
                <el-col>
                    确定删除？                  
                </el-col>
                <el-col class="lMarginTop30">
                    <el-row>
                        <el-col :span="4" class="lCenter-r" :offset="7">
                            <el-button @click="channeRemoveType(false)">取消</el-button>
                        </el-col>  
                        <el-col :span="4" class="lCenter-r" :offset="1">
                            <el-button class="redBackColor butColorF" @click="channeRemoveType(true)">确定</el-button>
                        </el-col>
                    </el-row>                    
                </el-col>
            </el-row>
        </el-dialog>                                      
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){                     
        return {
        getWithdrawListData: [],
        //1:待审核，2:已审核,3:已驳回,4:已过期
        optionStatus:[],
        statusValue: '',
        textareaReject:'',
        pageAtion:{
            pageTotal:0,
            paginationPage:1
        },      
        pageSize:10,
        pageNo:1,
        centerDialogReject:false,
        deleteDiloge:false,
        listInfoData:'',
        loading:false,
        disabledState:false,
        titleList:[
            {
                name:'用户管理系统',
                pathInfo:''
            },
            {
                name:'管理来源',
                pathInfo:''
            }                                               
        ]   
        }
    },
    components:{
        breadcrumb
    },
    created(){       
        this.getWithdrawList(1);
        this.getSourceNameList();
    },    
    methods:{   
        getSourceNameList(){
            this.$http.get(this.$server.useroriginGetAllOrigin).then(res=>{
                if(res.status==200){
                    this.optionStatus = res.content;
                }
            })             
        },  
        proving(){
            var reg = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/;
            if(!reg.test(this.textareaReject)){
                this.textareaReject='';
            }              
        },
        getWithdrawList(num){
            if(num){
                this.pageNo = num;
            }            
            var parems = {
                pageSize:this.pageSize,
                pageNo:this.pageNo,
                id:this.statusValue||""
            };
            this.loading = true; 
            this.$http.get(this.$server.useroriGingetPageList(parems)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   this.allCodeReactListNum = contentdate.total;
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
                    this.getWithdrawListData = listIds;
                    this.pageAtion.pageTotal = contentdate.total;
                    this.pageAtion.paginationPage = num;
                    this.loading = false; 
               }
                console.log(res);
            }).catch((err)=>{
                this.loading=false;
            }); 
        },
        seach(){
            this.getWithdrawList(1);
        },
        examineIsOkReject(num){
                this.rejectAjax(num);
        },
        //确定添加/编辑
        rejectAjax(num){
            var self = this;
            let parems = {};
            var url = '';
            if(this.listInfoData){
                parems = {
                    id:this.listInfoData.id,
                    originName:this.textareaReject
                };                
                url = this.$server.updateUserorigin;
            }else{
                parems = {
                    originName:this.textareaReject
                };                
                url = this.$server.addUserorigin;
            }
            if(!this.disabledState){
                this.disabledState = !this.disabledState;
                this.$http.post(url,parems).then(res=>{
                    if(res.status==200){
                        self.centerDialogReject = false;
                        thisimgListNext.disabledState = !this.disabledState;
                        this.getWithdrawList(1);
                    }
                }).catch(()=>{
                    self.disabledState = !self.disabledState;
                })                              
            }                       
        },
        channeRecord(data,type){
            this.centerDialogReject = true;
            this.listInfoData = data;
            if(type){
                this.textareaReject = data.originName; 
            }else{
                this.textareaReject = ''; 
            }
        },
        channeRemoveType(bools){
            var self = this;
            if(bools){
                var parems = {
                    id:self.listInfoData.id,
                };
                self.$http.post(self.$server.deleteUserorigin,parems).then(res=>{
                    if(res.status==200){
                        this.deleteDiloge=false;
                        this.listInfoData = '';
                        this.getWithdrawList(1);
                    }
                })
            }else{
                 this.deleteDiloge=false;
                 this.listInfoData = '';
            }
              
        },
        channeRemoveBatch(data){
            this.listInfoData = data;
            this.deleteDiloge=true;
        },
        childPageValue(num){
           if(Number(num)>0){
                this.getWithdrawList(Number(num))
            } 
        },    
        //待审核
        allDialogIsNo(){
            this.textareaReject = '';
            this.centerDialogReject = false;
        }   
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
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
</style>
<style>
/* body .el-table th.gutter {
    display: table-cell !important
} */
</style>

