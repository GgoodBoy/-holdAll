<template>
    <div class="index-page">
        <div class="bgd-box">
            <div class="fubao_list">
                <div @click="tagEven(1)">中奖记录</div>
                <div @click="tagEven(5)">活动规则</div>
            </div>
            <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjieBgd.png" class="bgd"/>
            <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjieBag1.png" class="bag1"/>
            <div class="bag2" @click="tagEven(3)"></div>
            <div class="but dotAnimation" @click="fubaoSubmit(subBoIcons)">
                <img v-if="subBoIcons" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_bo.png" />
                <img v-else src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_sub.png" />
            </div>
            <div class="Icon1">
                <div :style="{color:loginStatus==1?'#223573':'#333333'}">{{homeData.meGold}}</div>
            </div>
            <div class="Icon4" v-show="homeData.remainGold+''=='0'">
                {{hours||'00'}}:{{minius||'00'}}:{{second||'00'}}后领取
            </div>
            <div class="Icon2" @click="tagEven(6)">
                <div :style="{color:loginStatus==1?'#223573':'#333333'}">{{Number(userInfo.userId)>0?200:'-'}}</div>                
            </div>
            <div class="Icon3" @click="tagEven(2)"></div>
        </div>
        <div class="dialog" v-if="dialogVisible">
        <!-- <div class="dialog" v-if="dialogVisible" @click="dialogEvent"> -->
            <div class="hongbao">
                <p class="tips">登录</p>
                <div class="form">
                    <div class="user item1">
                        <label>手机号</label>
                        <input type="tel" maxlength="11" placeholder="请输入手机号" v-model="cellphone"/>
                    </div>
                    <div class="item2 code">
                        <div class="code_val">
                            <label>验证码</label>
                            <input type="tellphone" maxlength="6" placeholder="输入验证码" v-model="code"/>
                        </div>
                        <div class="code-btn" @click.stop="sendSms" :class="{'disabled':codeText!='获取验证码'}">
                            {{codeText}}
                        </div>
                    </div>
                </div>
                <div class="btn" @click.stop="loginEvent"></div>
                <img src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_close.png' @click="tagEven(7)" v-if="actionLogin"/>
            </div>           
        </div> 
        <div class="fubaoMaskBoxOne" v-if="boxshowOne">
            <transition name="myCourseBox">
                <div class="courseBox" v-show="boxshowTwo">
                    <div class="tabs">
                        <div class="adultChildrentabs">
                            <div class="selectType1" :class="{'lefts':personOrChild,'rights':!personOrChild}" @click="tagsChanges(personOrChild,1)">{{personOrChild?'成人国学':'少儿国学'}}</div>
                            <div class="selectType2" :class="{'lefts':!personOrChild,'rights':personOrChild}" @click="tagsChanges(personOrChild,2)">{{personOrChild?'少儿国学':'成人少儿'}}</div>
                        </div>
                        <div class="courseType">
                            <div v-for="(item,index) in (personOrChild?adultTypeList:childTypeList)" :key="index" :class="{ 'styleBag1': actionsType==index, 'styleBag2': actionsType!=index }" @click="selects(index,1,item)">{{item.name}}</div>
                        </div>
                        <div class="courselistBox" v-if="tableCourseList.length>0">
                            <van-list
                                v-model="loading"
                                :finished="finished"
                                finished-text="没有更多了"
                                @load="onFubaoLoad"
                            >                            
                                <div v-for="(item,index) in tableCourseList" :key="index" :class="{ 'styleBag3': actionsCourse==index?true:false, 'styleBag4': actionsCourse!=index?true:false }" @click="selects(index,2,item)">
                                    <div class="courseInfo">
                                        <img :src="item.surfacePlot" />
                                        <p>{{item.title}}</p>
                                    </div>
                                </div>
                             </van-list>
                        </div>
                        <div class="courseBut">
                            <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_add_but.png" @click="myCourseBoxEven(true)"/>
                            <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_return.png" @click="myCourseBoxEven(false)"/>
                        </div>
                    </div>
                </div>
            </transition> 
        </div>
        <div class="sunBoxBagLayer" v-if="fubaoResultBox">
            <div class="sunBoxBag sunBoxBagIsYes">
                <div class="fudaiBox fudai1">
                    <div class="contents">
                        <div>福包提交成功!</div>
                        <p>该福包将于00:00:00开奖记得来领取奖励</p>
                    </div>
                    <img src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_close.png' @click="tagEven(4)"/>
                </div>
            </div>             
        </div>   
        <div class="fubaoMaskBox" v-if="boxshowThree">
            <transition name="myFuBaoBoxIndex">
                <div class="fubaoBox" v-show="boxshowFour">
                    <div class="fubaoTitle">
                        <div></div>
                        <div>赚礼金</div>
                        <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_close_2.png" @click="closeShare()"/>
                    </div>
                    <div class="fubaoUlBox">
                        <div class="fubao_li">
                            <div class="box">
                                <div class="lefts">
                                    <p>每日签到</p>
                                    <p>每日签到可领取1次</p>
                                </div>
                                <!-- // 1 已领取 0可以领取 -->
                                <img :src="homeData.signIn==1?'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_2.png':'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_1.png'" @click="setFuBaoInfoEven(1,homeData.signIn)"/>
                            </div>
                            <div class="tips">+200礼金</div>
                        </div>
                        <div class="fubao_li">
                            <div class="box">
                                <div class="lefts">
                                    <p>分享给好友</p>
                                    <p>分享给好友，每日仅可领取1次</p>
                                </div>
                                <!-- // 1 已领取 0可以领取 -->
                                <img v-if="homeData.shares==1" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_4.png"/>
                                <div v-if="homeData.shares!=1" ref="shareBtn" data-clipboard-action="copy" :data-clipboard-target="`#copy-input`" @click="setFuBaoInfoEven(2,homeData.shares)">
                                    <img :src="isShareIndex?'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_3.png':'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_5.png'"/>
                                </div>
                            </div>
                            <div class="tips">+200礼金</div>  
                        </div> 
                        <div class="fubao_li">
                            <div class="box">
                                <div class="lefts">
                                    <p>购买指定课程</p>
                                    <p>活动期内成功购买任意课程，仅可领取1次</p>
                                </div>
                                <!-- // 1 已领取 0可以领取  2任务没完成不能领取 -->
                                    <img :src="homeData.buyCourses==1?'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_4.png':(homeData.buyCourses==2?'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_5.png':'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_3.png')" @click="setFuBaoInfoEven(3,homeData.buyCourses)"/>
                            </div>
                            <div class="tips">+3000礼金</div>
                        </div>                                       
                    </div>
                </div>
            </transition>                   
        </div>   
        <div class="share-wrap" v-show="dialogVisbile">
            <transition name="fade">
                <div class="share-dialog" @click="dialogVisbileEven">
                    <template v-if="support&&(inApp||inOther)">
                        <i class="share-arrow"></i>
                        <p class="tip1">请点击上方{{inApp?'按钮':'···'}}发送给朋友</p>
                    </template>
                    <div class="copy-box" v-else @clic.stop="">
                        <div class="box">
                            <p class="link">{{link}}</p>
                            <p class="tips2">请手动复制上面地址，粘贴给好友</p>
                        </div>
                    </div>
                </div>
            </transition>
        </div> 
        <transition name="rule-show">
            <Rule v-if="ruleShow" :ruleShow.sync="ruleShow"/>
        </transition>       
        <audio ref="audio" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/gold.mp3"></audio>      
        <input id="copy-input" :value="link" readonly/>  
    </div>        
