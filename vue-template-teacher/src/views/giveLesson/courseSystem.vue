<template>
    <div class="gift-list-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
                <el-col>
                    <el-row>
                        <el-col :span="16">
                           <el-input v-model="input" style="width:300px;margin-right:10px;" placeholder="输入名称查询"></el-input>
                           <el-button type="primary" @click="selectEven" v-if="$authJudge('activity:activityregister:select')">搜索</el-button>
                        </el-col>
                        <el-col :span="8" style="float:right;text-align: right;">
                            <el-button type="primary" v-if="$authJudge('activity:activityregister:add')" @click="$router.push('/activityObj/addcourseSystem')">添加信息</el-button>
                        </el-col>
                    </el-row>    
                </el-col>
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
                        prop="activityName"
                        label="活动名称"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="code"
                        label="识别码"
                        align="center"
                        min-width="200"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="schooleName"
                        label="学校名称"
                        align="center"
                        min-width="200"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="gradeName"
                        label="年级"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="registerNum"
                        label="注册人数"
                        min-width="100"
                        align="center"
                        show-overflow-tooltip
                        >
                    </el-table-column>                    
                    <el-table-column
                        prop="createdAt"
                        label="创建时间"
                        align="center"
                        min-width="240"
                        show-overflow-tooltip
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="nickname"
                        label="创建人"
                        min-width="120"
                        align="center"
                        show-overflow-tooltip
                        >
                    </el-table-column>                        
                    <el-table-column
                        label="操作"
                        align="center"
                        fixed="right"
                        width="150">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type="text" v-if="$authJudge('activity:activityregister:forbidden')" size="small" @click="switchs(scope.row)">{{scope.row.enabled==1?'禁用':'启用'}}</el-button>
                                    <el-button type="text" v-if="$authJudge('activity:activityregister:update')" size="small" :disabled="scope.row.enabled==1?true:false" @click="edit(scope.row)">修改</el-button>
                                    <el-button type="text" v-if="$authJudge('activity:activityregister:detail')" size="small" @click="goDetails(scope.row)">详情</el-button> 
                                    <el-button type="text" v-if="$authJudge('activity:activityregister:additional')" size="small" :disabled="scope.row.enabled==1?true:false" @click="addToCourse(scope.row)">追加课程</el-button> 
                                    <el-button type="text" v-if="$authJudge('activity:activityregister:record')" size="small" @click="goRecord(scope.row)">记录</el-button>  
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
        <el-dialog
        :visible.sync="dialogVisibleOne"
        width="60%"
        >
        <div class="dialogOne">
            <div>课程:</div>
            <div style="margin:20px 0;">{{courseListTitle}}</div>
            <el-table
                border
                :data="tableDataOne"
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
                    prop="cellphone"
                    label="手机号"
                    align="center"
                    min-width="200"
                    show-overflow-tooltip>
                </el-table-column>  
                <el-table-column
                    prop="areaName"
                    label="地区"
                    align="center"
                    min-width="200"
                    show-overflow-tooltip
                    >
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="注册时间"
                    align="center"
                    min-width="200"
                    show-overflow-tooltip
                    >
                </el-table-column>                                  
            </el-table>     
            <div class="block">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="childPageValue1"
                    :current-page.sync="pageAtion1.paginationPage"
                    :total="pageAtion1.pageTotal">
                </el-pagination>
            </div>                            
        </div>                  
        </el-dialog>         
        <el-dialog
        :visible.sync="dialogVisibleTwo"
        width="70%"
        >
        <div class="dialogOne">
            <el-table
                border
                :data="tableDataTwo"
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
                    prop="courseName"
                    label="追加课程"
                    align="center"
                    min-width="150"
                    show-overflow-tooltip>
                </el-table-column>  
                <el-table-column
                    prop="validDays"
                    label="课程有效期"
                    align="center"
                    min-width="60"
                    show-overflow-tooltip
                    >
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="追加时间"
                    align="center"
                    min-width="200"
                    show-overflow-tooltip
                    >
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    label="操作人"
                    align="center"
                    min-width="120"
                    show-overflow-tooltip
                    >
                </el-table-column>                            
            </el-table>   
            <div class="block">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="childPageValue2"
                    :current-page.sync="pageAtion2.paginationPage"
                    :total="pageAtion2.pageTotal">
                </el-pagination>
            </div>                                
        </div>                  
        </el-dialog> 
        <el-dialog
        :visible.sync="dialogVisibleThree"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        width="40%"
        >
            <div class="dialogOne" v-if="dialogTypeOne">
                <el-row>
                    <el-col class="marginBottom20">
                        <el-row>
                            <el-col :span="4" class="lineHeight40">
                                名称
                            </el-col>
                            <el-col :span="14">
                                <el-input v-model="editTnput" maxlength="20" style="width:200px" placeholder="输入名称查询"></el-input> 0/20
                            </el-col>                       
                        </el-row>                    
                    </el-col>
                    <el-col class="marginBottom20">
                        <el-row>
                            <el-col :span="4" class="lineHeight40">
                                选择课程
                            </el-col>
                            <el-col :span="10">
                                <el-button type="primary" @click="selectCourseEven(1)">选择课程</el-button>
                                已添加 <span style="color: #F56C6C;">{{editCourseIds.length||0}}</span> 门课程
                            </el-col> 
                        </el-row>                  
                    </el-col>
                </el-row>             
                <div class="dialog-footer centerCss">
                    <el-button @click="dialogVisibleThree = false">取 消</el-button>
                    <el-button type="primary" @click="visibleThreeEven(1)">确 定</el-button>
                </div>
            </div>
            <div class="dialogTwo" v-if="dialogTypeTwo">
                <el-row>
                    <el-col>
                        <el-row>
                            <el-col :span="4" class="lineHeight40 rightCss">
                                课程有效期
                            </el-col>
                            <el-col :span="14">
                                <el-input v-model="timeLimitinput" maxlength="3" @blur="timeLimitBlur" style="width:200px" placeholder="≥1≤730,0为无限制"></el-input> 天
                                <span v-if="isShowTips" style="color: #F56C6C;font-size: 12px;">内容错误</span>
                            </el-col>                                            
                        </el-row>                    
                    </el-col>
                    <el-col class="marginBottom20">
                        <el-row>
                            <el-col :span="4" class="lineHeight40 rightCss">
                                选择课程
                            </el-col>
                            <el-col :span="10">
                                <el-button type="primary"  @click="selectCourseEven(2)">选择课程</el-button>
                                已添加 <span style="color: #F56C6C;">{{editCourseIds.length||0}}</span> 门课程
                            </el-col>  
                        </el-row>                  
                    </el-col>
                </el-row>  
                <div class="dialog-footer centerCss">
                    <el-button @click="dialogVisibleThree = false">取 消</el-button>
                    <el-button type="primary" @click="visibleThreeEven(2)">确 定</el-button>
                </div>
            </div>
            <div class="dialogThree centerCss"  v-if="dialogTypeThree">
                <div class="lineHeight40 marginBottom20">确定要禁用这个批次的活动吗？</div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleThree = false">取 消</el-button>
                    <el-button type="primary" @click="visibleThreeEven(3)">确 定</el-button>
                </div>
            </div>                    
        </el-dialog>      
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        @close='closeDialog'
        width="40%"
        >
            <div class="centerCss">
                <courseListPlugin v-if="dialogVisibleFour" :urlPorp="urls" :varObjs='varObj' :chooseIdlist="form.courseIds" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>      
                   <!-- <giveCoursecret v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIds" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></giveCoursecret>                  -->
            </div>                    
        </el-dialog>                            
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
// import giveCoursecret from './giveCoursecret';
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
export default {
    data() {
        return {
            titleList:[
                {
                    name:'活动',
                    pathInfo:'/activityObjList'
                },
                {
                    name:'赠课注册系统',
                    pathInfo:''
                }               
            ],
            pageNo:1,
            pageNo1:1,
            pageNo2:1,
            pageSize:10,
            tableData:[],
            tableDataOne:[],
            tableDataTwo:[],
            loading:false,
            dialogVisibleOne:false,
            dialogVisibleTwo:false,
            dialogVisibleThree:false,
            dialogVisibleFour:false,
            dialogTypeOne:'',
            dialogTypeTwo:'',
            dialogTypeThree:'',
            input:'',
            editTnput:'',
            varObj:{
                mtypeText:true,
                pageType:true,//是否分页
            },  
            // urls:'/coupons/getCourseListForCoupon', 
             urls:'/course/getList', 
            form:{
                courseIds:[]
            },
            courseselectType:"coupon",
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
            }, 
            pageAtion1:{
                paginationPage:1,
                pageTotal:0
            },  
            pageAtion2:{
                paginationPage:1,
                pageTotal:0
            },               
        };
    },
    metaInfo: {
        title: "新用户赠课活动"
    },
    components: {
        pagination,
        breadcrumb,
        // giveCoursecret
        courseListPlugin
    },
    watch: {},
    created() {
       this.getGiveCourseList()
    },
    methods: {
        childPageValue(num){
            if(Number(num)>0){
                this.getGiveCourseList(Number(num))
            }            
        },  
        childPageValue1(num){
            if(Number(num)>0){
                this.getGiveCourseDetailList(Number(num))
            }            
        }, 
        childPageValue2(num){
            if(Number(num)>0){
                this.getGiveCourseHistoryList(Number(num))
            }            
        },                       
        //关闭课程弹框
        closeDialog(){
            var self = this;
            self.dialogVisibleFour = false;
            self.dialogVisibleOne=false;
            self.dialogVisibleTwo=false;  
            self.dialogVisibleThree = true;   
            if(self.selectCourseType==1){               
                self.dialogTypeTwo=false;
                self.dialogTypeThree=false; 
                self.dialogTypeOne=true; 
            }else{                
                self.dialogTypeThree=false;    
                self.dialogTypeOne=false;
                self.dialogTypeTwo=true; 
            }                        
        },
        //选择课程
        selectCourseEven(type){
            var self = this;
            if(type==2){
                self.form.courseIds =[];
            }
            self.dialogVisibleOne=false;
            self.dialogVisibleTwo=false;                
            self.dialogVisibleThree = false;
            self.dialogVisibleFour = true;
            self.selectCourseType = type; 
        },
        //点击确定事件
        visibleThreeEven(type){
            switch (type) {
                case 1:
                    this.changeSystemCourse();
                    break;
                case 2:
                    this.addCourseSystemEven();
                    break;
                case 3:
                    this.switchsChange();
                    break;                                
                default:
                    break;
            }
        },
        //追加
        addCourseSystemEven(){
            // selectData
            var self = this;
            if(self.timeLimitinput===''){
                this.$message.error('请输入有效期');
                return;
            }
            if(!self.editCourseIds.length){
                this.$message.error('请选择课程');
                return;
            }            
            let params={
                activityRegisterId:self.selectData.id,
                validDays:self.timeLimitinput,
                courseIds:self.editCourseIds.toString() 
            }
            this.$http.post(this.$server.getAdditionalCourse,params).then(res=>{
                this.loading = false;
                if(res.status==200){ 
                    self.dialogVisibleThree = false;    
                    self.dialogTypeOne=false;    
                    this.getGiveCourseList();                   
                }
            }).catch(()=>{})             
        },
        //修改
        changeSystemCourse(){
            var self = this;
            if(self.editTnput===''){
                this.$message.error('请输入名称');
                return;
            }   
            if(!self.editCourseIds.length){
                this.$message.error('请选择课程');
                return;
            }                       
            let params={
                id:self.selectData.id,
                activityName:self.editTnput,
                courseIds:self.editCourseIds.toString() 
            }
            this.$http.post(this.$server.getUpdateActivityRegister,params).then(res=>{
                this.loading = false;
                if(res.status==200){ 
                    self.dialogVisibleThree = false;    
                    self.dialogTypeOne=false;    
                    this.getGiveCourseList();                   
                }
            }).catch(()=>{})            
        },
        //搜索
        selectEven(){
            this.getGiveCourseList();
        },
        listSelectEven(data){
            var self = this;
            self.form.courseIds = [];
            self.courseList = data.datas;
            if(self.courseList.length){
                self.couserBool = false;
            }
            data.datas.forEach(element => {
                self.form.courseIds.push(element.content)
            });
            self.editCourseIds =  self.form.courseIds;
            self.dialogVisibleFour = false;
            self.dialogVisibleOne=false;
            self.dialogVisibleTwo=false; 
            self.dialogVisibleThree = true;           
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
                    pageSize:this.pageSize,
                    activityName:this.input
                }
            }
            this.$http.get(this.$server.getActivityRegisterList,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    // this.tableData = res.content.list.map((item,index)=>{
                    //     item.sortId = (this.pageNo-1)*this.pageSize+index+1;
                    //     return item;
                    // })                    
                    // this.total = res.content.total;
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
        },
        /**
         * 获取列表详情
         */
        getGiveCourseDetailList(num){
            var self = this;
            this.loading = true;
            if(num){
                self.pageNo1 = num;
            }             
            let query = {
                params:{
                    pageNo:this.pageNo1,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(`${this.$server.getRegisterDetail}/${self.selectData.id}`,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    // this.tableDataOne = res.content.list.map((item,index)=>{
                    //     item.sortId = (this.pageNo1-1)*this.pageSize+index+1;
                    //     return item;
                    // })                    
                    // this.total1 = res.content.total;
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
                    self.tableDataOne = listIds;
                    self.pageAtion1.pageTotal = contentdate.total;
                    self.pageAtion1.paginationPage = self.pageNo1;
                    self.$nextTick(function(){
                        self.loading = false; 
                    })
                }
            }).catch(()=>{
                this.loading = false;
            })
        },  
        /**
         * 获取列表记录
         */
        getGiveCourseHistoryList(num){
            var self = this;
            this.loading = true;
            if(num){
                self.pageNo2 = num;
            }              
            let query = {
                params:{
                    pageNo:this.pageNo2,
                    pageSize:this.pageSize
                }
            }
            this.$http.get(`${this.$server.getRegisterRecord}/${self.selectData.id}`,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    // this.tableDataTwo = res.content.list.map((item,index)=>{
                    //     item.sortId = (this.pageNo2-1)*this.pageSize+index+1;
                    //     return item;
                    // })                    
                    // this.total2 = res.content.total;


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
                    self.tableDataTwo = listIds;
                    self.pageAtion2.pageTotal = contentdate.total;
                    self.pageAtion2.paginationPage = self.pageNo2;
                    self.$nextTick(function(){
                        self.loading = false; 
                    })                    
                }
            }).catch(()=>{
                this.loading = false;
            })
        },               
        /**
         * 编辑
         */
        edit(obj){
            var self = this;
            self.selectData = obj;
            self.dialogVisibleOne=false;
            self.dialogVisibleTwo=false;                
            self.dialogVisibleThree = true;
            self.dialogTypeThree = false;
            self.dialogTypeOne=true;
            self.dialogTypeTwo=false;   
            self.$http.get(`${self.$server.getRegisterFindById}/${obj.id}`).then(res=>{
                if(res.status==200){
                    self.editTnput = res.content.activityName;
                    self.editCourseIds = res.content.courseIds;
                    self.form.courseIds = res.content.courseIds;
                }
            }).catch(()=>{
            })            
        },
        switchs(obj){
            var self = this;
            this.selectData = obj;
            if(obj.enabled==1){
                self.dialogVisibleOne=false;
                self.dialogVisibleTwo=false;                
                self.dialogVisibleThree = true;
                self.dialogTypeThree = true;
                self.dialogTypeOne=false;
                self.dialogTypeTwo=false;               
            }else{
                self.switchsChange();
            }
        },
        //启动禁用函数
        switchsChange(){
            var self = this;
            self.$http.post(`${self.$server.getRegisterSetEnabled}/${self.selectData.id}`,{}).then(res=>{
                if(res.status==200){
                    self.$message({
                        type:'success',
                        message:res.content
                    })               
                    self.dialogVisibleThree = false;
                    self.dialogTypeThree = false;                    
                    self.getGiveCourseList();
                }
            })
        },
        /**
         * 去详情页面
         */
        goDetails(obj){
            this.selectData = obj;
            this.dialogVisibleOne=true;
            this.dialogVisibleTwo=false;                
            this.dialogVisibleThree = false;
            this.dialogVisibleFour = false;      
            this.$http.get(`${this.$server.getRegisterFindById}/${obj.id}`).then(res=>{
                if(res.status==200){
                    this.courseListTitle = res.content.courseName;
                }
            })                  
            this.getGiveCourseDetailList();
        },
        /**
         * 去记录页面
         */        
        goRecord(obj){
            this.selectData = obj;
            this.dialogVisibleOne=false;
            this.dialogVisibleTwo=true;                
            this.dialogVisibleThree = false;
            this.dialogVisibleFour = false;              
            this.getGiveCourseHistoryList();
        },
        /**
         * 追加课程
         */
        addToCourse(obj){
            var self = this;
            self.selectData = obj;
            self.dialogVisibleOne=false;
            self.dialogVisibleTwo=false;                
            self.dialogVisibleThree = true;
            self.dialogTypeThree = false;
            self.dialogTypeOne=false;
            self.dialogTypeTwo=true; 
            self.timeLimitinput = '';
            self.$http.get(`${self.$server.getRegisterFindById}/${obj.id}`).then(res=>{
                if(res.status==200){
                    self.editCourseIds = res.content.courseIds;
                }
            }).catch(()=>{
            })            
        },
        timeLimitBlur(){
            var self = this;
            var regex=/^[0-9]+$/;
            if(regex.test(self.timeLimitinput)){
                if(self.timeLimitinput>730){
                    self.isShowTips = true;
                    self.timeLimitinput = '';
                }else{
                    self.isShowTips = false;
                }
            }else{
                    self.isShowTips = true;
                    self.timeLimitinput = '';
            }
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

