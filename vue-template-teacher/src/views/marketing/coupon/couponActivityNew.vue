<template>
    <div>
        <div v-show="!boolpluginForDetail">
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
                    <el-form-item label="优惠券名称" prop="title">
                        <el-row>
                            <el-col :span="11"><el-input maxlength="20" v-model="form.title" placeholder="请填写名称"></el-input></el-col>
                            <el-col :span="1" class="lCenter-r">{{textlengths}}/20</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="面额" prop="reducedPrice">
                        <el-row>
                            <el-col :span="5"><el-input v-model.number="form.reducedPrice" placeholder="输入优惠金额,1-1000元"></el-input></el-col>
                            <el-col :span="1" class="lCenter-r">元</el-col>
                        </el-row>
                    </el-form-item>  
                    <!-- <el-form-item label="使用条件">
                        <el-row>
                            <el-col :span="1">
                                <div class="outerLay BorderRed">
                                    <div class="inner BackRed"></div>
                                </div>
                            </el-col>
                            <el-col v-model="radio" label="1" :span="20">无使用门槛</el-col>
                        </el-row>
                    </el-form-item>   -->
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
                    <el-form-item label="活动类型" prop="value">
                        <el-row>
                            <el-col :span="4">
                                <el-select v-model="form.source" placeholder="请选择">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-form-item> 
                    <el-form-item label="活动有效期">
                        <el-row>
                            <el-col :span="5">
                                <el-row>
                                    <!-- <el-col :span="2" >
                                        <div @click="changesEven" class="outerLay" v-bind:class="{ 'BorderGruy': !clickBoll, 'BorderRed': clickBoll }">
                                            <div class="inner" v-bind:class="{ 'BackGruy': !clickBoll, 'BackRed': clickBoll }"></div>
                                        </div>
                                    </el-col> -->
                                    <el-col :span="20" :offset="1">长期</el-col>
                                </el-row>
                            </el-col>
                            <!-- <el-col class="fontCss13">*只能在领券的有效时间内使用，领券时间结束，优惠券过期作废</el-col> -->
                            <!-- <el-col>
                                <el-form-item prop="validDays">
                                    <el-col :span="5"><el-input v-model.number="form.validDays" placeholder="> 1 ≤ 365"></el-input></el-col>
                                    <el-col :span="1" class="lCenter-r">天</el-col>
                                </el-form-item>
                            </el-col>
                            <el-col class="fontCss13">自定义优惠券有效期：从用户成功领取后的那一刻开始，计算优惠券的有效使用天数。</el-col> -->
                        </el-row>
                    </el-form-item>
                    <el-form-item label="优惠券有效期">
                        <el-row>
                            <el-col>
                                <el-form-item prop="validDays">
                                    <!-- <el-col :span="2" class="lCenter-r">自定义</el-col> -->
                                    <el-col :span="5"><el-input v-model.number="form.validDays" placeholder="> 1 ≤ 365"></el-input></el-col>
                                    <el-col :span="1" class="lCenter-r">天</el-col>
                                </el-form-item>
                            </el-col>
                            <el-col class="fontCss13">自定义优惠券有效期：从用户成功领取后的那一刻开始，计算优惠券的有效使用天数。</el-col>
                        </el-row>
                    </el-form-item>                    
                    <el-form-item label="发行量">
                        <el-row>
                            <el-col>不限</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="每人限领" prop="eachLimitGet">
                        <el-row>
                            <el-col :span="4"><el-input placeholder="1" disabled v-model.number="form.eachLimitGet"></el-input></el-col>
                            <el-col :span="1" class="lCenter-r">张</el-col>
                        </el-row>                        
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
                        <el-button class="lButtom lMarginTB50" @click="submitForm('form')">上架</el-button>
                    </el-col>
                </el-row>                
        </el-form>
        </div>
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
import eventAction from '../../lEventAtion';
import Dialog from "@/components/myDialog/myDialog";
let actions = new eventAction()
export default {
    components:{
        // Breadcrumb,
        breadcrumb,
        Dialog
    },    
    data(){
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {
                case "validDays":
                    // if(!self.isOKOrNoTwo){
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
                    // }else{
                    //     callback();
                    // }                
                break;
                // case "reducedPrice":
                //         if (!value) {
                //             return callback(new Error('请填写名称'));
                //             }
                //             setTimeout(() => {
                //             if (!Number.isInteger(value)) {
                //                 callback(new Error('请输入数字值'));
                //             } else {
                //                 if (value>1000||value<1) {
                //                 callback(new Error('面额超过1000/低于1规定设置'));
                //                 } else {
                //                 callback();
                //                 }
                //             }
                //         }, 1000);
                // break;   
                case "reducedPrice":
                    if(Number(this.form.couponType)==2){
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
                        if(Number(this.form.couponType)==2){
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
                validDays:'',
                totalNum:0,
                eachLimitGet:1,
                couponType:'1',
                remarks:'',
                source:'',
                minAmount:''
            },
            rules:{
                title: [
                    { required: true, message: '请填写名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '请填写名称', trigger: 'blur' }
                ], 
                reducedPrice:[
                    { validator:checkAge, trigger: 'blur' },
                ], 
                source: [
                    { required: true, message: '请选择活动类型', trigger: 'change' }
                ],                
                validDays: [
                    {validator: checkAge, trigger: 'blur' }
                ],
                eachLimitGet:[
                    { type: 'number', message: '请输入数字类型', trigger: 'blur' },
                    { type: 'number', max: 3, message: '*每人最多不超过3张', trigger: 'blur' }
                ],
                minAmount:[
                    {validator: checkAge, trigger: 'blur' }
                ]                              
            },        
            radio:'1',
            isOKOrNo:true,
            clickBoll:true,
            disabledState:false,
            // isOKOrNoTwo:true,
            loadDailg:false,
            options:[{
                value: 2,
                label: '注册'
                }, {
                value: 3,
                label: '分享'
            }],
            dataUpdateBool:'',
            editsObj:{
                showFlag:false, //是否显示遮罩弹框；
                title:"温馨提示", //Dialog 的标题
                cancelName:'editObjNos', //自定义取消事件名字
                sureName:'editObjOks', //自定义确定事件名字,                        
            },
            toPath:{},
            titleList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'活动优惠券系统',
                            pathInfo:'/marketelist/activity'
                        },
                        {
                            name:'新建活动优惠券',
                            pathInfo:''
                        }                
            ]                    
    }},
    created(){
        this.form.validDays = ""; 
        his.form.minAmount = "";         
    },
    props:[],
    computed:{
        boolpluginForDetail(){
        },
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
        self.loadDailg = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
                $.extend( true, obj2, self.form );
                var url = "/coupons/addAndUpdate";
                obj2['beginAt']=self.formatDate(Number(new Date()));
                obj2['endAt']=self.formatDate(Number(new Date()));
                obj2.eachLimitGet = Number(obj2.eachLimitGet)
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;
                    actions.getData(url,obj2,"post")
                        .then(data => {
                        self.loadDailg = false;
                        self.disabledState = !self.disabledState;
                        self.dataUpdateBool = JSON.stringify({});
                        self.form = {}; 
                        self.$router.push({path:'/marketelist/activity'});                           
                    })
                    .fail(function(){  
                        self.loadDailg = false;  
                        self.disabledState = !self.disabledState;                         
                        }
                    );
                }          
          } else {
                self.loadDailg = false;
                return false;
            }
            });
        },
        // changesEven(){
        //     this.clickBoll = !this.clickBoll;
        //     this.isOKOrNoTwo = !this.isOKOrNoTwo;
        //     if(this.isOKOrNoTwo){
        //         this.form.validDays = "";
        //         this.$refs["form"].clearValidate("validDays");        
        //     }else{
        //         this.$refs["form"].validateField("validDays");
        //     }
        // },
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
                this.form.couponType = '2'
                this.$refs["form"].validateField("minAmount");
            }else{
                this.isOKOrNo = true;
                this.form.minAmount = null;
                this.form.couponType = '1'
                this.$refs["form"].clearValidate("minAmount");
            }
            this.radio = curVal;
        },                
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
