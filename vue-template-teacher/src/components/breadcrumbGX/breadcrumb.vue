<template>
    <div>
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right"> -->
        <el-breadcrumb separator="/">
            <!-- separator="/" -->
            <el-breadcrumb-item class="lSize18 lLine40" :to="{ path: item.pathInfo }" v-for="(item,index) in titleList" :key="index">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>                   
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data(){                     
        return {
            titleList:[]
        }
    },
    props:['menuList'],
    created(){   
        this.titleList = this.menuList;
    },
    watch:{
       menuList:{//深度监听，可监听到对象、数组的变化
            handler(val, oldVal){
                this.titleList = val;
            },
            deep:true,
            immediate: true
        }       
    },
    methods:{},
    components:{},
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.typeStyle{
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 40px;
}
.typeStyle:hover{
    cursor: pointer;
}
.setCss1{
    background-color:#ccc;
    color:#fff;
}
.setCss2{
    background-color:#FFF;
    color:#000;    
}
</style>


