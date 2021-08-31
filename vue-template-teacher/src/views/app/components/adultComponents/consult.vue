<template>
    <div class="consult-module module">
        <div :class="moduleData.isFocus?'is-focus':''" class="box">
            <div v-if="curObj.style==1" class="style1">
                <p class="module-name" v-show="curObj.name&&curObj.name.length>0">{{curObj?curObj.name:''}}</p>
                <div class="occupancy-map">
                    <p :class="curObj.name&&curObj.name.length>0?'has-name':''">XXXXXXXXXXXXX</p>
                    <span v-show="curObj.name&&curObj.name.length>0"></span>
                </div>
                <span class="more">更多>></span>
            </div>
            <div v-else class="style2">
                <div class="style2-h">
                    <p class="module-name" v-show="curObj.name&&curObj.name.length>0">{{curObj?curObj.name:''}}</p>
                    <span class="more1">更多>></span>
                </div>
                <div class="style2-c">
                    <!--curObj.data[1].consultData.length-->
                    <p v-for="(item,index) in 3" :key="index">XXXXXXXXXXXXXXXXXXXXXX</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'consult',
    props:['moduleData'],
    data(){
        return{
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
    .consult-module{
        position: relative;
        .is-focus{
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
        .box{
             background: #fff;
        }
        .module-name{
            margin-left: 15px;
            display: inline-block;
            vertical-align: middle;
            font-size: 16px;
            line-height: 44px;
            font-weight: bold;
        }
        .style2{
            background: #fff;
            padding-bottom: 1px;
            .style2-h{
                overflow: hidden;
                .module-name{
                    float: left;
                }
                .more1{
                    float: right;
                    line-height: 44px;
                    margin-right: 15px;
                }
            }
            .style2-c{
                padding: 0 15px;
                p{
                    margin-bottom:10px;
                }
            }
        }
        .occupancy-map{
            display: inline-block;
            vertical-align: middle;
            height: 44px;
            line-height: 44px;
            margin:0 auto;
            padding: 0 15px;
            position: relative;
            p{
                position: relative;
                &.has-name{
                    margin-left: 5px;
                    padding-left: 5px;
                }
            }
            span{
                display: block;
                position: absolute;
                left: 10px;
                top:12px;
                height: 16px;
                width: 3px;
                background: #333;
            }
        }
        .more{
            position: absolute;
            right: 15px;
            bottom:0px;;
            font-size: 14px;
            line-height: 44px;
        }
    }
</style>
