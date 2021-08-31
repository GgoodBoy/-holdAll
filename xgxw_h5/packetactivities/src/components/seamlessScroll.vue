<template>
    <div class="scroll">
        <vue-seamless-scroll :data="scrolllistData" :class-option="optionSingleHeight" class="seamless-warp">
            <ul class="item">
                <li v-for="(item,index) in scrolllistData" @click="getData(item,index)" :key="index">
                    <span class="date">{{item.telphone}}</span>
                </li>
            </ul>
        </vue-seamless-scroll>        
    </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll/src'
import {onMounted,ref,reactive,provide,inject,computed} from 'vue'
export default {
    name: 'scroll',
    components: {
        vueSeamlessScroll
    },
    props: {
        listData: {
            type: Array
        }
    },
    setup(props){
        const scrolllistData = ref(props.listData);
        const keyName = ref(props.titleKey);
        const getData =(data,index)=>{
            console.log("data",data);
        };
        const optionSingleHeight = computed(()=>{
            return {
                    step: 0.2, // 数值越大速度滚动越快
                    limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
                    hoverStop: false, // 是否开启鼠标悬停stop
                    direction: 1, // 0向下 1向上 2向左 3向右
                    openWatch: true, // 开启数据实时监控刷新dom
                    singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
                    singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
                    waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
            }      
        })

        onMounted(()=>{})
        return{
            scrolllistData,
            keyName,
            //方法
            getData,
            optionSingleHeight
        }
    }
}
</script>
<style lang="less">
    *{
        margin:0;padding:0;
    }
    .seamless-warp {
        width:100%;
        height: 0.6rem;
        overflow: hidden;
        line-height:0.60rem;
        background:rgba(0, 0, 0, 0.2);
        font-size: 0.24rem;
        border-radius:0.6rem;
        color: #fff;
    }
</style>
