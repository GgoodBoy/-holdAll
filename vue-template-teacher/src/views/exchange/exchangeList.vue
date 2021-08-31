<template>
    <div class="page-wrap gift-list-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" style="text-align: left;">
                    <el-select v-model="mallStatus"
                            clearable
                            style="width:100px"
                            allow-create
                            filterable
                            default-first-option
                            placeholder="状态">
                        <el-option v-for="(item,i) in mallStatusList"
                                :key="i"
                                :label="item.name"
                                :value="item.id"></el-option>
                    </el-select> 
                    <el-button type="primary" @click="search">查询</el-button>
                </el-col>
                <el-col :span="3" style="float:right;text-align: right;">
                    <el-button v-if="$authJudge('activity:gift:add')" type="primary" @click="exportEven">导出</el-button>
                </el-col>
            </el-row>     
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="50"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="cellphone"
                        label="兑换账号"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        label="商品主图"
                        align="center"
                        min-width="80"
                        >
                        <template slot-scope="scope"> 
                            <img class="imgCss" :src="scope.row.goodsImg" />                                             
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="goodsName"
                        label="商品名称"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="orderId"
                        label="兑换单号"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="starNum"
                        label="兑换孚星"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip
                        >
                    </el-table-column>    
                    <el-table-column
                        prop="createdAt"
                        label="兑换时间"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="receiverName"
                        label="收件人"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip
                        >
                    </el-table-column>  
                    <el-table-column
                        prop="phoneNum"
                        label="收件电话"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip
                        >
                    </el-table-column>   
                    <el-table-column
                        label="状态"
                        align="center"
                        min-width="80"
                        >
                        <template slot-scope="scope"> 
                            <div class="btn-box">
                                <span v-show="scope.row.mallStatus==2">已邮寄</span>
                                <span v-show="scope.row.mallStatus==1">未邮寄</span>
                            </div>                                              
                        </template>
                    </el-table-column> 
                    <el-table-column
                        prop="mailAddress"
                        label="收件地址"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip
                        >
                    </el-table-column>                                   
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="120">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type="text" size="small" v-if="$authJudge('activity:gift:online')" @click="upOrDown(scope.row,1)">详情</el-button>
                                    <el-button type="text" size="small" v-if="$authJudge('activity:gift:offline')" @click="upOrDown(scope.row,2)">邮寄</el-button>
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
            :title="caoZuoState==1?'详情':'邮寄'"
            :visible.sync="dialogVisible"
            width="25%"
            custom-class="type-dialog"
            center
            class="lCenter-r">
                <el-row>
                    <el-col class="lCenter-r" v-if="caoZuoState==2">
                        <div class="divLayOut">
                            <div class="div1">选择快递公司:</div>
                            <el-select v-model="logisticsType"
                                    clearable
                                    style="width:100px"
                                    allow-create
                                    filterable
                                    default-first-option
                                    placeholder="状态">
                                <el-option v-for="(item,i) in logisticsTypeList"
                                        :key="i"
                                        :label="item.name"
                                        :value="item.id"></el-option>
                            </el-select> 
                        </div>
                        <div class="divLayOut">
                            <div class="div1">输入快递单号:</div>
                            <el-input style='width:200px;' maxlength="18" v-model="logisticsOrderNum" placeholder="只能输入整数"></el-input>    
                            <span>{{logisticsOrderNum.length||0}}/18</span>                        
                        </div>
                    </el-col>
                    <el-col class="lCenter-r" v-if="caoZuoState==1">
                        <div class="divLayOut">
                            <div class="div1">选择快递公司:</div>
                            <span v-if="selectData.logisticsType==1">顺丰</span> 
                            <span v-if="selectData.logisticsType==2">韵达</span>                                           
                            <span v-if="selectData.logisticsType==3">京东</span> 
                            <span v-if="selectData.logisticsType==4">申通</span> 
                        </div>
                        <div class="divLayOut">
                            <div class="div1">输入快递单号:</div>
                            <span>{{selectData.logisticsOrderNum}}</span>
                        </div>
                        <div class="divLayOut">
                            <div class="div1">邮寄时间:</div>
                            <span>{{selectData.mallAt}}</span>
                        </div>
                    </el-col>
                    <el-col class="lCenter-r lMarginTop20" v-if="caoZuoState==2">
                        <el-button @click="closeDialog">取消</el-button>
                        <el-button type="primary" @click="isOkChanelEven">确定</el-button>                    
                    </el-col>
                </el-row>  
        </el-dialog>  
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data() {
        return {
            titleList:[
                {
                    name:'兑换商城',
                    pathInfo:''
                },
                {
                    name:'兑换订单',
                    pathInfo:''
                }               
            ],
            mallStatusList:[
                {
                name:'全部',
                id:-1
                },
                {
                name:'已邮寄',
                id:2
                },
                {
                name:'未邮寄',
                id:1
                }
                ],
            mallStatus:'',
            logisticsTypeList:[
                {
                    name:'顺丰',
                    id:1
                },
                {
                    name:'韵达',
                    id:2
                },
                {
                    name:'韵达',
                    id:3
                },
                {
                    name:'申通',
                    id:4
                }
            ],
            logisticsType:'',
            logisticsOrderNum:'',
            pageNo:1,
            pageSize:10,
            total:10,
            tableData:[],
            loading:false,
            dialogVisible:false,
            caoZuoState:'',
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            selectData:{},
        };
    },
    components: {
        pagination,breadcrumb
    },
    watch: {},
    created() {
       this.getGiftList(1)
    },
    methods: {            
        exportEven(){
            var self = this;        
            var parems = {
                    mallStatus:this.mallStatus             
                };
                var url = self.$server.exportExchangeOrderList+"?mallStatus="+parems.mallStatus+"&token="+getToken();  
            window.open(url);                   
        }, 
        closeDialog(){
            this.dialogVisible=false;
            this.logisticsOrderNum='';
            this.logisticsType='';
        },
        isOkChanelEven(){
                let regExp = /^[0-9]*$/g;
                if(!regExp.test(this.logisticsOrderNum)){
                    this.$message({
                        type:'error',
                        message:'请输入整数'
                    })
                    return;
                }
                let parmes = {
                    logisticsOrderNum:this.logisticsOrderNum,
                    logisticsType:this.logisticsType
                };
                this.$http.post(this.$server.getMallExchangeOrder+this.selectData.id,parmes).then(res=>{
                    if(res.status==200){
                        this.$message({
                            type:'success',
                            message:'邮寄成功'
                        })
                        this.logisticsOrderNum='';
                        this.logisticsType='';
                        this.dialogVisible=false;
                        this.getGiftList(self.pageNo);
                    }
                })            
        },
        search(){
            this.getGiftList(1);
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getGiftList(Number(num))
            }
        },
        /**
         * 获取列表数据
         */
        getGiftList(num){
            let self = this;
            this.loading = true;
            if(num){
                self.pageNo = num;
            }
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    mallStatus:this.mallStatus
                }
            }
            this.$http.get(this.$server.getExchangeOrderList,query).then(res=>{
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
                    self.pageAtion.paginationPage = num;
                    self.loadingOne = false;
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        /**
         * 上架or下架
         */
        upOrDown(obj,type){
            console.log("ddd",obj)
            this.selectData = obj;
            this.caoZuoState = type;
            this.dialogVisible = true;
        }
    }
};
</script>

<style lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
    .divLayOut{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 10px;
        .div1{
            width:120px;
            text-align: left;
        }
    }
    .gift-list-wrap{
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
            .imgCss{
                width:60px;
                height:60px;
                border-radius: 50%;
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

