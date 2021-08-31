<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col class="lRight-r lMarginTop30">
                <el-row>
                    <el-col :span="5">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                placeholder="请输入名称"
                                class="search-form"
                                clearable
                                width="100%">
                            </el-input>
                        </div>                       
                    </el-col>
                    <el-col :span="4">
                            <el-row>
                                <el-col :span="8" class="lCenter-r" style="fontSize:14px">状态 : </el-col>
                                <el-col :span="16">
                                    <el-select v-model="value" placeholder="状态" @change="chooseVersionType">
                                        <el-option
                                        v-for="item in learnType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>                                    
                                </el-col>
                            </el-row>                          
                    </el-col>                   
                    <el-col v-if="$authJudge('market:studycard:select')" :span="1"  :offset="1"><el-button class="redBackColor butColorF" @click="findInfo">查询</el-button></el-col>
                    <el-col :span="13" style="text-align: right;">
                        <el-button v-if="$authJudge('market:studycard:add')" class="redBackColor butColorF" @click="creatlearnCard">添加精品课学习卡</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>  
        <el-row>
            <el-col>
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="名称"
                        align="center"
                        min-width="150">
                    </el-table-column>
                    <!-- <el-table-column
                        prop="versionNum"
                        label="面额"
                        align="center"
                        min-width="60"
                        >
                    </el-table-column> -->
                    <el-table-column
                        prop="num"
                        label="张数"
                        align="center"
                        min-width="60"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="activitionNum"
                        label="已领用"
                        align="center"
                        min-width="80"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="creatorName"
                        :show-overflow-tooltip="true"
                        label="生成人"
                        align="center"
                        min-width="80"
                        >
                    </el-table-column>    
                    <el-table-column
                        prop="receiveValidatily"
                        :show-overflow-tooltip="true"
                        label="有效至"
                        align="center"
                        min-width="140"
                        >
                    </el-table-column>    
                    <el-table-column
                        prop="statusStr"
                        :show-overflow-tooltip="true"
                        label="状态"
                        align="center"
                        min-width="60"
                        >
                    </el-table-column>  
                    <el-table-column
                        prop="remarks"
                        :show-overflow-tooltip="true"
                        label="备注"
                        align="center"
                        min-width="140"
                        >
                    </el-table-column>                                                        
                    <!-- <el-table-column
                        :show-overflow-tooltip="true"
                        label="操作"
                        align="center"
                        min-width="140"
                        >
                        <template slot-scope="scope">
                            <el-button
                                    type="text"
                                    class="black-btn"
                                    @click="detailsFun(scope.row)">详情</el-button>                            
                            </template>
                    </el-table-column>    -->
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="210"
                        >
                        <template slot-scope="scope">
                            <el-row>                                
                                <el-col :span="8">
                                    <el-button type="text" v-if="($authJudge('market:studycard:void')&&scope.row.status==1)||scope.row.status!=1" :disabled="scope.row.status==1?false:true" v-bind:class="{ 'black-btn-ok': scope.row.status==1?true:false, 'black-btn-no': scope.row.status==1?false:true }" class="black-btn" @click="cancelBatch(scope.row,1)">
                                        <span v-if="scope.row.status==1">作废本批次</span>
                                        <span v-else>本批次已作废</span>
                                    </el-button>                                    
                                </el-col>
                                <el-col :span="8">
                                    <!-- v-if="flags.includes('common:export')" -->
                                    <el-button v-if="$authJudge('market:studycard:export')" type="text" class="black-btn" @click="exportTable(scope.row)">导出</el-button>
                                </el-col>
                                <el-col :span="8">  
                                    <!-- http://scm.youfushuyuan.com/#/user/receiveLearnCard?cardId=21 -->
                                    <!-- <el-button class="black-btn" type="text" v-if="urlScienceBools===2" :class="`copyurl${scope.row.id}`" :data-clipboard-text="`http://scm.youfushuyuan.com/#/user/receiveLearnCard?cardId=${scope.row.id}`" @click="copyUrl(scope.row.id)">复制链接</el-button>
                                    <el-button class="black-btn" type="text" v-else :class="`copyurl${scope.row.id}`" :data-clipboard-text="`http://xgxm.xueguoxue.com/#/user/receiveLearnCard?cardId=${scope.row.id}`" @click="copyUrl(scope.row.id)">复制链接</el-button>          -->
                                    <el-button v-if="$authJudge('market:studycard:copylink')" class="black-btn" type="text" v-show="urlScienceBools==2" :class="`copyurl${scope.row.id}`" @click="copyUrl(scope.row.id)">复制链接</el-button>
                                    <el-button v-if="$authJudge('market:studycard:copylink')" class="black-btn" type="text" v-show="urlScienceBools!=2"  :class="`copyurl${scope.row.id}`" @click="copyUrl(scope.row.id)">复制链接</el-button>   
                                    <input type="text" :id="`copyurl${scope.row.id}`" style="opacity: 0">                                                     
                                    <!-- <el-button type="text" class="black-btn" @click="copyUrl(scope.row)">复制链接</el-button> -->
                                </el-col>                                                                
                                <el-col :span="8">
                                    <el-button v-if="$authJudge('market:studycard:del')" type="text" class="black-btn" @click="removeBatch(scope.row,2)">删除</el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button v-if="$authJudge('market:studycard:find')" type="text" class="black-btn" @click="inquiryBatch(scope.row,1)">查看</el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="text" v-if="$authJudge('market:studycard:addnum')" class="black-btn" @click="newDailge(scope.row,1)">追加张数</el-button>
                                </el-col>  
                                <el-col :span="8">
                                    <el-button type="text" v-if="$authJudge('market:studycard:addcourse')" class="black-btn" @click="newDailge(scope.row,2)">追加课程</el-button>
                                </el-col>  
                                <el-col :span="8">
                                    <el-button type="text" v-if="$authJudge('market:studycard:addcellphone')" class="black-btn" @click="newDailge(scope.row,3)">添加号码</el-button>
                                </el-col>                                                              
                            </el-row>                            
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
        :visible.sync="centerDialogVisible"
        :close-on-click-modal='false'
        width="80%"
        center>
                <div class="iSeachEvenSun">
                    <el-row>
                        <el-col :span="10">
                            <el-input v-model.trim="cardNumSun"
                            placeholder="请输入卡号/完整手机号查询"
                            class="search-form-sun"
                            clearable
                            width="100%"></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-row>
                                <el-col :span="8" class="lCenter-r" style="fontSize:14px;line-height: 40px;">状态 : </el-col>
                                <el-col :span="16">
                                    <el-select v-model="activationVal" placeholder="状态" @change="chooseActivationType">
                                        <el-option
                                        v-for="item in activationList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>                                    
                                </el-col>
                            </el-row>                          
                        </el-col>                         
                        <el-col :span="2" :offset="1">
                            <el-button type="primary" @click="searchSun">查询</el-button>
                        </el-col>
                    </el-row>
                </div>        
                <el-table :data="gridData" v-loading="loadingSun">
                    <el-table-column min-width="60" property="sortId" label="序号"></el-table-column>
                    <el-table-column min-width="80" property="name" label="名称"></el-table-column>
                    <el-table-column min-width="100" property="creatorName" label="创建者姓名"></el-table-column>
                    <el-table-column min-width="100" property="editorName" label="修改者姓名"></el-table-column>
                    <el-table-column min-width="200" property="cardNum" label="学卡"></el-table-column>
                    <el-table-column min-width="80" label="是否激活">
                        <template slot-scope="scope">
                            <span>{{scope.row.activitionFlag==1?"激活":"未激活"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150" property="password" label="密码"></el-table-column>
                    <el-table-column min-width="60" property="statusStr" label="状态"></el-table-column>
                    <el-table-column min-width="100" label="有效时长(天)">
                        <template slot-scope="scope">
                            <span>{{scope.row.useValidatily+''=='0'?"永久":scope.row.useValidatily}}</span>
                        </template>                        
                    </el-table-column>
                    <el-table-column min-width="200" property="bindPhone" label="关联账户"></el-table-column>
                    <el-table-column min-width="200" property="activitionTime" label="激活时间"></el-table-column>
                    <el-table-column min-width="200" property="lastLoginTime" label="最后登录时间"></el-table-column>
                    <el-table-column min-width="150" property="receiveValidatilyDay" label="有效期至"></el-table-column>
                    <el-table-column min-width="100" property="courseNames" label="课程" :show-overflow-tooltip="true"></el-table-column>                 
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValueSun"
                        :current-page.sync="pageAtionSun.paginationPageSun"
                        :total="pageAtionSun.pageTotalSun">
                    </el-pagination>
                </div>                 
        </el-dialog> 
        <el-dialog :title="titleNameType==1?'作废提示':'删除提示'" width="30%" :visible.sync="dialogTableVisible">
                <el-row>
                    <el-col>
                        <el-row class="lLine30">
                            <el-col v-if="titleNameType==1" class="lCenter-r">确定要作废本批次吗？作废本批次不影响已激活用户</el-col> 
                            <el-col v-else class="lCenter-r">确定要删除本批次吗？删除前建议先请先作废本批次</el-col>
                        </el-row>
                        <el-row  class="lLine30 lMarginTop40">
                            <el-col class="lCenter-r">
                                <el-button @click="isNoEven(titleNameType)">取 消</el-button>
                                <el-button type="primary" @click="isOkEven(titleNameType)">确 定</el-button>                        
                            </el-col>                        
                        </el-row>
                    </el-col>
                </el-row>
        </el-dialog>     
        <el-dialog
        :title="courseDivShowHide==1?'':'课程'"
        :visible.sync="courseNumberState"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :show-close="false"
        width="40%"
        center>
            <div v-if="courseDivShowHide==1">
                <div>
                    <p style="margin-bottom:15px;">张数 : {{courseNumValue}}</p>
                    <el-input style="width:300px;" :maxlength="5" v-model="inputCourseNum" @keyup.native="proving1" :placeholder='placeholderVal'></el-input>
                    <p v-show="provingType" 
                    style="color: #9E0E00;margin-top: 5px;font-size: 12px;">*最多只能输入1到{{10000-Number(courseNumValue)}}</p>
                </div>                
            </div>
            <div v-if="courseDivShowHide==2">
                <el-row>
                    <el-col>
                        <el-row :gutter="10">
                            <el-col :span="10">
                                <div class="iSeachEven">
                                    <el-input v-model.trim="cardTitle"
                                        placeholder="请输入名字"
                                        class="search-form"
                                        clearable
                                        width="100%">
                                    </el-input>
                                </div>                       
                            </el-col> 
                            <el-col :span="5">  
                                <el-select v-model="channelValue">
                                    <el-option
                                    v-for="item in channelListNext"
                                    :key="item.channelId"
                                    :label="item.name"
                                    :value="item.channelId">
                                    </el-option>
                                </el-select>                        
                            </el-col>     
                            <el-col :span="5">  
                                <el-select v-model="pipelineIdValue"
                                        clearable
                                        placeholder="课程渠道">
                                    <el-option v-for="(item,i) in (pageConstant.pipelineList)"
                                        :key="i"
                                        :label="item.name"
                                        :value="Number(item.channelId)">
                                    </el-option>
                                </el-select>                       
                            </el-col>                                                 
                            <el-col :span="4">      
                                <el-button @click="selectCardId" class="redBackColor butColorF">查询</el-button>               
                            </el-col>                            
                        </el-row>                        
                    </el-col>
                    <el-col>
                        <el-table
                        :data="tableCourse"
                        @selection-change="handleSelectionChange"
                        style="width: 100%;max-height:400px;overflow-y: auto;">
                            <el-table-column
                            type="selection"
                            width="55">
                            </el-table-column>                        
                            <el-table-column
                                prop="title"
                                label="名称"
                                min-width="150">
                            </el-table-column>
                            <el-table-column
                                prop="pipelineName"
                                label="渠道"
                                min-width="60">
                            </el-table-column>                            
                            <el-table-column
                                label="类型"
                                min-width="60">
                                <template slot-scope="scope">
                                    <span>{{scope.row.mtype==1?"成人":"少儿"}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="sellingPrice"
                                label="价格"
                                min-width="60">
                            </el-table-column>
                        </el-table>
                    </el-col> 
                </el-row>                                              
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="courseNumberEven(1)">取 消</el-button>
                <el-button type="primary" @click="courseNumberEven(2)">确 定</el-button>
            </span>            
        </el-dialog>        
        <el-dialog 
        title="" 
        :visible.sync="addUserTelephone" 
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false">
            <div>
                <div class="userSelectListBtn">
                    <div class="usersTitle">学习卡剩余 :{{cardNumber}}</div>
                    <div style="display: -webkit-inline-box;">
                        <div style="margin-right:15px;">渠道来源 :</div>
                        <el-select v-model="channelValue" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.origin"
                            :value="item.code">
                            </el-option>
                        </el-select>                        
                    </div>
                    <div class="usersCount">
                        <!-- <el-input type="textarea" style="width:200px;" :rows="9"></el-input> -->
                        <textarea class="telePhoneTextareas" type="textarea" @input="getContent" rows="6" ref="textarea"  @click="getRows" @keydown="keyDownEvent($event)" @paste="pasteEvent" v-model="textarea"></textarea>
                        <div class="usersList">
                            <div class="usersListCount" v-for="(item,index) in addTelephoneListCopy" :key="index">
                                <p>{{item}}</p>
                                <i class="el-icon-circle-close" @click="removeSelectTelephone(index)"></i>
                            </div>
                        </div>
                    </div>
                </div> 
                <div class="userTelePhoneSaveBut">
                    <div @click="saveTextareaInfo">保存</div>
                </div>               
                <div style="text-align: center;">
                    <el-button type="primary" @click="telephoneDoal(1)">保存</el-button>
                    <el-button type="info" @click="telephoneDoal(2)">取消</el-button> 
                </div>
            </div>
        </el-dialog>                                   
        <!-- <el-dialog title="详情" width="30%" :visible.sync="dialogTableVisible">
                 <el-row class="lLine30">
                    <el-col class="lLeft-r">
                        有效期 :
                    </el-col>      
                    <el-col class="lLeft-r">
                        {{customDetai.useValidatily||0}}天
                    </el-col>     
                    <el-col class="lLeft-r">
                        包含课程 :
                    </el-col>
                    <el-col class="lLeft-r">
                        <span v-for="item,index in customDetai.courseVoList">{{item.courseName}}{{customDetai.courseVoList.length==(index+1)?"":'、'}}</span>
                    </el-col>  
                    <el-col class="lLeft-r">
                        备注 :
                    </el-col>
                    <el-col class="lLeft-r">
                        {{customDetai.remarks}}
                    </el-col>                                                                                                               
                </el-row>
        </el-dialog>   -->       
    </div>
</template>
<script>
import Dialog from "@/components/myDialog/myDialog";
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
const secret_key = 'xueguoxue.com';
function encrypt(str, pwd) {
    if (pwd == null || pwd.length <= 0) {
      alert("Please enter a password with which to encrypt the message.");
      return null;
    }
    let prand = "";
    for (let i = 0; i < pwd.length; i++) {
      prand += pwd.charCodeAt(i).toString();
    }
    let sPos = Math.floor(prand.length / 5);
    let mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    let incr = Math.ceil(pwd.length / 2);
    let modu = Math.pow(2, 31) - 1;
    if (mult < 2) {
      alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
      return null;
    }
    let salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;
    while (prand.length > 10) {
      prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    let enc_chr = "";
    let enc_str = "";
    for (let i = 0; i < str.length; i++) {
      enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
      if (enc_chr < 16) {
        enc_str += "0" + enc_chr.toString(16);
      } else enc_str += enc_chr.toString(16);
      prand = (mult * prand + incr) % modu;
    }
    salt = salt.toString(16);
    while (salt.length < 8)salt = "0" + salt;
    enc_str += salt;
    return enc_str;
  }
export default {
    data(){
        return {
            tableData: [],
            tableCourse:[],
            pageNo:1,
            pageSize:10,
            pageNoSun:1,
            pageSizeSun:10,          
            cardNumSun:'',
            idSun:'',
            loading:true,
            loadingSun:true,
            flags:[],
            title:'',
            dialogTableVisible:false,
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            pageAtionSun:{
                pageTotalSun:0,
                paginationPageSun:1
            },             
            value:-1,
            customDetai:{useValidatily:'',remarks:'',courseVoList:[]},       
            learnType:[
                {
                    label:"全部",
                    value:-1
                },              
                {
                    label:"正常",
                    value:1
                },
                {
                    label:"作废",
                    value:0                  
                }
            ],
            centerDialogVisible: false,
            titleList:[
                    {
                        name:'系统合集',
                        pathInfo:'/marketelistlist'
                    },
                    {
                        name:'定制精品课系统',
                        pathInfo:''
                    }
            ],
            gridData: [
                {
                    "sortId":0,
                    "orderNumber":1,
                    "bindPhone": null,
                    "activitionTime": null,
                    "cardNum": "990102019012900010",
                    "receiveValidatilyDay": "2019-01-29",
                    "useValidatily": 20,
                    "statusStr": "正常",
                    "name": "那么",
                    "password": "b1q9xst",
                    "courseNames": "斗破苍穹"
                }
            ],
            urlScienceBools:1,
            titleNameType:1,
            chooserows:'',
            copyUrlInfo:"",
            courseNumberState:false,
            inputCourseNum:'',
            courseNumValue:0,//设置的张数,
            courseDivShowHide:null,
            cardTitle:'',
            selectListId:null,
            provingType:false,
            placeholderVal:'>0<1001',
            selectIdArr:[],
            //添加号码-ljm
            addUserTelephone:false,
            textarea:'',
            oldTextarea:'',
            rows:0,
            pasteFlag:false,
            addTelephoneListCopy:[], 
            channelValue:'',
            cardNumber:'',
            options: [], 
            channelListNext:[
                {
                    channelId:-1,
                    name:'全部'
                },                
                {
                    channelId:1,
                    name:'成人'
                },
                {
                    channelId:2,
                    name:'少儿'
                }
            ],
            channelValue:'',
            pageConstant: {},
            pipelineIdValue:'',
            activationList:[
                {
                    value:-1,
                    label:'全部'
                },{
                    value:1,
                    label:'激活'
                },
                {
                    value:0,
                    label:'未激活'
                }                
            ],
            activationVal:-1                                 
        }
    },     
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        this.flags = this.$getPermissions(routes,currentPath);  
        if(!this.flags){
            this.flags = [];
        }               
        if(this.environmenttarget=='prod'){
            this.urlScienceBools = 1;
        }else if(this.environmenttarget=='beta'){
            this.urlScienceBools = 2;
        }else{
            this.urlScienceBools = 1;
        };
        this.getChannelList();
        this.getStudylist(1);
        this.getConstant();
    },
    methods:{
        //激活状态
        chooseActivationType(e){
            this.activationVal = e;
        },
        getConstant() {
            this.$http
                .get(this.$server.courseConstant)
                .then(res => {
                    res.content.courseTypeMap[0] = {name: "全部", value: -1};
                    res.content.courseStatusList= [{name: "全部", value: -1}].concat(res.content.courseStatusList);
                    this.pageConstant = res.content;
                })
                .catch(err => {
                    console.log(err);
                });
        },         
        //返回渠道；
        getChannelList(){
            var self = this;
            self.$http.get(self.$server.getOriginStudyCard).then(res=>{
                if(res.status==200){    
                    self.options = res.content;                
                }
            })            
        },        
        //剩余可用学习卡张数
        remainCardNumber(id){
            var self = this;
            var params = {
                cardBaseId:id        
            };
            self.$http.get(self.$server.getCardCountStudyCard(params)).then(res=>{
                if(res.status==200){    
                    self.cardNumber = res.content.surplusNum;                
                }
            })            
        },        
        proving1(){
            var self = this;
            if(!(/(^[1-9]\d*$)/.test(self.inputCourseNum))){
                self.inputCourseNum ='';
                self.provingType = true;
            }else{
                if(self.inputCourseNum<1||self.inputCourseNum>Number(10001-self.courseNumValue)){
                    self.inputCourseNum ='';
                    self.provingType = true;
                }else{
                     self.provingType = false;
                }
            }
        },
        handleSelectionChange(val) {
            var listId = [];
            for (const iterator of val) {
                listId.push(iterator.id);
            };
            this.selectIdArr = listId;
        },        
        isNoEven(){
            this.dialogTableVisible = false;
        },
        isOkEven(num){
            var self = this;
            switch (num) {
                case 1:
                    this.cancelBatchOk(self.chooserows);
                    break;
                case 2:
                    this.removeBatchOk(self.chooserows);
                    break;            
                default:
                    console.log("信息有误");
                    break;
            }            
            self.dialogTableVisible = false;
        },
        //复制
       copyUrl(id){ 
           var self = this;
            switch (this.urlScienceBools) {
                case 1:
                    self.copyUrlInfo = "https://xgxm.xueguoxue.com/#/user/receiveLearnCard?cardId="+encrypt(id+'',secret_key)
                    var input = document.querySelector('#copyurl'+id);
                        input.value = self.copyUrlInfo;
                        input.select();
                        if (document.execCommand('copy')) {
                            document.execCommand('copy');
                            self.$message.success({ message: "复制成功" });
                            console.log('复制成功');
                        }
                    break;
                case 2:
                    self.copyUrlInfo = "https://scm.youfushuyuan.com/#/user/receiveLearnCard?cardId="+encrypt(id+'',secret_key)
                    var input = document.querySelector('#copyurl'+id);
                        input.value = self.copyUrlInfo;
                        input.select();
                        if (document.execCommand('copy')) {
                            document.execCommand('copy');
                            self.$message.success({ message: "复制成功" });
                            console.log('复制成功');
                        }   
                    break;        
                default:
                    console.log("地址有误");
                    break;
            }              
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
        exportTable(rows){
            var self = this;
            console.log(rows);
            console.log("导出");
            var parems = {
                token:getToken(),
                id:rows.id
            };
            self.download2(self.$server.newAllExport(parems));            
        },   
        //追加课程和数量
        newDailge(data,type){
            var self = this;
             self.selectListId = data.id;
            switch(type){
                case 1:
                    self.courseNumberState = true;
                    self.courseDivShowHide=type;
                    self.courseNumValue =data.num; 
                    self.placeholderVal = ">0<"+(10000-Number(self.courseNumValue));
                break;
                case 2:
                    self.courseDivShowHide=type;
                    self.getCardCourseList(self.selectListId);                
                break;   
                case 3:
                    self.addUserTelephone=true;
                     self.remainCardNumber(data.id);               
                break;                             
            }
        },   
        courseNumberEven(num){//courseNumberState
            var self = this;
            if(num==1){
                self.courseNumberState=false;
                self.courseDivShowHide=null;
                self.courseNumValue = null; 
                self.selectIdArr =[]; 
                self.selectListId = null; 
                self.inputCourseNum ='';   
                self.cardTitle = '';    
                self.channelValue=''; 
                self.pipelineIdValue ='';       
            }else{
                if(self.courseDivShowHide==1){
                    var parems = {
                        cardBaseId:self.selectListId,
                        num:self.inputCourseNum||0
                    };
                    self.$http.post(self.$server.getStudyCardaddNum,parems).then(res=>{
                        if(res.status==200){
                            self.courseNumberState = false;
                            self.courseDivShowHide=null;
                            self.courseNumValue = null; 
                            self.selectIdArr =[]; 
                            self.selectListId = null; 
                            self.inputCourseNum ='';   
                            self.cardTitle = '';
                            self.channelValue='';  
                            self.pipelineIdValue ='';                                                    
                            self.getStudylist();                    
                        }
                    })
                }else{
                    if(self.selectIdArr.length){
                        var params = {
                            cardBaseId:self.selectListId,
                            courseIdList:self.selectIdArr 
                        };
                        self.$http.post(self.$server.getStudyCardAddCourse,params).then(res=>{
                            if(res.status==200){
                                self.courseNumberState = false;
                                self.courseDivShowHide=null;
                                self.courseNumValue = null;  
                                self.selectIdArr =[];
                                self.selectListId = null; 
                                self.inputCourseNum =''; 
                                self.cardTitle = '';  
                                self.channelValue=''; 
                                self.pipelineIdValue ='';                          
                                self.getStudylist();                    
                            }
                        })
                    }
                }
            }

            
        }, 
        selectCardId(){
            var self = this;
            self.getCardCourseList(self.selectListId);
        },
        getCardCourseList(id){
            var self = this;
            var params = {
                cardBaseId:id,
                title:self.cardTitle,
                mtype:self.channelValue,
                pipelineId:self.pipelineIdValue
            };
            self.$http.get(self.$server.getStudyCardCourseList(params)).then(res=>{
                if(res.status==200){
                    self.tableCourse = res.content;
                    self.courseNumberState = true;
                }
            })            
        },
        cancelBatch(rows,num){
            console.log(rows.id);
            this.dialogTableVisible = true;
            this.titleNameType = num;
            this.chooserows = rows;
        },  
        cancelBatchOk(rows){
            var self = this;
            var params = {
                id:rows.id
            };
            self.$http.post(self.$server.studyCardCancel(params)).then(res=>{
               if(res.status==200){
                   self.tableData = self.tableData.map(function(elements,index){
                        if(elements.id==rows.id){
                            elements.status = 0;
                            return elements;
                        }else{
                            return elements;
                        }
                   });
               }
            })            
        },
        removeBatch(rows,num){
            console.log(rows);
            this.dialogTableVisible = true;
            this.titleNameType = num; 
            this.chooserows = rows;          
        },   
        removeBatchOk(rows){
            var self = this;
            var params = {
                id:rows.id
            };
            self.$http.post(self.$server.studyCardRemove(params)).then(res=>{
               if(res.status==200){
                    console.log(res);
                    var newData = []; 
                    self.tableData.forEach(function(elements,index){
                        if(elements.id!=rows.id){
                            newData.push(elements);
                        }
                    }); 
                    self.tableData = newData;             
               }
            })             
        },    
        inquiryBatch(rows){
            var self = this;
            self.idSun = rows.id;
            self.cardNumSun = rows.cardNum;
            this.activationVal = -1;
            self.getStudylistSun(1); 
            self.centerDialogVisible = true;
        },   
        searchSun(){
            console.log("搜索");
            this.getStudylistSun(1);
        },                                   
        // detailsFun(rows){
            // var self = this;
            // self.dialogTableVisible = true;
            // // self.editsObj.showFlag = true;
            // self.$http.get(self.$server.studyCardDetail(rows.id)).then(res=>{
            //    if(res.status==200){
            //         self.customDetai = res.content;
            //         self.$nextTick(function(){
            //             self.loading = false; 
            //         }) 
            //    }
            //     console.log(res);
            // })            
            // console.log("详情");
        // },                 
        //搜索
        search(){
            console.log("搜索");
            this.getStudylist(1);
        },
        //查询
        findInfo(){
            console.log("查询");
            this.getStudylist(1);
        },
        //创建学习卡
        creatlearnCard(){
            this.$router.push({path:"/marketelist/customLearnCard/creatCustomLearnCard"});
        },
        //状态筛选
        chooseVersionType(e){
            console.log("状态筛选",e);
            this.value = e;
        },        
        getStudylist(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            var params = {
                type:2,
                keyword:self.title,
                // activitionFlag:self.value,
                status:self.value,
                pageNo:self.pageNo,
                pageSize:self.pageSize
            };            
            self.$http.get(self.$server.studyCardList(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;   
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                return element;
                            });                            
                        } 
                   };                                   
                   self.tableData = listIds;
                   self.pageAtion.pageTotal = contentdate.total;
                   self.pageAtion.paginationPage = num;
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
               }
                console.log(res);
            })            
        },
        getStudylistSun(num){
            var self = this;
            if(num){
                self.pageNoSun = num;
            }
            self.loadingSun = true; 
            let stateUnm =-1;
            if(JSON.stringify(self.activationVal)==0){
                stateUnm = 0;
            }else{
                stateUnm =self.activationVal
            }
            
            var params = {
                id:self.idSun,
                cardNum:self.cardNumSun,
                pageNo:self.pageNoSun,
                pageSize:self.pageSizeSun,
                activitionFlag:stateUnm
            };            
            self.$http.get(self.$server.batchListInfo(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;   
                   if(contentdate.list.length){
                        if(!nextPage&&prePage!=0){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = contentdate.total-prePage*10-index;
                                return element;
                            });
                        }else if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = contentdate.total-index;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = contentdate.total-prePage*10-index;
                                return element;
                            });                            
                        }                    
                   }; 
                                                     
                   self.gridData = listIds;
                   self.pageAtionSun.pageTotalSun = contentdate.total;
                   self.pageAtionSun.paginationPageSun = num;
                   self.$nextTick(function(){
                        self.loadingSun = false; 
                    }) 
               }
                console.log(res);
            })            
        },        
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        },
        childPageValueSun(num){
            if(Number(num)>0){
                this.getStudylistSun(Number(num))
            }
        },
        //添加号码确定-ljm
        telephoneDoal(num){
            switch (num) {
                case 1:
                    this.addTelePhoneNewId();                 
                    break;
                case 2:
                    this.addUserTelephone = false;
                    this.textarea='';
                    this.oldTextarea='';
                    this.rows=0;
                    this.channelValue ='';
                    this.pasteFlag=false;
                    this.addTelephoneListCopy=[];                    
                break;  

                default:
                    break;
            }
        },   
        addTelePhoneNewId(){
            var self = this;
            if(self.addTelephoneListCopy){
                if(self.addTelephoneListCopy.length>200){
                    self.$message.error('每次最多添加200条');
                    return;
                }else{            
                    var params = {
                        cardBaseId:self.selectListId,
                        origin:self.channelValue,
                        cellphones:self.addTelephoneListCopy.join('\n')          
                    };
                    self.$http.post(self.$server.addCellphoneStudyCard,params).then(res=>{
                        if(res.status==200){
                            self.addUserTelephone = false;
                            self.addTelephoneListCopy =[];
                            self.textarea =[];
                            self.oldTextarea='';
                            self.channelValue ='';
                            self.rows=0;
                            self.pasteFlag=false;                    
                            self.$message.success({ message: "添加成功!" });                   
                        }
                    }) 
                }
            }               
        },             
        /**
         * 获取内容
         */
            getContent(){
                this.textarea = this.textarea.replace(/[^\d\n]/g, '');
                if(this.pasteFlag){
                    this.pasteFlag = false;
                    let temp = this.textarea.split('\n').map(item=>{
                        return item.length>11?item.substr(0,11):item
                    })
                    this.textarea = this.oldTextarea = temp.join('\n');
                    this.$nextTick(()=>{
                        this.getRows()
                    })
                    return false;
                }
                let index = this.rows - 1 < 0 ? 0 : this.rows - 1;
                let arr = this.textarea.split('\n');
                if(arr[index]&&arr[index].length>11){
                    this.textarea = this.oldTextarea
                    this.$nextTick(()=>{
                        this.getRows()
                    })
                    return;
                }
                this.oldTextarea = this.textarea;
            },
            /**
             * 根据光标获取行数 （鼠标点击）
             */
            getRows(){
                let index = this.getCursortPosition(this.$refs.textarea)
                let temp = this.textarea.substr(0,index)
                this.rows = temp.split('\n').length
            }, 
            /**
             * 根据光标获取行数 （键盘回车，上移下移左移右移）
             */
            keyDownEvent(e){
                let code = [8,13,37,38,39,40]
                if(code.includes(e.keyCode)){
                    setTimeout(()=>{
                        let index = this.getCursortPosition(this.$refs.textarea)
                        let temp = this.textarea.substr(0,index)
                        this.rows = temp.split('\n').length
                    },1)
                }
            },
            /**
             * 获取光标的位置
             */
            getCursortPosition(dom){
                var cursorIndex = 0;
                if (document.selection) {
                    dom.focus();
                    var range = document.selection.createRange();
                    range.moveStart('character', -dom.value.length);
                    cursorIndex = range.text.length;
                } else if (dom.selectionStart || dom.selectionStart==0) {
                    cursorIndex = dom.selectionStart;
                }
                return cursorIndex;
            }, 
            /**
             * 粘贴事件
             */
            pasteEvent(){
                this.pasteFlag = true
            },
            //保存添加的电话号码
            saveTextareaInfo(){
                let list = [...new Set([...this.addTelephoneListCopy,...this.textarea.split('\n')])];              
                this.addTelephoneListCopy = list;       
                this.textarea ='';        
            },  
            removeSelectTelephone(index){
                var remDate =this.addTelephoneListCopy.splice(index, 1);
            },                                    
    },
    components:{
        Dialog,
        breadcrumb
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px; 
    margin-bottom: 10px;     
}
.headerDiv .search-form {
        // width: 240px;
        // margin-right: 60px;
        position: relative;
        &.el-icon-search:before {
            position: absolute;
            font-size: 18px;
            right: 10px;
            top: 10px;
            background: #fff;
            font-weight: 900;
        }
    }
