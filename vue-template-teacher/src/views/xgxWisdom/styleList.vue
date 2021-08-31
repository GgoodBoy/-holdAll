<template>
<div>
    <el-row>
        <el-col>
                <el-row class="lLine40 headerDiv">
                    <el-col class="lSize18">
                        <el-row class="lSize16">
                            <el-col class="lLeft-r">
                                <breadcrumb :menuList ='titleList'></breadcrumb>
                            </el-col>
                        </el-row>                
                    </el-col>
                    <el-col class="lRight-r lMarginTop20">
                        <el-row :gutter="20">
                            <el-col style="text-align: right;">
                                <el-button v-if="$authJudge('record:monthmember:export')" type="primary"  @click="telePhoneAdd">添加分类</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>        
        </el-col>
        <el-col class="lMarginTop20">
            <el-table
            :data="tableData"
            border
            style="width: 100%"
            v-loading="loading">
                <el-table-column
                    prop="sortId"
                    label="序号"
                    align="center"
                    min-width="30">
                </el-table-column>                                                                                         
                <el-table-column
                    prop="name"
                    label="分类"
                    align="center"
                    min-width="120">                                        
                </el-table-column>   
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="50"
                    >
                    <template slot-scope="scope">
                        <el-button type="text" @click='operation(2,scope.row)'>关联课程</el-button>  
                        <el-button type="text" @click='operation(1,scope.row)'>删除</el-button>                                                               
                    </template>
                </el-table-column>                                                                                
            </el-table>                             
        </el-col>
    </el-row>    
    <el-dialog
        title=""
        :visible.sync="specialTypeDetailOne"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        width="20%"
        class="lCenter-r">
            <div>
                <p>确定要删除这个分类吗？</p>
            </div>
            <div style='margin-top:20px;'>
                <el-button type="info" @click="closeDialog(1)">取消</el-button>
                <el-button type="primary" @click="submitDialog(1)">确认</el-button>
            </div>
    </el-dialog>
    <el-dialog
        title=""
        :visible.sync="specialTypeDetailTwo"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        width="20%"
        class="lCenter-r">
            <div>
                分类名称:<el-select v-model="inputDays" multiple placeholder="请选择">
                                <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select> 
            </div>
            <div style='margin-top:20px;'>
                <el-button type="info" @click="closeDialog(2)">取消</el-button>
                <el-button type="primary" @click="submitDialog(2)">确认</el-button>
            </div>
    </el-dialog>
    <el-dialog
    :visible.sync="specialTypeDetailThree"
    :close-on-press-escape='false'
    :close-on-click-modal="false"
    :show-close="false"
    width="35%"
    >
        <div class="centerCss">
                <courseListPlugin v-if="specialTypeDetailThree" :varObjs='varObj' :urlPorp="urls" :parentId="parentId" :chooseIdlist="courseIdList" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>      
        </div>                    
    </el-dialog>
