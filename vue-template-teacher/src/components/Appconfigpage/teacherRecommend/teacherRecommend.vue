<template>
    <div class="free-course">
        <p class="tips">本模块最多添加<span>12个老师</span></p>
        <!-- <div class="module-name">
            <label>模块名称</label>
            <div class="input-area"><el-input size="medium" v-model="moduleName" maxlength="10"></el-input></div>
        </div> -->
        <div class="select-course">
            <p>老师</p>
            <el-button type="primary" size="medium" @click="showDialog">选择老师</el-button>
        </div>
        <div class="edit-list">
            <div class="edit-item type2 clearfix" v-for="(item,index) in curEditData" :key="index">
                <div class="teacher">
                    <!-- <img :src="item.imgUrl"/> -->
                    <p>{{item.name}}</p>
                </div>
                <div class="btns">
                    <div class="del-btn" @click="delItem(index)">
                        <i class="el-icon-circle-close"></i>
                    </div>
                    <div class="sort-btn sort-type2">
                        <div @click="sortUp(index)"><i class="el-icon-caret-top" :class="index==0?'not-allowed':''"></i></div>
                        <div @click="sortBottom(index)"><i class="el-icon-caret-bottom" :class="(index==0&&curEditData.length==1)||(index==curEditData.length-1)?'not-allowed':''"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="save-btn">
            <el-button v-if="($authJudge('homeset:pcadult:savedata'))||($authJudge('homeset:pcchildren:savedata'))" type="primary" size="small" @click="saveData">保存</el-button>
        </div>
        <el-dialog :custom-class="'edit-dialog'" :visible.sync="editDialogVisible" :width="'500px'" :show-close="false">
            <div class="search-box">
                <el-input placeholder="输入老师名称查询" size="medium" clearable prefix-icon="el-icon-search" v-model="searchKey" maxlength="10" @keypress.native="pressEvent($event)"></el-input>
                <el-button type="primary" size="medium" @click="search">搜索</el-button>
            </div>
            <div class="list" ref="scrollBox">
                <el-checkbox-group
                    v-if="styleVal=='1'" 
                    v-model="dialogArrStyle1"
                    :min="0"
                    :max="EditDialogMaxNum">
                    <div class="item" v-for="(item,index) in editDialogList" :key="index">
                        <el-checkbox :label="item.id" :disabled="item.disabled">
                            <img class="teacher-avatar" :src="item.avatar"/>
                            <p class="teacher-name">{{item.name}}</p>
                        </el-checkbox>
                    </div>
                </el-checkbox-group>
                <el-checkbox-group 
                    v-if="styleVal=='2'"
                    v-model="dialogArrStyle2"
                    :min="0"
                    :max="EditDialogMaxNum">
                    <div class="item" v-for="(item,index) in editDialogList" :key="index">
                        <el-checkbox :label="item.id" :disabled="item.disabled">{{item.name}}</el-checkbox>
                    </div>
                </el-checkbox-group>
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
import {mapState,mapActions} from 'vuex'
import addcontentlist from "@/components/Appconfigpage/ASamePlugin/asameplugin";
export default {
    components:{
        addcontentlist
    },
    data(){
        return {
            moduleName:'',
            curEditData:[],
            styleVal:'1',
            editDialogVisible:false,//选择窗口
            searchKey:'',//搜索词
            oldSearchKey:'',
            searchFlag:false,
            pageNo:1,
            pageSize:20,
            isLastPage:false,
            editDialogList:[],//弹窗list
            loading:true,//弹窗是否loading
            EditDialogMaxNum:12,//多选最大数量
            dialogArrStyle1:[],//多选集合
            courseCheckListStyle1:[],//课程多选集合，选择一次push一次，
            dialogArrStyle2:[],
            courseCheckListStyle2:[]
        }
    },
    created(){
        this.moduleName = this.modeAllInfo.moduleName;
        this.modeAllInfo.list.forEach(item=>{
            this.curEditData.push({
                targetId:item.id,
                name:item.name
            })
        })
        this.courseCheckListStyle1 = this.modeAllInfo.list.map(item=>{
            return {
                id:Number(item.targetId),
                name:item.name
            }
        })
    },
    props:["modeAllInfo","powerArryList",'urlList'],
    computed:{},
    watch:{
        dialogArrStyle1(cur,old){
            if(cur.length>=this.EditDialogMaxNum){
                this.editDialogList.forEach(item=>{
                    let obj = cur.find(id=>id==item.id);
                    if(obj&&!item.oldData){
                        item.disabled = false;
                    }else{
                        item.disabled = true;
                    }
                })
            }else{
                this.editDialogList.forEach(item=>{
                    if(!item.oldData)
                        item.disabled = false;
                })
            }
            cur.forEach((item)=>{
                let index = this.courseCheckListStyle1.findIndex(option=>option.id==item);
                if(index==-1){
                    let obj = this.editDialogList.find(option=>option.id==item);
                    if(obj){
                        this.courseCheckListStyle1.push({
                            id:obj.id,
                            name:obj.name
                        })
                    }
                }
            })
        },
    },
    methods:{
        showDialog(){
            this.editDialogVisible = true;
            this.dialogArrStyle1.splice(0,this.dialogArrStyle1.length)
            this.curEditData.forEach(item=>{
                if(item.targetId){
                    this.dialogArrStyle1.push(item.targetId)
                }
            })
            this.getAppHomeListByTeacher();  
        },
        /**
         * 获取课程
         */
        getAppHomeListByTeacher(){
            this.loading = true;
            this.isLastPage = false;
            let params = {
                name:this.oldSearchKey,
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                type:this.urlList.type==3?1:2
            }
            if(this.searchFlag){
                params.name = this.searchKey
                this.oldSearchKey = this.searchKey
            }
            this.$http.get(this.$server.getAppHomeListByTeacher,{params}).then(res=>{
                if(res.status==200){
                    let arr = res.content.list;
                    if(this.dialogArrStyle1.length>=this.EditDialogMaxNum){
                        arr.forEach(item=>{
                            item.disabled = true;
                        })
                    }else{
                        arr.forEach(item=>{
                            let obj = this.dialogArrStyle1.find(id=>id==item.id);
                            if(obj){
                                item.disabled = true;
                                item.oldData = true;
                            }else{
                                item.disabled = false;
                            }
                        })
                    }
                    this.editDialogList = [...this.editDialogList,...arr]
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
                this.getAppHomeListByTeacher();
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
                this.$nextTick(()=>{
                    this.getAppHomeListByTeacher()
                })
            })
        },
        /**
         * 弹出框确定事件
         */
        dialogSure(){
            this.curEditData.splice(0, this.curEditData.length);
            this.courseCheckListStyle1.forEach(item=>{
            let obj = this.dialogArrStyle1.find(id=>id==item.id);
                if(obj){
                    this.curEditData.push({
                        targetId:item.id,
                        name:item.name,
                    })
                }
            })
            this.editDialogVisible = false;
        },
        /**
         * 删除单项设置   
         */
        delItem(index){
            let targetId = this.curEditData[index].targetId
            this.curEditData.splice(index,1)
            if(this.styleVal=='1'){
                let i = this.dialogArrStyle1.findIndex(id=>id==targetId)
                this.dialogArrStyle1.splice(i,1)
            }else if(this.styleVal=='2'){
                let i = this.dialogArrStyle2.findIndex(id=>id==targetId)
                this.dialogArrStyle2.splice(i,1)
            }
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
            let id = this.modeAllInfo.id;
            if(this.$store.state.appConfig.idInitlist.indexOf(this.modeAllInfo.id)==-1){
                id = -1;
            }     
            let query = {
                moduleType:'teacherRecommend',
                moduleName:this.moduleName,
                styleId:this.modeAllInfo.styleId,  
                id:id 
            }
            let list = []
            this.curEditData.forEach((item,index)=>{
                list.push({
                    content:item.targetId,
                    type:2
                })
            })
            query.list = list
            let queryData = {
                modules:JSON.stringify([query]),
                type:this.urlList.type
            }
            let url = this.urlList.addUrlProp
            this.$http.post(url,queryData,{headers: {'Content-Type':'application/x-www-form-urlencoded'}}).then(res=>{
                if(res.status=="200"){
                    this.$store.commit("appConfig/setModelnameNull");
                    var getAppInfo=()=>{
                        var deferred = $.Deferred();
                        this.$http.get(this.urlList.selectUrlAll)
                        .then(res => {
                            if (res.status === 200) {
                                deferred.resolve(res.content);//触发, 并传递数据
                            }
                        })
                        .catch(res => {
                            deferred.reject(res);
                        });
                        return deferred.promise();
                    }
                    $.when(getAppInfo())
                        .done((data)=>{
                            data.forEach((item)=>{
                                if(item.moduleType=='freeGoodCourse'){
                                    item.moduleType = 'freeCourses'
                                }
                            })
                            this.$store.commit("appConfig/appHomePageData",data)
                            this.$store.commit('appConfig/mobiledChangeTypeNo');
                            this.$nextTick(()=>{
                                this.$store.commit('appConfig/loadingBool', false);
                            })
                            this.$message.success('保存成功')               
                        })
                        .fail(()=>{
                            this.$store.commit('appConfig/loadingBool', false);
                            console.log("出错啦!")}
                    );
                    this.$nextTick(()=>{
                        this.$store.commit('appConfig/loadingBool', false);
                    })                        
                }
            })
        }
    },
    mounted(){
       
    }
}
</script>

<style>
 @import "../../formSynthesisPlugin/my-component.css";
</style>
<style lang="scss" scoped>
.free-course{
    padding:15px;
    font-size: 14px;
    .tips{
        span{
            color:#9F0D00;
        }
    }
    .module-name{
        margin-top:20px;
        label{
            width: 56px;
            text-align: right;
            display: inline-block;
            vertical-align: middle;
        }
        .input-area,p{
            display: inline-block;
            vertical-align: middle;
        }
        .input-area{
            width: 200px;
            margin:0 10px 0 5px;
        }
    }
    .select-course{
        margin-top:20px;
        p{
            width: 56px;
            display: inline-block;
            vertical-align: middle;
            text-align: right;
            margin-right: 5px;
        }
    }
    .style{
        margin-top:20px;
        p{
            width: 56px;
            display: inline-block;
            vertical-align: middle;
            text-align: right;
            margin-right: 5px;
        }
        .box{
            display: inline-block;
            vertical-align: middle;
            font-size: 0;
            border-radius: 5px;
            overflow: hidden;
            span{
                display: inline-block;
                vertical-align: middle;
                width: 40px;
                height: 25px;
                background: #ddd;
                &:first-child{
                    background: #b3b3b3;
                }
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
                    &.type2{
                        width: auto;
                        margin:20px 30px 20px 65px;
                    }
                    &:hover{
                        .del-btn{
                            visibility: visible;
                        }
                    }
                    .teacher{
                        img,p{
                            display: inline-block;
                            vertical-align: middle;
                        }
                        img{
                            height: 50px;
                            width: 50px;
                            overflow: hidden;
                            margin:5px 15px 5px;
                            border-radius: 50%;
                        }
                    }
                    .img-file-box{
                        float: left;
                        width: 200px;
                        height: 100px;
                        overflow: hidden;
                        position: relative;
                        cursor: pointer;
                        .file-upload{
                            opacity: 0;
                            position: absolute;
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
                            .more-text{
                                display: inline-block!important;
                                vertical-align: middle!important;
                                cursor: default;
                                margin-left: 10px;
                                width: calc(100% - 135px);
                            }
                            button{
                                padding: 10px!important;
                            }
                        }
                    }
                    .del-btn{
                        position: absolute;
                        right: -10px;
                        top:-10px;
                        font-size: 20px;
                        cursor: pointer;
                        i{
                            color:#bbb;
                        }
                    }
                    .sort-btn{
                        position: absolute;
                        width: 30px;
                        right: -30px;
                        top:30%;
                        &.sort-type2{
                            top:-10%;
                            right: -35px;
                        }
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
    .save-btn{
        text-align: center;
    }        
    .edit-dialog{
        left: 5%;
        .search-box{
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
         .teacher-avatar,.teacher-name{
                display: inline-block;
                vertical-align: middle;
            }
            .teacher-avatar{
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow: hidden;
                margin:5px 15px 5px;
            }
        .list{
            margin:10px 0;
            max-height: 500px;
            overflow: auto;
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