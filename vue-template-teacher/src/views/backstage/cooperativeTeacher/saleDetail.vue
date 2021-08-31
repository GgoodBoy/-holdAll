<template>
    <div class="teacher-sale-page">
        <div class="breadcrumb">
            <h2 class="crumbs-list-common">
                创建合作老师账户 / 详情
            </h2>
        </div>
        <Tabs :tabIndex="2" v-on:tabsChange="tabsChangeTwo"></Tabs>
        <div class="count-data">
            <el-row>
                <el-col :span="6" v-for="(item,index) in countData" :key="index">
                    <div class="count-data-item">
                        <p class="label">{{item.label}}</p>
                        <p class="value">{{item.value}}</p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="echarts-area">
            <div class="echarts-header">
                <div class="clearfix">
                    <div class="options left">
                        <span>课程类型 : </span>
                        <el-select v-model="valueStyle" placeholder="请选择">
                            <el-option
                            v-for="item in optionsStates"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>   
                        <span style="margin-left:40px">日期范围</span>                     
                        <el-date-picker
                            v-model="startStyle"
                            type="date"
                            class="my-date"
                            :picker-options="pickerOptions0"
                            placeholder="选择日期">
                        </el-date-picker>
                        <span>至</span>
                        <el-date-picker
                            v-model="endStyle"
                            type="date"
                            class="my-date"
                            :picker-options="pickerOptions0"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div class="btns right">
                        <el-button class="redBackColor butColorF" @click="courseStates(1)">查询</el-button>
                        <!-- <el-button type="danger"
                                   class="red-btn">导出</el-button> -->
                    </div>
                </div>
            </div>
            <div class="echarts-body" v-loading="loading">
                <div id="my-chart1" class="my-chart"></div>
            </div>          
        </div>
        <div class="echarts-area">
            <div class="echarts-header">
                <div class="clearfix">
                    <div class="options left">
                        <span>课程名称 : </span>
                        <el-select v-model="valueName" placeholder="请选择">
                            <el-option
                            v-for="item in optionsName"
                            :key="item.value"
                            :label="item.title"
                            :value="item.id">
                            </el-option>
                        </el-select>
                        <span style="margin-left:40px">日期范围</span>                          
                        <el-date-picker
                            v-model="startName"
                            type="date"
                            class="my-date"
                            :picker-options="pickerOptions0"
                            placeholder="选择日期">
                        </el-date-picker>
                        <span>至</span>
                        <el-date-picker
                            v-model="endName"
                            type="date"
                            class="my-date"
                            :picker-options="pickerOptions0"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div class="btns right">
                        <el-button class="redBackColor butColorF" @click="courseStates(2)">查询</el-button>
                    </div>
                </div>
            </div>
            <div class="echarts-body" v-loading="loading1">
                <div id="my-chart2"  class="my-chart"></div>
            </div>            
        </div>        
        <div class="page-content">
            <div class="echarts-header">
                <div class="clearfix">
                    <div class="options left">
                        <span>课程名称 : </span>
                        <el-select v-model="valueTabName" placeholder="请选择">
                            <el-option
                            v-for="item in optionsTabName"
                            :key="item.value"
                            :label="item.title"
                            :value="item.id">
                            </el-option>
                        </el-select>   
                    </div>
                    <div class="btns right">
                        <el-button class="redBackColor butColorF" 
                                   @click="courseStates(3)">查询</el-button>
                        <el-button 
                                    class="redBackColor butColorF" @click="exportInfo">导出</el-button>                                   
                    </div>
                </div>
            </div>            
            <el-table :data="tableData"
                      border
                      v-loading="loading2"
                      header-cell-class-name="list-header-layout-bg"
                      style="width: 100%">
                <el-table-column
                    prop="incomeDateStr"
                    label="日期"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="courseTypeName"
                    label="类型"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="courseName"
                    align="center"
                    label="课程名称">
                </el-table-column>
                <el-table-column
                    prop="orderNum"
                    align="center"
                    label="销售数量">
                </el-table-column>
                <el-table-column
                    prop="orderMoney"
                    align="center"
                    label="销售金额（元）">
                </el-table-column>                
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="childPageValue"
                    :page-size="pageAtion.pageSize"
                    :total="pageAtion.pageTotal">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script type="application/ecmascript">
    import Tabs from './components/Tabs.vue'
    import { getToken,setToken,removeToken} from '@/utils/auth';
    import echarts from 'echarts'
    import 'echarts/lib/chart/line'

    export default{
        data(){
            return {
                countData:[
                    {label:'昨日销售数量',value:'0'},
                    {label:'昨日销售金额（元）',value:'0'},
                    {label:'累计销售数量',value:'0'},
                    {label:'累计销售金额（元）',value:'0'}
                ],
                //时间字段
                startStyle:'',
                endStyle:'',
                startName:'',
                endName:'',
                totalRevenue:0,
                flags:[],
                tableData:[
                    {date:'2018-01-01',orderNum:'100',orderMoney:'10000',income:'500'}
                ],
                pageData: {},
                pageAtion:{
                    pageTotal:0,
                    pageSize:10,
                },
                loading:true,
                loading1:true,
                loading2:true,
                echartDatelistOne:[],
                echartDatelistTwo:[],
                //下拉列表课程类型
                optionsStates: [{
                        value: "",
                        label: '全部'
                        },{
                        value: 1,
                        label: '视频'
                        }, {
                        value: 2,
                        label: '音频'
                        }],
                value: '',
                //下拉列表课程名称
                optionsTabName:[{title:"全部",id:''}],
                optionsName:[{title:"全部",id:''}],

                valueStyle: '',
                valueName: '',
                valueTabName:'',
                id:'',//合作老师id 
                pickerOptions0: {
                    disabledDate(time) {
                        let curDate = (new Date()).getTime();
                        let three = 180 * 24 * 3600 * 1000;
                        let threeMonths = curDate - three;
                        return time.getTime() > Date.now() || time.getTime() < threeMonths;;
                    }
                }             
            }
        },
        created(){
            let routes = this.$router.options.routes;
            let currentPath = this.$route.path
            this.flags = this.$getPermissions(routes,currentPath);
            if(!this.flags){
                this.flags = [];
            }                        
            this.getDetails();
        },        
        components:{Tabs},
        methods:{
            tabsChangeTwo(a){
                var num = 6;
                var startTime = Number(new Date());
                var yesTime =startTime-(new Date(new Date().toLocaleDateString() + ' 00:00:00').getTime());
                var endTime = startTime-86400000*num-yesTime;                
                let query = {
                    pageNo:1,
                    pageSize:10,
                    startDateStr:endTime,
                    endDateStr:'',
                    id:this.id,
                    totalRevenue:this.totalRevenue
                };
                this.$router.push({
                    path: "/backstage/cooperativeTeacher/incomeDetail",
                    query
                })
            },
            getDetails(){
                var self = this;
                let query = JSON.parse(JSON.stringify(this.$route.query));
                let params = {            
                    id:query.id,
                    courseType:query.courseType||'',
                    courseId:query.courseId||''                   
                };
                this.totalRevenue = query.totalRevenue;
                self.id = query.id;
                //teacherSellPageInfo
                this.$http.get(this.$server.teacherSellPageInfo(query.id)+"?pageNo="+(query.pageNo||"")+"&pageSize="+(query.pageSize||"")+"&courseType="+(query.courseType||"")+"&courseId="+(query.courseId||"")).then(res=>{       
                    if(res.status==200){
                        self.loading=false;
                        self.loading1=false;
                        self.loading2=false;
                        var contents = res.content;
                        self.generalIncome = contents.rangeTotalMoney;
                        var incomeDetail = contents.incomeDetailInfoVoPageInfo;
                        self.countData=[
                                {label:'昨日销售数量',value:contents.ysellNum},
                                {label:'昨日销售金额（元）',value:contents.ysellMoney},
                                {label:'累计销售数量',value:contents.tsellNum},
                                {label:'累计销售金额（元）',value:contents.tsellMoney}
                            ],
                        self.echartList(contents.incomeDetailInfoVos,"one");
                        self.echartList(contents.incomeDetailInfoVos,"two");
                        self.eChartNumberToMoney('my-chart1',self.echartDatelistOne); 
                        self.eChartNumberToMoney('my-chart2',self.echartDatelistTwo);  
                        self.tableData = contents.incomeDetailInfoVoPageInfo.list;
                        self.pageAtion["pageNum"] = incomeDetail.pageNum||incomeDetail.currentPage;//当前页;
                        self.pageAtion['pageTotal'] = incomeDetail.total || incomeDetail.totalNum; //总的数量
                        self.pageAtion['pageSize'] = incomeDetail.pageSize //设定的每页的数量                         
                    }else{
                        self.loading=false;
                        self.loading1=false;
                        self.loading2=false;
                    }
                })
                .catch((e) => {
                    console.log(e);
                })
                this.getCourseName();                            
            },
        //分页子组件传递给父组件的方法
        childPageValue(pageNum){
            var self = this;           
                //后期做接口字段过滤；
                var parems = {
                    pageNo:Number(pageNum)>0?pageNum:1,
                    pageSize:10,
                    id:self.id,
                    courseId:self.valueTabName
                }
                this.courseTableMethod(parems);
            },             
            //查询
            courseStates(num){
                var self = this;
                var parems = {};
                switch (num) {
                    case 1:
                        parems = {
                           courseType:self.valueStyle,
                           startDateStr:self.formatDate(Number(self.startStyle))||'',
                           endDateStr:self.formatDate(Number(self.endStyle))||'',
                           id:self.id,
                           courseId:''
                        }
                        this.courseStatesMethod(parems,num);
                        break;
                    case 2:
                        parems = {
                           courseType:'',
                           startDateStr:self.formatDate(Number(self.startName))||'',
                           endDateStr:self.formatDate(Number(self.endName))||'',
                           id:self.id,
                           courseId:self.valueName
                        }  
                        this.courseStatesMethod(parems,num);                 
                        break;
                    case 3:
                        parems = {
                           pageNo:1,
                           pageSize:10,
                           id:self.id,
                           courseId:self.valueTabName
                        } 
                        this.tableData = [];
                        this.loading2 = true;       
                        this.courseTableMethod(parems);
                        break; 
                    default:
                        console.log("出错了");
                        break;
                }

            },
            courseTableMethod(parems){
                var self = this;
                self.$http.get(self.$server.teacherCoursesalesQuery(parems)).then(res=>{ 
                    if(res.status==200){
                                var contents = res.content;
                                self.tableData = contents.list;  
                                self.pageAtion["pageNum"] = contents.pageNum||contents.currentPage;//当前页;
                                self.pageAtion['pageTotal'] = contents.total || contents.totalNum; //总的数量
                                self.pageAtion['pageSize'] = contents.pageSize //设定的每页的数量                                                                
                                self.$nextTick(function(){
                                    self.loading2 = false; 
                                })                         
                    }
                })
            },
            courseStatesMethod(parems,num){
                var self = this;
                self.$http.get(self.$server.teacherCourseChoose(parems)).then(res=>{ 
                    if(res.status==200){
                        var contents = res.content;
                        switch (num) {
                            case 1:
                                self.loading = false;
                                self.echartList(contents,"one");
                                self.eChartNumberToMoney('my-chart1',self.echartDatelistOne);
                                break;
                            case 2:
                                self.loading1 = false;
                                self.echartList(contents,"two");
                                self.eChartNumberToMoney('my-chart2',self.echartDatelistTwo);                                
                                break;                                                       
                            default:
                                console.log("错误");
                                break;
                        }
                    }
                }).catch((e) => {
                    console.log(e);
                }) 
            },
            //获取课程名称列表；
            getCourseName(){
                var self = this;
                self.$http.get(self.$server.teachercCourseName(self.id)).then(res=>{ 
                    if(res.status==200){
                        self.optionsTabName=self.optionsTabName.concat(res.content);
                        self.optionsName=self.optionsName.concat(res.content);
                    }
                }).catch((e) => {
                    console.log(e);
                }) 
            },
            //获取组装EChaets值；
            echartList(data,states){   
                var self = this;
                var locals = 0;
                if(states=="one"){
                    if(data){
                        self.echartDatelistOne = data.map(function(element){
                            locals = Number(locals)+Number(element.incomeMoney);
                            // return [self.stringToNumber(element.incomeDateStr),Number(element.incomeMoney)]
                            return [self.stringToNumber(element.incomeDateStr),locals]
                        }); 
                    }else{
                        self.echartDatelistOne=[];
                    }

                }else{
                    if(data){
                        self.echartDatelistTwo = data.map(function(element){
                            locals = Number(locals)+Number(element.incomeMoney);
                            return [self.stringToNumber(element.incomeDateStr),locals]
                        });
                    }else{
                        self.echartDatelistTwo =[];
                    }
                    
                }
                console.log(self.echartDatelistOne);
                console.log(self.echartDatelistTwo);
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
            stringToNumber(dates){
                //字符串转时间戳
                var date = dates;
                date = date.substring(0,19);    
                date = date.replace(/-/g,'/'); 
                return new Date(date).getTime();
            },    
            exportInfo(){
                var self = this;                    
                var url = self.$server.teacherExportIncom(self.id)+"/?courseId="+self.valueTabName+"&token="+getToken();  
                console.log(url);     
                window.open(url);          
            },        
            eChartNumberToMoney(elementId,datelist){
                var myChart = echarts.init(document.getElementById(elementId));
                myChart.setOption({
                    tooltip:{
                        trigger:'item' // 然后eCharts3有默认的格式的。
                    },                    
                    title: { text: '总收入(元)' },
                    // color:['green','red','blue','yellow','black'],
                    color:['red'],
                    legend: {
                        data:[
                            {name: '总收入', icon: 'line',},
                        ],
                        // bottom:'0'
                    },
                    xAxis: {
                        // type: 'category',
                        // boundaryGap: false,
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
                            data: datelist,
                            type: 'line',
                            smooth: false,
                            itemStyle : {
                                normal : {
                                    lineStyle:{
                                        color:'red'
                                    }
                                    //, label : {show: true}
                                }
                            },
                        }
                    ]
                });                
            }            
        },
        mounted(){}
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
    .teacher-sale-page{
        .page-content{
            background: #FFF;
            .echarts-header{
                padding: 15px 10px;
            }
            .block{
                text-align: center;
                margin-top: 20px;
            }            
        }
        .breadcrumb{
            margin-bottom:20px;
        }
        .count-data .el-col:last-child .count-data-item{
            &::after{
                display:none;
             }
        }
        .count-data{
            background: #fff;
            margin-top:20px;
            .count-data-item{
                text-align: center;
                padding:60px 0;
                position:relative;
                &::after{
                    content: '';
                    display: block;
                    height: 45px;
                    width: 1px;
                    background: #EFF3F8;
                    position: absolute;
                    top:50%;
                    margin-top: -22.5px;
                    right: 0;
                 }
                .label{
                    line-height: 25px;
                    font-size: 16px;
                }
                .value{
                    font-size: 40px;
                    margin-top:30px;
                }
            }
        }
        .echarts-area{
            background: #fff;
            padding:20px 30px;
            margin:20px 0;
            .echarts-header{
            .options{
                span{

                }
                .my-date{
                    width: 140px;
                    margin:0 12px;
                }
                .date-btn{
                    line-height: 40px;
                    color:#F73B42;
                    margin-right: 10px;
                    font-size: 14px;
                    cursor: pointer;
                }
                }
                .count{
                    color:#F73B42;
                    font-size: 14px;
                    margin:10px 0 0 62px
                }
                }
                .echarts-body{
                    margin:15px 0 0 62px;
                .my-chart{
                    width: 100%;
                    height: 330px;
                    margin:auto;
                }
            }
        }
    }

</style>
