<template>
    <div class="page-wrap activity-but-page">
        <div style="padding:20px">
            <breadcrumb :menuList ='titleList'></breadcrumb> 
        </div>
        <div class="page-head">
            <div class="queryBox">
                <div class="queryOne">
                    <div style="margin-right:4px;">
                        <el-select v-model="buttonId" placeholder="Button选择" clearable style="width:150px;" @change="buttonListEven">
                            <el-option
                            v-for="item in buttonList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>     
                    </div>                    
                    <el-date-picker clearable type="date" placeholder="选择时间" style="width:150px;margin-right:5px;" v-model="beginAt"></el-date-picker>
                    <div style="line-height:40px;margin-right:6px;color:#ccc;">-</div>
                    <el-date-picker clearable type="date" placeholder="结束时间" style="width:150px;margin-right:5px;" v-model="endAt"></el-date-picker>
                    <el-button style="background: #9E0E00;color:#fff;margin-left:5px;" @click="search">查询</el-button>                   
                </div>
                <el-button style="background: #9E0E00;color:#fff;" @click="exportEven(1)">导出</el-button> 
                <el-button style="background: #9E0E00;color:#fff;" @click="exportEven(2)">全部导出</el-button>  
            </div>            
        </div>
        <div class="page-content">
            <el-table :data="tableData"
                      border
                      v-loading="loading"
                      header-cell-class-name="list-header-layout-bg"
                      :empty-text="(buttonId>0&&searctType)>0?'暂无数据':'请选择Button名称'"
                      style="width: 100%">
                    <el-table-column
                        prop="currentAt"
                        label="日期"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="totalNum"
                        label="数量"
                        align="center"
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
    </div>
</template>
<script type="text/ecmascript-6">
    import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
    import { getToken } from '@/utils/auth';
    export default{
        data(){
            return{
                tableData:[],
                loading: false,
                pageAtion:{
                    paginationPage:1,
                    pageTotal:0
                },
                pageNo:1,
                pageSize:10,
                baseData:'',
                /* 
                    1抽奖、
                    2领取优惠券、
                    3规则、
                    4抽奖分享好友、
                    5抽奖分享朋友圈、
                    6优惠券分享好友、
                    7优惠券分享朋友圈'
                */
                searctType:false,
                buttonList:[                   
                    {
                        value:1,
                        label:'抽奖'
                    },
                    {
                        value:2,
                        label:'领取优惠券'
                    },
                    {
                        value:3,
                        label:'规则'
                    },
                    {
                        value:4,
                        label:'抽奖分享好友'
                    },
                    {
                        value:5,
                        label:'抽奖分享朋友圈'
                    },
                    {
                        value:6,
                        label:'优惠券分享好友'
                    },
                    {
                        value:7,
                        label:'优惠券分享朋友圈'
                    }
                ],
                buttonId:'',
                beginAt:'',
                endAt:'',
                pageNoAddNum:0,
                pageNo:1,
                pageSize:10,
                isLastPage:false,
                titleList:[
                        {
                            name:'统计',
                            pathInfo:''
                        },
                        {
                            name:'活动数据统计',
                            pathInfo:'/activityStatistics'
                        },
                        {
                            name:'成语猜猜猜',
                            pathInfo:'/activityStatistics/idioms/index'
                        },
                        {
                            name:'Button数据',
                            pathInfo:''
                        }                      
                ]                
            }
        },
        components:{
            breadcrumb
        },
        created(){
            // this.getButtonDataList(1);
        },
        watch: {
            beginAt: function(curVal,oldVal){
                var self = this;
                if(Number(self.endAt)<Number(curVal)){
                    self.endAt = null;
                }
            }, 
            endAt: function(curVal,oldVal){
                var self = this;
                if(Number(self.beginAt)>Number(curVal)){
                    self.endAt = null;
                }
            }            
        },        
        methods:{
            buttonListEven(data){
                var self = this;
                var objs = '';
                this.buttonList.forEach(element => {
                    if(element.value==data){
                            objs = element;
                    }
                });
                if(objs.label=='课程'){
                }else{
                    self.pageNoAddNum=0;
                    self.isLastPage=false;
                }
            },        
            search(){
                if(this.buttonId>0){
                    this.searctType = true;
                    this.getButtonDataList(1);
                }
            },
            exportEven(type){
                var self = this;    
                var url = '';  
                if(type==1){
                    let parems = {};
                    parems = {
                        type:self.buttonId,
                        beginAt:self.beginAt?self.formatDate(new Date(self.beginAt),"start",false):'',
                        endAt:self.endAt?self.formatDate(new Date(self.endAt),"end",false):'',
                    };
                    url = self.$server.ciExportButtonList+"?type="+parems.type+"&beginAt="+parems.beginAt+"&endAt="+parems.endAt+"&token="+getToken();                    
                }else{
                    url = self.$server.ciExportButtonList+"?token="+getToken();                   
                }    
                window.open(url);                    
            }, 
            childPageValue(num){
                if(Number(num)>0){
                    this.getTableList(Number(num))
                }                  
            },
            formatDate(date,type,timeType){
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
                    if(timeType){
                        return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
                    }else{
                        return y+"-"+m+"-"+d;
                    }
                    
                }else{
                    return '';
                }
            },            
            getButtonDataList(num){
                var self = this;     
                if(num){
                    self.pageNo = num;
                };                
                let query = {
                        params:{
                            type:self.buttonId,
                            beginAt:self.beginAt?self.formatDate(new Date(self.beginAt),"start",false):'',
                            endAt:self.endAt?self.formatDate(new Date(self.endAt),"end",false):'',
                            pageNo:self.pageNo,
                            pageSize:self.pageSize,                              
                        }
                    }           
                this.loading = true;            
                self.$http.get(self.$server.ciGetButtonList,query).then(res=>{
                    if(res.status==200){
                        this.loading = false;
                        var contentdate = res.content;
                        var listIds = [];
                        listIds = contentdate.list.map(function(element,index){
                            if(contentdate.pageNum==1){
                                element.sortId = index+1;
                                return element;
                            }else if(contentdate.pageNum>1){
                                element.sortId = (contentdate.pageNum-1)*10+index+1;
                                return element;
                            }
                        });          
                        self.tableData = listIds;
                        self.pageAtion.pageTotal = contentdate.total;
                        self.pageAtion.paginationPage =self.pageNo;
                        self.$nextTick(function(){
                            self.loading = false; 
                        }) 
                    }
                })                                                        
            }            
        },
        mounted(){
        }
    }
