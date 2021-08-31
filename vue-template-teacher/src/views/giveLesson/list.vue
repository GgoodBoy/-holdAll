<template>
    <div class="new-user-wrap">
        <div class="page-header">
            <el-row>
                <el-col :span="12">
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
                <el-col :span="3" style="float:right;text-align: right;"><el-button v-if="$authJudge('activity:givecourse:add')" type="primary" @click="$router.push('/activityObj/giveLessonUpdate')">添加</el-button></el-col>
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
                        width="50"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="名称"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="typeText"
                        label="用户类型"
                        align="center"
                        width="80"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="发布日期"
                        align="center"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="courseName"
                        label="包含课程"
                        align="center"
                        show-overflow-tooltip
                        >
                    </el-table-column>   
                    <el-table-column
                        prop="startTime"
                        label="开始时间"
                        align="center"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="endTime"
                        label="结束时间"
                        align="center"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="validity"
                        label="课程有效期"
                        align="center"
                        width="100"
                        >
                    </el-table-column>     
                    <el-table-column
                        prop="receiveNum"
                        label="领取人数"
                        align="center"
                        width="60"
                        >
                    </el-table-column>                              
                    <el-table-column
                        label="操作"
                        align="center"
                        width="150">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type="text" size="small" v-if="$authJudge('activity:givecourse:update')"  @click="edit(scope.row)">编辑</el-button>
                                    <el-button type="text" size="small" v-if="$authJudge('activity:givecourse:delete')"  @click="del(scope.row)">删除</el-button>
                                    <el-button type="text" size="small" v-if="$authJudge('activity:givecourse:detail')"  @click="goDetails(scope.row)">详情</el-button>  
                                </div>                                              
                            </template>                    
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
            titleList:[
                {
                    name:'活动',
                    pathInfo:'/activityObjList'
                },
                {
                    name:'新用户赠课活动',
                    pathInfo:''
                }               
            ],
            pageNo:1,
            pageSize:10,
            total:10,
            tableData:[],
            loading:false,
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
                this.getGiveCourseList()
            }
        }
    },
    created() {
       this.getGiveCourseList()
    },
    methods: {
        /**
         * 获取列表数据
         */
        getGiveCourseList(){
            this.loading = true;
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.getGiveCourseList,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    this.tableData = res.content.list.map((item,index)=>{
                        item.typeText = item.type==1?'成人':'少儿';
                        item.sortId = (this.pageNo-1)*this.pageSize+index+1;
                        return item;
                    })
                    this.total = res.content.total;
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        /**
         * 编辑
         */
        edit(obj){
            let query = {
               id:obj.id
            }
            this.$router.push({
                path:'/activityObj/giveLessonUpdate',
                query:query
            })
        },
        del(obj){
            this.$confirm('是否删除当前这条活动?', '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.$http.post(`${this.$server.deleteGiveCourseActivities}/${obj.id}`,{}).then(res=>{
                    if(res.status==200){
                        this.$message({
                            type:'success',
                            message:'删除成功'
                        })
                        this.pageNo = 0;
                        this.$nextTick(()=>{
                            this.pageNo = 1;
                        })
                    }
                })
            }).catch(()=>{})
        },
        /**
         * 去详情页面
         */
        goDetails(obj){
            let query = {
                id:obj.id
            }
            this.$router.push({
                path:'/activityObj/giveLessonDetails',
                query
            })
        }
    }
};
</script>

<style lang="scss">
    .new-user-wrap{
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
        .type-dialog{
            min-width: 250px;
            .type-btns{
                text-align: center;
            }
        }
    }
    
</style>

