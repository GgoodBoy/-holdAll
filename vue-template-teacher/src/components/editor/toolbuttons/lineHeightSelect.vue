<template>
    <div class="edui-toolSelect"
         v-clickoutside="onListHide">
        <div class="edui-toolSelect_wrap">
            <span class="edui-toolbutton edui-icon">
                </i>
            </span>
            <span class="select"
                  @click="onListShow">
                <i class="triangle"></i>
            </span>
            <div class="edui-list_panel"
                 v-show="listvisible">
                <ul>
                    <li v-for="item in valueList"
                        @click="onSelect(item.value)">
                        <i class="checked"
                           v-if="item.value === defaultvalue"></i>
                        <span>{{item.label}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Clickoutside from "element-ui/lib/utils/clickoutside";

export default {
    props: {
        keyName: String,
        defaultvalue: String,
        dir: String,
        valueList: {
            type: Array,
            default() {
                return [];
            }
        },
        listVisible: Boolean
    },
    data() {
        return {
            listvisible: !1,
            defaultVal: this.defaultvalue
        };
    },
    methods: {
        onListShow() {
            this.listvisible = !0;
        },
        onListHide() {
            this.listvisible = !1;
        },
        /**
         * 传值
         * 选择行间距 onSelect('1.5')
         * keyname: lineheight
         * @createdAt 2017-02-10T11:57:29+0800
         * @author lichin
         */
        onSelect(item) {
            this.defaultVal = item;
            this.$emit("toolselectvaluechange", this.keyName, item, this.dir);
            this.onListHide();
        }
    },
    directives: { Clickoutside },
    watch: {
        defaultvalue(val) {
            this.defaultVal = val;
        },
        listVisible(val) {
            if (!val) {
                this.listvisible = !1;
            }
        }
    }
};
</script>



// WEBPACK FOOTER //
// lineHeightSelect.vue?a87a7494
