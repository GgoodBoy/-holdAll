<template>
  <div id="app" :class="{'no-scroll':ruleShow}">
    <div class="page-loading-wrap" :class="{'hidden':pageLoadingHidden}">
      <span></span><span></span><span></span>
    </div>
    <div class="wrap" v-if="pageShow">
      <template v-show="pageLoadingHidden">
        <div class="section1">
          <img :src="bgd1" class="bgd"/>
          <div class="content">
            <div class="header">
              <img :src="'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/logo.png'" class="logo"/>
              <img :src="'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/rule_icon.png'" class="rule-icon" @click="ruleEvent"/>
            </div>
            <p class="time">2020年12月19日-2021年1月31日</p>
            <div class="person-box">
              <div class="person1"></div>
              <div class="btn1" @click="testEvent"></div>
            </div>
            <div class="yun1"></div>
            <div class="flag1"></div>
            <div class="gan1"></div>
          </div>
        </div>
        <div class="section2">
          <img :src="bgd2" class="bgd"/>
          <div class="content">
            <div class="person-box">
              <div class="person2"></div>
              <div class="btn2" @click="shakeEvent"></div>
            </div>
            <div class="gan2"></div>
            <div class="flag2"></div>
            <div class="yun2"></div>
            <div class="yun3"></div>
            <div class="house"></div>
            <div class="version-box">
              <i class="active-bgd" :class="{'right':mtype==2}"></i>
              <div class="item" @click="mtype=1">成人版</div>
              <div class="item" @click="mtype=2">少儿版</div>
            </div>
            <div class="classify-box">
              <div class="item" v-for="(item ,index) in classifyList" :key="item.id" :class="{'active':item.active}" @click="chooseClassify(index)">{{item.name}}</div>
            </div>
          </div>
        </div>
        <div class="section3">
          <div class="content">
            <List
              :model="loading"
              :finished="finished"
              :emptyText="'暂无课程~'"
              :dataLength="courseList.length"
              :color="'#fff'"
              @load="searchCourseList"
            >
              <div class="course-list" :class="{'no-data':courseList.length==0&&finished}">
                <div class="course-item" v-for="(item,index) in courseList" :key="index">
                    <div class="course-item-block" @click="goCourse(item.id)">
                        <div class="t">
                          <img class="surface" :src="item.surfacePlot"/>
                        </div>
                        <div class="b">
                          <p class="title">{{item.title}}</p>
                          <div class="price clearfix">
                            <p class="original-price">{{item.sellingPrice}}元</p>
                            <p class="selling-price">{{item.nowPrice}}<span class="unit">元</span></p>
                          </div>
                        </div>
                    </div>
                </div>
              </div>
            </List>
          </div>
        </div>
      </template>  
    </div>
    <transition name="rule-show">
      <Rule v-if="ruleShow" :ruleShow.sync="ruleShow"/>
    </transition>
  </div>
