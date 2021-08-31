<template>
  <div>
    <div class="page-header">
      <el-row>
        <el-col :span="4">
          <h3 class="page-title">题库管理</h3>
        </el-col>
      </el-row>
      <el-row :gutter="2">
        <el-col :span="10">
          <div class="keyword">
            <el-input
              v-model="questionBankName"
              placeholder="输入题库名称查询"
              maxlength="20"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="2" class="textAlign"><el-button type="primary" @click="search" v-if="$authJudge('questionbank:select')">查询</el-button></el-col>
        <el-col :span="2" :offset="10" class="textAlign"><el-button type="primary" @click="addQuestion" v-if="$authJudge('questionbank:add')">添加题库</el-button></el-col>
        <input type="text" class="copy-input"/>
      </el-row>
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
            min-width="40"/>
          <el-table-column
            prop="questionBankName"
            label="题库名称"
            min-width="200"
            align="center"
            show-overflow-tooltip/>
          <el-table-column
            prop="courseName"
            label="链接"
            align="center"
            width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="copy(scope.row)">复制链接</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="titleNum"
            label="题量"
            align="center"
            width="80"
          />
          <el-table-column
            prop="hitsNum"
            label="点击"
            align="center"
            min-width="80"
          />
          <el-table-column
            label="操作"
            align="center"
            min-width="80"
          >
            <template slot-scope="scope">
                <div class="btn-box">
                    <el-button type="text" size="small" class="handle-btn" @click="checkList(scope.row)" v-if="$authJudge('questionbank:record')">查看</el-button>
                    <el-button type="text" size="small" class="handle-btn" @click="editRow(scope.row)" v-if="$authJudge('questionbank:update')">修改</el-button>
                    <el-button type="text" size="small" class="handle-btn" @click="goPage(scope.row)" v-if="$authJudge('questionbank:selecttitle')">添加题目</el-button>
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
      v-loading="dialogLoading"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :width="'500px'"
      :top="'30vh'"
      title=""
      center>
      <div>
        <label>题库名称</label>
        <el-input style="width:360px;marginLeft:20px;paddingRight:50px" type="text" v-model="addName" maxlength="50" show-word-limit placeholder="请输入题库名称"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="dialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/pagination";
export default {
    components: {
        pagination
    },
    data() {
        return {
            questionBankName:'',
            pageNo: 1,
            pageSize: 10,
            total: 10,
            tableData: [],
            loading: false,
            dialogVisible: false,
            dialogLoading: false,
            addName:'',
            flag:'add',
            disabledState:false       
        };
    },
    metaInfo: {
        title: "题库管理"
    },
    watch: {
        dialogVisible(cur,old){
            if(!cur){
                this.dialogLoading = false;
                this.addName = ''
            }
        },
        pageNo(cur, old) {
            if (cur >= 1) {
                this.getList()
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        addQuestion(){
            this.dialogVisible = true;
        },
        save(){
            if(this.flag=='add'){
                this.addQuestionBank()
            }else{
                this.modQuestionBank()
            }
        },
        /**
         * 添加题库
         */
        addQuestionBank(){
            var self = this;
            let query = {
                questionBankName:this.addName
            }
            this.dialogLoading = true;
            if(!self.disabledState){
                self.disabledState = !self.disabledState;           
                this.$http.post(this.$server.addQuestionBank,query).then(res=>{
                    if(res.status==200){
                        this.dialogVisible = false;
                        self.disabledState = !self.disabledState;
                        this.pageNo = 0;
                        this.questionBankName = '';
                        this.$nextTick(()=>{
                            this.pageNo = 1;
                        })
                        this.$message.success('题库添加成功');
                    }
                }).finally(()=>{
                    self.disabledState = !self.disabledState;
                    this.dialogLoading = false;
                })
            }
        },
        /**
         * 修改题库名称
         */
        modQuestionBank(){
            let query = {
                questionBankName:this.addName
            }
            this.dialogLoading = true;
            this.$http.post(`${this.$server.modQuestionBank}/${this.temp.id}`,query).then(res=>{
                if(res.status==200){
                    this.temp = {}
                    this.flag = 'add';
                    this.dialogVisible = false;
                    this.pageNo = 0;
                    this.$nextTick(()=>{
                        this.pageNo = 1;
                    })
                    this.$message.success('题库修改成功');
                }
            }).finally(()=>{
                this.dialogLoading = false;
            })
        },
        copy(obj) {
            const dom = document.querySelector('.copy-input');
            dom.value = `${this.$server.h5}?id=${obj.id}&takeInfo=true`
            dom.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                this.$message.success({ message: "复制成功" });
            }
        },
        /**
         * 获取列表数据
         */
        getList() {
            this.loading = true;
            const query = {
                params: {
                   questionBankName:this.questionBankName,
                   pageNo:this.pageNo,
                   pageSize:this.pageSize
                }
            }
            this.$http.get(this.$server.questionBankPage, query).then(res => {
                if (res.status == 200) {
                    this.tableData = res.content.list;
                    this.tableData.forEach((item,index)=>{
                        item.sortId = (this.pageNo-1)*this.pageSize+index+1;
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
        editRow(obj){
            this.flag = 'edit'
            this.dialogVisible = true;
            this.addName = obj.questionBankName;
            this.temp = obj;
        },
        checkList(obj){
            this.$router.push({
                path:'/questionBank/checkList',
                query:{
                    id:obj.id,
                    questionBankName:encodeURI(obj.questionBankName)
                }
            })            
        },
        goPage(obj){
            this.$router.push({
                path:'/questionBank/update',
                query:{
                    id:obj.id,
                    questionBankName:encodeURI(obj.questionBankName)
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
    .copy-input{opacity: 0;position: absolute;}
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

