<template>
    <div class="wRubikCube wModel">
        <div class='rubikcube-style'>
           <img :src="wRubikCubeObj.style==1?img1:img2" />          
        </div>
    </div>
</template>
<script>
import img1 from '../../../../assets/wxImg/rubik_l_1.png'
import img2 from '../../../../assets/wxImg/rubik_l_2.png'
export default {
    name:'wxRubikCube',
    props:['moduleData','indesNum'],
    data(){
        return{
            wRubikCubeObj:{},
            img1:img1,
            img2:img2
        }
    },
    created(){
       this.wRubikCubeObj = this.moduleData;
    },
    computed:{
        realTimeDataUpdate(){   
            return this.$store.state.wxStore.wxLeftData[this.indesNum].action;
        },
    },
    watch:{
        realTimeDataUpdate(cur,old){
            if(this.moduleData.id){
                this.wRubikCubeObj = this.$store.state.wxStore.wxLeftData.find(item=>item.id==this.moduleData.id);
            }else{
                this.wRubikCubeObj = this.$store.state.wxStore.wxLeftData.find(item=>item.addLeftId==this.moduleData.addLeftId);
            }
        },
        moduleData(cur,old){
            console.log('cur-RubikCube',cur);
            this.wRubikCubeObj=cur;
        }
    }
}
</script>
<style lang="scss" scoped>
    .wRubikCube{
            .rubikcube-style{
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
