<template>
    <div class="page-wrap classify-wrap">
        <div class="page-header">
            <el-row>
                <el-col :span="20" class="lLeft-r lMarginBO30">
                    <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                </el-col>                
                <el-col :span="4" class="lRight-r">
                    <el-button v-if="$authJudge('classify:classify:add')" class="redBackColor butColorF"  @click="addCLassifyString()">添加</el-button>                
                </el-col>
            </el-row>
            <el-row :gutter="20" class="lLine40">
                <el-col :span="7">
                    <div class="iSeachEven">
                        <el-input v-model.trim="titleName"
                            placeholder="输入分类名称"
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
                            <el-select v-model="classStatus"
                                    clearable
                                    placeholder="类型">
                                <el-option v-for="(item,i) in courseClassList"
                                        :key="i"
                                        :label="item.name"
                                        :value="item.value"></el-option>
                            </el-select>                                    
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4"><el-button v-if="$authJudge('classify:classify:select')" type="primary"  @click="searchMemberCard()">查询</el-button></el-col>
            </el-row>     
        </div>
        <div class="page-content">
            <el-table :data="pageData.items"
                      header-cell-class-name="list-header-layout-bg"
                      v-loading="loading"
                      border
                      style="width: 100%">
                <el-table-column prop="sortId"
                                 label="序号"
                                 align="center"
                                 width="157">
                </el-table-column>
                <el-table-column prop="name"
                                 class-name="classify-name"
                                 align="center"
                                 label="分类名称"
                                 min-width="100"
                                 show-overflow-tooltip>
                </el-table-column>                
                <el-table-column
                    prop="nametwos"
                    label="二级分类名称"
                    align="center"
                    min-width="300"
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
                    class-name="classify-name"
                    align="center"
                    label="排序序号"
                    min-width="100"
                    show-overflow-tooltip>
                        <template slot-scope="scope">
                            <P>{{scope.row.sort?scope.row.sort:''}}</P>
                        </template>                                 
                </el-table-column>                            
                <el-table-column label="操作"
                                 align="center"
                                 width="200">
                    <template slot-scope="scope">
                        <el-button type="text"
                        class="editor-btn"
                                   @click="sortClassType(scope.row)" v-if="$authJudge('classify:classify:sort')">排序</el-button>                        
                        <el-button type="text"
                        class="editor-btn"
                                   @click="handleClassify(scope.row)" v-if="$authJudge('classify:classify:edit')">编辑</el-button>
                        <el-button type="text"
                        class="editor-btn"
                                   @click="twioClasslyEven(scope.row)" v-if="$authJudge('classify:classify:findtwo')">二级分类</el-button>   
                        <el-button type="text"
                        class="editor-btn"
                                   @click="removeClassType(scope.row)" v-if="$authJudge('classify:classify:del')">删除</el-button>                                                                   
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="editorInfo&&editorInfo['id']?'编辑':'添加'"
                   custom-class="common-dialog-header-bg"
                   :visible.sync="dialogFormVisible"
                   width="660px"
                   :show-close="true">
            <handleDialog v-if="dialogFormVisible"
                          @refreshList="onRefresList"
                          :editorInfo="editorInfo" />
        </el-dialog>
        <el-dialog
            title="选择分类类型"
            :visible.sync="classTypeDetail"
            width="20%"
            class="lCenter-r">
                <el-button type="primary" @click="classTypeDetailEven(1)">成人分类</el-button>
                <el-button type="primary" @click="classTypeDetailEven(2)">少儿分类</el-button>
        </el-dialog>      
        <el-dialog
            title=""
            :visible.sync="addClassTypeDetail"
            :close-on-click-modal="false"
            width="20%">
            <el-form :model="addForm"
                     :rules="addFormRules"
                     ref="addForm">
                <el-form-item prop="name">
                    <el-row >
                            <el-col :span="18">
                                <el-input v-model.trim="addForm.name"
                                        placeholder="输入分类名称"
                                        class="search-form"
                                        maxlength="4"
                                        style="width:80%;"
                                        @keydown.13.native="addCLassify"></el-input>
                                        <span>{{addForm.name.length}}/4</span>
                            </el-col>
                            <el-col :span="5" :offset="1">
                                <el-button
                                    class="red-btn fr redBackColor butColorF"
                                    @click="addCLassify"
                                    :loading="btnLoading">添加</el-button>                                        
                            </el-col>
                    </el-row>
                </el-form-item>
            </el-form>            
        </el-dialog> 
        <el-dialog
            title=""
            :visible.sync="removeClassTypeDetail"
            :close-on-click-modal="false"
            style="text-align: center;"
            width="20%">      
                <p style="margin-bottom:20px;">确定删除当前分类吗?</p>
                <el-button
                    class="redBackColor butColorF"
                    @click="isOkRemoveClass"
                    :loading="btnLoading">确定</el-button>
                <el-button
                    class="butColorF butColor6"
                    @click="removeClassTypeDetail=false"
                    :loading="btnLoading">取消</el-button>                                                
        </el-dialog>   
        <el-dialog
            title=""
            :visible.sync="sortClassTypeDetail"
            :close-on-click-modal="false"
            style="text-align: center;"
            width="20%">      
                <div class="layout-row-start" style="margin-bottom:20px;">
                    <div>移动到第</div>
                    <el-input style="width:100px;margin:0 5px;" v-model="inputSort"></el-input>
                    <div>位</div>
                </div>
                <el-button
                    class="redBackColor butColorF"
                    @click="isOkSortClass"
                    :loading="btnLoading">确定</el-button>
                <el-button
                    class="butColorF butColor6"
                    @click="sortClassTypeDetail=false"
                    :loading="btnLoading">取消</el-button>                                                
        </el-dialog>               
        <pagination :totalNum="pageData.totalNum"
                    :currentPage="pageData.currentPage"
                    class="paging" />
    </div>
