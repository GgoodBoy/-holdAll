<template>
    <div>
        <el-row class="lSize24 lPadding20 lLine40 lMarginBO10 warryBackCss">
            <el-col :span="5" class="redFontColor">总用户:{{userNumer.userCount||0}}人</el-col>
            <el-col :span="6" class="redFontColor">今日已注册:{{userNumer.todayRegisterCount||0}}人</el-col>
        </el-row>
        <div class="headerDiv">
            <el-row :gutter="20">
                <!-- <el-col class="lSize18 lMarginBO20">{{mateInfo.title}}</el-col> -->
                <el-col :span="18">
                    <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                </el-col>                
                <el-col class="lMarginBO20">
                    <el-row :gutter="3">
                        <el-col :span="24">
                            <el-input
                                    placeholder="输入手机号查询"
                                    maxlength="20"
                                    clearable=""
                                    style="width:200px;"
                                    v-model="input">
                            </el-input>
                            <el-select v-model="value" style="width:90px;" placeholder="性别">
                                <el-option
                                v-for="item in listValOne"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="origin" style="width:90px;" placeholder="来源">
                                <el-option
                                v-for="item in originArr"
                                :key="item.code"
                                :label="item.origin"
                                :value="item.code">
                                </el-option>
                            </el-select>
                            <el-select v-model="originRegister" style="width:110px;" placeholder="注册来源">
                                <el-option
                                v-for="item in registerList"
                                :key="item.code"
                                :label="item.lable"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="registerType" style="width:110px;" placeholder="注册类型">
                                <el-option
                                v-for="item in registerTypeList"
                                :key="item.code"
                                :label="item.lable"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-date-picker
                            v-model="loginBeginAt"
                            type="date"
                            style="width:175px;"
                            placeholder="最后登录开始时间">
                            </el-date-picker>
                            <el-date-picker
                            v-model="loginEndAt"
                            type="date"
                            style="width:140px;"
                            placeholder="结束时间">
                            </el-date-picker>
                            <el-button class="lButtom lSize16" style="width:128px;" @click="channelUpdate">渠道用户同步</el-button>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col>
                    <el-row :gutter="3">
                        <el-col>
                            <el-select v-model="valuechannel" placeholder="渠道" style="width:110px;">
                                <el-option
                                v-for="item in listValthree"
                                :key="item.value"
                                :label="item.name"
                                :value="item.channelId">
                                </el-option>
                            </el-select>
                            <el-select v-model="values" placeholder="状态" style="width:110px;">
                                <el-option
                                v-for="item in listValTwo"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-date-picker
                            v-model="dataStart"
                            type="date"
                            style="width:170px;"
                            placeholder="注册开始时间">
                            </el-date-picker>
                            <el-date-picker
                            v-model="dataEnd"
                            type="date"
                            style="width:140px;"
                            placeholder="结束时间">
                            </el-date-picker>
                            <el-select v-model="provinceId"
                                clearable
                                style="width:110px;"
                                placeholder="省/直辖市"
                                @change="getProvince(provinceId,1)"
                                >
                                <el-option v-for="(item,i) in provinceList"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                            <el-select v-model="cityId"
                                clearable
                                style="width:110px;"
                                placeholder="市"
                                >
                                <el-option v-for="(item,i) in cityList"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>  
                            <el-button v-if="$authJudge('user:users:select')" class="lButtom lSize16" @click="queryUserList">查询</el-button>
                            <el-button v-if="$authJudge('user:users:export')" class="lButtom lSize16" @click="exportInfo">导出</el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <gxTable :tableDatas="tableObj" v-on:pathRouterPage="Routerpage"></gxTable>
        <gxPaginaton :pageAtions="pageAtion" v-on:childByPageValue="childPageValue" ></gxPaginaton>
        <Dialog
                :showFlag.sync="dialgObj.prohibit.showFlag"
                :title="dialgObj.prohibit.title"
                :cancelName="dialgObj.prohibit.cancelName"
                :sureName="dialgObj.prohibit.sureName"
                v-on:prohibitNo="prohibitObjNo"
                v-on:prohibitOk="prohibitObjOk">
                <el-row slot="dialog-body" class="lLine30">
                    <el-col :span="14" :offset="5" class="lCenter-r">
                        {{chooseType==1?'确定要启用此账户吗？':'确定要禁用此账户吗？用户禁用后不可登录'}}
                    </el-col>
                </el-row>
        </Dialog>
        <el-dialog
        title=""
        :visible.sync="channelDelDialogVisible"
        :show-close="showClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="handleClose"
        width="40%"
        >
            <el-row class="lLine30 lMarginBO40" v-if="!waitUpdateData">
                <el-col class="lCenter-r lSize18" :span="5">同步数据</el-col>
                <el-col class="lCenter-r grayColor" :span="19">用户数据同步会占用服务器性能，建议不要在用户访问量较高的时间段同步。</el-col>
            </el-row>
            <el-row  class="lLine30">
                <el-col class="lCenter-r lMarginBO40" v-if="!waitUpdateData">
                    <el-row class="lLine40">
                        <el-col>
                            <el-row>
                                <el-col class="el-col_one">
                                    <div style="margin-right:15px;">选择渠道 :</div>
                                    <el-select v-model="channelValue" style="width:206px !important">
                                        <el-option
                                        v-for="item in channelListNext"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.channelId">
                                        </el-option>
                                    </el-select>                                    
                                </el-col>  
                            </el-row>
                        </el-col>
                        <el-col style="margin-top:20px">
                            <el-row>
                                <el-col class="el-col_one">
                                    <div style="margin-right:15px;">选择时间 :</div>
                                    <el-date-picker
                                    v-model="valueTime"
                                    style="width:206px !important"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                    </el-date-picker>                                    
                                </el-col>
                            </el-row>                            
                        </el-col>                          
                    </el-row>
                </el-col>
                <el-col class="lCenter-r" v-if="!waitUpdateData">
                    <el-button @click="channelDataUpdateIsNO()">取 消</el-button>
                    <el-button class="redBackColor butColorF" @click="channelDataUpdateIsOk()">确 定</el-button>
                </el-col>
                <el-row class="lLine30" v-if="waitUpdateData">
                    <el-progress :percentage="progress" :color="colors"></el-progress>
                    <span v-if="updateDataError">数据同步失败</span>
                    <el-col v-if="!updateDataError" class="lCenter-r grayColor">数据同步中，请等待......</el-col>
                </el-row>
            </el-row>

        </el-dialog>
        <el-dialog :custom-class="'details-dialog'" :visible.sync="detaislDialogVisible" :width="'800px'">
            <div class="top">
                <div class="details-item" v-for="(item,index) in detailsData" :key="index">
                    <p class="label">{{item.label}}</p>
                    <img v-if="item.name" :src="item.value"/>
                    <p v-else class="value">{{item.value&&item.value!=''?item.value:'-'}}</p>
                </div>
                <el-table
                    :data="studyRecordTableData"
                    border
                    v-loading="studyRecordLoading"
                    max-height="200"
                    ref="scrollBox"
                    style="width: 100%">
                        <el-table-column
                            prop="courseName"
                            label="课程名称"
                            align="center"
                            min-width="200">
                        </el-table-column>
                        <el-table-column
                            prop="courseProgress"
                            label="学习进度"
                            align="center"
                            min-width="80">
                        </el-table-column>
                        <el-table-column
                            prop="studyDurationText"
                            label="学习时长"
                            align="center"
                            min-width="80">
                        </el-table-column>
                        <el-table-column
                            prop="typeText"
                            label="类型"
                            align="center"
                            min-width="50">
                        </el-table-column>
                        <el-table-column
                            prop="createdAt"
                            label="开始学习时间"
                            align="center"
                            min-width="200">
                        </el-table-column>
                </el-table>                 
            </div>
        </el-dialog>
    </div>
