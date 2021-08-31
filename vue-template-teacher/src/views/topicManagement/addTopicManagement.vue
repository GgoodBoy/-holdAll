<template>
    <div>
        <el-row class="lSize16">
            <el-col :span="8" class="lLeft-r">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
        </el-row>          
        <el-form :rules="rules" ref="form" :model="form" class="create-course-baseinfo" label-width="160px">
            <el-form-item label="话题" prop="name">
                <el-input style="width:300px" v-model="form.name" placeholder="请输入话题名称" :maxlength="20"></el-input>
                <span>{{form.name.length||0}}/20</span>
            </el-form-item>
            <el-form-item label="话题描述" prop="introduce">
                <!-- @keyup.enter.native="onNextOne" @keyup.enter.Space="onNextTwo" -->
                <el-input type="textarea" :rows='4' style="width:300px" v-model="form.introduce" :maxlength="2000"></el-input>
                <span>{{form.introduce.length||0}}/2000</span>         
                    <!-- <div class="my-course-editor">
                        <Editor v-model="form.introduce" :maxLength="1000"/>
                    </div>                 -->
            </el-form-item> 
            <el-form-item label="预置关注人数" prop="partakeNum">
                <el-input style="width:100px" v-model="form.partakeNum" placeholder="1-99999"></el-input>    
                <p class="grayColor lSize12">关注人数较多的前10位将出现在热门话题中</p>      
            </el-form-item>      
            <el-form-item label="预置参于人数" prop="followNum">
                <el-input style="width:100px" v-model="form.followNum" placeholder="1-99999"></el-input>        
            </el-form-item>   
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">保存</el-button>
            </el-form-item>
        </el-form>    
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <span>您有未保存的信息，离开后会丢失，确认要离开吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="leavePage">确 定</el-button>
            </span>
        </el-dialog>          
    </div>
