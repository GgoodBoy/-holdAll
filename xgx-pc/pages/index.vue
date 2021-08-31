<template>
  <div id="app">
    <Hearder/>
    <div class="child-page"><nuxt-child v-if="isRouterAlive" :key="$route.fullPath"></nuxt-child></div>
    <Footer/>
    <transition name="el-fade-in">
        <div class="browser-dialog" v-if="isIE">
            <div class="browser-dialog-box">
                <div class="title">温馨提示<i class="el-icon-circle-close" @click="close"></i></div>
                <div class="body">
                  <p>您好，系统检测到您当前正在使用IE浏览器访问，由于微软已放弃对IE浏览器的升级和维护，部分Windows系统使用IE浏览器可能会导致课程无法播放。</p>
                  <p>为了您更好的体验，建议您更换以下浏览器使用。</p>
                  <div class="browser-download">
                    <a href="https://test-xgxw.oss-cn-beijing.aliyuncs.com/360cse_11.0.2140.0.zip" class="browser1">
                      <i></i>
                      <p>下载360浏览器</p>
                    </a>
                    <a href="https://test-xgxw.oss-cn-beijing.aliyuncs.com/QQBrowser_Setup_QB10_10026011.zip" class="browser2">
                      <i></i>
                      <p >下载QQ浏览器</p>
                    </a>
                    <a class="browser3" href="https://test-xgxw.oss-cn-beijing.aliyuncs.com/ChromeCore_1256_1.0.4.2.zip">
                      <i></i>
                      <p>下载谷歌浏览器</p>
                    </a>
                  </div>
                </div>
            </div>
        </div>
    </transition>
    <div v-show="finish">
      <el-dialog
        custom-class="interest-dialog"
        :visible.sync="interestDialog"
        width="50%"
        top="10%"
        :modal="false"
        @close="closeInterestDialog"
        center>
        <div class="title" slot="title">
          <i class="left-icon"></i>
          <p>选择兴趣</p>
          <i class="right-icon"></i>
        </div>
        <div class="interest-list" v-if="interestList.length>0">
          <div class="list clearfix">
            <p class="interest-item" :class="{'checked':item.active}" v-for="(item,index) in interestList" :key="index" @click="chooseInterset(item)">{{item.name}}</p>
          </div>
          <p class="tips">最多选中3个兴趣</p>
        </div>
        <div class="dialog-btns">
          <el-button type="primary" class="save-btn" @click="saveInterest">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts">
  import {Component , Vue ,Watch,Provide} from 'vue-property-decorator'
  import Hearder from '~/components/Header.vue'
  import Footer from '~/components/Footer.vue'
  import {mapActions,mapState} from 'vuex'
  import { setTimeout } from 'timers';

  @Component({
    components:{Hearder,Footer},
    computed:{
      ...mapState(['interestDialog','isIE'])
    },
    methods:{
      ...mapActions(['setUserData','setInterestDialog','setIsIE'])
    }
  })
  export default class Index extends Vue{
    interestList = []
    interestId = []
    interestError = ''
    finish = false
    isRouterAlive = true
    @Provide('reload')
    reload = this.reload
    @Watch("interestDialog")
    oninterestDialogChanged(val, oldVal) {
      if(val){
        setTimeout(()=>{
          this.getInterestList()
        },500)
      }
    }
    @Watch("$route")
    onRouteChanged(val,old){
      if(!val.name.includes('auth')){
        sessionStorage.removeItem('redirectUrl');
      }
      if(val.name=='index-course-player'){
        let ieFlag = this.IEVersion()
        if(ieFlag>0){
          this.setIsIE(true)
        }else{
          this.setIsIE(false)
        }
      }
      setTimeout(()=>{
        document.body.scrollTop = 0
      },1)
    }
    created(){
      if(process.client){
        let user = this.$getCookie('xgx_user')?this.$getCookie('xgx_user'):null;
        if(user){
          let userData = JSON.parse(user)
          this.setUserData(userData)
        }
        // this.getThemeInfo()
      }
    }
    mounted(){
      setTimeout(()=>{
        if(document.querySelector(".child-page")){
          let minHeight = document.documentElement.clientHeight - 207;
          document.querySelector(".child-page").querySelector("div").style.minHeight = `${minHeight}px`
          this.finish = true;
        }
      },300)
      setTimeout(()=>{
        this.finish = true
      },3000)
      if(this.$route.name=='index-home'){
        let ieFlag = this.IEVersion()
        if(ieFlag>0){
          this.setIsIE(true)
        }else{
          this.setIsIE(false)
        }
      }
    }
    async getThemeInfo(){
      let res = await this.$axios.$get(this.$server.getThemeInfo,{});
      if(res.status==200){
        let pcOpt = res.content.pcOpt;
        if(pcOpt&&pcOpt==1){
            document.getElementsByTagName('html')[0].classList.add('gray')
        }
      }
    }  
    /**
     * 获取兴趣列表
     */
    async getInterestList(){
      let questData = {
        params:{}
      }
      let res = await this.$axios.$get(this.$server.getInterestList,questData)
      if(res.status==200){
        this.interestList = res.content.map((item,index)=>{
          item.active = false;
          return item;
        });
      }
    }
    /**
     * 选择兴趣
     */
    chooseInterset(obj){
      this.interestError = ''
      if(obj.active){
        obj.active = false;
        let index = this.interestId.findIndex(item=>item==obj.id);
        this.interestId.splice(index,1);
      }else{
        if(this.interestId.length>=3){
          this.interestError = '最多选中3个兴趣'
            return;
        }
        obj.active = true;
        this.interestId.push(obj.id);
      }
    }
    /**
     * 关闭兴趣弹窗
     */
    closeInterestDialog(){
      this.setInterestDialog(false);
    }
    /**
     * 关闭ie提示
     */
    close(){
      this.setIsIE(false)
    }
    IEVersion() {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
      var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
      var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
      var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
      if(isIE) {
          var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
          reIE.test(userAgent);
          var fIEVersion = parseFloat(RegExp["$1"]);
          if(fIEVersion == 7) {
              return 7;
          } else if(fIEVersion == 8) {
              return 8;
          } else if(fIEVersion == 9) {
              return 9;
          } else if(fIEVersion == 10) {
              return 10;
          } else {
              return 6;//IE版本<=7
          }   
      } else if(isEdge) {
          return 'edge';//edge
      } else if(isIE11) {
          return 11; //IE11  
      }else{
          return -1;//不是ie浏览器
      }
    }
    /**
     * 保存兴趣
     */
    async saveInterest(){
      if(this.interestId.length<1||this.interestId.length>3) return;
      if(this.interestId.length==0){
        this.setInterestDialog(false);
        return;
      }else if(this.interestId.length>3){
        this.$message({
          message: '最多选择3项兴趣哦',
          type: 'warning'
        });
        return;
      }
      let loadingInstance = this.$loading.service({
          target:document.getElementsByClassName('interest-dialog')[0],
          background:'rgba(255,255,255,0)'
      });
      let user = this.$getCookie('xgx_user')?JSON.parse(this.$getCookie('xgx_user')):null;
      let query = {
        interestId:this.interestId.join(',')
      }
      let res = await this.$axios.$post(`${this.$server.updateInfo}/${user.userId}`,query)
      loadingInstance.close()
      if(res.status==200){
        this.$message({
          message: '兴趣保存成功',
          type: 'success'
        });
        this.setInterestDialog(false);
      }else{
        this.$message.error(res.message);
      }
    }
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(()=>{
          this.isRouterAlive = true;
      })
    }
  }
