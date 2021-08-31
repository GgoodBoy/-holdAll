<template>
  <div id="app">
    <p v-if="errorShow" class="error-tips">链接地址不合法</p>
    <template v-if="isRouterAlive">
      <router-view :key="$route.fullPath" />
    </template>
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
      errorShow:false
    }
  },
  created(){
    document.body.addEventListener('touchstart', function(){}, false)
    document.addEventListener('gesturestart', function(event) {
      event.preventDefault();
    });
    let takeInfo = getQueryString('takeInfo')
    let mtype = window.location.hash.includes('mtype=1')||window.location.hash.includes('mtype=2')
    if(!takeInfo||!mtype){
      this.isRouterAlive = false;
      this.errorShow = true;
    }
  },
  mounted(){
    
  },
  methods:{
    
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
body,html,#app{
  width: 100%;
  
  height: 100%;
}
html{background: #fff;font-size: 55.2px}
body{width: 7.5rem;margin:0 auto;max-width: 414px;}
.error-tips{
  position: absolute;
  font-size:0.32rem;
  color:#333;
  top:50%;
  left: 50%;
  width: 100%;
  text-align: center;
  transform:translate(-50%,-50%);
}

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
::-webkit-scrollbar {/*滚动条整体样式*/
  width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 20px;
  -webkit-box-shadow: inset 0 0 5px #C30D23;
  background: #C30D23;
}
::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}
.van-toast--loading{
  padding:0!important;
}
.van-list__loading{
  margin:0 auto;
  color:#fff;
  .van-loading__text,.van-loading{
    color:#fff;
  }
}
.van-list__placeholder{
  width: 100%;
}
</style>

