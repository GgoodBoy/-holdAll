<template>
    <div class="page-wrap user-management-page">
        <div style="padding:20px">
            <breadcrumb :menuList ='titleList'></breadcrumb> 
        </div>      
        <div class="page-content">
            <el-table :data="tableDataOne"
                    border
                    v-loading="loading"
                    align="center"
                    header-cell-class-name="list-header-layout-bg"
                    style="width: 100%">
                <el-table-column
                    prop="sortId"
                    label="序号"
                    align="center"
                    min-width="40"
                >
                </el-table-column>
                <el-table-column
                    prop="totalInviteNum"
                    label="头像"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div class="avatarBox">
                            <div class="avatarList" :style="{left:((index*40)>0?(index*40-20*index):0)+'px'}" v-for="(item,index) in scope.row.members" :key='index'>
                                <img :src="item.avatar" />
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="totalIntegrals"
                    label="总积分"
                    align="center"
                    min-width="80"
                >
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="建队时间"
                    align="center"
                    min-width="150"
                >
                </el-table-column>
                <el-table-column
                    prop="successAt"
                    label="成队时间"
                    align="center"
                    min-width="150"
                >
                </el-table-column>
                <el-table-column
                    align="center"
                    min-width="60"
                    label="操作">
                    <template slot-scope="scope">
                        <div class="avatarBox">
                            <p @click="allotRole(scope.row)" style="color:#9E0E00;cursor: pointer;">详情</p>
                        </div>
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
                loading: false,
                pageAtion:{
                    pageTotal:0,
                    paginationPage:1
                }, 
                pageNo:1,
                pageSize:10,    
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
                            name:'阅读节活动',
                            pathInfo:'/activityStatistics/packet/index'
                        },
                        {
                            name:'组队成功详情',
                            pathInfo:''
                        }                                             
                ],
                typeId:'',   
            }        
        },
        components:{
            breadcrumb
        },
        created(){
            this.typeId = this.$route.query.type;
            this.getTableList(1);
        },
        watch: {},
        methods:{   
            childPageValue(num){
                if(Number(num)>0){
                    this.getTableList(Number(num))
                }                
            },        
            allotRole(data){
                    this.$router.push({
                        path:'/activityStatistics/packet/teamSuccessDetail/'+data.id,
                        query: {
                                type:data.id,
                                typeId:this.typeId
                            }                    
                    });
            },         
            getTableList(num){
                var self = this;    
                this.loading = true;
                if(num){
                    self.pageNo = num;
                };
                var url = '';
                let query = {};
                query = {
                    params:{
                        // channelType:self.typeId,
                        // activityType:self.activeIndex==1?1:2,
                        pageNo:self.pageNo,
                        pageSize:self.pageSize,   
                    }
                }         
                url = this.$server.getPackSuccessTeam; 
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
                        self.tableDataOne = listIds;
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
        .block{
            text-align: center;
        }
    }   
.actions{
    background: #9E0E00 !important;
    color: #fff !important;
}

</style>