</script>
<style lang="scss" scoped>
  #app{
    min-width: 1280px;
  }
  .child-page{
    padding-top:80px;
    background: #F4F4F4;
  }
  .child-page>div{
    min-height: calc(100vh - 300px)
  }
  .interest-dialog{
    border-radius: 5px!important;
    .title{
      padding-top:30px;
      i,p{
        display: inline-block;
        vertical-align: middle;
      }
      i{
        width: 18px;
        height: 27px;

      }
      p{
        font-size: 20px;
        font-weight: bold;
        color:#000;
        margin:0 30px;
      }
    }
    .save-btn{
      width: 30%;
    }
    .interest-list{
      text-align: center;
      color:#9A9A9A;
      font-size: 18px;
      padding:0 6%;
      .tips{

      }
      .list{
        .interest-item{
          float: left;
          padding: 0 5px;
          height: 36px;
          line-height: 36px;
          border-radius: 20px;
          border:1px solid #CCCCCC;
          cursor: pointer;
          margin:0px 15px 20px 15px;
          min-width: 100px;
          &:hover{
            border-color:#aaa;
          }
          &.checked{
            background: #C30D23;
            color:#fff;
            border-color:#C30D23;
            &:hover{
              border-color:#C30D23;
            }
          }
        }
      }
    }
    .dialog-btns{
      text-align: center;
      margin-top:20px;
      button{
        display:inline-block;
      }
    }
  }
  .browser-dialog{
    position: fixed;
    top:0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1111;
    .browser-dialog-box{
      width: 590px;
      height: 406px;
      border-radius: 5px;
      overflow: hidden;
      position: absolute;
      top:50%;
      left: 45%;
      margin:-203px 0 0 -245px;
      background: #fff;
      box-shadow: 0 0 10px #dfdfdf;
      .title{
        background: #EDF1F7;
        line-height: 56px;
        padding: 0 35px;
        color:#6A6A6A;
        font-size: 19px;
        position: relative;
        i{
          color:#C30D23;
          position: absolute;
          font-size: 28px;
          top:16px;
          right: 20px;
          cursor: default;
        }
      }
      .body{
        padding: 30px;
        p{
          color:#333333;
          font-size: 18px;
          line-height: 28px;
        }
        p+p{
           margin:20px 0 30px 0;
        }
        .browser-download{
           font-size: 0;
          .browser1,.browser2,.browser3{
            width: 33.33%;
            text-align: center;
            font-size: 0;
            display: inline-block;
            vertical-align: middle;
            i{
              height: 70px;
              width: 70px;
              display: inline-block;
            }
            p{
              color:#666666;
              font-size: 16px;
              margin-top:18px;
            }
          }
          .browser1 i{background: url('../assets/images/360.png')no-repeat 50% 50% / cover}
          .browser2 i{background: url('../assets/images/qq.png')no-repeat 50% 50% / cover}
          .browser3 i{background: url('../assets/images/chrome.png')no-repeat 50% 50% / cover}
        }
      }
    }
  }
</style>

