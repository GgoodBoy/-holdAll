<template>
    <div>
        <el-row>
            <el-col :span="23" :offset="1" style="line-height: 40px;margin-top:15px;color:#9D9D9D">
                <el-row>
                    <el-col :span="5">模块名称</el-col>
                    <el-col :span="10"><el-input  v-model="modeltitle" placeholder="请输入内容"></el-input></el-col>                    
                </el-row>
            </el-col>
            <el-col class="topcss">
                <img :src="imgurl" />
            </el-col>             
            <el-col :span="23" :offset="1" style="line-height: 40px;color:#9D9D9D">本模块最多添加<span class="redFontColor">100个课程</span></el-col>
            <el-col v-if='!liststBool' class="styles" :span="21" :offset="1">
                <el-row v-for="item,i in listst" :key="i"  @mouseenter.native="enter(item.id)" @mouseleave.native="leave(-1)">
                    <el-col :span="22">
                        <el-row style="margin-top:5px;background-color:#FFB4AE;"
                            :key="i">
                            <el-col :span="3">{{i+1}}、</el-col>
                            <el-col :span="18" style="text-align:left;">{{item.courseName||item.title}}</el-col>
                            <el-col :span="3">
                                <i class="el-icon-close" @click="removes(item)"></i>
                            </el-col>
                        </el-row>                        
                    </el-col>
                    <el-col :span="1" :offset="1" style="margin-top:5px" v-if="number==item.id">
                        <div class="topStyle"><i class="el-icon-arrow-up" @click="topStyleEven"></i></div>
                        <div class="bottonStyle"><i class="el-icon-arrow-down"  @click="bottonStyleEven"></i></div>                        
                    </el-col>
                </el-row>
                <!-- <el-row style="margin-top:5px;background-color:#FFB4AE;" v-for="item,i in listst"
                    :key="i">
                    <el-col :span="3">{{i+1}}、</el-col>
                    <el-col :span="18" style="text-align:left;">{{item.courseName||item.title}}</el-col>
                    <el-col :span="3">
                        <i class="el-icon-close" @click="removes(item)"></i>
                    </el-col>
                </el-row>               -->
            </el-col>
            <el-col :span="20" :offset="2">
                <addplugin :listlength="listst.length" :list="listst" :type="modeAllInfo.moduleType" textconfig="添加课程"></addplugin>
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
//推存图
import {mapState,mapActions} from 'vuex'
import addplugin from "@/components/AppChildplugin/Addplugin/addplugin";
import isok from "@/components/AppChildplugin/Isok/isok";
export default {
    components:{
        addplugin,
        isok
    },
    data(){
        return {
            modeltitle:'',
            imgurl:'./static/images/style.jpg',
            number:null
            }
        },
    created(){
        this.modeltitle = this.modeAllInfo.moduleName;
    },
    props:["modeAllInfo","powerArryList",'urlList'],
    computed:{
      liststBool:function(){
            return this.modeAllInfo.list.length>0?this.modeAllInfo.list[0].newCreat:0;
        },        
      listst:function(){
            return this.modeAllInfo.list;
        }         
    },    
    methods:{
        //向上移动；
        topStyleEven(){
            console.log("上");
            var parmes = {
                id:this.number,
                type:1
            };
            this.moveDiv(parmes);
        },
        bottonStyleEven(){
            console.log("下");
            var parmes = {
                id:this.number,
                type:2
            };
            this.moveDiv(parmes);
        }, 
        //移入事件       
        enter(item){
            this.number = item;
        },
        //移出事件     
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
        },        
        removes(e){
            let obj = {};
            let self = this;
            obj.removeBanner=function(object, objid, id) { 
                    let arrys = [];
                    for (const iterator of object) {
                        if(iterator.id==objid){
                            for (var value of iterator.list) {
                                if (value.id!==id) { 
                                    arrys.push(value)
                                }
                            }
                            iterator.list = arrys;
                            break;
                        }
                    }
                } 
            obj.soleid = e.id
            this.$store.commit("appConfig/removeAction",obj)            
        }
    },
    watch: {
        modeltitle: function(curVal,oldVal){
            if(curVal!==oldVal){
                this.$store.commit("appConfig/setTitileEven",curVal)
            }
        }
    },    
    mounted(){
    }
}
</script>

<style scoped>
 @import "../../formSynthesisPlugin/my-component.css";
.styles{
    line-height: 40px;
    border-radius: 2px;
    color: #9F0D00;
    text-align: center;
}
.styles .el-icon-close{
    cursor: pointer;
    font-size:15px;
}
.styles .topStyle,.styles .bottonStyle{
    height: 20px;
    line-height: 20px;
    cursor: pointer;
}
.topcss{
     margin-top: 10px;
     text-align: center;
}
</style>