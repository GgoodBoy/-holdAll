<template>
    <div class="guess-like-module module">
        <p class="module-name clearfix">
            <span class="name" v-show="curObj.name&&curObj.name.length>0">{{curObj?curObj.name:''}}</span>
            <span class="point" v-show="typeof num=='object' && num.length>1">
                <i v-for="(item,i) in num" :key="i"></i>
            </span>
        </p>
        <div :class="moduleData.isFocus?'is-focus':''">
            <div class="occupancy-map" :class="`style${curObj.style}`"></div>
        </div>
    </div>
</template>
<script>
export default {
    name:'guess-like',
    props:['moduleData'],
    computed:{
        num(){
            let obj = this.$store.state.homeConfig.adultHomeModuleChildData.find(item=>item.localId==this.moduleData.localId);
            if(obj){
                let temp = obj.data.find(item=>item.active==true);
                if(temp){
                    let arr = [ ];
                    for(let i=0;i<temp.guessLikeData.number;i++){
                        arr.push('')
                    }
                    return arr;
                }
            }
        },
        adultHomeEditData(){
            return this.$store.state.homeConfig.adultHomeEditData.find(item=>item.active==true).data;
        },
    },
    data(){
        return{
            curObj:{},
        }
    },
    created(){
       this.curObj = this.$store.state.homeConfig.adultHomeModuleChildData.find(item=>item.localId==this.moduleData.localId);
    },
    watch:{
        adultHomeEditData(cur,old){
            this.curObj = this.$store.state.homeConfig.adultHomeModuleChildData.find(item=>item.localId==this.moduleData.localId)||{};
        }
    }
}
</script>
<style lang="scss" scoped>
    .guess-like-module{
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
            .point{
                float: right;
                i{
                    display: inline-block;
                    height: 10px;
                    width: 10px;
                    background: #aaa;
                    border-radius: 50%;
                    margin:0 5px;
                }
            }
        }
        .occupancy-map{
            width: 345px;
            margin:0 auto;
            &.style1{
                height: 86px;
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/chengren/mk1/cnxh/ys1.png')no-repeat 50% 50% /cover;
            }
            &.style2{
                height: 184px;
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/chengren/mk1/cnxh/ys2.png')no-repeat 50% 50% /cover;
            }
        }
    }
</style>
