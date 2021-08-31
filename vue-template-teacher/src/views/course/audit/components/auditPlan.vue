<template>
    <div class="plone-wrap clearfix">
        <div class="plan-item fl" :class="planIndex===1?'active':''" @click="goView(1)">
            课程信息
        </div>
        <div class="plan-item fl"  :class="planIndex===2?'active':''" @click="goView(2)">
            课时信息
        </div>
    </div>
</template>

<script>
export default {
    props:{
        planIndex:{
            type:Number,
            default:1
        },
        content:String
    },
    methods:{
        goView(index){
            var objInfo={id:index,content:this.content}
            // this.$emit('linkUpdate',index)
            this.$emit('linkUpdate',objInfo)
        }
        }
    };
</script>
<style lang="scss" scoped>
.plone-wrap {
    height: 80px;
    padding: 20px 0;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 9px 0px rgba(237, 241, 247, 1);
    border-radius: 5px;
    padding-left: 100px;
    .plan-item {
        color:rgba(56,65,86,1);
        font-size: 16px;
        padding: 10px 0;
        position: relative;
        cursor: pointer;
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
