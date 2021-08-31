<template>
    <div>
        <el-container>
            <el-header>
                <el-row class="lLine40">
                    <el-col :span="4" class="lSize30-i">选择课程</el-col>
                    <!-- v-show="courseType!='course'" -->
                    <el-col :span="2" :offset="18" @click.native="closeCourseList" class="lSize18-i">返回</el-col>
                    <!-- <i class="el-icon-close lSize18-i"></i> -->
                </el-row>
            </el-header>
            <el-main>
                <el-row class="lMarginTB20" :gutter="10">
                    <el-col :span="8">               
                        <el-input
                        placeholder="搜索课程标题"
                        suffix-icon="el-icon-search"
                        v-model="input2">
                        </el-input>
                    </el-col>
                    <el-col :span="3" v-if="filterType">  
                        <el-select v-model="channelValue">
                            <el-option
                            v-for="item in channelListNext"
                            :key="item.channelId"
                            :label="item.name"
                            :value="item.channelId">
                            </el-option>
                        </el-select>                        
                    </el-col>
                    <el-col :span="3" v-if="filterType">  
                        <el-select v-model="pipelineIdValue"
                                clearable
                                placeholder="课程渠道">
                            <el-option v-for="(item,i) in (pageConstant.pipelineList)"
                                :key="i"
                                :label="item.name"
                                :value="Number(item.channelId)">
                            </el-option>
                        </el-select>                       
                    </el-col>                    
                    <el-col :span="4">   
                        <el-button style="background-color:#9e0e00;color:#fff" @click="saveSeach">查询</el-button>
                    </el-col>                                        
                    <el-col :span="3" :offset="filterType?3:9">已选择<span class="redFontColor">{{changeChooseIdlist.length}}</span>门课程</el-col>
                </el-row>
                <el-row>
                    <el-table
                        v-loading = "loadDailg"
                        ref="multipleTable"
                        :data="tableData"
                        maxHeight="500" 
                        tooltip-effect="dark"
                        style="width: 100%"
                        @select-all="selectAll"
                        @select="handleSelectionChange">
                        <el-table-column
                        type="selection"
                        :selectable="selectable"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        prop="title"
                        max-width="300"
                        label="名称">
                        </el-table-column>
                        <el-table-column
                        v-if="filterType"
                        prop="pipelineName"
                        max-width="100"
                        label="渠道">
                        </el-table-column>                        
                        <el-table-column
                        v-if="filterType"
                        align="center"
                        max-width="100"
                        label="类型">
                            <template slot-scope="scope">
                                <P>{{scope.row.mtype==1?'成人':'少儿'}}</P>
                            </template>                        
                        </el-table-column>                        
                        <el-table-column
                        v-if="moneyType"
                        prop="sellingPrice"
                        label="价格"
                        align="center"
                        width="150"
                        show-overflow-tooltip>
                        </el-table-column>
                    </el-table>                    
                </el-row>
            </el-main>
            <el-footer>
                <el-row>
                    <el-col :span="4" :offset="10" style="text-align:center;margin-top:40px">
                        <el-button style="background-color:#9e0e00;color:#fff" @click="isOkSelect">确定</el-button>
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
            tableData:[],
            tableData3: [],
            //当前
            chooselistTable:[],
            //已经选中保存的id;
            changeChooseIdlist:[],        
            input2:'',
            loadDailg:true,
            tableDataCopy:[],
            isfirstBool:true,
            inputBoos:false,
            moneyType:true,
            channelListNext:[
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
            ],
            channelValue:'',
            pageConstant: {},
            pipelineIdValue:''
        }
    },
    created(){
        this.getDataList();
        this.getConstant();
    },
    props:["urlPorp","chooseIdlist",'filterType'],
    computed:{},
    methods:{
        selectable(row, index){
                return true;
        },        
        getConstant() {
            this.$http
                .get(this.$server.courseConstant)
                .then(res => {
                    res.content.courseTypeMap[0] = {name: "全部", value: -1};
                    res.content.courseStatusList= [{name: "全部", value: -1}].concat(res.content.courseStatusList);
                    this.pageConstant = res.content;
                })
                .catch(err => {
                    console.log(err);
                });
        },        
      getDataList(){ 
        this.changeChooseIdlist = this.chooseIdlist.concat();
        this.ajaxData();
      },
      selectAll(val){
        var self = this;
        var selectlist = [];
        self.chooselistTable = [];
        self.changeChooseIdlist = [];
        val.forEach(element => {
            selectlist.push(
                {
                    "content":element.id,
                    "courseName":element.title,
                    "no":'',
                    "type":2
                }
            );
            self.changeChooseIdlist.push(JSON.stringify(element.id));
        }); 
        self.chooselistTable = selectlist;      
      },
      handleSelectionChange(val,data) {
            var self = this;
            var selectlist =[];
            var bools = true;
            if(val.length){
                for (const iterator of val) {
                    if(iterator.id==data.id){
                        bools = true;
                    }else{
                        bools = false;
                    }
                
                }
            }else{
                bools = false;
            }
            val.forEach(element => {
                selectlist.push(
                    {
                        "content":element.id,
                        "courseName":element.title,
                        "no":'',
                        "type":2
                    }
                );
            });    
            selectlist.forEach((item,index)=>{
                var isIndex =self.changeChooseIdlist.indexOf(JSON.stringify(item.content));
                if(isIndex==-1){
                    self.chooselistTable.push(item);
                    self.changeChooseIdlist.push(JSON.stringify(item.content));
                }
            });    
            if(!bools){
                let list = [];
                self.chooselistTable.forEach((item,index)=>{
                        if(item.content!=data.id){
                            list.push(item)
                        }
                });
                var removeId = self.changeChooseIdlist.indexOf(JSON.stringify(data.id));
                if(removeId!=-1){
                    self.changeChooseIdlist.splice(removeId,1);
                }
                self.chooselistTable = list;
            }
        },
        closeCourseList(){
            this.chooselistTable = [];
            var selectListClose =[];
            this.tableDataCopy.forEach(element => {    
                selectListClose.push(
                    {
                        "content":element.id,
                        "courseName":element.title,
                        "no":'',
                        "type":2
                    }
                );
            });                
            var objs = {"bool":false,datas:selectListClose};                
            this.$emit('listSelect',objs);
             
        },      
        isOkSelect(){
            var newObs = [];
            var newObs1 = [];
            newObs = newObs.concat(this.chooselistTable)         
            var objs = {"bool":false,datas:newObs};
            this.$emit('listSelect',objs);
        },
        //搜索保存
        saveSeach(){
            var self = this;
                self.inputBoos = true;              
                self.ajaxData();
        },
        ajaxData(){
            var self = this;      
            self.loadDailg = true;
            var getAppInfo= function (){
                    var deferred = $.Deferred();
                        var paramsObj ={};
                        paramsObj={
                            // courseName:self.input2,
                            title:self.input2,
                            pageSize:10000,	
                            pageNo:1                            
                            // mtype:self.channelValue,
                            // pipelineId:self.pipelineIdValue
                        }
                        self.$http.get(self.urlPorp, { params:paramsObj })
                                    .then(res => {
                                        console.log(res)
                                        if (res.status === 200) {
                                            deferred.resolve(res.content.list);
                                        }
                        })
                        .catch(res => {
                            console.log(res)
                        });                        
                return deferred.promise();
            }
            $.when(getAppInfo())
                .done(function(data){
                    self.tableData = data;
                    //监听DOM渲染结束后在执行的回调函数；
                    self.$nextTick(function(){
                        if(self.tableData){
                            self.tableData.forEach((el,i)=>{
                                for (const iterator of self.changeChooseIdlist) {
                                    if(iterator==el.id){
                                        if(self.isfirstBool){
                                            self.tableDataCopy.push(self.tableData[i]);                                            
                                        }
                                        self.$refs.multipleTable.toggleRowSelection(self.tableData[i],true);
                                        break;
                                    }
                                }
                            });  
                            if(self.isfirstBool){
                                var selectlist = [];
                                self.tableDataCopy.forEach(element => {
                                    selectlist.push(
                                        {
                                            "content":element.id,
                                            "courseName":element.title,
                                            "no":'',
                                            "type":2
                                        }
                                    );
                                }); 
                                self.chooselistTable = selectlist;                                    
                            }                                                     
                        }
                        self.loadDailg=false;
                        self.isfirstBool = false;
                    })
                })
                .fail(function(){
                    //监听DOM渲染结束后在执行的回调函数；
                    self.$nextTick(function(){
                        self.loadDailg=false;
                    })                    
                    console.log("出错啦!")}
                    );          
            }        
        },
        watch:{
        },
    mounted() {
	}
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";

</style>

