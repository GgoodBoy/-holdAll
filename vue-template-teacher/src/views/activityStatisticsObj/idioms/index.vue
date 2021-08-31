<template>
    <div class="page-wrap idioms-statis-page">
        <div style="padding:20px" class="tabsBreadcrumb ">
            <breadcrumb :menuList ='titleList'></breadcrumb> 
            <el-button style="background: #9E0E00;color:#fff;" @click="buttonEven">Button数据</el-button>
        </div>
        <div class="page-head">
            <div class="flexBox">
                <p>活动总访问次数</p>
                <p>
                    <span>{{baseData.totalVisitNum}}</span>次
                </p>
                <p>今日访问：{{baseData.todayVisitNum}} 次</p>
            </div>
            <div class="flexBox">
                <p>活动总付费人数</p>
                <p>
                    <span>{{baseData.totalPayNum}}</span>人
                </p>
                <p>总金额：{{baseData.totalPay}} 元</p>                
            </div>
            <div class="flexBox">
                <p>活动总注册人数</p>
                <p>
                    <span>{{baseData.totalRegisterNum}}</span>人
                </p>
                <p>今日注册：{{baseData.todayRegisterNum}} 人</p>                
            </div>
        </div>
        <div class="page-content">
            <el-table :data="tableData"
                      border
                      v-loading="loading"
                      header-cell-class-name="list-header-layout-bg"
                      style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="渠道名称"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="visitNum"
                        label="访问次数"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="registerNum"
                        align="center"
                        label="注册用户(人)">
                    </el-table-column>
                    <el-table-column
                        prop="last"
                        align="center"
                        label="操作">
                        <template slot-scope="scope">
                            <div class="handle-area">
                                <p @click="allotRole(scope.row)" style="color:#9E0E00;cursor: pointer;">详情</p>
                            </div>
                        </template>
                    </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
    export default{
        data(){
            return{
                tableData:[],
                loading: false,
                pageAtion:{
                    paginationPage:1,
                    pageTotal:0
                },
                pageNo:1,
                pageSize:10,
                baseData:'',
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
                            pathInfo:''
                        }                                           
                ]                
            }
        },
        components:{
            breadcrumb
        },
        created(){
            this.getActivityBaseData();
            this.getTableInfoList(1);
        },
        methods:{
            buttonEven(){
                this.$router.push({
                    path:'/activityStatistics/idioms/buttonClick'});                 
            },
            getActivityBaseData(){
                var self = this;            
                self.$http.get(self.$server.ciGetActivityBaseData).then(res=>{
                    if(res.status==200){
                        self.baseData = res.content;
                    }
                })                                                        
            },
            allotRole(data){
                this.$router.push({
                    path:'/activityStatistics/idioms/idiomsDetail/'+data.type,
                    query: {
                            type:data.type
                        }                    
                    });   
            },
            getTableInfoList(num){
                var self = this;
                // if(num){
                //     self.pageNo = num;
                // }
                self.loading = true;              
                self.$http.get(self.$server.ciGetListByChannel).then(res=>{
                    if(res.status==200){
                        self.loading = false;
                        self.tableData = res.content;
                    }
                }).catch(()=>{
                    self.loading = false;
                })                                        
            },
            childPageValue(num){
                if(Number(num)>0){
                    this.getTableInfoList(Number(num))
                }            
            }            
        },
        mounted(){
        }
    }
</script>
<style lang="scss">
    .idioms-statis-page{
        background: #fff;
        .tabsBreadcrumb{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
        .page-head {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            .flexBox{
                p:nth-child(1){
                    padding: 20px 0 0;
                    text-align: center;
                    font-size: 18px;
                }
                p:nth-child(2){
                    padding: 20px 0 0;
                    text-align: center;
                    font-size: 18px;
                    span{
                        font-size: 22px;
                    }
                }    
                p:nth-child(3){
                    text-align: center;
                    padding: 20px 0;
                    font-size: 12px;
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
}
</style>
