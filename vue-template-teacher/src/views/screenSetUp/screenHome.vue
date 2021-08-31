<template>
    <div class="screen-index">
        <el-row class="lLine40 headerDiv">
            <el-col>
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
        </el-row> 
        <div class="screenLayout">
            <div class="screen-left"> 
                <div style="margin-bottom:20px;width:482px;" @click="selectPluge(item,index)" :class="actionIndex==index?'borderColor1':''" v-for="(item,index) in homeDateArrey" :key="index">
                    <screenStyle :data="item"/>
                </div>
               <el-button size="small" @click="addScreenObjs()" style="margin:0 auto;display: block;margin-bottom:60px;" type="primary">添加栏目</el-button>
               <div style="text-align:center">
                   <el-button size="small" v-if="$authJudge('wisdomscreen:setsavesort')" @click="saveHomePageSort" type="primary">保存</el-button>
                   <el-button size="small" type="info" @click="noNedHomePageSort" plain>取消</el-button>
               </div>
            </div>
            <div class="screen-right" v-if="styleType">
                <screenSetUpStyle :data="selectItem" :indexs="actionIndex" @saveChange='saveChangeEven' @styleChange="styleChangeEven"/>
            </div>
            <div class="module-edit-btns" v-if="homeDateArrey.length>0?true:false">
                <!-- <p @click="sortUp" class='allow-move-up'><i class="el-icon-caret-top"></i><span>上移</span></p>
                <p @click="sortBottom" class='allow-move-down'><i class="el-icon-caret-bottom"></i><span>下移</span></p> -->
                <p @click="delModule"><i class="el-icon-delete"></i><span>删除</span></p>
            </div>            
        </div>   
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <span>您有未保存的信息，离开后会丢失，确认要离开吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="leavePage">确 定</el-button>
            </span>
        </el-dialog>           
    </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import screenStyle from './screenStyle';
