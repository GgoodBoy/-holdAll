<template>
    <material-dialog :title="'我的图片'"
                     :handlePageChange="handleCurrentChange"
                     :pageSize="15"
                     :materialData="materialData"
                     :openMaterialDialogue="showMaterial"
                     :closeMaterialDialogue="closeImgMaterial"
                     :isImg="true"
                     :toDetermine="toDetermine"
                     :currentPage="currentPage"
                     :pictureNum="pictureNum"
                     :openDialog="openDialog">
        <el-card slot="material-card"
                 v-for="(entry, index) in materialData"
                 :class="{ selectCard: entry.id == selected.selectedId}"
                 :key="entry.id">
            <i class="select-icon"></i>
            <img :src="imgSrc(entry.content.url)"
                 class="materialPic"
                 @click.stop="selectMaterial(entry.id, entry.content.url)">
            <span class="img-title line-overflow">{{ entry.title }}</span>
        </el-card>
        <div slot="material-img"
             class="img-upload upload-button btn-newhover">上传图片

            <input style="opacity: 0;position: absolute;left: 0;right: 0;bottom: 0;top: 0;"
                   type="file"
                   ref="input"></input>

            <div class="upload-process">
                <div class="uploading"
                     v-for="item in fileArr">
                    <span class="load-name">{{ item.name }}</span>
                    <span class="load-size">({{ item.size }}K)</span>
                    <div class="file-line">
                        <div class="img-process"></div>
                    </div>
                </div>
            </div>
        </div>
    </material-dialog>
</template>

<style>
.btn-newhover {
    background-color: #fff !important;
    border: 1px solid #ccc !important;
}
.btn-newhover:hover {
    color: #0095ff;
    border: 1px solid #0095ff !important;
}
</style>


<script>
import { createImgsrc } from "./utils";
import materialDialog from "./material-dialog.vue";

export default {
    props: {
        showMaterial: Boolean,
        handleCurrentChange: Function,
        currentPage: Number,
        openDialog: Function,
        onFile: {
            type: Function,
            default() {}
        },
        onSuccess: {
            type: Function,
            default() {}
        },
        onStart: {
            type: Function,
            default() {}
        }
    },
    data() {
        return {
            // fileUploading: false,
            files: [],
            imgName: "",
            imgSize: "",
            selectImg: {},
            newUploadPic: false,
            fileArr: [],
            imgArr: [],
            openImgMaterial: false,
            materialData: [],
            selected: 0,
            pictureNum: 100
        };
    },

    watch: {
        materialData: function() {
            if (this.newUploadPic == true) {
                this.selectMaterial(
                    this.materialData[0].id,
                    this.materialData[0].content.url
                );
            }
        }
    },
    methods: {
        imgSrc(data) {
            return createImgsrc(data, { width: 236, height: 204 });
        },
        closeImgMaterial() {
            this.$emit("update:showMaterial", false);
            this.newUploadPic = false;
        },

        selectMaterial(id, url) {
            this.selectImg = {
                selectedId: id,
                selectUrl: url
            };
            this.$store.dispatch({
                type: "selectMaterial",
                param: this.selectImg
            });
        },
        fileData(file) {
            this.imgSize = (file.size / 1024).toFixed(0);
            this.imgName = file.name;
            this.onStart();
            this.fileArr.push({
                name: this.imgName,
                size: this.imgSize,
                style: {
                    width: "0"
                }
            });
        },
        fileProgress(data, postFiles) {
            $(".img-process").css("width", data * 160 + "px");
        },
        uploadSuccess(data, postFiles) {
            this.onSuccess(data);
            const imgUrl = data.data.source_url;
            const len = this.fileArr.length;
            this.fileArr.forEach((item, index) => {
                if (item.name == postFiles.name) {
                    // item.url = imgUrl;
                    this.imgArr.push({
                        info: {
                            url: imgUrl,
                            size: item.size,
                            file_name: item.name
                        }
                    });
                }
            });

            if (this.imgArr.length == len) {
                const param = {
                    type: "image",
                    sign: "manage",
                    content: this.imgArr
                };

                this.$store
                    .dispatch({
                        type: "toUploadImage",
                        param
                    })
                    .then(response => {
                        if (response && response.data) {
                            const res = response.data.response;
                            if (res && res.success) {
                                this.$message.success({ message: "上传成功" });
                                this.fileArr = [];
                                this.imgArr = [];
                                const param = {
                                    page: 1,
                                    count: 15,
                                    type: "image",
                                    sign: "manage"
                                };
                                this.$store.dispatch({
                                    type: "toGetMaterialData",
                                    param
                                });
                                this.newUploadPic = true;
                            }
                        }
                    });
            }
        },

        onFileReset() {
            this.imgSize = "";
            this.imgName = "";
            this.fileArr = [];
            this.imgArr = [];
        },

        fileError(data) {
            this.$message.error({
                message: "上传图片失败，请重新上传",
                showClose: true
            });
            setTimeout(() => {
                this.onFileReset();
            }, 2000);
        },

        toDetermine() {
            if (this.selected.selectedId == undefined) {
                this.$message.warning("请选择图片");
            } else {
                this.$store.dispatch({
                    type: "toDetermineSelect"
                });
                this.newUploadPic = false;
            }
        }
    },
    components: { materialDialog }
    // components: { materialDialog, qcloudImg }
};
</script>
