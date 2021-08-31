<template>
    <div class="short-update-wrap">
        <div class="page-header">
            <el-row>
                <el-col :span="4">
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
        </div>
        <div class="page-content">
            <div class="item name clearfix">
                <label>短视频名称</label>
                <div class="data">
                    <el-input maxlength="20" v-model="name" placeholder="请输入短视频名称"></el-input>
                </div>
                <p class="words">{{name.length}}/20</p>
            </div>
            <div class="item type clearfix">
                <label>类型</label>
                <div class="data">
                    <el-select v-model="type"
                        clearable
                        placeholder="类型"
                        :disabled="flag=='edit'?true:false"
                        >
                        <el-option v-for="(item,i) in typeArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>                  
                </div>
            </div>
            <div class="item video clearfix">
                <label>视频</label>
                <div class="data">
                    <p>{{video.title}}</p>
                    <el-button type="text" @click="dialogShow('video')">{{video.id?'修改':'选择'}}</el-button>
                </div>
            </div>
            <div class="item course clearfix">
                <label>关联课程</label>
                <div class="data">
                    <p>{{course.title}}</p>
                    <el-button type="text" :disabled="type==''?true:false" @click="dialogShow('course')">{{course.id?'修改':'选择'}}</el-button>
                </div>
            </div>
           <div class="item avatar clearfix">
               <label>封面图</label>
               <div class="data">
                   <div class="img-box" @click="chooseFile" v-loading="imgLoading">
                       <img :src="backgroundUrl" v-if="backgroundUrl.length>0"/>
                       <i class="el-icon-plus" v-else></i>
                   </div>
                   <p class="tips">请上传690*388的图片</p>
                   <div class="screenshot" v-if="screenshot.length>0">
                        <p>视频截图</p>
                        <div class="content">
                            <div class="box-item" v-for="(item,index) in screenshot" :key="index" @click="chooseVideoImg(item)">
                                <div class="check-box" v-show="item.checked">
                                    <i class="el-icon-check"></i>
                                </div>
                                <img class="real" :src="item.link"/>
                            </div>
                        </div>
                   </div>
                </div>
                <input type="file" name="file" class="file-upload" ref="bgd" @change="getFile($event)" @click="emptyFile($event)"/>
           </div>
           <div class="tem btns clearfix">
               <el-button type="primary" class="save-btn" @click="save">保存</el-button>
               <el-button class="cancel-btn" @click="$router.go(-1)">取消</el-button>
           </div>
        </div>
        <el-dialog :visible.sync="videoData.dialogVisible"
            custom-class="short-video video-dialog"
            :width="'690px'"
            :show-close="false"
            :title="'视频库'">
            <div class="search-wrap clearfix">
                <div class="input-wrap fl">
                    <el-input v-model="videoData.title" clearable @keypress.native="pressEvent($event,'video')"></el-input>
                </div>
                <el-button class="fl" type="primary" @click="search('video')">搜索</el-button>
            </div>
            <ul class="video-list clearfix">
                <li class="video-item fl"
                    v-for="(item,i) in videoData.list"
                    :key="i"
                    :class="item.active?'active':''"
                    @click="checkItem(item,i)"
                    >
                    <div class="video-img fl">
                        <img :src="item.videoImage || '/static/images/music.png'"
                            alt=""
                            class="img100">
                    </div>
                    <div class="video-info fl">
                        <h4 class="video-title text-ellipsis" :title="item.title">
                            {{item.title}}
                        </h4>
                        <div class="video-data clearfix">
                            <span class="fl">{{item.fileSize}}</span>
                            <span class="fr">{{item.duration | millisecondToDate}}</span>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="loading" v-show="videoData.loading"><div class="loading-icon" v-loading="true"></div></div>
            <p class="empty-tip" v-if="videoData.list.length==0">没有搜索到您想要的内容</p>
            <div class="paging-inner tc">
                <el-pagination background
                    layout="prev, pager, next"
                    :total="videoData.total"
                    :current-page.sync="videoData.pageNo"
                    :page-size="videoData.pageSize"
                >
                </el-pagination>
            </div>
            <div slot="footer" class="btns">
                <el-button size="medium" @click="videoData.dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="dialogSure('video')" size="medium">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog :custom-class="'short-video course-dialog'" :visible.sync="courseData.dialogVisible" :width="'500px'" :show-close="false">
            <div style="margin-bottom:20px;">
                <el-radio-group 
                    v-model="checkedCities" @change="changePlugin">
                    <el-radio v-for="(city,index) in cities" :label="city.value" :key="index">{{city.name}}</el-radio>
                </el-radio-group>                  
            </div>               
            <div class="search-box">
                <el-input placeholder="输入课程名称查询" size="medium" clearable prefix-icon="el-icon-search" v-model="courseData.searchKey" maxlength="20" @keypress.native="pressEvent($event,'course')"></el-input>
                <el-button type="primary" size="medium" @click="search('course')">搜索</el-button>
            </div>
            <div class="list" ref="scrollBox">
                <el-radio-group v-model="courseData.dialogVal">
                    <div class="item nameTextEllipsis" v-for="(item,index) in courseData.list" :key="index">
                        <el-radio :label="item.id" class="list-item-radio">
                            <span class="name textEllipsis">{{item.title}}</span>
                        </el-radio>
                        <div style='font-size:14px;'>{{item.sellingPrice||0}}币</div>
                    </div>
                </el-radio-group>
                <div class="loading" v-show="courseData.loading"><div class="loading-icon" v-loading="true"></div></div>
                <p class="empty-tip" v-if="courseData.isLastPage&&courseData.list.length==0">没有搜索到您想要的内容</p>
            </div>
            <div slot="footer" class="btns">
                <el-button size="medium" @click="courseData.dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="dialogSure('course')" size="medium">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="leaveDialogVisible"
            width="30%"
            >
            <span>您有未保存的信息，离开后会丢失，确认要离开吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="leaveDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="leavePage">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import pagination from "@/components/pagination";
    import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
    const regExp = {
        'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
        'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
        'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g, //特殊字符(除了数字、字母、汉字) 
        'onlyNumber':/^\d+$/
    }
    export default {
        data() {
            return {
                flag:'add',
                id:'',
                titleList:[
                    {
                        name:'短视频系统',
                        pathInfo:'/shortVideo/list'
                    },
                    {
                        name:'添加',
                        pathInfo:''
                    }               
                ],
                name:'',
                type:'',
                typeArr:[{label:'成人',value:1},{label:'少儿',value:2}],
                video:{},
                course:{},
                backgroundUrl:'',
                imgLoading:false,
                screenshot:[
                    // {checked:false,link:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/38f3745b-a78f-4b82-9fe5-6c91ae21bc01.jpg'},
                    // {checked:false,link:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/9e50744e-1da6-4aef-a4f6-65d774f82577.jpg'},
                ],
                videoData:{
                    dialogVisible:false,
                    title:'',
                    loading:false,
                    list:[],
                    pageNo:1,
                    pageSize:8,
                    total:8,
                },
                disabledState:false,
                courseData:{
                    dialogVisible:false,
                    searchKey:'',
                    dialogVal:'',
                    list:[],
                    isLastPage:false,
                    loading:false,
                    pageNo:1,
                    pageSize:20,
                    total:20,
                    oldSearchKey:'',
                    searchFlag:false,
                },
                handle:false,
                leaveDialogVisible:false,
                leaveFlag:false,
                leavePath:'',
                checkedCities:1, 
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
            };
        },
        metaInfo: {
            title: "短视频"
        },
        components: {
            pagination,breadcrumb
        },
        computed:{
            videoPageNo(){
                return this.videoData.pageNo;
            },
            courseSearchKey(){
                return this.courseData.searchKey;
            },
            videoDialogVisible(){
                return this.videoData.dialogVisible;
            },
            videoId(){
                return this.video.id
            },
            relationCourseId(){
                return this.course.id;
            }
        },
        watch: {
            videoPageNo(cur,old){
                if(cur>0){
                    this.getVideoList();
                }
            },
            courseSearchKey(cur,old){
                this.courseData.searchFlag = false;
            },
            type(cur,old){
                this.handle = true;
                if(this.flag=='add'){
                    this.courseData.dialogVal = '';
                    this.course = {}
                }
            },
            videoDialogVisible(cur,old){
                if(!cur){
                    this.videoData.title = ''
                }
            },
            name(cur,old){
                this.handle = true;
            },
            videoId(cur,old){
                this.handle = true;
            },
            relationCourseId(cur,old){
                this.handle = true;
            },
            backgroundUrl(cur,old){
                this.handle = true;
            },
        },
        beforeRouteLeave(to, from, next){
            this.leavePath = to.fullPath;
            if(this.leaveFlag){
                next();
                return;
            }
            if(this.handle){
                this.leaveDialogVisible = true;
                next(false);
                return;
            }
            next()
        },
        created() {
            if(this.$route.query&&this.$route.query.data){
                let data = JSON.parse(this.$route.query.data);
                this.flag = 'edit';
                this.id = data.id;
                this.name = data.name;
                this.type = data.type;
                this.video = data.video;
                this.course = data.course;
                this.backgroundUrl = data.backgroundUrl;
                this.courseData.dialogVal = data.course.id;
                this.snapshotList(data.video.id)
                this.titleList[1].name='修改'
            }
        },
        methods: {
            changePlugin(){
                this.courseData.list = []     
                this.pageNo=1;        
                // this.checkedCitiesVal = this.checkedCities.toString();
                this.getCourseList()          
            },
            /**
             * 打开弹出框
             */
            dialogShow(flag){
                if(flag=='video'){
                    this.videoData.pageNo = 1;
                    this.videoData.name = '';
                    this.videoData.dialogVisible = true;
                    this.videoData.list.splice(0,this.videoData.list.length);
                    this.$nextTick(()=>{
                        this.getVideoList()
                    })
                }else if(flag=='course'){
                    this.courseData.pageNo = 1;
                    this.courseData.searchKey = '';
                    this.courseData.oldSearchKey = '';
                    this.courseData.dialogVisible = true;
                    this.courseData.list.splice(0,this.courseData.list.length);
                    this.$nextTick(()=>{
                        this.getCourseList()
                    })
                }
            },
            /**
             * 获取视频列表
             */
            getVideoList(){
                this.videoData.loading = true;
                let query = {
                    params: {
                        title:this.videoData.title,
                        page:this.videoData.pageNo,
                        pageSize:this.videoData.pageSize,
                        videoType:2
                    }
                }
                this.$http.get(this.$server.videoIndex,query).then(res => {
                    this.videoData.loading = false;
                    if(res.status==200){
                        this.videoData.list = res.content.items;
                        this.videoData.total = res.content.totalNum;
                        this.videoData.list.forEach(item=>{
                            item.active = item.id == this.video.id ? true : false;
                        })
                    }
                })
                .catch(err => {
                    this.videoData.loading = false;
                });
            },
            /**
             * 选择短视频
             */
            checkItem(obj,index){
                this.videoData.list.forEach(item=>{
                    item.active = false
                });
                obj.active = true;
                this.$set(this.videoData.list,index,obj)
            },
            /**
             * 获取课程列表
             */
            getCourseList(){
                this.courseData.loading = true;
                this.courseData.isLastPage = false;
                let params = {
                    name:this.courseData.oldSearchKey,
                    pageNo:this.courseData.pageNo,
                    pageSize:this.courseData.pageSize,
                    type:this.type,
                    courseSource:this.checkedCities
                }
                if(this.courseData.searchFlag){
                    params.name = this.courseData.searchKey
                    this.courseData.oldSearchKey = this.courseData.searchKey
                }
                this.$http.get(this.$server.getCourseList,{params}).then(res=>{
                    this.courseData.loading = false;
                    if(res.status==200){
                        this.courseData.list = [...this.courseData.list,...res.content.list]
                        this.courseData.isLastPage = res.content.isLastPage;
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
                    this.courseData.pageNo++;
                    this.getCourseList();
                }
            },
            /**
             * 回车搜索
             */
            pressEvent(e,flag){
                if(e.keyCode==13){
                    this.search(flag)
                }
            },
            /**
             * 弹框搜索
             */
            search(flag){
                if(flag=='video'){
                    this.videoData.pageNo = 0;
                    this.$nextTick(()=>{
                        this.videoData.pageNo = 1;
                    })
                }else if(flag=='course'){
                    this.courseData.searchKey = this.courseData.searchKey.replace(regExp.specialChar,'');
                    this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent);
                    this.courseData.searchFlag = true;
                    this.courseData.pageNo = 1;
                    this.courseData.list = []
                    this.$nextTick(()=>{
                        this.getCourseList()
                    })
                }
            },
            /**
             * 弹框确定
             */
            dialogSure(flag){
                if(flag=='video'){
                    let obj = this.videoData.list.find(item=>item.active==true);
                    this.video = {
                        title:obj.title,
                        id:obj.id
                    }
                    this.videoData.dialogVisible = false;
                    this.snapshotList(obj.id)
                }else if(flag=='course'){
                    if(this.courseData.dialogVal==''){
                        this.courseData.dialogVisible = false;
                    }else{
                        let obj = this.courseData.list.find(item=>item.id==this.courseData.dialogVal);
                        this.course = {
                            title:obj.title,
                            id:obj.id
                        }
                        this.courseData.dialogVisible = false;
                    }
                    
                }
            },
            /**
             * 根据视频获取视频截图
             */
            snapshotList(id){
                let query = {
                    params:{

                    }
                }
                this.$http.get(`${this.$server.snapshotList}/${id}`,query).then(res=>{
                    if(res.status==200){
                        this.screenshot = res.content.map((item,index)=>{
                            return {
                                checked:this.backgroundUrl==item.picUrl?true:false,
                                link:item.picUrl
                            }
                        })
                    }
                })
            },
            /**
             * 选择文件
             */
            chooseFile(){
                this.$refs.bgd.click()
            },
            /**
             * 获取文件
             */
            getFile(e){
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
                        if(width!=690||height!=388){
                            this.$message.error('请上传690*388的图片');
                            return;
                        }
                        this.imgLoading = true;
                        let params = new FormData();
                        params.append('file',fileData)
                        let config = {
                            headers: {'Content-Type': 'multipart/form-data'}
                        }
                        this.$http.post(this.$server.actionImgOrvideo,params,config).then(res=>{
                            this.imgLoading = false;
                            if(res.status==200){
                                this.backgroundUrl = res.content.resourceUrl
                            }
                        }).catch(()=>{
                            this.imgLoading = false;
                        })
                    }
                    image.src= data;
                };
                reader.readAsDataURL(fileData);
            },
            /**
             * 清空文件value
             */
            emptyFile(e){
                e.target.value = ''
            },
            /**
             * 保存
             */
            save(){
                if(this.name==''){
                    this.$message.error('名称不能为空');
                    return false;
                }
                // if(!regExp.exceptSpecialChar.test(this.name)){
                //     this.$message.error('只能输入字母、字母、汉字及其组合');
                //     return false;
                // }
                if(this.type==''){
                    this.$message.error('请选择类型');
                    return false;
                }
                if(!this.video.id||this.video.id==''){
                    this.$message.error('请选择短视频');
                    return false;
                }
                // if(!this.course.id||this.course.id==''){
                //     this.$message.error('请选择关联课程');
                //     return false;
                // }
                if(this.backgroundUrl == ''){
                    this.$message.error('请上传封面图');
                    return false;
                }
                let query = {
                    name:this.name,
                    type:this.type,
                    videoId:this.video.id,
                    relationCourseId:this.course.id?this.course.id:'',
                    backgroundUrl:this.backgroundUrl
                }
                let loadingInstance = this.$loading({
                    target:document.querySelector('.short-update-wrap')
                });
                if(!this.disabledState){
                    this.disabledState = !this.disabledState;
                    if(this.flag=='add'){
                        this.$http.post(this.$server.addShortVideo,query).then(res=>{
                            loadingInstance.close();
                            this.disabledState = !this.disabledState;
                            if(res.status==200){
                                this.$message.success('添加成功');
                                this.handle = false;
                                this.$router.push('/shortVideo/list')
                            }
                        }).catch(()=>{
                            this.disabledState = !this.disabledState;
                            loadingInstance.close()
                        })
                    }else if(this.flag=='edit'){
                        this.$http.post(`${this.$server.updateShortVideo}/${this.id}`,query).then(res=>{
                            loadingInstance.close()
                            this.disabledState = !this.disabledState;
                            if(res.status==200){
                                this.$message.success('修改成功');
                                this.handle = false;
                                this.$router.push('/shortVideo/list')
                            }
                        }).catch(()=>{
                            this.disabledState = !this.disabledState;
                            loadingInstance.close()
                        })
                    }
                }
            },
            /**
             * 选择视频截图
             */
            chooseVideoImg(obj){
                this.screenshot.forEach(item=>{
                    item.checked = false;
                })
                obj.checked = true;
                this.backgroundUrl = obj.link;
            },
            leavePage(){
                this.leaveFlag = true;
                this.leaveDialogVisible = false;
                setTimeout(()=>{
                    this.$router.push(this.leavePath)
                },300)
            }
        }
    };