import screenSetUpStyle from './screenSetUpStyle';
import seriesCourse2 from "../../assets/images/ys1.png";
export default {
    data() {
        return {
            seriesCourse2:seriesCourse2,
            actionIndex:-1,
            titleList:[
                {
                    name:'大屏设置',
                    pathInfo:'/screenIndex/equite'
                },
                {
                    name:'首页设置',
                    pathInfo:''
                }
            ],
            homeDateArrey:[],
            styleType:false,
            selectItem:{},
            targetId:'',
            homeCloumnId:'',        
            dialogVisible:false,
            modelChangeType:false,
            leavePath:'',
            isNewCreatNoDataObj:false,
            delModuleIds:[],
            disabledState:false
        };
    },
    created(){
        this.getScreeColumnList();
    },
    beforeRouteLeave (to, from, next){
        this.leavePath = to.fullPath;
        if(this.styleType||this.modelChangeType){
            this.dialogVisible = true;
            next(false);
            return;
        }else{
            next();
        }
    },    
    components:{
        breadcrumb,
        screenStyle,
        screenSetUpStyle
    },    
    methods: {
        /**
         * 离开页面
         */
        leavePage(){
            this.modelChangeType = false;
            this.styleType = false;
            this.dialogVisible = false;
            setTimeout(()=>{
                this.$router.push(this.leavePath)
            },1)
        },        
        //取消
        noNedHomePageSort(){
            if(this.styleType){
                this.styleType = false;
            }
            function checked(data){
                if(data.hasOwnProperty('id')){
                     return data;
                }
            }
            var newArry = this.homeDateArrey.filter(checked);
            this.homeDateArrey = newArry;
            this.isNewCreatNoDataObj=false;
        },
        //首页保存顺序
        saveHomePageSort(){
            var that = this;
            if(that.styleType){
                that.$message.error("请保存配置界面");
                return;
            }
            let query = {
                delModuleIds:that.delModuleIds.length>0?that.delModuleIds.toString():'',
                id:this.homeCloumnId,
                name:'智慧屏'
            }   
            let list1 = [];let list2 = [];
            if(this.homeDateArrey.length>0){
                this.homeDateArrey.forEach((element,index)=>{
                    if(element.hasOwnProperty('id')){
                        query['appHomeSubModuleInfoFormList['+index+'].id'] = element.id;
                        query['appHomeSubModuleInfoFormList['+index+'].sort'] = index+1;
                    }else{
                        that.isNewCreatNoDataObj = true;
                    }
                });
                if(that.isNewCreatNoDataObj){
                    that.$message.error("请配置数据");
                    return;                    
                }
                if(!that.disabledState){
                    that.disabledState = !that.disabledState;
                    that.$http.post(that.$server.getSaveSubModuleSort,query).then(res=>{
                        if(res.status==200){
                            that.$message.success("保存成功");
                            that.disabledState = !that.disabledState;
                            that.modelChangeType = false;
                            that.isNewCreatNoDataObj=false;
                            that.delModuleIds = [];
                        }
                    }).catch(()=>{
                        that.disabledState = !that.disabledState;
                    })                    
                }
            }else{
                that.$message.error("没有模块数据");
            }     
        },
        //查询智慧屏首页栏目列表
        getScreeColumnList(){
            var that = this;
            that.$http.get(`${this.$server.getColumnListType}/5`).then(res=>{
                if(res.status==200){
                    var data = res.content[0];
                    this.homeCloumnId = data.id;
                    this.getHomeDataList(data.id);
                }
            })              
        },
        //获取首页数据
        getHomeDataList(id){
            var that = this;
            var params = {       
                type:5,
                subType:id    
            };
            that.$http.get(that.$server.getAppHomePage,{params}).then(res=>{
                if(res.status==200){
                    var datalist = res.content;
                    datalist.forEach(element => {
                        that.homeDateArrey.push(
                            {
                                style:element.style,
                                id:element.id,
                                title:element.name
                            }
                        );
                    });
                }
            })                        
        },
        //保存；
        saveChangeEven(data){
            this.homeDateArrey[data.index].title=data.title;
            this.homeDateArrey[data.index]['id']=data.id;
            this.styleType = false;
            this.modelChangeType = true;
        },
        //改变样式
        styleChangeEven(data){
            this.homeDateArrey[data.index].style=data.type;
            this.modelChangeType = true;
        },
        //选中
        selectPluge(data,indexs){         
            this.actionIndex = indexs;    
            if(this.styleType){
                this.styleType = false;
            }  
            if(data.hasOwnProperty('id')){ 
                this.$http.get(`${this.$server.subScreenModuleInfoList}/${data.id}`).then(res=>{
                    if(res.status==200){
                        this.targetId = res.content.targetId;
                        var dataInfo = res.content;
                        let temp1 = [];
                            let json1 = {
                                id:dataInfo.id,
                                homeCloumnId:dataInfo.homeCloumnId,
                                data:[],
                                name:dataInfo.name||'',
                                imgHeader:dataInfo.styleImgUrl,
                                num:dataInfo.num,
                                type:dataInfo.type,
                                screenType:dataInfo.screenType||1,
                                style:dataInfo.style,
                                targetId:dataInfo.targetId
                            }
                            let arr1 = [];
                            if(dataInfo.ahprrList.length>0){
                                res.content.ahprrList.forEach((option,i)=>{
                                    arr1.push({
                                        surfacePlot:option.imgUrl,
                                        title:option.title,
                                        id:option.targetId,
                                        isAllClassHour:option.planPeriodNum,
                                        assemblePrice:option.courseSellingPrice,
                                        classHour:option.actualPeriodNum
                                    })
                                }) 
                                json1.data = arr1;
                            }
                        this.selectItem=json1;
                        this.styleType = true;
                    }
                })
            }else{
                setTimeout(()=>{
                    this.selectItem = data;
                    this.styleType = true;
                },400);

            }
        },        
        //添加
        addScreenObjs(){
            this.modelChangeType = true;
            this.homeDateArrey.push(
                {
                    homeCloumnId:this.homeCloumnId,
                    title:'',
                    imgHeader:'',
                    style:1,
                    targetId:''
                }
            );
        },
        // //上移
        // sortUp(){},
        // //下移
        // sortBottom(){},
        //删除
        delModule(){
            if(this.styleType){
                this.styleType = false;
            }
            var removeData = this.homeDateArrey.splice(this.actionIndex,1);
            if(removeData[0].hasOwnProperty('id')){
                this.delModuleIds.push(removeData[0].id);
            }
            this.isNewCreatNoDataObj=false;
            this.$message.success("已删除");
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../components/formSynthesisPlugin/my-component.css";
.screenLayout{
    display: flex;
    flex-direction: row;
    justify-content:flex-start;
    .screen-left{
        width: 502px;
        border: 1px solid #fff;
        padding: 10px;        
        max-height: 700px;
        overflow-y: auto;
    }
    .screen-right{
        max-height: 700px;
        overflow-y: auto;        
        width: 520px;
        margin-left: 60px;
        background: #fff;
        padding: 15px;
    } 
    .module-edit-btns{
        width: 40px;
        padding: 10px 0;
        position: absolute;
        text-align: center;
        z-index: 1;
        transform: translateX(-50px);
        left: 582px;
        // top: 200px;
        top: 280px;
        transition: all 0.3s;
        >p{
            margin:5px 0;
            cursor: not-allowed;
            background: #fff;
            padding: 3px 0;
            border-radius: 5px;
            &.allow-move-up,&.allow-move-down{
                cursor: pointer;
            }
            &:last-child{
                cursor: pointer;
            }
        }
        span{
            display: block;
            font-size: 14px;
            color:rgb(180, 39, 45);
            margin-top:-2px;
        }
        i{
            font-size: 22px;
            color:rgb(180, 39, 45);
        }
    }       
}
.borderColor1{
    border: 1px solid #9E0E00;
}
</style>
