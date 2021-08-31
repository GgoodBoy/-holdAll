<template>
    <div class="wCourseGroupEdit wModelEdit">
        <div class="wCourseGroup-head">
            <div class="edit1">
                <div>课程分组设置</div>
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
        <div class="wCourseGroup-style-one">
            <div class="edit1">
                <div class="courseEdit1">
                    <div class="rows1 layouts" style="position: relative;">
                        <div class="beforeCss">菜单名称1</div>
                        <div class="contents">
                            <el-input placeholder="请输入标题" maxlength="10" show-word-limit style="width:300px" v-model="courseGroupMoel.courseGroupTitleOne"></el-input>
                            <div class="colorError" v-show="errorTips==1">请输入菜单名称</div>
                        </div>
                    </div>
                    <div class="rows2 layouts">
                        <div>课程</div>
                        <div>
                            <el-button size="small" type="primary" @click="selectCourse(1)">选择课程</el-button>
                            <div>{{courseGroupMoel.style==1?"最多可选中50门课程,左右两个分组课程数尽量相同":"最多可选中50门课程，推荐2的倍数个课程"}}</div>
                            <div>已选中{{courseGroupMoel.microPageRelationRecordListOne.length||0}}门</div>                                              
                        </div>                    
                    </div>
                    <div class="rows3">
                        <draggable v-model="courseGroupMoel.microPageRelationRecordListOne" @change="changeOne" @start="startOne" @end="endOne" :move="moveOne">
                            <div class="rows3draggable" v-for="(item,index) in courseGroupMoel.microPageRelationRecordListOne" :key='index'>
                                {{item.courseName}}
                                <i class="el-icon-circle-close" @click="deletes(item,index,1)"></i>
                            </div>
                        </draggable>
                    </div>
                </div>
                <div class="courseEdit1">
                    <div class="rows1 layouts"  style="position: relative;">
                        <div class="beforeCss">菜单名称2</div>
                        <div class="contents">
                            <el-input placeholder="请输入标题" style="width:300px" maxlength="10" show-word-limit v-model="courseGroupMoel.courseGroupTitleTwo"></el-input>
                            <div class="colorError" v-show="errorTips==2">请输入菜单名称</div>
                        </div>
                    </div>
                    <div class="rows2 layouts">
                        <div>课程</div>
                        <div>
                            <el-button size="small" type="primary" @click="selectCourse(2)">选择课程</el-button>
                            <div>{{courseGroupMoel.style==1?"最多可选中50门课程,左右两个分组课程数尽量相同":"最多可选中50门课程，推荐2的倍数个课程"}}</div>
                            <div>已选中{{courseGroupMoel.microPageRelationRecordListTwo.length||0}}门</div>                                              
                        </div>                    
                    </div>
                    <div class="rows3">
                        <draggable v-model="courseGroupMoel.microPageRelationRecordListTwo" @change="changeTwo" @start="startTwo" @end="endTwo" :move="moveTwo">
                            <div class="rows3draggable" v-for="(item,index) in courseGroupMoel.microPageRelationRecordListTwo" :key='index'>
                                {{item.courseName}}
                                <i class="el-icon-circle-close" @click="deletes(item,index,2)"></i>
                            </div>
                        </draggable>
                    </div>
                </div>                
            </div>
            <div class="edit2">
                <div class="edit1Grout">
                    <div class="layouts">
                        <div>对齐方式</div>
                        <div v-if="courseGroupMoel.layouts==1">左对齐</div>
                        <div v-else-if="courseGroupMoel.layouts==2">居中对齐</div>
                        <div v-else>右对齐</div>
                    </div>
                    <div class="alignmentEdit">
                        <div :class="[courseGroupMoel.layouts==1?'actionIsOk':'actionIsNo']" @click="setUpCourseGroupStyle('layouts',1)">
                            <img src='../../../../assets/wxImg/layout-left.png' />
                        </div>
                        <div :class="[courseGroupMoel.layouts==2?'actionIsOk':'actionIsNo']" @click="setUpCourseGroupStyle('layouts',2)">
                            <img src='../../../../assets/wxImg/layout-center.png' />
                            </div>
                        <div :class="[courseGroupMoel.layouts==3?'actionIsOk':'actionIsNo']" @click="setUpCourseGroupStyle('layouts',3)">
                            <img src='../../../../assets/wxImg/layout-right.png' />
                        </div>                    
                    </div>
                </div>
                <div class="edit3Grout">
                    <div class="layouts">
                        <div>标题显示</div>
                        <div>{{courseGroupMoel.courseGroupTitleIsShow?'显示':'不显示'}}</div>
                    </div>
                    <div class="colorEdit">
                        <el-checkbox v-model="courseGroupMoel.courseGroupTitleIsShow">显示</el-checkbox>
                    </div>
                </div> 
                <div class="edit2Grout">
                    <div class="layouts">
                        <div>标题加粗</div>
                        <div>{{courseGroupMoel.courseGroupTitleBold?'加粗':'正常'}}</div>
                    </div>
                    <div class="sizeEdit">
                        <div :class="[courseGroupMoel.courseGroupTitleBold==true?'actionIsOk':'actionIsNo']" @click="setUpCourseGroupStyle('courseGroupTitleBold',true)" style="font-weight:bold">B</div>
                        <div :class="[courseGroupMoel.courseGroupTitleBold==false?'actionIsOk':'actionIsNo']" @click="setUpCourseGroupStyle('courseGroupTitleBold',false)">B</div>                    
                    </div>
                </div>
                <div class="edit3Grout">
                    <div class="layouts">
                        <div>描述显示</div>
                        <div>{{courseGroupMoel.describeIsShow?'显示':'不显示'}}</div>
                    </div>
                    <div class="colorEdit">
                        <el-checkbox v-model="courseGroupMoel.describeIsShow">显示</el-checkbox>
                    </div>
                </div> 
                <div class="edit3Grout">
                    <div class="layouts">
                        <div>价格显示</div>
                        <div>{{courseGroupMoel.moneyIsShow?'显示':'不显示'}}</div>
                    </div>
                    <div class="colorEdit">
                        <el-checkbox v-model="courseGroupMoel.moneyIsShow">显示</el-checkbox>
                    </div>
                </div> 
                <div class="edit3Grout">
                    <div class="layouts">
                        <div>购买按钮</div>
                        <div>{{courseGroupMoel.butIsShow?'显示':'不显示'}}</div>
                    </div>
                    <div class="colorEdit">
                        <el-checkbox v-model="courseGroupMoel.butIsShow">显示</el-checkbox>
                    </div>
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
    name:'wxCourseGroupEdit',
    props:['modeEditInfo','indexModel'],
    data(){
        return{
            checked:true,
            courseIds:[],
            courseIds1:[],
            courseIds2:[],
            urls:'/microPage/searchCourseList',
            dialogVisibleFour:false,
            errorTips:0,
            //新组建
            varObj:{
                pageType:true//是否分页
            },         
            couserBool:false,
            courseList:[],
            courseGroupMoel:{
                style:1,//样式
                layouts:2,//对齐
                courseGroupTitleBold:true,//标题加粗
                courseGroupTitleIsShow:true,//标题显示
                describeIsShow:true,//描述显示
                moneyIsShow:true,//价格显示
                butIsShow:true,//购买按钮
                microPageRelationRecordList:[],//选择课程列表
                microPageRelationRecordListOne:[],
                microPageRelationRecordListTwo:[],
                courseGroupTitleOne:'',
                courseGroupTitleTwo:''              
            },
            courseGroupListIndex:'',
            styleIndex:''    
        }
    },
    created(){
        if(this.modeEditInfo.content){
            let contents = JSON.parse(this.modeEditInfo.content);
            var contentType =typeof contents;
            if(contentType==='string'){
                contents = JSON.parse(contents);
            }            
            console.log("this.modeEditInfo",this.modeEditInfo);
            this.styleIndex = this.modeEditInfo.style;
            this.courseGroupMoel={
                style:this.modeEditInfo.style||1,//样式
                layouts:contents.layouts||1,//对齐
                courseGroupTitleIsShow:contents.courseGroupTitleIsShow||false,//标题显示
                courseGroupTitleBold:contents.courseGroupTitleBold||false,//标题加粗
                describeIsShow:contents.describeIsShow||false,//描述显示
                moneyIsShow:contents.moneyIsShow||false,//价格显示
                butIsShow:contents.butIsShow||false,//购买按钮
                microPageRelationRecordList:this.modeEditInfo.microPageRelationRecordList,//选择课程列表
                courseGroupTitleOne:contents.courseGroupTitleOne,
                courseGroupTitleTwo:contents.courseGroupTitleTwo,
                microPageRelationRecordListOne:this.fiterCourseList(this.modeEditInfo.microPageRelationRecordList,1),
                microPageRelationRecordListTwo:this.fiterCourseList(this.modeEditInfo.microPageRelationRecordList,2),     
            }
            this.returnCourseId(this.courseGroupMoel.microPageRelationRecordListOne,1);
            this.returnCourseId(this.courseGroupMoel.microPageRelationRecordListTwo,2);
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
        //设置返回课程回填id
        returnCourseId(data,name){
            let list = [];
            if(data.length>0){
                data.forEach((element,index)=>{
                    list.push(element.targetId);
                });
            }    
            this['courseIds'+name] = list;  
        },
        changeOne(evt) {
            console.log('change...',evt)
        },
        startOne(evt) {
            console.log('start...',evt)
        },
        endOne(evt) {
            console.log('end....',evt);
            this.courseGroupMoel.microPageRelationRecordListOne = this.setNewSortData(this.courseGroupMoel.microPageRelationRecordListOne);
        },
        moveOne(evt, originalEvent) {
            console.log('move',evt)
            console.log('originalEvent',originalEvent) //鼠标位置
        },


        changeTwo(evt) {
            console.log('change...',evt)
        },
        startTwo(evt) {
            console.log('start...',evt)
        },
        endTwo(evt) {
            console.log('end....',evt);
            this.courseGroupMoel.microPageRelationRecordListTwo = this.setNewSortData(this.courseGroupMoel.microPageRelationRecordListTwo);
        },
        moveTwo(evt, originalEvent) {
            console.log('move',evt)
            console.log('originalEvent',originalEvent) //鼠标位置
        },

        //删除
        deletes(data,index,type){
            if(type==1){
                this.courseIds1=[];
                this.courseGroupMoel.microPageRelationRecordListOne.splice(index,1);
                if(this.courseGroupMoel.microPageRelationRecordListOne.length>0){
                    this.courseGroupMoel.microPageRelationRecordListOne.forEach((element,index)=>{
                       this.courseIds1.push(element.targetId);
                    });
                }               
            }else{
                this.courseIds2=[];
                this.courseGroupMoel.microPageRelationRecordListTwo.splice(index,1);
                if(this.courseGroupMoel.microPageRelationRecordListTwo.length>0){
                    this.courseGroupMoel.microPageRelationRecordListTwo.forEach((element,index)=>{
                       this.courseIds2.push(element.targetId);
                    });
                }   
            }
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

        selectType(type){
            this.courseGroupMoel={
                style:type,//样式
                layouts:2,//对齐
                courseGroupTitleBold:true,//标题加粗
                courseGroupTitleIsShow:true,//标题显示
                describeIsShow:true,//描述显示
                moneyIsShow:true,//价格显示
                butIsShow:true,//购买按钮
                microPageRelationRecordList:[],//选择课程列表
                microPageRelationRecordListOne:[],
                microPageRelationRecordListTwo:[],
                courseGroupTitleOne:'',
                courseGroupTitleTwo:''   
            };
            this.errorTips=0;
            this.courseIds=[];
            this.courseIds1=[];
            this.courseIds2=[];   
            this.courseList=[];         
            this.styleIndex=type;   
            this.courseGroupListIndex='';         
        },
        setUpCourseGroupStyle(type,data){
            this.courseGroupMoel[type]=data;
        },
        //保存
        seave(){
            this.errorTips=0;
            if(!this.courseGroupMoel.courseGroupTitleOne){
                this.errorTips=1;
                return;
            }else if(!this.courseGroupMoel.courseGroupTitleTwo){
                this.errorTips=2;
                return;
            }
            let rightwxStoreData=this.wxStore.wxRightData;
            let leftwxStoreData=this.wxStore.wxLeftData;
            let rightdata = rightwxStoreData[this.indexModel];
            let leftdata = leftwxStoreData[this.indexModel];  
            //第一步分开左右两边数组
            let contebtStr = JSON.stringify({
                        layouts:this.courseGroupMoel.layouts,//对齐
                        courseGroupTitleIsShow:this.courseGroupMoel.courseGroupTitleIsShow,//标题显示
                        courseGroupTitleBold:this.courseGroupMoel.courseGroupTitleBold,//标题加粗
                        describeIsShow:this.courseGroupMoel.describeIsShow,//描述显示
                        moneyIsShow:this.courseGroupMoel.moneyIsShow,//价格显示
                        butIsShow:this.courseGroupMoel.butIsShow,//购买按钮
                        courseGroupTitleOne:this.courseGroupMoel.courseGroupTitleOne,
                        courseGroupTitleTwo:this.courseGroupMoel.courseGroupTitleTwo
            });            
            let leftNewData= {
                    id:leftdata.id,
                    microPageId:leftdata.microPageId,
                    action:true,
                    style:this.courseGroupMoel.style,
                    sort:leftdata.sort,
                    subModule:leftdata.subModule,
                    addLeftId:leftdata.addLeftId,
                    newType:false
                };
            let rightNewData= {
                    id:rightdata.id,
                    microPageId:rightdata.microPageId,
                    style:this.courseGroupMoel.style,
                    sort:rightdata.sort,
                    subModule:rightdata.subModule,
                    addRightId:rightdata.addRightId,
                    microPageRelationRecordList: this.setNewSortData(this.courseGroupMoel.microPageRelationRecordListOne).concat(this.setNewSortData(this.courseGroupMoel.microPageRelationRecordListTwo)),  
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
        },
        //过滤的方法
        fiterCourseList(data,type){
            return this.modeEditInfo.microPageRelationRecordList.filter((item,index)=>{
                return (item.groupType == type);
            })
        },
        //选择课程
        selectCourse(type){
            this.dialogVisibleFour=true;
            this.courseGroupListIndex=type;
            if(type==1){
                this.courseIds=this.courseIds1||[];
                sessionStorage.setItem('courseReturnListVal',JSON.stringify(this.courseGroupMoel.microPageRelationRecordListOne));
            }else{
                this.courseIds=this.courseIds2||[];
                sessionStorage.setItem('courseReturnListVal',JSON.stringify(this.courseGroupMoel.microPageRelationRecordListTwo));
            }
        },
        listSelectEven(data){
            var self = this;
            if(data.bool){
                if(self.courseGroupListIndex==1){
                    self.courseIds1 = [];
                }else{
                    self.courseIds2 = [];
                }
                // self.$store.state.appConfig.appStore.boolpluginForDetail=false;
                self.dialogVisibleFour = false;
                self.courseList = data.datas;
                let listCourse = [];
                data.datas.forEach((element,index)=>{
                    listCourse.push({
                        courseName:element.courseName,
                        targetId:element.content,
                        id:self.modeEditInfo.microPageId,
                        microPageDetailId:self.modeEditInfo.id,
                        type:1,
                        sort:index+1,
                        groupType:self.courseGroupListIndex
                    })
                });       
                if(self.courseGroupListIndex==1){
                    self.courseGroupMoel.microPageRelationRecordListOne = listCourse;
                }else{
                    self.courseGroupMoel.microPageRelationRecordListTwo = listCourse;
                }
                if(listCourse.length){
                    self.couserBool = false;
                }
                listCourse.forEach(element => {
                    if(self.courseGroupListIndex==1){
                        self.courseIds1.push(element.targetId)
                    }else{
                        self.courseIds2.push(element.targetId)
                    }
                });
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
.wCourseGroupEdit{
    font-size: 14px;
    >div{
        border-bottom: 1px solid #f4f4f4;
        padding: 15px 0;
        
    }
    .wCourseGroup-head{
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
                    background: url('../../../../assets/wxImg/group_l_1.png')no-repeat 50% 50% /cover;
                }
                .style2{
                    background: url('../../../../assets/wxImg/group_l_2.png')no-repeat 50% 50% /cover;
                }
            }         
        }
    } 
    .wCourseGroup-style-one{
        .edit1{
            border-bottom: 1px solid #f4f4f4;
            padding: 15px;
            .courseEdit1{
                .layouts{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content:flex-start;
                    margin-bottom: 20px;
                    .beforeCss:before {
                        content: '* ';
                        color: red;
                        position: absolute;
                        top: 17px;
                        left: -6px;
                    }
                    div:nth-child(1){
                        width: 100px;
                        text-align: left;
                    }
                    &.rows2{
                        div:nth-child(2){
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content:space-evenly;    
                        >div,button{
                            margin-right: 30px;
                            }           
                        }                    
                    }
                }
                .rows3{
                    max-height: 200px;
                    overflow: scroll;
                    margin-top: 20px;
                    padding: 10px;
                    width: 500px;
                    margin-left: 90px;                
                    .rows3draggable{
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
        .edit2{
            padding: 0 20px;
            margin-top: 15px;
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
            .edit1Grout{
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
#colorError{
    color:#9E0E00;
    position:absolute;
}
.wCourseGroup-style-one .edit1 .courseEdit1 .layouts .contents .el-input .el-input__suffix,
.wCourseGroup-style-two .edit1 .courseEdit1 .layouts .contents .el-input .el-input__suffix{
    right: -40px !important;    
}
</style>
