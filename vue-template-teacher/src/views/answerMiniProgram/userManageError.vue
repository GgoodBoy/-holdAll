<template>
    <div class="user-manage-page">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <div class="search-area">
                <el-input v-model="title" placeholder="输入名称查询" clearable></el-input>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" style="float:right" @click="exportEvent">导出</el-button>
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
                    prop="questionName"
                    label="错题名称"
                    align="center"
                    min-width="30"/>
                <el-table-column
                    prop="createdAt"
                    label="答题时间"
                    align="center"
                    min-width="10"/>  
                <el-table-column
                    prop="chooseKeyText"
                    label="用户选项"
                    align="center"
                    width="100"
                    />   
                <el-table-column
                    prop="rightKeyText"
                    label="正确答案"
                    align="center"
                    width="100"/>   
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
                    pathInfo:'/answerMiniProgram/userManage'
                },
                {
                    name:'错题本',
                    pathInfo:''
                }             
            ],
            userId:'',
            title:'',
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
                this.getWrongBookList()
            }
        }
    },
    created(){
        if(this.$route.query&&this.$route.query.id){
            this.userId = this.$route.query.id;
            this.getWrongBookList()
        }
    },
    methods:{
        getWrongBookList(){
            this.loading = true;
            const query = {
                params:{
                    title:this.title,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(`${this.$server.getWrongBookList}/${this.userId}`,query).then(res=>{
                if(res.status==200){
                    this.tableData = res.content.list;
                    const arr = ['A','B','C','D']
                    this.tableData.forEach((item=>{
                        item.chooseKeyText = item.chooseKey<=0?'未答':arr[item.chooseKey-1]
                        item.rightKeyText = arr[item.rightKey-1]
                    }))
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
            let url = `${this.$server.exportWrongBookList}/${this.userId}?title=${this.title||''}&token=${getToken()}`
            window.open(url);  
        },
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