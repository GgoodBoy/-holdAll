<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col class="lRight-r lMarginTop20">
                <el-row>
                    <el-col :span="5">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                    placeholder="输入批次查询"
                                    class="search-form"
                                    width="100%"></el-input>
                                    <i class="el-icon-search" @click="search"></i>   
                        </div>
                    </el-col>
                    <el-col :span="4">
                            <el-row>
                                <el-col :span="8" class="lCenter-r">状态 : </el-col>
                                <el-col :span="15" :offset="1">
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
                    <el-col :span="1"  :offset="1"><el-button class="redBackColor butColorF" @click="findInfo">查询</el-button></el-col>
                    <el-col :span="2" :offset="11"><el-button class="redBackColor butColorF" @click="creatlearnCard">生成学卡</el-button></el-col>
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
                        prop="batch"
                        label="批次名称"
                        align="center"
                        min-width="150">
                    </el-table-column>                    
                    <el-table-column
                        prop="price"
                        label="面额"
                        align="center"
                        min-width="60"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        label="张数"
                        align="center"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="activitionNum"
                        label="已领用"
                        align="center"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="creatorName"
                        label="生成人"
                        align="center"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="receiveValidatily"
                        :show-overflow-tooltip="true"
                        label="有效期至"
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
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="240"
                        >
                        <template slot-scope="scope">
                            <el-row>                                
                                <el-col :span="8">
                                    <el-button type="text" :disabled="scope.row.status==1?false:true" v-bind:class="{ 'black-btn-ok': scope.row.status==1?true:false, 'black-btn-no': scope.row.status==1?false:true }" class="black-btn" @click="cancelBatch(scope.row,1)">
                                        <span v-if="scope.row.status==1">作废本批次</span>
                                        <span v-else>本批次已作废</span>
                                    </el-button>                                    
                                </el-col>
                                <el-col :span="8">
                                    <!-- v-if="flags.includes('common:export')" -->
                                    <el-button type="text" class="black-btn" @click="exportTable(scope.row)">导出</el-button>
                                </el-col>
                                <el-col :span="8"> 
                                    <el-button class="black-btn" type="text" v-if="urlScienceBools===2" :class="`copyurl${scope.row.id}`"  @click="copyUrl(scope.row.id)">复制链接</el-button>
                                    <el-button class="black-btn" type="text" v-else :class="`copyurl${scope.row.id}`"  @click="copyUrl(scope.row.id)">复制链接</el-button> 
                                    <input type="text" :id="`copyurl${scope.row.id}`" style="opacity: 0">                                      
                                </el-col>                                                                
                                <el-col :span="8">
                                    <el-button type="text" class="black-btn" @click="removeBatch(scope.row,2)">删除</el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="text" class="black-btn" @click="inquiryBatch(scope.row)">查看</el-button>
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
                                <el-button class="redBackColor butColorF" @click="isOkEven(titleNameType)">确 定</el-button>                        
                            </el-col>                        
                        </el-row>
                    </el-col>
                </el-row>
        </el-dialog>        
        <el-dialog
        title=""
        :visible.sync="centerDialogVisible"
        :close-on-click-modal='false'
        width="80%"
        center>
                <div class="iSeachEvenSun">
                    <el-input v-model.trim="cardNumSun"
                            placeholder="输入卡号查询"
                            class="search-form-sun"
                            width="100%"></el-input>
                            <i class="el-icon-search" @click="searchSun"></i>   
                </div>        
                <el-table :data="gridData" v-loading="loadingSun">
                    <el-table-column min-width="60" property="sortId" label="序号"></el-table-column>
                    <el-table-column min-width="80" property="batch" label="批次名称"></el-table-column>
                    <el-table-column min-width="200" property="cardNum" label="学卡"></el-table-column>
                    <el-table-column min-width="150" property="password" label="密码"></el-table-column>
                    <el-table-column min-width="150" property="price" label="面额"></el-table-column>
                    <el-table-column min-width="60" property="statusStr" label="状态"></el-table-column>
                    <el-table-column min-width="200" property="bindPhone" label="关联账户"></el-table-column>
                    <el-table-column min-width="200" property="activitionTime" label="激活时间"></el-table-column>
                    <el-table-column min-width="150" property="receiveValidatilyDay" label="有效期至"></el-table-column>
                    <!-- <el-table-column min-width="100" property="courseNames" label="课程" :show-overflow-tooltip="true"></el-table-column>                  -->
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
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import Clipboard from 'clipboard';
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
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            pageAtionSun:{
                pageTotalSun:0,
                paginationPageSun:1
            },          
            value:-1,
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
            dialogTableVisible:false,
            gridData: [
                {
                    "sortId":0,
                    "orderNumber":1,
                    "bindPhone": null,
                    "activitionTime": null,
                    "cardNum": "990102019012900010",
                    "receiveValidatilyDay": "2019-01-29",
                    "statusStr": "正常",
                    "name": "那么",
                    "password": "b1q9xst",
                    "courseNames": "斗破苍穹"
                }
            ],
            titleList:[
                    {
                        name:'营销',
                        pathInfo:'/marketelistlist'
                    },
                    {
                        name:'学习卡',
                        pathInfo:''
                    }
            ],
            urlScienceBools:1,
            titleNameType:1,
            chooserows:'',
            passwordID:'',
            copyUrlInfo:''
        }
    },
   components:{
        breadcrumb
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
        this.getStudylist(1);
    },
    methods:{
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
        inquiryBatch(rows){
            var self = this;
            self.idSun = rows.id;
            self.cardNumSun = rows.cardNum;
            self.getStudylistSun(1); 
            self.centerDialogVisible = true;  
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
        exportTable(rows){
            var self = this;
            console.log(rows);
            var parems = {
                token:getToken(),
                id:rows.id
            };
            self.download2(self.$server.newAllExport(parems));            
        },   
        removeBatch(rows,num){
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
        //搜索
        search(){
            this.getStudylist(1);
        },
        searchSun(){
            this.getStudylistSun(1);
        },        
        //查询
        findInfo(){
            this.getStudylist(1);
        },
        //创建学习卡
        creatlearnCard(){
            this.$router.push({path:"/marketelist/learningCard/creatLearningCard"});
        },
        //状态筛选
        chooseVersionType(e){
            this.value = e;
        },
        getStudylistSun(num){
            var self = this;
            if(num){
                self.pageNoSun = num;
            }
            self.loadingSun = true; 
            var params = {
                id:self.idSun,
                cardNum:self.cardNumSun,
                pageNo:self.pageNoSun,
                pageSize:self.pageSizeSun
            };
            self.$http.get(self.$server.batchListInfo(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                    //正序
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
        getStudylist(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            var params = {
                type:1,
                keyword:self.title,
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
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        },
        childPageValueSun(num){
            if(Number(num)>0){
                this.getStudylistSun(Number(num))
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


