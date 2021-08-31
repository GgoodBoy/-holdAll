<template>
    <div class="page-wrap auth-manage-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                    <!-- <h3 class="page-title">权限管理</h3> -->
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="6">
                    <div class="keyword">
                    <el-input v-model="name"
                        placeholder="请输入权限名称查询"
                        maxlength="20"
                        clearable
                        ></el-input>
                    </div>
                </el-col>                     
                <el-col v-if="$authJudge('admin:authority:select')" :span="2" :offset="1"><el-button type="primary" @click="search">查询</el-button></el-col>
                <el-col style="text-align: right;" :span="15">
                    <el-button v-if="$authJudge('admin:authority:add')" type="primary" @click="addAuth">添加权限</el-button>
                </el-col>
            </el-row>     
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="order"
                        label="序号"
                        align="center"
                        width="100"
                        :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        label="权限名称"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="code"
                        label="code"
                        align="center"
                        :show-overflow-tooltip="true">
                    </el-table-column>     
                    <el-table-column
                        prop="parentName"
                        label="父级"
                        align="center"
                        >
                    </el-table-column>                               
                    <!-- <el-table-column
                        label="操作"
                        align="center"
                        min-width="120">
                            <template slot-scope="scope"> 
                                <el-button size="small" @click="edit(scope.row)">编辑</el-button>                                            
                            </template>                    
                    </el-table-column>                                                 -->
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :current-page.sync="pageNo"
                        :page-size="pageSize"
                        :total="total"
                    >
                    </el-pagination>
                </div>             
            </div>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            width="500px"
            top="15%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            center>
            <div class="form">
                <div class="item">
                    <label>权限名称:</label>
                    <div class="data-box">
                        <el-input v-model="title" maxlength="20"></el-input>
                    </div>
                    <p>{{title.length}}/20</p>
                </div>
                <div class="item" v-if="id==''">
                   <label>CodeID:</label>
                   <div class="data-box">
                       <el-input v-model="code" maxlength="32"></el-input>
                   </div>
                   <p>{{code.length}}/32</p>
               </div>
               <div class="item" v-if="id==''">
                   <label>父级:</label>
                   <div class="data-box">
                        <el-cascader
                            v-model="parent"
                            :options="options"
                            :props="{ checkStrictly: true }"
                            clearable
                            @change="handleChange"
                            >
                        </el-cascader>
                        <!-- <el-select v-model="parent" placeholder="请选择">
                            <el-option
                            v-for="item in parentArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select> -->
                   </div>
               </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">保 存</el-button>
            </div>
            </el-dialog>
    </div>
</template>
<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
const regExp = {
    'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
    'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
    'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g, //特殊字符(除了数字、字母、汉字) 
    'onlyNumber':/^\d+$/
}
export default {
    data() {
        return {
            name:'',
            pageNo:1,
            pageSize:10,
            total:1,
            tableData:[],
            loading:false,
            title:'',
            code:'',
            parent:[],
            id:'',
            dialogVisible:false,
            options:[],
            titleList:[
                {
                    name:'APP管理系统',
                    pathInfo:''
                },
                {
                    name:'权限管理',
                    pathInfo:''
                }                                               
            ],
            disabledState:false,
        }
    },
    metaInfo: {
        title: "权限管理"
    },
    components: {
        pagination,
        breadcrumb
    },
    watch: {
        pageNo(cur,old){
            if(cur>=1){
                this.getList()
            }
        },
        dialogVisible(cur,old){
            if(!cur){
                this.title = ''
                this.code = ''
                this.parent = []
            }
        }
    },
    created() {
        this.getList()
        this.getAllAuth()
    },
    methods:{
        getList(){
            this.loading = true;
            let query = {
                params:{
                    name:this.name,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.getAuthList,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    this.total = res.content.total;
                    this.tableData = res.content.list;
                    this.tableData.forEach((item,index)=>{
                        item.order = (this.pageNo-1)*this.pageSize+index+1;
                    })
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        getAllAuth(){
            let query = {
                params:{}
            }
            this.$http.get(this.$server.getAllAuth,query).then(res=>{
                if(res.status==200){
                    this.options = this.getAuthMenu(res.content)
                }
            })
        },
        /**
         * 获取权限
         */
        getAuthMenu(data){
            if(typeof data == 'object' && Array.isArray(data)){
                data.forEach(item=>{
                    item.label = item.title;
                    item.value = item.id;
                    if(item.childrenList.length>0){
                        item.children = this.getAuthMenu(item.childrenList)
                    }
                })
                return data;
            }
        },
        search(){
            this.pageNo = 0;
            this.$nextTick(()=>{
                this.pageNo = 1;
            })
        },
        handleChange(val){
            console.log(val)
        },
        addAuth(){
            this.id = ''
            this.dialogVisible = true;
        },
        save(){
            var self = this;
            let only = /^[A-Za-z\:]+$/
            if(this.title==''){
                this.$message.error('请输入名称');
                return;
            }
            if(!regExp.exceptSpecialChar.test(this.title)){
                this.$message.error('只能输入汉字、字母、数字');
                return;
            }
            if(this.code==''){
                this.$message.error('请输入code');
                return;
            }
            if(!only.test(this.code)){
                this.$message.error('只能输入英文字母或者字母+冒号的组合');
                return;
            }
            if(this.parent==''){
                this.$message.error('请选择父级');
                return;
            }
            let query = {
                name:this.title,
                code:this.code,
                parentId:Number(this.parent.splice(this.parent.length-1,this.parent.length).join(''))
            }
            let loadingInstance = this.$loading({
                target:document.querySelector('.auth-manage-wrap')
            });
            if(!self.disabledState){
                self.disabledState = !self.disabledState;
                this.$http.post(self.$server.addAuth,query).then(res=>{
                    loadingInstance.close()
                    if(res.status==200){
                        this.$message.success('添加成功');
                        this.dialogVisible = false;
                        self.disabledState = !self.disabledState;
                        console.log('disabledState成功变为false',self.disabledState);
                        this.pageNo = 0;
                        this.$nextTick(()=>{
                            this.pageNo = 1;
                            this.getAllAuth()
                        })
                    }
                }).catch(()=>{
                    self.disabledState = !self.disabledState;
                    loadingInstance.close()
                })
            }

        },
        edit(obj){
            this.id = obj.id;
            this.dialogVisible = true;
        }
    }
}
</script>
<style lang="scss" scoped>
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
        .block{
            text-align: center;
            margin-top:60px;
            padding-bottom:60px;
        }
    }
    .form{
        .item{
            margin:20px 0;
            position: relative;
            label,.data-box{
                display: inline-block;
                vertical-align: middle;
            }
            label{
                width: 60px;
                text-align: right;
                margin-right: 10px;
            }
            .data-box{
                width: 340px;
                .el-select,.el-cascader{
                    width: 340px;
                }
            }
            p{
                position: absolute;
                right: 0;
                top:12px;
            }
        }
    }
</style>