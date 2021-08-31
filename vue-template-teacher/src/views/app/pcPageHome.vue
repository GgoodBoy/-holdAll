<template>
<div  class="page-wrap clearfix">
    
    <!-- <div v-show="!boolplugin" style="position:relative"> -->
    <div style="position:relative">
        <div class="module-list">
                    <div class="module-item" :class="{ moduleItemBrother:indexNative == i}" @click="addModule(item,i)" v-for="(item,i) in moduleList" :key="i">
                        {{item.name}}
                        <div :class="{ bottomstyle:indexNative == i}"></div>
                    </div>
        </div>
        <div class="phone-wrap fl phone-wrap-L">
            <div class="phone-inner"
                ref="phoneInner"
                v-loading="$store.state.appConfig.loading">
                <div class="inner-container">
                    <div class="content">
                        <div v-for="(item, index) in pageItemList"
                            :key="index"
                            class="list-item" @click="modelevenChoose(item,index)" :class="{marginCss:index!=0,chooseStyle:item.id==$store.state.appConfig.appStore.soleid}">
                            <!-- 模板遍历 --><!--banner轮播图-->
                            
                            <carousel v-if="item.moduleType === 'banner'" :message="item"></carousel>
                            <figures v-else-if="item.moduleType === 'columnsCourse'||
                                    item.moduleType === 'advertising'" 
                                    :message="item">
                            </figures>     
                            <nativebar v-else-if="item.moduleType === 'classify'" :message="item"></nativebar>   
                            <div class="free-courses-box" v-else-if="item.moduleType==='freeCourses'">
                                <p class="moduleName">{{item.moduleName||'免费好课'}}</p>
                                <div class="map" v-if="item.list.length==0">
                                </div>
                                <div v-else class="course-item" v-for="(item,index) in item.list" :key="index">
                                   <img class="surface" :src="item.surfacePlot"/>
                                   <div class="course-data">
                                        <p class="course-title">{{item.title}}
                                        </p>
                                        <div class="course-info">
                                            <div class="course-teacher">
                                                <!-- <div class="course-teacher-head">
                                                    <img :src="item.lectureTeacherList.length>0?item.lectureTeacherList[0].avatar:''"/>
                                                </div>
                                                <p :title="item.lectureTeacherList[0].name||''">{{item.lectureTeacherList.length>0?item.lectureTeacherList[0].name:''}}</p> -->
                                            </div>
                                        </div>
                                        <div class="bottom">
                                            <div class="browse-val">
                                                <p class="i-box"><i></i></p>
                                                <p>{{Math.floor(Number(item.courseBrowsCount)/1e5)>1?(Math.floor(Number(item.courseBrowsCount)/1e5)>1000?1000:Math.floor(Number(item.courseBrowsCount)/1e5))+'W+':Number(item.courseBrowsCount)}}学习</p>
                                            </div>
                                            <p class="course-price" v-if="item.isFree>0">免费</p>
                                            <p class="course-price" v-else>{{item.sellingPrice}}币</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="teacherRecommend" v-else-if="item.moduleType==='teacherRecommend'">
                                <p class="moduleName">{{item.moduleName||'名师推荐'}}</p>
                                <div class="map" v-if="item.list.length==0">
                                    <div v-for="(item,index) in 3" :key="index">
                                        
                                    </div>
                                </div>
                                <div class="teacher-list" v-if="item.list.length>0">
                                    <img v-for="(option,index) in item.list" :key="index" :src="option.avatar"/>
                                </div>
                            </div>
                            <coursesclugin v-else :message="item"></coursesclugin>            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 动态切换组件 -->
        <component class="config-info" :type="1" :urlList='urlList' :modeAllInfo="choosemodelInfo" :powerArryList="power" :is="$store.state.appConfig.chooseModelName" :key="keysId"></component>
        <mobiledelete :objHome="objList" :mobiledIsOk="saveMobiledelete" :powerArryList="power" v-show="mobileType!=''?true:false" :soleid="choosemodelInfo.id" v-on:removeChooseId="removeModelChooseId" :from="'adult'"></mobiledelete>
    </div>
    
    <!-- 推存弹框 -->
    <el-dialog
    :visible.sync="boolplugin"
    :close-on-press-escape='false'
    :close-on-click-modal="false"
    :show-close="false"
    width="50%"
    >
        <div class="centerCss">
                <!-- <courseListPlugin v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIds" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>     -->
                <courseListPlugin :varObjs='varObj' :chooseIdlist="$store.state.appConfig.chooseIdlists" :urlPorp="urls" :numbersBool="100" v-if="boolplugin" :courseType="'appHome'"></courseListPlugin>      
        </div>                    
    </el-dialog>     
    <!-- <courseselect :varObjs='varObj' :chooseIdlist="$store.state.appConfig.chooseIdlists" :urlPorp="urls" :numbersBool="100" v-if="boolplugin" :courseType="'appHome'"></courseselect> -->
    </div>
