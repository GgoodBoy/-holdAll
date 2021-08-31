<template>
    <div class="app-config-info">
        <el-row class="colorstylelist">
            <el-col :span="10" style="position: relative;">
                <el-upload
                    class="avatar-uploader"
                    :action="actiosService"
                    :headers="myHeaders"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="(file)=>{return beforeAvatarUpload(file,imgSize)}">
                    <div v-if="imageUrl" v-loading="loading">
                        <img :src="imageUrl" class="avatar">
                    </div>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div class="Mask">修改</div>
            </el-col>
            <el-col :span="14">
                <div v-if="typeInfo!=='classify'">
                    <div class="input-suffix clearfix">
                        <!-- @blur="checkevenTitle" -->
                        标  题
                        <el-input placeholder="请输入内容" :title="title" maxlength="10" clearable  v-model="title"></el-input>
                    </div>
                    <div class="input-suffix clearfix" v-show="textVal?true:false">
                        {{textVal}}
                        <el-input v-model="values" :title="values" :placeholder="placeholderInfo" clearable></el-input>
                    </div>               
                </div>
                <div v-else> 
                    <div class="input-suffix clearfix" v-show="textVal?true:false">
                       <el-row>
                           <el-col v-if="typeInfo=='classify'" :span="8" class="lRight-r">一级分类</el-col>
                           <el-col class="input-suffix-select" v-if="typeInfo=='classify'" :span="16">
                                <el-select v-model="valueTypeData" placeholder="请选择" @change="valChange">
                                    <el-option
                                    v-for="item in classifyList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                           </el-col>                            
                           <el-col v-if="typeInfo!='classify'" :span="8">分类ID</el-col>
                           <!-- <el-col v-if="typeInfo=='classify'" :span="8" class="lRight-r">二级分类</el-col> -->
                           <el-col v-if="typeInfo!='classify'" :span="16">
                               <el-input v-model="values" :title="values" maxlength="10" placeholder="请输入内容" clearable></el-input>
                           </el-col>
                           <!-- <el-col class="input-suffix-select" v-if="typeInfo=='classify'" :span="16">
                               
                                <el-select v-model="valueId" :disabled='Number(valueTypeData)>0?false:true' placeholder="请选择" @visible-change="getChild">
                                    <el-option
                                    v-for="(item,index) in secondClassifyList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                           </el-col>                            -->
                        </el-row>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row v-if="typeInfo==='banner'">
            <el-radio-group v-model="radio" @change="changeHandler">
                <el-col :span="6"> 
                    <el-radio label="1">活动</el-radio>
                </el-col>
                <el-col :span="6"> 
                    <el-radio label="2">课程</el-radio>
                </el-col>
                <el-col :span="6"> 
                    <el-radio label="3">链接</el-radio>
                </el-col>
                <el-col :span="6"> 
                    <el-radio label="4">无连接</el-radio>
                </el-col>
            </el-radio-group>
        </el-row>
        <el-row v-if="typeInfo==='advertising'">
            <el-radio-group v-model="radio" @change="changeHandler">
                <el-col :span="6"> 
                    <el-radio  label="1">活动</el-radio>
                </el-col>
                <el-col :span="6"> 
                    <el-radio label="2">课程</el-radio>
                </el-col>
                <el-col :span="6"> 
                    <el-radio label="3">链接</el-radio>
                </el-col>
                <el-col :span="6"> 
                    <el-radio label="4">无连接</el-radio>
                </el-col> 
            </el-radio-group>
        </el-row>        
        <i class="el-icon-error removeobj" v-if="numberId==message.id" @click="removes"></i>
        <!-- v-if="numberId==message.id" -->
        <div class="bottonTopStyle" :class="(typeInfo==='advertising'||typeInfo==='banner')?'bottonTopStyleOne':'bottonTopStyleTwo'" v-if="numberId==message.id&&valueTypeData!=''&&valueId!=''&&clasifyBool">
            <div class="topStyle"><i class="el-icon-arrow-up" @click="topStyleEven"></i></div>
            <div class="bottonStyle"><i class="el-icon-arrow-down" @click="bottonStyleEven"></i></div>
        </div>
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import eventAction from '../../../views/lEventAtion';
let actions = new eventAction()
/**
 * ljm
 * 配置组件
 * 配置活动，链接，
 * 范围：bannner,通栏图
 */
