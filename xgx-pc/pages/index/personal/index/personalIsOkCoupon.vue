<template>
    <div>
        <div class="ok-coupon">
            <div class="coupponListBox">
                <el-row>
                    <el-col :span="6" v-for="(item,indexs) in tableListSet" :key='indexs' style="margin-top:20px;">
                        <div class="coupponBox">
                            <el-row>
                                <el-col :span="6" style="line-height: 48px;">1元</el-col>
                                <el-col :span="18" style="text-align:left;">
                                    <P>哈沙的哈</P>
                                    <P>1231231231</P>
                                </el-col>
                            </el-row>
                            <div class="coupponBoxBot">
                                <span>有效期：2019-1-1至2019-1-31</span>
                                <span>查看可用>></span>>
                            </div>
                        </div>                                
                    </el-col>
                </el-row>
            </div>
            <Page style="margin-top:40px;" v-on:currentPagesEven="currentChange" :currentPage='currentPages' :pageSize='pageSizes' :totals='totals'></Page>
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
    activeName:string='0';
    // 1:未使用，2:已使用，3:已过期
    tabslist:object[]=[
        {
            label:'未使用',
            value:'1'
        },
        {
            label:'已使用',
            value:'2'
        },
        {
            label:'已过期',
            value:'3'
        }
    ];     
    tableListSet:object[]=[{},{},{}];
    pageSizes:number=10;
    totals:number=0;
    pageNo:number=1;    
    currentPages:number=1;
    modelType:number=0;
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
    handleClick(){}
    async getOrderList(number){
        var self = this;
       let user =  getCookie('xgx_user')?JSON.parse( getCookie('xgx_user')):null;
       let query = {
            params:{
                pageSize:self.pageSizes,
                pageNo:Number(number),
                id:user.userId
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
.ok-coupon{
    text-align: center;
    .coupponListBox{
        width: 100%;
        .coupponBox{
            width: 200px;
            margin: auto;
            border:1px solid #ccc;
            .coupponBoxBot{
                border-top: 1px solid #ccc;
                span{
                    font-size: 10px;
                }
            }
        }
    }
}
</style>
