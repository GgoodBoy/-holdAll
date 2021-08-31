<template>
    <div class="inside-msg-page">
        <div class="page-header">
            <el-row>
                <el-col :span="24">
                    <breadcrumb :menuList ='titleList'></breadcrumb>
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
                        width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="sendNum"
                        label="发送人数"
                        align="center"
                        width="150"
                        >
                    </el-table-column>  
                    <el-table-column
                        prop="createdAt"
                        label="发送时间"
                        align="center"
                        width="200"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="nickname"
                        label="发送人"
                        align="center"
                        width="150"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="content"
                        label="内容"
                        align="center"
                        >
                    </el-table-column>                                                   
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :current-page.sync="pageNo"
                        :page-size="pageSize"
                        :total="total"
                    >
                    </el-pagination>
                </div>             
            </div>
        </div>
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import pagination from "@/components/pagination";
export default {
    data(){
        return{
            titleList:[
                {
                    name:'APP管理系统',
                    pathInfo:''
                },
                {
                    name:'站内信',
                    pathInfo:'/backstage/inside'
                },
                {
                    name:'待发送消息',
                    pathInfo:''
                }
            ],
            loading:false,
            tableData:[],
            pageNo:1,
            pageSize:10,
            total:10,
        }
    },
    components:{
        breadcrumb,
        pagination
    },
    watch:{
        pageNo(cur){
            this.getList()
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            this.loading = true;
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.getWaitMessageList,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    this.tableData = res.content.list.map((item,index)=>{
                        item.sortId = (this.pageNo-1)*this.pageSize+index+1;
                        return item;
                    })
                    this.total = res.content.total;
                }
            }).catch(()=>{
                this.loading = false;
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .inside-msg-page{
        .page-header {
            background: #fff;
            padding: 10px 30px 10px 20px;
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
        }
    }
</style>