<template>
    <div class="page-wrap system-user-page">
        <div class="page-head">
            <section class="page-title clearfix">
                <!-- <h2 class="fl">创建合作老师</h2> -->
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
            </section>
            <section>
                <el-row class="filtrate-wrap search-area">
                    <el-col class="filtrate-input" :span="8">
                        <!-- <el-input v-model.trim="searchData.username"
                                placeholder="输入用户名查询" 
                                @keyup.13.native="search" >
                            <i slot="suffix" class="el-icon-search" @click="search"></i>
                        </el-input> -->


                        <el-form ref="searchDataFrom" :model="searchData" :rules="searchDataRules">
                            <el-form-item prop="username">
                                <el-input v-model.trim="searchData.username" @keyup.13.native="search" placeholder="输入用户名查询" clearable>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="2" v-if="$authJudge('admin:teacheraccount:select')"><el-button type="primary"  @click="search">查询</el-button></el-col>
                    <el-col class="filtrate-execute" v-if="$authJudge('admin:teacheraccount:add')">
                        <el-button class="redBackColor butColorF" @click="createFlag=true">创建用户</el-button>
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
                                 min-width="60"
                                            >
                </el-table-column>
                <el-table-column
                    prop="userName"
                    label="用户名"
                    align="center"
                    min-width="100"
                >
                </el-table-column>      
                <el-table-column
                    prop="avatar"
                    label="头像"
                    align="center"
                    width="100"
                >
                <template slot-scope="scope">
                    <img v-bind:src="scope.row['avatar']"/>
                </template>
                </el-table-column>                          
                <el-table-column
                    prop="name"
                    label="真实姓名"
                    align="center"
                    min-width="100"
                >
                </el-table-column>
                <el-table-column
                    prop="serialNumber"
                    align="center"
                    min-width="100"
                    label="老师ID">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    min-width="150"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    prop="totalRevenue"
                    align="center"
                    min-width="150"
                    label="总收益">
                </el-table-column>                 
                <!-- <el-table-column
                    prop="balance"
                    align="center"
                    min-width="150"
                    label="当前余额">
                </el-table-column> -->
                <el-table-column 
                    align="center"
                    label="操作"
                    min-width="200">
                    <template slot-scope="scope">
                        <div class="handle-area">
                            <p v-if="$authJudge('admin:teacheraccount:reset')" @click="resetPwd(scope.row)">重置密码</p>
                            <p v-if="$authJudge('admin:teacheraccount:forbidden')" v-show="scope.row.userStatus==1" @click="diyEnable(scope.row)">禁用</p>
                            <p v-if="$authJudge('admin:teacheraccount:open')" v-show="scope.row.userStatus!=1" @click="diyEnable(scope.row)">启用</p>
                            <p v-if="$authJudge('admin:teacheraccount:detail')" @click="allotRole(scope.row)">详情</p>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination 
                background
                :total="pageData.totalNum"
                @current-change="childPageValue"
                :current-page="currentpage"
                layout="prev, pager, next"></el-pagination>
        </div>
        <my-dialog :showFlag.sync="createFlag" :title="'创建用户'" :cancelName="'cancelCreate'" v-on:cancelCreate="cancelCreate" :sureName="'sureCreate'" v-on:sureCreate="sureCreate">
            <div slot="dialog-body">
                <div class="my-form-warp">
                    <el-form ref="addForm" :model="addUserForm" :rules="addRules" label-width="80px">
                        <el-form-item label="老师ID" prop="serialNumber">
                            <el-input v-model="addUserForm.serialNumber" maxlength="10">
                                <span slot="suffix" class="text-word">{{addUserForm.serialNumber.length}}/10</span>
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
        <my-dialog :showFlag.sync="allotFlag" :title="'创建用户'" :cancelName="'cancelAllot'" v-on:cancelAllot="cancelAllot" :sureName="'sureAllot'" v-on:sureAllot="sureAllot">
            <div slot="dialog-body">
                <div class="my-form-warp">
                    <el-form ref="allotForm" :model="allotUserForm" :rules="allotRules" label-width="80px">
                        <el-form-item label="用户名" prop="role">
                            <el-input v-model="allotUserForm.role" maxlength="10">
                                <span slot="suffix" class="text-word">{{allotUserForm.role.length}}/10</span>
                            </el-input>                            
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input  v-model="allotUserForm.password" maxlength="10">
                                <span slot="suffix" class="text-word">{{allotUserForm.password.length}}/10</span>
                            </el-input>                            
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
                    }else{
                        callback()
                    }
                }
            }
            let checkNoUserName=(rule,value,callback)=>{
                let regExp = /^[A-Za-z]+$/
                if(regExp.test(value)||value==''){
                    callback()
                }else{
                    
                    callback(new Error('用户名只能为英文字符'))
                }
            }            
            let checkPwd = (rule,value,callback)=>{
                // let regExp = /^[0-9a-zA-Z_]{7,}$/;
                let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{7,50}$/
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
            let creatUser = (rule,value,callback)=>{
                let regExp = /^[0-9]*$/
                if(value==''){
                    callback(new Error('请输入ID'))
                }else{
                    if(!regExp.test(value)){
                        callback(new Error('ID只能是数字'));
                    }else{
                        callback()
                    }
                }
            }            
            return{
                searchData:{
                    username:''
                },
                disabledState:false,
                userAddID:'',
                tableData:[],
                pageData: {
                    pageNo:1,
                    pageSize:10,
                    totalNum:10
                },
                loading: true,
                createFlag:false,
                addUserForm:{
                    serialNumber:''
                    },
                roleArr:[],
                addRules:{
                    serialNumber:[
                         {  validator: creatUser, trigger: 'blur' }
                    ]
                },
                updateFlag:false,
                updateUserForm:{
                    userId:'',
                    password:''
                },
                updateRules:{
                    password:[
                        { validator: checkPwd, trigger: 'blur' }
                    ]
                },
                searchDataRules:{
                    username:[
                        { validator: checkNoUserName, trigger: 'blur' } 
                    ]
                },
                forbbidenFlag:false,
                userId:'',
                desc:'确定要禁用此账户吗？用户禁用后不可登录',
                allotFlag:false,
                allotUserForm:{
                    role:'',
                    password:''
                },
                allotRules:{
                    role: [
                        {  validator: checkUserName, trigger: 'blur' }
                    ],
                    password:[
                        {  validator: checkPwd, trigger: 'blur' }
                    ]
                },
                currentpage:1,
                titleList:[
                    {
                        name:'APP管理系统',
                        pathInfo:''
                    },
                    {
                        name:'创建合作老师账户',
                        pathInfo:''
                    }                                               
                ]
            }
        },
        components:{
            myDialog,
            pagination,
            breadcrumb
        },

        watch:{
            $route(){
                this.getList(1);
            }
        }, 
        created(){
            this.getList(1);
            let routes = this.$router.options.routes;
            let currentPath = this.$route.path;
        },
        mounted(){},
        methods:{
            /**
             * 获取列表数据
             */
            getList(num){
                // let query = JSON.parse(JSON.stringify(this.$route.query));
                // let params = {
                //     username:query.username?decodeURI(query.username):this.searchData.username,
                //     pageNo:query.page||this.pageData.pageNo,
                //     pageSize:query.pageSize||this.pageData.pageSize
                // }
                let params = {
                    username:this.searchData.username,
                    pageNo:Number(num)>0?Number(num):this.pageData.pageNo,
                    pageSize:this.pageData.pageSize
                }  
                this.loading = true;              
                this.$http.get(this.$server.teacherCooperative(params)).then(res=>{
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
                        this.tableData = listIds;
                        this.pageData = {
                            pageNo:res.content.pageNum,
                            pageSize:res.content.pageSize,
                            totalNum:res.content.total
                        }
                        this.$nextTick(function(){
                            this.loading = false; 
                        })                        
                        console.log(res);
                    }
                })                
            },
            childPageValue(pageNum){
                this.currentpage = pageNum;
                this.getList(pageNum);
            },
            /**
             * 搜索
             */
            search(){
                let params = {
                    // userName:encodeURI(this.searchData.username),
                    userName:this.searchData.username,
                    pageNo:1,
                    pageSize:10                    
                };
                this.$refs['searchDataFrom'].validate((valid)=>{
                    if(valid){
                        this.loading = true;
                        this.$http.get(this.$server.teacherCooperative(params)).then(res=>{
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
                                    this.tableData = listIds;
                                    this.pageData = {
                                        pageNo:res.content.pageNum,
                                        pageSize:res.content.pageSize,
                                        totalNum:res.content.total
                                    }
                                    this.$nextTick(function(){
                                        this.loading = false; 
                                    })
                                    console.log(res);
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
                this.$refs['addForm'].validate((valid)=>{
                    if(valid){
                        let data = {
                            serialNumber:this.addUserForm.serialNumber
                        }
                        this.$http.get(this.$server.ceratedUserId+"?serialNumber="+data.serialNumber).then(res=>{
                        if(res.status == 200){
                            if(res.content&&Number(res.content.serialNumber)>0){
                                this.addUserForm.serialNumber='';
                                //创建用户成功以后限时下一步;
                                this.createFlag = false;
                                this.allotFlag = true;
                                this.userAddID = res.content.id;
                            }
                        }
                    })
                }else{
                    alert('error')
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
                var self = this;
                /**
                 * md5加密
                 */
                const crypto = require('crypto');
                function Md5(str){
                    const hash = crypto.createHash('md5');
                    hash.update(str);
                    return hash.digest('hex')
                };               
                this.$refs['updateForm'].validate((valid)=>{
                    if(valid){
                        let data = self.updateUserForm;
                        self.updateFlag = false;
                        self.$http.post(self.$server.teacherCooperativePassword(self.updateUserForm.userId)+"?password="+Md5(self.updateUserForm.password)).then(res=>{
                            if(res.status == 200){
                                self.$message({
                                    message:'用户密码修改成功',
                                    type:'success'
                                })
                            }else{
                                self.$message({
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
                if(obj.userStatus == 1){
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
                var self = this;
                let data = {
                    userStatus:this.desc.includes('禁用')?0:1
                }
                this.forbbidenFlag = false;
                this.$http.post(this.$server.cooperativeTeacher(self.userId),data).then(res=>{
                    if(res.status == 200){
                        this.$message({
                            message:'操作成功',
                            type:'success'
                        })
                        this.getList(self.currentpage);
                    }else{
                        this.$message({
                            message:res.message,
                            type:'error'
                        })
                    }
                })
            },
            allotRole(obj){
                var num = 6;
                var startTime = Number(new Date());
                var yesTime =startTime-(new Date(new Date().toLocaleDateString() + ' 00:00:00').getTime());
                var endTime = startTime-86400000*num-yesTime;                
                let query = {
                    pageNo:1,
                    pageSize:10,
                    startDateStr:endTime,
                    endDateStr:'',
                    id:obj.id,
                    totalRevenue:obj.totalRevenue
                };
                this.$router.push({
                    path: "/backstage/cooperativeTeacher/incomeDetail",
                    query
                })
            },
            cancelAllot(){
                this.allotFlag = false
            },
            sureAllot(){
                /**
                 * md5加密
                 */
                var self = this;
                const crypto = require('crypto');
                function Md5(str){
                    const hash = crypto.createHash('md5');
                    hash.update(str);
                    return hash.digest('hex')
                };       
                this.$refs['allotForm'].validate((valid)=>{
                    if(valid){
                        let query = {
                            userName:this.allotUserForm.role,
                            password:Md5(this.allotUserForm.password),
                            teacherId:this.userAddID
                        }
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;
                            this.$http.post(this.$server.teacherCooperativeAdd,query).then(res=>{
                                if(res.status==200){
                                    this.allotUserForm.role ='';
                                    this.allotUserForm.password ='';
                                    self.disabledState = !self.disabledState;
                                    this.allotFlag = false; 
                                    this.getList(1);
                                    this.$message({
                                        message:'分配成功',
                                        type:'success'
                                    })
                                }else{
                                    this.$message({
                                        message:res.message,
                                        type:'error'
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
@import "../../../components/formSynthesisPlugin/my-component.css";
    .system-user-page{
        .block{
            text-align: center;
            padding: 40px 0 40px 0;
            background: #fff;
        }
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
