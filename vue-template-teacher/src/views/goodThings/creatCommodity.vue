<template>
    <div>
        <el-row class="lSize16">
            <el-col :span="8" class="lLeft-r">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
        </el-row>          
        <el-form :rules="rules" ref="form" :model="form" class="create-course-baseinfo" label-width="80px">
            <el-form-item label="商品名称" prop="name">
                <el-input style="width:300px" v-model="form.name" placeholder="请输入商品名称" :maxlength="20"></el-input>
                <span>{{form.name.length||0}}/20</span>
            </el-form-item>
            <el-form-item label="分类" prop="region">
                <el-select v-model="form.region" placeholder="选择分类">
                    <el-option
                        v-for="item in optionsOne"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>                    
                </el-select>
            </el-form-item>
            <el-form-item label="商品地址"  prop="urls">
                <el-input style="width:400px" v-model="form.urls" ref="formUrls"></el-input>   
                <p class="grayColor lSize12">只限淘宝网商品链接</p>         
            </el-form-item>
            <el-form-item label="价格" prop="price">
                <el-input style="width:100px" v-model="form.price" placeholder="元" :maxlength="20"></el-input>          
            </el-form-item>      
            <el-form-item label="佣金比例" prop="commission">
                <el-input style="width:100px" v-model="form.commission" placeholder="0-100"></el-input>
                <span>%</span>          
            </el-form-item>   
            <el-form-item label="商品描述" prop="desc">
                <el-input type="textarea" :rows='4' style="width:300px" v-model="form.desc" :maxlength="100"></el-input>
                <span>{{form.desc.length}}/100</span>        
            </el-form-item>
            <el-form-item label="封面图"
                            prop="surfacePlot">
                <!-- surfacePlot -->
                <p class="form-hint grayColor lSize12">支持JPG、PNG格式，1M以内222*208</p>
                <el-upload class="avatar-uploader"
                            :action="action"
                            :headers="commonHeader"
                            :before-upload="beforeUpload"
                            :show-file-list="false"
                            :on-error="uploadFileError"
                            :on-success="uploadFileSuccess">
                    <img v-if="form.surfacePlot"
                            :src="form.surfacePlot"
                            class="avatar">
                    <i v-else
                        class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>        
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">保存</el-button>
            </el-form-item>
        </el-form>    
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
    import { getToken,setToken,removeToken} from '@/utils/auth';
    import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
    const regExp = {
        'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
        'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
        'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g, //特殊字符(除了数字、字母、汉字) 
        'numberChar':/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
    }    
    export default {
        data() {
            let valiNumber = (rule, value, callback) => {
                value = value + "";
                switch (rule.fullField) {
                    case "commission":
                        if (value === "") {
                            callback(new Error("佣金比例不能为空"));
                        } else if (value === "0" || value === 0) {
                            callback();
                        } else if (! /^([1-9]|[1-8][0-9]|100)$/.test(value)){
                            callback(new Error("请输入小于等于100的整数。"))
                        }else {
                            callback(); 
                        }
                        break;
                    case "price":
                            if (value === "") {
                                callback(new Error("价格不能为空"));
                            } else if (!regExp.numberChar.test(value)) {
                                callback(new Error("价格最多保留2位小数"));
                            }
                        break;                       
                    case "region":
                            if (value === "") {
                                callback(new Error("分类不能为空"));
                            } else{
                                callback(); 
                            }
                        break;    
                    case "urls":
                            if (value === "") {
                                callback(new Error("路径不能为空"));
                            } else if (!regExp.protocol.test(value)) {
                                callback(new Error("请输入以http或https开头的链接地址"));
                            }
                        break;                                     
                    default:
                        break;
                }
                callback();
            };            
            return {
                form: {
                    name: '',
                    urls:'',
                    price:'',
                    commission:'',
                    region: '',
                    desc: '',
                    surfacePlot:''
                },
                disabledState:false,
                titleList:[
                            {
                                name:'国学好物',
                                pathInfo:'/classification/commodity'
                            },
                            {
                                name:'商品管理',
                                pathInfo:'/classification/commodity'
                            }
                ],
                action:'',
                optionsOne:[],
                dialogVisible:false,
                leavePath:'',
                rules: {
                    region: [
                        { validator: valiNumber, trigger: "change" }
                    ],     
                    price: [{ validator: valiNumber, trigger: "blur" }],
                    urls: [{ validator: valiNumber, trigger: "blur" }],            
                    commission: [{ validator: valiNumber, trigger: "blur" }],                   
                    name: [
                        {
                            required: true,
                            message: "请输入商品名称",
                            trigger: "blur"
                        },
                        {
                            min: 1,
                            max: 20,
                            message: "长度在 1 到 20 个字符",
                            trigger: "blur"
                        }
                    ],
                    desc: [
                        {
                            required: true,
                            message: "请输入商品描述",
                            trigger: "blur"
                        },
                        {
                            min: 1,
                            max: 100,
                            message: "长度在 1 到 100 个字符",
                            trigger: "blur"
                        }
                    ],
                    surfacePlot: [
                        {
                            required: true,
                            message: "请上传封面图",
                            trigger: "change"
                        }
                    ],
                    isEdit:'',
                    editCommodId:'',
                    isCopyFrom:{},
                    leavePageType:false
                }                               
            }
        },
        beforeRouteLeave (to, from, next){
            this.leavePath = to.fullPath;
            if(this.leavePageType){
                next();
            }else{
                if(JSON.stringify(this.isCopyFrom)!=JSON.stringify(this.form)){
                    this.dialogVisible = true;
                    console.log("不能跳转");
                    next(false);
                    return;
                }else{
                    next();
                }
            }
        },         
        created(){
            this.commonHeader = {
                token: getToken()
            };  
            this.getProgramList();
            var datas = this.$route.query;
            if(datas.hasOwnProperty('id')){
                this.getDatabackfill(datas.id);   
                this.editCommodId = datas.id;
                this.isEdit = true;   
                this.titleList.push(                            
                        {
                            name:'商品修改',
                            pathInfo:''
                        }
                    );         
            }else{
                this.isEdit = false;  
                this.editCommodId = ''; 
                this.isCopyFrom = Object.assign({}, this.form);
                this.titleList.push(                            
                        {
                            name:'商品添加',
                            pathInfo:''
                        }
                    );                
            }      
            this.action = this.$server.actionImgOrvideo;   
        },
        components:{
            breadcrumb
        },
        methods: {
        /**
         * 离开页面
         */
            leavePage(){
                this.dialogVisible = false;
                this.leavePageType = true;
                setTimeout(()=>{
                    this.$router.push(this.leavePath)
                },1)
            },            
            getProgramList(){
                var self = this;   
                self.loading = true; 
                var params = {
                    classifyName:''
                };
                self.$http.get(self.$server.getGoodsClassifyList,{params}).then(res=>{
                    if(res.status==200){
                        var listIds = [];
                        var contentdate = res.content;  
                            contentdate.forEach(element => {
                                listIds.push({
                                    value:element.id,
                                    label:element.classifyName
                                });
                            });                                             
                            self.optionsOne = listIds;
                    }
                })             
            },            
            //数据回填
            getDatabackfill(id){
                var self = this;
                var params = {
                    id:id
                };
                self.$http.get(self.$server.getGoodsFindById,{params}).then(res=>{
                    if(res.status==200){
                        let data = res.content;
                        self.form = {
                            name: data.goodsName,
                            urls:data.goodsLink,
                            price:data.goodsPrice,
                            commission:data.commissionRate,
                            region: data.classifyId,
                            desc: data.goodsDesc,
                            surfacePlot:data.frontCoverUrl
                        };                        
                    }
                    self.isCopyFrom = Object.assign({}, self.form);
                });                
            },
            // 图片文件上传
            beforeUpload(file) {
                const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
                const isLt2M = file.size / 1024 / 1024 < 1.001;
                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG,PNG,JPEG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 1M!');
                }            
                const isSize = new Promise(function(resolve, reject) {
                                let width = 222;
                                let height = 208;
                                let _URL = window.URL || window.webkitURL;
                                let img = new Image();
                                img.onload = function() {
                                    console.log('img.width',img.width);
                                    console.log('img.height',img.height);
                                    let valid = img.width == width && img.height == height;
                                    console.log('valid',valid);
                                    valid ? resolve() : reject();
                                }
                                img.src = _URL.createObjectURL(file);
                            }).then(() => {
                                return file;
                            }, () => {
                                this.$message.error('上传的图片必须是等于222*208!');
                                return Promise.reject();
                    });
                return isJPG && isLt2M && isSize;
            },   
            //文件上传失败
            uploadFileError(err, file, fileList) {
                if (err.message) {
                    try {
                        let msg = JSON.parse(err.message).message;
                        this.$message.error(msg);
                        return;
                    } catch (e) {}
                }
                this.$message.error(JSON.stringify(err));
            },
            // 图片上传成功
            uploadFileSuccess(response, file) {
                if (response.status == 200) {
                    this.form.surfacePlot = response.content.resourceUrl;
                    this.$refs["form"].validateField("surfacePlot");
                } else {
                    this.$message.error(response.message);
                }
            },  
            saveEvenIsok(formData){
                /*
                    name: '',
                    urls:'',
                    price:'',
                    commission:'',
                    region: '',
                    desc: '',
                    surfacePlot:''                
                */  
                var self = this;
                var urls = self.isEdit?self.$server.getGoodsUpdateGoods:self.$server.getAddGoods;
                var querys = {
                    goodsName:formData.name,
                    classifyId:formData.region,
                    goodsLink:formData.urls,
                    goodsPrice:formData.price,
                    commissionRate:formData.commission,
                    frontCoverUrl:formData.surfacePlot,
                    goodsDesc:formData.desc
                };
                if(self.isEdit){
                    querys['id'] = self.editCommodId;
                }
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;
                    self.$http.post(urls,querys).then(res=>{
                        if(res.status==200){
                            self.disabledState =  !self.disabledState;
                            this.leavePageType = true;
                            var messages = self.isEdit?'编辑':'添加';
                            self.$message.success(messages+'成功');
                            this.$router.push('/classification/commodity');                        
                        }
                    })              
                    .catch(res => {
                        self.disabledState = !self.disabledState;
                    });
                }
            },                   
            onSubmit() {
                var that = this;
                that.$refs["form"].validate(valid => {
                    if(valid){
                        that.saveEvenIsok(that.form);
                    }
                })            
            },

        },
        mounted(){

        }
        }
    </script>
<style lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.create-course-baseinfo {
    margin-top: 20px;
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .el-radio__input.is-checked .el-radio__inner {
        border-color: rgba(158, 14, 0, 1);
        background: rgba(158, 14, 0, 1);
    }
    .el-radio__input.is-checked + .el-radio__label {
        color: rgba(158, 14, 0, 1);
    }
}
</style>


