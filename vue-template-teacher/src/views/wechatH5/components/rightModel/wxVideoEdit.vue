<template>
    <div class="wVideoEdit wModelEdit">
        <div class="wVideo-head">
            <div class="edit1">
                <div>视频设置</div>
                <el-button size="small" type="primary" @click="seave">保存</el-button>
            </div>
        </div>
        <div class="wVideoContent">
            <div class="edit1">
                <div class="editVideo-one">
                    <div class="videotitle">视频</div>
                    <div>
                        <div style="margin-bottom:5px;">{{videoModel.videoName}}</div>
                        <el-button size="small" type="primary" @click="selectCourse">选择视频</el-button>
                        <div class="colorError" v-show="errorTips==1">请选择视频</div>
                    </div>
                </div>
                <div class="editVideo-two">
                    <div class="videotitle">自定义封面图</div>
                    <div style="border: 1px dashed #ccc;">
                        <el-upload
                            class="avatar-uploader"
                            :action="actiosService"
                            :show-file-list="false"
                            :headers="myHeaders"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            >
                            <img v-if="videoModel.imgUrl" :src="videoModel.imgUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                    <div style="margin-left:40px;width:200px;color:#ccc;">图片比例16：9，宽度大于480</div> 
                </div>
            </div>
            <div class="edit2">
                <div class="editVideos">
                    <div>
                        <div>全屏按钮</div>
                        <div>{{videoModel.fullScreen?'显示':'不显示'}}</div>
                    </div>
                    <div>
                        <el-checkbox v-model="videoModel.fullScreen">显示</el-checkbox>
                    </div>
                </div>
                <div class="editVideos">
                    <div>
                        <div>播放进度</div>
                        <div>{{videoModel.progress?'显示':'不显示'}}</div>                          
                    </div>
                    <div>
                        <el-checkbox v-model="videoModel.progress">显示</el-checkbox>
                    </div>
                </div>
            </div>
        </div>
        <div class="dialogMy" v-show="dialogVisibleFour">
        <div class="dialogMyCenter" >
            <div class="videoBox">
                <div class="video1">
                    <el-radio-group v-model="videoModel.type" @change="videoTypeEven">
                        <el-radio :label="4">视频库</el-radio>
                        <el-radio :label="5">短视频</el-radio>
                    </el-radio-group>                    
                </div>
                <div class="video2">
                    <el-input v-model="input" placeholder="请输入内容" style="width:200px"></el-input>
                    <el-button type="text" @click="refreshEven">刷新</el-button>
                </div>
                <div class="video3">
                    <div v-for="(item,index) in tableData" :class="[selectIndex==item.id?'videoIsOk':'videoIsNo']" :key="index" @click="videoObjIsSelect(item)" >
                        <div class="video-left">
                            <img :src="item.videoImage" />
                        </div>
                        <div class="video-right">
                            <div>{{item.title}}</div>
                            <div>
                                <div>{{item.fileSize}}</div>
                                <div>{{formatDuring(item.duration)}}</div>
                            </div>
                            <div class="select-video" v-show="selectIndex==item.id">
                                <img src="../../../../assets/wxImg/select1.png" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
                </div>  
                <div style="text-align: center;">
                    <el-button size="small" type="primary" @click="videoIsok">确定</el-button>
                </div>                      
            </div> 
            </div>                        
        </div>          
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import {mapState,mapActions} from 'vuex'
export default {
    name:'wxVideoEdit',
    props:['modeEditInfo','indexModel'],
    data(){
        return{            
            myHeaders: {token: getToken()},
            radio:1,
            dialogVisibleFour:false,
            input:'',
            pageNo:1,
            tableData:[],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            selectIndex:-1,
            selectVideos:'',
            errorTips:0,
            videoModel:{
                fullScreen:true,
                progress:true,
                imgUrl:'',
                type:4,
                targetId:'',
                style:1,
                videoName:''
            }
        }
    },
    created(){
        if(this.modeEditInfo.microPageRelationRecordList.length>0){
            let contents = JSON.parse(this.modeEditInfo.content);
            var contentType =typeof contents;
            if(contentType==='string'){
                contents = JSON.parse(contents);
            }            
            this.styleIndex = this.modeEditInfo.style;
            this.videoModel={
                    style:this.modeEditInfo.style||1,//样式
                    fullScreen:contents.fullScreen||false,//对齐
                    progress:contents.progress||false,//标题显示
                    imgUrl:this.modeEditInfo.microPageRelationRecordList[0].imgUrl,
                    type:this.modeEditInfo.microPageRelationRecordList[0].type,
                    targetId:this.modeEditInfo.microPageRelationRecordList[0].targetId,
                    videoName:this.modeEditInfo.microPageRelationRecordList[0].videoName||''   
            }
            this.selectIndex = this.modeEditInfo.microPageRelationRecordList[0].targetId;
        }       
    },
    computed:{
        ...mapState(['wxStore']),
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }   
    },
    methods:{
        ...mapActions(['setWxRightData','setWxLeftData','setwxComponentNameType','setwxSavePageIsState']),
        formatDuring(mss) {
            let hours = Math.floor((mss % 86400) / 3600)<10?'0'+Math.floor((mss % 86400) / 3600):Math.floor((mss % 86400) / 3600); //时
            let minutes = Math.floor((mss % 3600) / 60)<10?'0'+Math.floor((mss % 3600) / 60):Math.floor((mss % 3600) / 60); //分
            let seconds = Math.floor((mss % 60) / 1)<10?'0'+Math.floor((mss % 60) / 1):Math.floor((mss % 60) / 1); //秒
            return  hours + " : " + minutes + " : " + seconds;
        },        
        //视频类型变动
        videoTypeEven(data){
            if(data==4){
                this.getVideoOrsmallVideo(1,1);
            }else{
                this.getVideoOrsmallVideo(2,1);
            }
        },
        videoObjIsSelect(data){
            this.selectVideos = data;
            this.selectIndex = data.id;
        },
        //刷新
        refreshEven(){
            if(this.videoModel.type==4){
                this.getVideoOrsmallVideo(1,1);
            }else{
                 this.getVideoOrsmallVideo(2,1);
            }
        },
        selectCourse(){
            this.dialogVisibleFour=true;
            if(this.videoModel.type==4){
                this.getVideoOrsmallVideo(1,1);
            }else{
                 this.getVideoOrsmallVideo(2,1);
            }
        },
        //获取视频，短视频方法；
        getVideoOrsmallVideo(type,num){
            //videoType=2,短视频，1视频
            let self = this;
            if(num){
                self.pageNo = num;
            }
            let query = {
                params:{
                    pageSize:8,
                    page:self.pageNo,
                    videoType:type,
                    title:self.input,
                    videoIds:this.videoModel.targetId
                }
            }             
            self.$http.get(self.$server.getWxVideoList,query).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                    self.tableData = contentdate.items;
                    self.pageAtion.pageTotal = contentdate.totalNum;
                    self.pageAtion.paginationPage = num;
                    // self.$nextTick(function(){
                    //     self.loading = false; 
                    // }) 
               }
                console.log(res);
            })            
        },
        videoIsok(){
            this.dialogVisibleFour=false;
            this.videoModel.targetId = this.selectIndex;
            this.videoModel.videoName = this.selectVideos.title;
        },
        //上传
        handleAvatarSuccess(res, file) {
            // this.ruleForm.iconUrl = URL.createObjectURL(file.raw);
            this.videoModel.imgUrl = res.content.resourceUrl;
        },
        beforeAvatarUpload(file) {
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            // const isLt2M = file.size / 1024 / 1024 < 0.201;
            if (!isJPG) {
            this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
            }
            // if (!isLt2M) {
            // this.$message.error('上传图片大小不能超过 200k!');
            // }            
            const isSize = new Promise(function(resolve, reject) {
                            let width = 480;
                            // let height = 200;
                            let _URL = window.URL || window.webkitURL;
                            let img = new Image();
                            img.onload = function() {
                                let valid = img.width >= width && (img.height/img.width>=0.55&&img.height/img.width<0.5700001);
                                valid ? resolve() : reject();
                            }
                            img.src = _URL.createObjectURL(file);
                        }).then(() => {
                            return file;
                        }, () => {
                            this.$message.error('上传的图片图片比例16：9，宽度大于等于480');
                            return Promise.reject();
                });
            // return isJPG && isLt2M && isSize;
            return isJPG && isSize;
        },
        seave(){
            this.errorTips=0;
            if(!this.videoModel.targetId){
                this.errorTips=1;
                return;
            }
            if(!this.videoModel.imgUrl){
                this.$message.error("请上传图片");
                return;
            }
            let rightwxStoreData=this.wxStore.wxRightData;
            let leftwxStoreData=this.wxStore.wxLeftData;
            let rightdata = rightwxStoreData[this.indexModel];
            let leftdata = leftwxStoreData[this.indexModel];  
            //第一步分开左右两边数组
            let leftNewData= {
                    id:leftdata.id,
                    microPageId:leftdata.microPageId,
                    action:true,
                    style:this.videoModel.style,
                    sort:leftdata.sort,
                    subModule:leftdata.subModule,
                    addLeftId:leftdata.addLeftId,
                    newType:false
                };
            let contebtStr = JSON.stringify({
                        fullScreen:this.videoModel.fullScreen,//全屏按钮现实与否
                        progress:this.videoModel.progress,//播放进度显示与否   
            });                
            let rightNewData= {
                    id:rightdata.id,
                    microPageId:rightdata.microPageId,
                    style:this.videoModel.style,
                    sort:rightdata.sort,
                    subModule:rightdata.subModule,
                    addRightId:rightdata.addRightId,
                    microPageRelationRecordList:[{
                        targetId:this.videoModel.targetId,
                        type:this.videoModel.type,
                        id:rightdata.microPageId,//id: 微页面关联ID
                        microPageDetailId:rightdata.id,//微页面详情ID
                        sort:1,
                        imgUrl:this.videoModel.imgUrl,
                        videoName:this.videoModel.videoName
                    }],  
                    content:contebtStr,
                    newType:false
            }; 
            //第三步替换对应下表的值
            rightwxStoreData.splice(this.indexModel,1,rightNewData);
            leftwxStoreData.splice(this.indexModel,1,leftNewData);
            //第四步，重新保存左右两边的最新值;             
            //设置左边变化数据；
            this.setWxLeftData(leftwxStoreData);
            //设置右边变化数据；
            this.setWxRightData(rightwxStoreData);  
            this.setwxSavePageIsState(true);
            //关闭右侧组件  
            this.setwxComponentNameType('');   
            console.log("wxStore",this.wxStore);             
        },
        childPageValue(num){
            if(Number(num)>0){
                if(this.videoModel.type==4){
                    this.getVideoOrsmallVideo(1,Number(num));
                }else{
                    this.getVideoOrsmallVideo(2,Number(num));
                }
            }
        }        
    },
    watch:{
    }
}
</script>
<style lang="scss" scoped>
.wVideoEdit{
    font-size: 14px;
    .wVideo-head{
        padding-bottom: 20px;
        border-bottom: 1px solid #f4f4f4;        
        .edit1{
            display:flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }
    }
    .wVideoContent{
        .edit1{
            padding: 30px;
            border-bottom: 1px solid #f4f4f4;
            .editVideo-one{
                display:flex;
                flex-direction: row;
                align-items: center;
                justify-content:flex-start;     
                margin-bottom: 35px;
                .videotitle{
                    width: 120px;
                }  
                .videotitle:before {
                        content: '* ';
                        color: red;
                }         
            }
            .editVideo-two{
                display:flex;
                flex-direction: row;
                align-items:flex-start;
                justify-content:flex-start;   
                margin-bottom: 15px;
                .videotitle{
                    width: 120px;
                }  
                .videotitle:before {
                        content: '* ';
                        color: red;
                }                                  
                .avatar-uploader{
                    .el-upload{
                        border: 1px dashed #f4f4f4;
                        border-radius: 6px;
                        cursor: pointer;
                        position: relative;
                        overflow: hidden;                        
                    }
                    .el-upload:hover{
                        border-color: #409EFF;
                    }
                }
                .avatar-uploader-icon{
                    font-size: 28px;
                    color: #8c939d;
                    width: 160px;
                    height: 90px;
                    line-height: 90px;
                    text-align: center;                    
                }
                .avatar{
                    width: 160px;
                    height: 90px;                 
                }
            }
        }
        .edit2{
            padding:20px 30px;
            .editVideos{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                div:nth-child(1){
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;   
                    >div{
                        margin-right: 15px;
                    }                 
                }
            }
        }
    }
    .dialogMy{
        z-index: 2021;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        margin: 0;
        background:rgba(0,0,0,0.5);
        .dialogMyCenter{
            width: 696px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);  
            background: #fff;
            padding: 20px;
            .videoBox{
                .video1{
                    margin-bottom: 15px;
                }
                .video2{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }
                .video3{
                    overflow: auto;
                    margin-top: 10px;
                    >div:nth-child(even){
                        margin-left: 15px;
                    };
                    >div{
                        margin-bottom: 15px;
                        float: left;
                        display: flex;
                        justify-content:flex-start;
                        align-items: center;
                        .video-left{
                            width: 140px;
                            height: 80px;
                            img{
                                display: block;
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .video-right{
                            width: 178px;
                            height: 80px;
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-around;
                            padding: 0 15px;
                            >div:nth-child(2){
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                flex-direction: row;
                            }
                            .select-video{
                                position: absolute;
                                top: 0;
                                right: 0;
                                img{
                                    display: block;
                                    height: 40px;
                                    width: 40px;
                                }
                            }

                        }
                    }
                }
                .block{
                    text-align: center;
                    padding: 40px 0 40px 0;
                    background: #fff;
                }         
            }
        }
    }
}
</style>
<style scoped>
.videoIsOk{
    border: 1px solid #9E0E00 !important;
}
.videoIsNo{
    border: 1px solid #fff !important;
}
.colorError{
    color:#9E0E00;
}
</style>
