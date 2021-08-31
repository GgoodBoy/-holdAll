<template>
    <div class="page-container" :style="styleCss?styleCss:{}">
        <div class="page-content">
            <span class="first" :class="currentPageCopy==1?'disable':''" @click="toFirst">首页</span>
            <el-pagination
            layout="prev, pager, next"
            prev-text="上一页"
            next-text="下一页"
            background
            :page-size="pageSizeCopy"
            :current-page.sync="currentPageCopy"
            @current-change="pageChange"
            :total="totalsCopy">
            </el-pagination>
            <span class="last" :class="currentPageCopy>=Math.ceil(totalsCopy/pageSizeCopy)?'disable':''" @click="toLast">尾页</span>
        </div>
        <p class="page-number" v-show="pageShows">
            <span class="cur">{{currentPageCopy}}</span>
            /
            <span>{{Math.ceil(totalsCopy/pageSizeCopy)}}</span>
        </p>
    </div>
</template>
<script lang="ts">
import {Component , Prop, Vue, Watch } from 'vue-property-decorator'
@Component({})
export default class Page extends Vue{
    @Prop()
    pageSize:number

    @Prop()
    currentPage:number

    @Prop()
    totals:number

    @Prop()
    pageShow:boolean

    @Prop()
    styleCss:Object


    currentPageCopy:number = this.currentPage;
    totalsCopy:number = this.totals;
    pageSizeCopy:number = this.pageSize;
    pageShows:boolean = this.pageShow||false;

    @Watch("totals")
    onChildChanged(val, oldVal) {
        this.totalsCopy = Number(val);
    }
    @Watch("currentPage")
    oncurrentPageChanged(val,oldVal){
        this.currentPageCopy = val;
    }
    async pageChange(number){
        this.$emit("currentPagesEven",number);
        this.$emit('update:currentPage',number)
    }
    async toFirst(){
        this.$emit("currentPagesEven",1);
        this.$emit('update:currentPage',1)
    }
    async toLast(){
        let currentPage = Math.ceil(Number(this.totalsCopy)/Number(this.pageSizeCopy))
        this.$emit("currentPagesEven",currentPage);
        this.$emit('update:currentPage',currentPage)
    }
}
</script>
<style lang="scss">
    .page-container{
        width: 100%;
        text-align: center;
        display: inline-block;
        position: relative;
        .page-content{
            display: inline-block;
        }
        .first,.last,.el-pagination{
            display: inline-block;
            vertical-align: middle;
            font-size: 14px;
        }
        .first,.last{
            color:#4C555D;
            cursor: pointer;
            &.disable{
                color:#9A9A9A;
                cursor: not-allowed;
            }
        }
        .el-pagination{
            span,li{
                font-size: 14px;
            }
        }
        // .page-number{
        //     position: absolute;
        //     right: 0;
        //     bottom: 0;
        //     span{
        //         height: 32px;
        //         line-height: 32px;
        //     }
        //     .cur{
        //         color:#CC0033;
        //     }
        // }
    }
    .el-pagination button:disabled{
        color:#9A9A9A!important;
    }
    .btn-prev,.btn-next{
        color:#4C555D;
        background: none!important;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active{
        // background: #4C555D!important;
        border-radius: 50%;
        &:hover{
            color:#fff!important;
        }
    }
    .el-pagination.is-background , .el-pagination.is-background , .el-pagination.is-background .el-pager li{
        background: none;
        &:hover{
            color:red!important;
        }
    }
</style>

