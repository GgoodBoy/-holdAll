<template>
    <div>
        <!-- <el-row class="lLine40 headerDiv" v-show="!boolpluginForDetail"> -->
        <el-row class="lLine40 headerDiv">
            <el-col class="lSize18">
                <Breadcrumb :menuList ='titleList' style="margin-bottom:20px"></Breadcrumb>
            </el-col>
            <el-col class="lRight-r">
                <el-form ref="form" 
                        :model="form" 
                        label-width="120px" 
                        label-position="right"
                        class="module-details"
                        :rules="rules"
                        >
                        <section class="form-module fontCss14">
                           <el-form-item label="选择添加类型" >
                                <el-row>
                                    <el-col :span="12" style="text-align: left;">
                                        <el-radio-group v-model="form.radio">
                                            <el-radio :label="1">单个添加</el-radio>
                                            <el-radio :label="2">批量添加</el-radio>
                                        </el-radio-group>   
                                    </el-col>                                 
                                </el-row>                               
                            </el-form-item> 
                            <el-form-item label="输入手机号" prop="cellphone" v-if="form.radio==1">
                                <el-row>
                                    <el-col :span="6"><el-input v-model="form.cellphone" type="text" maxlength="11" placeholder=" "></el-input></el-col>
                                    <el-col :span="1" class="lCenter-r">{{form.cellphone.length||0}}/11</el-col>
                                </el-row>
                            </el-form-item>  
                           <el-form-item label="选择身份" v-if="form.radio==1">
                                <el-row>
                                    <el-col :span="12" style="text-align: left;">
                                        <el-radio-group v-model="form.identity">
                                            <el-radio :label="1">普通</el-radio>
                                        </el-radio-group>   
                                    </el-col>                                 
                                </el-row>                               
                            </el-form-item>    
                           <el-form-item label="" v-if="form.radio==1">
                               <div class="tableSun" >
                                   <div class="tableSunLi">
                                       <div class="tips">昵称:</div>
                                       <div>{{nickName}}</div>
                                   </div>
                                   <div class="tableSunLi">
                                       <div class="tips">头像:</div>
                                       <div>{{avatar}}</div>
                                   </div>
                                   <div class="tableSunLi">
                                       <div class="tips">性别:</div>
                                       <div>                         
                                            <el-select style="width:140px" v-model="form.gender" placeholder="保密">
                                                <el-option
                                                v-for="item in genders"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </div>
                                   </div>
                                   <div class="tableSunLi">
                                       <div class="tips">出生日期:</div>
                                       <div>    
                                            <el-date-picker
                                                v-model="form.birthDate"
                                                style="width:140px"
                                                type="date"
                                                placeholder="选择日期">
                                            </el-date-picker>
                                        </div>
                                   </div>
                                   <div class="tableSunLi">
                                       <div class="tips">学历:</div>
                                       <div>                         
                                            <el-select style="width:140px" v-model="form.education" placeholder="选择学历">
                                                <el-option
                                                v-for="(item,index) in educationList"
                                                :key="index"
                                                :label="item"
                                                :value="item">
                                                </el-option>
                                            </el-select>
                                        </div>
                                   </div>
                                   <div class="tableSunLi">
                                       <div class="tips">行业:</div>
                                       <div>                         
                                            <el-select style="width:140px" v-model="form.industry" placeholder="选择行业">
                                                <el-option
                                                v-for="(item,index) in industryList"
                                                :key="index"
                                                :label="item"
                                                :value="item">
                                                </el-option>
                                            </el-select>
                                        </div>
                                   </div>
                                   <div class="tableSunLi">
                                       <div class="tips">职业:</div>
                                       <div>                         
                                            <el-select style="width:140px" v-model="form.occupation" placeholder="选择职业">
                                                <el-option
                                                v-for="(item,index) in occupationList"
                                                :key="index"
                                                :label="item"
                                                :value="item">
                                                </el-option>
                                            </el-select>
                                        </div>
                                   </div>
                                   <div class="tableSunLi">
                                       <div class="tips">兴趣:</div>
                                       <div>{{interest}}</div>
                                   </div>
                                </div>                      
                            </el-form-item>  
                           <el-form-item label="昵称" v-if="form.radio==2" style="text-align: left;">
                                <div>{{nickName}}</div>                              
                            </el-form-item> 
                           <el-form-item label="头像" v-if="form.radio==2" style="text-align: left;">
                                <div>{{avatar}}</div>                              
                            </el-form-item> 
                           <el-form-item label="兴趣" v-if="form.radio==2" style="text-align: left;">
                                <div>{{interest}}</div>                              
                            </el-form-item>                          
                            <el-form-item label="用户来源" style="text-align: left;" v-if="form.radio==1">                          
                                <el-select v-model="form.origin" placeholder="用户来源" style="width:200px;">
                                    <el-option
                                    v-for="item in originArr"
                                    :key="item.code"
                                    :label="item.origin"
                                    :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>                                                        
                            <el-form-item label="用户渠道" style="text-align: left;">
                                <span>系统默认</span>                             
                            </el-form-item>                                                      
                            <el-form-item label="批量导入" style="text-align: left;width:300px;" v-if="form.radio==2">
                                <el-upload
                                class="upload-demo"
                                :action="actiosService"
                                :headers="myHeaders"
                                :before-upload="beforeAvatarUpload"
                                :multiple="false"
                                :limit="1"
                                :on-success="handleAvatarSuccess"
                                :on-error="handleError"
                                :on-exceed="handleExceed"
                                :file-list="fileList">
                                <el-button size="small" class="redBackColor butColorF">导入</el-button>
                                </el-upload>
                            </el-form-item>                            
                            <el-form-item label="" style="text-align: left;" v-if="form.radio==2">
                                <el-button size="small" class="redBackColor butColorF" @click="headExport">下载模板</el-button>  
                                <span style="color:#ccc;">模板导入时注意字段格式，已注册用户不可再次导入，一个模板只能有一个身份。</span>                           
                            </el-form-item> 
                        </section>
                        <el-row>
                            <el-col class="lCenter-r">
                                <el-button class="lButtomNo lMarginTB50" @click="returnpage">{{form.radio==1?'取消':'返回'}}</el-button>
                                <el-button class="lButtomOk lMarginTB50" :loading="loadDailg" v-if="form.radio==1" @click="submitForm('form')">确定</el-button>
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
        return {
            form:{
                cellphone:"",
                identity:1,
                radio:1,
                gender:'',
                birthDate:'',
                occupation:'',
                industry:'',
                education:'',
                origin:''
            },           
            remarks:'系统默认',
            nickName:'系统默认',
            avatar:'系统默认',
            interest:'系统默认',
            disabledState:false,
            myHeaders: {token: getToken()},
            rules:{ 
                cellphone: [
                    { required: true,min: 11, max: 11, message: '请输入手机号', trigger: 'blur' }
                ]                             
            },
            loadDailg:false,
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
                    name:'用户管理系统',
                    pathInfo:''
                },
                {
                    name:'手动注册',
                    pathInfo:''
                }
            ],    
            //新项目状态字段
            genders:[
                {
                    value:'1',
                    label:'男'
                },
                {
                    value:'0',
                    label:'女'
                },
                {
                    value:'2',
                    label:'保密'
                }
            ],
            originArr:[],
            educationList:[],//学历
            industryList:[],//行业  
            occupationList:[],//职业      
            fileList: []
    }},
    created(){       
        this.getAllDataList();
        this.getListComeDate();
    },
    props:[],
    computed:{  
        actiosService(){
            return this.$server.getWisdomImportRegister;
        }       
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
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleAvatarSuccess(res, file) {
            console.log("上传成功",res);
            if(res.status==200){
                this.$message.success('导入文件成功!');
            }else{
                this.fileList=[];
                this.$message.error(res.message);
            }
            
        },  
        handleError(res, file){
            console.log("上传失败");
        },
        beforeAvatarUpload(file){
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?false:true;
            // const isLt2M = file.size / 1024 / 1024 < 0.5;
            if (!isJPG) {
            this.$message.error('上传文件格式错误!');
            }        
            // return isJPG && isLt2M && isSize;     
            return isJPG;      
        },
        /**
         * 导出
         */
        headExport(){
            let token = getToken()
            let url = `${this.$server.getWisdomDownloadExcelModel}?token=${token}`
            window.open(url)
        },        
        formatDate(date,type){
            if(date){
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                var h=date.getHours();
                var m1=date.getMinutes();
                var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;
                if(type=="end"){
                    h = 23;
                    m1 = 59;
                    s = 59;                
                }else{
                    h = h<10?("0"+h):h;
                    m1 = m1<10?("0"+m1):m1;
                    s = s < 10 ? ("0" + s) : s;
                }
                // return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
                return y+"-"+m+"-"+d;
            }else{
                return '';
            }
        },
        getAllDataList(){
            this.$http.get(this.$server.wisdomGetOccupationList).then(res=>{
                if(res.status==200){
                    this.occupationList = res.content;
                }
            })   
            this.$http.get(this.$server.wisdomGetIndustryList).then(res=>{
                if(res.status==200){
                    this.industryList = res.content;
                }
            })
            this.$http.get(this.$server.wisdomGetEducationList).then(res=>{
                if(res.status==200){
                    this.educationList = res.content;
                }
            })         
        },          
        //渠道类型数据
        getListComeDate(){
            var self = this;
            self.$http.get(self.$server.getOriginList).then(res=>{
                if(res.status){
                    self.originArr = res.content;
                }
            })
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
            this.$router.push({path:"/userFilesHome"});
            console.log("取消");
        },
        submitForm(formName){
            var self = this;
            if(!self.loadDailg){
                self.loadDailg = true;
                let formBool = true;
                if(!self.form.gender){
                    formBool = false;
                    self.$message.error("请选择性别。");
                }else if(!self.form.birthDate){
                    formBool = false;
                    self.$message.error("请选择出生日期。");
                }else if(!self.form.industry){
                    formBool = false;
                    self.$message.error("请选择行业。");
                }else if(!self.form.education){
                    formBool = false;
                    self.$message.error("请选择学历。");
                }else if(!self.form.occupation){
                    formBool = false;
                    self.$message.error("请选择职业。");
                }else if(!self.form.origin){
                    formBool = false;
                    self.$message.error("请选择用户来源。");
                }
                if(!formBool) {
                     self.loadDailg = false;
                     return;
                };
                self.$refs[formName].validate((valid) => {
                        if (valid) {
                            var parems = {
                                    cellphone:self.form.cellphone,
                                    gender:self.form.gender,
                                    birthDate:self.formatDate(self.form.birthDate,'start'),
                                    industry:self.form.industry,
                                    education:self.form.education,
                                    occupation:self.form.occupation,
                                    origin:self.form.origin
                            };
                            self.disabledState = !self.disabledState;                               
                            self.$http.post(self.$server.setHandleRegister,parems).then(res=>{
                                if(res.status==200){
                                        self.dataUpdateBool = JSON.stringify({});
                                        self.form = {};
                                        self.loadDailg = false; 
                                        this.$router.push({path:"/userFilesHome"});
                                }else{
                                    self.loadDailg = false;
                                }
                            })
                            .catch(res => {
                                    self.loadDailg=false;
                            }); 
                        } else {
                            console.log("验证未通过");
                            this.loadDailg = false;
                            return false;
                        }
                });   
            }         
        },                              
    },
    watch: {
    }, 
    mounted(){}
}
</script>

<style scoped lang="scss">
.tableSun{
    width: 260px;
    border: 1px solid #ccc;
    padding: 20px;
    .tableSunLi{
        display: flex;
        flex-direction: row;
        justify-content:flex-start;
        align-items: center;
        margin-bottom: 10px;
        .tips{
            width: 70px;
            text-align: right;
            margin-right: 5px;
        }
    }
}
.tableSun2{
    width: 260px;
    padding: 20px;
    .tableSunLi{
        display: flex;
        flex-direction: row;
        justify-content:flex-start;
        align-items: center;
        margin-bottom: 10px;
        .tips{
            width: 50px;
            text-align: right;
            margin-right: 5px;
        }
    }
}
</style>
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


