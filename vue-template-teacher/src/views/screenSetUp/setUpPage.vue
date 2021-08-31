<template>
    <div class="screen-index">
        <el-row class="lLine40 headerDiv">
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col>
                <div class="advertCss" v-for="(item,index) in fileList" :key="index">
                    <el-row>
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
                                <el-col :span="18" class="lCenter-r redFontColor">{{item.sizeTltle}}</el-col>
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
            </el-col> 
            <el-col :span="8" style="text-align: center;margin-top:20px;">
                <el-button v-if="$authJudge('wisdomscreen:opensave')" size="small" type="primary" @click="saveEven">确定</el-button>
            </el-col>                               
        </el-row>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <span>您有未保存的信息，离开后会丢失，确认要离开吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="leavePage">确 定</el-button>
            </span>
        </el-dialog>               
    </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data() {
        return {
            myHeaders: {token: getToken()},
            titleList:[
                    {
                        name:'大屏设置',
                        pathInfo:'/screenIndex/equite'
                    },
                    {
                        name:'开屏',
                        pathInfo:''
                    }
                ],
            fileList:[
                    {sizeTltle:"图片尺寸大小限1920*1080，大小不超过2M",size:[1920,1080],imgs:'',loading:false}
                    ],
            modelChangeType:false,
            leavePath:'',
            dialogVisible:false,
            disabledState:false
        };
    },
    created(){
        this.returnScreenData();
    },
    components:{
        breadcrumb
    },   
    computed:{
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }
    },
    beforeRouteLeave (to, from, next){
        this.leavePath = to.fullPath;
        if(this.modelChangeType){
            this.dialogVisible = true;
            next(false);
            return;
        }else{
            next();
        }
    },         
    methods: {
        //数据回填
        returnScreenData(){
            var that = this;
            that.$http.get(that.$server.getFlashScreenWisdomScreen).then(res=>{
                if(res.status==200){
                    console.log('res',res);
                    that.fileList[0].imgs=res.content.ipadPicUrl;
                }
            })            
        },
        /**
         * 离开页面
         */
        leavePage(){
            this.modelChangeType = false;
            this.dialogVisible = false;
            setTimeout(()=>{
                this.$router.push(this.leavePath)
            },1)
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
            this.modelChangeType = true;
            self.$nextTick(function(){
                self.fileList[index].loading= false;
            })       
        },
        uploadFileError(file, index ,size){
                this.fileList[index].loading= false;
                this.$message.error('上传图片大小不能超过 2MB!');       
        },
        removeimgs(index){
            this.fileList[index].imgs='';
        },   
        saveEven(){
            var that = this;
            console.log(that.fileList);
            var query = {      
                ipadPicUrl:that.fileList[0].imgs  
            };
            if(!that.disabledState){
                that.disabledState = !that.disabledState;
                that.$http.post(that.$server.saveWisdomScreenImgScreen,query).then(res=>{
                    if(res.status==200){
                        that.modelChangeType = false;
                        that.disabledState = !that.disabledState;
                        that.$message.success("保存成功");
                        that.$router.push('/screenIndex/equite')
                    }
                }).catch(()=>{
                    that.disabledState = !that.disabledState;
                })                
            }            
        },        
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../components/formSynthesisPlugin/my-component.css";
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
        width: 350px;
        height: 181px;
        position: relative;
        div{
            width: 100%;
            height: 100%;
            overflow: hidden;
            border: 1px solid #ccc;
            border-radius: 3px;
            text-align: center;
            line-height: 181px;                            
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
</style>
<style>
.imgstyle .el-loading-mask .el-loading-spinner{
    top: 18% !important;
}
</style>