<template>
    <div>
        <div>
            <Breadcrumb :menuList ='titleList' style="margin-bottom:20px"></Breadcrumb>
            <el-form ref="form" 
                    v-loading = "loadDailg"
                    :model="form" 
                    label-width="100px" 
                    label-position="right"
                    class="module-details"
                    :rules="rules"
                    >
                    <h3 class="module-title">基础信息</h3>
                    <section class="form-module fontCss14">
                        <el-form-item label="名称" prop="activityName">
                            <el-row>
                                <el-col :span="11"><el-input v-model="form.activityName" maxlength="20" placeholder="请填写名称"></el-input></el-col>
                                <el-col :span="1" class="lCenter-r butColor6">{{textlengths}}/20</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="类型" prop="type">
                            <div class="positionCss">
                                <i class="absoluteCss el-icon-question mouseOver" title="自动和半自动的区别是,用户在H5页面选择年级和非选择年级"></i>
                            </div>                            
                            <el-radio-group v-model="form.type" @change="radioEven">
                                <el-radio :label="1">自动</el-radio>
                                <el-radio :label="2">半自动</el-radio>
                            </el-radio-group>
                        </el-form-item>                        
                        <el-form-item label="选择地区" required>
                            <el-row :gutter="10">
                                <el-col :span="4">
                                    <el-form-item prop="provinceId">
                                        <el-select v-model="form.provinceId"
                                            placeholder="选择省/市"
                                             @change="getProvince(form.provinceId)"
                                            >
                                            <el-option v-for="(item,i) in provinceList"
                                                :key="i"
                                                :label="item.label"
                                                :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>                                                                       
                                </el-col>
                                <el-col :span="4" >
                                    <el-form-item prop="cityId">
                                        <el-select v-model="form.cityId"
                                            placeholder="选择市"
                                            @change="getCity(form.cityId)"
                                            >
                                            <el-option v-for="(item,i) in cityList"
                                                :key="i"
                                                :label="item.label"
                                                :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>   
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item prop="areaId">
                                        <el-select v-model="form.areaId"
                                            @change="getAreaId(form.areaId)"
                                            placeholder="选择区">
                                            <el-option v-for="(item,i) in areaList"
                                                :key="i"
                                                :label="item.label"
                                                :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>                                                                      
                                </el-col>
                            </el-row>                            
                        </el-form-item>
                        <el-form-item label="选择学段" prop="periodId">
                            <el-row>
                                <el-col :span="4">
                                    <el-select v-model="form.periodId"
                                        :disabled="disabledType4"
                                        @change="periodIdEven(form.periodId)"
                                        placeholder="选择学段">
                                        <el-option v-for="(item,i) in typeList"
                                            :key="i"
                                            :label="item.label"
                                            :value="item.value"></el-option>
                                    </el-select>                                    
                                </el-col>
                            </el-row>
                        </el-form-item>                         
                        <el-form-item label="选择学校" prop="schooleId">
                            <el-row>
                                <el-col :span="4">
                                    <el-select v-model="form.schooleId"
                                        :disabled="disabledType1"
                                        v-loadmore="loadMore"
                                        @change="getSchoolId(form.schooleId)"
                                        placeholder="选择学校">
                                        <el-option v-for="(item,i) in schoolList"
                                            :key="i"
                                            :label="item.name"
                                            :value="item.id"></el-option>
                                    </el-select>                                    
                                </el-col>
                            </el-row>
                        </el-form-item>  
                        <el-form-item label="选择年级" prop="gradeId" v-if="!disabledType3">
                            <el-row>
                                <el-col :span="4">
                                    <el-select v-model="form.gradeId"
                                        clearable
                                        :disabled="disabledType2"
                                        placeholder="选择年级">
                                        <el-option v-for="(item,i) in gradeList"
                                            :key="i"
                                            :label="item.name"
                                            :value="item.id"></el-option>
                                    </el-select>                                    
                                </el-col>
                            </el-row>
                        </el-form-item>                                              
                        <el-form-item label="识别码" prop="code">
                            <el-row>
                                <el-col :span="4"><el-input placeholder=" " maxlength="7" v-model="form.code"></el-input></el-col>
                                <el-col :span="10" class="lLeft-r lPaddingRF10 butColor6">7位数字、字母（小写）或数字字母组合</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="课程有效期" prop="validDays">
                            <el-row>
                                <el-col :span="4"><el-input maxlength="3" v-model.number="form.validDays" placeholder="≥1≤730,0为无限制"></el-input></el-col>
                                <el-col :span="1" class="lCenter-r butColor6">天</el-col>
                            </el-row>                        
                        </el-form-item>
                        <el-form-item label="选择课程" required>
                            <el-row>
                                <el-col :span="3">
                                    <el-button class="lButtom" @click="curseclick">选择课程</el-button>
                                </el-col>
                                <el-col :span="6" class="lLeft-r" style="color: #F56C6C;font-size: 12px;" v-show="couserBool">
                                    *请添加课程
                                </el-col>
                                <el-col :span="6" class="lLeft-r" style="font-size: 12px;" v-show="!couserBool">
                                    已添加 <span style="color: #F56C6C;">{{courseList.length||0}}</span> 门课程
                                </el-col>                                
                            </el-row>        
                        </el-form-item>                  
                    </section>
                    <el-row>
                        <el-col class="lCenter-r">
                            <el-button class="lButtomOk lMarginTB50" @click="submitForm('form')">确定</el-button>
                            <el-button class="lButtomNo lMarginTB50" @click="returnpage">取消</el-button>
                        </el-col>
                    </el-row>                
            </el-form>         
        </div>      
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-press-escape="false"
        :close-on-click-modal="false"        
        width="40%"
        >
            <div class="centerCss">
                <courseListPlugin  v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIds" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>                
            </div>                    
        </el-dialog>        
        <Dialog 
                :showFlag.sync="editsObj.showFlag"
                :title="editsObj.title"
                :cancelName="editsObj.cancelName"
                :sureName="editsObj.sureName"
                v-on:editObjNos="couponEditObjNo"
                v-on:editObjOks="couponEditObjOk">
                <el-row slot="dialog-body" class="lLine30">
                    <el-col class="lCenter-r">
                          您有未保存的信息，离开会丢失，确定要离开吗？
                    </el-col>                                     
                </el-row>
        </Dialog>    
    </div>
