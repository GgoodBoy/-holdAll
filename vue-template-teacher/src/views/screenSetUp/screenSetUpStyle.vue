<template>
    <div>       
        <el-row class="lLine40 headerDiv">
            <el-col style="text-align: right">
                <el-button size="small" type="primary" @click="saveSetUp" v-if="$authJudge('wisdomscreen:setsave')">保存</el-button>
            </el-col>
            <el-col>
                <div class="div-layout">
                    <div class="setUpName">模块名称:</div>
                    <div style="display: flex;flex-direction: row;">
                        <el-input v-model="input" :maxlength="10" placeholder=""></el-input>
                        <div style="margin-left:10px;">{{input.length||0}}/10</div>
                    </div>
                </div>
                <div class="div-layout">
                    <div class="setUpName">模块样式:</div>
                    <div>
                        <el-select v-model="value" style="width:190px" placeholder="请选择"  @change="currentSelect(1)">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>                        
                    </div>
                </div>
                <div class="div-layout">
                    <div class="setUpName">展示数量:</div>
                    <div>{{coursrNum}}</div>
                </div>
                <div class="div-layout">
                    <div class="setUpName">分类:</div>
                    <div>
                        <el-select v-model="valueOne" style="width:190px" placeholder="请选择"  @change="currentSelect(2)">
                            <el-option
                            v-for="item in optionsOne"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select> 
                        <el-select v-model="valueTwo" style="width:190px" placeholder="请选择"  @change="currentSelect(3)">
                            <el-option
                            v-for="item in optionsTwo"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>                         
                    </div>
                </div>                                                
            </el-col>  
            <el-col style="text-align: left">
                <el-button style="margin-left:70px;" @click="selectCourselist" size="small" type="primary">选择课程</el-button>
            </el-col> 
            <el-col style="text-align: left;">
               <div class="courseBox" v-for="(itme,index) in imgList" :key="index">
                   <div class="course-img">
                       <img :src="itme.surfacePlot"/>
                   </div>
                   <div class="course-text">
                       <div>{{itme.title}}</div>
                       <div><span>已更新{{itme.classHour||0}}节</span><span>/</span><span></span>共{{itme.isAllClassHour||0}}节</div>
                       <div>￥{{itme.assemblePrice}}元</div>
                   </div>
                   <i class="removeIcon el-icon-close" @click="removeSelectCourse(itme,index)"></i>
                   <div class="moveSort">
                       <i class="el-icon-caret-top" @click="topMoveCourse(itme,index)"></i>
                       <i class="el-icon-caret-bottom" @click="bottomMoveCourse(itme,index)"></i>
                   </div>
               </div>
            </el-col>                                  
        </el-row>   
        <el-dialog  :custom-class="'edit-dialog'" 
                    :visible.sync="editDialogVisible" 
                    :width="'500px'" 
                    :show-close="false"
                    :close-on-click-modal="false">
            <div style="margin-bottom:20px;">
                <el-radio-group  
                    v-model="checkedCities" @change="changePlugin">
                    <el-radio v-for="(city,index) in cities" :label="city.value" :key="index">{{city.name}}</el-radio>
                </el-radio-group>                  
            </div>                     
            <div class="search-box">
                <el-input placeholder="输入课程名称查询" size="medium" clearable prefix-icon="el-icon-search" v-model="searchKey" maxlength="10"></el-input>
                <el-button type="primary" style="margin-left:5px;" size="medium" @click="search">搜索</el-button>
            </div>
            <div class="list" ref="scrollBox">
                <el-checkbox-group 
                    v-model="dialogArr"
                    :min="0"
                    :max="EditDialogMaxNum">
                    <div class="item nameTextEllipsis" v-for="(item,index) in editDialogListNext" :key="index">
                        <el-checkbox :label="item.id" :disabled="item.disabled">{{item.title}}</el-checkbox>
                        <div style='font-size:14px;'>{{item.sellingPrice||0}}币</div>
                    </div>
                </el-checkbox-group>
                <div class="loading" v-show="loading"><div class="loading-icon" v-loading="true"></div></div>
                <p class="empty-tip" v-if="editDialogListNext.length==0">没有搜索到您想要的内容</p>
            </div>
            <div slot="footer" class="btns">
                <el-button @click="dialogSureCloe()" size="medium">取消</el-button>
                <el-button type="primary" @click="dialogSure" size="medium">确定</el-button>
            </div>
        </el-dialog>         
    </div>    