</template>
<script>
    import { getToken,setToken,removeToken} from '@/utils/auth';
    import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
    const regExp = {
        'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
        'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
        'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g, //特殊字符(除了数字、字母、汉字) 
        'numberChar':/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,//价格最多保留2位小数
        'numberPeopleExp':/^\+?[1-9]\d{0,4}(\.\d*)?$/ //1到9999
    }    
    export default {
        data() {
            let valiNumber = (rule, value, callback) => {
                value = value + "";
                switch (rule.fullField) {
                    case "followNum":
                            if (value === "") {
                                callback(new Error("预置参于人数不能为空。"));
                            } else if (!regExp.numberPeopleExp.test(value)) {
                                callback(new Error("预置参于人数在1-99999"));
                            }
                        break;
                    case "partakeNum":
                            if (value === "") {
                                callback(new Error("预置关注人数不能为空。"));
                            } else if (!regExp.numberPeopleExp.test(value)) {
                                callback(new Error("预置关注人数在1-99999"));
                            }
                        break;                                                                
                    default:
                        break;
                }
                callback();
            };            
            return {
                form: {
                    name: '',
                    partakeNum:'',
                    followNum:'',
                    introduce: ''
                },
                disabledState:false,
                titleList:[
                            {
                                name:'话题管理',
                                pathInfo:'/alumniCircle/topicManagementList'
                            },
                ],
                action:'',
                optionsOne:[],
                dialogVisible:false,
                leavePath:'',
                rules: {   
                    partakeNum: [{ validator: valiNumber, trigger: "blur" }],           
                    followNum: [{ validator: valiNumber, trigger: "blur" }],                   
                    name: [
                        {
                            required: true,
                            message: "请输入话题名称",
                            trigger: "blur"
                        },
                        {
                            min: 1,
                            max: 20,
                            message: "长度在 1 到 20 个字符",
                            trigger: "blur"
                        }
                    ],
                    introduce: [
                        {
                            required: true,
                            message: "请输入话题描述",
                            trigger: "blur"
                        }
                    ],
                    isEdit:'',
                    editCommodId:'',
                    isCopyFrom:{},
                    leavePageType:false
                }                               
            }
        },
        beforeRouteLeave (to, from, next){
            this.leavePath = to.fullPath;
            if(this.leavePageType){
                next();
            }else{
                if(JSON.stringify(this.isCopyFrom)!=JSON.stringify(this.form)){
                    this.dialogVisible = true;
                    next(false);
                    return;
                }else{
                    next();
                }
            }
        },         
        created(){
            this.getProgramList();
            var datas = this.$route.query;
            if(datas.hasOwnProperty('id')){
                this.getDatabackfill(datas.id);   
                this.editCommodId = datas.id;
                this.isEdit = true;   
                this.titleList.push(                            
                        {
                            name:'话题修改',
                            pathInfo:''
                        }
                    );         
            }else{
                this.isEdit = false;  
                this.editCommodId = ''; 
                this.isCopyFrom = Object.assign({}, this.form);
                this.titleList.push(                            
                        {
                            name:'话题添加',
                            pathInfo:''
                        }
                    );                
            }      
            this.action = this.$server.actionImgOrvideo;   
        },
        components:{
            breadcrumb
        },
        methods: {
        /**
         * 离开页面
         */
            leavePage(){
                this.dialogVisible = false;
                this.leavePageType = true;
                setTimeout(()=>{
                    this.$router.push(this.leavePath)
                },1)
            },            
            getProgramList(){ 
                this.loading = true; 
                var params = {
                    classifyName:''
                };
                this.$http.get(this.$server.getGoodsClassifyList,{params}).then(res=>{
                    if(res.status==200){
                        var listIds = [];
                        var contentdate = res.content;  
                        contentdate.forEach(element => {
                            listIds.push({
                                value:element.id,
                                label:element.classifyName
                            });
                        });                                             
                        this.optionsOne = listIds;
                    }
                })             
            },            
            //数据回填
            getDatabackfill(id){
                let params = {
                    id:id
                };
                this.$http.get(this.$server.getFindTopicById,{params}).then(res=>{
                    if(res.status==200){
                        let data = res.content;
                        this.form = {
                            name: data.topicName,
                            partakeNum:data.presetFollowNum,
                            followNum:data.presetPartakeNum,
                            introduce: data.topicDesc,
                        };                        
                    }
                    this.isCopyFrom = Object.assign({}, this.form);
                });                
            },
            saveEvenIsok(formData){
                var urls = this.isEdit?this.$server.getUpdateTopicTopic:this.$server.getAddTopicTopic;
                var querys = {
                    topicName:formData.name,
                    presetFollowNum:formData.partakeNum,
                    presetPartakeNum:formData.followNum,
                    topicDesc: formData.introduce
                };
                if(this.isEdit){
                    querys['id'] = this.editCommodId;
                }
                if(!this.disabledState){
                    this.disabledState = !this.disabledState;
                    this.$http.post(urls,querys).then(res=>{
                        if(res.status==200){
                            this.leavePageType = true;
                            this.disabledState = !this.disabledState;
                            var messages = this.isEdit?'编辑':'添加';
                            this.$message.success(messages+'成功');
                            this.form= {
                                name: '',
                                partakeNum:'',
                                followNum:'',
                                introduce: ''
                            };                        
                            this.$router.push('/alumniCircle/topicManagementList');                        
                        }
                    })              
                    .catch(res => {
                        this.disabledState = !this.disabledState;
                    });                     
                }               
            },                   
            onSubmit() {
                var that = this;
                that.$refs["form"].validate(valid => {
                    if(valid){
                        that.saveEvenIsok(that.form);
                    }
                })            
            }
        },
        mounted(){

        }
        }
    </script>
<style lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.create-course-baseinfo {
    margin-top: 20px;
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .el-radio__input.is-checked .el-radio__inner {
        border-color: rgba(158, 14, 0, 1);
        background: rgba(158, 14, 0, 1);
    }
    .el-radio__input.is-checked + .el-radio__label {
        color: rgba(158, 14, 0, 1);
    }
}
</style>
<style>
.my-course-editor .editor-wrapper .quill-editor .ql-toolbar .ql-formats .ql-image{
    display: none !important;
}
.my-course-editor .editor-wrapper .quill-editor .ql-toolbar .ql-formats .ql-link{
    display: none !important;
}
.my-course-editor .editor-wrapper .ql-toolbar .ql-formats:nth-child(2)::after{
    content: '';
    display: block;
    position: absolute;
    right: -8px;
    top: 2px;
    height: 26px;
    width: 0px;
    background: #bbb;    
}
</style>