</template>
<script>
import gxHead from "@/components/formSynthesisPlugin/gxHead";
import gxTable from "@/components/formSynthesisPlugin/gxTable";
import gxPaginaton from "@/components/formSynthesisPlugin/gxPaginaton";
import { getToken,setToken,removeToken} from '@/utils/auth';
import Dialog from "@/components/myDialog/myDialog";
import eventAction from '../lEventAtion';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
let actions = new eventAction()
const uTypeArr = [
    {label:'普通',value:1},
    {label:'教师',value:2},
    {label:'学生',value:3},
]
const formatSeconds = value =>{
    let m = parseInt(value % 3600 / 60)
    let s = parseInt(value % 3600 % 60)
    let mStr = m<10?`0${m}`:m;
    let sStr = s<10?`0${s}`:s;
    let h = parseInt(value/3600)
    let hStr = h<10?`0${h}`:h;
    return `${h}:${m}′${s}″`
}
// 用户管理
export default {
    components:{
        gxHead,
        gxTable,
        gxPaginaton,
        Dialog,
        breadcrumb
    },
    data(){
        return {
            mateInfo:{},
            input:'',
            listValOne:[
                {
                value: -1,
                label: '全部'
                },
                {
                value: 2,
                label: '保密'
                },
                {
                value: 0,
                label: '女'
                }, {
                value: 1,
                label: '男'
                }
            ],
            listValTwo:[{
                value: -1,
                label: '全部'
                },{
                value: 0,
                label: '启用'
                }, {
                value: 1,
                label: '禁用'
                }
            ],
            registerTypeList:[
                {
                    value: -1,
                    lable: '全部'
                },
                {
                    value: 1,
                    lable: '自动' 
                },
                {
                    value: 2,
                    lable: '手动' 
                }
            ],
            disabledState:false,
            registerList:[
                //4第三方 5pc端
                 {
                    value:-1,
                    lable:'全部'
                },{
                    value:1,
                    lable:'IOS'
                },{
                    value:2,
                    lable:'Android'
                },{
                    value:3,
                    lable:'M站'
                },{
                    value:4,
                    lable:'第三方'
                },{
                    value:5,
                    lable:'PC端'
                }
            ],
            originRegister:'',
            value:'',
            values:'',
            valueTime:'',
            valuechannel:'',
            origin:'',
            listValthree:[],
            flags:[],
            originArr:[],
            registerType:'',
            tableObj:{
                tableData:[],
                // 1.编辑，2.下架，3.详情，4.排序
                marksArrs:[
                    {name:"启用",type:1},
                    {name:"禁用",type:2},
                    {name:'详情',type:3},
                    {name:'拉新',type:4}
                ],
                markState:true,
                loading:true,
                types:"userFiles",
                minWidth:120,
                imgCss:{
                    roundBoll:false,
                    squareBoll:true
                },
                power:[]
            },
            pageAtion:{},
            chooseType:'',
            //弹框配置
            dialgObj:{
                    prohibit:{
                        showFlag:false, //是否显示遮罩弹框；
                        title:"温馨提示", //Dialog 的标题
                        cancelName:'prohibitNo', //自定义取消事件名字
                        sureName:'prohibitOk', //自定义确定事件名字
                    }
            },
            chooseStateOne:'',
            chooseStateTwo:'',
            dataStart:'',
            dataEnd:'',
            loginBeginAt:'',
            loginEndAt:'',
            titleVal:'',
            userNumer:{},
            chooseData:'', //禁用启用选中
            pageSize:10,
            channelId:'',
            channelDelDialogVisible:false,
            waitUpdateData:false,
            updateDataError:false,
            channelValue:null,
            channelList:[],
            channelListNext:[],
            showClose:true,
            closeDialogBool:true,
            progress:0,
            boosVal:false,
            colors:"#8e71c7",
            detaislDialogVisible:false,
            detailsData:[],
            studyRecordDialog:false,
            studyRecordUserId:'',
            studyRecordTableData:[],
            studyRecordLoading:false,
            studyRecordPageNo:1,
            studyRecordPageSize:10,
            provinceId:null,  
            cityId:null,  
            provinceArr:[],
            provinceList:[{
                        label:'全部',
                        value:-1                    
                    }],
            cityList:[{
                        label:'全部',
                        value:-1                    
                    }],
            cityArr:[],
            titleList:[
                {
                    name:'用户管理系统',
                    pathInfo:''
                },
                {
                    name:'用户管理',
                    pathInfo:''
                }                                               
            ]
    }},
    watch: {       
        dataStart: function(curVal,oldVal){
            var self = this;
            if(Number(self.dataEnd)<Number(curVal)){
                self.dataEnd = null;
            }
        },
        dataEnd: function(curVal,oldVal){
            var self = this;
            if(Number(self.dataStart)>Number(curVal)){
                self.dataEnd = null;
            }
        }, 
        loginBeginAt: function(curVal,oldVal){
            var self = this;
            if(Number(self.loginEndAt)<Number(curVal)){
                self.loginEndAt = null;
            }
        },
        loginEndAt: function(curVal,oldVal){
            var self = this;
            if(Number(self.loginBeginAt)>Number(curVal)){
                self.loginEndAt = null;
            }
        }               
    },      
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path;
        this.mateInfo = this.$route.meta;
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }
        this.tableObj.power = flag;
        this.flags = flag;
        var self = this;
        this.getRegionList();
        self.channelTypeListDate();
        self.channelTypeListDateNext();
        self.dataStart = Number(sessionStorage['appHomeSetDate']);
        self.dataEnd = Number(sessionStorage['appHomeSetDate'])+86399000;
        self.getListComeDate();
        // if(Number(self.dataStart)>0){
        //     this.showData({pageSize:self.pageSize ,pageNo: 1,beginAt:actions.formatDate(Number(self.dataStart)),endAt:actions.formatDate(self.dataEnd)});
        //     actions.getData("/appUser/selectUserCount","")
        //         .then(data => {
        //             self.userNumer = data;
        //             sessionStorage.removeItem('appHomeSetDate')
        //         })
        //         .fail(function(){
        //             console.log("出错啦!");}
        //         );
        // }else{
        //     this.showData({pageSize:self.pageSize ,pageNo: 1});
        //     actions.getData("appUser/selectUserCount","")
        //         .then(data => {
        //             self.userNumer = data;
        //         })
        //         .fail(function(){
        //             console.log("出错啦!");}
        //         );
        // }
    },
    props:{},
    computed:{},
    methods:{
        /**
         * 获取地区信息
         */
        getRegionList(){
            this.$http.get(this.$server.getRegionList,{}).then(res=>{
                if(res.status==200){
                    let provinceArr = [{
                        label:'全部',
                        value:-1                    
                    }],
                        cityArr = [];
                        // areaArr = [];
                    res.content.forEach((item,index)=>{
                        item.label = item.name;
                        item.value = item.id;
                        if(item.level==1){
                            provinceArr.push(item)
                        }else if(item.level==2){
                            cityArr.push(item)
                        }
                        // else if(item.level==3){
                        //     areaArr.push(item)
                        // }
                    })
                    this.provinceArr = provinceArr;
                    this.cityArr = cityArr;
                    // this.areaArr = areaArr;
                    this.provinceList = [...this.provinceArr];
                    // this.editData.provinceList = [...this.provinceArr]
                }
            })
        },     
        /**
         * 选择省
         */
        getProvince(val,type){
            if(val){
                let obj = this.provinceArr.find(item=>item.value==val)
                let cityList = [{
                        label:'全部',
                        value:-1                    
                    } ]
                this.cityArr.forEach(item=>{
                    if(item.parentId == obj.id){
                        cityList.push(item)
                    }
                })
                if(type==1){
                    this.cityList = cityList;
                }
            }
            if(type==1){
                this.cityId = -1;
            }
        },                  
        //关闭之前
        handleClose(done){
            var self = this;
            if(this.closeDialogBool){
                self.waitUpdateData = false;
            }
            done(this.closeDialogBool);
        },
        download2(url) {
            try{
                    var elemIF = document.createElement("iframe");
                    elemIF.src = url;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                }catch(e){
                    zzrw.alert("下载异常！");
                }
        },
        //数据同步;
        channelUpdate(){
            this.channelDelDialogVisible = true;
            this.waitUpdateData = false;
            this.showClose=true;
            this.valueTime='';
        },
        formatDate(date){
            if(date){
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                var h=date.getHours();
                var m1=date.getMinutes();
                var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;
                    h = h<10?("0"+h):h;
                    m1 = m1<10?("0"+m1):m1;
                    s = s < 10 ? ("0" + s) : s;
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
            }
        },        
        //渠道数据同步；
        channelDataUpdateIsOk(){
            var self = this;
            if(self.channelValue){
                if(self.channelValue=='xiaoe'){
                    self.waitUpdateData = true;
                    self.showClose=false;
                    self.closeDialogBool = false;
                    var colorboos = true;
                    var parems={channelId:self.channelValue};
                    var num = 0;
                    var interval = setInterval(function(){
                        if(num<36000){
                            num++;
                            self.progress=parseInt(num/360);
                        }else{
                            self.progress = 100;
                            self.showClose=true;
                            self.closeDialogBool = true;
                            if(colorboos){
                                self.colors="#B4272D";
                                self.updateDataError = true;
                            }
                            clearInterval(interval);
                        }
                    },1000);
                    if(!self.disabledState){
                        self.disabledState = !self.disabledState;                        
                        self.$http.post(self.$server.getChannelData(parems),{endTime:self.formatDate(self.valueTime)},{timeout:1000*60*60*10}).then(res=>{
                            if(res.status==200){
                                self.closeDialogBool = true;
                                self.showClose=true;
                                self.updateDataError = false;
                                num = 36000;
                                colorboos = false;
                                self.$message({
                                    message: "渠道数据同步成功",
                                    type: "success"
                                });
                                self.disabledState = !self.disabledState;
                                var t=setTimeout(function(){
                                    self.channelDelDialogVisible = false;
                                    clearTimeout(t);
                                },1500);
                            }else{
                                self.disabledState = !self.disabledState;
                                self.closeDialogBool = true;
                                self.showClose=true;
                                self.updateDataError = true;
                                num = 36000;
                            }
                        })
                        .catch(function (error) {
                                self.closeDialogBool = true;
                                self.showClose=true;
                                self.disabledState = !self.disabledState;
                                self.updateDataError = true;
                                num = 36000;
                        });
                    }

                }else{
                    self.channelDelDialogVisible = false; 
                    self.$message({
                        message: "渠道数据同步成功",
                        type: "success"
                    });                              
                }
            }else{
                 this.$message.error("请选择渠道");
            }
        },
        channelDataUpdateIsNO(){
            this.channelDelDialogVisible = false;
        },
        queryUserList(){
            var self = this;
            self.tableObj.loading = true;
            self.chooseStateTwo = self.values;
            self.chooseStateOne = self.value;
            self.titleVal = self.input;
            self.channelId = self.valuechannel;
            var objParmises={
                pageSize:self.pageSize,
                pageNo: 1,
                nickNameOrPhone:encodeURIComponent(self.input),
                gender:self.value,
                status:self.values,
                origin:self.origin==''?-1:self.origin,
                beginAt:Number(self.dataStart)>0?actions.formatDate(Number(self.dataStart)):'',
                endAt:Number(self.dataEnd)>0?((Number(self.dataEnd)-Number(self.dataStart))==86399000?actions.formatDate(Number(self.dataEnd)):actions.formatDate(Number(self.dataEnd)+86399000)):'',
                channelId:self.valuechannel,
                cellphoneProvinceId:self.provinceId||-1,
                cellphoneCityId:self.cityId||-1,
                registerSource:self.originRegister,
                registerType:self.registerType,
                loginBeginAt:Number(self.loginBeginAt)>0?actions.formatDate(Number(self.loginBeginAt)):'',
                loginEndAt:Number(self.loginEndAt)>0?((Number(self.loginEndAt)-Number(self.loginBeginAt))==86399000?actions.formatDate(Number(self.loginEndAt)):actions.formatDate(Number(self.loginEndAt)+86399000)):'',
            }
            this.showData(objParmises);
        },
        //渠道类型数据
        channelTypeListDate(){
            var self = this;
            self.$http.get(self.$server.channelListName).then(res=>{
                if(res.status){
                    // self.headObj.listType.listValthree = res.content;
                    self.listValthree = res.content;
                    self.channelList =res.content;
                }
            })
        },
        //渠道类型数据
        getListComeDate(){
            var self = this;
            self.$http.get(self.$server.getOriginList).then(res=>{
                if(res.status){
                    self.originArr = res.content;

                    if(Number(self.dataStart)>0){
                        self.showData({pageSize:self.pageSize ,pageNo: 1,beginAt:actions.formatDate(Number(self.dataStart)),endAt:actions.formatDate(self.dataEnd)});
                        actions.getData("/appUser/selectUserCount","")
                            .then(data => {
                                self.userNumer = data;
                                sessionStorage.removeItem('appHomeSetDate')
                            })
                            .fail(function(){
                                console.log("出错啦!");}
                            );
                    }else{
                        self.showData({pageSize:self.pageSize ,pageNo: 1});
                        actions.getData("appUser/selectUserCount","")
                            .then(data => {
                                self.userNumer = data;
                            })
                            .fail(function(){
                                console.log("出错啦!");}
                            );
                    }
                }
            })
        },        
        channelTypeListDateNext(){
            var self = this;
            self.$http.get(self.$server.getChannelDataNext).then(res=>{
                if(res.status){
                    // self.headObj.listType.listValthree = res.content;
                    self.channelListNext =res.content;
                }
            })
        },
        //表格组件数据传递
        Routerpage(obj){
            switch (obj.type) {
                case 1:
                    this.chooseData = obj.data;
                    this.chooseType = obj.type;
                    this.dialgObj.prohibit.showFlag = true;
                    break;
                case 2:
                    this.chooseData = obj.data;
                    this.chooseType = obj.type;
                    this.dialgObj.prohibit.showFlag = true;
                    break;
                case 3:
                    this.chooseData = obj.data;
                    console.log(obj.data)
                    this.chooseType = obj.type;
                    this.detailsData = [
                        {label:'账号',value:obj.data.cellphone},
                        {label:'头像',value:obj.data.avatar,name:'img'},
                        {label:'昵称',value:obj.data.nickname},
                        {label:'类型',value:obj.data.registerSource},
                        {label:'来源',value:obj.data.originName},
                        {label:'渠道',value:obj.data.channelName},
                        {label:'性别',value:obj.data.gender},
                        {label:'身份',value:obj.data.uTypeText},
                        {label:'兴趣',value:obj.data.interestNames},
                        {label:'出生日期',value:obj.data.birthDate},
                        {label:'学历',value:obj.data.education},
                        {label:'职业',value:obj.data.occupation},
                        {label:'行业',value:obj.data.industry},
                        {label:'地区',value:obj.data.areaName},
                        {label:'学校',value:obj.data.schooleName},
                        {label:'年级',value:obj.data.gradeName},
                        {label:'注册时间',value:obj.data.createdAt},
                        {label:'最后登录',value:obj.data.lastLoginAt},
                        {label:'夫子币',value:obj.data.coinBalance},
                        {label:'邀请',value:obj.data.inviteNum},
                        {label:'学习时长',value:obj.data.studyDurationText},
                        {label:'积分',value:obj.data.integralNum}
                    ]
                    this.detaislDialogVisible = true;
                    this.studyRecordDialog = true;
                    this.studyRecordTableData = [];
                    this.studyRecordPageNo = 1;
                    this.studyRecordUserId = obj.id
                    this.$nextTick(()=>{
                        this.getStudyRecord()
                    })
                    break;
                case 4:
                    this.$router.push({path:"/userFilesNewListPage",query:{userId:obj.id}});
                    break;
                default:
                    console.log("数据错误");
                    break;
            }
        },
        //分页子组件传递给父组件的方法
        childPageValue(pageNum){
            var self = this;
            this.tableObj.loading = true;
            //后期做接口字段过滤；
            var objParmises={
                pageSize:self.pageSize,
                pageNo: Number(pageNum)>0?pageNum:1,
                nickNameOrPhone:self.titleVal,
                origin:self.origin==''?-1:self.origin,
                gender:self.chooseStateOne,
                status:self.chooseStateTwo,
                beginAt:Number(self.dataStart)>0?actions.formatDate(Number(self.dataStart)):'',
                endAt:Number(self.dataEnd)>0?((Number(self.dataEnd)-Number(self.dataStart))==86399000?actions.formatDate(Number(self.dataEnd)):actions.formatDate(Number(self.dataEnd)+86399000)):'',
                channelId:self.channelId,
                cellphoneProvinceId:self.provinceId||-1,
                cellphoneCityId:self.cityId||-1,
                registerType:self.registerType,
                registerSource:self.originRegister,
                loginBeginAt:Number(self.loginBeginAt)>0?actions.formatDate(Number(self.loginBeginAt)):'',
                loginEndAt:Number(self.loginEndAt)>0?((Number(self.loginEndAt)-Number(self.loginBeginAt))==86399000?actions.formatDate(Number(self.loginEndAt)):actions.formatDate(Number(self.loginEndAt)+86399000)):'',                                
            }
            this.showData(objParmises);
        },
       showData(paramsObj){
            var self = this;
            var url = '/appUser/selectUserPage';
            actions.getData(url,paramsObj)
                .then(data => {
                    let obhArr = actions.tableHead.userFiles;
                    let endObj=actions.filterData(data,obhArr,"userFiles");
                    var listIds = [];
                        listIds = endObj.tableObj.tableData.map(function(element,index){
                            element.uTypeText = element.userType?uTypeArr.find(item=>item.value==element.userType).label:''
                            element.originText = element.origin?self.originArr.find(item=>item.code==element.origin).label:''
                            element.studyDurationText = element.studyDuration!=null?formatSeconds(element.studyDuration):''
                            if(endObj.pageAtion.pageNum==1){
                                element.sortId = index+1;
                                return element;
                            }else if(endObj.pageAtion.pageNum>1){
                                element.sortId = (endObj.pageAtion.pageNum-1)*10+index+1;
                                return element;
                            }
                        });
                        console.log(listIds)
                    // self.tableObj.tableData = endObj.tableObj.tableData;
                    self.tableObj.tableData = listIds;
                    self.pageAtion = endObj.pageAtion;
                    if(endObj.pageAtion.pageTotal>self.pageSize){
                        self.pageAtion['pageBool'] = false;
                    }else{
                        self.pageAtion['pageBool'] = true;
                    }
                    self.$nextTick(function(){
                            self.tableObj.loading = false;
                    })
                })
                .fail(function(){
                    self.pageAtion['pageBool'] = true;
                    self.$nextTick(function(){
                            self.tableObj.loading = false;
                    })
                    console.log("出错啦!");}
                );
        },
        prohibitObjNo(){
            this.dialgObj.prohibit.showFlag = false;
        },
        prohibitObjOk(){
            var self = this;
            var url = '/appUser/enable/'+self.chooseData.id;
            var params = {
                enable:self.chooseType==1?0:1
                };
            actions.getData(url,params,'post')
                .then(data => {
                    let obhArr = actions.tableHead.userFiles;
                    // let endObj=actions.filterData(data,obhArr,"userFiles");
                    // self.tableObj.tableData = endObj.tableObj.tableData;
                    // self.pageAtion = endObj.pageAtion;
                    var objParmises={
                        pageSize:self.pageSize,
                        pageNo:self.pageAtion.pageNum,
                        nickNameOrPhone:encodeURIComponent(self.titleVal),
                        origin:self.origin==''?-1:self.origin,
                        gender:self.chooseStateOne,
                        status:self.chooseStateTwo,
                        beginAt:Number(self.dataStart)>0?actions.formatDate(Number(self.dataStart)):'',
                        endAt:Number(self.dataEnd)>0?((Number(self.dataEnd)-Number(self.dataStart))==86399000?actions.formatDate(Number(self.dataEnd)):actions.formatDate(Number(self.dataEnd)+86399000)):'',
                        channelId:self.channelId,
                        registerType:self.registerType,
                        loginBeginAt:Number(self.loginBeginAt)>0?actions.formatDate(Number(self.loginBeginAt)):'',
                        loginEndAt:Number(self.loginEndAt)>0?((Number(self.loginEndAt)-Number(self.loginBeginAt))==86399000?actions.formatDate(Number(self.loginEndAt)):actions.formatDate(Number(self.loginEndAt)+86399000)):''                                         
                    }
                    self.showData(objParmises)
                    self.$nextTick(function(){
                            self.tableObj.loading = false;
                    })
                })
                .fail(function(){
                    self.$nextTick(function(){
                            self.tableObj.loading = false;
                    })
                    }
                );
            this.dialgObj.prohibit.showFlag = false;
        },
        exportInfo(){
            var self = this;
            self.dataStart=self.dataStart!=undefined?self.dataStart:'';
            self.titleVal=self.titleVal!=undefined?self.titleVal:'';
            self.dataEnd=self.dataEnd!=undefined?self.dataEnd:'';
            self.loginBeginAt=self.loginBeginAt!=undefined?self.loginBeginAt:'';
            self.loginEndAt=self.loginEndAt!=undefined?self.loginEndAt:'';            
            self.chooseStateTwo=self.chooseStateTwo!=undefined?self.chooseStateTwo:'';
            self.chooseStateOne=self.chooseStateOne!=undefined?self.chooseStateOne:'';
            var parems ={
                nickNameOrPhone:encodeURIComponent(self.titleVal),
                origin:self.origin==''?-1:self.origin,
                gender:self.chooseStateOne,
                status:self.chooseStateTwo,
                beginAt:Number(self.dataStart)>0?actions.formatDate(Number(self.dataStart)):'',
                endAt:Number(self.dataEnd)>0?((Number(self.dataEnd)-Number(self.dataStart))==86399000?actions.formatDate(Number(self.dataEnd)):actions.formatDate(Number(self.dataEnd)+86399000)):'',
                token:getToken(),
                channelId:self.channelId,
                registerSource:self.originRegister,
                loginBeginAt:Number(self.loginBeginAt)>0?actions.formatDate(Number(self.loginBeginAt)):'',
                loginEndAt:Number(self.loginEndAt)>0?((Number(self.loginEndAt)-Number(self.loginBeginAt))==86399000?actions.formatDate(Number(self.loginEndAt)):actions.formatDate(Number(self.loginEndAt)+86399000)):''                 
            };
            var url = self.$server.exportExcelUser+"?nickNameOrPhone="+self.titleVal+"&origin="+parems.origin+"&gender="+self.chooseStateOne+"&status="+self.chooseStateTwo+"&beginAt="+actions.formatDate(self.dataStart)+"&endAt="+parems.endAt+"&loginBeginAt="+actions.formatDate(self.loginBeginAt)+"&loginEndAt="+parems.loginEndAt+"&token="+getToken()+"&channelId="+self.channelId+"&cellphoneProvinceId="+self.provinceId+"&cellphoneCityId="+self.cityId+"&registerSource="+self.originRegister;
            window.open(url);
        },
        getStudyRecord(){
            if(this.studyRecordUserId){
                this.studyRecordLoading = true;
                let query = {
                    params:{
                        pageNo:this.studyRecordPageNo,
                        pageSize:this.studyRecordPageSize
                    }
                }
                this.$http.get(`${this.$server.studyRecord}/${this.studyRecordUserId}`,query).then(res=>{
                    if(res.status==200){
                        let typeArr = [{label:'试看',value:1},{label:'已购',value:2},{label:'VIP',value:3},]
                        this.studyRecordLoading = false;
                        let temp = res.content.list.map(item=>{
                            item.typeText = typeArr.find(option=>option.value==item.type).label;
                            item.studyDurationText = item.studyDuration!=null?formatSeconds(item.studyDuration):''
                            return item;
                        })
                        this.studyRecordTableData = [...this.studyRecordTableData,...temp]
                        let dom = document.querySelector(".details-dialog .is-scrolling-none")
                        if(dom){
                            if(res.content.isLastPage){
                                dom.removeEventListener("scroll",this.scrollEvent)
                            }else{
                                this.$nextTick(()=>{
                                    dom.addEventListener("scroll",this.scrollEvent)
                                })
                            }
                        }
                        
                    }
                })
            }
        },
        scrollEvent(){
            let dom = document.querySelector(".details-dialog .is-scrolling-none")
            let scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight
            let sign = 10;
            if (scrollDistance <= sign) {
                dom.removeEventListener("scroll",this.scrollEvent)
                this.studyRecordPageNo++;
                this.getStudyRecord();
            }
        }        
    },
    mounted(){}
}
</script>
<style lang="scss" scope>
@import "../../components/formSynthesisPlugin/my-component.css";
.warryBackCss{
    background: #FFC0C3;
    border-radius: 5px;
}
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px;
    margin: 10px 0;
}
.pingluns .el-date-editor.el-input{
        width: 100%;
    }
// .el-date-editor.el-input, .el-date-editor.el-input__inner{
//     width: 150px !important;
// }
.el-col_one{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.details-dialog{
    .top{
        font-size: 0;
        padding: 0 5%;
        .details-item{
            display: inline-block;
            vertical-align: middle;
            margin:10px 0;
            width: 50%;
            .label,.value,img{
                display: inline-block;
                vertical-align: middle;
                font-size: 16px;
            }
            .label{
                margin-right: 10px;
                width: 66px;
                text-align: right;
            }
            img{
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
        }
    }
}
</style>

