<template>
    <div class="page-wrap content-wrap">
        <div class="page-header">
            <el-col  style="marginBottom:10px">
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
            </el-col>
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
                        min-width="100">
                    </el-table-column> 
                    <el-table-column
                        prop="cellphone"
                        label="手机号"
                        align="center"
                        show-overflow-tooltip
                        min-width="120">
                    </el-table-column>   
                    <el-table-column
                        prop="scoreNum"
                        label="成长值"
                        align="center"
                        min-width="60"
                        >
                    </el-table-column>                 
                    <el-table-column
                        prop="joinTime"
                        label="加入时间"
                        align="center"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        prop="deletedAt"
                        label="清理时间"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="cleanUser"
                        label="清理人"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        fixed="right"
                        min-width="100"
                        >
                        <template slot-scope="scope">
                            <div class="btn-box">
                                <el-button size="small" type='text' @click="handleEven(scope.row)">成长值详情</el-button>
                            </div>
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
        <el-dialog
        :visible.sync="dialogVisibleOne"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="true"
        width="30%"
        class="dialogOne"
        >
            <div>
              <el-table
                    border
                    :data="tableDataDetail"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="title"
                        label="类型名称"
                        align="center"
                        show-overflow-tooltip
                        min-width="120">
                    </el-table-column>                    
                    <el-table-column
                        prop="createdAt"
                        label="时间"
                        align="center"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        prop="score"
                        label="分值"
                        align="center"
                        min-width="60"
                        >
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValueTwo"
                        :current-page.sync="pageAtionTwo.paginationPage"
                        :total="pageAtionTwo.pageTotal">
                    </el-pagination>
                </div>                   
            </div>                    
        </el-dialog>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth';
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            titleList:[
                {
                    name:'国学达人计划',
                    pathInfo:'/talentShow/ambassadorUser'
                },
                {
                    name:'达人/大使用户管理',
                    pathInfo:'/talentShow/ambassadorUser'
                },
                {
                    name:'清理记录',
                    pathInfo:''
                }
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            pageAtionTwo:{
                pageTotal:0,
                paginationPage:1
            },
            pageNo:1,
            pageSize:10,
            tableData:[],
            tableDataDetail:[],
            loading:false,
            dialogVisibleOne:false,
            selectData:{}
        };
    },
    components: {
        pagination,
        breadcrumb,
    },
    watch: {},
    created() {
        this.getList(1)
    },
    methods: {
        childPageValue(num){
            if(Number(num)>0){
                this.getList(Number(num))
            }
        },
        childPageValueTwo(num){
            if(Number(num)>0){
                this.handle1(Number(num))
            }
        },
        /**
         * 获取列表数据
         */
        getList(num){
            this.loading = true;
            var self = this;
            if(num){
                self.pageNo = num;
            }
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.getExpertCleanRecord,query).then(res=>{
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
        handleEven(data){
            this.selectData = data;
            this.dialogVisibleOne = true;
            this.handle1(1);
        },
        /**
         * 推荐/取消推荐
         */
        handle1(num){
            let self = this;
            if(num){
                this.pageNo = num;
            }
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.getExpertScoreRecord+this.selectData.id,query).then(res=>{
                if(res.status==200){                
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
                        self.tableDataDetail = listIds;
                        self.pageAtionTwo.pageTotal = contentdate.total;
                        self.pageAtionTwo.paginationPage = num;
                    }
                }
            })
        }
    }
};
</script>
<style lang="scss">
    .el-tooltip__popper{
        max-width: 500px;
    }
</style>
<style lang="scss">
    .content-wrap{
        .page-header {
            background: #fff;
            padding: 30px 30px 38px 20px;
            margin-bottom: 26px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            .title {
                font-size: 18px;
                margin-bottom: 20px;
            }
        }
        .table-data-comment{
            white-space: pre-line!important;
            word-break: break-word;
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
        .type-image{
            text-align: center;
            position: relative;
            .preview{
                position: absolute;
                right: 0;
                cursor: pointer;
            }
        }
    }
</style>
<style lang="scss">
    .el-tooltip__popper{
        max-width: 600px;
    }
    .dialogOne{
        .block{
            text-align: center;
        }
    }
</style>

