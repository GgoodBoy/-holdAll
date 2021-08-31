<template>
    <div class="wechatCreatPage">
        <div class="left-box">
            <div class="mobile" id="chatContainer">
                <div class="wxHomeTitleBox">
                    <el-input placeholder="请输入页面标题" maxlength="20" v-model="wxPageTitle"></el-input>
                    <el-button type="primary" @click="saveTitle">确定</el-button>
                </div>
                <draggable :disabled="wxStore.wxComponentNameType" v-model="wxStore.wxLeftData" @change="change" @start="start" @end="end" @choose="choose" :move="move">
                    <div class="modelBox" v-for="(item,index) in wxStore.wxLeftData" :class="{selectAction:item.action,undraggable:wxStore.wxComponentNameType,draggable:!wxStore.wxComponentNameType}" :key="index" @click="modelevenChoose(item,index)">
                        <wtitle v-if='Number(item.subModule)==1' :moduleData='item' :indesNum='index'></wtitle>
                        <wImg v-if='Number(item.subModule)==2' :moduleData='item' :indesNum='index'></wImg>
                        <wCourse v-if='Number(item.subModule)==3' :moduleData='item' :indesNum='index'></wCourse>
                        <wCourseGroup v-if='Number(item.subModule)==4' :moduleData='item' :indesNum='index'></wCourseGroup>
                        <wRubikCube v-if='Number(item.subModule)==5' :moduleData='item' :indesNum='index'></wRubikCube>
                        <wVideo v-if='Number(item.subModule)==6' :moduleData='item' :indesNum='index'></wVideo>
                    </div>
                </draggable>
                <div class="submitStyle">
                    <el-button type="primary" @click="saveGenerate">生成</el-button>
                    <el-button @click="saveIsNoGenerate">取消</el-button>
                </div>                
            </div>
            <i class="deleteBut el-icon-delete-solid" v-if="selectIndex!=-1" @click="deleteModelBut"></i>
        </div>
        <div class="right-box" v-show="selectModel.name">
            <div >
                <!-- 动态切换组件 -->
                <component class="config-info" :modeEditInfo="selectModel.data" :indexModel="selectModel.index||0" v-bind:is="selectModel.name"></component>                
            </div>
        </div>
        <el-dialog
        title=""
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        center
        :show-close='false'>
        <span>确认删除当前模块</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisibleven(true)">确 定</el-button>
            <el-button @click="dialogVisibleven(false)">取 消</el-button>
        </span>
        </el-dialog>
        <el-dialog
        title=""
        :visible.sync="dialogVisibleChangeDate"
        width="25%"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        center
        :show-close='false'>
        <div style='text-align:center;'>确定要离开当前页面？</div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisiblevenChangeDate(true)">确 定</el-button>
            <el-button @click="dialogVisiblevenChangeDate(false)">取 消</el-button>
        </span>
        </el-dialog>                
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
import draggable from "vuedraggable"
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
// 左侧页面组建
import wTitles from './components/leftModel/wxTitle'//标题模块
import wImgs from './components/leftModel/wxImg'//图片
import wCourses from './components/leftModel/wxCourse'//课程
import wCourseGroups from './components/leftModel/wxCourseGroup'//课程分组
import wVideos from './components/leftModel/wxVideo'//视频
import wRubikCubes from './components/leftModel/wxRubikCube'//视频
// 右侧页面设计组建
import wTitleEdits from './components/rightModel/wxTitleEdit'//标题模块
import wImgEdits from './components/rightModel/wxImgEdit'//图片
import wCourseEdits from './components/rightModel/wxCourseEdit'//课程
import wCourseGroupEdits from './components/rightModel/wxCourseGroupEdit'//课程分组
import wVideoEdits from './components/rightModel/wxVideoEdit'//视频
import wRubikCubeEdits from './components/rightModel/wxRubikCubeEdit'//视频
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    components:{
        'breadcrumb':breadcrumb,
        'wtitle':wTitles,
        'wImg':wImgs,
        'wCourse':wCourses,
        'wVideo':wVideos,
        'wCourseGroup':wCourseGroups,
        'wRubikCube':wRubikCubes,
        'wtitleEdit':wTitleEdits,
        'wImgEdit':wImgEdits,
        'wCourseEdit':wCourseEdits,
        'wVideoEdit':wVideoEdits,
        'wCourseGroupEdit':wCourseGroupEdits,
        'wRubikCubeEdit':wRubikCubeEdits,
        'draggable':draggable
    },    
    data(){
        return {
            dialogVisible:false,
            pageId:'',//微页面id
            titleList:[//标题面包学
                {
                    name:'微页面',
                    pathInfo:''
                }              
            ],
            dialogVisibleChangeDate:false,
            modelName:'',
            selectModel:{
                name:'',
                data:''
            },
            modelEditState:false,
            selectIndex:-1,//当前选中的模块
            wxPageDate:{},//微页面信息
            wxPageTitle:'',//微信页面名字
            leftData:[],//当期页左侧临时数据   
            rightData:[],//当期页右侧临时数据
            // bufferData:[],//缓存最终传递保存的值   
            //提交数据对象
            querys:{},//添加的参数
            toPath:''
            // oldscrollTopNum:0//记录上一次最后滚动的长度                       
        }
    },
    created(){      
        this.pageId = this.$route.query.id||JSON.parse(sessionStorage.getItem('creatPageId'));
        if(this.pageId){
            sessionStorage.setItem('creatPageId', this.pageId);
            this.getWxDetailPageInfo();
        }
    },
    props:[],
    computed:{
        ...mapState(['wxStore']),
        modelSelectType(){   
            return this.wxStore.wxModelValeType;
        },
        componentType(){   
            return this.wxStore.wxComponentNameType;
        }    
    },  
    beforeRouteLeave(to, from, next){
        console.log("跳转");
        let modelIsSelect = this.wxStore.wxComponentNameType;
        let modelChangeType = this.wxStore.wxSavePageIsState;    
        if(modelIsSelect||modelChangeType){
            this.dialogVisibleChangeDate=true;
            this.toPath = to;
            next(false);            
        }  else{
            setTimeout(()=>{
                console.log("晚上一秒");
                this.setRemoveState();
            },100);
            next();
        }
    },  
    watch: {      
        modelSelectType(cur,old){
            if(cur){
                this.pageId=this.pageId||JSON.parse(sessionStorage.getItem('creatPageId'));
                if(this.pageId){
                    this.addWxModel(cur);
                }else{
                    this.$message.error("请选创建页面标题。");
                }
                this.setwxModelValeType('');
            }
        },
        componentType(cur,old){
            if(!cur){
                this.selectModel={
                    name:'',
                    data:'',
                    index:-1
                }                
            }
        }
    },  
    methods:{   
        ...mapActions(['setWxRightData','setWxLeftData','setWxBufferData','setwxModelValeType','setwxComponentNameType','setwxSavePageIsState']),
        /*
            拖拽
        */
        change(evt) {
            console.log('change...',evt)
        },
        start(evt) {
            console.log('start...',evt);
            console.log("开始wxStore",this.wxStore.wxLeftData);
        },
        end(evt) {
            console.log('end....',evt)
            console.log("结束wxStore",this.wxStore.wxLeftData);
            //保证左右顺序一致
            this.gsetNewSortFun();
        },
        move(evt, originalEvent) {
            console.log('move',evt)
            console.log('originalEvent',originalEvent) //鼠标位置
        },
        choose(evt){
            console.log("选中了");
        },
        dialogVisiblevenChangeDate(type){
            if(type){
                this.setRemoveState();  
                this.dialogVisibleChangeDate=false;   
                setTimeout(()=>{
                    if(this.toPath){
                        this.$router.push({path:this.toPath.fullPath});  
                    }else{
                        this.$router.push({path:'/wechatH5/tableList'});
                    }
                },100);
            }else{
                this.dialogVisibleChangeDate=false;
            }
        },
        dialogVisibleven(type){
            if(type){
                let modelLeftList = this.wxStore.wxLeftData;
                let modelRightList = this.wxStore.wxRightData;            
                modelLeftList.splice(this.selectIndex,1);
                modelRightList.splice(this.selectIndex,1);
                this.selectIndex=-1;
                //设置左边变化数据；
                this.setWxLeftData(modelLeftList);
                //设置右边变化数据；
                this.setWxRightData(modelRightList);
                //关闭左侧模块
                this.setwxComponentNameType(''); 
                this.dialogVisible=false; 
            }else{
                this.dialogVisible=false;
            }
        },
        //数据顺序重新排列
        gsetNewSortFun(){
            let leftData = this.wxStore.wxLeftData;
            let rightData = this.wxStore.wxRightData;
            let leftList =[];
            let rightList =[];
            //右边跟着左边走；
            leftData.forEach((element,index)=>{
                rightData.forEach((element_1,index_i)=>{
                    if(element.id){
                        if(element.id==element_1.id){
                            element.sort=index+1;
                            element_1.sort=index+1;
                            rightList.push(element_1);
                            leftList.push(element);
                        }
                    }else{
                        if(element.addLeftId==element_1.addRightId){
                            element.sort=index+1;
                            element_1.sort=index+1;
                            rightList.push(element_1);
                            leftList.push(element);
                        }                        
                    }
                });
            });
            //设置左边变化数据；
            this.setWxLeftData(leftList);
            //设置右边变化数据；
            this.setWxRightData(rightList);     
            console.log("leftList",leftList)  
            console.log("rightList",rightList)       
        },
        //生成
        saveGenerate(){
            let noEdited = -1;
            this.modelEditState=false;
            this.querys['id']=this.pageId||'';
            this.querys['title']=this.wxPageTitle||'';
            let modelIsEdit=this.wxStore.wxComponentNameType;
            if(modelIsEdit){
                    this.$message.error("有正在编辑模块。");
                    return;                
            }
            let submitModelList = this.wxStore.wxRightData;
                try{               
                    submitModelList.forEach((element,index)=>{
                        if(element.newType){
                            noEdited=index;
                            throw new Error('End Loop') 
                        }         
                    });
                }catch (e) {
                    this.modelEditState=true;
                    let modelList = this.wxStore.wxLeftData;
                        modelList.forEach((element,j)=>{
                            if(noEdited==j){
                                element.action=true;
                            }else{
                                element.action=false;
                            }
                        });          
                    this.setWxLeftData(modelList);                    
                    this.$message.error("有未编辑的模块，请编辑。");
                    return;                    
                }; 

            // for (const iterator of submitModelList) {
            //     if(iterator.newType){
            //         this.modelEditState=true;
            //         this.$message.error("有未编辑的模块，请编辑。");
            //         return;
            //     }
            // }
            if(!this.modelEditState){
                //1.标题,2.图片,3.课程,4.课程分组,5.魔方,6.视频
                submitModelList.forEach((element,index)=>{
                    switch (element.subModule) {
                        case 1:
                            this.titleSubmitEven(element,index);
                            break;
                        case 2:
                            this.imgSubmitEven(element,index);
                            break;
                        case 3:
                            this.courseSubmitEven(element,index);
                            break;
                        case 4:
                            this.courseGroupSubmitEven(element,index);
                            break;
                        case 5:
                            this.rubikCubeSubmitEven(element,index);
                            break;
                        case 6:
                            this.videoSubmitEven(element,index);
                            break;
                        default:
                            break;
                    }
                });
                //提交数据到接口
                this.submitAllModelDataToHttp();
            }
        },
        //添加新的微页面
        submitAllModelDataToHttp(){
          var self = this;
            self.$http.post(self.$server.setWxSaveMicroPageDetail,self.querys).then(res=>{
                if(res.status==200){
                    this.$message.success("生成成功.");
                    sessionStorage.removeItem('creatPageId');
                    self.setRemoveState();
                    self.$router.push({path:'/wechatH5/tableList'}); 
                }
            });             
        },
        //标题数据合并事件
        titleSubmitEven(data,index){
            console.log("data.content",data.content);
            this.querys['microPageDetailInfoFormList['+index+'].id']=data.id;
            this.querys['microPageDetailInfoFormList['+index+'].microPageId']=data.microPageId;
            this.querys['microPageDetailInfoFormList['+index+'].subModule']=1;
            this.querys['microPageDetailInfoFormList['+index+'].style']=data.style;
            this.querys['microPageDetailInfoFormList['+index+'].content']=data.content;
            this.querys['microPageDetailInfoFormList['+index+'].sort']=index+1;
            data.microPageRelationRecordList.forEach((element,indexNext)=>{
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].id']=element.id;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].microPageDetailId']=element.microPageDetailId;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].type']=element.type;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].targetId']=element.targetId;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].sort']=element.sort;
            });
        },
        //图片数据合并
        imgSubmitEven(data,index){
            this.querys['microPageDetailInfoFormList['+index+'].id']=data.id;
            this.querys['microPageDetailInfoFormList['+index+'].microPageId']=data.microPageId;
            this.querys['microPageDetailInfoFormList['+index+'].subModule']=2;
            this.querys['microPageDetailInfoFormList['+index+'].style']=data.style;
            this.querys['microPageDetailInfoFormList['+index+'].content']=data.content||'';
            this.querys['microPageDetailInfoFormList['+index+'].sort']=index+1;
            data.microPageRelationRecordList.forEach((element,indexNext)=>{
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].id']=element.id;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].microPageDetailId']=element.microPageDetailId;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].type']=element.type;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].targetId']=element.targetId;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].sort']=element.sort;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].imgUrl']=element.imgUrl;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].courseName']=element.courseName;
                
            });            
        },
        //课程数据合并
        courseSubmitEven(data,index){
            this.querys['microPageDetailInfoFormList['+index+'].id']=data.id;
            this.querys['microPageDetailInfoFormList['+index+'].microPageId']=data.microPageId;
            this.querys['microPageDetailInfoFormList['+index+'].subModule']=3;
            this.querys['microPageDetailInfoFormList['+index+'].style']=data.style;
            this.querys['microPageDetailInfoFormList['+index+'].content']=data.content;
            this.querys['microPageDetailInfoFormList['+index+'].sort']=index+1;
            data.microPageRelationRecordList.forEach((element,indexNext)=>{
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].id']=element.id;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].microPageDetailId']=element.microPageDetailId;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].type']=element.type;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].targetId']=element.targetId;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].sort']=element.sort;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].courseName']=element.courseName;
            });              
        },
        //课程分组数据合并
        courseGroupSubmitEven(data,index){
            this.querys['microPageDetailInfoFormList['+index+'].id']=data.id;
            this.querys['microPageDetailInfoFormList['+index+'].microPageId']=data.microPageId;
            this.querys['microPageDetailInfoFormList['+index+'].subModule']=4;
            this.querys['microPageDetailInfoFormList['+index+'].style']=data.style;
            this.querys['microPageDetailInfoFormList['+index+'].content']=data.content;
            this.querys['microPageDetailInfoFormList['+index+'].sort']=index+1;
            data.microPageRelationRecordList.forEach((element,indexNext)=>{
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].id']=element.id;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].microPageDetailId']=element.microPageDetailId;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].type']=element.type;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].targetId']=element.targetId;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].sort']=element.sort;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].courseName']=element.courseName;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].groupType']=element.groupType;
            });              
        },
        //魔方数据合并
        rubikCubeSubmitEven(data,index){
            this.querys['microPageDetailInfoFormList['+index+'].id']=data.id;
            this.querys['microPageDetailInfoFormList['+index+'].microPageId']=data.microPageId;
            this.querys['microPageDetailInfoFormList['+index+'].subModule']=5;
            this.querys['microPageDetailInfoFormList['+index+'].style']=data.style;
            this.querys['microPageDetailInfoFormList['+index+'].content']=data.content;
            this.querys['microPageDetailInfoFormList['+index+'].sort']=index+1;
            data.microPageRelationRecordList.forEach((element,indexNext)=>{
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].id']=element.id;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].microPageDetailId']=element.microPageDetailId;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].type']=element.type;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].targetId']=element.targetId;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].sort']=element.sort;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].courseName']=element.courseName;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].imgUrl']=element.imgUrl;
            }); 
        },
        //视频数据合并
        videoSubmitEven(data,index){
            this.querys['microPageDetailInfoFormList['+index+'].id']=data.id;
            this.querys['microPageDetailInfoFormList['+index+'].microPageId']=data.microPageId;
            this.querys['microPageDetailInfoFormList['+index+'].subModule']=6;
            this.querys['microPageDetailInfoFormList['+index+'].style']=data.style;
            this.querys['microPageDetailInfoFormList['+index+'].content']=data.content;
            this.querys['microPageDetailInfoFormList['+index+'].sort']=index+1;
            data.microPageRelationRecordList.forEach((element,indexNext)=>{
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].id']=element.id;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].microPageDetailId']=element.microPageDetailId;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].type']=element.type;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].targetId']=element.targetId;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].sort']=element.sort;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].videoName']=element.videoName;
                this.querys['microPageDetailInfoFormList['+index+'].microPageRelationRecordFormList['+indexNext+'].imgUrl']=element.imgUrl;
            });             
        },
        saveIsNoGenerate(){
            let modelIsSelect = this.wxStore.wxComponentNameType;
            let modelChangeType = this.wxStore.wxSavePageIsState;
            if(modelIsSelect||modelChangeType){
                this.dialogVisibleChangeDate=true;
            }else{
                this.setRemoveState();
                this.$router.push({path:'/wechatH5/tableList'});                 
            }
        },
        setRemoveState(){
            sessionStorage.removeItem('creatPageId');
            this.setWxLeftData([]);
            this.setWxRightData([]);    
            this.setWxBufferData([]);     
            this.setwxComponentNameType('');  
            this.setwxSavePageIsState(false);             
        },
        //删除选中模块的
        deleteModelBut(){
            this.dialogVisible=true;
        },
        //增加模块 1.标题,2.图片,3.课程,4.课程分组,5.魔方,6.视频
        addWxModel(type){
            let modelLeftList = this.wxStore.wxLeftData;
            let modelRightList = this.wxStore.wxRightData;
            let sort=modelLeftList.length+1;
            let indexNumber=Number(new Date);
            if(type==1){
                modelLeftList.push({
                        id:'',
                        microPageId:this.wxPageDate.id||this.pageId,
                        action:false,
                        style:1,
                        sort:sort,
                        subModule:type,
                        addLeftId:indexNumber,
                        newType:true,
                        content:'{}'                      
                    });
            }else{
                modelLeftList.push({
                            id:'',
                            microPageId:this.wxPageDate.id||this.pageId,
                            action:false,
                            style:1,
                            sort:sort,
                            subModule:type,
                            addLeftId:indexNumber,
                            newType:true                      
                        });                
            }

            modelRightList.push({
                    id:'',
                    microPageId:this.wxPageDate.id||this.pageId,
                    style:1,
                    sort:sort,
                    subModule:type,
                    microPageRelationRecordList:[],  
                    content:'',
                    addRightId:indexNumber,
                    newType:true 
            });   
            //设置左边变化数据；
            this.setWxLeftData(modelLeftList);
            //设置右边变化数据；
            this.setWxRightData(modelRightList);  
            this.$nextTick(() => {
                var container = this.$el.querySelector("#chatContainer");
                // console.log('ccontainer.scrollHeight',container.scrollHeight);
                // console.log('container.scrollTop',container.scrollTop);
                // let speacs = 10;
                // if(container.scrollHeight>0){
                //     let times = setInterval(()=>{
                //         if(container.scrollHeight-container.scrollTop>10){
                //             container.scrollTop=speacs+container.scrollTop;
                //             console.log('container.scrollTop',container.scrollTop);
                //         }else{
                //             clearInterval(times)
                //         }
                //     },50);
                // }
                container.scrollTop = container.scrollHeight;
            })                     
        },
        saveTitle(){
            let query = {
                title:this.wxPageTitle
            };
            if(this.pageId){
                query['id']=this.pageId;
            }
            this.$http.post(this.$server.setWxSaveAndEditMicroPage,query).then(res=>{
               if(res.status==200){
                   this.pageId = res.content.id;
                   this.wxPageTitle = res.content.title;
                   sessionStorage.setItem('creatPageId', this.pageId);
                   this.$message.success("创建成功.");
               }
            })             
        },
        getWxDetailPageInfo(){
            this.$http.get(this.$server.getWxMicroPage+this.pageId).then(res=>{
               if(res.status==200){
                   this.wxPageDate = res.content;
                   this.wxPageTitle= res.content.title;
                   if(this.wxPageDate.microPageDetailInfoList){
                       if(this.wxPageDate.microPageDetailInfoList.length>0){
                           this.getLeftModelDataList(this.wxPageDate.microPageDetailInfoList);
                       }
                   }
               }
            })            
        },
        /*
            获取接口返回值，进行数据拆分
            1.首先拆分左边
        */
       getLeftModelDataList(data){
            data.forEach((element,index) => {
                if(element.subModule==1){
                    this.leftData.push({
                            id:element['id'],
                            microPageId:element['microPageId'],
                            action:false,
                            style:element['style'],
                            sort:element['sort'],
                            subModule:element['subModule'],
                            newType:false,
                            content:element['content']
                    });
                }else{
                    this.leftData.push({
                            id:element['id'],
                            microPageId:element['microPageId'],
                            action:false,
                            style:element['style'],
                            sort:element['sort'],
                            subModule:element['subModule'],
                            newType:false
                    });                    
                }

               this.rightData.push({
                    id:element['id'],
                    microPageId:element['microPageId'],
                    style:element['style'],
                    sort:element['sort'],
                    subModule:element['subModule'],
                    microPageRelationRecordList:element['microPageRelationRecordList'],  
                    content:element['content'],
                    newType:false
               });
            });
            //设置左边变化数据；
            this.setWxLeftData(this.leftData);
            //设置右边变化数据；
            this.setWxRightData(this.rightData);            
            //设置右边点击保存后和在初始化时左边的数据;
            this.setWxBufferData(data);
       },
       /**
        * 选中模块添加选中事件
        */
        modelevenChoose(data,i){
            if(!this.wxStore.wxComponentNameType){
                this.setwxComponentNameType('');
                setTimeout(()=>{
                    let modelList = this.wxStore.wxLeftData;
                        modelList.forEach((element,j)=>{
                            if(i==j){
                                element.action=true;
                            }else{
                                element.action=false;
                            }
                        });          
                        this.setWxLeftData(modelList);
                        function checkAdult(age) {
                            if(age.id&&data.id){
                                return age.id == data.id;
                            }else{
                                return age.addRightId == data.addLeftId;
                            }
                        }
                        let filterModel=this.wxStore.wxRightData.find(checkAdult);
                        let name = '';//1.标题,2.图片,3.课程,4.课程分组,5.魔方,6.视频
                        switch (Number(filterModel.subModule)) {
                            case 1:
                                name='wtitleEdit'
                                break;
                            case 2:
                                name='wImgEdit'
                                break;
                            case 3:
                                name='wCourseEdit'
                                break;
                            case 4:
                                name='wCourseGroupEdit'
                                break;
                            case 5:
                                name='wRubikCubeEdit'
                                break;
                            case 6:
                                name='wVideoEdit'
                                break;
                            default:
                                console.log("没有对应的模块");
                                break;
                        }
                        this.selectModel={
                            name:name,
                            data:filterModel,
                            index:i
                        }
                        this.selectIndex=i;
                        this.setwxComponentNameType(name);
                },300);
            }else{
                this.$message.error('请保存当前配置');
            }
        }
    },
    mounted(){}
}
</script>
<style lang="scss" scoped>
.wechatCreatPage{ 
     height: calc(100vh - 120px);
    .left-box{
        width: 345px;
        height: calc(100% - 10px);
        float: left;
        background: #F4F4F4;
        padding: 0px 0px 25px 0px;
        margin-right: 30px;
        position: relative;
        .mobile{
                height: 100%;
                overflow:auto;
                position: relative;
                z-index: 2;
                .wxHomeTitleBox{
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row;
                    padding: 15px;
                    button{
                        margin-left: 10px;
                    }
                }
                .modelBox{
                    margin: 0 0 15px 0;
                    padding: 15px;
                    background: #fff;
                    &.selectAction{
                        border: 1px solid #9E0E00;
                    };
                    &.undraggable{
                        cursor:no-drop;
                    }
                    &.draggable{
                        cursor: pointer;
                    }
                }
                
                // background: #fff;
                &::-webkit-scrollbar{
                    display: none;
                }
                .submitStyle{
                    text-align: center;
                    margin: 10px 0;
                }
            }
        .deleteBut{
            position: absolute;
            padding: 5px;
            right: -32px;
            color: #9E0E00;
            font-size: 24px;
            top:50%;
        }
    }
    .right-box{
        overflow: hidden;
        padding:10px;
        height: calc(100% - 10px);
        background: #fff;
        padding: 10px;
        >div{
            height: 100%;
            overflow: scroll;
        }
    }
}
</style>


