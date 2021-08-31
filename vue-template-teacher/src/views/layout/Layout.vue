<template>
    <div :class="classObj"
         class="app-wrapper">
        <div v-if="device==='mobile'&&sidebar.opened"
             class="drawer-bg"
             @click="handleClickOutside" />
        <sidebar class="sidebar-container" />
        <div class="main-container">
            <navbar />
            <app-main />
        </div>
    </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
    name: "Layout",
    components: {
        Navbar,
        Sidebar,
        AppMain
    },
    mixins: [ResizeMixin],
    computed: {
        sidebar() {
            return this.$store.state.app.sidebar;
        },
        device() {
            return this.$store.state.app.device;
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === "mobile"
            };
        }
    },
    methods: {
        handleClickOutside() {
            this.$store.dispatch("CloseSideBar", { withoutAnimation: false });
        }
    }
};
</script>
<style lang="scss">
    .hideSidebar {
        .sidebar-container{
            .el-menu-item{
                padding: 0 0 0 4px!important;
            }
        }
    }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
// .app-wrapper {
//     @include clearfix;
//     position: relative;
//     height: 100%;
//     width: 100%;
//     &.mobile.openSidebar {
//         position: fixed;
//         top: 0;
//     }
//     &.openSidebar {
//         min-width: 1468px;
//     }
//     &.hideSidebar {
//         min-width: 1260px
//     }
// }
.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    overflow-y:auto;
    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
    &.openSidebar {
        max-width: 1440px;
        margin:auto;
    }
    &.hideSidebar {
        max-width: 1440px;
        min-width: 980px;
        margin:auto;
    }
}
.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}
</style>
