<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col class="lRight-r">
                <el-row class="lSize18">
                    <el-col :span="8" class="lLeft-r">
                        <breadcrumb :menuList ='titleList'></breadcrumb>
                    </el-col>                    
                    <!-- <el-col v-if="$authJudge('integral:source:add')" :span="3" :offset="13"><el-button class="redBackColor butColorF" @click="creatlearnCard">添加积分来源</el-button></el-col> -->
                </el-row>
            </el-col>
        </el-row>  
        <el-row>
            <el-col>
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        prop="sourceName"
                        label="积分来源"
                        align="center"
                        min-width="40">
                    </el-table-column>
                    <el-table-column
                        label="积分数"
                        align="center"
                        min-width="50">
                        <template slot-scope="scope">
                            <el-row> 
                                <el-col v-if="scope.row.singleNum>0">
                                    +{{scope.row.singleNum}}
                                </el-col> 
                                <el-col v-else>
                                    -{{scope.row.singleNum}}
                                </el-col>                                 
                            </el-row>                                                      
                        </template>                        
                    </el-table-column>                    
                    <el-table-column
                        prop="times"
                        label="获取次数"
                        align="center"
                        min-width="50"
                        >
                    </el-table-column>
                    <el-table-column
                        label="限制频率"
                        align="center"
                        min-width="60">
                        <template slot-scope="scope">
                            <el-row> 
                                <el-col v-if="scope.row.frequency==1">
                                    {{'不限'}}
                                </el-col>                                                                                               
                                <el-col v-else-if="scope.row.frequency==2">
                                   {{'仅一次'}}
                                </el-col>
                                <el-col v-else>
                                   {{'每日'}}
                                </el-col>                                
                            </el-row>                                                      
                        </template>                        
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="30"
                        >
                        <template slot-scope="scope">
                            <el-row> 
                                <el-col :span="11" v-if="$authJudge('integral:source:edit')">
                                    <el-button type="text" class="black-btn" @click="channeUpdateEven(scope.row)">编辑</el-button>
                                </el-col>                                                                                               
                                <el-col :span="11" :offset="2">
                                    <!-- isForbidden -->
                                    <el-button v-if="$authJudge('integral:source:open')" v-show="scope.row.isForbidden==1" type="text" class="black-btn lCenter-r" @click="channeRemoveBatch(scope.row)">启用</el-button>
                                    <el-button v-if="$authJudge('integral:source:forbidden')" v-show="scope.row.isForbidden!=1" type="text" class="black-btn lCenter-r" @click="channeRemoveBatch(scope.row)">禁用</el-button>
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
               <!-- operationTypeId:'',//来源id
              singleNum:'',//可获取数量
              times:'',//获取次数
              frequency:'',//频率
              useTime:''//生效时间 
            "operationTypeId": 2,
               "name": "课程购买" 
               -->
        <el-dialog :title="'创建积分来源'" width="30%" :visible.sync="dialogTableVisible" :close-on-click-modal='false'>
                        <el-row class="lLine20">
                            <el-col class="lLeft-r">
                                建议：用户注册、选择兴趣、完善资料限制频率：仅一次；其他可自由配置，积分来源如有修改请告知技术人员；
                            </el-col>
                            <el-col class="lCenter-r lMarginTop10">
                                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                                    <el-form-item label="积分来源名称:" prop="operationTypeId">
                                        <el-row>
                                            <el-col class="lLeft-r">
                                                <el-select v-model="ruleForm.operationTypeId" placeholder="请选择">
                                                    <el-option
                                                    v-for="item in options"
                                                    :key="item.operationTypeId"
                                                    :label="item.name"
                                                    :value="item.operationTypeId">
                                                    </el-option>
                                                </el-select>                                               
                                            </el-col>
                                        </el-row>                                       
                                    </el-form-item>                                 
                                    <el-form-item label="获取积分数:" prop="singleNum">
                                        <el-row>
                                            <el-col :span="20">
                                                <el-input v-model.trim="ruleForm.singleNum"
                                                    placeholder="1-100"
                                                    class="search-form"
                                                    maxlength="3"
                                                    width="100%"></el-input>                                                 
                                            </el-col>
                                        </el-row>                                      
                                    </el-form-item>
                                    <el-form-item label="限制获取频率:" prop="frequency">
                                        <el-row>
                                            <el-col class="lLeft-r">
                                                <el-select v-model="ruleForm.frequency" @change="selectChangeType" placeholder="请选择">
                                                    <el-option
                                                    v-for="item in optionsType"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                    </el-option>
                                                </el-select>                                                    
                                            </el-col>
                                        </el-row>                                      
                                    </el-form-item>  
                                    <el-form-item label="获取次数:" prop="times">
                                        <el-row>
                                            <el-col :span="20">
                                                <el-input v-model.trim="ruleForm.times"
                                                    :placeholder="placeholders"
                                                    class="search-form"
                                                    :disabled="inputDisabled"
                                                    maxlength="4"
                                                    width="100%"></el-input>                                                 
                                            </el-col>  
                                        </el-row>                                      
                                    </el-form-item>                                     
                                    <el-form-item label="积分可使用时间:" prop="useTime">
                                        <el-row>
                                            <el-col>
                                                <el-radio-group v-model="radio" @change="changeRadio">
                                                    <el-row>
                                                        <el-col class="lLeft-r">
                                                            <el-radio :label="1">立即生效</el-radio>
                                                        </el-col>
                                                        <el-col class="lLeft-r lMarginTop20">
                                                            <el-radio :label="2">    
                                                                <el-date-picker
                                                                v-model="ruleForm.useTime"
                                                                :disabled="dataDisabled"
                                                                type="date"
                                                                placeholder="选择日期">
                                                                </el-date-picker>
                                                            </el-radio>
                                                        </el-col>                                                     
                                                    </el-row>
                                                </el-radio-group>
                                             </el-col>
                                        </el-row>                                        
                                    </el-form-item>                                                                                                          
                                </el-form>
                            </el-col>
                        </el-row>                        
                        <el-row  class="lLine30 lMarginTop40">
                            <el-col class="lCenter-r">
                                <el-button @click="isNoEven()">取 消</el-button>
                                <el-button class="redBackColor butColorF" @click="isOkEven('ruleForm')">确 定</el-button>                        
                            </el-col>                        
                        </el-row>
        </el-dialog>        
        <!--  singleNum:'',//可获取数量
              times:'',//获取次数
              frequency:'',//频率
              useTime:'',//生效时间
              id:''//id -->
        <el-dialog
        :visible.sync="centerDialogVisible"
        :close-on-click-modal='false'
        title="编辑"
        width="30%">  
            <el-row class="lLine30">
                <el-col class="lCenter-r">
                    <el-form :model="ruleFormEdit" :rules="rulesEdit" ref="ruleFormEdit" label-width="130px" class="demo-ruleForm">
                        <el-form-item label="积分来源名称:" prop="operationTypeId">
                            <el-row>
                                <el-col class="lLeft-r">
                                    <el-select disabled v-model="ruleFormEdit.operationTypeId" placeholder="请选择">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.operationTypeId"
                                        :label="item.name"
                                        :value="item.operationTypeId">
                                        </el-option>
                                    </el-select> 
                                </el-col>
                            </el-row>                                       
                        </el-form-item>                                 
                        <el-form-item label="获取积分数:" prop="singleNumNext">
                            <el-row>
                                <el-col :span="20">
                                    <el-input v-model.trim="ruleFormEdit.singleNumNext"
                                        class="search-form"
                                        maxlength="3"
                                        width="100%"></el-input>                                                 
                                </el-col>
                            </el-row>                                      
                        </el-form-item>
                        <el-form-item label="限制获取频率:" prop="frequencyNext">
                            <el-row>
                                <el-col class="lLeft-r">
                                    <el-select v-model="ruleFormEdit.frequencyNext" placeholder="请选择" @change="selectChangeTypeNext">
                                        <el-option
                                        v-for="item in optionsType"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>                                                 
                                </el-col>
                            </el-row>                                      
                        </el-form-item>  
                        <el-form-item label="获取次数:" prop="timesNext">
                            <el-row>
                                <el-col :span="20">
                                    <el-input v-model.trim="ruleFormEdit.timesNext"
                                        class="search-form"
                                        :placeholder="placeholdersNext"
                                        :disabled="inputDisabledNext"
                                        maxlength="4"
                                        width="100%"></el-input>                                                 
                                </el-col> 
                            </el-row>                                      
                        </el-form-item> 
                        <el-form-item label="积分可使用时间:" prop="useTimeNext">
                            <el-row>
                            <el-col>
                                <el-radio-group v-model="radioNext" @change="changeRadioNext">
                                    <el-row>
                                        <el-col class="lLeft-r">
                                            <el-radio :label="1">立即生效</el-radio>
                                        </el-col>
                                        <el-col class="lLeft-r lMarginTop20">
                                            <el-radio :label="2">    
                                                <el-date-picker
                                                v-model="ruleFormEdit.useTimeNext"
                                                :disabled="dataDisabledNext"
                                                type="date"
                                                placeholder="选择日期">
                                                </el-date-picker>
                                            </el-radio>
                                        </el-col>                                                     
                                    </el-row>
                                </el-radio-group>
                            </el-col>
                        </el-row>                                    
                        </el-form-item>                                                                                                          
                    </el-form>
                </el-col>
            </el-row>                        
            <el-row  class="lLine30 lMarginTop40">
                <el-col class="lCenter-r">
                    <el-button @click="isChannelNoEven()">取 消</el-button>
                    <el-button class="redBackColor butColorF" @click="isChannelOkEven('ruleFormEdit')">确 定</el-button>                        
                </el-col>                        
            </el-row>            
        </el-dialog>    
        <el-dialog
        title=""
        :visible.sync="channelDelDialogVisible"
        width="30%"
        > 
            <el-row class="lLine30">
                <el-col class="lCenter-r">{{isStart==0?'确定要禁用这个积分来源吗':'确定要启用这个积分来源吗'}}</el-col>
            </el-row>                         
            <el-row  class="lLine30 lMarginTop40">
                <el-col class="lCenter-r">
                    <el-button @click="isChannelNoEvenTwo()">取 消</el-button>
                    <el-button class="redBackColor butColorF" @click="isChannelOkEvenTwo()">确 定</el-button>                        
                </el-col>                        
            </el-row>                    
        </el-dialog> 
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){
 var checkAge = (rule, value, callback) => {
            var self = this;
            //   1到100; /^([1-9]\d?|100)$/
            //   1到1000 /^(?:[0-9]{1,3}|1000)$/
            switch (rule.fullField) {
                case "singleNum":
                case "singleNumNext":
                    // let regExpSingle = /^([1-9]\d?|100)$/g; //
                    let regExpSingle = /^(1|([1-9]\d{0,1})|100)$/g;
                    if (value===""||value==0) {
                        return callback(new Error('请输入获取积分数'));
                    }else{
                        if(!regExpSingle.test(value)){
                            callback(new Error('获取积分数只能在1到100的整数'))
                        }else{
                            callback()
                        }
                    }
                break;   
                case "useTime":
                    if (self.radio==1) {
                        callback()
                    }else{
                        if (value===""||value==0) {
                            return callback(new Error('请选择可使用时间'));
                        }else{
                            callback()
                        }
                    }
                break;                 
                case "times":
                    let regExpTimesNext = /^(?:[0-9]{1,3}|1000)$/;
                    if(self.timesBool){
                        if (value==="") {
                            return callback(new Error('请输入获取积分数'));
                        }else{
                            if(!regExpTimesNext.test(value)){
                                callback(new Error('获取次数只能在1到1000的整数'))
                            }else{
                                callback()
                            }
                        }
                    }else{
                        callback();
                    }
                break;  
                case "useTimeNext":
                    if (self.radioNext==1) {
                        callback()
                    }else{
                        if (value===""||value==0) {
                            return callback(new Error('请选择可使用时间'));
                        }else{
                            callback()
                        }
                    }
                break;                 
                case "timesNext":
                    let regExpTimes = /^(?:[0-9]{1,3}|1000)$/;
                    if(self.timesBoolNext){
                        if (value==="") {
                            return callback(new Error('请输入获取积分数'));
                        }else{
                            if(!regExpTimes.test(value)){
                                callback(new Error('获取次数只能在1到1000的整数'))
                            }else{
                                callback()
                            }
                        }
                    }else{
                        callback();
                    }
                break;                                                                           
            }
        };                        
        return {
            tableData: [],
            pageNo:1,
            pageSize:10, 
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },       
            centerDialogVisible: false,
            dialogTableVisible:false,
            channelDelDialogVisible:false,
            channelIDInfo:'',
            channelIDs:"",
            channelnewName:'',
            value:"",
            isStart:0,
            //   title:'',
            ruleForm: {
                operationTypeId:'',//来源id
                singleNum:'',//可获取数量
                times:0,//获取次数
                frequency:1,//频率
                useTime:''//生效时间
            },
            ruleFormEdit: {
                singleNumNext:'',//可获取数量
                timesNext:0,//获取次数
                frequencyNext:1,//频率
                useTimeNext:'',//生效时间
                id:''//id
            },          
            rules: {
                operationTypeId:[{ required: true, trigger: 'blur',message: '请选择积分来源' }],
                singleNum:[{ required: true, validator:checkAge, trigger: 'blur' }],
                times:[{validator:checkAge, trigger: 'blur' }],
                frequency:[{ required: true, trigger: 'blur' }],         
                useTime:[{ validator:checkAge, trigger: 'blur' }]                 
            },
            rulesEdit: {
                singleNumNext:[{ required: true,validator:checkAge, trigger: 'blur' }],
                timesNext:[{validator:checkAge, trigger: 'blur' }],
                frequencyNext:[{ required: true, trigger: 'blur' }],
                useTimeNext:[{validator:checkAge, trigger: 'blur' }],          
            },
            options: [],
            optionsType:[
                {
                    "id": 1,
                    "name": "不限"
                },
                {
                    "id": 2,
                    "name": "仅一次"
                },
                {
                    "id": 3,
                    "name": "每天"
                },            
            ],
            titleList:[
                        {
                            name:'积分',
                            pathInfo:''
                        },
                        {
                            name:'积分来源',
                            pathInfo:''
                        }
                ],
            inputDisabled:true,
            inputDisabledNext:'',
            timesBool:false,
            timesBoolNext:'',
            dataDisabled:true,
            dataDisabledNext:'',
            placeholders:'',
            placeholdersNext:'',
            radio: 1,
            radioNext:'',
            disabledState:false         
        }
    },
    created(){
        this.integralSource();
        this.getStudylist(1);
    },
    methods:{
        selectChangeTypeNext(value){
            var self = this;
            switch (value) {
                case 1:
                    self.inputDisabledNext=true;
                    self.ruleFormEdit.timesNext = 0;
                    self.timesBoolNext = false;
                    break;
                case 2:
                    self.inputDisabledNext=true;
                    self.ruleFormEdit.timesNext = 1;
                    self.timesBoolNext = true;
                    break;
                case 3:
                    self.inputDisabledNext=false;
                    self.ruleFormEdit.timesNext = '';
                    self.placeholdersNext="1-1000"
                    self.timesBoolNext = true;
                    break;                                
                default:
                    break;
            }
        },
        selectChangeType(value){
            var self = this;
            switch (value) {
                case 1:
                    self.inputDisabled=true;
                    self.ruleForm.times = 0;
                    self.timesBool = false;
                    break;
                case 2:
                    self.inputDisabled=true;
                    self.ruleForm.times = 1;
                    self.timesBool = true;
                    break;
                case 3:
                    self.inputDisabled=false;
                    self.ruleForm.times = '';
                    self.placeholders="1-1000"
                    self.timesBool = true;
                    break;                                
                default:
                    break;
            }
        },
        changeRadio(value){
            var self = this;
            switch (value) {
                case 1:
                    self.dataDisabled = true;
                    self.ruleForm.useTime='';
                    break;
                default:
                     self.dataDisabled = false;
                    break;
            }
        },
        changeRadioNext(value){
            var self = this;
            switch (value) {
                case 1:
                    self.dataDisabledNext = true;
                    self.ruleFormEdit.useTimeNext='';
                    break;
                default:
                     self.dataDisabledNext = false;
                    break;
            }            
        },
        //积分配置来源
        integralSource(){
            var self = this; 
            self.$http.get(self.$server.integralSource).then(res=>{
                switch (res.status) {
                    case 200:       
                        self.options = res.content;
                        break;
                }
            })            
        },       
        isChannelNoEven(){
            this.centerDialogVisible = false;
        },
        isChannelOkEven(formName){
            var self = this; 
            /**
             * singleNum可获取数量
                times 获取次数
                frequency 频率
                useTime 生效时间
                id id
            */
            var params = {
                singleNum:self.ruleFormEdit.singleNumNext,
                id:self.ruleFormEdit.id,
                times:self.ruleFormEdit.timesNext,
                frequency:self.ruleFormEdit.frequencyNext,
                useTime:self.formatDate(self.ruleFormEdit.useTimeNext)
            };
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(!self.disabledState){
                        self.disabledState = !self.disabledState;                          
                        self.$http.post(self.$server.integralUpdate,params).then(res=>{
                            switch (res.status) {
                                case 200:
                                    self.centerDialogVisible = false;
                                    self.disabledState = !self.disabledState;
                                    self.getStudylist(1);                     
                                    break; 
                            }
                            switch (res.status) {
                                case 200:
                                    self.centerDialogVisible = false;
                                    self.disabledState = !self.disabledState;
                                    self.getStudylist(1);                     
                                    break;
                                default:
                                    self.disabledState = !self.disabledState;
                                    break;
                            }
                        }).catch(()=>{
                            self.disabledState = !self.disabledState;
                        })
                    }
                }
            })
        },
        isChannelNoEvenTwo(){
            this.channelDelDialogVisible = false;
        },
        isChannelOkEvenTwo(){
            var self = this;
            self.channelDelDialogVisible = false;
            if(self.isStart==1){
                self.isStart=0
            }else{
                self.isStart=1;
            }
            var params = {
                id:self.channelIDs,
                isForbidden:self.isStart
            };
            self.$http.post(self.$server.integralEnable,params).then(res=>{
            switch (res.status) {
                case 200:
                        self.channelDelDialogVisible = false;
                        self.getStudylist(1);                       
                    break;
                }                        
            }) 
        },             
        isNoEven(){
            this.dialogTableVisible = false;
        },
        isOkEven(formName){  
            var self = this; 
            this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var params = {
                            operationTypeId:self.ruleForm.operationTypeId,
                            singleNum:self.ruleForm.singleNum,
                            times:self.ruleForm.times,
                            frequency:self.ruleForm.frequency,
                            useTime:self.formatDate(self.ruleForm.useTime)                          
                        };
                        self.$http.post(self.$server.integralAdd,params).then(res=>{
                        switch (res.status) {
                            case 200:
                                    self.dialogTableVisible = false;
                                    self.getStudylist(1);                       
                                break;
                            case 417:
                                    self.$message.error(res.content.msg);
                                break; 
                            }                        
                        })  
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
            });                        
        },
        channeUpdateEven(rows){
            var self = this;
            /**
              singleNum:'',//可获取数量
              times:'',//获取次数
              frequency:1,//频率
              useTime:'',//生效时间
              id:''//id
            *  */      
            self.ruleFormEdit.operationTypeId = rows.operationTypeId;
            self.ruleFormEdit.singleNumNext=rows.singleNum;
            self.ruleFormEdit.timesNext=rows.times;
            if(rows.frequency==3){
                self.inputDisabledNext = false;
            }else{
                self.inputDisabledNext = true;
            }
            self.ruleFormEdit.frequencyNext=rows.frequency;
            self.ruleFormEdit.id=rows.id;
            if(Number(new Date(rows.useTime))>0){
                self.ruleFormEdit.useTimeNext=new Date(rows.useTime);
                self.dataDisabledNext=false;
                self.radioNext = 2;
            }else{
                self.ruleFormEdit.useTimeNext='';
                self.dataDisabledNext=true;
                self.radioNext = 1;
            }
            console.log("rows",rows);
            self.centerDialogVisible = true;  

        },   
        channeRemoveBatch(rows){
            this.channelIDs = rows.id;
            this.isStart = rows.isForbidden;
            this.channelDelDialogVisible = true;
        },                        
        //搜索
        //创建学习卡
        creatlearnCard(){
            this.dialogTableVisible = true;
            this.ruleForm =  {
              operationTypeId:'',//来源id
              singleNum:'',//可获取数量
              times:0,//获取次数
              frequency:1,//频率
              useTime:''//生效时间
          }           
        },
        getStudylist(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            var params = {
                // name:self.title,
                pageNo:self.pageNo,
                pageSize:self.pageSize
            };
            self.$http.get(self.$server.integralConfig(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
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
                //     if(!nextPage&&prePage!=0){
                //             listIds = contentdate.list.map(function(element,index){
                //                 element.sortId = contentdate.total-prePage*10-index;
                //                 return element;
                //             });
                //         }else if(!prePage&&!nextPage){
                //             listIds = contentdate.list.map(function(element,index){
                //                 element.sortId = contentdate.total-index;
                //                 return element;
                //             });
                //         }else{
                //             listIds = contentdate.list.map(function(element,index){
                //                 element.sortId = contentdate.total-prePage*10-index;
                //                 return element;
                //             });                            
                //         }
                };  
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loading = false; 
               }
                console.log(res);
            })            
        },
        formatDate(date){
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
                // h = h<10?("0"+h):h;
                // m1 = m1<10?("0"+m1):m1;   
                // s = s<10?("0"+s):s;      
                // return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
                return y+"-"+m+"-"+d;
            }else{
                return '';
            }
        },        
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        }
    },
    components:{
        breadcrumb
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px; 
    margin-bottom: 10px;     
}
.headerDiv .search-form {
        // width: 240px;
        // margin-right: 60px;
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
.headerDiv .iSeachEven{
    width: 100%;
    position: relative;
}
.headerDiv .iSeachEven i{
    position: absolute;
    right: 8px;
    font-size: 18px;
    top: 12px;
    cursor: pointer;
}
.iSeachEvenSun{
    width: 25%;
    position: relative;
    margin-bottom: 20px;
}
.iSeachEvenSun i{
    position: absolute;
    right: 8px;
    font-size: 18px;
    top: 12px;
    cursor: pointer;
}
.iSeachEvenSun .search-form-sun{
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
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
.black-btn-ok{
    color:#9E0E00 !important; 
} 
.black-btn-no{
    color: #cccccc !important;
}   
</style>


