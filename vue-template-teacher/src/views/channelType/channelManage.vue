<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col class="lSize18">渠道管理</el-col>
            <el-col class="lRight-r">
                <el-row>
                    <el-col :span="5">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                    placeholder="输入渠道名称"
                                    class="search-form"
                                    width="100%"
                                    clearable
                                    @keyup.native="proving1"
                                    ></el-input>
                        </div>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-row :gutter="10">
                            <el-col class="lLeft-r">
                                    <label style="fontSize:14px">渠道名称:</label>
                                    <el-select v-model="channelType"
                                            clearable
                                            style="width:70%"
                                            placeholder="全部">
                                        <el-option v-for="(item,i) in channelTypeList"
                                                :key="i"
                                                :label="item.name"
                                                :value="item.id"></el-option>
                                    </el-select>                        
                            </el-col>
                            <!-- <el-col :span="11" class="lLeft-r"><el-button class="redBackColor butColorF"  @click="findInfo">查询</el-button></el-col> -->
                        </el-row>
                    </el-col>                    
                    <el-col :span="1"  :offset="1" v-if="$authJudge('channel:select')"><el-button class="redBackColor butColorF" @click="search">查询</el-button></el-col>
                    <el-col :span="2" :offset="9" v-if="$authJudge('channel:add')"><el-button class="redBackColor butColorF" @click="creatlearnCard">创建渠道</el-button></el-col>
                </el-row>
            </el-col>
        </el-row>  
        <el-row>
            <!-- ：序号、渠道ID、渠道名称、创建时间、创建人、操作 -->
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
                        prop="channelId"
                        label="渠道ID"
                        align="center"
                        min-width="100">
                    </el-table-column>                    
                    <el-table-column
                        prop="name"
                        label="渠道名称"
                        align="center"
                        min-width="120"
                        >
                    </el-table-column>   
                    <el-table-column
                        label="渠道类型"
                        align="center"
                        min-width="120"
                        >
                        <template slot-scope="scope">
                            <el-row class="lCenter-r"> 
                                <el-col v-if='scope.row.channelType==1'>
                                    用户渠道
                                </el-col> 
                                <el-col v-if='scope.row.channelType==2'>
                                    课程渠道
                                </el-col>                                 
                            </el-row>                                                      
                        </template>                        
                    </el-table-column>                                  
                    <el-table-column
                        prop="createdAt"
                        label="创建时间"
                        align="center"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="creatorName"
                        label="创建人"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="120"
                        >
                        <template slot-scope="scope">
                            <el-row> 
                                <el-col :span="11" v-if="$authJudge('channel:edit')">
                                    <el-button type="text" class="black-btn" @click="channeUpdateEven(scope.row)">修改</el-button>
                                </el-col>                                                                                               
                                <el-col :span="11" :offset="2" v-if="$authJudge('channel:del')">
                                    <el-button type="text" class="black-btn" @click="channeRemoveBatch(scope.row)">删除</el-button>
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
        <el-dialog :title="'创建渠道'" width="25%" :visible.sync="dialogTableVisible" :close-on-click-modal='false'>
                        <el-row class="lLine30">
                            <el-col class="lCenter-r">
                                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                    <el-form-item label="渠道名称" prop="channelName">
                                        <el-row>
                                            <el-col :span="20">
                                                <el-input v-model.trim="ruleForm.channelName"
                                                    placeholder="请输入渠道名称"
                                                    class="search-form"
                                                    maxlength="20"
                                                    width="100%"></el-input>                                                 
                                            </el-col>
                                            <el-col :span="4" class="lCenter-r"><span>{{ruleForm.channelName.length||0}}/20</span></el-col>
                                        </el-row>                                       
                                    </el-form-item>    
                                    <el-form-item label="渠道类型" prop="channelType">    
                                        <el-row>
                                            <el-col :span="20" class="lLeft-r">
                                                <el-select v-model="ruleForm.channelType"
                                                        clearable
                                                        style="width:100%"
                                                        placeholder="全部">
                                                    <el-option v-for="(item,i) in channelTypeList"
                                                            :key="i"
                                                            :label="item.name"
                                                            :value="item.id"></el-option>
                                                </el-select>                   
                                            </el-col>
                                        </el-row>     
                                    </el-form-item>                                                            
                                    <!-- <el-form-item label="渠道ID" prop="channelId">
                                        <el-row>
                                            <el-col :span="20">
                                                <el-input v-model.trim="ruleForm.channelId"
                                                    placeholder="数字、字母、数字字母组合"
                                                    class="search-form"
                                                    maxlength="6"
                                                    width="100%"></el-input>                                                 
                                            </el-col>
                                            <el-col :span="4" class="lCenter-r">
                                                <span>{{ruleForm.channelId.length||0}}/6</span>
                                            </el-col>  
                                        </el-row>                                      
                                    </el-form-item> -->
                                </el-form>
                            </el-col>
                        </el-row>                        
                        <el-row  class="lLine30 lMarginTop40">
                            <el-col class="lCenter-r">
                                <el-button @click="isNoEven()">取 消</el-button>
                                <el-button type="primary" @click="isOkEven('ruleForm')">确 定</el-button>                        
                            </el-col>                        
                        </el-row>
        </el-dialog>        
        <el-dialog
        :visible.sync="centerDialogVisible"
        :close-on-click-modal='false'
        title="修改"
        width="25%">    
            <el-row class="lLine30 lMarginBO20">
                <el-col :span="4" class="lRight-r">渠道ID</el-col> 
                <el-col :span="18" :offset="2" class="lLeft-r">
                    <p>{{channelIDInfo}}</p>
                </el-col>
            </el-row>            
            <el-row class="lLine30">
                <el-col :span="4" class="lRight-r">渠道名称</el-col> 
                <el-col :span="16" :offset="2" class="lCenter-r">
                    <el-input v-model.trim="channelnewName"
                        placeholder="输入渠道ID"
                        class="search-form"
                        maxlength="20"
                        width="100%"></el-input>                                
                </el-col>
                <el-col :span="2" class="lCenter-r"><span>{{channelnewName.length||0}}/20</span></el-col> 
            </el-row>                         
            <el-row  class="lLine30 lMarginTop40">
                <el-col class="lCenter-r">
                    <el-button @click="isChannelNoEven()">取 消</el-button>
                    <el-button type="primary" @click="isChannelOkEven()">确 定</el-button>                        
                </el-col>                        
            </el-row>                    
        </el-dialog>    
        <el-dialog
        title="删除"
        :visible.sync="channelDelDialogVisible"
        width="30%"
        > 
            <el-row class="lLine30">
                <el-col class="lCenter-r">确定要删除这个渠道吗</el-col>
            </el-row>                         
            <el-row  class="lLine30 lMarginTop40">
                <el-col class="lCenter-r">
                    <el-button @click="isChannelNoEvenTwo()">取 消</el-button>
                    <el-button type="primary" @click="isChannelOkEvenTwo()">确 定</el-button>                        
                </el-col>                        
            </el-row>                    
        </el-dialog> 
        <el-dialog
        title=""
        :visible.sync="delDialogVisibleBool"
        width="30%"
        center> 
            <el-row class="lLine30">
                <el-col class="lCenter-r">该渠道不可删除，已有用户标识为该渠道用户。</el-col>
            </el-row>                         
            <el-row  class="lLine30 lMarginTop40">
                <el-col class="lCenter-r">
                    <el-button type="primary" @click="ChannelDelEvenIsNo(1)">确 定</el-button>                        
                </el-col>                        
            </el-row>                    
        </el-dialog>     
        <el-dialog
        title=""
        :visible.sync="delDialogChannelBool"
        width="30%"
        center> 
            <el-row class="lLine30">
                <el-col class="lCenter-r">该渠道不可删除，已有课程标为该渠道，请先删除该渠道下面的课程。</el-col>
            </el-row>                         
            <el-row  class="lLine30 lMarginTop40">
                <el-col class="lCenter-r">
                    <el-button type="primary" @click="ChannelDelEvenIsNo(2)">确 定</el-button>                        
                </el-col>                        
            </el-row>                    
        </el-dialog>                               
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data(){
 var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {
                // case "channelId":
                //     let regExp = /^[0-9a-zA-Z]*$/g;
                //     if (value===""||value==0) {
                //         return callback(new Error('请输入渠道ID'));
                //     }else{
                //         if(!regExp.test(value)){
                //             callback(new Error('渠道ID为数字,字母或者数字加字母'))
                //         }else{
                //             callback()
                //         }
                //     }
                // break; 
                case "channelName":
                    let regExps = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g;
                    if (value===""||value==0) {
                        return callback(new Error('请输入渠道名称'));
                    }else{
                        if(regExps.test(value)){
                            callback(new Error('渠道名称为数字,字母,汉字'))
                        }else{
                            callback()
                        }
                    }
                break;                                
            }
        };                        
        return {
          tableData: [],
          pageNo:1,
          pageSize:10, 
          pageAtion:{
            pageTotal:0,
            paginationPage:1
          },       
          centerDialogVisible: false,
          dialogTableVisible:false,
          channelDelDialogVisible:false,
          delDialogVisibleBool:false,
          delDialogChannelBool:false,
          urlScienceBools:1,
          channelIDInfo:'',
          channelIDs:"",
          channelnewName:'',
          oldChannelnewName:'',
          title:'',
          loading:true,
          channelType:'',
          //渠道类型
          channelTypeList:[
              {
                  name:'用户渠道',
                  id: 1
              },
{
                  name:'课程渠道',
                  id: 2
              }              
          ],
          ruleForm: {
            //   channelId:'',
              channelType:'',
              channelName:''
          },
          disabledState:false,
          rules: {
                // channelId:[{ required: true,validator:checkAge, trigger: 'blur' }],
                channelName:[{ required: true, validator:checkAge, trigger: 'blur' }],
                channelType: [
                    { required: true, message: '请选择渠道类型', trigger: 'change' }
                ]              
          }
        }
    },
    created(){
        if(this.environmenttarget=='prod'){
            this.urlScienceBools = 1;
        }else if(this.environmenttarget=='beta'){
            this.urlScienceBools = 2;
        }else{
            this.urlScienceBools = 1;
        };
        this.getStudylist(1);
    },
    methods:{
        proving1(){
            this.title=this.title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'');
        },        
        isChannelNoEven(){
            this.centerDialogVisible = false;
        },
        isChannelOkEven(){
            var self = this; 
            var params = {
                name:self.channelnewName,
                id:self.channelIDs
            };
            if(self.oldChannelnewName == self.channelnewName){
                 this.centerDialogVisible = false;
                 return;
            }
            self.$http.post(self.$server.channelUpdate,params).then(res=>{
                switch (res.status) {
                    case 200:
                        self.centerDialogVisible = false;
                        self.getStudylist(1);                     
                        break;
                    case 417:
                        self.$message.error(res.content.msg);
                        break; 
                }
            })
        },
        isChannelNoEvenTwo(){
            this.channelDelDialogVisible = false;
        },
        isChannelOkEvenTwo(rows){
            var self = this;
            self.channelDelDialogVisible = false;
            var params = {
                id:self.channelIDs
            };
            self.$http.post(self.$server.channelDel(params)).then(res=>{
            switch (res.status) {
                case 200:
                        self.channelDelDialogVisible = false;
                        self.getStudylist(1);                       
                    break;
                case 417:
                        self.delDialogVisibleBool = true;
                    break; 
                }                        
            }) 
        }, 
        ChannelDelEvenIsNo(num){
            if(num==1){
                this.delDialogVisibleBool = false;
            }else{
                this.delDialogChannelBool = false;
            }
            
        },               
        isNoEven(){
            this.dialogTableVisible = false;
        },
        isOkEven(formName){  
            var self = this; 
            this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var params = {
                            name:self.ruleForm.channelName,
                            // channelId:self.ruleForm.channelId,
                            channelType:self.ruleForm.channelType
                        };
                        if(!self.disabledState){
                            self.disabledState = !self.disabledState;                           
                            self.$http.post(self.$server.channelAdd,params).then(res=>{
                                switch (res.status) {
                                    case 200:
                                            self.disabledState = !self.disabledState;
                                            self.dialogTableVisible = false;
                                            self.getStudylist(1);                       
                                        break;
                                    case 417:
                                            self.disabledState = !self.disabledState;
                                            self.$message.error(res.content.msg);
                                        break; 
                                    default:
                                        self.disabledState = !self.disabledState;
                                        console.log('1');
                                        break;
                                    }                       
                            }).catch(()=>{
                                self.disabledState = !self.disabledState;
                            })
                        }
  
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
            });                        
        },
        channeUpdateEven(rows){
            var self = this;
            self.channelIDInfo = rows.channelId;
            self.oldChannelnewName = rows.name;
            self.channelnewName = rows.name;
            self.channelIDs = rows.id;
            self.centerDialogVisible = true;  
        },   
        channeRemoveBatch(rows){
            if(rows.ifNull==1){
                this.delDialogChannelBool = true;
                return;
            }            
            this.channelIDs = rows.id;
            this.channelDelDialogVisible = true;
        },                        
        //搜索
        search(){
            console.log("搜索");
            this.getStudylist(1);
        },
        //创建学习卡
        creatlearnCard(){
            console.log("创建渠道");
            // this.ruleForm.channelId='';
            this.ruleForm.channelName='';
            this.ruleForm.channelType='';
            this.dialogTableVisible = true;
        },
        getStudylist(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            var params = {
                name:self.title,
                pageNo:self.pageNo,
                pageSize:self.pageSize,
                channelType:self.channelType
            };
            self.$http.get(self.$server.channelAllList(params)).then(res=>{
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
                console.log(res);
            })            
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        }
    },
    components:{},
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
    width: 25%;
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
.black-btn-ok{
    color:#9E0E00 !important; 
} 
.black-btn-no{
    color: #cccccc !important;
}   
</style>


