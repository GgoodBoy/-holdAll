<template>
    <div class="period-wrap preview-period">
        <div class="form-wrap hide-required-asterisk">
            <h2 class="crumbs-list-common">
                <router-link to="/course">课程管理</router-link> / <router-link :to="`/course/manage/${$route.params['id']}?type=${$route.query['type']}`">课程详情</router-link> / 预览
            </h2>
            <el-form ref="form"
                     :model="form"
                     label-position="left"
                     label-width="86px">
                <el-form-item label="课时名称"
                              prop="title">
                    {{form.title}}
                </el-form-item>
                <el-form-item label="课时介绍"
                              prop="introduce">
                    <div v-html="form.introduce"
                         class="period-introduce"></div>
                </el-form-item>
                <el-form-item label="课时内容"
                              prop="targetId">
                    <div class="checked-period"
                         v-if="periodVideo && periodVideo.id">
                        <img :src="periodVideo.videoImage || '/static/images/music.png'"
                             alt=""
                             :title="periodVideo.title"
                             @click="previewContent"
                             class="img100">
                    </div>
                </el-form-item>
                <el-form-item label="是否试看"
                              prop="isTry">
                    <span aria-checked="mixed"
                          class="el-checkbox__input is-checked"><span class="el-checkbox__inner"></span><input type="checkbox"
                               aria-hidden="true"
                               class="el-checkbox__original"
                               value="复选框 A"></span> &nbsp;&nbsp;&nbsp;{{form.isTry === 1?'是':'否'}}
                </el-form-item>
            </el-form>
        </div>
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
    </div>
</template>

<script>
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
            checked: true,
            periodVideo: {},
            periodId: null,
            isFree: null,
            isVideo: null,
            vid: null,
            previewDialogVisible: false
        };
    },
    components: { playVideo },
    mounted() {
        this.periodId = this.$route.params["pid"] || null;
        if (this.periodId) {
            this.getPeriodInfo();
        } else {
            this.$alert("数据错误，即将跳转到课程列表页面", "这里有一个错误", {
                confirmButtonText: "确定",
                callback: action => {
                    this.$router.replace("/course");
                }
            });
        }
    },
    methods: {
        getPeriodInfo() {
            this.$http
                .get(`${this.$server.periodInfo}${this.periodId}`)
                .then(res => {
                    let data = res.content;

                    this.isVideo = data.isVideo;
                    if (data.isVideo) {
                        this.periodVideo = data.videosList[0];
                        // this.vid = this.periodVideo["vid"];
                            this.vid = data.targetId;
                    } else {
                        this.periodVideo = data.audiosList[0];
                        // this.vid = this.periodVideo["voiceAddress"];
                        this.vid = data.targetId;
                    }

                    this.form = {
                        title: data.title,
                        introduce: data.introduce,
                        targetId: data.targetId,
                        isTry: data.isTry
                    };
                })
                .catch(err => {
                    console.log(err);
                });
        },
        previewContent() {
            this.previewDialogVisible = true;
        }
    }
};
</script>
<style lang="scss" scoped>
.period-wrap {
    .crumbs-list-common {
        padding-bottom: 33px;
    }
    .form-wrap {
        padding: 28px 19px 60px 17px;
        background: #fff;
    }
    .period-introduce {
        padding: 10px 0;
        font-size: 16px;
    }
    .checked-period {
        width: 331px;
        height: 171px;
        border: 1px solid rgba(237, 241, 247, 1);
        border-radius: 2px;
        cursor: pointer;
    }
}
</style>
<style lang="scss">
.preview-period {
    .el-form-item__content {
        font-size: 13px;
        color: rgba(58, 58, 58, 1);
    }
    .checked-period {
        .view {
            padding: 0;
            word-wrap: break-word;
            cursor: text;
            height: 90%;
        }
        body {
            margin: 8px;
            font-family: sans-serif;
            font-size: 16px;
        }
        p {
            margin: 5px 0;
        }
    }
}
</style>
