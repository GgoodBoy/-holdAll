<template>
    <div class="historyBox">
        <div>
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>
        <el-container>
            <el-main>    
                <div style="margin-bottom:20px;">
                    <el-input
                    placeholder="输入课程名称或账号"
                    suffix-icon="el-icon-search"
                    style="width:200px"
                    @keyup.native="proving1"
                    v-model="input2">
                    </el-input>      
                    <el-select v-model="value" placeholder="类型" style="width:150px">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>         
                    <el-date-picker
                    v-model="beginStr"
                    type="date"
                    style="width:200px"
                    placeholder="开始时间">
                    </el-date-picker>       
                    <el-date-picker
                    v-model="endStr"
                    type="date"
                    style="width:200px"
                    placeholder="结束时间">
                    </el-date-picker>                        
                    <el-button style="background-color:#9e0e00;color:#fff;margin-left:10px;" @click.native="saveSeach">筛选</el-button>              
                </div>  
                <el-row>
                    <el-table
                        v-loading ="loadDailg"
                        ref="multipleTable"
                        :data="tableData"
                        maxHeight="600" 
                        tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column
                            prop="courseTitle"
                            label="课程"
                            align="center"
                            min-width="120">
                        </el-table-column>  
                        <el-table-column
                            prop="userPhone"
                            label="账号"
                            align="center"
                            min-width="120">
                        </el-table-column> 
                        <el-table-column
                            label="类型"
                            align="center"
                            min-width="120">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    {{scope.row.type==2?"app推送":"短信"}}
                                </div>                                              
                            </template>                            
                        </el-table-column> 
                        <el-table-column
                            prop="createdAt"
                            label="发送时间"
                            align="center"
                            min-width="120">
                        </el-table-column> 
                        <el-table-column
                            prop="content"
                            label="发送内容"
                            align="center"
                            min-width="120">
                        </el-table-column>                      
                    </el-table>                    
                </el-row>
            </el-main>
            <el-footer>
                <div style="text-align:center">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
                </div>                
            </el-footer>
        </el-container>
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
// 点击推存切换组件
export default {
    data(){
        return {
            tableData:[],
            multipleSelection:[],
            initChooseIdlist:[],
            input2:'',
            loadDailg:false,
            initTableDataList:[],
            isfirstBool:true,
            changeSelectList:[],
            pageNo:1,
            options:[{
                label:'APP推送',
                value:'0'
            }],
            value:'',
            beginStr:'',
            endStr:'',
            titleList:[
                {
                    name:'APP管理系统',
                    pathInfo:''
                },
                {
                    name:'疯狂追单',
                    pathInfo:'/oldUserObj/oldUsers'
                },
                {
                    name:'历史记录',
                    pathInfo:''
                }
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            }   

        }
    },
    created(){
        this.getHistoryList();
    },
    components:{
        breadcrumb
    },
    props:[],
    computed:{},
    methods:{ 
            getHistoryList(num){
                var self = this;
                if(num){
                    self.pageNo = num;
                }  
                let query = {
                    params:{
                        pageSize:10,
                        pageNo:this.pageNo,
                        beginAt:Number(this.beginStr)>0?this.formatDate(new Date(this.beginStr),'start'):'',
                        endAt:Number(this.endStr)>0?this.formatDate(new Date(this.endStr),'end'):'',
                        titleOrPhone:this.input2,
                        smsMedium:'0'                
                    }
                }
                this.loadDailg = true;
                self.$http.get(self.$server.getUserRecallRecordList,query).then(res=>{
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
                        this.loadDailg = false;
                    })                   
                }
                }).catch(()=>{
                })            
            },
            //搜索保存
            saveSeach(){
                this.getHistoryList(1);
            },      
             formatDate(date,type){
        // formatDate(date){
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
            proving1(){
                var self = this;
                var reg = /^(?!.*\\.*$)/;
                if(!reg.test(self.title)){
                    this.title='';
                }
            },     
            childPageValue(num){
                if(Number(num)>0){
                     this.getHistoryList(num);
                }
            }    
        },
    mounted() {
        
    }
}
</script>
<style>
.has-gutter th.el-table-column--selection .cell{
    display: none;
}
.courseAccStyle{
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
}
</style>

