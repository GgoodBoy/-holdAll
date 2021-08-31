<template>
    <div class="wCourseEdit wModelEdit">
        <div class="wCourse-head">
            <div class="edit1">
                <div>课程设置</div>
                <el-button size="small" type="primary" @click="seave">保存</el-button>
            </div>
            <div class="edit2">
                <div>样式</div>
                <div>
                    <div class="style1" :style="{border:(styleIndex==1?'1px solid #66CCFF':'none')}" @click="selectType(1)"></div>
                    <div class="style2" :style="{border:(styleIndex==2?'1px solid #66CCFF':'none')}" @click="selectType(2)"></div>
                </div>
            </div>
        </div>
        <div class="wCourse-style-one">
            <div class="wCourseEdit1">
                <div class="edit1">
                    <div class="layouts">
                        <div>对齐方式</div>
                        <div v-if="courseMoel.layouts==1">左对齐</div>
                        <div v-else-if="courseMoel.layouts==2">居中对齐</div>
                        <div v-else>右对齐</div>                        
                    </div>
                    <div class="alignmentEdit">
                        <div :class="[courseMoel.layouts==1?'actionIsOk':'actionIsNo']" @click="setUpCourseStyle('layouts',1)">
                            <img src='../../../../assets/wxImg/layout-left.png' />
                        </div>
                        <div :class="[courseMoel.layouts==2?'actionIsOk':'actionIsNo']" @click="setUpCourseStyle('layouts',2)">
                            <img src='../../../../assets/wxImg/layout-center.png' />
                            </div>
                        <div :class="[courseMoel.layouts==3?'actionIsOk':'actionIsNo']" @click="setUpCourseStyle('layouts',3)">
                            <img src='../../../../assets/wxImg/layout-right.png' />
                        </div>                    
                    </div>
                </div>
                <div class="edit2">
                    <div class="layouts">
                        <div>标题加粗</div>
                        <div>{{courseMoel.courseTitleBold?'加粗':'正常'}}</div>
                    </div>
                    <div class="sizeEdit">
                        <div :class="[courseMoel.courseTitleBold==true?'actionIsOk':'actionIsNo']" @click="setUpCourseStyle('courseTitleBold',true)" style="font-weight:bold">B</div>
                        <div :class="[courseMoel.courseTitleBold==false?'actionIsOk':'actionIsNo']" @click="setUpCourseStyle('courseTitleBold',false)">B</div>                    
                    </div>
                </div>
                <div class="edit3">
                    <div class="layouts">
                        <div>标题显示</div>
                        <div>{{courseMoel.courseTitleIsShow?'显示':'不显示'}}</div>
                    </div>
                    <div class="colorEdit">
                        <el-checkbox v-model="courseMoel.courseTitleIsShow">显示</el-checkbox>
                    </div>
                </div> 
                <div class="edit3">
                    <div class="layouts">
                        <div>描述显示</div>
                        <div>{{courseMoel.describeIsShow?'显示':'不显示'}}</div>
                    </div>
                    <div class="colorEdit">
                        <el-checkbox v-model="courseMoel.describeIsShow">显示</el-checkbox>
                    </div>
                </div> 
                <div class="edit3">
                    <div class="layouts">
                        <div>价格显示</div>
                        <div>{{courseMoel.moneyIsShow?'显示':'不显示'}}</div>
                    </div>
                    <div class="colorEdit">
                        <el-checkbox v-model="courseMoel.moneyIsShow">显示</el-checkbox>
                    </div>
                </div> 
                <div class="edit3">
                    <div class="layouts">
                        <div>购买按钮</div>
                        <div>{{courseMoel.butIsShow?'显示':'不显示'}}</div>
                    </div>
                    <div class="colorEdit">
                        <el-checkbox v-model="courseMoel.butIsShow">显示</el-checkbox>
                    </div>
                </div>   
            </div>   
            <div class="wCourseEdit2">
                <div class="edit1">
                    <div>
                        <div>课程</div>
                        <el-button size="small" type="primary" @click="selectCourse">选择课程</el-button>
                        <div>最多可选中50门课程</div>
                    </div>
                    <div>已选中{{courseMoel.microPageRelationRecordList.length||0}}门</div>
                </div>
                <div class="edit2">
                     <draggable v-model="courseMoel.microPageRelationRecordList" @change="change" @start="start" @end="end" :move="move">
                        <div class="draggableBox" v-for="(item,index) in courseMoel.microPageRelationRecordList" :key="index">
                                {{item.courseName}}
                            <i class="el-icon-circle-close" @click="delectCourse(item,index)"></i>
                        </div>
                    </draggable>
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
                   <courselist v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="courseIds" :numbersBool="50" v-on:listSelect="listSelectEven"></courselist>      
            </div>                    
        </el-dialog>         
    </div>
