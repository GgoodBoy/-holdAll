<template>
    <div class="create-teacher">
        <el-row>
            <el-col class="lLeft-r lMarginBO30 lPaddingRF20">
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
            </el-col>  
        </el-row>        
        <div class="page-title">
            基本信息
        </div>
        <el-form ref="form"
                 class="form-inner hide-required-asterisk"
                 :rules="rules"
                 :model="form"
                 label-width="80px">
            <el-form-item label="老师姓名"
                          prop="name">
                <el-input v-model.trim="form.name"
                          class="teacher-name"></el-input>
                <span class="form-hint"
                      :class="{'error':form.name.length>10}">{{form.name.length}}/10</span>
            </el-form-item>
            <el-form-item label="老师职称"
                          prop="professionalTitle">
                <el-input v-model.trim="form.professionalTitle"
                          class="teacher-title"></el-input>
                <span class="form-hint"
                      :class="{'error':form.professionalTitle.length>16}">{{form.professionalTitle.length}}/16</span>
            </el-form-item>
            <el-form-item label="老师简介"
                          prop="intro">
                <el-input type="textarea"
                          :rows="6"
                          maxlength="200"
                          v-model.trim="form.intro"
                          class="teacher-synopsis"></el-input>
            </el-form-item>
            <el-form-item label="老师头像"
                          prop="avatar">
                          <p class="tips">图片尺寸为{{`${imgSize[0]}*${imgSize[1]}`}},最大不能超过1MB</p>
                <!-- <el-button type="danger"
                            class="update-btn"
                           >上传头像</el-button> -->
                <el-upload class="avatar-uploader"
                           :action="uploadImgSrc"
                           :headers="commonHeader"
                           :before-upload="(file)=>{return beforeUpload(file,imgSize)}"
                           :show-file-list="false"
                           :on-error="uploadFileError"
                           :on-success="uploadFileSuccess"
                           id="update-form">
                    <img v-if="form.avatar"
                         :src="form.avatar"
                         class="avatar">
                    <i v-else
                       class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <el-form-item class="tc">
                <el-button type="info"
                           @click="$router.push('/resource/teacher')"
                           :disabled="loading"
                           class="btn cancel-btn">取消</el-button>
                <el-button type="danger"
                           class="red-btn btn"
                           :loading="loading"
                           @click="onSubmit">{{saveBtnText}}</el-button>

            </el-form-item>
        </el-form>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%"
                 :src="dialogImageUrl"
                 alt="">
        </el-dialog>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            imgSize:[500,500],
            form: {
                name: "",
                professionalTitle: "",
                intro: "",
                avatar: ""
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入老师姓名",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 10,
                        message: "长度在 2 到 10 个字符",
                        trigger: "blur"
                    }
                ],
                professionalTitle: [
                    {
                        required: true,
                        message: "请输入老师职称",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 16,
                        message: "长度在 2 到 16 个字符",
                        trigger: "blur"
                    }
                ],
                intro: [
                    {
                        required: true,
                        message: "请输入老师简介",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 400,
                        message: "长度在 1 到 200 个字符",
                        trigger: "blur"
                    }
                ],
                avatar: [
                    {
                        required: true,
                        message: "请上传老师头像",
                        trigger: "change"
                    }
                ]
            },
            uploadImgSrc:'',
            commonHeader: {},
            dialogImageUrl: "",
            dialogVisible: false,
            loading: false,
            editorId: "",
            disabledState:false,
            saveBtnText: "立即保存",
            titleList:[
                {
                    name:'素材',
                    pathInfo:'/resource/teacher'
                },
                {
                    name:'教师库',
                    pathInfo:'/resource/teacher'
                },
                {
                    name:'新建老师',
                    pathInfo:''
                } 
            ]            
        };
    },
    metaInfo: {
        title: "老师库-素材"
    },
    components:{
        breadcrumb
    },    
    created() {
        this.uploadImgSrc = this.$server.actionImgOrvideo;
        this.commonHeader = {
            token: getToken()
        };
        if (
            this.$route.name === "teacherResourceEditor" &&
            this.$route.params["id"]
        ) {
            this.editorId = this.$route.params["id"];
            this.getTeacherInfo(this.editorId);
            this.saveBtnText = "立即更新";
        }
    },
    mounted() {

    },
    methods: {
        getTeacherInfo(id) {
            this.$http
                .get(`${this.$server.teacher}${id}`)
                .then(res => {
                    this.form = res.content;
                })
                .catch(err => {
                    this.$message({
                        message: err.message,
                        type: "info"
                    });
                });
        },
        beforeUpload(file,size) {
            if (file.name.length > 200) {
                this.$message.error("文件名字过长，请更改后重试！");
                return false;
            }                    
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < 1;
            if (!isJPG) {
                this.$message.error('文件格式有误，请重试！');
            }
            if (!isLt2M) {
                this.$message.error('上传图片最大为1M!');
            }
            const isSize = new Promise(function(resolve, reject) {
                let width = size[0];
                let height = size[1];
                let _URL = window.URL || window.webkitURL;
                let img = new Image();
                img.onload = function() {
                    let valid = img.width == width && img.height== height;
                    valid ? resolve() : reject();
                }
                img.src = _URL.createObjectURL(file);
            }).then(() => {
                return file;
            }, () => {
                this.$message.error('上传的图片必须是等于'+size[0]+'*'+size[1]+'!');
                return Promise.reject();
            });
            return isJPG && isLt2M && isSize; 
        },
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
        uploadFileSuccess(response, file) {
            if (response.status == 200) {
                this.form.avatar = response.content.resourceUrl;
                this.$refs["form"].validateField("avatar");
            } else {
                this.$message.error(response.message);
            }
        },
        onSubmit() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    if (!this.editorId) {
                        this.createTeacher();
                    } else {
                        this.editorTeacher();
                    }
                } else {
                    return false;
                }
            });
        },
        createTeacher() {
            let self = this;
             if(!this.disabledState){
                this.disabledState=!this.disabledState;
                this.$http
                    .post(this.$server.teacher, this.form)
                    .then(res => {
                        if (res.status === 200) {
                            this.disabledState=!this.disabledState;
                            this.$message({
                                message: "添加教师资源成功，即将跳转到列表页面",
                                type: "success",
                                onClose() {
                                    self.loading = false;
                                    self.$router.push("/resource/teacher");
                                }
                            });
                        }
                    })
                    .catch(res => {
                        this.disabledState=!this.disabledState;
                        this.loading = false;
                    });
             }
        },
        editorTeacher() {
            let self = this;
            if (!this.form["teacherId"]) {
                this.form["teacherId"] = this.editorId;
            }
            if(!this.disabledState){
                this.disabledState=!this.disabledState;
                this.$http
                    .post(`${this.$server.teacher}${this.editorId}`, this.form)
                    .then(res => {
                        if (res.status === 200) {
                            this.disabledState=!this.disabledState;
                            this.$message({
                                message: "修改教师资源成功，即将跳转到列表页面",
                                type: "success",
                                onClose() {
                                    self.loading = false;
                                    selthisf.$router.push("/resource/teacher");
                                }
                            });
                        }
                    })
                    .catch(res => {
                        this.disabledState=!this.disabledState;
                        this.loading = false;
                    });
            }
        }
    }
};
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
</style>

<style scoped lang="scss">
.create-teacher {
    margin: 20px 0 0;
    background: #fff;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    .page-title {
        height: 40px;
        line-height: 40px;
        color: rgba(56, 65, 86, 1);
        background: rgba(246, 246, 248, 1);
        padding-left: 15px;
    }
    .form-inner {
        padding: 20px;
    }
}
.tips{
    color:#999;
}
.teacher-name {
    width: 400px;
}
.teacher-title {
    width: 400px;
}
.teacher-synopsis {
    width: 800px;
}
.form-hint {
    font-size: 14px;
    color: #aaaaaa;
    margin-left: 20px;
    &.error {
        color: #b4272d;
    }
}
.update-btn {
    width: 80px;
    text-align: center;
    line-height: 30px;
    padding: 0;
    height: 30px;
    background: rgba(158, 14, 0, 1);
    border-color: #b4272d;
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    border-radius: 3px;
    margin-top: 8px;
}
.btn {
    width: 130px;
    margin: 70px;
    .cancel-btn {
        background: #a9a9a9;
    }
}
</style>
<style lang="scss">
.create-teacher {
    .avatar-uploader {
        margin-top: 30px;
    }
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
        background: #f5f5f5;
    }
}
</style>
