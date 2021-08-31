<template>
<div>
    <el-row>
        <el-col>
            <el-row>
                <el-col :span="20">
                    <el-row>
                        <el-col :span="12">
                            <span class="lSize16">特殊账户</span>
                            <!-- <span class="lSize12 grayColor lMarginL20">特殊用户不计算提成和佣金</span> -->
                            </el-col>
                    </el-row>                    
                </el-col>
                <el-col :span="4" class="lRight-r" v-if="$authJudge('accounts:add')">
                    <el-button class="redBackColor butColorF" @click="specialOperate('add')">添加账户</el-button>
                </el-col>
            </el-row>
        </el-col>
        <el-col class="lMarginTop30">
            <el-row :gutter="20">
                 <!-- @keyup.native="proving1" -->
                <el-col :span="6">
                    <el-input v-model.trim="title"
                    placeholder="输入账号查询"
                    class="search-form"
                    width="100%"
                    maxlength="11"
                    clearable
                    ></el-input>
                </el-col>
                <el-col :span="4">
                    <el-row>
                        <el-col :span="8" class="lCenter-L lLine40" style="fontSize:14px">状态 : </el-col>
                        <el-col :span="15" :offset="1">
                            <el-select v-model="value" placeholder="状态" @change="chooseVersionType">
                                <el-option
                                v-for="item in specialList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>                                    
                        </el-col>
                    </el-row> 
                </el-col>
                <el-col :span="3" class="lRight-L" v-if="$authJudge('accounts:select')">
                    <el-button type="primary" @click="specialOperate('query')">查询</el-button>
                </el-col>
            </el-row>
        </el-col>
        <el-col class="lMarginTop20">
            <el-table
            :data="tableData"
            border
            v-loading="loading"
            style="width: 100%">
                <el-table-column
                    prop="sortId"
                    label="序号"
                    align="center"
                    min-width="50">
                </el-table-column>     
                <el-table-column
                    prop="cellphone"
                    label="账号"
                    align="center"
                    min-width="120">
                </el-table-column>                                                                                                
                <el-table-column
                    label="类型"
                    align="center"
                    min-width="80">
                        <template slot-scope="scope">
                                <el-row> 
                                    <el-col class="lCenter-r butColor">
                                        <p v-if="scope.row.type==1">会员</p>
                                        <p v-if="scope.row.type==2">测试</p>
                                    </el-col>                                    
                                    <el-col class="lCenter-r"> 
                                        <p v-if="scope.row.timeType==1">月度</p>
                                        <p v-else-if="scope.row.timeType==2">季度</p>
                                        <p v-else-if="scope.row.timeType==3">半年</p>
                                        <p v-else-if="scope.row.timeType==4">年度</p>
                                        <p v-else-if="scope.row.timeType==5">测试</p>
                                        <p v-else></p>
                                    </el-col>                                    
                                </el-row>                                                      
                            </template>                       
                </el-table-column>   
                <el-table-column
                    prop="createdAt"
                    label="添加时间"
                    align="center"
                    min-width="120">
                </el-table-column>
                <el-table-column
                    prop="creatorName"
                    label="添加人"
                    align="center"
                    min-width="60">
                </el-table-column>     
                <el-table-column
                    label="状态"
                    align="center"
                    min-width="60">
                        <template slot-scope="scope">
                                <el-row> 
                                    <el-col class="lCenter-r" v-if="scope.row.state==1"> 
                                        启用
                                    </el-col>
                                    <el-col class="lCenter-r" v-else>
                                        禁用
                                    </el-col>                                    
                                </el-row>                                                      
                            </template>                    
                </el-table-column>     
                <el-table-column
                    prop="remark"
                    :show-overflow-tooltip='true'
                    label="备注"
                    align="center"
                    min-width="120">
                </el-table-column>                 
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="120"
                    >
                        <template slot-scope="scope">
                            <el-row :gutter="10"> 
                                <el-col :span="12">
                                    <el-button type="text" v-if="$authJudge('accounts:forbidden')" class="black-btn" v-show="scope.row.state==1" @click="specialOperate('useOrNo',scope.row)">禁用</el-button>
                                    <el-button type="text" v-if="$authJudge('accounts:open')" class="black-btn" v-show="scope.row.state==0" @click="specialOperate('useOrNo',scope.row)">启用</el-button>
                                </el-col>  
                                <el-col :span="12" v-if="scope.row.type==1">
                                    <el-button  v-if="$authJudge('accounts:edit')" type="text"  class="black-btn" @click="specialOperate('update',scope.row)">修改</el-button>
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
    </el-row>
    <el-dialog
        :visible.sync="specialListAddDialog"
        :close-on-click-modal="false"
        title=""
        max-height="300"
        width="25%">  
            <el-row>
                <el-col>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="输入账号" prop="cellphone" style="width:300px;">
                            <el-input v-model="ruleForm.cellphone" maxlength="11"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" prop="type" >
                            <el-select v-model="ruleForm.type" placeholder="请选择活动区域" @change="specialEven">
                            <el-option label="会员" value="1"></el-option>
                            <el-option label="测试" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="timeType" v-if="specialEvenBool" ref="timeTypeValue1">
                            <el-radio-group v-model="ruleForm.timeType" @change="selectTimeType">
                                <el-radio :label="item.timeType" v-for="(item,index) in timeTypeList" :key="index">{{item.name}}</el-radio>                            
                            </el-radio-group>
                        </el-form-item>                        
                        <el-form-item label="备注" prop="remark" >
                            <el-input v-model="ruleForm.remark" type="textarea" style="width:80%" :rows="4" maxlength="30"></el-input>
                            <span>{{ruleForm.remark.length||0}}/30</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="resetDialog('add')">取消</el-button>
                            <el-button type="primary" @click="submitForm('ruleForm','add')">确定</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>               
            </el-row>
    </el-dialog>
    <el-dialog
    :visible.sync="specialListUpdateDialog"
    :close-on-click-modal="false"
    title=""
    max-height="300"
    width="30%">  
        <el-row>
            <el-col>
                <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="ruleForm1.type" placeholder="请选择活动区域" disabled>
                            <el-option label="会员" :value="1"></el-option>
                            <el-option label="测试" :value="2"></el-option>
                        </el-select>
                    </el-form-item>                                       
                    <el-form-item prop="timeType" ref="timeTypeValue2">
                        <el-radio-group v-model="ruleForm1.timeType" @change="selectTimeType">
                                <el-radio :label="item.timeType" v-for="(item,index) in timeTypeList" :key="index">{{item.name}}</el-radio>                            
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark" >
                        <el-input v-model="ruleForm1.remark" type="textarea" style="width:80%" :rows="4" maxlength="30"></el-input>
                        <span>{{ruleForm1.remark.length||0}}/30</span>
                    </el-form-item>                    
                    <el-form-item>
                        <el-button @click="resetDialog('update')">取消</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm1','update')">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-col>               
        </el-row>
    </el-dialog>   
    <el-dialog
    :visible.sync="specialListProhibitDialog"
    title=""
    max-height="300"
    width="20%">  
        <el-row>
            <el-col class="lCenter-r">
               确定要禁用这个用户吗
            </el-col> 
            <el-col class="lCenter-r lMarginTop30">
                <el-button @click="resetDialog('useOrNo')">取消</el-button>
                <el-button type="primary" @click="prohibit()">确定</el-button>               
            </el-col>                          
        </el-row>
    </el-dialog>  
