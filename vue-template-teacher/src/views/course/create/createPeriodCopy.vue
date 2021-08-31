<template>
    <div class="creat-period-wrap-copy create-period">
        <div class="form-wrap hide-required-asterisk">
            <h2 class="crumbs-list-common">
                <router-link to="/courseCopy">课程管理</router-link> / <router-link :to="`/course/manageCopy/${$route.params['id']}?type=${$route.query['type']}`">课程详情</router-link> / {{this.periodId?'修改':'新增'}}课时
            </h2>
            <el-form ref="form"
                     :model="form"
                     :rules="rules"
                     label-position="left"
                     label-width="86px">
                <el-form-item label="课时名称"
                              prop="title">
                    <el-input v-model.trim="form.title"
                                maxlength="20"
                                ref="inputs"
                                class="period-name"></el-input><span :style="{color:form.title.length>20&&'#9e0e00'}">{{form.title.length}}/20</span>
                </el-form-item>
                <el-form-item label="课时介绍"
                              prop="introduce">
                            <div class="my-period-editor">
                                <Editor v-model="form.introduce" :maxLength="5000"/>
                            </div>
                    <!-- <my-editor label="brief"
                               class="ueditor-wrap"
                               maximumWords="2000"
                               :content="defaultEditorContent"
                               :handleChange="handleBrief"></my-editor> -->
                </el-form-item>
                <el-form-item label="课时内容"
                              prop="targetId">
                    <el-button type="danger"
                               size="mini"
                               class="add-period"
                               @click="dialogVisible = true">{{periodVideo && periodVideo.id?'修改':'选择'}}课时</el-button>
                    <div class="checked-period"
                         v-if="periodVideo && periodVideo.id">
                        <img :src="periodVideo.videoImage || '/static/images/music.png'"
                             alt=""
                             :title="periodVideo.title"
                             class="img100"
                             @click="previewContent">
                    </div>
                </el-form-item>
                <el-form-item label="是否试看"
                              prop="isTry"
                              v-if="!isFree">
                    <p class="form-hint">*类型在编辑时不可更改</p>
                    <el-radio-group v-model="form.isTry">
                        <el-radio :label="0"
                                  class="istry">否</el-radio>
                        <el-radio :label="1"
                                  class="istry">是</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-button type="danger"
                    class="red-btn save-btn"
                    :loading="btnLoading"
                    @click="save">保存</el-button>            
        </div>
        <!-- <el-button type="danger"
                   class="red-btn save-btn"
                   :loading="btnLoading"
                   @click="save">保存</el-button> -->
        <!-- 选择课时内容 -->
        <el-dialog :visible.sync="dialogVisible"
                   custom-class="common-dialog-header-bg period-check-video"
                   :title="isVideo?'视频库':'音频库'">
            <checkPeriod v-if="dialogVisible"
                         @setPeriodContent="checkVideo"
                         :periodVideo="periodVideo"
                         :isVideo="isVideo" />
        </el-dialog>
        <el-dialog :title="isVideo?'视频预览':'音频预览'"
                   custom-class="common-dialog-header-bg"
                   :visible.sync="previewDialogVisible"
                   :close-on-click-modal="false"
                   width="660px">
            <playVideo v-if="previewDialogVisible"
                       :playType="isVideo?'video':'audio'"
                       :vid="vid"
                       type="sts" />
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="leaveDialogVisible"
            width="30%"
            >
            <span>您有未保存的信息，离开后会丢失，确认要离开吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="leaveDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="leavePage">确 定</el-button>
            </span>
        </el-dialog>     
    </div>
</template>

