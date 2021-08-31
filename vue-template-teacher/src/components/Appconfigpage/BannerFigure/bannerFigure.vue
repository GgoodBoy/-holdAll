<template>
    <div class="nextmodel">
        <el-row>
            <!-- <el-col :span="23" :offset="1" style="line-height: 40px;margin-top:15px;color:#9D9D9D">
                <el-row>
                    <el-col :span="5">模块名称</el-col>
                    <el-col :span="10"><el-input placeholder="请输入内容"></el-input></el-col>                    
                </el-row>
            </el-col> -->
            <el-col :span="23" :offset="1" style="line-height: 40px;color:#9D9D9D"><span>通栏图一个模块只能添加一个</span></el-col>
            <el-col>
                <listconfig :type="modeAllInfo.moduleType" :homeType="urlList.type" v-for="(item,i) in listst" :key="i" :message="item"></listconfig>
            </el-col>
            <el-col :span="20" :offset="2">
                <addplugin :listlength="listst.length" :type="modeAllInfo.moduleType" :imgconfig="(urlList.type==1||urlList.type==2)?'建议尺寸710*210，支持jpg、png':'建议尺寸1200*116，支持jpg、png'"></addplugin>
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
export default {
    components:{
        listconfig,
        addplugin,
        isok
    },
    data(){
        return {}
            },
    created(){},
    props:["modeAllInfo","powerArryList",'urlList'],
    computed:{
      listst:function(){
            return this.modeAllInfo.list;
        }        
    },
    methods:{},
    mounted(){
    }
}
</script>

<style>
</style>