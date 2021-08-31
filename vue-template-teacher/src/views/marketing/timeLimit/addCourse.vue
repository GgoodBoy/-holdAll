<template>
    <div>
        <!-- <div v-show="!boolpluginForDetail"> -->
        <div>
            <!-- <Breadcrumb></Breadcrumb> -->
            <div class="lPadding20">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </div>            
            <el-form ref="form" 
                    v-loading = "loadDailg"
                    :model="form" 
                    label-width="100px" 
                    label-position="right"
                    class="module-details"
                    :rules="rules"
                    >
                <h3 class="module-title">基础部分</h3>
                <section class="form-module fontCss14">
                     <el-form-item label="有效时间" required>
                        <el-col :span="5">
                            <el-form-item prop="beginAt">
                                <el-date-picker type="datetime" :picker-options="pickerOptions0" placeholder="选择开始时间" v-model="form.beginAt" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col class="lCenter-r" :span="2">至</el-col>
                        <el-col :span="5">
                            <el-form-item prop="endAt">
                                <el-date-picker @change="timeChange" :picker-options="pickerOptions0" type="datetime" placeholder="选择结束时间" v-model="form.endAt" style="width: 100%;"></el-date-picker>
                            </el-form-item>                            
                        </el-col>
                        <el-col v-show="timeWarry" :span="5" :offset="1" class="lSize14 redFontColor">*结束时间不能小于开始时间</el-col>
                    </el-form-item> 
                    <el-form-item label="课程内容">
                        <el-row>
                            <el-col :span="3">
                                <el-button class="lButtom" @click="curseclick">选择课程</el-button>
                            </el-col>
                            <el-col :span="3">已选择<span class="redFontColor">{{form.courseIds.length}}</span>门课程</el-col>
                            <el-col v-show="form.courseIds.length>0?false:true" :span="5" class="redFontColor">请选择课程</el-col>
                        </el-row>
                        
                        <div class="listCourse">
                            <el-row class="lLine40" v-for="item,index in courseList" :key="index">
                                <el-col :span="20" class="lPaddingRF10 grayColor">{{item.courseName}}</el-col>
                                <el-col :span="2" :offset="2" class="lCenter-r" ><i @click="removeThisCourse(item)" class="el-icon-close"></i></el-col>
                            </el-row>
                        </div>
                    </el-form-item>   
                    <el-form-item label="折扣信息">
                        <el-radio v-model="radio" label="1">限时免费</el-radio>
                    </el-form-item>
                    <el-form-item label="" prop="discount">
                                    <el-col :span="1"><el-radio v-model="radio" label="2">打折</el-radio></el-col>
                                    <el-col :span="5" :offset="1"><el-input :disabled="isOKOrNo" v-model="form.discount" placeholder="请填写"></el-input></el-col>
                                    <el-col :span="1"  class="lCenter-r">折</el-col>
                    </el-form-item>  
                    <el-form-item label="" prop="courseCustom">
                                    <el-col :span="1"><el-radio v-model="radio" label="3">秒杀</el-radio></el-col>
                                    <el-col :span="5" :offset="1"><el-input maxlength="7" :disabled="isOKOrNoTwo" v-model="form.courseCustom" placeholder="请填写"></el-input></el-col>
                                    <el-col :span="3" v-if="numbersBool==1" :offset="1">课程原价<span class="redFontColor"> {{originalPrice}}</span> 元</el-col>
                    </el-form-item>                                                        
                </section>
                <el-row>
                    <el-col class="lCenter-r">
                        <el-button class="lButtom lMarginTB50" @click="submitForm('form')">保存</el-button>
                    </el-col>
                </el-row>
        </el-form>
    </div>
    <!-- 选择课程 -->
    <el-dialog
    :visible.sync="dialogVisibleFour"
    :close-on-press-escape='false'
    :close-on-click-modal="false"
    :show-close="false"
    width="30%"
    >
        <div class="centerCss">
                <courseListPlugin v-if="dialogVisibleFour" :checkAllBut='checkAllBut' :urlPorp="urls" :varObjs='varObj' :numbersBool="numbersBool" :chooseIdlist="form.courseIds"  :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>      
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
// import Breadcrumb from "@/components/formSynthesisPlugin/gxBreadcrumb";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
// import courseselect from "@/components/Appconfigpage/ACourseSelect/coursesselect"; //推存选择课程组件
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
import Dialog from "@/components/myDialog/myDialog";
import eventAction from '../../lEventAtion';
let actions = new eventAction()
export default {
    components:{
        breadcrumb,
        // courseselect,
        courseListPlugin,
        Dialog
    },    
    data(){
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {
                case "discount":
                        if(this.form.type=="1"){
                            // if (!value) {
                            //     return callback(new Error('请输入折扣信息'));
                            //     }
                            //     setTimeout(() => {
                            //     if (!Number.isInteger(value)) {
                            //         callback(new Error('请输入数字值'));
                            //     }else{
                            //         callback();
                            //     }
                            // }, 1000);
                        var repExpNext = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1})?$/;
                        if (!value) {
                            return callback(new Error('请输入折扣信息'));
                            }
                        setTimeout(() => {
                            if(Number(value)<1||Number(value)>10){
                                callback(new Error('折扣信息大于1,小于10'));
                            }else if(!repExpNext.test(value)){
                                callback(new Error('请输入正数,最多1位小数'));
                            }else{
                            callback();
                        }
                    }, 1000);                            
                        }else{
                            callback();
                        }
                break; 
                case "courseCustom":
                    if(this.form.type=="2"){
                        var repExp = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                        if (!value) {
                            return callback(new Error('请输入秒杀金额'));
                            }
                        setTimeout(() => {
                            if(Number(value)>Number(this.originalPrice)||Number(value)<0.1){
                                callback(new Error('秒杀金额0.1到原价之间'));
                            }else if(!repExp.test(value)){
                                callback(new Error('请输入正数,最多2位小数'));
                            }else{
                            callback();
                        }
                    }, 1000);
                }else{
                    callback();
                }
                break;                                            
            }
        };         
        return {
            form:{
                beginAt:"",
                endAt:"",
                courseIds:[],
                discount:'',
                type:'0',
                sort:"0",
                courseCustom:''
            },
            rules:{
                beginAt: [
                    { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                endAt: [
                    { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
                ],
                discount:[
                    {validator: checkAge, trigger: 'blur' }
                ],
                courseCustom:[
                    {validator: checkAge, trigger: 'blur' }
                ]                             
            },        
            radio:'1',
            isOKOrNo:true,
            clickBoll:true,
            isOKOrNoTwo:true,
            courseselectType:"coupon",
            courseList:[],
            beginTime:null,
            endTime:null,
            timeWarry:false,
            loadDailg:false,
            urls:"/timeLimitedDiscounts/getCourseListForTimeLimitedDiscounts",
            dataUpdateBool:'',
            numbersBool:false,
            checkAllBut:true,
            editsObj:{
                showFlag:false, //是否显示遮罩弹框；
                title:"温馨提示", //Dialog 的标题
                cancelName:'editObjNos', //自定义取消事件名字
                sureName:'editObjOks', //自定义确定事件名字,                        
            },
            toPath:{},
            originalPrice:0,
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                    }
            },
            titleList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'限时购/秒杀系统',
                            pathInfo:'/marketelist/timelimit'
                        },
                        {
                            name:'添加(限时/秒杀)课程',
                            pathInfo:''
                        }                
            ],
            //新组建
            varObj:{
                pageType:false,//是否分页
                mtypeText:true,//是否显示成人少儿分类
                coursrTitleStr:'courseName'
            },     
            dialogVisibleFour:false,                         
            disabledState:false
    }},
    created(){
        // this.$store.state.appConfig.appStore.boolpluginForDetail=false;  
        this.dataUpdateBool =  JSON.stringify(this.form)      
    },
    props:[],
    computed:{
        // boolpluginForDetail(){
        //     return this.$store.state.appConfig.appStore.boolpluginForDetail
        // },        
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
        couponEditObjOk(){
            var self = this;
            self.dataUpdateBool = JSON.stringify({});
            self.form = {};
            self.$router.push({path:self.toPath.path});           
        },
        couponEditObjNo(){
            this.editsObj.showFlag = false;
        },                
        submitForm(formName) {
            var self = this;
            var obj2 = {};
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(!self.timeWarry&&self.form.courseIds.length>0){ 
                    self.loadDailg = true;
                    $.extend( true, obj2, self.form );
                    obj2.courseIds = JSON.stringify(obj2.courseIds);
                    if(Number(new Date())-Number(obj2.beginAt)>0){
                        obj2.beginAt = self.formatDate(Number(new Date()));
                    }else{
                        obj2.beginAt = self.formatDate(Number(obj2.beginAt));
                    };
                    obj2.endAt = self.formatDate(Number(obj2.endAt))
                    var url = "/timeLimitedDiscounts/add";
                    if(!self.disabledState){
                        self.disabledState = !self.disabledState;                       
                        actions.getData(url,obj2,"post")
                            .then(data => {
                            self.loadDailg = false;
                            self.disabledState = !self.disabledState;
                            self.dataUpdateBool = JSON.stringify({});
                            self.form = {};                         
                            self.$router.push({path:'/marketelist/timelimit'});                        
                        })
                        .fail(function(){  
                            self.loadDailg = false;
                            self.disabledState = !self.disabledState;
                            }
                        ); 
                    }          
                }else{
                    self.loadDailg = false;
                    self.$message.error('请选择课程');
                }
            } else {
                self.loadDailg = false;
                return false;
                }
                });
        }, 
        timeChange(a,b){
            if(this.beginTime>this.endTime){
                this.timeWarry = true; 
            }else{
                this.timeWarry = false;
            }
        },  
        formatDate(date){
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
                return y+"/"+m+"/"+d+" "+h+":"+m1+":"+s;
            },
        curseclick(){
        //   this.$store.state.appConfig.appStore.boolpluginForDetail=true;
          this.dialogVisibleFour = true;
        },
        listSelectEven(data){
            var self = this;
            if(data.bool){
                self.form.courseIds =[];
                // self.$store.state.appConfig.appStore.boolpluginForDetail=false;
                self.dialogVisibleFour = false;
                self.courseList = data.datas;
                data.datas.forEach(element => {
                    self.form.courseIds.push(element.content)
                });
                if(data.datas[0]){
                    self.originalPrice = data.datas[0].sellingPrice;
                }else{
                    self.originalPrice =0;
                }                
            }else{
                self.dialogVisibleFour = false;
            }
        }, 
        //删除当前选项；
        removeThisCourse(e){
            var self = this;
            var list =[];
            self.courseList.forEach((element,index) => {
                if(e.content==element.content){
                    self.courseList.splice(index,1);
                }
            });
            self.form.courseIds.forEach((element,index) => {
                if(e.content!=element){
                    list.push(element)
                }
            });
            self.form.courseIds = list;
        }                                      
    },
    watch:{
        radio: function(curVal,oldVal){
            if(curVal=="2"){
                this.checkAllBut = true;
                this.isOKOrNo = false;
                this.isOKOrNoTwo = true;
                this.form.type = "1"
                this.numbersBool = false;
                this.$refs["form"].validateField("discount");
                this.$refs["form"].clearValidate("courseCustom");
            }else if(curVal=="1"){
                this.checkAllBut = true;
                this.isOKOrNo = true;
                this.isOKOrNoTwo = true;
                this.form.discount = '';
                this.form.type = "0";
                this.numbersBool = false;
                this.$refs["form"].clearValidate("discount");
                this.$refs["form"].clearValidate("courseCustom");
            }else{
                this.checkAllBut = false;
                this.isOKOrNo = true;
                this.isOKOrNoTwo = false;
                this.form.discount = '';
                this.form.type = "2";
                if(this.courseList.length!=1){
                    this.form.courseIds =[];
                    this.courseList = [];
                    this.originalPrice = 0;
                }
                this.numbersBool = 1;
                this.$refs["form"].validateField("courseCustom");
                this.$refs["form"].clearValidate("discount"); 
            }
            this.radio = curVal;
        },
        "form.beginAt":{
            handler(a){
                this.beginTime = Number(a);
            }
        },
        "form.endAt":{
            handler(a){
                this.endTime = Number(a);   
                if(this.endTime<this.beginTime){
                    this.timeWarry = true;
                }else{
                    this.timeWarry = false;
                }         
            }
        }                              
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../../components/formSynthesisPlugin/my-component.css";
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
                width: 381px;
                margin: auto;
                .lLine40{
                    border:1px solid #82C4F5;
                    margin: 5px 0;
                    i{
                        font-weight:bold;
                        cursor: pointer;
                    }
                }
                }            
            }
        .fontCss13{
            color: #D0D0D0;
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
</style>
