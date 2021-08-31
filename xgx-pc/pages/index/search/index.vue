<template>
    <div class="search-page">
        <div class="page-top">
            <div class="content">
                <!-- <div class="breadcrumb clearfix">
                    <BreadCrumb :listData="breadCrumb"></BreadCrumb>
                </div> -->
                <div class="search-tips">
                    <p>以下是关于“{{keywords}}”的搜索结果</p>
                </div>
                <div class="hot-words clearfix">
                    <div class="label-box">热门搜索</div>
                    <span class="colon">：</span>
                    <div class="value-box">
                        <p class="hot-word-item" v-for="(item,index) in hotWordList" :key="index" @click="chooseHotWords(item)">{{item.name}}</p>
                    </div>
                </div>
                <div class="history clearfix">
                    <div class="label-box">搜索历史</div>
                    <span class="colon">：</span>
                    <div class="value-box">
                        <p class="history-item" v-for="(item,index) in historyList" :key="index" @click="chooseHistory(item)">{{item.name}}</p> 
                    </div>
                </div>
            </div>
        </div>
        <div class="page-body">
            <div class="condition" v-if="courseList.length>0">
                <p :class="sortType==1?'active':''" @click="getSearchResult(1)">最新</p>
                <p :class="sortType==2?'active':''" @click="getSearchResult(2)">最热</p>
            </div>
            <div class="course-list clearfix">
                <div class="no-data" v-if="courseList.length==0&&finish">
                    <img :src="noDataImg" />
                    <p>暂无符合条件的搜索结果</p>
                </div>
                <div v-if="courseList.length>0">
                    <div class="course-item-box" v-for="(item,index) in courseList" :key="index">
                        <CourseItem :courseData="item"></CourseItem>
                    </div>
                </div>
            </div>
            <div class="page-box" v-if="courseList.length>0">
                <Page
                    :pageSize="pageSize"
                    :currentPage.sync="currentPage"
                    :totals="totals"
                ></Page>
            </div>
            <div class="hot-course clearfix" v-if="courseList.length==0&&finish">
                <p class="title">热门课程推荐</p>
                <div class="course-item-box" v-for="(item,index) in hotList" :key="index">
                    <CourseItem :courseData="item"></CourseItem>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Component,Vue,Watch} from 'vue-property-decorator'
