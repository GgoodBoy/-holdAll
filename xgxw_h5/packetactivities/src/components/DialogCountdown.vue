<template>
    <div class="dialog_countdown" v-if='dialogType'>
    <!-- <div class="dialog_countdown"> -->
        <div class="countdown">
            <div class="cdDiv" style="position: relative;">   
                <img class="imgOne" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_but.png"/>
                <div class="num">{{times}}</div>
            </div>
            <img class="imgTwo" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/startPack.png"/>
        </div>
    </div>
</template>

<script>

import {onMounted,ref,inject,watch } from 'vue'
let timeInter;
export default {
  name: 'youhui',
  components: {},
  props: {},
  setup(props,context){
        const dialogType = inject('cdnDialType');
        const times = ref(3);
        watch(dialogType, (newValue, oldValue) => { //直接监听
            if(newValue){
                setTimeout(() => {
                    timeInter = setInterval(()=>{
                        times.value--;
                        console.log("times.value",times.value)
                        if(times.value==0){
                            times.value=3;
                            context.emit('closeEven',{dialogId:3,type:false})
                            clearInterval(timeInter);
                        }
                    },1000)                    
                },300)
            }
        });     
        onMounted(()=>{})
        return{
            dialogType,
            times
        }
  }
}
</script>
<style lang="less">

.dialog_countdown{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background:rgba(0,0,0,0.8);
    z-index: 3;
    .countdown{
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        margin:auto;	
        width:3.8rem;
        height: 4.56rem;
        .cdDiv{
            img{
                display: block;
                border-radius: 50%;
            }
        }
        .num{    
            font-size: 1.4rem;
            position: absolute;
            color: #fff;
            top: 0;
            left:0;
            right: 0;
            bottom: 0;
            line-height:3.5rem;
            font-weight: 500;
        }
    }
}
</style>
<style>
	.imgOne{ 
        position:relative; 
		background-image: -webkit-gradient(linear, left top, left bottom, from(#6cc3fe), to(#21a1d0));
		background-image: -moz-linear-gradient(#6cc3fe,#21a1d0);
        -webkit-animation-timing-function: ease-in-out;
        -webkit-animation-name: breathe;
        -webkit-animation-duration: 1200ms;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-direction: alternate;
		animation:ease-in-out breathe 1200ms infinite alternate; 
}
	@keyframes breathe{
        0% { opacity: .2; }
        100% { opacity: 1;}
	}
    @-webkit-keyframes breathe {
        0% { opacity: .2;}
        100% { opacity: 1;}
    }
</style>
