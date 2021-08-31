<template>
    <div class="creat-move-page">    
        <div class="move-head">
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>  
        <div class="move-content">
            <div class="contentBox content1">
                <div>名字</div>
                <div>
                    <el-input v-model="inputTitle" maxlength="20" placeholder="请输入内容"></el-input>
                </div>
                <div>
                    {{inputTitle.length||0}}/20
                </div>
            </div>
            <div class="content2">
                <div class='contentBox'>
                    <div>选择移动合作课程</div>
                    <div>
                        <el-button type="primary" size="mini" @click="selectCourse">选择</el-button>
                    </div>
                </div>
                <div style='padding: 0 20px 20px;'>
                    {{selectCourstTitle}}
                </div>
            </div>
            <div class="contentBox content3">
                <div>礼包类型</div>
                <div>
                    <el-radio v-model="radio" label="1">跳转链接</el-radio>
                </div>
            </div>
            <div class="contentBox content4">
                <div>链接地址</div>
                <div>
                    <el-input v-model="urlText" style="min-width:300px" placeholder="请输入内容"></el-input>
                </div>
            </div>
            <div class="contentFloor content5">
                <el-button type="primary" @click='save(true)'>保存</el-button>
                <el-button @click='save(false)'>取消</el-button>
            </div>
        </div> 

        <el-dialog
        :visible.sync="dialogVisibleOne"
        width="30%"
        >
        <div class="dialogOne">
            <div class="cooperateBox">
                <div>
                    <el-input v-model="inputText" style="min-width:300px" clearable placeholder="输入移动活动名称查询"></el-input>
                </div>
                <el-button type="primary" @click="tableDataIdRadioSelect">搜索</el-button>
            </div>
            <div class="list" ref="multipleTable" v-loading="loadDailg">
                <el-radio-group v-model="tableDataIdRadio" >
                    <el-radio style="display:block;margin-bottom:15px;" :label="item.id" v-for="(item,index) in tableData" :key="index">{{item.title}}</el-radio>
                </el-radio-group>               
            </div> 
            <div style="text-align:center;">
                <el-button style="background-color:#9e0e00;color:#fff" @click="isOkSelect(true)">保存</el-button>
                <el-button style="background-color:#ccc;color:#fff" @click="isOkSelect(false)">取消</el-button>                
            </div>           
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
// !regExp.protocol.test(xxxx) //不满足
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){                     
        return {
            id:'',
            actionsIds:'',
            radio:'1',
            tableData:[],
            urlText:'',
            inputTitle:'',
            inputText:'',
            selectCourstTitle:'',
            dialogVisibleOne:false,
            pageNo1:1,
            loadDailg:false,
            pageSize:9999,
            tableDataIdRadio:'',
            titleList:[
                {
                    name:'活动',
                    pathInfo:'/activityObjList'
                },
                {
                    name:'移动用户赠课弹窗',
                    pathInfo:'/activityObj/mobileFreeCourse'
                },
                {
                    name:'创建弹窗',
                    pathInfo:''
                }                 
            ]
        }
    },
    created(){
            let dataObj = this.$route.query.data;
            if(dataObj){
                 this.id = JSON.parse(dataObj).id||'';               
                this.actionsIds = Number(JSON.parse(dataObj).mobileActivityId);
                this.returnDailPage(JSON.parse(dataObj));
            }

    },
    methods:{
        returnDailPage(data){
            this.inputTitle = data.name;
            this.tableDataIdRadio = data.mobileActivityId;
            this.urlText = data.linkUrl; 
            this.radio = data.type+'';
            this.selectCourstTitle = data.activityTitle;
        },
        tableDataIdRadioSelect(){
            this.getGiveCourseDetailList();
        },
        selectCourse(){
            // this.getGiveCourseDetailList();
            this.dialogVisibleOne = true;
        },
        save(bools){
            var self = this;   
            if(bools){
                if(!this.inputTitle){
                    this.$message.error("请填写名称");
                    return;
                }
                if(!this.urlText){
                    this.$message.error("请填写链接地址");
                    return;
                }else{
                    if(!regExp.protocol.test(this.urlText)){
                        this.$message.error("请填写以http://或者https://开头的地址~~");
                        return;
                    }
                }
                if(!this.selectCourstTitle){
                    this.$message.error("请选择移动合作课程");
                    return;
                }
                let params = {
                        name:this.inputTitle,
                        mobileActivityId:this.actionsIds,
                        linkUrl:this.urlText
                }
                let url = '';
                if(this.id){
                    url=this.$server.setMobilePopupEdit+this.id;
                }else{
                    url=this.$server.setMobilePopupAdd;
                }
                this.$http.post(url,params).then(res=>{
                    if(res.status==200){
                        this.$message.success("保存成功");
                        setTimeout(()=>{
                            this.$router.push({path:'/activityObj/mobileFreeCourse'});
                        },100);
                    }
                }) 
            }else{
                this.$router.push({path:'/activityObj/mobileFreeCourse'});
            }                  
        },
        isOkSelect(bool){
            if(bool){
                let valTitle = '';
                this.tableData.forEach((element,index)=>{
                    if(element.id==this.tableDataIdRadio){
                        valTitle = element;
                    }
                });
                this.selectCourstTitle = valTitle.title;
                this.actionsIds = valTitle.id;
                this.dialogVisibleOne = false;
            }else{
                this.dialogVisibleOne = false;
            }
        },
        /**
         * 获取列表详情
         */
        getGiveCourseDetailList(){
            var self = this;
            this.loadDailg = true;
            const query = {
                params:{
                    title:this.inputText,
                    pageNo:1,
                    pageSize:9999,
                    type:'',
                    beginTime:'',
                    endTime:''
                }
            }  
            this.$http.get(self.$server.getPageMobileActivity,query).then(res=>{
                this.loadDailg = false;
                if(res.status==200){
                    var listIds = [];
                    var contentdate = res.content;
                    var nextPage = contentdate.nextPage;
                    var prePage = contentdate.prePage;
                    if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                return element;
                            });                            
                        } 
                    };
                    self.tableData = listIds;
                    self.$nextTick(function(){
                        self.loadDailg = false; 
                    })
                }
            }).catch(()=>{
                this.loadDailg = false;
            })
        },         
    },
    components: {
        breadcrumb
    },
    mounted(){
        this.getGiveCourseDetailList();
    }
}
</script>
<style scoped lang="scss">
.creat-move-page{
    .move-content{
        margin-top:30px;
        padding:0 20px;
        .contentBox{
            display: flex;
            flex-direction: row;
            justify-content: left;
            align-items: center;
            margin-bottom: 20px;
            >div{
                margin-left: 10px;
            }
        }
        .contentFloor{
            text-align:center;
        }
    }
    .dialogOne{
        .cooperateBox{
            display: flex;
            flex-direction:row;
            justify-content:left;
            align-items:center;
            margin-bottom: 20px;
            >div{
                margin-right: 5px;
            }
        }
        .list{
            max-height: 300px;
            overflow-y: auto;
        }
    }
}
</style>


