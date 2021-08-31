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
                        <el-col :span="6">
                            <div class="iSeachEven">
                                <el-input v-model.trim="title"
                                        placeholder="输入付款账号查询"
                                        class="search-form"
                                        width="100%"
                                        clearable
                                        @keyup.native="proving1"
                                        ></el-input> 
                            </div>
                        </el-col>                   
                        <el-col :span="3">
                            <el-select v-model="memberType"
                                    clearable
                                    placeholder="状态">
                                <el-option v-for="item,i in courseTypeList"
                                        :key="i"
                                        :label="item.name"
                                        :value="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="2" v-if="$authJudge('record:member:select')"><el-button type="primary"  @click="searchMemberQuery">查询</el-button></el-col>
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
                label="会员类型"
                align="center"
                min-width="60">
                    <template slot-scope="scope">
                            <el-row> 
                                <el-col class="lCenter-r"> 
                                    <p v-if="scope.row.timeType==1">月度</p>
                                    <p v-else-if="scope.row.timeType==2">季度</p>
                                    <p v-else-if="scope.row.timeType==3">半年</p>
                                    <p v-else>年度</p>
                                </el-col>
                                <el-col class="lCenter-r butColor">
                                    <p v-if="scope.row.type==1">平台</p>
                                    <p v-else>特殊</p>
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
                                    <p v-if="scope.row.paymentType==2">微信</p>
                                    <p v-else-if="scope.row.paymentType==3">支付宝</p>
                                    <p v-else-if="scope.row.paymentType==4">apple充值</p>
                                    <p v-else>微信内支付</p>
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
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
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
            memberType:'',
            courseTypeList:[
                {
                    name:"全部",
                    value:''
                },
                {
                    name:"月度",
                    value:1
                },
                {
                    name:"季度",
                    value:2
                },
                {
                    name:"半年",
                    value:3
                },
                {
                    name:"年度",
                    value:4
                }
            ],
            titleList:[
                        {
                            name:'订单管理系统',
                            pathInfo:''
                        },
                        {
                            name:'会员记录',
                            pathInfo:''
                        }                
            ],
            tableData:[]
        };
        },
        created() {
            this.getStudylist(1);
        },
        components:{
            breadcrumb
        },        
        methods: {
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
                    cellphone:encodeURIComponent(self.title)||'',
                    pageSize:self.pageSize,
                    pageNo:self.pageNo,
                    //(1:月度,2:季度,3:半年,4:年度)
                    timeType:self.memberType,             
                };
                self.$http.get(self.$server.memberOrderSelectPage(params)).then(res=>{
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
</style>