<script>
// import myEditor from "@/components/editor/editor";
import checkPeriod from "./components/checkPeriod";
import playVideo from "@/components/playVideo";
export default {
    data() {
        return {
            form: {
                title: "",
                introduce: "",
                targetId: "",
                isTry: ""
            },
            rules: {
                title: [
                    {
                        required: true,
                        message: "请输入课时名称",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 20,
                        message: "长度在 1 到 20 个字符",
                        trigger: "blur"
                    }
                ],
                introduce: [
                    {
                        // required: true,
                        message: "请输入课时介绍",
                        trigger: "blur"
                    },
                    // {
                    //     min: 1,
                    //     max: 2000,
                    //     message: "长度在 1 到 2000 个字符",
                    //     trigger: "blur"
                    // }
                ],
                targetId: [
                    {
                        required: true,
                        message: "请选择课时内容",
                        trigger: "blur"
                    }
                ],
                isTry: [
                    {
                        required: true,
                        message: "请选择课时类型",
                        trigger: "change"
                    }
                ]
            },
            dialogVisible: false,
            defaultEditorContent: "",
            periodVideo: {},
            courseId: null,
            periodId: null,
            btnLoading: false,
            isVideo: null,
            isFree: null,
            previewDialogVisible: false,
            vid: "",
            isEditorFlag: {},
            isSaveOut: false,
            inType: null,
            leaveDialogVisible:false,
            leaveFlag:false,
            leavePath:''
        };
    },
    components: { 
        // myEditor, 
        checkPeriod, 
        playVideo },
    mounted() {
        var self = this;
        this.courseId = this.$route.params["id"] || null;
        this.periodId = this.$route.params["pid"] || null;
        this.isVideo = this.$route.query["course-type"] === "1";
        this.isFree = this.$route.query["isfree"] === "1";
        this.inType = this.$route.query["type"];
        if (this.periodId) {
            this.getPeriodInfo();
        } else {
            this.isEditorFlag = JSON.parse(JSON.stringify(this.form));
        }
        // setTimeout(function(){ self.$refs['inputs'].focus() }, 1500);
    },
    beforeRouteLeave(to, from, next) {
        if(this.leaveFlag){
            setTimeout(()=>{
                next();
            },100)
            return;
        }
        this.leavePath = to.fullPath;
        if (this.isSaveOut === true) {
            next();
            return;
        }
        const self = this;
        if (JSON.stringify(self.isEditorFlag) != JSON.stringify(self.form)) {
            this.leaveDialogVisible = true;
            next(false)
            return;
        } else {
            next();
        }
    },
    methods: {
        getPeriodInfo() {
            this.$http
                .get(`${this.$server.periodInfo}${this.periodId}`)
                .then(res => {
                    let data = res.content;
                    this.defaultEditorContent = data.introduce;
                    this.periodVideo = data.audiosList[0] || data.videosList[0];
                    this.form = {
                        title: data.title,
                        introduce: data.introduce,
                        targetId: data.targetId,
                        isTry: data.isTry
                    };
                    this.isEditorFlag = JSON.parse(JSON.stringify(this.form));
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // handleBrief(data) {
        //     this.form.introduce = data.html;
        //     if (data.count > 0) {
        //         this.$refs["form"].clearValidate(["introduce"]);
        //     }
        // },
        checkVideo(item) {
            this.periodVideo = item;
            this.form["targetId"] = item["id"];
            this.dialogVisible = false;
            this.$refs["form"].clearValidate(["targetId"]);
        },
        previewContent() {
            if (this.isVideo) {
                // this.vid = this.periodVideo["vid"];
                this.vid = this.periodVideo["id"];
            } else {
                // this.vid = this.periodVideo["voiceAddress"];
                this.vid = this.periodVideo["id"];
            }
            this.previewDialogVisible = true;
        },
        save() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.btnLoading = true;
                    if (this.isFree) {
                        this.form.isTry = 1;
                    }
                    if(this.form.introduce){
                        if(this.form.introduce.replace(/\s+/g, "").replace(/<[^<>]+>/g,'').replace(/&nbsp;/ig,'').length>5000){
                            this.$message.error("内容长度在 1 到 5000 个字符");
                            this.btnLoading = false;
                            return ;
                        }
                    }
                     let str = `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
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
                                margin-left: -1.5em;
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
                        if(this.form.introduce){
                            this.form.introduce = str+'<div class="xgx-editor">'+this.form.introduce+'</div>'
                        }
                    if (this.periodId) {
                        this.editor();
                    } else {
                        this.create();
                    }
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        create() {
            let self = this;
            let form = JSON.parse(JSON.stringify(this.form));
            form["courseId"] = this.courseId;
            this.$http
                .post(this.$server.periodInfo, form)
                .then(res => {
                    if (res.status === 200) {
                        this.isSaveOut = true;
                        this.$message({
                            message: "课时创建成功，即将跳转到列表页面",
                            type: "success",
                            onClose() {
                                self.btnLoading = false;
                                self.$router.push(
                                    `/course/manageCopy/${self.courseId}?type=${
                                        self.inType
                                    }`
                                );
                            }
                        });
                    }
                })
                .catch(res => {
                    self.btnLoading = false;
                });
        },
        editor() {
            let self = this;
            let form = JSON.parse(JSON.stringify(this.form));
            form["courseId"] = this.courseId;
            this.$http
                .post(`${this.$server.periodInfo}${this.periodId}`, form)
                .then(res => {
                    if (res.status === 200) {
                        this.isSaveOut = true;
                        this.$message({
                            message: "课时修改成功，即将跳转到列表页面",
                            type: "success",
                            onClose() {
                                self.btnLoading = false;
                                self.$router.push(
                                    `/course/manageCopy/${self.courseId}?type=${
                                        self.inType
                                    }`
                                );
                            }
                        });
                    }
                })
                .catch(res => {
                    self.btnLoading = false;
                });
        },
        leavePage(){
            this.leaveFlag = true;
            this.leaveDialogVisible = false;
            this.$router.push(this.leavePath)
        }
    }
};
</script>
<style lang="scss" scoped>
.creat-period-wrap-copy {
    .crumbs-list-common {
        padding-bottom: 33px;
    }
    .form-wrap {
        padding: 17px 19px 0 17px;
        background: #fff;
        zoom: 1;
        overflow: auto;        
    }
    .period-name {
        width: 400px;
        margin-right: 10px;
    }
    .form-hint {
        font-size: 14px;
        color: rgba(202, 202, 202, 1);
    }
    .add-period {
        width: 80px;
        height: 30px;
        background: rgba(158, 14, 0, 1);
        border-radius: 3px;
    }
    .course-type {
        display: block;
        margin-left: 0;
    }
    .checked-period {
        width: 331px;
        height: 171px;
        border: 1px solid rgba(237, 241, 247, 1);
        border-radius: 2px;
        cursor: pointer;
    }
    .save-btn {
        display: block;
        width: 200px;
        margin: 70px auto;
    }
}
</style>
<style lang="scss">
.period-check-video {
    width: 660px;
    .el-dialog__body {
        padding: 0;
    }
}
.create-period {
    .istry {
        display: block;
        margin: 10px 0 15px 0;
    }
}
.my-period-editor{
    width: calc(100% - 110px);
    border:1px solid #dfdfdf;
    .editor-wrapper{
        padding: 0 !important;
        .content-length{
            top:5px!important;
        }
    }
}
</style>
