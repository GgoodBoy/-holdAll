<template>
<el-row>
    <el-col :span="8" class="lLeft-r">
        <breadcrumb :menuList ='titleList'></breadcrumb>
    </el-col>    
    <el-col class="lMarginTop30">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="loadingBool">
            <el-form-item label="名称:" prop="name" style="width:40%">
                <el-input v-model="ruleForm.name"                     
                    maxlength="16"
                    show-word-limit ></el-input>
                    <div class="flexDiv">{{ruleForm.name.length||0}}/16</div>
            </el-form-item>
            <el-form-item label="类型:" prop="timeType">
                <el-radio-group v-model="ruleForm.timeType" @change="radioSelectEven" :disabled="editAdd=='add'?false:true">
                    <el-radio :label="1">月度</el-radio>
                    <el-radio :label="2">季度</el-radio>
                    <el-radio :label="3">半年</el-radio>
                    <el-radio :label="4">年度</el-radio>                    
                </el-radio-group>
            </el-form-item> 
            <el-form-item label="渠道" v-if="ruleForm.type==1">
                    <el-select v-model.trim="ruleForm.pipelineId" :disabled="editAdd=='edit'">
                        <el-option v-for="(item,index) in channelArr" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>           
            <el-form-item label="权益:">
                <el-select v-model="ruleForm.equitySelect" disabled placeholder="请选择">
                    <el-option label="会员免费" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="equityType">
                <el-radio-group v-model="ruleForm.equityType">
                    <el-radio :label="1">全场免费</el-radio>
                </el-radio-group>
            </el-form-item>            
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
            <!-- <el-form-item label="积分关联:" prop="integralNum">
                <el-input v-model="ruleForm.integralNum" style="width:80px" :disabled="editAdd=='add'?false:true" placeholder="1~100"></el-input>
                <p class="lSize12 grayColor">*积分关联是指在会员有效期内，会员每日自动增加的积分数量。</p>
            </el-form-item>   -->
            <el-form-item label="会员说明:" prop="equityDesc" style="width:40%">
                <el-input type="textarea"
                    v-model.trim="ruleForm.equityDesc"
                    maxlength="300"               
                 :autosize="{ minRows: 6, maxRows: 8}" ></el-input>
                 <div class="flexDiv">{{ruleForm.equityDesc.length||0}}/300</div>
            </el-form-item>
            <!-- <el-form-item label="购买须知:" prop="purchaseNotes" style="width:40%">
                <el-input type="textarea"
                    v-model="ruleForm.purchaseNotes"
                    maxlength="100"                 
                 :autosize="{ minRows: 4, maxRows: 6}" ></el-input>
                 <div class="flexDiv">{{ruleForm.purchaseNotes.length||0}}/100</div>
            </el-form-item>
            <el-form-item label="使用须知:" prop="useNotes" style="width:40%">
                <el-input type="textarea"
                    v-model="ruleForm.useNotes"
                    maxlength="100"
                    :autosize="{ minRows: 4, maxRows: 6}" ></el-input>
                    <div class="flexDiv">{{ruleForm.useNotes.length||0}}/100</div>
            </el-form-item>                         -->
            <el-form-item class="lMarginTop50 lCenter-r" style="width:40%">
                <el-button @click="resetEven()">取消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-form-item>
        </el-form>        
    </el-col>
