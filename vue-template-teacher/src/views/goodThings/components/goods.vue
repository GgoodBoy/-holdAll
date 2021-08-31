<template>
    <div class="goods-module module">
        <p class="module-name clearfix">
            <span class="name">{{curObj?curObj.name:''}}</span>
            <span class="more">更多>></span>
        </p>
        <div :class="moduleData.isFocus?'is-focus':''">
            <div class="occupancy-map" :class="`style${curObj.style}`"></div>
        </div>
    </div>
</template>
<script>
export default {
    name:'knowledge',
    props:['moduleData'],
    data(){
        return{
            curObj:{},
        }
    },
    created(){
       this.curObj = this.$store.state.goodsPage.moduleChildData.find(item=>item.localId==this.moduleData.localId);
    },
    computed:{
        adultHomeEditData(){
            return this.$store.state.goodsPage.editData.find(item=>item.active==true).data;
        },
    },
    watch:{
        adultHomeEditData(cur,old){
            this.curObj = this.$store.state.goodsPage.moduleChildData.find(item=>item.localId==this.moduleData.localId)||{};
        }
    }
}
</script>
<style lang="scss" scoped>
    .goods-module{
        .is-focus{
            position: relative;
            &::after{
                content:'';
                width: 100%;
                height: 100%;
                border:1px solid #e32513;
                top:0;
                left: 0;
                position: absolute;
                font-size: 0;
            }
        }
        .module-name{
            line-height: 16px;
            margin-bottom:10px;
            padding: 0 15px;
            .name{
                float: left;
                font-size: 16px;
                font-weight: bold;
            }
            .more{
                float: right;
                font-size: 14px;
            }
        }
        .occupancy-map{
            width: 345px;
            margin:0 auto;
            &.style1{
                height:130.5px;
                background: url('../../../assets/images/haowu_ys1.png')no-repeat 50% 50% /cover;
            }
            &.style2{
                height: 240px;
                background: url('../../../assets/images/haowu_ys2.png')no-repeat 50% 50% /cover;
            }
        }
    }
</style>
