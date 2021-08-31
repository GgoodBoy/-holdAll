<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col class="lSize18">生成学习卡</el-col>
            <el-col class="lRight-r lMarginTop20">
                <el-form ref="form" 
                        v-loading = "loadDailg"
                        :model="form" 
                        label-width="100px" 
                        label-position="right"
                        class="module-details"
                        :rules="rules"
                        >
                        <section class="form-module fontCss14">
                            <el-form-item label="面额" prop="price">
                                <el-row>
                                    <el-col :span="6"><el-input v-model="form.price" placeholder="≥1≤100000"></el-input></el-col>
                                    <el-col :span="1" class="lCenter-r">元</el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="张数" prop="num">
                                <el-row>
                                    <el-col :span="6"><el-input v-model="form.num" placeholder="≥1≤10000"></el-input></el-col>
                                    <el-col :span="1" class="lCenter-r">张</el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="批次" prop="batch">
                                <el-row>
                                    <el-col :span="6"><el-input v-model="form.batch" type="text" maxlength="20" placeholder=" "></el-input></el-col>
                                    <el-col :span="1" class="lCenter-r">批次</el-col>
                                </el-row>
                            </el-form-item>                                                
                            <el-form-item label="有效期至" prop="receiveValidatily" class="timeDeleteButton">
                                   <el-row>
                                        <el-col :span="6">
                                            <el-date-picker 
                                            :picker-options="pickerOptions0" 
                                            type="datetime" 
                                            placeholder="选择开始时间" 
                                            @change="dateChangeEndTime"
                                            v-model="form.receiveValidatily" 
                                            style="width: 100%;"></el-date-picker>
                                        </el-col>
                                    </el-row>
                            </el-form-item>                            
                            <el-form-item label="备注">
                                <el-row>
                                    <el-col :span="14">
                                        <el-input type="textarea" 
                                            class="inputtextarea"
                                            v-model="form.remarks" 
                                            maxlength="50" 
                                            ></el-input>
                                        <span>{{form.remarks.length||0}}/50</span>
                                    </el-col>
                                </el-row>                               
                            </el-form-item>
                        </section>
                        <el-row>
                            <el-col class="lCenter-r">
                                <el-button class="lButtomNo lMarginTB50" @click="returnpage">取消</el-button>
                                <el-button class="lButtomOk lMarginTB50" :disabled="submitBool" @click="submitForm('form')">生成</el-button>
                            </el-col>
                        </el-row>                
                </el-form>
            </el-col>
        </el-row>
        <Dialog 
            :showFlag.sync="editsObj.showFlag"
            :title="editsObj.title"
            :cancelName="editsObj.cancelName"
            :sureName="editsObj.sureName"
            v-on:editObjNos="couponEditObjNo"
            v-on:editObjOks="couponEditObjOk">
            <el-row slot="dialog-body" class="lLine30">
                <el-col class="lCenter-r">
                        您有未保存的信息，离开会丢失，确定要离开吗？
                </el-col>                                     
            </el-row>
        </Dialog>  
    </div>
