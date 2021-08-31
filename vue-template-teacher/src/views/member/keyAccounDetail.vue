<template>
    <div class="keyAccBoxDetail">
        <el-row class="lSize16">
            <el-col :span="12" class="lLeft-r">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
        </el-row>       
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="课程:">
                <!-- <el-input type="textarea" :rows="5" v-model="form.courseTitles" style="width:400px"></el-input> -->
                <div class="courseTitleStyel">
                    <div v-for="(item,index) in form.courseTitles" :key="index">{{item.title+','}}</div>
                </div>
            </el-form-item>
            <el-form-item label="欢迎语:">
                <!-- <el-input type="textarea" disabled :rows="5" v-model="form.welcomeSpeech" style="width:400px"></el-input> -->
                <div class="fontWord">{{form.welcomeSpeech}}</div>
            </el-form-item>  
            <el-form-item label="有效期:">
                <!-- <el-input v-model="form.validityTime" style="width:200px" disabled></el-input> -->
                <div class="fontWord">{{form.validityTime}}</div>
            </el-form-item>            
            <el-form-item label="备注:">
                <!-- <el-input type="textarea" disabled :rows="5" v-model="form.remarks" style="width:400px"></el-input> -->
                <div class="fontWord">{{form.remarks}}</div>
            </el-form-item>                      
        </el-form>   
        <div class="tableBox">
            <el-row :gutter="10" class="lMarginBO20" style="padding: 20px 0;">
                <el-col :span="5">
                    <el-input v-model="cellphone" @input="inputChange" maxlength="11" placeholder="请输入手机号查询"></el-input>
                </el-col>
                <el-col :span="2" class="lCenter-r lLine40">领用状态</el-col>
                <el-col :span="4" >
                    <el-select v-model="receiveStatus" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>                    
                </el-col>
                <el-col :span="2" class="lCenter-r lLine40">批次状态</el-col>
                <el-col :span="4">
                    <el-select v-model="status" placeholder="请选择">
                        <el-option
                        v-for="item in optionsTwo"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>                    
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="selectDetail">查询</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="exportTable()">导出</el-button>
                </el-col>
            </el-row>
            <el-table
            v-loading="loading"
            :data="tableData"
            border
            :header-cell-style="tableHeaderColor"
            style="width: 100%">
                <el-table-column
                    prop="sortId"
                    label="序号"
                    min-width="60">
                </el-table-column>
                <el-table-column
                    prop="cellphone"
                    label="手机号"
                    min-width="180">
                </el-table-column>
                <el-table-column
                    min-width="60"
                    label="领用状态">
                    <template slot-scope="scope">
                        <p v-if="scope.row.receiveStatus==1">未领用</p>
                        <p v-else-if="scope.row.receiveStatus==2">已领用</p>    
                    </template>                     
                </el-table-column>
                <el-table-column
                    min-width="60"
                    label="状态">
                    <template slot-scope="scope">
                        <p v-if="scope.row.status==1">已启用</p>
                        <p v-else-if="scope.row.status==2">已禁用</p>    
                    </template>                    
                </el-table-column>      
                <el-table-column
                    prop="receiveTime"
                    min-width="180"
                    label="领用时间">
                </el-table-column>   
                <el-table-column
                    min-width="60"
                    label="操作">
                    <template slot-scope="scope">
                        <el-row class="redFontColor"> 
                            <el-col class="lCenter-r" v-if="scope.row.status==2&&scope.row.receiveStatus==1">
                                <div @click="tableListEven(1,scope.row)">启用</div>
                            </el-col>   
                            <el-col class="lCenter-r" v-if="scope.row.status==1&&scope.row.receiveStatus==1">
                                <div @click="tableListEven(2,scope.row)">禁用</div>
                            </el-col>                                                                           
                        </el-row>                                                      
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
</template>
<script>
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
        data(){
            return {
                form:{
                    courseTitles:[],
                    welcomeSpeech:'',
                    validityTime:'',
                    remarks:''
                },
                tableData: [],
                options: [{
                    value: '-1',
                    label: '全部'
                }, {
                    value: '1',
                    label: '未领用'
                }, {
                    value: '2',
                    label: '已领用'
                }],
                optionsTwo: [{
                    value: '-1',
                    label: '全部'
                }, {
                    value: '1',
                    label: '启用'
                }, {
                    value: '2',
                    label: '禁用'
                }], 
                titleList:[
                            {
                                name:'系统合集',
                                pathInfo:'/marketelistlist'
                            },
                            {
                                name:'大客户免费课系统',
                                pathInfo:'/marketelist/member/keyAccountCard'
                            },
                            {
                                name:'大客户详情',
                                pathInfo:''
                            }                
                ],       
                queryId:'',
                pageAtion:{
                    pageTotal:0,
                    paginationPage:1
                },   
                pageSize:10,
                pageNo:1, 
                receiveStatus:"-1",
                status:"-1",
                cellphone:'',
                loading:true
            };
        },
        created() {
            // this.paramsData = this.$route.params.data;
            this.queryId = this.$route.query.paramsId;
            this.getUserDetail(this.queryId);
            
        },
        components:{
            breadcrumb
            },        
        methods: {
            inputChange() { //输入框值改变
                this.cellphone = this.cellphone.replace(/[^\d]/g, '');
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
            selectDetail(){
                this.getDetailList(1);
            },
            exportTable(rows){
                var self = this;
                var parems = {
                    token:getToken(),
                    receiveStatus:self.receiveStatus,
                    cellphone:self.cellphone,
                    status:self.status,
                    courseBagId:self.queryId
                };
                self.download2(self.$server.customerUserExport(parems));            
            },    
            // proving1(){
            //     var self = this;
            //     var reg = /^(?!.*\\.*$)/;
            //     if(!reg.test(self.input)){
            //         this.input='';
            //     }
            // },                              
            getUserDetail(id){
                var self = this;
                var params = {
                    courseBagId:id            
                };
                self.$http.get(self.$server.customerGetBagUserHeader(params)).then(res=>{
                    if(res.status==200){
                        var contents = res.content;
                        self.form={
                            validityTime:contents.validityTime,
                            welcomeSpeech:contents.welcomeSpeech,
                            courseTitles:contents.courseTitles,
                            remarks:contents.remarks
                        }
                        self.getDetailList(1);                        
                    }
                })                 
            },
            //分页
            childPageValue(num){
                if(Number(num)>0){
                    this.getDetailList(Number(num))
                }            
            }, 
            tableListEven(num,data){
                switch (num) {
                    case 1:
                        this.startCustomerUser(data);
                        break;
                    case 2:
                        this.detailCustomerUser(data);
                        break;                
                    default:
                        break;
                }
            },     
            startCustomerUser(data){
                var self = this;
                var params = {
                    id: data.id            
                };
                self.$http.post(self.$server.customerUserStart,params).then(res=>{
                    if(res.status==200){
                        self.$message.success({ message: "启动完成" }); 
                        this.getDetailList();
                    }
                })
            },  
            detailCustomerUser(data){
                var self = this;
                var params = {
                    id: data.id            
                };
                self.$http.post(self.$server.customerUserDisable,params).then(res=>{
                    if(res.status==200){
                        self.$message.success({ message: "禁止完成" }); 
                        this.getDetailList();
                    }
                })
            }, 
            // 修改table header的背景色
            tableHeaderColor({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 0) {
                    return 'background-color: #F3F3F3;font-weight: 500;font-size: 16px;'
                }
            },                
            getDetailList(num){
                var self = this;
                if(num){
                    self.pageNo = num;
                }
                self.loading = true; 
                var params = {
                    status:self.status,
                    pageSize:self.pageSize,
                    pageNo:self.pageNo,
                    receiveStatus:self.receiveStatus,  
                    cellphone:self.cellphone,
                    courseBagId:self.queryId         
                };
                self.$http.get(self.$server.customerGetBagUserItem(params)).then(res=>{
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
.tableBox{
    /* border-top: 1px solid #ccc; */
    /* padding-top: 20px; */
    padding: 15px;
    background: #fff;
}
.keyAccBoxDetail .courseTitleStyel{
         border-radius: 6px; 
         overflow: auto;
}
.keyAccBoxDetail .courseTitleStyel div{
        float: left;
        line-height: 40px;
        color: #C0C4CC;
}
.fontWord{
    color: #C0C4CC;
    line-height: 40px;    
}
</style>