</template>
<script>
//LJM
import env from '../../config/prod.env'
import tools from '@/utils/tools.js'
import { DelCookies } from '@/utils/setCookies.js'
import Clipboard from 'clipboard'
import Rule from './rule.vue'
function getQueryString(key){
  var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
  var result = window.location.search.substr(1).match(reg);
  return result?decodeURIComponent(result[2]):null;
}
import {store,mutations} from '../store'
export default {
    data(){
        return{
            //ljm
            show1:false,
            show2:false,
            show3:false,
            cellphone:'',
            code:'',
            codeText:'获取验证码',    
            activityName:'fuBao',
            link:'',
            userInfo:{},//用户信息
            loadScriptFlag:false,
            boxshowOne:false,
            boxshowTwo:false,
            boxshowThree:false,
            boxshowFour:false,
            actionsType:-1,//选中类型
            actionsTypeItem:{},
            actionsCourse:-1,
            actionsCourseItem:'',
            tableCourseList:[],
            fudaiType:true,//福袋类型
            adultTypeList:[],
            childTypeList:[],
            dialogVisible:false,
            homeData:{
                meGold:'-',
                remainGold:'-',
                signIn:false,
                shares:false,
                buyCourses:false                
            },
            pageSize:10,
            pageNo:1,
            channelId:'',
            isWx:false,
            personOrChild:true,//成人少儿状态,少儿是true，成人是false;
            subBoIcons:true,//包福包还是提交福包
            finished:false,
            loading:false,
            onloadType:true,
            fubaoResultBox:false,
            //分享
            notShareClick:false,
            clipboard:'',//粘贴器
            inOther:false,//是否在其他APP里
            support:true,//是否支持一键复制
            dialogVisbile:false,
            ruleShow:false,
            isShareIndex:false,
            loginStatus:0,
            personOrChildType:2,
            actionLogin:true,//登录进行中
            hours:'',//时
            minius:'',//分
            second:'',//秒
            timer:''

        }
    },
    watch:{ 
        "homeData.remainGold":{
            handler:function(a,b){
                if(Number(a)!=Number(b)&&a+''=='0'){
                    this.setartTime();
                }
            }
        },
        loginStatus(cur){
            if(cur==0) return;
            if(cur==1){
                let uInfo = this.$getCookie('uInfo');
                if(uInfo){
                    this.userInfo = {
                        userId:JSON.parse(uInfo).userid,
                        token:JSON.parse(uInfo).accessToken,
                        cellphone:JSON.parse(uInfo).cellphone
                    }
                    this.dialogVisible=false;
                }
                //成功
            }                
        },
        userInfo(cur){
            if(cur.token){
                if(this.$server.env=='dev'){
                    this.link = `http://172.16.120.1:8000/channel${this.channelId}.html?activityShareUserId=${this.userInfo.userId}`;
                }else if(this.$server.env=='beta'){
                    this.link = `https://scm.youfushuyuan.com/h5/springfestival/channel${this.channelId}/index.html?activityShareUserId=${this.userInfo.userId}`
                }else{
                    this.link = `https://xgxm.xueguoxue.com/h5/springfestival/channel${this.channelId}/index.html?activityShareUserId=${this.userInfo.userId}`
                }
                this.$nextTick(()=>{
                    this.share()
                })
            }
            if(cur.cellphone){
                this.notShareClick = true;
            }                
        },
    },
    components:{Rule},    
    created(){
        // DelCookies('uInfo');
        this.channelId = env.page.find(item=>item.name==window.location.href.match(/channel\d+/)[0]).channelId;
        this.pointPage(this.channelId);
        this.inits();
        this.loadScript();   
        this.loadBaiduScript();
    },
    mounted(){
        setTimeout(()=>{
            document.body.scrollTop = 0;
        },300)
        // this.clipboard = new Clipboard(this.$refs.shareBtn);
        let ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
            this.inOther = true;
        }else if (ua.includes('weibo')){
            this.inOther = true;
        }else{
            this.inOther = false;
        }
    },
    computed:{
        userInfoisApp(){
            return store.userInfo;
        }     
    },
    methods:{
        setUserInfo:mutations.setUserInfo,
        setShakePoster:mutations.setShakePoster, 
        get_date() {//倒计时
                        var day_date = new Date(new Date(new Date().getTime()+24*60*60*1000).setHours(0,0,0,0)).getTime();//指定今晚0点求时间戳
                        var now_time = new Date().getTime();//获取当前时间戳
                        var hours = Math.floor((day_date-now_time)/60/60/1000).toString().padStart(2,0);
                        var minius = Math.floor((day_date-now_time)/60/1000%60).toString().padStart(2,0);
                        var second = Math.floor((day_date-now_time)/1000%60).toString().padStart(2,0);
                        this.hours=hours;
                        this.minius=minius;
                        this.second=second;
                        if(hours=='00'&&minius=='00'&&second=='00'){
                            clearInterval(this.timer);
                        }
                    },     
        //开始倒计时
        setartTime(){
            clearInterval(this.timer);
            this.timer = setInterval(()=>{
                this.get_date()
            },1000);            
        },   
        /**
         * H5准备工作，H5渠道通用版
         */
        inits(){
            document.body.addEventListener('touchstart', function(){}, false)
            document.addEventListener('gesturestart', function(event) {
                event.preventDefault();
            });
            let ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                this.isWx = true;
            }
            this.isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
            if(this.isIos){
                try {    
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage("messageBody");
                    this.inApp = true;
                }
                catch(err) {
                    this.inApp = false;
                }
            }else{
                if(window.android){
                if(window.android.notify){
                    this.inApp = true;
                }
                }else{
                    this.inApp = false;
                }
            }
            if(this.inApp){
                let cellphone = window.sessionStorage.getItem('cellphone');
                let userId = window.sessionStorage.getItem('userId');
                let token = window.sessionStorage.getItem('token');
                if(userId){
                    this.userInfo = {
                        userId:userId,
                        token:token,
                    }
                    if(cellphone){
                        this.userInfo.cellphone = cellphone;
                        this.pointVisit(this.channelId,userId);
                    }
                    let userInfoNext = {
                        accessToken: token,
                        userid: userId,
                        cellphone:cellphone,
                    }                    
                    this.setUserInfo(userInfoNext);
                    this.getHttplistAction();
                }
            }else{
                let uInfo = this.$getCookie('uInfo');
                if(uInfo){
                    this.userInfo = {
                        userId:JSON.parse(uInfo).userid,
                        token:JSON.parse(uInfo).accessToken,
                        cellphone:JSON.parse(uInfo).cellphone
                    }
                    this.pointVisit(this.channelId,this.userInfo.userId);
                    this.getHttplistAction();
                }
            }
        },
        //
        getHttplistAction(){
            this.getwhetherGoldInfo();
            this.getGoldCoin();
            this.getFuBaoClassifyIdList();
            if(this.userInfo.userId){
                this.loginStatus = 1;
            }
        },
        dialogVisbileEven(){
            this.dialogVisbile = false;
            // this.getFuBaoSignAndShareEven(2);
            // this.getwhetherGoldInfo();
        },
        //复制粘贴验证
        copyUrlInfo(){
            this.clipboard = new Clipboard(this.$refs.shareBtn);           
        },
        /**
         * 动态加载JS
         */
        loadScript(){
            if(this.loadScriptFlag){
                return false;
            }
            tools.loadScript('//res.wx.qq.com/open/js/jweixin-1.4.0.js').then(()=>{
                this.loadScriptFlag = true;
                    this.share()
            }).catch(()=>{
                this.loadScriptFlag = false;
                setTimeout(()=>{
                    this.loadScript()
                },1000)
            })
        },    
        /**
         * APP绑定手机号
         */
        bindPhoneEventByApp(){
            document.removeEventListener('visibilitychange',this.visibilitychangeEvent);
            if(this.isIos){
                // try{
                document.addEventListener('visibilitychange',this.visibilitychangeEvent);
                window.webkit.messageHandlers.iOSAppMethodName.postMessage({
                    describe:'',
                    method:'bindPhone',
                    params:{
                    channelId:this.channelId,
                    activityName:this.activityName
                    }
                }) 
                // }catch(err){
                //     this.dialogVisible = true
                //     this.loginshow = true
                // }
            }else{
                // if(window.android){
                if(window.android.notify){
                    document.addEventListener('visibilitychange',this.visibilitychangeEvent);
                    var message = JSON.stringify({
                    describe:'',
                    method:'bindPhone',
                    params:{
                        channelId:this.channelId,
                        activityName:this.activityName
                    }
                    })
                    window.android.notify(message);
                }
                // }else{
                //     this.dialogVisible = true
                //     this.loginshow = true
                // }
            }
        },   
            /**
            * 监听页面进入后台，与APP通信
            */
            visibilitychangeEvent(){
                if(this.userInfo.cellphone) return;
                let isHidden = document.hidden;
                if (isHidden) {
                    } else {
                    setTimeout(()=>{
                        let userId = window.sessionStorage.getItem('userId');
                        let cellphone = window.sessionStorage.getItem('cellphone');
                        let token = window.sessionStorage.getItem('token');
                        if(userId&&userId>=0){
                            this.userInfo = {
                            userId:userId,
                            token:token,
                            }
                            if(cellphone){
                                this.userInfo.cellphone = cellphone;
                                this.getUserInfoById()
                            }
                        }
                    },1)
                }
            },   
            /**
             * APP登录获取用户详情
             */
            async getUserInfoById(){
                const query = {
                    userId:this.userInfo.userId
                }
                const res = await this.$http.post(this.$server.getUserInfoById,query,{userId:this.userInfo.userId,token:this.userInfo.token})
                if(res.data.status==200){
                    let data = res.data.content;
                    data.userid = res.data.content.id;
                    data.accessToken = this.userInfo.token;
                    this.setUserInfo(data);     
                    this.getGoldCoin();
                    this.getwhetherGoldInfo()
                    this.getFuBaoClassifyIdList();                               
                }
            },    
        /**
         * 根据渠道动态插入百度统计代码
         */
        loadBaiduScript(){
            const src = env.page.find(item=>window.location.href.includes(item.name)).src;
            let script = document.createElement('script');
            let body = document.getElementsByTagName('body')[0];
            script.type = 'text/javascript';
            script.text = `var _hmt = _hmt || [];
                (function() {
                var hm = document.createElement("script");
                hm.src = '${src}';
                var s = document.getElementsByTagName("script")[0]; 
                s.parentNode.insertBefore(hm, s);
                })();`
            body.appendChild(script);  
        },                              
        /**
        * APP登录
        */
        loginEventByApp(){
            document.removeEventListener('visibilitychange',this.visibilitychangeEvent);
            if(this.isIos){
                // try{
                document.addEventListener('visibilitychange',this.visibilitychangeEvent);
                window.webkit.messageHandlers.iOSAppMethodName.postMessage({
                    describe:'',
                    method:'loginWithoutThrid',
                    params:{
                    channelId:this.channelId,
                    activityName:this.activityName
                    }
                }) 
                // }catch(err){
                // this.dialogVisible = true
                // this.loginshow = true
                // }
            }else{
                // if(window.android){
                if(window.android.notify){
                    document.addEventListener('visibilitychange',this.visibilitychangeEvent);
                    var message = JSON.stringify({
                    describe:'',
                    method:'loginWithoutThrid',
                    params:{
                        channelId:this.channelId,
                        activityName:this.activityName
                    }
                    })
                    window.android.notify(message);
                }
                // }else{
                // this.dialogVisible = true
                // this.loginshow = true
                // }
            }
        }, 
        //zaiApp内返回App
        goToAppHomePage(){
            // document.removeEventListener('visibilitychange',this.visibilitychangeEvent);
            if(this.isIos){
                // try{
                // document.addEventListener('visibilitychange',this.visibilitychangeEvent);
                window.webkit.messageHandlers.iOSAppMethodName.postMessage({
                    describe:'',
                    method:'closeWebView',
                    params:{
                    // channelId:this.channelId,
                    // activityName:this.activityName
                    }
                }) 
                // }catch(err){
                // this.dialogVisible = true
                // this.loginshow = true
                // }
            }else{
                // if(window.android){
                if(window.android.notify){
                    document.addEventListener('visibilitychange',this.visibilitychangeEvent);
                    var message = JSON.stringify({
                    describe:'',
                    method:'closeWebView',
                    params:{
                        // channelId:this.channelId,
                        // activityName:this.activityName
                    }
                    })
                    window.android.notify(message);
                }
                // }else{
                // this.dialogVisible = true
                // this.loginshow = true
                // }
            }            
        },
        shareEvent(){
            if(this.inApp||this.inOther){
                if(this.notShareClick){
                    this.dialogVisbile = true;
                }
            }else{
                const clipboard = this.clipboard;
                clipboard.on('success',()=>{
                    this.$toast('链接复制成功，快去粘贴给好友吧')
                });
                clipboard.on('error',(e)=>{
                    this.dialogVisbile = true;
                    this.support = false;
                })
            }
            // this.getFuBaoSignAndShareEven(2);
            // this.$emit('clickEvent')
        },        
        //关闭
        closeShare(){
            this.boxshowFour = !this.boxshowFour;
            setTimeout(()=>{
                this.boxshowThree = !this.boxshowThree;
            },500);         
        },
        /**
         * 规则
         */
        ruleEvent(){
            this.ruleShow = true;
        },        
        /*
            加入福宝或者取消
        */
       myCourseBoxEven(type){
           if(type){
               if(this.actionsCourseItem){
                    this.subBoIcons = false;  
                    this.onloadType = false; 
                    this.boxshowTwo = !this.boxshowTwo;
                    setTimeout(()=>{
                        this.boxshowOne = !this.boxshowOne;
                    },500);   
               }else{
                   this.$toast('选中课程后加入福包')
               }            
           }          
           if(!type){
                this.returnTableDatil();   
           }
       },
        startEvent(){
            if(this.inApp){
                if(this.userInfo.userId){
                    if(!this.userInfo.cellphone){
                        this.bindPhoneEventByApp();
                    }
                }else{
                    this.loginEventByApp();
                }
            }else{
                if(this.userInfo.userId){
                    this.dialogVisible = false;
                }else{
                    this.dialogVisible = true
                }
            }
        },       
       //提交包福宝
        async fubaoSubmit(type){   
            if(type){
                this.pointButton(7);
            }else{
                this.pointButton(10);
            }    
            this.startEvent();  
            if(!this.dialogVisible&&Number(this.userInfo.userId)>0){
                if(type){
                    this.onloadType = true;
                    this.boxshowOne = !this.boxshowOne;
                    setTimeout(()=>{
                        this.boxshowTwo = !this.boxshowTwo;
                    },100);
                    this.onFubaoLoad();            
                }else{
                    this.setBaoFubaoeven();
                }
            }
        },        
       //数据还原
       returnTableDatil(){
            this.onloadType = false;
            this.pageNo=1;                   
            this.actionsType = -1;
            this.actionsTypeItem = {};
            this.actionsCourseItem = '';
            this.actionsCourse =-1;
            this.tableCourseList=[];
            this.loading = false;
            this.finished = false;     
            this.boxshowTwo = !this.boxshowTwo;
            setTimeout(()=>{
                this.boxshowOne = !this.boxshowOne;
            },500);            
       },
       /**
        * 包福包
        */
        async setBaoFubaoeven(){
            if(!this.userInfo.userId){
                if(this.inApp){
                    this.userInfo = {
                        userId:this.userInfoisApp.userid,
                        token:this.userInfoisApp.accessToken
                    }  
                }else{
                    let uInfo = this.$getCookie('uInfo');
                    if(uInfo){
                        this.userInfo = {
                            userId:JSON.parse(uInfo).userid,
                            token:JSON.parse(uInfo).accessToken,
                            cellphone:JSON.parse(uInfo).cellphone
                        }
                    }
                }  
            }            
            const query = {
                userId:this.userInfo.userId,
                courseId:this.actionsCourseItem.id
            }
            const res = await this.$http.post(this.$server.getFuBaoBaoFubao,query,{userId:this.userInfo.userId,token:this.userInfo.token})
            if(res.data.status==200){
                this.subBoIcons = true;   
                this.onloadType = false;
                this.pageNo=1;                   
                this.actionsType = -1;
                this.actionsTypeItem = {};
                this.actionsCourseItem = '';
                this.actionsCourse =-1;
                this.tableCourseList=[];
                this.loading = false;
                this.finished = false;   
                this.fubaoResultBox=true;
            }else{
                this.$toast(res.data.message)
            }
        },         
        /**
         * 成人少儿切换
         */
        tagsChanges(num,type){
            if(this.personOrChildType==type){
                this.personOrChildType = type;
                this.personOrChild = !this.personOrChild;
                if(this.personOrChild){
                    this.pointButton(8);
                }else{
                    this.pointButton(9);
                }
                this.onloadType = true;
                this.pageNo=1;                   
                this.actionsType = -1;
                this.actionsTypeItem = {};
                this.tableCourseList=[];
                this.loading = false;
                this.finished = false;   
                setTimeout(()=>{
                    this.onFubaoLoad(); 
                },200);
            }        
        },                
        //点击事件-ljm
        //getFuBaoClassifyId 获取活动分类id
        async getFuBaoClassifyIdList(){
            if(!this.userInfo.userId){
                if(this.inApp){
                    this.userInfo = {
                        userId:this.userInfoisApp.userid,
                        token:this.userInfoisApp.accessToken
                    }  
                }else{
                    let uInfo = this.$getCookie('uInfo');
                    if(uInfo){
                        this.userInfo = {
                            userId:JSON.parse(uInfo).userid,
                            token:JSON.parse(uInfo).accessToken,
                            cellphone:JSON.parse(uInfo).cellphone
                        }
                    }
                }  
            }            
            this.adultTypeList = [];
            this.childTypeList = [];
            const res = await this.$http.post(this.$server.getFuBaoClassifyId,{userId:this.userInfo.userId,token:this.userInfo.token});
            if(res.data.status==200){
                this.adultTypeList = res.data.content.adult;
                this.childTypeList = res.data.content.child;
            }           
        },     
        tagEven(type){
            if(type==1){
                this.pointButton(18);
            }else if(type==2){
                this.pointButton(1); 
            }else if(type==3){
                this.pointButton(11);
            }else if(type==5){
                this.ruleShow=true;
                return;
            }
            if(type==7){
                this.dialogVisible = false;
                clearInterval(this.codeTimer);
                this.codeText = '获取验证码'    
                this.cellphone='';            
                return;
            }
            this.startEvent();
            if(!this.dialogVisible&&Number(this.userInfo.userId)>0){
                switch (type) {
                    case 1:
                        this.$router.push({path:'/recordfubao'})
                        break;
                    case 2:
                            this.boxshowThree = !this.boxshowThree;
                            setTimeout(()=>{
                                this.boxshowFour = !this.boxshowFour;
                                this.copyUrlInfo();
                            },100);                         
                        break;
                    case 3:
                            this.$router.push({path:'/myfubao'});
                        break;
                    case 4:
                        this.fubaoResultBox=false;
                        break;
                    case 5:
                        
                        break;
                    case 6:
                        this.getFuBaoSignAndShareEven(4);
                        break;
                    default:
                        break;
                }
            }

        },             
        //获取数据
        //切换事件-ljm
        selects(index,num,data){
            switch (num) {
                case 1:
                    this.pageNo=1;                   
                    this.actionsType = index;
                    this.actionsTypeItem = data;
                    this.tableCourseList=[];
                    this.loading = false;
                    this.finished = false;                    
                    this.onFubaoLoad();
                    break;
                case 2:
                    // if(this.actionsCourse.indexOf(index)==-1){
                    //     this.actionsCourse.push(index);
                    // }else{
                    //     let indexs = this.actionsCourse.indexOf(index);
                    //     this.actionsCourse.splice(indexs,1);
                    // }
                    this.actionsCourse=index;
                    this.actionsCourseItem = data;
                    break;
                default:
                    break;
            }
            
        },
        /**
         * 渠道打点
         */
        async pointPage(channelType){
            const query = {
                channelType:channelType,
                page:1
            }
            const res = await this.$http.post(this.$server.getFuBaoPointPage,query)
        },
        /**
         * 访问次数打点(登录)
         */
        async pointVisit(channelType,userId){
            const query = {
                channelType:channelType,
                userId:userId
            }
            const res = await this.$http.post(this.$server.getFuBaoPointVisit,query,{userId:this.userInfo.userId,token:this.userInfo.token})
        },
        /**
         * button打点
         */
        async pointButton(type,callback){
            const query = {
                type:type
            }
            if(type==20){
                query.courseId = this.courseId
            }
            const res = await this.$http.post(this.$server.getFuBaoPointButton,query)
            if(res.data.status==200){
                if(callback && typeof callback==='function'){
                callback()
                }
            }
        },
        /**
         * 发短信
         */
        async sendSms(){
            if(this.codeText!='获取验证码') return false;
            if(this.cellphone.length!=11){
                this.$toast('请输入正确的手机号')
                return;
            }
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            const query = {
                cellphone:this.cellphone,
                smsType:1,
                tokenType:2
            }
            const res = await this.$http.post(this.$server.sendSms,query);
            this.$toast.clear()
            if(res.data.status==200){
                let time = 60;
                this.codeText = time +'s'
                this.codeTimer = setInterval(()=>{
                    time--;
                    this.codeText = time +'s'
                    if(time==0){
                        clearInterval(this.codeTimer);
                        this.codeText = '获取验证码'
                    }
                },1000) 
            }
        },        
        /**
         *  登录
         */
        async loginEvent(){
            if(this.cellphone.length!=11){
                this.$toast('请输入正确的手机号');
                return;
            }
            if(this.code.length!=6){
                this.$toast('无效的验证码')
                return;
            }
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            this.httpFlag = true;
            let query = {
                cellphone:this.cellphone,
                tokenType:2,
                code:this.code,
                registerSource:3,
                requestType:1,
                activityName:this.activityName,
            }
            // let channelId = tools.getQueryString('channelId');
            if(this.channelId){
                query.channelId = this.channelId;
            }
            let activityShareUserId = tools.getQueryString('activityShareUserId')
            if(activityShareUserId){
                query.activityShareUserId = Number(activityShareUserId);
            }
            this.actionLogin = false;
            const res = await this.$http.post(this.$server.login,query);
            this.$toast.clear()
            this.httpFlag = false;
            if(res.data.status==200){
                let userInfo = {
                    accessToken: res.data.content.accessToken,
                    nickname: res.data.content.nickname,
                    avatar: res.data.content.avatar,
                    userid: res.data.content.id,
                    cellphone:res.data.content.cellphone,
                }
                this.setUserInfo(userInfo);
                this.$setCookie("uInfo", JSON.stringify(userInfo));
                this.getGoldCoin();
                this.getwhetherGoldInfo();
                this.getFuBaoClassifyIdList();
                this.loginStatus = 1;
            }else{
                this.$toast(res.data.message)
            }
        },      
        /**
         * 获取我的金币
         */        
        async getGoldCoin(){
            if(!this.userInfo.userId){
                if(this.inApp){
                    this.userInfo = {
                        userId:this.userInfoisApp.userid,
                        token:this.userInfoisApp.accessToken
                    }  
                }else{
                    let uInfo = this.$getCookie('uInfo');
                    if(uInfo){
                        this.userInfo = {
                            userId:JSON.parse(uInfo).userid,
                            token:JSON.parse(uInfo).accessToken,
                            cellphone:JSON.parse(uInfo).cellphone
                        }
                    }
                }  
            }           
            let query = {
                userId:this.userInfo.userId
            };
            const res = await this.$http.post(this.$server.getFuBaoMyGold,query,{userId:this.userInfo.userId,token:this.userInfo.token});
            if(res.data.status==200){
                this.homeData.meGold = res.data.content;
            }            
        },
        /**
         * 是否当天已领过
         */            
        async getwhetherGoldInfo(){
                if(!this.userInfo.userId){
                    if(this.inApp){
                        this.userInfo = {
                            userId:this.userInfoisApp.userid,
                            token:this.userInfoisApp.accessToken
                        }  
                    }else{
                        let uInfo = this.$getCookie('uInfo');
                        if(uInfo){
                            this.userInfo = {
                                userId:JSON.parse(uInfo).userid,
                                token:JSON.parse(uInfo).accessToken,
                                cellphone:JSON.parse(uInfo).cellphone
                            }
                        }
                    }  
                }           
                let query = {
                    userId:this.userInfo.userId
                };
                const res = await this.$http.post(this.$server.getFuIsSignAndShare,query,{userId:this.userInfo.userId,token:this.userInfo.token});
                if(res.data.status==200){
                    if(res.data.content.isReceiveToday!=1){
                        this.homeData.remainGold = 200;
                    }else{
                        this.homeData.remainGold = 0;
                    }
                    this.homeData.signIn=res.data.content.isSign;
                    this.homeData.shares=res.data.content.isShare;
                    this.homeData.buyCourses=res.data.content.isBuy;
                }
        },        
        //关闭登录框
        dialogEvent(){
            // if(this.show3){
            //     this.show3 = false;
                // this.dialogVisible = false;
                // this.isReceive = true;
            // }
        },
        //点击添加金币
        setFuBaoInfoEven(type1,type2){
            switch (type1) {
                case 1:
                    if(type2!=1){
                        this.pointButton(2);
                        this.getFuBaoSignAndShareEven(type1);
                    }                     
                    break;
                case 2:
                    //去完成
                    if(!this.isShareIndex){
                        this.pointButton(3);
                        this.isShareIndex = true;                        
                        // if(this.inApp||this.inOther){
                            // this.dialogVisbile=true;     
                            this.shareEvent();
                        // }
                    }else{
                        //可以领取
                        if(type2+""=="0"){
                            this.pointButton(4);
                            this.getFuBaoSignAndShareEven(type1);
                        }
                    } 
                    break;
                case 3:
                    //去完成
                    if(type2==2){
                        this.pointButton(5);
                        if(this.inApp){
                            this.goToAppHomePage()
                        }else{
                            if(this.$server.env=='beta'){
                                window.location.href='https://scm.youfushuyuan.com';
                            }else{
                                window.location.href='https://xgxm.xueguoxue.com';
                            }
                        }                        
                    }   
                    //可以领取
                    if(type2+""=="0"){
                        this.pointButton(6);
                        this.getFuBaoSignAndShareEven(type1);
                    }                    
                    break;
                default:
                    break;
            }
        },
        /**
         * 1签到，2分享，3购买，4每日获得
         */            
        async getFuBaoSignAndShareEven(type){
            if(!this.userInfo.userId){
                if(this.inApp){
                    this.userInfo = {
                        userId:this.userInfoisApp.userid,
                        token:this.userInfoisApp.accessToken
                    }  
                }else{
                    let uInfo = this.$getCookie('uInfo');
                    if(uInfo){
                        this.userInfo = {
                            userId:JSON.parse(uInfo).userid,
                            token:JSON.parse(uInfo).accessToken,
                            cellphone:JSON.parse(uInfo).cellphone
                        }
                    }
                }  
            }           
            let query = {
                userId:this.userInfo.userId,
                type:type
            };
            const res = await this.$http.post(this.$server.getFuBaoSignAndShare,query,{userId:this.userInfo.userId,token:this.userInfo.token});
            if(res.data.status==200){
                this.getwhetherGoldInfo();
                this.getGoldCoin();
                this.$refs.audio.play();
                this['show'+type] = !this['show'+type];
                setTimeout(()=>{
                    this['show'+type] = !this['show'+type];
                },1500);
            }
        }, 
        async onFubaoLoad(){
            if(this.onloadType){           
                let query = {
                    mtype:this.personOrChild?1:2,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    classId:this.actionsType!=-1?this.actionsTypeItem.id:0
                };
                this.loading = true;
                // {userId:this.userInfo.userId,token:this.userInfo.token}
                const res = await this.$http.post(this.$server.getSearchCourseList,query);
                if(res.data.status==200){
                    if(res.data.content.list.length>0){
                        this.tableCourseList = [...this.tableCourseList,...res.data.content.list];               
                        this.pageNo++;
                        this.loading = false;
                        this.finished = res.data.content.isLastPage;
                    }
                }                
            }
        }, 
        /**
        * 分享
        */
        async share(){
            const message = {
                describe:'导航栏显示分享按钮',
                method:"share",
                params:{
                title:'新年福包',
                desc:'平安福、吉祥福、好运福 福福有礼',
                link:this.link||window.location.href,
                imgUrl:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/nChunjie_share.png'    
                }
            }
            if(!window.pointShareButton){
                window.pointShareButton = ()=>{
                //APP分享时渠道打点
                    this.pointPage(this.channelId);
                }
            }
            const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
            if(isIos){
                try{
                window.webkit.messageHandlers.iOSAppMethodName.postMessage(message)
                }catch(err){ }
            }else{
                if(window.android){
                if(window.android.notify){
                    window.android.notify(JSON.stringify(message))
                }
                }    
            }
            const url = encodeURIComponent(window.location.href.split('#')[0]);
            const res = await this.$http.get(`${this.$server.getConfig}?url=${url}`);
            if(res.data.status == 200){
                let data = res.data.content;
                const {title,desc,link,imgUrl} = message.params; 
                wx.config({
                debug:false,
                appId:data['appId'],
                timestamp:data['timeStamp'],
                nonceStr:data['nonceStr'],
                signature:data['signature'],
                jsApiList: [
                    'checkJsApi',
                    'updateAppMessageShareData',
                    'updateTimelineShareData',
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline',
                    'onMenuShareQQ'
                ]
                }); 
                wx.ready(()=>{
                wx.onMenuShareAppMessage({
                    title: title, 
                    desc: desc,
                    link: link,
                    imgUrl: imgUrl,
                    type: '', 
                    dataUrl: '',
                    success:()=>{
                    
                    }
                });
                wx.onMenuShareTimeline({
                    title: title,
                    link: link,
                    imgUrl: imgUrl,
                    success: ()=>{
                    
                    },
                })
                wx.onMenuShareQQ({
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: imgUrl,
                    success:()=>{
                    
                    }
                })
                })
            }
        }                    
    }
}
</script>

