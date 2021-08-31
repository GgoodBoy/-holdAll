<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>            
            <el-col class="lRight-r">
                <el-row :gutter="20">
                    <el-col :span="5">
                        <el-input v-model.trim="courseName"
                                placeholder="输入课程名称"
                                class="search-form"
                                clearable
                                width="100%"></el-input>                        
                    </el-col>
                    <el-col :span="15" class="child-left">
                        <label>统计日期</label>
                        <el-date-picker
                            v-model="beginTimeStr"
                            type="date"
                            style="width:200px;"
                            value-format="yyyy-MM-dd"
                            :picker-options="startDateOptions"
                            @change="getStart"
                            placeholder="开始时间">
                        </el-date-picker>
                        <span>至</span>
                        <el-date-picker
                            v-model="endTimeStr"
                            style="width:200px;"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :picker-options="EndDateOptions"
                            @change="getEnd"
                            placeholder="结束时间">
                        </el-date-picker>         
                    </el-col>                     
                    <el-col :span="2" v-if="$authJudge('statistics:coursevisit:select')"><el-button type="primary" @click="search">查询</el-button></el-col>
                    <el-col :span="2" v-if="$authJudge('statistics:coursevisit:export')"><el-button type="primary"  @click="exportDetails">导出</el-button></el-col>
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
                        prop="sort"
                        label="序号"
                        align="center"
                        min-width="60">
                    </el-table-column>
                     <el-table-column
                        prop="courseId"
                        label="课程ID"
                        align="center"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="courseTitle"
                        label="课程名称"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="sellingPriceText"
                        label="价格"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="courseTypeText"
                        label="课程类型"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="visitNum"
                        label="播放次数"
                        align="center"
                        >
                    </el-table-column>                                               
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :current-page.sync="pageNo"
                        :page-size="pageSize"
                        :total="total">
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
            flags:[],
            tableData: [],
            pageNo:1,
            pageSize:10,
            total:10,
            loading:true,
            courseName:'',
            beginTimeStr:'',
            endTimeStr:'',
            startDateOptions: {
                disabledDate: (time) => {
                    return this.endTimeStr?time.getTime() > new Date(this.endTimeStr).getTime():false
                }
            },
            // 时间结束测试
            EndDateOptions: {
                disabledDate: (time) => {
                    return this.beginTimeStr?time.getTime() < new Date(this.beginTimeStr).getTime() - 8.64e7:false
                }
            },
            titleList:[
                {
                    name:'统计',
                    pathInfo:'/isCourseCount/count'
                },
                {
                    name:'课程访问统计',
                    pathInfo:''
                }
            ], 
        }
    },
    components:{
        breadcrumb
    },
    watch:{
        pageNo(cur,old){
            if(cur>0){
                if(this.beginTimeStr.length>0&&this.endTimeStr.length==0){
                    this.beginTimeStr = ''
                }
                if(this.beginTimeStr.length==0&&this.endTimeStr.length>0){
                    this.endTimeStr = ''
                }
                this.$nextTick(()=>{
                    this.getCourseVisitRank();
                })
            }
        },        
    },
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        this.flags = this.$getPermissions(routes,currentPath); 
        if(!this.flags){
            this.flags=[];
        }     
        this.getCourseVisitRank();
    },
    mounted(){},
    methods:{
        /**
         * 导出
         */
        exportDetails(){
            let token = getToken()
            let url = `${this.$server.exportCourseVisitRank}?courseName=${this.courseName}&beginTimeStr=${this.beginTimeStr}&endTimeStr=${this.endTimeStr}&pageNo=${this.pageNo}&pageSize=${this.pageSize}&token=${token}`
            window.open(url)
        },
        /**
         * 获取课程点击排行
         */
        getCourseVisitRank(){
            this.loading = true;
            let query = {
                params:{
                    courseName:this.courseName,
                    beginTimeStr:this.beginTimeStr,
                    endTimeStr:this.endTimeStr,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(this.$server.getCourseVisitRank,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    this.total = res.content.total;
                    this.tableData = res.content.list.map((item,index)=>{
                        item.courseTypeText = item.courseType==1?'视频':'音频';
                        item.sort = (this.pageNo-1)*this.pageSize+index+1;
                        item.sellingPriceText = `${item.sellingPrice}币`
                        return item;
                    })
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        /**
         * 搜索
         */
        search(){
            if(this.beginTimeStr.length>0&&this.endTimeStr.length==0){
                this.$message.error('请选择结束时间');
                return;
            }
            if(this.beginTimeStr.length==0&&this.endTimeStr.length>0){
                this.$message.error('请选择开始时间');
                return;
            }
            this.pageNo = 0;
            this.$nextTick(()=>{
                this.pageNo = 1;
            })
        },
        getStart(val){
            if(!val){
                this.$nextTick(()=>{
                    this.beginTimeStr = ''
                })
            }
        },
        getEnd(val){
            if(val==null){
                this.$nextTick(()=>{
                    this.endTimeStr = ''
                })
            }
        }
    }
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
.child-left *{
    float: left;
    font-size:14px;
    margin:0 10px;
}
</style>


