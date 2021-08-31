<template>
    <div class="wrap-pragram-img"> 
        <breadcrumb :menuList ='titleList'></breadcrumb>
        <div class="pragramBox">   
            <div class="pragramImgBox">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="指定日期"  prop="appointedTime">
                        <el-date-picker
                        v-model="ruleForm.appointedTime"
                        :picker-options="pickerOptions0"
                        type="date"
                        placeholder="年/月/日">
                        </el-date-picker>                        
                    </el-form-item>     
                    <el-form-item prop="surfacePlot" label="上传背景图">
                        <el-upload
                        class="upload-demo"
                        :action="action"
                        :headers="commonHeader"
                        :on-error="uploadFileError"
                        :before-upload="beforeUpload"
                        :on-success="uploadFileSuccess"
                        :multiple="false"
                        :show-file-list="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">图片大小限500K以内，图片尺寸大小限750*1334。</div>
                        </el-upload>        
                        <el-row :gutter="20">
                            <el-col :span="16">
                                    <div class="imgBox" v-loading="loading">
                                        <img :src="ruleForm.surfacePlot"/>
                                    </div>
                            </el-col>
                        </el-row>                                  
                    </el-form-item>   
                    <el-form-item prop="title" label="背景图名称">
                        <el-row :gutter="20">
                            <el-col :span="18">
                                <el-input v-model.trim="ruleForm.title"
                                placeholder="给图片命名"
                                class="search-form"
                                maxlength="6"
                                clearable>
                                </el-input>                                
                            </el-col>
                            <el-col :span="4">
                                <span>{{ruleForm.title.length}}/6</span>
                            </el-col>
                        </el-row>
                    </el-form-item>                                                                                                            
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                        <el-button @click="resetForm('ruleForm')">取消</el-button>
                    </el-form-item>
                </el-form>            
            </div>
        </div>  
        <el-dialog
            title="提示"
            :visible.sync="leaveDialogVisible"
            width="30%"
            >
            <span>您有未保存的信息，离开后会丢失，确认要离开吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="leaveDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="leavePage">确 定</el-button>
            </span>
        </el-dialog>        
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import loginBg from './../../assets/images/login-bg.jpg';
function regularState(data){
    var regEn = new RegExp("[`~!@#$^&*%()=|{}':;'\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；《》：”“'。，,.、？]"),
        reg = /^(?!.*\\.*$)/,
        reg1 = /^(?!.*\/\.*$)/;
        if(regEn.test(data)||!reg.test(data)||!reg1.test(data)){   
            return true;
        }else{
            return false;
        }
}; 
function formatDate(date){
    if(date){
        date = new Date(date);
        var y=date.getFullYear();
        var m=date.getMonth()+1;
        var d=date.getDate();
        var h=date.getHours();
        var m1=date.getMinutes();
        var s=date.getSeconds();
        return y+"-"+m+"-"+d;
    }else{
        return '';
    }
}
export default {
    data(){     
        var checkAge = (rule, value, callback) => {
            var self = this;
            var han = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
            switch (rule.fullField) {
                case "title":
                    setTimeout(() => {
                        if(!han.test(value)){
                            callback(new Error('请输入字母，数字或者汉字。'));
                        }else if (regularState(value)) {
                            callback(new Error('不能输入特殊字符'));
                        }else {
                            callback();
                        } 
                    }, 300);                               
                break;              
            }
        };                                               
        return {
            action:'',
            loginBg:loginBg,
            loading:false,
            pickerOptions0:{
                disabledDate(time) {
                    // time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
                    return time.getTime() < Date.now();
                }
            },  
            ruleFormLocal:'',          
            ruleForm: {
                title:'',
                surfacePlot:'',
                appointedTime:''
            }, 
            rules: {
                title: [
                    { required: true, message: '请输入背景图名称', trigger: 'blur' },
                    {validator: checkAge, trigger: 'blur' }
                ],     
                surfacePlot: [
                    {
                        required: true,
                        message: "请上传背景图",
                        trigger: "change"
                    }
                ],                           
            }, 
            imageUrl:'',
            titleList:[
                {
                    name:'小程序',
                    pathInfo:'/smallProgram/pragramImgList'
                },                
                {
                    name:'背景管理',
                    pathInfo:'/smallProgram/pragramImgList'
                },
                {
                    name:'创建背景',
                    pathInfo:''
                }                               
            ], 
            addOrEditBool:'add',
            leaveDialogVisible:false,
            disabledState:false,
            leaveFlag:false,
            leavePath:''                                                    
        }
    },  
    created(){
        this.action = this.$server.actionImgOrvideo;
        this.commonHeader = {
            token: getToken()
        }; 
        var querys = this.$route.query;
        this.addOrEditBool = querys.addOrEdit;
        switch (this.addOrEditBool) {
            case "add":
                break;
            case "edit":
                this.getDataToFrom(querys.dataInfo);
                break;        
            default:
                break;
        } 
        this.ruleFormLocal = JSON.stringify(this.ruleForm);            
    },
    beforeRouteLeave(to, from, next) {
        this.ruleFormLocalNext = JSON.stringify(this.ruleForm);   
        if(this.ruleFormLocal!=this.ruleFormLocalNext&&!this.leaveFlag){
            //next方法传true或者不传为默认历史返回，传false为不执行历史回退
            this.leaveDialogVisible = true;
            this.leavePath = to;
            next(false);            
        }else{
            next(); 
        }
    },    
    computed: {},    
    components:{
        breadcrumb
    },    
    methods:{      
        //路径切换
        leavePage(){
            this.leaveFlag = true;
            this.leaveDialogVisible = false;
            this.$router.push(this.leavePath.path);            
        },   
        //表单提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.getAddDataToFrom();
            } else {
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$router.push({path: "/smallProgram/pragramImgList"});
        },
        // 图片文件上传之前的检查
        beforeUpload(file) {
            this.loading = true;
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < 0.5;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG,PNG,JPEG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 500k!');
            }            
            const isSize = new Promise(function(resolve, reject) {
                let width = 750;
                let height = 1334;
                let _URL = window.URL || window.webkitURL;
                let img = new Image();
                img.onload = function() {
                    let valid = img.width == width && img.height == height;
                    valid ? resolve() : reject();
                }
                    img.src = _URL.createObjectURL(file);
                }).then(() => {
                    return file;
                }, () => {
                    this.$message.error('上传的图片必须是等于750*1334!');
                    return Promise.reject();
                });
            return isJPG && isLt2M && isSize;
        },
        //文件上传失败
        uploadFileError(err, file, fileList) {
            this.loading = false;
            if (err.message) {
                try {
                    let msg = JSON.parse(err.message).message;
                    this.$message.error(msg);
                    return;
                } catch (e) {}
            }
            this.$message.error(JSON.stringify(err));
        },     
        // 图片上传成功
        uploadFileSuccess(response, file) {
            if (response.status == 200) {
                this.ruleForm.surfacePlot = response.content.resourceUrl;
                this.$nextTick(()=>{
                    this.loading = false;
                    }    
                ); 
            } else {
                this.$message.error(response.message);
            };
        },    
        //获取当前课程诗词信息在编辑时；
        getDataToFrom(data){
            this.selectData = data;
            this.ruleForm= {
                title:data.name,
                surfacePlot:data.backgroundUrl,
                appointedTime:data.appointedTime
            }
        },
        getAddDataToFrom(){
            // backgroundUrl 背景地址
            // appointedTime 指定日期yyyy-MM-dd
            // name	名称        
            var self=this;    
            var params = {
                backgroundUrl:this.ruleForm.surfacePlot,
                appointedTime:formatDate(this.ruleForm.appointedTime),
                name:this.ruleForm.title
            };
            if(!self.disabledState){
                self.disabledState = !self.disabledState;               
                if(this.addOrEditBool=="add"){
                    this.$http.post(this.$server.courseMatchingBackgroundadd,params).then(res=>{
                        if(res.status==200){
                            this.leaveFlag = true;
                            self.disabledState = !self.disabledState;
                            this.$router.push({path: "/smallProgram/pragramImgList"});
                        }
                    }).catch(()=>{
                        self.disabledState = !self.disabledState;
                    })
                }else{
                    this.$http.post(this.$server.courseMatchingBackgroundEdit({id:this.selectData.id}),params).then(res=>{
                        if(res.status==200){
                            this.leaveFlag = true;
                            self.disabledState = !self.disabledState;
                            this.$router.push({path: "/smallProgram/pragramImgList"});
                        }
                    }).catch(()=>{
                        self.disabledState = !self.disabledState;
                    })
                }
            }

        }                                               
    },
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.wrap-pragram .courseDialogCss .el-dialog .el-dialog__body{
    padding: 10px 20px;
}
.wrap-pragram .courseDialogCss .el-dialog .el-dialog__footer{
    text-align: center;
}
</style>
<style lang="scss" scoped>
.wrap-pragram-img{
    padding: 0 20px;
    background: #fff;
    .pragramBox{
        min-height: 600px;
        .radioCss{
            margin-left: 100px;
        }
        .pragramImgBox{
            width: 400px;
            margin-top: 40px;
            padding:0 0 30px 0;
            .imgBox{
                width: 100%;
                img{
                    width: 100%;
                }
            }
            .pragramBut{
                padding: 0 20px;
                cursor: pointer;
            }
        }
    }
}
</style>
<style>
  .wrap-pragram-img .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .wrap-pragram-img .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .wrap-pragram-img .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .wrap-pragram-img .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>



