<template>
    <div class="wVideo wModel">
        <div class='video-style'>
            <img :src='img1'/>
        </div>
    </div>
</template>
<script>
import img1 from '../../../../assets/wxImg/video_1.png'
export default {
    name:'wVideo',
    props:['moduleData','indesNum'],
    data(){
        return{
            wVideoObj:{},
            img1:img1
        }
    },
    created(){
       this.wVideoObj = this.moduleData;
    },
    computed:{
        realTimeDataUpdate(){   
            return this.$store.state.wxStore.wxLeftData[this.indesNum].action;
        },
    },
    watch:{
        realTimeDataUpdate(cur,old){
            if(this.moduleData.id){
                this.wVideoObj = this.$store.state.wxStore.wxLeftData.find(item=>item.id==this.moduleData.id);
            }else{
                this.wVideoObj = this.$store.state.wxStore.wxLeftData.find(item=>item.addLeftId==this.moduleData.addLeftId);
            }            
        }
    }
}
</script>
<style lang="scss" scoped>
    .wVideo{
        width: 315px;
        margin:0 auto;
        .video-style{
            img{
                display: block;
                width: 100%;     
            }
        }
    }
    .selectAction{
        border: 1px solid red
        };
</style>
