<template>
    <div>
        <div class="page-header">
            <el-row :gutter="20">
                <el-col :span="9">
                   <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
                <el-col :span="6" class="lRight-r" :offset="7">
                    <el-input v-model.trim="title"
                        style="width:100%"
                        placeholder="请输入标签查询"
                        class="search-form"
                        width="100%"
                        maxlength="20">
                    </el-input>
                </el-col>
                <el-col :span="2"><el-button class="redBackColor butColorF" @click="seach(1)">查询</el-button></el-col>                
            </el-row>
        </div>
        <div class="lableListBox">
            <el-row :gutter="20"> 
                <el-col :span="3" v-for="(item,index) in selectLableList" :key="index" class="lableChildCss">
                   <div class="lableCss lLine40 redBackColor butColorF lCenter-r lSize18">
                       {{item.name}}
                       <i class="el-icon-circle-close" v-if="$authJudge('course:course:del')" @click="removeSelectLable(item,index)"></i>
                    </div>
                </el-col>               
            </el-row>            
        </div>   
        <div class="lableAllListBox" @scroll="loadingMore" v-loading="loadingOne">
            <el-row :gutter="20">
                <el-col :span="3" v-for="(item,index) in lableAllList" :key="index" class="lableChildCss" :class="{ 'activeCss1': isActive,'activeCss2': !isActive }">
                   <div class="lableCss lLine40 grayback butColorF lCenter-r lSize18" @click="selectListLable(item)">
                       {{item.name}}
                    </div>
                </el-col>               
            </el-row>            
        </div> 
        <el-row :gutter="20">
            <el-col :span="12" :offset="6" class="lCenter-r">
                <el-button @click="removeLabel()">取消</el-button>
                <el-button v-if="$authJudge('course:course:addlabel')" class="redBackColor butColorF" @click="addCourseLabel()">确定</el-button>
            </el-col>
        </el-row>                   
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            title:'',
            listSelectData:'',
            listData:'',
            loadingOne:false,
            pageNo:1,
            courseId:'',
            pageSize:88, 
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            isActive:false,
            scorllBool:true,
            selectLableList:[],
            mtype:1,
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
                            name:'课程标签',
                            pathInfo:''
                        }
                ],             
            lableAllList:[]             
        };
    },
    components:{
        breadcrumb
    },    
    metaInfo: {},
    created() {
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path;
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }        
        this.power = flag; 
        this.courseId = this.$route.query.selectId;
        this.mtype = this.$route.query.mtype;
        this.getCourseSelectLabel();
        this.getCourseAllLabel(1,false);
    },
    methods: {   
        seach(){
            this.getCourseAllLabel(1,false);
        },
        removeLabel(){
            var self = this;
            self.$router.push({path:'/courseCopy'});               
        },
        addCourseLabel(){
            var self = this;
            var labelIdArr =[];
            for (const iterator of self.selectLableList) {
                labelIdArr.push(iterator.labelId);
            }
            var parems = {
                courseId:self.courseId,
                labelIds:JSON.stringify(labelIdArr)
            }
            this.$http.post(self.$server.courseLabelAdd,parems).then(res=>{
               if(res.status==200){
                   self.$router.push({path:'/courseCopy'}); 
               }
            })            
        },
        selectListLable(data){
            if(this.selectLableList.length<3){
                this.selectLableList.push(data);
                if(this.selectLableList.length==3){
                    this.isActive = true;
                }else{
                    this.isActive = false;
                }
            }
        },
        removeSelectLable(data,index){
            this.selectLableList.splice(index,1);
            this.isActive = false;
        },
        getCourseAllLabel(num,bool){
            var self = this;
            self.scorllBool = true;
            self.loadingOne = true;
            if(!bool){
                self.lableAllList = [];
            }
            self.pageNo = num;
            var parems = {
                name:encodeURIComponent(self.title),
                pageSize:self.pageSize,
                pageNo:self.pageNo,
                mtype:self.mtype
            }
            this.$http.get(this.$server.courseLabelGetPage(parems)).then(res=>{
               if(res.status==200){
                   var list = res.content.list;
                   if(list.length>0){
                        self.lableAllList = self.lableAllList.concat(list);
                        self.loadingOne = false;
                        if(list.length<self.pageSize){
                            self.scorllBool = false;
                        }else{
                            self.scorllBool = true;
                        }
                   }else{
                        self.loadingOne = false;
                   }
               }else{
                   self.loadingOne = false;
               }
            }).catch(function(error) {
                    self.loadingOne = false; 
            });          
        },
        getCourseSelectLabel(){
            var self = this;
            var parems = {
                id:self.courseId
            }
            this.$http.get(this.$server.courseLabelList(parems)).then(res=>{
               if(res.status==200){
                   self.selectLableList = res.content.list;
                   if(self.selectLableList.length>3||self.selectLableList.length==3){
                        self.isActive = true;
                   }else{
                        self.isActive = false;
                   }
               }
            })             
        },
        loadingMore(e){
                var self = this;
                if(e.srcElement.scrollTop+e.srcElement.offsetHeight==e.srcElement.scrollHeight){ 
                    if(self.scorllBool){
                        this.pageNo++;
                        self.getCourseAllLabel(this.pageNo,true);                     
                    }
                }else{
                    console.log("222");
                }
        }     
    }    
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
.page-title {
    font-size: 18px;
    color: rgba(56, 65, 86, 1);
}
.lableListBox{
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #ccc;
    padding: 10px 0 20px 0;
    margin: 10px 0 0 0;
}
.lableChildCss{
    margin-top: 20px;
}
.lableAllListBox{
    padding: 10px 0;
    max-height: 700px;
    min-height: 100px;
    overflow-y: auto;
    overflow-x: hidden;
}
.lableCss{
    position: relative;
}
.lableCss .el-icon-circle-close{
    position: absolute;
    right: -9px;
    top: -9px;  
    color: #999;
    cursor: pointer;
}
.activeCss1{
    cursor:no-drop;
}
.activeCss2{
    cursor:pointer;
}
</style>


