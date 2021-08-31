<template>
    <div class="integralCss">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="活动开关" prop="integralResource">
                <el-radio-group v-model="ruleForm.integralResource">
                    <el-radio label="2">开</el-radio>
                    <el-radio label="1">关</el-radio>
                </el-radio-group>
            </el-form-item>            
            <el-form-item label="签到3天所获积分" prop="integralThree">
                <el-input v-model="ruleForm.integralThree"></el-input>
            </el-form-item>
            <el-form-item label="签到7天所获积分" prop="integralSeven">
                <el-input v-model="ruleForm.integralSeven"></el-input>
            </el-form-item>
            <el-form-item label="个人中心签到描述" prop="integralDesc">
                <div class="divTextarea">
                    <el-input type="textarea" maxlength="20" v-model="ruleForm.integralDesc" :rows="1"></el-input>
                    <p>{{ruleForm.integralDesc.length}}/20</p>
                </div>
            </el-form-item>     
            <el-form-item label="活动规则" prop="integralRule">
                <div class="divTextarea">
                    <el-input type="textarea" v-model="ruleForm.integralRule" maxlength="1000" :rows="6"></el-input>
                    <p>{{ruleForm.integralRule.length}}/1000</p>
                </div>
            </el-form-item> 
            <el-form-item v-if="$authJudge('integral:activitymanage:save')">
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
            </el-form-item>
        </el-form> 
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
export default {
    data() {
        var checkAge = (rule, value, callback) => {
            var self = this;
            var han = /^[0-9]+$/; 
            switch (rule.fullField) {
                case "integralThree":
                case "integralSeven":
                    if (value) {
                        if ((Number(value)>1000||Number(value)<1)||!han.test(Number(value))) {
                            callback(new Error('范围在1到1000的正整数'));
                        }else{
                            callback();
                        }                           
                    }else{
                            callback(new Error(`请输入签到${rule.fullField=='integralThree'?3:7}天所获积分`));
                    }                              
                break;             
            }
        };          
        return {
            integraId:'',
            ruleForm: {
                integralThree:'',
                integralSeven:'',
                integralResource: '',
                integralDesc: '',
                integralRule:''
            },
            rules: {
                integralResource:[
                     { required: true, message: '请选择活动开关', trigger: 'change'},
                ],
                integralThree: [
                    { required: true, validator: checkAge, trigger: 'blur' }
                ],
                integralSeven: [
                    { required: true, validator: checkAge, trigger: 'blur' }
                ],
                integralDesc: [
                    { required: true, message: '请填写个人中心签到描述', trigger: 'blur' }
                ],
                integralRule:[
                    { required: true, message: '请填写活动规则', trigger: 'blur' }
                ]
            },
            ruleFormLocal:'',
            leaveFlag:false,            
            leaveDialogVisible:false
        };
    },
    components: {},
    watch: {},
    created() {
        this.getInitDataInteGral();
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
    methods:{
        //路径切换
        leavePage(){
            this.leaveFlag = true;
            this.leaveDialogVisible = false;
            this.$router.push(this.leavePath.path);            
        },         
        getInitDataInteGral(){
            this.$http.get(this.$server.integralActivityManagementGetinfo).then(res=>{
               if(res.status==200){
                   if(res.content){
                        var content = res.content;
                        this.integraId = content.id;
                        this.ruleForm= {
                            integralThree:content.integralThree,
                            integralSeven:content.integralSeven,
                            integralResource: JSON.stringify(content.onoff),
                            integralDesc: content.description,
                            integralRule:content.rule	
                        };
                   }
                   this.ruleFormLocal = JSON.stringify(this.ruleForm);
                }
            })
        },
        setIntegralLIst(name){       
            var parems = {
                id:this.integraId||'',
                onoff:Number(this.ruleForm.integralResource),
                integralThree:Number(this.ruleForm.integralThree),
                integralSeven:Number(this.ruleForm.integralSeven),
                description:this.ruleForm.integralDesc,
                rule:this.ruleForm.integralRule
            };
            this.$http.post(this.$server.integralThematicActivitySave,parems).then(res=>{
               if(res.status==200){
                    this.leaveFlag = true;
                    this.$message.success({ message: "创建成功" });
                }
            })            
        },        
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.setIntegralLIst(formName);
                } else {
                    return false;
                }
            })
        },       
    }
}
</script>
<style lang="scss" scoped>
.integralCss{
    .demo-ruleForm{
        width: 600px;
        .divTextarea{
            width: 100%;
            position: relative;
            p{
                position: absolute;
                right: -75px;
                width: 70px;
                text-align: left;
                bottom: -15px;
            }
        }
    }
}
</style>