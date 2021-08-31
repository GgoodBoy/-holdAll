<template>
    <div class="page-wrap gift-list-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3" style="float:right;text-align: right;"><el-button v-if="$authJudge('activity:gift:add')" type="primary" @click="dialogVisible=true">添加新礼包</el-button></el-col>
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
                        prop="sortId"
                        label="序号"
                        align="center"
                        width="50"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="giftName"
                        label="新用户礼包"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="giftTypeText"
                        label="用户类型"
                        align="center"
                        width="80"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="bagTypeText"
                        label="礼包类型"
                        align="center"
                        width="80"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="linkUrl"
                        label="APP链接"
                        align="center"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="mstationLinkUrl"
                        label="M站链接"
                        align="center"
                        show-overflow-tooltip
                        >
                    </el-table-column>    
                    <el-table-column
                        prop="issueDate"
                        label="发布日期"
                        align="center"
                        width="100"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="giftCourse"
                        label="礼包课程"
                        align="center"
                        show-overflow-tooltip
                        >
                    </el-table-column>  
                    <el-table-column
                        prop="giftDate"
                        label="礼包有效期(天数)"
                        align="center"
                        width="80"
                        >
                    </el-table-column>     
                    <el-table-column
                        prop="receiveNum"
                        label="领取人数"
                        align="center"
                        width="60"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="clickNum"
                        label="点击数量"
                        align="center"
                        width="60"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="statusText"
                        label="状态"
                        align="center"
                        width="50"
                        >
                    </el-table-column>                                   
                    <el-table-column
                        label="操作"
                        align="center"
                        width="150">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type="text" size="small" v-if="$authJudge('activity:gift:online')" v-show="scope.row.statusBar==1" @click="upOrDown(scope.row)">上架</el-button>
                                    <el-button type="text" size="small" v-if="$authJudge('activity:gift:offline')" v-show="scope.row.statusBar!=1" @click="upOrDown(scope.row)">下架</el-button>
                                    <el-button type="text" size="small" v-if="$authJudge('activity:gift:edit')" v-show="scope.row.statusBar==1" @click="edit(scope.row)">编辑</el-button>
                                    <el-button type="text" size="small" v-if="$authJudge('activity:gift:info')" v-show="scope.row.bagType==1" @click="goDetails(scope.row)">详情</el-button>  
                                </div>                                              
                            </template>                    
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
        <el-dialog
            title="选择版本"
            :visible.sync="dialogVisible"
            width="20%"
            custom-class="type-dialog"
            center
            class="lCenter-r">
                <div class="type-btns">
                    <el-button type="primary" @click="goAddPage(1)">成人版</el-button>
                    <el-button type="primary" @click="goAddPage(2)">少儿版</el-button>
                </div>
               
        </el-dialog>  
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
                    name:'国学大礼包',
                    pathInfo:''
                }               
            ],
            pageNo:1,
            pageSize:10,
            total:10,
            tableData:[],
            loading:false,
            dialogVisible:false,
        };
    },
    metaInfo: {
        title: "国学大礼包"
    },
    components: {
        pagination,breadcrumb
    },
    watch: {
        pageNo(cur,old){
            if(cur>=1){
                this.getGiftList()
            }
        }
    },
    created() {
       this.getGiftList()
    },
    methods: {
        /**
         * 获取列表数据
         */
        getGiftList(){
            this.loading = true;
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.getGiftList,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    this.tableData = res.content.list.map((item,index)=>{
                        item.giftTypeText = item.giftType==1?'成人':'少儿';
                        switch (item.bagType) {
                            case 1:
                                item.bagTypeText = '赠送课程';
                                break;
                            case 2:
                                item.bagTypeText = '跳转链接';
                                break;                        
                            default:
                                item.bagTypeText = '购买课程';
                                break;
                        }
                        item.giftCourse = item.gcrList.map(option=>option.courseName).join(',');
                        item.course = item.gcrList.map(option=>{
                            return {
                                id:option.courseId,
                                title:option.courseName
                            }
                        });
                        item.statusText = item.statusBar==1?'下架':'上架';
                        item.sortId = (this.pageNo-1)*this.pageSize+index+1;
                        return item;
                    })
                    this.total = res.content.total;
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        /**
         * 选择版本类型创建新的礼包
         */
        goAddPage(type){
            this.dialogVisible = false;
            this.$nextTick(()=>{
                setTimeout(()=>{
                    this.$router.push({
                        path:'/activityObj/giftPackUpdate',
                        query:{
                            type
                        }
                    })
                },300)
            })
        },
        /**
         * 编辑
         */
        edit(obj){
            if(obj.statusBar==2){
                this.$message.error('请先下架大礼包，再进行编辑');
                return false;
            }
            let query = {
                type:obj.giftType,
                id:obj.id,
                name:obj.giftName,
                course:JSON.stringify(obj.course),
                pic:obj.picture,
                date:obj.giftDate,
                linkUrl:obj.linkUrl,
                bagType:obj.bagType,
                mstationLinkUrl:obj.mstationLinkUrl
            }
            this.$router.push({
                path:'/activityObj/giftPackUpdate',
                query:query
            })
        },
        /**
         * 上架or下架
         */
        upOrDown(obj){
            if(obj.statusBar==1){
                this.$confirm('是否上架当前礼包？', '上架确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$http.post(`${this.$server.upGift}/${obj.id}`,{}).then(res=>{
                        if(res.status==200){
                            this.$message({
                                type:'success',
                                message:'上架成功'
                            })
                            this.getGiftList();
                        }
                    })
                }).catch(()=>{})
            }else if(obj.statusBar==2){
                this.$confirm('是否下架当前礼包？', '下架确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$http.post(`${this.$server.downGift}/${obj.id}`,{}).then(res=>{
                        if(res.status==200){
                            this.$message({
                                type:'success',
                                message:'下架成功'
                            })
                            this.getGiftList();
                        }
                    })
                }).catch(()=>{})
            }
        },
        /**
         * 去详情页面
         */
        goDetails(obj){
            let query = {
                type:obj.giftType,
                name:obj.giftName,
                course:JSON.stringify(obj.course),
                date:obj.giftDate,
                issueDate:obj.issueDate,
                statusText:obj.statusText,
                giftName:obj.giftName,
                id:obj.id
            }
            this.$router.push({
                path:'/activityObj/giftPackDetails',
                query
            })
        }
    }
};
</script>

<style lang="scss">
    .gift-list-wrap{
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
        .type-dialog{
            min-width: 250px;
            .type-btns{
                text-align: center;
            }
        }
    }
    
</style>

