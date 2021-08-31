<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col :span="12">
                <breadcrumb :menuList ='titleList'></breadcrumb> 
            </el-col> 
            <el-col class="lRight-r lMarginTop20">
                <el-row :gutter="10">
                    <el-col :span="5">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                    placeholder="请输入分类"
                                    class="search-form"
                                    maxlength="16"
                                    clearable
                                    width="100%"></el-input>   
                        </div>
                    </el-col>
                    <el-col :span="1" v-if="$authJudge('goodsthings:goodsclassify:select')"><el-button type="primary" @click="findInfo">查询</el-button></el-col>
                    <el-col :span="2" v-if="$authJudge('goodsthings:goodsclassify:add')" :offset="16"><el-button type="primary" :disabled="tableData.length>=18?true:false" @click="informatonEven('','add')">添加</el-button></el-col>
                </el-row>
            </el-col>
        </el-row>  
        <el-row>
            <el-col>
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                style="width: 100%;maxHeight:630px;max-height:630px;overflow-y: auto;">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="50">
                    </el-table-column>                    
                    <el-table-column
                        prop="classifyName"
                        label="分类"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>
                    <el-table-column
                        label="排序"
                        align="center"
                        prop="sort"
                        show-overflow-tooltip
                        min-width="50">                       
                    </el-table-column>                    
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="100"
                        >
                        <template slot-scope="scope">
                            <el-button type="text" class="black-btn" v-if="$authJudge('goodsthings:goodsclassify:sort')" @click="informatonEven(scope.row,'sort')">排序</el-button> 
                            <el-button type="text" class="black-btn" v-if="$authJudge('goodsthings:goodsclassify:update')"  @click="informatonEven(scope.row,'edit')">编辑</el-button> 
                            <el-button type="text" class="black-btn" v-if="$authJudge('goodsthings:goodsclassify:delete')" @click="informatonEven(scope.row,'delete')">删除</el-button>                             
                        </template>
                    </el-table-column>                                                                                   
                </el-table>               
            </el-col> 
        </el-row>  
        <el-dialog
            title=""
            :visible.sync="pragramLIstDialog"
            width="500px"
            class="courseDialogCss"
            :show-close="true"
            :close-on-click-modal="false"
            center>
                <div style="text-align: center;width:100%;" v-if="selectType=='delete'">
                    {{MessageText}}
                </div> 
                <div style="text-align: center;width:100%;" v-if="selectType=='edit'||selectType=='add'">
                    <span>请输入分类名称:</span>
                    <el-input v-model.trim="classityName" style="width:200px;" :maxlength="5" clearable></el-input> 
                    <span>{{classityName.length||0}}/5</span>            
                    <el-button type="danger" @click="pragramLIstDialogEven" style="margin-left:20px">确定</el-button> 
                </div>
                <div style="text-align: center;width:100%;" v-if="selectType=='sort'">
                    <span>移动到第</span>
                    <el-input v-model.trim="sortNum" style="width:100px" clearable @input='inputEven'></el-input>
                    <span>位</span>                   
                    <el-button type="danger" @click="pragramLIstDialogEven" style="margin-left:20px">确定</el-button>                   
                </div>                                           
                <span slot="footer" class="dialog-footer" v-if="selectType=='delete'">
                    <el-button type="primary" @click="pragramLIstDialogEven">确 定</el-button>
                    <el-button @click="pragramLIstDialog=false">取 消</el-button>
                </span>         
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
            sortNum:'',
            value:'',
            loading:false,
            pragramLIstDialog:false,
            MessageText:'',
            tableData:[],         
            disabledState:false,
            titleList:[
                {
                    name:'国学好物',
                    pathInfo:''
                },                
                {
                    name:'商品分类管理',
                    pathInfo:''
                }               
            ],
            selectData:'',
            selectType:'',
            classityName:'',
        }
    },
    created(){       
        this.getProgramList();
    },
    computed: {
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }
    },  
    components:{
        breadcrumb
    },    
    methods:{
        inputEven(){
            this.sortNum=this.sortNum.replace(/[^0-9-]+/,'');
        },
        pragramLIstDialogEven(){
            var that = this;
            console.log("pragramLIstDialogEven",that.selectType);
            switch (that.selectType) {
                case 'edit':
                case 'add':
                case 'sort':
                    this.listChangeEven(that.selectType);
                    break;                     
                case 'delete':
                    this.deleteProgramList();
                    break;                                                                  
                default:
                    break;
            }            
            // this.deleteProgramList();
        },
        informatonEven(data,state){
            this.selectData = data;
            this.pragramLIstDialog=true;
            this.selectType = state;
            switch (state) {
                case 'edit':
                    this.classityName = data.classifyName;
                    break;
                case 'add':
                    this.classityName = '';
                    break; 
                case 'sort':
                    this.sortNum = data.sortId;
                    break;                     
                case 'delete':
                    this.MessageText = '确定删除当前分类吗?';
                    break;                                                                  
                default:
                    break;
            }
        },
        listChangeEven(state){
            var self = this,
                messageInfo='',
                urls = '',
                query = {};
                switch (state) {
                    case 'edit':
                        urls = self.$server.getUpdateGoodsClassify;
                        query['classifyName'] = self.classityName;
                        query['id'] = self.selectData.id;
                        messageInfo = '编辑';
                        break;
                    case 'add':
                        urls = self.$server.getAddGoodsClassify;
                        query['classifyName'] = self.classityName;
                        messageInfo = '添加';
                        break; 
                    case 'sort':
                        urls = self.$server.getSortClassify;
                        query['sort'] = self.sortNum;
                        query['id'] = self.selectData.id;
                        messageInfo = '排序';
                        break;                                                                
                    default:
                        break;
                }
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;
                    self.$http.post(urls,query).then(res=>{
                        if(res.status==200){
                            this.getProgramList();
                            self.disabledState = !self.disabledState;
                            self.$message.success(messageInfo+'成功');
                            self.pragramLIstDialog=false;
                        }
                    }).catch(()=>{
                        self.disabledState = !self.disabledState;
                    });                    
                }
            
        },
        //删除当前列表;
        deleteProgramList(){
            var query = {
                id:this.selectData.id
            };
            this.$http.post(this.$server.getDeleteGoodsClassify,query).then(res=>{
               if(res.status==200){
                    this.pragramLIstDialog = false;
                    this.getProgramList();
                   
               }
            });            
        },
        //获取列表信息；
        getProgramList(){
            var self = this;   
            self.loading = true; 
            var params = {
                classifyName:self.title
            };
            self.$http.get(self.$server.getGoodsClassifyList,{params}).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                    listIds = contentdate.map(function(element,index){
                        element.sortId = index+1;
                        return element;
                    });                      
                    self.tableData = listIds;
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
               }
            })             
        },
        //特殊符号过滤
        regularState(data){
            var regEn = new RegExp("[`~!@#$^&*%()=|{}':;'\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；《》：”“'。，,.、？]"),
                reg = /^(?!.*\\.*$)/,
                reg1 = /^(?!.*\/\.*$)/;
                if(regEn.test(data)||!reg.test(data)||!reg1.test(data)){   
                    return true;
                }else{
                    return false;
                }
        },        
        findInfo(){
            this.getProgramList();
        }      
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
.programTexte{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;    
}
</style>


