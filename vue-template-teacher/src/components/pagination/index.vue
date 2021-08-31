<template>
    <div class="pagination-wrap tc"
         v-if="totalNum>pageSize">
        <el-pagination background
                       layout="prev, pager, next"
                       :total="totalNum"
                       :current-page="currentPage"
                       :page-size="pageSize"
                       @current-change="changePage">
        </el-pagination>
    </div>
</template>

<script>
export default {
    props: {
        totalNum: {
            type: Number,
            default: 0
        },
        currentPage: {
            type: Number,
            default: 1
        },
        changeCallBack: {
            type: Function,
            default: () => {}
        },
        pageSize: {
            type: Number,
            default: 10
        }
    },
    methods: {
        changePage(page) {
            const query = JSON.parse(JSON.stringify(this.$route.query));
            if(query.hasOwnProperty('homeType')){
               delete query.homeType;
            }
            query["page"] = page;
            this.changeCallBack();
            const url =
                this.$route.path + "?" + this.$utils.urlEncode(query).substr(1);
            this.$router.push(url);
        }
    }
};
</script>

<style>
</style>
