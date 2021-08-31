<template>
  <div id="app">
    <div class="error-page" :style="{'min-height':minHeight+'px'}">
      <img :src="errorImg"/>
      <p class="tips">小夫子掐指一算，就知道你迷路了</p>
      <nuxt-link to="/home">跟我走吧</nuxt-link>
    </div>
  </div>  
</template>

<script>
import {Component , Vue ,Watch} from 'vue-property-decorator'
const ErrorImg = require('@/assets/images/error_img.png')
@Component({
  
})
export default class Error extends Vue{
  minHeight = 800
  errorImg = ErrorImg
  mounted(){
    this.minHeight = document.documentElement.clientHeight
  }
}
</script>
<style lang="scss" scoped>
  .error-page{
    background: #F3F5F7;
    text-align: center;
    padding:242px 0 0 0;
    height: 100vh;
    a{
      color:#999999;
    }
    img{
      display: inline-block;
    }
    .tips{
      color:#999999;
      margin:5px 0 28px 0;
    }
    .btn{
      color:#333333;
      text-decoration: underline;
      cursor: pointer;
      &:hover{
        opacity: 0.85
      }
    }
  }
</style>
