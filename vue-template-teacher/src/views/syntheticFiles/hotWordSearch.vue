<template>
    <div>
        <gxHead :inputVals="inputBool" :headObj='headObj' v-on:dialogChange="addHotWorkList" @showHotEvent="showHotEvent" v-on:inputValPortEven="inputStateVal"></gxHead>
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
                        prop="name"
                        label="热词名称"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="mtypeName"
                        label="热词类型"
                        :show-overflow-tooltip='true'
                        align="center"
                        min-width="140">
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
                                <el-button v-if="($authJudge('hotword:edit')&&item1.type==1)||($authJudge('hotword:del')&&item1.type==2)" @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in tableObj.marksArrs" :key="i">{{item1.name}}</el-button>
                                <el-button v-if="$authJudge('hotword:setHot')" type="text" size="small" @click="handleClick(scope.row,3)">{{scope.row.type&&scope.row.type==1?'取消默认词':'设置默认词'}}</el-button>
                            </div>                                                                                 
                        </template> 
                    </el-table-column>                              
            </el-table>                
        </div>         
        <gxPaginaton :pageAtions ="pageAtion" v-on:childByPageValue="childPageValue"></gxPaginaton>
        <Dialog 
                :showFlag.sync="dialgObj.editsObj.showFlag"
                :title="dialgObj.editsObj.title"
                :cancelName="dialgObj.editsObj.cancelName"
                :sureName="dialgObj.editsObj.sureName"
                v-on:editObjNos="hotWorkditObjNo"
                v-on:editObjOks="hotWorkditObjOk">
                <el-row slot="dialog-body" class="lLine40">
                    <el-col :span="16" :offset="4" class="lCenter-r">
                        <el-input
                            placeholder="请输入编辑内容"
                            v-model="inputName">
                        </el-input>
                    </el-col>                                
                </el-row>
        </Dialog> 
        <Dialog 
                :showFlag.sync="dialgObj.removHotWork.showFlag"
                :title="dialgObj.removHotWork.title"
                :cancelName="dialgObj.removHotWork.cancelName"
                :sureName="dialgObj.removHotWork.sureName"
                v-on:removeObjNos="removeHotWorkNo"
                v-on:removeObjOks="removeHotWorkOk">
                <el-row slot="dialog-body" class="lLine30"> 
                    <el-col :offset="4" class="lSize14 redFontColor">确定要删除这个热搜词吗？</el-col>                                      
                </el-row>
        </Dialog> 
        <!-- :show-close='false' -->
        <el-dialog
            title=""
            :visible.sync="centerDialogVisible"
            :close-on-click-modal='false'
            :close-on-press-escape="false"
            width="30%"
            center>
            <div style="text-align: center;">
                <el-button @click="centerDialogVisibleEven(3)">成人版默认词</el-button>
                <el-button @click="centerDialogVisibleEven(4)">少儿版默认词</el-button>
            </div>
        </el-dialog>                       
    </div>
