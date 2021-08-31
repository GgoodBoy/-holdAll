<template>
    <div>
        <el-row class="lSize24 lPadding20 lLine40 lMarginBO10 warryBackCss">
            <el-col :span="6" class="redFontColor">总收入:{{userNumer.totalIncome||0}}元</el-col>
            <el-col :span="6" class="redFontColor">今日已收入:{{userNumer.todayIncome||0}}元</el-col>
            <el-col :span="5" :offset="2" class="redFontColor">总订单:{{userNumerSecond.allCount||0}}单</el-col>
            <el-col :span="5" class="redFontColor">今日订单:{{userNumerSecond.todayCount||0}}单</el-col>            
        </el-row>  
        <gxHead :headObj='headObj' v-on:dialogExport="exportInfo" v-on:inputValPortEven="inputStateVal"></gxHead>
        <div class="my-table">
            <el-table
                border
                :data="tableObj.tableData"
                v-loading="tableObj.loading"
                style="width: 100%">
                <el-table-column
                    align="center"
                    label="付款账号"
                    min-width="150">
                        <template slot-scope="scope">
                            <p class="moneyOrRecord">{{scope.row.userPhone}}<span class="flag" v-if="telePhoneList.indexOf(Number(scope.row.userPhone))!=-1">测</span></p>                          
                        </template>
                    </el-table-column>                  
                <el-table-column
                    prop="orderId"
                    label="订单号"
                    align="center"
                    min-width="150"
                    show-overflow-tooltip>
                </el-table-column>                    
                <el-table-column
                    prop="commodityTitle"
                    label="课程名称"
                    align="center"
                    min-width="120"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="commodityTitle"
                    label="状态"
                    align="center"
                    min-width="80"
                    >    
                    <template slot-scope="scope">
                        <!-- 订单状态 0 待支付 1 支付成功2.已取消 -->
                        <span v-if="scope.row.orderStatus==1">支付成功</span>
                        <span v-else-if="scope.row.orderStatus==2">已取消</span>
                        <span v-else>待支付</span>
                    </template>                                   
                </el-table-column>
                <el-table-column
                    label="支付方式"
                    align="center"
                    min-width="100"
                    >
                    <template slot-scope="scope">
                        <!-- 支付类型 1 夫子币余额 2 微信 3 支付宝 4 apple充值 5微信内支付 6华为支付 7Oppo支付 8vivo支付 9小米支付 10工行卡支付 -->
                        <span v-if="scope.row.paymentType==1">夫子币余额</span>
                        <span v-else-if="scope.row.paymentType==2">微信</span>
                        <span v-else-if="scope.row.paymentType==3">支付宝</span>
                        <span v-else-if="scope.row.paymentType==4">apple充值</span>
                        <span v-else-if="scope.row.paymentType==5">微信内支付</span>
                        <span v-else-if="scope.row.paymentType==6">华为支付</span> 
                        <span v-else-if="scope.row.paymentType==7">Oppo支付</span>
                        <span v-else-if="scope.row.paymentType==8">vivo支付</span>
                        <span v-else-if="scope.row.paymentType==9">小米支付</span>                        
                        <span v-else-if="scope.row.paymentType==10">工行卡支付</span>
                    </template>                    
                </el-table-column>
                <el-table-column
                    prop="commodityPrice"
                    label="应付"
                    align="center"
                    min-width="60"
                    >
                </el-table-column>
                <el-table-column
                    prop="payPrice"
                    label="实付"
                    align="center"
                    min-width="60"
                    >
                </el-table-column>
                <el-table-column
                    prop="cellphoneProvinceName"
                    label="省/直辖市"
                    align="center"
                    min-width="100"
                    >
                </el-table-column>
                <el-table-column
                    prop="cellphoneCityName"
                    label="市"
                    align="center"
                    min-width="100">
                </el-table-column>
                <el-table-column
                    prop="originName"
                    label="来源"
                    align="center"
                    min-width="150"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="returnId"
                    label="第三方订单号"
                    align="center"
                    min-width="150"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="proportion"
                    label="佣金"
                    align="center"
                    min-width="100"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="payProportion"
                    label="渠道费用"
                    align="center"
                    min-width="100"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="bonusRatio"
                    label="分成比例"
                    align="center"
                    min-width="100"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    label="优惠"
                    align="center"
                    min-width="180">
                    <template slot-scope="scope">
                        <p>{{scope.row.couponDetail}}</p>
                        <p v-if="scope.row.integralDeDuctionPrice>0?true:false">使用积分:{{scope.row.integralNum}}</p>
                    </template>                    
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="付款日期"
                    align="center"
                    min-width="160">
                </el-table-column>
                <el-table-column
                    prop="pipelineName"
                    label="渠道"
                    align="center"
                    min-width="100">
                </el-table-column>   
                <el-table-column
                    prop="totalStudyDuration"
                    label="学习时长(秒)"
                    align="center"
                    min-width="140">
                </el-table-column>              
            </el-table>
        </div>
        <gxPaginaton :pageAtions="pageAtion" v-on:childByPageValue="childPageValue" ></gxPaginaton>
    </div>
