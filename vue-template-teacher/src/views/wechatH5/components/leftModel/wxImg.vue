<template>
    <div class="wImg wModel">
        <div class='img-style'>
            <img :src="wImgObj.style==1?img1:img2" />
        </div>
    </div>
</template>
<script>
import img1 from '../../../../assets/wxImg/img_l_1.png'
import img2 from '../../../../assets/wxImg/img_l_2.png'
export default {
    name:'wImg',
    props:['moduleData','indesNum'],
    data(){
        return{
            wImgObj:{},
            img1:img1,
            img2:img2
        }
    },
    created(){
       this.wImgObj = this.moduleData;
    },
    computed:{
        realTimeDataUpdate(){   
            return this.$store.state.wxStore.wxLeftData[this.indesNum].action;
        },
    },
    watch:{
        realTimeDataUpdate(cur,old){
            if(this.moduleData.id){
                this.wImgObj = this.$store.state.wxStore.wxLeftData.find(item=>item.id==this.moduleData.id);
            }else{
                this.wImgObj = this.$store.state.wxStore.wxLeftData.find(item=>item.addLeftId==this.moduleData.addLeftId);
            }             
        },
        moduleData(cur,old){
            console.log('imgcur',cur);
            this.wImgObj=cur;
        }
    }
}
</script>
<style lang="scss" scoped>
    .wImg{
        .img-style{
            width: 315px;
            margin:0 auto;       
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