</script>

<style scoped lang="scss">
    .short-update-wrap{
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            padding: 20px;
            font-size: 16px;
            margin-top:20px;
            .item{
                margin:20px 0;
                label{
                    float: left;
                    width: 120px;
                    line-height: 40px;
                }
                .data{
                    float: left;
                    button,p{
                        font-size: 14px;
                        display: inline-block;
                        vertical-align: middle;
                    }
                   
                }
                &.name{
                    .words{
                        color:#aaa;
                        line-height: 40px;
                        margin-left: 10px;
                        display: inline-block;
                    }
                }
                &.name,&.type{
                    .data{
                        width: 305px;
                        .el-select{
                            width: 100%;
                        }
                    }
                }
                &.avatar{
                    .data{
                        margin-top:12px;
                        position: relative;
                        .tips{
                            position: absolute;
                            left: 0px;
                            top:120px;
                            color:#aaa;
                            width: 200px;;
                        }
                    }
                    .img-box{
                        width: 120px;
                        height: 120px;
                        position: relative;
                        border:1px dashed #d3d0d0;
                        cursor: pointer;
                        overflow: hidden;
                        border-radius: 3px;
                        &:hover{
                            border-color:#b13e33;
                        }
                        img{
                            position: absolute;
                            top:50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                        }
                        i{
                            position: absolute;
                            font-size: 32px;
                            top:50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                        }
                    }
                    .screenshot{
                        p{
                            margin:20px 0;
                        }
                        .content{
                            width: 650px;
                        }
                        .box-item{
                            display: inline-block;
                            vertical-align: middle;
                            margin-right: 10px;
                            width: 120px;
                            height: 120px;
                            position: relative;
                            border:1px solid #dfdfdf;
                            border-radius: 5px;
                            cursor: pointer;
                            overflow: hidden;
                            img{
                                position: absolute;
                                top:50%;
                                left: 50%;
                                transform: translate(-50%,-50%);
                                z-index: 1;
                            }
                            .check-box{
                                position: absolute;
                                right: 0;
                                top: 0;
                                width: 0;
                                height: 0;
                                z-index: 2;
                                border-top: 30px solid #b4272d;
                                border-left: 30px solid transparent;
                                i{
                                    color:#fff;
                                    position: absolute;
                                    top:-30px;
                                    left: -17px;
                                }
                            }
                        }
                    }
                    .file-upload{
                        position: absolute;
                        width: 1px;
                        height: 1px;
                        opacity: 0;
                        z-index: 1;
                    }
                }
            }
           
        }
        .video-dialog{
            .search-wrap {
                margin: 17px 0 37px;
                .input-wrap {
                    width: 526px;
                    margin: 0 10px 0 18px;
                    position: relative;
                    .search-btn {
                        position: absolute;
                        font-size: 20px;
                        top: 12px;
                        right: 10px;
                        cursor: pointer;
                        background: #fff;
                    }
                }
            }
            .video-list {
                padding: 0 20px;
            }
            .video-item {
                width: 299px;
                height: 79px;
                background: rgba(245, 245, 245, 1);
                border: 1px solid rgba(237, 241, 247, 1);
                border-radius: 2px;
                margin: 0 10px 10px 0;
                &:nth-of-type(2n) {
                    margin-right: 0;
                }
                &.active {
                    outline: 1px solid #b4272d;
                    position: relative;
                    &:before {
                        content: "";
                        position: absolute;
                        width: 8px;
                        height: 12px;
                        border-bottom: 1px solid #fff;
                        border-right: 1px solid #fff;
                        top: 1px;
                        right: 5px;
                        z-index: 101;
                        transform: rotateZ(45deg);
                    }
                    &:after {
                        content: "";
                        border-right: 16px solid #b4272d;
                        border-left: 16px solid #fff;
                        border-top: 16px solid #b4272d;
                        border-bottom: 16px solid #fff;
                        position: absolute;
                        top: -1px;
                        right: -1px;
                        z-index: 100;
                    }
                }
                .video-img {
                    width: 95px;
                    height: 59px;
                    border-radius: 5px;
                    margin: 10px;
                }
                .video-info {
                    font-size: 14px;
                    width: 182px;
                    color: rgba(56, 65, 86, 1);
                }
                .video-title {
                    margin: 21px 0 18px;
                }
                .video-data {
                    padding-right: 25px;

                    color: #b4272d;
                }
            }
            .paging-inner {
                margin: 42px 0 32px;
            }
        }
        .course-dialog{
            left: 5%;
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
        }
        .empty-tip{
            text-align: center;
            color:#aaa;
        }
        .block{
            text-align: center;
            padding: 40px 0 40px 0;
            background: #fff;
        }
        .btns{
            text-align: center;
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

