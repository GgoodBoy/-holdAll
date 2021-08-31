<template>
<div>
    <el-row>
        <el-col>
                <el-row class="lLine40 headerDiv">
                    <el-col class="lSize18">
                        <el-row class="lSize16">
                            <el-col class="lLeft-r">
                                <breadcrumb :menuList ='titleList'></breadcrumb>
                            </el-col>
                        </el-row>                
                    </el-col>
                    <el-col class="lRight-r lMarginTop20">
                        <el-row :gutter="20">
                            <el-col :span="22" style="text-align: left;">
                                <el-input v-model.trim="title"
                                        placeholder="输入订单号或手机号查询"
                                        class="search-form"
                                        width="100%"
                                        clearable
                                        style="width:200px"
                                        @keyup.native="proving1"
                                        ></el-input>    
                                <el-select style="width:140px" v-model="valueOne" placeholder="状态">
                                    <el-option
                                    v-for="item in optionsOne"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select style="width:120px" v-model="valueTwo" placeholder="支付方式">
                                    <el-option
                                    v-for="item in optionsTwo"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>                                            
                                <el-date-picker
                                    v-model="dataStart"
                                    type="date"
                                    placeholder="订单开始时间">
                                </el-date-picker>    
                                <el-date-picker
                                    v-model="dataEnd"
                                    type="date"
                                    placeholder="结束时间">
                                </el-date-picker>                                                                                                    
                                <el-button v-if="$authJudge('wisdomplatform:order:select')" type="primary"  @click="searchMemberQuery">查询</el-button>
                            </el-col>
                            <el-col :span="2" style="text-align: right;">
                                <el-button v-if="$authJudge('wisdomplatform:order:export')" type="primary"  @click="headExport">导出</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>        
        </el-col>
        <el-col class="lMarginTop20">
            <el-table
            :data="tableData"
            border
            v-loading="loading"
            tooltip-effect="dark"
            style="width: 100%">
                <el-table-column
                    prop="sortId"
                    label="序号"
                    align="center"
                    min-width="50">
                </el-table-column>                                                                                         
                <el-table-column
                    prop="cellphone"
                    label="账号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120">                                       
                </el-table-column>  
                <el-table-column
                    prop="orderId"
                    :show-overflow-tooltip="true"
                    label="订单号"
                    align="center"
                    min-width="120">
                </el-table-column> 
                <el-table-column
                    prop="returnNum"
                    label="状态"
                    align="center"
                    min-width="120">
                        <template slot-scope="scope">
                                <el-row> 
                                    <el-col class="lCenter-r"> 
                                        <p v-if="scope.row.orderStatus==1">支付成功</p>
                                        <p v-if="scope.row.orderStatus==2">待支付</p>
                                    </el-col>                                                                    
                                </el-row>                                                      
                            </template>
                </el-table-column>
                <el-table-column
                    label="支付方式"
                    align="center"
                    min-width="100">
                        <template slot-scope="scope">
                                <el-row> 
                                    <el-col class="lCenter-r"> 
                                        <p v-if="scope.row.paymentType==1">支付宝</p>
                                        <p v-if="scope.row.paymentType==2">微信</p>
                                    </el-col>                                                                    
                                </el-row>                                                      
                            </template>                   
                </el-table-column>               
                <el-table-column
                    prop="title"
                    :show-overflow-tooltip="true"
                    label="商品名称"
                    align="center"
                    min-width="120">
                </el-table-column>  
                <el-table-column
                    :show-overflow-tooltip="true"
                    label="地区"
                    align="center"
                    min-width="140"> 
                        <template slot-scope="scope">
                                <span v-if='scope.row.cellphoneCityName'>
                                    {{scope.row.cellphoneProvinceName+'/'+scope.row.cellphoneCityName}}
                                </span>
                                <span v-if='!scope.row.cellphoneCityName'>
                                    {{scope.row.cellphoneProvinceName}}
                                </span>                                              
                            </template>               
                </el-table-column>                                                                                                                                  
                <el-table-column
                    prop="originName"
                    label="来源"
                    align="center"
                    min-width="100"
                    >                       
                </el-table-column>                                                                                                                                   
                <el-table-column
                    prop="actualPay"
                    label="实付"
                    align="center"
                    min-width="100"
                    >                       
                </el-table-column>                                                                                                                                
                <el-table-column
                    prop="returnId"
                    label="第三方订单"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    >                       
                </el-table-column>   
                <el-table-column
                    prop="createdAt"
                    :show-overflow-tooltip="true"
                    label="创建时间"
                    align="center"
                    min-width="120"
                    >
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
</template>
<script>
import datalist from '../../components/formSynthesisPlugin/gxTitleList';
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import Dialog from "@/components/myDialog/myDialog";
let cellphoneList = new datalist()
export default {
        data(){
        return {
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },   
            pageSize:10,
            pageNo:1,
            title:'',
            titleList:[
                        {
                            name:'国学智慧平台',
                            pathInfo:''
                        },
                        {
                            name:'续费订单',
                            pathInfo:''
                        }               
            ],
            tableData:[],
            valueOne:'',
            optionsOne:[
                {
                    value: '-1',
                    label: '全部'                    
                },
                {
                    value: '1',
                    label: '支付成功'                    
                },
                {
                    value: '2',
                    label: '待支付'                    
                }                
            ],
            valueTwo:'',
            optionsTwo:[
                {
                    value: '-1',
                    label: '全部'                    
                },
                {
                    value: '1',
                    label: '支付宝'                    
                },
                {
                    value: '2',
                    label: '微信'                    
                }                
            ],
            dataStart:'',
            dataEnd:'',
            telephoneList:[],
            loading:true,
            courseList:[]
        };
        },
        created() {
                this.getStudylist(1);
            
        },
        watch:{              
            dataEnd: function(curVal,oldVal){
                var self = this;
                if(Number(self.dataStart)>Number(curVal)){
                    self.dataEnd = null;
                }           
            },  
            dataStart: function(curVal,oldVal){
                var self = this;
                if(Number(self.dataEnd)<Number(curVal)){
                    self.dataEnd = null;
                }           
            }
        },         
        components:{
            breadcrumb,
            Dialog
        },        
        methods: {
            couponEditObjNo(){},
            couponEditObjOk(){},
            handleSelectionChange(data){
                console.log(data);
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
             * 导出
             */
            headExport(){
                let self = this;
                let token = getToken()
                let params = {
                        cellphoneOrOrderId:encodeURIComponent(self.title)||'',
                        paymentType:self.valueTwo,
                        orderStatus:self.valueOne,
                        beginAt:self.formatDate(self.dataStart,"start"),
                        endAt:self.formatDate(self.dataEnd,'end')                     
                }
                let url = `${this.$server.wisdomExportOrderList}?token=${token}&cellphoneOrOrderId=${params.cellphoneOrOrderId}&paymentType=${params.paymentType}&orderStatus=${params.orderStatus}&beginAt=${params.beginAt}&endAt=${params.endAt}`
                window.open(url)
            },   
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
            searchMemberQuery(){
                this.getStudylist(1);
            },
            getStudylist(num){
                var self = this;
                if(num){
                    self.pageNo = num;
                }
                self.loading = true; 
                var query = {
                    params:{
                        cellphoneOrOrderId:encodeURIComponent(self.title)||'',
                        pageSize:self.pageSize,
                        pageNo:self.pageNo,
                        paymentType:self.valueTwo,
                        orderStatus:self.valueOne,
                        beginAt:self.formatDate(self.dataStart,"start"),
                        endAt:self.formatDate(self.dataEnd,'end') 
                    }          
                };
                self.$http.get(self.$server.wisdomOrderList,query).then(res=>{
                if(res.status==200){
                    var listIds = [];
                    var contentdate = res.content;
                    var nextPage = contentdate.nextPage;
                    var prePage = contentdate.prePage; 
                   if(contentdate.list.length){
                        listIds = contentdate.list.map(function(element,index){
                            if(contentdate.pageNum==1){
                                element.sortId = index+1;
                                return element;
                            }else if(contentdate.pageNum>1){
                                element.sortId = (contentdate.pageNum-1)*10+index+1;
                                return element;
                            }
                        }); 
                   }; 
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loading = false; 
                }
                })            
        },       
        proving1(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.title)){
                this.title='';
            }
        },              
        //分页
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }            
        }            
        }
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
.testCellphone{
    top: 3px;
    right: 0;
    background: #9E0E00;
    color: #fff;
    font-size: 10px;
    padding: 3px;
    line-height: 11px;
    border-radius: 10px;    
}
</style>


