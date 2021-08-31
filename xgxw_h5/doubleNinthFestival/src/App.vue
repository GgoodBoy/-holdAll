<template>
  <div id="app">
    <template v-if="isRouterAlive">
      <!-- <audio :src="musicSrc" ref="musicRef" class="audio" ></audio> -->
      <div class="music" :class="{'show':showFlag,'play':playFlag}" @click="playEvent">
        <i></i>
      </div>
      <router-view :key="$route.fullPath" />
    </template>
    <p class="page-tips" v-else>请在微信内打开此链接</p>
  </div>
</template>
<script>
import {store,mutations} from './store'
const getQueryString = (key)=>{
  const reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
  const result = window.location.search.substr(1).match(reg);
  return result?decodeURIComponent(result[2]):null;
}
export default {
  name: 'App',
  data(){
    return{
      isRouterAlive:true,
      musicSrc:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/kongdan/123.mp3',
      showFlag:false,
      playFlag:false,
      player:'',
      people:0
    }
  },
  computed:{
    userInfo(){
      return store.userInfo
    }
  },
  created(){
    let ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
      if(this.$server.env != 'dev'){
        this.isWechatBrowser();
        this.point()
      }
    }else{
      this.isRouterAlive = false;
    }
  },
  mounted(){
    // setTimeout(()=>{
    //   this.setUserInfo({
    //     nickname:'林俊杰'
    //   });
    //   this.point()
    //   this.musicEvent()
    // },1000)
  },
  methods:{
    setUserInfo:mutations.setUserInfo,
    setPeople:mutations.setPeople,
    musicEvent(){
      let dom = document.createElement('audio');
      dom.src = this.musicSrc;
      dom.className = 'audio'
      dom.loop = 'loop';
      document.querySelector('#app').appendChild(dom);
      this.player = dom;
      this.player.addEventListener('canplay',(e)=>{
        this.showFlag = true;
      })
      this.player.play();
      if (window.WeixinJSBridge) {
        WeixinJSBridge.invoke('getNetworkType', {}, (e)=>{
          this.player.play()
        }, false);
      } else {
        document.addEventListener("WeixinJSBridgeReady", ()=>{
          WeixinJSBridge.invoke('getNetworkType', {},(e)=>{
            this.player.play()
          });
        }, false);
      }
      this.player.addEventListener('play',(e)=>{
        this.playFlag = true;
      })
      this.player.addEventListener('pause',(e)=>{
        this.playFlag = false;
      })
    },
    playEvent(){
      if(this.playFlag){
        this.player.pause()
      }else{
        this.player.play()
      }
    },
    point(){
      let query = {
        type:0
      }
      this.$http.post(this.$server.point,query).then(res=>{
        if(res.data.status==200){
          this.people = res.data.content.num;
          this.share()
          this.setPeople(res.data.content.num)
        }
      })
    },
    share(){
      let url = encodeURIComponent(window.location.href.split('#')[0]);
      this.$http.get(`/wx/getConfig?url=${url}`).then(res=>{
        if(res.data.status == 200){
            let data = res.data.content;
            let title = `我是${this.userInfo.nickname}，我在重阳节为家人祈福`;
            let desc = `已有${this.people}人为家人送出祝福`;
            let link = window.location.origin+window.location.pathname;
            let imgUrl = 'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/kongdan/cyj.png'
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
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success:()=>{
                    }
                });
                wx.onMenuShareTimeline({
                    title: title, // 分享标题
                    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: imgUrl, // 分享图标
                    success: ()=>{
                    },
                })
                wx.onMenuShareQQ({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: link, // 分享链接
                    imgUrl: imgUrl, // 分享图标
                    success:()=>{
                    },
                    cancel: function () {
                    // 用户取消分享后执行的回调函数
                    }
                });
            })
        }
      })
    },
    /**
     * 是否是微信浏览器，是的话去获取openId
     */
    isWechatBrowser(){
      let userInfo = localStorage.getItem('h5_userInfo')
      if(userInfo){
        this.setUserInfo(JSON.parse(userInfo));
        setTimeout(()=>{
          this.musicEvent()
        },1)
        return;
      }
      let ua = window.navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
        let wxcode = getQueryString('code')
        if(!wxcode){
          var redirect_uri = encodeURIComponent(window.location.href)
          let link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.$server.appId}&redirect_uri=`+redirect_uri+'&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect&connect_redirect=1'
          window.location.replace(link)
        }else{
          this.$http.post(this.$server.verifyIsFollow,{code:wxcode}).then(res=>{
            if(res.data.status==200){
              const data = res.data.content;
              localStorage.setItem('h5_userInfo',data)
              this.setUserInfo(JSON.parse(data));
              this.musicEvent()
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @font-face{
    font-family: 'jiangxi';
    src : url('./assets/font/test.ttf');
  }
 *{
  margin:0;
  padding:0;
  box-sizing: border-box;
  letter-spacing: 0;
}
body,html,#app{
  height: 100%;
  width: 100%;
  color:#000;
}
.fl{float: left!important;}
.clearfix{*zoom:1;}
.clearfix:after{content: "";display: block;clear: both;}
img{
  width: 100%;
  max-width: 100%;
  -moz-user-select: none; 
  -webkit-user-select: none; 
  -ms-user-select: none; 
  -khtml-user-select: none; 
  user-select: none;
}
.text-overflow{    
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}
.music{
  position: fixed;
  top:0.3rem;
  left: 0.3rem;
  border:1px solid #fff;
  border-radius: 50%;
  padding: 0.06rem;
  z-index: 5;
  opacity: 0;
  &::after{
    display: block;
    content:'';
    width: 1px;
    height: 100%;
    background: #fff;
    position: absolute;
    top:0;
    left:50%;
    transform: rotate(-45deg);
  }
  &.show{
    opacity: 1;
  }
  &.play{
    animation: circle 3s linear both infinite;
    &::after{
      display: none;
    }
  }
  i{
    display: block;
    width: 0.4rem;
    height: 0.4rem;
    background: url('./assets/image/music.png')no-repeat 50% 50% / cover;
  }
}
.page-tips{
  font-size: 0.4rem;
  text-align: center;
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 100%;
  color:#999;
}
.audio{
  position: absolute;
  top:-1000px;
  left: 0;
  opacity: 0;
}
@keyframes circle {
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(-360deg);
  }
}
.slide-top-enter,.slide-top-leave-to{
    transform: translateY(100%);
}
.slide-top-enter-to,.slide-top-leave{
    transform:translateY(0)
}
.slide-top-enter-active,.slide-top-leave-active{
    transition: all 5s;
}
@keyframes scaleBtn {
    0%{
      transform: scale(1);  
    }
    25%{
      transform: scale(1.05);  
    }
    50%{
      transform: scale(1);  
    }
    75%{
      transform: scale(1.05);  
    }
    100%{
      transform: scale(1);  
    }
}
</style>