</template>
<script>
import courselist from '../wxCourseListModel'//课程组件
import draggable from "vuedraggable"
import {mapState,mapActions} from 'vuex'
export default {
    name:'wxCourseEdit',
    props:['modeEditInfo','indexModel'],
    data(){
        return{
            courseIds:[],
            urls:'/microPage/searchCourseList',
            dialogVisibleFour:false,
            //新组建
            varObj:{
                pageType:true//是否分页
            },         
            couserBool:false,
            // courseListArr:[],
            styleIndex:-1,
            courseMoel:{
                style:1,//样式
                layouts:2,//对齐
                courseTitleBold:true,//标题加粗
                courseTitleIsShow:true,//标题显示
                describeBold:true,//描述加粗
                describeIsShow:true,//描述显示
                moneyIsShow:true,//价格显示
                butIsShow:true,//购买按钮
                microPageRelationRecordList:[],//选择课程列表  
                content:{}
            }    
        }
    },
    created(){
        if(this.modeEditInfo.content){
            let contents = JSON.parse(this.modeEditInfo.content);
            var contentType =typeof contents;
            if(contentType==='string'){
                contents = JSON.parse(contents);
            }            
            this.styleIndex = this.modeEditInfo.style;
            this.courseMoel={
                    style:this.modeEditInfo.style||1,//样式
                    layouts:contents.layouts||1,//对齐
                    courseTitleIsShow:contents.courseTitleIsShow||false,//标题显示
                    courseTitleBold:contents.courseTitleBold||false,//标题加粗
                    describeBold:contents.describeBold||false,//描述加粗
                    describeIsShow:contents.describeIsShow||false,//描述显示
                    moneyIsShow:contents.moneyIsShow||false,//价格显示
                    butIsShow:contents.butIsShow||false,//购买按钮
                    microPageRelationRecordList:this.modeEditInfo.microPageRelationRecordList//选择课程列表     
            }
            if(this.courseMoel.microPageRelationRecordList.length>0){
                this.courseMoel.microPageRelationRecordList.forEach((element,index)=>{
                    this.courseIds.push(element.targetId);
                });
            }
        }        
    },
    components:{
        courselist,
        'draggable':draggable
    },     
    computed:{
        ...mapState(['wxStore']),
    },
    methods:{
        ...mapActions(['setWxRightData','setWxLeftData','setwxComponentNameType','setwxSavePageIsState']),


        change(evt) {
            console.log('change...',evt)
        },
        start(evt) {
            console.log('start...',evt)
        },
        end(evt) {
            console.log('end....',evt);

        },
        move(evt, originalEvent) {
            console.log('move',evt)
            console.log('originalEvent',originalEvent) //鼠标位置
        },

        //删除
        delectCourse(itme,index){
            this.courseIds=[];
            this.courseMoel.microPageRelationRecordList.splice(index,1);
            if(this.courseMoel.microPageRelationRecordList.length>0){
                this.courseMoel.microPageRelationRecordList.forEach((element,index)=>{
                    this.courseIds.push(element.targetId);
                });
            }            
        },
        //选择课程
        selectCourse(){
            this.dialogVisibleFour=true;
            sessionStorage.setItem('courseReturnListVal',JSON.stringify(this.courseMoel.microPageRelationRecordList));
        },
        selectType(type){
            this.courseMoel={
                style:type,//样式
                layouts:2,//对齐
                courseTitleBold:true,//标题加粗
                courseTitleIsShow:true,//标题显示
                describeBold:true,//描述加粗
                describeIsShow:true,//描述显示
                moneyIsShow:true,//价格显示
                butIsShow:true,//购买按钮
                microPageRelationRecordList:[],//选择课程列表  
                content:{}                
            };
            this.courseIds=[];
            this.styleIndex=type;
        },
        listSelectEven(data){
            var self = this;
            if(data.bool){
                self.courseIds = [];
                self.dialogVisibleFour = false;
                let listCourse = [];
                data.datas.forEach((element,index)=>{
                    listCourse.push({
                        courseName:element.courseName,
                        targetId:element.content,
                        id:self.modeEditInfo.microPageId,
                        microPageDetailId:self.modeEditInfo.id,
                        type:1,
                        sort:index+1
                    })
                });                
                self.courseMoel.microPageRelationRecordList = listCourse;
                if(listCourse.length){
                    self.couserBool = false;
                }
                data.datas.forEach(element => {
                    self.courseIds.push(element.content)
                });
            }else{
                self.dialogVisibleFour = false;
            }            
        },
        setUpCourseStyle(type,data){
            this.courseMoel[type]=data;
        },
        seave(){
            let rightwxStoreData=this.wxStore.wxRightData;
            let leftwxStoreData=this.wxStore.wxLeftData;
            let rightdata = rightwxStoreData[this.indexModel];
            let leftdata = leftwxStoreData[this.indexModel]; 
            let contebtStr = JSON.stringify({
                        layouts:this.courseMoel.layouts,//对齐
                        courseTitleIsShow:this.courseMoel.courseTitleIsShow,
                        courseTitleBold:this.courseMoel.courseTitleBold,//标题加粗
                        describeBold:this.courseMoel.describeBold,//描述大小
                        describeIsShow:this.courseMoel.describeIsShow,//描述加粗
                        moneyIsShow:this.courseMoel.moneyIsShow,//标题颜色
                        butIsShow:this.courseMoel.butIsShow,//背景颜色 
            });              
            //第一步分开左右两边数组
            let leftNewData= {
                    id:leftdata.id,
                    microPageId:leftdata.microPageId,
                    action:true,
                    style:this.courseMoel.style,
                    sort:leftdata.sort,
                    subModule:leftdata.subModule,
                    addLeftId:leftdata.addLeftId,
                    newType:false
                };
            let rightNewData= {
                    id:rightdata.id,
                    microPageId:rightdata.microPageId,
                    style:this.courseMoel.style,
                    sort:rightdata.sort,
                    subModule:rightdata.subModule,
                    addRightId:rightdata.addRightId,
                    microPageRelationRecordList:this.courseMoel.microPageRelationRecordList,  
                    content:contebtStr,
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
        }
    },
    watch:{
    }
}
</script>
<style lang="scss" scoped>
.wCourseEdit{
    font-size: 14px;
    >div{
        border-bottom: 1px solid #f4f4f4;
        padding: 15px 0;
        
    }
    .wCourse-head{
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
                    background: url('../../../../assets/wxImg/course_l_1.png')no-repeat 50% 50% /cover;
                }
                .style2{
                    background: url('../../../../assets/wxImg/course_l_2.png')no-repeat 50% 50% /cover;
                }
            }         
        }
    }  
    .wCourse-style-one{
        >div{
            border-bottom: 1px solid #f4f4f4;
            &.wCourseEdit1{
                padding: 0 20px;
                >div{
                    display: flex;
                    flex-direction: row;
                    justify-content:space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    .layouts{
                        display:flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content:flex-start;    
                        >div{
                            margin-right: 10px;
                        }            
                    }                  
                    .sizeEdit{
                        display:flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content:space-around;
                        border-top: 1px solid #f4f4f4;
                        border-left: 1px solid #f4f4f4;
                        border-bottom: 1px solid #f4f4f4;
                        >div{
                            width: 40px;
                            line-height: 25px;
                            text-align: center;
                            cursor: pointer;
                            height: 25px;
                            border-right: 1px solid #f4f4f4;
                        }                 
                    } 
                }
                .edit1{
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content:space-between; 
                    margin-bottom: 15px;
                    .layouts{
                        display:flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content:flex-start;    
                        >div{
                            margin-right: 10px;
                        }            
                    }
                    .alignmentEdit{
                        display:flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content:space-around;
                        border-top: 1px solid #f4f4f4;
                        border-left: 1px solid #f4f4f4;
                        border-bottom: 1px solid #f4f4f4;
                        >div{
                            width: 40px;
                            cursor: pointer;
                            height: 25px;
                            border-right: 1px solid #f4f4f4;
                            img{
                                width: 100%;
                                height: 100%;
                                display: block;
                            }
                            
                        }                
                    }         
                }
            }
            &.wCourseEdit2{
                padding: 20px;
                .edit1{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    div:nth-child(1){
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content:flex-start;
                        >div,button{
                            margin-right: 10px;
                        }
                    }
                }
                .edit2{
                    max-height: 200px;
                    overflow: scroll;
                    margin-top: 20px;
                    padding: 10px;
                    .draggableBox{
                        padding: 10px;
                        background: #f4f4f4;
                        margin-bottom: 15px;
                        text-align: left;
                        position: relative;
                        cursor: pointer;
                        i{
                            position: absolute;
                            right: -10px;
                            top: -10px;
                            font-size: 20px;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }  
}
</style>
<style>
.actionIsOk{
    border: 1px solid #66CCFF !important;
}
.actionIsNo{
    border:none;
}
</style>
