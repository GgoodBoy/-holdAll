<template>
    <el-row justify="center">        
        <el-col class="lPadding10">
            <el-row>
                <el-col :span="2" class="lSize18">发布版本</el-col>
                <el-col :span="2" class="lSize16" style="cursor: pointer;" :offset="20" @click.native="returnList">返回</el-col>
            </el-row>
        </el-col>
        <el-col :span="18" :offset="1">
            <el-form ref="addform" :model="form" :rules="addRules" label-width="150px" label-position="left">
                <el-form-item label="APP类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择类型" @change="chooseVersionType">
                        <el-option :label="item.label" :value="item.value" v-for="(item,i) in optionsStyle" :key='i'></el-option>
                    </el-select>
                </el-form-item>                
                <el-form-item label="更新版本号" prop="versionNum">
                    <el-input v-model="form.versionNum" placeholder="如：1.0.1" style="max-width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="最低兼容版本" prop="minCompatibleVersionNum">
                    <el-autocomplete
                    class="inline-input"
                    v-model="form.minCompatibleVersionNum"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    @select="handleSelect"
                    ></el-autocomplete>                    
                    <!-- <el-select v-model="form.minCompatibleVersionNum" placeholder="请选择最低兼容版本">
                        <el-option :label="item" :value="item" v-for="item,i in versionList"></el-option>
                    </el-select> -->
                </el-form-item>
                <el-form-item label="IOS更新跳转地址" prop="jumpAddress" v-if="iosIsbool">
                    <el-input v-model="form.jumpAddress" placeholder="http://" style="max-width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="版本更新描述" prop="desc">
                    <el-input class="inputtextarea" placeholder="请输入版本描述" maxlength="200" v-model="form.desc" type="textarea"></el-input>
                    <span>{{form.desc.length||0}}/200</span>
                </el-form-item>
            </el-form>
        </el-col> 
        <el-col class="lCenter-r">
             <el-button type="primary" @click="onSubmit">发布</el-button>
        </el-col>
    </el-row> 
</template>
<script>
 export default {
    data() {    
        let creatUser = (rule,value,callback)=>{
            let regExp =/^\d+\.\d+(\.\d+)?$|^\d+\_\d+(\_\d+)?$/;
            if(value==''){
                callback(new Error('请输入版本号'))
            }else{
                if(!regExp.test(value)){
                    callback(new Error('版本号格式错误'));
                }else{
                    callback()
                }
            }
        } 
        let urltest = (rule,value,callback)=>{
            let regExp = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                if(regExp.test(value)||!value){
                    callback()
                }else{
                    callback(new Error('请输入正确url格式'));
                }           
        }       
      return {
        form: {
          versionNum: '',
          type: 1,
          minCompatibleVersionNum:'',
          desc: '',
          jumpAddress:'',
        },
        iosIsbool:false,
        optionsStyle: [
            {label:"ios",value:1},
            {label:"android",value:2},
            {label:"ios-pad",value:4},
            {label:"android-pad",value:5}
            ],
        versionList:[],
        addRules:{
            versionNum:[
                {  validator: creatUser, trigger: 'blur' }
            ],
            type:[
                { required: true, message: '请选择类型', trigger: 'change' }
            ],
            minCompatibleVersionNum:[
                { required: true, message: '请选择兼容版本', trigger: 'change' }
            ],
            desc:[
                { required: true, message: '请输入描述', trigger: 'blur' },
            ],
            jumpAddress:[
                 {  validator: urltest, trigger: 'blur' }
                ]
            
        },                
      }
    },
    created(){
        this.getlastVersionlist(this.form.type);
    },  
    mounted() {
      this.restaurants = this.loadAll();
    },      
    methods: {
        querySearch(queryString, cb) {
            let restaurants = this.versionList;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        }, 
        loadAll() {
            return this.versionList;
        },
        handleSelect(item) {
            console.log(item);
        },     
        getlastVersionlist(num){
            this.$http.get(this.$server.getlastVersionList(num)).then(res=>{
               if(res.status==200){
                   let contentdate = res.content;
                   this.versionList = contentdate.map(function (item) { 
                        return {"value":item};
                        });
               }
            })             
        },
        // beforeRouteLeave (to, from, next) {
        //     // 导航离开该组件的对应路由时调用
        //     console.log("beforeRouteLeave",3)
        //     var newFormData = JSON.stringify(this.form);
        //     if(this.dataUpdateBool!==newFormData){
        //         // this.toPath = to;
        //         next(false);         
        //         }else{
        //             next();
        //     };
        // }, 
        returnList(){
            this.$router.push({path:"/backstage/updateApp"});
        },
        chooseVersionType(e){
            this.form.minCompatibleVersionNum = '';
            if(e==1){
                this.iosIsbool = true;
            }else{
                this.iosIsbool = false;
            }
            this.getlastVersionlist(e);
        },
        onSubmit() {
            this.$refs['addform'].validate((valid)=>{
                if(valid){
                    this.$http.post(this.$server.VersionFormAdd,this.form).then(res=>{
                    if(res.status==200){
                        this.$router.push({path:"/backstage/updateApp"}) 
                        }
                    })
                }
            }) 
        }                             
    }
  }
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.inputtextarea .el-textarea__inner{
    min-height: 200px !important;
}
</style>


