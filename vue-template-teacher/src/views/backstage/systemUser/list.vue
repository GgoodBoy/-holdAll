<template>
    <div class="page-wrap system-user-page">
        <div class="page-head">
            <section class="page-title clearfix">
                <!-- <h2 class="fl">创建后台账户</h2> -->
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
            </section>
            <section>
                <el-row class="filtrate-wrap search-area">
                    <el-col class="filtrate-input" :span="10">
                        <el-input v-model.trim="searchData.username"
                                clearable
                                  placeholder="输入用户名查询" @keyup.13.native="search" >
                            <!-- <i slot="suffix" class="el-icon-search" @click="search"></i> -->
                        </el-input>
                    </el-col>
                    <el-col :span="2" v-if="$authJudge('admin:account:select')"><el-button type="primary"  @click="search">查询</el-button></el-col>
                    <el-col class="filtrate-execute" v-if="$authJudge('admin:account:add')">
                        <el-button type="primary"
                                   class="red-btn" @click="createFlag=true">创建用户</el-button>
                    </el-col>
                </el-row>
            </section>
        </div>
        <div class="page-content">
            <el-table :data="tableData"
                      border
                      v-loading="loading"
                      header-cell-class-name="list-header-layout-bg"
                      style="width: 100%">
                <el-table-column prop="sortId"
                                 label="序号"
                                 align="center"
                                            >
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="用户名"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="department"
                    align="center"
                    label="部门">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    prop="lastLoginAt"
                    align="center"
                    label="最后登录">
                </el-table-column>
                <el-table-column align="center">
                    <template slot-scope="scope">
                        <div class="handle-area">
                            <p v-if="$authJudge('admin:account:assign')" @click="allotRole(scope.row,allotRole)">分配角色</p>
                            <p v-if="$authJudge('admin:account:reset')" @click="resetPwd(scope.row)">重置密码</p>
                            <p v-if="$authJudge('admin:account:forbidden')" v-show="scope.row.enabled==1" @click="diyEnable(scope.row)">禁用</p>
                            <p v-if="$authJudge('admin:account:open')" v-show="scope.row.enabled!=1" @click="diyEnable(scope.row)">启用</p>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :totalNum="pageData.totalNum"
                    :currentPage="pageData.pageNo"
                    class="paging"></pagination>
        <my-dialog :showFlag.sync="createFlag" :title="'创建用户'" :cancelName="'cancelCreate'" v-on:cancelCreate="cancelCreate" :sureName="'sureCreate'" v-on:sureCreate="sureCreate">
            <div slot="dialog-body">
                <div class="my-form-warp">
                    <el-form ref="addForm" :model="addUserForm" :rules="addRules" label-width="80px">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="addUserForm.username" maxlength="20" placeholder="只支持英文字符">
                                <span slot="suffix" class="text-word">{{addUserForm.username.length}}/20</span>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="addUserForm.name" maxlength="10">
                                <span slot="suffix" class="text-word">{{addUserForm.name.length}}/10</span>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="部门" prop="depart">
                            <el-input v-model="addUserForm.depart" maxlength="10">
                                <span slot="suffix" class="text-word">{{addUserForm.depart.length}}/10</span>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="角色" prop="role">
                            <el-select v-model="addUserForm.role" placeholder="角色">
                                <el-option
                                    v-for="item in roleArr"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="密码" prop="pwd">
                            <el-input type="password" v-model="addUserForm.pwd" maxlength="10" placeholder="数字字母组合7位以上" class="my-pwd">
                                <span slot="suffix" class="text-word">{{addUserForm.pwd.length}}/10</span>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </my-dialog>
        <my-dialog :showFlag.sync="updateFlag" :title="'重置密码'" :cancelName="'cancelUpdate'" v-on:cancelUpdate="cancelUpdate" :sureName="'sureUpdate'" v-on:sureUpdate="sureUpdate">
            <div slot="dialog-body">
                <el-form ref="updateForm" :model="updateUserForm" class="update-form" :rules="updateRules" label-width="48px">
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="updateUserForm.password" maxlength="10" placeholder="数字字母组合7位以上" class="my-pwd">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </my-dialog>
        <my-dialog :showFlag.sync="forbbidenFlag" :title="'温馨提示'" :cancelName="'cancelForbbiden'" v-on:cancelForbbiden="cancelForbbiden" :sureName="'sureForbbiden'" v-on:sureForbbiden="sureForbbiden">
            <div slot="dialog-body">
                <div style="text-align: center">
                    <p>{{desc}}</p>
                </div>
            </div>
        </my-dialog>
        <my-dialog :showFlag.sync="allotFlag" :title="'分配角色'" :cancelName="'cancelAllot'" v-on:cancelAllot="cancelAllot" :sureName="'sureAllot'" v-on:sureAllot="sureAllot">
            <div slot="dialog-body">
                <div class="my-form-warp">
                    <el-form ref="allotForm" :model="allotUserForm" :rules="allotRules" label-width="80px">
                        <el-form-item label="角色" prop="role">
                            <el-select v-model="allotUserForm.role" placeholder="角色">
                                <el-option
                                    v-for="item in roleArr"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </my-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
    import myDialog from '@/components/myDialog/myDialog.vue'
    import pagination from "@/components/pagination";
    import {getPermissions} from '@/utils/auth';
    import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
    export default{
        data(){
            let checkUserName=(rule,value,callback)=>{
                let regExp = /^[A-Za-z]+$/
                if(value==''){
                    callback(new Error('请输入用户名'))
                }else{
                    if(!regExp.test(value)){
                        callback(new Error('用户名只能为英文字符'))
                    }else if(value.length<3){
                        callback(new Error('用户名最短3个字符'))
                    }else{
                         callback()
                    }
                }
            }
            let checkPwd = (rule,value,callback)=>{
                let regExp = /^[0-9a-zA-Z_]{7,}$/
                if(value==''){
                    callback(new Error('请输入密码'))
                }else{
                    if(!regExp.test(value)){
                        callback(new Error('密码为至少7位数字字母组合'))
                    }else{
                        callback()
                    }
                }
            }
            return{
                searchData:{
                    username:''
                },
                tableData:[],
                pageData: {
                    pageNo:1,
                    pageSize:10,
                    totalNum:10
                },
                loading: false,
                createFlag:false,
                addUserForm:{
                    username:'',
                    name:'',
                    depart:'',
                    role:'',
                    pwd:''
                },
                roleArr:[],
                addRules:{
                    username:[
                        {  validator: checkUserName, trigger: 'blur' }
                    ],
                    name:[
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    depart:[
                        { required: true, message: '请输入部门', trigger: 'blur' }
                    ],
                    role: [
                        { required: true, message: '请选择角色', trigger: 'change' }
                    ],
                    pwd:[
                        { validator: checkPwd, trigger: 'blur' }
                    ],
                },
                updateFlag:false,
                updateUserForm:{
                    userId:'',
                    password:''
                },
                updateRules:{
                    password:[
                        { validator: checkPwd, trigger: 'blur' }
                    ],
                },
                forbbidenFlag:false,
                userId:'',
                desc:'确定要禁用此账户吗？用户禁用后不可登录',
                allotFlag:false,
                allotUserForm:{
                    role:''
                },
                allotRules:{
                    role: [
                        { required: true, message: '请选择角色', trigger: 'change' }
                    ],
                },
                titleList:[
                    {
                        name:'APP管理系统',
                        pathInfo:''
                    },
                    {
                        name:'创建后台账户',
                        pathInfo:''
                    }                                               
                ],
                disabledState:false                
            }
        },
        components:{
            myDialog,
            pagination,
            breadcrumb
        },
        watch:{
            $route(){
                this.getList();
            },
        },
        created(){
            this.getList();
            this.getRole();
            let routes = this.$router.options.routes;
            let currentPath = this.$route.path
            let flag = this.$getPermissions(routes,currentPath);
            if(!flag){
                flag = [];
            }
            console.log(flag)
        },
        mounted(){
        },
        methods:{
            /**
             * 获取列表数据
             */
            getList(){
                let query = JSON.parse(JSON.stringify(this.$route.query));
                let params = {
                    username:query.username?decodeURI(query.username):this.searchData.username,
                    pageNo:query.page||this.pageData.pageNo,
                    pageSize:query.pageSize||this.pageData.pageSize
                }
                this.$http.get(this.$server.queryCmsUser,{params}).then(res=>{
                    if(res.status == 200){
                        
                        var listIds = [];
                        var contentdate = res.content;
                            listIds = contentdate.list.map(function(element,index){
                                if(contentdate.pageNum==1){
                                    element.sortId = index+1;
                                    return element;
                                }else if(contentdate.pageNum>1){
                                    element.sortId = (contentdate.pageNum-1)*10+index+1;
                                    return element;
                                }
                            });    
                        // this.tableData = res.content.list;
                        this.tableData = listIds;
                        this.pageData = {
                            pageNo:res.content.pageNum,
                            pageSize:res.content.pageSize,
                            totalNum:res.content.total
                        }
                    }
                })
            },
            /**
             * 搜索
             */
            search(){
                let query = {
                    username:encodeURI(this.searchData.username),
                    page:1
                }
                this.$router.push({
                    path: "/backstage/systemUser",
                    query
                })
            },
            /**
             * 获取角色
             */
            getRole(){
                this.$http.get(this.$server.getRole).then(res=>{
                    if(res.status == 200){
                        this.roleArr = res.content.map((item)=>{
                            return {
                                label:item.title,
                                value:item.id
                            }
                        })
                    }
                })
            },
            /**
             * 取消创建
             */
            cancelCreate(){
                this.createFlag = false;
            },
            /**
             * 确认创建
             */
            sureCreate(){
                var self = this;
                this.$refs['addForm'].validate((valid)=>{
                    if(valid){
                        let data = {
                            username:this.addUserForm.username,
                            name:this.addUserForm.name,
                            department:this.addUserForm.depart,
                            password:this.addUserForm.pwd,
                            roleId:this.addUserForm.role
                        }
                        this.createFlag = false;
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;
                            this.$http.post(this.$server.addCmsUser,data).then(res=>{
                                if(res.status == 200){
                                    this.addUserForm={
                                        username:'',
                                        name:'',
                                        depart:'',
                                        role:'',
                                        pwd:''
                                    };
                                    this.$message({
                                        message:'用户创建成功',
                                        type:'success'
                                    })
                                    self.disabledState = !self.disabledState;
                                    this.searchData.username = ''
                                    let query = {
                                        username:'',
                                        page:1
                                    }
                                    this.$router.push({
                                        path: "/backstage/systemUser",
                                        query
                                    })
                                }
                            }).catch(()=>{
                                self.disabledState = !self.disabledState;
                            })
                        }

                    }else{
                        // alert('error')
                        console.log("error");
                    }
                })
            },
            /**
             * 重置密码按钮事件
             * @param row
             */
            resetPwd(obj){
                this.updateFlag = true;
                this.updateUserForm.userId = obj.id
            },
            /**
             * 取消重置密码
             */
            cancelUpdate(){
                this.updateFlag = false;
            },
            /**
             * 确认重置密码
             */
            sureUpdate(){
                this.$refs['updateForm'].validate((valid)=>{
                    if(valid){
                        let data = this.updateUserForm;
                        this.updateFlag = false;
                        this.$http.post(this.$server.resetCmsUserPwd,data).then(res=>{
                            if(res.status == 200){
                                this.$message({
                                    message:'用户密码修改成功',
                                    type:'success'
                                })
                            }else{
                                this.$message({
                                    message:res.message,
                                    type:'error'
                                })
                            }
                        })
                    }
                })
            },
            /**
             * 禁用/解禁
             * @param obj
             */
            diyEnable(obj){
                this.userId = obj.id;
                if(obj.enabled == 1){
                    this.desc = '确定要禁用此账户吗？用户禁用后不可登录'
                }else{
                    this.desc = '确定要启用此账户吗？'
                }
                this.forbbidenFlag = true;
            },
            /**
             * 取消禁用
             */
            cancelForbbiden(){
                this.forbbidenFlag = false;
            },
            sureForbbiden(){
                let data = {
                    userId:this.userId,
                    isEnable:this.desc.includes('禁用')?0:1
                }
                this.forbbidenFlag = false;
                this.$http.post(this.$server.diyEnable,data).then(res=>{
                    if(res.status == 200){
                        this.$message({
                            message:'操作成功',
                            type:'success'
                        })
                        this.searchData.username = ''
                        let query = {
                            username:data.isEnable==1?'':null,
                            page:1
                        }
                        this.$router.push({
                            path: "/backstage/systemUser",
                            query
                        })
                    }else{
                        this.$message({
                            message:res.message,
                            type:'success'
                        })
                    }
                })
            },
            allotRole(obj){
                this.allotFlag = true
                this.userId = obj.id;
                this.allotUserForm.role = obj.roleId||'';
            },
            cancelAllot(){
                this.allotFlag = false
            },
            sureAllot(){
                var self = this;
                this.$refs['allotForm'].validate((valid)=>{
                    if(valid){
                        let query = {
                            userId:this.userId,
                            roleId:this.allotUserForm.role
                        }
                        this.allotFlag = false
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;
                            this.$http.post(this.$server.allotRole,query).then(res=>{
                                if(res.status==200){
                                    this.allotUserForm.role ='';
                                    console.log('disabledState成功变为false',self.disabledState);
                                    self.disabledState = !self.disabledState;
                                    this.getList();
                                    this.$message({
                                        message:'分配成功',
                                        type:'success'
                                    })
                                }
                            }).catch(()=>{
                            self.disabledState = !self.disabledState;
                        })
                        }

                    }
                })
            }
        }
    }
