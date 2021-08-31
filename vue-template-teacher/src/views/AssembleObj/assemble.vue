<template>
    <div class="lLine40 headerDiv">
        <el-row v-if="!addAssembleBool">
            <!-- <el-col class="lLeft-r lSize18">拼团课程</el-col> -->
            <el-col>
                <el-row>
                    <el-col :span="12">
                        <breadcrumb :menuList ='titleList'></breadcrumb>
                    </el-col>
                    <el-col v-if="$authJudge('market:assemble:add')" :span="3" :offset="6" class="lSize12-i lCenter-r lLine40"><el-button type="text" class="black-btn" @click="addOrUpdateAssemnle('',1)">添加拼团课程</el-button></el-col>
                    <el-col :span="3" class="lSize12-i lCenter-r lLine40">共有拼团课程{{totalNum}}门</el-col>
                </el-row>
            </el-col>             
            <el-col class="lMarginTop20">
                <el-row :gutter="3">
                    <el-col class="lSize16-i" :span="4">
                        <div class="iSeachEven">
                            <el-input v-model.trim="inputCourseOne"
                                        placeholder="输入拼团课程"
                                        class="search-form"
                                        width="100%"
                                        @keyup.native="proving1"
                                        clearable
                                        ></el-input>
                        </div>
                    </el-col>              
                    <el-col :span="3">
                        <el-select v-model="isEnd"
                                placeholder="状态">
                            <el-option v-for="(item,i) in courseTypeList"
                                    :key="i"
                                    :label="item.name"
                                    :value="item.value"></el-option>
                        </el-select>
                    </el-col>                    
                    <el-col :span="17">
                        <div class="dataTimeBox">
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
                        <div class="dataselectBox" v-if="$authJudge('market:assemble:select')">
                            <el-button class="redBackColor butColorF" @click="search">查询</el-button>
                        </div>       
                    </el-col>    
                </el-row>
            </el-col>
            <el-col class="lMarginTop40">
                <el-row>
                    <el-col>
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
                                prop="courseName"
                                label="课程名称"
                                :show-overflow-tooltip="true"
                                align="center"
                                min-width="80">
                            </el-table-column>                    
                            <el-table-column
                                prop="tearcherNames"
                                label="教课老师"
                                align="center"
                                min-width="80"
                                :show-overflow-tooltip="true"
                                >
                            </el-table-column>
                            <el-table-column
                                prop="scope.row"
                                label="拼团时间"
                                align="center"
                                :show-overflow-tooltip="true"
                                min-width="280">
                                    <template slot-scope="scope">
                                        <el-row> 
                                            <el-col :span="11">{{scope.row.beginTime}}</el-col>                                                                                               
                                            <el-col :span="2">-</el-col>
                                            <el-col :span="11">{{scope.row.endTime}}</el-col>                              
                                        </el-row>                                                      
                                    </template>                                 
                            </el-table-column>
                            <el-table-column
                                label="原价"
                                align="center"
                                :show-overflow-tooltip="true"
                                min-width="80">
                                    <template slot-scope="scope">
                                        <el-row> 
                                            <el-col>￥ {{scope.row.originalPriceStr}}</el-col>                            
                                        </el-row>                                                      
                                    </template>                                
                            </el-table-column>
                            <el-table-column
                                label="拼团价"
                                align="center"
                                :show-overflow-tooltip="true"
                                min-width="80">
                                    <template slot-scope="scope">
                                        <el-row> 
                                            <el-col>￥ {{scope.row.assemblePriceStr}}</el-col>                            
                                        </el-row>                                                                                             
                                    </template>                                
                            </el-table-column>  
                            <el-table-column
                                prop="peopleNum"
                                label="成团人数"
                                align="center"
                                min-width="80">
                            </el-table-column>
                            <el-table-column
                                prop="successNum"
                                label="拼团成功"
                                align="center"
                                min-width="80">
                            </el-table-column>
                            <el-table-column
                                label="类型"
                                align="center"
                                min-width="80">
                                <template slot-scope="scope">
                                    <el-row> 
                                        <el-col>{{scope.row.mtype==1?'成人':'少儿'}}</el-col>                            
                                    </el-row>                                                                                             
                                </template> 
                            </el-table-column>                            
                            <el-table-column
                                prop="creatorName"
                                label="状态"
                                align="center"
                                min-width="100">
                                <template slot-scope="scope">
                                    <el-row> 
                                        <el-col v-if="scope.row.state==1">未开始</el-col>
                                        <el-col v-else-if="scope.row.state==2">进行中</el-col>                                                                                               
                                        <el-col v-else>已失效</el-col>        
                                    </el-row>                                                      
                                </template>                        
                            </el-table-column>                                                                              
                            <el-table-column
                                label="操作"
                                align="center"
                                min-width="150"
                                >
                                <template slot-scope="scope">
                                    <el-row> 
                                       <el-col :span="8" v-if="$authJudge('market:assemble:detailed')">
                                            <el-button type="text" class="black-btn" @click="channeDetailEven(scope.row)">明细</el-button>
                                        </el-col>                                         
                                        <el-col :span="8" v-if="$authJudge('market:assemble:edit')" v-show="scope.row.state!=3&&scope.row.state!=4">
                                            <el-button type="text" class="black-btn" @click="addOrUpdateAssemnle(scope.row,2)">修改</el-button>
                                        </el-col>                                                                                               
                                        <el-col :span="8" v-if="$authJudge('market:assemble:down')" v-show="scope.row.state!=4">
                                            <el-button  type="text" class="black-btn" @click="channeRemoveBatch(scope.row)">下架</el-button>
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
            </el-col>
        </el-row>  
        <el-row v-if="addAssembleBool">  
            <div style="margin-bottom:20px">
                    <p class="titleStyle" @click="$router.push('/marketelistlist')"><strong>系统合集</strong> /</p>
                    <p class="titleStyle" @click="addAssembleBool=false"><strong>拼团系统</strong> /</p>
                    <p class="titleStyle">添加拼团课程</p>
                </div>
            <el-col class="lMarginTop40">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 600px;" class="demo-ruleForm">
                    <el-form-item label="课程:"> 
                        <!-- assembleStyle -->
                        <el-row>
                            <el-col v-if="assembleStyle==1">
                                <el-row :gutter="5">
                                    <el-col :span="4" class="lLeft-"><el-button type="text" @click="courseChooseEven" class="greenColor">请选择</el-button></el-col>
                                    <el-col :span="10" class="lLeft-r redFontColor lSize12" v-show="courseIdBool">*请选择课程</el-col>
                                </el-row>
                                <el-row>
                                    <el-col class="lLeft-r">{{ruleForm.courseChooseName}}</el-col>
                                </el-row>
                            </el-col>
                            <el-col v-else>
                                    {{ruleForm.courseChooseName}}
                            </el-col>
                        </el-row>                            
                    </el-form-item>                    
                    <el-form-item label="开团时间:">
                        <el-row>
                            <el-col v-if="assembleStyle==1">
                                <el-row >
                                    <el-col>
                                        <el-form-item prop="beginTime">
                                            <el-date-picker 
                                                type="date" 
                                                placeholder="选择日期" 
                                                :picker-options="pickerOptions0"
                                                v-model="ruleForm.beginTime"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <!-- <el-col :span="11">年.月.日  时：分：秒</el-col> -->
                                </el-row>
                            </el-col>
                            <el-col v-else class="lLeft-r">{{beginTimeString}}</el-col>
                        </el-row>  
                    </el-form-item>
                    <el-form-item label="截止时间:">
                        <el-row>
                            <el-col>
                            <el-form-item prop="endTime">
                                <el-date-picker 
                                    type="date" 
                                    placeholder="选择日期" 
                                    :picker-options="pickerOptions0"
                                    v-model="ruleForm.endTime"></el-date-picker>
                                    </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>                    
                    <el-form-item label="拼团价格:" prop="assemblePrice">
                        <el-row>
                            <el-col v-if="assembleStyle==1">
                                <el-row :gutter="10">
                                    <el-col :span="10"><el-input placeholder="请输入拼团价格" v-model="ruleForm.assemblePrice" style="width:260px"></el-input></el-col>
                                    <el-col :span="6" :offset="4">原价：￥{{ruleForm.originalPrice}}元</el-col>
                                </el-row>  
                            </el-col>
                            <el-col v-else>
                                <el-row :gutter="10">
                                    <el-col :span="10">￥ {{ruleForm.assemblePrice}} 元</el-col>
                                    <el-col :span="6" :offset="4">原价：￥{{ruleForm.originalPrice}}元</el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <!-- <el-form-item label="持续时间:" prop="continueTime"> -->
                    <el-form-item label="持续时间:">
                        <el-row>
                            <!-- <el-col v-if="assembleStyle==1">
                                <el-select v-model="ruleForm.continueTime" placeholder="请选择持续时间">
                                    <el-option label="24小时" value="24"></el-option>
                                    <el-option label="48小时" value="48"></el-option>
                                </el-select>                               
                            </el-col> -->
                            <el-col>
                                1小时                            
                            </el-col>                            
                            <!-- <el-col v-else>{{ruleForm.continueTime}} 小时</el-col> -->
                        </el-row>                        
                    </el-form-item>                  
                    <el-form-item label="成团人数:" prop="peopleNum">
                        <el-row>
                            <el-col v-if="assembleStyle==1">
                                <el-radio-group v-model="ruleForm.peopleNum" :disabled="assembleStyle==2?true:false">
                                    <el-radio :label="2">2 人</el-radio>
                                    <el-radio :label="3">3 人</el-radio>
                                </el-radio-group>                                
                            </el-col>
                            <el-col v-else>{{ruleForm.assemblePrice}} 人</el-col>
                        </el-row>                        
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="dialogIsNo(1)">取消</el-button>
                        <el-button v-if="assembleStyle==1" class="redBackColor butColorF" @click="submitForm('ruleForm','add')">保存</el-button>
                        <el-button v-else class="redBackColor butColorF" @click="submitForm('ruleForm','update')">保存</el-button>
                    </el-form-item>
                </el-form>                           
            </el-col>
        </el-row>          
        <el-dialog
        :visible.sync="centerDialogList"
        :close-on-click-modal='false'
        max-height="300"
        width="30%">
            <el-row>
                <el-col>
                     <el-row :gutter="20">
                        <el-col :span="18" class="lCenter-r">
                            <el-input placeholder="请输入内容"  @keyup.native="proving2" v-model="inputCourseTwo"></el-input>
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
                            v-loading="loading1"
                            style="width: 100%"
                            max-height="300"
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
                            label="类型">
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col>{{scope.row.mtype==1?'成人':'少儿'}}</el-col>                            
                                </el-row>                                                                                             
                            </template>                            
                            </el-table-column>   
                            <el-table-column
                            align="center"
                            label="价格">
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col>{{scope.row.sellingPrice||0}}币</el-col>                            
                                </el-row>                                                                                             
                            </template>                            
                            </el-table-column>                                                     
                        </el-table>
                </el-col>
                <el-col class="lMarginTop20">
                    <el-row>
                        <el-col :span="6" class="lCenter-r" :offset="6">
                            <el-button @click="dialogIsNo(2)">取消选择</el-button>
                        </el-col>
                        <el-col :span="6" class="lCenter-r">
                            <el-button class="redBackColor butColorF" @click="courselistIsOkOrNo()">确定选择</el-button>
                        </el-col>
                    </el-row>
                </el-col>  
            </el-row>
        </el-dialog>
        <el-dialog
        title="确认下架该课程"
        :visible.sync="lowerShelfDialogVisible"
        width="30%"
        > 
            <el-row class="lLine30">
                <el-col class="lCenter-r">《{{lowerShelfInfo.courseName}}》下架后将不能继续拼团，对已拼团成功的课程不受影响</el-col>
            </el-row>                         
            <el-row  class="lLine30 lMarginTop40">
                <el-col class="lCenter-r">
                    <el-button @click="dialogIsNo(3)">取 消</el-button>
                    <el-button class="redBackColor butColorF" @click="lowerShelfYes()">确 定</el-button>                        
                </el-col>                        
            </el-row>                    
        </el-dialog>        
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import html2canvas from 'html2canvas';
export default {
    data(){       
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {              
                case "beginTime":
                        if (value===""||Number(value)==0) {
                            return callback(new Error('请选择开团时间'));
                            }
                        setTimeout(() => {
                            if(this.ruleForm.endTime!=null&&this.ruleForm.endTime!=''&&Number(value)>Number(this.ruleForm.endTime)){
                                callback(new Error('开团时间不能大于截止时间'));
                            }else{
                                callback();
                            }
                        }, 300);
                break;
               case "endTime":
                        if (value===""||Number(value)==0) {
                            return callback(new Error('请选择截止时间'));
                            }
                        setTimeout(() => {
                            if(this.ruleForm.beginTime!=null&&this.ruleForm.beginTime!=''&&(Number(value)+86399000)<Number(this.ruleForm.beginTime)){
                                callback(new Error('截止时间不能小于开团时间'));
                            }else{
                                callback();
                            }
                        }, 300);
                break;                
                case "assemblePrice":
                        var repExp = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                        if (value==="") {
                                return callback(new Error('请输入开团价格'));
                            }
                            setTimeout(() => {
                                if (!repExp.test(value)) {
                                    callback(new Error('请输入正数,最多2位小数'));
                                } else if(Number(value)>Number(this.originalPriceMoney)){
                                    callback(new Error('拼团价格不能大于原价'));
                                }else{
                                    callback();
                                }
                            }, 300);
                break;                
            }
        };                                                 
        return {
            radio3:3,
            isEnd:-1,
            mtype:-1,
            tableData:[
                {
                    sortId:456,
                    channelId:12312,
                    name:'名字',
                    createdAt:'创建时间',
                    creatorName:'创建人'
                }
            ],
            inputCourseOne:'',
            inputCourseTwo:'',
            loading:false,
            loading1:false,
            dataURL: '',
            pageSize:10,
            pageNoOne:1,
            pageNoTwo:1,
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },                         
            imgList:[
                {
                    title:'庆双旦 全场课程八折',
                    imgs:'',
                },
                {
                    title:'庆双旦 全场课程八折',
                    imgs:'',
                }                
            ],
            ruleForm: {
                assemblePrice: '',
                beginTime: '',
                endTime: '',
                peopleNum: '',
                courseId:'',
                courseChooseName:'',
                continueTime:1,
                originalPrice:''
            },   
            rules: {
                assemblePrice: [
                    {trigger: 'blur' ,validator: checkAge},
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                // continueTime: [
                //     { required: true, message: '请选择持续时间', trigger: 'change' }
                // ],                
                beginTime: [
                    {type: 'date',validator: checkAge, trigger: 'change' }
                ],
                endTime: [
                    {type: 'date',validator: checkAge, trigger: 'change' }
                ],
                peopleNum: [
                    { required: true, message: '请选择成团人数', trigger: 'change' }
                ]
            },
            courseIdBool:false,
            addAssembleBool:false,
            centerDialogList:false,
            //下架
            lowerShelfDialogVisible:false,
            tableDataCourse:[],
            lowerShelfInfo:'',
            totalNum:0,
            assembleStyle:1,       
            beginTimeString:'',
            multipleSelection: [],
            disabledState:false,
            startTime:'',
            endTime:'',
            titleList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'拼团系统',
                            pathInfo:''
                        }
            ],
            courseTypeList:[
                {
                    name:'全部',
                    value:-1                 
                },
                {
                    name:'未开始',
                    value:1
                },
                {
                    name:'进行中',
                    value:2 
                },
                {
                    name:'已失效',
                    value:3
                },
            ],
            pickerOptions0: {
                disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7; //  return time.getTime() < Date.now() - 8.64e6 如果没有后面的-8.64e6就是不可以选择今天的
                }
            },
        }
    },
    created(){
        this.getAssmbleList(1);
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
        
        selectable(){
            if(this.multipleSelection.length <1){
                    return true;
            }            
        },
        courseSeach(){
            this.getTableCourse();
        },
        //课程选择 
        courseChooseEven(){
            this.getTableCourse();
            this.centerDialogList = true;
        },  
        dialogIsNo(num){
            switch (num) {
                case 1:
                    this.addAssembleBool = false;
                    break;
                case 2:
                    this.$refs.multipleTable.clearSelection();
                    this.centerDialogList = false;
                    break;
                case 3:
                    this.lowerShelfDialogVisible = false;
                    break;                                  
                default:
                    break;
            }
        },
        channeRemoveBatch(data){
            this.lowerShelfInfo = data;
            this.lowerShelfDialogVisible = true;
        }, 
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },         
        //选择课程
        courselistIsOkOrNo(){
           this.centerDialogList = false;
           this.ruleForm.courseId = this.multipleSelection[0].courseId;
           this.ruleForm.courseChooseName = this.multipleSelection[0].courseName;
           this.ruleForm.originalPrice = this.multipleSelection[0].originalPrice;
        },       
        lowerShelfYes(){
            var self = this; 
            self.$http.post(self.$server.assembleOffShelves({id:self.lowerShelfInfo.id})).then(res=>{
                if(res.status==200){
                    self.lowerShelfDialogVisible = false;
                    this.getAssmbleList(self.pageAtion.paginationPage);
                }
            })
        },
        getAssmbleList(num){
            var self = this;
            if(num){
                self.pageNoOne = num;
            }            
            var parems = {
                courseName:self.inputCourseOne,
                pageSize:self.pageSize,
                pageNo:self.pageNoOne,
                isEnd:self.isEnd,
                mtype:self.mtype,
                startTime:self.formatDate(self.startTime,'start'),
                endTime:self.endTime?self.formatDate(Number(self.endTime)+86399000):''
            };
            self.loading=true;
            self.$http.get(self.$server.assembleList(parems)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   self.totalNum = contentdate.total;
                   if(contentdate.list.length){
                        listIds = contentdate.list.map(function(element,index){
                            if(contentdate.pageNum==1){
                                element.sortId = index+1;
                                return element;
                            }else if(contentdate.pageNum>1){
                                element.sortId = (contentdate.pageNum-1)*10+index+1;
                                return element;
                            }
                        });                  
                   };  
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loading = false; 
               }
                console.log(res);
            }).catch((err)=>{
                self.loading=false;
            });                       
        },
        //选择课程
        getTableCourse(){
            var self = this;        
            var parems = {
                courseName:self.inputCourseTwo
            };
            self.loading1=true;
            self.$http.get(self.$server.assembleGetCourses(parems)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   self.tableDataCourse = contentdate;
               }
               self.loading1=false;
                console.log(res);
            }).catch((err)=>{
                self.loading1=false;
            });            
        },   
        channeDetailEven(data){
            this.$router.push({name:'assembleDetailed',query:{id:data.id}});
        },                 
        addOrUpdateAssemnle(data,states){
            var self = this;
            this.lowerShelfInfo = data;
            this.assembleStyle = Number(states);
            if(this.assembleStyle!=1){
                this.ruleForm.courseChooseName = data.courseName;
                this.ruleForm.courseId = data.courseId;
                this.beginTimeString = data.beginTime;
                this.ruleForm.beginTime = new Date(data.beginTime); 
                this.ruleForm.peopleNum = data.peopleNum;
                this.ruleForm.assemblePrice = data.assemblePrice;
                this.ruleForm.continueTime = data.continueTime;
                this.ruleForm.originalPrice = data.originalPrice;
            }else{
                this.ruleForm.courseChooseName = '';
                this.ruleForm.courseId = '';
                this.beginTimeString = '';
                this.ruleForm.beginTime = null; 
                this.ruleForm.endTime = null; 
                this.ruleForm.peopleNum = '';
                this.ruleForm.assemblePrice = '';
                this.ruleForm.continueTime = 1; 
                this.ruleForm.originalPrice = '';               
            }
            this.addAssembleBool = true;
        },
        submitForm(formName,states) {
            var self = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var self = this;    
                if(states=="add"){
                    var newtaimes = new Date().getTime();
                        if(self.ruleForm.courseId==''){
                            self.courseIdBool = true;
                            return;
                        }else{
                            self.courseIdBool = false;
                        }
                        if(Number(self.ruleForm.beginTime)<newtaimes){
                            self.ruleForm.beginTime = new Date();
                        }                        
                        var parems = {
                            courseName:self.ruleForm.courseChooseName,
                            courseId:self.ruleForm.courseId,
                            beginTime:self.formatDate(Number(self.ruleForm.beginTime)),
                            endTime:self.formatDate(Number(self.ruleForm.endTime)+86399000),
                            assemblePrice:self.ruleForm.assemblePrice,
                            peopleNum:self.ruleForm.peopleNum,
                            continueTime:self.ruleForm.continueTime
                        };
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;                           
                            self.$http.post(self.$server.assembleAdd,parems).then(res=>{
                                if(res.status==200){
                                    self.addAssembleBool = false;
                                    self.disabledState = !self.disabledState;
                                    self.getAssmbleList(self.pageAtion.paginationPage);
                                }
                                console.log(res);
                            }).catch(()=>{
                                self.disabledState = !self.disabledState;
                            })
                        }
                        console.log('submit!');
                    }else{
                        var parems = {
                            id:self.lowerShelfInfo.id,
                            endTime:self.formatDate(Number(self.ruleForm.endTime)+86399000)
                        };
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;                         
                            self.$http.post(self.$server.assembleUpdate,parems).then(res=>{
                                if(res.status==200){
                                    self.addAssembleBool = false;
                                    self.disabledState = !self.disabledState;
                                    self.getAssmbleList(self.pageAtion.paginationPage);
                                }
                                console.log(res);
                            }).catch(()=>{
                                self.disabledState = !self.disabledState;
                            })
                        }
                        console.log('submit!');                        
                    }    

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
      },      
        search(){
             this.getAssmbleList(1);
        },
        proving1(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.inputCourseOne)){
                this.inputCourseOne='';
            }             
        },
        proving2(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.inputCourseTwo)){
                this.inputCourseTwo='';
            }             
        },        
        childPageValue(num){
            if(Number(num)>0){
                this.getAssmbleList(Number(num))
            }
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
                h = h<10?("0"+h):h;
                m1 = m1<10?("0"+m1):m1;   
                s = s<10?("0"+s):s;      
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
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
.titleStyle{display:inline-block;vertical-align:middle;margin-right:4px;font-size:18px;cursor: pointer;}
.imgDiv{
    padding: 10px;
}
.headerDiv .imgStyle{
    width: 100%;
}
.headerDiv .imgDiv{
    background: #F2F2F2;
}
.headerDiv .imgDiv .imgDivSon{
    border: 1px solid #ccc;
}
.headerDiv .iSeachEven{
    width: 100%;
    position: relative;
}
.headerDiv .iSeachEven .el-icon-search{
    position: absolute;
    font-size: 18px;
    right: 10px;
    top: 10px;
    background: #fff;
    font-weight: 900;
}
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }
.has-gutter th.el-table-column--selection .cell{
    display: none;
}    
.dataTimeBox{
    width: 450px;
}
.dataselectBox{
    width: 150px;
}
.dataTimeBox,.dataselectBox{
    float: left;
}
</style>


