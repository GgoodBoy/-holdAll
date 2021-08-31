<template>
    <div>
        <el-row class="lSize24 lPadding20 lLine40 lMarginBO10 warryBackCss">
            <el-col :span="5" class="redFontColor">总充值:{{userNumer.totalIncome||0}}元</el-col>
            <el-col :span="7" class="redFontColor">今日已充值:{{userNumer.todayIncome||0}}元</el-col>
        </el-row>        
        <gxHead class="lMarginBO20" :headObj='headObj' v-on:dialogExport="exportInfo" v-on:inputValPortEven="inputStateVal"></gxHead>
        <!-- <gxTable :tableDatas="tableObj"></gxTable> -->
        <div>
            <el-table
                :data="tableObj.tableData"
                border
                v-loading="tableObj.loading"
                max-height="600"
                style="width: 100%">
                    <el-table-column
                        align="center"
                        label="付款账号"
                        min-width="150">
                            <template slot-scope="scope">
                                <p class="moneyOrRecord">{{scope.row.userPhone}}<span class="flag" v-if="telePhoneList.join().indexOf(scope.row.userPhone)!=-1">测</span></p>                          
                            </template>
                    </el-table-column>                
                    <el-table-column
                        prop="orderId"
                        label="订单号"
                        align="center"
                        :show-overflow-tooltip='true'
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="returnId"
                        label="第三方订单id"
                        :show-overflow-tooltip='true'
                        align="center"
                        min-width="140">
                    </el-table-column>
                    <el-table-column
                        prop="originName"
                        label="来源"
                        align="center"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="orderStatus"
                        label="订单状态"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="paymentTypeStatus2"
                        label="支付方式"
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="100">
                    </el-table-column>                
                    <el-table-column
                        prop="commodityPrice"
                        label="充值金额"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="payPrice"
                        label="实付金额"
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="100">
                    </el-table-column>                
                    <el-table-column
                        prop="createdAt"
                        label="充值日期"
                        :show-overflow-tooltip='true'
                        align="center"
                        min-width="80">
                    </el-table-column>               
                    <el-table-column
                        prop="cellphoneProvinceName"
                        label="省/直辖市"
                        align="center"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="cellphoneCityName"
                        label="市"
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="80">
                    </el-table-column>   
            </el-table>                
        </div>        
        <gxPaginaton :pageAtions="pageAtion" v-on:childByPageValue="childPageValue" ></gxPaginaton>
    </div>
