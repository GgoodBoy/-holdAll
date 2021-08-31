<template>
<div class="app-add-list" ng-class="{'borderstyle':addtype==='banner'}">
     <el-row>
        <el-col :span="24" 
        v-if="addtype === 'featured'||
        addtype === 'guessLike'||
        addtype === 'popularCourses'">
            <titleisno :text1="textconfig" :addtypes="addtype" :lists="list" :listlengthNext="listlength"></titleisno>
        </el-col>
        <el-col :span="24" v-else>
            <titleisok :addtypes="addtype" :imgconfigs="imgconfig" :listlengthNext="listlength" :text1="textconfig" :text2="imgconfig"></titleisok>
        </el-col>
     </el-row>
</div>
</template>
<script>
import titleisok from "@/components/AppChildplugin/Addplugin/titleisok"; //
import titleisno from "@/components/AppChildplugin/Addplugin/titleisnos"; //
export default {
    components:{
        titleisok,
        titleisno
    },
    data() {
        return {
            addtype:""
        }
    },
    props: ["textconfig","imgconfig","type","listlength","list"],
    computed: {},
    watch:{},
    created() {
        this.addtype=this.type;
        },
    methods: {},
    mounted(){}
}
</script>
<style>
.app-add-list{
    border-radius: 6px;
    cursor: pointer;
    margin: 5% 0;
    padding: 10px 0 20px 0;
    background-color: #F5F5F5;
}
.borderstyle{
    border: 1px dashed #d9d9d9;
}
.app-add-list .centers{
        text-align: center;
        margin-top: 10px;
    }
.el-icon-plus{
    font-size: 26px;
    font-weight: bold;
    }
.app-add-list .textcss{
    line-height: 30px;
    }
.app-add-list .el-button--danger.is-plain{
    background-color:#9F0D00;
    color: #ffffff;
    width: 100%;
}   
</style>

