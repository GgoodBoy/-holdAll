<template>
    <div class="cooperative-add">
        <div class="page-header">
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>
        <div class="page-main">
            <div class="clearfix name-box">
                <div class="left">
                    <p class="label">合作平台名称</p>
                </div>
                <div class="right">
                    <el-input v-model="name" :disabled="flag=='edit'?true:null" maxlength="16" placeholder="最多输入16个字符"></el-input>
                </div>
            </div>
            <div class="clearfix">
                <div class="left">
                    <p class="label">H5顶部背景图</p>
                </div>
                <div class="right">
                    <p class="tips">375*263支持PNG、JPG格式，小于200k</p>
                    <div>
                        <input type="file" name="file" class="file-upload" ref="bgdInput" @change="getFile($event,1)" @click="emptyFile($event)"/>
                        <div class="img-file" @click="uploadFile(1)" v-loading="headUrlLoading">
                            <p v-if="headUrl.length==0"><i class="el-icon-plus"></i>上传图片</p>
                            <img v-else :src="headUrl"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item" v-for="(item,index) in courseList" :key="index">
                <i class="el-icon-circle-close close" @click="del(index)" v-if="courseList.length>1"></i>
                <div class="bgd clearfix">
                    <div class="left">
                        <p class="label">课程背景图</p>
                    </div>
                    <div class="right">
                        <p class="tips">375*165支持PNG、JPG格式，小于200k</p>
                        <div>
                            <input type="file" name="file" class="file-upload" ref="surface" @change="getFile($event,2,index)" @click="emptyFile($event)"/>
                            <div class="img-file" @click="uploadFile(2,index)" v-loading="item.loading">
                                <p v-if="item.url.length==0"><i class="el-icon-plus"></i>上传图片</p>
                                <img v-else :src="item.url"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="course clearfix">
                    <div class="left">
                        <p class="label">关联课程</p>
                    </div>
                    <div class="right">
                        <el-button type="primary" size="medium" class="course-btn" @click="DialogShow(item)">选择课程</el-button>
                        <el-tooltip effect="dark" :content="item.name" placement="top">
                            <p class="textEllipsis course-name">{{item.name}}</p>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <div class="block">
                <el-button class="add-btn" @click="addItem">添加课程</el-button>
            </div>
            <div class="block">
                <el-button type="primary" @click="save">确定</el-button>
                <!-- <el-button>预览</el-button> -->
            </div>
        </div>
        <el-dialog :custom-class="'course-select-dialog'" :width="'500px'" :visible.sync="courseDialog" :show-close="false">
            <div style="margin-bottom:20px;">
                <el-radio-group  
                    v-model="checkedCities" @change="changePlugin">
                    <el-radio v-for="(city,index) in cities" :label="city.value" :key="index">{{city.name}}</el-radio>
                </el-radio-group>                  
            </div>
            <div class="search-box">
                <el-input placeholder="输入课程名称查询" size="medium" clearable prefix-icon="el-icon-search" v-model="searchKey" maxlength="20" @keypress.native="pressEvent($event)"></el-input>
                <el-button type="primary" size="medium" @click="search">搜索</el-button>
            </div>
            <div class="list" ref="scrollBox">
                <el-radio-group v-model="dialogVal">
                    <div class="item course-layout" v-for="(item,index) in dialogList" :key="index">
                        <el-radio :label="item.id" class="list-item-radio">
                            <span class="name textEllipsis">{{item.title}}</span>
                        </el-radio>
                        <div class="nameTextEllipsis" style='font-size:14px;'>{{item.sellingPrice||0}}币</div>
                    </div>
                </el-radio-group>
                <div class="loading" v-show="loading"><div class="loading-icon" v-loading="true"></div></div>
                <p class="empty-tip" v-if="isLastPage&&dialogList.length==0">没有搜索到您想要的内容</p>
            </div>
            <div slot="footer" class="btns">
                <el-button @click="courseDialog = false" size="medium">取消</el-button>
                <el-button type="primary" @click="dialogSure" size="medium">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <span>您有未保存的信息，离开后会丢失，确认要离开吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="leavePage">确 定</el-button>
            </span>
        </el-dialog>
    </div>    
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
const regExp = {
    'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
    'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
    'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g //特殊字符(除了数字、字母、汉字) 
}
export default {
    data(){
        return{
            handleFlag:false,
            flag:'add',
            editId:'',
            titleList:[
                {
                    name:'活动',
                    pathInfo:'/activityObj/cooperativeList'
                },
                {
                    name:'合作平台',
                    pathInfo:'/activityObj/cooperativeList'
                },
                {
                    name:'创建H5页面',
                    pathInfo:''
                }                
            ],
            tempObj:'',
            courseList:[
                {
                    url:'',
                    id:'',
                    name:'',
                    loading:false,
                }
            ],
            name:'',
            headUrl:'',
            headUrlLoading:false,
            courseDialog:false,
            loading:false,
            pageNo:1,
            pageSize:20,
            searchKey:'',
            oldSearchKey:'',
            searchFlag:false,
            dialogVal:'',
            dialogList:[],
            isLastPage:false,
            dialogVisible:false,
            leavePath:'',
            leaveFlag:false,
            checkedCities:1, 
            disabledState:false,
            cities: [
                {
                    name:'自营课程',
                    value:1
                },
                {
                    name:'三方课程',
                    value:2
                }
            ]                      
        }
    },
    components: {
        breadcrumb
    },
    beforeRouteLeave (to, from, next){
        this.leavePath = to.fullPath;
        if(this.leaveFlag||(!this.leaveFlag&&!this.handleFlag)){
            next();
            return;
        }
        if(this.handleFlag){
            this.dialogVisible = true;
            next(false);
            return;
        }
    },
    watch:{
        courseDialog(cur,old){
            if(!cur){
                this.searchKey = ''
                this.pageNo = 1;
                this.tempObj = '';
                this.oldSearchKey = ''
            }
        },
        name(cur,old){
            this.handleFlag = true
        },
        headUrl(cur,old){
            this.handleFlag = true;
        },
        courseList:{
            handler(cur,old){
                this.handleFlag = true;
            },
            deep:true
        },
        searchKey(cur,old){
            this.searchFlag = false;
        }
    },
    created(){
        if(this.$route.query&&this.$route.query.data){
            let data = JSON.parse(this.$route.query.data)
            let {id,name,headUrl,courseList} = data;
            this.name = name;
            this.headUrl = headUrl;
            this.courseList = courseList.map(item=>{
                item.loading = false;
                return item;
            })
            this.editId = id;
            this.flag = 'edit';
        }
    },
    methods:{

        //选择类型事件
        changePlugin(data){
            this.pageNo = 1;
            this.dialogList=[];              
            this.getCourseList();
        },        
        /**
         * 点击上传
         */
        uploadFile(type,index){
            if(type==1){
                this.$refs.bgdInput.click();
            }else{
                this.$refs.surface[index].click();
            }
        },
        /**
         * 获取上传文件
         */
        getFile(e,type,index){
            let files = event.target.files || event.dataTransfer.files;
            let fileData = files[0];
            if (!/(\.png|\.jpg|\.jpeg)$/.test(fileData.name.toLowerCase())) {
                this.$message.error("图片格式有误，请上传JPEG或PNG格式");
                return;
            }
            if(fileData.size>200*1024){
                this.$message.error("图片不能大于200KB");
                return;
            }
            let reader = new FileReader();
            reader.onload = e=>{
                let data = e.target.result;
                let image = new Image();
                image.onload = ()=>{
                    let width = image.width;
                    let height = image.height;
                    if(type==1){
                        if(width!=375||height!=263){
                            this.$message.error('请上传375*263的图片');
                            return;
                        }
                        this.headUrlLoading = true;
                    }else if(type==2){
                        if(width!=375||height!=165){
                            this.$message.error('请上传375*165的图片');
                            return;
                        }
                        this.courseList[index].loading = true;
                    }
                    let params = new FormData();
                    params.append('file',fileData)
                    let config = {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                    this.$http.post(this.$server.actionImgOrvideo,params,config).then(res=>{
                        if(res.status==200){
                            if(type==1){
                                this.headUrl = res.content.resourceUrl;
                                this.headUrlLoading = false;
                            }else if(type==2){
                                this.courseList[index].url = res.content.resourceUrl;
                                this.courseList[index].loading = false;
                            }
                        }
                    })
                }
                image.src= data;
            };
            reader.readAsDataURL(fileData);
        },
        /**
         * 清空
         */
        emptyFile(e){
            e.target.value = ''
        },
        /**
         * 添加item
         */
        addItem(){
            this.courseList.push({
                url:'',
                id:'',
                name:'',
                loading:false
            })
        },
        /**
         * 删除item
         */
        del(index){
            this.courseList.splice(index,1);
        },
        /**
         * 课程选择弹窗
         */
        DialogShow(obj){
            this.dialogVal = obj.id;
            this.dialogList.splice(0,this.dialogList.length)
            this.courseDialog = true;
            this.getCourseList();
            this.tempObj = obj;
        },
        /**
         * 获取课程列表
         */
        getCourseList(){
            this.loading = true;
            this.isLastPage = false;
            let params = {
                name:this.oldSearchKey,
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                type:0,
                courseSource:this.checkedCities
            }
            if(this.searchFlag){
                params.name = this.searchKey
                this.oldSearchKey = this.searchKey
            }
            this.$http.get(this.$server.getCourseList,{params}).then(res=>{
                if(res.status==200){
                    // this.dialogVal = this.tempObj.id;
                    this.dialogList = [...this.dialogList,...res.content.list]
                    this.loading = false;
                    this.isLastPage = res.content.isLastPage;
                    if(res.content.isLastPage){
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
         * 滚动事件
         */
        scrollEvent(){
            let scrollDistance = this.$refs.scrollBox.scrollHeight - this.$refs.scrollBox.scrollTop - this.$refs.scrollBox.clientHeight
            let sign = 50;
            if (scrollDistance <= sign) {
                this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent)
                this.pageNo++;
                this.getCourseList();
            }
        },
        /**
         * 回车
         */
        pressEvent(e){
            if(e.keyCode==13){
                this.search()
            }
        },
        /**
         * 搜索
         */
        search(){
            this.searchKey = this.searchKey.replace(regExp.specialChar,'');
            this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent)
            this.$nextTick(()=>{
                this.pageNo = 1;
                this.dialogList.splice(0,this.dialogList.length)
                this.searchFlag = true;
                this.getCourseList()
            })
        },
        dialogSure(){
            this.tempObj.id = this.dialogVal;
            this.tempObj.name = this.dialogList.find(item=>item.id==this.dialogVal).title;
            this.courseDialog = false;
        },
        /**
         * 保存数据
         */
        save(){
            var self = this;
            if(this.name==''){
                this.$message.error('请输入合作平台名称');
                return;
            }
            if(!regExp.exceptSpecialChar.test(this.name)){
                this.$message.error('名称只能输入字母、汉字、数字及其组合');
                return;
            }
            if(this.headUrl.length==0){
                this.$message.error('请上传H5页面的背景图');
                return;
            }
            let flag = this.courseList.some(item=>{
                return item.id==''||item.url==''
            })
            if(flag){
                this.$alert('您还有未添加的数据，不能保存', '提示', {
                    confirmButtonText: '关闭',
                    center:true,
                    callback: action => {}
                });
                return;
            }
            let courseList = this.courseList.map((item,index)=>{
                return {
                    id:item.id,
                    url:item.url,
                    sort:index
                }
            })
            let loadingInstance = this.$loading({
                target:document.querySelector('.page-main')
            });
            let query = {
                name:this.name,
                headUrl:this.headUrl,
                courseList:JSON.stringify(courseList)
            }
            if(this.flag=='add'){
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;                 
                    this.$http.post(this.$server.addCooperationPlatform,query).then(res=>{
                        if(res.status==200){
                            loadingInstance.close()
                            this.handleFlag = false;
                            self.disabledState = !self.disabledState;
                            this.$message({
                                type:'success',
                                message:'添加成功'
                            })
                            this.$router.push('/activityObj/cooperativeList')
                        }
                    }).catch(()=>{
                        self.disabledState = !self.disabledState;
                        loadingInstance.close()
                    })
                }
            }else if(this.flag=='edit'){
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;                  
                    this.$http.post(`${this.$server.editCooperationPlatform}/${this.editId}`,query).then(res=>{
                            if(res.status==200){
                                loadingInstance.close()
                                this.handleFlag = false;
                                self.disabledState = !self.disabledState;
                                this.$message({
                                    type:'success',
                                    message:'修改成功'
                                })
                                this.$router.push('/activityObj/cooperativeList')
                            }
                        }).catch(()=>{
                            self.disabledState = !self.disabledState;
                            loadingInstance.close()
                        })                    
                }                
            }
        },
        /**
         * 离开页面
         */
        leavePage(){
            this.leaveFlag = true;
            this.dialogVisible = false;
            console.log(this.leavePath)
            this.$router.push(this.leavePath)
        }
    }
}
</script>
<style lang="scss" scoped>
    .cooperative-add{
        .page-header{

        }
        .page-main{
            margin: 30px auto;
            padding: 20px;
            max-height: 700px;
            min-height: 400px;
            overflow-y: auto;
            overflow-x: hidden;
            width: 50%;
            min-width: 300px;
            background: #fff;
            font-size: 16px;
            .name-box{
                margin-bottom:20px;
                .label{
                    margin-top:8px;
                }
            }
            .left{
                float: left;
            }
            .right{
                float: right;
                width: calc(100% - 160px);
            }
            .label{
                text-align: right;
                width: 140px;
                margin-right: 10px;
            }
            .tips{
                color:#999;
            }
            .file-upload{
                position: relative;
                z-index: 1;
                opacity: 0;
                width: 1px;
                height: 1px;
            }
            .img-file{
                border-radius: 3px;
                border:1px dashed #d3d0d0;
                height: 100px;
                width: 100px;
                line-height: 100px;
                text-align: center;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                &:hover{
                    border-color:#b13e33;
                }
                p{
                    font-size: 14px;
                    color:#aaa;
                }
                img{
                    position: absolute;
                    top:50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
            }
            .item{
                border:1px solid #dcdcdc;
                border-radius: 3px;
                margin:20px 0;
                padding: 20px 0;
                position: relative;
                .course-name{
                    margin-left: 10px;
                    width: calc(100% - 130px);
                }
                .course-btn,.course-name{
                    display: inline-block;
                    vertical-align: middle;
                }
                .course{
                    margin-top:20px;
                    .label{
                        margin-top:6px;
                    }
                }
                .close{
                    position: absolute;
                    right: -10px;
                    top:-10px;
                    font-size: 20px;
                    color:#bfbfbf;
                }
            }
            .block{
                margin:30px 0;
                padding: 0;
                text-align: center;
            }
        }
        .course-select-dialog{
            left: 15%;
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
                padding: 10px 0;
                min-height: 60px;
                .item{
                    margin:10px 0;
                    // .name{
                    //     width: 310px;
                    // }
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
    }
.course-layout{
    display: flex;
    flex-direction: row;
    justify-content: space-between;      
}
</style>