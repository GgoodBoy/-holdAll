<template>
    <div>
        <!-- <gxBreadcrumb></gxBreadcrumb> -->
        <breadcrumb :menuList ='titleList' class="lMarginTB20"></breadcrumb>
        <!-- <gxTable :tableDatas="tableObj"></gxTable> -->
        <div>
            <el-table
                :data="tableObj.tableData"
                border
                v-loading="tableObj.loading"
                max-height="600"
                style="width: 100%">               
                    <el-table-column
                        prop="msgType"
                        label="分类"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="userPhone"
                        label="账户"
                        align="center"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="sendType"
                        label="发送类型"
                        align="center"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="content"
                        :show-overflow-tooltip="true"
                        label="消息内容"
                        align="center"
                        min-width="160">
                    </el-table-column>
                    <el-table-column
                        label="发送时限"
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <p>{{scope.row.msgSendType==1?'即时发送':'定时发送'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="updatedAt"
                        label="发送时间"
                        align="center"
                        width="180">
                    </el-table-column> 
            </el-table>                
        </div>                
        <gxPaginaton :pageAtions ="pageAtion" v-on:childByPageValue="childPageValue"></gxPaginaton>        
    </div>
</template>
<script>
import gxTable from "@/components/formSynthesisPlugin/gxTable";
// import gxBreadcrumb from "@/components/formSynthesisPlugin/gxBreadcrumb"; 
import gxPaginaton from "@/components/formSynthesisPlugin/gxPaginaton";  
import eventAction from '../../lEventAtion';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
let actions = new eventAction();
export default {
    components:{
        gxTable,
        // gxBreadcrumb,
        gxPaginaton,
        breadcrumb
    },    
    data(){
        return {
            tableObj:{
                tableData:[],
                // 1.编辑，2.下架，3.详情，4.排序
                markState:false,
                loading:true,
                power:[]
            },
            pageAtion:{},
            detailsId:'',
            chooseState:'',
            titleVal:'',
            pageSize:10,
            titleList:[
                {
                    name:'APP管理系统',
                    pathInfo:'/backstage/inside'
                },
                {
                    name:'站内信',
                    pathInfo:'/backstage/inside'
                },
                {
                    name:'历史记录',
                    pathInfo:''
                }                                               
            ]            
    }},
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }        
        this.tableObj.power = flag;
        var self= this;
        this.showData({pageSize:self.pageSize ,pageNo: 1});
    },
    props:{},
    computed:{},
    methods:{     
        //分页子组件传递给父组件的方法
        childPageValue(pageNum){
            var self= this;
            self.tableObj.loading = true;
            self.showData({pageSize: self.pageSize,pageNo: pageNum,userPhone:self.titleVal,used:self.chooseState,id:self.detailsId});
        },   
       showData(paramsObj){
            var self = this;
            var url = "/message/getHistory";
            actions.getData(url,paramsObj)
                .then(data => {
                    let obhArr = actions.tableHead.history;
                    let endObj=actions.filterData(data,obhArr,'historyRecord');
                    self.tableObj.tableData = endObj.tableObj.tableData;
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
                    })}
                );

        }               
    },
    mounted(){}
}
</script>
<style>
</style>