</script>
<style lang="scss">
    .activity-but-page{
        background: #fff;
        .page-head {
            .queryBox{
                display: flex;
                flex-direction: row;
                justify-content:space-between;     
                width: 100%;         
                margin-bottom: 10px; 
                padding: 0 20px;
                .queryOne{
                    width: 100%;   
                    display: flex;
                    flex-direction: row;   
                    justify-content:flex-start;           
                }
            }
        }
        .page-content {
            border-radius: 5px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        }
        .my-form-warp{
            text-align: center;
            .el-form{
                display: inline-block;
                .el-form-item__label{
                    line-height: 50px;
                }
                .el-input{
                    width: 360px;
                    height: 50px;
                    line-height: 50px;
                    .el-input__inner{
                        height: 50px;
                        line-height: 50px;
                    }
                }
                .my-pwd.el-input--suffix .el-input__inner{
                    padding-right: 40px;
                }
            }
        }
        .update-form{
            .el-form-item__label{
                font-size: 12px;
                width: 38px;
                text-align: justify;
                text-align-last: justify;
                margin-left: 32px;
            }
            .el-input{
                width: 360px;
            }
        }
        .reject-textarea{
            height: 110px;
            .el-textarea__inner{
                height: 100%!important;
            }
        }
        .word-number{
            font-size: 12px;
            color:#9A9A9A;
            margin:10px 0;
        }
        .my-message-alert{
            .el-message-box__message{
                text-align: center;
                margin:10px 0;
            }
            .el-message-box__btns{
                text-align: center;
                margin:15px 0;
            .el-button{
                background:#B4272D!important;
                border-color:#B4272D!important;
                width: 130px;
            }
        }
    }
    .block{
        text-align: center;
    }
}
</style>
