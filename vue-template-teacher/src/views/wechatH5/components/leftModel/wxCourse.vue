<template>
    <div class="wCourse wModel">
        <div class='course-style'>
            <img :src="wCourseObj.style==1?img1:img2" />          
        </div>
    </div>
</template>
<script>
import img1 from '../../../../assets/wxImg/course_l_1.png'
import img2 from '../../../../assets/wxImg/course_l_2.png'
export default {
    name:'wCourse',
    props:['moduleData','indesNum'],
    data(){
        return{
            wCourseObj:{},
            img1:img1,
            img2:img2
        }
    },
    created(){
       this.wCourseObj = this.moduleData;
    },
    computed:{
        realTimeDataUpdate(){   
            return this.$store.state.wxStore.wxLeftData[this.indesNum].action;
        },
    },
    watch:{
        realTimeDataUpdate(cur,old){
            if(this.moduleData.id){
                this.wCourseObj = this.$store.state.wxStore.wxLeftData.find(item=>item.id==this.moduleData.id);
            }else{
                this.wCourseObj = this.$store.state.wxStore.wxLeftData.find(item=>item.addLeftId==this.moduleData.addLeftId);
            }            
        },
        moduleData(cur,old){
            this.wCourseObj=cur;
        }
    }
}
</script>
<style lang="scss" scoped>
    .wCourse{
            .course-style{
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
