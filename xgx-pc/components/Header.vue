<template>
    <div class="header normal" :class="{'is-login':isLogin}"  @keydown="pressKeyDown($event)" @mouseleave="leave(false)">
        <div class="header-box" >
            <img :src="logo" alt="logo" class="logo"/>
            <ul class="menu clearfix">
                <li v-for="(item,index) in menu" :key="index" :class="{'active':item.active}" @mouseenter="enter(item.starts==2?true:false)">
                    <span v-if="item.starts==1" @click="goPage(item)">{{item.text}}</span>
                    <div class="ulDiv" v-if="item.starts==2" @click="goPage(item)">
                        <p @mouseenter="enter(true)" class="course-menu">{{item.text}}</p>
                        <i @mouseenter="enter(true)" class="el-icon-arrow-down select-icon" :class="courseListShowOrHiden?'active':''"></i>
                        <el-collapse-transition>
                            <div class="course-classify-list" v-show="courseListShowOrHiden" @mouseleave="leave(false)">
                                <ul class="ulChildrenLi" >
                                    <li class="textEllipsis" v-for="(item,i) in courseClassifyList" :class="{'active':item.active}" :key="i" @click="goCourseList($event,item)">{{item.classifyName}}</li>
                                </ul>       
                            </div>                         
                        </el-collapse-transition>
                    </div>
                </li>
            </ul>
            <div class="search-area" v-show="searchShow">
                <input type="text" placeholder="请输入课程/讲师" v-model="keywords" @focus="searchError=false" ref="searchInput" maxlength="20"/>
                <div class="search-btn" @click="toSearch">
                    <i class="el-icon-search" ></i>
                    <span>搜索</span>
                </div>
                <p class="error" v-show="searchError">请输入课程名称或授课老师姓名查询</p>
            </div>
            <div class="version-switch" v-if="hasVersionBtn" v-show="finish">
                <i></i>
                <p @click="switchHome(stateNum)">{{stateNum?'切换少儿版':'切换成人版'}}</p>
            </div>
            <div class="login-regis" v-if="!isLogin">
                <a @click="$router.push('/auth/smsLogin')">登录</a> | <a @click="$router.push('/auth/register')">注册</a>  
            </div>
            <div class="personal-center" v-else v-show="!isWhite">
                <div class="my-message1" @click="$router.push('/personal/personalList?selectId=2')">
                    <i></i>
                    <span>消息</span>
                    <span class="has-msg" v-if="hasMsg"></span>
                </div>
                <div class="my-course1" @click="$router.push({path:'/myCourse',query:{selectId:1}})">
                    <i></i>
                    <span>我的课程</span>
                </div>
                <div class="person"  @click="$router.push({path:'/personal/personalData',query:{selectId:1}})">
                    <img :src="avatar" alt=""/>
                    <span>个人中心</span>
                </div>
                <div class="logout1" @click="logout">
                    <i></i>
                    <span>退出</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
