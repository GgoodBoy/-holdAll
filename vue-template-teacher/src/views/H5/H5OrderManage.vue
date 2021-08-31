<template>
    <div class="H5-order-wrap">
        <div class="page-header">
            <el-row>
                <el-col :span="4">
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <div class="page-h5-section">
                <el-input v-model="searchContent" style="width:200px;" placeholder="输入订单号/付款账号/课程名称查询"></el-input>
                <el-select v-model="orderStatus" style="width:150px;" placeholder="状态">
                    <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="paymentType" style="width:150px;" placeholder="支付方式">
                    <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker
                    v-model="beginTime"
                    @change="pickerBegin(beginTime)"
                    style="width:150px"
                    type="date"
                    placeholder="订单开始时间">
                </el-date-picker>  
                <div style="display: inline-block;">-</div>
                <el-date-picker
                    v-model="endTime"
                    @change="pickerEnd(endTime)"
                    style="width:150px"
                    type="date"
                    placeholder="结束时间">
                </el-date-picker> 
                <el-button type="primary" v-if="$authJudge('interact:order:page')" @click="search">查询</el-button>
                <el-button type="primary" v-if="$authJudge('interact:order:export')" @click='exportEven'>导出</el-button>
            </div>
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="cellphone"
                        label="手机号"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="orderNum"
                        label="订单号"
                        min-width="150"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="courseName"
                        label="课程名称"
                        align="center"
                        min-width="120"
                        >
                    </el-table-column> 
                    <el-table-column
                        label="状态"
                        align="center"
                        min-width="80"
                        >
                        <template slot-scope="scope"> 
                            {{scope.row.payStatus==1?'待支付':'支付成功'}}                                              
                        </template>                         
                    </el-table-column>   
                    <el-table-column
                        label="支付方式"
                        align="center"
                        min-width="100"
                        >
                        <template slot-scope="scope"> 
                            <span v-if="scope.row.paymentType==1">夫子币余额</span> 
                            <span v-if="scope.row.paymentType==2">微信</span>
                            <span v-if="scope.row.paymentType==3">支付宝</span>                                         
                        </template>                          
                    </el-table-column> 
                    <el-table-column
                        prop="coursePrice"
                        label="应付"
                        align="center"
                        min-width="70"
                        >
                    </el-table-column>  
                    <el-table-column
                        prop="payPrice"
                        label="实付"
                        align="center"
                        min-width="70"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="couponDetail"
                        label="优惠信息"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope"> 
                            <div>{{scope.row.couponDetail}}</div> 
                            <div>使用积分:{{scope.row.integralNum||0}}</div>                                        
                        </template>                          
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
                        fixed="right"
                        align="center"
                        min-width="150">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type='text' size="small" @click="edit(scope.row,1)">详情</el-button>
                                    <el-button type='text' v-if="$authJudge('interact:order:mailRecord')" size="small" @click="edit(scope.row,2)">邮寄</el-button>
                                </div>                                              
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
        :visible.sync="dialogVisible"
        :close-on-click-modal='false'
        :close-on-press-escape="false"
        width="25%">
            <div class="editBox">
                <div class="rowcss">
                    <div>地区</div>
                    <div>{{selectData.areaName}}</div>
                </div>
                <div class="rowcss">
                    <div>第三方订单号</div>
                    <div>{{selectData.returnOrderNum}}</div>
                </div>
            </div>        
        </el-dialog>         
    </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken } from '@/utils/auth';
