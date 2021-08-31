<template>
    <div>
        <div class="coupon-center" v-loading="loading">
            <div class="divOne clearfix">
                <div class="course-item-box" v-for="(item,index) in couponList" :key="index">
                    <CourseItem :courseData="item"/>
                </div>
            </div>            
            <Page style="margin-top:40px;" v-on:currentPagesEven="currentChange" :currentPage='currentPages' :pageSize='pageSizes' :totals='totals'></Page>
        </div>
    </div>    
</template>
<script lang="ts">
import { Component , Vue ,Watch} from 'vue-property-decorator'
import Page from '~/components/Page.vue';
import { NuxtContext } from 'nuxt';
import CourseItem from '~/components/courseItem.vue';
import {delCookie,getCookie} from '../../../../utils/cache.js'
import ajaxs from '~/api/index.js';
@Component({
    components:{Page,CourseItem},      
})
export default class Arder extends Vue{
    // 1:未使用，2:已使用，3:已过期 
    couponList:object[]=[];
    pageSizes:number=12;
    totals:number=0;
    pageNo:number=1;    
    currentPages:number=1;
    selectIds:number=0;
    listType:number=1;
    loading:boolean=false;
    created(){
        this.selectIds = this.$route.query.id;              
        this.getCouponList(1,this.selectIds);
    }
    async currentChange(number){
        if(number>0){
            this.getCouponList(number,this.selectIds);
        }
    }
    async getCouponList(number,id){
        var self = this;
        self.couponList =[];
        let user =  getCookie('xgx_user')?JSON.parse( getCookie('xgx_user')):null;
        let query = {
            params:{
                pageSize:self.pageSizes,
                pageNo:Number(number),
                userId:user.userId,
                id:self.selectIds
               }
        }
        let res=await self.$axios.$get(this.$server.getDetailDataList,query)
        if(res.status==200){
            self.couponList = res.content.list;
            self.totals = res.content.total;
            self.currentPages = Number(number);
            self.loading = false;
        }else{
            self.loading = false;
        }        
    }
}   
</script>
<style lang="scss" scoped>
.coupon-center{
    width: 100%;
    .divOne{
        overflow: auto;
        zoom: 1;
        width: 915px;
        margin: 10px auto;
        .course-item-box{
            width: 305px;
            float: left;
            padding: 10px;
            cursor: default;
            text-align: left;            
        } 
    }
}
</style>
