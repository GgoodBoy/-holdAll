<template>
    <div class="page-wrap create-course-baseinfo hide-required-asterisk">
        <breadcrumb :menuList ='titleList' class="lMarginBO20"></breadcrumb>
        <el-form ref="form"
                 :model="form"
                 :rules="rules"
                 :disabled="disabledVal=='disabledtrue'?true:false"
                 label-width="90px"
                 label-position="left">
            <ul>
                <li class="form-module">
                    <h3 class="module-title">
                        基本信息
                    </h3>
                    <section class="module-details">
                        <el-form-item label="课程名称"
                                      prop="title">
                            <el-input v-model="form.title"
                                      class="default-input"
                                      placeholder="新增课程名称" autofocus="autofocus" ref="inputs"></el-input>
                            <span class="form-hint"
                                  :class="form.title.length>20?'red-text':''">{{form.title.length || 0}}/20</span>
                        </el-form-item>
                        <el-form-item label="课程简介"
                                      prop="intro">
                            <el-input v-model="form.intro"
                                      class="default-input"
                                      placeholder="一句话描述课程核心"></el-input>
                            <span class="form-hint"
                                  :class="form.intro.length>20?'red-text':''">{{form.intro.length || 0}}/20</span>
                        </el-form-item>
                        <el-form-item label="课程类型"
                                      prop="courseType">
                            <p v-show="inType!=='editor'" class="form-hint">类型在校编辑时不可更改</p>

                            <el-radio-group v-model="form.courseType">
                                <el-radio v-for="item,i in pageConstant.courseTypeMap"
                                          :key="i"
                                          class="course-type"
                                          :label="item.value" 
                                          :disabled="canEditorPrice">{{ item.name }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="课程封面"
                                      prop="surfacePlot">
                            <!-- surfacePlot -->
                            <p class="form-hint">750*422像素或16:9，支持PNG、JPG格式，小于1M</p>
                            <el-upload class="avatar-uploader"
                                       :action="action"
                                       :headers="commonHeader"
                                       :before-upload="beforeUpload"
                                       :show-file-list="false"
                                       :on-error="uploadFileError"
                                       :on-success="uploadFileSuccess">
                                <img v-if="form.surfacePlot"
                                     :src="form.surfacePlot"
                                     class="avatar">
                                <i v-else
                                   class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="课程介绍"
                                      prop="introduce">
                            <!-- <my-editor
                                       label="brief"
                                       class="ueditor-wrap"
                                       maximumWords="2000"
                                       :content="editorContent"
                                       :handleChange="handleBrief"></my-editor> -->
                                        <div class="my-course-editor">
                                            <Editor v-model="form.introduce" :maxLength="2000"/>
                                        </div>                                       
                                        <div class="editorStylecss" v-if="disabledVal=='disabledtrue'?true:false"></div>
                        </el-form-item>
                        <el-form-item label="课程讲师"
                                      prop="teacherList">
                            <el-button size="mini"
                                       type="primary"
                                       class="check-teacher"
                                       @click="showTeacherCheckDialog('teach')">选择老师</el-button>
                            <!-- <lectureTeacher v-for="item,i in teachLectureList"
                                            :key="i"
                                            :info="item"
                                            @cancelCheck="cancelTeachChecked" /> -->
                            <lectureTeacher v-for="item,i in chooseteachersOne"
                                            :key="i"
                                            :info="item"
                                            @cancelCheck="cancelTeachChecked" />                                            
                        </el-form-item>
                        <el-form-item label="课时数"
                                      prop="planPeriodNum">
                            <el-input v-model.number="form.planPeriodNum"
                                      class="default-input"
                                      placeholder="请填写课时数量"></el-input>
                            <span class="form-hint">1~99</span>
                        </el-form-item>
                        <el-form-item label="课程分类"
                                      prop="category">
                            <p class="form-hint">*课程只能属于一个分类，课程分类在编辑时不可更换</p>
                            <el-select clearable
                                       class="course-classify form-sort"
                                       v-model="form.category"
                                       placeholder="选择分类">
                                <el-option v-for="item,i in (pageConstant.courseCategoryList)"
                                           :key="i"
                                           :label="item.name"
                                           :value="item.id"></el-option>
                            </el-select>
                            <el-button type="text"
                                       class="classify-utils"
                                       @click.native="createClassify">新建</el-button>
                            <el-button type="text"
                                       class="classify-utils"
                                       @click="getConstant">刷新</el-button>
                        </el-form-item>
                    </section>
                </li>
                <li class="form-module ">
                    <h3 class="module-title">
                        价格信息
                    </h3>
                    <section class="module-details">
                        <el-form-item label="课程价格"
                                      prop="isFree">
                            <div class="price-type clearfix">
                                <el-radio v-model="form.isFree"
                                          @change="valiPrice"
                                          :label="0"
                                          :disabled="canEditorPrice">收费</el-radio>
                                <span>
                                    <el-form-item prop="sellingPrice"
                                                  style="display:inline-block;padding-left:20px;">
                                        <el-input v-model.number="form.sellingPrice"
                                                  class="price-input tc"
                                                  :disabled="form.isFree!=0"
                                                  placeholder="0.1~10000"></el-input>
                                    </el-form-item>
                                    <span class="red-text">夫子币</span>
                                </span>
                                <span style="margin-left:120px">
                                    划价
                                    <el-form-item prop="originalPrice"
                                                  style="display:inline-block;padding-left:20px;">
                                        <el-input v-model.number="form.originalPrice"
                                                  class="original-price tc"
                                                  :disabled="form.isFree!=0"
                                                  placeholder="0.1~10000"></el-input>
                                    </el-form-item>
                                    <span class="red-text">夫子币</span>
                                </span>

                            </div>
                            <div class="price-type">
                                <el-radio v-model="form.isFree"
                                          @change="valiPrice"
                                          :label="1"
                                          :disabled="canEditorPrice">免费</el-radio>
                            </div>
                        </el-form-item>
                        <el-form-item label="老师分成"
                                      prop="bonusRatio" v-show="form.isFree==0">

                            <el-input v-model.number="form.bonusRatio"
                                      class="form-sort"
                                      placeholder="输入老师分成"></el-input>
                                      <span style="font-size:20px; color:#9D0E00; font-weight:bold">%</span>
                        </el-form-item>
                        <el-form-item label="提现老师"
                                      prop="bonusTeacherId" v-show="form.isFree==0">
                            <!-- bonusTeacherId -->
                            <el-button size="mini"
                                       type="primary"
                                       class="check-teacher"
                                       @click="showTeacherCheckDialog('commission')">选择老师</el-button>
                            <div class="clearfix">
                                <!-- <depositTeacher v-for="item,i in commissionTeacherList"
                                                :key="i"
                                                :type="true"
                                                :info="item"
                                                @cancelCheck="cancelCommissionChecked"
                                                class="checked-commission" /> -->
                            <depositTeacher v-for="item,i in chooseteachersTwo"
                                                        :key="i"
                                                        :type="true"
                                                        :info="item"
                                                        @cancelCheck="cancelCommissionChecked"
                                                        class="checked-commission" />                                                
                            </div>
                        </el-form-item>
                    </section>
                </li>
                <el-button type="danger"
                           class="save-btn"
                           @click="save"
                           :loading="btnLoading" v-if="disabledVal=='disabledtrue'?false:true">保存</el-button>
            </ul>
        </el-form>
        <el-dialog :visible.sync="showCheckTeacher"
                   custom-class="common-dialog-header-bg"
                   width="660px"
                   title="老师库"
                   :show-close="false"
                   style="margin-top: -5vh;">
            <checkTeacherDialog v-if="showCheckTeacher"
                                :typeStates="typeChoose"
                                :teachLectureListIds="teachLectureListId"
                                @setLecturer="showLecturer"
                                :list="defaultCheckTeacher"
                                :teacherCheckDialogType="teacherCheckDialogType" />
        </el-dialog>
    </div>
</template>

<script>
// import myEditor from "@/components/editor/editor";
import lectureTeacher from "./components/lectureTeacher";
import depositTeacher from "./components/depositTeacher";
import checkTeacherDialog from "./components/checkTeacherDialog";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import courseStatus from "@/utils/courseStatus"
import { getToken } from '@/utils/auth';
export default {
    data() {
        const self = this;
        let valiTeacherIds = (rule, value, callback) => {
            if (JSON.stringify(this.teachLectureList) === "{}") {
                callback(new Error("请选择授课教师"));
            }else{
                callback();
            } 
        };        
        let valiNumber = (rule, value, callback) => {
            value = value + "";
            switch (rule.fullField) {
                case "planPeriodNum":
                    if (value === "") {
                        callback(new Error("课时数不能为空"));
                        break;
                    } else if (!/^\d+$/.test(value)) {
                        callback(new Error("格式错误"));
                        break;
                    } else if (Number(value) < 1 || Number(value) >= 100) {
                        callback(new Error("课时数范围错误1~99"));
                    }
                    self.form.planPeriodNum = parseInt(value);
                    break;
                case "bonusRatio":
                    if (value === "") {
                        callback(new Error("分红比例不能为空"));
                    } else if (value === "0" || value === 0) {
                        callback();
                    } else if (! /^([1-9]|[1-5][0-9]|60)$/.test(value)){
                        callback(new Error("请输入小于等于60的整数。"))
                    }else {
                        callback(); 
                    }
                    break;
                case "sellingPrice":
                    if (self.form.isFree === 0) {
                        if (value === "") {
                            callback(new Error("售价不能为空"));
                        } else if (
                            /^\d+\.\d+$/.test(Number(value).toString()) &&
                            Number(value)
                                .toString()
                                .split(".")[1].length > 2
                        ) {
                            callback(new Error("请保留两位小数"));
                        } else if (
                            Number(value) < 0.1 ||
                            Number(value) > 10000.01
                        ) {
                            callback(new Error("格式错误(0.1~10000)"));
                        }else if(self.form.originalPrice!==''&&Number(value)>self.form.originalPrice){
                             callback(new Error("价格需要小于划价"));
                        }
                    }
                    break;
                case "originalPrice":
                    if (self.form.isFree === 0) {
                        if (value === "") {
                            callback(new Error("划价不能为空"));
                        } else if (
                            /^\d+\.\d+$/.test(Number(value).toString()) &&
                            Number(value)
                                .toString()
                                .split(".")[1].length > 2
                        ) {
                            callback(new Error("请保留两位小数"));
                        } else if (
                            Number(value) < 0.1 ||
                            Number(value) >= 10000.01
                        ) {
                            callback(new Error("格式错误(0.1~10000)"));
                        }else if(self.form.sellingPrice!==''&&Number(value)<this.form.sellingPrice){
                             callback(new Error("划价需要大于价格"));
                        }
                    }
                    break;
                default:
                    break;
            }
            callback();
        };
        return {
            action:'',
            titleList:[
                        {
                            name:'课程',
                            pathInfo:'/course'
                        },
                        {
                            name:'课程管理',
                            pathInfo:'/course'
                        },
                        {
                            name:'新增课程',
                            pathInfo:''
                        }
                ],            
            form: {
                category: "",
                title: "",
                intro: "",
                courseType: "",
                surfacePlot: "",
                planPeriodNum: "",
                isFree: 0,
                sellingPrice: "",
                originalPrice: "",
                bonusTeacherId: "",
                bonusRatio: "0",
                lastSubmitRemark: "",
                introduce: "",
                // teacherIds: ""
                teacherList:''
            },
            rules: {
                category: [
                    {
                        required: true,
                        message: "请选择课程分类",
                        trigger: "change"
                    }
                ],
                title: [
                    {
                        required: true,
                        message: "请输入课程名称",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 20,
                        message: "长度在 1 到 20 个字符",
                        trigger: "blur"
                    }
                ],
                intro: [
                    {
                        required: true,
                        message: "请输入课程简介",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 20,
                        message: "长度在 1 到 20 个字符",
                        trigger: "blur"
                    }
                ],
                surfacePlot: [
                    {
                        required: true,
                        message: "请上传课程封面图",
                        trigger: "change"
                    }
                ],
                courseType: [
                    {
                        required: true,
                        message: "请选择课程类型",
                        trigger: "change"
                    }
                ],
                planPeriodNum: [{ validator: valiNumber, trigger: "blur" }],
                isFree: [
                    {
                        required: true,
                        message: "请选择课程类型",
                        trigger: "change"
                    }
                ],
                sellingPrice: [{ validator: valiNumber, trigger: "blur" }],
                originalPrice: [{ validator: valiNumber, trigger: "blur" }],
                bonusTeacherId: [
                    //分红老师id: 没有写0
                ],
                bonusRatio: [{ validator: valiNumber, trigger: "blur" }],
                // lastSubmitRemark课 程提交备注参数:0~252
                introduce: [
                    {
                        required: true,
                        message: "请输入课程介绍",
                        trigger: "change"
                    },
                    {
                        min: 1,
                        max: 10000,
                        message: "长度在 1 到 10000 个字符",
                        trigger: "change"
                    }
                ],
                // teacherIds: [{ validator: valiTeacherIds, trigger: "change" }]
                teacherList: [{ validator: valiTeacherIds, trigger: "change" }]
            },
            btnLoading: false,
            dialogImageUrl: "",
            showCheckTeacher: false,
            imgBrief: "",
            graphicData: {},
            pageConstant: {}, //课程常量
            classifyList: {}, //课程分类
            teachLectureList: {}, //授课教师列表
            teachLectureListId:[],
            commissionTeacherList: {}, //提成老师列表
            defaultCheckTeacher: {},
            teacherCheckDialogType: "",
            commonHeader: {},
            isEditorFlag: {},
            /**
             * editor course
             */
            courseInfo: {},
            courseId: "",
            editorContent: "",
            isSaveOut: null,
            canEditorPrice: false,
            inType:'',
            typeChoose:1,
            disabledVal:'disabledfalse',
            chooseteachersOne:[],
            chooseteachersTwo:[]
        };
    },
    metaInfo: {
        title: "创建课程（基本信息）"
    },
    components: {
        // myEditor,
        lectureTeacher,
        depositTeacher,
        checkTeacherDialog,
        breadcrumb
    },
    created() {
        this.commonHeader = {
            token: getToken()
        };
        this.action = this.$server.actionImgOrvideo;
        this.getConstant();
        this.inType = this.$route.query["type"];   
        this.disabledVal = this.$route.query["disabledBool"];   
    },
    mounted() {
        var self = this;
        if (self.$route.name === "courseEditor") {
            self.courseId = self.$route.params["id"];
            self.getCourseInfo();
        } else {
            self.isEditorFlag = JSON.parse(
                JSON.stringify({
                    form: self.form,
                    teachLectureList: self.teachLectureList,
                    commissionTeacherList: self.commissionTeacherList
                })
            );
            setTimeout(function(){ self.$refs['inputs'].focus() }, 1500); 
        }
       	
    },
    watch:{
        teachLectureList(newCul,olCul){
            this.teachLectureListId = [];
            if(newCul){
                setTimeout(()=>{
                    if($(".lecture-wrap").length){
                        $(".lecture-wrap").next('.el-form-item__error').hide();
                    }
                },500);

            }
            for (const iterator in newCul) {
                this.teachLectureListId.push(newCul[iterator].id);
                console.log(this.teachLectureListId);
            }
        }
    },
    methods: {
        /**
         *编辑课程信息获取课程基本资料
         */
        getCourseInfo() {
            let self = this;
            this.$http
                .get(`${this.$server.course}/${this.courseId}`)
                .then(res => {
                    self.courseInfo = res.content;
                    res.content.bonusRatio = res.content.bonusRatio*100;
                    self.form = Object.assign(self.form, res.content);
                    self.editorContent = res.content["introduce"] || "";
                    self.form["introduce"] = res.content["introduce"] || "";
                    self.form.category = res.content["classifyId"];
                    this.canEditorPrice =
                        (this.form.courseStatus !== courseStatus.draft &&
                            this.form.courseStatus !== courseStatus.auditFail) ||
                        this.form.parentId > 0||this.inType=="editor"; //判断是否可编辑
                    //授课老师
                    let teacherInfoList = res.content["teacherInfoList"];
                    for (let i = 0; i < teacherInfoList.length; i++) {
                        let id = teacherInfoList[i]["id"] + "";
                        self.teachLectureList[id] = teacherInfoList[i];
                    }
                    var sorttimeArr = []
                    for(var kes in self.teachLectureList){
                        sorttimeArr.push(self.teachLectureList[kes]);
                    }
                    self.chooseteachersOne = sorttimeArr.sort(self.sequence); 
                    


                    var teacherIdsArr = Object.keys(self.teachLectureList);
                    if(teacherIdsArr.length>0){
                    var chooseTeacherList = teacherIdsArr.map(function(elements,index){
                        console.log(self.teachLectureList);
                                return {
                                    teacherId:Number(elements),
                                    sort:self.teachLectureList[elements].sort
                                }
                        });
                    };
                    this.form["teacherList"] = chooseTeacherList;



                    let bonusTeacherInfoList = res.content["bonusTeacherInfoList"];
                        bonusTeacherInfoList[0].bonusTeacherId = res.content.bonusTeacherId;
                    if (bonusTeacherInfoList.length > 0) {
                        // self.commissionTeacherList[
                        //     bonusTeacherInfoList[0]["bonusTeacherId"] + ""
                        // ] = bonusTeacherInfoList[0];
                        self.commissionTeacherList[
                            bonusTeacherInfoList[0]["id"] + ""
                        ] = bonusTeacherInfoList[0];                        
                    }
                    var sorttimeArrs = []
                    for(var kes in self.commissionTeacherList){
                        sorttimeArrs.push(self.commissionTeacherList[kes]);
                    }
                    self.chooseteachersTwo = sorttimeArrs.sort(self.sequence); 

                    // 设置对比参照看是否更改
                    self.isEditorFlag = JSON.parse(
                        JSON.stringify({
                            form: self.form,
                            teachLectureList: self.teachLectureList,
                            commissionTeacherList: self.commissionTeacherList
                        })
                    );

                })
                .catch(err => {});
        },
        /**
         * 获取课程常量
         */
        getConstant() {
            this.$http
                .get(this.$server.courseConstant)
                .then(res => {
                    this.pageConstant = res.content;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 创建新分类新页面打开
        createClassify() {
            window.open(window.location.origin+"#/classify");
        },
        // 图片文件上传
        beforeUpload(file) {
            if (file.name.length > 200) {
                this.$message.error("文件名字过长，请更改后重试！");
                return false;
            }
            let format = file.name
                .split(".")
                .pop()
                .toLocaleUpperCase();
            if (file.size > 1048576) {
                this.$message.error("文件大小超限，请将文件控制在1M内！");
                return false;
            }
            if (format == "JPG" || format == "PNG" || format == "JPEG") {
                return true;
            } else {
                this.$message.error("文件格式有误，请重试！");
                return false;
            }
        },
        //文件上传失败
        uploadFileError(err, file, fileList) {
            if (err.message) {
                try {
                    let msg = JSON.parse(err.message).message;
                    this.$message.error(msg);
                    return;
                } catch (e) {}
            }
            this.$message.error(JSON.stringify(err));
        },
        // 图片上传成功
        uploadFileSuccess(response, file) {
            if (response.status == 200) {
                this.form.surfacePlot = response.content.resourceUrl;
                this.$refs["form"].validateField("surfacePlot");
            } else {
                this.$message.error(response.message);
            }
        },
        /**
         * 富文本内容获取
         */
        // handleBrief(data) {
        //     this.form.introduce = data.html;
        //     if (data.count > 0) {
        //         this.$refs["form"].clearValidate(["introduce"]);
        //     }
        // },
        /**
         * 展示已选择的课程讲师
         */
        showLecturer(val) {
            if (this.teacherCheckDialogType === "teach") {
                var sorttimeArr = []
                for(var kes in val){
                    sorttimeArr.push(val[kes]);
                }
                this.chooseteachersOne = sorttimeArr.sort(this.sequence);
                console.log(this.chooseteachers);                
                this.teachLectureList = val;
            } else {
                var sorttimeArr = []
                for(var kes in val){
                    sorttimeArr.push(val[kes]);
                }
                this.chooseteachersTwo = sorttimeArr.sort(this.sequence);
                console.log(this.chooseteachers);                 
                this.commissionTeacherList = val;
            }
            this.showCheckTeacher = false;
        },
        /**
         * 删除已选择课程讲师
         */
        cancelTeachChecked(id,objs) {
            console.log(id);
            console.log(objs);
            var sorttimeArr = [];
            this.$delete(this.teachLectureList, id);           
            var numObj = Object.keys(this.commissionTeacherList);
            if(numObj.length>0){
                if(this.commissionTeacherList[numObj[0]].teacherId==id){
                    this.$delete(this.commissionTeacherList,numObj[0]);
                }
            }
            for(var kes in this.teachLectureList){
                sorttimeArr.push(this.teachLectureList[kes]);
            }
            this.chooseteachersOne = sorttimeArr.sort(this.sequence); 
            console.log("teachLectureList",this.teachLectureList);
        },
        sequence(a,b){
         return a.sort - b.sort;
        },
        //  console.log(arr.sort(sequence));        
        /**
         * 删除已选择提成讲师
         */
        cancelCommissionChecked(id) {
            var sorttimeArr = [];
            this.$delete(this.commissionTeacherList, id);
            for(var kes in this.commissionTeacherList){
                sorttimeArr.push(this.teachLectureList[kes]);
            }
            this.chooseteachersTwo = sorttimeArr.sort(this.sequence); 
        },
        /**
         * 显示老师选择的弹窗
         */
        showTeacherCheckDialog(type) {
            if (type === "teach") {
                this.defaultCheckTeacher = this.teachLectureList;
                this.teacherCheckDialogType = "teach";
                this.typeChoose = 1;
            } else {
                this.defaultCheckTeacher = this.commissionTeacherList;
                this.teacherCheckDialogType = "commission";
                this.typeChoose = 2;
            }
            this.showCheckTeacher = true;
        },
        /**
         * 保存
         */
        save() {
            var self = this;
            var teacherIdsArr = Object.keys(this.teachLectureList);
            if(teacherIdsArr.length>0){
            var chooseTeacherList = teacherIdsArr.map(function(elements,index){
                    console.log(self.teachLectureList);
                        return {
                            teacherId:Number(elements),
                            sort:self.teachLectureList[elements].sort
                        }
                });
            };
            this.form["teacherList"] = chooseTeacherList;            
            let form = JSON.parse(JSON.stringify(this.form));
            // form["teacherIds"] = Object.keys(this.teachLectureList); //"teacherId":4,"sort":2 teacherList

                console.log(this.chooseteachers); 
            
            var numObj = Object.keys(this.commissionTeacherList);
            this.$refs["form"].validate(valid => {
                if (valid) {
                    // form["bonusTeacherId"] = form["bonusTeacherId"][0] || 0; //只能选择一个;
                    if(this.commissionTeacherList[numObj]){
                        form["bonusTeacherId"] = this.commissionTeacherList[numObj].bonusTeacherId;
                    }else{
                        form["bonusTeacherId"] = 0;
                    }
                    this.btnLoading = true;
                    //this.form.isFree
                    if(this.form.isFree==0&&form["bonusTeacherId"]==0){
                        this.$message.error("提现老师不能为空");
                        return ;
                    }
                    if(form.introduce.replace(/\s+/g, "").replace(/<[^<>]+>/g,'').replace(/&nbsp;/ig,'').length>2000){
                        this.$message.error("课程简介文字长度在 1 到 2000 个字符");
                        this.btnLoading = false;
                        return ;
                    }
                    let str1 = `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
                        <style>
                            .xgx-editor *{
                                cursor: text;
                                font-size: 16px!important;
                                font-family:'PingFangSC','STHeiti','Microsoft YaHei','Helvetica','Arial',sans-serif;
                            }
                            .xgx-editor ol,.xgx-editor p,.xgx-editor ul{
                                margin: 1em 0;
                                line-height: 1.5;
                            }
                            .xgx-editor hr{
                                margin: 3em 0 0 0;
                                border: 1px solid #e9e9e9;
                                border-width: 1px 0 0;
                            }
                            .xgx-editor blockquote{
                                padding: 12px 8px;
                                color: #999;
                                background-color: #f3f4f5;
                                margin: 10px 0;
                                border:none!important;
                            }
                            .xgx-editor blockquote span{
                                color:#999;
                            }
                            .xgx-editor blockquote p{
                                margin:0!important;
                                line-height: 1.4em!important;
                            }
                            .xgx-editor h1{
                                display:inline-block;
                                font-size: 1em;
                                line-height: 1.25em;
                                padding-left: 12px;
                                font-weight: 700;
                                border-left: 4px solid #f85959;
                                margin: 1em 0;
                            }
                            .xgx-editor img{
                                max-width:100%;
                            }
                            .xgx-editor h1 strong{
                                line-height:1.25em;
                            }
                            .xgx-editor h1 span{
                                font-size: 1em;
                                line-height: 1em;
                            }
                            .xgx-editor pre{
                                background: #f0f0f0!important;
                                color:#222!important;
                                border-radius: 3px;
                            }
                            .xgx-editor p{
                                word-wrap:break-word;
                            }
                            .xgx-editor ol li:not(.ql-direction-rtl),.xgx-editor ul li:not(.ql-direction-rtl){
                                padding-left:1.5em;
                            }
                            .xgx-editor ol > li{
                                list-style:none;
                            }
                            .xgx-editor ol,.xgx-editor ul{
                                padding:0px!important;
                            }
                            .xgx-editor ol > li::before{
                                content:counter(list-0, decimal) '. ';
                                display: inline-block;
                                white-space: nowrap;
                            }
                            .xgx-editor li:not(.ql-direction-rtl)::before{
                                margin-left: -1.6em;
                                margin-right: 0.3em;
                                text-align: right;
                            }
                            .xgx-editor ul > li::before{
                                content:'·';
                            }
                            .xgx-editor blockquote, .xgx-editor h1, .xgx-editor h2, .xgx-editor h3, .xgx-editor h4, .xgx-editor h5, .xgx-editor h6, .xgx-editor ol, .xgx-editor p, .xgx-editor pre, .xgx-editor ul{
                                counter-reset:list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
                            }
                            .xgx-editor ol li{
                                counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
                                counter-increment: list-0
                            }
                        </style>`
                        form.introduce = str1+'<div class="xgx-editor">'+form.introduce+'</div>'                    
                    if (this.courseId) { 
                        this.updateCourse(form);
                    } else {
                        this.createCourse(form);
                    }
                } else {
                    return false;
                }
            });
        },
        // 创建新课程
        createCourse(form) {
            let self = this;
            let obj2 = {};
            form["transformRequest"] = true;
            $.extend( true, obj2, form );
            obj2.bonusRatio = form.bonusRatio/100;            
            this.$http
                .post(this.$server.course, obj2, {
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    }
                })
                .then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        this.isSaveOut = true;
                        this.$message({
                            message: "创建课程成功，即将跳转到详情页面", 
                            type: "success",
                            onClose() {
                                self.btnLoading = false;
                                self.$router.push("/course");
                                self.$router.push(`/course/manage/${res.content.courseId}?type=editor`)
                            }
                        });
                    }
                })
                .catch(res => {
                    self.btnLoading = false;
                });
        },
        // 更新 & 校编辑
        updateCourse(form) {
            let self = this;
            let obj2 = {};
            form["transformRequest"] = true;
            $.extend( true, obj2, form );
            obj2.bonusRatio = form.bonusRatio/100;
            this.$http
                .put(`${this.$server.course}/${this.courseId}`, obj2, {
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    }
                })
                .then(res => {
                    if (res.status === 200) {
                        this.isSaveOut = true;
                        this.$message({
                            message: "课程修改成功，即将跳转到详情页面",
                            type: "success",
                            onClose() {
                                self.btnLoading = false;
                                // self.$router.push(
                                //         `/course/manage/${
                                //             self.courseId
                                //         }?type=${self.$route.query["type"]}`
                                //     );
                                    self.$router.push(
                                        `/course/manage/${
                                            self.courseId
                                        }?type=${self.inType}`
                                    );                                    
                            }
                        });
                    }
                })
                .catch(res => {
                    self.btnLoading = false;
                });
        },
        valiPrice() {
            if (this.form.isFree === 0) {
                if (this.form.sellingPrice) {
                    this.$refs["form"].validateField("sellingPrice");
                }
                if (this.form.originalPrice) {
                    this.$refs["form"].validateField("originalPrice");
                }               
            } else {
                this.form.sellingPrice = "";
                this.form.originalPrice = "";
                this.$refs["form"].clearValidate([
                    "sellingPrice",
                    "originalPrice"
                ]);
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.isSaveOut === true) {
            next();
            return;
        }
        // 校验是否进行了更改
        const self = this;
        let isEditorFlag = {
            form: self.form,
            teachLectureList: self.teachLectureList,
            commissionTeacherList: self.commissionTeacherList
        };
        if (JSON.stringify(isEditorFlag) != JSON.stringify(self.isEditorFlag)) {
            this.$confirm(
                "您有未保存的信息，离开会丢失，确定要离开吗？",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    customClass: "common-confirm-layout",
                    type: "warning"
                }
            )
                .then(() => {
                    next();
                })
                .catch(() => {
                    next(false);
                });
        } else {
            next();
        }
    }
};
</script>

