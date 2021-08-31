<template>
    <div class="share-wrap" v-show="dialogType" @click="dialogVisbileEven">
            <div class="share-dialog" >
                <i class="share-arrow"></i>
                <p class="tip1">请点击上方···发送给朋友</p>
            </div>
    </div> 
</template>

<script>

import {onMounted,ref,inject, watch} from 'vue'
let codeTimer;
export default {
  name: 'login',
  components: {},
  setup(props,context){
    const dialogType = inject('dialogVisbile');
    const dialogVisbileEven = ()=>{
        context.emit('closeEven',{dialogId:9,type:false})
    }
    onMounted(()=>{})
    return{
        dialogType,
        dialogVisbileEven
    }
  }
}
</script>
<style lang="less">
.share-wrap{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,0.7);
    z-index: 3;
    .share-dialog{
        .share-arrow{
            position: fixed;
            width: 1.2rem;
            height: 1.2rem;
            right: 0.1rem;
            top:0.3rem;
            transform: rotate(-90deg);
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/arrow.png')no-repeat 50% 50% /cover; 
        }
        .tip1{
            position: fixed;
            right: 0.1rem;
            top:1.6rem;
            font-size: 0.32rem;
            color:#fff; 
        }
    }
}
</style>
