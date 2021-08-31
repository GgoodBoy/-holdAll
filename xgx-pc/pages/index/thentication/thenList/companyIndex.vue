<template>
    <div class="company-page">
        <div class="container" v-loading="loading" v-if="finished">
            <p class="page-title">机构信息</p>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px" class="demo-ruleForm">
                <div style="width:800px;">
                    <el-form-item label="机构名称" prop="mechanismName">
                        <template v-if="authStatus==0">
                            <el-input v-model="ruleForm.mechanismName" placeholder="机构名称限50个字以内" maxlength="50"></el-input>
                            <p class="num">{{ruleForm.mechanismName.length}}/50</p>
                        </template>
                        <template v-else>
                            <p class="name">{{ruleForm.mechanismName}}</p>
                            <p class="auth-status">
                                <span v-if="authStatus==1">认证中</span>
                                <span v-else-if="authStatus==2">已认证</span>
                                <span v-else-if="authStatus==3">拒绝</span>
                                <span v-else-if="authStatus==4">更新中</span>
                            </p>
                        </template>
                    </el-form-item>
                    <el-form-item label="机构简介" prop="synopsis">
                        <template v-if="authStatus==0">
                            <el-input type="textarea" maxlength="200" :autosize="{ minRows: 6}" resize="none" v-model="ruleForm.synopsis"></el-input>
                            <p class="num">{{ruleForm.synopsis.length}}/200</p>
                        </template>   
                        <template v-else>
                            <p>{{ruleForm.synopsis}}</p>
                        </template> 
                    </el-form-item>
                    <el-form-item label="联系人" prop="contacts">
                        <template v-if="authStatus==0">
                            <el-input maxlength="10" placeholder="限10个字以内" v-model="ruleForm.contacts"></el-input>
                        </template>
                        <template v-else>
                            <p>{{ruleForm.contacts}}</p>
                        </template> 
                    </el-form-item>
                    <el-form-item label="联系方式" prop="tellphone">
                        <template v-if="authStatus==0">
                            <el-input maxlength="11" placeholder="11位手机号码" v-model="ruleForm.tellphone"></el-input>
                        </template>
                        <template v-else>
                            <p>{{ruleForm.tellphone}}</p>
                        </template> 
                    </el-form-item>
                </div>
                <el-form-item label="营业执照注册号" prop="businessLicenseNo" class="businessLicenseNo">
                    <template v-if="authStatus==0">
                        <el-input v-model="ruleForm.businessLicenseNo"></el-input>
                    </template>
                    <template v-else>
                        <p>{{ruleForm.businessLicenseNo}}</p>
                    </template> 
                </el-form-item>     
                <el-form-item label="营业执照"
                                prop="businessLicenseImg" class="businessLicenseImg">
                    <template v-if="authStatus==0">
                        <div class="upload-box"  @click="uploadEvent" v-loading="imgLoading">
                            <el-upload class="avatar-uploader"
                                action=""
                                ref="businessLicenseImg"
                                :http-request="(file)=>{return UploadImage(file)}"
                                :show-file-list="false"></el-upload>
                            <img v-if="ruleForm.businessLicenseImg" :src="ruleForm.businessLicenseImg" class="avatar">
                            <i class="icon"></i>
                        </div>
                        <p class="re-btn" v-show="ruleForm.businessLicenseImg" @click="uploadEvent()">重新上传</p>
                        <p class="tips2">支持PNG、JPG格式，大小小于5M</p>
                    </template>
                    <template v-else>
                            <div class="upload-box">
                                <img v-if="ruleForm.businessLicenseImg" :src="ruleForm.businessLicenseImg" class="avatar">
                            </div>
                        </template>        
                </el-form-item>  
                <el-form-item label="拒绝原因" class="reason" v-if="authStatus==3">
                    <template>
                        <p>{{ruleForm.reason}}</p>
                    </template>  
                </el-form-item>                    
                <el-form-item>
                    <template v-if="authStatus==0">
                        <el-button type="primary" @click="submitForm('ruleForm')">提交认证</el-button>
                        <el-button @click="resetForm()">取消</el-button>
                    </template>  
                    <template v-if="authStatus==2||authStatus==3">
                        <el-button @click="authStatus=0" >修改</el-button>
                    </template>  
                </el-form-item>
            </el-form>            
        </div>
    </div>
