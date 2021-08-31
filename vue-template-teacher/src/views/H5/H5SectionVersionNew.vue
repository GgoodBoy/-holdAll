<template>
    <div class="page-wrap gift-list-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3" style="float:right;text-align: right;"><el-button v-if="$authJudge('activity:gift:add')" type="primary" @click="creatWuPin">发布版本</el-button></el-col>
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
                        min-width="50"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="versionNum"
                        label="版本号"
                        align="center"
                        min-width='40'>
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="发布日期"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip
                        >
                    </el-table-column>  
                    <el-table-column
                        prop="desc"
                        label="描述"
                        align="center"
                        min-width="180"
                        show-overflow-tooltip
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
            </div>
        </div>   
        <el-dialog
        :visible.sync="dialogVisibleOne"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="false"
        width="30%"
        >
            <el-row>
                <el-col class="lLeft-r lMarginBO20">
                    <div style="width:100px;" class='fl lCenter-r'>版本号:</div>
                    <el-input style='width:300px;' maxlength="20" @input="versionVal=versionVal.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')" v-model="versionVal" placeholder="请输入版本号(数字和.的组合)"></el-input>
                </el-col>
                <el-col class="lLeft-r">
                    <div style="width:100px;" class='fl lCenter-r'>版本描述:</div>
                    <el-input style='width:300px;' maxlength="100" rows='4' show-word-limit type="textarea" v-model="versionDes" placeholder="请输入版本描述"></el-input>
                </el-col>
                <el-col class="lCenter-r lMarginTop20">
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button type="primary" @click="isOkChanelEven">确定</el-button>                    
                </el-col>
            </el-row>                   
        </el-dialog>    
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            titleList:[],
            pageNo:1,
            pageSize:10,
            tableData:[],
            loading:false,
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            id:'',
            courseId:'',
            h5Id:'',
            edits:'',
            actionH5Id:'',
            dialogVisibleOne:false,
            versionVal:'',
            versionDes:'',
            type:1
        };
    },
    components: {
        pagination,breadcrumb
    },
    watch: {},
    created() {
        this.type = this.$route.query.type;
        if(this.type==1){
            this.courseId = this.$route.query.courseId||'';
            this.edits = this.$route.query.sectionId||'';     
            console.log('this.$route.query',this.$route.query)   
            console.log('this.$route.query.sectionId',this.$route.query.sectionId)    
            this.titleList=[
                {
                    name:'H5课程管理',
                    pathInfo:''
                },   
                {
                    name:'H5课程',
                    pathInfo:'/H5WebView/index'
                },
                {
                    name:'创建H5课程',
                    pathInfo:'/H5WebView/H5Creat/'+this.courseId
                },
                {
                    name:'版本',
                    pathInfo:''
                }
            ];
        }else{
            this.id = this.$route.query.id||'';
            this.courseId = this.$route.query.courseId||'';
            this.h5Id = this.$route.query.h5Id||'';
            this.edits = this.$route.query.sectionId||'';
            this.actionH5Id = this.$route.query.actionH5Id||1;            
            this.titleList=[
                    {
                        name:'H5课程管理',
                        pathInfo:''
                    },   
                    {
                        name:'H5课程',
                        pathInfo:'/H5WebView/index'
                    },
                    {
                        name:'创建H5课程',
                        pathInfo:'/H5WebView/H5Creat/'+this.courseId
                    },
                    {
                        name:'H5课程详情页',
                        pathInfo:'/H5WebView/H5SectionNew/'+this.h5Id+'/'+this.courseId
                    },
                    {
                        name:'版本',
                        pathInfo:''
                    }
            ];
        }
        this.getGiftList(1);
    },
    methods: {
        isOkChanelEven(){
            let parmes = {
                versionNum:this.versionVal,
                desc:this.versionDes,
                type:this.type
            };
            if(this.type==1){
                parmes['courseId']=this.edits;
            }else{
                parmes['periodId']=this.edits;
            }
             this.$http.post(this.$server.getAddVersion,parmes).then(res=>{
                if(res.status==200){
                    this.$message({
                        type:'success',
                        message:'发布版本成功'
                    })
                    this.dialogVisibleOne=false;
                    this.getGiftList(1);
                    // if(this.type==1){
                    //     this.$router.push({
                    //         path:'/H5WebView/H5Creat/'+this.courseId
                    //     })
                    // }else{
                    //     this.$router.push({
                    //         path:'/H5WebView/H5SectionNew/'+this.h5Id+'/'+this.courseId
                    //     })
                    // }
                }
            })         
        },
        closeDialog(){
            this.versionVal='';
            this.versionDes='';
            this.dialogVisibleOne = false;
        },
        creatWuPin(){       
            this.dialogVisibleOne = true;   
        },
        /**
         * 获取列表数据
         */
        getGiftList(num){
            let self = this;
            this.loading = true;
            if(num){
                self.pageNo = num;
            }
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    type:this.type
                }
            }
            console.log("this.edits",this.edits);
            this.$http.get(this.$server.getPeriodVersion+self.edits,query).then(res=>{
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
                    self.pageAtion.paginationPage = num;
                    self.loadingOne = false;
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        
        childPageValue(num){
            if(Number(num)>0){
                this.getGiftList(Number(num))
            }
        },
    }
};
</script>

<style lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
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
            .imgCss{
                width:60px;
                height:60px;
                border-radius: 50%;
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

