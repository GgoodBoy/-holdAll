<template>
    <div class="H5-user-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <div class="page-h5-section">
                <el-input v-model="cellPhone" style="width:200px;" placeholder="输入手机号查询"></el-input>
                <el-button type="primary" v-if="$authJudge('interact:userList:select')" @click='search()'>查询</el-button>
            </div>
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="cellphone"
                        label="手机号"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="starNum"
                        label="孚星总数"
                        min-width="100"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <!-- <el-table-column
                        prop="intellectNum"
                        label="智力值总数"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>  -->
                    <el-table-column
                        prop="lastLoginAt"
                        label="最后登录时间"
                        align="center"
                        min-width="160"
                        >
                    </el-table-column>                                    
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="120">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type='text' v-if="$authJudge('interact:userList:detail')" size="small" @click="edit(scope.row,1)">详情</el-button>
                                    <el-button type='text' v-if="$authJudge('interact:userList:address')" size="small" @click="edit(scope.row,2)">收货地址</el-button>
                                    <el-button type='text' v-if="$authJudge('interact:userList:address')" size="small" @click="edit(scope.row,3)">兑换记录</el-button>
                                </div>                                              
                            </template>                    
                    </el-table-column>                                                
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
                </div>             
            </div>
        </div>
        <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal='false'
        :close-on-press-escape="false"
        width="25%">
            <div class="dialogOne">
                <el-button type="danger" size="small">收货地址</el-button>
                <div class="editBox">  
                    <div class="addressBox" v-for="(item,index) in addressList" :key='index'>
                        <div class="rowcss">
                            <div>添加时间:</div>
                            <div>{{item.createdAt}}</div>
                        </div>
                        <div class="rowcss">
                            <div>收件人:</div>
                            <div>{{item.receiverName}}</div>
                        </div>
                        <div class="rowcss">
                            <div>手机号:</div>
                            <div>{{item.phoneNum}}</div>
                        </div>
                        <div class="rowcss">
                            <div>邮寄地址:</div>
                            <div>{{item.detailAdreaa}}</div>
                        </div>
                    </div>
                </div>
                <div class="blocks">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValueTwo"
                        :current-page.sync="pageAtionTwo.paginationPage"
                        :total="pageAtionTwo.pageTotal">
                    </el-pagination>
                </div> 
            </div>
        </el-dialog>    
        <el-dialog
        :visible.sync="dialogVisibleTwo"
        :close-on-click-modal='false'
        :close-on-press-escape="false"
        width="25%">
            <div class="dialogTwo">
                <div class="ageCss">
                    <div :class="{ active: addressId==2?true:false}" @click="selectOneEven(2)">3-4岁</div>
                    <div :class="{ active: addressId==3?true:false }" @click="selectOneEven(3)">4-5岁</div>
                    <div :class="{ active: addressId==4?true:false }" @click="selectOneEven(4)">5-6岁</div>
                </div>
                <div class="paressCss">
                    <p>当前学习进度</p>
                    <p>{{currentStudyRecord}}</p>
                </div>
                <div class="tabsCss">
                    <div :class="{ active: type==1?true:false }" @click="selectTwoEven(1)">孚星</div>
                    <!-- <div :class="{ active: type==2?true:false }" @click="selectTwoEven(2)">智力值</div> -->
                    <div :class="{ active: type==3?true:false }" @click="selectTwoEven(3)">勋章等级</div>
                </div>                
                <div style="text-align: left;padding:10px 0;" v-if="type==1||type==2">
                    当前{{type==1?'孚星':'智力'}}数量:{{totalNums}}
                </div>
                <div class="editBox" v-if="type!=3">  
                    <el-table
                        border
                        :data="tableDetal"
                        v-loading="loading"
                        style="width: 100%">
                        <el-table-column
                            prop="createdAt"
                            label="获得时间"
                            align="center"
                            min-width="150"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="resource"
                            label="来源"
                            min-width="100"
                            align="center"
                            show-overflow-tooltip>
                        </el-table-column>  
                        <el-table-column
                            v-if="type==1"
                            prop="starNum"
                            label="数量"
                            align="center"
                            min-width="100"
                            >
                            <template slot-scope="scope"> 
                                <span>+{{scope.row.starNum}}</span>                                              
                            </template>
                        </el-table-column>   
                        <el-table-column
                            v-if="type==2"
                            prop="intellectNum"
                            label="数量"
                            align="center"
                            min-width="100"
                            >
                            <template slot-scope="scope"> 
                                <span>+{{scope.row.intellectNum}}</span>                                              
                            </template> 
                        </el-table-column>                                 
                    </el-table>                    
                </div>
                <div class="blocks" v-if="type!=3">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValueThree"
                        :current-page.sync="pageAtionThree.paginationPage"
                        :total="pageAtionThree.pageTotal">
                    </el-pagination>
                </div> 
                <div class="imgBox" v-if="type==3">
                    <div class="imgBoxList" v-for="(item,index) in imgList" :key="index">
                        <img :src="item.medalImg"/>
                        <p>{{item.medalName}}</p>
                    </div>
                </div>
            </div>
        </el-dialog> 
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-click-modal='false'
        :close-on-press-escape="false"
        width="25%">
            <div class="dialogTwo">
                <div class="editBox">  
                    <el-table
                        border
                        :data="tableExchange"
                        v-loading="loading"
                        style="width: 100%">
                        <el-table-column
                            prop="phoneNum"
                            label="兑换手机"
                            align="center"
                            min-width="150"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="createdAt"
                            label="获得时间"
                            min-width="100"
                            align="center"
                            show-overflow-tooltip>
                        </el-table-column>  
                        <el-table-column
                            prop="starNum"
                            label="数量"
                            align="center"
                            min-width="100"
                            > 
                            <template slot-scope="scope"> 
                                <span>-{{scope.row.starNum}}</span>                                              
                            </template>
                        </el-table-column>                                 
                    </el-table>                    
                </div>
                <div class="blocks">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValueFour"
                        :current-page.sync="pageAtionFour.paginationPage"
                        :total="pageAtionFour.pageTotal">
                    </el-pagination>
                </div> 
            </div>
        </el-dialog>                  
    </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import Clipboard from 'clipboard';
