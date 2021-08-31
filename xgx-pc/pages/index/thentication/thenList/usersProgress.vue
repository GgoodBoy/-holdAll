<template>
    <div class="company-page">
        <div class="container">
            <el-form ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <div style="width:800px;">
                    <el-form-item label="真实姓名：">
                        {{ruleForm.mechanismName||'ruleForm.mechanismName'}} <span style="padding:0 20px;color:red;" v-show="ruleForm.authStatus==1">认证中</span>
                    </el-form-item>
                    <el-form-item label="个人简介：" >
                         {{ruleForm.synopsis||'ruleForm.synopsis'}}
                    </el-form-item>
                    <el-form-item label="身份证号：" prop="idCard">
                        <el-input maxlength="10" v-model="ruleForm.idCard"></el-input>
                    </el-form-item>   
                    <el-form-item label="营业执照">
                        <p class="form-hint">支持PNG、JPG格式，大小小于5M</p>
                        <img :src="ruleForm.idCardImgFront" class="avatar idCardStyle">
                        <img :src="ruleForm.idCardImgBack" class="avatar idCardStyle">
                    </el-form-item>   
                    <el-form-item label="营业执照">
                        <p class="form-hint">支持PNG、JPG格式，大小小于5M</p>holdIdCardImg
                        <img :src="ruleForm.holdIdCardImg" class="avatar idCardStyle">
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
        idCard: '',
        idCardImgFront: '',
        idCardImgBack: '',
        holdIdCardImg: '',
        authStatus:3
    }
    created(){
        this.getVerifityMechan();
    }
    goTo(){
        this.$router.push({path:'/thentication/thenList/userIndex'})
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
                    idCard: data.idCard,
                    idCardImgFront: data.idCardImgFront,
                    idCardImgBack:data.idCardImgBack,
                    holdIdCardImg: data.holdIdCardImg,
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
    .idCardStyle{
        max-width: 400px;
    }     
</style>

