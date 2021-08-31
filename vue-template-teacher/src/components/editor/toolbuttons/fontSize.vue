<template>
    <div class="edui-toolSelect">
        <div class="edui-toolSelect_wrap">
            <input type="text"
                   class="input"
                   disabled
                   v-model="font"
                   @blur="checkInput"
                   @keyup.enter="blur">
            <div class="edui-fontsize_wrap"
                 v-clickoutside="onListHide">
                <span class="select"
                      @click="onListShow">
                    <i class="triangle"></i>
                </span>
                <div class="edui-fontsize_panel"
                     v-show="listvisible">
                    <ul>
                        <li v-for="item in fontSizeList"
                            @click="onSelect(item)">
                            <span :style="{fontSize: item + 'px'}">{{item}}px</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Clickoutside from "element-ui/lib/utils/clickoutside";

export default {
    props: {
        fontSize: String,
        fontSizeList: {
            type: Array,
            default() {
                return [10, 11, 12, 14, 16, 18, 20, 24, 36];
            }
        },
        listVisible: Boolean
    },
    data() {
        return {
            font: this.fontSize || "16px",
            listvisible: !1
        };
    },
    methods: {
        checkInput() {
            this.font = this.font.match(/\d+/g)[0] + "px";
            // 通知父组件
            this.$emit("fontsizechange", this.font);
        },
        blur(event) {
            event.target.blur();
        },
        onListShow() {
            this.listvisible = !0;
        },
        onListHide() {
            this.listvisible = !1;
        },
        onSelect(item) {
            this.font = item + "px";
            // 通知父组件
            this.$emit("fontsizechange", this.font);
            this.onListHide();
        }
    },
    directives: { Clickoutside },
    watch: {
        /**
         * 监听外部数据改变
         * @createdAt 2017-02-09T09:27:52+0800
         * @author lichin
         */
        fontSize(val) {
            this.font = val;
        },
        listVisible(val) {
            if (!val) {
                this.listvisible = !1;
            }
        }
    }
};
</script>
