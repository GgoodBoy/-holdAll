<template>
    <div class="back-center">
         <div class="div-cneter">
           <div class="banner-top">
                 <div class="bannnerCss" :class="{'borderColorOne':Number(bnnerTopData.length)==0}">
                    <el-carousel height="404px" :autoplay="true" arrow="never">
                        <el-carousel-item v-for="(item,index) in bnnerTopData" :key="index">
                            <img style="width:100%;cursor: pointer;" v-lazy="item.pictureUrl" @click="getDetailInfEven(item.id)"/>
                            <p class="migTitle">{{item.name}}</p>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="listCss1">
                    <div class="selectBox">
                        <el-input class="inputDiv" :maxlength="20" v-model="queryInput" placeholder="请输入文章标题搜索"></el-input>
                        <el-button class="inputBut" type="danger" @click="getQueryInfo">搜索</el-button>
                    </div>
                    <!-- <el-scrollbar wrap-class="scrollbar-wrapper"> -->
                        <!-- <div class="pCss" :class="{ 'borderColorTwo':Number(bnnerTopData.length)==0}" @mouseenter="enter" @mouseleave="leave"> -->
                        <div class="pCss" :class="{ 'pCssAuto': overflowStart, 'borderColorTwo':Number(bnnerTopData.length)==0,'pCsshidden': !overflowStart}" @mouseenter="enter" @mouseleave="leave">
                            <p v-for="(item,index) in bnnerTopData" :key="index" @click="getDetailInfEven(item.id)">{{item.name}}</p>
                        </div>
                    <!-- </el-scrollbar> -->
                </div>
            </div>
            <div class="listDiv" v-loading="loading">
                <div class="listBox">
                    <div class="listDivCss" v-for="(item,index) in listData" :key="index" @click="getDetailInfEven(item.id)">
                        <div class="leftimg">
                            <img v-lazy="item.pictureUrl"/>
                        </div>
                        <div class="rightInfo">
                            <p>{{item.name}}</p>
                            <div class="listuser">
                                <el-row style="text-align:left;">
                                    <el-col :span="20" style="min-width: 740px;">
                                        <span>作者：{{item.author}} </span>
                                        <span style="margin-left:20px;">来源：{{item.source}}</span>
                                        <span style="margin-left:20px;">发表于：{{item.createdAt_PC}} </span>
                                    </el-col>
                                    <el-col :span="4" style="max-width: 140px;">浏览：{{Math.floor(Number(item.browseCount)/1e5)>1?Math.floor(Number(item.browseCount)/1e5)+'W+':Number(item.browseCount)}}</el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
                <Page :styleCss="cssObj" v-on:currentPagesEven="currentChange" :currentPage='currentPages' :pageSize='pageSizes' :totals='totals'></Page>
            </div>
            <!-- <el-dialog
            :visible.sync="centerDialogVisible"
            width="50%"
            :show-close="false"
            center>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">返回</el-button>
                </span>
            </el-dialog> -->
        </div>
    </div>
