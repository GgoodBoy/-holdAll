<template>
    <div>
        <!-- <el-row class="lLine40 headerDiv"> -->
        <el-row class="headerDiv">
             <el-col class="lSize18">
                <el-row class="lSize18">
                    <el-col :span="8" class="lLeft-r">
                        <!-- <span>积分管理</span>/
                        <span>勋章管理</span> -->
                        <breadcrumb :menuList ='titleList'></breadcrumb>
                    </el-col>
                    <el-col :span="3" :offset="13" class="lCenter-r">
                        <el-button v-if="$authJudge('integral:medal:add')" class="redBackColor butColorF" @click="creatlearnCard('',false)">创建勋章</el-button>
                    </el-col>                    
                </el-row>                 
             </el-col>
             <el-col class="lSize18 lMarginTop30" v-if="$authJudge('integral:medal:open')||$authJudge('integral:medal:close')">
                <el-row class="lSize18">
                    <el-col :span="4" class="lLeft-r">
                        <span>是否开启勋章等级功能:</span>
                    </el-col>
                    <el-col :span="3" :offset="1" class="lCenter-r">
                        <el-switch
                        v-model="value2"
                        @change="switchEvent"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                        </el-switch>                        
                        <!-- <el-button type="warning" @click="creatlearnCard">创建勋章</el-button> -->
                    </el-col>                    
                </el-row>                 
             </el-col>
             <el-col>
                <el-row :gutter="20" v-loading='loading'>
                    <el-col :span="6" class="lCenter-r lMarginTop30" v-for="item,index in tableData" :key="index">
                        <div class="medalDiv">
                            <div class="medalImg lLine10">
                                <img :src="item.iconUrl"/>
                                <i v-if="$authJudge('integral:medal:edit')" class="medalIcon el-icon-edit-outline" @click="creatlearnCard(item,true)"></i>
                            </div>
                            <div  class="medalText lSize18 lLine40">
                                <div class="medalName">{{item.name}}</div>
                                <div  class="medalNum">{{item.integral}}积分</div>
                            </div>
                        </div>
                    </el-col>                                                                      
                </el-row>                 
             </el-col>
             <el-col class="lMarginTop50 lCenter-r">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :page-size="16"
                        @current-change="childPageValue"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
             </el-col>
        </el-row>
        <el-dialog
        title=""
        :close-on-click-modal='false'
        :visible.sync="delDialogVisibleBool"
        width="50%"
        center> 
            <el-row class="lLine30">
                <el-col class="lCenter-r" :span="14">
                    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="等级名称:" prop="pass">
                             <!-- @keyup.native="proving" -->
                            <el-input type="text" maxlength="6"  v-model="ruleForm2.pass"></el-input>
                        </el-form-item>
                        <el-form-item label="积分条件:" prop="checkPass">
                            <el-input type="text" maxlength="6"  v-model="ruleForm2.checkPass"></el-input>
                        </el-form-item>
                        <!-- 
                            :before-remove="beforeRemove" 
                            :on-remove="handleRemove"
                            :on-preview="handlePreview"
                        -->
                        <el-form-item label="勋章图片">
                            <el-upload
                            class="upload-demo"
                            :action="actiosService"
                            :headers="myHeaders"
                            :before-upload="beforeAvatarUpload"
                            :multiple="false"
                            :limit="1"
                            :on-success="handleAvatarSuccess"
                            :on-exceed="handleExceed"
                            :file-list="fileList">
                            <el-button size="small" class="redBackColor butColorF">+点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">尺寸：200px*200px，大小：≤500K</div>
                            </el-upload>                            
                        </el-form-item>
                        <el-form-item>
                            <el-button class="redBackColor butColorF" @click="looksubmitForm('ruleForm2')">浏览</el-button>
                            <el-button class="redBackColor butColorF" @click="submitForm('ruleForm2')">保存</el-button>
                        </el-form-item>
                    </el-form>                    
                </el-col>
                <el-col class="lCenter-r" :span="1" :offset="2">
                    <div class="dividingLine"></div>
                </el-col>
                <el-col class="lCenter-r" :span="6">
                    <div class="medalPreview">
                        <div>预览</div>
                        <div class="previewImg">
                            <img :src="imageUrlNext"/>
                        </div>
                        <div class="previewText">
                            <div class="previewOne">{{ruleForm.pass}}</div>
                            <div class="previewTwo">{{ruleForm.checkPass}}</div>
                        </div>
                    </div>
                </el-col>
            </el-row>                   
        </el-dialog>        
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){ 
        var checkAge = (rule, value, callback) => {
            var self = this;
            //   1到100; /^([1-9]\d?|100)$/  
            //   1到1000 /^(?:[0-9]{1,3}|1000)$/
            switch (rule.fullField) {
                case "pass":
                    let regExpName = /^[\u4e00-\u9fa5]+$/g; 
                    if (value===""||value==0) {
                        return callback(new Error('请输入等级名称'));
                    }else{
                        if(!regExpName.test(value)){
                            callback(new Error('等级名称只能是汉字'))
                        }else{
                            callback()
                        }
                    }
                break;   
                case "checkPass":
                    let regExpNum = /^[1-9]\d*$/g; 
                    if (value===""||value==0) {
                        return callback(new Error('请输入积分条件'));
                    }else{
                        if(!regExpNum.test(value)){
                            callback(new Error('积分条件只能是整数字'))
                        }else{
                            callback()
                        }
                    }
                break;                                                                          
            }
        };               
        return {
            myHeaders: {token: getToken()},
            value1: true,
            value2: '',
            delDialogVisibleBool:false,
            pageNo:1,
            pageSize:16,   
            tableData:[],          
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },             
            ruleForm2: {
                pass: '',
                checkPass: '',
            },
            ruleForm:{
                pass: '',
                checkPass: '',
            },
            titleList:[
                        {
                            name:'积分',
                            pathInfo:''
                        },
                        {
                            name:'勋章管理',
                            pathInfo:''
                        }
                ],
            rules2: {
                pass: [
                    {required: true, validator: checkAge, trigger: 'blur' }
                ],
                checkPass: [
                    {required: true, validator: checkAge, trigger: 'blur' }
                ]
            },
            medalId:'',
            fileList: [],
            imageUrl:'',  
            imageUrlNext:'',
            updateOrAdd:true,          
            loading:false,
            disabledState:false
        }
    },
    computed: {
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }
    }, 
    components:{
        breadcrumb
    }, 
    created(){
        this.getStudylist(1);
        this.switchType();
    },    
    methods: {
        switchType(){
            var self = this;
            self.$http.get(self.$server.medalSwitch).then(res=>{
                if(res.status==200){
                        if(res.content.isEnable==1){
                            self.value2 = true;
                        }else{
                            self.value2 = false;
                        }
                }
            })             
        },
        switchEvent(value){
            var self = this;
            var status = '';
            if(value){
                status = 1;
            }else{
                status = 0;
            }
            self.$http.post(self.$server.medalEnable({status:status})).then(res=>{
                      if(res.status==200){
                          if(value){
                              self.$message.success({ message: "已开启" });
                          }else{
                              self.$message.success({ message: "已关闭" });
                          }
                      }
            })            
        },
        proving(){
            this.ruleForm2.pass=this.ruleForm2.pass.replace(!/^[\u4e00-\u9fa5]+$/g,'');
        },    
        proving1(){
            this.ruleForm2.checkPass=this.ruleForm2.checkPass.replace(/^[1-9]\d*$/g,''); 
        },    
        handleAvatarSuccess(res, file) {
            this.imageUrl = res.content.resourceUrl;
        },                   
        getStudylist(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }            
            var params = {
                pageNo:self.pageNo,
                pageSize:self.pageSize
            };
            self.loading=true;
            self.$http.get(self.$server.medalList(params)).then(res=>{
               if(res.status==200){
                   if(res.content.list.length>0){
                    self.dialogBool = true;
                    var listIds = [];
                    var contentdate = res.content;
                    var nextPage = contentdate.nextPage;
                    var prePage = contentdate.prePage;
                        if(contentdate.list.length){
                            if(!nextPage&&prePage!=0){
                                    listIds = contentdate.list.map(function(element,index){
                                        element.sortId = (prePage+1)*10+index+1;
                                        return element;
                                    });
                                }else if(!prePage&&!nextPage){
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
                        self.tableData = listIds;
                        self.pageAtion.pageTotal = contentdate.total;
                        self.pageAtion.paginationPage = num;
                        self.loading=false;
                   }else{
                       self.dialogBool = false;
                       self.loading=false;
                   }
               }
                console.log(res);
            }).catch((err)=>{
                self.loading=false;
            });          
      },
       childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        },      
      creatlearnCard(date,bools){
          this.delDialogVisibleBool = true;
          if(!bools){
            this.ruleForm.pass='';
            this.ruleForm.checkPass='';
            this.ruleForm2.pass='';
            this.ruleForm2.checkPass=''; 
            this.imageUrl='',  
            this.imageUrlNext='' 
            this.fileList =[];  
            this.updateOrAdd = true; 
            this.medalId = '';                   
          }else{
            this.updateOrAdd = false;  
            this.medalId = date.id;
            this.ruleForm.pass=date.name;
            this.ruleForm.checkPass=date.integral;
            this.ruleForm2.pass=date.name;
            this.ruleForm2.checkPass=date.integral; 
            this.imageUrl=date.iconUrl,  
            this.imageUrlNext=date.iconUrl     
            this.fileList=[];         
              console.log(date);
          }
      },
      submitForm(formName){
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
              if(self.imageUrl==''){
                  self.$message.error('请选择上传图片');
                  return;
              }
             if(self.updateOrAdd){
                var params = {
                    iconUrl:self.imageUrl,
                    name:self.ruleForm2.pass,
                    integral:self.ruleForm2.checkPass
                };
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;                     
                    self.$http.post(self.$server.medalAdd,params).then(res=>{
                        switch (res.status) {
                            case 200:
                                self.delDialogVisibleBool = false;
                                self.disabledState = !self.disabledState;
                                self.getStudylist(1);                     
                                break; 
                        }
                    }).catch(()=>{
                                self.disabledState = !self.disabledState;
                            }) 
                }
             }else{
                var params = {
                    id:self.medalId,
                    iconUrl:self.imageUrl,
                    name:self.ruleForm2.pass,
                    integral:self.ruleForm2.checkPass
                };
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;                    
                    self.$http.post(self.$server.medalUpdate,params).then(res=>{
                        switch (res.status) {
                            case 200:
                                self.disabledState = !self.disabledState;
                                self.delDialogVisibleBool = false;
                                self.getStudylist(1);                     
                                break; 
                        }
                    }).catch(()=>{
                                self.disabledState = !self.disabledState;
                            }) 
                }
             }              
          } else {
            return false;
          }
        });          
      },
      looksubmitForm(formName) {
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
              if(self.imageUrl==''){
                  self.$message.error('请选择上传图片');
                  return;
              }else{
                self.ruleForm = this.ruleForm2;
                self.imageUrlNext = this.imageUrl;
              }              
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      beforeAvatarUpload(file){
        const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
        const isLt2M = file.size / 1024 / 1024 < 0.5;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 png,jpeg,jpg 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 500k!');
        }
        const isSize = new Promise(function(resolve, reject) {
            let _URL = window.URL || window.webkitURL;
            let img = new Image();
            img.onload = function() {
                let valid = img.width == 200 && img.height == 200;
                valid ? resolve() : reject();
            }
            img.src = _URL.createObjectURL(file);
        }).then(() => {
            return file;
        }, () => {
            this.$message.error('上传的图片必须是等于'+200+'*'+200+'!');
            return Promise.reject();
        });        
        return isJPG && isLt2M && isSize;          
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },     
    }    
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px; 
    margin-bottom: 10px;     
}
.medalDiv .medalImg{
    width: 80%;
    margin: auto;
    position: relative;
    border: 1px solid #ccc;
    /* background: #ccc; */
}
.medalDiv .medalImg img{
    width: 100%;
}
.medalDiv .medalImg .medalIcon{
    position: absolute;
    top: 5%;
    left: 80%;
    font-size: 30px;
    cursor: pointer;
    z-index: 1000;
    color: rgb(153, 97, 97);
}
.medalDiv .medalText{
    padding: 0 10%;
    zoom: 1;
    overflow: auto;
}
.medalDiv .medalText .medalName{
    float: left;
}
.medalDiv .medalText .medalNum{
    float: right;
}
.dividingLine{
    width: 5px;
    border-left:1px dashed #ccc;
    height: 300px;
    margin: auto;
}
.medalPreview .previewImg{
    width: 80%;
    margin: auto;
}
.medalPreview .previewText{
    padding:0 10%; 
    zoom: 1;  
    overflow: auto;      
}
.medalPreview .previewText .previewOne{
    float: left;
}
.medalPreview .previewText .previewTwo{
    float: right;
}
</style>

