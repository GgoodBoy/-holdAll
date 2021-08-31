<template>
    <div class="page-wrap gift-list-wrap">
        <div class="page-header">
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>
        <div class="content">
                <el-form ref="form" 
                        :model="form" 
                        label-width="90px" 
                        label-position="left"
                        class="module-details"
                        :rules="rules"
                        >
                        <section class="form-module fontCss14">
                            <el-form-item label="商品名称" prop="goodsName">
                                <el-row>
                                    <el-col :span="6">
                                        <el-input maxlength="10" v-model="form.goodsName" placeholder=" "></el-input>
                                    </el-col>
                                    <el-col :span="1" class="lCenter-r">{{form.goodsName.length||0}}/10</el-col>
                                </el-row>
                            </el-form-item>                    
                            <el-form-item label="商品图片"
                                    prop="backgroundUrl">
                                <!-- surfacePlot -->
                                <p class="form-hint">尺寸：200*200px，大小≤1m</p>
                                <el-upload
                                    class="avatar-uploader"
                                    :action="actiosService"
                                    :show-file-list="false"
                                    :headers="myHeaders"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload"
                                    >
                                    <img v-if="form.goodsImg" :src="form.goodsImg" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item> 
                            <el-form-item label="兑换孚星" prop="starNum">
                                <el-row>
                                    <el-col :span="6"><el-input v-model="form.starNum" type="text" maxlength="5" placeholder="只能填写整数1-10000"></el-input></el-col>
                                </el-row>
                            </el-form-item>   
                            <el-form-item label="商品库存" prop="totalNum">
                                <el-row>
                                    <el-col :span="6"><el-input v-model="form.totalNum" type="text" maxlength="5" placeholder="只能填写整数1-10000"></el-input></el-col>
                                    <el-col :span="1" class="lCenter-r">
                                        <div class="addOrRem">
                                            <div class="add" @click="addOrRemEven(true)">+</div>
                                            <div class="rem" @click="addOrRemEven(false)">-</div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-form-item>     
                        </section>
                        <el-row>
                            <el-col class="lCenter-r">
                                <el-button class="lButtomNo lMarginTB50" @click="returnpage">取消</el-button>
                                <el-button class="lButtomOk lMarginTB50" :loading="loadDailg" @click="submitForm('form')">确定</el-button>
                            </el-col>
                        </el-row>                
                </el-form>
        </div> 
        <Dialog 
            :showFlag.sync="editsObj.showFlag"
            :title="editsObj.title"
            :cancelName="editsObj.cancelName"
            :sureName="editsObj.sureName"
            v-on:editObjNos="couponEditObjNo"
            v-on:editObjOks="couponEditObjOk">
            <el-row slot="dialog-body" class="lLine30">
                <el-col class="lCenter-r">
                        您有未保存的信息，离开会丢失，确定要离开吗？
                </el-col>                                     
            </el-row>
        </Dialog>  
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import Dialog from "@/components/myDialog/myDialog";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data() {
        var checkAge = (rule, value, callback) => {
            var self = this;
            // let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,20}$/;
            // let regExp = /^[0-9a-zA-Z]*$/g;
            let regExp = /^[0-9]*$/g;
            switch (rule.fullField) {                                
                case "starNum":
                    if(value==''){
                        callback(new Error('请输入内容'))
                    }else{
                        if(!regExp.test(value)||(Number(value)>10000||Number(value)<1)){
                            callback(new Error('只能填写整数1-10000'))
                        }else{
                            callback()
                        }
                    }
                break;                        
                case "totalNum":
                    if(value==''){
                        callback(new Error('请输入内容'))
                    }else{
                        if(!regExp.test(value)||(Number(value)>10000||Number(value)<1)){
                            callback(new Error('只能填写整数1-10000'))
                        }else{
                            callback()
                        }
                    }
                break;             
            }
        }; 
        return {
            myHeaders: {token: getToken()},
            videoModel:{
                imgUrl:''
            },
            form:{
                goodsName:'',
                goodsImg:'',
                starNum:'',
                totalNum:''
            },    
            rules:{ 
                goodsName: [
                    { min: 1, max: 20, message: '请填写名称', trigger: 'blur' }
                ], 
                starNum: [
                    { validator: checkAge, trigger: 'blur' }
                ], 
                totalNum: [
                    { validator: checkAge, trigger: 'blur' }
                ]                           
            },
            titleList:[
                {
                    name:'兑换商城',
                    pathInfo:''
                },
                {
                    name:'商品列表',
                    pathInfo:'/exchange/indexList'
                }              
            ],
            pageNo:1,
            pageSize:10,
            total:10,
            tableData:[],
            loading:false,
            dialogVisible:false,
            isAdd:true,
            id:'',
            loadDailg:false,
            editsObj:{
                showFlag:false, //是否显示遮罩弹框；
                title:"温馨提示", //Dialog 的标题
                cancelName:'editObjNos', //自定义取消事件名字
                sureName:'editObjOks', //自定义确定事件名字,                        
            },
            toPath:{},
            dataUpdateBool:{}
        };
    },
    metaInfo: {
        title: "国学大礼包"
    },
    components: {
        breadcrumb,
        Dialog
    },
    watch: {
    },
    created() {
        this.id = this.$route.query.id;
        if(this.id){
            this.isAdd = false;
            this.getDetails();
            this.titleList.push(
                {
                    name:'编辑商品',
                    pathInfo:''
                }
            );
        }else{
            this.titleList.push(
                {
                    name:'创建商品',
                    pathInfo:''
                }
            );
        }
    },
    computed:{
        actiosService(){
            return  this.$server.actionImgOrvideo;//
        }   
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        var newFormData = JSON.stringify(this.form);
        if(this.dataUpdateBool!==newFormData){
            //next方法传true或者不传为默认历史返回，传false为不执行历史回退
            this.editsObj.showFlag = true;
            this.toPath = to;
            next(false);  
        }else{
            next();0
        };
    },
    methods: {
        //切换路径取消    
        couponEditObjNo(){
            console.log("取消");
            this.editsObj.showFlag = false;
        },
        //切换路径确定
        couponEditObjOk(){
            var self = this;
            self.dataUpdateBool = JSON.stringify({});
            self.form = {};
            self.$router.push({path:self.toPath.path});    
        },
        getDetails(){      
            this.$http.get(this.$server.getGoodsDetail+this.id).then(res=>{
                if(res.status==200){
                    this.form.goodsName= res.content.goodsName;
                    this.form.goodsImg= res.content.goodsImg;
                    this.form.starNum= res.content.starNum;
                    this.form.totalNum= res.content.totalNum;  
                }
            });            
        },
        returnpage(){
            this.$router.push({path:"/exchange/indexList"});
        },
        //上传
        handleAvatarSuccess(res, file) {
            this.form.goodsImg = res.content.resourceUrl;
        },
        beforeAvatarUpload(file) {
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < 1.001;
            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 1M!');
            }            
            const isSize = new Promise(function(resolve, reject) {
                            let width = 200;
                            let height = 200;
                            let _URL = window.URL || window.webkitURL;
                            let img = new Image();
                            img.onload = function() {
                                let valid = img.width == width && img.height==height;
                                valid ? resolve() : reject();
                            }
                            img.src = _URL.createObjectURL(file);
                        }).then(() => {
                            return file;
                        }, () => {
                            this.$message.error('上传的图片图片高宽为200*200');
                            return Promise.reject();
                });
            return isJPG && isLt2M && isSize;
        },
        addOrRemEven(type){
            if(type){
                this.form.totalNum = Number(this.form.totalNum)+1;
            }else{
                if(this.form.totalNum){
                    this.form.totalNum = Number(this.form.totalNum)-1;
                }
            }
        },
        submitForm(formName){
            var self = this;
            let parmesObj ={}; 
            if(!self.form.goodsName||!self.form.goodsImg||!self.form.starNum||!self.form.totalNum){
                this.$message.error('请完善内容信息。')
                return;
            }
            if(!self.loadDailg){
                self.loadDailg = true;
                if(self.courseList==0){
                    self.loadDailg = false; 
                    return;                  
                }       
                self.$refs[formName].validate((valid) => {
                        if (valid) {
                            let urls = '';
                                var parems = {
                                        goodsName:self.form.goodsName,
                                        goodsImg:self.form.goodsImg,
                                        starNum:self.form.starNum,
                                        totalNum:self.form.totalNum,
                                };
                                if(!self.isAdd){
                                    parems['id'] = this.id;
                                }
                                self.disabledState = !self.disabledState;                               
                                self.$http.post(self.$server.getEditGoods,parems).then(res=>{
                                    if(res.status==200){
                                            self.dataUpdateBool = JSON.stringify({});
                                            self.form = {};
                                            self.loadDailg = false; 
                                            this.$router.push({path:"/exchange/indexList"});
                                    }else{
                                        self.loadDailg = false;
                                    }
                                })
                                .catch(res => {
                                        self.loadDailg=false;
                                }); 
                                                     
                                console.log("验证通过");
                            } else {
                                console.log("验证未通过");
                                this.loadDailg = false;
                                return false;
                            }
                    });   
            }         
        }
    }
};
</script>

<style lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
 .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 98px;
    height: 98px;
    line-height: 98px;
    text-align: center;
    border:1px solid #fff;
}
.avatar{
    width: 100px;
    height: 100px;
}
.addOrRem{
    height:40px;
    width: 40px;
    div{
        text-align: center;
        height: 20px;
        line-height: 20px;
        font-size: 18px;
    }
    div:hover{
        color: red;
        cursor: pointer;
    }
}
</style>

