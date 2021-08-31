<template>
    <div class="H5-creat-course">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>    
        </div>
        <div class="page-content">
            <el-form :model="ruleForm" label-position='left' :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="绑定H5地址ID" prop="addressId">
                    <el-input style='width:80px;' :disabled='editType' v-model="ruleForm.addressId"></el-input>
                </el-form-item>
                <el-form-item label="课程名称" prop="courseName">
                    <el-input  style='width:200px;' v-model="ruleForm.courseName"></el-input>
                </el-form-item>                
                <el-form-item label="课时数量" prop="periodNum">
                    <el-input  style='width:100px;' v-model="ruleForm.periodNum"></el-input>
                </el-form-item> 
                <el-form-item label="上传图片">
                    <div class="uploadBox">
                        <el-upload
                            class="avatar-uploader"
                            :action="actiosService"
                            :show-file-list="false"
                            :headers="myHeaders"
                            :before-upload="(file)=>{return beforeAvatarUpload(file)}"
                            :on-success="(file)=>{return handleAvatarSuccess(file)}"                            
                            >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                        <div style="color:#ccc;margin-left:10px;">尺寸:750*420;图片不能大于1M,支持PNG,JPEG</div>
                    </div>
                    <div class="imgStyle1" v-loading='upLoadList.loadings'>
                        <img v-if='upLoadList.backgroundImg' :src="upLoadList.backgroundImg"/>
                        <i class="el-icon-delete-solid" @click="closeImgIcon()"></i>
                    </div>                                      
                </el-form-item>                               
                <el-form-item label="价   格" >
                    <el-form-item label="" prop="originalPrice">
                        起售价:
                        <el-input  style='width:150px;' placeholder='0.1~10000' v-model="ruleForm.originalPrice"></el-input>
                        <span style='padding:0 10px;font-size12px;'>夫子币</span>
                    </el-form-item>                
                    <el-form-item label="" style="margin-top:20px;" prop="sellingPrice">
                        销售价:
                        <el-input  style='width:150px;' placeholder='0.1~10000' v-model="ruleForm.sellingPrice"></el-input>
                        <span style='padding:0 10px;font-size12px;'>夫子币</span>
                    </el-form-item>
                </el-form-item>                
                <el-form-item style="text-align: center;">
                    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                    <el-button @click="resetForm()">取消</el-button>
                </el-form-item>
            </el-form>  
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
export default {
    data() {      
        const self = this;  
        let valiNumber = (rule, value, callback) => {
            value = value + "";
            switch (rule.fullField) {
                case "addressId":
                    if (value === "") {
                        callback(new Error("H5不能为空"));
                        break;
                    } else if (!/^\d+$/.test(value)) {
                        callback(new Error("格式错误"));
                        break;
                    } 
                    else if (Number(value) < 1 || Number(value) >5) {
                        callback(new Error("H5ID范围错误1~5"));
                    }
                    break;
                case "periodNum":
                    if (value === "") {
                        callback(new Error("课时数量不能为空"));
                    } else if (!/^[1-9]\d*$/.test(value)){
                        callback(new Error("请输入正整数。"))
                    }else {
                        callback(); 
                    }
                    break;
                case "courseName":
                    if (value === "") {
                        callback(new Error("课程名称不能为空"));
                    } else {
                        callback(); 
                    }
                    break;
                case "sellingPrice":
                        if (value === "") {
                            callback(new Error("销售价不能为空"));
                        } else if (
                            /^\d+\.\d+$/.test(Number(value).toString()) &&
                            Number(value)
                                .toString()
                                .split(".")[1].length > 2
                        ) {
                            callback(new Error("请保留两位小数"));
                        } else if (
                            Number(value) < 0.1 ||
                            Number(value) > 10000.01
                        ) {
                            callback(new Error("格式错误(0.1~10000)"));
                        }else if(self.ruleForm.originalPrice!==''&&Number(value)>self.ruleForm.originalPrice){
                            callback(new Error("价格需要小于划价"));
                        }else{
                            callback(); 
                        }
                    
                    break;
                case "originalPrice":
                        if (value === "") {
                            callback(new Error("划价不能为空"));
                        } else if (
                            /^\d+\.\d+$/.test(Number(value).toString()) &&
                            Number(value)
                                .toString()
                                .split(".")[1].length > 2
                        ) {
                            callback(new Error("请保留两位小数"));
                        } else if (
                            Number(value) < 0.1 ||
                            Number(value) >= 10000.01
                        ) {
                            callback(new Error("格式错误(0.1~10000)"));
                        }else if(self.ruleForm.sellingPrice!==''&&Number(value)<Number(this.ruleForm.sellingPrice)){
                             callback(new Error("划价需要大于价格"));
                        }
                    break;                            
                default:
                    break;
            }
            callback();
        };
        return {
            myHeaders: {token: getToken()},
            courseId:'',
            titleList:[],       
            ruleForm: {
                addressId: '',
                courseName: '',
                periodNum: '',
                originalPrice: '',
                sellingPrice: ''
            },
            rules: {
                addressId: [{ validator: valiNumber, trigger: "blur"}],
                courseName: [
                   { validator: valiNumber, trigger: "blur"}
                ],
                periodNum: [{ validator: valiNumber, trigger: "blur"}],
                originalPrice: [{ validator: valiNumber, trigger: "blur"}],
                sellingPrice: [{ validator: valiNumber, trigger: "blur"}]
            },
            upLoadList:{
                loadings:false,
                backgroundImg:'',
                title:''                
            },
            activityId:'',
            editType:false,
            copyObjs:{},
            leaveDialogVisible:false,
            leaveFlag:false,
            leavePath:''
        };
    },
    metaInfo: {},
    components: {
        breadcrumb
    },
    watch: {},
    computed:{
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }   
    },
    created() {
         this.courseId = this.$route.query.id;
         this.activityId = this.$route.query.activityId;
         this.titleList=[
                {
                    name:'H5课程管理',
                    pathInfo:''
                },   
                {
                    name:'H5课程',
                    pathInfo:'/H5WebView/index'
                },
                {
                    name:'创建H5课程',
                    pathInfo:'/H5WebView/H5Creat/'+this.activityId
                }                                  
            ];         
         if(this.courseId){
             this.editType = true;
             this.titleList.push(
                {
                    name:'编辑课程',
                    pathInfo:''
                }
             );
             this.getH5CourseData();
         }else{
             this.editType = false;
             this.copyObjs = Object.assign({},this.ruleForm);
             this.titleList.push(
                {
                    name:'创建课程',
                    pathInfo:''
                }
             );
         }
    },
    beforeRouteLeave(to, from, next) {
        if(this.leaveFlag){
            setTimeout(()=>{
                next();
            },100)
            return;
        }
        this.leavePath = to.fullPath;
        if (JSON.stringify(this.copyObjs) != JSON.stringify(this.ruleForm)) {
            this.leaveDialogVisible = true;
            next(false)
            return;
        } else {
            next();
        }
    },    
    methods: {
            leavePage(){
                this.leaveFlag = true;
                this.leaveDialogVisible = false;
                this.$router.push(this.leavePath);
            },        
            //index
            handleAvatarSuccess(file) {
                this.upLoadList.backgroundImg =file.content.resourceUrl;
                this.upLoadList.loadings = false;
            },
            //,index,type
            beforeAvatarUpload(file) {
                this.upLoadList.loadings = true;
                const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
                let isLt2M=0;
                // if(type==3||type==4){
                    isLt2M = file.size / 1024 / 1024 < 1.001;
                    if (!isLt2M) {
                        this.$message.error('上传图片大小不能超过 1m!');
                    }                     
                // }
                // const isLt2M = file.size / 1024 / 1024 < 0.201;
                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
                }
                // if (!isLt2M) {
                // this.$message.error('上传图片大小不能超过 200k!');
                // }            
                const isSize = new Promise(function(resolve, reject) {
                                // let width = (type==1||type==2)?750:1536;
                                // let height = (type==1||type==2)?212:228;
                                let width = 750;
                                let height = 420;
                                let _URL = window.URL || window.webkitURL;
                                let img = new Image();
                                img.onload = function() {
                                    let valid = img.width == width && img.height==height;
                                    valid ? resolve() : reject();
                                }
                                img.src = _URL.createObjectURL(file);
                            }).then(() => {
                                this.upLoadList.loadings = false;
                                return file;
                            }, () => {
                                this.upLoadList.loadings = false;
                                // this.$message.error('上传的图片尺寸:'+(type==1||type==2)?750*212:1536*228)+'.'
                                this.$message.error('上传的图片尺寸:750*420')
                                return Promise.reject();
                    });
                // if(type==3||type==4){
                    return isJPG && isLt2M && isSize;
                // }else{
                    // return isJPG && isSize;
                // }
            },
        submitForm(formName) {
            if(!this.upLoadList.backgroundImg.length>0){
                this.$message.error('请上传图片')
                return;
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.setCourseInfo();
                }
            });
        },
        resetForm() {
            this.$router.go(-1);
        },
        getH5CourseData(){
                this.$http.get(this.$server.h5Course+this.courseId).then(res=>{
                    if(res.status==200){
                        let data = res.content;
                        this.ruleForm= {
                            addressId: data.addressId,
                            courseName: data.courseName,
                            periodNum: data.periodNum,
                            originalPrice: data.originalPrice,
                            sellingPrice: data.sellingPrice
                        }; 
                        this.upLoadList.backgroundImg=data.backgroundImg;  
                        this.copyObjs = Object.assign({},this.ruleForm);                                         
                    }
                })                
        },
        setCourseInfo(){
            let url='';
            let query= {
                courseName:this.ruleForm.courseName,
                backgroundImg:this.upLoadList.backgroundImg,
                addressId:this.ruleForm.addressId,
                periodNum:this.ruleForm.periodNum,
                originalPrice:this.ruleForm.originalPrice,
                sellingPrice:this.ruleForm.sellingPrice
            }
            if(this.courseId){
                // query['id']=this.courseId;
                url = this.$server.h5ModifyCourse+this.courseId;
            }else{
                query['activityId']=this.activityId;
                url = this.$server.h5courses;
            }
            this.$http.post(url,query).then(res=>{
                if(res.status==200){
                    this.$message.success(this.courseId?"修改成功":"创建成功!"); 
                    this.leaveFlag = true;
                    // this.$router.push(`/H5WebView/H5Creat/${this.activityId}`)      
                    if(this.editType){
                        this.$router.push(`/H5WebView/H5SectionNew/${this.courseId}/${this.activityId}`); 
                    }else{
                        this.$router.push(`/H5WebView/H5SectionNew/${res.content}/${this.activityId}`); 
                    }           
                }
            })            
        },
    }
};
</script>

<style scoped lang="scss">
    .H5-creat-course {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            padding: 20px;
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
            .imgStyle1{
                position: relative;
                width: 200px;
                height: 112px;
                background: #f4f4f4;
                margin: 20px 0px;
                img{
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                i{
                    position: absolute;
                    right: -20px;
                    font-size: 14px;
                    top:0
                }            
            }
        }        
    }
</style>

