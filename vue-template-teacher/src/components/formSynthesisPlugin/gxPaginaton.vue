<template>
    <div>
        <el-pagination
         @current-change="handleCurrentChange"
        class="lCenter-r lMarginTop30"
        background
        layout="prev, pager, next"
        :total="pageToal"
        :current-page="pageAtions.pageNum>0?pageAtions.pageNum:1"
        :disabled="disabledbool"
        :page-size="pageSize">
        </el-pagination>         
    </div>
</template>
<script> 
export default {
    data(){return {
        disabledbool:false
    }},
    created(){},
    props:['pageAtions'],
    computed:{
        // disabledbool(){
        //     return this.pageAtions.pageBool;
        // },
        pageSize(){
            return this.pageAtions.pageSize;
        },
        pageToal(){
            return this.pageAtions.pageTotal;
        }
    },
    methods:{
        handleCurrentChange(val){
            this.$emit('childByPageValue', val)
        }
    },
    watch: {  
    pageAtions: {  
　　　　handler(newValue, oldValue) {  
                    this.disabledbool = newValue.pageBool;
        　　},  
        　　deep: true  
        　　}  
        },
    mounted(){}
}
</script>
<style>
@import "./my-component.css";
</style>

