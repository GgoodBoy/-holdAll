<template>
    <div>
        <el-container>
            <el-main>
                <el-row class="lMarginTB20" :gutter="10">
                    <el-col class="lLine40 lLeft-r">
                        <el-radio-group 
                            v-model="checkedCities" @change="changePlugin">
                            <el-radio v-for="(city,index) in cities" :label="city.value" :key="index">{{city.name}}</el-radio>
                        </el-radio-group>                        
                    </el-col>
                    <el-col class="lLeft-r">               
                        <el-input
                        placeholder="搜索课程标题"
                        style="width:150px;"
                        v-model="input2">
                        </el-input>
                        <el-select v-model="channelValue" style="width:100px;" v-if="!varObjs.selectisNoMtype">
                            <el-option
                            v-for="item in channelListNext"
                            :key="item.channelId"
                            :label="item.name"
                            :value="item.channelId">
                            </el-option>
                        </el-select>     
                       <el-select v-model="pipelineIdValue"
                                clearable
                                placeholder="课程渠道" style="width:100px;" v-if="varObjs.pipelineType">
                            <el-option v-for="(item,i) in (pageConstant.pipelineList)"
                                :key="i"
                                :label="item.name"
                                :value="Number(item.channelId)">
                            </el-option>
                        </el-select>    
                        <el-button style="background-color:#9e0e00;color:#fff" @click="select">查询</el-button>    
                        <span>
                            已选择<span class="redFontColor">{{tableDataIdList.length}}</span>门课程    
                        </span>                                       
                    </el-col>
                </el-row>
                <el-row>
                    <div class="nameTitleBox">
                        <div>名称</div>
                        <div v-show="varObjs.mtypeText">类型</div>
                        <div>价格</div>
                    </div>
                    <div class="list" ref="multipleTable" v-loading="loadDailg">
                        <el-checkbox v-if="checkAllBut" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox-group v-model="tableDataIdList" @change="changeChoose" :max="Number(numbersBool)>0?Number(numbersBool):9999">
                            <div class="item nameTextEllipsis" v-for="(item,index) in tableData" :key="index">
                                <el-checkbox :label="item.id">
                                    <div class="name">{{item.title}}</div>
                                </el-checkbox>
                                <div class="others">
                                    <div v-show="varObjs.mtypeText">{{item.mtype==1?'成人':'少儿'}}</div>
                                    <div>{{item.sellingPrice||item.price||0}}币</div>
                                </div>
                            </div>
                        </el-checkbox-group>                        
                    </div>
                </el-row>
            </el-main>
            <el-footer>
                <el-row>
                    <el-col style="text-align:center;margin-top:40px">
                        <el-button style="background-color:#9e0e00;color:#fff" @click="isOkSelect(true)">确定</el-button>
                        <el-button style="background-color:#ccc;color:#fff" @click="isOkSelect(false)">取消</el-button>
                    </el-col>                    
                </el-row>
            </el-footer>
        </el-container>
    </div>
