<template>
    <div>
        <div class="OrderMe">
            <div>
                <el-table
                :data="tableListSet"
                :header-cell-style="tableHeaderColor"
                empty-text="您还没有购买过课程哟~"
                border
                style="width: 100%">
                    <el-table-column
                        prop="orderId"
                        label="订单号"
                        align="center"
                        show-overflow-tooltip
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        prop="commodityTitle"
                        show-overflow-tooltip
                        label="课程名称"
                        align="center"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        prop="commodityPrice"
                        label="售价"
                        align="center"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="payPrice"
                        label="应付金额"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        label="结算方式"
                        align="center"
                        min-width="200">
                            <!-- 1 充值 2 赠送 3 消费 -->
                            <template slot-scope="scope">
                                <div v-for="(items,indexs) in scope.row.typeTist" :key="indexs">{{items}}</div>
                            </template>
                    </el-table-column>                    
                    <el-table-column
                        prop="createdAt"
                        label="购买日期"
                        align="center"
                        min-width="200">
                    </el-table-column>
                </el-table>
                <div class="page-boxs">
                <Page :styleCss="cssObj" v-on:currentPagesEven="currentChange" :currentPage='currentPages' :pageSize='pageSizes' :totals='totals'></Page>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component , Vue ,Watch} from 'vue-property-decorator'
import QRCode from 'qrcodejs2'
import Page from '~/components/Page.vue'
import { NuxtContext } from 'nuxt';
import {mapState,mapActions} from 'vuex';
import { setTimeout } from 'timers';
import {delCookie,getCookie} from '../../../../utils/cache.js'
import ajaxs from '~/api/index.js';
@Component({
    components:{Page},
    async asyncData({app,query}:NuxtContext):Promise<any>{},
    methods:{
        ...mapActions(['selectMyStartEven']),
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #F3F3F3;font-weight: 500;font-size: 16px;'
            }
        }
    }
})
export default class Arder extends Vue{
    // 1:充值成功，2:购课成功，3:课程更新，4:小喇叭（站内信）
    tableListSet:object[]=[];
    pageSizes:number=10;
    totals:number=0;
    pageNo:number=1;
    currentPages:number=1;
    modelType:number=0;
    cssObj:Object='position: absolute;bottom: 0px;width: 967px;left: 0px;';
    head(){
        return {
            title:'我的订单 | 学国学网'
        }
    }
    created(){
        var numbers = this.$route.query.selectId;
        this.selectMyStartEven(Number(numbers));
        this.getOrderList(1);
    }
    async currentChange(number){
        if(number>0){
            this.getOrderList(number);
        }
    }
    async getOrderList(number){
        var self = this;
       let user =  getCookie('xgx_user')?JSON.parse( getCookie('xgx_user')):null;
       let query = {
            params:{
                pageSize:self.pageSizes,
                pageNo:Number(number),
                // id:user.userId
               }
        }
        let res=await self.$axios.$get(this.$server.getMyUserders,query)
        if(res.status==200){
            self.tableListSet = res.content.list;
            self.totals = res.content.total;
            self.currentPages = Number(number);
        }
    }
}
</script>
<style lang="scss" scoped>
.page-boxs{
    height:80px;
    background: #F3F5F7;
    position: relative;
}
.OrderMe{
    text-align: center;
    min-height: 600px;
    background: #F3F5F7;
}
</style>
