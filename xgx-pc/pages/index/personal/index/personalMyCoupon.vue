<template>
    <div>
        <div class="coupon-center">
            <el-tabs :stretch="true" v-model="activeName" @tab-click="handleClick" :style="{'minHeight':'600px'}">
                <!-- <PcTable :tableList='tableListSet' :setUpInfo="setUpInfoSet"></PcTable> -->
                <el-tab-pane :name='items.value' v-for="(items,index) in tabslist" :key='index'>
                    <span slot="label">{{items.label}}</span>
                    <div class="coupon-list-box" v-loading="loading">
                        <ul class="list clearfix">
                            <!-- @click="chioceItem($event,item)" -->
                            <li class="item" v-for="(item,index) in couponList" :key="index" :class="{'all-reduction':(item.couponType != 2&&activeName=='0'),'money-off':(item.couponType == 2&&activeName=='0'),'all-isover':(activeName!='0'),}">
                                <div class="coupon-container">
                                    <div class="price" :class="item.couponType!=3?'status0':''">{{item.reducedPrice}}<span>元</span></div>
                                    <div class="info" :class="item.couponType!=3?'status0':''">
                                        <p class="coupon-type" v-if="item.couponType==2">满{{item.couponsMinAmount}}减{{item.reducedPrice}}元券</p>
                                        <p class="coupon-type" v-else>无门槛优惠券</p>
                                        <!-- <p class="coupon-time" v-show="item.couponType==3">{{item.beginAtStr}}-{{item.endAtStr}}</p> -->
                                        <p class="card-number">{{item.couponCode}}</p>
                                    </div>
                                    <!-- <i class="choose-icon" v-show="couponId==item.id"></i> -->
                                    <transition name="switchShade">
                                        <div class="coupon-shade-wrap" v-show="item.flag==true">
                                            <div class="coupon-shade"></div>
                                            <div class="coupon-shade-box">{{item.useCourseTitle}}</div>
                                        </div>     
                                    </transition>
                                </div>
                                <!-- <div class="coupon-explain clearfix" v-if="item.couponType==3">
                                    <p class="coupon-course textEllipsis" @click="textShow($event,index)">{{item.useCourseTitle}}</p>
                                </div> -->
                                <div class="coupon-explain clearfix">
                                    <div class="coupon-course1">有效期：{{item.beginAtStr}}-{{item.endAtStr}}</div>
                                    <div v-show="item.couponType==3&&items.value=='0'" class="coupon-course2" @click="couponEven(item.couponId)">查看可用></div>
                                </div>
                            </li>
                            <p class="noDataCss" v-show="dataIsNo">
                                {{activeName==0?'您还没有领取过优惠券哟~':'当前优惠券无数据~'}}
                            </p>
                        </ul>   
                    </div>                 
                </el-tab-pane>  
            </el-tabs>
            <div class="page-boxs">
            <Page :styleCss="cssObj" v-on:currentPagesEven="currentChange" :currentPage='currentPages' :pageSize='pageSizes' :totals='totals'></Page>
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
    activeName:string='0';
    // 1:未使用，2:已使用，3:已过期
    tabslist:object[]=[
        {
            label:'未使用',
            value:'0'
        },
        {
            label:'已使用',
            value:'1'
        },
        {
            label:'已过期',
            value:'2'
        }
    ];     
    couponList:object[]=[];
    pageSizes:number=12;
    totals:number=0;
    pageNo:number=1;    
    currentPages:number=1;
    cssObj:Object='position: absolute;bottom: 0px;width: 967px;left:220px;';
    dataIsNo:boolean = false;
    modelType:number=0;
    loading:boolean=false;
    head(){
        return {
            title:'我的优惠券 | 学国学网'
        }
    }
    created(){
        var numbers = this.$route.query.selectId;
        this.selectMyStartEven(Number(numbers));         
        this.getCouponList(1);
    }    
    async currentChange(number){
        if(number>0){
            this.getCouponList(number);
        }
    }
    handleClick(){
        this.loading = true;
        this.getCouponList(1);
    }
    couponEven(id){
         this.$router.push({path:'/personal/personalCouponDetail', query:{id:id}})
    }
    async getCouponList(number){
        var self = this;
        self.couponList =[];
        let user =  getCookie('xgx_user')?JSON.parse( getCookie('xgx_user')):null;
        let query = {
            params:{
                pageSize:self.pageSizes,
                pageNo:Number(number),
                userId:user.userId,
                couponType:Number(self.activeName)
               }
        }
        let res=await self.$axios.$get(this.$server.getCopponDataList,query)
        if(res.status==200){
            self.couponList = res.content.list;
            self.totals = res.content.total;
            self.currentPages = Number(number);
            self.loading = false;
            self.$nextTick(function(){
                if(res.content.total==0){
                    self.dataIsNo = true;
                }else{
                    self.dataIsNo = false;
                }
            })            
        }else{
            self.loading = false;
        }        
    }
    isOkListEven(data){
        // this.$router.push({path:'/personal/personalIsOkCoupon', query:{id:data.id}})
        this.$router.push({path:'/personal/personalIsOkCoupon'})
    }
}   
</script>
<style lang="scss">
    .coupon-center{
        .el-tabs__header{
            padding:0 50px;
            margin:0!important;
        }
        .el-tabs__nav{
            .el-tabs__item{
                height: 65px;
                line-height: 65px;
            }
        }
        .el-tabs__nav-wrap::after{
            display: none;
        }
        .el-table th.is-leaf, .el-table td{
            background: #fafafa;
        }
        .el-table--striped .el-table__body tr.el-table__row--striped td{
            background: #fff;
        }
        .msgTypeName{
            padding-left:44px;
        }
        .createdAt{
            .cell{
                color:#9a9a9a!important;
            }
        }
        .el-table .cell{
            color:#6A6A6A;
        }
    }
    
