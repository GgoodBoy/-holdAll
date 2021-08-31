<template>
    <div>
        <!-- v-if="!boolpluginForDetail" -->
        <el-row >
            <el-col>
                <el-row class="lLine40 headerDiv">
                    <el-col class="lSize18">
                        <el-row class="lSize16">
                            <el-col :span="8" class="lLeft-r">
                                <breadcrumb :menuList ='titleList'></breadcrumb>
                            </el-col>
                            <el-col :span="2" :offset="13" v-if="$authJudge('market:customer:add')"><el-button type="primary"  @click="creatNewKeyAccon">添加大客户免费课</el-button></el-col>
                        </el-row>                
                    </el-col>
                    <el-col class="lRight-r lMarginTop20">
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <div class="iSeachEven">
                                    <el-input v-model.trim="title"
                                            placeholder="请输入名称查询"
                                            class="search-form"
                                            width="100%"
                                            clearable
                                            ></el-input> 
                                            <!-- @keyup.native="proving1" -->
                                </div>
                            </el-col>                   
                            <el-col :span="3">
                                <el-select v-model="memberType"
                                        placeholder="状态">
                                    <el-option v-for="(item,i) in courseTypeList"
                                            :key="i"
                                            :label="item.name"
                                            :value="item.value"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="2" v-if="$authJudge('market:customer:select')"><el-button type="primary"  @click="searchMemberQuery">查询</el-button></el-col>
                        </el-row>
                    </el-col>
                </el-row>        
            </el-col>
            <el-col class="tableBoxCss">
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                :header-cell-style="tableHeaderColor"
                style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="50">
                    </el-table-column>                                                                                         
                    <el-table-column
                        prop="bagName"
                        label="名称"
                        align="center"
                        min-width="120">                        
                    </el-table-column>  
                    <el-table-column
                        label="有效期"
                        align="center"
                        min-width="120">
                        <template slot-scope="scope">
                               <span>{{scope.row.validityTime==0?"永久":scope.row.validityTime+'天'}}</span>                                                      
                        </template>                        
                    </el-table-column> 
                    <el-table-column
                        prop="nickname"
                        label="创建人"
                        align="center"
                        min-width="100">
                    </el-table-column>     
                    <el-table-column
                        prop="createdAt"
                        label="创建时间"
                        align="center"
                        min-width="150">
                    </el-table-column> 
                    <el-table-column
                        label="状态"
                        align="center"
                        min-width="60">
                        <template slot-scope="scope">
                            <p v-if="scope.row.status==1">草稿</p>
                            <p v-else-if="scope.row.status==2">已启用</p>
                            <p v-else-if="scope.row.status==3">已禁用</p>    
                        </template>                
                    </el-table-column>             
                    <el-table-column
                        prop="totalIntegral"
                        label="操作"
                        align="center"
                        min-width="160">
                        <template slot-scope="scope">
                            <el-row class="redFontColor"> 
                                <el-col :span="6" class="lCenter-r cursorCss">
                                    <div @click="tableListEven(1,scope.row)" v-if="$authJudge('market:customer:start')&&(scope.row.status==1||scope.row.status==3)">启用</div>
                                </el-col>   
                                <el-col :span="6" class="lCenter-r cursorCss">
                                    <div @click="tableListEven(2,scope.row)" v-if="$authJudge('market:customer:findItem')">详情</div>
                                </el-col>
                                <el-col :span="6" class="lCenter-r cursorCss" v-if="scope.row.status==2">
                                    <div @click="tableListEven(3,scope.row)" v-if="$authJudge('market:customer:disable')">禁用</div>
                                </el-col>
                                <el-col :span="6" class="lCenter-r cursorCss" v-if="scope.row.status==2">
                                    <div @click="tableListEven(4,scope.row)" v-if="$authJudge('market:customer:addCourses')">加课</div>
                                </el-col>  
                                <el-col :span="6" class="lCenter-r cursorCss" v-if="scope.row.status==2">
                                    <div @click="tableListEven(5,scope.row)" v-if="$authJudge('market:customer:addCellphones')">加用户</div>
                                </el-col>   
                                <el-col :span="6" class="lCenter-r cursorCss" v-if="scope.row.status==1">
                                    <div @click="tableListEven(6,scope.row)" v-if="$authJudge('market:customer:edit')">修改</div>
                                </el-col>                                                   
                            </el-row>                                                      
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
        <el-dialog  :visible.sync="courseselectPluginDialog" 
                    width="50%"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :show-close="false">
                    <!-- v-if="boolpluginForDetail" -->
            <courseselect :courseselectPlugin='courseselectPluginDialog' :urlPorp="urls" :InitIdlist="courseIds" :chooseIdlist="courseIdsNew" v-on:listSelect="listSelectEven"></courseselect>
        </el-dialog> 
        <el-dialog  
        title="加课" 
        :visible.sync="dialogAddCourse" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="35%"
        >
            <div>
                <div class="courseTitleList">
                    <span v-for="(items,j) in addCourseList" :key="j">{{items.title?items.title+'，':''}}</span>
                </div>
                <div class="courseSelectListBtn">
                    <div class="courseTitle">课程</div>
                    <div class="courseCount">
                        <el-button type="primary" @click="selectCourse">选择课程</el-button>
                        <div class="courseList">
                            <div class="courseListCount" v-for="(item,index) in addCourseListCopy" :key="index">
                                <p>{{item.title}}</p>
                                <i class="el-icon-circle-close" @click="removeSelectCourse(index)"></i>
                            </div>
                        </div>
                    </div>                    
                </div>
                <div style="text-align: center;">
                    <el-button type="primary" @click="isOkAddData(1)">保存</el-button>
                    <el-button type="info" @click="hiedeDialog(1)">取消</el-button> 
                </div>
            </div>
        </el-dialog>
        <el-dialog 
        title="加用户" 
        :visible.sync="dialogAddUserTelephone" 
        width="35%"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
            <div>
                <div class="telephoneTitleList">
                    <span v-for="(items,j) in addTelephoneList" :key="j">{{items.cellphone?items.cellphone+'，':''}}</span>
                </div>
                <div class="userSelectListBtn">
                    <div class="usersTitle">添加用户</div>
                    <div class="usersCount">
                        <!-- <el-input type="textarea" style="width:200px;" :rows="9"></el-input> -->
                        <textarea class="telePhoneTextarea" type="textarea" @input="getContent" rows="6" ref="textarea"  @click="getRows" @keydown="keyDownEvent($event)" @paste="pasteEvent" v-model="textarea"></textarea>
                        <div class="usersList">
                            <div class="usersListCount" v-for="(item,index) in addTelephoneListCopy" :key="index">
                                <p>{{item}}</p>
                                <i class="el-icon-circle-close" @click="removeSelectTelephone(index)"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="userTelePhoneSaveBut">
                    <div @click="saveTextareaInfo">保存</div>
                </div>
                <div style="text-align: center;">
                    <el-button type="primary" @click="isOkAddData(2)">保存</el-button>
                    <el-button type="info" @click="hiedeDialog(2)">取消</el-button> 
                </div>
            </div>
        </el-dialog>                
    </div>
