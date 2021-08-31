<style lang="scss">
/*
* UE
*/
@import "@/styles/ueditor.scss";
@import "@/styles/material-dialog.scss";
.editor-area {
    min-height: 400px;
    border: 1px solid #ccc;
}
</style>
<template>
    <div class="edui-box"
         ref="eduiBox">
        <div class="edui-toolbar"
             id="eduiToolbar"
             ref="toolbarBox"
             :style="toolbarStyle">
            <div id="tool-bar"
                 class="edui-toolbar-inner">
                <el-tooltip v-model="tVisible['t0']"
                            :manual="true"
                            content="撤销"
                            placement="top"
                            effect="dark"
                            v-bind:class="[toolStates.undo == 1 ? 'tool-bar-selected' : '', toolStates.undo == -1 ? 'tool-bar-disabled' : '' ]">
                    <div class="edui-icon toolbar-undo"
                         @click="execCommand('undo')"
                         @mouseenter.stop="mouseEnterEvent('t0', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t0', $event)">
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t1']"
                            :manual="true"
                            content="重做"
                            placement="top"
                            effect="dark"
                            v-bind:class="[toolStates.redo == 1 ? 'tool-bar-selected' : '', toolStates.redo == -1 ? 'tool-bar-disabled' : '' ]">
                    <div class="edui-icon toolbar-redo"
                         @click="execCommand('redo')"
                         @mouseenter.stop="mouseEnterEvent('t1', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t1', $event)">
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t2']"
                            :manual="true"
                            content="字号"
                            placement="top"
                            effect="dark">
                    <div class="edui-toolselect"
                         @mouseenter.stop="mouseEnterEvent('t2', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t2', $event)">
                        <ywyFontSize :fontSize="toolValues.fontsize"
                                     @fontsizechange="execFontSizeCommand"
                                     :listVisible="listVisible"></ywyFontSize>
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t3']"
                            :manual="true"
                            content="字体颜色"
                            placement="top"
                            effect="dark">
                    <div class="edui-toolselect toolbar-forecolor"
                         @mouseenter.stop="mouseEnterEvent('t3', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t3', $event)">
                        <ywyToolSelect :defaultvalue="toolValues.forecolor"
                                       @toolselectvaluechange="execSelectCommand"
                                       keyName="forecolor"
                                       :colorPicker="true"
                                       :listVisible="listVisible"></ywyToolSelect>
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t4']"
                            :manual="true"
                            content="背景颜色"
                            placement="top"
                            effect="dark">
                    <div class="edui-toolselect toolbar-backcolor"
                         @mouseenter.stop="mouseEnterEvent('t4', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t4', $event)">
                        <ywyToolSelect :defaultvalue="toolValues.backcolor"
                                       @toolselectvaluechange="execSelectCommand"
                                       keyName="backcolor"
                                       :colorPicker="true"
                                       :listVisible="listVisible"></ywyToolSelect>
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t5']"
                            :manual="true"
                            content="加粗"
                            placement="top"
                            effect="dark"
                            v-bind:class="[toolStates.bold == 1 ? 'tool-bar-selected' : '']">
                    <div class="edui-icon toolbar-bold"
                         v-on:click="execCommand('bold')"
                         @mouseenter.stop="mouseEnterEvent('t5', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t5', $event)">
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t6']"
                            :manual="true"
                            content="斜体"
                            placement="top"
                            effect="dark"
                            v-bind:class="[toolStates.italic == 1 ? 'tool-bar-selected' : '']">
                    <div class="edui-icon toolbar-italic"
                         v-on:click="execCommand('italic')"
                         @mouseenter.stop="mouseEnterEvent('t6', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t6', $event)">
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t7']"
                            :manual="true"
                            content="下划线"
                            placement="top"
                            effect="dark"
                            v-bind:class="[toolStates.underline == 1 ? 'tool-bar-selected' : '']">
                    <div class="edui-icon toolbar-underline"
                         v-on:click="execCommand('underline')"
                         @mouseenter.stop="mouseEnterEvent('t7', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t7', $event)">
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t8']"
                            :manual="true"
                            content="对齐方式"
                            placement="top"
                            effect="dark">
                    <div class="edui-toolselect toolbar-align"
                         @mouseenter.stop="mouseEnterEvent('t8', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t8', $event)">
                        <ywyToolSelect :valueList="toolOptions.alignlist"
                                       :defaultvalue="toolValues.justify"
                                       @toolselectvaluechange="execSelectCommand"
                                       keyName="justify"
                                       :listVisible="listVisible"></ywyToolSelect>
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t9']"
                            :manual="true"
                            content="行间距"
                            placement="top"
                            effect="dark">
                    <div class="edui-toolselect toolbar-lineheight"
                         @mouseenter.stop="mouseEnterEvent('t9', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t9', $event)">
                        <line-height-select :valueList="toolOptions.lineheight"
                                            :defaultvalue="toolValues.lineheight"
                                            @toolselectvaluechange="execSelectCommand"
                                            keyName="lineheight"
                                            :listVisible="listVisible"></line-height-select>
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t10']"
                            :manual="true"
                            content="无序列表"
                            placement="top"
                            effect="dark">
                    <div class="edui-toolselect toolbar-unorderedlist"
                         @mouseenter.stop="mouseEnterEvent('t10', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t10', $event)">
                        <ywyToolSelect :valueList="toolOptions.unorderedlist"
                                       :defaultvalue="toolValues.insertunorderedlist"
                                       @toolselectvaluechange="execSelectCommand"
                                       keyName="insertunorderedlist"
                                       :listVisible="listVisible"></ywyToolSelect>
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t11']"
                            :manual="true"
                            content="有序列表"
                            placement="top"
                            effect="dark">
                    <div class="edui-toolselect toolbar-orderedlist"
                         @mouseenter.stop="mouseEnterEvent('t11', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t11', $event)">
                        <ywyToolSelect :valueList="toolOptions.orderedlist"
                                       :defaultvalue="toolValues.insertorderedlist"
                                       @toolselectvaluechange="execSelectCommand"
                                       keyName="insertorderedlist"
                                       :listVisible="listVisible"></ywyToolSelect>
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t12']"
                            :manual="true"
                            content="首行缩进"
                            placement="top"
                            effect="dark"
                            v-bind:class="[toolStates.indent == 1 ? 'tool-bar-selected' : '', toolStates.indent == -1 ? 'tool-bar-disabled' : '' ]">
                    <div class="edui-icon toolbar-indent"
                         v-on:click="execCommand('indent')"
                         @mouseenter.stop="mouseEnterEvent('t12', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t12', $event)">
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t13']"
                            :manual="true"
                            content="超链接"
                            placement="top"
                            effect="dark"
                            v-bind:class="[toolStates.link == 1 ? 'tool-bar-selected' : '', toolStates.link == -1 ? 'tool-bar-disabled' : '' ]">
                    <div class="edui-icon toolbar-link"
                         @click.stop="openLink"
                         @mouseenter.stop="mouseEnterEvent('t13', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t13', $event)">
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t14']"
                            :manual="true"
                            content="取消链接"
                            placement="top"
                            effect="dark"
                            v-bind:class="[toolStates.unlink == 1 ? 'tool-bar-selected' : '', toolStates.unlink == -1 ? 'tool-bar-disabled' : '' ]">
                    <div class="edui-icon toolbar-unlink"
                         v-on:click="execCommand('unlink')"
                         @mouseenter.stop="mouseEnterEvent('t14', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t14', $event)">
                    </div>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t15']"
                            :manual="true"
                            content="插入图片"
                            placement="top"
                            effect="dark"
                            v-bind:class="[toolStates.insertImage == 1 ? 'tool-bar-selected' : '', toolStates.insertImage == -1 ? 'tool-bar-disabled' : '' ]">
                    <el-upload :action="action"
                               style="display:inline-block;"
                               :show-file-list="false"
                               :headers="myHeaders"
                               :on-success="updateImgSuccess"
                               :on-error="updateImgFail"
                               :before-upload="updateImgBefore">
                        <div class="edui-icon toolbar-insertImage icon-toolbar-insertImage"
                             @mouseenter.stop="mouseEnterEvent('t15', $event)"
                             @mouseleave.stop="mouseLeaveEvent('t15', $event)">
                        </div>
                    </el-upload>
                </el-tooltip>
                <el-tooltip v-model="tVisible['t16']"
                            :manual="true"
                            content="插入外链"
                            placement="top"
                            effect="dark"
                            v-bind:class="[toolStates.insertIframe == 1 ? 'tool-bar-selected' : '', toolStates.insertIframe == -1 ? 'tool-bar-disabled' : '' ]">
                    <div class="edui-icon toolbar-insertIframe icon-toolbar-insertIframe"
                         @click="openOutIframe"
                         @mouseenter.stop="mouseEnterEvent('t16', $event)"
                         @mouseleave.stop="mouseLeaveEvent('t16', $event)">
                    </div>
                </el-tooltip>
                <div class="countWords"
                     :class="{'exceed': wordExceed}"
                     v-show="maximumWords">{{wordNumber}}/{{maximumWords}}</div>
            </div>
            <div class="edui-toolbar-mask"
                 v-show="toolbarMaskVisible"></div>
        </div>
        <div class="editor-area"
             ref="editor">
            <div class="skeleton">
                <div class="skeleton-head"></div>
                <div class="skeleton-body">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-content"></div>
                </div>
            </div>
        </div>
        <ywyLink @linkchange="execLinkCommand"
                 :linkObj="toolValues.link"
                 :linkVisible="linkVisible"></ywyLink>
        <ywyIframe v-if="showOutIframe"
                   @iframechange="execIframeCommand"
                   :iframeVisible.aync="showOutIframe"></ywyIframe>

    </div>
