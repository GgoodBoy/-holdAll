<template>
    <div class="page-wrap role-list-page">
        <div class="page-head-warp">
            <section class="page-title clearfix">
                <!-- <h2 class="fl">角色管理</h2> -->
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                <el-button v-if="$authJudge('admin:rolemanager:addrole')" class="redBackColor butColorF" style="float: right" @click="addRoleFlagEven">添加角色</el-button>
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
                    prop="title"
                    label="角色名称"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    label="创建时间">
                </el-table-column>
                <el-table-column align="center"
                    label="操作"
                >
                    <template slot-scope="scope">
                        <div class="handle-area">
                            <p v-if="$authJudge('admin:rolemanager:addnormal')" @click="toAuth(scope.row)">添加普通权限</p>
                            <p v-if="$authJudge('admin:rolemanager:check')" @click="viewRole(scope.row)">查看</p>
                            <p v-if="$authJudge('admin:rolemanager:del')" @click="delRole(scope.row)">删除</p>
                            <p v-if="$authJudge('admin:rolemanager:adddata')" @click="addDataAuth(scope.row)">添加数据权限</p>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <my-dialog :showFlag.sync="addRoleFlag" :title="'创建角色'" :cancelName="'cancelCreate'" v-on:cancelCreate="cancelCreate" :sureName="'sureCreate'" v-on:sureCreate="sureCreate">
            <div slot="dialog-body">
                <el-form :model="addRoleForm" ref="addRoleForm" class="add-form" :rules="addRoleRules">
                    <el-form-item label="角色名称" prop="rolename">
                        <el-input v-model="addRoleForm.rolename">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </my-dialog>
        <my-dialog :showFlag.sync="delRoleFlag" :title="'温馨提示'" :cancelName="'cancelDel'" v-on:cancelDel="cancelDel" :sureName="'sureDel'" v-on:sureDel="sureDel">
            <div slot="dialog-body">
                <p>确定要删除这个角色吗？</p>
            </div>
        </my-dialog>
        <my-dialog :showFlag.sync="roleBoxFlag" :title="'查看角色'" :btnFlag="false" :footerStatus="false">
            <div slot="dialog-body" class="role-box-wrap">
                <div v-show="roleList.length>0">
                    <p class="label">用户名称 :</p>
                    <div class="role-list content">
                        <div v-for="(item,index) in roleList" :key="index" class="role-item">
                            <p>{{item.username}}</p>
                            <i class="el-icon-error" @click="delUserFromRole(item.id)"></i>
                        </div>
                    </div>
                </div>
                <div>
                    <p class="label">角色权限 :</p>
                    <div class="content">
                        <one-tree v-for="(item,index) in permissionList" :key="index" :data="item"></one-tree>
                        <!--<one-tree></one-tree>-->
                    </div>
                </div>
            </div>
        </my-dialog>
        <el-dialog
            :visible.sync="authData.dialogVisible"
            width="400px"
            top="15%"
            center>
            <div class="auth-list">
                <el-checkbox-group 
                    v-model="authData.dialogArr"
                    :min="0"
                    >
                    <div class="item" v-for="(item,index) in authData.list" :key="index">
                        <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
                    </div>
                </el-checkbox-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="authData.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAuthData">保 存</el-button>
            </div>
            </el-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
    import myDialog from '@/components/myDialog/myDialog.vue'
    import OneTree from './components/OneTree.vue';
    import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
    export default{
        data(){
            return{
                tableData:[
//                    {ID:1,rolename:'管理员',time:'2018-01-01'}
                ],
                pageData: {},
                loading: false,
                addRoleFlag:false,
                addRoleForm:{
                    rolename:''
                },
                addRoleRules:{
                    rolename:[
                        { required: true, message: '请输入角色', trigger: 'blur' }
                    ],
                },
                delRoleFlag:false,
                roleBoxFlag:false,
                roleId:'',
                roleList:[],
                permissionList:[],
                disabledState:false,
                titleList:[
                    {
                        name:'APP管理系统',
                        pathInfo:''
                    },
                    {
                        name:'角色管理',
                        pathInfo:''
                    }                                               
                ],
                authData:{
                    dialogVisible:false,
                    dialogArr:[],
                    list:[],
                    roleId:''
                }                
            }
        },
        components:{
            myDialog,
            OneTree,
            breadcrumb
        },
        created(){
            this.getList();
        },
        mounted(){
            // this.$alert('<div class="tips"><i class="el-icon-error"></i><p class="tip-text">删除角色前请先移除该角色下面的用户</p>', '温馨提示', {
            //     dangerouslyUseHTMLString: true,
            //     customClass:'my-message-alert no-button',
            //     showClose:false,
            // });
        },
        methods:{
            addRoleFlagEven(){
                this.addRoleForm.rolename='';
                this.addRoleFlag=true;
            },
            /**
             * 获取角色列表
             */
            getList(){
                this.loading = true;
                this.$http.get(this.$server.getRole).then(res=>{
                    this.loading = false;
                    if(res.status == 200){

                    var listIds = [];
                        listIds = res.content.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                        });
                        // this.tableData = res.content;
                        this.tableData = listIds;
                    }
                })
            },
            /**
             * 取消创建角色
             */
            cancelCreate(){
                this.addRoleFlag = false;
            },
            /**
             * 确认创建角色
             */
            sureCreate(){
                var self = this;
                this.$refs['addRoleForm'].validate((valid)=>{
                    if(valid){
                        let data = {
                            title:this.addRoleForm.rolename,
                            description:''
                        }
                        this.addRoleFlag = false;
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;
                            this.$http.post(this.$server.addRole,data).then(res=>{
                                if(res.status == 200){
                                    self.disabledState = !self.disabledState;
                                    console.log('disabledState成功变为false',self.disabledState);
                                    this.$message({
                                        message:'角色创建成功',
                                        type:'success'
                                    })
                                    this.getList()
                                }else{
                                    self.disabledState = !self.disabledState;
                                    this.$message({
                                        message:res.message,
                                        type:'error'
                                    })
                                }
                            })
                        }
                    }
                })
            },
            /**
             * 查看角色
             */
            viewRole(obj){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.roleId = obj.id
                this.$http.get(`${this.$server.viewRole}/${obj.id}`).then(res=>{
                    if(res.status == 200){
                        this.roleBoxFlag = true;
                        loading.close()
                        this.roleList = res.content.userList;
                        this.permissionList = res.content.permissionList;
                    }
                })
            },
            /**
             * 删除角色弹出框
             */
            delRole(obj){
                this.roleId = obj.id;
                this.delRoleFlag = true;
            },
            cancelDel(){
                this.delRoleFlag = false;
            },
            /**
             * 确定删除角色
             */
            sureDel(){
                this.delRoleFlag = false;
                this.$http.post(`${this.$server.deleteRole}${this.roleId}`).then(res=>{
                    if(res.status == 200){
                        this.$message({
                            message:'删除成功',
                            type:'success'
                        })
                    }else{
//                        this.$message({
//                            message:'删除成功',
//                            type:'success'
//                        })
                    }
                })
            },
            /**
             * 从角色下删除用户
             * @param id
             */
            delUserFromRole(id){
                this.$confirm('是否删除此用户', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    let data = {
                        userId:id
                    }
                    this.$http.post(`${this.$server.delUserFromRole}${this.roleId}`,data).then(res=> {
                        this.roleBoxFlag = false
                        if (res.status == 200) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                        }
                    })
                }).catch(() => {

                });
            },
            toAuth(obj){
                this.$router.push({path:`/backstage/roleManage/authCenter/${obj.id}`})
            },
            addDataAuth(obj){
                this.authData.dialogArr = obj.rdarList.map(item=>{
                    return item.dataAuthId
                })
                this.authData.dialogVisible = true;
                // this.authData.dialogArr = [ ];
                this.authData.roleId = obj.id;
                this.$nextTick(()=>{
                    this.getDataAuth(obj)
                })
            },
            getDataAuth(obj){
                let query = {
                    params:{}
                }
                this.$http.get(this.$server.getDataAuth,query).then(res=>{
                    if(res.status==200){
                        this.authData.list = res.content
                    }
                })
            },
            saveAuthData(){
                var self = this;
                let query = {
                    roleId:this.authData.roleId,
                    authIds:this.authData.dialogArr.join(',')
                }
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;
                    this.$http.post(this.$server.saveDataAuth,query).then(res=>{
                        if(res.status==200){
                            self.disabledState = !self.disabledState;
                            console.log('disabledState成功变为false',self.disabledState);
                            this.$message.success('保存成功');
                            this.authData.dialogVisible = false;
                            this.getList()
                        }
                    })
                    .catch(res => {
                        self.disabledState = !self.disabledState;
                        self.btnLoading = false;
                    });
                }

            }
        }
    }
