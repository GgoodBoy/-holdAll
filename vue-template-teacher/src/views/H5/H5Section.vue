<template>
    <div class="H5-section-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <div class="page-h5-section">
                <div class="h5-section-left">
                    <div class="one">
                        <img :src="sectionData.backgroundImg"/>
                    </div>
                    <div class="two">
                        <div>{{sectionData.courseName}}</div>
                        <div>价格：{{sectionData.sellingPrice}}  夫子币</div>
                    </div>
                </div>
                <div class="h5-section-right">
                    <div @click='editEven'>编辑</div>
                    <div>共{{sectionData.periodNum}}节，已更新{{sectionData.auditPassNum}}节</div>
                </div>
            </div>
            <div style="text-align: left;">
                <el-button size="mini" v-if="$authJudge('activity:cooperation:add')" :type="type==1?'primary':''" @click="sectionEven(1)">小节列表</el-button>
                <el-button size="mini" v-if="$authJudge('activity:cooperation:add')" :type="type==2?'primary':''" @click="sectionEven(2)">总结列表</el-button>
            </div>    
        </div>
        <div class="page-content">
            <div>
                <el-input style='width:200px;' v-model="title" :placeholder="type==1?'输入小节名称搜索':'输入总节名称搜索'"></el-input>
                <el-button type="primary" @click="search()">查询</el-button>
                <el-button type="primary" @click="newSection(1)">新建小节</el-button>
                <el-button type="primary" @click="newSection(2)">新建总结</el-button>
            </div>
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="40"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        v-if="type==1"
                        prop="periodName"
                        label="小节名称"
                        min-width="200"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        v-if="type==2"
                        prop="summaryName"
                        label="总结名称"
                        min-width="200"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        v-if="type==2"
                        prop="sortNum"
                        label="关联小节"
                        min-width="60"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>    
                    <el-table-column
                        v-if="type==2"
                        prop="countSortNum"
                        label="题数"
                        min-width="60"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>                                      
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="50">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type='text' size="small" @click="edit(scope.row)">编辑</el-button>
                                </div>                                              
                            </template>                    
                    </el-table-column>                                                
                </el-table>            
            </div>
        </div>
    </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            titleList:[],
            sectionData:{
                backgroundImg:'',
                activityId:'',
                courseName:'',
                sellingPrice:'',
                periodNum:'',
                auditPassNum:'',
                id:''
            },
            name:"",
            tableData:[],
            loading:false,
            title:'',
            id:'',
            type:1,
            courseId:''
        };
    },
    components: {
        breadcrumb
    },
    watch: {},
    created() {
        // this.id = this.$route.query.id;
        // let courseId = this.$route.query.courseId;
        this.id = this.$route.params.id;
        this.courseId = this.$route.params.courseId;
        this.titleList=[
            {
                name:'H5课程管理',
                pathInfo:''
            },   
            {
                name:'H5课程',
                pathInfo:'/H5WebView/index'
            },
            {
                name:'创建H5课程',
                pathInfo:'/H5WebView/H5Creat/'+this.courseId
            },
            {
                name:'H5课程详情页',
                pathInfo:''
            }               
        ];        
        this.getSectionManger();
        this.sectionList();
    },
    methods: { 
        search(){
            if(this.type==1){
                this.sectionList();
            }else{
                this.allSectionList();
            }
        },
        sectionEven(type){
            this.type=type;
            this.title = '';
            if(type==1){
                this.sectionList();
            }else{
                this.allSectionList();
            }
        },
        sectionList(){
            let query = {
                params:{
                    title:this.title||"",
                    courseId:Number(this.id)
                }
            }     
            this.tableData=[];        
            this.$http.get(this.$server.h5PeriodList,query).then(res=>{
                if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                        listIds = contentdate.map(function(element,index){
                            element.sortId = index+1;
                            return element;
                        });
                    this.tableData = listIds;
                    this.$nextTick(function(){
                        this.loading = false; 
                    }) 
               }
            })            
        },
        allSectionList(){
            let query = {
                params:{
                    title:this.title||"",
                    courseId:Number(this.id)
                }
            }             
            this.tableData=[]; 
            this.$http.get(this.$server.h5SummaryList,query).then(res=>{
                if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                        listIds = contentdate.map(function(element,index){
                            element.sortId = index+1;
                            return element;
                        });
                    this.tableData = listIds;
                    this.$nextTick(function(){
                        this.loading = false; 
                    }) 
               }
            })            
        },
        newSection(type){
            if(type==1){
                this.$router.push({
                    path:`/H5WebView/H5CreatSectionNew`,
                    query:{
                        id:JSON.stringify(this.sectionData.id),
                        courseId:Number(this.courseId),
                        h5Id: this.id,
                        actionH5Id:this.sectionData.addressId
                    }
                })                 
            }else{
                this.$router.push({
                    path:`/H5WebView/H5CreatAllSection`,
                    query:{
                        id:JSON.stringify(this.sectionData.id),
                        // courseId:Number(this.id),
                        courseId:Number(this.courseId),
                        h5Id: this.id
                    }
                }) 
            }
        },
        getSectionManger(){
            this.$http.get(this.$server.h5Course+this.id).then(res=>{
                if(res.status==200){
                    this.sectionData.backgroundImg=res.content.backgroundImg;
                    this.sectionData.activityId=res.content.activityId;
                    this.sectionData.courseName=res.content.courseName;
                    this.sectionData.sellingPrice=res.content.sellingPrice;
                    this.sectionData.periodNum=res.content.periodNum;
                    this.sectionData.auditPassNum=res.content.auditPassNum;
                    this.sectionData.id=res.content.id;
                    this.sectionData.addressId=res.content.addressId;
                }
            })            
        },
        editEven(){
                    this.$router.push({
                        path:`/H5WebView/H5CreatCourse`,
                        query:{
                            id:this.id,
                            activityId:this.courseId
                        }
                    }); 
        },
        edit(data){
            if(this.type==1){
                this.$router.push({
                    path:`/H5WebView/H5CreatSectionNew`,
                    query:{
                        sectionId:JSON.stringify(data.id),
                        id:JSON.stringify(this.sectionData.id),
                        courseId:Number(this.courseId),
                        h5Id: this.id,
                        actionH5Id:this.sectionData.addressId
                    }
                });
            }else{
                this.$router.push({
                    path:`/H5WebView/H5CreatAllSection`,
                    query:{
                        sectionId:JSON.stringify(data.id),
                        id:JSON.stringify(this.sectionData.id),
                        courseId:Number(this.courseId),
                        h5Id: this.id
                    }
                });
            }
            
        },
        /**
         * 获取列表数据
         */
        getCooperationPlatformList(){
            this.loading = true;
            let query = {
                params:{}
            }
            if(this.name.length>0){
                query.params.name = this.name
            }
            this.$http.get(this.$server.getCooperationPlatformList,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.tableData = res.content.list.map(item=>{
                        item.relevance = item.pcrList.map(option=>{
                            return option.courseName
                        }).join(',')
                        item.stateText = item.state==1?'已下架':'已上架'
                        return item;
                    })
                    this.total = res.content.total;
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
    .H5-section-wrap {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-header{
            margin-bottom: 20px;
            .page-h5-section{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                padding:20px 0;
                margin: 20px 0;
                font-size:14px;
                .h5-section-left{
                    display: flex;
                    flex-direction:row;
                    justify-content: space-between;       
                    .one{
                        width:100px;
                        height: 70px;
                        img{
                            width:100%;
                            height: 100%;
                        }
                    }  
                    .two{
                        display: flex;
                        flex-direction:column;
                        justify-content: space-between;    
                        padding:0 20px; 
                        div:nth-child(2){  
                            color:#ccc;  
                        }                   
                    }           
                };
                .h5-section-right{
                    display: flex;
                    flex-direction:column;
                    justify-content: space-between;  
                    div:nth-child(1){
                        cursor: pointer;
                    }  
                    div:nth-child(2){
                        color:#ccc;
                    }
                };
            }
        }
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            padding:10px;
            .my-table{
                margin-top: 10px;
            }
            .block{
                text-align: center;
                margin-top:60px;
                padding-bottom:60px;
            }
        }        
    }

</style>

