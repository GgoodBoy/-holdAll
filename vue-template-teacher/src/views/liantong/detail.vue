<template>
    <div class="liantong-detail-page">
        <div class="page-header">
            <el-row>
                <el-col :span="4">
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-button size="small" @click="goData">数据</el-button>
            <el-button size="small" type="primary">详情</el-button>
        </div>
        <div class="page-content">
            <div class="search-area">
                <div>
                    <el-input placeholder="请输入手机号查询" v-model="cellphone"></el-input>
                    <el-button type="primary" @click="search">查询</el-button>
                </div>
                <el-button type="primary" @click="exportUnicom">导出</el-button>
            </div>
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    max-height="500"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="30"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="cellphone"
                        label="手机号"
                        align="center"
                        min-width="30"
                    >
                    </el-table-column>
                     <el-table-column
                        prop="source"
                        label="来源"
                        align="center"
                        min-width="30"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="开通时间"
                        align="center"
                        min-width="30"
                    >
                    </el-table-column>
                    <el-table-column
                        label="看课记录"
                        align="center"
                        >
                        <template slot-scope="scope"> 
                            <el-button type="text" @click="showDetails(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>    
                </el-table>
                <!-- <div class="block">
                    <el-pagination
                        layout="prev, pager, next"
                        :current-page.sync="pageNo"
                        :page-size="pageSize"
                        :total="total"
                    >
                    </el-pagination>
                </div>          -->
            </div>        
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            :width="'600px'"
            center>
            <div>
                <el-table
                border
                :data="tableData1"
                ref="dialogTable"
                height="500"
                v-loading="loading1"
                style="width: 100%">
                <el-table-column
                    prop="courseName"
                    label="课程名称"
                    align="center"
                    min-width="150"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="courseProgress"
                    label="学习进度"
                    align="center"
                    min-width="60"
                >
                </el-table-column>
                <el-table-column
                    prop="studyDurationText"
                    label="学习时长"
                    align="center"
                    min-width="60"
                >
                </el-table-column>
            </el-table>    
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import pagination from "@/components/pagination";
const formatSeconds = value =>{
    let m = parseInt(value % 3600 / 60)
    let s = parseInt(value % 3600 % 60)
    let mStr = m<10?`0${m}`:m;
    let sStr = s<10?`0${s}`:s;
    let h = parseInt(value/3600)
    let hStr = h<10?`0${h}`:h;
    return `${h}:${m}′${s}″`
}
import { getToken } from '@/utils/auth';
export default {
    data(){
        return{
            titleList:[
                {
                    name:'流量包管理',
                    pathInfo:'/liantongManage/list'
                },
                {
                    name:'明细',
                    pathInfo:''
                }               
            ],
            id:'',
            cellphone:'',
            tableData:[
                // {sortId:1,cellphone:1,source:'联通',createdAt:'2020-01-01'}
            ],
            loading:false,
            pageNo:1,
            pageSize:10,
            total:1,
            dialogVisible:false,
            tableData1:[],
            loading1:false,
            pageNos:1,
            pageSizes:10,
            tempUserId:'',
        }
    },
    created() {
        this.id = this.$route.params.id;
        this.getList()
    },
    watch:{
        // pageNo(cur,old){
        //     if(cur>=1){
        //         this.getList()
        //     }
        // },
        dialogVisible(cur,old){
            if(!cur){
                this.tableData1 = []
                this.loading1 = false
                this.pageNos = 1
            }
        }
    },
    components: {
        breadcrumb,pagination
    },
    methods:{
        goData(){
            this.$router.push(`/liantongManage/data/${this.$route.params.id}`)
        },
        showDetails(obj){
            this.dialogVisible = true;
            this.tempUserId = obj.userId;
            this.getStudyRecord()
        },
        //导出
        exportUnicom(){
            let url = `${this.$server.detailUnicomListExport}?id=${this.id}&cellphone=${this.cellphone||''}&token=${getToken()}`
            window.open(url);  
        },        
        /**
         * 获取用户学习进度
         */
        getStudyRecord(){
            this.loading1 = true;
            let query = {
                params:{
                    pageNo:this.pageNos,
                    pageSize:this.pageSizes
                }
            }
            this.$http.get(`${this.$server.studyRecord}/${this.tempUserId}`,query).then(res=>{
                if(res.status==200){
                    this.loading1 = false;
                    this.tableData1 = [...this.tableData1,...res.content.list]
                    this.tableData1.forEach(item=>{
                        item.studyDurationText = item.studyDuration!=null?formatSeconds(item.studyDuration):''
                    })
                    this.$nextTick(()=>{
                        let dom = this.$refs.dialogTable.$el.querySelector('.is-scrolling-none');
                        if(!dom) return;
                        if(res.content.isLastPage){
                            dom.removeEventListener("scroll",this.scrollEvent)
                        }else{
                            dom.addEventListener("scroll",this.scrollEvent)
                        }
                    })
                }
            }).catch(()=>{
                this.loading1 = false;
            })
        },
        /**
         * 滚动分页
         */
        scrollEvent(){
            let dom = this.$refs.dialogTable.$el.querySelector('.is-scrolling-none');
            let scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight
            let sign = 5;
            if (scrollDistance <= sign) {
                dom.removeEventListener("scroll",this.scrollEvent)
                this.pageNos++;
                this.getStudyRecord();
            }
        },
        getList(){
            this.loading = true;
            // pageSize:this.pageSize,
            // pageNo:this.pageNo            
            let query = {
                params:{
                    id:this.id,
                    cellphone:this.cellphone,
                    pageSize:this.pageSize,
                    pageNo:this.pageNo                        
                }
            }
            this.$http.get(this.$server.getdetailPage,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.total = res.content.total;
                    this.tableData = res.content.list;
                    this.tableData.forEach((item,index)=>{
                        // item.sortId = (this.pageNo-1)*this.pageSize+index+1;
                        item.sortId = index+1;
                    })
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        search(){
            // this.pageNo = 0;
            // this.$nextTick(()=>{
            //     this.pageNo = 1;
            // })
            this.getList();
        }
    }
}
</script>       
<style lang="scss" scoped>
    .liantong-detail-page{
        .page-header{
            background: #fff;
            padding: 20px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        }
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            padding: 20px;
            font-size: 16px;
            margin-top:20px;
            // .block{
            //     text-align: center;
            //     margin-top:60px;
            //     padding-bottom:60px;
            // }
            .search-area{
                margin-bottom:20px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                .el-input{
                    width: 250px;
                    margin-right: 10px;
                }
            }
        }
    }
</style>