</template>

<script>
import { SlickList, SlickItem, HandleDirective } from "vue-slicksort"; 
import banner from "@/components/Appconfigpage/Banner/banner";// banner: [], //bannner:数据结构；  
import columnsCourse from "@/components/Appconfigpage/BannerCourse/bannerCourse";// columnsCourse: [], //通栏课
import advertising from "@/components/Appconfigpage/BannerFigure/bannerFigure";// advertising: [] //通栏图
import classify from "@/components/Appconfigpage/Classify/classify";// classify: [],//导航分类
import popularCourses from "@/components/Appconfigpage/HotCourses/hotCourses";// popularCourses: [],//热门课程
import featured from "@/components/Appconfigpage/Recommend/recommend";// featured: [], //推荐位
// import timeZone from "@/components/Appconfigpage/TimeZone/timeZone";// timeZone: [], //限时专区 timeZoneNew
import timeZone from "@/components/Appconfigpage/TimeZone/timeZoneNew";// timeZoneNew: [], //限时专区 timeZoneNew
import guessLike from "@/components/Appconfigpage/YouLike/youLike";// guessLike: [], //猜你喜欢
import freeCourses from "@/components/Appconfigpage/freeCourses/freeCourses"
import teacherRecommend from "@/components/Appconfigpage/teacherRecommend/teacherRecommend"
import coursesclugin from "@/components/AppChildplugin/CoursesPlugin/coursesplugin"; //推荐位子模板列表
import nativebar from "@/components/AppChildplugin/navieBarPlugin/nativebarplugin"; //导航子组件
import carousel from "@/components/AppChildplugin/Carousel/carousel"; //推荐位子模板
import figures from "@/components/AppChildplugin/Figure/figures"; //通栏图子模板
// import courseselect from "@/components/Appconfigpage/ACourseSelect/coursesselect"; //推存选择课程组件
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
import mobiledelete from "@/components/AppChildplugin/MobileDelete/mobiledelete"; //推存选择课程组件
import eventAction from '../lEventAtion';
let actions = new eventAction();
import bannerMap from '../../assets/images/pc_banner_bgd.png'
import tonglan from '../../assets/images/pc_tonglan_bgd.png'
import classifyMap from '../../assets/images/pc_classify_bgd.png'
// import editimg1 from "../../../static/images/4.jpg" //'./static/images/logo-new.png'
export default {
    components: {
        SlickItem,
        SlickList,
        banner,
        columnsCourse,
        classify,
        popularCourses,
        featured,
        timeZone,
        guessLike,
        advertising,
        coursesclugin,
        carousel,
        figures,
        // courseselect,
        courseListPlugin,
        mobiledelete,
        nativebar,
        freeCourses,
        teacherRecommend
    },
    directives: { handle: HandleDirective },
    data() {
        return {
            varObj:{
                mtypeText:false,
                pageType:false,//是否分页
            },              
            //重构修改 
            urlList:{
                addUrlProp:"/appIndexConfigs/add",
                type:3,
                selectUrlAll:"/appIndexConfigs/selectAll?type=3"
                },            
            // pageItemList: [],
            saveMobiledelete:false,
            defaultStructure: {
                banner: {
                    type: 1, //类型： 1活动 2课程 3链接 4无链接
                    content: '', //内容，可以是：活动id、链接、课程id，跟type对应	,
                    title:"",
                    picUrl: bannerMap, //banner图链接
                    id:new Date().getTime(),
                    newCreat:true
                },
                popularCourses:{
                    courseBrowsCount:0,
                    courseUserLikeCount:0,
                    sellingPrice:'',
                    surfacePlot:'./static/images/4.jpg',
                    id:new Date().getTime(),
                    newCreat:true
                },
                featured:{
                    content: '',
				    courseName: "", 
				    no: 0, 
                    type:2,
                    picUrl:'./static/images/4.jpg',
                    id:new Date().getTime(),
                    newCreat:true
                },
                timeZone:{
                    courseBrowsCount:0,
                    courseUserLikeCount:0,
                    sellingPrice:'',
                    surfacePlot:'./static/images/4.jpg',
                    content: "",
                    id:new Date().getTime() ,
                    newCreat:true           
                },
                guessLike:{
                    courseBrowsCount:0,
                    courseUserLikeCount:0,
                    sellingPrice:'',
                    surfacePlot:'./static/images/4.jpg',
                    content: "",
                    id:new Date().getTime() ,
                    newCreat:true                    
                },  
                classify:{
                    classifyId: '', //分类Id
                    no: 0, //序号
                    picUrl: classifyMap, //分类图
                    id:new Date().getTime(),
                    newCreat:true,
                    name:'',
                    type:''
                },
                advertising:{
                    content: '', //活动id	
                    picUrl: tonglan, //通栏图
                    title: "", //标题
                    type: 2, //类型：1活动 2课程 3链接 4无链接  
                    id:new Date().getTime(),
                    newCreat:true                  
                },
                columnsCourse:{
                    name: "", //模块名称	
                    picUrl: tonglan, //通栏图	
                    title: "", //标题
                    type:2 ,// 课程
                    content:"",
                    id:new Date().getTime(),
                    newCreat:true
                },
                
            },
            moduleList: [
                {
                    name: "导航分类",
                    type: "classify",
                    defaultStructure: [""]
                },
                {
                    name: "热门课程",
                    type: "popularCourses"
                },
                {
                    name: "限时专区",
                    type: "timeZone"
                },
                {
                    name: "猜你喜欢",
                    type: "guessLike"
                },
                {
                    name: "banner图",
                    type: "banner"
                },
                {
                    name: "通栏图",
                    type: "advertising"
                },
                {
                    name: "推荐位",
                    type: "featured"
                },
                {
                    name: "通栏课",
                    type: "columnsCourse" 
                },
                {
                    name:'免费好课',
                    type:'freeCourses'
                },{
                    name:'名师推荐',
                    type:'teacherRecommend',
                }
            ],
            which_to_show:"",
            keysId:"0",
            active:'',
            indexNative:0,
            modleId:null,
            oneId:'',
            choosemodelInfo:{},
            power:[],
            urls:'/course/getCourseList',
            courseIds:[],
            objList:{
                type:3
            },
            classifyBool:false
        };
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        var showTip = this.$store.state.appConfig.appStore.courseDivStyle;
        if(showTip){
            this.$store.state.appConfig.appStore.courseDivStyle=false;
            next();
        }else{
            next();
        }
    },      
    created(){

        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }        
        this.power = flag;
        var self = this
        self.$store.commit("appConfig/appHomePageData",[]);
        var getAppInfo= function (){
            var deferred = $.Deferred();
            self.$http.get("/appIndexConfigs/selectAll?type=3")
            .then(res => {
                if (res.status === 200) {
                    res.content.forEach((item)=>{
                        if(item.moduleType=='freeGoodCourse'){
                            item.moduleType = 'freeCourses'
                        }
                    })
                    deferred.resolve(res.content);//触发, 并传递数据
                }
            })
            .catch(res => {
                deferred.reject(res);
            });
            return deferred.promise();
        }
        $.when(getAppInfo())
            .done(function(data){
                self.$store.commit("appConfig/appHomePageData",data)
                //监听DOM渲染结束后在执行的回调函数；
                self.$nextTick(function(){
                    self.$store.commit('appConfig/loadingBool', false);
                })               
            })
            .fail(function(){
                self.$store.commit('appConfig/loadingBool', false);
                console.log("出错啦!")}
            );
            this.getAjaxLabelList(1);
            this.getAjaxLabelList(2);
    },    
    computed: {
        boolplugin(){
            return this.$store.state.appConfig.appStore.courseDivStyle
        },
        mobileType(){
            return this.$store.state.appConfig.appStore.type
        },
        pageItemList(){
            var idarr = [];
            for (let iterator of this.$store.state.appConfig.alldata) {   
                idarr.push(iterator.id);         
            } 
            this.$store.commit("appConfig/idArrObjFun",idarr)              
            return this.$store.state.appConfig.alldata
        }       
    },
    methods: {
        getAjaxLabelList(type){
            var self = this;
            var selectType = type;
            var urls = '';
            switch (selectType) {
                case 2:
                    //标签
                    urls = '/category/selectLabelList'
                    break;
                case 1:
                    //分类
                    urls = "/category/selectList";
                    break;                            
                default:
                    break;
            }
            actions.getData(urls)
                .then(data => {
                    var dataObj ={
                        data:data,
                        type:type
                    }
                    self.$store.commit('appConfig/setLabelOrCourseData', dataObj);
                })
                .fail(function(){                   
                    console.log("出错啦!")}
            );                     
        },        
        addModule(item,i){
                    this.classifyBool = false;
                    for (const iterator of this.pageItemList) {
                           if(iterator.moduleType == "classify"){
                               this.classifyBool = true;
                               break;
                           } 
                    }
                    if(item.type=='classify'&&this.classifyBool){
                        this.$message.error('只能创建一个导航分类');
                        return;
                    }
                    let numarr = this.$store.state.appConfig.idAlllist;
                    let maxnum = this.getMaximin(numarr,'max')+1;
                    this.indexNative = i;
                    let obfInfo ={
                        // type: item.type,
                        moduleType: item.type, //模块类型：  banner图
                        moduleName: "", //模块名称
                        // index: 1, //页面位置排序
                        styleId: 1, //样式
                        id:maxnum,
                        list: [$.extend({}, this.defaultStructure[item.type])]
                    };
                    if(item.type=='teacherRecommend'||item.type=='freeCourses'||item.type=='timeZone'){
                        obfInfo.list = []
                    }
                    // this.pageItemList.push(obfInfo);
                    this.$store.state.appConfig.alldata.push(obfInfo)
                    //滚动到底部
                    this.active = item.type;
                    var scrollHeight = $('.inner-container').prop("scrollHeight");
                    $('.inner-container').animate({scrollTop:scrollHeight},800);
        },
        getMaximin(arr,maximin) 
                    { 
                    if(maximin=="max") 
                    { 
                    return Math.max.apply(Math,arr); 
                    }
                    else if(maximin=="min") 
                    { 
                    return Math.min.apply(Math, arr); 
                    } 
        },
        //ljm
        modelevenChoose(e,i){
            //ljm
            //8大模块选中状态存储
            // if(this.$store.state.appConfig.appStore.soleid!=e.id){
                
                this.$store.commit("appConfig/typeAction",$.extend({},e))

                if(this.$store.state.appConfig.idInitlist.indexOf(this.$store.state.appConfig.appStore.soleid)!=-1){
                        this.saveMobiledelete = false;
                }else{
                        this.saveMobiledelete = true;
                }            
                
                this.keysId = e.id; 
                let id= e.id;
                if(i!==0){
                    this.modleId = id;
                }else{
                    this.modleId = null;
                }
                this.choosemodelInfo = this.$store.state.appConfig.alldata.find(item=>item.id==id)
            // }
        },
        removeModelChooseId(){
            this.choosemodelInfo = '';
        }
    },
    mounted(){}
};
</script>

