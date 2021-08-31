<template>
  <div id="app">
    <router-view :key="$route.fullPath" v-if="isRouterAlive"/>
  </div>
</template>

<script>
import utils from './utils'
function getQueryString(key){
  var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
  var result = window.location.search.substr(1).match(reg);
  return result?decodeURIComponent(result[2]):null;
}
export default {
  name: 'App',
  data(){
    return{
      isRouterAlive:true,
    }
  },
  watch:{
    $route(cur){
      this.share();
      if(cur.name=='order'){
        this.getOpenId();
      }
    }
  },
  provide(){
    return{
      reload:this.reload
    }
  },
  created(){
    this.isWechatBrowser()
    this.alipayRedirect();
    this.share()
  },
  mounted(){
    // var lastTouchEnd = 0;
    // document.addEventListener('touchstart', function(event) {
    //     if (event.touches.length > 1) {
    //         event.preventDefault();
    //     }
    // });
    // document.addEventListener('touchend', function(event) {
    //     var now = (new Date()).getTime();
    //     if (now - lastTouchEnd <= 300) {
    //         event.preventDefault();
    //     }
    //     lastTouchEnd = now;
    // }, false);
    // // 阻止双指放大
    // document.addEventListener('gesturestart', function(event) {
    //     event.preventDefault();
    // });
  },
  methods:{
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(()=>{
        this.isRouterAlive = true;
      })
    },
    share(){
      if(!window.wx) return;
      let url = encodeURIComponent(window.location.href.split('#')[0]);
      let path = `/wx/getConfig?url=${url}`
      const uInfo = utils.getUser()
      if(uInfo){
        path = `/wx/getConfig?url=${url}&userId=${uInfo.id}`
      }
      this.$http.get(path).then(res=>{
        if(res.data.status == 200){
          let data = res.data.content;
          let title = `十一不出门，我要闭关了！`;
          let desc = '或许你也需要一次闭关……';
          let link = window.location.href;
          let imgUrl = 'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/%E5%88%86%E4%BA%AB%E5%9B%BE.png'
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
                    
                },
                cancel: function () {

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
      let ua = window.navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
        let openId = localStorage.getItem('activityOpenId')
        if(openId) return false;
        let wxcode = getQueryString('code')
        if(!wxcode){
          let redirect_uri = encodeURIComponent(window.location.href)
          let link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.$server.appId}&redirect_uri=`+redirect_uri+'&response_type=code&scope=snsapi_base&state=#wechat_redirect&connect_redirect=1'
          window.location.replace(link)
        }else{
          this.getOpenId()
        }
      }
    },
    getOpenId(){
      let wxcode = getQueryString('code');
      if(!wxcode) return;
      this.$http.post(this.$server.getOpenId,{code:wxcode}).then(res=>{
        if(res.data.status==200){
          localStorage.setItem('activityOpenId',res.data.content.openId)
        }
      })
    },
    /**
     * 支付宝支付回调
     */
    alipayRedirect(){
      if(window.location.href.includes('alipay.trade.wap.pay.return')){
        const toast = this.$toast.loading({
          duration: 0,
          forbidClick: true,
        });
        sessionStorage.setItem('from','index')
        let url = this.$server.link+`result?flag=success`
        setTimeout(()=>{
          this.$toast.clear()
          window.location.replace(url)
        },1000)
      }
    }
  }
}
</script>

<style lang="scss">
*{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
html,body,#app{
  position: relative;
  width: 100%;
  height: 100%;
}
html{
  background: #fff;
  font-size: 50px;
}
body{
  max-width: 414px;
  margin:0 auto;
}
.clearfix{*zoom:1;}
.clearfix:after{content: "";display: block;clear: both;}
img{
  width: 100%;
  max-width: 100%;
}
.textEllipsis{    
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    line-clamp: 1;}
.van-toast--loading{height: 0.8rem!important;width: 0.8rem!important;min-height: auto;}
.loading{background: #fff;position: absolute;top:40%;left:50%;transform:translate(-50%,-50%);-webkit-animation: loader 1s ease-in-out infinite;animation: loader 1s ease-in-out infinite;-webkit-animation-delay: 0.4s;animation-delay: 0.4s;width: 10px;height: 20px;}
.loading:after,.loading:before {content: '';display:block;position: absolute;width: inherit;height: inherit;background: #fff;-webkit-animation: inherit;animation: inherit;}
.loading:before {right: 15px;-webkit-animation-delay: 0.2s;animation-delay: 0.2s;}
.loading:after {left: 15px;-webkit-animation-delay: 0.6s; animation-delay: 0.6s;}
.loading-wrap{position: fixed;top:0;left: 0;width: 100%;height: 100vh;z-index: 9;}
.loading-wrap.hidden{opacity: 0;visibility: hidden;transition:opacity 0.3s linear,visibility 1ms 0.4s}
@-webkit-keyframes loader {
    0%, 100% {
        box-shadow: 0 0 0 #fff, 0 0 0 #fff;
    }
    50% {
        box-shadow: 0 -5px 0 #fff, 0 5px 0 #fff;
    }
}
@keyframes loader {
    0%, 100% {
        box-shadow: 0 0 0 #fff, 0 0 0 #fff;
    }
    50% {
        box-shadow: 0 -5px 0 #fff, 0 5px 0 #fff;
    }
}
@keyframes loading {
      0%{-webkit-transform:rotate(0deg);}
      25%{-webkit-transform:rotate(90deg);}
      50%{-webkit-transform:rotate(180deg);}
      75%{-webkit-transform:rotate(270deg);}
      100%{-webkit-transform:rotate(360deg);}
}
</style>

