<template>
    <el-collapse-transition>
        <div v-if="showModel"
             class="alert"
             :class="`${type}-layout`">
            <i class="el-icon-close close"
               @click="close"></i>
            <div v-html="content"></div>
        </div>
    </el-collapse-transition>

</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: "error" //success/warning/info/error
        },
        content: {
            type: String,
            default: ""
        },
        showClose: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            showModel: true
        };
    },
    methods: {
        close() {
            this.showModel = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.alert {
    width: 100%;
    padding: 8px 16px;
    margin: 0;
    box-sizing: border-box;
    border-radius: 4px;
    position: relative;
    background-color: #fff;
    overflow: hidden;
    opacity: 1;
    display: flex;
    align-items: center;
    transition: 0.2s;
}
.info-layout {
    background-color: #f4f4f5;
    color: #909399;
}
.success-layout {
    background-color: #f0f9eb;
    color: #67c23a;
}
.warning-layout {
    background-color: #fdf6ec;
    color: #e6a23c;
}
.error-layout {
    background-color: #fef0f0;
    color: #f56c6c;
}
.close {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    &:hover {
        transform: scale(1.3);
    }
}
</style>
