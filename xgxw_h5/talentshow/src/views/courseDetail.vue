<template>
  <div class="detail">
      <div class="video"> 
            <!-- 没有资格观看的页面显示 -->
            <div v-show="isNoUrlState" class="positionImg">
                <img class="img1" :src='courseData.surfacePlot '/>
                <img class="img2" src="../assets/images/player_lock.png" />
            </div>
            <!-- 有资格观看的音频页面显示 -->
            <div v-show="!isNoUrlState&&audVidType==2" class="audio-playe">
                <img class="img1" :src='courseData.surfacePlot' @touchstart.native="touchProcess"/>
                <!-- videoOpenImg:播放状态， videoCloseImg：关闭状态-->
                <div class="divSwitchBox" v-show="audioSwitchBox">
                    <img class="img2" :src='audioSwitch?videoOpenImg:videoCloseImg' @click="clickAudioSwitch(!audioSwitch)"/>
                </div>
            </div>
            <!-- 有资格观看的视频页面显示，音频此时隐藏 -->
            <div v-show="!isNoUrlState&&audVidType==1" id='player-con' class="prism-player"></div>
            <div class="imgflex">
                <img class='img1' src="../assets/images/daren_16.png" @click="returnEven"/>
                <!-- <img class='img2'  src="../assets/images/share-b.png" @click="shareEven"/> -->
            </div>
            <!-- <div slot="button" class="bar-btn" ref="barBtn">{{ curDuration }}/{{totalDuration}}</div> -->
            <div class="t t_audio" v-show="!isNoUrlState&&audVidType==2">
                <div class="process processAudio">
                    <van-slider v-model="processCurValue" active-color="#f4f4f4" inactive-color="#f4f4f4" @change="getCurValue" @drag-start="touchStart(1)" @drag-end="touchEnd(1)"> 
                        <template #button>
                            <div class="custom-button bar-btn audio-but" ref="barBtn">{{ curDurationStr }}/{{totalDurationStr}}</div>
                        </template>
                    </van-slider>
                </div>
                <div class="control-item prve" @click="prevResource"><i class="prve-btn"></i></div>
                <div class="control-item next" @click="nextResource" ref="nextBtn"><i class="next-btn"></i></div>
            </div>  
            <div class="t t_video" v-show="!isNoUrlState&&audVidType==1">
                <div class="process processVideo">
                    <van-slider v-model="processCurValue" active-color="#ee0a24" bar-height="4px" inactive-color="#f4f4f4" @change="getCurValue" @drag-start="touchStart(2)" @drag-end="touchEnd(2)"> 
                        <template #button>
                            <div class="custom-button bar-btn video-btn" ref="barBtn"></div>
                        </template>
                    </van-slider>
                </div>
            </div>                    
        </div>
      <!-- <div class="conten" :style="{height:heightNum+'rem'}"> -->
        <div class="conten">
          <div class="one" :style="{height:tabsIndex==1?'2.6rem':'1.08rem'}">   
              <div class="one_1">
                  <div class="tabCss font_pr" @click="tabs(1)">介绍
                    <div class="botCss" v-show='tabsIndex==1'></div>
                  </div>
                  <div class="tabCss font_pr" @click="tabs(2)">
                    目录
                    <div class="botCss" v-show='tabsIndex==2'></div>
                  </div>
              </div>  
              <div class="one_2" v-if='tabsIndex==1'>
                  <p class="p1">{{courseData.title}}</p>
                  <p class="p2">共{{courseData.planPeriodNum||'0'}}节，已更{{courseData.actualPeriodNum||'0'}}节  |  {{courseData.courseBrowsCount?courseData.courseBrowsCount+1>100000?'10w+':courseData.courseBrowsCount+1:0}}人学习</p>
              </div>       
          </div>
          <div class="two" v-if='tabsIndex==1'>
              <div class="two_1 font_pr">课程介绍</div>
              <div class="two_2" v-html="courseData.introduce"></div>
          </div>
          <div class="three" v-if='tabsIndex==2' >
                <!-- <div :class="!upOrDownType?'heightOne':''"> -->
                <div>
                    <div class="directoryLi" v-for="(item,index) in periodList" :key='index' @click="selectXiaojie(item,index)">
                        <div class="row1">
                            <div>第{{index+1}}节</div>
                            <div>{{item.title}}</div>
                        </div>
                        <div class="row2">
                                <div class="row2One">
                                    <div class="times">{{item.targetDurationText}}</div>
                                    <div class="progress">学习进度 {{item.progress||'0%'}}</div>
                                </div>
                                <div class="is-try" v-if="item.isVip>0">
                                    <!-- <i class="playing"></i> -->
                                    <i :class="(periodListIndex==index&&isPalyStart)?'playing':''"></i>
                                </div>  
                                <div v-else>                    
                                    <div class="is-try" v-if="courseData.isBuy>0">
                                        <i :class="(periodListIndex==index&&isPalyStart)?'playing':''"></i>
                                    </div>
                                    <div v-else>                    
                                        <div class="is-try" v-if="courseData.isFree>0">
                                            <i :class="(periodListIndex==index&&isPalyStart)?'playing':''"></i>
                                        </div>
                                        <div v-else>                    
                                            <div class="is-try" v-if="courseData.timeLimitType==0">
                                                <i :class="(periodListIndex==index&&isPalyStart)?'playing':''"></i>
                                            </div>
                                            <div v-else>                    
                                                <div class="is-try" v-if="item.isTry>0">
                                                    <i v-if='isPalyStart&&periodListIndex==index' class="playing"></i>
                                                    <p v-else>{{courseData.courseType==1?'试看':'试听'}}</p>
                                                </div>
                                                <div class="is-lock"  v-else><i></i></div> 
                                            </div> 
                                        </div> 
                                    </div> 
                                </div>                       
                        </div>
                    </div>
                </div>
                <!-- <div class="upOrDownIcon" @click="upOrDownTypeEven(!upOrDownType)" v-if="periodList.length>3">
                    <van-icon name="arrow-up" v-if="upOrDownType"/>
                    <van-icon name="arrow-down" v-else/>
                </div> -->
          </div>
      </div>
      <div class="florBox" @click="placeOrder">
          加入学习
      </div>
      <SharedIalog  @closeEven="closeEven"/>
  </div>
