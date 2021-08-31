<template>
    <div class="dialog_tab" v-if="dialogType">
        <div class="tabs">
            <img class="close" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/close.png" @click="closeEven"/>
            <div class="tabsDiv">
                <div class="divTitle">
                    <div>获奖时间</div>
                    <div>奖品</div>
                </div>
                <div class="divConten">
                    <div class="list" v-for="(item,index) in packTabList" :key='index'>
                        <div>{{item.createdAt}}</div>
                        <div>{{item.name}}</div>
                    </div>
                    <div style="font-size: 0.24rem;text-align: center;" v-if="!packTabList">暂无数据</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {onMounted,ref,inject,watch} from 'vue'

export default {
    name: 'youhui',
    components: {},
    props: {
        packList:Array
    },
  setup(props,context){
        const packTabList = ref(props.packList);//获取父级参数
        const dialogType = inject('tableDialType');
        watch(props,(nweProps, oldProps)=>{
            if(nweProps.packList){
                packTabList.value = nweProps.packList;
            }
        },{immediate:true})   
        const closeEven = ()=>{
            context.emit('closeEven',{dialogId:2,type:false})
        }
        onMounted(()=>{})
        return{
            packTabList,
            dialogType,

            //方法
            closeEven
        }
  }
}
</script>
<style lang="less">

.dialog_tab{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background:rgba(0,0,0,0.8);
    z-index: 3;
    .tabs{
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        margin:auto;	
        width:7.5rem;
        height: 6.8rem;
        background:url("https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_box4.png") no-repeat center;
        background-size: cover;
        .close{
            width: 0.66rem;
            height: 0.66rem;
            top: -0.78rem;
            right: 0.6rem;
            position: absolute;        
        }
        .tabsDiv{
            width: 5.2rem;
            left: 1.2rem;
            top: 0.8rem;
            position:absolute;
            .divTitle{
                overflow: hidden;
                div{
                    float: left;
                    width:50%;
                    text-align: center;
                    font-size: 0.28rem;
                    font-weight:700;
                    color:#B1041E;
                }
            }
            .divConten{
                margin-top:0.2rem;
                max-height:3rem;
                overflow-y: scroll;
                .list{
                    overflow: hidden;
                    margin-top: 0.2rem;
                    div{
                        float: left;
                        font-size: 0.24rem;
                        width: 50%;
                        text-align: center;
                        height: 0.7rem;
                        line-height: 0.7rem;
                        background: #FFE9EC;
                        border-radius: 0.7rem;
                        color: #666;
                    }
                }
            }
        }
    }
}
</style>
