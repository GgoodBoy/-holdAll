<template>
    <div>       
        <gxHead class="lMarginBO20" :headObj='headObj' v-on:inputValPortEven="inputStateVal"></gxHead>
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
                        prop="phone"
                        label="账号"
                        align="center"
                        :show-overflow-tooltip='true'
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="deviceType"
                        label="设备类型"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="phoneModel"
                        label="手机型号"
                        :show-overflow-tooltip='true'
                        align="center"
                        min-width="180">
                    </el-table-column> 
                    <el-table-column
                        prop="content"
                        label="反馈反馈内容日期"
                        :show-overflow-tooltip='true'
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="updatedAt"
                        label="反馈日期"
                        :show-overflow-tooltip='true'
                        align="center"
                        min-width="100">
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
                                <el-button v-if="$authJudge('admin:feedback:notread')&&scope.row.isRead==0&&item1.type==0" @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in tableObj.marksArrs" :key="i">{{item1.name}}</el-button>
                                <el-button class="fontColor" v-if="scope.row.isRead==1&&item1.type==1" @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in tableObj.marksArrs" :key="i">{{item1.name}}</el-button>
                            </div>                                                                                 
                        </template> 
                    </el-table-column>                              
            </el-table>                
        </div>                 
        <gxPaginaton :pageAtions="pageAtion" v-on:childByPageValue="childPageValue" ></gxPaginaton>
    </div>
</template>
<script>
import gxHead from "@/components/formSynthesisPlugin/gxHead"; 
// import gxTable from "@/components/formSynthesisPlugin/gxTable";
import gxPaginaton from "@/components/formSynthesisPlugin/gxPaginaton"; 
import eventAction from '../../lEventAtion';
// moneyRecord
let actions = new eventAction()
export default {
    components:{
        gxHead,
        // gxTable,
        gxPaginaton
    },
    data(){
        return {
            tableObj:{
                tableData:[],
                // 1.编辑，2.下架，3.详情，4.排序
                marksArrs:[                    
                    {name:"未读",type:0},
                    {name:"已读",type:1}
                    ],
                markState:true,//是否有操作栏
                loading:true,
                types:"bugreturn",
                minWidth:30,
                power:[]
            },
            pageAtion:{},
            headObj:{
                typeBoll:true,
                name:'bugsname',
                listType:{
                    listValOne:[{
                        value: 2,
                        label: '全部'
                        },{
                        value: 0,
                        label: '未读'
                        }, {
                        value: 1,
                        label: '已读'
                        }                                           
                    ]
                }
            },
            chooseStateOne:'',
            titleVal:'',
            pageSize:10
    }},
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }        
        this.tableObj.power = flag;  
        var self = this
        this.showData({pageSize:self.pageSize ,pageNo: 1,feedBackType: 2});        
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
        handleClick(e,f){
            this.Routerpage({id:e.id,type:f,data:e});
        },            
        //表头输入信息过滤
        inputStateVal(valobj){
            var self = this;      
            self.tableObj.loading = true;
            self.chooseStateOne = valobj.status!=2?valobj.status:"";
            self.titleVal = valobj.title;            
            var objParmises={
                pageSize:self.pageSize,
                pageNo: 1,
                phone:self.titleVal,//订单号
                isRead:self.chooseStateOne,//订单状态
                feedBackType: 2
            }
            this.showData(objParmises);
        },
        // //表格组件数据传递
        // Routerpage(id){
        //    this.$router.push({name:'couponDetails',query:{id:id}});
        // },
        //分页子组件传递给父组件的方法
        childPageValue(pageNum){
            var self = this;
            this.tableObj.loading = true;
            //后期做接口字段过滤；
            var objParmises={
                pageSize:self.pageSize,
                pageNo: pageNum,
                phone:self.titleVal,//订单号
                isRead:self.chooseStateOne,//订单状态
                feedBackType: 2
            }            
            this.showData(objParmises);
        },
       showData(paramsObj){
            var self = this;
            var url = '/feedback/selectPage';
            actions.getData(url,paramsObj)
                .then(data => {
                    let obhArr = actions.tableHead.daemonBug;
                    let endObj=actions.filterData(data,obhArr);
                    self.tableObj.tableData = endObj.tableObj.tableData;
                    self.pageAtion = endObj.pageAtion
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
                    }
                );                  
        },
        Routerpage(obj){
            var self = this;
            self.tableObj.chooseID = obj.id;
            switch (obj.type) {
                case 0: 
                    self.tableObj.loading = true;
                    actions.getData("/feedback/read/"+obj.id,"","post")
                        .then(data => {  
                            var objParmises={
                                    pageSize:self.pageSize,
                                    pageNo: 1,
                                    phone:self.titleVal,//订单号
                                    isRead:self.chooseStateOne,//订单状态
                                    feedBackType: 2
                            }            
                            this.showData(objParmises);                            
                        })
                        .fail(function(){                   
                            console.log("出错啦!")}
                    );                    
                    break;
                case 1:
                    // this.dialgObj.Revoke.showFlag = true;
                    console.log("已读无事件");
                    break;                             
                default:
                    break;
            }            
        }
    },
    watch: {},
    mounted(){}
}
</script>
<style>
</style>

