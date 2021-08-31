<template>
    <div class="add-question-page">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
                <el-button v-if="$authJudge('thekingofknowledge:bank:add')" style="float:right" type="primary" @click="$router.push('/answerMiniProgram/addQuestion/edit')">添加题目</el-button>
                <el-button v-if="$authJudge('thekingofknowledge:bank:batchimport')" style="float:right;margin:0 20px;" type="text" @click="dialogVisible1=true">批量导入</el-button>
            </el-row>
            <div class="search-area">
                <div class="input-box">
                    <el-input type="text" placeholder="输入题目名称查询" v-model="title"></el-input>
                </div>
                <div class="select-box">
                    <label>类型</label>
                    <el-select v-model="type" placeholder="请选择">
                        <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="select-box">
                    <label>难度</label>
                    <el-select v-model="difficultyType" placeholder="请选择">
                        <el-option
                        v-for="item in difficultyTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-button v-if="$authJudge('thekingofknowledge:bank:export')" style="float:right" type="primary" @click="exportEvent" >导出</el-button>
                <el-button v-if="$authJudge('thekingofknowledge:bank:select')" style="float:right;margin:0 20px 0 0;" type="primary" @click="search">查询</el-button>
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
                    prop="sortId"
                    label="序号"
                    align="center"
                    min-width="30"/>
                <el-table-column
                    prop="title"
                    label="题目名称"
                    min-width="150"
                    align="center"
                    show-overflow-tooltip/>
                <el-table-column
                    prop="typeText"
                    label="类型"
                    align="center"
                    min-width="30">
                </el-table-column>
                <el-table-column
                    prop="difficultyTypeText"
                    label="难度"
                    align="center"
                    min-width="30"
                ></el-table-column>
                <el-table-column
                    prop="answerNum"
                    label="答题次数"
                    align="center"
                    min-width="40"
                ></el-table-column>
                <el-table-column
                    prop="errorRate"
                    label="错题率"
                    align="center"
                    min-width="36"
                ></el-table-column>
                <el-table-column
                    prop="createName"
                    label="创建人"
                    align="center"
                    min-width="40"
                ></el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="创建时间"
                    align="center"
                    min-width="80"
                ></el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="90"
                >
                    <template slot-scope="scope">
                        <div class="btn-box">
                            <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('thekingofknowledge:bank:edit')" @click="$router.push(`/answerMiniProgram/addQuestion/edit?id=${scope.row.id}`)">编辑</el-button>
                            <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('thekingofknowledge:bank:preview')" @click="previewEvent(scope.row.id)">预览</el-button>
                            <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('thekingofknowledge:bank:detail')" @click="$router.push(`/answerMiniProgram/addQuestion/details?id=${scope.row.id}`)">详情</el-button>
                            <el-button type="text" size="small" class="handle-btn" v-if="$authJudge('thekingofknowledge:bank:delete')" @click="delQuestion(scope.row.id)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        :current-page.sync="pageNo"
                        :page-size="pageSize"
                        :total="total"
                        layout="prev, pager, next"
                    />
                </div>
            </div>
        </div>
        <el-dialog
            title="题目预览"
            :visible.sync="dialogVisible"
            width="600px"
            custom-class="preview-dialog"
            center
            >
            <div>
                <div class="item">
                    <label>类型</label>
                    <el-radio disabled >{{dialogData.typeText}}</el-radio>
                </div>
                <div class="item">
                    <label>难度</label>
                    <el-radio disabled >{{dialogData.difficultyTypeText}}</el-radio>
                </div>
                <div class="item">
                    <label>题目名称</label>
                    <p>{{dialogData.title}}</p>
                </div>
                <div class="item answer-item" v-for="(item,index) in dialogData.answerList" :key="index">
                    <label>答案</label>
                    <p>{{item.sort}}.{{item.text}}</p>
                    <el-radio disabled v-model="dialogData.rightKey" :label="index+1">正确答案</el-radio>
                </div>
            </div>
        </el-dialog> 
        <el-dialog
            title="批量导入"
            :visible.sync="dialogVisible1"
            width="400px"
            custom-class="upload-dialog"
            center
            >
            <div class="file-box">
                <el-button type="primary" @click="chooseFile">选择导入文件</el-button>
                <input type="file" name="file" class="file-upload" ref="uploadInput" @change="getFile($event)" @click="emptyFile($event)"/>
                <p class="download">
                    <span>下载批量导入模板</span>
                    <a :href="downloadUrl">下载</a>
                </p>
            </div>
            <p class="file-name">{{filename}}</p>
            <div class="btns">
                <el-button @click="dialogVisible1 = false">取消</el-button>
                <el-button type="primary" @click="importQuestionBank">确定</el-button>
            </div>
        </el-dialog>    
  </div>
