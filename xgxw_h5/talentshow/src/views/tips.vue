<template>
  <div class="tips">
      <div class="conten">
          <p>您已经成为国学智慧达人</p>
          <p>请登录学国学网APP参与计划</p>
          <div class="butImg" @click="downApp">
              学国学网APP
          </div>
      </div>
  </div>
</template>
<script>
import {onMounted,ref,reactive,provide,inject,computed,getCurrentInstance,watch} from 'vue'
export default {
    components: {},
    setup(){   
      const downApp = ()=>{
         window.location.href = 'https://xgxm.xueguoxue.com/h5/download/'
      }
      onMounted(()=>{})
      return{
        downApp
      }
    }
}
</script>
<style lang="less">
.tips{
    height: 100vh;
    .conten{
        padding: 2.04rem 0 0;
        p{
          text-align: center;
          font-size: 0.3rem;
        }
        .butImg{
          width: 2.04rem;
          height: 0.76rem;
          margin: 0.66rem auto 0;
          background: url('../assets/images/daren_3.png') no-repeat;
          background-size: cover;
          font-size: 0.22rem;
          line-height: 0.7rem;
          color: #fff;
        }
    }
}
</style>
