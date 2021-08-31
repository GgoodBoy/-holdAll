<template>
    <div>
        <div>
            <Breadcrumb :menuList ='titleList' style="margin-bottom:20px"></Breadcrumb>
        </div>
        <div>
            <div>
                <span>添加课程:</span>
                <el-button class="lButtomOk lMarginTB50" @click="curseclick">选课</el-button>
            </div>
            <div>
                <el-table
                :data="tableData"
                border
                max-height="500"
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        label="名称"
                        align="center"
                        show-overflow-tooltip
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        label="类型"
                        align="center"
                        min-width="150"
                        >
                        <template slot-scope="scope">
                                {{scope.row.mtype==1?'成人':'少儿'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="sellingPrice"
                        label="价格"
                        align="center"
                        min-width="150"
                        :show-overflow-tooltip="true"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="pipelineName"
                        label="渠道"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="130"
                        >
                        <template slot-scope="scope">
                            <el-button type="text" v-if="$authJudge('expertplan:course:del')" @click="removeCourse(scope.row)">删除</el-button>    
                        </template>
                    </el-table-column>                                                                
                </el-table>
                <!-- <div class="block" style="text-align: center;background: #fff;padding: 15px 0;">
                    <el-pagination
                        layout="prev, pager, next"
                        @current-change="childPageValue"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
                </div>                              -->
            </div>
        </div>
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="false"
        width="35%"
        >
            <div class="centerCss">
                   <courseListPlugin v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="courseIdList" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>      
            </div>                    
        </el-dialog>  
    </div>
</template>
<script>
import Breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
export default {
    components:{
        Breadcrumb,
        // courseselect,
        courseListPlugin,
    },    
    data(){               
        return {          
            //新的项目
            tableData:[],
            loading:false,
            pageNo:1,
            pageSize:10,
            getData:'',
            isAdd:true,
            dialogVisibleFour:false,
            courseIdList:[],
            courseIdListCopy:[],
            // courseList:[],
            couserBool:false,
            disabledState:false,
            titleList:[
                {
                    name:'国学达人计划',
                    pathInfo:''
                },
                {
                    name:'成为达人课程设置',
                    pathInfo:''
                }
            ],
            varObj:{
                pageType:false,//是否分页
                mtypeText:true,//是否显示成人少儿分类
                coursrTitleStr:'talentShow',
                pipelineType:true               
            },
            urls:'/expertplan/getSelectCourseList',
            courseselectType:"talentShow",
    }},
    created(){   
        this.getStudylist();  
    },
    props:[],
    computed:{  },        
    methods:{    
            removeCourse(data){
                this.$confirm('确定要删除吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    this.$http.post(this.$server.getExpertDeleteCourses+data.id,{}).then(res=>{
                        if(res.status==200){
                            this.$message({
                                type:'success',
                                message:'删除成功'
                            })
                            this.getStudylist(1);
                        }
                    })                    
                }).catch(()=>{})
            }, 
            getStudylist(){
                var self = this;
                self.loading = true; 
                self.$http.get(self.$server.getExpertCoursesList,{}).then(res=>{
                if(res.status==200){
                    var listIds = [];
                    self.courseIdList =[];
                    self.courseIdListCopy=[];
                    var contentdate = res.content; 
                   if(contentdate.length){
                        listIds = contentdate.map(function(element,index){    
                                element.sortId = index+1;
                                return element;
                        });        
                        self.courseIdList = contentdate.map(x=>{
                            return x.courseId;
                        });   
                        self.courseIdListCopy = contentdate.map(x=>{
                            return x.courseId;
                        });  
                   }; 
                    self.tableData = listIds;
                    self.loading = false; 
                }
                })            
        },        
        //点击课程弹框
        curseclick(){
          this.dialogVisibleFour = true;
        },        
        //点击课程数据渲染
        listSelectEven(data){
            var self = this;
            if(data.bool){
                self.courseIdList = [];
                let list =[];
                let list2 =[];
                let list3 =[];
                self.dialogVisibleFour = false;
                data.datas.forEach(element => {
                    list.push(element.content);
                });
                list.forEach((element,index) => {
                    if(self.courseIdListCopy.indexOf(element)==-1){
                        list2.push(element);
                    }else{
                        list3.push(element);
                    }
                });
                self.courseIdList = list2.concat(list3);
                self.setTalentShowCourseId();
            }else{
                self.dialogVisibleFour = false;
            }
        },
        setTalentShowCourseId(){
            let self = this;
            let parems = {
                courseIds:self.courseIdList.toString()
            }
            this.$http.post(self.$server.getExpertAddCourses,parems).then(res=>{
                if(res.status==200){
                    self.getStudylist();
                }
            })            
        },
        // returnpage(){
        //     this.$router.push({path:"/xgxWisdom/indexxOne"});
        //     console.log("取消");
        // },
        formatDate(date){
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                // var h=date.getHours();
                // var m1=date.getMinutes();
                // var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;
                // return y+"/"+m+"/"+d+" "+h+":"+m1+":"+s;
                return y+"-"+m+"-"+d;
            }                               
    },
    watch: {}, 
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px; 
    margin-bottom: 10px;    
}
.headerDiv .inputtextarea .el-textarea__inner{
        min-height: 100px !important;
    } 
</style>


