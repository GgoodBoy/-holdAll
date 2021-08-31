<template>
    <div class="wCourseGroup wModel">
        <div class='course-group-style'>
            <img :src="wCourseGroupObj.style==1?img1:img2" />  
        </div>
    </div>
</template>
<script>
import img1 from '../../../../assets/wxImg/group_l_1.png'
import img2 from '../../../../assets/wxImg/group_l_2.png'
export default {
    name:'wCourseGroup',
    props:['moduleData','indesNum'],
    data(){
        return{
            wCourseGroupObj:{},
            img1:img1,
            img2:img2
        }
    },
    created(){
       this.wCourseGroupObj = this.moduleData;
    },
    computed:{
        realTimeDataUpdate(){   
            return this.$store.state.wxStore.wxLeftData[this.indesNum].action;
        },
    },
    watch:{
        realTimeDataUpdate(cur,old){
            if(this.moduleData.id){
                this.wCourseGroupObj = this.$store.state.wxStore.wxLeftData.find(item=>item.id==this.moduleData.id);
            }else{
                this.wCourseGroupObj = this.$store.state.wxStore.wxLeftData.find(item=>item.addLeftId==this.moduleData.addLeftId);
            }            
        },
        moduleData(cur,old){
            this.wCourseGroupObj=cur;
        }
    }
}
</script>
<style lang="scss" scoped>
    .wCourseGroup{
            .course-group-style{
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
