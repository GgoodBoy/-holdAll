<template>
    <div>        
        <el-row class="lLine40 headerDiv">
            <el-col class="lLeft-r lSize18">财务管理</el-col>
            <el-col>
                <el-row>
                    <el-col :span="5">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                    placeholder="输入申请账户查询"
                                    class="search-form"
                                    width="100%"
                                    maxlength="20"
                                    clearable
                                    @keyup.native="proving"
                                    ></el-input>
                        </div>
                    </el-col>
                    <el-col :span="4" :offset="1" class="lCenter-r">
                        <el-row :gutter="10">
                            <el-col :span="6" style="fontSize:14px">状态</el-col>
                            <el-col :span="18" >
                                <el-select v-model="statusValue" placeholder="请选择">
                                    <el-option
                                    v-for="item in optionStatus"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>                                
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="2" :offset="1" v-if="$authJudge('finance:select')"><el-button class="redBackColor butColorF" @click="seach">查询</el-button></el-col>
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
                    prop="applyPhone"
                    align="center"
                    label="申请账户"
                    min-width="110"
                    :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    label="申请时间"
                    min-width="130"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="money"
                    align="center"
                    min-width="80"
                    label="申请金额"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="paymentMethod"
                    align="center"
                    label="收款方式"
                    min-width="80">
                </el-table-column>
                <el-table-column
                    prop="accountNum"
                    align="center"
                    label="收款账号"
                    min-width="120"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="recipentName"
                    align="center"
                    label="收款姓名"
                    min-width="80"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="recipentPhone"
                    align="center"
                    label="手机号"
                    min-width="110"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    label="状态"
                    align="center"
                    min-width="60"
                    show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-row> 
                                <!-- 1:待审核，2:已审核,3:已驳回,4:已过期 -->
                                <el-col v-if="scope.row.state==1">
                                    待审核
                                </el-col>    
                                <el-col v-else-if="scope.row.state==2">
                                    已审核
                                </el-col>                                                                                                                            
                                <el-col v-else-if="scope.row.state==3">
                                    已驳回
                                </el-col>
                                <el-col v-else>
                                    已过期
                                </el-col>                                
                            </el-row>                                                      
                        </template>                    
                </el-table-column>
                <el-table-column
                    prop="auditTime"
                    align="center"
                    label="审核时间"
                    min-width="130"
                    show-overflow-tooltip>
                </el-table-column>                
                <el-table-column
                    fixed="right"
                    align="center"
                    label="操作"
                    min-width="210">
                        <template slot-scope="scope">
                            <el-row :gutter="10"> 
                                <el-col :span="8">
                                    <el-button v-if="$authJudge('finance:verify')" type="text" v-show="scope.row.state==1" class="black-btn" @click="channeUpdateEven(scope.row)">审核
                                    </el-button>
                                    <el-button v-if="$authJudge('finance:info')" type="text" v-show="scope.row.state!=1" class="black-btn" @click="channeUpdateEven(scope.row)">
                                       查看
                                    </el-button>
                                </el-col>    
                                <el-col :span="8" v-if="$authJudge('finance:record')">
                                    <el-button type="text" class="black-btn" @click="channeRecord(scope.row)">记录</el-button>
                                </el-col>                                                                                                                            
                                <el-col :span="8" v-if="$authJudge('finance:distribution')">
                                    <el-button type="text" class="black-btn" @click="channeRemoveBatch(scope.row)">分销明细</el-button>
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
        :visible.sync="centerDialogVisible"
        :before-close="handleClose1"
        :close-on-click-modal='false'
        title=""
        max-height="300"
        width="50%">  
            <el-row>
                <el-col class="lCenter-r">
                    <el-row class="lLine40">
                        <el-col :span="10" class="lLeft-r">
                            申请账户:{{listInfoData.applyPhone}}
                        </el-col>
                        <el-col :span="10">
                            总收益：{{listInfoData.totalIncome}}元
                        </el-col>
                        <el-col :span="4">
                            <!-- v-if="flags.includes('common:export')" -->
                            <el-button class="lButtom lSize16"   @click="headExport(listInfoData)">导出</el-button>
                        </el-col>
                    </el-row>                   
                </el-col>
                <el-col class="lMarginTop30">
                    <el-row>
                        <el-col :span="5">
                            <div class="iSeachEven">
                                <el-input v-model.trim="titleReact"
                                        placeholder="请输入课程名称"
                                        class="search-form"
                                        width="100%"
                                        clearable
                                        maxlength="20"
                                        @keyup.native="proving1"
                                        ></el-input>
                            </div>
                        </el-col>
                        <el-col :span="2" :offset="1"><el-button class="redBackColor butColorF" @click="seachReact">查询</el-button></el-col>
                    </el-row>                    
                </el-col>
                <el-col class="lMarginTop20">
                    <!-- :data="tableDataNext" -->
                        <el-table
                        :data="getWithdrawUserIdData"
                        border
                        v-loading='loading1'
                        style="width: 100%"
                        :height="300">
                        <el-table-column
                            prop="courseName"
                            align="center"
                            label="课程名称"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            prop="buyPhone"
                            align="center"
                            label="购买人"
                            min-width="160">
                        </el-table-column>
                        <el-table-column
                            prop="buyTime"
                            align="center"
                            label="购买时间"
                            min-width="200">
                        </el-table-column>                        
                        <el-table-column
                            min-width="120"
                            align="center"
                            label="收益">
                            <template slot-scope="scope">
                                <el-row :gutter="10"> 
                                    <el-col class="lCenter-r">+ {{scope.row.money}}</el-col>
                                </el-row>                                                      
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
        </el-dialog>
        <!-- 审核弹窗 -->
        <el-dialog
        :visible.sync="centerDialogExamine"
        :before-close="handleClose"
        title="审核"
        max-height="300"
        width="30%">  
            <el-row>
                <el-col class="lCenter-r">
                    <el-row class="lSize16">
                        <el-col class="lLine30 lMarginTop10">
                            <el-row :gutter="15">
                                <el-col :span="7" class="lRight-r">
                                    申请账号：
                                </el-col>
                                <el-col :span="17" class="lLeft-r">
                                    {{listInfoData.applyPhone}}
                                </el-col>                                
                            </el-row>
                        </el-col>
                        <el-col class="lLine30 lMarginTop10">
                            <el-row :gutter="15">
                                <el-col :span="7" class="lRight-r">
                                    申请时间：
                                </el-col>
                                <el-col :span="17" class="lLeft-r">
                                    {{listInfoData.createdAt}}
                                </el-col>                                
                            </el-row>
                        </el-col>
                        <el-col class="lLine30 lMarginTop10">
                            <el-row :gutter="15">
                                <el-col :span="7" class="lRight-r">
                                    账户余额：
                                </el-col>
                                <el-col :span="17" class="lLeft-r">
                                    ¥ {{listInfoData.accountBalance}}
                                </el-col>                                
                            </el-row>
                        </el-col>
                        <el-col class="lLine30 lMarginTop10">
                            <el-row :gutter="15">
                                <el-col :span="7" class="lRight-r">
                                    申请金额：
                                </el-col>
                                <el-col :span="17" class="lLeft-r">
                                    ¥ {{listInfoData.money}}
                                </el-col>                                
                            </el-row>
                        </el-col>
                        <el-col class="lLine30 lMarginTop10">
                            <el-row :gutter="15">
                                <el-col :span="7" class="lRight-r">
                                    收款方式：
                                </el-col>
                                <el-col :span="17" class="lLeft-r">
                                    {{listInfoData.paymentMethod}}
                                </el-col>                                
                            </el-row>
                        </el-col>
                        <el-col class="lLine30 lMarginTop10">
                            <el-row :gutter="15">
                                <el-col :span="7" class="lRight-r">
                                    收款账号：
                                </el-col>
                                <el-col :span="17" class="lLeft-r">
                                {{listInfoData.accountNum}}
                                </el-col>                                
                            </el-row>
                        </el-col>
                        <el-col class="lLine30 lMarginTop10">
                            <el-row :gutter="15">
                                <el-col :span="7" class="lRight-r">
                                    收款人：
                                </el-col>
                                <el-col :span="17" class="lLeft-r">
                                    {{listInfoData.recipentName}}
                                </el-col>                                
                            </el-row>
                        </el-col>
                        <el-col class="lLine30 lMarginTop10">
                            <el-row :gutter="15">
                                <el-col :span="7" class="lRight-r">
                                    手机号：
                                </el-col>
                                <el-col :span="17" class="lLeft-r">
                                    {{listInfoData.recipentPhone}}
                                </el-col>                                
                            </el-row>
                        </el-col>                                                                                                                                                     
                    </el-row>
                </el-col>
                <el-col class="lMarginTop30">
                    <el-row>
                        <el-col :span="4" class="lCenter-r" :offset="8">
                            <el-button @click="allDialogIsNo(1)">驳回</el-button>
                        </el-col>
                        <el-col :span="4" class="lCenter-r">
                            <el-button class="redBackColor butColorF" @click="examineIsOkReject(1)">同意</el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 驳回弹框 -->
        <el-dialog
        :visible.sync="centerDialogReject"
        :before-close="handleClose"
        :close-on-click-modal='false'
        title="驳回原因"
        max-height="300"
        width="35%">  
            <el-row class="lSize16 lCenter-r">
                <el-col>
                    <el-input
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    :maxlength="50"
                    v-model="textareaReject">
                    </el-input>                    
                </el-col>
                <el-col class="lMarginTop30">
                    <el-row>
                        <el-col :span="4" class="lCenter-r" :offset="8">
                            <el-button @click="allDialogIsNo(2)">取消</el-button>
                        </el-col>
                        <el-col :span="4" class="lCenter-r">
                            <el-button class="redBackColor butColorF" @click="examineIsOkReject(2)">确定</el-button>
                        </el-col>
                    </el-row>                    
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 查看已审核、已过期弹窗 -->
        <el-dialog
        :visible.sync="centerDialogSee"
        :title="dialogTitleNanme"
        :before-close="handleClose"
        max-height="300"
        width="35%"> 
            <el-row class="lSize16 lCenter-r">
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            申请账号：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                            {{listInfoData.applyPhone}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            申请时间：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                            {{listInfoData.createdAt}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            账户余额：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                            ¥ {{listInfoData.accountBalance}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            申请金额：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                            ¥ {{listInfoData.money}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            收款方式：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                            {{listInfoData.paymentMethod}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            收款账号：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                           {{listInfoData.accountNum}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            收款人：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                            {{listInfoData.recipentName}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            手机号：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                            {{listInfoData.recipentPhone}}
                        </el-col>                                
                    </el-row>
                </el-col>                                                                                                                                                                                                
            </el-row>
        </el-dialog>
        <!-- 查看已驳回弹窗 -->
        <el-dialog
        :visible.sync="centerDialogRejectSee"
        :close-on-click-modal='false'
        :before-close="handleClose"
        max-height="300"
        width="35%">  
            <el-row class="lSize16 lCenter-r">
                <el-col class="lLine30 lMarginTop10 lCenter-r">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            申请账号：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                             {{listInfoData.applyPhone}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            申请时间：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                            {{listInfoData.createdAt}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            账户余额：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                           ¥ {{listInfoData.accountBalance}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            申请金额：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                             ¥ {{listInfoData.money}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            收款方式：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                             {{listInfoData.paymentMethod}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            收款账号：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                            {{listInfoData.accountNum}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            收款人：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                            {{listInfoData.recipentName}}
                        </el-col>                                
                    </el-row>
                </el-col>
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            手机号：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                            {{listInfoData.recipentPhone}}
                        </el-col>                                
                    </el-row>
                </el-col>  
                <el-col class="lLine30 lMarginTop10">
                    <el-row :gutter="15">
                        <el-col :span="7" class="lRight-r">
                            驳回理由：
                        </el-col>
                        <el-col :span="17" class="lLeft-r">
                            <el-input
                            type="textarea"
                            :rows="5"
                            placeholder="请输入内容"
                            :maxlength="50"
                            disabled
                            v-model="listInfoData.rejectReason">
                            </el-input>
                        </el-col>                                
                    </el-row>                    
                    
                </el-col>                 
            </el-row>
        </el-dialog>    
        <el-dialog
        :visible.sync="centerDialogRecord"
        :before-close="handleClose"
        max-height="400"
        width="35%"> 
            <el-row class="lSize16 lCenter-r">
                <el-col v-show="!recordIsBool" class="lLine30 lMarginTop20" style="border-bottom: 1px solid #DADADA;" v-for="item,index in getWithdrawRecordData" :key="index">
                    <el-row>
                        <el-col :span="6" class="lLeft-r">
                            {{item.paymentMethod}}
                        </el-col>
                        <el-col :span="12" class="lCenter-r">
                             {{item.accountNum}}
                        </el-col> 
                        <el-col :span="6" class="lRight-r">
                            ￥ {{item.money}}
                        </el-col>                                                        
                    </el-row>
                    <el-row>
                        <el-col :span="18" class="lLeft-r">
                            {{item.createdAt}}
                        </el-col>
                        <el-col :span="6" class="lRight-r">
                            <!-- 1:待审核，2:已审核,3:已驳回,4:已过期 -->
                             <span v-if="item.state==1">待审核</span>
                             <span v-else-if="item.state==2">已审核</span>
                             <span v-else-if="item.state==3">已驳回</span>
                             <span v-else>已过期</span>
                        </el-col>                                
                    </el-row>                    
                </el-col>  
                <el-col v-show="recordIsBool" class="lLine30 lMarginTop20 lCenter-r">
                    当前记录无数据
                </el-col>                                                                                                                                                      
            </el-row>
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
          getWithdrawRecordData:[],
          getWithdrawUserIdData:[],
          //1:待审核，2:已审核,3:已驳回,4:已过期
          optionStatus:[{
            value: '',
            label: '全部'
            },{
            value: 1,
            label: '待审核'
            }, {
            value: 2,
            label: '已审核'
            }, {
            value: 3,
            label: '已驳回'
            }, {
            value: 4,
            label: '已过期'
            }],
        statusValue: '',
        textarea:'',
        textareaReject:'',
        pageAtion:{
            pageTotal:0,
            paginationPage:1
        },         
        pageAtionNext:{
            pageTotal:0,
            paginationPage:1
        },    
        pageSize:10,
        pageNo:1,
        pageNoList:1,          
        centerDialogVisible:false,  
        centerDialogRejectSee:false,
        centerDialogExamine:false,
        centerDialogReject:false,
        centerDialogSee:false,
        centerDialogRecord:false, 
        dialogTitleNanme:'',
        listInfoData:[],
        titleReact:'',
        recordIsBool:false,
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
        this.getWithdrawList(1);
    },    
    methods:{
        getWithdrawRecord(){
           var self = this;          
            var parems = {
                userId:self.listInfoData.userId
            };
            self.$http.get(self.$server.withdrawRecord(parems)).then(res=>{
               if(res.status==200){
                   self.centerDialogRecord = true;
                   if(res.content.length>0){
                       self.getWithdrawRecordData = res.content;
                       self.recordIsBool = false;
                   }else{
                       self.recordIsBool = true;
                   }
                    
               }
            })             
        },
        handleClose1(done){
            this.getWithdrawUserIdData = [];
            done();
        },
        getWithdrawUserId(num){
           var self = this;
            if(num){
                self.pageNoList = num;
            }            
            var parems = {
                pageSize:self.pageSize,
                pageNo:self.pageNoList,
                userId:self.listInfoData.userId,
                courseName:self.titleReact,
            };
            self.loading1=true;
            self.$http.get(self.$server.withdrawUserId(parems)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   self.allCodeReactListNum = contentdate.total;
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
                   } 
                    self.getWithdrawUserIdData = listIds;
                    self.pageAtionNext.pageTotal = contentdate.total;
                    self.pageAtionNext.paginationPage = num;
                    self.loading1 = false; 
               }
            }).catch(()=>{
                self.loading1=false;
            }); 
        },        
        getWithdrawList(num){
           var self = this;
            if(num){
                self.pageNo = num;
            }            
            var parems = {
                pageSize:self.pageSize,
                pageNo:self.pageNo,
                applyPhone:self.title,
                applyStatus:self.statusValue
            };
            self.loading = true; 
            self.$http.get(self.$server.withdrawList(parems)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   self.allCodeReactListNum = contentdate.total;
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
                    self.getWithdrawListData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loading = false; 
               }
            }).catch((err)=>{
                self.loading=false;
            }); 
        },
        seach(){
            this.getWithdrawList(1);
        },
        proving(){   
            this.title=this.title.replace(/[^\d]/g,'')        
        },
        examineIsOkReject(num){
                this.rejectAjax(num);
        },
        seachReact(){
            this.getWithdrawUserId(1);
        },
        //驳回提交
        rejectAjax(num){
            var self = this;
            var parems = {
                id:self.listInfoData.id,
                auditOpertionType:Number(num),
                rejectReason:self.textareaReject
            };
            self.$http.post(self.$server.withdrawAudit(parems)).then(res=>{
                if(res.status==200){
                    self.centerDialogReject = false;
                    self.centerDialogExamine = false;
                    this.getWithdrawList(1);
                }
            })             
            self.centerDialogRemove=false;            
        },
        handleClose(done){
            this.listInfoData = '';
            done();
        },
        channeUpdateEven(data){
            this.listInfoData = data;
            switch (data.state) {
                case 1:
                    this.centerDialogExamine=true;
                    break;
                case 4:
                case 2:
                    //查看已审核、已过期弹窗
                    if(data.state==4){
                        this.dialogTitleNanme = '已过期';
                    }else{
                        this.dialogTitleNanme = '已审核'
                    }
                    this.centerDialogSee = true;
                    break;
                case 3:
                    this.centerDialogRejectSee = true;
                    break;                                                                       
                default:
                    break;
            }
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
        headExport(rows){
            var self = this;
            var parems = {
                token:getToken(),
                userId:rows.userId
            };
            self.download2(self.$server.withdrawExport(parems));    
        }, 
        channeRemoveBatch(data){
            this.listInfoData = data;
            this.getWithdrawUserId(1)
            this.centerDialogVisible = true;
        },
        channeRecord(data){
            this.listInfoData = data;
            this.getWithdrawRecord();
        },
        childPageValue(num){
           if(Number(num)>0){
                this.getWithdrawList(Number(num))
            } 
        },
        childPageValueNext(num){
            if(Number(num)>0){
                this.getWithdrawUserId(Number(num))
            }
        },     
        //待审核
        allDialogIsNo(num){
            var self = this;
            switch (num) {
                case 1:
                    self.centerDialogExamine = false;
                    self.centerDialogReject = true;
                    break;
                case 2:
                    self.centerDialogReject = false;
                    break;                                                                                          
                default:
                    break;
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
</style>


