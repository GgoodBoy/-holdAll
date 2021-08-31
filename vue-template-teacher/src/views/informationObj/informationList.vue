<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col :span="12">
                <breadcrumb :menuList ='titleList'></breadcrumb> 
            </el-col> 
            <el-col :span="12" class="lRight-r cursorCss">
                <p v-if="$authJudge('information:appsecond')" @click="routerToPage">设置App二级页面手动列表</p>
            </el-col> 
            <el-col class="lRight-r lMarginTop20">
                <el-row>
                    <el-col :span="5">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                    placeholder="输入资讯名称查询"
                                    class="search-form"
                                    clearable
                                    width="100%"></el-input>   
                        </div>
                    </el-col>
                    <el-col :span="4">
                            <el-row>
                                <el-col :span="8" class="lCenter-r" style="fontSize:14px">状态 : </el-col>
                                <el-col :span="15" :offset="1">
                                    <el-select v-model="value" placeholder="状态">
                                        <el-option
                                        v-for="item in learnType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>                                    
                                </el-col>
                            </el-row>                          
                    </el-col>
                    <el-col :span="1"  :offset="1" v-if="$authJudge('information:select')"><el-button type="primary" @click="findInfo">查询</el-button></el-col>
                    <el-col :span="2" :offset="11" v-if="$authJudge('information:add')" ><el-button type="primary" @click="informatonEven('','add')">新建资讯</el-button></el-col>
                </el-row>
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
                        prop="name"
                        label="名称"
                        align="center"
                        show-overflow-tooltip
                        min-width="150">
                    </el-table-column>                    
                    <el-table-column
                        prop="creatorName"
                        label="创建人"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="发表时间"
                        align="center"
                        min-width="140">
                    </el-table-column>
                    <el-table-column
                        prop="browseCount"
                        label="查看数量"
                        align="center"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        align="center"
                        min-width="80">
                        <template slot-scope="scope">
                            <el-row>
                                <el-col class="lCenter-r"> 
                                     <p v-if="scope.row.state==1">草稿 </p> 
                                     <p v-if="scope.row.state==2">上线</p> 
                                     <p v-if="scope.row.state==3">下线</p>                                 
                                </el-col>                                
                            </el-row>                            
                        </template>                        
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="200"
                        >
                        <template slot-scope="scope">
                            <el-row>
                                <el-col :span="6" v-if="$authJudge('information:edit')"> 
                                     <el-button type="text" class="black-btn" @click="informatonEven(scope.row,'edit')">编辑</el-button>                                   
                                </el-col>   
                                <el-col :span="6">
                                    <el-button type="text" class="black-btn" @click="informatonEven(scope.row,'upOrDown')">
                                        <span v-if="$authJudge('information:online')" v-show="scope.row.state==1||scope.row.state==3">上线</span>
                                        <span v-if="$authJudge('information:offline')" v-show="scope.row.state==2">下线</span>                                        
                                    </el-button>
                                </el-col>                                                                                             
                                <el-col :span="6" v-if="scope.row.state!=2">
                                    <el-button type="text" v-if="$authJudge('information:del')" class="black-btn" @click="informatonEven(scope.row,'delete')">删除</el-button>
                                </el-col>
                                <el-col :span="6" v-if="scope.row.state==2">
                                    <el-button type="text" class="black-btn" @click="informatonEven(scope.row,'top')">
                                        <span v-if="$authJudge('information:nottop')" v-show="scope.row.topType==1">取消置顶</span>
                                        <span v-if="$authJudge('information:top')" v-show="scope.row.topType!=1">置顶</span>
                                    </el-button>                                    
                                </el-col>   
                                <el-col :span="6">
                                    <el-button v-if="$authJudge('information:comment')" type="text" class="black-btn" @click="informatonEven(scope.row,'comment')">评论</el-button>
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
        <el-dialog title="提示" width="30%" :visible.sync="dialogTableVisible">
                <el-row>
                    <el-col>
                        <el-row class="lLine30">
                            <el-col v-if="titleNameType==1" class="lCenter-r">确定要下线这个资讯吗</el-col> 
                            <el-col v-if="titleNameType==2" class="lCenter-r">确定要删除这个资讯吗</el-col>
                            <el-col v-if="titleNameType==3" class="lCenter-r">确定要取消这个资讯的置顶吗</el-col>
                        </el-row>
                        <el-row  class="lLine30 lMarginTop40">
                            <el-col class="lCenter-r">
                                <el-button @click="isNoEven(titleNameType)">取 消</el-button>
                                <el-button class="redBackColor butColorF" @click="isOkEven(titleNameType)">确 定</el-button>                        
                            </el-col>                        
                        </el-row>
                    </el-col>
                </el-row>
        </el-dialog>   
        <el-dialog title="评论" width="30%" class="dialogTitle" :visible.sync="dialogCommonVisible" :center="true" :close-on-click-modal="false">
                <div class="dialogCss" @scroll="handleScroll" v-loading="loading1">
                    <el-row v-if="commentList.length>0">
                        <el-col  class="commentListCss" v-for="(item,i) in commentList" :key="i">
                            <el-row  class="lLine30 lMarginTop40">
                                <el-col span="3">
                                    <div class="imgDiv">
                                        <img :src="item.avatar"/>
                                    </div>
                                </el-col>
                                <el-col  span="21">
                                    <div>
                                        <span>{{item.nickname}}</span>
                                        <span style="font-size: 12px;color: #999;">{{item.createdAt}}</span>
                                    </div>
                                </el-col>
                                <el-col class="lLeftr-r" :span="17" :offset="3"><p class="pCss">{{item.content}}</p></el-col> 
                                <el-col class="lCenter-r butColor cursorCss" :span="4">
                                    <div @click="commentShowOrHide(item.status,i,item)">{{(item.status==0)?'隐藏':'显示'}}</div>
                                </el-col>   
                            </el-row>
                        </el-col>
                    </el-row>
                    <p v-else class="lCenter-r lPaddingTB40">该资讯还没有评论哦~</p>
                </div>
        </el-dialog>
        <el-dialog
            title=""
            :visible.sync="informationCheckbox"
            :close-on-click-modal="false"
            width="30%"
            class="lCenter-r">
            <div>
                <el-row :gutter="10">
                    <el-col :span="18">
                        <div class="iSeachEven">
                            <el-input v-model.trim="courseInfoTitle"
                                    placeholder="输入资讯名称查询"
                                    class="search-form"
                                    maxlength="10"
                                    width="100%"></el-input>   
                        </div>
                    </el-col>
                    <el-col :span="6" class="lCenter-r"><el-button class="redBackColor butColorF" @click="findInfoCourseEven">查询</el-button></el-col>
                </el-row>
            </div>
            <div class="checkboxCss">
                <el-checkbox-group v-if="cities.length>0" class="checkListCss" v-model="checkedCities" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="(city,i) in cities" :label="city.id" :key="i">{{city.name}}</el-checkbox>
                </el-checkbox-group>  
                <p v-else style="margin-top: 50px;">
                    没有找到您想要的内容
                </p>                               
            </div>
             <div>
                <el-button type="primary" @click="isNoListEven()">取消</el-button>
                <el-button type="primary" @click="isOkListEven()">确定</el-button>
             </div>
        </el-dialog>  
        <el-dialog
            title=""
            :visible.sync="informationDetail"
            :close-on-click-modal="false"
            width="30%"
            class="lCenter-r">
            <div>
                <el-row>
                    <el-col :span="6" class="textEllipsis lLeft-r" style="display: -webkit-box;">
                        <el-switch
                        v-model="switchValue"
                        @change="changeinformAtion"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                        </el-switch>
                        <p style="line-height:20px; padding:0 10px;">{{switchValue?'已开启':'已关闭'}}</p>
                    </el-col>
                    <el-col :span="18" class="cursorCss lRight-r">
                        <el-button class="redBackColor butColorF" :disabled="!switchValue" @click="addInformationEven">添加资讯</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="courseListBox">
                <el-row class="el-row-parents">
                    <el-col v-for="(item,i) in courseArryPropList" :key="i" class="lMarginBO20">
                        <el-row>
                            <el-col :span="20" class="textEllipsis lLeft-r" style="height: 33px;line-height: 33px;">{{item.name}}</el-col>
                            <!-- <el-col :span="2" class="cursorCss lCenter-r" style="margin-top: 8px;">
                                <i class="el-icon-circle-close" @click="deleteCourseEven(item,i)"></i>
                            </el-col> -->
                            <el-col :span="2" class="cursorCss lCenter-r" style="margin-top: 8px;">
                                <i class="el-icon-circle-close" @click="sortCourseEven(item,3,i)"></i>
                            </el-col>                            
                            <el-col :span="2" class="cursorCss lCenter-r" :class="{ 'topCss': ((i+1)==courseArryPropList.length?true:false)||(i>0?false:true) }">
                                <i class="el-icon-caret-top" v-if="i>0?true:false" @click="sortCourseEven(item,1,i)" style="display: block;"></i>
                                <i class="el-icon-caret-bottom"  v-if="(i+1)!=courseArryPropList.length?true:false" @click="sortCourseEven(item,2,i)" style="display: block;"></i>
                            </el-col>                            
                        </el-row>
                    </el-col>
                </el-row>
                <el-button class="redBackColor butColorF" :disabled="!switchValue" @click="saveCourseArryPropList">保存</el-button>               
            </div>
        </el-dialog>                                
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){                                         
        return {
            title:'',
            courseInfoTitle:'',
            value:'',
            loading:'',
            loading1:false,
            tableData:[],
            learnType:[
                {
                    label:'全部',
                    value:0
                },                
                {
                    label:'草稿',
                    value:1
                },{
                    label:'上线',
                    value:2
                },{
                    label:'下线',
                    value:3
                }
            ],
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            },
            pageNo:1,
            pageSize:10,            
            titleList:[
                    {
                        name:'资讯管理系统',
                        pathInfo:''
                    }
            ],
            dialogTableVisible:false,
            dialogCommonVisible:false,
            informationDetail:false,
            informationCheckbox:false,
            titleNameType:'',
            selectData:'',
            selectPageNum:1,
            topNumber:0,
            switchValue:false,
            scorllBool:true,
            pageNo1:1,
            commentList:[],
            showOrHideBool:-1,
            courseArryList:[],
            courseArryPropList:[],
            pageSize1:20,
            checkedCities: [],
            checkedCopyCities:[],
            checkelocalCourse:[],
            checkedCopyCitiesNext:[],
            cities: [],
            
            //临时存储数组
            temporaryList:[],//最新选中数组
            temporaryList1:[],//当前搜索有没有选中的数组
            temporaryList2:[],//当前搜索后存在的；

            //选中的评论id
            commentSwitchId:-1,

        }
    },
    created(){
        if(this.environmenttarget=='prod'){
            this.urlScienceBools = 1;
        }else if(this.environmenttarget=='beta'){
            this.urlScienceBools = 2;
        }else{
            this.urlScienceBools = 1;
        };        
        this.getTableInformationList(1);
    },
    computed: {
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }
    },    
    components:{
        breadcrumb
    },    
    methods:{
        //资讯添加课程列表
        findInfoCourseEven(){
            this.getinformationList();
        },
        //取消选择
        isNoListEven(){
            var self = this;
            self.informationCheckbox = false;
            setTimeout(()=>{
                self.informationDetail = true;
                self.courseArryPropList = self.courseArryList; 
                var list =[];
                for (const iterator of self.courseArryList) {
                    list.push(iterator.id);
                }
                // self.checkedCities = list;
                self.checkedCopyCitiesNext = list;
                self.checkelocalCourse = list;
            },300);
        },
        //确认选择
        isOkListEven(){
            var self = this;          
            self.$http.post(self.$server.getAddSecondMenu,{content:JSON.stringify(self.checkedCopyCitiesNext)}).then(res=>{
                if(res.status==200){
                    // self.cities = res.content.list;
                    self.informationCheckbox = false;
                    setTimeout(()=>{
                        self.informationDetail = true;
                        self.courseInfoTitle = '';
                        self.checkedCities = [];
                        self.checkelocalCourse = [];
                        self.checkedCopyCitiesNext = []; 
                        self.cities =[];          
                        self.temporaryList1=[];
                        self.temporaryList2=[];                                  
                        self.getInformationsecondList();
                    },300);                    
                }
            });            
        },
        //复选框数据选择事件
        handleCheckedCitiesChange(vaule){
            // checkedCities: [],
            // checkedCopyCities:[], //搜索后的列表集合
            // checkelocalCourse:[],  本地不变的；  
            var self = this;   
            self.temporaryList1 =[];
            self.temporaryList2 =[];
                if(!self.temporaryList){
                    self.temporaryList = self.checkelocalCourse;  //初始化选中的数组付给实时选中的数组；
                }
                //当前列表数组选中与未选中的数组；
                for (const iterator1 of self.checkedCopyCities) {
                    var indexs=vaule.indexOf(iterator1);
                    if(indexs==-1){
                        self.temporaryList1.push(iterator1);
                    }else{
                        self.temporaryList2.push(iterator1);
                    }
                };
                self.temporaryList = self.temporaryList2.concat(self.temporaryList);
                self.temporaryList = [...new Set(self.temporaryList)];  
                for(const iterator2 of self.temporaryList1){ 
                        var indexs=self.temporaryList.indexOf(iterator2);
                        if(indexs!=-1){
                            self.temporaryList.splice(indexs, 1);  
                        }                
                }
                self.checkedCopyCitiesNext = self.temporaryList;


                console.log(self.checkedCopyCitiesNext); //[1,2,3]
                 


                
        },
        //点击添加资讯按钮
        addInformationEven(){
            var self = this;
            self.dialogTableVisible = false,
            self.dialogCommonVisible = false,
            self.informationDetail = false,
            setTimeout(()=>{
                self.informationCheckbox = true;
                self.getinformationList();
            },300);
        },
        //多选资讯列表
        getinformationList(){
            var self = this;
            // 去掉特殊字符  
            var converter = document.createElement("DIV"); 
            converter.innerHTML = self.courseInfoTitle; 
            var b = converter.innerText; 
            converter = null; 
            var c=b.replace(/[&\|\\\*^%$#@\-?《》——（）。，~`,.<>='‘’；"":；();:{}+_]/g,"");               
            var paramsObj = {
               name:c
            };            
            self.checkedCopyCities =[];
            self.$http.get(self.$server.getinformationList(paramsObj)).then(res=>{
                if(res.status==200){
                    self.cities = res.content.list;
                        var list = [];
                        for (const iterator of res.content.list) {
                            list.push(iterator.id);
                        }
                        self.checkedCopyCities=list;     
                }
            });              
        },
        //开关
        changeinformAtion(val){
            var self = this;
            var paramsObj = {
                type:5,
                enable:val?1:0
            };
            self.$http.post(self.$server.getInformationEnable,paramsObj).then(res=>{
                if(res.status==200){
                    if(val){
                        self.courseArryPropList = self.courseArryList;
                    }else{
                        self.courseArryPropList = [];
                    }
                }
            });
        },
        // //删除列表消息
        // deleteCourseEven(data,index){
        //     var self = this;
        //     self.$http.delete(self.$server.setDeleteBySecondList({id:data.id})).then(res=>{
        //         if(res.status==200){
        //             self.getInformationsecondList()
        //         }
        //     });             
        // },
        //排序
        sortCourseEven(data,type,index){
            switch (type) {
                //向上排序
                case 1:
                    this.courseArryPropList.splice(index, 1);
                    this.courseArryPropList.splice(index-1, 0,data);
                    break;
                //向下排序
                case 2:
                    this.courseArryPropList.splice(index, 1);
                    this.courseArryPropList.splice(index+1, 0,data);                    
                    break;
                //删除  
                case 3:
                    this.courseArryPropList.splice(index, 1);
                    break;                              
                default:
                    break;
            }
        },
        saveCourseArryPropList(){
            var self = this;
            let list=[];
            this.courseArryPropList.forEach((data,index)=>{
                // var objs = {};
                // objs[data.id] = index; 
                var objs = {
                    id:data.informationId,
                    sort:index
                };
                list.push(objs);                 
            });
            self.$http.post(self.$server.informationSort,{appSeconds:JSON.stringify(list)}).then(res=>{
                if(res.status==200){
                    self.informationDetail = false;
                   this.$message.success('设置成功');
                }
            });            
        },
        getInformationsecondList(){
           var self = this;
            self.checkedCopyCitiesNext =[];
            self.checkedCities = [];
            self.$http.get(self.$server.getInformationsecondList).then(res=>{
                if(res.status==200){
                    self.courseArryList = res.content.list;
                    self.courseArryPropList = self.courseArryList; 
                    if(self.courseArryList&&self.courseArryList.length>0){
                        var list =[];
                        for (const iterator of self.courseArryList) {
                            list.push(iterator.informationId);
                        }
                        self.checkedCities = list;//动态值
                        self.checkelocalCourse = list;//第一次获取选中的所有值
                        self.checkedCopyCitiesNext = list;//最后提交给后台的值
                    }
                }
            });             
        },
        //跳转到二级页面
        routerToPage(){
            this.dialogCommonVisible = false;
            this.dialogTableVisible = false;
            this.informationDetail = true;
            this.checkedCities= [];
            this.checkedCopyCities=[];
            this.checkelocalCourse=[];
            this.checkedCopyCitiesNext=[];
            this.cities= [];            
            this.getInformationSwitch(5);
            this.getInformationsecondList();
        },
        commentShowOrHide(boos,i,data){
            var self = this;
            var params = {
                id:data.id,
                status:boos==0?1:0
            };
            self.$http.post(self.$server.getSetCommentShow,params).then(res=>{
                if(res.status==200){     
                    // self.backfillData(self.selectData.id,this.pageNo1);   
                    self.commentList[i].status=(boos==0?1:0);
                }
            });             
        },
        handleScroll(e) {
            //scrollTop为滚动条在Y轴上的滚动距离。
            //clientHeight为内容可视区域的高度。
            //scrollHeight为内容可视区域的高度加上溢出（滚动）的距离。 
            var self = this;
            // self.handleCommentTop = e.srcElement.scrollTop;
            if(e.srcElement.scrollTop+e.srcElement.offsetHeight==e.srcElement.scrollHeight){ 
                // this.loadMore();
                if(self.scorllBool){
                    this.pageNo1++;
                        //加载更多npm sta
                    this.backfillData(self.selectData.id,this.pageNo1);                        
                }
            }else{
                console.log("222");
            }
        },  
        getInformationSwitch(num){
            var self = this;
            self.$http.get(self.$server.getInformationSwitch({type:num})).then(res=>{
                if(res.status==200){
                    this.switchValue = res.content.isEnable==1?true:false;
                }
            });            
        },    
        backfillData(commentId,pageNumber){
            var self = this;
            self.loading1 = true;
            if(pageNumber==1){
                self.imgList = [];
                self.pageNo1=pageNumber;
            }                
            var parmes = {
                informationId:commentId,
                pageNo:pageNumber,
                pageSize:self.pageSize1
            }
            self.$http.get(self.$server.getTypeCommentList(parmes)).then(res=>{
                if(res.status==200){ 
                    var list = [];
                    if(res.content.list.length>0){
                        res.content.list.forEach(element => {
                            // element.content=JSON.parse(element.content);
                            list.push(element)
                        });
                        if(res.content.list.length<self.pageSize1){
                                self.scorllBool=false;
                        }
                    }else{
                        self.scorllBool=false;
                    }
                    self.commentList = self.commentList.concat(list);
                }
            });  
            self.$nextTick(function(){
                    self.loading1 = false;
            })
        }, 
        informatonEven(data,state){
            this.selectData = data;
            switch (state) {
                case 'edit':
                    this.$router.push({path: "/informationList/creatInformation",query:{id:data.id,addOrEdit:'edit'}});
                    break;
                case 'add':
                    this.$router.push({path: "/informationList/creatInformation",query:{addOrEdit:'add'}});
                    break;                    
                case 'upOrDown':
                    this.upOrDownEven(data);
                    break;
                case 'delete':
                    this.dialogTableVisible=true;
                    //删除提示
                    this.titleNameType=2;
                    break;
                case 'top':
                    this.topOrNoTopEven(data);
                    break; 
                case 'comment':
                    this.dialogCommonVisible = true;
                    this.commentList.splice(0,this.commentList.length)
                    this.backfillData(data.id,this.pageNo1);
                    break;                                                                   
                default:
                    break;
            }
        },
        getTypeCommentInfo(numberId){
            var self = this;
            var params = {
                id:data.id
            };
            self.$http.get(self.$server.informationUpTop(params)).then(res=>{
                if(res.status==200){
                    self.getTableInformationList(1);   
                }
            });            
        },
        isNoEven(state){
            this.dialogTableVisible=false;
        },
        isOkEven(state){
            var self = this;
            switch (state) {
                case 1:
                    var params = {
                        id:self.selectData.id
                    };
                    self.$http.post(self.$server.informationDown(params)).then(res=>{
                        if(res.status==200){   
                            self.dialogTableVisible=false;
                            self.getTableInformationList(self.selectPageNum);   
                        }
                    });                     
                    break;
                case 2:
                    self.$http.delete(self.$server.informationDelete({id:self.selectData.id})).then(res=>{
                        if(res.status==200){   
                            self.dialogTableVisible=false;
                            self.getTableInformationList(self.selectPageNum);   
                        }
                    });                      
                    break;
                case 3:
                    var params = {
                        id:self.selectData.id
                    };
                    self.$http.post(self.$server.informationDownTop(params)).then(res=>{
                        if(res.status==200){   
                            self.dialogTableVisible=false;
                            self.getTableInformationList(self.selectPageNum);   
                        }
                    });                     
                    break;                                
                default:
                    break;
            }
        },
        topOrNoTopEven(data){
            var self=this;
            if(data.topType==1){
                //取消置顶提示
                self.dialogTableVisible=true;
                self.titleNameType=3;                               
            }else{
                if(self.topNumber<10){
                    var params = {
                        id:data.id
                    };
                    self.$http.post(self.$server.informationUpTop(params)).then(res=>{
                        if(res.status==200){
                            self.getTableInformationList(1);   
                        }
                    });
                }else{
                    self.$message.error("最多置顶10条信息");
                }
            }
        },
        upOrDownEven(data){
            var self=this;
            if(data.state==2){
                    if(data.topType==1){
                        self.$message.error("请取消置顶！");
                    }else{
                        //下线提示
                        self.dialogTableVisible=true;
                        self.titleNameType=1; 
                    }
            }else{
                var params = {
                    id:data.id
                };
                self.$http.post(self.$server.informationUp(params)).then(res=>{
                    if(res.status==200){
                        self.getTableInformationList(1);   
                    }
                });                
            }
        },
        findInfo(){
            this.getTableInformationList(1);
        },
        getTableInformationList(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            self.topNumber = 0;
            var params = {
                name:encodeURIComponent(self.title),
                state:self.value,
                pageNo:self.pageNo,
                pageSize:self.pageSize
            };
            self.$http.get(self.$server.informationPetPage(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                if(element.topType==1){
                                    self.topNumber ++;
                                }
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                if(element.topType==1){
                                    self.topNumber ++;
                                }
                                return element;
                            });                            
                        } 
                   };
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
                    console.log('topNumber',self.topNumber);
               }
            })                        
        },
        childPageValue(num){
            this.selectPageNum = Number(num);
            if(Number(num)>0){
                this.getTableInformationList(Number(num))
            }            
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
.el-dialog .dialogCss{
    height: 600px;
    overflow-y: auto;
}
.dialogCss .commentListCss{
    border-bottom: 1px solid #EDF1F7;
}
.dialogCss .commentListCss .pCss{
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
}
.dialogCss .imgDiv{
    width: 30px;
    height: 30px;
    overflow: hidden;
    border-radius: 50%;
    /* margin: auto; */
}
.dialogCss .imgDiv img{
    width: 100%;
    height: 100%;
}
.courseListBox{
    margin-top: 20px;
}
.el-row-parents{
    max-height: 500px;
    overflow-y: auto;
}
.checkboxCss{
    max-height: 500px;
    min-height: 200px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
.checkboxCss .checkListCss .el-checkbox{
    display: -webkit-box;
    margin-left: 30px;
    margin-top: 20px;
}   
.checkboxCss .checkListCss .el-checkbox .el-checkbox__label{
    width: calc(100% - 14px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    text-align: left;
} 
.dialogTitle .el-dialog .el-dialog__header{
    background: #f2f2f2;
}
.topCss{
    margin-top: 8px;
}
</style>


