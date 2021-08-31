<template>
    <div>
        <div>
            <Breadcrumb :menuList ='titleList' style="margin-bottom:20px"></Breadcrumb>
        </div>
        <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="达人计划权益配置" name="first">
                    <div>
                        <el-upload
                        class="upload-demo"
                        :action="action"
                        :disabled="imgList.length>=10"
                        :headers="commonHeader"
                        :on-error="uploadFileError"
                        :before-upload="beforeUpload"
                        :on-success="uploadFileSuccess"
                        :multiple="false"
                        :show-file-list="false">
                        <el-button size="small" type="primary" :disabled="imgList.length>=10">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">图片大小限1MB以内，图片尺寸大小限270*295。</div>
                        </el-upload>        
                        <el-row :gutter="20">
                            <el-col :span='20'>
                                <div class="imgBox" v-for="(item,index) in imgList" :key="index">
                                    <img :src="item.imgUrl"/>
                                    <i class="el-icon-delete-solid" @click="closeImgIcon(index,item)"></i>
                                </div>
                            </el-col>
                        </el-row>                         
                    </div> 
                </el-tab-pane>
                <el-tab-pane label="成长值/返佣规则说明" name="second">
                    <div v-if="secondIsShow">
                        <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="demo-ruleForm">
                            <el-form-item label="成长值规则说明"
                                        prop="introduceOne">
                                        <div class="my-course-editor">
                                            <Editor v-if="EditorType" v-model="form.introduceOne" :maxLength="500"/>
                                        </div>
                            </el-form-item>        
                    
                            <el-form-item label="返佣规则说明"
                                        prop="introduceTwo">
                                        <div class="my-course-editor">
                                            <Editor v-if="EditorType" v-model="form.introduceTwo" :maxLength="500"/>
                                        </div>
                            </el-form-item>                     
                            <el-form-item style="text-align: center;">
                                <el-button @click="resetForm()">取消</el-button>
                                <el-button type="primary" @click="submitForm('form')">保存</el-button>
                            </el-form-item>
                        </el-form>                        
                    </div>
                </el-tab-pane>
                <el-tab-pane label="达人计划返佣比例设置" name="third">
                    <div>
                        <div class="textBox">自购返佣/分享返佣百分比必须大于1，小于100，可保留一位小数！默认值依次为：5、15、5、15</div>
                        <div class="textBox" v-for="(item,index) in scaleList" :key="index">
                            <div class="boxOne">{{item.title}}</div>
                            <div class="boxTwo">
                                <!-- @input="inputEven(item.value,index,item.defaultVal)" -->
                                <el-input style="width:100px" v-model="item.value" placeholder=""></el-input>
                            </div>
                            <div>%</div>
                        </div>
                        <div style="text-align:center;margin-top:20px;">
                            <el-button @click="returnEven(1)">取消</el-button>
                            <el-button type="primary" @click="isSetFormData(1)">保存</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="达人计划成长值配置" name="fourth">
                    <div>
                        <div class="textBox">只能输入1-500的整数，默认值依次为：50、100、50、100、50、50</div>
                        <div class="textBox2" v-for="(item,index) in otherList" :key="index">
                            <div class="boxOne">{{item.title}}</div>
                            <div class="boxTwo">
                                <!-- @input="inputTwoEven(item.value,index,item.defaultVal)" -->
                                <el-input style="width:100px" v-model="item.value" placeholder="" ></el-input>
                            </div>
                        </div>
                        <div style="text-align:center;margin-top:20px;">
                            <el-button @click="returnEven(2)">取消</el-button>
                            <el-button type="primary" @click="isSetFormData(2)">保存</el-button>
                        </div>
                    </div>                    
                </el-tab-pane>
            </el-tabs>
        </div>  
    </div>
