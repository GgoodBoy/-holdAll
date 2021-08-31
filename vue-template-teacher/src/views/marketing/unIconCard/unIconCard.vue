<template>
<div>
    <!-- <el-row v-show="!boolpluginForDetail"> -->
    <el-row>
        <el-col class="lLeft-r">
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </el-col>    
        <el-col class="lMarginTop30">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="名称:" prop="name" style="width:40%">
                    <el-input v-model="ruleForm.name"                     
                        maxlength="16"
                        show-word-limit ></el-input>
                        <!-- <div class="flexDiv">{{ruleForm.name.length||0}}/16</div> -->
                </el-form-item>
                <!-- <el-form-item label="课程">
                    <el-row>
                        <el-col :span="3">
                            <el-button class="lButtom" @click="curseclick">选择课程</el-button>
                        </el-col>
                        <el-col :span="6" class="lLeft-r redFontColor">
                            已选择{{courseList.length>0?courseList.length:0}}门课程
                        </el-col>                        
                        <el-col :span="6" class="lLeft-r redFontColor" v-show="couserBool">
                            *请添加课程
                        </el-col>
                    </el-row>  
                </el-form-item>         -->
                <el-form-item label="IOS价格:">
                        <p class="butColor">{{ruleForm.iosPrice||iosMoney}}元</p>
                </el-form-item>  
                <el-form-item label="安卓:">
                        <p class="butColor">{{ruleForm.andriodPrice||androidMoney}}元</p>
                </el-form-item>    
                <el-form-item label="背景图:">
                        <p class="form-hint">1035*585像素，支持PNG、JPG格式，小于1M</p>
                        <el-upload class="avatar-uploader"
                                    :action="action"
                                    :headers="commonHeader"
                                    :before-upload="(file)=>{return beforeUpload(file,[1035,585])}"
                                    :show-file-list="false"
                                    :on-error="uploadFileError"
                                    :on-success="uploadFileSuccess">
                            <img v-if="ruleForm.backgroundUrl"
                                    :src="ruleForm.backgroundUrl"
                                    class="avatar">
                            <i v-else
                                class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <p class="lSize12 butColor" v-if="ruleForm.backgroundUrl.length>0?false:true">*请上传背景图</p>
                </el-form-item>     
                <el-form-item label="会员说明" prop="equityDesc">
                    <el-input type="textarea" style="width:300px;" placeholder="最多不超过300个字" maxlength="300" :rows="4" v-model="ruleForm.equityDesc"></el-input>
                    <span>{{ruleForm.equityDesc.length}}/300</span>
                </el-form-item>                
                <el-form-item class="lMarginTop50 lCenter-r" style="width:40%">
                    <el-button @click="resetEven()">取消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                </el-form-item>
            </el-form>        
        </el-col>
    </el-row>    
    <!-- 选择课程 -->
    <!-- <courseselect  :urlPorp="urls" :chooseIdlist="ruleForm.courseIds" v-if="boolpluginForDetail"  :filterType="filterType" v-on:listSelect="listSelectEven"></courseselect>     -->
</div>
   
