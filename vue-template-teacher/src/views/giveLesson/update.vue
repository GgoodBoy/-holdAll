<template>
    <div class="give-lesson-update">
        <div class="page-header">
            <el-row>
                <el-col :span="24">
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
        </div>
        <div class="page-content">
            <div class="item name clearfix">
                <label>名称</label>
                <div class="data">
                    <el-input maxlength="10" show-word-limit v-model="name" placeholder="请输入活动名称" ></el-input>
                </div>
            </div>
            <div class="item type clearfix">
                <label>类型</label>
                <div class="data">
                    <el-radio-group v-model="type">
                        <div class="radio-item" v-for="(item,index) in typeArr" :key="index">
                            <el-radio :label="item.value" :disabled="flag=='edit'" class="list-item-radio" @change="radioChange">
                                <span class="name">{{item.label}}</span>
                            </el-radio>
                        </div>
                    </el-radio-group>
                </div>
            </div>
           <div class="item course clearfix">
               <label>课程</label>
               <div class="data">
                   <div class="list">
                        <div class="course-item" v-for="(item,index) in courseList" :key="index">
                           <p>{{item.title}}</p>
                           <i class="el-icon-circle-close" @click="delItem(index)"></i>
                        </div>
                   </div>
                   <el-button type="text" @click="dialogShow">选择</el-button>
               </div>
           </div>
           <div class="item limit-date clearfix">
               <label>赠课有效期</label>
               <div class="data">
                   <el-input maxlength="3" v-model="validity"></el-input>
                </div>
                <span style="display:inline-block;margin:8px">天</span>
           </div>
           <div class="item startTime clearfix">
                <label>开始时间</label>
                <div class="data">
                   <el-date-picker
                    v-model="startTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    clearable
                    :disabled="flag=='edit'?true:false"
                    :default-value="defaultValue"
                    :picker-options="{
                        disabledDate: time => {
                            if(endTime){
                                return time.getTime() > new Date(endTime).getTime()||time.getTime() < Date.now() - 3600 * 1000 * 24
                            }else{
                                return time.getTime() < Date.now() - 3600 * 1000 * 24
                            }

                        },
                        selectableRange:startTimeRange
                    }"

                    placeholder="请选择开始时间">
                    </el-date-picker>
                </div>
           </div>
           <div class="item endTime clearfix">
               <label>结束时间</label>
               <div class="data">
                   <el-date-picker
                    v-model="endTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    clearable
                    @click.native="endTimeClick"
                    :disabled="startTime==''||!startTime"
                    :picker-options="{
                        disabledDate: time => {
                            return time.getTime() < new Date(startTime).getTime()-8.64e7
                        },
                        selectableRange:endTimeRange
                    }"
                    :default-value="defaultValue"
                    placeholder="请选择结束时间">
                    </el-date-picker>
                </div>
           </div>
           <div class="item bgd clearfix">
               <label>背景图</label>
               <div class="data">
                   <div class="img-box" @click="chooseFile" v-loading="imgLoading">
                       <img :src="imgUrl" v-if="imgUrl.length>0"/>
                       <i class="el-icon-plus" v-else></i>
                   </div>
                   <p class="tips">
                       5MB以内的图片，格式支持JPG、PNG，图片宽度限750px
                   </p>
                </div>
                <input type="file" name="file" class="file-upload" ref="bgd" @change="getFile($event)" @click="emptyFile($event)"/>
           </div>
           <div>
               <el-button type="primary" class="save-btn" @click="save">保存</el-button>
           </div>
        </div>
        <el-dialog :custom-class="'edit-dialog'" :visible.sync="editDialogVisible" :width="'500px'" :show-close="false">
            <div style="margin-bottom:20px;">
                <el-radio-group 
                    v-model="checkedCities" @change="changePlugin">
                    <el-radio v-for="(city,index) in cities" :label="city.value" :key="index">{{city.name}}</el-radio>
                </el-radio-group>                  
            </div>             
            <div class="search-box">
                <el-input placeholder="输入课程名称查询" size="medium" clearable prefix-icon="el-icon-search" v-model="searchKey" maxlength="10" @keypress.native="pressEvent($event)"></el-input>
                <el-button type="primary" size="medium" @click="search">搜索</el-button>
            </div>
            <div class="list" ref="scrollBox">
                <el-checkbox-group
                    v-model="dialogArr"
                    :max="EditDialogMaxNum"
                >
                    <div class="item nameTextEllipsis" v-for="(item,index) in editDialogList" :key="index">
                        <el-checkbox :label="item.id" :disabled="item.disabled">{{item.title}}</el-checkbox>
                        <div style='font-size:14px;marginRight:10px'>{{item.sellingPrice||0}}币</div>
                    </div>
                </el-checkbox-group>
                <div class="loading" v-show="editDialogLoading"><div class="loading-icon" v-loading="true"></div></div>
                <p class="empty-tip" v-if="isLastPage&&editDialogList.length==0">没有搜索到您想要的内容</p>
            </div>
            <div slot="footer" class="btns">
                <el-button @click="editDialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="dialogSure" size="medium">保存</el-button>
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
    'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g, //特殊字符(除了数字、字母、汉字)
    'onlyNumber':/^\d+$/
}

