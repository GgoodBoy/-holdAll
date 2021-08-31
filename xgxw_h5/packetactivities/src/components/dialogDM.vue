<template>
    <div class="dialog_yh" v-show="dialogType">
        <div class="youhui">
            <p class="p1">恭喜您获得</p>
            <div class="imgBox">
                <img :src="imgs" />
            </div>
            <p class="p2">{{limitDayNums==-1?imgText.imgMoneyText:imgText.imgDayText}}</p>
            <div class="closeBox" @click="closeEven"></div>
        </div>
    </div>
</template>

<script>

import {onMounted,ref,inject,getCurrentInstance, watch} from 'vue'
export default {
  name: 'youhui',
  components: {},
    props: {
        limitDay: {
            type:Number
        }
    },
  setup(props,context){
        const dialogType = inject('learnDiscountDialogType');   
        const limitDayNums = ref(props.limitDay);     
        const imgs = ref(''); 
        const imglist = ref({
            'img7':'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/7day.png',
            'img30':'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/30day.png',
            'img90':'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/90day.png',
            'img10':'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/10money.png'
        })
        watch(props,(value)=>{
              if(value.limitDay>0){
                    if(value.limitDay!=10){
                        limitDayNums.value = value.limitDay;
                    }else{
                        limitDayNums.value=-1;
                    }
                    imgs.value = imglist.value['img'+value.limitDay]; 
              }
          },{immediate:true}) 
        const imgText = ref({
            imgDayText:'查看课程：学国学网APP-已购',
            imgMoneyText:'查看优惠券：学国学网APP-个人中心-我的优惠券'
        })
        const closeEven = ()=>{
            context.emit('closeEven',{dialogId:5,type:false})
        }
        onMounted(()=>{})
        return{
            imgText,
            imgs,
            limitDayNums,
            dialogType,
            closeEven
        }
  }
}
</script>
<style lang="less">

.dialog_yh{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background:rgba(0,0,0,0.8);
    z-index: 3;
    .youhui{
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        margin:auto;	
        width:6.75rem;
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
            width:3.8rem;
            height: 1.71rem;
            margin-left: 1.55rem;
            margin-top: 0.3rem;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .p1{
            text-align: center;
            margin-top:0.3rem;
            color: #B1041E;
            font-size: 0.3rem;
            font-weight: 700;
        }
        .p2{
            text-align: center;
            margin-top:0.22rem;
            color: #B1041E;
            font-size: 0.26rem;
            word-wrap:break-word;
            word-break:normal; 
            width: 4.47rem;
            margin-left: 1.24rem;
        }
    }
}
</style>
