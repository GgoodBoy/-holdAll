<template>
 <div>
<el-row>
    <el-col>
        <el-row class="lLine40 headerDiv">
            <el-col class="lSize18">
                <el-row class="lSize16">
                    <el-col :span="8" class="lLeft-r">
                        <breadcrumb :menuList ='titleList'></breadcrumb>
                    </el-col>
                </el-row>                
            </el-col>
            <el-col class="lRight-r lMarginTop20">
                <el-row :gutter="20">
                    <el-col :span="20" style="text-align: left;">
                        <el-input v-model.trim="title"
                                placeholder="请输入商品名称"
                                class="search-form"
                                width="100%"
                                clearable
                                style="width:200px"
                                @keyup.native="proving1"
                                ></el-input>                            
                        <el-select style="width:120px" v-model="valueOne" placeholder="分类">
                            <el-option
                            v-for="item in optionsOne"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>   
                        <el-select style="width:120px" v-model="valueTwo" placeholder="状态">
                            <el-option
                            v-for="item in optionsTwo"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>                                                                                                         
                        <el-button type="primary" v-if="$authJudge('goodsthings:goods:select')" @click="searchMemberQuery">查询</el-button>
                    </el-col>
                    <el-col :span="4" style="text-align: right;">
                        <el-button v-if="$authJudge('goodsthings:goods:add')" type="primary"  @click="cretaNewCommod">添加新商品</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>        
    </el-col>
    <el-col class="lMarginTop20">
        <el-table
        :data="tableData"
        border
        v-loading="loading"
        style="width: 100%">
            <el-table-column
                prop="sortId"
                label="序号"
                align="center"
                min-width="50">
            </el-table-column>   
            <el-table-column
                prop="goodsName"
                :show-overflow-tooltip='true'
                label="商品名称"
                align="center"
                min-width="120">
            </el-table-column>                                                                                                   
            <el-table-column
                prop="classifyName"
                label="分类"
                align="center"
                min-width="60">                                        
            </el-table-column>  
            <el-table-column
                prop="goodsPrice"
                label="价格"
                align="center"
                min-width="120">
            </el-table-column> 
            <el-table-column
                label="佣金比例"
                align="center"
                min-width="100">
                    <template slot-scope="scope">
                            {{scope.row.commissionRate||0}}%                                                   
                    </template>                 
            </el-table-column>    
            <el-table-column
                label="状态"
                align="center"
                min-width="100">
                    <template slot-scope="scope">
                            {{scope.row.status==1?'上架':'下架'}}                                                  
                    </template>                 
            </el-table-column>            
            <el-table-column
                label="操作"
                align="center"
                min-width="160">
                    <template slot-scope="scope"> 
                            <el-button type="text" class="black-btn" v-if="$authJudge('goodsthings:goods:update')" @click="tableEditeEven(scope.row,'edit')">修改</el-button> 
                            <el-button type="text" class="black-btn" v-if="$authJudge('goodsthings:goods:up')" @click="tableEditeEven(scope.row,'upperOrLower')">{{scope.row.status==1?'下架':'上架'}}</el-button> 
                            <el-button type="text" class="black-btn" v-if="$authJudge('goodsthings:goods:update')&&(scope.row.status!=1?true:false)" @click="tableEditeEven(scope.row,'delete')">删除</el-button>
                            <el-button type="text" class="black-btn" v-if="$authJudge('goodsthings:goods:topping')" @click="tableEditeEven(scope.row,'isTopping')">{{scope.row.topStatus==1?'取消置顶':'置顶'}}</el-button>                                                   
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
            :visible.sync="pragramLIstDialog"
            width="400px"
            class="courseDialogCss"
            :show-close="true"
            :close-on-click-modal="false"
            center>
                <div style="text-align: center;width:100%;">
                    {{MessageText}}
                </div>                                          
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="pragramLIstDialogEven">确 定</el-button>
                    <el-button @click="pragramLIstDialog=false">取 消</el-button>
                </span>         
        </el-dialog> 
        </div>
