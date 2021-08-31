<template>
    <div>
        <el-row :gutter="20">
            <el-col>
                <breadcrumb :menuList ='titleListName'></breadcrumb>
            </el-col>            
            <el-col>
                <elMenusGx :menuList ='titleList'></elMenusGx>
            </el-col>   
            <el-col class="lMarginTop30">
                <el-row :gutter="20" >
                    <el-col :span="4" class="lMarginTop20">
                        <el-row>
                            <el-col class="lMarginTop40">
                                <div class="backStyle" @click="backEven('topicBack')" :class="chooseBackCss=='topicBack'?'bgImgSet1':'bgImgSet2'">试题背景</div>
                            </el-col>
                            <el-col class="lMarginTop30">
                                <div class="backStyle"  @click="backEven('posterBack')" :class="chooseBackCss=='posterBack'?'bgImgSet1':'bgImgSet2'">分享海报背景</div>
                            </el-col>
                        </el-row>   
                    </el-col>   
                    <el-col :span="20">
                        <el-row>
                            <el-col class="lRight-r">
                                <el-button class="redBackColor butColorF" @click="uploadImgOrBacks">上传背景</el-button>
                            </el-col>
                            <el-col class="whilteBack lMarginTop20 lPadding10" v-if="(imgList.length>0||imgListNext.length>0)?true:false">
                                <el-row>
                                    <el-col v-if="chooseBackCss=='topicBack'" v-loading="loading">
                                        <el-row :gutter="20">
                                            <el-col class="backDivStyle lMarginTop10 lMarginBO20" :span="4" v-for="(item,index) in imgList" :key="index">
                                                <div class="imgDiv" @mouseenter="enter(index)" @mouseleave="leave(index)">
                                                    <img v-bind:src="item.backgroundUrl"/>
                                                    <i class="el-icon-circle-close-outline lSize18-i redFontColor" v-if="index==indexNow" @click="removeImg(item.id)"></i>
                                                    <div class="wordsCss lCenter-r">{{item.name}}</div>
                                                </div>
                                            </el-col>
                                            <el-col class="lMarginTop30">
                                                <div class="block">
                                                    <el-pagination
                                                        background
                                                        layout="prev, pager, next"
                                                        @current-change="childPageValue"
                                                        :page-size="12"
                                                        :current-page.sync="pageAtion.paginationPage"
                                                        :total="pageAtion.pageTotal">
                                                    </el-pagination>
                                                </div>                                         
                                            </el-col>
                                        </el-row>                                
                                    </el-col>
                                    <el-col v-if="chooseBackCss=='posterBack'" v-loading="loading1">
                                        <el-row :gutter="20">
                                            <el-col class="backDivStyle lMarginTop10 lMarginBO20" :span="4" v-for="(item,index) in imgListNext" :key="index">
                                                <div class="imgDiv" @mouseenter="enter(index)" @mouseleave="leave(index)">
                                                    <img v-bind:src="item.backgroundUrl"/>
                                                    <i class="el-icon-circle-close-outline lSize18-i redFontColor" v-if="index==indexNow" @click="removeImg(item.id)"></i>
                                                    <p class="lCenter-r wordsCss ">{{item.name}}</p>
                                                </div>
                                            </el-col>
                                            <el-col class="lMarginTop30">
                                                <div class="block">
                                                    <el-pagination
                                                        background
                                                        layout="prev, pager, next"
                                                        :page-size="12"
                                                        @current-change="childPageValueSecond"
                                                        :current-page.sync="pageAtionSecond.paginationPage"
                                                        :total="pageAtionSecond.pageTotal">
                                                    </el-pagination>
                                                </div>                                                     
                                            </el-col>
                                        </el-row>                                 
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col v-if="(imgList.length==0&&imgListNext.length==0)?true:false" class="lCenter-r whilteBack lPadding30 lMarginTop30">
                                当前无数据
                            </el-col>
                        </el-row>
                    </el-col>         
                </el-row>  
            </el-col>         
        </el-row>   
        <el-dialog
            :visible.sync="uploadCreatImgOrBackDialog"
            :close-on-click-modal='false'
            title=""
            max-height="300"
            width="35%">  
            <el-row>
                <el-col class="lCenter-r">{{uploadPosterOrBackTitle}}</el-col>
                <el-col class="lMarginTop30">
                    <el-row :gutter="20">
                        <el-col :span="3" class="lLine40">
                            背景名称:
                        </el-col>
                        <el-col :span="14"  class="lLine40">
                            <el-input v-model.trim="imgName" @keyup.native="proving('imgName')" maxlength="10" ref="customerInput" placeholder="请输入内容" class="width100"></el-input>
                        </el-col>  
                        <el-col class="lLine40 redFontColor" :span="6">
                            <p>* 名称不能为空</p>
                        </el-col>                         
                    </el-row>                    
                </el-col>  
                <el-col class="lMarginTop30">
                    <!-- :before-upload="(file)=>{return beforeAvatarUpload(file,imgSize)}" -->
                        <el-upload
                        class="upload-demo"
                        :action="actiosService"
                        :headers="myHeaders"
                        :on-exceed="handleExceed"
                        :before-upload="(file)=>{return beforeAvatarUpload(file,imgSize)}"
                        :on-success="handleAvatarSuccess"
                        :on-remove="handleRemove"
                        list-type="picture"
                        :limit="limits"
                        :file-list="fileList"
                        :show-file-list="showFileList"
                        >
                        <!-- :show-file-list="false" -->
                        <el-button size="small" class="redBackColor butColorF">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过800kb</div>
                        <div slot="tip" class="el-upload__tip">上传尺寸:{{imgSize[0]}}*{{imgSize[1]}}</div>
                        </el-upload> 
                        <p class="redFontColor" v-show="imgchooseBool">*请选择图片</p>                                        
                </el-col>
                <!-- <el-col class="lMarginTop10">
                    <el-row :gutter="20">
                        <el-col :span="8" :offset="8" class="lMarginTop20">
                            <img width="100%" :src="backgroundUrl" alt="">
                        </el-col>
                    </el-row>
                </el-col> -->
                <el-col class="lMarginTop20">
                    <el-row :gutter="20">
                        <el-col :span="4" :offset="10" class="lMarginTop20 lCenter-r">
                            <el-button class="redBackColor butColorF" :disabled="butDisable" :loading="butDisable" @click="saveImg(chooseBackCss)">保存</el-button>
                        </el-col>
                    </el-row>
                </el-col>                
            </el-row>
        </el-dialog>   
        <el-dialog
            :visible.sync="removeDialogisOkOrNo"
            title=""
            max-height="300"
            width="35%">  
                <el-row :gutter="20">
                    <el-col class="lCenter-r">
                            确认删除当前背景图
                    </el-col>                    
                    <el-col class="lMarginTop20 lCenter-r">
                        <el-row :gutter="20">
                            <el-col :span="4" :offset="8"><el-button @click="dialogIsNo(1)">取消</el-button></el-col>
                            <el-col :span="4"><el-button class="redBackColor butColorF" @click="removeIsOk()">确定</el-button></el-col>
                        </el-row> 
                    </el-col>
                </el-row>
        </el-dialog>              
    </div>
