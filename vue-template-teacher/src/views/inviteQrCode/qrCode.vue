<template>
    <div>   
        <div v-if="!codeListBool">   
            <el-row class="lLine40 headerDiv">
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col> 
                <el-col class="lMarginTop20">
                    <el-row :gutter="3">
                        <el-col :span="5">
                            <div class="iSeachEven">
                                <el-input v-model.trim="title"
                                        placeholder="请输入邀请码标题"
                                        class="search-form"
                                        width="100%"
                                        maxlength="20"
                                        @keyup.native="proving1"
                                        ></el-input>
                            </div>
                        </el-col>
                        <el-col :span="15">
                            <div class="dataTimeBox fl">
                                <el-date-picker
                                v-model="startTime"
                                type="date"
                                placeholder="开始时间">
                                </el-date-picker>
                                <el-date-picker
                                v-model="endTime"
                                type="date"
                                placeholder="结束时间">
                                </el-date-picker>                    
                            </div>          
                            <el-button v-if="$authJudge('market:invitationcode:select')" class="redBackColor butColorF lMarginL10" @click="seach">查询</el-button>
                        </el-col>  
                        <el-col :span="4" class="lRight-r">
                            <el-button v-if="$authJudge('market:invitationcode:add')" class="lSize14-i redBackColor butColorF" @click="creaNewCode">生成新的邀请码</el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="headerDiv">
                <el-col class="lLeft-r lMarginBO20">
                    <span class="lMarginL30 lSize14">共有{{allCodeListNum}}条记录</span>
                </el-col>
                <el-col>
                    <el-table
                    :data="tableData"
                    border
                    style="width: 100%"
                    v-loading="loading"
                    :header-cell-style="tableHeaderColor">
                    <el-table-column
                        prop="title"
                        label="邀请码标题"
                        align="center"
                        min-width="120"
                        :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        label="数量"
                        align="center"
                        min-width="70"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="usedNum"
                        min-width="70"
                        align="center"
                        label="已使用"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="courseName"
                        label="课程"
                        align="center"
                        min-width="100"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="有效期"
                        align="center"
                        min-width="320"
                        :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-row :gutter="10" class="lLine40"> 
                                    <el-col class="lCenter-r" :span="11">
                                        {{scope.row.beginTime}}                                  
                                    </el-col>
                                    <el-col class="lCenter-r" :span="2">
                                        --                                   
                                    </el-col>
                                    <el-col class="lCenter-r" :span="11">
                                    {{scope.row.endTime}}                                    
                                    </el-col>                                   
                                </el-row>                                                      
                            </template>                     
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        align="center"
                        min-width="100"
                        label="操作状态"
                        show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col>
                                            {{scope.row.operationState==1?'禁用':'启用'}}                              
                                    </el-col>                                  
                                </el-row>                                                      
                            </template>                        
                    </el-table-column>
                    <!-- prop="linkUrl" -->
                    <el-table-column
                        label="邀请码地址"
                        align="center"
                        min-width="150">
                        <template slot-scope="scope">
                            <el-row>
                                <el-col v-if="$authJudge('market:invitationcode:copylink')"> 
                                    <el-button class="black-btn" type="text" v-if="urlScienceBools===2" :class="`copyurl${scope.row.id}`"  @click="copyUrl(scope.row.id)">复制链接</el-button>
                                    <el-button class="black-btn" type="text" v-else :class="`copyurl${scope.row.id}`"  @click="copyUrl(scope.row.id)">复制链接</el-button> 
                                    <input type="text" :id="`copyurl${scope.row.id}`" style="opacity:0;position: absolute;">                                      
                                </el-col>
                            </el-row>                            
                            </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="150"
                        fixed="right"
                        :render-header="renderHeader"
                        show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-row :gutter="10"> 
                                    <el-col :span="8" v-if="$authJudge('market:invitationcode:export')">
                                        <el-button type="text" class="black-btn" @click="channeExport(scope.row)">导出</el-button>                                    
                                    </el-col>
                                    <el-col :span="8" v-if="$authJudge('market:invitationcode:record')">
                                        <el-button type="text" class="black-btn" @click="channeRecord(scope.row)">记录</el-button>                                    
                                    </el-col>
                                    <el-col :span="8">
                                        <el-button v-if="$authJudge('market:invitationcode:open')" v-show="scope.row.operationState==1" type="text" class="black-btn" @click="channeDelete(scope.row)">启用</el-button>   
                                        <el-button v-if="$authJudge('market:invitationcode:forbidden')" v-show="scope.row.operationState!=1" type="text" class="black-btn" @click="channeDelete(scope.row)">禁用</el-button>                                                                     
                                    </el-col>   
                                    <el-col :span="8" v-if="$authJudge('market:invitationcode:activate')">
                                        <el-button type="text" class="black-btn" @click="channeActivation(scope.row)">激活</el-button>                                    
                                    </el-col>                                                                    
                                </el-row>                                                      
                            </template>                    
                    </el-table-column>                                                              
                    </el-table>                 
                </el-col>
                <el-col class="lMarginTop30 lCenter-r">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
                </el-col>             
            </el-row>
        </div>  
        <div v-if="codeListBool">
            <el-row class="headerDiv">
                <el-col>
                    <el-row :gutter="15">
                        <el-col class="lSize16-i lMarginBO30 lMarginTop20">
                            <el-row>
                                <el-col :span="3" class="lCenter-r">邀请码记录</el-col>
                                <el-col :span="3" :offset="18" class="lCenter-r">
                                    <el-button @click="codeEven">返回</el-button>
                                </el-col>    
                            </el-row>
                        </el-col>                        
                        <el-col :span="6" class="lMarginBO20">
                                <el-input v-model="inputReactCode" @keyup.native="proving" placeholder="请输入邀请码或使用账号"></el-input>
                        </el-col>
                        <el-col :span="3" class="lMarginBO20">
                            <el-select v-model="reactCodeSattes" placeholder="请选择">
                                <el-option
                                v-for="item in optionsReact"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>                            
                        </el-col>
                        <el-col :span="2" class="lMarginBO20"><el-button class="redBackColor butColorF" @click="seachReact">查询</el-button></el-col>
                        <el-col :span="4" :offset="9" class="lCenter-r lMarginBO20 lLine40">
                            <span class="lMarginL30 lSize14">共有{{allCodeReactListNum}}条记录</span>
                        </el-col>                        
                    </el-row>
                </el-col>
                <el-col>
                    <el-table
                        :data="tableDataRecord"
                        border
                        v-loading="loading1"
                        style="width: 100%">
                        <el-table-column
                            prop="code"
                            label="邀请码"
                            align="center"
                            min-width="150"
                            :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column
                            prop="courseName"
                            label="使用课程"
                            align="center"
                            min-width="100"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="receivePhone"
                            min-width="100"
                            align="center"
                            label="领用帐号"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="usePhone"
                            align="center"
                            label="使用帐号"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            label="状态"
                            min-width="160"
                            align="center"
                            :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-row :gutter="10"> 
                                    <el-col v-if="scope.row.status==0" class="lCenter-r">未领用</el-col>  
                                    <el-col v-else-if="scope.row.status==1" class="lCenter-r">未使用</el-col>                                 
                                    <el-col v-else class="lCenter-r">已使用</el-col>
                                </el-row>                                                      
                            </template>                            
                        </el-table-column>
                        <el-table-column
                            prop="useTime"
                            align="center"
                            label="使用时间"
                            min-width="100"
                            show-overflow-tooltip>
                        </el-table-column>                                                             
                    </el-table>                                                          
                </el-col>
                <el-col class="lMarginTop30 lCenter-r">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValueNext"
                        :current-page.sync="pageAtionNext.paginationPage"
                        :total="pageAtionNext.pageTotal">
                    </el-pagination>
                </el-col>                
            </el-row>    
        </div>
        <el-dialog
        :visible.sync="centerDialogCerat"
        :close-on-click-modal='false'
        title="生成邀请码"
        max-height="300"
        width="35%">  
            <el-row class="lSize16 ruleFormCss">
                <el-col>
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="标题:" prop="title">
                            <el-input type="text" maxlength="50" v-model="ruleForm.title" ></el-input>
                            <p class="lSize12">限50个字符以内，标题不能重复</p>
                        </el-form-item>
                        <el-form-item label="生成数量:" prop="num">
                            <el-input type="text" v-model="ruleForm.num" style="width:30%;"></el-input>
                            <p class="lSize12">单次生成不超过5000个</p>
                        </el-form-item>
                        <el-form-item label="批次码:" prop="batchCode">
                            <el-input type="text" maxlength="3" v-model="ruleForm.batchCode" style="width:30%;"></el-input>
                            <p class="lSize12">批次码由3位字母组成，不能重复</p>
                        </el-form-item>
                         <!-- prop="courseId" -->
                        <el-form-item label="课程:">
                            <el-row :gutter="5">
                                <el-col :span="4" class="lLeft-"><el-button type="text" @click="courseChooseEven" class="greenColor">请选择</el-button></el-col>
                                <el-col :span="10" class="lLeft-r redFontColor lSize12" v-show="courseIdBool">*请选择课程</el-col>
                            </el-row>
                            <el-row>
                                <el-col class="lLeft-r">{{courseChooseName}}</el-col>
                            </el-row>                            
                        </el-form-item>
                        <el-form-item label="开始时间:" prop="beginTime">
                            <el-date-picker
                            v-model="ruleForm.beginTime"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions0">
                            </el-date-picker> 
                            <p class="lSize12">年.月.日</p>                           
                        </el-form-item>
                        <el-form-item label="结束时间:" prop="endTime">
                            <el-date-picker
                            v-model="ruleForm.endTime"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions0"
                            >
                            </el-date-picker>   
                            <p class="lSize12">年.月.日</p>                          
                        </el-form-item>
                        <el-form-item label="备注" prop="description">
                            <el-input 
                            type="textarea" 
                            maxlength="500"
                            :autosize="{ minRows: 4}"
                            v-model="ruleForm.description"></el-input>
                            <p class="lSize12">限500字以内</p>
                        </el-form-item>
                        <el-form-item>
                            <el-button style="margin-left:35%;" class="redBackColor butColorF" @click="submitForm('ruleForm')">生成</el-button>
                        </el-form-item>                        
                    </el-form>                    
                </el-col>               
            </el-row>
        </el-dialog> 
        <el-dialog
        :visible.sync="dialogActivation"
        title="提示"
        max-height="300"
        width="35%">
            <el-row>
                <el-col class="lCenter-r">
                    确定要激活这个批次的所有邀请码吗？
                </el-col>
                <el-col class="lCenter-r lMarginTop30">
                    <el-button class="redBackColor butColorF" @click="codeIsOk()">确定</el-button>
                    <el-button class="redBackColor butColorF" @click="dialogActivation=false">取消</el-button>
                </el-col>
            </el-row>
        </el-dialog>        
        <el-dialog
        :visible.sync="centerDialogList"
        :close-on-click-modal='false'
        max-height="300"
        width="30%">
            <el-row>
                <el-col>
                    <div style="margin-bottom:20px; text-align: left;">
                        <el-radio-group 
                            v-model="checkedCities" @change="changePlugin">
                            <el-radio v-for="(city,index) in cities" :label="city.value" :key="index">{{city.name}}</el-radio>
                        </el-radio-group>                  
                    </div>                    
                     <el-row :gutter="20">
                        <el-col :span="18" class="lCenter-r">
                            <el-input v-model="inputCourse" placeholder="请输入内容"></el-input>
                        </el-col>
                        <el-col :span="6" class="lCenter-r">
                            <el-button class="redBackColor butColorF" @click="courseSeach">查找</el-button>
                        </el-col>                                                 
                     </el-row>
                </el-col>
                <el-col class="lMarginTop30">
                        <el-table
                            ref="multipleTable"
                            :data="tableDataCourse"
                            tooltip-effect="dark"
                            v-loading="loading2"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                            <el-table-column
                            type="selection"
                            :selectable="selectable"
                            width="55">
                            </el-table-column>
                            <el-table-column
                            prop="courseName"
                            align="center"
                            label="课程名称">
                            </el-table-column>
                            <el-table-column
                            align="center"
                            label="价格">
                            <template slot-scope="scope">
                                {{scope.row.sellingPrice||0}}币                                                      
                            </template>                             
                            </el-table-column>
                        </el-table>
                </el-col>
                <el-col class="lMarginTop20">
                    <el-row :gutter="20">
                        <el-col :span="5" class="lCenter-r" :offset="7">
                            <el-button class="redBackColor butColorF" @click="dialogIsNo(false)">取消选择</el-button>
                        </el-col>
                        <el-col :span="5" class="lCenter-r">
                            <el-button class="redBackColor butColorF" @click="courselistIsOkOrNo(true)">确定选择</el-button>
                        </el-col>
                    </el-row>
                </el-col>               
                <el-col class="lCenter-r lMarginTop30">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValueCourse"
                        :current-page.sync="pageAtionCourse.paginationPage"
                        :total="pageAtionCourse.pageTotal">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-dialog>                                                 
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
const secret_key = 'xueguoxue.com';
function encrypt(str, pwd) {
    if (pwd == null || pwd.length <= 0) {
      alert("Please enter a password with which to encrypt the message.");
      return null;
    }
    let prand = "";
    for (let i = 0; i < pwd.length; i++) {
      prand += pwd.charCodeAt(i).toString();
    }
    let sPos = Math.floor(prand.length / 5);
    let mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    let incr = Math.ceil(pwd.length / 2);
    let modu = Math.pow(2, 31) - 1;
    if (mult < 2) {
      alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
      return null;
    }
    let salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;
    while (prand.length > 10) {
      prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    let enc_chr = "";
    let enc_str = "";
    for (let i = 0; i < str.length; i++) {
      enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
      if (enc_chr < 16) {
        enc_str += "0" + enc_chr.toString(16);
      } else enc_str += enc_chr.toString(16);
      prand = (mult * prand + incr) % modu;
    }
    salt = salt.toString(16);
    while (salt.length < 8)salt = "0" + salt;
    enc_str += salt;
    return enc_str;
  }
export default {
    data(){ 
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {
                case "title":
                    var regExp =/^(?!.*\\.*$)/;
                    if(!self.isOKOrNoTwo){
                        if (!value) {
                            return callback(new Error('请填写标题'));
                            }
                            setTimeout(() => {
                            if (!regExp.test(value)) {
                                callback(new Error('不能输入"\\"特殊字符'));
                                
                            } else {
                                callback();
                            }
                        }, 300);
                    }else{
                        callback();
                    }                
                break;
                case "batchCode":
                    // var regExp = /^([A-Za-z]).*\1.*$/i;
                    // var repExp2 = /^[A-Za-z]+$/;
                    let regExp = /^[A-Za-z]{3}$/
                        if (!value) {
                            return callback(new Error('请填写批次'));
                        }
                        setTimeout(() => {
                            if (!regExp.test(value)) {
                                callback(new Error('批次码由3位字母组成'));
                            } else {
                                callback();
                            }
                        }, 300);                
                break;                
                case "beginTime":
                        if (value===""||Number(value)==0) {
                            return callback(new Error('请选择开始时间'));
                            }
                        setTimeout(() => {
                            if(this.ruleForm.endTime!=null&&this.ruleForm.endTime!=''&&Number(value)>Number(this.ruleForm.endTime)){
                                callback(new Error('开始时间不能大于结束时间'));
                            }else{
                                callback();
                            }
                        }, 300);
                break;
               case "endTime":
                        if (value===""||Number(value)==0) {
                            return callback(new Error('请选择结束时间'));
                            }
                        setTimeout(() => {
                            if(this.ruleForm.beginTime!=null&&this.ruleForm.beginTime!=''&&Number(value)<Number(this.ruleForm.beginTime)){
                                callback(new Error('结束时间不能小于开始时间'));
                            }else{
                                callback();
                            }
                        }, 300);
                break;                
                case "num":
                        if (value==="") {
                                return callback(new Error('生成数量'));
                            }
                            setTimeout(() => {
                                if (!Number.isInteger(Number(value))) {
                                    callback(new Error('请输入正整数字值'));
                                } else {
                                    if (Number(value)>5000||Number(value)<0) {
                                    callback(new Error('最多输入5000张'));
                                    } else {
                                    callback();
                                    }
                                }
                            }, 300);
                break;
                case "description":
                        if (!value) {
                            return callback(new Error('请填写备注'));
                            }else{
                                callback();
                            }
                break;                
            }
        };                                            
        return {
            title:'',
            tableData: [],
            tableDataRecord:[],
            value: '',
            textarea:'',
            input: '',
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },              
            pageAtionNext:{
                pageTotal:0,
                paginationPage:1
            }, 
            pageAtionCourse:{
                pageTotal:0,
                paginationPage:1                
            },         
            centerDialogCerat:false,
            centerDialogRecord:false,
            centerDialogList:false,
            codeListBool:false,
            pageNo:1,
            pageNoReact:1,
            pageNoCourse:1,
            pageSize:10,
            inputReactCode:'',
            reactCodeSattes:'',
            reactCodeId:'',
            allCodeListNum:'',
            allCodeReactListNum:'',
            courseIdBool:false,
            inputCourse:'',
            courseChooseName:'',
            urlScienceBools:1,
            disabledState:false,
            // linkUrlInfo:'',
            optionsReact:[
                {
                    value:'',
                    label:'全部'
                },                
                {
                    value:0,
                    label:'未领用'
                },
                {
                    value:1,
                    label:'未使用'                    
                },
                {
                    value:2,
                    label:'已使用'                    
                }
            ],
            ruleForm: {
                title:'',
                num:'',
                batchCode:'',
                courseId:'',
                beginTime:'',
                endTime:'',
                description:''
            },
            checkedCities:1,
            cities: [
                {
                    name:'自营课程',
                    value:1
                },
                {
                    name:'三方课程',
                    value:2
                }
            ],            
            rules: {
                title: [
                    {validator: checkAge, trigger: 'blur' }
                ],
                num: [
                    {validator: checkAge, trigger: 'blur' }
                ],
                batchCode: [
                    {validator: checkAge, trigger: 'blur' }
                ],
                courseId: [
                    {validator: checkAge, trigger: 'blur' }
                ],
                beginTime: [
                    {type: 'date',validator: checkAge, trigger: 'change' }
                ],
                endTime: [
                    {type: 'date',validator: checkAge, trigger: 'change' }
                ],
                description: [
                    {validator: checkAge, trigger: 'blur' }
                ]
            },
            pickerOptions0: {
                disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7; //  return time.getTime() < Date.now() - 8.64e6 如果没有后面的-8.64e6就是不可以选择今天的
                }
            },
            tableDataCourse: [],
            multipleSelection: [],
            copyUrlInfo:'',
            loading:false,
            loading1:false, 
            loading2:false,
            dialogActivation:false,
            titleList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'邀请码系统',
                            pathInfo:''
                        }
                ],
            selectData:'',
            startTime:null,
            endTime:null
        }
    },
    created(){
        if(this.environmenttarget=='prod'){
            this.urlScienceBools = 1;
        }else if(this.environmenttarget=='beta'){
            this.urlScienceBools = 2;
        }else{
            this.urlScienceBools = 1;
        };        
        this.getTableCodeList(1);
    },
    watch: {
        startTime: function(curVal,oldVal){
            var self = this;
            if(Number(self.endTime)<Number(curVal)){
                self.endTime = null;
            }
        },
        endTime: function(curVal,oldVal){
            var self = this;
            if(Number(self.startTime)>Number(curVal)){
                self.endTime = null;
            }
        }        
    },    
    components:{
        breadcrumb
    },    
    methods:{
        changePlugin(){
            this.tableDataCourse = []             
            this.getTableCourse(1);
        },         
        renderHeader (h,{column}) {
            return h(
                'div',{
                style:'display:flex;margin:auto;'
                },
                [
                h('span', column.label),
                h('tipsInfo', {
                    props: {
                    messages: [
                        `激活:生成一批邀请码后默认只能通过“复制链接”的方式去激活邀请码(激活后状态变为未使用),`,`
                         但为了配合运营活动，添加一个激活操作，强制激活该批次邀请码，邀请码激活后，状态全部`,`为未使用`
                    ]}
                })
                ]
            )
        },   
        dialogIsNo(){
            this.$refs.multipleTable.clearSelection();
        },
        //复制
       copyUrl(id){ 
             var self = this;
            switch (this.urlScienceBools) {
                case 1:
                    self.copyUrlInfo = "https://xgxm.xueguoxue.com/h5/receiveInviteCode/index.html?key="+encrypt(id+'',secret_key)
                    var input = document.querySelector('#copyurl'+id);
                        input.value = self.copyUrlInfo;
                        input.select();
                        if (document.execCommand('copy')) {
                            document.execCommand('copy');
                            self.$message.success({ message: "复制成功" });
                        }
                    break;
                case 2:
                    self.copyUrlInfo = "https://scm.youfushuyuan.com/h5/receiveInviteCode/index.html?key="+encrypt(id+'',secret_key)
                    var input = document.querySelector('#copyurl'+id);
                        input.value = self.copyUrlInfo;
                        input.select();
                        if (document.execCommand('copy')) {
                            document.execCommand('copy');
                            self.$message.success({ message: "复制成功" });
                        }   
                    break;        
                default:
                    console.log("地址有误");
                    break;
            } 
        },          
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #F3F3F3;font-weight: 500;font-size: 16px;'
            }
        },        
        selectable(row, index){
            if(this.multipleSelection.length <1){
                    return true;
            }
        },
        courselistIsOkOrNo(bools) {
            if (bools) {
                this.ruleForm.courseId = this.multipleSelection[0].courseId;
                this.courseChooseName = this.multipleSelection[0].courseName;
                this.centerDialogList = false;
                this.courseIdBool = false;
            } else {
                this.$refs.multipleTable.clearSelection();
                this.centerDialogList = false;
                this.courseIdBool = false;
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },        
        courseChooseEven(){
            this.getTableCourse(1);
            this.centerDialogList = true;
        },
        courseSeach(){
            this.getTableCourse(1);
        },    
        getTableCourse(num){
           var self = this;
            if(num){
                self.pageNoCourse = num;
            }   
            let query = {
                params:{
                    courseName:self.inputCourse,
                    pageSize:self.pageSize,
                    pageNo:self.pageNoCourse,
                    courseSource:this.checkedCities
                }
            }            
            self.loading2 = true; 
            self.$http.get(self.$server.invitationCodeCourses,query).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   self.allCodeReactListNum = contentdate.total;
                   if(contentdate.list.length){
                       if(!nextPage&&prePage!=0){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = (prePage+1)*10+index+1;
                                return element;
                            });
                        }else if(!prePage&&!nextPage){
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
                    self.tableDataCourse = listIds;
                    self.pageAtionCourse.pageTotal = contentdate.total;
                    self.pageAtionCourse.paginationPage = num;
                    self.loading2 = false; 
               }
            }).catch((err)=>{
                self.loading2 = false;
            })            
        },
        submitForm(formName) {
            var self = this;
            if(!this.ruleForm.courseId){
                this.courseIdBool = true;
                return;
            }else{
                this.courseIdBool = false;
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                /*
                        title 标题
                        num 生成数量
                        batchCode 批次
                        courseId 课程id
                        beginTime 开始时间
                        endTime 结束时间
                        linkUrl 链接
                        description 描述     
                        self.formatDate(self.ruleFormEdit.useTimeNext)           
                */      
                    var self = this;
                    var params = {
                        title:self.ruleForm.title,
                        num:self.ruleForm.num,
                        batchCode:self.ruleForm.batchCode,
                        courseId:self.ruleForm.courseId,
                        beginTime:self.formatDate(self.ruleForm.beginTime),
                        endTime:self.formatDate(self.ruleForm.endTime),
                        description:self.ruleForm.description,
                    };          
                    if(!self.disabledState){
                        self.disabledState = !self.disabledState;
                        self.$http.post(self.$server.invitationCodeAdd,params).then(res=>{
                                    if(res.status==200){
                                        self.centerDialogCerat = false;
                                        self.disabledState = !self.disabledState;
                                        self.$message.success({ message: "生成成功" });
                                        self.getTableCodeList(1);
                                    }
                        })              
                        .catch(res => {
                            self.disabledState = !self.disabledState;
                        });
                    }
 
                } else {
                    console.log('error submit!!');
                    return false;
                }
        });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },        
        proving(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.inputReactCode)){
                this.inputReactCode='';
            }            
        },        
        getTableCodeList(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true;
            var params = {
                pageNo:self.pageNo,
                pageSize:self.pageSize,
                keyWord:self.title,
                startTime:self.formatDate(self.startTime,'hms',"start"),
                endTime:self.formatDate(self.endTime,'hms','end')                
            };
            self.loading = true;
            self.$http.get(self.$server.invitationCodeList(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   self.allCodeListNum = contentdate.total;
                   if(contentdate.list.length){
                       if(!nextPage&&prePage!=0){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = (prePage+1)*10+index+1;
                                return element;
                            });
                        }else if(!prePage&&!nextPage){
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
            }).catch((err)=>{
                self.loading = false;
            })                                    
        },
        getTableCodeListRecord(num){
            var self = this;
            if(num){
                self.pageNoReact = num;
            }
            var params = {
                pageNo:self.pageNoReact,
                pageSize:self.pageSize,
                id:self.reactCodeId,
                keyWord:self.inputReactCode,
                status:self.reactCodeSattes
            };
            self.loading1 = true;
            self.$http.get(self.$server.invitationCodeDetail(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   self.allCodeReactListNum = contentdate.total;
                   if(contentdate.list.length){
                       if(!nextPage&&prePage!=0){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = (prePage+1)*10+index+1;
                                return element;
                            });
                        }else if(!prePage&&!nextPage){
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
                    self.tableDataRecord = listIds;
                    self.pageAtionNext.pageTotal = contentdate.total;
                    self.pageAtionNext.paginationPage = num;
                    self.loading1 = false; 
               }
                console.log(res);
            }).catch((err)=>{
                self.loading1 = false;
            })                                    
        },        
        codeIsOk(){
            var parems = {
                id:this.selectData.id
            };
            this.$http.post(this.$server.invitationCodeActivation(parems)).then(res=>{
                if(res.status==200){
                    this.dialogActivation = false;
                    this.$message.success({ message: "激活成功" });
                }else{
                    this.dialogActivation = false;
                    this.$message.error(res.message);
                }
            })
        },
        proving1(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.title)){
                this.title='';
            }            
        },
        creaNewCode(data){
            this.ruleForm={
                title:'',
                num:'',
                batchCode:'',
                courseId:'',
                beginTime:'',
                endTime:'',
                description:''
            };            
            this.courseChooseName = '';
            this.centerDialogCerat = true;
        },
        download2(url) {
            try{ 
                    var elemIF = document.createElement("iframe");   
                    elemIF.src = url;   
                    elemIF.style.display = "none";   
                    document.body.appendChild(elemIF);   
                }catch(e){ 
                    zzrw.alert("下载异常！");
                }
        },        
        channeExport(rows){
            var self = this;
            // console.log(rows);
            var parems = {
                token:getToken(),
                id:rows.id
            };
            self.download2(self.$server.invitationCodeExport(parems));    
        },        
        channeRecord(rows){
            this.selectData = rows;
            this.reactCodeId = rows.id;
            this.getTableCodeListRecord(1);
            this.codeListBool = true;
        },
        codeEven(){
            this.codeListBool = false;
        },
        channeActivation(rows){
            this.selectData = rows;
            this.dialogActivation = true;
        },
        channeDelete(rows){
            var self = this;
            var starts = '';
            this.selectData = rows;
            if(Number(rows.operationState)==1){
                starts = 2;
            }else{
                starts = 1;
            }
            var parems = {
                id:Number(rows.id),
                status:starts
            }
            self.$http.post(self.$server.invitationCodeStatus(parems)).then(res=>{
                        if(res.status==200){
                            self.getTableCodeList(1);
                        }
            })             
        },
        channeRemoveBatch(rows){
            this.centerDialogVisible = true;
        },
        seach(){
            this.getTableCodeList(1)
        },
        seachReact(){
            this.getTableCodeListRecord(1);
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getTableCodeList(Number(num))
            }            
        },
        childPageValueNext(num){
            if(Number(num)>0){
                this.getTableCodeListRecord(Number(num))
            } 
        },
        childPageValueCourse(num){
            if(Number(num)>0){
                this.getTableCourse(Number(num))
            }
        },     
        //待审核
        allDialogIsNo(num){
            var self = this;
            switch (num) {
                case 1:
                    self.centerDialogExamine = false;
                    self.centerDialogReject = true;
                    break;
                case 2:
                    self.centerDialogReject = false;
                    break;                                                                                          
                default:
                    break;
            }
        },
        formatDate(date,datebool,type){
            if(date){
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                var h=date.getHours();
                var m1=date.getMinutes();
                var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;    
                if(datebool=='hms'){
                    if(type=="start"){
                        h = h<10?("0"+h):h;
                        m1 = m1<10?("0"+m1):m1;
                        s = s<10?("0"+s):s;
                    }else{
                        h = 23;
                        m1 = 59;
                        s = 59;
                    }                    
                    return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
                }else{
                    return y+"-"+m+"-"+d;
                }
                
            }else{
                return '';
            }
        }           
    },
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px; 
    margin-bottom: 10px;     
}
.has-gutter th.el-table-column--selection .cell{
    display: none;
}
</style>


