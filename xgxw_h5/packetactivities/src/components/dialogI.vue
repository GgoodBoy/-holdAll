<template>
    <div class="dialog_jf" v-show="dialogType">
        <div class="jifen">
            <p class="p1">恭喜您获得</p>
            <div class="imgBox">
                <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_but2.png" />
                <p class="imgp">2000</p>
            </div>
            <p class="p2">查看积分：学国学网APP-个人中心-积分</p>
            <div class="closeBox" @click="closeEven"></div>
        </div>
    </div>
</template>

<script>
import {onMounted,ref,inject, watch} from 'vue'

export default {
  name: 'youhui',
  components: {},
  props: {},
  setup(props,context){
        const dialogType = inject('integralDialogType'); 
        const closeEven = ()=>{
            context.emit('closeEven',{dialogId:6,type:false})
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

.dialog_jf{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background:rgba(0,0,0,0.8);
    z-index: 3;
    .jifen{
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        margin:auto;	
        width:6.52rem;
        height: 5.73rem;
        background:url("https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_box3.png") no-repeat center;
        background-size: cover;
        .closeBox{
            width: 2.7rem;
            height: 0.75rem;
            position: absolute;
            left: 2rem;
            bottom: 1.15rem;
        }
        .imgBox{
            width:2.13rem;
            height: 1.99rem;
            margin: 0.3rem auto 0;
            position: relative;
            img{
                width: 100%;
                height: 100%;
            }
            p{
                position: absolute;
                font-size: 0.3rem;
                bottom: 0.2rem;
                left: 0.7rem;
                color: #fff;
            }
        }
        .p1{
            text-align: center;
            margin-top:0.3rem;
            color: #B1041E;
            font-size: 0.3rem;
            font-weight: 700rem;
        }
        .p2{
            text-align: center;
            margin-top:0.22rem;
            color: #B1041E;
            font-size: 0.25rem;
            word-wrap:break-word;
            word-break:normal; 
            width: 4.7rem;
            margin-left: 1rem;
        }
    }
}
</style>
