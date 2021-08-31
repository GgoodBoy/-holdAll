<template>
    <div class="move-free-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
                <el-col style="text-align: right;">
                    <el-button type="primary" v-if="$authJudge('activity:mobilePopup:add')" @click="$router.push('/activityObj/creatMoveDialog')">创建弹窗</el-button> 
                </el-col>
            </el-row> 
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    header-cell-class-name="list-header-layout-bg"
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        width="50"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="名称"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="activityTitle"
                        label="移动合作课程名称"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        label="弹窗类型"
                        align="center"
                        min-width="100"
                        show-overflow-tooltip
                        >
                            <template slot-scope="scope"> 
                                {{scope.row.type==1?'跳转链接':''}}                                            
                            </template> 
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        label="创建人"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="创建日期"
                        min-width="150"
                        align="center"
                        show-overflow-tooltip
                        >
                    </el-table-column>                    
                    <el-table-column
                        prop="clickNum"
                        label="点击数量"
                        align="center"
                        min-width="100"
                        show-overflow-tooltip
                        >
                    </el-table-column> 
                    <el-table-column
                        label="状态"
                        min-width="80"
                        align="center"
                        show-overflow-tooltip
                        >
                            <template slot-scope="scope"> 
                                {{scope.row.status==1?'已上架':'已下架'}}                                            
                            </template> 
                    </el-table-column>                        
                    <el-table-column
                        label="操作"
                        align="center"
                        width="150">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type="text" v-if="$authJudge('activity:mobilePopup:down')&&scope.row.status==1" size="small" @click="switchs(scope.row)">下架</el-button>
                                    <el-button type="text" v-if="$authJudge('activity:mobilePopup:up')&&scope.row.status==2" size="small" @click="switchs(scope.row)">上架</el-button>
                                    <el-button type="text" v-if="$authJudge('activity:mobilePopup:edit')&&scope.row.status==2" size="small" :disabled="scope.row.enabled==1?true:false" @click="edit(scope.row)">修改</el-button>
                                </div>                                              
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
            </div>
        </div>                             
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            titleList:[
                {
                    name:'活动',
                    pathInfo:'/activityObjList'
                },
                {
                    name:'移动用户赠课弹窗',
                    pathInfo:''
                }               
            ],
            pageNo:1,
            pageSize:10,
            tableData:[],
            loading:false,
            editTnput:'',
            form:{
                courseIds:[]
            },
            courseList:[],
            editCourseIds:[],
            selectData:{},//选中的对象    
            courseListTitle:'',
            timeLimitinput:'',
            isShowTips:false,
            selectCourseType:'',
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            }            
        };
    },
    metaInfo: {
        title: "新用户赠课活动"
    },
    components: {
        pagination,
        breadcrumb
    },
    watch: {},
    created() {
       this.getGiveCourseList(1)
    },
    methods: {
        switchs(data){
            let url = '';
            if(Number(data.status)==1){
                url = this.$server.getMobilePopupDown+data.id;
            }else{
                url = this.$server.getMobilePopupUp+data.id;
            }
            this.$http.post(url,{}).then(res=>{
                this.loading = false;
                if(res.status==200){
                    this.$message.success(Number(data.status)==1?'已下架':'已上架');
                    this.getGiveCourseList();
                }
            }) 
        },
        edit(data){
            this.$router.push({path:'/activityObj/creatMoveDialog',query:{data:JSON.stringify(data)}});
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getGiveCourseList(Number(num))
            }            
        }, 
        /**
         * 获取列表数据
         */
        getGiveCourseList(num){
            var self = this;
            this.loading = true;
            if(num){
                self.pageNo = num;
            }            
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(this.$server.getMobilePopupGetPage,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                return element;
                            });                            
                        } 
                   };
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = self.pageNo;
                    self.$nextTick(function(){
                        self.loading = false; 
                    })
                }
            }).catch(()=>{
                this.loading = false;
            })
        }
    }
};
</script>

<style lang="scss">
.centerCss{
    text-align: center;
}
.leftCss{
    text-align: left;
}
.rightCss{
    text-align: right;
    padding: 5px;
}
.marginBottom20{
    margin-bottom: 20px;
}
.lineHeight40{
    line-height: 40px;
}
.block{
    text-align: center;
    margin-top:60px;
    padding-bottom:60px;
}
.move-free-wrap{
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
    }
}

</style>

