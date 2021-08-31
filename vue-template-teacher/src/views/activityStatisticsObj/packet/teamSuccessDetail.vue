<template>
    <div class="page-wrap user-management-page">
        <div style="padding:20px">
            <breadcrumb :menuList ='titleList'></breadcrumb> 
        </div>      
        <div class="page-content">
            <el-table :data="tableDataOne"
                    border
                    v-loading="loading"
                    header-cell-class-name="list-header-layout-bg"
                    center
                    style="width: 100%">
                <el-table-column
                    prop="cellphone"
                    label="用户"
                    align="center"
                    min-width="150"
                >
                </el-table-column>
                <el-table-column
                    prop="totalInviteNum"
                    label="身份"
                    align="center"
                    min-width="80"
                >
                    <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.teamRole==1?'队长':'队员'}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="totalIntegrals"
                    align="center"
                    label="当前积分"
                    min-width="80">
                </el-table-column>
            </el-table>
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
                loading: false,
                pageAtion:{
                    pageTotal:0,
                    paginationPage:1
                }, 
                pageNo:1,
                pageSize:10,              
                activeIndex:1,
                id:'',
                typeId:'',
                titleList:[] 
            }        
        },
        components:{
            breadcrumb
        },
        created(){
            this.id = this.$route.query.type;
            this.typeId = this.$route.query.typeId;
            this.titleList=[
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
                            name:'组队成功详情',
                            pathInfo:'/activityStatistics/packet/teamIsInsuccess/'+this.typeId
                        },
                        {
                            name:'组队详情',
                            pathInfo:''
                        }                                             
                ]
            this.getTableList();
        },
        watch: {},
        methods:{    
            getTableList(){
                var self = this;    
                this.loading = true;
                var url = '';         
                url = this.$server.getPackSuccessTeamDetail+this.id; 
                this.$http.get(url,{}).then(res=>{
                    if(res.status==200){
                        this.loading = false;
                        var contentdate = res.content;
                        var listIds = [];         
                        self.tableDataOne = contentdate;
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
    .user-management-page{
        background: #fff;
        .page-content {
            border-radius: 5px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            .avatarBox{
                position: relative;
                height: 40px;
                .avatarList{
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width:40px;
                    height: 40px;
                    overflow: hidden;
                    border-radius: 50%;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
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
.actions{
    background: #9E0E00 !important;
    color: #fff !important;
}

</style>