</script>
<style lang="scss">
    .role-list-page{
        .el-form-item__content{
            margin-left: 102px;
        }
        .handle-area{
            p{
                display: inline-block;
                vertical-align: middle;
                margin-right: 5px;
                cursor:pointer;
                color:#b13e33;
            &:last-child{
                 margin-right: 0;
             }
            }
        }
        .page-head-warp {
            background: #fff;
            margin-bottom: 20px;
            border-radius: 5px;
            height: 82px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            .page-title {
                line-height: 40px;
                font-size: 18px;
                color: #384156;
                padding: 21px 30px;
            }
        }
        .page-content {
            border-radius: 5px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        }
        .el-dialog__wrapper{
            .el-input{
                width: 360px;;
            }
            .el-form-item__label{
                margin-left: 34px;
                font-size: 12px;
            }
        }
        .label{
            font-size: 16px;
            display: inline-block;
            vertical-align: top;
            color:#000000;
            margin-right: 5px;
        }
        .role-box-wrap{
            height: 270px;
            overflow-y: auto;
            .content{
                display: inline-block;
                vertical-align: top;
                width:530px;
                .role-item{
                    color:#6A6A6A;
                    font-size: 16px;
                    display: inline-block;
                    margin:0 15px 20px 0;
                    position: relative;
                    &:hover{
                     .el-icon-error{
                         display: block;
                     }
                     }
                    .el-icon-error{
                        display: none;
                        position: absolute;
                        right: -10px;
                        top: 0;
                        font-size: 12px;
                        color: #9E0E00;
                    }
                }
            }
        }
        .auth-list{
            height: 200px;
            overflow-y:auto;
            .item{
                margin:5px 0;
            }
        }

    }
    .my-message-alert.no-button.el-message-box{
            width: 660px;
            .el-message-box__header{
                background: #EDF1F7;
                .el-message-box__title{
                     font-size: 16px;
                }
            }
            .tips{
                text-align: center;
                .el-icon-error{
                    font-size: 48px;
                    color:red;
                    margin:40px 0 20px 0;
                }
                .tip-text{
                    margin:10px 0 20px 0;
                }
            }
            .el-message-box__btns{
                display: none;
            }
        }

</style>