</template>

<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken } from '@/utils/auth';
export default {
    components: {
        pagination,breadcrumb
    },
    data() {
        return {
            titleList:[
                {
                    name:'小程序知识达人王者',
                    pathInfo:'/answerMiniProgram/addQuestion'
                },
                {
                    name:'添加题库',
                    pathInfo:''
                }               
            ],
            title:'',
            type:'',
            difficultyType:'',
            typeOptions:[
                {label:'文学',value:1},
                {label:'常识',value:2},
                {label:'历史',value:3},
                {label:'成语',value:4},
                {label:'民俗',value:5},
                {label:'全部',value:-1}
            ],
            difficultyTypeOptions:[
                {label:'简',value:1},
                {label:'中',value:2},
                {label:'难',value:3},
                {label:'全部',value:-1}
            ],
            pageNo: 1,
            pageSize: 10,
            total: 10,
            tableData: [],
            loading: false,
            dialogVisible:false,
            dialogData:{
                typeText:'',
                difficultyTypeText:'',
                title:'',
                rightKey:'',
                answerList:[],
            },
            dialogVisible1:false,
            downloadUrl:'',
            filename:'',
            file:''
        }
    },
    watch: {
        pageNo(cur, old) {
            if (cur >= 1) {
                this.getQuestionList()
            }
        },
        dialogVisible1(cur){
            if(!cur){
                this.filename = '';
                this.file = ''
            }
        }
    },
    created() {
        this.getQuestionList()
        this.downloadUrl = this.$server.downloadExcelModel+`?token=${getToken()}`
    },
    methods: {
        /**
         * 获取列表数据
         */
        getQuestionList() {
            this.loading = true;
            const query = {
                params: {
                    title:this.title,
                    type:this.type==-1?'':this.type,
                    difficultyType:this.difficultyType==-1?'':this.difficultyType,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(this.$server.getQuestionList,query).then(res => {
                if (res.status == 200) {
                    this.tableData = res.content.list;
                    this.tableData.forEach((item,index)=>{
                        item.sortId = (this.pageNo-1)*this.pageSize+index+1;
                        item.typeText = this.typeOptions.find(option=>option.value==item.type).label;
                        item.difficultyTypeText = this.difficultyTypeOptions.find(option=>option.value==item.difficultyType).label;
                    })
                    this.total = res.content.total;
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        /**
         * 查询
         */
        search() {
            this.pageNo = 0;
            this.$nextTick(() => {
                this.pageNo = 1;
            })
        },
        /**
         * 导出
         */
        exportEvent(){
            let url = `${this.$server.exportQuestion}?title=${this.title||''}&type=${this.type||''}&difficultyType=${this.difficultyType||''}&token=${getToken()}`
            window.open(url);  
        },
        /**
         * 预览
         */
        previewEvent(id){
            const loadingInstance = this.$loading({
                target:document.querySelector('.preview-dialog')
            });
            this.dialogVisible = true;
            const query = {
                params:{}
            }
            this.$http.get(`${this.$server.getQuestionDetail}/${id}`,query).then(res=>{
                if(res.status==200){
                    this.dialogData = {
                        title:res.content.title,
                        typeText:this.typeOptions.find(item=>item.value==res.content.type).label,
                        difficultyTypeText:this.difficultyTypeOptions.find(item=>item.value==res.content.difficultyType).label,
                        rightKey:res.content.rightKey
                    }
                    const answerList = []
                    if(res.content.answerA&&res.content.answerA.length>0){
                        answerList.push({
                            sort:'A',text:res.content.answerA,right:res.content.rightKey==1
                        })
                    }
                    if(res.content.answerB&&res.content.answerB.length>0){
                        answerList.push({
                            sort:'B',text:res.content.answerB,right:res.content.rightKey==2
                        })
                    }
                    if(res.content.answerC&&res.content.answerC.length>0){
                        answerList.push({
                            sort:'C',text:res.content.answerC,right:res.content.rightKey==3
                        })
                    }
                    if(res.content.answerD&&res.content.answerD.length>0){
                        answerList.push({
                            sort:'D',text:res.content.answerD,right:res.content.rightKey==4
                        })
                    }
                    this.dialogData.answerList = answerList;
                }
            }).finally(()=>{
                loadingInstance.close()
            })
        },
        /**
         * 删除题目
         */
        delQuestion(id){
            this.$confirm('确定删除这道题目吗？', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'none',
                center: true
                }).then(() => {
                    const query = {
                        params:{}
                    }
                    this.$http.post(`${this.$server.deleteQuestion}/${id}`,query).then(res=>{
                        if(res.status==200){
                            this.$message.success('删除成功');
                            this.pageNo = 0;
                            this.$nextTick(()=>{
                                this.pageNo = 1;
                            })
                        }
                    }).finally(()=>{

                    })
                }).catch(() => {
                
                });
        },
        chooseFile(){
            this.$refs.uploadInput.click()
        },
        emptyFile(e){
            e.target.value = ''
        },
        getFile(e){
            let files = e.target.files || e.dataTransfer.files;
            let fileData = files[0];
            if (!/(\.xlsx|\.xls)$/.test(fileData.name.toLowerCase())) {
                this.$message.error("只能上传下载的模板");
                return;
            }
            this.filename = fileData.name;
            this.file = fileData;
        },
        importQuestionBank(){
            let params = new FormData();
            params.append('file',this.file)
            const config = {
                headers: {'Content-Type': 'multipart/form-data'}
            }
            this.$http.post(this.$server.importQuestionBank,params,config).then(res=>{
                if(res.status==200){
                    this.$message.success('导入成功');
                    this.dialogVisible1 = false;
                    this.pageNo = 0;
                    this.$nextTick(()=>{
                        this.pageNo = 1;
                    })
                }else{
                    this.$confirm('检测到不合规内容，请修改', '检测提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'none',
                        center: true
                    }).then(() => {
                        
                   
                    }).catch(() => {
                    
                    });
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
    .add-question-page{
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
            margin-top:10px;
            .input-box{
                width: 220px;
                display: inline-block;
                vertical-align: middle;
            }
            .select-box{
                display: inline-block;
                vertical-align: middle;
                margin:0 0 0 20px;
                label{
                    font-size: 16px;
                    margin-right: 5px;
                    display: inline-block;
                    vertical-align: middle;
                }
                /deep/ .el-select{
                    width: 120px;
                    vertical-align: middle;
                }
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
    .preview-dialog{
        .item{
            margin:20px 0;
            label,p{
                font-size: 16px;
                display: inline-block;
                vertical-align: middle;
            }
            label{
                width: 80px;
            }
        }
        .answer-item{
            p{
                margin-right: 20px;
                width: 260px;
            }
        }
    }
    .upload-dialog{
        .file-box{
            .download{
                display: inline-block;
                vertical-align: middle;
                margin-left:20px;
                font-size: 16px;
                a{
                    text-decoration: underline!important;
                    color:#9E0E00;
                }
            }
        }
        .file-name{
            margin-top:20px;
            text-align: center;
        }
        .btns{
            margin-top:30px;
            text-align: center;
        }
        input{
            position: absolute;
            opacity: 0;
            top:-10000px;
        }
    }
</style>