<style scoped lang="scss">
.free-courses-box{
    padding:  0 40px;
    .map{
        background: url('../../assets/images/pc_course_bgd.png')no-repeat 50% 50% ;
        background-size: 100% 100%;
        height: 189px;
        width: 100%;
        overflow: hidden;
        border-radius: 5px;
    }
    .course-item{
        display: flex;
        box-shadow: 0 0 3px #dfdfdf;
        margin-bottom: 15px;
        height: 180px;
        .surface{
            width: 49%;
            height: 100%;
            border-radius: 5px 5px 0 0;
        }
        .course-data{
            position: relative;
            font-size: 0;
            padding:14px 40px;
            flex: 1;
            text-align: left;
            background: #fff;
            .course-title,.course-info,.course-price{
                line-height: 26px;
            }
            .course-title{
                color:#333;
                font-size: 18px;
                font-weight: bold;
                width: 100%;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                height: 52px;
            }
            .course-info{
                font-size: 0;
                position: relative;
                margin:5px 0;
                .course-teacher{
                    font-size: 0;
                    margin:20px 0;
                    i,img,p{
                        display: inline-block;
                        vertical-align: middle;
                    }
                    p{
                        width: 130px;
                        white-space:nowrap;
                        text-overflow:ellipsis;
                        -o-text-overflow:ellipsis;
                        overflow:hidden;
                        font-size: 16px;
                        color:#666;
                    }
                    img{
                        height:24px;
                        border-radius: 50%;
                        position: absolute;
                        top:50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                    }
                    .course-teacher-head{
                        display: inline-block;
                        vertical-align: middle;
                        height:24px;
                        width:24px;
                        border-radius: 50%;
                        overflow: hidden;
                        margin-right: 5px;
                        position: relative;
                    }
                }
            }
            .bottom{
                position: absolute;
                bottom:16px;
                left: 40px;
                width: 80%;
                .browse-val{
                    width: 70%;
                    font-size: 0;
                    line-height: 24px;
                    
                    p{
                        font-size: 14px;
                        display: inline-block;
                        vertical-align: middle;
                        color:#999;
                    }
                }
                .course-price{
                    color:#C30D23;
                    font-size: 16px;
                    position: absolute;
                    right:0;
                    top:0;
                }
            }
        }
    }
    .moduleName{
        font-size: 36px;
        font-weight:bold;
        text-align: left;
        margin-bottom:20px;
    }
}
.teacherRecommend{
    .moduleName{
        font-size: 36px;
        font-weight:bold;
        text-align: left;
        margin-bottom:20px;
    }
    padding:  0 40px;
    .map{
        display: flex;
        >div{
            flex:1;
            background: url('../../assets/images/pc_teacher_bgd.png')no-repeat 50% 50% / cover;
            height: 189px;
            overflow: hidden;
            border-radius: 5px;
            margin-right: 10px;
        }
    }
    .teacher-list{
        display: flex;
        overflow: hidden;
        img{
            height: 189px;
            width: 189px;
            box-shadow: 0 0 3px #dfdfdf;
            margin-right: 10px;
             flex: 0 0 33.33%;
        }
    }
}
.page-wrap {
    margin: 0 auto;
    width: 1115px;
}
.marginCss{
  margin: 38px 0;
}
.chooseStyle{
    padding: 10px;
    box-shadow: 0 0 10px 0 red inset;
}
.module-list {
    // width: 100px;
    padding: 20px;
    // position: relative;
        height: 80px;
        background: #FFFFFF;
        color: #99a9bf;
        .moduleItemBrother{
            color:rgba(247,59,66,1);
        }
        .module-item {
            width: 80px;
            text-align: center;
            cursor:pointer;
            margin: 5px;
            float: left;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            position: relative;
            font-size:16px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            line-height:25px;   
            margin-left: 20px;         
            .bottomstyle{
                width: 40px;
                height: 2px;
                background: red;
                position: absolute;
                bottom:-8px;
                left: 20px;
            }
        }
}
.phone-wrap-L{
    background-repeat: no-repeat;
    background-size: 100%;
    height: 100%;
    padding: 25px 0px;
    box-sizing: border-box;
    width: 750px; 
    .phone-inner {
        width: 100%;
        height: 800px;
        position: relative;
        overflow: hidden; 
        background-color: #fff;  
    }    
}
.config-info{
    width: 320px;
    float: left;
    max-height: 500px;
    overflow: auto;
    box-shadow:0px 0px  5px 0px #ccc;
    margin-top: 25px;
    background-color: #FFFFFF;
    border-radius: 5px;
    margin-left: 45px;
}
.list-item {
    text-align: center;
    line-height: 40px;
    position: relative;
    transition: 0.3s;
    cursor: pointer;
    .carousel-items {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
        background-color: #99a9bf;
    }
    .item-handle {
        display: none;
        width: 100px;
        height: 30px;
        position: absolute;
        right: -100px;
        top: 0;
        .hand-btn {
            padding: 0;
        }
        .hand-icon {
            font-size: 30px;
            color: #333;
            cursor: pointer;
            &:active {
                font-size: 35px;
            }
        }
    }
    &:hover .item-handle {
        display: inline-block;
    }
}
.handle-wrap {
    width: 300px;
    min-height: 400px;
    outline: 1px solid #ccc;
    margin: 100px 0 0 100px;
}
.movein-bg {
    height: 30px;
    line-height: 30px;
    font-size: 30px;
    background: #e4e7ed;
    text-align: center;
    color: #f8f8f8;
}
</style>
<style>
.iconfont {
    font-size: 30px;
}
</style>
<style>
.el-carousel__indicators{
    width:100%;
}
.el-carousel__button{
    width: 7px;
    height: 7px;
    border-radius:50%;
    background-color:red;
}
</style>
<style>
.inner-container {
  position: absolute;
  left: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  width:100%;
  height: 100%;
}

.inner-container::-webkit-scrollbar {
  display: none;
}
.active {
   background: #fd7522;
   border: 1px solid #fd7522;
   color: #fff;
 }
</style>

