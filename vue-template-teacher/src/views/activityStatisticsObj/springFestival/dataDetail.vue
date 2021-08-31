<template>
    <div class="page-wrap user-springFestival-page">
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
                    <el-input v-model="inputInfo" style="width:200px;margin-right:5px;" :placeholder="activeIndex!=3?'输入手机号查询':'输入课程名称'"></el-input>
                    <el-date-picker v-if="activeIndex==1||activeIndex==2" type="date" :placeholder="(activeIndex==1||activeIndex==2)?'注册时间':'购买时间'" style="width:170px;margin-right:5px;" v-model="beginAt"></el-date-picker>
                    <div v-if="activeIndex==1||activeIndex==2" style="line-height:40px;margin-right:6px;color:#ccc;">-</div>
                    <el-date-picker v-if="activeIndex==1||activeIndex==2" type="date" placeholder="结束时间" style="width:170px;margin-right:5px;" v-model="endAt"></el-date-picker>
                    <div v-if="activeIndex==1||activeIndex==2">
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
                    <el-button v-if="activeIndex!=2" style="background: #9E0E00;width:60px;text-align: center;padding: 0;color:#fff;margin-left:5px;" @click="search">查询</el-button>
                    <el-button v-if="activeIndex==1" style="background: #9E0E00;width:60px;color:#fff;text-align: center;padding: 0;" @click="exportEven">导出</el-button>                   
                </div>
                <div class="queryTwo" v-if="activeIndex==2">
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
                    prop="tellphone"
                    label="用户帐号"
                    align="center"
                    min-width="120"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="regCreatedAt"
                    label="注册时间"
                    show-overflow-tooltip
                    align="center"
                    min-width="150"
                >
                </el-table-column>
                <el-table-column
                    prop="visitCreatedAt"
                    align="center"
                    show-overflow-tooltip
                    min-width="150"
                    label="访问时间">
                </el-table-column>
                <el-table-column
                    prop="areaName"
                    align="center"
                    min-width="100"
                    label="省-市">
                </el-table-column>
                <el-table-column
                    prop="goldNum"
                    align="center"
                    label="我的礼金">
                </el-table-column>
                <el-table-column
                    prop="allFuBaoNum"
                    align="center"
                    min-width="80"
                    label="已许愿福包">                    
                </el-table-column>
                <el-table-column
                    prop="disassembledNum"
                    align="center"
                    min-width="80"
                    label="已开奖福包">
                </el-table-column>
                <el-table-column
                    align="center"
                    min-width="120"
                    label="操作">
                        <template slot-scope="scope">
                            <div>
                                <el-button type="text" @click="dialogType(scope.row,1)">获奖记录</el-button>
                                <el-button type="text" @click="dialogType(scope.row,2)">礼金记录</el-button>
                            </div>
                        </template>                    
                </el-table-column>
            </el-table>
        </div>
        <div class="page-content" v-show="activeIndex==3">
            <el-table :data="tableDataThree"
                    border
                    header-align='center'
                    header-cell-class-name="list-header-layout-bg"
                    style="width: 100%">
                <el-table-column
                    prop="sortId"
                    label="序号"
                    min-width="50"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="courseName"
                    show-overflow-tooltip
                    label="课程名称"
                    min-width="120"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="num"
                    align="center"
                    min-width="80"
                    label="获奖记录">
                </el-table-column>
                <el-table-column
                    align="center"
                    min-width="80"
                    label="操作">
                        <template slot-scope="scope">
                            <div>
                                <el-button type="text" @click="dialogType(scope.row,3)">详情</el-button>
                            </div>
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
        <el-dialog :custom-class="'edit-dialog'" :visible.sync="editDialogVisible1" :width="'500px'">
                <div style="text-align:center;margin-bottom:20px;">获奖记录</div>
                <div class="editDialogBox" ref='editDialogBoxOne'  @scroll="scrollEventww">
                    <div v-for='(item,index) in tableDataDetailOne' :key="index">
                        <div>{{item.type==1?item.content+'礼金':item.courseName+'免费观看权'+item.content+'天'}}</div>
                        <div>{{item.createdAt}}</div>
                    </div>
                </div>
        </el-dialog>
        <el-dialog :custom-class="'edit-dialog1'" :visible.sync="editDialogVisible2" :width="'500px'">
                    <div style="text-align:center;margin-bottom:20px;">我的礼金</div>
                    <div class="editDialogBox" ref='editDialogBoxTwo' @scroll="scrollEventww">
                        <div v-for='(item,index) in tableDataDetailTwo' :key="index">
                            <div class="one">
                                <div v-if="item.type==1">每日收获礼金</div>
                                <div v-else-if="item.type==2">获得签到任务礼金</div>
                                <div v-else-if="item.type==3">获得购买任务礼金</div>
                                <div v-else-if="item.type==4">获得分享任务礼金</div>
                                <div v-else-if="item.type==5">中奖礼金</div>
                                <div v-else-if="item.type==6">兑换平安符</div>
                                <div v-else-if="item.type==7">兑换吉祥符</div>
                                <div v-else>兑换好运符</div>
                                <div>{{item.createdAt}}</div>
                            </div>
                            <div>{{item.num>0?'+'+item.num:(item.num||0)}}</div>
                        </div>
                    </div>
        </el-dialog> 
        <el-dialog :custom-class="'edit-dialog2'" :visible.sync="editDialogVisible3" :width="'700px'" :show-close="true">
            <div class="details">
                <div class="headers">
                    <div class="header_one">
                        <el-input v-model="input" placeholder="请输入内容"></el-input>
                        <el-button type="danger" style="margin-left:5px;" @click="detailSelect">查询</el-button>
                    </div>
                    <el-button type="danger" @click="exportDteailis">导出</el-button>
                </div>
                <div class="contents">
                    <el-table
                        :data="tableDataDetailThree"
                        border
                        header-align='center'
                        style="width: 100%">
                        <el-table-column
                            prop="sortId"
                            label="序号"
                            align="center"
                            min-width="50">
                        </el-table-column>
                        <el-table-column
                            prop="cellphone"
                            label="用户帐号"
                            show-overflow-tooltip
                            align="center"
                            min-width="180">
                        </el-table-column>
                        <el-table-column
                            prop="createdAt"
                            align="center"
                            label="获奖时间"
                            min-width="180">
                        </el-table-column>
                        <el-table-column
                            prop="content"
                            min-width="180"
                            align="center"
                            label="有效期">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="blocks">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValueNext"
                        :current-page.sync="pageAtionNext.paginationPage"
                        :total="pageAtionNext.pageTotal">
                    </el-pagination>
                </div>                 
            </div>
        </el-dialog>                  
    </div>
