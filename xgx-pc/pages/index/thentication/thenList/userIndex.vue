<template>
    <div class="users-page">
        <div class="container" v-loading="loading" v-if="finished">
            <p class="page-title">个人信息</p>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px" class="demo-ruleForm">
                <div style="width:800px;">
                    <el-form-item label="真实姓名" prop="mechanismName">
                        <template v-if="authStatus==0">
                            <el-input v-model="ruleForm.mechanismName" placeholder="姓名限50个字以内" maxlength="50" ></el-input>
                            <p class="num">{{ruleForm.mechanismName.length}}/50</p>
                        </template>
                        <template v-else>
                            <p class="name">{{ruleForm.mechanismName}}</p>
                            <p class="auth-status">
                                <span v-if="authStatus==1">认证中</span>
                                <span v-else-if="authStatus==2"><i class="authed"></i>已认证</span>
                                <span v-else-if="authStatus==3">拒绝</span>
                                <span v-else-if="authStatus==4">更新中</span>
                            </p>
                        </template>
                    </el-form-item>
                    <el-form-item label="个人简介" prop="synopsis">
                        <template v-if="authStatus==0">
                            <el-input type="textarea" placeholder='个人简介限200字以内' maxlength="200"  resize="none" :autosize="{ minRows: 6}"  v-model="ruleForm.synopsis"></el-input>
                            <p class="num">{{ruleForm.synopsis.length}}/200</p>
                        </template>
                        <template v-else>
                            <p>{{ruleForm.synopsis}}</p>
                        </template>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idCard">
                        <template v-if="authStatus==0">
                            <el-input maxlength="18" v-model="ruleForm.idCard"></el-input>
                        </template>
                        <template v-else>
                            <p>{{ruleForm.idCard}}</p>
                        </template>
                    </el-form-item>  
                    <el-form-item label="身份证上传" prop="idCardImgFront"  class="idCard front">
                        <template v-if="authStatus==0">
                            <div class="upload-box" v-loading="londList['idCardImgFront']" @click="uploadEvent('idCardImgFront')">
                                <el-upload class="avatar-uploader"
                                    action=""
                                    ref="idCardImgFront"
                                    :http-request="(file)=>{return UploadImage(file,'idCardImgFront')}"
                                    :show-file-list="false"></el-upload>
                                <img v-if="ruleForm.idCardImgFront" :src="ruleForm.idCardImgFront" class="avatar">
                                <i class="icon"></i>
                            </div>
                            <div class="form-tips">
                                <p class="re-btn" v-show="ruleForm.idCardImgFront" @click="uploadEvent('idCardImgFront')">重新上传</p>
                                <p class="tips1">身份证头像图</p>
                                <p class="tips2">支持PNG、JPG格式，大小小于5M</p>
                            </div>
                        </template>  
                        <template v-else>
                            <div class="upload-box">
                                <img v-if="ruleForm.idCardImgFront" :src="ruleForm.idCardImgFront" class="avatar">
                            </div>
                        </template>  
                    </el-form-item>     
                    <el-form-item label="" prop="idCardImgBack" class="idCard back">
                        <template v-if="authStatus==0">
                            <div class="upload-box" v-loading="londList['idCardImgBack']" @click="uploadEvent('idCardImgBack')">
                                <el-upload class="avatar-uploader"
                                    action=""
                                    ref="idCardImgBack"
                                    :http-request="(file)=>{return UploadImage(file,'idCardImgBack')}"
                                    :show-file-list="false"></el-upload>
                                <img v-if="ruleForm.idCardImgBack" :src="ruleForm.idCardImgBack" class="avatar">
                                <i class="icon"></i>
                            </div>
                            <div class="form-tips">
                                <p class="re-btn" v-show="ruleForm.idCardImgBack" @click="uploadEvent('idCardImgBack')">重新上传</p>
                                <p class="tips1">身份证国徽面</p>
                                <p class="tips2">支持PNG、JPG格式，大小小于5M</p>
                            </div>
                        </template>
                        <template v-else>
                            <div class="upload-box">
                                <img v-if="ruleForm.idCardImgBack" :src="ruleForm.idCardImgBack" class="avatar">
                            </div>
                        </template>      
                    </el-form-item>     
                    <el-form-item label="手持身份证照片"  prop="holdIdCardImg" class="idCard hold">
                        <template v-if="authStatus==0">
                            <div class="upload-box" v-loading="londList['holdIdCardImg']" @click="uploadEvent('holdIdCardImg')">
                                <el-upload class="avatar-uploader"
                                    action=""
                                    ref="holdIdCardImg"
                                    :http-request="(file)=>{return UploadImage(file,'holdIdCardImg')}"
                                    :show-file-list="false"></el-upload>
                                <img v-if="ruleForm.holdIdCardImg" :src="ruleForm.holdIdCardImg" class="avatar">
                                <i class="icon"></i>
                            </div>
                            <div class="form-tips">
                                <p class="re-btn" v-show="ruleForm.holdIdCardImg" @click="uploadEvent('holdIdCardImg')">重新上传</p>
                                <p class="tips2">支持PNG、JPG格式，大小小于5M</p>
                            </div>
                        </template>
                        <template v-else>
                            <div class="upload-box">
                                <img v-if="ruleForm.holdIdCardImg" :src="ruleForm.holdIdCardImg" class="avatar">
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
                            <el-button @click="resetForm('ruleForm')" >取消</el-button>
                        </template>
                        <template v-if="authStatus==2||authStatus==3">
                            <el-button @click="authStatus=0" >修改</el-button>
                        </template>
                    </el-form-item>
                </div>
            </el-form>            
        </div>
    </div>