</template>
<script>
import Breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
export default {
    components:{
        Breadcrumb,
        // courseselect,
        courseListPlugin,
    },    
    data(){               
        return {      
            titleList:[
                {
                    name:'国学达人计划',
                    pathInfo:''
                },
                {
                    name:'达人/大使权益管理',
                    pathInfo:''
                }
            ],
            activeName: 'first',
            commonHeader:{},
            action:"",
            imgList:[],
            // disabledType:false,
            secondIsShow:true,
            EditorType:true,
            form: {
                introduceOne: '',
                oneId:'',
                introduceTwo: '',
                twoId:'',
            },
            scaleList:[
                {
                    type:1,
                    value:'5',
                    id:'',
                    defaultVal:'5',
                    title:'使用积分或优惠券抵扣后的自购返佣'
                },
                {
                    type:2,
                    value:'15',
                    id:'',
                    defaultVal:'15',
                    title:'未使用积分或优惠券抵扣后的自购返佣'
                },
                {
                    type:3,
                    value:'5',
                    id:'',
                    defaultVal:'5',
                    title:'使用积分或优惠券抵扣后的分享返佣'
                },
                {
                    type:4,
                    value:'15',
                    id:'',
                    defaultVal:'15',
                    title:'未使用积分或优惠券抵扣后的分享返佣'
                }
            ],
            otherList:[
                {
                    type:1,
                    value:'50',
                    id:'',
                    defaultVal:'50',
                    title:'绑定手机号',
                    description:'绑定手机号'
                },
                {
                    type:2,
                    value:'100',
                    id:'',
                    defaultVal:'100',
                    title:'确认邀请人',
                    description:'确认邀请人'
                },
                {
                    type:3,
                    value:'50',
                    id:'',
                    defaultVal:'50',
                    title:'购买课程',
                    description:'购买课程'
                },
                {
                    type:4,
                    value:'100',
                    id:'',
                    defaultVal:'100',
                    title:'学完计划课程',
                    description:'学完计划课程'
                },
                {
                    type:5,
                    value:'50',
                    id:'',
                    defaultVal:'50',
                    title:'连续7天打卡',
                    description:'连续7天打卡'
                },
                {
                    type:6,
                    value:'50',
                    id:'',
                    defaultVal:'50',
                    title:'完善资料',
                    description:'完善资料'
                }

            ],
            rules: {
                introduceOne: [
                    {
                        required: true,
                        message: "请输入成长值规则说明",
                        trigger: "change"
                    }
                ],
                introduceTwo: [
                    {
                        required: true,
                        message: "请输入返佣规则说明",
                        trigger: "change"
                    }
                ]
            },
            imgNewVal:''
    }},
    created(){   
        this.action = this.$server.actionImgOrvideo;
        this.commonHeader = {
            token: getToken()
        }; 
        if(this.activeName=='first'){
            this.getExpertplanlist();
        }
    },
    props:[],
    computed:{  },        
    methods:{     
        returnEven(type){
            if(type==1){
                this.scaleList.forEach((element,index)=>{
                    this.scaleList[index].value=element.defaultVal;
                });
            }else{
                this.otherList.forEach((element,index)=>{
                    this.otherList[index].value=element.defaultVal;
                });
            }
        },
        isSetFormData(type){
            if(type==1){
                let parems = {},bools = true;
                this.scaleList.forEach((element,index)=>{
                    var y = String(element.value).indexOf(".") + 1;//获取小数点的位置
                    if(y>0){
                        var count = String(element.value).length - y;
                        if(Number(count)>1){
                            this.scaleList[index].value=element.defaultVal;
                            bools = false;
                            this.$message.error("最多保留1位小数");
                        }
                    }
                    if(Number(element.value)<1||Number(element.value)==1||Number(element.value)>100){
                        this.scaleList[index].value=element.defaultVal;
                        bools = false;
                        this.$message.error("设置值必须大于>1≤100");
                    }
                    if(bools){
                        parems['commissionForms['+index+'].type']=element.type;
                        parems['commissionForms['+index+'].proportion']=element.value;
                        parems['commissionForms['+index+'].id']=element.id;
                    }
                });
                if(bools){
                    this.$http.post(this.$server.getExpertEditCommission,parems).then(res=>{
                        if(res.status==200){                          
                            this.$message({
                                type:'success',
                                message:'编辑成功'
                            })
                            this.getExpertCommissionListEven();
                        }
                    }) 
                }              
            }else{
                let parems = {},bools = true;
                this.otherList.forEach((element,index)=>{
                    let regExp = /^[0-9]*$/g;
                    if(!regExp.test(element.value)){
                        this.otherList[index].value=element.defaultVal;
                        bools = false;
                        this.$message.error("成长值为整数。");
                    }
                    if(element.value>500||element.value<1){
                        this.otherList[index].value=element.defaultVal;
                        bools = false;
                        this.$message.error("成长值范围1-500。");
                    }
                    if(bools){
                        parems['scoreForms['+index+'].type']=element.type;
                        parems['scoreForms['+index+'].title']=element.title;
                        parems['scoreForms['+index+'].score']=element.value;
                        parems['scoreForms['+index+'].id']=element.id;
                    }
                });
                if(bools){
                    this.$http.post(this.$server.getExpertEditScore,parems).then(res=>{
                        if(res.status==200){                          
                            this.$message({
                                type:'success',
                                message:'编辑成功'
                            })
                            this.getScoreList();
                        }
                    })
                } 
            }
        },
        getExpertplanlist(){
            this.imgList=[];
            this.$http.get(this.$server.getExpertPotenceList).then(res=>{
                if(res.status==200){
                    res.content.forEach((element,index)=>{
                        this.imgList.push({
                            imgUrl:element.imgUrl,
                            id:element.id
                        });
                    });
                }
            })            
        },    
        submitForm(str){
            var self = this;
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.btnLoading = true;
                    if(this.form.introduceOne.replace(/\s+/g, "").replace(/<[^<>]+>/g,'').replace(/&nbsp;/ig,'').length>500){
                        this.$message.error("成长值规则说明文字长度在 1 到 500 个字符");
                        this.btnLoading = false;
                        return ;
                    }
                    if(this.form.introduceTwo.replace(/\s+/g, "").replace(/<[^<>]+>/g,'').replace(/&nbsp;/ig,'').length>500){
                        this.$message.error("返佣规则说明文字长度在 1 到 500 个字符");
                        this.btnLoading = false;
                        return ;
                    }
                    let str1 = `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
                        <style>
                            .xgx-editor *{
                                cursor: text;
                                font-size: 16px!important;
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
                                word-wrap:break-word;
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
                                margin-left: -1.6em;
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
                    this.form.introduceOne = str1+'<div class="xgx-editor">'+this.form.introduceOne+'</div>'
                    this.form.introduceTwo = str1+'<div class="xgx-editor">'+this.form.introduceTwo+'</div>'
                    this.setExpertDboutListEven();
                } else {
                    return false;
                }
            });            
        },
        setExpertDboutListEven(){
            this.EditorType = false;
            let parems = {
                'aboutForms[0].type':1,
                'aboutForms[0].content':this.form.introduceOne,
                'aboutForms[0].id':this.form.oneId,
                'aboutForms[1].type':2,
                'aboutForms[1].content':this.form.introduceTwo,
                'aboutForms[1].id':this.form.twoId
            };
            this.$http.post(this.$server.getExpertAddAbout,parems).then(res=>{
                if(res.status==200){   
                    this.EditorType = true;
                    this.form.introduceOne='';
                    this.form.oneId='';
                    this.form.introduceTwo='';
                    this.form.twoId='';
                    this.getExpertDboutListEven();                       
                    this.$message({
                        type:'success',
                        message:'编辑成功'
                    })
                }
            })
        },
        resetForm() {    
            let self = this;      
            this.secondIsShow = false;
            this.form.introduceOne='';
            this.form.introduceTwo='';
            this.form.twoId='';
            this.form.oneId='';
            setTimeout(()=>{
                this.secondIsShow = true;
                self.getExpertDboutListEven();
            },100);
            
        },
        // 图片文件上传之前的检查
        beforeUpload(file) {
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < 1.001;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG,PNG,JPEG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 1Mb!');
            }            
            const isSize = new Promise(function(resolve, reject) {
                let width = 270;
                let height = 295;
                let _URL = window.URL || window.webkitURL;
                let img = new Image();
                img.onload = function() {
                    let valid = img.width == width && img.height == height;
                    // let valid = img.width == width;
                    valid ? resolve() : reject();
                }
                    img.src = _URL.createObjectURL(file);
                }).then(() => {
                    return file;
                }, () => {
                    this.$message.error('上传的图片宽度尺寸必须为270*295');
                    return Promise.reject();
                });
            return isJPG && isLt2M && isSize;
        },
        //文件上传失败
        uploadFileError(err, file, fileList) {
            if (err.message) {
                try {
                    let msg = JSON.parse(err.message).message;
                    this.$message.error(msg);
                    return;
                } catch (e) {}
            }
            this.$message.error(JSON.stringify(err));
        },  
        setSelectAddPotenceImg(){
            let parems = {
                imgUrl:this.imgNewVal
            };
            this.$http.post(this.$server.setSelectAddPotence,parems).then(res=>{
                if(res.status==200){     
                    this.getExpertplanlist();                      
                    this.$message({
                        type:'success',
                        message:'添加成功'
                    })
                }
            })           
        },
        // 图片上传成功
        uploadFileSuccess(response, file) {
            if (response.status == 200) {
                this.imgNewVal = response.content.resourceUrl;
                this.setSelectAddPotenceImg();
                // if(this.imgList.length >3) {
                //     this.disabledType = true;
                // }else{
                //     this.disabledType = false;
                // }
            } else {
                this.$message.error(response.message);
            };
        },      /**
         * 删除权益
         */
        closeImgIcon(index,data){
            let self = this;
            this.$confirm('确定要删除吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(() => {
                this.$http.post(this.$server.getExpertDeletePotence+data.id).then(res=>{
                    if(res.status==200){
                        this.getExpertplanlist();
                        // self.disabledType = false;                            
                        this.$message({
                            type:'success',
                            message:'删除成功'
                        })
                    }
                })
            }).catch(()=>{})
             
        },
        getExpertDboutListEven(){
                this.$http.get(this.$server.getExpertDboutList).then(res=>{
                    if(res.status==200){
                        res.content.forEach((e,i)=>{
                            if(e.type==1){
                                this.form.oneId=e.id;
                                this.form.introduceOne = e.content;
                            }else{
                                this.form.twoId=e.id;
                                this.form.introduceTwo = e.content;
                            }
                        });
                    }
                })       
        },
        getScoreList(){
                this.$http.get(this.$server.getExpertScoreList).then(res=>{
                    if(res.status==200){
                        res.content.forEach((e,i)=>{
                            this.otherList[i].description=e.description;
                            this.otherList[i].value=e.score;
                            this.otherList[i].id=e.id;
                            this.otherList[i].defaultVal=e.score;
                        });
                    }
                })            
        },
        getExpertCommissionListEven(){
            this.$http.get(this.$server.getExpertCommissionList).then(res=>{
                if(res.status==200){
                    let list = res.content;
                    list.forEach((e,i)=>{
                        this.scaleList[i].value=e.proportion;
                        this.scaleList[i].id=e.id;
                        this.scaleList[i].defaultVal=e.proportion;
                    });
                }
            }) 
        },
        handleClick(tab, event) {
            switch (tab.name) {
                case 'first':
                    this.getExpertplanlist();
                    break;
                case 'second':
                    this.getExpertDboutListEven();
                    break;
                case 'third':
                    this.getExpertCommissionListEven();
                    break;
                case 'fourth':
                    this.getScoreList();
                    break;
            
                default:
                    break;
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
</style>
<style lang="scss" scoped>

    .my-course-editor{
        width: calc(100% - 110px);
        border:1px solid #dfdfdf;
        .editor-wrapper{
            padding: 0 !important;
            .content-length{
                top:5px!important;
            }
        }
    }
    .textAlign{
        text-align: right;
    }
    .imgBox{
        width: 150px;
        margin-top: 10px;
        position: relative;
        float: left;
        margin-right:30px;
        margin-bottom: 20px;
        img{
            width: 100%;
        }
        .el-icon-delete-solid{
            position: absolute;
            top: 0;
            right: -15px;
            font-size: 15px;
            cursor: pointer;
        }
    }
    .textBox{
        margin-top: 20px;
        display: flex;
        flex-direction:row;
        align-items: center;
        justify-content: flex-start;
        .boxOne{
            width: 230px;
            text-align: left;
        }
        .boxTwo{
            margin-right: 5px;
        }
    }
    .textBox2{
        margin-top: 20px;
        display: flex;
        flex-direction:row;
        align-items: center;
        justify-content: flex-start;
        .boxOne{
            width: 120px;
            text-align: left;
        }
        .boxTwo{
            margin-right: 5px;
        }
    }
</style>


