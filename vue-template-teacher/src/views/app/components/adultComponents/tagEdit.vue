<template>
    <div class="module-edit tag-edit">
        <div class="module-edit-header clearfix">
            <p class="title" ref="title">标签</p>
            <el-button v-if="($authJudge('homeset:appadult:savedata')&&settingType=='1')||$authJudge('homeset:appletadult:savedata')&&settingType=='3'" type="primary" size="small" @click="saveData">保存</el-button>
        </div>
        <div class="module-edit-body">
            <div class="module-name">
                <label>模块名称</label>
                <div class="input-area"><el-input size="medium" v-model="editData.name" maxlength="10"></el-input></div>
                <p>{{editData.name?editData.name.length:0}}/10</p>
            </div>
            <div class="number">
                <p>展示数量</p>
                <p>{{curEditData.length}}</p>
                <el-tooltip class="item" effect="dark" content="最多可以添加3条数据" placement="right">
                    <i class="question el-icon-question"></i>
                </el-tooltip>
            </div>
            <div class="clearfix styles">
                <label>标签设置</label>
                <el-select v-model="targetId" size="small">
                    <el-option
                        v-for="item in classifyOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-tooltip class="item" effect="dark" content="标签设置是针对二级页面的设置(APP首页该模块更多设置)" placement="right">
                    <i class="question el-icon-question"></i>
                </el-tooltip>
            </div>
            <p class="tip">尺寸：432*400<span>支持JPEG、PNG、</span></p>
            <div class="edit-list">
                <div class="edit-item clearfix" v-for="(item,index) in curEditData" :key="index">
                    <div class="img-file-box" @click="uploadFile(index)">
                        <input type="file" name="file" class="file-upload" ref="uploadInput" @change="getFile($event,index)" @click="emptyFile($event)"/>
                        <div class="img-file">
                            <img :src="item.imgUrl" />
                        </div>
                        <p class="des">修改</p>
                    </div>
                    <div class="text-box">
                        <div class="banner-title">
                            <label>标题</label>
                            <el-input clearable size="medium" v-model="item.title" ref="input" maxlength="10"></el-input>
                        </div>
                        <div class="banner-type">
                            <div class="type1">
                                <label>课程</label>
                                <el-button type="primary" size="medium" @click="DialogShow(item)">选择课程</el-button>
                                <el-tooltip :content="item.courseName" placement="top-start">
                                    <p class="textEllipsis more-text">{{item.courseName}}</p>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="btns">
                        <div class="del-btn" @click="delItem(index)">
                            <i class="el-icon-circle-close"></i>
                        </div>
                        <div class="sort-btn">
                            <div @click="sortUp(index)"><i class="el-icon-caret-top" :class="index==0?'not-allowed':''"></i></div>
                            <div @click="sortBottom(index)"><i class="el-icon-caret-bottom" :class="(index==0&&curEditData.length==1)||(index==curEditData.length-1)?'not-allowed':''"></i></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="add-btn"><button class="my-primary-btn" @click="addTag" :class="{'not-allow':curEditData.length>=3}"><i class="el-icon-plus"></i><span>添加课程</span></button></div>
        </div>
        <el-dialog :custom-class="'edit-dialog'" :visible.sync="editDialogVisible" :width="'500px'" :show-close="false">
            <div style="margin-bottom:20px; text-align: left;">
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
                <el-radio-group v-model="editDialogVal">
                    <div class="item nameTextEllipsis" v-for="(item,index) in editDialogList" :key="index">
                        <el-radio :label="item.id" class="list-item-radio">
                            <span class="name textEllipsis">{{item.title}}</span>
                        </el-radio>
                        <div style='font-size:14px;'>{{item.sellingPrice||0}}币</div>
                    </div>
                </el-radio-group>
                <div class="loading" v-show="loading"><div class="loading-icon" v-loading="true"></div></div>
                <p class="empty-tip" v-if="isLastPage&&editDialogList.length==0">没有搜索到您想要的内容</p>
            </div>
            <div slot="footer" class="btns">
                <el-button @click="editDialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="dialogSure" size="medium">确定</el-button>
            </div>
        </el-dialog>
    </div>    