let infos =     {
                "type": 1, //类型： 1活动 2课程 3链接 4无链接
                "content": "ID123456", //内容，可以是：活动id、链接、课程id，跟type对应	,
                "title":"课程1",
                "picUrl": "", //banner图链接
                "soleId":new Date().getTime()
                };
export default {
    data() {
        return {
            myHeaders: {token: getToken()},
            imageUrl:"",
            radio:"1",
            textVal:"活 动",
            values:"",
            title:"",
            typeInfo:'',
            solidId:'',
            loading:false,
            optionsId:[],
            secondClassifyList:[],
            valueId:'',
            classifyname:'',
            placeholderInfo:"请输入内容",
            indexNum:0,
            createdBool:false,
            imgSize:[],
            valueTypeData:'',
            optionsType:[{
                value:2,
                name:'标签',
                id:2                
            },{
                value:1,
                name:'分类',
                id:1                
            }],
            clasifyBool:false
        };
    },
    props: ['message','type','numberId','homeType','pcType','classifyList'],    
    computed: {
        actiosService(){
            return  this.$server.actionImgOrvideo;
        }
    },
    created() {
        this.updateInfo(this.message);
    },    
    watch: {
        message:function(curVal,oldVal){
            this.updateInfo(curVal);
        },
        values:function(curVal,oldVal){
            let objs = {};
            objs.changeVal=curVal
            objs.id =this.solidId
            objs.num="2"
            if(curVal!==oldVal){
                this.$store.commit("appConfig/dataChangeEven",objs)
            }
        },
        title:function(curVal,oldVal){
            let objs = {};
            objs.changeTitle=curVal
            objs.id =this.solidId
            objs.num="3"
            if(curVal!==oldVal){
                this.$store.commit("appConfig/dataChangeEven",objs)
            }
        },
        imageUrl:function(curVal,oldVal){
            let objs = {};
            objs.changeImg=curVal
            objs.id =this.solidId
            objs.num="6"
            if(curVal!==oldVal){
                this.$store.commit("appConfig/dataChangeEven",objs)
            }
        },
        classifyname:function(curVal,oldVal){
            let objs = {};
            objs.id =this.solidId
            objs.num="4"
            if(curVal!==oldVal){
                objs.name=curVal;
                this.$store.commit("appConfig/dataChangeEven",objs)
            }          
        },      
    },
    methods: {
        selectValueTypeEven:function(id){
            var selectType = id;
            var datalist = this.$store.state.appConfig.cuouseLabelObj;
            console.log(datalist)
            switch (selectType) {
                case 2:
                    //标签
                    this.optionsId = datalist.selectListLabel;
                    break;
                case 1:
                    //分类
                   this.optionsId = datalist.selectList;
                    break;                            
                default:
                    break;
            }            

        },
        getChild(visible){
            if(visible){
                let query = {
                params:{
                        id:this.valueTypeData
                    }
                }
                this.$http.get(this.$server.getCategoryTwoList,query).then(res=>{
                    if(res.status==200){
                        this.secondClassifyList = res.content.map((item)=>{
                            return {
                                label:item.name,
                                value:item.id
                            }
                        })
                    }
                })
            }
        },
        valChange(){
            this.updateData(this.message)
        },
        updateData(){
            let objs = {};        
            let type = 1;  
            let id = this.valueTypeData;
            for (const iterator of this.classifyList) {
                if(iterator.value==id){
                    objs.classifyId = id;
                    objs.name=iterator.label;
                    objs.childrenClassifyId = this.valueId||''
                    objs.type = type;
                    break;
                }
            }
            objs.num="5"  
            objs.id =this.solidId
            this.$store.commit("appConfig/dataChangeEven",objs)
        },
        selectValueId:function(id,type){
            var bools = false;
            let objs = {};
            objs.id =this.solidId
            objs.num="5"            
            var pageItemList = this.$store.state.appConfig.alldata;
            for (const iterator of pageItemList) {
                if(iterator.moduleType == "classify"){
                    for (const iterator1 of iterator.list) {
                            if(iterator1.classifyId==id&&iterator1.type==type){
                                bools = true;
                                break;                                
                            }
                    }
                    break;
                } 
            } 
            if(bools){
                this.valueId ='';
                this.$message.error(type==1?'分类不能重复选择！':'标签不能重复选择！');
            }else{
                if(this.optionsId.length>1){
                    for (const iterator of this.optionsId) {
                        if(iterator.id==id){
                            objs.classifyId=id;
                            objs.name=iterator.name;
                            objs.type = type;
                            break;
                        }
                    }
                }else{
                    objs.classifyId=id;
                }
                this.$store.commit("appConfig/dataChangeEven",objs)
            }           
        },        
        changeHandler(curVal){
            let objs = {};
            if(this.indexNum!==0){
                switch (curVal) {
                    case "1":
                        this.textVal = "活动id"
                        this.values = '';
                        this.placeholderInfo = "请输入活动id";
                        break;
                    case "2":
                        this.textVal = "课程id"
                        this.values = '';
                        this.placeholderInfo = "请输入课程id";                
                        break;
                    case "3":
                        this.textVal = "链接"
                        this.values = '';
                        this.placeholderInfo = "https://"; 
                        break;                                                                           
                    default:
                        this.textVal = null
                        break;
                }
            }
            objs.changeType=curVal
            objs.id =this.solidId
            objs.num="1"
            this.indexNum = this.indexNum+1; 
            // if(curVal!==oldVal){
            this.$store.commit("appConfig/dataChangeEven",objs)
            // }               
        },
        updateInfo(data){
            var self = this;
            this.typeInfo = this.type;
            // this.imageUrl = this.message.picUrl
            // this.solidId = this.message.id;
            this.imageUrl = data.picUrl
            this.solidId = data.id;
            switch (this.typeInfo) {
                        case "banner":                  
                            this.radio = this.message.type.toString()
                            this.values = this.message.content
                            this.title = this.message.title;
                            // this.imgSize = [710,266];
                            // this.imgSize = (this.homeType==1||this.homeType==2)?[710,266]:[1920,687];
                            this.imgSize = (this.homeType==1||this.homeType==2)?[710,266]:[752,290];
                            break;
                        case "columnsCourse":
                            this.imgSize = (this.homeType==1||this.homeType==2)?[710,260]:[1200,116];
                            this.title = this.message.title;
                            this.values = this.message.content;
                            this.radio = "2";
                            break;
                        case "classify":
                            this.imgSize = [108,108];
                            // var selectType = this.message.type;
                            var selectType = data.type;
                            var urls = '';
                            this.valueTypeData = data.classifyId
                            this.valueId = data.isOneLevel?'':data.childrenClassifyId
                            if(data.levelTwoName!=''){
                                this.secondClassifyList = [{
                                    value:data.childrenClassifyId,
                                    label:data.levelTwoName
                                }]
                            }
                            // if(selectType!=''&&selectType!=undefined){
                            //     this.optionsId = selectType==2?this.$store.state.appConfig.cuouseLabelObj.selectListLabel:this.$store.state.appConfig.cuouseLabelObj.selectList;
                            //     this.valueId = this.message.classifyId;
                            //     for (const iterator of this.optionsId) {
                            //         if(this.valueId==iterator.id){
                            //             this.classifyname =iterator.name;
                            //         }
                            //     }
                            // }else{
                            //     this.optionsId =[];
                            //     this.valueId = '';
                            // }                            
                            break;
                        case "advertising":  
                            this.imgSize = (this.homeType==1||this.homeType==2)?[710,210]:[1200,116];   
                            this.title = this.message.title
                            this.values = this.message.content    
                            this.radio = this.message.type.toString()            
                            break;
                        default:
                            break;
                    } 
                    switch (this.radio) {
                        case "1":
                            this.textVal = "活 动 id";
                            this.indexNum = this.radio;
                            break;
                        case "2":
                            this.textVal = "课 程 id";
                            this.indexNum = this.radio;                  
                            break;
                        case "3":
                            this.textVal = "链 接";
                            this.indexNum = this.radio;
                            break;                                                                           
                        default:
                            this.indexNum = this.radio;
                            this.textVal = null
                            break;
                    }           
        },
        //向上移动；
        topStyleEven(){
            console.log("上");
            var parmes = {
                id:this.numberId,
                type:1
            };
            this.$emit("impressTopData",parmes);
        },
        bottonStyleEven(){
            console.log("下");
            var parmes = {
                id:this.numberId,
                type:2
            };
            this.$emit("impressTopData",parmes);
        },
        //上传banner图；
        handleAvatarSuccess(res, file) {
            this.loading = false;
            this.imageUrl = res.content.resourceUrl;
        },
        //上传图片前的验证；
        beforeAvatarUpload(file,size) {
            var self = this;
            this.loading = true;
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.loading = false;
                this.$message.error('上传头像图片只能是 JPG,JPEG,PNG格式!');
            }
            if (!isLt2M) {
                this.loading = false;
                this.$message.error('上传头像图片最大为2M!');
             }
             if(self.typeInfo=="banner"||self.typeInfo=="classify"||self.typeInfo=="advertising"||self.typeInfo=="columnsCourse"){
                const isSize = new Promise(function(resolve, reject) {
                    let width = size[0];
                    let height = size[1];
                    let _URL = window.URL || window.webkitURL;
                    let img = new Image();
                    img.onload = function() {
                        let valid = img.width == width && img.height == height;
                        valid ? resolve() : reject();
                    }
                    img.src = _URL.createObjectURL(file);
                }).then(() => {
                    return file;
                }, () => {
                    // this.fileList[index].loading= false;
                    this.loading = false;
                    this.$message.error('上传的图片必须是等于'+size[0]+'*'+size[1]+'!');
                    return Promise.reject();
                });
                return isJPG && isLt2M && isSize;                 
             }else{
                return isJPG && isLt2M;
             }
            
        },
        removes(){
            let obj = {};
            let self = this;
            obj.removeBanner=function(object, objid, id) { 
                    let arrys = [];
                    for (const iterator of object) {
                        if(iterator.id==objid){
                            for (var value of iterator.list) {
                                if (value.id!==id) { 
                                    arrys.push(value)
                                }
                            }
                            iterator.list = arrys;
                            break;
                        }
                    }
                } 
            obj.soleid = this.message.id
            this.$store.commit("appConfig/removeAction",obj)
        }      
    },
    mounted(){}
}
</script>
<style>
.app-config-info{
    margin: 10px;
    padding: 5px;
    
    position: relative;
}
.app-config-info>.colorstylelist{
    background-color: #F5F5F5;
    padding: 6px 5px 0px 5px;
    margin-bottom: 5px;
}
.input-suffix .el-input__inner{
    height: 26px;
}
.input-suffix{
    line-height: 28px;
}
.input-suffix .el-input--suffix{
    width: 70%;
    margin-bottom: 5px;
    float: right;
}
.input-suffix .input-suffix-select .el-input--suffix{
    width: 100%;
}
.input-suffix .input-suffix-select .el-input--suffix .el-input__inner{
   height: 36px;
}
.avatar-uploader .el-upload {
    /* border: 1px dashed #d9d9d9; */
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 110px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .avatar {
    width: 110px;
    height: 60px;
    display: block;
  }
  /*
  删除按钮样式
  */
  .removeobj{
    position: absolute;
    font-size: 16px;
    top: -5px;
    color: #bbbbbb;
    right: -4px;
    cursor: pointer;
  }
  .Mask{
		pointer-events: none;
        width: 110px;
        height: 24px;
        position: absolute;
        bottom: 4px;
        border-radius: 2px;
        background-color:#000;
        opacity:0.3;
        color: #ffffff;
        text-align: center;
        line-height: 24px;
  }
  .app-config-info .bottonTopStyle{
    text-align: center;
    position: absolute;
    cursor: pointer;
    width: 20px;
    left:-10px;
    /* bottom: 30px; */
    font-weight: bold;
  }
  .bottonTopStyleOne{
    bottom: 40px;
  }
  .bottonTopStyleTwo{
    bottom: 25px;
  }  
  .app-config-info .bottonTopStyle .topStyle,.app-config-info .bottonTopStyle .bottonStyle{
    margin-bottom: 20px;
    color: brown;
    border: 1px solid brown;
    border-radius: 3px;
  }
</style>



