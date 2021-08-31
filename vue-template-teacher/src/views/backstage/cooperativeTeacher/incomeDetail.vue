<template>
    <div class="teacher-income-page">
        <breadcrumb :menuList ='titleList' class="lMarginBO20"></breadcrumb>
        <Tabs :tabIndex="1" v-on:tabsChange="tabsChangeOne"></Tabs>
        <p class="balance-data">当前总收益:{{totalRevenue||0}}元</p>
        <div class="echarts-area">
            <div class="echarts-header">
                <div class="clearfix">
                    <div class="options left">
                        <span>日期范围</span>
                        <el-date-picker
                            v-model="start"
                            type="date"
                            class="my-date"
                            :picker-options="pickerOptions0"
                            @change="(value) => dateChangeEndTime(value, 1)"
                            placeholder="选择日期">
                        </el-date-picker>
                        <span>至</span>
                        <el-date-picker
                            v-model="end"
                            type="date"
                            class="my-date"
                            :picker-options="pickerOptions0"
                            @change="(value) => dateChangeEndTime(value, 2)"
                            placeholder="选择日期">
                        </el-date-picker>
                        <span class="date-btn" @click="designatedDateFun(7)">最近7天</span>
                        <span class="date-btn" @click="designatedDateFun(30)">最近30天</span>
                    </div>
                    <div class="btns right">
                        <el-button type="danger" 
                                   class="redBackColor butColorF" @click="courseStates">查询</el-button>
                        <el-button type="danger"
                                   class="redBackColor butColorF" @click="exportInfo">导出</el-button>
                    </div>
                </div>
                <p class="count">{{startObj}}至{{endObj}}，您的分成总收入为{{generalIncome||0}}元</p>
            </div>
            <div class="echarts-body">
                <div id="my-chart" style="width: 100%;height:400px;margin:auto"></div>
            </div>
        </div>
        <div class="page-content">
            <el-table :data="tableData"
                      border
                      v-loading="loading"
                      header-cell-class-name="list-header-layout-bg"
                      style="width: 100%">
                <el-table-column
                    prop="incomeDateStr"
                    label="日期"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="orderNum"
                    label="订单数"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="orderMoney"
                    align="center"
                    label="订单金额（元）">
                </el-table-column>
                <el-table-column
                    prop="incomeMoney"
                    align="center"
                    label="分成收入（元）">
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="childPageValue"
                    :total="pageAtion.pageTotal">
                </el-pagination>
            </div>            
        </div>
    </div>
</template>
<script type="application/ecmascript">
import Tabs from './components/Tabs.vue'
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import echarts from 'echarts'
import 'echarts/lib/chart/line'

