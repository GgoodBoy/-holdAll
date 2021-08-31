<template>
    <div class="banner-modular">
        <el-carousel :height="heights">
            <el-carousel-item v-for="(item,index) in bannerlist" :key="index">
                <!-- <div class="img" :style="{'background':`url(${item.picUrl})no-repeat 50% 50% / cover`}" @click="goCourse(item)"></div> -->
                <img class="img" ref="imgTarget" :src="item.picUrl" @click="goCourse(item)"/>
            </el-carousel-item>
        </el-carousel>         
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
declare function require(string): string;
@Component({})
export default class Banner extends Vue{
    heights = '687px'
    @Prop()    
    bannerlist: Object
    created(){
        if(process.client){
            let width = document.body.clientWidth>1280?document.body.clientWidth:1280
            this.heights = (687*width)/1920+'px'
        }
    }   
    mounted(){
        window.onresize = ()=>{
            let dom = this.$refs.imgTarget[0];
            if(dom){
                this.heights = `${dom.clientHeight}px`
            }
        }
    }
    goCourse(data){
        switch (data.type) {
            case 1:
                console.log("pc无活动");
                break;
            case 2:
                this.$router.push(`/course/details?id=${Number(data.content)}`)
                break;
            case 3:
                window.open(data.content);
                break;                        
            default:
                console.log("当前无连接");
                break;
        }
        
    }   
}
</script>
<style lang="scss" scoped>
   .banner-modular{
       width: 100%;
        .img{
           width: 100%;
           max-width: 100%;
        }
   }
</style>
