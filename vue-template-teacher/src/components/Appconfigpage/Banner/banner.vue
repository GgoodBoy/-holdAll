<template>
    <div>
        <el-row>
            <el-col>
                <listconfig :type="modeAllInfo.moduleType" :homeType="urlList.type" :numberId="number" v-for="(item,i) in listst" :key="i" :message="item" @impressTopData="moveDiv" @mouseenter.native="enter(item.id)" @mouseleave.native="leave(-1)"></listconfig>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="2">
                <addplugin :type="modeAllInfo.moduleType" :listlength="listst.length"  textconfig="添加banner图" :imgconfig='imgconfig'></addplugin>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="2" style="text-align:center;">
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
            list:[],
            number:0,
            imgconfig:''
            }
        },
    created(){
        // '建议尺寸1920*687最多上传6张,支持jpg,png'
        this.imgconfig = (this.urlList.type==1||this.urlList.type==2)?'建议尺寸710,266最多上传6张,支持jpg,png':'建议尺寸752*290最多上传6张,支持jpg,png';
    },
    props:["modeAllInfo","powerArryList",'urlList'],  
    computed:{
      listst:function(){
            return this.modeAllInfo.list||[];
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
    mounted(){
        console.log(this)
    }
}
</script>

<style>

</style>
