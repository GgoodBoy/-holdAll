<template>
    <div>
        <!-- <div v-show="!boolpluginForDetail"> -->
        <div>
            <Breadcrumb :menuList ='titleList' style="margin-bottom:20px"></Breadcrumb>
            <el-row class="lSize24 lPadding20 lLine40 warryBackCss" style="margin:0 20px">
                <el-col class="redFontColor" :span="1"><i class="el-icon-warning"></i></el-col>
                <el-col class="redFontColor lLeft-r" :span="23">提示：网站优惠券全站通用，买家购买网站上的任意课程时，凭券抵扣现金。</el-col>
            </el-row> 
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
                        <el-form-item label="优惠券名称" prop="title">
                            <el-row>
                                <el-col :span="11"><el-input v-model="form.title" maxlength="20" placeholder="请填写名称"></el-input></el-col>
                                <el-col :span="1" class="lCenter-r">{{textlengths}}/20</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="面额" prop="reducedPrice">
                            <el-row>
                                <el-col :span="5"><el-input v-model.number="form.reducedPrice" placeholder="输入优惠金额,1-1000元"></el-input></el-col>
                                <el-col :span="1" class="lCenter-r">元</el-col>
                            </el-row>
                        </el-form-item>  
                        <el-form-item label="使用条件">
                            <el-radio v-model="radio" label="1">无门槛使用</el-radio>
                        </el-form-item>                       
                        <el-form-item>
                            <el-row>
                                <el-col :span="1"><el-radio v-model="radio" label="2">满</el-radio></el-col>
                                <el-col :span="23">
                                    <el-form-item label="" prop="minAmount">
                                        <el-col :span="5"><el-input :disabled="isOKOrNo" v-model.number="form.minAmount" placeholder="输入优惠金额"></el-input></el-col>
                                        <el-col :span="1"  class="lCenter-r">元</el-col>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <!-- <el-form-item label="" prop="minAmount">
                                        <el-col :span="1"><el-radio v-model="radio" label="2">满</el-radio></el-col>
                                        <el-col :span="5" :offset="1"><el-input :disabled="isOKOrNo" v-model.number="form.minAmount" placeholder="输入优惠金额"></el-input></el-col>
                                        <el-col :span="1"  class="lCenter-r">元</el-col>
                        </el-form-item>                    -->
                        <el-form-item label="领取时间" required>
                            <el-col :span="5">
                                <el-form-item prop="beginAt">
                                    <el-date-picker :picker-options="pickerOptions0" type="datetime" placeholder="选择开始时间" v-model="form.beginAt" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col class="lCenter-r" :span="2">至</el-col>
                            <el-col :span="5">
                                <el-form-item prop="endAt">
                                    <el-date-picker :picker-options="pickerOptions0" @change="timeChange" type="datetime" placeholder="选择结束时间" v-model="form.endAt" style="width: 100%;"></el-date-picker>
                                </el-form-item>                            
                            </el-col>
                            <el-col v-show="timeWarry" :span="5" :offset="1" class="lSize14 redFontColor">*结束时间不能小于开始时间</el-col>
                            <el-col class="fontCss13">*有效时间：领券的开始时间和结束时间</el-col>
                        </el-form-item>  
                        <el-form-item label="优惠券有效期">
                            <el-row>
                                <el-col :span="5">
                                    <el-row>
                                        <!-- <el-col :span="2" >
                                            <div @click="changesEven" class="outerLay" v-bind:class="{ 'BorderGruy': !clickBoll, 'BorderRed': clickBoll }">
                                                <div class="inner" v-bind:class="{ 'BackGruy': !clickBoll, 'BackRed': clickBoll }"></div>
                                            </div>
                                        </el-col>
                                        <el-col :span="20" :offset="1">活动领取时间内有效</el-col> -->
                                        <el-radio v-model="validDayRadio" label="1">活动领取时间内有效</el-radio>
                                    </el-row>
                                </el-col>
                                <el-col class="fontCss13">*只能在领券的有效时间内使用，领券时间结束，优惠券过期作废</el-col>
                                <el-col>
                                    <el-form-item prop="validDays">
                                        <el-radio v-model="validDayRadio" label="2"></el-radio>
                                        <div class="customize">
                                            <label>自定义</label>
                                            <div style="display:inline-block"><el-input :disabled="validDayRadio==1" v-model.number="form.validDays" placeholder="> 1 ≤ 365" @focus="errorText=''"></el-input></div>
                                            <label>天</label>
                                            <p class="error-text">{{errorText}}</p>
                                        </div>
                                        <!-- <el-col :span="2" class="lCenter-r">自定义</el-col>
                                        <el-col :span="5"><el-input :disabled="isOKOrNoTwo" v-model.number="form.validDays" placeholder="> 1 ≤ 365"></el-input></el-col>
                                        <el-col :span="1" class="lCenter-r">天</el-col> -->
                                    </el-form-item>
                                </el-col>
                                <el-col class="fontCss13">自定义优惠券有效期：从用户成功领取后的那一刻开始，计算优惠券的有效使用天数。</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="发行量" prop="totalNum">
                            <el-row>
                                <el-col :span="4"><el-input placeholder="请输入发行量" maxlength="5" v-model.number="form.totalNum"></el-input></el-col>
                                <el-col :span="1" class="lCenter-r">张</el-col>
                                <el-col :span="5" class="lCenter-r fontCss13">最多不超过1万张，输入0不限制。</el-col>
                                <el-col class="fontCss13">修改发行量时只能增加不能减少，请谨慎设置。</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="每人限领" prop="eachLimitGet">
                            <el-row>
                                <el-col :span="4"><el-input placeholder="1" v-model.number="form.eachLimitGet"></el-input></el-col>
                                <el-col :span="1" class="lCenter-r">张</el-col>
                            </el-row>                        
                        </el-form-item>
                        <el-form-item label="活动类型" prop="activityType">
                            <el-radio v-model="form.activityType" label="2">双11活动</el-radio>
                            <el-radio v-model="form.activityType" label="1">其他</el-radio>
                            <el-radio v-model="form.activityType" label="3">国学趣玩会2元无门槛</el-radio>
                            <el-radio v-model="form.activityType" label="4">国学趣玩会满减199-30券</el-radio>
                        </el-form-item>                         
                        <el-form-item label="关联推荐课程">
                            <el-row>
                                <el-col :span="3">
                                    <el-button class="lButtom" @click="curseclick">选择课程</el-button>
                                </el-col>
                                <el-col :span="6" class="lLeft-r redFontColor" v-show="couserBool">
                                    *请添加课程
                                </el-col>
                            </el-row>                        
                            <div class="listCourse">
                                <el-row class="lLine40" v-for="item,index in courseList" :key="index">
                                    <el-col :span="20" class="lPaddingRF10 butColor">{{item.courseName}}</el-col>
                                    <el-col :span="2" :offset="2" class="lCenter-r" ><i @click="removeThisCourse(item)" class="el-icon-close"></i></el-col>
                                </el-row>
                            </div>
                        </el-form-item>
                            <el-form-item label="备注" props="remarks">
                            <el-row>
                                <el-col :span="14">
                                    <el-input type="textarea" placeholder="最多输入100个字符" maxlength="100" resize="none" :autosize="{ minRows: 3}" v-model="form.remarks"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>                    
                    </section>
                    <el-row>
                        <el-col class="lCenter-r">
                            <el-button class="lButtomOk lMarginTB50" @click="submitForm('form')">保存</el-button>
                            <el-button class="lButtomNo lMarginTB50" @click="returnpage">取消</el-button>
                        </el-col>
                    </el-row>                
            </el-form>         
        </div>
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="false"
        width="30%"
        >
            <div class="centerCss">
                   <!-- <courseListPlugin v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIds" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>     -->
                   <courseListPlugin v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIds" :numbersBool="false"  :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>      
            </div>                    
        </el-dialog>        
        <!-- <courseselect :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIds" :numbersBool="false" v-if="boolpluginForDetail"  :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseselect> -->
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
import Breadcrumb from "@/components/breadcrumbGX/breadcrumb";
// import courseselect from "@/components/Appconfigpage/ACourseSelect/coursesselect";
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
import Dialog from "@/components/myDialog/myDialog";
import eventAction from '../../lEventAtion';
let actions = new eventAction()
export default {
    components:{
        Breadcrumb,
        Dialog,
        // courseselect,
        courseListPlugin
    },    
    data(){
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {
                case "validDays":
                    if(!self.isOKOrNoTwo){
                        if (!value) {
                            return callback(new Error('请填写自定义时间'));
                            }
                            setTimeout(() => {
                            if (!Number.isInteger(value)) {
                                callback(new Error('请输入数字值'));
                            } else {
                                if (value < 1||value>365) {
                                callback(new Error('自定义时间不符合要求'));
                                } else {
                                callback();
                                }
                            }
                        }, 1000);
                    }else{
                        callback();
                    }                
                break;
                case "totalNum":
                            if (value===""&&value!==0) {
                                return callback(new Error('请填写发行量'));
                            }
                            setTimeout(() => {
                                    if (value>10000||value<0) {
                                        callback(new Error('请输入0-10000的正整数'));
                                    } else {
                                        callback();
                                    }
                                
                            }, 1000);
                break;
                case "reducedPrice":
                    if(Number(this.radio)==2){
                        if (!value) {
                            return callback(new Error('请填写名称'));
                            }
                            setTimeout(() => {
                                if (!Number.isInteger(value)) {
                                         callback(new Error('请输入1-1000的整数'));
                                } else {
                                    if (value>1000||value<1) {
                                        callback(new Error('面额范围1-1000'));
                                    } else if(this.form.minAmount!==''&&value>this.form.minAmount){
                                        callback(new Error('优惠券金额需小于满减金额'));
                                    }else {
                                        callback();
                                    }
                                }
                        }, 1000);
                    }else{
                        if (!value) {
                            return callback(new Error('请填写面额'));
                        }
                        setTimeout(() => {
                            if (!Number.isInteger(value)) {
                                    callback(new Error('请输入1-1000的整数'));
                            } else {
                                if (value>1000||value<1) {
                                    callback(new Error('面额范围1-1000'));
                                }else {
                                    callback();
                                }
                            }
                        }, 1000);
                    }

                break;   
                case "minAmount":
                        if(Number(this.radio)==2){
                            if (!value) {
                                 return callback(new Error('请输入满减金额'));
                                }
                                setTimeout(() => {
                                    if (!Number.isInteger(value)) {
                                        callback(new Error('请输入数字值'));
                                    }else if(value<this.form.reducedPrice){
                                         callback(new Error('满减金额需大于优惠券金额'));
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
                title:'',
                reducedPrice:'',
                beginAt:"",
                endAt:"",
                validDays:'',
                totalNum:'',
                eachLimitGet:1,
                minAmount:'',
                couponType:'1',
                courseIds:[],
                remarks:'',
                source:1,
                activityType:'2'
            },
            rules:{
                title: [
                    { required: true, message: '请填写名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '请填写名称', trigger: 'blur' }
                ], 
                reducedPrice:[
                    { validator: checkAge, trigger: 'blur' }
                ], 
                beginAt: [
                    { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                endAt: [
                    { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
                ],
                activityType:[{required: true}],
                validDays: [
                    {validator: checkAge, trigger: 'blur' }
                ],            
                totalNum:[
                    {validator: checkAge, trigger: 'blur' }
                ],
                minAmount:[
                    {validator: checkAge, trigger: 'blur' }
                ],
                eachLimitGet:[
                    { type: 'number', message: '请输入数字类型', trigger: 'blur' },
                    { type: 'number', max: 3, message: '*每人最多不超过3张', trigger: 'blur' }
                ]                              
            },                   
            radio:'1',
            validDayRadio:'1',
            errorText:'',
            isOKOrNo:true,
            clickBoll:true,
            isOKOrNoTwo:true,
            courseselectType:"coupon",
            courseList:[],
            beginTime:null,
            endTime:null,
            timeWarry:false,
            loadDailg:false,
            dataUpdateBool:'',
            urls:'/coupons/getCourseListForCoupon',
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                    }
            },
            editsObj:{
                showFlag:false, //是否显示遮罩弹框；
                title:"温馨提示", //Dialog 的标题
                cancelName:'editObjNos', //自定义取消事件名字
                sureName:'editObjOks', //自定义确定事件名字,                        
            },
            toPath:{},
            couserBool:false,
            titleList:[
                {
                    name:'系统合集',
                    pathInfo:'/marketelistlist'
                },
                {
                    name:'优惠券系统',
                    pathInfo:'/marketelist/coupon'
                },
                {
                    name:'新建网站优惠券',
                    pathInfo:''
                }
            ],
            //新组建
            varObj:{
                pageType:false,//是否分页
                mtypeText:true,//是否显示成人少儿分类
                coursrTitleStr:'courseName'
            },     
            dialogVisibleFour:false                              
        }
    },
    created(){
        this.form.temMoney = "";
        this.form.minAmount = "";
        // this.$store.state.appConfig.appStore.boolpluginForDetail=false;
        this.dataUpdateBool =  JSON.stringify(this.form)
    },
    props:[],
    computed:{
        // boolpluginForDetail(){
        //     return this.$store.state.appConfig.appStore.boolpluginForDetail;
        // },        
        textlengths(){
            if(this.form.title){
                return this.form.title.length>0?this.form.title.length:0;
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
        returnpage(){
            this.$router.push({path:"/marketelist/coupon"});
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
        changesEven(){
            this.clickBoll = !this.clickBoll;
            this.isOKOrNoTwo = !this.isOKOrNoTwo;
            if(this.isOKOrNoTwo){
                this.form.validDays = "";
                this.$refs["form"].validateField("validDays");        
            }else{
                this.$refs["form"].clearValidate("validDays");
            }
        },
        curseclick(){
        //   this.$store.state.appConfig.appStore.boolpluginForDetail=true;
          this.dialogVisibleFour = true;
        },
        submitForm(formName) {
            var self = this;
            var obj2 = {};
            if(self.courseList==0){
                self.couserBool = true; 
                return;                  
            }else{
                self.couserBool = false;
            }            
            self.loadDailg = true;
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(!self.timeWarry){ 
                    self.form.couponType=this.radio;
                    $.extend( true, obj2, self.form );
                    obj2.courseIds = JSON.stringify(obj2.courseIds);
                    if(Number(new Date())-Number(obj2.beginAt)>0){
                        obj2.beginAt = self.formatDate(Number(new Date()));
                    }else{
                        obj2.beginAt = self.formatDate(Number(obj2.beginAt));
                    }
                    obj2.endAt = self.formatDate(Number(obj2.endAt))
                    obj2.eachLimitGet = Number(obj2.eachLimitGet)
                    if(this.validDayRadio==1){
                        obj2.validDays = ''
                    }else{
                        if(obj2.validDays.length==0||obj2.validDays<=1||obj2.validDays>365){
                            this.errorText = '请输入正确的优惠券有效期'
                            self.loadDailg = false;
                            return;
                        }
                    }
                    var url = "/coupons/addAndUpdate";

                    actions.getData(url,obj2,"post")
                        .then(data => {
                            self.loadDailg = false;
                            self.dataUpdateBool = JSON.stringify({});
                            self.form = {};                            
                            self.$router.push({path:'/marketelist/coupon'});                          
                    })
                    .fail(function(){           
                        self.loadDailg = false; }
                    );            
                }
            } else {
                self.loadDailg = false;
                return false;
                }
            });
        },   
        listSelectEven(data){
            var self = this;
            if(data.bool){
                self.form.courseIds = [];
                // self.$store.state.appConfig.appStore.boolpluginForDetail=false;
                self.dialogVisibleFour = false;
                self.courseList = data.datas;
                if(self.courseList.length){
                    self.couserBool = false;
                }
                data.datas.forEach(element => {
                    self.form.courseIds.push(element.content)
                });
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
                return y+"/"+m+"/"+d+" "+h+":"+m1+":"+s;
            }               
    },
    watch: {
        radio: function(curVal,oldVal){
            if(curVal=="2"){
                this.isOKOrNo = false;
                this.$refs["form"].validateField("minAmount");
            }else{
                this.isOKOrNo = true;
                this.form.minAmount = null;
                this.$refs["form"].clearValidate("minAmount");
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
<style  scoped lang="scss">
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
