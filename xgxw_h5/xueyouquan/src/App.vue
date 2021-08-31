<template>
  <div id="app">
    <router-view></router-view>
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
  created(){
    
  },
  mounted(){
    
  },
  methods:{
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(()=>{
          this.isRouterAlive = true;
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
}
body, button, input, select, textarea{font:12px PingFangSC-Regular}
html{
  background: #f4f4f4;
  font-size: 50px;
}
html,body{
  width:100%;
  height: 100%;
}
#app{
 
}
body{
  background: #fff;
  width: 7.5rem;
  margin:0 auto!important;
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
</style>

