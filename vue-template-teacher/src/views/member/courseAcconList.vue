<template>
    <div class="courseFlexBox">
        <el-container>
            <!-- <el-row class="lLine40">
                <el-col :span="4" class="lSize24-i">选择课程</el-col>
            </el-row> -->
            <el-main>               
                <el-row class="lMarginTB10">
                    <el-col class="courseAccStyle" :span="18">     
                        <el-input
                        placeholder="输入课程名称查询"
                        suffix-icon="el-icon-search"
                        style="width:100%"
                         @keyup.native="proving1"
                        v-model="input2">
                        </el-input>
                        <el-button style="background-color:#9e0e00;color:#fff;margin-left:10px;" @click.native="saveSeach">搜索</el-button>
                    </el-col>
                    <el-col :span="6" class="lRight-r">已选择<span class="redFontColor">{{multipleSelection.length}}</span>门课程</el-col>
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
                        max-width="100"
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
                    <el-col style="text-align:center;margin-top:20px">
                        <el-button style="background-color:#fff;color:#ccc" @click.native="closeCourseList">取消</el-button>
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
    props:["urlPorp","chooseIdlist"],
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
                            if(el.id==objs.id){
                                index = i;
                            }
                    });
                    self.multipleSelection.splice(index, 1);
                }                              
            }
        },
        closeCourseList(){
            var objs = {"bool":false,datas:this.initTableDataList};
            this.$emit('listSelect',objs);
                      
        },      
        isOkSelect(){
            var objs = {"bool":false,datas:this.changeSelectList};
            this.$emit('listSelect',objs);
            this.input2 = '';
          
        },
        //搜索保存
        saveSeach(){
            var self = this;
                self.ajaxData();
        },
        proving1(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.title)){
                this.title='';
            }
        },        
        ajaxData(){
            var self = this;      
            self.loadDailg = true;
            var getAppInfo= function (){
                    var deferred = $.Deferred();
                        var paramsObj ={};
                        paramsObj={
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
                    self.tableData = data;
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
                    console.log("出错啦!")}
                    );          
            }        
        },
        watch:{
            // input2(curVal,oldVal){
            //     var self = this;
            //     if(curVal!=oldVal){
            //         var timeoutId = 0;
            //             clearTimeout(timeoutId);
            //             timeoutId = setTimeout(function () {
            //                 self.saveSeach();
            //             }, 1000);
            //     }
            // }
        },
    mounted() {
    	
	}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.has-gutter th.el-table-column--selection .cell{
    display: none;
}
.courseAccStyle{
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
}
</style>

