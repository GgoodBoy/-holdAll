<template>
    <div>
        <el-row>
            <el-col :span="23" :offset="1" style="line-height: 40px;margin-top:15px;color:#9D9D9D">
                <el-row>
                    <el-col :span="5">模块名称</el-col>
                    <el-col :span="10"><el-input maxlength="10" v-model="valueTitle" placeholder="请输入内容"></el-input></el-col>                    
                </el-row>
            </el-col>
            <el-col :span="23" :offset="1" style="line-height: 40px;color:#9D9D9D">本模块最多添加<span class="redFontColor">2个课程</span></el-col>
            <el-col>
                <listconfig :numberId="number" @impressTopData="moveDiv" :homeType="urlList.type" @mouseenter.native="enter(item.id)" @mouseleave.native="leave(-1)" :type="modeAllInfo.moduleType" v-for="item,i in listst" :key="i" :message="item"></listconfig>
            </el-col>
            <el-col :span="20" :offset="2">
                <addplugin :type="modeAllInfo.moduleType" :listlength="listst.length" :imgconfig="(urlList.type==1||urlList.type==2)?'建议尺寸710*260，支持jpg、png':'建议尺寸1200*116，支持jpg、png'" textconfig="添加通栏课图"></addplugin>
            </el-col>
            <el-col  :span="20" :offset="2" style="text-align:center;">
                <isok :modelsInfo="modeAllInfo" :powerArryListSun="powerArryList" :urlProp="urlList"></isok>
            </el-col>     
        </el-row>       
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
import listconfig from "@/components/AppChildplugin/ListConfig/listConfig";
import addplugin from "@/components/AppChildplugin/Addplugin/addplugin";
import isok from "@/components/AppChildplugin/Isok/isok";
export default {
    components:{
        listconfig,
        addplugin,
        isok
    },
    data(){
        return {
            valueTitle:'',
            timer:null,
            number:0
        }
            },
    created(){
        this.valueTitle=this.modeAllInfo.moduleName;
    },
    props:["modeAllInfo","powerArryList",'urlList'],
    computed:{
      listst:function(){
            return this.modeAllInfo.list;
        }
    },
    methods:{
        enter(item){
            this.number = item;
        },
        leave(item){
            this.number = item;
        }, 
        moveDiv(parmes){
            var indexs = '';
            var item='';
            var lists =[];
            if(this.modeAllInfo.list.length){
                this.modeAllInfo.list.forEach((element,i) => {
                        if(element.id!==parmes.id){
                            lists.push(element);
                        }else{
                            item = element;
                            indexs = i;
                        }
                });
                switch (parmes.type) {
                    case 1:
                        if(indexs){
                            lists.splice(indexs-1, 0, item); 
                        }else{
                            lists.splice(indexs, 0, item); 
                        }
                        break;
                    case 2:
                        if(this.modeAllInfo.list.length!==(indexs+1)){
                            lists.splice(indexs+1, 0, item);
                        }else{
                            lists.splice(indexs, 0, item);
                        }
                        break;                
                    default:
                        console.log("1");
                        break;
                } 
            }
            this.modeAllInfo.list = lists;
            console.log("移动",lists);
        }               
    },
    watch: {
        valueTitle: function(curVal,oldVal){
            this.modeAllInfo.moduleName = curVal;
        }      
    },
    mounted(){
    }
}
</script>

<style>
 @import "../../formSynthesisPlugin/my-component.css";
</style>