</style>
<style lang="scss" scoped>
.page-boxs{
    height:80px;
    background: #F3F5F7;
}
.coupon-center{
    .coupon-list-box{
                    display: inline-block;
                    vertical-align: middle;
                    width: 903px;
                    height: 100%;
                    overflow: hidden;
                    .list{
                        display: block;
                        height: 100%;
                        transition: transform 0.3s ease-in;
                        .noDataCss{
                            width: 100%;
                            text-align: center;
                            color: #ccc;
                            margin: 30px 0 0 0;
                        }
                        .item{
                            float: left;
                            width: 285px;
                            height: 100%;
                            margin-left: 13px;
                            border-radius:4px;
                            position: relative;
                            margin-top: 21px;
                            // &:last-child{
                            //    margin:0; 
                            // }
                            &.money-off {
                                background:url('../../../../assets/images/unused-1.png') no-repeat top left 100%/100%;
                            }
                            &.all-reduction {
                                background:url('../../../../assets/images/unused-2.png') no-repeat top left 100%/100%;
                            }
                            &.all-isover {
                                background:url('../../../../assets/images/unused-3.png') no-repeat top left 100%/100%;
                            }                            
                            .coupon-container {
                                height: 75px;
                                display: flex;
                                position: relative;
                                overflow: hidden;
                                border-radius:4px 4px 0 0;
                                .price {
                                    height: 100%;
                                    padding-top: 22.5px;
                                    align-self: center;
                                    padding-left: 13.5px;
                                    width: 83px;
                                    font-size:24px;
                                    color: RGBA(255, 255, 255, 1);
                                    span:last-child {
                                        font-size: 18px;
                                        margin-left: 4.5px;
                                        vertical-align: middle;
                                    }
                                }
                                .info{
                                    color:rgba(255,255,255,1);
                                    margin-left: 4.5px;
                                    padding: 11px 0;
                                    &.status0{
                                        padding: 22px 0;
                                        p{line-height: 24px}
                                    }
                                    p{
                                        line-height: 24px;
                                        font-size:12px;
                                    }
                                }
                                .choose-icon{
                                    position:absolute;
                                    top:0;
                                    right: 0;
                                    width: 41px;
                                    height: 41px;
                                    display: inline-block;
                                    background: url('../../../../assets/images/coupon_choose_icon.png')no-repeat 50% 50% /cover;
                                }
                                .coupon-type {
                                }
                                .time {
                                    font-size: 12px;
                                    margin-top: .25rem;
                                }
                                .card-number {
                                }
                            }
                            .coupon-explain {
                                height: 30px;
                                line-height: 30px;
                                word-break: break-all;
                                padding: 0 10px;
                                color: #ffffff;
                                div {
                                   font-size:12px;
                                }
                                .coupon-course1{
                                    width: 75%;
                                    float: left;
                                }
                                .coupon-course2{
                                    width: 25%;
                                    float: right;
                                    cursor: pointer;
                                }                                
                            }
                        }
                    }
                }    
}
</style>
