<template>
    <div class="H5-creat-allsection">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>    
        </div>
        <div class="page-content">
            <div>
                总结名称<el-input style='width:200px;margin-left:5px;' maxlength='20' v-model="periodName"></el-input>
                <span>{{periodName.length||0}}/20</span>
            </div>
            <div class="tab-one-box">     
                <div>
                    总结图片
                </div>              
                <div class="uploadBox">
                    <el-upload
                        class="avatar-uploader"
                        :action="actiosService"
                        :show-file-list="false"
                        :headers="myHeaders"
                        :before-upload="(file)=>{return beforeAvatarUpload(file)}"
                        :on-success="(file)=>{return handleAvatarSuccess(file)}"                            
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
                <div class="title">添加题数</div>
                <div class="section-model-box">
                    <div class="tabContent">
                        <div class="contentTwo">
                            <div style="padding:20px 0;color:#ccc;font-size:12px;">注：课程上线后总结题目数的增加和删除将影响用户，更改后请记得前端发版更新</div>
                            <el-button size="medium" type="primary" :disabled="periodModuleList.length>=10?true:false" @click='addTheTitle'>添加题数</el-button>
                            <div v-for="(item,index) in periodModuleList" :key="index">
                                <div style="padding:20px 0;" class='titleName'>
                                    <span>{{titleName[index]}}</span>
                                    <i @click="removeTheTitle(item,index)" class="el-icon-circle-close"></i>
                                </div>
                                <div class='inputText'>
                                    <div class='title'>智力值</div>
                                    <el-input style="width:200px;" v-model="item.intellectNum" placeholder="0-100整数"></el-input>
                                </div>
                                <div class='inputText'>
                                    <div class='title'>孚 星</div>
                                    <el-input style="width:200px;margin-top:10px;" v-model="item.starNum" placeholder="0-100整数"></el-input>
                                </div> 
                            </div>                                               
                        </div>                     
                    </div>
                    <div class="imgSection">
                        <div>关联小节</div>
                        <el-select style='margin-top:10px;' :disabled="isEdit?true:false" v-model="value" placeholder="选择关联小节">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>                      
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
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            myHeaders: {token: getToken()},
            titleList:[ ], 
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
            periodModuleList:[
                {
                    "type":2,
                    "sortNum":1,
                    "starNum":'',
                    "intellectNum":''               
                }                
            ],
            id:'',
            periodName:'',
            backgroundImg:'',
            studyReport:'',
            periodModuleListNum:1,
            options: [],
            value: '',
            courseId:'',
            isEdit:false,
            h5Id:'',
            copyObjs:{},
            leaveDialogVisible:false,
            leaveFlag:false,
            leavePath:'',
            sectionId:'',
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
                 
        ]          
        this.sectionList();
        setTimeout(()=>{
            this.sectionId = this.$route.query.sectionId;
            if(this.sectionId){
                this.titleList.push(
                {
                    name:'编辑总结',
                    pathInfo:''
                }                     
                );
                this.isEdit=true;
                this.getSectuinDataEven(this.sectionId);
            }else{
                this.copyObjs = {
                    periodName:'',// 小节名称
                    backgroundImg:'',// 背景图
                    value:'',// 学习报告      
                    periodModuleList:[{"type":2,"sortNum":1,"starNum":'',"intellectNum":''  }],                        
                };
                this.titleList.push(
                    {
                        name:'新建总结',
                        pathInfo:''
                    }                     
                );
            }
        },0);

    },    
    beforeRouteLeave(to, from, next) {
        if(this.isEdit){
            this.copyObjs=JSON.parse(sessionStorage.getItem('copyObjs')); 
        }
        let copyNextObjs = {
            periodName:this.periodName,
            backgroundImg:this.backgroundImg,
            value:this.value,    
            periodModuleList:this.periodModuleList                      
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
            leavePage(){
                this.leaveFlag = true;
                this.leaveDialogVisible = false;
                this.$router.push(this.leavePath);
            }, 
            sectionList(){
                let query = {
                    params:{
                        title:"",
                        courseId:this.h5Id
                    }
                }           
                this.$http.get(this.$server.h5PeriodList,query).then(res=>{
                    if(res.status==200){
                        var contentdate = res.content;
                        contentdate.forEach((item,index)=>{
                            this.options.push({
                                value:item.id,
                                // label:item.periodName
                                label:item.sortNum
                            });
                        })
                    }
                })            
            },        
            //添加题目
            addTheTitle(){
                this.periodModuleListNum = this.periodModuleListNum+1;
                this.periodModuleList.push({
                    "type":2,
                    "sortNum":this.periodModuleListNum,
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
                }               
                this.periodModuleList.splice(index,1);
            },            
            //数据回填
            getSectuinDataEven(id){
                let nums=0;
                let lists =[];
                this.$http.get(this.$server.h5Summary+'/'+id).then(res=>{
                    if(res.status==200){
                        let data = res.content;
                        this.interactCourseId=data.interactCourseId;// 活动课程ID
                        this.periodName=data.summaryName;// 小节名称
                        this.backgroundImg=data.backgroundImg;// 背景图
                        this.value=data.relationPeriodId;// 关联小节ID   
                        data.subjects.forEach((item,index)=>{
                            nums++;
                            lists.push({
                                "sortNum":nums,
                                "starNum":item.starNum,
                                "intellectNum":item.intellectNum,
                                "id":item.id                                   
                            });
                        });  
                        this.periodModuleList=lists; 
                        let dddd = Object.assign({},{
                            periodName:data.summaryName,// 小节名称
                            backgroundImg:data.backgroundImg,// 背景图
                            value:data.relationPeriodId,// 学习报告      
                            periodModuleList:lists                      
                        }); 
                        sessionStorage.setItem('copyObjs', JSON.stringify(dddd));                 
                    }
                })                
            },
            dialogVisibleEven(type){
                if(type==1){
                    /*
                        {
                            "interactCourseId":1,// 活动课程ID
                            "summaryName":"123456",// 总结名称
                            "backgroundImg":"",// 背景图地址
                            "relationPeriodId":1,// 关联小节ID
                            "summarySubjectForms":[
                                {"sortNum":1,// 排序
                                "starNum":1,// 孚星值
                                "intellectNum":1// 智力值
                                },
                                {}
                            ]
                        }                    
                    */

                   if(!this.backgroundImg.length>0){
                       this.$message.error('请上传总结图片')
                       return;
                   }
                   if(!Number(this.value)>0){
                       this.$message.error('请选择关联小节')
                       return;
                   }
                   if(!this.periodName.length>0){
                       this.$message.error('填写总结名称')
                       return;
                   }
                   if(!this.periodModuleList.length){
                        this.$message.error('请添加题数')
                        return; 
                   }else{
                        for (const iterator of this.periodModuleList) {   
                            // if(!iterator.starNum||!iterator.intellectNum){
                                if(iterator.rewardNum==''||Number(iterator.rewardNum) < 0 || Number(iterator.rewardNum) >100||iterator.intellectNum==''||Number(iterator.intellectNum) < 0 || Number(iterator.intellectNum)>100){
                                this.$message.error('请完善题数,范围0-100')
                                return;                                
                            }
                        }
                   }
                   
                   let query= {
                       interactCourseId:this.id,
                       summaryName:this.periodName,
                       backgroundImg:this.backgroundImg,
                       relationPeriodId:this.value
                   };
                   let numlist = this.periodModuleList.map((x,i)=>{
                       x.sortNum = i+1;
                       return x;
                   });
                   this.periodModuleList =numlist.concat(this.periodModuleListDelete)
                    // this.periodModuleList.forEach((item,index)=>{
                    //     // query['summarySubjectForms['+index+'].sortNum'] = item.sortNum; 
                    //     query['summarySubjectForms['+index+'].sortNum'] = index+1; 
                    //     query['summarySubjectForms['+index+'].starNum'] = item.starNum;  
                    //     query['summarySubjectForms['+index+'].intellectNum'] = item.intellectNum;  
                    // })
                    query["summarySubjectForms"] = this.periodModuleList;
                    query["transformRequest"] = true;            
                    let config = {
                        headers: {'Content-Type': 'application/json;charset=UTF-8'}
                    }         
                    let url='';
                    if(this.isEdit){
                        url=this.$server.h5Summary+'/'+this.sectionId;
                    }else{
                        url=this.$server.h5Summary;
                    }                    
                    this.$http.post(url,query,config).then(res=>{
                        if(res.status==200){
                            this.$message.success("创建成功!");
                            // this.$router.push({
                            //     path:'/H5WebView/H5Section',
                            //     query:{
                            //         id:this.id
                            //     }
                            // }) 
                            // this.id = this.$route.query.id;
                            // this.courseId = this.$route.query.courseId;
                            this.leaveFlag = true;
                            this.$router.push(`/H5WebView/H5SectionNew/${this.h5Id}/${this.courseId}`) 
                        }
                    })                    
                }else{
                     this.$router.push(`/H5WebView/H5SectionNew/${this.h5Id}/${this.courseId}`) 
                }
            },
            //index
            handleAvatarSuccess(file) {
                /*
                    backgroundImg:'',
                    studyReport:'',
                */
                   this.backgroundImg =file.content.resourceUrl;
               
            },
            //,index,type
            beforeAvatarUpload(file) {
                const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
                let isLt2M=0;
                // if(type==3||type==4){
                    isLt2M = file.size / 1024 / 1024 < 2.001;
                    if (!isLt2M) {
                        this.$message.error('上传图片大小不能超过 2m!');
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
                                let width = 609;
                                let height = 399;
                                let _URL = window.URL || window.webkitURL;
                                let img = new Image();
                                img.onload = function() {
                                    let valid = img.width == width && img.height==height;
                                    valid ? resolve() : reject();
                                }
                                img.src = _URL.createObjectURL(file);
                            }).then(() => {
                                return file;
                            }, () => {
                                // this.$message.error('上传的图片尺寸:'+(type==1||type==2)?750*212:1536*228)+'.'
                                this.$message.error('上传的图片尺寸:609*399')
                                return Promise.reject();
                    });
                // if(type==3||type==4){
                    return isJPG && isLt2M && isSize;
                // }else{
                    // return isJPG && isSize;
                // }
            }
    },
    mounted(){
       
    }
};
</script>

<style scoped lang="scss">
    .H5-creat-allsection {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
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
                    width: 100px;
                    height: 100px;
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
                .title{
                    font-size: 18px;
                }
                .section-model-box{
                    padding:20px 0;
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
                                font-size:14px;
                            }
                        }                        
                    }
                    .imgSection{
                        padding:20px 0;                       
                    }
                }

            }

        }        
    }
</style>

