<template>
    <div class="dialog_equitys" v-show="qunayisShow">
        <van-icon name="close" @click="closes"/>
        <div class='listBox'>
            <img class="imgsLi" :src="item.imgUrl" v-for="(item,index) in imgList" :key='index'/>
        </div>
    </div>
</template>

<script>

import {onMounted,ref,provide,inject,getCurrentInstance, watch} from 'vue'

export default {
  name: 'equitys',
  components: {},
  props: {},
  setup(props,context){
    const {proxy} = getCurrentInstance();
    const imgList = ref([]);
    const qunayisShow = inject('qunayisDialType');
    const getImglist = ()=>{
            var query = {}
            proxy.$http.post(proxy.$server.getPotenceList,query).then(res=>{
                if(res.status==200){
                        if(res.data.status==200){
                            imgList.value=res.data.content;
                        } 
                }
            }).catch(()=>{})       
    }
    const closes = ()=>{
        context.emit('closeEven',{dialogId:2,type:false})  
    }
    onMounted(()=>{
        getImglist();
    })
    return{
        imgList,
        closes,
        qunayisShow
    }
  }
}
</script>
<style lang="less">

.dialog_equitys{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background:rgba(0,0,0,0.8);
    z-index: 3;
    i{
        position:absolute;
        right:0.2rem;
        top: 0.2rem;
        z-index:10;    
        color: #fff;
        font-size: 0.6rem;
    }
    .listBox{
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        margin:auto 0;	
        overflow-x: auto;
        overflow-y: hidden;
        white-space:nowrap;
        width: 100%;
        height: 6.5rem;
        &::-webkit-scrollbar{// 滚动条整体
            background:none;
        }
        .imgsLi{
            width:5.4rem;
            display: inline-block;
            margin-left: 0.3rem;
            border-radius: 0.2rem;
            height: 5.9rem;
        }
    }
}
</style>