</template>
<script>
import gxHead from "@/components/formSynthesisPlugin/gxHead"; 
// import gxTable from "@/components/formSynthesisPlugin/gxTable";
import gxPaginaton from "@/components/formSynthesisPlugin/gxPaginaton";
import Dialog from "@/components/myDialog/myDialog"; 
import eventAction from '../lEventAtion';
let actions = new eventAction();
export default {
    components:{
        gxHead,
        // gxTable,
        gxPaginaton,
        Dialog
    },
    data(){return {
            inputBool:true,
            tableObj:{
                tableData:[],
                // 1.编辑，2.下架，3.详情，4.排序
                marksArrs:[
                        {name:"编辑",type:1},
                        {name:"删除",type:2},
                        {name:'设置默认词',type:3}
                    ],
                markState:true,
                loading:true,
                minWidth:100,
                types:'hotWork',
                power:[]               
            },
            pageAtion:{},
            headObj:{
                typeBoll:true,
                name:'hotWordName',
                title:'添加',
                power:[],
                inputBool:true                    
            },
            dialgObj:{
                    editsObj:{
                        showFlag:false, //是否显示遮罩弹框；
                        title:"编辑", //Dialog 的标题
                        cancelName:'editObjNos', //自定义取消事件名字
                        sureName:'editObjOks', //自定义确定事件名字,                        
                    },
                    removHotWork:{
                        showFlag:false, //是否显示遮罩弹框；
                        title:"温馨提示", //Dialog 的标题
                        cancelName:'removeObjNos', //自定义取消事件名字
                        sureName:'removeObjOks', //自定义确定事件名字,                        
                    }                                        
            },
            disabledState:false,          
            titleVal:'',
            inputName:'',//表示修改的内容；     
            pageSize:10,
            newPages:1,
            centerDialogVisible:false,
            selectData:'',
            newPage:1    
    }},
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        let flag = this.$getPermissions(routes,currentPath)
        if(!flag){
            flag = [];
        }
        var self = this
        self.tableObj.power = flag;
        self.headObj.power = flag;          
        this.showData({pageSize:self.pageSize ,page: 1});
    },
    props:{},
    computed:{},
    methods:{
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #F3F3F3;font-weight: 500;font-size: 16px;'
            }
        }, 
        //表头输入信息过滤
        inputStateVal(valobj){
            var self = this;  
            self.tableObj.loading = true;     
            this.titleVal =valobj.title; 
            this.showData({pageSize:self.pageSize ,page: 1,name:self.titleVal});
        },        
        //分页子组件传递给父组件的方法
        childPageValue(pageNum){
            var self = this;
            this.tableObj.loading = true;
            this.newPage = pageNum;
            //后期做接口字段过滤；
            this.showData({pageSize: self.pageSize,page: pageNum});
        },
        showData(paramsObj){
            var self = this;
            self.tableObj.loading = true;
            var url = "/hotword/index";  ///cms/hotword/index?page=1&pageSize=10
            actions.getData(url,paramsObj)
                .then(data => {
                    // let obhArr = actions.tableHead.hotWork;
                    // let endObj=actions.filterData(data,obhArr);
                    self.tableObj.tableData = data.items;
                    self.tableObj.tableData.forEach((item,index)=>{
                        item.sortId = (data.currentPage-1)*10+index+1;
                    })
                    // let listIds = data.items.map(function(element,index){
                    //         if(endObj.pageAtion.pageNum==1){
                    //             element.sortId = index+1;
                    //             return element;
                    //         }else if(endObj.pageAtion.pageNum>1){
                    //             element.sortId = (endObj.pageAtion.pageNum-1)*10+index+1;
                    //             return element;
                    //         }
                    //     });                    
                    // self.tableObj.tableData = endObj.tableObj.tableData;
                    // self.tableObj.tableData = listIds;
                    let temp = {
                        pageNum:data.currentPage,
                        pageSize:data.pageSize,
                        pageTotal:data.totalNum
                    }
                    if(temp.pageTotal>self.pageSize){
                        self.pageAtion['pageBool'] = false;
                    }else{
                        self.pageAtion['pageBool'] = true;
                    }
                    self.pageAtion = temp;
                    self.$nextTick(function(){
                            self.tableObj.loading = false; 
                    })   
                })
                .fail(function(){
                    self.pageAtion['pageBool'] = true;
                    self.$nextTick(function(){
                            self.tableObj.loading = false; 
                    })
                    }
                );

        },
        handleClick(e,f){
            this.Routerpage({id:e.id,type:f,data:e});
        },
        Routerpage(obj){
            this.tableObj.chooseID = obj.id;
            switch (obj.type) {
                case 1: 
                    this.dialgObj.editsObj.showFlag = true;
                    this.inputName = obj.data.name;
                    break;
                case 2:
                    this.dialgObj.removHotWork.showFlag = true;
                    break; 
                case 3:
                    // this.centerDialogVisible
                    // this.isSetHotWorkAction(obj);
                    console.log('obj',obj);
                    if(obj.data.type==1){
                        this.isSetHotWorkAction(obj,obj.data.mtype);
                    }else{
                        this.centerDialogVisible = true;
                        this.selectData  = obj;
                    }
                    break;                                  
                default:
                    break;
            }
        },       
        centerDialogVisibleEven(type){
            this.isSetHotWorkAction(this.selectData,type);
        },
        //确定设置热刺
        isSetHotWorkAction(obj,num){
                    let loadingInstance = this.$loading({
                        target:document.querySelector('.tableDiv')
                    });
                    let query = {
                        id:obj.data.id,
                        mtype:num
                    }
                    this.$http.post(`${this.$server.updateHotWordsType}`,query).then(res=>{
                        if(res.status==200){
                            this.centerDialogVisible = false;
                            this.selectData = '';
                            if(obj.data.type==1){
                                this.$message.success('默认词取消成功');
                            }else{
                                this.$message.success('默认词设置成功');
                            }
                            this.showData({pageSize:this.pageSize ,page: this.newPage});
                        }
                    }).finally(()=>{
                        loadingInstance.close()
                    })            
        },
        //编辑 
        hotWorkditObjNo(){
            this.dialgObj.editsObj.showFlag = false;
            this.inputName = '';
        },
        hotWorkditObjOk(){
            var self = this;
            self.tableObj.loading = true;
            var url = "/hotword/hotword/"+self.tableObj.chooseID;
            if(!self.disabledState){
                self.disabledState = !self.disabledState;
                actions.getData(url,{name:self.inputName},'post')
                    .then(data => {
                        self.disabledState = !self.disabledState;
                        self.dialgObj.editsObj.showFlag = false;
                        this.newPage = 1;
                        self.showData({pageSize:self.pageSize ,page: 1,name:self.titleVal});
                        self.inputName = '';
                        self.$nextTick(function(){
                                self.tableObj.loading = false; 
                        })   
                    })
                    .fail(function(data){
                        self.disabledState = !self.disabledState;
                        self.dialgObj.editsObj.showFlag = false;
                        self.$nextTick(function(){
                                self.tableObj.loading = false; 
                        }) 
                    }
                );
            }            
            
        },
        //添加
        addHotWorkList(name){
            var self = this;
            self.tableObj.loading = true;
            var url = "/hotword/hotword";
            if(!self.disabledState){
                self.disabledState = !self.disabledState;
                actions.getData(url,{name:name},'post')
                        .then(data => {
                            self.dialgObj.editsObj.showFlag = false;
                            self.disabledState = !self.disabledState;
                            self.showData({pageSize:self.pageSize ,page: 1});
                            self.inputBool = false;
                            self.$nextTick(function(){
                                self.inputBool = true;
                                self.tableObj.loading = false; 
                            })   
                        })
                        .fail(function(data){
                            self.disabledState = !self.disabledState;
                            self.dialgObj.editsObj.showFlag = false;
                            self.$nextTick(function(){
                                    self.tableObj.loading = false; 
                            })}
                        );                 
                }               
        },
        //删除
        removeHotWorkNo(){
            this.dialgObj.removHotWork.showFlag = false;
        },
        removeHotWorkOk(){
            var self = this;
             self.tableObj.loading = true; 
            var url = "/hotword/hotword/"+self.tableObj.chooseID;
            actions.getData(url,'',"delete")
                    .then(data => {
                        console.log("对",data)
                        self.dialgObj.editsObj.showFlag = false;
                        self.showData({pageSize:self.pageSize ,page: 1,name:self.titleVal});
                        self.$nextTick(function(){
                                self.tableObj.loading = false; 
                        })   
                    })
                    .fail(function(data){
                        self.$nextTick(function(){
                                self.tableObj.loading = false; 
                        }) }
                    );       



            this.dialgObj.removHotWork.showFlag = false;
        },
        showHotEvent(){
            this.$router.push('/searchHeat')
        }
    },
    mounted(){}
}
</script>
<style>
</style>

