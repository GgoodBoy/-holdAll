<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <!-- <el-col class="lSize18">课程排行</el-col> -->
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>            
            <el-col class="lRight-r">
                <el-row :gutter="3">
                    <el-col :span="5">
                        <el-input v-model.trim="courseName"
                                placeholder="输入课程名称"
                                class="search-form"
                                clearable
                                width="100%"></el-input>                        
                    </el-col>
                    <el-col :span="4">
                            <el-row>
                                <el-col :span="8" class="lCenter-r" style="fontSize:14px">状态 : </el-col>
                                <el-col :span="15" :offset="1">
                                    <el-select v-model="value" placeholder="状态" @change="chooseVersionType">
                                        <el-option
                                        v-for="item in countType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>                                    
                                </el-col>
                            </el-row>                          
                    </el-col> 
                    <el-col :span="2">
                        <el-select v-model="sortType"
                            clearable
                            placeholder="排序方式"
                            >
                            <el-option v-for="(item,i) in statusArr"
                                :key="i"
                                :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>                    
                    </el-col>                    
                    <!-- <el-col :span="8" :offset="1">
                        <el-row class="lLine40">
                            <el-col :span="11" class="lCenter-r">
                                        <el-date-picker
                                        v-model="dataStart"
                                        type="date"
                                        style="width:150px;"
                                        placeholder="开始时间">
                                        </el-date-picker>
                            </el-col>
                            <el-col :span="1" style="width:20px;" class="lCenter-r">至</el-col>
                            <el-col :span="11" class="lCenter-r">
                                    <el-date-picker
                                    v-model="dataEnd"
                                    style="width:150px;"
                                    type="date"
                                    placeholder="结束时间">
                                    </el-date-picker>                     
                            </el-col>
                        </el-row>
                    </el-col>                      -->
                    <el-col :span="2" :offset="9"><el-button v-if="$authJudge('statistics:coursesaletop:select')" class="redBackColor butColorF" @click="findInfo">查询</el-button></el-col>
                    <el-col :span="2" v-if="$authJudge('statistics:coursesaletop:export')"><el-button class="redBackColor butColorF" @click="exportLearnList">导出</el-button></el-col>
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
                        prop="rankNo"
                        label="排行"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="courseName"
                        label="课程名称"
                        align="center"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="sellingPrice"
                        label="价格"
                        align="center"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="pipelineName"
                        label="渠道"
                        align="center"
                        min-width="120">
                    </el-table-column>                    
                    <el-table-column
                        prop="totalSellNum"
                        label="销售数量"
                        align="center"
                        min-width="60"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="totalSellMoney"
                        label="销售总金额"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="sellStatusStr"
                        label="状态"
                        align="center"
                        min-width="120"
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
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import eventAction from '../lEventAtion';
let actions = new eventAction()
export default {
    data(){
        return {
            tableData: [],
            pageNo:1,
            pageSize:10,
            loading:true,
            courseName:'',
            flags:[],
            value:1,
            dataStart:'',
            dataEnd:'',
            statusArr:[{label:'销售数量',value:1},{label:'销售总金额',value:2}],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            sortType:1,
            titleList:[
                    {
                        name:'统计',
                        pathInfo:'/isCourseCount/count'
                    },
                    {
                        name:'课程销售排行榜',
                        pathInfo:''
                    }
            ],
            countType:[
              {
                 label:"已完成",
                 value: 1
              },
              {
                 label:"已取消",
                 value: 0
              }              
          ]

        }
    },
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        this.flags = this.$getPermissions(routes,currentPath); 
        if(!this.flags){
            this.flags=[];
        }     
        this.getCountlist(1);
    },
    methods:{
        findInfo(){
            this.getCountlist(1);
        },
        exportLearnList(){
            var self = this;
            console.log("导出");
            var parems = {
                token:getToken(),
                courseName:encodeURIComponent(self.courseName),
                sellStatus:self.value,
                // orderStartDateStr:self.startDateStr||'',
                // orderEndDateStr:self.endDateStr||''                
            };
            window.open(this.$server.courseStatsListExport(parems));            
        },
        //状态筛选
        chooseVersionType(e){
            this.value = e;
        },         
        // dateChangeEndTime(value, nums){
        //     switch (nums) {
        //         case 1:
        //             this.startDateStr=this.formatDate(Number(value));
        //             break;
        //         case 2:
        //             this.endDateStr=this.formatDate(Number(value));
        //             break;            
        //         default:
        //             console.log("错误");
        //             break;
        //     }                
        // },
        getCountlist(num){
            var self = this;
            self.loading = true; 
            if(num>0){
                self.pageNo = num;
            }
            var parmes = {
                pageSize:self.pageSize,
                pageNo:self.pageNo,
                courseName:encodeURIComponent(self.courseName),
                sellStatus:self.value,
                sortType:self.sortType
                // beginAt:actions.formatDate(self.dataStart),
                // endAt:actions.formatDate(self.dataEnd)
            };
            this.$http.get(this.$server.courseStatslist(parmes)).then(res=>{
               if(res.status==200){
                   var contentdate = res.content;
                   self.tableData = contentdate.list;
                   self.pageAtion.pageTotal = contentdate.total;
                   self.pageAtion.paginationPage = num;
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
               }
                console.log(res);
            })            
        },
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
                },        
        childPageValue(num){
            if(Number(num)>0){
                this.getCountlist(Number(num))
            }
        }
    },
    components:{
        breadcrumb
    },
    mounted(){}
}
</script>
<style  scoped lang="scss">
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
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }

</style>


