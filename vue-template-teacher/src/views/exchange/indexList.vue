<template>
    <div class="page-wrap gift-list-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3" style="float:right;text-align: right;"><el-button v-if="$authJudge('activity:gift:add')" type="primary" @click="creatWuPin">创建商品</el-button></el-col>
            </el-row>     
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="50"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="ID"
                        align="center"
                        min-width='40'>
                    </el-table-column>  
                    <el-table-column
                        label="商品图"
                        align="center"
                        min-width="120"
                        >
                        <template slot-scope="scope"> 
                            <img class="imgCss" :src="scope.row.goodsImg" />                                             
                        </template>
                    </el-table-column> 
                    <el-table-column
                        prop="goodsName"
                        label="商品名称"
                        align="center"
                        min-width='80'
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="totalNum"
                        label="库存"
                        align="center"
                        min-width='80'
                        >
                    </el-table-column>    
                    <el-table-column
                        prop="starNum"
                        label="兑换孚星"
                        align="center"
                        min-width="80"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="createdAt"
                        label="上架时间"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip
                        >
                    </el-table-column>  
                    <el-table-column
                        prop="exchangeNum"
                        label="兑换量"
                        align="center"
                        min-width="80"
                        show-overflow-tooltip
                        >
                    </el-table-column> 
                    <el-table-column
                        label="状态"
                        align="center"
                        min-width="60"
                        >
                        <template slot-scope="scope"> 
                            <div class="btn-box">
                                <span v-show="scope.row.status==1">上架</span>
                                <span v-show="scope.row.status!=1">下架</span>
                            </div>                                              
                        </template>
                    </el-table-column>                                     
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="120">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type="text" size="small" v-show="scope.row.status!=1" @click="upOrDown(scope.row)">上架</el-button>
                                    <el-button type="text" size="small" v-show="scope.row.status==1" @click="upOrDown(scope.row)">下架</el-button>
                                    <el-button type="text" size="small"  @click="edit(scope.row)">编辑</el-button>
                                    <el-button type="text" size="small" v-if='scope.row.status==1' @click="goDetails(scope.row,1)">追加库存</el-button>  
                                    <el-button type="text" size="small" v-if='scope.row.status==1' @click="goDetails(scope.row,2)">追加兑换数量</el-button>
                                </div>                                              
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
            </div>
        </div>        
        <el-dialog
        :visible.sync="dialogVisibleOne"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="false"
        width="20%"
        >
            <el-row>
                <el-col class="lCenter-r" v-if="caoZuoState==2">
                    <span>追加兑换数量:</span>
                    <el-input style='width:100px;' maxlength="4" v-model="addStarNum" placeholder="请输入内容"></el-input>
                </el-col>
                <el-col class="lCenter-r" v-if="caoZuoState==1">
                    <span>追加库存:</span>
                    <el-input style='width:100px;' maxlength="4" v-model="addTotalNum" placeholder="请输入内容"></el-input>
                </el-col>
                <el-col class="lCenter-r lMarginTop20">
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button type="primary" @click="isOkChanelEven">确定</el-button>                    
                </el-col>
            </el-row>                   
        </el-dialog>
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            titleList:[
                {
                    name:'兑换商城',
                    pathInfo:''
                },
                {
                    name:'商品列表',
                    pathInfo:''
                }               
            ],
            pageNo:1,
            pageSize:10,
            total:10,
            tableData:[],
            loading:false,
            dialogVisibleOne:false,
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            caoZuoState:'',
            addStarNum:'',
            addTotalNum:''
        };
    },
    metaInfo: {
        title: "国学大礼包"
    },
    components: {
        pagination,breadcrumb
    },
    watch: {},
    created() {
       this.getGiftList(1)
    },
    methods: {
        closeDialog(){
            this.dialogVisibleOne = false;
        },
        isOkChanelEven(){  
            let url = '',parmes = {},self = this;
            let regExp = /^[0-9]*$/g;  
            if(this.caoZuoState==1){
                url = this.$server.getAddStock
                parmes['stockNum']=this.addTotalNum;
            }else{
                url = this.$server.getAddStar
                parmes['exchangeNum']=this.addStarNum;
            }
            if(this.caoZuoState==1&&!this.addTotalNum){
                this.$message({
                    type:'error',
                    message:'请添加追加数据'
                })
                return;
            }

            if(this.caoZuoState==2&&!this.addStarNum){
                this.$message({
                    type:'error',
                    message:'请添加追加数据'
                })
                return;
            }
            if(this.caoZuoState==1){
                if(!regExp.test(this.addTotalNum)){
                    this.$message({
                        type:'error',
                        message:'请输入整数'
                    })
                    return;
                }
            }
            if(this.caoZuoState==2){
                if(!regExp.test(this.addStarNum)){
                    this.$message({
                        type:'error',
                        message:'请输入整数'
                    })
                    return;
                }
            }
            this.$http.post(url+this.selectData.id,parmes).then(res=>{
                if(res.status==200){
                    this.addStarNum ='';
                    this.addTotalNum='';
                    this.$message({
                        type:'success',
                        message:this.caoZuoState==1?'追加库存成功':'追加兑换成功'
                    })
                    this.getGiftList(self.pageNo);
                }
            })            
            this.dialogVisibleOne = false;
        },
        creatWuPin(){
            this.$router.push({
                path:'/exchange/creatExchange'
            })            
        },
        /**
         * 获取列表数据
         */
        getGiftList(num){
            let self = this;
            this.loading = true;
            if(num){
                self.pageNo = num;
            }
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.getGoodsList,query).then(res=>{
                this.loading = false;
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
                    self.loadingOne = false;
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        /**
         * 编辑
         */
        edit(obj){
            this.$router.push({
                path:'/exchange/creatExchange',
                query:{id:obj.id}
            })
        },
        /**
         * 上架or下架
         */
        upOrDown(obj){
            let self = this;
            if(obj.status==2){
                this.$confirm('确定要上架这个商品吗？', '上架确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    this.$http.post(this.$server.getEditState+obj.id,{status:1}).then(res=>{
                        if(res.status==200){
                            this.$message({
                                type:'success',
                                message:'上架成功'
                            })
                            this.getGiftList(self.pageNo);
                        }
                    })
                }).catch(()=>{})
            } 
            if(obj.status==1){
                this.$confirm('确定要下架这个商品吗？', '下架确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    this.$http.post(this.$server.getEditState+obj.id,{status:2}).then(res=>{
                        if(res.status==200){
                            this.$message({
                                type:'success',
                                message:'下架成功'
                            })
                            this.getGiftList(self.pageNo);
                        }
                    })
                }).catch(()=>{})
            }
        },
        /**
         * 去详情页面
         */
        goDetails(obj,type){
           this.caoZuoState = type;
           this.selectData = obj;
           this.dialogVisibleOne = true;
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getGiftList(Number(num))
            }
        },
    }
};
</script>

<style lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
    .gift-list-wrap{
        .page-header {
            background: #fff;
            padding: 30px 30px 38px 20px;
            margin-bottom: 26px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            .page-title {
                font-size: 18px;
                color: rgba(56, 65, 86, 1);
                margin-bottom: 20px;
            }
        }
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            .editor-btn {
                color:#9E0E00;
                font-size: 14px;
                padding: 0;
                height: 36px;
                line-height: 36px;
            }
            .block{
                text-align: center;
                margin-top:60px;
                padding-bottom:60px;
            }
            .imgCss{
                width:60px;
                height:60px;
                border-radius: 50%;
            }
        }
        .type-dialog{
            min-width: 250px;
            .type-btns{
                text-align: center;
            }
        }
    }
    
</style>

