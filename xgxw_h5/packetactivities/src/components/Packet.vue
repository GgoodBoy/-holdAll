<template>
  <div class="packBox" v-show="dialogType">
    <div>
      <div class="packRed">
          倒计时:{{packTime}}s
      </div>
      <div class="ser_home">
        <ul
          class="red_packet"
          id="red_packet"
        >
          <template v-for="(item, index) in liParams" :key='index'>
             <!-- @webkitAnimationEnd="removeDom" -->
             <!-- :class="item.cls" -->
            <li
              :style="{ left: item.left, animationDuration: item.durTime, webkitAnimationDuration: item.durTime}"
              :class="{move_1:hbAnimType,move_2:!hbAnimType}" 
              :data-index="index"
            >
              <p class='textTips' v-show="item.index==index">{{listText[textIndex]}}</p>
              <a @click.stop="hongbao(index)">            
                <i :class="{backOne:item.index!=index,backTwo:item.index==index}" :style="{ transform: item.transforms, webkitTransform: item.transforms}"></i>
              </a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {onMounted,ref,watch,reactive,inject,getCurrentInstance} from 'vue'
  let timer,setInter;
  export default {
      name: "whole",
      props: {
          rewardRecordId:{
            type:Number
          }
      },
      setup(props,context){
          const {proxy} = getCurrentInstance();
          const liParams = ref([]);//红包个数
          const packLiterId = ref(props.rewardRecordId);
          const duration = ref(10000);//红包活动结束的时长；
          const packTime = ref(10);//倒计时
          const packShow = ref(false);//红包展示是否提示；
          const dialogType = inject('packDialogType')
          const isclose = ref(true);
          const hbAnimType=ref(true);
          const listText = ref([
            '手速真快~',
            '66666',
            '抢到了~'
          ])
          const textIndex = ref(0);
          const state = reactive({ count: 0 });
          watch(props,(value)=>{
              if(value.rewardRecordId){
                  packLiterId.value = value.rewardRecordId; 
              }
          },{immediate:true})  
          watch(dialogType, (newValue, oldValue) => { //直接监听
              if(newValue){
                 playPack();
              }
          });                
          const playPack=()=>{
              clearInterval(setInter);
              startRedPacket();
              setTimeout(() => {
                    if(isclose.value){
                      context.emit('closeEven',{dialogId:4,type:false,data:{
                        type:-1,
                        limitDay:''
                      }})
                    }
                    packTime.value = 10;
                    clearInterval(timer);
                    clearInterval(setInter);
                    // location.reload();
                    console.log("红包结束了");
              }, duration.value);
              setInter = setInterval(() => {
                  packTime.value -= 1;
                  if(packTime.value==0||packTime.value<0){
                    packTime.value = 10;
                    clearInterval(setInter);
                  }
              }, 1000);
          }
          /**
          //  * 开启动画
          //  */
          const startRedPacket=()=>{
              liParams.value = [];
              clearInterval(timer);
              timer = setInterval(()=>{
                let left,win,rotate,scales,durTime;
                win = document.documentElement.clientWidth || document.body.clientWidth;
                left = parseInt(Math.random() * (win - 155) + 0);//155表示的是红包的宽度(px)
                rotate = parseInt(Math.random() * (45 - -45) - 45) + "deg"; // 旋转角度
                scales = (Math.random() * (12 - 8 + 1) + 8) * 0.1; // 图片尺寸
                durTime = Math.random() * (2.5 - 1.2 + 1) + 2 + "s"; //6到8秒
                liParams.value.push({
                  left: (left/50) + "rem",
                  // cls: "move_1",
                  transforms: "rotate(" + rotate + ") scale(" + scales + ")",
                  durTime: durTime,
                });
              },500)
          }  

          /**
           * 红包节点
           */
          // const removeDom =(e)=>{
          //     let target = e.currentTarget;
          //     document.querySelector("#red_packet").removeChild(target);
          // }
          const randomNum = ()=>{
            return Math.floor(Math.random()*3);
          }
          const hongbao = (index)=>{
              if(!textIndex.value){
                textIndex.value = randomNum();
                liParams.value[index].index = index;
                clearInterval(setInter);
                clearInterval(timer);
                hbAnimType.value = false;
                setTimeout(() => {
                  packLottery();
                },1000)
              }
          }  
          const packLottery = ()=>{
              if(!isclose.value) return;
              let query = {
                rewardRecordId:packLiterId.value
              }
              proxy.$http.post(proxy.$server.getPackLottery,query).then(res=>{
                  if(res.status==200){
                    let data = res.data;
                    if(data.status==200){
                      let datas = {
                        type:data.content.rewardRecord.type,
                        limitDay:data.content.rewardRecord.limitDay||''
                      };
                      packTime.value = 10;
                      isclose.value = false;
                      clearInterval(setInter);
                      clearInterval(timer);
                      context.emit('closeEven',{dialogId:4,type:false,data:datas})
                      hbAnimType.value = true;
                    }    
                  }
                  }).catch(()=>{})            
          }
          onMounted(()=>{});
          return {
            liParams,
            duration,
            packTime,
            packShow,
            packLiterId,
            dialogType,
            listText,
            textIndex,
            hbAnimType,
            // 方法
            hongbao,
            playPack
          }
      }
  };
</script>

<style scoped lang="less">
.ser_home {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
  width: 100%;
  height: 100vh;
}
.packRed {
    position: fixed;
    top: 1.18rem;
    left: 2.41rem;
    width:2.8rem;
    z-index:100;
    height: 0.51rem;
    line-height:0.51rem;
    border-radius:0.51rem;
    background:rgba(255,255,255,0.4);
    font-size: 0.3rem;
    text-align:center;
}
.red_packet {
  display: block;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  i {
    width: 3.1rem;
    height: 3.1rem;
    display: block;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  li {
    position: absolute;
    animation: all 3s linear;
    top: -2rem;
    z-index: 10;
    &.move_1 { //表示含有move_1属性的li
      /*
        linear：线性过渡。等同于贝塞尔曲线(0.0, 0.0, 1.0, 1.0)
        ease：平滑过渡。等同于贝塞尔曲线(0.25, 0.1, 0.25, 1.0)      
      */
      -webkit-animation: aim_move 5s linear 1 forwards;
      animation: aim_move 5s linear 1 forwards;
      animation-play-state: running;
    }
    &.move_2 {
      -webkit-animation: aim_move 5s linear 1 forwards;
      animation: aim_move 5s linear 1 forwards;
      animation-play-state: paused;
    }
  }
  a {
    display: block;
  }
  .textTips{
    font-size: 0.26rem;
    color:#fff;
  }
}

@keyframes aim_move {//运动原理，从最上层0%移动到整个可视区的1.2倍的位置（100vh表示可视区域，120表示的可视区域继续往下20）
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(120vh);
    transform: translateY(120vh);
  }
}
.backOne{
  background: url("https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb1.png");
}
.backTwo{
  background: url("https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb2.png");
}
.activeHbImg {
  animation-play-state: running;
}
.pausedHbImg {
  animation-play-state: paused;
}
</style>
