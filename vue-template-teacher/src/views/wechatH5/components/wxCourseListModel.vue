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
                        <el-select v-model="channelValue" style="width:100px;">
                            <el-option
                            v-for="item in channelListNext"
                            :key="item.channelId"
                            :label="item.name"
                            :value="item.channelId">
                            </el-option>
                        </el-select>     
                       <el-select v-model="pipelineIdValue"
                                multiple 
                                collapse-tags
                                clearable
                                @change="selectCkeckout"
                                placeholder="课程渠道" style="width:180px;">
                            <el-option v-for="(item,i) in (pageConstant.pipelineList)"
                                :key="i"
                                :label="item.name"
                                :value="Number(item.channelId)">
                            </el-option>
                        </el-select>    
                        <el-button style="background-color:#9e0e00;color:#fff" @click="select">确定</el-button>    
                        <span>
                            已选择<span class="redFontColor">{{tableDataIdList.length}}</span>门课程    
                        </span>                                       
                    </el-col>
                </el-row>
                <el-row>
                    <div class="nameTitleBox">
                        <div>名称</div>
                        <div>类型</div>
                        <div>价格</div>
                    </div>
                    <div class="list" ref="multipleTable" v-loading="loadDailg">
                        <el-checkbox v-if="checkAllBut" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox-group v-if="tableData.length>0" v-model="tableDataIdList" @change="changeChoose" :max="Number(numbersBool)>0?Number(numbersBool):9999">
                            <div class="item nameTextEllipsis" v-for="(item,index) in tableData" :key="index">
                                <el-checkbox :label="item.id">
                                    <div class="name">{{item.title}}</div>
                                </el-checkbox>
                                <div class="others">
                                    <div>{{item.mtype==1?'成人':'少儿'}}</div>
                                    <div>{{item.sellingPrice||item.price||0}}币</div>
                                </div>
                            </div>
                        </el-checkbox-group>   
                        <div style="text-align:center" v-else>暂无数据</div>                     
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
            tableDataIdList:[],
            checkedCities:1,
            searchType:true,
            pageNo:1,
            cities: [],
            pageConstant: {},
            pipelineListId:[],
            channelValue:'',
            channelListNext:[],
            pipelineIdValue:[],
            checkAll:false,
            checkAllIdArry:[],
            changePluginType:false,   
        }
    },
    created(){
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
        this.channelValue=-1;
        this.getDataList();
        this.getConstant();
    },
    /** 
     * chooseIdlist：回填id
     * numbersBool:控制选择数量
     * varObjs：分页
     * checkAllBut:是否有全选按钮
     * urlPorp:'课程地址'
     * */ 
    props:['varObjs',"numbersBool","chooseIdlist","checkAllBut","urlPorp"],
    computed:{},
    methods:{
            //全选
            handleCheckAllChange(val){
                this.tableDataIdList = val ? this.checkAllIdArry : [];
            },
            //渠道类型全部
            selectCkeckout(data){
                if(data.indexOf(-1)!=-1){
                    this.pipelineIdValue = this.pipelineListId;
                }
            },
            //获取渠道类型
            getConstant() {
                this.$http
                    .get(this.$server.courseConstant)
                    .then(res => {
                        res.content.courseTypeMap[0] = {name: "全部", value: -1};
                        res.content.courseStatusList= [{name: "全部", value: -1}].concat(res.content.courseStatusList);
                        this.pageConstant = res.content;
                        this.pageConstant.pipelineList.forEach((element,index)=>{
                            this.pipelineListId.push(Number(element.channelId));
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },            
            //表单选择
            changeChoose(data){
                console.log("data",data);
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
            /**
             * 表单下拉分页
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
                console.log('this.chooseIdlist',this.chooseIdlist);
                this.chooseIdlist.forEach((item,index)=>{
                    if(typeof item=='string'){
                        list.push(Number(item));
                    }else if(typeof item=='number'){
                        list.push(item);
                    }
                }); 
                this.tableDataIdList = list;
                this.getListOther();
            },      
            //搜索保存
            saveSeach(){
               this.getListOther();
            },
            //点击确定或者取消按钮
            isOkSelect(type){  
                this.restructureData();
                var objs = {"bool":type,datas:this.chooselistTable,checkedCitystate:this.checkedCities};
                this.$emit('listSelect',objs);
            },            
            //返回选中的重组数据；
            restructureData(){
                var self = this;
                var selectlist = [];
                let idLocalStorArr1 = [];
                let idLocalStorArr2 = [];
                self.tableDataIdList.forEach((element,index)=>{
                    for (const iterator of self.tableDataCopy) {
                        if(iterator.id==element){
                            idLocalStorArr1.push(element);
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
                self.tableDataIdList.forEach((element)=>{
                    if(idLocalStorArr1.indexOf(element)==-1){
                        idLocalStorArr2.push(element);
                    }
                });
                if(idLocalStorArr2.length>0){
                    let localCourseData = JSON.parse(sessionStorage.getItem('courseReturnListVal'));
                    if(localCourseData){
                        idLocalStorArr2.forEach((element,index)=>{
                            for (const iterator of localCourseData) {
                                if(Number(iterator.targetId)==element){
                                    selectlist.push(
                                        {
                                            "content":element,
                                            "courseName":iterator.courseName,
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
                    }
                }
                self.chooselistTable = selectlist; 
                sessionStorage.removeItem('courseReturnListVal');                 
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
            getListOther(){
                var self = this;
                let query ={};
                //title(课程名称) type(类型:1.成人,2.少儿)pipelineId(渠道ID)courseSource(课程来源 1学国学网 2机构)
                console.log("self.pipelineIdValue",self.pipelineIdValue);
                if(self.varObjs.pageType){
                    query = {
                        params:{
                            title:self.input2||"",
                            type:Number(self.channelValue),
                            pageNo:self.pageNo,
                            pageSize:20,                                
                            courseSource:self.checkedCities,
                            pipelineId:self.pipelineIdValue.toString()
                        }
                    } 
                }else{
                    query = {
                        params:{
                            title:self.input2||"",
                            type:Number(self.channelValue),
                            courseSource:self.checkedCities,
                            pipelineId:self.pipelineIdValue.toString()
                        }
                    } 
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
    watch:{},
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
                    width: 56%;
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

