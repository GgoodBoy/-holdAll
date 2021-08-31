<template>
    <div class="index" :class="{overflowScroll:!overflowtype,overflowHidden:overflowtype,}">
        <!-- <div @click="loginShow">弹框</div>   -->
        <div class="header">
            <img class="imgHeader" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_bg.png"/>
            <div class='iconCss'>
                <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/logoIcon.png"/>
                <div @click='rulesEven'>活动规则</div>
            </div>
            <div class="scollBox">
                <vueSeamlessScroll :listData="listData"/>
            </div>
        </div>
        <div class="packBox">
            <div class='hbBoxOne'>
                <img class="img_hb1" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_box2.png"/>
                <img class="img_hb2" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_jl.png" @click="packedList"/>
                <div class='imgListBox'>
                    <div class='imgBox' v-for="(item,index) in packlist" :key="index">
                        <img :src="item.type?item.img2:item.img1"/>
                        <div class="timeBot" :style='{color:item.type?"#fff":"#C61915"}'>{{packlist[index].timeVale}}</div>
                        <div class="timeTop" :style='{color:item.type?"#fff":"#C61915"}'>{{packlist[index].headerTime}}</div>
                    </div>
                </div>   
                <div class="canyu" @click="packetSelect"></div>   
                <img class="handIcon handAnimat" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/handIcon.png"/>      
            </div>
            <div class='hbBoxTwo'>
                <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_course.png"/>
                <div class='hbList'>
                    <div class='hbListBox' v-for="(item,index) in courseList" :key='index' @click="selectCourse(item)"></div>
                </div>
            </div>
            <div class='hbBoxThree'>
                <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_box.png"/>  
                <img class='img_three1' src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_zd_new.png" @click='goTo(1)'/>
                <img class='img_three2' src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_yq.png" @click='goTo(2)'/>
                <img class="handIcon handAnimat" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/handIcon.png"/>    
            </div>
        </div>
        <Dialogsdm :limitDay='limitDayNum' @closeEven="closeEven"/>
        <Dialogsi @closeEven="closeEven"/>
        <Dialogsrules @closeEven="closeEven"/>
        <Dialogcdns @closeEven="closeEven"/>
        <DialogcTab :packList='packTableList' @closeEven="closeEven"/>
        <DialogTips @closeEven="closeEven"/>
        <Packet :rewardRecordId='rewardRecordId' @closeEven="closeEven"/> 
        <SharedIalog  @closeEven="closeEven"/>
        <login @packUserInfo="setPackUserEven" @closeEven="closeEven"/>    
    </div>
</template>

