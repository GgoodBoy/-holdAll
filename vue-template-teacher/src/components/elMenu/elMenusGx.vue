<template>
    <div>
        <el-row :gutter="20">
            <el-col class="lMarginTop30" :span="3" v-for="(items,index) in titleList" :key="index">
                <div class="typeStyle lSize16"  @click="$router.push(items.pathInfo)" :class="items.divCss?'setCss1':'setCss2'">
                {{items.name}}
                </div>
            </el-col>            
        </el-row>                    
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


