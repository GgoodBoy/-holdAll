<template>
    <div class="course-period-page">
        <auditPlan :planIndex="2" v-on:linkUpdate="linkUpdate"/>
        <alertHint class="update-tip" v-if="lastSubmitRemark?true:false" :content="lastSubmitRemark"/>        
        <div class="page-content" style="margin-top:20px">
            <el-table :data="tableData"
                      border
                      v-loading="loading"
                      header-cell-class-name="list-header-layout-bg"
                      style="width: 100%;min-height:600px">
                <el-table-column label="序号"
                                 align="center"
                                 min-width="134">
                    <template slot-scope="scope">
                        第{{ scope.$index +1 }}章
                    </template>
                </el-table-column>
                <el-table-column label="课时名称"
                                 prop="title"
                                 align="center"
                                 min-width="370">
                </el-table-column>
                <el-table-column prop="isTryStr"
                                 label="是否试看"
                                 align="center"
                                 min-width="149">
                </el-table-column>
                <el-table-column prop="name"
                                 label="操作"
                                 align="center">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   class="black-btn" @click="goPreview(scope)">预览</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :totalNum="pageData.totalNum"
                    :currentPage="pageData.currentPage"
                    class="paging" />
        <div class="btns-area" v-show="!previewFlag">
            <el-button plain class="my-normal-btn" @click="$router.go(-1)">取消</el-button>
            <el-button plain class="my-normal-btn" @click="passClick">通过</el-button>
            <el-button type="primary" class="my-normal-btn" @click="rejectClick">驳回</el-button>
        </div>
        <my-dialog :showFlag.sync="rejectFlag" :title="'驳回原因'" :sureName="'reject'" v-on:reject="rejectPass" :cancelName="'cancelReject'" v-on:cancelReject="rejectCancel">
            <div slot="dialog-body" class="reject-box">
                <el-input type="textarea" v-model="msg"></el-input>
                <span>{{msg.length}}/100</span>
            </div>
        </my-dialog>
    </div>
</template>

<script>
import auditPlan from "./components/auditPlan";
import pagination from "@/components/pagination";
import myDialog from '@/components/myDialog/myDialog'
import alertHint from '@/components/alert'

export default {
    data() {
        return {
            loading: false,
            tableData:[],
            pageData:{},
            search:{
                courseId:'',
                title:'',
                isTry:''
            },
            previewFlag:false,
            rejectFlag:false,
            lastSubmitRemark:'',
            msg:''
        };
    },
    components: { auditPlan, pagination ,myDialog,alertHint},
    created(){
        let courseId = this.$route.query.id;
        let state = this.$route.query.state;
        this.lastSubmitRemark=sessionStorage["periodListIndo"];
        this.previewFlag = state == 0?true:false;
        this.search.courseId = courseId;
        this.getList();
    },
    methods:{
        getList(){
          this.loading =true;
          let params = this.search;
          this.$http.get(this.$server.periodInfo,{params:params}).then(res=>{
                console.log(res)
                this.tableData = res.content;
                this.loading = false;
            })

        },
        linkUpdate(flag){
            if(flag.id==1){
                let query = this.$route.query
                this.$router.push({path:'/course/audit/baseInfo',query})
            }
        },
        goPreview(scope){
            let query = {id:scope.row.id,state:0}
            this.$router.push({path:'/course/audit/periodPrevies',query:query})
        },
        rejectCancel(){
          this.rejectFlag = false;
        },
        rejectClick(){
          this.rejectFlag = true;
        },
        rejectPass(){
            let params = {
                // transformRequest:true,
                msg:this.msg
            }
            let courseId = this.$route.query.id
            this.$http.post(`${this.$server.courseAuditDeny}/${courseId}`,params
            ).then(res=>{
                if(res.status == 200)
                    this.$router.push('/course/audit')
            })
        },
        passClick(){
            let courseId = this.$route.query.id
            this.$confirm('当前课程是否通过审核?', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: ''
            }).then(() => {
                this.$http.post(`${this.$server.courseAuditPass}/${courseId}`).then(res=>{
                    if(res.status==200){
                        this.$router.push('/course/audit')
                        this.$message({
                            type: 'success',
                            message: '审核通过!'
                        });
                    }
                })
            }).catch(() => {

            });
        },

    }
};
</script>

<style lang="scss">
    .paging {
        margin: 30px 0;
    }    
    .course-period-page{
        .btns-area{
            text-align: center;
            margin:40px 0;
            .my-normal-btn{
                margin-right: 50px;
            }
        }
        .update-tip {
            background: rgba(255, 126, 131, 0.5);
            box-shadow: 0px 3px 9px 0px rgba(237, 241, 247, 1);
            border-radius: 5px;
            color: rgba(247, 59, 66, 1);
            font-size: 16px;
            margin: 20px 0;
        }        
    }
    .my-normal-btn{
        padding: 12px 40px;
    }
    .reject-box{
        position: relative;
        text-align:center;
        textarea{
            display: inline-block;
            width: 440px;
            height: 160px;
            resize: none;
        }
        span{
            position: absolute;
            bottom:10px;
            right: 100px;
        }
    }
</style>
