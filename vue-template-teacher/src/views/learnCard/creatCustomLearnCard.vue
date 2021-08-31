<template>
    <div>
        <!-- <el-row class="lLine40 headerDiv" v-show="!boolpluginForDetail"> -->
        <el-row class="lLine40 headerDiv">
           <Breadcrumb :menuList ='titleList' style="margin-bottom:20px"></Breadcrumb>
            <el-col class="lRight-r">
                <el-form ref="form" 
                        v-loading = "loadDailg"
                        :model="form" 
                        label-width="120px" 
                        label-position="right"
                        class="module-details"
                        :rules="rules"
                        >
                        <section class="form-module fontCss14">
                            <el-form-item label="名称" prop="name">
                                <el-row>
                                    <el-col :span="6"><el-input maxlength="10" v-model="form.name" placeholder=" "></el-input></el-col>
                                </el-row>
                            </el-form-item>
                           <el-form-item label="类型" prop="useType">
                                <el-row>
                                    <el-col :span="12" style="text-align: left;">
                                        <el-radio-group v-model="form.useType">
                                            <el-radio :label="1">学校</el-radio>
                                            <el-radio :label="2">其他</el-radio>
                                        </el-radio-group>   
                                    </el-col>                                 
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
                                            placeholder="选择日期" 
                                            v-model="form.receiveValidatily" 
                                            @change="dateChangeEndTime"
                                            style="width: 100%;"></el-date-picker>
                                        </el-col>
                                    </el-row>
                            </el-form-item>
                            <el-form-item label="选择课程">
                                <el-row>
                                    <el-col :span="3" class="lLeft-r">
                                        <el-button class="lButtom" @click="curseclick">选择</el-button>
                                    </el-col>
                                    <el-col :span="6" class="lLeft-r redFontColor" v-show="couserBool">
                                        *请添加课程
                                    </el-col>
                                </el-row>                        
                                <div class="listCourse">
                                    <el-row class="lLine40" v-for="(item,index) in courseList" :key="index">
                                        <el-col :span="18" class="lPaddingRF10 butColor">{{item.courseName}}</el-col>
                                        <el-col :span="4" :offset="2" class="lCenter-r" ><i @click="removeThisCourse(item)" class="el-icon-close"></i></el-col>
                                    </el-row>
                                </div>
                            </el-form-item>                            
                            <el-form-item label="学习卡有效期" prop="useValidatily" class="timeDeleteButton">
                                <el-row>
                                    <el-col :span="6"><el-input v-model.number="form.useValidatily" placeholder="≥1≤730,0为无限制"></el-input></el-col>
                                    <el-col :span="1" class="lCenter-r">天</el-col>
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
                                <el-button class="lButtomOk lMarginTB50" @click="submitForm('form')">生成</el-button>
                            </el-col>
                        </el-row>                
                </el-form>
            </el-col>
        </el-row>
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="false"
        width="30%"
        >
            <div class="centerCss">
                   <!-- <courseListPlugin v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIds" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>     -->
                   <courseListPlugin v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIdList" :numbersBool="false"   :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>      
            </div>                    
        </el-dialog>
        <!-- <courseselect :varObjs='varObj' v-if="boolpluginForDetail" :urlPorp="urls" :chooseIdlist="form.courseIdList" :numbersBool="false"   :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseselect> -->
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
// import courseselect from "@/components/Appconfigpage/ACourseSelect/coursesselect"; //推存选择课程组件
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
export default {
    components:{
        Breadcrumb,
        // courseselect,
        courseListPlugin,
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
                case "useValidatily":
                        if (value==="") {
                                return callback(new Error('请填写天数'));
                            }
                            setTimeout(() => {
                                if (!Number.isInteger(value)) {
                                    callback(new Error('请输入正整数'));
                                } else {
                                    if (value>730) {
                                    callback(new Error('最多730天'));
                                    } else {
                                    callback();
                                    }
                                }
                            }, 1000);
                break;                             
                case "batch":
                    // let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,20}$/;
                    let regExp = /^[0-9a-zA-Z]*$/g;
                    if(value==''){
                        callback(new Error('请输入内容'))
                    }else{
                        if(!regExp.test(value)){
                            callback(new Error('批次为数字字母组合'))
                        }else{
                            callback()
                        }
                    }
                break;                
            }
        };                
        return {
            form:{
                num:'',
                batch:"",
                remarks:'',
                useValidatily:'',
                courseIdList:[],
                receiveValidatily:'',
                name:'',
                useType:''
                // type:2
            },           
            urls:'/coupons/getCourseListForCoupon',
            courseselectType:"learnCard",
            couserBool:false,
            disabledState:false,
            courseList:[],
            // rangeDataNum:0,
            rules:{ 
                name: [
                    { required: true,min: 1, max: 20, message: '请填写名称', trigger: 'blur' }
                    // { min: 1, max: 20, message: '请填写名称', trigger: 'blur' }
                ], 
                useType: [
                    { required: true, message: '请选择类型', trigger: 'change' }
                ],                               
                num:[
                    {required: true, validator:checkAge, trigger: 'blur' },
                ], 
                batch: [
                    {required: true, validator: checkAge, trigger: 'blur' }
                ],
                receiveValidatily: [
                    {required: true, validator: checkAge, trigger: 'change' }
                ],
                remarks: [
                    {validator: checkAge, trigger: 'blur' }
                ],
                useValidatily:[
                    {required: true, validator: checkAge, trigger: 'blur' }
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
            toPath:{},
            titleList:[
                {
                    name:'系统合集',
                    pathInfo:'/marketelistlist'
                },
                {
                    name:'定制精品课系统',
                    pathInfo:'/marketelist/customLearnCard'
                },
                {
                    name:'生成定制学习卡',
                    pathInfo:''
                }
            ],
            //新组建
            varObj:{
                pageType:false,//是否分页
                mtypeText:true,//是否显示成人少儿分类
                coursrTitleStr:'courseName'
            },     
            dialogVisibleFour:false             
    }},
    created(){       
    },
    props:[],
    computed:{    
        // boolpluginForDetail(){ 
        //     return this.$store.state.appConfig.appStore.boolpluginForDetail
        // }        
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
            next();0
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
            this.form.receiveValidatily=Number(value);
            // this.form.receiveValidatily=this.formatDate(Number(value));
            // this.rangeDataNum = Math.ceil((Number(new Date(this.form.receiveValidatily))-Number(new Date()))/86400000)+1;
            // this.rangeDataNum = Math.ceil((Number(value)-Number(new Date()))/86400000);
        },        
        //删除当前选项；
        removeThisCourse(e){
            var self = this;
            var list =[];
            self.courseList.forEach((element,index) => {
                if(e.content==element.content){
                    self.courseList.splice(index,1);
                }
            });
            self.form.courseIdList.forEach((element,index) => {
                if(e.content!=element){
                    list.push(element)
                }
            });
            self.form.courseIdList = list;
        },        
        //点击课程弹框
        curseclick(){
        //   this.$store.state.appConfig.appStore.boolpluginForDetail=true;
          this.dialogVisibleFour = true;
        },        
        //点击课程数据渲染
        listSelectEven(data){
            var self = this;
            if(data.bool){
                self.form.courseIdList = [];
                // self.$store.state.appConfig.appStore.boolpluginForDetail=false;
                self.dialogVisibleFour = false;
                self.courseList = data.datas;
                if(self.courseList&&self.courseList.length){
                    self.couserBool = false;
                }
                data.datas.forEach(element => {
                    self.form.courseIdList.push(element.content);
                });
            }else{
                self.dialogVisibleFour = false;
            }

        },
        //切换路径取消    
        couponEditObjNo(){
            console.log("取消");
            this.editsObj.showFlag = false;
        },
        //切换路径确定
        couponEditObjOk(){
            var self = this;
            self.dataUpdateBool = JSON.stringify({});
            self.form = {};
            self.$router.push({path:self.toPath.path});    
        },
        returnpage(){
            this.$router.push({path:"/marketelist/customLearnCard"});
            console.log("取消");
        },
        submitForm(formName){
            var self = this;
            let parmesObj ={};
            self.loadDailg = true;
            if(self.courseList==0){
                self.couserBool = true;
                self.loadDailg = false; 
                return;                  
            }else{
                self.couserBool = false;
            }   
            // self.form.receiveValidatily = self.form.receiveValidatily>Number(new Date)?self.form.receiveValidatily:Number(new Date)+1000;         
            self.$refs[formName].validate((valid) => {
            if (valid) {
                    if (valid) {
                            // self.form.price = Number(self.form.price);
                            var parems = {
                                    num:self.form.num,
                                    batch:self.form.batch,
                                    remarks:self.form.remarks,
                                    useValidatily:self.form.useValidatily,
                                    courseIdList:self.form.courseIdList,
                                    receiveValidatily:self.formatDate(self.form.receiveValidatily),
                                    name:self.form.name,
                                    type:2,
                                    useType:self.form.useType
                            };
                            if(!self.disabledState){
                                self.disabledState = !self.disabledState;                               
                                self.$http.post(self.$server.studyCardAadd,parems).then(res=>{
                                    if(res.status==200){
                                            // parmesObj = {
                                            //     id:res.content.cardBaseId,
                                            //     token:getToken()
                                            // };
                                            //  self.download2(self.$server.studyCardExport(parmesObj))
                                            self.dataUpdateBool = JSON.stringify({});
                                            self.disabledState = !self.disabledState;
                                            self.form = {};
                                            self.loadDailg = false; 
                                            this.$router.push({path:"/marketelist/customLearnCard"});
                                    }else{
                                        self.loadDailg = false;
                                        self.disabledState = !self.disabledState;
                                    }
                                });
                            }                     
                            console.log("验证通过");
                        } else {
                            console.log("验证未通过");
                            this.loadDailg = false;
                            return false;
                    }
                console.log("验证通过");
                self.loadDailg = false;
            } else {
                console.log("验证未通过");
                self.loadDailg = false;
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
.headerDiv .module-details .form-module .listCourse{
            width: 200px;
            max-height: 100px;
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


