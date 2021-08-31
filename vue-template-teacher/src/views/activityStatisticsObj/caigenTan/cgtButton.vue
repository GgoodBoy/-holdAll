<template>
    <div class="page-wrap cgt-activity-but-page">
        <div style="padding:20px">
            <breadcrumb :menuList ='titleList'></breadcrumb> 
        </div>
        <div class="page-head">
            <div class="queryBox">
                <div class="queryOne">
                    <div>
                        <!-- <el-select v-model="buttonId" placeholder="Button选择" style="width:150px;" @change="buttonListEven"> -->
                        <el-select v-model="buttonId" placeholder="Button选择" style="width:150px;margin-right:5px;">
                            <el-option
                            v-for="item in buttonList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>     
                        <!-- <el-select v-model="courseId" placeholder="选择课程" :disabled='courseSelectType' style="width:150px;margin-right:3px;" v-loadmore="loadMore">
                            <el-option
                            v-for="item in courseList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id">
                            </el-option>
                        </el-select> -->
                    </div>                    
                    <el-date-picker type="date" placeholder="选择时间" style="width:150px;margin-right:5px;" v-model="beginAt"></el-date-picker>
                    <div style="line-height:40px;margin-right:6px;color:#ccc;">-</div>
                    <el-date-picker type="date" placeholder="结束时间" style="width:150px;margin-right:5px;" v-model="endAt"></el-date-picker>
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
                      :empty-text="(buttonId>0&&searctType)?'暂无数据':'请选择Button名称'"
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
                /* 1.成人 
                2.少儿 
                3.活动规则 
                4.主页摇一摇 
                5.活动页摇一摇 
                6.活动页领取 
                7.测一测活动页分享 
                8.摇一摇活动页分享  
                9.主页测一测 
                10.活动页测一测 
                11.活动页再测一次 
                12.成人分类1（周易） 
                13.成人分类2（精品） 
                14.成人分类3（国艺） 
                15.成人分类4（文史） 
                16.少儿分类1（语文） 
                17.少儿分类2（精品） 
                18.少儿分类3（国艺） 
                19.少儿分类4（诗词） 
                20.课程'*/
                buttonList:[                   
                    {
                        value:1,
                        label:'分享'
                    },
                    {
                        value:2,
                        label:'抢券'
                    },
                    {
                        value:3,
                        label:'领书'
                    },
                    {
                        value:4,
                        label:'赚钱'
                    },
                    {
                        value:5,
                        label:'活动规则'
                    },
                    {
                        value:6,
                        label:'播放'
                    },
                    {
                        value:7,
                        label:'去购课'
                    },
                    {
                        value:8,
                        label:'抢劵弹窗按钮:去使用'
                    },
                    {
                        value:9,
                        label:'领书页面按钮:去购课'
                    },
                    {
                        value:10,
                        label:'领书页面按钮:去邀请'
                    },
                    {
                        value:11,
                        label:'领书页面按钮:领取'
                    }
                ],
                // courseList:[],
                buttonId:'',
                // courseId:'',
                beginAt:'',
                endAt:'',
                pageNoAddNum:1,
                pageNo:1,
                pageSize:10,
                // courseSelectType:true,
                // isLastPage:false,
                searctType:false,
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
                            name:'菜根谭活动数据统计',
                            pathInfo:'/activityStatistics/caigenTan/cgtActivity'
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
            // buttonListEven(data){
            //     var self = this;
            //     var objs = '';
            //     this.buttonList.forEach(element => {
            //         if(element.value==data){
            //                 objs = element;
            //         }
            //     });
                // if(objs.label=='课程'){
                //     self.courseSelectType = false;
                //     this.getCoursrlist(1);
                // }else{
                //     self.courseSelectType = true;
                //     self.courseId = '';
                // }
            // },
            /*
            *获取课程分页
            */
            // getCoursrlist(num){
            //         var self = this;
            //         if(num){
            //             self.pageNoAddNum = self.pageNoAddNum+num;
            //         }else{
            //             self.pageNoAddNum = 1;
            //         }            
            //         let params = {
            //             pageNo:self.pageNoAddNum,
            //             pageSize:10
            //         }
            //         let query = {
            //             params
            //         }
            //         self.$http.get(self.$server.getCourseDoubleTwelve,query).then(res=>{
            //             if(res.status==200){
            //                 if(res.content.isLastPage){
            //                     self.isLastPage = true;
            //                 }
            //                 self.courseList = self.courseList.concat(res.content.list);
            //             }
            //         })
            // },            
            search(){
                if(this.buttonId>0){
                    this.searctType=true;
                    this.getButtonDataList(1);
                }
            },
            exportEven(type){
                var self = this;          
                let parems = {};
                var url = '';
                if(type==1){
                    parems = {
                        type:self.buttonId,
                        // courseId:self.courseId,
                        beginAt:self.beginAt?self.formatDate(new Date(self.beginAt),"start",false):'',
                        endAt:self.endAt?self.formatDate(new Date(self.endAt),"end",false):'',
                    };
                    url = self.$server.cgeExportButtonList+"?type="+parems.type+"&beginAt="+parems.beginAt+"&endAt="+parems.endAt+"&token="+getToken();              
                    
                }else{
                    url = self.$server.cgeExportButtonListAll+"?token="+getToken();
                }
                window.open(url);                  
            }, 
            // loadMore(){
            //     if(!this.isLastPage){
            //         this.getCoursrlist(1);
            //     }
            // },
            childPageValue(num){
                if(Number(num)>0){
                    this.getButtonDataList(Number(num))
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
                self.$http.get(self.$server.cgtGetButtonList,query).then(res=>{
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
    .cgt-activity-but-page{
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
