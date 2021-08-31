<template>
    <div class="page-H5-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>    
        </div>
        <div class="page-content">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" class="demo-ruleForm">
                <el-form-item label="" prop="textareaOne">
                    <div>勋章规则</div>
                    <el-input type="textarea" :rows="6" style='width:70%;' v-model="ruleForm.textareaOne"></el-input>
                </el-form-item>                
                <el-form-item label="" prop="textareaTwo">
                    <div>孚星规则</div>
                    <el-input type="textarea" :rows="6" style='width:70%;margin-top:10px;' v-model="ruleForm.textareaTwo"></el-input>
                </el-form-item>               
                <!-- <el-form-item label="" prop="textareaThree">
                    <div>智力值规则</div>
                    <el-input type="textarea" :rows="6" style='width:70%;margin-top:10px;' v-model="ruleForm.textareaThree"></el-input>
                </el-form-item>          -->
                <el-form-item style="text-align:center;">
                    <el-button @click="resetForm()">取消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                </el-form-item>
            </el-form>  
        </div>
    </div>
</template>

<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            myHeaders: {token: getToken()},
            titleList:[
                {
                    name:'H5课程管理',
                    pathInfo:'/H5WebView/index'
                },
                {
                    name:'设置',
                    pathInfo:''
                }                
            ],       
            ruleForm: {
                textareaOne: '',
                textareaTwo: '',
                // textareaThree:''
            },
            id1:'',
            id2:'',
            id3:'',
            rules: {
                textareaOne: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
                textareaTwo: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
                // textareaThree: [
                //     { required: true, message: '请输入内容', trigger: 'blur' }
                // ]
            }
        };
    },
    components: {
        breadcrumb
    },
    watch: {},
    computed:{},
    created() {
        this.getActivityCurrency();
    },
    methods: {
        getActivityCurrency(){
            this.$http.get(this.$server.h5GetActivityCurrency).then(res=>{
                if(res.status==200){
                    console.log('res.content',res.content)
                    res.content.forEach((item,index)=>{
                        if(item.type==1){
                            this.ruleForm.textareaOne= item.content;
                            this.id1=item.id;
                        }
                        if(item.type==2){
                            this.ruleForm.textareaTwo= item.content;
                            this.id2=item.id;
                        }
                        // if(item.type==3){
                        //     this.ruleForm.textareaThree=item.content;
                        //     this.id3=item.id;
                        // }
                    })                    
                }
            })            
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let query= {};
                    query['currencies[0].type'] = 1; 
                    query['currencies[0].id'] = this.id1; 
                    query['currencies[0].content'] = this.ruleForm.textareaOne; 
                    query['currencies[1].type'] = 2; 
                    query['currencies[1].id'] = this.id2; 
                    query['currencies[1].content'] = this.ruleForm.textareaTwo; 
                    // query['currencies[2].type'] = 3; 
                    // query['currencies[2].id'] = this.id3; 
                    // query['currencies[2].content'] = this.ruleForm.textareaThree; 
                    this.$http.post(this.$server.h5SetActivityCurrency,query).then(res=>{
                        if(res.status==200){
                            this.$message.success("创建成功!");
                        }
                    })    
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style scoped lang="scss">
    .page-H5-wrap {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-title {
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
            margin-bottom: 20px;
        }
        .dialog-footer{
            text-align: center;
            margin-top: 20px;
        }
        .inputBox{
            text-align: center;
            .inputText{
                width:300px;
                margin:0 10px;
            }
        }
    }
    .search-form {
        width: 100%;
        margin-right: 10px;
        position: relative;
    }
    .page-content {
        background: #fff;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        padding:20px;
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
            width: 400px;
            height: 113.1px;
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
    .edit-dialog{
        .edit-box{
            margin:10px 0 40px 0;
        }
        .name,.select-box,.btn{
            display: inline-block;
            vertical-align: middle;
        }
        .name{
            width: 180px;
        }
        .select-box{
            width: 110px;
            margin:0 5px;
        }
        .error-tips{
            position: absolute;
            left: 0;
            bottom:-30px;
            color:#ca2312;
            font-size: 14px;
        }
    }
    .preview-box{
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 1111;
        iframe{
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background: #fff;
        }
    }
</style>

