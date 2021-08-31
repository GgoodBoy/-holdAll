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
            <!-- <div style="text-align: left;">
                <el-button size="mini" v-if="$authJudge('activity:cooperation:add')" :type="type==1?'primary':''" @click="sectionEven(1)">小节列表</el-button>
                <el-button size="mini" v-if="$authJudge('activity:cooperation:add')" :type="type==2?'primary':''" @click="sectionEven(2)">总结列表</el-button>
            </div>     -->
        </div>
        <div class="page-content">
            <div class="ixaojieHeader">
                <div>
                    <el-input style='width:200px;' v-model="title" :placeholder="type==1?'输入小节名称搜索':'输入总节名称搜索'"></el-input>
                    <el-button type="primary" @click="search()">查询</el-button>
                </div>
                <el-button type="primary" @click="newSection(1)">新建小节</el-button>
                <!-- <el-button type="primary" @click="newSection(2)">新建总结</el-button> -->
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
                        prop="periodName"
                        label="小节名称"
                        min-width="200"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        label="是否试看"
                        min-width="60"
                        align="center"
                        show-overflow-tooltip>
                            <template slot-scope="scope">    
                                {{scope.row.isTry==1?'试看':'非试看'}}                                         
                            </template> 
                    </el-table-column>                                      
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="50">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type='text' size="small" @click="edit(scope.row)">编辑</el-button>
                                    <el-button type='text' size="small" @click="setUpEven(scope.row)">设置</el-button>
                                    <el-button type='text' size="small" @click="setVersion(scope.row)">版本</el-button>
                                </div>                                              
                            </template>                    
                    </el-table-column>                                                
                </el-table>            
            </div>
        </div>
        <el-dialog
            title="设置"
            :visible.sync="setDialogVisible"
            :close-on-press-escape='false'
            :close-on-click-modal='false'
            width="30%"
            center
            >
            <div class="setCourse">
                <div class='radioCss'>
                    <div>是否试看</div>
                    <div class='radios'>
                        <el-radio-group v-model="isTry">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="2">否</el-radio>
                        </el-radio-group>                        
                    </div>
                </div>
                <div class='formDiv'>
                    <p>设置小剧场模块看完视频得小孚星数量</p>
                     <el-input style='width:200px;' v-model="moduleType1Star" placeholder="0-100的整数"></el-input>
                </div>
                <div class='formDiv'>
                    <p>设置藏书阁模块每跟读一句得小孚星数量</p>
                    <p>跟读全对得分</p>
                    <el-input style='width:200px;' v-model="moduleType2Star"  placeholder="0-100的整数"></el-input>
                    <p>跟读非全对得分</p>
                    <el-input style='width:200px;' v-model="moduleType2StarUnright"  placeholder="0-100的整数"></el-input>                    
                </div>
                <div class='formDiv'>
                    <p>设置大闯关模块每答对一题得小孚星数量</p>
                    <el-input style='width:200px;' v-model="moduleType3Star" placeholder="0-100的整数"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setCourseData">确 定</el-button>
            </span>
        </el-dialog>        
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
            courseId:'',


            //新版本迭代
            setDialogVisible:false,//设置弹框
            isTry:2,//试看
            moduleType1Star:10,
            moduleType2Star:10,
            moduleType2StarUnright:10,
            moduleType3Star:10
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
            // if(this.type==1){
                this.sectionList();
            // }else{
                // this.allSectionList();
            // }
        },
        // sectionEven(type){
        //     this.type=type;
        //     this.title = '';
        //     if(type==1){
        //         this.sectionList();
        //     }else{
        //         this.allSectionList();
        //     }
        // },
        setCourseData(){
            let self = this;
            let fxBool= true;
            let fxNum=[
                    {
                        data:self.moduleType1Star,
                        msg1:'小剧场内容有误,请输入范围0-100的数字',
                        msg2:'小剧场孚星数量范围0-100'
                    },
                    {
                        data:self.moduleType2Star,
                        msg1:'藏书阁跟读全对得分内容有误,请输入范围0-100的数字',
                        msg2:'藏书阁孚星数量范围0-100'
                    },
                    {
                        data:self.moduleType2StarUnright,
                        msg1:'藏书阁跟读非全对得分内容有误,请输入范围0-100的数字',
                        msg2:'藏书阁孚星数量范围0-100'
                    },
                    {
                        data:self.moduleType3Star,
                        msg1:'大闯关内容有误,请输入范围0-100的数字',
                        msg2:'大闯关孚星数量范围0-100'
                    }
                ];
            fxNum.forEach((element,index)=>{
                if(!/^\d+$/.test(Number(element.data))){
                    if(fxBool){
                        this.$message.error(element.msg1);
                    }
                    fxBool = false;
                }else if((Number(element.data) < 0 || Number(element.data) >100)&&element.data!==''){
                    if(fxBool){
                        this.$message.error(element.msg2);
                    }
                    fxBool = false;
                } else if(element.data===''){
                    if(fxBool){
                        this.$message.error('数据不能为空');
                    }
                    fxBool = false;
                }
            });
            if(!fxBool) return;
            let query = {
                isTry:this.isTry,
                moduleType1Star:this.moduleType1Star,
                moduleType2Star:this.moduleType2Star,
                moduleType2StarUnright:this.moduleType2StarUnright,
                moduleType3Star:this.moduleType3Star     
            };   
            //改为json,这个设置为true必填
            query["transformRequest"] = true; 
            let config = {
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            } 
            this.$http.post(this.$server.h5InteractSetPeriod+this.selectData.id,query,config).then(res=>{
                if(res.status==200){
                    this.sectionList();
                    this.setDialogVisible=false;  
               }
            })            
        },
        setVersion(data){
                this.$router.push({
                    path:`/H5WebView/H5SectionVersionNew`,
                    query:{
                        sectionId:JSON.stringify(data.id),
                        id:JSON.stringify(this.sectionData.id),
                        courseId:Number(this.courseId),
                        h5Id: this.id,
                        actionH5Id:this.sectionData.addressId,
                        type:2
                    }
                });            
        },
        setUpEven(data){
            this.selectData = data; 
            this.isTry=data.isTry;//试看
            this.moduleType1Star=data.moduleType1Star;
            this.moduleType2Star=data.moduleType2Star;
            this.moduleType3Star=data.moduleType3Star;  
            this.moduleType2StarUnright = data.moduleType2StarUnright;
            this.setDialogVisible=true;         
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
        // allSectionList(){
        //     let query = {
        //         params:{
        //             title:this.title||"",
        //             courseId:Number(this.id)
        //         }
        //     }             
        //     this.tableData=[]; 
        //     this.$http.get(this.$server.h5SummaryList,query).then(res=>{
        //         if(res.status==200){
        //            var listIds = [];
        //            var contentdate = res.content;
        //                 listIds = contentdate.map(function(element,index){
        //                     element.sortId = index+1;
        //                     return element;
        //                 });
        //             this.tableData = listIds;
        //             this.$nextTick(function(){
        //                 this.loading = false; 
        //             }) 
        //        }
        //     })            
        // },
        newSection(type){
            // if(type==1){
                console.log('this.id',this.id)
                this.$router.push({
                    path:`/H5WebView/H5CreatSectionNew`,
                    query:{
                        id:JSON.stringify(this.sectionData.id)||this.id,
                        courseId:Number(this.courseId),
                        h5Id: this.id,
                        actionH5Id:this.sectionData.addressId
                    }
                })                 
            // }else{
            //     this.$router.push({
            //         path:`/H5WebView/H5CreatAllSection`,
            //         query:{
            //             id:JSON.stringify(this.sectionData.id),
            //             // courseId:Number(this.id),
            //             courseId:Number(this.courseId),
            //             h5Id: this.id
            //         }
            //     }) 
            // }
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
            // if(this.type==1){
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
            // }else{
            //     this.$router.push({
            //         path:`/H5WebView/H5CreatAllSection`,
            //         query:{
            //             sectionId:JSON.stringify(data.id),
            //             id:JSON.stringify(this.sectionData.id),
            //             courseId:Number(this.courseId),
            //             h5Id: this.id
            //         }
            //     });
            // }
            
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
            .ixaojieHeader{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }
            .my-table{
                margin-top: 10px;
            }
            .block{
                text-align: center;
                margin-top:60px;
                padding-bottom:60px;
            }
        }  
        .setCourse{
            .formDiv{
                margin-bottom: 20px;
                p{
                    margin-bottom: 10px;
                }
            }
            .radioCss{
                margin-bottom: 20px;
                display:flex;
                flex-direction:row;
                align-items: center;
                justify-content: flex-start;
                >div{
                    margin-bottom:10px;
                    margin-right: 15px;
                }
            }
        }      
    }

</style>

