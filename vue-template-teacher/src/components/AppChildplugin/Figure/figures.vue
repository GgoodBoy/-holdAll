<template>
        <div class="imglist">
            <div class="">
                <el-row>
                    <el-col :span="10" class="lSize38 lweight lPaddingRF20 lLeft-r" v-if="modeltype!='advertising'">{{message.moduleName}}</el-col>
                </el-row>
            </div>
            <div v-if="modeltype!=='featured'">
                <el-row type="flex" justify="center" class="figuresEvendd" v-for="(item, index) in imgurl" :key="index">
                    <el-col class="imgfiguresy" :span="22">
                        <img :src="item.picUrl||'./static/images/4.jpg'"/>
                    </el-col>              
                </el-row> 
            </div>
            <div v-if="message.moduleType==='featured'">
                <el-row v-if="yxAxios === 'y'" type="flex" justify="center" class="figuresEvendd" v-for="(item, index) in imgurl" :key="index">
                    <el-col class="imgfiguresy" :span="22">
                        <img :src="item.picUrl||'./static/images/4.jpg'"/>
                    </el-col>              
                </el-row>
                <el-row v-if="yxAxios === 'x'" type="flex" justify="center" class="figuresEvendd">
                    <el-col class="imgfiguresx figuresOdd" :span="11" v-for="(item, index) in imgurl"  :key="index">
                        <img :src="item.picUrl||'./static/images/4.jpg'"/>
                    </el-col>                
                </el-row>                
            </div>                     
                 
        </div>
</template>
<script>
export default {
    data(){
        return {
            // imgurlInfo:edit
        }
    },
    created(){},
    props:['message'],
    computed:{
        imgurl:function(){
            return this.message.list
        },
        modeltype:function(){
            return this.message.moduleType
        },
        yxAxios:function(){
            return this.message.list.length == 4?'x':'y'
        }
    },
    methods:{},
    mounted(){}
}
</script>
<style scoped lang="scss">
 @import "../../formSynthesisPlugin/my-component.css";
.imglist{
    margin: 0 auto;
    .figuresEvendd{
        flex-wrap:wrap;
        margin-top: 20px;
        padding-bottom: 20px;
    }
    .figuresOdd:nth-child(even){
                margin-left: 10px;
            }
    .figuresEvendd:nth-child(even){
                margin-top: 20px;
            }            
    .imgfiguresy{
        height: 69px;
        width: 710px;
        overflow: hidden;
        border-radius: 20px;
    }
    .imgfiguresx{
        height: 69px;
        overflow: hidden;
        border-radius: 20px;
    }
    // 表示的是第二个元素，包括第二个之前的元素
    .imgfiguresx:nth-child(-n+2){ 
        margin-top: 0px;
    }  
    // 表示的是第3个元素，包括第3个之后的元素
    .imgfiguresx:nth-child(n+3){
        margin-top: 30px;
    }      
}

</style>