</el-row>
</template>
<script>
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
     data(){
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {             
                // case "integralNum":
                //     if ($.trim(value)===""||Number(value)==0) {
                //             if(Number(value)==0){
                //                 return callback(new Error('内容范围1-100'));
                //             }
                //             if($.trim(value)===""){
                //                 return callback(new Error('请填写关联积分'));
                //             }  
                //         }
                //         setTimeout(() => {
                //             if (!Number.isInteger(Number(value))) {
                //                 callback(new Error('请输入正整数'));
                //             } else {
                //                 if (Number(value)>100||Number(value)<0) {
                //                     callback(new Error('内容范围1-100'));
                //                 } else {
                //                     callback();
                //                 }
                //             }
                //         }, 1000);
                // break;               
            }
        };            
        return {
                action:'',
                commonHeader:{},
                iosMoney:'',
                androidMoney:'',
                editStartBool:true,
                ruleForm: {
                    id:'',
                    name: '',
                    timeType: 1,
                    equityType:1,
                    equitySelect:'1',
                    // integralNum: '',
                    // purchaseNotes: '',
                    equityDesc:'',
                    // useNotes: '',
                    backgroundUrl:'',
                    type:'',
                    andriodPrice:'',
                    iosPrice:'',
                    pipelineId:'',
                    disabledState:false
                },
                channelArr:[],
                rules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
                    ],
                    timeType: [
                        { required: true, message: '请选择会员类型', trigger: 'change' }
                    ],
                    // integralNum: [
                    //     { validator: checkAge, trigger: 'blur' }
                    // ],
                    equityDesc: [
                        { required: true, message: '请填写会员权益', trigger: 'blur' }
                    ],
                    // purchaseNotes: [
                    //     { required: true, message: '请填写购买须知', trigger: 'blur' }
                    // ],
                    // useNotes: [
                    //     { required: true, message: '请填写使用须知', trigger: 'blur' }
                    // ]                                
                },
                titleList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'会员卡系统',
                            pathInfo:'/marketelist/member/memberCard'
                        },
                        {
                            name:'生成会员卡',
                            pathInfo:''
                        }
                ],
                editAdd:'',
                loadingBool:false,
                moneyList:[]              
            };
            },
            created() {
                this.commonHeader = {
                    token: getToken()
                };                
                this.action = this.$server.actionImgOrvideo;
                this.ruleForm.type = this.$route.query["type"];
                this.editAdd = this.$route.query["addOrEdit"];
                this.getMemberMoneyTypeList();
                this.channelCoursePipelines();
                if(this.ruleForm.type=='editer'){
                    this.ruleForm = this.$route.query["data"];
                    this.ruleForm['equitySelect']='1';
                }
            },
            components:{
                breadcrumb
            },
            methods: {
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
                radioSelectEven(val){
                    switch (val) {
                        case 1:
                            this.iosMoney=this.moneyList[0][0];
                            this.androidMoney=this.moneyList[0][1];
                            break;
                        case 2:
                            this.iosMoney=this.moneyList[1][0];
                            this.androidMoney=this.moneyList[1][1];                            
                            break;
                        case 3:
                            this.iosMoney=this.moneyList[2][0];
                            this.androidMoney=this.moneyList[2][1];                            
                            break;
                        case 4:
                            this.iosMoney=this.moneyList[3][0];
                            this.androidMoney=this.moneyList[3][1];                            
                            break;                                                                            
                        default:
                            break;
                    }
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
                    self.loadingBool = true;
                    self.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(!self.ruleForm.backgroundUrl.length>0){
                            self.loadingBool = false;
                            return;
                        }                        
                        var parems = {
                                name:self.ruleForm.name,
                                type:Number(self.ruleForm.type),
                                timeType:self.ruleForm.timeType,
                                appleId:self.ruleForm.appleId||'',
                                productId:self.ruleForm.productId||'',
                                backgroundUrl:self.ruleForm.backgroundUrl,
                                // integralNum:self.ruleForm.integralNum,
                                equityType:self.ruleForm.equityType,
                                // purchaseNotes:self.ruleForm.purchaseNotes,
                                // useNotes:self.ruleForm.useNotes,
                                state:self.ruleForm.state||'',
                                equityDesc:self.ruleForm.equityDesc,
                        }
                        var url = '';
                        if(self.editAdd=='edit'){
                            url=self.$server.memberMemberEdit({id:self.ruleForm.id})
                        }else{
                            url = self.$server.memberMemberAdd;
                        }
                        if(this.ruleForm.type==1){
                            parems.pipelineId = this.ruleForm.pipelineId
                        }
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;                          
                            self.$http.post(url,parems).then(res=>{
                                if(res.status==200){
                                        self.dataUpdateBool = JSON.stringify({});
                                        self.loadingBool = false;
                                        self.form = {};
                                        self.disabledState = !self.disabledState;
                                        this.$router.push({path:"/marketelist/member/memberCard"});
                                }else{
                                    self.loadingBool = false;
                                    self.disabledState = !self.disabledState;
                                }
                            }).catch(()=>{
                                self.disabledState = !self.disabledState;
                            })
                        }
 

                    } else {
                        self.loadingBool = false;
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
                    this.$router.push(`/marketelist/member/memberCard`);
                },
                /**
         * 获取渠道
         */
        channelCoursePipelines(){
            let query = {
                params:{}
            }
            this.$http.get(this.$server.channelCoursePipelines,query).then(res=>{
                if(res.status==200){
                    res.content.list.forEach(item=>{
                        if(item.name=='学国学网'){
                            this.channelArr.push(item)
                        }
                    })
                    this.ruleForm.pipelineId = this.channelArr[0].id;
                }
            })
        }        
     }
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
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