</template>
<script>
import List from '@/components/List.vue'
import Rule from './rule.vue'
import tools from '@/utils/tools.js'
import env from '../../../config/prod.env'
export default {
  name: 'App',
  data(){
    return{
      pageLoadingHidden:false,
      pageShow:false,
      loadImageTime:0,//图片加载次数
      channelId:'',
      link:'',
      activityName:'doubleTwelve',
      bgd1:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/bgd1.png',
      bgd2:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/bgd2.png',
      bgd3:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/bgd3.png',
      loadScriptFlag:false,//加载JS
      isIos:false,//是否ios系统
      inApp:false,//是否在APP内
      userInfo:{},//用户信息
      mtype:1,//版本
      classifyList:[],
      childClassifyList:[],//少儿分类
      adultClassifyList:[],//成人分类
      classId:'',//分类ID
      loading:false,//list的loading
      pageNo:1,//list pageNo
      pageSize:10,//list pageSize
      finished:false,//list是否加载完毕
      courseList:[],//课程数据
      ruleShow:false,
    }
  },
  components:{List,Rule},
  watch:{
    mtype(cur){
      this.classifyList = cur==1?this.adultClassifyList:this.childClassifyList;
      this.classId = this.classifyList.find(item=>item.active==true).id;
      this.pointButton(cur)
    },
    userInfo(cur){
      if(cur.token){
        if(this.$server.env=='dev'){
          this.link = `http://172.16.120.1:8000/channel${this.channelId}.html?activityShareUserId=${this.userInfo.userId}`;
        }else if(this.$server.env=='beta'){
          this.link = `https://scm.youfushuyuan.com/h5/December12th/channel${this.channelId}/index.html?activityShareUserId=${this.userInfo.userId}`
        }else{
          this.link = `https://xgxm.xueguoxue.com/h5/December12th/channel${this.channelId}/index.html?activityShareUserId=${this.userInfo.userId}`
        }
        this.$nextTick(()=>{
          this.share()
        })
      }
    },
    classId(cur){
      this.courseList = []
      this.pageNo = 1;
      this.finished = false;
      this.$nextTick(()=>{
        this.searchCourseList()
      })
    }
  },
  created(){
    this.channelId = env.page.find(item=>item.name==window.location.href.match(/channel\d+/)[0]).channelId;
    this.pointPage(this.channelId);
    this.init();
    const imageArr = [
      'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/bgd1.png',
      'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/bgd2.png',
      'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/bgd3.png',
      'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/person1.png',
      'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/person2.png',
      'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/person2.png',
      'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/flag1.png',
      'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/flag2.png',
      'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/yun1.png',
      'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/yun2.png',
      'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/yun3.png'
    ];
    this.loadImage(imageArr)
    this.getclassifyId()
    this.loadScript();
    this.loadBaiduScript();
  },
  methods:{
    /**
     * H5准备工作，H5渠道通用版
     */
    init(){
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
            this.pointVisit(this.channelId,userId)
          }
        }
      }else{
        let uInfo = this.$getCookie('uInfo');
        if(uInfo){
          this.userInfo = {
            userId:JSON.parse(uInfo).userid,
            token:JSON.parse(uInfo).accessToken,
            cellphone:JSON.parse(uInfo).cellphone
          }
          this.pointVisit(this.channelId,this.userInfo.userId)
        }
      }
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
    * 分享
    */
    async share(){
      const message = {
        describe:'导航栏显示分享按钮',
        method:"share",
        params:{
          title:'国学趣玩会',
          desc:'小夫子邀请你逛趣玩会，测一测、摇一摇、逛一逛任性疯玩，更有百余门课程抢免费。戳我直达->',
          link:this.link||window.location.href,
          imgUrl:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/12th.png'     
        }
      }
      if(!window.pointShareButton){
        window.pointShareButton = ()=>{
          //APP分享时渠道打点
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
    },
    /**
     * 提前加载图片
     */
    loadImage(imageArr){
      const length = imageArr.length;
      const time1 = new Date().getTime()
      for(const bgd of imageArr){
        const image = new Image()
        image.src = bgd;
        image.onload = () => {
          this.loadImageTime++;
          if(this.loadImageTime==length){
            const time2 = new Date().getTime();
            if(parseInt((time2 - time1)/1000)>=1){
              this.pageShow = true;
              setTimeout(()=>{
                this.pageLoadingHidden = true;
              },500)
            }else{
              this.pageShow = true;
              setTimeout(()=>{
                this.pageLoadingHidden = true;
              },1000)
            }
          }
        }
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
      const res = await this.$http.post(this.$server.pointPage,query)
    },
    /**
     * 访问次数打点(登录)
     */
    async pointVisit(channelType,userId){
      const query = {
        channelType:channelType,
        userId:userId
      }
      const res = await this.$http.post(this.$server.pointVisit,query,{userId:this.userInfo.userId,token:this.userInfo.token})
    },
    /**
     * button打点
     */
    async pointButton(type,callback,courseId){
      const query = {
        type:type
      }
      if(type==20){
        query.courseId = courseId
      }
      const res = await this.$http.post(this.$server.pointButton,query)
      if(res.data.status==200){
        if(callback && typeof callback==='function'){
          callback()
        }
      }else{
        this.$toast(res.data.message)
      }
    },
    /**
     * 规则
     */
    ruleEvent(){
      this.ruleShow = true;
      this.pointButton(3)
    },
    /**
     * 测一测
     */
    testEvent(){
      this.pointButton(9,()=>{
        let link;
        console.log(`channelId========`+this.channelId)
        console.log(`env========`+this.$server.env)
        if(this.$server.env=='dev'){
          link = `http://172.16.120.1:8000/test.html?channelId=${this.channelId}`
        }else if(this.$server.env=='beta'){
          link = `https://scm.youfushuyuan.com/h5/December12th/test/index.html?channelId=${this.channelId}`
        }else{
          link = `https://xgxm.xueguoxue.com/h5/December12th/test/index.html?channelId=${this.channelId}`
        }
        console.log(`link========`+link)
        window.location.href = link;
      })
    },
    /**
     * 摇一摇
     */
    shakeEvent(){
      this.pointButton(4,()=>{
        let link;
        if(this.$server.env=='dev'){
          link = `http://172.16.120.1:8000/shake.html?channelId=${this.channelId}`
        }else if(this.$server.env=='beta'){
          link = `https://scm.youfushuyuan.com/h5/December12th/shake/index.html?channelId=${this.channelId}`
        }else{
          link = `https://xgxm.xueguoxue.com/h5/December12th/shake/index.html?channelId=${this.channelId}`
        }
        window.location.href = link;
      })
    },
    /**
     * 获取分类
     */
    async getclassifyId(){
      const res = await this.$http.post(this.$server.getclassifyId,{});
      if(res.data.status==200){
        this.adultClassifyList = [...res.data.content.adult];
        this.childClassifyList = [...res.data.content.child];
        this.adultClassifyList[0].active = true;
        this.childClassifyList[0].active = true;
        this.classifyList = this.adultClassifyList;
        this.classId = this.classifyList[0].id;
      }
    },
    /**
     * 根据分类id获取课程（折扣：8折）
     */
    async searchCourseList(){
      if(this.classId=='') return;
      this.loading = true;
      let query = {
        mtype:Number(this.mtype),
        classId:Number(this.classId),
        discount:8,
        pageNo:this.pageNo,
        pageSize:this.pageSize
      }
      const res = await this.$http.post(this.$server.searchCourseList,query)
      if(res.data.status==200){
        this.courseList = [...this.courseList,...res.data.content.list];
        this.courseList.forEach(item=>{
          let temp = (item.sellingPrice*100*item.timeLimitDiscount)/1000
          item.nowPrice = Math.round(temp*100)/100;
        })
        this.pageNo++;
        this.loading = false;
        this.finished = res.data.content.isLastPage;
      }
    },
    /**
     * 选择分类
     */
    chooseClassify(index){
      let obj = this.classifyList[index];
      this.classifyList.forEach(item=>item.active=false);
      obj.active=true;
      this.$set(this.classifyList,index,obj);
      this.classId = obj.id;
      const pointButtonData = this.mtype==1?[12,13,14,15]:[16,17,18,19];
      this.pointButton(pointButtonData[index])
    },
    /**
     * 去课程
     */
    goCourse(courseId){
      const toast = this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      this.pointButton(20,()=>{
        this.$toast.clear()
        if(this.isIos){
          try{
            window.webkit.messageHandlers.iOSAppMethodName.postMessage({
              describe:'去课程详情页',
              method:'goCourseDetail',
              params:{
                courseId:courseId,
                isCloseWebView:false,
                channelId:this.channelId,
                activityName:this.activityName	
              }
            }); 
          }catch(err){
            let link = this.$server.env == 'prod'?'https://xgxm.xueguoxue.com':'https://scm.youfushuyuan.com'
            let activityShareUserId = tools.getQueryString('activityShareUserId')
            if(activityShareUserId){
              window.location.href = `${link}/?channelId=${this.channelId}&activityName=${this.activityName}&activityShareUserId=${activityShareUserId}#/course/${courseId}`
            }else{
              window.location.href = `${link}/?channelId=${this.channelId}&activityName=${this.activityName}#/course/${courseId}`
            }
          }
        }else{
          if(window.android){
            if(window.android.notify){
              let message = JSON.stringify({
                describe:'去课程详情页',
                method:'openLesson',
                params:{
                  courseId:courseId,
                  isCloseWebView:false,
                  channelId:this.channelId,
                  activityName:this.activityName			
                }
              })
              window.android.notify(message);
            }
          }else{
            let link = this.$server.env == 'prod'?'https://xgxm.xueguoxue.com':'https://scm.youfushuyuan.com'
            let activityShareUserId = tools.getQueryString('activityShareUserId')
            if(activityShareUserId){
              window.location.href = `${link}/?channelId=${this.channelId}&activityName=${this.activityName}&activityShareUserId=${activityShareUserId}#/course/${courseId}`
            }else{
              window.location.href = `${link}/?channelId=${this.channelId}&activityName=${this.activityName}#/course/${courseId}`
            }
          }
        }
      },courseId)
    }
  }
}
</script>

<style lang="scss" scoped>
  #app{
    // overflow-x:hidden;
    // overflow-y:auto;
    &.no-scroll{
      overflow: hidden;
    }
    .page-loading-wrap{
      background: linear-gradient(#1C6DAC, #40B4B4);
      background-color:rgba(49, 158, 177, 1);
      // .loading-icon{
      //   height:2rem;
      //   width:2rem;
      //   color:#fff;
      //   position: absolute;
      //   top:50%;
      //   left:50%;
      //   transform:translate(-50%,-50%);
      //   animation: loading-rotate 2s linear infinite;
      //   .path{
      //     animation: loading-dash 1.5s ease-in-out infinite;
      //     stroke-dasharray: 90,150;
      //     stroke-dashoffset: 0;
      //     stroke-width: 2;
      //     stroke: currentColor;
      //     stroke-linecap: round;
      //   }
      // }
    }
    .wrap{
      position: relative;
      z-index: 1;
      overflow: hidden;
      .section1,.section2{
        position: relative;
        .bgd{
          position: relative;
          z-index: 1;
        }
        .content{
          position: absolute;
          top:0;
          left: 0;
          z-index: 2;
          width: 100%;
          height:100%;
          .header{
            padding:0.5rem 0.4rem;
            display: flex;
            display: -webkit-flex; 
            justify-content: space-between;
            -webkit-justify-content: space-between;
            align-items:center;
            -webkit-align-items: center;
            .logo{
              width: 1.9rem;
            }
            .rule-icon{
              width: 1.16rem;
            }
          }
          .time{
            font-size: 0.3rem;
            text-align: center;
            text-shadow: 0px 6px 8px rgba(28, 109, 172, 0.22);
            margin:1.3rem 0 0.26rem;
            color:#fff;
            font-family: 'my-font';
          }
          .person-box{
            position: relative;
            animation: person 2.5s ease-in-out infinite;
            z-index: 2;
            .person1{
              position: relative;
              width: 6.16rem;
              height:6.92rem;
              background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/person1.png')no-repeat 50% 50% / cover;
              left:1.35rem;
              z-index: 1;
            }
            .btn1{
              width: 2.7rem;
              height: 0.96rem;
              position: absolute;
              top:5.8rem;
              left:3.4rem;
              z-index: 2;
              cursor: pointer;
              background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/btn1.png')no-repeat 50% 50% / cover;
            }
            .person2{
              position: relative;
              width: 5.46rem;
              height:6.9rem;
              background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/person2.png')no-repeat 50% 50% / cover;
              left:0.5rem;
              top:0.7rem;
              animation: person 2.5s linear infinite;
              z-index: 1;
            }
            .btn2{
              width: 2.77rem;
              height: 1rem;
              position: absolute;
              top:6.7rem;
              left:1.9rem;
              z-index: 2;
              animation: person 2.5s linear infinite;
              background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/btn2.png')no-repeat 50% 50% / cover;
            }
          }
          .yun1{
            position: absolute;
            top:7.8rem;
            left: 0.2rem;
            width: 2.88rem;
            height:1.72rem;
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/yun1.png')no-repeat 50% 50% / cover;
            z-index: 2;
            animation: yun1 25s linear infinite  both;
            opacity: 0.95;
          }
          .flag1{
            position: absolute;
            top:3.4rem;
            right: 0.1rem;
            width: 1.5rem;
            height:3.57rem;
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/flag1.png')no-repeat 50% 50% / cover;
            z-index: 2;
            animation: flag1 1.5s linear infinite;
            will-change: all;
          }
          .gan1{
            position: absolute;
            top:3.08rem;
            right: 0.74rem;
            width: 0.16rem;
            height:0.44rem;
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/gan1.png')no-repeat 50% 50% / cover;
            z-index: 1;
          }
          .gan2{
            position: absolute;
            top:3.98rem;
            left: 1rem;
            width: 0.26rem;
            height:2.07rem;
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/gan2.png')no-repeat 50% 50% / cover;
            z-index: 1;
          }
          .flag2{
            position: absolute;
            top:0.38rem;
            left: 0rem;
            width: 2.28rem;
            height:4.12rem;
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/flag2.png')no-repeat 50% 50% / cover;
            z-index: 3;
            animation: flag2 1.8s linear infinite;
            will-change: all;
          }
          .yun2{
            position: absolute;
            top:0rem;
            right: 0.2rem;
            width: 2.34rem;
            height:1.36rem;
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/yun2.png')no-repeat 50% 50% / cover;
            z-index: 2;
            opacity: 0.95;
            animation: yun2 20s linear infinite both;
          }
          .yun3{
            position: absolute;
            top:7.6rem;
            left: 3.3rem;
            width: 2.34rem;
            height:1.36rem;
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/yun3.png')no-repeat 50% 50% / cover;
            z-index: 2;
            opacity: 0.95;
            animation: yun3 22s linear infinite both;
          }
          .house{
            width: 100%;
            height: 5.5rem;
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/house.png')no-repeat 50% 50% / cover;
            position: absolute;
            bottom:0;
            left: 0;
            z-index: 1;
          }
          .version-box{
            width: 5.22rem;
            height: 0.9rem;
            position: absolute;
            bottom:0.8rem;
            left: 50%;
            margin-left: -2.65rem;
            font-size: 0;
            z-index: 2;
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/version_bgd.png')no-repeat 50% 50% / cover;
            .item{
              font-size: 0.44rem;
              color:#fff;
              line-height: 0.9rem;
              display: inline-block;
              vertical-align: middle;
              width: 50%;
              text-align: center;
              position: relative;
              z-index: 2;
              cursor: pointer;
            }
            .active-bgd{
              position: absolute;
              top:0;
              left: 0;
              background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/version_active.png')no-repeat 50% 50% / cover;
              width: 2.76rem;
              height: 0.9rem;
              display: block;
              z-index: 1;
              transition: all 0.3s;
              &.right{
                transform:translate3d(2.46rem,0,0);
              }
            }
          }
          .classify-box{
            position: absolute;
            width: 4.48rem;
            height:0.53rem;
            left:50%;
            margin-left:-2.24rem;
            bottom:0.3rem;
            font-size: 0;
            z-index: 1;
            .item{
              display: inline-block;
              vertical-align: middle;
              height: 0.53rem;
              line-height: 0.53rem;
              width: 25%;
              background: linear-gradient(0deg, #FAE5D0 0%, #E5B68D 100%);
              border-radius: 0 0 0.1rem 0.1rem;
              color:#666;
              font-size: 0.28rem;
              text-align: center;
              transition: transform 0.1s;
              cursor: pointer;
              position: relative;
              z-index: 1;
              &.active{
                color:#700113;
                transform:scale(1.02);
                transform-origin: top;
                background: linear-gradient(0deg, #FFDDAA 0%, #D98052 100%);
                z-index: 2;
                box-shadow: 0 2px 10px #999;
              }
            }
          }
        }
      }
      .section3{
        background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/bgd3.png')repeat-y;
        background-size:100%;
        .content{
          padding: 0 0.4rem;
          .course-list{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            min-height: 3.07rem;
            &.no-data{
              min-height: auto;
            }
            .course-item{
              cursor: pointer;
              width: 50%;
              margin:0.3rem 0;
              &:nth-child(odd){
                padding-right: 0.15rem;
              }
              &:nth-child(even){
                padding-left: 0.15rem;
              }
              .course-item-block{
                border:0.06rem solid #037274;
                border-radius: 0.2rem;
                overflow: hidden;
                height: 3.07rem;
                .t{
                  background: #fff;
                  height: 1.7rem;
                  position: relative;
                  border-radius: 0.2rem 0.2rem 0 0;
                  .surface{
                    width: 100%;
                    height: 100%;
                    border-radius: 0.2rem 0.2rem 0 0;
                  }
                }
                .b{
                  background: #fff;
                  padding:0.16rem 0.12rem;
                  height: calc(100% - 1.7rem);
                  position: relative;
                  .title{
                    color:#333;
                    line-height: 0.32rem;
                    font-size: 0.24rem;
                  }
                  .price{
                    position: absolute;
                    bottom:0.12rem;
                    right:0.12rem;
                    font-size: 0;
                    .selling-price{
                      margin-left: 0.08rem;
                      font-size: 0.32rem;
                      font-weight: bold;
                      color:#D11008;
                      display: inline-block;
                      vertical-align: bottom;
                      font-family: Futura;
                      line-height: 0.32rem;
                      .unit{
                          font-size: 0.22rem;
                          line-height: 0.32rem;
                          display:inline-block;
                          vertical-align: bottom;
                      }
                    }
                    .original-price{
                      display: inline-block;
                      vertical-align: bottom;  
                      line-height: 0.32rem;                          
                      font-size: 0.22rem;
                      font-weight: 500;
                      text-decoration: line-through;
                      color: #999999;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .rule-show-enter-active,.rule-show-leave-active{
    transition: all .5s ease;
  }
  .rule-show-enter, .rule-show-leave-to{
    transform: translate3d(100vw,0,0);
  }
</style>

