<template>
    <div class="mini-setting-page">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="兑换设置" name="first">
                    <div class="rate-box">
                        <div class="rate-input">
                            设置金币兑换积分比例
                            <el-input v-model="settingData.goldExchangeRatio" disabled clearable/>
                        </div>
                        <p class="tips">
                            <span>默认10:1</span>
                            <el-button v-if="$authJudge('thekingofknowledge:setting:addsettinginfo')" type="primary" size="small" @click="dialogVisible1=true">修改</el-button>
                        </p>
                    </div>
                    <p class="page-tips">兑换明细</p>
                    <div class="search-area">
                        <div class="input-box">
                            <el-input v-model="cellphone" clearable placeholder="输入手机号查询"></el-input>
                        </div>
                        <div class="time-box">
                            <el-date-picker
                                v-model="beginAt"
                                type="datetime"
                                clearable
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="开始时间">
                            </el-date-picker>
                            <el-date-picker
                                v-model="endAt"
                                type="datetime"
                                clearable
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="结束时间">
                            </el-date-picker>
                        </div>
                        <el-button v-if="$authJudge('thekingofknowledge:setting:exportexchange')" style="float:right" type="primary" @click="exportEvent">导出</el-button>
                        <el-button v-if="$authJudge('thekingofknowledge:setting:select')" style="float:right;marginRight:10px" type="primary" @click="search">查询</el-button>
                    </div>
                    <div class="page-content">
                        <div class="my-table">
                            <el-table
                            v-loading="loading1"
                            :data="tableData1"
                            border
                            style="width: 100%">
                            <el-table-column
                                prop="cellphone"
                                label="手机号"
                                align="center"
                                min-width="40"/>
                            <el-table-column
                                prop="exchangeNum"
                                label="兑换数量"
                                align="center"
                                min-width="30"/>
                            <el-table-column
                                label="兑换比例"
                                align="center"
                                min-width="30">
                                <template slot-scope="scope">
                                    <p>{{scope.row.exchangeRatio}}:1</p>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="createdAt"
                                label="兑换时间"
                                align="center"
                                min-width="30"/>
                            </el-table>
                            <div class="block">
                                <el-pagination
                                    background
                                    :current-page.sync="pageNo1"
                                    :page-size="pageSize"
                                    :total="total1"
                                    layout="prev, pager, next"
                                />
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="段位设置" name="second">
                    <p class="page-tips">段位明细</p>
                    <div class="search-area">
                        <el-button v-if="$authJudge('thekingofknowledge:setting:addrank')" style="float:right" type="primary" @click="dialogVisible2=true">添加段位</el-button>
                    </div>
                    <div class="page-content">
                    <div class="my-table">
                        <el-table
                        v-loading="loading2"
                        :data="tableData2"
                        border
                        style="width: 100%">
                        <el-table-column
                            prop="rankName"
                            label="段位名称"
                            align="center"
                            />
                        <el-table-column
                            prop="rankDesc"
                            label="描述"
                            align="center"
                            />
                        <el-table-column
                            prop="rankHurdle"
                            label="关联升级关卡"
                            align="center"
                            />
                        <el-table-column
                            prop="peopleNum"
                            label="当前段位人数"
                            align="center"
                            />
                        <el-table-column
                            label="操作"
                            align="center"
                            min-width="90"
                        >
                            <template slot-scope="scope">
                                <div class="btn-box">
                                    <el-button v-if="$authJudge('thekingofknowledge:setting:editrank')" type="text" size="small" class="handle-btn" @click="editRankEvent(scope.row)">编辑</el-button>
                                    <el-button v-if="$authJudge('thekingofknowledge:setting:deleterank')" type="text" size="small" :disabled="scope.row.peopleNum>0" class="handle-btn" @click="delRankEvent(scope.row)">删除</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        </el-table>
                        <div class="block">
                            <el-pagination
                                background
                                :current-page.sync="pageNo2"
                                :page-size="pageSize"
                                :total="total2"
                                layout="prev, pager, next"
                            />
                        </div>
                    </div>
                </div>
                </el-tab-pane>
                <el-tab-pane label="金币设置" name="third">
                    <div v-loading="loading3">
                        <div class="gold-setting-list">
                            <div class="gold-setting-item" v-for="(item,index) in goldSettingData" :key="index">
                                <p class="title">{{item.title}}</p>
                                <div class="radio-box">
                                    <el-radio v-model="item.radio" :label="1">是</el-radio>
                                    <el-radio v-model="item.radio" :label="2">否</el-radio>
                                </div>
                                <div class="gold-num-box">
                                    <p class="des">输入金币数量</p>
                                    <el-input v-model="item.goldNum" :maxlength="item.maxlength" :disabled="item.radio==2"/>
                                    <p class="tips">{{item.tips}}</p>
                                </div>
                            </div>
                        </div>
                        <div class="btn-box">
                            <el-button v-if="$authJudge('thekingofknowledge:setting:addsettinginfo')" @click="goldSettingCancel">取消</el-button>
                            <el-button v-if="$authJudge('thekingofknowledge:setting:addsettinginfo')" type="primary" @click="goldSettingSure">确定</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="全局设置" name="fourth">
                    <div v-loading="loading4">
                        <div class="all-setting-list">
                            <div class="all-setting-item" v-for="(item,index) in allSettingData" :key="index">
                                <div v-if="item.type=='input'">
                                    <p class="title">{{item.title}}</p>
                                    <div class="value-box">
                                        <el-input v-model="item.value" :disabled="item.disabled" :maxlength="item.maxlength||10"/>
                                        <p class="tips">{{item.tips}}</p>
                                    </div>
                                </div>
                                <div v-if="item.type=='select'">
                                    <p class="title">{{item.title}}</p>
                                    <div class="value-box">
                                        <el-select v-model="item.value">
                                            <el-option
                                            v-for="item in 10"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                            </el-option>
                                        </el-select>
                                        <p class="tips">{{item.tips}}</p>
                                    </div>
                                </div>
                                <div v-if="item.type=='textarea'">
                                    <p class="title">{{item.title}}</p>
                                    <div class="value-box">
                                    <el-input
                                            type="textarea"
                                            :rows="10"
                                            resize="none"
                                            placeholder="请输入游戏说明"
                                            v-model="item.value">
                                        </el-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="btn-box">
                            <el-button v-if="$authJudge('thekingofknowledge:setting:addsettinginfo')" @click="allSettingCancel">取消</el-button>
                            <el-button v-if="$authJudge('thekingofknowledge:setting:addsettinginfo')" type="primary" @click="allSettingSure">确定</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="书籍邮寄" name="five">
                    <div class="search-area">
                        <div class="input-box">
                            <el-input v-model="phone" clearable placeholder="输入手机号查询"></el-input>
                        </div>
                        <el-button v-if="$authJudge('thekingofknowledge:setting:select')" type="primary" @click="searchAddress">查询</el-button>
                        <el-button v-if="$authJudge('thekingofknowledge:setting:exportaddress')" type="primary" @click="exportAddress" style="float:right">导出</el-button>
                    </div>
                    <div class="page-content">
                    <div class="my-table">
                        <el-table
                        v-loading="loading5"
                        :data="tableData5"
                        border
                        style="width: 100%">
                        <el-table-column
                            prop="cellphone"
                            label="账号"
                            align="center"
                            width="120"
                            />
                        <el-table-column
                            prop="awardContent"
                            label="书籍名称"
                            align="center"
                            show-overflow-tooltip
                            />
                        <el-table-column
                            prop="postCellphone"
                            label="收件人手机号"
                            align="center"
                            width="140"
                            />
                        <el-table-column
                            prop="postName"
                            label="收件人姓名"
                            align="center"
                            />
                        <el-table-column
                            prop="postAddress"
                            label="收件人地址"
                            align="center"
                            show-overflow-tooltip
                            />
                        <el-table-column
                            prop="createdAt"
                            label="提交时间"
                            align="center"
                            width="180"
                            />
                        <el-table-column
                            label="操作"
                            align="center"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <div class="btn-box">
                                    <el-button v-if="$authJudge('thekingofknowledge:setting:updateaddress')" type="text" size="small" class="handle-btn" :disabled="scope.row.status==1" @click="updateStatus(scope.row.id)">{{scope.row.status==1?'已邮寄':'邮寄'}}</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        </el-table>
                        <div class="block">
                            <el-pagination
                                background
                                :current-page.sync="pageNo5"
                                :page-size="pageSize"
                                :total="total5"
                                layout="prev, pager, next"
                            />
                        </div>
                    </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog
            title="兑换比例"
            :visible.sync="dialogVisible1"
            width="400px"
            custom-class="rate-dialog"
            center
            >
            <div>
                <el-input v-model="dialogRate" placeholder="请输入兑换比例" clearable/>
            </div>
            <p class="tips">只能输入10的整除倍数，最小10，最大1000</p>
            <div class="btn-box">
                <el-button @click="dialogVisible1 = false">取消</el-button>
                <el-button type="primary" @click="EditRate">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title=""
            :visible.sync="dialogVisible2"
            width="400px"
            custom-class="rank-dialog"
            center
            >
            <div class="rank-item">
                <label>段位名称</label>
                <el-input v-model="rankName" maxlength="4" clearable show-word-limit/>
            </div>
            <div class="rank-item">
                <label>描述</label>
                <el-input v-model="rankDesc" maxlength="20" clearable show-word-limit/>
            </div>
            <div class="rank-item">
                <label>选择关卡</label>
                <el-select v-model="rankHurdle" :disabled="rankPeopleNum>0">
                    <el-option
                    v-for="(item,index) in hurdleList"
                    :key="index"
                    :label="item.id"
                    :value="item.id"
                    :disabled="item.isRank===1"
                    >
                    </el-option>
                </el-select>
            </div>
            <div class="btn-box">
                <el-button @click="dialogVisible2 = false">取消</el-button>
                <el-button type="primary" @click="editRank">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken } from '@/utils/auth';
