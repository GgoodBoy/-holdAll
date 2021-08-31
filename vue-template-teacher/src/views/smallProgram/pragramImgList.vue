<template>
    <div class="wrap-pragram-img">
        <el-row class="lLine40 headerDiv">
            <el-col :span="12">
                <breadcrumb :menuList ='titleList'></breadcrumb> 
            </el-col> 
            <el-col class="lRight-r lMarginTop20">
                <el-row :gutter="10">
                    <el-col :span="5">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                    placeholder="背景名称"
                                    class="search-form"
                                    clearable
                                    width="100%"></el-input>   
                        </div>
                    </el-col>
                    <el-col :span="1" v-if="$authJudge('applat:background:select')"><el-button type="primary" @click="findInfo">查询</el-button></el-col>
                    <el-col :span="3" :offset="15" v-if="$authJudge('applat:background:upload')"><el-button type="primary" @click="informatonEven('','add')">上传背景</el-button></el-col>
                </el-row>
            </el-col>
        </el-row>  
        <el-row>
            <el-col>
                <el-row :gutter="10" style="padding: 0 15px;" v-loading="loading1">
                     <el-col :span="4" v-for="(item,i) in tableData" :key="i">
                         <div class="pragramImgBox">
                             <p class="imgName">{{item.name}}</p>
                             <div class="imgBox">
                                 <img :src="item.backgroundUrl" alt="">
                                 <p>{{item.appointedTime||''}}</p>
                             </div>
                             <div class="deOrUp">
                                 <div v-if="$authJudge('applat:background:edit')" @click="informatonEven(item,'edit')">更新</div>
                                 <div v-if="$authJudge('applat:background:del')" @click="informatonEven(item,'delete')">删除</div>
                             </div>
                         </div>
                     </el-col>
                </el-row>    
            </el-col>
            <el-col>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :page-size="12"
                        @current-change="childPageValue"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
                </div>                
            </el-col> 
        </el-row>   
        <el-dialog
            title=""
            :visible.sync="pragramImgDialog"
            width="400px"
            class="courseDialogCss"
            :show-close="false"
            :close-on-click-modal="false"
            center>
                <div style="text-align: center;width:100%;">
                    {{MessageText}}
                </div>            
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="pragramImgDialogEven" v-show="MessageText.indexOf('诗词')==-1">确 定</el-button>
                    <el-button @click="pragramImgDialog = false">取 消</el-button>
                </span>         
        </el-dialog>                                      
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import loginBg from './../../assets/images/login-bg.jpg';
function regularState(data){
    var regEn = new RegExp("[`~!@#$^&*%()=|{}':;'\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；《》：”“'。，,.、？]"),
        reg = /^(?!.*\\.*$)/,
        reg1 = /^(?!.*\/\.*$)/;
        if(regEn.test(data)||!reg.test(data)||!reg1.test(data)){   
            return true;
        }else{
            return false;
        }
}
export default {
    data(){                                         
        return {
            loginBg:loginBg,
            pragramImgDialog:false,
            loading1:true,
            title:'',
            value:'',
            MessageText:'',
            tableData:[],
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            },
            pageNo:1,
            pageSize:12,
            titleList:[
                {
                    name:'小程序',
                    pathInfo:''
                },                
                {
                    name:'背景管理',
                    pathInfo:''
                }               
            ],
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
        this.getTableInformationList(1);
    },
    computed: {},    
    components:{
        breadcrumb
    },    
    methods:{   
        informatonEven(data,state){
            this.selectData = data;
            switch (state) {
                case 'edit':
                    this.$router.push({path: "/smallProgram/creatImgPragram",query:{addOrEdit:'edit',dataInfo:data}});
                    break;
                case 'add':
                    this.$router.push({path: "/smallProgram/creatImgPragram",query:{addOrEdit:'add'}});
                    break; 
                case 'delete':
                    this.MessageText = '确定删除背景图片吗?';               
                    this.pragramImgDialog=true;
                    break;                                                                  
                default:
                    break;
            }
        },
        pragramImgDialogEven(){
            this.$http.post(this.$server.courseMatchingBackgroundDel({id:this.selectData.id})).then(res=>{
               if(res.status==200){
                   if(this.tableData.length==1&&this.pageNo!=1){
                        this.getTableInformationList((Number(this.pageNo)-1));
                   }else{
                        this.getTableInformationList();
                   }         
                   this.pragramImgDialog = false;
               }
            })         
        },
        findInfo(){
            this.getTableInformationList(1);
        },
        getTableInformationList(num){  
            if(num){
                this.pageNo = num;
            }
            if(!self.loading1){
                self.loading1 = true; 
            }
            var params = {
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                searchContent:this.title
            };
            this.$http.get(this.$server.courseMatchingBackgroundGetPage(params)).then(res=>{
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
                    this.tableData = listIds;
                    this.pageAtion.pageTotal = contentdate.total;
                    this.pageAtion.paginationPage = this.pageNo;
                    this.$nextTick(function(){
                        this.loading1 = false;
                    }) 
               }
            })                                          
        },
        childPageValue(num){
            this.selectPageNum = Number(num);
            if(Number(num)>0){
                this.getTableInformationList(Number(num))
            }            
        },      
    },
    mounted(){}
}
</script>
<style>
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
.programTexte{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;    
}
.wrap-pragram-img .courseDialogCss .el-dialog .el-dialog__footer{
    text-align: center;
}
</style>
<style lang="scss" scoped>
.wrap-pragram-img{
    background: #fff;
    .pragramImgBox{
        margin-bottom: 20px;
        background: #f4f4f4;
        .imgName{
            width: 100%;
            text-align: center;
            line-height: 36px;
            height: 36px;
        }
        .imgBox{
            width: 100%;
            max-height: 200px;
            overflow: hidden;
            position: relative;
            img{
                width: 100%;
            }
            p{
                position: absolute;
                right: 5px;
                bottom: 5px;
                color: #9E0E00;
            }
        }
        .deOrUp{
            zoom: 1;
            overflow: hidden;
            div{
                padding: 15px 0;
                float:left;
                width: 50%;
                text-align: center;
            }
        }
    }
}
</style>

