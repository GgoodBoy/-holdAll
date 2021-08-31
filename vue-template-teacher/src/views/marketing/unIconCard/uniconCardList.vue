<template>
    <div>
        <div class="page-header">
            <el-row>
                <el-col :span="12">
                     <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
                <el-col :span="2" :offset="10" v-if="$authJudge('market:monthmember:add')">
                    <el-button type="primary"  @click="creatCardData">创建会员卡</el-button>
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
                        prop="memberName"
                        label="名称"
                        min-width="150"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="buyNum"
                        label="已购买"
                        align="center"
                        min-width="50"
                        :show-overflow-tooltip="true">
                    </el-table-column>     
                    <el-table-column
                        prop="creatorName"
                        label="创建人"
                        align="center"
                        min-width="80"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="createdAt"
                        label="创建时间"
                        align="center"
                        min-width="120"
                        >
                    </el-table-column>       
                    <el-table-column
                        prop="gradeName"
                        label="售价"
                        align="center"
                        min-width="60"
                        >
                        <template slot-scope="scope"> 
                            <div class="btn-box">
                                安卓:{{scope.row.androidPrice}}
                            </div>      
                            <div class="btn-box">
                                ios:{{scope.row.iosPrice}}
                            </div>                                                                     
                        </template>                         
                    </el-table-column> 
                    <el-table-column
                        label="状态"
                        align="center"
                        min-width="60">
                        <template slot-scope="scope"> 
                            <div class="btn-box">
                                {{scope.row.state==1?'上线':'下线'}}
                            </div>                                              
                        </template>                        
                    </el-table-column>                                                     
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="160">
                            <template slot-scope="scope"> 
                                <el-row>
                                    <el-col :span="6">
                                        <el-button type="text" v-if="$authJudge('market:monthmember:edit')" class="black-btn" @click="channeUpdateEven(scope.row,1)">编辑</el-button>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button type="text" v-if="$authJudge('market:monthmember:down')&&scope.row.state==1" class="black-btn" @click="channeUpdateEven(scope.row,2)">下线</el-button>
                                        <el-button type="text" v-if="$authJudge('market:monthmember:up')&&scope.row.state==2" class="black-btn" @click="channeUpdateEven(scope.row,2)">上线</el-button>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button type="text"  v-if="$authJudge('market:monthmember:selectEquity')" class="black-btn" @click="channeUpdateEven(scope.row,6)">添加权益</el-button>
                                    </el-col>                                    
                                    <el-col :span="6">
                                        <el-button type="text" v-if="$authJudge('market:monthmember:detailpage')" class="black-btn" @click="channeUpdateEven(scope.row,3)">查看</el-button>
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
            </div>
        </div>
        <el-dialog
        :visible.sync="centerDialogVisible"
        width="60%"
        center>
                <el-table
                    border
                    :data="tableDataNext"
                    v-loading="loadingNext"
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
                        label="订购账户"
                        align="center"
                        min-width="150"
                        :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="购买时间"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>                                                 
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValueNext"
                        :current-page.sync="pageAtionNext.paginationPage"
                        :total="pageAtionNext.pageTotal">
                    </el-pagination>
                </div>  
        </el-dialog>
        <el-dialog
        :visible.sync="equityDialogVisible"
        width="60%"
        center>
            <el-row>
                <el-col style="text-align: right">
                    <el-button type="primary"  @click="equityDataList">添加</el-button>
                </el-col>
                <el-col style="margin-top:20px;">
                    <el-table
                        border
                        :data="tableDataThree"
                        style="width: 100%">
                            <el-table-column
                                prop="sortId"
                                label="序号"
                                align="center"
                                min-width="40"
                                :show-overflow-tooltip="true">
                            </el-table-column> 
                            <el-table-column
                                prop="channelName"
                                label="类型"
                                align="center"
                                min-width="150"
                                :show-overflow-tooltip="true">
                            </el-table-column>
                            <el-table-column
                                prop="validityTime"
                                label="时间"
                                align="center"
                                min-width="150"
                                >
                            </el-table-column>                                                 
                    </el-table>
                    <div class="block">
                        <el-pagination
                            background
                            layout="prev, pager, next"
                            @current-change="childPageValueThree"
                            :current-page.sync="pageAtionThree.paginationPage"
                            :total="pageAtionThree.pageTotal">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>  
        </el-dialog>        
        <el-dialog
            :visible.sync="insertDialogVisible"
            width="25%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            center>
            <el-row style="text-align: center;">
                <el-col>
                    {{selectData.state==1?'确定要下线这个会员卡吗？':'确定要上线线这个会员卡吗？'}}
                </el-col>
                <el-col style="margin-top:20px;">
                    <el-button type="primary"  @click="channeUpdateEven(selectData,5)">取消</el-button>
                    <el-button type="primary"  @click="channeUpdateEven(selectData,4)">确定</el-button>
                </el-col>
            </el-row>
        </el-dialog>    
        <el-dialog
            :visible.sync="courseDialogVisible"
            width="25%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            center>
            <div class="dialog-content">
                <div class="dialog-select">
                    <div>选择课程:</div>
                    <div style="margin-left:10px;">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.validityTime"
                            :value="item.id">
                            </el-option>
                        </el-select>                        
                    </div>
                </div>
                <div style="margin-top:20px;">
                    <el-button type="primary"  @click="channeUpdateEven('',7)">取消</el-button>
                    <el-button type="primary"  @click="channeUpdateEven('',8)">确定</el-button>                    
                </div>
            </div>
        </el-dialog> 
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
            pageNoNext:1,
            pageSize:10,
            pageNo3:1,
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            },   
            pageAtionNext:{
                paginationPage:1,
                pageTotal:0
            },   
            pageAtionThree:{
                paginationPage:1,
                pageTotal:0
            },                               
            total:10,
            tableData:[],
            tableDataNext:[],
            tableDataThree:[],
            loading:false,
            loadingNext:false,
            titleList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'月度会员卡定制系统',
                            pathInfo:''
                        }
                ],            
            //学校id
            schoolId:'',
            centerDialogVisible: false,
            insertDialogVisible: false,
            equityDialogVisible:false,
            courseDialogVisible:false,
            seeId:'',
            selectData:'',
            value: '',
            options: [],
            loading:true            
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
        creatCardData(){
            var self = this;  
            // this.$router.push('/member/unIconCard')
            this.$router.push({
                path:'/marketelist/member/unIconCard',
                query: {
                    addOrEdit:'add'
                }                         
            });            
        },          
        childPageValue(num){
            if(Number(num)>0){
                this.getSchoolList(Number(num))
            }            
        },    
        childPageValueNext(num){
            var self = this;
            if(Number(num)>0){
                this.childrenListData(self.seeId,Number(num))
            }            
        },
        childPageValueThree(num){
            var self = this;
            if(Number(num)>0){
                this.getEquityList(Number(num))
            }            
        },      
        equityDataList(){   
            this.courseDialogVisible = true;
            this.value = '';
            this.$http.get(this.$server.getUnicomBagListUnicom).then(res=>{
                if(res.status==200){
                   this.options = res.content;
                }
            })                     
        },   
        equityDataAdd(){   
            let params = {
                monthMemberId:this.selectData.id,
                unicomBagId:this.value
            };
            this.$http.post(this.$server.addEquityUnicom,params).then(res=>{
                if(res.status==200){
                    this.courseDialogVisible = false;
                    this.$message.success('添加成功。');
                    this.getEquityList(1);
                }
            })                     
        },           
        channeUpdateEven(data,type){
            var self= this;
             switch (type) {
                 case 1:
                    self.$router.push({
                        path:'/marketelist/member/unIconCard',
                        query: {
                            id: data.id,
                            addOrEdit:'edit',
                            data:data
                        }                         
                    });
                    break;
                 case 2:
                    self.insertDialogVisible = true;
                    self.selectData = data;                      
                    break;
                 case 3:
                     self.centerDialogVisible = true;
                     self.selectData = data;
                     self.childrenListData(data.id,1);
                     break;       
                 case 4:
                    self.insertDialogVisible=false;
                    if(data.state==1){
                        var url=self.$server.downMonthMember({id:data.id})
                    }else{
                        var url = self.$server.upMonthMember({id:data.id});
                    }
                    self.$http.post(url).then(res=>{
                        if(res.status==200){
                            self.$message.success(data.state==1?'已下线':'已上线');
                            self.getSchoolList(1);
                        }
                    });                  
                    break;  
                 case 5:
                    self.insertDialogVisible=false;
                    break;     
                 case 6:
                    self.equityDialogVisible=true;
                    self.selectData = data; 
                    self.getEquityList(1);
                    break;    
                 case 7:
                    self.courseDialogVisible = false;
                    break;      
                 case 8:
                    self.courseDialogVisible = false;
                    self.equityDataAdd();
                    break;                                                                     
                 default:
                     break;
             }
         },  
         getEquityList(num){
            var self = this;
            self.loading = false;
            if(num){
                self.pageNo3 = num;
            }            
            let params = {
                pageNo:this.pageNo3,
                pageSize:this.pageSize,
                id:self.selectData.id
            }
            this.$http.get(this.$server.getEquityPageMonthMember(params)).then(res=>{
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
                    self.tableDataThree = listIds;
                    self.pageAtionThree.pageTotal = contentdate.total;
                    self.pageAtionThree.paginationPage = self.pageNo3;
                    self.loading = false;
                }
            })             
         },
         //查看列表信息
         childrenListData(id,num){
            var self = this;
            self.loadingNext = true;
            self.seeId = id;
            if(num){
                self.pageNoNext = num;
            }            
            let params = {
                pageNo:this.pageNoNext,
                pageSize:this.pageSize,
                id:id
            }
            this.$http.get(this.$server.getDetailMonthMember(params)).then(res=>{
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
                    self.tableDataNext = listIds;
                    self.pageAtionNext.pageTotal = contentdate.total;
                    self.pageAtionNext.paginationPage = self.pageNoNext;
                    self.$nextTick(function(){
                        self.loadingNext = false; 
                    }) 
                }
            })             
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
                pageSize:this.pageSize
            }
            this.$http.get(this.$server.getPageMonthMember(params)).then(res=>{
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
        // .block{
        //     text-align: center;
        //     margin-top:60px;
        //     padding-bottom:60px;
        // }
    }
    .block{
        text-align: center;
        margin-top:30px;
        padding-bottom:30px;
    }    
</style>
<style>
/* body .el-table th.gutter {
    display: table-cell !important
} */

.dialog-content{
    width: 300px;
    height: 200px;
    background: #fff;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
}
.dialog-content .dialog-select{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>


