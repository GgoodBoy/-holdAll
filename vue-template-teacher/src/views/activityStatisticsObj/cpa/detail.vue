<template>
    <div class="page-wrap user-cpa-page">
        <div style="padding:20px">
            <breadcrumb :menuList ='titleList'></breadcrumb> 
        </div>        
        <div class="page-head_one">
            <div class="flexBox">
                <p>
                    <span>{{baseData.totalUser}}</span>
                </p>
                <p>昨日:{{baseData.yesterdayUser}} </p>
                <p>APP注册（人）</p>
            </div>
            <div class="flexBox">
                <p>
                    <span>{{baseData.totalPay}}</span>
                </p>
                <p>昨日:{{baseData.yesterdayPay}} </p>   
                <p>付费转化（元）</p>             
            </div>
        </div>
        <div class="tabs">
            <div v-for="(item,index) in tabsArr" :class="[activeIndex==index+1 ?'actions': '']" :key="index" @click="tabsEven(index)">
                {{item.name}}
            </div>
        </div>
        <div class="page-head_two">
            <div class="queryBox">
                <div class="queryOne">
                    <el-input v-model="cellPhone" style="width:200px;margin-right:5px;" :placeholder="activeIndex==1?'输入手机号查询':'输入手机号/订单号查询'"></el-input>
                    <el-button style="background: #9E0E00;width:60px;text-align: center;padding: 0;color:#fff;margin-left:5px;" @click="search">查询</el-button>
                    <el-button style="background: #9E0E00;width:60px;color:#fff;text-align: center;padding: 0;" @click="exportEven">导出</el-button>                   
                </div>
               
            </div>
        </div>
        <div class="page-content" v-show="activeIndex==1">
            <el-table :data="tableDataOne"
                    border
                    v-loading="loading"
                    header-cell-class-name="list-header-layout-bg"
                    style="width: 100%">
                <el-table-column
                    prop="cellphone"
                    label="注册账号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="注册时间"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="address"
                    align="center"
                    label="地区">
                </el-table-column>
            </el-table>
        </div>
        <div class="page-content" v-show='activeIndex==2'>
            <el-table :data="tableDataTwo"
                    border
                    v-loading="loading"
                    header-cell-class-name="list-header-layout-bg"
                    style="width: 100%">
                <el-table-column
                    prop="userPhone"
                    label="购课账号"
                    show-overflow-tooltip
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="commodityTitle"
                    show-overflow-tooltip
                    label="购课名称"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="orderId"
                    align="center"
                    show-overflow-tooltip
                    label="订单号">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    label="购课时间">
                </el-table-column>
                <el-table-column
                    prop="payPrice"
                    align="center"
                    label="实付金额">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    label="支付方式">
                        <template slot-scope="scope">
                            <!-- 1 夫子币余额 2 微信 3 支付宝 4 apple充值 5微信内支付 6华为支付 7Oppo支付 8vivo支付 9小米支付 10工行卡支付 -->
                            <div v-if="scope.row.paymentType==1" style="color:#9E0E00;cursor: pointer;">夫子币余额</div>
                            <div v-else-if='scope.row.paymentType==2' style="color:#9E0E00;cursor: pointer;">微信</div>
                            <div v-else-if='scope.row.paymentType==3' style="color:#9E0E00;cursor: pointer;">支付宝</div>
                            <div v-else-if='scope.row.paymentType==4' style="color:#9E0E00;cursor: pointer;">apple充值</div>
                            <div v-else-if='scope.row.paymentType==5' style="color:#9E0E00;cursor: pointer;">微信内支付</div>
                            <div v-else-if='scope.row.paymentType==6' style="color:#9E0E00;cursor: pointer;">华为支付</div>
                            <div v-else-if='scope.row.paymentType==7' style="color:#9E0E00;cursor: pointer;">OPPO支付</div>
                            <div v-else-if='scope.row.paymentType==8' style="color:#9E0E00;cursor: pointer;">vivo支付</div>
                            <div v-else-if='scope.row.paymentType==9' style="color:#9E0E00;cursor: pointer;">小米支付</div>
                            <div v-else style="color:#9E0E00;cursor: pointer;">工行卡支付</div>
                        </template>                     
                </el-table-column>
                <el-table-column
                    align="center"
                    label="状态">
                        <template slot-scope="scope">
                            <div style="color:#9E0E00;cursor: pointer;">{{scope.row.orderStatus?'支付成功':'待支付'}}</div>
                        </template>                    
                </el-table-column>                
            </el-table>
        </div>
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
</template>
<script type="text/ecmascript-6">
    import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
    import { getToken } from '@/utils/auth';
    export default{
        data(){
            return{
                tableDataOne:[],
                tableDataTwo:[],
                loading: false,
                pageAtion:{
                    pageTotal:0,
                    paginationPage:1
                }, 
                pageNo:1,
                pageSize:10,              
                activeIndex:1,
                tabsArr:[
                    {
                        name:'注册信息'
                    },
                    {
                        name:'转化信息 '
                    }                  
                ],
                titleList:[                            
                            {
                                name:'统计',
                                pathInfo:'/activityStatistics/cpa/index'
                            },
                            {
                                name:'CPA活动统计',
                                pathInfo:'/activityStatistics/cpa/index'
                            } ,
                            {
                                name:'详情',
                                pathInfo:''
                            }
                        ],
                baseData:{},
                id:'',
                cellPhone:''
            }        
        },
        components:{
            breadcrumb
        },
        created(){
            this.id = this.$route.query.id;
            this.getActivityBaseData();
            this.getTableList(1);
        },
        watch: {  },
        methods:{   
            childPageValue(num){
                if(Number(num)>0){
                    this.getTableList(Number(num))
                }                
            },        
            tabsEven(num){             
                    this.activeIndex=num+1;
                    this.getTableList(1);
            },
        
        getActivityBaseData(){
            let self = this;         
            let query = {
                    params:{
                        id:self.id  
                    }
                }    
            self.$http.get(self.$server.cpaGetBaseData,query).then(res=>{
                if(res.status==200){
                    self.baseData = res.content;
                }
            })                                                        
        },     
        search(){
            this.getTableList(1);
        },     
        exportEven(){
            var self = this;          
            let parems = {};
            var url = '';
            if(self.activeIndex==1){
                parems = {
                    id:self.id,
                    cellphone:self.cellphone             
                };
                var url = self.$server.cpaExportUserList+"?id="+parems.id+"&cellphone="+parems.cellphone+"&token="+getToken();  
            }else if(self.activeIndex==2){
                parems = {
                    id:self.id,
                    cellphone:self.cellphone,
                };
                var url = self.$server.cpaExportOrderList+"?id="+parems.id+"&cellphone="+parems.cellphone+"&token="+getToken();            
            } 
            window.open(url);                   
        }, 
        getTableList(num){
            var self = this;    
            this.loading = true;
            if(num){
                self.pageNo = num;
            };
            var url = '';
            let query = {};
            if(self.activeIndex==1){
                query = {
                    params:{
                        id:self.id,
                        cellPhone:self.cellPhone,
                        pageNo:self.pageNo,
                        pageSize:self.pageSize,                              
                    }
                }
                url = this.$server.cpaGetUserList;
            }else if(self.activeIndex==2){
                query = {
                    params:{
                        id:self.id,
                        cellPhoneOrOrderNum:self.cellPhone,
                        pageNo:self.pageNo,
                        pageSize:self.pageSize,   
                    }
                }  
                url = this.$server.cpaGetOrderList;                  
            }
            this.$http.get(url,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    var contentdate = res.content;
                    var listIds = [];
                    listIds = contentdate.list.map(function(element,index){
                        if(contentdate.pageNum==1){
                            element.sortId = index+1;
                            return element;
                        }else if(contentdate.pageNum>1){
                            element.sortId = (contentdate.pageNum-1)*10+index+1;
                            return element;
                        }
                    });          
                    if(self.activeIndex==1){
                        self.tableDataOne = listIds;
                    }else if(self.activeIndex==2){
                        self.tableDataTwo = listIds;
                    }
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage =self.pageNo;
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
                }
            }).catch(()=>{
                this.loading = false;
            })
        }       
    },
    mounted(){}
}
</script>
<style lang="scss">
    .user-cpa-page{
        background: #fff;
        .page-head_one{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            .flexBox{
                p:nth-child(1){
                    padding: 20px 0 0;
                    text-align: center;
                    font-size: 22px;
                }
                p:nth-child(2){
                    padding: 20px 0 0;
                    text-align: center;
                    font-size: 14px;
                    color: red;
                    span{
                        font-size: 14px;
                    }
                }    
                p:nth-child(3){
                    text-align: center;
                    padding: 20px 0;
                    font-size: 14px;
                }                             
            }
        }
        .page-head_two {
            padding: 28px 19px 30px 17px;
            background: #fff;
            .queryBox{
                display: flex;
                flex-direction:column;
                justify-content:space-between;     
                width: 100%;          
                .queryOne{
                    width: 100%;   
                    display: flex;
                    flex-direction: row;   
                    justify-content:flex-start;           
                }          
                .queryTwo{
                    width: 100%;   
                    display: flex;
                    flex-direction: row;   
                    justify-content:flex-start;  
                    margin-top: 10px;
                    .queryTwo_1{
                        width: 100%;   
                        display: flex;
                        flex-direction: row;   
                        justify-content:flex-start;                          
                    }         
                }
            }
        }
        .tabs{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content:flex-start;
            margin: 0 17px;
            border-bottom: 1px solid #f4f4f4;
            div{
                border: 1px solid #f4f4f4;
                border-bottom: none;
                cursor: pointer;
                padding: 10px 20px;
                background: #fff;
                color: #ccc;
            }
        }
        .page-content {
            border-radius: 5px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        }
        .my-form-warp{
            text-align: center;
            .el-form{
                display: inline-block;
                .el-form-item__label{
                    line-height: 50px;
                }
                .el-input{
                    width: 360px;
                    height: 50px;
                    line-height: 50px;
                    .el-input__inner{
                        height: 50px;
                        line-height: 50px;
                    }
                }
                .my-pwd.el-input--suffix .el-input__inner{
                    padding-right: 40px;
                }
            }
        }
        .update-form{
            .el-form-item__label{
                font-size: 12px;
                width: 38px;
                text-align: justify;
                text-align-last: justify;
                margin-left: 32px;
            }
            .el-input{
                width: 360px;
            }
        }
        .reject-textarea{
            height: 110px;
            .el-textarea__inner{
                height: 100%!important;
            }
        }
        .word-number{
            font-size: 12px;
            color:#9A9A9A;
            margin:10px 0;
        }
        .my-message-alert{
            .el-message-box__message{
                text-align: center;
                margin:10px 0;
            }
            .el-message-box__btns{
                text-align: center;
                margin:15px 0;
                .el-button{
                    background:#B4272D!important;
                    border-color:#B4272D!important;
                    width: 130px;
                }
            }
        }
        .block{
            text-align: center;
        }
    }   
.actions{
    background: #9E0E00 !important;
    color: #fff !important;
}

</style>
