<template>
    <div>
        <!-- <div class="page-wrap course-list" v-show="!boolpluginForDetail"> -->
        <div class="page-wrap course-list-copy" >
            <div class="page-head">
                <section class="page-title clearfix">
                    <!-- <h2 class="fl">课程管理</h2> -->
                    <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                    <div class="fr">
                        <el-button v-if="$authJudge('course:course:add')" @click="$router.push('/course/createCopy')" class="red-btn">新增课程</el-button>
                        <el-button v-if="$authJudge('course:course:export')" @click="exportTable" class="red-btn">导出</el-button>
                    </div>
                </section>
                <section>
                    <el-row class="filtrate-wrap">
                        <el-col class="filtrate-title">
                            <h3>筛选</h3>
                        </el-col>
                        <el-col class="filtrate-input">
                            <el-input v-model.trim="form.title"
                                    placeholder="请输入标题"></el-input>
                        </el-col>

                        <el-col class="filtrate-select">
                            <el-select v-model="form.courseStatus"
                                    clearable
                                    placeholder="课程状态">
                                <el-option v-for="(item,i) in pageConstant.courseStatusList"
                                        :key="i"
                                        :label="item.name"
                                        :value="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col class="filtrate-select">
                            <el-select v-model="form.courseType"
                                    clearable
                                    placeholder="课程类型">
                                <el-option v-for="(item,i) in pageConstant.courseTypeMap"
                                        :key="i"
                                        :label="item.name"
                                        :value="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col class="filtrate-select">
                            <el-select v-model="form.pipelineId"
                                    clearable
                                    placeholder="课程渠道">
                                <el-option v-for="(item,i) in (pageConstant.pipelineList)"
                                        :key="i"
                                        :label="item.name"
                                        :value="Number(item.channelId)"></el-option>
                            </el-select>
                        </el-col>  
                        <el-col class="filtrate-select">
                            <el-select v-model="form.mtype"
                                    clearable
                                    placeholder="类型">
                                <el-option v-for="(item,i) in mTypeArr"
                                        :key="i"
                                        :label="item.label"
                                        :value="Number(item.value)"></el-option>
                            </el-select>
                        </el-col> 
                        <el-col class="filtrate-select" style="margin-left: 46px;">
                            <el-select v-model="classltyValOne"
                                    clearable 
                                    @change="classltyValOneChange"
                                    @clear='clearEven'
                                    placeholder="一级分类">
                                <el-option v-for="(item,i) in classltyOne"
                                        :key="i"
                                        :label="item.name"
                                        :value="Number(item.id)"></el-option>
                            </el-select>
                        </el-col>
                        <el-col class="filtrate-select">
                            <el-select v-model="classltyValTwo"
                                    clearable
                                    placeholder="二级分类">
                                <el-option v-for="(item,i) in classltyTwo"
                                        :key="i"
                                        :label="item.name"
                                        :value="Number(item.id)"></el-option>
                            </el-select>
                        </el-col>                                                
                        <el-col class="filtrate-execute">
                            <div class="search-btn tc" v-if="$authJudge('course:course:select')"
                                @click="search">查询</div>
                        </el-col>                        
                    </el-row>
                </section>
            </div>
            <div class="page-content coursePageStyle">
                <el-table :data="pageData.items"
                        border
                        v-loading="loading"
                        header-cell-class-name="list-header-layout-bg"
                        style="width: 100%">
                    <el-table-column label="序号"
                                    prop="sortId"
                                    align="center"
                                    min-width="60">
                    </el-table-column>                        
                    <el-table-column label="ID"
                                    align="center"
                                    min-width="60">
                        <template slot-scope="scope">
                            {{scope.row.id}}
                        </template>
                    </el-table-column>
                    <el-table-column label="名称"
                                    align="center"
                                    min-width="200">
                        <template slot-scope="scope">
                            <div class="cell clearfix cu" 
                                @click="$router.push(`/course/manageCopy/${scope.row.id}?type=${scope.row.courseStatus == courseStatus.soldOut?'preview':(scope.row.courseStatus == courseStatus.draft?'draft':'editor')}`)">
                                <div class="fl course-img">
                                    <img :src="scope.row.surfacePlot"
                                        alt="">
                                </div>
                                <div class="fl course-details">
                                    <h4 class="course-title text-ellipsis tl"
                                        :title="scope.row.title">{{scope.row.title}}</h4>
                                    <div class="course-price tl" v-if="scope.row.sellingPrice>0">{{scope.row.sellingPrice}}夫子币</div>
                                    <div class="course-price tl" v-else>免费</div>                                
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="courseTypeStr"
                                    label="课程类型"
                                    align="center"
                                    min-width="80">
                    </el-table-column>
                    <el-table-column label="课时数"
                                    align="center"
                                    min-width="70">
                        <template slot-scope="scope">
                            {{scope.row.auditPassNum}}/{{scope.row.planPeriodNum}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="pipelineName"
                                    label="渠道"
                                    align="center"
                                    min-width="80">
                    </el-table-column>                    
                    <el-table-column label="状态"
                                    align="center"
                                    min-width="80">
                        <template slot-scope="scope">
                            {{scope.row.parentId>0? `${scope.row.courseStatusStr}`:scope.row.courseStatusStr}}
                        </template>
                    </el-table-column>
                    <el-table-column 
                                    align="center"
                                    label="类型"
                                    min-width="80">
                                    <template slot-scope="scope">
                                        <P>{{scope.row.mtype==1?'成人':'少儿'}}</P>
                                    </template>                                 
                    </el-table-column>
                    <el-table-column 
                        prop="courseBrowsCount"
                        align="center"
                        label="播放量"
                        min-width="70">               
                    </el-table-column>                                   
                    <el-table-column prop="upshelveTime"
                                    :show-overflow-tooltip="true"
                                    label="上架时间"
                                    align="center"
                                    min-width="130">
                    </el-table-column>
                    <el-table-column prop="downshelveTime"
                                    :show-overflow-tooltip="true"
                                    label="下架时间"
                                    align="center"
                                    min-width="130">
                    </el-table-column>                                        
                    <el-table-column prop="name"
                                    label="操作"
                                    class-name="handle-wrap-layout"
                                    min-width="220">
                        <template slot-scope="scope">
                            <!-- 显示规则 -->
                            <!-- 上线状态 -->
                            <el-button 
                                    v-if="$authJudge('course:course:down')"
                                    v-show="scope.row.courseStatus == courseStatus.putaway"
                                    type="text"
                                    class="black-btn"
                                    @click="soldOut(scope.row)">下架</el-button>
                            <!-- 草稿 || 审核失败 -->
                            <el-button
                                    v-if="$authJudge('course:course:edit')" 
                                    v-show="scope.row.courseStatus == courseStatus.draft || scope.row.courseStatus == courseStatus.putaway"
                                    type="text"
                                    class="black-btn"
                                    @click="$router.push(`/course/manageCopy/${scope.row.id}?type=${scope.row.courseStatus == courseStatus.soldOut?'preview':(scope.row.courseStatus == courseStatus.draft?'draft':'editor')}`)">编辑</el-button>
                          
                            <!-- 非校编辑副本 && （草稿 || 审核失败） -->
                            <el-button v-if="(scope.row.courseStatus == courseStatus.draft)&&$authJudge('course:course:del')"
                                    type="text"
                                    @click="delCourse(scope.row)"
                                    class="black-btn">删除</el-button>
                            <el-button v-if="$authJudge('course:course:relationrecom')" type="text" class="black-btn">
                                    <span @click="setCreamEven(scope.row)">课程推荐</span>
                                    <div v-show="scope.row['courseMappingVoList'].length>0" class="i-div">{{scope.row['courseMappingVoList'].length}}</div>
                            </el-button>        
                            <el-button
                                    v-if="$authJudge('course:course:evaluation')"
                                    type="text"
                                    class="black-btn"
                                    @click="cmmentEven(scope.row)">测评</el-button>   
                            <el-button
                                    type="text"
                                    v-if="$authJudge('course:course:evaluation')"
                                    class="black-btn specialbut"
                                    @click="labelEven(scope.row)">标签
                                        <div v-if="scope.row.labelNum!=0" class="labelNumber">{{scope.row.labelNum}}</div>
                                    </el-button>
                            <el-button
                                    v-if="$authJudge('course:course:studyprogress')"
                                    type="text"
                                    class="black-btn"
                                    @click="progressEven(scope.row)">进度查询</el-button>  
                            <el-button
                                    v-if="$authJudge('course:course:up')"
                                    v-show="scope.row.courseStatus==4"
                                    type="text"
                                    class="black-btn"
                                    @click="courseUp(scope.row)">上架</el-button>           
                            <el-button v-if="$authJudge('course:course:browse')" type="text" class="handle-btn" @click="dialogShow(scope.row)">追加播放量</el-button>
                            <el-button v-if="$authJudge('course:course:recommendation')" type="text" class="black-btn" @click="goodThingsDeging(scope.row)">
                                    <span>好物推荐</span>
                                    <div class="i-div" v-if="scope.row.goodsNum>0?true:false">{{scope.row.goodsNum}}</div>                                
                            </el-button>
                            <el-button
                                    type="text" course.advertisement
                                    v-if="$authJudge('course:course:advertisement')"
                                    class="black-btn"
                                    @click="circleEven(scope.row)">圈子</el-button>
                            <el-button
                                    type="text"
                                    v-if="$authJudge('course:course:circle')"
                                    class="black-btn"
                                    @click="advertisementEven(scope.row)">广告</el-button>                              
                            <!-- 更新审核中tips -->
                            <!-- <div class="is-auditing"></div> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <pagination :totalNum="pageData.totalNum"
                        :currentPage="pageData.currentPage"
                        class="paging" />
        </div>
        <el-dialog
        :visible.sync="dialogCmmentInputUrl"
        :close-on-click-modal='false'
        title="课程测评"
        center
        max-height="300"
        :show-close='false'
        width="25%">
            <el-row>
                <el-col class="lCenter-r">
                    <el-input v-model="cmmentInput" placeholder="请输入测评链接"></el-input>
                </el-col>
                <el-col class="lCenter-r lMarginTop30">
                    <el-button style="width:100px;" @click="closeRemove">取消</el-button>
                    <el-button style="width:100px;" class="redBackColor butColorF" @click="cmmentInputUrlEven">确定</el-button>
                </el-col>
            </el-row>
        </el-dialog>    
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="false"
        width="40%"
        >
            <div class="centerCss">
                   <!-- <courseListPlugin v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIds" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>     -->
                   <courseListPlugin v-if="dialogVisibleFour" v-on:listSelect="listSelectEven" :varObjs='varObj' :relevanceId="relevanceId" :chooseIdlist="courseIds" :urlPorp="urls" :numbersBool="4" :courseType="'course'"></courseListPlugin>      
            </div>                    
        </el-dialog>             
        <!-- <courseselect v-on:listSelect="listSelectEven" :relevanceId="relevanceId" :chooseIdlist="courseIds" :urlPorp="urls" :numbersBool="4" v-if="boolpluginForDetail" :courseType="'course'"></courseselect>             -->
        <el-dialog
            title=""
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :width="'350px'"
            :top="'30vh'"
            v-loading="dialogLoading"
            center>
            <div>
                <label>追加数量</label>
                <el-input style="width:200px;margin-left:10px" maxlength="8" v-model="num" placeholder="1-10000000"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCourseBrowsCount">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog  :custom-class="'edit-dialog'" 
                    :visible.sync="dialogGoodThings" 
                    :width="'960px'" 
                    :show-close="false"
                    :close-on-click-modal="false">
            <div class="search-box">
                <el-input style="width:200px;" placeholder="好物商品名称或者商品描述" size="medium" clearable prefix-icon="el-icon-search" v-model="searchKey" maxlength="10"></el-input>
                <div style="margin:0 10px;">
                    <el-select v-model="value" style="width:150px;height: 36px;" placeholder="请选择" class="goodThingsCss"  @change="currentSelect(1)">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>                        
                </div>    
                <el-button type="primary" style="margin-left:5px;" size="medium" @click="searchCommod">搜索</el-button>
                <div style="line-height: 36px;margin-left: 28%;">已选中{{dialogArr.length||0}}个商品</div>
            </div>
            <div class="list" ref="scrollBox">
                <el-checkbox-group 
                    v-model="dialogArr"
                    :min="0"
                    :max="EditDialogMaxNum">
                    <div class="item nameTextEllipsis" v-for="(item,index) in editDialogListNext" :key="index">
                        <el-checkbox :label="item.id" style="width:300px;float: left;padding: 10px 0" :disabled="item.disabled">{{item.goodsName}}</el-checkbox>
                        <div style='width:400px;font-size:14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>{{item.decs}}</div>
                        <div style='width:100px;font-size:14px;text-align: center;'>{{item.classifyName}}</div>
                        <div style='width:100px;font-size:14px;text-align: center;'>{{item.sellingPrice||0}}币</div>
                    </div>
                </el-checkbox-group>
                <div class="loading" v-show="loading"><div class="loading-icon" v-loading="true"></div></div>
                <p class="empty-tip" v-if="editDialogListNext.length==0">没有搜索到您想要的内容</p>
            </div>
            <div slot="footer" class="btns">
                <el-button @click="dialogSureCloe()" size="medium">取消</el-button>
                <el-button type="primary" @click="dialogSure" size="medium">确定</el-button>
            </div>
        </el-dialog> 
        <el-dialog
            title=""
            :visible.sync="circleDialogVisible"
            :close-on-click-modal="false"
            :width="'800px'"
            :top="'30vh'"
            v-loading="dialogLoading"
            center>
            <div>
                <div style="display: flex;flex-direction: row;align-items: start;margin-top:10px;">
                     <div style="width:100px;text-align: center;">圈子文案</div>
                    <div class="my-course-editor" v-if="circleDialogVisible">
                        <Editor v-model="introduce"/>
                    </div>
                </div>               
                <div style="display: flex;flex-direction: row;align-items: center;margin-top:10px;">
                    <div style="width:100px;text-align: center;">添加微信ID</div>
                    <el-input style="margin-left:10px;width:660px;" maxlength="30" v-model="circleWxVal"></el-input>
                    <div style="width:60px">{{circleWxVal.length||0}}/30</div>
                </div> 
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addcircle(false)">取 消</el-button>
                <el-button type="primary" @click="addcircle(true)">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title=""
            :visible.sync="advertisementDialogVisible"
            :close-on-click-modal="false"
            :width="'500px'"
            :top="'30vh'"
            v-loading="dialogLoading"
            center>
                <div style="display: flex;flex-direction: row;align-items: center;">
                    <div style="width:100px;text-align: right;">广告语</div>
                    <el-input style="width:200px;margin-left:10px" maxlength="30" v-model="advertisementContent"></el-input>
                    <div style="padding:0 15px;">{{advertisementContent.length||0}}/30</div>
                </div>
                <div style="display: flex;flex-direction: row;align-items: center;margin-top:10px;">
                    <div style="width:100px;text-align: right;">添加微信ID</div>
                    <el-input style="width:200px;margin-left:10px" maxlength="30" v-model="advertisementWxVal"></el-input>
                    <div style="padding:0 15px;">{{advertisementWxVal.length||0}}/30</div>
                </div>            
            <span slot="footer" class="dialog-footer">
                <el-button @click="addadvertisement(false)">取 消</el-button>
                <el-button type="primary" @click="addadvertisement(true)">确 定</el-button>
            </span>
        </el-dialog>        
    </div>
</template>

<script>
/*

    draft: 0,//草稿
    draftTwo:9
    auditing: 1,//审核中
    auditFail: 2,//审核失败
    putaway: 3,//上架
    soldOut: 4,//下架
    schooleditwait:5,//校编辑待审核
    schoolediterroer:6,//校编辑审核失败
    updateWait:7,//更新待审核
    updateError:8 //更新审核失败
    
*/
import datalist from '../../../components/formSynthesisPlugin/gxTitleList';
import pagination from "@/components/pagination";
import courseStatus from "@/utils/courseStatus";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
// import courseselect from "@/components/Appconfigpage/ACourseSelect/coursesselectcret"; //推存选择课程组件
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin"; //推存选择课程组件
import { getToken } from '@/utils/auth';
let titleList = new datalist()
export default {
    data() {
        return {
            form: {
                title: "",
                courseStatus: "",
                courseType: "",
                pipelineId:'',
                mtype:'',
                category:'',
                classifyType:''
            },
            pageConstant: {},
            mTypeArr:[
                {label:'全部',value:0},
                {label:'成人',value:1},
                {label:'少儿',value:2}
            ],
            pageData: {},
            loading: false,
            dialogGoodThings:false,
            creamId:'',
            creamBools:false,
            relevanceId:'',
            urls:'',
            courseIds:[],
            courseIdsSort:[],
            classltyOne:[],
            classltyTwo:[],
            classltyValOne:'',
            classltyValTwo:'',            
            courseIdsFormId:{},
            cmmentInput:'',
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            },                      
            dialogCmmentInputUrl:false,
            titleList:[
                {
                    name:'课程',
                    pathInfo:''
                },
                {
                    name:'课程管理',
                    pathInfo:''
                }                                               
            ],            
            value:-1,
            options:[],
            selectCommnetId:'',
            courseStatus,
            dialogVisible:false,
            dialogLoading:false,
            editDialogList:[],
            editDialogListNext:[],
            num:'',
            id:'',
            dialogArr:[],
            searchKey:'',
            selectData:'',           
            EditDialogMaxNum:10,
            //新组建
            dialogVisibleFour:false,
            varObj:{
                mtypeText:false,
                pageType:false
            },
            circleDialogVisible:false,
            advertisementDialogVisible:false,
            advertisementContent:'',
            advertisementWxVal:'',
            circleWxVal:'',
            introduce:'',
            circleOrAdvertise:''
        };
    },
    metaInfo: {
        title: "课程列表"
    },
    components: {
        pagination,
        // courseselect,
        breadcrumb,
        courseListPlugin
    },
    watch: {
        $route() {
            this.pageData = { }
            this.init();
        },
        dialogArr(cur,old){
            if(this.editDialogList.length>0){
                this.courseCheckList =[];
                cur.forEach((item)=>{
                    let obj = this.editDialogList.find(option=>option.id==item);
                    if(obj){
                        this.courseCheckList.push({
                            id:obj.id,
                            assemblePrice:obj.sellingPrice,
                            title:obj.goodsName
                        });
                    }
                })
            }
        }             
    },
    created() {
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path;
        this.getConstant();
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }        
        // this.$store.state.appConfig.appStore.boolpluginForDetail=false;
        if(this.$route.query){
            this.form.mtype = this.form.mtype==0?'':this.form.mtype
        };

        // this.init()
        let queryurl = JSON.parse(JSON.stringify(this.$route.query));
        if(queryurl.homeType){
            this.initTow(queryurl);
        }else{
            this.init();
        }
        this.getClesslayListEven(1,'');
        
    },
    computed: {
        // boolpluginForDetail(){
        //     return this.$store.state.appConfig.appStore.boolpluginForDetail
        //     }
        },    
    methods: {
        init() {
            this.loading=true;
            let queryurl = JSON.parse(JSON.stringify(this.$route.query));            
            let query = {};
            if(this.classltyValOne!=''&&this.classltyValOne!=undefined&&!this.classltyValTwo){
                query = {
                    title:this.form.title,
                    courseStatus:this.form.courseStatus==-1?'':this.form.courseStatus,
                    pipelineId:this.form.pipelineId==-1?'':this.form.pipelineId,
                    mtype:this.form.mtype==-1?'':this.form.mtype,
                    courseType:this.form.courseType>0?this.form.courseType:'',
                    category:this.classltyValOne,
                    classifyType:1                    
                };
            }else if(this.classltyValOne!=''&&this.classltyValOne!=undefined&&this.classltyValTwo!=''&&this.classltyValTwo!=undefined){
                query = {
                    title:this.form.title,
                    courseStatus:this.form.courseStatus==-1?'':this.form.courseStatus,
                    pipelineId:this.form.pipelineId==-1?'':this.form.pipelineId,
                    mtype:this.form.mtype==-1?'':this.form.mtype,
                    courseType:this.form.courseType>0?this.form.courseType:'',
                    category:this.classltyValTwo,
                    classifyType:2                    
                };
            }else{
                query = {
                    title:this.form.title,
                    courseStatus:this.form.courseStatus==-1?'':this.form.courseStatus,
                    pipelineId:this.form.pipelineId==-1?'':this.form.pipelineId,
                    courseType:this.form.courseType>0?this.form.courseType:'',
                    mtype:this.form.mtype==-1?'':this.form.mtype,
                };
            }   
            query['page']=queryurl.page;
            this.$http
                .get(this.$server.courseIndex, {
                    params: query
                })
                .then(res => {
                        var contentdate = res.content;
                        var listIds = [];
                            listIds = contentdate.items.map(function(element,index){
                                if(contentdate.currentPage==1){
                                    element.sortId = index+1;
                                    return element;
                                }else if(contentdate.currentPage>1){
                                    element.sortId = (contentdate.currentPage-1)*10+index+1;
                                    return element;
                                }
                            }); 
                    res.content.items = listIds
                    this.pageData = res.content;
                    this.loading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                });
        }, 
        //圈子
        circleEven(data){
            this.selectData = data;
            this.circleOrAdvertise='';
            this.circleDialogVisible = true;
            this.$http.get(this.$server.getCircleByCourseId+data.id).then(res=>{
                if(res.status==200){
                    if(res.content){
                        this.circleOrAdvertise=res.content;
                        this.introduce=res.content.content;
                        this.circleWxVal=res.content.wechatNumber;
                    }else{
                        this.circleOrAdvertise='';
                        this.introduce='';
                        this.circleWxVal='';
                    }                    
                }
            })
        },
        //广告
         advertisementEven(data){
            this.selectData = data;                   
            this.advertisementDialogVisible = true;
            this.circleOrAdvertise='';
            this.$http.get(this.$server.getAdvertisementByCourseId+data.id).then(res=>{
                if(res.status==200){
                    if(res.content){
                        this.circleOrAdvertise=res.content;
                        this.advertisementContent=res.content.content;
                        this.advertisementWxVal=res.content.wechatNumber;   
                    }else{
                        this.circleOrAdvertise='';
                        this.advertisementContent='';
                        this.advertisementWxVal='';                         
                    }                 
                }
            })             
         },
        //添加广告
        addadvertisement(bool){
            if(!bool){
                this.advertisementDialogVisible = bool;
                this.advertisementContent='';
                this.advertisementWxVal='';                
                return;
            }            
            if(!this.advertisementContent&&this.advertisementWxVal){
                this.$message.error("广告语不能为空");
                return;
            }
            if(!this.advertisementWxVal&&this.advertisementContent){
                this.$message.error("微信id不能为空");
                return;
            }            
            var query = {
                id:this.circleOrAdvertise.id||'',
                courseId: this.selectData.id,    
                content:this.advertisementContent||'',
                wechatNumber:this.advertisementWxVal||''
            };
            this.$http.post(this.$server.saveOrUpdateCourseAdvertisement,query).then(res=>{
                if(res.status==200){
                    this.advertisementDialogVisible = false;
                    this.advertisementContent='';
                    this.advertisementWxVal='';
                    this.$message.success("保存成功");
                }
            })
        },
        //添加圈子
        addcircle(bool){
            var self = this;
            let str1 = `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
                <style>
                    .xgx-editor *{
                        cursor: text;
                        font-size: 16px!important;
                        font-family:'PingFangSC','STHeiti','Microsoft YaHei','Helvetica','Arial',sans-serif;
                    }
                    .xgx-editor ol,.xgx-editor p,.xgx-editor ul{
                        margin: 1em 0;
                        line-height: 1.5;
                    }
                    .xgx-editor hr{
                        margin: 3em 0 0 0;
                        border: 1px solid #e9e9e9;
                        border-width: 1px 0 0;
                    }
                    .xgx-editor blockquote{
                        padding: 12px 8px;
                        color: #999;
                        background-color: #f3f4f5;
                        margin: 10px 0;
                        border:none!important;
                    }
                    .xgx-editor blockquote span{
                        color:#999;
                    }
                    .xgx-editor blockquote p{
                        margin:0!important;
                        line-height: 1.4em!important;
                    }
                    .xgx-editor h1{
                        display:inline-block;
                        font-size: 1em;
                        line-height: 1.25em;
                        padding-left: 12px;
                        font-weight: 700;
                        border-left: 4px solid #f85959;
                        margin: 1em 0;
                    }
                    .xgx-editor img{
                        max-width:100%;
                    }
                    .xgx-editor h1 strong{
                        line-height:1.25em;
                    }
                    .xgx-editor h1 span{
                        font-size: 1em;
                        line-height: 1em;
                    }
                    .xgx-editor pre{
                        background: #f0f0f0!important;
                        color:#222!important;
                        border-radius: 3px;
                    }
                    .xgx-editor p{
                        word-wrap:break-word;
                    }
                    .xgx-editor ol li:not(.ql-direction-rtl),.xgx-editor ul li:not(.ql-direction-rtl){
                        padding-left:1.5em;
                    }
                    .xgx-editor ol > li{
                        list-style:none;
                    }
                    .xgx-editor ol,.xgx-editor ul{
                        padding:0px!important;
                    }
                    .xgx-editor ol > li::before{
                        content:counter(list-0, decimal) '. ';
                        display: inline-block;
                        white-space: nowrap;
                    }
                    .xgx-editor li:not(.ql-direction-rtl)::before{
                        margin-left: -1.6em;
                        margin-right: 0.3em;
                        text-align: right;
                    }
                    .xgx-editor ul > li::before{
                        content:'·';
                    }
                    .xgx-editor blockquote, .xgx-editor h1, .xgx-editor h2, .xgx-editor h3, .xgx-editor h4, .xgx-editor h5, .xgx-editor h6, .xgx-editor ol, .xgx-editor p, .xgx-editor pre, .xgx-editor ul{
                        counter-reset:list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
                    }
                    .xgx-editor ol li{
                        counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
                        counter-increment: list-0
                    }
                </style>`            
            if(!bool){
                self.circleDialogVisible = false;
                self.introduce='';
                self.circleWxVal='';                
                return;
            }   
            if(!this.circleWxVal&&this.introduce){
                this.$message.error("微信id不能为空");
                return;
            }
            if(this.circleWxVal&&!this.introduce){
                this.$message.error("圈子文案不能为空");
                return;
            }            
            if(this.introduce){
                if(this.introduce.replace(/\s+/g, "").replace(/<[^<>]+>/g,'').replace(/&nbsp;/ig,'').length>10000){
                    this.$message.error("圈子文案文字长度在 1 到 10000 个字符");
                    return ;
                }
            }         
            if(!this.circleWxVal&&!this.introduce){
                this.introduce = ''; 
            }else{
                this.introduce = str1+'<div class="xgx-editor">'+this.introduce+'</div>' 
            }  
            var query = {
                id:this.circleOrAdvertise.id||'',
                courseId: this.selectData.id,    
                content:this.introduce,
                wechatNumber:this.circleWxVal
            };
            self.$http.post(self.$server.saveOrUpdateCourseCircle,query).then(res=>{
                if(res.status==200){
                    self.circleDialogVisible = false;
                    self.introduce='';
                    self.circleWxVal='';
                    this.$message.success("保存成功");
                }
            })                 
        },
        exportTable(){
            var self = this;
            let queryurl = JSON.parse(JSON.stringify(this.$route.query));            
            let parems = {};
            var url = '';
            if(this.classltyValOne!=''&&this.classltyValOne!=undefined&&!this.classltyValTwo){
                parems = {
                    title:this.form.title,
                    courseStatus:this.form.courseStatus==-1?'':this.form.courseStatus,
                    pipelineId:this.form.pipelineId==-1?'':this.form.pipelineId,
                    mtype:this.form.mtype==-1?'':this.form.mtype,
                    courseType:this.form.courseType>0?this.form.courseType:'',
                    category:this.classltyValOne,
                    classifyType:1                    
                };
                parems['page']=queryurl.page;
                var url = self.$server.exportExcelCourseList+"?title="+parems.title+"&courseStatus="+parems.courseStatus+"&pipelineId="+parems.pipelineId+"&mtype="+parems.mtype+"&courseType="+parems.courseType+"&category="+parems.category+"&classifyType="+parems.classifyType+"&page="+parems.page+"&token="+getToken();                
            }else if(this.classltyValOne!=''&&this.classltyValOne!=undefined&&this.classltyValTwo!=''&&this.classltyValTwo!=undefined){
                parems = {
                    title:this.form.title,
                    courseStatus:this.form.courseStatus==-1?'':this.form.courseStatus,
                    pipelineId:this.form.pipelineId==-1?'':this.form.pipelineId,
                    mtype:this.form.mtype==-1?'':this.form.mtype,
                    courseType:this.form.courseType>0?this.form.courseType:'',
                    category:this.classltyValTwo,
                    classifyType:2                    
                };
                parems['page']=queryurl.page;
                var url = self.$server.exportExcelCourseList+"?title="+parems.title+"&courseStatus="+parems.courseStatus+"&pipelineId="+parems.pipelineId+"&mtype="+parems.mtype+"&courseType="+parems.courseType+"&category="+parems.category+"&classifyType="+parems.classifyType+"&page="+parems.page+"&token="+getToken();  
            }else{
                parems = {
                    title:this.form.title,
                    courseStatus:this.form.courseStatus==-1?'':this.form.courseStatus,
                    pipelineId:this.form.pipelineId==-1?'':this.form.pipelineId,
                    courseType:this.form.courseType>0?this.form.courseType:'',
                    mtype:this.form.mtype==-1?'':this.form.mtype,
                };
                parems['page']=queryurl.page;
                var url = self.$server.exportExcelCourseList+"?title="+parems.title+"&courseStatus="+parems.courseStatus+"&pipelineId="+parems.pipelineId+"&mtype="+parems.mtype+"&courseType="+parems.courseType+"&page="+parems.page+"&token="+getToken();                
            }   
            window.open(url);            
        },       
        searchCommod(){
            var that = this,
            list = [],
            list2 = [];
            that.editDialogList.forEach((element)=>{
                if(element.goodsName.indexOf(that.searchKey)!=-1||element.decs.indexOf(that.searchKey)!=-1){
                    list.push(element);
                }
            });
            if(that.value!=-1){
                list.forEach((element)=>{
                        if(that.value==element.classifyId){
                            list2.push(element);
                        }
                });
            }else{
                list2 = list;
            }
            this.editDialogListNext = list2;            
        },
        goodThingsDeging(data){
                var self = this;
                self.selectData = data;
                var params = {
                    courseId: data.id    
                };
                self.$http.get(self.$server.getFindGoodsIdsByCourseId,{params}).then(res=>{
                    if(res.status==200){
                        self.dialogArr = res.content.goodsIds;
                        // this.goodThingsList();
                        this.getProgramList();
                    }
                })                 
        },
        //获取列表信息；
        getProgramList(){
            var self = this;   
            var params = {
                classifyName:''
            };
            self.$http.get(self.$server.getGoodsClassifyList,{params}).then(res=>{
               if(res.status==200){
                   var listIds = [{
                        label:'分类',
                        value:-1                         
                   }];
                   var contentdate = res.content;     
                   contentdate.forEach((element,index)=>{
                       listIds.push({
                           value:element.id,
                           label:element.classifyName   
                       });
                   });     
                    self.options = listIds;
                    self.goodThingsList();
               }
            })             
        },        
        goodThingsList(){
                var self = this;
                var params = {
                    goodsName:'',
                    pageSize:9999,
                    pageNo:1       
                };
                self.$http.get(self.$server.getGoodsList,{params}).then(res=>{
                    if(res.status==200){
                        var listIds = [];
                        var contentdate = res.content;
                        var nextPage = contentdate.nextPage;
                        var prePage = contentdate.prePage; 
                        if(contentdate.list.length){
                                contentdate.list.forEach((element,index)=>{
                                    listIds.push({
                                        id:element.id,
                                        decs:element.goodsDesc,
                                        goodsName:element.goodsName,
                                        classifyName:element.classifyName,
                                        sellingPrice:element.goodsPrice,
                                        classifyId:element.classifyId
                                    });
                                }); 
                        }; 
                        self.editDialogListNext = listIds;
                        self.editDialogList = listIds;
                        self.dialogGoodThings = true;
                    }
                })            
        },               
        dialogSure(){
            let that = this;
            this.editDialogList =[];   
            this.dialogArr = [];
            that.searchKey ='';
            this.dialogGoodThings = false; 
            this.courseCheckList.forEach((element,index)=>{
                this.dialogArr.push(Number(element.id));
            });  
            var query = {      
                courseId:this.selectData.id,
                goodsId:this.dialogArr.toString()
            };
            that.$http.post(that.$server.getgoodsRecommendation,query).then(res=>{
                if(res.status==200){
                    that.$message.success('好物推荐成功');
                    that.selectData = '';
                    that.init();     
                }
            })  
        },
        dialogSureCloe(){
            this.editDialogList =[];
            this.dialogArr =[];
            this.dialogGoodThings = false;
            this.searchKey = '';
        },                
        initTow(data) {
            let query = {};
            query = {
                title:'',
                courseStatus:data.courseStatus,
                pipelineId:'',
                courseType:data.courseType,
                mtype:'',
            };
            query['page']=1;
            this.$http
                .get(this.$server.courseIndex, {
                    params: query
                })
                .then(res => {
                        var contentdate = res.content;
                        var listIds = [];
                            listIds = contentdate.items.map(function(element,index){
                                if(contentdate.currentPage==1){
                                    element.sortId = index+1;
                                    return element;
                                }else if(contentdate.currentPage>1){
                                    element.sortId = (contentdate.currentPage-1)*10+index+1;
                                    return element;
                                }
                            }); 
                    res.content.items = listIds
                    this.pageData = res.content;
                    this.loading = false;
                    this.form.courseStatus = Number(data.courseStatus);  
                    this.form.courseType = Number(data.courseType);                    
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                });
        },                  
        classltyValOneChange(data){
            this.getClesslayListEven(2,data);
        },
        clearEven(){
            this.classltyValOne='';
            this.classltyValTwo='';
        },
        getClesslayListEven(type,data){
            let params={};
            if(type==1){
                params = {
                    classifiesType:1
                };
            }else{
                params = {
                    classifiesType:2,
                    id:data
                };
            }
            this.$http.get(this.$server.getCategoryGetList,{params}).then(res => {
                var list =[];
                list = res.content;
                if(type==1){
                    this.classltyOne = list;
                }else{
                    this.classltyTwo = list;
                }
            })           
        },
        progressEven(data){
            this.$router.push({path:'/courseprogress',query:{selectId:data.id}});
        },
        isIntNumber(str) {
            return /^\d+$/.test(str);
        },
        labelEven(data){
            var self = this;
            self.$router.push({path:'/courseLableModel',query:{selectId:data.id,mtype:data.mtype}});   
        },
        cmmentEven(res){
            this.selectCommnetId = res.id;
            if(res.evaluationLink){
                this.cmmentInput=res.evaluationLink;
            }else{
                this.cmmentInput=null;
            }
            this.dialogCmmentInputUrl = true;
        },
        closeRemove(){
            this.cmmentInput=null;
            this.dialogCmmentInputUrl = false;
        },
        cmmentInputUrlEven(){
            // if(!this.cmmentInput){
            //     self.$message.error('请输入路径.');
            // }
            var self = this;
            // var strRegex = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/|www\.)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
            var strRegex = /(http|https):\/\/\S*/;
            var re=new RegExp(strRegex);     
            if(this.cmmentInput&&this.cmmentInput.length>0){
                if(!re.test(this.cmmentInput)){
                    self.cmmentInput = '';
                    self.$message.error("测评链接错误");
                    return;
                }
            }
            var parems = {
                evaluationLink:this.cmmentInput,
                id:this.selectCommnetId
            }
            this.$http
                .post(this.$server.addCmmentCourseurl,parems)
                .then(res => {
                    this.dialogCmmentInputUrl = false;
                    this.init();
                })
                .catch(err => {
                    console.log(err);
                });            
        },
        search() {
            if(this.form.mtype==0){
                this.form.mtype = ''
            }
            if(this.form.courseStatus!=0&&this.form.courseStatus!=3&&this.form.courseStatus!=4){
                this.form.courseStatus =-1;
            }
            // this.$router.push({
            //     path: "/courseCopy",
            //     query: this.form
            // });
            this.init();
        },
        getConstant() {
            this.$http
                .get(this.$server.courseConstant)
                .then(res => {
                    res.content.courseTypeMap[0] = {name: "全部", value: -1};
                    res.content.courseStatusList= [{name: "全部", value: -1}].concat(res.content.courseStatusList);
                    // res.content.courseCategoryList = [{name: "全部", value: -1}].concat(res.content.courseCategoryList);
                    this.pageConstant = res.content;
                })
                .catch(err => {
                    console.log(err);
                });
        },

        ajaxCourseIds(idlist,type){
            var self = this;         
            self.$http
                .post(this.$server.relevanceCourseId({courseId:self.relevanceId}),{"courseMappingParamForms": JSON.stringify(idlist)})
                .then(res => {
                    if(res.status==200){
                        self.init();
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                });            
        },
        setCreamEven(item){
            var self = this;
            var idlist = [];
            self.urls = "/course/selectCourse?courseId="+item.id;
            item.courseMappingVoList.forEach(function(element,index){
                idlist.push(JSON.stringify(element["courseMappingId"]));
            });
            // self.courseIdsFormId[item.id] = idlist;
            self.relevanceId = item.id;
            self.courseIds =idlist;
            self.dialogVisibleFour = true;
            // self.$store.state.appConfig.appStore.boolpluginForDetail=true;            
        },
        listSelectEven(data){
            var self = this;
            if(data.bool){
                self.courseIds =[];
                self.courseIdsSort=[];
                // self.$store.state.appConfig.appStore.boolpluginForDetail=false;
                self.dialogVisibleFour = false;
                self.courseList = data.datas;
                var i=0;
                data.datas.forEach(element => {
                    i++;
                    self.courseIds.push(element.content);
                    self.courseIdsSort.push({"courseId":element.content,"sort":i});             
                });
                self.ajaxCourseIds(self.courseIdsSort);
            }else{
                self.dialogVisibleFour = false;
            }

        },         
        delCourse(item) {
            let self = this;
            this.$confirm("确定要删除这个课程吗？", "课程删除提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                customClass: "common-confirm-layout common-confirm-hide-icon",
                type: "warning"
            })
                .then(() => {
                    self.$http
                        .delete(`${this.$server.course}/${item.id}`)
                        .then(res => {
                            if (res.status === 200) {
                                self.init();
                                self.$message({
                                    message: "课程删除成功,正在获取最新数据！",
                                    type: "success"
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        soldOut(item) {
            let self = this;
            this.$confirm("确定要下架这个课程吗？", "下架提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                customClass: "common-confirm-layout common-confirm-hide-icon",
                type: "warning"
            })
                .then(() => {
                    self.$http
                        .put(this.$server.courseDown(item.id))
                        .then(res => {
                            if (res.status === 200) {
                                self.init();
                                self.$message({
                                    message: "课程下架成功,正在获取最新数据！",
                                    type: "success"
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        /**
         * 上架
         */
        courseUp(obj){
            this.$confirm("确定要上架这个课程吗？", "上架提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                customClass: "common-confirm-layout common-confirm-hide-icon",
                type: "warning"
            })
            .then(()=>{
                this.$http.post(this.$server.courseUp(obj.id)).then(res=>{
                    if(res.status==200){
                        this.init();
                        this.$message({
                            message: "课程上架成功",
                            type: "success"
                        });
                    }
                })
            }).catch(()=>{
                
            })
        },
        dialogShow(obj){
            this.id = obj.id;
            this.dialogVisible = true;
        },
        /**
         * 追加播放量
         */
        addCourseBrowsCount(){
            if(this.num==''){
                this.$message.error('请输入播放量');
                return false;
            }
            let regExp = /^\d+$/
            if((!regExp.test(this.num))||!(this.num<=10000000&&this.num>0)){
                this.$message.error('请输入1-10000000的数字');
                return false;
            }
            this.dialogLoading = true;
            let query = {
                courseId:this.id,
                addCourseBrowsCount:this.num
            }
            this.$http.post(this.$server.addCourseBrowsCount,query).then(res=>{
                this.dialogLoading = false;
                if(res.status==200){
                    this.$message.success('播放量设置成功');
                    this.dialogVisible = false;
                    this.init()
                }
            }).catch(()=>{
                this.dialogLoading = false;
            })
        }
    }
};
</script>

<style lang="scss" scope>
.page-head {
    // height: 150px;
    padding: 28px 19px 30px 17px;
    background: #fff;
    margin-bottom: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    .page-title {
        line-height: 40px;
        font-size: 18px;
        color: #384156;
        padding-bottom: 25px;
        .red-btn{
            background: #b4272d;
            color: #fff;
        }
    }
    .filtrate-title {
        padding-right: 16px;
        width: 46px;
        font-size: 14px;
        color: rgba(56, 65, 86, 1);
        line-height: 40px;
        margin-bottom: 10px;
    }
    .filtrate-select {
        width: 140px;
        margin-right: 20px;
        margin-bottom: 10px;
    }
    .filtrate-input {
        width: 240px;
        margin-right: 20px;
    }
    .filtrate-execute {
        width: 110px;
    }
    .search-btn {
        cursor: pointer;
        width: 70px;
        height: 40px;
        line-height: 40px;
        background: #b4272d;
        border: none;
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
    }
}
.page-content {
    border-radius: 5px;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    .course-img {
        width: 75px;
        height: 45px;
        margin-right: 10px;
        border-radius: 5px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .course-details {
        max-width: calc(100% - 90px);
        font-size: 14px;
        .course-title {
            color: #333333;
            margin: 0px;
        }
        .course-price {
            color: #b4272d;
        }
    }
    .specialbut{
        position: relative;
        .labelNumber{
            width: 16px;
            height: 16px;
            line-height: 16px;
            background: #b4272d;
            color: #fff;
            position: absolute;
            top: 0px;
            font-size: 12px;
            right: -16px;
            border-radius: 50%;
        }
    }
    .black-btn {
        // color: rgba(41, 40, 45, 1);
        color: #b4272d;
        margin: 0 10px;
        position: relative;
        .i-div{
            width: 16px;
            height: 16px;
            margin: auto;
            border-radius: 50%;
            border: 2px solid #b4272d;
            position: absolute;
            right: -20px;
            top: 11px;
            font-size: 12px;            
        }
    }
    .is-auditing {
        position: absolute;
        top: 0;
        right: 0;
        background: #b4272d;
        width: 0;
        height: 0;
        border-right: 50px solid #b4272d;
        border-left: 50px solid #fff;
        border-top: 50px solid #fff;
        border-bottom: 50px solid #fff;
        top: -50px;
        right: -50px;
        transform: rotateZ(-225deg);
        &:after {
            content: "\66F4\65B0";
            width: 30px;
            position: absolute;
            top: -13px;
            right: -39px;
            transform: rotateZ(-90deg);
            color: #fff;
        }
        &:before {
            content: "\5BA1\6838\4E2D";
            width: 50px;
            position: absolute;
            top: -14px;
            right: -65px;
            transform: rotateZ(-90deg);
            color: #fff;
        }
    }
    .cu {
        cursor: pointer;
    }
}
.paging {
    margin: 30px 0;
}
</style>
<style lang="scss">
.course-list .handle-wrap-layout {
    overflow: hidden;
}
.coursePageStyle .el-table .el-table__body-wrapper .el-table__body .el-table__row td{
    padding:0;
}
.search-box{
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
}
.list{
    max-height: 500px;
    overflow-y: auto;
    .empty-tip{
        text-align: center;
        line-height: 30px;
    }
}
.btns{
    text-align: center;
}
.nameTextEllipsis{
    border-bottom:1px solid #f2f2f2;
    zoom: 1;
    overflow: auto;    
    div{
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; 
        padding:10px 5px;   
        border-left:1px solid #f2f2f2;  
        text-align: center;
    }
}
.item{
    // margin-bottom: 10px;
}
.my-course-editor{
    width: calc(100% - 110px);
    border:1px solid #dfdfdf;
    .editor-wrapper{
        padding: 0 !important;
        .content-length{
            top:15px!important;
            right: 10px!important;
        }
        // .quill-editor{
        //     .ql-toolbar{
        //         .ql-formats{
        //             button{
        //                 i{
        //                     font-size: 16px !important;;
        //                 }
        //             }
        //         }
        //     }
        // }
    }
}
</style>
<style>
.goodThingsCss .el-input .el-input__inner{
    height: 36px;
}
</style>

