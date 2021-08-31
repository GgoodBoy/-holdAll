<template>
    <div class="create-video-wrap">
        <div class="inner">
            <breadcrumb :menuList ='titleList'></breadcrumb>
            <div class="clearfix page-title">
                <h2 class="fl title-details">
                    上传视频
                </h2>
                <div class="fl title-hint">
                    支持批量上传（单次最多5个），支持MP4、FLV格式，单个文件大小不超过2G。
                </div>
                <el-upload class="upload-demo fr"
                            ref="upload"
                           :action="action"
                           :headers="myHeaders"
                           :data="params"
                           :before-upload="beforeVideoUpload"
                           :on-progress="progress"
                           :on-success="success"
                           :on-error="errorUpload"
                           :disabled="Number10"
                           :on-exceed="handleExceed"
                           multiple
                           :limit="5"
                           :show-file-list="false">
                    <el-button :type="Number10==false?'danger':'info'"
                               :disabled="Number10"
                               class="red-btn">上传视频</el-button>
                </el-upload>
            </div>
            <div class="fileListDIV">
                <ul class="file-list">
                    <li class="list-item"
                        v-for="item in fileList">
                        <el-row>
                            <el-col :span="20"
                                    class="tl">
                                {{item.name}}
                            </el-col>
                            <el-col :span="4"
                                    class="tr">
                                {{ storage(item.size) }}
                            </el-col>
                        </el-row>
                        <el-row class="progress-wrap">
                            <el-progress :percentage="item.percentage"
                                        :color="item.updateState!=='uploadSuccess'?'#9E0E00':'#01AF26'"
                                        :stroke-width="7"
                                        :show-text="false"></el-progress>
                        </el-row>
                        <el-row>
                            <el-col :span="20"
                                    class="tl">
                                已上传：{{item.updateState=='uploadSuccess' ?storage(item.size) : storage(item.size*item.percentage/100)}}/{{storage(item.size)}}
                            </el-col>
                            <el-col :span="4"
                                    class="tr">
                                {{item.updateStatusText}}
                            </el-col>
                        </el-row>
                    </li>
                </ul>                
            </div>
            <div class="upload-hint tr" v-if="successNum>0 || failNum>0">
                已完成{{successNum}}个文件，失败{{failNum}}个,<span class="red-text" >{{Number(successNum)==0?'请重新上传':'请点击保存'}}</span>
            </div>
        </div>

        <div class="tc btn-group" v-show="btnFlag">
            <el-button type="info"
                       class="btn cancel-btn" @click="cancel">取消</el-button>
            <el-button type="danger"
                       class="red-btn btn" @click="save">保存</el-button>
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
                          您正在上传视频未保存，确认要离开当前页面吗？
                    </el-col>                                     
                </el-row>
        </Dialog>         
    </div>
</template>
<script>
    import { getToken } from '@/utils/auth';
    import Dialog from "@/components/myDialog/myDialog";
    import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
    import { Loading } from 'element-ui';
