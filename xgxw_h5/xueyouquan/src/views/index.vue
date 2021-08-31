<template>
  <div class="container" v-if="finish">
    <p class="none" v-if="error">该说说不存在~</p>
    <div v-else>
      <div class="header">评论详情</div>
      <div class="main" v-if="classmatesMsgData.id">
        <classmatesMsg :classmatesMsgData="classmatesMsgData" :inOtherApp="inOtherApp" :playing.sync="playing" @goApp="goApp"/>
      </div>
      <div class="comment-wrap" :class="classmatesMsgData.id?'comment-show':''">
        <van-list
          class="comment-list"
            v-model="loading"
            :finished="finished"
            @load="getClassmatesMsgCommentListByMsgId"
          >
          <Comment v-for="(item,index) in commentList" :key="index" :index="index" :commentIndex.sync="commentIndex" :commentData="item" :voiceUrl.sync="voiceUrl" :playing.sync="playing" :inOtherApp="inOtherApp"></Comment>
          <div class="empty" v-show="commentList.length==0&&finished">
            <p>还没有人评论，快来发表你的高见</p>
          </div>
          <p class="over" v-if="finished&&commentList.length>0">已经全部加载完毕~</p>
      </van-list>
      </div>
      <div class="bottom" @click="goApp">请下载APP参与评论</div>
      <audio ref="audio" :src="voiceUrl"></audio>
    </div>
  </div>
</template>

<script>
import Comment from '@/components/comment.vue'
import classmatesMsg from '@/components/classmatesMsg.vue'
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)
  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])
    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}
