<template>
    <div class="add-question-details">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <div class="search-area">
                <div class="input-box">
                    <el-input v-model="cellphone" placeholder="输入手机号查询" clearable></el-input>
                </div>
                <div class="time-box">
                    <el-date-picker
                        v-model="beginAt"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="开始时间">
                    </el-date-picker>
                    <el-date-picker
                        v-model="endAt"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="结束时间">
                    </el-date-picker>
                </div>
                <el-button style="float:right" type="primary" @click="exportEvent">导出</el-button>
                <el-button style="float:right;marginRight:10px" type="primary" @click="search">查询</el-button>
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
                    prop="cellphone"
                    label="手机号"
                    align="center"
                    />
                    <el-table-column
                    prop="createdAt"
                    label="时间"
                    align="center"
                    />
                    <el-table-column
                    prop="chooseKeyText"
                    label="用户选项"
                    align="center"
                    />
                    <el-table-column
                    prop="rightKeyText"
                    label="正确答案"
                    align="center"
                    />
                </el-table>
            </div>    
        </div>
    </div>
</template>
<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken } from '@/utils/auth';
const keys = ['A','B','C','D']
export default {
    components: {
        pagination,breadcrumb
    },
    data(){
        return{
            titleList:[
                {
                    name:'小程序知识达人王者',
                    pathInfo:'/answerMiniProgram/addQuestion'
                },
                {
                    name:'添加题库',
                    pathInfo:'/answerMiniProgram/addQuestion'
                },
                {
                    name:'题库详情',
                    pathInfo:''
                }               
            ],
            id:'',
            cellphone:'',
            beginAt:'',
            endAt:'',
            pageNo: 1,
            pageSize: 10,
            total: 10,
            tableData: [],
            loading: false,
        }
    },
    watch: {
        pageNo(cur, old) {
            if (cur >= 1) {
                this.getQuestionUserDetailList()
            }
        }
    },
    created(){
        if(this.$route.query){
            this.id = this.$route.query.id;
            this.getQuestionUserDetailList()
        }
    },
    methods:{
        getQuestionUserDetailList(){
            if(this.beginAt!=''&&this.endAt!=''){
                if(new Date(this.beginAt).getTime()>new Date(this.endAt).getTime()){
                    this.$message.error('开始时间不能大于结束时间');
                    return;
                }
            }
            this.loading = true;
            const query = {
                params:{
                    cellphone:this.cellphone,
                    beginAt:this.beginAt,
                    endAt:this.endAt,
                    pageNo: 1,
                    pageSize: 10,
                }
            }
            this.$http.get(`${this.$server.getQuestionUserDetailList}/${this.id}`,query).then(res=>{
                this.loading = false;
                if (res.status == 200) {
                    this.tableData = res.content.list;
                    this.tableData.forEach((item,index)=>{
                        item.chooseKeyText = keys[item.chooseKey-1];
                        item.rightKeyText = keys[item.rightKey-1];
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
        },
        exportEvent(){
            if(this.beginAt!=''&&this.endAt!=''){
                if(new Date(this.beginAt).getTime()>new Date(this.endAt).getTime()){
                    this.$message.error('开始时间不能大于结束时间');
                    return;
                }
            }
            let url = `${this.$server.exportQuestionUserDetailList}/${this.id}?cellphone=${this.cellphone||''}&beginAt=${this.beginAt||''}&endAt=${this.endAt||''}&token=${getToken()}`
            window.open(url);  
        }
    }
}
</script>
<style lang="scss" scoped>
    .add-question-details{
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
        .search-area{
            overflow: hidden;
            margin-top:20px;
            >div{
                display: inline-block;
                vertical-align: middle;
                margin-right: 20px;
            }
            .input-box{
                width: 200px;
            }
            .el-date-editor{
                margin-right: 20px;
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