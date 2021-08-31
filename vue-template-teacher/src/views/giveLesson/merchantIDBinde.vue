<template>
    <div>
        <el-row :gutter="20" class="lLine40">
            <el-col :span="20">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col :span="4" style="text-align: right;">
                <el-button v-if="$authJudge('mobileactivity:relation:add')" class="redBackColor butColorF" @click="releaseSpecial('add')">绑定ID</el-button>
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
                        prop="sortId"
                        label="序号 "
                        align="center"
                        min-width="50">
                    </el-table-column>                
                    <el-table-column
                        prop="mobilePlatformGoodsId"
                        label="移动积分商城商品ID "
                        align="center"
                        min-width="200"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="移动积分活动ID"
                        prop="mobileActivityId"
                        align="center"
                        min-width="120">                         
                    </el-table-column> 
                    <el-table-column
                        label="创建人"
                        prop="creatorName"
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="120">                         
                    </el-table-column>                                                                                            
                    <el-table-column
                        prop="createdAt"
                        label="创建日期"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="140">
                        <template slot-scope="scope">       
                            <el-button
                                    v-if="$authJudge('mobileactivity:relation:edit')"
                                    type="text"
                                    class="black-btn"
                                    @click="releaseSpecial('update',scope.row)">修改</el-button>
                            <el-button
                                    v-if="$authJudge('mobileactivity:relation:del')"
                                    type="text"
                                    class="black-btn"
                                    @click="deleteSpecial(scope.row)">删除</el-button>                                    
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
                            <el-col class="lLeft-r">
                                <p>确定要删除吗？</p>
                                <p>删除后移动用户将无法在移动积分商城兑换相对应的活动权益！</p>
                            </el-col> 
                        </el-row>
                        <el-row  class="lLine30 lMarginTop40">
                            <el-col class="lCenter-r">
                                <el-button class="redBackColor butColorF" @click="isOkEven">确 定</el-button>
                                <el-button @click="isNoEven">取 消</el-button>          
                            </el-col>                        
                        </el-row>
                    </el-col>
                </el-row>
        </el-dialog>   
        <el-dialog
            title=""
            :visible.sync="specialTypeDetail"
            width="40%">
                <el-form ref="form" :model="form" label-width="160px" :rules="rules" >
                    <el-form-item label="移动积分商城商品ID" class="form-name" prop="mobilePlatformGoodsId">
                        <el-input style="width:250px;" v-model="form.mobilePlatformGoodsId" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="移动积分活动ID" class="form-intro" prop="mobileActivityId">
                        <el-input v-model="form.mobileActivityId" style="width:250px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="specialTypeEven('form')">绑定</el-button>
                        <el-button @click="specialTypeEven('resetForm')">取消</el-button>
                    </el-form-item>                    
                </el-form>
        </el-dialog> 
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="false"
        width="50%"
        >
            <div class="centerCss">
            </div>                    
        </el-dialog>                            
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    components:{
        breadcrumb
    },    
    data(){
        return {
            tableData:[],
            loading:false,
            titleList:[
                        {
                            name:'移动积分管理',
                            pathInfo:''
                        },
                        {
                            name:'商户ID绑定',
                            pathInfo:''
                        }               
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            dialogSpecial:false,
            specialTypeDetail:false,
            pageSize:10,
            pageNo:1,
            selectDataType:'',
            selectData:'',
            dialogVisibleFour:false,
            disabledState:false,
            form:{
                mobilePlatformGoodsId:'',
                mobileActivityId:'',
            },
            rules:{
                mobilePlatformGoodsId:[
                    { required: true, message: '移动积分商城商品ID', trigger: 'blur' },
                ],
                mobileActivityId:[
                    { required: true, message: '移动积分活动ID', trigger: 'blur'  },
                ]
            },                                      
        }
    },
    created(){        
        this.getStudylist(1);     
    },
    props:[],
    computed:{    
    },     
    methods:{       
        specialTypeEven(formName){
            var self = this;    
            if(formName!='resetForm'){
                self.$refs[formName].validate((valid) => {
                if (valid) {
                    self.addOrUpdataMerchInfo();
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });    
            }else{
                this.form={
                    mobilePlatformGoodsId:'',
                    mobileActivityId:'',
                }     
                this.specialTypeDetail=false;           
            }    
        },   
        removeSpecial(data){
            var self = this;
            this.$http.post(`${self.$server.setDelRelation}${self.selectData.id}`,{}).then(res=>{
               if(res.status==200){
                   this.dialogSpecial = false;  
                   this.$message.success('删除成功');  
                   this.getStudylist(self.pageNo);  
               }
            })            
        },
        deleteSpecial(data){
            this.selectData = data;
            this.dialogSpecial = true;           
        },
        isNoEven(){
            this.dialogSpecial = false;
        },
        isOkEven(){
            this.removeSpecial();          
        },
        getStudylist(num){
            var self = this;       
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            const query = {
                params:{
                    pageNo:self.pageNo,
                    pageSize:self.pageSize
                }
            }            
            self.$http.get(self.$server.getRelationPage,query).then(res=>{
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
        //添加或者修改       
        addOrUpdataMerchInfo(){
            var self = this;    
            let url = ''; 
            let messages ='';
            const query = {
                    mobilePlatformGoodsId:self.form.mobilePlatformGoodsId,
                    mobileActivityId:self.form.mobileActivityId
            }        
            if(self.selectDataType=='add'){
                url = self.$server.setAddRelation;
                messages = '绑定商品ID成功';
            }else{
                url = `${self.$server.editRelationMobileActivity}${self.selectData.id}`;
                messages = '修改商品ID成功';
            } 
            if(!self.disabledState){
                self.disabledState = !self.disabledState;
                self.$http.post(url,query).then(res=>{
                    if(res.status==200){
                            this.specialTypeDetail = false;
                            self.disabledState = !self.disabledState;
                            self.form = {
                                mobilePlatformGoodsId:'',
                                mobileActivityId:''
                            };
                            self.$message.success(messages);
                            self.getStudylist(1);
                    }
                })              
                .catch(res => {
                    self.disabledState = !self.disabledState;
                });
            }            
        },  
        releaseSpecial(type,data){
            this.specialTypeDetail = true;
            this.selectData = data;
            this.selectDataType = type;
            if(type!='add'){
                this.form = {
                    mobilePlatformGoodsId:data.mobilePlatformGoodsId,
                    mobileActivityId:data.mobileActivityId
                };                  
            }
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