</div>
</template>
<script>
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
export default {
        data(){
        return {
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            }, 
            pageSize:10,
            pageNo:1,
            title:'',
            inputDays:[],
            titleList:[
                    {
                        name:'国学智慧平台',
                        pathInfo:'/xgxWisdom/indexxOne'
                    },
                    {
                        name:'B端课程管理',
                        pathInfo:'/xgxWisdom/indexxOne'
                    },
                    {
                        name:'分类列表',
                        pathInfo:''
                    }              
            ],
            courseIdList:[],
            courseIdListCopy:[],
            urls:'/wisdomPlatform/relateCourse',
            courseselectType:"wisdomPlatform",
            parentId:'',
            varObj:{
                pageType:false,//是否分页
                mtypeText:true,//是否显示成人少儿分类
                coursrTitleStr:'wisdomPlatform',
                pipelineType:true         

            },
            options:[],
            tableData:[],
            specialTypeDetailOne:false,
            specialTypeDetailTwo:false,
            specialTypeDetailThree:false,
            loading:false,
            //新的项目参数
            id:'',
            selectData:'',
        };
        },
        created() {
            this.id = this.$route.query.id;
            this.getStudylist();
            this.selectTypeListData();
        },
        watch:{},         
        components:{
            breadcrumb,
            courseListPlugin
        },        
        methods: {     
            //点击课程数据渲染
            listSelectEven(data){
                var self = this;
                if(data.bool){
                    self.courseIdList = [];
                    let list =[];
                    let list2 =[];
                    let list3 =[];
                    self.specialTypeDetailThree = false;
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
                    self.specialTypeDetailThree = false;
                }
            },
            clonseList(){
                this.$http.post(this.$server.getDelBatchClassifies+this.selectData.id,{}).then(res=>{
                    if(res.status==200){
                        this.specialTypeDetailOne = false;
                        this.getStudylist();
                    }
                })                
            },
            setTalentShowCourseId(){
                var params = {
                    courseIds:this.courseIdList.toString()
                };
                this.$http.post(this.$server.getAddCourseClassifies+this.selectData.id,params).then(res=>{
                    if(res.status==200){
                        this.specialTypeDetailThree = false;
                        this.getStudylist();
                    }
                })                 
            },
            //弹框确定
            submitDialog(type){
                switch (type) {
                    case 1:
                        this.clonseList();
                        break;
                    case 2:
                        this.addDaysEven();
                        break;
                    case 3:
                        this.addDaysEven();
                        break;
                    default:
                        break;
                }
            },
            selectTypeListData(){
                    let self = this;
                    var query = {
                        params:{
                            name:'',
                            pageSize:9999,
                            pageNo:1,
                            batchId:this.id
                        }          
                    };
                    self.$http.get(self.$server.getClassifiesList,query).then(res=>{
                    if(res.status==200){
                        var contentdate = res.content;
                        self.options = contentdate.list;
                    }
                })
            },
            //弹框取消
            closeDialog(type){
                switch (type) {
                    case 1:
                        this.specialTypeDetailOne = false; 
                        break;
                    case 2:
                        this.specialTypeDetailTwo = false;
                        break;
                    case 3:
                        this.specialTypeDetailThree = false;
                        break;
                    default:
                        break;
                }
            },      
            //追加天数接口
            addDaysEven(){
                var params = {
                    classifiesIds:this.inputDays.toString(),
                    batchId:this.id
                };
                this.$http.post(this.$server.getBatchClassifies,params).then(res=>{
                    if(res.status==200){
                        this.specialTypeDetailTwo = false;
                        this.inputDays=[];
                        this.getStudylist();
                    }
                })                 
            },
            //表单操作
            operation(type,data){
                this.selectData = data;
                switch (type) {
                    case 1:
                        this.specialTypeDetailOne = true;
                        break;
                    case 2:
                        this.parentId = data.batchId;
                        this.courseIdList = data.courseIds;
                        this.specialTypeDetailThree = true;
                        break;
                    default:
                        break;
                }
            },
            formatDate(date,type){
                if(date){
                    date = new Date(date);
                    var y=date.getFullYear();
                    var m=date.getMonth()+1;
                    var d=date.getDate();
                    var h=date.getHours();
                    var m1=date.getMinutes();
                    var s=date.getSeconds();
                    m = m<10?("0"+m):m;
                    d = d<10?("0"+d):d;
                    if(type=="end"){
                        h = 23;
                        m1 = 59;
                        s = 59;                
                    }else{
                        h = h<10?("0"+h):h;
                        m1 = m1<10?("0"+m1):m1;
                        s = s < 10 ? ("0" + s) : s;
                    }
                    return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
                }else{
                    return '';
                }
            },     
            //添加
            telePhoneAdd(){
                this.specialTypeDetailTwo = true;
            },               
            searchMemberQuery(){
                this.getStudylist();
            },
            getStudylist(){
                var self = this;
                // self.loading = true; 
                self.$http.get(self.$server.getBatchClassifiesList+self.id,{}).then(res=>{
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
        proving1(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.title)){
                this.title='';
            }
        }           
    }
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
.testCellphone{
    top: 3px;
    right: 0;
    background: #9E0E00;
    color: #fff;
    font-size: 10px;
    padding: 3px;
    line-height: 11px;
    border-radius: 10px;    
}.has-gutter th.el-table-column--selection .cell{
    display: block;
}
.userTelePhone .listCourse{
            width: 250px;
            max-height: 250px;
            overflow: auto;
}
.userTelePhone .listCourse .lLine40{
            border:1px solid #9E0E00;
            margin: 5px 0;
}
.userTelePhone .listCourse .lLine40 i{
        font-weight:bold;
        cursor: pointer;
}
.userTelePhone .listCourse .lLine40 .lPaddingRF10{
                color: #9E0E00;
                text-align: left;
}
</style>


