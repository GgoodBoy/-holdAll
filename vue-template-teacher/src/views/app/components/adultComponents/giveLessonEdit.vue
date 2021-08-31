<template>
    <div class="module-edit advertising">
        <div class="module-edit-header clearfix">
            <p class="title" ref="title">赠课活动</p>
            <el-button v-if="($authJudge('homeset:appadult:savedata')&&settingType=='1')||$authJudge('homeset:appletadult:savedata')&&settingType=='3'" type="primary" size="small" @click="saveData">保存</el-button>
        </div>
        <div class="module-edit-body">
            <p class="tips">图片尺寸690*120，100K以内的JPG、PNG</p>
            <!-- <div class="module-name">
                <label>模块名称</label>
                <div class="input-area"><el-input size="medium" v-model="editData.name" maxlength="10"></el-input></div>
                <p>{{editData.name?editData.name.length:0}}/10</p>
            </div> -->
            <!-- <div class="clearfix styles">
                <label>样式</label>
                <el-select v-model="styleVal" size="small">
                    <el-option
                        v-for="item in styleOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <p class="tip">支持PNG、JPEG</p>
                <div class="question">
                    <i class=" el-icon-question"></i>
                    <div class="real-img" :class="styleVal==1?'style1':'style2'"></div>
                </div>
            </div> -->
            <!-- <div class="number">
                <p>展示数量</p>
                <p>{{curEditData.length}}</p>
                <el-tooltip class="item" effect="dark" content="不限制个数" placement="right">
                    <i class="question el-icon-question"></i>
                </el-tooltip>
            </div> -->
            <div class="edit-list">
                <div class="edit-item" v-for="(item,index) in curEditData" :key="index">
                    <div class="top clearfix">
                        <div class="img-file-box" @click="uploadFile(index)">
                            <input type="file" name="file" class="file-upload" ref="uploadInput" @change="getFile($event,index)" @click="emptyFile($event)"/>
                            <div class="img-file" v-loading="imgLoading">
                                <img :src="item.imgUrl" />
                            </div>
                            <p class="des">修改</p>
                        </div>
                        <!-- <div class="text-box">
                            <div class="banner-title">
                                <label>标题</label>
                                <el-input clearable size="medium" v-model="item.title" ref="input" maxlength="10"></el-input>
                            </div>
                            <div class="banner-type">
                                <div class="type1" v-if="item.type=='1'">
                                    <label>课程</label>
                                    <el-button type="primary" size="medium" @click="DialogShow(item)">选择课程</el-button>
                                    <el-tooltip :content="item.courseName" placement="top-start">
                                        <p class="textEllipsis more-text">{{item.courseName}}</p>
                                    </el-tooltip>
                                </div>
                                <div class="type2" v-if="item.type=='2'">
                                    <label>资讯</label>
                                    <el-button type="primary" size="medium" @click="DialogShow(item)">选择资讯</el-button>
                                    <el-tooltip :content="item.infoName" placement="top-start">
                                        <p class="textEllipsis more-text">{{item.infoName}}</p>
                                    </el-tooltip>
                                </div>
                                <div class="type3" v-if="item.type=='3'">
                                    <label>链接</label>
                                    <el-input clearable size="medium" placeholder="
                                    " v-model="item.link" max="255"></el-input>
                                </div>
                                <div class="type4" v-if="item.type=='4'"></div>
                            </div>
                        </div> -->
                    </div>
                    <!-- <div class="bottom">
                        <el-radio-group v-model="item.type">
                            <el-radio :label="1">课程</el-radio>
                            <el-radio :label="2" v-if="settingType==1">资讯</el-radio>
                            <el-radio :label="3">链接</el-radio>
                            <el-radio :label="4">无链接</el-radio>
                        </el-radio-group>
                    </div> -->
                    <!-- <div class="btns">
                        <div class="del-btn" @click="delItem(index)">
                            <i class="el-icon-circle-close"></i>
                        </div>
                        <div class="sort-btn">
                            <div @click="sortUp(index)"><i class="el-icon-caret-top" :class="index==0?'not-allowed':''"></i></div>
                            <div @click="sortBottom(index)"><i class="el-icon-caret-bottom" :class="(index==0&&curEditData.length==1)||(index==curEditData.length-1)?'not-allowed':''"></i></div>
                        </div>
                    </div> -->
                </div>
            </div>
            <!-- <div class="add-btn"><button class="my-primary-btn" @click="addAdvertising"><i class="el-icon-plus"></i><span>添加通栏广告</span></button></div> -->
        </div> 
        <el-dialog :custom-class="'edit-dialog'" :visible.sync="editDialogVisible" :width="'500px'" :show-close="false">
            <div style="margin-bottom:20px; text-align: left;">
                <el-radio-group 
                    v-model="checkedCities" @change="changePlugin">
                    <el-radio v-for="(city,index) in cities" :label="city.value" :key="index">{{city.name}}</el-radio>
                </el-radio-group>                  
            </div>             
            <div class="search-box">
                <el-input :placeholder="tempObj.type==1?'输入课程名称查询':'输入资讯名称查询'" size="medium" prefix-icon="el-icon-search" v-model="searchKey" maxlength="10" @keypress.native="pressEvent($event)"></el-input>
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
            moduleId:'',
            styleOption:[
                {label:'样式一 690*120',value:'1'},
                {label:'样式二 690*200',value:'2'},
            ],
            styleVal:'1',
            editDialogVisible:false,//选择窗口
            searchKey:'',//搜索词
            oldSearchKey:'',
            searchFlag:false,
            pageNo:1,
            pageSize:20,
            isLastPage:false,
            editDialogVal:0,//弹框值
            editDialogList:[],//弹窗list
            tempObj:'',//当前弹窗选择的对象
            loading:true,//弹窗是否loading
            imgLoading:false,
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
         * 模块总数据
         */
        adultHomeModuleChildData(){
            return this.$store.state.homeConfig.adultHomeModuleChildData;
        },
        /**
         * 通栏广告总数据
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
         * 当前通栏广告数据(具体到样式下)
         */
        curEditData(){
            if(this.editData.data&&this.editData.data.length>0){
                let temp = this.editData.data.find(item=>item.active==true)
                return temp?temp.advertisingData:[];
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
        styleVal(cur,old){
            let obj = this.editData.data.find(item=>item.styleType==cur);
            this.editData.data.forEach(item=>item.active=false)
            obj.active = true;
            this.editData.style = cur;
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
            this.editData.inEdit = true;
        },
        searchKey(cur,old){
            this.searchFlag = false;
        }
    },
    created(){
        setTimeout(()=>{
            this.homeCloumnId = this.$store.state.homeConfig.adultHomeEditData.find(item=>item.active==true).tabId;
            this.cloumnTitle = this.$store.state.homeConfig.adultHomeEditData.find(item=>item.active==true).tabName;
            this.homeCloumnId = this.homeCloumnId<0?'':this.homeCloumnId
        },1)
    },
    mounted(){
        this.initData()
    },
    methods:{
        ...mapActions(['setHomeCloumnId']),
        //选择类型事件
        changePlugin(data){
            this.pageNo = 1;
            this.editDialogList = []             
            // this.checkedCitiesVal = this.checkedCities.toString();
            this.getCourseList();
        },        
        initData(){
            let {id} = this.editData;
            this.moduleId = id!=-1?id:''
            if(this.editData.data.length==0){
                if(id==-1){
                    this.styleVal = '1';
                    let editChildData = [
                        {styleType:'1',advertisingData:[],active:true},
                        {styleType:'2',advertisingData:[],active:false}
                    ]
                    this.editData.data = editChildData;
                    this.addAdvertising()
                }else{
                    this.getSubModuleInfoList(id)
                }
            }else{
                let obj = this.editData.data.find(item=>item.active==true)
                this.styleVal = obj.styleType;
                this.editData.compareFlag = true;
            }
        },
        /**
         * 查询app首页子模板数据列表
         */
        getSubModuleInfoList(id){
            let loadingInstance = this.$loading({
                target:document.querySelector('.module-edit')
            });
            let url = this.settingType&&this.settingType=='3'?this.$server.subModuleInfoList:this.$server.getSubModuleInfoList
            this.$http.get(`${url}/${id}`).then(res=>{
                loadingInstance.close();
                if(res.status==200){
                    if(this.moduleId!=this.editData.id) return;
                    this.styleVal = String(res.content.style);
                    let advertisingData = res.content.ahprrList.map(item=>{
                        return {
                            title:item.title?item.title:'',
                            type:item.type?item.type:'',
                            targetId:item.targetId?item.targetId:'',
                            imgUrl:item.imgUrl?item.imgUrl:'',
                            courseName:item.courseName?item.courseName:'',
                            courseId:item.type==1&&item.targetId?item.targetId:'',
                            infoName:item.infoName?item.infoName:'',
                            infoId:item.type==2&&item.targetId?item.targetId:'',
                            link:item.type==3&&item.targetId?item.targetId:''
                        }
                    })
                    let editChildData = [
                        {styleType:'1',advertisingData:res.content.style==1?advertisingData:[],active:res.content.style==1?true:false},
                        {styleType:'2',advertisingData:res.content.style==2?advertisingData:[],active:res.content.style==2?true:false}
                    ]
                    this.editData.data = editChildData;
                    this.editData.initData = true;
                    this.editData.saveDataFlag = true;
                }
            })
        },
        /**
         * 弹出弹窗
         */
        DialogShow(item,type){
            this.editDialogVisible = true;
            this.tempObj = item;
            this.editDialogList.splice(0,this.editDialogList.length)
            if(item.type==1){
                this.getCourseList();
                this.editDialogVal = Number(item.courseId)
            }else if(item.type==2){
                this.getInformationList();
                this.editDialogVal = Number(item.infoId)
            }
        },
        /**
         * 获取课程
         */
        getCourseList(item){
            this.loading = true;
            this.isLastPage = false;
            let params = {
                name:this.oldSearchKey,
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                type:1,
                courseSource:this.checkedCities
            }
            if(this.searchFlag){
                params.name = this.searchKey
                this.oldSearchKey = this.searchKey
            }
            this.$http.get(this.$server.getCourseList,{params}).then(res=>{
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
         * 获取资讯
         */
        getInformationList(){
            this.loading = true;
            this.isLastPage = false;
            let params = {
                name:this.oldSearchKey,
                pageNo:this.pageNo,
                pageSize:this.pageSize,
            }
            if(this.searchFlag){
                params.name = this.searchKey
                this.oldSearchKey = this.searchKey
            }
            this.$http.get(this.$server.getInformationList,{params}).then(res=>{
                if(res.status==200){
                    res.content.list.forEach(item=>{
                        item.title = item.name;
                    })
                    this.editDialogList = [...this.editDialogList,...res.content.list]
                    this.isLastPage = res.content.isLastPage;
                    this.loading = false;
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
                if(this.tempObj.type==1){
                    this.getCourseList();
                }else if(this.tempObj.type==2){
                    this.getInformationList();
                }
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
            this.$refs.scrollBox.removeEventListener("scroll",this.scrollEvent)
            this.searchFlag = true;
            this.$nextTick(()=>{
                this.pageNo = 1;
                this.editDialogList = []
                if(this.tempObj.type==1){
                    this.$nextTick(()=>{
                        this.getCourseList()
                    })
                }else if(this.tempObj.type==2){
                    this.$nextTick(()=>{
                        this.getInformationList()
                    })
                }    
            })
        },
        /**
         * 弹出框确定事件
         */
        dialogSure(){
            let obj = this.editDialogList.find(item=>item.id==this.editDialogVal);
            if(this.tempObj.type==1){
                this.tempObj.courseName = obj.title;
                this.tempObj.courseId = obj.id;
            }else if(this.tempObj.type==2){
                this.tempObj.infoName = obj.title;
                this.tempObj.infoId = obj.id;
            }
            this.editDialogVisible = false;
        },
        /**
         * 添加通栏广告数据
         */
        addAdvertising(){
            this.curEditData.push({
                title:'',
                type:1,
                targetId:'',
                imgUrl:'',
                courseName:'',
                courseId:'',
                infoName:'',
                infoId:'',
                link:''
            })
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
                this.$message.error("图片格式有误，请上传JPEG(JPG)或PNG格式");
                return;
            }
            let reader = new FileReader();
            reader.onload = e=>{
                let data = e.target.result;
                let image = new Image();
                image.onload = ()=>{
                    let width = image.width;
                    let height = image.height;
                    if(this.styleVal=='1'){
                        if(width!=690||height!=120){
                            this.$message.error('请上传690*120的图片');
                            return;
                        }
                    }else if(this.styleVal=='2'){
                        if(width!=690||height!=200){
                            this.$message.error('请上传690*200的图片');
                            return;
                        }
                    }
                    this.imgLoading = true;
                    let params = new FormData();
                    params.append('file',fileData)
                    let config = {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                    this.$http.post(this.$server.actionImgOrvideo,params,config).then(res=>{
                        if(res.status==200){
                            this.curEditData[index].imgUrl = res.content.resourceUrl
                        }
                    }).finally(()=>{
                        this.imgLoading = false;
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
                return item.imgUrl==''
            })
            if(flag){
                this.$alert('您还有未添加的数据，不能保存', '提示', {
                    confirmButtonText: '关闭',
                    center:true,
                    callback: action => {}
                });
                return;
            }else{
                let query = {
                    id:this.moduleId,
                    homeCloumnId:this.homeCloumnId,
                    name:this.editData.name,
                    type:this.settingType,
                    subModule:19,
                    style:this.styleVal,
                    styleImgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/abe7114c-c7ea-4ed4-99ed-04b37b31f4f2.png',
                    num:this.curEditData.length,
                    targetId:0,
                }
                if(this.homeCloumnId==''){
                    query.cloumnTitle = this.cloumnTitle
                }
                this.curEditData.forEach((item,index)=>{
                    query['appHomeRelationRecordFormList['+index+'].title'] = '';
                    query['appHomeRelationRecordFormList['+index+'].type'] = '12';
                    query['appHomeRelationRecordFormList['+index+'].targetId'] = '';
                    query['appHomeRelationRecordFormList['+index+'].imgUrl'] = item.imgUrl
                    query['appHomeRelationRecordFormList['+index+'].sort'] = index+1;
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
                        this.editData.data.find(item=>item.active == false).advertisingData = []
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
            .tips{
                color:#aaa;
            }
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
                .tip{
                    color:#aaa;
                    display: inline-block;
                    vertical-align: middle;
                }
                 .question{
                    position: absolute;
                    top:-9px;
                    left: 265px;
                    font-size: 18px;
                    color:#bbb;
                    i{
                        position: absolute;
                        top:0;
                        left:0;
                    }
                    &:hover{
                        .real-img{
                            visibility:visible;
                            opacity: 1;
                            &:hover{
                                visibility:hidden!important;
                                opacity: 0!important;
                            }
                        }
                    }
                }
                .real-img{
                    margin:9px 0 0 24px;
                    visibility:hidden;
                    opacity: 0;
                    transition: all 0.3s;
                    &.style1{
                        width: 345px;
                        height: 60px;
                        border-radius: 5px;
                         transform: scale(0.8) translate(-10%,-10%);
                        background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/chengren/mk1/tlgg/tlgg1.png')no-repeat 50% 50% /cover;
                    }
                    &.style2{
                        width: 345px;
                        height: 100px;
                        border-radius: 5px;
                        transform: scale(0.8) translate(-10%,-10%);
                        background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/chengren/mk1/tlgg/tlgg2.png')no-repeat 50% 50% /cover;
                    }
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
            .add-btn{
                text-align: center;
                margin-top:40px;
                button{
                    padding: 20px;
                    i,span{
                        vertical-align: middle;
                        display: inline-block;
                    }
                    span{
                        font-size: 16px;
                    }
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
                    .top{
                        .img-file-box{
                            float: left;
                            width: 200px;
                            height: 100px;
                            overflow: hidden;
                            position: relative;
                            cursor: pointer;
                            .file-upload{
                                opacity: 0;
                                position: absolute;
                            }
                            .img-file{
                                height: 100%;
                                width: 100%;
                                border: 1px dashed #dfdfdf;
                                img{
                                    position: absolute;
                                    top:40%;
                                    left: 50%;
                                    transform: translate(-50%,-50%);
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
                                margin:10px 0;
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
                    }
                    .bottom{
                        margin-top:10px;
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
                        top:35%;
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