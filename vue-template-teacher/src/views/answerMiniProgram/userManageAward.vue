<template>
    <div class="user-manage-page">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                v-loading="loading"
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    prop="awardTypeText"
                    label="奖项名称"
                    align="center"
                    min-width="30"/>
                <el-table-column
                    prop="hurdleId"
                    label="奖项关卡"
                    align="center"
                    min-width="30"/>    
                <el-table-column
                    prop="createdAt"
                    label="领取时间"
                    align="center"
                    min-width="30"/>
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
                    name:'领取奖项',
                    pathInfo:''
                }             
            ],
            userId:'',
            pageNo: 1,
            pageSize: 10,
            total: 10,
            tableData: [],
            loading: false,
            awardTypeArr:[
                {label:'指定课程优惠券',value:1},
                {label:'满减优惠券',value:2},
                {label:'无门槛优惠券',value:3},
                {label:'学习卡',value:4},
                {label:'书籍',value:5},
                {label:'积分',value:6},
                {label:'金币',value:7},
                {label:'课程',value:8},
            ],
        }
    },
    watch:{
        pageNo(cur){
            if(cur>0){
                this.getReceiveDetailList()
            }
        }
    },
    created(){
        if(this.$route.query&&this.$route.query.id){
            this.userId = this.$route.query.id;
            this.getReceiveDetailList()
        }
    },
    methods:{
        getReceiveDetailList(){
            this.loading = true;
            const query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(`${this.$server.getReceiveDetailList}/${this.userId}`,query).then(res=>{
                if(res.status==200){
                    this.tableData = res.content.list;
                    this.tableData.forEach((item)=>{
                        item.awardTypeText = this.awardTypeArr.find(option=>option.value==item.awardType).label;
                    })
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