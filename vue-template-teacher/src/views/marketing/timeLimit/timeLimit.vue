<template>
    <div>
        <div class="timeTwoPageBut" v-if="$authJudge('market:limited:appsecond')">
            <div class="timeTwoBut cursorCss" @click="switchSecondEven">设置App二级页面手动列表</div>
        </div>
        <gxHead :modelType="'timeLimit'" :headObj='headObj' :lietTimeName="headObj.typeBoll" :messages="headObj.title" :listVal="headObj.listType" v-on:dialogChange="dialogChanges" v-on:inputValPortEven="inputStateVal"></gxHead>
        <!-- <gxTable :tableDatas="tableObj" v-on:pathRouterPage="Routerpage"></gxTable> -->
       <div>
            <el-table
                :data="tableObj.tableData"
                border
                header-cell-class-name="list-header-layout-bg"
                v-loading="tableObj.loading"
                :header-cell-style="tableHeaderColor"
                max-height="600"
                style="width: 100%">               
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        :show-overflow-tooltip='true'
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="courseTitle"
                        label="名称"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="validTime"
                        label="限时时间"
                        :show-overflow-tooltip='true'
                        align="center"
                        min-width="220">
                    </el-table-column>               
                    <el-table-column
                        prop="type"
                        label="方式"
                        align="center"
                        :show-overflow-tooltip='true'
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="discount"
                        label="折扣"
                        align="center"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="mtype"
                        label="类型"
                        align="center"
                        min-width="220">
                    </el-table-column>                
                    <el-table-column
                        prop="seckillPrice"
                        label="价格"
                        align="center"
                        :show-overflow-tooltip='true'
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="sellStatus"
                        label="折扣"
                        align="center"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                    v-if="tableObj.markState==true"
                    label="操作"
                    align="center"
                    :min-width="tableObj.minWidth"
                    fixed="right"
                    >  
                        <template slot-scope="scope">
                            <div>
                                    <el-button v-if="scope.row.status1===0&&((item1.type==3&&$authJudge('market:limited:up'))||(item1.type==4&&$authJudge('market:limited:del')))"  
                                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in tableObj.marksArrs" :key="i">{{item1.name}}</el-button>
                                    <el-button v-if="scope.row.status1===1&&(item1.type==2&&$authJudge('market:limited:down'))" 
                                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in tableObj.marksArrs" :key="i">{{item1.name}}</el-button> 
                            </div>                                                                                 
                        </template> 
                    </el-table-column>                              
            </el-table>                
        </div>                 
        <gxPaginaton :pageAtions ="pageAtion" v-on:childByPageValue="childPageValue"></gxPaginaton>
        <Dialog 
                :showFlag.sync="dialgObj.cancel.showFlag" 
                :title="dialgObj.cancel.title"
                :cancelName="dialgObj.cancel.cancelName"
                :sureName="dialgObj.cancel.sureName"
                v-on:cancelNo="timeLimitCancelNo" 
                v-on:cancelOk="timeLimitCancelOk">
                <el-row slot="dialog-body" class="lLine30">
                    <el-col class="lCenter-r">是否要下架这个限时活动</el-col>
                </el-row>
        </Dialog>
        <Dialog 
                :showFlag.sync="dialgObj.deleteCourse.showFlag" 
                :title="dialgObj.deleteCourse.title"
                :cancelName="dialgObj.deleteCourse.cancelName"
                :sureName="dialgObj.deleteCourse.sureName"
                v-on:deletcNo="timeLimitDeleteNo" 
                v-on:deletcOk="timeLimitDeleteOk">
                <el-row slot="dialog-body" class="lLine30">
                    <el-col class="lCenter-r">是否要删除这个限时活动</el-col>
                </el-row>
        </Dialog>
        <Dialog 
                :showFlag.sync="dialgObj.sortCourse.showFlag" 
                :title="dialgObj.sortCourse.title"
                :cancelName="dialgObj.sortCourse.cancelName"
                :sureName="dialgObj.sortCourse.sureName"
                v-on:sortNo="timeLimitsortNo" 
                v-on:sortOk="timeLimitsortOk">
                <el-row slot="dialog-body" type="flex" class="lLine40" justify="center">
                    <el-col :span="3">移动到第</el-col>
                    <el-col :span="6"><el-input v-model="sortNumber" placeholder="请填写名称"></el-input></el-col>
                    <el-col :span="1" :offset="1">位</el-col>
                </el-row>                
        </Dialog> 
        <el-dialog title="温馨提示" :visible.sync="dialogTableVisible" width="30%">
            <el-row class="lLine40">
                <el-col class="lCenter-r"><i class="el-icon-error redFontColor" style="font-size: 46px;"></i></el-col>
            </el-row>
            <el-row class="lLine40">
                <el-col class="lCenter-r">限时购结束时间小于当前上架时间24小时 ，不能上架</el-col> 
            </el-row>
        </el-dialog> 
        <el-dialog
            title="选择标签类型"
            :visible.sync="timeTypeDetail"
            width="20%"
            class="lCenter-r">
                <el-button type="primary" @click="timeTypeDetailEven(1)">成人限时购</el-button>
                <el-button type="primary" @click="timeTypeDetailEven(2)">少儿限时购</el-button>
        </el-dialog>   
        <el-dialog
            title=""
            :visible.sync="timeLimitCourseDetail"
            :close-on-click-modal="false"
            width="30%"
            class="lCenter-r">
            <div>
                <el-row>
                    <el-col :span="6" class="textEllipsis lLeft-r" style="display: -webkit-box;">
                        <el-switch
                        v-model="switchValue"
                        @change="changeinformAtion"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                        </el-switch>
                        <p style="line-height:20px; padding:0 10px;">{{switchValue?'已开启':'已关闭'}}</p>
                    </el-col>
                    <el-col :span="18" class="cursorCss lRight-r">
                        <el-button class="redBackColor butColorF" @click="addTimeLimitEven">选择课程</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="courseListBox">
                <el-row>
                    <el-col v-for="(item,i) in courseArryPropList" :key="i" class="lMarginBO20">
                        <el-row>
                            <el-col :span="20" class="textEllipsis lLeft-r">{{item.title}}</el-col>
                            <el-col :span="4" class="cursorCss lCenter-r">
                                <i class="el-icon-circle-close" @click="deleteCourseEven(item)"></i>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>   
        <el-dialog
            title=""
            :visible.sync="timeLimitCheckboxDialog"
            :close-on-click-modal="false"
            width="30%"
            class="lCenter-r">
            <div>
                <div style="margin-bottom:20px; text-align: left;">
                    <el-radio-group 
                        v-model="checkedCities" @change="changePlugin">
                        <el-radio v-for="(city,index) in cities" :label="city.value" :key="index">{{city.name}}</el-radio>
                    </el-radio-group>                  
                </div>                   
                <el-row :gutter="10">
                    <el-col :span="18">
                        <div class="iSeachEven">
                            <el-input v-model.trim="courseTimeTitle"
                                    placeholder="输入课程名称查询"
                                    class="search-form"
                                    maxlength="10"
                                    width="100%"></el-input>   
                        </div>
                    </el-col>
                    <el-col :span="6" class="lCenter-r"><el-button class="redBackColor butColorF" @click="timeFindInfo">查询</el-button></el-col>
                </el-row>
            </div>
            <div class="checkboxCss">
                <el-checkbox-group v-if="citiesTimeList.length>0" class="checkListCss" v-model="checkedTimeCities" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="(item,i) in citiesTimeList" :label="item.timeLimitedDiscountsId" :key="i">{{item.title}}</el-checkbox>
                </el-checkbox-group>      
                <p v-else style="margin-top: 50px;">
                    没有找到您想要的内容
                </p>          
            </div>
             <div>
                <el-button type="primary" @click="isNoListEven()">取消</el-button>
                <el-button type="primary" @click="isOkListEven()">确定</el-button>
             </div>
        </el-dialog>                                                  
    </div>
