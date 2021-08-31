<template>
    <el-dialog title="插入外链"
               :visible.sync="iframeVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               class="material-dialog editor-dialog link-dialoag">
        <i class="el-icon-close"
           @click.stop="onIframeHide(0)"></i>
        <el-row class="link_dia">
            <div class="mark"></div>

            <el-tabs v-model="iframeobj.type"
                     type="border-card"
                     class="detail-tab">

                <el-tab-pane label="插入图片"
                             name="image">
                    <div class="href_box">
                        <label style="padding-left: 10px">链接地址</label>
                        <div class="label_input">
                            <el-input name="href"
                                      class="href"
                                      v-model="iframeobj.href"
                                      style="width: 280px;"></el-input>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="插入视频"
                             name="video">
                    <div class="href_box1">
                        <i class="icon_img"
                           style="margin-left: 18px"></i>
                        <p style="padding-bottom: 20px; font-size: 12px; color: #999">小程序暂不支持插入视频</p>
                        <label style="padding-left: 10px">链接地址</label>
                        <div class="label_input">
                            <el-input name="href"
                                      class="href"
                                      v-model="iframeobj.href"
                                      style="width: 280px;"></el-input>
                        </div>
                        <div class="textbox"
                             style="padding-left: 75px; font-size: 12px; color: #999; margin-top: 10px">
                            <p>请将视频分享的【通用代码】中src=""内容（不包括src=和引号）复制到上方输入框</p>
                            <p>例如绿色部分：&lt;iframe frameborder="0" width="640" height="498" src="
                                <span style="color: #40C045">https://v.qq.com/iframe/player.html?vid=v0019c7up3l&amp;tiny=0&amp;auto=0</span>
                                "&gt; &lt;/iframe&gt;
                            </p>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-row>
        <span slot="footer"
              class="dialog-footer">
            <el-button @click="onIframeHide(0)">取 消</el-button>
            <el-button type="primary"
                       @click="onIframeHide(1)">确 定</el-button>
        </span>
    </el-dialog>
</template>

<style scoped lang="scss">
.icon_img {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    // background: url('../../../assets/gantan@2x.png') no-repeat;
    background-size: 12px;
    float: left;
    margin: 4px 5px 0 0;
}
.href_box {
    position: relative;
    margin-top: 10px;
    margin-bottom: 134px;
    .href {
        position: absolute;
        top: -5px;
        left: 70px;
    }
}
.href_box1 {
    position: relative;
    .href {
        position: absolute;
        top: 60px;
        left: 70px;
    }
}
.link_dia {
    position: relative;
    .mark {
        width: 202px;
        height: 50px;
        background-color: #fff;
        position: absolute;
        top: -7px;
        right: 0;
        z-index: 100;
        border-bottom: 1px solid #ededed;
    }
}
</style>

<script>
import Clickoutside from "element-ui/lib/utils/clickoutside";

import * as utils from "./utils";
export default {
    props: {
        iframeVisible: Boolean,
        allowType: {
            type: Array,
            default: () => {
                return ["image", "video"];
            }
        }
    },
    data() {
        return {
            iframevisible: false,
            iframeobj: {
                type: "image"
            }
        };
    },
    directives: { Clickoutside },
    methods: {
        onIframeHide(type) {
            if (type) {
                if (!this.iframeobj.href) {
                    this.$message({
                        message: "请先填写链接地址",
                        type: "warning"
                    });
                    return;
                }
                const href = utils.urlTest(this.iframeobj.href);
                if (href == -1) {
                    this.$message({
                        message: "链接地址格式不正确",
                        type: "warning"
                    });
                    return;
                }
                this.iframeobj.href = href;
            } else {
                this.iframeobj = {
                    type: "image",
                    href: ""
                };
            }
            this.iframevisible = !1;
            this.$emit("iframechange", this.iframeobj);
            this.iframeobj = {
                type: "image",
                href: ""
            };
        }
    },
    watch: {
        linkVisible(val) {
            this.iframevisible = val;
        }
    }
};
</script>

