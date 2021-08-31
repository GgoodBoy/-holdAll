<template>
    <div class="detail-center">
        <div class="detail-page" :style="{'min-height':minHeight+'px'}">
            <div class="detailName">
                <el-row>
                    <el-col :span="18">
                        <breadcrumb :listData='datalist' :iconType='iconCss'></breadcrumb>
                    </el-col>
                    <el-col  :span="6" class="aboutListCss">
                        <p>共搜索出：<span style="color:red;">{{detailData.total}}条</span>相关记录</p>
                    </el-col>
                </el-row>
            </div>
            <div class="detailData">
                        <el-input class="inputDiv" :maxlength="20" v-model="queryInput" placeholder="请输入内容"></el-input>
                        <el-button class="inputBut" type="danger" @click="getQueryInfo(queryInput)">搜索</el-button>
            </div>
            <div class="detail-content">
                <div class="listDivCss" v-for="(item,index) in detailData.list" :key="index" @click="getDetailInfEven(item.id)">
                    <div class="leftimg">
                        <img :src="item.pictureUrl"/>
                    </div>
                    <div class="rightInfo">
                        <p>{{item.name}}</p>
                        <div class="listuser">
                            <el-row style="text-align:left;color:#999999">
                                <el-col :span="21">
                                    <span>作者：{{item.author}} </span>
                                    <span style="margin-left:20px;">来源：{{item.source}} </span>
                                    <span style="margin-left:20px;">发表于：{{item.createdAt_PC}}</span>
                                </el-col>
                                <el-col :span="3">浏览：{{Math.floor(Number(item.browseCount)/1e5)>1?Math.floor(Number(item.browseCount)/1e5)+'W+':Number(item.browseCount)}}</el-col>                                
                            </el-row>
                        </div>
                    </div>
                </div>
                <div class="noDataCss" v-show="listNumber==0">没有搜到您想要的内容</div> 
                <Page :styleCss="cssObj" v-on:currentPagesEven="currentChange" :currentPage='currentPages' :pageSize='pageSizes' :totals='totals'></Page>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component , Vue, Watch} from 'vue-property-decorator'
import Page from '~/components/Page.vue'
import breadcrumb from '~/components/breadcrumb.vue'
import ajaxs from '~/api/index.js';
import { NuxtContext } from 'nuxt'
@Component({
    components:{Page,breadcrumb},
    async asyncData({app,params}:NuxtContext):Promise<any>{}
})
export default class Auth extends Vue{
    queryInput:string='';
    detailData:object={};
    pageNo:number=1;
    pageSizes:number=10;
    currentPages:number=1;
    loading:boolean=false;
    totals:number=0;
    minHeight=''
    listNumber:number=0;
    cssObj:Object='position: absolute;bottom: 0px;width: 100%;left: 0;'
    iconCss:any=">";
    datalist:object[] = [
        {
            name:'首页',
            link:'/home'
        },{
            name:'资讯',
            link:''
            }
    ]  
    head(){
        return {
            title:'资讯搜索 | 学国学网'
        }
    }  
    created(){
        this.queryInput = this.$route.params.query;
        if(this.queryInput){
            if(process.client){
                sessionStorage.setItem("queryInputData",this.queryInput);
                this.getQueryInfo(this.queryInput);
            }
        }else{
            if(process.client){
                this.queryInput = sessionStorage.getItem("queryInputData");
                this.getQueryInfo(this.queryInput);
            }
        }
    }

    async getDetailInfEven(id){
        // this.$router.push({ path:`/information/${id}`});

        let routeUrl = this.$router.resolve({
                path: `/information/${id}`});
        window.open(routeUrl.href, '_blank');

    }    






    async currentChange(number){
        this.pageNo = Number(number);
        this.currentPages=Number(number);
        this.getQueryInfo(this.queryInput);
    }    
    async getQueryInfo(datas){
            let query = {
                params:{
                    pageSize:10,
                    pageNo:this.pageNo,
                    name:datas
                }
            }          
            if(process.client){
                sessionStorage.setItem("queryInputData",datas);
            }              
            //ES7 ajax写法 await会在异步执行结束之后，才会执行后面的代买，实现了从上到下的代码阅读
            let res = await this.$axios.$get(this.$server.getInformationPageInfo,query)
            if(res.status==200){
                this.loading = false;
                this.listNumber = res.content.list.length;
                this.detailData = res.content;
                this.totals=res.content.total;
            }else{
                this.listNumber = 0;
            }        
    }
    mounted(){
      this.minHeight = window.screen.availHeight-287-53-18
      setTimeout(()=>{
        document.querySelector(".detail-center").style.minHeight = `${this.minHeight}px`
      },10)
    }    
}
</script>
<style lang="scss" scoped>
.detail-center{
    background: #f2f2f2f2;
    .detail-page{
        display: inline-block;
        padding-top: 20px;    
        width: 1160px;
        background: #ffffff;   
        padding: 30px;     
        position: relative;
        .detail-content{
            width: 100%;
            margin: 0 0 40px 0;
            .noDataCss{
                width: 100%;
                text-align: center;
                color: #ccc;
                margin: 30px 0 0 0;        
            }            
            .listDivCss{
                cursor: pointer;
                zoom: 1;
                border-bottom: 1px solid #ccc;
                padding: 20px 0;
                overflow: auto;
                .leftimg,.rightInfo{
                    float: left;
                }
                .leftimg{
                    width: 180px;
                    height: 120px;
                    overflow: hidden;
                    background: rgba(0,0,0,0.1);
                    img{
                        width: 100%;
                    }
                }
                .rightInfo{
                    position: relative;
                    width: 870px;
                    height: 120px;
                    padding: 0 30px;
                    p{
                        position: absolute;
                        top: 0;
                        font-size: 20px;
                        width:870px;
                        text-align: left;
                    }
                    .listuser{
                        position: absolute;
                        bottom: 0;
                        width: 870px;
                    }
                }  
            }
        }
        .detailData{
            width: 100%;
            padding: 10px 0;
            zoom: 1;
            overflow: auto;
            .inputDiv,.inputBut{
                float: left;
            }
            .inputDiv{
                width: 1032px;
            }
            .inputBut{
                width: 68px;
            }            
        }
        .detailName{
            width: 100%;
            // font-weight: bold;   
            .aboutListCss{
                p{
                    text-align: right;
                    padding: 20px 0px 30px;
                    font-size: 14px;
                    font-weight: 100;
                }
            }
        }
    }
}

</style>