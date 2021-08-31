<template>
    <div>
        <el-container>
            <el-header>
                <el-row class="lLine40">
                    <el-col :span="4" class="lSize30-i">选择课程1</el-col>
                    <!-- v-show="courseType!='course'" -->
                    <el-col :span="2" :offset="18" @click.native="closeCourseList" class="lSize18-i">返回</el-col>
                    <!-- <i class="el-icon-close lSize18-i"></i> -->
                </el-row>
            </el-header>
            <el-main>
                <el-row class="lMarginTB20">
                    <el-col :span="8">               
                        <el-input
                        placeholder="   搜索课程标题"
                        suffix-icon="el-icon-search"
                        v-model="input2">
                        </el-input>
                    </el-col>
                    <el-col :span="3" :offset="13">已选择<span class="redFontColor">{{changeChooseIdlist.length}}</span>门课程</el-col>
                </el-row>
                <el-row>
                    <el-table
                        v-loading = "loadDailg"
                        ref="multipleTable"
                        :data="tableData"
                        maxHeight="500" 
                        tooltip-effect="dark"
                        style="width: 100%"
                        @select="handleSelectionChange">
                        <el-table-column
                        type="selection"
                        :selectable="selectable"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        prop="title"
                        label="名称">
                        </el-table-column>
                        <el-table-column
                        prop="sellingPrice"
                        label="价格"
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
            chooselistTable:[],
            changeChooseIdlist:[],
            input2:'',
            loadDailg:true,
            tableDataCopy:[],
            isfirstBool:true,
            inputBoos:false
        }
    },
    created(){
        this.getDataList();
    },
    props:["courseType","numbersBool","urlPorp","chooseIdlist","relevanceId","locaCourseIds"],
    computed:{},
    methods:{
      selectable(row, index){
          if(this.numbersBool==false){
              return true;
          }else{
            if(this.changeChooseIdlist.length <this.numbersBool){
                    return true;
                }
            return this.changeChooseIdlist.some(item=>Number(item)==row.id)
          }
      },
      getDataList(){ 
        var list=[];
        this.chooseIdlist.forEach((item,index)=>{
            if(typeof item=='string'){
                list.push(item);
            }else if(typeof item=='number'){
                list.push(JSON.stringify(item));
            }
        });          
        this.changeChooseIdlist = list.concat();
        this.ajaxData();
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
            
          if(this.courseType=="appHome"){
              this.$store.commit("appConfig/isOkOrAddEvent",objs)
          }else{
              this.$emit('listSelect',objs);
          }            
        },      
        isOkSelect(){
            var newObs = [];
            var newObs1 = [];
            newObs = newObs.concat(this.chooselistTable)         
            var objs = {"bool":false,datas:newObs};

          if(this.courseType=="appHome"){
              this.$store.commit("appConfig/isOkOrAddEvent",objs)
          }else{
              this.$emit('listSelect',objs);
          }



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
                            self.ajaxData();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }else{
                self.ajaxData();
            }

        },
        ajaxData(){
            var self = this;      
            self.loadDailg = true;
            var getAppInfo= function (){
                    var deferred = $.Deferred();
                    if(self.courseType=="course"){
                        self.$http.get(self.urlPorp+"&title="+self.input2)
                                    .then(res => {
                                        if (res.status === 200) {
                                            deferred.resolve(res.content);
                                        }
                        })
                        .catch(res => {
                            console.log(res)
                        });
                    }else{
                        self.$http.get(self.urlPorp, { params: {courseName:self.input2}})
                                    .then(res => {
                                        console.log(res)
                                        if (res.status === 200) {
                                            deferred.resolve(res.content);
                                        }
                        })
                        .catch(res => {
                            console.log(res)
                        });                        
                    }

                return deferred.promise();
            }
            $.when(getAppInfo())
                .done(function(data){
                    // self.tableData3 = data;
                    // self.totals = data.length;
                    // self.tableData = data.slice(0,self.pageAize);
                    self.tableData = data;
                    //监听DOM渲染结束后在执行的回调函数；
                    self.$nextTick(function(){
                        if(self.tableData){
                            self.tableData.forEach((el,i)=>{
                                // changeChooseIdlist
                                // for (const iterator of self.chooseIdlist) {
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
            input2(curVal,oldVal){
                var self = this;
                if(curVal!=oldVal){
                    var timeoutId = 0;
                        clearTimeout(timeoutId);
                        timeoutId = setTimeout(function () {
                            self.inputBoos = true;
                            self.saveSeach();
                        }, 1000);
                }
            }
        },
    mounted() {
    	// this.$refs.multipleTable.toggleRowSelection(this.tableData[2],true);
	}
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
.has-gutter th.el-table-column--selection .cell{
    display: none;
}
</style>

