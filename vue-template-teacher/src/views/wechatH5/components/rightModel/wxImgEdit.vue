<template>
    <div class="wImgEdit wModelEdit">
        <div class="wImg-head">
            <div class="edit1">
                <div>图片设置</div>
                <el-button size="small" type="primary" @click="seave">保存</el-button>
            </div>
            <div class="edit2">
                <div>样式</div>
                <div>
                    <div class="style1" :style="{border:(styleIndex==1?'1px solid #66CCFF':'none')}" @click="selectType(1)"></div>
                    <div class="style2" :style="{border:(styleIndex==2?'1px solid #66CCFF':'none')}" @click="selectType(2)"></div>
                </div>
            </div>
            <div class="edit3">
                <span>最多可添加10个图片</span>
                 <span>已添加{{imgMoel.microPageRelationRecordList.length}}个图片</span>
            </div>
        </div>
        <div class="wImg-style-one">
            <draggable v-model="imgMoel.microPageRelationRecordList" @change="change" @start="start" @end="end" :move="move">
                <div class="imgList" v-for="(item,index) in imgMoel.microPageRelationRecordList" :key="index">
                    <div class="imgleft">
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
                    <div class="imgright">
                        <div class="rowstyle row1">
                            <el-radio-group v-model="item.type" @change="(val)=>radioChange(val,item)">
                                <el-radio :label="1">课程</el-radio>
                                <el-radio :label="2">链接</el-radio>
                                <el-radio :label="3">无连接</el-radio>
                            </el-radio-group>                        
                        </div>
                        <div class="rowstyle row2">
                            <div class="type1" v-if="item.type==1" style="align-items:center;">
                                <div>课程</div>
                                <div>
                                    <div>{{item.courseName}}</div>
                                    <el-button @click="selectCourse(index)">选择课程</el-button>
                                </div>
                            </div>
                            <div class="type2" v-if="item.type==2" style="align-items:flex-start;">
                                <div>链接</div>
                                <div>
                                    <el-input type="textarea" :rows="2" :minRows='2' :maxRows='3' style="width:400px" v-model='item.targetId'  placeholder="支持M站和H5地址"></el-input>   
                                </div>
                            </div> 
                            <div class="type3" v-if="item.type==3"></div>                      
                        </div>
                        <div class="rowstyle row3">默认图片比例16：9，宽度不小于480</div>
                        <i class="el-icon-circle-close" @click="removeImgs(item,index)"></i>
                    </div>
                </div>
            </draggable>
            <div style="text-align: center;">
                <el-button type="primary"  @click="addPhoto">添加照片</el-button>
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
                <courselist v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="courseIdArry[imgCourseIndex]||[]" :numbersBool="1" v-on:listSelect="listSelectEven"></courselist>      
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
import draggable from "vuedraggable"
import { getToken,setToken,removeToken} from '@/utils/auth';
import courselist from '../wxCourseListModel'//课程组件
import {mapState,mapActions} from 'vuex'
export default {
    name:'wxImgEdit',
    props:['modeEditInfo','indexModel'],
    data(){
        return{
            myHeaders: {token: getToken()},
            radio:1,
            iconUrl:'',
            courseIdArry:{},
            urls:'/microPage/searchCourseList',
            dialogVisibleFour:false,
            //新组建
            varObj:{
                pageType:true//是否分页
            },   
            styleIndex:1,
            couserBool:false,
            courseList:[],
            imgMoel:{
                style:1,//样式
                microPageRelationRecordList:[],//选择课程列表 
            },
            imgCourseIndex:'',      
            errorTips:0,
            // targetIdTips:0
        }
    },
    created(){
        if(this.modeEditInfo.microPageRelationRecordList.length>0){
            this.styleIndex = this.modeEditInfo.style;
            this.imgMoel={
                style:this.modeEditInfo.style||1,//样式
                microPageRelationRecordList:this.modeEditInfo.microPageRelationRecordList//选择课程列表     
            }
            this.returnCourseId(this.modeEditInfo.microPageRelationRecordList);
        }        
    },
    components:{
        courselist,
        'draggable':draggable
    }, 
    computed:{
        actiosService(){
            return  this.$server.actionImgOrvideo;
        },
        ...mapState(['wxStore']),        
    },
    methods:{
        ...mapActions(['setWxRightData','setWxLeftData','setwxComponentNameType','setwxSavePageIsState']),

        returnCourseId(data){
            if(data.length>0){
                data.forEach((element,index)=>{
                    if(element.type==1){
                        this.courseIdArry[index+'']=[element.targetId];
                    }
                });
            }
        },
        change(evt) {
            console.log('change...',evt)
        },
        start(evt) {
            console.log('start...',evt)
        },
        end(evt) {
            console.log('end....',evt);
            this.imgMoel.microPageRelationRecordList=this.setNewSortData(this.imgMoel.microPageRelationRecordList);
        },
        move(evt, originalEvent) {
            console.log('move',evt)
            console.log('originalEvent',originalEvent) //鼠标位置
        },
        radioChange(data,item){
            let num= Number(item.sort)-1;
            this.imgMoel.microPageRelationRecordList[num].courseName='';
            this.imgMoel.microPageRelationRecordList[num].targetId='';
        },
        //从新排序事件
        setNewSortData(arr){
            let list =[];
            let list1 = arr;
            list1.forEach((element,index)=>{
                element.sort=index+1;
                list.push(element);
            });
            return list;
        },

        addPhoto(){           
            if(this.imgMoel.microPageRelationRecordList.length!=10){
                this.imgMoel.microPageRelationRecordList.push({
                    type:1,
                    imgUrl:'',
                    sort:this.imgMoel.microPageRelationRecordList.length+1,
                    courseName:'',
                    targetId:'',
                    id:this.modeEditInfo.microPageId,
                    microPageDetailId:this.modeEditInfo.id
                });
            }
        },
        //删除信息
        removeImgs(data,index){
            this.imgMoel.microPageRelationRecordList.splice(index,1);
            this.imgMoel.microPageRelationRecordList=this.setNewSortData(this.imgMoel.microPageRelationRecordList);
        },
        //保存
        seave(){
            this.errorTips=0;
            // this.targetIdTips=0;
            if(this.imgMoel.microPageRelationRecordList.length>0){
                try{
                    this.imgMoel.microPageRelationRecordList.forEach((element,index)=>{
                        if(!element.imgUrl){
                            this.errorTips = index+1;
                            this.$message.error("请上传图片");
                            throw new Error('End Loop')                        
                        }
                        if((element.type==1&&!element.targetId)){
                            this.errorTips = index+1;
                            this.$message.error("请选课程.");
                            throw new Error('End Loop')                        
                        } 
                        if(element.type==2&&!regExp.protocol.test(element.targetId)){
                            // this.targetIdTips = index+1;
                            this.errorTips = index+1;
                            this.$message.error("请填写正确的地址.");
                            throw new Error('End Loop')                  
                        }                       
                        
                    });                    
                }catch (e) {};                

            }else{
                this.$message.error("请创建数据");
                return;
            }
            if(this.errorTips>0){
                // this.$message.error("请上传图片");
                return;
            }    
            // if(this.targetIdTips>0){
            //     this.$message.error("请选填值。");
            //     return;
            // }                       
            let rightwxStoreData=this.wxStore.wxRightData;
            let leftwxStoreData=this.wxStore.wxLeftData;
            let rightdata = rightwxStoreData[this.indexModel];
            let leftdata = leftwxStoreData[this.indexModel];  
            //第一步分开左右两边数组
            let leftNewData= {
                    id:leftdata.id,
                    microPageId:leftdata.microPageId,
                    action:true,
                    style:this.imgMoel.style,
                    sort:leftdata.sort,
                    subModule:leftdata.subModule,
                    addLeftId:leftdata.addLeftId,
                    newType:false
                };
            let rightNewData= {
                    id:rightdata.id,
                    microPageId:rightdata.microPageId,
                    style:this.imgMoel.style,
                    sort:rightdata.sort,
                    subModule:rightdata.subModule,
                    addRightId:rightdata.addRightId,
                    microPageRelationRecordList:this.imgMoel.microPageRelationRecordList,  
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
            this.radio=1;
            this.courseIdArry={};
            this.courseList=[];
            this.imgMoel={
                style:type,//样式
                microPageRelationRecordList:[],//选择课程列表 
            },
            this.imgCourseIndex='';      
            this.errorTips=0;
            // this.targetIdTips=0;
            this.styleIndex=type;
        },        
        //上传
        handleAvatarSuccess(file,index) {
            this.imgMoel.microPageRelationRecordList[index].imgUrl = file.content.resourceUrl;
        },
        handleFileError(file,index){
            this.$message.error('上传的图片错误');               
        },
        beforeAvatarUpload(file,index) {
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            // const isLt2M = file.size / 1024 / 1024 <2.001;
            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
            }
            // if (!isLt2M) {
            //     this.$message.error('上传图片大小不能超过 200k!');
            // }            
            const isSize = new Promise(function(resolve, reject) {
                            let width = 480;
                            // let height = 422;
                            let _URL = window.URL || window.webkitURL;
                            let img = new Image();
                            img.onload = function() {
                                let valid = img.width >= width && (img.height/img.width>=0.55&&img.height/img.width<0.5700001);
                                valid ? resolve() : reject();
                            }
                            img.src = _URL.createObjectURL(file);
                        }).then(() => {
                            return file;
                        }, () => {
                            this.$message.error('上传的图片比例16：9，宽度大于等于480');
                            return Promise.reject();
                });
            // return isJPG && isLt2M && isSize;
            return isJPG && isSize;
        },
        //选择课程
        selectCourse(index){
            this.dialogVisibleFour=true;
            this.imgCourseIndex=index;
        },        
        listSelectEven(data){
            var self = this;
            if(data.bool){
                let courseIds=[];
                self.dialogVisibleFour = false;
                let listCourse = [];
                data.datas.forEach((element,index)=>{
                    listCourse.push({
                        courseName:element.courseName,
                        courseId:element.content,
                        id:self.modeEditInfo.microPageId,
                        microPageDetailId:self.modeEditInfo.id,
                        type:1,
                        sort:index+1
                    })
                });                
                self.imgMoel.microPageRelationRecordList[this.imgCourseIndex].targetId = listCourse[0].courseId;
                self.imgMoel.microPageRelationRecordList[this.imgCourseIndex].type = 1;
                self.imgMoel.microPageRelationRecordList[this.imgCourseIndex].courseName = listCourse[0].courseName;
                if(listCourse.length){
                    self.couserBool = false;
                }
                data.datas.forEach(element => {
                    courseIds.push(element.content)
                });
                self.courseIdArry[this.imgCourseIndex+'']=courseIds;
            }else{
                self.dialogVisibleFour = false;
            }            
        }  
    },
    watch:{
    }
}
</script>
<style lang="scss" scoped>
.wImgEdit{
    font-size: 14px;
    >div{
        border-bottom: 1px solid #f4f4f4;
        padding: 10px;
        
    }
    .wImg-head{
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
                    height: 45px;
                    cursor: pointer;
                }
            }
            >div{
                padding: 0 20px 0 0;
                .style1{
                    background: url('../../../../assets/wxImg/img_l_1.png')no-repeat 50% 50% /cover;
                }
                .style2{
                    background: url('../../../../assets/wxImg/img_l_2.png')no-repeat 50% 50% /cover;
                }
            }          
        }
        .edit3{
            text-align: right;
        }
    }
    .wImg-style-one{
        .imgList{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            background: #f4f4f4;
            margin-bottom: 15px;
            padding: 15px 0;
            cursor: pointer;
            .imgleft{
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
            .imgright{
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
                }
                i{
                    position: absolute;
                    top:-27px;
                    right: -14px;
                    font-size: 20px;
                }
            }
        }
    }
}
</style>