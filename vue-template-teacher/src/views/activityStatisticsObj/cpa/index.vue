<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>            
            <el-col class="lRight-r">
                <el-button type="primary" v-if="$authJudge('statistics:cpa:edit')" @click="createTableOrDeite(1,'')">新建CPA链接</el-button>
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
                        min-width="50">
                    </el-table-column>
                     <el-table-column
                        label="链接"
                        align="center"
                        min-width="200"
                        show-overflow-tooltip>
                            <template slot-scope="scope"> 
                                <div v-if='urlScienceBools==1'>
                                    <span v-if='scope.row.type==1'>
                                        {{'https://xgxm.xueguoxue.com/h5/cpaActivities/index.html?type=1&id='+scope.row.originId}}
                                    </span>
                                    <span v-else-if="scope.row.type==2">
                                        {{'https://xgxm.xueguoxue.com/h5/cpaChildActivities/index.html?type=2&id='+scope.row.originId}}
                                    </span>
                                    <span v-else>
                                        {{'https://xgxm.xueguoxue.com/h5/cpaSynthesizeActivities/index.html?type=3&id='+scope.row.originId}}
                                    </span>
                                </div> 
                                <div v-else>
                                    <span v-if='scope.row.type==1'>                                    
                                        {{'https://scm.youfushuyuan.com/h5/cpaActivities/index.html?type=1&id='+scope.row.originId}}
                                    </span>
                                    <span v-else-if="scope.row.type==2">                                    
                                        {{'https://scm.youfushuyuan.com/h5/cpaChildActivities/index.html?type=2&id='+scope.row.originId}}
                                    </span>
                                    <span v-else>                                    
                                        {{'https://scm.youfushuyuan.com/h5/cpaSynthesizeActivities/index.html?type=3&id='+scope.row.originId}}
                                    </span>
                                </div>                                         
                            </template>  
                    </el-table-column>
                    <el-table-column
                        label="类型"
                        align="center"
                        min-width="100">
                            <template slot-scope="scope"> 
                                <div v-if='scope.row.type==1'>成人</div> 
                                <div v-else-if="scope.row.type==2">少儿</div>   
                                <div v-else>综合</div>                                  
                            </template>
                    </el-table-column>
                    <el-table-column
                        prop="flag"
                        label="标识"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="创建时间"
                        align="center"
                        min-width="150"
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
                        prop="visitNum"
                        label="操作"
                        align="center"
                        >
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type="text" :class="`copyurl${scope.row.originId}`" :data-clipboard-text="newUrls(scope.row.originId,scope.row.type)" @click="copyEvenChange(scope.row.originId)">复制</el-button> 
                                    <el-button type="text" size="small" v-if="$authJudge('statistics:cpa:edit')" @click="createTableOrDeite(2,scope.row)">编辑</el-button>
                                    <el-button type="text" size="small" v-if="$authJudge('statistics:cpa:detail')" @click="detailEven(scope.row)">详情</el-button>
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
            </el-col> 
        </el-row>   
    <el-dialog
    :visible.sync="specialListProhibitDialog"
    :close-on-click-modal='false'
    :close-on-press-escape='false'
    title=""
    max-height="300"
    width="35%">  
        <div class="dialogBox">
            <div style="margin-bottom:15px;">
                <el-radio-group v-model="radio" @change="selectRadio" :disabled='isEdit'>
                    <el-radio :label="1">成人</el-radio>
                    <el-radio :label="2">少儿</el-radio>
                    <el-radio :label="3">综合</el-radio>
                </el-radio-group>
            </div>
            <p class='tips1'>
                添加链接来源ID
            </p>
            <div class="one">
                <div>
                    <span v-if='radio==1'>
                        https://xgxm.xueguoxue.com/h5/cpaActivities/index.html?type=1&id=
                    </span> 
                    <span v-if='radio==2'>
                        https://xgxm.xueguoxue.com/h5/cpaChildActivities/index.html?type=2&id=
                    </span>
                    <span v-if='radio==3'>
                        https://xgxm.xueguoxue.com/h5/cpaSynthesizeActivities/index.html?type=3&id=
                    </span>
                </div>
                <el-input v-model="numberIds"
                    :disabled='isEdit'
                    placeholder="只能填整数"
                    style="width:100px;margin-left:5px;"
                    ></el-input>
            </div>
            <p class='tips2'>如果没有来源ID，请到用户管理系统--用户来源中新建来源</p>
            <div class='numBox'>
                添加标识:
                 <el-input v-model="title"
                    placeholder=""
                    maxlength="10"
                    style="width:250px;"
                    show-word-limit
                    ></el-input>
            </div>
        </div>
        <div class="lCenter-r lMarginTop30">
            <el-button @click="resetDialog">取消</el-button>
            <el-button type="primary" @click="prohibit">确定</el-button>               
        </div>
    </el-dialog>     
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import Clipboard from 'clipboard';
export default {
    data(){
        return {
            tableData: [],
            pageNo:1,
            pageSize:10,
            loading:true,
            specialListProhibitDialog:false,
            titleList:[
                {
                    name:'统计',
                    pathInfo:'/isCourseCount/count'
                },
                {
                    name:'CPA活动统计',
                    pathInfo:''
                }
            ], 
            title:'',
            isEdit:false,
            numberIds:'',
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            id:'',
            urlScienceBools:1,
            radio:1,
            radioType:1
        }
    },
    components:{
        breadcrumb
    },
    watch:{},
    created(){    
        if(process.env.NODE_ENV == 'production'){
            if(process.env.argv=='beta'){
                //仿生
                this.urlScienceBools = 2;
            }else{
                //正式
                this.urlScienceBools = 1;
            }
        }else{
            //仿生
            this.urlScienceBools = 2;
        } 
        this.getCourseVisitRank(1);
    },
    mounted(){},
    methods:{
        newUrls(id,type){
            let self = this;
            let urls ='';
            if(this.urlScienceBools==1){
                switch (type) {
                    case 1:
                        urls = 'https://xgxm.xueguoxue.com/h5/cpaActivities/index.html?type=1&id='+id;
                        break;
                    case 2:
                        urls = 'https://xgxm.xueguoxue.com/h5/cpaChildActivities/index.html?type=2&id='+id;
                        break;
                    case 3:
                        urls = 'https://xgxm.xueguoxue.com/h5/cpaSynthesizeActivities/index.html?type=3&id='+id;
                        break;
                    default:
                        break;
                }
                
            }else{
                switch (type) {
                    case 1:
                        urls = 'https://scm.youfushuyuan.com/h5/cpaActivities/index.html?type=1&id='+id;
                        break;
                    case 2:
                        urls = 'https://scm.youfushuyuan.com/h5/cpaChildActivities/index.html?type=2&id='+id;
                        break;
                    case 3:
                        urls = 'https://scm.youfushuyuan.com/h5/cpaSynthesizeActivities/index.html?type=3&id='+id;
                        break;
                    default:
                        break;
                }
                
            }
            return urls;
        },        
        //复制
        copyEvenChange(id){ 
            var self = this;
          var clipboard = new Clipboard('.copyurl'+id);  
            clipboard.on('success',function(e){
                    // 释放内存 
                    clipboard.destroy();
                    self.$message.success({ message: "复制成功" });
                })  
            clipboard.on('error',function(e){
                    console.log('该浏览器不支持自动复制')  
                    //// 释放内存 
                    clipboard.destroy();
                })  
        },
        selectRadio(data){
            console.log(data)
        },
        createTableOrDeite(type,data){
            if(type==1){
                this.isEdit = false;
                this.numberIds = '';
                this.title = '';
            }else{
                this.isEdit = true;
                this.id=data.id;
                this.numberIds = data.originId;
                this.title = data.flag;
                this.radio = data.type;
            }
            this.specialListProhibitDialog = true;
        },
        detailEven(data){
            this.$router.push({
                path:'/activityStatistics/cpa/detail',
                query: {
                        id:data.id
                    }                    
                });
        },
        //取消
        resetDialog(){
            this.specialListProhibitDialog = false;
        },
        //确定
        prohibit(){
            let query = {
                originId:this.numberIds,
                flag:this.title,
                type:this.radio
            }
            if(this.isEdit){
              query['id']=  this.id;
            }
            this.$http.post(this.$server.cpaSaveCpa,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    this.specialListProhibitDialog = false;
                    this.radio = 1;
                    this.title = '';
                    this.id ='';
                    this.numberIds ='';
                    this.isEdit = false;
                    this.getCourseVisitRank(1);
                    this.$message.success(this.isEdit?'编辑成功.':'新建成功.');
                }
            })            
        },
        /**
         * 获取课程点击排行
         */
        getCourseVisitRank(num){
            let self = this;
            this.loading = true;
            if(num){
                this.pageNo = num;
            }
            let query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(this.$server.cpaGetCpaList,query).then(res=>{
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
                    self.loading = false; 
                }
            })
        },          
        //分页
        childPageValue(num){
            if(Number(num)>0){
                this.getCourseVisitRank(Number(num))
            }                
        } 
    }
}
</script>
<style  scoped lang="scss">
@import "../../../components/formSynthesisPlugin/my-component.css";
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
.dialogBox{
    .one{
        display: flex;
        flex-direction: row;
        justify-content:flex-start;
        align-items: center;
    }
    .tips2,.numBox,.one{
        margin-top: 15px;
    }
}
</style>


