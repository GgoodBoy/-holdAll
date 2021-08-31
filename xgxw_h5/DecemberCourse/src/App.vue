<template>
  <div id="app">
    <router-view></router-view>
    <Poster></Poster>
    <div class="down-tips" v-if="posterShow">长按保存，分享给好友</div>
  </div>
</template>
<script>
import Poster from '@/components/Poster.vue'
import tools from './utils/tools.js'
import env from '../config/prod.env'
import {store,mutations} from './store'
  export default{
    data(){
      return{
        loadScriptFlag:false
      }
    },
    computed:{
      posterShow(){
        return store.posterShow;
      },
    },
    components:{Poster},
    created(){
      if(this.$server.env=='dev'){
        let meta = document.createElement('meta');
        meta.content = 'no-referrer';
        meta.name = 'referrer';
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
      document.body.addEventListener('touchstart', function(){}, false)
      document.addEventListener('gesturestart', function(event) {
        event.preventDefault();
      });
      this.loadScript()
      this.loadBaiduScript()
      let channelType = env.page.find(item=>window.location.href.includes(item.name)).channelId;
      this.pointPage(channelType)
    },
    methods:{
      //打点
      async pointPage(channelType){
        const query = {
          channelType:channelType
        }
        const res = await this.$http.post(this.$server.pointPage,query)
      },
      /**
       * button打点
       */
      async pointButton(type){
        const query = {
          type:type
        }
        const res = await this.$http.post(this.$server.pointButton,query)
      },
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
       * 根据渠道动态加载百度统计代码
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
     * 分享
     */
    share(){
      let message = {
        describe:'导航栏显示分享按钮',
        method:"share",
        params:{
          title:'《菜根谭》上新福利周',
          desc:'每日咬得菜根，则百事可做。教你50招处世哲学',
          link:window.location.href,
          imgUrl:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20200222/Week%20of%20welfare.icon.png'     
       }
      }
      if(!window.pointShareButton){
        window.pointShareButton = ()=>{
          this.pointButton(1)
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
      let url = encodeURIComponent(window.location.href.split('#')[0]);
      this.$http.get(`/wx/getConfig?url=${url}`).then(res=>{
        if(res.data.status == 200){
            let data = res.data.content;
            let title = `《菜根谭》上新福利周`;
            let desc = `每日咬得菜根，则百事可做。教你50招处世哲学`;
            let link = window.location.href;
            let imgUrl = 'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20200222/Week%20of%20welfare.icon.png'
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
                    this.pointButton(1)
                  }
              });
              wx.onMenuShareTimeline({
                  title: title,
                  link: link,
                  imgUrl: imgUrl,
                  success: ()=>{
                    this.pointButton(1)
                  },
              })
              wx.onMenuShareQQ({
                  title: title,
                  desc: desc,
                  link: link,
                  imgUrl: imgUrl,
                  success:()=>{
                    this.pointButton(1)
                  },
                  cancel: function () {
                  
                  }
              });
          })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  *{
    margin:0;
    padding:0;
    box-sizing: border-box;
    letter-spacing: 0;
  }
  html{
    width: 100%;
    font-size: 55.2px;
    height: 100%;
  }
  body{
    width:100%;
    height: 100%;
    max-width: 768px;
    margin:0 auto;
  }
  #app{
    background: #E4ECF0;
    width: 100%;
    height: 100%;
  }
  img{
    width: 100%;
    max-width: 100%;
    display: block;
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
  @font-face {
  font-family: 'my-font';
  src: url('./assets/font/test.ttf'); 
  } 
  .van-toast{
    top:40%!important;
  }
  .down-tips{
    position: fixed;
    bottom:0;
    left: 0;
    width: 100%;
    height: 1.06rem;
    line-height: 1.06rem;
    text-align: center;
    font-size: 0.28rem;
    color:#333;
    text-align: center;
    background: #fff;
    box-shadow: 0 0.15rem 0.4rem 0.09rem #333333;
    z-index: 3;
    user-select: none;
  }
</style>