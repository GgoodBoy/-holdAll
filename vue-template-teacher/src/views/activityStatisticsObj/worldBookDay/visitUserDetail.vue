<template>
    <div class="page-wrap user-management-page">
        <div style="padding:20px">
            <breadcrumb :menuList ='titleList'></breadcrumb> 
        </div>  
        <div class="page-tabs">
            <div class="tabs">
                <div v-for="(item,index) in tabsArr" :class="[activeIndex==index+1 ?'actions': '']" :key="index" @click="tabsEven(index)">
                    {{item.name}}
                </div>
            </div>            
            <el-button style="background: #9E0E00;width:60px;color:#fff;text-align: center;padding: 10px;" @click="exportEven">导出</el-button>                   
        </div>      
        <div class="page-content" v-show="activeIndex==1">
            <el-table :data="tableDataOne"
                    border
                    v-loading="loading"
                    header-cell-class-name="list-header-layout-bg"
                    style="width: 100%">
                <el-table-column
                    prop="cellphone"
                    label="用户帐号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="num"
                    label="获得积分"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    label="获得时间">
                </el-table-column>
                <el-table-column
                    prop="typeStr"
                    align="center"
                    label="类型">
                </el-table-column>
            </el-table>
        </div>
        <div class="page-content" v-show='activeIndex==2'>
            <el-table :data="tableDataTwo"
                    border
                    v-loading="loading"
                    header-cell-class-name="list-header-layout-bg"
                    style="width: 100%">
                <el-table-column
                    prop="cellphone"
                    label="用户帐号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="actualPay"
                    label="充值金额（元）"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="orderId"
                    align="center"
                    label="订单号">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    label="充值时间">
                </el-table-column>       
            </el-table>
        </div>
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
</template>
<script type="text/ecmascript-6">
    import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
    import { getToken } from '@/utils/auth';
    export default{
        data(){
            return{
                tableDataOne:[],
                tableDataTwo:[],
                loading: false,
                pageAtion:{
                    pageTotal:0,
                    paginationPage:1
                }, 
                pageNo:1,
                pageSize:10,              
                activeIndex:1,
                tabsArr:[
                    {
                        name:'积分'
                    },
                    {
                        name:'充值'
                    }                    
                ],
                titleList:[                                            
                ],
                typeId:'',
                // channelType2:-1,
                actionId:''
            }        
        },
        components:{
            breadcrumb
        },
        created(){
            this.typeId = this.$route.query.type;
            this.actionId = this.$route.query.id;
            this.titleList = [
                        {
                            name:'统计',
                            pathInfo:''
                        },                    
                        {
                            name:'活动数据统计',
                            pathInfo:'/activityStatistics'
                        },
                        {
                            name:'4.23世界读书日',
                            pathInfo:'/activityStatistics/worldBookDay/worldBookDayOne'
                        },
                        {
                            name:'访问用户详情',
                            pathInfo:`/activityStatistics/worldBookDay/dataDetail/2/${this.typeId}`
                        },
                        {
                            name:'详情',
                            pathInfo:''
                        } ]
            this.getTableList(1);
        },
        watch: {},
        methods:{   
            childPageValue(num){
                if(Number(num)>0){
                    this.getTableList(Number(num))
                }                
            },        
            tabsEven(num){    
                    this.activeIndex=num+1;
                    if(this.activeIndex==1){
                        this.titleList=[
                        {
                            name:'统计',
                            pathInfo:''
                        },                    
                        {
                            name:'活动数据统计',
                            pathInfo:'/activityStatistics'
                        },
                        {
                            name:'4.23世界读书日',
                            pathInfo:'/activityStatistics/worldBookDay/worldBookDayOne'
                        },
                        {
                            name:'访问用户详情',
                            pathInfo:`/activityStatistics/worldBookDay/dataDetail/2/${this.typeId}`
                        },
                        {
                            name:'积分',
                            pathInfo:''
                        }                                             
                        ];
                    }else{
                        this.titleList=[
                        {
                            name:'统计',
                            pathInfo:''
                        },                    
                        {
                            name:'活动数据统计',
                            pathInfo:'/activityStatistics'
                        },
                        {
                            name:'4.23世界读书日',
                            pathInfo:'/activityStatistics/worldBookDay/worldBookDayOne'
                        },
                        {
                            name:'访问用户详情',
                            pathInfo:`/activityStatistics/worldBookDay/dataDetail/2/${this.typeId}`
                        },
                        {
                            name:'充值',
                            pathInfo:''
                        }                                             
                        ]; 
                    }                    
                    this.getTableList(1);
            },
            search(){
                this.getTableList(1);
            },     
            exportEven(){
                var self = this;          
                let parems = {};
                var url = '';
                if(self.activeIndex==1){
                    var url = self.$server.exportIntegralDetail+this.actionId+"?token="+getToken();  
                }else if(self.activeIndex==2){
                    var url = self.$server.exportOrderDetail+this.actionId+"?token="+getToken();            
                }
                window.open(url);                   
            }, 
            getTableList(num){
                var self = this;    
                this.loading = true;
                if(num){
                    self.pageNo = num;
                };
                var url = '';
                let query = {};
                if(self.activeIndex==1){
                    query = {
                        params:{
                            pageNo:self.pageNo,
                            pageSize:self.pageSize,                              
                        }
                    }
                    url = this.$server.getIntegralDetailRd+this.actionId;
                }else if(self.activeIndex==2){
                    query = {
                        params:{
                            pageNo:self.pageNo,
                            pageSize:self.pageSize,   
                        }
                    }  
                    url = this.$server.getOrderDetailRd+this.actionId;                  
                }
                this.$http.get(url,query).then(res=>{
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
                        if(self.activeIndex==1){
                            self.tableDataOne = listIds;
                        }else if(self.activeIndex==2){
                            self.tableDataTwo = listIds;
                        }
                        self.pageAtion.pageTotal = contentdate.total;
                        self.pageAtion.paginationPage =self.pageNo;
                        self.$nextTick(function(){
                            self.loading = false; 
                        }) 
                    }
                }).catch(()=>{
                    this.loading = false;
                })
            }       
        },
        mounted(){
        }
    }
</script>
<style lang="scss">
    .user-management-page{
        background: #fff;
        .page-head {
            padding: 28px 19px 30px 17px;
            background: #fff;
            .queryBox{
                display: flex;
                flex-direction:column;
                justify-content:space-between;     
                width: 100%;          
                .queryOne{
                    width: 100%;   
                    display: flex;
                    flex-direction: row;   
                    justify-content:flex-start;           
                }          
                .queryTwo{
                    width: 100%;   
                    display: flex;
                    flex-direction: row;   
                    justify-content:flex-start;  
                    margin-top: 10px;
                    .queryTwo_1{
                        width: 100%;   
                        display: flex;
                        flex-direction: row;   
                        justify-content:flex-start;                          
                    }         
                }
            }
        }
        .page-tabs{
            display: flex;
            flex-direction: row;
            align-items:center; 
            justify-content: space-between;      
            margin-bottom: 5px;     
            .tabs{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content:flex-start;
                margin: 0 17px;
                border-bottom: 1px solid #f4f4f4;
                // margin-bottom: 20px;
                div{
                    border: 1px solid #f4f4f4;
                    border-bottom: none;
                    cursor: pointer;
                    padding: 10px 20px;
                    background: #fff;
                    color: #ccc;
                }
            }
        }

        .page-content {
            border-radius: 5px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        }
        .block{
            text-align: center;
        }
    }   
.actions{
    background: #9E0E00 !important;
    color: #fff !important;
}

</style>
