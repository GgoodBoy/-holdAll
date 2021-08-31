<template>
    <el-breadcrumb class="app-breadcrumb"
                   separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in levelList" v-if="item.meta.title"
                                :key="item.path"
                                >
                <span v-if="item.redirect==='noredirect'||index==levelList.length-1"
                      class="no-redirect breadcrumb-item">{{ item.meta.title }}</span>
                <router-link v-else
                             :to="item.redirect||item.path"  class="breadcrumb-item">{{ item.meta.title }}</router-link>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
export default {
    data() {
        return {
            levelList: null
        };
    },
    watch: {
        $route() {
            this.getBreadcrumb();
        }
    },
    created() {
        this.getBreadcrumb();
    },
    methods: {
        getBreadcrumb() {
            let matched = this.$route.matched.filter(item => item.meta.title);
            const matchedList = matched;
            if (matchedList && matchedList[0].meta.title !== "首页") {
                for (let i = matchedList.length-1; i >= 0; i--) {
                    if(matchedList[i].meta.isFirstFloor) {
                        matchedList.splice(i, 1)
                    }
                }
                matched = [
                    { path: "/dashboard", meta: { title: "首页" } }
                ].concat(matched);
            }
            this.levelList = matched;
        }
    }
};
</script>
<style lang="scss" scoped>
.app-breadcrumb {
    font-size:18px;
    color:rgba(56,65,86,1);
    line-height: 1;
    padding-bottom: 20px;
    .breadcrumb-item {
        font-weight: 400;
    }
}
</style>
