<template>
    <div class="short-video-wrap">
        <div class="page-header">
            <el-row>
                <el-col :span="4">
                    <h3 class="page-title">短视频系统</h3>
                </el-col>
                <el-col :span="3" :offset="15"><p class="top-number">置顶数量{{count}}条</p></el-col>
                <el-col :span="2" class="textAlign"><el-button v-if="$authJudge('shortvideo:add')" type="text" @click="$router.push('/shortVideo/update')">发布新短视频</el-button></el-col>                
            </el-row>
            <el-row :gutter="3">
                <el-col :span="3">
                    <div class="keyword">
                    <el-input v-model="name"
                        placeholder="短视频或关联课程名称"
                        maxlength="20"
                        clearable
                        ></el-input>
                    </div>
                </el-col>                     
                <el-col :span="2">
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
                <el-col :span="2">
                    <el-select v-model="type"
                        clearable
                        placeholder="类型"
                        >
                        <el-option v-for="(item,i) in typeArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>                    
                </el-col>
                <el-col :span="3">
                    <el-select v-model="upStatus"
                        clearable
                        placeholder="置顶状态"
                        >
                        <el-option v-for="(item,i) in topArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>                    
                </el-col>
                <el-col :span="12">
                    <div class="dataTimeBox">
                    <el-date-picker
                    v-model="dateValueOne"
                    type="date"
                    placeholder="开始时间">
                    </el-date-picker>
                    至
                    <el-date-picker
                    v-model="dateValueTwo"
                    type="date"
                    placeholder="结束时间">
                    </el-date-picker>                    
                    </div>          
                </el-col>
               <el-col :span="2" class="textAlign"><el-button v-if="$authJudge('shortvideo:select')" type="primary" @click="search">查询</el-button></el-col>
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
                        prop="order"
                        label="序号"
                        align="center"
                        min-width="40"
                        :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="短视频名称"
                        min-width="150"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="courseName"
                        label="关联课程"
                        align="center"
                        min-width="150"
                        :show-overflow-tooltip="true">
                    </el-table-column>     
                    <el-table-column
                        prop="statusText"
                        label="状态"
                        align="center"
                        width="80"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="typeText"
                        label="类型"
                        align="center"
                        width="80"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="playCount"
                        label="总播放量"
                        align="center"
                        min-width="60"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="发布时间"
                        align="center"
                        min-width="120"
                        > 
                    </el-table-column>  
                    <el-table-column
                        prop="playCount1"
                        label="真实播放量"
                        align="center"
                        width="100"
                        >
                    </el-table-column>                                      
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="140"
                        >
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('shortvideo:nottop')" @click="topOrCancel(scope.row)" v-show="scope.row.status==2&&scope.row.upStatus==1">取消置顶</el-button>
                                    <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('shortvideo:top')" @click="topOrCancel(scope.row)" v-show="scope.row.status==2&&scope.row.upStatus==2">置顶</el-button>
                                    <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('shortvideo:down')" v-show="scope.row.status==2" @click="upOrDown(scope.row)">下架</el-button>
                                    <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('shortvideo:up')" v-show="scope.row.status==1" @click="upOrDown(scope.row)">上架</el-button>
                                    <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('shortvideo:edit')" v-show="scope.row.status==1" @click="edit(scope.row)">编辑</el-button>
                                    <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('shortvideo:browse')" @click="dialogShow(scope.row)">追加播放量</el-button>
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
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :width="'350px'"
            :top="'30vh'"
            v-loading="dialogLoading"
            center>
            <div>
                <label>追加数量</label>
                <el-input style="width:200px;margin-left:10px" maxlength="8" v-model="num" placeholder="1-10000000"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addPlayCount">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import pagination from "@/components/pagination";
