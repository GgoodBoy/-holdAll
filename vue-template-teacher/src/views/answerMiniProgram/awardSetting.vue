<template>
    <div class="award-setting-page">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <div class="search-area">
                <div class="select-box">
                    <label>筛选</label>
                    <el-select v-model="isRelationQuestion" placeholder="请选择" clearable>
                        <el-option
                        v-for="item in relationQuestion"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-button v-if="$authJudge('thekingofknowledge:hurdle:select')" type="primary" @click="search">查询</el-button>
                <el-button v-if="$authJudge('thekingofknowledge:hurdle:addaward')" style="float:right" type="primary" @click="dialog4Data.visible=true">奖项设置</el-button>
            </div>
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                v-loading="loading"
                :data="tableData"
                border
                style="width: 100%">
                    <el-table-column
                    label="关卡号"
                    align="center"
                    min-width="30">
                        <template slot-scope="scope">
                            <p>第{{scope.row.hurdleNum}}关</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="peopleNum"
                    label="当前关卡人数"
                    align="center"
                    min-width="30"/>
                    <el-table-column
                    label="关联题目"
                    align="center"
                    min-width="30">
                    <template slot-scope="scope">
                        <p>{{scope.row.isRelationQuestion==1?'是':'否'}}</p>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="userName"
                    label="创建人"
                    align="center"
                    min-width="30"/>
                    <el-table-column
                    prop="createdAt"
                    label="创建时间"
                    align="center"
                    min-width="60"/>
                    <el-table-column
                    label="操作"
                    align="center"
                    min-width="120"
                >
                    <template slot-scope="scope">
                        <div class="btn-box">
                            <el-button v-if="$authJudge('thekingofknowledge:hurdle:see')" type="text" size="small" class="handle-btn" @click="hurdleDetailList(scope.row)">查看</el-button>
                            <el-button v-if="$authJudge('thekingofknowledge:hurdle:relation')" type="text" size="small" class="handle-btn" @click="addRelationQuestionEvent(scope.row)">关联题目</el-button>
                            <el-button v-if="$authJudge('thekingofknowledge:hurdle:editrelation')" type="text" size="small" class="handle-btn" v-show="scope.row.isRelationQuestion&&scope.row.isRelationQuestion==1" @click="editRelationQuestionEvent(scope.row)">编辑关联</el-button>
                            <el-button v-if="$authJudge('thekingofknowledge:hurdle:awardrecordlist')" type="text" size="small" class="handle-btn" @click="getAwardRecordList(scope.row)">获奖详情</el-button>
                            <el-button v-if="$authJudge('thekingofknowledge:hurdle:awarddetail')" type="text" size="small" class="handle-btn" v-show="scope.row.awardType" @click="ediAward(scope.row)" >编辑奖项</el-button>
                            <el-button v-if="$authJudge('thekingofknowledge:hurdle:deleteaward')" type="text" size="small" class="handle-btn" v-show="scope.row.awardType" @click="delAward(scope.row)" >删除奖项</el-button>
                        </div>
                    </template>
                </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        :current-page.sync="pageNo"
                        :page-size="pageSize"
                        :total="total"
                        layout="prev, pager, next"
                    />
                </div>
            </div>    
        </div>
        <el-dialog
            title=""
            :visible.sync="dialog1Data.visible"
            width="600px"
            custom-class="dialog1 dialog"
            center
            >
            <div>
                <el-table
                v-loading="dialog1Data.loading"
                :data="dialog1Data.tableData"
                style="width: 100%">
                <el-table-column
                    prop="cellphone"
                    label="手机号"
                    align="center"
                />
                <el-table-column
                    prop="fractionNum"
                    label="当前关卡分值"
                    align="center"
                />
                <el-table-column
                    prop="gameNum"
                    label="局数"
                    align="center"
                />
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        :current-page.sync="dialog1Data.pageNo"
                        :page-size="dialog1Data.pageSize"
                        :total="dialog1Data.total"
                        layout="prev, pager, next"
                    />
                </div>
            </div>
        </el-dialog>
        <el-dialog
            title=""
            :visible.sync="dialog2Data.visible"
            width="700px"
            custom-class="dialog2 dialog"
            center
            >
            <div class="search-area">
                <div class="input-box">
                    <el-input type="text" placeholder="输入题目名称查询" v-model="title" clearable></el-input>
                </div>
                <div class="select-box">
                    <label>类型</label>
                    <el-select v-model="type" placeholder="请选择">
                        <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="select-box">
                    <label>难度</label>
                    <el-select v-model="difficultyType" placeholder="请选择">
                        <el-option
                        v-for="item in difficultyTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-button style="float:right;" type="primary" @click="searchEvent">查询</el-button>
            </div>
            <div class="table-box">
                <el-table
                v-loading="dialog2Data.loading"
                :data="dialog2Data.tableData"
                height="400"
                ref="myTable"
                @selection-change="handleSelectionChange"
                style="width: 100%">
                    <el-table-column
                        type="selection"
                        :selectable="checkSelectable"
                        width="55"/>
                    <el-table-column
                        prop="title"
                        label="题目名称"
                        align="center"
                        show-overflow-tooltip
                    />
                    <el-table-column
                        prop="typeText"
                        label="类型"
                        align="center"
                        width="80"
                    />
                    <el-table-column
                        prop="difficultyTypeText"
                        label="难度"
                        align="center"
                        width="80"
                    />
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        :current-page.sync="dialog2Data.pageNo"
                        :page-size="dialog2Data.pageSize"
                        :total="dialog2Data.total"
                        layout="prev, pager, next"
                    />
                </div>
            </div>
            <div class="btn-box">
                <el-button @click="dialog2Data.visible=false">取消</el-button>
                <el-button type="primary" @click="addRelationQuestion">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title=""
            :visible.sync="dialog3Data.visible"
            width="600px"
            custom-class="dialog3 dialog"
            center
            >
            <div>
                <el-table
                v-loading="dialog3Data.loading"
                :data="dialog3Data.tableData"
                style="width: 100%">
                    <el-table-column
                        prop="cellphone"
                        label="手机号"
                        align="center"
                    />
                    <el-table-column
                        prop="createdAt"
                        label="获奖时间"
                        align="center"
                    />
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        :current-page.sync="dialog3Data.pageNo"
                        :page-size="dialog3Data.pageSize"
                        :total="dialog3Data.total"
                        layout="prev, pager, next"
                    />
                </div>
            </div>
        </el-dialog>
        <el-dialog
            title="设置奖项"
            :visible.sync="dialog4Data.visible"
            width="500px"
            custom-class="dialog4 dialog"
            center
            >
            <div class="select-box">
                <label>选择奖项</label>
                <el-select v-model="awardType" placeholder="请选择" @change="awardTypeChange">
                        <el-option
                        v-for="item in awardTypeArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
            </div>
            <div class="award-box">
                <label>设置</label>
                <div class="type">
                    <el-input v-if="awardType==''||awardType<=4" v-model="award" placeholder="请填写ID(批次号)"></el-input>
                    <el-input v-if="awardType==5" v-model="award" placeholder="请填写书名"></el-input>
                    <el-input v-if="awardType==6" v-model="award" placeholder="填写积分数量>0≤100"></el-input>
                    <el-input v-if="awardType==7" v-model="award" placeholder="填写金币数量>0≤500"></el-input>
                    <div class="course" v-if="awardType==8">
                        <el-button type="primary" @click="selectCourse">选择课程</el-button>
                        <p v-if="courseArr.length>0">已选择{{courseArr.length}}门课</p>
                        <el-input placeholder="填写免费观看天数0≤365" v-model="awardDetail" maxlength="3"></el-input>
                        <p class="tips">填写0为永久观看</p>
                    </div>
                </div>
            </div>
            <div class="hurdle-box">
                <label>关联关卡</label>
                <el-select v-model="hurdleNum" placeholder="请选择">
                        <el-option
                        v-for="item in 100"
                        :key="item"
                        :label="`第${item}关`"
                        :value="item">
                        </el-option>
                    </el-select>
            </div>
            <div class="btn-box">
                <el-button @click="dialog4Data.visible=false">取消</el-button>
                <el-button type="primary" @click="addAwardForHandle">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :custom-class="'course-dialog'" :visible.sync="courseDialogVisible" :width="'500px'" :show-close="false">           
            <div class="search-box">
                <el-input placeholder="输入课程名称查询" clearable size="medium" prefix-icon="el-icon-search" v-model="searchKey" maxlength="20" @keypress.native="pressEvent($event)"></el-input>
                <el-button type="primary" size="medium" @click="courseSearch">搜索</el-button>
            </div>
            <div class="list" ref="scrollBox">
                <el-checkbox-group
                    v-model="dialogArr"
                    >
                    <div class="item nameTextEllipsis" v-for="(item,index) in courseList" :key="index">
                        <el-checkbox :label="item.id" :disabled="item.disabled">{{item.title}}</el-checkbox>
                        <div style='font-size:14px;float:right;margin:0 10px 0 0'>{{item.price||0}}币</div>
                    </div>
                </el-checkbox-group>
                <div class="loading" v-show="courseLoading"><div class="loading-icon" v-loading="true"></div></div>
                <p class="empty-tip" v-if="isLastPage&&courseList.length==0">没有搜索到您想要的内容</p>
            </div>
            <div slot="footer" class="btns">
                <el-button @click="courseDialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="dialogSure" size="medium">确定</el-button>
            </div>
        </el-dialog>  
    </div>    
