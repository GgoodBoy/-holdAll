<template>
    <div>
        <el-row :gutter="20" class="lLine40">
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col :span="21">
                <el-input v-model.trim="title"
                    style="width:200px"
                    placeholder="输入活动名称查询"
                    class="search-form"
                    clearable
                    maxlength="20">
                </el-input>                
                <el-select 
                    v-model="mType"
                    clearable
                    style="width:120px"
                    placeholder="选择类型">
                    <el-option v-for="(item,i) in courseLabelList"
                        :key="i"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select> 
                <el-date-picker
                v-model="begin"
                @change="pickerBegin(begin,1)"
                style="width:150px"
                type="date"
                placeholder="开始时间">
                </el-date-picker>  
                <div style="display: inline-block;">-</div>
                <el-date-picker
                v-model="end"
                @change="pickerEnd(end,1)"
                style="width:150px"
                type="date"
                placeholder="结束时间">
                </el-date-picker>                              
                <el-button v-if="$authJudge('mobileactivity:activity:select')" class="redBackColor butColorF" @click="seach()">查询</el-button>
            </el-col>            
            <el-col :span="3" style="text-align: right;">
                <el-button v-if="$authJudge('mobileactivity:activity:add')" class="redBackColor butColorF" @click="releaseSpecial">创建活动</el-button>
            </el-col>              
        </el-row>
        <el-row class="lMarginTop20">
            <el-col>
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="活动ID "
                        align="center"
                        min-width="50">
                    </el-table-column>                
                    <el-table-column
                        prop="title"
                        label="活动名称 "
                        align="center"
                        min-width="200"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="已领人数"
                        prop="receiveNum"
                        align="center"
                        min-width="120">                         
                    </el-table-column>  
                    <el-table-column 
                        align="center"
                        label="类型"
                        min-width="80">
                        <template slot-scope="scope">
                            <P>{{scope.row.type==1?'多课':'单课'}}</P>
                        </template>                                 
                    </el-table-column>   
                    <el-table-column 
                        align="center"
                        label="状态"
                        min-width="80">
                        <template slot-scope="scope">
                            <P>{{scope.row.status==1?'正常':'作废'}}</P>
                        </template>                                 
                    </el-table-column> 
                    <el-table-column
                        label="创建人"
                        prop="creatorName"
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="120">                         
                    </el-table-column>                                                                                            
                    <el-table-column
                        prop="createdAt"
                        label="创建日起"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="140">
                        <template slot-scope="scope">       
                            <el-button
                                    v-if="$authJudge('mobileactivity:activity:cancel')" 
                                    type="text"
                                    class="black-btn"
                                    :disabled="scope.row.status==2?true:false"
                                    @click="dialogSpecialEven(scope.row)">作废本批次</el-button>
                            <el-button
                                    v-if="$authJudge('mobileactivity:activity:info')" 
                                    type="text"
                                    class="black-btn"
                                    @click="shareSpecial(scope.row)">预览</el-button>                                    
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
             width="30%" 
            :close-on-press-escape='false'
            :close-on-click-modal="false"
            :show-close="false"               
            :visible.sync="dialogSpecial">
                <el-row>
                    <el-col>
                        <el-row class="lLine30">
                            <el-col class="lCenter-r">
                                确定要作废这个活动吗？作废该活动移动用户将无法在移动积分商城兑换活动权益，但不会影响已经领取该活动权益的用户！
                            </el-col> 
                        </el-row>
                        <el-row  class="lLine30 lMarginTop40">
                            <el-col class="lCenter-r">
                                <el-button class="redBackColor butColorF" @click="isOkEven">确 定</el-button>
                                <el-button @click="isNoEven">取 消</el-button> 
                            </el-col>                        
                        </el-row>
                    </el-col>
                </el-row>
        </el-dialog>   
        <el-dialog
            title=""
            :visible.sync="specialTypeDetail"
            :close-on-press-escape='false'
            :close-on-click-modal="false"
            :show-close="false"            
            width="40%">
                <el-form ref="form" :model="form" label-width="120px" :rules="rules" >
                    <el-form-item label="活动名称" class="form-name" prop="title">
                        <el-input placeholder="" style="width:250px;" v-model="form.title" maxlength="20"></el-input>
                        <p class="num">{{form.title.length}}/20</p>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-radio-group v-model="form.type">
                            <el-radio label="1">多课</el-radio>
                            <el-radio label="2">单课</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="选择课程" required>
                        <el-button type="primary" @click="curseclick">选择</el-button>
                        <p v-show="form.courseIds">已选择:{{form.courseIds.length}}门课程</p>
                        <p class="redFontColor" v-show="couserBool">
                            *请添加课程
                        </p>                        
                    </el-form-item>                    
                    <el-form-item label="课程有效期" class="form-professional" prop="validityDay">
                        <el-input placeholder="≥1≤730,0为无限制" style="width:160px;" v-model.number="form.validityDay" maxlength="3"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" class="form-intro">
                        <el-input type="textarea" style="width:70%;" show-word-limit v-model="form.desc" :autosize="{ minRows: 4}" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="specialTypeEven('form')">确定</el-button>
                        <el-button @click="specialTypeEven('resetForm')">取消</el-button>
                    </el-form-item>                    
                </el-form>
        </el-dialog> 
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="false"
        width="30%"
        >
            <div class="centerCss">
                <courseListPlugin v-if="dialogVisibleFour" :urlPorp="urls" :varObjs='varObj' :chooseIdlist="form.courseIds" :numbersBool="numbersBool" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>      
            </div>                    
        </el-dialog>   
        <el-dialog
        :visible.sync="dialogVisibleOne"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        width="50%"
        >            
                <el-row>
                    <el-col :span="20">
                            <el-input v-model.trim="searchContent"
                            style="width:200px"
                            placeholder="输入手机号/移动订单号"
                            class="search-form"
                            clearable
                            maxlength="50">
                        </el-input>                
                        <el-date-picker
                            v-model="beginTwo"
                            @change="pickerBegin(beginTwo,2)"
                            style="width:150px"
                            type="date"
                            placeholder="开始时间">
                            </el-date-picker>  
                            <div style="display: inline-block;">-</div>
                            <el-date-picker
                            v-model="endTwo"
                            @change="pickerEnd(endTwo,2)"
                            style="width:150px"
                            type="date"
                            placeholder="结束时间">
                        </el-date-picker>
                        <el-button type="primary" @click="seachChild">查询</el-button>
                    </el-col>
                    <el-col :span="4" style="text-align: right;">
                        <el-button type="primary" @click="exportList" v-if="$authJudge('mobileactivity:activity:export')">导出</el-button>
                    </el-col>
                </el-row>
                <el-table
                :data="tableDataNext"
                border
                v-loading="loading1"
                style="width: 100%;margin-top:20px;">
                    <el-table-column
                        prop="sortId"
                        label="序号 "
                        align="center"
                        min-width="50">
                    </el-table-column>                
                    <el-table-column
                        prop="phone"
                        label="兑换账号 "
                        align="center"
                        min-width="160"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="移动订单号"
                        prop="mobileOrder"
                        align="center"
                        show-overflow-tooltip
                        min-width="160">                         
                    </el-table-column>  
                    <el-table-column 
                        align="center"
                        v-if="courseState"
                        label="学习卡号"
                        prop="cardNo"
                        min-width="160"
                        show-overflow-tooltip>                                
                    </el-table-column>   
                    <el-table-column 
                        prop="courseName"
                        align="center"
                        label="兑换权益"
                        min-width="200"
                        show-overflow-tooltip>                                
                    </el-table-column> 
                    <el-table-column
                        label="有效期"
                        prop="validityDay"
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="150"> 
                        <template slot-scope="scope">
                            {{scope.row.validityDay}}天
                        </template>                                                  
                    </el-table-column>                                                                                            
                    <el-table-column
                        prop="price"
                        label="兑换金额"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>                                                                                             
                    <el-table-column
                        prop="createdAt"
                        label="兑换日期"
                        align="center"
                        min-width="160"
                        >
                    </el-table-column>                                                                              
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue1"
                        :current-page.sync="pageAtion1.paginationPage"
                        :total="pageAtion1.pageTotal">
                    </el-pagination>
                </div>  
        </el-dialog>                                 
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
// import courseselect from "@/components/Appconfigpage/ACourseSelect/coursesselect"; //推存选择课程组件
// import giveCoursecret from './giveCoursecret';
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
import eventAction from '../lEventAtion';
let actions = new eventAction()
export default {
    components:{
        breadcrumb,
        // giveCoursecret
        courseListPlugin
    },    
    data(){
        let valiNumber = (rule, value, callback) => {
            value = value + "";
            switch (rule.fullField) {
                case "validityDay":
                    if (value === "") {
                        callback(new Error("课程有效期不能为空"));
                        break;
                    } else if (!/^\d+$/.test(value)) {
                        callback(new Error("格式错误"));
                        break;
                    } 
                    else if (Number(value) >730) {
                        callback(new Error("课程有效期值错误不大于730"));
                    }else{
                        callback(); 
                    }
                    break;        
                default:
                    break;
            }
            callback();
        };        
        return {
            tableData:[],
            tableDataNext:[],
            loading:false,
            loading1:false,
            title:'',
            titleList:[
                {
                    name:'移动积分管理',
                    pathInfo:''
                },
                {
                    name:'移动积分活动',
                    pathInfo:''
                }               
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            pageAtion1:{
                pageTotal:0,
                paginationPage:1
            },
            dialogSpecial:false,
            specialTypeDetail:false,
            pageSize:10,
            pageNo:1,
            pageNo1:1,
            mType:'',
            courseLabelList:[               
                {
                    name:'多课',
                    value:1
                },
                {
                    name:'单课',
                    value:2
                }                
            ],
            typeCreat:1,
            //ljm
            begin:'',
            end:'',
            beginTwo:'',
            endTwo:'',
            form:{
                title:'',
                validityDay:'',
                desc:'',
                type:'1',
                courseIds:[],
            },
            rules:{
                title:[
                    { required: true, message: '输入活动名称', trigger: 'blur' },
                ],
                validityDay:[
                    { required: true, message: '请输入课程有效期', trigger: 'blur',validator: valiNumber, },
                ],
                type: [
                    { required: true, message: '请选择类型', trigger: 'change' }
                ]
            },     
            dialogVisibleFour:false,
            dialogVisibleOne:false,
            // urls:'/course/getList',
            urls:'/course/getOurCoursesUse',
            //新组建
            varObj:{
                mtypeText:true,
                pageType:true,//是否分页
                isNothirdParty:true,//不需要第三方选项
                coursrTitleStr:'title',
                selectisNoMtype:true
            },
            courseselectType:"coupon",
            couserBool:false,
            numbersBool:false,
            courseState:true,
            chooseData:'',
            searchContent:'',
            disabledState:false                       
        }
    },
    created(){         
        this.getStudylist(1);     
    },
    props:[],
    computed:{    
    },     
    methods:{
        //导出
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
        //导出
        exportList(){
                var self = this;
                var parems = {
                    token:getToken(),
                    id:self.chooseData.id,
                    searchContent:self.searchContent,
                    beginTime:actions.formatDate(self.beginTwo,'begin'),
                    endTime:actions.formatDate(self.endTwo,'end')
                };
                self.download2(self.$server.exportInfoPageMobileActivity(parems)); 
        }, 
        listSelectEven(data){
            var self = this;
            self.form.courseIds = [];
            self.courseList = data.datas;
            self.dialogVisibleFour = false;
            if(self.courseList&&self.courseList.length){
                self.couserBool = false;
            }
            data.datas.forEach(element => {
                self.form.courseIds.push(element.content);
            });         
        },        
        //选择课程
        curseclick(){
            this.dialogVisibleFour = true;     
        }, 
        //开始时间
        pickerBegin(val,type){
            const beginData = Number(val);
            if(type==1){
                let endData = Number(this.end);
                if(beginData>endData){
                    this.end = '';
                }
            }else{
                let endData = Number(this.endTwo);
                if(beginData>endData){
                    this.endTwo = '';
                }
            }
        },
        //结束时间 
        pickerEnd(val,type){
            const endData = Number(val);
            if(type==1){
                let beginData = Number(this.begin);
                if(beginData>endData){
                    this.end = '';
                }
            }else{
                let beginData = Number(this.beginTwo);
                if(beginData>endData){
                    this.endTwo = '';
                }
            }
        },        
        specialTypeEven(formName){
            var self = this;
            if(formName!='resetForm'){
                if(self.form.courseIds.length==0){
                    self.couserBool = true;
                    return;                  
                }else{
                    self.couserBool = false;
                }            
                self.$refs[formName].validate((valid) => {
                if (valid) {
                        const query = {
                                title:self.form.title,
                                type:self.form.type,
                                validityDay:self.form.validityDay,
                                desc:self.form.desc,
                                courseIds:self.form.courseIds
                        }    
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;
                            self.$http.post(self.$server.setMobileActivity,query).then(res=>{
                                if(res.status==200){
                                    self.specialTypeDetail = false;
                                    self.disabledState = !self.disabledState;
                                    self.form={
                                            title:'',
                                            validityDay:'',
                                            desc:'',
                                            type:'1',
                                            courseIds:[],
                                        };              
                                    self.$message.success('创建活动成功');                    
                                    self.getStudylist(1);  
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
            }else{
                self.specialTypeDetail = false;
                self.form={
                        title:'',
                        validityDay:'',
                        desc:'',
                        type:'1',
                        courseIds:[],
                    };                
            }
         
            
        },
        dialogSpecialEven(data){
            this.chooseData = data;
            this.dialogSpecial = true;
        },     
        removeSpecial(){
            var self = this;
            self.loading = true; 
            this.$http.post(`${this.$server.removeMobileActivity}${self.chooseData.id}`,{}).then(res=>{
               if(res.status==200){
                   this.dialogSpecial = false;
                   this.getStudylist(self.pageNo);  
               }
            })            
        },
        shareSpecial(data){
            var self = this;  
            this.chooseData = data;
            this.dialogVisibleOne = true;   
            this.searchContent = '';
            this.beginTwo='';
            this.endTwo='';
            if(data.type==1){
                this.courseState = true; 
            }else{
                this.courseState = false; 
            }
            this.getMoblilelist(1);
        },
        isNoEven(){
            this.dialogSpecial = false;
        },
        isOkEven(){
            this.removeSpecial();          
        },
        regularState(data){
            var regEn = new RegExp("[`~!@#$^&*%()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"),
                reg = /^(?!.*\\.*$)/,
                reg1 = /^(?!.*\/\.*$)/;
                if(regEn.test(data)||!reg.test(data)||!reg1.test(data)){   
                    return true;
                }else{
                    return false;
                }
        },
        getMoblilelist(num){
            var self = this;            
            if(num){
                self.pageNo1 = num;
            }
            self.loading1 = true; 
            const query = {
                params:{
                    pageNo:self.pageNo1,
                    pageSize:self.pageSize,
                    searchContent:self.searchContent,
                    beginTime:actions.formatDate(self.beginTwo,'begin'),
                    endTime:actions.formatDate(self.endTwo,'end')
                }
            }            
            self.$http.get(`${this.$server.getInfoPageMobileActivity}${self.chooseData.id}`,query).then(res=>{
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
                    self.tableDataNext = listIds;
                    self.pageAtion1.pageTotal = contentdate.total;
                    self.pageAtion1.paginationPage = num;
                    self.$nextTick(function(){
                        self.loading1 = false; 
                    }) 
               }
                console.log(res);
            })            
        },
        getStudylist(num){
            var self = this;    
            if(self.title!=''){
                if(self.regularState(self.title)){
                    self.tableData = [];
                    self.pageAtion.pageTotal = 0;
                    self.pageAtion.paginationPage = 0;                
                    return;
                }
            }        
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            const query = {
                params:{
                    title:self.title,
                    pageNo:self.pageNo,
                    pageSize:self.pageSize,
                    type:self.mType,
                    beginTime:actions.formatDate(self.begin,'begin'),
                    endTime:actions.formatDate(self.end,'end')
                }
            }            
            self.$http.get(self.$server.getPageMobileActivity,query).then(res=>{
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
                console.log(res);
            })            
        },         
        releaseSpecial(){

            this.specialTypeDetail = true;
        },         
        seach(){
            this.getStudylist(1);
        },
        seachChild(){
            this.getMoblilelist(1)
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        },
        childPageValue1(num){
            if(Number(num)>0){
                this.getMoblilelist(Number(num))
            }
        }             
    },
    watch: {
        'form.type': {
            handler: function(val) {
                if(val=="1"){
                    this.numbersBool = false;
                }else{
                    this.numbersBool = 1;
                }
                //do something
            },
        }
    }, 
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
.num{
    display: inline-block;
    vertical-align: middle;
    color:#666666;
    margin:0 20px 0 10px;
}    
</style>


