<template>
    <div class="module-edit banner">
        <div class="module-edit-header clearfix">
            <p class="title" ref="title">banner设置</p>
            <el-button v-if="($authJudge('goodsthings:goodspage:save')&&settingType=='1')||$authJudge('homeset:appletadult:savedata')&&settingType=='3'" type="primary" size="small" @click="saveData">保存</el-button>
        </div>
        <div class="module-edit-body">
            <div class="clearfix styles">
                <label>样式</label>
                <el-select v-model="style" size="small">
                    <el-option
                        v-for="item in styleOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <p class="tip">支持PNG、JPEG</p>
            </div>
            <div class="number">
                <p>展示数量</p>
                <p>{{curEditData.length}}</p>
                <el-tooltip class="item" effect="dark" content="该样式最多可以添加10个" placement="right">
                    <i class="question el-icon-question"></i>
                </el-tooltip>
            </div>
            <div class="edit-list">
                <div class="edit-item" v-for="(item,index) in curEditData" :key="index">
                    <div class="top clearfix">
                        <div class="img-file-box" @click="uploadFile(index)">
                            <input type="file" name="file" class="file-upload" ref="uploadInput" @change="getFile($event,index)" @click="emptyFile($event)"/>
                            <div class="img-file">
                                <img :src="item.imgUrl" />
                            </div>
                            <p class="des">修改</p>
                        </div>
                        <div class="text-box">
                            <!-- <div class="banner-title">
                                <label>名称</label>
                                <el-input clearable size="medium" v-model="item.title" ref="input" maxlength="10"></el-input>
                            </div> -->
                            <div class="banner-type">
                                <div class="type1">
                                    <label>商品</label>
                                    <el-button type="primary" size="medium" @click="DialogShow(item)">选择商品</el-button>
                                </div>
                                <div class="name">
                                <p class="textEllipsis">{{item.goodsName}}</p></div>
                                <!-- <div class="type2" v-if="item.type=='2'">
                                    <label>资讯</label>
                                    <el-button type="primary" size="medium" @click="DialogShow(item)">选择资讯</el-button>
                                    <el-tooltip :content="item.infoName" placement="top-start">
                                        <p class="textEllipsis more-text">{{item.infoName}}</p>
                                    </el-tooltip>
                                </div>
                                <div class="type3" v-if="item.type=='3'">
                                    <label>链接</label>
                                    <el-input clearable size="medium" placeholder="请输入链接地址http://" v-model="item.link" max="255"></el-input>
                                </div>
                                <div class="type4" v-if="item.type=='4'"></div> -->
                            </div>
                        </div>
                    </div>
                    <!-- <div class="bottom">
                        <el-radio-group v-model="item.type">
                            <el-radio :label="1">商品</el-radio>
                            <el-radio :label="2"  v-if="settingType==1">资讯</el-radio>
                            <el-radio :label="3">链接</el-radio>
                            <el-radio :label="4">无链接</el-radio>
                        </el-radio-group>
                    </div> -->
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
            <div class="add-btn"><button class="my-primary-btn" :class="curEditData.length>=10?'not-allow':''" @click="addBanner"><i class="el-icon-plus"></i><span>添加banner</span></button></div>
        </div>
        <el-dialog :custom-class="'edit-dialog'" :visible.sync="editDialogVisible" :width="'500px'" :show-close="false">
            <el-select v-model="classifyId" size="medium" class="classify-select">
                <el-option
                    v-for="item in classifyData"
                    :key="item.id"
                    :label="item.classifyName"
                    :value="item.id">
                </el-option>
            </el-select>
            <div class="search-box">
                <el-input placeholder="请输入商品名称查询" size="medium" clearable prefix-icon="el-icon-search" v-model="searchKey" maxlength="10" @keypress.native="pressEvent($event)"></el-input>
                <el-button type="primary" size="medium" @click="search">搜索</el-button>
            </div>
            <div class="list" ref="scrollBox">
                <el-radio-group v-model="editDialogVal">
                    <div class="item nameTextEllipsis" v-for="(item,index) in editDialogList" :key="index">
                        <el-radio :label="item.id" class="list-item-radio">
                            <span class="name textEllipsis">{{item.goodsName}}</span>
                        </el-radio>
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
import qs from 'qs'
const regExp = {
    'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
    'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
    'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g //特殊字符(除了数字、字母、汉字) 
}
const repSign = s=>{
	s = s.replace(/([\u4E00-\u9FA5]|^|\n|\r)([\，\。\？\！])(?=[\u4E00-\u9FA5]|$|\n|\r)/g,function(u,v,w,x) {
		sign = {
			'，':',',
			'。':'.',
			'？':'?',
			'！':'!'
		};
		return sign[w] ? v + sign[w] : u;
	});
	return s;
}
export default {
    data(){
        return{
            cloumnTitle:'',
            homeCloumnId:'',
            moduleId:'',
            styleOption:[
                {label:'样式一 690*266',value:'1'},
                // {label:'样式二 690*326',value:'2'},
            ],//样式
            style:'1',//样式值
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
            classifyId:'-1',
            classifyData:[]
        }
    },
    props:['settingType'],
    computed:{
        data(){
            return this.$store.state.goodsPage.editData.find(item=>item.active==true).data;
        },
        /**
         * 模块总数据
         */
        moduleChildData(){
            return this.$store.state.goodsPage.moduleChildData;
        },
        /**
         * banner总数据
         */
        editData(){
            let obj = this.data.find(item=>item.isFocus==true);
            if(obj){
                let localId = obj.localId;
                let temp = this.moduleChildData.find(item=>item.localId==localId);
                return temp;
            }else{
                return []
            }
        },
        /**
         * 当前banner数据(具体到样式下)
         */
        curEditData(){
            if(this.editData.data&&this.editData.data.length>0){
                let temp = this.editData.data.find(item=>item.active==true)
                return temp?temp.bannerData:[];
            }
            else{
                return [];
            }
        },
    },
    watch:{
        style(cur,old){
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
        searchKey(cur,old){
            this.searchFlag = false;
        }
    },
    created(){
        // setTimeout(()=>{
        //     this.homeCloumnId = this.$store.state.goodsPage.editData.find(item=>item.active==true).tabId;
        //     this.cloumnTitle = this.$store.state.goodsPage.editData.find(item=>item.active==true).tabName;
        //     this.homeCloumnId = this.homeCloumnId<0?'':this.homeCloumnId
        // },1)
    },
    mounted(){
        this.initData()
        this.getGoodsClassifyList()
    },
    methods:{
        ...mapActions(['setCloumnId']),
        initData(){
            let {id} = this.editData;
            this.moduleId = id!=-1?id:''
            if(this.editData.data.length==0){
                if(id==-1){
                    this.style = '1';
                    let editChildData = [
                        {styleType:'1',bannerData:[],active:true},
                        {styleType:'2',bannerData:[],active:false}
                    ]
                    this.editData.data = editChildData;
                }else{
                    this.goodsSubModuleInfoList(id)
                }
            }else{
                let obj = this.editData.data.find(item=>item.active==true)
                this.style = obj.styleType;
                this.editData.compareFlag = true;
            }
        },
        /**
         * 查询商品分类列表
         */
        getGoodsClassifyList(){
            let query = {
                params:{
                    
                }
            }
            this.$http.get(this.$server.getGoodsClassifyList,query).then(res=>{
                if(res.status==200){
                    this.classifyData = res.content;
                    this.classifyData.unshift({
                        classifyName:'好物列表',
                        id:'-1'
                    })
                }
            })
        },
        /**
         * 查询app首页子模板数据列表
         */
        goodsSubModuleInfoList(id){
            let loadingInstance = this.$loading({
                target:document.querySelector('.module-edit')
            });
            this.$http.get(`${this.$server.goodsSubModuleInfoList}/${id}`).then(res=>{
                loadingInstance.close()
                if(res.status==200){
                    if(this.moduleId!=this.editData.id) return;//防止选择模块过快，造成数据缓存有误
                    this.style = String(res.content.style);
                    let bannerData = res.content.goodsPageDetailRecordList.map(item=>{
                        return {
                            goodsName:item.goodsName,
                            id:item.goodsId,
                            imgUrl:item.backgroundUrl,
                        }
                    })
                    let editChildData = [
                        {styleType:'1',bannerData:res.content.style==1?bannerData:[],active:res.content.style==1?true:false},
                        {styleType:'2',bannerData:res.content.style==2?bannerData:[],active:res.content.style==2?true:false}
                    ]
                    this.editData.data = editChildData;
                    this.editData.initData = true;
                    this.editData.saveDataFlag = true;
                }
            }).finally(()=>{
                loadingInstance.close()
            })
        },
        /**
         * 弹出弹窗
         */
        DialogShow(item){
            this.editDialogVisible = true;
            this.tempObj = item;
            this.editDialogList.splice(0,this.editDialogList.length)
            this.getGoodsList();
            this.editDialogVal = Number(item.id)
        },
        /**
         * 获取商品
         */
        getGoodsList(item){
            this.loading = true;
            this.isLastPage = false;
            let params = {
                goodsName:this.oldSearchKey,
                classifyId:this.classifyId==-1?'':this.classifyId,
                status:1,
                pageNo:this.pageNo,
                pageSize:this.pageSize,
            }
            if(this.searchFlag){
                params.goodsName = this.searchKey
                this.oldSearchKey = this.searchKey
            }
            this.$http.get(this.$server.getGoodsList,{params}).then(res=>{
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
                this.getGoodsList()
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
                this.getGoodsList()
            })
        },
        /**
         * 弹出框确定事件
         */
        dialogSure(){
            let obj = this.editDialogList.find(item=>item.id==this.editDialogVal);
            this.tempObj.goodsName = obj.goodsName;
            this.tempObj.id = obj.id;
            this.editDialogVisible = false;
        },
        /**
         * 添加banner数据
         */
        addBanner(){
            if(this.curEditData.length>=10) return false;
            this.curEditData.push({
                goodsName:'',
                id:'',
                imgUrl:'',
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
                this.$message.error("图片格式有误，请上传JPEG或PNG格式");
                return;
            }
            let reader = new FileReader();
            reader.onload = e=>{
                let data = e.target.result;
                let image = new Image();
                image.onload = ()=>{
                    let width = image.width;
                    let height = image.height;
                    if(this.style=='1'){
                        if(width!=690||height!=266){
                            this.$message.error('请上传690*266的图片');
                            return;
                        }
                    }else if(this.style=='2'){
                        if(width!=690||height!=326){
                            this.$message.error('请上传690*326的图片');
                            return;
                        }
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
            let flag = this.curEditData.some(item=>{
                return item.imgUrl==''||item.id==''
            })
            if(this.curEditData.length==0||flag){
                this.$alert('您还有未添加的数据，不能保存', '提示', {
                    confirmButtonText: '关闭',
                    center:true,
                    callback: action => {}
                });
                return;
            }
            else{
                let query = {
                    id:this.moduleId,
                    moduleName:'',
                    subModuleType:1,
                    style:this.style,
                    classifyShow:2,
                    showNum:this.curEditData.length,
                }
                this.curEditData.forEach((item,index)=>{
                    query['goodsPageDetailRecordList['+index+'].title'] = item.goodsName;
                    query['goodsPageDetailRecordList['+index+'].goodsId'] = item.id
                    query['goodsPageDetailRecordList['+index+'].backgroundUrl'] = item.imgUrl
                    query['goodsPageDetailRecordList['+index+'].sort'] = item.sort
                })
                if(query.id==-1){
                    delete query.id
                }
                let loadingInstance = this.$loading({
                    target:document.querySelector('.module-edit')
                });
                this.$http.post(this.$server.goodsSaveSubModule,query,{headers: {'Content-Type':'application/x-www-form-urlencoded'}}).then(res=>{
                    loadingInstance.close();
                    if(res.status==200){
                        let temp = this.data.find(item=>item.localId == this.editData.localId)
                        temp.id = res.content.subModuleId;
                        this.setCloumnId(res.content.homeCloumnId);
                        this.moduleId = res.content.subModuleId;
                        this.editData.data.find(item=>item.active == false).bannerData = []
                        this.editData.inEdit = false;
                        this.editData.saveDataFlag = true;
                        this.$message({
                            message: '保存成功！',
                            type: 'success'
                        });
                    }
                }).finally(()=>{
                    loadingInstance.close()
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
            .styles{
                label{
                    width: 56px;
                    text-align: right;
                    display: inline-block;
                    vertical-align: middle;
                }
            }
            .el-select{
                margin:0 5px;
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
                display: inline-block;
                vertical-align: middle;
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
                                .name{
                                    display: inline-block!important;
                                    vertical-align: middle!important;
                                    cursor: default;
                                    margin: 10px 0;
                                    width:100%;
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
                        // visibility: hidden;
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
            .classify-select{
                position: absolute;
                top:30px;
                left:20px;
            }
            .search-box{
                margin-top:20px;
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

