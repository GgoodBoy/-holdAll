<template>
    <div>
        <el-row class="lLine40 headerDiv">
           <Breadcrumb :menuList ='titleList' style="margin-bottom:20px"></Breadcrumb>
            <el-col class="lRight-r">
                <el-form ref="form" 
                        :model="form" 
                        label-width="120px" 
                        label-position="right"
                        class="module-details"
                        :rules="rules"
                        >
                        <section class="form-module fontCss14">
                            <el-form-item label="设置续费价格:" prop="originalPrice">
                                <el-row>
                                    <el-col :span="6"><el-input v-model="form.originalPrice" type="text" maxlength="7" placeholder=">0≤10000"></el-input></el-col>
                                    <el-col :span="1" class="lCenter-r">元</el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="期限:" prop="times">
                                <el-row>
                                    <el-col :span="6"><el-input maxlength="10" disabled v-model="form.times"></el-input></el-col>
                                </el-row>
                            </el-form-item>   
                            <el-form-item label="活动价格设置:" style="width:240px;">
                                <el-radio-group v-model="form.radio">
                                    <el-radio :label="1">否</el-radio>
                                    <el-radio :label="2">是</el-radio>
                                </el-radio-group> 
                            </el-form-item>   
                            <el-form-item label="活动价格设置:" prop="activityPrice" v-if="form.radio==2">
                                <el-row>
                                    <el-col :span="6"><el-input v-model="form.activityPrice" type="text" maxlength="5" placeholder=">0≤10000"></el-input></el-col>
                                    <el-col :span="1" class="lCenter-r">元</el-col>
                                </el-row>
                            </el-form-item>     
                        </section>
                        <el-row>
                            <el-col class="lCenter-r">
                                <!-- <el-button class="lButtomNo lMarginTB50" @click="returnpage">取消</el-button> -->
                                <el-button class="lButtomOk lMarginTB50" :loading="loadDailg" @click="submitForm('form')">确定</el-button>
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
import Breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    components:{
        Breadcrumb,
        Dialog
    },    
    data(){
        var checkAge = (rule, value, callback) => {
            var self = this;
            let regExp = /^\d+(\.([1-9]|\d[1-9]))?$/g;
            switch (rule.fullField) {                           
                case "originalPrice":
                    // let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,20}$/;
                    // let regExp = /^[0-9a-zA-Z]*$/g;
                    if(!Number(value)){
                        callback(new Error('请输入续费价格'))
                    }else{
                        if(!regExp.test(value)){
                            // callback(new Error('批次为数字字母组合'))
                            callback(new Error('续费价格为最多2位小数的数字'))
                        }else if(value<0||value>10000){
                            callback(new Error('续费价格1-10000'))
                        }else{
                            callback()
                        }
                    }
                break;                             
                case "activityPrice":
                    if(!Number(value)){
                        callback(new Error('请输入限时价格'))
                    }else{
                        if(!regExp.test(value)){
                            callback(new Error('限时价格为数字'))
                        }else if(Number(value)>=Number(self.form.originalPrice)){
                            callback(new Error('续费价格必须大于限时价格'))
                        }else{
                            callback()
                        }
                    }
                break;              
            }
        };                
        return {
            form:{
                originalPrice:"",
                activityPrice:'',
                radio:1,
                times:'1年',
            },           
            disabledState:false,
            rules:{  
                originalPrice: [
                    {required: true, validator: checkAge, trigger: 'blur' }
                ], 
                activityPrice: [
                    {required: true, validator: checkAge, trigger: 'blur' }
                ]                            
            },
            loadDailg:false,
            dataUpdateBool:{
                originalPrice:"",
                activityPrice:'',
                radio:1,
                times:'1年'
                },
            editsObj:{
                showFlag:false, //是否显示遮罩弹框；
                title:"温馨提示", //Dialog 的标题
                cancelName:'editObjNos', //自定义取消事件名字
                sureName:'editObjOks', //自定义确定事件名字,                        
            },
            toPath:{},
            titleList:[
                {
                    name:'国学智慧平台',
                    pathInfo:''
                },
                {
                    name:'续费价格设置',
                    pathInfo:''
                }
            ],      
    }},
    created(){          
            this.getReturnCourseList();  
    },
    props:[],
    computed:{  },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        var newFormData = JSON.stringify(this.form);
        if(JSON.stringify(this.dataUpdateBool)!==newFormData){
            //next方法传true或者不传为默认历史返回，传false为不执行历史回退
            this.editsObj.showFlag = true;
            this.toPath = to;
            next(false);  
        }else{
            next();
        };
    },        
    methods:{          
        getReturnCourseList(){       
            var self = this;                     
            self.$http.get(self.$server.wisdomRenewSetDetail).then(res=>{
                if(res.status==200){
                    this.form.originalPrice=res.content.originalPrice;
                    this.form.activityPrice=res.content.activityPrice||'';   
                    this.form.radio = Number(res.content.activityPrice)>0?2:1;    
                    
                    this.dataUpdateBool.originalPrice=res.content.originalPrice;
                    this.dataUpdateBool.activityPrice=res.content.activityPrice||'';   
                    this.dataUpdateBool.radio = Number(res.content.activityPrice)>0?2:1;  
                }
            })
            .catch(res => {});             
        },    
        //切换路径取消    
        couponEditObjNo(){
            console.log("取消");
            this.editsObj.showFlag = false;
        },
        //切换路径确定
        couponEditObjOk(){
            var self = this;
            self.dataUpdateBool = {};
            // JSON.stringify(this.dataUpdateBool)!==newFormData
            self.form = {};
            self.$router.push({path:self.toPath.path});    
        },
        returnpage(){
            this.$router.push({path:"/marketelist/activitiesCard/activiesLearningCard"});
            console.log("取消");
        },
        submitForm(formName){
            var self = this;
            let parmesObj ={};
            if(!self.loadDailg){
                self.loadDailg = true;    
                self.$refs[formName].validate((valid) => {
                        if (valid) {
                            let urls = '';
                                var parems = {
                                        originalPrice:self.form.originalPrice,
                                        activityPrice:self.form.radio==1?'':self.form.activityPrice
                                };
                                urls = self.$server.wisdomEditRenewSet
                                self.disabledState = !self.disabledState;                               
                                self.$http.post(urls,parems).then(res=>{
                                    if(res.status==200){
                                            // self.dataUpdateBool = JSON.stringify({});
                                            self.dataUpdateBool.originalPrice=self.form.originalPrice;
                                            self.dataUpdateBool.activityPrice=self.form.activityPrice;   
                                            self.dataUpdateBool.radio = self.form.radio; 

                                            self.loadDailg = false; 
                                            self.$message.success("设置成功。");
                                    }else{
                                        self.loadDailg = false;
                                    }
                                })
                                .catch(res => {
                                        self.loadDailg=false;
                                }); 
                                                     
                                console.log("验证通过");
                            } else {
                                console.log("验证未通过");
                                this.loadDailg = false;
                                return false;
                            }
                    });   
            }         
        }                               
    },
    watch: {
        'form.radio' (news,olds) {
            if(news==1){
                this.$refs["form"].clearValidate("activityPrice");
            }else{
                this.$refs["form"].validateField("activityPrice");
            }
        }        
    }, 
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
.headerDiv .module-details .form-module .listCourse{
            width: 250px;
            max-height: 250px;
            overflow: auto;
            /* margin: auto; */
}
.headerDiv .module-details .form-module .listCourse .lLine40{
            /* border:1px solid #82C4F5; */
            border:1px solid #9E0E00;
            margin: 5px 0;
}
.headerDiv .module-details .form-module .listCourse .lLine40 i{
        font-weight:bold;
        cursor: pointer;
}
.headerDiv .module-details .form-module .listCourse .lLine40 .lPaddingRF10{
                color: #9E0E00;
                text-align: left;
}

</style>