export default {
    components: {
        pagination,breadcrumb
    },
    data(){
        return{
            titleList:[
                {
                    name:'小程序知识达人王者',
                    pathInfo:'/answerMiniProgram/miniProgramSetting'
                },
                {
                    name:'小程序设置',
                    pathInfo:'/answerMiniProgram/miniProgramSetting'
                }
            ],
            activeName:'first',
            cellphone:'',
            beginAt:'',
            endAt:'',
            pageNo1: 1,
            pageSize: 10,
            total1: 10,
            tableData1: [],
            loading1: false,
            dialogVisible1:false,
            dialogRate:'',
            hurdleList:[],
            pageNo2: 1,
            total2: 10,
            tableData2: [],
            loading2: false,
            dialogVisible2:false,
            rankPeopleNum:0,
            rankName:'',
            rankDesc:'',
            rankHurdle:'',
            rankId:'',
            goldSettingData:[
                {title:'是否设置游戏初始赠送金币数量',radio:1,goldNum:200,tips:'默认赠送500金币,>0≤500'},
                {title:'是否设置游戏每日赠送金币数量',radio:1,goldNum:20,tips:'默认赠送20金币,>0≤500'},
                {title:'是否设置游戏每题答对赠送金币数量',radio:1,goldNum:2,tips:'默认赠送2金币,>0≤50'},
                {title:'是否设置游戏全部答对赠送金币数量',radio:1,goldNum:10,tips:'默认赠送10金币,>0≤50'},
                {title:'是否设置游戏扣除金币数量',radio:1,goldNum:20,tips:'默认扣除20金币,>0≤50'},
            ],
            allSettingData:[],
            settingData:{},
            loading3:false,
            loading4:false,
            phone:'',
            pageNo5: 1,
            total5: 10,
            tableData5: [],
            loading5: false,
        }
    },
    watch:{
        pageNo1(cur){
            if(cur>0){
                this.getGoldExchangeList()
            }
        },
        pageNo2(cur){
            if(cur>0){
                this.getRankList()
            }
        },
        pageNo5(cur){
            if(cur>0){
                this.getAddressList()
            }
        },
        dialogVisible1(cur){
            if(!cur){
                this.dialogRate = '';
            }else{
                this.dialogRate = this.settingData.goldExchangeRatio;
            }
        },
        dialogVisible2(cur){
            if(!cur){
                this.rankName = this.rankDesc = this.rankHurdle = this.rankId = '';
                this.rankPeopleNum = 0;
            }
        }
    },
    created(){
        this.getGoldExchangeList();
        this.getRankList();
        this.getSettingInfoDetail();
        this.getAddressList()
    },
    methods:{
        /**
         * 获取兑换列表
         */
        getGoldExchangeList(){
            if(this.beginAt!=''&&this.endAt!=''){
                if(new Date(this.beginAt).getTime()>new Date(this.endAt).getTime()){
                    this.$message.error('开始时间不能大于结束时间');
                    return;
                }
            }
            this.loading1 = true;
            const query = {
                params:{
                    cellphone:this.cellphone,
                    beginAt:this.beginAt,
                    endAt:this.endAt,
                    pageNo:this.pageNo1,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(this.$server.getGoldExchangeList,query).then(res=>{
                if(res.status==200){
                    this.tableData1 = res.content.list;
                    this.total1 = res.content.total;
                }
            }).finally(()=>{
                this.loading1 = false;
            })
        },
        search(){
            this.pageNo1 = 0;
            this.$nextTick(() => {
                this.pageNo1 = 1;
            })
        },
        EditRate(){
            if(this.dialogRate==''){
                this.$message.error('请输入兑换比例');
                return;
            }
            if(this.dialogRate<10||this.dialogRate>1000||(this.dialogRate%10)!=0){
                this.$message.error('请按照提示输入合法数值');
                return;
            }
            const loadingInstance = this.$loading({
                target:document.querySelector('.rate-dialog')
            });
            const query = Object.assign({},this.settingData,{goldExchangeRatio:this.dialogRate})
            this.$http.post(this.$server.addSettingInfo,query).then(res=>{
                if(res.status==200){
                    this.settingData.goldExchangeRatio = this.dialogRate;
                    this.dialogVisible1 = false;
                    this.$message.success('金币兑换比例修改成功');
                }
            }).finally(()=>{
                loadingInstance.close()
            })
        },
        exportEvent(){
            if(this.beginAt!=''&&this.endAt!=''){
                if(new Date(this.beginAt).getTime()>new Date(this.endAt).getTime()){
                    this.$message.error('开始时间不能大于结束时间');
                    return;
                }
            }
            let url = `${this.$server.downLoadGoldExchangeList}?cellphone=${this.cellphone||''}&beginAt=${this.beginAt||''}&endAt=${this.endAt||''}&token=${getToken()}`
            window.open(url);
        },
        /**
         * 获取关卡
         */
        getHurdleList(){
            const query = {
                params:{
                    pageNo:1,
                    pageSize:100,
                }
            }
            this.$http.get(this.$server.getHurdleList,query).then(res=>{
                if(res.status==200){
                    this.hurdleList = res.content.list;
                }
            })
        },
        /**
         * 获取段位列表
         */
        getRankList(){
            this.loading2 = true;
            const query = {
                params:{
                    pageNo:this.pageNo2,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(this.$server.getRankList,query).then(res=>{
                if(res.status==200){
                    this.tableData2 = res.content.list;
                    this.total2 = res.content.total;
                }
            }).finally(()=>{
                this.loading2 = false;
            })
            this.getHurdleList();
        },
        editRankEvent(obj){
            this.dialogVisible2 = true;
            this.rankId = obj.id;
            this.rankPeopleNum = obj.peopleNum;
            this.rankName = obj.rankName;
            this.rankDesc = obj.rankDesc;
            this.rankHurdle = obj.rankHurdle;
        },
        editRank(){
            if(this.rankName==''){
                this.$message.error('请输入段位名称');
                return;
            }
            if(this.rankDesc==''){
                this.$message.error('请输入段位描述');
                return;
            }
            if(this.rankHurdle==''){
                this.$message.error('请选择关联关卡');
                return;
            }
            const loadingInstance = this.$loading({
                target:document.querySelector('.rank-dialog')
            });
            const query = {
                rankName:this.rankName,
                rankDesc:this.rankDesc,
                rankHurdle:this.rankHurdle
            }
            if(this.rankId==''){
                this.$http.post(this.$server.addRank,query).then(res=>{
                    if(res.status==200){
                        this.$message.success('段位添加成功');
                        this.pageNo2 = 0;
                        this.$nextTick(()=>{
                            this.pageNo2 = 1;
                        })
                    }
                }).finally(()=>{
                    this.dialogVisible2 = false;
                    loadingInstance.close()
                })
            }else{
                query.id = this.rankId;
                this.$http.post(this.$server.updateRank,query).then(res=>{
                    if(res.status==200){
                        this.$message.success('段位修改成功');
                        this.pageNo2 = 0;
                        this.$nextTick(()=>{
                            this.pageNo2 = 1;
                        })
                    }
                }).finally(()=>{
                    this.dialogVisible2 = false;
                    loadingInstance.close()
                })
            }
        },
        delRankEvent(obj){
            this.$confirm('确定当前段位？', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'none',
                center: true
                }).then(() => {
                    const query = {
                        params:{}
                    }
                    this.$http.post(`${this.$server.deleteRank}/${obj.id}`,query).then(res=>{
                        if(res.status==200){
                            this.$message.success('段位删除成功');
                            this.pageNo2 = 0;
                            this.$nextTick(()=>{
                                this.pageNo2 = 1;
                            })
                        }
                    }).finally(()=>{

                    })
                }).catch(() => {

                });
        },
        /**
         * 获取所有设置
         */
        getSettingInfoDetail(){
            const query = {
                params:{}
            }
            this.$http.get(this.$server.getSettingInfoDetail,query).then(res=>{
                if(res.status==200){
                    this.settingData = res.content;
                    this.goldSettingData = [
                        {title:'是否设置游戏初始赠送金币数量',radio:this.settingData.initialGoldStatus,goldNum:this.settingData.initialGoldNum,tips:'默认赠送500金币,>0≤500',maxlength:3},
                        {title:'是否设置游戏每日赠送金币数量',radio:this.settingData.dayGoldStatus,goldNum:this.settingData.dayGoldNum,tips:'默认赠送20金币,>0≤500',maxlength:3},
                        {title:'是否设置游戏每题答对赠送金币数量',radio:this.settingData.questionGoldStatus,goldNum:this.settingData.questionGoldNum,tips:'默认赠送2金币,>0≤50',maxlength:2},
                        {title:'是否设置游戏全部答对赠送金币数量',radio:this.settingData.gameGoldStatus,goldNum:this.settingData.gameGoldNum,tips:'默认赠送10金币,>0≤50',maxlength:2},
                        {title:'是否设置游戏扣除金币数量',radio:this.settingData.gameDeductGoldStatus,goldNum:this.settingData.gameDeductGoldNum,tips:'默认扣除20金币,>0≤50',maxlength:2},
                    ]
                    this.allSettingData = [
                        {title:'设置每局玩多少题',value:this.settingData.gameQuestionNum,disabled:true,tips:'默认5题,不可更改',type:'input'},
                        {title:'设置每题得多少分',value:this.settingData.questionFraction,disabled:false,tips:'默认30分,>0≤50',type:'input',maxlength:2},
                        {title:'设置题目全部答对得多少分',value:this.settingData.gameFraction,disabled:false,tips:'默认30分,0≤50,0为不加分',type:'input',maxlength:2},
                        {title:'设置每关总得分多少升1级',value:this.settingData.levelUpFraction,disabled:false,tips:'默认750分,>0≤900',type:'input',maxlength:3},
                        {title:'设置答题时间',value:this.settingData.eachQuestionTime,disabled:false,tips:'统一默认10秒',type:'select'},
                        {title:'游戏说明',value:this.settingData.gameDesc,type:'textarea'},
                    ]
                }
            })
        },
        goldSettingCancel(){
            this.goldSettingData = [
                {title:'是否设置游戏初始赠送金币数量',radio:this.settingData.initialGoldStatus,goldNum:this.settingData.initialGoldNum,tips:'默认赠送500金币,>0≤500',maxlength:3},
                {title:'是否设置游戏每日赠送金币数量',radio:this.settingData.dayGoldStatus,goldNum:this.settingData.dayGoldNum,tips:'默认赠送20金币,>0≤500',maxlength:3},
                {title:'是否设置游戏每题答对赠送金币数量',radio:this.settingData.questionGoldStatus,goldNum:this.settingData.questionGoldNum,tips:'默认赠送2金币,>0≤50',maxlength:2},
                {title:'是否设置游戏全部答对赠送金币数量',radio:this.settingData.gameGoldStatus,goldNum:this.settingData.gameGoldNum,tips:'默认赠送10金币,>0≤50',maxlength:2},
                {title:'是否设置游戏扣除金币数量',radio:this.settingData.gameDeductGoldStatus,goldNum:this.settingData.gameDeductGoldNum,tips:'默认扣除20金币,>0≤50',maxlength:2},
            ]
        },
        goldSettingSure(){
            if((this.goldSettingData[0].radio==1&&this.goldSettingData[0].goldNum>500)||(this.goldSettingData[0].radio==1&&this.goldSettingData[0].goldNum==0)){
                this.$message.error('游戏初始赠送金币数量不能大于500,不能为0');
                return;
            }
            if(this.goldSettingData[0].radio==1&&this.goldSettingData[0].goldNum==''){
                this.$message.error('游戏初始赠送金币数量不能为空');
                return;
            }
            if((this.goldSettingData[1].radio==1&&this.goldSettingData[1].goldNum>500)||this.goldSettingData[1].radio==1&&this.goldSettingData[1].goldNum==0){
                this.$message.error('游戏每日赠送金币数量不能大于500,不能为0');
                return;
            }
            if(this.goldSettingData[1].radio==1&&this.goldSettingData[1].goldNum==''){
                this.$message.error('游戏每日赠送金币数量不能为空');
                return;
            }
            if((this.goldSettingData[2].radio==1&&this.goldSettingData[2].goldNum>50)||(this.goldSettingData[2].radio==1&&this.goldSettingData[2].goldNum==0)){
                this.$message.error('游戏每题答对赠送金币数量不能大于50,不能为0');
                return;
            }
            if(this.goldSettingData[2].radio==1&&this.goldSettingData[2].goldNum==''){
                this.$message.error('游戏每题答对赠送金币数量不能为空');
                return;
            }
            if((this.goldSettingData[3].radio==1&&this.goldSettingData[3].goldNum>50)||(this.goldSettingData[3].radio==1&&this.goldSettingData[3].goldNum==0)){
                this.$message.error('游戏全部答对赠送金币数量不能大于50,不能为0');
                return;
            }
            if(this.goldSettingData[3].radio==1&&this.goldSettingData[3].goldNum==''){
                this.$message.error('游戏全部答对赠送金币数量不能为空');
                return;
            }
            if((this.goldSettingData[4].radio==1&&this.goldSettingData[4].goldNum>50)||(this.goldSettingData[4].radio==1&&this.goldSettingData[4].goldNum==0)){
                this.$message.error('游戏扣除金币数量不能大于50,不能为0');
                return;
            }
            if(this.goldSettingData[4].radio==1&&this.goldSettingData[4].goldNum==''){
                this.$message.error('游戏扣除金币数量不能为空');
                return;
            }
            this.loading3 = true;
            const query = Object.assign({},this.settingData,{
                initialGoldStatus:this.goldSettingData[0].radio,
                initialGoldNum:this.goldSettingData[0].goldNum,
                dayGoldStatus:this.goldSettingData[1].radio,
                dayGoldNum:this.goldSettingData[1].goldNum,
                questionGoldStatus:this.goldSettingData[2].radio,
                questionGoldNum:this.goldSettingData[2].goldNum,
                gameGoldStatus:this.goldSettingData[3].radio,
                gameGoldNum:this.goldSettingData[3].goldNum,
                gameDeductGoldStatus:this.goldSettingData[4].radio,
                gameDeductGoldNum:this.goldSettingData[4].goldNum,
            })
            this.$http.post(this.$server.addSettingInfo,query).then(res=>{
                if(res.status==200){
                    this.$message.success('金币设置成功');
                    this.getSettingInfoDetail();
                }
            }).finally(()=>{
                this.loading3 = false;
            })
        },
        allSettingCancel(){
            this.allSettingData = [
                {title:'设置每局玩多少题',value:this.settingData.gameQuestionNum,disabled:true,tips:'默认5题,不可更改',type:'input'},
                {title:'设置每题得多少分',value:this.settingData.questionFraction,disabled:false,tips:'默认30分,>0≤50',type:'input',maxlength:2},
                {title:'设置题目全部答对得多少分',value:this.settingData.gameFraction,disabled:false,tips:'默认30分,0≤50,0为不加分',type:'input',maxlength:2},
                {title:'设置每关总得分多少升1级',value:this.settingData.levelUpFraction,disabled:false,tips:'默认750分,>0≤900',type:'input',maxlength:3},
                {title:'设置答题时间',value:this.settingData.eachQuestionTime,disabled:false,tips:'统一默认10秒',type:'select'},
                {title:'游戏说明',value:this.settingData.gameDesc,type:'textarea'},
            ]
        },
        allSettingSure(){
            if(this.allSettingData[1].value>50||this.allSettingData[1].value==0){
                this.$message.error('每题得分应该>0≤50');
                return;
            }
            if(this.allSettingData[1].value==''){
                this.$message.error('请设置每题得分');
                return;
            }
            if(this.allSettingData[2].value>50){
                this.$message.error('全部答对得分不能大于50');
                return;
            }
            if(this.allSettingData[2].value==''){
                this.$message.error('请设置全部答对得分');
                return;
            }
            if(this.allSettingData[3].value>900||this.allSettingData[3].value==0){
                this.$message.error('升级得分应该>0≤900');
                return;
            }
            if(this.allSettingData[3].value==''){
                this.$message.error('请设置升级得分');
                return;
            }
            this.loading4 = true;
            const query = Object.assign({},this.settingData,{
                questionFraction:this.allSettingData[1].value,
                gameFraction:this.allSettingData[2].value,
                levelUpFraction:this.allSettingData[3].value,
                eachQuestionTime:this.allSettingData[4].value,
                gameDesc:this.allSettingData[5].value
            })
            this.$http.post(this.$server.addSettingInfo,query).then(res=>{
                if(res.status==200){
                    this.$message.success('全局设置成功');
                    this.getSettingInfoDetail();
                }
            }).finally(()=>{
                this.loading4 = false;
            })
        },
        getAddressList(){
            this.loading5 = true;
            const query = {
                params:{
                    cellphone:this.phone,
                    pageNo:this.pageNo5,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(this.$server.getAddressList,query).then(res=>{
                if(res.status==200){
                    this.tableData5 = res.content.list;
                    this.total5 = res.content.total;
                }
            }).finally(()=>{
                this.loading5 = false;
            })
        },
        searchAddress(){
            this.pageNo5 = 0;
            this.$nextTick(()=>{
                this.pageNo5 = 1;
            })
        },
        exportAddress(){
            let url = `${this.$server.exportAddressList}?cellphone=${this.phone||''}&token=${getToken()}`
            window.open(url);
        },
        updateStatus(id){
            this.loading5 = true;
            this.$http.post(`${this.$server.updateStatus}/${id}`,{}).then(res=>{
                if(res.status==200){
                    this.$message.success('邮寄状态更新成功');
                    this.searchAddress()
                }
            }).finally(()=>{
                this.loading5 = true;
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .mini-setting-page{
        .page-header {
            background: #fff;
            padding: 30px 30px 38px 20px;
            margin-bottom: 26px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            .page-title {
                font-size: 18px;
                color: rgba(56, 65, 86, 1);
                margin-bottom: 20px;
            }
            /deep/ .el-tabs{
                margin-top:10px;
            }
            .rate-box{
                margin:0 0 20px 0;
                .rate-input{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 16px;
                    /deep/ .el-input{
                        width: 80px;
                        text-align: center;
                    }
                }
                .tips{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 12px;
                }
            }
            .search-area{
                overflow: hidden;
                >div{
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 20px;
                }
                .input-box{
                    width: 180px;
                }
                .el-date-editor{
                    width: 200px;
                    margin-right: 20px;
                }
            }
            .page-tips{
                margin:0 0 20px 0;
            }
        }
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            margin-top:20px;
            .block{
                text-align: center;
                margin-top:60px;
                padding-bottom:60px;
            }
        }
        .rate-dialog{
            .tips{
                margin:15px 0;
            }
            .btn-box{
                text-align: center;
            }
        }
        .gold-setting-list{
            .gold-setting-item{
                margin:20px 0;
                .title{
                    font-size: 18px;
                    line-height: 1;
                }
                .radio-box{
                    margin:15px 0 5px;
                    /deep/ .el-radio{
                        margin-right: 30px;
                    }
                }
                .gold-num-box{
                    font-size:0;
                    .des{
                        font-size: 14px;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    /deep/ .el-input{
                        display: inline-block;
                        vertical-align: middle;
                        margin:0 20px 0 10px;
                        width: 100px;
                        input{
                            text-align: center;
                        }
                    }
                    .tips{
                        display: inline-block;
                        vertical-align: middle;
                        color:#999;
                        font-size: 12px;
                    }
                }
            }
        }
        .all-setting-list{
            .all-setting-item{
                margin:20px 0;
                .title{
                    font-size: 18px;
                    line-height: 1;
                }
                .value-box{
                    font-size:0;
                    margin-top:10px;
                    /deep/ .el-input{
                        display: inline-block;
                        vertical-align: middle;
                        margin:0 20px 0 10px;
                        width: 100px;
                        input{
                            text-align: center;
                        }
                    }
                    .tips{
                        display: inline-block;
                        vertical-align: middle;
                        color:#999;
                        font-size: 12px;
                    }
                }
            }
        }
        .rank-dialog{
            .rank-item{
                margin:20px 0;
                label{
                    display: inline-block;
                    vertical-align: middle;
                    font-size:16px;
                    width: 80px;
                }
                /deep/ .el-input{
                    display: inline-block;
                    vertical-align: middle;
                    width: 250px;
                }
            }
        }
        .btn-box{
            text-align: center;
        }
    }
</style>
