<template>
    <div>
        <el-row :gutter="20" class="lLine40">
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col :span="20">
                <el-input v-model.trim="orderId"
                    style="width:200px"
                    placeholder="输入付款账号和订单号查询"
                    class="search-form"
                    clearable
                    maxlength="20">
                </el-input>                
                <el-select 
                    v-model="orderStatus"
                    clearable
                    style="width:120px"
                    placeholder="状态">
                    <el-option v-for="(item,i) in courseLabelList"
                        :key="i"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select> 
                <el-select 
                    v-model="paymentType"
                    clearable
                    style="width:120px"
                    placeholder="支付方式">
                    <el-option v-for="(item,i) in moneyList"
                        :key="i"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>                
                <el-date-picker
                v-model="begin"
                @change="pickerBegin(begin)"
                style="width:150px"
                type="date"
                placeholder="开始时间">
                </el-date-picker>  
                <div style="display: inline-block;">-</div>
                <el-date-picker
                v-model="end"
                @change="pickerEnd(end)"
                style="width:150px"
                type="date"
                placeholder="结束时间">
                </el-date-picker>                              
                <el-button v-if="$authJudge('record:collectionorder:select')" class="redBackColor butColorF" @click="seach()">查询</el-button>
            </el-col>        
            <el-col :span="4" style="text-align: right;">
                <el-button type="primary" v-if="$authJudge('record:collectionorder:export')" @click="exportList">导出</el-button>
            </el-col>                
        </el-row>
        <el-row class="lMarginTop20">
            <el-col>
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        label="付款账号 "
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="180">
                        <template slot-scope="scope">
                            <p class="moneyOrRecord">{{scope.row.cellphone}}<span class="flag" v-if="telePhoneList.indexOf(Number(scope.row.cellphone))!=-1">测</span></p>                          
                        </template>                        
                    </el-table-column>                
                    <el-table-column
                        prop="orderId"
                        label="订单号 "
                        align="center"
                        min-width="180"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="合集名称"
                        prop="title"
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="150">                         
                    </el-table-column>  
                    <el-table-column 
                        align="center"
                        label="状态"
                        min-width="80">
                        <template slot-scope="scope">
                            <P v-if="scope.row.orderStatus==1">支付成功</P>
                            <P v-else-if="scope.row.orderStatus==2">交易关闭</P>
                            <P v-else>待支付 </P>
                        </template>                                 
                    </el-table-column>   
                    <el-table-column 
                        align="center"
                        label="支付方式"
                        min-width="80">
                        <template slot-scope="scope">
                            <P v-if="scope.row.paymentType==1">夫子币余额</P>
                            <P v-else-if="scope.row.paymentType==2">微信</P>
                            <P v-else-if="scope.row.paymentType==3">支付宝</P>
                            <P v-else-if="scope.row.paymentType==4">apple充值</P>
                            <P v-else>微信内支付</P>
                        </template>                                 
                    </el-table-column> 
                    <el-table-column
                        label="应付"
                        align="center"
                        min-width="100">     
                        <template slot-scope="scope">
                            {{scope.row.totalPay}}元
                        </template>                                            
                    </el-table-column>                                                                                            
                    <el-table-column
                        label="实付"
                        align="center"
                        min-width="100"
                        >
                        <template slot-scope="scope">
                            {{scope.row.actualPay}}元
                        </template>                        
                    </el-table-column>                                                                                            
                    <el-table-column
                        prop="areaName"
                        label="地区"
                        :show-overflow-tooltip="true"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>                                                                                            
                    <el-table-column
                        prop="returnId"
                        label="第三方账号"
                        :show-overflow-tooltip="true"
                        align="center"
                        min-width="180"
                        >
                    </el-table-column>                                                                                            
                    <el-table-column
                        prop="discountInfo"
                        label="优惠"
                        align="center"
                        min-width="80"
                        >
                    </el-table-column>                                                                                            
                    <el-table-column
                        prop="createdAt"
                        label="付款日期"
                        align="center"
                        min-width="160"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        fixed="right"
                        min-width="100">
                        <template slot-scope="scope">       
                            <el-button
                                    v-if="$authJudge('record:collectionorder:detail')"
                                    type="text"
                                    class="black-btn"
                                    @click="shareSpecial(scope.row)">查看详情</el-button>                                    
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
        :visible.sync="dialogVisibleOne"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        width="40%"
        >    
                <el-table
                :data="tableDataNext"
                border
                v-loading="loading1"
                style="width: 100%;margin-top:20px;">
                    <el-table-column
                        prop="sortId"
                        label="序号 "
                        align="center"
                        min-width="50">
                    </el-table-column>                
                    <el-table-column
                        prop="courseName"
                        label="课程名称 "
                        align="center"
                        min-width="200"
                        show-overflow-tooltip>
                    </el-table-column>                                   
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue1"
                        :current-page.sync="pageAtion1.paginationPage"
                        :total="pageAtion1.pageTotal">
                    </el-pagination>
                </div>  
        </el-dialog>                                 
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
import eventAction from '../lEventAtion';
let actions = new eventAction()
export default {
    components:{
        breadcrumb,
    },    
    data(){       
        return {
            telePhoneList:[
                18581552762,
                18283584088,
                13088085950,
                17771003079,
                17610426177,
                17600382177,
                13811111111,
                13911111111,
                13910843977,
                17313115223,
                15690848380,
                18381076757,
                15884406155,
                18683620401,
                13810769135,
                18147277806,
                13161675756
            ],               
            tableData:[],
            tableDataNext:[],
            loading:false,
            loading1:false,
            orderId:'',
            titleList:[
                {
                    name:'订单管理系统',
                    pathInfo:''
                },
                {
                    name:'合集订单',
                    pathInfo:''
                }               
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            pageAtion1:{
                pageTotal:0,
                paginationPage:1
            },
            pageSize:10,
            pageNo:1,
            pageNo1:1,
            orderStatus:'',
            paymentType:'',
            // 0 待支付 1 支付成功 2交易关闭
            courseLabelList:[               
                {
                    name:'待支付',
                    value:0
                },
                {
                    name:'支付成功',
                    value:1
                },
                {
                    name:'交易关闭',
                    value:2
                }                
            ],
            moneyList:[               
                {
                    name:'夫子币余额',
                    value:1
                },
                {
                    name:'微信',
                    value:2
                },
                {
                    name:'支付宝',
                    value:3
                },
                {
                    name:'apple充值',
                    value:4
                },
                {
                    name:'微信内支付',
                    value:5
                }                
            ],            
            //ljm
            begin:'',
            end:'',
            dialogVisibleOne:false,
            chooseData:''                  
        }
    },
    created(){         
        this.getStudylist(1);     
    },
    props:[],
    computed:{    
    },     
    methods:{
        //导出
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
        //导出
        exportList(){
                var self = this;
                var parems = {
                    orderId:self.orderId,
                    orderStatus:self.orderStatus,
                    paymentType:self.paymentType,                    
                    beginAt:actions.formatDate(self.begin,'begin'),
                    endAt:actions.formatDate(self.end,'end'),
                    token:getToken()
                };
                self.download2(self.$server.exportCollectionOrderList(parems)); 
        },        
        //开始时间
        pickerBegin(val){
            const beginData = Number(val);
            const endData = Number(this.end);
            if(beginData>endData){
                this.end = '';
            }
        },
        //结束时间 
        pickerEnd(val){
            const endData = Number(val);
            const beginData = Number(this.begin);
            if(beginData>endData){
                this.end = '';
            }
        },       
        shareSpecial(data){
            var self = this;  
            this.chooseData = data;
            this.dialogVisibleOne = true;  
            this.getMoblilelist(1);
        },
        regularState(data){
            var regEn = new RegExp("[`~!@#$^&*%()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"),
                reg = /^(?!.*\\.*$)/,
                reg1 = /^(?!.*\/\.*$)/;
                if(regEn.test(data)||!reg.test(data)||!reg1.test(data)){   
                    return true;
                }else{
                    return false;
                }
        },
        getMoblilelist(num){
            var self = this;            
            if(num){
                self.pageNo1 = num;
            }
            self.loading1 = true; 
            const query = {
                params:{
                    pageNo:self.pageNo1,
                    pageSize:self.pageSize
                }
            }            
            self.$http.get(`${this.$server.getCollectionOrderDetail}${self.chooseData.id}`,query).then(res=>{
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
                    self.pageAtion1.pageTotal = contentdate.total;
                    self.pageAtion1.paginationPage = num;
                    self.$nextTick(function(){
                        self.loading1 = false; 
                    }) 
               }
            })            
        },
        getStudylist(num){
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
            const query = {
                params:{
                    pageNo:self.pageNo,
                    pageSize:self.pageSize,
                    orderId:self.orderId,
                    orderStatus:self.orderStatus,
                    paymentType:self.paymentType,                    
                    beginAt:actions.formatDate(self.begin,'begin'),
                    endAt:actions.formatDate(self.end,'end')
                }
            }            
            self.$http.get(self.$server.getCollectionOrderList,query).then(res=>{
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
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
               }
            })            
        },         
        seach(){
            this.getStudylist(1);
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        },
        childPageValue1(num){
            if(Number(num)>0){
                this.getMoblilelist(Number(num))
            }
        }             
    },
    watch: {
        'form.type': {
            handler: function(val) {
                if(val=="1"){
                    this.numbersBool = false;
                }else{
                    this.numbersBool = 1;
                }
            },
        }
    }, 
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
.num{
    display: inline-block;
    vertical-align: middle;
    color:#666666;
    margin:0 20px 0 10px;
}    
.moneyOrRecord{
        position: relative;
        display: inline-block;
        padding: 10px;    
}
.moneyOrRecord .flag{
            /* color:#9E0E00; */
            color:#fff;
            background: #9E0E00;
            font-size: 12px;
            position: absolute;
            top:-1px;
            right: -8px;
            width: 20px;
            text-align: center;
            height: 20px;
            /* border:1px solid #9E0E00; */
            border-radius: 50%;
            transform: scale(0.9)      
}
</style>


