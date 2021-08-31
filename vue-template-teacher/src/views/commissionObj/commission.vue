<template>
    <div>  
        <div v-show="!posters">      
            <el-row class="lLine40 headerDiv">
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
                <el-col class="lMarginTop20">
                    <el-row :gutter="20">
                        <el-col :span="5">
                            <div class="iSeachEven">
                                <el-input v-model.trim="title"
                                        placeholder="请输入课程名称查询"
                                        class="search-form"
                                        width="100%"
                                        clearable
                                        maxlength="20"
                                        @keyup.native="proving1"
                                        ></el-input>
                            </div>
                        </el-col>
                        <el-col :span="3" class="lCenter-r">
                            <el-select v-model="courseStatus" placeholder="请选择">
                                <el-option
                                v-for="item in optionsType"
                                :key="item.value"
                                :label="item.lable"
                                :value="item.value">
                                </el-option>
                            </el-select>    
                        </el-col>
                        <el-col :span="3" class="lCenter-r">
                            <el-select v-model="startEndStatus" placeholder="请选择">
                                <el-option
                                v-for="item in startEndStatusList"
                                :key="item.value"
                                :label="item.lable"
                                :value="item.value">
                                </el-option>
                            </el-select>     
                        </el-col>                        
                        <el-col :span="2" v-if="$authJudge('market:commission:select')"><el-button class="redBackColor butColorF" @click="seach">查询</el-button></el-col>
                        <el-col :span="11" style="text-align: right;">
                            <el-button v-if="$authJudge('market:commission:add')" class="redBackColor butColorF" @click="addChanneCourse">添加课程</el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-table
                    border
                    :data="tableData"
                    v-loading="loadingOne"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="60"
                        :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                        prop="courseName"
                        label="课程名称"
                        min-width="150"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        min-width="80"
                        label="课程价格"
                        align="center"
                        show-overflow-tooltip>
                            <template slot-scope="scope">
                                <p>￥{{scope.row.coursePrice}}</p>                                                     
                            </template>                     
                    </el-table-column>
                    <el-table-column
                        prop="tearcherNames"
                        label="老师"
                        min-width="100"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="updatedAt"
                        label="更新时间"
                        min-width="120"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="课程类别"
                        min-width="80"
                        align="center"
                        show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col>
                                        {{scope.row.courseType==1?'视频':'音频'}}
                                    </el-col>
                                </el-row>                                                      
                            </template>                     
                    </el-table-column>
                    <el-table-column
                        prop="periodNum"
                        label="课时数"
                        min-width="60"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="proportion"
                        label="佣金"
                        min-width="50"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column> 
                    <el-table-column
                        label="生成海报"
                        min-width="80"
                        align="center"
                        show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col>
                                        {{scope.row.isOpen==1?'是':'否'}}
                                    </el-col>
                                </el-row>                                                      
                            </template>                         
                    </el-table-column>                                   
                    <el-table-column
                        fixed="right"
                        label="操作"
                        align="center"
                        min-width="200">
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col :span="6">
                                        <el-button v-if="$authJudge('market:commission:forbidden')" v-show="scope.row.status==1" type="text" class="black-btn" @click="channeRemoveBatch(scope.row)">禁用</el-button>
                                        <el-button v-if="$authJudge('market:commission:open')" v-show="scope.row.status!=1" type="text" class="black-btn" @click="channeRemoveBatch(scope.row)">启用</el-button>
                                    </el-col>                                
                                    <el-col :span="6">
                                        <el-button v-if="$authJudge('market:commission:detailed')" type="text" class="black-btn" @click="channeDetails(scope.row)">明细</el-button>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button v-if="$authJudge('market:commission:edit')" type="text" class="black-btn" @click="channeUpdateEven(scope.row)">修改</el-button>
                                    </el-col>       
                                    <el-col :span="6">
                                        <el-button v-if="$authJudge('market:commission:poster')" type="text" class="black-btn" @click="creatPosterEven(scope.row)">海报</el-button>
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
            :visible.sync="centerDialogVisible"
            title=""
            max-height="300"
            width="50%">
            <!-- v-if="dialogBool"   -->
                <el-row>
                    <el-col class="lCenter-r" style="marginBottom:10px">佣金明细</el-col>
                    <el-row>
                        <el-col :span="18">
                            <el-date-picker
                                v-model="detailsStartDate"
                                type="datetime"
                                size="small"
                                class="small-date-box"
                                placeholder="开始时间">
                            </el-date-picker>
                            <span>至</span>
                            <el-date-picker
                                v-model="detailsEndDate"
                                type="datetime"
                                size="small"
                                class="small-date-box"
                                :picker-options="pickerOptions"
                                placeholder="结束时间">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="6" style="textAlign:right">
                            <el-button size="small" type="primary" @click="searchDetails">查询</el-button>
                            <el-button size="small" type="primary" @click="exportDetails" :disabled="tableDataNext.length==0?true:false">导出</el-button>
                        </el-col>
                    </el-row>
                    <el-col class="lMarginTop20">
                        <el-table
                            border
                            :data="tableDataNext"
                            v-loading="loadingTwo"
                            style="width: 100%"
                            :height="300">
                            <el-table-column
                                prop="sortId"
                                label="序号"
                                align="center"
                                min-width="50">
                            </el-table-column>
                            <el-table-column
                                prop="sharePhone"
                                label="分享者"
                                align="center"
                                min-width="100"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="integralOperationTypeName"
                                label="行为"
                                align="center"
                                min-width="80">
                                    <template slot-scope="scope">
                                        <el-row :gutter="10"> 
                                            <el-col class="lCenter-r">
                                                {{scope.row.type==1?'分享购课':'新拉用户'}}
                                            </el-col>
                                        </el-row>                                                      
                                    </template>                             
                            </el-table-column>
                            <el-table-column
                                prop="courseName"
                                label="对象"
                                min-width="80"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>    
                            <el-table-column
                                prop="buyPhone"
                                label="购买者"
                                align="center"
                                min-width="100"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="orderNo"
                                label="订单号"
                                align="center"
                                min-width="180"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="createdAt"
                                label="行为时间"
                                align="center"
                                min-width="120">
                            </el-table-column>                                                                                            
                            <el-table-column
                                prop="commissionPrice"
                                label="佣金"
                                align="center"
                                min-width="80">
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
            </el-dialog>      
            <el-dialog
            :visible.sync="centerDialogUpdate"
            :close-on-click-modal='false'
            title=""
            max-height="300"
            width="35%">  
                <el-row>
                    <el-col class="lCenter-r">修改课程佣金</el-col>
                    <el-col class="lMarginTop30">
                        <el-row :gutter="20" class="lLine40">
                            <el-col :span="8" >{{updateCourseName}}</el-col>
                            <el-col :span="3" >{{updateProportionInfo}}</el-col>
                            <el-col :span="13">
                                <el-row :gutter="10" >
                                    <el-col :span="6">修改为</el-col>
                                    <el-col :span="14">
                                        <el-row :gutter="10" class="lLine40">
                                            <el-col :span="20">                                    
                                                <el-input type="text" @keyup.native="provingUpdate" v-model="updateProportion" ></el-input>
                                            </el-col>
                                            <el-col :span="4">%</el-col> 
                                            <el-col class="lSize12">佣金比例最高不超过40%</el-col> 
                                        </el-row>                                  
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button type="text" @click="channeSave()">保存</el-button>
                                    </el-col>
                                </el-row>                            
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-dialog>
            <el-dialog
            :visible.sync="centerDialogRemove"
            :title="endId==1?'佣金禁用':'佣金启用'"
            max-height="300"
            width="35%">  
                <el-row>
                    <el-col class="lCenter-r">{{startOrEndTitle}}</el-col>
                    <el-col class="lMarginTop30">
                        <el-row>
                            <el-col :span="3" class="lCenter-r" :offset="9">
                                <el-button @click="removeIsNo()">取消</el-button>
                            </el-col>
                            <el-col :span="3" class="lCenter-r">
                                <el-button class="redBackColor butColorF" @click="removeIsOk()">确定</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-dialog>         
            <el-dialog
            :visible.sync="centerDialogChoose"
            title=""
            max-height="300"
            width="35%">  
                <el-row>
                    <el-col class="lCenter-r">添加课程</el-col>
                    <el-col class="lMarginTop30">
                        <el-row :gutter="20">
                            <el-col :span="11" class="lLine30" :offset="1">
                                <el-select v-model="courseAddId" placeholder="请选择" style="width:100%">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.courseId"
                                    :label="item.courseName"
                                    :value="item.courseId">
                                    </el-option>
                                </el-select>                            
                            </el-col>
                            <el-col :span="11">
                                <el-row :gutter="10" class="lLine40">
                                    <el-col>
                                        <el-row :gutter="10" >
                                            <el-col :span="20">
                                                <el-input v-model="inputProportion"                                     
                                                maxlength="2"
                                                @keyup.native="proving"
                                                placeholder="佣金设置"></el-input>                                            
                                            </el-col>
                                            <el-col :span="4">%</el-col>
                                        </el-row>
                                    </el-col>
                                    <el-col class="lSize12">
                                        佣金比例最高不超过40%
                                    </el-col>                                                                 
                                </el-row>                            
                            </el-col>
                            <el-col class="lCenter-r lMarginTop30">
                                <el-button class="redBackColor butColorF" @click="addCourseEven">确定</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-dialog>     
        </div>
        <div v-show="posters" class="lPadding50 positionCss">
            <div class="absoluteCss" v-show="loadings">
                <i class="el-icon-loading lSize40"></i>
            </div>
            <el-row>
                <el-col :span="13" class="lPadding30">
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="功能开关:" prop="resource">
                            <el-radio-group v-model="ruleForm.resource">
                                <el-radio :label="1">开</el-radio>
                                <el-radio :label="0">关</el-radio>
                            </el-radio-group>
                        </el-form-item>   
                        <el-form-item label="海报样式:" prop="region">
                            <el-select v-model="ruleForm.region" placeholder="请选择海报样式" @change="selectChoosevalue">
                                <el-option :label="items.name" :value="items.value" v-for="items,index in regionOptions" :key="index"></el-option>
                            </el-select>                            
                        </el-form-item>                                              
                        <el-form-item label="标题:" prop="title">
                            <el-input type="text" maxlength="20" v-model="ruleForm.title"></el-input>
                            <p class="lSize12">限20个字以内，添写的文字将在标题区显示</p>
                        </el-form-item>
                        <el-form-item label="文字描述区" prop="description">
                            <el-input 
                            type="textarea" 
                            maxlength="100"
                            :autosize="{ minRows: 8}"
                            v-model="ruleForm.description"></el-input>
                            <p class="lSize12">限100字以内</p>
                        </el-form-item>
                        <el-form-item>
                            <el-button style="margin-left:20%;" @click="cancelDilog()">返回列表</el-button>
                            <!-- :disabled="submitLoading" -->
                            <el-button style="margin-left:10%;" :loading="submitLoading" class="redBackColor butColorF" @click="submitForm('ruleForm')">生成海报</el-button>
                        </el-form-item>                        
                    </el-form>                     
                </el-col>
                <el-col :span="11"  class="lPadding30" style="border-left: 1px solid #FFF;">
                    <div style="width:375px;height:667px;">
                        <div :id="'imgPhoto'+ruleForm.region" class="styleUnified imgOne positionCss" v-if="ruleForm.region==1">
                            <img :src="poster1" class="poster-bgd"/>
                            <div class="lCenter-r lSize24 lweightOne item">
                                <p class="lPadding10 styleUnifiedP">{{ruleForm.title}}</p>
                            </div>
                            <div class="imgstyleOne lmarginAuto item">
                                <canvas id='imgPhotoCanvas'></canvas>
                            </div>
                            <div class="lPadding40 lSize16 lCenter-r lLine30 item">  
                                <p id="sizeBrak">{{ruleForm.description}}</p>                             
                            </div>
                            <div id="qrCodeTop"></div>
                        </div>
                        <div :id="'imgPhoto'+ruleForm.region" class="styleUnified imgTwo positionCss" v-else-if="ruleForm.region==2">
                            <img :src="poster2" class="poster-bgd"/>
                            <div class="lCenter-r lSize24 lweightTwo item">
                                <p class="lPadding10 styleUnifiedP">{{ruleForm.title}}</p>
                            </div>
                            <div class="imgstyleOne lmarginAuto item">
                                <canvas id='imgPhotoCanvas'></canvas>
                            </div>
                            <div class="lPadding20 lSize16 lCenter-r lLine30 item">  
                                <p id="sizeBrak">{{ruleForm.description}}</p>                             
                            </div>
                            <div id="qrCodeTop"></div>
                        </div>
                        <div :id="'imgPhoto'+ruleForm.region" class="styleUnified imgThree positionCss" v-else>
                            <img :src="poster3" class="poster-bgd"/>
                            <div class="lCenter-r lSize24 lweightThree item">
                                <p class="lPadding10 styleUnifiedP">{{ruleForm.title}}</p>
                            </div>
                            <div class="imgstyleOne lmarginAuto item">
                                <canvas id='imgPhotoCanvas'></canvas>
                            </div>
                            <div class="lPadding20 lSize16 lCenter-r lLine30 item">  
                                <p id="sizeBrak">{{ruleForm.description}}</p>                             
                            </div>
                            <div id="qrCodeTop"></div>
                        </div>  
                    </div>                                      
                </el-col>
            </el-row>
        </div>                          
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import html2canvas from 'html2canvas';
// import editimg1 from "../../../static/images/4.jpg";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
const poster1 = require('../../../static/images/poster1.png')
const poster2 = require('../../../static/images/poster2.png')
const poster3 = require('../../../static/images/poster3.png')
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
function convertImgToBase64(url, callback, height,width,outputFormat) {
    var canvas = document.getElementById('imgPhotoCanvas'),
    ctx = canvas.getContext('2d'),
    img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        canvas.height = img.height;
        canvas.width = img.width;
        var w = 245/Number(img.width);
        var h = 143/Number(img.height);
        ctx.drawImage(img, 0, 0,img.width,img.height,0,0,img.width*w,img.height*h);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
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
            }
        };                                               
        return {
          title:'',
          tableData: [],
          options:[],
          optionsType:[{value:'',lable:"全部"},{value:1,lable:"视频"},{value:2,lable:"音频"}],
          value: '',
          courseAddId:'',
          courseUpdateId:'',
          removeId:'',
          input:'',
        //   tableData: [],
          tableDataNext:[],
          pageNo:1,
          pageNoDetail:1,
          pageSize:10, 
          pageAtion:{
            pageTotal:0,
            paginationPage:1
          },   
          pageAtionNext:{
            pageTotal:0,
            paginationPage:1
          },  
        courseStatus:'',                  
        centerDialogVisible: false,  
        centerDialogUpdate:false,
        centerDialogChoose:false,
        centerDialogRemove:false,
        // dialogBool:true,
        inputProportion:0,
        updateCourseName:'',
        updateProportionInfo:'',
        updateProportion:'',
        channelIDs:'',
        startEndStatus:-1,
        startEndStatusList:[
            {
                lable:'全部',
                value:-1
            },
            {
                lable:'禁用',
                value:0
            },
            {
                lable:'启用',
                value:1
            }
        ],
        //生成海报
        regionOptions:[
            {
                name:"样式一",
                value:1
            },
            {
                name:"样式二",
                value:2
            },
            {
                name:"样式三",
                value:3
            }           
        ],
        titleList:[
                    {
                        name:'系统合集',
                        pathInfo:'/marketelistlist'
                    },
                    {
                        name:'佣金系统',
                        pathInfo:''
                    }
            ],
        ruleForm: {
            resource:'',
            region:1,
            title:'',
            description:'',
            commissionId:'',
            id:''
        },
        rules: {
            region: [
                 { required: true, message: '请选择海报样式', trigger: 'change' }
            ],  
            resource: [
                { required: true, message: '请选择开关', trigger: 'change' }
            ],                      
            title: [
                {validator: checkAge, trigger: 'blur' }
            ],
            description: [
                { required: true, message: '请填写备注信息', trigger: 'blur' }
            ]
        },
        detailsStartDate:'',
        detailsEndDate:'',
        pickerOptions:{
            disabledDate:(time)=>{
                return time.getTime() < new Date(this.detailsStartDate).getTime()
            },
        },
        disabledState:false,
        posters:false,
        // editimg:editimg1,
        editimg:'',
        listData:'',
        linkImgUrl:'',
        loadings:false,
        loadingOne:false,
        loadingTwo:false,
        qrCodeTopInfo:0,
        startOrEndTitle:'',
        submitLoading:false,
        endId:'',
        flags:[],
        poster1:poster1,
        poster2:poster2,
        poster3:poster3
        //测试截屏
        // dataURL:'',
        }
    },
    components:{
        breadcrumb
    },
    watch:{
        centerDialogVisible(cur,old){
            if(!cur){
                this.detailsStartDate = '';
                this.detailsEndDate = '';
            }
        }
    },    
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        this.flags = this.$getPermissions(routes,currentPath); 
        if(!this.flags){
            this.flags=[];
        } 
        this.getTableList(1);
    },
    methods:{
        cancelDilog(){
            this.posters = false;
        },
        selectChoosevalue(data){
            console.log(data);
            this.ruleForm.region = Number(data);
        },
        courseList(){
            var self = this;
            self.$http.get(self.$server.commissionCourses).then(res=>{
                        if(res.status==200){
                            self.options = res.content;
                        }
                })                              
        },
        addCourseEven(){
            var self = this;
            if(self.courseAddId==""){
                this.$message.error('请选择课程!');
                return;
            }
            if(self.inputProportion==""||self.inputProportion==0){
                this.$message.error('请设置佣金比例.');
                return;
            }
            if(!self.disabledState){
                self.disabledState = !self.disabledState;        
                self.$http.post(self.$server.commissionAdd,{courseId:self.courseAddId,proportion:self.inputProportion}).then(res=>{
                    if(res.status==200){
                        self.disabledState = !self.disabledState;
                        self.centerDialogChoose = false;
                        self.getTableList(1);
                    }
                }).catch(()=>{
                    self.disabledState = !self.disabledState;
                }) 
            }           
        },   
        submitForm(formName) {
            var self = this;
            self.submitLoading = true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    self.qrCodeTopInfo = $("#qrCodeTop").position().top;
                    let dom = document.querySelector('#imgPhoto'+self.ruleForm.region)
                    let width = dom.offsetWidth;
                    let height = dom.offsetHeight;
                    let scale = 2
                    html2canvas(dom,
                    {
                        dpi: window.devicePixelRatio*2,
                        scale:scale,
                        allowTaint:false,
                        width:width,
                        heigth:height,
                        useCORS: true,
                        logging: false,
                        backgroundColor:null,
                    }).then((canvas) => {
                        const context = canvas.getContext('2d');
                        context.mozImageSmoothingEnabled = false;
                        context.webkitImageSmoothingEnabled = false;
                        context.msImageSmoothingEnabled = false;
                        context.imageSmoothingEnabled = false;
                        let saveUrl = canvas.toDataURL('image/png');
                        // window.open(saveUrl)
                        self.sendUrl(saveUrl);
                    })      
                }else{
                    this.submitLoading = false
                }    
            });
         
        },  
        createOrUpdatePosterEven(){
            /*
            commissionId 佣金id
            styleUrl 样式地址
            title 标题
            description 描述
            isOpen 是否开启 0:未开启,1:已开启
            posterUrl 分享地址
            id id
            */
        },
        sendUrl (url64) {
        // 如果图片需要formData格式,就自己组装一下,主要看后台需要什么参数
            var self = this;
            // let file = convertBase64UrlToBlob(url64);
            let file = dataURLtoFile(url64,"jpg");
            let formData = new FormData();
            formData.append('file',file);
            var ss = formData.get('file');
            console.log(ss);
            let config = {
                headers:{'Content-Type':'multipart/form-data'}, //multipart/form-data
                token:getToken()
            }; 
            self.$http.post(self.$server.actionImgOrvideo,formData,config).then(res=>{
                        if(res.status==200){
                            console.log("res",res);                      
                            var params = {
                                commissionId:self.ruleForm.commissionId,
                                styleUrl:self.ruleForm.region,
                                title:self.ruleForm.title,
                                description:self.ruleForm.description,
                                isOpen:self.ruleForm.resource,
                                posterUrl:res.content.resourceUrl,
                                id:self.ruleForm.id,
                                qrCodeTop:(Number(self.qrCodeTopInfo)/667).toFixed(3)
                            };
                            self.imgSendXgx(params);
                        }
            }).catch((err)=>{
                self.submitLoading = false;
            }); 
        },
        imgSendXgx (objs) {
        // 如果图片需要formData格式,就自己组装一下,主要看后台需要什么参数
            var self = this;
            self.$http.post(self.$server.createOrUpdatePoster,objs).then(res=>{
                        if(res.status==200){
                            console.log("成功");
                            console.log("res",res);
                            self.loadings = false;
                            self.posters = false;
                            self.submitLoading = false;
                            this.getTableList(1);
                        }
            }).catch((err)=>{
                self.submitLoading = false;
            }); 
        },        
        getTableList(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loadingOne = true;
            var params = {
                keyWord:self.title,
                pageNo:self.pageNo,
                courseType:self.courseStatus,
                pageSize:self.pageSize,
                status:self.startEndStatus
            };
            self.$http.get(self.$server.commissionList(params)).then(res=>{
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
                    self.loadingOne = false;
               }
                console.log(res);
            })
            .catch(res => {
                    self.loadingOne = false;
            });                        
        },
        seach(){
            this.getTableList(1);
        },
        proving1(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.title)){
                this.title='';
            }            
        },
        provingUpdate(){
            var self = this;
            var rgexp = /^0*?([1-3]\d|[1-9]|40)$/;
            var rgexpBool = rgexp.test(self.updateProportion);
            if(!rgexpBool){
                self.updateProportion = '';
            }            
        },
        proving(){
            var self = this;
            var rgexp = /^0*?([1-3]\d|[1-9]|40)$/;
            var rgexpBool = rgexp.test(self.inputProportion);
            if(!rgexpBool){
                self.inputProportion = '';
            }
        },
        creatPosterEven(data){
            var self = this;
            this.posters = true;
            this.ruleForm.commissionId = data.id;
            self.ruleForm.id = data.posterId;
            self.ruleForm.title = data.title;
            self.ruleForm.region = Number(data.styleUrl)||1;
            self.ruleForm.resource = Number(data.isOpen);
            self.ruleForm.description =data.description;
            // this.linkImgUrl = "data:image/png;base64,"+data.courseImgUrlBase64;

            convertImgToBase64(data.courseImgUrl, function(base64Img) {
                // Base64DataURL
                self.linkImgUrl = base64Img;
            },143,245);
        },
        //积分详情
        channeDetails(date){
            var self = this;
            self.channelIDs = date.id;
            self.queryDeatilList(1);
            self.centerDialogVisible = true;
        },       
        channeUpdateEven(data){
            this.updateCourseName = data.courseName;  
            this.updateProportionInfo = data.proportion;
            this.updateProportion = parseInt(data.proportion);  
            this.courseUpdateId = data.id;     
            this.centerDialogUpdate=true;
        },
        channeSave(){
            var self = this;
            self.$http.post(self.$server.commissionUpdate,{id:Number(self.courseUpdateId),proportion:Number(self.updateProportion)}).then(res=>{
                        if(res.status==200){
                            self.centerDialogUpdate = false;
                            self.getTableList(1);
                        }
            })            
        },
        channeRemoveBatch(data){
            this.removeId = data.id;
            this.endId = data.status;
            if(data.status==1){
                this.startOrEndTitle = '确定要禁用当前佣金信息。';
            }else{
                this.startOrEndTitle = '确定要启用当前佣金信息。';
            }
            this.centerDialogRemove=true;
        },
        removeIsNo(){
            this.centerDialogRemove=false;
        },
        removeIsOk(){
            var self = this;
            // self.$http.post(self.$server.commissionDel({id:self.removeId})).then(res=>{
            //             if(res.status==200){
            //                 self.centerDialogRemove = false;
            //                 self.getTableList(1);
            //             }
            // })           
            //  
            var id = '';
            if(self.endId==1){
                id = 0;
            }else{
                id=1;
            }
            var params = {enable:id,id:self.removeId};
            self.$http.post(self.$server.commissionEnable(params)).then(res=>{
                        if(res.status==200){
                            self.centerDialogRemove = false;
                            self.getTableList(1);
                        }
            })             
            self.centerDialogRemove=false;
        },
        addChanneCourse(){
            this.courseAddId = '';
            this.inputProportion = '';
            this.courseList();
            this.centerDialogChoose = true;
        },
        //继续查询详情
        queryDeatilList(num){
            var self = this;
            self.tableDataNext = [];
            if(num){
                self.pageNoDetail = num;
            }            
            self.loadingTwo = true;
            var params = {
                pageNo:self.pageNoDetail,
                id:self.channelIDs,
                pageSize:self.pageSize
            };
            self.$http.get(self.$server.commissionDetail(params)).then(res=>{
               if(res.status==200){
                   if(res.content.list.length>0){
                    // self.dialogBool = true;
                    var listIds = [];
                    var contentdate = res.content;
                    var nextPage = contentdate.nextPage;
                    var prePage = contentdate.prePage;
                        if(contentdate.list.length){
                            // if(!nextPage&&prePage!=0){
                            //         listIds = contentdate.list.map(function(element,index){
                            //             element.sortId = contentdate.total-prePage*10-index;
                            //             return element;
                            //         });
                            //     }else if(!prePage&&!nextPage){
                            //         listIds = contentdate.list.map(function(element,index){
                            //             element.sortId = contentdate.total-index;
                            //             return element;
                            //         });
                            //     }else{
                            //         listIds = contentdate.list.map(function(element,index){
                            //             element.sortId = contentdate.total-prePage*10-index;
                            //             return element;
                            //         });                            
                            //     } 
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
                        self.tableDataNext = listIds;
                        self.pageAtionNext.pageTotal = contentdate.total;
                        self.pageAtionNext.paginationPage = num;
                        self.loadingTwo = false;
                   }else{
                       self.loadingTwo = false;
                   }
               }
                console.log(res);
            })
            .catch(res => {
                    self.loadingTwo = false;
            });               
        },        
        childPageValueNext(num){
            if(Number(num)>0){
                this.queryDeatilList(Number(num))
            }
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getTableList(Number(num))
            }
        },
        searchDetails(){
            this.pageNoDetail = 1;
            let query = {
                params:{
                    pageNo:this.pageNoDetail,
                    beginAtStr:this.detailsStartDate==''||this.detailsStartDate==null?'':new Date(this.detailsStartDate).toLocaleString(),
                    endAtStr:this.detailsEndDate==''||this.detailsEndDate==null?'':new Date(this.detailsEndDate).toLocaleString(),
                    pageSize:this.pageSize
                }
            }
            this.$http.get(`/commission/${this.channelIDs}/detail`,query).then(res=>{
                if(res.status==200){
                    this.tableDataNext = res.content.list.map((item,index)=>{
                        if(res.content.pageNum==1){
                            item.sortId = index+1;
                            return item;
                        }else if(res.content.pageNum>1){
                            item.sortId = (res.content.pageNum-1)*10+index+1;
                            return item;
                        }
                    })
                    this.pageAtionNext.pageTotal = res.content.total;
                    this.pageAtionNext.paginationPage = this.pageNoDetail;
                    this.loadingTwo = false;
                }
            })
        },
        exportDetails(){
            let beginAtStr = this.detailsStartDate==''||this.detailsStartDate==null?'':new Date(this.detailsStartDate).toLocaleString();
            let endAtStr = this.detailsEndDate==''||this.detailsEndDate==null?'':new Date(this.detailsEndDate).toLocaleString();
            let url = `${this.$server.exportCommissionRecordPage}/${this.channelIDs}?beginAtStr=${beginAtStr}&endAtStr=${endAtStr}&token=`+getToken();
            window.open(url)
        }                
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
.black-btn{
    margin: auto;
    display: block;
}
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }
.lweightOne{
       padding: 90px 0px 23px 0px;
    }
