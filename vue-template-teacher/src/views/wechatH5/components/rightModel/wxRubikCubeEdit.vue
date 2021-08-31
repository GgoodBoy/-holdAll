<template>
    <div class="wRubikCubeEdit wModelEdit">
        <div class="wRubikCube-head">
            <div class="edit1">
                <div>魔方设置</div>
                <el-button size="small" type="primary"  @click="seave">保存</el-button>
            </div>
            <div class="edit2">
                <div>样式</div>
                <div>
                    <div class="style1" :style="{border:(styleIndex==1?'1px solid #66CCFF':'none')}"  @click="selectType(1)"></div>
                    <div class="style2" :style="{border:(styleIndex==2?'1px solid #66CCFF':'none')}"  @click="selectType(2)"></div>
                </div>
            </div>
        </div>
        <div class="wRubikCube-style-one">
            <div class="rubikCubeList" v-for="(item,index) in rubikCubeMoel.microPageRelationRecordList" :key="index">
                <div class="rubikCubeleft">
                    <el-upload
                        class="avatar-uploader"
                        :action="actiosService"
                        :show-file-list="false"
                        :headers="myHeaders"
                        :before-upload="(file)=>{return beforeAvatarUpload(file,index)}"
                        :on-success="(file)=>{return handleAvatarSuccess(file,index)}"
                        :on-error="(file)=>{return handleFileError(file,index)}"
                        >
                        <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>                    
                </div>
                <div class="rubikCuberight">
                    <div class="rowstyle row1">
                        <el-radio-group v-model="item.type" @change="(val)=>radioChange(val,item)">
                            <el-radio :label="1">课程</el-radio>
                            <el-radio :label="2">链接</el-radio>
                            <el-radio :label="3">无链接</el-radio>
                        </el-radio-group>                        
                    </div>
                    <div class="rowstyle row2">
                        <div class="type1" v-if="item.type==1" style="align-items:center;">
                            <div class="beforeCss">课程</div>
                            <div>
                                <div>{{item.courseName}}</div>
                                <el-button @click="selectCourse(index)">选择课程</el-button>
                                <div v-show="errorTips==index+1" class="colorError">请选择课程</div>
                            </div>
                        </div>
                        <div class="type2" v-if="item.type==2" style="align-items:flex-start;">
                            <div class="beforeCss">链接</div>
                            <div>
                                <el-input type="textarea" v-model="item.targetId" :rows="2" :minRows='2' :maxRows='3' style="width:400px" placeholder="支持M站和H5地址"></el-input>   
                                <div v-show="errorTips==index+1" class="colorError">请填写正确的链接</div>
                            </div>
                        </div> 
                        <div class="type3" v-if="item.type==3"></div>                      
                    </div>
                    <div class="rowstyle row3">{{rubikCubeMoel.style==1?'图片长宽比例1：1，建议大小375*375，支持PNG、JPG格式，小于1M':'图片长宽比例1：1，建议大小250*250，支持PNG、JPG格式，小于1M'}}</div>
                </div>
            </div>            
        </div> 
        <el-dialog
            :visible.sync="dialogVisibleFour"
            :close-on-press-escape='false'
            :close-on-click-modal="false"
            :show-close="false"
            width="50%"
        >
            <div class="centerCss">
                <courselist v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="courseIdArry[rubikCubeCourseIndex]||[]" :numbersBool="1" v-on:listSelect="listSelectEven"></courselist>      
            </div>                    
        </el-dialog>        
    </div>
