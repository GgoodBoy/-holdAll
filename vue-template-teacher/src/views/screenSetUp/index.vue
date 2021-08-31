<template>

    <div>
        <el-row :gutter="20">
            <!-- v-if="flags.includes(items.code)" -->
            <el-col class="lMarginTop30" :span="6" v-for="(items,index) in listArry" :key="index">
                <div class="typeStyle lSize18"  @click="$router.push(items.path)">
                {{items.title}}
                </div>
            </el-col>
        </el-row>                    
    </div>    
</template>

<script>
export default {
    data() {
        return {
          listArry:[
            {
                title:'开屏',
                path:'/screenIndex/screenSetUp'
            },
            {
                title:'首页设置',
                path:'/screenIndex/screenHome'
            }              
          ]
        };
    },
    created(){
        
    },
    methods: {}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../components/formSynthesisPlugin/my-component.css";
.typeStyle{
    width: 100%;
    height: 100px;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 100px;
}
.typeStyle:hover{
    background-color:#ccc;
    color:#fff;
    cursor: pointer;
}
</style>