</template>
<script>
import Breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import Dialog from "@/components/myDialog/myDialog";
import eventAction from '../lEventAtion';
import courseListPlugin from '@/components/Appconfigpage/ACourseSelect/courseListPlugin';
let actions = new eventAction()
export default {
    components:{
        Breadcrumb,
        Dialog,
        courseListPlugin
    },    
    data(){
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {
                case "code":
                    if (value=="") {
                        return callback(new Error('请输入识别码'));
                    }else{
                        var regex=/^[0-9a-z]+$/;
                        if(regex.test(value)){
                            if(value.length!=7){
                                return callback(new Error('识别码长度为7'));
                            }else{
                                callback(); 
                            }
                        }else{
                            return callback(new Error('请注意输入格式'));
                        }
                    }
                break;      
            }
        };                        
        return {
            form:{
                activityName:'',
                code:'',
                validDays:'',
                couponType:'1',
                courseIds:[],
                source:1,
                type:1,
                cityId:'',
                gradeId:'',
                schooleId:'',
                areaId:'',
                provinceId:'',
                periodId:''
            },
            rules:{
                activityName: [
                    { required: true, min: 1, max: 20, message: '请填写名称', trigger: 'blur' },
                ],            
                code:[
                    {required: true,validator: checkAge, trigger: 'blur'}
                ],
                validDays:[
                    {required: true, type: 'number', message: '请正确输入信息',min: 0,  max: 730, trigger: 'blur' },
                ],
                type: [
                    { required: true, message: '请选择类型', trigger: 'change' }
                ],
                gradeId:[
                     { required: true, message: '请选择年级', trigger: 'change' }
                ],
                cityId:[
                    { required: true, message: '请选择市', trigger: 'change' }
                ],
                areaId:[
                    { required: true, message: '请选择区', trigger: 'change' }
                ],
                provinceId:[
                    { required: true, message: '请选择省', trigger: 'change' }
                ],
                schooleId:[
                    { required: true, message: '请选择学校', trigger: 'change' }
                ],
                periodId:[
                    { required: true, message: '请选学段', trigger: 'change' }
                ]                                
            },  
            varObj:{
                mtypeText:true,
                pageType:true,//是否分页
            },  
            disabledState:false,
            courseselectType:"coupon",
            courseList:[],
            loadDailg:false,
            dataUpdateBool:'',
            // urls:'/coupons/getCourseListForCoupon',
            urls:'/course/getList',
            editsObj:{
                showFlag:false, //是否显示遮罩弹框；
                title:"温馨提示", //Dialog 的标题
                cancelName:'editObjNos', //自定义取消事件名字
                sureName:'editObjOks', //自定义确定事件名字,                        
            },
            toPath:{},
            couserBool:false,
            dialogVisibleFour:false,
            titleList:[
                {
                    name:'活动',
                    pathInfo:'/activityObjList'
                },
                {
                    name:'赠课注册系统',
                    pathInfo:'/activityObj/giveCourseSystem'
                },
                {
                    name:'信息添加',
                    pathInfo:''
                }
            ],
            provinceList:[],
            provinceArr:[],
            schoolList:[],
            cityList:[],
            cityArr:[], 
            areaList:[],
            areaArr:[], 
            gradeList:[],
            gradeId:'',
            disabledType1:true,
            disabledType2:true,
            disabledType3:false,
            disabledType4:true,
            pageNoAddNum:1,
            isLastPage:false,
            typeList:[]
        }
    },
    created(){
        this.dataUpdateBool =  JSON.stringify(this.form);
        this.getRegionList()
    },
    props:[],
    computed:{        
        textlengths(){
            if(this.form.activityName){
                return this.form.activityName.length>0?this.form.activityName.length:0;
            }else{
                return 0;
            }
        }        
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        var newFormData = JSON.stringify(this.form);
        if(this.dataUpdateBool!==newFormData){
            //next方法传true或者不传为默认历史返回，传false为不执行历史回退
            this.editsObj.showFlag = true;
            this.toPath = to;
            next(false);
        }else{
            next();
        };
    },    
    methods:{
        /**
         * 下来到底部触发的事件
         */
        loadMore(){
            if(!this.isLastPage){
                this.getSchoolPageList(1);
            }
        },
        /**
         * 获取地区信息
         */
        getRegionList(){
            this.$http.get(this.$server.getRegionList,{}).then(res=>{
                if(res.status==200){
                    let provinceArr = [],cityArr = [],areaArr = [];
                    res.content.forEach((item,index)=>{
                        item.label = item.name;
                        item.value = item.id;
                        if(item.level==1){
                            provinceArr.push(item)
                        }else if(item.level==2){
                            cityArr.push(item)
                        }else if(item.level==3){
                            areaArr.push(item)
                        }
                    })
                    this.provinceArr = provinceArr;
                    this.cityArr = cityArr;
                    this.areaArr = areaArr;
                    this.provinceList = [...this.provinceArr];
                }
            })
        },        
        /**
         * 选择省
         */
        getProvince(val){
            if(val){
                let obj = this.provinceArr.find(item=>item.value==val);
                let cityList = [ ]
                this.cityArr.forEach(item=>{
                    if(item.parentId == obj.id){
                        cityList.push(item)
                    }
                })
                this.cityList = cityList;
            }
            this.form.cityId = '';
            this.form.areaId = '';
            this.form.gradeId='';
            this.form.schooleId='';   
            this.form.periodId=''; 
            this.typeList=[]; 
            this.disabledType1 = true; 
            this.disabledType2 = true; 
            this.disabledType4 = true;
        },
        /**
         * 选择市
         */
        getCity(val){
            if(val){
                let obj = this.cityArr.find(item=>item.value==val)
                let areaList = [ ];
                this.areaArr.forEach(item=>{
                    if(item.parentId == obj.id){
                        areaList.push(item)
                    }
                })
                this.areaList = areaList;
            }
            this.form.areaId = '';
            this.form.gradeId='';
            this.form.schooleId=''; 
            this.form.periodId='';  
            this.typeList=[];
            this.disabledType1 = true; 
            this.disabledType2 = true;
            this.disabledType4 = true;                         
        }, 
        /**
         * 选择区
         */
        getAreaId(val){
            if(val){
                this.form.gradeId='';
                this.form.schooleId=''; 
                this.form.periodId='';                  
                this.schoolList =[];
                let obj = this.areaList.find(item=>item.value==val)
                this.disabledType1 = false;
                this.disabledType4 = false;
                this.disabledType1 = true; 
                this.disabledType2 = true; 
                this.typeList=[
                    {label:'小学',value:1,},
                    {label:'初中',value:2,},
                    {label:'高中',value:3,},
                    {label:'其他',value:4,},
                ];
            }
        },
        /**
         * 选择学段
         */
        periodIdEven(){
            this.disabledType1 = false;   
            this.schoolList =[];    
            this.form.schooleId='';  
            this.form.gradeId='';    
            this.isLastPage = false;  
            this.gradeList=[];
            this.getSchoolPageList();
        },
        /*
        *获取学校分页
        */
       getSchoolPageList(num){
            var self = this;
            if(num){
                self.pageNoAddNum = self.pageNoAddNum+num;
            }else{
                self.pageNoAddNum = 1;
            }            
            let params = {
                pageNo:self.pageNoAddNum,
                pageSize:10
            }
            params.provinceId = self.form.provinceId;
            params.cityId = self.form.cityId;
            params.areaId = self.form.areaId;
            params.type = self.form.periodId;
            let query = {
                params
            }
            self.$http.get(self.$server.getSchoolList,query).then(res=>{
                if(res.status==200){
                    if(res.content.isLastPage){
                        self.isLastPage = true;
                    }
                    self.schoolList = self.schoolList.concat(res.content.list)
                }
            })
       },
        /**
         * 选择学校
         */
        getSchoolId(val){
            if(val){
                let obj = this.schoolList.find(item=>item.id==val);
                var schooleType = Number(obj.type)+1;
                this.getSchoolsInfo(schooleType);
                this.disabledType2 = false; 
            }else{
                this.disabledType2 = true; 
            }
        },
        //选择类型
        radioEven(value){            
            if(value==1){                
                this.disabledType3=false;
                this.$refs["form"].validateField("gradeId");
            }else{
                this.disabledType3=true;
                setTimeout(()=>{
                    this.$refs["form"].clearValidate("gradeId");
                },200); 
            }
            this.form.cityId = '';
            this.form.areaId = '';
            this.form.gradeId= '';
            this.form.schooleId= '';      
            this.form.provinceId= '';
            this.disabledType1 = true; 
            this.disabledType2 = true;             
        }, 
        //获取年级
        getSchoolsInfo(type){
            this.$http.get(`${this.$server.getGradeListType}/${type}`).then(res=>{
                if(res.status==200){
                    this.gradeList = res.content;
                }
            })             
        },      
        returnpage(){
            this.$router.push({path:"/activityObj/giveCourseSystem"});
        },
        couponEditObjOk(){
            var self = this;
            self.dataUpdateBool = JSON.stringify({});
            self.form = {};
            self.$router.push({path:self.toPath.path});           
        },
        couponEditObjNo(){
            this.editsObj.showFlag = false;
        },  
        curseclick(){
           this.dialogVisibleFour = true;
        },
        submitForm(formName) {
            var self = this;
            var obj2 = {};           
            this.$refs[formName].validate((valid) => {
            if (valid) {
                    self.loadDailg = true;
                    if(self.courseList==0){
                        self.couserBool = true; 
                        self.loadDailg = false;
                        return;                  
                    }else{
                        self.couserBool = false;
                        $.extend( true, obj2, self.form );
                        obj2.courseIds = obj2.courseIds.toString();
                        obj2.validDays = Number(obj2.validDays)
                        var url = "/activityRegister/addActivityRegister";
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;                               
                            actions.getData(url,obj2,"post")
                                .then(data => {
                                    self.loadDailg = false;
                                    self.disabledState = !self.disabledState;
                                    self.dataUpdateBool = JSON.stringify({});
                                    self.form = {};                            
                                    self.$router.push({path:'/activityObj/giveCourseSystem'});                          
                            })
                            .fail(function(){  
                                self.disabledState = !self.disabledState;         
                                self.loadDailg = false; 
                                }
                            );  
                            console.log('验证通过');
                        }                         
                    }                         
            } else {
                console.log('验证没通过');  
                return false;
                }
            });
        },   
        listSelectEven(data){
            var self = this;
            self.form.courseIds = [];
            self.courseList = data.datas;
            self.dialogVisibleFour = false;
            if(self.courseList.length){
                self.couserBool = false;
            }
            data.datas.forEach(element => {
                self.form.courseIds.push(element.content)
            });
        }                  
    },
    watch: {}, 
    mounted(){}
}
</script>
<style  scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.module-details {
        padding: 20px;
        width: 1160px;
        .form-module{
            border-radius: 5px;
            box-shadow: 0px 0px 9px #edf1f7;
            background: #fff;    
            padding: 20px 10px;
            font-size: 14px;
            .listCourse{
                width: 200px;
                // margin: auto;
                .lLine40{
                    border:1px solid #B4272D;
                    margin: 5px 0;
                    i{
                        font-weight:bold;
                        cursor: pointer;
                    }
                }
                }            
            }
        .fontCss13{
            // color: #D0D0D0;
            font-size: 13px;
        }
        .module-title{
            height: 40px;
            background: #f6f6f8;
            line-height: 40px;
            padding-left: 25px;
            font-size: 14px;
            color: #384156;            
        }
    }
</style>
<style>
.el-picker-panel .el-picker-panel__footer .el-button--text{
    display: none;
}
.outerLay{
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-top: 10px;
}
.mouseOver{
    left: -65px;
    top: 13px;
    cursor: pointer;
    color: #999;
}
.inner{
    width: 14px;
    height: 14px;
    margin: 1px;
    border-radius: 50%;
}
.BorderGruy{
    border:1px solid #B1B1B1;
}
.BackGruy{
    background:#B1B1B1;
}
.BorderRed{
    border:1px solid #9E0E00;
}
.BackRed{
    background:#9E0E00;
}
.customize{
    width: 500px;
    position: absolute;
    top: 0;
    left: 15px;
    background: #fff;
    z-index: 2;
    padding-left: 10px;
}
.customize .error-text{
    color:#9E0E00;
    font-size: 12px;
    line-height: 40px;
    display: inline-block;
    margin-left: 5px;
}

</style>
