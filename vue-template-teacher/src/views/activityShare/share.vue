<template>
    <div>
        <el-row>
            <el-col v-if="!addOrEdit">
                <el-row class="lLine40 headerDiv">
                    <el-col class="lRight-r">
                        <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                    </el-col>
                    <el-col class="lRight-r lMarginTop20">
                        <el-row>
                            <el-col :span="5">
                                <div class="iSeachEven">
                                    <el-input v-model.trim="title"
                                            placeholder="输入活动名称查询"
                                            class="search-form"
                                            width="100%"
                                            clearable
                                            @keyup.native="proving1"
                                            ></el-input>  
                                </div>
                            </el-col>
                            <el-col :span="1"  :offset="1"><el-button v-if="$authJudge('activity:share:select')" class="redBackColor butColorF" @click="search">查询</el-button></el-col>
                            <el-col :span="4" :offset="13"><el-button v-if="$authJudge('activity:share:add')" class="redBackColor butColorF" @click="addOrEditEven('','add')">新建活动分享</el-button></el-col>
                        </el-row>
                    </el-col>
                </el-row>  
                <el-row>
                    <el-col>
                        <el-table
                        :data="tableData"
                        border
                        v-loading="loading"
                        style="width: 100%">
                            <el-table-column
                                prop="sortId"
                                label="序号"
                                align="center"
                                min-width="60">
                            </el-table-column>
                            <el-table-column
                                label="图片"
                                align="center"
                                min-width="100">
                                <template slot-scope="scope">
                                    <div class="course-img">
                                            <img :src="scope.row.iconUrl"
                                                alt="">
                                    </div>
                                </template>
                            </el-table-column>                    
                            <el-table-column
                                prop="title"
                                label="标题"
                                align="center"
                                min-width="120"
                                >
                            </el-table-column>
                            <el-table-column
                                prop="describe"
                                label="描述"
                                align="center"
                                min-width="150">
                            </el-table-column>
                            <el-table-column
                                label="类型"
                                align="center"
                                min-width="100">
                                <template slot-scope="scope">
                                    <el-row>
                                        <el-col v-if="scope.row.type==1">优惠券</el-col>
                                        <el-col v-if="scope.row.type==2">学习卡</el-col>
                                        <el-col v-if="scope.row.type==3">H5活动</el-col>
                                    </el-row>
                                </template>                        
                            </el-table-column>
                            <el-table-column
                                prop="createdAt"
                                label="生成日期"
                                align="center"
                                min-width="150">
                            </el-table-column>                    
                            <el-table-column
                                label="操作"
                                align="center"
                                min-width="120"
                                >
                                <template slot-scope="scope">
                                    <el-row> 
                                        <el-col>
                                            <el-button v-if="$authJudge('activity:share:edit')" type="text" class="black-btn" @click="addOrEditEven(scope.row,'edit')">编辑</el-button>
                                        </el-col> 
                                    </el-row>                                                      
                                </template>
                            </el-table-column>                                                                                   
                        </el-table>
                        <div class="block">
                            <el-pagination
                                background
                                layout="prev, pager, next"
                                @current-change="childPageValue"
                                :current-page.sync="pageAtion.paginationPage"
                                :total="pageAtion.pageTotal">
                            </el-pagination>
                        </div>                
                    </el-col> 
                </el-row>
            </el-col>
            <el-col v-if="addOrEdit" class="headerDiv">
                <div style="width:50%" class="lPaddingTB40">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                        <el-form-item label="标题" prop="title">
                            <el-input class="fl" style="width:60%" v-model="ruleForm.title" maxlength="20"></el-input>
                            <div class="fl lMarginL10">{{ruleForm.title.length||0}}/20</div>
                        </el-form-item>         
                        <el-form-item label="描述" prop="describe">
                            <el-input type="textarea" 
                            maxlength="30"
                            :autosize="{ minRows: 6}" 
                            v-model="ruleForm.describe"></el-input>
                            <div class="absoluteCss" style="right: -40px;bottom: 0;">{{ruleForm.describe.length||0}}/30</div>
                        </el-form-item> 
                        <el-form-item label="上传图片">
                                <P>尺寸 : 200*200px ; 大小 : ≤200k </P>
                                <el-upload
                                class="avatar-uploader"
                                :action="actiosService"
                                :show-file-list="false"
                                :headers="myHeaders"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                                >
                                <img v-if="ruleForm.iconUrl" :src="ruleForm.iconUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                        </el-form-item>  
                        <el-form-item label="活动关联类型" prop="radio">
                            <el-radio-group v-model="ruleForm.radio">
                                <el-radio :label="1">优惠券</el-radio>
                                <!-- <el-radio :label="2">学习卡</el-radio> -->
                                <el-radio :label="3">H5活动</el-radio>
                            </el-radio-group>
                        </el-form-item>     
                        <el-form-item >
                            <el-row>
                                <el-col v-if="assembleStyle==1">
                                    <el-row :gutter="5">
                                        <el-col :span="4" class="lLeft-"><el-button @click="courseChooseEven" type="text" class="greenColor textUnderline">请选择</el-button></el-col>
                                        <el-col :span="10" class="lLeft-r redFontColor lSize12" v-show="courseIdBool">*请选择活动关联类型列表信息</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col class="lLeft-r">{{ruleForm.courseChooseName}}</el-col>
                                    </el-row>
                                </el-col>
                                <el-col v-else>
                                        {{ruleForm.courseChooseName}}
                                </el-col>
                            </el-row>                            
                        </el-form-item>                                            
                        <el-form-item>
                            <el-button @click="dialogIsNo(1)">取消</el-button>
                            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                        </el-form-item>                                              
                    </el-form>                      
                </div>        
            </el-col>
        </el-row>
        <el-dialog
        :visible.sync="centerDialogList"
        :close-on-click-modal='false'
        max-height="300"
        width="30%">
            <el-row>
                <el-col>
                     <el-row :gutter="20">
                        <el-col :span="18" class="lCenter-r">
                            <el-input placeholder="请输入内容"  @keyup.native="proving2" v-model="inputCourseTwo"></el-input>
                        </el-col>
                        <el-col :span="6" class="lCenter-r">
                            <el-button class="redBackColor butColorF" @click="courseSeach">查找</el-button>
                        </el-col>                                                 
                     </el-row>
                </el-col>
                <el-col class="lMarginTop30">
                        <el-table
                            ref="multipleTable"
                            :data="tableDataCourse"
                            tooltip-effect="dark"
                            v-loading="loading1"
                            style="width: 100%"
                            max-height="300"
                            @selection-change="handleSelectionChange">
                            <el-table-column
                            type="selection"
                            :selectable="selectable"
                            width="55">
                            </el-table-column>
                            <el-table-column
                            prop="name"
                            align="center"
                            label="活动关联名称">
                            </el-table-column>
                        </el-table>
                </el-col>
                <el-col class="lMarginTop20">
                    <el-row>
                        <el-col :span="6" class="lCenter-r" :offset="6">
                            <el-button @click="dialogIsNo(2)">取消选择</el-button>
                        </el-col>
                        <el-col :span="6" class="lCenter-r">
                            <el-button class="redBackColor butColorF" @click="courselistIsOkOrNo()">确定选择</el-button>
                        </el-col>
                    </el-row>
                </el-col>  
            </el-row>
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
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import Dialog from "@/components/myDialog/myDialog";
export default {
    data(){                      
        return {
            myHeaders: {token: getToken()},
            tableData: [],
            tableDataCourse:[],
            addOrEdit:false,
            pageNo:1,
            pageSize:10, 
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            urlScienceBools:1,
            title:'',
            titleList:[
                        {
                            name:'活动',
                            pathInfo:'/activityObjList'
                        },
                        {
                            name:'活动分享',
                            pathInfo:''
                        } 
            ],
            ruleForm: {
                title: '',
                describe: '',
                radio: 1,
                iconUrl:'',
                courseChooseName:'',
                targetId:'',
                id:''
            },
            rules: {
                    title: [
                        { required: true, message: '请输入标题名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    describe: [
                        { required: true, message: '请输入描述内容', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                    ],
                    radio: [
                        { required: true, message: '请选择活动关联类型', trigger: 'change' }
                    ]                    
            },
            assembleStyle:1,
            inputCourseTwo:'',
            loading1:false,
            loading:true,
            multipleSelection:[],  
            courseIdBool:false,
            centerDialogList:false,
            dataUpdateBool:{},
            newFormVideoUrl:'',
            editsObj:{
                showFlag:false, //是否显示遮罩弹框；
                title:"温馨提示", //Dialog 的标题
                cancelName:'editObjNos', //自定义取消事件名字
                sureName:'editObjOks', //自定义确定事件名字,                        
            },
            toPath:{},
            dataChange:false,  
            addOrUpdateStates:'',
            disabledState:false               
        }
    },
    created(){
        if(this.environmenttarget=='prod'){
            this.urlScienceBools = 1;
        }else if(this.environmenttarget=='beta'){
            this.urlScienceBools = 2;
        }else{
            this.urlScienceBools = 1;
        };
        this.getStudylist(1);
    },
    computed:{
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }
        
    },   
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        var newFormData = JSON.stringify(this.fileList);
        var newFormVideo = JSON.stringify(this.videoUrl);
        if(this.addOrUpdateStates=="edit"||this.addOrUpdateStates=='add'){
            if(this.value==1){
                if(this.dataUpdateBool!==newFormData||this.dataChange){
                    //next方法传true或者不传为默认历史返回，传false为不执行历史回退
                    this.editsObj.showFlag = true;
                    this.toPath = to;
                    next(false);         
                }else{
                    next();
                };
            }else{
                if(this.newFormVideoUrl!==newFormVideo||this.dataChange){
                    //next方法传true或者不传为默认历史返回，传false为不执行历史回退
                    this.editsObj.showFlag = true;
                    this.toPath = to;
                    next(false);         
                }else{
                    next();
                };
            }
        }else{
            next();
        }

    },    
    methods:{
        couponEditObjOk(){
                var self = this;
                self.dataUpdateBool = JSON.stringify({});
                self.fileList = {};
                self.newFormVideoUrl = JSON.stringify('');
                self.videoUrl = '';  
                self.dataChange = false;          
                self.$router.push({path:self.toPath.path});           
            },
        couponEditObjNo(){
                this.editsObj.showFlag = false;
        },         
        //课程选择 
        courseChooseEven(){
            this.getTableCourse();
            this.inputCourseTwo='';
            if(this.ruleForm.radio>0){
                this.centerDialogList = true;
            }else{
                this.centerDialogList = false;
            }
            
        },       
        //选择活动分享关联
        getTableCourse(){
            var self = this;        
            var parems = {
                name:self.inputCourseTwo,
                type:self.ruleForm.radio
            };
            self.loading1=true;
            self.$http.get(self.$server.activityGetOptionList(parems)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   self.tableDataCourse = contentdate;
               }
               self.loading1=false;
            }).catch((err)=>{
                self.loading1=false;
            });            
        }, 
        courseSeach(){
            this.getTableCourse();
        },        
        proving2(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.inputCourseTwo)){
                this.inputCourseTwo='';
            }             
        },    
        dialogIsNo(num){
            switch (num) {
                case 1:
                    this.addOrUpdateStates='';
                    this.addOrEdit = false;
                    break;
                case 2:
                    this.$refs.multipleTable.clearSelection();
                    break;
                case 3:
                    // this.lowerShelfDialogVisible = false;
                    break;                                  
                default:
                    break;
            }
        }, 
        //选择课程
        courselistIsOkOrNo(){
           this.centerDialogList = false;
           this.ruleForm.targetId = this.multipleSelection[0].id;
           this.ruleForm.courseChooseName = this.multipleSelection[0].name;
           if(this.ruleForm.targetId){
               this.courseIdBool = false;
           }
        },                 
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },                         
        //上传
        handleAvatarSuccess(res, file) {
            // this.ruleForm.iconUrl = URL.createObjectURL(file.raw);
            this.ruleForm.iconUrl = res.content.resourceUrl;
        },
        selectable(){
            if(this.multipleSelection.length <1){
                    return true;
            }            
        },        
        beforeAvatarUpload(file) {
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < 0.201;
            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG,PNG,JPEG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 200k!');
            }            
            const isSize = new Promise(function(resolve, reject) {
                            let width = 200;
                            let height = 200;
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
                            this.$message.error('上传的图片必须是等于200*200!');
                            return Promise.reject();
                });
            return isJPG && isLt2M && isSize;
        },        
        proving1(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.title)){
                this.title='';
            }             
        },        
        submitForm(formName) {
            var self = this;
            if(self.ruleForm.iconUrl.length==''){
                this.$message.error('请上传图片');
                return;
            }
            if(self.ruleForm.targetId==''){
                self.courseIdBool = true;
                return;
            }else{
                self.courseIdBool = false;
            }          
            this.$refs[formName].validate((valid) => {
            if (valid) {
                var url = '';
                var parems = {
                    title:self.ruleForm.title,
                    describe:self.ruleForm.describe,
                    iconUrl:self.ruleForm.iconUrl,
                    type:self.ruleForm.radio,
                    targetId:self.ruleForm.targetId
                };                
                if(self.addOrUpdateStates=="edit"){
                    parems['id']=self.ruleForm.id;
                    url = self.$server.activityUpdate;
                }else{
                    url = self.$server.activityAdd;
                }
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;                    
                    self.$http.post(url,parems).then(res=>{
                        if(res.status==200){
                            self.disabledState = !self.disabledState;
                            self.addOrEdit = false;
                            self.getStudylist(1);
                        }
                    }).catch(()=>{
                            self.disabledState = !self.disabledState;
                    })
                }                
            } else {
                return false;
            }
            });
        },
        channeUpdateEven(rows){
            this.addOrEdit = true;
        },   
      
        search(){
            this.getStudylist(1);
        },
        //
        addOrEditEven(data,status){
            var self = this;
            if(status=='add'){
               self.ruleForm= {
                        title: '',
                        describe: '',
                        radio: 1,
                        iconUrl:'',
                        courseChooseName:'',
                        targetId:'',
                        id:''
                    }
            }else{
                 self.ruleForm.title=data.title;
                 self.ruleForm.describe=data.describe;
                 self.ruleForm.radio=data.type;
                 self.ruleForm.iconUrl=data.iconUrl;
                 self.ruleForm.courseChooseName=data.targetName;
                 self.ruleForm.targetId=data.targetId;
                 self.ruleForm.id=data.id;
            }
            self.addOrUpdateStates = status;
            self.addOrEdit = true;
        },
        getStudylist(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            var params = {
                title:self.title,
                pageNo:self.pageNo,
                pageSize:self.pageSize
            };
            self.$http.get(self.$server.activityShareList(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        listIds = contentdate.list.map(function(element,index){
                            if(contentdate.pageNum==1){
                                element.sortId = index+1;
                                return element;
                            }else if(contentdate.pageNum>1){
                                element.sortId = (contentdate.pageNum-1)*10+index+1;
                                return element;
                            }
                        }); 
                   };  
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loading = false; 
               }
                console.log(res);
            })            
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        }
    },
    components:{
        breadcrumb,
        Dialog
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
.headerDiv .iSeachEven{
    width: 100%;
    position: relative;
}
.iSeachEvenSun{
    width: 25%;
    position: relative;
    margin-bottom: 20px;
}
.iSeachEvenSun i{
    position: absolute;
    right: 8px;
    font-size: 18px;
    top: 12px;
    cursor: pointer;
}
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
.black-btn-ok{
    color:#9E0E00 !important; 
} 
.black-btn-no{
    color: #cccccc !important;
}   
.course-img {
    width: 75px;
    height: 45px;
    margin-right: 20px;
    border-radius: 5px;
    margin: auto;
    overflow: hidden;
}
.course-img .img{
       width: 100%;
        height: 100%;
}
.avatar-uploader .el-upload {
border: 1px dashed #d9d9d9;
border-radius: 6px;
cursor: pointer;
position: relative;
overflow: hidden;
}
.avatar-uploader .el-upload:hover {
border-color: #409EFF;
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
.has-gutter .el-checkbox .el-checkbox__inner{
    display: none;
}
</style>