.lweightTwo,.lweightThree{
    padding: 47px 0px 21px 0px;
}
.poster-bgd{
    width: 375px;
    height: 667px;
    position: absolute;
    z-index: 1;
    top:0;
    left: 0;
}
.item,#qrCodeTop{
    position: relative;
    z-index: 2;
}
// .positionCss>div{
//     position: relative;
//     z-index: 2;
// }
.imgOne{
    width: 375px;
    height: 667px;
    background: #fff;
    // background: url(../../../static/images/poster1.png) no-repeat;
    // background-size:100% 100%;
    // vertical-align:bottom;
    display:block;    
}
.imgTwo{
    // border: 1px solid #ccc;
    width: 375px;
    height: 667px;
    background: #fff;
    // background: url(../../../static/images/poster2.png) no-repeat;
    // background-size:100% 100%;
    // vertical-align:bottom;
    display:block;
}
.imgThree{
    // border: 1px solid #ccc;
    width: 375px;
    height: 667px;
    
    // background: url(../../../static/images/poster3.png) no-repeat;
    // background-size:100% 100%;
    // vertical-align:bottom;
    display:block;
}
#sizeBrak{
    word-wrap: break-word;
    word-break: break-all;
    // width: 100%;
    overflow: hidden;
}
.imgOne .imgstyleOne,.imgTwo .imgstyleOne,.imgThree .imgstyleOne{
    width: 245px;
    height: 143px;
}
.absoluteCss{
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    z-index: 2;
    background-color:rgba(0,0,0,0.1);
}
.absoluteCss i{
    margin-top: 30%;
}
.small-date-box{
    width:200px;
}
</style>
<style>
/* body .el-table th.gutter {
    display: table-cell !important
} */
</style>



