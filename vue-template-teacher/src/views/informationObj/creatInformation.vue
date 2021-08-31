<template>
    <div>
        <el-row>
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col>
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="名称:" prop="name">
                            <el-input style="width:50%;" type="text" maxlength="30" v-model="ruleForm.name" ></el-input>
                            <span>{{ruleForm.name.length||0}}/30</span>
                        </el-form-item>
                        <el-form-item label="轮播图:" prop="pictureUrl">
                            <el-row>
                                <el-col :span="13">
                                    <el-upload
                                        class="upload-demo"
                                        :action="actiosService"
                                        :headers="myHeaders"
                                        :on-success="(res, file, fileList)=>{return handleAvatarSuccess(res, file, fileList)}"
                                        :before-upload="(file)=>{return beforeAvatarUpload(file,[800,404])}"
                                        :on-remove="(file, fileList)=>{return handleRemove(file, fileList)}"
                                        :on-exceed="handleExceed"
                                        :file-list="ruleForm.fileList1">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">尺寸：800*404；大小：≤1M</div>
                                    </el-upload>                                    
                                </el-col>
                                <el-col :span="8" :offset="3" class="lCenter-r imgStyle">
                                    <img v-bind:src="ruleForm.pictureUrl"/>
                                </el-col>
                            </el-row>
                        </el-form-item> 
                        <el-form-item label="资讯内容"
                                     style="margin-top:50px;"
                                      prop="content">
                                      <div class="my-information-editor">
                                          <Editor v-model="ruleForm.content"/>
                                      </div>
                            <!-- <my-editor
                                       label="brief"
                                       class="ueditor-wrap"
                                       maximumWords="10000"
                                       :content="ruleForm.content"
                                       :handleChange="handleBrief"></my-editor> -->
                                       <div class="editorStylecss" v-if="disabledVal=='disabledtrue'?true:false"></div>
                        </el-form-item>                          
                        <el-form-item label="作者:" prop="author">
                            <el-input style="width:40%;" type="text" maxlength="10" v-model.trim="ruleForm.author" ></el-input>
                            <span>{{ruleForm.author.length||0}}/10</span>
                        </el-form-item>  
                        <el-form-item label="来源:" prop="source">
                            <el-input style="width:40%;" type="text" maxlength="10" v-model.trim="ruleForm.source" ></el-input>
                            <span>{{ruleForm.source.length||0}}/10</span>
                        </el-form-item>                                                                         
                        <el-form-item>
                            <el-button  @click="submitForm('ruleForm',0)">取消</el-button>
                            <el-button  class="redBackColor butColorF" @click="submitForm('ruleForm',1)" v-if="ruleForm.state!=2">草稿</el-button>
                            <el-button  class="redBackColor butColorF" @click="submitForm('ruleForm',2)" v-if="ruleForm.state!=2">发布</el-button>
                            <el-button  class="redBackColor butColorF" @click="submitForm('ruleForm',2)"  v-if="ruleForm.state==2">更新</el-button>
                        </el-form-item>                        
                    </el-form>  
            </el-col>
        </el-row>      
    </div>
