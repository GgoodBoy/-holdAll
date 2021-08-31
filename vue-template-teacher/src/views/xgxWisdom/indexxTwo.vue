<template>
  <div>
    <div class="page-header">
      <el-row>
        <el-col class="lLeft-r">
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="keyword">
            <el-input
              v-model="questionBankName"
              placeholder="输入名称查询"
              maxlength="20"
              clearable
              style="width:250px;"
            />
            <el-button type="primary" @click="search" v-if="$authJudge('wisdomplatform:sentence:select')">查询</el-button>
          </div>
        </el-col>
        <el-col :span="2" :offset="9" class="textAlign"><el-button type="primary" @click="addQuestion" v-if="$authJudge('wisdomplatform:sentence:edit')">新建国学名句</el-button></el-col>
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
            prop="content"
            label="名句名称"
            min-width="200"
            align="center"
            show-overflow-tooltip/>
          <el-table-column
            prop="creator"
            label="创建人"
            align="center"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="createdAt"
            label="创建时间"
            align="center"
            min-width="150"
            show-overflow-tooltip/>
          <el-table-column
            label="操作"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
                <div class="btn-box">
                    <el-button type="text" size="small" class="handle-btn" @click="editRow(scope.row)" v-if="$authJudge('wisdomplatform:sentence:edit')">修改</el-button>
                    <el-button type="text" size="small" class="handle-btn" @click="removeEven(scope.row)" v-if="$authJudge('wisdomplatform:sentence:del')">删除</el-button>
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
      <div class="layoutCss">
        <div>国学名句</div>
        <el-input style="width:360px;marginLeft:20px;paddingRight:50px" type="textarea" rows='4' v-model="addName" maxlength="50" show-word-limit placeholder="请输入国学名句"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="dialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title=""
        :visible.sync="specialTypeDetailOne"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        width="20%"
        style="text-align: center;"
        >
            <div>
                确定要删除这句名言吗?
            </div>
            <div style='margin-top:20px;'>
                <el-button type="primary" @click="typeIsSelect(false)">取消</el-button>
                <el-button type="primary" @click="typeIsSelect(true)">确认</el-button>
            </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    components: {
        pagination,breadcrumb
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
            disabledState:false,
            specialTypeDetailOne:false,
            titleList:[
                        {
                            name:'国学智慧平台',
                            pathInfo:''
                        },
                        {
                            name:'国学名句管理',
                            pathInfo:''
                        }               
            ]
        };
    },
    metaInfo: {},
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
        typeIsSelect(type){
            if(type){
                this.$http.post(this.$server.wisdomDelSentence+this.temp.id).then(res=>{
                    if(res.status==200){
                        this.temp = {}
                        this.pageNo = 0;
                        this.specialTypeDetailOne = false;
                        this.$nextTick(()=>{
                            this.pageNo = 1;
                        })
                        this.$message.success('删除成功');
                    }
                })     
            }else{
                this.specialTypeDetailOne = false;
            }
        },
        addQuestion(){
            this.dialogVisible = true;
        },
        save(){
                this.modQuestionBank()
            },
      
        /**
         * 修改题库名称
         */
        modQuestionBank(){
            if(!this.addName){
                this.$message.error('请输入国学名句');
                return;
            }
            let query = {
                content:this.addName
            }
            if(this.flag=='edit'){
                query['id'] = this.temp.id;
            }
            this.$http.post(this.$server.wisdomEditSentence,query).then(res=>{
                if(res.status==200){
                    this.temp = {}
                    this.flag = 'add';
                    this.pageNo = 0;
                    this.dialogVisible = false;
                    this.$nextTick(()=>{
                        this.pageNo = 1;
                    })
                    this.$message.success('修改成功');
                }
            }).finally(()=>{
                this.dialogLoading = false;
            })
        },
        /**
         * 获取列表数据
         */
        getList() {
            this.loading = true;
            const query = {
                params: {
                   content:this.questionBankName,
                   pageNo:this.pageNo,
                   pageSize:this.pageSize
                }
            }
            this.$http.get(this.$server.wisdomSentenceList,query).then(res => {
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
            this.addName = obj.content;
        },
        removeEven(obj){    
            this.temp = obj; 
            this.specialTypeDetailOne = true;
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
    .layoutCss{
        display: flex;
        flex-direction: row;
        justify-content:flex-start;
        align-items:flex-start;
    }
</style>

