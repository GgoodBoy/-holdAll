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
        this.curObj = this.$store.state.homeConfig.childHomeModuleChildData.find(item=>item.localId==this.moduleData.localId);
    },
    computed:{
        childHomeEditData(){
            return this.$store.state.homeConfig.childHomeEditData.find(item=>item.active==true).data
        },
    },
    watch:{
        childHomeEditData(cur,old){
            this.curObj = this.$store.state.homeConfig.childHomeModuleChildData.find(item=>item.localId==this.moduleData.localId)||{};
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
            position: relative;
            &.style1{
                height: 133px;
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/youer/mk1/banner/ys1.png')no-repeat 50% 50% /cover;
                &::before{
                    content: '';
                    display: block;
                    top: 0;
                    left: -100%;
                    height: 133px;
                    width: 345px;
                    position: absolute;
                    background: url(https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/youer/mk1/banner/ys1.png) no-repeat 50% 50%;
                    background-size: 96%;
                }
                &::after{
                    content: '';
                    display: block;
                    top: 0;
                    left: 100%;
                    height: 133px;
                    width: 345px;
                    position: absolute;
                    background: url(https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/youer/mk1/banner/ys1.png) no-repeat 50% 50%;
                    background-size: 96%;
                }
            }
            &.style2{
                height: 163px;
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/youer/mk1/banner/ys2.png')no-repeat 50% 50% /cover;
                 &::before{
                    content: '';
                    display: block;
                    top: 0;
                    left: -100%;
                    height: 163px;
                    width: 345px;
                    position: absolute;
                    background: url(https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/youer/mk1/banner/ys2.png) no-repeat 50% 50%;
                    background-size: 96%;
                }
                &::after{
                    content: '';
                    display: block;
                    top: 0;
                    left: 100%;
                    height: 163px;
                    width: 345px;
                    position: absolute;
                    background: url(https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/youer/mk1/banner/ys2.png) no-repeat 50% 50%;
                    background-size: 96%;
                }
            }
        }
    }
</style>