</template>

<script>
import ywyFontSize from "./toolbuttons/fontSize";
import ywyToolSelect from "./toolbuttons/toolSelect";
import lineHeightSelect from "./toolbuttons/lineHeightSelect";
import ywyLink from "./toolbuttons/link";
import ywyIframe from "./toolbuttons/iframe";

import * as utils from "./toolbuttons/utils";
import { getToken } from '@/utils/auth';
import '../../../static/libs/ue/ueditor.all';
export default {
    data() {
        return {
             myHeaders: {token: getToken()},
            action:this.$server.upload,
            UE: null,
            editor: null,
            editorDocument: null,
            id: "ueditor_" + utils.randomNum(4),
            wordNumber: 0,
            wordExceed: "",
            stayTime: 0,
            tVisible: {
                t0: false,
                t1: false,
                t2: false,
                t3: false,
                t4: false,
                t5: false,
                t6: false,
                t7: false,
                t8: false,
                t9: false,
                t10: false,
                t11: false,
                t12: false,
                t13: false,
                t14: false,
                t15: false,
                t16: false,
                t17: false
            },
            config: {
                toolbars: [],
                initialFrameWidth: 900,
                initialFrameHeight: 400,
                autoHeightEnabled: true,
                autoFloatEnabled: false,
                topOffset: 55,
                enableAutoSave: false,
                saveInterval: 0,
                wordCount: false,
                elementPathEnabled: false,
                serverUrl: "/static/libs/ue/config.json",
                UEDITOR_HOME_URL: location.origin + "/static/libs/ue/"
            },
            toolStates: {
                // 是否可操作 -1: 不可用, 1: 已操作, 0: 可用
                undo: -1,
                redo: -1,
                link: -1,
                unlink: -1,
                bold: 0,
                italic: 0,
                underline: 0,
                indent: 0
            },
            toolOptions: {
                lineheight: [
                    { label: "1", value: "1" },
                    { label: "1.5", value: "1.5" },
                    { label: "1.75", value: "1.75" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" },
                    { label: "5", value: "5" }
                ],
                orderedlist: [
                    { label: "1,2,3...", value: "decimal" },
                    { label: "a,b,c...", value: "lower-alpha" },
                    { label: "i,ii,iii...", value: "lower-roman" },
                    { label: "A,B,C...", value: "upper-alpha" },
                    { label: "Ⅰ,Ⅱ,Ⅲ...", value: "upper-roman" }
                ],
                unorderedlist: [
                    { label: "○ 大圆圈", value: "circle" },
                    { label: "● 小圆点", value: "disc" },
                    { label: "■ 小方块", value: "square" }
                ],
                alignlist: [
                    { label: "居左对齐", value: "left" },
                    { label: "居中对齐", value: "center" },
                    { label: "居右对齐", value: "right" },
                    { label: "两端对齐", value: "justify" }
                ]
            },
            toolValues: {
                fontsize: "",
                forecolor: "",
                backcolor: "",
                justify: "",
                lineheight: "1.5",
                insertorderedlist: "",
                insertunorderedlist: "",
                link: {}
            },
            listVisible: !0,
            linkVisible: false,
            iframeVisible: !!0,
            toolbarMaskVisible: !1,
            toolbarStyle: {},
            currentPage: 1,
            showMaterial: false,
            showOutIframe: false,
            errorCount: 0,
            updateImgLoading: null
        };
    },
    props: {
        content: String,
        maximumWords: String,
        label: String,
        handleChange: {
            type: Function,
            default: () => {}
        }
    },
//    metaInfo: {
//        script: [
//            {
//                src: "./static/libs/ue/ueditor.config.js"
//            },
//            {
//                src: "./static/libs/ue/ueditor.all.min.js"
//            }
//        ]
//    },
    async beforeDestroy() {
        await this.editor.destroy();
        this.$nextTick(() => {
            this.editor = null;
            this.editorDocument = null;
        });
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            if (window.UE) {
                this.UE = window.UE;
                this.$nextTick(() => {
                    setTimeout(() => {
                        try {
                            this.$refs.editor.id = this.id;
                            this.editor = this.UE.getEditor(
                                this.id,
                                this.config
                            );
                            this.editor.ready(() => {
                                this.$nextTick(() => {
                                    this.bindContentChange();
                                    this.bindSelectionChange();
                                    this.bindFocus_Blur();
                                    this.editorDocument = this.editor.document;
                                    // this.editor.execCommand(
                                    //     "lineheight",
                                    //     "1.5"
                                    // ); //行间距
                                    UE.dom.domUtils.on(
                                        window,
                                        ["scroll", "resize"],
                                        this.updateToolbar
                                    );
                                    let self = this;
                                    var content = self.editor.getContent(
                                        function(editor) {
                                            return (
                                                self.editor.body.innerHTML ===
                                                "欢迎使用UEditor"
                                            );
                                        }
                                    );
                                    if (this.content && content.length == 0) {
                                        let value = this.content;
                                        setTimeout(() => {
                                            if (/data-src/.test(value))
                                                value = val.replace(
                                                    /data-src/g,
                                                    "src"
                                                );
                                            this.editor.setContent(value);
                                        }, 10);
                                        this.wordCount();
                                    }
                                });
                            });
                        } catch (e) {
                            if (this.errorCount > 3) return;
                            this.errorCount++;
                            this.init();
                        }
                    }, 1000);
                });
            } else {
                setTimeout(() => {
                    this.init();
                }, 300);
            }
        },
        imgUpload(val) {
            if (val) {
                this.onChooseImg(val);
            }
        },
        updateImgSuccess(response, file, fileList) {
            if (response.status === 200) {
                this.imgUpload(response.content.resourceUrl);
            } else {
                this.updateImgFail(response, file, fileList);
            }
            try {
                this.updateImgLoading.close();
            } catch (error) {
                this.updateImgLoading = null;
            }
        },
        updateImgFail(err, file, fileList) {
            try {
                this.updateImgLoading.close();
            } catch (error) {
                this.updateImgLoading = null;
            }
            this.$message.error("图片上传失败，请稍后重试!");
        },
        updateImgBefore(event, file, fileList) {
            this.updateImgLoading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        openDialog() {
            this.currentPage = 1;
        },
        openOutIframe() {
            this.showOutIframe = true;
        },
        // 为了避免同时显示多个tooltip
        mouseEnterEvent(index, event) {
            this.stayTime = new Date().getTime();
            const time = this.stayTime;
            setTimeout(() => {
                if (this.stayTime == time) {
                    this.tVisible[index] = true;
                }
            }, 300);
        },
        mouseLeaveEvent(index, event) {
            this.stayTime = new Date().getTime();
            this.tVisible[index] = false;
        },
        updateToolbar() {
            const toolbarBox = this.$el.children[0];
            const editorRect = this.$el.getBoundingClientRect();
            const offset = this.config.topOffset || 0;
            if (
                editorRect.top < offset &&
                editorRect.bottom - toolbarBox.offsetHeight > offset
            ) {
                this.toolbarStyle = {
                    position: "fixed",
                    top: offset + "px",
                    width: toolbarBox.offsetWidth + "px"
                };
            } else {
                this.toolbarStyle = {};
            }
        },
        bindContentChange() {
            this.editor.addListener("contentChange", () => {
                this.wordCount();
                this.emitHandleChange();
            });
        },
        emitHandleChange() {
            this.handleChange({
                html: this.editor.getContent(),
                count: this.wordNumber,
                exceed: this.wordExceed
            });
        },
        bindSelectionChange() {
            this.editor.addListener("selectionchange", (event, value) => {
                const statelist = Object.keys(this.toolStates);
                const valuelist = Object.keys(this.toolValues);
                for (let i = 0, len1 = statelist.length; i < len1; i++) {
                    this.toolStates[
                        statelist[i]
                    ] = this.editor.queryCommandState(statelist[i]);
                }
                for (let i = 0, len2 = valuelist.length; i < len2; i++) {
                    if (valuelist[i].indexOf("link") > -1) {
                        const link = this.editor.queryCommandValue("link");
                        if (link) {
                            this.toolValues.link = {
                                text: link.text,
                                title: link.title,
                                href: link.href,
                                selected: true
                            };
                        } else if (this.editor.selection.getText()) {
                            this.toolValues.link = {
                                text: this.editor.selection.getText(),
                                title: this.editor.selection.getText(),
                                selected: true,
                                href: ""
                            };
                        } else if (link == undefined) {
                            this.toolValues.link = {};
                        }
                    } else {
                        this.toolValues[valuelist[i]] =
                            this.editor.queryCommandValue(valuelist[i]) + "";
                    }
                }
                this.initLineHeightSelection();
            });
        },
        initLineHeightSelection() {
            let haveLineHeight = false;
            let hanePxUnit = false;
            let origalArr = [
                { label: "1", value: "1" },
                { label: "1.5", value: "1.5" },
                { label: "1.75", value: "1.75" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" }
            ];
            for (let i = 0; i < this.toolOptions.lineheight.length; i++) {
                if (
                    this.toolValues.lineheight ==
                    this.toolOptions.lineheight[i].value
                ) {
                    haveLineHeight = true;

                    if (
                        this.toolOptions.lineheight[i].label.indexOf("px") != -1
                    ) {
                        hanePxUnit = true;
                    }
                    break;
                }
            }

            if (haveLineHeight && !hanePxUnit) {
                this.toolOptions.lineheight = origalArr;
            } else {
                this.toolOptions.lineheight = [
                    {
                        label: this.toolValues.lineheight + "px",
                        value: this.toolValues.lineheight
                    }
                ].concat(origalArr);
            }
        },
        wordCount() {
            this.wordNumber = this.editor.getContentLength(true);
            // this.wordNumber = this.editor.getContent().length;
            this.wordExceed = this.wordNumber > this.maximumWords;
        },
        bindFocus_Blur() {
            this.editor.addListener("focus", () => {
                this.toolbarMaskVisible = !1;
                this.listVisible = !1;
            });
            this.editor.addListener("blur", () => {
                this.listVisible = !0;
            });
        },
        onMaskShow() {
            this.toolbarMaskVisible = !0;
        },
        execCommand(name, value) {
            value? this.editor.execCommand(name, value): this.editor.execCommand(name);
        },
        execSelectCommand(name, value, dir) {
            this.editor.execCommand(name, value, dir);
        },
        execFontSizeCommand(fontsize) {
            this.toolValues.fontsize = fontsize;
            this.execCommand("fontsize", fontsize);
        },
        execLinkCommand(linkObj) {
            this.linkVisible = false;
            if (linkObj.href) {
                this.execCommand("link", {
                    href: linkObj.href,
                    title: linkObj.text,
                    textValue: linkObj.name
                });
            }
        },
        execIframeCommand(iframeObj) {
            if (iframeObj.href) {
                if (iframeObj.type == "image") {
                    this.onChooseImg(iframeObj.href);
                } else if (iframeObj.type == "video") {
                    this.editor.execCommand(
                        "inserthtml",
                        '<iframe width="320" class="ueditor-video" src="' +
                            iframeObj.href +
                            '" frameborder="0"></iframe>'
                    );
                }
            }
            this.$nextTick(() => {
                this.showOutIframe = false;
            });
        },
        openLink() {
            this.linkVisible = true;
            this.openIframe();
        },
        openIframe() {
            this.iframeVisible = true;
        },
        onChooseImg(val) {
            if (val) {
                let value = val;
                if (
                    value.toString().indexOf("http://") < 0 &&
                    value.toString().indexOf("https://") < 0
                ) {
                    value = [window.location.protocol, value].join("");
                }
                this.editor.execCommand("insertimage", {
                    src: value
                });
            }
        }
    },
    watch: {
        content(val, oldval) {
            if (this.editor) {
                let value = val;
                if (
                    value !== null &&
                    (typeof oldval == "undefined" || oldval === "")
                ) {
                    this.editor.ready(() => {
                        setTimeout(() => {
                            try {
                                if (/data-src/.test(value))
                                    value = val.replace(/data-src/g, "src");
                                this.editor.setContent(value);
                            } catch (e) {
                                console.log(e);
                            }
                        }, 10);
                        this.wordCount();
                    });
                }
            }
        }
    },
    components: {
        ywyFontSize,
        ywyToolSelect,
        ywyLink,
        ywyIframe,
        lineHeightSelect
    }
};
</script>

