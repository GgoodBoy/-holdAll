<template>
    <div class="wrap-pragram">  
        <breadcrumb :menuList ='titleList'></breadcrumb>
        <div class="pragramBox">
            <el-radio-group v-model="radio" @change="radioSelect" class="radioCss" :disabled="disabledRadio">
                <el-radio :label="1">文字</el-radio>
                <el-radio :label="2">诗词</el-radio>
            </el-radio-group>       
            <div class="pragramBoxOne" v-show="radio==1">
                <el-row>
                    <el-col :span="12">
                        <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="指定日期"  prop="appointedTime">
                                <el-date-picker
                                v-model="ruleForm1.appointedTime"
                                type="date"
                                :picker-options="pickerOptions0"
                                placeholder="年/月/日">
                                </el-date-picker>                        
                            </el-form-item>                                        
                            <el-form-item label="" prop="content">
                                <el-input 
                                    type="textarea"
                                    style="width:220px;"
                                    maxlength="60"
                                    :rows="6"
                                    v-model.trim="ruleForm1.content"></el-input>
                                    <p>限60个字以内</p>
                            </el-form-item>     
                            <el-form-item label="匹配课程">
                                <div class="pragramBut" @click="selectCourse(1)">选择</div>
                                <div class="pragramBut redFontColor" v-if="courseSelectState">{{courseObj.courseName||''}}</div>
                                <div class="pragramBut redFontColor" v-else>请选择课程</div>
                            </el-form-item>                                                                                                                 
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleForm1')">保存</el-button>
                                <el-button @click="resetForm('ruleForm1')">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="12">
                        <p>示例</p>
                        <div class="pragramExample">
                            曾子曰：“吾日三省吾身：为人谋而不忠乎？与朋友交而不信乎？传不习乎？”                            
                        </div>
                    </el-col>
                </el-row>                
            </div>  
            <div v-show="radio==2" class="pragramBoxOne pragramForm">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="指定日期"  prop="appointedTime">
                        <el-date-picker
                        v-model="ruleForm.appointedTime"
                        type="date"
                        :picker-options="pickerOptions0"
                        placeholder="年/月/日">
                        </el-date-picker>                        
                    </el-form-item>                                        
                    <el-form-item label="标题" prop="title">
                        <el-row>
                            <el-col :span="18">
                                <el-input v-model="ruleForm.title" maxlength="10"></el-input>                               
                            </el-col>
                            <el-col :span="4" :offset="1">
                                <span>{{ruleForm.title.length}}/10</span>
                            </el-col>
                        </el-row>  
                    </el-form-item>
                    <el-form-item label="作者及朝代" prop="author">
                        <el-row>
                            <el-col :span="18">
                                <el-input v-model="ruleForm.author" maxlength="10"></el-input>                               
                            </el-col>
                            <el-col :span="4" :offset="1">
                                <span>{{ruleForm.author.length}}/10</span>
                            </el-col>
                        </el-row>                        
                    </el-form-item>
                    <el-form-item label="第1句" prop="firstSentence">
                        <el-row>
                            <el-col :span="18">
                                <el-input v-model="ruleForm.firstSentence" maxlength="16"></el-input>                               
                            </el-col>
                            <el-col :span="4" :offset="1">
                                <span>{{ruleForm.firstSentence.length}}/16</span>
                            </el-col>
                        </el-row>                        
                    </el-form-item>
                    <el-form-item label="第2句" prop="secondSentence">
                        <el-row>
                            <el-col :span="18">
                                <el-input v-model="ruleForm.secondSentence" maxlength="16"></el-input>                               
                            </el-col>
                            <el-col :span="4" :offset="1">
                                <span>{{ruleForm.secondSentence.length}}/16</span>
                            </el-col>
                        </el-row>                        
                    </el-form-item>
                    <el-form-item label="第3句" prop="thirdSentence">
                        <el-row>
                            <el-col :span="18">
                                <el-input v-model="ruleForm.thirdSentence" maxlength="16"></el-input>                               
                            </el-col>
                            <el-col :span="4" :offset="1">
                                <span>{{ruleForm.thirdSentence.length}}/16</span>
                            </el-col>
                        </el-row>                        
                    </el-form-item>
                    <el-form-item label="第4句" prop="fourthSentence">
                        <el-row>
                            <el-col :span="18">
                                <el-input v-model="ruleForm.fourthSentence" maxlength="16"></el-input>                               
                            </el-col>
                            <el-col :span="4" :offset="1">
                                <span>{{ruleForm.fourthSentence.length}}/16</span>
                            </el-col>
                        </el-row>                        
                    </el-form-item>      
                    <el-form-item label="匹配课程">
                        <div class="pragramBut" @click="selectCourse(2)">选择</div>
                        <div class="pragramBut redFontColor" v-if="courseSelectState">{{courseObj.courseName||''}}</div>
                        <div class="pragramBut redFontColor" v-else>请选择课程</div>
                    </el-form-item>                                                                                                                   
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                        <el-button @click="resetForm('ruleForm')">取消</el-button>
                    </el-form-item>
                </el-form>            
            </div>
        </div>
        <el-dialog
            title="匹配课程"
            :visible.sync="courseListDialog"
            width="500px"
            class="courseDialogCss"
            :show-close="false"
            :close-on-click-modal="false"
            left>
            <div>
                <div style="margin-bottom:20px; text-align: left;">
                    <el-radio-group 
                        v-model="checkedCities" @change="changePlugin">
                        <el-radio v-for="(city,index) in cities" :label="city.value" :key="index">{{city.name}}</el-radio>
                    </el-radio-group>                  
                </div>                 
                <el-row :gutter="20">
                    <el-col :span="16">
                        <el-input v-model="inputSelect" placeholder="请输入课程名称"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="selectBut">确定</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="courseListCss" v-loading="loading1">
                <ul v-if="courseList.length>0">
                    <li v-for="(item,i) in courseList" :key="i" class="course-layout">
                        <el-radio v-model="courseRadio" :label="item.id">{{item.title}}</el-radio>
                        <div>{{item.sellingPrice||0}}币</div>
                    </li>
                </ul>
                <P v-else>暂无数据</P>
            </div>            
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showCourseList">确 定</el-button>
                <el-button @click="removeDialog">取 消</el-button>
            </span>
        </el-dialog> 
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
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
//特殊符号过滤
function regularState(data){
    var regEn = new RegExp("[`~!@#$^&*%()=|{}':;'\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；《》：”“'。，,.、？]"),
        reg = /^(?!.*\\.*$)/,
        reg1 = /^(?!.*\/\.*$)/;
        if(regEn.test(data)||!reg.test(data)||!reg1.test(data)){   
            return true;
        }else{
            return false;
        }
} 
function regularStateNext(data){
    var regEn = new RegExp("[`~!@#$^&*%=|{}'',?\\[\\].<>/~！@#￥……&*（）——|{}【】‘;:”“'.、]"),
        reg = /^(?!.*\\.*$)/,
        reg1 = /^(?!.*\/\.*$)/;
        if(regEn.test(data)||!reg.test(data)||!reg1.test(data)){   
            return true;
        }else{
            return false;
        }
}
function formatDate(date){
    if(date){
        date = new Date(date);
        var y=date.getFullYear();
        var m=date.getMonth()+1;
        var d=date.getDate();
        var h=date.getHours();
        var m1=date.getMinutes();
        var s=date.getSeconds();
        return y+"-"+m+"-"+d;
    }else{
        return '';
    }
}
function setNewVal(value){
    //替换字符串中的所有特殊字符（包含空格）
    if(value != ""){
        const pattern=/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
        var data = value.replace(pattern,"");
        return data;
    }
}
export default {
    data(){        
        var checkAge = (rule, value, callback) => {
            var self = this;
            var han = /^[\u4e00-\u9fa5]+$/;
            switch (rule.fullField) {
                case "title":
                case "author":               
                case "firstSentence":  
                case "thirdSentence":
                case "fourthSentence":
                case "secondSentence":
                        setTimeout(() => {
                            if (value) {
                                 if (regularStateNext(value)) {
                                    callback(new Error('不能输入特殊字符'));
                                }else if(!han.test(setNewVal(value))){
                                    callback(new Error('请输入汉字。'));
                                }else{
                                    callback();
                                }                            
                            }else{
                                callback();
                            }
                        }, 300);                               
                break;             
            }
        };                                         
        return {
            radio:1,
            courseListDialog:false,   
            courseObj:{
                courseId: '',
                courseName: ""
            },
            disabledRadio:false,
            courseSelectState:true,
            courseRadio:'',
            loading1:false,
            checkedCities:1,
            cities: [
                {
                    name:'自营课程',
                    value:1
                },
                {
                    name:'三方课程',
                    value:2
                }
            ], 
            titleList:[
                {
                    name:'小程序',
                    pathInfo:'/smallProgram/programList'
                },                
                {
                    name:'课程匹配',
                    pathInfo:'/smallProgram/programList'
                },
                {
                    name:'创建诗词',
                    pathInfo:''
                }                
            ],
            courseList:[],
            pickerOptions0:{
                disabledDate(time) {
                    // time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
                    return time.getTime() < Date.now();
                }
            },
            ruleForm: {
                title: '',
                author:'',
                firstSentence:'',
                secondSentence:'',
                thirdSentence:'',
                fourthSentence:'',
                appointedTime:''
            },            
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    {validator: checkAge, trigger: 'blur' }
                ],
                author:[
                    { required: true, message: '请输入作者与朝代', trigger: 'blur' },
                    {validator: checkAge, trigger: 'blur' }
                ],
                firstSentence: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                    {validator: checkAge, trigger: 'blur' }
                ],        
                secondSentence: [
                    {validator: checkAge, trigger: 'blur' }
                ],
                thirdSentence: [
                   {validator: checkAge, trigger: 'blur' }
                ],
                fourthSentence: [
                    {validator: checkAge, trigger: 'blur' }
                ]                
            }, 
            ruleForm1: {
                content: '',
                appointedTime:''
            }, 
            rules1: {
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ]               
            },
            inputSelect:'',
            addOrEditBool:'add',
            selectData:[],
            copyLocaFrom:'',
            ruleFormLocal:'',
            leaveFlag:false,
            leaveDialogVisible:false,
            leavePath:'',
            disabledState:false
        }
    },    
    created(){
        var querys = this.$route.query;
        this.disabledRadio = querys.addOrEdit=='edit'?true:false;
        this.addOrEditBool = querys.addOrEdit;
        switch (querys.addOrEdit) {
            case "add":
                break;
            case "edit":
                this.getDataToFrom(querys.dataInfo);
                break;        
            default:
                break;
        }
        if(this.radio==1){
            this.copyLocaFrom = this.ruleForm1;
        }else{
            this.copyLocaFrom = this.ruleForm;
        }
        this.ruleFormLocal = JSON.stringify(this.copyLocaFrom);
    },
    computed: {},    
    components:{
        breadcrumb
    }, 
    beforeRouteLeave(to, from, next) {
        if(this.radio==1){
            var copyInfo = this.ruleForm1;
        }else{
            var copyInfo = this.ruleForm;
        }        
        this.ruleFormLocalNext = JSON.stringify(copyInfo);   
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
        changePlugin(){
            this.courseList =[];
            this.selectCourse();
        },         
        //路径切换
        leavePage(){
            this.leaveFlag = true;
            this.leaveDialogVisible = false;
            this.$router.push(this.leavePath.path);            
        },        
        //单选切换
        radioSelect(data){
            this.courseSelectState = true;
            this.courseObj={
                courseId: '',
                courseName: ''
            };            
            this.$refs['ruleForm'].resetFields();    
            this.$refs['ruleForm1'].resetFields();                             
        },
        //获取当前课程诗词信息在编辑时；
        getDataToFrom(data){
            // courseId	课程id
            // type  1文字2诗词
            // appointedTime 指定日期yyyy-MM-dd
            // content	内容
            // title	标题
            // author	作者及朝代
            // firstSentence	第一句
            // secondSentence	第二句
            // thirdSentence	第三句
            // fourthSentence	第四句
            this.selectData = data;
            if(data.type==1){
                this.radio = 1;
                this.ruleForm1 = {
                    content: data.content,
                    appointedTime:data.appointedTime                       
                };
            }else{
                this.radio = 2;
                this.ruleForm = {
                    title:data.title,
                    author:data.author,
                    firstSentence:data.firstSentence,
                    secondSentence:data.secondSentence,
                    thirdSentence:data.thirdSentence,
                    fourthSentence:data.fourthSentence,
                    appointedTime:data.appointedTime                     
                }; 
            };
            this.courseObj = {
                courseId: data.courseId,
                courseName: data.courseName                
            };
            this.courseRadio = data.courseId;
        },
        //表单提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                        if(!this.courseObj.courseId){
                            this.courseSelectState = false;
                            return;
                        }
                        switch (formName) {
                            case "ruleForm":
                                this.ruleFormSub("ruleForm");
                                break;
                            case "ruleForm1":
                                this.ruleFormSub("ruleForm1");
                                break;                
                            default:
                                break;
                        }
                } else {
                        return false;
                }
            });
        },
        //文本诗词提交
        ruleFormSub(str){
            var self = this;
            var params ='',
                url = '';
            if(str=='ruleForm'){
                var forms = this.ruleForm;
                params = {
                    title: forms.title,
                    author:forms.author,
                    firstSentence:forms.firstSentence,
                    secondSentence:forms.secondSentence,
                    thirdSentence:forms.thirdSentence,
                    fourthSentence:forms.fourthSentence,
                    appointedTime:formatDate(forms.appointedTime)||'',
                    content:'',
                    courseId:this.courseObj.courseId,
                    type:this.radio,
                };
            }else{
                var forms1 = this.ruleForm1;
                params = {
                    title: '',
                    author:'',
                    firstSentence:'',
                    secondSentence:'',
                    thirdSentence:'',
                    fourthSentence:'',
                    appointedTime:formatDate(forms1.appointedTime)||'',
                    content:forms1.content,
                    courseId:this.courseObj.courseId,
                    type:this.radio,
                };
            }
            if(this.addOrEditBool=="add"){
                url = this.$server.courseMatchingAdd;
            }else{
                url = this.$server.courseMatchingEdit({id:this.selectData.id});
            }
            if(!self.disabledState){
                self.disabledState = !self.disabledState;               
                this.$http.post(url,params).then(res=>{
                if(res.status==200){
                        this.ruleForm1 = {
                                textAreaContent: '',
                                date:''                       
                        };
                        this.ruleForm = {
                                title: '',
                                name:'',
                                content1:'',
                                content2:'',
                                content3:'',
                                content4:'',
                                date:''                      
                        };                   
                        this.courseListDialog = false;
                        this.leaveFlag = true;
                        self.disabledState = !self.disabledState;
                        this.$router.push({path: "/smallProgram/programList"});
                    }else {
                        this.$message.error(res.message);
                    }
                }).catch(()=>{
                    self.disabledState = !self.disabledState;
                })
            }              
        },
        //课程列表选项
        showCourseList(){
            if(this.courseRadio){
                this.courseSelectState = true;
                for (const iterator of this.courseList) {
                    if(iterator.id==this.courseRadio){
                        this.courseObj={
                            courseId:iterator.id,
                            courseName:iterator.title
                        };
                    }
                };
                this.courseListDialog = false;
            }
        },
        //取消
        resetForm(formName) {
            this.$router.push({path: "/smallProgram/programList"});
        },
        removeDialog(){
            this.inputSelect = '';
            // this.courseObj={
            //     courseId: '',
            //     courseName: ""
            // };
            this.courseListDialog = false;
        },
        selectCourse(num){
            var self = this;     
            let query = {
                params:{
                    courseName:this.inputSelect,
                    courseSource:this.checkedCities
                }
            }            
            self.loading1=true;
            self.$http.get(self.$server.coursePragramCourseList,query).then(res=>{
               if(res.status==200){
                   this.courseList = res.content;
                   this.$nextTick(()=>{
                        self.loading1=false;
                   });
                }
            }).catch((err)=>{
                self.loading1=false;
            });             
            this.courseListDialog = true;
        },
        selectBut(){
            this.selectCourse();
        }               
    },
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.wrap-pragram .courseDialogCss .el-dialog .el-dialog__body{
    padding: 10px 20px;
}
.wrap-pragram .courseDialogCss .el-dialog .el-dialog__footer{
    text-align: center;
}
</style>
<style lang="scss" scoped>
.wrap-pragram{
    padding: 0 20px;
    background: #fff;
    .pragramBox{
        padding-top: 30px;
        min-height: 600px;
        .radioCss{
            margin-left: 100px;
        }
        .pragramBoxOne{
            width: 700px;
            margin-top: 40px;
            padding:0 0 30px 0;
            .pragramBut{
                padding: 0 20px;
                width: 100%;
                cursor: pointer;
            }
            .pragramExample{
                width: 150px;
                word-wrap:break-word; 
            }
        }
        .pragramForm{
            width: 400px;
        }
    }
    .dialog-footer{
        text-align: center;
    }    
    .courseListCss{
        max-height: 400px;
        overflow-y: auto;
        ul{
            li{
                margin: 15px 0;
            }
        }
        p{
            text-align: center;
            margin: 20px 0;
        }
    }
    .courseDialogCss{
        .block{
            text-align: center;
            padding: 10px 0 0 0;
        }
    }

}
.course-layout{
    display: flex;
    flex-direction: row;
    justify-content: space-between;    
}
</style>



