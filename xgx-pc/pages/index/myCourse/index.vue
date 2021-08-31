<template>
    <div class="course-page">
        <div class="container clearfix">
            <div class="menu">
                <LeftNative :routId="selectDivShow" :cssList="csslist" :valueList="currentVal" v-on:liSetDataToParents="ulGetDataForLi"></LeftNative>
            </div>
            <div class="child-page">
                <nuxt-child></nuxt-child>
            </div>
        </div>        
    </div>
</template>
<script lang="ts">
import { Component , Vue} from 'vue-property-decorator'
import LeftNative from '~/components/LocalComponents/leftNative.vue'
@Component({
    components:{LeftNative}
})
export default class Auth extends Vue{
    selectDivShow:number = 1;
    csslist:Object={
        childCss:'font-size: 18px; padding:20px 0;cursor: pointer;',
        parentCss:'text-align: center;',
        headLiCss:'font-size: 18px; padding:20px 0;color:#fff;background:#000',
        headText:'个人中心',
        headShow:false,
        cssType:1
    };    
    currentVal:Object[] = [
      {text:'已购课程',selectId:1},
      {text:'浏览记录',selectId:2},
      {text:'免费课程',selectId:3}
    ];   
    async ulGetDataForLi(index){
        this.selectDivShow=Number(index);
        switch (this.selectDivShow) {
            case 1:
                this.$router.push({path:'/myCourse', query:{selectId:index}})
                break;
            case 2:
                this.$router.push({path:'/myCourse/browseList', query:{selectId:index}})
                break;
            case 3:
                this.$router.push({path:'/myCourse/freeCourses', query:{selectId:index}})
                break;                                                        
            default:
                break;
        }
    }     
}
</script>
<style lang="scss" scoped>
    .course-page{
        padding:20px;
        background: #F3F5F7;
        .container{
            width: 1187px;
            position: relative;
            margin: 30px auto;
            min-height: 600px;
            .menu{
                float: left;
                width: 200px;
                margin-right: 20px;
                background: #fff;
                min-height: 300px;
            }
            .child-page{
                overflow: hidden;
                min-height: 600px;

            }
        }
    }
</style>