export default {
    data() {
        return {
            action:'',
            myHeaders:{},
            fileList: {},
            successNum:0,
            failNum:0,
            params:{
                fileType:'video',
                videoType:2
            },
            Number10:false,
            videoIds:[],
            editsObj:{
                showFlag:false, //是否显示遮罩弹框；
                title:"温馨提示", //Dialog 的标题
                cancelName:'editObjNos', //自定义取消事件名字
                sureName:'editObjOks', //自定义确定事件名字,                        
            },            
            loadUpdataWait:false,
            toPath:{},
            titleList:[
                {
                    name:'短视频库',
                    pathInfo:'/resource/shortVideo'
                },
                {
                    name:'视频上传',
                    pathInfo:''
                }                               
            ],
            locaListStr:[]             
        };
    },
    components:{
        Dialog,
        breadcrumb
    },  
    computed:{
        btnFlag(){
            return this.videoIds.length>0
        }
    },
    created(){
        this.myHeaders = {
            token: getToken()
        };
        this.action = this.$server.uploadResource;
    },
    watch:{
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        if(this.loadUpdataWait){
            //next方法传true或者不传为默认历史返回，传false为不执行历史回退
            this.editsObj.showFlag = true;
            this.toPath = to;
            next(false);         
        }else{
            next();
        };
    },    
    methods: {
        //停止上传
        // submitUpload(file){
        //     this.$refs.upload.abort();
        // },
        couponEditObjOk(){
            this.loadUpdataWait = false;
            this.$router.push({path:this.toPath.path});           
        },
        couponEditObjNo(){
            this.editsObj.showFlag = false;
        },         
        storage: function(size) {
            if (!size) return "";
            let num = 1024.00; //byte
            if (size < num) {
                return size + "B";
            } else {
                return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
            }
        },
        beforeVideoUpload(file,bd) {
            if(this.locaListStr.length==0){
                this.locaListStr.push(file.name);
            }else{
                var list = [];
                for (const iterator of this.locaListStr) {
                    if(file.name==iterator){
                        this.$message.error("不能上传相同名称的视频！");
                        return false;
                    }else{
                        list.push(file.name);
                    }
                };
                this.locaListStr = [...this.locaListStr,...list];
            }
            if (file.name.length > 200) {
                this.$message.error("文件名字过长，请更改后重试！");
                return false;
            }
            let format = file.name
                .split(".")
                .pop()
                .toLocaleUpperCase();
            if (format == "MP4" || format == "FLV" ) {
                return true;
            } else {
                this.$message.error("文件格式有误，请重试！");
                return false;
            }
        },
        progress(event, file, fileList) {
            this.loadUpdataWait = true;
            let uid = (file["uid"] || parseInt(Math.random() * 10000)) + "";
            let fileInfo = JSON.parse(JSON.stringify(file));
            fileInfo["percent"] = event["percent"];
            // console.log("fileInfo",fileInfo);
            fileInfo["updateStatusText"] = "上传中";
            this.$set(this.fileList, uid, fileInfo);
        },
        success(response, file, fileList) {
            // console.log("success",file);
            if (response.status === 200) {
                this.videoIds.push(response.content.VideoId)
                let uid = file["uid"];
                let fileInfo = JSON.parse(JSON.stringify(file));
                fileInfo["updateStatusText"] = "上传成功";
                fileInfo["updateState"] = "uploadSuccess";
                this.$set(this.fileList, uid, fileInfo);
                if(fileList.length>=10){
                    this.Number10=true;
                }else{
                    this.Number10=false;
                }
                this.successNum++;
            } else {
                this.errorUpload(response, file, fileList )
            }

        },
        handleExceed(files, fileList){
            if((files.length + fileList.length)>10){
                this.$message.warning(`当前限制选择 5 个视频，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            }
        },
        errorUpload(response, file, fileList) {
            // console.log("error",file);
            let uid = file["uid"];
            let fileInfo = JSON.parse(JSON.stringify(file));
            fileInfo["updateStatusText"] = "失败"+" : "+response.message;
            fileInfo["updateState"] = "uploadFail";
            this.$set(this.fileList, uid, fileInfo);
            this.failNum++;
        },
        save(){
            this.loadUpdataWait = false;
            let loading = Loading.service({})
            let query = {
                vid:JSON.stringify(this.videoIds),
                type:2
            }
            this.$http.post(this.$server.saveResource,query).then(res=>{
                loading.close()
                if(res.status == 200){
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    })
                    this.$router.go(-1)
                }
            })
        },
        cancel(){
            this.$router.go(-1)
        }
    }
};
</script>
<style lang="scss" scoped>
.fileListDIV{
    max-height: 800px;
    overflow: auto;
}
.inner {
    background: #fff;
    padding: 20px;
    .title-details {
        font-size: 18px;
        color: rgba(56, 65, 86, 1);
        line-height: 40px;
    }
    .title-hint {
        font-size: 14px;
        color: rgba(154, 154, 154, 1);
        margin: 0 100px 0 24px;
        line-height: 40px;
    }
    .file-list {
        min-height: 200px;
    }
    .list-item {
        margin-top: 10px;
        padding: 15px 20px 0 20px;
        // width: 1106px;
        height: 100px;
        background: rgba(245, 245, 245, 1);
        border: 1px solid rgba(237, 241, 247, 1);
        border-radius: 2px;
        font-size: 18px;
        color: rgba(56, 65, 86, 1);
        .progress-wrap {
            margin: 10px 0;
        }
    }
    .upload-hint {
        font-size:16px;
        margin-top: 10px;
        color: #384156;
    }
    .red-text {
        color: #9E0E00;
    }
}

.btn {
    width: 130px;
    margin: 70px;
    .cancel-btn {
        background: #a9a9a9;
    }
}
</style>
