<template>
    <div class="module-edit classify-nav">
        <div class="module-edit-header clearfix">
            <p class="title" ref="title">分类导航</p>
            <el-button v-if="$authJudge('homeset:appadult:savedata')&&settingType=='1'" type="primary" size="small" @click="saveData">保存</el-button>
        </div>
        <div class="module-edit-body">
            <div>
                <span>样式</span>
                <el-select v-model="styleVal" placeholder="请选择" style="margin-left:15px;">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                
            </div>
            <p class="tip">尺寸:108*108    支持PNG、JPEG</p>
            <p class="tip">一级分类必选，二级分类可选</p>
            <div class="edit-list">
                <div class="edit-item clearfix" v-for="(item,index) in curEditData" :key="index">
                    <div class="img-box" @click="uploadFile(index)">
                        <input type="file" name="file" class="file-upload" ref="uploadInput" @change="getFile($event,index)" @click="emptyFile($event)"/>
                        <!-- <img :src="item.img"/> -->
                        <div class="img-file">
                            <img :src="item.img" />
                        </div>
                        <p>修改</p>
                    </div>
                    <div class="select-area">
                        <!-- <div class="type">
                            <label>类型</label>
                            <el-select v-model="item.type" size="small" placeholder="选择类型" @change="getType(item.type,index)">
                                <el-option
                                    v-for="option in typeOption"
                                    :key="option.value"
                                    :label="option.label"
                                    :value="option.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="name">
                            <label>名称</label>
                            <el-select v-model="item.targetId" size="small" placeholder="选择内容" clearable @change="getTargetId(item.targetId,index)">
                                <el-option
                                    v-for="option in item.curList"
                                    :key="option.value"
                                    :label="option.label"
                                    :value="option.value">
                                </el-option>
                            </el-select>
                        </div> -->
                        <div class="type">
                            <label>一级分类</label>
                            <el-select v-model="item.targetId" size="small" placeholder="选择一级分类" clearable @change="valChange(item)">
                                <el-option
                                    v-for="option in classifyList"
                                    :key="option.value"
                                    :label="option.label"
                                    :value="option.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="name">
                            <label>二级分类</label>
                            <el-select v-model="item.childrenClassifyId" :disabled="!item.targetId" size="small" placeholder="选择二级分类" clearable @visible-change="getChild($event,index)">
                                <el-option
                                    v-for="option in item.curList"
                                    :key="option.value"
                                    :label="option.label"
                                    :value="option.value">
                                </el-option>
                            </el-select>
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
            <div class="add-btn"><button class="my-primary-btn" @click="addClassify"><i class="el-icon-plus"></i><span>添加导航/分类图标</span></button></div>
        </div>
     </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
    data(){
        return{
            homeCloumnId:'',
            cloumnTitle:'',
            moduleId:'',
            typeOption:[
                {label:'分类',value:'7'},
                {label:'标签',value:'6'}
            ],
            curList:[],
            classifyList:[],
            classifyListFinish:false,
            labelList:[],
            labelListFinish:false,
            timer:null,
            loadingInstance:'',
            styleVal:'3',
            options:[
                {
                    value: '1',
                    label: '样式一 4个'
                },
                {
                    value: '2',
                    label: '样式二 5个'
                },
                {
                    value: '3',
                    label: '样式三 左右滑动'
                }
            ]
        }
    },
    props:['settingType'],
    computed:{
        adultHomeEditData(){
            return this.$store.state.homeConfig.adultHomeEditData.find(item=>item.active==true).data;;
        },
        /**
         * classify总数据
         */
        classifyEditData(){
            let obj = this.adultHomeEditData.find(item=>item.isFocus==true)
            if(obj){
                let localId = obj.localId;
                return this.$store.state.homeConfig.adultHomeModuleChildData.find(item=>item.localId==localId);
            }else{
                return []
            }
        },
        curEditData(){
            if(this.classifyEditData.data&&this.classifyEditData.data.length>0){
                let temp = this.classifyEditData.data.find(item=>item.active==true);
                return temp?temp.classifyNavData:[];
            }
            else{
                return [];
            }
        },
        moduleName(){
            return this.classifyEditData.name;
        }
    },
    watch:{
        curEditData:{
            handler(cur,old){
                if(this.classifyEditData.initData){
                    this.classifyEditData.inEdit = false;
                    delete this.classifyEditData.initData;
                }else{
                    if(this.classifyEditData.compareFlag){
                        let tempCur = JSON.stringify(cur);
                        let tempOld = JSON.stringify(old);
                        this.classifyEditData.inEdit = tempCur==tempOld && this.classifyEditData.saveDataFlag ? false:true
                        delete this.classifyEditData.compareFlag;
                    }else{
                        console.log('动了数据')
                        this.classifyEditData.inEdit = true;
                        this.classifyEditData.saveDataFlag = false;
                    }
                }
            },
            deep:true
        },
        styleVal(cur,old){
            let obj = this.classifyEditData.data.find(item=>item.styleType==cur);
            this.classifyEditData.data.forEach(item=>item.active=false)
            obj.active = true;
            this.classifyEditData.style = cur;
        },     
        moduleName(cur,old){
            console.log('动了数据')
            this.classifyEditData.inEdit = true;
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
        this.loadingInstance = this.$loading({
            target:document.querySelector('.module-edit')
        });
        this.getClassifyList()
        this.getLabelList()
        this.initData()
    },
    methods:{
        ...mapActions(['setHomeCloumnId']),
        initData(){
            let {id} = this.classifyEditData;
            this.moduleId = id;
            if(this.classifyEditData.data.length==0){
                if(id==-1){
                    this.styleVal = '1';
                    let classifyNavData = [
                        {styleType:'1',classifyNavData:[],active:true},
                        {styleType:'2',classifyNavData:[],active:false},
                        {styleType:'3',classifyNavData:[],active:false}
                    ]
                    this.classifyEditData.data = classifyNavData;
                    this.loadingInstance.close();
                }else{
                   this.timer = setInterval(()=>{
                        if(this.classifyListFinish&&this.labelListFinish){
                            this.getSubModuleInfoList(id)
                            clearInterval(this.timer);
                        }
                    },500)
                }
            }else{
                let obj = this.classifyEditData.data.find(item=>item.active==true)
                this.styleVal = obj.styleType;
                this.classifyEditData.compareFlag = true;
                if(this.loadingInstance!=''){
                    this.loadingInstance.close()
                }                
            }
            // if(this.classifyEditData.data.classifyNavData.length==0){
            //     if(id!=-1){
            //         this.timer = setInterval(()=>{
            //             if(this.classifyListFinish&&this.labelListFinish){
            //                 this.getSubModuleInfoList(id)
            //                 clearInterval(this.timer);
            //             }
            //         },500)
            //     }else{
            //         this.loadingInstance.close()
            //     }
            // }else{
            //     this.classifyEditData.compareFlag = true;
            //     if(this.loadingInstance!=''){
            //         this.loadingInstance.close()
            //     }
            // }
        },
        /**
         * 查询app首页子模板数据列表
         */
        getSubModuleInfoList(id){
            let url = this.$server.getSubModuleInfoList
            this.$http.get(`${url}/${id}`).then(res=>{
                if(res.status==200){
                    if(this.loadingInstance!=''){
                        this.loadingInstance.close()
                    }
                    if(this.moduleId!=this.classifyEditData.id) return;
                    this.styleVal = String(res.content.style);
                    // this.classifyEditData.data.classifyNavData.splice(0,this.classifyEditData.data.classifyNavData.length);
                    this.classifyEditData.data=[];
                    let classifyNavData = [];
                    res.content.ahprrList.forEach(item=>{
                        if(item.type=='6') return;

                        //
                        // this.classifyEditData.data.push({
                        //     targetId:item.isOneLevel?Number(item.targetId):Number(item.classifyParentId),
                        //     type:String(item.type),
                        //     img:item.imgUrl,
                        //     childrenClassifyId:item.isOneLevel?'':item.targetId,
                        //     curList:[
                        //         {
                        //             label:item.levelTwoName,
                        //             value:item.targetId
                        //         }
                        //     ],
                        //     httpStatus:false
                        // })
                        classifyNavData.push({
                            targetId:item.isOneLevel?Number(item.targetId):Number(item.classifyParentId),
                            type:String(item.type),
                            img:item.imgUrl,
                            childrenClassifyId:item.isOneLevel?'':item.targetId,
                            curList:[
                                {
                                    label:item.levelTwoName,
                                    value:item.targetId
                                }
                            ],
                            httpStatus:false
                        })                        
                    })
                    let editChildData = [
                        {styleType:'1',classifyNavData:res.content.style==1?classifyNavData:[],active:res.content.style==1?true:false},
                        {styleType:'2',classifyNavData:res.content.style==2?classifyNavData:[],active:res.content.style==2?true:false},
                        {styleType:'3',classifyNavData:res.content.style==3?classifyNavData:[],active:res.content.style==3?true:false}
                    ]
                    this.classifyEditData.data = editChildData;
                    this.classifyEditData.initData = true;
                    this.classifyEditData.saveDataFlag = true;
                }
            })
        },
        /**
         * 获取分类列表
         */
        getClassifyList(){
            let query = {
                params:{
                    type:1,
                    classifiesType:1
                }
            }
            this.$http.get(`${this.$server.getClassify}`,query).then(res=>{
                if(res.status==200){
                    this.classifyListFinish = true;
                    this.classifyList = res.content.map(item=>{
                        return {
                            label:item.name,
                            value:item.id
                        }
                    })
                }
            })
        },
        /**
         * 获取标签列表
         */
        getLabelList(){
            let params = {
                name:''
            }
            this.$http.get(`${this.$server.getLabelList}/1`,{params}).then(res=>{
                if(res.status==200){
                    this.labelListFinish = true;
                    this.labelList = res.content.map(item=>{
                        return {
                            label:item.name,
                            value:item.id
                        }
                    })
                }
            })
        },
        /**
         * 获取下拉类型 7分类，6标签
         */
        getType(type,index){
            let obj = this.curEditData[index].arr.find(item=>item.type==type);
            if(obj){
                this.curEditData[index].targetId = obj.value
            }else{
                this.curEditData[index].targetId = ''
            }
            if(type==7){
                this.curEditData[index].curList = [...this.classifyList]
            }else if(type==6){
                this.curEditData[index].curList = [...this.labelList]
            }
        },
        /**
         * 获取二级分类
         */
        getChild(visible,index){
            let id = this.curEditData[index].targetId;
            let httpStatus = this.curEditData[index].httpStatus;
            if(!visible||!id||httpStatus) return;
            let query = {
                params:{
                    id:this.curEditData[index].targetId
                }
            }
            this.$http.get(this.$server.getCategoryTwoList,query).then(res=>{
                if(res.status==200){
                    let curList = res.content.map((item)=>{
                        return {
                            label:item.name,
                            value:item.id
                        }
                    })
                    this.$set(this.curEditData[index],'curList',curList)
                    this.$set(this.curEditData[index],'httpStatus',true)
                }
            })
        },
        valChange(obj){
            obj.childrenClassifyId = ''
            obj.httpStatus = false
        },
        /**
         * 获取分类内容(targetId)
         */
        getTargetId(id,index){
            let type = this.curEditData[index].type;
            let obj = this.curEditData[index].arr.find(item=>item.type==type)
            if(obj){
                obj.value = id;
            }else{
                this.curEditData[index].arr.push({
                    type,value:id
                })
            }
        },
        /**
         * 添加导航分类/标签
         */
        addClassify(){
            this.curEditData.push({
                targetId:'',type:7,img:'',arr:[],curList:[],childrenClassifyId:'',httpStatus:false
            })
        },
        /**
         * 点击上传
         */
        uploadFile(index){
            this.$refs.uploadInput[index].click()
        },
        /**
         * 获取上传的文件
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
                    if(width!=108||height!=108){
                        this.$message.error('请上传108*108的图片');
                        return;
                    }
                    let params = new FormData();
                    params.append('file',fileData)
                    let config = {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                    this.$http.post(this.$server.actionImgOrvideo,params,config).then(res=>{
                        if(res.status==200){
                            this.curEditData[index].img = res.content.resourceUrl
                        }
                    })
                }
                image.src= data;
            };
            reader.readAsDataURL(fileData);
        },
        /**
         * 上传之前先清空value
         */
        emptyFile(e){
            e.target.value = ''
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
                return item.img == '' || String(item.targetId) == ''
            })
            if(flag){
                this.$alert('您还有未添加的数据，不能保存', '提示', {
                    confirmButtonText: '关闭',
                    center:true,
                    callback: action => {}
                });
                return;
            }
            let repeatFlag = false,repeatFlag1 = false;
            let arr = this.curEditData;
            for(let i in arr){
                let index = Number(i)+1;
                let tempArr = arr.slice(index,arr.length);
                let obj1 = tempArr.find(item=>(item.targetId==arr[i].targetId)&&(item.childrenClassifyId==''&&arr[i].childrenClassifyId==''&&item.childrenClassifyId==arr[i].childrenClassifyId))
                if(obj1){
                    repeatFlag1 = true;
                    break;
                }
                let obj = tempArr.find(item=>item.targetId&&arr[i].targetId&&(item.childrenClassifyId==arr[i].childrenClassifyId&&item.childrenClassifyId!=''&&arr[i].childrenClassifyId!=''))
                if(obj){
                    repeatFlag = true;
                    break;
                }
            }
            if(repeatFlag){
                this.$message.error('不允许添加相同名称的二级分类')
                return;
            }
            if(repeatFlag1){
                this.$message.error('不允许添加相同名称的一级分类')
                return;
            }
            let appHomeRelationRecordFormList = this.curEditData.map((item,index)=>{
                return {
                    type:item.type,
                    targetId:item.targetId,
                    imgUrl:item.img,
                    sort:index+1,
                    childrenClassifyId:item.childrenClassifyId
                }
            })
            let query = {
                id:this.moduleId,
                homeCloumnId:this.homeCloumnId,
                type:this.settingType,
                subModule:2,
                style:this.styleVal,
                styleImgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/abe7114c-c7ea-4ed4-99ed-04b37b31f4f2.png',
                num:this.curEditData.length,
                targetId:0,
            }
            if(this.homeCloumnId==''){
                query.cloumnTitle = this.cloumnTitle
            }
            appHomeRelationRecordFormList.forEach((item,index)=>{
                query['appHomeRelationRecordFormList['+index+'].type'] = item.type
                query['appHomeRelationRecordFormList['+index+'].targetId'] = item.targetId
                query['appHomeRelationRecordFormList['+index+'].imgUrl'] = item.imgUrl
                query['appHomeRelationRecordFormList['+index+'].sort'] = item.sort
                query['appHomeRelationRecordFormList['+index+'].childrenClassifyId'] = item.childrenClassifyId
            })
            let loadingInstance = this.$loading({
                target:document.querySelector('.module-edit')
            });
            let url = this.$server.saveSubModule
            this.$http.post(url,query,{headers: {'Content-Type':'application/x-www-form-urlencoded'}}).then(res=>{
                loadingInstance.close();
                if(res.status==200){
                    let temp = this.adultHomeEditData.find(item=>item.localId == this.classifyEditData.localId)
                    temp.id = res.content.subModuleId
                    this.setHomeCloumnId(res.content.homeCloumnId)
                    this.classifyEditData.inEdit = false;
                    this.classifyEditData.saveDataFlag = true;
                    this.$message({
                        message: '保存成功！',
                        type: 'success'
                    });
                }
            })
        }
    },
    beforeDestroy(){
        clearInterval(this.timer);
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
            .tip{
                color:#aaa;
            }
            .edit-list{
                margin:20px 0;
                .edit-item{
                    border:1px solid #dfdfdf;
                    padding: 10px;
                    margin:20px 0;
                    position: relative;
                    width: 96%;
                    font-size: 0;
                    .img-box{
                        height: 108px;
                        width: 108px;
                        overflow: hidden;
                        float: left;
                        margin-right: 40px;
                        cursor: pointer;
                        position: relative;
                        // img{
                        //     width: 100%;
                        //     height: 100%;
                        //     position: relative;
                        //     z-index: 1;
                        // }
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
                        input{
                            opacity: 0;
                        }
                        p{
                            line-height: 24px;
                            position: absolute;
                            bottom:0;
                            left: 0;
                            background: rgba(0,0,0,0.5);
                            z-index: 2;
                            color:#fff;
                            font-size: 14px;
                            width: 100%;
                            text-align: center;
                        }
                    }
                    .select-area{
                        .type{
                            margin:15px 0;
                        }
                        label{
                            margin-right: 10px;
                        }
                        label,.el-select{
                            display: inline-block;
                            vertical-align: middle;
                            font-size: 14px;
                        }
                    }
                    .btns{
                        .del-btn{
                            position: absolute;
                            right: -10px;
                            top:-10px;
                            font-size: 20px;
                            cursor: pointer;
                            // display:none;
                            i{
                                color:#bbb;
                            }
                        }
                        .sort-btn{
                            position: absolute;
                            width: 30px;
                            right: -30px;
                            top:33%;
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
            .add-btn{
                text-align: center;
                margin-top:40px;
                button{
                    padding: 20px;
                    i,span{
                        vertical-align: middle;
                        display: inline-block;
                        font-size: 16px;
                    }
                }
            }
        }
    }
</style>