</template>
<script lang="ts">
import { Component , Vue } from 'vue-property-decorator';
import Page from '~/components/Page.vue';
import { NuxtContext } from 'nuxt';
import { setTimeout } from 'timers';
import breadcrumb from '~/components/breadcrumb.vue';
import ajaxs from '~/api/index.js';
const Logo = require('../../../../assets/images/logo_type2.png');
@Component({
    components:{Page,breadcrumb},
    async asyncData({app,params}:NuxtContext):Promise<any>{}
})
export default class About extends Vue{
    logo:any = Logo;
    centerDialogVisible: boolean =false;
    currentPages:number=1;
    loading:boolean = false;
    pageSizes:number=10;
    totals:number=0;
    pageNo:number=1;
    queryInput:string='';
    bnnerTopData:object[]=[];
    listData:object[]=[];
    overflowStart:boolean=false;
    cssObj:Object='position: absolute;bottom: -40px;width: 1100px;left: 0;';
    head(){
        return {
            title:'资讯 | 学国学网'
        }
    }
    created(){
        this.getPageBnnerTop(1);
        this.getinformationinfo(1);
    }
    async getDetailInfEven(id){
        // this.$router.push({ path:`/information/${id}`});
        let routeUrl = this.$router.resolve({
                path: `/information/${id}`});
        window.open(routeUrl.href, '_blank');
    }
    async getQueryInfo(){
        let querys = this.queryInput;
        if(querys.length>0){
            this.$router.push({name: 'index-information-index-querys', params: {query: querys}})
        }else{
            this.$message.error("请输入搜索内容");
        }

    }
    async currentChange(number){
        this.pageNo = Number(number);
        this.currentPages=Number(number);
        this.getinformationinfo(number);
    }
    async getinformationinfo(number){
            this.loading = true;
            let query = {
                params:{
                    pageSize:10,
                    pageNo:number
                }
            }
            //ES7 ajax写法 await会在异步执行结束之后，才会执行后面的代买，实现了从上到下的代码阅读
            let res = await this.$axios.$get(this.$server.getInformationPageInfo,query)
            if(res.status==200){
                this.loading = false;
                console.log(' this.loading1', this.loading);
                this.listData = res.content.list;
                this.totals = res.content.total;
                this.currentPages = Number(number);
                window.scrollTo({top: 0});
            }
    }
    async getPageBnnerTop(number){
            let query = {
                params:{
                    pageSize:10,
                    pageNo:number
                }
            }
            //ES7 ajax写法 await会在异步执行结束之后，才会执行后面的代买，实现了从上到下的代码阅读
            let res = await this.$axios.$get(this.$server.getInformationTop,query)
            if(res.status==200){
                console.log(' this.loading2', this.loading);
                this.bnnerTopData = res.content.list;
            }
    }
    enter(){
        this.overflowStart=true;
    }
    leave(){
         this.overflowStart=false;
    }
    mounted(){
        // window.scrollTo({top: 0});
    }
}
</script>
<style lang="scss" scoped>
.back-center{
    background: #f2f2f2f2;
    .div-cneter{
            display: inline-block;
            padding-top: 20px;
            width: 1200px;
            background: #ffffff;
            padding:30px;
            .banner-top{
                width: 100%;
                zoom: 1;
                overflow: auto;
                .bannnerCss{
                    width: 800px;
                    float: left;
                    overflow: hidden;
                    .migTitle{
                        position: absolute;
                        bottom: 0;
                        text-align: left;
                        height: 60px;
                        width: 100%;
                        padding: 15px 23px;
                        line-height: 30px;
                        background: rgba(0,0,0,0.1);
                        color: #fff;
                    }
                }
                .listCss1{
                    width: 278px;
                    float: left;
                    margin-left: 20px;
                    .selectBox{
                        zoom: 1;
                        overflow:auto;
                        margin-bottom: 20px;
                        .inputDiv,.inputBut{
                            float: left;
                        }
                        .inputDiv{
                            width: 200px;
                        }
                        .inputBut{
                            width: 68px;
                            background: #C30D20;
                        }
                    }
                    .pCsshidden{
                        overflow-y: hidden;
                    }
                    .pCssAuto{
                        overflow-y: auto;
                    }
                    .pCss{
                        max-height: 342px;
                        cursor: pointer;
                        p{
                            width: 100%;
                            padding:7px 0 7px 0;
                            border-bottom: 1px solid #EFEFEF;
                            font-size: 14px;
                            line-height: 24px;
                            color: #666666;
                            text-align: left;
                            white-space:nowrap;
                            text-overflow:ellipsis;
                            -webkit-line-clamp: 2;
                            -o-text-overflow:ellipsis;
                            overflow:hidden;
                            cursor: pointer;
                        }
                    }
                }
            }
            .listDiv{
                margin-top: 20px;
                position: relative;
                .listBox{
                    min-height: 180px;
                    margin: 30px 0;
                    .listDivCss{
                        zoom: 1;
                        overflow: auto;
                        margin-top: 15px;
                        border-bottom: 1px solid #EFEFEF;
                        padding: 20px 0;
                        cursor: pointer;
                        .leftimg,.rightInfo{
                            float: left;
                        }
                        .leftimg{
                            width: 196px;
                            height: 100px;
                            overflow: hidden;
                            background: rgba(0,0,0,0.1);
                            img{
                                width: 100%;
                            }
                        }
                        .rightInfo{
                            width: 880px;
                            margin-left: 22px;
                            height: 100px;
                            position: relative;
                            p{
                                position: absolute;
                                text-align: left;
                                top: 10px;
                                width:100%;
                                font-size: 18px;
                                color: #333333;
                            }
                            .listuser{
                                position: absolute;
                                bottom: 10px;
                                width: 100%;
                                font-size: 14px;
                                color: #999999;
                            }
                        }
                    }
                }
            }
        }
 }
.borderColorOne{
    border:1px solid #ccc;
}
.borderColorTwo{
    min-height: 344px;
    border:1px solid #ccc;
}
</style>
