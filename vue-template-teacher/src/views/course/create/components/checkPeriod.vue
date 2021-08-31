<template>
    <div>
        <div class="search-wrap clearfix">
            <div class="input-wrap fl">
                <el-input v-model="sn"></el-input>
                <i class="el-icon-search search-btn"
                   @click="search"></i>
            </div>
            <el-button type="danger"
                       class="fl red-btn"
                       @click="uploadVideo">上传课时</el-button>
            <el-button type="text"
                       class="fl refresh"
                       @click="init(1)">刷新</el-button>
        </div>
        <ul class="video-list clearfix">
            <li class="video-item fl"
                v-for="(item,i) in videoLData.items"
                @click="check(item)"
                :class="{'active':item.id === checkedItem.id}" :key="i">
                <div class="video-img fl">
                    <img :src="item.videoImage || '/static/images/music.png'"
                         alt=""
                         class="img100">
                </div>
                <div class="video-info fl">
                    <h4 class="video-title text-ellipsis" :title="item.title">
                        {{item.title}}
                    </h4>
                    <div class="video-data clearfix">
                        <span class="fl">{{item.fileSize}}</span>
                        <span class="fr">{{item.duration | millisecondToDate}}</span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="paging-inner tc">
            <el-pagination background
                           layout="prev, pager, next"
                           :total="videoLData.totalNum"
                           :current-page="videoLData.currentPage"
                           :page-size="8"
                           @current-change="changePage">
            </el-pagination>
        </div>
        <div class="btn-wrap tc">
            <el-button type="danger"
                       class="red-btn save-btn"
                       @click="save">确定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: ["periodVideo","isVideo"],
    data() {
        return {
            videoLData: {},
            sn: "",
            searchSn: "",
            checkedItem: {},
            reqUrl:''
        };
    },
    mounted() {
        if (this.periodVideo && this.periodVideo["id"]) {
            this.checkedItem = this.periodVideo;
        }
        this.reqUrl = this.isVideo?this.$server.videoIndex:this.$server.audioIndex;
        this.init();
    },
    methods: {
        init(page = 1, title = "") {
            this.$http
                .get(this.reqUrl, {
                    params: {
                        page,
                        title,
                        pageSize: 8,
                        videoType:1
                    }
                })
                .then(res => {
                    this.videoLData = res.content;
                })
                .catch(err => {});
        },
        check(item) {
            this.checkedItem = item;
        },
        search() {
            this.searchSn = this.sn;
            this.init(1, this.searchSn);
        },
        uploadVideo() {
            if(this.isVideo) {
                window.open(window.location.origin+"#/resource/video");
            }else {
                window.open(window.location.origin+"#/resource/audio");
            }
        },
        changePage(val) {
            this.init(val, this.searchSn);
        },
        save() {
            if (this.checkedItem && this.checkedItem["id"]) {
                this.$emit("setPeriodContent", this.checkedItem);
            } else {
                this.$message.error("您还没选择课时内容！");
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.search-wrap {
    margin: 17px 0 37px;
    .input-wrap {
        width: 451px;
        margin: 0 10px 0 18px;
        position: relative;
        .search-btn {
            position: absolute;
            font-size: 20px;
            top: 12px;
            right: 10px;
            cursor: pointer;
            background: #fff;
        }
    }
    .red-btn {
        width: 100px;
    }
    .refresh {
        margin-left: 18px;
        color: #b4272d;
    }
}
.video-list {
    padding: 0 20px;
}
.video-item {
    width: 299px;
    height: 79px;
    background: rgba(245, 245, 245, 1);
    border: 1px solid rgba(237, 241, 247, 1);
    border-radius: 2px;
    margin: 0 10px 10px 0;
    &:nth-of-type(2n) {
        margin-right: 0;
    }
    &.active {
        outline: 1px solid #b4272d;
        position: relative;
        &:before {
            content: "";
            position: absolute;
            width: 8px;
            height: 12px;
            border-bottom: 1px solid #fff;
            border-right: 1px solid #fff;
            top: 1px;
            right: 5px;
            z-index: 101;
            transform: rotateZ(45deg);
        }
        &:after {
            content: "";
            border-right: 16px solid #b4272d;
            border-left: 16px solid #fff;
            border-top: 16px solid #b4272d;
            border-bottom: 16px solid #fff;
            position: absolute;
            top: -1px;
            right: -1px;
            z-index: 100;
        }
    }
    .video-img {
        width: 95px;
        height: 59px;
        border-radius: 5px;
        margin: 10px;
    }
    .video-info {
        font-size: 14px;
        width: 182px;
        color: rgba(56, 65, 86, 1);
    }
    .video-title {
        margin: 21px 0 18px;
    }
    .video-data {
        padding-right: 25px;

        color: #b4272d;
    }
}
.paging-inner {
    margin: 42px 0 32px;
}
.save-btn {
    width: 130px;
    margin-bottom: 30px;
}
</style>

