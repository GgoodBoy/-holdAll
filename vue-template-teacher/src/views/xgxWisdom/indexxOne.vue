<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col class="lSize18">
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
            </el-col>
            <el-col class="lRight-r">
                <el-row>
                    <el-col :span="10">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                    placeholder="输入名称查询/批次号查询"
                                    class="search-form"
                                    @keyup.native="proving1"
                                    style="width:200px"
                                    ></el-input>
                                    <el-button v-if="$authJudge('wisdomplatform:course:select')" class="redBackColor butColorF"  @click="findInfo">查询</el-button>
                        </div>
                    </el-col>
                    <el-col :span="2"  :offset="11"><el-button v-if="$authJudge('wisdomplatform:course:add')" class="redBackColor butColorF"  @click="creatBwisdom('add','')">新建B端课程</el-button></el-col>
                </el-row>
            </el-col>
        </el-row>  
        <el-row>
            <el-col>
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="名称"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="batch"
                        label="批次号"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="courseTitles"
                        label="课程"
                        align="center"
                        min-width="150"
                        :show-overflow-tooltip="true"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="creator"
                        label="创建人"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="创建时间"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="130"
                        >
                        <template slot-scope="scope"> 
                            <el-button type="text" v-if="$authJudge('wisdomplatform:course:modify')" @click="creatBwisdom('edit',scope.row)">修改</el-button>  
                            <el-button type="text" v-if="$authJudge('wisdomplatform:course:userlist')" @click="creatBwisdom('user',scope.row)">用户</el-button> 
                            <el-button type="text" v-if="$authJudge('wisdomplatform:course:addclassifies')" @click="creatBwisdom('style',scope.row)">添加分类</el-button>                                                               
                        </template>
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
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
const formatDate = (date)=>{
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
        h = h<10?("0"+h):h;
        m1 = m1<10?("0"+m1):m1;   
        s = s<10?("0"+s):s;      
        return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
    }else{
        return '';
    }
}
export default {
    data(){
        return {
            tableData: [],
            pageNo:1,
            pageSize:10,
            loading:true,
            title:'',
            disabledBoll:false,
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            value:-1,
            titleList:[
                {
                    name:'国学智慧平台',
                    pathInfo:''
                },
                {
                    name:'B端课程管理',
                    pathInfo:''
                }                                               
            ],
            learnType:[
                {
                    label:"全部",
                    value:-1
                },              
                {
                    label:"已激活",
                    value:1
                },
                {
                    label:"未激活",
                    value:0                  
                }
            ]            
        }
    },
    created(){
        this.getStudylist(1);
    },
    methods:{
        proving1(){
            var self = this;
            var reg = /^(?!.*\\.*$)/;
            if(!reg.test(self.title)){
                self.title='';
            }            
        },        
        //搜索
        search(){
            this.getStudylist(1);
        },
        //查询
        findInfo(){
            this.getStudylist(1);
        },  
        creatBwisdom(type,data){
            switch (type) {
                case 'add':
                    this.$router.push({path:"/xgxWisdom/creatWisdom"});
                    break;
                case 'edit':
                    let datas = {
                        id:data.id,
                        batch:data.batch,
                        name:data.name
                    };
                    this.$router.push({path:"/xgxWisdom/creatWisdom",query: {editData: JSON.stringify(datas)}});
                    break;
                case 'user':
                    this.$router.push({path:"/xgxWisdom/userList",query: {id: data.id}});
                    break;
                case 'style':
                    this.$router.push({path:"/xgxWisdom/styleList",query: {id: data.id}});
                    break;
                default:
                    break;
            }
        },    
        soldOut(rows){
            this.updateStates(0,rows)
        },
        updateStates(num,rows){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            var params = {
                id:rows.id,
                isContacted:(rows.isContacted==0?1:0),
                pageNo:self.pageNo,
                name:self.title,
                pageSize:self.pageSize
            };
            self.$http.post(self.$server.coperationLook(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                    if(contentdate.list.length){
                        if(!nextPage&&prePage!=0){
                                listIds = contentdate.list.map(function(element,index){
                                    element.sortId = contentdate.total-index;
                                    element.time = formatDate(element.createAt)
                                    return element;
                                });
                            }else if(!prePage&&!nextPage){
                                listIds = contentdate.list.map(function(element,index){
                                    element.sortId = contentdate.total-index;
                                    element.time = formatDate(element.createAt)
                                    return element;
                                });
                            }else{
                                listIds = contentdate.list.map(function(element,index){
                                    element.sortId = contentdate.total-prePage*10-index;
                                    element.time = formatDate(element.createAt)
                                    return element;
                                });                            
                            } 
                    };                 
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
               }
            })            
        },        
        getStudylist(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            // var c=b.replace(/[&\|\\\*^%$#@\-?《》——（）。，~`,.<>='‘’；"":；();:{}+_]/g,"");              
            // var params = {
            //     searchContent:self.title,
            //     pageNo:self.pageNo,
            //     pageSize:self.pageSize
            // };           
            const query = {
                params:{
                    searchContent:self.title,
                    pageNo:self.pageNo,
                    pageSize:self.pageSize
                }
            }
            self.$http.get(self.$server.wisdomCourseList,query).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                    if(contentdate.list.length){
                        if(!nextPage&&prePage!=0){
                                listIds = contentdate.list.map(function(element,index){
                                    element.sortId = contentdate.total-prePage*10-index;
                                    element.time = formatDate(element.createAt)
                                    return element;
                                });
                            }else if(!prePage&&!nextPage){
                                listIds = contentdate.list.map(function(element,index){
                                    element.sortId = contentdate.total-index;
                                    element.time = formatDate(element.createAt)
                                    return element;
                                });
                            }else{
                                listIds = contentdate.list.map(function(element,index){
                                    element.sortId = contentdate.total-prePage*10-index;
                                    element.time = formatDate(element.createAt)
                                    return element;
                                });                            
                            } 
                    };                 
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
               }
                console.log(res);
            })            
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        },
    },
    components:{
        breadcrumb
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px; 
    margin-bottom: 10px;     
}
.headerDiv .search-form {
        // width: 240px;
        // margin-right: 60px;
        position: relative;
        &.el-icon-search:before {
            position: absolute;
            font-size: 18px;
            right: 10px;
            top: 10px;
            background: #fff;
            font-weight: 900;
        }
    }
.headerDiv .iSeachEven{
    width: 100%;
    position: relative;
    text-align:left;
}
.headerDiv .iSeachEven i{
    position: absolute;
    right: 8px;
    font-size: 18px;
    top: 12px;
    cursor: pointer;
}
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }    
</style>


