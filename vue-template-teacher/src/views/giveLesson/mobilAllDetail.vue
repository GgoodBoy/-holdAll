<template>
    <div class="move-all-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
                <!-- <el-col style="text-align: right;">
                    <el-button type="primary" v-if="$authJudge('mobileactivity:mobilePopupOrder:export')" @click="exports">导出</el-button>
                </el-col>                 -->
                <el-col>
                    <el-input style="width:200px" v-model="cellphoneInfo" clearable placeholder="输入付款账号和订单账号"></el-input>
                    <el-select style="width:120px" clearable v-model="states" placeholder="状态">
                        <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>     
                    <el-select style="width:120px" v-model="moneyType" clearable placeholder="支付方式">
                        <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>      
                    <el-date-picker
                    v-model="beginStr"
                    style="width: 200px"
                    type="datetime"
                    placeholder="开始时间">
                    </el-date-picker>     
                    <el-date-picker
                    v-model="endStr"
                    style="width: 200px"
                    type="datetime"
                    placeholder="开始时间">
                    </el-date-picker>          
                    <el-button type="primary" @click="selectEven" v-if="$authJudge('activity:activityregister:select')">搜索</el-button>
                    <el-button type="primary" style="margin-left:20px;" v-if="$authJudge('mobileactivity:mobilePopupOrder:export')" @click="exports">导出</el-button>
                </el-col>  
            </el-row> 
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    header-cell-class-name="list-header-layout-bg"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="cellphone"
                        label="付款账号"
                        align="center"
                        width="150"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="orderId"
                        label="订单号"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="popupName"
                        label="合集名称"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope"> 
                            <!--  0 待支付 1 支付成功 2交易关闭 -->
                            <span v-if="scope.row.orderStatus==1">支付成功</span> 
                            <span v-else-if="scope.row.orderStatus==2">交易关闭</span>                                              
                            <span v-else>待支付</span>
                        </template> 
                    </el-table-column>
                    <el-table-column
                        label="支付方式"
                        align="center"
                        min-width="100"
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope"> 
                            <!-- 1 夫子币余额 2 微信 3 支付宝 4 apple充值 5微信内支付 -->
                            <span v-if="scope.row.paymentType==1">夫子币余额</span> 
                            <span v-else-if="scope.row.paymentType==2">微信</span>                                          
                            <span v-else-if="scope.row.paymentType==3">支付宝</span>
                            <span v-else-if="scope.row.paymentType==4">apple充值</span>                                          
                            <span v-else>微信内支付</span>
                        </template> 
                    </el-table-column>
                    <el-table-column
                        prop="actualPay"
                        label="实付 "
                        min-width="100"
                        align="center"
                        show-overflow-tooltip
                        >
                    </el-table-column>                    
                    <el-table-column
                        prop="areaName"
                        label="地区"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="returnId"
                        label="第三方订单号"
                        min-width="150"
                        align="center"
                        show-overflow-tooltip
                        >
                    </el-table-column>   
                    <el-table-column
                        prop="createdAt"
                        label="付款时间"
                        min-width="120"
                        align="center"
                        show-overflow-tooltip
                        >
                    </el-table-column>                       
                    <el-table-column
                        label="详情"
                        align="center"
                        width="60">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type="text" v-if="$authJudge('mobileactivity:mobilePopupOrder:getDetail')" size="small" @click="switchs(scope.row)">查看</el-button>
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
        :visible.sync="dialogVisibleOne"
        width="30%"
        >
        <div class="dialogOne">
            <el-table
                border
                :data="tableDataOne"
                v-loading="loadingOne"
                style="width: 100%">
                <el-table-column
                    prop="sortId"
                    label="序号"
                    align="center"
                    width="50"
                    >
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="课程名称"
                    align="center"
                    min-width="200"
                    show-overflow-tooltip>
                </el-table-column>                       
            </el-table>                                
        </div>                  
        </el-dialog>                                
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
// import giveCoursecret from './giveCoursecret';
export default {
    data() {
        return {
            titleList:[
                {
                    name:'移动积分管理',
                    pathInfo:''
                },
                {
                    name:'移动合集订单',
                    pathInfo:''
                }               
            ],
            pageNo:1,
            pageNo1:1,
            pageSize:10,
            cellphoneInfo:'',
            moneyType:'',
            beginStr:'',
            endStr:'',
            states:'', //
            tableData:[],
            tableDataOne:[],
            loading:false,
            loadingOne:false,
            dialogVisibleOne:false,
            //0 待支付 1 支付成功 2交易关闭
            options1:[
                {
                    value: 0,
                    label: '待支付'
                }, {
                    value: 1,
                    label: '支付成功'
                }, {
                    value: 2,
                    label: '交易关闭'
                }
            ],
            // 支付类型 1 夫子币余额 2 微信 3 支付宝 4 apple充值 5微信内支付
            options2:[
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
                }, {
                    value: 5,
                    label: '微信内支付'
                }
            ],
            varObj:{
                mtypeText:true,
                pageType:true,//是否分页
            },  
            courseList:[],
            selectData:{},//选中的对象 
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            }, 
            pageAtion1:{
                paginationPage:1,
                pageTotal:0
            }              
        };
    },
    metaInfo: {
        // title: "新用户赠课活动"
    },
    components: {
        pagination,
        breadcrumb
    },
    watch: {},
    created() {
       this.getGiveCourseList()
    },
    methods: {
        /*
        searchContent
        orderStatus
        paymentType
        beginTime
        endTime
        */
        exports(){
            var self = this;
            var parems ={
                searchContent:this.cellphoneInfo,
                orderStatus:this.states,
                paymentType:this.moneyType,
                beginTime:Number(this.beginStr)>0?this.formatDate(new Date(this.beginStr)):'',
                endTime:Number(this.beginStr)>0?this.formatDate(new Date(this.endStr)):''
            };
            var url = self.$server.exportMobilePopupOrderList+"?searchContent="+parems.searchContent+"&beginTime="+parems.beginTime+"&endTime="+parems.endTime+"&paymentType="+parems.paymentType+"&orderStatus="+parems.orderStatus+"&token="+getToken();
            window.open(url);
        },       
        childPageValue(num){
            if(Number(num)>0){
                this.getGiveCourseList(Number(num))
            }            
        },   
        //搜索
        selectEven(){
            this.getGiveCourseList(1);
        },       
        /**
         * 获取列表数据
         */
        getGiveCourseList(num){
            var self = this;
            this.loading = true;
            if(num){
                self.pageNo = num;
            }  
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    searchContent:this.cellphoneInfo,
                    orderStatus:this.states,
                    paymentType:this.moneyType,
                    beginTime:Number(this.beginStr)>0?this.formatDate(new Date(this.beginStr)):'',
                    endTime:Number(this.beginStr)>0?this.formatDate(new Date(this.endStr)):''
                }
            }
            this.$http.get(this.$server.getMobilePopupOrderPage,query).then(res=>{
                this.loading = false;
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
                    self.pageAtion.paginationPage = self.pageNo;
                    self.$nextTick(function(){
                        self.loading = false; 
                    })
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        // formatDate(date,type){
        formatDate(date){
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
                // if(type=="end"){
                //     h = 23;
                //     m1 = 59;
                //     s = 59;                
                // }else{
                    h = h<10?("0"+h):h;
                    m1 = m1<10?("0"+m1):m1;
                    s = s < 10 ? ("0" + s) : s;
                // }
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
            }else{
                return '';
            }
        }, 
        switchs(obj){
            var self = this;
            this.dialogVisibleOne = true;
            this.loadingOne = true;
            this.$http.get(this.$server.getMobilePopupOrderDetail+obj.id,{}).then(res=>{
                this.loadingOne = false;
                if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   if(contentdate.length){
                        listIds = contentdate.map(function(element,index){
                            var objs = {
                                title:element,
                                sortId:index+1
                            }
                            return objs;
                        });
                   };
                    self.tableDataOne = listIds;
                    console.log('self.tableDataOne',self.tableDataOne);
                    self.$nextTick(function(){
                        self.loadingOne = false; 
                    })
                }
            }).catch(()=>{
                this.loadingOne = false;
            })
        }
    }
};
</script>

<style lang="scss">
.centerCss{
    text-align: center;
}
.leftCss{
    text-align: left;
}
.rightCss{
    text-align: right;
    padding: 5px;
}
.marginBottom20{
    margin-bottom: 20px;
}
.lineHeight40{
    line-height: 40px;
}
.block{
    text-align: center;
    margin-top:60px;
    padding-bottom:60px;
}
.move-all-wrap{
    .page-header {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-title {
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
            margin-bottom: 20px;
        }
    }
    .page-content {
        background: #fff;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
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
    .type-dialog{
        min-width: 250px;
        .type-btns{
            text-align: center;
        }
    }
}

</style>