export default {    
    data() {   
        return {
            name:'',
            status:'',
            statusArr:[{label:'全部',value:-1},{label:'已下架',value:1},{label:'已上架',value:2}],
            type:'',
            typeArr:[{label:'全部',value:-1},{label:'成人',value:1},{label:'少儿',value:2}],
            upStatus:'',
            topArr:[{label:'全部',value:-1},{label:'置顶',value:1},{label:'非置顶',value:2}],
            count:0,
            pageNo:1,
            pageSize:10,
            total:1,
            tableData:[],
            loading:false,
            dateValueOne:'',
            dateValueTwo:'',
            dialogVisible:false,
            dialogLoading:false,
            num:'',
            id:''
        };
    },
    metaInfo: {
        title: "短视频管理"
    },
    components: {
        pagination
    },
    watch: {
        pageNo(cur,old){
            if(cur>=1){
                this.getList()
            }
        },
        dateValueOne: function(curVal,oldVal){
            var self = this;
            if(Number(self.dateValueTwo)<Number(curVal)){
                self.dateValueTwo = null;
            }
        }, 
        dateValueTwo: function(curVal,oldVal){
            var self = this;
            if(Number(self.dateValueOne)>Number(curVal)){
                self.dateValueTwo = null;
            }
        }               
    },
    created() {
        this.getList()
    },
    methods: {
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
                if(type=="start"){
                    h = h<10?("0"+h):h;
                    m1 = m1<10?("0"+m1):m1;
                    s = s<10?("0"+s):s;
                }else{
                    h = 23;
                    m1 = 59;
                    s = 59;
                }                
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
            }else{
                return '';
            }
        },
        /**
         * 获取列表数据
         */
        getList(){
            var self = this;
            this.loading = true;
            let query = {
                params:{
                    name:this.name,
                    status:this.status==''?-1:this.status,
                    type:this.type==''?-1:this.type,
                    upStatus:this.upStatus==''?-1:this.upStatus,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    startTime:this.formatDate(this.dateValueOne,'start'),
                    endTime:this.dateValueTwo?this.formatDate(this.dateValueTwo,'end'):''
                }
            }
            this.$http.get(this.$server.getShortVideoList,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.total = res.content.total;
                    this.tableData = res.content.list;
                    this.tableData.forEach((item,index)=>{
                        item.statusText = this.statusArr.find(option=>option.value==item.status).label;
                        item.typeText = this.typeArr.find(option=>option.value==item.type).label;
                        item.order = (this.pageNo-1)*this.pageSize+index+1;
                        item.playCount1 = item.playCount - item.addPlayCount
                    })
                    this.getTopCount()
                }
            }).catch(()=>{
                self.loading = false;
            })
        },
        /**
         * 查询
         */
        search(){
            this.pageNo = 0;
            this.$nextTick(()=>{
                this.pageNo = 1;
            })
        },
        /**
         * 获取置顶数量
         */
        getTopCount(){
            let query = {
                params:{
                    name:1
                }
            }
            this.$http.get(this.$server.getTopCount,query).then(res=>{
                if(res.status==200){
                    this.count = res.content.count;
                }
            })
        },
        /**
         * 置顶/取消置顶
         */
        topOrCancel(obj){
            if(obj.upStatus==1){
                this.$http.post(`${this.$server.shortVideoCancelTop}/${obj.id}`,{}).then(res=>{
                    if(res.status==200){
                        this.getList();
                    }
                })
            }else if(obj.upStatus==2){
                this.$http.post(`${this.$server.shortVideoTop}/${obj.id}`,{}).then(res=>{
                    if(res.status==200){
                        this.$message.success('置顶成功');
                        this.getList();
                    }
                })
            }
        },
        /**
         * 上架/下架
         */
        upOrDown(obj){
            if(obj.status==1){
                this.$confirm('确定要将该视频上架吗', '上架确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$http.post(`${this.$server.shortVideoUp}/${obj.id}`,{}).then(res=>{
                        if(res.status==200){
                            this.$message.success('上架成功');
                            this.getList();
                        }
                    })
                }).catch(()=>{

                })
            }else if(obj.status==2){
                this.$confirm('确定要将该视频下架吗', '下架确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$http.post(`${this.$server.shortVideoDown}/${obj.id}`,{}).then(res=>{
                        if(res.status==200){
                            this.$message.success('下架成功');
                            this.getList();
                        }
                    })
                }).catch(()=>{

                })
            }
        },
        /**
         * 编辑视频
         */
        edit(obj){
            let query = {
                id:obj.id,
                name:obj.name,
                type:Number(obj.type),
                video:{
                    id:obj.videoId,
                    title:obj.videoName
                },
                course:{
                    id:obj.relationCourseId,
                    title:obj.courseName
                },
                backgroundUrl:obj.backgroundUrl
            }
            this.$router.push({
                path:'/shortVideo/update',
                query:{
                    data:JSON.stringify(query)
                }
            })
        },
        dialogShow(obj){
            this.id = obj.id;
            this.dialogVisible = true;
        },
        /**
         * 追加播放量
         */
        addPlayCount(){
            if(this.num==''){
                this.$message.error('请输入播放量');
                return false;
            }
            let regExp = /^\d+$/
            if((!regExp.test(this.num))||!(this.num<=10000000&&this.num>0)){
                this.$message.error('请输入1-10000000的数字');
                return false;
            }
            this.dialogLoading = true;
            let query = {
                id:this.id,
                addPlayCount:this.num
            }
            this.$http.post(this.$server.addPlayCount,query).then(res=>{
                this.dialogLoading = false;
                if(res.status==200){
                    this.$message.success('播放量设置成功');
                    this.dialogVisible = false;
                    this.getList()
                }
            }).catch(()=>{
                this.dialogLoading = false;
            })
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