</template>

<script>
import handleDialog from "./components/handleDialog";
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        var checkAge = (rule, value, callback) => {
            switch (rule.fullField) {  
                case "name":
                    if (value === "") {
                        callback(new Error("请输入分类名称"));
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
                    { required: true, message: '请输入分类名称', trigger: 'change' },
                    { validator: checkAge,trigger: 'blur' }
                ]                
            },
            dialogFormVisible: false,
            classTypeDetail:false,
            addClassTypeDetail:false,
            removeClassTypeDetail:false,
            sortClassTypeDetail:false,
            pageData: {},
            page:1,
            pageSize:10,
            editorInfo: null,
            loading: false,
            btnLoading: false,
            power:[],
            courseClassList:[
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
            titleList:[                
                {
                    name:'分类管理',
                    pathInfo:''
                },
                {
                    name:'添加分类',
                    pathInfo:''
                } 
            ],            
            classStatus:-1,
            titleName:'',
            myType:0,
            inputSort:'',
            selectData:'',
            disabledState:false
        };
    },
    metaInfo: {
        title: "分类管理"
    },
    components: {
        handleDialog,
        pagination,
        breadcrumb
    },
    watch: {
        $route() {
            this.init();
        }
    },
    created() {
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }        
        this.power = flag;        
        this.init();
    },
    methods: {
        sortClassType(data){
            this.sortClassTypeDetail = true;
            this.selectData = data;
        },
        removeClassType(data){
            this.removeClassTypeDetail = true;
            this.selectData = data;
        },
        //确定排序
        isOkSortClass(){
            var that = this;
            if(this.inputSort==''){
                that.$message.error("请填写排序号");
                return;
            }
            if(this.inputSort==0){
                that.$message.error("序号不能为0");
                return;
            }            
            let query = {
                id:this.selectData.id,
                sort:this.inputSort
            }  
            that.$http.post(that.$server.setCategorySort,query).then(res=>{
                if(res.status==200){
                    this.sortClassTypeDetail = false;
                    this.inputSort = '';
                    that.$message.success("排序成功");
                    that.init();
                }
            })  
        },
        //确定删除
        isOkRemoveClass(){
            var that = this;
            let query = {
                id:this.selectData.id
            }  
            that.$http.post(that.$server.setDelCategoryOne,query).then(res=>{
                if(res.status==200){
                    that.removeClassTypeDetail = false;
                    that.$message.success("删除成功");
                    that.init();
                }
            })        
        },
        //添加分类
        addCLassifyString(){
            this.classTypeDetail = true;
            this.addClassTypeDetail = false;
        },
        searchMemberCard(){
             this.init();
        },
        classTypeDetailEven(num){
            this.classTypeDetail = false;
            this.addClassTypeDetail = true;
            this.myType = num;
        },
        onRefresList(currPage) {
            if (currPage === "currPage") {
                if (JSON.stringify(this.$route.query) === "{}") {
                    this.init();
                } else {
                    this.$router.push("/classifyAdd");
                }
            } else {
                this.init();
            }
            this.dialogFormVisible = false;
        },
        init() {
            let query = JSON.parse(JSON.stringify(this.$route.query));
            var paramsObj = {
                page:Number(query.page)>0?Number(query.page):this.page,
                pageSize:this.pageSize,
                name:this.titleName,
                mtype:this.classStatus
            };
            this.name = query.name || "";
            this.loading = true;
            this.$http
                .get(this.$server.categoryIndex(paramsObj))
                .then(res => {
                        var contentdate = res.content;
                        var listIds = [];
                            listIds = contentdate.items.map(function(element,index){
                                if(contentdate.currentPage==1){
                                    element.sortId = index+1;
                                    return element;
                                }else if(contentdate.currentPage>1){
                                    element.sortId = (contentdate.currentPage-1)*10+index+1;
                                    return element;
                                }
                            }); 
                        res.content.items = listIds                    
                        this.pageData = res.content;
                        this.loading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                });
        },
        addCLassify() {
            this.$refs["addForm"].validate(valid => {
                if (valid) {
                    this.btnLoading = true;
                    if(!this.disabledState){
                        this.disabledState = !this.disabledState;
                        this.$http
                            .post(this.$server.getCategory, {
                                name: this.addForm.name,
                                mtype:this.myType
                            })
                            .then(res => {
                                if (res.status === 200) {
                                    this.$message({
                                        message: "添加分类成功",
                                        type: "success"
                                    });
                                    this.onRefresList("currPage");
                                    this.classTypeDetail = false;
                                    this.addClassTypeDetail = false;                                
                                } else {
                                    this.$message.error(res.message);
                                }
                                this.btnLoading = false;
                                this.addForm.name = "";
                                this.disabledState = !this.disabledState;
                                this.myType = '';
                            })
                            .catch(err => {
                                this.disabledState = !this.disabledState;
                                this.btnLoading = false;
                            });
                    }

                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        handleClassify(item) {
            if (item) {
                this.editorInfo = item;
            } else {
                this.editorInfo = null;
            }
            this.dialogFormVisible = true;
        },
        twioClasslyEven(item){
            this.$router.push(`/classifiyTwoPage/${item.id}?name=${item.name}`);
        },
        removeClassify(item){

        }
    }
};
</script>

<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.red-btn {
    width: 100%;
}
.page-header {
    background: #fff;
    padding: 30px 30px 38px 20px;
    margin-bottom: 26px;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    .page-title {
        font-size: 18px;
        color: rgba(56, 65, 86, 1);
        margin-bottom: 20px;
    }
    // .wd-text-length {
    //     margin-right: 20px;
    //     font-size: 14px;
    //     font-weight: 400;
    //     color: rgba(102, 102, 102, 1);
    //     &.error {
    //         color: rgb(180, 39, 45);
    //     }
    // }
}
.search-form {
    width: 100%;
    margin-right: 10px;
    position: relative;
}
.page-content {
    background: #fff;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    .editor-btn {
        color:#9E0E00;
        font-size: 14px;
        padding: 0;
        height: 36px;
        line-height: 36px;
    }
}
.paging {
    margin: 60px 0;
}
</style>
<style lang="scss">
.classify-wrap  {
    // .classify-name {
    //     padding-left:56px;
    // }
    .el-table th.list-header-layout-bg {
        height: 60px;
    }
}
</style>
