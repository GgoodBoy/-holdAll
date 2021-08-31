<template>
    <div class="page-wrap detail-detail-page">
        <div style="padding:20px">
            <breadcrumb :menuList ='titleList'></breadcrumb> 
        </div>        
        <div class="tabs">
            <div class="tabListBox" v-if="activeIndex==1">
                <div v-for="(item,index) in tabsArr" :class="[selectIndex==index+1 ?'actions': '']" :key="index" @click="tabsEven(index)">
                    {{item.name}}
                </div>
            </div>
            <div class="tabListBox" v-else>
                <div v-for="(item,index) in tabsArr" :class="[selectIndex==index+1 ?'actions': '']" :key="index">
                    {{item.name}}
                </div>
            </div>
            <el-button style="background: #9E0E00; width:60px;color:#fff;text-align: center; padding: 10px 0;padding" @click="exportEven">导出</el-button>
        </div>
        <div class="page-head">
        </div>
        <div class="page-content" v-show="selectIndex==1">
            <el-table :data="tableDataOne"
                    border
                    v-loading="loading"
                    header-cell-class-name="list-header-layout-bg"
                    style="width: 100%">
                <el-table-column
                    prop="cellphone"
                    label="邀请用户账号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="用户注册时间"
                    align="center"
                >
                </el-table-column>
            </el-table>
        </div>
        <div class="page-content" v-show='selectIndex==2'>
            <el-table :data="tableDataTwo"
                    border
                    v-loading="loading"
                    header-cell-class-name="list-header-layout-bg"
                    style="width: 100%">
                <el-table-column
                    prop="createdAt"
                    label="获奖时间"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="获奖类型"
                    align="center"
                >
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
                tabsArr:[],
                titleList:[],
                typeId:'',
                userIds:'',
                activeIndex:1,
                selectIndex:1   
            }        
        },
        components:{
            breadcrumb
        },
        created(){
            this.userIds = this.$route.query.type;
            this.typeId= this.$route.query.typeId;
            this.activeIndex = this.$route.query.activeIndex;
            if(this.activeIndex==1){   
                this.tabsArr=[
                    {
                        name:'邀请用户'
                    },
                    {
                        name:'获奖记录'
                    }                 
                ];
            }else{
                this.tabsArr=[
                    {
                        name:'邀请用户'
                    }                 
                ];
            }
            this.titleList = [
                        {
                            name:'统计',
                            pathInfo:''
                        },                    
                        {
                            name:'活动数据统计',
                            pathInfo:'/activityStatistics'
                        },
                        {
                            name:'阅读节活动',
                            pathInfo:'/activityStatistics/packet/index'
                        },
                        {
                            name:'用户详情',
                            pathInfo:'/activityStatistics/packet/packetDetail/'+this.userIds+"?type="+this.typeId
                        },
                        {
                            name:'详情',
                            pathInfo:''
                        }     
                    ];
            this.getTableList(1);
        },
        watch: {},
        methods:{   
            childPageValue(num){
                if(Number(num)>0){
                    this.getTableList(Number(num))
                }                
            },        
            tabsEven(num){            
                this.selectIndex=num+1;
                this.getTableList(1);
            },       
            exportEven(){
                var self = this;    
                var url = '';
                if(self.activeIndex==1){
                    if(self.selectIndex==1){
                        var url = self.$server.packExportInviteUserList+self.userIds+"?activityType="+1+"&token="+getToken();
                    }else{
                        var url = self.$server.packExportLotteryRecord+self.userIds+"?token="+getToken();
                    }
                }else{
                    var url = self.$server.packExportInviteUserList+self.userIds+"?activityType="+2+"&token="+getToken();           
                }
                console.log("url",url);
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
                    if(self.selectIndex==1){
                        query = {
                            params:{
                                pageNo:self.pageNo,
                                pageSize:self.pageSize,                              
                                activityType:self.activeIndex
                            }
                        }                        
                         url = this.$server.getPackInviteUserList+self.userIds;
                    }else{
                        query = {
                            params:{
                                pageNo:self.pageNo,
                                pageSize:self.pageSize     
                            }
                        }                        
                        url = this.$server.getPackLotteryRecord+self.userIds;
                    }
                }else {
                    query = {
                        params:{
                            pageNo:self.pageNo,
                            pageSize:self.pageSize,
                            activityType:self.activeIndex
                        }
                    }  
                    url = this.$server.getPackInviteUserList+self.userIds;                  
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
                        if(self.selectIndex==1){
                            self.tableDataOne = listIds;
                        }else{
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
    .detail-detail-page{
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
