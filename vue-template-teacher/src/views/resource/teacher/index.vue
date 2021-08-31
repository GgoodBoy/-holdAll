<template>
    <div class="resouce-teacher">
        <div class="page-header">
            <el-row>
                <el-col class="lLeft-r lMarginBO30">
                    <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                </el-col>  
            </el-row>            
            <el-input v-model.trim="name"
                      placeholder="请输入老师姓名"
                      class="search-form el-icon-search"
                      @keydown.13.native="search"></el-input>
            <el-button class="red-btn"
                        v-if="$authJudge('source:teacher:select')"
                       @click="search">查询</el-button>
        </div>
        <div class="page-content">
            <div class="handle-row clearfix">
                <div class="fl"
                     style="line-height: 40px;">
                    <el-checkbox :indeterminate="isIndeterminate"
                                 v-model="checkAll"
                                 @change="handleCheckAllChange">全部老师</el-checkbox>
                </div>
                <div class="fr clearfix">
                    <!-- <el-button type="info"
                               class="del-btn fl"
                               @click="deleteTeacher" v-if="power.includes('teacher:delete')">删除</el-button> -->
                    <el-button class="red-btn create-btn fl"
                               @click="$router.push('/resource/teacher/create')" v-if="$authJudge('source:teacher:add')">新建老师</el-button>
                </div>
            </div>
            <ul class="teacher-list clearfix" v-if="pageData.items&&pageData.items.length>0">
                <el-checkbox-group v-model="checkedTeacher"
                                   @change="handleCheckedTeacherChange" >
                    <div class="teacher-item fl"
                         v-for="item,i in pageData.items"
                         :key="i">
                        <!-- <router-link class="clearfix"
                                     :to="`/resource/teacher/${item.id}`"> -->
                            <div class="fl teacher-img">
                                <router-link class="clearfix"
                                        :to="`/resource/teacher/${item.id}`">                                
                                        <img :src="item.avatar"
                                            class="img100"
                                            alt="">
                                </router-link>
                            </div>
                            <div class="fl teacher-info">
                                <div class="teacher-name">
                                    <div>{{item.name}}</div>
                                    <div class="attestation" v-if="$authJudge('source:teacher:auth')" @click="attestationEven(item)">讲师认证</div>
                                </div>
                                <div class="teacher-title"
                                     :title="item.professionalTitle">{{item.professionalTitle}}</div>
                                <div class="teacher-synopsis"
                                     :title="item.intro">{{item.intro}}</div>
                            </div>
                            <img :src="vImgs" class="vImgsCss" v-if="item.isAuth==1"
                                 alt="">
                        <!-- </router-link> -->
                        <!-- <el-checkbox :label="item"
                                     class="check-status">
                            <div class="check-id-text fl">
                                ID:{{item.serialNumber}}
                            </div>
                        </el-checkbox> -->
                        <div class="check-status">
                            <div class="check-id-text fl">ID:{{item.serialNumber}}</div>
                            <div class="fl" v-if="($authJudge('source:teacher:open')&&item.enable!=1)||($authJudge('source:teacher:forbidden')&&item.enable==1)" v-bind:class="{ 'check-id-buttom-ok': item.enable!=1, 'check-id-buttom-no': item.enable==1 }" @click="videoStateTeacher(i,item)">
                                {{item.enable==1?"禁用":"启用"}}
                            </div>
                        </div>
                    </div>
                </el-checkbox-group>
            </ul>
            <p v-else style="text-align: center;">没有对应信息</p>
        </div>
        <pagination :totalNum="pageData.totalNum"
                    :currentPage="pageData.currentPage"
                    :changeCallBack="pageChangeCallBack"
                    :pageSize="9"
                    class="paging" />
        <el-dialog  title=""
                    custom-class="common-dialog-header-bg"
                    :visible.sync="previewDialogVisible"
                    :close-on-click-modal="false"
                    width="500px">
                    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
                        <el-form-item label="ID:">
                            <span>{{form.id}}</span>
                        </el-form-item>
                        <el-form-item label="姓名:">
                            <span>{{form.name}}</span>
                        </el-form-item>                           
                        <el-form-item label="认证用户帐号:" prop="accountNum">
                            <!-- disabled -->
                            <el-input v-model="form.accountNum" :disabled="selectDate.isAuth==1?true:false"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="secondAccountNum" v-if="selectDate.isAuth!=1">
                            <el-input v-model="form.secondAccountNum"></el-input>
                        </el-form-item>                        
                        <el-form-item>
                            <el-button type="primary" v-if="selectDate.isAuth!=1" @click="onSubmit('form',true)">认证</el-button>
                            <el-button type="primary" v-if="selectDate.isAuth==1" @click="onSubmit('form',false)">取消认证</el-button>
                        </el-form-item>
                    </el-form>
        </el-dialog>                    
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import eventAction from '../../lEventAtion';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import vImgs from '../../../assets/images/v.png';
let actions = new eventAction()
export default {
    data() {
let valiNumber = (rule, value, callback) => {
            value = value + "";
            switch (rule.fullField) {   
                case "secondAccountNum":
                    if (JSON.stringify(value)!=JSON.stringify(this.form.accountNum)) {
                        callback(new Error("两次输入的帐号不一致，请重新输入"));
                    } else {
                        callback(); 
                    }               
                    break; 
                case "accountNum":
                    if (value === "") {
                        callback(new Error("认证信息不能为空"));
                    } else if (value.length!=11) {
                        callback(new Error("认证账户长度为11位"));
                    } else {
                        callback(); 
                    }               
                    break;                                                        
                default:
                    break;
            }
        };        
        return {
            name: "",
            checkAll: false,
            checkedTeacher: [],
            isIndeterminate: false,
            previewDialogVisible:false,
            pageData: {},
            power:[],
            vImgs:vImgs,
            form: {
                name: '',
                id:'',
                accountNum:'',
                secondAccountNum:'',
                ids:''
            },  
            rules: {
                    accountNum: [
                        { required: true, message: '请输入认证用户帐号', trigger: 'blur' },
                        { validator: valiNumber , trigger: 'blur' }
                    ],
                    secondAccountNum: [
                        { required: true, message: '请输入二次认证用户帐号', trigger: 'blur' },
                        { validator: valiNumber , trigger: 'blur' }
                    ]                                        
            },                          
            titleList:[
                {
                    name:'素材',
                    pathInfo:''
                },
                {
                    name:'教师库',
                    pathInfo:''
                } 
            ],
            selectDate:''            
        };
    },
    metaInfo: {
        title: "老师库-素材"
    },
    components: { 
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
        init() {
            let query = JSON.parse(JSON.stringify(this.$route.query));
            this.name = query.name || "";
            query["pageSize"] = 9;
            this.$http
                .get(this.$server.teacherIndex2, {
                    params: query
                })
                .then(res => {
                    this.pageData = res.content;
                    
                })
                .catch(err => {
                    console.log(err);
                });
        },
        search() {
            this.$router.push(`/resource/teacher?name=${this.name}`);
        },
        attestationEven(data){
            this.previewDialogVisible = true;
            this.selectDate = data;
            if(data.isAuth==1){
                let query = {
                    params:{
                        teacherId:data.id
                    }
                }
                this.$http.get(this.$server.getTeacherAuthRecord,query).then(res=>{
                    if(res.status==200){
                        this.form.name = res.content.teacherName;
                        this.form.id = res.content.serialNumber;
                        this.form.accountNum = res.content.authCellphone||'';
                        this.form.secondAccountNum = res.content.authCellphone||''; 
                        this.form.ids = res.content.id; 
                    }
                })
            }else{
                this.form.name = data.name;
                this.form.id = data.serialNumber;
                this.form.accountNum = '';
                this.form.secondAccountNum = '';             
            }
        },
        onSubmit(formName,type){
            if(type){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isOKAuthentication(true);
                    } else {
                        return false;
                    }
                }); 
            }else{
                this.isOKAuthentication(false);
            }
           
        },
        //认证
        isOKAuthentication(type){
            let query = {}
            if(type){
                query = {
                    teacherId:this.selectDate.id,
                    firstCellPhone:this.form.accountNum,
                    secondCellPhone:this.form.secondAccountNum
                }
                this.$http.post(this.$server.getAuthenticationTeacher,query).then(res=>{
                    if(res.status==200){
                        this.$message.success('已认证');
                        this.init();
                        this.previewDialogVisible = false;
                    }
                })                 
            }else{
                query = {
                         teacherAuthId:this.form.ids
                        }
                this.$http.post(this.$server.getCancelAuth,query).then(res=>{
                    if(res.status==200){
                        this.$message.success('已取消');
                        this.init();
                        this.previewDialogVisible = false;
                    }
                })                 
            }           
        },
        videoStateTeacher(i,items){
            var url = "teacher/"+items.id+"/enable";
            switch (items.enable) {
                case 0:
                    this.pageData.items[i].enable = 1;
                    actions.getData(url,{enableValue:1},'post')
                        .then(data => {  
                            console.log("启动成功",data);
                        })
                        .fail(function(){                   
                            console.log("出错啦!")}
                        );
                    break;
                case 1:
                    this.pageData.items[i].enable = 0;
                    actions.getData(url,{enableValue:0},'post')
                        .then(data => {  
                            console.log("禁用成功",data);
                        })
                        .fail(function(){                   
                            console.log("出错啦!")}
                        );
                    break;            
                default:
                    break;
            }
        },
        // deleteTeacher() {
        //     if (this.checkedTeacher.length > 0) {
        //         this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
        //             confirmButtonText: "确定",
        //             cancelButtonText: "取消",
        //             customClass:"common-confirm-layout",
        //             type: "warning"
        //         })
        //             .then(() => {
        //                 let teacherIds = [];
        //                 for (let i = 0; i < this.checkedTeacher.length; i++) {
        //                     teacherIds.push(this.checkedTeacher[i].id);
        //                 }
        //                 this.$http
        //                     .delete(this.$server.teacher, {
        //                         data: {
        //                             teacherIds,
        //                             transformRequest: true
        //                         },
        //                         headers: {
        //                             "Content-Type":
        //                                 "application/json;charset=utf-8"
        //                         }
        //                     })
        //                     .then(res => {
        //                         if (res.status === 200) {
        //                             this.$message({
        //                                 message: "删除成功，正在获取最新数据",
        //                                 type: "success"
        //                             });
        //                             this.init();
        //                         }
        //                     });
        //             })
        //             .catch(() => {});
        //     }
        // },
        handleCheckAllChange(val) {
            this.checkedTeacher = val ? this.pageData.items.slice(0) : [];
            this.isIndeterminate = false;
        },
        pageChangeCallBack() {
            this.checkedTeacher = [];
            this.isIndeterminate = false;
        },
        handleCheckedTeacherChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.pageData.items.length;
            this.isIndeterminate =
                checkedCount > 0 && checkedCount < this.pageData.items.length;
        }
    }
};
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
</style>

