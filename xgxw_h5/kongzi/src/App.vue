<template>
  <div id="app">
    <router-view :key="$route.fullPath" v-if="isRouterAlive"/>
  </div>
</template>
<script>
export default {
  name: 'App',
  data(){
    return{
      isRouterAlive:true,
    }
  },
  provide(){
    return{
      reload:this.reload
    }
  },
  mounted(){
    
  },
  methods:{
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(()=>{
        this.isRouterAlive = true;
      })
    },
  }
}
</script>

<style lang="scss">

@font-face{
  font-family: 'jiangxi';
  src : url('./assets/font/test.ttf');
}
*{
  font-family: 'jiangxi';
  margin:0;
  padding:0;
  box-sizing: border-box;
  letter-spacing: 0;;
}
#app{
  position: fixed;
  top:0;
  left: 0;
  width: 100%;
  height: 100%; 
}
body,html,#app{
  height: 100%;
  width: 100%;
}
.fl{float: left!important;}
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
    .slide-top-enter,.slide-top-leave-to{
        transform: translateY(100%);
    }
    .slide-top-enter-to,.slide-top-leave{
        transform:translateY(0)
    }
    .slide-top-enter-active,.slide-top-leave-active{
        transition: all 5s;
    }
</style>

