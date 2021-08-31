<template>
<!-- v-if="powerArryListSun.includes('appIndexConfig:add')" -->
    <el-button v-if="($authJudge('homeset:pcadult:savedata')&&urlProp.type==3)||($authJudge('homeset:pcchildren:savedata')&&urlProp.type==4)" class="isokplugin" @click="save">保存</el-button>
</template>
<script>
export default {
    data(){return {}},
    created(){},
    props:["modelsInfo","powerArryListSun","urlProp"],
    computed:{
    },
    methods:{
        // moduleName: ""
// moduleType: "classify"
        save(){
            // //保存信息
            let list =[];
            let self = this;
            var obj2 ={};
            if(self.modelsInfo.moduleType=="classify"){
                for (const iterator of self.modelsInfo.list) {
                    if(iterator.classifyId==undefined&&iterator.classifyId==''){
                        this.$message.error('分类不能为空');
                        return;
                        break;
                    }
                }
            }
            self.modelsInfo.styleId = self.modelsInfo.list.length;
            $.extend( true, obj2, self.modelsInfo );
            list.push(obj2);
            if(list.length==0) return ;
            list[0].list.forEach(element => {
                delete element.id;
                delete element.newCreat;
            });                
            if(self.$store.state.appConfig.idInitlist.indexOf(list[0].id)==-1){
                list[0].id = -1;
            }           
            self.$store.commit('appConfig/loadingBool', true);
            switch (list[0].moduleType) {
                case "classify":
                    list[0].moduleName="classify";
                    break;
                case "advertising":
                    list[0].moduleName="advertising";
                    break;   
                case "banner":
                    list[0].moduleName="banner";
                    break;                         
                default:
                    break;
            }
            if(!list[0].list.length){
                switch (list[0].moduleType) {
                    case "timeZone":
                    case "guessLike":
                    case "popularCourses":
                          console.log("不校验是否为空");
                        break;                         
                    default:
                        this.$store.commit('appConfig/loadingBool', false);
                        this.$message.error("模板信息不能为空！");
                        return;
                        break;
                }                
            }
            if(list[0].moduleType=='classify'){
                let repeatFlag = false;
                let arr = list[0].list
                for(let i in arr){
                    let index = Number(i)+1;
                    let tempArr = arr.slice(index,arr.length);
                    let obj = tempArr.find(item=>item.classifyId==arr[i].classifyId)
                    if(obj){
                        repeatFlag = true;
                        break;
                    }
                }
                if(repeatFlag){
                    this.$message.error('不允许添加相同名称的分类');
                    self.$store.commit('appConfig/loadingBool', false);
                    return;        
                }
            }
            // "/appIndexConfigs/add"   /appIndexConfigs/add
            self.$http
                .post(self.urlProp.addUrlProp, {
                    modules: JSON.stringify(list),
                    type:self.urlProp.type
                })
                .then(res => {
                    if(res.status=="200"){
                        self.$store.commit("appConfig/setModelnameNull")
                        var getAppInfo= function (){
                            var deferred = $.Deferred();
                            // "/appIndexConfigs/selectAll" /appIndexConfigs/selectAll
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
                                //监听DOM渲染结束后在执行的回调函数；
                                self.$store.commit('appConfig/mobiledChangeTypeNo');
                                self.$nextTick(function(){
                                    self.$store.commit('appConfig/loadingBool', false);
                                })               
                            })
                            .fail(function(){
                                self.$store.commit('appConfig/loadingBool', false);
                                console.log("出错啦!")}
                        );                        
                        self.$nextTick(function(){
                            self.$store.commit('appConfig/loadingBool', false);
                        })
                    }
                })
                .catch(res => {
                    self.$store.commit('appConfig/loadingBool', false);
                });                
        }
    },
    mounted(){}
}
</script>
<style>
.isokplugin{
    background-color: #9F0D00;
    color: #ffffff;
    width: 90px;
    height:15px;
    line-height: 0px;
    margin: 10px 0;
}
</style>