<script>
function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
function loadScript(src){
        return new Promise((resolve,reject)=>{
            let script = document.createElement('script');
            let body = document.getElementsByTagName('body')[0]
            script.type = 'text/javascript';
            script.src = src;
            if (script.readyState){
                script.onreadystatechange = ()=>{
                    if (script.readyState == "loaded" || script.readyState == "complete"){
                        script.onreadystatechange = null;
                        resolve();
                    }
                };
            } else {
                script.onload = ()=>{
                    resolve();
                };
                script.onerror = () => {
                    body.removeChild(script);
                    reject();
                }
            }
            body.appendChild(script);
        })
}
let dateTime = new Date();
import {onMounted,ref,reactive,provide,inject,computed,getCurrentInstance,watch} from 'vue'
import { Toast } from 'vant';
import Packet from '@/components/Packet.vue'
import login from '@/components/login.vue'
import userTime from '@/hooks/userTime.js'
import vueSeamlessScroll from '@/components/seamlessScroll.vue'
import Dialogsdm from '@/components/dialogDM.vue'
import Dialogsi from '@/components/dialogI.vue'
import Dialogsrules from '@/components/dialogRules.vue'
import Dialogcdns from '@/components/DialogCountdown.vue'
import DialogcTab from '@/components/DialogcTab.vue'
import DialogTips from '@/components/DialogTips.vue'
import SharedIalog from '@/components/ShareDIalog.vue'
import useIsWx from '@/hooks/useIsWx.js'
import useChannel from '@/hooks/useChannel.js'
import { GetCookies,SetCookies } from '@/utils/setCookies' 
export default {
    name: 'index',
    components: {
        Packet,
        login,
        vueSeamlessScroll,
        Dialogsdm,
        Dialogsi,
        Dialogsrules,
        Dialogcdns,
        DialogcTab,
        DialogTips,
        SharedIalog
    },  
    setup(){
        const {proxy} = getCurrentInstance();
        const loginState = ref(false);//是否登录
        const userData =ref({
                accessToken: '',
                nickname: '',
                avatar:'',
                userid:'',
                cellphone:'',
            });//用户信息保存
        const overflowtype =ref(false);//页面滚动样式切换
        const isJoinType = ref(false);//当前活动是否已经参与过
        const rewardRecordId = ref(0);//红包id
        const links = ref('');
        const loadScriptFlag = ref(false);
        const loginDialType = ref(false);//登录框是否显示
        const tableDialType = ref(false);//登录框是否显示
        const cdnDialType = ref(false);//倒计时弹框
        const packDialogType = ref(false);//红包雨弹框
        const learnDiscountDialogType = ref(false);//学习卡和优惠券弹框
        const integralDialogType = ref(false);//积分弹框
        const rulesDialogType = ref(false);//规则弹框
        const tipsDialogType = ref(false);//提示已参加或者已结束弹框
        const dialogVisbile = ref(false);//分享弹框
        const packTableList = ref([]);//红包记录列表数据
        const limitDayNum = ref(-1);
        const userToken = ref('');
        const processType = window.location.href.indexOf('xgxm.xueguoxue.com')>0?ref(true):ref(false);
        const appid = processType.value?ref('wx44e94e1ef84f486e'):ref('wxfd920b9cc0f222c4');
        const listData = reactive([
                {'telphone':'恭喜138****0359获得季度学习卡'}, 
                {'telphone':'恭喜199****9441获得7天学习卡'}, 
                {'telphone':'恭喜139****9678获得10元优惠券'}, 
                {'telphone':'恭喜156****7187获得月度学习卡'}, 
                {'telphone':'恭喜138****7258获得2000积分'}, 
                {'telphone':'恭喜178****8252获得5000积分'}, 
                {'telphone':'恭喜132****3226获得10元优惠券'}, 
                {'telphone':'恭喜131****5027获得7天学习卡'}, 
                {'telphone':'恭喜138****9645获得7天学习卡'}, 
                {'telphone':'恭喜153****9153获得2000积分'}, 
                {'telphone':'恭喜182****4088获得7天学习卡'}, 
                {'telphone':'恭喜152****1187获得10元优惠券'}, 
                {'telphone':'恭喜156****1981获得7天学习卡'}, 
                {'telphone':'恭喜139****4887获得月度学习卡'}, 
                {'telphone':'恭喜138****6999获得7天学习卡'}, 
                {'telphone':'恭喜158****6369获得月度学习卡'}, 
                {'telphone':'恭喜151****0637获得2000积分'}, 
                {'telphone':'恭喜137****0792获得7天学习卡'}, 
                {'telphone':'恭喜183****3227获得10元优惠券'},  
                {'telphone':'恭喜134****8076获得5000积分'}, 
                {'telphone':'恭喜152****7960获得7天学习卡'}, 
                {'telphone':'恭喜185****6727获得月度学习卡'}, 
                {'telphone':'恭喜135****4688获得2000积分'}, 
                {'telphone':'恭喜189****1195获得季度学习卡'}, 
                {'telphone':'恭喜183****7226获得7天学习卡'}      
        ]) 
        const courseList = processType.value?ref([{id:923},{id:907},{id:497},{id:38}]):ref([{id:886},{id:883},{id:882},{id:850}]);
        const {isWechatBrowser} = useIsWx();
        const {navigatorType,isWx,isIos,inApp} = useChannel();
        const {setTimePack} = userTime();
        watch(() =>  userData, (cur) => {
                if(cur.value.accessToken&&userToken.value!=cur.value.accessToken){
                    userToken.value = cur.value.accessToken;
                    let userId ='';
                    if(isWx.value){
                        userId = cur.value.userid;
                    }else{
                        userId = Number(window.sessionStorage.getItem('userId'))==-1?'':window.sessionStorage.getItem('userId');
                    }
                    if(processType.value){                   
                        if(isWx.value){
                            links.value = `https://xgxm.xueguoxue.com/h5/packetactivities/index.html?activityShareUserId=${userId}&channelId==2&activityName=hb`
                        }
                        if(inApp.value){
                            links.value = `https://xgxm.xueguoxue.com/h5/packetactivities/index.html?activityShareUserId=${userId}&channelId==1&activityName=hb`
                        }
                    }else{  
                        if(isWx.value){
                            links.value = `https://scm.youfushuyuan.com/h5/packetactivities/index.html?activityShareUserId=${userId}&channelId==2&activityName=hb`
                        }
                        if(inApp.value){
                            links.value = `https://scm.youfushuyuan.com/h5/packetactivities/index.html?activityShareUserId=${userId}&channelId==1&activityName=hb`
                        }   
                    }
                    share();
                    pagePackEven(userId);
                }
            },
            {
            deep:true // 深度监听的参数
        })
        const loadScripts =()=>{
            if(loadScriptFlag.value){
                return false;
            }
            loadScript('//res.wx.qq.com/open/js/jweixin-1.4.0.js').then(()=>{
                    loadScriptFlag.value = true;
                    share()
                }).catch(()=>{
                    loadScriptFlag.value = false;
                    setTimeout(()=>{
                        loadScripts()
                    },1000)
            });
        }
        //倒计时
        const packSetTimeInter = (type,index,time)=>{
            let newData = new Date(),
                m='00',
                s='00',
                ss = newData.getSeconds(),
                ms = newData.getMinutes(),
                timeNum = 60*time-Number(ms)*60-Number(ss);
            if(type==1){
                let times = setInterval(() => {
                    timeNum--;
                    if(timeNum>0||timeNum==0){
                        m = Math.floor(timeNum/60)>9?Math.floor(timeNum/60)+'':'0'+Math.floor(timeNum/60);
                        s = (timeNum-Number(m)*60)>9?timeNum-Number(m)*60+'':'0'+(timeNum-Number(m)*60);
                        packlist.value[index].timeVale = "剩余:"+m+':'+s;
                    }else{ 
                        packlist.value[index].timeVale = '剩余:00:00';                  
                        clearInterval(times);
                    }
                }, 1000);
            }
        }        
        const packlist = ref([
            {
                img1:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hbNo.png',
                img2:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hbOk.png',
                type:Number(dateTime.getHours())==10&&setTimePack(Number(dateTime.getHours()),20)==1?true:false,
                time:10,
                minTime:20,
                timeVale:Number(dateTime.getHours())==10&&setTimePack(Number(dateTime.getHours()),20)==1?packSetTimeInter(1,0,20):setTimePack(10,20)==2?'已结束':'即将开始',
                headerTime:'10:00'
            },
            {
                img1:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hbNo.png',
                img2:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hbOk.png',
                type:Number(dateTime.getHours())==13&&setTimePack(Number(dateTime.getHours()),20)==1?true:false,
                time:13,
                minTime:20,
                timeVale:Number(dateTime.getHours())==13&&setTimePack(Number(dateTime.getHours()),20)==1?packSetTimeInter(1,1,20):setTimePack(13,20)==2?'已结束':'即将开始',
                headerTime:'13:00'
            },
            {
                img1:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hbNo.png',
                img2:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hbOk.png',
                type:Number(dateTime.getHours())==16&&setTimePack(Number(dateTime.getHours()),20)==1?true:false,
                time:16,
                minTime:20,
                timeVale:Number(dateTime.getHours())==16&&setTimePack(Number(dateTime.getHours()),20)==1?packSetTimeInter(1,2,20):setTimePack(16,20)==2?'已结束':'即将开始',
                headerTime:'16:00'
            },
            {
                img1:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hbNo.png',
                img2:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hbOk.png',
                type:Number(dateTime.getHours())==20&&setTimePack(Number(dateTime.getHours()),20)==1?true:false,
                time:20,
                minTime:20,
                timeVale:Number(dateTime.getHours())==20&&setTimePack(Number(dateTime.getHours()),20)==1?packSetTimeInter(1,3,20):setTimePack(20,20)==2?'已结束':'即将开始',
                headerTime:'20:00'
            }
        ]);
        const closeEven = (data)=>{
            overflowtype.value = false;
            switch (data.dialogId) {
                case 1:
                    loginDialType.value = false;
                    break;
                case 2:
                    tableDialType.value = false;
                    break;
                case 3:
                    cdnDialType.value = false;
                    playPack();
                    break;
                case 4:
                    packDialogType.value = false;
                    switchIconEven(data.data);
                    break;
                case 5:
                    learnDiscountDialogType.value = false;
                    break;
                case 6:
                    integralDialogType.value = false;
                    break;
                case 7:
                    rulesDialogType.value = false;
                    break;
                case 8:
                    tipsDialogType.value = false;
                    break;
                case 9:
                    dialogVisbile.value = false;
                    break;
                default:
                    break;
            }
        }
        const share = async ()=>{
            const message = {
                describe:'导航栏显示分享按钮',
                method:"share",
                params:{
                    title:'和亲朋好友组学习小队，共攒积分赢大奖!',
                    desc:'学国学就上学国学网',
                    link:links.value||window.location.href,
                    imgUrl:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/redrain.png',
                    channelId:2,
                    activityName:'hb'
                }
            }
            if(!window.pointShareButton){
                window.pointShareButton = ()=>{
                //APP分享时渠道打点
                    // this.pointPage(this.channelId);
                }
            }
            const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
            if(isIos){
                try{
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage(message)
                }catch(err){

                }
            }else{
                if(window.android){
                    if(window.android.notify){
                        window.android.notify(JSON.stringify(message))
                    }
                }    
            }
            const url = encodeURIComponent(window.location.href.split('#')[0]);
            const res = await proxy.$http.get(`${proxy.$server.getConfig}?url=${url}`);
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
                        'hideMenuItems'
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
                    });				
                    wx.hideMenuItems({
                        menuList: [
                            "menuItem:share:qq",
                            "menuItem:share:weiboApp",
                            "menuItem:favorite",
                            "menuItem:share:facebook",
                            "menuItem:share:QZone",
                            "menuItem:share:qq",
                            "menuItem:share:brand",
                            "menuItem:openWithQQBrowser",
                            "menuItem:readMode",
                            "menuItem:originPage",
                            "menuItem:delete",
                            "menuItem:editTag",
                            "menuItem:copyUrl",
                            "menuItem:share:email"
                        ]
                    })
                })
            }
        }             
        //打点
        const buttonPackEven = (data)=>{
				var query = {
					type:data
				}
                proxy.$http.post(proxy.$server.pointButton,query).then(res=>{
                    if(res.status==200){
                        if(res.data.status==200){
                            console.log('打点成功');
                            if(Number(data)==5){
                                window.location.href = processType.value?'https://xgxm.xueguoxue.com/h5/team/index.html':'https://scm.youfushuyuan.com/h5/team/index.html';
                            }
                        }                           
                    }
                }).catch(()=>{})             
        } 
        //访问
        const pagePackEven = (id)=>{
				let query = {
                    "channelType":1,// 1.APP2微信
                    "userId":id,
                    "activityType":1// 1红包雨2组队
                }            
                if(isWx.value){
                    query.channelType = 2
                }else if(inApp.value){
                    query.channelType = 1
                }
                proxy.$http.post(proxy.$server.pointPage,query,{userId:id,token:userData.value.accessToken}).then(res=>{
                    if(res.status==200){
                        if(res.data.status==200){
                            console.log('打点成功');
                        }                           
                    }
                }) 
                proxy.$http.post(proxy.$server.pointVisit,query,{userId:id,token:userData.value.accessToken}).then(res=>{
                    if(res.status==200){
                        if(res.data.status==200){
                            console.log('打点成功');
                        }                           
                    }
                })           
        }             
        const rulesEven = ()=>{
            rulesDialogType.value = true;
            overflowtype.value = true;
        }
        const switchIconEven =(data)=>{
            switch (data.type) {
                case 1:
                case 2:
                    learnDiscountDialogType.value = true;
                    overflowtype.value = true;
                    if(data.type==2){
                        limitDayNum.value = 10;
                    }else{
                        limitDayNum.value = data.limitDay;
                    }
                    break;
                case 3:
                    integralDialogType.value = true;
                    overflowtype.value = true;
                    break;
                default:
                    break;
            }
        }
        //在Appnei
        const isInApp = ()=>{
                if(!userData.value.accessToken){
                    let cellphone = window.sessionStorage.getItem('cellphone');
                    let userId = Number(window.sessionStorage.getItem('userId'))==-1?'':window.sessionStorage.getItem('userId');
                    let token = window.sessionStorage.getItem('token');   
                    userData.value.accessToken = token||''; 
                    userData.value.userid = userId; 
                    userData.value.cellphone = cellphone||'';        
                }
        }
        const loginShow = ()=>{
            let logetype = true;
            if(!userData.value.accessToken){
                if(isWx.value){
                    if(!loginState.value){
                        overflowtype.value = true;
                        loginDialType.value = true;
                    }else{
                        overflowtype.value = false;
                        loginDialType.value = false;
                    }
                }
                if(inApp.value&&(!userData.value.accessToken)){      
                    const message = {
                        describe:'',
                        method:"loginWithAliToken",
                        params:{
                            title:'',
                            desc:'',
                            link:'',
                            imgUrl:'',
                            channelId:1,
                            activityName:'hb'
                        }
                    }                         
                    let isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
                    if(isIos){
                        try{
                            window.webkit.messageHandlers.iOSAppMethodName.postMessage(message)
                        }catch(err){}
                    }else{
                        if(window.android){
                            if(window.android.notify){
                                window.android.notify(JSON.stringify(message))
                            }
                        }    
                    }                
                }
                if(isWx.value){
                    logetype = loginDialType.value;
                }
                if(inApp.value){
                    logetype = true;
                }
            }else{
                logetype = false;
            }
            if(!isWx.value&&!inApp.value){
                Toast('请在微信或APP中打开') 
            }
            return logetype;
        }
        const selectCourse = (data)=>{      
           if(inApp.value){
                isInApp();
            }
            let type = '';
            let methodStr ='';
            if(inApp.value){
                if(isIos.value){
                    methodStr = 'goCourseDetail';
                }else{
                    methodStr = 'openLesson';
                }
            }     
            if(processType.value){
                switch (data.id) {
                    case 923:
                        type = 1;
                        break;
                    case 907:
                        type = 2;
                        break;
                    case 497:
                        type = 3;
                        break;
                    case 38:
                        type = 4;
                        break;
                    default:
                        break;
                }
            }else{
                switch (data.id) {
                    case 886:
                        type = 1;
                        break;
                    case 883:
                        type = 2;
                        break;
                    case 882:
                        type = 3;
                        break;
                    case 850:
                        type = 4;
                        break;
                    default:
                        break;
                }
            }                           
            buttonPackEven(type);
            let message = {
                describe:'',
                method:methodStr,
                params:{
                    courseId:data.id,
                    isCloseWebView:false
                }
            }            
           if(inApp.value){
                const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
                if(isIos){
                    try{
                        window.webkit.messageHandlers.iOSAppMethodName.postMessage(message)
                    }catch(err){}
                }else{
                    if(window.android){
                        if(window.android.notify){
                            window.android.notify(JSON.stringify(message))
                        }
                    }    
                }
           }else{
               if(isWx.value){
                    window.location.href =processType.value?'https://xgxm.xueguoxue.com/#/course/'+Number(data.id):'https://scm.youfushuyuan.com/#/course/'+Number(data.id);
               }else{
                   Toast('请在微信中打开')
               }
           }
        }
        //判断用户是否登录
        const islogins = ()=>{
            //判断是否保存了当前缓存数据；
            let iswx;
            const ua = window.navigator.userAgent.toLowerCase(),UA = navigator.userAgent;
            if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                iswx = true;
            }else if (ua.match(/QQ/i) == "qq" &&  ua.match(/MQQbrowser/i)!='mqqbrowser'){
                iswx = false;
            }
            if(iswx){
                const uInfo = GetCookies('uInfo')
                if(uInfo){
                    userData.value.accessToken = JSON.parse(uInfo).accessToken;
                    userData.value.nickname = JSON.parse(uInfo).nickname;
                    userData.value.avatar = JSON.parse(uInfo).avatar;
                    userData.value.userid = JSON.parse(uInfo).userid;
                    userData.value.cellphone = JSON.parse(uInfo).cellphone;
                }
            }else if(inApp.value){
                isInApp();
            }
			if(userData.value.accessToken){
				loginState.value = true;	
			}else{
				loginState.value = false;
			}            
        }
        const goTo = (type)=>{
            if(inApp.value){
                isInApp();
            }            
            if(loginShow()) return;            
            if(type==2){
                buttonPackEven(6);
                shareInjure();
                dialogVisbile.value = true;
                overflowtype.value= true;
            }else{
                buttonPackEven(5);
            }
        }
        const shareInjure = ()=>{
            var query = {
                "userId": userData.value.userid,
            }
            proxy.$http.post(proxy.$server.getPackShareActivity,query,{userId:userData.value.userid,token:userData.value.accessToken}).then(res=>{
                if(res.status==200){   
                    if(res.data.status==200){
                        console.log('加分成功');
                    }
                }
            }).catch((res)=>{
                Toast('系统错误')
            })            
        }
        //开始红包运动
        const playPack = ()=>{
            packDialogType.value = true;
            overflowtype.value = true;
        }
        //保存登陆后的用户信息
        const setPackUserEven = (data)=>{
            loginState.value = true;
            if(isWx.value){
                SetCookies('uInfo',JSON.stringify(data))
            }
            setTimeout(() => {
                    const uInfo = GetCookies('uInfo')
                    userData.value.accessToken = JSON.parse(uInfo).accessToken;
                    userData.value.nickname = JSON.parse(uInfo).nickname;
                    userData.value.avatar = JSON.parse(uInfo).avatar;
                    userData.value.userid = JSON.parse(uInfo).userid;
                    userData.value.cellphone = JSON.parse(uInfo).cellphone;
            }, 1000);
        }
        //判断当前时间在不在设定的时间段
        const issetTimelist= ()=>{
            let timeMin = false;//当前活动有没有结束
            let date = new Date()
            let h = date.getHours();
            let indexs=0;
            let timetype = false;//当前时间是不是在活动时间范围内
            packlist.value.forEach((element,index)=>{
                if(element.time==h){
                    timetype = true;
                    indexs = index;
                }
            });
            if(timetype){
                timeMin = setTimePack(h,packlist.value[indexs].minTime);
            }
            return timeMin!=1?false:true;
        }      
        //选择当前红包活动
        const packetSelect = ()=>{
            if(inApp.value){
                isInApp();
            }            
            if(loginShow()) return;            
            let nums = 5;
            if(!issetTimelist()){
                nums = 5;
            }else{
                let date = new Date()
                let h = date.getHours();
                packlist.value.forEach((element,index)=>{
                    if(element.time==h){
                        nums = index+1;
                    }
                });                    
            }
            let query = {
                userId: userData.value.userid,
                times:nums        
            }
            buttonPackEven(7);
            proxy.$http.post(proxy.$server.getPackJoinHb,query,{userId:userData.value.userid,token:userData.value.accessToken}).then(res=>{
                if(res.status==200){    
                    if(res.data.status==200){
                        isJoinType.value = false;
                        rewardRecordId.value=res.data.content.rewardRecordId;      
                        cdnDialType.value = true;
                        overflowtype.value = true;
                    }else{
                        tipsDialogType.value = true;
                        overflowtype.value = true;
                        isJoinType.value = true;
                    }
                }
            }).catch(()=>{})
        }       
        const packedList =()=>{
            if(inApp.value){
                isInApp();
            } 
            if(loginShow()) return;           
            var query = {
                "userId": userData.value.userid,
                "pageNo": 1,
                "pageSize": 9999
            }
            proxy.$http.post(proxy.$server.getPackLotteryRecord,query,{userId:userData.value.userid,token:userData.value.accessToken}).then(res=>{
                if(res.status==200){   
                    if(res.data.status){
                        tableDialType.value = true;
                        overflowtype.value = true;
                        let list = res.data.content.list;
                        packTableList.value = list;
                    }
                }
            }).catch((res)=>{
                Toast('系统错误')
            })
        }
        navigatorType();
        loadScripts();
        isWechatBrowser(appid,getQueryString);        
        //当传递的值发生变化时，provide也会触发；这是登陆页面显示
        provide('loginDialType',loginDialType);
        provide('tableDialType',tableDialType);
        provide('cdnDialType',cdnDialType);
        provide('packDialogType',packDialogType);
        provide('learnDiscountDialogType',learnDiscountDialogType);
        provide('integralDialogType',integralDialogType);
        provide('rulesDialogType',rulesDialogType);
        provide('tipsDialogType',tipsDialogType);
        provide('dialogVisbile',dialogVisbile);
        onMounted(()=>{
            islogins();
        })
        return{
            //弹框状态
            loginDialType,
            tableDialType,
            cdnDialType,
            packDialogType,
            learnDiscountDialogType,
            integralDialogType,
            rulesDialogType,
            dialogVisbile,
            //其他变量
            listData,
            packlist,
            packTableList,
            appid,
            courseList,
            loginState,
            userData,
            overflowtype,
            rewardRecordId,
            limitDayNum,
            loadScriptFlag,
            //方法
            packedList,
            setPackUserEven,
            playPack,
            packetSelect,
            loginShow,
            islogins,
            closeEven,
            rulesEven,
            selectCourse,
            goTo,
            pagePackEven,
            share,
            packSetTimeInter
        }
    }
}
</script>
<style lang="less">
    .index{
        background:#E81D3A;
        height: calc(100vh);
        position: relative;
        .header{
            width:100%;
            position: relative;
            .imgHeader{
                width:100%;
                display: block;
            }
            .iconCss{
                display:flex;
                justify-content:space-between;
                flex-direction: row;
                align-items: center;
                font-size: 0.24rem;
                position:absolute;
                top:0.1rem;
                width:100%;
                padding: 0.2rem;
                color: #fff;
                img{
                    display: block;
                    width:1.53rem;
                    height: 0.49rem;
                }
            }
            .scollBox{
                position:absolute;
                bottom:2.9rem;
                width:4.31rem;
                left: 1.6rem;
            }
        }
        .packBox{
            position: absolute;
            height: 4.45rem;
            top: 8rem;
            .hbBoxOne{
                position:relative;
                padding: 0 0.1rem;
                .img_hb1{
                    width:100%;
                    display: block;
                }
                .img_hb2{
                    width:2.82rem;
                    height: 0.84rem;
                    position:absolute;
                    top: -0.42rem;
                    display: block;
                    left: 2.24rem;
                }
                .imgListBox{
                    flex-direction: row;
                    justify-content:space-evenly;
                    align-items: center;
                    display:flex;
                    position: absolute;
                    top: 0.8rem;
                    .imgBox{
                        width:1.68rem;
                        height: 1.68rem;
                        margin-left: 0.11rem;
                        position: relative;
                        img{
                            width:100%;
                            height: 100%;
                        }
                        .timeBot{
                            font-size:0.18rem;
                            position:absolute;
                            bottom:0.16rem;
                            left: 0.22rem;
                            width: 1.25rem;
                            text-align: center;
                            font-weight: 700;
                        }
                        .timeTop{
                            font-size:0.18rem;
                            position:absolute;
                            top:0.06rem;
                            left: 0.62rem;
                            font-weight: 700;
                        }
                    }
                }
                .canyu{    
                    width: 1.1rem;
                    height: 1.1rem;
                    border-radius: 50%;
                    position: absolute;
                    bottom: 0.73rem;
                    right: 0.56rem;
                }
                .handIcon{
                    position:absolute;
                    width:0.95rem;
                    height: 1.09rem;
                    right: .3rem;
                    bottom: 0;
                }
            }
            .hbBoxTwo{
                position:relative;
                padding: 0 0.1rem;
                margin-top: 0.4rem;
                .hbList{
                    position:absolute;
                    top:0;
                    left:0;
                    bottom:0;
                    right: 0;
                    overflow: hidden;
                    .hbListBox{
                        width: 3.7rem;
                        height: 3.8rem;
                        float: left;
                    }
                }
            }
            .hbBoxThree{
                position:relative;
                padding: 0 0.1rem;
                margin-top: 0.3rem;
                .img_three1{
                    position:absolute;
                    top:0.82rem;
                    left: 0.5rem;
                    width:6.42rem;
                    height: 1.67rem;
                }
                .img_three2{
                    position:absolute;
                    top:2.93rem;
                    left: 0.5rem;
                    width:6.42rem;
                    height: 1.12rem;
                }
                .handIcon{
                    position:absolute;
                    width:0.95rem;
                    height: 1.09rem;
                    right: .3rem;
                    top: 1.7rem;
                }
            }
        }
    }
    .overflowScroll{
         overflow-y: scroll;
    }
    .overflowHidden{
         overflow-y:hidden;
    }
    *{
        margin:0;padding:0;
    }
</style>
<style>
.handAnimat{
    position:relative;
    animation:mymove 4s infinite;
    -webkit-animation:mymove 4s infinite; /*Safari and Chrome*/
    animation-direction:alternate;/*轮流反向播放动画。*/
    animation-timing-function: linear; /*动画的速度曲线*/
    /* Safari 和 Chrome */
    -webkit-animation:mymove 4s infinite;
    -webkit-animation-direction:alternate;/*轮流反向播放动画。*/
    -webkit-animation-timing-function: linear; /*动画的速度曲线*/
}            
@keyframes mymove
            {
                0%{
                transform: scale(1.1);  /*开始为原始大小*/
                }
                25%{
                    transform: scale(0.95); /*放大1.1倍*/
                }
                50%{
                    transform: scale(0.8);
                }
                75%{
                    transform: scale(0.95);
                }
                100%{
                    transform: scale(1.1);
                }
            }
</style>
