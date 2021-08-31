<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col class="lSize18">
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
            </el-col>
            <el-col class="lRight-r" v-if="$authJudge('admin:appversion:add')"><el-button class="lButtom lSize16" @click="headEven">发布版本</el-button></el-col>
        </el-row>  
        <el-row>
            <el-col>
                <el-table
                :data="tableData"
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="typeName"
                        label="类型"
                        align="center"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="versionNum"
                        label="版本号"
                        align="center"
                        min-width="60"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="minCompatibleVersionNum"
                        label="兼容版本"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="发布日期"
                        align="center"
                        min-width="120"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="desc"
                        :show-overflow-tooltip="true"
                        label="版本描述"
                        align="center"
                        min-width="200"
                        >
                    </el-table-column>                                                
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
                </div>                
            </el-col> 
        </el-row>      
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){
        return {
            tableData: [],
            pageNo:1,
            pageSize:10,
            loading:true,
            pageAtion:{
                pageTotal:0
            },
            titleList:[
                {
                    name:'APP管理系统',
                    pathInfo:''
                },
                {
                    name:'版本更新',
                    pathInfo:''
                }                                               
            ]
        }
    },
    created(){
        this.getVersionlist();
    },
    components:{
        breadcrumb
    },    
    methods:{
        getVersionlist(num){
            this.loading = true; 
            this.$http.get(this.$server.getVersionList+"?pageNo="+(num||this.pageNo)+"&pageSize="+this.pageSize).then(res=>{
               if(res.status==200){
                   let contentdate = res.content;
                   let listIds = [];
                    listIds = contentdate.list.map(function(element,index){
                        if(contentdate.pageNum==1){
                            element.sortId = index+1;
                            return element;
                        }else if(contentdate.pageNum>1){
                            element.sortId = (contentdate.pageNum-1)*10+index+1;
                            return element;
                        }
                    });                    
                    this.tableData = listIds;
                    this.pageAtion.pageTotal = contentdate.total;
                    this.$nextTick(()=>{
                        this.loading = false; 
                    }) 
               }
                console.log(res);
            })            
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getVersionlist(Number(num))
            }
        },
        headEven(){
           this.$router.push({path:"/backstage/updateApp/Release"}) 
        },
    },
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
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }
</style>