</template>
<script>
// 点击推存切换组件
export default {
    data(){
        return {
            tableData:[],//表单数据;
            chooselistTable:[],//选中的表单传递给父级的数据；
            input2:'',//搜索输入信息;
            loadDailg:true,//表单加载;
            tableDataCopy:[],//只要拉出来的数据数组
            tableDataCopyId:[],
            inputBoos:false,
            tableDataIdList:[],
            checkedCities:1,
            searchType:true,
            pageNo:1,
            cities: [],
            pageConstant: {},
            channelValue:'',
            channelListNext:[],
            pipelineIdValue:'',
            urlStrType:true,
            checkAll:false,
            checkAllIdArry:[],
            changePluginType:false,
            // isIndeterminate: true       
        }
    },
    created(){
        let urlStr =['/course/getNameList','/course/getList'];
        if(this.varObjs.isNothirdParty){
            this.cities= [
                {
                    name:'自营课程',
                    value:1
                }
            ]
        }else{
            this.cities= [
                {
                    name:'自营课程',
                    value:1
                },
                {
                    name:'三方课程',
                    value:2
                }
            ]
        }
        if(urlStr.indexOf(this.urlPorp)>-1){
            this.channelListNext=[
                {
                    channelId:0,
                    name:'全部'
                },                
                {
                    channelId:1,
                    name:'成人'
                },
                {
                    channelId:2,
                    name:'少儿'
                }
            ];
            this.urlStrType=true;
            this.channelValue=0;
        }else{
            this.channelListNext=[
                {
                    channelId:-1,
                    name:'全部'
                },                
                {
                    channelId:1,
                    name:'成人'
                },
                {
                    channelId:2,
                    name:'少儿'
                }
            ];          
            this.urlStrType=false;
            this.channelValue=-1;

        }        
        this.getDataList();
        this.getConstant();
    },
    /** 
     * urlPorp:地址
     * chooseIdlist：回填id
     * numbersBool:控制选择数量
     * varObjs：分页，类型，设置
     * channelObj：
     * */ 
    props:['varObjs',"courseType","channelObj","numbersBool","urlPorp","chooseIdlist","relevanceId","checkAllBut","parentId","wpCourseId"],
    computed:{},
    methods:{
            //全选
            handleCheckAllChange(val){
                this.tableDataIdList = val ? this.checkAllIdArry : [];
                // this.isIndeterminate = false;
            },
            //获取渠道类型
            getConstant() {
                this.$http
                    .get(this.$server.courseConstant)
                    .then(res => {
                        res.content.courseTypeMap[0] = {name: "全部", value: -1};
                        res.content.courseStatusList= [{name: "全部", value: -1}].concat(res.content.courseStatusList);
                        // res.content.courseCategoryList = [{name: "全部", value: -1}].concat(res.content.courseCategoryList);
                        this.pageConstant = res.content;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },            
            //表单选择
            changeChoose(data){
                if(data.length!=this.checkAllIdArry.length){
                    this.checkAll = false;
                }else{
                    this.checkAll = true;
                }
                this.tableDataIdList = data;
            },
            //选择类型事件
            changePlugin(data){
                this.pageNo = 1;
                this.changePluginType=true;
                this.tableData =[];            
                this.saveSeach();
            },
            //表单下拉分页
                    /**
             * 滚动分页
             */
            scrollEvent(){
                if(!this.changePluginType){
                    let scrollDistance = this.$refs.multipleTable.scrollHeight - this.$refs.multipleTable.scrollTop - this.$refs.multipleTable.clientHeight
                    let sign = 50;
                    if (scrollDistance <= sign) {
                        if(this.searchType){
                            this.$refs.multipleTable.removeEventListener("scroll",this.scrollEvent)
                            this.pageNo++;
                            this.saveSeach();
                        }
                    }
                }
            },
            //搜索事件
            select(){
                this.pageNo = 1;
                this.tableData =[];
                this.searchType = false;
                this.saveSeach();
            },
            getDataList(){ 
                var list=[];
                if(this.chooseIdlist){
                    this.chooseIdlist.forEach((item,index)=>{
                        if(typeof item=='string'){
                            list.push(Number(item));
                        }else if(typeof item=='number'){
                            list.push(item);
                        }
                    });
                }
                this.tableDataIdList = list;
                this.ajaxDataReset();
            },      
            //搜索保存
            saveSeach(){
                var self = this;
                if(self.courseType=="course"){
                    var courseIds=[];
                    var courseIdsSort = [];
                    var i =0;
                    self.chooselistTable.forEach(element => {
                        i++;
                        courseIds.push(element.content);
                        courseIdsSort.push({"courseId":element.content,"sort":i});
                    });     
                    self.$http
                        .post(this.$server.relevanceCourseId({courseId:self.relevanceId}),{"courseMappingParamForms": JSON.stringify(courseIdsSort)})
                        .then(res => {
                            if(res.status==200){
                                self.ajaxDataReset();
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }else{
                    self.ajaxDataReset();
                }

            },
            ajaxDataReset(){
                var self = this;      
                switch (self.courseType) {
                    case "course":
                        this.getListCourse();
                        break;    
                    case "channel":
                        this.getListChannel();
                        break;    
                    case "creatWisdom":
                        this.getWisdomListChannel();
                        break;   
                    case "talentShow":
                        this.getTalentShowListChannel();
                        break;    
                    case "wisdomPlatform":
                        this.getWisdomPlatformListChannel();
                        break;                                                        
                    default:
                        this.getListOther();
                        break;
                }
            },
            getWisdomPlatformListChannel(){
                let self = this;
                let query = {
                    params:{
                        batchId:self.parentId,
                        title:self.input2||"",
                        type:Number(self.channelValue),
                        pipelineId:self.pipelineIdValue,
                        courseSource:self.checkedCities
                    }
                }
                self.$http.get(self.urlPorp,query)
                    .then(res => {
                        if (res.status === 200) {
                            self.tableData = res.content;
                            //监听DOM渲染结束后在执行的回调函数；
                            if(self.tableData){
                                self.contentTableList(res.content);                                                                                   
                            }
                            self.loadDailg=false; 
                        }
                })
                .catch(res => {
                    console.log(res)
                });                
            },
            getTalentShowListChannel(){
                let self = this;
                let query = {
                    params:{
                        courseName:self.input2||"",
                        mtype:Number(self.channelValue),
                        pipelineId:self.pipelineIdValue,
                        courseSource:self.checkedCities
                    }
                }
                self.$http.get(self.urlPorp,query)
                    .then(res => {
                        if (res.status === 200) {
                            self.tableData = res.content;
                            //监听DOM渲染结束后在执行的回调函数；
                            if(self.tableData){
                                self.contentTableList(res.content);                                                                                   
                            }
                            self.loadDailg=false; 
                        }
                })
                .catch(res => {
                    console.log(res)
                });                 
            },
            getWisdomListChannel(){
                let self = this;
                let query = {
                    params:{
                        title:self.input2||"",
                        type:Number(self.channelValue),
                        pipelineId:self.pipelineIdValue,
                        courseSource:self.checkedCities
                    }
                }
                self.$http.get(self.urlPorp,query)
                    .then(res => {
                        if (res.status === 200) {
                            self.tableData = res.content;
                            //监听DOM渲染结束后在执行的回调函数；
                            if(self.tableData){
                                self.contentTableList(res.content);                                                                                   
                            }
                            self.loadDailg=false; 
                        }
                })
                .catch(res => {
                    console.log(res)
                });                                
            },
            //点击确定或者取消按钮
            isOkSelect(type){  
                this.restructureData();
                if(this.courseType=="appHome"){
                    if(type){
                        var objs = {"bool":false,datas:this.chooselistTable,checkedCitystate:this.checkedCities};
                        this.$store.commit("appConfig/isOkOrAddEvent",objs)
                    }else{
                        var objs = {"bool":false,datas:[],checkedCitystate:this.checkedCities};
                        this.$store.commit("appConfig/isOkOrAddEvent",objs)
                    }
                }else{
                    var objs = {"bool":type,datas:this.chooselistTable,checkedCitystate:this.checkedCities};
                    this.$emit('listSelect',objs);
                }    
            },            
            //返回选中的重组数据；
            restructureData(){
                var self = this;
                var selectlist = [];
                self.tableDataIdList.forEach(element=>{
                    for (const iterator of self.tableDataCopy) {
                        if(iterator.id==element){
                                selectlist.push(
                                    {
                                        "content":iterator.id,
                                        "courseName":iterator.title,
                                        "no":'',
                                        "type":2,
                                        "originalPrice":iterator.originalPrice||0,
                                        "sellingPrice":iterator.sellingPrice||0
                                    }
                                );
                                break;
                        }
                    }
                });   
                self.chooselistTable = selectlist;                  
            },
            //拉去数组合并
            contentTableList(data){
                var self = this;
                if(!self.tableDataCopy){
                    self.tableDataCopy = data;
                    data.forEach((el,i)=>{
                        self.tableDataCopyId.push(el.id);
                    });                     
                }else{
                    data.forEach((el,i)=>{
                        if(self.tableDataCopyId.indexOf(el.id) == -1){
                            self.tableDataCopy.push(el);
                        }
                    });                      
                }
            },
            getListChannel(){
                var self = this;
                var urls='',
                    id = self.channelObj.selectChannelId;
                if(id){
                    urls = self.urlPorp+"?courseName="+self.input2+"&id="+id+"&courseSource="+self.checkedCities;
                }else{
                    urls = self.urlPorp+"?courseName="+self.input2+"&courseSource="+self.checkedCities;
                }
                self.$http.get(urls)
                    .then(res => {
                        if (res.status === 200) {
                            self.tableData = res.content;
                            //监听DOM渲染结束后在执行的回调函数；
                            if(self.tableData){
                                self.contentTableList(res.content);                                                                                   
                            }
                            self.loadDailg=false; 
                        }
                })
                .catch(res => {
                    console.log(res)
                });                
            },
            getListCourse(){
                var self = this;
                self.$http.get(self.urlPorp+"&title="+self.input2+"&courseSource="+self.checkedCities)
                    .then(res => {
                        if (res.status === 200) {
                            self.tableData = res.content;
                            //监听DOM渲染结束后在执行的回调函数；
                            if(self.tableData){
                                self.contentTableList(res.content);                                                                                   
                            }
                            self.loadDailg=false;                              
                    }
                })               
            },
            getListOther(){
                var self = this;
                let query ={};
                //指定显示成人少儿类型；
                if(Number(self.varObjs.mtype)>0){
                    if(self.varObjs.pageType){
                        query = {
                            params:{
                                title:self.input2||"",
                                type:Number(self.varObjs.mtype),
                                pageNo:self.pageNo,
                                pageSize:20,                                
                                courseSource:self.checkedCities
                            }
                        } 
                    }else{
                        query = {
                            params:{
                                title:self.input2||"",
                                type:Number(self.varObjs.mtype),
                                courseSource:self.checkedCities
                            }
                        } 
                    }
                }else{
                    if(self.varObjs.pageType){
                        //是否有成人少儿区分
                        if(self.varObjs.mtypeText){
                            if(self.varObjs.coursrTitleStr=='title'){
                                query = {
                                    params:{
                                        title:self.input2,
                                        pageNo:self.pageNo,
                                        pageSize:20,
                                        courseSource:self.checkedCities
                                    }
                                } 
                            }else if(self.varObjs.coursrTitleStr=='courseName'){
                                query = {
                                    params:{
                                        courseName:self.input2,
                                        pageNo:self.pageNo,
                                        pageSize:20,
                                        courseSource:self.checkedCities
                                    }
                                }
                            }else{
                                query = {
                                    params:{
                                        name:self.input2,
                                        pageNo:self.pageNo,
                                        pageSize:20,
                                        courseSource:self.checkedCities
                                    }
                                } 
                            }                           
                            if(!self.varObjs.selectisNoMtype){
                                if(this.urlStrType){
                                    query.params['type']=self.channelValue;
                                }else{
                                    query.params['mtype']=self.channelValue;
                                }
                            }
                        }else{
                            if(self.varObjs.coursrTitleStr=='title'){
                                query = {
                                    params:{
                                        title:self.input2,
                                        pageNo:self.pageNo,
                                        pageSize:20,
                                        courseSource:self.checkedCities
                                    }
                                }
                            }else if(self.varObjs.coursrTitleStr=='courseName'){
                                query = {
                                    params:{
                                        courseName:self.input2,
                                        pageNo:self.pageNo,
                                        pageSize:20,
                                        courseSource:self.checkedCities
                                    }
                                }
                            }else{
                                query = {
                                    params:{
                                        name:self.input2,
                                        pageNo:self.pageNo,
                                        pageSize:20,
                                        courseSource:self.checkedCities
                                    }
                                }
                            }
                        }
                    }else{
                        if(self.varObjs.mtypeText){
                            if(self.varObjs.coursrTitleStr=='title'){
                                query = {
                                    params:{
                                        title:self.input2,
                                        courseSource:self.checkedCities
                                    }
                                }
                            }else if(self.varObjs.coursrTitleStr=='courseName'){
                                query = {
                                    params:{
                                        courseName:self.input2,
                                        courseSource:self.checkedCities
                                    }
                                }
                            }else{
                                query = {
                                    params:{
                                        name:self.input2,
                                        courseSource:self.checkedCities
                                    }
                                }
                            }
                            if(!self.varObjs.selectisNoMtype){
                                if(this.urlStrType){
                                    query.params['type']=self.channelValue;
                                }else{
                                    query.params['mtype']=self.channelValue;
                                }
                            }                           
                        }else{
                            if(self.varObjs.coursrTitleStr=='title'){
                                query = {
                                    params:{
                                        title:self.input2,
                                        courseSource:self.checkedCities
                                    }
                                }
                            }else if(self.varObjs.coursrTitleStr=='courseName'){
                                query = {
                                    params:{
                                        courseName:self.input2,
                                        courseSource:self.checkedCities
                                    }
                                }
                            }else{
                                query = {
                                    params:{
                                        name:self.input2,
                                        courseSource:self.checkedCities
                                    }
                                }
                            }
                        }
                    }
                }
                if(self.varObjs.pipelineType){
                    query.params.pipelineId = self.pipelineIdValue;
                }
                this.$http.get(self.urlPorp, query).then(res=>{
                    if(res.status==200){
                        if(self.varObjs.pageType){
                            self.tableData = self.tableData.concat(res.content.list);
                            self.searchType = true;
                            //监听DOM渲染结束后在执行的回调函数；
                            if(self.tableData){  
                                self.contentTableList(res.content.list); 
                                if(res.content.isLastPage){
                                    self.changePluginType=true;
                                    self.$refs.multipleTable.removeEventListener("scroll",self.scrollEvent)
                                }else{
                                    self.changePluginType=false;
                                    self.$nextTick(()=>{
                                        self.$refs.multipleTable.addEventListener("scroll",self.scrollEvent);
                                    })
                                }  
                            }
                        }else{
                            self.tableData = res.content;
                            if(self.checkAllBut){
                                self.tableData.forEach((element,index)=>{
                                    self.checkAllIdArry.push(element.id);
                                });
                                if(self.checkAllIdArry.length==self.chooseIdlist.length){
                                    self.checkAll = true;
                                    self.tableDataIdList = self.checkAllIdArry;
                                }
                            }
                            //监听DOM渲染结束后在执行的回调函数；
                            if(self.tableData){
                                self.contentTableList(res.content);                                                                                   
                            }
                        }
                        self.loadDailg=false;
                    }
                })                
            }
    },
    watch:{
        varObjs:{ //深度监听，可监听到对象、数组的变化
            handler (newV, oldV) {
                if(JSON.stringify(newV)!=JSON.stringify(oldV)){
                    this.getDataList();
                }
            },
            deep:true
        }
    },
    mounted() {}
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
.has-gutter th.el-table-column--selection .cell{
    display: none;
}
</style>
<style lang="scss" scoped>
        .nameTitleBox{
            overflow: hidden;
            div{
                float: left;
            }
            div:nth-child(1){
                width: 334px;
                padding: 0 10px;
            }
            div:not(:nth-child(1)){
                padding: 0 10px;
            }    
            div:last-child{
                float:right;
                padding: 0 16px 0 10px;
            }      
        }
        .list{
            margin:10px 0;
            max-height:350px;
            overflow-y: auto;
            padding: 10px;
            min-height: 60px;
            .item{
                margin:20px 0;
                .name{
                    width: 310px;
                }
            } 
            .nameTextEllipsis{
                display: flex;
                flex-direction: row;
                justify-content: space-between; 
                align-items: center;
                .others{
                    font-size: 14px;
                    width: 200px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;   
                    div{
                        border-left: 0;
                    }                  
                }
            }            
        }

</style>

