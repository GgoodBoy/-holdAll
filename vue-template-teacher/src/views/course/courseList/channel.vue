<template>
    <div>
        <!-- <div v-if="!boolpluginForDetail"> -->
        <div>
            <el-row class="lLine40 headerDiv">
                <el-col class="lSize18">
                    <el-row>
                        <el-col :span="18" class="lLeft-r">
                           <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                        </el-col>
                        <el-col :span="6" class="lRight-r">
                            <el-button v-if="$authJudge('course:channel:add')" class="redBackColor butColorF" @click="creatChannel('new')">添加渠道课程</el-button>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col class="lMarginTop30">
                    <el-row :gutter="20">
                        <el-col :span="6" class="lLeft-r">
                            渠道名称:
                                <el-select v-model="channelType"
                                        clearable
                                        style="width:70%"
                                        allow-create
                                        filterable
                                        default-first-option
                                        placeholder="全部">
                                    <el-option v-for="(item,i) in channelTypeList"
                                            :key="i"
                                            :label="item.name"
                                            :value="item.id"></el-option>
                                </el-select>                        
                        </el-col>
                        <el-col :span="11" class="lLeft-r"><el-button v-if="$authJudge('course:channel:select')" class="redBackColor butColorF"  @click="findInfo">查询</el-button></el-col>
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
                            prop="sortId"
                            label="序号"
                            align="center"
                            min-width="60">
                        </el-table-column>
                        <el-table-column
                            prop="channelId"
                            label="渠道ID"
                            align="center"
                            min-width="100">
                        </el-table-column>
                        <el-table-column
                            prop="pipelineName"
                            label="渠道名称"
                            align="center"
                            min-width="150"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="courseNum"
                            label="渠道课程数"
                            align="center"
                            min-width="80"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="createdAt"
                            label="创建时间"
                            align="center"
                            min-width="150"
                            >
                        </el-table-column>  
                        <el-table-column
                            prop="creatorName"
                            label="创建人"
                            align="center"
                            min-width="120"
                            >
                        </el-table-column>                                      
                        <el-table-column
                            :show-overflow-tooltip="true"
                            label="操作"
                            align="center"
                            min-width="180"
                            >
                            <template slot-scope="scope">
                                <el-row :gutter="10">
                                    <el-col :span="8">
                                        <el-button
                                                v-if="$authJudge('course:channel:edit')"
                                                type="text"
                                                class="black-btn"
                                                @click="operateEven(scope.row,'edit')">编辑</el-button>                                    
                                    </el-col>
                                    <el-col :span="8">
                                        <el-button
                                                v-if="$authJudge('course:channel:find')"
                                                type="text"
                                                class="black-btn"
                                                @click="operateEven(scope.row,'see')">查看</el-button>                                    
                                    </el-col>
                                    <el-col :span="8">
                                        <el-button
                                                v-if="$authJudge('course:channel:del')"
                                                type="text"
                                                class="black-btn"
                                                @click="operateEven(scope.row,'remove')">删除</el-button>                                        
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
        </div>
        <el-dialog
        :visible.sync="delayDialog"
        :close-on-click-modal='false'
        title=""
        max-height="300"
        width="480px"> 
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="选择渠道" prop="region">
                    <el-select v-model="ruleForm.region" placeholder="选择渠道">
                        <el-option :label="item.name" :value="item.id" v-for="(item,i) in channelTypeList" :key="i"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设置拥有时间" prop="resource">
                    <el-radio-group v-model="ruleForm.resource" @change="radioTimeEven">
                        <el-row>
                            <el-radio label="1">
                                永久
                            </el-radio>
                        </el-row>
                        <el-row class="lMarginTop10" style="line-height: 50px;">
                            <el-col :span="8">
                                <el-radio label="2" :disabled="disabled">
                                    自定义
                                </el-radio>                                
                            </el-col>
                            <el-col :span="16">
                                <el-input :disabled='radioSelect' maxlength="5" v-model.trim="ruleForm.input" style="100%" placeholder="> 10 <10000，整数"></el-input>
                            </el-col>
                        </el-row>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择课程">
                    <el-row>
                        <el-col :span="6">  
                            <div class="chooseCss lCenter-r" @click="curseclick(ruleForm.courseIds)">选择</div>                    
                        </el-col>
                        <el-col :span="17" :offset="1">  
                            已选择<span style="color: #9E0E00;padding:0 10px;">{{ruleForm.courseNums||0}}</span>门课程           
                        </el-col>                        
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button @click="closeDialog(1)">取消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                </el-form-item>
            </el-form>        
        </el-dialog>   
        <el-dialog
        :visible.sync="delayDialogOne"
        title=""
        max-height="300"
        width="25%"> 
            <el-row>
                <el-col class="lCenter-r">确定要删除这个渠道吗?</el-col>
                <el-col class="lCenter-r lMarginTop20">
                    <el-button @click="closeDialog(1)">取消</el-button>
                    <el-button type="primary" @click="removeChanelEven(1)">确定</el-button>                    
                </el-col>
            </el-row>
        </el-dialog>   
        <el-dialog
        :visible.sync="delayDialogTwo"
        title=""
        max-height="300"
        width="25%"> 
            <el-row>
                <el-col class="lCenter-r">该渠道不可删除，已有课程标为该渠道，请先删除该渠道下面的课程?</el-col>
                <el-col class="lCenter-r lMarginTop20">
                    <el-button @click="closeDialog(2)">关闭</el-button>                  
                </el-col>
            </el-row>              
        </el-dialog>
        <el-dialog
        :visible.sync="delayDialogThree"
        :close-on-click-modal="false"
        title=""
        max-height="300"
        width="25%"> 
            <div class="channelCourseCss">
                <div>
                    <el-row>
                        <el-col>
                            渠道:<span class="lMarginL10">{{channelCourseObj.channelName}}</span>
                        </el-col>
                        <el-col class="lMarginTop10">
                            拥有时间:<span class="lMarginL10 butColor">{{Number(channelCourseObj.dayTime)>0?channelCourseObj.dayTime+'天':'永久'}}</span>
                        </el-col>
                    </el-row>
                </div>
                <div class="courseCss">
                    <p class="lMarginTop20 graybackE8 lPadding10">课程名称</p>
                    <el-row class="lLeft-r lMarginTop10 courselistCss">
                        <el-col class="lPaddingRF10" v-for="(item,i) in channelCourseObj.list" :key="i">{{item.title}}</el-col>
                        <el-col class="lMarginTop20 lCenter-r">
                            <el-button type="primary" @click="closeDialog(3)">确定</el-button>
                        </el-col>
                    </el-row>                    
                </div>
            </div>              
        </el-dialog>    
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="false"
        width="40%"
        >
            <div class="centerCss">
                   <!-- <courseListPlugin v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIds" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>     -->
                   <courseListPlugin v-if="dialogVisibleFour" :urlPorp="urls" :varObjs='varObj' :channelObj="channelObj" :chooseIdlist="ruleForm.courseIds" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>      
            </div>                    
        </el-dialog>            
        <!-- <courseselect :urlPorp="urls" :varObjs='varObj' :channelObj="channelObj" :closeBox="false" :chooseIdlist="ruleForm.courseIds" :numbersBool="false"  v-if="boolpluginForDetail" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseselect>            -->
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
// import courseselect from "@/components/Appconfigpage/ACourseSelect/coursesselect";
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
// import courseselect from "@/components/Appconfigpage/ACourseSelect/coursesSelectCopy";
export default {
    data(){
        return {
            tableData: [],
            channelObj:{
                selectChannelId:''
            },
            pageNo:1,
            pageSize:10,
            loading:true,
            disabledBoll:false,
            pageAtion:{
                pageTotal:0,
                paginationPage:1,
            },
            channelType:'',
            delayDialog:false,
            delayDialogOne:false,
            delayDialogTwo:false,
            delayDialogThree:false,
            submitOneStats:false,
            disabledState:false,
            value:-1,
            channelTypeList:[],
            ///channelCourse/chooseCourse?pageSize=1000&pageNo=1&id=&courseName=
            urls:'/channelCourse/chooseCourse', 
            courseselectType:"channel",
            ruleForm: {
                region: '',
                resource: '1',
                courseNums:0,
                input:'',
                courseIds:[]
            },
            rules: {
                region: [
                    { required: true, message: '请选择活动区域', trigger: 'change' }
                ],
                resource: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ]
            },   
            titleList:[
                {
                    name:'课程',
                    pathInfo:''
                },
                {
                    name:'课程渠道设置',
                    pathInfo:''
                } 
            ],
            radioSelect:true,                  
            selectChannelData:'',
            channelCourseObj:{
                list:[],
                channelName:'',
                dayTime:''
            },
            disabled:false,
            //新组建
            varObj:{
                pageType:false,//是否分页
                mtypeText:false,//是否显示成人少儿分类
                pipelineType:false,
                isNothirdParty:true
            },     
            dialogVisibleFour:false             
        }
    },
    components:{
        // courseselect,
        courseListPlugin,
        breadcrumb
    },    
    computed:{ 
        // boolpluginForDetail(){
        //     return this.$store.state.appConfig.appStore.boolpluginForDetail
        // },    
        region(){
            return this.ruleForm.region;
        }
    },   
    watch:{
        region(cur){
            let obj = this.channelTypeList.find(item=>item.id==cur);
            if(obj&&obj.name=='学国学网'){
                 this.ruleForm.resource = '1';
                this.disabled = true;
                this.radioSelect = true;    
            }else{
                this.disabled = false;
                this.radioSelect = false;
            }
        }
    },   
    created(){
        // this.$store.state.appConfig.appStore.boolpluginForDetail=false; 
        this.getStudylist();
        this.getChannelList();
    },
    methods:{
        listSelectEven(data){
            var self = this;
            if(data.bool){
                // this.$store.state.appConfig.appStore.boolpluginForDetail=false; 
                self.dialogVisibleFour = false;
                this.delayDialog=true; 
                this.ruleForm.courseNums = data.datas.length>0?data.datas.length:0;
                console.log(data);
                this.ruleForm.courseIds = [];
                for (const iterator of data.datas) {
                    this.ruleForm.courseIds.push(iterator.content);
                }; 
            }else{
                self.dialogVisibleFour = false;
            }
            
        },
        removeChanelEven(num){
            var self = this;
            var courseNum = this.selectChannelData.courseList;
            if(courseNum&&courseNum.length>0){
                self.delayDialogOne=false;
                setTimeout(()=>{
                    self.delayDialogTwo=true;
                },300);
                return;                
            }else{
                var ids = this.selectChannelData.id;
                self.$http.delete(this.$server.channelCourseDelete({id:ids})).then(res=>{
                    if(res.status==200){
                        self.delayDialogOne=false;
                        self.getStudylist();
                    }
                })                
            }
        },
        submitForm(formName) {
            var self = this;
            var parems ='';
            if(!self.submitOneStats){
                self.submitOneStats =true;
                self.$refs[formName].validate((valid) => {
                if (valid) {
                    if(self.ruleForm.resource=='2'){
                        var reg = /^\d{1,4}$|^10000$/; 
                        // var reg = /^(?:[1-9]\d|10000)$/;
                        if(Number(self.ruleForm.input)<10){
                            self.$message.error("请输入时间,时间不能为小于10");
                            return;
                        }
                        if(!reg.test(Number(self.ruleForm.input))||Number(self.ruleForm.input)<10){
                            self.$message.error("请正确输入时间");
                            return;
                        }                    
                    }
                    if(self.channelObj.selectChannelId){
                        parems = {
                            pipelineId:self.ruleForm.region,
                            buyAvailableDay:self.ruleForm.resource=='1'?0:self.ruleForm.input,
                            courseIds:JSON.stringify(self.ruleForm.courseIds),
                            id:self.channelObj.selectChannelId
                        }
                    }else{
                        parems = {
                            pipelineId:self.ruleForm.region,
                            buyAvailableDay:self.ruleForm.resource=='1'?0:self.ruleForm.input,
                            courseIds:JSON.stringify(self.ruleForm.courseIds)
                        }                    
                    }
                    if(!self.disabledState){
                        self.disabledState = !self.disabledState;
                        self.$http.post(self.$server.channelCourseAdd,parems).then(res=>{
                            if(res.status==200){
                                self.disabledState = !self.disabledState;
                                self.delayDialog = false;
                                self.submitOneStats =false;
                                self.ruleForm.courseIds=[];
                                self.getStudylist();
                            }
                        }).catch(function(error) {
                            self.disabledState = !self.disabledState;
                            self.submitOneStats =false;
                        });
                    }                
                } else {
                    self.submitOneStats =false;
                    console.log('error submit!!');
                    return false;
                }
                });
            }
        },
        closeDialog(num) {
            switch (num) {
                case 1:
                    this.ruleForm ={
                        region: '',
                        resource: '1',
                        courseNums:'',
                        input:'',
                        courseIds:[]
                    };
                    this.delayDialog = false;                    
                    break;
                case 2:
                    this.delayDialogTwo = false;  
                    break;
                case 3:
                    this.delayDialogThree = false;
                    this.channelCourseObj={
                        list:[],
                        channelName:'',
                        dayTime:''
                    }                    
                    break;                                
                default:
                    break;
            }
        },        
        creatChannel(type){
            this.ruleForm ={
                region: '',
                resource: '1',
                courseNums:'',
                input:'',
                courseIds:[]
            };      
            this.submitOneStats =false;      
            this.channelObj={
                selectChannelId:''
            };               
            this.delayDialog = true;
        },
        proving1(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.title)){
                self.title='';
            }            
        },        
        //搜索
        search(){
            console.log("搜索");
            this.getStudylist(1);
        },
        //查询
        findInfo(){
            this.getStudylist(1);
        },    
        curseclick(){
            this.delayDialog=false;         
            setTimeout(()=>{
                // this.$store.state.appConfig.appStore.boolpluginForDetail=true;
                this.dialogVisibleFour = true;
            },200); 
        },  
        getChannelList(){
            var self = this;
            function filterAll(e){
                return e.id!=-1;
            };
            self.$http.get(self.$server.channelCoursePipelines).then(res=>{
               if(res.status==200){
                   self.channelTypeList = res.content.list.filter(filterAll);
               }
            })            
        },
        operateEven(data,type){
            var self = this;
            self.submitOneStats =false;
            self.selectChannelData = data;
            switch (type) {
                case 'edit':
                    self.delayDialog = true;
                    self.ruleForm.region = data.pipelineId;
                    self.ruleForm.resource = Number(data.buyAvailableDay)>0?'2':'1';
                    this.radioSelect=Number(data.buyAvailableDay)>0?false:true;
                    self.ruleForm.courseNums = data.courseList.length>0?data.courseList.length:0;
                    self.ruleForm.input = Number(data.buyAvailableDay)>0?data.buyAvailableDay:''; 
                    self.channelObj.selectChannelId = data.id;
                    self.ruleForm.courseIds = []
                    for (const iterator of data.courseList) {
                        self.ruleForm.courseIds.push(iterator.id);
                    };         
                    break;
                case 'see':
                    self.delayDialogThree = true;
                    self.$http.get(self.$server.channelCourseView({id:self.selectChannelData.id})).then(res=>{
                        if(res.status==200){
                            self.channelCourseObj = {
                                list:res.content.courseList,
                                channelName:res.content.pipelineName,
                                dayTime:res.content.buyAvailableDay
                            }
                        }else{
                            this.channelCourseObj={
                                list:[],
                                channelName:'',
                                dayTime:''
                            };                             
                        }
                    });                    
                    break;
                case 'remove':
                    self.delayDialogOne=true;
                    break;                                
                default:
                    break;
            }
        },
        radioTimeEven(val){
            if(Number(val)==1){
                this.radioSelect=true;
            }else{
                this.radioSelect=false;
            }
        },
        getStudylist(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            var params = {
                pipelineId:self.channelType,
                pageNo:self.pageNo,
                pageSize:self.pageSize
            };
            self.$http.get(self.$server.channelCourseGetPage(params)).then(res=>{
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
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
               }
            })            
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        },
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../../components/formSynthesisPlugin/my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px; 
    margin-bottom: 10px;     
}
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
.chooseCss{
    padding: 0 15px;
    background: #9E0E00;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
}
.channelCourseCss .courseCss .courselistCss{
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>