</template>
<script>
const regExp = {
    'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
    'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
    'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g, //特殊字符(除了数字、字母、汉字) 
    'numberChar':/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
}
import courselist from '../wxCourseListModel'//课程组件
import { getToken,setToken,removeToken} from '@/utils/auth';
import {mapState,mapActions} from 'vuex'
export default {
    name:'wxRubikCubeEdit',
    props:['modeEditInfo','indexModel'],
    data(){
        return{
            myHeaders: {token: getToken()},
            courseIdArry:{},
            urls:'/microPage/searchCourseList',
            dialogVisibleFour:false,
            //新组建
            varObj:{
                pageType:true//是否分页
            },         
            couserBool:false,
            errorTips:0,
            errorImgs:false,
            courseList:[],
            rubikCubeMoel:{
                style:1,//样式
                microPageRelationRecordList:[
                    {
                        imgUrl:'',
                        type:1,
                        targetId:'',
                        courseName:'',
                        id:this.modeEditInfo.microPageId,
                        microPageDetailId:this.modeEditInfo.id,
                        sort:1                       
                    },
                    {
                        imgUrl:'',
                        type:1,
                        targetId:'',
                        courseName:'', 
                        id:this.modeEditInfo.microPageId,
                        microPageDetailId:this.modeEditInfo.id,
                        sort:2                                             
                    }
                ]
            },
            rubikCubeCourseIndex:'',
            styleIndex:''
        }
    },
    created(){
        if(this.modeEditInfo.microPageRelationRecordList.length>0){
            this.styleIndex = this.modeEditInfo.style;
            this.rubikCubeMoel={
                style:this.modeEditInfo.style||1,//样式
                microPageRelationRecordList:this.modeEditInfo.microPageRelationRecordList//选择课程列表 
            }  
            this.returnCourseId(this.rubikCubeMoel.microPageRelationRecordList);
        }       
    },
    components:{
        courselist
    }, 
    computed:{
        actiosService(){
            return  this.$server.actionImgOrvideo;
        },
        ...mapState(['wxStore']),          
    },
    methods:{
        ...mapActions(['setWxRightData','setWxLeftData','setwxComponentNameType','setwxSavePageIsState']),
        //选择课程
        selectCourse(index){
            this.dialogVisibleFour=true;
            this.rubikCubeCourseIndex=index;
            console.log('this.rubikCubeCourseIndex',this.rubikCubeCourseIndex);
        },
        returnCourseId(data){
            if(data.length>0){
                data.forEach((element,index)=>{
                    if(element.type==1){
                        this.courseIdArry[index+'']=[element.targetId];
                    }
                });
            }
        },    
        radioChange(data,item){
            let num= Number(item.sort)-1;
            this.rubikCubeMoel.microPageRelationRecordList[num].courseName='';
            this.rubikCubeMoel.microPageRelationRecordList[num].targetId='';
            console.log('item',item);
        },            
        seave(){
            this.errorTips=0;
            this.errorImgs = false;
            console.log('this.rubikCubeMoel.microPageRelationRecordList',this.rubikCubeMoel.microPageRelationRecordList);
                try{
                    this.rubikCubeMoel.microPageRelationRecordList.forEach((element,index)=>{
                        if(element.type!=3){
                            if (!element.imgUrl) {
                                    this.errorImgs = true;
                                    throw new Error('End Loop')
                                } 
                            if((element.type==1&&!element.targetId)){
                                this.errorTips = index+1;
                                throw new Error('End Loop')                        
                            } 
                            if(element.type==2&&!regExp.protocol.test(element.targetId)){
                                this.errorTips = index+1;
                                throw new Error('End Loop')                  
                            }   
                        }
                    })
                    
                }catch (e) {};
            if(this.errorTips>0){
                return;
            }
            if(this.errorImgs){
                this.$message.error("请上传图片");
                return;
            }
            let rightwxStoreData=this.wxStore.wxRightData;
            let leftwxStoreData=this.wxStore.wxLeftData;
            let rightdata = rightwxStoreData[this.indexModel];
            let leftdata = leftwxStoreData[this.indexModel];  
            //第一步分开左右两边数组
            let leftNewData= {
                    id:leftdata.id,
                    microPageId:leftdata.microPageId,
                    action:true,
                    style:this.rubikCubeMoel.style,
                    sort:leftdata.sort,
                    subModule:leftdata.subModule,
                    addLeftId:leftdata.addLeftId,
                    newType:false
                };
            let rightNewData= {
                    id:rightdata.id,
                    microPageId:rightdata.microPageId,
                    style:this.rubikCubeMoel.style,
                    sort:rightdata.sort,
                    subModule:rightdata.subModule,
                    addRightId:rightdata.addRightId,
                    microPageRelationRecordList:this.rubikCubeMoel.microPageRelationRecordList,  
                    content:{},
                    newType:false
            }; 
            //第三步替换对应下表的值
            rightwxStoreData.splice(this.indexModel,1,rightNewData);
            leftwxStoreData.splice(this.indexModel,1,leftNewData);
            //第四步，重新保存左右两边的最新值;             
            //设置左边变化数据；
            this.setWxLeftData(leftwxStoreData);
            //设置右边变化数据；
            this.setWxRightData(rightwxStoreData); 
            this.setwxSavePageIsState(true); 
            //关闭右侧组件  
            this.setwxComponentNameType('');        
            console.log("wxStore",this.wxStore);            
        },
        selectType(type){
            if(this.styleIndex!=type){
                this.courseIdArry={};
                this.styleIndex=type;
                this.rubikCubeCourseIndex='';
                this.courseList=[];
                this.errorTips=0;
                this.errorImgs=false;                
                if(type==1){
                    this.rubikCubeMoel={
                        style:type,//样式
                        microPageRelationRecordList:[
                            {
                                imgUrl:'',
                                type:1,
                                targetId:'',
                                courseName:'',
                                id:this.modeEditInfo.microPageId,
                                microPageDetailId:this.modeEditInfo.id,
                                sort:1                       
                            },
                            {
                                imgUrl:'',
                                type:1,
                                targetId:'',
                                courseName:'', 
                                id:this.modeEditInfo.microPageId,
                                microPageDetailId:this.modeEditInfo.id,
                                sort:2                                                                    
                            }
                        ]
                    }
                }else{
                    this.courseIdArry={};
                    this.rubikCubeMoel={
                        style:type,//样式
                        microPageRelationRecordList:[
                            {
                                imgUrl:'',
                                type:1,
                                targetId:'',
                                courseName:'',
                                id:this.modeEditInfo.microPageId,
                                microPageDetailId:this.modeEditInfo.id,
                                sort:1                       
                            },
                            {
                                imgUrl:'',
                                type:1,
                                targetId:'',
                                courseName:'', 
                                id:this.modeEditInfo.microPageId,
                                microPageDetailId:this.modeEditInfo.id,
                                sort:2                                             
                            },
                            {
                                imgUrl:'',
                                type:1,
                                targetId:'',
                                courseName:'', 
                                id:this.modeEditInfo.microPageId,
                                microPageDetailId:this.modeEditInfo.id,
                                sort:3                                             
                            }
                        ]
                    }
                }
            }
        },
        listSelectEven(data){
            var self = this;
            if(data.bool){
                let courseIds = [];
                self.dialogVisibleFour = false;
                let listCourse = [];
                data.datas.forEach((element,index)=>{
                    listCourse.push({
                        courseName:element.courseName,
                        targetId:element.content,
                        id:self.modeEditInfo.microPageId,
                        microPageDetailId:self.modeEditInfo.id,
                        type:1
                    })
                }); 
                self.rubikCubeMoel.microPageRelationRecordList[this.rubikCubeCourseIndex].targetId = listCourse[0].targetId;
                self.rubikCubeMoel.microPageRelationRecordList[this.rubikCubeCourseIndex].type = 1;
                self.rubikCubeMoel.microPageRelationRecordList[this.rubikCubeCourseIndex].courseName = listCourse[0].courseName;
                self.rubikCubeMoel.microPageRelationRecordList[this.rubikCubeCourseIndex].id = listCourse[0].id;
                self.rubikCubeMoel.microPageRelationRecordList[this.rubikCubeCourseIndex].microPageDetailId = listCourse[0].microPageDetailId;
                // self.rubikCubeMoel.microPageRelationRecordList[this.rubikCubeCourseIndex] = listCourse[0];
                if(listCourse.length){
                    self.couserBool = false;
                }
                data.datas.forEach(element => {
                    courseIds.push(element.content)
                });
                this.courseIdArry[this.rubikCubeCourseIndex+'']=courseIds;
            }else{
                self.dialogVisibleFour = false;
            }            
        },
        //上传
        handleAvatarSuccess(file,index) {
            this.rubikCubeMoel.microPageRelationRecordList[index].imgUrl = file.content.resourceUrl
        },
        beforeAvatarUpload(file,index) {
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < 1.001;
            if (!isJPG) {
            this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 1M!');
            }            
            const isSize = new Promise(function(resolve, reject) {
                            let width = 750;
                            let height = 422;
                            let _URL = window.URL || window.webkitURL;
                            let img = new Image();
                            img.onload = function() {
                                let valid = img.width /img.height==1;
                                valid ? resolve() : reject();
                            }
                            img.src = _URL.createObjectURL(file);
                        }).then(() => {
                            return file;
                        }, () => {
                            this.$message.error('图片长宽比例1：1');
                            return Promise.reject();
                });
            return isJPG && isLt2M && isSize;
        },          
    },
    watch:{
    }
}
</script>
<style lang="scss" scoped>
.wRubikCubeEdit{
    font-size: 14px;
    .wRubikCube-head{
        padding-bottom: 20px;
        border-bottom: 1px solid #f4f4f4;        
        .edit1{
            display:flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .edit2{
            padding: 0 20px;
            display:flex;
            flex-direction: row;
            align-items: center;
            justify-content:flex-start;  
            div:nth-child(2){
                >div{
                    margin-right: 10px;
                    float: left;
                    width: 80px;
                    height: 40px;
                    cursor: pointer;
                }
            }
            >div{
                padding: 0 20px 0 0;
                .style1{
                    background: url('../../../../assets/wxImg/rubik_l_1.png')no-repeat 50% 50% /cover;
                }
                .style2{
                    background: url('../../../../assets/wxImg/rubik_l_2.png')no-repeat 50% 50% /cover;
                }
            }         
        }
    }
    .wRubikCube-style-one{
        padding: 20px 0;
        .rubikCubeList{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            background: #f4f4f4;
            margin-bottom: 15px;
            padding: 15px 0;
            cursor: pointer;
            .rubikCubeleft{
                background: #fff;
                .avatar-uploader{
                    .el-upload{
                        border: 1px dashed #d9d9d9;
                        border-radius: 6px;
                        cursor: pointer;
                        position: relative;
                        overflow: hidden;                        
                    }
                    .el-upload:hover{
                        border-color: #409EFF;
                    }
                }
                .avatar-uploader-icon{
                    font-size: 28px;
                    color: #8c939d;
                    width: 178px;
                    height: 178px;
                    line-height: 178px;
                    text-align: center;                    
                }
                .avatar{
                    width: 178px;
                    height: 178px;
                    display: block;
                }
            }
            .rubikCuberight{
                width: calc(94% - 178px);
                height: 178px;
                position: relative;
                .rowstyle{
                    padding: 12px 0;
                    &.row2{
                        >div{
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-start;
                            div:nth-child(1){
                                margin-right: 10px;
                            }                        
                            div:nth-child(2){
                                >div{
                                    margin:0 0 10px 0;
                                }
                            }
                        }
                    }
                    &.row3{
                        position: absolute;
                        bottom: 0px;
                        left: 20px;
                    }
                    .type1,.type2{
                        .beforeCss:before {
                            content: '* ';
                            color: red;
                        }
                    }
                }
            }
        }
    }
    .wRubikCube-style-two{

    }
}
</style>
<style>
.colorError{
    color:#9E0E00;
}
</style>
