<template>
    <div class="matchIDBoxHw">
        <div class="matchSelect">
            <el-row :gutter="10">
                <el-col class="lLeft-r lMarginBO30">
                    <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                </el-col>                
                <el-col :span="8">
                    <el-input v-model.trim="matchTitle" placeholder="请输入课程名称/课程ID查询（华为教育/学国学网）"></el-input>                
                </el-col>
                <el-col :span="2">
                    <el-button class="redBackColor butColorF" @click="matchingEven('select')" v-if="$authJudge('course:xiaoerelation:select')">搜索</el-button>
                </el-col>
                <el-col :span="2" :offset="11" class="lRight-r">
                    <el-button class="redBackColor butColorF" @click="matchingEven('addID')">匹配ID</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="matchTableList">
            <div class="tableTitle">
                <i class="el-icon-warning"></i>
                <p>该功能主要用于用户在华为教育中心购买课程后，在我们APP中也可观看。</p>
            </div>
            <div>
                <el-table :data="data"
                        border
                        header-cell-class-name="list-header-layout-bg"
                        style="width: 100%">
                    <el-table-column label="序号"
                                    prop="sortId"
                                    align="center"
                                    min-width="50">
                    </el-table-column>     
                    <el-table-column label="课程名称"
                                    align="center"
                                    prop="courseTitle"
                                    min-width="100">
                    </el-table-column>                                       
                    <el-table-column label="华为教育课程ID"
                                    align="center"
                                    prop="hwEduCourseId"
                                    min-width="150">
                    </el-table-column>
                    <el-table-column prop="courseId"
                                    label="学国学网课程ID"
                                    align="center"
                                    min-width="100">
                    </el-table-column>
                    <el-table-column prop="name"
                                    label="操作"
                                    align="center"
                                    class-name="handle-wrap-layout"
                                    min-width="80">
                        <template slot-scope="scope">
                            <!-- 显示规则 -->
                            <!-- 上线状态 -->
                            <el-button type="text" class="black-btn" @click="matchingEven('update',scope.row)" v-if="$authJudge('course:xiaoerelation:edit')">修改</el-button>
                            <!-- 上线状态 -->
                            <el-button type="text" class="black-btn" @click="matchingEven('delete',scope.row)" v-if="$authJudge('course:xiaoerelation:del')">删除</el-button>                                 
                        </template>
                    </el-table-column>
                </el-table>                
            </div>
        </div>
        <div class="paginBox">
            <el-pagination background
                        layout="prev, pager, next"
                        :total="pageData.totalNum"
                        :current-page="pageData.currentPage"
                        :page-size="pageSize"
                        @prev-click="prePageValue"
                        @next-click="nextPageValue"                        
                        @current-change="childPageValue">
            </el-pagination>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :show-close="false"
            center
            width="35%">
            <div>
                <el-row >
                    <el-col :span="12" class="lLeft-r">
                        华为教育课程ID
                        <!-- <el-tooltip class="item" effect="dark" content="华为教育中心ID查看：进入专栏列表，点击某一个专栏进入专栏详情，此时查看浏览器地址栏后面有一串以p_开头的字符串，这就是课程ID（包含p_）" placement="top">
                            <i class="el-icon-question"></i>
                        </el-tooltip> -->
                    </el-col>
                    <el-col :span="12" class="lRight-r">
                        学国学网课程ID
                        <el-tooltip class="item" effect="dark" content="学国学网课程ID查看：进入后台课程--课程管理，查看列表中的标题栏ID一列，即使课程ID。" placement="top">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-col>                
                </el-row>
                <el-row class="lMarginTop20">
                    <el-col :span="10" class="lLeft-r"><el-input v-model.trim="matchXiaoeProductId" class="matchXiaoeProductId" @blur="changBackground(matchXiaoeProductId,'matchXiaoeProductId')" placeholder="请输入华为教育课程ID"></el-input></el-col>
                    <el-col :span="4" class="lCenter-r lLine40">=</el-col> 
                    <el-col :span="10" class="lRight-r"><el-input v-model.trim="matchXgxCourseId" class="matchXgxCourseId" @blur="changBackground(matchXgxCourseId,'matchXgxCourseId')" placeholder="请输入学国学网课程ID"></el-input></el-col>               
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="matchingEven('dialogRemoves')">取 消</el-button>
                <el-button type="primary" @click="matchingEven('dialogSave')" v-if="$authJudge('course:xiaoerelation:save')">确 定</el-button>            
            </span>
        </el-dialog>  
        <el-dialog
            :visible.sync="dialogDeleveVisible"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :show-close="false"
            center
            width="30%">
            <div class="lCenter-r">
                确认删除！
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="matchingEven('dialogListNo')">取 消</el-button>
                <el-button type="primary" @click="matchingEven('dialogListOk')">确 定</el-button>            
            </span>
        </el-dialog>                                 
    </div>
