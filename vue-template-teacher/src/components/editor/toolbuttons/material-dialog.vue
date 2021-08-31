<template>
    <el-dialog :title="title"
               :visible.sync="openMaterialDialogue"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               class="material-dialog"
               @open="openDialog"
               :class="{ 'materialImg-dialoag': isImg, 'materialVoice-dialoag': isVoice, 'materialVideo-dialoag': isVideo}">
        <div v-loading="loading">
            <i class="el-icon-close"
               @click.stop="closeMaterialDialogue"></i>
            <el-row class="image-box"
                    v-if="materialData.length !== 0">
                <slot name="material-card"></slot>
            </el-row>
            <el-row v-if="materialData.length == 0"
                    class="image-box empty-data">
                <span class="no-data">暂无数据，请点击上传按钮进行上传</span>
            </el-row>
            <slot v-if="isImg"
                  name="material-img"></slot>
            <div v-if="isVoice || isVideo"
                 style="margin-bottom:  10px;">
                <el-button type="primary"
                           class="upload-button">
                    <router-link :to="uploadPath"
                                 :target="isPlat ? '_self' : '_blank'">{{ uploadType }}</router-link>
                </el-button>
                <p class="refresh-btn"
                   @click.stop="getList(1)">
                    <i class="refresh-icon"></i>
                    <span>刷新</span>
                </p>
            </div>
            <div class="footer">
                <el-button type="primary"
                           class="selected elbtnsel"
                           @click.stop="toDetermine">确定</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props: {
        loading: Boolean,
        title: {
            type: String,
            default: "我的音频"
        },
        uploadType: {
            type: String,
            default: "上传音频"
        },
        handlePageChange: Function,
        currentPage: Number,
        pictureNum: Number,
        openDialog: Function,
        toDetermine: Function,
        materialData: Array,
        openMaterialDialogue: Boolean,
        closeMaterialDialogue: Function,
        isImg: {
            type: Boolean,
            default: false
        },
        isVoice: {
            type: Boolean,
            default: false
        },
        isVideo: {
            type: Boolean,
            default: false
        },
        pageSize: {
            type: Number,
            default: 8
        },
        getList: {
            type: Function,
            dafault: () => {}
        },
        uploadPath: {
            type: String,
            default: "/library/newaudio/create"
        }
    },

    data() {
        return {
            isPlat: localStorage.getItem("plat")
        };
    }
};
</script>
