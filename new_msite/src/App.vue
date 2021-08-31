<template>
  <div id="app" @touchstart="touchStart($event)" @touchend="touchEnd($event)">
    <OpenApp v-if="hasOpenApp"/>
    <div class="top-bar" v-if="hasOpenApp"></div>
    <AudioComp v-if="audioData.show&&audioData.periodId" />
    <router-view v-if="isRouterAlive" :key="$route.fullPath"></router-view>
    <transition name="fade">
        <ChinaMobile v-if="chinaMobileDialog" :mobilePopupUrl="mobilePopupUrl" :mobilePopupId="mobilePopupId"></ChinaMobile>
        <NewUserActive v-if="actionLableState" :dataInfo="dataObj" :dataCourseNum='dataCourseNum'/>
        <Interest v-if="isFirstRegisAndNoInterest"/>
        <Gift v-if="giftFlag.length>0"></Gift>
        <MembershipCardDialog v-if="membershipCardDialog.length>0"/>
        <DownLoad v-if="downloadFlag"/>      
    </transition>
    <van-overlay :show="show"/>
  </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import OpenApp from '@/components/openApp.vue'
import ChinaMobile from '@/pages/activity/chinaMobile.vue'
import NewUserActive from '@/pages/activity/newUserActive.vue'
import Interest from '@/pages/activity/interest.vue'
import Gift from '@/pages/activity/gift.vue'
import MembershipCardDialog from '@/pages/activity/membershipCardDialog.vue'
import AudioComp from '@/pages/course/audio.vue'
import DownLoad from '@/components/download.vue'
const hidePathName = ['newShare','ChangePassword','smsLogin'];
const vipPathName = ['index','User','CourseList','Result','Course','Section'];//'Auth'
const excludeAudipPath = ['/courseSharePoster']//不展示音频页面，只有声音
let pageInfo = {}
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
export default {
    name: 'App',
    provide(){
        return{
            reload:this.reload
        }
    },
    data(){
        return{
            startY:0,
            scrollTop:0,
            isRouterAlive:true,
            show:false,
            dataObj:{},
            dataCourseNum:0,
            loadWxScriptFlag:false,//wx jssdk
            loadAliScriptFlag:false,//ali jssdk
            userData:{},
            mobilePopupUrl:'',
            mobilePopupId:''
        }
    },
    components:{
        'OpenApp':OpenApp,
        'NewUserActive':NewUserActive,
        'Interest':Interest,
        'Gift':Gift,
        'MembershipCardDialog':MembershipCardDialog,
        'AudioComp':AudioComp,
        'DownLoad':DownLoad,
        'ChinaMobile':ChinaMobile
    },
    computed:{
        ...mapState([
            'audioData',
            'hasOpenApp',
            'isFirstRegisAndNoInterest',
            'actionLableState',
            'actionFlagState',
            'giftFlag',
            'membershipCardDialog',
            'downloadFlag',
            'isWx',
            'isIos',
            'chinaMobileDialog',
            'chinaMobileDialogShow'
        ]),
    },
    watch:{
        $route(cur,old){
            let vipPathIndex = vipPathName.findIndex(item=>cur.name==item)
            if(vipPathIndex>=0){
                this.getUserInfo();
            }
            if(cur.name!='course'){
                let audioData = Object.assign({},this.audioData,{bottom:'8px'})
                this.setAudioData(audioData)
            }
        }      
    },
    created(){
        this.systemJudge()
        this.wxShareRedirect();
        if(this.$server.env != 'dev'){
            this.isWechatBrowser();
        }
        this.alipayRedirect();
        this.InputBlur();
        this.getThemeInfo()
        // if(this.$server.env=='dev'){
        //     let meta = document.createElement('meta');
        //     meta.content = 'no-referrer';
        //     meta.name = 'referrer';
        //     document.getElementsByTagName('head')[0].appendChild(meta);
        // }
        this.loadWxScript();
        this.loadAliScript();
    },
    methods:{
        ...mapActions([
            'setIsWx',
            'setIsIos',
            'setAudioData',
            'setOpenAppFlag',
            'setShareUserData',
            'setReceivefriendShareData',
            'setIsVip',
            'setCooperativePlatformsData',
            'setActionStateFlag',
            'setChinaMobileDialog'
            ]),               
        /**
         * 系统判断
         */
        systemJudge(){
            let ua = window.navigator.userAgent.toLowerCase(),UA = navigator.userAgent;
            if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                this.setIsWx(true)
            }else if (ua.match(/QQ/i) == "qq" &&  ua.match(/MQQbrowser/i)!='mqqbrowser'){
                this.setIsWx(true)
            }
            this.setIsIos(!!UA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))       
        },
        /**
         * 动态加载wx JS
         */
        loadWxScript(){
            if(this.loadWxScriptFlag){
                return false;
            }
            loadScript('//res.wx.qq.com/open/js/jweixin-1.4.0.js').then(()=>{
                this.loadWxScriptFlag = true;
            }).catch(()=>{
                this.loadWxScriptFlag = false;
                setTimeout(()=>{
                    this.loadWxScript()
                },1000)
            })
        },
        /**
         * 动态加载ali JS
         */
        loadAliScript(){
            if(this.loadAliScriptFlag){
                return false;
            }
            loadScript('//g.alicdn.com/de/prismplayer/2.8.1/aliplayer-min.js').then(()=>{
                this.loadAliScriptFlag = true;
            }).catch(()=>{
                this.loadAliScriptFlag = false;
                setTimeout(()=>{
                    this.loadAliScript()
                },1000)
            })
        },
        /**
         * 获取用户信息，判断是否是会员
         */
        getUserInfo(){
            let uInfo = JSON.parse(this.$getCookie("uInfo"));
            if(uInfo){
                this.$http.post(this.$server.getUserInfoById,{}).then(res =>{
                    if(res.data.status==200){
                        this.userData = res.data.content;
                        uInfo.isVip = res.data.content.isVip==1;
                        this.setIsVip(res.data.content.isVip);
                        this.$setCookie("uInfo", JSON.stringify(uInfo));
                        this.mobilePopupUrl = res.data.content.mobilePopupUrl;
                        this.mobilePopupId = res.data.content.mobilePopupId;
                        if(this.$route.name=='index'&&res.data.content.isMobilePopup&&res.data.content.isMobilePopup==2&&this.chinaMobileDialogShow&&!this.actionLableState){
                            this.setChinaMobileDialog(true);
                            if(this.$route.name=='index'&&res.data.content.isReceiveGiftBag==0){
                                this.getGiftBagEven();
                            }
                        }else{
                            if(this.$route.name=='index'&&res.data.content.isReceiveGiftBag==0){
                                this.getGiftBagEven();
                            }
                        }
                    }
                })      
            }else{
                var namePath = this.$route.name;
                this.setIsVip(false);
                if(namePath=='index'){
                    this.getGiftBagEven();
                } 
            }
        },
        /**
         * 处理h5 输入框失焦后 页面没有回滚到原位置的情况
         */
        InputBlur(){
            let ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                let flag,myFunction;
                document.body.addEventListener('focusin', () => {  //软键盘弹起事件
                    flag=true
                    clearTimeout(myFunction);
                })
                document.body.addEventListener('focusout', () => { //软键盘关闭事件
                    flag=false;
                    if(!flag){
                    myFunction = setTimeout(()=>{  
                        if(window.scrollTo)
                        window.scrollTo({top:0,left:0,behavior:"smooth"})//重点  =======当键盘收起的时候让页面回到原始位置
                    },200);
                    }else{
                        return
                    }
                })
            }
        },
        reload(){
            // this.setReceivefriendShareData({})
            this.isRouterAlive = false;
            this.$nextTick(()=>{
                this.isRouterAlive = true;
            })
        },
        touchStart(e){
            this.startY = e.targetTouches[0].pageY;
            this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        },
        touchEnd(e){
            let index = excludeAudipPath.findIndex(item=>this.$route.fullPath.includes(item));
            if(index>=0)return false;     
            this.scrollEvent(()=>{
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                let temp = scrollTop-this.scrollTop
                if(temp>0){
                    if(this.audioData.isout) return;
                    let audioData = Object.assign({},this.audioData,{isout:true})
                    this.setAudioData(audioData)
                }else if(temp<=0){
                    if(!this.audioData.isout) return;
                    let audioData = Object.assign({},this.audioData,{isout:false})
                    this.setAudioData(audioData);
                }else{
                    
                }
            })
        },
        scrollEvent(callBackFun){
            pageInfo.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;;
            clearTimeout(pageInfo.timeoutListener)
            pageInfo.timeoutListener = setTimeout(()=>{
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if(pageInfo.scrollTop == scrollTop){
                    try{
                        callBackFun();
                    }catch(e){
                        console.log("出错了:" + e);
                    }
                }else{
                    this.scrollEvent(callBackFun)
                }
            }, 100);
        },
        /**
         * 刷新token时间
         */
        refreshUserTokenDeadline(){
            this.$http.post(this.$server.refreshUserTokenDeadline,{}).then(res=>{
                if(res.data.status == 200){
                    
                }
            })  
        },
        /**
         * 是否是微信浏览器，是的话去获取openId
         */
        isWechatBrowser(){
            let openId = localStorage.getItem('openId')
            if(openId) return false;
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                var wxcode = getQueryString('code')
                if(!wxcode){
                    this.show = true;
                    var redirect_uri = encodeURIComponent(window.location.href)
                    let link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.$server.appId}&redirect_uri=`+redirect_uri+'&response_type=code&scope=snsapi_base&state=#wechat_redirect&connect_redirect=1'
                    window.location.replace(link)
				}else{
					this.$http.post(this.$server.getOpenId,{code:wxcode}).then(res=>{
						if(res.data.status==200){
							localStorage.setItem('openId',res.data.content.openId)
						}
					})
				}
            }
        },
        /**
         * hash模式下，微信分享回调地址均为origin，通过不同参数来判断分享的类型
         */
        wxShareRedirect(){
            if(window.location.hash.includes('account')||window.location.hash.includes('order')){
                return;
            }
            // let friendShareData = sessionStorage.getItem('friendShareData')
            // if(friendShareData){
            //     this.setReceivefriendShareData(JSON.parse(friendShareData))
            //     sessionStorage.removeItem('friendShareData')
            //     this.$router.replace(`/course/${JSON.parse(friendShareData).friendShareCourseId}`)
            //     return;
            // }
            let wxshare = getQueryString('wxshare')
            let type = getQueryString('type')
            if(wxshare||type){
                if(type=='share')
                    this.$router.replace('/user/share/imgwrap')
                else if(type=='course'){
                    let id = getQueryString('courseId');
                    let shareUserId = getQueryString('shareUserId');
                    let shareType = getQueryString('shareType')
                    if(shareType){
                        //普通课程分享
                    }else{
                        //赚佣金分享
                        this.setShareUserData({
                            shareUserId:shareUserId,
                            shareCourseId:id,
                            status:true
                        })
                    }
                    this.$router.replace(`/course/${id}`)
                }else if(type=='period'){
                    let id = getQueryString('periodId');
                    let courseId = getQueryString('courseId');
                    let courseType = getQueryString('courseType');
                    let shareUserId = getQueryString('shareUserId');
                    if(shareUserId&&shareUserId!=''){
                        this.setShareUserData({
                            shareUserId:shareUserId,
                            shareCourseId:courseId,
                            status:true
                        })
                    }
                    this.$router.replace(`/course/${courseId}/${id}/${courseType}`)
                }else if(type=='friendShare'){
                    let id = getQueryString('periodId');
                    let courseId = getQueryString('courseId');
                    let courseType = getQueryString('courseType');
                    let friendId = getQueryString('friendId');
                    let shareUserId = getQueryString('shareUserId');
                    if(shareUserId){
                        this.setShareUserData({
                            shareUserId:shareUserId,
                            shareCourseId:id,
                            status:true
                        })
                    }
                    if(friendId){
                        // let temp = {friendId:friendId,friendShareCourseId:courseId,friendSharePeriodId:id}
                        // sessionStorage.setItem('friendShareData',JSON.stringify(temp));
                        // window.location.href = window.location.origin

                        this.setReceivefriendShareData({
                            friendId:friendId,
                            friendShareCourseId:courseId,
                            friendSharePeriodId:id
                        })
                        this.$router.replace(`/course/${courseId}`)
                    }
                }else if(type=='assemble'){
                    let assembleId = getQueryString('assembleId');
                    let assembleRecordId = getQueryString('assembleRecordId');
                    let assembleUser = getQueryString('assembleUser')
                    this.$router.replace({path:`/assemble/joinAssemble/${assembleId}`,query:{assembleRecordId:assembleRecordId,assembleUser:assembleUser}})
                }else if(type=='information'){
                    let informationId = getQueryString('informationId');
                    this.$router.replace(`/infromation/infromDetails/${informationId}`)
                }else if(type=="cooperativePlatforms"){
                    let xxtId = getQueryString('xxtId')
                    let id = getQueryString('cId');
                    this.setCooperativePlatformsData({
                        xxtId:xxtId
                    })
                    this.$router.replace(`/course/${id}`)
                }else if(type=='shortVideoShare'){
                    let id = getQueryString('id');
                    this.$router.replace(`/praiseVideo/${id}`)
                }else if(type=='siginShare'){
                    let id = getQueryString('shareId');
                    this.$router.replace(`/auth?shareId=${id}`)
                }     
            }
        },
        //获取大礼包活动是否存在的情况；
        getGiftBagEven(){
            //成人少儿类型;
            var edittype = localStorage.getItem('editionType');
            var actionFlagState =localStorage.getItem('actionFlagState');
            var indexActions =localStorage.getItem('indexActions');
            if(actionFlagState){
                localStorage.removeItem('actionFlagState');
            }
            if(indexActions){
                localStorage.removeItem('indexActions');
            }            
            if(!edittype){
                edittype = 1;
            } 
            if(!this.actionLableState&&this.actionFlagState){
                this.$http.post(this.$server.getGiftBagInfo,{type:edittype}).then(res=>{
                    if(res.data.status == 200){
                        let code = res.data.content.code;
                        if(code==1){
                            this.dataObj = res.data.content.giftBag;
                            this.dataCourseNum = res.data.content.courseNum;
                            if(res.data.content.giftBag.bagType==1){
                                localStorage.setItem('actionFlagId',this.dataObj.id);
                            }
                            if(this.userData.isMobilePopup&&this.userData.isMobilePopup==2){
                                sessionStorage.setItem('giftPackage','true')
                            }else{
                                this.setActionStateFlag(true);
                            }
                        }
                    }
                })
            }else{
                localStorage.setItem('actionFlagId','');
            }  
        },
        /**
         * 支付宝支付回调中转跳路由
         */
        alipayRedirect(){
            if(window.location.search.includes('alipay')){
                let type = getQueryString('type')
                if(type==1){
                    let url = window.location.origin+'/#/user/account'
                    window.location.replace(url)
                }else if(type==2){
                    let id = getQueryString('courseId');
                    let assembleId = getQueryString('assembleId');
                    let aboutCourse = localStorage.getItem('aboutCourse')
                    if(aboutCourse){
                        localStorage.removeItem('aboutCourse')
                    }
                    if(id){
                        let url = window.location.origin+`/#/course/order/Success/${id}`
                        window.location.replace(url)
                    }
                    if(assembleId){
                        let url = window.location.origin+`/#/assemble/openAssemble/${assembleId}`
                        window.location.replace(url)
                    }
                }else if(type==3){
                    let uInfo = JSON.parse(this.$getCookie("uInfo"));
                    uInfo.isVip = true;
                    this.$setCookie("uInfo", JSON.stringify(uInfo));
                    this.setIsVip(true)
                }else if(type==4){
                    let price = getQueryString('price');
                    let orderId = localStorage.getItem('orderId');
                    if(orderId){
                        localStorage.remove('orderId');
                        let url = window.location.origin+`/#/collection/order/success?orderId=${orderId}&price=${price}`
                        window.location.replace(url)
                    }
                    else{
                        this.$router.push('/')
                    }
                }
            }
        },
        /**
         * 获取主题色
         */
        getThemeInfo(){
            this.$http.post(this.$server.getThemeInfo,{}).then(res=>{
                if(res.data.status==200){
                    let opt = res.data.content.opt;
                    if(opt&&opt==1){
                        document.getElementsByTagName('html')[0].classList.add('gray')
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss">
html{
    font-size: 55.2px;
    background: #f4f4f4;
}
body{
    width: 7.5rem;
    margin:0 auto!important;
    max-width: 414px;
    background: #fff;
}
.gray{
    filter:grayscale(.95 );
    -webkit-filter: grayscale(.95 );
}
.top-bar{
    height: .98rem;
}
.actionflag{
    overflow: hidden;
}
#app{
    background: #fff;
}
.hasAudio{
    padding-bottom:1.2rem;
}
.module-title{
    font-weight: 700!important;
}
.empty{
    position: absolute;
    top:35%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    p{
        color:#999999;
    }
}
.null{
    text-align: center;
    padding: 10px 0;
    color:#999999;
}
.text-align{
    text-align: center;
    .van-loading{
        margin:10px 0;
        display: inline-block;
    }
}
.clearfix{
    *zoom:1;
}
.clearfix:after{
    content: "";
    display: block;
    clear: both;
}
.van-nav-bar__title{
    font-weight: 700!important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ { 
   opacity: 0;
}
.go-back{
    width: .5rem;
    height: .5rem;
    vertical-align: middle;
}
.skeleton-box{
    position: absolute;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    z-index: 1;
    top: 0;
    left: 0;
}
.skeleton-box .bgd{
    width: 100%;
    height: 100%;
}
.audio-component .spread .audio-main .audio-controls .process .bar-btn{
    width: 1.3rem;
    text-align: center;
    font-size: 0.2rem;
    padding: 0.04rem 0;
}
.xgx-editor{
    img{
        display: block;
    }
}
</style>