</template>
<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){
        return {
            matchTitle:'',
            data:[],
            dialogVisible: false,
            dialogDeleveVisible:false,
            pageSize:10,
            matchXiaoeProductId:'',
            matchXgxCourseId:'',
            pageNo:1,
            updateId:'',
            titleList:[
                {
                    name:'课程',
                    pathInfo:''
                },
                {
                    name:'华为教育课程ID匹配',
                    pathInfo:''
                } 
            ],            
            pageData: {
                totalNum:0,
                currentPage:0
            },
            eventType:''           
        }
    },
    created() {
        this.getMatchList(1);
    },
    components:{
        pagination:pagination,
        breadcrumb
    },
    methods: {
        prePageValue(data){},
        nextPageValue(data){},
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },        
        changBackground(data,str){
            var han = /^[0-9a-zA-Z_]{1,}$/; 
            if(!han.test((data))){
                var parentsDoms = document.querySelector('.'+str);
                var childDoms = parentsDoms.querySelector(".el-input__inner");
                childDoms.style.color="#B4272D";                
            }else{
                var parentsDoms = document.querySelector('.'+str);
                var childDoms = parentsDoms.querySelector(".el-input__inner");
                childDoms.style.color="#606266";                   
            }   
        },
        //分页事件
        matchingEven(types,data){
            switch (types) {
                case 'select':
                    this.getMatchList(1);
                    break;
                case 'update':
                    this.dialogVisible = true;
                    this.updateId = data.id;
                    this.matchXiaoeProductId = data.hwEduCourseId;
                    this.matchXgxCourseId = data.courseId;
                    this.eventType = types;
                    break;
                case 'delete':
                    this.updateId = data.id;
                    this.dialogDeleveVisible = true;
                    break;
                case 'addID':
                    this.dialogVisible = true;
                    break;     
                case 'dialogSave':
                    var han = /^[0-9a-zA-Z_]{1,}$/;
                    if(this.matchXiaoeProductId&&this.matchXgxCourseId&&han.test((this.matchXiaoeProductId))&&han.test((this.matchXgxCourseId))){
                        this.dialogVisible = true;
                        var data = {
                            id:this.updateId||'',
                            xiaoeProductId:this.matchXiaoeProductId,
                            xgxCourseId:this.matchXgxCourseId
                        };     
                        if(this.updateId){
                            this.getUpdataMatch(data,'dialogSave');
                        }else{
                            this.getUpdataMatch(data,'addID');
                        }                  
                        
                    }else{
                        this.$message.error("请输入正确的ID");                        
                    }
                    break;
                case 'dialogRemoves':
                    this.matchXiaoeProductId ='';
                    this.matchXgxCourseId = '';
                    this.dialogVisible = false;
                    break;    
                case 'dialogListOk':
                    this.getDeleteMatch( this.updateId);
                    break; 
                case 'dialogListNo':
                    this.dialogDeleveVisible = false;
                    break;                                                                                                                            
                default:
                    break;
            }
        },
        getUpdataMatch(data,type){          
            var parems = {
                hwEduCourseId:data.xiaoeProductId,
                courseId:data.xgxCourseId
            };
            var url = '';
            if(this.eventType=='update'){
                url = this.$server.getHwEduAdit;
                parems['id'] = data.id;
            }else{
                url = this.$server.getHwEduAdd;
            }
            this.$http.post(url,parems).then(res=>{
               if(res.status==200){
                    this.matchXiaoeProductId ='';
                    this.matchXgxCourseId = '';   
                    if(this.dialogVisible){
                        this.dialogVisible = false;
                    }      
                    this.eventType = '';          
                   if(type=="dialogSave"){
                       this.getMatchList(this.pageNo);
                   }else{
                       this.getMatchList(1);
                   }
               }
            })             
        },
        getDeleteMatch(id){
            var parems = {
                id:id
            };
            this.$http.post(this.$server.getHwEduDel(parems)).then(res=>{
               if(res.status==200){
                   this.dialogDeleveVisible = false;
                   if(this.data.length==1&&this.pageNo>1){
                       this.getMatchList(Number(this.pageNo)-1);
                   }else{
                       this.getMatchList(this.pageNo);
                   }
               }
            })             
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getMatchList(Number(num));
            }
        },        
        getMatchList(num){
            console.log("num",num);
            var self = this;
            if(num){
                self.pageNo = num;
            }            
            var parems = {
                searchContent:self.matchTitle||'',
                pageSize:self.pageSize,
                pageNo:self.pageNo
            };
            self.$http.get(self.$server.getHwEduList(parems)).then(res=>{
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
                    self.data = listIds;
                    self.pageData.totalNum = contentdate.total;
                    self.pageData.currentPage = num; 
               }
                console.log(res);
            }).catch((err)=>{
            })             
        }
    }
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
</style>

<style scoped lang="scss">
.matchIDBoxHw{
    width: 100%;
    padding: 20px;
    background-color: #ffffff;    
    .matchingSelect{
        width: 100%;
        margin: 0 0 10px 0;
    }
    .matchTableList{
        width: 100%;
        padding:10px 0;
        .tableTitle{
            display: -webkit-inline-box;
            padding:10px 0;
            p{
                padding: 0 10px;
            }
            i{
                color: #B4272D;
            }
        }
    }
    .paginBox{
        width: 100%;
        text-align: center;        
    }
    .el-icon-question{
        color: rgb(64, 158, 255);
    }    
}
</style>