</template>
<script>
import {mapActions} from 'vuex'
const regExp = {
    'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
    'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
    'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g //特殊字符(除了数字、字母、汉字) 
}
export default {
    data(){
        return {
            homeCloumnId:'',
            cloumnTitle:'',
            classifyOption:[],
            targetId:'',
            editDialogVisible:false,
            searchKey:'',
            oldSearchKey:'',
            searchFlag:false,
            pageNo:1,
            pageSize:20,
            isLastPage:false,
            editDialogVal:0,
            editDialogList:[],
            tempObj:'',//当前弹窗选择的对象
            loading:true,//弹窗是否loading
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
        }
    },
    props:['settingType'],
    computed:{
        adultHomeEditData(){
            return this.$store.state.homeConfig.adultHomeEditData.find(item=>item.active==true).data;
        },
        /**
         * 通栏课总数据
         */
        editData(){
            let obj = this.adultHomeEditData.find(item=>item.isFocus==true)
            if(obj){
                let localId = obj.localId;
                return this.$store.state.homeConfig.adultHomeModuleChildData.find(item=>item.localId==localId);
            }else{
                return []
            }
        },
        /**
         * 当前标签数据(具体到样式下)
         */
        curEditData(){
            if(this.editData.data&&this.editData.data.length>0){
                let temp = this.editData.data.find(item=>item.active==true);
                return temp?temp.tagData:[]
            }
            else{
                return [];
            }
        },
        moduleName(){
            return this.editData.name;
        }
    },
    watch:{
        targetId(cur,old){
            let obj = this.editData.data.find(item=>item.targetId==cur);
            this.editData.data.forEach(item=>item.active=false)
            obj.active = true;
        },
        editDialogVisible(cur,old){
            if(!cur){
                this.searchKey = ''
                this.pageNo = 1
                this.editDialogList = []
                this.oldSearchKey = ''
            }
        },
        /**
         * 是否动了数据
         */
        curEditData:{
            handler(cur,old){
                if(this.editData.initData){
                    this.editData.inEdit = false;
                    delete this.editData.initData;
                }else{
                    if(this.editData.compareFlag){
                        let tempCur = JSON.stringify(cur);
                        let tempOld = JSON.stringify(old);
                        this.editData.inEdit = tempCur==tempOld && this.editData.saveDataFlag ? false:true
                        delete this.editData.compareFlag;
                    }else{
                        console.log('动了数据')
                        this.editData.inEdit = true;
                        this.editData.saveDataFlag = false;
                    }
                }
            },
            deep:true
        },
        moduleName(cur,old){
            console.log('动了数据')
            this.editData.inEdit = true;
        },
        searchKey(cur,old){
            this.searchFlag = false;
        }
    },
    created(){
        this.getLabelList()
    },
    mounted(){
        setTimeout(()=>{
            this.homeCloumnId = this.$store.state.homeConfig.adultHomeEditData.find(item=>item.active==true).tabId;
            this.cloumnTitle = this.$store.state.homeConfig.adultHomeEditData.find(item=>item.active==true).tabName;
            this.homeCloumnId = this.homeCloumnId<0?'':this.homeCloumnId
        },1)
    },
    methods:{
        ...mapActions(['setHomeCloumnId']),
        //选择类型事件
        changePlugin(data){
            this.pageNo = 1;
            this.editDialogList = []             
            // this.checkedCitiesVal = this.checkedCities.toString();
            this.getListByLabelId();
        },           
        getSubModuleInfoList(id,data){
            let url = this.settingType&&this.settingType=='3'?this.$server.subModuleInfoList:this.$server.getSubModuleInfoList
            this.$http.get(`${url}/${id}`).then(res=>{
                if(res.status==200){
                    if(this.moduleId!=this.editData.id) return;//防止选择模块过快，造成数据缓存有误
                    this.targetId = res.content.targetId;
                    let tagData = res.content.ahprrList.map((item,index)=>{
                        return {
                            imgUrl:item.imgUrl,
                            title:item.title,
                            courseName:item.courseName,
                            courseId:item.targetId,
                            targetId:item.targetId
                        }
                    })
                    let editChildData = data.map(item=>{
                        return {
                            targetId:item.id,
                            tagData:item.id==this.targetId?tagData:[],
                            active:item.id==this.targetId?true:false,
                        }
                    })
                    this.editData.data = editChildData;
                    this.editData.initData = true;
                    this.editData.saveDataFlag = true;
                }
            })
        },
        /**
         * 查询标签列表
         */
        getLabelList(){
            let params = {
                name:''
            }
            this.$http.get(`${this.$server.getLabelList}/1`,{params}).then(res=>{
                if(res.status==200){
                    this.classifyOption = res.content.map(item=>{
                        return {
                            label:item.name,
                            value:item.id
                        }
                    })
                    let {id} = this.editData;
                    this.moduleId = id;
                    if(this.editData.data.length==0){
                        if(id==-1){
                            let editChildData = [];
                            res.content.forEach(item=>{
                                editChildData.push({
                                    targetId:item.id,
                                    tagData:[],
                                    active:false
                                })
                            })
                            this.editData.data = editChildData;
                        }else{
                            this.getSubModuleInfoList(id,res.content)
                        }
                    }else{
                        let obj = this.editData.data.find(item=>item.active==true)
                        this.targetId = obj?obj.targetId:'';
                        this.editData.compareFlag = true;
                    }
                }
            })
        },
        /**
         * 添加标签
         */
        addTag(){
            if(this.targetId==''){
                this.$message.error('请选择标签设置');
                return;
            }
            if(this.curEditData.length>=3) return;
            this.curEditData.push({
                imgUrl:'',
                title:'',
                courseName:'',
                courseId:'',
                targetId:''
            })
        },
        /**
         * 弹出弹窗
         */
        DialogShow(item,type){
            this.editDialogVisible = true;
            this.tempObj = item;
            this.editDialogVal = Number(item.courseId);
            this.getListByLabelId();
        },
        /**
         * 获取标签下面的课程
         */
        getListByLabelId(){
            this.loading = true;
            this.isLastPage = false;
            let params = {
                name:this.oldSearchKey,
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                labelId:this.targetId,
                courseSource:this.checkedCities
            }
            if(this.searchFlag){
                params.name = this.searchKey
                this.oldSearchKey = this.searchKey
            }
            this.$http.get(this.$server.getListByLabelId,{params}).then(res=>{
                if(res.status==200){
                    this.editDialogList = [...this.editDialogList,...res.content.list]
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
         * 滚动分页
         */
        scrollEvent(){
            let scrollDistance = this.$refs.scrollBox.scrollHeight - this.$refs.scrollBox.scrollTop - this.$refs.scrollBox.clientHeight
            let sign = 50;
            if (scrollDistance <= sign) {
                this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent)
                this.pageNo++;
                this.getListByLabelId();
            }
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
         * 搜索
         */
        search(){
            this.searchKey = this.searchKey.replace(regExp.specialChar,'');
            this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent);
            this.searchFlag = true;
            this.$nextTick(()=>{
                this.pageNo = 1;
                this.editDialogList = []
                this.$nextTick(()=>{
                    this.getListByLabelId()
                })
            })
        },
        /**
         * 弹出框确定事件
         */
        dialogSure(){
            let obj = this.editDialogList.find(item=>item.id==this.editDialogVal);
            this.tempObj.courseName = obj.title;
            this.tempObj.courseId = obj.id;
            this.editDialogVisible = false;
        },
        /**
         * 点击上传
         */
        uploadFile(index){
            this.$refs.uploadInput[index].click()
        },
        /**
         * 上传之前先清空value
         */
        emptyFile(e){
            e.target.value = ''
        },
        /**
         * 获取文件
         */
        getFile(event,index){
            let files = event.target.files || event.dataTransfer.files;
            let fileData = files[0];
            if (!/(\.png|\.jpg|\.jpeg)$/.test(fileData.name.toLowerCase())) {
                this.$message.error("图片格式有误");
                return;
            }
            let reader = new FileReader();
            reader.onload = e=>{
                let data = e.target.result;
                let image = new Image();
                image.onload = ()=>{
                    let width = image.width;
                    let height = image.height;
                    if(width!=432||height!=400){
                        this.$message.error('请上传432*400的图片');
                        return;
                    }
                    let params = new FormData();
                    params.append('file',fileData)
                    let config = {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                    this.$http.post(this.$server.actionImgOrvideo,params,config).then(res=>{
                        if(res.status==200){
                            this.curEditData[index].imgUrl = res.content.resourceUrl
                        }
                    })
                }
                image.src= data;
            };
            reader.readAsDataURL(fileData);
        },
        /**
         * 删除单项设置   
         */
        delItem(index){
            this.curEditData.splice(index,1)
        },
        /**
         * 元素上移   
         */
        sortUp(index){
            if(index==0) return;
            var temp = this.curEditData[index - 1];
            this.$set(this.curEditData, index - 1, this.curEditData[index]);
            this.$set(this.curEditData, index, temp)
        },
        /**
         * 元素下移   
         */
        sortBottom(index){
            if((index==0&&this.curEditData.length==1)||index==this.curEditData.length-1) return;
            let temp = this.curEditData[index + 1];
            this.$set(this.curEditData, index + 1, this.curEditData[index])
            this.$set(this.curEditData, index, temp)
        },
        /**
         * 保存数据
         */
        saveData(){
            if(this.curEditData.length==0){
                this.$alert('您还有未添加的数据，不能保存', '提示', {
                    confirmButtonText: '关闭',
                    center:true,
                    callback: action => {}
                });
                return;
            }
            let flag = this.curEditData.some(item=>{
                return item.title==''||item.imgUrl==''||item.courseId==''
            })
            if(flag){
                this.$alert('您还有未添加的数据，不能保存', '提示', {
                    confirmButtonText: '关闭',
                    center:true,
                    callback: action => {}
                });
                return;
            }
            let flags = this.curEditData.every(item=>{
                return regExp.exceptSpecialChar.test(item.title)
            })
            if(!flags){
                this.$message.error('标题只能输入数字、字母、汉字');
                return;
            }
            let query = {
                id:this.moduleId,
                homeCloumnId:this.homeCloumnId,
                name:this.editData.name,
                type:this.settingType,
                subModule:13,
                style:1,
                styleImgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/abe7114c-c7ea-4ed4-99ed-04b37b31f4f2.png',
                num:this.curEditData.length,
                targetId:this.targetId,
            }
            if(this.homeCloumnId==''){
                query.cloumnTitle = this.cloumnTitle
            }
            this.curEditData.forEach((item,index)=>{
                query['appHomeRelationRecordFormList['+index+'].title'] = item.title;
                query['appHomeRelationRecordFormList['+index+'].type'] = 1
                query['appHomeRelationRecordFormList['+index+'].targetId'] = item.courseId
                query['appHomeRelationRecordFormList['+index+'].imgUrl'] = item.imgUrl
                query['appHomeRelationRecordFormList['+index+'].sort'] = index+1
            })
            let loadingInstance = this.$loading({
                target:document.querySelector('.module-edit')
            });
            let url = this.settingType&&this.settingType=='3'?this.$server.saveWxSubModule:this.$server.saveSubModule
            this.$http.post(url,query,{headers: {'Content-Type':'application/x-www-form-urlencoded'}}).then(res=>{
                loadingInstance.close();
                if(res.status==200){
                    let temp = this.adultHomeEditData.find(item=>item.localId == this.editData.localId)
                    temp.id = res.content.subModuleId;
                    this.setHomeCloumnId(res.content.homeCloumnId);
                    this.moduleId = res.content.subModuleId;
                    this.editData.data.forEach(item=>{
                        if(item.active==false){
                            item.tagData = [ ]
                        }
                    })
                    this.editData.inEdit = false;
                    this.editData.saveDataFlag = true;
                    this.$message({
                        message: '保存成功！',
                        type: 'success'
                    });
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .module-edit{
        font-size: 14px;
        height: 100%;
        .module-edit-header{
            padding-bottom:10px;
            line-height: 32px;
            border-bottom: 1px solid #dfdfdf;
            p{
                float: left;
                font-size: 16px;
            }
            button{
                float: right;
            }
        }
        .module-edit-body{
            padding: 10px 0;
            height: calc(100% - 43px);
            overflow-y: auto;
            overflow-x:hidden;
            .module-name{
                label{
                    width: 56px;
                    text-align: right;
                    display: inline-block;
                    vertical-align: middle;
                }
                .input-area,p{
                    display: inline-block;
                    vertical-align: middle;
                }
                .input-area{
                    width: 200px;
                    margin:0 10px 0 5px;
                }
            }
            .styles{
                margin:20px 0;
                position: relative;
                text-align: left;
                label{
                    width: 56px;
                    text-align: right;
                    display: inline-block;
                    vertical-align: middle;
                }
                .el-select{
                    margin:0 5px;
                }
                .thumbnail{
                    display: inline-block;
                    vertical-align: middle;
                    width: 79px;
                    height: 32px;
                    border-bottom: 3px;
                }
                .question{
                    position: absolute;
                    top:-9px;
                    left: 270px;
                    font-size: 18px;
                    color:#bbb
                }
            }
            .number{
                position: relative;
                margin-top:20px;
                p{
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 26px;
                    width: 56px;
                    text-align: right;
                    margin-right: 5px;
                }
                p+p{
                    border:1px solid #dfdfdf;
                    width: 60px;
                    text-align: center;
                    border-radius: 3px;
                }
                .question{
                    position: absolute;
                    top:-9px;
                    left: 130px;
                    font-size: 18px;
                    color:#bbb
                }
            }
            .tip{
                color:#aaa;
                margin-top:10px;
                span{
                    margin-left: 20px;
                }
            }
            .edit-list{
                margin:20px 0;
                .edit-item{
                    border:1px solid #dfdfdf;
                    padding: 10px;
                    margin:20px 0;
                    position: relative;
                    width: 96%;
                    &:hover{
                        .del-btn{
                            visibility: visible;
                        }
                    }
                    .img-file-box{
                        float: left;
                        width: 120px;
                        height: 120px;
                        overflow: hidden;
                        position: relative;
                        cursor: pointer;
                        .file-upload{
                            opacity: 0;
                            position: absolute;
                            top:0;
                            left: 0;
                        }
                        .img-file{
                            height: 100%;
                            width: 100%;
                            img{
                                position: absolute;
                                top:50%;
                                left: 50%;
                                transform: translate(-50%,-50%);
                                height: 100%;
                            }
                        }
                        .des{
                            position: absolute;
                            bottom:0;
                            left: 0;
                            z-index: 3;
                            font-size: 14px;
                            color:#fff;
                            text-align: center;
                            line-height: 30px;
                            background: rgba(0,0,0,.5);
                            width: 100%;
                        }
                    }
                    .text-box{
                        float: left;
                        margin-left: 20px;
                        width: calc(100% - 220px);
                        label{
                            margin-right: 5px;
                        }
                        .el-input{
                            width: 200px;
                        }
                        label,.el-input{
                            display: inline-block!important;
                            vertical-align: middle!important;
                        }
                        .banner-title{
                            margin:16px 0;
                        }
                        .banner-type{
                            .more-text{
                                display: inline-block!important;
                                vertical-align: middle!important;
                                cursor: default;
                                margin-left: 10px;
                                width: calc(100% - 135px);
                            }
                            button{
                                padding: 10px!important;
                            }
                        }
                    }
                    .del-btn{
                        position: absolute;
                        right: -10px;
                        top:-10px;
                        font-size: 20px;
                        cursor: pointer;
                        i{
                            color:#bbb;
                        }
                    }
                    .sort-btn{
                        position: absolute;
                        width: 30px;
                        right: -30px;
                        top:30%;
                        i{
                            font-size: 24px;
                            color:#b4272d;
                            cursor: pointer;
                            &.not-allowed{
                                cursor: not-allowed;
                                color:#bbb;
                            }
                        }
                    }
                }
            }
            .add-btn{
                text-align: center;
                margin-top:40px;
                span{
                    font-size: 16px;
                }
                .not-allow{
                    cursor: not-allowed;
                    background: #f5f7fa;
                    border-color: #e4e7ed;
                    color:#c0c4cc;
                    &:hover{
                        background: #f5f7fa;
                        border-color: #e4e7ed;
                    }
                }
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
                padding: 20px 0;
                overflow: hidden;
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
