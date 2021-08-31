<template>
    <div>
        <el-row :gutter="20" class="lLine40">
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col :span="6" class="lRight-r">
                <el-input v-model.trim="title"
                    style="width:100%"
                    placeholder="请输入专题名称"
                    class="search-form"
                    width="100%"
                    clearable
                    maxlength="20">
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-row>
                    <el-col :span="8" class="lCenter-r">类型</el-col>
                    <el-col :span="16">
                        <el-select v-model="mType"
                                clearable
                                placeholder="类型">
                            <el-option v-for="(item,i) in courseLabelList"
                                    :key="i"
                                    :label="item.name"
                                    :value="item.value"></el-option>
                        </el-select>                                    
                    </el-col>
                </el-row>
            </el-col>            
            <el-col :span="2"><el-button v-if="$authJudge('activity:thematic:select')" class="redBackColor butColorF" @click="seach()">查询</el-button></el-col>  
            <el-col :span="12" style="text-align: right;">
                <el-button v-if="$authJudge('activity:thematic:add')" class="redBackColor butColorF" @click="releaseSpecial">发布新专题</el-button>
            </el-col>              
        </el-row>
        <el-row class="lMarginTop20">
            <el-col>
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="专题名称 "
                        align="center"
                        min-width="200">
                    </el-table-column>
                    <!-- <el-table-column
                        label="关联课程"
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="120">
                            <template slot-scope="scope">
                               <el-row>
                                <el-col v-for="(item,index) in scope.row.courseList" :key="index">
                                    {{item.courseName}}
                                </el-col>   
                               </el-row>
                            </template>                         
                    </el-table-column>   -->
                    <el-table-column
                        label="关联课程"
                        prop="courseNameList"
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="120">                         
                    </el-table-column>  
                    <el-table-column 
                        align="center"
                        label="类型"
                        min-width="80">
                        <template slot-scope="scope">
                            <P>{{scope.row.type==1?'成人':'少儿'}}</P>
                        </template>                                 
                    </el-table-column>                                                        
                    <el-table-column
                        prop="uptimeAt"
                        label="更新时间"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>
                    <el-table-column
                        label="地址"
                        align="center"
                        min-width="100">
                            <template slot-scope="scope">
                                <div v-if="$authJudge('activity:thematic:copylink')">
                                    <!-- <el-button v-if="urlScienceBools===2" :class="`copyurl${scope.row.id}`" :data-clipboard-text="`http://scm.youfushuyuan.com/#/receiveCouponH5?coupon=${scope.row.id}`" @click="copyEvenChange(scope.row.id)">复制</el-button>
                                    <el-button v-else :class="`copyurl${scope.row.id}`" :data-clipboard-text="`http://xgxm.xueguoxue.com/#/receiveCouponH5?coupon=${scope.row.id}`" @click="copyEvenChange(scope.row.id)">复制</el-button> -->
                                    <el-button class="black-btn" type="text" v-if="urlScienceBools===2" :class="`copyurl${scope.row.id}`"  @click="copyUrl(scope.row.id)">复制链接</el-button>
                                    <el-button class="black-btn" type="text" v-else :class="`copyurl${scope.row.id}`"  @click="copyUrl(scope.row.id)">复制链接</el-button> 
                                    <input type="text" :id="`copyurl${scope.row.id}`" style="opacity:0;position: absolute;">                                    
                                </div>
                            </template>                        
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        align="center"
                        min-width="100">
                            <template slot-scope="scope">
                                <div>{{scope.row.state==1?'上线':'下线'}}</div>
                            </template>                         
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="180">
                        <template slot-scope="scope">       
                            <el-button
                                    v-if="$authJudge('activity:thematic:edit')"
                                    type="text"
                                    class="black-btn"
                                    v-show='scope.row.state==2'
                                    @click="updateSpecial(scope.row)">修改</el-button> 
                            <el-button
                                    v-if="$authJudge('activity:thematic:offline')"
                                    type="text"
                                    class="black-btn"
                                    v-show="scope.row.state==1"
                                    @click="dialogSpecialEven(scope.row,scope.row.state)">下线</el-button>
                             <el-button
                                    v-if="$authJudge('activity:thematic:online')"
                                    type="text"
                                    class="black-btn"
                                    v-show="scope.row.state!=1"
                                    @click="dialogSpecialEven(scope.row,scope.row.state)">上线</el-button>
                            <el-button
                                    v-if="$authJudge('activity:thematic:del')"
                                    type="text"
                                    class="black-btn"
                                    v-show='scope.row.state==2'
                                    @click="dialogSpecialEven(scope.row,3)">删除</el-button>
                            <el-button
                                    v-if="$authJudge('activity:thematic:preview')"
                                    type="text"
                                    class="black-btn"
                                    @click="shareSpecial(scope.row)">预览</el-button>                                    
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
             width="30%" 
             :visible.sync="dialogSpecial">
                <el-row>
                    <el-col>
                        <el-row class="lLine30">
                            <el-col v-if="titleNameType==1" class="lCenter-r">确定要将该专题下线吗？</el-col> 
                            <el-col v-else-if="titleNameType==2" class="lCenter-r">确定要将该专题上线吗？</el-col>
                            <el-col v-else-if="titleNameType==3" class="lCenter-r">确定要删除该专题吗？</el-col>
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
            title="请选择专题类型"
            :visible.sync="specialTypeDetail"
            width="20%"
            class="lCenter-r">
                <el-button type="primary" @click="specialTypeEven(1)">成人专题</el-button>
                <el-button type="primary" @click="specialTypeEven(2)">少儿专题</el-button>
        </el-dialog>                     
    </div>
