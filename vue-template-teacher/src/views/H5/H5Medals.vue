<template>
    <div class="page-H5-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>    
        </div>
        <div class="page-content">
            <div class="editVideo-two" v-for="(item,index) in medalFormList" :key="index">
                <div class="videotitle" v-if="item.grade==1">一级勋章</div>
                <div class="videotitle" v-else-if="item.grade==2">二级勋章</div>
                <div class="videotitle" v-else-if="item.grade==3">三级勋章</div>
                <div class="videotitle" v-else>四级勋章</div>
                <div>
                    勋章名称<el-input placeholder="请输入内容" v-model="item.medalName" style="width:200px;margin:10px 5px;"></el-input>
                </div>
                <div>
                    <div class="uploadBox">
                        <el-upload
                            class="avatar-uploader"
                            :action="actiosService"
                            :show-file-list="false"
                            :headers="myHeaders"
                            :before-upload="(file)=>{return beforeAvatarUpload(file,index)}"
                            :on-success="(file)=>{return handleAvatarSuccess(file,index)}"                            
                        >
                        <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                        <div style="color:#ccc;margin-left:10px;">尺寸：100*100px，大小≤1m</div>
                    </div>
                </div>
                <div class="imgStyle1">
                <!-- <div class="imgStyle1"> -->
                    <img v-if='item.medalImg' :src="item.medalImg"/>
                    <i class="el-icon-delete-solid" @click="closeImgIcon(index)"></i>
                </div>
            </div>           
        </div>  
        <div style="text-align: center;margin-top:20px;">
            <el-button @click="medalsEven(false)">取消</el-button>
            <el-button @click="medalsEven(true)" type="primary">确认</el-button>
        </div> 
    </div>
</template>

<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            myHeaders: {token: getToken()},
                titleList:[],
                id:'',
                courseId:'',
                // loadList:[
                //     {loadings:false},
                //     {loadings:false},
                //     {loadings:false},
                //     {loadings:false}
                // ],
                medalFormList:[
                    {
                        interactCourseId:'',
                        grade:1,
                        medalName:'',
                        medalImg:'',                       
                    },
                    {
                        interactCourseId:'',
                        grade:2,
                        medalName:'',
                        medalImg:''                        
                    },
                    {
                        interactCourseId:'',
                        grade:3,
                        medalName:'',
                        medalImg:''                        
                    },
                    {
                        interactCourseId:'',
                        grade:4,
                        medalName:'',
                        medalImg:''                        
                    }
                ]
        };
    },
    components: {
        breadcrumb
    },
    watch: {},
    computed:{
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }   
    },
    created() {
        this.id = this.$route.query.id||'';
        this.courseId = this.$route.query.courseId||'';

        this.titleList=[
            {
                name:'H5课程',
                pathInfo:'/H5WebView/index'
            },
            {
                name:'创建H5课程',
                pathInfo:'/H5WebView/H5Creat/'+this.courseId
            },
            {
                name:'勋章设置',
                pathInfo:''
            }                 
        ];       
        if(this.id){
            this.backfillData();
            this.medalFormList.forEach((item,index)=>{
                item.interactCourseId=this.id;
            });
        }
    },
    methods: {   
            medalsEven(type){
                if(type){
                    for (const iterator of this.medalFormList) {
                        if(!iterator.medalName||!iterator.medalImg){
                            this.$message.error("请完善勋章创建!");
                            return;
                        }
                    }
                    let query= {};
                    this.medalFormList.forEach((item,index)=>{
                        query['medalFormList['+index+'].id'] = item.id; 
                        query['medalFormList['+index+'].grade'] = item.grade; 
                        query['medalFormList['+index+'].medalName'] = item.medalName; 
                        query['medalFormList['+index+'].medalImg'] = item.medalImg;  
                        query['medalFormList['+index+'].interactCourseId'] = item.interactCourseId;  
                    })
                    this.$http.post(this.$server.h5InteractMedal,query).then(res=>{
                        if(res.status==200){
                            this.$message.success("创建成功!");
                            // this.$router.push({
                            //     path:'/H5WebView/H5Creat',
                            //     query:{
                            //         id:this.courseId
                            //     }
                            // }) 
                            this.$router.push(`/H5WebView/H5Creat/${this.courseId}`)     
                        }
                    })
                }else{
                    // this.$router.push({
                    //     path:'/H5WebView/H5Creat',
                    //     query:{
                    //         id:this.courseId
                    //     }
                    // })  
                    this.$router.push(`/H5WebView/H5Creat/${this.courseId}`)                                           
                }
            },
            //勋章数据回填
            backfillData(){
                this.$http.get(this.$server.h5InteractMedal+'/'+this.id).then(res=>{
                    if(res.status==200){
                        if(res.content.length>0){
                            let lists = [];
                            res.content.forEach((element,index)=>{
                                lists.push({
                                    interactCourseId:element.interactCourseId,
                                    grade:element.grade,
                                    medalName:element.medalName,
                                    medalImg:element.medalImg,
                                    id:element.id
                                });
                            })
                            this.medalFormList=lists;
                        }
                    }
                })                 
            },


            //删除
            closeImgIcon(index){
                this.medalFormList[index].medalImg='';
            },
            //上传
            handleAvatarSuccess(file,index) {
                this.medalFormList[index].medalImg =file.content.resourceUrl;
                // this.loadList[index].loadings = false;
            },
            beforeAvatarUpload(file,index) {
                // this.loadList[index].loadings = true;
                const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
                let isLt2M=0;
                // if(type==3||type==4){
                    isLt2M = file.size / 1024 / 1024 < 1.001;
                    if (!isLt2M) {
                        this.$message.error('上传图片大小不能超过 1m!');
                    }                     
                // }
                // const isLt2M = file.size / 1024 / 1024 < 0.201;
                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
                }
                // if (!isLt2M) {
                // this.$message.error('上传图片大小不能超过 200k!');
                // }            
                const isSize = new Promise(function(resolve, reject) {
                                // let width = (type==1||type==2)?750:1536;
                                // let height = (type==1||type==2)?212:228;
                                let width = 100;
                                let height = 100;
                                let _URL = window.URL || window.webkitURL;
                                let img = new Image();
                                img.onload = function() {
                                    let valid = img.width == width && img.height==height;
                                    valid ? resolve() : reject();
                                }
                                img.src = _URL.createObjectURL(file);
                            }).then(() => {
                                // this.loadList[index].loadings = false;
                                return file;
                            }, () => {
                                // this.loadList[index].loadings = false;
                                this.$message.error('上传的图片尺寸:100*100.');
                                return Promise.reject();
                    });
                // if(type==3||type==4){
                    return isJPG && isLt2M && isSize;
                // }else{
                //     return isJPG && isSize;
                // }
            }
    }
};
</script>

<style scoped lang="scss">
    .page-H5-wrap {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        overflow: hidden;   
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            overflow: hidden;
            padding:15px;
            .editVideo-two {
                // display:flex;
                // flex-direction:column;
                // align-items:flex-start;
                // justify-content:flex-start;   
                margin-bottom: 15px;
                float: left;
                width:45%;
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
                .imgStyle1{
                    position: relative;
                    width: 100px;
                    height: 100px;
                    background: #f4f4f4;
                    margin: 20px 30px;
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