<style scoped lang="scss">
.editorStylecss{
    width: 905px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background: rgba(0,0,0,0.1);
    z-index: 1000;
    cursor: not-allowed;
}
.default-input {
    width: 500px;
}

.form-module {
    border-radius: 5px;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    background: #fff;
    &:not(:first-of-type) {
        margin-top: 20px;
    }
    .module-title {
        height: 40px;
        background: rgba(246, 246, 248, 1);
        line-height: 40px;
        padding-left: 15px;
        font-size: 14px;
        color: rgba(56, 65, 86, 1);
    }
    .module-details {
        padding: 20px;
        width: 1160px;
    }
    .course-type {
        display: block;
        margin: 5px 0 10px;
    }
    .form-sort {
        width: 140px;
        margin-right: 20px;
    }
    .classify-utils {
        color: #9e0e00;
        font-weight: 800;
    }
    .check-teacher {
        background: #9e0e00;
        border-color: #9e0e00;
    }
    .form-hint {
        font-size: 14px;
        color: #aaaaaa;
        margin-left: 20px;
        &.synopsis-hint {
            display: block;
            margin-left: 359px;
        }
    }
    .price-type {
        font-size: 14px;
    }
    .price-input {
        width: 110px;
        margin: 0 17px 0 0;
    }
    .original-price {
        width: 110px;
        margin: 0 20px 0 0;
    }
    .red-text {
        color: rgba(158, 14, 0, 1);
    }
    .checked-commission {
        border: 1px solid #d7d7d7;
        margin: 20px 20px 20px 0;
    }
}
.save-btn {
    display: block;
    width: 200px;
    height: 40px;
    background: rgba(158, 14, 0, 1);
    border-radius: 3px;
    margin: 72px auto 50px;
    &:hover {
        opacity: 0.8;
    }
}
</style>
<style lang="scss">
.create-course-baseinfo {
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .el-radio__input.is-checked .el-radio__inner {
        border-color: rgba(158, 14, 0, 1);
        background: rgba(158, 14, 0, 1);
    }
    .el-radio__input.is-checked + .el-radio__label {
        color: rgba(158, 14, 0, 1);
    }
}
</style>
