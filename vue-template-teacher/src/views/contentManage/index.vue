<template>
    <div class="page-wrap content-wrap">
        <div class="page-header">
            <el-col  style="marginBottom:10px">
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
            </el-col>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="msgContent"
                    placeholder="输入说说内容、话题或账号"
                    maxlength="20"
                    clearable
                    ></el-input>
                </el-col>
                <el-col :span="3" >
                    <el-select v-model="status"
                        clearable
                        placeholder="推荐状态"
                        >
                        <el-option v-for="(item,i) in statusArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="warningStatus"
                        clearable
                        placeholder="预警"
                        >
                        <el-option v-for="(item,i) in warningStatusArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="reportStatus"
                        clearable
                        placeholder="举报状态"
                        >
                        <el-option v-for="(item,i) in reportStatusArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3" >
                    <el-select v-model="showStatus"
                        clearable
                        placeholder="显示状态"
                        >
                        <el-option v-for="(item,i) in showStatusArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="examineStatus"
                        clearable
                        placeholder="审核"
                        >
                        <el-option v-for="(item,i) in examineStatusArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row style="marginTop:20px">
                <el-col :span="23">
                    <el-date-picker
                        v-model="beginAt"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions1"
                        placeholder="开始时间">
                    </el-date-picker>
                    <span style="margin:0 10px">至</span>
                    <el-date-picker
                        v-model="endAt"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions2"
                        placeholder="结束时间">
                    </el-date-picker>
                    <el-button style="float:right;marginLeft:10px" type="primary" v-if="$authJudge('alumnicircle:classmatesmsg:export')" @click="exportExcel">导出</el-button>
                    <el-button style="float:right" type="primary" v-if="$authJudge('alumnicircle:classmatesmsg:approval')" @click="examineEvent">审核说说</el-button>
                    <el-button style="float:right" type="primary" v-if="$authJudge('alumnicircle:classmatesmsg:select')" @click="search">查询</el-button>
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
                        min-width="100"
                        fixed="left"
                        align="center">
                        <template slot="header" slot-scope="scope">
                            <el-checkbox v-model="allChecked" @change="allCheck"></el-checkbox>
                            <span>序号</span>
                        </template>
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.checked" @change="checkStatus(scope.row)"></el-checkbox>
                            <span style="margin-left:5px">{{scope.row.sortId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="ID"
                        align="center"
                        min-width="100">
                    </el-table-column>                    
                    <el-table-column
                        label="说说"
                        align="center"
                        min-width="400"> 
                        <template slot-scope="scope">
                            <el-tooltip
                                :content='scope.row.msgContent'
                                placement="top-start"
                                effect="dark"
                                popper-class="atooltip"
                                >
                                <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{scope.row.msgContent}}</div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="话题"
                        align="center"
                        min-width="100"
                        >
                        <template slot-scope="scope">
                            <p class="topic" @click="chooseTopic(scope.row.topicName)">{{scope.row.topicName}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="likeNum"
                        label="赞"
                        align="center"
                        min-width="40"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="cellphone"
                        label="账号"
                        align="center"
                        min-width="120"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="nickname"
                        label="昵称"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态"
                        align="center"
                        min-width="80"
                        >
                    </el-table-column>
                    <el-table-column
                        label="附件类型"
                        align="center"
                        min-width="110">
                        <template slot-scope="scope">
                            <p class="type-image">
                                <span>{{scope.row.annexTypeText}}</span>
                                <span v-if="scope.row.annexType==2" class="preview" @click="look(scope.row)">查看</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="warningStatusText"
                        label="预警"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="prohibitedWord"
                        label="触发词"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="举报"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <p style="cursor:pointer;textDecoration:underline" @click="goDetails(scope.row)">{{scope.row.reportNum}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="showStatusText"
                        label="显示"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="examineStatusText"
                        label="审核"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="发布时间"
                        align="center"
                        min-width="180"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        fixed="right"
                        min-width="300"
                        >
                        <template slot-scope="scope">
                            <div class="btn-box" v-if="scope.row.examineStatus==2">
                                <el-button size="small" v-if="(!(scope.row.topStatus==1||scope.row.essenceStatus==1))&&$authJudge('alumnicircle:classmatesmsg:recommend')" @click="handle1(scope.row)">{{scope.row.recommendStatus==1?'取消推荐':'推荐'}}</el-button>
                                <el-button size="small" v-if="!(scope.row.topStatus==1||scope.row.recommendStatus==1)&&$authJudge('alumnicircle:classmatesmsg:essence')" @click="handle2(scope.row)">{{scope.row.essenceStatus==1?'取消精华':'精华'}}</el-button>
                                <el-button size="small" v-if="!(scope.row.recommendStatus==1||scope.row.essenceStatus==1)&&$authJudge('alumnicircle:classmatesmsg:topping')" @click="handle3(scope.row)">{{scope.row.topStatus==1?'取消置顶':'置顶'}}</el-button>
                                <el-button size="small" v-if="$authJudge('alumnicircle:classmatesmsg:show')" @click="handle4(scope.row)">{{scope.row.showStatus==1?'隐藏':'显示'}}</el-button>
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
            title=""
            :visible.sync="visible"
            v-loading="visibleLoading"
            width="30%"
            center>
            <p style="textAlign:center">通选中的说说全部通过审核？</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="examine(1)">通过</el-button>
                <el-button @click="examine(2)">拒绝</el-button>
            </span>
        </el-dialog>
        <PreviewImage v-if="showFlag" :showFlag.sync="showFlag" :srcList="srcList"></PreviewImage>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth';
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import PreviewImage from './previewImage.vue'
export default {
    data() {
        return {
            titleList:[
                {
                    name:'说说管理',
                    pathInfo:''
                },
            ],
            msgContent:'',
            recommendStatus:-1,
            essenceStatus:-1,
            topStatus:-1,
            status:'',
            statusArr:[
                {label:'推荐',value:1},
                {label:'精华',value:2},
                {label:'置顶',value:3},
                {label:'无',value:4},
                {label:'全部',value:-1}
            ],
            warningStatus:'',
            warningStatusArr:[
                {label:'普通',value:1},
                {label:'预警',value:2},
                {label:'全部',value:-1}
            ],
            reportStatus:'',
            reportStatusArr:[
                {label:'未被举报',value:1},
                {label:'被举报',value:2},
                {label:'全部',value:-1}
            ],
            showStatus:'',
            showStatusArr:[
                {label:'显示',value:1},
                {label:'隐藏',value:2},
                {label:'全部',value:-1}
            ],
            examineStatus:'',
            examineStatusArr:[
                {label:'通过',value:2},
                {label:'拒绝',value:3},
                {label:'审核中',value:1},
                {label:'全部',value:-1}
            ],
            beginAt:'',
            endAt:'',
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
            visible:false,
            visibleLoading:false,
            loading:false,
            allChecked:false,
            srcList: [],
            showFlag:false
        };
    },
    components: {
        pagination,
        breadcrumb,
        PreviewImage
    },
    watch: {
        pageNo(cur,old){
            if(cur>=1){
                this.getList();
            }
        },
        status(cur,old){
            if(cur==-1||cur==''){
                this.recommendStatus = -1;
                this.essenceStatus = -1;
                this.topStatus = -1;
            }else if(cur==1){
                this.recommendStatus = 1;
                this.essenceStatus = 2;
                this.topStatus = 2;
            }else if(cur==2){
                this.recommendStatus = 2;
                this.essenceStatus = 1;
                this.topStatus = 2;
            }else if(cur==3){
                this.recommendStatus = 2;
                this.essenceStatus = 2;
                this.topStatus = 1;
            }else{
                this.recommendStatus = 2;
                this.essenceStatus = 2;
                this.topStatus = 2;
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        /**
         * 获取列表数据
         */
        getList(){
            this.loading = true;
            this.allChecked = false;
            let query = {
                params:{
                    msgContent:this.msgContent,
                    topStatus:this.topStatus,
                    essenceStatus:this.essenceStatus,
                    recommendStatus:this.recommendStatus,
                    warningStatus:this.warningStatus==''?-1:this.warningStatus,
                    reportStatus:this.reportStatus==''?-1:this.reportStatus,
                    showStatus:this.showStatus==''?-1:this.showStatus,
                    examineStatus:this.examineStatus==''?-1:this.examineStatus,
                    beginAt:this.beginAt,
                    endAt:this.endAt,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.getClassmatesMsgList,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.tableData = res.content.list.map((item,index)=>{
                        item.checked = false;
                        item.sortId = res.content.pageNum==1?index+1:(res.content.pageNum-1)*10+index+1;
                        let status='';
                        if(item.topStatus==1){
                            status = '置顶';
                        }else if(item.essenceStatus==1){
                            status = '精华';
                        }else if(item.recommendStatus==1){
                            status = '推荐'
                        }
                        item.status = status;
                        let temp = ['','课程','图片','小知识']
                        item.annexTypeText = item.annexType?temp[item.annexType]:''
                        item.warningStatusText = item.warningStatus==1?'普通':'预警';
                        item.showStatusText = item.showStatus==1?'显示':'隐藏';
                        item.examineStatusText = item.examineStatus==1?'审核中':item.examineStatus==2?'通过':'拒绝';
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
         * 选中说说话题
         */
        chooseTopic(name){
            this.msgContent = name;
            this.pageNo = 0;
            this.$nextTick(()=>{
                this.pageNo = 1;
            })
        },
        look(obj){
            if(this.showFlag) return;
            this.srcList = obj.pictureUrl.split(',')
            this.$nextTick(()=>{
                this.showFlag = true;
            })
        },
        /**
         * 推荐/取消推荐
         */
        handle1(obj){
            let query = {
                id:obj.id
            }
            this.$http.post(this.$server.recommendClassmatesMsg,query).then(res=>{
                if(res.status==200){
                    if(obj.recommendStatus==1){
                        this.$message.success('推荐取消成功');
                    }else{
                        this.$message.success('推荐设置成功');
                    }
                    this.pageNo = 0;
                    this.$nextTick(()=>{
                        this.pageNo = 1;
                    })
                }
            })
        },
        /**
         * 精华/取消精华
         */
        handle2(obj){
            let query = {
                id:obj.id
            }
            this.$http.post(this.$server.essenceClassmatesMsg,query).then(res=>{
                if(res.status==200){
                    if(obj.essenceStatus==1){
                        this.$message.success('精华取消成功');
                    }else{
                        this.$message.success('精华设置成功');
                    }
                    this.pageNo = 0;
                    this.$nextTick(()=>{
                        this.pageNo = 1;
                    })
                }
            })
        },
        /**
         * 置顶/取消置顶
         */
        handle3(obj){
            let query = {
                id:obj.id
            }
            this.$http.post(this.$server.toppingClassmatesMsg,query).then(res=>{
                if(res.status==200){
                    if(obj.topStatus==1){
                        this.$message.success('置顶取消成功');
                    }else{
                        this.$message.success('置顶设置成功');
                    }
                    this.pageNo = 0;
                    this.$nextTick(()=>{
                        this.pageNo = 1;
                    })
                }
            })
        },
        /**
         * 显示/隐藏
         */
        handle4(obj){
            let query = {
                id:obj.id
            }
            this.$http.post(this.$server.showClassmatesMsg,query).then(res=>{
                if(res.status==200){
                    if(obj.showStatus==1){
                        this.$message.success('隐藏设置成功');
                    }else{
                        this.$message.success('隐藏取消成功');
                    }
                    this.pageNo = 0;
                    this.$nextTick(()=>{
                        this.pageNo = 1;
                    })
                }
            })
        },
        examineEvent(){
            let index = this.tableData.findIndex(item=>item.checked==true)
            if(index<0){
                this.$message.error('请先选中说说')
                return false;
            }
            this.visible = true;
        },
        /**
         * 审核
         */
        examine(type){
            let temp = this.tableData.filter(item=>item.checked==true);
            let index = temp.findIndex(item=>item.examineStatus>1)
            if(index>=0){
                this.$message.error('其中包含已经审核过的说说');
                return;
            }
            this.visibleLoading = true;
            let ids = temp.map(item=>item.id).join(',')
            let query = {
                'ids[]':ids,
                'type':type
            }
            this.$http.post(this.$server.approvalClassmatesMsg,query).then(res=>{
                if(res.status==200){
                    this.$message.success('说说审核成功');
                    this.pageNo = 0;
                    this.$nextTick(()=>{
                        this.pageNo = 1;
                    })
                }
            }).finally(()=>{
                this.visible = false;
                this.visibleLoading = false;
            })
        },
        /**
         * 去举报详情页
         */
        goDetails(obj){
            this.$router.push({
                path:'/alumniCircle/reportDetails',
                query:{
                    id:obj.id
                }
            })
        },
        /**
         * 导出
         */
        exportExcel(){
            let query = {
                msgContent:this.msgContent,
                topStatus:this.topStatus,
                essenceStatus:this.essenceStatus,
                recommendStatus:this.recommendStatus,
                warningStatus:this.warningStatus==''?-1:this.warningStatus,
                reportStatus:this.reportStatus==''?-1:this.reportStatus,
                showStatus:this.showStatus==''?-1:this.showStatus,
                examineStatus:this.examineStatus==''?-1:this.examineStatus,
                beginAt:this.beginAt,
                endAt:this.endAt,
            }
            let params = Object.keys(query).map((key)=>{
                return encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
            }).join("&");
            let url = this.$server.exportClassmatesMsgList+"?token="+getToken()+'&'+params
            window.open(url);
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
        .topic{
            text-decoration: underline;
            cursor: pointer;
        }
        .table-data-comment{
            white-space: pre-line!important;
            word-break: break-word;
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
</style>

