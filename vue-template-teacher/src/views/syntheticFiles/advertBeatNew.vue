<template>

    <!-- <div>
        <div class="lPadding20">
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>
        <el-form 
                label-width="100px" 
                label-position="right"
                class="module-details"
                v-loading="loadingAdvie"
                >
                <h3 class="module-title">基础部分</h3>
                <section class="form-module fontCss14">
                    <el-form-item label="标题">
                        <el-row>
                            <el-col :span="8">
                                <el-input v-model.trim="title"
                                        placeholder="输入标题"
                                        class="search-form"
                                        width="100%"
                                        maxlength="20"
                                        clearable
                                        ref="advertTitie"
                                        ></el-input>
                            </el-col>  
                            <el-col :span="2" class="lCenter-r">
                                {{title.length||0}}/20                             
                            </el-col>                                                      
                        </el-row>
                    </el-form-item>                       
                    <el-form-item label="上线时间">
                        <el-row>
                            <el-col >  
                                <el-date-picker
                                v-model="dataStart"
                                type="datetime"
                                style="width:200px;"
                                placeholder="年/月/日/时/分/秒">
                                </el-date-picker>                                                                                          
                            </el-col>                            
                        </el-row>
                    </el-form-item>  
                    <el-form-item label="下线时间">
                        <el-row>
                            <el-col>  
                                <el-date-picker
                                v-model="endStart"
                                type="datetime"
                                style="width:200px;"
                                placeholder="年/月/日/时/分/秒">
                                </el-date-picker>                                                                                          
                            </el-col>                            
                        </el-row>
                    </el-form-item> 
                    <el-form-item label="">
                        <el-button style="background: #B4272D;color:#fff;" @click="addadverBeatModel">添加</el-button>
                    </el-form-item>                     
                    <div class="modelListBox" @mousewheel="wheel" id='picBox-inner'>
                        <div class="modelListStyle" v-for="(parentItem,indexAdMdLi) in advertisementModelList" :key="indexAdMdLi" >      
                            <div class="fileDivStyle">     
                                <div style="text-align: right; padding:0 0 10px 0;">
                                    <i class="el-icon-delete" style="cursor: pointer;" @click="removeAdvertModel(parentItem,indexAdMdLi)"></i>
                                </div> 
                                <el-form-item label="活动名称">
                                    <el-input v-model="parentItem.title"></el-input>
                                </el-form-item>                                         
                                <el-form-item label="类型">
                                    <div style="color:#606266">图片</div>
                                    <el-row>
                                        <el-col :span="4"><el-radio v-model="parentItem.radio" label="1">链接</el-radio></el-col>
                                        <el-col :span="4"><el-radio v-model="parentItem.radio" label="2">课程</el-radio></el-col>
                                        <el-col :span="4"><el-radio v-model="parentItem.radio" label="3">活动</el-radio></el-col>
                                        <el-col :span="4"><el-radio v-model="parentItem.radio" label="4">无链接</el-radio></el-col>
                                    </el-row>
                                    <el-row class="lMarginTop20">
                                        <el-col v-if="parentItem.radio==1" :span="8"><el-input @blur="checkeven(indexAdMdLi)" :ref="'inputs'+indexAdMdLi" v-model="parentItem.input" placeholder="http://" clearable></el-input></el-col>
                                        <el-col v-else-if="parentItem.radio==2" :span="10">    
                                            <div class="selectCourseBut" @click="selectCourse(indexAdMdLi)">选择课程</div> 
                                            <div class="courseList" v-if="parentItem.selectData.length>0">
                                                <div class="courseListCount" v-for="(item,index) in parentItem.selectData" :key="index">
                                                    <p>{{item.title}}</p>
                                                    <i class="el-icon-circle-close" @click="removeSelectCourse(index,indexAdMdLi)"></i>
                                                </div>
                                            </div>                                                          
                                        </el-col> 
                                        <el-col v-else-if="parentItem.radio==3" :span="8"><el-input v-model="parentItem.input" :ref="'inputs'+indexAdMdLi" placeholder="请输入活动ID"></el-input></el-col>
                                    </el-row> 
                                </el-form-item>                                                                            
                                <el-form-item label="上传">
                                    <div class="advertCss" v-for="(item,index) in parentItem.fileList" :key="index">
                                        <el-row>
                                            <el-col class="fontCss13">图片大小不能大于2M，格式支持  jpg、jpeg、png</el-col>
                                            <el-col>
                                                <el-row>
                                                    <el-col :span="6">
                                                        <el-upload
                                                            class="upload-demo"
                                                            :action="actiosService"
                                                            :headers="myHeaders"
                                                            :before-upload="(file)=>{return beforeUpload(file,index,item.size,indexAdMdLi)}"
                                                            :on-success="(file)=>{return uploadFileSuccess(file,index,item.size,indexAdMdLi)}"
                                                            :on-error="(file)=>{return uploadFileError(file,index,item.size,indexAdMdLi)}"
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
                                                    <i class="el-icon-circle-close" @click="removeimgs(index,indexAdMdLi)" v-show="item.imgs!=''"></i>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>       
                                </el-form-item>
                            </div>
                        </div>                            
                    </div>    
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
        <el-dialog class="dialogCourse" :visible.sync="courseselectPluginDialog" 
                    width="30%"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :show-close="false"> 
                    <div class="courseFlexBox">
                        <el-container>
                            <el-main>
                                <div style="margin-bottom:20px;">
                                    <el-radio-group 
                                        v-model="checkedCities" @change="changePlugin">
                                        <el-radio v-for="(city,index) in cities" :label="city.value" :key="index">{{city.name}}</el-radio>
                                    </el-radio-group>                  
                                </div>                                  
                                <el-row class="lMarginTB10">
                                    <el-col class="courseAccStyle" :span="20">     
                                        <el-input
                                        placeholder="输入课程名称查询"
                                        suffix-icon="el-icon-search"
                                        style="width:100%"
                                        v-model="input2">
                                        </el-input>
                                        <el-button style="background-color:#9e0e00;color:#fff;margin-left:10px;" @click.native="saveSeach">搜索</el-button>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <div class="tableDataBox">
                                        <div class="tableData-list" v-for="(item,index) in tableData"  :key='index'>
                                            <el-radio v-model="radioModel" :label="item.id">{{item.title}}</el-radio>
                                            <div class="nameTextEllipsis" style='font-size:14px;'>{{item.sellingPrice||0}}币</div>
                                        </div>
                                    </div>
                                </el-row>
                            </el-main>
                            <el-footer>
                                <el-row>
                                    <el-col style="text-align:center;margin-top:20px">
                                        <el-button style="background-color:#fff;color:#ccc" @click.native="closeCourseList">取消</el-button>
                                        <el-button style="background-color:#9e0e00;color:#fff" @click="isOkSelect">确定</el-button>
                                    </el-col>                    
                                </el-row>
                            </el-footer>
                        </el-container>
                    </div>
        </el-dialog>              
    </div> -->
    <div>
        <div class="lPadding20">
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>
        <el-form 
                label-width="100px" 
                label-position="right"
                class="module-details"
                >
                <h3 class="module-title">基础部分</h3>
                <section class="form-module fontCss14">
                    <el-form-item label="标题">
                        <el-row>
                            <el-col :span="8">
                                <el-input v-model.trim="title"
                                        placeholder="输入标题"
                                        class="search-form"
                                        width="100%"
                                        maxlength="20"
                                        clearable
                                        ref="advertTitie"
                                        ></el-input>
                            </el-col>  
                            <el-col :span="2" class="lCenter-r">
                                {{title.length||0}}/20                             
                            </el-col>                                                      
                        </el-row>
                    </el-form-item>                    
                    <el-form-item label="类型">
                        <el-row>
                            <el-col :span="5">
                                图片                             
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="">
                        <el-row>
                            <el-col :span="2"><el-radio v-model="radio" label="1">链接</el-radio></el-col>
                            <el-col :span="2"><el-radio v-model="radio" label="2">课程</el-radio></el-col>
                            <el-col :span="2"><el-radio v-model="radio" label="3">活动</el-radio></el-col>
                            <el-col :span="2"><el-radio v-model="radio" label="4">无链接</el-radio></el-col>
                        </el-row>
                        <el-row class="lMarginTop20">
                            <el-col v-if="radio==1" :span="8"><el-input @blur="checkeven" ref="inputs" v-model="input" placeholder="http://" clearable></el-input></el-col>
                            <el-col v-else-if="radio==2" :span="5">    
                                <div class="selectCourseBut" @click="selectCourse">选择课程</div> 
                                <div class="courseList" v-if="selectData.length>0">
                                    <div class="courseListCount" v-for="(item,index) in selectData" :key="index">
                                        <p>{{item.title}}</p>
                                        <i class="el-icon-circle-close" @click="removeSelectCourse(index)"></i>
                                    </div>
                                </div>                                                          
                            </el-col> 
                            <el-col v-else-if="radio==3" :span="8"><el-input v-model="input" ref="inputs" placeholder="请输入活动ID"></el-input></el-col>
                        </el-row> 
                    </el-form-item>   
                    <el-form-item label="上线时间">
                        <el-row>
                            <el-col >  
                                <el-date-picker
                                v-model="dataStart"
                                type="datetime"
                                style="width:200px;"
                                placeholder="年/月/日/时/分/秒">
                                </el-date-picker>                                                                                          
                            </el-col>                            
                        </el-row>
                    </el-form-item>  
                    <el-form-item label="下线时间">
                        <el-row>
                            <el-col>  
                                <el-date-picker
                                v-model="endStart"
                                type="datetime"
                                style="width:200px;"
                                placeholder="年/月/日/时/分/秒">
                                </el-date-picker>                                                                                          
                            </el-col>                            
                        </el-row>
                    </el-form-item>                                                          
                    <el-form-item label="上传">
                        <div class="advertCss" v-for="(item,index) in fileList" :key="index">
                            <el-row>
                                <el-col class="fontCss13">图片大小不能大于2M，格式支持  jpg、jpeg、png</el-col>
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
        <el-dialog class="dialogCourse" :visible.sync="courseselectPluginDialog" 
                    width="30%"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :show-close="false"> 
                    <div class="courseFlexBox">
                        <el-container>
                            <el-main>
                                <div style="margin-bottom:20px;">
                                    <el-radio-group 
                                        v-model="checkedCities" @change="changePlugin">
                                        <el-radio v-for="(city,index) in cities" :label="city.value" :key="index">{{city.name}}</el-radio>
                                    </el-radio-group>                  
                                </div>                                  
                                <el-row class="lMarginTB10">
                                    <el-col class="courseAccStyle" :span="20">     
                                        <el-input
                                        placeholder="输入课程名称查询"
                                        suffix-icon="el-icon-search"
                                        style="width:100%"
                                        v-model="input2">
                                        </el-input>
                                        <el-button style="background-color:#9e0e00;color:#fff;margin-left:10px;" @click.native="saveSeach">搜索</el-button>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <div class="tableDataBox">
                                        <div class="tableData-list" v-for="(item,index) in tableData"  :key='index'>
                                            <el-radio v-model="radioModel" :label="item.id">{{item.title}}</el-radio>
                                            <div class="nameTextEllipsis" style='font-size:14px;'>{{item.sellingPrice||0}}币</div>
                                        </div>
                                    </div>
                                </el-row>
                            </el-main>
                            <el-footer>
                                <el-row>
                                    <el-col style="text-align:center;margin-top:20px">
                                        <el-button style="background-color:#fff;color:#ccc" @click.native="closeCourseList">取消</el-button>
                                        <el-button style="background-color:#9e0e00;color:#fff" @click="isOkSelect">确定</el-button>
                                    </el-col>                    
                                </el-row>
                            </el-footer>
                        </el-container>
                    </div>
        </el-dialog>              
    </div>    
