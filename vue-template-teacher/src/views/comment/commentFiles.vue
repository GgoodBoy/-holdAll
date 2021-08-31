<template>
    <div class="page-wrap comment-wrap">
        <el-row class="top">
            <el-col :span="5">
                <p>总评论：{{allCount}}条</p>
            </el-col>
            <el-col :span="5" :offset="4">
                <p>今日已评论：{{todayCommentCount}}条</p>
            </el-col>
        </el-row>
        <div class="page-header">
            <el-col>
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
            </el-col>
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-input v-model="content"
                    placeholder="输入评论内容、来源或帐号"
                    maxlength="20"
                    clearable
                    ></el-input>
                </el-col>   
                <el-col :span="3" >
                    <el-select v-model="show"
                        clearable
                        placeholder="显示状态"
                        >
                        <el-option v-for="(item,i) in showArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>               
                </el-col>  
                <el-col :span="3" >
                    <el-select v-model="recommendStatus"
                        clearable
                        placeholder="推荐状态"
                        >
                        <el-option v-for="(item,i) in recommendArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>               
                </el-col>
                <el-col :span="3">
                    <el-select v-model="warning"
                        clearable
                        placeholder="预警"
                        >
                        <el-option v-for="(item,i) in warnArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>               
                </el-col>  
                <el-col :span="3">
                    <el-select v-model="commentStatus"
                        clearable
                        placeholder="审核"
                        >
                        <el-option v-for="(item,i) in examineArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>               
                </el-col>  
                <el-col :span="3">
                    <el-select v-model="report"
                        clearable
                        placeholder="举报"
                        >
                        <el-option v-for="(item,i) in reportArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>               
                </el-col> 
                <el-col :span="3">
                    <el-select v-model="commentType"
                        clearable
                        placeholder="级别"
                        >
                        <el-option v-for="(item,i) in levelArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>               
                </el-col>   
            </el-row>     
            <el-row style="marginTop:20px">
                <el-col :span="12">
                    <el-date-picker
                        v-model="start"
                        type="date"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions1"
                        placeholder="开始时间">
                    </el-date-picker>
                    <span style="margin:0 10px">至</span>
                    <el-date-picker
                        v-model="end"
                        type="date"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions2"
                        placeholder="结束时间">
                    </el-date-picker>
                </el-col>                                                             
                <el-col :span="2" :offset="8" v-if="$authJudge('comment:manage:select')"><el-button type="primary" @click="search">查询</el-button></el-col>
                <el-col :span="2" v-if="$authJudge('comment:manage:verify')"><el-button type="primary" @click="examine">审核留言</el-button></el-col>
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
                        min-width="100"
                        fixed="left"
                        align="center">
                        <template slot="header" slot-scope="scope">
                            <el-checkbox v-model="allChecked" @change="allCheck"></el-checkbox>
                            <span>全选</span>
                        </template>
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.checked" @change="checkStatus(scope.row)"></el-checkbox>
                            <span style="margin-left:5px">{{scope.row.sortId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="commentUserPhone"
                        label="账号"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="commentUserName"
                        label="昵称"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="评论来源"
                        align="center"
                        min-width="160"
                        >
                        <template slot-scope="scope">
                           <p class="course-title" style="margin-left:5px">{{scope.row.courseTitle}}<span class="flag" v-if="scope.row.isElite==1||scope.row.isTop==1">{{scope.row.isElite==1||scope.row.isTop==1?(scope.row.isElite?'精':'荐'):''}}</span></p>
                        </template>
                    </el-table-column>   
                    <el-table-column
                        label="评论内容"
                        min-width="300"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.content" placement="top" v-if="scope.row.content.length>50">
                                <p class='table-data-comment'>{{scope.row.content.substr(0,50)+'...'}}</p>
                            </el-tooltip>
                            <p v-else class='table-data-comment'>{{scope.row.content}}</p>
                        </template>
                    </el-table-column>    
                    <el-table-column
                        prop="topText"
                        label="置顶"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                    </el-table-column>        
                    <el-table-column
                        prop="warnText"
                        label="预警"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="reportNum"
                        label="举报"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <p style="cursor:pointer" @click="goDetails(scope.row)">{{scope.row.reportNum}}</p>
                        </template>
                    </el-table-column> 
                    <el-table-column
                        prop="touch"
                        label="触发词"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="showText"
                        label="显示"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                    </el-table-column>          
                    <el-table-column
                        prop="commentTypeText"
                        label="级别"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                    </el-table-column>        
                    <el-table-column
                        prop="commentStatusText"
                        label="审核"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="praisePoint"
                        label="获赞"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="评论日期"
                        align="center"
                        min-width="180"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        fixed="right"
                        :min-width="btnShow?340:80"
                        >
                        <template slot-scope="scope"> 
                            <div class="btn-box" v-if="scope.row.commentStatus==2">
                                <el-button size="small" v-if="$authJudge('comment:manage:reply')" @click="replyEvent(scope.row)">回复</el-button>
                                <el-button size="small" v-if="$authJudge('comment:manage:recommend')&&scope.row.isTop==0&&scope.row.commentType==1&&scope.row.warning!=2" @click="recommend(scope.row)">推荐</el-button>
                                <el-button size="small" v-if="$authJudge('comment:manage:essence')&&scope.row.isElite==0&&scope.row.commentType==1&&scope.row.warning!=2" @click="elite(scope.row)">精华</el-button>
                                <el-button size="small" v-if="$authJudge('comment:manage:cancel')&&(scope.row.isTop==1||scope.row.isElite==1)&&scope.row.commentType==1" @click="cancelHandle(scope.row)">取消推荐/精华</el-button>
                                <el-button size="small" v-if="$authJudge('comment:manage:display')&&scope.row.show==1" @click="showEvent(scope.row,'1')">显示</el-button>
                                <el-button size="small" v-if="$authJudge('comment:manage:hide')&&scope.row.show==0" @click="showEvent(scope.row,'0')">隐藏</el-button>
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
        <el-dialog
            title="回复"
            :visible.sync="replyData.visible"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            width="30%"
            custom-class="reply-dialog"
            center
            >
            <div>
                <el-input rows="10" show-word-limit type="textarea" v-model="replyData.content" resize="none" maxlength="500" :placeholder="`@${replyData.atUserName}`"></el-input>
            </div>
            <div class="btns">
                <el-button type="primary" @click="replyData.visible=false">取消</el-button>
                <el-button type="primary" @click="reply">确定</el-button>
            </div>
        </el-dialog>  
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            allCount:'',
            todayCommentCount:'',
            btnShow:false,
            content:'',
            show:'',
            showArr:[
                {label:'全部',value:'-1'},
                {label:'显示',value:'0'},
                {label:'隐藏',value:'1'},
            ],
            recommendStatus:'',
            recommendArr:[
                {label:'全部',value:'-1'},
                {label:'推荐',value:'1'},
                {label:'精华',value:'2'},
            ],
            warning:'',
            warnArr:[
                {label:'全部',value:'-1'},
                {label:'普通',value:'1'},
                {label:'预警',value:'2'},
            ],
            commentStatus:'',
            examineArr:[
                {label:'审核中',value:'1'},
                {label:'通过',value:'2'},
                {label:'拒绝',value:'3'},
                {label:'全部',value:'-1'},
            ],
            report:'',
            reportArr:[
                {label:'全部',value:'2'},
                {label:'举报',value:'1'},
            ],
            commentType:'',
            levelArr:[
                {label:'全部',value:'-1'},
                {label:'评论',value:'1'},
                {label:'回复',value:'2'},
            ],
            start:'',
            end:'',
            pickerOptions1:{
                disabledDate:time=>{
                    return time.getTime() > new Date(this.end).getTime()
                }
            },
            pickerOptions2:{
                disabledDate:time=>{
                    return time.getTime() < new Date(this.start).getTime()
                }
            },
            pageNo:1,
            pageSize:10,
            total:10,
            tableData:[],
            loading:false,
            allChecked:false,
            replyData:{
                visible:false,
                commentId:'',
                content:'',
                coursesId:'',
                courseTitle:'',
                periodId:'',
                atUserId:'',
                atUserName:''
            },
            titleList:[
                {
                    name:'评论管理',
                    pathInfo:''
                },
                {
                    name:'评论管理',
                    pathInfo:''
                }                                               
            ]
        };
    },
    metaInfo: {
        title: "评论管理"
    },
    components: {
        pagination,
        breadcrumb
    },
    watch: {
        pageNo(cur,old){
            if(cur>=1){
                this.getList();
            }
        },
    },
    created() {
        this.commentTotal()
        this.getList()
    },
    methods: {
        commentTotal(){
            let query = {
                params:{}
            }
            this.$http.get(this.$server.commentTotal,query).then(res=>{
                if(res.status==200){
                    this.allCount = res.content.allCount;
                    this.todayCommentCount = res.content.todayCommentCount;
                }
            })
        },
        /**
         * 获取列表数据
         */
        getList(){
            this.loading = true;
            let isElite = '',isTop = '';
            if(this.recommendStatus==''||this.recommendStatus=='0'){
                isElite = isTop = 0
            }else if(this.recommendStatus=='1'){
                isElite = 0, isTop = 1;
            }else if(this.recommendStatus=='2'){
                isElite = 1, isTop = 0;
            }
            let query = {
                params:{
                    content:this.content,
                    show:this.show==''?'-1':this.show,
                    beginAt:this.start,
                    endAt:this.end,
                    isElite:isElite==''?'-1':isElite,
                    isTop:isTop==''?'-1':isTop,
                    warning:this.warning==''?'-1':this.warning,
                    commentStatus:this.commentStatus==''?'-1':this.commentStatus,
                    report:this.report==''?'2':this.report,
                    commentType:this.commentType==''?'-1':this.commentType,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.commentList,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.tableData = res.content.list.map((item,index)=>{
                        item.topText = item.isElite==1||item.isTop==1?(item.isElite?'精华':'推荐'):''
                        item.warnText = this.warnArr.find(option=>option.value==item.warning).label;
                        item.showText = this.showArr.find(option=>option.value==item.show).label;
                        item.commentTypeText = item.commentType?this.levelArr.find(option=>option.value==item.commentType).label:''
                        item.commentStatusText = item.commentStatus?this.examineArr.find(option=>option.value==item.commentStatus).label:'';
                        item.checked = false;
                        if(res.content.pageNum==1){
                            item.sortId = index+1;
                        }else if(res.content.pageNum>1){
                            item.sortId = (res.content.pageNum-1)*10+index+1;
                        }
                        return item;
                    })
                    this.btnShow = this.tableData.some(item=>item.commentStatus==2)
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
         * 全选/取消全选
         */
        allCheck(){
            if(this.allChecked){
                this.tableData.forEach(item=>item.checked = true)
            }else{
                this.tableData.forEach(item=>item.checked = false)
            }
        },
        /**
         * 单行选中/取消选中
         */
        checkStatus(obj){
            if(obj.checked){
                let flag = this.tableData.every(item=>item.checked==true)
                if(flag){
                    this.allChecked = true;
                }
            }else{
                this.allChecked = false;
            }
        },
        /**
         * 审核
         */
        examine(){
            let index = this.tableData.findIndex(item=>item.checked==true)
            if(index<0){
                this.$message.error('请先选中留言内容')
                return false;
            }
            let temp = this.tableData.filter(item=>item.checked==true);
            let ids = temp.map(item=>item.id).join(',')
            this.$confirm('通选中的留言全部通过审核？', '审核确认', {
                closeOnClickModal:false,
                confirmButtonText: '通过审核',
                cancelButtonText: '拒绝发表',
                center:true,
                closeOnPressEscape:false,
                distinguishCancelAndClose:true
            }).then(() => {
                let query = {
                    ids,
                    commentStatus:2
                }
                this.$http.post(this.$server.auditComment,query).then(res=>{
                    if(res.status==200){
                        this.$message.success('审核已通过');
                        this.search();
                    }else{
                        this.$message.error('当前选中的数据已存在审核过的评论，请筛选后重新审核');
                    }
                })
            }).catch((action)=>{
                if(action=='cancel'){
                    let query = {
                        ids,
                        commentStatus:3
                    }
                    this.$http.post(this.$server.auditComment,query).then(res=>{
                        if(res.status==200){
                            this.$message.success('审核已拒绝');
                            this.search();
                        }else{
                            this.$message.error('当前选中的数据已存在审核过的评论，请筛选后重新审核');
                        }
                    })
                }
            })
        },
        /**
         * 显示回复框
         */
        replyEvent(obj){
            this.replyData.commentId = obj.id;
            this.replyData.coursesId = obj.courseId;
            this.replyData.courseTitle = obj.courseTitle
            this.replyData.periodId = obj.periodId
            this.replyData.atUserId = obj.userId;
            this.replyData.content = ''
            this.replyData.atUserName = obj.commentUserName;
            this.replyData.visible = true;
        },
        /**
         * 回复
         */
        reply(){
            if(this.replyData.content==''){
                this.$message.error('请输入评论');
                return;
            }
            let {commentId,content,coursesId,courseTitle,periodId,atUserId} = this.replyData;
            let query = {
                commentId,content,coursesId,courseTitle,periodId,atUserId
            }
            this.$http.post(this.$server.commentReply,query).then(res=>{
                if(res.status==200){
                    this.replyData.visible = false;
                    this.replyData.content = '';
                    this.$message.success('回复成功');
                }
            })
        },
        /**
         * 去举报详情页
         */
        goDetails(obj){
            this.$router.push({
                path:'/complain',
                query:{
                    commentId:obj.id
                }
            })
        },
        /**
         * 推荐
         */
        recommend(obj){
            if(obj.isElite==1){
                this.$message.error('请先取消精华，再设置推荐');
                return;
            }
            let query = {
                commentId:obj.id
            }
            this.$http.post(this.$server.commentTop,query).then(res=>{
                if(res.status==200){
                    this.$message.success('推荐设置成功')
                    this.search()
                }
            })
        },
        /**
         * 设置精华
         */
        elite(obj){
            if(obj.isTop==1){
                this.$message.error('请先取消推荐，再设置精华');
                return;
            }
            let query = {
                commentId:obj.id
            }
            this.$http.post(this.$server.commentElite,query).then(res=>{
                if(res.status==200){
                    this.$message.success('精华设置成功')
                    this.search()
                }
            })
        },
        /**
         * 取消推荐/精华
         */
        cancelHandle(obj){
            let query = {
                commentId:obj.id
            }
            this.$http.post(this.$server.offEliteTop,query).then(res=>{
                if(res.status==200){
                    this.$message.success('设置取消成功')
                    this.search()
                }
            })
        },
        /**
         * 显示/隐藏
         */
        showEvent(obj,flag){
            let query = {
                commentId:obj.id
            }
            let apiUrl = flag=='1'?this.$server.commentShow:this.$server.commentHide
            this.$http.post(apiUrl,query).then(res=>{
                if(res.status==200){
                    if(flag=='1'){
                        this.$message.success('该条评论显示设置成功')
                    }else{
                        this.$message.success('该条评论隐藏设置成功')
                    }
                    this.search()
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
                            this.getList();
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
                            this.getList();
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
<style lang="scss">
    .el-tooltip__popper{
        max-width: 500px;
    }
</style>
<style scoped lang="scss">
    .comment-wrap{
        .top{
            background: #ffc0c3;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 10px;
            font-size: 24px;
            line-height: 40px;
            color:#b4272d;
        }
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
    .reply-dialog{
        min-width: 400px;
        .btns{
            text-align: center;
            margin-top:20px;
        }
        .reply-content{
            height: 200px;
        }
    }
    .course-title{
        position: relative;
        display: inline-block;
        padding: 10px;
        .flag{
            color:#9E0E00;
            font-size: 12px;
            position: absolute;
            top:-1px;
            right: -8px;
            width: 20px;
            text-align: center;
            height: 20px;
            border:1px solid #9E0E00;
            border-radius: 50%;
            transform: scale(0.9)
        }
    }
</style>
<style lang="scss">
    .el-tooltip__popper{
        max-width: 600px;
    }
</style>

