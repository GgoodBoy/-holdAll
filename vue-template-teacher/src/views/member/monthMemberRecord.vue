<template>
<el-row>
    <el-col>
            <el-row class="lLine40 headerDiv">
                <el-col class="lSize18">
                    <el-row class="lSize16">
                        <el-col :span="8" class="lLeft-r">
                            <breadcrumb :menuList ='titleList'></breadcrumb>
                        </el-col>
                    </el-row>                
                </el-col>
                <el-col class="lRight-r lMarginTop20">
                    <el-row :gutter="20">
                        <el-col :span="22" style="text-align: left;">
                            <el-input v-model.trim="title"
                                    placeholder="输入付款账号查询"
                                    class="search-form"
                                    width="100%"
                                    clearable
                                    style="width:200px"
                                    @keyup.native="proving1"
                                    ></el-input>                            
                            <el-select style="width:120px" v-model="valueOne">
                                <el-option
                                v-for="item in optionsOne"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select style="width:120px" v-model="valueTwo">
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
                                placeholder="开始时间">
                            </el-date-picker>    
                            <el-date-picker
                                v-model="dataEnd"
                                type="date"
                                placeholder="结束时间">
                            </el-date-picker>                                                                               
                            <el-button v-if="$authJudge('record:member:select')" type="primary"  @click="searchMemberQuery">查询</el-button>
                        </el-col>
                        <el-col :span="2" style="text-align: right;">
                            <el-button v-if="$authJudge('record:monthmember:export')" type="primary"  @click="headExport">导出</el-button>
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
        style="width: 100%">
            <el-table-column
                prop="sortId"
                label="序号"
                align="center"
                min-width="50">
            </el-table-column>                                                                                         
            <el-table-column
                prop="cellphone"
                label="付款账号"
                align="center"
                min-width="120"> 
                    <template slot-scope="scope">
                            <div class="positionCss" style="line-height:40px;">
                                <div class="absoluteCss testCellphone" v-if="telephoneList.indexOf(scope.row.cellphone)!=-1">测</div>
                                {{scope.row.cellphone}}
                            </div>                                                     
                    </template>                                       
            </el-table-column>  
            <el-table-column
                prop="orderNum"
                label="订单号"
                align="center"
                min-width="120">
            </el-table-column> 
            <el-table-column
                prop="returnNum"
                label="第三方订单号"
                align="center"
                min-width="120">
            </el-table-column>
            <el-table-column
                prop="totalIntegral"
                label="状态"
                align="center"
                min-width="100">
                    <template slot-scope="scope">
                            <el-row> 
                                <el-col class="lCenter-r"> 
                                    <p v-if="scope.row.state==1">支付成功</p>
                                    <p v-else>支付取消</p>
                                </el-col>                                                                    
                            </el-row>                                                      
                        </template>                 
            </el-table-column>               
            <el-table-column
                prop="payPrice"
                label="价格"
                align="center"
                min-width="60">
            </el-table-column>  
            <el-table-column
                prop="totalIntegral"
                label="支付方式"
                align="center"
                min-width="60">
                    <template slot-scope="scope">
                            <el-row> 
                                <el-col class="lCenter-r"> 
                                    <p v-if="scope.row.paymentType==1">夫子币</p>
                                    <p v-if="scope.row.paymentType==2">微信</p>
                                    <p v-if="scope.row.paymentType==3">支付宝</p>
                                    <p v-if="scope.row.paymentType==4">apple充值</p>
                                    <p v-if="scope.row.paymentType==5">微信内支付</p>
                                    <p v-if="scope.row.paymentType==6">华为支付</p>
                                    <p v-if="scope.row.paymentType==7">Oppo支付</p>
                                    <p v-if="scope.row.paymentType==8">vivo支付</p>
                                    <p v-if="scope.row.paymentType==9">小米支付</p>
                                    <p v-if="scope.row.paymentType==10">工行卡支付</p>
                                </el-col>                                                                    
                            </el-row>                                                      
                        </template>                 
            </el-table-column>                                                                                                                                  
            <el-table-column
                prop="createdAt"
                label="购买时间"
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
</template>
<script>
import datalist from '../../components/formSynthesisPlugin/gxTitleList';
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
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
                            name:'订单管理系统',
                            pathInfo:''
                        },
                        {
                            name:'月度会员记录',
                            pathInfo:''
                        }                
            ],
            tableData:[],
            valueOne:'-1',
            optionsOne:[
                {
                    value: '-1',
                    label: '全部'                    
                },
                {
                    value: '0',
                    label: '待支付'                    
                },
                {
                    value: '1',
                    label: '支付成功'                    
                }                
            ],
            valueTwo:'-1',
            optionsTwo:[
                // -1全部 1 夫子币余额 2 微信 3 支付宝 4 apple充值 5微信内支付 6华为支付 7Oppo支付 8vivo支付 9小米支付
                {
                    value: '-1',
                    label: '全部'                    
                },
                {
                    value: '1',
                    label: '夫子币余额'                    
                },
                {
                    value: '2',
                    label: '微信'                    
                },
                {
                    value: '3',
                    label: '支付宝'                    
                },
                {
                    value: '4',
                    label: 'apple充值'                    
                },
                {
                    value: '5',
                    label: '微信内支付'                    
                },
                {
                    value: '6',
                    label: '华为支付'                    
                },
                {
                    value: '7',
                    label: 'Oppo支付'                    
                },
                {
                    value: '8',
                    label: 'vivo支付'                    
                },
                {
                    value: '9',
                    label: '小米支付'                    
                },
                {
                    value: 10,
                    label: '工行卡支付'
                }                
            ],
            dataStart:'',
            dataEnd:'',
            telephoneList:[],
            loading:true
        };
        },
        created() {
            this.telephoneList = cellphoneList.telePhoneList.join();
            if(Number(sessionStorage['appHomeSetDate'])>0){
                this.dataStart = Number(sessionStorage['appHomeSetDate']);
                this.dataEnd = this.dataStart+86399000;            
                this.getStudylist(1);
                sessionStorage.removeItem('appHomeSetDate');
            }else{
                this.getStudylist(1);
            }
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
            breadcrumb
        },        
        methods: {
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
            //导出
            headExport(){
                    var self = this;
                    var parems = {
                        token:getToken(),
                        searchContent:encodeURIComponent(self.title)||'',
                        state:self.valueOne,
                        paymentType:self.valueTwo,
                        beginAt:self.formatDate(self.dataStart,"start"),
                        endAt:self.formatDate(self.dataEnd,'end')
                    };
                    self.download2(self.$server.downMonthmemberList(parems)); 
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
                var params = {
                    searchContent:encodeURIComponent(self.title)||'',
                    pageSize:self.pageSize,
                    pageNo:self.pageNo,
                    state:self.valueOne,
                    paymentType:self.valueTwo,
                    beginAt:self.formatDate(self.dataStart,"start"),
                    endAt:self.formatDate(self.dataEnd,'end')           
                };
                self.$http.get(self.$server.getOrderMonthMember(params)).then(res=>{
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