</template>
<script>
/*
import Breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
import eventAction from '../lEventAtion';
import Dialog from "@/components/myDialog/myDialog";
let actions = new eventAction();
const cityOptions = ['链接', '课程', '活动', '无链接'];
export default {
    components:{
        Breadcrumb,
        Dialog,
        // courseselect
    },    
    data(){
        return {          
            myHeaders: {token: getToken()},
            value: 1,
            title:'',
            urls:'/flashAdvertising/getCourseList',
            exCourseIds:[],
            selectData:[],
            dataStart:'',
            endStart:'',
            imgs:'',
            input:'',
            videoUrl:'',
            radio:'4',
            radioModel:'',
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
            loadingAdvie:true,
            dataUpdateBool:[],
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
            handle:false,
            courseselectPluginDialog:false,
            createdOrresove:true,
            advertId:'',
            input2:'',
            tableData:[],
            titleList:[
                {
                    name:'闪屏管理',
                    pathInfo:'/advertBeatList'
                },                
                {
                    name:'闪屏设置',
                    pathInfo:''
                }                               
            ],
            checkedCities:1,
            cities: [
                {
                    name:'自营课程',
                    value:1
                },
                {
                    name:'三方课程',
                    value:2
                }
            ],
            adverTBeatIndex:0,
            advertisementModelList:[],
            disabledState:false,
            deleteIdArry:[] 

    }},
    created(){
        if(this.$route.query.id){
            this.createdOrresove = false;
            this.advertId=this.$route.query.id;
            this.returnDetailCourseFirst();
        }else{
            this.returnDetailCourseThree();
        }
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
            var newFormData = JSON.stringify(this.advertisementModelList);
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
        //添加闪屏广告模块
        addadverBeatModel(){
            if(this.advertisementModelList.length<11&&this.advertisementModelList.length!=10){
                console.log("2");
                this.advertisementModelList.push({
                        title:'',//活动名称
                        adType:1,//广告类型 1 图片 2 mov
                        targetId:'',//广告目标id
                        selectData:[],//广告目标类型为2时的课程数组
                        radio:'4',//广告目标类型 1:链接,2:课程,3:活动，4:无链接
                        input:'',//广告目标类型为1,3,4时的值
                        exCourseIds:'',//选择课程的id
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
                        ]                
                });
            }else{
                this.$message.error('最多添加10个列表');
            }
        },
        //删除课程
        removeSelectCourse(indexs,keyIndex){
                let objs = this.advertisementModelList[keyIndex];
                var remDate =objs.selectData.splice(indexs, 1);
                objs.exCourseIds='';            
        },
        //选择课程
        saveSeach(){
            // this.returnDetailCourse('');
            this.returnDetailCourseThree();
        },
        closeCourseList(){
            this.courseselectPluginDialog = false;
        },
        isOkSelect(){
            var self = this;
            let objs = self.advertisementModelList[self.adverTBeatIndex];
            if(!self.radioModel){
                self.$message.error('请选择课程');
                return;
            }else{
                objs.selectData =[];
                self.tableData.forEach((element,index)=>{
                    if(element.id==self.radioModel){
                        objs.selectData.push({
                            "id":element.id,
                            "title":element.title
                        });
                        objs.exCourseIds = element.id
                    }
                    this.courseselectPluginDialog = false;
                });                
            }
        },
        //选择类型事件
        changePlugin(data){
            this.tableData = []            
            this.returnDetailCourseThree();
        },          
        //选择课程
        selectCourse(keyIndex){
            this.adverTBeatIndex = keyIndex;
            this.courseselectPluginDialog = true;
            this.radioModel = Number(this.advertisementModelList[keyIndex].exCourseIds);
        },         
        couponEditObjOk(){
                var self = this;
                self.dataUpdateBool = JSON.stringify([]);
                self.advertisementModelList = [];
                self.newFormVideoUrl = JSON.stringify('');
                self.videoUrl = '';  
                self.dataChange = false;          
                self.$router.push({path:self.toPath.path});           
            },
        couponEditObjNo(){
                this.editsObj.showFlag = false;
        },   
        beforeUpload(file,index ,size ,keyIndex){
            let fileVal = this.advertisementModelList[keyIndex].fileList;
            fileVal[index].loading= true;
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                fileVal[index].loading= false;
                this.$message.error('上传图片只能是 PNG,JPEG,JPG 等格式!');
            }
            if (!isLt2M) {
                fileVal[index].loading= false;
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
                fileVal[index].loading= false;
                this.$message.error('上传的图片必须是等于'+size[0]+'*'+size[1]+'!');
                return Promise.reject();
            });
            return isJPG && isLt2M && isSize;
        },
        //上传成功
        uploadFileSuccess(file, index ,size ,keyIndex){
            var self = this;
            let fileVal = self.advertisementModelList[keyIndex].fileList;
            fileVal[index].imgs = file.content.resourceUrl;
            self.$nextTick(function(){
                fileVal[index].loading= false;
            })       
        },
        uploadFileError(file, index ,size ,keyIndex){
                let fileVal = this.advertisementModelList[keyIndex].fileList;
                fileVal[index].loading= false;
                this.$message.error('上传图片大小不能超过 2MB!');       
        }, 
        //链接失去焦点验证
        checkeven(keyIndex){
            if(this.advertisementModelList[keyIndex].radio=="1"){
                let checktest = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                if( !checktest.test(this.advertisementModelList[keyIndex].input)){
                    this.advertisementModelList[keyIndex].input = "";
                }
            }
        },
        currentSel(id){
            var self = this;
            var url = '/flashAdvertising/findFlashById';
            actions.getData(url,{id:id})
                .then(data => {      
                    if(data){
                        data.flashAdvertisingPicRecordList.forEach((element,index)=>{
                            if(element.targetType==2){
                                // self.radioModel = Number(element.targetId);
                                self.advertisementModelList.push({
                                        title:element.title,//活动名称
                                        targetId:element.targetId,//广告目标id
                                        selectData:[],//广告目标类型为2时的课程数组
                                        radio: element.targetType+'',//广告目标类型 1:链接,2:课程,3:活动，4:无链接
                                        input:'',//广告目标类型为1,3,4时的值
                                        exCourseIds:Number(element.targetId),//选择课程的id
                                        id:element.id,
                                        fileList:[
                                            {sizeTltle:"Android320*480",size:[320,480],imgs:element.hdpi,loading:false},
                                            {sizeTltle:"Android480*800",size:[480,800],imgs:element.mdpi,loading:false},
                                            {sizeTltle:"Android720*1280",size:[720,1280],imgs:element.xhdpi,loading:false},
                                            {sizeTltle:"Android1080*1920",size:[1080,1920],imgs:element.xxhdpi,loading:false},
                                            {sizeTltle:"Android2159*3840",size:[2159,3840],imgs:element.xxxhdpi,loading:false},
                                            {sizeTltle:"Android1440*3120",size:[1440,3120],imgs:element.xxxxhdpi,loading:false},
                                            {sizeTltle:"IOS750*1334",size:[750,1334],imgs:element.iphonePicUrl,loading:false},
                                            {sizeTltle:"IOS1125*2436",size:[1125,2436],imgs:element.iphonexPicUrl,loading:false},
                                            {sizeTltle:"IOS1536*2048",size:[1536,2048],imgs:element.ipadPicUrl,loading:false}
                                        ]
                                });            
                                this.returnDetailCourseTwo(Number(element.targetId),index);  
                            }else{
                                self.advertisementModelList.push({
                                        title:element.title,//活动名称
                                        targetId:element.targetId,//广告目标id
                                        selectData:[],//广告目标类型为2时的课程数组
                                        radio:element.targetType+'',//广告目标类型 1:链接,2:课程,3:活动，4:无链接
                                        input:element.targetId,//广告目标类型为1,3,4时的值
                                        exCourseIds:'',//选择课程的id
                                        id:element.id,
                                        fileList:[
                                            {sizeTltle:"Android320*480",size:[320,480],imgs:element.hdpi,loading:false},
                                            {sizeTltle:"Android480*800",size:[480,800],imgs:element.mdpi,loading:false},
                                            {sizeTltle:"Android720*1280",size:[720,1280],imgs:element.xhdpi,loading:false},
                                            {sizeTltle:"Android1080*1920",size:[1080,1920],imgs:element.xxhdpi,loading:false},
                                            {sizeTltle:"Android2159*3840",size:[2159,3840],imgs:element.xxxhdpi,loading:false},
                                            {sizeTltle:"Android1440*3120",size:[1440,3120],imgs:element.xxxxhdpi,loading:false},
                                            {sizeTltle:"IOS750*1334",size:[750,1334],imgs:element.iphonePicUrl,loading:false},
                                            {sizeTltle:"IOS1125*2436",size:[1125,2436],imgs:element.iphonexPicUrl,loading:false},
                                            {sizeTltle:"IOS1536*2048",size:[1536,2048],imgs:element.ipadPicUrl,loading:false}
                                        ]
                                });
                            }
                        });
                        self.dataStart = data.onlineTime;
                        self.endStart = data.offlineTime;
                        self.title=data.title;
                        self.loadingAdvie = false;
                    }             
                })
                .fail(function(){
                }
            );
        },
        //左右滚动
        wheel(e){
            var a = document.getElementById("picBox-inner");
            var scroll_width = 100; //滚动一下的距离
            var e = e || window.event, v;
            e.wheelDelta ? v=e.wheelDelta : v=e.detail;
            if(v>3||-v>3) v=-v;
            v>0 ? a.scrollLeft+=scroll_width : a.scrollLeft-=scroll_width;
            
            e.preventDefault(); //阻止浏览器的默认滚动
        },        
        returnDetailCourseFirst(){
            var self = this;
            let query = {
                params:{
                    title:'',
                    courseSource:self.checkedCities
                }
            }            
            this.$http.get(this.$server.getCourseListNewAdvied,query).then(res=>{
                if(res.status==200){ 
                    this.tableData = res.content;
                    this.currentSel(self.$route.query.id);
                    this.loadingAdvie = false;
                }
            });            
        }, 
        returnDetailCourseThree(){
            var self = this;
            let query = {
                params:{
                    title:self.input2,
                    courseSource:self.checkedCities
                }
            }            
            this.$http.get(this.$server.getCourseListNewAdvied,query).then(res=>{
                if(res.status==200){ 
                    this.loadingAdvie = false;
                    this.tableData = res.content;
                }
            });            
        },               
        returnDetailCourseTwo(exCourseIds,keyIndex){
            var self = this;
            if(keyIndex===0||keyIndex>0){
                self.adverTBeatIndex = keyIndex;
            }          
            if(exCourseIds){
                self.tableData.forEach((el,i)=>{
                    if(el.id==exCourseIds){
                        self.advertisementModelList[self.adverTBeatIndex].selectData.push(el);
                    }
                });
            }          
        },         
        formatDate(date){
            if(date){
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                var h=date.getHours();
                var m1=date.getMinutes();
                var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;
                    h = h<10?("0"+h):h;
                    m1 = m1<10?("0"+m1):m1;
                    s = s < 10 ? ("0" + s) : s;
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
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
            var url ='';
            var subType = true;
            let subDataArrys = self.advertisementModelList;
            if(self.createdOrresove){
                url = '/flashAdvertising/saveFlashAdvertising';
            }else{
                url = '/flashAdvertising/updateFlashAdvertising';
            }
            if(!self.title){
                self.$message.error('请填写标题');
                this.$refs.advertTitie.focus();
                return
            }
            if(!subDataArrys.length){
                self.$message.error('请添加闪屏图');
                return               
            }
            if(!self.dataStart||!self.endStart){
                self.$message.error('请选择上下线时间');
                return;
            }  
            if(Number(self.dataStart)>Number(self.endStart)){
                self.$message.error('开始时间必须小于结束时间');
                return;
            }        
            subDataArrys.forEach((element,elIndex)=>{
                    if(!element.exCourseIds&&element.radio==2){
                        subType = false;
                        self.$message.error('请选择课程');
                        return;
                    }
                    if(Number(element.radio)==1&&Number(element.radio)==3&&!element.input){
                        switch (Number(element.radio)) {
                            case 1:
                                self.$message.error('请填写链接');
                                break;
                            case 3:
                                self.$message.error('请填写活动id');
                                break;                            
                            default:
                                break;
                            }
                            subType = false;
                            this.$refs['inputs'+elIndex].focus();
                            return;
                    }                    
            });  
            let parmiseImgObj = {
                    title:self.title,
                    adType:1,//广告类型 1 图片 2 mov	
                    onlineTime:self.formatDate(self.dataStart),
                    offlineTime:self.formatDate(self.endStart)		
                };
                var imgfileListType = true;
                var parmeas = '';
                if(subType){
                        subDataArrys.forEach((element,elIndex)=>{
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].title'] = element.title;
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].targetType'] = element.radio;
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].ipadPicUrl'] = element.fileList[8].imgs;
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].iphonePicUrl'] = element.fileList[6].imgs;
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].iphonexPicUrl'] = element.fileList[7].imgs;
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].hdpi'] = element.fileList[0].imgs;
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].mdpi'] = element.fileList[1].imgs;
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].xhdpi'] = element.fileList[2].imgs;
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].xxhdpi'] = element.fileList[3].imgs;
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].xxxhdpi'] = element.fileList[4].imgs;
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].xxxxhdpi'] = element.fileList[5].imgs;
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].adType'] = 1;
                            parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].id'] = element.id||'';
                            if(!self.createdOrresove){
                                parmiseImgObj['id']=self.advertId;
                                parmiseImgObj['deleteId']=self.deleteIdArry.toString();
                            }
                            if(element.radio==1||element.radio==3||element.radio==4){
                                parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].targetId']=element.input;
                            }
                            if(element.radio==2){
                                parmiseImgObj['flashAdvertisingPicRecordFormList['+elIndex+'].targetId']=element.exCourseIds;
                            }
                            element.fileList.forEach(el2=>{
                                    if(!el2.imgs){
                                        imgfileListType =false;
                                    }                                
                            });
                        });
                }
                if(imgfileListType){
                    parmeas = parmiseImgObj;
                    if(!self.disabledState){
                        self.disabledState = !self.disabledState;                          
                        actions.getData(url,parmeas,'post')
                            .then(data => {                                
                                console.log(data);
                                self.adcerTUrl = true;
                                self.disabledState = !self.disabledState;
                                this.$router.push('/advertBeatList');                               
                            })
                            .fail(function(error){
                                self.disabledState = !self.disabledState;
                                console.log(error)
                            }
                        );
                    }
                }else{
                    this.$message.error('所有图片必须上传');
                    return;
                }
        },
        removeAdvertModel(data,keyIndex){
            this.advertisementModelList.splice(keyIndex,1);
            if(data.id){
                this.deleteIdArry.push(data.id);
            }
        },
        removeimgs(index,keyIndex){
            this.advertisementModelList[keyIndex].fileList[index].imgs='';
        },
        removeVideos(){
            this.videoUrl='';
        }       
        },
        mounted(){},
        watch:{ 
            advertisementModelList:{
                handler(cur,old){
                    this.adcerTUrl = false;
                    this.handle = true;
                },
                deep:true
        },
        title(curVal,oldVal){
            this.handle = true;
            if(curVal!==oldVal){
                this.adcerTUrl = false;
                this.dataChange = true;
            }
        },
        dataStart(curVal,oldVal){
            this.handle = true;
            if(curVal!==oldVal){
                this.adcerTUrl = false;
                this.dataChange = true;
            }
        },
        endStart(curVal,oldVal){
            this.handle = true;
            if(curVal!==oldVal){
                this.adcerTUrl = false;
                this.dataChange = true;
            }
        },     
        value(curVal,oldVal){
            this.handle = true;
            this.adcerTUrl = false;
        }
    }
}
*/

