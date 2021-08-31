<template>
    <div>
        <gxHead :headObj='headObj' v-on:dialogChange="dialogChanges" v-on:inputValPortEven="inputStateVal"></gxHead>
        <gxTable :tableDatas="tableObj" v-on:pathRouterPage="Routerpage"></gxTable>
        <gxPaginaton :pageAtions="pageAtion" v-on:childByPageValue="childPageValue" ></gxPaginaton>
        <Dialog 
                :showFlag.sync="dialgObj.Revoke.showFlag" 
                :title="dialgObj.Revoke.title"
                :cancelName="dialgObj.Revoke.cancelName"
                :sureName="dialgObj.Revoke.sureName"
                v-on:RevokeNo="couponRevokeNo" 
                v-on:RevokeOk="couponRevokeOk">
                <span slot="dialog-body"></span>
                <el-row slot="dialog-body" class="lLine30">
                    <el-col :span="2" :offset="2" class="lRight-r">
                        <i class="el-icon-warning lSize30 redFontColor"></i>
                    </el-col>
                    <el-col class="lSize16 lLeft-r" :span="20">下架后将不再领取此优惠券，但不影响已领用户使用，确定要下架吗？</el-col>
                </el-row>
        </Dialog>
    </div>
</template>
<script>
import gxHead from "@/components/formSynthesisPlugin/gxHead"; 
import gxTable from "@/components/formSynthesisPlugin/gxTable";
import gxPaginaton from "@/components/formSynthesisPlugin/gxPaginaton"; 
import Dialog from "@/components/myDialog/myDialog";
import eventAction from '../../lEventAtion';
let actions = new eventAction()
export default {
    components:{
        gxHead,
        gxTable,
        gxPaginaton,
        Dialog
    },
    data(){
        return {
            //表格配置
            tableObj:{
                tableData:[],
                // 1.编辑，2.下架，3.详情，4.排序
                marksArrs:[
                    {name:"下架",type:2},
                    {name:"详情",type:3}
                    ],
                markState:true,
                loading:true,
                types:"activity",
                minWidth:100,
                chooseID:'',
                power:[]                
            },
            //分页
            pageAtion:{},
            //头部配置
            headObj:{
                typeBoll:true,
                name:'activity',
                title:'新建活动优惠券',
                listType:{
                    listValOne:[
                    {
                    value: 5,
                    label: '全部'
                    },
                    // {
                    // value: 1,
                    // label: '未开始'
                    // },
                     {
                    value: 2,  
                    label: '领取中'
                    },
                    //  {
                    // value: 3,
                    // label: '已领完'
                    // }, 
                    {
                    value: 4,
                    label: '已结束'
                    }                                           
                    ]
                },
                power:[],
                menuList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'活动优惠券系统',
                            pathInfo:''
                        }
                ]                
            },
            chooseState:'',
            titleVal:'',
            inputNum:'',
            titleDialog:false,
            //弹框配置
            dialgObj:{
                    Revoke:{
                        showFlag:false, //是否显示遮罩弹框；
                        title:"温馨提示", //Dialog 的标题
                        cancelName:'RevokeOk', //自定义取消事件名字
                        sureName:'RevokeNo', //自定义确定事件名字
                    }                
            },
            //课程新建单选
            radio:'1',
            pageSize:10
    }},
    created(){

        let routes = this.$router.options.routes;
        let currentPath = this.$route.path;
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }        
        var self = this
        self.tableObj.power = flag;
        self.headObj.power = flag;
        this.showData({pageSize:self.pageSize ,pageNo: 1});
    },
    props:{},
    computed:{},
    methods:{
        //表头输入信息过滤
        inputStateVal(valobj){
            var self = this;      
            self.tableObj.loading = true;
            this.chooseState =valobj.status!=5?valobj.status:''; 
            this.titleVal =valobj.title; 
            this.showData({pageSize:self.pageSize ,pageNo: 1,title:self.titleVal,status:self.chooseState});
        },
        //表格组件数据传递
        Routerpage(obj){
            this.tableObj.chooseID = obj.id;
            switch (obj.type) {
                case 2:
                    this.dialgObj.Revoke.showFlag = true;
                    break;
                case 3:
                    this.$router.push({path:'/marketelist/activity/activityDetails',query:{id:obj.id}});
                    break;                                
                default:
                    break;
            }
        },
        //分页子组件传递给父组件的方法
        childPageValue(pageNum){
            var self = this;
            this.tableObj.loading = true;
            //后期做接口字段过滤；
            this.showData({pageSize: self.pageSize,pageNo: pageNum,title:self.titleVal,status:self.chooseState});
        },
       showData(paramsObj){
            var self = this;
            var url = '/coupons/selectCouponsByTitleAndStatus';
            paramsObj["type"]=2;
            actions.getData(url,paramsObj)
                .then(data => {
                    let obhArr = actions.tableHead.activity;
                    let endObj=actions.filterData(data,obhArr,'activity');
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
                    // self.tableObj.tableData = endObj.tableObj.tableData;
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
                    })}
                );                  
        },
        //下架弹框
        couponRevokeNo(){
            var self = this;
            var url = "coupons/soldOut/"+this.tableObj.chooseID;
            actions.getData(url,'',"post").then(data=>{
                    this.dialgObj.Revoke.showFlag = false;
                    var paramsObj= {pageSize:self.pageSize ,pageNo: 1,title:self.titleVal,status:self.chooseState}
                    this.showData(paramsObj)
            })
        },
        couponRevokeOk(e){
           this.dialgObj.Revoke.showFlag = false;
        },
        dialogChanges(){
            this.$router.push({path:'/marketelist/activity/newActivity', query:'1'});
        }
    },
    watch: {
            radio(curVal,oldVal){
                this.radio = curVal;
            }
    },    
    mounted(){}
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
</style>

