<template>
    <div class="headerDiv">  
            <el-row class="lLine40">
                <el-col class="lMarginBO20">
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col> 
                <el-col :span="5" class="lMarginBO20">
                    <div style="float:left;margin-right:10px;">分类:</div>
                    <el-select v-model="selectType" placeholder="请选择类型" style="width:80%;float:left">
                        <el-option :label="item.label" :value="item.value" v-for="item,i in optionsStyle" :key="i"></el-option>
                    </el-select>
                </el-col> 
                <el-col :span="2" class="lLeft-r lMarginBO20">
                    <el-button v-if="$authJudge('source:sharemould:select')" class="lSize14-i redBackColor butColorF" @click="chooseVersionType(selectType)">查询</el-button>
                </el-col>                 
                <el-col :span="3" :offset="14" class="lRight-r lMarginBO20">
                    <el-button v-if="$authJudge('source:sharemould:add')" class="lSize14-i redBackColor butColorF" @click="creaNewCode">新建模板</el-button>
                </el-col>                              
            </el-row>
            <el-row :gutter="20" v-loading="loading">
                <el-col :span="6" class="lLeft-r lMarginBO20" v-for="(item,index) in tableData" :key="index">
                    <!-- <div class="graybackE8Div"> -->
                        <el-row class="graybackE8">
                            <el-col class="lPadding10">
                                <el-row style="line-height: 24px;">
                                    <el-col :span="10">
                                        <el-switch
                                        v-model="item.stateVal"
                                        @change="value4Cahgne(item,item.stateVal)"
                                        :disabled="(item.stateVal==1&&!$authJudge('source:sharemould:forbidden'))||(item.stateVal==0&&!$authJudge('source:sharemould:open'))"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949">
                                        </el-switch>                                        
                                    </el-col>
                                    <el-col :span="4" class="lCenter-r" style="color:#B4272D;min-width:30px;">{{item.type==1?'课程':'APP'}}</el-col>
                                    <el-col :span="10" class="lRight-r">
                                        <el-button v-if="$authJudge('source:sharemould:forbidden')" :disabled="item.stateVal" class="pad4px" icon="el-icon-delete" circle @click="removeBackImg(item)"></el-button>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col class="graybackE8Img lCenter-r lPaddingRF10">
                                <img v-bind:src="item.backgroundUrl"/>
                            </el-col>
                            <el-col class="lLeft-r lSize12 lPadding10" style="line-height: 14px;">
                                <p>{{item.name}}</p>
                            </el-col>
                        </el-row>
                    <!-- </div> -->
                </el-col>
                <el-col class="lMarginTop30 lCenter-r">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue"
                        :page-size="pageSizeNum"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
                </el-col>             
            </el-row>
        <el-dialog
        :visible.sync="centerDialogCerat"
        title=""
        :close-on-click-modal='false'
        max-height="300"
        :show-close='false'
        width="35%">  
            <el-row class="lSize16 ruleFormCss" v-loading="loading1">
                <el-col>
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="标题:" prop="title">
                            <el-input style="width:50%;" type="text" maxlength="10" @keyup.native="proving" v-model="ruleForm.title" ></el-input>
                            <span>{{ruleForm.title.length}}/10</span>
                        </el-form-item>
                        <el-form-item label="上传背景:" prop="title">
                            <el-row>
                                <el-col :span="15">
                                    <el-upload
                                        class="upload-demo"
                                        :action="actiosService"
                                        :headers="myHeaders"
                                        :on-success="(res, file, fileList)=>{return handleAvatarSuccess(res, file, fileList,'backImg')}"
                                        :before-upload="(file)=>{return beforeAvatarUpload(file,[750,1334],1)}"
                                        :on-remove="(file, fileList)=>{return handleRemove(file, fileList,'backImg')}"
                                        :on-exceed="handleExceed"
                                        :file-list="fileList1">
                                        <el-button size="small" type="primary">选择图片</el-button>
                                        <div slot="tip" class="el-upload__tip">尺寸：750*1334；大小：≤1M</div>
                                    </el-upload>                                    
                                </el-col>
                                <el-col :span="8" :offset="1" class="lCenter-r">
                                    <img v-bind:src="ruleForm.backgroundUrl"/>
                                </el-col>
                            </el-row>
                        </el-form-item>      
                        <el-form-item label="上传缩略图:" prop="title">
                            <el-row>
                                <el-col :span="15">
                                    <el-upload
                                        class="upload-demo"
                                        :action="actiosService"
                                        :headers="myHeaders"
                                        :on-success="(res, file, fileList)=>{return handleAvatarSuccess(res, file, fileList,'iconImg')}"
                                        :before-upload="(file)=>{return beforeAvatarUpload(file,[100,100],0.2)}"
                                        :on-remove="(file, fileList)=>{return handleRemove(file, fileList,'iconImg')}"
                                        :on-exceed="handleExceed"
                                        :file-list="fileList2">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">尺寸：100*100；大小：≤200K</div>
                                    </el-upload>                                    
                                </el-col>
                                <el-col :span="8" :offset="1" class="lCenter-r">
                                    <img v-bind:src="ruleForm.iconUrl"/>
                                </el-col>
                            </el-row>
                        </el-form-item>                                          
                        <el-form-item>
                            <el-button style="margin-left:25%;" @click="closeDialog(1)">取消</el-button>
                            <el-button style="margin-left:5%;" :disabled="contenIsOk" class="redBackColor butColorF" @click="submitForm('ruleForm')">确定</el-button>
                        </el-form-item>                        
                    </el-form>                    
                </el-col>               
            </el-row>
        </el-dialog> 
        <el-dialog
        :visible.sync="appCenterDialogCerat"
        title=""
        max-height="300"
        :show-close='false'
        width="35%">  
            <el-row class="lSize16 ruleFormCss" v-loading="loading2">
                <el-col>
                    <el-form :model="ruleForm1" status-icon :rules="rules1" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="标题:" prop="title">
                            <el-input style="width:50%;" type="text" maxlength="10" @keyup.native="proving1" v-model="ruleForm1.title" ></el-input>
                            <span>{{ruleForm1.title.length}}/10</span>
                        </el-form-item>
                        <el-form-item label="上传背景"></el-form-item>                        
                        <el-form-item label="IOS:">
                            <el-row>
                                <el-col :span="16">
                                    <el-upload
                                        class="upload-demo"
                                        :action="actiosService"
                                        :headers="myHeaders"
                                        :on-success="(res, file, fileList)=>{return handleAvatarSuccess1(res, file, fileList,'backImg','imgs')}"
                                        :before-upload="(file)=>{return beforeAvatarUpload1(file,[750,850],1,'imgs')}"
                                        :on-remove="(file, fileList)=>{return handleRemove1(file, fileList,'backImg','imgs')}"
                                        :on-exceed="handleExceed"
                                        :file-list="fileList3">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">尺寸：750*850；大小：≤1M</div>
                                    </el-upload>                                    
                                </el-col>
                                <el-col :span="7" :offset="1" class="lCenter-r imgStye">
                                    <img v-bind:src="ruleForm1.backgroundUrl"/>
                                </el-col>
                            </el-row>
                        </el-form-item>  
                        <el-form-item label="安卓1:">
                            <el-row>
                                <el-col :span="16">
                                    <el-upload
                                        class="upload-demo"
                                        :action="actiosService"
                                        :headers="myHeaders"
                                        :on-success="(res, file, fileList)=>{return handleAvatarSuccess1(res, file, fileList,'backImg','imgs1')}"
                                        :before-upload="(file)=>{return beforeAvatarUpload1(file,[750,850],1,'imgs1')}"
                                        :on-remove="(file, fileList)=>{return handleRemove1(file, fileList,'backImg','imgs1')}"
                                        :on-exceed="handleExceed"
                                        :file-list="fileList4">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">尺寸：750*850；大小：≤1M</div>
                                    </el-upload>                                    
                                </el-col>
                                <el-col :span="7" :offset="1" class="lCenter-r imgStye">
                                    <img v-bind:src="ruleForm1.backgroundUrl1"/>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="安卓2:">
                            <el-row>
                                <el-col :span="16">
                                    <el-upload
                                        class="upload-demo"
                                        :action="actiosService"
                                        :headers="myHeaders"
                                        :on-success="(res, file, fileList)=>{return handleAvatarSuccess1(res, file, fileList,'backImg','imgs2')}"
                                        :before-upload="(file)=>{return beforeAvatarUpload1(file,[750,980],1,'imgs2')}"
                                        :on-remove="(file, fileList)=>{return handleRemove1(file, fileList,'backImg','imgs2')}"
                                        :on-exceed="handleExceed"
                                        :file-list="fileList5">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">尺寸：750*980；大小：≤1M</div>
                                    </el-upload>                                    
                                </el-col>
                                <el-col :span="7" :offset="1" class="lCenter-r imgStye">
                                    <img v-bind:src="ruleForm1.backgroundUrl2"/>
                                </el-col>
                            </el-row>
                        </el-form-item>    
                        <el-form-item label="安卓3:">
                            <el-row>
                                <el-col :span="16">
                                    <el-upload
                                        class="upload-demo"
                                        :action="actiosService"
                                        :headers="myHeaders"
                                        :on-success="(res, file, fileList)=>{return handleAvatarSuccess1(res, file, fileList,'backImg','imgs3')}"
                                        :before-upload="(file)=>{return beforeAvatarUpload1(file,[750,1130],1,'imgs3')}"
                                        :on-remove="(file, fileList)=>{return handleRemove1(file, fileList,'backImg','imgs3')}"
                                        :on-exceed="handleExceed"
                                        :file-list="fileList6">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">尺寸：750*1130；大小：≤1M</div>
                                    </el-upload>                                    
                                </el-col>
                                <el-col :span="7" :offset="1" class="lCenter-r imgStye">
                                    <img v-bind:src="ruleForm1.backgroundUrl3"/>
                                </el-col>
                            </el-row>
                        </el-form-item>   
                        <el-form-item label="安卓4:">
                            <el-row>
                                <el-col :span="16">
                                    <el-upload
                                        class="upload-demo"
                                        :action="actiosService"
                                        :headers="myHeaders"
                                        :on-success="(res, file, fileList)=>{return handleAvatarSuccess1(res, file, fileList,'backImg','imgs4')}"
                                        :before-upload="(file)=>{return beforeAvatarUpload1(file,[750,1540],1,'imgs4')}"
                                        :on-remove="(file, fileList)=>{return handleRemove1(file, fileList,'backImg','imgs4')}"
                                        :on-exceed="handleExceed"
                                        :file-list="fileList7">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">尺寸：750*1540；大小：≤1M</div>
                                    </el-upload>                                    
                                </el-col>
                                <el-col :span="7" :offset="1" class="lCenter-r imgStye">
                                    <img v-bind:src="ruleForm1.backgroundUrl4"/>
                                </el-col>
                            </el-row>
                        </el-form-item>                                                                                                                                    
                        <el-form-item>
                            <el-button style="margin-left:25%;" @click="closeDialog(3)">取消</el-button>
                            <el-button style="margin-left:5%;" :disabled="contenIsOk1" class="redBackColor butColorF" @click="submitForm('ruleForm1')">确定</el-button>
                        </el-form-item>                        
                    </el-form>                    
                </el-col>               
            </el-row>
        </el-dialog>         
        <el-dialog
        :visible.sync="centerDialogSwitch"
        title="提示"
        max-height="300"
        :show-close='false'
        width="30%">
            <el-row>
                <el-col class="lCenter-r">确定要删除这个模板吗</el-col>
                <el-col class="lCenter-r lMarginTop30">
                    <el-button @click="closeDialog(2)">取消</el-button>
                    <el-button class="redBackColor butColorF" @click="codeIsOk(dataImg)">确定</el-button>
                </el-col>
            </el-row>
        </el-dialog>    
        <el-dialog
        :visible.sync="dialogSwitchTypeAppOrPc"
        title=""
        max-height="300"
        :show-close='false'
        width="480px">
            <el-row>
                <el-col :span="11" class="lCenter-r">
                    <el-button style="width:200px;" class="redBackColor butColorF" @click="switchTypeEven(1)">课程分享海报模板</el-button>
                </el-col>
                <el-col :span="11" :offset="2" class="lCenter-r">
                    <el-button style="width:200px;" class="redBackColor butColorF" @click="switchTypeEven(2)">APP邀请分享模板</el-button>
                </el-col>
            </el-row>
        </el-dialog>                                                    
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){ 
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {
                case "title":
                    var regExp =/^(?!.*\\.*$)/;
                    if(!self.isOKOrNoTwo){
                        if (!value) {
                            return callback(new Error('请填写标题'));
                            }
                            setTimeout(() => {
                            if (!regExp.test(value)) {
                                callback(new Error('不能输入"\\"特殊字符'));
                            } else {
                                callback();
                            }
                        }, 300);
                    }else{
                        callback();
                    }                
                break;                
            }
        };                                            
        return {
            myHeaders: {token: getToken()},
            fileList1: [],
            fileList2: [],
            fileList3:[],
            fileList4:[],
            fileList5:[],
            fileList6:[],
            fileList7:[],
            title:'',
            tableData: [],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },       
            centerDialogCerat:false,
            centerDialogSwitch:false,
            dialogSwitchTypeAppOrPc:false,
            appCenterDialogCerat:false,
            pageNo:1,
            pageSize:8,
            pageSizeNum:8,
            urlScienceBools:1,
            selectType:'3',
            ruleForm: {
                title:'',
                iconUrl:'',
                backgroundUrl:''
            },
            disabledState:false,
            fileList:[
                    {sizeTltle:"Android320*480",size:[320,480],imgs:'',loading:false},
                    {sizeTltle:"Android480*800",size:[480,800],imgs:'',loading:false},
                    {sizeTltle:"Android720*1280",size:[720,1280],imgs:'',loading:false},
                    {sizeTltle:"Android1080*1920",size:[1080,1920],imgs:'',loading:false}
                ],            
            ruleForm1: {
                title:'',
                backgroundUrl:'',
                backgroundUrl1:'',
                backgroundUrl2:'',
                backgroundUrl3:'',
                backgroundUrl4:''
            },            
            contenIsOk:true,
            contenIsOk1:true,
            rules: {
                title: [
                    {validator: checkAge, trigger: 'blur' }
                ]
            },
            optionsStyle:[
                {
                    value:'3',
                    label:'全部'
                },
                {
                    value:'1',
                    label:'课程海报'
                },
                {
                    value:'2',
                    label:'app海报'                    
                }
            ],
            rules1: {
                title: [
                    {validator: checkAge, trigger: 'blur' }
                ]
            },            
            loading:false, 
            loading1:false, 
            loading2:false,
            dataImg:'',
            titleList:[
                        {
                            name:'素材',
                            pathInfo:''
                        },
                        {
                            name:'分享模板',
                            pathInfo:''
                        }
                ]
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
        this.getTableModelList(1);
    },
    computed: {
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }
    },    
    components:{
        breadcrumb
    },    
    methods:{
        chooseVersionType(e){
            this.getTableModelList(1);
        },
        //开关事件
        value4Cahgne(data,boos){
            var self = this;
            if(boos){
                    self.$http.post(self.$server.courseShareModelUp({id:data.id})).then(res=>{
                        if(res.status==200){
                            console.log('开启成功');
                        }
                    })                 
            }else{
                    self.$http.post(self.$server.courseShareModelDown({id:data.id})).then(res=>{
                        if(res.status==200){
                            console.log('关闭成功');
                        }
                    })                
            }
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        switchTypeEven(num){
            this.dialogSwitchTypeAppOrPc = false;
            switch (num) {
                case 1:
                    this.centerDialogCerat = true;
                    break;
                case 2:
                    this.appCenterDialogCerat = true;                   
                    break;            
                default:
                    break;
            }
        },
        handleRemove(file, fileList,state) {
            var self = this;
            if(state=='backImg'){
                self.fileList1=[];
                self.ruleForm.backgroundUrl= '';
            }else{
                self.fileList1=[];
                self.ruleForm.iconUrl= '';
            }
            if(self.ruleForm.title.length>0&&self.ruleForm.backgroundUrl.length>0&&self.ruleForm.iconUrl.length>0){
                self.contenIsOk = false;
            }else{
                self.contenIsOk = true;
            }            
        },  
        handleRemove1(file, fileList,state,imgsType) {
            var self = this;
            switch (imgsType) {
                case 'imgs':
                    self.fileList3=[];
                    self.ruleForm1.backgroundUrl= '';                    
                    break;
                case 'imgs1':
                    self.fileList4=[];
                    self.ruleForm1.backgroundUrl1= '';                     
                    break;
                case 'imgs2':
                    self.fileList5=[];
                    self.ruleForm1.backgroundUrl2= '';                     
                    break;
                case 'imgs3':
                    self.fileList6=[];
                    self.ruleForm1.backgroundUrl3= '';                     
                    break; 
                case 'imgs4':
                    self.fileList7=[];
                    self.ruleForm1.backgroundUrl4= '';                     
                    break;                                                                       
                default:
                    break;
            }
            if(
                self.ruleForm1.title.length>0&&
                self.ruleForm1.backgroundUrl.length>0&&
                self.ruleForm1.backgroundUrl1.length>0&&
                self.ruleForm1.backgroundUrl2.length>0&&
                self.ruleForm1.backgroundUrl3.length>0&&
                self.ruleForm1.backgroundUrl4.length>0){
                self.contenIsOk1 = false;
            }else{
                self.contenIsOk1 = true;
            }            
        },        
        //上传成功
        handleAvatarSuccess(res, file, fileList,state) {
            console.log(res)
            var self = this;
            if(state=='backImg'){
                self.ruleForm.backgroundUrl= res.content.resourceUrl;
                self.fileList1=[{name:res.content.resourceName , url: res.content.resourceUrl}]
            }else{
                self.ruleForm.iconUrl= res.content.resourceUrl;
                self.fileList2=[{name:res.content.resourceName , url: res.content.resourceUrl}]
            };
            if(self.ruleForm.title.length>0&&self.ruleForm.backgroundUrl.length>0&&self.ruleForm.iconUrl.length>0){
                self.contenIsOk = false;
            }else{
                self.contenIsOk = true;
            }            
        },  
        handleAvatarSuccess1(res, file, fileList,state,imgsType) {
            console.log(res)
            var self = this;
            switch (imgsType) {
                case 'imgs':
                    self.ruleForm1.backgroundUrl= res.content.resourceUrl;
                    self.fileList3=[{name:res.content.resourceName , url: res.content.resourceUrl}];                    
                    break;
                case 'imgs1':
                    self.ruleForm1.backgroundUrl1= res.content.resourceUrl;
                    self.fileList4=[{name:res.content.resourceName , url: res.content.resourceUrl}];                    
                    break;
                case 'imgs2':
                    self.ruleForm1.backgroundUrl2= res.content.resourceUrl;
                    self.fileList5=[{name:res.content.resourceName , url: res.content.resourceUrl}];                    
                    break; 
                case 'imgs3':
                    self.ruleForm1.backgroundUrl3= res.content.resourceUrl;
                    self.fileList6=[{name:res.content.resourceName , url: res.content.resourceUrl}];                    
                    break;       
                case 'imgs4':
                    self.ruleForm1.backgroundUrl4= res.content.resourceUrl;
                    self.fileList7=[{name:res.content.resourceName , url: res.content.resourceUrl}];                    
                    break;                          
                default:
                    break;
            }

            if(
                self.ruleForm1.title.length>0&&
                self.ruleForm1.backgroundUrl.length>0&&
                self.ruleForm1.backgroundUrl1.length>0&&
                self.ruleForm1.backgroundUrl2.length>0&&
                self.ruleForm1.backgroundUrl3.length>0&&
                self.ruleForm1.backgroundUrl4.length>0
            ){
                self.contenIsOk1 = false;
            }else{
                self.contenIsOk1 = true;
            }            
        },              
        //上传图片前的验证；
        beforeAvatarUpload(file,size,sizeK) {
            var self = this;
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < sizeK;
            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG/PNG/JPEG 格式!');
                if(sizeK==1){
                    self.fileList1=[];  
                    self.ruleForm.backgroundUrl='';
                }else{
                    self.ruleForm.iconUrl='';
                    self.fileList2=[]; 
                }
                return;                
            }
            if (!isLt2M) {
                if(sizeK==1){
                    this.$message.error('上传图片最大为'+sizeK+'M!');
                    self.ruleForm.backgroundUrl='';
                    self.fileList1=[]; 
                }else{
                    this.$message.error('上传图片最大为200k!');
                    self.ruleForm.iconUrl='';
                    self.fileList2=[]; 
                }
                return;
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
               if(sizeK==1){
                    self.fileList1=[]; 
                    self.ruleForm.backgroundUrl=''; 
                }else{
                    self.fileList2=[]; 
                    self.ruleForm.iconUrl='';
                }                
                return Promise.reject();
            });
            return isJPG && isLt2M && isSize; 
            
        },    
        //上传图片前的验证；
        beforeAvatarUpload1(file,size,sizeK,imgsType) {
            var self = this;
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < sizeK;
            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG/PNG/JPEG 格式!');
                switch (imgsType) {
                    case 'imgs':
                        self.fileList3=[];  
                        self.ruleForm1.backgroundUrl='';                        
                        break;
                    case 'imgs1':
                        self.fileList4=[];  
                        self.ruleForm1.backgroundUrl1='';                        
                        break;
                    case 'imgs2':
                        self.fileList5=[];  
                        self.ruleForm1.backgroundUrl2='';                        
                        break;
                    case 'imgs3':
                        self.fileList6=[];  
                        self.ruleForm1.backgroundUrl3='';                        
                        break;
                    case 'imgs4':
                        self.fileList7=[];  
                        self.ruleForm1.backgroundUrl4='';                        
                        break;                
                    default:
                        break;
                }
                return;                
            }
            if (!isLt2M) {
                this.$message.error('上传图片最大为'+sizeK+'M!');
                switch (imgsType) {
                    case 'imgs':
                        self.fileList3=[];  
                        self.ruleForm1.backgroundUrl='';                        
                        break;
                    case 'imgs1':
                        self.fileList4=[];  
                        self.ruleForm1.backgroundUrl1='';                        
                        break;
                    case 'imgs2':
                        self.fileList5=[];  
                        self.ruleForm1.backgroundUrl2='';                        
                        break;
                    case 'imgs3':
                        self.fileList6=[];  
                        self.ruleForm1.backgroundUrl3='';                        
                        break;
                    case 'imgs4':
                        self.fileList7=[];  
                        self.ruleForm1.backgroundUrl4='';                        
                        break;                
                    default:
                        break;
                }                
                return;
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
                switch (imgsType) {
                    case 'imgs':
                        self.fileList3=[];  
                        self.ruleForm1.backgroundUrl='';                        
                        break;
                    case 'imgs1':
                        self.fileList4=[];  
                        self.ruleForm1.backgroundUrl1='';                        
                        break;
                    case 'imgs2':
                        self.fileList5=[];  
                        self.ruleForm1.backgroundUrl2='';                        
                        break;
                    case 'imgs3':
                        self.fileList6=[];  
                        self.ruleForm1.backgroundUrl3='';                        
                        break;
                    case 'imgs4':
                        self.fileList7=[];  
                        self.ruleForm1.backgroundUrl4='';                        
                        break;                
                    default:
                        break;
                }
                return Promise.reject();
            });
            return isJPG && isLt2M && isSize; 
            
        },            
        codeIsOk(data){
            var self = this;
            self.$http.delete(self.$server.courseShareModelDelete({id:data.id})).then(res=>{
                        if(res.status==200){                    
                            self.centerDialogSwitch=false;
                            self.$message.success({ message: "删除成功" });
                            this.getTableModelList(1);
                        }
            })            
        },      
        proving(){
            var self = this;
            if(self.ruleForm.title.length>0&&self.ruleForm.backgroundUrl.length>0&&self.ruleForm.iconUrl.length>0){
                self.contenIsOk = false;
            }else{
                self.contenIsOk = true;
            }
        },    
        proving1(){
            var self = this;
            if(self.ruleForm1.title.length>0&&self.ruleForm1.backgroundUrl.length>0){
                self.contenIsOk1 = false;
            }else{
                self.contenIsOk1 = true;
            }
        },        
        submitForm(formName) {
            var self=this;
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    if(formName=='ruleForm'){
                        if(self.ruleForm.iconUrl==''||self.ruleForm.backgroundUrl==''){
                            self.$message.error('请上传背景图.');
                            return;
                        }
                    }else{
                        if(
                            self.ruleForm1.backgroundUrl==''||
                            self.ruleForm1.backgroundUrl1==''||
                            self.ruleForm1.backgroundUrl2==''||
                            self.ruleForm1.backgroundUrl3==''||
                            self.ruleForm1.backgroundUrl4==''
                        ){
                            self.$message.error('请上传背景图.');
                            return;
                        }
                    }
                    var params ='';
                    if(formName=='ruleForm'){
                        self.loading1=true;
                        params = {
                            name:self.ruleForm.title,
                            backgroundUrl:self.ruleForm.backgroundUrl,
                            iconUrl:self.ruleForm.iconUrl,
                            type:1
                        } 
                    }else{
                        self.loading2=true;
                        params = {
                            name:self.ruleForm1.title,
                            type:2,
                            backgroundUrl:self.ruleForm1.backgroundUrl,
                            mdpi:self.ruleForm1.backgroundUrl1,
                            hdpi:self.ruleForm1.backgroundUrl2,
                            xhdpi:self.ruleForm1.backgroundUrl3,
                            xxhdpi:self.ruleForm1.backgroundUrl4
                        }                        
                    }            
                    if(!self.disabledState){
                        self.disabledState=!self.disabledState;
                        self.$http.post(self.$server.courseShareModelNew,params).then(res=>{
                                    if(res.status==200){
                                        self.loading1=false;
                                        self.loading2=false;
                                        self.centerDialogCerat = false;
                                        self.appCenterDialogCerat=false;
                                        self.ruleForm={
                                            title:'',
                                            iconUrl:'',
                                            backgroundUrl:''
                                        },           
                                        self.ruleForm1={
                                            title:'',
                                            backgroundUrl:'',
                                            backgroundUrl1:'',
                                            backgroundUrl2:'',
                                            backgroundUrl3:'',
                                            backgroundUrl4:''
                                        },                                      
                                        this.fileList1=[];
                                        this.fileList2=[]; 
                                        this.fileList3=[];   
                                        this.fileList4=[];
                                        this.fileList5=[];
                                        this.fileList6=[];                    
                                        this.fileList7=[];
                                        self.disabledState=!self.disabledState;
                                        self.$message.success({ message: "添加分享模板成功" });
                                        this.getTableModelList(1);
                                    }else{
                                        self.disabledState=!self.disabledState;
                                        self.loading1=false;
                                        self.loading2=false;
                                    }
                        }).catch(()=>{
                            self.loading1=false;
                            self.loading2=false;
                        })                         
                    }   
                } else {
                    console.log('error submit!!');
                    return false;
                }
        });
        },       
        getTableModelList(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            var params = {
                pageNo:self.pageNo,
                pageSize:self.pageSize,
                type:self.selectType
            };
            self.loading = true;
            self.$http.get(self.$server.courseShareModelList(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                     if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                element.stateVal = element.state==1?true:false;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                element.stateVal = element.state==1?true:false;
                                return element;
                            });                            
                        } 
                   };
                    self.tableData = listIds;
                    console.log(self.tableData);
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loading = false; 
               }
            }).catch((err)=>{
                self.loading = false;
            })                                    
        },
        removeBackImg(data){
            var self = this;
            self.centerDialogSwitch=true;
            self.dataImg = data;
        },
        closeDialog(num){
            switch (num) {
                case 1:
                    this.centerDialogCerat=false;
                    this.ruleForm={
                        title:'',
                        iconUrl:'',
                        backgroundUrl:''
                    },            
                    this.fileList1=[];
                    this.fileList2=[];                       
                    break;
                case 2:
                    this.centerDialogSwitch=false;
                    break;      
                case 3:
                    this.fileList1=[];
                    this.fileList2=[]; 
                    this.fileList3=[];   
                    this.fileList4=[];
                    this.fileList5=[];
                    this.fileList6=[];                    
                    this.fileList7=[];   
                    this.ruleForm1.title='';
                    this.ruleForm1.backgroundUrl='';
                    this.ruleForm1.backgroundUrl1='';
                    this.ruleForm1.backgroundUrl2='';
                    this.ruleForm1.backgroundUrl3='';
                    this.ruleForm1.backgroundUrl4='';  
                    this.appCenterDialogCerat=false;                                   
                    break;                          
                default:
                    break;
            }
        },
        creaNewCode(data){
            // this.centerDialogCerat = true;
            this.dialogSwitchTypeAppOrPc = true;
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getTableModelList(Number(num))
            }            
        }           
    },
    mounted(){}
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px; 
    margin-bottom: 10px;     
}
/* .el-form-item{
    margin-bottom: 12px;
} */
.has-gutter th.el-table-column--selection .cell{
    display: none;
}
.zoomDiv{
    zoom: 1;
    overflow: auto;    
}
.pad4px{
    padding:4px !important;
}
.graybackE8Img{
    height: 200px;
    overflow: hidden;
}
.graybackE8Img img{
    width: 100%;
    /* height: 100%; */
}
.imgStye{
    max-width: 70px;
    max-height: 119px;
    min-width: 58px;
    min-height: 98px;    
    border:1px dotted #ccc;
    overflow: hidden;
}
</style>