// import Breadcrumb from "@/components/formSynthesisPlugin/gxBreadcrumb";
import Breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
import eventAction from '../lEventAtion';
import Dialog from "@/components/myDialog/myDialog";
// import courseselect from "../member/courseAcconList"; //推存选择课程组件
let actions = new eventAction();
// import editimg1 from "../../../static/images/4.jpg";
const cityOptions = ['链接', '课程', '活动', '无链接'];
export default {
    components:{
        Breadcrumb,
        Dialog,
        // courseselect
    },    
    data(){
        return {          
            myHeaders: {token: getToken()},
            value: 1,
            title:'',
            urls:'/flashAdvertising/getCourseList',
            exCourseIds:[],
            selectData:[],
            dataStart:'',
            endStart:'',
            imgs:'',
            input:'',
            videoUrl:'',
            radio:'4',
            radioModel:'',
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
                    // ,{sizeTltle:"IOS1284*2778",size:[1284,2778],imgs:'',loading:false}
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
            handle:false,
            courseselectPluginDialog:false,
            createdOrresove:true,
            advertId:'',
            input2:'',
            tableData:[],
            titleList:[
                {
                    name:'闪屏管理',
                    pathInfo:'/advertBeatList'
                },                
                {
                    name:'闪屏设置',
                    pathInfo:'/resource/video'
                }                               
            ],
            checkedCities:1,
            cities: [
                {
                    name:'自营课程',
                    value:1
                },
                {
                    name:'三方课程',
                    value:2
                }
            ],
            disabledState:false  

    }},
    created(){
        // this.ajaxImglistOrVider();
        if(this.$route.query.id){
            this.createdOrresove = false;
            this.advertId=this.$route.query.id;
            this.currentSel(this.$route.query.id);
        }else{
            this.returnDetailCourse('');
        }
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
        //删除课程
        removeSelectCourse(indexs){
                var remDate =this.selectData.splice(indexs, 1);
                this.exCourseIds='';            
        },
        //选择课程
        saveSeach(){
            this.returnDetailCourse('');
        },
        closeCourseList(){
            this.courseselectPluginDialog = false;
        },
        isOkSelect(){
            var self = this;
            if(!self.radioModel){
                self.$message.error('请选择课程');
                return;
            }else{
                self.selectData =[];
                self.tableData.forEach((element,index)=>{
                    if(element.id==self.radioModel){
                        self.selectData.push({
                            "id":element.id,
                            "title":element.title
                        });
                        this.exCourseIds = element.id
                    }
                    this.courseselectPluginDialog = false;
                });                
            }

            
        },
        //选择类型事件
        changePlugin(data){
            this.tableData = []             
            // this.checkedCitiesVal = this.checkedCities.toString();
            this.returnDetailCourse('');
        },          
        //选择课程
        selectCourse(){
            this.courseselectPluginDialog = true;
        },         
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
        //链接失去焦点验证
        checkeven(event){
            if(this.radio=="1"){
                let checktest = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                if( !checktest.test(this.input)){
                    this.input = "";
                }
            }
        },
        currentSel(id){
            var self = this;
            var url = '/flashAdvertising/findFlashById';
            self.fileList.forEach((element,index)=>{
                element.loading = true;
            });
            actions.getData(url,{id:id})
                .then(data => {      
                    console.log("data111",data);
                    if(data){
                        self.fileList[8].imgs=data.ipadPicUrl;		
                        self.fileList[6].imgs=data.iphonePicUrl;		
                        self.fileList[7].imgs=data.iphonexPicUrl;			
                        // self.fileList[9].imgs=data.iphonexBigPicUrl;	
                        self.fileList[0].imgs=data.hdpi;		
                        self.fileList[1].imgs=data.mdpi;		
                        self.fileList[2].imgs=data.xhdpi;		
                        self.fileList[3].imgs=data.xxhdpi;	
                        self.fileList[4].imgs=data.xxxhdpi;
                        self.fileList[5].imgs=data.xxxxhdpi;
                        self.radio = JSON.stringify(data.targetType);
                        self.dataStart = data.onlineTime;
                        self.endStart = data.offlineTime;
                        self.title=data.title;
                        self.$nextTick(function(){
                            self.fileList.forEach((element,index)=>{
                                element.loading = false;
                            });
                        })  
                        self.exCourseIds = Number(data.targetId);
                        if(self.radio==2){
                            self.radioModel = Number(data.targetId);
                            console.log( 'self.radioModel',self.radioModel);
                        }else{
                            self.input = data.targetId;
                        }
                        this.returnDetailCourse(self.exCourseIds);
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
        },
        //回显排除课程
        returnDetailCourse(exCourseIds){
            var self = this;
            let params = {
                title:self.input2,
                courseSource:self.checkedCities
            };
            let query = {
                params:{
                    title:self.input2,
                    courseSource:self.checkedCities
                }
            }            
            this.$http.get(this.$server.getCourseListNewAdvied,query).then(res=>{
                if(res.status==200){ 
                    this.tableData = res.content;
                    if(exCourseIds){
                        res.content.forEach((el,i)=>{
                            if(el.id==exCourseIds){
                                self.selectData.push(el);
                            }
                        });
                    }
                }
            });            
        },   
        formatDate(date){
            if(date){
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                var h=date.getHours();
                var m1=date.getMinutes();
                var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;
                    h = h<10?("0"+h):h;
                    m1 = m1<10?("0"+m1):m1;
                    s = s < 10 ? ("0" + s) : s;
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
            }
        },             
        subdormEven(){
            //ipadPicUrl:'',//ipad图片地址		
            //iphonePicUrl:'',//ios图片地址1		
            //iphonexPicUrl:'',//ios图片地址2		
            //iphonexBigPicUrl:'',//ios图片地址2		
            //hdpi:'',//安卓图片地址1		
            //mdpi:'',//安卓图片地址2		
            //xhdpi:'',//安卓图片地址3		
            //xxhdpi:'',//安卓图片地址4		
            //xxxhdpi:''//安卓图片地址5    
            var self = this;
            var url ='';
            if(self.createdOrresove){
                url = '/flashAdvertising/saveFlashAdvertising';
            }else{
                url = '/flashAdvertising/updateFlashAdvertising';
            }
            if(!self.title){
                self.$message.error('请填写标题');
                this.$refs.advertTitie.focus();//inputs
                return
            }
            if(!self.exCourseIds&&self.radio==2){
                self.$message.error('请选择课程');
                return;
            }
            if(!self.dataStart||!self.endStart){
                self.$message.error('请选择上下线时间');
                return;
            }  
            if(Number(self.dataStart)>Number(self.endStart)){
                self.$message.error('开始时间必须小于结束时间');
                return;
            }          
            if(Number(self.radio)==1&&Number(self.radio)==3&&!self.input){
                switch (Number(self.radio)) {
                    case 1:
                        self.$message.error('请填写链接');
                        break;
                    case 3:
                        self.$message.error('请填写活动id');
                        break;                            
                    default:
                        break;
                    }
                    this.$refs.inputs.focus();
                    return;
            }else{
                var parmiseImgObj = {
                        title:self.title,
                        adType:1,//广告类型 1 图片 2 mov		
                        targetType:Number(self.radio)||4,//是	广告目标类型 1:链接,2:课程,3:活动，4:无链接	
                        onlineTime:self.formatDate(self.dataStart),
                        offlineTime:self.formatDate(self.endStart),
                        ipadPicUrl:self.fileList[8].imgs,//ipad图片地址		
                        iphonePicUrl:self.fileList[6].imgs,//ios图片地址1		
                        iphonexPicUrl:self.fileList[7].imgs,//ios图片地址2
                        // iphonexBigPicUrl:self.fileList[9].imgs,//ios图片地址4		
                        hdpi:self.fileList[0].imgs,//安卓图片地址1		
                        mdpi:self.fileList[1].imgs,//安卓图片地址2		
                        xhdpi:self.fileList[2].imgs,//安卓图片地址3		
                        xxhdpi:self.fileList[3].imgs,//安卓图片地址4		
                        xxxhdpi:self.fileList[4].imgs,//安卓图片地址5 
                        xxxxhdpi:self.fileList[5].imgs//安卓图片地址6  		
                    };
                    if(!self.createdOrresove){
                        parmiseImgObj['id']=self.advertId;
                    }
                    if(self.radio==1||self.radio==3||self.radio==4){
                        parmiseImgObj['targetId']=self.input;
                    }
                    if(self.radio==2){
                        parmiseImgObj['targetId']=self.exCourseIds;
                    }
                var imglength = 0;
                var parmeas = '';
                    for(var i in self.fileList) {
                            if(!self.fileList[i].imgs){
                                imglength =imglength+1;   
                            }
                    };
                    if(imglength==0||imglength==8){
                        parmeas = parmiseImgObj;
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;                          
                            actions.getData(url,parmeas,'post')
                                .then(data => {                                
                                    console.log(data);
                                    self.adcerTUrl = true;
                                    self.disabledState = !self.disabledState;
                                    this.$router.push('/advertBeatList');                               
                                })
                                .fail(function(error){
                                    self.disabledState = !self.disabledState;
                                    console.log(error)
                                }
                            );
                        }
                    }else{
                        this.$message.error('所有图片必须上传');
                        return;
                    }
            }
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
            console.log('curVal',curVal);
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
// @import "../../components/formSynthesisPlugin/my-component.css";
// .module-details {
//         padding: 20px;
//         width: 1160px;
//         .form-module{
//             border-radius: 5px;
//             box-shadow: 0px 0px 9px #edf1f7;
//             background: #fff;    
//             padding: 20px 10px;
//             font-size: 14px;
//             .modelListBox{
//                 width: auto;
//                 overflow-x: scroll;
//                 white-space: nowrap;
//                 .modelListStyle{
//                     display: inline-block;
//                     margin: 0 20px;
//                     .fileDivStyle{
//                         border: 1px solid #f4f4f4;
//                         margin-bottom: 20px;
//                         padding: 10px 10px 10px 0;
//                     }
//                 }
//             }
//             .modelListBox::-webkit-scrollbar{//隐藏滚动条
//                 height: 5px;
//                 // display: none;
//             }            
//             .advertCss{
//                     width: 400px;
//                     .videotyle{
//                         position: relative;
//                         .progress{
//                             position: absolute;
//                             left: 50%;
//                             top: 40%;
//                             transform: translate(-50%, -50%);
//                             max-width: 50%;
//                             text-align: center;
//                             color: #B4272D;                     
//                         }
//                         .avatar{
//                             width: 100%;
//                         }
//                         i{
//                             position:absolute;
//                             right: -10px;
//                             top:-10px;
//                             font-size: 20px;
//                             color: #B4272D;
//                             z-index: 2001;
//                             cursor: pointer;
//                         }                        
//                     }
//                     .imgstyle{
//                         width: 157px;
//                         height: 81px;
//                         position: relative;
//                         div{
//                             width: 100%;
//                             height: 100%;
//                             overflow: hidden;
//                             border: 1px solid #ccc;
//                             border-radius: 3px;
//                             text-align: center;
//                             line-height: 81px;                            
//                         }
//                         i{
//                             position:absolute;
//                             right: -10px;
//                             top:-10px;
//                             font-size: 20px;
//                             color: #B4272D;
//                             z-index: 2001;
//                             cursor: pointer;
//                         }
//                     }
//                 }
//             }
//         .fontCss13{
//             color: #D0D0D0;
//             font-size: 13px;
//         }

//         .module-title{
//             height: 40px;
//             background: #f6f6f8;
//             line-height: 40px;
//             padding-left: 25px;
//             font-size: 14px;
//             color: #384156;            
//         }
//     }
//     .selectCourseBut{
//         width: 80px;
//         height: 30px;
//         font-size: 14px;
//         text-align: center;
//         line-height: 30px;
//         border-radius: 6px;
//         background: #9E0E00;
//         color: #fff;         
//     }
//     .courseList{
//         margin-top: 20px;
//         .courseListCount{
//             position: relative;
//             i{
//                 position: absolute;
//                 top: 5px;
//                 right: -50px; 
//                 font-size: 16px;             
//             }
//             p{
//                 height: 25px;
//                 font-size: 14px;
//                 line-height: 25px;
//                 width: 170px;
//                 color: #606266;
//                 overflow: hidden;
//                 text-overflow:ellipsis;
//                 white-space: nowrap;              
//             }
//         }
//     }    
//     .tableDataBox{
//         // display: flex;
//         // flex-direction: column;
//         // justify-content: center;
//         max-height: 400px;
//         overflow-y:auto;
//         .tableData-list{
//             display: flex;
//             flex-direction: row;
//             justify-content:space-between;
//             margin-bottom: 10px;
//         }
//     } 
//     .courseAccStyle{
//         display: flex;
//         justify-content: flex-start;
//         flex-direction: row;        
//     }
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
    .selectCourseBut{
        width: 80px;
        height: 30px;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        border-radius: 6px;
        background: #9E0E00;
        color: #fff;         
    }
    .courseList{
        margin-top: 20px;
        .courseListCount{
            position: relative;
            i{
                position: absolute;
                top: 5px;
                right: 0px; 
                font-size: 16px;             
            }
            p{
                height: 25px;
                font-size: 14px;
                line-height: 25px;
                width: 170px;
                color: #606266;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;              
            }
        }
    }    
    .tableDataBox{
        // display: flex;
        // flex-direction: column;
        // justify-content: center;
        max-height: 400px;
        overflow-y:auto;
        .tableData-list{
            display: flex;
            flex-direction: row;
            justify-content:space-between;
            margin-bottom: 10px;
        }
    } 
    .courseAccStyle{
        display: flex;
        justify-content: flex-start;
        flex-direction: row;        
    }
</style>