</template>
<script lang="ts">
import { Component , Vue,Watch} from 'vue-property-decorator'
import {mapState,mapActions} from 'vuex';
import {delCookie,getCookie} from '../../../../utils/cache.js';
import { constants } from 'fs';
@Component({
  name:'companyIndex',
  computed:{
    ...mapState(['userData'])
    }
})
export default class Personal extends Vue{
    authStatus = 0
    oldAuthStatus = ''
    loading = false;
    finished = false;
    imgLoading = false;
    oldRuleForm:any = {}
    ruleForm:any={
        mechanismName: '',
        synopsis: '',
        contacts: '',
        tellphone: '',
        businessLicenseNo: '',
        businessLicenseImg: '',
        id:'',
        reason:''
    }
    rules:any={
        mechanismName: [
            { required: true, min: 1, max: 50,message: '请输入机构名称', trigger: 'blur' },
        ],
        synopsis: [
            { required: true, min:1, message: '请输入机构简介', trigger: 'change' }
        ],
        contacts: [
            { required: true, min:1, message: '请输入联系人', trigger: 'blur' }
        ],
        tellphone: [
            { min:1, required: true, message: '请输入联系电话', trigger: 'blur' },
            { validator: (rule:any, value:any, callback:any)=>{
                if(value.length!=11){
                    return callback(new Error('请输入正确的电话号码'));
                }else{
                    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
                    if (!myreg.test(value)) {
                        return callback(new Error('请输入正确的电话号码'));
                    } else {
                        callback();
                    }
                }
            }, trigger: 'blur' }
        ],
        businessLicenseNo: [
            { required: true, message: '请输入营业执照注册号', trigger: 'blur' }
        ],
        businessLicenseImg: [
            { required: true, min: 1, message: '请上传营业执照', trigger: 'blur' }
        ]       
    }
    editFlag = false;
    timer:any= null 
    @Watch('ruleForm',{deep:true})
        onRuleFormChanged(){
            this.editFlag = true;
        }
    created(){
        
    }
    mounted(){
        if(this.userData.userId){
            this.getVerifityMechan();
            window.addEventListener('message', (e) => {
                if (e.data === 'getMsg') {
                    clearInterval(this.timer);
                    console.log('我被清除了')
                    this.$router.replace('/thentication')
                }
            });
            setTimeout(()=>{
                this.finished = true;
            },1)
        }else{
            this.$router.replace('/thentication')
        }
    }
    uploadEvent(){
        this.$refs.businessLicenseImg.$el.querySelector('.el-upload').click()
    }
    UploadImage(param:any,type:string){
        const isJPG = (param.file.type === 'image/png'||param.file.type ==='image/jpeg'||param.file.type ==='image/jpg')?true:false;
        const isLt2M = param.file.size / 1024 / 1024 < 5.001;
        if (!isJPG) {
            this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
            return;
        }
        if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 5M!');
            return;
        }           
        this.imgLoading = true;
        const formData = new FormData()
        formData.append('file', param.file)
        formData.append('userId',this.userData.userId);
        formData.append('imgType', 2)
        let xhr = new XMLHttpRequest();    
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState==4){
                if(xhr.status==200){
                    const res = JSON.parse(xhr.response)
                    if(res.status==200){
                        const ruleForm:any = this.$refs['ruleForm'];
                        this.ruleForm.businessLicenseImg = res.content.resourceAbsoluteUrl;
                        this.imgLoading = false;
                        this.$nextTick(()=>{
                            ruleForm.validateField(type);
                        })
                    }else{
                        this.$message.error('上传失败');
                        this.loading = false;
                    }
                }
            }
        }
        xhr.open('POST',this.$server.uploadForOSS,true);
        xhr.setRequestHeader("token",this.userData.token); 
        xhr.setRequestHeader("userId",this.userData.userId);
        xhr.send(formData);
    }     
    submitForm(formName:string) {
        const refsform:any = this.$refs[formName];
        refsform.validate((valid:any) => {
            if (valid) {
                this.getMechanismNums();
            } else {
                return false;
            }
        });
    }
    resetForm() {
        this.$confirm('是否立即保存当前修改', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
            center:true
        }).then(() => {
            this.submitForm('ruleForm')
        }).catch(() => {
            if(this.oldAuthStatus==0){
                this.$router.go(-1)
            }else{
                this.authStatus = this.oldAuthStatus;
                this.ruleForm = Object.assign({},this.oldRuleForm)
            } 
        });
    }
    async getMechanismNums(){
        let user =  getCookie('xgx_user')?JSON.parse( getCookie('xgx_user')):null;
        this.loading = true;
        let query = {
            userId:user.userId,
            mechanismName:this.ruleForm.mechanismName,
            synopsis: this.ruleForm.synopsis,
            type: 1,
            contacts: this.ruleForm.contacts,
            tellphone: this.ruleForm.tellphone,
            businessLicenseNo: this.ruleForm.businessLicenseNo,
            businessLicenseImg: this.ruleForm.businessLicenseImg,
            id:this.ruleForm.id
        }
        let res=await this.$axios.$post(this.$server.saveMechanism,query)
        this.loading = false;
        if(res.status==200){
            this.$message.success('已提交认证，请等待审核');
            this.authStatus = 1;
        }
    }
    async getVerifityMechan(){
        let user =  getCookie('xgx_user')?JSON.parse( getCookie('xgx_user')):null;
        if(user){
            this.loading = true;
            let query = {
                userId:user.userId
            }
            let res=await this.$axios.$post(this.$server.getVerifityMechanism,query)
            this.loading = false;
            if(res.status==200){
                const data = res.content;
                this.authStatus = data.authStatus||0;
                this.oldAuthStatus = data.authStatus||0;
                this.ruleForm={
                    mechanismName: data.mechanismName||'',
                    synopsis: data.synopsis||'',
                    contacts: data.contacts||'',
                    tellphone: data.tellphone||'',
                    businessLicenseNo:data.businessLicenseNo||'',
                    businessLicenseImg: data.businessLicenseImg||'',
                    id:data.id||'',
                    reason:data.reason||''
                }
                this.oldRuleForm = Object.assign({},this.ruleForm)
                if(res.content.id){
                    if(res.content.isExistence==1){
                        if(res.content.status==1){
                            let win:any = window.open('https://scugc.youfushuyuan.com/platform/waiting');
                            let query = JSON.stringify({userId:this.userData.userId})
                            this.timer = setInterval(() => {
                                win.postMessage(query, 'https://scugc.youfushuyuan.com/platform/waiting');
                                console.log('我在发消息')
                            }, 2000);
                        }else{
                            this.$message.error('当前机构账号已被禁用，请联系客服解封账号')
                            this.authStatus = 5;
                        }
                    }
                }
                setTimeout(()=>{
                    this.editFlag = false;
                },300)
            }            
        }else{
            this.$router.replace('/thentication')
        }
    }    
}
</script>
<style lang="scss" scoped>
    .company-page{
        padding: 30px 20px 50px;
        background: #FFF;
        .container{
            width: 1200px;
            padding: 0 42px;
            margin: auto;
            .page-title{
                font-size: 16px;
                font-weight: bold;
                color:#C30D20;
            }
            /deep/ .el-form{
                .el-form-item{
                    margin:40px 0;
                    &.reason{
                        color:#C30D20;
                        .el-form-item__label{
                            color:#C30D20;
                        }
                    }
                    &.businessLicenseImg{
                        .upload-box{
                            width: 133px;
                            height: 190px;
                            border-radius: 6px;
                            border:1px solid #e5e5e5;
                            position: relative;
                            overflow: hidden;
                            background: #fcfcfc;
                            display: inline-block;
                            vertical-align: bottom;
                            .icon{
                                position: absolute;
                                top:50%;
                                left: 50%;
                                display: block;
                                width: 44px;
                                height: 37px;
                                transform:translate(-50%,-50%);
                                z-index: 1;
                                background: url('../../../../assets/images/pic.png')no-repeat 50% 50% / cover;
                            }
                            img{
                                position: absolute;
                                top:50%;
                                left: 50%;
                                z-index: 2;
                                max-width: 100%;
                                transform:translate(-50%,-50%);
                            }
                        }
                        .re-btn{
                            color:#333;
                            line-height: 19px;
                            font-size: 14px;
                            cursor: pointer;
                            text-decoration: underline;
                            display: inline-block;
                            vertical-align: bottom;
                            margin-left: 15px;
                        }
                        .tips2{
                            line-height: 19px;
                            font-size: 14px;
                            color:#999;
                            display: block;
                            margin:10px 0 10px 0;
                        }
                    }
                    &.businessLicenseNo{
                        position: relative;
                        .el-form-item__label{
                            line-height: 20px;
                            margin-top:10px;
                            text-align: left;
                            text-align-last:auto;
                        }
                    }
                    .el-form-item__label{
                        position: relative;
                        font-weight: bold;
                        text-align: justify;
                        text-align-last: justify;
                        margin-right: 25px;
                        color:#333;
                        padding:0 0 0 2px;
                        &::before{
                            position: absolute;
                            left: -10px;
                            top:2px;
                        }
                    }
                    .el-form-item__content{
                        margin-left: 88px!important;
                        .el-textarea__inner,.el-textarea{
                            width: 442px;
                            background: #FCFCFC;
                            &.el-textarea__inner{
                                padding: 5px 10px;
                            }
                        }
                    }
                    .el-input{
                        width: 442px;
                        display: inline-block;
                        vertical-align: middle;
                        .el-input__inner{
                            width: 442px;
                            padding: 0 10px;
                            background: #FCFCFC;
                        }
                    }
                    .el-button{
                        padding: 11px 47px;
                    }
                    .el-button+.el-button{
                        padding: 11px 63px;
                        margin-left: 20px;
                    }
                    .auth-status,.name{
                        display: inline-block;
                        vertical-align: middle;
                        &.auth-status{
                            margin-left: 40px;
                            color:#C30D20;
                        }
                    }
                }
                .num{
                    display: inline-block;
                    vertical-align: middle;
                    color:#666666;
                    margin:0 20px 0 10px;
                }
            }
        }
    }
</style>