</template>
<script>
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
function formatSeconds(value){
    let h = parseInt(value/3600)
    let m = parseInt(value % 3600 / 60)
    let s = parseInt(value % 3600 % 60)
    let hStr = h<10?`0${h}`:h;
    let mStr = m<10?`0${m}`:m;
    let sStr = s<10?`0${s}`:s;
    return `${hStr}:${mStr}:${sStr}`
}
import {onMounted,ref,reactive,provide,inject,computed,getCurrentInstance,watch} from 'vue'
import useIsWx from '@/hooks/useIsWx.js'
import { Toast } from 'vant';
import { useRoute,useRouter } from 'vue-router'
import { GetCookies,SetCookies } from '@/utils/setCookies'
import SharedIalog from '@/components/ShareDIalog.vue'
import videoClose from '@/assets/images/videoClose.png'
import videoOpen from '@/assets/images/videoOpen.png'
import { setTimeout, clearTimeout } from 'timers';
export default {
    components: {
        SharedIalog
    },
    setup(){   
      const {proxy} = getCurrentInstance();
      const route = useRoute();
      const router = useRouter();
      const courseDetailsId = ref(0);//课程id
      const courseDetailsImgs = ref('');
      const loadScriptFlag = ref(false);
      const player =ref({});//用户信息保存
      const courseData = ref({});//课程详情信息
      const source = ref('');//播放地址
      const tabsIndex = ref(1);//tab切换下标
      const periodList = ref([]);//目录列表
    //   const upOrDownType = ref(false);//目录展开还是收起
      const heightNum = ref(10);//默认目录高度；
      const periodListIndex = ref(0);//选中的播放下标；
      const isPalyStart = ref(false);//当前是不是在播放；
      const copyIsPalyStart = ref(false);//拖拽前临时保存播放状态
      const playerObj = ref(null);//播放器；
      const isNoUrlState = ref(false);//是否有资格观看课程的状态
      const periodId = ref(-1);//当前播放的目录id;
      const loadAliScriptFlag = ref(false); //阿里云状态
      const processCurValue = ref(0);//音频进度时间
      const curDurationStr = ref('00:00:00');//已经进行音频的时间
      const curDuration = ref(0);//已经进行音频的时间Str
      const totalDurationStr = ref('00:00:00');//当前音频总时长
      const totalDuration = ref(0);//当前音频总时长str
      const audioSwitch = ref(false);//音频开关icon显示状态，默认是关闭的；
      const audioSwitchBox = ref(true);//默认音频开关按钮Div是显示的；
      const anudioBoxTimer = ref(null);//音频定时器临时变量；
      const link = ref('');//分享链接
      const imgShare = ref('');//分享图片
      const dialogVisbile = ref(false);//分享弹框
      const studyPointList = ref([]);//学习时长点;
      const palyGetCourrTime = ref(0);//临时时间存储
      const seekLastTime = ref(0);//跳转时间
      const audVidType = ref(0);//音频视频类型
      const bilinums = ref(0);//音频分成一百分后每一份的比例;
      const isFirst = ref(true);//是不是第一次进入
      const userData =ref({//用户信息
              accessToken: '',
              nickname: '',
              avatar:'',
              userid:'',
              cellphone:'',
          });
        const videoCloseImg = ref(videoClose);
        const videoOpenImg = ref(videoOpen);
          //用户信息保存
        const setuserData = ()=>{
            const uInfo = GetCookies('uInfo')
            const courseSurfacePlot = GetCookies('courseSurfacePlot')
            userData.value.accessToken = JSON.parse(uInfo).accessToken;
            userData.value.nickname = JSON.parse(uInfo).nickname;
            userData.value.avatar = JSON.parse(uInfo).avatar;
            userData.value.userid = JSON.parse(uInfo).userid;
            userData.value.cellphone = JSON.parse(uInfo).cellphone;        
            courseDetailsId.value = route.query.id;
            courseDetailsImgs.value = courseSurfacePlot;
        }
        //获取课程详情
        const getCourseInfo =()=>{
            let query = {
                courseId:Number(courseDetailsId.value),
                userId:userData.value.userid||''
            }     
            proxy.$http.post(proxy.$server.getCourseInfo,query,{userId:userData.value.userid||1,token:userData.value.accessToken}).then(res=>{
                if(res.status==200){
                    if(res.data.status==200){
                        courseData.value = res.data.content;
                        if(res.data.content.courseType==2){
                            document.querySelector('.process .van-slider__button-wrapper').style.zIndex="2";
                        }
                        audVidType.value = res.data.content.courseType;
                        getPeriodList();
                    }                           
                }
            })         
        }
        // const upOrDownTypeEven = (type)=>{
        //     if(type){
        //         heightNum.value = periodList.value.length*1.5+4.56;
        //     }else{
        //         heightNum.value = 9.5;
        //     }
        //     upOrDownType.value = type;
        // }
        /**
		 * 获取课时目录
		 */
        const getPeriodList=()=>{
            let query = {
                    courseId:Number(courseDetailsId.value),
                    userId:userData.value.userid||''
            } 
            proxy.$http.post(proxy.$server.getPeriodsListByCourseId,query,{userId:userData.value.userid||'',token:userData.value.accessToken||''}).then(res=>{
                if(res.status==200){
                    if(res.data.status==200){
                        periodList.value = res.data.content;
                        periodList.value.forEach(item=>{
                            item.targetDurationText = formatSeconds(item.targetDuration)
                        });
                        periodId.value = periodList.value[0].id;
                        seekLastTime.value = periodList.value[0].lastStudyPoint;
                        //periodListIndex
                        getCourseUrl();
                    }                           
                }
            })
        }   
        const closeEven = (data)=>{
            switch (data.dialogId) {
                case 9:
                    dialogVisbile.value = false;
                    break;
                default:
                    break;
            }
        }
        //手指触摸音频播放区域时
        const touchProcess = ()=>{
            //判断当前音频是不是播放状态；
            audioSwitchBox.value = true;
            if(isPalyStart.value){
                anudioBoxTimer.value=setTimeout(() => {
                    audioSwitchBox.value = false;
                }, 4000);
            }
        }
        //音频开关
        const clickAudioSwitch = (type)=>{
            audioSwitch.value = type;
            if(type){
                playerObj.value.play();
                console.log("自动开启5");
                anudioBoxTimer.value=setTimeout(() => {
                    audioSwitchBox.value = false;
                }, 4000);
            }else{
                clearTimeout(anudioBoxTimer.value);
                playerObj.value.pause();
                audioSwitchBox.value = true;
            }
        }
        //拖动开始
        const touchStart = (type)=>{
            copyIsPalyStart.value = isPalyStart.value;
            playerObj.value.pause();
        } 
        const touchEnd = (type)=>{
            let times = processCurValue.value/bilinums.value;
            playerObj.value.seek(times);
            if(copyIsPalyStart.value){
                playerObj.value.play();
            }
        }
        /**
         * 拖拽进度条，获取进度条当前值
         */
        const getCurValue=(value)=>{
            let times = value/bilinums.value;
            playerObj.value.seek(times);            
        }
        // 上一首
        const prevResource = ()=>{
            let periodLength=periodList.value.length;
            console.log("上一首");
            if(periodListIndex.value>0){
                periodListIndex.value = periodListIndex.value-1;
                periodId.value=periodList.value[periodListIndex.value].id;
                seekLastTime.value=periodList.value[periodListIndex.value].lastStudyPoint;
                getCourseUrl();
            }else{
                Toast('当前已经是课程第一小节') 
            }
        }
        // 下一首
        const nextResource = ()=>{
            console.log("下一首");            
            let periodLength=periodList.value.length;
            if(periodListIndex.value<periodList.value.length-1){
                periodListIndex.value = periodListIndex.value+1;
                periodId.value=periodList.value[periodListIndex.value].id;
                seekLastTime.value=periodList.value[periodListIndex.value].lastStudyPoint;
                getCourseUrl();
            }else{
                Toast('当前已经是课程最后小节') 
            }
        }
        const tabs = (states)=>{
            tabsIndex.value = states;
        }
        const placeOrder = ()=>{   
                toPaths('/order',{curseId:courseDetailsId.value})
        }
        //点击小节
        const selectXiaojie = (data,i)=>{
            periodListIndex.value = i;
            if(periodId.value!=data.id){
                periodId.value=data.id;
                seekLastTime.value = data.lastStudyPoint;
                getCourseUrl();
            }else{
                if(!isPalyStart.value){
                    console.log("自动开启2");
                    playerObj.value.play();
                }
            }
        }
        const isWifi=()=>{
            try {
                let wifi = true
                let ua = window.navigator.userAgent
                let con = window.navigator.connection
                    // 如果是微信
                if (/MicroMessenger/.test(ua)) {
                    if (ua.indexOf('WIFI') >= 0) {
                        return true;
                    } else {
                        wifi = false
                    }
                    // 如果支持navigator.connection
                } else if (con) {
                    let network = con.type
                    if (network !== 'wifi' && network !== '2' && network !== 'unknown') {
                        wifi = false
                    }
                }
                return wifi
            } catch (e) {
                return false
            }
        }       
        //学习进度保存
        const savePeriodStudyRecords = (callback)=>{
                let lastNum = studyPointList.value[studyPointList.value.length-1];
                let query = {
                    userId:userData.value.userid,
                    courseId:courseData.value.id,
                    periodId:periodId.value,//小节id
                    learnRate:lastNum,//进度时长
                    netType:isWifi()==true?2:1,// 1：4G，2WIFI
                    studyPoint:studyPointList.value.toString(),//学习时间点 1,2,3...
                    realLearnRate:studyPointList.value.length,//用户实际学习时间
                    lastStudyPoint:lastNum,//上次学习时间点                    
                };
                proxy.$http.post(proxy.$server.savePeriodStudyRecords,query,{userId:userData.value.userid,token:userData.value.accessToken}).then(res=>{
                    if(res.data.status==200){
                        studyPointList.value=[];
                        console.log('保存成功。')  
                        if(callback){
                            callback();
                        }                 
                    }
                })            
        }
        //播放器调用；      
        const playerRender=()=>{
            isPalyStart.value = false;
            if(playerObj.value){
                playerObj.value.dispose();//销毁以前的播放器
                playerObj.value=null;
            }
            var props ='';
            if(audVidType.value==1){
                props = {  
                    id: "player-con",
                    width: "100%",
                    height: "4.2rem",
                    preload:false,
                    source:source.value||null,
                    isLive: false,
                    mediaType:'video',
                    rePlay:false,
                    playsinline:true,
                    extraInfo:{
                        "x5-playsinline":"true"
                    },
                    autoplay:false,
                    x5_type:"h5",
                    x5_video_position:'center',
                    x5_fullscreen:false,
                    controlBarVisibility:'always',
                    cover:courseData.value.surfacePlot||null           
                };
            }else{
                props = {
                    id: "player-con",
                    preload:true,
                    width: "100%",
                    height: "4.2rem",
                    autoplay: false,
                    source:source.value,
                    isLive: false,
                    mediaType:'audio',
                    x5_fullscreen:false,
                    useH5Prism:true,
                    playsinline:true,
                    extraInfo:{
                        "x5-playsinline":"h5"
                    },
                    x5_type:"h5",
                    cover:courseData.value.surfacePlot||null 
                }
            }
            var player = new Aliplayer(props,(player)=>{   
                if(!isPalyStart.value){
                    player.seek(Number(seekLastTime.value));  
                    console.log("isFirst.value",isFirst.value)
                    if(!isFirst.value){
                        console.log("自动开启3");
                        player.play();
                    }
                }                              
            });
            //播放完毕事件 
            player.on("ended", (e)=>{
                isPalyStart.value = false;
                isPlayAutoChangeType(false);
                savePeriodStudyRecords();
            });
            //暂停事件          
            player.on('pause', (e)=>{ 
                isPalyStart.value = false;
                isPlayAutoChangeType(false);
                savePeriodStudyRecords();
            });         
            //获取当前的播放时刻，返回的时间单位：秒。     
            player.on('timeupdate', (e)=>{ 
                //player.getCurrentTime()  //获取当前时间
                var times = Math.floor(player.getCurrentTime()); 
                if(palyGetCourrTime.value!=times){
                    palyGetCourrTime.value = times;
                        var times2 = periodList.value[periodListIndex.value].targetDuration;
                        bilinums.value = 100/times2;
                        autoMoves(times);
                        if(audVidType.value==2){
                            totalDuration.value = times2;
                            totalDurationStr.value = formatSeconds(times2);                       
                            curDuration.value = times;
                            curDurationStr.value = formatSeconds(times);
                        }
                    studyPointList.value.push(times);
                };
            });
            //开始播放事件
            player.on("play",(e)=>{ 
                isPalyStart.value = true;
                isPlayAutoChangeType(true);
            }); 
            playerObj.value=player;          
        }
        const isPlayAutoChangeType = (cur)=>{
            if(audVidType.value!=1){
                if(cur){
                    audioSwitch.value = true;
                    audioSwitchBox.value = true;
                    anudioBoxTimer.value = setTimeout(() => {
                        audioSwitchBox.value = false;
                    }, 4000);
                }else{
                    clearTimeout(anudioBoxTimer.value);
                    audioSwitch.value = false;
                    audioSwitchBox.value = true;
                }
            }
        }
        //计算音频移动
        const autoMoves = (time)=>{
            processCurValue.value = bilinums.value*time;
        }
        const getCourseUrl = ()=>{
                let query = {
                    definitionType:1,
                    periodId:periodId.value,
                    courseId:courseData.value.id
                }
                proxy.$http.post(proxy.$server.getResoursePlayUrl,query,{userId:userData.value.userid,token:userData.value.accessToken}).then(res=>{
                    if(res.status==200){
                        if(res.data.status==200){
                            source.value = res.data.content;
                            isNoUrlState.value = false;
                            studyPointList.value =[];
                            if(audVidType.value==2){
                                totalDuration.value = 0;
                            }
                            playerRender();
                            if(isFirst.value){
                                 setTimeout(() => {
                                    isFirst.value = false;
                                 },400)
                            }else{
                                if(!isPalyStart.value){
                                    setTimeout(() => {
                                        if(Number(seekLastTime.value)){
                                                playerObj.value.seek(Number(seekLastTime.value));  
                                            }    
                                            if(!isPalyStart.value){
                                                console.log("自动开启4");
                                                playerObj.value.play();
                                            }    
                                        }, 400);
                                }
                            }
                        }else{
                            if(playerObj.value){
                                playerObj.value.dispose();//销毁以前的播放器
                                playerObj.value=null;
                            }
                            studyPointList.value =[];
                            totalDuration.value = 0;
                            isNoUrlState.value = true;
                        }                           
                    }
                })           
        }        
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
        /**
         * 动态加载ali JS
         */
        const loadAliScript=()=>{
            if(loadAliScriptFlag.value){
                return false;
            }
            loadScript('//g.alicdn.com/de/prismplayer/2.8.1/aliplayer-min.js').then(()=>{
                loadAliScriptFlag.value = true;
            }).catch(()=>{
                loadAliScriptFlag.value = false;
                setTimeout(()=>{
                    loadAliScript()
                },1000)
            })
        }
        // returnEven,
        // shareEven,
        const returnEven = ()=>{
                // router.push({
                // //传递参数使用query的话，指定path或者name都行，但使用params的话，只能使用name指定 
                //     path:'/'
                // }) 
                savePeriodStudyRecords(toPaths('/',{}));
        }
        const toPaths = (pathInfo,obgs)=>{
                if(playerObj.value){
                    playerObj.value.dispose();//销毁以前的播放器
                    playerObj.value=null;
                }            
                router.push({
                //传递参数使用query的话，指定path或者name都行，但使用params的话，只能使用name指定 
                    path:pathInfo,
                    query:obgs
                })            
        }
        const shareEven = ()=>{
            dialogVisbile.value = true;
        }
        const share = async ()=>{
            let huanjinType = window.location.href.indexOf('xgxm.xueguoxue.com')>0?true:false;
            if(huanjinType){
                link.value = `https://xgxm.xueguoxue.com/h5/talentshow/index.html?expertplanShareUser=${userData.value.userid}`
            }else{
                link.value = `https://scm.youfushuyuan.com/h5/talentshow/index.html?expertplanShareUser=${userData.value.userid}`
            }
            const message = {
                describe:'导航栏显示分享按钮',
                method:"share",
                params:{
                    title:'国学智慧达人计划',
                    desc:'达人课程分享',
                    link:link.value||window.location.href,
                    imgUrl:courseDetailsImgs.value  
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
        provide('dialogVisbile',dialogVisbile);
        onMounted(()=>{
            loadScripts();
            loadAliScript();
            setuserData();
            share();
            getCourseInfo();
        })
      return{
        getCourseInfo,
        setuserData,
        placeOrder,
        tabs,
        closeEven,
        selectXiaojie,
        returnEven,
        shareEven,
        getCurValue,
        touchStart,
        touchEnd,
        share,
        loadScripts,
        clickAudioSwitch,
        touchProcess,
        prevResource,
        nextResource,
        // upOrDownTypeEven,
        //属性
        source,
        courseDetailsId,
        userData,
        courseData,
        tabsIndex,
        periodList,
        loadAliScriptFlag,
        playerObj,
        periodListIndex,
        isPalyStart,
        isNoUrlState,
        processCurValue,
        curDurationStr,
        totalDurationStr,
        dialogVisbile,
        audVidType,
        bilinums,
        videoCloseImg,
        videoOpenImg,
        audioSwitchBox,
        audioSwitch,
        // upOrDownType,
        heightNum,
        courseDetailsImgs,
        //视频进度条自定义修改使用属性
      }
    }
}
</script>
<style>
.prism-player .prism-cc-btn{
    display: none;
}
.prism-player .prism-volume{
    display: none;
}
.prism-player .prism-setting-btn{
    display: none;
}
.prism-player .prism-big-play-btn{
    display: none !important;
}
.prism-player .prism-fullscreen-btn{
    display: none !important;
}
.prism-player .prism-controlbar .prism-progress{
    display:none;
}
.andriod-player{
    width: 100%;
    position: absolute;
    top:0;
    left:0;
    object-fit:contain;
}
 .heightOne{
    max-height: 4.5rem;
    overflow-y: hidden;
}
/*.heightValTwo{
    max-height: 4.6rem;
    overflow-y: hidden;
} */
</style>
<style lang="less">
.detail{
  .video{
        height: 4.2rem;
        width: 100%;
        position: relative;
        .t_audio{
            padding: 0.22rem 0;
            position: absolute;
            bottom:0.75rem;
            left: 0;
            width: 100%;            
        }
        .t_video{
            padding: 0.22rem 0;
            position: absolute;
            bottom:0.72rem;
            left: 0;
            width: 100%;
        }
        .t{
            .processVideo{
                width: 7.23rem;
                height: 0.08rem;
                padding:0;               
                &::before{
                    position: absolute;
                    content:'';
                    width: 0.17rem;
                    height: 0.08rem;
                    top:0;
                    left: -0.14rem;
                    display: block;
                    background: #ee0a24;
                    z-index: 0;
                }
                &::after{
                    position: absolute;
                    content: '';
                    width: 0.17rem;
                    height: 0.08rem;
                    top: 0;
                    right: -0.14rem;
                    display: block;
                    background: #f4f4f4;
                    z-index: 0;
                }
            }
            .processAudio{
                width: 4rem;
                height: 0.08rem;
                padding: 0 0.25rem;                
                &::before{
                    position: absolute;
                    content:'';
                    width: 1.13rem;
                    height: 2px;
                    top:0;
                    left: -0.85rem;
                    display: block;
                    background: #f4f4f4;
                    z-index: 0;
                }
                &::after{
                    position: absolute;
                    content:'';
                    width: 1.13rem;
                    height: 2px;
                    top:0;
                    right: -0.85rem;
                    display: block;
                    background: #F4F4F4;
                    z-index: 0;
                }
            }
            .process{
                // width: 4rem;
                // height: 2px;
                // padding: 0 0.25rem;
                margin:0 auto;
                position: relative;
                .video-btn{
                    background: #ee0a24;
                    border-radius: 0.3rem;
                    height: 0.3rem;
                    width: 0.3rem;
                    position: relative;
                    box-sizing: content-box;
                    z-index: 3;
                    box-shadow: #fff 0 0 0.2rem;
                    &.big{
                        position: absolute;
                        bottom:0.4rem;
                        left: 0;
                        padding:0.2rem;
                        z-index: 3;
                    }
                }
                .audio-but{
                    background: #B4272D;
                    color:#fff;
                    border-radius: 0.5rem;
                    position: relative;
                    padding: 0 0.12rem;
                    box-sizing: content-box;
                    font-size: 0.24rem;
                    &.big{
                        position: absolute;
                        bottom:0.4rem;
                        left: 0;
                        padding:0.2rem;
                        z-index: 3;
                    }
                }
            }
            .prve{
                width: 0.48rem;
                height: 0.48rem;
                padding:0.12rem;
                position: absolute;
                top:0;
                left: 0.24rem;
                i{
                    display: block;
                    height: 100%;
                    width: 100%;
                    background: url('../assets/images/prev.png')no-repeat 50% 50% / cover;
                }
            }
            .next{
                width: 0.48rem;
                height: 0.48rem;
                padding:0.12rem;
                position: absolute;
                top:0;
                right: 0.24rem;
                i{
                    display: block;
                    height: 100%;
                    width: 100%;
                    background: url('../assets/images/next.png')no-repeat 50% 50% / cover;
                }
            }
        }
      .imgflex{
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: row;
          padding: 0.2rem 0.3rem;
          z-index:9999;
          .img1{
              width: 0.48rem;
              height: 0.48rem;
          }
          .img2{
              width: 0.48rem;
              height: 0.48rem;
          }
      }
      .positionImg{
          width: 100%;
          height: 100%;
          .img1{
            width: 100%;
            height: 100%;
          }
          .img2{
            width: 1.2rem;
            height: 1.2rem;
            position:absolute;
            left:0;
            right:0;
            top:0;
            bottom:0;
            margin:auto;
          }
      }
      .audio-playe{
          width: 100%;
          height: 100%;
          position: relative;
          .img1{
            width: 100%;
            height: 100%;
          }
          .divSwitchBox{
            width: 100%;
            height: 100%;    
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            .img2{
                width: 1.1rem;
                height: 1.1rem;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
            }
          }
      }
  }
  .conten{
    //   height:calc(100vh - 4.2rem);
      background: #f4f4f4;
      .one{
        //   height: 2.6rem;
          padding: 0 0.3rem;
          background: #fff;
          .one_1{
              border-bottom: 0.02rem solid #F4F4F4;
              overflow: hidden;
              zoom: 1;
              .tabCss{
                float: left;
                font-size: 0.32rem;
                width: 50%;
                text-align: center;
                position: relative;
                height: 0.96rem;
                line-height: 0.96rem;
                font-weight: 700;
                .botCss{
                  width: 0.4rem;
                  height: 0.06rem;
                  border-radius: 0.1rem;
                  background: #CC0033;
                  position: absolute;
                  bottom: 0;
                  left: 1.52rem;
                }
              }
          }
          .one_2{
              text-align: left;
              padding: 0.28rem 0;
              .p1{
                  font-size: 0.32rem;
                  color: #333;
                  font-weight: 700;
              }
              .p2{
                  font-size: 0.26rem;
                  color: #999;
                  margin-top: 0.2rem;
              }
          }
      }
      .two{
        margin-top: 0.1rem;
        padding: 0.4rem 0.3rem 0;
        background: #fff;
        min-height:calc(100vh - 6.8rem);
        .two_1{
            border-left: 0.04rem solid #CC0033;
            font-size: 0.3rem;
            margin-bottom: 0.3rem;
            line-height: 1; 
            text-align: left;
            font-weight: 700;
            padding-left: 0.2rem;
        }
        .two_2{
            text-align:initial;
            padding-bottom: 1rem;
        }
      }
      .three{
          padding: 0.2rem 0.3rem 1.3rem;
          background: #fff;
          min-height:calc(100vh - 5.28rem);
          .directoryLi{
              margin-bottom: 0.3rem;
              .row1{
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    font-size: 0.3rem;
                    font-weight: 700;
                    margin-bottom: 0.2rem;
                    >div:nth-child(1){
                        width: 1.2rem;
                        text-align: left;
                        margin-right: 0.3rem;
                    }
                    >div:nth-child(2){
                        width: 6rem;
                        text-align: left;
                        white-space:nowrap;
                        overflow:hidden;
                        text-overflow:ellipsis;
                    }
              }
              .row2{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    .row2One{
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                        .times{
                            font-size: 0.24rem;
                            color: #9A9A9A;
                        }
                        .progress{
                            margin-left: 0.2rem;
                            color: #CC0033;
                            font-size: 0.22rem;
                        }
                    }						
                    .is-try{
							padding: 0.1rem;
							i{
								width: 0.4rem;
								height: 0.4rem;
								display: block;
								background: url('../assets/images/period-play.png')no-repeat 50% 50% / cover;
								&.playing{
									background: url('../assets/images/playing.gif')no-repeat 50% 50% / cover;
								}
							}
                        }
                    
                    .is-try p{
                        width: .8rem;
                        height: .48rem;
                        background-color: #C52D3B;
                        color: #fff;
                        box-shadow: .02rem .02rem .09rem rgba(197,45,59,0.46);
                        border-radius: .3rem;
                        text-align: center;
                        line-height: .48rem;
                        font-size: 0.24rem;
                    }
                    .is-lock {
                        padding: 0.1rem;
                        i{
                            display: block;
                            width: 0.48rem;
                            height: 0.48rem;
                            background: url('../assets/images/period-lock.png')no-repeat 50% 50% / cover;
                        }
                    }
              }
          }
      }
    //   .upOrDownIcon{
    //       text-align: center;
    //       font-size: 0.32rem;
    //       height: 1rem;
    //       line-height: 1rem;
    //   }
  }
  .florBox{
    position: fixed;
    bottom: 0.26rem;
    width: 6.9rem;
    height: 0.8rem;
    text-align: center;
    line-height: 0.8rem;
    font-size: 0.32rem;
    color: #fff;
    background: #C30D23;
    margin-left: 0.3rem;
    border-radius: 0.8rem;
  }
}
</style>
