<template>
    <el-dialog title="超链接"
               :visible.sync="linkvisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               class="material-dialog editor-dialog link-dialoag">
        <i class="el-icon-close"
           @click.stop="onLinkHide(0)"></i>
        <el-row>
            <label class="label_title"
                   style="width: 50px; margin: 0; font-size: 12px">文本内容</label>
            <div class="label_input">
                <el-input name="text"
                          class="text"
                          :disabled="linkobj.selected"
                          v-model="linkobj.text"
                          style="width: 326px"></el-input>
            </div>
        </el-row>
        <el-row style="padding-top: 10px">
            <label class="label_title"
                   style="width: 50px;margin: 0;font-size: 12px">链接地址</label>
            <div class="label_input">
                <el-input name="href"
                          class="href"
                          v-model="linkobj.href"
                          style="width: 326px"></el-input>
            </div>
        </el-row>
        <p class="tips">您输入的超链接中不包含http等协议名称，默认将为您添加http://前缀</p>
        <span slot="footer"
              class="dialog-footer">
            <el-button @click="onLinkHide(0)">取 消</el-button>
            <el-button type="primary"
                       @click="onLinkHide(1)">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import Clickoutside from "element-ui/lib/utils/clickoutside";
import * as utils from "./utils";
export default {
    props: {
        linkObj: {
            type: Object,
            default() {}
        },
        linkVisible: Boolean
    },
    data() {
        return {
            linkvisible: false,
            linkobj: {}
        };
    },
    directives: { Clickoutside },
    methods: {
        onLinkHide(type) {
            if (type) {
                if (!this.linkobj.text) {
                    this.$message({
                        message: "请先填写文本内容",
                        type: "warning"
                    });
                    return;
                } else if (!this.linkobj.href) {
                    this.$message({
                        message: "请先填写链接地址",
                        type: "warning"
                    });
                    return;
                }
                this.linkobj.href = utils.urlTest(this.linkobj.href);
                this.linkobj.name = this.linkobj.text;
            } else {
                this.linkobj = {};
            }
            this.linkvisible = false;
            this.$emit("linkchange", this.linkobj);
        }
    },
    watch: {
        linkVisible(val) {
            this.linkvisible = val;
        },
        linkObj(val) {
            this.linkobj = val;
        }
    }
};
</script>

