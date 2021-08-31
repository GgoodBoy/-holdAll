<template>
    <div class="img-upload-page">
        <div class="headerStyle">
            APP顶部特色设置
        </div>
        <div class="imgContent">
            <div class="editVideo-two" v-for="(item,index) in upLoadList" :key="index">
                <div class="videotitle">{{item.title}}</div>
                <div>
                    <div class="uploadBox">
                        <el-upload
                            class="avatar-uploader"
                            :action="actiosService"
                            :show-file-list="false"
                            :headers="myHeaders"
                            :before-upload="(file)=>{return beforeAvatarUpload(file,index,item.type)}"
                            :on-success="(file)=>{return handleAvatarSuccess(file,index)}"                            
                            >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                        <div style="color:#ccc;margin-left:10px;">尺寸:{{(item.type==1||item.type==2)?'750*212':'1536*228'}};支持PNG,JPEG</div>
                    </div>
                </div>
                <div :class="{ imgStyle1: (item.type==1||item.type==2), imgStyle2: (item.type==3||item.type==4), }" v-loading='item.loadings'>
                    <img v-if='item.imgUrl' :src="item.imgUrl"/>
                    <i class="el-icon-delete-solid" @click="closeImgIcon(index)"></i>
                </div>
            </div>   
            <el-button style="background:#9E0E00;color:#fff;margin-left:215px;" @click="save" v-if="$authJudge('admin:topfeatures:add')">保存</el-button>    
        </div>
    </div>
</template>
<script>
    import { getToken,setToken,removeToken} from '@/utils/auth';
    export default{
        data(){
            return {
                myHeaders: {token: getToken()},
                upLoadList:[
                    {
                        loadings:false,
                        imgUrl:'',
                        type:1,
                        title:'APP成人版设置'
                    },{
                        loadings:false,
                        imgUrl:'',
                        type:2,
                        title:'APP少儿版设置'
                    },
                    {
                        loadings:false,
                        imgUrl:'',
                        type:3,
                        title:'Ipad成人版设置'
                    },{
                        loadings:false,
                        imgUrl:'',
                        type:4,
                        title:'Ipad少儿版设置'
                    }
                ]
            }
        },
        created(){
            this.getImgInfo();
        },
        computed:{
            actiosService(){
                return  this.$server.actionImgOrvideo;
            }   
        },
        methods:{   
            //删除
            closeImgIcon(index){
                this.upLoadList[index].imgUrl='';
            },
            //上传
            handleAvatarSuccess(file,index) {
                this.upLoadList[index].imgUrl =file.content.resourceUrl;
                this.upLoadList[index].loadings = false;
            },
            beforeAvatarUpload(file,index,type) {
                this.upLoadList[index].loadings = true;
                const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
                let isLt2M=0;
                if(type==3||type==4){
                    isLt2M = file.size / 1024 / 1024 < 2.001;
                    if (!isLt2M) {
                        this.$message.error('上传图片大小不能超过 2m!');
                    }                     
                }
                // const isLt2M = file.size / 1024 / 1024 < 0.201;
                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
                }
                // if (!isLt2M) {
                // this.$message.error('上传图片大小不能超过 200k!');
                // }            
                const isSize = new Promise(function(resolve, reject) {
                                let width = (type==1||type==2)?750:1536;
                                let height = (type==1||type==2)?212:228;
                                let _URL = window.URL || window.webkitURL;
                                let img = new Image();
                                img.onload = function() {
                                    let valid = img.width == width && img.height==height;
                                    valid ? resolve() : reject();
                                }
                                img.src = _URL.createObjectURL(file);
                            }).then(() => {
                                this.upLoadList[index].loadings = false;
                                return file;
                            }, () => {
                                this.upLoadList[index].loadings = false;
                                this.$message.error('上传的图片尺寸:'+(type==1||type==2)?750*212:1536*228)+'.'
                                return Promise.reject();
                    });
                if(type==3||type==4){
                    return isJPG && isLt2M && isSize;
                }else{
                    return isJPG && isSize;
                }
            },
            save(){
                // if(!this.upLoadList[0].imgUrl||!this.upLoadList[0].imgUrl){
                //     this.$message.error('请选择图片');
                //     return;
                // }
                var parems={};
                this.upLoadList.forEach((element,index)=>{
                    parems['topFeaturesFormList['+index+'].id']=element.id||'';
                    parems['topFeaturesFormList['+index+'].type']=element.type;
                    parems['topFeaturesFormList['+index+'].url']=element.imgUrl||'';
                });
                this.$http.post(this.$server.appAddTopFeatures,parems).then(res=>{
                    if(res.status==200){ 
                        this.$message.success("保存成功");
                    }
                })     
            },
            getImgInfo(){
                this.$http.get(this.$server.appGetDetailInfo).then(res=>{
                    if(res.status==200){
                        if(res.content.length>0){
                            let list =[];
                            let listTwo = this.upLoadList.concat([]);
                            this.upLoadList=[];
                            res.content.forEach(element => {
                                let title = '';
                                switch (element.type) {
                                    case 1:
                                        title = 'APP成人版设置';
                                        break;
                                    case 2:
                                        title = 'APP少儿版设置';
                                        break;
                                    case 3:
                                        title = 'Ipad成人版设置';
                                        break;
                                    case 4:
                                        title = 'Ipad少儿版设置';
                                        break;
                                    default:
                                        break;
                                }
                                list.push({
                                    imgUrl:element.url,
                                    loadings:false,
                                    id:element.id,
                                    type:element.type,
                                    title:title                           
                                });
                            })
                            listTwo.forEach((elementI,indexI)=>{
                                list.forEach((elementJ,indexJ)=>{
                                    if(elementI.type==elementJ.type){
                                        listTwo[indexI]= elementJ
                                    }
                                });
                            })
                            this.upLoadList = listTwo;
                        }
                    }
                })                
            }         
        }
    }
</script>
<style lang="scss">
    .img-upload-page{
        .headerStyle{
            margin: 15px 0;
            background: #fff;
            padding: 15px;
        }
        .imgContent{
            background: #fff;
            padding: 15px;
            .editVideo-two{
                display:flex;
                flex-direction:column;
                align-items:flex-start;
                justify-content:flex-start;   
                margin-bottom: 15px;
                .uploadBox{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .avatar-uploader{
                        width: 80px;
                        background:#9E0E00;
                        border-radius: 6px;
                        height: 30px;
                        line-height: 30px;
                        color: #ffffff;
                        text-align: center;
                    }
                }
                .videotitle{
                    width: 130px;
                    margin-bottom: 20px;
                    font-size: 18px;
                }  
                // .videotitle:before {
                //         content: '* ';
                //         color: rgb(250, 245, 245);
                // }
                .imgStyle1{
                    position: relative;
                    width: 400px;
                    height: 113.1px;
                    background: #f4f4f4;
                    margin: 20px 80px;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                    i{
                        position: absolute;
                        right: -20px;
                        font-size: 14px;
                        top:0
                    }
                } 
                .imgStyle2{
                    position: relative;
                    width: 400px;
                    height: 60px;
                    background: #f4f4f4;
                    margin: 20px 80px;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                    i{
                        position: absolute;
                        right: -20px;
                        font-size: 14px;
                        top:0
                    }
                }
            }        
        }
       
    }
</style>
