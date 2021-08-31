<template>
  <div id="app">
    <transition :name='transitionName'>
      <router-view :key="$route.fullPath"/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      transitionName:'slide-right'
    }
  },
  watch:{
    $route(to,from){
      //切换动画
      let isBack = this.$router.isBack;
      if(isBack){
        this.transitionName='slide-left'
      }else{
        this.transitionName='slide-left'
      }
      this.$router.isBack = false;
    }
  },
  created(){
  },
  mounted(){},
  methods:{}
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
  // overflow: hidden;
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





.slide-left-enter, .slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%)
}

.slide-left-leave-to, .slide-right-enter {
  opacity: 0;
  transform: translateX(-100%)
}

.slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active {
  transition: .5s;
  position: absolute;
  top:0;
}
</style>

