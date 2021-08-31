<template>
    <div class="integralDataStatistics">
        <el-row :gutter="20" class="lLine40">
            <el-col :span="20">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col :span="4" style="text-align: right;">
            <el-button
                type="text"
                v-if="$authJudge('mobileactivity:statistics:visitrank')"  
                @click="releaseSpecial('goTo')">观看排行榜</el-button>                 
            </el-col>              
        </el-row>
        <el-row class="lMarginTop20">
            <el-col class="flexBox">
                <div>
                    <el-input v-model.trim="title"
                        style="width:200px"
                        placeholder="输入手机号查询"
                        class="search-form"
                        clearable
                        maxlength="20">
                    </el-input> 
                    <el-date-picker
                        v-model="begin"
                        @change="pickerBegin(begin)"
                        style="width:150px"
                        type="date"
                        placeholder="注册时间">
                        </el-date-picker>  
                    <div style="display: inline-block;">-</div>
                    <el-date-picker
                        v-model="end"
                        @change="pickerEnd(end)"
                        style="width:150px"
                        type="date"
                        placeholder="结束时间">
                        </el-date-picker>  
                    <el-button v-if="$authJudge('mobileactivity:statistics:select')" class="redBackColor butColorF" @click="releaseSpecial('search')">搜索</el-button>                                     
                </div>
                <el-button v-if="$authJudge('mobileactivity:statistics:export')" class="redBackColor butColorF" @click="exportDetail">导出</el-button>
            </el-col>
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
                        prop="cellphone"
                        label="手机号 "
                        align="center"
                        min-width="150"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="注册时间"
                        prop="createdAt"
                        align="center"
                        min-width="120">                         
                    </el-table-column> 
                    <el-table-column
                        label="观看课程"
                        prop="courseName"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip>                         
                    </el-table-column>                                                                                            
                    <el-table-column
                        prop="studyDuration"
                        label="观看时长(秒)"
                        align="center"
                        min-width="100"
                        >
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
                            name:'积分数据绑定',
                            pathInfo:''
                        }               
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            pageSize:10,
            pageNo:1,
            begin:'',
            end:'',
            title:'',                                     
        }
    },
    created(){        
        this.getStudylist(1);     
    },
    props:[],
    computed:{    
    },     
    methods:{    
        getStudylist(num){  
            if(num){
                this.pageNo = num;
            }
            this.loading = true; 
            const query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    beginTime:this.begin?this.formatDate(new Date(this.begin),"start"):'',
                    endTime:this.end?this.formatDate(new Date(this.end),"end"):'',
                    searchContent:this.title
                }
            }            
            this.$http.get(this.$server.getStatisticsList,query).then(res=>{
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
                    this.pageAtion.paginationPage = num;
                    this.$nextTick(function(){
                        this.loading = false; 
                    }) 
               }
                console.log(res);
            })            
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
        exportDetail(){
            var self = this;
            var parems ={
                searchContent:self.title,
                beginTime:Number(this.begin)>0?this.formatDate(new Date(this.begin),"start"):'',
                endTime:Number(this.end)>0?this.formatDate(new Date(this.end),"end"):''
            };
            var url = self.$server.exportSortStatisticsList+"?searchContent="+parems.searchContent+"&beginTime="+parems.beginTime+"&endTime="+parems.endTime+"&token="+getToken();
            window.open(url);
        },

        releaseSpecial(type){
            if(type=='goTo'){
                this.$router.push({path:'/moveCount/integralDataSort'}); 
            }else{
                this.getStudylist(1);
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
<style lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
   
    .integralDataStatistics{
        .flexBox{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .block{
            text-align: center;
            padding: 40px 0 40px 0;
            background: #fff;
        }        
    }

</style>


