<template>
    <div class="resouce-video">
        <div class="page-header">
            <el-row>
                <el-col class="lLeft-r lMarginBO30">
                    <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                </el-col>  
            </el-row>             
            <el-input v-model.trim="title"
                      placeholder="请输入标题"
                      class="search-form"
                      @keydown.13.native="search"></el-input>
            <el-button class="red-btn"
                        v-if="$authJudge('source:video:select')"
                       @click="search">查询</el-button>
        </div>
        <div class="page-content">
            <div class="handle-row clearfix">
                <div class="fl"
                     style="line-height: 40px;">
                    <el-checkbox :indeterminate="isIndeterminate"
                                 v-model="checkAll"
                                 @change="handleCheckAllChange"><span class="check-all-btn">全部视频</span></el-checkbox>
                </div>
                <div class="fr clearfix">
                    <el-button type="info"
                               class="del-btn fl"
                               size="mini"
                               @click="deleteTeacher" v-if="$authJudge('source:video:del')">删除</el-button>
                    <!-- <el-button type="primary"
                                v-if="$authJudge('source:video:upload')"
                               class="upload-video red-btn fl"
                               @click="$router.push('/resource/video/create')"
                               size="mini">上传视频</el-button> -->
                    <el-button type="primary"
                                v-if="$authJudge('source:video:upload')"
                               class="upload-video red-btn fl"
                               @click="$router.push('/resource/video/createAli')"
                               size="mini">上传视频</el-button>                               
                </div>
            </div>
            <ul class="video-list clearfix">
                <el-checkbox-group v-model="checkedVideo"
                                   @change="handleCheckedVideoChange">

                    <div class="video-item fl"
                         v-for="item,i in pageData.items"
                         :key="i">
                        <div class="clearfix preview"
                             @click="previewVideo(item)">
                            <div class="fl video-img">
                                <img :src="item.videoImage"
                                     class="img100"
                                     alt="">
                            </div>
                            <div class="fl video-info">
                                <h4 class="video-name text-ellipsis"
                                    :title="item.title">{{ item.title }}</h4>
                                <div class="video-synopsis clearfix">
                                    <span class="fl">{{ item.fileSize }}</span>
                                    <span class="fr">{{item.duration | millisecondToDate}}</span>
                                </div>
                            </div>
                        </div>
                        <el-checkbox :label="item"
                                     class="check-status">
                            <div class="check-status">
                            </div>
                        </el-checkbox>
                    </div>

                </el-checkbox-group>
            </ul>
        </div>
        <el-dialog title="视频预览"
                   custom-class="common-dialog-header-bg"
                   :visible.sync="previewDialogVisible"
                   :close-on-click-modal="false"
                   width="660px">
                    <!-- :vid="playingItem.vid" -->
            <playVideo v-if="previewDialogVisible"
                       :vid="playingItem.id"
                       :playType="'video'"
                       type="sts" />
        </el-dialog>
        <pagination :totalNum="pageData.totalNum"
                    :currentPage="pageData.currentPage"
                    :changeCallBack="pageChangeCallBack"
                    :pageSize="12"
                    class="paging" />
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import playVideo from "@/components/playVideo";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            title: "",
            checkAll: false,
            checkedVideo: [],
            isIndeterminate: false,
            pageData: {},
            previewDialogVisible: false,
            playingItem: {},
            playauth: "",
            power:[],
            titleList:[
                {
                    name:'素材',
                    pathInfo:''
                },
                {
                    name:'视频库',
                    pathInfo:''
                } 
            ]             
        };
    },
    metaInfo: {
        title: "视频库-素材"
    },
    components: { 
        pagination, 
        playVideo,
        breadcrumb },
    watch: {
        $route() {
            this.init();
        }
    },
    created() {
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }
        this.power = flag;         
        this.init();
    },
    methods: {
        init() {
            let query = JSON.parse(JSON.stringify(this.$route.query));
            this.title = query.title || "";
            query["pageSize"] = 12;
            query.videoType = 1;
            this.$http
                .get(this.$server.videoIndex, {
                    params: query
                })
                .then(res => {
                    this.pageData = res.content;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        search() {
            this.$router.push(`/resource/video?title=${this.title}`);
        },
        deleteTeacher() {
            if (this.checkedVideo.length > 0) {
                this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    customClass: "common-confirm-layout",
                    type: "warning"
                })
                    .then(() => {
                        let ids = [];
                        for (let i = 0; i < this.checkedVideo.length; i++) {
                            ids.push(this.checkedVideo[i].id);
                        }
                        this.$http
                            .delete(this.$server.video, {
                                data: {
                                    ids,
                                    transformRequest: true
                                },
                                headers: {
                                    "Content-Type":
                                        "application/json;charset=utf-8"
                                }
                            })
                            .then(res => {
                                if (res.status === 200) {
                                    this.$message({
                                        message: "删除成功，正在获取最新数据",
                                        type: "success"
                                    });
                                    this.init();
                                }
                            });
                    })
                    .catch(() => {});
            }
        },
        previewVideo(item) {
            this.playingItem = item;
            console.log("playingItem",item)
            this.previewDialogVisible = true;
        },
        handleCheckAllChange(val) {
            this.checkedVideo = val ? this.pageData.items.slice(0) : [];
            this.isIndeterminate = false;
        },
        pageChangeCallBack() {
            this.checkedVideo = [];
            this.isIndeterminate = false;
        },
        handleCheckedVideoChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.pageData.items.length;
            this.isIndeterminate =
                checkedCount > 0 && checkedCount < this.pageData.items.length;
        }
    }
};
</script>

