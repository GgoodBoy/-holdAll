<template>
    <div>
        <el-row :gutter="20">
            <el-col>
                <breadcrumb :menuList ='titleListName'></breadcrumb>
            </el-col>            
            <el-col>
                <elMenusGx :menuList ='titleList'></elMenusGx>
            </el-col>   
            <el-col class="lMarginTop30" v-if="chooseBools=='list'">
                <el-row :gutter="15" class="lLine40">
                    <el-col :span="6"><el-input v-model.trim="name" @keyup.native="proving('name')" placeholder="请输入内容"></el-input></el-col>
                    <el-col :span="2"><el-button v-if="$authJudge('activity:webactivity:poetry:select')" class="redBackColor butColorF" @click="seachEven">查询</el-button></el-col>
                    <el-col :span="2" :offset="13"><el-button v-if="$authJudge('activity:webactivity:poetry:add')" class="redBackColor butColorF" @click="addOrReturnSubjectEven('','formUpdate','add')">添加新诗词</el-button></el-col>
                </el-row>
            </el-col>            
            <el-col class="lMarginTop10" v-if="chooseBools=='list'">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loadingOne"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        min-width="60"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="诗词名称"
                        min-width="200"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="description"
                        label="描述"
                        min-width="200"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="content"
                        label="诗词内容"
                        min-width="300"
                        show-overflow-tooltip>
                    </el-table-column>                                                                  
                    <el-table-column
                        fixed="right"
                        label="操作"
                        min-width="60">
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col class="lCenter-r">
                                        <el-button v-if="$authJudge('activity:webactivity:poetry:edit')" type="text" class="black-btn" @click="addOrReturnSubjectEven(scope.row,'formUpdate','update')">修改</el-button>
                                    </el-col>                                                                                                                         
                                </el-row>                                                      
                            </template>                    
                    </el-table-column>                                                
                </el-table> 
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
                </div>                                 
            </el-col>
            <el-col class="formUpdateCss lMarginTop30 lPadding20" v-if="chooseBools=='formUpdate'">
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        
                        <el-row :gutter="15">
                            <el-col :span="12">
                                <el-form-item label="标题:" prop="name">
                                    <el-input type="text" placeholder="如果要换行显示，需要在换行的文字后面添加“|”符号" maxlength="30" @keyup.native="proving('ruleFormName')" v-model.trim="ruleForm.name"></el-input>
                                </el-form-item>                                     
                            </el-col>
                            <el-col :span="4" class="lLine40" >* 诗词标题不能为空</el-col>
                            <el-col class="lSize12" :offset="2">限30个字以内</el-col>
                        </el-row> 
                        <el-row :gutter="15" class="lMarginTB20">
                            <el-col :span="12">
                                <el-form-item label="描述:" prop="description">
                                    <el-input type="text" maxlength="50" @keyup.native="proving('ruleFormDescription')" v-model.trim="ruleForm.description"></el-input>
                                </el-form-item>                                     
                            </el-col>
                            <el-col :span="4" class="lLine40">* 诗词描述不能为空</el-col>
                            <el-col class="lSize12" :offset="2">限50个字以内</el-col>
                        </el-row>    
                        <el-form-item label="内容:" prop="content">
                            <el-input 
                            type="textarea" 
                            maxlength="500"
                            placeholder="如果要换行显示，需要在换行的文字后面添加“|”符号"
                            :autosize="{ minRows: 10}"
                            v-model="ruleForm.content"></el-input>
                            <p class="lSize12">限500字以内</p>
                        </el-form-item>        
                        <el-form-item label="海报背景:"> 
                            <!-- assembleStyle -->
                            <el-row>
                                <el-col>
                                    <el-row :gutter="5">
                                        <el-col :span="2" class="lLeft-"><el-button type="text" @click="courseChooseEven" class="greenColor">请选择</el-button></el-col>
                                        <el-col :span="10" class="lLeft-r redFontColor lSize12" v-show="courseIdBool">*请选择海报背景图</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col class="lLeft-r">{{ruleForm.imageName}}</el-col>
                                    </el-row>
                                </el-col>
                                <!-- <el-col v-else>
                                        {{ruleForm.imageName}}
                                </el-col> -->
                            </el-row>                            
                        </el-form-item>    
                        <el-form-item label="购买地址:" prop="buyUrl">
                            <el-input type="text" v-model.trim="ruleForm.buyUrl" @keyup.native="proving('buyUrl')"></el-input>
                        </el-form-item>                                             
                        <el-form-item>
                            <el-button style="margin-left:20%;" @click="dialogIsNo('list')">返回列表</el-button>
                            <el-button style="margin-left:10%;" class="redBackColor butColorF" @click="submitForm('ruleForm','list')">生成海报</el-button>
                        </el-form-item>                        
                    </el-form>                
            </el-col>         
        </el-row>  
        <el-dialog
        :visible.sync="centerDialogList"
        :close-on-click-modal='false'
        max-height="300"
        width="30%">
            <el-row>
                <el-col>
                     <el-row :gutter="20">
                        <el-col :span="18" class="lCenter-r">
                            <el-input placeholder="请输入内容"  @keyup.native="proving('inputCourseTwo')" v-model.trim="inputCourseTwo"></el-input>
                        </el-col>
                        <el-col :span="6" class="lCenter-r">
                            <el-button class="redBackColor butColorF" @click="courseChooseEven">查找</el-button>
                        </el-col>                                                 
                     </el-row>
                </el-col>
                <el-col class="lMarginTop30">
                        <el-table
                            ref="multipleTable"
                            :data="tableDataList"
                            tooltip-effect="dark"
                            style="width: 100%"
                            max-height="500"
                            @selection-change="handleSelectionChange">
                            <el-table-column
                            type="selection"
                            :selectable="selectable"
                            width="55">
                            </el-table-column>
                            <el-table-column
                            prop="name"
                            label="海报名称">
                            </el-table-column>
                        </el-table>
                        <div class="block">
                            <el-pagination
                                background
                                layout="prev, pager, next"
                                @current-change="childPageValueSecond"
                                :current-page.sync="pageAtionSecond.paginationPage"
                                :total="pageAtionSecond.pageTotal">
                            </el-pagination>
                        </div>                   
                </el-col>
                <el-col class="lMarginTop20">
                    <el-row>
                        <el-col :span="6" class="lCenter-r" :offset="6">
                            <el-button @click="dialogIsNo(2)">取消选择</el-button>
                        </el-col>
                        <el-col :span="6" class="lCenter-r">
                            <el-button class="redBackColor butColorF" @click="courselistIsOkOrNo()">确定选择</el-button>
                        </el-col>
                    </el-row>
                </el-col>  
            </el-row>
        </el-dialog>                  
    </div>
