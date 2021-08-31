<template>
    <div class="H5-creat-section">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>    
        </div>
        <div class="page-content">
            <div>
                小节名称<el-input style='width:250px;margin-left:5px;' maxlength='20' v-model="periodName"></el-input>
                <span>{{periodName.length||0}}/20</span>
            </div>
            <div class="tab-one-box">     
                <div>
                    小节图片
                </div>              
                <div class="uploadBox">
                    <el-upload
                        class="avatar-uploader"
                        :action="actiosService"
                        :show-file-list="false"
                        :headers="myHeaders"
                        :before-upload="(file)=>{return beforeAvatarUpload(file,1)}"
                        :on-success="(file)=>{return handleAvatarSuccess(file,1)}"                            
                        >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                    <div style="color:#ccc;margin-left:10px;">尺寸:609*399;大小≤1m,支持PNG,JPEG</div>
                </div>
                <div class="imgStyle1">
                    <img v-if='backgroundImg' :src="backgroundImg"/>
                    <i class="el-icon-delete-solid" @click="closeImgIcon()"></i>
                </div>
            </div> 
            <div class="tab-two-box">
                <div class="title">小节模块</div>
                <div class="section-model-box">
                    <div class="tablist">
                        <el-button size="medium" :type="tabsType==1?'primary':''" @click="tabsEven(1)">听一听</el-button>
                        <el-button size="medium" :type="tabsType==2?'primary':''" @click="tabsEven(2)">
                            <span v-if="actionH5Id==3">说一说</span>
                            <span v-else-if="actionH5Id==4">想一想</span>
                            <span v-else>测一测</span>
                        </el-button>
                        <el-button size="medium" :type="tabsType==3?'primary':''" @click="tabsEven(3)">
                            <span v-if="actionH5Id==3">玩一玩</span>
                            <span v-else-if="actionH5Id==4">用一用</span>
                            <span v-else>演一演</span>
                        </el-button>
                    </div>
                    <div class="tabContent">
                        <div class="contentOne" v-if="tabsType==1">
                            <div style="font-size:12px;color:#ccc;">设置小孚星和智力值，是对学完该模块的用户的奖励</div>
                            <div class='inputText'>
                                <div class='title'>智力值</div>
                                <el-input style="width:200px;" @blur="blurEven(periodModuleListOne[0].intellectNum)" v-model="periodModuleListOne[0].intellectNum" placeholder="0-100整数"></el-input>
                            </div>
                            <div class='inputText' style="border-bottom: 1px solid #ccc;padding-bottom:10px;">
                                <div class='title'>孚 星</div>
                                <el-input style="width:200px;margin-top:10px;" @blur="blurEven(periodModuleListOne[0].starNum)" v-model="periodModuleListOne[0].starNum" placeholder="0-100整数"></el-input>
                            </div>
                        </div>  
                        <div class="contentTwo" v-if="tabsType==2">
                            <div style="font-size:12px;color:#ccc;">设置小孚星和智力值，是对该模块答完每一道题的奖励</div>
                            <div style="padding-bottom:10px;font-size:12px;color:#ccc;">注：课程上线后测一测题目数的增加和删除将影响用户，更改后请记得前端发版更新</div>
                            <el-button size="medium" type="primary" @click='addTheTitle' :disabled="periodModuleListTwo.length>=10?true:false">添加题数</el-button>
                            <div v-for="(item,index) in periodModuleListTwo" :key="index" style="border-bottom: 1px solid #ccc;padding-bottom:10px;">
                                <div style="padding:20px 0;" class='titleName'>
                                    <span>{{titleName[index]}}</span>
                                    <i @click="removeTheTitle(item,index)" class="el-icon-circle-close"></i>
                                </div>
                                <div class='inputText'>
                                    <div class='title'>智力值</div>
                                    <el-input style="width:200px;" @blur="blurEven(item.intellectNum)" v-model="item.intellectNum" placeholder="0-100整数"></el-input>
                                </div>
                                <div class='inputText'>
                                    <div class='title'>孚 星</div>
                                    <el-input style="width:200px;margin-top:10px;" @blur="blurEven(item.starNum)" v-model="item.starNum" placeholder="0-100整数"></el-input>
                                </div> 
                            </div>                                               
                        </div>
                        <div class="contentthree"  v-if="tabsType==3">
                            <div style="font-size:12px;color:#ccc;">设置小孚星和智力值，是对学完该模块的用户的奖励</div>
                            <div class='inputText'>
                                <div class='title'>智力值</div>
                                <el-input style="width:200px;" @blur="blurEven(periodModuleListThree[0].intellectNum)" v-model="periodModuleListThree[0].intellectNum" placeholder="0-100整数"></el-input>
                            </div>
                            <div class='inputText' style="border-bottom: 1px solid #ccc;padding-bottom:10px;">
                                <div class='title'>孚 星</div>
                                <el-input style="width:200px;margin-top:10px;" @blur="blurEven(periodModuleListThree[0].starNum)" v-model="periodModuleListThree[0].starNum" placeholder="0-100整数"></el-input>
                            </div>
                        </div>                      
                    </div>
                    <div class="imgSection">
                        <div>添加学习报告</div>
                        <div class="uploadBox">
                            <el-upload
                                class="avatar-uploader"
                                :action="actiosService"
                                :show-file-list="false"
                                :headers="myHeaders"
                                :before-upload="(file)=>{return beforeAvatarUpload(file,2)}"
                                :on-success="(file)=>{return handleAvatarSuccess(file,2)}"                            
                                >
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                            <div style="color:#ccc;margin-left:10px;margin-top:10px;">尺寸宽:345,高度不限;支持PNG,JPEG</div>
                        </div>
                        <div class="imgStyle1">
                            <img v-if='studyReport' :src="studyReport" @click="selectImgs(true)"/>
                            <i class="el-icon-delete-solid" @click="closeImgIcon()"></i>
                        </div>                        
                    </div>
                </div>
            </div>   
            <div style='text-align:center;margin-top:20px;'>
                <el-button @click="dialogVisibleEven(false)">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleEven(true)">确 定</el-button>
            </div>                
        </div>
        <el-dialog
            title="提示"
            :visible.sync="leaveDialogVisible"
            width="30%"
            >
            <span>您有未保存的信息，离开后会丢失，确认要离开吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="leaveDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="leavePage">确 定</el-button>
            </span>
        </el-dialog>  
        <div class="imgSectionBig" v-show="imgSectionBigType" @click="selectImgs(false)">
            <div>
                <img :src='studyReport'/>
            </div>
            
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
            titleName:[
                '题目一',
                '题目二',
                '题目三',
                '题目四',
                '题目五',
                '题目六',
                '题目七',
                '题目八',
                '题目九',
                '题目十'
            ],
            periodModuleListOne:[
                {
                    "type":1,// 小节类型:类型（1：听一听，2：测一测，3：演一演）
                    "sortNum":1,//序号
                    "starNum":'',// 孚星值
                    "intellectNum":'',// 智力值 
                    "id":''                   
                }                
            ],
            periodModuleListTwo:[
                {
                    "type":2,
                    "sortNum":1,
                    "starNum":'',
                    "intellectNum":'',
                    "id":''              
                }                
            ],
            periodModuleListThree:[
                {
                    "type":3,
                    "sortNum":1,
                    "starNum":'',
                    "intellectNum":'',
                    "id":''         
                }                
            ],
            periodModuleList:[],
            tabsType:1,
            id:'',
            periodName:'',
            backgroundImg:'',
            studyReport:'',
            periodModuleListTwoNum:1,
            isEdit:false,
            courseId:'', 
            h5Id:'',
            edits:'',
            copyObjs:{},
            leaveDialogVisible:false,
            leaveFlag:false,
            leavePath:'',
            imgSectionBigType:false,
            actionH5Id:'',
            periodModuleListDelete:[]
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
        this.id = this.$route.query.id;
        this.courseId = this.$route.query.courseId;
        this.h5Id = this.$route.query.h5Id;
        this.edits = this.$route.query.sectionId;
        this.actionH5Id = this.$route.query.actionH5Id||1;
        this.titleList=[
                {
                    name:'H5课程管理',
                    pathInfo:''
                },   
                {
                    name:'H5课程',
                    pathInfo:'/H5WebView/index'
                },
                {
                    name:'创建H5课程',
                    pathInfo:'/H5WebView/H5Creat/'+this.courseId
                },
                {
                    name:'H5课程详情页',
                    pathInfo:'/H5WebView/H5SectionNew/'+this.h5Id+'/'+this.courseId
                }
        ];

        if(this.edits){
            this.isEdit=true;
            this.titleList.push(
                {
                    name:'编辑小节',
                    pathInfo:''
                }                 
            );
            this.getSectuinDataEven(this.edits);
        }else{
            this.copyObjs = {
                periodName:'',// 小节名称
                backgroundImg:'',// 背景图
                studyReport:'',// 学习报告      
                periodModuleListOne:[{"type":1,"sortNum":1,"starNum":'',"intellectNum":''}],
                periodModuleListTwo:[{"type":2,"sortNum":1,"starNum":'',"intellectNum":''}],
                periodModuleListThree:[{"type":3,"sortNum":1,"starNum":'',"intellectNum":''}]                        
            };
            this.titleList.push(
                {
                    name:'新建小节',
                    pathInfo:''
                } 
            );
        }
    },
    beforeRouteLeave(to, from, next) {
        if(this.isEdit){
            this.copyObjs=JSON.parse(sessionStorage.getItem('copyObjs')); 
        }
        let copyNextObjs = {
            periodName:this.periodName,
            backgroundImg:this.backgroundImg,
            studyReport:this.studyReport,      
            periodModuleListOne:this.periodModuleListOne,
            periodModuleListTwo:this.periodModuleListTwo,
            periodModuleListThree:this.periodModuleListThree                        
        };         
        if(this.leaveFlag){
            setTimeout(()=>{
                if(this.isEdit){ 
                    sessionStorage.removeItem('copyObjs');
                }                   
                next();
            },100)
            return;
        }
        this.leavePath = to.fullPath;
        if (JSON.stringify(this.copyObjs) != JSON.stringify(copyNextObjs)) {
            this.leaveDialogVisible = true;
            next(false)
            return;
        } else {
            if(this.isEdit){ 
                sessionStorage.removeItem('copyObjs');
            }   
            next();
        }
    },     
    methods: {
            selectImgs(type){
                this.imgSectionBigType = type;
            },
            leavePage(){
                this.leaveFlag = true;
                this.leaveDialogVisible = false;
                this.$router.push(this.leavePath);
            },  
            blurEven(value){
                if(!/^\d+$/.test(Number(value))){
                    this.$message.error('内容有误,请输入范围0-100的数字');
                }else if(Number(value) < 0 || Number(value) >100){
                    this.$message.error('请输入范围0-100');
                }
            },
            //数据回填
            getSectuinDataEven(id){
                let nums=0;
                let dataList1 = [];
                let dataList2 = [];
                let dataList3 = [];
                this.$http.get(this.$server.h5Period+'/'+id).then(res=>{
                    if(res.status==200){
                        let data = res.content;
                        this.interactCourseId=data.interactCourseId;// 活动课程ID
                        this.periodName=data.periodName;// 小节名称
                        this.backgroundImg=data.backgroundImg;// 背景图
                        this.studyReport=data.studyReport;// 学习报告   
                        data.modules.forEach((item,index)=>{
                            if(item.type==1){
                                dataList1.push({
                                    "type":1,
                                    "sortNum":1,
                                    "starNum":item.starNum,
                                    "intellectNum":item.intellectNum,
                                    "id":item.id                              
                                });
                            }else if(item.type==2){
                                nums++;
                                dataList2.push({
                                    "type":2,
                                    "sortNum":nums,
                                    "starNum":item.starNum,
                                    "intellectNum":item.intellectNum,
                                    "id":item.id                                                  
                                });
                            }else{
                                dataList3.push({
                                    "type":3,
                                    "sortNum":1,
                                    "starNum":item.starNum,
                                    "intellectNum":item.intellectNum,
                                    "id":item.id                                                  
                                });
                            }
                        }); 
                        this.periodModuleListOne=dataList1;
                        this.periodModuleListTwo=dataList2;
                        this.periodModuleListThree=dataList3;
                        let dddd = {
                            periodName:data.periodName,// 小节名称
                            backgroundImg:data.backgroundImg,// 背景图
                            studyReport:data.studyReport,// 学习报告      
                            periodModuleListOne:dataList1,
                            periodModuleListTwo:dataList2,
                            periodModuleListThree:dataList3                        
                        };
                        this.periodModuleListTwoNum = dataList2.length||0;
                        sessionStorage.setItem('copyObjs', JSON.stringify(dddd));
                    }
                })                
            },
            //添加题目
            addTheTitle(){
                this.periodModuleListTwoNum = this.periodModuleListTwoNum+1;
                this.periodModuleListTwo.push({
                    "type":2,
                    "sortNum":this.periodModuleListTwoNum,
                    "starNum":'',
                    "intellectNum":''                   
                });
            },
            removeTheTitle(item,index){
                if(Number(item.id)>0){
                    this.periodModuleListDelete.push({
                        id:item.id,
                        deleteFlag:1
                    });
                    console.log('item2',item);
                }
                this.periodModuleListTwo.splice(index,1);
            },
            dialogVisibleEven(type){               
                if(type==1){
                    if(!this.backgroundImg.length>0){
                        this.$message.error('请上传小节图片')
                        return;
                    }
                    if(!this.studyReport.length>0){
                        this.$message.error('请上传学习报告')
                        return;
                    }
                    if(!this.periodName.length>0){
                        this.$message.error('填写小节名称')
                        return;
                    }
                    if(Number(this.periodModuleListOne[0].starNum) < 0 || Number(this.periodModuleListOne[0].starNum) >100||Number(this.periodModuleListOne[0].intellectNum) < 0 || Number(this.periodModuleListOne[0].intellectNum)>100){
                       this.$message.error('请完善听一听，范围0-100')
                       return;
                    } 
                    if(Number(this.periodModuleListThree[0].starNum) < 0 || Number(this.periodModuleListThree[0].starNum) >100||Number(this.periodModuleListThree[0].intellectNum) < 0 || Number(this.periodModuleListThree[0].intellectNum)>100){
                       this.$message.error('请完善演一演，范围0-100')
                       return;
                    } 
                    for (const iterator of this.periodModuleListTwo) {
                        if(Number(iterator.starNum) < 0 || Number(iterator.starNum) >100||Number(iterator.intellectNum) < 0 || Number(iterator.intellectNum)>100){
                            this.$message.error('请完善测一测，范围0-100')
                            return;                                
                        }
                    }
                   let query= {
                       interactCourseId:this.id,
                       periodName:this.periodName,
                       backgroundImg:this.backgroundImg,
                       studyReport:this.studyReport
                   };
                    let newList=this.periodModuleListOne.concat(this.periodModuleListThree);
                    this.periodModuleListTwo = this.periodModuleListTwo.map((x,i)=>{
                            /*
                            "type":2,
                            "sortNum":1,
                            "starNum":'',
                            "intellectNum":''   
                            */
                           x.sortNum=i+1;
                           return x;
                    });
                    this.periodModuleList = newList.concat(this.periodModuleListTwo);
                    this.periodModuleList = this.periodModuleList.concat(this.periodModuleListDelete);
                    query["periodModuleList"] = this.periodModuleList;
                    query["transformRequest"] = true;
                    let url='';
                    if(this.isEdit){
                        url=this.$server.h5Period+'/'+this.edits;
                    }else{
                        url=this.$server.h5Period;
                    }
                    let config = {
                        headers: {'Content-Type': 'application/json;charset=UTF-8'}
                    }                    
                    this.$http.post(url,query,config).then(res=>{
                        if(res.status==200){
                            this.$message.success("创建成功!");
                            this.leaveFlag = true;
                            this.$router.push(`/H5WebView/H5SectionNew/${this.h5Id}/${this.courseId}`); 
                        }
                    })                    
                }else{
                    this.$router.push(`/H5WebView/H5SectionNew/${this.h5Id}/${this.courseId}`); 
                }
            },
            tabsEven(type){
                switch (type) {
                    case 1:
                        this.tabsType=type;
                        break;
                    case 2:
                        this.tabsType=type;
                        break;
                    case 3:
                         this.tabsType=type;
                        break;
                
                    default:
                        break;
                }
            },
            //index
            handleAvatarSuccess(file,type) {
                /*
                    backgroundImg:'',
                    studyReport:'',
                */
               if(type==1){
                   this.backgroundImg =file.content.resourceUrl;
               }else{
                   this.studyReport =file.content.resourceUrl;
               }
            },
            //,index,type
            beforeAvatarUpload(file,type) {
                const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
                let isLt2M=0;
                if(type==1){
                    isLt2M = file.size / 1024 / 1024 < 1.001;
                    if (!isLt2M) {
                        this.$message.error('上传图片大小不能超过 1m!');
                    }                     
                }
                // const isLt2M = file.size / 1024 / 1024 < 0.201;
                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
                }
                // if (!isLt2M) {
                // this.$message.error('上传图片大小不能超过 200k!');
                // }    
                let isSize = 0;
                    isSize = new Promise(function(resolve, reject) {
                        if(type==1){
                            let width = 609;
                            let height = 399;
                            let _URL = window.URL || window.webkitURL;
                            let img = new Image();
                            img.onload = function() {
                                let valid = img.width == width && img.height==height;
                                valid ? resolve() : reject();
                            }
                            img.src = _URL.createObjectURL(file);
                        }else{
                            let widths = 345;
                            let _URL = window.URL || window.webkitURL;
                            let imgs = new Image();
                            imgs.onload = function() {
                                let valid = imgs.width == widths;
                                valid ? resolve() : reject();
                            }
                            imgs.src = _URL.createObjectURL(file);
                        }
                    }).then(() => {
                        return file;
                    }, () => {
                        // this.$message.error('上传的图片尺寸:'+(type==1||type==2)?750*212:1536*228)+'.'
                        this.$message.error(type==1?'上传的图片尺寸:609*399':'上传的图片尺寸宽:345px')
                        return Promise.reject();
                    });  
                       
                if(type==1){
                    return isJPG && isLt2M && isSize;
                }else{
                    return isJPG&& isSize;
                }
            }
    }
};
</script>

