<template>
    <div>        
        <el-row class="lLine40 headerDiv">
            <!-- <el-col class="lLeft-r lSize18">邀请好友</el-col> -->
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>            
            <el-col class="lMarginTop20">
                <el-row>
                    <el-col :span="5">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                    placeholder="请输入课程名称"
                                    class="search-form"
                                    width="100%"
                                    maxlength="20"
                                    @keyup.native="proving1"
                                    ></el-input>
                        </div>
                    </el-col>
                    <el-col v-if="$authJudge('market:invitationfriend:select')" :span="2" :offset="1"><el-button class="redBackColor butColorF" @click="seach">查询</el-button></el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
             <el-col>
                <el-table
                :data="tableData"
                v-loading="loading"
                border
                style="width: 100%">
                <el-table-column
                    prop="courseName"
                    label="课程名称"
                    align="center"
                    min-width="300"
                    :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                    prop="shareMax"
                    label="分享上限"
                    align="center"
                    min-width="100"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="receiveMax"
                    min-width="80"
                    align="center"
                    label="领取上限"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="receiveNum"
                    label="领取数量"
                    align="center"
                    min-width="100">
                </el-table-column>
                <el-table-column
                    prop="buyNum"
                    label="购买数量"
                    align="center"
                    min-width="100"
                    show-overflow-tooltip>
                </el-table-column> 
                <el-table-column
                    prop="name"
                    label="操作"
                    align="center"
                    min-width="80"
                    show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-row> 
                                <el-col v-if="$authJudge('market:invitationfriend:set')">
                                    <el-button type="text" class="black-btn" @click="channeUpdateEven(scope.row)">设置</el-button>
                                </el-col>
                            </el-row>                                                      
                        </template>                    
                </el-table-column>                                                              
                </el-table>                 
             </el-col>
            <el-col class="block">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="childPageValue"
                    :current-page.sync="pageAtion.paginationPage"
                    :total="pageAtion.pageTotal">
                </el-pagination>
            </el-col>             
        </el-row>
        <el-dialog
        :visible.sync="centerDialogRejectSee"
        :close-on-click-modal='false'
        max-height="300"
        width="40%">  
            <el-row class="lSize16">
                <el-col class="lLine30 lMarginTop10 lCenter-r">
                    邀请好友设置
                </el-col>
                <el-col>
                    <el-row :gutter="40">
                        <el-col :span="4" :offset="2">课程名称</el-col>
                        <el-col :span="12">{{InvitationDate.courseName}}</el-col>
                    </el-row>
                </el-col>
                <el-col class="lMarginTop30">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                        <el-form-item label="邀请开关" prop="setUpSwitch">
                            <el-radio-group v-model="ruleForm.setUpSwitch" @change="radioSwitch">
                                <el-radio :label="0">关</el-radio>
                                <el-radio :label="1">开</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="分享上限" prop="setUpShareMax">
                            <el-row>
                                <el-col>
                                    <el-radio-group v-model="ruleForm.setUpShareMax" @change="radioShareMax">
                                        <el-radio :label="0">不限</el-radio>
                                        <el-radio :label="1"><el-input @keyup.native="proving" :disabled="disabledShareMax" v-model="inputShareMax" placeholder="请输入内容,限1-99"></el-input><span v-show="shareMaxBool" class="lMarginTop10 redFontColor">*请输入内容</span></el-radio>
                                    </el-radio-group>
                                </el-col>
                                <el-col>
                                    例如分享上限设为10，则该课程的付费用户最多可将该课程内的10节内容送给好友免费看。                                    
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="领取上限" prop="setUpReceiveMax">
                            <el-row>
                                <el-col>
                                    <el-radio-group v-model="ruleForm.setUpReceiveMax" @change="radioReceiveMax">
                                        <el-radio :label="0">不限</el-radio>
                                        <el-radio :label="1"><el-input @keyup.native="proving2" :disabled="disabledReceiveMax" v-model="inputReceiveMax" placeholder="请输入内容,限1-99"></el-input><span v-show="receiveMaxBool" class="lMarginTop10 redFontColor">*请输入内容</span></el-radio>
                                    </el-radio-group>                                    
                                </el-col>
                                <el-col>
                                    例如领取上限设为10，该课程的付费用户分享该课程的某个内容后，前10名好友领取后可免费试看该内容。
                                </el-col>
                            </el-row>
                        </el-form-item>                                        
                    </el-form>                    
                </el-col>
                <el-col  class="lSize16 lCenter-r">
                    <el-button class="redBackColor butColorF" @click="setupSave('ruleForm')">确定</el-button>
                </el-col>                
            </el-row>
        </el-dialog>                                        
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){                                                             
        return {
            title:'',
            tableData: [],
            ruleForm:{
                setUpSwitch:0,
                setUpShareMax:0,
                setUpReceiveMax:0
            },
            rules: {
                setUpSwitch: [
                    { required: true, message: '请设置邀请开关', trigger: 'change' }
                ],
                setUpShareMax: [
                    { required: true, message: '请设置分享上限', trigger: 'change' }
                ],
                setUpReceiveMax: [
                    { required: true, message: '请设置领取上限', trigger: 'change' }
                ]
            },  
        disabledShareMax:true,
        disabledReceiveMax:true, 
        inputSwitch:'',
        inputReceiveMax:'',
        receiveMaxBool:false,
        inputShareMax:'',
        shareMaxBool:false,
        pageSize:10,
        loading:false,
        pageNo:1,
        InvitationDate:'',
        pageAtion:{
            pageTotal:0,
            paginationPage:1
        },          
        centerDialogRejectSee:false,  
        titleList:[
                    {
                        name:'系统合集',
                        pathInfo:'/marketelistlist'
                    },
                    {
                        name:'好友邀请系统',
                        pathInfo:''
                    }
            ]            
        }
    },
    components:{
        breadcrumb
    },    
    created(){
        this.getInvitationCodeList(1);
    },
    methods:{
        proving(){
            var self = this;
                var reg = /^([1-9]\d|\d|-1)$/;
                if(!reg.test(self.inputShareMax)){
                    this.inputShareMax='';
                }            
        },
        proving1(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.title)){
                this.title='';
            }            
        },
        proving2(){
            var self = this;
            var reg = /^([1-9]\d|\d|-1)$/;
            if(!reg.test(self.inputReceiveMax)){
                this.inputReceiveMax='';
            }            
        },
        radioSwitch(data){
            this.inputSwitch = Number(data);
        },
        radioShareMax(data){
            if(Number(data)>0){
                this.disabledShareMax = false;
                this.shareMaxBool = true;
            }else{
                this.disabledShareMax = true;
                this.shareMaxBool = false;
                this.inputShareMax = '';
            }
        },
        radioReceiveMax(data){
            if(Number(data)>0){
                this.disabledReceiveMax = false;
                this.receiveMaxBool = true;
            }else{
                this.disabledReceiveMax = true;
                this.receiveMaxBool = false;
                this.inputReceiveMax = '';
            }
        },
        setupSave(formName){
            var self = this;
            if(!self.disabledShareMax){
                if(!self.inputShareMax){
                    self.shareMaxBool = true;
                    return;
                }else{
                     self.shareMaxBool = false;
                }
            }
            if(!self.disabledReceiveMax){
                if(!self.inputReceiveMax){
                    self.receiveMaxBool = true;
                    return;
                }else{
                    self.receiveMaxBool = false;
                }
            } 
            self.$refs[formName].validate((valid) => {
                if (valid) {
                        var parems = {
                            courseId:self.InvitationDate.courseId,
                            state:self.ruleForm.setUpSwitch,
                            shareMax:self.inputShareMax||0,
                            receiveMax:self.inputReceiveMax||0
                        };
                        self.$http.post(self.$server.invitationCodeSet,parems).then(res=>{
                                    if(res.status==200){
                                        this.centerDialogRejectSee = false;
                                        this.getInvitationCodeList(1);
                                    }
                        })                     
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });            
        },
        seach(){
            this.getInvitationCodeList(1);
        },
        getInvitationCodeList(num){
           var self = this;
            if(num){
                self.pageNo = num;
            }            
            var parems = {
                pageSize:self.pageSize,
                pageNo:self.pageNo,
                courseName:self.title
            };
            self.loading = true;
            self.$http.get(self.$server.invitationCodeLists(parems)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   self.allCodeReactListNum = contentdate.total;
                   if(contentdate.list.length){
                       if(!nextPage&&prePage!=0){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = (prePage+1)*10+index+1;
                                return element;
                            });
                        }else if(!prePage&&!nextPage){
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
                   } 
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loading = false; 
               }
                console.log(res);
            }).catch((err)=>{
                self.loading = false;
            })
        },
        channeUpdateEven(data){
            this.InvitationDate = data;
                this.ruleForm.setUpSwitch=data.state||0;
                if(data.shareMax!=0){
                    this.ruleForm.setUpShareMax=1;
                    this.inputShareMax = data.shareMax;
                    this.disabledShareMax = false;
                }else{
                    this.ruleForm.setUpShareMax=0;
                    this.inputShareMax = '';
                    this.disabledShareMax = true;
                }
                if(data.receiveMax!=0){
                    this.ruleForm.setUpReceiveMax =1;
                    this.inputReceiveMax = data.receiveMax;
                    this.disabledReceiveMax = false;
                }else{
                    this.ruleForm.setUpReceiveMax =0;
                    this.disabledReceiveMax = true;
                    this.inputReceiveMax ='';
                }
                this.centerDialogRejectSee = true;
        },
        childPageValue(num){
           if(Number(num)>0){
                this.getInvitationCodeList(Number(num))
            } 
        },     
        //待审核
        allDialogIsNo(num){
            var self = this;
            switch (num) {
                case 1:
                    self.centerDialogExamine = false;
                    self.centerDialogReject = true;
                    break;
                case 2:
                    self.centerDialogReject = false;
                    break;                                                                                          
                default:
                    break;
            }
        }   
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
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
</style>


