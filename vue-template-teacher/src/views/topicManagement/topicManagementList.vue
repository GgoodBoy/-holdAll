<template>
    <div>
        <div class="page-header">
            <el-row>
                <el-col :span="4">
                    <h3 class="page-title">话题管理</h3>
                </el-col>             
            </el-row>
            <el-row :gutter="3">
                <el-col :span="5">
                    <div class="keyword">
                        <el-input v-model="name"
                            placeholder="话题名称，描述或者创建者"
                            maxlength="20"
                            clearable
                            ></el-input>
                    </div>
                </el-col>                     
                <el-col :span="3">
                    <el-select v-model="status"
                        clearable
                        placeholder="状态"
                        >
                        <el-option v-for="(item,i) in statusArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>                    
                </el-col>
                <el-col :span="3">
                    <el-select v-model="upStatus"
                        clearable
                        placeholder="置顶"
                        >
                        <el-option v-for="(item,i) in typeArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>                    
                </el-col>
                <el-col :span="3">
                    <el-select v-model="topArrStatus"
                        clearable
                        placeholder="预置"
                        >
                        <el-option v-for="(item,i) in topArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>                    
                </el-col>      
               <el-col :span="2" class="textAlign"><el-button v-if="$authJudge('alumnicircle:topic:select')" type="primary" @click="search">查询</el-button></el-col>
               <el-col :span="2" :offset="4" class="textAlign"><el-button v-if="$authJudge('alumnicircle:topic:add')" type="primary" @click="bottonEven('','add')" >添加话题</el-button></el-col>
               <el-col :span="2" class="textAlign"><el-button v-if="$authJudge('alumnicircle:topic:export')" type="primary" @click="headExport">导出</el-button></el-col>
            </el-row>     
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    :data="tableData"
                    border
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="60"
                        :show-overflow-tooltip="true">
                    </el-table-column>                    
                    <el-table-column
                        prop="topicName"
                        label="话题"
                        min-width="120"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        label="话题描述"
                        align="center"
                        min-width="200">
                        <template slot-scope="scope">
                            <el-tooltip
                                :content='scope.row.topicDesc'
                                placement="top-start"
                                effect="dark"
                                popper-class="atooltip"
                                >
                                <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{scope.row.topicDesc}}</div>
                            </el-tooltip>     
                        </template>
                    </el-table-column>    
                    <el-table-column
                        prop="createdAt"
                        label="发布时间"
                        align="center"
                        min-width="160"
                        > 
                    </el-table-column>                    
                    <el-table-column
                        label="状态"
                        align="center"
                        width="80"
                        >
                        <template slot-scope="scope">
                            <span v-if="scope.row.status==1">上线</span>
                            <span v-else-if="scope.row.status==2">下线</span>
                            <span v-else-if="scope.row.status==3">审批中</span>
                            <span v-else>拒绝</span>
                        </template>                        
                    </el-table-column> 
                    <el-table-column
                        prop="playCount"
                        label="预置"
                        align="center"
                        min-width="60"
                        >
                        <template slot-scope="scope">
                            <span v-if="scope.row.presetStatus==1">是</span>
                            <span v-else>否</span>
                        </template>                        
                    </el-table-column>
                    <el-table-column
                        label="置顶"
                        align="center"
                        min-width="60"
                        >
                        <template slot-scope="scope">
                            <span v-if="scope.row.topStatus==1">是</span>
                            <span v-else>否</span>
                        </template>                        
                    </el-table-column>      
                    <el-table-column
                        prop="presetPartakeNum"
                        label="参与人数"
                        align="center"
                        min-width="60"
                        >
                    </el-table-column>        
                    <el-table-column
                        prop="presetFollowNum"
                        label="关注"
                        align="center"
                        min-width="60"
                        >
                    </el-table-column>            
                    <el-table-column
                        prop="likeNum"
                        label="赞"
                        align="center"
                        min-width="60"
                        >
                    </el-table-column>     
                    <el-table-column
                        prop="creatorName"
                        label="创建者"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>                                        
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="200"
                        >
                        <template slot-scope="scope"> 
                            <div class="btn-box">
                                <el-button type="text" size="small" class="handle-btn" v-if="scope.row.status==3&&$authJudge('alumnicircle:topic:approval')" @click="bottonEven(scope.row,'isKo')">审批</el-button>
                                <el-button type="text" size="small" class="handle-btn" v-if="scope.row.status==3&&$authJudge('alumnicircle:topic:preset')"  @click="bottonEven(scope.row,'presetStatus')" >
                                    {{scope.row.presetStatus==1?'取消预置':'预置'}}
                                </el-button>
                                <el-button type="text" v-if="(scope.row.status==1||scope.row.status==2)&&$authJudge('alumnicircle:topic:up')" size="small" class="handle-btn" @click="bottonEven(scope.row,'status')">
                                    <span v-if="scope.row.status==1">下线</span>
                                    <span v-if="scope.row.status==2">上线</span>
                                </el-button>
                                <el-button type="text" size="small" class="handle-btn" v-if="scope.row.status==1&&$authJudge('alumnicircle:topic:topping')" @click="bottonEven(scope.row,'topStatus')" >
                                    {{scope.row.topStatus==1?'取消置顶':'置顶'}}
                                </el-button>                                    
                                <el-button type="text" size="small" class="handle-btn" v-if="(scope.row.status==2||scope.row.status==3)&&$authJudge('alumnicircle:topic:update')" @click="bottonEven(scope.row,'edit')">编辑</el-button>
                                <el-button type="text" size="small" class="handle-btn" v-if="scope.row.status!=1&&$authJudge('alumnicircle:topic:delete')" @click="bottonEven(scope.row,'delete')">删除</el-button>
                            </div>                                              
                        </template>                    
                    </el-table-column>                                                
                </el-table>
                <div class="block">
                    <!-- <el-pagination
                        layout="prev, pager, next"
                        :current-page.sync="pageNo"
                        :page-size="pageSize"
                        :total="total"
                    >
                    </el-pagination> -->
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
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            center
            >
            <div style="text-align: center;">
                {{selectType=='delete'?'确定删除当前话题吗？':'确定审批通过当前话题吗？'}}
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="getApprovalTopic(false)">{{selectType=='delete'?'取 消':'拒 绝'}}</el-button>
                <el-button type="primary" @click="getApprovalTopic(true)">{{selectType=='delete'?'确 定':'通 过'}}</el-button>
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
            name:'',
            status:'',
            statusArr:[
                {label:'全部',value:-1},
                {label:'上线',value:1},
                {label:'下线',value:2},                
                {label:'审批中',value:3},
                {label:'拒绝',value:4}                
            ],
            type:'',
            typeArr:[
                {label:'全部',value:-1},
                {label:'置顶',value:1},
                {label:'非置顶',value:2},
                ],
            upStatus:'',
            topArrStatus:'',
            topArr:[{label:'全部',value:-1},{label:'预置',value:1},{label:'非预置',value:2}],
            count:0,
            pageNo:1,
            pageSize:10,
            total:1,
            tableData:[],
            loading:false,
            id:'',
            selectData:'',
            dialogVisible:false,
            selectType:'',
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            }              
        };
    },
    components: {
        pagination
    },
    watch: {              
    },
    created() {
        this.getList()
    },
    methods: {
        //导出
        headExport(){
                let parems = {
                    token:getToken(),
                    topicName:this.name,
                    status:this.status==-1?'':this.status,
                    topStatus:this.upStatus==-1?'':this.upStatus,
                    presetStatus:this.topArrStatus==-1?'':this.topArrStatus
                };
                this.download2(this.$server.getTopicListExportTopic(parems)); 
        },        
        //导出
        download2(url) {
            try{ 
                    let elemIF = document.createElement("iframe");   
                    elemIF.src = url;   
                    elemIF.style.display = "none";   
                    document.body.appendChild(elemIF);   
                }catch(e){ 
                    zzrw.alert("下载异常！");
                }
        }, 
        bottonEven(data,type){
            this.selectData = data;
            this.selectType = type;
            switch (type) {
                case 'isKo':
                case 'delete':
                    this.dialogVisible = true;
                    break;
                case 'presetStatus':
                    this.getPresetStatus();
                    break;
                case 'status':
                    this.getUpTopicEven(data);
                    break;
                case 'edit':
                    this.$router.push({path:'/alumniCircle/topicManage/addTopic', query: {id: data.id}});
                    break;
                case 'topStatus':
                this.getTopStatus();
                    break;                     
                case 'add':
                     this.$router.push('/alumniCircle/topicManage/addTopic');
                    break;            
                default:
                    break;
            }
        },   
        getPresetStatus(){  
            let query = {};
            let messages ='';
            query = {
                id:this.selectData.id
            }
            messages = this.selectData.presetStatus==1?'取消预置':'预置成功';
            this.$http.post(this.$server.getPresetTopicTopic,query).then(res=>{
                if(res.status==200){
                    this.$message.success(messages);
                    this.getList();
                }
            })             
        },
        getTopStatus(){   
            let query = {};
            let messages ='';
            query = {
                id:this.selectData.id
            };
            messages = this.selectData.presetStatus==1?'取消置顶':'置顶成功';
            this.$http.post(this.$server.getToppingTopicTopic,query).then(res=>{
                if(res.status==200){
                    this.$message.success(messages);
                    this.getList();
                }
            })               
        },
        getApprovalTopic(type){  
            let query = {};
            let urls = '';
            let messages ='';
            if(this.selectType=='isKo'){
                query = {
                    id:this.selectData.id,
                    type:type?1:2
                }
                urls = this.$server.getApprovalTopicTopic;
                messages = type?'审批成功':'已拒绝';
                this.$http.post(urls,query).then(res=>{
                    if(res.status==200){
                        this.dialogVisible = false;
                        this.$message.success(messages);
                        this.getList();
                    }
                })                 
            }else{
                query = {
                    id:this.selectData.id
                }   
                urls =  this.$server.getDeleteTopicTopic    
                messages = '已删除'; 
                if(type){
                    this.$http.post(urls,query).then(res=>{
                        if(res.status==200){
                            this.dialogVisible = false;
                            this.$message.success(messages);
                            this.getList();
                        }
                    })                     
                }else{
                    this.dialogVisible = false;
                }     
            }            
        },  
        getUpTopicEven(data){   
            let query = {
                id:data.id
            }
            let messages = data.status==1?'已下线':'已上线';
            this.$http.post(this.$server.getUpTopicTopic,query).then(res=>{
                if(res.status==200){
                    this.$message.success(messages);
                    this.getList();
                }
            })            
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
           var self=this;  
            this.loading = true;
            if(num){
                this.pageNo = num;
            }
            let query = {
                params:{
                    topicName:this.name,
                    status:(!this.status||this.status==-1)?'':this.status,
                    topStatus:(!this.upStatus||this.upStatus==-1)?'':this.upStatus,
                    presetStatus:(!this.topArrStatus||this.topArrStatus==-1)?'':this.topArrStatus,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(this.$server.getTopicListTopic,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    let contentdate = res.content;
                    let listIds = [];
                    listIds = contentdate.list.map(function(element,index){
                        if(contentdate.pageNum==1){
                            element.sortId = index+1;
                            return element;
                        }else if(contentdate.pageNum>1){
                            element.sortId = (contentdate.pageNum-1)*10+index+1;
                            return element;
                        }
                    });                    
                    this.tableData = listIds;
                    this.pageAtion.pageTotal = contentdate.total;
                    this.pageAtion.paginationPage =this.pageNo;
                    this.$nextTick(()=>{
                        this.loadingOne = false; 
                    }) 
                }
            }).catch(()=>{
                self.loading = false;
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
        }        
    }
};
</script>

<style scoped lang="scss">
    .textAlign{
        text-align: right;
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
    /* .el-tooltip__popper{max-width:1200px;text-align: center;} */
    .atooltip{
        max-width: 1500px;
    }
</style>