</template>
<script>
import gxHead from "@/components/formSynthesisPlugin/gxHead"; 
// import gxTable from "@/components/formSynthesisPlugin/gxTable";
import { getToken,setToken,removeToken} from '@/utils/auth';
import gxPaginaton from "@/components/formSynthesisPlugin/gxPaginaton"; 
import eventAction from '../lEventAtion';
// moneyRecord
let actions = new eventAction()
//充值记录
export default {
    components:{
        gxHead,
        // gxTable,
        gxPaginaton
    },
    data(){
        return {
            tableObj:{
                tableData:[],
                // 1.编辑，2.下架，3.详情，4.排序
                marksArrs:[
                    {name:"编辑",type:1},
                    {name:"下架",type:2},
                    {name:"详情",type:3}
                    ],
                markState:false,//是否有操作栏
                loading:true,
                types:"moneyType",
                power:[]
            },
            pageAtion:{},
            headObj:{
                typeBoll:true,
                name:'moneyName',
                originArr:[],
                listType:{
                    listValOne:[{
                        value: 2,
                        label: '全部'
                        },{
                        value: 0,
                        label: '支付取消'
                        }, {
                        value: 1,
                        label: '支付成功'
                        }                                           
                    ],
                    paymentMethodArr:[
                        {value:-1,label:'全部'},
                        // {value:1,label:'夫子币余额'},
                        {value:2,label:'微信'},
                        {value:3,label:'支付宝'},
                        {value:4,label:'apple充值'},
                        {value:5,label:'微信内支付'},
                        {value:6,label:'华为支付'},
                        {value:7,label:'oppo支付'},
                        {value:8,label:'vivo支付'},
                        {value:9,label:'小米支付'},
                        {value: 10,label: '工行卡支付'}
                    ]   
                }
            },
            chooseStateOne:'',
            dataStart:'2019-10-17 00:00:00',
            paymentMethod:'',
            dataEnd:'',
            titleVal:'',
            userNumer:{},
            pageSize:10,
            provinceId:'',
            cityId:'',
            origin:-1,
            telePhoneList : [
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
            ]            
    }},
    created(){
        this.getListComeDate();
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }
        this.tableObj.power = flag;
        if(this.$route.query&&this.$route.query.condition){
            let condition = this.$route.query.condition;
            if(condition=='yestoday'){
                let startTime = Number(new Date());
                let yesTime =startTime-(new Date(new Date().toLocaleDateString() + ' 00:00:00').getTime());
                let endTime = startTime-86400000*1-yesTime;
                this.dataStart =endTime
                this.headObj.startTime =  endTime
            }
        }else{
            this.showData({pageSize:this.pageSize ,pageNo: 1});
        }   
        // actions.getData("/recharge/selectIncome","")
        //     .then(data => {  
        //         self.userNumer = data;
        //         // console.log("充值",data);
        //     })
        //     .fail(function(){                   
        //         console.log("出错啦!")}
        //     );    
        this.getMoneyInfo();  
        
    },
    props:{},
    computed:{},
    methods:{
        //渠道类型数据
        getListComeDate(){
            var self = this;
            self.$http.get(self.$server.getOriginList).then(res=>{
                if(res.status){
                    self.headObj.originArr = res.content;
                }
            })
        },            
        //表头输入信息过滤
        inputStateVal(valobj){
            var self = this;      
            self.tableObj.loading = true;
            self.chooseStateOne = valobj.status!=2?valobj.status:'';
            self.dataStart = valobj.dataStart;
            self.dataEnd = valobj.dataEnd;
            self.titleVal = valobj.title;
            self.paymentMethod = valobj.status1;
            self.provinceId = valobj.provinceId;
            self.cityId =valobj.cityId;
            self.origin = valobj.origin;
            var objParmises={
                pageSize:self.pageSize,
                pageNo: 1,
                orderIdOrUserPhone:valobj.title,//订单号
                orderStatus:self.chooseStateOne,//订单状态
                paymentMethod:self.paymentMethod,
                beginAt:actions.formatDate(Number(self.dataStart)),//开始时间
                endAt:Number(self.dataEnd)>0?actions.formatDate(Number(self.dataEnd)+86399000):self.dataEnd,//结束时间
                cellphoneProvinceId:self.provinceId,
                cellphoneCityId:self.cityId,
                origin:valobj.origin              
            }
            if(objParmises.paymentMethod==-1){
                delete objParmises.paymentMethod
            }
            self.getMoneyInfo();
            this.showData(objParmises);
        },
        getMoneyInfo(){
            var self = this;
            var params = {
                beginAt:actions.formatDate(Number(self.dataStart)),
                endAt:Number(self.dataEnd)>0?actions.formatDate(Number(self.dataEnd)+86399000):self.dataEnd
                };
                self.$http.get(self.$server.rechargeSelectIncome(params)).then(res=>{
                    if(res.status==200){
                         self.userNumer = res.content;
                    }
                })            
        },        
        // //表格组件数据传递
        // Routerpage(id){
        //    this.$router.push({name:'couponDetails',query:{id:id}});
        // },
        //分页子组件传递给父组件的方法
        childPageValue(pageNum){
            var self = this;
            this.tableObj.loading = true;
            //后期做接口字段过滤；
            var objParmises={
                pageSize:self.pageSize,
                pageNo: pageNum,
                orderIdOrUserPhone:self.titleVal,//订单号
                orderStatus:self.chooseStateOne,//订单状态
                beginAt:actions.formatDate(Number(self.dataStart)),//开始时间
                endAt:Number(self.dataEnd)>0?actions.formatDate(Number(self.dataEnd)+86399000):self.dataEnd,//结束时间
                paymentMethod:this.paymentMethod,
                cellphoneProvinceId:self.provinceId,
                cellphoneCityId:self.cityId,
                origin:self.origin                
            }
            if(objParmises.paymentMethod==-1){
                delete objParmises.paymentMethod
            }            
            this.showData(objParmises);
        },
       showData(paramsObj){
            var self = this;
            var url = '/recharge/selectPage';
            actions.getData(url,paramsObj)
                .then(data => {
                    let obhArr = actions.tableHead.moneyRecord;
                    let endObj=actions.filterData(data,obhArr);
                    console.log(endObj.tableObj.tableData)
                    self.tableObj.tableData = endObj.tableObj.tableData;
                    self.pageAtion = endObj.pageAtion
                    if(endObj.pageAtion.pageTotal>self.pageSize){
                        self.pageAtion['pageBool'] = false;
                    }else{
                        self.pageAtion['pageBool'] = true;
                    }
                    self.$nextTick(function(){
                            self.tableObj.loading = false; 
                    })   
                })
                .fail(function(){
                    self.pageAtion['pageBool'] = true;
                    self.$nextTick(function(){
                            self.tableObj.loading = false; 
                    })                    
                    console.log("出错啦!")}
                );                  
        },
        exportInfo(){
            var self = this;
            self.titleVal=self.titleVal!=undefined?self.titleVal:'';
            self.dataEnd=self.dataEnd!=undefined?self.dataEnd:'';
            self.chooseStateTwo=self.chooseStateTwo!=undefined?self.chooseStateTwo:'';   
            self.chooseStateOne=self.chooseStateOne!=undefined?self.chooseStateOne:'';
            let paymentMethod = this.paymentMethod==-1?'':this.paymentMethod
            var endUms = Number(self.dataEnd)>0?actions.formatDate(Number(self.dataEnd)+86399000):self.dataEnd;         
            var url = self.$server.exportExcelMoney+"?orderIdOrUserPhone="+self.titleVal+"&orderStatus="+self.chooseStateOne+"&paymentMethod="+paymentMethod+"&beginAt="+actions.formatDate(Number(self.dataStart))+"&endAt="+endUms+"&token="+getToken()+"&cellphoneProvinceId="+self.provinceId+"&cellphoneCityId="+self.cityId+"&origin="+self.origin;  
            window.open(url);   
        }
    },
    mounted(){}
}
</script>
<style>
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

