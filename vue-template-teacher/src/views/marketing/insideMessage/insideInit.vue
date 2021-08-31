<template>
    <div>
        <template v-if="headShow">
            <gxHead :headObj='headObj' v-on:inputValPortEven="inputStateVal" v-on:dialogChange="changeRouter"></gxHead>
        </template>
        <el-row type="flex" class="lMarginTop20">
            <el-col :span="11">
                <el-row>
                    <el-col class="lMarginBO10">
                        <el-row class="lLine40">
                            <el-col :span="4" class="lSize18">用户列表</el-col>
                            <el-col :span="18" :offset="1">
                                <el-row>
                                    <el-col :span="6" class="lCenter-r lSize16">渠道选择 : </el-col>
                                    <el-col :span="13">
                                        <el-select v-model="value" placeholder="状态" @change="chooseVersionType">
                                            <el-option
                                            v-for="(item,index) in channelList"
                                            :key="index"
                                            :label="item.name"
                                            :value="item.channelId">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="4" v-if="$authJudge('admin:mail:selectuser')" :offset="1"><el-button type="warning"  @click="findInfo">查询</el-button></el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col>
                        <gxTable :tableDatas="tableObj" :rowEven="true" v-on:scrollTopChange="scrollTopPushData" v-on:rowEvenChange="rowEvenChangeId"></gxTable>
                    </el-col>
                    <el-col class="allSelectCss">
                        <el-checkbox @change="userChooseEven" v-model="checked">全选</el-checkbox>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="11" :offset="2">
                <el-row>
                    <el-col class="lSize18 lMarginBO20">收信人列表</el-col>
                    <el-col>
                        <gxTable :tableDatas="tableObjNext" :rowEven="false" v-on:pathRouterPage="Routerpage"></gxTable>
                    </el-col>
                    <el-col>
                        <el-row class="allSelectCss">
                            <el-col :span="3">
                                <el-checkbox v-model="checked1">全选</el-checkbox>
                            </el-col>
                            <el-col :span="2" class="lCenter-r" style="cursor: pointer;">
                                <div @click="userDeleteChooseEven">删除</div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <el-col class="lMarginTop20 backColorCss">
            <el-row class="allSelectCss">
                <el-col :span="3" class="lSize14 lMarginL20">消息体</el-col>
            </el-row>
            <el-row class="lSize14 lMarginTop20">
                <el-col :span="2" class="lSize14 lMarginL30">类型</el-col>
                <el-col :span="12">
                    <el-row>
                        <el-col :span="3"><el-radio v-model="radio" label="1">链接</el-radio></el-col>
                        <el-col :span="3"><el-radio v-model="radio" label="2">课程</el-radio></el-col>
                        <!-- <el-col :span="3"><el-radio v-model="radio" label="3">活动</el-radio></el-col> -->
                        <el-col :span="3"><el-radio v-model="radio" label="4">无链接</el-radio></el-col>
                        <el-col :span="3" style="padding: 0 0 0 10px;"><el-radio v-model="radio" label="5">说说</el-radio></el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="lMarginTop20 lPaddingRF30">
                <el-col v-if="radio==1" :span="6" :offset="2"><el-input @blur="checkeven" v-model="input" placeholder="http://" clearable></el-input></el-col>
                <el-col v-else-if="radio==2" :span="6" :offset="2"><el-input @blur="checkeven" v-model="input" placeholder="请输入课程ID"></el-input></el-col>
                <!-- <el-col v-else-if="radio==3" :span="6" :offset="2"><el-input @blur="checkeven" v-model="input" placeholder="请输入活动ID"></el-input></el-col> -->
                <el-col v-else-if="radio==5" :span="6" :offset="2"><el-input @blur="checkeven" v-model="input" placeholder="请输入说说ID"></el-input></el-col>
                <el-col class="lMarginTop20" :span="20" :offset="2"><el-input maxlength="60" :rows="4" type="textarea" v-model="textareaInfo" placeholder="请输入内容"></el-input></el-col>
            </el-row>
            <el-row class="send-type lLine40">
                <el-col :span="2" class="lSize14 lMarginL10">发送类型</el-col>
                <el-col :span="12" class="lPaddingRF10">
                    <el-row>
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox label="1">站内信</el-checkbox>
                            <el-checkbox label="2">APP推送</el-checkbox>
                            <!-- <el-checkbox label="3">手机短信</el-checkbox> -->
                        </el-checkbox-group>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="send-time">
                <el-col :span="2" class="lSize14 lMarginL10">发送时限</el-col>
                <el-col :span="20" class="lPaddingRF10">
                    <el-row>
                        <el-radio v-model="sendType" label="2">定时发送</el-radio>
                        <el-date-picker
                            v-model="schedulerTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            clearable
                            size="small"
                            :default-value="defaultValue"
                            :disabled="sendType=='1'?true:false"
                            :picker-options="{
                            disabledDate: time => {
                                    return time.getTime() < Date.now() - 3600 * 1000 * 24

                                },
                                selectableRange:timeRange
                            }"
                            placeholder="选择日期时间">
                        </el-date-picker>
                        <div style="marginTop:10px">
                            <el-radio v-model="sendType" label="1">立即发送</el-radio>
                        </div>
                    </el-row>
                </el-col>


            </el-row>
            <el-button v-if="$authJudge('admin:mail:send')" type="primary" class="send-btn" @click="submitForm">发送</el-button>
        </el-col>
        <el-dialog
        title="温馨提示"
        :visible.sync="dialogMyself.dialogVisible"
        width="30%">
                <el-row class="lCenter-r">
                    <el-col v-if="dialogMyself.warryBool==1">
                        <el-row>
                            <el-col class="lMarginBO20">
                                <i class="el-icon-success lSize30 greenColor"></i>
                            </el-col>
                            <el-col>已全部移入</el-col>
                        </el-row>
                    </el-col>
                    <el-col v-if="dialogMyself.warryBool==2">
                        <el-row>
                            <el-col class="lMarginBO20">
                                 <i class="el-icon-error lSize30 redFontColor"></i>
                            </el-col>
                            <el-col>已全部移入失败</el-col>
                        </el-row>
                    </el-col>
                    <el-col  v-if="dialogMyself.warryBool==3">
                        <el-row>
                            <el-col class="lMarginBO20">
                                <i class="el-icon-error lSize30 redFontColor"></i>
                            </el-col>
                             <el-col>收信人列表最多1000人已达到用户数，无法移入</el-col>
                        </el-row>
                    </el-col>
                    <el-col v-if="dialogMyself.warryBool==4">
                        <el-row>
                            <el-col class="lMarginBO20">
                                <i class="el-icon-error lSize30 redFontColor"></i>
                            </el-col>
                            <el-col>收信人列表为空，不能发送信息</el-col>
                        </el-row>
                    </el-col>
                </el-row>
        </el-dialog>
        <Dialog
                :showFlag.sync="editsObj.showFlag"
                :title="editsObj.title"
                :cancelName="editsObj.cancelName"
                :sureName="editsObj.sureName"
                v-on:editObjNos="couponEditObjNo"
                v-on:editObjOks="couponEditObjOk">
                <el-row slot="dialog-body" class="lLine30">
                    <el-col class="lCenter-r">
                          您有未保存的信息，离开会丢失，确定要离开吗？
                    </el-col>
                </el-row>
        </Dialog>
    </div>