</template>
<script type="text/ecmascript-6">
    import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
    import { getToken } from '@/utils/auth';
    export default{
        data(){
            return{
                editDialogVisible1:false,
                editDialogVisible2:false,
                editDialogVisible3:false,
                tableDataDetailOne:[],
                tableDataDetailTwo:[],
                tableDataDetailThree:[],
                tableDataOne:[],
                tableDataTwo:[],
                tableDataThree:[],
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                loading: false,
                pageAtion:{
                    pageTotal:0,
                    paginationPage:1
                }, 
                pageAtionNext:{
                    pageTotal:0,
                    paginationPage:1
                }, 
                pageNo:1,
                pageSize:10,   
                pageNoDetail:1,      
                pageSizeDetail:10,     
                activeIndex:1,
                tabsArr:[
                    {
                        name:'注册用户详情'
                    },
                    {
                        name:'访问用户详情'
                    },
                    {
                        name:'活动课程详情'
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
                            name:'新年福包活动',
                            pathInfo:'/activityStatistics/springFestival/index'
                        },
                        {
                            name:'数据详情',
                            pathInfo:'' 
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
                input:'',
                typeId:'',
                isLastPage:false,
                selectData:'',
                selectType:'',
                scrollType:false
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
            //礼金
            dialogType(data,type){
                this.isLastPage=false;  
                this.selectData = data;
                this.selectType = type;
                this.pageNoDetail=1;
                this.tableDataDetailOne=[];
                this.tableDataDetailTwo=[];
                this.tableDataDetailThree=[];                
                switch (type) {
                    case 1:
                        this.editDialogVisible1 = true;
                        this.actionDetailIsInfo(data,1);
                        break;
                    case 2:
                        this.editDialogVisible2 = true;
                        this.actionDetailIsInfo(data,2);
                        break;
                    case 3:
                        this.editDialogVisible3 = true;
                        this.actionCourseDetailIs(1);
                        break;
                    default:
                        break;
                }
            },
            detailSelect(){
                this.actionCourseDetailIs(1);
            },
            childPageValue(num){
                if(Number(num)>0){
                    this.getTableList(Number(num))
                }                
            },  
            childPageValueNext(num){
                if(Number(num)>0){
                    this.actionCourseDetailIs(Number(num))
                }                 
            }, 
            actionCourseDetailIs(nums){
                var self = this;
                if(nums){
                    self.pageNoNext = nums;
                }
                let query = {
                    params:{
                        pageNo:self.pageNoNext,
                        pageSize:self.pageSizeDetail,
                        cellphone:self.input
                    }                  
                };
                self.$http.get(this.$server.getFuBaoCourseDetail+self.selectData.courseId,query).then(res=>{
                    if(res.status==200){
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
                        self.tableDataDetailThree = listIds;
                        self.pageAtionNext.pageTotal = contentdate.total;
                        self.pageAtionNext.paginationPage =self.pageNoNext;
                    }
                })                        
            },
            actionDetailIsInfo(data,type){
                let self = this;
                this.scrollType=false;
                let query = {
                    params:{
                        pageNo:self.pageNoDetail,
                        pageSize:self.pageSizeDetail  
                    }                  
                };
                let url = '';
                switch (type) {
                    case 1:
                        url=this.$server.getFuBaoAwardWinningRecordList+data.userId
                        break;
                    case 2:
                        url=this.$server.getFuBaoOurGoldList+data.userId
                        break;
                    default:
                        break;
                }
                this.$http.get(url,query).then(res=>{
                    if(res.status==200){
                        if(type==1){
                            if(!self.isLastPage){
                                self.tableDataDetailOne = [...this.tableDataDetailOne,...res.content.list];
                                self.isLastPage = res.content.isLastPage;
                            }
                            // if(res.content.isLastPage){
                            //     self.$refs.editDialogBoxOne.removeEventListener("scroll",self.scrollEvent('editDialogBoxOne',data,type))
                            // }else{
                            //     self.$nextTick(()=>{
                            //         self.$refs.editDialogBoxOne.addEventListener("scroll",self.scrollEvent('editDialogBoxOne',data,type))
                            //     })
                            // }                            
                        }else if(type==2){
                            if(!self.isLastPage){
                                self.tableDataDetailTwo = [...this.tableDataDetailTwo,...res.content.list];
                                self.isLastPage = res.content.isLastPage;
                            }
                            // if(res.content.isLastPage){
                            //     self.$refs.editDialogBoxTwo.removeEventListener("scroll",self.scrollEvent('editDialogBoxTwo',data,type))
                            // }else{
                            //     self.$nextTick(()=>{
                            //         self.$refs.editDialogBoxTwo.addEventListener("scroll",self.scrollEvent('editDialogBoxTwo',data,type))
                            //     })
                            // }                            
                        }
                        this.scrollType = true;
                    }
                })
            },     
            tabsEven(num){
                this.beginAt='';
                this.endAt='';
                this.beginAtNext='';
                this.endAtNext='';                    
                this.inputInfo='';
                this.activeIndex=num+1;
                this.provinceId='';
                this.cityId='';
                this.getTableList(1);
            },
            scrollEventww(){
                let self = this;  
                if(self.scrollType){
                    this.scrollEvent(self.selectData, this.selectType);
                }  
            },

        /**
         * 滚动分页
         */
        scrollEvent(data,type){
            let name = '';
            if(type==1){
                name='editDialogBoxOne';
            }else{
                name='editDialogBoxTwo';
            }
            let scrollDistance = this.$refs[name].scrollHeight - this.$refs[name].scrollTop - this.$refs[name].clientHeight
            let sign = 50;
            if (scrollDistance <= sign&&!this.isLastPage) {
                // this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent(data,type))
                this.pageNoDetail++;
                this.actionDetailIsInfo(data,type);
            }
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
                    var url = self.$server.gwtFuBaouserDetailList+"?channelType="+parems.channelType+"&cellphone="+parems.cellphone+"&beginAt="+parems.beginAt+"&endAt="+parems.endAt+"&provinceId="+parems.provinceId+"&cityId="+parems.cityId+"&token="+getToken();  
                }else if(self.activeIndex==2){
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
                    var url = self.$server.getFuBaoOrderDetailList+"?channelType="+parems.channelType+"&tellphone="+parems.cellphone+"&regBeginAt="+parems.beginAt+"&regEndAt="+parems.endAt+"&visitBeginAt="+parems.beginAtNext+"&visitEndAt="+parems.endAtNext+"&provinceId="+parems.provinceId+"&cityId="+parems.cityId+"&token="+getToken();            
                }else{
                    parems = {
                        channelType:self.typeId,
                        cellphone:self.inputInfo                
                    };
                    var url = self.$server.nYuserVisitDetail+"?channelType="+parems.channelType+"&tellphone="+parems.cellphone+"&token="+getToken();                       
                }   
                window.open(url);                   
            }, 
            exportDteailis(){
                let parems = {
                    title:this.input         
                };
                var url = this.$server.exportFuBaoButtonListAll+ this.selectData.courseId+"?cellphone="+parems.title+"&token="+getToken();       
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
                    url = this.$server.getFuBaoUserDetailByChannel;
                }else if(self.activeIndex==2){
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
                            pageSize:self.pageSize
                        }
                    }  
                    url = this.$server.getFuBaoUserVisitDetail;                  
                }else{
                    query = {
                        params:{
                            title:self.inputInfo,
                            pageNo:self.pageNo,
                            pageSize:self.pageSize
                        }
                    }  
                    url = this.$server.getFuBaoCourseDetailList;                  
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
    .user-springFestival-page{
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
        .edit-dialog{
            .editDialogBox{
                overflow: auto;
                max-height: 400px;
                >div{
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row;
                    align-items: center;
                    border-bottom: 1px solid #ccc;
                    margin-bottom: 15px;
                    padding: 15px 0;
                }
            }
        }
        .edit-dialog1{
            .editDialogBox{
                overflow: auto;
                max-height: 400px;
                >div{
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row;
                    align-items: center;
                    border-bottom: 1px solid #ccc;
                    margin-bottom: 15px;
                    padding: 15px 0;
                }            
            }
        }
        .edit-dialog2{
            .details{
                .headers{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    .header_one{
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;                        
                    }
                }
            }
            .blocks{
                text-align: center;
                padding: 40px 0 40px 0;
                background: #fff; 
            }
        }
        
    }   
.actions{
    background: #9E0E00 !important;
    color: #fff !important;
}

</style>