import CourseItem from '~/components/courseItem.vue'
import Page from '~/components/Page.vue'
import $server from '~/api/index'
import { NuxtContext } from 'nuxt'
import { Route } from "vue-router";
import { setTimeout } from 'timers';
import BreadCrumb from '~/components/breadcrumb.vue'
const noDataImg = require('@/assets/images/no-data.png');
@Component({
    components:{
        CourseItem,
        Page,
        BreadCrumb
    },
    async asyncData({app,query}:NuxtContext):Promise<any>{
        let keywords = query.keywords,historyList = [{name:'---'}]
        if(keywords=='')return false;

        if(process.client){
            historyList = window.localStorage.getItem('history')? JSON.parse(window.localStorage.getItem('history')):[]
            let temp = {
                name:keywords
            }
            if(historyList.length>0){
                let index = historyList.findIndex(item=>item.name==keywords);
                index>=0&&historyList.splice(index,1);
                if(historyList.length<10){
                    historyList.unshift(temp)
                }
                else{
                    historyList.splice(historyList.length-1,1);
                    historyList.unshift(temp)
                }    
            }else{
                historyList.push(temp)
            }
            window.localStorage.setItem('history',JSON.stringify(historyList))
        }
        
        let currentPage = 1,pageSize = 12 ,sortType = 1;
        let queryData = {
            params:{
                content:query.keywords,
                sortType:sortType,
                pageNo:currentPage,
                pageSize:pageSize
            }
        }
        let res = await app.$axios.$get($server.search,queryData);
        if(res.status==200){
            return{
                totals:res.content.total,
                courseList:res.content.list,
                currentPage:currentPage,
                pageSize:pageSize,
                sortType:sortType,
                keywords:query.keywords,
                historyList:historyList,
                hotWordList:[{name:'---'}],
                finish:true
            }  
        }
    },
})
export default class Search extends Vue{
    keywords = ''
    keyWordsFlag = false
    pageSize  = 12
    currentPage = 1
    totals = 12
    sortType = 1
    hotWordList = []
    historyList = []
    courseList = []
    breadCrumb = [{name:'课程',},{name:'搜索'}]
    hotList = []
    noDataImg = noDataImg
    finish = false
    @Watch("currentPage")
    oncurrentPageChanged(val, oldVal) {
        if(val==0) return false;
        if(this.keyWordsFlag) return false;
        this.search()
    }
    @Watch("keywords")
    onkeywordsChanged(val, oldVal) {
        if(val!=''){
            this.finish = false;
            this.keyWordsFlag = true;
            this.currentPage = 1;
            this.sortType = 1;
            this.search()
        }
    }
    @Watch("$route", { immediate: true})
    onrouteChanged(val, oldVal) {
        this.keywords = val.query.keywords;
    }
    head(){
        return {
            title:'课程搜索 | 学国学网',
        }
    }
    mounted(){
        if(process.client){
            let loadingInstance = this.$loading.service({
                target:document.getElementsByClassName('page-top')[0],
            });
            this.getHotWordList()
            this.getHistory()
            this.getHotList()
            loadingInstance.close()
        }
    }
    /**
     * 获取热词列表
     */
    async getHotWordList(){
        let res = await this.$axios.$get(this.$server.getHotWordList,{});
        if(res.status==200){
            this.hotWordList =res.content;
        }
    }
    /**
     * 获取热门课程
     */
    async getHotList(){
        let query = {
            params:{
                size:4
            }
        }
        let res = await this.$axios.$get(this.$server.getHotList,query)
        if(res.status==200){
            this.hotList = res.content
        }
    }
    /**
     * 获取搜索记录
     */
    getHistory(){
        let historyList = window.localStorage.getItem('history')?JSON.parse(window.localStorage.getItem('history')):[];
        this.historyList = historyList;
    }
    /**
     * 设置搜索记录
     */
    setHistory(){
        let keywords = this.keywords;
        if(keywords=='')return false;
        let historyList = [...this.historyList];
        let temp = {
            name:keywords
        }
        if(historyList.length>0){
            let index = historyList.findIndex(item=>item.name==keywords);
            index>=0&&historyList.splice(index,1);
            if(historyList.length<10){
                historyList.unshift(temp)
            }
            else{
                historyList.splice(historyList.length-1,1);
                historyList.unshift(temp)
            }    
        }else{
            historyList.push(temp)
        }
        window.localStorage.setItem('history',JSON.stringify(historyList))
        this.historyList = historyList;
    }
    /**搜索 */
    async search(){
        this.setHistory();
        let loadingInstance = this.$loading.service({
            target:document.getElementsByClassName('page-body')[0],
            background:'rgba(255,255,255,0)'
        });
        let query = {
            params:{
                content:this.keywords,
                sortType:this.sortType,
                pageNo:this.currentPage,
                pageSize:this.pageSize
            }
        }
        let res = await this.$axios.$get(this.$server.search,query)
        loadingInstance.close()
        if(res.status==200){
            this.totals = res.content.total;
            this.courseList = res.content.list;
            this.keyWordsFlag = false;
            this.finish = true;
        }
    }
    /**
     * 选择热词
     */
    chooseHotWords(obj){
        this.$router.replace({
            path:'/search',
            query:{
                keywords:obj.name
            }
        })
    }
    /**
     * 选择条件
     */
    getSearchResult(type){
        this.sortType = type;
        this.currentPage = 0;
        this.$nextTick(()=>{
            this.currentPage = 1;
        })
    }
    /**
     * 选择历史记录
     */
    chooseHistory(obj){
        this.$router.replace({
            path:'/search',
            query:{
                keywords:obj.name
            }
        })
    }
}
</script>
<style lang="scss" scoped>
    .search-page{
        background: #F3F5F7;
        .page-top{
            box-shadow:0px 6px 10px 0px rgba(230,230,230,1);
            background: #fff;
            .content{
                width: 1200px;
                margin:30px auto 0;
                padding-top:20px;
                color:#07111A;
                font-size: 18px;
                .label-box{
                    font-weight: bold;
                    float: left;
                    width: 80;
                    text-align: justify;
                    text-align-last: justify;
                }
                .colon{
                    float: left;
                    padding-right:18px;
                }
                .value-box{
                    float: left;
                    width: calc(100% - 100px);
                }
                .breadcrumb{
                    padding: 32px 0 10px 0;
                }
                .search-tips{
                    margin:0 0 30px 0;
                    color:#C30D23;
                }
                .hot-words{
                    margin-bottom:15px;
                }
                .hot-word-item,.history-item{
                    float: left;
                    margin:0 20px 15px 0;
                    cursor: pointer;
                    &:hover{
                        opacity: 0.85;
                    }
                }
            }
        }
        .page-body{
            min-height: 400px;
            .condition{
                height: 80px;
                font-size: 0;
                width: 1200px;
                margin:0 auto;
                p{
                    display: inline-block;
                    height: 30px;
                    line-height: 30px;
                    margin:25px 20px 25px 0;
                    font-size: 18px;
                    color:#000;
                    padding: 0 10px;
                    border-radius: 20px;
                    cursor: pointer;
                    &.active{
                        background:#9099A1;
                        color:#fff;
                        transition: all 0.3s;
                    }
                }
            }
            .course-list{
                width: 1220px;
                margin:0 auto;
                .no-data{
                    margin:120px auto 80px auto;
                    text-align: center;
                    img{
                        display: inline-block;
                    }
                    p{
                        color:#666666;
                        font-size: 14px;
                    }
                }
                .course-item-box{
                    width:305px;
                    float: left;
                    padding:10px;
                    cursor: default;
                    // &:hover{
                    //     transform: translateY(-10px);
                    //     transition: all 0.3s;
                    //     box-shadow:0px 0px 20px 0px rgba(230,230,230,1);
                    // }
                }
                
            }
            .page-box{
                width: 1200px;
                margin:0 auto;
                padding: 50px 0;
                text-align: center;
            }
            .hot-course{
                width: 1220px;
                margin:0 auto;
                padding-bottom: 40px;
                .title{
                    color:#333333;
                    font-size: 18px;
                    font-weight: bold;
                    margin:10px 0 20px 0;
                }
                .course-item-box{
                    width:305px;
                    float: left;
                    padding:10px;
                    cursor: default;
                }
            }
        }
    }
</style>
