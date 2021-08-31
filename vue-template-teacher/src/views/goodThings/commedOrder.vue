<template>
<div>
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
                                        placeholder="输入订单号，电话，收货人或收货地址"
                                        class="search-form"
                                        width="100%"
                                        clearable
                                        style="width:200px"
                                        ></el-input>                            
                                <el-select style="width:120px" v-model="valueOne" placeholder="订单状态">
                                    <el-option
                                    v-for="item in optionsOne"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                <span>下单时间</span>
                                <el-date-picker
                                    v-model="dataStart"
                                    type="date"
                                    placeholder="年/月/日">
                                </el-date-picker>    
                                <el-date-picker
                                    v-model="dataEnd"
                                    type="date"
                                    placeholder="年/月/日">
                                </el-date-picker>                                                                               
                                <el-button v-if="$authJudge('record:member:select')" type="primary"  @click="searchMemberQuery">筛选</el-button>
                            </el-col>
                            <el-col :span="2" style="text-align: right;">
                                <el-button v-if="$authJudge('record:monthmember:select')" type="primary"  @click="headExport">导出</el-button>
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
                    prop="orderNum"
                    label="订单号"
                    align="center"
                    min-width="120">
                </el-table-column>                                                                                                   
                <el-table-column
                    label="商品"
                    align="center"
                    min-width="60">  
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">
                                <ul>
                                    <li v-for="(items,index) in liList" :key="index">{{items}}</li>
                                </ul>
                                </div>
                                <div>
                                    <div class="oneLine">1111111111111111111111111</div>
                                    <div class="oneLine">222222222222222</div>
                                    <div v-if="liList.length>2?true:false">...</div>
                                </div>
                            </el-tooltip>
                        </template>                                                   
                </el-table-column>  
                <el-table-column
                    prop="createdAt"
                    label="下单时间"
                    align="center"
                    min-width="120">
                </el-table-column> 
                <el-table-column
                    prop="payPrice"
                    label="订单价格"
                    align="center"
                    min-width="100">
                </el-table-column>  
                <el-table-column
                    prop="payPrice"
                    label="佣金"
                    align="center"
                    min-width="100">
                </el-table-column> 
                <el-table-column
                    prop="orderNum"
                    label="收货人"
                    align="center"
                    min-width="100">
                </el-table-column>  
                <el-table-column
                    prop="orderNum"
                    label="电话"
                    align="center"
                    min-width="100">
                </el-table-column>    
                <el-table-column
                    prop="orderNum"
                    label="收货地址"
                    align="center"
                    min-width="100">
                </el-table-column>                                                              
                <el-table-column
                    prop="totalIntegral"
                    label="订单状态"
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
                    prop="orderNum"
                    label="快递单号"
                    align="center"
                    min-width="120">
                </el-table-column>             
                <el-table-column
                    fixed="right"
                    label="操作"
                    align="center"
                    min-width="120">
                        <template slot-scope="scope">
                                <el-button type="text" class="black-btn" @click="commodityType(scope.row,'set')">发货</el-button> 
                                <el-button type="text" class="black-btn" @click="commodityType(scope.row,'get')">收货</el-button> 
                                <el-button type="text" class="black-btn" @click="commodityType(scope.row,'remove')">退货</el-button>                                                   
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
            title=""
            :visible.sync="pragramLIstDialog"
            width="400px"
            class="courseDialogCss"
            :show-close="true"
            :close-on-click-modal="false"
            center>
                <div style="text-align: center;width:100%;" v-if="selectType=='set'">
                    <el-input v-model.trim="classityName" style="width:200px;" placeholder="请输入快递名称及运单号" clearable></el-input>          
                    <el-button type="danger" style="margin-left:20px">确定</el-button> 
                </div>
                <div style="text-align: center;width:100%;" v-if="selectType=='get'||selectType=='remove'">
                    <el-checkbox v-model="checked">{{selectType=='get'?'收货确认':'退货确认'}}</el-checkbox>                
                    <el-button type="danger" style="margin-left:20px">确定</el-button>                   
                </div>                                           
                <span slot="footer" class="dialog-footer" v-if="selectType=='delete'">
                    <el-button type="primary" @click="pragramLIstDialogEven">确 定</el-button>
                    <el-button @click="pragramLIstDialog=false">取 消</el-button>
                </span>         
        </el-dialog>    
</div>
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
                            name:'国学好物',
                            pathInfo:''
                        },
                        {
                            name:'商品订单',
                            pathInfo:''
                        }                
            ],
            tableData:[],
            valueOne:'',
            liList:[
                '《上新了国画！》国画工具-毛笔（10%）',
                '《上新了国画！》国画工具-文房四宝4件套（8%）',
                '《上新了国画！》国画工具-品茶经典（54%）'
            ],
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
                    label: '已支付'                    
                },
                {
                    value: '2',
                    label: '退货'                    
                }                
            ],
            valueTwo:'-1',
            dataStart:'',
            dataEnd:'',
            telephoneList:[],
            loading:true,
            selectType:'',
            pragramLIstDialog:false,
            checked:false,
            classityName:''
        };
        },
        created() {
            this.telephoneList = cellphoneList.telePhoneList.join();
            // if(Number(sessionStorage['appHomeSetDate'])>0){
            //     this.dataStart = Number(sessionStorage['appHomeSetDate']);
            //     this.dataEnd = this.dataStart+86399000;            
            //     this.getStudylist(1);
            //     sessionStorage.removeItem('appHomeSetDate');
            // }else{
                this.getStudylist(1);
            // }
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
            commodityType(data,type){
                var self = this;
                this.selectData = data;
                this.pragramLIstDialog = true;  
                this.selectType = type;   
                this.checked = '';          
            },
            pragramLIstDialogEven(){
                var self = this,
                messageInfo='',
                urls = '',
                params = {
                    id:data.id
                };
                switch (state) {
                    case 'edit':
                        urls = '';
                        params['type'] = data;
                        messageInfo = '发货';
                        break;
                    case 'add':
                        urls = '';
                        params['type'] = data;
                        messageInfo = '收货';
                        break; 
                    case 'sort':
                        urls = '';
                        params['type'] = data;
                        messageInfo = '退货';
                        break;                                                                
                    default:
                        break;
                }
                self.$http.get(urls,{params}).then(res=>{
                    if(res.status==200){
                        if(type=='add'){
                            this.getProgramList(1);
                        }else{
                            this.getProgramList();
                        }
                        self.$message.success(messageInfo+'成功');
                        self.pragramLIstDialog=false;
                    }
                });                
            },                           
            //导出
            headExport(){
                    var self = this;
                    // encodeURIComponent(
                    var parems = {
                        token:getToken(),
                        searchContent:self.title||'',
                        state:self.valueOne,
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
                // encodeURIComponent(self.title)||'',
                var params = {
                    searchContent:self.title||'',
                    state:self.valueOne,
                    beginAt:self.formatDate(self.dataStart,"start"),
                    endAt:self.formatDate(self.dataEnd,'end'),
                    paymentType:'-1',
                    pageSize:self.pageSize,
                    pageNo:self.pageNo,                               
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
                    console.log(res);
                })            
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
.oneLine{
    overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis;    
}
</style>


