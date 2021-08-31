<template>
    <el-row :span="24">
        <el-col :span="14" :offset="5" class="centers textcss">
            <el-button v-if="isDisabled==false" type="danger" plain @click="addOrsaveEven">{{text1}}</el-button>
            <el-button v-else type="danger" :title="'最多只能选择'+listlengthNext+'个列表'" :disabled="isDisabled" plain @click="addOrsaveEven">{{text1}}</el-button>
        </el-col>
    </el-row>
</template>
<script>
export default {
    data() {
        return { }
    },
    props: ['addtypes','text1','listlengthNext','lists'],
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
                case "classify":
                    if(this.listlengthNext==100){
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
    created() {},
    methods: {
        addOrsaveEven(){
            var self = this;
            var listArry = [];
            if(this.addtypes==="featured"){
                self.lists.forEach((element,index) => {
                    listArry.push(element.id);
                });
                self.$store.commit("appConfig/isOkOrAddEvent",{bool:true,datas:listArry,bools:true})
            }else{
                self.$store.commit("appConfig/addAppList",new Date().getTime())                
            }
        }        
    },
    mounted(){}
}
</script>
<style>

</style>