const formatDate = (time,flag)=>{
    const y = time.getFullYear();
    let mm = time.getMonth()+1;
    let d = time.getDate();
    mm = mm<10?('0'+mm):mm;
    d = d<10?('0'+d):d;
    let h =time.getHours();
    let m =time.getMinutes();
    let s =time.getSeconds();
    h = h<10?("0"+h):h;
    m = m<10?("0"+m):m;
    s = s<10?("0"+s):s;
    if(flag==1){
        return y+'-'+mm+'-'+d;
    }else if(flag==2){
        return h+":"+m+":"+s;
    }else{
        return y+'-'+mm+'-'+d+' '+h+":"+m+":"+s
    }
}
export default {
    data() {
        return {
            flag:'add',
            id:'',
            titleList:[
                {
                    name:'活动',
                    pathInfo:'/activityObjList'
                },
                {
                    name:'新用户赠课活动',
                    pathInfo:'/activityObj/giveLessonList'
                },
                {
                    name:'添加赠课活动',
                    pathInfo:''
                }
            ],
            name:'',
            type:1,
            typeArr:[
                {label:'成人版',value:1},{label:'少儿版',value:2}
            ],
            courseList:[],
            validity:'',
            startTime:'',
            endTime:'',
            startTimeRange:'',
            endTimeRange:'',
            defaultValue:new Date(),
            imgUrl:'',
            imgLoading:false,
            pageNo:1,
            pageSize:20,
            total:10,
            isLastPage:false,
            editDialogVisible:false,
            disabledState:false,
            searchKey:'',
            oldSearchKey:'',
            searchFlag:false,
            editDialogList:[],//弹窗list
            editDialogLoading:false,
            dialogArr:[],//多选集合
            courseCheckList:[],//多选集合，选择一次push一次，
            EditDialogMaxNum:50,
            width:'',
            height:'',
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
        title: "新用户赠课"
    },
    components: {
        pagination,breadcrumb
    },
    watch: {
        editDialogVisible(cur,old){
            if(!cur){
                this.searchKey = ''
                this.pageNo = 1
                this.editDialogList = []
                this.oldSearchKey = ''
            }
        },
        dialogArr(cur,old){
            if(cur.length>=this.EditDialogMaxNum){
                this.editDialogList.forEach(item=>{
                    let obj = cur.find(id=>id==item.id);
                    if(obj&&!item.oldData){
                        item.disabled = false;
                    }else{
                        item.disabled = true;
                    }
                })
            }else{
                this.editDialogList.forEach(item=>{
                    if(!item.oldData)
                        item.disabled = false;
                })
            }
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
        startTime(cur,old){
            if(cur){
                if(this.endTime){
                    if(cur.split(' ')[0]==formatDate(new Date(this.endTime),1)){//开始时间=结束时间
                        if(cur.split(' ')[0]==formatDate(new Date(),1)){//开始时间=今天=结束时间：同一天
                            if(new Date(cur)>=new Date(this.endTime)){
                                let time = new Date(this.endTime);
                                this.startTime = formatDate(new Date(time.setSeconds(time.getSeconds()-1)),3)
                                this.startTimeRange = formatDate(new Date(time.setSeconds(time.getSeconds())),2)+ ' - ' + formatDate(new Date(this.endTime),2)
                            }else{
                                this.startTimeRange = formatDate(new Date(),2)+ ' - ' + formatDate(new Date(this.endTime),2)
                            }
                        }else{//不同天
                            this.startTimeRange = '00:00:00 - ' + formatDate(new Date(this.endTime),2)
                        }
                    }else{
                        if(cur.split(' ')[0]==formatDate(new Date(),1)){
                            this.startTimeRange = formatDate(new Date(),2)+' - 23:59:59'
                            if(new Date(cur).getTime()<=new Date().getTime()){
                                this.startTime = formatDate(new Date(),3)
                            }
                        }else{
                            this.startTimeRange = '00:00:00 - 23:59:59';
                        }
                    }
                }else{
                    if(cur.split(' ')[0]==formatDate(new Date(),1)){
                        this.startTimeRange = formatDate(new Date(),2)+' - 23:59:59'
                        if(new Date(cur).getTime()<=new Date().getTime()){
                            this.startTime = formatDate(new Date(),3)
                        }
                    }else{
                        this.startTimeRange = '00:00:00 - 23:59:59';
                    }
                }
            }
        },
        endTime(cur,old){
            if(cur){
                if(cur.split(' ')[0]==formatDate(new Date(this.startTime),1)){
                    this.endTimeRange = formatDate(new Date(this.startTime),2)+' - 23:59:59'
                    if(new Date(cur).getTime()<=new Date(this.startTime).getTime()){
                        var time = new Date(this.startTime)
                        this.endTime = formatDate(new Date(time.setSeconds(time.getSeconds()+1)),3)
                    }
                }else{
                    this.endTimeRange = '00:00:00 - 23:59:59';
                }
            }
        }
    },
    created() {
        if(this.$route.query){
            if(this.$route.query.id){
                this.id = this.$route.query.id;
                this.$nextTick(()=>{
                    this.findDetail()
                })
                this.flag = 'edit'
                this.titleList[2].name = '修改赠课活动'
            }
        }
    },
    methods: {
        //选择类型事件
        changePlugin(data){
            this.pageNo=1;
            this.editDialogList = []             
            // this.checkedCitiesVal = this.checkedCities.toString();
            this.getCourseList()
        },          
        radioChange(){
            this.courseList = []
            this.dialogArr = []
            this.courseCheckList = []
        },
        endTimeClick(){
            if(this.startTime==''||!this.startTime){
                this.$message.error('请先选择开始时间');
            }
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
            if(fileData.size>5*1024*1024){
                this.$message.error("图片大小不能大于5MB");
                return;
            }
            let reader = new FileReader();
            reader.onload = e=>{
                let data = e.target.result;
                let image = new Image();
                image.onload = ()=>{
                    if(image.width!=750){
                        this.$message.error("图片宽度应为750px");
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
                            this.imgUrl = res.content.resourceUrl
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
         * 获取详情
         */
        findDetail(){
            let loadingInstance = this.$loading({
                target:document.querySelector('.give-lesson-update')
            });
            let query = {
                params:{}
            }
            this.$http.get(`${this.$server.findDetail}/${this.id}`,query).then(res=>{
                if(res.status==200){
                    this.name = res.content.name;
                    this.type = res.content.type;
                    this.dialogArr = res.content.courseIds;
                    let arr = [];
                    res.content.courseName.split(',').forEach((item,index)=>{
                        arr.push({
                            id:res.content.courseIds[index],
                            title:item
                        })
                    })
                    this.courseList = [...arr]
                    this.courseCheckList = [...arr];
                    this.validity = res.content.validity;
                    this.startTime = res.content.startTime;
                    this.endTime = res.content.endTime;
                    this.imgUrl = res.content.imgUrl;
                }
            }).finally(()=>{
                loadingInstance.close()
            })
        },
        /**
         * 获取课程列表
         */
        getCourseList(){
            this.editDialogLoading = true;
            this.isLastPage = false;
            let params = {
                name:this.oldSearchKey,
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                type:this.type,
                courseSource:this.checkedCities
            }
            if(this.searchFlag){
                params.name = this.searchKey
                this.oldSearchKey = this.searchKey
            }
            this.$http.get(this.$server.getCourseList,{params}).then(res=>{
                if(res.status==200){
                    let arr = res.content.list;
                    if(this.dialogArr.length>=this.EditDialogMaxNum){
                        arr.forEach(item=>{
                            item.disabled = true;
                        })
                    }else{
                        arr.forEach(item=>{
                            let obj = this.dialogArr.find(id=>id==item.id);
                            if(obj){
                                item.disabled = true;
                                item.oldData = true;
                            }else{
                                item.disabled = false;
                            }
                        })
                    }
                    this.editDialogList = [...this.editDialogList,...arr]
                    this.editDialogLoading = false;
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
        scrollEvent(){
            let scrollDistance = this.$refs.scrollBox.scrollHeight - this.$refs.scrollBox.scrollTop - this.$refs.scrollBox.clientHeight
            let sign = 50;
            if (scrollDistance <= sign) {
                this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent)
                this.pageNo++;
                this.getCourseList();
            }
        },
        dialogShow(){
            this.pageNo = 1;
            this.dialogArr = this.courseList.map(item=>item.id);
            this.editDialogList.splice(0,this.editDialogList.length)
            this.editDialogVisible = true;
            this.getCourseList();
        },
         /**
         * 回车搜索
         */
        pressEvent(e){
            if(e.keyCode==13){
                this.search()
            }
        },
        /**
         * 搜索课程
         */
        search(){
            this.searchKey = this.searchKey.replace(regExp.specialChar,'');
            this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent);
            this.searchFlag = true;
            this.$nextTick(()=>{
                this.pageNo = 1;
                this.editDialogList = []
                this.$nextTick(()=>{
                    this.getCourseList()
                })
            })
        },
        /**
         * 确定课程
         */
        dialogSure(){
            this.courseList.splice(0, this.courseList.length);
            this.courseCheckList.forEach(item=>{
                let obj = this.dialogArr.find(id=>id==item.id);
                if(obj){
                    this.courseList.push({
                        id:item.id,
                        title:item.title
                    })
                }
            })
            this.editDialogVisible = false;
        },
        delItem(index){
            this.courseList.splice(index,1);
        },
        save(){
            var self = this;
            if(this.name==''){
                this.$message.error('请输入活动名称');
                return false;
            }
            if(!regExp.exceptSpecialChar.test(this.name)){
                this.$message.error('只能输入字母、数字、汉字及其组合');
                return false;
            }
            if(this.courseList.length==0){
                this.$message.error('请选择课程');
                return false;
            }
            if(this.validity==''){
                this.$message.error('请输入有效期天数');
                return false;
            }
            if(!regExp.onlyNumber.test(this.validity)||(this.validity>1000||this.validity<1)){
                this.$message.error('只能输入1-999的整数');
                return false;
            }
            if(this.imgUrl.length==0){
                this.$message.error('请上传活动背景图');
                return false;
            }
            if(this.startTime==''||!this.startTime){
                this.$message.error('请输入开始时间');
                return false;
            }
            if(this.endTime==''||!this.endTime){
                this.$message.error('请输入结束时间');
                return false;
            }
            if(new Date(this.startTime).getTime()>=new Date(this.endTime).getTime()){
                this.$message.error('结束时间应该大于开始时间');
                return false;
            }
            let query = {
                name:this.name,
                type:this.type,
                startTime:this.startTime,
                endTime:this.endTime,
                validity:Number(this.validity),
                imgUrl:this.imgUrl,
                courseIds:this.courseList.map(item=>item.id).join(',')
            }
            let loadingInstance = this.$loading({
                target:document.querySelector('.give-lesson-update')
            });
            if(this.flag=='add'){
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;             
                    this.$http.post(this.$server.addGiveCourseActivities,query).then(res=>{
                        loadingInstance.close()
                        if(res.status==200){
                            self.disabledState = !self.disabledState;
                            this.$message({
                                type:'success',
                                message:'添加成功'
                            })
                            this.$router.go(-1)
                        }
                    }).catch(()=>{
                        self.disabledState = !self.disabledState;
                        loadingInstance.close()
                    })
                }
            }else{
                query.id = this.id;
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;            
                    this.$http.post(`${this.$server.updateGiveCourseActivities}`,query).then(res=>{
                        loadingInstance.close()
                        if(res.status==200){
                            self.disabledState = !self.disabledState;
                            this.$message({
                                type:'success',
                                message:'修改成功'
                            })
                            this.$router.go(-1)
                        }
                    }).catch(()=>{
                        self.disabledState = !self.disabledState;
                        loadingInstance.close()
                    })
                }
            }
        }
    }
};
</script>

<style scoped lang="scss">
    .give-lesson-update{
        .type-text{
            font-size: 16px;
        }
        .tips{
            color:#aaa;
            font-size: 14px;
            margin-top:10px;
        }
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
    }
    .page-content {
        background: #fff;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        padding: 20px;
        font-size: 16px;
        .item{
            margin:20px 0;
            .radio-item{
                display: inline-block;
            }
            label{
                float: left;
                width: 120px;
                line-height: 40px;
            }
            .data{
                float: left;
                button{
                    font-size: 16px;
                }
            }
            &.name,&.link{
                .data{
                    width: 380px;
                }
            }
            &.course{
                .course-item{
                    margin:0 10px 10px 0;
                    position: relative;
                    padding: 0 10px;
                    border-radius: 3px;
                    border:1px solid #dfdfdf;
                    width: 305px;
                    line-height: 40px;
                    &:first-child{
                        margin:10px 10px 10px 0;
                    }
                    p{
                        font-size: 14px;
                    }
                    i{
                        font-size: 20px;
                        position: absolute;
                        right: -10px;
                        top:-10px;
                        color:#bbb;
                        &:hover{
                            color:#b13e33;
                        }
                    }
                }
                .list{
                    max-height: 300px;
                    overflow-y: auto;
                    overflow-x:hidden;
                }
            }
            &.limit-date{
                .data{
                    width: 60px;
                }
            }
            &.bgd{
                .data{
                    margin-top:12px;
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
                .file-upload{
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    opacity: 0;
                    z-index: 1;
                }
            }
        }
        .save-btn{
            margin:10px 0 10px 120px;
        }
    }
    .edit-dialog{
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
        .btns{
            text-align: center;
        }
        .empty-tip{
            text-align: center;
            color:#aaa;
        }
        .loading{
            padding: 30px 0;
        }
    }
    .block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }
</style>
<style>
.nameTextEllipsis{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>