<template>
    <div class="resouce-audio">
        <div class="page-header">
            <el-row>
                <el-col class="lLeft-r lMarginBO30">
                    <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                </el-col>  
            </el-row>            
            <el-input v-model.trim="title"
                      placeholder="请输入标题"
                      class="search-form el-icon-search"
                      @keydown.13.native="search"></el-input>
            <el-button class="red-btn"
                        v-if="$authJudge('source:audio:select')"
                       @click="search">查询</el-button>
        </div>
        <div class="page-content">
            <div class="handle-row clearfix">
                <div class="fl">
                    <el-checkbox :indeterminate="isIndeterminate"
                                 v-model="checkAll"
                                 @change="handleCheckAllChange"><span class="check-all-btn">全部音频</span></el-checkbox>
                </div>
                <div class="fr">
                    <el-button type="info"
                               class="del-btn fl"
                               size="mini"
                               @click="deleteAudio" v-if="$authJudge('source:audio:del')">删除</el-button>
                    <el-button type="danger"
                                v-if="$authJudge('source:audio:upload')"
                               class="upload-audio red-btn fl"
                               @click="$router.push('/resource/audio/createByAli')"
                               size="mini">上传音频</el-button>
                    <!-- <el-button type="danger"
                                v-if="$authJudge('source:audio:upload')"
                               class="upload-audio red-btn fl"
                               @click="$router.push('/resource/audio/create')"
                               size="mini">上传音频</el-button>                                -->
                </div>
            </div>
            <ul class="audio-list clearfix">
                <el-checkbox-group v-model="checkedAudio"
                                   @change="handleCheckedAudioChange">
                    <div class="audio-item fl"
                         v-for="item,i in pageData.items"
                         :key="i">
                        <div class="fl audio-img"
                             @click="handlePlayAudio(item, i)">
                            <svg-icon v-if="previewDialogVisible && playingItem.voiceAddress===item.voiceAddress"
                                      class="icon-play-status"
                                      icon-class="pause" />
                            <svg-icon v-else
                                      class="icon-play-status"
                                      icon-class="playing" />
                        </div>
                        <div class="fl audio-info">
                            <h4 class="audio-name text-ellipsis"
                                :title="item.title">{{item.title}}</h4>
                            <div class="audio-synopsis clearfix">
                                <span class="fl">{{item.fileSize}}</span>
                                <span class="fr">{{item.duration|millisecondToDate}}</span>
                            </div>
                        </div>
                        <el-checkbox :label="item"
                                     class="check-status">
                            {{''}}
                        </el-checkbox>
                    </div>

                </el-checkbox-group>
            </ul>
        </div>
        <!-- :vid="playingItem.voiceAddress" -->
        <playAudio v-if="previewDialogVisible"
                   :vid="playingItem.id"
                   v-show="false"
                   type="sts"
                   playType="audio"
                   :hiddlePlayer="true"
                   ref="audioModule"
                   @isEnd="endAudioPlay" />
        <pagination :totalNum="pageData.totalNum"
                    :currentPage="pageData.currentPage"
                    :changeCallBack="pageChangeCallBack"
                    :pageSize="12"
                    class="paging" />
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import playAudio from "@/components/playVideo";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            title: "",
            checkAll: false,
            checkedAudio: [],
            isIndeterminate: false,
            pageData: {},
            playingItem: {},
            palyingIndex: null,
            previewDialogVisible: false,
            power:[],
            titleList:[                
                {
                    name:'素材',
                    pathInfo:''
                },
                {
                    name:'音频库',
                    pathInfo:''
                } 
            ]
        };
    },
    metaInfo: {
        title: "音频库-素材"
    },
    components: { pagination, playAudio, breadcrumb},
    watch: {
        $route() {
            this.init();
            this.pageChangeCallBack();
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
            this.$http
                .get(this.$server.audioIndex, {
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
            this.$router.push(`/resource/audio?title=${this.title}`);
        },
        deleteAudio() {
            if (this.checkedAudio.length > 0) {
                this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    customClass: "common-confirm-layout",
                    type: "warning"
                })
                    .then(() => {
                        let ids = [];
                        for (let i = 0; i < this.checkedAudio.length; i++) {
                            ids.push(this.checkedAudio[i].id);
                        }
                        if (
                            this.playingItem &&
                            ids.includes(this.playingItem.id)
                        ) {
                            this.$refs["audioModule"].player.pause();
                            this.previewDialogVisible = false;
                        }
                        this.$http
                            .post(this.$server.audio, {
                                ids:JSON.stringify(ids),
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
        handlePlayAudio(item, index) {
            var self = this;
            if (self.playingItem.voiceAddress === item.voiceAddress) {
                try {
                    if (self.previewDialogVisible) {
                        // this.$refs["audioModule"].player.pause();
                        setTimeout(function(){
                            self.previewDialogVisible = false;
                        },500);
                        // self.previewDialogVisible = false;
                    } else {
                        // this.$refs["audioModule"].player.play();
                        setTimeout(function(){
                            self.previewDialogVisible = true;
                        },500);
                    }
                } catch (e) {}
            } else {
                self.previewDialogVisible = false;
                setTimeout(function(){
                    self.previewDialogVisible = true;
                    self.playingItem = item;
                },500);
                
            }
        },
        endAudioPlay(val) {
            this.previewDialogVisible = false;
            this.playingItem = {};
        },
        pageChangeCallBack() {
            this.previewDialogVisible = false;
        },
        handleCheckAllChange(val) {
            this.checkedAudio = val ? this.pageData.items : [];
            this.isIndeterminate = false;
        },
        handleCheckedAudioChange(value) {
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
    padding: 20px;
    background: #fff;
    margin-bottom: 20px;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    .page-title {
        font-size: 18px;
        color: rgba(56, 65, 86, 1);
        margin-bottom: 20px;        
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
    .upload-audio {
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
.audio-item {
    width: 347px;
    height: 137px;
    border: 1px solid rgba(237, 241, 247, 1);
    margin: 0 13px 13px 0;
    overflow: hidden;
    &:nth-of-type(3n) {
        margin-right: 0;
    }
    .audio-img {
        margin: 10px 25px 10px 15px;
        width: 70px;
        height: 70px;
        background-image: -webkit-linear-gradient(top, #8fa1ff, #3757fa);
        border-radius: 50%;
        line-height: 70px;
        text-align: center;
        .icon-play-status {
            font-size: 20px;
            color: #fff;
            cursor: pointer;
            margin: 24px;
        }
    }
    .audio-info {
        margin: 20px 10px 15px 0;
        width: 180px;
        .audio-name {
            margin-bottom: 20px;
            font-size: 18px;
            height: 23px;
        }
        .audio-synopsis {
            font-size: 16px;
            color: rgba(158, 14, 0, 1);
        }
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
.resouce-audio {
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
    .audio-list {
        padding-top: 25px;
        .el-checkbox__input {
            position: absolute;
            left: 20px;
            bottom: 5px;
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