</template>
<script>
import gxHead from "@/components/formSynthesisPlugin/gxHead";
import gxTable from "@/components/formSynthesisPlugin/gxTable";
import Dialog from "@/components/myDialog/myDialog";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import eventAction from '../../lEventAtion';
let actions = new eventAction()
const formatDate = (time,flag)=>{
    const y = time.getFullYear();
    let mm = time.getMonth()+1;
    let d = time.getDate();
    mm = mm<10?('0'+mm):mm;
    d = d<10?('0'+d):d;
    let h =time.getHours();
    let m =time.getMinutes();
    let s =time.getSeconds();
    h = h<10?("0"+h):h;
    m = m<10?("0"+m):m;
    s = s<10?("0"+s):s;
    if(flag==1){
        return y+'-'+mm+'-'+d;
    }else if(flag==2){
        return h+":"+m+":"+s;
    }else{
        return y+'-'+mm+'-'+d+' '+h+":"+m+":"+s
    }
}
export default {
    components:{
        gxHead,
        gxTable,
        Dialog,
        breadcrumb
    },
    data(){
        return {
            checked:false,
            checked1:false,
            tableObj:{
                tableData:[],
                markState:false,
                loading:true,
                types:"insideInit1",
                height:true,
                imgCss:{
                    roundBoll:true,
                    squareBoll:false
                },
                power:[]
            },
            tableObjNext:{
                tableData:[],
                // 1.编辑，2.下架，3.详情，4.排序
                marksArrs:[
                    {name:"删除",type:1}
                    ],
                markState:true,
                loading:true,
                minWidth:40,
                types:"insideInit",
                height:true,
                imgCss:{
                    roundBoll:true, //图片显示圆形;
                    squareBoll:false //图片显示放形;
                }
            },
            // pageAtion:{},
            headObj:{
                typeBoll:true,
                name:'insideName',
                title:'历史记录',
                menuList:[
                        {
                            name:'APP管理系统',
                            pathInfo:''
                        },
                        {
                            name:'站内信',
                            pathInfo:''
                        }
                ],
                listType:{
                    listValOne:[

                    ],
                    listValTwo:[
                        {label:'全部',value:'-1'},
                        {label:'男',value:'1'},
                        {label:'女',value:'0'},
                        {label:'保密',value:'2'},
                    ]
                }

            },
            dataStart:'',//开始时间
            dataEnd:'', //结束时间
            loginBeginAt:'',
            loginEndAt:'',
            titleVal:'',//搜索输入值
            radio:"1", //类型
            radio1:'1', //发送类型
            input:'', //值
            textarea:'', //输入值
            lockBool:true, //下滑锁
            pageSizes:20, //每页的数量；
            pageNo:1,
            textareaInfo:'', //输入内容
            checkList:[],
            hasNextPage:true,
            gender:'',
            interestId:'',
            checkEverType:{
                one:0,
                two:0,
                three:0
            },
            dialogMyself:{
                dialogVisible:false,
                warryBool:1
            },
            listDataChangeBool:true,
            editsObj:{
                showFlag:false, //是否显示遮罩弹框；
                title:"温馨提示", //Dialog 的标题
                cancelName:'editObjNos', //自定义取消事件名字
                sureName:'editObjOks', //自定义确定事件名字,
            },
            toPath:{},
            //渠道管理
            value:null,
            channelList:'',
            handle:false,
            sendType:'1',
            schedulerTime:'',
            timeRange:'',
            disabledState:false,
            defaultValue:new Date(),
            headShow:true,
    }},

    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }
        this.tableObj.power = flag;
        var self = this;
        self.tableObj.loading = true;
        self.channelTypeListDate();
        this.showData({pageSize:self.pageSizes ,pageNo: this.pageNo});
        this.getInterestList()
    },
    props:{},
    computed:{
        tableData(){
            return this.tableObjNext.tableData;
        },
        dialogVisible(){
            return this.dialogMyself.dialogVisible
        }
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        if(!this.handle){
            next();
            return false;
        }
        if(!this.listDataChangeBool){
            //next方法传true或者不传为默认历史返回，传false为不执行历史回退
            this.editsObj.showFlag = true;
            this.toPath = to;
            next(false);
        }else{
            next();
        };
    },
    methods:{
        //查询渠道Id
        findInfo(){
            var self = this;
            self.tableObj.loading = true;
            this.pageNo = 1;
            this.lockBool = true;
            this.hasNextPage = true;
            this.$nextTick(()=>{
                document.querySelector(".tableDiv .el-table__body-wrapper").scrollTop = 0
                this.showData({channelId:this.value,pageSize:self.pageSizes ,pageNo: this.pageNo,beginAt:actions.formatDate(self.dataStart),endAt:actions.formatDate(self.dataEnd),loginBeginAt:actions.formatDate(self.loginBeginAt),loginEndAt:actions.formatDate(self.loginEndAt),userPhone:self.titleVal});
            })

        },
        //渠道类型数据
        channelTypeListDate(){
            var self = this;
            self.$http.get(self.$server.channelListName).then(res=>{
                if(res.status){
                    self.channelList = res.content;
                }
            })
        },
        //渠道管理
        chooseVersionType(e){
            this.value = e;
        },
        couponEditObjOk(){
            var self = this;
            self.listDataChangeBool=true;
            self.$router.push({path:self.toPath.path});
        },
        couponEditObjNo(){
            this.editsObj.showFlag = false;
        },
        //表头输入信息过滤
        inputStateVal(valobj){
            var self = this;
            self.tableObj.loading = true;
            this.dataStart =valobj.dataStart;
            this.dataEnd = valobj.dataEnd;
            this.gender = valobj.status1||'';
            this.interestId = valobj.status||''
            this.loginBeginAt =valobj.loginBeginAt;
            this.loginEndAt = Number(valobj.loginEndAt)>0?((Number(valobj.loginEndAt)-Number(self.loginBeginAt))==86399000?actions.formatDate(Number(valobj.loginEndAt)):actions.formatDate(Number(valobj.loginEndAt)+86399000)):'',
            this.titleVal =valobj.title;
            this.pageNo = 1;
            this.lockBool = true;
            this.hasNextPage = true;
            this.$nextTick(()=>{
                document.querySelector(".tableDiv .el-table__body-wrapper").scrollTop = 0
                this.showData({channelId:this.value,pageSize:self.pageSizes ,pageNo:this.pageNo,beginAt:actions.formatDate(self.dataStart),endAt:actions.formatDate(self.dataEnd),loginBeginAt:actions.formatDate(self.loginBeginAt),loginEndAt:actions.formatDate(self.loginEndAt),userPhone:self.titleVal});
            })
        },
        //表格组件数据传递，删除;
        Routerpage(obj){
            if(obj.type==1){
                let index = this.tableObj.tableData.findIndex(item=>item.id==obj.data.id);
                if(index<0){
                    this.tableObj.tableData.unshift(obj.data)
                    this.tableObj.tableData.forEach((item,index)=>{
                        item.sortId = index+1;
                    })
                }
                let _index = this.tableObjNext.tableData.findIndex(item=>item.id==obj.data.id)
                this.tableObjNext.tableData.splice(_index,1)
                this.tableObjNext.tableData.forEach((item,index)=>{
                    item.sortId = index+1;
                })
                this.checked = false;
                this.checked1 = false;
            }
            // var arrys1 = [];
            // var arrys2 = [];
            // switch (obj.type) {
            //     case 1:
            //     this.tableObjNext.tableData.forEach(element => {
            //         if(element.id!=obj.id){
            //             arrys1.push(element);
            //         }else{
            //             arrys2.push(element)
            //         }
            //     });
            //     this.tableObjNext.tableData = arrys1;
            //     this.tableObj.tableData = arrys2.concat(this.tableObj.tableData);
            //     this.checked = false;
            //     this.checked1 = false;
            //     break;
            //     default:
            //         break;
            // }
        },
       showData(paramsObj){
            var self = this;
            var url = '/appUser/selectUserListForMessage';
            if(this.gender!=''){
                paramsObj.gender = Number(this.gender)
            }
            if(this.interestId!=''){
                paramsObj.interestId = this.interestId;
            }
            actions.getData(url,paramsObj)
                .then(data => {
                    let obhArr = actions.tableHead.inside;
                    let endObj=actions.filterData(data,obhArr);
                    self.tableObj.tableData = endObj.tableObj.tableData;
                    self.tableObj.tableData.forEach((item,index)=>{
                        item.sortId = (this.pageNo-1)*this.pageSizes+index+1;
                    })
                    self.$nextTick(function(){
                            self.tableObj.loading = false;
                            self.tableObjNext.loading = false;
                    })
                })
                .fail(function(){
                    self.$nextTick(function(){
                            self.tableObj.loading = false;
                            self.tableObjNext.loading = false;
                    })
                    }
                );
        },
        submitForm(){
            var self = this;
            var bool = true;
            if(self.tableObjNext.tableData.length==0&&!self.checked){
                    self.dialogMyself.dialogVisible = true;
                    self.dialogMyself.warryBool = 4;
                    return;
            }
            var url = '/message/sendMessage';
            var radioNum = self.radio;
            var checkObj = self.checkList;
            if(!self.checked){
                var idArry = JSON.stringify(self.getDataId(self.tableObjNext.tableData));
            }else{
                var idArry =[];
            }
            if(!self.textareaInfo){
               self.$message.error('内容不能为空，请输入内容!');
               return;
            }
            if(checkObj.length==0){
               self.$message.error('请选择发送类型!');
               return;
            }
            if(radioNum=='1'&&self.input==''){
                self.$message.error('请输入链接地址!');
                return;
            }
            if(radioNum=='2'&&self.input==''){
                self.$message.error('请输入课程ID!');
                return;
            }
            if(radioNum=='3'&&self.input==''){
                self.$message.error('请输入活动ID!');
                return;
            }
            let checktest = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if(radioNum=='1'&&!checktest.test(this.input)){
                self.$message.error('链接地址格式错误!');
                return;
            }
            if(this.sendType=='2'&&this.schedulerTime==''){
                this.$message.error('请选择发送时间!');
                return;
            }
            var paramsObj={
                receiverType:self.checked==true?1:2,//选择用户方式 1全选 2非全选
                content:self.textareaInfo,//消息内容
                targetType:Number(radioNum),//目标类型 1链接，2课程，3活动，4无链接
                targetId:Number(radioNum)!=4?self.input:'',//目标ID（链接地址，课程id,活动id)
                letterMedium:self.checkEverType.one,//站内信媒介 0 不使用站内信 1 使用站内信
                pushMedium:self.checkEverType.two,//推送媒介 0 不使用极光推送 1 使用极光推送
                smsMedium:self.checkEverType.three,//短信媒介 0 不使用短信 1 使用短信
                userIds:idArry,//接受消息用户id 如果是多个，格式为：符合数组格式的字符串 注：如果receiverType为2，此字段必填
                userPhone:self.titleVal,//手机号
                beginAt:self.dataStart,//注册开始时间
                endAt:self.dataEnd,//注册结束时间
                loginBeginAt:self.loginBeginAt,
                loginEndAt:self.loginEndAt,
                schedulerTime:this.schedulerTime,
                sendType:this.sendType
            };
            self.tableObj.loading = true;
            if(!self.disabledState){
                self.disabledState = !self.disabledState;
                actions.getData(url,paramsObj,"post")
                    .then(res => {
                        this.$message.success('消息发送成功')
                        self.tableObjNext.tableData = [];
                        self.listDataChangeBool=true;
                        this.pageNo = 1;
                        this.lockBool = true;
                        this.hasNextPage = true;
                        this.$nextTick(()=>{
                            document.querySelector(".tableDiv .el-table__body-wrapper").scrollTop = 0
                            this.showData({channelId:null,pageSize:self.pageSizes ,pageNo: 1});
                        })
                        self.$nextTick(function(){
                                self.tableObj.loading = false;
                        })
                        this.handle = false
                        this.radio = '1'
                        this.radio1 = '1'
                        this.checkList = []
                        this.input = this.textareaInfo = ''
                        this.sendType = '1';
                        this.schedulerTime = ''
                        self.disabledState = !self.disabledState;
                        this.dataStart = this.dataEnd = this.loginBeginAt = this.loginEndAt = this.titleVal = this.gender = this.interestId = ''
                        this.value = null;
                        this.headShow = false;
                        this.$nextTick(()=>{
                            this.headShow = true;
                        })
                    })
                    .fail(function(){
                        self.$nextTick(function(){
                                self.tableObj.loading = false;
                                self.disabledState = !self.disabledState;
                                self.tableObjNext.loading = false;
                                this.dataStart = this.dataEnd = this.loginBeginAt = this.loginEndAt = this.titleVal = this.gender = this.interestId = ''
                                this.value = null
                        })

                        }
                    );
                }
        },
        rowEvenChangeId(obj){
            if(!this.checked){
                if(this.tableObjNext.tableData.length==0){
                    let index = this.tableObj.tableData.findIndex(item=>item.id==obj.id)
                    this.tableObjNext.tableData.push(obj);
                    this.tableObj.tableData.forEach((item,i)=>{
                        if(i>index){
                            item.sortId--;
                        }
                    })
                    this.tableObjNext.tableData.forEach((item,index)=>{
                        item.sortId = index+1
                    })
                    this.tableObj.tableData.splice(index,1)
                }else{
                    if(this.tableObjNext.tableData.length>=1000){
                        this.dialogMyself.dialogVisible = true;
                        this.dialogMyself.warryBool = 3;
                        return false;
                    }
                    let index  = this.tableObjNext.tableData.findIndex(item=>item.id==obj.id)
                    if(index>=0){
                        this.$message.error(`账号：${obj.cellphone}已存在于收信人列表中`);
                    }else{
                        let index = this.tableObj.tableData.findIndex(item=>item.id==obj.id)
                        this.tableObjNext.tableData.push(obj);
                        this.tableObj.tableData.forEach((item,i)=>{
                            if(i>index){
                                item.sortId--;
                            }
                        })
                        this.tableObjNext.tableData.forEach((item,index)=>{
                            item.sortId = index+1
                        })
                        this.tableObj.tableData.splice(index,1)
                    }
                }
            }
        },
        getDataId(data){
            var list = [];
            data.forEach((element,index)=>{
                list.push(element.id);
            });
            return list;
        },
        userChooseEven(){
            var self = this;
            if(self.checked){
                // if(self.tableObj.tableData.length>1000){
                //     self.dialogMyself.dialogVisible = true;
                //     self.dialogMyself.warryBool = 3;
                // }else{
                    // self.tableObjNext.tableData = self.tableObj.tableData;
                    self.dialogMyself.dialogVisible = true;
                    self.dialogMyself.warryBool = 1;
                // }
            }
        },
        changeRouter(objs){
                this.$router.push({path:'/backstage/inside/historyRecord', query:'1'});
        },
        userDeleteChooseEven(){
            if(this.checked1){
                this.tableObj.tableData=this.tableObjNext.tableData.concat(this.tableObj.tableData);
                this.tableObj.tableData = this.tableObj.tableData.sort(function(a,b){
                         if (Number(a.id)>Number(b.id)) {
                            return 1;
                         }else if(Number(a.id)<Number(b.id)){
                             return -1
                         }else{
                            return 0;
                         }
                 });
                this.tableObjNext.tableData = [];
            }
        },
        scrollTopPushData(){
            var self = this;
            if(self.lockBool){
                self.checked = false;
                self.tableObj.loading = true;
                this.pageNo++;
                if(!self.hasNextPage) return;
                var url = '/appUser/selectUserListForMessage';
                let query = {
                    pageSize:self.pageSizes,
                    pageNo:this.pageNo,
                    beginAt:actions.formatDate(self.dataStart),
                    endAt:actions.formatDate(self.dataEnd),
                    loginBeginAt:actions.formatDate(self.loginBeginAt),
                    loginEndAt:actions.formatDate(self.loginEndAt),
                    channelId:this.value,
                    userPhone:this.titleVal
                }
                if(this.gender!=''){
                    query.gender = Number(this.gender)
                }
                if(this.interestId!=''){
                    query.interestId = this.interestId;
                }
                actions.getData(url,query)
                    .then(data => {
                        let obhArr = actions.tableHead.inside;
                        let endObj=actions.filterData(data,obhArr);
                        self.hasNextPage = data.hasNextPage;
                        if(endObj.tableObj.tableData.length<self.pageSizes){
                                self.lockBool = false;
                        }
                        let temp = []
                        endObj.tableObj.tableData.forEach(item=>{
                            let index = this.tableObjNext.tableData.findIndex(option=>option.id==item.id);
                            if(index<0){
                                temp.push(item)
                            }
                        })
                        temp.forEach((item,index)=>{
                            item.sortId = (this.pageNo-1)*this.pageSizes+index+1;
                        })
                        self.tableObj.tableData = [...this.tableObj.tableData,...temp];
                        self.$nextTick(function(){
                                self.tableObj.loading = false;
                                self.tableObjNext.loading = false;
                        })
                    })
                    .fail(function(){
                        self.$nextTick(function(){
                                self.tableObj.loading = false;
                                self.tableObjNext.loading = false;
                        })
                    });
                }
            },
            //链接失去焦点验证
            checkeven(event){
                // if(this.radio=="1"){
                //     let checktest = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                //     if( !checktest.test(this.input)){
                //         this.input = "";
                //     }
                // }
                switch (this.radio) {
                    // case "1":
                    //     let checktest = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                    //     if( !checktest.test(this.input)){
                    //         this.input = "";
                    //     }
                    //     break;
                    case "2":
                    case "3":
                        let checktest1 = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
                        if( !checktest1.test(this.input)){
                            this.input = "";
                        }
                    break;
                    default:
                        break;
                }
            },
            getInterestList(){
                const query = {
                    params:{
                        pageNo:1,
                        pageSize:1000
                    }
                }
                this.$http.get(this.$server.getInterestList,query).then(res=>{
                    if(res.status==200){
                        this.headObj.listType.listValOne = res.content.list.map((item,index)=>{
                            return {
                                label:item.name,
                                value:item.id
                            }
                        })
                    }
                })
            }
        },

    watch:{
        schedulerTime(cur){
            if(cur){
                if(cur.split(' ')[0]==formatDate(new Date(),1)){
                    this.timeRange = formatDate(new Date(),2)+' - 23:59:59'
                    if(new Date(cur).getTime()<=new Date().getTime()){
                        this.schedulerTime = formatDate(new Date(),3)
                    }
                }else{
                    this.timeRange = '00:00:00 - 23:59:59';
                }
            }
        },
        titleVal(curVal,oldVal){
            var self = this;
            if(self.listDataChangeBool){
                if(curVal!==oldVal){
                    self.listDataChangeBool = false;
                }
            }
        },
        dataEnd(curVal,oldVal){
            var self = this;
            if(self.listDataChangeBool){
                if(curVal!==oldVal){
                    self.listDataChangeBool = false;
                }
            }
        },
        dataStart(curVal,oldVal){
            var self = this;
            if(self.listDataChangeBool){
                if(curVal!==oldVal){
                    self.listDataChangeBool = false;
                }
            }
        },
        loginEndAt(curVal,oldVal){
            var self = this;
            if(self.listDataChangeBool){
                if(curVal!==oldVal){
                    self.listDataChangeBool = false;
                }
            }
        },
        loginBeginAt(curVal,oldVal){
            var self = this;
            if(self.listDataChangeBool){
                if(curVal!==oldVal){
                    self.listDataChangeBool = false;
                }
            }
        },
        tableObjNext: {
        　　　　handler(newValue, oldValue) {
                    if(this.listDataChangeBool){
                        this.listDataChangeBool = false;
                    }
        　　　　},
        　　　　deep: true
        　　},
        radio(curVal,oldVal){
            var self = this;
            if(self.listDataChangeBool){
                if(curVal!==oldVal){
                    self.listDataChangeBool = false;
                }
            }
            this.handle = true;
        },
        input(curVal,oldVal){
            var self = this;
            if(self.listDataChangeBool){
                if(curVal!==oldVal){
                    self.listDataChangeBool = false;
                }
            }

        },
        textareaInfo(cur,old){
            this.handle = true;
        },
        checkList(curVal,oldVal){
            var self = this;
            this.handle = true;
            if(self.listDataChangeBool){
                if(curVal!==oldVal){
                    self.listDataChangeBool = false;
                }
            }
            self.checkEverType={
                one:0,
                two:0,
                three:0
            };
            curVal.forEach(element => {
                switch (element) {
                    case "1":
                        self.checkEverType.one = 1;
                        break;
                    case "2":
                        self.checkEverType.two = 1;
                        break;
                    // case "3":
                    //     self.checkEverType.three = 1;
                    //     break;
                    default:
                        break;
                }
            });
        },
        tableData(cur,old){
            this.handle = true;
        },
        dialogVisible(cur,old){
            this.handle = true;
        }
    },
    mounted(){}
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
.allSelectCss{
    padding: 10px;
    background:#F5F6F7;
}
.backColorCss{
    background: #ffffff;
    box-shadow: 0 0 2px #F5F6F7;
}
.send-type{
    margin-top:30px;
}
.send-time{
    /* padding-left:112px; */
}
.send-btn{
    width: 120px;
    margin:20px 0 20px 112px;
}
</style>

