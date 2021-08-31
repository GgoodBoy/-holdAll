<template>
    <div>         
        <el-row>  
            <el-col>
                <el-row>
                    <!-- <el-col :span="18" class="lLeft-r lSize18">{{nameTitle}}</el-col>      -->
                    <el-col :span="18">
                        <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                    </el-col>                      
                    <el-col :span="6" class="lRight-r">          
                        <el-upload
                            class="upload-demo"
                            :action="actiosService"
                            :headers="myHeaders"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="(file)=>{return beforeAvatarUpload(file,imgSize)}">
                        <el-button v-if="$authJudge('set:honor:upload')" size="small" type="primary">上传图片</el-button>
                        <!-- <div slot="tip" class="el-upload__tip">
                            <p>尺寸:1000*1000</p>
                        </div> -->
                        </el-upload>                          
                    </el-col>                 
                </el-row> 
            </el-col>  

            <el-col class="lMarginTop20">
                <div class="imgListBox" @scroll="handleScroll" v-loading="loading">
                    <el-row>
                        <el-col class="divBox" :span="6" v-for="(item,index) in imgList" :key="index">
                            <div class="imgBox">
                                <div class="imgBoxNext" :class="(item.content.width>item.content.height||item.content.width==item.content.height)?'imgWidthCss':'imgHeightCss'">
                                    <img :src="item.content.url" :class="(item.content.width>item.content.height||item.content.width==item.content.height)?'imgWidthCss':'imgHeightCss'"/>   
                                    <i class="el-icon-circle-close" v-if="$authJudge('set:honor:del')" @click="removeImgEven(item.id)"></i>  
                                </div>
                            </div>
                        </el-col>
                    </el-row>                    
                </div>
            </el-col>            
        </el-row>
    </div>
</template>
<script>
import { getToken } from '@/utils/auth';
import myEditor from "@/components/editor/editor";
import imgs1 from "../../../static/images/4.jpg";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){
        return {
                myHeaders: {token: getToken()},
                introduce:'',
                nameTitle:'',
                imgs1:imgs1,
                imgWidth:0,
                imgHeight:0,
                imgList:[],
                imgSize:[1000,1000],
                pageNo:1,
                pageSize:12,     
                loading:false,       
                scorllBool:true,
                titleList:[
                    {
                        name:'网站管理系统',
                        pathInfo:''
                    }                                               
                ]      
            }
        },
    created() {
        // let routes = this.$router.options.routes;
        this.nameTitle = this.$route.meta.title;  
        this.titleList.push({
                        name:this.nameTitle,
                        pathInfo:''            
                    });              
        this.commonHeader = {
            token: getToken()
        };                
        this.action = this.$server.actionImgOrvideo;
        this.backfillData(3,1);
    },
    computed: {
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }
    },    
    components:{
        myEditor,
        breadcrumb
    },
    methods: {
            //上传之前的操作
            beforeAvatarUpload(file,size){
                    var self = this;
                    self.imgWidth=0;
                    self.imgHeight=0;
                    const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
                    const isLt2M = file.size / 1024 / 1024 < 1;
                    if (!isJPG) {
                        this.$message.error('文件格式有误，请重试！');
                    }
                    if (!isLt2M) {
                        this.$message.error('上传头像图片最大为1M!');
                    }
                    const isSize = new Promise(function(resolve, reject) {
                        let width = size[0];
                        let height = size[1];
                        let _URL = window.URL || window.webkitURL;
                        let img = new Image();
                        img.onload = function() {
                            self.imgWidth=img.width;
                            self.imgHeight=img.height;
                            let valid = img.width <= width && img.height <= height;
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
            //上传成功
            handleAvatarSuccess(res, file){
                var self = this;
                var dataObject = {
                    width:self.imgWidth,
                    height:self.imgHeight,
                    url:res.content.resourceUrl
                }; 
                self.scorllBool=true;
                this.imgSubmitInfoEven(dataObject,3);
            },
            //删除荣誉资质
            removeImgEven(id){
                console.log(id);
                var self = this;
                self.$http.delete(self.$server.aboutUsDelete({id:id})).then(res=>{
                    if(res.status==200){  
                       self.$message.success({ message: "删除成功" });
                       self.backfillData(3,1);
                    }
                });                 
            },
            imgSubmitInfoEven(data,num){
                var self=this;
                var objsString = JSON.stringify({
                        width:data.width,
                        height:data.height,
                        url:data.url                    
                });
                var parmes ={
                    type:num,
                    content:objsString
                };
                self.$http.post(self.$server.informAboutUsSave,parmes).then(res=>{
                    if(res.status==200){ 
                        this.backfillData(3,1);
                    }
                });  
            },
            backfillData(num,pageNumber){
                var self = this;
                self.loading = true;
                if(pageNumber==1){
                    self.imgList = [];
                    self.pageNo=pageNumber;
                }                
                var parmes = {
                    type:num,
                    pageNo:pageNumber,
                    pageSize:self.pageSize
                }
                self.$http.get(self.$server.informImgList(parmes)).then(res=>{
                    if(res.status==200){ 
                        var list = [];
                        if(res.content.list.length>0){
                            res.content.list.forEach(element => {
                                element.content=JSON.parse(element.content);
                                list.push(element)
                            });
                            if(res.content.list.length<self.pageSize){
                                 self.scorllBool=false;
                            }
                        }else{
                            self.scorllBool=false;
                        }
                       self.imgList = self.imgList.concat(list);
                    }
                });  
                self.$nextTick(function(){
                        self.loading = false;
                })
            },
            handleScroll(e) {
                //scrollTop为滚动条在Y轴上的滚动距离。
                //clientHeight为内容可视区域的高度。
                //scrollHeight为内容可视区域的高度加上溢出（滚动）的距离。 
                var self = this;
                if(e.srcElement.scrollTop+e.srcElement.offsetHeight==e.srcElement.scrollHeight){ 
                    // this.loadMore();
                    if(self.scorllBool){
                        this.pageNo++;
                            //加载更多
                        console.log("111");
                        this.backfillData(3,this.pageNo);                        
                    }
                }else{
                    console.log("222");
                }
            }            
    }
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";  
.imgListBox{
    height: 680px;
    overflow: auto;
    width: 100%;
	position: relative;
	// overflow: hidden;    
    border-top: 1px solid #FFF;
    .divBox{
        margin-top: 30px;
        .imgBox{
            display:flex; 
            align-items: center;
            width: 200px;
            height: 200px;
            margin: auto;
            .imgBoxNext{
                margin: auto;
                position: relative;
                img{
                  width: 100%;  
                } 
                .el-icon-circle-close{
                    font-size: 20px;
                    cursor: pointer;
                    position: absolute;
                    top:-10px;
                    right: -10px;
                    color: #18191936;
                }
            }

        }
    }    
}
.imgHeightCss{
    height: 100%;
    width: auto !important;
}
.imgWidthCss{
    width: 100%;
    height: auto !important;
}
</style>