<template>
    <div class="wrap">
        <!-- 讲师弹窗 -->
        <div class="refresh-btn"
             @click="init(1)">
            <img src="./../../../../assets/images/shuaxin.png"
                 alt="">刷新
        </div>
        <div class="seach-layout">
            <el-input v-model.trim="title"
                    placeholder="请输入老师名称"
                    class="search-form"
                    @keydown.13.native="search"></el-input>
            <el-button class="red-btn" type="danger"
                        v-if="$authJudge('source:video:select')"
                    @click="searchVideo">查询</el-button>
        </div>        
        <div class="clearfix">
            <div class="fl item"
                 v-for="(item,i) in teacherData.items"
                 :name="i"
                 :key="i"
                 @click="handle(item,checkedTeacherList[item.id])"
                 :class="{checked:checkedTeacherList[item.id]}">
                <div class="deposit-wrap fl">
                    <!-- 讲师弹窗列表样式 -->
                    <div class="deposit-inner clearfix">
                        <div class="teacher-img fl"><img :src="item.avatar"
                                 alt=""></div>
                        <div class="teacher-info fl">
                            <h4 class="teacher-name text-ellipsis">
                                {{item.name}}
                            </h4>
                            <p class="teacher-professional text-ellipsis">
                                {{item.professionalTitle}}
                            </p>
                            <div class="teacher-intro">
                                {{item.intro}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="paging-inner tc">
            <el-pagination background
                           layout="prev, pager, next"
                           :total="teacherData.totalNum"
                           :current-page="teacherData.currentPage"
                           :page-size="6"
                           @current-change="changePage">
            </el-pagination>
        </div>
        <div slot="footer"
             class="dialog-footer tc">
            <el-button plain
                       class="red-border-btn btn"
                       @click="close">取消</el-button>
            <el-button type="danger"
                       class="red-btn btn"
                       @click="save">确定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: ["list", "teacherCheckDialogType",'typeStates','teachLectureListIds'],
    data() {
        return {
            teacherData: {},
            checkedTeacherList: {},
            title:''
        };
    },
    created() {
        this.init();
        this.checkedTeacherList = JSON.parse(JSON.stringify(this.list));
    },
    methods: {
        searchVideo(){
            this.init();
        },
        init(page = 1) {
            var self = this;
            var urls = '';
            if(this.typeStates==1){
                urls = this.$server.teacherIndex;
            }else{
                urls = this.$server.teacherIndex1;
            }
            this.$http
                .get(urls, {
                    params: {
                        page,
                        pageSize: 6,
                        title:self.title,
                        teacherIds:self.teachLectureListIds.join(",")
                    }
                })
                .then(res => {
                    this.teacherData = res.content;
                })
                .catch(err => {});
        },
        changePage(val) {
            this.init(val);
        },
        handle(item, y) {
            if (this.checkedTeacherList[item.id]) {
                // this.checkedTeacherList[item.id] = undefined;
                delete this.checkedTeacherList[item.id]
            } else {
                if (this.teacherCheckDialogType === "commission") {
                    this.checkedTeacherList = {};
                    item['sort'] = Number(new Date());
                    this.checkedTeacherList[item.id] = item;
                    console.log(this.checkedTeacherList);
                } else {
                    item['sort'] = Number(new Date());
                    this.checkedTeacherList[item.id] = item;
                    console.log(this.checkedTeacherList);
                }
            }
            this.$forceUpdate();
        },
        save() {
            if (JSON.stringify(this.checkedTeacherList) !== "{}") {
                this.$emit("setLecturer", this.checkedTeacherList);
            } else {
                this.$message.error("请选择授课教师后重试");
            }
        },
        close() {
            this.$parent.$parent.showCheckTeacher = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.item {
    margin: 0 20px 20px 0;
    width: 299px;
    height: 149px;
    background: rgba(245, 245, 245, 1);
    border: 1px solid rgba(237, 241, 247, 1);
    border-radius: 2px;
    position: relative;
    &:nth-of-type(2n) {
        margin-right: 0;
    }
    &.checked {
        border-color: #9e0e00;
        &:after {
            content: "";
            border-right: 16px solid #b4272d;
            border-left: 16px solid whitesmoke;
            border-top: 16px solid #b4272d;
            border-bottom: 16px solid whitesmoke;
            position: absolute;
            top: 0;
            right: 0;
            z-index: 100;
        }
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
    }
    .deposit-wrap {
        width: 100%;
        height: 100%;
        border-radius: 2px;
        position: relative;
        line-height: 1;
        cursor: pointer;
        .deposit-inner {
            font-size: 14px;
            .teacher-img {
                width: 95px;
                height: 129px;
                border-radius: 5px;
                overflow: hidden;
                margin: 10px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .teacher-info {
                width: 174px;
            }
            .teacher-name {
                margin: 13px 0;
                color: rgba(56, 65, 86, 1);
            }
            .teacher-professional {
                color: rgba(56, 65, 86, 1);
                margin-bottom: 19px;
            }
            .teacher-intro {
                color: rgba(154, 154, 154, 1);
                line-height: 24px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
            }
        }        
    }    
}
.paging-inner {
    margin: 10px 0 42px;
}
.dialog-footer {
    margin: 20px 20px 15px 0;
}
.btn {
    width: 130px;
    margin: 0 35px;
}
.refresh-btn {
    color: #cacaca;
    position: absolute;
    top: 14px;
    right: 18px;
    cursor: pointer;
    img {
        width: 20px;
        margin-right: 10px;
        vertical-align: middle;
    }
}
.seach-layout{
    display:flex;
    flex-direction: row;
    justify-content:flex-start;
    margin-bottom: 20px;
    .search-form{
        margin-right: 10px;
    }
}
</style>

