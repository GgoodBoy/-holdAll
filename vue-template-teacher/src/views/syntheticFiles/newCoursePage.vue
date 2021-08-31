<template>
    <div>
        <el-row class="lSize24 lPadding20 lLine40 lMarginBO10 warryBackCss">
            <el-col :span="5" class="redFontColor">总用户:{{userNumer.userCount||0}}人</el-col>
            <el-col :span="6" class="redFontColor">今日已注册:{{userNumer.todayRegisterCount||0}}人</el-col>
        </el-row>
        <div class="headerDiv">
            <el-row :gutter="20">
                <el-col :span="18">
                    <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                </el-col>
                <el-col>
                    <el-row :gutter="3">
                        <el-col :span="6">
                            <el-input
                                    :placeholder="placeholderInfo"
                                    :maxlength="maxlengthNum"
                                    clearable=""
                                    v-model="input">
                            </el-input>
                        </el-col>        
                        <el-col :span="8">
                            <el-row class="lLine40">
                                <el-col :span="11" class="lCenter-r">
                                    <div>
                                        <el-date-picker
                                        v-model="dataStart"
                                        type="date"
                                        style="width:140px;"
                                        placeholder="注册开始时间">
                                        </el-date-picker>
                                    </div>
                                </el-col>
                                <el-col :span="11" class="lCenter-r">
                                    <div>
                                        <el-date-picker
                                        v-model="dataEnd"
                                        type="date"
                                        style="width:140px;"
                                        placeholder="结束时间">
                                        </el-date-picker>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>                       
                        <el-col :span="2" :offset="8" class="lCenter-r" v-if="$authJudge('user:users:select')"><el-button class="lButtom lSize16" @click="queryUserList">查询</el-button></el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <div>
            <div class="tabCss">
                <el-tag size="medium" :type="tableType?'danger':'info'" @click="selectTabs(1)">用户</el-tag>  
                <el-tag size="medium" :type="tableType?'info':'danger'" @click="selectTabs(2)">订单</el-tag>               
            </div>
            <div v-if="tableType">
                <el-table
                    :data="studyTableDataOne"
                    :border='false'
                    v-loading="loading"
                    empty-text='暂无拉新用户~~'
                    max-height="500"
                    style="width: 100%">
                        <el-table-column
                            prop="sortId"
                            label="序号"
                            align="center"
                            min-width="50">
                        </el-table-column>
                        <el-table-column
                            prop="nickname"
                            label="用户昵称"
                            align="center"
                            min-width="100">
                        </el-table-column>
                        <el-table-column
                            prop="cellphone"
                            label="手机号"
                            align="center"
                            min-width="200">
                        </el-table-column>
                        <el-table-column
                            prop="cellphoneProvinceName"
                            label="地区"
                            align="center"
                            min-width="100">
                        </el-table-column>
                        <el-table-column
                            prop="shareCourseName"
                            label="注册链接"
                            align="center"
                            :show-overflow-tooltip="true"
                            min-width="200">
                        </el-table-column>                
                        <el-table-column
                            prop="createdAt"
                            label="注册时间"
                            align="center"
                            min-width="200">
                        </el-table-column>
                </el-table>                
            </div>            
            <div v-else>
                <el-table
                    :data="studyTableDataTwo"
                    :border='false'
                    v-loading="loading"
                    empty-text='暂无购买记录~~'
                    max-height="500"
                    style="width: 100%">
                        <el-table-column
                            prop="sortId"
                            label="序号"
                            align="center"
                            min-width="50">
                        </el-table-column>
                        <el-table-column
                            prop="courseName"
                            label="课程名称"
                            align="center"
                            min-width="100">
                        </el-table-column>
                        <el-table-column
                            prop="shareCourseName"
                            label="促单连接"
                            align="center"
                            :show-overflow-tooltip="true"
                            min-width="200">
                        </el-table-column>
                        <el-table-column
                            prop="orderId"
                            :show-overflow-tooltip="true"
                            label="订单号"
                            align="center"
                            min-width="200">
                        </el-table-column>               
                        <el-table-column
                            prop="createdAt"
                            label="购课时间"
                            align="center"
                            min-width="200">
                        </el-table-column>               
                        <el-table-column
                            prop="orderStatusName"
                            label="订单状态"
                            align="center"
                            min-width="60">
                        </el-table-column>
                </el-table>                
            </div>
            <el-col class="block">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="childPageValue"
                    :current-page.sync="pageAtion.paginationPage"
                    :total="pageAtion.pageTotal">
                </el-pagination>
            </el-col>              
        </div>
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
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
        breadcrumb
    },
    data(){
        return {
            input:'',
            dataStart:'',
            dataEnd:'',
            userNumer:{},
            loading:false,
            studyTableDataOne:[],
            studyTableDataTwo:[],
            titleList:[
                {
                    name:'用户管理系统',
                    pathInfo:'/userFilesHome'
                },
                {
                    name:'用户管理',
                    pathInfo:'/userFilesHome'
                },
                {
                    name:'拉新',
                    pathInfo:''
                }                                                                                              
            ],
            tableType:true,
            placeholderInfo:'输入手机号查询',
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            }, 
            pageNo:1,
            pageSize:10,            
            selectType:1,
            qeryUserId:'',
            maxlengthNum:11
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
        }        
    },      
    created(){
        var self = this;
        this.qeryUserId = this.$route.query.userId;
        self.getListComeDate();
        this.getTableList(1);
    },
    props:{},
    computed:{},
    methods:{ 
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
        selectTabs(nums){
            this.selectType = nums;
            this.pageNo = 1;
            this.studyTableDataOne =[];
            this.studyTableDataTwo =[];
            this.input='';
            this.dataStart='';
            this.dataEnd='';            
            if(nums==1){
                this.maxlengthNum = 11;
                this.tableType = true;
                this.placeholderInfo='输入手机号查询';
            }else{
                this.tableType = false;
                this.maxlengthNum = 22;
                this.placeholderInfo='输入订单号查询';
            }
            this.getTableList(1);
        },
        queryUserList(){
            var self = this;
            this.getTableList(1);
        },
        childPageValue(num){
            if(Number(num)>0){
               this.getTableList(Number(num));
            }            
        },
        //渠道类型数据
        getListComeDate(){
            var self = this;
            self.$http.get(self.$server.getSelectUserCount).then(res=>{
                if(res.status){
                    self.userNumer = res.content;
                }
            })
        },
        getTableList(num){
            var self = this;    
            this.loading = true;
            if(num){
                self.pageNo = num;
            };
            let query = {};
            if(self.tableType){
                query = {
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        shareuserId:this.qeryUserId,
                        type:self.selectType,
                        cellphone:self.input,
                        beginAt:Number(self.dataStart)>0?self.formatDate(Number(self.dataStart)):'',
                        endAt:Number(self.dataEnd)>0?((Number(self.dataEnd)-Number(self.dataStart))==86399000?self.formatDate(Number(self.dataEnd)):self.formatDate(Number(self.dataEnd)+86399000)):''
                    }
                }
            }else{
                query = {
                    params:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        shareuserId:this.qeryUserId,
                        type:self.selectType,
                        orderId:self.input,
                        beginAt:self.dataStart,
                        endAt:self.dataEnd
                    }
                }
            }  
            this.$http.get(this.$server.getUserShareRecordLis,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    var contentdate = res.content;
                    var listIds = [];
                    listIds = contentdate.list.map(function(element,index){
                        if(contentdate.pageNum==1){
                            element.sortId = index+1;
                            return element;
                        }else if(contentdate.pageNum>1){
                            element.sortId = (contentdate.pageNum-1)*10+index+1;
                            return element;
                        }
                    });          
                    if(self.tableType){
                        self.studyTableDataOne = listIds;
                    }else{
                        self.studyTableDataTwo = listIds;
                    }
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage =self.pageNo;
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
                }
            }).catch(()=>{
                self.loading = false;
            })
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
.el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 160px !important;
}
.el-col_one{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
    .layoutFlex{
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        div{
            margin-right: 10px;
        }
    }
// body .el-table th.gutter {
//     display: table-cell !important
// }
.tabCss{
    padding: 10px 0;
}
</style>

