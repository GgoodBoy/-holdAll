<template>
    <div class="page-wrap cgt-detail-page">
        <div style="padding:20px">
            <breadcrumb :menuList ='titleList'></breadcrumb> 
        </div>        
        <div class="tabs">
            <div v-for="(item,index) in tabsArr" :class="[activeIndex==index+1 ?'actions': '']" :key="index" @click="tabsEven(index)">
                {{item.name}}
            </div>
        </div>
        <div class="page-head">
            <div class="queryBox">
                <div class="queryOne">
                    <el-input v-model="inputInfo" style="width:200px;margin-right:5px;" placeholder="输入手机号查询"></el-input>
                    <el-date-picker v-if="activeIndex==1||activeIndex==2" type="date" :placeholder="activeIndex==1?'注册时间':'购买时间'" style="width:150px;margin-right:5px;" v-model="beginAt"></el-date-picker>
                    <div v-if="activeIndex==1||activeIndex==2" style="line-height:40px;margin-right:6px;color:#ccc;">-</div>
                    <el-date-picker v-if="activeIndex==1||activeIndex==2" type="date" placeholder="结束时间" style="width:150px;margin-right:5px;" v-model="endAt"></el-date-picker>
                    <div v-if="activeIndex==1">
                        <el-select v-model="provinceId" placeholder="全部省" style="width:150px" clearable @change="getProvince(provinceId,1)">
                            <el-option
                            v-for="item in provinceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>     
                        <el-select v-model="cityId" placeholder="全部市" clearable style="width:150px">
                            <el-option
                            v-for="item in cityList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-else-if='activeIndex==1||activeIndex==2'>
                        <el-select v-model="channelType2" placeholder="全部注册渠道" clearable style="width:150px">
                            <el-option
                            v-for="item in options1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>     
                        <el-select v-model="orderStatus" placeholder="支付状态" clearable style="width:150px">
                            <el-option
                            v-for="item in options2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div> 
                    <el-button style="background: #9E0E00;color:#fff;margin-left:5px;" @click="search">查询</el-button>                   
                </div>
                <el-button style="background: #9E0E00;color:#fff;" @click="exportEven">导出</el-button>  
            </div>
        </div>
        <div class="page-content" v-show="activeIndex==1">
            <el-table :data="tableDataOne"
                    border
                    v-loading="loading"
                    header-cell-class-name="list-header-layout-bg"
                    style="width: 100%">
                <el-table-column
                    prop="cellphone"
                    label="手机号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="注册时间"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="provinceName"
                    align="center"
                    label="省/直辖市">
                </el-table-column>
                <el-table-column
                    prop="cityName"
                    align="center"
                    label="市">
                </el-table-column>
                <el-table-column
                    prop="invitationNum"
                    align="center"
                    label="邀请人数">
                </el-table-column>
                <el-table-column
                    prop="commission"
                    align="center"
                    label="佣金(元)">
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
                    label="手机号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="courseName"
                    label="购课名称"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    label="购买时间">
                </el-table-column>
                <el-table-column
                    prop="channelTypeName"
                    align="center"
                    label="购买渠道">
                </el-table-column>
                <el-table-column
                    prop="payPrice"
                    align="center"
                    label="实付金额">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="支付状态">
                        <template slot-scope="scope">
                            <div>{{scope.row.orderStatus==1?'支付成功':'待支付'}}</div>
                        </template>                    
                </el-table-column>
                <el-table-column
                    prop="channelType2Name"
                    align="center"
                    label="注册渠道">
                </el-table-column>
            </el-table>
        </div>  
        <div class="page-content" v-show='activeIndex==3'>
            <el-table :data="tableDataThree"
                    border
                    v-loading="loading"
                    header-cell-class-name="list-header-layout-bg"
                    style="width: 100%">
                <el-table-column
                    prop="receiveCellphone"
                    label="领取人手机号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="receptCellphone"
                    label="收件人手机号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="receptName"
                    align="center"
                    label="收件人姓名">
                </el-table-column>
                <el-table-column
                    prop="receptAddress"
                    align="center"
                    label="收件人地址">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    label="提交时间">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status==1" 
                            style=" padding: 5px 0;
                                    background: #B9D8F7;
                                    width: 80px;
                                    margin: auto;
                                    border-radius: 6px;
                                    color: #fff;
                                    cursor:not-allowed;"
                            >已发货</div>
                            <div v-else  @click="isReceive(scope.row)"
                            style=" padding: 5px 0;
                                    background: #f4f4f4;
                                    width: 80px;
                                    cursor: pointer;
                                    margin: auto;
                                    border-radius: 6px;
                                    color: #333;"
                            >未发货</div>
                        </template>                    
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
                tableDataThree:[],
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
                        name:'用户详情'
                    },
                    {
                        name:'购买详情'
                    },
                    {
                        name:'邮寄列表'
                    }                     
                ],
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
                            name:'数据详情',
                            pathInfo:''
                        }                                             
                ],
                // 1.app端 2.M站 3.微信公众号 4.微信群-朋友圈 5.杜老师 6.端外1 7.端外2 8.端外3
                options1:[
                    {
                        value:-1,
                        label:' 全部'
                    },                    
                    {
                        value:1,
                        label:' APP端'
                    },
                    {
                        value:2,
                        label:'M站'
                    },
                    {
                        value:3,
                        label:'微信公众号'
                    },
                    {
                        value:4,
                        label:'微信群-朋友圈'
                    },
                    {
                        value:5,
                        label:'杜老师'
                    },
                    {
                        value:6,
                        label:'端外1'
                    },
                    {
                        value:7,
                        label:'端外2'
                    },
                    {
                        value:8,
                        label:'端外3'
                    }                      
                ],
                options2:[
                    {
                        value:-1,
                        label:' 全部'
                    },                     
                    {
                        value:0,
                        label:' 待支付'
                    },
                    {
                        value:1,
                        label:'支付成功'
                    }
                ],
                provinceList:[],
                provinceArr:[],
                provinceId:'',
                cityList:[],
                cityId:'',
                cityArr:[],
                beginAt:'',
                endAt:'',
                inputInfo:'',
                typeId:'',
                channelType2:-1,
                orderStatus:-1       
            }        
        },
        components:{
            breadcrumb
        },
        created(){
            this.typeId = this.$route.query.type;
            this.getRegionList();
            this.getTableList(1);
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
            childPageValue(num){
                if(Number(num)>0){
                    this.getTableList(Number(num))
                }                
            },        
            tabsEven(num){
                if(this.activeIndex!=num+1){
                    this.beginAt='';
                    this.endAt='';
                    this.inputInfo='';
                    this.activeIndex=num+1;
                    this.provinceId='';
                    this.cityId='';
                    this.channelType2='';
                    this.orderStatus='';
                    this.getTableList(1);
                }
            },
            isReceive(data){   
                var self = this;                    
                this.$http.post(this.$server.cgtUpdateStatus+'/'+data.id).then(res=>{
                    if(res.status==200){
                        this.getTableList(self.pageNo);
                    }
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
            /**
             * 获取地区信息
             */
            getRegionList(){
                this.$http.get(this.$server.getRegionList,{}).then(res=>{
                    if(res.status==200){
                        let provinceArr = [{
                                id: -1,
                                name: "全部",
                                level: 1,
                                parentId: 0,
                                label: "全部",
                                value: -1,                   
                            }],cityArr = [];
                        res.content.forEach((item,index)=>{
                            item.label = item.name;
                            item.value = item.id;
                            if(item.level==1){
                                provinceArr.push(item)
                            }else if(item.level==2){
                                cityArr.push(item)
                            }
                        })
                        this.provinceArr = provinceArr;
                        this.cityArr = cityArr;
                        this.provinceList = [...this.provinceArr];
                    }
                })
            },   
            /**
             * 选择省
             */
            getProvince(val,type){
                if(val){
                    let obj = this.provinceArr.find(item=>item.value==val)
                    let cityList = [{
                            label: "全部",
                            value: -1,                  
                        }]
                    this.cityArr.forEach(item=>{
                        if(obj.id==-1){
                            cityList.push(item)
                        }else{
                            if(item.parentId == obj.id){
                                cityList.push(item)
                            };
                        }
                    })                
                    if(type==1){
                        this.cityList = cityList;
                    }
                }else{
                    this.cityList=[];
                }
                if(type==1){
                    this.cityId = -1;
                }
            },    
            search(){
                this.getTableList(1);
            },     
            exportEven(){
                var self = this;          
                let parems = {};
                var url = '';
                if(self.activeIndex==1){
                    parems = {
                        channelType:self.typeId,
                        cellphone:self.inputInfo,
                        beginAt:self.beginAt?self.formatDate(new Date(self.beginAt),"start"):'',
                        endAt:self.endAt?self.formatDate(new Date(self.endAt),"end"):'',
                        provinceId:self.provinceId,
                        cityId:self.cityId,
                        pageNo:self.pageNo,
                        pageSize:self.pageSize,                    
                    };
                    var url = self.$server.cgtUserDetailList+"?channelType="+parems.channelType+"&cellphone="+parems.cellphone+"&beginAt="+parems.beginAt+"&endAt="+parems.endAt+"&provinceId="+parems.provinceId+"&cityId="+parems.cityId+"&token="+getToken();  
                }else if(self.activeIndex==2){
                    parems = {
                        channelType:self.typeId,
                        channelType2:self.channelType2,
                        cellphone:self.inputInfo,
                        orderStatus:self.orderStatus,
                        beginAt:self.beginAt?self.formatDate(new Date(self.beginAt),"start"):'',
                        endAt:self.endAt?self.formatDate(new Date(self.endAt),"end"):'',
                        pageNo:self.pageNo,
                        pageSize:self.pageSize,  
                    };
                    var url = self.$server.cgtExportOrderDetailList+"?channelType="+parems.channelType+"&cellphone="+parems.cellphone+"&beginAt="+parems.beginAt+"&endAt="+parems.endAt+"&channelType2="+parems.channelType2+"&orderStatus="+parems.orderStatus+"&token="+getToken();            
                }else{
                    parems = {
                        cellphone:self.inputInfo,
                        token:getToken()
                    };
                    var url = self.$server.cgtAddressList+"?receiveCellphone="+parems.cellphone+"&token="+parems.token;                                
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
                            channelType:self.typeId,
                            cellphone:self.inputInfo,
                            beginAt:self.beginAt?self.formatDate(new Date(self.beginAt),"start"):'',
                            endAt:self.endAt?self.formatDate(new Date(self.endAt),"end"):'',
                            provinceId:self.provinceId,
                            cityId:self.cityId,
                            pageNo:self.pageNo,
                            pageSize:self.pageSize,                              
                        }
                    }
                    url = this.$server.cgtGetUserDetailByChannel;
                }else if(self.activeIndex==2){
                    query = {
                        params:{
                            channelType:self.typeId,
                            channelType2:self.channelType2,
                            cellphone:self.inputInfo,
                            orderStatus:self.orderStatus,
                            beginAt:self.beginAt?self.formatDate(new Date(self.beginAt),"start"):'',
                            endAt:self.endAt?self.formatDate(new Date(self.endAt),"end"):'',
                            pageNo:self.pageNo,
                            pageSize:self.pageSize,   
                        }
                    }  
                    url = this.$server.cgtGetOrderDetailByChannel;                  
                }else{
                    query = {
                        params:{
                            receiveCellphone:self.inputInfo,
                            pageNo:self.pageNo,
                            pageSize:self.pageSize,   
                        }
                    }  
                    url = this.$server.cgtGetAdressList;                       
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
                        }else{
                            self.tableDataThree = listIds;
                        }
                        console.log('tableDataThree',self.tableDataThree);
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
    .cgt-detail-page{
        background: #fff;
        .page-head {
            padding: 28px 19px 30px 17px;
            background: #fff;
            .queryBox{
                display: flex;
                flex-direction: row;
                justify-content:space-between;     
                width: 100%;          
                .queryOne{
                    width: 100%;   
                    display: flex;
                    flex-direction: row;   
                    justify-content:flex-start;           
                }
            }
        }
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
.actions{
    background: #9E0E00 !important;
    color: #fff !important;
}

</style>
