<template>
    <div class="liantong-wrap">
        <el-row class="count">
            <el-col :span="5" class="redFontColor">总订购数:{{buyNumCount}}</el-col>
            <el-col :span="7" class="redFontColor">取消订购数:{{cancelNumCount}}</el-col>
        </el-row>  
        <div class="page-header">
            <el-row :gutter="10">
                <el-col :span="5">
                    <div class="keyword">
                        <el-input v-model="keyword"
                            placeholder="请输入流量包名称查询"
                            maxlength="20"
                            clearable
                            ></el-input>
                    </div>
                </el-col>       
                <el-col :span="3" v-if="$authJudge('unicom:select')">
                    <el-button type="primary" @click="select">查询</el-button>
                </el-col>                            
                <el-col :span="10" :offset="4" style="text-align: right;">
                    <el-button v-if="$authJudge('unicom:add')" type="primary" @click="addShow">设置流量包</el-button>
                    <el-button v-if="$authJudge('unicom:userpage')" type="primary" @click="listInfoShow">会员用户列表</el-button>
                    <el-button v-if="$authJudge('unicom:saveentrance')" type="primary" @click="switchDilg">入口设置</el-button>
                </el-col>
            </el-row>     
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="tableLoading"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="30"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="bagName"
                        label="流量包名称"
                        min-width="150"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="courseNames"
                        label="课程名称"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip>
                    </el-table-column>     
                    <el-table-column
                        prop="validityTime"
                        label="年月"
                        align="center"
                        width="80"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="buyNum"
                        label="订购数"
                        align="center"
                        width="80"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="cancelNum"
                        label="取消订购数"
                        align="center"
                        > 
                    </el-table-column>                                    
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="100"
                        >
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button v-if="$authJudge('unicom:edit')" size="small" type="text" @click="editShow(scope.row)">编辑</el-button>
                                    <el-button v-if="$authJudge('unicom:detail')" size="small" type="text" @click="toData(scope.row)">明细</el-button>
                                    <!-- <el-button v-if="$authJudge('unicom:order')" size="small" type="text" @click="toOrder(scope.row)">会员订单</el-button> -->
                                    <el-button v-if="$authJudge('unicom:order')" size="small" type="text" @click="toOrder(scope.row)">订单</el-button>
                                    <el-button v-if="$authJudge('unicom:flow')" size="small" type="text" @click="toFlowOrder(scope.row)">流量订单</el-button>
                                </div>                                              
                            </template>                    
                    </el-table-column>                                                
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :current-page.sync="tablePageNo"
                        :page-size="tablePageSize"
                        :total="total"
                    >
                    </el-pagination>
                </div>             
            </div>
        </div>
        <el-dialog
            title="流量包设置"
            :visible.sync="editDialogVisible"
            :custom-class="'edit-dialog'"
            :close-on-click-modal="false"
            center>
            <div class="box-item name">
                <label>流量包名称</label>
                <el-input maxlength="15" v-model="bagName"></el-input>
                <span class="num">{{bagName.length}}/15</span>
            </div>
            <div class="box-item date">
                <label>月份</label>
                <el-date-picker
                    v-model="validityTime"
                    type="month"
                    :picker-options="dateOption"
                    value-format="yyyy-MM"
                    :disabled="flag=='edit'"
                    placeholder="选择日期">
                </el-date-picker>
            </div>
            <div class="box-item course">
                <label>课程</label>
                <el-button type="primary" @click="showDialog">选择课程</el-button>
                <span class="num">已选择{{courseIds.length}}门课程</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="update">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :custom-class="'course-dialog'" :visible.sync="courseDialogVisible" :width="'500px'" :show-close="false">
            <div style="margin-bottom:20px;">
                <el-radio-group 
                    v-model="checkedCities" @change="changePlugin">
                    <el-radio v-for="(city,index) in cities" :label="city.value" :key="index">{{city.name}}</el-radio>
                </el-radio-group>                  
            </div>              
            <div class="search-box">
                <el-input placeholder="输入课程名称查询" clearable size="medium" prefix-icon="el-icon-search" v-model="searchKey" maxlength="10" @keypress.native="pressEvent($event)"></el-input>
                <el-button type="primary" size="medium" @click="search">搜索</el-button>
            </div>
            <div class="list" ref="scrollBox">
                <el-checkbox-group
                    v-model="dialogArr"
                    >
                    <div class="item nameTextEllipsis" v-for="(item,index) in editDialogList" :key="index">
                        <el-checkbox :label="item.id" :disabled="item.disabled">{{item.title}}</el-checkbox>
                        <div style='font-size:14px;'>{{item.price||0}}币</div>
                    </div>
                </el-checkbox-group>
                <div class="loading" v-show="loading"><div class="loading-icon" v-loading="true"></div></div>
                <p class="empty-tip" v-if="isLastPage&&editDialogList.length==0">没有搜索到您想要的内容</p>
            </div>
            <div slot="footer" class="btns">
                <el-button @click="courseDialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="dialogSure" size="medium">确定</el-button>
            </div>
        </el-dialog>  
        <el-dialog
        :visible.sync="flowDialogState"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        @close ="closeEven"
        width="50%"
        center>
            <el-row>
                <el-col>
                    <el-row :gutter="10">
                        <el-col :span="10">
                            <div class="iSeachEven">
                                <el-input v-model.trim="flowTelphone"
                                    placeholder="请输入手机号码"
                                    class="search-form"
                                    clearable
                                    width="100%">
                                </el-input>
                            </div>                       
                        </el-col>      
                        <el-col :span="4">
                            <el-select v-model="type"
                                clearable
                                placeholder="类型"
                                >
                                <el-option v-for="(item,i) in typeArr"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>                    
                        </el-col>                                                                       
                        <el-col :span="4">      
                            <el-button @click="selectflowEven" class="redBackColor butColorF">查询</el-button>               
                        </el-col>       
                        <el-col :span="4" :offset="2">      
                            <el-button @click="headExport" class="redBackColor butColorF">导出</el-button>               
                        </el-col>                                                 
                    </el-row>                        
                </el-col>
                <el-col>
                    <el-table
                    :data="tableFlowData"
                    v-loading="loading"
                    style="width: 100%;max-height:400px;overflow-y: auto;">                       
                        <el-table-column
                            prop="sortId"
                            label="序号"
                            min-width="40">
                        </el-table-column>
                        <el-table-column
                            prop="phone"
                            label="手机号"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            label="类型"
                            min-width="150">
                            <template slot-scope="scope"> 
                                <div style="text-align: left;">
                                    {{scope.row.type==1?'退订':'订购'}}
                                </div>                                              
                            </template>                            
                        </el-table-column> 
                        <el-table-column
                            prop="ordertime"
                            label="订单时间"
                            min-width="150">
                        </el-table-column>
                    </el-table>
                </el-col> 
            </el-row> 
            <div class="block">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="childPageValue"
                    :current-page.sync="pageAtion.paginationPage"
                    :total="pageAtion.pageTotal">
                </el-pagination>
            </div>            
        </el-dialog>   
        <el-dialog
        :visible.sync="listDialogVisible"
        :close-on-press-escape="false"
        width="60%"
        center>
                <div style="margin-bottom:20px;">
                    <el-row :gutter="10">
                        <el-col :span="10">
                            <div>
                                <el-input v-model.trim="inputInfo"
                                    placeholder="请输入会员账户"
                                    maxlength="20"
                                    clearable
                                    ></el-input>
                            </div>
                        </el-col>                                   
                        <el-col :span="3"><el-button type="primary" @click="selectDialogList">查询</el-button></el-col>
                    </el-row>     
                </div>                
                <el-table
                    border
                    :data="tableDataNext"
                    v-loading="loadingNext"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="40"
                        :show-overflow-tooltip="true">
                    </el-table-column> 
                    <el-table-column
                        prop="cellphone"
                        label="订购账户"
                        align="center"
                        min-width="150"
                        :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                        prop="validityTime"
                        label="有效期"
                        align="center"
                        min-width="150"
                        >
                    </el-table-column>                                                 
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValueNext"
                        :current-page.sync="pageAtionNext.paginationPage"
                        :total="pageAtionNext.pageTotal">
                    </el-pagination>
                </div>  
        </el-dialog>
          <!--:close-on-press-escape="false"  -->
        <el-dialog
        :visible.sync="dialogVisible"
        width="25%"
        center>
            <div class="flexBoxCss">
                <div style="margin:0 15px;">免流量服务入口设置:</div>
                <el-switch
                v-model="switchValue"
                @change="changeinformAtion"
                active-color="#13ce66"
                inactive-color="#ff4949">
                </el-switch>
                <p style="line-height:20px; padding:0 10px;">{{switchValue?'已开启':'已关闭'}}</p>
            </div>
        </el-dialog>                             
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import { getToken } from '@/utils/auth';
const regExp = {
    'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
    'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
    'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g //特殊字符(除了数字、字母、汉字) 
}
export default {    
    data() {   
        return {
            dateOption:{
                disabledDate: (time) => {
                    return time.getTime() <= new Date().getTime()
                }
            },
            editDialogVisible:false,
            bagName:'',
            validityTime:'',
            courseIds:[],
            id:'',
            flag:'',
            buyNumCount:'',
            cancelNumCount:'',
            keyword:'',
            tablePageNo:1,
            tablePageSize:10,
            total:1,
            tableData:[],
            tableDataNext:[],
            tableLoading:false,

            courseDialogVisible:false,
            listDialogVisible:false,
            dialogVisible:false,
            searchKey:'',
            oldSearchKey:'',
            searchFlag:false,
            pageNo:1,
            pageSize:20,
            pageSizeNext:10,
            pageNoNext:10,
            loading:false,
            dialogArr:[],
            courseCheckList:[],
            editDialogList:[],
            isLastPage:false,
            //ljm
            flowDialogState:false,
            tableFlowData:[],
            flowTelphone:'',
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },  
            pageAtionNext:{
                pageTotal:0,
                paginationPage:1
            },             
            pageNoDilg:1,
            selectTable:'',
            disabledState:false,
            typeArr:[
                {
                    label:'全部',
                    value:-1
                },{
                    label:'订购',
                    value:0
                },{
                    label:'退订',
                    value:1
                }
            ],
            type:-1,
            inputInfo:'',
            loadingNext:false,
            switchValue:false,
            checkedCities:1,
            cities: [
                {
                    name:'自营课程',
                    value:1
                }
                // ,
                // {
                //     name:'三方课程',
                //     value:2
                // }
            ]          
        };
    },
    metaInfo: {
        title: "流量包管理"
    },
    components: {
        pagination
    },
    watch: {
        tablePageNo(cur,old){
            if(cur>=1){
                this.getList()
            }
        },
        courseDialogVisible(cur,old){
            if(!cur){
                this.searchKey = ''
                this.pageNo = 1
                this.editDialogList = []
                this.oldSearchKey = ''
            }
        },
        dialogArr(cur,old){
            cur.forEach((item)=>{
                let index = this.courseCheckList.findIndex(option=>option.id==item);
                if(index==-1){
                    let obj = this.editDialogList.find(option=>option.id==item);
                    this.courseCheckList.push({
                        id:obj.id,
                        title:obj.title
                    })
                }
            })
        },       
        searchKey(cur,old){
            this.searchFlag = false;
        },
        editDialogVisible(cur,old){
            if(!cur){
                this.bagName = ''
                this.validityTime = ''
                this.courseIds = []
            }
        }
    },
    created() {
        this.getCount()
        this.getList();
    },
    methods: {
        //选择类型事件
        changePlugin(data){
            this.pageNo=1;
            this.editDialogList = []             
            // this.checkedCitiesVal = this.checkedCities.toString();
            this.getOurCoursesUse()
        },         
        /**
         * 获取统计总数
         */
        getCount(){
            let query = {
                params:{}
            }
            this.$http.get(this.$server.getCount,query).then(res=>{
                if(res.status==200){
                    this.buyNumCount = res.content.buyNumCount;
                    this.cancelNumCount = res.content.cancelNumCount;
                }
            })
        },
        /**
         * 获取列表数据
         */
        getList(){
            this.tableLoading = true;
            let query = {
                params:{
                    bagName:this.keyword,
                    pageNo:this.tablePageNo,
                    pageSize:this.tablePageSize
                }
            }
            this.$http.get(this.$server.getUnicomPage,query).then(res=>{
                if(res.status==200){
                    this.tableLoading = false;
                    this.total = res.content.total;
                    this.tableData = res.content.list;
                    this.tableData.forEach((item,index)=>{
                        item.sortId = (this.tablePageNo-1)*this.tablePageSize+index+1;
                        item.courseNames = item.titleList.length>0?item.titleList.map(item=>item.title).join('、'):''
                    })
                }
            }).catch(()=>{
                this.tableLoading = false;
            })
        },
        switchDilg(){
            this.switchGetInfo();
            this.dialogVisible = true;
        },
        switchGetInfo(){
            this.$http.get(this.$server.getEntranceInfoUnicom).then(res=>{
                if(res.status==200){
                   this.switchValue = res.content.opt==1?false:true;
                }
            });            
        },
        //开关
        changeinformAtion(val){
            var self = this;
            var params = {
                type:5,
                isEnable:self.switchValue?0:1
            };
            self.$http.post(self.$server.saveEntranceInfoUnicom,params).then(res=>{
                if(res.status==200){
                    self.$message.success({ message: "设置成功" });
                }
            });
        },        
        /**
         * 课程弹窗查询
         */
        select(){
            this.tablePageNo = 0;
            this.$nextTick(()=>{
                this.tablePageNo = 1;
            })
        },
        selectDialogList(){
            this.childrenListData(1);
        },
        //查看列表信息
        childrenListData(num){
            var self = this;
            self.loadingNext = true;
            if(num){
                self.pageNoNext = num;
            }            
            let params = {
                pageNo:this.pageNoNext,
                pageSize:this.pageSizeNext,
                cellphone:self.inputInfo
            }
            this.$http.get(this.$server.getUnicomUserPageUnicom(params)).then(res=>{
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
                    self.tableDataNext = listIds;
                    self.pageAtionNext.pageTotal = contentdate.total;
                    self.pageAtionNext.paginationPage = self.pageNoNext;
                    self.$nextTick(function(){
                        self.loadingNext = false; 
                    }) 
                }
            })             
        },                 
        update(){
            if(this.flag=='edit'){
                this.editUnicomBag()
            }else{
                this.addUnicomBag()
            }
        },             
        /**
         * 添加
         */
        addUnicomBag(){
            var self = this;
            if(this.bagName.length==0){
                this.$message.error('请输入流量包名称');
                return;
            }
            if(this.validityTime.length==0){
                this.$message.error('请选择月份');
                return;
            }
            if(this.courseIds.length==0){
                this.$message.error('请选择课程');
                return;
            }
            let loadingInstance = this.$loading({
                target:document.querySelector('.edit-dialog')
            });
            let query = {
                bagName:this.bagName,
                validityTime:this.validityTime,
                courseIds:'['+this.courseIds.join(',')+']'
            }
            if(!self.disabledState){
                self.disabledState = !self.disabledState;
                this.$http.post(this.$server.addUnicomBag,query).then(res=>{
                    if(res.status==200){
                        self.disabledState = !self.disabledState;
                        loadingInstance.close();
                        this.$message.success('设置成功');
                        this.tablePageNo = 0;
                        this.$nextTick(()=>{
                            this.tablePageNo = 1;
                        })
                        this.editDialogVisible = false;
                    }
                }).catch(()=>{
                    self.disabledState = !self.disabledState;
                    loadingInstance.close();
                })
            }
        },
        addShow(){
            this.flag = 'add';
            this.editDialogVisible=true
        },
        listInfoShow(){
            this.listDialogVisible = true;
            this.childrenListData(1);
        },
        editShow(obj){
            this.flag = 'edit';
            this.id = obj.id;
            this.bagName = obj.bagName;
            this.validityTime = obj.validityTime;
            this.courseIds = obj.titleList.map(item=>item.id)
            this.editDialogVisible = true;
            this.courseCheckList = [...obj.titleList]
        },
        /**
         * 编辑视频
         */
        editUnicomBag(){
            var self = this;
            if(this.bagName.length==0){
                this.$message.error('请输入流量包名称');
                return;
            }
            if(this.validityTime.length==0){
                this.$message.error('请选择月份');
                return;
            }
            if(this.courseIds.length==0){
                this.$message.error('请选择课程');
                return;
            }
            let loadingInstance = this.$loading({
                target:document.querySelector('.edit-dialog')
            });
            let query = {
                id:this.id,
                bagName:this.bagName,
                courseIds:'['+this.courseIds.join(',')+']'
            }
             if(!self.disabledState){
                self.disabledState = !self.disabledState;
                this.$http.post(self.$server.editUnicomBag,query).then(res=>{
                    if(res.status==200){
                        self.disabledState = !self.disabledState;
                        this.$message.success('更新成功');
                        loadingInstance.close()
                        this.editDialogVisible = false;
                        this.getList()
                    }
                }).catch(()=>{
                    self.disabledState = !self.disabledState;
                    loadingInstance.close()
                })
             }
        },
        /**
         * 查询
         */
        search(){
            this.searchKey = this.searchKey.replace(regExp.specialChar,'');
            this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent);
            this.searchFlag = true;
            this.$nextTick(()=>{
                this.pageNo = 1;
                this.editDialogList = []
                this.$nextTick(()=>{
                    this.getOurCoursesUse()
                })
            })
        },
        /**
         * 回车键
         */
        pressEvent(e){
            if(e.keyCode==13){
                this.search()
            }
        },
        /**
         * 课程弹框确定
         */
        dialogSure(){
            this.courseIds.splice(0, this.courseIds.length);
            this.courseCheckList.forEach(item=>{
                let obj = this.dialogArr.find(id=>id==item.id);
                if(obj){
                    this.courseIds.push(obj)
                }
            })
            this.courseDialogVisible = false;
        },
        /**
         * 点击选中课程按钮
         */
        showDialog(){
            this.courseDialogVisible = true;
            this.dialogArr.splice(0,this.dialogArr.length)
            this.courseIds.forEach(item=>{
                this.dialogArr.push(item)
            })
            this.getOurCoursesUse();   
        },
        /**
         * 获取自有上架的课程
         */
        getOurCoursesUse(){
            this.loading = true;
            this.isLastPage = false;
            let params = {
                title:this.oldSearchKey,
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                courseSource:this.checkedCities
            }
            if(this.searchFlag){
                params.title = this.searchKey
                this.oldSearchKey = this.searchKey
            }
            this.$http.get(this.$server.getOurCoursesUse,{params}).then(res=>{
                if(res.status==200){
                    let arr = res.content.list;
                    this.editDialogList = [...this.editDialogList,...arr]
                    this.loading = false;
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
                this.pageNo++;
                this.getOurCoursesUse();
            }
        },
        toData(obj){
            this.$router.push(`/liantongManage/data/${obj.id}`)
        },
        toOrder(obj){
            this.$router.push(`/liantongManage/order/${obj.id}`)
        },          
        //导出
        headExport(){
                var self = this;
                var parems = {
                    token:getToken(),
                    id:self.selectTable.id,
                    cellphone:self.flowTelphone||'',
                    type:this.type
                };
                self.download2(self.$server.flowOrderListExport(parems)); 
        },        
        //导出
        download2(url) {
            try{ 
                    var elemIF = document.createElement("iframe");   
                    elemIF.src = url;   
                    elemIF.style.display = "none";   
                    document.body.appendChild(elemIF);   
                }catch(e){ 
                    zzrw.alert("下载异常！");
                }
        },        
        //流量订单查询
        selectflowEven(){
            this.getFlowList(1);
        },
        getFlowList(num){
            var self = this;
            if(num){
                self.pageNoDilg = num;
            }
            self.loading = true; 
            var params = {
                id:self.selectTable.id,
                cellphone:self.flowTelphone||'',
                pageSize:10,
                pageNo:self.pageNoDilg,
                type:this.type
            };            
            self.$http.get(self.$server.getflowOrderListUnicom(params)).then(res=>{
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
                   self.tableFlowData = listIds;
                   self.pageAtion.pageTotal = contentdate.total;
                   self.pageAtion.paginationPage = num;
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
               }
            })   
              }, 
        toFlowOrder(obj){
            this.selectTable = obj;
            this.getFlowList();
            this.flowDialogState=true;
        },
        closeEven(){
            this.flowTelphone='';
            this.pageNoDilg=1;            
        },

        
        childPageValue(num){
            if(Number(num)>0){
                this.getFlowList(Number(num))
            }
        },
        childPageValueNext(num){
            if(Number(num)>0){
                this.childrenListData(Number(num))
            }
        }        
    }
};
</script>

<style scoped lang="scss">
.flexBoxCss{
    display: flex;
    flex-direction: row;
    justify-content: center;
}
    .page-header {
        background: #fff;
        padding: 20px;
        margin-bottom: 20px;
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

    .count{
        background: #FFC0C3;
        border-radius: 5px;
        padding:20px;
        margin-bottom:20px;
        div{
            color:#B4272D;
            font-size: 24px;
            line-height: 40px;
        }
    }
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }     
</style>
<style lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
    .liantong-wrap{
        .edit-dialog{
            width: 450px;
            .box-item{
                margin:20px 0;
                &.name{
                    label,.el-input,.num{
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .el-input{
                        width: 220px;
                    }
                }
                &.date{
                    label,.el-input{
                        display: inline-block;
                        vertical-align: middle;
                    }
                }
                &.course{
                    label,.el-button,.num{
                        display: inline-block;
                        vertical-align: middle;
                    }
                }
                label{
                    width: 80px;
                    text-align: right;
                    margin-right: 10px;
                }
                .num{
                    margin-left: 10px;
                }
            }
        }
    }
</style>
<style>
.nameTextEllipsis{
    display: flex;
    flex-direction: row;
    justify-content: space-between;    
}
</style>
