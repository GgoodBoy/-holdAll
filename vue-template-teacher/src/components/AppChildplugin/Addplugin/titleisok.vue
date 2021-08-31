<template>
    <el-row>
        <el-col :span="24" v-if="addBool==true"> 
            <el-col :span="14" :offset="5" class="centers textcss">
                <el-button v-if="isDisabled==false" type="danger" plain @click="addOrsaveEven">{{text1}}</el-button>
                <el-button v-else type="danger" :title="'最多只能选择'+listlengthNext+'个列表'"  :disabled="isDisabled" plain @click="addOrsaveEven">{{text1}}</el-button>
            </el-col>        
        </el-col>
        <el-col :span="24">
            <el-row>
                <!-- <el-col :span="24" class="centers" style="color:#bbbbbb;margin:10px 0 0 0;text-align:center;">{{imgconfigs}}</el-col> -->
                <el-col :span="24" class="centers" style="color:#bbbbbb;margin:10px 0 0 0;text-align:center;">{{text2}}</el-col>
            </el-row>            
        </el-col>
    </el-row>
</template>
<script>
export default {
    data() {
        return {
            addBool:true
        }
    },
    props: ['addtypes','imgconfigs','text1','text2','listlengthNext'],
    computed: {
        isDisabled(){
            switch (this.addtypes) {
                case "banner":
                    if(this.listlengthNext==6){
                        return true;
                    }else{
                        return false;
                    }
                    break;
                case "featured":
                    if(this.listlengthNext==100){
                        return true;
                    }else{
                        return false;
                    }
                    break;                    
                case "classify":
                    if(this.listlengthNext==100){
                        return true;
                    }else{
                        return false;
                    }
                    break; 
                case "columnsCourse":
                    if(this.listlengthNext==2){
                        return true;
                    }else{
                        return false;
                    }
                    break;                                                                       
                default:
                    break;
            }
        }        
    },
    watch:{},
    created() {
        this.addBool = this.text1!=undefined?true:false;
    },
    methods: {
        addOrsaveEven(){
                this.$store.commit("appConfig/addAppList",new Date().getTime())                
        }        
    },
    mounted(){}
}
</script>
<style>

</style>

