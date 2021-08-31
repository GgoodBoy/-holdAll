<template>
    <div class="classify-wrap">
        <div class="page-header lMarginBO30">
            <!-- <span class="page-title">添加标签</span> -->
            <!-- <span class="lMarginL20 grayColor">删除标签课程和首页导航中涉及的标签一起删除</span> -->
        </div>
        <!-- <el-row :gutter="20">
            <el-col :span="2" class="lLine40 lCenter-r lSize16">添加标签:</el-col>
            <el-col :span="6">
                    <el-input v-model.trim="title"
                            placeholder="添加标签"
                            class="search-form"
                            maxlength="4"
                            style="width:80%"
                            ></el-input>
                            <span>{{title.length||0}}/4</span>
            </el-col>                     
            <el-col :span="2"><el-button class="redBackColor butColorF" @click="addlabelEven">添加</el-button></el-col>
        </el-row>  -->
            <el-row>
                <el-col :span="4">
                     <h3 class="page-title">添加标签</h3>
                </el-col>
                <el-col :span="4" :offset="16" class="lRight-r" v-if="$authJudge('label:label:add')">
                    <el-button class="redBackColor butColorF"  @click="addLabelString()">添加</el-button>                
                </el-col>
            </el-row>
            <el-row :gutter="20" class="lLine40">
                <el-col :span="7">
                    <div class="iSeachEven">
                        <el-input v-model.trim="titleName"
                            placeholder="输入标签名称"
                            class="search-form"
                            width="100%"
                            maxlength="16"
                            ></el-input>
                    </div>
                </el-col>                     
                <el-col :span="4">
                    <el-row>
                        <el-col :span="8" class="lCenter-r">类型</el-col>
                        <el-col :span="16">
                            <el-select v-model="labelStatus"
                                    clearable
                                    placeholder="类型">
                                <el-option v-for="(item,i) in courseLabelList"
                                        :key="i"
                                        :label="item.name"
                                        :value="item.value"></el-option>
                            </el-select>                                    
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4"><el-button v-if="$authJudge('label:label:select')" type="primary"  @click="searchMemberCard()">查询</el-button></el-col>
            </el-row>         
        <el-row class="lMarginTop20">
            <el-col>
                <el-table
                border
                :data="tableData"
                v-loading="loadingOne"
                style="width: 100%">
                <el-table-column
                    prop="sortId"
                    label="序号"
                    align="center"
                    min-width="60"
                    :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="标签名称"
                    min-width="300"
                    align="center"
                    show-overflow-tooltip>
                </el-table-column> 
                <el-table-column 
                                 align="center"
                                 label="类型"
                                 min-width="80">
                                <template slot-scope="scope">
                                    <P>{{scope.row.mtype==1?'成人':'少儿'}}</P>
                                </template>                                 
                </el-table-column>                                                
                <el-table-column
                    fixed="right"
                    label="操作"
                    align="center"
                    min-width="100">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="$authJudge('label:label:edit')" class="black-btn" @click="channeUpdateEven(scope.row)">编辑</el-button>
                            <!-- <el-row>  
                                <el-col :span="12"  class="lCenter-r">
                                    
                                </el-col>       
                                <el-col :span="12" class="lCenter-r">
                                    <el-button type="text" class="black-btn" @click="deletePosterEven(scope.row)">删除</el-button>
                                </el-col>                                                                                                                         
                            </el-row>                                                       -->
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
        </el-row> 
        <el-dialog
        :visible.sync="updateDialogLable"
        title=""
        max-height="300"
        width="25%">
            <el-row>
                <el-col :span="10" :offset="4" class="lCenter-r">
                    <el-input v-model.trim="updateTitle"
                            placeholder="请输入标签"
                            class="search-form"
                            style="width:80%"
                            maxlength="4"
                            ></el-input>    
                            <span>{{updateTitle.length||0}}/4</span>                
                </el-col>
                <el-col :span="6" class="lCenter-r">
                    <el-button class="redBackColor butColorF" @click="dialogIsOk(2)">确定</el-button>
                </el-col>
            </el-row>
        </el-dialog>        
        <el-dialog
        :visible.sync="removeDialogLable"
        title=""
        max-height="300"
        width="25%">
            <el-row>
                <el-col class="lCenter-r">确定要删除这个标签吗？</el-col>
                <el-col class="lCenter-r lMarginTop20">
                     <el-button  @click="dialogIsNo(1)">取消</el-button>
                     <el-button class="redBackColor butColorF" @click="dialogIsOk(1)">确定</el-button>
                </el-col>
            </el-row>
        </el-dialog>   
        <el-dialog
            title="选择标签类型"
            :visible.sync="labelTypeDetail"
            width="20%"
            class="lCenter-r">
                <el-button type="primary" @click="labelTypeDetailEven(1)">成人标签</el-button>
                <el-button type="primary" @click="labelTypeDetailEven(2)">少儿标签</el-button>
        </el-dialog>      
        <el-dialog
            title=""
            :visible.sync="addLabelTypeDetail"
            :close-on-click-modal="false"
            width="20%">
            <el-form :model="addForm"
                     :rules="addFormRules"
                     ref="addForm">
                <el-form-item prop="name">
                    <el-row >
                            <el-col :span="18">
                                <el-input v-model.trim="addForm.name"
                                        placeholder="输入标签名称"
                                        class="search-form"
                                        maxlength="4"
                                        style="width:80%"
                                        @keydown.13.native="addLabel"></el-input>
                                        <span>{{addForm.name.length}}/4</span>
                            </el-col>
                            <el-col :span="5" :offset="1">
                                <el-button
                                    v-if="$authJudge('label:label:add')"
                                    class="red-btn fr redBackColor butColorF"
                                    @click="addlabelEven"
                                    :loading="btnLoading">添加</el-button>                                        
                            </el-col>
                    </el-row>
                </el-form-item>
            </el-form>            
        </el-dialog>                    
    </div>
