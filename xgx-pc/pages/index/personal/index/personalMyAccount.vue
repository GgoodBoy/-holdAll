<template>
    <div class="personAccout">
        <div class="moneyAccount">
                <div class="moneyMe" v-if="moneyShow&&detailStart==1">
                        <div class="moneyDiv1">
                            <div class="moneyDiv1_1">
                                <p class="moneyDiv1_p2">账户余额 </p>
                                <div class="moneyDiv1_p1" :class="{'ellipsisCss':(JSON.stringify(accountData.coinBalance)&&JSON.stringify(accountData.coinBalance).length>10)}">{{accountData.coinBalance||0}}</div>
                                <p>夫子币</p>
                            </div>
                    </div>
                    <div class="butCss moneyDiv2" @click="queryDetailList">查看明细</div>
                    <div class="butCss moneyDiv3" @click="investMoney">充值</div>
                </div>
                <div class="detailList" v-if="listShow&&detailStart==2">
                    <div @click="returnDetail(1)">{{detailTits}}</div>
                    <el-table
                    :data="tableListSet"
                    v-loading="loading"
                    :header-cell-style="tableHeaderColor"
                    style="width: 100%">
                        <el-table-column
                            prop="sortId"
                            label="序号"
                            min-width="50">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            min-width="100">
                             <!-- 1 充值 2 赠送 3 消费 -->
                                <template slot-scope="scope">
                                    <span v-if="scope.row.sourceType==2">充值</span>
                                    <!-- <span v-if="scope.row.sourceType==2">赠送</span> -->
                                    <span v-if="scope.row.sourceType==1">消费</span>
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="coinNum"
                            label="金额"
                            min-width="100">
                        </el-table-column>
                        <el-table-column
                            prop="createdAt"
                            label="操作时间"
                            min-width="150">
                        </el-table-column>
                        <!-- <el-table-column
                            prop="balance"
                            label="账户余额"
                            min-width="100">
                        </el-table-column> -->
                    </el-table>
                    <Page :styleCss="cssObj" v-on:currentPagesEven="currentChange" :currentPage='currentPages' :pageSize='pageSizes' :totals='totals'></Page>
                </div>
                <div class="investMoney" v-if="qrcodeShow">
                    <div @click="returnDetail(1)">{{detailTits}}</div>
                    <p>PC端暂不支持充值</p>
                    <p>请下载学国学APP充值</p>
                    <div class="qrcodeBox">
                        <img :src="logoImg"/>
                    </div>
                    <p>扫码下载App</p>
                </div>
        </div>
        <transition name="el-fade-in">
            <div class="course-dialog" v-show="dialogFlag&&detailStart==3">
                <div class="course-dialog-box">
                    <div class="title">温馨提示</div>
                    <div class="body">
                        <img class="xiaofuzi" :src="dialogImg"/>
                        <!-- <p>{{dialogTips}}</p> -->
                        <div class="btns">
                            <button class="confirm" @click="dialogFlag=false">取消验证</button>
                            <button class="cancel" @click="confirmTodo">去验证</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>        

    </div>
