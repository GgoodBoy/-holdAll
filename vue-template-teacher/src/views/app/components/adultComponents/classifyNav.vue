<template>
    <div class="classify-nav-module module" :class="moduleData.isFocus?'is-focus':''">
         <div class="occupancy-map"></div>
    </div>
</template>
<script>
export default {
    name:'classify',
    props:['moduleData'],
    data(){
        return{
            img:'',
            curObj:{},
        }
    },
    created(){
       this.curObj = this.$store.state.homeConfig.adultHomeModuleChildData.find(item=>item.localId==this.moduleData.localId);
    },
    computed:{
        adultHomeEditData(){
            return this.$store.state.homeConfig.adultHomeEditData.find(item=>item.active==true).data;
        },
    },
    watch:{
        adultHomeEditData(cur,old){
            this.curObj = this.$store.state.homeConfig.adultHomeModuleChildData.find(item=>item.localId==this.moduleData.localId)||{};
        }
    }
}
</script>
<style lang="scss" scoped>
    .classify-nav-module{
        background: #fff;
        height: 90px;
        background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/chengren/mk1/daohang/daohang.png')no-repeat 50% 50% /cover;
    }
</style>