<style>
.courselistBox .van-list .van-list__finished-text{
    font-size: 0.24rem;
    text-align: center;
    padding: 0 0 0.2rem 0;
    color: #fff;
    overflow: hidden;
    width: 100%;
}
.courselistBox .van-list .van-list__loading .van-loading{
    text-align: center;
}
.courselistBox .van-list .van-list__loading .van-loading .van-loading__text{
    color: #fff !important;
    font-size: 0.3rem !important;
}
.dotAnimation{
        width: 3.1rem;
        height: 1.38rem;  
        top: 11.07rem;
        right: 2.16rem;                 
        animation:mymove 4s infinite;
        animation-direction:alternate;/*轮流反向播放动画。*/
        animation-timing-function: ease-in-out; /*动画的速度曲线*/
    }
    @keyframes mymove{
        0%{
            transform: scale(0.8);  /*开始为原始大小*/
        }
        25%{
            transform: scale(1); /*放大1.1倍*/
        }
        50%{
            transform: scale(0.8);
        }
        75%{
            transform: scale(1);
        }
        100%{
            transform: scale(0.8);
        }        
    }
    /* @-webkit-keyframes mymove{
        0%{
            transform: scale(0.8);
        }
        25%{
            transform: scale(1);
        }
        50%{
            transform: scale(0.8);
        }
        75%{
            transform: scale(1);
        }
    }     */
