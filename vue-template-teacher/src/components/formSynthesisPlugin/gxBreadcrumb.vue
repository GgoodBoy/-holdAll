<template>
    <div class="lMarginTB20 lPaddingRF20">
        <el-breadcrumb separator="/">
            <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item> -->
            <el-breadcrumb-item class="lSize18" :to="{ path: item.path }" v-for="(item,i) in mateInfo" :key="i">{{item.title}}</el-breadcrumb-item>
        </el-breadcrumb>        
    </div>
</template>
<script>
export default {  
    data(){return {
        mateInfo:[]
    }},
    created(){
        var self = this;
        let routerInfo = this.$route.matched;
        routerInfo.forEach((element,i) => {
            var obj ={title:'',path:''};
           if(i>0){
               obj.path = element.path;
               obj.title = element.meta.title;
               self.mateInfo.push(obj);
           }
       });
    },
    props:{},
    computed:{},
    methods:{},
    mounted(){}
}
</script>
<style>
@import "./my-component.css";
</style>

