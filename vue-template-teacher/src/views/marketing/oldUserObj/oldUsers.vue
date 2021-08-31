<template>
    <div class="oldUser">       
        <div class="headers">
             <breadcrumb :menuList ='titleList'></breadcrumb>
             
            <!-- // admin.recall.select admin.recall.send admin.recall.record -->
             <el-button style="background: #9E0E00;color:#fff;" @click="goTo()" v-if="$authJudge('admin:recall:record')">历史记录</el-button>
        </div>
        <div class="tomeBox">
            <el-date-picker
                v-model="beginStr"
                format="yyyy-MM-dd"
                type="date"
                :clearable="true"
                @focus="resetTaskDate"
                placeholder="年/月/日">
            </el-date-picker>
            <el-date-picker
                format="yyyy-MM-dd"
                v-model="endStr"
                :clearable="true"
                :picker-options="pickerOptions"
                type="date"
                placeholder="年/月/日">
            </el-date-picker>
            <el-button style="background: #9E0E00;color:#fff;" v-if="$authJudge('admin:recall:select')" @click='search'>查询</el-button>
        </div>
        <div class="contents">
            <div style='text-align:right;color:#666;font-size:13px;padding:10px'>
                共有{{allTableLength}}条记录符合查询条件
            </div>
            <div class="tableBox">
                <el-table
                    :data="tableData"
                    border
                    header-cell-class-name="list-header-layout-bg"
                    v-loading="loading"
                    v-loadmoreTable="loadMore"
                    :header-cell-style="tableHeaderColor"
                    max-height="500"
                    style="width: 100%">               
                        <el-table-column
                            prop="sortId"
                            label="序号"
                            align="center"
                            :show-overflow-tooltip='true'
                            min-width="50">
                        </el-table-column>
                        <el-table-column
                            prop="commodityTitle"
                            label="课程"
                            align="center"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="userPhone"
                            label="账号"
                            :show-overflow-tooltip='true'
                            align="center"
                            min-width="120">
                        </el-table-column> 
                        <el-table-column
                            prop="createdAt"
                            label="订单提交时间"
                            :show-overflow-tooltip='true'
                            align="center"
                            min-width="120">
                        </el-table-column>                  
                </el-table>              
            </div>
            <div class="disposeBox">
                <div class='typeCss'>
                    <div>发送类型</div>
                    <div>
                        <!-- <el-radio v-model="radio" label="1">短信</el-radio> -->
                        <el-radio v-model="radio" label="0">APP推送</el-radio>                        
                    </div>
                </div>
                <div class='inputText'>
                    <p>消息主体</p>
                    <el-input
                        type="textarea"
                        :rows="5"
                        maxlength="50"
                        show-word-limit
                        v-model="textarea">
                    </el-input>
                </div>
            </div>
            <div class="floorBox">
                <el-button style="background: #9E0E00;color:#fff;" @click="sendMessages" v-if="$authJudge('admin:recall:send')">发送</el-button>
            </div>
        </div>         
    </div>
</template>
<script>

import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){
        return {
            tableData:[],
            loading:false,
            beginStr:'',
            endStr:'',
            radio:'0',
            pageNo:1,
            secllType:true,
            bools:true,
            islastPage:false,
            textarea:'',
            allTableLength:0,
            titleList:[
                {
                    name:'APP管理系统',
                    pathInfo:''
                },
                {
                    name:'疯狂追单',
                    pathInfo:''
                }
            ],
            // pageAtion:{
            //     paginationPage:1,
            //     pageTotal:0
            // }, 
            pickerOptions: {
                disabledDate: (time) => {
                    if (this.beginStr) {
                        let date1 = this.beginStr
                        let date2 = new Date(date1)
                        date2.setDate(date1.getDate() + 29)
                        return time.getTime() < this.beginStr || time.getTime() > date2
                    } else {
                        return time.getTime() < this.beginStr
                    }
                }
            }         
        }
    },
    created(){
        // this.getoldUserList();
    },
    props:{},
    components:{
        breadcrumb
    },
    computed:{},
    methods:{
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
        search(){
            this.tableData = [];
            if(this.bools){
                this.bools = false;
                this.pageNo = 1;
                this.secllType = false;
                setTimeout(() => {
                    this.getoldUserList(this.pageNo);
                },100)
            }
        },
        getoldUserList(num){
            var self = this; 
            if(!Number(this.beginStr)||!Number(this.endStr)){
                this.bools = true;
                this.secllType = true;
                this.$message.error("请输入开始/结束时间");
                return;
            }  
            let query = {
                params:{
                    pageSize:20,
                    pageNo:num,
                    beginAt:Number(this.beginStr)>0?this.formatDate(new Date(this.beginStr),'start'):'',
                    endAt:Number(this.beginStr)>0?this.formatDate(new Date(this.endStr),'end'):''                    
                }
            }
            self.$http.get(self.$server.getUserRecallList,query).then(res=>{
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
                                element.sortId = prePage*20+index+1;
                                return element;
                            });                            
                        } 
                   };
                    this.allTableLength = res.content.total;
                    this.islastPage= contentdate.isLastPage;
                    this.tableData = this.tableData.concat(listIds);
                    // if(!this.islastPage){
                        this.pageNo =num+1;
                    // }
                    this.$nextTick(function(){
                        this.loading = false;
                        this.bools = true;
                        this.secllType = true;
                    })                   
               }
            }).catch(()=>{
                this.secllType = true;
                this.bools = true;
            })            
        },
        sendMessages(){
            var self = this;
            if(!this.textarea){
                this.$message.error("请填写内容");
                return;
            }
            if(!this.tableData.length){
                this.$message.error("请先筛选订单。");
                return;
            }              
            var params = {
                beginAt:Number(this.beginStr)>0?this.formatDate(new Date(this.beginStr),'start'):'',
                endAt:Number(this.beginStr)>0?this.formatDate(new Date(this.endStr),'end'):'',
                pushMedium:'1',
                smsMedium:'0',
                content:this.textarea,
                receiverType:'2',
                letterMedium:'1'
            };
            self.$http.post(self.$server.getSendMessageForUserRecall,params).then(res=>{
               if(res.status==200){
                this.beginStr='';
                this.endStr='';  
                this.textarea='';                
                this.$message.success("发布成功");
               }
            })                        
        },
        resetTaskDate(){
            this.endStr = ''
        },
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #F3F3F3;font-weight: 500;font-size: 16px;'
            }
        },   
        loadMore(){
            if(!this.islastPage){
                if(this.secllType){
                    this.secllType = false;
                    this.getoldUserList(this.pageNo);
                }
            }
        },  
        goTo(){
            this.$router.push({path:'/oldUserObj/historyList'});
        }
    },
    mounted(){}
}
</script>
<style lang="scss">
.oldUser{
    .headers{
        flex-direction: row;
        display: flex;
        justify-content:space-between;       
    }
    .tomeBox{
        margin:20px 0;
    }
    .contents{
        .disposeBox{
            .typeCss{
                flex-direction: row;
                display: flex;
                justify-content:flex-start;
                margin-top: 25px;
                >div:nth-child(1){
                    margin-right: 20px;
                }
            }
            .inputText{
                >p:nth-child(1){
                    margin: 20px 0 10px 0;
                }                
            }
        }
        .floorBox{
            text-align:center;
            margin-top: 20px;
        }
    }
}
</style>