export default {
    data() {
        return {
            titleList:[
                {
                    name:'H5课程',
                    pathInfo:''
                },
                {
                    name:'订单管理',
                    pathInfo:''
                }               
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            options1:[
                {
                    value:'',
                    label:'全部'
                },
                {
                    value:1,
                    label:'待支付'
                },
                {
                    value:2,
                    label:'支付成功'
                }
            ],
            options2:[
                {
                    value:'',
                    label:'全部'
                },
                {
                    value:1,
                    label:'夫子币余额'
                },
                {
                    value:2,
                    label:'微信'
                },
                {
                    value:3,
                    label:'支付宝'
                }                
            ],
            pageSize:10,
            tableData:[],
            loading:false,
            searchContent:'',
            orderStatus:'',
            paymentType:'',
            beginTime:'',
            endTime:'',
            selectData:'',
            dialogVisible:false
        };
    },
    components: {
        breadcrumb
    },
    watch: {},
    created() {
       this.getCooperationPlatformList(1)
    },
    methods: {
        search(){
            this.getCooperationPlatformList(1)
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getCooperationPlatformList(Number(num))
            }
        },
        //开始时间
        pickerBegin(val){
            const beginData = Number(val);
            let endData = Number(this.endTime);
            if(beginData>endData){
                this.endTime = '';
            }
        },
        //结束时间 
        pickerEnd(val,type){
            const endData = Number(val);
            let beginData = Number(this.beginTime);
            if(beginData>endData){
                this.endTime = '';
            }
        }, 
        exportEven(){
            var self = this;          
            let parems = {};
            var url = '';
            parems = {
                searchContent:self.searchContent,
                orderStatus:self.orderStatus,
                beginTime:self.beginTime?self.formatDate(new Date(self.beginTime),"begin"):'',
                endTime:self.endTime?self.formatDate(new Date(self.endTime),"end"):'',
                paymentType:self.paymentType                 
            };
            var url = self.$server.exportOrderList+"?searchContent="+parems.searchContent+"&orderStatus="+parems.orderStatus+"&beginTime="+parems.beginTime+"&endTime="+parems.endTime+"&paymentType="+parems.paymentType+"&token="+getToken();  
            window.open(url);                   
        },         
        edit(data,type){
            this.selectData = data;
            if(type==1){
                this.dialogVisible=true;
            }else{
                this.$router.push({
                    path:`/H5WebView/H5Mail`,
                    query:{
                        id:JSON.stringify(data.id)
                    }
                })
            }
            
        },
        formatDate(date,type){
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
                if(type=="end"){
                    h = 23;
                    m1 = 59;
                    s = 59;                
                }else{
                    h = h<10?("0"+h):h;
                    m1 = m1<10?("0"+m1):m1;
                    s = s < 10 ? ("0" + s) : s;
                }
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
            }else{
                return '';
            }
        },        
        /**
         * 获取列表数据
         */
        getCooperationPlatformList(num){
            this.loading = true;
            let query = {
                params:{
                    pageNo:num||1,
                    pageSize:this.pageSize,
                    searchContent:this.searchContent,
                    orderStatus:this.orderStatus,
                    paymentType:this.paymentType,
                    beginTime:this.formatDate(this.beginTime,'begin'),
                    endTime:this.formatDate(this.endTime,'end'),
                }
            }
            this.$http.get(this.$server.h5GetOrderPage,query).then(res=>{
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
                    this.tableData = listIds;
                    this.pageAtion.pageTotal = contentdate.total;
                    this.pageAtion.paginationPage = num;
                    this.$nextTick(()=>{
                        this.loading = false; 
                    }) 
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
    .H5-order-wrap {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .editBox{
            .rowcss{
                overflow: hidden;
                div:nth-child(1){
                    width:120px;
                    line-height:24px;
                }
                div{
                    margin-bottom: 20px;
                    text-align: left;
                    padding:0 10px;
                    float: left;
                    line-height:24px;
                }
            }
        }    
        .page-content {
            background: #fff;
            padding:20px 0;
            margin:20px 0;
            box-shadow: 0px 0px 9px #edf1f7;
            .editor-btn {
                color:#9E0E00;
                font-size: 14px;
                padding: 0;
                height: 36px;
                line-height: 36px;
            }
            .block{
                text-align: center;
                margin-top:60px;
                padding-bottom:60px;
            }
        }
    }

</style>

