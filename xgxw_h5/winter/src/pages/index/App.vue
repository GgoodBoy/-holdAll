<template>
  <div id="app">
    <div class="loading-wrap" :class="{'hidden':pageShow}">
      <div class="loading"></div>
    </div>
    <div class="wrap">
      <div class="share-btn" ref="shareBtn" data-clipboard-action="copy" :data-clipboard-target="`#input`" @click="shareEvent"></div>
      <img :src="bgd" class="bgd"/>
      <div class="content">
        <div class="edition">
          <div class="adult" :class="{'active':mtype==1}" @click="mtype=1"></div>
          <div class="child" :class="{'active':mtype==2}" @click="mtype=2"></div>
        </div>
        <div class="classify-box">
          <div class="item" v-for="(item,index) in classifyList" :key="index" :class="{'active':item.active}" @click="chooseClassify(index)">{{item.name}}</div>
        </div>
        <div class="course-list">
          <div class="course-item" v-for="(item,index) in courseList" :key="index" @click="goCourse(item.id)">
            <div class="surface">
              <img :src="item.surfacePlot"/>
            </div>
            <div class="info">
              <p class="title">{{item.title}}</p>
              <div class="price">
                <p class="ori-price">{{item.sellingPrice}}元</p>
                <p class="sale-price"><span class="money">{{item.nowPrice}}</span><span class="unit">元</span></p>
              </div>
            </div>
          </div>
        </div>
        <myLoading v-if="loading" />
        <p class="tips" v-if="finished&&courseList.length==0">暂无课程~</p>
      </div>
    </div>
    <transition name="fade">
      <div class="share-dialog" v-if="dialogVisbile" @click="dialogVisbile=false">
        <i class="share-arrow"></i>
        <p class="tip3">请点击上方{{inApp?'按钮':'···'}}发送给朋友</p>
      </div>
    </transition>
    <input id="input" :value="link" readonly/>
    <transition name="fade">
      <p class="toast" v-if="message.length>0">{{message}}</p>
    </transition>
  </div>