</template>

<script>
import pagination from "@/components/pagination";
export default {
    data() {
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {  
                case "name":
                    if (value === "") {
                        callback(new Error("请输入标签名称"));
                    }  else if (value&&value.lenght>4){
                        callback(new Error("长度在 1 到 4 个长度"))
                    }else if(! /^[\u4e00-\u9fa5]+$/.test(value)){
                        callback(new Error("请输入汉字"))
                    }else{
                        callback(); 
                    }
                break;                                                              
            }
        };         
        return {
            addForm: {
                name: ""
            },        
            addFormRules: {
                name: [
                    { required: true, message: '请输入标签名称', trigger: 'change' },
                    { validator: checkAge,trigger: 'blur' }
                ]                
            },            
            title:'',
            updateTitle:'',
            tableData:[],
            loadingOne:false,
            pageNo:1,
            pageSize:10, 
            removeDialogLable:false,
            updateDialogLable:false,
            labelTypeDetail:false,
            addLabelTypeDetail:false,
            selectId:'',
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            courseLabelList:[
                {
                    name:'全部',
                    value:-1
                },                
                {
                    name:'成人',
                    value:1
                },
                {
                    name:'少儿',
                    value:2
                }                
            ],
            labelStatus:-1,
            titleName:'',
            myType:0,
            btnLoading: false,     
            disabledState:false      
        };
    },
    metaInfo: {
        title: "添加标签"
    },
    components: {
        pagination
    },
    created() {
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }        
        this.power = flag; 
        this.getLabelList(1);
    },
    methods: {
        labelTypeDetailEven(num){
            this.labelTypeDetail = false;
            this.addLabelTypeDetail = true;            
            this.myType = num;
        },
        addLabelString(){
            this.labelTypeDetail = true;
            this.addLabelTypeDetail = false;            
        },
        searchMemberCard(){
            this.getLabelList(1);
        },
        channeUpdateEven(data){
            this.selectId = '';
            this.updateTitle = data.name;
            this.selectId = data.id;
            this.updateDialogLable = true;
        },
        deletePosterEven(data){
            this.selectId = '';
            this.selectId = data.id;
            this.removeDialogLable = true;
        },
        dialogIsNo(num){
            switch (num) {
                case 1:
                    this.removeDialogLable = false;
                    break;           
                default:
                    break;
            }            
        },
        dialogIsOk(num){
            switch (num) {
                case 1:
                    this.deleteLabelEven();
                    break;
                case 2:
                    this.updateLabelIsOk();
                    break;            
                default:
                    break;
            }
        },
        deleteLabelEven(){
            var self = this;
            self.loading = true; 
            var parems = {
                id:self.selectId
            }
            this.$http.delete(this.$server.deleteLabel(parems)).then(res=>{
               if(res.status==200){
                    self.getLabelList(1);
                    self.removeDialogLable = false;
               }
            })             
        },
        updateLabelIsOk(){
            var self = this;
            self.loading = true; 
            if(this.updateTitle==''){
                this.$message.error('请输入标签名称');
                return false;
            }
            if(this.updateTitle.length>4){
                this.$message.error('长度在 1 到 4 个长度');
                return false;
            }
            if(! /^[\u4e00-\u9fa5]+$/.test(this.updateTitle)){
                this.$message.error('请输入汉字');
                return false;
            }
            var parems = {
                name:self.updateTitle,
                id:self.selectId
            }
            if(!self.disabledState){
                self.disabledState = !self.disabledState;           
                this.$http.post(self.$server.updatelabel,parems).then(res=>{
                    if(res.status==200){
                            self.getLabelList(self.pageNo);
                             self.disabledState = !self.disabledState;
                            self.updateDialogLable = false;
                    }
                }).catch(()=>{
                                self.disabledState = !self.disabledState;
                            })                
            }
            
        },
        addlabelEven(){
            var self = this;
            self.loading = true; 
            var parems = {
                name:this.addForm.name,
                mtype:self.myType
            };
            self.$refs["addForm"].validate(valid => {
                if (valid) {
                    self.btnLoading = true;
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;
                            self.$http
                            .post(this.$server.addLabel,parems)
                            .then(res => {
                                if (res.status === 200) {
                                    self.$message({
                                        message: "添加标签成功",
                                        type: "success"
                                    });
                                    // self.onRefresList("currPage");
                                    self.labelTypeDetail = false;
                                    self.addLabelTypeDetail = false;     
                                    self.getLabelList(1);                           
                                } else {
                                    self.$message.error(res.message);
                                }
                                self.btnLoading = false;
                                self.addForm.name = "";
                                self.labelStatus =-1;
                                self.disabledState = !self.disabledState;
                            })
                            .catch(err => {
                                self.disabledState = !self.disabledState;
                                self.btnLoading = false;
                                console.log(err);
                            });
                        }                    
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        getLabelList(num){ //&name=&mtype=
            var self = this;
            self.loadingOne = true; 
            self.pageNo = num;
            var parems = {
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                name:this.titleName,
                mtype:this.labelStatus
            }
            this.$http.get(this.$server.getAjaxLabelnList(parems)).then(res=>{
               if(res.status==200){
                   var contentdate = res.content;
                   var listIds = [];
                    listIds = contentdate.list.map(function(element,index){
                        if(contentdate.pageNum==1){
                            element.sortId = index+1;
                            return element;
                        }else if(contentdate.pageNum>1){
                            element.sortId = (contentdate.pageNum-1)*10+index+1;
                            return element;
                        }
                    });                    
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage =self.pageNo;
                    self.$nextTick(function(){
                        self.loadingOne = false; 
                    }) 
               }
            }).catch(function(error) {
                    self.loadingOne = false; 
            });            
        },        
        childPageValue(num){
            if(Number(num)>0){
                this.getLabelList(Number(num))
            }
        }        
    }
};
</script>

<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.page-title {
    font-size: 18px;
    color: rgba(56, 65, 86, 1);
    margin-bottom: 20px;
}
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }
</style>
