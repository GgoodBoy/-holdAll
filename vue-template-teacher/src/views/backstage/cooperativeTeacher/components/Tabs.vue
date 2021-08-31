<template>
    <div class="tabs clearfix">
        <div class="tab-item fl" :class="tabIndex===1?'active':''" @click="tabsFun(1)">
            收入概况
        </div>
        <div class="tab-item fl"  :class="tabIndex===2?'active':''"  @click="tabsFun(2)">
            销售数据
        </div>
    </div>
</template>
<script type="application/ecmascript">
    export default{
        props:{
            tabIndex:{
                type:Number,
                default:1
            }
        },
        methods:{
            tabsFun(num){
                if(num!=this.tabIndex){
                    this.$emit('tabsChange', num);
                }
            }
        }
    }
</script>
<style lang="scss">
    .tabs {
        height: 80px;
        padding: 20px 0;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 9px 0px rgba(237, 241, 247, 1);
        border-radius: 5px;
        padding-left: 100px;
    .tab-item {
        color:rgba(56,65,86,1);
        font-size: 16px;
        padding: 10px 0;
        position: relative;
        cursor:pointer;
    &:nth-of-type(1) {
         margin-right: 110px;
     }
    &.active {
         color:rgba(247,59,66,1);
    &::after {
         content: '';
         position: absolute;
         width:40px;
         height:2px;
         background:rgba(247,59,66,1);
         bottom: 0;
         left: 0;
         right: 0;
         margin: 0 auto;
     }
    }
    }
    }
</style>
