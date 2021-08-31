<template>
    <div class="page-wrap gift-update-wrap">
        <div class="page-header">
            <el-row>
                <el-col :span="4">
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <p class="type-text">{{bagType==3?'首页弹窗课程':'国学见面大礼包'}}-{{giftType==1?'成人版':'少儿版'}}</p>
                </el-col>                                     
            </el-row>  
            <el-row>
                <el-col :span="24">
                    <p class="tips" v-show="bagType==1">根据礼包课程的个数上传不同尺寸的活动背景图（1个课程：589*610、2个课程：589*759、3个课程：589*908）</p>
                    <p class="tips" v-show="bagType==2">类型为跳转链接的国学礼包，只需要上传589*610的活动背景图</p>
                    <p class="tips" v-show="bagType==3">类型为购买课程的国学礼包，只需要上传589*610的活动背景图</p>
                </el-col>                     
            </el-row>        
        </div>
        <div class="page-content">
            <div class="item name clearfix">
                <label>礼包名称</label>
                <div class="data">
                    <el-input maxlength="20" v-model="giftName" placeholder="请输入礼包名称"></el-input>
                </div>
            </div>
            <div class="item name clearfix">
                <label>礼包类型</label>
                <div class="data">
                    <el-radio-group v-model="bagType">
                        <div class="radio-item" v-for="(item,index) in bagTypeArr" :key="index">
                            <el-radio :label="item.value" :disabled="flag=='edit'" class="list-item-radio">
                                <span class="name">{{item.label}}</span>
                            </el-radio>
                        </div>
                    </el-radio-group>
                </div>
            </div>
           <div class="item course clearfix" v-show="bagType==1||bagType==3">
               <label>课程</label>
               <div class="data">
                   <div class="list" v-if='bagType==1?true:false'>
                        <div class="course-item" v-for="(item,index) in courseList" :key="index">
                           <p>{{item.title}}</p>
                           <i class="el-icon-circle-close" @click="delItem(index)"></i>
                        </div>
                   </div>
                   <div class="list" v-if='bagType==3?true:false'>
                        <div class="course-item" v-for="(item,index) in courseListMoney" :key="index">
                           <p>{{item.title}}</p>
                           <i class="el-icon-circle-close" @click="delItem(index)"></i>
                        </div>
                   </div>                   
                   <el-button type="text" @click="dialogShow">选择</el-button>
               </div>
           </div>
           <div class="item limit-date clearfix" v-show="bagType==1">
               <label>礼包有效期</label>
               <div class="data">
                   <el-input maxlength="3" v-model="giftDate"></el-input>
                </div>
           </div>
           <div class="item link clearfix" v-show="bagType==2">
               <label>APP链接地址</label>
               <div class="data">
                   <el-input placeholder="链接地址要包含http或https" v-model="linkUrl"></el-input>
                </div>
           </div>
           <div class="item link clearfix" v-show="bagType==2">
               <label>M站链接地址</label>
               <div class="data">
                   <el-input placeholder="链接地址要包含http或https" v-model="mstationLinkUrl"></el-input>
                </div>
           </div>           
           <div class="item bgd clearfix">
               <label>背景图</label>
               <div class="data">
                   <div class="img-box" @click="chooseFile" v-loading="imgLoading">
                       <img :src="picture" v-if="picture.length>0"/>
                       <i class="el-icon-plus" v-else></i>
                   </div>
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
                        <div style='font-size:14px;'>{{item.sellingPrice||0}}币</div>
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
const imgSize = [
    {width:589,height:908,number:3},
    {width:589,height:759,number:2},
    {width:589,height:610,number:1},
]
export default {
    data() {
        return {
            flag:'add',
            id:'',
            giftType:'',
            titleList:[
                {
                    name:'活动',
                    pathInfo:'/activityObjList'
                },
                {
                    name:'国学大礼包',
                    pathInfo:''
                }               
            ],
            giftName:'',
            bagType:1,
            bagTypeArr:[
                {label:'赠送课程',value:1},{label:'跳转链接',value:2},{label:'购买课程',value:3}
            ],
            courseList:[],
            courseListMoney:[],
            giftDate:'',
            linkUrl:'',
            mstationLinkUrl:'',
            picture:'',
            imgLoading:false,
            pageNo:1,
            pageSize:20,
            total:10,
            isLastPage:false,
            editDialogVisible:false,
            searchKey:'',
            oldSearchKey:'',
            searchFlag:false,
            editDialogList:[],//弹窗list
            editDialogLoading:false,
            dialogArr:[],//多选集合
            courseCheckList:[],//多选集合，选择一次push一次，
            EditDialogMaxNum:3,
            width:'',
            height:'',
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
        };
    },
    metaInfo: {
        title: "国学大礼包"
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
        }
    },
    created() {
        if(this.$route.query){
            this.giftType = this.$route.query.type;
            if(this.$route.query.id){
                let {id,name,course,pic,date,linkUrl,bagType,mstationLinkUrl} = this.$route.query;
                this.id = id;
                this.giftName = name;
                // this.courseList = JSON.parse(course);
                this.giftDate = date;
                this.picture = pic;
                this.dialogArr = JSON.parse(course).map(item=>item.id);
                this.courseCheckList = JSON.parse(course);
                this.bagType = bagType;
                if(bagType==1){
                    this.courseList = JSON.parse(course);
                }
                if(bagType==3){
                    this.courseListMoney = JSON.parse(course);
                }
                this.linkUrl = linkUrl;
                this.mstationLinkUrl = mstationLinkUrl;
                this.flag = 'edit'
                let image = new Image();
                image.onload = ()=>{
                    this.width = image.width;
                    this.height = image.height;
                }
                image.src= pic;
            }else{
                this.flag = 'add'
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
            // if(fileData.size>200*1024){
            //     this.$message.error("图片不能大于200KB");
            //     return;
            // }
            let reader = new FileReader();
            reader.onload = e=>{
                let data = e.target.result;
                let image = new Image();
                image.onload = ()=>{
                    this.width = image.width;
                    this.height = image.height;
                    this.imgLoading = true;
                    let params = new FormData();
                    params.append('file',fileData)
                    let config = {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                    this.$http.post(this.$server.actionImgOrvideo,params,config).then(res=>{
                        this.imgLoading = false;
                        if(res.status==200){
                            this.picture = res.content.resourceUrl
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
         * 获取课程列表
         */
        getCourseList(){
            this.editDialogLoading = true;
            this.isLastPage = false;
            let params = {
                name:this.oldSearchKey,
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                type:this.giftType,
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
            // this.EditDialogMaxNum
            if(this.bagType==3){
                this.EditDialogMaxNum = 1;
                this.dialogArr = this.courseListMoney.map(item=>item.id);
            }
           if(this.bagType==1){
                this.EditDialogMaxNum = 3;
                this.dialogArr = this.courseList.map(item=>item.id);
            }            
            this.editDialogList.splice(0,this.editDialogList.length)
            this.editDialogVisible = true;
            // this.dialogArr = this.courseList.map(item=>item.id);
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
            if(this.bagType==3){
                this.courseListMoney.splice(0, this.courseListMoney.length);
            }
           if(this.bagType==1){
                this.courseList.splice(0, this.courseList.length);
            }
            this.courseCheckList.forEach(item=>{
                let obj = this.dialogArr.find(id=>id==item.id);
                if(obj){

                    if(this.bagType==3){
                        this.courseListMoney.push({
                            id:item.id,
                            title:item.title
                        })                        
                    }
                    if(this.bagType==1){
                        this.courseList.push({
                            id:item.id,
                            title:item.title
                        })                        
                    }                    
                }
            })
            this.editDialogVisible = false;
        },
        delItem(index){
            
            if(this.bagType==3){  
                this.courseListMoney.splice(index,1);                       
            }
            if(this.bagType==1){
                this.courseList.splice(index,1);                        
            }            
        },
        save(){
            var self = this;
            if(this.giftName==''){
                this.$message.error('请输入礼包名称');
                return false;
            }
            if(!regExp.exceptSpecialChar.test(this.giftName)){
                this.$message.error('只能输入字母、数字、汉字及其组合');
                return false;
            }
            if(this.bagType==1){
                if(this.courseList.length==0){
                    this.$message.error('请选择课程');
                    return false;
                }
                if(this.giftDate==''){
                    this.$message.error('请输入有效期天数');
                    return false;
                }
                if(!regExp.onlyNumber.test(this.giftDate)||(this.giftDate>1000||this.giftDate<1)){
                    this.$message.error('只能输入1-999的整数');
                    return false;
                }
                if(this.picture.length==0){
                    this.$message.error('请上传活动背景图');
                    return false;
                }
                let temp = imgSize.find(item=>item.width==this.width&&item.height==this.height);
                if(temp){
                    if(this.courseList.length!=temp.number){
                        let msg = temp.number==3?`该背景图内容至少有${temp.number}个课程`:`该背景图内容只能有${temp.number}个课程`;
                        this.$message.error(msg);
                        return false;
                    }
                }
            }else if(this.bagType==2){
                let regExp = /^(http|https)\:\/\/.*?/
                if(!regExp.test(this.linkUrl)){
                    this.$message.error('请输入有效的链接地址');
                    return false;
                }
                if(!regExp.test(this.mstationLinkUrl)){
                    this.$message.error('请输入有效的链接地址');
                    return false;
                }                
                if(!(this.width==589&&this.height==610)){
                    this.$message.error('请上传589*610的背景图');
                    return false;
                }
            }else{
                if(!(this.width==589&&this.height==610)){
                    this.$message.error('请上传589*610的背景图');
                    return false;
                }                
            }

            let query = {
                giftName:this.giftName,
                giftType:this.giftType,
                picture:this.picture,
                bagType:this.bagType
            }
            if(this.bagType==1){
                query.giftDate = this.giftDate
                query.courseIdStr = this.courseList.map(item=>item.id).join(',')
            }else if(this.bagType==3){
                query.courseIdStr = this.courseListMoney.map(item=>item.id).join(',')
            }else{
                query.linkUrl = this.linkUrl;
                query.mstationLinkUrl = this.mstationLinkUrl;
            }
            let loadingInstance = this.$loading({
                target:document.querySelector('.gift-update-wrap')
            });
            if(this.flag=='add'){
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;                 
                    this.$http.post(this.$server.addGiftBag,query).then(res=>{
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
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;                   
                    this.$http.post(`${this.$server.editGift}/${this.id}`,query).then(res=>{
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
    .gift-update-wrap{
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
                    margin:0 0 10px 0;
                    position: relative;
                    padding: 0 10px;
                    border-radius: 3px;
                    border:1px solid #dfdfdf;
                    width: 305px;
                    line-height: 40px;
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
