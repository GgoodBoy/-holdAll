<template>
<div>
    <el-row>
        <el-col>
                <el-row class="lLine40 headerDiv">
                    <el-col class="lSize18">
                        <el-row class="lSize16">
                            <el-col class="lLeft-r">
                                <breadcrumb :menuList ='titleList'></breadcrumb>
                            </el-col>
                        </el-row>                
                    </el-col>
                    <el-col class="lRight-r lMarginTop20">
                        <el-row :gutter="20">
                            <el-col :span="22" style="text-align: left;">
                                <el-input v-model.trim="title"
                                        placeholder="输入手机号查询"
                                        class="search-form"
                                        width="100%"
                                        clearable
                                        style="width:200px"
                                        @keyup.native="proving1"
                                        ></el-input>       
                                <el-date-picker
                                    v-model="dataStart"
                                    type="date"
                                    placeholder="绑定开始时间">
                                </el-date-picker>    
                                <el-date-picker
                                    v-model="dataEnd"
                                    type="date"
                                    placeholder="结束时间">
                                </el-date-picker>                            
                                <el-select style="width:140px" v-model="valueOne" placeholder="选择用户来源">
                                    <el-option
                                    v-for="item in originArr"
                                    :key="item.code"
                                    :label="item.origin"
                                    :value="item.code">
                                    </el-option>
                                </el-select>
                                <el-select style="width:120px" v-model="valueTwo" placeholder="选择类型">
                                    <el-option
                                    v-for="item in optionsTwo"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>                                                                         
                                <el-button v-if="$authJudge('record:member:select')" type="primary"  @click="searchMemberQuery(1)">查询</el-button>
                            </el-col>
                            <el-col :span="2" style="text-align: right;">
                                <el-button v-if="$authJudge('record:monthmember:export')" type="primary"  @click="telePhoneAdd">添加</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>        
        </el-col>
        <el-col class="lMarginTop20">
            <el-table
            :data="tableData"
            border
            style="width: 100%"
            v-loading="loading">
                <el-table-column
                    prop="sortId"
                    label="序号"
                    align="center"
                    min-width="50">
                </el-table-column>                                                                                         
                <el-table-column
                    prop="cellphone"
                    label="账号"
                    align="center"
                    min-width="120"> 
                        <template slot-scope="scope">
                                <div class="positionCss" style="line-height:40px;">
                                    <div class="absoluteCss testCellphone" v-if="telephoneList.indexOf(scope.row.cellphone)!=-1">测</div>
                                    {{scope.row.cellphone}}
                                </div>                                                     
                        </template>                                       
                </el-table-column>  
                <el-table-column
                    label="头像"
                    align="center"
                    min-width="120">
                        <template slot-scope="scope">
                            <img style="width: 60px;height: 60px;border-radius: 50%;" :src='scope.row.avatar'/>                                                      
                        </template> 
                </el-table-column> 
                <el-table-column
                    prop="nickname"
                    label="昵称"
                    align="center"
                    min-width="120">                    
                </el-table-column>
                <el-table-column
                    prop="originName"
                    label="来源"
                    align="center"
                    min-width="100">                 
                </el-table-column>               
                <el-table-column
                    prop="payPrice"
                    label="状态"
                    align="center"
                    min-width="60">
                        <template slot-scope="scope">
                                <el-row> 
                                    <el-col class="lCenter-r"> 
                                        <p v-if="scope.row.status==1">启用</p>
                                        <p v-else>禁用</p>
                                    </el-col>                                                                    
                                </el-row>                                                      
                            </template>
                </el-table-column>  
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="createdAt"
                    label="绑定时间"
                    align="center"
                    min-width="130">               
                </el-table-column>                                                                                                                                  
                <el-table-column
                    prop="surplusNum"
                    label="剩余天数"
                    align="center"
                    min-width="80"
                    >                       
                </el-table-column>  
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="180"
                    >
                    <template slot-scope="scope">
                        <el-button type="text" @click='operation(2,scope.row)'>追加天数</el-button>  
                        <el-button type="text" @click='operation(1,scope.row)'>{{scope.row.status==1?'禁用':'启用'}}</el-button>                                                               
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
        </el-col>
    </el-row>    
    <el-dialog
        title=""
        :visible.sync="specialTypeDetailOne"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        width="20%"
        class="lCenter-r">
            <div>
                <p>确定要禁用这个用户吗？</p>
                <p>解绑后用户将无法使用学国学网应用程序</p>
            </div>
            <div style='margin-top:20px;'>
                <el-button type="primary" @click="closeDialog(1)">取消</el-button>
                <el-button type="primary" @click="submitDialog(1)">确认</el-button>
            </div>
    </el-dialog>
    <el-dialog
        title=""
        :visible.sync="specialTypeDetailTwo"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        width="20%"
        class="lCenter-r">
            <div>
                追加天数:<el-input v-model="inputDays" style='width:200px;' placeholder="1-2000"></el-input> 
            </div>
            <div style='margin-top:20px;'>
                <el-button type="primary" @click="closeDialog(2)">取消</el-button>
                <el-button type="primary" @click="submitDialog(2)">确认</el-button>
            </div>
    </el-dialog>
    <el-dialog
        title=""
        :visible.sync="specialTypeDetailThree"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        width="30%"
        class="userTelePhone">
            <div>
                <div>
                    <span>用户天数</span>
                    <span>
                        <el-input v-model="input" style='width:200px;' placeholder="0-100000整数"></el-input>
                    </span>
                </div>
                <div style='margin-top:20px;'>
                    <span>选择用户</span>
                    <span>
                        <el-button class="lButtom" @click="userAdd">选择</el-button>
                        <span v-if="isOkUserList.length>0">已添加<span style='color:#B4272D'>{{isOkUserList.length}}人</span></span>
                    </span>
                </div>           
                <div class="listCourse" style='margin-top:20px;'>
                    <el-row class="lLine40" v-for="(item,index) in isOkUserList" :key="index">
                        <el-col :span="18" class="lPaddingRF10 butColor">{{item.cellphone}}</el-col>
                        <el-col :span="4" :offset="2" class="lCenter-r" ><i class="el-icon-close" @click="removeUserTelephone(item,index)"></i></el-col>
                    </el-row>
                </div>
            </div>
            <div style='margin-top:20px;'>
                <el-button @click="closeDialog(3)">取消</el-button>
                <el-button type="primary" @click="submitDialog(3)">确认</el-button>
            </div>
    </el-dialog>
    <el-dialog
        title=""
        :visible.sync="specialTypeDetailFour"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        width="60%"
        class="lCenter-r">
            <div>
               <div style="text-align:left; margin-bottom:20px;">
                    <el-input v-model.trim="titleTwo"
                            placeholder="输入手机号查询"
                            class="search-form"
                            width="100%"
                            maxlength="11"
                            clearable
                            style="width:200px"
                            @keyup.native="proving1"
                            ></el-input>       
                    <el-date-picker
                        v-model="dataStartTwo"
                        type="date"
                        placeholder="注册开始时间">
                    </el-date-picker>    
                    <el-date-picker
                        v-model="dataEndTwo"
                        type="date"
                        placeholder="结束时间">
                    </el-date-picker>
                    <el-select v-model="origin" placeholder="选择用户来源">
                        <el-option
                        v-for="item in originArr"
                        :key="item.code"
                        :label="item.origin"
                        :value="item.code">
                        </el-option>
                    </el-select>  
                    <el-button v-if="$authJudge('record:member:select')" type="primary"  @click="searchMemberQuery(2)">查询</el-button>               
               </div>
               <div>
                    <el-table
                    :data="tableDataTwo"
                    border
                    ref="multipleTable"
                    v-loading="loading"
                    v-loadmoreTable="loadMore"
                    max-height='400'
                    style="width: 100%"
                    @select-all="selectChangeAll"
                    @select="selectChange"
                    @selection-change="handleSelectionChange">
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                            prop="sortId"
                            label="序号"
                            align="center"
                            min-width="50">
                        </el-table-column>                                                                                         
                        <el-table-column
                            prop="cellphone"
                            label="账号"
                            align="center"
                            min-width="120"> 
                                <template slot-scope="scope">
                                        <div class="positionCss" style="line-height:40px;">
                                            <div class="absoluteCss testCellphone" v-if="telephoneList.indexOf(scope.row.cellphone)!=-1">测</div>
                                            {{scope.row.cellphone}}
                                        </div>                                                     
                                </template>                                       
                        </el-table-column>  
                        <el-table-column
                            label="头像"
                            align="center"
                            min-width="120">
                            <template slot-scope="scope">
                                <img style="width: 60px;height: 60px;border-radius: 50%;" :src='scope.row.avatar'/>                                                      
                            </template> 
                        </el-table-column> 
                        <el-table-column
                            prop="originName"
                            label="来源"
                            align="center"
                            min-width="100">                 
                        </el-table-column>
                        <el-table-column
                            prop="nickname"
                            label="昵称"
                            align="center"
                            min-width="120">
                        </el-table-column>                                                                              
                    </el-table>                    
               </div>
            </div>
            <div style='margin-top:20px;'>
                <el-button class='lButtomNo lMarginTB50' @click="closeDialog(4)">取消</el-button>
                <el-button class="lButtomOk lMarginTB50" @click="submitDialog(4)">确认</el-button>
            </div>
    </el-dialog>
