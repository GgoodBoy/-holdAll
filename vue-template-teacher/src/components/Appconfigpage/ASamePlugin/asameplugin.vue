<template>
    <div>
        <el-row>
            <el-col :span="22" :offset="1">
                <el-row class="sameCssParent">
                    <el-col class="coursesNum">本模块最多添加<span class="redFontColor">8个课程</span></el-col>
                    <el-col class="topcss">
                        <el-row>
                            <el-col :span="6">模块名称</el-col>
                            <el-col :span="12" :offset="1"><el-input maxlength="10" :title="moduleName" v-model="moduleName" placeholder="请输入内容"></el-input></el-col>
                        </el-row>
                    </el-col>
                    <el-col class="topcss">
                        <el-row>
                            <el-col :span="6">选择数量</el-col>
                            <el-col :span="12" :offset="1">
                                  <el-select v-model="value" placeholder="请选择">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col class="topcss">
                        <img :src="imgurl" />
                    </el-col>   
                    <el-col :span="20" :offset="2" style="text-align:center;">
                        <!-- v-if="powerArryListSun.includes('appIndexConfig:add')" -->
                        <el-button v-if="($authJudge('homeset:pcadult:savedata')&&urlProp.type==3)||($authJudge('homeset:pcchildren:savedata')&&urlProp.type==4)" class="isokplugins" @click="save">保存</el-button>
                    </el-col>                                     
                </el-row> 
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data(){
        return {
            options: [{
                    value: 1,
                    label: '1'
                    }, {
                    value: 2,
                    label: '2'
                    }, {
                    value: 3,
                    label: '3'
                    }, {
                    value: 4,
                    label: '4'
                    },{
                    value: 5,
                    label: '5'
                    },{
                    value: 6,
                    label: '6'
                    },{
                    value: 7,
                    label: '7'
                    },{
                    value: 8,
                    label: '8'
                    }
                    ],
                value: '',
                imgurl:'./static/images/style.jpg',
                locObj:{},
                moduleName:'',
                dataIsokBool:'',
                errorShowBool:false,
    }},
    created(){

        this.value = this.modelFromChildren.styleId.toString();
        this.moduleName = this.modelFromChildren.moduleName;
        this.locObj = {
            moduleType:this.modelFromChildren.moduleType,
            moduleName:this.modelFromChildren.moduleType,
            styleId:this.modelFromChildren.styleId,
            list:[],
            type:2,
            index:0,
            id:this.modelFromChildren.id
        }
    },
    props:['modelFromChildren',"powerArryListSun","urlProp"],
    computed:{},
    methods:{        
        save(){
            var self= this;
            self.$store.commit('appConfig/loadingBool', true);
            self.locObj.styleId = Number(this.value);
            this.locObj.moduleName = this.moduleName;
            if(self.$store.state.appConfig.idInitlist.indexOf(self.locObj.id)==-1){
                self.locObj.id = -1;
            }          
            //"/appIndexConfigs/add"  
            self.$http
                .post(self.urlProp.addUrlProp, { 
                    modules: JSON.stringify([self.locObj]),
                    type:self.urlProp.type
                })
                .then(res => {
                    if(res.status=="200"){
                        self.$store.commit("appConfig/setModelnameNull");
                        var getAppInfo= function (){
                            var deferred = $.Deferred();
                            //"/appIndexConfigs/selectAll"
                            self.$http.get(self.urlProp.selectUrlAll)
                            .then(res => {
                                if (res.status === 200) {
                                    deferred.resolve(res.content);//触发, 并传递数据
                                }
                            })
                            .catch(res => {
                                deferred.reject(res);
                            });
                            return deferred.promise();
                        }
                        $.when(getAppInfo())
                            .done(function(data){
                                self.$store.commit("appConfig/appHomePageData",data)
                                self.$nextTick(function(){
                                    self.$store.commit('appConfig/loadingBool', false);
                                })               
                            })
                            .fail(function(){
                                self.$store.commit('appConfig/loadingBool', false);
                                console.log("出错啦!")}
                            );                        
                    }
                })
                .catch(res => {
                    self.$store.commit('appConfig/loadingBool', false);
                    console.log("2111",res)
                });             
        }
    },
    mounted(){}
}
</script>
<style>
@import "../../formSynthesisPlugin/my-component.css";
.sameCssParent{
    line-height: 40px;
    color: #B8B8B8;
}
.sameCssParent .topcss{
    margin-top: 10px;
}
.isokplugins{
    background-color: #9F0D00;
    color: #ffffff;
    width: 90px;
    height:15px;
    line-height: 0px;
    margin: 10px 0;
}
</style>
