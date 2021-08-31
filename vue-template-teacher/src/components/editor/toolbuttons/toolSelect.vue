<template>
  <div class="edui-toolSelect"
       v-clickoutside="onListHide">
    <div class="edui-toolSelect_wrap">
      <span class="edui-toolbutton edui-icon">
        <i :style="{backgroundColor: defaultvalue}"
           class="colorbar"
           v-if="colorPicker"></i>
      </span>
      <span class="select"
            @click="onListShow">
        <i class="triangle"></i>
      </span>
      <div class="edui-toolselect_panel"
           v-show="listvisible"
           v-if="colorPicker">
        <div class="recent_color color_box">
          <p class="title">最近使用颜色</p>
          <span class="clear"
                title="清除样式"
                @click="onSelect('', 'removeformat')"
                style="margin: 0 0 4px 0"></span>
          <span v-for="item in recentColorList"
                :style="{backgroundColor: item}"
                :title="item"
                @click="onSelect(item)"></span>
        </div>
        <div class="basic_color color_box">
          <p class="title">基本色</p>
          <span v-for="item in baseColorList"
                :style="{backgroundColor: '#'+item}"
                :title="'#'+item"
                @click="onSelect('#'+item)"></span>
        </div>
        <div class="input_color">
          <span class="preview"
                :style="{backgroundColor: '#' + value}"
                @click="onSelect('#'+value)"></span>
          <div class="input_wrap"><input class="input-color"
                   type="text"
                   v-model="value">
            <i class="icon">#</i>
          </div>
          <span class="js_ok"
                @click="onSelect('#'+value)">确认</span>
        </div>
      </div>
      <div class="edui-list_panel"
           v-show="listvisible"
           v-else>
        <ul>
          <li v-for="item in valueList"
              @click="onSelect(item.value)">
            <i class="checked"
               v-if="item.value === value"></i>
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
        colorPicker: Boolean,
        listVisible: Boolean
    },
    data() {
        return {
            value: this.defaultvalue.replace("#", ""),
            listvisible: !1,
            baseColorList: [
                "ffffff",
                "ffd7d5",
                "ffdaa9",
                "fffed5",
                "d4fa00",
                "73fcd6",
                "a5c8ff",
                "ffacd5",
                "ff7faa",
                "d6d6d6",
                "ffacaa",
                "ffb995",
                "fffb00",
                "73fa79",
                "00fcff",
                "78acfe",
                "d84fa9",
                "ff4f79",
                "b2b2b2",
                "d7aba9",
                "ff6827",
                "ffda51",
                "00d100",
                "00d5ff",
                "0080ff",
                "ac39ff",
                "ff2941",
                "888888",
                "7a4442",
                "ff4c00",
                "ffa900",
                "3da742",
                "3daad6",
                "0052ff",
                "7a4fd6",
                "d92142",
                "000000",
                "7b0c00",
                "ff4c41",
                "d6a841",
                "407600",
                "007aaa",
                "021eaa",
                "797baa",
                "ab1942"
            ]
        };
    },
    computed: {
        recentColorList() {
            let list = window.localStorage.recentColorList;
            if (list) {
                list = JSON.parse(list);
            } else {
                list = [];
            }
            return list;
        }
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
         * 选择颜色：onSelect('#fff')
         * keyname: forecolor
         * 选择行间距 onSelect('1.5')
         * keyname: lineheight
         * 清除颜色（or背景颜色）color backgroundColor
         * keyname: onSelect('', 'removeformat')
         * @createdAt 2017-02-10T11:57:29+0800
         * @author lichin
         */
        onSelect(item, name) {
            this.value = item;
            const value =
                (name &&
                    (this.keyname === "forecolor"
                        ? "color"
                        : "backgroundColor")) ||
                item;
            this.$emit(
                "toolselectvaluechange",
                name || this.keyName,
                value,
                this.dir
            );
            this.onListHide();
            if (this.colorPicker && !name) {
                this.storeRecentColor(item);
            }
        },
        storeRecentColor(item) {
            const list = this.recentColorList;
            let len = list.unshift(item);
            for (let i = 1; i < len; i++) {
                if (list[i] === item) {
                    list.splice(i, 1);
                    len--;
                    break;
                }
            }
            if (len > 8) {
                list.length = 8;
            }
            window.localStorage.recentColorList = JSON.stringify(list);
        }
    },
    directives: { Clickoutside },
    watch: {
        defaultvalue(val) {
            this.value = val.replace("#", "");
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
// toolSelect.vue?26769c52