</div>
</template>
<script>
import datalist from '../../components/formSynthesisPlugin/gxTitleList';
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import Dialog from "@/components/myDialog/myDialog";
let cellphoneList = new datalist()
export default {
        data(){
        return {
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },  
            allTableLength:0,//分页用户添加课程
            pageNoTwo:1,
            pageSize:10,
            pageNo:1,
            title:'',
            titleTwo:'',
            input:'',
            inputDays:'',
            titleList:[
                        {
                            name:'国学智慧平台',
                            pathInfo:'/xgxWisdom/indexxOne'
                        },
                        {
                            name:'B端课程管理',
                            pathInfo:'/xgxWisdom/indexxOne'
                        },
                        {
                            name:'用户列表',
                            pathInfo:''
                        }                
            ],
            tableData:[],
            tableDataTwo:[],
            valueOne:'',
            optionsOne:[
                {
                    value: '-1',
                    label: '全部'                    
                },
                {
                    value: '0',
                    label: '待支付'                    
                },
                {
                    value: '1',
                    label: '支付成功'                    
                }                
            ],
            specialTypeDetailOne:false,
            specialTypeDetailTwo:false,
            specialTypeDetailThree:false,
            specialTypeDetailFour:false,
            valueTwo:'',
            optionsTwo:[
                // -1全部 1 夫子币余额 2 微信 3 支付宝 4 apple充值 5微信内支付 6华为支付 7Oppo支付 8vivo支付 9小米支付
                {
                    value: '-1',
                    label: '全部'                    
                },
                {
                    value: '1',
                    label: '启用'                    
                },
                {
                    value: '2',
                    label: '禁用'                    
                }                
            ],
            dataStart:'',
            dataEnd:'',
            dataStartTwo:'',
            dataEndTwo:'',
            telephoneList:[],
            loading:true,
            selectGetDataType:true,
            //选中的电话号码；桌面应用
            selectUserList:[],
            //显示已经选中的用户展示
            isOkUserList:[],
            //新的项目参数
            id:'',
            selectData:'',
            originArr:[],//来源
            origin:'',//用户来源
            islastPage:false,//是不是最后一页
            secllType:true,//房子多次滚动加载
            isCopyTimeTableDates:[],//临时选中的全部数据，包含回填的数据
            loadMoreType:false,//滚动底部触发事件
            isFirst:true,//是不是第一次
            closeIsDetailType:false//关闭的时候不允许触发事件
        };
        },
        created() {
            this.id = this.$route.query.id;
            // this.telephoneList = cellphoneList.telePhoneList.join();
            // if(Number(sessionStorage['appHomeSetDate'])>0){
            //     this.dataStart = Number(sessionStorage['appHomeSetDate']);
            //     this.dataEnd = this.dataStart+86399000;            
            //     this.getStudylist(1);
            //     sessionStorage.removeItem('appHomeSetDate');
            // }else{
                this.getStudylist(1);
                this.getListComeDate();
                // this.getUserInfoList(1);
            // }
        },
        watch:{              
            dataEnd: function(curVal,oldVal){
                var self = this;
                if(Number(self.dataStart)>Number(curVal)){
                    self.dataEnd = null;
                }           
            },  
            dataStart: function(curVal,oldVal){
                var self = this;
                if(Number(self.dataEnd)<Number(curVal)){
                    self.dataEnd = null;
                }           
            },             
            dataEndTwo: function(curVal,oldVal){
                var self = this;
                if(Number(self.dataStartTwo)>Number(curVal)){
                    self.dataEndTwo = null;
                }           
            },  
            dataStartTwo: function(curVal,oldVal){
                var self = this;
                if(Number(self.dataEndTwo)<Number(curVal)){
                    self.dataEndTwo = null;
                }           
            }
        },         
        components:{
            breadcrumb,
            Dialog
        },        
        methods: {  
            removeUserTelephone(data,index){
                this.isOkUserList.splice(index,1);
            },
            //弹框确定
            submitDialog(type){
                switch (type) {
                    case 1:
                        this.banOrEnable();
                        break;
                    case 2:
                        this.addDaysEven();
                        break;
                    case 3:
                        this.addUserCellPhone();
                        break;
                    case 4:
                        this.closeIsDetailType = true;
                        this.specialTypeDetailFour = false;
                        this.isOkUserList = this.isCopyTimeTableDates;
                        this.tableDataTwo = [];
                        this.pageNoTwo = 1;
                        setTimeout(()=>{
                            this.specialTypeDetailThree = true;                          
                        },500)
                        break;
                
                    default:
                        break;
                }
            },  
            //弹框取消
            closeDialog(type){
                switch (type) {
                    case 1:
                        this.specialTypeDetailOne = false; 
                        break;
                    case 2:
                        this.specialTypeDetailTwo = false;
                        break;
                    case 3:
                        this.specialTypeDetailThree = false;
                        this.isOkUserList=[];
                        break;
                    case 4:
                        this.closeIsDetailType = true;
                        this.specialTypeDetailFour = false;
                        setTimeout(()=>{
                            this.specialTypeDetailThree = true;
                        },500)
                        break;
                
                    default:
                        break;
                }
            },        
            //渠道类型数据
            getListComeDate(){
                var self = this;
                self.$http.get(self.$server.getOriginList).then(res=>{
                    if(res.status){
                        self.originArr = res.content;
                    }
                })
            },     
            //点击表格选中按钮后的数据临时存储
            selectTableCopyTimeDataSave(){
                if(this.isFirst){      
                        let list5 = [];   
                        let list6 = []; 
                        this.isOkUserList.forEach((e,i)=>{
                            list5.push(e.id);
                        });                                    
                        this.tableDataTwo.forEach((e,i)=>{
                                if(list5.indexOf(e.id)!=-1){
                                    list6.push(e);
                                }
                            });
                            
                    console.log("list6",list6);
                    this.isCopyTimeTableDates = list6;
                }else{
                    //数据回填时数据的id
                    // let list1=[];
                    //需要和选中数据合并的数据；
                    let list2=[];
                    //过滤掉取消已经回填的数据加上本次选中的数据，就是临时所有选中的数据；
                    let list3=[];
                    let list4=[];
                    if(this.isOkUserList.length>0){ 
                        this.tableDataTwo.forEach((e,i)=>{
                            list4.push(e.id);
                        });
                        this.isOkUserList.forEach((e,i)=>{
                            if(list4.indexOf(e.id)==-1){
                                list2.push(e);
                            }
                        }); 
                        list3 = this.selectUserList.concat(list2);
                    }else{
                        list3 = this.selectUserList;
                    }
                    //选中的数据加上当前页不存在的回填数据，就是全部数据；
                    this.isCopyTimeTableDates = list3;
                }
            },
            //点击选择课程进行数据回填
            returnTableDatas(){
                    console.log("this.isCopyTimeTableDates",this.isCopyTimeTableDates);
                    if(this.isCopyTimeTableDates.length>0){ 
                        this.isCopyTimeTableDates.forEach(row => {
                            this.$refs.multipleTable.toggleRowSelection(row);
                        });
                    }               
            },   
            //滚动加载
            loadMore(){
                //最后一页
                if(this.closeIsDetailType) return;
                if(!this.islastPage){
                    //防止多次相同加载
                    if(this.secllType){
                        this.secllType = false;
                        this.loadMoreType = true;
                        this.getUserInfoList(this.pageNoTwo);
                    }
                }
            },         //用户选择
            userAdd(){
                let self = this;
                self.specialTypeDetailThree = false;
                self.loadMoreType = false;
                self.tableDataTwo=[];
                self.isFirst = true;
                self.titleTwo ='';
                self.origin = '';
                self.dataStartTwo ='';
                self.dataEndTwo ='';
                self.getUserInfoList(1);
                setTimeout(()=>{
                    this.closeIsDetailType = false;
                    self.specialTypeDetailFour = true;
                    // setTimeout(()=>{

                    //     //ljm
                    //     self.tableDataTwo.forEach(row => {//this.tableDataTwo[0]
                    //         self.$refs.multipleTable.toggleRowSelection(row);
                    //     }); 
                    // },500)
                },500)
            }, 
            //选中的用户电话号码事件；每次获取的是当前展示数据中选中的部分；
            handleSelectionChange(data,type){
                setTimeout(()=>{
                    if(!this.loadMoreType){
                        this.selectUserList = data;
                        console.log('this.selectUserList',data)
                        this.selectTableCopyTimeDataSave();
                    }
                },300)
            },
            selectChangeAll(data){
                this.isFirst = false;
                this.loadMoreType = false;
            },
            selectChange(data,row){
                this.isFirst = false;
                this.loadMoreType = false;
            },
            //获取用户列表
            getUserInfoList(num){
                var self = this;
                    self.loading = true; 
                    var query = {
                        params:{
                            pageSize:self.pageSize,
                            pageNo: num,
                            nickNameOrPhone:encodeURIComponent(self.titleTwo),
                            origin:self.origin==''?-1:self.origin,
                            beginAt:self.formatDate(self.dataStartTwo,"start"),
                            endAt:self.formatDate(self.dataEndTwo,"end")
                        }          

                    };
                    self.$http.get(self.$server.getWisdomSelectUserPage,query).then(res=>{
                    if(res.status==200){
                        var listIds = [];
                        var contentdate = res.content;
                        var nextPage = contentdate.nextPage;
                        var prePage = contentdate.prePage; 
                        if(contentdate.list.length){
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
                        self.allTableLength = contentdate.total;
                        self.islastPage= contentdate.isLastPage;//判断是不是最后一页
                        self.pageNoTwo =num+1;
                        self.tableDataTwo = self.tableDataTwo.concat(listIds);
                        this.selectGetDataType = true;
                        this.$nextTick(function(){
                            self.loading = false;
                            this.closeIsDetailType = false;
                            self.specialTypeDetailFour = true;
                            // this.bools = true;
                            self.secllType = true;
                            setTimeout(()=>{
                                if(this.isFirst){
                                     self.selectTableCopyTimeDataSave();
                                }else{
                                    if(!self.loadMoreType){
                                        self.selectTableCopyTimeDataSave();
                                    }
                                }
                                self.returnTableDatas();
                            },500)
                        })
                    }
                })   
            },
            //添加用户
            addUserCellPhone(){
                var idStr = [];
                let regExp = /^[0-9]*$/g;
                this.isOkUserList.forEach((e,i)=>{
                    idStr.push(e.id);
                });
                if(!regExp.test(this.input)){
                    this.$message.error('用户天数请输入整数');
                    return;
                }
                var params = {
                    addDays:this.input,
                    batchId:this.id,
                    userIds:idStr.toString()
                };
                this.$http.post(this.$server.wisdomAddCourseUser,params).then(res=>{
                    if(res.status==200){
                        this.specialTypeDetailThree = false;
                        this.isOkUserList=[];
                        this.input='';
                        // this.$refs.multipleTable.clearSelection();
                        this.getStudylist(1);
                    }
                })                 
            },
            //禁用启用
            banOrEnable(){
                var params = {
                    status:this.selectData.status==1?2:1
                };
                this.$http.post(this.$server.wisdomUpdateStatus+this.selectData.id,params).then(res=>{
                    if(res.status==200){
                        this.specialTypeDetailOne = false; 
                        this.getStudylist(1);
                    }
                })                 
            },
            //追加天数接口
            addDaysEven(){
                let regExp = /^[0-9]*$/g;
                if(!regExp.test(this.inputDays)){
                    this.$message.error("追加天数为整数");
                    return;
                }
                if(this.inputDays<1||this.inputDays>2000){
                    this.$message.error("追加天数在1-2000");
                    return;
                }
                var params = {
                    addDays:this.inputDays
                };
                this.$http.post(this.$server.wisdomAddDays+this.selectData.id,params).then(res=>{
                    if(res.status==200){
                        this.specialTypeDetailTwo = false;
                        this.inputDays='';
                        this.getStudylist(1);
                    }
                })                 
            },
            //表单操作
            operation(type,data){
                this.selectData = data;
                switch (type) {
                    case 1:
                        if(data.status==2){
                            this.banOrEnable();
                        }else{
                            this.specialTypeDetailOne = true;
                        }
                        break;
                    case 2:
                        this.specialTypeDetailTwo = true;
                        break;
                    default:
                        break;
                }
            },
            formatDate(date,type){
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
                    if(type=="end"){
                        h = 23;
                        m1 = 59;
                        s = 59;                
                    }else{
                        h = h<10?("0"+h):h;
                        m1 = m1<10?("0"+m1):m1;
                        s = s < 10 ? ("0" + s) : s;
                    }
                    return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
                }else{
                    return '';
                }
            },     
            //添加
            telePhoneAdd(){
                this.specialTypeDetailThree = true;
            },       
             
            searchMemberQuery(type){
                if(type==1){
                    this.getStudylist(1);
                }else{
                    this.pageNoTwo = 1;
                    this.tableDataTwo=[];
                    if(this.selectGetDataType){
                        this.selectGetDataType = false;
                        this.getUserInfoList(1);
                    }
                    
                }
            },
            getStudylist(num){
                var self = this;
                if(num){
                    self.pageNo = num;
                }
                self.loading = true; 
                var query = {
                    params:{
                        cellphone:encodeURIComponent(self.title)||'',
                        pageSize:self.pageSize,
                        pageNo:self.pageNo,
                        status:self.valueTwo,
                        origin:self.valueOne,
                        beginAt:self.formatDate(self.dataStart,"start"),
                        endAt:self.formatDate(self.dataEnd,'end') 
                    }          
                };
                self.$http.get(self.$server.wisdomCourseUserList+self.id,query).then(res=>{
                if(res.status==200){
                    var listIds = [];
                    var contentdate = res.content;
                    var nextPage = contentdate.nextPage;
                    var prePage = contentdate.prePage; 
                   if(contentdate.list.length){
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
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loading = false; 
                }
            })            
        },       
        proving1(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.title)){
                this.title='';
            }
        },              
        //分页
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }            
        },                   
    }
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
.testCellphone{
    top: 3px;
    right: 0;
    background: #9E0E00;
    color: #fff;
    font-size: 10px;
    padding: 3px;
    line-height: 11px;
    border-radius: 10px;    
}.has-gutter th.el-table-column--selection .cell{
    display: block;
}
.userTelePhone .listCourse{
            width: 250px;
            max-height: 250px;
            overflow: auto;
}
.userTelePhone .listCourse .lLine40{
            border:1px solid #9E0E00;
            margin: 5px 0;
}
.userTelePhone .listCourse .lLine40 i{
        font-weight:bold;
        cursor: pointer;
}
.userTelePhone .listCourse .lLine40 .lPaddingRF10{
                color: #9E0E00;
                text-align: left;
}
</style>