</template>
<script>
import Dialog from "@/components/myDialog/myDialog";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import Clipboard from 'clipboard';
import { getToken,setToken,removeToken} from '@/utils/auth';
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
    components:{
        Dialog,
        breadcrumb
    },    
    data(){
        return {
            tableData:[],
            loading:false,
            title:'',
            titleList:[
                        {
                            name:'活动',
                            pathInfo:'/activityObjList'
                        },
                        {
                            name:'专题列表',
                            pathInfo:''
                        }               
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            dialogSpecial:false,
            specialTypeDetail:false,
            titleNameType:1, 
            urlScienceBools:1,   
            pageSize:10,
            pageNo:1,
            selectData:'',
            mType:-1,
            courseLabelList:[
                {
                    name:'全部',
                    value:-1
                },                
                {
                    name:'成人',
                    value:1
                },
                {
                    name:'少儿',
                    value:2
                }                
            ],
            typeCreat:1       
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
    props:[],
    computed:{    
    },     
    methods:{
        //复制
       copyUrl(id){ 
             var self = this;
            switch (this.urlScienceBools) {
                case 1:
                    // self.copyUrlInfo = "https://xgxm.xueguoxue.com/activity/ThematicActivity.html?activityId="+encrypt(id+'',secret_key)
                    self.copyUrlInfo = "https://xgxm.xueguoxue.com/activity/ThematicActivity.html?activityId="+id
                    var input = document.querySelector('#copyurl'+id);
                        input.value = self.copyUrlInfo;
                        input.select();
                        if (document.execCommand('copy')) {
                            document.execCommand('copy');
                            self.$message.success({ message: "复制成功" });
                        }
                    break;
                case 2:
                    // self.copyUrlInfo = "https://scm.youfushuyuan.com/activity/ThematicActivity.html?activityId="+encrypt(id+'',secret_key)
                    self.copyUrlInfo = "https://scm.youfushuyuan.com/activity/ThematicActivity.html?activityId="+id
                    var input = document.querySelector('#copyurl'+id);
                        input.value = self.copyUrlInfo;
                        input.select();
                        if (document.execCommand('copy')) {
                            document.execCommand('copy');
                            self.$message.success({ message: "复制成功" });
                        }   
                    break;        
                default:
                    console.log("地址有误");
                    break;
            } 
        },   
        specialTypeEven(num){
            this.typeCreat = Number(num);
            this.specialTypeDetail = false;
            this.$router.push({path:'/activityObj/specialCreat',query:{mtype:this.typeCreat}});  
        },
        dialogSpecialEven(data,type){
           this.selectData = data;
           this.dialogSpecial = true;
           this.titleNameType = Number(type);
        },       
        updateSpecial(data){
            var self = this;
            self.$router.push({path:'/activityObj/specialCreat',query:{selectId:data.id,states:1}});            
        },
        upDownLineSpecial(data){
            var self = this;
            self.loading = true; 
            var urls = '';
            var parems = {
                id:data.id
            }
            if(data.state==1){
                urls = self.$server.thematicActivityDown(parems);
            }else{
                urls = self.$server.thematicActivityUp(parems);
            }
            this.$http.post(urls).then(res=>{
               if(res.status==200){
                   this.dialogSpecial = false;
                   this.selectData ='';
                   this.getStudylist(self.pageNo);  
               }
            })            
        },
        removeSpecial(data){
            var self = this;
            self.loading = true; 
            var parems = {
                id:data.id
            }
            this.$http.delete(this.$server.thematicActivityDelete(parems)).then(res=>{
               if(res.status==200){
                   this.dialogSpecial = false;
                   this.selectData ='';
                   this.getStudylist(self.pageNo);  
               }
            })            
        },
        shareSpecial(data){
            var self = this;
            self.$router.push({path:'/activityObj/specialCreat',query:{selectId:data.id,states:2}});             
        },
        isNoEven(){
            this.dialogSpecial = false;
        },
        isOkEven(type){
           switch (type) {
               case 1:
               case 2:
                   this.upDownLineSpecial(this.selectData);
                   break;
               case 3:
                   this.removeSpecial(this.selectData);
                   break;                              
               default:
                   break;
           }            
        },
        regularState(data){
            var regEn = new RegExp("[`~!@#$^&*%()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"),
                reg = /^(?!.*\\.*$)/,
                reg1 = /^(?!.*\/\.*$)/;
                if(regEn.test(data)||!reg.test(data)||!reg1.test(data)){   
                    return true;
                }else{
                    return false;
                }
        },
        getStudylist(num){
            var self = this;    
            if(self.title!=''){
                if(self.regularState(self.title)){
                    self.tableData = [];
                    self.pageAtion.pageTotal = 0;
                    self.pageAtion.paginationPage = 0;                
                    return;
                }
            }        
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            const query = {
                params:{
                    name:self.title,
                    pageNo:self.pageNo,
                    pageSize:self.pageSize,
                    type:self.mType
                }
            };
            self.$http.get(self.$server.thematicActivityPetPage,query).then(res=>{
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
        //复制
       copyEvenChange(id){ 
          var clipboard = new Clipboard('.copyurl'+id);  
            clipboard.on('success',function(e){
                    // 释放内存 
                    clipboard.destroy();
                })  
            clipboard.on('error',function(e){
                    console.log('该浏览器不支持自动复制')  
                    //// 释放内存 
                    clipboard.destroy();
                })  
        },        
        releaseSpecial(){
            // this.$router.push({path:'/activityObj/specialCreat'});  
            this.specialTypeDetail = true;
        },         
        seach(){
            this.getStudylist(1);
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        }             
    },
    watch: {}, 
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
</style>


