<template>
    <div>
        <el-row :gutter="20">
            <el-col>
                <breadcrumb :menuList ='titleListName'></breadcrumb>
            </el-col>            
            <el-col>
                <elMenusGx :menuList ='titleList'></elMenusGx>
            </el-col>   
            <el-col class="lMarginTop30" v-if="!chooseBools">
                <el-row :gutter="15" class="lLine40">
                    <el-col :span="6"><el-input v-model.trim="name" @keyup.native="proving('name')" placeholder="请输入内容"></el-input></el-col>
                    <el-col :span="2"><el-button v-if="$authJudge('activity:webactivity:question:select')" class="redBackColor butColorF" @click="seachEven">查询</el-button></el-col>
                    <el-col :span="3" :offset="10" class="lCenter-r"><el-button v-if="$authJudge('activity:webactivity:question:import')" class="redBackColor butColorF" @click="exportExcel">批量导入</el-button></el-col>
                    <el-col :span="3"><el-button class="redBackColor butColorF" v-if="$authJudge('activity:webactivity:question:add')" @click="addOrReturnSubjectEven('',true,'add')">添加新题目</el-button></el-col>
                </el-row>
            </el-col>                       
            <!-- <el-col class="lMarginTop10" v-if="chooseBools=='list'"> -->
            <el-col class="lMarginTop10" v-if="!chooseBools">
                <el-table
                    border
                    :data="tableDataSubject"
                    v-loading="loadingOne"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        min-width="60"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="subject"
                        label="题目"
                        min-width="300"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="answerContent1"
                        label="答案一"
                        min-width="200"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="answerContent2"
                        label="答案二"
                        min-width="200"
                        show-overflow-tooltip>
                    </el-table-column>                                                                  
                    <el-table-column
                        fixed="right"
                        label="操作"
                        min-width="60">
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col class="lCenter-r">
                                        <el-button v-if="$authJudge('activity:webactivity:question:edit')" type="text" class="black-btn" @click="addOrReturnSubjectEven(scope.row,true,'update')">修改</el-button>
                                    </el-col>                                                                                                                         
                                </el-row>                                                      
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
            </el-col> 
            <el-col v-if="chooseBools">
            <!-- <el-col v-if="chooseBools=='subject'"> -->
                <el-row :gutter="15" class="lLine40">
                    <el-col class="lMarginTop10">
                        <div class="divStyle lPadding20">
                            <el-row :gutter="15" class="lLine40">
                                <el-col :span="2" class="lRight-r"><span>题目:</span></el-col>
                                <el-col :span="8"><el-input v-model.trim="inputTitle" @keyup.native="proving('inputTitle')"  maxlength="50" placeholder="请输入内容"></el-input></el-col>
                                <el-col :span="4" class="redFontColor" v-show="inputTitleBools">* 题目名称不能为空</el-col>
                                <el-col :offset="2">限50个字以内</el-col>
                            </el-row>                            
                        </div>
                    </el-col>
                    <el-col class="lMarginTop10">
                        <div class="divStyle lPadding20">
                            <el-row :gutter="15" class="lLine40">
                                <el-col :span="2" class="lRight-r"><span>答案一:</span></el-col>
                                <el-col :span="8"><el-input v-model.trim="inputAnswer1" @keyup.native="proving('inputAnswer1')"  maxlength="50" placeholder="请输入内容"></el-input></el-col>
                                <el-col :span="4" class="redFontColor"  v-show="inputAnswer1Bools">* 答案不能为空</el-col>
                                <el-col :offset="2">限50个字以内</el-col>
                            </el-row>                            
                        </div>                        
                    </el-col>
                    <el-col class="lMarginTop10">
                        <div class="divStyle lPadding20">
                            <el-row :gutter="15" class="lLine40">
                                <el-col :span="2" class="lRight-r"><span>答案二:</span></el-col>
                                <el-col :span="8"><el-input v-model.trim="inputAnswer2" @keyup.native="proving('inputAnswer2')" maxlength="50" placeholder="请输入内容"></el-input></el-col>
                                <el-col :span="4" class="redFontColor"  v-show="inputAnswer2Bools">* 答案不能为空</el-col>
                                <el-col :offset="2">限50个字以内</el-col>
                            </el-row>                            
                        </div>                        
                    </el-col>
                    <el-col  class="lMarginTop20">
                        <el-row :gutter="20" class="lLine40">
                            <el-col :span="2" :offset="10"><el-button @click="removeDilgs(chooseBools)">取消</el-button></el-col>
                            <el-col :span="2"><el-button class="redBackColor butColorF" @click="saveSubjectEven(chooseBools)">保存</el-button></el-col>
                        </el-row>                         
                    </el-col>
                </el-row>                
            </el-col>
        </el-row> 
        <el-dialog
            :visible.sync="exportExcelDialogStarts"
            title=""
            max-height="300"
            width="30%">  
            <el-row>
                    <el-col :span="8" :offset="3">
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            :action="actiosService"
                            :before-upload="beforeAvatarUpload"
                            :headers="myHeaders"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"                            
                            :file-list="fileList"
                            :auto-upload = 'false'
                            :on-success = 'handleSuccess'
                            >
                            <el-button slot="trigger" size="small" class="redBackColor butColorF">选取文件</el-button>
                            <p slot="tip" class="el-uploadtip">只能上传xls/xlsx文件</p>
                        </el-upload>
                    </el-col> 
                    <el-col :span="4" :offset="6">
                        <el-button size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    </el-col> 
            </el-row>
        </el-dialog>                    
    </div>
