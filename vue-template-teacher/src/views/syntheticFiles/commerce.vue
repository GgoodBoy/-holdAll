<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col class="lSize18">商务合作</el-col>
            <el-col class="lRight-r">
                <el-row>
                    <el-col :span="5">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                    placeholder="输入姓名查询"
                                    class="search-form"
                                    @keyup.native="proving1"
                                    width="100%"></el-input>
                                    <!-- <i class="el-icon-search" @click="search"></i>    -->
                        </div>
                    </el-col>
                    <el-col :span="1"  :offset="1"><el-button v-if="$authJudge('cooperation:select')" class="redBackColor butColorF"  @click="findInfo">查询</el-button></el-col>
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
                        label="姓名"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="电话"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="email"
                        label="邮箱"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        label="提交时间"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                        label="操作"
                        align="center"
                        min-width="60"
                        >
                        <template slot-scope="scope">
                            <el-button v-if="(scope.row.isContacted==0&&$authJudge('cooperation:set'))||scope.row.isContacted==1"
                                    type="text"
                                    class="black-btn"
                                    :disabled="scope.row.isContacted==0?false:true"
                                    @click="soldOut(scope.row)">{{scope.row.isContacted==0?"未联系":"已联系"}}</el-button>                                                                 
                        </template>
                    </el-table-column>                                                                -->
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
        this.getStudylist();
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
                    //    if(contentdate.list.length){
                    //        if(!nextPage&&prePage!=0){
                    //             listIds = contentdate.list.map(function(element,index){
                    //                 element.sortId = (prePage+1)*10+index+1;
                    //                 return element;
                    //             });
                    //         }else if(!prePage&&!nextPage){
                    //             listIds = contentdate.list.map(function(element,index){
                    //                 element.sortId = index+1;
                    //                 return element;
                    //             });
                    //         }else{
                    //             listIds = contentdate.list.map(function(element,index){
                    //                 element.sortId = prePage*10+index+1;
                    //                 return element;
                    //             });                            
                    //         } 
                    //    };
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
                    // self.tableData = contentdate.list;
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
            var converter = document.createElement("DIV"); 
            converter.innerHTML = self.title; 
            var b = converter.innerText; 
            converter = null; 
            var c=b.replace(/[&\|\\\*^%$#@\-?《》——（）。，~`,.<>='‘’；"":；();:{}+_]/g,"");              
            var params = {
                name:c,
                pageNo:self.pageNo,
                pageSize:self.pageSize
            };
            self.$http.get(self.$server.businessCooperation(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                //    if(contentdate.list.length){
                //        if(!nextPage&&prePage!=0){
                //             listIds = contentdate.list.map(function(element,index){
                //                 element.sortId = (prePage+1)*10+index+1;
                //                 return element;
                //             });
                //         }else if(!prePage&&!nextPage){
                //             listIds = contentdate.list.map(function(element,index){
                //                 element.sortId = index+1;
                //                 return element;
                //             });
                //         }else{
                //             listIds = contentdate.list.map(function(element,index){
                //                 element.sortId = prePage*10+index+1;
                //                 return element;
                //             });                            
                //         } 
                //    };
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
                    // self.tableData = contentdate.list;
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
    components:{},
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


