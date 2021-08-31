<template>
    <div class="page-wrap gift-details-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <p class="title">{{giftName}}-{{type==1?'成人版':'少儿版'}}</p>
                </el-col>
            </el-row>     
            <el-row>
                <el-col :span="3">
                    <p class="label">分类</p>
                    <p class="unit">:</p>
                    <p class="value">{{type==1?'成人版':'少儿版'}}</p>
                </el-col>
                <el-col :span="4">
                    <p class="label">发布日期</p>
                    <p class="unit">:</p>
                    <p class="value">{{issueDate}}</p>
                </el-col>
                <el-col :span="3">
                    <p class="label">课程有效期</p>
                    <p class="unit">:</p>
                    <p class="value">{{date}}天</p>
                </el-col>
                <el-col :span="3">
                    <p class="label">课程状态</p>
                    <p class="unit">:</p>
                    <p class="value">{{statusText}}</p>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <p class="label">礼包课程</p>
                    <p class="unit">:</p>
                    <p class="value">{{course}}</p>
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
                        >
                    </el-table-column>
                    <el-table-column
                        prop="cellphone"
                        label="领取账号"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="createdAt"
                        label="领取日期"
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
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            id:'',
            giftName:'',
            type:1,
            name:'',
            course:'',
            statusText:'',
            date:'',
            issueDate:'',
            pageNo:1,
            pageSize:10,
            total:10,
            tableData:[],
            loading:false,
        };
    },
    metaInfo: {
        title: "国学大礼包"
    },
    components: {
        pagination,breadcrumb
    },
    watch: {
        pageNo(cur,old){
            if(cur>=1){
                this.getDetailList()
            }
        }
    },
    created() {
       if(this.$route.query){
            let {id,giftName,type,name,course,statusText,date,issueDate} = this.$route.query;
            this.giftName = giftName;
            this.type = type;
            this.id = id;
            this.name = type;
            this.course = JSON.parse(course).map(item=>item.title).join(',');
            this.statusText = statusText;
            this.date = date;
            this.issueDate = issueDate;
       }else{
           this.$router.go(-1)
       }
       this.getDetailList()
    },
    methods: {
        getDetailList(){
            this.loading = true;
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(`${this.$server.goDetail}/${this.id}`,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    this.tableData = res.content.list;
                    this.tableData.forEach((item,index)=>{
                        item.sortId = (this.pageNo-1)*this.pageSize+index+1;
                    })
                    this.total = res.content.total;
                }
            }).catch(()=>{
                this.loading = false;
            })
        }
    }
};
</script>

<style scoped lang="scss">
    .gift-details-wrap{
         font-size: 16px;
    }
    .page-header {
        background: #fff;
        padding: 30px 30px 30px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .title{
            margin-bottom:5px;
        }
        .page-title {
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
            margin-bottom: 20px;
        }
        .label,.value{
            display: inline-block;
            vertical-align: middle;
            color:#999;
            font-size: 14px;
            margin:4px 0;
        }
        .unit{
            display: inline-block;
            vertical-align: middle;
            margin-left: -5px;
            color:#999;
        }
        .label{
            margin-right: 5px;
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
    .type-btns{
        text-align: center;
    }
</style>

