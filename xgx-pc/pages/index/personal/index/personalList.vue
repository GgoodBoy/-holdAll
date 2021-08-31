<template>
    <div class="personal-list">
        <div class="newsTble">
            <el-tabs :stretch="true" v-model="activeName" @tab-click="handleClick" :style="{'minHeight':height}">
                <el-tab-pane :name='item.value' v-for="(item,index) in tabslist" :key='index'>
                    <span slot="label">{{item.label}}</span>
                    <div slot="label" v-show="item.numbs>0?true:false" v-bind:style="{'right': (item.label.length==4&&tabslist.length-1==index)?'-28px':(item.label.length==4?'-9px':0) }"  class="labelCss">{{item.numbs>99?'99+':item.numbs}}</div>
                    <el-table
                    :data="tableListSet"
                    :show-header="false"
                    stripe
                    style="width: 100%">
                        <el-table-column
                            prop="msgTypeName"
                            label=""
                            :class-name="'msgTypeName'"
                            min-width="60">
                        </el-table-column>
                        <el-table-column
                            prop="msgContent"
                            label=""
                            min-width="200">
                        </el-table-column>
                        <el-table-column
                            prop="createdAt"
                            label=""
                            :class-name="'createdAt'"
                            width="220">
                        </el-table-column>
                    </el-table>
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
import {delCookie,getCookie} from '../../../../utils/cache.js';
import { setTimeout } from 'timers';
import ajaxs from '~/api/index.js';
import { constants } from 'fs';
@Component({
    components:{Page},
    methods:{
        ...mapActions(['selectMyStartEven'])
    },
    async asyncData({app,query}:NuxtContext):Promise<any>{}
})
export default class About extends Vue{
    activeName:string='0';
    // 1:充值成功，2:购课成功，3:课程更新，4:小喇叭（站内信）
    tableListSet:object[]=[];
    pageSizes:number=10;
    totals:number=0;
    pageNo:number=1;
    currentPages:number=1;
    modelType:number=0;
    cssObj:Object='position: absolute;bottom:0px;width: 967px;left: 0px;';
    height = '600px'
    tabslist:object[]=[
        {
            label:'全部',
            value:'0',
            numbs:0
        },
        {
            label:'充值消息',
            value:'1',
            numbs:0
        },        
        {
            label:'购课',
            value:'2',
            numbs:0
        },
        {
            label:'小喇叭',
            value:'4',
            numbs:0
        },
        {
            label:'课程更新',
            value:'3',
            numbs:0
        }
    ];
    head(){
        return {
            title:'我的消息 | 学国学网'
        }
    }
   created(){
        var numbers = this.$route.query.selectId;
        this.selectMyStartEven(Number(numbers));
        this.getUnreadNums();
        this.getDataList(1);
    }
    async handleClick(tab, event) {
        this.getDataList(1);
    }
    async currentChange(number){
        if(number>0){
            this.getDataList(number);
        }
    }
    setDataToTableHeader(types,numbs){
        for (const iterator of this.tabslist) {
            if(iterator['value']==types){
                iterator['numbs'] = Number(numbs);
                this.tabslist[0]["numbs"] = this.tabslist[0]["numbs"]+Number(numbs);
            }
        }
    }
    async getUnreadNums(){
        let user =  getCookie('xgx_user')?JSON.parse( getCookie('xgx_user')):null;
        let query = {
            params:{
                pageSize:10,
                pageNo:1,
                userId:user.userId
               }
        }
        let res=await this.$axios.$get(this.$server.getMyUnreadNum,query)
        if(res.status==200){
            for (const iterator of res.content) {
                switch (iterator.msgType) {
                    case '2':
                        this.setDataToTableHeader(iterator.msgType,iterator.MsgTypeNum);
                        break;
                    case '3':
                        this.setDataToTableHeader(iterator.msgType,iterator.MsgTypeNum);
                        break;
                    case '4':
                        this.setDataToTableHeader(iterator.msgType,iterator.MsgTypeNum);
                        break;
                    default:
                        break;
                }
            }
        }
    }
    async getDataList(number){
        let query = {
            params:{
                pageSize:10,
                pageNo:number,
                msgType:this.activeName=='0'?'':Number(this.activeName),
               }
        }
        let res=await this.$axios.$get(this.$server.getMessagePetPage,query)
        if(res.status==200){
            this.tableListSet = res.content.list;
            this.totals=res.content.total;
            this.currentPages = Number(number);
        }
    }

}
</script>
<style lang="scss">
    .personal-list{
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
            text-align: center;
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
    position: relative;
}
.newsTble{
    text-align: center;
    width: 967px;
    // padding-bottom:90px;
    // background:#F3F5F7 ;
    .labelCss{
        position: absolute;
        min-height: 20px;
        min-width: 20px;
        background: #C30D23;
        top: 10px;
        right: 0;
        color: #fff;
        line-height: 20px;
        font-size: 12px;
        padding: 0 3px;
        border-radius: 10px;
    }
}
</style>