</template>
<script>
import Dialog from "@/components/myDialog/myDialog";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    components:{
        // Breadcrumb,
        // courseselect,
        Dialog
    },    
    data(){
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {
                case "receiveValidatily":
                    if (value===""||value==0) {
                        return callback(new Error('请填写大于当前的效时间'));
                    }else{
                        callback();
                    }
                break;             
                case "price":
                    if ($.trim(value)===""||Number(value)==0) {
                            if(Number(value)==0){
                                return callback(new Error('内容范围1-100000'));
                            }
                            if($.trim(value)===""){
                                return callback(new Error('请填写内容'));
                            }  
                        }
                        setTimeout(() => {
                            if (!Number.isInteger(Number(value))) {
                                callback(new Error('请输入正整数'));
                            } else {
                                if (Number(value)>100000||Number(value)<0) {
                                    callback(new Error('内容范围1-100000'));
                                } else {
                                    callback();
                                }
                            }
                        }, 1000);
                break;                
                case "num":
                    if ($.trim(value)===""||Number(value)==0) {
                            if(Number(value)==0){
                                return callback(new Error('内容范围1-10000'));
                            }
                            if($.trim(value)===""){
                                return callback(new Error('请填写内容'));
                            }  
                        }
                        setTimeout(() => {
                            if (!Number.isInteger(Number(value))) {
                                callback(new Error('请输入正整数'));
                            } else {
                                if (Number(value)>10000||Number(value)<0) {
                                    callback(new Error('内容范围1-10000'));
                                } else {
                                    callback();
                                }
                            }
                        }, 1000);
                break;              
                case "batch":
                    let regExp = /^[0-9a-zA-Z]*$/g;
                    if(value==''){
                        callback(new Error('请输入内容'))
                    }else{
                        if(!regExp.test(value)){
                            callback(new Error('批次为数字,字母或者数字加字母'))
                        }else{
                            callback()
                        }
                    }
                break;                
            }
        };                
        return {
            form:{
                price:'',
                num:'',
                batch:"",
                receiveValidatily:"",
                remarks:'',
                // type:1
            },
            //重复提交按钮锁；
            submitBool:false,
            rules:{
                price: [
                    { validator:checkAge, trigger: 'blur' },
                ], 
                num:[
                    { validator:checkAge, trigger: 'blur' },
                ], 
                batch: [
                    { validator: checkAge, trigger: 'blur' }
                ],
                receiveValidatily: [
                    { validator: checkAge, trigger: 'change' }
                ]                            
            },
            loadDailg:false,
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                    }
            },
            // dataUpdateBool:'',
            editsObj:{
                showFlag:false, //是否显示遮罩弹框；
                title:"温馨提示", //Dialog 的标题
                cancelName:'editObjNos', //自定义取消事件名字
                sureName:'editObjOks', //自定义确定事件名字,                        
            },
            toPath:{}
    }},
    created(){       
    },
    props:[],
    computed:{    
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        console.log("beforeRouteLeave",3)
        var newFormData = JSON.stringify(this.form);
        if(this.dataUpdateBool!==newFormData){
            //next方法传true或者不传为默认历史返回，传false为不执行历史回退
            this.editsObj.showFlag = true;
            this.toPath = to;
            next(false);         

        }else{
            next();
        };
    },        
    methods:{
         download2(url) {
            try{ 
                    var elemIF = document.createElement("iframe");   
                    elemIF.src = url;   
                    elemIF.style.display = "none";   
                    document.body.appendChild(elemIF);   
                }catch(e){ 
                    zzrw.alert("下载异常！");
                }
        },
        //日期变化触发；
        dateChangeEndTime(value){
            // this.form.receiveValidatily=this.formatDate(Number(value));
            this.form.receiveValidatily=Number(value);
        },        
        couponEditObjNo(){
            console.log("取消");
            this.editsObj.showFlag = false;
        },
        couponEditObjOk(){
            var self = this;
            self.dataUpdateBool = JSON.stringify({});
            self.form = {};
            self.$router.push({path:self.toPath.path});    
        },
        returnpage(){
            this.$router.push({path:"/marketelist/learningCard"});
            console.log("取消");
        },
        submitForm(formName){
            var self = this;
            let parmesObj ={};
            self.loadDailg = false;
            // self.form.receiveValidatily = self.form.receiveValidatily>Number(new Date)?self.form.receiveValidatily:Number(new Date)+1000;
            self.$refs[formName].validate((valid) => {
            if(self.submitBool){
                return;
            }     
            self.submitBool = true;             
            if (valid) {
                self.form.price = Number(self.form.price);
                var parems = {
                        price:self.form.price,
                        num:self.form.num,
                        batch:self.form.batch,
                        receiveValidatily:self.formatDate(self.form.receiveValidatily),
                        remarks:self.form.remarks,
                        type:1
                }
                self.$http.post(self.$server.studyCardAadd,parems).then(res=>{
                if(res.status==200){
                        // parmesObj = {
                        //     id:res.content.cardBaseId,
                        //     token:getToken()
                        // };
                        // self.download2(self.$server.studyCardExport(parmesObj))
                        self.dataUpdateBool = JSON.stringify({});
                        self.form = {};
                        self.submitBool = false;
                        this.$router.push({path:"/marketelist/learningCard"});
                }else{
                    self.loadDailg = false;
                    self.submitBool = false;
                }
                    console.log(res);
                });                     
                console.log("验证通过");
            } else {
                console.log("验证未通过");
                this.loadDailg = false;
                self.submitBool = false;
                return false;
                }
            });            
        },
        formatDate(date){
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                // var h=date.getHours();
                // var m1=date.getMinutes();
                // var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;
                // return y+"/"+m+"/"+d+" "+h+":"+m1+":"+s;
                return y+"-"+m+"-"+d;
            }                               
    },
    watch: {}, 
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px; 
    margin-bottom: 10px;    
}
.headerDiv .inputtextarea .el-textarea__inner{
        min-height: 100px !important;
    }    
</style>


