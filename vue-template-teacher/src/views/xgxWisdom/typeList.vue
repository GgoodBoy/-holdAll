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
                            <el-col :span="20" style="text-align: left;">
                                <el-input v-model.trim="title"
                                        placeholder="输入分类名称查询"
                                        class="search-form"
                                        width="100%"
                                        clearable
                                        style="width:200px"
                                        @keyup.native="proving1"
                                        >
                                </el-input>                                                                           
                                <el-button v-if="$authJudge('wisdomplatform:classifies:select')" type="primary"  @click="searchMemberQuery()">查询</el-button>
                            </el-col>
                            <el-col :span="4" style="text-align: right;">
                                <el-button type="primary" v-if="$authJudge('wisdomplatform:classifies:edit')"  @click="telePhoneAdd">添加分类</el-button>
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
                    prop="name"
                    label="分类名称"
                    align="center"
                    min-width="120">                                        
                </el-table-column>  
                <el-table-column
                    prop="creator"
                    label="创建人"
                    align="center"
                    min-width="120">                    
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="创建时间"
                    align="center"
                    min-width="100">                 
                </el-table-column>    
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="180"
                    >
                    <template slot-scope="scope">
                        <el-button type="text" v-if="$authJudge('wisdomplatform:classifies:edit')" @click='operation(2,scope.row)'>修改</el-button>  
                        <el-button type="text" v-if="$authJudge('wisdomplatform:classifies:del')" @click='operation(1,scope.row)'>删除</el-button>                                                               
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
                <p>确定要删除这个分类吗？</p>
            </div>
            <div style='margin-top:20px;'>
                <el-button type="info" @click="closeDialog(1)">取消</el-button>
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
                分类名称 : <el-input v-model="inputDays" style='width:200px;' maxlength='6' placeholder="请输入分类名称。"></el-input>
                <span>{{inputDays.length||0}}/6</span> 
            </div>
            <div style='margin-top:20px;'>
                <el-button type="info" @click="closeDialog(2)">取消</el-button>
                <el-button type="primary" @click="submitDialog(2)">确认</el-button>
            </div>
    </el-dialog>
</div>
</template>
<script>
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
        data(){
        return {
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            }, 
            pageSize:10,
            pageNo:1,
            title:'',
            inputDays:'',
            titleList:[
                        {
                            name:'国学智慧平台',
                            pathInfo:''
                        },
                        {
                            name:'分类管理',
                            pathInfo:''
                        }                
            ],
            tableData:[],
            specialTypeDetailOne:false,
            specialTypeDetailTwo:false,
            loading:false,
            //新的项目参数
            id:'',
            selectData:'',
            isAdd:true
        };
        },
        created() {
            this.id = this.$route.query.id;
            this.getStudylist(1);
        },
        watch:{},         
        components:{
            breadcrumb
        },        
        methods: { 
            //弹框确定
            submitDialog(type){
                switch (type) {
                    case 1:
                        this.banOrEnable();
                        break;
                    case 2:
                        this.addDaysEven();
                        break;
                    default:
                        break;
                }
            },
            banOrEnable(){
                this.$http.post(this.$server.getDelClassifies+this.selectData.id,{}).then(res=>{
                    if(res.status==200){
                        this.specialTypeDetailOne = false;
                        this.getStudylist(1);
                    }
                })                
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
                
                    default:
                        break;
                }
            },      
            //追加天数接口
            addDaysEven(){
                // let regExp = /^[0-9]*$/g;
                // if(!regExp.test(this.inputDays)){
                //     this.$message.error("追加天数为整数");
                //     return;
                // }
                // if(this.inputDays<1||this.inputDays>2000){
                //     this.$message.error("追加天数在1-2000");
                //     return;
                // }               
                 if(!this.inputDays){
                    this.$message.error("请填写信息。");
                    return;
                }
                var params = {
                    name:this.inputDays
                };
                if(!this.isAdd){
                    params['id'] = this.selectData.id;
                }
                this.$http.post(this.$server.getEditClassifies,params).then(res=>{
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
                this.inputDays = data.name;
                switch (type) {
                    case 1:
                        this.specialTypeDetailOne = true;
                        break;
                    case 2:
                        this.isAdd = false;
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
                this.inputDays = '';
                this.isAdd = true;
                this.specialTypeDetailTwo = true;
            },               
            searchMemberQuery(){
                this.getStudylist(1);
            },
            getStudylist(num){
                var self = this;
                if(num){
                    self.pageNo = num;
                }
                self.loading = true; 
                var query = {
                    params:{
                        name:self.title||'',
                        pageSize:self.pageSize,
                        pageNo:self.pageNo
                    }          
                };
                self.$http.get(self.$server.getClassifiesList,query).then(res=>{
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
        }            
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