declare function require(string): string;
const Logo = require('@/assets/images/logo_header.png');
import {Component , Vue ,Watch} from 'vue-property-decorator'
import {mapState,mapActions} from 'vuex'
import { Route } from "vue-router";
import { setTimeout } from 'timers';
import {delCookie,getCookie} from '../utils/cache.js'
const WhiteheaderPage : string[ ] = ['index-auth'];
const hasVersionPage : string[ ] = ['index-course','index-home','index-search'];
const searchHiddenPage = ['index-information-index']
@Component({
    computed:{
        ...mapState(['userData','switchEdition','courseList'])
    },
    methods:{
        ...mapActions(['setSwitchBoolCommit'])
    },    
    async asyncData({app,params,req}:NuxtContext):Promise<any>{}    
})
export default class Header extends Vue{
    logo = Logo
    menu:Object[] = [
      {active:true,link:'/home',text:'首页',starts:1,name:'index-home',},
      {active:false,link:'',text:'课程',starts:2,name:'index-course-courseList'},
      {active:false,link:'/thentication',text:'入驻',starts:1,name:'index-authentication'},
      {active:false,link:'/download',text:'APP下载',starts:1,name:'index-download'},
      {active:false,link:'/cooperate',text:'商务合作',starts:1,name:'index-cooperate'},
      {active:false,link:'/information',text:'资讯',starts:1,name:'index-information-index'},
    ]
    isLogin:boolean = false
    hasVersionBtn:boolean = true
    isWhite:boolean = false
    avatar:string = ''
    stateNum='';
    courseClassifyList = [];
    courseListShowOrHiden:boolean=false;
    keywords = ''
    searchError = false
    finish = false
    searchShow = true
    hasMsg = false
    @Watch("userData")
    onuserDataChanged(val, oldVal) {
        if(typeof val=='object'&& val.hasOwnProperty('token')){
            this.avatar = val.avatar;
            this.isLogin = true;
            this.getMyUnreadNum()
        }
    }
    @Watch('switchEdition')
    onswitchEditionChanged(val,oldval){
        this.stateNum = val;
        this.$nextTick(()=>{
            this.getclassifyList()
        })
    }   
    @Watch("$route")
    onRouteChanged(val, oldVal) { 
        let name = val.name || ''
        let hasVersionBtn = hasVersionPage.find(item=>name.includes(item))
        this.hasVersionBtn = hasVersionBtn?true:false;
        let isWhite = WhiteheaderPage.find(item=>name.includes(item))
        this.isWhite = isWhite?true:false;
        this.searchShow = searchHiddenPage.find(item=>name.includes(item))?false:true;
        if(val.name=="index-search"){
            this.keywords = val.query.keywords
        }
        if(val.name!='index-course-player'){
            document.querySelector('.header').classList.remove('hid');
        }
        if(!val.name.includes('index-home')){
            document.querySelector('.header').classList.add('normal');
        }else{
            document.querySelector('.header').classList.remove('normal');
        }
        if(val.name=='index-course-courseList'){
            if(val.query&&val.query.id){
                this.courseClassifyList.forEach(item=>item.active = false)
                let obj = this.courseClassifyList.find(item=>item.classifyId==val.query.id);
                obj.active = true;
            }
        }else{
            this.courseClassifyList.forEach(item=>item.active = false)
        }
        this.menuFocus()  
    }
    created(){      
        let name = this.$route.name || ''
        let hasVersionBtn = hasVersionPage.find(item=>name.includes(item))
        this.hasVersionBtn = hasVersionBtn?true:false;
        let isWhite = WhiteheaderPage.find(item=>name.includes(item))
        this.isWhite = isWhite?true:false;
        this.searchShow = searchHiddenPage.find(item=>name.includes(item))?false:true;
        if(process.client){
            let user = this.$getCookie('xgx_user')?this.$getCookie('xgx_user'):null;
            if(user){
                let userData = JSON.parse(user)
                this.avatar = userData.avatar;
                this.isLogin = true;
                this.getMyUnreadNum()
            }
            if(this.$route.name=="index-search"){
                this.keywords = this.$route.query.keywords
            }
            let isWhite = WhiteheaderPage.find(item=>name.includes(item))
            this.isWhite = isWhite?true:false;  
            this.finish = true; 
        }
        this.getclassifyList()
     
    }
    pressKeyDown(e:any){
        if(e.target.nodeName.toLocaleLowerCase()=='input'&&e.keyCode=='13'){
            this.toSearch()
        }
    }
    /**
     * 获取是否有未读消息
     */
    async getMyUnreadNum(){
        let query = {
            params:{
                pageSize:10,
                pageNo:1,
            }
        }
        let res = await this.$axios.$get(this.$server.getMyUnreadNum,query)
        if(res.status==200){
            let obj = res.content.find(item=>item.msgType==-1);
            if(obj&&obj.MsgTypeNum>0){
                this.hasMsg = true;
            }
        }
    }
    /**
     * 获取课程分类列表
     */
    async getclassifyList(){
        let query = {
            params:{
                editionType:this.switchEdition?3:4
            }
        }
        let res = await this.$axios.$get(this.$server.getclassifyList,query)
        if(res.status==200){
            this.courseClassifyList = res.content;
            if(this.$route.name=='index-course-courseList'){
                if(this.$route.query&&this.$route.query.id){
                    let obj = this.courseClassifyList.find(item=>item.classifyId==this.$route.query.id);
                    obj.active = true;
                }
            }
        }
    }
    goPage(obj){
        if(obj.text=='课程'){
            this.menu.forEach(item=>item.active = false)
            obj.active = true;
            this.courseClassifyList.forEach(item=>{
                item.active = item.classifyId==0?true:false 
            })
            this.$router.push(`/course/courseList?id=0&sortType=1&pageNo=1&pageSize=12&freeType=2`)
        }else{
            if(obj.link){
                this.menu.forEach(item=>item.active = false)
                obj.active = true;
                this.$router.push(obj.link)
            }
        }
    }
    /**
     * 去搜索
     */
    toSearch(){
        if(this.keywords==''){
            this.searchError = true;
            this.$refs.searchInput.blur();
            return;
        }
        if(this.keywords.match(/^[ ]+$/)){
            this.searchError = true;
            this.$refs.searchInput.blur();
            return;
        }
        this.$router.push({
            path:'/search',
            query:{
                keywords:this.keywords
            }
        })
    }
    switchHome(bools){
        this.stateNum = !bools;
        this.courseListShowOrHiden=false;
        this.setSwitchBoolCommit(this.stateNum);
        let type = this.stateNum?3:4
        this.$setCookie('versionType',type)
        if(type==4){
            this.$router.push('/home/child')
        }else{
            this.$router.push({ path:'/home'})
        }
        
    }
    goCourseList(e,obj){
        e.stopPropagation()
        this.courseClassifyList.forEach(item=>item.active = false)
        obj.active = true;
        this.menu.forEach(item=>item.active = false)
        this.menu[1].active = true;
        this.$router.push(`/course/courseList?id=${obj.classifyId}&sortType=1&pageNo=1&pageSize=12&freeType=2`)
    }
    enter(bool){
        this.courseListShowOrHiden=bool;
    }
    leave(bool){
        this.courseListShowOrHiden=bool;
    }
    /**
     * 退出
     */
    logout(){
        this.$confirm('是否退出登录', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            iconClass:'hidden',
            center:true
        }).then(() => {
            let loadingInstance = this.$loading.service({
                background:'rgba(255,255,255,0)'
            });
            let user =  getCookie('xgx_user')?JSON.parse( getCookie('xgx_user')):null
            let query = {
                params:{}
            }
            this.$axios.$get(`${this.$server.loginOut}/${user.userId}`,query).then(res=>{
                loadingInstance.close();
                if(res.status==200){
                    this.$message({
                        type: 'success',
                        message: '退出成功!'
                    });
                    delCookie('xgx_user')
                    setTimeout(()=>{
                        window.location.reload();
                    },1500)
                }else{
                    this.$message({
                        type: 'error',
                        message: res.message
                    });
                }
            })
        }).catch(() => {
            
        });
    }
    /**
     * 监听路径，改变menu聚焦点
     */
    menuFocus(){
        this.menu.forEach(item=>item.active = false)
        let obj = this.menu.find(item=>this.$route.name.includes(item.name));
        if(obj){
            obj.active = true;
        }
    }
    mounted(){
        let type = this.$getCookie('versionType');
        this.stateNum = type==4?false:true;
        this.setSwitchBoolCommit(this.stateNum);   
        this.menuFocus();   
        if(!this.$route.name.includes('index-home')){
            document.querySelector('.header').classList.add('normal');
        }else{
            document.querySelector('.header').classList.remove('normal');
        }
        window.addEventListener('scroll', ()=>{
            let scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
            if(!this.$route.name.includes('index-home')){
                if(this.$route.name=='index-course-player'){
                    if(scrollTop>=75){
                        document.querySelector('.header').classList.add('hid');
                    }else{
                        document.querySelector('.header').classList.remove('hid');
                    }
                    return;
                }
                return;
            }
            let dom = document.querySelector('.banner-modular')
            if(scrollTop>=dom.clientHeight){
                document.querySelector('.header').classList.add('normal');
            }else{
                document.querySelector('.header').classList.remove('normal');
            }
        }, true)
    }    
}
</script>
<style lang="scss" scoped>
    @keyframes show {
        0%{
            visibility: hidden;
            opacity: 0;
        }
        5%{
            visibility:visible;
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    }
    .header{
        width:100%;
        z-index: 2000;
        position: fixed;
        top:30px;
        left:0;
        transition: background-color 0.3s;
        &.hid{
            opacity:0;
            transition:opacity 0.3s;
        }
        &.normal{
            background: #fff;
            top:0;
            border-bottom:1px solid #dfdfdf;
            .header-box{
                animation: show 0.5s;
            }
            .logo{
                margin:22px 15px 18px 0px!important;
            }
            .login-regis{
                margin-right: 0!important;
            }
            .personal-center{
                right: 0!important;
            }
            .menu li{
                padding: 0 15px!important;
            }
        }
        .header-box{
            width: 1200px;
            margin:0 auto;
            background: #fff;
            font-size: 0;
            border-radius:6px;
            .logo{
                width: 118px;
                height: 40px;
                margin:22px 15px 18px 30px;
                display: inline-block;
                vertical-align: middle;
            }
            .menu{
                display: inline-block;
                vertical-align: middle;
                li{
                    float: left;
                    padding:0 13px;
                    font-family:STSongti-SC-Regular;
                    color:#333;
                    cursor: pointer;
                    span{
                        font-size:20px;
                    }
                    &.active{
                        color:#C30D20;
                        .course-menu{
                            color:#C30D20!important;
                        }
                    }
                    .ulDiv{
                        width: 48px;
                        position: relative;
                        padding-right: 6px;
                        .course-menu{
                            color:#333;
                            text-align: center;
                            font-size:20px; 
                        }
                        .select-icon{
                            font-size: 16px;
                            color: #333;
                            position: absolute;
                            top: 6px;
                            font-weight: bold;
                            right: -12px;
                            transform-origin: center;
                            transition: all 0.3s;
                            &.active{
                                transform: rotate(180deg);
                            }
                        }
                        .course-classify-list{
                            position: absolute;
                            max-width: 100px;
                            left: 50%;
                            top:150%;
                            transform: translate(-50%,0);
                        }   
                        .ulChildrenLi{
                            max-height: 300px;
                            overflow-y: auto;
                            border-radius:6px;
                            padding:10px 0;
                            background: #fff;
                            &::-webkit-scrollbar {
                                width: 4px!important;
                                height: 4px;
                            }
                            li{
                                float: none;
                                text-align: center;
                                font-size:16px;
                                font-family:STSongti-SC-Regular;
                                font-weight:400;
                                color:rgba(51,51,51,1);   
                                padding:10px!important;  
                                background: #fff; 
                                &.active{
                                    color:#CC0033!important;
                                }                  
                            }
                        }                        
                    }
                }
            }
            .search-area{
                width: 230px;
                height: 36px;
                border-radius:20px;
                background:rgba(243,245,246,1);
                display: inline-block;
                vertical-align: middle;
                position: relative;
                margin:0 25px 0 15px;
                input{
                    display: block;
                    padding: 0 68px 0 14px; 
                    color:#999999;
                    font-size: 16px;
                    line-height: 36px;
                    height: 36px;
                    width: 100%;
                    border:none;
                    outline: none;
                    background:none;
                    &::placeholder{
                        font-size: 16px;
                    }
                }
                .search-btn{
                    position: absolute;
                    right: 0;
                    top:0;
                    width: 70px;
                    height: 36px;
                    background: #C30D20;
                    line-height: 36px;
                    border-radius: 0 20px 20px 0;
                    padding: 0 4px;
                    cursor: pointer;
                    i,span{
                        display: inline-block;
                        color:#fff;
                        font-size: 16px;
                    }
                }
                .error{
                    position: absolute;
                    color:#CC0033;
                    bottom:-20px;
                    left: 2px;
                    font-size: 14px;
                    width: 100%;
                    transform: scale(0.9);
                }
            }
            .version-switch{
                font-size: 0;
                display: inline-block;
                vertical-align: middle;
                cursor: pointer;
                i{
                    display: inline-block;
                    vertical-align: middle;
                    height: 24px;
                    width: 24px;
                    background: url('../assets/images/v_icon_w.png')no-repeat 50% 50% / cover;
                    margin-right: 4px;
                }
                p{
                    display: inline-block;
                    vertical-align: bottom;
                    font-size:20px;
                    font-family:STSongti-SC-Regular;
                    text-decoration:underline;
                    color:#333;
                }
            }
            .login-regis{
                float: right;
                margin:29px 0;
                height: 22px;
                line-height: 22px;
                font-size:20px;
                color:#333;
                margin-right: 30px;
                a{
                    color:#333;
                    font-family:STSongti-SC-Regular;
                    cursor: pointer;
                    font-size: 20px;
                }
            }
        }
        &.is-login{
            .header-box{
                .personal-center{
                    font-size: 0;
                    float: right;
                    margin:29px 0;
                    position: relative;
                    right: 20px;
                    div{
                        display: inline-block;
                        vertical-align: middle;
                        position: relative;
                        margin:0 4px;
                        span{
                            font-size: 16px;
                            position: absolute;
                            top: 28px;
                            left:0;
                            visibility: hidden;
                            opacity: 0;
                            transition: all 0.3s;
                            font-family:STSongti-SC-Regular;
                        }
                        i{
                            display: block;
                        }
                        &:hover{
                            span{
                                visibility: visible;
                                opacity: 1;
                            }
                        }
                    }
                    .my-message{
                        position: relative;
                        i{
                            width: 24px;
                            height: 24px;
                            background: url('../assets/images/msg_icon.png')no-repeat 50% 50% /cover;
                        }
                        span{
                            width: 32px;
                            margin-left: -4px;
                            color:#fff;
                        }
                        .has-msg{
                            height: 8px;
                            width: 8px;
                            background: red;
                            border-radius: 50%;
                            position: absolute;
                            left:20px;
                            top:-2px;
                            opacity: 1;
                            visibility:visible;
                        }
                    }
                    .my-message1{
                        i{
                            width: 24px;
                            height: 24px;
                            background: url('../assets/images/msg_icon_1.png')no-repeat 50% 50% /cover;
                        }
                        span{
                            width: 32px;
                            margin-left: -4px;
                        }
                        .has-msg{
                            height: 8px;
                            width: 8px;
                            background: red;
                            border-radius: 50%;
                            position: absolute;
                            left:20px;
                            top:-2px;
                            opacity: 1;
                            visibility:visible;
                        }
                    }                    
                    .my-course{
                        i{
                            width: 24px;
                            height: 24px;
                            background: url('../assets/images/course_icon.png')no-repeat 50% 50% /cover;
                        }
                        span{
                            width: 64px;
                            margin-left: -20px;
                            color:#fff;
                        }
                    }
                    .my-course1{
                        i{
                            width: 24px;
                            height: 24px;
                            background: url('../assets/images/course_icon_1.png')no-repeat 50% 50% /cover;
                        }
                        span{
                            width: 64px;
                            margin-left: -20px;
                        }
                    }                    
                    .person{
                        width: 22px;
                        height: 22px;
                        // overflow: hidden;
                        img{
                            width: 22px;
                            height: 22px;
                            border-radius: 50%;
                        }
                        span{
                            width: 64px;
                            margin-left: -20px;
                        }
                        
                    }
                    .logout{
                        i{
                            width: 24px;
                            height: 24px;
                            background: url('../assets/images/logout_icon.png')no-repeat 50% 50% /cover;
                        }
                        span{
                            width: 32px;
                            margin-left: -4px;
                            color:#fff;
                        }
                    }
                    .logout1{
                        i{
                            width: 24px;
                            height: 24px;
                            background: url('../assets/images/logout_icon_1.png')no-repeat 50% 50% /cover;
                        }
                        span{
                            width: 32px;
                            margin-left: -4px;
                        }
                    }                    
                }                
            }
        }
    }

</style>