</template>
<script>
import gxHead from "@/components/formSynthesisPlugin/gxHead"; 
// import gxTable from "@/components/formSynthesisPlugin/gxTable";
import gxPaginaton from "@/components/formSynthesisPlugin/gxPaginaton"; 
import Dialog from "@/components/myDialog/myDialog";
import eventAction from '../../lEventAtion';
let actions = new eventAction();
export default {
    components:{
        gxHead,
        // gxTable,
        gxPaginaton,
        Dialog
    },
    data(){return {

            tableObj:{
                tableData:[],
                // 1.编辑，2.下架，3.详情，4.排序
                marksArrs:[
                        {name:"排序",type:1},
                        {name:"下架",type:2},
                        {name:"上架",type:3},
                        {name:"删除",type:4}
                    ],
                markState:true,
                loading:true,
                types:'timelimit',
                minWidth:80,  
                power:[]             
            },
            pageAtion:{},
            headObj:{
                typeBoll:true,
                name:'timeLimit',
                title:'添加限时/秒杀课程',
                listType:{
                    listValOne:[
                        {
                        value: '2',
                        label: '全部'
                        },                        
                        {
                        value: '1',
                        label: '已上架'
                        }, {
                        value: '0',
                        label: '已下架'
                        }],
                    listValTwo:[
                        {
                        value: '-1',
                        label: '全部'
                        },                        
                        {
                        value: '1',
                        label: '成人'
                        }, {
                        value: '2',
                        label: '少儿'
                        }],                        
                },
                power:[],
                menuList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'限时购/秒杀系统',
                            pathInfo:''
                        }
                ],
            },
            checkedCities:1,
            cities: [
                {
                    name:'自营课程',
                    value:1
                }
                // ,
                // {
                //     name:'三方课程',
                //     value:2
                // }
            ],            
            //弹框配置
            dialgObj:{
                    deleteCourse:{
                        showFlag:false, //是否显示遮罩弹框；
                        title:"温馨提示", //Dialog 的标题
                        cancelName:'deletcNo', //自定义取消事件名字
                        sureName:'deletcOk', //自定义确定事件名字
                    },
                    cancel:{
                        showFlag:false, //是否显示遮罩弹框；
                        title:"温馨提示", //Dialog 的标题
                        cancelName:'cancelNo', //自定义取消事件名字
                        sureName:'cancelOk', //自定义确定事件名字,
                    },
                    sortCourse:{
                        showFlag:false, //是否显示遮罩弹框；
                        title:"温馨提示", //Dialog 的标题
                        cancelName:'sortNo', //自定义取消事件名字
                        sureName:'sortOk', //自定义确定事件名字,                        
                    }                    
            },            
            chooseState:'',
            chooseStateNext:'',
            titleVal:'',
            chooseListObj:'',
            sortNumber:'',
            pageSize:10,
            dialogTableVisible:false,
            timeTypeDetail:false,
            timeLimitCourseDetail:false,
            timeLimitCheckboxDialog:false,
            switchValue:'',
            courseArryPropList:[],
            courseTimeTitle:'',
            checkedTimeCities:[],
            mTypeNum:1,
            pageNo:1,
            pageSize:10,
            citiesTimeList:[],
            checkelocalCourse:[],
            checkedCopyCitiesNext:[],
            checkedCopyCities:[],
            //临时存储数组
            temporaryList:[],//最新选中数组
            temporaryList1:[],
            temporaryList2:[],
            startTime:'',
            endTime:''    
    }},
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path;
        let flag = this.$getPermissions(routes,currentPath)
        if(!flag){
            flag = [];
        }
        var self = this;
        self.tableObj.power = flag;
        self.headObj.power = flag;        
        this.showData({pageSize:this.pageSize ,pageNo: 1});
    },
    props:{},
    computed:{},
    methods:{
        changePlugin(){
            this.citiesTimeList = []             
            this.getTimeLimited();
        },        
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #F3F3F3;font-weight: 500;font-size: 16px;'
            }
        },         
        handleClick(e,f){
            this.Routerpage({id:e.id,type:f,data:e});
        },
        isNoListEven(){
            var self = this;
            self.timeLimitCheckboxDialog = false;
            setTimeout(()=>{
                self.timeLimitCourseDetail = true;
                self.courseArryPropList = self.courseArryList; 
                var list =[];
                for (const iterator of self.courseArryList) {
                    list.push(iterator.id);
                }
                // self.checkedTimeCities = list;
                self.checkedCopyCitiesNext = list;
                self.checkelocalCourse = list;
            },300);            
        },
        isOkListEven(){
            var self = this;          
            self.$http.post(self.$server.getTimeLimitedAddSecondMenu,{content:JSON.stringify(self.checkedCopyCitiesNext),type:self.mTypeNum}).then(res=>{
                if(res.status==200){
                    // self.cities = res.content.list;
                    self.timeLimitCheckboxDialog = false;
                    setTimeout(()=>{
                        self.timeLimitCourseDetail = true;
                        self.courseTimeTitle = '';
                        self.checkedTimeCities = [];
                        self.checkelocalCourse = [];
                        self.checkedCopyCitiesNext = []; 
                        self.citiesTimeList =[];          
                        self.temporaryList1=[];
                        self.temporaryList2=[];                          
                        self.getTimeLimiteDsecondList();
                    },300);                    
                }
            });             
        },
        handleCheckedCitiesChange(vaule){ 
            var self = this;    
            var self = this;   
            self.temporaryList1 =[];
            self.temporaryList2 =[];
                if(!self.temporaryList){
                    self.temporaryList = self.checkelocalCourse;  //初始化选中的数组付给实时选中的数组；
                }
                //当前列表数组选中与未选中的数组；
                for (const iterator1 of self.checkedCopyCities) {
                    var indexs=vaule.indexOf(iterator1);
                    if(indexs==-1){
                        self.temporaryList1.push(iterator1);
                    }else{
                        self.temporaryList2.push(iterator1);
                    }
                };
                self.temporaryList = self.temporaryList2.concat(self.temporaryList);
                self.temporaryList = [...new Set(self.temporaryList)];  
                for(const iterator2 of self.temporaryList1){ 
                        var indexs=self.temporaryList.indexOf(iterator2);
                        if(indexs!=-1){
                            self.temporaryList.splice(indexs, 1);  
                        }                
                }
                self.checkedCopyCitiesNext = self.temporaryList;
        },
        timeFindInfo(){
            this.getTimeLimited();
        },
        deleteCourseEven(data){
            var self = this;
            self.$http.delete(self.$server.getTimeLimiteddeleteById({id:data.id})).then(res=>{
                if(res.status==200){
                    self.getTimeLimiteDsecondList()
                }
            });
        },
        addTimeLimitEven(){
            var self = this;
            self.dialogTableVisible=false;
            self.timeTypeDetail=false;
            self.timeLimitCourseDetail=false;
            setTimeout(()=>{
                self.timeLimitCheckboxDialog=true;
                self.getTimeLimited();
            },300);
            
        },     
        getTimeLimited(){
            var self = this;     
            // 去掉特殊字符  
            var converter = document.createElement("DIV"); 
            converter.innerHTML = self.courseTimeTitle; 
            var b = converter.innerText; 
            converter = null; 
            var c=b.replace(/[&\|\\\*^%$#@\-?《》——（）。，~`,.<>='‘’；"":；();:{}+_]/g,"");           
            var params ={
                    title:c,
                    mtype:self.mTypeNum,
                    courseSource:this.checkedCities
            }            
            self.checkedCopyCities =[];
            self.$http.get(self.$server.getTimeLimitedDiscounts(params)).then(res=>{
                if(res.status==200){
                self.citiesTimeList = res.content.list; 
                    var list = [];
                    for (const iterator of res.content.list) {
                        list.push(iterator.timeLimitedDiscountsId);
                    }
                    self.checkedCopyCities=list; 
                }                
            });      
        },
        changeinformAtion(val){
            var self = this;
            var paramsObj = {
                type:self.mTypeNum==1?3:4,
                enable:val?1:0
            }
            self.$http.post(self.$server.getInformationEnable,paramsObj).then(res=>{
                if(res.status==200){
                    if(val){
                        self.courseArryPropList = self.courseArryList;
                    }else{
                        self.courseArryPropList = [];
                    }
                }
            });            
        },
        getInformationSwitch(num){
            var self = this;
            self.$http.get(self.$server.getInformationSwitch({type:num})).then(res=>{
                if(res.status==200){
                    this.switchValue = res.content.isEnable==1?true:false;
                }
            });            
        },   
        //二级页面添加限时购列表课程     
        getTimeLimiteDsecondList(){
           var self = this;
            self.$http.get(self.$server.getTimeLimiteDsecondList({mtype:self.mTypeNum})).then(res=>{
                if(res.status==200){
                    self.courseArryList = res.content.list;
                    self.courseArryPropList = self.courseArryList; 
                    var list =[];
                     for (const iterator of self.courseArryList) {
                         list.push(iterator.timeLimitedDiscountsId);
                    }
                    self.checkedTimeCities = list;
                    self.checkelocalCourse = list;
                    self.checkedCopyCitiesNext = list;                    
                }
            });             
        },         
        timeTypeDetailEven(num){
            var self = this;
            self.mTypeNum = Number(num);
            self.timeTypeDetail = false;
            setTimeout(()=>{
                self.timeLimitCourseDetail = true;
                var nums = num==1?3:4;
                self.getInformationSwitch(nums);
                self.getTimeLimiteDsecondList();
            },300);
            
        },
        switchSecondEven(){
            this.timeTypeDetail = true;
        },
        dialogChanges(){
            this.$router.push({path:'/marketelist/timeLimit/addCourse', query:'1'});
        },        
        //表头输入信息过滤
        inputStateVal(valobj){
            var self = this;  
            self.tableObj.loading = true;    
            this.chooseState =Number(valobj.status); 
            this.chooseStateNext=valobj.status1!=2?valobj.status1:'';
            this.titleVal =valobj.title; 
            this.startTime = valobj.dataStart;
            this.endTime = valobj.dataEnd;    
            this.showData({pageSize:this.pageSize ,pageNo: 1,title:self.titleVal,sellStatus:self.chooseStateNext,mtype:self.chooseState,startTime:actions.formatDate(self.startTime,'start'),endTime:actions.formatDate(self.endTime,'end')});
        },        
        //分页子组件传递给父组件的方法
        childPageValue(pageNum){
            var self = this;
            this.tableObj.loading = true;
            //后期做接口字段过滤；
            this.showData({pageSize: this.pageSize,pageNo: pageNum,title:self.titleVal,sellStatus:self.chooseStateNext,mtype:self.chooseState,startTime:actions.formatDate(self.startTime,'start'),endTime:actions.formatDate(self.endTime,'end')});
        },
        showData(paramsObj){
            var self = this;
            self.tableObj.loading = true;
            var url = "/timeLimitedDiscounts/selectAll";
            actions.getData(url,paramsObj)
                .then(data => {
                    let obhArr = actions.tableHead.timelimit;
                    let endObj=actions.filterData(data,obhArr,'timelimit');
                    var listIds = [];
                        listIds = endObj.tableObj.tableData.map(function(element,index){
                            if(endObj.pageAtion.pageNum==1){
                                element.sortId = index+1;
                                return element;
                            }else if(endObj.pageAtion.pageNum>1){
                                element.sortId = (endObj.pageAtion.pageNum-1)*10+index+1;
                                return element;
                            }
                        });                    
                    self.tableObj.tableData = listIds;
                    self.pageAtion = endObj.pageAtion;
                    if(endObj.pageAtion.pageTotal>self.pageSize){
                        self.pageAtion['pageBool'] = false;
                    }else{
                        self.pageAtion['pageBool'] = true;
                    }                             
                    self.$nextTick(function(){
                            self.tableObj.loading = false; 
                    })   
                })
                .fail(function(){
                    self.pageAtion['pageBool'] = true;
                    self.$nextTick(function(){
                            self.tableObj.loading = false; 
                    })                    
                    console.log("出错啦!")}
                );
        },
        //表格组件数据传递
        Routerpage(obj){
            // {name:"排序",type:1},
            // {name:"下架",type:2},
            // {name:"上架",type:3},
            // {name:"删除",type:4}            
            this.tableObj.chooseID = obj.id;
            var self = this;
            switch (obj.type) {
                case 1:                  
                    this.dialgObj.sortCourse.showFlag = true;
                    self.chooseListObj = obj.data;
                    break;
                case 2: 
                    self.dialgObj.cancel.showFlag = true;
                    self.chooseListObj =obj.data;
                    break;
                case 3:
                    self.chooseListObj =obj.data;     
                    var endtime = new Date(obj.data.endAt);
                    var endtime1 = endtime.getTime();
                    var timestamp=new Date().getTime();//获取当前时间戳;
                    if(endtime1<timestamp){
                        self.dialogTableVisible = true;
                    }else{
                            self.dialogTableVisible = false;
                            self.dialgObj.cancel.showFlag = false;
                            var url = "/timeLimitedDiscounts/upperLowerShelves";
                            actions.getData(url,{id:self.chooseListObj.id,sellStatus:1},"post")
                            .then(data => {
                                let temp = {pageSize:this.pageSize ,pageNo: 1,title:self.titleVal,sellStatus:self.chooseStateNext,mtype:self.chooseState}
                                    this.showData(temp);
                            })               
                            .fail(function(){
                            self.$nextTick(function(){
                                    self.tableObj.loading = false; 
                            })}
                        );
                    }
                    break;  
                case 4:
                    self.dialgObj.deleteCourse.showFlag = true;
                    self.chooseListObj =obj.data;
                    break;                                                   
                default: 
                    alert("信息错误");
                    break;
            }
        },
        //下架取消
        timeLimitCancelNo(){
            this.dialgObj.cancel.showFlag = false;
        },
        //下架确定
        timeLimitCancelOk(){
            var self = this;
            self.dialgObj.cancel.showFlag = false;
            var url = "/timeLimitedDiscounts/upperLowerShelves";
            // this.showData({pageSize:this.pageSize ,pageNo: 1,title:self.titleVal,sellStatus:self.chooseStateNext,mtype:self.chooseState});
            actions.getData(url,{id:self.chooseListObj.id,sellStatus:0},"post")
            .then(data => {
                    this.showData({pageSize:this.pageSize ,pageNo: 1,title:self.titleVal,sellStatus:self.chooseStateNext,mtype:self.chooseState});
            })               
            .fail(function(){
            self.$nextTick(function(){
                    self.tableObj.loading = false; 
            })}
            );
        },
        timeLimitDeleteNo(){
             this.dialgObj.deleteCourse.showFlag = false;
        },  
        timeLimitDeleteOk(){
            var self = this;
            self.dialgObj.deleteCourse.showFlag = false;
            var url = "/timeLimitedDiscounts/deleteById/"+self.chooseListObj.id;
            actions.getData(url,"","delete")
            .then(data => {
                    this.showData({pageSize:this.pageSize ,pageNo: 1,title:self.titleVal,sellStatus:self.chooseState});
            })               
            .fail(function(){
            self.$nextTick(function(){
                    self.tableObj.loading = false; 
            })}
            );            
        },
        timeLimitsortNo(){
            this.dialgObj.sortCourse.showFlag = false;
        },
        timeLimitsortOk(){
            var self = this;
            var nums = self.sortNumber;
            self.dialgObj.sortCourse.showFlag = false;
            var url = "/timeLimitedDiscounts/sort/"+self.chooseListObj.id;
            actions.getData(url,{oldSort:self.chooseListObj.sort,sort:Number(nums)},"post")
            .then(data => {
                    this.showData({pageSize:this.pageSize ,pageNo: 1,title:self.titleVal,sellStatus:self.chooseState});
            })               
            .fail(function(){
            self.$nextTick(function(){
                    self.tableObj.loading = false; 
            })}
            );
        }
                    
    },
    mounted(){}
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
.timeTwoPageBut{
    text-align: right;
    background: #fff;
    padding: 10px;    
}
.timeTwoPageBut .timeTwoBut{

}
.courseListBox{
    max-height: 500px;
    margin-top: 20px;
    overflow-y: auto;
}
.checkboxCss{
    max-height: 500px;
    min-height: 200px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
.checkboxCss .checkListCss .el-checkbox{
    display: -webkit-box;
    margin-left: 30px;
    margin-top: 20px;
}   
.checkboxCss .checkListCss .el-checkbox .el-checkbox__label{
    width: calc(100% - 14px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    text-align: left;
} 
</style>

