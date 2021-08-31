<template>
    <div class="user-manage-page">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <div class="search-area">
                <el-input v-model="cellphone" placeholder="输入手机号查询" clearable></el-input>
                <el-button v-if="$authJudge('thekingofknowledge:user:select')" type="primary" @click="search">查询</el-button>
                <el-button v-if="$authJudge('thekingofknowledge:user:export')" type="primary" style="float:right" @click="exportEvent">导出</el-button>
            </div>
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                v-loading="loading"
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    prop="nickName"
                    label="微信昵称"
                    align="center"
                    min-width="30"/>
                <el-table-column
                    prop="cellphone"
                    label="手机号"
                    align="center"
                    min-width="40"/>
                <el-table-column
                    prop="currentHurdleNum"
                    label="当前关卡"
                    align="center"
                    min-width="30"/>
                <el-table-column
                    prop="rankName"
                    label="当前段位"
                    align="center"
                    min-width="30"/> 
                <el-table-column
                    prop="goldNum"
                    label="金币"
                    align="center"
                    min-width="30"/> 
                <el-table-column
                    prop="answerNum"
                    label="答题数"
                    align="center"
                    min-width="30"/> 
                <el-table-column
                    prop="errorRate"
                    label="错题率"
                    align="center"
                    min-width="30"/>   
                <el-table-column
                    prop="startLevel"
                    label="星级"
                    align="center"
                    min-width="30"/> 
                <el-table-column
                    prop="currentHurdleFraction"
                    label="当前关卡分值"
                    align="center"
                    min-width="30"/>  
                <el-table-column
                    prop="avgUseTime"
                    label="平均用时(秒)"
                    align="center"
                    min-width="30"/>               
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="90"
                >
                    <template slot-scope="scope">
                        <div class="btn-box">
                            <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('thekingofknowledge:user:wrongbook')" @click="$router.push(`/answerMiniProgram/userManageError?id=${scope.row.userId}`)">错题本</el-button>
                            <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('thekingofknowledge:user:receivedetail')" @click="$router.push(`/answerMiniProgram/userManageAward?id=${scope.row.userId}`)">领取奖项</el-button>
                            <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('thekingofknowledge:user:golddetail')" @click="$router.push(`/answerMiniProgram/userManageGoldDetails?id=${scope.row.userId}`)">金币明细</el-button>
                        </div>
                    </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        :current-page.sync="pageNo"
                        :page-size="pageSize"
                        :total="total"
                        layout="prev, pager, next"
                    />
                </div>
            </div>    
        </div>
    </div>   
</template>
<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken } from '@/utils/auth';
export default {
    components: {
        pagination,breadcrumb
    },
    data(){
        return{
            titleList:[
                {
                    name:'小程序知识达人王者',
                    pathInfo:'/answerMiniProgram/userManage'
                },
                {
                    name:'用户管理',
                    pathInfo:''
                }           
            ],
            cellphone:'',
            pageNo: 1,
            pageSize: 10,
            total: 10,
            tableData: [],
            loading: false,
        }
    },
    watch:{
        pageNo(cur){
            if(cur>0){
                this.getUserList()
            }
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
        getUserList(){
            this.loading = true;
            const query = {
                params:{
                    cellphone:this.cellphone,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(this.$server.getUserList,query).then(res=>{
                if(res.status==200){
                    this.tableData = res.content.list;
                    this.total = res.content.total;
                }
            }).finally(()=>{
                this.loading = false;
            })
        },
        search(){
            this.pageNo = 0;
            this.$nextTick(() => {
                this.pageNo = 1;
            })
        },
        exportEvent(){
            let url = `${this.$server.exportQuestionUser}?cellphone=${this.cellphone||''}&token=${getToken()}`
            window.open(url);  
        }
    }
}
</script>
<style lang="scss" scoped>
    .user-manage-page{
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
            .top-number{
                line-height: 40px;
                font-size: 14px;
                color:#aaa;
            }
            .search-area{
                margin-top:20px;
                overflow: hidden;
                /deep/ .el-input{
                    width: 200px;
                    margin-right: 20px;
                }
            }
        }
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            .block{
                text-align: center;
                margin-top:60px;
                padding-bottom:60px;
            }
        }
    }
</style>