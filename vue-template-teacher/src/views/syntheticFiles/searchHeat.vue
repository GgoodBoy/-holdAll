<template>
    <div>
        <div class="page-header">
            <el-row style="margin-bottom:10px">
                <el-col :span="4">
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-row :gutter="3">
                <el-col :span="6">
                    <div class="keyword">
                    <el-input v-model="name"
                        placeholder="输入热词查询"
                        maxlength="20"
                        clearable
                        ></el-input>
                    </div>
                </el-col>                     
                <el-col :span="4">
                    <el-select v-model="type"
                        clearable
                        placeholder="类型"
                        >
                        <el-option v-for="(item,i) in typeArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>                    
                </el-col>
                <!-- <el-col :span="5">
                    <el-date-picker
                    v-model="startTime"
                    type="date"
                    placeholder="开始时间">
                    </el-date-picker>                  
                </el-col>
                <el-col :span="5">
                    <el-date-picker
                    v-model="endTime"
                    type="date"
                    placeholder="结束时间">
                    </el-date-picker>                         
                </el-col>                 -->
                <el-col :span="2"><el-button type="primary" @click="search">查询</el-button></el-col>
                <el-col :span="2" :offset="10"><el-button type="primary" @click="headExport">导出</el-button></el-col>
            </el-row>     
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="order"
                        label="序号"
                        align="center"
                        min-width="40"
                        :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                        prop="word"
                        label="热词名称"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="searchCount"
                        label="搜索次数"
                        align="center"
                        :show-overflow-tooltip="true">
                    </el-table-column>     
                    <el-table-column
                        prop="typeText"
                        label="类型"
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
                        :total="total"
                    >
                    </el-pagination>
                </div>             
            </div>
        </div>
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken } from '@/utils/auth';
export default {
    data() {
        return {
            titleList:[
                {
                    name:'热词搜索',
                    pathInfo:'/hotWork'
                },
                {
                    name:'查看热度',
                    pathInfo:''
                }               
            ],
            name:'',
            type:-1,
            typeArr:[{label:'全部',value:-1},{label:'预设',value:1},{label:'自然',value:2}],
            pageNo:1,
            pageSize:10,
            total:1,
            tableData:[],
            loading:false,
            // startTime:'',
            // endTime:''
        };
    },
    metaInfo: {
        title: "搜索热度"
    },
    components: {
        pagination,breadcrumb
    },
    watch: {
        pageNo(cur,old){
            if(cur>=1){
                this.getList()
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
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
                if(type=="start"){
                    h = h<10?("0"+h):h;
                    m1 = m1<10?("0"+m1):m1;
                    s = s<10?("0"+s):s;
                }else{
                    h = 23;
                    m1 = 59;
                    s = 59;
                }
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
            }else{
                return '';
            }
        },  
        //导出
        download2(url) {
            try{ 
                    var elemIF = document.createElement("iframe");   
                    elemIF.src = url;   
                    elemIF.style.display = "none";   
                    document.body.appendChild(elemIF);   
                }catch(e){ 
                    zzrw.alert("下载异常！");
                }
        },           
        //导出
        headExport(){
                var parems = {
                    token:getToken(),
                    word:this.name,
                    type:this.type,
                };
                this.download2(this.$server.hotwordSearchWordExport(parems)); 
        },    
        /**
         * 获取列表数据
         */
        getList(){
            this.loading = true;
            let query = {
                params:{
                    word:this.name,
                    type:this.type==''?-1:this.type,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    // startTime:this.formatDate(this.startTime,'start'),
                    // endTime:this.formatDate(this.endTime,'end')                   
                }
            }
            this.$http.get(this.$server.searchWord,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.total = res.content.total;
                    this.tableData = res.content.list;
                    this.tableData.forEach((item,index)=>{
                        item.typeText = this.typeArr.find(option=>option.value==item.type).label;
                        item.order = (this.pageNo-1)*this.pageSize+index+1;
                    })
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        /**
         * 查询
         */
        search(){
            this.pageNo = 0;
            this.$nextTick(()=>{
                this.pageNo = 1;
            })
        }
    }
};
</script>

<style scoped lang="scss">
    .page-header {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-title {
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
            margin-bottom: 20px;
        }
        .top-number{
            line-height: 40px;
            font-size: 14px;
            color:#aaa;
        }
    }
    .search-form {
        width: 100%;
        margin-right: 10px;
        position: relative;
    }
    .page-content {
        background: #fff;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .editor-btn {
            color:#9E0E00;
            font-size: 14px;
            padding: 0;
            height: 36px;
            line-height: 36px;
        }
        .block{
            text-align: center;
            margin-top:60px;
            padding-bottom:60px;
        }
        .handle-btn{
            width: 80px!important;
        }
    }
    .edit-dialog{
        .edit-box{
            margin:10px 0 40px 0;
        }
        .name,.select-box,.btn{
            display: inline-block;
            vertical-align: middle;
        }
        .name{
            width: 180px;
        }
        .select-box{
            width: 110px;
            margin:0 5px;
        }
        .error-tips{
            position: absolute;
            left: 0;
            bottom:-30px;
            color:#ca2312;
            font-size: 14px;
        }
    }
</style>