</template>
<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
const regExp = {
    'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
    'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
    'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g //特殊字符(除了数字、字母、汉字) 
}
export default {
    components: {
        pagination,breadcrumb
    },
    data(){
        return{
            titleList:[
                {
                    name:'小程序知识达人王者',
                    pathInfo:'/answerMiniProgram/awardSetting'
                },
                {
                    name:'关卡奖项设置',
                    pathInfo:''
                }               
            ],
            isRelationQuestion:'',
            relationQuestion:[
                {label:'未关联',value:0},
                {label:'已关联',value:1},
                {label:'全部',value:-1},
            ],
            pageNo: 1,
            pageSize: 10,
            total: 10,
            tableData: [],
            loading: false,
            dialog1Data:{
                hurdleNum:'',
                visible:false,
                loading:false,
                tableData:[],
                pageNo:1,
                pageSize:10,
                total:10
            },
            dialog2Data:{
                flag:'',
                handleId:'',
                visible:false,
                loading:false,
                tableData:[],
                pageNo:1,
                pageSize:50,
                total:50,
                checkArr:[]
            },
            checkArr:[],
            checkArrBySearch:[],
            title:'',
            type:'',
            difficultyType:'',
            typeOptions:[
                {label:'文学',value:1},
                {label:'常识',value:2},
                {label:'历史',value:3},
                {label:'成语',value:4},
                {label:'民俗',value:5},
                {label:'全部',value:-1}
            ],
            difficultyTypeOptions:[
                {label:'简',value:1},
                {label:'中',value:2},
                {label:'难',value:3},
                {label:'全部',value:-1}
            ],
            dialog3Data:{
                handleId:'',
                visible:false,
                loading:false,
                tableData:[],
                pageNo:1,
                pageSize:10,
                total:10
            },
            awardType:'',
            award:'',
            awardDetail:'',
            hurdleNum:'',
            hurdleId:'',
            awardTypeArr:[
                {label:'指定课程优惠券',value:1},
                {label:'满减优惠券',value:2},
                {label:'无门槛优惠券',value:3},
                {label:'学习卡',value:4},
                {label:'书籍',value:5},
                {label:'积分',value:6},
                {label:'金币',value:7},
                {label:'课程',value:8},
            ],
            dialog4Data:{
                visible:false
            },
            courseDialogVisible:false,
            searchKey:'',
            oldSearchKey:'',
            searchFlag:false,
            coursePageNo:1,
            coursePageSize:20,
            courseLoading:false,
            dialogArr:[],
            courseCheckList:[],
            courseList:[],
            courseArr:[],
            isLastPage:false,
        }
    },
    watch: {
        courseDialogVisible(cur,old){
            if(!cur){
                this.searchKey = ''
                this.coursePageNo = 1
                this.courseList = []
                this.oldSearchKey = ''
                this.courseLoading = false;
                this.isLastPage = false;
            }
        },
        dialogArr(cur,old){
            cur.forEach((item)=>{
                let index = this.courseCheckList.findIndex(option=>option==item);
                if(index==-1){
                    this.courseCheckList.push(item)
                }
            })
        },    
        searchKey(cur,old){
            this.searchFlag = false;
        },   
        pageNo(cur, old) {
            if (cur >= 1) {
                this.getHurdleList()
            }
        },
        pageNo1(cur, old) {
            if (cur >= 1&&this.dialog1Data.hurdleNum!='') {
                this.hurdleDetailList()
            }
        },
        dialog1Visible(cur){
            if(!cur){
                this.dialog1Data = {
                    hurdleNum:'',
                    loading:false,
                    visible:false,
                    tableData:[],
                    pageNo:1,
                    pageSize:10,
                    total:10
                }
            }
        },
        pageNo2(cur, old) {
            if (cur >= 1&&this.dialog2Data.handleId!='') {
                this.questionRelationQuestionDetail()
            }
        },
        dialog2Visible(cur){
            if(!cur){
                this.dialog2Data = {
                    flag:'',
                    visible:false,
                    handleId:'',
                    loading:false,
                    tableData:[],
                    pageNo:1,
                    pageSize:50,
                    total:50,
                    checkArr:[]
                }
                this.checkArr = [];
                this.checkArrBySearch = [];
                this.title = this.type = this.difficultyType = '';
            }
        },
        pageNo3(cur, old) {
            if (cur >= 1&&this.dialog3Data.handleId!='') {
                this.getAwardRecordList()
            }
        },
        dialog3Visible(cur){
            if(!cur){
                this.dialog3Data = {
                    handleId:'',
                    visible:false,
                    loading:false,
                    tableData:[],
                    pageNo:1,
                    pageSize:10,
                    total:10
                }
            }
        },
        dialog4Visible(cur){
            if(!cur){
                this.awardType = this.award = this.awardDetail = this.hurdleNum = this.hurdleId = '';
                this.dialogArr = this.courseCheckList = this.courseArr = [];
            }
        }
    },
    computed:{
        pageNo1(){
            return this.dialog1Data.pageNo;
        },
        pageNo2(){
            return this.dialog2Data.pageNo;
        },
        pageNo3(){
            return this.dialog3Data.pageNo;
        },
        dialog1Visible(){
            return this.dialog1Data.visible;
        },
        dialog2Visible(){
            return this.dialog2Data.visible;
        },
        dialog3Visible(){
            return this.dialog3Data.visible;
        },
        dialog4Visible(){
            return this.dialog4Data.visible;
        }
    },
    created(){
        this.getHurdleList()
    },
    methods:{
        /**
         * 获取列表
         */
        getHurdleList(){
            this.loading = true;
            const query = {
                params:{
                    isRelationQuestion:this.isRelationQuestion,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.getHurdleList,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    this.tableData = res.content.list;
                    this.total = res.content.total;
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        /**
         * 列表搜索
         */
        search() {
            this.pageNo = 0;
            this.$nextTick(() => {
                this.pageNo = 1;
            })
        },
        /**
         * 查看关卡
         */
        hurdleDetailList(obj){
            if(obj){
                this.dialog1Data.hurdleNum = obj.hurdleNum
            }
            this.dialog1Data.visible = true;
            this.dialog1Data.loading = true;
            const query  = {
                params:{
                    pageNo:this.dialog1Data.pageNo,
                    pageSize:this.dialog1Data.pageSize
                }
            }
            this.$http.get(`${this.$server.hurdleDetailList}/${this.dialog1Data.hurdleNum}`,query).then(res=>{
                if(res.status==200){
                    this.dialog1Data.tableData = res.content.list;
                    this.dialog1Data.total = res.content.total;
                }
                this.dialog1Data.loading = false;
            }).catch(()=>{
                this.dialog1Data.loading = false;
            })
        },
        checkSelectable(row,index){
            return !row.isCheck;
        },
        /**
         * 关联题目
         */
        addRelationQuestionEvent(obj){
            this.dialog2Data.flag = 'add';
            this.dialog2Data.visible = true;
            this.dialog2Data.handleId = obj.id;
            this.questionRelationQuestionDetail()
        },
        searchEvent(){
            this.dialog2Data.pageNo = 0;
            this.$nextTick(()=>{
                this.dialog2Data.pageNo = 1;
            })
            let checkArrBySearch = [...this.checkArrBySearch];
            this.checkArr.forEach(arr=>{
                if(arr.length>0){
                    arr.forEach(item=>{
                        const index = checkArrBySearch.findIndex(option=>item==option);
                        if(index<0){
                            checkArrBySearch.push(item)
                        }
                    })
                }
            })
            this.checkArrBySearch = checkArrBySearch;
            this.checkArr = [];
        },
        editRelationQuestionEvent(obj){
            this.dialog2Data.flag = 'edit';
            this.dialog2Data.visible = true;
            this.dialog2Data.handleId = obj.id;
            this.questionRelationQuestionDetailForUpdate()
        },
        addRelationQuestion(){
            let questionIdsArr = []
            this.checkArr.forEach(arr=>{
                if(arr.length>0){
                    questionIdsArr = [...questionIdsArr,...arr]
                }
            })
            if(this.dialog2Data.flag=='add'){
                this.dialog2Data.checkArr.forEach(item=>{
                    const index = questionIdsArr.findIndex(id=>id==item);
                    if(index<0){
                        questionIdsArr.push(item)
                    }
                })
                this.checkArrBySearch.forEach(item=>{
                    const index = questionIdsArr.findIndex(id=>id==item);
                    if(index<0){
                        questionIdsArr.push(item)
                    }
                })
            }
            const questionIds = questionIdsArr.join(',');
            const query = {
                handleId:this.dialog2Data.handleId,
                questionIds:questionIds
            }
            const loadingInstance = this.$loading({
                target:document.querySelector('.dialog2')
            });
            this.$http.post(this.$server.addRelationQuestion,query).then(res=>{
                if(res.status==200){
                    const msg = this.dialog2Data.flag =='add'?'题目关联成功':'题目关联编辑成功'
                    this.dialog2Data.visible = false;
                    this.$message.success(msg);
                    this.pageNo = 0;
                    this.$nextTick(()=>{
                        this.pageNo = 1;
                    })
                }
            }).finally(()=>{
                loadingInstance.close()
            })
        },
        /**
         * 获取关联的题目
         */
        questionRelationQuestionDetailForUpdate(){
            this.dialog2Data.loading = true;
            const query = {
                params: {
                    title:this.title,
                    type:this.type==-1?'':this.type,
                    difficultyType:this.difficultyType==-1?'':this.difficultyType,
                    pageNo:this.dialog2Data.pageNo,
                    pageSize:100
                }
            }
            this.$http.get(`${this.$server.questionRelationQuestionDetailForUpdate}/${this.dialog2Data.handleId}`,query).then(res => {
                if (res.status == 200) {
                    this.dialog2Data.tableData = res.content;
                    this.dialog2Data.tableData.forEach((item,index)=>{
                        item.typeText = this.typeOptions.find(option=>option.value==item.type).label;
                        item.difficultyTypeText = this.difficultyTypeOptions.find(option=>option.value==item.difficultyType).label;
                    })
                    setTimeout(()=>{
                        this.dialog2Data.tableData.forEach((item)=>{
                            this.$refs.myTable.toggleRowSelection(item)
                        });
                    },1)
                }
            }).finally(() => {
                this.dialog2Data.loading = false;
            })
        },
        /**
         * 获取所有题目
         */
        questionRelationQuestionDetail(){
            this.dialog2Data.loading = true;
            const query = {
                params: {
                    title:this.title,
                    type:this.type==-1?'':this.type,
                    difficultyType:this.difficultyType==-1?'':this.difficultyType,
                    pageNo:this.dialog2Data.pageNo,
                    pageSize:this.dialog2Data.pageSize
                }
            }
            this.$http.get(`${this.$server.questionRelationQuestionDetail}/${this.dialog2Data.handleId}`,query).then(res => {
                if (res.status == 200) {
                    this.dialog2Data.tableData = res.content.list;
                    this.dialog2Data.tableData.forEach((item,index)=>{
                        item.typeText = this.typeOptions.find(option=>option.value==item.type).label;
                        item.difficultyTypeText = this.difficultyTypeOptions.find(option=>option.value==item.difficultyType).label;
                    })
                    this.dialog2Data.total = res.content.total;
                    const temp = this.checkArr[this.dialog2Data.pageNo-1]?[...this.checkArr[this.dialog2Data.pageNo-1]]:[...this.checkArrBySearch]
                    setTimeout(()=>{
                        this.dialog2Data.tableData.forEach((item)=>{
                            if(item.isCheck&&item.isCheck==1){
                                this.$refs.myTable.toggleRowSelection(item)
                            }else{
                                if(temp.length>0){
                                    const index = temp.findIndex(id=>item.id==id);
                                    if(index>=0){
                                        this.$refs.myTable.toggleRowSelection(item)
                                    }
                                }
                            }
                        })
                    },1)
                }
            }).finally(() => {
                this.dialog2Data.loading = false;
            })
            const query1 = {
                params: {
                    title:this.title,
                    type:this.type==-1?'':this.type,
                    difficultyType:this.difficultyType==-1?'':this.difficultyType,
                    pageNo:1,
                    pageSize:100
                }
            }
            this.$http.get(`${this.$server.questionRelationQuestionDetailForUpdate}/${this.dialog2Data.handleId}`,query1).then(res => {
                if(res.status==200){
                    this.dialog2Data.checkArr = res.content.map(item=>{
                        return item.id
                    })
                }
            })
        },
        handleSelectionChange(val){
            this.checkArr[this.dialog2Data.pageNo-1] = val.map(item=>{
                return item.id
            });
        },
        /**
         * 获奖详情
         */
        getAwardRecordList(obj){
            if(obj){
                this.dialog3Data.handleId = obj.id
            }
            this.dialog3Data.visible = true;
            this.dialog3Data.loading = true;
            const query  = {
                params:{
                   pageNo:this.dialog3Data.pageNo,
                   pageSize:this.dialog3Data.pageSize,
                }
            }
            this.$http.get(`${this.$server.getAwardRecordList}/${this.dialog3Data.handleId}`,query).then(res=>{
                if(res.status==200){
                    this.dialog3Data.tableData = res.content.list;
                    this.dialog3Data.total = res.content.total;
                }
            }).finally(()=>{
                this.dialog3Data.loading = false;
            })
        },
        awardTypeChange(){
            this.award = ''
        },
        /**
         * 选择课程
         */
        selectCourse(){
            this.courseDialogVisible = true;
            this.dialogArr = this.courseArr.map(item=>{
                return parseInt(item);
            })
            this.getOurCoursesUse()
        },
        /**
         * 获取自有上架的课程
         */
        getOurCoursesUse(){
            this.courseLoading = true;
            this.isLastPage = false;
            let params = {
                title:this.oldSearchKey,
                pageNo:this.coursePageNo,
                pageSize:this.coursePageSize,
            }
            if(this.searchFlag){
                params.title = this.searchKey
                this.oldSearchKey = this.searchKey
            }
            this.$http.get(this.$server.getOurCoursesUse,{params}).then(res=>{
                if(res.status==200){
                    let arr = res.content.list;
                    this.courseList = [...this.courseList,...arr]
                    this.courseLoading = false;
                    this.isLastPage = res.content.isLastPage;
                    if(this.isLastPage){
                        this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent)
                    }else{
                        this.$nextTick(()=>{
                            this.$refs.scrollBox.addEventListener("scroll",this.scrollEvent)
                        })
                    }
                }
            })
        },
        /**
         * 滚动分页
         */
        scrollEvent(){
            let scrollDistance = this.$refs.scrollBox.scrollHeight - this.$refs.scrollBox.scrollTop - this.$refs.scrollBox.clientHeight
            let sign = 50;
            if (scrollDistance <= sign) {
                this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent)
                this.coursePageNo++;
                this.getOurCoursesUse();
            }
        },
        pressEvent(e){
            if(e.keyCode==13){
                this.courseSearch()
            }
        },
        /**
         * 课程搜索
         */
        courseSearch(){
            this.searchKey = this.searchKey.replace(regExp.specialChar,'');
            this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent);
            this.searchFlag = true;
            this.$nextTick(()=>{
                this.coursePageNo = 1;
                this.courseList = []
                this.$nextTick(()=>{
                    this.getOurCoursesUse()
                })
            })
        },
        /**
         * 课程弹窗确定
         */
        dialogSure(){
            this.courseArr = [];
            this.courseCheckList.forEach(item=>{
                let obj = this.dialogArr.find(id=>id==item);
                if(obj){
                    this.courseArr.push(item)
                }
            })
            this.courseDialogVisible = false;
        },
        /**
         * 编辑奖项
         */
        ediAward(obj){
            this.dialog4Data.visible = true;
            this.getHurdleAwardDetail(obj.id)
        },
        /**
         * 获取奖项详情
         */
        getHurdleAwardDetail(id){
            const loadingInstance = this.$loading({
                target:document.querySelector('.dialog4')
            });
            const query = {
                params:{}
            }
            this.$http.get(`${this.$server.getHurdleAwardDetail}/${id}`,query).then(res=>{
                if(res.status==200){
                    this.awardType = res.content.awardType;
                    this.award = res.content.award;
                    this.awardDetail = res.content.awardDetail;
                    this.hurdleNum = res.content.hurdleNum;
                    this.hurdleId = res.content.id;
                    if(this.awardType==8){
                        this.courseArr = this.award.length>0?this.award.split(','):[];
                    }
                }
            }).finally(()=>{
                loadingInstance.close()
            })
        },
        addAwardForHandle(){
            if(this.awardType<=4&&this.award==''){
                this.$message.error('请填写批次号');
                return;
            }
            if(this.awardType==5&&this.award==''){
                this.$message.error('请填写书名');
                return;
            }
            if(this.awardType==6){
                if(this.award==''||this.award<=0||this.award>100){
                    this.$message.error('积分数量应该>0≤100');
                    return;
                }
            }
            if(this.awardType==7){
                if(this.award==''||this.award<=0||this.award>500){
                    this.$message.error('金币数量应该>0≤500');
                    return;
                }
            }
            if(this.awardType==8){
                if(this.courseArr.length==0){
                    this.$message.error('请选择课程');
                    return;
                }
                if(this.awardDetail==''||this.awardDetail>365||this.awardDetail<0){
                    this.$message.error('请填写合法的免费观看天数');
                    return;
                }
            }
            if(this.hurdleNum==''){
                this.$message.error('请选择关联关卡');
                return;
            }
            const loadingInstance = this.$loading({
                target:document.querySelector('.dialog4')
            });
            const query = {
                awardType:this.awardType,
                award:this.award,
                hurdleNum:this.hurdleNum
            }
            if(this.awardType==8){
                query.awardDetail = this.awardDetail;
                query.award = this.courseArr.join(',');
            }
            if(this.hurdleId!=''){
                query.hurdleId = this.hurdleId;
            }
            this.$http.post(this.$server.addAwardForHandle,query).then(res=>{
                if(res.status==200){
                    const msg = this.hurdleId!=''?'奖项编辑成功':'奖项设置成功';
                    this.$message.success(msg);
                    this.dialog4Data.visible = false;
                    this.pageNo = 0;
                    this.$nextTick(()=>{
                        this.pageNo = 1;
                    })
                }
            }).finally(()=>{
                loadingInstance.close()
            })
            
        },
        /**
         * 删除奖项
         */
        delAward(obj){
            this.$confirm('确定删除该关卡的奖项吗？', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'none',
                center: true
                }).then(() => {
                    const query = {
                        params:{}
                    }
                    this.$http.post(`${this.$server.deleteAwardForHandle}/${obj.id}`,query).then(res=>{
                        if(res.status==200){
                            this.$message.success('删除成功');
                            this.pageNo = 0;
                            this.$nextTick(()=>{
                                this.pageNo = 1;
                            })
                        }
                    }).finally(()=>{

                    })
                }).catch(() => {
                
                });
        }
    }
}
</script>
<style lang="scss" scoped>
    .award-setting-page{
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
            .search-area{
                overflow: hidden;
                margin-top:10px;
                .select-box{
                    width: 260px;
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 16px;
                    label,.el-select{
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 10px;
                    }
                }
                button{
                    display: inline-block;
                    vertical-align: middle;
                }
            }
        }
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            .block{
                text-align: center;
                margin-top:60px;
                padding-bottom:60px;
            }
        }
        .course-dialog{
            .search-box{
                font-size: 0;
                .el-input{
                    display: inline-block;
                    vertical-align: middle;
                    width: calc(100% - 78px);
                }
                button{
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 8px;
                }
            }
            .list{
                margin:10px 0;
                max-height: 500px;
                overflow: auto;
                .item{
                    margin:10px 0;
                    .name{
                        width: 310px;
                    }
                } 
            }
            .btns{
                text-align: center;
            }
            .empty-tip{
                text-align: center;
                color:#aaa;
            }
        }
        .dialog{
            .block{
                text-align: center;
                margin-top:10px;
                padding-bottom:10px;
            }
            .search-area{
                margin-bottom:10px;
                .input-box{
                    width: 200px;
                    display: inline-block;
                    vertical-align: middle;
                }
                .select-box{
                    display: inline-block;
                    vertical-align: middle;
                    margin:0 0 0 10px;
                    label{
                        font-size: 16px;
                        margin-right: 5px;
                        display: inline-block;
                        vertical-align: middle;
                        width:40px;
                    }
                    /deep/ .el-select{
                        width: 120px;
                        vertical-align: middle;
                    }
                }
            }
            .select-box,.award-box,.hurdle-box{
                margin:20px 0;
                label{
                    width: 68px;
                    display: inline-block;
                    font-size: 16px;
                    text-align: right;
                    margin-right: 10px;
                }
                .el-select,.el-input,.type{
                    width: 280px;
                }
                >div{
                    width: 68px;
                    display: inline-block;
                }
                .type{
                    button{
                        margin:0 0 20px 0;
                    }
                    p{
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .course{
                        position: relative;
                        .tips{
                            font-size: 12px;
                            color:#999;
                            position: absolute;
                            right:-100px;;
                            bottom:12px;
                        }
                    }
                }                
            }
            .btn-box{
                text-align: center;
            }
            .table-box{
                position: relative;
                .all-check{
                    position: absolute;
                    top:16px;
                    left:9px;
                    z-index: 2;
                }
            }
        }
    }
</style>