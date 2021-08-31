<template>
    <div class="img-warp">
        <div class="shade"></div>
        <div class="img-box">
            <div class="main">
                <img :src="src"/>
                <i class="el-icon-circle-close-outline" @click="hide"></i>
            </div>
        </div>
    </div>
</template>
<script type="application/ecmascript">
    export default{
        props:{
            src:String
        },
        methods:{
            hide(){
                this.$emit('hidden','')
            }
        }
    }
</script>
<style lang="scss">
    .img-warp{
        position: fixed;
        top:0;
        left: 0;
        z-index: 1000;
        width: 100%;
        height: 100%;
        .shade{
            position: absolute;
            top:0;
            left: 0;
            z-index: 101;
            width: 100%;
            height: 100%;
            background: #000000;
            opacity: 0.7;
        }
        .img-box{
            position: absolute;
            z-index: 102;
            top:0;
            left: 0;
            width: 100%;
            height: 100%;
            .main{
                transform: translate(-50%,-50%);
                position: absolute;
                top:50%;
                left:50%;
                .el-icon-circle-close-outline{
                    color:#fff;
                    position: absolute;
                    right: -16px;
                    top:-16px;
                    font-weight: normal;
                    z-index: 2;
                    font-size: 32px;
                }
            }
        }
    }
</style>
