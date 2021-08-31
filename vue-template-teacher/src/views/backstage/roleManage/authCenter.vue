<template>
    <div class="page-wrap auth-center-page">
        <breadcrumb :menuList ='titleList' class="lMarginTB20"></breadcrumb>
        <div class="page-content" v-loading="loading">
            <div class="page-box">
                <!-- <collapse v-for="(item,index) in permissionList" :key="index" :data="item" :roleArr.sync="item.roleArr"></collapse> -->
                <el-tree
                    :data="permissionList"
                    node-key="id"
                    show-checkbox
                    ref="tree"
                    @check-change="handleCheckChange"
                    >
                </el-tree>
            </div>
            <div class="btns-area">
                <el-button plain @click="$router.go(-1)">取消</el-button>
                <el-button class="redBackColor butColorF" @click="addAuth">确定</el-button>
            </div>
        </div>
    </div>
</template>
<script type="application/ecmascript">
    import {mapActions} from 'vuex'
    import Collapse from './components/Collapse.vue';
    import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
    import { getToken } from '@/utils/auth';
    export default{
        data(){
            return {
                roleId:'',
                permissionList:[],
                checkedKeys:[],
                loading:false,
                titleList:[
                    {
                        name:'APP管理系统',
                        pathInfo:'/backstage/roleManage'
                    },
                    {
                        name:'角色管理',
                        pathInfo:'/backstage/roleManage'
                    },
                    {
                        name:'添加权限',
                        pathInfo:''
                    }                                               
                ],
            }
        },
        created(){
            this.getAuthTree()
        },
        components:{
            'collapse':Collapse,
            'breadcrumb':breadcrumb
        },
        methods:{
            ...mapActions(['SET_AUTHTREE']),
            handleCheckChange(data, checked, indeterminate) {
                //如果取消查看权限就全部权限都取消；
            //    if(data.code.includes('select')&&!checked){
            //        console.log('data.parentId',data.parentId);
            //        this.$refs.tree.setChecked(data.parentId,false,true)
            //    }
            },            
            /**
             * 获取角色权限树
             */
            getAuthTree(){
                if(this.$route.params && this.$route.params.id){
                    let id = this.$route.params.id
                    this.roleId = id;
                    this.loading = true;
                    this.$http.get(`${this.$server.viewRole}/${id}`).then(res=>{
                        this.loading = false;
                        if(res.status == 200){
                            this.permissionList = this.getroleTree(res.content.permissionList);
                            setTimeout(()=>{
                                this.$refs.tree.setCheckedKeys(this.checkedKeys)
                            },1)
                        }
                    })
                }else{
                    this.$router.push({path:'/backstage/roleManage'})
                }
            },
            /**
             * 递归组合数据
             */
            getroleTree(data){
                if(typeof data == 'object' && Array.isArray(data)){
                    data.forEach(item=>{
                        item.label = item.title;
                        if(item.childrenList.length>0){
                            // let flag = item.childrenList.some(option=>option.has==0)
                            // if(item.has == 1&&!flag){
                            //     this.checkedKeys.push(item.id)
                            // }
                            item.children = this.getroleTree(item.childrenList)
                        }else{
                            if(item.has == 1){
                                this.checkedKeys.push(item.id)
                            }
                        }
                    })
                    return data;
                }
            },
            /**
             * 添加权限
             */
            addAuth(){
                this.$confirm('是否给该角色添加选中权限?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    let permissions = [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()]
                    this.$http.post(`${this.$server.addPermission}${this.roleId}`,{
                        permissions:JSON.stringify(permissions)
                    }).then(res=>{
                        this.loading = false;
                        if(res.status == 200){
                            this.$message({
                                type: 'success',
                                message: '保存成功!'
                            });
                            
                            this.$http.get(`${this.$server.viewRole}/${this.$route.params.id}`).then(res=>{
                                if(res.status == 200){
                                    let name = localStorage.getItem('permissionName')
                                    let index = res.content.userList.findIndex(item=>{
                                        return `"${item.username}"`==name
                                    });
                                    if(index>=0){
                                        let query = {
                                            params:{}
                                        }
                                        this.$http.get(this.$server.getUserPermission,query).then(result=>{
                                            if(result.status==200){
                                                let permissions = result.content.permissions.map(item=>{
                                                    return item.replace(/\./g,':');
                                                })
                                                window.localStorage.setItem('permissions', JSON.stringify(permissions))
                                                window.location.reload();
                                            }
                                        })
                                    }else{
                                        this.$router.go(-1)
                                    }
                                }
                            })
                        }else{
                            this.$message({
                                type: 'error',
                                message:res.content
                            });
                        }
                    })
                }).catch(() => {

                });

            }
        }
    }
</script>
<style lang="scss">
    .auth-center-page{
        .breadcrumb{
            margin-bottom:20px;
        }
       .page-content{
           padding: 40px 30px;
           background: #fff;
           .page-box{
               border:1px solid #EBEBEB;
                border-radius: 2px;
                max-height: calc(100vh - 340px);
                overflow: auto;
            }
           .btns-area{
               margin:20px 0 0 0;
               text-align: center;
               .my-btn.red-border-btn{
                   margin-right: 60px;
               }
               .my-btn{
                   padding: 0 40px;
               }
           }
        }
        .el-tree-node__content{
            height: 60px;
            .el-tree-node__expand-icon{
                font-size: 25px!important;
            }
            .el-checkbox__inner{
                width: 20px;
                height: 20px;
                margin-top:6px;
            }
            .el-checkbox__inner::after{
                height: 11px;
                left: 7px;
            }
            .el-checkbox__input.is-indeterminate .el-checkbox__inner::before{
                top:8px;
            }
        }
    }
</style>
