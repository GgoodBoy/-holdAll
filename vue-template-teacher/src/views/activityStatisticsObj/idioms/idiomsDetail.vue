<template>
    <div class="page-wrap idioms-management-page">
        <div style="padding:20px">
            <breadcrumb :menuList ='titleList'></breadcrumb> 
        </div>        
        <div class="tabs">
            <div class="tabListBox">
                <div v-for="(item,index) in tabsArr" :class="[activeIndex==index+1 ?'actions': '']" :key="index" @click="tabsEven(index)">
                    {{item.name}}
                </div>
            </div>
            <el-button v-if="activeIndex!=3" style="background: #9E0E00; width:60px;color:#fff;text-align: center; padding: 10px 0;padding" @click="exportEven">导出</el-button>
        </div>
        <div class="page-head">
        </div>
        <div class="page-content" v-show="activeIndex==1">
            <el-table :data="tableDataOne"
                    border
                    v-loading="loading"
                    header-cell-class-name="list-header-layout-bg"
                    style="width: 100%">
                <el-table-column
                    prop="cellphone"
                    label="账号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="totalScore"
                    label="总得分"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="totalInviteNum"
                    align="center"
                    label="邀请人数">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    label="访问时间">
                </el-table-column>
                <el-table-column
                    prop="last"
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <div class="handle-area">
                            <p @click="allotRole(scope.row,1)" style="color:#9E0E00;cursor: pointer;">详情</p>
                        </div>
                    </template>
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
                    prop="cellphone"
                    show-overflow-tooltip
                    label="账号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="courseName"
                    show-overflow-tooltip
                    label="课程名称"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="giftsName"
                    align="center"
                    label="赠品"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    show-overflow-tooltip
                    align="center"
                    label="购买时间">
                </el-table-column>
                <el-table-column
                    prop="actualPay"
                    align="center"
                    label="实付金额">
                </el-table-column>
                <el-table-column
                    prop="receiveName"
                    align="center"
                    label="收件人姓名">
                </el-table-column>
                <el-table-column
                    prop="receivePhone"
                    align="center"
                    label="收件人电话">
                </el-table-column>
                <el-table-column
                    prop="receiveAddress"
                    show-overflow-tooltip
                    align="center"
                    label="收件人地址">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="状态">
                        <template slot-scope="scope">
                            <div>{{scope.row.orderStatus==1?'未支付':'已支付'}}</div>
                        </template>                    
                </el-table-column>
                <el-table-column
                    prop="last"
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <div class="handle-area">
                            <p v-show="scope.row.mailState==2" >已发货</p>
                            <el-button v-show="Number(scope.row.mailState)==1&&Number(scope.row.orderStatus)==2" type="text" class="black-btn" @click="allotRole(scope.row,2)">发货</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination
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
                // tableDataThree:[],
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
                        name:'访问用户'
                    },
                    {
                        name:'购买用户'
                    }                   
                ],
                titleList:[
                        {
                            name:'统计',
                            pathInfo:''
                        },                    
                        {
                            name:'活动数据统计',
                            pathInfo:'/activityStatistics'
                        },
                        {
                            name:'成语猜猜猜',
                            pathInfo:'/activityStatistics/idioms/index'
                        },
                        {
                            name:'数据详情',
                            pathInfo:''
                        }                                             
                ],
                // provinceList:[],
                inputInfo:'',
                typeId:''   
            }        
        },
        components:{
            breadcrumb
        },
        created(){
            this.typeId = this.$route.query.type;
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
                    this.inputInfo='';
                    this.activeIndex=num+1;
                    this.getTableList(1);
            },
        allotRole(data,type){
            if(type==1){
                this.$router.push({
                    path:'/activityStatistics/idioms/detail',
                    query: {
                            type:data.userId,
                            typeId:this.typeId
                        }                    
                });
            }else{
                var self = this; 
                self.$http.post(self.$server.ciMail+data.id,{}).then(res=>{
                    if(res.status==200){
                        this.getTableList(self.pageNo);
                    }
                })                
            }
        },       
            exportEven(){
                var self = this;          
                let parems = {};
                var url = '';
                if(self.activeIndex==1){
                    parems = {
                        channelType:self.typeId                
                    };
                    var url = self.$server.ciExportVisitUserList+"?&token="+getToken();  
                }else{
                    parems = {
                        channelType:self.typeId
                    };
                    var url = self.$server.ciExportPayUserList+"?token="+getToken();            
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
                            channelType:self.typeId,
                            pageNo:self.pageNo,
                            pageSize:self.pageSize,                              
                        }
                    }
                    url = this.$server.ciVisitUserList;
                }else if(self.activeIndex==2){
                    query = {
                        params:{
                            channelType:self.typeId,
                            pageNo:self.pageNo,
                            pageSize:self.pageSize,   
                        }
                    }  
                    url = this.$server.ciPayUserList;                  
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
                        } 
                        if(self.activeIndex==2){
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
        mounted(){
        }
    }
</script>
<style lang="scss">
    .idioms-management-page{
        background: #fff;
        .tabs{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content:space-between;
            margin: 15px 17px;
            border-bottom: 1px solid #f4f4f4;
            .tabListBox{
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