</script>
<style lang="scss">
    .system-user-page{
    .page-head {
        height: 150px;
        padding: 28px 19px 30px 17px;
        background: #fff;
        margin-bottom: 20px;
        border-radius: 5px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    .page-title {
        line-height: 40px;
        font-size: 18px;
        color: #384156;
        padding-bottom: 25px;
    }
    .filtrate-title {
        padding-right: 16px;
        width: 46px;
        font-size: 14px;
        color: rgba(56, 65, 86, 1);
        line-height: 40px;
    }
    .filtrate-select {
        width: 140px;
        margin-right: 20px;
    }
    .filtrate-input {
        width: 240px;
        margin-right: 20px;
    }
    .filtrate-execute {
        width: 110px;
    }
    .search-btn {
        cursor: pointer;
        width: 70px;
        height: 40px;
        line-height: 40px;
        background: rgba(217, 220, 226, 0.2);
        border: none;
        border-radius: 2px;
        color: rgba(56, 65, 86, 1);
        font-size: 12px;
    }
    }
    .page-content {
        border-radius: 5px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    }
    .my-form-warp{
        text-align: center;
    .el-form{
        display: inline-block;
    .el-form-item__label{
        line-height: 50px;
    }
    .el-input{
        width: 360px;
        height: 50px;
        line-height: 50px;
    .el-input__inner{
        height: 50px;
        line-height: 50px;
    }
    }
    .my-pwd.el-input--suffix .el-input__inner{
        padding-right: 40px;
    }
    }
    }
    .update-form{
    .el-form-item__label{
        font-size: 12px;
        width: 38px;
        text-align: justify;
        text-align-last: justify;
        margin-left: 32px;
    }
    .el-form-item__content{
        margin-left: 80px!important;
    }
    .el-input{
        width: 360px;
    }
    }
    .handle-area{
        p{
            display: inline-block;
            vertical-align: middle;
            color:#9E0E00;
            margin-right: 5px;
            cursor:pointer;
            &:last-child{
                 margin-right: 0;
             }
        }
    }
    .pagination-wrap{
        margin:20px 0;
    }
    }

</style>