</template>
<script>
import datalist from '../../components/formSynthesisPlugin/gxTitleList';
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
let cellphoneList = new datalist()
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
            titleList:[
                        {
                            name:'国学好物',
                            pathInfo:''
                        },
                        {
                            name:'商品管理',
                            pathInfo:''
                        }                
            ],
            tableData:[],
            valueOne:'',
            optionsOne:[],
            valueTwo:'',
            optionsTwo:[
                // -1全部 1 夫子币余额 2 微信 3 支付宝 4 apple充值 5微信内支付 6华为支付 7Oppo支付 8vivo支付 9小米支付
                {
                    value: '-1',
                    label: '全部'                    
                },
                {
                    value: '1',
                    label: '上架'                    
                },
                {
                    value: '2',
                    label: '下架'                    
                }               
            ],
            dataStart:'',
            dataEnd:'',
            telephoneList:[],
            loading:true,
            selectData:'',
            selectType:'',
            MessageText:'',
            pragramLIstDialog:false
        };
        },
        created() {
            this.telephoneList = cellphoneList.telePhoneList.join();
            // if(Number(sessionStorage['appHomeSetDate'])>0){
            //     this.dataStart = Number(sessionStorage['appHomeSetDate']);
            //     this.dataEnd = this.dataStart+86399000;            
            //     this.getStudylist(1);
            //     sessionStorage.removeItem('appHomeSetDate');
            // }else{
                this.getProgramList();
                this.getStudylist(1);
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
            }
        },         
        components:{
            breadcrumb
        },        
        methods: {
            //获取分类；
        //获取列表信息；
            getProgramList(){
                var self = this;   
                self.loading = true; 
                var params = {
                    classifyName:''
                };
                self.$http.get(self.$server.getGoodsClassifyList,{params}).then(res=>{
                    if(res.status==200){
                        var listIds = [
                            {
                                value:-1,
                                label:'全部'                               
                            }
                            ];
                        var contentdate = res.content;  
                            contentdate.forEach(element => {
                                listIds.push({
                                    value:element.id,
                                    label:element.classifyName
                                });
                            });                                             
                            self.optionsOne = listIds;
                    }
                })             
            },            
            tableEditeEven(data,type){
                this.selectData = data;
                this.selectType = type;
                switch (type) {
                    case 'edit':
                        this.$router.push({path:'/classification/creatCommodity', query: {id: data.id}});
                        break;
                    case 'upperOrLower':
                    case 'isTopping':
                        this.getUrlDataEven(data,type);
                        break;                     
                    case 'delete':
                        this.pragramLIstDialog = true;
                        this.MessageText = '确定删除选择商品?';
                        break;                                                                  
                    default:
                        break;
                }                
            },
            pragramLIstDialogEven(){
                var self = this,
                query = {
                    id:this.selectData.id
                };
                self.$http.post(self.$server.getGoodsDeleteGoods,query).then(res=>{
                    if(res.status==200){
                        this.getStudylist();
                        self.$message.success('删除成功');
                        self.pragramLIstDialog=false;
                    }
                });                
            },
            getUrlDataEven(data,state){
                var self = this,
                messageInfo='',
                urls = '',
                query = {
                    id:data.id
                };
                switch (state) {
                    case 'upperOrLower':
                        urls = data.status==1?self.$server.getGoodsDownGoods:self.$server.getGoodsUpGoods;
                        messageInfo = data.status==1?'下架':'上架';
                        break; 
                    case 'isTopping':
                        urls = self.$server.getGoodsToppingGoods;
                        messageInfo = data.topStatus==1?'取消置顶':'置顶';
                        break;                                                                
                    default:
                        break;
                }
                self.$http.post(urls,query).then(res=>{
                    if(res.status==200){
                        this.getStudylist();
                        self.$message.success(messageInfo+'成功');
                        self.pragramLIstDialog=false;
                    }
                });                
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
            cretaNewCommod(){
                this.$router.push('/classification/creatCommodity');
            },
            //导出                
            searchMemberQuery(){
                this.getStudylist(1);
            },
            getStudylist(num){
                var self = this;
                if(num){
                    self.pageNo = num;
                }
                self.loading = true; 
                // encodeURIComponent(
                var params = {
                    goodsName:self.title||'',
                    pageSize:self.pageSize,
                    pageNo:self.pageNo,
                    classifyId:self.valueOne==-1?'':self.valueOne,
                    status:self.valueTwo==-1?'':self.valueTwo          
                };
                self.$http.get(self.$server.getGoodsList,{params}).then(res=>{
                if(res.status==200){
                    var listIds = [];
                    var contentdate = res.content;
                    var nextPage = contentdate.nextPage;
                    var prePage = contentdate.prePage; 
                   if(contentdate.list.length){
                        // listIds = contentdate.list.map(function(element,index){
                        //     if(contentdate.pageNum==1){
                        //         element.sortId = contentdate.total-index;
                        //         return element;
                        //     }else if(contentdate.pageNum>1){
                        //         element.sortId =contentdate.total- (contentdate.pageNum-1)*10-index;
                        //         return element;
                        //     }                            
                        // }); 
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
}
</style>