</template>
<script lang="ts">
import { Component , Vue ,Watch} from 'vue-property-decorator'
import {delCookie,getCookie} from '../../../../utils/cache.js'
import QRCode from 'qrcodejs2'
import Page from '~/components/Page.vue'
import { NuxtContext } from 'nuxt';
import {mapState,mapActions} from 'vuex';
import { setTimeout } from 'timers';
import ajaxs from '~/api/index.js';
const qrcodeImg = require('../../../../assets/images/section5_new_01.png');
const DialogImg = require('@/assets/images/xiaofuzi.png');
@Component({
    components:{Page},
    async asyncData({app,query}:NuxtContext):Promise<any>{},
    computed:{
        ...mapState(['detailStart'])
    },    
    methods:{
        ...mapActions(['selectMyStartEven','setDetailStart']),
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #F3F3F3;font-weight: 500;font-size: 16px;'
            }
        }
    }
})
export default class Account extends Vue{
    // 1:充值成功，2:购课成功，3:课程更新，4:小喇叭（站内信）
    accountData:object={};
    pageSizes:number=10;
    totals:number=0;
    pageNo:number=1;
    currentPages:number=1;
    modelType:number=0;
    listShow:boolean=false;
    qrcodeShow:boolean=false;
    moneyShow:boolean = true;
    logoImg:any = qrcodeImg;
    tableListSet:object[]=[];
    detailTits:string="";
    dialogFlag = false;
    cssObj:Object='position: absolute;bottom: -40px;width: 967px;left: 220px;';
    dialogImg = DialogImg;
    loading:boolean = false;
    //this.$route.query
    head(){
        return {
            title:'我的账户 | 学国学网'
        }
    }
    created(){
        var numbers = this.$route.query.selectId;
        this.selectMyStartEven(Number(numbers));
        this.getStartAccountEven();
    }
    @Watch("detailStart")
    onuserDataChanged(val, oldVal) {
        if(val==1&&oldVal!=val){
            this.listShow=false;
            this.moneyShow = true;
            this.qrcodeShow=false;           
        }
    }    
    async queryDetailList(){
        this.listShow=true;
        this.moneyShow = false;
        this.qrcodeShow=false;
        this.detailTits="<账户明细";
        this.setDetailStart(2);
        this.getMoneyList(1);
    }
    investMoney(){
        this.listShow=false;
        this.moneyShow = false;
        this.qrcodeShow=true;
        this.setDetailStart(3);
        this.detailTits="<充值";
    }
    returnDetail(num){
        switch (num) {
            case 1:
                this.listShow=false;
                this.moneyShow = true;
                this.qrcodeShow=false;
                this.setDetailStart(1);
                break;
            default:
                break;
        }
    }
    async getStartAccountEven(){
        let user =  getCookie('xgx_user')?JSON.parse( getCookie('xgx_user')):null;
        let querys = {
                params:{
                    userId:user.userId
                }
            }
        // let res=await this.$axios.$get(`${this.$server.getMyBalance}/${user.userId}`,querys);
        let res=await this.$axios.$get(this.$server.getMyBalance,querys);
        if(res.status==200){
                this.accountData=res.content;
                this.modelType = Number(this.$route.query.selectId)
        }
    }
    async currentChange(number){
        if(number>0){
            this.getMoneyList(number);
        }
    }
    async getMoneyList(number){
        var self = this;
        self.loading = true;
        let user =  getCookie('xgx_user')?JSON.parse( getCookie('xgx_user')):null;
        let query = {
            params:{
                pageSize:10,
                pageNo:number,
                userId:user.userId
               }
        }
        let res=await this.$axios.$get(this.$server.getMyAccountDetail,query)
        if(res.status==200){
            var listIds = [];
            var contentdate = res.content;
            var nextPage = contentdate.nextPage;
            var prePage = contentdate.prePage;
            if(contentdate.list.length){
                //正序
                    listIds = contentdate.list.map(function(element,index){
                        if(contentdate.pageNum==1){
                            element.sortId = index+1;
                            return element;
                        }else if(contentdate.pageNum>1){
                            element.sortId = (contentdate.pageNum-1)*10+index+1;
                            return element;
                        }
                    });  
            };
                self.tableListSet = listIds;
                self.totals = contentdate.total;
                self.currentPages = Number(number);
                self.$nextTick(function(){
                    self.loading = false; 
                })
        }
    }
    confirmTodo(){}
}
</script>
<style lang="scss" scoped>
.personAccout{
    min-height: 570px;
    .course-dialog{
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        .course-dialog-box{
            width: 523px;
            height: 457px;
            position: absolute;
            top:50%;
            left: 50%;
            background: #fff;
            border-radius: 5px;
            transform: translate(-50%,-50%);
            .title{
                font-size: 19px;
                color:#6A6A6A;
                height: 56px;;
                line-height:56px;
                padding-left:29px;
                background: #EDF1F7;
            }
            .body{
                text-align: center;
                img{
                    display:inline-block;
                    width: 114px;
                    height: 191px;
                    margin:42px 0 25px 0;
                }
                p{
                text-align: center;
                font-size: 22px;
                color:#6A6A6A; 
                letter-spacing: 1px;
                }
                .btns{
                    display: inline-block;
                    font-size: 0;
                    margin-top:30px;
                    button{
                        display: inline-block;
                        vertical-align: middle;
                        width:130px;
                        height:40px;
                        line-height: 38px;
                        font-size: 16px;
                        border-radius: 5px;
                        outline: none;
                        border:none;
                        cursor: pointer;
                    }
                    .confirm{
                        color:#C30D23;
                        background: #fff;
                        border:1px solid #C30D23;
                        &:hover{
                            background: #fbf3f3;
                        }
                        margin-right: 66px;                        
                    }
                    .cancel{
                        color:#fff;
                        background: #C30D23;
                        border:1px solid #C30D23;
                        &:hover{
                            background: #d6394c;
                        }
                        
                    }
                }
            }
        }
    }    
    .moneyAccount{
        text-align: center;
        margin-top: 40px;
        .qrcodeBox{
            width: 111px;
            height: 111px;
            margin: 20px auto;
            img{
                width: 100%;
            }
        }
        .investMoney{
            div:nth-child(1){
                text-align: left;
                margin: 20px;
                cursor: pointer;
            }
            p:nth-child(3){
                font-size: 16px;
                margin-top: 10px;
                text-align: center;
            }
            p:nth-child(2){
                font-size: 22px;
                font-weight: bold;
                text-align: center;
            }
        }
        .detailList{
            div:nth-child(1){
                text-align: left;
                margin: 20px;
                font-size: 18px;
                cursor: pointer;
            }
        }
        .moneyMe{
            width: 250px;
            display: inline-block;
            .moneyDiv2{
                font-size: 16px;
                color: #fff;
                width:150px;
                height:41px;
                background:rgba(195,13,35,1);
                border-radius:2px;
                line-height: 41px;
                margin-top: 10px;
                cursor: pointer;
                margin: 20px auto;
            }
            .moneyDiv3{
                width:150px;
                height:41px;
                border:1px solid rgba(191,191,191,1);
                border-radius:2px;
                color: #CC0033;
                margin-top: 10px;
                line-height: 31px;
                cursor: pointer;
                margin: auto;
            }
            .moneyDiv1{
                .ellipsisCss{
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    -o-text-overflow: ellipsis;
                    overflow: hidden;                
                }
                .moneyDiv1_1{
                        width: 250px;
                        height: 250px;
                        margin: auto;
                        padding-top: 67px;
                        border: 2px solid #CC0033;
                        border-radius: 50%;
                        box-shadow: #CC0033 0px 0px 4px 1px;
                        text-align: center;
                    p{
                        font-size: 12px;
                    }
                    .moneyDiv1_p2{
                        font-size: 16px;
                    }
                    .moneyDiv1_p1{
                        width: 90%;
                        text-align: center;
                        font-size: 41px;
                        margin: auto;
                        line-height: 70px;
                        color: #CC0033;
                    }
                }
            }
        }
    }
}
</style>
