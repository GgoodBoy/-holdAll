<template>
    <div class="dialog_tips" v-show="dialogType">
        <div class="tips">
            <img class="close" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/close.png" @click="closeEven"/>
            <div class="tipsDiv font_pr">
                <p>不要着急</p>
                <p>下一场红包雨正在赶来的路上</p>
                <p>在等等吧～</p>
            </div>
        </div>
    </div>
</template>

<script>

import {onMounted,ref,provide,inject,getCurrentInstance, watch} from 'vue'

export default {
  name: 'youhui',
  components: {},
  props: {},
  setup(props,context){
        const dialogType = inject('tipsDialogType');
        const closeEven = ()=>{
            context.emit('closeEven',{dialogId:8,type:false})
        }
        onMounted(()=>{})
        return{
            dialogType,
            closeEven
        }
  }
}
</script>
<style lang="less">

.dialog_tips{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background:rgba(0,0,0,0.8);
    z-index: 3;
    .tips{
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        margin:auto;	
        width:7.5rem;
        height: 4.9rem;
        background:url("https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_box5.png") no-repeat center;
        background-size: cover;
        .close{
            width: 0.66rem;
            height: 0.66rem;
            top: -0.78rem;
            right: 0.6rem;
            position: absolute;        
        }
        .tipsDiv{
            width: 5.2rem;
            left: 1.2rem;
            top: 0.5rem;
            position:absolute;
            p{
                text-align: center;
                color:#B1041E;
                font-size: 0.3rem;
                margin-bottom: 0.2rem;
                font-weight: 700;
            }
        }
    }
}
</style>
