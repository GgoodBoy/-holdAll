<template>
    <div>
        <!-- <gxBreadcrumb></gxBreadcrumb> -->
        <el-row class="lSize24 lPadding20 lLine40 lMarginBO10 warryBackCss" style="">
            <el-col class="redFontColor">{{couponDetai.title||"王大锤喜欢喝奶茶"}}</el-col>
            <el-col v-if="Number(couponDetai.validDays)>0" class="redFontColor">{{statesCouponDetails||'无状态'}} | 优惠券有效使用时间 : {{couponDetai.validDays}}</el-col>
            <el-col v-else class="redFontColor">{{statesCouponDetails||'无状态'}} | 优惠券有效使用时间 : {{couponDetai.beginAt}} — {{couponDetai.endAt}}</el-col>
            <el-col class="redFontColor" v-if="couponDetai.couponType==3">参加课程:{{couponDetai.courseNames}}</el-col>
        </el-row>        
        <gxHead :headObj='headObj' v-on:dialogExport="exportInfo" v-on:inputValPortEven="inputStateVal"></gxHead>
        <!-- <gxTable :tableDatas="tableObj"></gxTable> -->
        <div>
            <el-table
                :data="tableObj.tableData"
                border
                v-loading="tableObj.loading"
                max-height="600"
                style="width: 100%">               
                    <el-table-column
                        prop="userPhone"
                        label="用户账户"
                        align="center"
                        :show-overflow-tooltip='true'
                        min-width="130">
                    </el-table-column>
                    <el-table-column
                        prop="sourceClientTypeName"
                        label="用户来源"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="useCourseTitle"
                        label="课程名称"
                        :show-overflow-tooltip='true'
                        align="center"
                        min-width="140">
                    </el-table-column>
                    <el-table-column
                        prop="used"
                        label="状态"
                        align="center"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="couponCode"
                        label="劵码"
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="180">
                    </el-table-column>
                    <el-table-column
                        prop="reducedPrice"
                        label="金额"
                        align="center"
                        min-width="150">
                    </el-table-column>  
            </el-table>                
        </div>                        
        <gxPaginaton :pageAtions ="pageAtion" v-on:childByPageValue="childPageValue"></gxPaginaton>        
    </div>
</template>
<script>
import gxHead from "@/components/formSynthesisPlugin/gxHead"; 
import gxTable from "@/components/formSynthesisPlugin/gxTable";
import gxBreadcrumb from "@/components/formSynthesisPlugin/gxBreadcrumb"; 
import { getToken,setToken,removeToken} from '@/utils/auth';
import gxPaginaton from "@/components/formSynthesisPlugin/gxPaginaton";  
import eventAction from '../../lEventAtion';
let actions = new eventAction();
export default {
    components:{
        gxHead,
        gxTable,
        gxBreadcrumb,
        gxPaginaton
    },    
    data(){
        return {
            tableObj:{
                tableData:[],
                // 1.编辑，2.下架，3.详情，4.排序
                marksArrs:[],
                markState:false,
                loading:true
            },
            pageAtion:{},
            headObj:{
                typeBoll:true,
                name:'detailsName',
                title:'优惠券详情',
                listType:{
                    listValOne:[
                    {
                    value: 3,
                    label: '全部'
                    },
                    {
                    value: 0,
                    label: '未使用'
                    }, {
                    value: 1,
                    label: '已使用'
                    },{
                    value: 2,
                    label: '已锁定'
                    }]
                },
                menuList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'优惠券系统',
                            pathInfo:'/marketelist/coupon'
                        },
                        {
                            name:'优惠券详情',
                            pathInfo:''
                        }
                ]                 
            },
            detailsId:'',
            chooseState:'',
            titleVal:'',
            pageSize:10,
            couponDetai:{},
            statesCouponDetails:''            
    }},
    created(){
        this.detailsId=this.$route.query.id;
        this.showData({pageSize:this.pageSize ,pageNo: 1,id:this.detailsId});
    },
    props:{},
    computed:{},
    methods:{
        inputStateVal(valobj){
            var self = this;      
            self.tableObj.loading = true;
            self.chooseState =(valobj.status==undefined||valobj.status==3)?'':valobj.status; 
            self.titleVal =valobj.title; 
            self.showData({pageSize:self.pageSize ,pageNo: 1,userPhone:self.titleVal,used:self.chooseState,id:self.detailsId});
        },        
        //分页子组件传递给父组件的方法
        childPageValue(pageNum){
            var self= this;
            self.tableObj.loading = true;
            self.showData({pageSize: self.pageSize,pageNo: pageNum,userPhone:self.titleVal,used:self.chooseState,id:self.detailsId});
        },    
       showData(paramsObj){
            var self = this;
            var url = "/coupons/selectCouponDetails/"+paramsObj.id;
            actions.getData(url,paramsObj)
                .then(data => {
                    let obhArr = actions.tableHead.couponDetails;
                    let endObj=actions.filterData(data.couponDetailList,obhArr);
                    self.couponDetai = data.couponDetai;
                    self.tableObj.tableData = endObj.tableObj.tableData;
                    self.pageAtion = endObj.pageAtion;
                    switch (self.couponDetai.status) {
                        case 1:
                            self.statesCouponDetails="未开始"
                            break;
                        case 2:
                            self.statesCouponDetails="领取中"
                            break;
                        case 3:
                            self.statesCouponDetails="已领完"
                            break;
                        case 4:
                            self.statesCouponDetails="已结束"
                            break;                                                        
                        default:
                            console.log("错误");
                            break;
                    }
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
                    }
                );
        },
        exportInfo(){
            var self = this;
            self.titleVal=self.titleVal!=undefined?self.titleVal:'';
            self.detailsId=self.detailsId!=undefined?self.detailsId:'';   
            self.chooseStateOne=self.chooseStateOne!=undefined?self.chooseStateOne:''; 
            var url = self.$server.exportExcelCouponDe+"?id="+self.detailsId+"&userPhone="+self.titleVal+"&used="+self.chooseStateOne+"&token="+getToken();  
            window.open(url);   
        }               
    },
    mounted(){}
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
</style>

