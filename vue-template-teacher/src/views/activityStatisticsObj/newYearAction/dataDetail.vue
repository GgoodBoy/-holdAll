<template>
    <div class="page-wrap user-management-page">
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
                    <el-date-picker type="date" :placeholder="(activeIndex==1||activeIndex==3)?'注册时间':'购买时间'" style="width:170px;margin-right:5px;" v-model="beginAt"></el-date-picker>
                    <div style="line-height:40px;margin-right:6px;color:#ccc;">-</div>
                    <el-date-picker type="date" placeholder="结束时间" style="width:170px;margin-right:5px;" v-model="endAt"></el-date-picker>
                    <div v-if="activeIndex==1||activeIndex==3">
                        <el-select v-model="provinceId" placeholder="全部省" style="width:160px" clearable @change="getProvince(provinceId,1)">
                            <el-option
                            v-for="item in provinceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>     
                        <el-select v-model="cityId" placeholder="全部市" clearable style="width:160px">
                            <el-option
                            v-for="item in cityList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-else>
                        <el-select v-model="channelType2" placeholder="全部注册渠道" clearable style="width:160px">
                            <el-option
                            v-for="item in options1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>     
                        <el-select v-model="orderStatus" placeholder="支付状态" clearable style="width:160px">
                            <el-option
                            v-for="item in options2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div> 
                    <el-button v-if="activeIndex!=3" style="background: #9E0E00;width:60px;text-align: center;padding: 0;color:#fff;margin-left:5px;" @click="search">查询</el-button>
                    <el-button v-if="activeIndex!=3" style="background: #9E0E00;width:60px;color:#fff;text-align: center;padding: 0;" @click="exportEven">导出</el-button>                   
                </div>
                <div class="queryTwo" v-if="activeIndex==3">
                    <div class="queryTwo_1">
                        <el-date-picker type="date" :placeholder="'访问时间'" style="width:170px;margin-right:5px;" v-model="beginAtNext"></el-date-picker>
                        <div style="line-height:40px;margin-right:6px;color:#ccc;">-</div>
                        <el-date-picker type="date" placeholder="结束时间" style="width:170px;margin-right:5px;" v-model="endAtNext"></el-date-picker>                        
                        <el-button style="background: #9E0E00;color:#fff;margin-left:5px;" @click="search">查询</el-button>
                    </div>
                    <el-button style="background: #9E0E00;color:#fff;" @click="exportEven">导出</el-button>
                </div> 
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
        <div class="page-content" v-show="activeIndex==3">
            <el-table :data="tableDataThree"
                    border
                    v-loading="loading"
                    header-cell-class-name="list-header-layout-bg"
                    style="width: 100%">
                <el-table-column
                    prop="tellphone"
                    label="手机号"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="regCreatedAt"
                    label="注册时间"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="visitCreatedAt"
                    label="访问时间"
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
            </el-table>
        </div> 
        <div class="block">
            <el-pagination
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
                        name:'访问用户'
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
                            name:'元旦活动数据统计',
                            pathInfo:'/activityStatistics/newYearAction/activityStatistics'
                        },
                        {
                            name:'数据详情',
                            pathInfo:''
                        }                                             
                ],
                //1.公众号 2.APP 3.M站 4.微信群朋友圈（分享） 5.备用1
                options1:[
                    {
                        value:-1,
                        label:' 全部'
                    },                    
                    {
                        value:1,
                        label:' 公众号'
                    },
                    {
                        value:2,
                        label:'APP'
                    },
                    {
                        value:3,
                        label:'M站'
                    },
                    {
                        value:4,
                        label:'微信群朋友圈（分享）'
                    },
                    {
                        value:5,
                        label:'备用1'
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
                beginAtNext:'',
                endAtNext:'',
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
            },
            beginAtNext: function(curVal,oldVal){
                var self = this;
                if(Number(self.endAtNext)<Number(curVal)){
                    self.endAtNext = null;
                }
            }, 
            endAtNext: function(curVal,oldVal){
                var self = this;
                if(Number(self.beginAtNext)>Number(curVal)){
                    self.endAtNext = null;
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
                // if(this.activeIndex!=num+1){
                    this.beginAt='';
                    this.endAt='';
                    this.beginAtNext='';
                    this.endAtNext='';                    
                    this.inputInfo='';
                    this.activeIndex=num+1;
                    this.provinceId='';
                    this.cityId='';
                    this.channelType2='';
                    this.orderStatus='';
                    this.getTableList(1);
                // }
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
                    };
                    var url = self.$server.nYuserDetailList+"?channelType="+parems.channelType+"&cellphone="+parems.cellphone+"&beginAt="+parems.beginAt+"&endAt="+parems.endAt+"&provinceId="+parems.provinceId+"&cityId="+parems.cityId+"&token="+getToken();  
                }else if(self.activeIndex==2){
                    parems = {
                        channelType:self.typeId,
                        channelType2:self.channelType2,
                        cellphone:self.inputInfo,
                        orderStatus:self.orderStatus,
                        beginAt:self.beginAt?self.formatDate(new Date(self.beginAt),"start"):'',
                        endAt:self.endAt?self.formatDate(new Date(self.endAt),"end"):''
                    };
                    var url = self.$server.nYOrderDetailList+"?channelType="+parems.channelType+"&cellphone="+parems.cellphone+"&beginAt="+parems.beginAt+"&endAt="+parems.endAt+"&channelType2="+parems.channelType2+"&orderStatus="+parems.orderStatus+"&token="+getToken();            
                }else{
                    parems = {
                        channelType:self.typeId,
                        cellphone:self.inputInfo,
                        beginAt:self.beginAt?self.formatDate(new Date(self.beginAt),"start"):'',
                        endAt:self.endAt?self.formatDate(new Date(self.endAt),"end"):'',
                        beginAtNext:self.beginAtNext?self.formatDate(new Date(self.beginAtNext),"start"):'',
                        endAtNext:self.endAtNext?self.formatDate(new Date(self.endAtNext),"end"):'',
                        provinceId:self.provinceId,
                        cityId:self.cityId                  
                    };
                    var url = self.$server.nYuserVisitDetail+"?channelType="+parems.channelType+"&tellphone="+parems.cellphone+"&regBeginAt="+parems.beginAt+"&regEndAt="+parems.endAt+"&visitBeginAt="+parems.beginAtNext+"&visitEndAt="+parems.endAtNext+"&provinceId="+parems.provinceId+"&cityId="+parems.cityId+"&token="+getToken();                      
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
                    url = this.$server.getNyUserDetailByChannel;
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
                    url = this.$server.getNyOrderDetailByChannel;                  
                }else{
                    query = {
                        params:{
                            channelType:self.typeId,
                            tellphone:self.inputInfo,
                            regBeginAt:self.beginAt?self.formatDate(new Date(self.beginAt),"start"):'',
                            regEndAt:self.endAt?self.formatDate(new Date(self.endAt),"end"):'',
                            visitBeginAt:self.beginAtNext?self.formatDate(new Date(self.beginAtNext),"start"):'',
                            visitEndAt:self.endAtNext?self.formatDate(new Date(self.endAtNext),"end"):'',
                            provinceId:self.provinceId,
                            cityId:self.cityId,
                            pageNo:self.pageNo,
                            pageSize:self.pageSize,   
                        }
                    }  
                    url = this.$server.getNyUserVisitDetail;                  
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