</style>
<style lang="scss" scoped>
    .index-page{     
        .bgd-box{
            position: relative;
            .fubao_list{
                position: absolute;
                z-index: 2;
                height: 1rem;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                top: 0;
                left: 0;
                right: 0;
                padding:0 0.26rem 0 0.38rem;
                div{
                    font-size: 0.26rem;
                    color:#fff;
                    font-family:"SimHei";
                    padding:0.1rem 0.18rem;
                    border-radius: 0.54rem;
                    background:rgba(255, 255, 255, 0.7);
                    color: #333333;
                    font-family: 'PingFangSC-Regular';
                }
            }
            // padding-bottom:1.36rem;
            .bgd{
                display: block;
            }
            .bag1{
                 position: absolute;
                 z-index: 1;                
            }
            .bag2,.Icon1,.Icon2,.Icon3,.but,.Icon4{
                position: absolute;
                z-index: 2;
            }
            .Icon4{
                width: 1.79rem;
                height: 0.42rem;
                line-height: 0.42rem;
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_time2.png') no-repeat 50% 50% /cover;
                top: 2.7rem;
                left: 1.5rem;          
                text-align: center;    
                font-size: 0.18rem;  
                color: #333333;
                font-family: 'PingFangSC-Regular';
            }
            .bag1{
                width: 5.8rem;
                height: 8.8rem;
                top: 2.25rem;
                right: 0.75rem;
            }
            .Icon1,.Icon2{
                width: 2.36rem;
                height: 1.53rem;
                div{
                    position: absolute;
                    font-size: 0.3rem;
                    bottom: 0.28rem;
                    width: 1.3rem;
                    left: 0.8rem;
                    text-align: center;
                    font-family: "SimHei";
                    font-weight: 700;
                }
            }
            .Icon3{
                width: 2.23rem;
                height: 1.04rem;
            }
            .but{
                width: 3.1rem;
                height: 1.38rem;
                top: 11.07rem;
                right: 2.16rem;
                img{
                    width: 100%;
                    height: 100%;
                }
            }              
            .Icon1{
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjieIcon1.png') no-repeat center;
                background-size: cover;
                top: 0.77rem;
                left: 0.38rem;
            }
            .Icon2{
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjieIcon2.png') no-repeat center;
                background-size: cover;
                top: 2.73rem;
                left: 0.38rem;                
            }
            .Icon3{
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjieIcon3.png') no-repeat center;
                background-size: cover;   
                top: 1.17rem;
                right: 0.26rem;                            
            }
            .bag2{
                width: 1.33rem;
                height: 1.36rem;
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_myfubao.gif') no-repeat center;
                background-size: cover; 
                top: 2.66rem;
                right: 0.26rem;    
            }
        }
        .dialog{
            position: fixed;
            top:0;
            left: 0;
            background: rgba(0,0,0,0.7);
            width: 100%;
            height: 100%;
            z-index: 4;
            .hongbao{
                width: 6.48rem;
                height: 5.6rem;
                top:50%;
                left: 0.5rem;
                margin-top:-3.51rem;
                position: absolute;
                animation: enlarge 0.3s linear 0.3s both;
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjieLogin.png') no-repeat 50% 50% /cover;
                .tips{
                    color:#fff;
                    font-size: 0.4rem;
                    line-height: 0.34rem;
                    text-align: center;
                    margin:0.97rem auto 0;
                }    
                img{
                    width: 0.74rem;
                    height: 0.74rem;
                    display: block;
                    margin: .6rem auto 0;                         
                }                       
                .form{
                    position: relative;
                    padding: 0.28rem 0.3rem 0.37rem;                        
                    .user{
                        width: 5.1rem;
                    }
                    .item1{
                        padding: 0.11rem 0.33rem;
                        background: #E5E5E5;
                        border-radius: 0.3rem;
                        border: 1px solid #E5E5E5;
                        color:#666;
                        font-size: 0;
                        margin-left: 0.475rem;
                        label{
                            display: inline-block;
                            vertical-align: middle;
                            font-size: 0.24rem;
                            height: 0.4rem;
                            line-height: 0.4rem;
                            padding-right:0.1rem;
                            position: relative;
                            color: #323333;
                            // &::after{
                            //     content:'';
                            //     position: absolute;
                            //     height: 0.26rem;
                            //     width: 1px;
                            //     background: #666;
                            //     right: 0;
                            //     top:0.07rem;
                            // }
                        }
                        input{
                            padding-left:0.1rem;
                            display: inline-block;
                            vertical-align: middle;
                            border:0;
                            font-size: 0.26rem;
                            height: 0.6rem;
                            line-height: 0.6rem;
                            outline: none;
                            background: none;
                            width: 2.5rem;
                        }
                    }
                    .item2{
                        margin: 0.21rem 0 0 0.475rem;
                        font-size: 0;
                        &.code{
                            width: 5.1rem;
                            .code_val{
                                padding: 0.11rem 0.33rem;
                                width: 3.48rem;
                                margin-bottom: 0;
                                background: #E5E5E5;
                                border-radius: 0.3rem;  
                                border: 1px solid #E5E5E5;
                                color:#666;                             
                                input{
                                    width: 1.7rem;
                                }                                
                            }
                        }
                        label{
                            display: inline-block;
                            vertical-align: middle;
                            font-size: 0.24rem;
                            height: 0.4rem;
                            line-height: 0.4rem;
                            padding-right:0.1rem;
                            position: relative;
                            color: #323333;
                        }
                        input{
                            padding-left:0.1rem;
                            display: inline-block;
                            vertical-align: middle;
                            border:0;
                            font-size: 0.26rem;
                            height: 0.6rem;
                            line-height: 0.6rem;
                            outline: none;
                            background: none;
                            width: 2.5rem;
                        }
                    }                    
                    .code-btn{
                        width: 1.32rem;
                        font-size: 0.2rem;
                        text-align: center;
                        line-height: 0.62rem;
                        position: absolute;
                        right: 0.72rem;
                        bottom:0.5rem;
                        color:#fff;
                        text-decoration:underline;
                        &.disabled{
                            // background:rgba(0, 0, 0, 0.3);
                            // border-color:#a7a7a7;
                        }
                    }
                }
                .btn{
                    width: 2.44rem;
                    height: 1.13rem;
                    background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_login.png')no-repeat 50% 50% / cover;
                    margin:0 auto;
                    &:active{
                        transform: scale(0.95);
                    }
                }                                     
            }            
        }      
        .fubaoMaskBoxOne{
            background: rgba(0, 0, 0, 0.7);
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            z-index: 5;
            .courseBox{
                padding: 2.39rem 0rem 0rem 0rem;
                height:11.54rem;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_course_bag.png')no-repeat 50% 50% / cover;
                overflow: hidden;         
                .adultChildrentabs{
                    margin: 0 1rem 0rem 1.19rem;
                    background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_course_no.png')no-repeat 50% 50% / cover;
                    width: 5.312rem;
                    height: 1.052rem;
                    position: relative;
                    .lefts{
                        left:0;
                    }
                    .rights{
                        right: 0;
                    }
                    .selectType1{
                        position: absolute;
                        background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_course_ok.png')no-repeat 50% 50% / cover;
                        width: 2.806rem;
                        height: 0.952rem;
                        text-align: center;
                        color: #fff;
                        font-size: 0.4rem;
                        line-height: 0.952rem;
                        top: 0.03rem;
                    }
                    .selectType2{
                        position: absolute;
                        width: 2.5rem;
                        height: 0.952rem;
                        text-align: center;
                        color: #fff;
                        font-size: 0.4rem;
                        line-height: 0.952rem;
                    }
                }
                .courseType{
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: flex-start;
                    margin-bottom: 0.41rem;
                    div{
                        font-size: 0.28rem;
                        width: 0.92rem;
                        height: 0.54rem;
                        text-align: center;
                        line-height: 0.54rem;
                    }
                    .styleBag1{
                        background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_type_yes.png')no-repeat 50% 50% / cover;
                        box-shadow:0px 0px 0.3rem 0px #999;
                        color:#700113;
                    }
                    .styleBag2{
                        background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_type_no.png')no-repeat 50% 50% / cover;
                        color: #666666;
                    }
                } 
                .courselistBox{
                    overflow: auto;
                    zoom: 1;
                    height: 5.94rem;
                    .van-list{
                        >div{
                            width: 3.37rem;
                            height: 2.67rem;
                            float: left;
                            margin-bottom: 0.3rem;
                            border-radius: 0.2rem;
                            .courseInfo{
                                    width: 3.21rem;
                                    height: 2.51rem;
                                    background: #fff;
                                    border-radius: 0.2rem;
                                    overflow: hidden;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: flex-start;
                                    align-items: center;     
                                    img{
                                        width: 100%;
                                        height: 1.719rem;
                                        display: block;
                                    }                   
                                    p{
                                        color: #333;
                                        font-size: 0.24rem;
                                        width: 100%;
                                        padding: 0.12rem 0.16rem;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;  
                                    }
                                }
                            }
                        >div:nth-child(odd){
                                margin-left: 0.3rem;
                            }
                        >div:nth-child(even){
                            margin-left: 0.18rem;
                        }
                        .styleBag3{
                            background: #FFF000;
                            padding: 0.08rem;
                        }
                        .styleBag4{
                            background: #D30010;
                            padding: 0.08rem;
                        }                        
                    }

                } 
                .courseBut{
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    img{
                        width: 2.446rem;
                        display: block;
                    }
                }
            }
        }
        .fubaoMaskBox{
            background: rgba(0, 0, 0, 0.7);
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            z-index: 5;
            .fubaoBox{
                padding: 0.5rem 0 0.1rem 0;
                height:8.54rem;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjiecashBox.png')no-repeat 50% 50% / cover;
                overflow: hidden;
                .fubaoTitle{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    padding:0 0.33rem 0 0.8rem;
                    div{
                        font-size: 0.5rem;
                        color: #004088;
                        font-family: 'PingFangSC-Medium';
                        font-weight: 500;
                    }
                    img{
                        width: 0.48rem;
                        height: 0.48rem;
                    }
                }
                .fubaoUlBox{
                    overflow: auto;
                    height: 7.01rem;
                    padding: 0.1rem 0.75rem 0;
                    .fubao_li{
                        width: 6rem;
                        height: 1.96rem;
                        background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjiecashLi.png')no-repeat 50% 50% / cover; 
                        margin-top: 0.29rem;
                        padding: 0.5rem 0.4rem;
                        position: relative;
                        .box{
                            display: flex;
                            justify-content: space-between;
                            flex-direction: row;
                            align-items: center;
                            .lefts{
                                font-family:"PingFangSC-Medium";
                                p:nth-child(1){
                                    font-size: 0.34rem;
                                    color: #AA0000;
                                    font-weight: 500;
                                    line-height: 1;
                                }
                                p:nth-child(2){
                                    font-size: 0.26rem;
                                    margin-top: 0.1rem;
                                    color: #666;
                                }
                            }
                            img{
                            width: 1.4rem;
                            height: 0.74rem;
                                display: block;
                            }
                            
                        }
                        .tips{
                            font-size: 0.24rem;
                            color: #CA0000;
                            text-align: center;
                            width: 1.4rem;
                            position: absolute;
                            right: 0.4rem;
                            bottom: 0.2rem;
                            font-family: 'PingFangSC-Medium';
                        }                       
                    }
                }
            }
            //给过渡的name加样式
            
            .myFuBaoBoxIndex-leave-active,.myFuBaoBoxIndex-enter-active{
                transition: all 0.1s linear; 
            }
            .myFuBaoBoxIndex-leave-active,.myFuBaoBoxIndex-enter{
                height:0rem !important;
            }
            .myFuBaoBoxIndex-leave,.myFuBaoBoxIndex-enter-active{
                height: 8.48rem;
            }                 
        }
        .sunBoxBagLayer{
            position: fixed;
            top:0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.7);
            z-index: 5;
            .sunBoxBag{
                 margin-top:2.3rem;
                 height: 10.24rem;
                 position: relative;
                 &.sunBoxBagIsYes{
                    background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_sun_bag.png')no-repeat 50% 50% / cover; 
                 }
                .fudaiBox{
                    width: 6.08rem;
                    height: 7.24rem;
                    margin: 1.62rem 0 0 0.82rem;
                    position:absolute;
                    .contents{
                        width: 2.82rem;
                        position: absolute;
                        left: 1.63rem;
                        top: 3.66rem;
                        div{
                            font-size: 0.44rem;
                            text-align: center;
                            color: #790403;
                            font-family: 'PingFangSC-Medium';
                            font-weight: 500;
                        }
                        p{
                            font-size: 0.3rem;
                            text-align: center;
                            font-family: 'PingFangSC-Medium';
                            color: #666;
                        }
                    }
                    img{
                        width: 0.74rem;
                        height: 0.74rem;
                        position: absolute;
                        bottom: -0.74rem;
                        left:2.67rem;
                    }
                }
                .fudai1{
                    background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_bag.png')no-repeat 50% 50% / cover;
                }
                .fudai2{
                    background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_burst.png')no-repeat 50% 50% / cover;
                }
            }
        }
        .share-wrap{
            .share-btn{
                position: absolute;
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/share_btn.png')no-repeat 50% 50% / cover;
                width: 1.3rem;
                height: 0.71rem;
                right: -0.1rem;
                top:-0.6rem;
            }
            .share-dialog{
                position: fixed;
                top:50%;
                left: 50%;
                transform: translate(-50%,-50%);
                width: 100%;
                max-width: 750px;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 99;
                .share-arrow{
                    position: fixed;
                    width: 1.2rem;
                    height: 1.2rem;
                    right: 0.1rem;
                    // top:0.3rem;
                    // transform: rotateX(-180deg);
                    top:0.3rem;
                    transform: rotate(-90deg);
                    background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/arrow.png')no-repeat 50% 50% /cover; 
                }
                .tip1{
                    position: fixed;
                    right: 0.1rem;
                    top:1.6rem;
                    font-size: 0.32rem;
                    color:#fff;
                }   
                .copy-box{
                    position: fixed;
                    top:50%;
                    left: 50%;
                    transform:translate(-50%,-50%);
                    width: 80%;
                    height: 1.8rem;
                    background: #fff;
                    border-radius: 0.1rem;
                    .box{
                        position: absolute;
                        top:50%;
                        left:50%;
                        transform:translate(-50%,-50%);
                        width: 100%;
                    }
                    .link{
                        font-size: 0.28rem;
                        color:#666;
                        text-align: center;
                        line-height: 0.3rem;
                        width: 90%;
                        margin:0 auto;
                        word-break:break-all;
                    }   
                    .tips2{
                        font-size: 0.24rem;
                        color:#999;
                        text-align: center;
                        width: 100%;
                        margin-top:0.2rem;
                    }
                }      
            }
            .fade-enter-active, .fade-leave-active {
                transition: opacity .5s;
            }
            .fade-enter, .fade-leave-to {
                opacity: 0;
            }
        }        
        //给过渡的name加样式
        
        .myCourseBox-leave-active,.myCourseBox-enter-active{
            transition: all 0.2s linear; 
        }
        .myCourseBox-leave-active,.myCourseBox-enter{
            height:0rem !important;
        }
        .myCourseBox-leave,.myCourseBox-enter-active{
            height: 8.48rem;
        }         
        @keyframes enlarge {
            from{
                transform: scale(0);
            }
            to{
                transform: scale(1);
            }
        } 
    #copy-input{
        opacity: 0;
        position: fixed;
        top:-1000px;
    }         
    }   
</style>