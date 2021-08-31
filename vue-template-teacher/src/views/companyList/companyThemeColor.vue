<template>
    <div>     
        <el-row>
            <el-col :span="18">
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
            </el-col>   
            <el-col :span="16" class="lMarginTop30">
                <el-row>
                    <el-col>                
                        <el-row>
                            <el-col :span="6" class="lLine40">
                                移动端灰色主题
                            </el-col>  
                            <el-col :span="12" class="lLine40">
                                <el-radio v-model="radio1" label="0">正常色彩</el-radio>
                                <el-radio v-model="radio1" label="1">经典灰色</el-radio>                        
                            </el-col> 
                            <el-col :span="6">
                                <el-button type="danger" v-if="$authJudge('set:theme:save')" @click="saves(6)">保存</el-button>
                            </el-col>                                                             
                        </el-row>
                    </el-col>
                    <el-col class="lMarginTop20">  
                        <el-row>
                            <el-col :span="6" class="lLine40">
                                PC端灰色主题
                            </el-col>  
                            <el-col :span="12" class="lLine40">
                                <el-radio v-model="radio2" label="0">正常色彩</el-radio>
                                <el-radio v-model="radio2" label="1">经典灰色</el-radio>                        
                            </el-col> 
                            <el-col :span="6">
                                <el-button type="danger" v-if="$authJudge('set:theme:save')" @click="saves(7)">保存</el-button>
                            </el-col>                                                             
                        </el-row>
                    </el-col>                                                             
                </el-row>                 
            </el-col>                   
        </el-row>
    </div>
</template>
<script>
import { getToken } from '@/utils/auth';
import myEditor from "@/components/editor/editor";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){
        return {
            radio1:'0',
            radio2:'0',
            titleList:[
                {
                    name:'网站管理系统',
                    pathInfo:''
                },
                {
                    name:'主题色设置',
                    pathInfo:''
                }                                               
            ],            
        }
        },
    created() {
        this.getInfo();
    },
    components:{
        breadcrumb
    },
    methods: {
        getInfo(){
            var self=this;       
            this.$http.get(self.$server.getThemeInfoAboutUs,{}).then(res => {
                    if (res.status === 200) {
                    //    mobileOpt 移动端灰色主题设置  0：不启用，1：启用
                    //    pcOpt  PC端灰色主题设置  0：不启用，1：启用
                        if(Number(res.content.mobileOpt)==1){
                            self.radio1 = '1';
                        }else{
                             self.radio1 = '0';
                        }
                        if(Number(res.content.pcOpt)==1){
                             self.radio2 = '1';
                        }else{
                            self.radio2 = '0';
                        }                        
                    }
                })
        },
        saves(num){
            var self=this;
            var parmes={
                isEnable:num==6?self.radio1:self.radio2
            };        
            this.$http
               .post(self.$server.saveThemeAboutUs({type:num}), parmes)
                .then(res => {
                    if (res.status === 200) {
                        self.$message.success({ message: "设置成功" });
                    } else {
                        self.$message.success({ message: "设置错误" });
                    }
                })
        }
    }
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";  
</style>