<style scoped lang="scss">
    .H5-creat-section {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .imgSectionBig{
            position:fixed;
            display: flex;
            flex-direction:column-reverse ;
            bottom:0;
            left: 0;
            right: 0;
            top: 0;
            background:rgba($color: #000000, $alpha: .3);
            justify-content:center;
            align-items: center;
            overflow-y: auto;
            div{
                width:50%;
                overflow: auto;
                height:100%;
                img{
                    display: block;
                    width:100%;
                    cursor: pointer;
                }
            }
        }
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            padding: 20px;
            .tab-one-box{
                padding:20px 0;
                .uploadBox{
                    margin-top: 10px;
                }
                .imgStyle1{
                    position: relative;
                    width: 200px;
                    height: 112px;
                    background: #f4f4f4;
                    margin: 20px 0px;
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
            .tab-two-box{
                .section-model-box{
                    padding:20px 0;
                    .tablist{
                        // padding:10px 0;
                        margin: 10px 0;
                        border-bottom: 1px solid #ccc;
                    }
                    .tabContent{
                        .titleName{
                            i{
                                font-size:14px;
                                color:#000;
                                cursor: pointer;
                            }
                        }
                        .inputText{
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-start;
                            align-items: center;
                            margin-top: 10px;
                            .title{
                                width: 60px;
                                text-align: left;
                            }
                        }                        
                    }
                    .imgSection{
                        padding:20px 0;
                        cursor: pointer;
                        .uploadBox{
                            padding:20px 0;
                        }
                        .imgStyle1{
                            position: relative;
                            width: 200px;
                            height: 112px;
                            background: #f4f4f4;
                            margin: 20px 0px;
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

        }        
    }
</style>