<style scoped lang="scss">
.page-header {
    background: #fff;
    padding: 28px 0 40px 17px;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    border-radius: 5px;
    .page-title {
        font-size: 18px;
        color: rgba(56, 65, 86, 1);
        margin-bottom: 20px;
    }
    .red-btn{
        background: #b4272d;
        color: #fff;
    }    
    .search-form {
        width: 240px;
        margin-right: 20px;
        position: relative;
        &.el-icon-search:before {
            position: absolute;
            font-size: 18px;
            right: 10px;
            top: 10px;
            background: #fff;
            font-weight: 900;
        }
    }
}
.handle-row {
    margin: 30px 20px 22px 22px;
    .create-btn {
        width: 100px;
        border-radius: 2px;
        margin-left: 20px;
    }
    .del-btn {
        width: 60px;
        padding: 0;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background:rgba(193,193,193,1);
        border-color: rgba(193,193,193,1);
        border-radius: 2px;
    }
    .red-btn{
        background: #b4272d;
        color: #fff;
    } 
}
.teacher-list {
    background: #fff;
    padding: 20px 0 0 20px;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
}
.teacher-item {
    width: 348px;
    height: 197px;
    border:1px solid rgba(237,241,247,1);
    background:rgba(245,245,245,1);
    margin: 0 15px 15px 0;
    position: relative;
    .teacher-img {
        margin: 13px 10px 13px 13px;
        width: 99px;
        height: 133px;
        border-radius:5px;
        overflow: hidden;
    }
    .vImgsCss{
        position: absolute;
        left: 91px;
        bottom: 40px;
        width: 30px;        
    }
    .teacher-info {
        margin: 10px 10px 10px 0;
        color:rgba(56,65,86,1);
        width: 214px;
        .teacher-name {
            font-size: 17px;
            display: flex;
            justify-content: space-between;
            .attestation{
                cursor: pointer;
            }
        }
        .teacher-title {
            margin: 13px 0 15px;
            font-size: 14px;
        }
        .teacher-synopsis {
            height: 59px;
            line-height: 21px;
            font-size: 14px;
            color: #9A9A9A;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
    }
    .check-status {
        height: 39px;
        width: 100%;
        background:rgba(234,234,234,1);
        zoom: 1;
        overflow: hidden;
        .check-id-text {
            line-height: 40px;
            font-size: 14px;
            padding: 0 13px;
            color: rgba(56, 65, 86, 1);
        }
        .check-id-buttom-ok{
            line-height: 28px;
            font-size: 12px;
            padding: 0 13px;
            margin: 0 13px;
            border-radius: 5px;
            margin-top: 5px;
            float: right;
            border: 1px solid #b4272d;
            color: #b4272d; 
            cursor: pointer;          
        }
        .check-id-buttom-no{
            line-height: 28px;
            font-size: 12px;
            padding: 0 13px;
            margin: 0 13px;
            border-radius: 5px;
            margin-top: 5px;
            float: right;
            border: 1px solid #9A9A9A;
            color: #9A9A9A;  
            cursor: pointer;          
        }        
    }
}
.paging {
    margin: 60px 0;
}
</style>
<style lang="scss">
.resouce-teacher {
    .el-checkbox__inner {
        width: 20px;
        height: 20px;
        &::after {
            width: 6px;
            height: 11px;
            left: 6px;
        }
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #b4272d;
        border-color: #b4272d;
    }
    .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
        height: 5px;
        top: 6px;
    }
    .handle-row .el-checkbox__label {
        font-size:18px;
    }
    .teacher-list {
        .el-checkbox__input {
            position: absolute;
            right: 25px;
            bottom: 6px;
            &::after {
                content: "选择";
                font-size: 14px;
                float: right;
                margin: 4px 0 0 10px;
            }
        }
        .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #606266;
        }
    }
}
</style>
