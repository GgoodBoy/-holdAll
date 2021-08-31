<template>
    <div>        
        <el-row class="lLine40 headerDiv">
            <el-col class="lLeft-r lSize18">闪屏管理</el-col>
            <el-col>
                <el-row>
                    <el-col :span="20" class="layoutFlex">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                    placeholder="输入闪屏标题查询"
                                    class="search-form"
                                    width="100%"
                                    maxlength="20"
                                    clearable
                                    ></el-input>
                        </div>
                        <div>
                            <el-date-picker
                            v-model="dataStart"
                            type="datetime"
                            placeholder="年/月/日/时/分/秒">
                            </el-date-picker>                            
                        </div>  
                        <div>
                             <!-- v-if="$authJudge('flash.select')" -->
                            <el-button v-if="$authJudge('flash:select')" class="redBackColor butColorF" @click="seach">查询</el-button>
                        </div>                                              
                    </el-col>
                    <!-- v-if="$authJudge('flash.save')" -->
                    <el-col :span="4" v-if="$authJudge('flash:save')" class="lRight-r"><el-button  class="redBackColor butColorF" @click="reviseOrCreated('')">新建闪屏广告</el-button></el-col>
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
                    show-overflow-tooltip>
                </el-table-column>                
                <el-table-column
                    prop="title"
                    align="center"
                    label="标题"
                    min-width="110"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :class="{'redFontColor':scope.row.status==1}">{{scope.row.title}}</span>                                                     
                    </template>                    
                </el-table-column>    
                <el-table-column
                    prop="creatorName"
                    align="center"
                    label="创建人"
                    min-width="130"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="onlineTime"
                    align="center"
                    label="上线时间"
                    min-width="130"
                    show-overflow-tooltip>
                </el-table-column>                
                <el-table-column
                    prop="offlineTime"
                    align="center"
                    label="下线时间"
                    min-width="130"
                    show-overflow-tooltip>
                </el-table-column>  
                <el-table-column
                    align="center"
                    label="类型"
                    min-width="130"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-row> 
                            <!-- 1:待审核，2:已审核,3:已驳回,4:已过期 -->
                            <el-col v-if="scope.row.targetType==1">
                                链接
                            </el-col>    
                            <el-col v-else-if="scope.row.targetType==2">
                                课程
                            </el-col>  
                            <el-col v-else-if="scope.row.targetType==3">
                                活动
                            </el-col>
                            <el-col v-else-if="scope.row.targetType==4">
                                无链接
                            </el-col>                                                                                              
                        </el-row>                                                      
                    </template>
                </el-table-column>                              
                <el-table-column
                    prop="clickNum"
                    align="center"
                    label="点击"
                    min-width="80">
                </el-table-column>               
                <el-table-column
                    fixed="right"
                    align="center"
                    label="操作"
                    min-width="120">
                        <template slot-scope="scope">
                            <el-row :gutter="10">    
                                <el-col :span="8" class="lCenter-r">
                                    <!-- v-if="$authJudge('flash.update')" -->
                                    <el-button type="text" v-if="$authJudge('flash:update')" class="black-btn" @click="reviseOrCreated(scope.row)">修改</el-button>
                                </el-col>                                                                                                                            
                                <!-- <el-col :span="8" class="lCenter-r">
                                    <el-button type="text" class="black-btn" v-if="$authJudge('flash:clicknum')" @click="numberOfHits(scope.row)">点击数</el-button>
                                </el-col>                                                                                                                             -->
                                <el-col :span="8" class="lCenter-r">
                                    <!-- v-if="$authJudge('flash.delete')" -->
                                    <el-button type="text" v-if="$authJudge('flash:delete')&&scope.row.status==0" class="black-btn" @click="channeRemoveBatch(scope.row)">删除</el-button>
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
        <el-dialog class="dialogCourse" :visible.sync="courseselectPluginDialog" 
                    width="30%"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :show-close="false"> 
                    <div class="courseFlexBox">
                        <el-container>
                            <el-main>
                                <el-table
                                :data="getAdvertsListData"
                                border
                                v-loading="loading1"
                                style="width: 100%">                
                                    <el-table-column
                                        prop="title"
                                        align="center"
                                        label="名称"
                                        min-width="110"
                                        show-overflow-tooltip>                 
                                    </el-table-column>               
                                    <el-table-column
                                        align="center"
                                        label="类型"
                                        min-width="130"
                                        show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <el-row> 
                                                <!-- 1:待审核，2:已审核,3:已驳回,4:已过期 -->
                                                <el-col v-if="scope.row.targetType==1">
                                                    链接
                                                </el-col>    
                                                <el-col v-else-if="scope.row.targetType==2">
                                                    课程
                                                </el-col>  
                                                <el-col v-else-if="scope.row.targetType==3">
                                                    活动
                                                </el-col>
                                                <el-col v-else-if="scope.row.targetType==4">
                                                    无链接
                                                </el-col>                                                                                              
                                            </el-row>                                                      
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        align="center"
                                        label="点击数"
                                        min-width="130"
                                        show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            {{scope.row.clickNum||0}}                                                     
                                        </template>                                        
                                    </el-table-column>
                                </el-table>
                            </el-main>
                            <el-footer>
                                <el-row>
                                    <el-col style="text-align:center;margin-top:20px">
                                        <el-button style="background-color:#B4272D;color:#ccc" @click="closeCourseList">确定</el-button>
                                    </el-col>                    
                                </el-row>
                            </el-footer>
                        </el-container>
                    </div>
        </el-dialog>        
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data(){                     
        return {
          title:'',
            getWithdrawListData: [],
            getAdvertsListData:[],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            }, 
            dataStart:'',    
            pageSize:10,
            pageNo:1,        
            dialogTitleNanme:'',
            loading:false, 
            loading1:false,
            courseselectPluginDialog:false
        }
    },
    created(){      
        this.getWithdrawList(1);
    },    
    methods:{  
        numberOfHits(data){
            var self = this;
            self.courseselectPluginDialog = true;
            self.loading1=true;
            self.$http.get(self.$server.flashAdvertisingClickNum+data.id).then(res=>{
               if(res.status==200){
                   self.loading1=false;
                   self.getAdvertsListData = res.content;
               }
            }).catch(()=>{
                self.loading1=false;
            })  
        },
        closeCourseList(){
            this.courseselectPluginDialog = false;
        },
        formatDate(date){
            if(date){
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                var h=date.getHours();
                var m1=date.getMinutes();
                var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;
                    h = h<10?("0"+h):h;
                    m1 = m1<10?("0"+m1):m1;
                    s = s < 10 ? ("0" + s) : s;
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
            }
        },           
        getWithdrawList(num){
           var self = this;
            if(num){
                self.pageNo = num;
            }            
            var parems = {
                pageSize:self.pageSize,
                pageNo:self.pageNo,
                title:self.title,
                createdAt:self.formatDate(Number(self.dataStart))||''
            };
            self.loading = true; 
            self.$http.get(self.$server.getFlashAdvertisingList(parems)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   self.allCodeReactListNum = contentdate.total;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = contentdate.total-index;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = contentdate.total-prePage*10-index;
                                return element;
                            });                            
                        } 
                   }; 
                    self.getWithdrawListData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loading = false; 
               }
            }).catch((err)=>{
                self.loading=false;
            }); 
        },
        seach(type){
            this.getWithdrawList(1);
        },
        reviseOrCreated(data){
            if(data!=''){
                this.$router.push({path: '/advertNew',query: {id: data.id}});
            }else{
                this.$router.push('/advertNew');
            }
            
        },
        channeRemoveBatch(data){
           var self = this; 
            var parems = {
                id:data.id
            };           
            self.$http.post(self.$server.deleteFlash,parems).then(res=>{
               if(res.status==200){
                   if(self.getWithdrawListData.length>1&&self.pageAtion.pageTotal>self.pageSize){
                       this.getWithdrawList(self.pageAtion.paginationPage);
                   }else if(self.getWithdrawListData.length==1&&self.pageAtion.pageTotal>self.pageSize){
                       this.getWithdrawList(self.pageAtion.paginationPage-1);
                   }else{
                       this.getWithdrawList(1);
                   }
               }
            }).catch((err)=>{
                self.loading=false;
            });             
        },
        childPageValue(num){
           if(Number(num)>0){
                this.getWithdrawList(Number(num))
            } 
        }
    },
    components:{},
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
    .layoutFlex{
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        div{
            margin-right: 10px;
        }
    }
body .el-table th.gutter {
    display: table-cell !important
}
</style>