</template>
<script>
import gxHead from "@/components/formSynthesisPlugin/gxHead"; 
import gxPaginaton from "@/components/formSynthesisPlugin/gxPaginaton";  
import { getToken,setToken,removeToken} from '@/utils/auth';
import eventAction from '../lEventAtion';
let actions = new eventAction()
// 订单记录
export default {
    components:{
        gxHead,
        gxPaginaton
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
            tableObj:{
                tableData:[],
                // 1.编辑，2.下架，3.详情，4.排序
                marksArrs:[
                    {name:"编辑",type:1},
                    {name:"下架",type:2},
                    {name:"详情",type:3}
                    ],
                markState:false,
                loading:true,
                types:"record",
                power:[]
            },
            pageAtion:{},
            headObj:{
                typeBoll:true, //1 夫子币余额 2 微信 3 支付宝 4 apple充值
                name:'recordName',
                originArr:[],
                listType:{
                    listValOne:[
                        {
                        value: 3,
                        label: '全部'                            
                        }
                        ,{
                        value: 0,
                        label: '支付取消'
                        }, {
                        value: 1,
                        label: '支付成功'
                        }                                            
                    ],
                    listValTwo:[
                        {
                        value: 0,
                        label: '全部'                            
                        },                        
                        {
                        value: 1,
                        label: '夫子币余额'
                        }, {
                        value: 2,
                        label: '微信'
                        }, {
                        value: 3,
                        label: '支付宝'
                        }, {
                        value: 4,
                        label: 'apple充值'
                        },{
                        value: 5,
                        label: '微信内支付'
                        },{
                        value: 6,
                        label: '华为支付'
                        },{
                        value: 7,
                        label: 'oppo支付'
                        },{
                        value: 8,
                        label: 'vivo支付'
                        },
                        {
                        value: 9,
                        label: '小米支付'
                        },
                        {
                        value: 10,
                        label: '工行卡支付'
                        }                           
                    ]
                }
            },
            chooseStateOne:'',
            chooseStateTwo:'',
            dataStart:'',
            dataEnd:'',
            titleVal:'',
            userNumer:{},
            userNumerSecond:{},
            pageSize:10,
            provinceId:'',
            cityId:'',
            origin:'',
            pipelineName:''

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
        var self = this
        self.headObj.startTime =  Number(sessionStorage['appHomeSetDate']);  
        if(self.headObj.startTime>0){
            if((Number(new Date())-self.headObj.startTime)<86400000*2){
                // this.showData({pageSize:self.pageSize ,pageNo: 1,beginAt:actions.formatDate(self.headObj.startTime),endAt:actions.formatDate(self.headObj.startTime)});
                console.log("当前时间设定后初始化不进行访问。");
            }else{
            var objParmises={
                pageSize:self.pageSize,
                pageNo: 1,
                orderIdOrUserPhone:'',//订单号
                orderStatus:'',//订单状态
                paymentMethod:'',//支付类型
                beginAt:actions.formatDate(self.headObj.startTime),
                endAt:actions.formatDate(Number(new Date())),
                cellphoneProvinceId:-1,
                cellphoneCityId:-1,
                origin:-1,
                pipelineId:-1                  
            }                 
                this.showData(objParmises);
            }
            
            // actions.getData("/order/selectIncome")
            //     .then(data => {  
            //         self.userNumer = data;
            //         sessionStorage.removeItem('appHomeSetDate')
            //     })
            //     .fail(function(){                   
            //         console.log("出错啦!");}
            //     ); 
            this.getMoneyInfo();
            actions.getData("/order/selectOrderCount","")
                .then(data => {  
                    self.userNumerSecond = data;
                })
                .fail(function(){                   
                    console.log("出错啦!");}
                );  
            sessionStorage.removeItem('appHomeSetDate'); 
        }else{
            var objParmises={
                pageSize:self.pageSize,
                pageNo: 1,
                orderIdOrUserPhone:'',//订单号
                orderStatus:'',//订单状态
                paymentMethod:'',//支付类型
                beginAt:'',
                endAt:'',
                cellphoneProvinceId:-1,
                cellphoneCityId:-1,
                origin:-1,
                pipelineId:-1                  
            }            
            this.showData(objParmises);
            // actions.getData("/order/selectIncome")
            //     .then(data => {  
            //         self.userNumer = data;
            //     })
            //     .fail(function(){                   
            //         console.log("出错啦!");}
            //     ); 
            this.getMoneyInfo();
            actions.getData("/order/selectOrderCount","")
                .then(data => {  
                    self.userNumerSecond = data;
                })
                .fail(function(){                   
                   console.log("出错啦!");}
                );             
        }

    },
    props:[],
    computed:{},
    methods:{
        //表头输入信息过滤
        inputStateVal(valobj){
            var self = this;      
            self.tableObj.loading = true;
            self.chooseStateTwo = valobj.status1!=0?valobj.status1:'';
            self.chooseStateOne = valobj.status!=3?valobj.status:'';
            self.dataStart = valobj.dataStart;
            self.dataEnd = valobj.dataEnd;
            self.titleVal = valobj.title;
            self.provinceId = valobj.provinceId||-1;
            self.cityId = valobj.cityId||-1;     
            self.origin = valobj.origin||-1; 
            self.pipelineName = valobj.pipelineName||-1;    
            var objParmises={
                pageSize:self.pageSize,
                pageNo: 1,
                orderIdOrUserPhone:valobj.title,//订单号
                orderStatus:self.chooseStateOne,//订单状态
                paymentMethod:self.chooseStateTwo,//支付类型
                beginAt:actions.formatDate(Number(self.dataStart)),
                endAt:Number(self.dataEnd)>0?actions.formatDate(Number(self.dataEnd)+86399000):self.dataEnd,
                cellphoneProvinceId:self.provinceId||-1,
                cellphoneCityId:self.cityId||-1,
                origin:valobj.origin||-1,
                pipelineId:valobj.pipelineName||-1                  
            }
            this.getMoneyInfo();
            this.showData(objParmises);
        },
        getMoneyInfo(){
            var self = this;
            var params = {
                beginAt:actions.formatDate(Number(self.dataStart)),
                endAt:Number(self.dataEnd)>0?actions.formatDate(Number(self.dataEnd)+86399000):self.dataEnd,
                paymentType:self.chooseStateTwo,
                };
                self.$http.get(self.$server.orderSelectInco(params)).then(res=>{
                    if(res.status==200){
                         self.userNumer = res.content;
                    }
                })            
        },        
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
                paymentMethod:self.chooseStateTwo,//支付类型
                beginAt:actions.formatDate(Number(self.dataStart)),
                endAt:Number(self.dataEnd)>0?actions.formatDate(Number(self.dataEnd)+86399000):self.dataEnd,
                cellphoneProvinceId:self.provinceId||-1,
                cellphoneCityId:self.cityId||-1,
                origin:self.origin||-1,
                pipelineId:self.pipelineName||-1                                         
            }            
            this.showData(objParmises);
        },
        //渠道类型数据
        getListComeDate(){
            var self = this;
            self.$http.get(self.$server.getOriginList).then(res=>{
                if(res.status){
                    self.headObj.originArr = res.content;
                }
            })
        },                 
       showData(paramsObj){
            var self = this;
            var url = '/order/selectPage';
            actions.getData(url,paramsObj)
                .then(data => {
                    console.log("data",data);
                    let obhArr = actions.tableHead.orderRecord;
                    let endObj=actions.filterData(data,obhArr,'record');
                    self.tableObj.tableData = data.list;
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
                   console.log("出错啦!");}
                );
        },
        exportInfo(){
            var self = this;
            self.dataStart=self.dataStart!=undefined?self.dataStart:'';
            self.titleVal=self.titleVal!=undefined?self.titleVal:'';
            self.dataEnd=self.dataEnd!=undefined?self.dataEnd:'';
            self.chooseStateTwo=self.chooseStateTwo!=undefined?self.chooseStateTwo:'';   
            self.chooseStateOne=self.chooseStateOne!=undefined?self.chooseStateOne:'';   
            var endUms = Number(self.dataEnd)>0?actions.formatDate(Number(self.dataEnd)+86399000):self.dataEnd;           
            var url = self.$server.exportExcelOrder+"?type="+1+"&orderIdOrUserPhone="+self.titleVal+"&orderStatus="+self.chooseStateOne+"&paymentMethod="+self.chooseStateTwo+"&beginAt="+actions.formatDate(self.dataStart)+"&endAt="+endUms+"&token="+getToken()+'&paymentMethod='+this.
chooseStateTwo+"&cellphoneProvinceId="+self.provinceId+"&cellphoneCityId="+self.cityId+"&origin="+self.origin||-1;  
            window.open(url);   
        }        
    },
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.warryBackCss{
    background: #FFC0C3;
    border-radius: 5px;
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