export default {
  data(){
    return{
      highIos:false,//ios是否>=9.0.0，小于用scheme,大于用通用链接
      inOtherApp:false,//是否在微信内、微博内
      classmatesMsgId:'',//说说id
      classmatesMsgData:{},//说说数据
      commentList:[],//评论列表
      finish:false,//是否请求过接口
      error:false,
      finished:false,//评论是否获取所有数据
      loading:false,//评论loading
      pageNo:1,//分页
      pageSize:10,//分页
      playing:false,//评论里的语音是否在播放
      voiceUrl:'',//语音src
      commentIndex:-1//第几天评论在播放语音
    }
  },
  components:{Comment,classmatesMsg},
  watch:{
    voiceUrl(cur,old){
      this.$refs.audio.load()
      setTimeout(()=>{
        this.$refs.audio.play()
      },1)
    },
    playing(cur,old){
      if(cur){
        setTimeout(()=>{
          this.$refs.audio.load()
          this.$refs.audio.play()
        },1)
      }else{
        this.$refs.audio.pause()
        this.commentList.forEach(item=>{
          item.playing = false;
        })
      }
    },
  },
  created(){
    if(this.$route.query&&this.$route.query.id){
      this.classmatesMsgId = this.$route.query.id;
      this.$nextTick(()=>{
        this.getClassmatesMsgDetail()
      })
    }
  },
  methods:{
    /**
     * 获取说说详情
     */
    async getClassmatesMsgDetail(){
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
      });
      const query = {
        classmatesMsgId:this.classmatesMsgId
      }
      const res = await this.$http.post('/classmatesMsg/getClassmatesMsgDetail',query);
      if(res.data.status==200){
        this.finish = true;
        this.classmatesMsgData = res.data.content
        this.classmatesMsgData.topicNameShow = true;
        this.$nextTick(()=>{
          this.wxshare()
          this.$refs.audio.addEventListener('ended',(e)=>{
            this.commentList.forEach(item=>{
              item.playing = false;
            })
            this.playing = false;
          })
          this.$refs.audio.addEventListener('play',(e)=>{
            if(this.commentIndex>=0){
              this.commentList.forEach(item=>{
                item.playing = false;
              })
              let obj = JSON.parse(JSON.stringify(this.commentList[this.commentIndex]))
              obj.playing = true;
              this.$set(this.commentList,this.commentIndex,obj)
            }
            let dom = document.querySelector('.player-controls')
            if(dom){
              dom.style.display = 'block';
              let btn = document.querySelector('.player-controls .player-btn')
              if(btn.className.includes('pause')){
                document.querySelector('.player-controls .player-btn').click()
              }
            }
          })
          let ua = navigator.userAgent.toLowerCase();
          if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
            this.inOtherApp = true;
          }else if (ua.includes('weibo')){
            this.inOtherApp = true;
          }else{
            this.inOtherApp = false;
          }
          let ver=ua.match(/cpu iphone os (.*?) like mac os/);
          if(ver){
            let version = ver[1].replace(/_/g,".")
            this.highIos = compareVersion(version,'10.0.0')>=0
          }
          this.$toast.clear()
          setTimeout(()=>{
            let dom = document.querySelector('.info .spot');
            if(dom){
              dom.style.display = 'none'
            }
          },300)
        })
      }else{
        this.finish = true;
        this.error = true;
      }
    },
    /**
     * 获取说说评论
     */
    async getClassmatesMsgCommentListByMsgId(){
      const query = {
        classmatesMsgId:this.classmatesMsgId,
        pageNo:this.pageNo,
        pageSize:this.pageSize
      }
      const res = await this.$http.post('/classmatesMsgComment/getClassmatesMsgCommentListByMsgId',query)
      if(res.data.status==200){
        this.commentList = [...this.commentList,...res.data.content.list];
        this.commentList.forEach((item)=>{
          item.playing = false;
        })
        this.loading = false;
        this.pageNo++;
        this.finished = res.data.content.isLastPage ?  true : false;
      }
    },
    goApp(){
      let isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      if(this.inOtherApp){
        window.location.href = `https://xgxm.xueguoxue.com/h5/download/index.html?type=xueyouquan&xueyouquanid=${this.classmatesMsgId}`
      }else{
        if(isIos){
          window.location.href=`xueguoxuewang://type=xueyouquan&xueyouquanid=${this.classmatesMsgId}`
          setTimeout(()=>{
            let hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden 
            if(typeof hidden =="undefined" || hidden ==false){
              window.location.href = `https://xgxm.xueguoxue.com/h5/download/index.html?type=xueyouquan&xueyouquanid=${this.classmatesMsgId}`;
            }
          }, 2000);
        }else{
          this.$toast.loading()
          let a = document.createElement('a');
          a.setAttribute('data-params', `{classmatesMsgId:${this.classmatesMsgId}}`);
          a.setAttribute('href', 'https://bm7ilz.jgshare.cn/AA7u');
          a.setAttribute('data-jmlink', 'true');
          a.setAttribute('data-auto', 'false');
          document.body.appendChild(a);
          setTimeout(() => {
            this.$toast.clear()
            a.click();
          }, 2000);
        }
      }
    },
    wxshare(){
			let url = encodeURIComponent(window.location.href.split('#')[0]);
			this.$http.get('/wx/getConfig?url='+url).then(res=>{
				if(res.data.status == 200){
					  let data = res.data.content;
            let title = this.classmatesMsgData.nickname
	          let desc = this.classmatesMsgData.msgContent
	          let link = window.location.href
	          let imgUrl = 'https://xgxm.xueguoxue.com/h5/download/image/logo.png'
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
          wx.ready(function() {
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                // 用户点击了分享后执行的回调函数
                }
            });
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {
                // 用户点击了分享后执行的回调函数
                },
            })
            wx.onMenuShareQQ({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () {
                // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                // 用户取消分享后执行的回调函数
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
  .container{
    min-height: 100vh;
    background: #fff;
    padding-bottom:1.2rem;
    .none{
      font-size:0.32rem;
      color:#999;
      position: absolute;
      top:50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 100%;
      text-align: center;
    }
    .header{
      text-align: center;
      color:#333;
      font-weight: bold;
      font-size: 0.36rem;
      line-height: 1rem;
      border-bottom:1px solid #eee;
    }
    .bottom{
      width: 100%;
      max-width: 7.5rem;
      height: 1.2rem;
      position: fixed;
      bottom:0;
      left:50%;
      transform: translateX(-50%);
      color:#fff;
      background: #C30D20;
      text-align: center;
      font-size: 0.36rem;
      line-height: 1.2rem;
    }
    .comment-wrap{
      opacity: 0;
      background: #fff;
      &.comment-show{
        opacity: 1;
      }
    }
    .empty{
      border-top: 1px solid #eee;
      padding: 0.5rem;
      color: #999;
      font-size: 0.28rem;
      text-align: center;
    }
    .over{
      padding: 0.5rem;
      color: #666;
      font-size: 0.28rem;
      text-align: center;
    }
  }
</style>

