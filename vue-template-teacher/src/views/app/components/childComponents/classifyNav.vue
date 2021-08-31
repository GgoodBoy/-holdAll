<template>
    <div class="classify-nav-module module" :class="moduleData.isFocus?'is-focus':''">
        <div class="bgd" v-if="settingType=='4'">
            <p>语文</p>
            <p>精品</p>
            <p>国艺</p>
            <p>诗词</p>
            <p>综合</p>
        </div>
        <div v-else class="occupancy-map"></div>
         
    </div>
</template>
<script>
export default {
    name:'classify',
    props:['moduleData','settingType'],
    data(){
        return{
            img:'',
            curObj:{},
        }
    },
    created(){
       this.curObj = this.$store.state.homeConfig.childHomeModuleChildData.find(item=>item.localId==this.moduleData.localId);
    },
    computed:{
        adultHomeEditData(){
            return this.$store.state.homeConfig.childHomeEditData.find(item=>item.active==true).data;
        },
    },
    watch:{
        adultHomeEditData(cur,old){
            this.curObj = this.$store.state.homeConfig.childHomeModuleChildData.find(item=>item.localId==this.moduleData.localId)||{};
        }
    }
}
</script>
<style lang="scss" scoped>
    .classify-nav-module{
        background: #fff;
        .occupancy-map{
            width: 345px;
            margin:0 auto;                
            height: 90px;
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/chengren/mk1/daohang/daohang.png')no-repeat 50% 50% /cover;
        }
        .bgd{
            background: #dadada;
            display: flex;
            height: 50px;
            align-items: center;
            p{
                font-size: 16px;
                padding: 0 20px;
            }
        }
    }
</style>

