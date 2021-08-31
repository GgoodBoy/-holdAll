<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col class="lSize18">
                <el-row class="lSize16">
                    <el-col :span="8" class="lLeft-r">
                        <!-- <span>积分管理</span>/
                        <span>积分查询</span> -->
                        <breadcrumb :menuList ='titleList'></breadcrumb>
                    </el-col>
                </el-row>
            </el-col>
            <el-col class="lRight-r">
                <el-row :gutter="20">
                     <el-col :span="6">
                        <div class="iSeachEven">
                            <!--   -->
                            <el-input v-model.trim="title"
                                    placeholder="  输入用户手机号或昵称查询"
                                    class="search-form"
                                    width="100%"
                                    @keyup.native="proving1"
                                    clearable
                                    ></el-input>
                        </div>
                    </el-col>
                    <el-col :span="3">
                        <el-select v-model="courseStatus"
                                clearable
                                placeholder="状态">
                            <el-option v-for="item,i in courseStatusList"
                                    :key="i"
                                    :label="item.name"
                                    :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2" v-if="$authJudge('integral:select:select')"><el-button class="redBackColor butColorF"  @click="search">查询</el-button></el-col>
                    <el-col :span="13" style="text-align: right;" v-if="$authJudge('integral:select:export')"><el-button class="redBackColor butColorF"  @click="exportAll">导出</el-button></el-col>
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
                        prop="phone"
                        label="用户账户"
                        align="center"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="nickName"
                        label="用户昵称"
                        align="center"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="状态"
                        align="center"
                        min-width="40"
                        >
                        <template slot-scope="scope">
                                <el-row>
                                    <el-col v-if="scope.row.status==1">
                                        禁用
                                    </el-col>
                                    <el-col v-else>
                                        可用
                                    </el-col>
                                </el-row>
                            </template>
                    </el-table-column>
                    <el-table-column
                        prop="totalIntegral"
                        label="用户积分"
                        align="center"
                        min-width="50">
                    </el-table-column>
                    <el-table-column
                        prop="noUsedIntegral"
                        label="未到账积分"
                        align="center"
                        min-width="50">
                    </el-table-column>
                    <el-table-column
                        prop="usedIntegral"
                        label="可用积分"
                        align="center"
                        min-width="50">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="40"
                        >
                        <template slot-scope="scope">
                            <el-row>
                                <el-col :span="12" :offset="6" v-if="$authJudge('integral:select:detailed')">
                                    <el-button type="text" class="black-btn" @click="channeUpdateEven(scope.row)">查看</el-button>
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
        :visible.sync="centerDialogVisible"
        title=""
        max-height="300"
        width="50%">
            <el-row v-if="dialogBool">
                <el-col class="lCenter-r">积分明细</el-col>
                <el-col class="lMarginTop20">
                        <el-table
                        :data="tableDataNext"
                        style="width: 100%"
                        border
                        :height="300">
                        <el-table-column
                            prop="integralOperationTypeName"
                            label="来源"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            prop="createdAt"
                            label="时间"
                            min-width="160">
                        </el-table-column>
                        <el-table-column
                            min-width="120"
                            label="获得积分">
                            <template slot-scope="scope">
                                {{scope.row.type==2?'-'+scope.row.num:'+'+scope.row.num}}
                            </template>
                        </el-table-column>
                        </el-table>
                </el-col>
                <el-col class="lMarginTop30 lCenter-r">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValueNext"
                        :current-page.sync="pageAtionNext.paginationPage"
                        :total="pageAtionNext.pageTotal">
                    </el-pagination>
                </el-col>
            </el-row>
            <el-row  v-if="!dialogBool">
                <el-col class="lMarginTop30 lCenter-r">
                    当前详情列表无数据!
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
            tableData: [],
            tableDataNext:[],
            pageNo:1,
            pageNoDetail:1,
            pageSize:10,
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            pageAtionNext:{
                pageTotal:0,
                paginationPage:1
            },
            centerDialogVisible: false,
            channelIDs:"",
            title:'',
            courseStatus:'',
            titleList:[
                        {
                            name:'积分',
                            pathInfo:''
                        },
                        {
                            name:'积分查询',
                            pathInfo:''
                        }
                ],
            courseStatusList:[
                {
                    name:"全部",
                    value:-1
                },
                {
                    name:"正常",
                    value:0
                },
                {
                    name:"禁用",
                    value:1
                }
            ],
            dialogBool:false,
            loading:true
        }
    },
    created(){
        this.getStudylist(1);
    },
    methods:{
        proving1(){
            // this.title=this.title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'');
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.title)){
                this.title='';
            }
        },
        channeUpdateEven(rows){
            var self = this;
            self.channelIDs = rows.userId;
            self.queryDeatilList(1);
            self.centerDialogVisible = true;
        },
        //继续查询详情
        queryDeatilList(num){
            var self = this;
            if(num){
                self.pageNoDetail = num;
            }
            var params = {
                pageNo:self.pageNoDetail,
                userId:self.channelIDs,
                pageSize:self.pageSize
            };
            self.$http.get(self.$server.integralRecord(params)).then(res=>{
               if(res.status==200){
                   if(res.content.list.length>0){
                    self.dialogBool = true;
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
                        self.tableDataNext = listIds;
                        console.log(this.tableDataNext)
                        self.pageAtionNext.pageTotal = contentdate.total;
                        self.pageAtionNext.paginationPage = num;
                   }else{
                       self.dialogBool = false;
                   }
               }
                console.log(res);
            })
        },
        //搜索
        search(){
            this.getStudylist(1);
        },
        //创建学习卡
        creatlearnCard(){
            this.getStudylist(1);
        },
        getStudylist(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true;
            var params = {
                keyword:self.title,
                pageNo:self.pageNo,
                status:self.courseStatus,
                pageSize:self.pageSize
            };
            self.$http.get(self.$server.integralUserQuery(params)).then(res=>{
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
            })
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        },
        childPageValueNext(num){
            if(Number(num)>0){
                this.queryDeatilList(Number(num))
            }
        },
        exportAll(){
            var self = this;
            var url = self.$server.exportIntegral+"?token="+getToken();
            window.open(url);
        }
    },
    components:{
        breadcrumb
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
.headerDiv .search-form {
        // width: 240px;
        // margin-right: 60px;
        position: relative;
        &.el-icon-search:before {
            position: absolute;
            font-size: 18px;
            right: 10px;
            top: 10px;
            background: #fff;
            font-weight: 900;
        }
    }
.headerDiv .iSeachEven{
    width: 100%;
    position: relative;
}
.headerDiv .iSeachEven i{
    position: absolute;
    right: 8px;
    font-size: 18px;
    top: 12px;
    cursor: pointer;
}
.iSeachEvenSun{
    width: 25%;
    position: relative;
    margin-bottom: 20px;
}
.iSeachEvenSun i{
    position: absolute;
    right: 8px;
    font-size: 18px;
    top: 12px;
    cursor: pointer;
}
.iSeachEvenSun .search-form-sun{
        position: relative;
        &.el-icon-search:before {
            position: absolute;
            font-size: 18px;
            right: 10px;
            top: 10px;
            background: #fff;
            font-weight: 900;
        }
}
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }
.black-btn-ok{
    color:#9E0E00 !important;
}
.black-btn-no{
    color: #cccccc !important;
}
</style>