export default {
    data() {
        return {
            titleList:[
                {
                    name:'H5课程管理',
                    pathInfo:''
                },
                {
                    name:'用户管理',
                    pathInfo:''
                }               
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            pageAtionTwo:{
                pageTotal:0,
                paginationPage:1
            },
            pageAtionThree:{
                pageTotal:0,
                paginationPage:1
            },
            pageAtionFour:{
                pageTotal:0,
                paginationPage:1
            },
            pageSize:10,
            tableData:[],
            addressList:[],
            tableDetal:[],
            loading:false,
            cellPhone:'',
            selectData:'',
            dialogVisible:false,
            dialogVisibleTwo:false,
            dialogVisibleFour:false,
            addressId:2,
            type:1,
            currentStudyRecord:'',
            imgList:[],
            totalNums:0,
            tableExchange:[]
        };
    },
    components: {
        breadcrumb
    },
    watch: {},
    created() {
       this.getUserPlatformList(1);
    },
    methods: {
        search(){
            this.getUserPlatformList(1);
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getUserPlatformList(Number(num))
            }
        },
        childPageValueTwo(num){
            if(Number(num)>0){
                this.getAddressList(Number(num))
            }
        },
        childPageValueThree(num){
            if(Number(num)>0){
                this.getUserDetailEven(Number(num));
            }
        },
        childPageValueFour(num){
            if(Number(num)>0){
                this.getExchangeList(Number(num));
            }
        },
        edit(data,type){
            this.selectData = data;
            if(type==1){
                this.dialogVisibleTwo=true;
                this.getUserDetailEven(1);
            }else if(type==2){
                this.getAddressList(1);
                this.dialogVisible=true;
            }else{
                this.getExchangeList(1);
            }
        },
        //详情筛选
        selectOneEven(type){
            this.addressId=type;
            this.getUserDetailEven(1);
        },
        //详情筛选
        selectTwoEven(type){
            this.type=type;
            this.getUserDetailEven(1);
        },
        //获取地址
        getAddressList(num){          
            let query = {
                params:{
                    pageNo:num||1,
                    pageSize:this.pageSize,
                    userId:this.selectData.userId
                }
            }
            this.$http.get(this.$server.h5AddressList,query).then(res=>{
                if(res.status==200){
                    var contentdate = res.content;
                    this.addressList = contentdate.list;
                    this.pageAtionTwo.pageTotal = contentdate.total;
                    this.pageAtionTwo.paginationPage = num;
                    this.$nextTick(()=>{
                        this.loading = false; 
                    }) 
                }
            })            
        },
        //获取地址
        getExchangeList(num){          
            let query = {
                params:{
                    pageNo:num||1,
                    pageSize:this.pageSize
                }
            }
            this.tableExchange=[];
            this.$http.get(this.$server.getExchangeRecord+this.selectData.userId,query).then(res=>{
                if(res.status==200){
                    var contentdate = res.content;
                    this.tableExchange = contentdate.list;
                    this.pageAtionFour.pageTotal = contentdate.total;
                    this.pageAtionFour.paginationPage = num;
                    this.dialogVisibleFour = true;
                }
            })            
        },
        getUserDetailEven(num){        
            let query = {
                params:{
                    pageNo:num||1,
                    pageSize:this.pageSize,
                    userId:this.selectData.userId,
                    addressId:this.addressId,
                    type:this.type
                }
            }
            this.$http.get(this.$server.h5InteractUserDetail,query).then(res=>{
                if(res.status==200){
                    let contens = res.content;
                    this.currentStudyRecord = contens.currentStudyRecord;
                    if(this.type==1){
                        this.tableDetal = contens.starRecords.list;
                        this.pageAtionThree.pageTotal = contens.starRecords.total;
                        this.pageAtionThree.paginationPage = num;   
                        this.totalNums = contens.totalStarNum;
                    }else if(this.type==2){
                        this.tableDetal = contens.intellectRecords.list;
                        this.pageAtionThree.pageTotal = contens.intellectRecords.total;
                        this.pageAtionThree.paginationPage = num;    
                        this.totalNums = contens.totalIntellectNum;
                    }else{
                        this.imgList = contens.medalRecords;
                    }
                }
            })             
        },
        /**
         * 获取列表数据
         */
        getUserPlatformList(num){
            let query = {
                params:{
                    pageNo:num||1,
                    pageSize:this.pageSize,
                    cellphone:this.cellPhone
                }
            }
            this.$http.get(this.$server.h5InteractUserList,query).then(res=>{
                if(res.status==200){
                    var contentdate = res.content;
                    this.tableData = contentdate.list;
                    this.pageAtion.pageTotal = contentdate.total;
                    this.pageAtion.paginationPage = num;
                    this.$nextTick(()=>{
                        this.loading = false; 
                    }) 
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
    .H5-user-wrap {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .dialogOne{
            .editBox{
                max-height: 300px;
                overflow-y: auto;
                margin:10px;
                .addressBox{
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 15px;
                    margin-bottom: 15px;
                    .rowcss{
                        display:flex;
                        justify-content:flex-start;
                        flex-direction: row;
                        align-items: flex-start;
                        div{
                            margin-bottom: 20px;
                            padding: 5px;
                        }
                        div:nth-child(1){
                           width:100px;
                        }
                    }
                }
            }   
            .blocks{
                text-align: center;
                margin-top:20px;
                padding-bottom:20px;
            }
        }   
        .dialogTwo{            
            .active{
                background:#9E0E00;
                color:#fff;
            }
            .imgBox{
                overflow: hidden;
                // display: flex;
                // flex-direction: row;
                // justify-content:space-around;
                // align-items: center;
                .imgBoxList{
                    width:23%;
                    float: left;
                    padding-bottom: 10px;
                    img{
                        display: block;
                        width: 100%;
                    }
                    p{
                        text-align: center;
                        padding:5px 0;
                    }
                }
                .imgBoxList:not(:nth-child(4n)){
                    margin-right: 2.6%;
                }
            }
            .ageCss,.tabsCss{
                display:flex;
                flex-direction: row;
                justify-content:flex-start;
                align-items: center;
                margin-bottom: 20px;
                div{
                    width:100px;
                    height: 30px;
                    text-align: center;
                    line-height:30px;
                    border-top: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;
                    border-left: 1px solid #ccc;
                    cursor: pointer;
                }
                div:last-child{
                     border-right: 1px solid #ccc;
                }
            }  
            .paressCss{
                margin-bottom: 20px;
            }
            .blocks{
                text-align: center;
                margin-top:20px;
                padding-bottom:20px;
            }
        }      
        .page-content {
            background: #fff;
            padding:20px 0;
            margin:20px 0;
            box-shadow: 0px 0px 9px #edf1f7;
            .editor-btn {
                color:#9E0E00;
                font-size: 14px;
                padding: 0;
                height: 36px;
                line-height: 36px;
            }
            .block{
                text-align: center;
                margin-top:60px;
                padding-bottom:60px;
            }
        }
    }

</style>

