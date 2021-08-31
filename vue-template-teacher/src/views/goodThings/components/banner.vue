<template>
    <div class="banner-module module" :class="moduleData.isFocus?'is-focus':''">
        <div class="occupancy-map" :class="`style${curObj.style}`"></div>
    </div>
</template>
<script>
export default {
    name:'banner',
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
        editData(){
            return this.$store.state.goodsPage.editData.find(item=>item.active==true).data
        },
    },
    watch:{
        editData(cur,old){
            this.curObj = this.$store.state.goodsPage.moduleChildData.find(item=>item.localId==this.moduleData.localId)||{};
        }
    }
}
</script>
<style lang="scss" scoped>
    .banner-module{
        background: #fff;
        padding:15px;
        .occupancy-map{
            width: 345px;
            &.style1{
                height: 133px;
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/chengren/mk1/banner/ys1.png')no-repeat 50% 50% /cover;
            }
            &.style2{
                height: 163px;
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/chengren/mk1/banner/ys2.png')no-repeat 50% 50% /cover;
            }
        }
    }
</style>