<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
</style>

<style scoped lang="scss">
.page-header {
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    .page-title {
        font-size: 18px;
        color: rgba(56, 65, 86, 1);
        margin-bottom: 20px;
        h3{
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
            padding: 10px 0;
            cursor: pointer;
            &.active{
                border-bottom:2px solid #b4272d;
            }
        }
    }
    .red-btn{
        background: #b4272d;
        color: #fff;
    }    
    .search-form {
        width: 240px;
        margin-right: 20px;
        position: relative;
        &.el-icon-search:before {
            position: absolute;
            font-size: 18px;
            right: 10px;
            top: 10px;
            background: #fff;
            font-weight: 900;
        }
    }
}
.page-content {
    padding: 20px;
    background: #fff;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
}
.handle-row {
    margin: 10px 0;
    .upload-video {
        background: #b4272d;
        margin-left: 20px;
    }
    .del-btn {
        height: 40px;
    }
    .check-all-btn {
        font-size: 18px;
        color: rgba(56, 65, 86, 1);
    }
}
.video-item {
    width: 347px;
    height: 133px;
    border: 1px solid rgba(237, 241, 247, 1);
    background: rgba(245, 245, 245, 1);
    border-radius: 2px;
    margin: 0 13px 13px 0;
    &:nth-of-type(3n) {
        margin-right: 0;
    }
    .preview {
        cursor: pointer;
    }
    .video-img {
        margin: 10px;
        width: 117px;
        height: 71px;
        background: #d8d8d8;
    }
    .video-info {
        margin: 10px 10px 10px 0;
        width: 198px;
        .video-name {
            margin-bottom: 30px;
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
        }
    }
    .video-synopsis {
        color: #b4272d;
        font-size: 14px;
    }
    .check-status {
        height: 40px;
        width: 100%;
        background: rgba(234, 234, 234, 1);
    }
}
.paging {
    margin: 60px 0 120px;
}
</style>
<style lang="scss">
.resouce-video {
    .el-checkbox__inner {
        width: 20px;
        height: 20px;
        &::after {
            width: 6px;
            height: 11px;
            left: 6px;
        }
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #b4272d;
        border-color: #b4272d;
    }
    .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
        height: 5px;
        top: 6px;
    }
    .video-list {
        padding-top: 20px;
        .el-checkbox__input {
            position: absolute;
            left: 20px;
            bottom: 10px;
            &::after {
                content: "选择";
                font-size: 14px;
                float: right;
                margin: 3px 0 0 10px;
            }
        }
        .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #606266;
        }
        .el-checkbox,
        .el-checkbox__input {
            white-space: initial;
        }
    }
}
</style>