</template>
<script>
import { getToken } from '@/utils/auth';
// import courseselect from "@/components/Appconfigpage/ACourseSelect/coursesselect"; //推存选择课程组件
import courseselect from "@/components/Appconfigpage/ACourseSelect/courseNewPluge"; //推存选择课程组件
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
     data(){
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) { }
        };            
        return {
                action:'',
                commonHeader:{},
                iosMoney:'',
                androidMoney:'',
                // urls:'/course/getOurCoursesUse',
                editStartBool:true,
                // filterType:false,
                ruleForm: {
                    id:'',
                    name: '',
                    equityDesc:'',
                    backgroundUrl:'',
                    andriodPrice:10,
                    iosPrice:10,
                    // courseIds:[],
                },
                channelArr:[],                
                rules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
                    ],
                    equityDesc: [
                        { required: true, message: '请填写会员权益', trigger: 'blur' }
                    ],                               
                },
                titleList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'月度会员卡定制系统',
                            pathInfo:'/marketelist/member/unIconCardList'
                        },
                        {
                            name:'创建会员卡定制版',
                            pathInfo:''
                        }


                ],
                editAdd:'',
                moneyList:[],
                couserBool:false, 
                disabledState:false
                // courseList:[]          
            };
            },
            created() {
                this.commonHeader = {
                    token: getToken()
                };                
                this.action = this.$server.actionImgOrvideo;
                this.editAdd = this.$route.query["addOrEdit"];
                this.getMemberMoneyTypeList();
                if(this.editAdd=='edit'){
                    var formData = this.$route.query["data"];
                    this.ruleForm= {
                        id:formData.id,
                        name: formData.memberName,
                        equityDesc:formData.equityDesc,
                        backgroundUrl:formData.backgroundUrl,
                        andriodPrice:formData.androidPrice,
                        iosPrice:formData.iosPrice,
                        // courseIds:formData.courseIds.indexOf(',')>-1?formData.courseIds.split(","):[formData.courseIds]
                    }
                    // this.courseList = this.ruleForm.courseIds;               
                }
            },
            computed:{
                // boolpluginForDetail(){
                //     return this.$store.state.appConfig.appStore.boolpluginForDetail
                // }        
            },            
            components:{
                breadcrumb,
                courseselect
            },            
            methods: {
                // curseclick(){
                //     this.$store.state.appConfig.appStore.boolpluginForDetail=true;
                // },                
                //文件上传失败
                uploadFileError(err, file, fileList) {
                    if (err.message) {
                        try {
                            let msg = JSON.parse(err.message).message;
                            this.$message.error(msg);
                            return;
                        } catch (e) {}
                    }
                    this.$message.error(JSON.stringify(err));
                },   
                // listSelectEven(data){
                //     var self = this;
                //     self.ruleForm.courseIds = [];
                //     self.$store.state.appConfig.appStore.boolpluginForDetail=false;
                //     self.courseList = data.datas;
                //     if(self.courseList.length){
                //         self.couserBool = false;
                //     }
                //     data.datas.forEach(element => {
                //         self.ruleForm.courseIds.push(JSON.stringify(element.content));
                //     });
                // },                             
                // 图片文件上传
                beforeUpload(file,size) {
                        var self = this;
                        this.loading = true;
                        const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
                        const isLt2M = file.size / 1024 / 1024 < 1;
                        if (!isJPG) {
                            this.loading = false;
                            this.$message.error('上传头像图片只能是 JPG 格式!');
                        }
                        if (!isLt2M) {
                            this.loading = false;
                            this.$message.error('上传头像图片最大为1M!');
                        }
                        const isSize = new Promise(function(resolve, reject) {
                            let width = size[0];
                            let height = size[1];
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
                            this.loading = false;
                            this.$message.error('上传的图片必须是等于'+size[0]+'*'+size[1]+'!');
                            return Promise.reject();
                        });
                        return isJPG && isLt2M && isSize;                 
                        
                },  
                // 图片上传成功
                uploadFileSuccess(response, file) {
                    if (response.status == 200) {
                        this.ruleForm.backgroundUrl = response.content.resourceUrl;
                    } else {
                        this.$message.error(response.message);
                    }
                },            
                submitForm(formName) {
                    var self = this;
                    var obj2 = {};
                    self.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(!self.ruleForm.backgroundUrl.length>0){
                            return;
                        }  
                        // if(!self.ruleForm.courseIds.length>0){
                        //     self.couserBool = true;
                        //     return;
                        // }                                      
                        $.extend( true, obj2, self.ruleForm );         
                        // obj2.courseIds = obj2.courseIds.toString();
                        var parems = {
                                memberName:self.ruleForm.name,
                                backgroundUrl:self.ruleForm.backgroundUrl,
                                // courseIds:obj2.courseIds,
                                equityDesc:self.ruleForm.equityDesc,
                        }
                        var url = '';
                        if(self.editAdd=='edit'){
                            url=self.$server.editMonthMember({id:self.ruleForm.id})
                        }else{
                            url = self.$server.addMonthMember;
                        }
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;
                            self.$http.post(url,parems).then(res=>{
                                if(res.status==200){
                                        self.disabledState = !self.disabledState;
                                        self.ruleForm = {};
                                        self.$router.push({path:"/marketelist/member/unIconCardList"});
                                }
                            }).catch(()=>{
                                self.disabledState = !self.disabledState;
                            });                            
                        } 
                    } else {
                        return false;
                    }
                    });
                },
                getMemberMoneyTypeList(){
                        var self = this;
                        self.$http.get(self.$server.memberMemberPrice).then(res=>{
                            if(res.status==200){
                                self.moneyList = res.content;
                                if(this.editAdd=="add"&&self.editStartBool){
                                        self.editStartBool = false;
                                        self.iosMoney=this.moneyList[0][0];
                                        self.androidMoney=this.moneyList[0][1];
                                }
                            }
                        });
                },
                resetEven() {
                    this.$router.push(`/marketelist/member/unIconCardList`);
                }             
     }
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .flexDiv{
        position: absolute;
        right: -50px;
        bottom:0;
        color: #ADADAD;
    }
</style>


