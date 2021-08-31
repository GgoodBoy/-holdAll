<template>
    <div class="keyAccBox">
        <!-- v-if="!boolpluginForDetail" -->
        <el-row class="lLine40 headerDiv">
            <el-col class="lSize18">
                <el-row class="lSize16">
                    <el-col :span="12" class="lLeft-r">
                        <breadcrumb :menuList ='titleList'></breadcrumb>
                    </el-col>
                </el-row>                
            </el-col>
            <el-col class="lSize18">
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                    <el-form-item label="名称" prop="bagName">
                        <el-input v-model="form.bagName" maxlength="16" style="width:200px;"></el-input>
                        <span>{{form.bagName.length}}/16</span>
                    </el-form-item>  
                    <div>
                        <div class="courseselectBox">
                            <div class="courseTitle">课程</div>
                            <div class="courseCount" style="margin-bottom:30px;">
                                <div class="selectCourseBut cursorCss" @click="selectCourse">选择课程</div>
                                <div class="courseList" style="margin-left: 160px;" v-if="selectData.length>0">
                                    <div class="courseListCount" v-for="(item,index) in selectData" :key="index">
                                        <p>{{item.title}}</p>
                                        <i class="el-icon-circle-close" @click="removeSelectCourse(index)"></i>
                                    </div>
                                </div>
                            </div>
                        </div>  
                        <p class="myselfPropNext" v-show="selectDataBool">请添加课程</p>
                    </div>                     
                    <div>
                        <div class="userselectBox">
                            <div class="usersTitle">添加用户</div>
                            <div class="usersCount">
                                <textarea type="textarea" @input="getContent" rows="2" ref="textarea" @blur="blurEven(1)"  @click="getRows" @keydown="keyDownEvent($event)" @paste="pasteEvent" v-model="textarea"></textarea>
                                <div class="usersList">
                                    <div class="usersListCount" v-for="(item,index) in textareaContent" :key="index">
                                        <div v-if="item.length>0">
                                            <p>{{item}}</p>
                                            <i class="el-icon-circle-close" @click="removeSelectTelephone(index)"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>    
                        <p class="myselfPropNext" v-show="userListBool">请添加用户</p>
                        <div class="userSaveBut">
                            <div class="cursorCss" @click="saveTextareaInfo">保存</div>
                        </div>
                    </div>                      
                    <el-form-item label="有效期">
                        <diV class="radioCss">
                            <div class="requestIcon">*</div>
                            <el-radio v-model="radio" label="1">不限制</el-radio>
                            <div>
                                <el-radio v-model="radio" label="2">自定义</el-radio>
                                <el-input :disabled="displayValidityTime" placeholder="1-1000天" v-model="validityTime" @blur="blurEven(2)" maxlength="4" style="width:200px;"></el-input>
                            </div>
                            <p class="myselfProp" v-show="validityTimeBool">请输入有效期(1-1000的正整数)</p>
                        </diV>
                    </el-form-item>                             
                    <el-form-item label="欢迎语" prop="welcomeSpeech">
                        <el-input type="textarea" style="width:300px;" placeholder="最多不超过60个字" maxlength="60" :rows="4" v-model="form.welcomeSpeech "></el-input>
                        <span>{{form.welcomeSpeech.length}}/60</span>
                    </el-form-item>                        
                    <el-form-item label="备注">
                        <el-input type="textarea" style="width:300px;" placeholder="最多不超过60个字" maxlength="60" :rows="4" v-model="form.remarks"></el-input>
                        <span>{{form.remarks.length}}/60</span>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">确定</el-button>
                        <el-button  @click="returnKeyAcccoList">取消</el-button>
                    </el-form-item>
                </el-form>                    
            </el-col>
        </el-row>
        <el-dialog class="dialogCourse" :visible.sync="courseselectPluginDialog" 
                    width="50%"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :show-close="false"> 
            <!-- v-if="boolpluginForDetail" -->
            <courseselect :urlPorp="urls" :chooseIdlist="courseIds"  v-on:listSelect="listSelectEven"></courseselect>
        </el-dialog>  
    </div>
