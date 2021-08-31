<template>
    <div class="page-wrap">
        <div class="page-header">
            <el-row>
                <el-col :span="4">
                    <p>当前评论被举报了{{reportNum}}次</p>
                </el-col>
                <el-col :span="3" :offset="17">
                    <p>状态：{{show==1?'隐藏':'显示'}}</p>
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
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="reportName"
                        label="举报方向"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="reportCellphone"
                        label="举报者账号"
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
import pagination from "@/components/pagination";
export default {
    data() {
        return {
            commentId:'',
            reportNum:'',
            show:'',
            pageNo:1,
            pageSize:10,
            total:10,
            tableData:[],
            loading:false,
        };
    },
    metaInfo: {
        title: "举报详情"
    },
    components: {
        pagination
    },
    watch: {
        pageNo(cur,old){
            if(cur>=1){
                this.getList();
            }
        }
    },
    created() {
        this.commentId = this.$route.query.commentId;
        this.$nextTick(()=>{
            this.getList();
        })
    },
    methods: {
        /**
         * 获取列表数据
         */
        getList(){
            this.loading = true;
            let query = {
                params:{
                    commentId:this.commentId,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.commentReportList,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.reportNum = res.content.reportNum;
                    this.show = res.content.show;
                    this.tableData =  res.content.info.list.map((item,index)=>{
                        if(res.content.info.pageNum==1){
                            item.sortId = index+1;
                            return item;
                        }else if(res.content.info.pageNum>1){
                            item.sortId = (res.content.pageNum-1)*10+index+1;
                            return item;
                        }
                    })
                    this.total = res.content.info.total;
                }
            })
        },
        /**
         * 搜索
         */
        search(){
            this.pageNo = 0;
            this.$nextTick(()=>{
                this.pageNo = 1;
            })
        }
    }
};
</script>

<style scoped lang="scss">
    .page-header {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        p{
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
        }
    }
    .search-form {
        width: 100%;
        margin-right: 10px;
        position: relative;
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
</style>

