<template>
    <div>
        <div class="page-header">
            <el-row>
                <el-col :span="4">
                    <h3 class="page-title">学友圈评论管理</h3>
                </el-col>             
            </el-row>
            <el-row :gutter="4">
                <el-col :span="7">
                    <div class="keyword">
                        <el-input v-model="commentContent"
                            placeholder="输入评论内容，话题或账号"
                            maxlength="20"
                            clearable
                            ></el-input>
                    </div>
                </el-col>                     
                <el-col :span="4">
                    <el-select v-model="warningStatus"
                        clearable
                        placeholder="预警方式"
                        >
                        <el-option v-for="(item,i) in statusArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>                    
                </el-col>
                <el-col :span="4">
                    <el-select v-model="reportStatus"
                        clearable
                        placeholder="举报状态"
                        >
                        <el-option v-for="(item,i) in typeArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>                    
                </el-col>
                <el-col :span="4">
                    <el-select v-model="showStatus"
                        clearable
                        placeholder="显示状态"
                        >
                        <el-option v-for="(item,i) in topArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>                    
                </el-col>  
                <el-col :span="4">
                    <el-select v-model="examineStatus"
                        clearable
                        placeholder="审核状态"
                        >
                        <el-option v-for="(item,i) in toExamine"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>                    
                </el-col>     
                <el-col :span="12">
                    <div class="dataTimeBox" style="margin-top:10px;">
                        <el-date-picker
                        v-model="beginAt"
                        type="datetime"
                        placeholder="开始时间">
                        </el-date-picker>
                        至
                        <el-date-picker 
                        v-model="endAt"
                        type="datetime"
                        placeholder="结束时间">
                        </el-date-picker>                    
                    </div>          
                </el-col>                             
               <el-col :span="2" :offset="6" class="textAlign"><el-button v-if="$authJudge('alumnicircle:classmatesmsgcomment:select')" type="primary" @click="search">查询</el-button></el-col>
               <el-col :span="2" class="textAlign"><el-button v-if="$authJudge('alumnicircle:classmatesmsgcomment:approval')" type="primary" @click="examineEven()">审核评论</el-button></el-col>
               <el-col :span="2" class="textAlign"><el-button v-if="$authJudge('alumnicircle:classmatesmsgcomment:export')" type="primary" @click="headExport">导出</el-button></el-col>
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
                        label="序号"
                        align="center"
                        fixed="left"
                        min-width="100">
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
                        label="评论"
                        min-width="150"
                        align="center"
                        >
                        <template slot-scope="scope">
                            <el-tooltip
                                v-if="scope.row.isVoice!=1"
                                :content='scope.row.commentContent'
                                placement="top-start"
                                effect="dark"
                                popper-class="atooltip"
                                >
                                <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{scope.row.commentContent}}</div>
                            </el-tooltip>                          
                            <div v-else>
                                <el-button type="primary" class="button-fk" @click="ispalyEven(scope.$index,!audioPlayBool,scope.row.voiceUrl)" :icon="audioPlayIndex==scope.$index?'el-icon-microphone':'el-icon-turn-off-microphone'">{{audioPlayIndex==scope.$index?'暂停':'播放'}}</el-button>
                            </div>
                        </template>                        
                    </el-table-column>  
                    <el-table-column
                        prop="topicName"
                        label="话题"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip>
                    </el-table-column>    
                    <el-table-column
                        label="所属说说"
                        align="center"
                        min-width="120"
                        > 
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
                        prop="likeNum"
                        label="赞"
                        align="center"
                        width="60"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="cellphone"
                        label="账号"
                        align="center"
                        width="150"
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
                        label="预警"
                        align="center"
                        min-width="60"
                        >
                            <template slot-scope="scope"> 
                                {{scope.row.warningStatus==1?'普通':'预警' }}                                             
                            </template>                         
                    </el-table-column>      
                    <el-table-column
                        prop="prohibitedWord"
                        label="触发词"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip
                        >
                    </el-table-column>        
                    <el-table-column
                        label="举报"
                        align="center"
                        min-width="60"
                        >
                            <template slot-scope="scope"> 
                                <router-link class="clearfix"
                                        :to="{path:'/alumniCircle/reportDetails',query:{id:scope.row.id,type:'comment'}}">                                
                                        <div style="cursor:pointer;textDecoration:underline">{{scope.row.reportNum}}</div>
                                </router-link>                                                   
                            </template>                         
                        
                    </el-table-column>            
                    <el-table-column
                        label="显示"
                        align="center"
                        min-width="60"
                        >
                            <template slot-scope="scope"> 
                                {{scope.row.showStatus==1?'显示':'隐藏' }}                                             
                            </template>                        
                    </el-table-column>     
                    <el-table-column
                        label="审核"
                        align="center"
                        min-width="100"
                        >
                            <template slot-scope="scope">       
                                <span v-if="scope.row.examineStatus==1">审核中</span> 
                                <span v-if="scope.row.examineStatus==2">通过</span>
                                <span v-if="scope.row.examineStatus==3">拒绝</span>                                     
                            </template>                        
                    </el-table-column>                                                                                        
                    <el-table-column
                        prop="createdAt"
                        label="发布时间"
                        align="center"
                        width="160"
                        >
                    </el-table-column>                                      
                    <el-table-column
                        label="操作"
                        align="center"
                        fixed="right"
                        min-width="80"
                        >
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('alumnicircle:classmatesmsgcomment:show')"  @click="topOrCancel(scope.row)">{{scope.row.showStatus==1?'隐藏':'显示'}}</el-button>
                                </div>                                              
                            </template>                    
                    </el-table-column>                                                
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>                    
                </div>     
            </div>
        </div>     
        <audio :src="urlSrc"  preload id="audioMusic" @ended="ended()" hidden></audio>  
        <!-- <audio :src="urlSrc"  preload id="audioMusic" @ended="ended()" controls='controls'></audio>     -->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="25%"
            center
            >
            <div style="text-align: center;">审核评论</div>
            <span slot="footer" class="dialog-footer">  
                <el-button @click="isOkExamine(false)">拒绝</el-button>
                <el-button type="primary" @click="isOkExamine(true)">通过</el-button>
            </span>
        </el-dialog>        
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {    
    data() {   
        return {
            commentContent:'',
            warningStatus:'',
            statusArr:[
                {label:'全部',value:-1},
                {label:'普通',value:1},
                {label:'预警',value:2}               
            ],
            examineStatus:'',
            toExamine:[
                {label:'全部',value:-1},
                {label:'通过',value:2},
                {label:'审核中',value:1},
                {label:'拒绝',value:3}
                              
            ],
            reportStatus:'',
            typeArr:[
                {label:'全部',value:-1},
                {label:'举报',value:2},
                {label:'未举报',value:1}
                ],
            showStatus:'',
            topArr:[
                {label:'全部',value:-1},
                {label:'显示',value:1},
                {label:'隐藏',value:2}
                ],
            count:0,
            pageNo:1,
            pageSize:10,
            total:1,
            tableData:[],
            loading:false,
            beginAt:'',
            endAt:'',
            id:'',
            value1:[],
            dialogVisible:false,
            allChecked:false,
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            },
            audioPlayIndex:-1,//点击下标；
            audioPlayBool:false,//当前播放状态;
            urlSrc:''

        };
    },
    components: {
        pagination
    },
    watch: {
        beginAt: function(curVal,oldVal){
            var self = this;
            if(Number(self.endAt)<Number(curVal)){
                self.endAt = null;
            }
        }, 
        endAt: function(curVal,oldVal){
            var self = this;
            if(Number(self.beginAt)>Number(curVal)){
                self.endAt = null;
            }
        }               
    },
    created() {
        this.getList()
    },
    methods: {
        ended(){
            this.urlSrc = '';
            this.audioPlayIndex = -1;
            this.audioPlayBool = false;
        },
        ispalyEven(index,bool,urls){
            var newType = false;
            if(this.urlSrc!=urls){
                this.urlSrc = urls;
                newType = true;
            }else{
                if(bool){
                    newType = true;
                }else{
                    newType = false;
                }
            }        
            setTimeout(()=>{
                var audito = document.querySelector("#audioMusic");
                if(newType){
                    this.audioPlayIndex = index;
                    audito.play();
                    this.audioPlayBool = true;
                }else{
                    this.audioPlayIndex = -1;
                    audito.pause();
                    this.audioPlayBool = false;
                }
            },200);  
        },        
        isOkExamine(type){
            let temp = this.tableData.filter(item=>item.checked==true);
            let ids = temp.map(item=>item.id).join(',')            
            if(type){
                let query = {
                    ids,
                    type:1
                }
                this.$http.post(this.$server.getApprovalClassmatesMsgComment,query).then(res=>{
                    if(res.status==200){
                        this.$message.success('审核已通过');
                        this.search();
                    }else{
                        this.$message.error('当前选中的数据已存在审核过的评论，请筛选后重新审核');
                    }
                    this.dialogVisible = false;
                })                
            }else{
                    let query = {
                        ids,
                        type:2
                    }
                    this.$http.post(this.$server.getApprovalClassmatesMsgComment,query).then(res=>{
                        if(res.status==200){
                            this.$message.success('审核已拒绝');
                            this.search();
                        }else{
                            this.$message.error('当前选中的数据已存在审核过的评论，请筛选后重新审核');
                        }
                        this.dialogVisible = false;
                    })
            }
        },
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
        allCheck(){
            if(this.allChecked){
                this.tableData.forEach(item=>item.checked = true);
            }else{
                this.tableData.forEach(item=>item.checked = false)
            }            
        },
        //导出
        headExport(){
                var self = this;
                var parems = {
                    token:getToken(),
                    commentContent:self.commentContent,
                    warningStatus:self.warningStatus,
                    reportStatus:self.reportStatus,
                    showStatus:self.showStatus,
                    examineStatus:self.examineStatus,
                    beginAt:self.formatDate(self.beginAt),
                    endAt:self.formatDate(self.endAt)
                };
                self.download2(self.$server.getExportClassmatesMsgCommentList(parems)); 
        },        
        //导出
        download2(url) {
            try{ 
                    var elemIF = document.createElement("iframe");   
                    elemIF.src = url;   
                    elemIF.style.display = "none";   
                    document.body.appendChild(elemIF);   
                }catch(e){ 
                    zzrw.alert("下载异常！");
                }
        },   
        examineEven(value){
            var bools = false;
            this.tableData.forEach(element=>{
                if(element.checked){
                    bools = true;
                }
            });
            if(bools){
                this.dialogVisible = bools;
            }else{
                this.$message.error('请先选中评论');
            }
        },       
        formatDate(date,type){
            if(date){
                // 86399000
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                var h=date.getHours();
                var m1=date.getMinutes();
                var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;
                h = h<10?("0"+h):h;
                m1 = m1<10?("0"+m1):m1;
                s = s<10?("0"+s):s;
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
            }else{
                return '';
            }
        },
        /**
         * 获取列表数据
         */
        getList(num){
            /*
                topicName 话题、话题描述、创建者
                status 状态（1：上线，2：下线，3：审批中，4：拒绝）
                topStatus 置顶状态（1：置顶，2：非置顶）
                presetStatus 预置状态（1：预置，2：非预置）
                pageNo 页数
                pageSize 页面条数
            */        
            var self = this;    
            this.loading = true;
            if(num){
                self.pageNo = num;
            }
            let query = {
                params:{
                    commentContent:this.commentContent,//评论内容话题账号
                    warningStatus:(!this.warningStatus||this.warningStatus==-1)?'':this.warningStatus,//预警状态（1：普通，2：预警）
                    reportStatus:(!this.reportStatus||this.reportStatus==-1)?'':this.reportStatus,//举报状态（1：未被举报，2：被举报）
                    showStatus:(!this.showStatus||this.showStatus==-1)?'':this.showStatus,//显示状态（1：显示，2：隐藏）
                    examineStatus:(!this.examineStatus||this.examineStatus==-1)?'':this.examineStatus,//审核状态（1：审核中，2：通过，3：拒绝）
                    beginAt:this.formatDate(self.beginAt),//开始时间
                    endAt:this.formatDate(self.endAt),//结束时间
                    pageNo:this.pageNo,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(this.$server.getClassmatesMsgCommentList,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    var contentdate = res.content;
                    var listIds = [];
                    listIds = contentdate.list.map(function(element,index){
                        if(contentdate.pageNum==1){
                            element.sortId = index+1;
                            element.checked = false;
                            return element;
                        }else if(contentdate.pageNum>1){
                            element.sortId = (contentdate.pageNum-1)*10+index+1;
                            element.checked = false;
                            return element;
                        }
                    });                    
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage =self.pageNo;
                    self.allChecked = false;
                    self.$nextTick(function(){
                        self.loadingOne = false; 
                    }) 
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        /**
         * 查询
         */
        search(){
            this.getList(1);
        },
        childPageValue(num){
            if(Number(num)>0){
               this.getList(Number(num));
            }            
        },        
        /**
         * 显示/不显示
         */
        topOrCancel(obj){
            let query = {
                id:obj.id
            };
            if(obj.showStatus==1){
                this.$http.post(this.$server.getShowClassmatesMsgComment,query).then(res=>{
                    if(res.status==200){
                        this.$message.success('隐藏');
                        this.getList();
                    }
                })
            }else{
                this.$http.post(this.$server.getShowClassmatesMsgComment,query).then(res=>{
                    if(res.status==200){
                        this.$message.success('显示');
                        this.getList();
                    }
                })
            }
        }
    }
};
</script>

<style scoped lang="scss">
    .textAlign{
        text-align: right;
        margin-top: 10px;
    }
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
        .handle-btn{
            margin:0!important;
            min-width: 50px;
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
</style>
<style>
.el-tooltip__popper{max-width:200px;text-align: center;}
.button-fk i{
    font-size: 18px;
}
</style>