</template>

<script>
import seriesCourse2 from "../../assets/images/seriesCourse2.png";
export default {
    data() {
        return {
            editDialogVisible:false,
            seriesCourse2:seriesCourse2,
            imgList:[],
            value:1,
            valueOne:'',
            valueTwo:'',
            input:'',
            coursrNum:0,
            options:[
                {
                    value:1,
                    label:'样式一'
                },
                {
                    value:2,
                    label:'样式二'
                }                
            ],
            optionsOne:[                
                {
                    value:1,
                    label:'成人'
                },
                {
                    value:2,
                    label:'少儿'
                }                
            ],
            optionsTwo:[],
            loading:false,                     
            editDialogList:[],
            editDialogListNext:[],
            dialogArr:[],
            EditDialogMaxNum:6,
            searchKey:'',
            courseCheckList:[],
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
        };
    },
    props:['data','indexs'],
    created(){
        this.inits(this.data);
    },
    watch:{   
        dialogArr(cur,old){
            if(this.editDialogList.length>0){
                this.courseCheckList =[];
                cur.forEach((item)=>{
                    let obj = this.editDialogList.find(option=>option.id==item);
                    if(obj){
                        this.courseCheckList.push({
                            id:obj.id,
                            isAllClassHour:obj.isAllClassHour,
                            classHour:obj.classHour,
                            assemblePrice:obj.sellingPrice,
                            title:obj.title,
                            surfacePlot:obj.surfacePlot
                        })
                    }
                })
            }
        }        
    },
    methods: {
        changePlugin(){
            this.editDialogListNext = []             
            // this.checkedCitiesVal = this.checkedCities.toString();
            this.selectCourselist()          
        },        
        inits(data){       
                if(data.hasOwnProperty('id')){
                    this.value = data.style;
                    this.valueTwo= data.targetId;
                    this.input = data.name;
                    this.valueOne = data.screenType;
                    this.imgList = data.data;
                    this.coursrNum = data.num;                     
                    this.getCourseClassifylist(this.valueOne);
                    this.imgList.forEach((element,index)=>{
                        this.dialogArr.push(Number(element.id));
                    });
                }else{
                    this.value = data.style;
                    this.valueTwo= '';
                    this.input = '';
                    this.valueOne = '';
                    this.imgList = [];
                    this.coursrNum = 0;
                    this.dialogArr=[];                       
                }            
        },          
        ////查询一级或二级的分类（按成人或少儿）
        saveSetUp(){
            var that = this;
            if(!that.input){
                that.$message.error("输入模块名称");
                return;
            }
            if(!this.imgList.length){
                that.$message.error("请选择课程");
                return;
            }
            if(!this.value){
                that.$message.error("请选择样式");
                return;
            }                     
            let query = {
                homeCloumnId:this.data.homeCloumnId,
                name:this.input,
                type:5,
                subModule:1,
                style:this.value,
                styleImgUrl:this.data.imgHeader,
                num:this.imgList.length,
                targetId:this.valueTwo,
            }
            if(this.data.hasOwnProperty('id')){
                query['id'] = this.data.id;
            }
            this.imgList.forEach((item,index)=>{
                query['appHomeRelationRecordFormList['+index+'].title'] = item.title;
                query['appHomeRelationRecordFormList['+index+'].type'] = 1;
                query['appHomeRelationRecordFormList['+index+'].targetId'] = item.id;
                query['appHomeRelationRecordFormList['+index+'].sort'] = index+1;
            });
            that.$http.post(that.$server.getSaveSubModule,query).then(res=>{
                if(res.status==200){
                    that.$message.success("保存成功");
                    setTimeout(()=>{
                        that.$emit('saveChange',{title:that.input,index:that.indexs,id:res.content.subModuleId});
                    },200);
                }
            })            
        },
        selectCourselist(){
            var that = this;
            var params = {      
                classId:this.valueTwo,
                title:'',
                courseSource:this.checkedCities
            };
            that.editDialogList = [];
            that.$http.get(that.$server.getModelCourseList,{params}).then(res=>{
                if(res.status==200){
                    res.content.forEach((element,index)=>{
                        that.editDialogList.push({
                            sellingPrice:element.sellingPrice,
                            title:element.title,
                            classHour:element.actualPeriodNum,
                            surfacePlot:element.surfacePlot,
                            id:element.id,
                            isAllClassHour:element.planPeriodNum
                        });
                    });
                    this.editDialogListNext = that.editDialogList;
                    that.editDialogVisible = true;
                }
            })
        },
        dialogSure(){
            this.editDialogList =[];   
            this.imgList =[]; 
            this.dialogArr = [];
            this.imgList = this.courseCheckList; 
            this.coursrNum = this.imgList.length;
            this.editDialogVisible = false; 
            this.imgList.forEach((element,index)=>{
                this.dialogArr.push(Number(element.id));
            });           
        },
        dialogSureCloe(){
            this.editDialogList =[];
            this.dialogArr =[];
            this.editDialogVisible = false;
        },
        search(){
            var that = this;
            var list = [];
            that.editDialogList.forEach((element)=>{
                if(element.title.indexOf(that.searchKey)!=-1){
                    list.push(element);
                }
            });
            this.editDialogListNext = list;
        },
        //选择样式
        currentSelect(type){
            var that = this;
            switch (type) {
                case 1:
                    this.$emit('styleChange',{type:that.value,index:that.indexs,title:that.input});
                    break;
                case 2:
                    this.imgList =[];
                    this.optionsTwo = [];
                    this.valueTwo ='';
                    this.coursrNum  ='';
                    this.getCourseClassifylist(that.valueOne);
                    break;
                case 3:
                    this.coursrNum ='';
                    this.imgList =[];
                    this.dialogArr =[];
                    break;                                
                default:
                    break;
            }
        },
        //根据成人少儿获取分类
        getCourseClassifylist(type){
            var that = this;
            that.$http.get(`${that.$server.getModelClassifyList}/${type}`).then(res=>{
                if(res.status==200){
                    res.content.forEach((element,index)=>{
                        that.optionsTwo.push({
                            label:element.name,
                            value:element.id
                        });
                    });
                }
            }) 
        },
        topMoveCourse(data,index){ 
            if(index!=0){
                this.imgList.splice(index-1,1,...this.imgList.splice(index, 1 , this.imgList[index-1]))
            }else{
                this.$message.error('当前不能排序');
            }
        },
        bottomMoveCourse(data,index){
            if(index!=this.imgList.length-1){
                this.imgList.splice(index+1,1,...this.imgList.splice(index, 1 , this.imgList[index+1]))
            }else{
                this.$message.error('当前不能排序');
            }
        },
        //删除选中的课程
        removeSelectCourse(item,index){
            this.imgList.splice(index,1);
            this.dialogArr.splice(index,1);          
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../components/formSynthesisPlugin/my-component.css";
.div-layout{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 15px;
    .setUpName{
        width: 60px;
        text-align: right;
        line-height: 40px;
        margin-right: 10px;
    }
}
.courseBox{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-left:70px;
    width:384px;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 6px;    
    position: relative;
    margin-bottom: 10px;
    .moveSort{
        position: absolute;
        right: -16px;
        font-size: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        top: 30px;
    }
    .moveSort i:hover{
        color: crimson;
        cursor: pointer;
    }
    .removeIcon{
        position: absolute;
        font-size: 16px;
        color: #666;
        top: 0px;
        right: 0px;
    }
    .course-img{
        width: 142px;
        height: 81px;
        overflow: hidden;
        img{
            width: 100%;
        }        
    }
    .course-text{
        padding: 0 15px;
        width: 220px;
        div{
            line-height: 20px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;            
            font-size: 12px;
            color: #666;           
        }
    }
}
.search-box{
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
}
.list{
    max-height: 500px;
    overflow-y: auto;
    .empty-tip{
        text-align: center;
        line-height: 30px;
    }
}
.btns{
    text-align: center;
}
.nameTextEllipsis{
    display: flex;
    flex-direction: row;
    justify-content: space-between; 
}
.item{
    margin-bottom: 10px;
}
</style>
