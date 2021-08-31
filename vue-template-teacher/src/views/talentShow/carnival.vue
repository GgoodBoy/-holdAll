<template>
    <div>
        <div>
            <Breadcrumb :menuList ='titleList' style="margin-bottom:20px"></Breadcrumb>
        </div>
        <div>
             <el-row>
                <el-col :span="12">                                         
                    <el-date-picker
                        v-model="timeDats"
                        type="year"
                        style="width:120px;"
                        placeholder="选择年份">
                    </el-date-picker>                                                                                                    
                    <el-button type="primary" @click="search">查询</el-button>
                </el-col>
                <el-col :span="2" :offset="9" class="textAlign">
                    <el-button type="primary" @click='addOrEditCarnivals("add")'>添加狂欢节</el-button>
                </el-col>                
            </el-row>
            <div class="contents">
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
                        prop="courseNames"
                        label="课程名称"
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        label="月份"
                        align="center"
                        min-width="150"
                        >
                        <template slot-scope="scope">   
                                           {{scope.row.year||1970}}年{{scope.row.month||1}}月                                 
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="couponId"
                        label="优惠券ID"
                        align="center"
                        :show-overflow-tooltip="true"
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="130"
                        >
                        <template slot-scope="scope">                                                             
                            <el-button type="text" v-if="$authJudge('expertplan:carnival:edit')" v-show="scope.row.endStatus!=1" @click='addOrEditCarnivals("edit",scope.row)'>修改</el-button>
                            <el-button type="text" v-if="$authJudge('expertplan:carnival:end')" v-show="scope.row.endStatus!=1" @click="isOver(scope.row)">立即结束</el-button>
                            <p style="color:#ccc;" v-show="scope.row.endStatus==1">已结束</p>
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
    </div>
</template>
<script>
import Breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
export default {
    components:{
        Breadcrumb,
        // courseselect,
        courseListPlugin,
    },    
    data(){               
        return {          
            //新的项目
            tableData:[],
            loading:false,
            pageNo:1,
            pageSize:10,
            isAdd:true,
            couserBool:false,
            disabledState:false,
            timeDats:'',
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            titleList:[
                {
                    name:'国学达人计划',
                    pathInfo:''
                },
                {
                    name:'达人狂欢节课程设置',
                    pathInfo:''
                }
            ]
    }},
    created(){   
        this.getStudylist();  
    },
    props:[],
    computed:{  },        
    methods:{     
            isOver(data){
                console.log('data',data);
                this.$confirm('确定结束吗？', '立即结束', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    this.$http.post(this.$server.getExpertEndCarnival+data.id,{}).then(res=>{
                        if(res.status==200){
                            this.$message({
                                type:'success',
                                message:'已结束'
                            })
                            this.getStudylist(1);
                        }
                    })                    
                }).catch(()=>{})                
            },
            search(){
                this.getStudylist(1);
            },
            addOrEditCarnivals(type,data){
                if(type=='edit'){
                    this.$router.push({path:'/talentShow/addCarnival',query:{id:data.id}}); 
                }else{
                    this.$router.push({path:"/talentShow/addCarnival"});
                }
            },
            childPageValue(num){
                if(Number(num)>0){
                    this.getStudylist(Number(num))
                }
            },
            getStudylist(num){
                var self = this;
                if(num){
                    self.pageNo = num;
                }
                self.loading = true; 
                var query = {
                    params:{
                        pageSize:self.pageSize,
                        pageNo:self.pageNo,
                        years:Number(self.timeDats)>0?self.formatDate(self.timeDats,'year'):'',
                    }          
                };
                self.$http.get(self.$server.getExpertCarnivalList,query).then(res=>{
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
        formatDate(date,dayType){
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                // var h=date.getHours();
                // var m1=date.getMinutes();
                // var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;
                // return y+"/"+m+"/"+d+" "+h+":"+m1+":"+s;
                if(dayType=='year'){
                    return y;
                }else{
                   return y+"-"+m+"-"+d;     
                }
                
            }                               
    },
    watch: {}, 
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
.headerDiv .inputtextarea .el-textarea__inner{
        min-height: 100px !important;
    } 
</style>
<style lang="scss" scoped>
    .textAlign{
        text-align: right;
    }
    .contents{
        margin-top:10px;
        .block{
            text-align: center;
            background-color:#fff;
            padding: 15px 0;
        }
    }
</style>


