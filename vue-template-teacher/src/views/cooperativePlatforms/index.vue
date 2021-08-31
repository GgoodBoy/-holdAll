<template>
    <div class="page-wrap">
        <div class="page-header">
            <el-row>
                <el-col :span="4">
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <div class="keyword">
                    <el-input v-model="name"
                        placeholder="请输入名称查询"
                        maxlength="20"
                        clearable
                        ></el-input>
                    </div>
                </el-col>                     
                <el-col :span="3"  style="text-align: left;padding-left:10px;"><el-button v-if="$authJudge('activity:cooperation:select')" type="primary" @click="search">查询</el-button></el-col>
                <el-col :span="15" style="text-align: right;"><el-button v-if="$authJudge('activity:cooperation:add')" type="primary" @click="$router.push('/activityObj/cooperativeUpdate')">创建H5页面</el-button></el-col>
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
                        prop="name"
                        label="名称"
                        align="center"
                        min-width="100"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="relevance"
                        label="关联课程"
                        min-width="200"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="updatedAt"
                        label="更新时间"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="stateText"
                        label="状态"
                        align="center"
                        width="68"
                        >
                    </el-table-column>                                       
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="150">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button v-if="$authJudge('activity:cooperation:edit')" size="small" @click="edit(scope.row)">编辑</el-button>
                                    <el-button v-if="$authJudge('activity:cooperation:online')" size="small" v-show="scope.row.state==1" @click="upOrDown(scope.row)">上架</el-button>
                                    <el-button v-if="$authJudge('activity:cooperation:offline')" size="small" v-show="scope.row.state!=1" @click="upOrDown(scope.row)">下架</el-button>
                                    <el-button v-if="$authJudge('activity:cooperation:preview')" size="small" @click="preview(scope.row)">预览</el-button>  
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
        <transition name="el-fade-in-linear">
            <div class="preview-box" v-if="previewFlag" @click="previewFlag=false">
                <iframe :src="url" width="375" height="667"></iframe>
            </div>
        </transition>
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
                    name:'合作平台',
                    pathInfo:''
                }               
            ],
            name:"",
            pageNo:1,
            pageSize:10,
            total:10,
            tableData:[],
            loading:false,
            previewFlag:false,
            url:''
        };
    },
    metaInfo: {
        title: "合作平台"
    },
    components: {
        pagination,breadcrumb
    },
    watch: {
        pageNo(cur,old){
            if(cur>=1){
                this.getCooperationPlatformList();
            }
        }
    },
    created() {
       this.getCooperationPlatformList()
    },
    methods: {
        /**
         * 获取列表数据
         */
        getCooperationPlatformList(){
            this.loading = true;
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            if(this.name.length>0){
                query.params.name = this.name
            }
            this.$http.get(this.$server.getCooperationPlatformList,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.tableData = res.content.list.map(item=>{
                        item.relevance = item.pcrList.map(option=>{
                            return option.courseName
                        }).join(',')
                        item.stateText = item.state==1?'已下架':'已上架'
                        return item;
                    })
                    this.total = res.content.total;
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
        },
        /**
         * 编辑
         */
        edit(obj){
            let {name,headUrl,pcrList,id} = obj;
            let courseList = pcrList.map(item=>{
                return{
                    id:item.courseId,
                    name:item.courseName,
                    url:item.backgrandUrl
                }
            })
            let query = {
                id,name,headUrl,courseList
            }
            this.$router.push({
                path:`/activityObj/cooperativeUpdate`,
                query:{
                    data:JSON.stringify(query)
                }
            })
        },
        /**
         * 上架or下架
         */
        upOrDown(obj){
            if(obj.state==1){
                this.$confirm('是否上架当前合作平台？', '上架确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$http.post(`${this.$server.upCooperationPlatform}/${obj.id}`,{}).then(res=>{
                        if(res.status==200){
                            this.$message({
                                type:'success',
                                message:'上架成功'
                            })
                            this.getCooperationPlatformList();
                        }
                    })
                }).catch(()=>{})
            }else if(obj.state==2){
                this.$confirm('是否下架当前合作平台？', '下架确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$http.post(`${this.$server.downCooperationPlatform}/${obj.id}`,{}).then(res=>{
                        if(res.status==200){
                            this.$message({
                                type:'success',
                                message:'下架成功'
                            })
                            this.getCooperationPlatformList();
                        }
                    })
                }).catch(()=>{})
            }
        },
        /**
         * 预览复制
         */
        preview(obj){
            let url1 = `https://xgxm.xueguoxue.com/activity/cooperativePlatforms.html?cppId=${obj.id}`
            let url2 = `https://scm.youfushuyuan.com/activity/cooperativePlatforms.html?cppId=${obj.id}`
            let url3 = `http://172.16.120.7/activity/cooperativePlatforms.html?cppId=${obj.id}`
            this.url = process.env.NODE_ENV == 'production'?(process.env.argv == 'prod'?url1:url2):url3
            this.previewFlag = true;
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
        .page-title {
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
            margin-bottom: 20px;
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
    .edit-dialog{
        .edit-box{
            margin:10px 0 40px 0;
        }
        .name,.select-box,.btn{
            display: inline-block;
            vertical-align: middle;
        }
        .name{
            width: 180px;
        }
        .select-box{
            width: 110px;
            margin:0 5px;
        }
        .error-tips{
            position: absolute;
            left: 0;
            bottom:-30px;
            color:#ca2312;
            font-size: 14px;
        }
    }
    .preview-box{
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 1111;
        iframe{
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background: #fff;
        }
    }
</style>

