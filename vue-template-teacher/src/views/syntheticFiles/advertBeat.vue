<template>
    <div>
        <Breadcrumb></Breadcrumb>
        <el-form 
                label-width="100px" 
                label-position="right"
                class="module-details"
                >
                <h3 class="module-title">基础部分</h3>
                <section class="form-module fontCss14">
                    <el-form-item label="类型">
                        <el-row>
                            <el-col :span="5">
                                <el-select v-model="value" placeholder="请选择"  @change="currentSel">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>                                
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="" v-if="value==1||value==2">
                        <el-row>
                            <el-col :span="2"><el-radio v-model="radio" label="1">链接</el-radio></el-col>
                            <el-col :span="2"><el-radio v-model="radio" label="2">课程</el-radio></el-col>
                            <el-col :span="2"><el-radio v-model="radio" label="3">活动</el-radio></el-col>
                            <el-col :span="2"><el-radio v-model="radio" label="4">无链接</el-radio></el-col>
                        </el-row>
                        <el-row class="lMarginTop20">
                            <el-col v-if="radio==1" :span="8"><el-input @blur="checkeven" v-model="input" placeholder="http://" clearable></el-input></el-col>
                            <el-col v-else-if="radio==2" :span="8"><el-input v-model="input" placeholder="请输入课程"></el-input></el-col>
                            <el-col v-else-if="radio==3" :span="8"><el-input v-model="input" placeholder="请输入活动ID"></el-input></el-col>
                        </el-row> 
                    </el-form-item>  
                    <el-form-item label="上传" v-if="value==1">
                        <div class="advertCss" v-for="(item,index) in fileList" :key="index">
                            <el-row>
                                <el-col class="fontCss13">图片大小不能大于2M，格式支持  jpg、png、gif</el-col>
                                <el-col>
                                    <el-row>
                                        <el-col :span="6">
                                            <el-upload
                                                class="upload-demo"
                                                :action="actiosService"
                                                :headers="myHeaders"
                                                :before-upload="(file)=>{return beforeUpload(file,index,item.size)}"
                                                :on-success="(file)=>{return uploadFileSuccess(file,index,item.size)}"
                                                :on-error="(file)=>{return uploadFileError(file,index,item.size)}"
                                                :show-file-list="false"
                                                >
                                                <el-button size="small" type="primary">上传图像</el-button>
                                            </el-upload>                                            
                                        </el-col>
                                        <el-col :span="8" class="lCenter-r redFontColor">{{item.sizeTltle}}</el-col>
                                    </el-row>
                                </el-col>
                                <el-col class="lMarginTop20">
                                    <div class="imgstyle">
                                        <div v-loading="item.loading">
                                            <p dontCSS v-if="item.imgs==''">上传图片</p>
                                            <img v-else :src="item.imgs"/>
                                        </div>
                                        <i class="el-icon-circle-close" @click="removeimgs(index)" v-show="item.imgs!=''"></i>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>       
                    </el-form-item>
                    <el-form-item label="视频上传" v-if="value==2">
                        <div class="advertCss">
                            <el-row>
                                <el-col>
                                    <el-row>
                                        <el-col :span="6">
                                            <!-- :action="actiosService"  -->
                                             <!-- :data="keyObj" -->
                                            <el-upload 
                                                class="avatar-uploader el-upload--text"
                                                :action="actiosAudio" 
                                                :headers="myHeaders"
                                                :show-file-list="false" 
                                                :on-success="handleVideoSuccess" 
                                                :before-upload="beforeUploadVideo"
                                                :on-progress="uploadVideoProcess"
                                                >
                                                <el-button size="small" type="primary">上传mov</el-button>
                                            </el-upload>                                            
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col class="lMarginTop20">
                                    <div class="videotyle" v-loading="videoLoading">
                                        <video :src="videoUrl" class="avatar" controls="controls">您的浏览器不支持视频播放</video>
                                        <i class="el-icon-circle-close" @click="removeVideos"></i>
                                    </div>
                                </el-col>
                                <el-col class="fontCss13">MOV视频文件大小不能超过5M</el-col>
                            </el-row>
                        </div>       
                    </el-form-item>
                </section>
                <el-row>
                    <el-col class="lCenter-r" v-if="$authJudge('screen:save')">
                        <el-button class="lButtom lMarginTB50" @click="subdormEven">保存</el-button>
                    </el-col>
                </el-row>
        </el-form>
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
import Breadcrumb from "@/components/formSynthesisPlugin/gxBreadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
import eventAction from '../lEventAtion';
import Dialog from "@/components/myDialog/myDialog";
let actions = new eventAction();
// import editimg1 from "../../../static/images/4.jpg";
const cityOptions = ['链接', '课程', '活动', '无链接'];
export default {
    components:{
        Breadcrumb,
        Dialog
    },    
    data(){
        return {          
            myHeaders: {token: getToken()},
            options: [
                {
                    value: 0,
                    label: '无'
                },{
                    value: 1,
                    label: '图片'
                }
                // ,{
                //     value: 2,
                //     label: 'mov'
                // }
                ],
            value: 0,
            imgs:'',
            input:'',
            videoUrl:'',
            radio:"1",
            rules: {
                surfacePlot: [
                    {
                        required: true,
                        message: "请上传课程封面图",
                        trigger: "change"
                    }
                ]                
            },
            videoLoading:false,
            videoUploadPercent:0,
            listImgObj:{},
            fileList:[
                    {sizeTltle:"Android320*480",size:[320,480],imgs:'',loading:false},
                    {sizeTltle:"Android480*800",size:[480,800],imgs:'',loading:false},
                    {sizeTltle:"Android720*1280",size:[720,1280],imgs:'',loading:false},
                    {sizeTltle:"Android1080*1920",size:[1080,1920],imgs:'',loading:false},
                    {sizeTltle:"Android2159*3840",size:[2159,3840],imgs:'',loading:false},
                    {sizeTltle:"Android1440*3120",size:[1440,3120],imgs:'',loading:false},
                    {sizeTltle:"IOS750*1334",size:[750,1334],imgs:'',loading:false},
                    {sizeTltle:"IOS1125*2436",size:[1125,2436],imgs:'',loading:false},
                    {sizeTltle:"IOS1536*2048",size:[1536,2048],imgs:'',loading:false}
                    ],
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
            changeBool:false,
            adcerTUrl:false,
            handle:false
            // keyObj:{
            //     fileType:'video'
            // }                      
    }},
    created(){
        this.ajaxImglistOrVider();
    },
    props:[],
    computed:{
        actiosService(){
            return  this.$server.actionImgOrvideo;
        },
        actiosAudio(){
            return  this.$server.actionAudiouploadOss;
            }
        
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        if(!this.handle){
            next();
            return;
        }
        if(!this.adcerTUrl){
            var newFormData = JSON.stringify(this.fileList);
            var newFormVideo = JSON.stringify(this.videoUrl);
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
      beforeUpload(file,index ,size){
        this.fileList[index].loading= true;
        const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
            this.fileList[index].loading= false;
            this.$message.error('上传图片只能是 PNG,JPEG,JPG 等格式!');
        }
        if (!isLt2M) {
            this.fileList[index].loading= false;
            this.$message.error('上传图片大小不能超过 2MB!');
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
            this.fileList[index].loading= false;
            this.$message.error('上传的图片必须是等于'+size[0]+'*'+size[1]+'!');
            return Promise.reject();
        });
        return isJPG && isLt2M && isSize;
      },
      //上传成功
      uploadFileSuccess(file, index ,size){
        var self = this;
        self.fileList[index].imgs = file.content.resourceUrl;
        self.$nextTick(function(){
            self.fileList[index].loading= false;
        })       
      },
      uploadFileError(file, index ,size){
            this.fileList[index].loading= false;
            this.$message.error('上传图片大小不能超过 2MB!');       
      },
      //视屏上传验证；
      beforeUploadVideo(file){
            this.videoLoading = true;
            const isLt10M = file.size / 1024 / 1024  < 5;
            if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb','audio/ogg'].indexOf(file.type) == -1) {
                this.videoLoading = false;
                this.$message.error('请上传正确的视频格式');
                return false;
            }
            if (!isLt10M) {
                this.videoLoading = false;
                this.$message.error('上传视频大小不能超过5MB哦!');
                return false;
            }         
      },
      //视屏上传成功
    handleVideoSuccess(file) { 
        this.videoLoading = false;
        // this.videoUrl = file.content.resourceUrl;
        this.videoUrl = file.content;
        console.log(file);
    },     
    uploadVideoProcess(file){
        this.videoUploadPercent = parseInt(file.percent);
    },
     //链接失去焦点验证
    checkeven(event){
        if(this.radio=="1"){
            let checktest = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if( !checktest.test(this.input)){
                this.input = "";
            }
        }
     },
     currentSel(val){
            
            if(val==1){
                var self = this;
                var url = '/flash/select';
                self.fileList.forEach((element,index)=>{
                    element.loading = true;
                });
                actions.getData(url)
                    .then(data => {      
                        if(data){
                            self.fileList[8].imgs=data.ipadPicUrl;		
                            self.fileList[6].imgs=data.iphonePicUrl;		
                            self.fileList[7].imgs=data.iphonexPicUrl;		
                            self.fileList[0].imgs=data.hdpi;		
                            self.fileList[1].imgs=data.mdpi;		
                            self.fileList[2].imgs=data.xhdpi;		
                            self.fileList[3].imgs=data.xxhdpi;	
                            self.fileList[4].imgs=data.xxxhdpi;
                            self.fileList[5].imgs=data.xxxxhdpi;
                            self.radio = data.targetType||"4";      
                            self.$nextTick(function(){
                                self.fileList.forEach((element,index)=>{
                                    element.loading = false;
                                });
                            })  
                        }else{
                            self.$nextTick(function(){
                                self.fileList.forEach((element,index)=>{
                                    element.loading = false;
                                });
                            })                            
                        }                 
                    })
                    .fail(function(){
                    }
                );
            }else if(val==2){
                // self.radio = 4;
            }
     },
     subdormEven(){
        //ipadPicUrl:'',//ipad图片地址		
        //iphonePicUrl:'',//ios图片地址1		
        //iphonexPicUrl:'',//ios图片地址2		
        //hdpi:'',//安卓图片地址1		
        //mdpi:'',//安卓图片地址2		
        //xhdpi:'',//安卓图片地址3		
        //xxhdpi:'',//安卓图片地址4		
        //xxxhdpi:''//安卓图片地址5    
        var self = this;
        var url = '/flash/add';
        if(!self.value){
                var parmeas = {
                    adType:0
                };
                actions.getData(url,parmeas,'post')
                    .then(data => {                                
                        self.adcerTUrl = true;
                        this.handle = false;
                        self.$message({
                            message:
                                "保存成功",
                            type: "success"
                        });                                 
                    })
                    .fail(function(error){
                        console.log(error)
                    }
                );
        }else{
            if(Number(self.radio)!=4&&!self.input){
                switch (Number(self.radio)) {
                    case 1:
                        self.$message.error('请填写链接');
                        break;
                    case 2:
                        self.$message.error('请填写课程id');
                        break;
                    case 3:
                        self.$message.error('请填写活动id');
                        break;                            
                    default:
                        // self.$message.error('请选择课程介绍类型');
                        break;
                    }
                    return;
            }else{
                var parmiseImgObj = {
                        adType:1,//广告类型 1 图片 2 mov		
                        targetType:Number(self.radio)||4,//是	广告目标类型 1:链接,2:课程,3:活动，4:无链接		
                        targetId:self.input,//广告目标idmovAddress:'',//视频地址（VideoId:通过视频上传接口获取到）
                        ipadPicUrl:self.fileList[8].imgs,//ipad图片地址		
                        iphonePicUrl:self.fileList[6].imgs,//ios图片地址1		
                        iphonexPicUrl:self.fileList[7].imgs,//ios图片地址2		
                        hdpi:self.fileList[0].imgs,//安卓图片地址1		
                        mdpi:self.fileList[1].imgs,//安卓图片地址2		
                        xhdpi:self.fileList[2].imgs,//安卓图片地址3		
                        xxhdpi:self.fileList[3].imgs,//安卓图片地址4		
                        xxxhdpi:self.fileList[4].imgs,//安卓图片地址5 
                        xxxxhdpi:self.fileList[5].imgs//安卓图片地址6  		
                    };
                var parmiseVideoObj = {
                        adType:2,//广告类型 1 图片 2 mov		
                        targetType:Number(self.radio)||4,//是	广告目标类型 1:链接,2:课程,3:活动，4:无链接		
                        targetId:self.input,//广告目标id		
                        movAddress:self.videoUrl,//视频地址（VideoId:通过视频上传接口获取到）           
                    };
                var imglength = 0;
                var parmeas = '';
                if(self.value==1){
                    for(var i in self.fileList) {
                            if(!self.fileList[i].imgs){
                                imglength =imglength+1;   
                            }
                    };
                    if(imglength==0||imglength==8){
                        parmeas = parmiseImgObj;
                            actions.getData(url,parmeas,'post')
                                .then(data => {                                
                                    console.log(data);
                                    self.adcerTUrl = true;
                                    self.$message({
                                        message:
                                            "图片上传成功。",
                                        type: "success"
                                    });                                 
                                })
                                .fail(function(error){
                                    console.log(error)
                                }
                            );
                    }else{
                        this.$message.error('所有图片必须上传');
                        return;
                    }
                }else{
                    parmeas = parmiseVideoObj
                    actions.getData(url,parmeas,'post')
                        .then(data => { 
                            self.adcerTUrl = true;
                            this.handle = false;
                            self.$message({
                                message:
                                    "视频上传成功。",
                                type: "success"
                            });                       
                        })
                        .fail(function(error){
                            console.log(error)
                        }
                    );            
                }
            }
        }
     },
     ajaxImglistOrVider(){
                var self = this;
                var url = '/flash/select';
                actions.getData(url)
                    .then(data => { 
                        console.log(data); 
                        self.radio = data.targetType+'';
                        self.input = data.targetId;
                        if(data["adType"]==1){
                            self.value = 1;
                            self.fileList.forEach((element,index)=>{
                                element.loading = true;
                            });     
                            self.fileList[6].imgs=data.iphonePicUrl,		
                            self.fileList[7].imgs=data.iphonexPicUrl,		
                            self.fileList[8].imgs=data.ipadPicUrl,		
                            self.fileList[0].imgs=data.hdpi,		
                            self.fileList[1].imgs=data.mdpi,		
                            self.fileList[2].imgs=data.xhdpi,		
                            self.fileList[3].imgs=data.xxhdpi,	
                            self.fileList[4].imgs=data.xxxhdpi,  
                            self.fileList[5].imgs=data.xxxxhdpi,     
                            self.$nextTick(function(){
                                self.fileList.forEach((element,index)=>{
                                    element.loading = false;
                                });
                                
                            })
                            self.dataUpdateBool = JSON.stringify(this.fileList);
                            this.$nextTick(()=>{
                                setTimeout(()=>{
                                    this.handle = false;
                                },1)
                            })
                            
                        }
                        
                        // else if(data["adType"]==2){
                        //     self.videoLoading = true;
                        //     self.value = 2;
                        //     self.videoUrl = data.movAddress;
                        //     self.$nextTick(function(){
                        //         self.fileList.forEach((element,index)=>{
                        //              self.videoLoading = false;
                        //         });
                        //     })
                        // }
                        else{
                            self.value = 0;
                            self.newFormVideoUrl=JSON.stringify('');
                        }                                           
                    })
                    .fail(function(){
                        self.value = 1;
                        self.fileList.forEach((element,index)=>{
                            element.loading = false;
                        }); 
                    });

     },
     removeimgs(index){
         this.fileList[index].imgs='';
     },
     removeVideos(){
         this.videoUrl='';
     }       
    },
    mounted(){},
    watch:{ 
        fileList:{
            handler(cur,old){
                this.adcerTUrl = false;
                this.handle = true;
            },
            deep:true
        },
        input(curVal,oldVal){
            this.handle = true;
            if(curVal!==oldVal){
                this.adcerTUrl = false;
                this.dataChange = true;
            }
        },
        radio(curVal,oldVal){
            this.handle = true;
            if(curVal==oldVal){
                this.dataChange = true;
            }
            this.adcerTUrl = false;
        },
        value(curVal,oldVal){
            this.handle = true;
            this.adcerTUrl = false;
        }
    }
}
</script>
<style  scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.module-details {
        padding: 20px;
        width: 1160px;
        .form-module{
            border-radius: 5px;
            box-shadow: 0px 0px 9px #edf1f7;
            background: #fff;    
            padding: 20px 10px;
            font-size: 14px;
            .advertCss{
                    width: 400px;
                    .videotyle{
                        position: relative;
                        .progress{
                            position: absolute;
                            left: 50%;
                            top: 40%;
                            transform: translate(-50%, -50%);
                            max-width: 50%;
                            text-align: center;
                            color: #B4272D;                     
                        }
                        .avatar{
                            width: 100%;
                        }
                        i{
                            position:absolute;
                            right: -10px;
                            top:-10px;
                            font-size: 20px;
                            color: #B4272D;
                            z-index: 2001;
                            cursor: pointer;
                        }                        
                    }
                    .imgstyle{
                        width: 157px;
                        height: 81px;
                        position: relative;
                        div{
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                            border: 1px solid #ccc;
                            border-radius: 3px;
                            text-align: center;
                            line-height: 81px;                            
                        }
                        i{
                            position:absolute;
                            right: -10px;
                            top:-10px;
                            font-size: 20px;
                            color: #B4272D;
                            z-index: 2001;
                            cursor: pointer;
                        }
                    }
                }
            }
        .fontCss13{
            color: #D0D0D0;
            font-size: 13px;
        }
        .module-title{
            height: 40px;
            background: #f6f6f8;
            line-height: 40px;
            padding-left: 25px;
            font-size: 14px;
            color: #384156;            
        }
    }
</style>