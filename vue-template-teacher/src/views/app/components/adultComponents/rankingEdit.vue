<template>
    <div class="module-edit columns-courses">
        <div class="module-edit-header clearfix">
            <p class="title" ref="title">排行榜</p>
            <el-button v-if="$authJudge('homeset:appadult:savedata')" type="primary" size="small" @click="saveData">保存</el-button>
        </div>
        <div class="module-edit-body">
            <!-- <div class="module-name">
                <label>模块名称</label>
                <div class="input-area"><el-input size="medium" v-model="editData.name" maxlength="10"></el-input></div>
                <p>{{editData.name?editData.name.length:0}}/10</p>
            </div> -->
            <div class="clearfix styles">
                <label>样式</label>
                <el-select v-model="styleVal" size="small">
                    <el-option
                        v-for="item in styleOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div class="question">
                    <i class=" el-icon-question"></i>
                    <div class="real-img" :class="styleVal==1?'style1':'style2'"></div>
                </div>
            </div>
            <div class="number">
                <p>展示数量</p>
                <p>{{curEditData.length}}</p>
                <el-tooltip class="item" effect="dark" :content="styleVal=='1'?'该样式只能添加5个':'该样式最多可以添加8个'" placement="right">
                    <i class="question el-icon-question"></i>
                </el-tooltip>
            </div>
            <div v-if="styleVal=='1'" class="select-course">
                <div>
                    <span>头部背景</span>
                    <el-button type="primary" size="medium" @click="uploadFile">上传图片</el-button>
                    <span class="tip">尺寸：690*166支持JPEG、PNG</span>
                    <input type="file" ref="uploadInput" class="upload-file" @change="getFile($event)"/>
                    <div v-loading="imgLoading">
                        <img v-if="styleImgUrl.length>0" :src="styleImgUrl"/>
                    </div>
                </div>
                <div style="margin:20px 0">
                    <p>课程</p>
                    <el-button type="primary" size="medium" @click="showDialog">选择课程</el-button>
                </div>
            </div>
            <div class="select-course" v-if="styleVal=='2'">
                <p>课程</p>
                <el-button type="primary" size="medium" @click="showDialog">选择课程</el-button>
            </div>
            <div class="edit-list">
                <div class="edit-item type2 clearfix"  v-for="(item,index) in curEditData" :key="index">
                    <p class="course-name">{{item.courseName}}</p>
                    <div class="btns">
                        <div class="del-btn" @click="delItem(index)">
                            <i class="el-icon-circle-close"></i>
                        </div>
                        <div class="sort-btn sort-type2">
                            <div @click="sortUp(index)"><i class="el-icon-caret-top" :class="index==0?'not-allowed':''"></i></div>
                            <div @click="sortBottom(index)"><i class="el-icon-caret-bottom" :class="(index==0&&curEditData.length==1)||(index==curEditData.length-1)?'not-allowed':''"></i></div>
                        </div>
                    </div>
                </div>
            </div>
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
                <el-checkbox-group 
                    v-if="styleVal=='1'"
                    v-model="dialogArr1"
                    :min="0"
                    :max="EditDialogMaxNum">
                    <div class="item nameTextEllipsis" v-for="(item,index) in editDialogList" :key="index">
                        <el-checkbox :label="item.id" :disabled="item.disabled">{{item.title}}</el-checkbox>
                        <div style='font-size:14px;'>{{item.sellingPrice||0}}币</div>
                    </div>
                </el-checkbox-group>
                <el-checkbox-group 
                    v-if="styleVal=='2'"
                    v-model="dialogArr2"
                    :min="0"
                    :max="EditDialogMaxNum">
                    <div class="item nameTextEllipsis" v-for="(item,index) in editDialogList" :key="index">
                        <el-checkbox :label="item.id" :disabled="item.disabled">{{item.title}}</el-checkbox>
                        <div style='font-size:14px;'>{{item.sellingPrice||0}}币</div>
                    </div>
                </el-checkbox-group>
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
                {label:'样式一',value:'1'},
                // {label:'样式二',value:'2'},
            ],
            styleImgUrl:'',
            imgLoading:false,
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
            dialogArr1:[],
            courseCheckList1:[],
            dialogArr2:[],//多选集合
            EditDialogMaxNum:5,//多选最大数量
            courseCheckList2:[],//课程多选集合，选择一次push一次，
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
         * 当前通栏课数据(具体到样式下)
         */
        curEditData(){
            if(this.editData.data&&this.editData.data.length>0){
                let temp = this.editData.data.find(item=>item.active==true);
                return temp?temp.columnsCourseData:[];
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
        dialogArr1(cur,old){
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
                let index = this.courseCheckList1.findIndex(option=>option.id==item);
                if(index==-1){
                    let obj = this.editDialogList.find(option=>option.id==item);
                    this.courseCheckList1.push({
                        id:obj.id,
                        title:obj.title
                    })
                }
            })
        },
        dialogArr2(cur,old){
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
                let index = this.courseCheckList2.findIndex(option=>option.id==item);
                if(index==-1){
                    let obj = this.editDialogList.find(option=>option.id==item);
                    this.courseCheckList2.push({
                        id:obj.id,
                        title:obj.title
                    })
                }
            })
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
        this.initData();
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
                        {styleType:'1',columnsCourseData:[],active:true},
                        {styleType:'2',columnsCourseData:[],active:false}
                    ]
                    this.editData.data = editChildData;
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
            this.$http.get(`${this.$server.getSubModuleInfoList}/${id}`).then(res=>{
                loadingInstance.close()
                if(res.status==200){
                    if(this.moduleId!=this.editData.id) return;//防止选择模块过快，造成数据缓存有误
                    this.styleVal = String(res.content.style);
                    this.styleImgUrl = res.content.styleImgUrl;
                    let columnsCourseData = [];
                    if(res.content.style==1){
                        columnsCourseData = res.content.ahprrList.map((item,index)=>{
                            return {
                                courseId:Number(item.targetId),
                                targetId:Number(item.targetId),
                                courseName:item.title
                            }
                        })
                        this.dialogArr1 = res.content.ahprrList.map(item=>{
                            return Number(item.targetId)
                        });
                        this.courseCheckList1 = res.content.ahprrList.map(item=>{
                            return {
                                id:Number(item.targetId),
                                title:item.title
                            }
                        })
                    }else if(res.content.style==2){
                        columnsCourseData = res.content.ahprrList.map((item,index)=>{
                            return {
                                courseId:Number(item.targetId),
                                targetId:Number(item.targetId),
                                courseName:item.title
                            }
                        })
                        this.dialogArr2 = res.content.ahprrList.map(item=>{
                            return Number(item.targetId)
                        });
                        this.courseCheckList2 = res.content.ahprrList.map(item=>{
                            return {
                                id:Number(item.targetId),
                                title:item.title
                            }
                        })
                    }
                    let editChildData = [
                        {styleType:'1',columnsCourseData:res.content.style==1?columnsCourseData:[],active:res.content.style==1?true:false},
                        {styleType:'2',columnsCourseData:res.content.style==2?columnsCourseData:[],active:res.content.style==2?true:false}
                    ]
                    this.editData.data = editChildData;
                    this.editData.initData = true;
                    this.editData.saveDataFlag = true;
                }
            })
        },
        /**
         * 弹出弹窗,样式一
         */
        DialogShow(item,type){
            this.editDialogVisible = true;
            this.tempObj = item;
            this.getCourseList();
        },
        /**
         * 弹出弹框
         */
        showDialog(){
            this.editDialogVisible = true;
            if(this.styleVal=='1'){
                this.dialogArr1.splice(0,this.dialogArr1.length)
                this.curEditData.forEach(item=>{
                    if(item.targetId){
                        this.dialogArr1.push(item.targetId)
                    }
                })
            }else if(this.styleVal=='2'){
                this.dialogArr2.splice(0,this.dialogArr2.length)
                this.curEditData.forEach(item=>{
                    if(item.targetId){
                        this.dialogArr2.push(item.targetId)
                    }
                })
            }
            
            this.getCourseList();    
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
                    let arr = res.content.list;
                    if(this.styleVal=='1'){
                        if(this.dialogArr1.length>=this.EditDialogMaxNum){
                            arr.forEach(item=>{
                                item.disabled = true;
                            })
                        }else{
                            arr.forEach(item=>{
                                let obj = this.dialogArr1.find(id=>id==item.id);
                                if(obj){
                                    item.disabled = true;
                                    item.oldData = true;
                                }else{
                                    item.disabled = false;
                                }
                            })
                        }
                    }
                    else if(this.styleVal=='2'){
                        if(this.dialogArr2.length>=this.EditDialogMaxNum){
                            arr.forEach(item=>{
                                item.disabled = true;
                            })
                        }else{
                            arr.forEach(item=>{
                                let obj = this.dialogArr2.find(id=>id==item.id);
                                if(obj){
                                    item.disabled = true;
                                    item.oldData = true;
                                }else{
                                    item.disabled = false;
                                }
                            })
                        }
                    }
                    this.editDialogList = [...this.editDialogList,...arr]
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
                this.getCourseList();
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
                this.$nextTick(()=>{
                    this.getCourseList()
                })
            })
        },
        /**
         * 弹出框确定事件
         */
        dialogSure(){
            this.curEditData.splice(0, this.curEditData.length);
            if(this.styleVal=='1'){
                this.courseCheckList1.forEach(item=>{
                    let obj = this.dialogArr1.find(id=>id==item.id);
                    if(obj){
                        this.curEditData.push({
                            targetId:item.id,
                            courseName:item.title
                        })
                    }
                })
            }else if(this.styleVal=='2'){
                this.courseCheckList2.forEach(item=>{
                    let obj = this.dialogArr2.find(id=>id==item.id);
                    if(obj){
                        this.curEditData.push({
                            targetId:item.id,
                            courseName:item.title
                        })
                    }
                })
            }
            this.editDialogVisible = false;
        },
        /**
         * 添加通栏课
         */
        addcolumnCourse(){
            if(this.styleVal=='1'){
                if(this.curEditData.length>=3) return;
                this.curEditData.push({
                    imgUrl:'',
                    title:'',
                    courseName:'',
                    courseId:'',
                    targetId:''
                })
            }
        },
        /**
         * 点击上传
         */
        uploadFile(){
            this.$refs.uploadInput.click()
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
            this.imgLoading = true;
            let reader = new FileReader();
            reader.onload = e=>{
                let data = e.target.result;
                let image = new Image();
                image.onload = ()=>{
                    let width = image.width;
                    let height = image.height;
                    if(this.styleVal=='1'){
                        if(width!=690||height!=166){
                            this.$message.error('请上传690*166的图片');
                            return;
                        }
                    }
                    let params = new FormData();
                    params.append('file',fileData)
                    let config = {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                    this.$http.post(this.$server.actionImgOrvideo,params,config).then(res=>{
                        this.imgLoading = false;
                        if(res.status==200){
                            this.styleImgUrl = res.content.resourceUrl
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
            if(this.styleVal=='1'){
                this.dialogArr1.splice(index,1)
            }
            if(this.styleVal=='2'){
                this.dialogArr2.splice(index,1)
            }
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
            if(this.styleVal=='1'){
                // if(this.editData.name==''){
                //     this.$message.error('请输入模块名称');
                //     return;
                // }
                if(this.styleImgUrl==''){
                    this.$message.error('请上传头部背景图');
                    return;
                }
                if(this.curEditData.length!=5){
                    this.$message.error('只能选择5个课程');
                    return;
                }
            }
            let query = {
                id:this.moduleId,
                homeCloumnId:this.homeCloumnId,
                name:this.editData.name,
                type:1,
                subModule:17,
                style:this.styleVal,
                styleImgUrl:this.styleImgUrl,
                num:this.curEditData.length,
                targetId:0,
            }
            if(this.homeCloumnId==''){
                query.cloumnTitle = this.cloumnTitle
            }
            if(this.styleVal=='1'){
                this.curEditData.forEach((item,index)=>{
                    query['appHomeRelationRecordFormList['+index+'].title'] = item.courseName;
                    query['appHomeRelationRecordFormList['+index+'].type'] = 1
                    query['appHomeRelationRecordFormList['+index+'].targetId'] = item.targetId
                    query['appHomeRelationRecordFormList['+index+'].imgUrl'] = ''
                    query['appHomeRelationRecordFormList['+index+'].sort'] = index+1
                })
            }else if(this.styleVal=='2'){
                this.curEditData.forEach((item,index)=>{
                    query['appHomeRelationRecordFormList['+index+'].title'] = item.courseName;
                    query['appHomeRelationRecordFormList['+index+'].type'] = 1
                    query['appHomeRelationRecordFormList['+index+'].targetId'] = item.targetId
                    query['appHomeRelationRecordFormList['+index+'].sort'] = index+1
                })
            }
            let loadingInstance = this.$loading({
                target:document.querySelector('.module-edit')
            });
            this.$http.post(this.$server.saveSubModule,query,{headers: {'Content-Type':'application/x-www-form-urlencoded'}}).then(res=>{
                loadingInstance.close();
                if(res.status==200){
                    let temp = this.adultHomeEditData.find(item=>item.localId == this.editData.localId)
                    temp.id = res.content.subModuleId;
                    this.setHomeCloumnId(res.content.homeCloumnId);
                    this.moduleId = res.content.subModuleId;
                    this.editData.data.find(item=>item.active == false).columnsCourseData = []
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
                        height: 150px;
                        transform: scale(0.8) translate(-10%,-10%);
                        background: url('../../../../assets/images/ranking.png')no-repeat 50% 50% /cover;
                    }
                    &.style2{
                        width: 345px;
                        height:150px;
                       transform: scale(0.8) translate(-10%,-10%);
                        background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/chengren/mk1/tlk/tlk2.png')no-repeat 50% 50% /cover;
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
            .select-course{
                margin-top:20px;
                p{
                    width: 56px;
                    display: inline-block;
                    vertical-align: middle;
                    text-align: right;
                    margin-right: 5px;
                }
                span{
                    margin-right: 5px;
                }
                img{
                    width: 345px;
                    height: 83px;
                    margin:20px 0 0 66px;
                }
                .upload-file{
                    opacity: 0;
                    position: absolute;
                    top:-1000px;
                    left:0;
                    z-index: 1;
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
                    &.type2{
                        width: auto;
                        margin:20px 30px 20px 65px;
                    }
                    &:hover{
                        .del-btn{
                            visibility: visible;
                        }
                    }
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
                            img{
                                position: absolute;
                                top:50%;
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
                        &.sort-type2{
                            top:-10%;
                            right: -35px;
                        }
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


