<template>
    <div class="create-audio-wrap">
        <div class="inner">
            <breadcrumb :menuList ='titleList'></breadcrumb>
            <div class="clearfix page-title">
                <h2 class="fl title-details">
                    上传音频
                </h2>
                <div class="fl title-hint">
                    支持批量上传（单次最多10个），支持mp3格式，单个文件大小不超过100M，文件名请勿包含特殊字符。
                </div>

                <el-upload class="upload-demo fr"
                           :action="action"
                           :headers="myHeaders"
                           :data="params"
                           :before-upload="beforeVideoUpload"
                           :on-progress="progress"
                           :on-success="success"
                           :on-error="errorUpload"
                           multiple
                           :limit="10"
                           :show-file-list="false">
                    <el-button type="danger"
                               class=" red-btn">上传音频</el-button>
                </el-upload>
            </div>
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
            <div class="upload-hint tr" v-if="successNum>0 || failNum>0">
                    已完成{{successNum}}个文件，失败{{failNum}}个,<span class="red-text">{{Number(successNum)==0?'请重新上传':'请点击保存'}}</span>
                </div>
        </div>

        <div class="tc btn-group" v-show="btnFlag">
            <el-button type="info"
                       class="btn cancel-btn">取消</el-button>
            <el-button type="danger"
                       class="red-btn btn" @click="save">保存</el-button>
        </div>
    </div>
</template>
<script>
    import { getToken } from '@/utils/auth';
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
                fileType:'audio',
                videoType:1
            },
            audioIds:[],
            titleList:[
                {
                    name:'音频库',
                    pathInfo:'/resource/audio'
                },
                {
                    name:'音频上传',
                    pathInfo:''
                }                               
            ],
            locaListStr:[] 
        };
    },
   components:{
        breadcrumb
    },      
    computed:{
        btnFlag(){
            return this.audioIds.length>0
        }
    },
    created(){
        this.myHeaders = {
            token: getToken()
        };
        this.action = this.$server.uploadResource
    },
    methods: {
        storage: function(size) {
            if (!size) return "";
            let num = 1024.00; //byte
            if (size < num) {
                return size + "B";
            } else {
                return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
            }
        },
        beforeVideoUpload(file) {
            if(this.locaListStr.length==0){
                this.locaListStr.push(file.name);
            }else{
                var list = [];
                for (const iterator of this.locaListStr) {
                    if(file.name==iterator){
                        this.$message.error("不能上传相同名称的音频！");
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
            if (format == "MP3" || format == "WMA" || format == "WAV") {
                return true;
            } else {
                this.$message.error("文件格式有误，请重试！");
                return false;
            }
        },
        progress(event, file, fileList) {
            let uid = (file["uid"] || parseInt(Math.random() * 10000)) + "";
            let fileInfo = JSON.parse(JSON.stringify(file));
            fileInfo["percent"] = event["percent"];
            fileInfo["updateStatusText"] = "上传中";
            this.$set(this.fileList, uid, fileInfo);
        },
        success(response, file, fileList) {
            if (response.status === 200) {
                this.audioIds.push(response.content.VideoId)
                let uid = file["uid"];
                let fileInfo = JSON.parse(JSON.stringify(file));
                fileInfo["updateStatusText"] = "上传成功";
                fileInfo["updateState"] = "uploadSuccess";
                this.$set(this.fileList, uid, fileInfo);
                this.successNum++;
            } else {
                this.errorUpload(response, file, fileList )
            }
        },
        errorUpload(response, file, fileList) {
            let uid = file["uid"];
            let fileInfo = JSON.parse(JSON.stringify(file));
            fileInfo["updateStatusText"] = "失败";
            fileInfo["updateState"] = "uploadFail";
            this.$set(this.fileList, uid, fileInfo);
            this.failNum++;
        },
        save(){
            let loading = Loading.service({})
            let query = {
                vid:JSON.stringify(this.audioIds),
                type:1
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
        width: 1106px;
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
