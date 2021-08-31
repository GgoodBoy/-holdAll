<template>
    <div>
        <el-row :gutter="20">
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col :span="6" class="lRight-r">
                <el-input v-model.trim="title"
                    style="width:100%"
                    placeholder="输入账号/昵称查询"
                    class="search-form"
                    width="100%"
                    maxlength="20">
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-select v-model="type"
                    clearable
                    placeholder="类型">
                <el-option v-for="(item,i) in typeArr"
                        :key="i"
                        :label="item.name"
                        :value="item.value"></el-option>
            </el-select>
            </el-col>
            <el-col :span="2"><el-button class="redBackColor butColorF" @click="search">查询</el-button></el-col>  
            <el-col :span="2" :offset="10"><el-button class="redBackColor butColorF" @click="exportInfo">导出</el-button></el-col>              
        </el-row>
        <el-row class="lMarginTop20">
            <el-col>
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        prop="cellphone"
                        label="账号"
                        align="center"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        label="头像"
                        align="center"
                        min-width="80">
                        <template slot-scope="scope">
                            <div class="fl course-img">
                                <img :src="scope.row.avatar"
                                    alt="">
                            </div>
                        </template>                        
                    </el-table-column>                    
                    <el-table-column
                        prop="nickname"
                        label="昵称"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="courseProgress"
                        label="学习进度"
                        align="center"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="studyDurationText"
                        label="学习时长"
                        align="center"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="typeStr"
                        label="类型"
                        align="center"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="sellTimeAt"
                        label="购课时间"
                        align="center"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="注册时间"
                        align="center"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="lastLoginAt"
                        :show-overflow-tooltip="true"
                        label="最后一次登录"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>                                                                                 
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
                </div>                
            </el-col> 
        </el-row>        
    </div>
</template>
<script>
import Dialog from "@/components/myDialog/myDialog";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
const formatSeconds = value =>{
    let m = parseInt(value % 3600 / 60)
    let s = parseInt(value % 3600 % 60)
    let mStr = m<10?`0${m}`:m;
    let sStr = s<10?`0${s}`:s;
    let h = parseInt(value/3600)
    let hStr = h<10?`0${h}`:h;
    return `${h}:${m}′${s}″`
}
export default {
    components:{
        Dialog,
        breadcrumb
    },    
    data(){
        return {
            type:'',
            typeArr:[
                {name:'全部',value:0},{name:'试看',value:1},{name:'已购',value:2}
            ],
            tableData:[],
            loading:false,
            courseId:'',
            title:'',
            pageSize:10,
            pageNo:1,
            titleList:[
                        {
                            name:'课程',
                            pathInfo:'/courseCopy'
                        },
                        {
                            name:'课程管理',
                            pathInfo:'/courseCopy'
                        },
                        {
                            name:'课程进度',
                            pathInfo:''
                        }                
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            }            
        }
    },
    created(){  
        this.courseId = this.$route.query.selectId;
        this.getStudylist(1);     
    },
    props:[],
    computed:{    
    },     
    methods:{
        regularState(data){
            var regEn = new RegExp("[`~!@#$^&*%()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"),
                reg = /^(?!.*\\.*$)/,
                reg1 = /^(?!.*\/\.*$)/;
                if(regEn.test(data)||!reg.test(data)||!reg1.test(data)){   
                    return true;
                }else{
                    return false;
                }
        },        
        getStudylist(num){
            var self = this;
            if(self.title!=''){
                if(self.regularState(self.title)){
                    self.tableData = [];
                    self.pageAtion.pageTotal = 0;
                    self.pageAtion.paginationPage = 0;                
                    return;
                }
            }            
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            let query = {
                params:{
                    searchContent:self.title,
                    pageNo:self.pageNo,
                    pageSize:self.pageSize,
                    type:this.type==''?0:this.type
                }
            };
            self.$http.get(`${this.$server.courseCourseProgressNew}/${this.courseId}`,query).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                element.studyDurationText = formatSeconds(element.studyDuration)
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                element.studyDurationText = formatSeconds(element.studyDuration)
                                return element;
                            });                            
                        } 
                   };
                    self.tableData = listIds;
                    self.tableData.forEach(item=>{
                        item.typeStr = this.typeArr.find(option=>option.value==item.type).name
                    })
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
               }
                console.log(res);
            })            
        },  
        exportInfo(){
            var self = this;   
            var parems ={
                searchContent:encodeURIComponent(self.title),
                id:self.courseId,
                token:getToken()
            };    
            let type = this.type==''?0:this.type;         
            var url = self.$server.exportExcelcourseProgress+parems.id+"?searchContent="+parems.searchContent+'&type='+type+"&token="+parems.token;  
            window.open(url);   
        },         
        search(){
            this.getStudylist(1);
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        }             
    },
    watch: {}, 
    mounted(){}
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
</style>