</template>
<script>
import { getToken } from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import courseselect from "./courseAcconListTwo"; //推存选择课程组件
export default {
        data(){
            return {
                pageAtion:{
                    pageTotal:0,
                    paginationPage:1
                },   
                pageSize:10,
                pageNo:1,
                title:'',
                memberType:-1,
                courseTypeList:[
                    {
                        name:"全部",
                        value:-1
                    },
                    {
                        name:"草稿",
                        value:1
                    },
                    {
                        name:"已启用",
                        value:2
                    },
                    {
                        name:"已禁用",
                        value:3
                    }
                ],
                titleList:[
                            {
                                name:'系统合集',
                                pathInfo:'/marketelistlist'
                            },
                            {
                                name:'大客户免费课系统',
                                pathInfo:''
                            }                
                ],
                tableData:[],//列表信息
                dialogAddCourse:false,//加课
                addCourseList:[],//选中的课程列表回显
                addCourseListCopy:[],//要添加的课程
                clickState:1,//判断加课弹框是从哪个入口触发的；
                dialogAddUserTelephone:false,//加用户
                addTelephoneList:[],
                addTelephoneListCopy:[],
                telephoneIds:[],
                // boolpluginForDetail:false,//选择课程弹框列表
                courseIds:[],//选择的课程id(后台返回的数据)
                courseIdsNew:[],//正真需要添加保存的课程id;
                urls:'/customer/getOurCourses',
                //拷贝
                textarea:'',
                oldTextarea:'',
                rows:0,
                pasteFlag:false,
                courseselectPluginDialog:false,
                loading:true                
            };
        },
        created() {
            this.getStudylist(1);
        },
        components:{
            breadcrumb,
            courseselect
        },        
        methods: {          
            selectCourse(){
                this.dialogAddCourse = false;
                // this.boolpluginForDetail = true;
                setTimeout(()=>{
                    this.courseselectPluginDialog = true;
                },300);
                
            },
            //删除
            removeSelectCourse(index){
                var remDate =this.addCourseListCopy.splice(index, 1);
                var indexs =this.courseIdsNew.indexOf(remDate[0].id);
                this.courseIdsNew.splice(indexs,1);                
            },
            removeSelectTelephone(index){
                var remDate =this.addTelephoneListCopy.splice(index, 1);
            },
            creatNewKeyAccon(){
                this.$router.push('/marketelist/member/creatKeyAccountCard');
            },
            searchMemberQuery(){
                this.getStudylist(1);
            },
            //确定添加课程用弹框按钮
            isOkAddData(num){
                switch (num) {
                    case 1:
                        this.addCourseNewId();
                        this.dialogAddCourse=false;
                        break;
                    case 2:
                        this.addTelePhoneNewId();
                        this.dialogAddUserTelephone=false;
                        break;                
                    default:
                        break;
                }                
            },
            addTelePhoneNewId(){
                var self = this;
                var params = {
                    courseBagId: self.selectTableInfo.id,
                    cellphone:self.addTelephoneListCopy.join('\n')          
                };
                self.$http.post(self.$server.customerAddCellphones,params).then(res=>{
                    if(res.status==200){
                        self.addTelephoneListCopy =[];
                        self.addTelephoneList =[];
                        self.textarea =[];
                        self.$message.success({ message: "添加成功!" });                      
                    }
                })                
            },
            addCourseNewId(){
                var self = this;
                var params = {
                    courseBagId: self.selectTableInfo.id,
                    coursesIds:self.courseIdsNew.join(',')          
                };
                self.$http.post(self.$server.customerAddCourses,params).then(res=>{
                    if(res.status==200){
                        self.addCourseListCopy =[];
                        self.courseIdsNew =[];
                        self.courseIds =[];
                        self.$message.success({ message: "添加成功!" });                      
                    }
                })  
                                
            },
            // 修改table header的背景色
            tableHeaderColor({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 0) {
                    return 'background-color: #F3F3F3;font-weight: 500;font-size: 16px;'
                }
            }, 
            //保存添加的电话号码
            saveTextareaInfo(){
                let list = [...new Set([...this.addTelephoneListCopy,...this.textarea.split('\n')])];              
                this.addTelephoneListCopy = list;       
                this.textarea ='';        
            },            
            //关闭弹框
            hiedeDialog(num){
                switch (num) {
                    case 1:
                        this.dialogAddCourse=false;
                        break;
                    case 2:
                        this.dialogAddUserTelephone=false;
                        break;                
                    default:
                        break;
                }
            },
            //选择课程信息；
            listSelectEven(objs){
                if(objs.datas.length>0){
                    //新添加的展示数组
                    this.addCourseListCopy=objs.datas;
                    //新添加的展示id
                    this.courseIdsNew = objs.datas.map(x=>{
                        return x.id;
                    });                
                    if(objs.but=="isok"){
                        this.clickState = 2;
                    }else{
                        this.clickState = 1;
                        this.addCourserToList(this.selectTableInfo)
                    }
                 }
                // this.boolpluginForDetail =objs.bool;
                this.courseselectPluginDialog = objs.bool;
                setTimeout(()=>{
                    this.dialogAddCourse = true;
                },300);               
            },
            //获取大客户列表信息
            getStudylist(num){
                var self = this;
                if(num){
                    self.pageNo = num;
                }
                self.loading = true; 
                // status:encodeURIComponent(self.title)||'',
                var params = {
                    status:self.memberType,
                    pageSize:self.pageSize,
                    pageNo:self.pageNo,
                    bagName:encodeURIComponent(self.title),             
                };
                self.$http.get(self.$server.customerGetPage(params)).then(res=>{
                if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        listIds = contentdate.list.map(function(element,index){
                            if(contentdate.pageNum==1){
                                element.sortId = index+1;
                                return element;
                            }else if(contentdate.pageNum>1){
                                element.sortId = (contentdate.pageNum-1)*10+index+1;
                                return element;
                            }
                        }); 
                   };  
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loading = false; 
                }
                })  
            },      
            // proving1(){
            //     var self = this;
            //     var reg = /^(?!.*\\.*$)/;
            //     if(!reg.test(self.title)){
            //         this.title='';
            //     }
            // },      
            //表格操作
            tableListEven(num,data){
                this.selectTableInfo=data;
                switch (num) {
                    case 1:
                        this.courseBatchStart(data);
                        break;
                    case 2:
                         this.$router.push({path: '/marketelist/member/keyAccounDetail', query: {paramsId: data.id}});
                        break;
                    case 3:
                        this.diabledKeyAcconBatch(data)
                        break;
                    case 4:
                        this.clickState = 1;
                        this.dialogAddCourse = true;
                        this.addCourserToList(data);
                        break;
                    case 5:
                        this.dialogAddUserTelephone = true;
                         this.addTelephoneToList(data);
                        break; 
                    case 6:
                        this.$router.push({path: '/marketelist/member/creatKeyAccountCard', query: {courseBagId: data.id}});
                        break;                                                                                                               
                    default:
                        break;
                }
            },        
            //分页
            childPageValue(num){
                if(Number(num)>0){
                    this.getStudylist(Number(num))
                }            
            },
            //家电话号码回填
            addTelephoneToList(data){
                var self = this;
                if(this.clickState==1){
                    var params = {
                        courseBagId: data.id            
                    };
                    self.$http.get(self.$server.customerGetUsers(params)).then(res=>{
                        if(res.status==200){
                            this.addTelephoneList = res.content;
                            this.telephoneIds = res.content.map(x=>{
                                return x.id;
                            });                       
                        }
                    })  
                }                
            },
            //加课回填          
            addCourserToList(data){
                var self = this;
                if(this.clickState==1){
                    var params = {
                        courseBagId: data.id            
                    };
                    self.$http.get(self.$server.customerGetCourses(params)).then(res=>{
                        if(res.status==200){
                            this.addCourseList = res.content;
                            this.courseIds = res.content.map(x=>{
                                return x.id;
                            });                 
                        }
                    })  
                }
            },  
            //禁止
            diabledKeyAcconBatch(data){
                var self = this;
                var params = {
                    courseBagId: data.id            
                };
                self.$http.post(self.$server.customerDisable,params).then(res=>{
                    if(res.status==200){
                        self.$message.success({ message: "禁止完成" }); 
                        this.getStudylist();
                    }
                })                 
            },          
            //启动            
            courseBatchStart(data){
                var self = this;
                var params = {
                    courseBagId: data.id            
                };
                self.$http.post(self.$server.customerStart,params).then(res=>{
                    if(res.status==200){
                        self.$message.success({ message: "启动完成" }); 
                        self.getStudylist();
                    }
                })                 
            },
            //拷贝js  输入电话号码
        /**
         * 获取内容
         */
            getContent(){
                this.textarea = this.textarea.replace(/[^\d\n]/g, '');
                if(this.pasteFlag){
                    this.pasteFlag = false;
                    let temp = this.textarea.split('\n').map(item=>{
                        return item.length>11?item.substr(0,11):item
                    })
                    this.textarea = this.oldTextarea = temp.join('\n');
                    this.$nextTick(()=>{
                        this.getRows()
                    })
                    return false;
                }
                let index = this.rows - 1 < 0 ? 0 : this.rows - 1;
                let arr = this.textarea.split('\n');
                if(arr[index]&&arr[index].length>11){
                    this.textarea = this.oldTextarea
                    this.$nextTick(()=>{
                        this.getRows()
                    })
                    return;
                }
                this.oldTextarea = this.textarea;
            }, 
            /**
             * 根据光标获取行数 （鼠标点击）
             */
            getRows(){
                let index = this.getCursortPosition(this.$refs.textarea)
                let temp = this.textarea.substr(0,index)
                this.rows = temp.split('\n').length
            },    
            /**
             * 根据光标获取行数 （键盘回车，上移下移左移右移）
             */
            keyDownEvent(e){
                let code = [8,13,37,38,39,40]
                if(code.includes(e.keyCode)){
                    setTimeout(()=>{
                        let index = this.getCursortPosition(this.$refs.textarea)
                        let temp = this.textarea.substr(0,index)
                        this.rows = temp.split('\n').length
                    },1)
                }
            },
            /**
             * 获取光标的位置
             */
            getCursortPosition(dom){
                var cursorIndex = 0;
                if (document.selection) {
                    dom.focus();
                    var range = document.selection.createRange();
                    range.moveStart('character', -dom.value.length);
                    cursorIndex = range.text.length;
                } else if (dom.selectionStart || dom.selectionStart==0) {
                    cursorIndex = dom.selectionStart;
                }
                return cursorIndex;
            }, 
            /**
             * 粘贴事件
             */
            pasteEvent(){
                this.pasteFlag = true
            }                                          
        }
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
.courseTitleList,.telephoneTitleList{
    height: 150px;
    /* width: 100%; */
    border: 1px solid #F4f4f4;
    margin: 0 0 20px 0;
    overflow-y: auto;
}
.courseSelectListBtn,.userSelectListBtn{
        display: -webkit-inline-box;
        margin: 15px 0;
}
.courseSelectListBtn .courseCount,.userSelectListBtn .usersCount{
    display: -webkit-inline-box;
}
.courseSelectListBtn .courseCount .courseList,.userSelectListBtn .usersCount .usersList{
    height: 200px;
    overflow:auto;
    width: 200px;
    background: #fff;
    margin-left: 40px;
    padding: 0 0 0 10px;
}
.courseSelectListBtn .courseCount .courseList .courseListCount,.userSelectListBtn .usersCount .usersList .usersListCount{
    position: relative;
}
.courseSelectListBtn .courseCount .courseList .courseListCount i,.userSelectListBtn .usersCount .usersList .usersListCount i{
    position: absolute;
    top: 8px;
    right: 0px;    
}
.courseSelectListBtn .courseCount .courseList .courseListCount p,.userSelectListBtn .usersCount .usersList .usersListCount p{
    line-height: 30px;
    font-size: 14px;
    color: #606266;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;     
    width: 90%;
}
.courseSelectListBtn .courseTitle,.userSelectListBtn .usersTitle{
    width: 70px;
    text-align: right;
    padding: 0 12px 0 0;
    color: #606266;
    font-size: 14px;
}
.telePhoneTextarea{
    height: 200px!important;
    resize: none!important;
    display: block;
    width: 200px;
    border-radius: 5px;
    border-color:#ddd;
    padding: 25px;
    line-height: 20px;
    padding: 25px;
    font-size: 14px;
}
</style>
<style scoped lang="scss">
 .userTelePhoneSaveBut{
    margin: 0 auto 30px auto;
    width: 430px;
    div{
        width: 50px;
        height: 30px;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        border-radius: 6px;
        background: #9E0E00;
        color: #fff;    
        margin: auto;    
    }
}
.tableBoxCss{
    background-color: #ffffff;
    padding: 10px 14px; 
    margin: 10px 0;         
}
</style>
