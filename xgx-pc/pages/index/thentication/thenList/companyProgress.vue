<template>
    <div class="company-page">
        <div class="container">
            <el-form ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <div style="width:800px;">
                    <el-form-item label="机构名称：">
                        {{ruleForm.mechanismName||'ruleForm.mechanismName'}} <span style="padding:0 20px;color:red;" v-show="ruleForm.authStatus==1">认证中</span>
                       
                    </el-form-item>
                    <el-form-item label="机构简介：" >
                         {{ruleForm.synopsis||'ruleForm.synopsis'}}
                    </el-form-item>
                    <div>
                        <div style="display: inline-block;">
                            <el-form-item label="联系人：">
                                {{ruleForm.contacts||'ruleForm.contacts'}}
                            </el-form-item>
                        </div>
                        <div style="display: inline-block;">
                            <el-form-item label="联系方式:" >
                                {{ruleForm.tellphone||'ruleForm.tellphone'}}
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <div style="width:800px;">
                    <el-form-item label="营业执照注册号：" >
                        {{ruleForm.businessLicenseNo||'ruleForm.businessLicenseNo'}}
                    </el-form-item>     
                    <el-form-item label="营业执照">
                        <p class="form-hint">支持PNG、JPG格式，大小小于5M</p>
                        <img :src="ruleForm.businessLicenseImg" class="avatar idCardStyle">
                    </el-form-item>    
                    <el-form-item >
                        <el-button @click="goTo" v-show="ruleForm.authStatus==3">修改认证信息</el-button>
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
import { constants } from 'fs';
@Component({
  name:'companyProgress'
})
export default class Personal extends Vue{
    londStates:boolean=false;
    ruleForm:any={
        mechanismName: '',
        synopsis: '',
        contacts: '',
        tellphone: '',
        businessLicenseNo: '',
        businessLicenseImg: '',
        authStatus:0
    }
    created(){
        this.getVerifityMechan();
    }
    goTo(){
        this.$router.push({path:'/thentication/thenList/companyIndex'})
    }
    async getVerifityMechan(){
        let user =  getCookie('xgx_user')?JSON.parse( getCookie('xgx_user')):null;
        if(user){
            let query = {
                userId:user.userId
            }
            let res=await this.$axios.$post(this.$server.getVerifityMechanism,query)
            if(res.status==200){
                const data = res.content;
                this.ruleForm={
                    mechanismName: data.mechanismName,
                    synopsis: data.synopsis,
                    type: data.type,
                    contacts: data.contacts,
                    tellphone: data.tellphone,
                    businessLicenseNo:data.businessLicenseNo,
                    businessLicenseImg: data.businessLicenseImg,
                    authStatus:data.authStatus
                }
            }            
        }
    }    
}
</script>
<style lang="scss" scoped>
    .company-page{
        padding: 30px 20px 50px 20px;
        background: #FFF;
        .container{
            width: 1200px;
            margin: auto;
        }
    }
</style>
<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #fff;
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
    .loadingStyle{
        width: 178px;
        height: 178px;
    }
</style>