</template>
<script lang="ts">
import { Component , Vue} from 'vue-property-decorator'
import {mapState,mapActions} from 'vuex';
import {delCookie,getCookie} from '../../../../utils/cache.js';
@Component({
  name:'companyIndex',
  computed:{
        ...mapState(['userData'])
    }
})
export default class Personal extends Vue{
    finished = false;
    authStatus = 0
    oldAuthStatus = 0
    loading = false;
    oldRuleForm:any = {}
    ruleForm:any={
        mechanismName: '',
        synopsis: '',
        idCard: '',
        idCardImgFront: '',
        idCardImgBack: '',
        holdIdCardImg: '',
        id:''
    }
    rules:any={
        mechanismName: [
            { required: true, min: 1, max: 50,message: '请输入姓名', trigger: 'blur' },
        ],
        synopsis: [
            { required: true, min:1, message: '请输入个人简介', trigger: 'change' }
        ],
        idCard: [
            { min:1, required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        idCardImgFront: [
            { required: true, min: 1, message: '请上传身份证正面', trigger: 'blur' }
        ],
        idCardImgBack: [
            { required: true, min: 1, message: '请上传身份证反面', trigger: 'blur' }
        ],
        holdIdCardImg: [
            { required: true, min: 1, message: '请上传手持身份照片', trigger: 'blur' }
        ]          
    }
    londList:any={
        'idCardImgFront':false,
        'idCardImgBack':false,
        'holdIdCardImg':false,
    };   
    timer:any= null 
    created(){
              
    }
    mounted(){
        console.log(this.userData)
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
    uploadEvent(flag){
        this.$refs[flag].$el.querySelector('.el-upload').click()
    }
    UploadImage(param:any,type:string){
        this.londList[type] = true;
        const isJPG = (param.file.type === 'image/png'||param.file.type ==='image/jpeg'||param.file.type ==='image/jpg')?true:false;
        const isLt2M = param.file.size / 1024 / 1024 < 5.001;
        if (!isJPG) {
            this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
            this.londList[type] = false;
            return;
        }
        if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 5M!');
            this.londList[type] = false;
            return;
        }           
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
                        switch (type) {
                            case 'idCardImgFront':
                                this.ruleForm.idCardImgFront = res.content.resourceAbsoluteUrl;
                                break;
                            case 'idCardImgBack':
                                this.ruleForm.idCardImgBack = res.content.resourceAbsoluteUrl;
                                break;
                            case 'holdIdCardImg':
                                this.ruleForm.holdIdCardImg = res.content.resourceAbsoluteUrl;
                                break;                                      
                            default:
                                break;
                        }
                        this.$nextTick(()=>{
                            ruleForm.validateField(type);
                            this.londList[type] = false;
                        })
                    }else{
                        this.londList[type] = false;
                        this.$message.error('上传失败');
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
    resetForm(formName:string) {
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
            this.authStatus = this.oldAuthStatus
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
            type: 2,
            idCard: this.ruleForm.idCard,
            idCardImgFront: this.ruleForm.idCardImgFront,
            idCardImgBack: this.ruleForm.idCardImgBack,
            holdIdCardImg: this.ruleForm.holdIdCardImg,
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
                this.oldAuthStatus = data.authStatus||0
                this.ruleForm={
                    mechanismName: data.mechanismName||'',
                    synopsis: data.synopsis||'',
                    idCard: data.idCard||'',
                    idCardImgFront: data.idCardImgFront||'',
                    idCardImgBack:data.idCardImgBack||'',
                    holdIdCardImg: data.holdIdCardImg||'',
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
            }            
        }else{
            this.$router.replace('/thentication')
        }
    }    
}
</script>
<style lang="scss" scoped>
    .users-page{
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
                    &.idCard{
                        position: relative;
                        &.front{
                            i{
                                background: url('../../../../assets/images/thentication/front.png')no-repeat 50% 50% / cover;
                                width: 83px;
                                height: 51px;
                            }
                        }
                        &.back{
                            i{
                                background: url('../../../../assets/images/thentication/back.png')no-repeat 50% 50% / cover;
                                width: 83px;
                                height: 51px;
                            }
                        }
                        &.hold{
                            i{
                                height: 138px!important;
                                width: 116px!important;
                                background: url('../../../../assets/images/thentication/hold.png')no-repeat 50% 50% / cover;
                            }
                        }
                        .el-form-item__label{
                            line-height: 20px;
                            margin-top:10px;
                            text-align: left;
                            text-align-last:auto;
                        }
                        .upload-box{
                            width: 279px;
                            height: 177px;
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
                                transform:translate(-50%,-50%);
                                z-index: 1;
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
                        .form-tips{
                            display: inline-block;
                            vertical-align: bottom;
                            margin-left: 15px;
                            .re-btn{
                                color:#333;
                                line-height: 19px;
                                font-size: 14px;
                                cursor: pointer;
                                text-decoration: underline;
                            }
                            .tips1{
                                line-height: 16px;
                                font-size: 12px;
                                margin:5px 0 10px 0;
                                color:#999;
                            }
                            .tips2{
                                line-height: 19px;
                                font-size: 14px;
                                color:#999;
                            }
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
                        .authed{
                            margin-right: 10px;
                            display: inline-block;
                            vertical-align: middle;
                            width: 30px;
                            height: 25px;
                            background: url('../../../../assets/images/thentication/auth_icon.png')no-repeat 50% 50% / cover;
                            }
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