</template>
<script>
import { getToken } from '@/utils/auth';
// import myEditor from "@/components/editor/editor";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {             
                case "integralNum":
                    if ($.trim(value)===""||Number(value)==0) {
                            if(Number(value)==0){
                                return callback(new Error('内容范围1-100'));
                            }
                            if($.trim(value)===""){
                                return callback(new Error('请填写关联积分'));
                            }  
                        }
                        setTimeout(() => {
                            if (!Number.isInteger(Number(value))) {
                                callback(new Error('请输入正整数'));
                            } else {
                                if (Number(value)>100||Number(value)<0) {
                                    callback(new Error('内容范围1-100'));
                                } else {
                                    callback();
                                }
                            }
                        }, 1000);
                break;               
            }
        };         
        return {
            myHeaders: {token: getToken()},
            action:'',
            commonHeader:'',
            editAdd:'',
            transmitId:'',
            // mtype:'',
            ruleForm:{
                    name:'',
                    pictureUrl:'',
                    fileList1:[],
                    source:'',
                    author:'',
                    content:'',
                    state:''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入信息', trigger: 'blur' },
                    ],
                    pictureUrl: [
                        { required: true, message: '请上传轮播图', trigger: 'change' }
                    ],
                    source: [
                        { required: true, message: '请输入信息', trigger: 'blur' },
                    ],
                    author: [
                        { required: true, message: '请输入信息', trigger: 'blur' },
                    ]                               
                },
            titleList:[
                    {
                        name:'资讯管理系统',
                        pathInfo:'/informationList'
                    }
            ],                
            disabledVal:'disabledfalse',
            loading:false,
            disabledState:false
            }
        },
    created() {
        this.editAdd = this.$route.query["addOrEdit"]; 
        // this.mtype = this.$route.query["mtype"];       
        if(this.editAdd=='edit'){    
            this.transmitId=this.$route.query["id"];
            this.titleList.push({
                        name:'编辑资讯',
                        pathInfo:''                
            });
            this.getSelectInformAtion(this.transmitId);
        }else{
            this.titleList.push({
                        name:'添加资讯',
                        pathInfo:''                
            });
        }   
        this.commonHeader = {
            token: getToken()
        };                
        this.action = this.$server.actionImgOrvideo;
    },
    components:{
        // myEditor,
        breadcrumb
    },
    computed:{
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }
    },    
    methods: {
            submitForm(formName,state){
                this.loading=true;
                switch (state) {
                    case 0:
                        this.$router.push({path: "/informationList"});
                        break;
                    case 1:
                        this.formInfoRelease(formName,1);
                        break;
                    case 2:
                        this.formInfoRelease(formName,2);
                        break;                                                               
                    default:
                        break;
                }
            },
            formInfoRelease(formName,state){
                var self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(self.ruleForm.pictureUrl==''){
                            self.$message.error('请上轮播图.');
                            return;
                        }
                        if(this.ruleForm.content.replace(/\s+/g, "").replace(/<[^<>]+>/g,'').replace(/&nbsp;/ig,'').length>10000){
                            this.$message.error("资讯内容文字长度在 1 到 10000 个字符");
                            this.loading=false;
                            return ;
                        }
                        let str = `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
                        <style>
                            .xgx-editor *{
                                cursor: text;
                                font-size: 18px!important;
                                text-align:left;
                                font-family:'PingFangSC','STHeiti','Microsoft YaHei','Helvetica','Arial',sans-serif;
                            }
                            .xgx-editor ol,.xgx-editor p,.xgx-editor ul{
                                margin: 1em 0;
                                line-height: 1.5;
                            }
                            .xgx-editor hr{
                                margin: 3em 0 0 0;
                                border: 1px solid #e9e9e9;
                                border-width: 1px 0 0;
                            }
                            .xgx-editor blockquote{
                                padding: 12px 8px;
                                color: #999;
                                background-color: #f3f4f5;
                                margin: 10px 0;
                                border:none!important;
                            }
                            .xgx-editor blockquote span{
                                color:#999;
                            }
                            .xgx-editor blockquote p{
                                margin:0!important;
                                line-height: 1.4em!important;
                            }
                            .xgx-editor h1{
                                display:inline-block;
                                font-size: 1em;
                                line-height: 1.25em;
                                padding-left: 12px;
                                font-weight: 700;
                                border-left: 4px solid #f85959;
                                margin: 1em 0;
                            }
                            .xgx-editor img{
                                max-width:100%;
                            }
                            .xgx-editor h1 strong{
                                line-height:1.25em;
                            }
                            .xgx-editor h1 span{
                                font-size: 1em;
                                line-height: 1em;
                            }
                            .xgx-editor pre{
                                background: #f0f0f0!important;
                                color:#222!important;
                                border-radius: 3px;
                            }
                            .xgx-editor p{
                                word-wrap:break-word
                            }
                            .xgx-editor ol li:not(.ql-direction-rtl),.xgx-editor ul li:not(.ql-direction-rtl){
                                padding-left:1.5em;
                            }
                            .xgx-editor ol > li{
                                list-style:none;
                            }
                            .xgx-editor ol,.xgx-editor ul{
                                padding:0px!important;
                            }
                            .xgx-editor ol > li::before{
                                content:counter(list-0, decimal) '. ';
                                display: inline-block;
                                white-space: nowrap;
                            }
                            .xgx-editor li:not(.ql-direction-rtl)::before{
                                margin-left: -1.5em;
                                margin-right: 0.3em;
                                text-align: right;
                            }
                            .xgx-editor ul > li::before{
                                content:'·';
                            }
                            .xgx-editor blockquote, .xgx-editor h1, .xgx-editor h2, .xgx-editor h3, .xgx-editor h4, .xgx-editor h5, .xgx-editor h6, .xgx-editor ol, .xgx-editor p, .xgx-editor pre, .xgx-editor ul{
                                counter-reset:list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
                            }
                            .xgx-editor ol li{
                                counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
                                counter-increment: list-0
                            }
                        </style>`
                        let content = str+'<div class="xgx-editor">'+self.ruleForm.content+'</div>'
                        if(self.editAdd=='edit'){
                            var params = {
                                name:self.ruleForm.name,
                                pictureUrl:self.ruleForm.pictureUrl,
                                state:Number(state),
                                content:content,
                                // author:self.ruleForm.author=self.ruleForm.author.replace(/\s/g,""),
                                // source:self.ruleForm.source=self.ruleForm.source.replace(/\s/g,""),
                                author:self.ruleForm.author,
                                source:self.ruleForm.source,                                
                                id:self.transmitId
                            }; 
                            var urls = self.$server.informationUpdate;
                        }else{
                            var params = {
                                name:self.ruleForm.name,
                                pictureUrl:self.ruleForm.pictureUrl,
                                state:Number(state),
                                content:self.ruleForm.content,
                                // author:self.ruleForm.author=self.ruleForm.author.replace(/\s/g,""),
                                // source:self.ruleForm.source=self.ruleForm.source.replace(/\s/g,""),                                
                                author:self.ruleForm.author,
                                source:self.ruleForm.source
                            };
                            var urls = self.$server.informationAdd;
                                                          
                        }
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;                           
                            self.$http.post(urls,params).then(res=>{
                                        if(res.status==200){
                                            self.loading=false;
                                            self.disabledState = !self.disabledState;
                                            self.$router.push({path: "/informationList"});
                                        }else{
                                            self.loading=false;
                                        }
                            }).catch(()=>{
                                self.disabledState = !self.disabledState;
                            }) 
                        }
                    } else {
                        self.loading=false;
                        console.log('error submit!!');
                        return false;
                    }
            });                
            },
            getSelectInformAtion(id){
                var self = this;
                    var params = {
                        id:id
                    };
                    self.$http.get(self.$server.informationView(params)).then(res=>{
                        if(res.status==200){  
                            self.ruleForm = res.content;
                        }
                    });                 
            },
            /**
             * 富文本内容获取
             */        
            handleBrief(data) {
                this.ruleForm.content = data.html;
                if (data.count > 0) {
                    this.$refs["ruleForm"].clearValidate(["content"]);
                }
            },        
            handleAvatarSuccess(res, file, fileList,state){
                var self = this;
                    self.ruleForm.pictureUrl=res.content.resourceUrl;

            },
            beforeAvatarUpload(file,size){
                        const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
                        const isLt2M = file.size / 1024 / 1024 < 1;
                        if (!isJPG) {
                            this.ruleForm.fileList1=[];
                            this.$message.error('上传图片只能是 PNG,JPEG,JPG 等格式!');
                        }
                        if (!isLt2M) {
                            this.ruleForm.fileList1=[];
                            this.$message.error('上传图片大小不能超过 1MB!');
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
                            this.ruleForm.fileList1=[];
                            this.$message.error('上传的图片必须是等于'+size[0]+'*'+size[1]+'!');
                            return Promise.reject();
                        });
                        return isJPG && isLt2M && isSize;                
            },
            handleRemove(file, fileList,state){
                this.ruleForm.fileList1=[];
                this.ruleForm.pictureUrl= '';                
            },
            handleExceed(){},
    }
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.editorStylecss{
    width: 905px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background: rgba(0,0,0,0.1);
    z-index: 1000;
    cursor: not-allowed;
}  
.imgStyle{
    max-height: 267px;
    width: 150px;
    border:1px dashed #CCC;
}
.checkboxCss .checkListCss .el-checkbox{
    display: -webkit-box;
    margin-left: 30px;
    margin-top: 20px;
}   
.checkboxCss .checkListCss .el-checkbox .el-checkbox__label{
    width: calc(100% - 14px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    text-align: left;
}
</style>
<style lang="scss">
    .my-information-editor{
        .content-length{
            top:25px;
        }
    }
</style>

