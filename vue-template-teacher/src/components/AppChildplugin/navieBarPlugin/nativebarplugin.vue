<template>
<div>
    <el-row class='box'>
        <el-col :span="6" class="NativeName" v-for="(item,i) in listst" :key="i">
            <div class="map" v-if="item.classifyId==''"></div>          
            <el-row style="margin-bottom:5px;" v-else>
                <el-col>
                    <el-row>
                        <div class="sizeimg">
                            <img :src="item.picUrl"/>
                        </div>
                        <div class="sizetitle">{{item.name||"图片"}}</div>
                    </el-row>
                </el-col>
            </el-row>
        </el-col>        
    </el-row>
</div>

</template>
<script>
export default {
    data(){
        return {}
    },
    created(){},
    props:['message'],
    computed:{
        listst:function(){
          return this.message.list
        }        
    },
    methods:{},
    mounted(){}
}
</script>
<style>
.box{
    display: flex;
    overflow: hidden;
}
.NativeName{
    line-height: 30px;
    margin:0 20px;
}
.NativeName .sizeimg{
    width: 108px;
    height: 108px;
    border-radius: 36px;
    overflow: hidden;
    margin: auto;
}
.NativeName .sizetitle{
    font-size: 18px;
    margin-top: 15px;
    color: #7B7B7B;
}
.NativeName .nativeList{
    cursor: pointer;
    margin-bottom:10px;
}
.NativeName .map{
    background: url('../../../assets/images/pc_classify_bgd.png')no-repeat 50% 50%;
    width: 200px;
    height: 140px;
    background-size: 100% 100%;
}
</style>