</div>
</template>
<script>
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
        data(){
            return {
                pageAtion:{
                    pageTotal:0,
                    paginationPage:1
                },             
                tableData:[],
                titleList:[
                        {
                            name:'特殊账户',
                            pathInfo:'/specialAccount'
                        }
                ],   
                specialList:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:1,
                        label:'启用'
                    },
                    {
                        value:0,
                        label:'禁用'
                    }
                ],
                timeTypeList:[],
                loading:false,
                value:'',
                title:'',
                specialListAddDialog:false,
                specialListUpdateDialog:false,
                specialListProhibitDialog:false,
                pageSize:10,
                pageNo:1,
                dataList:{},
                flags:[],
                selectTimeTypeId:'',
                specialEvenBool:false,
                disabledState:false,
                ruleForm: {
                    cellphone: '',
                    type: '',
                    timeType: '',
                    remark:''
                    },
                    rules: {
                        cellphone: [
                            { required: true, message: '输入账号', trigger: 'blur' },
                            { min: 11,max: 11, message: '长度在11位位数', trigger: 'blur' }
                        ],
                        type: [
                            { required: true, message: '请选择类型', trigger: 'change' }
                        ],
                        timeType: [
                            { required: true, message: '请选择会员卡类型', trigger: 'change' }
                        ],
                        remark: [
                            { required: true, message: '请填写备注', trigger: 'blur' }
                        ]
                    },
                ruleForm1: {
                    type: '',
                    timeType: '',
                    remark:''
                    },
                    rules1: {
                        type: [
                            { required: true, message: '请选择类型', trigger: 'change' }
                        ],
                        timeType: [
                            { required: true, message: '请选择会员卡时间', trigger: 'change' }
                        ],
                        remark: [
                            { required: true, message: '请填写备注', trigger: 'blur' }
                        ]
                    }                    
            };
        },
        created() {
            let routes = this.$router.options.routes;
            let currentPath = this.$route.path;
            this.flags = this.$getPermissions(routes,currentPath);
            if(!this.flags){
                this.flags = [];
            }            
            this.getStudylist(1);
        },
        components:{
            breadcrumb
        },        
        methods: {
            //
            specialEven(val){
                if(val=='1'){
                    this.specialEvenBool=true;
                    this.getSpecualList();
                    // this.$refs["ruleForm"].validateField('timeType');
                }else{
                    // this.$refs["ruleForm"].clearValidate('timeType');
                    this.timeTypeList=[];                    
                    this.specialEvenBool=false;
                }
            },
            //获取特殊账户类型；
            getSpecualList(){
                var self = this;
                    self.$http.get(self.$server.specialUserSpecialVIP).then(res=>{
                        if(res.status==200){
                            self.timeTypeList = res.content;
                        }
                    })
            },
            //初始化
            getStudylist(num){
                var self = this;
                if(num){
                    self.pageNo = num;
                }
                self.loading = true; 
                var params = {
                    pageSize:self.pageSize,
                    pageNo:self.pageNo,
                    cellphone:encodeURIComponent(self.title),
                    state:self.value                 
                };
                self.$http.get(self.$server.specialUserSelectPage(params)).then(res=>{
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
                        self.loading = false; 
                }
                    console.log(res);
                })            
            },            
            //操作
            specialOperate(type,data){
                var self = this;
                self.dataList = data;
                switch (type) {
                    case 'useOrNo':
                        if(data.state==1){
                            self.specialListProhibitDialog=true;
                        }else{
                                var parems = {
                                    timeType:self.ruleForm1.timeType
                                };
                                self.$http.post(self.$server.specialUserUp({id:self.dataList.id})).then(res=>{
                                    if(res.status==200){
                                        this.specialListAddDialog=false;
                                        self.getStudylist(1);
                                    }
                                })                            
                        }
                        break;
                    case 'update':
                        self.ruleForm1.cellphone=data.cellphone;
                        self.ruleForm1.type=data.type;
                        self.ruleForm1.timeType=data.timeType;
                        self.ruleForm1.remark=data.remark||'';
                        self.selectTimeTypeId = data.memberId||'';
                        self.timeTypeList=[];
                        self.getSpecualList();
                        self.specialListUpdateDialog=true;
                        break;      
                    case 'add':
                        self.ruleForm.cellphone='';
                        self.ruleForm.type='';
                        self.ruleForm.timeType='';
                        self.ruleForm.remark='';
                        self.selectTimeTypeId ='';
                        self.specialListAddDialog=true;
                        break; 
                    case 'query':
                        self.getStudylist(1);
                        break;                                                                                 
                    default:
                        break;
                }
            },
            selectTimeType(val){
                var self = this;
                self.timeTypeList.map((item,index)=>{
                    if(item['timeType']==Number(val)){
                        self.selectTimeTypeId = item.memberId;
                    }
                });
                console.log(val);
                console.log(self.selectTimeTypeId);
            },
            //禁用提示
            prohibit(){
                var self = this;
                    self.$http.post(self.$server.specialUserDown({id:self.dataList.id})).then(res=>{
                        if(res.status==200){
                            self.specialListProhibitDialog=false;
                            self.getStudylist(1);
                        }
                    }) 
            },
            //表单提交
            submitForm(formName,type) {
                var self= this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        switch (type) {
                            case 'add':
                                var parems = {
                                    cellphone:encodeURIComponent(self.ruleForm.cellphone),
                                    type:self.ruleForm.type,
                                    remark:self.ruleForm.remark,
                                    timeType:self.specialEvenBool?self.ruleForm.timeType:5,
                                    memberId:self.specialEvenBool?self.selectTimeTypeId:''
                                };
                                if(!self.disabledState){
                                    self.disabledState = !self.disabledState;                                 
                                    self.$http.post(self.$server.specialUserAdd,parems).then(res=>{
                                        if(res.status==200){
                                            self.disabledState = !self.disabledState;
                                            this.specialListAddDialog=false;
                                            self.getStudylist(1);
                                        }
                                    }).catch(()=>{
                                        self.disabledState = !self.disabledState;
                                    })
                                }  
                                break;
                            case 'update':
                                var parems = {
                                    cellphone:self.ruleForm1.cellphone,
                                    timeType:self.ruleForm1.timeType,
                                    memberId:self.selectTimeTypeId,
                                    remark:self.ruleForm1.remark
                                };
                                if(!self.disabledState){
                                    self.disabledState = !self.disabledState;                                 
                                    self.$http.post(self.$server.specialUserEdit({id:self.dataList.id}),parems).then(res=>{
                                        if(res.status==200){
                                            self.disabledState = !self.disabledState;
                                            this.specialListAddDialog=false;
                                            self.getStudylist(1);
                                        }
                                      }).catch(()=>{
                                        self.disabledState = !self.disabledState;
                                    })
                                }                         
                                this.specialListUpdateDialog=false;
                                break;                        
                            default:
                                break;
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetDialog(type) {
                var self = this;
                switch (type) {
                    case 'useOrNo':
                        this.specialListProhibitDialog=false;
                        break;
                    case 'update':
                        this.specialListUpdateDialog=false;
                        break;      
                    case 'add':      
                        self.ruleForm.cellphone='';  
                        self.ruleForm.type='';
                        self.ruleForm.timeType='';
                        self.ruleForm.remark='';                                  
                        this.specialListAddDialog=false;
                        break;                                                                                 
                    default:
                        break;
                }
            },
            //赛选状态
            chooseVersionType(){},             
            //分页
            childPageValue(num){
                if(Number(num)>0){
                    this.getStudylist(Number(num))
                }                
            }            
        }
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
</style>


