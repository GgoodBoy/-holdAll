<template>
    <div class="specialBox">   
        <!-- <div v-show="!boolpluginForDetail&&specialOrShare==1"> -->
            <div v-show="specialOrShare==1">
            <breadcrumb :menuList ='titleList'></breadcrumb>    
            <div class="creatSpecial whilteBack">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="分享标题" prop="shareTitle">
                        <el-input style="width:80%" maxlength="16" v-model="ruleForm.shareTitle"></el-input>
                        <span class="lMarginL10">{{ruleForm.shareTitle.length||0}}/16</span>
                    </el-form-item>
                    <el-form-item label="分享描述" prop="shareDescribe">
                        <el-input style="width:80%" maxlength="30" type="textarea" v-model="ruleForm.shareDescribe"></el-input>
                        <span class="lMarginL10">{{ruleForm.shareDescribe.length||0}}/30</span>
                    </el-form-item>    
                    <el-form-item label="分享图标"
                                    prop="shareIcon">
                        <!-- surfacePlot -->
                        <p class="form-hint">100*100支持PNG、JPG格式，小于1MB</p>
                        <el-upload class="avatar-uploader"
                                    :action="action"
                                    :headers="commonHeader"
                                    :before-upload="(file)=>{return beforeUpload(file,[100,100],1)}"
                                    :show-file-list="false"
                                    :on-error="specialErrorOne"
                                    :on-success="specialSuccessOne">
                            <img v-if="ruleForm.shareIcon"
                                    :src="ruleForm.shareIcon"
                                    class="avatar">
                            <i v-else
                                class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>  
                    <el-form-item label="专题名称" prop="name">
                        <el-input style="width:80%" maxlength="16" v-model="ruleForm.name"></el-input>
                        <span class="lMarginL10">{{ruleForm.name.length||0}}/16</span>
                    </el-form-item>
                    <el-form-item label="专题背景"
                                    prop="backgroundUrl">
                        <!-- surfacePlot -->
                        <p class="form-hint">750*526支持PNG、JPG格式，小于1MB</p>
                        <el-upload class="avatar-uploader"
                                    :action="action"
                                    :headers="commonHeader"
                                    :before-upload="(file)=>{return beforeUpload(file,[750,526],1)}"
                                    :show-file-list="false"
                                    :on-error="specialErrorTwo"
                                    :on-success="specialSuccessTwo">
                            <img v-if="ruleForm.backgroundUrl"
                                    :src="ruleForm.backgroundUrl"
                                    class="avatar">
                            <i v-else
                                class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>        
                    <el-form-item label="APP列表展示图"
                                    prop="appShowImgUrl">
                        <!-- surfacePlot -->
                        <p class="form-hint">690*280支持PNG、JPG格式，小于1MB</p>
                        <el-upload class="avatar-uploader"
                                    :action="action"
                                    :headers="commonHeader"
                                    :before-upload="(file)=>{return beforeUpload(file,[690,280],1)}"
                                    :show-file-list="false"
                                    :on-error="specialErrorFour"
                                    :on-success="specialSuccessFour">
                            <img v-if="ruleForm.appShowImgUrl"
                                    :src="ruleForm.appShowImgUrl"
                                    class="avatar">
                            <i v-else
                                class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>                             
                    <div class="couresCss lMarginTop20" v-for="(cours,i) in courseListCreat" :key="i">
                        <el-form-item label="课程背景">
                            <p class="form-hint">750*900支持PNG、JPG格式，小于1MB</p>
                            <el-upload class="avatar-uploader"
                                        :action="action"
                                        :headers="commonHeader"
                                        :before-upload="(file)=>{return beforeUpload(file,cours.size,1)}"
                                        :show-file-list="false"
                                        :on-error="(file)=>{return specialErrorThree(file,i)}"
                                        :on-success="(file)=>{return specialSuccessThree(file,i)}">
                                <img v-if="cours.backgroundUrl"
                                        :src="cours.backgroundUrl"
                                        class="avatar">
                                <i v-else
                                    class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>   
                            <p class="lLeft-r redFontColor" v-show="courseListIndexImg==i">
                                 *请添课程背景图
                            </p>              
                        </el-form-item>   
                        <el-form-item label="关联课程">
                            <el-row>
                                <el-col>
                                    <el-button class="lLeft-r lButtom" @click="curseclick(cours.sortId)">选择课程</el-button>
                                </el-col>
                                <el-col class="lLeft-r redFontColor" v-show="courseListIndex==i">
                                    *请添加课程
                                </el-col>
                            </el-row> 
                            <div class="listCourse">
                                <el-row class="lLine40" v-for="(item,index) in cours.courseList" :key="index">
                                    <el-col :span="20" class="lPaddingRF10 grayColor">{{item.courseName}}</el-col>
                                    <el-col :span="2" :offset="2" class="lCenter-r" ><i @click="removeThisCourse(item,cours.sortId)" class="el-icon-close"></i></el-col>
                                </el-row>
                            </div>                                   
                        </el-form-item>  
                        <div :class="(i==0||i==(courseListCreat.length-1))?'operateBox2':'operateBox1'">
                            <div class="operateCss lMarginTB10 butColor" @click="moveBot(cours)" v-show="i<(courseListCreat.length-1)">下移</div>
                            <div class="operateCss lMarginTB10 butColor" @click="moveTop(cours)" v-show="i>0">上移</div>
                            <div class="operateCss lMarginTB10 butColor" @click="deleteCourse(cours)">删除</div>
                        </div>               
                    </div>
                    
                    <el-form-item class="lMarginTop20">
                       
                    </el-form-item>
                </el-form>
                <div style="textAlign:center">
                    <el-button  @click="addCourseEven(newIds)">添加新课程</el-button>
                </div>
                <div style="textAlign:center;margin:20px 0">
                    <el-button type="primary" @click="submitForm('ruleForm')">生成</el-button>
                    <el-button @click="shareSpecia()">预览</el-button>
                </div>
            </div> 
        </div>
        <div class="shareBox" v-show="specialOrShare==2">
            <div class="returnUpdate" @click="returnUpdate">{{shareStates==2?'《返回列表':'《返回修改'}}</div>
            <div class="shareContent">
                <div class="specialCssImg">
                    <!-- <P class="speciaNameCss">{{ruleForm.name}}</p> -->
                    <img v-bind:src="ruleForm.backgroundUrl"/>
                    <!-- <div class="seeCourseDetail"> 查看课程>> </div> -->
                </div>                
                <div class="courseImg" v-for="(item,index) in courseListCreat" :key="index" @click="routerCourse(item)">
                    <img v-bind:src="item.backgroundUrl"/>
                    <div class="seeCourseDetail"> 查看课程>> </div>
                </div>
            </div>
        </div>
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="false"
        width="50%"
        >
            <div class="centerCss">
                   <!-- <courseListPlugin v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIds" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>     -->
                   <courseListPlugin v-if="dialogVisibleFour" :urlPorp="urls" :varObjs='varObj' :chooseIdlist="ruleForm.courseIds" :numbersBool="1" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>      
            </div>                    
        </el-dialog>        
        <!-- <courseselect :urlPorp="urls" :closeBox="false" :varObjs='varObj' :chooseIdlist="ruleForm.courseIds" :numbersBool="1"  v-if="boolpluginForDetail" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseselect>    -->
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
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
// import courseselect from "@/components/Appconfigpage/ACourseSelect/coursesselect";
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
import { getToken,setToken,removeToken} from '@/utils/auth';
import Dialog from "@/components/myDialog/myDialog";
export default {
    components:{
        breadcrumb,
        // courseselect,
        courseListPlugin,
        Dialog
    },    
    data(){
        return { 
            ruleForm: {
                shareTitle: '',
                name:'',
                shareIcon:'',
                appShowImgUrl:'',
                backgroundUrl:'',
                shareDescribe: '',
                courseIds:[]
            },      
            disabledState:false,
            titleList:[
                        {
                            name:'活动',
                            pathInfo:'/activityObjList'
                        },
                        {
                            name:'专题列表',
                            pathInfo:'/activityObj/specialList'
                        },
                        {
                            name:'发布专题',
                            pathInfo:''
                        }                 
            ],
            rules: {
                name: [
                    { required: true, message: '请输入专题名称', trigger: 'blur' },
                    { min: 1, max: 16, message: '长度在1到16 个字符', trigger: 'blur' }
                ],
                shareTitle: [
                    { required: true, message: '请输入分享名称', trigger: 'blur' },
                    { min: 1, max: 16, message: '长度在1到16 个字符', trigger: 'blur' }
                ],                
                shareDescribe: [
                    { required: true, message: '请填写分享描述', trigger: 'blur' }
                ],
                backgroundUrl: [
                    {
                        required: true,
                        message: "请上专题景图",
                        trigger: "change"
                    }
                ], 
                shareIcon: [
                    {
                        required: true,
                        message: "请上分享图标",
                        trigger: "change"
                    }
                ],  
                appShowImgUrl: [
                    {
                        required: true,
                        message: "请上APP列表展示图",
                        trigger: "change"
                    }
                ],                                
            },
            courseListCreat:[],
            urls:'/course/getNameList', 
            courseselectType:"coupon",  
            loading:false,
            action :'',        
            commonHeader: {}, 
            courseModelId:'',
            newIds:1,
            courseList:[],
            courseListStats:true,
            courseListIndex:-1,
            courseListIndexImg:-1,
            specialId:'',
            specialOrShare:0,
            shareStates:0,
            dataUpdateBool:'',
            editsObj:{
                showFlag:false, //是否显示遮罩弹框；
                title:"温馨提示", //Dialog 的标题
                cancelName:'editObjNos', //自定义取消事件名字
                sureName:'editObjOks', //自定义确定事件名字,                        
            },
            //新组建
            varObj:{
                mtype:1,//指定显示类型:1.成人,2.少儿
                pageType:false,//是否分页
                mtypeText:false,//是否显示成人少儿分类
                pipelineType:false//渠道搜索是否显示
            },     
            dialogVisibleFour:false                        
        }
    },
    created(){
        this.commonHeader = {
            token: getToken()
        };        
        this.specialId = this.$route.query.selectId;
        this.varObj.mtype = this.$route.query.mtype||'';
        this.shareStates = Number(this.$route.query.states);
        this.action = this.$server.actionImgOrvideo;
        if(this.specialId){
            this.dataRestoration(this.specialId);
        }else{
            this.specialOrShare = 1;
        }
        this.dataUpdateBool =  JSON.stringify(this.ruleForm)
    },
    props:[],
    computed:{ 
        // boolpluginForDetail(){
        //     return this.$store.state.appConfig.appStore.boolpluginForDetail
        // },           
    },     
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        var newFormData = JSON.stringify(this.form);
        if(this.dataUpdateBool!==newFormData&&this.shareStates!=2){
            //next方法传true或者不传为默认历史返回，传false为不执行历史回退
            this.editsObj.showFlag = true;
            this.toPath = to;
            next(false);         

        }else{
            // this.$store.state.appConfig.appStore.boolpluginForDetail = false;
            this.dialogVisibleFour = false;
            next();
        };
    },     
    methods:{             
        couponEditObjOk(){
            var self = this;
            self.dataUpdateBool = JSON.stringify({});
            self.form = {};
            self.$router.push({path:self.toPath.path});           
        },
        couponEditObjNo(){
            this.editsObj.showFlag = false;
        },           
        //数据还原;
        dataRestoration(ids){
            var self = this;
            var parems = {
                id:Number(ids)
            }
            this.$http.get(this.$server.thematicActivityView(parems)).then(res=>{
               if(res.status==200){
                   self.specialOrShare = Number(self.shareStates); 
                   var data = res.content;
                    self.ruleForm = {
                        shareTitle: data.shareTitle,
                        name:data.name,
                        shareIcon:data.shareIcon,
                        backgroundUrl:data.backgroundUrl,
                        appShowImgUrl:data.appShowImgUrl,
                        shareDescribe: data.shareDescribe,
                    };
                    self.varObj.mtype = data.type;
                    for (const iterator of data.courseList) {
                        self.courseListCreat.push(
                            {
                                backgroundUrl:iterator.backgroundUrl,
                                size:[750,900],
                                courseList:[{
                                    courseName:iterator.courseName,
                                    content:iterator.courseId
                                }],
                                courseIds:[iterator.courseId],
                                sortId:iterator.sort                        
                            }
                        )
                    }           
               }
            })             
        },
        moveBot(parmes){
            var self = this;
            var indexs = '';
            var item='';
            var lists =[];
            if(self.courseListCreat.length){
                self.courseListCreat.forEach((element,i) => {
                        if(element.sortId!==parmes.sortId){
                            lists.push(element);
                        }else{
                            item = element;
                            indexs = i;
                        }
                });
                if(self.courseListCreat.length!==(indexs+1)){
                    lists.splice(indexs+1, 0, item);
                }else{
                    lists.splice(indexs, 0, item);
                }
            }
            self.courseListCreat = lists;       
        },
        moveTop(parmes){
            var self = this;
            var indexs = '';
            var item='';
            var lists =[];
            if(self.courseListCreat.length){
                self.courseListCreat.forEach((element,i) => {
                        if(element.sortId!==parmes.sortId){
                            lists.push(element);
                        }else{
                            item = element;
                            indexs = i;
                        }
                });
                if(indexs){
                    lists.splice(indexs-1, 0, item); 
                }else{
                    lists.splice(indexs, 0, item); 
                }
            }
            this.courseListCreat = lists;
        },  
        deleteCourse(parmes){
            var self = this;
            var lists =[];
            if(self.courseListCreat.length){
                self.courseListCreat.forEach((element,i) => {
                        if(element.sortId!==parmes.sortId){
                            lists.push(element);
                        }
                });
            }
            this.courseListCreat = lists;
        }, 
        specialSuccessOne(response, file) {
            if (response.status == 200) {
                this.ruleForm.shareIcon = response.content.resourceUrl;
                this.$refs["ruleForm"].validateField("shareIcon");
            } else {
                this.$message.error(response.message);
            }
        },
        specialSuccessTwo(response, file) {
            if (response.status == 200) {
                this.ruleForm.backgroundUrl = response.content.resourceUrl;
                this.$refs["ruleForm"].validateField("backgroundUrl");
            } else {
                this.$message.error(response.message);
            }
        },
        specialSuccessFour(response, file) {
            if (response.status == 200) {
                this.ruleForm.appShowImgUrl = response.content.resourceUrl;
                this.$refs["ruleForm"].validateField("appShowImgUrl");
            } else {
                this.$message.error(response.message);
            }
        },        
        specialSuccessThree(file, index) {
            var self = this;
            self.courseListCreat[index].backgroundUrl = file.content.resourceUrl;
        },                
        //上传错误
        specialErrorOne(err, file, fileList) {
            if (err.message) {
                try {
                    let msg = JSON.parse(err.message).message;
                    this.$message.error(msg);
                    return;
                } catch (e) {}
            }
            this.$message.error(JSON.stringify(err));
        },  
        specialErrorFour(err, file, fileList) {
            if (err.message) {
                try {
                    let msg = JSON.parse(err.message).message;
                    this.$message.error(msg);
                    return;
                } catch (e) {}
            }
            this.$message.error(JSON.stringify(err));
        },            
        specialErrorTwo(err, file, fileList) {
            if (err.message) {
                try {
                    let msg = JSON.parse(err.message).message;
                    this.$message.error(msg);
                    return;
                } catch (e) {}
            }
            this.$message.error(JSON.stringify(err));
        },   

        specialErrorThree(file, index) {
            this.fileList[index].loading= false;
            this.$message.error('上传图片大小不能超过 2MB!');    
        },                  
        //上传前验证
        beforeUpload(file,size,nextSize) {
            var self = this;
            self.courseListIndexImg=-1;
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < nextSize;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG,JPEG,PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片最大为'+nextSize+'M!');
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
                this.$message.error('上传的图片必须是等于'+size[0]+'*'+size[1]+'!');
                return Promise.reject();
            });
            return isJPG && isLt2M && isSize;   
        },        
        submitForm(formName) {
            var self = this;
            self.courseListStats = true;
            self.courseListIndex = -1;
            self.courseList =[];
            this.$refs[formName].validate((valid) => {
            if (valid) {
                for(var i=0, len = self.courseListCreat.length ; i< len ; i++){
                    if(self.courseListCreat[i].backgroundUrl.length==0){
                            self.courseListIndexImg = i;
                            self.courseListStats = false;
                            break;
                    }                    
                    if(self.courseListCreat[i].courseList.length==0){
                            self.courseListIndex = i;
                            self.courseListStats = false;
                            break;
                    }                                      
                }   
                if(self.courseListStats){
                    if(self.courseListCreat.length){
                        self.courseListCreat.forEach((element,i) => {
                            self.courseList.push({
                                courseId:element.courseIds,
                                backgroundUrl:element.backgroundUrl,
                                sort:element.sortId
                            });
                        }); 
                    }
                    var parems = {
                        id:self.specialId,
                        name:self.ruleForm.name,
                        backgroundUrl:self.ruleForm.backgroundUrl,
                        shareTitle:self.ruleForm.shareTitle,
                        appShowImgUrl:self.ruleForm.appShowImgUrl,
                        shareDescribe:self.ruleForm.shareDescribe,
                        shareIcon:self.ruleForm.shareIcon,
                        courseList:JSON.stringify(self.courseList),
                        type:self.varObj.mtype
                    };
                    if(!self.disabledState){
                        self.disabledState = !self.disabledState;                   
                        self.$http.post(this.$server.thematicActivitySave,parems).then(res=>{
                            if(res.status==200){ 
                                this.form={};
                                self.disabledState = !self.disabledState;
                                self.dataUpdateBool = JSON.stringify({});
                                self.$router.push({path:'/activityObj/specialList'});  
                            }
                        }).catch(()=>{
                            self.disabledState = !self.disabledState;
                        })
                    }                     
                }
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        shareSpecia() {
            this.specialOrShare = 2;
        },
        returnUpdate(){
            if(this.shareStates==2){
                this.$router.push({path:'/activityObj/specialList'});  
            }else{
                 this.specialOrShare = 1;
            }
        },
        routerCourse(data){

        },
        listSelectEven(data){
            var self = this;
            if(data.bool){
                if(self.courseListCreat.length){
                    self.courseListCreat.forEach((element,i) => {
                        if(element.sortId==self.courseModelId){
                            self.courseListCreat[i].courseList = [];
                            self.courseListCreat[i].courseIds = [];
                            // self.$store.state.appConfig.appStore.boolpluginForDetail=false;
                            self.dialogVisibleFour = false;
                            self.courseListCreat[i].courseList = data.datas; 
                            data.datas.forEach(element1 => {
                                self.courseListCreat[i].courseIds.push(element1.content)
                            });     
                        }
                    }); 
                }                
            }else{
                self.dialogVisibleFour = false;
            }                
        },
        curseclick(index){
            var self = this;
            self.courseModelId=index;
            self.courseListIndex = -1;
            self.courseListCreat.forEach((element,i) => {
                if(element.sortId==index){
                    self.ruleForm.courseIds = self.courseListCreat[i].courseIds;
                    // self.$store.state.appConfig.appStore.boolpluginForDetail=true;
                    self.dialogVisibleFour = true;
                }
            });             
        },   
        removeThisCourse(e,indexId){
            var self = this;
            var list =[];
            var objs = '';
            var objsId ='';
            self.courseModelId=indexId;
            if(self.courseListCreat.length){
                self.courseListCreat.forEach((element,i) => {
                    if(element.sortId==self.courseModelId){
                        objs = self.courseListCreat[i].courseList;
                        objsId = self.courseListCreat[i].courseIds;
                        objs.forEach((element,index) => {
                            if(e.content==element.content){
                                objs.splice(index,1);
                            }
                        });
                        objsId.forEach((element,index) => {
                            if(e.content!=element){
                                list.push(element)
                            }
                        }); 
                        self.courseListCreat[i].courseIds = list;                       
                    }
                }); 
            }          
        },
        addCourseEven(){
            var self = this;
            self.courseListIndex = -1;
            self.courseListIndexImg = -1;
            if(self.courseListCreat.length){
                self.courseListCreat.forEach((element,i) => {
                        if(element.sortId==self.newIds||element.sortId>self.newIds){
                            self.newIds = self.newIds+1;
                        }
                }); 
            }            
            var objs = {
                backgroundUrl:'',
                size:[750,900],
                courseList:[],
                courseIds:[],
                sortId:self.newIds
            }
            self.courseListCreat.push(objs)
        }                         
    },
    watch: {}, 
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.specialBox{
    width: 100%;
}
.creatSpecial{
    margin: 30px auto;
    padding: 20px;
    max-height: 700px;
    min-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    width: 50%;
}
.creatSpecial .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.creatSpecial .avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.creatSpecial .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 98px;
    height: 98px;
    line-height: 98px;
    text-align: center;
}
.creatSpecial .avatar {
    width: 98px;
    height: 98px;
    display: block;
} 
.creatSpecial .couresCss{
    border: 1px solid #ADADAD;
    width: 100%;
    position: relative;
}
.creatSpecial .operateBox1{
    position: absolute;
    right: 5px;
    top:30%;
}
.creatSpecial .operateBox2{
    position: absolute;
    right: 5px;
    top:35%;
}
.operateBox1 .operateCss,.operateBox2 .operateCss{
    cursor: pointer;
}
.listCourse{
    width: 180px;
    margin: auto;
}
.listCourse .lLine40{
    border:1px solid #82C4F5;
    margin: 5px 0;
}
.listCourse .lLine40 i{
    font-weight:bold;
    cursor: pointer;
}
.el-loading-spinner{
    margin-top: -40px;
}
.shareBox .shareContent{
    width: 375px;
    margin: auto;
}
.shareBox .returnUpdate{
    font-size: 16px;
    cursor: pointer;
}
.shareBox .shareContent .courseImg{
    width: 100%;
    padding: 0 0 30px 0;
    position: relative;
    margin: 10px 0;
    border: 1px solid #ADADAD;
    background: #ffffff;
}
.shareBox .shareContent .specialCssImg{
    width: 100%;
    position: relative;
    margin: 10px 0;
    border: 1px solid #ADADAD;
    background: #ffffff;
    font-size: 0;
}
.shareBox .shareContent .specialCssImg img{
    width: 100%;
}
.shareBox .shareContent .courseImg img{
    width: 100%;
}
/* .shareBox .shareContent .courseImg .speciaNameCss{
    padding: 10px;
    text-align: center;
    font-size: 18px;
} */
.shareBox .shareContent .courseImg .seeCourseDetail{
    position: absolute;
    bottom: 5px;
    right: 5px;
}
</style>