</template>
<script>
import elMenusGx from "@/components/elMenu/elMenusGx";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data(){                     
        return {
            myHeaders: {token: getToken()},
            flags:[],    
            titleListName:[
                            {
                                name:'活动',
                                pathInfo:'/activityObjList'
                            },
                            {
                                name:'H5活动',
                                pathInfo:''
                            }               
                ],
            titleList:[
                {
                    name:'测评管理',
                    pathInfo:'/activityObj/answer',
                    divCss:false
                },
                {
                    name:'题目库',
                    pathInfo:'/activityObj/itemBank',
                    divCss:false
                },
                {
                    name:'诗词库',
                    pathInfo:'/activityObj/poetryLibrary',
                    divCss:false
                },
                {
                    name:'设置',
                    pathInfo:'/activityObj/setUpGx',
                    divCss:true
                },
                {
                    name:'统计',
                    pathInfo:'/activityObj/gxStatistics',
                    divCss:false
                }                                
            ],
            imgList:[],
            imgListNext:[],            
            indexNow:-1,
            chooseBackCss:'topicBack',
            uploadCreatImgOrBackDialog:false,
            removeDialogisOkOrNo:false,
            uploadPosterOrBackTitle:'上传试题背景',
            imgName:'',
                //上传
            backgroundUrl:'',
            //上传图片尺寸限制
            imgSize:[750,1334],
            // imgSize:[162,130],
            //上传图片数量限制
            limits:1,
            typeImg:1,
            imgchooseBool:false,
            //分页
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },   
            pageAtionSecond:{
                pageTotal:0,
                paginationPage:1
            },  
            pageSize:12,
            pageNo:1,
            numId:'',
            fileList:[],
            showFileList:false,   
            butDisable:false,
            imgNameNext:'',
            loading:false,
            loading1:false     
        }
    },
    computed:{
        actiosService(){
            return  this.$server.actionImgOrvideo
        }
    },  
    components:{
        elMenusGx,
        breadcrumb
    },    
    created(){ 
        this.topicBackEvenList(1);
    },
    methods:{
        proving(val){
            var self = this;
            var reg = /^(?!.*\\.*$)/;        
            switch (val) {
                case 'imgName':
                    if(!reg.test(self.imgName)){
                        this.imgName='';
                    }                    
                    break;           
                default:
                    break;
            }    
        },         
        dialogIsNo(num){
            switch (num) {
                case 1:
                    this.removeDialogisOkOrNo=false;
                    break;
                default:
                    break;
            }
        },
        removeIsOk(){
            var self = this;
            self.$http.post(self.$server.h5BackgroundImgId({id:self.numId})).then(res=>{
               if(res.status==200){
                   if(self.typeImg==1){
                       this.topicBackEvenList(1);
                   }else{
                       this.posterBackEvenList(1);
                   }
                   this.removeDialogisOkOrNo=false;
               }
            });              
        },
        handleRemove(file, fileList){
            this.fileList=[];
            this.imgNameNext='';
            this.backgroundUrl ='';
            console.log(file, fileList);
        },
        //删除背景图
        removeImg(num){
            this.removeDialogisOkOrNo=true;
            this.numId = num;        
        },
        saveImg(val){
            var self = this;
            var prames = {
                backgroundUrl:self.backgroundUrl,
                name:self.imgName,
                type:self.typeImg
            };
            if(!self.imgName.length>0){
                this.$refs.customerInput.$el.querySelector('input').focus();
                return;
            }
            if(!self.backgroundUrl.length>0){
                self.imgchooseBool = true
                return;
            }            
            self.butDisable = true;
            self.$http.post(self.$server.h5BackgroundImgAdd,prames).then(res=>{
               if(res.status==200){
                    self.backgroundUrl ='';
                    self.imgName='';
                    // self.typeImg='';
                    self.fileList=[];
                    self.imgNameNext='';                   
                   if(self.typeImg==1){
                       this.topicBackEvenList(1);
                   }else{
                       this.posterBackEvenList(1);
                   }
                   this.uploadCreatImgOrBackDialog = false;
                   self.butDisable = false;
               }
            }).catch(function(error) {
                self.butDisable = false;
            });            
        },
        //上传banner图；
        handleAvatarSuccess(res, file) {
            this.backgroundUrl=res.content.resourceUrl;
            this.imgNameNext = res.content.resourceName;
            this.imgchooseBool = false;
        },
        //上传图片前的验证；
        beforeAvatarUpload(file,size) {
            var self = this;
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < 0.8;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片最大为800K!');
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
                if(isJPG && isLt2M ){
                    setTimeout(function(params) {
                        self.showFileList = true;
                    },300);
                } 
                return file;
            }, () => {
                    self.showFileList = false;
                this.$message.error('上传的图片必须是等于'+size[0]+'*'+size[1]+'!');
                return Promise.reject();
            });

            return isJPG && isLt2M && isSize; 
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制上传 ${this.limits} 张图片`);
        },
        enter(i){
            this.indexNow = i;
        },
        leave(i){
            this.indexNow = -1;
        },
        backEven(cssinfo){
            this.chooseBackCss = cssinfo;
            if(cssinfo=="topicBack"){
                this.typeImg = 1;
                this.topicBackEvenList(1);
                this.imgSize=[750,1334]
                this.uploadPosterOrBackTitle = '上传试题背景';
            }else{
                this.typeImg = 2;
                this.posterBackEvenList(1);
                this.imgSize=[555,490];
                this.uploadPosterOrBackTitle = '上传海报背景';
            }
        },
        uploadImgOrBacks(){
            this.fileList=[];
            this.imgName='';
            this.imgNameNext = '';
            this.uploadCreatImgOrBackDialog = true;
            this.butDisable=false;
        },
        posterBackEvenList(num){
            var self = this;
            self.imgList=[];
                if(num){
                    self.pageNo = num;
                }
                var params = {
                    pageNo:self.pageNo,
                    pageSize:self.pageSize
                };
                self.loading1=true;
                self.$http.get(self.$server.h5BackgroundImgShare(params)).then(res=>{
                if(res.status==200){
                    var listIds = [];
                    var contentdate = res.content;
                    var nextPage = contentdate.nextPage;
                    var prePage = contentdate.prePage;
                    if(contentdate.list.length){
                            if(!prePage&&!nextPage){
                                listIds = contentdate.list.map(function(element,index){
                                    element.sortId = index+1;
                                    return element;
                                });
                            }else{
                                listIds = contentdate.list.map(function(element,index){
                                    element.sortId = prePage*10+index+1;
                                    return element;
                                });                            
                            }                    
                    }; 
                    self.imgListNext = listIds;
                    self.pageAtionSecond.pageTotal = contentdate.total;
                    self.pageAtionSecond.paginationPage = num;
                    self.loading1=false;
                }
                })
                .catch(res => {
                        self.loading1=false;
                });         
        },
        topicBackEvenList(num){
            var self = this;
            self.imgListNext=[];
            if(num){
                self.pageNo = num;
            }
            var params = {
                pageNo:self.pageNo,
                pageSize:self.pageSize
            };
            self.loading=true;
            self.$http.get(self.$server.h5BackgroundImgQuestion(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                return element;
                            });                            
                        }                    
                   }; 
                    self.imgList = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loading = false;
               }
            })
            .catch(res => {
                    self.loading=false;
            });                                  
        },
        childPageValue(num){
            if(Number(num)>0){
                this.topicBackEvenList(Number(num))
            }
        },   
        childPageValueSecond(num){
            if(Number(num)>0){
                this.posterBackEvenList(Number(num))
            }
        },        
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.backStyle{
    padding: 10px 20px;
    font-size: 16px;
    border: 1px solid #ccc;
    text-align: center;
    width: 100%;
    line-height: 40px;
}
.backStyle:hover{
    cursor: pointer;
}
.backDivStyle .imgDiv{
    position: relative;
}
.backDivStyle .imgDiv img{
    width: 100%;
}
.backDivStyle .imgDiv i{
    position:absolute;
    top:-9px;
    right: -9px;
}
.backDivStyle .wordsCss{
    position:absolute;
    bottom: -20px;
    width: 100%;
}
.bgImgSet1{
    background-color:#ccc;
    color:#fff;
}
.bgImgSet2{
     background-color:#f2f2f2;
     color:#000;
}
.block{
        text-align: center;
        padding: 20px 0 20px 0;
        background: #fff;
    }
</style>