export default{
    data(){
        return {
            start:'',
            end:'',
            tableData:[],
            pageData: {},
            loading:true,
            startObj:'',
            endObj:'',
            generalIncome:0,
            dataTimeList:[],
            flags:[],
            id:"",
            totalRevenue:0,
            pageAtion:{},
            pageNo:1,
            pageSize:10,
            pickerOptions0: {
                disabledDate(time) {
                    let curDate = (new Date()).getTime();
                    let three = 180 * 24 * 3600 * 1000;
                    let threeMonths = curDate - three;
                    return time.getTime() > Date.now() || time.getTime() < threeMonths;;
                }
            },
            titleList:[
                    {
                        name:'APP管理系统',
                        pathInfo:''
                    },
                    {
                        name:'创建合作老师账户',
                        pathInfo:'/backstage/cooperativeTeacher'
                    },
                    {
                        name:'详情',
                        pathInfo:''
                    }                                                
                ]            
        }
    },
    components:{Tabs,breadcrumb},
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        this.flags = this.$getPermissions(routes,currentPath);
        if(!this.flags){
            this.flags = [];
        }                 
        this.getDetails();
    },
    methods:{
        getDetails(){
            var self = this;
            let query = JSON.parse(JSON.stringify(this.$route.query));
            var data2 = JSON.parse(sessionStorage.getItem('storageQuery'));
            if(!data2||sessionStorage.getItem('storageQuery')!==JSON.stringify(query)){
                sessionStorage.setItem('storageQuery', JSON.stringify(query));
            };   
            var data1 = JSON.parse(sessionStorage.getItem('storageQuery'));
            let params = {
                pageNo:Number(data1.pageNo)||self.pageNo,
                pageSize:Number(data1.pageSize)||self.pageSize,
                startDateStr:this.formatDate(Number(data1.startDateStr)),
                endDateStr:this.formatDate(Number(new Date())),               
                id:data1.id
            };             
            //时间组件回填；
            this.start = new Date(Number(data1.startDateStr));
            this.end = new Date();
            this.id = Number(data1.id);
            this.totalRevenue = Number(data1.totalRevenue)||Number(query.totalRevenue);
            //日期时间绑定
            this.startObj=this.formatDate(Number(data1.startDateStr)),
            this.endObj=this.formatDate(Number(new Date())),
            //接口访问
            self.ajaxdataList(params); 
        },
        //分页子组件传递给父组件的方法
        childPageValue(pageNum){
            var self = this;           
            //后期做接口字段过滤；
            var params={
                pageSize:self.pageSize,
                pageNo: Number(pageNum)>0?pageNum:1,
                startDateStr:this.formatDate(Number(self.start)),
                endDateStr:this.formatDate(Number(self.end)),
                id:self.id  
            } 
            self.ajaxdataList(params);
        }, 
        //日期变化触发；
        dateChangeEndTime(value, nums){
            switch (nums) {
                case 1:
                    this.startObj=this.formatDate(Number(value));
                    break;
                case 2:
                    this.endObj=this.formatDate(Number(value));
                    break;            
                default:
                    console.log("错误");
                    break;
            }
        },
        ajaxdataList(params){
            var self = this;
            self.loading = true;
            this.$http.get(this.$server.teacherCooperatIncome(params)).then(res=>{
                if(res.status==200){
                    self.loading = false;
                    var contents = res.content;
                    var incomeInfoVos = contents.incomeDetailInfoVos;
                    var incomeDetail = contents.incomeDetailInfoVoPageInfo;
                    self.generalIncome = contents.rangeTotalMoney;
                    self.echartList(incomeInfoVos);
                    self.eChartNumberToMoney(self.dataTimeList);   
                    // self.tableData = contents.incomeDetailInfoVoPageInfo.list;                
                    //列表数据绑定
                    self.tableData = incomeDetail.list;//incomeDetailInfoVoPageInfo
                    self.pageAtion["pageNum"] = incomeDetail.pageNum||incomeDetail.currentPage;//当前页;
                    self.pageAtion['pageTotal'] = incomeDetail.total || incomeDetail.totalNum; //总的数量
                    self.pageAtion['pageSize'] = incomeDetail.pageSize //设定的每页的数量 
                    if(self.pageAtion.pageTotal>self.pageSize){
                        self.pageAtion['pageBool'] = false;
                    }else{
                        self.pageAtion['pageBool'] = true;
                    }                                       
                }else{
                    self.loading = false;
                 self.pageAtion['pageBool'] = true;  
                 console.log(e);                    
                }                
            })
        },       
        //获取组装EChaets值；
        echartList(data){   
            var self = this;
            var locals = 0;
            self.dataTimeList = data.map(function(element){
                locals = Number(locals)+Number(element.incomeMoney);
                return [self.stringToNumber(element.incomeDateStr),locals]
                // return [self.stringToNumber(element.incomeDateStr),Number(element.incomeMoney)]
            });
            // console.log(self.dataTimeList);
        },
        stringToNumber(dates){
            //字符串转时间戳
            var date = dates;
            date = date.substring(0,19);    
            date = date.replace(/-/g,'/'); 
            return new Date(date).getTime();
        },
        designatedDateFun(num){
            //时间组件显示时间;
            var self = this;
            self.loading = true;
            self.tableData =[];
            self.dataTimeList =[];
            self.start = new Date(self.designatedDate(num));
            self.end = new Date();           
            //访问接口时间参数;
            self.startObj=self.formatDate(self.designatedDate(num)),
            self.endObj=self.formatDate(Number(new Date()));  
            let params = {
                pageNo:1,
                pageSize:10,
                startDateStr:self.startObj,
                endDateStr:self.endObj,               
                id:self.id
            }     
            self.ajaxdataList(params);             
        },
        designatedDate(num){
                var startTime = Number(new Date());
                var yesTime =startTime-(new Date(new Date().toLocaleDateString() + ' 00:00:00').getTime());
                var endTime = startTime-86400000*num-yesTime;   
                return endTime;         
        },
        formatDate(date){
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
                    // h = h<10?("0"+h):h;
                    // m1 = m1<10?("0"+m1):m1;   
                    // s = s<10?("0"+s):s;      
                    // return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
                    return y+"-"+m+"-"+d;
                }else{
                    return '';
                }
            },
        //查询
        courseStates(){
                var self = this;
                self.loading = false;
                self.tableData =[];
                self.dataTimeList =[];                
                let params = {
                    pageNo:1,
                    pageSize:10,
                    startDateStr:this.formatDate(Number(self.start))||'',
                    endDateStr:this.formatDate(Number(self.end))||'',               
                    id:self.id
                }   
                this.ajaxdataList(params);                      
        },
        exportInfo(){
            var self = this;
            var url = self.$server.teacherExportSurvey(self.id)+"/?startDateStr="+self.formatDate(Number(self.start))+"&endDateStr="+self.formatDate(Number(self.end))+"&token="+getToken();
            console.log("url",url);       
            window.open(url);          
        },             
        tabsChangeOne(a){
                let query ={
                    id:this.id,
                    pageNo:1,
                    pageSize:10,
                    courseType:'',
                    courseId:'',
                    totalRevenue:this.totalRevenue
                };
                this.$router.push({
                    path: "/backstage/cooperativeTeacher/saleDetail",
                    query
                })
        },
        //EChart图渲染;
        eChartNumberToMoney(dataList){
            var self = this;
            var myChart = echarts.init(document.getElementById('my-chart'));
            myChart.setOption({     
                tooltip:{
                    trigger:'item' // 然后eCharts3有默认的格式的。
                },                        
                title: { text: '总收入(元)' },
                color:['red'],
                legend: {
                    data:[
                        {name: '总收入', icon: 'line',},
                    ],
                    // bottom:'0'
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    // data: ['2018/5/1', '2018/5/2', '2018/5/3', '2018/5/4', '2018/5/5', '2018/5/6', '2018/5/7']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'总收入',
                        data:dataList,
                        type: 'line',
                        smooth: false,
                        itemStyle : {
                            normal : {
                                lineStyle:{
                                    color:'red'
                                },
                                // label : {show: true}
                            }
                        },
                    }
                ]
            });
        }        
    },
    watch:{},
    mounted(){
    }
}
</script>
<style lang="scss">
@import "../../../components/formSynthesisPlugin/my-component.css";
    .left{
        float: left;
    }
    .right{
        float: right;
    }
    .teacher-income-page{
        .page-content{
            background: #fff;
            .block{
                text-align: center;
                margin-top: 20px;
            }
        }
        .breadcrumb{
            margin-bottom:20px;
        }
        .balance-data{
            line-height: 50px;
            // background: #FFC0C3;
            color:#B4272D;
            font-size: 18px;
            padding-left: 30px;
            margin:20px 0;
        }
        .echarts-area{
            .echarts-body{
                margin-top: 20px;
            }
            .echarts-header{
                .count{
                    color:#B4272D;
                    margin-top: 20px;
                }
                .date-btn{
                    cursor: pointer;
                    color:#F86B1D;
                    margin-left: 15px;
                }
            }
        }
    }

</style>
