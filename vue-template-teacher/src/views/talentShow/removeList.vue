<template>
    <div>
        <div>
            <Breadcrumb :menuList ='titleList' style="margin-bottom:20px"></Breadcrumb>
        </div>
        <div>
            <div>
               <div style="margin-bottom:20px;">
                   <span>类型:达人</span>
               </div>
               <div style="margin-bottom:20px;">
                   <span>选择时间:</span>  
                    <el-date-picker
                    v-model="yearTime"
                    style="width:150px;"
                    format="yyyy"
                    value-format="yyyy"
                    :picker-options="pickerOptions"
                    @change="selectYear"
                    type="year"
                    placeholder="选择年">
                    </el-date-picker>
               </div>
            </div>
            <div>
                <p style="margin-bottom:20px;color:#666;">只能隔年清理，比如2023年可以清理2021年的达人成长值，但是不能清理2022年的。</p>
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
                        prop="cellphone"
                        label="手机号"
                        align="center"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="scoreNum"
                        label="成长值"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="joinTime"
                        label="加入时间"
                        align="center"
                        min-width="200"
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
            </div>
            <div style="text-align:center;margin-top:20px;">
                <el-button @click="examine(2)">取消</el-button>
                <el-button type="primary" @click="examine(1)">清理</el-button>
            </div>
        </div>
        <el-dialog
            title=""
            :visible.sync="visible"
            v-loading="visibleLoading"
            width="30%"
            center>
            <p style="textAlign:center">确定要清理吗？清理后，用户成长值将清空！用户将退出国学智慧达人计划</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="examine(3)">清理</el-button>
                <el-button @click="examine(4)">取消</el-button>
            </span>
        </el-dialog>  
    </div>
</template>
<script>
import Breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';

    function formatDate(date,type){
        date = new Date(date);
        var y=date.getFullYear();
        var m=date.getMonth()+1;
        var d=date.getDate();
        // var h=date.getHours();
        // var m1=date.getMinutes();
        // var s=date.getSeconds();
        m = m<10?("0"+m):m;
        d = d<10?("0"+d):d;
        if(type=='y'){
            return y
        }else{
            return y+"-"+m+"-"+d;
        }
    }
            
export default {
    components:{
        Breadcrumb,
    },    
    data(){               
        return {          
            //新的项目
            tableData:[],
            loading:false,
            pageNo:1,
            pageSize:10,
            getData:'',
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            titleList:[
                {
                    name:'国学达人计划',
                    pathInfo:'/talentShow/ambassadorUser'
                },
                {
                    name:'达人/大使用户管理',
                    pathInfo:'/talentShow/ambassadorUser'
                },
                {
                    name:'清理',
                    pathInfo:''
                }
            ],
            visible:false,
            visibleLoading:false,
            yearTime:'',
            pickerOptions:{
                disabledDate (time) {
                    return time.getFullYear() > Number(formatDate(Date.now(),'y'))-2;//选当前时间之前的时间
                }
            },
    }},
    created(){ },
    props:[],
    computed:{  },        
    methods:{     
        selectYear(times){
            this.getStudylist(1);
        },
        /**
         * 审核
         */
            examine(type){
                let self = this;
                switch (type) {
                    case 1:
                        this.visible=true;
                        break;
                    case 2:
                        this.$router.push({path:"/talentShow/ambassadorUser"});
                        break;
                    case 3:
                        let query = {
                            'years':self.yearTime
                        }
                        this.$http.post(this.$server.getExpertClean,query).then(res=>{
                            if(res.status==200){
                                this.$message.success('清理完毕');
                                this.visible=false;
                                this.getStudylist(1);
                            }
                        })                        
                        break;
                    case 4:
                        this.visible=false;
                        break;
                    default:
                        break;
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
                        years:self.yearTime,
                        pageSize:self.pageSize,
                        pageNo:self.pageNo
                    }          
                };
                self.$http.get(self.$server.getExpertCleanUserList,query).then(res=>{
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
.block{
    text-align: center;
    background-color:#fff;
    padding: 15px 0;
}
</style>