</template>
<script>
import elMenusGx from "@/components/elMenu/elMenusGx";
import XLSX from 'xlsx';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data(){                     
        return {
            myHeaders: {token: getToken()},
            flags:[],
            tableDataSubject:[
                {
                    sortId:1,
                    H5name:'你的手机突然死机，屏幕上却是一张神似你的古人画像，你会',
                    answerOne:'大叫一声“鬼啊”，丢掉手机跑开',
                    answerTwo:'忍不住好奇，用手触摸照片'
                }
                ],    
            titleListName:[
                            {
                                name:'活动',
                                pathInfo:'/activityObjList'
                            },
                            {
                                name:'H5活动',
                                pathInfo:''
                            }               
                ],   
            titleList:[
                {
                    name:'测评管理',
                    pathInfo:'/activityObj/answer',
                    divCss:false
                },
                {
                    name:'题目库',
                    pathInfo:'/activityObj/itemBank',
                    divCss:true
                },
                {
                    name:'诗词库',
                    pathInfo:'/activityObj/poetryLibrary',
                    divCss:false
                },
                {
                    name:'设置',
                    pathInfo:'/activityObj/setUpGx',
                    divCss:false
                },
                {
                    name:'统计',
                    pathInfo:'/activityObj/gxStatistics',
                    divCss:false
                }                                
            ],
            loadingOne:false,
            name:'',
            chooseBools:false,
            fileList:[],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            pageSize:10,
            pageNo:1,
            inputAnswer1:'',
            inputAnswer2:'',
            inputTitle:'',
            inputTitleBools:false,
            inputAnswer1Bools:false,
            inputAnswer2Bools:false,
            exportExcelDialogStarts:false,
            addOrUpdata:'add',
            subjectData:'',
        }
    },
    created(){    
        this.getTableList(1); 
    },
    components:{
        elMenusGx,
        breadcrumb
    },
    computed:{
        actiosService(){
            return  this.$server.h5QuestionImportExcel
        }
    },     
    methods:{ 
        proving(val){
            var self = this;
            var reg = /^(?!.*\\.*$)/;        
            switch (val) {
                case 'name':
                    if(!reg.test(self.name)){
                        this.name='';
                    }                    
                    break;
                case 'inputTitle':
                    if(!reg.test(self.inputTitle)){
                        this.inputTitle='';
                    }                    
                    break;
                case 'inputAnswer1':
                    if(!reg.test(self.inputAnswer1)){
                        this.inputAnswer1='';
                    }                    
                    break; 
                case 'inputAnswer2':
                    if(!reg.test(self.inputAnswer2)){
                        this.inputAnswer2='';
                    }                    
                    break;           
                default:
                    break;
            }    
        },        
        seachEven(){
            this.getTableList(1);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },         
        saveSubjectEven(starts){
            var self = this;
            if(!self.inputTitle.length>0){
                self.inputTitleBools = true;
                return;
            }else{
                self.inputTitleBools = false;
            };
            if(!self.inputAnswer1.length>0){
                self.inputAnswer1Bools = true;
                return;
            }else{
                self.inputAnswer1Bools = false;
            };
            if(!self.inputAnswer2.length>0){
                self.inputAnswer2Bools = true;
                return;
            }else{
                self.inputAnswer2Bools = false;
            };
            if(self.addOrUpdata=='add'){
                var params = {
                    subject:self.inputTitle,
                    answerContent1:self.inputAnswer1,
                    answerContent2:self.inputAnswer2
                };
                self.$http.post(self.$server.h5QuestionAdd,params).then(res=>{
                if(res.status==200){
                    self.getTableList(1); 
                    self.chooseBools=!starts;
                }
                })
            }else{
                var params = {
                    subject:self.inputTitle,
                    answerContent1:self.inputAnswer1,
                    answerContent2:self.inputAnswer2,
                    answerId1:self.subjectData.answerId1,
                    answerId2:self.subjectData.answerId2,
                    questionId:self.subjectData.id
                };
                self.$http.post(self.$server.h5QuestionUpdate,params).then(res=>{
                if(res.status==200){
                    self.getTableList(self.pageAtion.paginationPage); 
                    self.chooseBools=!starts;
                }
                })                
            }  
        },
        getTableList(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loadingOne = true;
            var params = {
                pageNo:self.pageNo,
                pageSize:self.pageSize,
                name:self.name
            };
            self.$http.get(self.$server.h5QuestionList(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                return element;
                            });                            
                        }                    
                   }; 
                    self.tableDataSubject = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loadingOne = false;
               }
            })
            .catch(res => {
                    self.loadingOne = false;
            });             
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
      beforeAvatarUpload(file) {
        let Xls = file.name.split('.');
        if(Xls[1] === 'xls'||Xls[1] === 'xlsx'){
          return file
        }else {
          this.$message.error('上传文件只能是 xls/xlsx 格式!')
          return false
        }
      },
      exportExcel(){
          this.exportExcelDialogStarts = true;
      },
      handleSuccess(res,file,fileList){
        var self = this;
        if(res.status===200){
            self.exportExcelDialogStarts = false;
            self.$message({
                message: '上传成功！',
                type: 'success'
            });
            self.fileList=[];
            this.getTableList(1); 
        }else {
            self.exportExcelDialogStarts = true;
            self.$message({
                message: res.msg,
                type: 'error'
            });
        }
      },                
        subjectUpdate(data){
            console.log(data);
        },
        removeDilgs(starts){
            this.chooseBools=!starts;
        },
        addOrReturnSubjectEven(data,objs,starts){
            this.chooseBools=objs;
            this.addOrUpdata = starts;
            this.subjectData = data;
            if(starts=='add'){
                this.inputTitle = '';
                this.inputAnswer1 = '';
                this.inputAnswer2 = '';
            }else{
                this.inputTitle = data.subject;
                this.inputAnswer1 = data.answerContent1;
                this.inputAnswer2 = data.answerContent2;                
            }
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getTableList(Number(num)); 
            }
        }        
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.divStyle{
    background-color: #fff;
}
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }
</style>


