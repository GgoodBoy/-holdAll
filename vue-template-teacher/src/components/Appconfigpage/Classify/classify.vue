<template>
    <div>
        <el-row>
            <el-col>
                <listconfig :pcType="type" :classifyList="classifyList" :numberId="number" :homeType="urlList.type" @impressTopData="moveDiv" @mouseenter.native="enter(item.id)" @mouseleave.native="leave(-1)" :type="modeAllInfo.moduleType" v-for="(item,i) in listst" :key="i" :message="item"></listconfig>
            </el-col>
            <el-col :span="20" :offset="2">
                <addplugin :listlength="(listst&&listst.length>0)?listst.length:0" :type="modeAllInfo.moduleType" :textconfig="'添加导航分类图'" :imgconfig="'建议尺寸108*108，最多上传100张，支持jpg、png'" ></addplugin>
            </el-col>
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
import eventAction from '../../../views/lEventAtion';
let actions = new eventAction()
export default {
    components:{
        listconfig,
        addplugin,
        isok
    },
    data(){
        return {
            // allList:[],
            number:0,
            classifyList:[]
            }
        },
    created(){
       this.getClassifyList()
        // actions.getData('/category/selectList')
        //         .then(data => {
        //             this.allList = data;
        //             console.log(data)
        //         })
        //         .fail(function(){                  
        //             console.log("出错啦!")}
        //         );                          
    },
    props:["modeAllInfo","powerArryList",'urlList','type'],
    computed:{
      listst:function(){
            return this.modeAllInfo.list;
        }         
    },
    methods:{
        getClassifyList(){
            let query = {
                params:{
                    type:this.type,
                    classifiesType:1
                }
            }
            this.$http.get(`${this.$server.getClassify}`,query).then(res=>{
                if(res.status==200){
                    this.classifyList = res.content.map(item=>{
                        return {
                            label:item.name,
                            value:item.id
                        }
                    })
                }
            })
        },
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
    }
}
</script>

<style>

</style>