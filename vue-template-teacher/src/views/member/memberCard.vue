<template>
    <div>
        <div  v-if="!seeRecordlist">           
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
                                <!-- @keyup.native="proving1" -->
                                <el-input v-model.trim="title"
                                        placeholder="输入会员卡名称查询"
                                        class="search-form"
                                        width="100%"
                                        maxlength="16"
                                        clearable
                                        ></el-input>
                            </div>
                        </el-col> 
                        <el-col :span="3">
                            <el-row>
                                <el-col :span="8" class="lCenter-r" style="fontSize:14px">类型</el-col>  
                                <el-col :span="16">                          
                                    <el-select v-model="memberType"
                                            clearable
                                            placeholder="类型">
                                        <el-option v-for="item,i in courseTypeList"
                                                :key="i"
                                                :label="item.name"
                                                :value="item.value"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>                            
                        </el-col>                    
                        <el-col :span="3">
                            <el-row>
                                <el-col :span="8" class="lCenter-r" style="fontSize:14px">状态</el-col>
                                <el-col :span="16">
                                    <el-select v-model="memberStatus"
                                            clearable
                                            placeholder="状态">
                                        <el-option v-for="item,i in courseStatusList"
                                                :key="i"
                                                :label="item.name"
                                                :value="item.value"></el-option>
                                    </el-select>                                    
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="2" v-if="$authJudge('market:member:select')"><el-button class="redBackColor butColorF"  @click="searchMemberCard(1)">查询</el-button></el-col>
                        <el-col :span="4" :offset="6" v-if="$authJudge('market:member:add')"><el-button class="redBackColor butColorF"  @click="openMemberType">生成会员卡</el-button></el-col>
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
                            prop="name"
                            :show-overflow-tooltip="true"
                            label="名称"
                            align="center"
                            min-width="100">
                        </el-table-column>
                        <el-table-column
                            label="类型"
                            align="center"
                            min-width="50">
                            <template slot-scope="scope">
                                    <el-row> 
                                        <el-col class="lCenter-r"> 
                                            <p v-if="scope.row.timeType==1">月度</p>
                                            <p v-else-if="scope.row.timeType==2">季度</p>
                                            <p v-else-if="scope.row.timeType==3">半年</p>
                                            <p v-else-if="scope.row.timeType==4">年度</p>
                                            <p v-else></p>
                                        </el-col>
                                        <el-col class="lCenter-r butColor">
                                            <p v-if="scope.row.type==1">平台</p>
                                            <p v-else>特殊</p>
                                        </el-col>                                    
                                    </el-row>                                                      
                                </template>                        
                        </el-table-column>
                        <el-table-column
                            prop="pipelineName"
                            label="渠道"
                            align="center"
                            min-width="80">
                        </el-table-column>  
                        <!-- <el-table-column
                            prop="integralNum"
                            label="积分"
                            align="center"
                            min-width="50">
                        </el-table-column>  -->
                        <el-table-column
                            prop="numRecord"
                            label="已购买"
                            align="center"
                            min-width="50">
                        </el-table-column>
                        <el-table-column
                            prop="createorName"
                            label="生成人"
                            align="center"
                            min-width="50">
                        </el-table-column>     
                        <el-table-column
                            prop="createdAt"
                            :show-overflow-tooltip="true"
                            label="生成日期"
                            align="center"
                            min-width="120">
                        </el-table-column>  
                        <el-table-column
                            label="售价"
                            align="center"
                            min-width="60">
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col>
                                        <div>
                                            <div>
                                                <span>ios:</span>
                                                <span class="butColor">{{scope.row.iosPrice}}</span>
                                            </div>
                                            <div>
                                                <span>安卓:</span>
                                                <span class="butColor">{{scope.row.andriodPrice}}</span>
                                            </div>
                                        </div>
                                    </el-col>                                  
                                </el-row>                                                      
                            </template>                            
                        </el-table-column>                                                                                                                                  
                        <el-table-column
                            label="状态"
                            align="center"
                            min-width="40"
                            >
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col v-if="scope.row.state==1">
                                        上线
                                    </el-col>
                                    <el-col v-if="scope.row.state==2">
                                        下线
                                    </el-col>                                    
                                </el-row>                                                      
                            </template>                        
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            min-width="120"
                            >
                            <template slot-scope="scope">
                                <el-row :gutter="10"> 
                                    <el-col :span="8" v-if="$authJudge('market:member:edit')" >
                                        <el-button type="text" class="black-btn" @click="memberOperate(scope.row,'editer')">编辑</el-button>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-button v-if="$authJudge('market:member:offline')" v-show="scope.row.state==1" type="text" class="black-btn" @click="memberOperate(scope.row,'onLineOrNo')">下线</el-button>
                                        <el-button v-if="$authJudge('market:member:online')" v-show="scope.row.state!=1" type="text" class="black-btn" @click="memberOperate(scope.row,'onLineOrNo')">上线</el-button>
                                    </el-col>
                                    <el-col :span="8" v-if="$authJudge('market:member:find')">
                                        <el-button type="text" class="black-btn" @click="memberOperate(scope.row,'see')">查看</el-button>
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
        </div>
        <div v-if="seeRecordlist">
            <el-row>
                <el-col>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <!-- @keyup.native="proving2" -->
                            <el-input  placeholder="输入卡号/账号查询"
                                        class="search-form"
                                        width="100%"
                                        maxlength="16"
                                        v-model="nextTitle"
                                        clearable
                                        ></el-input>                            
                        </el-col>
                        <el-col :span="4">
                            <el-button class="redBackColor butColorF" @click="searchMemberCard(2)">查询</el-button>
                        </el-col>
                        <el-col :span="4" :offset="8" class="lRight-r">
                            <el-button class="redBackColor butColorF" @click="memberExport(selectData.id)">导出</el-button>
                        </el-col>                        
                    </el-row>
                </el-col>
                <el-col class="lMarginTop10">
                    <el-row class="lSize16">
                        <el-col class="lMarginTB30">
                              <p>会员说明</p>                        
                        </el-col>
                        <el-col>
                           <p class="lSize12 grayColor lPaddingRF30 word-wraps">{{selectData.equityDesc}}</p>
                        </el-col>                                              
                    </el-row>                    
                </el-col>
                <el-col class="lMarginTop30">
                    <el-table
                    :data="tableDataNext"
                    border
                    v-loading="loading1"
                    style="width: 100%">
                        <el-table-column
                            prop="sortId"
                            label="序号"
                            align="center"
                            min-width="50">
                        </el-table-column>                                                                                         
                        <el-table-column
                            label="类型"
                            align="center"
                            min-width="50">
                            <template slot-scope="scope">
                                    <el-row> 
                                        <el-col class="lCenter-r"> 
                                            <p v-if="scope.row.timeType==1">月度</p>
                                            <p v-else-if="scope.row.timeType==2">季度</p>
                                            <p v-else-if="scope.row.timeType==3">半年</p>
                                            <p v-else-if="scope.row.timeType==4">年度</p>
                                            <p v-else></p>
                                        </el-col>                                   
                                    </el-row>                                                      
                                </template>                        
                        </el-table-column>  
                        <el-table-column
                            prop="cardNum"
                            label="卡号"
                            align="center"
                            min-width="150">
                        </el-table-column> 
                        <el-table-column
                            prop="cellphone"
                            label="关联账户"
                            align="center"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="createdAt"
                            label="购买日期"
                            align="center"
                            min-width="120">
                        </el-table-column>     
                        <el-table-column
                            label="有效期"
                            align="center"
                            min-width="80">
                                <template slot-scope="scope">
                                    <el-row> 
                                        <el-col class="lCenter-r">
                                           {{scope.row.validityDay}}天
                                        </el-col>                                   
                                    </el-row>                                                      
                                </template>                           
                        </el-table-column>                                                                                                                                  
                        <el-table-column
                            prop="name"
                            label="状态"
                            align="center"
                            min-width="40"
                            >
                            <template slot-scope="scope">
                                    <el-row> 
                                        <el-col v-if="scope.row.state==1">
                                            正常
                                        </el-col>
                                        <el-col v-if="scope.row.state==2">
                                            过期
                                        </el-col>                                    
                                    </el-row>                                                      
                                </template>                        
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
                </el-col>
                <el-col class="lCenter-r lMarginTop30">
                    <el-button class="redBackColor butColorF" @click="removememberCard()">返回</el-button>
                </el-col>
            </el-row>
        </div>
        <el-dialog
        :visible.sync="centerDialogVisible"
        title=""
        max-height="300"
        width="30%">  
            <el-row>
                <el-col :span="8" :offset="4" class="lCenter-r">
                    <el-button class="redBackColor butColorF" @click="creatMemberCardEven(1)">平台会员卡</el-button>
                </el-col>
                <el-col :span="8" class="lCenter-r">
                    <el-button class="redBackColor butColorF" @click="creatMemberCardEven(2)">特殊会员卡</el-button>
                </el-col>               
            </el-row>
        </el-dialog> 
        <el-dialog
        :visible.sync="statusIsOkOrNo"
        title=""
        max-height="300"
        width="30%">  
            <p class="lMarginBO30 lCenter-r">确定要下线该会员卡吗?</p>
            <el-row>
                <el-col :span="8" :offset="4" class="lCenter-r">
                    <el-button @click="dialogRemoveEven()">取消</el-button>
                </el-col>
                <el-col :span="8" class="lCenter-r">
                    <el-button class="redBackColor butColorF" @click="dialogSaveEven()">确定</el-button>
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
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'会员卡系统',
                            pathInfo:''
                        }
                ],
            courseStatusList:[
                {
                    name:"全部",
                    value:''
                },
                {
                    name:"上线",
                    value:1
                },
                {
                    name:"下线",
                    value:2
                }
            ],
            courseTypeList:[
                {
                    name:"全部",
                    value:''
                },
                {
                    name:"月度",
                    value:1
                },
                {
                    name:"季度",
                    value:2
                },
                {
                    name:"半年",
                    value:3
                },
                {
                    name:"年度",
                    value:4
                }
            ],            
            dialogBool:false,

            //会员新字段
            memberType:'',
            memberStatus:'',
            statusIsOkOrNo:false,
            seeRecordlist:false,
            selectData:'',
            nextTitle:'',
            flags:[],
            loading:false,
            loading1:false   
        }
    },
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path;        
        this.flags = this.$getPermissions(routes,currentPath);
        if(!this.flags){
            this.flags = [];
        }        
        this.getStudylist(1);
    },
    methods:{
        //返回
        removememberCard(){
            this.seeRecordlist=false;
        },
        //查询会员卡
        searchMemberCard(num){
            switch (num) {
                case 1:
                    this.getStudylist(1);
                    break;
                case 2:
                    this.queryDeatilList(1);
                    break;            
                default:
                    break;
            }
        },
        //导出
        memberExport(id){
            var self = this;      
            var url = self.$server.exportExcelmemberRecord+"?token="+getToken()+"&memberId="+self.selectData.id+"&cardNum="+self.nextTitle||'';  
            window.open(url);              
        },
        //会员卡操作
        memberOperate(data,stats){
            var self = this;
            self.selectData = data;
            switch (stats) {
                case 'see':
                    self.seeRecordlist=true;
                    self.nextTitle='';
                    self.queryDeatilList(1);                    
                    break;
                case 'editer':
                    self.$router.push({path: "/marketelist/member/memberNew",query:{type:stats,data:data,addOrEdit:'edit'}});                   
                    break;            
                default:
                    if(data.state==1){
                        self.statusIsOkOrNo=true;
                    }else{
                        self.$http.post(self.$server.memberUp({id:data.id})).then(res=>{
                            if(res.status==200){
                            self.getStudylist(1);
                            }else{
                                self.loadDailg = false;
                            }
                        });                     
                    }                    
                    break;
            }
        },
        //取消通用事件；
        dialogRemoveEven(){
            this.statusIsOkOrNo=false;
        },
        //确定下架；
        dialogSaveEven(){
            var self = this;
                self.$http.post(self.$server.memberDown({id:self.selectData.id})).then(res=>{
                    if(res.status==200){
                        self.getStudylist(1);
                    }else{
                        self.loadDailg = false;
                    }
                });             
            this.statusIsOkOrNo=false;
        },
        //新建会员卡弹框
        openMemberType(){
            this.centerDialogVisible = true; 
        },
        //选择新建会员卡类型
        creatMemberCardEven(stats){
            this.centerDialogVisible = false;
            this.$router.push({path: "/marketelist/member/memberNew",query:{type:stats,addOrEdit:'add'}});
        },
        // proving1(ddd){
        //     var self = this;
        //     var reg = /^(?!.*\\.*$)/;
        //     if(!reg.test(self.title)){
        //         this.title='';
        //     }
        // },   
        // proving2(){
        //     var self = this;
        //     var reg = /^(?!.*\\.*$)/;
        //     if(!reg.test(self.nextTitle)){
        //         this.nextTitle='';
        //     }
        // },           
        //继续查询详情
        queryDeatilList(num){
            var self = this;
            if(num){
                self.pageNoDetail = num;
            }            
            var params = {
                pageNo:self.pageNoDetail,
                memberId:self.selectData.id,
                pageSize:self.pageSize,
                searchContent:encodeURIComponent(self.nextTitle)
            };
            self.loading1 = true;
            self.$http.get(self.$server.memberRecordSelectPage(params)).then(res=>{
               if(res.status==200){
                    self.dialogBool = true;
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
                        self.pageAtionNext.paginationPage = num;
                        self.loading1 = false;
                   
               }else{
                   self.loading1 = false;
               }
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
                name:encodeURIComponent(self.title),
                pageSize:self.pageSize,
                pageNo:self.pageNo,
                //(1:月度,2:季度,3:半年,4:年度)
                timeType:self.memberType,
                //（1:上线,2:下线）
                state:self.memberStatus                 
            };
            self.$http.get(self.$server.memberSelectPage(params)).then(res=>{
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
                    self.loading = false; 
               }
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