</template>
<script>
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import courseselect from "./courseAcconList"; //推存选择课程组件
export default {
        data(){
        return {
            form: {
                bagName: '',
                welcomeSpeech:'',
                remarks: '',
            },     
            rules: {
                bagName: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                welcomeSpeech: [
                    { required: true, message: '请填写欢迎语', trigger: 'blur' }
                ]
            },             
            selectData:[],            
            titleList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'大客户免费课系统',
                            pathInfo:'/marketelist/member/keyAccountCard'
                        },
                        {
                            name:'添加大客户免费课',
                            pathInfo:''
                        }                
            ],   
            urls:'/customer/getOurCourses',
            // boolpluginForDetail:false,
            textarea:'',
            radio:"1",
            validityTime:'',
            textareaContent:[],
            courseIds:[],
            oldTextarea:'',
            rows:0,
            pasteFlag:false,
            //用户提示
            userListBool:false,
            validityTimeBool:false,
            selectDataBool:false,
            displayValidityTime:true,
            paramsId:'',
            courseselectPluginDialog:false,
            disabledState:false
        };
        },
        created() {
            this.paramsId = this.$route.query.courseBagId;
            if(this.paramsId){
               this.setEditCourseInfo();
            }           
        },
        components:{
            breadcrumb,
            courseselect
        },      
        watch: {
            radio(cur,old){
                switch (Number(cur)) {
                    case 1:
                        this.validityTimeBool=false;
                        this.displayValidityTime = true;
                        break;
                    case 2:
                        this.displayValidityTime = false;
                        break;                
                    default:
                        this.displayValidityTime = true;
                        break;
                }
            }
        }, 
        methods: {    
            returnKeyAcccoList(){
                this.$router.push({path: '/marketelist/member/keyAccountCard'});
            },         
            //编辑信息
            setEditCourseInfo(){
                var self = this;
                var parems ={
                    courseBagId:self.paramsId
                };
                self.$http.get(self.$server.customerEdit(parems)).then(res=>{
                    if(res.status==200){
                        let list = [];
                        let content = res.content;
                        self.selectData = content.coursetitles;
                        self.courseIds = self.selectData.map(x=>{
                            return x.id;
                        });                        
                        for (const iterator of content.cellphones) {
                            list.push(iterator.cellphone);
                        }
                        self.textareaContent = list;
                        self.form={
                            bagName: content.customerCourseBag.bagName,
                            welcomeSpeech:content.customerCourseBag.welcomeSpeech,
                            remarks: content.customerCourseBag.remarks||''
                        };
                        if(Number(content.customerCourseBag.validityTime)>0){
                            self.radio ="2";
                            self.validityTime=content.customerCourseBag.validityTime;
                            self.displayValidityTime =false;
                        }else{
                            self.radio ="1";
                        }
                    }
                })                 
            },
            blurEven(num){
                var self = this;
                if(num==1){
                    if(!self.textareaContent){
                        self.userListBool = true;
                    }else{
                        self.userListBool = false;
                    }
                }else{
                    if(Number(this.radio)==2){
                        var reg = /^\+?[1-9]\d*$/; 
                        if(!this.validityTime||!reg.test(self.validityTime)||Number(this.validityTime)>1000){
                            this.validityTimeBool=true;
                            this.displayValidityTime = false;
                        }
                    }else if(Number(this.radio)==1){
                        this.validityTimeBool=false;
                        this.displayValidityTime = true;
                    }
                }
            },
        /**
         * 获取内容
         */
            getContent(){
                this.textarea = this.textarea.replace(/[^\d\n]/g, '');
                if(this.pasteFlag){
                    this.pasteFlag = false;
                    let temp = this.textarea.split('\n').map(item=>{
                        return item.length>11?item.substr(0,11):item
                    })
                    this.textarea = this.oldTextarea = temp.join('\n');
                    this.$nextTick(()=>{
                        this.getRows()
                    })
                    return false;
                }
                let index = this.rows - 1 < 0 ? 0 : this.rows - 1;
                let arr = this.textarea.split('\n');
                if(arr[index]&&arr[index].length>11){
                    this.textarea = this.oldTextarea
                    this.$nextTick(()=>{
                        this.getRows()
                    })
                    return;
                }
                this.oldTextarea = this.textarea;
            }, 
            /**
             * 根据光标获取行数 （鼠标点击）
             */
            getRows(){
                let index = this.getCursortPosition(this.$refs.textarea)
                let temp = this.textarea.substr(0,index)
                this.rows = temp.split('\n').length
            },    
            /**
             * 根据光标获取行数 （键盘回车，上移下移左移右移）
             */
            keyDownEvent(e){
                let code = [8,13,37,38,39,40]
                if(code.includes(e.keyCode)){
                    setTimeout(()=>{
                        let index = this.getCursortPosition(this.$refs.textarea)
                        let temp = this.textarea.substr(0,index)
                        this.rows = temp.split('\n').length
                    },1)
                }
            },
            /**
             * 获取光标的位置
             */
            getCursortPosition(dom){
                var cursorIndex = 0;
                if (document.selection) {
                    dom.focus();
                    var range = document.selection.createRange();
                    range.moveStart('character', -dom.value.length);
                    cursorIndex = range.text.length;
                } else if (dom.selectionStart || dom.selectionStart==0) {
                    cursorIndex = dom.selectionStart;
                }
                return cursorIndex;
            }, 
            saveTextareaInfo(){
                //数组合并去重;
                let list = [...new Set([...this.textareaContent,...this.textarea.split('\n')])];
                this.textareaContent = list; 
                this.textarea='';            
            },
            /**
             * 粘贴事件
             */
            pasteEvent(){
                this.pasteFlag = true
            },                                          
            //提交
            onSubmit(formName) {
                var self = this;
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(!self.selectData.length){
                        self.selectDataBool = true;
                        return ;
                    }
                    if(!self.textareaContent.length){
                        self.userListBool = true;
                        return ;
                    }
                    switch (Number(self.radio)) {
                        case 1:
                            self.validityTimeBool =false;
                            break;
                        case 2:
                            var reg = /^\+?[1-9]\d*$/; 
                            if(!self.validityTime||!reg.test(Number(self.validityTime))){
                                self.validityTimeBool =true;
                                return;
                            }else{
                                self.validityTimeBool =false;
                            }
                            break;                    
                        default:
                            break;
                    }
                    var parems ={
                        bagName:self.form.bagName,
                        coursesIds:self.courseIds.join(','),
                        cellphones:self.textareaContent.join('\n'),
                        validityTime:Number(self.radio)==2?self.validityTime:0,
                        welcomeSpeech:self.form.welcomeSpeech,
                        remarks:self.form.remarks||'',
                        id:this.paramsId||''
                    };
                    self.setFromDateEven(parems);
                } else {
                    return false;
                }
                });                
            },   
            //表单提交
            setFromDateEven(parems){
                var self = this;
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;               
                    self.$http.post(self.$server.customerAddBag,parems).then(res=>{
                        if(res.status==200){
                            self.disabledState = !self.disabledState;
                            self.$message.success({ message: "大客户批次创建完成" }); 
                            self.$router.push('/marketelist/member/keyAccountCard');
                        }
                    }).catch(()=>{
                                self.disabledState = !self.disabledState;
                            }) 
                }                
            },
            //选择课程
            selectCourse(){
                // this.boolpluginForDetail =!this.boolpluginForDetail;
                this.courseselectPluginDialog = true;
            }, 
            //选择课程列表
            listSelectEven(objs){
                    if(objs.datas.length>0){
                        this.selectData = objs.datas;
                        this.selectDataBool = false;;
                        this.courseIds = objs.datas.map(x=>{
                            return x.id;
                        });
                    }
                    // this.boolpluginForDetail =objs.bool;
                    this.courseselectPluginDialog = objs.bool;
            },
            //删除选定的课程
            removeSelectCourse(index){
                var remDate =this.selectData.splice(index, 1);
                var indexs =this.courseIds.indexOf(remDate[0].id);
                this.courseIds.splice(indexs,1);
            },
            //删除电话号码
            removeSelectTelephone(index){
                var remDate =this.textareaContent.splice(index, 1);
            }             
        }
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
.keyAccBox .courseselectBox,.keyAccBox .userselectBox{
    display: -webkit-inline-box;
    position: relative;
}
.userSaveBut{
    padding: 0 0 0 270px;
    width: 430px;
}
.userSaveBut div{
    width: 50px;
    height: 30px;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    border-radius: 6px;
    background: #9E0E00;
    color: #fff;
}
.keyAccBox .courseselectBox .courseCount,.keyAccBox .userselectBox .usersCount{
    display: -webkit-inline-box;
}
.keyAccBox .courseselectBox .courseCount .selectCourseBut{
    width: 80px;
    height: 30px;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    border-radius: 6px;
    background: #9E0E00;
    color: #fff;    
}
.keyAccBox .courseselectBox .courseCount .courseList,.keyAccBox .userselectBox .usersCount .usersList{
    height: 200px;
    overflow:auto;
    width: 200px;
    margin-left: 40px;
    padding: 0 0 0 10px;
}
.keyAccBox .courseselectBox .courseCount .courseList .courseListCount,.keyAccBox .userselectBox .usersCount .usersList .usersListCount{
    position: relative;
}
.keyAccBox .courseselectBox .courseCount .courseList .courseListCount i,.keyAccBox .userselectBox .usersCount .usersList .usersListCount i{
    position: absolute;
    top: 5px;
    right: 0px; 
    font-size: 16px; 
}
.keyAccBox .courseselectBox .courseCount .courseList .courseListCount p,.keyAccBox .userselectBox .usersCount .usersList .usersListCount p{
    height: 25px;
    font-size: 14px;
    line-height: 25px;
    width: 170px;
    color: #606266;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;    
}
.keyAccBox .courseselectBox .courseTitle,.keyAccBox .userselectBox .usersTitle{
    width: 120px;
    text-align: right;
    padding: 0 12px 0 0;
    color: #606266;
    font-size: 14px;
}
.keyAccBox .courseselectBox .courseTitle:before{
    content:"*";
    color:#F56C6C;
    margin-right: 4px;
}
.keyAccBox .userselectBox .usersTitle:before{
    content:"*";
    color:#F56C6C;
    margin-right: 4px;
}
.myselfProp{
    color: #F56C6C;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
}
.myselfPropNext{
    color: #F56C6C;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    width: 150px;
    margin-left: 120px;    
}
.radioCss{
    position: relative;
}
.radioCss .requestIcon{
    position: absolute;
    color:#F56C6C;
    left: -62px;
}
.keyAccBox .dialogCourse .el-dialog__body{
    padding: 0 20px 30px 20px !important;
}
</style>
<style scoped lang="scss">
    .userselectBox{
        // margin:10px 0;
        position: relative;
        textarea{
            height: 200px!important;
            resize: none!important;
            display: block;
            width: 200px;
            border-radius: 5px;
            border-color:#ddd;
            padding: 25px;
            line-height: 20px;
            padding: 15px;
            font-size: 14px;
        }
        .words-num{
            position: absolute;
            font-size: 14px;
            color:#666;
            right:10px;
            bottom:10px;
        }
    }
</style>


