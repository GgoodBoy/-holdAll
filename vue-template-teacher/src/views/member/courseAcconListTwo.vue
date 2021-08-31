<template>
    <div>
        <el-container>
            <el-row class="lLine40">
                <el-col :span="4" class="lSize24-i">选择课程</el-col>
                <!-- v-show="courseType!='course'" -->
                <el-col :span="2" :offset="18" @click.native="closeCourseList" class="lSize18-i">返回</el-col>
                <!-- <i class="el-icon-close lSize18-i"></i> -->
            </el-row>
            <el-main>
                <el-row class="lMarginTB10">
                    <el-col :span="8">               
                        <el-input
                        placeholder="   搜索课程标题"
                        suffix-icon="el-icon-search"
                        v-model="input2">
                        </el-input>
                    </el-col>
                    <el-col :span="4" :offset="12">已选择<span class="redFontColor">{{multipleSelection.length}}</span>门课程</el-col>
                </el-row>
                <el-row>
                    <el-table
                        v-loading = "loadDailg"
                        ref="multipleTable"
                        :data="tableData"
                        maxHeight="500" 
                        tooltip-effect="dark"
                        style="width: 100%"
                        @select="handleSelections">
                        <el-table-column
                        
                        :selectable="selectable"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        prop="title"
                        max-width="300"
                        label="名称">
                        </el-table-column>
                        <el-table-column
                        max-width="300"
                        label="价格">
                            <template slot-scope="scope">
                                <P>{{scope.row.sellingPrice||scope.row.price}}</P>
                            </template>                        
                        </el-table-column>                        
                    </el-table>                    
                </el-row>
            </el-main>
            <el-footer>
                <el-row>
                    <el-col :span="4" :offset="10" style="text-align:center;margin-top:20px">
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
            multipleSelection:[],
            initChooseIdlist:[],
            input2:'',
            loadDailg:true,
            initTableDataList:[],
            isfirstBool:true,
            changeSelectList:[]

        }
    },
    created(){
        this.getDataList();
    },
    props:["urlPorp","chooseIdlist","InitIdlist",'courseselectPlugin'],
    computed:{},
    methods:{
      selectable(row, index){
              return true;
      },
      getDataList(){           
        this.initChooseIdlist = this.chooseIdlist.concat();
        this.ajaxData();
      },
      handleSelections(valList,selectVal){
            var self = this;
            var selectlist =[];
            self.isHashList(valList,selectVal);
            self.multipleSelection.forEach(element => {
                selectlist.push(
                    {
                        "id":element.id,
                        "title":element.title
                    }
                );
            });
            self.changeSelectList = selectlist;
      },
        //对比当前列表是否包含已选择的数据；
        isHashList(list,objs){
            var self= this;
            // self.multipleSelection = list;
            var idbool = false;
            var isHavebool = false;        
            for (const iterator of list) {
                if(iterator.id==objs.id){
                    idbool = true;
                }
            }
            for (const iterator of this.multipleSelection) {
                if(iterator.id==objs.id){
                    isHavebool = true;
                }
            }            
            if(idbool){
                if(!isHavebool){
                    this.multipleSelection.unshift(objs)
                }
            }else{  
                if(isHavebool){
                    var index = '';
                    self.multipleSelection.forEach((el,i)=>{
                            if(el==objs.id){
                                index = i;
                            }
                    });
                    self.multipleSelection.splice(index, 1);
                }                              
            }
        },
        closeCourseList(){
            var objs = {"bool":false,datas:this.initTableDataList,but:'close'};
            this.$emit('listSelect',objs);
                      
        },      
        isOkSelect(){
            var objs = {"bool":false,datas:this.changeSelectList,but:'isok'};
            this.$emit('listSelect',objs);
          
        },
        //搜索保存
        saveSeach(){
            var self = this;
                self.ajaxData();
        },
        // proving1(){
        //     var self = this;
        //     var reg = /^(?!.*\\.*$)/;
        //     if(!reg.test(self.input2)){
        //         this.input2='';
        //     }
        // },         
        ajaxData(){
            var self = this;      
            self.loadDailg = true;
            var getAppInfo= function (){
                    var deferred = $.Deferred();
                        var paramsObj ={};
                        // if(Number(self.varObjs.mtype)>0){
                        //     paramsObj={
                        //         title:self.input2||"",
                        //         type:Number(self.varObjs.mtype)
                        //     }
                        // }else{
                        //     paramsObj={
                        //         courseName:self.input2
                        //     }                            
                        // }
                        paramsObj={
                            // title:encodeURIComponent(self.input2)
                            title:self.input2
                        }                         
                        self.$http.get(self.urlPorp, { params:paramsObj })
                                    .then(res => {
                                        if (res.status === 200) {
                                            deferred.resolve(res.content);
                                        }
                        })
                        .catch(res => {
                            console.log(res)
                        });                        
                    

                return deferred.promise();
            }
            $.when(getAppInfo())
                .done(function(data){
                    function filterData(age){
                        return self.InitIdlist.indexOf(age.id)==-1;
                    }
                    self.tableData = data.filter(filterData);
                    //监听DOM渲染结束后在执行的回调函数；
                    self.$nextTick(function(){
                        if(self.tableData){
                            self.tableData.forEach((el,i)=>{
                                //第一次进入列表
                                if(self.isfirstBool){
                                    for (const iterator of self.initChooseIdlist) {
                                        if(iterator==el.id){
                                            self.multipleSelection.push(self.tableData[i]);
                                            self.initTableDataList.push(self.tableData[i]);
                                            self.$refs.multipleTable.toggleRowSelection(self.tableData[i],true);
                                        }
                                    }
                                }else{
                                    for (const iterator of self.multipleSelection) {
                                        if(iterator.id==el.id){
                                            self.$refs.multipleTable.toggleRowSelection(self.tableData[i],true);
                                        }
                                    }                                        
                                }
                            });                            
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
                    }
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
                            self.saveSeach();
                        }, 1000);
                }
            },
            courseselectPlugin(curVal,oldVal){
                this.tableData=[]
                this.multipleSelection=[]
                this.initChooseIdlist=[]
                this.input2=''
                this.loadDailg=true
                this.initTableDataList=[]
                this.isfirstBool=true
                this.changeSelectList=[], 
                this.getDataList();      
            }
        },
    mounted() {}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.has-gutter th.el-table-column--selection .cell{
    display: none;
}
</style>

