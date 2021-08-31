<template>
  <div class="upload-media-container">
    <div class="upload">
      <div class="btn-area clearfix">
        <input type="file" id="fileUpload" @change="fileChange($event)" ref="input">
        <div class="left"><el-button type="primary" @click="chooseFile">选择文件</el-button></div>
        <!-- <div class="right">
          <el-button type="primary" @click="allStartUpload">开始上传</el-button>
          <el-button type="primary" @click="allPauseUpload">暂停</el-button>
          <el-button type="primary" @click="allResumeUplad">恢复上传</el-button>
          <el-button type="primary">批量删除</el-button>
        </div> -->
      </div>
      <div class="file-list" v-show="fileList.length>0">
          <div class="file-item" v-for="(item,index) in fileList" :key="index">
              <div class="top">
                  <p class="file-name">{{item.name}}</p>
                  <p class="file-status">文件状态:{{item.status}}</p>
                  <p class="file-size">文件大小:{{item.size}}</p>
              </div>
              <div class="medium">
                  <el-progress :text-inside="true" :stroke-width="13" :percentage="item.percentage"></el-progress>
              </div>
              <div class="bottom">
                    <el-button type="text" :disabled="item.uploadDisabled" @click="authUpload(index)" ref="startBtn">开始上传</el-button>
                    <el-button type="text" :disabled="item.pauseDisabled" @click="pauseUpload(index)">暂停</el-button>
                    <el-button type="text" :disabled="item.resumeDisabled" @click="resumeUpload(index)">恢复上传</el-button>
                    <el-button type="text"  @click="delFile(index)">删除</el-button>        
              </div>
          </div>
          <el-button type="primary" :disabled="!saveStatus" @click="saveMedia">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  function getFileSize(fileByte) {
    var fileSizeByte = fileByte;
    var fileSizeMsg = "";
    if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
    else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
    else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
    else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
    else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    else fileSizeMsg = "文件超过1TB";
    return fileSizeMsg;
   }
  export default {
    data () {
      return {
        timeout: '',
        partSize: '',
        parallel: '',
        retryCount: '',
        retryDuration: '',
        region: 'cn-shanghai',
        userId: '1540507958583619',
        uploaders:[],
        fileList:[],
        saveStatus:false,
        disabledState:false
      }
    },
    props:['fileType','videoType'],
    watch:{
      fileList:{
        handler(cur,old){
          let index = cur.findIndex(item=>item.transCodeStatus == false)
          this.saveStatus = index<0?true:false
        },
        deep:true
      }
    }, 
    methods: {
      /**
       * 选择文件
       */
      chooseFile(){
        this.$refs.input.value = ''
        this.$refs.input.click();
      },
      /**
       * 获取文件，并创建阿里云媒体上传对象
       */
      fileChange (e) {
        let file = e.target.files[0];
        let format = file.name.split(".").pop().toLocaleUpperCase();
        if(this.fileType=='video'){
            if (!(format == "MP4" || format == "FLV")) {
                this.$message.error("文件格式有误，请重试！");
                return false;
            }
        }else if(this.fileType=='audio'){
            if (!(format == "MP3" || format == "WMA" || format == "WAV")) {
                this.$message.error("文件格式有误，请重试！");
                return false;
            }
        }
        if (file.name.length > 200) {
            this.$message.error("文件名字过长，请更改后重试！");
            return false;
        }
        let obj = this.fileList.find(item=>item.name==file.name)
        if(obj){
            this.$message.error(`文件${obj.name}已存在上传列表中`);
            return false;
        }
        let index = this.fileList.length;
        let userData = '{"Vod":{}}';
        this.uploaders[index] = this.createUploader(index);
        this.uploaders[index].addFile(file, null, null, null, userData)
        let files = this.uploaders[index].listFiles()[0];
        setTimeout(()=>{
          let obj = this.fileList.find(item=>item.fileHash==files.fileHash);
          if(obj){
            this.$message.error(`存在内容相同的文件,文件名是${obj.name}`);
            this.uploaders.splice(index,1);
          }else{
            let params = {
              name:files.file.name, 
              fileHash:files.fileHash,
              size:getFileSize(files.file.size),
              uploadDisabled:false,
              pauseDisabled:true,
              resumeDisabled:true,
              status:'准备就绪',
              percentage:0,
              transCodeStatus:false
            }
            this.$set(this.fileList,index,params);
          }
        },500)
      },
      /**
       * 单个开始上传
       */
      authUpload (index) {
        // 然后调用 startUpload 方法, 开始上传
        this.uploaders[index].startUpload()
        this.fileList[index].uploadDisabled = true;
        this.fileList[index].pauseDisabled = false;
      },
      /**
       * 批量开始上传
       */
      allStartUpload(){
        console.log(this.$refs.startBtn)
      },
      /**
       * 单个暂停
       */
      pauseUpload (index) {
        this.uploaders[index].stopUpload()
        this.fileList[index].resumeDisabled = false
        this.fileList[index].pauseDisabled = true
      },
      /**
       * 批量暂停
       */
      allPauseUpload(){
        for(let index=0;index<this.fileList.length;index++){
          this.uploaders[index].stopUpload()
          this.fileList[index].resumeDisabled = false
          this.fileList[index].pauseDisabled = true
        }
      },
      /**
       * 单个恢复上传
       */
      resumeUpload (index) {
        this.uploaders[index].startUpload()
        this.fileList[index].resumeDisabled = true
        this.fileList[index].pauseDisabled = false
      },
      /**
       * 批量恢复上传
       */
      allResumeUplad(){
        for(let index=0;index<this.fileList.length;index++){
          this.uploaders[index].startUpload()
          this.fileList[index].resumeDisabled = true
          this.fileList[index].pauseDisabled = false
        }
      },
      /**
       * 删除单个
       */
      delFile(index){
        let fileTypeName = this.fileType=='video'?'视频':'音频'
        this.$confirm(`确定要删除这个${fileTypeName}吗？`, '删除确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal:false,
            closeOnPressEscape:false,
        }).then(() => {
            this.fileList.splice(index,1);
            this.uploaders.splice(index,1);
        }).catch(()=>{

        }) 
        
      },  
      saveMedia(){
        var self= this;
        let obj = this.fileList.find(item=>item.transCodeStatus == false)
        if(obj){
          this.$message.error(`${obj.name}尚未完成转码，请稍后再试`)
          return;
        }
        let temp = this.fileList.map(item=>{
          return item.videoId
        })
        let query = {
            vid:JSON.stringify(temp),
            type:this.fileType=='audio'?1:2
        }
        if(!self.disabledState){
            self.disabledState = !self.disabledState;
            this.$http.post(this.$server.saveResource,query).then(res=>{
              if(res.status == 200){
                  self.disabledState = !self.disabledState;
                  this.$message({
                      message: '保存成功',
                      type: 'success'
                  })
                  this.$router.go(-1)
              }
            })
            .catch(err => {
                self.disabledState = !self.disabledState;
            });                             
          }
           
      },
      /**
       * new阿里云上传对象
       */
      createUploader (index) {
        let self = this
        let uploader = new AliyunUpload.Vod({
          timeout: self.timeout || 60000,
          partSize: self.partSize || 1048576,
          parallel: self.parallel || 10,
          retryCount: self.retryCount || 3,
          retryDuration: self.retryDuration || 2,
          region: self.region,
          userId: self.userId,
          // 添加文件成功
          addFileSuccess: function (uploadInfo) {
    
          },
          // 开始上传
          onUploadstarted: function (uploadInfo) {
            if(!uploadInfo.videoId){
              let query = {
                fileType:self.fileType,
                fileName:uploadInfo.file.name,
                fileSize:uploadInfo.file.size
              }
              if(self.videoType){
                  query.videoType = self.videoType;
              }  
              self.$http.post(self.$server.uploadxgetUploadAuth,query).then(data=>{
                if(data.status == 200){
                  let uploadAuth = data.content.uploadAuth
                  let uploadAddress = data.content.uploadAddress
                  let videoId = data.content.videoId
                  uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId)   
                }else{
                  
                }
              }).catch(()=>{
                self.fileList[index].uploadDisabled = true;
                self.fileList[index].pauseDisabled = true;
                self.fileList[index].resumeDisabled =true;
              })
            }else{
              let query = {
                videoId:uploadInfo.videoId
              }
              self.$http.post(self.$server.refreshUploadAuth,query).then(data=>{
                if(data.status == 200){
                  let uploadAuth = data.content.uploadAuth
                  let uploadAddress = data.content.uploadAddress
                  let videoId = data.content.videoId
                  uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId)   
                }
              })
            }
          },
          // 文件上传成功
          onUploadSucceed: function (uploadInfo) {
            self.fileList[index].status = '上传成功,转码中...'
            self.fileList[index].uploadDisabled = true;
            self.fileList[index].pauseDisabled = true;
            self.fileList[index].resumeDisabled =true;
            let query = {
              videoId:uploadInfo.videoId,
              fileType:self.fileType,
            }
            if(self.videoType){
                query.videoType = self.videoType
            }
            self.$http.post(self.$server.uploadxSubmitTranscode,query).then(data=>{
              if(data.status == 200){
                self.fileList[index].status = '转码成功'
                self.fileList[index].transCodeStatus = true;
                self.fileList[index].videoId = uploadInfo.videoId;
              }
            });
          },
          // 文件上传失败
          onUploadFailed: function (uploadInfo, code, message) {
            self.fileList[index].status = '上传失败，请重新上传'
          },
          // 取消文件上传
          onUploadCanceled: function (uploadInfo, code, message) {
            self.fileList[index].status = '文件已暂停上传'
            self.fileList[index].uploadDisabled = true;
            self.fileList[index].pauseDisabled = true;
            self.fileList[index].resumeDisabled = false;
          },
          // 文件上传进度
          onUploadProgress: function (uploadInfo, totalSize, progress) {
            self.fileList[index].percentage = Math.ceil(progress * 100)
            self.fileList[index].status = '文件上传中...'
            self.fileList[index].uploadDisabled = true;
            self.fileList[index].pauseDisabled = false;
            self.fileList[index].resumeDisabled =true;
          },
          // 上传凭证超时
          onUploadTokenExpired: function (uploadInfo) {
            let query = {
              videoId:uploadInfo.videoId
            }
            self.$http.post(self.$server.refreshUploadAuth,query).then(data=>{
              if(data.status == 200){
                let uploadAuth = data.content.uploadAuth
                let uploadAddress = data.content.uploadAddress
                let videoId = data.content.videoId
                uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId)   
              }
            })
          },
          // 全部文件上传结束
          onUploadEnd: function (uploadInfo) {

          }
        })
        return uploader
      }
    }
  }
</script>
<style lang="scss" scoped>
    .upload-media-container{
        background: #fff;
        padding: 20px;
        #fileUpload{
          opacity: 0;
          position: absolute;
          right: -100px;
          top:-100px;
        }
        .btn-area{
          .left{
            float: left;
          }
          .right{
            float: right;
          }
        }
        .file-list{
            padding: 20px 0;
            .file-item{
                border:1px solid #dfdfdf;
                border-radius: 5px;
                padding: 20px;
                margin-bottom:10px;
                .file-name,.file-status,.file-size{
                    font-size: 15px;
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 10px;
                }
                .file-size,.file-status{
                    float: right;
                }
                .medium{
                    margin:5px 0;
                    
                }
                .bottom{
                    .el-button{
                        padding: 0;
                    }
                }
            }
        }
    }
</style>