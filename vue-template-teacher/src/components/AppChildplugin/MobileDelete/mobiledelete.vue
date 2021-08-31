<template>
    <div class="mobileCss">
        <div v-if="(from=='adult'&&$authJudge('homeset:pcadult:up'))||(from=='child'&&$authJudge('homeset:pcchildren:up'))" class="mobiletop" v-bind:class="{ 'backgroudNo': !chooseColor1, 'chooseSaveNo':chooseSave,'backgroudOk': chooseColor1 }" @click="mobiletopEven">
            <div><i class="el-icon-caret-top"></i></div>
            <div>上移</div>
        </div>
        <div v-if="(from=='adult'&&$authJudge('homeset:pcadult:down'))||(from=='child'&&$authJudge('homeset:pcchildren:down'))"  class="mobilebottom" v-bind:class="{ 'backgroudNo': !chooseColor2, 'chooseSaveNo':chooseSave, 'backgroudOk': chooseColor2 }" @click="mobilebottomEven">
            <div><i class="el-icon-caret-bottom"></i></div>
            <div>下移</div>            
        </div>
        <!-- v-if="powerArryList.includes('appIndexConfig:delete')" -->
        <div v-if="(from=='adult'&&$authJudge('homeset:pcadult:del'))||(from=='child'&&$authJudge('homeset:pcchildren:del'))"  class="mobiledelete" v-bind:class="{ 'backgroudNo': !chooseColor3, 'backgroudOk': chooseColor3 }" @click="mobiledeleteEven">
            <div><i class="el-icon-delete"></i></div>
            <div>删除</div>            
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            chooseColor1:false,
            chooseColor2:false,
            chooseColor3:false
        }
    },
    components:{},
    props:['soleid','powerArryList','mobiledIsOk','objHome','from'],
    created(){},
    watch:{},
    computed:{
        chooseSave(){
            return this.mobiledIsOk==true?true:false;
        }
    },
    methods:{
        mobiletopEven(){
            // this.chooseColor1=true,
            // this.chooseColor2=false,
            // this.chooseColor3=false            
            if(this.soleid){
                if(this.$store.state.appConfig.idInitlist.indexOf(this.$store.state.appConfig.appStore.soleid)!=-1){
                    this.chooseColor1=true,
                    this.chooseColor2=false,
                    this.chooseColor3=false      
                   
                    this.$store.commit("appConfig/moveModeleEven","top")
                    this.sortHttp();
                }
            }else{
                this.$message.error("排序失败，请选择模块！");
            }
        },
        sortHttp(){
            var self = this;
            var dataIDlist =this.$store.state.appConfig.alldata;
            var sortIdArr = []; 
            dataIDlist.forEach(element => {
                sortIdArr.push(element.id);
            });
            this.$http
                    .post("/appIndexConfigs/sort",{sort:JSON.stringify(sortIdArr),type:self.objHome.type})
                        .then(res => {
                            console.log("排序成功！")
                        })
                        .catch((res) => {
                                this.$message.error("排序失败！");
                        });  
        },
        mobilebottomEven(){
            // this.chooseColor1=false,
            // this.chooseColor2=true,
            // this.chooseColor3=false            
            if(this.soleid){
                if(this.$store.state.appConfig.idInitlist.indexOf(this.$store.state.appConfig.appStore.soleid)!=-1){
                    this.chooseColor1=false,
                    this.chooseColor2=true,
                    this.chooseColor3=false                       
                    this.$store.commit("appConfig/moveModeleEven","bottom");
                    this.sortHttp();
                }
            }else{
                this.$message.error("排序失败，请选择模块！");
            }

        },
        mobiledeleteEven(){
            var self = this
            this.chooseColor1=false,
            this.chooseColor2=false,
            this.chooseColor3=true            
            self.$store.commit('appConfig/loadingBool', true);
            var getAppInfo= function (){
                let currentId = self.soleid;
                let initIdArr = self.$store.state.appConfig.idInitlist;
                let deferred = $.Deferred()
                if(initIdArr.indexOf(currentId)!=-1&&initIdArr[0]!=currentId){
                    self.$http
                        .delete("/appIndexConfigs/deleteById/"+currentId,{params: {type:self.objHome.type}})
                            .then(res => {
                                if (res.status === 200) {
                                    self.$emit('removeChooseId');
                                    deferred.resolve(currentId);
                                    self.$message({
                                        message: "删除成功，正在获取最新数据",
                                        type: "success"
                                    });
                                }
                            })
                }else{
                    self.$message.error("第一条不能删除！");
                    deferred.resolve(currentId);
                }
                return deferred.promise();
            }
            $.when(getAppInfo())
                .done(function(data){
                        self.$store.commit("appConfig/modelMeDelete",data);  
                        self.$nextTick(function(){
                            self.$store.commit('appConfig/loadingBool', false);
                        })       
                })
                .fail(function(){
                        self.$store.commit('appConfig/loadingBool', false);
                        self.$message.error("第一条不能删除！");
                   }
                );
        }
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
   .mobileCss{
        width: 35px;
        position: absolute;
        left: 755px;
        top: 300px;
       .mobiletop,.mobilebottom,.mobiledelete{
           margin-top: 10px;
           width: 100%;
           text-align:center;
           border-radius: 5px;
           padding: 5px;
        //    cursor: pointer;
           i{
               width: 100%;
               font-size: 16px;
           }
       }
   } 
   .mobiledelete{
       cursor: pointer;
   }
   .backgroudOk{
       background: brown;
       color: #fff;
       cursor: pointer
   }
   .chooseSaveNo{
        cursor:not-allowed !important;
        background: #F5F5F5 !important;
   }
   .backgroudNo{
       background: #fff;
       color: brown;
       cursor: pointer
   }
</style>

