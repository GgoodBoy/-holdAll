<template>
    <div>
        <el-row class="lLine40 headerDiv">
           <Breadcrumb :menuList ='titleList' style="margin-bottom:20px"></Breadcrumb>
            <el-col class="lRight-r">
                <el-form ref="form" 
                        :model="form" 
                        label-width="90px" 
                        label-position="left"
                        class="module-details"
                        :rules="rules"
                        >
                        <section class="form-module fontCss14">
                            <el-form-item label="名称" prop="name">
                                <el-row>
                                    <el-col :span="6">
                                        <el-input maxlength="10" v-model="form.name" placeholder=" "></el-input>
                                    </el-col>
                                    <el-col :span="1" class="lCenter-r">{{form.name.length||0}}/10</el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="批次" prop="batch">
                                <el-row>
                                    <el-col :span="6"><el-input :disabled='!isAdd' v-model="form.batch" type="text" maxlength="4" placeholder="4位整数数字"></el-input></el-col>
                                    <el-col :span="1" class="lCenter-r">{{form.batch.length||0}}/4</el-col>
                                </el-row>
                            </el-form-item>    
                            <el-form-item label="选择课程">
                                <el-row>
                                    <el-col :span="6" class="lLeft-r">
                                        <el-button class="lButtom" @click="curseclick">选择</el-button>
                                        <span v-if="courseList.length>0">已添加<span style='color:#B4272D'>{{courseList.length}}</span>门课程</span>
                                    </el-col>
                                    <el-col :span="6" class="lLeft-r redFontColor" v-show="couserBool">
                                        *请添加课程
                                    </el-col>
                                </el-row>                        
                                <div class="listCourse">
                                    <el-row class="lLine40" v-for="(item,index) in courseList" :key="index">
                                        <el-col :span="20" class="lPaddingRF10 butColor textEllipsis">{{item.courseName}}</el-col>
                                        <el-col :span="3" :offset="1" class="lCenter-r" ><i @click="removeThisCourse(item)" class="el-icon-close"></i></el-col>
                                    </el-row>
                                </div>
                            </el-form-item>    
                        </section>
                        <el-row>
                            <el-col class="lCenter-r">
                                <el-button class="lButtomNo lMarginTB50" @click="returnpage">取消</el-button>
                                <el-button class="lButtomOk lMarginTB50" :loading="loadDailg" @click="submitForm('form')">确定</el-button>
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
                   <courseListPlugin v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIdList" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>      
            </div>                    
        </el-dialog>
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
                case "batch":
                    // let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,20}$/;
                    // let regExp = /^[0-9a-zA-Z]*$/g;
                    let regExp = /^[0-9]*$/g;
                    if(value==''){
                        callback(new Error('请输入内容'))
                    }else{
                        if(!regExp.test(value)){
                            // callback(new Error('批次为数字字母组合'))
                            callback(new Error('批次为数字'))
                        }else if(value.length!=4){
                             callback(new Error('请填写4位整数'))
                        }else{
                            callback()
                        }
                    }
                break;                
            }
        };                
        return {
            form:{
                batch:"",
                courseIdList:[],
                name:'',
            },           
            urls:'/wisdomPlatform/getCourseList',
            courseselectType:"creatWisdom",
            couserBool:false,
            disabledState:false,
            courseList:[],
            rules:{ 
                name: [
                    { required: true,min: 1, max: 20, message: '请填写名称', trigger: 'blur' }
                ], 
                batch: [
                    {required: true, validator: checkAge, trigger: 'blur' }
                ]                           
            },
            loadDailg:false,
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                    }
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
                    pathInfo:'/xgxWisdom/indexxOne'
                },
                {
                    name:'B端课程管理',
                    pathInfo:'/xgxWisdom/indexxOne'
                }
            ],
            //新组建
            varObj:{
                pageType:false,//是否分页
                mtypeText:true,//是否显示成人少儿分类
                coursrTitleStr:'creatWisdom',
                pipelineType:true                
            },     
            dialogVisibleFour:false,
            getData:'',
            isAdd:true          
    }},
    created(){      
        if(this.$route.query.editData){
            this.getData = JSON.parse(this.$route.query.editData);
            this.form.batch=this.getData.batch;
            this.form.name=this.getData.name;
            this.isAdd = false;     
            this.titleList.push({
                    name:'编辑B端课程',
                    pathInfo:''                
            });
            this.getReturnCourseList();     
        }else{
            this.titleList.push({
                    name:'新建B端课程',
                    pathInfo:''                
            });
        }
        
    },
    props:[],
    computed:{  },
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
        getReturnCourseList(){       
            var self = this;                     
            self.$http.get(self.$server.wisdomBatchCourseDetail+this.getData.id).then(res=>{
                if(res.status==200){
                    self.courseList = [];
                    /*
                                    "content":iterator.id,
                                    "courseName":iterator.title,
                                    "no":'',
                                    "type":2,
                                    "originalPrice":iterator.originalPrice||0,
                                    "sellingPrice":iterator.sellingPrice||0    
                    */
                    res.content.courses.forEach((elements,index)=>{
                        self.courseList.push(
                            {
                                "content":elements.courseId,
                                "courseName":elements.courseName,
                                "no":'',
                                "originalPrice":0,
                                "sellingPrice":0
                            }
                        );
                    });
                    self.form.courseIdList = res.content.courses.map(x=>{
                        return x.courseId;
                    });                     
                }
            })
            .catch(res => {});             
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
            this.$router.push({path:"/xgxWisdom/indexxOne"});
            console.log("取消");
        },
        submitForm(formName){
            var self = this;
            let parmesObj ={};
            if(!self.loadDailg){
                self.loadDailg = true;
                if(self.courseList==0){
                    self.couserBool = true;
                    self.loadDailg = false; 
                    return;                  
                }       
                self.$refs[formName].validate((valid) => {
                        if (valid) {
                            let urls = '';
                                var parems = {
                                        batch:self.form.batch,
                                        courseIds:self.form.courseIdList.toString(),
                                        name:self.form.name
                                };
                                if(self.isAdd){
                                    urls = self.$server.wisdomAddCourse
                                }else{
                                    parems['id'] = this.getData.id;
                                    urls = self.$server.wisdomModifyCourse
                                }
                                self.disabledState = !self.disabledState;                               
                                self.$http.post(urls,parems).then(res=>{
                                    if(res.status==200){
                                            self.dataUpdateBool = JSON.stringify({});
                                            self.form = {};
                                            self.loadDailg = false; 
                                            this.$router.push({path:"/xgxWisdom/indexxOne"});
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
            width: 350px;
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