</template>
<script>
import elMenusGx from "@/components/elMenu/elMenusGx";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data(){     
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {
                case "name":
                case "description":
                case "content":
                    var regExp =/^(?!.*\\.*$)/;
                    if (!value) {
                        if(rule.fullField=="name"){
                            return callback(new Error('请填写标题名称'));
                        }else if(rule.fullField=="description"){
                            return callback(new Error('请填写描述信息'));
                        }else{
                            return callback(new Error('请填写内容'));
                        }
                    }else{
                        setTimeout(() => {
                            if (!regExp.test(value)) {
                                callback(new Error('不能输入"\\"特殊字符'));
                            } else {
                                callback();
                            }
                        }, 300);  
                    }
                break;   
                case "buyUrl":
                    var regExp =/(http|https):\/\/([\w.]+\/?)\S*/;
                    if(!self.isOKOrNoTwo){
                        if (!value) {
                            return callback(new Error('请填写购买地址'));
                            }
                            setTimeout(() => {
                            if (!regExp.test(value)) {
                                callback(new Error('请输入正确的购买地址'));
                            } else {
                                callback();
                            }
                        }, 300);
                    }else{
                        callback();
                    }                
                break;                           
            }
        };                         
        return {
            flags:[],
            tableDataList:[],
            tableData:[{
                sortId:1,
                H5name:'hahah',
                describe:'描述',
                poetryContent:'春眠不觉晓'
            }],
            ruleForm:{
                name:'',
                description:'',
                content:'',
                posterUrl:'',
                buyUrl:'',
                imageName:'',
            },
            rules: {
                name: [
                    { required: true , validator: checkAge, trigger: 'blur'}
                ],  
                description: [
                    { required: true , validator: checkAge, trigger: 'blur' }
                ],                      
                content: [
                    {required: true ,validator: checkAge, trigger: 'blur'}
                ],
                buyUrl: [
                    { required: true ,validator: checkAge, trigger: 'blur'}
                ]
            },    
            titleListName:[
                            {
                                name:'活动',
                                pathInfo:'/activityObjList'
                            },
                            {
                                name:'H5活动',
                                pathInfo:''
                            }               
                ],
            titleList:[
                {
                    name:'测评管理',
                    pathInfo:'/activityObj/answer',
                    divCss:false
                },
                {
                    name:'题目库',
                    pathInfo:'/activityObj/itemBank',
                    divCss:false
                },
                {
                    name:'诗词库',
                    pathInfo:'/activityObj/poetryLibrary',
                    divCss:true
                },
                {
                    name:'设置',
                    pathInfo:'/activityObj/setUpGx',
                    divCss:false
                },
                {
                    name:'统计',
                    pathInfo:'/activityObj/gxStatistics',
                    divCss:false
                }                                
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },   
            pageAtionSecond:{
                pageTotal:0,
                paginationPage:1
            },          
            pageSize:10,
            pageNo:1,            
            chooseBools:'list',
            name:'',
            poetryName:'',
            loadingOne:false,
            multipleSelection:[],
            courseIdBool:false,
            inputCourseTwo:'',
            centerDialogList:false,
            assembleStyle:'',
            updataSubjectId:''
        }
    },
    created(){   
        this.getPoetryTableList(1);  
    },
    components:{
        elMenusGx,
        breadcrumb
    },
    methods:{
        proving(val){
            var self = this;
            var reg = /^(?!.*\\.*$)/;        
            switch (val) {
                case 'imgName':
                    if(!reg.test(self.imgName)){
                        this.imgName='';
                    }                    
                    break; 
                case 'name':
                    if(!reg.test(self.name)){
                        this.name='';
                    }                    
                    break; 
                case 'ruleFormName':
                    if(!reg.test(self.ruleForm.name)){
                        this.ruleForm.name='';
                    }                    
                    break; 
                case 'ruleFormDescription':
                    if(!reg.test(self.ruleForm.description)){
                        this.ruleForm.description='';
                    }                    
                    break; 
                case 'buyUrl':
                    if(!reg.test(self.ruleForm.buyUrl)){
                        this.ruleForm.buyUrl='';
                    }                    
                    break; 
                case 'inputCourseTwo':
                    if(!reg.test(self.inputCourseTwo)){
                        this.inputCourseTwo='';
                    }                    
                    break;                              
                default:
                    break;
            }    
        },         
        //搜索
        seachEven(){
            this.getPoetryTableList(1); 
        },
        //试题列表
        getPoetryTableList(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loadingOne = true;
            var params = {
                pageNo:self.pageNo,
                pageSize:self.pageSize,
                name:self.name
            };
            self.$http.get(self.$server.h5PoetryList(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                return element;
                            });                            
                        }                    
                   }; 
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loadingOne = false;
               }
            })
            .catch(res => {
                    self.loadingOne = false;
            });            
        },
        //取消选择
        dialogIsNo(val){
            switch (val) {
                case 'list':
                    this.chooseBools = val;
                    break;
                case 2:
                    this.$refs.multipleTable.clearSelection();
                    break;                              
                default:
                    break;
            }
        },
        //确认选择
        courselistIsOkOrNo(){  
            if(this.multipleSelection.length>0){
                this.ruleForm.posterUrl =  this.multipleSelection[0].backgroundUrl;
                this.ruleForm.imageName =  this.multipleSelection[0].name;
                this.courseIdBool = false;
            }else{
                this.ruleForm.posterUrl =  '';
                this.ruleForm.imageName =  '';                
            }
            this.centerDialogList = false;
        },
        handleSelectionChange(val){
                this.multipleSelection = val;
        },
        selectable(row, index){
            if(this.multipleSelection.length <1){
                    return true;
            }
        },
        submitForm(formName,starts){
            var self = this;
            if(self.ruleForm.imageName==''||self.ruleForm.posterUrl==''){
                self.courseIdBool = true;
                return;
            }else{
                self.courseIdBool = false;
            }
            self.$refs[formName].validate((valid) => {
            if (valid) { 
                        console.log("表单提交成功");
                        self.formSubmitToStory(starts);
                    }else{
                        console.log("表单提交失败");
                    } 
                });            
        },
        formSubmitToStory(starts){
            var self = this;
            var parmise = {
                name:self.ruleForm.name,
                description:self.ruleForm.description,
                posterUrl:self.ruleForm.posterUrl,
                buyUrl:self.ruleForm.buyUrl,
                content:self.ruleForm.content,
                imageName:self.ruleForm.imageName
            };
            if(this.assembleStyle=='update'){
                self.$http.post(self.$server.h5PoetryGetUpdate({id:self.updataSubjectId}),parmise).then(res=>{
                if(res.status==200){
                        this.getPoetryTableList(self.pageAtion.paginationPage);
                        self.chooseBools = starts;
                    }
                })
            }else{
                self.$http.post(self.$server.h5PoetryAdd,parmise).then(res=>{
                if(res.status==200){
                        this.getPoetryTableList(1);
                        self.chooseBools = starts;
                        // self.centerDialogUpdate = false;
                    }
                })                
            }
        },
        courseChooseEven(){
            this.getPoetryList(1);
            this.centerDialogList = true;
        },
        getPoetryList(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loadingTwo = true;
            var params = {
                pageNo:self.pageNo,
                pageSize:self.pageSize,
                name:self.inputCourseTwo
            };
            self.$http.get(self.$server.h5PoetryGetPosterUrl(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                return element;
                            });                            
                        }                    
                   }; 
                    self.tableDataList = listIds;
                    self.pageAtionSecond.pageTotal = contentdate.total;
                    self.pageAtionSecond.paginationPage = num;
                    self.loadingTwo = false;
               }
            })
            .catch(res => {
                    self.loadingTwo = false;
            });                        
        },
        // courseSeach(){
        //     this.getPoetryList(1)
        // },
        addOrReturnSubjectEven(data,starts,addOrUpdate){
            this.assembleStyle = addOrUpdate;
            this.chooseBools = starts;
            if(addOrUpdate=='update'){
                this.updataSubjectId = data.id;
                this.ruleForm={
                    name:data.name,
                    description:data.description,
                    content:data.content,
                    imageName:data.imageName,
                    posterUrl:data.posterUrl,
                    buyUrl:data.buyUrl
                }                
            }else{
                this.ruleForm={
                    name:'',
                    description:'',
                    poetrycontentContent:'',
                    imageName:'',
                    posterUrl:'',
                    buyUrl:''
                }
            }
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getPoetryTableList(Number(num))
            }
        },   
        childPageValueSecond(num){
            if(Number(num)>0){
                this.getPoetryList(Number(num))
            }
        }    
    },
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }
.formUpdateCss{
    border: 1px solid #ccc;
}
.has-gutter th.el-table-column--selection .cell{
    display: none;
}
</style>