</template>
<script>
import tools from '../../utils/tools.js'
import bgd from '../../assets/image/bgd.png'
import Clipboard from 'clipboard'
const page = [
  {name:'channel1',des:'app端',channelType:1,src:'https://hm.baidu.com/hm.js?5f7a5b2ba28a077521d73b9eacf1675d'},
  {name:'channel2',des:'M站',channelType:2,src:'https://hm.baidu.com/hm.js?4a8e7d10d0164beb7fdc86ac6bb32c8f'},
  {name:'channel3',des:'微信群、朋友圈',channelType:3,src:'https://hm.baidu.com/hm.js?487cf8371d5549d3cb7e560aab4a1195'},
  {name:'channel4',des:'微信公众号',channelType:4,src:'https://hm.baidu.com/hm.js?12e378e874df84cc19eef6afc4dc6cc2'}
]
const myLoading = {
  data(){
    return{

    }
  },
  template:'<div class="my-loading"><div class="item" v-for="item in 12" :key="item"></div></div>'
}
export default {
  name: 'App',
  components:{
    myLoading
  },
  data(){
    return{
      loadScriptFlag:false,
      pageShow:false,
      bgd:bgd,
      mtype:1,
      classId:'',
      pageNo:1,
      pageSize:10,
      finished:false,
      loading:false,
      adultClassify:[],
      childClassify:[],
      classifyList:[],
      courseList:[],
      httpFlag:false,
      dialogVisbile:false,
      inApp:false,
      inOther:false,
      clipboard:'',
      link:'',
      message:''
    }
  },
  watch:{
    mtype(cur,old){
      this.classifyList = cur==1?[...this.adultClassify]:[...this.childClassify];
      this.classId = this.classifyList.find(item=>item.active==true).id;
      this.pointButton(cur)
    },
    classId(cur,old){
      this.pageNo = 1;
      this.loading = false;
      this.finished = false;
      this.courseList = []
      this.$nextTick(()=>{
        this.searchCourseList()
      })
    }
  },
  created(){
    if(this.$server.env=='dev'){
      let meta = document.createElement('meta');
      meta.content = 'no-referrer';
      meta.name = 'referrer';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    this.loadScript();
    this.getclassifyId();
    this.appjudge();
    document.body.addEventListener('touchstart', function(){}, false)
    document.addEventListener('gesturestart', function(event) {
      event.preventDefault();
    });
    const image = new Image()
    image.src = this.bgd;
    image.onload = () => {
      document.documentElement.scrollTop = document.body.scrollTop = 0;
      setTimeout(()=>{
        this.pageShow = true;
      },1000)
    }
    window.onscroll = ()=> {
      if(this.httpFlag||this.finished) return;
      var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
      if(scrollTop+windowHeight>=scrollHeight){
        this.searchCourseList()
      }
    }
  },
  mounted(){
    let channelType = page.find(item=>window.location.href.includes(item.name)).channelType;
    this.pointChannel(channelType)
    this.loadBaiduScript()
    this.link = window.location.href;
    this.clipboard = new Clipboard(this.$refs.shareBtn)
  },
  methods:{
    /**
     * 根据渠道动态加载百度统计代码
     */
    loadBaiduScript(){
      const src = page.find(item=>window.location.href.includes(item.name)).src;
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
     * 判断是否在APP内部
     */
    appjudge(){
      const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
      if(isIos){
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
      let ua = navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
        this.inOther = true;
      }else if (ua.includes('weibo')){
        this.inOther = true;
      }else{
        this.inOther = false;
      }
    },
    /**
     * 获取分类
     */
    async getclassifyId(){
      const res = await this.$http.post(this.$server.getclassifyId,{})
      if(res.data.status==200){
        this.adultClassify = [...res.data.content.adult];
        this.childClassify = [...res.data.content.child];
        this.adultClassify.push({
          name:'其他',
          id:'-1'
        })
        this.adultClassify.forEach(item=>item.active = false);
        this.adultClassify[0].active = true;
        this.childClassify.push({
          name:'其他',
          id:'-1'
        })
        this.childClassify.forEach(item=>item.active = false);
        this.childClassify[0].active = true;
        this.classifyList = this.adultClassify;
        this.classId = this.classifyList[0].id;
      }
    },
    /**
     * 选择分类
     */
    chooseClassify(index){
      const obj = this.classifyList[index];
      this.classifyList.forEach(item=>item.active = false);
      obj.active = true;
      this.classId = obj.id;
      this.$set(this.classifyList,index,obj)
      const temp1 = [
        {name:'周易',type:3},{name:'国艺',type:4},{name:'文史',type:5},{name:'其他',type:9},
      ]
      const temp2 = [
        {name:'语文',type:6},{name:'国艺',type:7},{name:'诗词',type:8},{name:'其他',type:10},
      ]
      if(this.mtype==1){
        let type = temp1.find(item=>item.name==obj.name).type;
        this.pointButton(type)
      }else{
        let type = temp2.find(item=>item.name==obj.name).type;
        this.pointButton(type)
      }
    },
    /**
     * 搜索课程
     */
    async searchCourseList(){
      this.loading = this.httpFlag = true;
      const query = {
        mtype:this.mtype,
        classId:Number(this.classId),
        pageNo:this.pageNo,
        pageSize:this.pageSize
      }
      const res = await this.$http.post(this.$server.searchCourseList,query)
      this.loading = this.httpFlag = false;
      if(res.data.status==200){
        this.pageNo++;
        this.courseList = [...this.courseList,...res.data.content.list];
        this.courseList.forEach(item=>{
          let temp = (item.sellingPrice*100*item.timeLimitDiscount)/1000
          item.nowPrice = Math.round(temp*100)/100;
        })
        this.finished = res.data.content.isLastPage;
      }
    },
    /**
     * button打点
     */
    async pointButton(type,courseId,callback){
      const query = {
        type:type
      }
      if(courseId){
        query.courseId = courseId;
      }
      const res = await this.$http.post(this.$server.pointButton,query)
      if(res.data.status==200){
        if(callback){
          setTimeout(()=>{
            callback(courseId)
          },1)
        }
      }
    },
    /**
     * 去到课程详情
     */
    goCourse(courseId){
      this.pointButton(11,courseId,this.goCourseEvent)
    },
    goCourseEvent(courseId){
      const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
      if(isIos){
        try{
          window.webkit.messageHandlers.iOSAppMethodName.postMessage({
            describe:'去课程详情页',
            method:'goCourseDetail',
            params:{
              courseId:courseId,
              isCloseWebView:false	
            }
          }); 
        }catch(err){
          let link = this.$server.env == 'prod'?'https://xgxm.xueguoxue.com/#/course/':'https://scm.youfushuyuan.com/#/course/'
          window.location.href = link+courseId
        }
      }else{
        if(window.android){
          if(window.android.notify){
            let message = JSON.stringify({
              describe:'去课程详情页',
              method:'openLesson',
              params:{
                courseId:courseId,
                isCloseWebView:false		
              }
            })
            window.android.notify(message);
          }
        }else{
          let link = this.$server.env == 'prod'?'https://xgxm.xueguoxue.com/#/course/':'https://scm.youfushuyuan.com/#/course/'
          window.location.href = link+courseId
        }
      }
    },
    /**
     * 分享按钮
     */
    shareEvent(){
      this.pointButton(12)
      if(this.inApp||this.inOther){
        this.dialogVisbile = true;
      }else{
        if(this.message.length>0) return;
        const clipboard = this.clipboard;
        clipboard.on('success',()=>{
          this.message = '链接复制成功，快去粘贴给好友吧'
        });
        clipboard.on('error',(e)=>{
          this.message = '请手动复制页面地址，粘贴给微信好友'
        })
        setTimeout(()=>{
          this.message = ''
        },2000)
      }
    },
    /**
     * 分享打点
     */
    async pointChannel(channelType){
      const query = {
        channelType:channelType
      }
      const res = await this.$http.post(this.$server.pointChannel,query)
    },
    /**
     * 分享
     */
    share(){
      let message = {
        describe:'导航栏显示分享按钮',
        method:"share",
        params:{
          title:'初冬暖心福利',
          desc:'精选课程 限时8折',
          link:window.location.href,
          imgUrl:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/fengx.png'
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
            let title = `初冬暖心福利`;
            let desc = `精选课程 限时8折`;
            let link = window.location.href;
            let imgUrl = 'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/fengx.png'
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
  min-height: 100%;
}
img{
  width: 100%;
  max-width: 100%;
  display: block;
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
.loading{background: #fff;position: absolute;top:40%;left:50%;transform:translate(-50%,-50%);-webkit-animation: loader 1s ease-in-out infinite;animation: loader 1s ease-in-out infinite;-webkit-animation-delay: 0.4s;animation-delay: 0.4s;width: 10px;height: 20px;}
.loading:after,.loading:before {content: '';display:block;position: absolute;width: inherit;height: inherit;background: #fff;-webkit-animation: inherit;animation: inherit;}
.loading:before {right: 15px;-webkit-animation-delay: 0.2s;animation-delay: 0.2s;}
.loading:after {left: 15px;-webkit-animation-delay: 0.6s; animation-delay: 0.6s;}
.loading-wrap{position: fixed;top:0;left: 50%;transform: translate(-50%,0);;width: 100%;height: 100vh;z-index: 3;background: #E4ECF0;max-width: 768px;}
.loading-wrap.hidden{opacity: 0;visibility: hidden;transition:opacity 0.3s linear,visibility 1ms 0.4s}
.my-loading{  
      width: 20px;
      height: 20px;
      position: relative;
      margin:0 auto;
      .item{
          position: absolute;
          top: 0;
          left: 50%;
          height: 100%;
          animation: load 1.2s ease infinite;
          border:none;
          outline: none;
          &:nth-of-type(1){
              transform: rotate(30deg);
              opacity: 1;
              animation-delay:0.1s;  
          }
          &:nth-of-type(2){
              transform: rotate(60deg);
              opacity: 0.9375;
              animation-delay:0.2s;  
          }
          &:nth-of-type(3){
              transform: rotate(90deg);
              opacity: 0.875;
              animation-delay:0.3s;  
          }
          &:nth-of-type(4){
              transform: rotate(120deg);
              opacity: 0.8125;
              animation-delay:0.4s;  
          }
          &:nth-of-type(5){
              transform: rotate(150deg);
              opacity: 0.75;
              animation-delay:0.5s;  
          }
          &:nth-of-type(6){
              transform: rotate(180deg);
              opacity: 0.6875;
              animation-delay:0.6s;  
          }
          &:nth-of-type(7){
              transform: rotate(210deg);
              opacity: 0.625;
              animation-delay:0.7s;  
          }
          &:nth-of-type(8){
              transform: rotate(240deg);
              opacity: 0.5625;
              animation-delay:0.8s;  
          }
          &:nth-of-type(9){
              transform: rotate(270deg);
              opacity: 0.5;
              animation-delay:0.9s;  
          }
          &:nth-of-type(10){
              transform: rotate(300deg);
              opacity: 0.4375;
              animation-delay:1s;  
          }
          &:nth-of-type(11){
              transform: rotate(330deg);
              opacity: 0.375;
              animation-delay:1.1s;  
          }
          &:nth-of-type(12){
              transform: rotate(360deg);
              opacity: 0.3125;
              animation-delay:1.2s;  
          }
          &::before{
              display: block;
              width: 2px;
              height: 25%;
              margin: 0 auto;
              background-color: #888;
              border-radius: 40%;
              content: ' ';
          }
      }
  }          
  @-webkit-keyframes load{
      0%{
          opacity: 1;
      }            
      100%{
          opacity: 0.2;
      }        
  }
.wrap{
  padding-top:5.9rem;
  position: relative;
  .share-btn{
    position: absolute;
    cursor: pointer;
    -webkit-tap-highlight-color:transparent;
    z-index: 2;
    top:0.9rem;
    right: 0;
    background: url('../../assets/image/share.png')no-repeat 0% 50% /cover;
    width: 1.22rem;
    height: 0.7rem;
  }
  .bgd{
    position: absolute;
    top:0;
    left: 0;
  }
  .content{
    position: relative;
    z-index: 2;
    padding-bottom:0.2rem;
    .edition{
      text-align: center;
      font-size: 0;
      height: 1.12rem;
      .adult,.child{
        cursor: pointer;
        -webkit-tap-highlight-color:transparent;
        width: 2.6rem;
        height: 0.88rem;
        display: inline-block;
        vertical-align: middle;
        transition: all 0.3s;
        &.adult{
          margin-right: 0.26rem;
          background: url('../../assets/image/adult.png')no-repeat 50% 50% / cover;
        }
        &.child{
          margin-left: 0.26rem;
          background: url('../../assets/image/child.png')no-repeat 50% 50% / cover;
        }
        &.active{
          width: 3.3rem;
          height: 1.12rem;
        }
      }
    }
    .classify-box{
      margin-top:0.4rem;
      height: 1rem;
      background: #5C52BD;
      display: flex;
      align-items: center;
      justify-content: center;
      .item{
        -webkit-tap-highlight-color:transparent;
        cursor: pointer;
        width: 1.48rem;
        height: 0.64rem;
        line-height: 0.64rem;
        color:#837CCB;
        font-size: 0.33rem;
        text-align: center;
        margin:0 0.14rem;
        background: url('../../assets/image/classify_bgd.png')no-repeat 50% 50% / cover;
        &.active{
          color:#fff;
          background: url('../../assets/image/classify_bgd_active.png')no-repeat 50% 50% / cover;
        }
      }
    }
    .course-list{
      display: flex;
      margin:0.4rem 0 0 0;
      padding:0 0.28rem;
      justify-content: space-between;
      flex-wrap: wrap;
      .course-item{
        cursor: pointer;
        width: calc(calc(100% - 0.2rem)/2);
        height: 3.07rem;
        border-radius: 0.2rem;
        border:0.08rem solid #7C75CC;
        margin:0.2rem 0;
        &:nth-child(odd){
          margin-right: 0.1rem;
        }
        &:nth-child(even){
          margin-left: 0.1rem;
        }
        overflow: hidden;
        .surface{
          height: 1.7rem;
        }
        .info{
          height: calc(100% - 1.7rem);
          padding:0.1rem 0.15rem;
          position: relative;
          background: #fff;
          .title{
            font-size: 0.24rem;
            color:#333;
            line-height: 0.4rem;
          }
          .price{
            position: absolute;
            bottom:0;
            right: 0.15rem;
            font-size: 0;
            .ori-price{
              display: inline-block;
              color:#999999;
              font-size: 0.22rem;
              text-decoration: line-through;
              line-height:0.32rem;
              height:0.4rem;
            }
            .sale-price{
              display: inline-block;
              margin-left: 0.1rem;
              color:#D11008;
              .money{
                font-size: 0.32rem;
                font-weight: bold;
                height:0.4rem;
                line-height:0.32rem;
                position:relative;
                top:0.02rem;
              }
              .unit{
                font-size:0.22rem;
                display: inline-block;
                line-height:0.32rem;
              }
            }
          }
        }
      }
    }
    .tips{
      font-size: 0.24rem;
      text-align: center;
      color:#999;
    }
  }
}
.share-dialog{
  position: fixed;
  top:0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 768px;
  height: 100%;
  background: rgba(0,0,0,0.7);
  z-index: 6;
  .share-arrow{
    position: absolute;
    width: 1.2rem;
    height: 1.2rem;
    right: 0.1rem;
    top:0.3rem;
    background: url('../../assets/image/arrow.png')no-repeat 50% 50% /cover;
    transform: rotate(-90deg);
  }
  .tip3{
    position: absolute;
    right: 0.1rem;
    top:1.6rem;
    font-size: 0.32rem;
    color:#fff;
  }         
}
#input{
  opacity: 0;
  position: fixed;
  top:-1000px;
}
.toast{
  font-size: 0.28rem;
  line-height: 0.48rem;
  color:#fff;
  border-radius: 0.2rem;
  background: rgba(0,0,0,0.7);
  max-width: 80%;
  min-width: 2rem;
  text-align: center;
  padding:0.1rem 0.2rem;
  position: fixed;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  z-index: 4;
}
@keyframes loader {
    0%, 100% {
        box-shadow: 0 0 0 #fff, 0 0 0 #fff;
    }
    50% {
        box-shadow: 0 -5px 0 #fff, 0 5px 0 #fff;
    }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