.headerDiv .iSeachEven{
    width: 100%;
    position: relative;
}
.headerDiv .iSeachEven i{
    position: absolute;
    right: 8px;
    font-size: 18px;
    top: 12px;
    cursor: pointer;
}    
.iSeachEvenSun{
    width: 60%;
    position: relative;
    margin-bottom: 20px;
}
.iSeachEvenSun i{
    position: absolute;
    right: 8px;
    font-size: 18px;
    top: 12px;
    cursor: pointer;
}
.iSeachEvenSun .search-form-sun{
        position: relative;
        &.el-icon-search:before {
            position: absolute;
            font-size: 18px;
            right: 10px;
            top: 10px;
            background: #fff;
            font-weight: 900;
        }
}
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }   
 .userTelePhoneSaveBut{
    margin: 0 auto 30px auto;
    width: 430px;
    div{
        width: 50px;
        height: 30px;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        border-radius: 6px;
        background: #9E0E00;
        color: #fff;    
        margin: auto;    
    }
}     
</style>
<style>
.userSelectListBtn .usersTitle{
    /* width: 70px; */
    text-align: left;
    padding: 0 12px 0 0;
    color: #606266;
    font-size: 14px;
    margin-bottom: 15px;
}
.telePhoneTextareas{
    height: 200px!important;
    resize: none!important;
    display: block;
    width: 200px;
    border-radius: 5px;
    border-color:#ddd;
    padding: 25px;
    line-height: 20px;
    padding: 25px;
    font-size: 14px;
}
.learnNumber{
    width: 200px;
    margin: auto;
}
.courseSelectListBtn,.userSelectListBtn{
        /* display: -webkit-inline-box; */
        margin: 15px 0;
}
.usersCount{
    display: -webkit-inline-box;
    margin: 15px 0;
    min-width: 450px;
}
.usersCount .usersList{
    height: 200px;
    overflow:auto;
    width: 200px;
    background: #fff;
    margin-left: 40px;
    padding: 0 0 0 10px;
}
.usersCount .usersList .usersListCount{
    position: relative;
}
.usersCount .usersList .usersListCount i{
    position: absolute;
    top: 8px;
    right: 0px;    
}
.usersCount .usersList .usersListCount p{
    line-height: 30px;
    font-size: 14px;
    color: #606266;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;     
    width: 90%;
}
</style>

