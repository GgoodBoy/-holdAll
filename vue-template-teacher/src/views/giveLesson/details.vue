<template>
    <div class="page-wrap giveLesson-details">
        <div class="page-header">
            <el-row>
                <el-col >
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <p class="title">{{name}}</p>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <p class="label">类型</p>
                    <p class="unit">:</p>
                    <p class="value">{{type==1?'成人版':'少儿版'}}</p>
                </el-col>
                <el-col :span="6">
                    <p class="label">发布日期</p>
                    <p class="unit">:</p>
                    <p class="value">{{createdAt}}</p>
                </el-col>
                <el-col :span="6">
                    <p class="label">课程有效期</p>
                    <p class="unit">:</p>
                    <p class="value">{{validity}}天</p>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <p class="label">开始时间</p>
                    <p class="unit">:</p>
                    <p class="value">{{startTime}}</p>
                </el-col>
                <el-col :span="6">
                    <p class="label">结束时间</p>
                    <p class="unit">:</p>
                    <p class="value">{{endTime}}</p>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <p class="label">赠送课程</p>
                    <p class="unit">:</p>
                    <p class="value">{{courseName}}</p>
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
                        prop="cellPhone"
                        label="领取账号"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="receiveTime"
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
            name:'',
            type:1,
            createdAt:'',
            validity:'',
            startTime:'',
            endTime:'',
            courseName:'',
            pageNo:1,
            pageSize:10,
            total:10,
            tableData:[],
            loading:false,
            titleList:[
                {
                    name:'活动',
                    pathInfo:'/activityObjList'
                },
                {
                    name:'新用户赠课活动',
                    pathInfo:'/activityObj/giveLessonList'
                }
            ]
        };
    },
    metaInfo: {
        title: "新用户赠课活动"
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
            this.id = this.$route.query.id;
            this.$nextTick(()=>{
                this.findDetail()
                this.getDetailList()
            })
       }else{
           this.$router.go(-1)
       }
    },
    methods: {
        /**
         * 获取详情
         */
        findDetail(){
            let loadingInstance = this.$loading({
                target:document.querySelector('.giveLesson-details')
            });
            let query = {
                params:{}
            }
            this.$http.get(`${this.$server.findDetail}/${this.id}`,query).then(res=>{
                if(res.status==200){
                    this.name = res.content.name;
                    this.type = res.content.type;
                    this.validity = res.content.validity;
                    this.startTime = res.content.startTime;
                    this.endTime = res.content.endTime;
                    this.imgUrl = res.content.imgUrl;
                    this.createdAt = res.content.createdAt;
                    this.courseName = res.content.courseName;
                    this.titleList.push({
                        name:res.content.name
                    })
                }
            }).finally(()=>{
                loadingInstance.close()
            })
        },
        getDetailList(){
            this.loading = true;
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(`${this.$server.getGiveCourseRecordList}/${this.id}`,query).then(res=>{
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
    .giveLesson-details{
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

