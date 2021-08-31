<template>
    <div class="H5-creat-section">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>    
        </div>
        <div class="page-content">
            <div class="messageCss">
                小节所有的添加、删除操作必须通知前端配合修改前端素材，切记！
            </div>
            <div>
                小节名称<el-input style='width:250px;margin-left:5px;' maxlength='20' v-model="periodName"></el-input>
                <span>{{periodName.length||0}}/20</span>
            </div>
            <div class="tab-one-box">     
                <div>
                    小节图片
                </div>              
                <div class="uploadBox">
                    <el-upload
                        class="avatar-uploader"
                        :action="actiosService"
                        :show-file-list="false"
                        :headers="myHeaders"
                        :data="{fileType:pdfData.img}"
                        :before-upload="(file)=>{return beforeAvatarUpload(file,1)}"
                        :on-success="(file)=>{return handleAvatarSuccess(file,1)}"
                        :on-error="(file)=>{return handleAvatarError(file,1)}"
                        :on-progress="(file)=>{return handleAvatarProgress(file,1)}"                            
                        >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                    <div style="color:#ccc;margin-left:10px;">尺寸:609*399;大小≤1m,支持PNG,JPEG</div>
                </div>
                <div class="imgStyle1">
                    <img v-if='backgroundImg' :src="backgroundImg"/>
                    <i class="el-icon-delete-solid" @click="closeImgIcon()"></i>
                </div>
            </div> 
            <div class="tab-two-box">
                <div class="title">小节模块</div>
                <div class="section-model-box">
                    <div class="tablist">
                        <el-button size="medium" :type="tabsType==1?'primary':''" @click="tabsEven(1)">小剧场</el-button>
                        <el-button size="medium" :type="tabsType==2?'primary':''" @click="tabsEven(2)">藏书阁</el-button>
                        <el-button size="medium" :type="tabsType==3?'primary':''" @click="tabsEven(3)">大闯关</el-button>                        
                    </div>
                    <div class="tabContent">
                        <div class="contentOne" v-if="tabsType==1">
                            <div class='xjc-box'>
                                <div class='title'>上传视频</div>
                                <div class='videoBox'>
                                    <div class="btn-area clearfix">
                                        <input type="file" id="fileUpload" @change="fileChange($event)" ref="input">
                                        <div class="left"><el-button type="primary" @click="chooseFile">选择文件</el-button></div>
                                        <div class='videoName' v-if="xjcVideoName">名称:{{xjcVideoName}}</div>
                                    </div>
                                    <div class='imgDiv'></div>
                                    <div class="file-item" v-if="xjcPress">
                                        <div class="top">
                                            <p class="file-name">文件名称:{{fileVideo.name}}</p>
                                            <p class="file-status">上传状态:{{fileVideo.status}}</p>
                                            <p class="file-size">文件大小:{{fileVideo.size}}</p>
                                        </div>
                                        <div class="medium">
                                            <el-progress :text-inside="true" :stroke-width="13" :percentage="fileVideo.percentage"></el-progress>
                                        </div>
                                        <div class="bottom">
                                                <el-button type="text" :disabled="fileVideo.uploadDisabled" @click="authUpload()">开始上传</el-button>
                                                <el-button type="text" :disabled="fileVideo.pauseDisabled" @click="pauseUpload()">暂停</el-button>
                                                <el-button type="text" :disabled="fileVideo.resumeDisabled" @click="resumeUpload()">恢复上传</el-button>
                                                <el-button type="text" :disabled="fileVideo.removeDisabled" @click="delFile()">删除</el-button>        
                                        </div>                                        
                                    </div>
                                </div>
                            </div>                            
                        </div>  
                        <div class="contentTwo" v-if="tabsType==2">                                               
                            <div class='csg-box'>
                                <div class='box-top'>
                                    <div class='boxTopRow'>
                                        <!-- <div class='title'>上传模块导读音频</div>
                                             <div class='audioBox'>
                                            <el-upload
                                                class="avatar-uploader btuDiv"
                                                :action="actiosService"
                                                :show-file-list="false"
                                                :headers="myHeaders"
                                                :data="{fileType:pdfData.audio}"
                                                :before-upload="(file)=>{return beforeAvatarUpload(file,3)}"
                                                :on-success="(file)=>{return handleAvatarSuccess(file,3)}"  
                                                :on-error="(file)=>{return handleAvatarError(file,3)}"   
                                                :on-progress="(file)=>{return handleAvatarProgress(file,3)}"                        
                                                >
                                                <el-button size="small" :disabled='!csgHead.audioIsShow' :loading="!csgHead.audioIsShow" type="primary" >{{!csgHead.audioIsShow?'上传中':'上传'}}</el-button>
                                            </el-upload>
                                            <div class='imgDiv' v-loading="!csgHead.audioIsShow">
                                                <audio class="audioCss" controlsList="nodownload nofullscreen noremoteplayback" disable_full_screen='1' controls v-if="csgHead.audioIsShow">
                                                    <source :src="csgHead.audios" type="audio/ogg">
                                                    <source :src="csgHead.audios" type="audio/mpeg">
                                                    您的浏览器不支持 audio 元素。
                                                </audio>
                                                <div class="audioTitleCss" v-if="csgHead.audiosName">名称:{{csgHead.audiosName||''}}</div>
                                            </div>
                                        </div> -->
                                        <div class='title'>添加领读音频</div>
                                        <div class='audioBox'>
                                            <el-button size="small" class="btuDiv" @click='addTheTitle(3)' :disabled="periodModuleListFour.length>=50?true:false" type="primary">添加</el-button>
                                            <div class='uploadCsgBox'>
                                                <div class='listDiv' v-for="(item,index) in periodModuleListFour" :key="index">
                                                    <div class='listTitle'>
                                                        <div>第{{index+1}}句</div>
                                                        <span style='padding:0 20px;'>请将藏书阁模块第<span style='color:#9E0E00;padding:0 5px;'>{{index+1}}</span>句领读的图片,文字,音频需要发给前端开发人员</span>
                                                        <i class="el-icon-circle-close" @click="removeTheTitle(item,index,4)"></i>
                                                    </div>
                                                    <!-- <div class='contentBox'>
                                                        <div class='box1'>
                                                            <div class='title'>上传</div>
                                                            <el-upload
                                                                class="upload-demo btuDiv"
                                                                :action="actiosService"
                                                                :headers="myHeaders"
                                                                :data="{fileType:pdfData.img}"
                                                                :before-upload="(file)=>{return beforeAvatarUploadCsg(file,index,'img',4)}"
                                                                :on-success="(file)=>{return uploadFileSuccessCsg(file,index,'img',4)}"
                                                                :on-error="(file)=>{return uploadFileErrorCsg(file,index,'img',4)}"
                                                                :on-progress="(file)=>{return handleAvatarProgressCsg(file,index,'img',4)}"    
                                                                :show-file-list="false"
                                                                >
                                                                <el-button size="small" type="primary">上传</el-button>
                                                                <p class='chicunCss'>尺寸:1218*563</p>
                                                            </el-upload>  
                                                            <div class="imgstyle">
                                                                <div v-loading="item.loadImg">
                                                                    <img v-if="item.imgs" :src="item.imgs"/>
                                                                </div>
                                                            </div> 
                                                        </div>
                                                        <div class='box2'>
                                                            <div class='title'>填写音频文案</div>
                                                            <el-input style='width:300px;' v-model="item.copy" maxlength='100' placeholder="请输入内容"></el-input>
                                                            <span>{{item.copy.length||0}}/100</span>                                                 
                                                        </div>
                                                        <div class='box3'>
                                                            <div class='audioBox'>
                                                                <div class='title'>上传音频</div>
                                                                <el-upload
                                                                    class="avatar-uploader btuDiv"
                                                                    :action="actiosService"
                                                                    :show-file-list="false"
                                                                    :headers="myHeaders"
                                                                    :data="{fileType:pdfData.audio}"
                                                                    :before-upload="(file)=>{return beforeAvatarUploadCsg(file,index,'audio',4)}"
                                                                    :on-success="(file)=>{return uploadFileSuccessCsg(file,index,'audio',4)}"
                                                                    :on-error="(file)=>{return uploadFileErrorCsg(file,index,'audio',4)}"
                                                                    :on-progress="(file)=>{return handleAvatarProgressCsg(file,index,'audio',4)}"                        
                                                                    >
                                                                    <el-button size="small" :disabled='item.loadAudio' :loading="item.loadAudio" type="primary" >{{item.loadAudio?'上传中':'上传'}}</el-button>
                                                                </el-upload>
                                                                <div class='imgDiv' v-loading="!item.audioIsShow">
                                                                    <div class='imgDivFirst'>
                                                                        <audio class="audioCss" controlsList="nodownload nofullscreen noremoteplayback" controls v-if="item.audioIsShow">
                                                                            <source :src="item.audios" type="audio/ogg">
                                                                            <source :src="item.audios" type="audio/mpeg">
                                                                            您的浏览器不支持 audio 元素。
                                                                        </audio>
                                                                    </div>
                                                                    <div class="audioTitleCss" v-if="item.audiosName">名称:{{item.audiosName||''}}</div>
                                                                </div>
                                                            </div>                                                    
                                                        </div>
                                                    </div> -->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- <div class='boxTopRow'>
                                         <div class='title'>填写领读原文</div>
                                         <div>
                                            <el-input
                                                type="textarea" 
                                                style="width:400px;"
                                                :autosize="{ minRows: 4, maxRows: 6}"
                                                placeholder="请输入内容"
                                                v-model="csgHead.copy">
                                            </el-input>
                                         </div>
                                    </div> -->
                                </div>
                                <div class='box-bottom'>

                                    <!-- 
                                        参数解释
                                        beforeUploadCsg【file,index,'img',2】
                                        file:上传的文件
                                        index:当前列表下标
                                        img:图片类型，(audio:音频类型)
                                        2：表示的当期是哪一种tab类型（1：小剧场，2：藏书阁，3：大闯关）

                                     -->                                    
                                    <div class='title'>添加跟读素材</div>
                                    <div class='audioBox'>
                                        <div class='box1'>
                                            <div class='title'>上传跟读背景</div>
                                            <el-button size="small" type="info" disabled>上传</el-button>
                                            <div style="margin-left:15px;">请将上传背景发给前端课程开发人员</div>
                                            <!-- <el-upload
                                                class="upload-demo btuDiv"
                                                :action="actiosService"
                                                :headers="myHeaders"
                                                :data="{fileType:pdfData.img}"
                                                :before-upload="(file)=>{return beforeAvatarUpload(file,3)}"
                                                :on-success="(file)=>{return handleAvatarSuccess(file,3)}"
                                                :on-error="(file)=>{return handleAvatarError(file,3)}"
                                                :on-progress="(file)=>{return handleAvatarProgress(file,3)}"     
                                                :show-file-list="false"
                                                >
                                                <el-button size="small" type="primary">上传</el-button>
                                                <p class='chicunCss'>尺寸:1218*563</p>
                                            </el-upload>  
                                            <div class="imgstyle">
                                                <div>
                                                    <img v-if="csgHead.imgs" :src="csgHead.imgs"/>
                                                </div>
                                            </div>  -->
                                        </div>      
                                        <div class="newCss">                
                                            <el-button size="small" class="btuDiv" @click='addTheTitle(1)' :disabled="periodModuleListTwo.length>=20?true:false" type="primary">添加</el-button>
                                            <div class='uploadCsgBox'>
                                                <div class='listDiv' v-for="(item,index) in periodModuleListTwo" :key="index">
                                                    <div class='listTitle'>
                                                        <div>第{{index+1}}句</div>
                                                         <span style='padding:0 20px;'>请将藏书阁模块第<span style='color:#9E0E00;padding:0 5px;'>{{index+1}}</span>句跟读的图片,文字,音频需要发给前端开发人员</span>
                                                        <i class="el-icon-circle-close" @click="removeTheTitle(item,index,2)"></i>
                                                    </div>
                                                    <!-- <div class='contentBox'>+
                                                        <div class='box2'>
                                                            <div class='title'>填写音频文案</div>
                                                            <el-input style='width:300px;' v-model="item.copy" maxlength='100' placeholder="请输入内容"></el-input>
                                                            <span>{{item.copy.length||0}}/100</span>                                                 
                                                        </div>
                                                        <div class='box3'>
                                                            <div class='audioBox'>
                                                                <div class='title'>上传音频</div>
                                                                <el-upload
                                                                    class="avatar-uploader btuDiv"
                                                                    :action="actiosService"
                                                                    :show-file-list="false"
                                                                    :headers="myHeaders"
                                                                    :data="{fileType:pdfData.audio}"
                                                                    :before-upload="(file)=>{return beforeAvatarUploadCsg(file,index,'audio',2)}"
                                                                    :on-success="(file)=>{return uploadFileSuccessCsg(file,index,'audio',2)}"
                                                                    :on-error="(file)=>{return uploadFileErrorCsg(file,index,'audio',2)}"
                                                                    :on-progress="(file)=>{return handleAvatarProgressCsg(file,index,'audio',2)}"                        
                                                                    >
                                                                    <el-button size="small" :disabled='item.loadAudio' :loading="item.loadAudio" type="primary" >{{item.loadAudio?'上传中':'上传'}}</el-button>
                                                                </el-upload>
                                                                <div class='imgDiv' v-loading="!item.audioIsShow">
                                                                    <div class='imgDivFirst'>
                                                                        <audio class="audioCss" controlsList="nodownload nofullscreen noremoteplayback" controls v-if="item.audioIsShow">
                                                                            <source :src="item.audios" type="audio/ogg">
                                                                            <source :src="item.audios" type="audio/mpeg">
                                                                            您的浏览器不支持 audio 元素。
                                                                        </audio>
                                                                    </div>
                                                                    <div class="audioTitleCss" v-if="item.audiosName">名称:{{item.audiosName||''}}</div>
                                                                </div>
                                                            </div>                                                    
                                                        </div>
                                                    </div> -->
                                                </div>
                                            </div>
                                        </div>      
                                    </div>
                                </div>
                            </div>                             
                        </div>
                        <div class="contentThree"  v-if="tabsType==3">
                            <div class='dcg-box'>
                                    <div class='title'>添加大闯关导读音频</div>
                                    <div class='audioBox'>
                                        <el-button size="small" class="btuDiv" type="primary" @click='addTheTitle(2)' :disabled="periodModuleListThree.length>=100?true:false">添加</el-button>
                                        <div class='uploadCsgBox'>
                                            <div class='listDiv' v-for="(item,index) in periodModuleListThree" :key="index">
                                                <div class='listTitle'>
                                                    <div>第{{index+1}}题</div>
                                                    <i class="el-icon-circle-close" @click="removeTheTitle(item,index,3)"></i>
                                                </div>
                                                <div class='contentBox'>
                                                    <div class='box3'>
                                                            <div class='title'>上传音频</div>
                                                            <el-upload
                                                                class="avatar-uploader btuDiv"
                                                                :action="actiosService"
                                                                :show-file-list="false"
                                                                :headers="myHeaders"
                                                                :data="{fileType:pdfData.audio}"
                                                                :before-upload="(file)=>{return beforeAvatarUploadCsg(file,index,'audio',3)}"
                                                                :on-success="(file)=>{return uploadFileSuccessCsg(file,index,'audio',3)}"
                                                                :on-error="(file)=>{return uploadFileErrorCsg(file,index,'audio',3)}"
                                                                :on-progress="(file)=>{return handleAvatarProgressCsg(file,index,'audio',3)}"                        
                                                                >
                                                                <el-button size="small" :disabled='item.loadAudio' :loading="item.loadAudio" type="primary" >{{item.loadAudio?'上传中':'上传'}}</el-button>
                                                            </el-upload>
                                                            <div class='imgDiv' v-loading="!item.audioIsShow">
                                                                <div class='imgDivFirst'>
                                                                    <audio class="audioCss" controlsList="nodownload nofullscreen noremoteplayback" controls v-if="item.audioIsShow">
                                                                        <source :src="item.audios" type="audio/ogg">
                                                                        <source :src="item.audios" type="audio/mpeg">
                                                                        您的浏览器不支持 audio 元素。
                                                                    </audio>
                                                                </div>
                                                                <div class="audioTitleCss" v-if="item.audiosName">名称:{{item.audiosName||''}}</div>
                                                            </div>                                                    
                                                    </div>
                                                    <div class='box1'>
                                                        <div class='title'>上传图片</div>
                                                        <!-- 
                                                            参数解释
                                                            beforeUploadCsg【file,index,'img',2】
                                                            
                                                            file:上传的文件
                                                            index:当前列表下标
                                                            img:图片类型，(audio:音频类型)
                                                            2：表示的当期是哪一种tab类型（1：小剧场，2：藏书阁，3：大闯关）

                                                         -->
                                                        <el-upload
                                                            class="upload-demo btuDiv"
                                                            :action="actiosService"
                                                            :headers="myHeaders"
                                                            :data="{fileType:pdfData.img}"
                                                            :before-upload="(file)=>{return beforeAvatarUploadCsg(file,index,'img',3)}"
                                                            :on-success="(file)=>{return uploadFileSuccessCsg(file,index,'img',3)}"
                                                            :on-error="(file)=>{return uploadFileErrorCsg(file,index,'img',3)}"
                                                            :on-progress="(file)=>{return handleAvatarProgressCsg(file,index,'img',3)}"     
                                                            :show-file-list="false"
                                                            >
                                                            <el-button size="small" type="primary">上传图片</el-button>
                                                            <p class='chicunCss'>尺寸:1218*1125</p>
                                                        </el-upload>  
                                                        <div class="imgstyle">
                                                            <div v-loading="item.loadImg">
                                                                <img v-if="item.imgs" :src="item.imgs"/>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>                      
                    </div>
                    <div class="imgSection" v-if="tabsType==1">
                        <div>添加学习报告</div>
                        <div class="uploadBox">
                            <el-upload
                                class="avatar-uploader"
                                :action="actiosService"
                                :show-file-list="false"
                                :headers="myHeaders"
                                :data="{fileType:pdfData.img}"
                                :before-upload="(file)=>{return beforeAvatarUpload(file,2)}"
                                :on-success="(file)=>{return handleAvatarSuccess(file,2)}" 
                                :on-error="(file)=>{return handleAvatarError(file,2)}" 
                                :on-progress="(file)=>{return handleAvatarProgress(file,2)}"                         
                                >
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                            <div style="color:#ccc;margin-left:10px;margin-top:10px;">尺寸宽:345,高度不限;支持PNG,JPEG</div>
                        </div>
                        <div class="imgStyle1">
                            <img v-if='studyReport' :src="studyReport" @click="selectImgs(true)"/>
                            <i class="el-icon-delete-solid" @click="closeImgIcon()"></i>
                        </div>                        
                    </div>
                </div>
            </div>   
            <div style='text-align:center;margin-top:20px;'>
                <el-button @click="dialogVisibleEven(false)">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleEven(true)">确 定</el-button>
            </div>                
        </div>
        <el-dialog
            title="提示"
            :visible.sync="leaveDialogVisible"
            width="30%"
            >
            <span>您有未保存的信息，离开后会丢失，确认要离开吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="leaveDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="leavePage">确 定</el-button>
            </span>
        </el-dialog>  
        <div class="imgSectionBig" v-show="imgSectionBigType" @click="selectImgs(false)">
            <div>
                <img :src='studyReport'/>
            </div>
            
        </div>
    </div>
</template>

<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
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
    data() {
        return {
            myHeaders: {token: getToken()},
            titleList:[], 
            titleName:[
                '题目一',
                '题目二',
                '题目三',
                '题目四',
                '题目五',
                '题目六',
                '题目七',
                '题目八',
                '题目九',
                '题目十'
            ],
            periodModuleListOne:[
                {
                    "type":1,// 小节类型:类型（1：小剧场，2：藏书阁，3：大闯关）
                    "sortNum":1,//序号 
                    "id":'',
                    "videoId":''                   
                }                
            ],
            periodModuleListTwo:[
                // {
                    // // "id":'',
                    // "type":2,// 小节类型:类型（1：小剧场，2：藏书阁，3：大闯关）',
                    // "sortNum":'',//序号
                    // // "audiosName":'',
                    // // "audios":"",// 音频地址
                    // // "copy":"",// 文案
                    // "readType":2,
                    // "deleteFlag":0,// 删除标识 删除时传1，传id  
                    // // "loadAudio":false,  //音频加载
                    // // "audioIsShow":true, //音频组件的显隐    
                // }                
            ],
            periodModuleListThree:[
                {
                    // "id":'',
                    "type":3,// 小节类型:类型（1：小剧场，2：藏书阁，3：大闯关）',
                    "sortNum":'',//序号
                    "audios":"",// 音频地址
                    "audiosName":'',
                    "imgs":"",// 图片
                    "deleteFlag":0,// 删除标识 删除时传1，传id  
                    "loadImg":false, //图片加载
                    "loadAudio":false,  //音频加载
                    "audioIsShow":true, //音频组件的显隐         
                }                
            ],
            periodModuleListFour:[
                // {
                    // "type":2,// 小节类型:类型（1：小剧场，2：藏书阁，3：大闯关）',
                    // "sortNum":'',//序号
                    // // "audios":"",// 音频地址
                    // // "audiosName":'',
                    // // "imgs":"",// 图片
                    // // "copy":'',
                    // "readType":1,
                    // "deleteFlag":0,// 删除标识 删除时传1，传id  
                    // // "loadImg":false, //图片加载
                    // // "loadAudio":false,  //音频加载
                    // // "audioIsShow":true, //音频组件的显隐         
                // }                
            ],
            periodModuleList:[],
            tabsType:1,
            id:'',
            periodName:'',
            backgroundImg:'',
            studyReport:'',
            periodModuleListTwoNum:1,
            periodModuleListThreeNum:1,
            periodModuleListFourNum:1,
            isEdit:false,
            courseId:'', 
            h5Id:'',
            edits:'',
            copyObjs:{},
            leaveDialogVisible:false,
            leaveFlag:false,
            leavePath:'',
            imgSectionBigType:false,
            actionH5Id:'',
            periodModuleListDelete:[],


            //新的版本迭代
            //上传图片时自定义参数
            pdfData:{
                img:'pic',
                audio:'audio'
            },
            // csgHead:{
                // "id":'',
                // "type":2,// 小节类型:类型（1：小剧场，2：藏书阁，3：大闯关）',
                // "sortNum":'',//序号
                // "audios":"",// 音频地址
                // "audiosName":'',
                // "copy":"",// 文案
                // "loadAudio":false,  //音频加载
                // "audioIsShow":true, //音频组件的显隐 
            //     "id":'',
            //     "readType":2,
            //     "imgs":'',
            //     "type":2        
            // },
            //视频
            uploaders:{},
            //视屏对象
            fileVideo:{},
            region: 'cn-shanghai',
            userId: '1540507958583619', 
            timeout: '',
            partSize: '',
            parallel: '',
            retryCount: '',
            retryDuration: '',
            xjcVideoName:'',
            xjcPress:false                    
        };
    },
    components: {
        breadcrumb
    },
    watch: {},
    computed:{
        actiosService(){
            return  this.$server.actionImgOrvideoNew;
        }   
    },
    created() {
        this.id = this.$route.query.id;
        this.courseId = this.$route.query.courseId;
        this.h5Id = this.$route.query.h5Id;
        this.edits = this.$route.query.sectionId;
        this.actionH5Id = this.$route.query.actionH5Id||1;
        this.titleList=[
                {
                    name:'H5课程管理',
                    pathInfo:''
                },   
                {
                    name:'H5课程',
                    pathInfo:'/H5WebView/index'
                },
                {
                    name:'创建H5课程',
                    pathInfo:'/H5WebView/H5Creat/'+this.courseId
                },
                {
                    name:'H5课程详情页',
                    pathInfo:'/H5WebView/H5SectionNew/'+this.h5Id+'/'+this.courseId
                }
        ];

        if(this.edits){
            this.isEdit=true;
            this.titleList.push(
                {
                    name:'编辑小节',
                    pathInfo:''
                }                 
            );
            this.getSectuinDataEven(this.edits);
        }else{
            this.copyObjs = {
                periodName:'',// 小节名称
                backgroundImg:'',// 背景图
                studyReport:'',// 学习报告      
                periodModuleListOne:[{                    
                    "type":1,
                    "sortNum":1, 
                    "id":'',
                    "videoId":'' }],
                periodModuleListTwo:[
                    // {     
                    // "type":2,// 小节类型:类型（1：小剧场，2：藏书阁，3：大闯关）',
                    // "sortNum":'',//序号
                    // // "audios":"",// 音频地址
                    // // "audiosName":'',
                    // // "readType":1,
                    // // "copy":"",// 文案
                    // // "deleteFlag":0,// 删除标识 删除时传1，传id  
                    // // "loadAudio":false,  //音频加载
                    // // "audioIsShow":true, //音频组件的显隐
                    // }
                ],
                periodModuleListThree:[{
                    "type":3,// 小节类型:类型（1：小剧场，2：藏书阁，3：大闯关）',
                    "sortNum":'',//序号
                    "audios":"",// 音频地址
                    "audiosName":'',
                    "imgs":"",// 图片
                    "deleteFlag":0,// 删除标识 删除时传1，传id  
                    "loadImg":false, //图片加载
                    "loadAudio":false,  //音频加载
                    "audioIsShow":true, //音频组件的显隐   
                }],
                periodModuleListFour:[
                    // {
                    // "type":2,// 小节类型:类型（1：小剧场，2：藏书阁，3：大闯关）',
                    // "sortNum":this.periodModuleListFourNum,//序号
                    // // "audios":"",// 音频地址
                    // // "audiosName":'',
                    // // "imgs":"",// 图片
                    // // "copy":"",// 文案
                    // // "readType":1,
                    // // "deleteFlag":0,// 删除标识 删除时传1，传id  
                    // // "loadImg":false, //图片加载
                    // // "loadAudio":false,  //音频加载
                    // // "audioIsShow":true, //音频组件的显隐 
                    // }
                ]                         
            };
            this.titleList.push(
                {
                    name:'小节模块',
                    pathInfo:''
                } 
            );
        }
    },
    beforeRouteLeave(to, from, next) {
        if(this.isEdit){
            this.copyObjs=JSON.parse(sessionStorage.getItem('copyObjs')); 
        }
        let copyNextObjs = {
            periodName:this.periodName,
            backgroundImg:this.backgroundImg,
            studyReport:this.studyReport,      
            periodModuleListOne:this.periodModuleListOne,
            periodModuleListTwo:this.periodModuleListTwo,
            periodModuleListThree:this.periodModuleListThree,
            periodModuleListFour:this.periodModuleListFour                        
        };         
        if(this.leaveFlag){
            setTimeout(()=>{
                if(this.isEdit){ 
                    sessionStorage.removeItem('copyObjs');
                }                   
                next();
            },100)
            return;
        }
        this.leavePath = to.fullPath;
        if (JSON.stringify(this.copyObjs) != JSON.stringify(copyNextObjs)) {
            this.leaveDialogVisible = true;
            next(false)
            return;
        } else {
            if(this.isEdit){ 
                sessionStorage.removeItem('copyObjs');
            }   
            next();
        }
    },     
    methods: {
            selectImgs(type){
                this.imgSectionBigType = type;
            },
            leavePage(){
                this.leaveFlag = true;
                this.leaveDialogVisible = false;
                this.$router.push(this.leavePath);
            },  
            /**
             * 获取文件，并创建阿里云媒体上传对象
             */            
            fileChange(e){
                console.log(e.target.files);
                let file = e.target.files[0];
                let format = file.name.split(".").pop().toLocaleUpperCase();
                console.log(file)
                if(file.type.indexOf('video')!=-1){
                    if (!(format == "MP4" || format == "FLV")) {
                        this.$message.error("文件格式有误，请重试！");
                        return false;
                    }
                }else{
                        this.$message.error('请上传视频文件');
                        return false;                    
                }              
                let userData = '{"Vod":{}}';
                this.uploaders= this.createUploader();
                this.uploaders.addFile(file, null, null, null, userData);
                setTimeout(()=>{
                        let params = {
                            name:file.name, 
                            fileHash:file.fileHash,
                            size:getFileSize(file.size),
                            uploadDisabled:false,
                            pauseDisabled:true,
                            resumeDisabled:true,
                            status:'准备就绪',
                            percentage:0,
                            vid:file,
                            transCodeStatus:false
                        }                
                        this.fileVideo = params;
                        this.xjcPress = true;
                },500);
            },
            //选择文件
            chooseFile(){
                if(this.fileVideo.isStartUpload){
                    this.$message.error('当前已有视频再上传。')
                }else{
                    this.$refs.input.click();
                }
                 
            },
            /**
             * new阿里云上传对象
             */
            createUploader () {
                let self = this
                let uploader = new AliyunUpload.Vod({
                timeout: self.timeout || 60000,
                partSize: self.partSize || 1048576,
                parallel: self.parallel || 5,
                retryCount: self.retryCount || 3,
                retryDuration: self.retryDuration || 2,
                region: self.region,
                userId: self.userId,
                // 添加文件成功
                addFileSuccess: function (uploadInfo) {
                //  console.log(uploadInfo)
                },
                // 开始上传
                onUploadstarted: function (uploadInfo) {
                    if(!uploadInfo.videoId){
                    let query = {
                        fileType:'video',
                        fileName:uploadInfo.file.name,
                        videoType:3,
                        fileSize:uploadInfo.file.size
                    }  
                    self.$http.post(self.$server.uploadxgetUploadAuth,query).then(data=>{
                        if(data.status == 200){
                            let uploadAuth = data.content.uploadAuth
                            let uploadAddress = data.content.uploadAddress
                            let videoId = data.content.videoId
                            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId)   
                        }else{
                            self.fileVideo.removeDisabled=false;
                        }
                    }).catch(()=>{
                        // self.fileList[index].uploadDisabled = true;
                        // self.fileList[index].pauseDisabled = true;
                        // self.fileList[index].resumeDisabled =true;
                        self.fileVideo.uploadDisabled = true;
                        self.fileVideo.pauseDisabled = true;
                        self.fileVideo.resumeDisabled =true;
                        self.fileVideo.removeDisabled=false;

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
                    self.fileVideo.status = '上传成功,转码中...'
                    self.fileVideo.uploadDisabled = true;
                    self.fileVideo.pauseDisabled = true;
                    self.fileVideo.resumeDisabled =true;
                    self.fileVideo.removeDisabled=true;
                    let query = {
                        videoId:uploadInfo.videoId,
                        fileType:'video',
                        videoType:3
                    }
                    self.$http.post(self.$server.uploadxSubmitTranscode,query).then(data=>{
                        if(data.status == 200){
                            self.fileVideo.status = '转码成功'
                            self.fileVideo.transCodeStatus = true;
                            self.fileVideo.videoId = uploadInfo.videoId;
                            self.xjcPress = false;
                            self.getVideoHomeImg();
                        }
                    });
                },
                // 文件上传失败
                onUploadFailed: function (uploadInfo, code, message) {
                    self.fileVideo.status = '上传失败，请重新上传'
                },
                // 取消文件上传
                onUploadCanceled: function (uploadInfo, code, message) {
                    self.fileVideo.status = '文件已暂停上传'
                    self.fileVideo.uploadDisabled = true;
                    self.fileVideo.pauseDisabled = true;
                    self.fileVideo.resumeDisabled = false;
                },
                // 文件上传进度
                onUploadProgress: function (uploadInfo, totalSize, progress) {
                    self.fileVideo.percentage = Math.ceil(progress * 100)
                    self.fileVideo.status = '文件上传中...'
                },
                // 上传凭证超时
                onUploadTokenExpired: function (uploadInfo) {
                    // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
                    // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
                    // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
                    let refreshUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
                    axios.get(refreshUrl).then(({data}) => {
                    let uploadAuth = data.UploadAuth
                    uploader.resumeUploadWithAuth(uploadAuth)
                    })
                    self.statusText = '文件超时...'
                },
                // 全部文件上传结束
                onUploadEnd: function (uploadInfo) {
                    console.log("onUploadEnd: uploaded all the files")
                    self.statusText = '文件上传完毕'
                }
                })
                return uploader
            },    
                /**
                 * 单个开始上传
                 */
                authUpload () {
                    // 然后调用 startUpload 方法, 开始上传
                    this.uploaders.startUpload()
                    this.fileVideo.uploadDisabled = true;
                    this.fileVideo.pauseDisabled = false;
                    this.fileVideo.removeDisabled = true;
                    this.fileVideo.isStartUpload = true;
                },
                /**
                 * 单个暂停
                 */
                pauseUpload () {
                    this.uploaders.stopUpload()
                    this.fileVideo.resumeDisabled = false
                    this.fileVideo.pauseDisabled = true;
                    this.fileVideo.removeDisabled = false;
                },
                /**
                 * 单个恢复上传
                 */
                resumeUpload () {
                    this.uploaders.startUpload()
                    this.fileVideo.resumeDisabled = true
                    this.fileVideo.pauseDisabled = false
                    this.fileVideo.removeDisabled = true;
                },
                /**
                 * 删除单个
                 */
                delFile(){
                    this.fileVideo.isStartUpload=false;
                    this.xjcPress = false;
                    this.fileVideo={};
                    delete this.uploaders;
                },         
                getVideoHomeImg(){
                    let query = {
                        params:{
                            vid:this.fileVideo.videoId
                        }   
                    }                     
                    this.$http.get(this.$server.getInteractVideo,query).then(res=>{
                        if(res.status==200){
                           this.periodModuleListOne[0].videoId = res.content[0].id||'';
                           this.xjcVideoName = res.content[0].title||'';
                           this.fileVideo.isStartUpload = false;
                        }
                    })                       
                },            
            //数据回填
            getSectuinDataEven(id){
                // let nums=0;
                let dataList1 = [];
                let dataList2 = [];
                let dataList3 = [];
                let dataList4 = [];
                this.$http.get(this.$server.h5Period+'/'+id).then(res=>{
                    if(res.status==200){
                        let data = res.content;
                        this.interactCourseId=data.interactCourseId;// 活动课程ID
                        this.periodName=data.periodName;// 小节名称
                        this.backgroundImg=data.backgroundImg;// 背景图
                        this.studyReport=data.studyReport;// 学习报告   
                        data.modules.forEach((item,index)=>{
                            if(item.type==1){
                                dataList1.push({
                                    "type":1,
                                    "sortNum":1,
                                    "id":item.id,
                                    "videoId":item.videoId                           
                                });
                                if(item.videosList.length){
                                    this.xjcVideoName = item.videosList[0].title;
                                }
                            }else if(item.type==2){
                                    if(item.sortNum>0){
                                        if(item.readType==1){//1：领读;  2：跟读
                                                dataList2.push({
                                                    "type":2,
                                                    "sortNum":item.sortNum,
                                                    "id":item.id,
                                                    // "audios":item.audios,// 音频地址
                                                    // 'audiosName':item.audiosName,
                                                    // "readType":1,
                                                    // "imgs":item.imgs,// 图片
                                                    // "copy":item.copy,// 文案
                                                    // "deleteFlag":0,// 删除标识 删除时传1，传id  
                                                    // "loadImg":false, 
                                                    // "loadAudio":false,
                                                    // "audioIsShow":item.audios?true:false 
                                                });
                                                }else{
                                                dataList4.push({
                                                    "type":2,
                                                    "sortNum":item.sortNum,
                                                    "id":item.id,
                                                    // "readType":2,
                                                    // "audios":item.audios,// 音频地址
                                                    // 'audiosName':item.audiosName,
                                                    // "copy":item.copy,// 文案
                                                    // "deleteFlag":0,// 删除标识 删除时传1，传id  
                                                    // "loadAudio":false,
                                                    // "audioIsShow":item.audios?true:false 
                                                });                                        
                                            }
                                    }else{
                                        // this.csgHead.audioIsShow=true;
                                        // this.csgHead.audios=item.audios;
                                        // this.csgHead.audiosName=item.audiosName;
                                        // this.csgHead.copy=item.copy;
                                        
                                        //new
                                        // this.csgHead.id=item.id;
                                        // this.csgHead.readType=item.readType||2;
                                        // this.csgHead.imgs=item.imgs;
                                        // this.csgHead.type=item.type;
                                    }
                            }else{
                                dataList3.push({
                                    "type":3,
                                    "sortNum":item.sortNum,
                                    "id":item.id,
                                    "audios":item.audios,// 音频地址
                                    'audiosName':item.audiosName,
                                    "imgs":item.imgs,// 图片
                                    "deleteFlag":0,// 删除标识 删除时传1，传id  
                                    "loadImg":false, 
                                    "loadAudio":false,
                                    "audioIsShow":item.audios?true:false                                                 
                                });
                            }
                        }); 
                        this.periodModuleListOne=dataList1;
                        this.periodModuleListTwo=dataList4;
                        this.periodModuleListThree=dataList3;
                        this.periodModuleListFour = dataList2;
                        let dddd = {
                            periodName:data.periodName,// 小节名称
                            backgroundImg:data.backgroundImg,// 背景图
                            studyReport:data.studyReport,// 学习报告      
                            periodModuleListOne:dataList1,
                            periodModuleListTwo:dataList2,
                            periodModuleListThree:dataList3,
                            periodModuleListFour:dataList4                         
                        };
                        this.periodModuleListTwoNum = dataList2.length||0;
                        this.periodModuleListThreeNum = dataList3.length||0;
                        this.periodModuleListFourNum = dataList4.length||0;
                        sessionStorage.setItem('copyObjs', JSON.stringify(dddd));
                    }
                })                
            },
            //添加题目
            addTheTitle(type){
                if(type==1){
                    this.periodModuleListTwoNum = this.periodModuleListTwoNum+1;
                    this.periodModuleListTwo.push({
                        // "id":'',
                        "type":2,// 小节类型:类型（1：小剧场，2：藏书阁，3：大闯关）',
                        "sortNum":this.periodModuleListTwoNum,//序号
                        // "audios":"",// 音频地址
                        // "audiosName":'',
                        // "copy":"",// 文案
                        "readType":2,
                        "deleteFlag":0,// 删除标识 删除时传1，传id  
                        // "loadAudio":false,  //音频加载
                        // "audioIsShow":true, //音频组件的显隐 
                    });
                }else if(type==2){
                    this.periodModuleListThreeNum = this.periodModuleListThreeNum+1;
                    this.periodModuleListThree.push({
                            // "id":'',
                            "type":3,// 小节类型:类型（1：小剧场，2：藏书阁，3：大闯关）',
                            "sortNum":this.periodModuleListThreeNum,//序号
                            "audios":"",// 音频地址
                            "audiosName":'',
                            "imgs":"",// 图片
                            "deleteFlag":0,// 删除标识 删除时传1，传id  
                            "loadImg":false, //图片加载
                            "loadAudio":false,  //音频加载
                            "audioIsShow":true, //音频组件的显隐   
                    });
                }else{
                    this.periodModuleListFourNum = this.periodModuleListFourNum+1;
                    this.periodModuleListFour.push({
                        // "id":'',
                        "type":2,// 小节类型:类型（1：小剧场，2：藏书阁，3：大闯关）',
                        "sortNum":this.periodModuleListFourNum,//序号
                        // "audios":"",// 音频地址
                        // "audiosName":'',
                        // "imgs":"",// 图片
                        // "copy":"",// 文案
                        "readType":1,
                        "deleteFlag":0,// 删除标识 删除时传1，传id  
                        // "loadImg":false, //图片加载
                        // "loadAudio":false,  //音频加载
                        // "audioIsShow":true, //音频组件的显隐 
                    });                    
                }
            },
            removeTheTitle(item,index,type){
                if(type==2){
                    if(this.periodModuleListTwo.length>1){
                        if(Number(item.id)>0){
                            this.periodModuleListDelete.push({
                                id:item.id,
                                deleteFlag:1,
                                type:2
                            });
                        }
                        this.periodModuleListTwo.splice(index,1);
                    }else{
                        this.$message.error('最少保留一条数据。')
                    }
                }else if(type==3){
                    if(this.periodModuleListThree.length>1){
                        if(Number(item.id)>0){
                            this.periodModuleListDelete.push({
                                id:item.id,
                                deleteFlag:1,
                                type:3
                            });
                        }
                        this.periodModuleListThree.splice(index,1);  
                    }else{
                        this.$message.error('最少保留一条数据。')
                    }                 
                }else{
                    if(this.periodModuleListFour.length>1){
                        if(Number(item.id)>0){
                            this.periodModuleListDelete.push({
                                id:item.id,
                                deleteFlag:1,
                                type:2
                            });
                        }
                        this.periodModuleListFour.splice(index,1);  
                    }else{
                        this.$message.error('最少保留一条数据。')
                    }  
                }
            },
            dialogVisibleEven(type){               
                if(type){
                    if(!this.backgroundImg.length>0){
                        this.$message.error('请上传小节图片')
                        return;
                    }
                    if(!this.studyReport.length>0){
                        this.$message.error('请上传学习报告')
                        return;
                    }
                    if(!this.periodName.length>0){
                        this.$message.error('填写小节名称')
                        return;
                    }
                    // this.periodModuleListOne[0].videoId=this.fileVideo.videoId||'';
                    if(!Number(this.periodModuleListOne[0].videoId)){
                       this.$message.error('请上传视频')
                       return;
                    } 
                    // if(!this.csgHead.imgs){
                    //    this.$message.error('请完善藏书阁信息')
                    //    return;
                    // }                   
                    // for (const iterator of this.periodModuleListTwo) {
                    //     if(!iterator.audios||!iterator.copy){
                    //         this.$message.error('请完善藏书阁信息')
                    //         return;                                
                    //     }
                    // }
                    for (const iterator of this.periodModuleListThree) {
                        if(!iterator.audios||!iterator.imgs){
                            this.$message.error('请完善大闯关信息')
                            return;                                
                        }
                    }
                    // for (const iterator of this.periodModuleListFour) {
                    //     if(!iterator.audios||!iterator.imgs||!iterator.copy){
                    //         this.$message.error('请完善藏书阁信息')
                    //         return;                                
                    //     }
                    // }                  
                   let query= {
                       interactCourseId:this.id,
                       periodName:this.periodName,
                       backgroundImg:this.backgroundImg,
                       studyReport:this.studyReport
                   };
                    this.periodModuleListTwo = this.periodModuleListTwo.map((x,i)=>{
                           x.sortNum=i+1;
                           return x;
                    });
                    this.periodModuleListThree = this.periodModuleListThree.map((x,i)=>{
                           x.sortNum=i+1;
                           return x;
                    });
                    this.periodModuleListFour = this.periodModuleListFour.map((x,i)=>{
                           x.sortNum=i+1;
                           return x;
                    });
                    
                    // let newList =[...this.periodModuleListOne,...this.periodModuleListTwo,...this.periodModuleListThree,...this.periodModuleListFour,...this.periodModuleListDelete,...[this.csgHead]];
                    let newList =[...this.periodModuleListOne,...this.periodModuleListTwo,...this.periodModuleListThree,...this.periodModuleListFour,...this.periodModuleListDelete];
                    this.periodModuleList = newList;
                    query["periodModuleList"] = this.periodModuleList;
                    query["transformRequest"] = true;
                    let url='';
                    if(this.isEdit){
                        url=this.$server.h5Period+'/'+this.edits;
                    }else{
                        url=this.$server.h5Period;
                    }
                    let config = {
                        headers: {'Content-Type': 'application/json;charset=UTF-8'}
                    }                  
                    this.$http.post(url,query,config).then(res=>{
                        if(res.status==200){
                            this.$message.success("创建成功!");
                            this.leaveFlag = true;
                            this.$router.push(`/H5WebView/H5SectionNew/${this.h5Id}/${this.courseId}`); 
                        }
                    })                    
                }else{
                    this.$router.push(`/H5WebView/H5SectionNew/${this.h5Id}/${this.courseId}`); 
                }
            },
            tabsEven(type){
                switch (type) {
                    case 1:
                        this.tabsType=type;
                        break;
                    case 2:
                        this.tabsType=type;
                        break;
                    case 3:
                         this.tabsType=type;
                        break;
                    default:
                        break;
                }
            },
            handleAvatarError(file,type){},
            handleAvatarProgress(file,type){},
            //index
            handleAvatarSuccess(file,type) {
               switch (type) {
                   case 1:
                        this.backgroundImg =file.content.resourceUrl;
                       break;
                   case 2:
                        this.studyReport =file.content.resourceUrl;
                       break;
                //    case 3:
                        // this.csgHead.audiosName = file.content.resourceName;
                        // this.csgHead.audioIsShow = true;
                        // this.csgHead.imgs =file.content.resourceUrl;
                    //    break;
                   default:
                       break;
               }
            },
            beforeAvatarUploadCsg(file,index,status,type){
                let isJPG = false;
                let isLt2M=0;
                let isSize = 0;
                switch (status) {
                    case 'img':
                        let width=0;
                        let height=0;
                        isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
                        if(!isJPG){
                            this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
                        }
                        isLt2M = file.size / 1024 / 1024 < 1.001;
                        if (!isLt2M) {
                            this.$message.error('上传图片大小不能超过 1m!');
                        } 
                        isSize = new Promise(function(resolve, reject) {
                                if(type==2||type==4){
                                    width= 1218;
                                    height = 563;
                                }
                                if(type==3){
                                    width= 1218;
                                    height = 1125;
                                }
                                //  width = 609;
                                //  height = 399;
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
                            this.$message.error(type==2?'上传的图片尺寸:1218*563':'上传的图片尺寸:1218*1125');
                            return Promise.reject();
                        });                           
                        break;
                    case 'audio':
                        let format = file.name.split(".").pop().toLocaleUpperCase();
                        // isJPG = (file.type === 'audio/mp3')?true:false;
                        isLt2M = file.size / 1024 / 1024 < 5.001;  
                        if (!(format == "MP3" || format == "WMA" || format == "WAV")) {
                            this.$message.error("文件格式有误，请重试！");
                            isJPG =false;
                        }else {
                            isJPG =true;
                        }
                        if (!isLt2M) {
                            this.$message.error('上传音频大小不能超过 1m!');
                        }                          
                        break;
                    default:
                        break;
                }
                if(status=='img'){
                    return isJPG && isLt2M && isSize;
                }else{
                    return isJPG&& isLt2M;
                }                
            },
            uploadFileSuccessCsg(file,index,status,type){
                // if(type==2){
                //     if(status=='img'){
                //         this.periodModuleListTwo[index].imgs=file.content.resourceUrl;
                //         this.periodModuleListTwo[index].loadImg= false;
                //     }else{
                //         this.periodModuleListTwo[index].audios=file.content.resourceUrl;
                //         this.periodModuleListTwo[index].audiosName=file.content.resourceName;
                //         this.periodModuleListTwo[index].audioIsShow = true;
                //         this.periodModuleListTwo[index].loadAudio= false;
                //     } 
                // }else 
                if(type==3){
                    if(status=='img'){
                        this.periodModuleListThree[index].imgs=file.content.resourceUrl;
                        this.periodModuleListThree[index].loadImg= false;
                    }else{
                        this.periodModuleListThree[index].audios=file.content.resourceUrl;
                        this.periodModuleListThree[index].audiosName=file.content.resourceName;
                        this.periodModuleListThree[index].audioIsShow = true;
                        this.periodModuleListThree[index].loadAudio= false;
                    } 
                }
                // else{
                //     if(status=='img'){
                //         this.periodModuleListFour[index].imgs=file.content.resourceUrl;
                //         this.periodModuleListFour[index].loadImg= false;
                //     }else{
                //         this.periodModuleListFour[index].audios=file.content.resourceUrl;
                //         this.periodModuleListFour[index].audiosName=file.content.resourceName;
                //         this.periodModuleListFour[index].audioIsShow = true;
                //         this.periodModuleListFour[index].loadAudio= false;
                //     }                     
                // }
               
            },
            uploadFileErrorCsg(file,index,status,type){
                // if(type==2){
                //     if(status=='img'){
                //         this.periodModuleListTwo[index].loadImg= false;
                //     }else{
                //         this.periodModuleListTwo[index].audioIsShow = true;
                //         this.periodModuleListTwo[index].loadAudio= false;
                //     } 
                // }else 
                if(type==3){
                    if(status=='img'){
                        this.periodModuleListThree[index].loadImg= false;
                    }else{
                        this.periodModuleListThree[index].audioIsShow = true;
                        this.periodModuleListThree[index].loadAudio= false;
                    } 
                }
                // else{
                //     if(status=='img'){
                //         this.periodModuleListFour[index].loadImg= false;
                //     }else{
                //         this.periodModuleListFour[index].audioIsShow = true;
                //         this.periodModuleListFour[index].loadAudio= false;
                //     }                     
                // }
                
            },
            handleAvatarProgressCsg(file,index,status,type){
                // if(type==2){
                //     if(status=='img'){
                //         this.periodModuleListTwo[index].loadImg= true;
                //     }else{
                //         this.periodModuleListTwo[index].audioIsShow = false;
                //         this.periodModuleListTwo[index].loadAudio= true;
                //     }
                // }else 
                if(type==3){
                    if(status=='img'){
                        this.periodModuleListThree[index].loadImg= true;
                    }else{
                        this.periodModuleListThree[index].audioIsShow = false;
                        this.periodModuleListThree[index].loadAudio= true;
                    }
                }
                // else{
                //     if(status=='img'){
                //         this.periodModuleListFour[index].loadImg= true;
                //     }else{
                //         this.periodModuleListFour[index].audioIsShow = false;
                //         this.periodModuleListFour[index].loadAudio= true;
                //     }                    
                // }                  
            },
            //,index,type
            beforeAvatarUpload(file,type) {
                let isJPG = false;
                let isLt2M=0;
                let isSize = 0;
                let width = 0;
                let height = 0;
                isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
                if(!isJPG){
                    this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!');
                }
                if(type==1||type==3){
                    isLt2M = file.size / 1024 / 1024 < 1.001;
                    if (!isLt2M) {
                        this.$message.error('上传图片大小不能超过 1m!');
                    }                            
                };
                isSize = new Promise(function(resolve, reject) {
                    if(type==1){
                        width = 609;
                        height = 399;
                        let _URL = window.URL || window.webkitURL;
                        let img = new Image();
                        img.onload = function() {
                            let valid = img.width == width && img.height==height;
                            valid ? resolve() : reject();
                        }
                        img.src = _URL.createObjectURL(file);
                    }else if(type==2){
                        let widths = 345;
                        let _URL = window.URL || window.webkitURL;
                        let imgs = new Image();
                        imgs.onload = function() {
                            let valid = imgs.width == widths;
                            valid ? resolve() : reject();
                        }
                        imgs.src = _URL.createObjectURL(file);
                    }else{
                        width= 1218;
                        height = 563;
                        let _URL = window.URL || window.webkitURL;
                        let img = new Image();
                        img.onload = function() {
                            let valid = img.width == width && img.height==height;
                            valid ? resolve() : reject();
                        }
                        img.src = _URL.createObjectURL(file);                                
                    }
                }).then(() => {
                    return file;
                }, () => {
                    if(type==1){
                        this.$message.error('上传的图片尺寸:609*399')
                    }else if(type==2){
                        this.$message.error('上传的图片尺寸宽:345px')
                    }else{
                        this.$message.error('上传的图片尺寸宽:1218*563')
                    }
                    return Promise.reject();
                });   
                if(type==1||type==3){
                     return isJPG && isLt2M && isSize;
                }else{
                    return isJPG&& isSize;
                }
            }
    }
};
</script>
<style>
.audioTitleCss{
    line-height: 40px;
    font-size: 16px;
    color: #9E0E00;    
}
.chicunCss{
    padding: 5px 0;
    color: #ccc;
}

</style>
<style scoped lang="scss">
    .H5-creat-section {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .imgSectionBig{
            position:fixed;
            display: flex;
            flex-direction:column-reverse ;
            bottom:0;
            left: 0;
            right: 0;
            top: 0;
            background:rgba($color: #000000, $alpha: .3);
            justify-content:center;
            align-items: center;
            overflow-y: auto;
            div{
                width:50%;
                overflow: auto;
                height:100%;
                img{
                    display: block;
                    width:100%;
                    cursor: pointer;
                }
            }
        }
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            padding: 20px;
            .messageCss{
                background:rgba(0, 0, 0,0.2);
                padding:20px 10px;
                font-size:18px;
                margin-bottom: 20px;
            }
            .tab-one-box{
                padding:20px 0;
                .uploadBox{
                    margin-top: 10px;
                }
                .imgStyle1{
                    position: relative;
                    width: 200px;
                    height: 112px;
                    background: #f4f4f4;
                    margin: 20px 0px;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                    i{
                        position: absolute;
                        right: -20px;
                        font-size: 14px;
                        top:0
                    }            
                }
            }
            .tab-two-box{
                .section-model-box{
                    padding:20px 0;
                    .tablist{
                        // padding:10px 0;
                        margin: 10px 0;
                        border-bottom: 1px solid #ccc;
                    }
                    .tabContent{
                        .contentOne{
                            .xjc-box{
                                display: flex;
                                flex-direction: row;
                                justify-content: flex-start;
                                align-items: flex-start;
                                margin-top: 10px;
                                padding:20px 0;
                                .videoBox{
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: flex-start;
                                    align-items: flex-start;
                                    .btn-area{                                     
                                        .left{
                                            float: left;
                                        }
                                        .right{
                                            float: right;
                                        }
                                        #fileUpload{
                                            opacity: 0;
                                            position: absolute;
                                            right: -100px;
                                            top:-100px;
                                        } 
                                        .videoName{
                                            text-align: center;
                                            margin-top: 50px;
                                            font-size: 16px;                                            
                                        }                                        
                                    }  
                                    .file-item{
                                        border:1px solid #dfdfdf;
                                        border-radius: 5px;
                                        padding: 20px;
                                        margin-left: 10px;
                                        .top{
                                            display: flex;
                                            flex-direction: revert;
                                            justify-content: space-between;  
                                            margin-bottom: 17px;                      
                                        }
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
                                    .btuDiv{
                                        margin: 0 15px;
                                    }
                                    // .imgDiv{
                                    //     width:200px;
                                    //     height: 112px;
                                    //     position: relative;
                                    //     margin-left: 10px;
                                    //     img{
                                    //         width:100%;
                                    //         height: 100%;
                                    //     }
                                    // }
                                }
                                .title{
                                    width: 60px;
                                    text-align: left;
                                }                                
                            }
                        }
                        .contentTwo{
                            .csg-box{
                                .box-top{
                                    .boxTopRow{
                                        display: flex;
                                        flex-direction: row;
                                        justify-content: flex-start;
                                        align-items: flex-start;
                                        margin-top: 10px;
                                        padding:20px 0; 
                                        // .audioBox{
                                        //     display: flex;
                                        //     flex-direction: row;
                                        //     justify-content: flex-start;
                                        //     align-items: flex-start;
                                        //     .btuDiv{
                                        //         margin: 0 15px;
                                        //     }
                                        //     .imgDiv{
                                        //         width:300px;
                                        //         height: 32px;
                                        //         position: relative;
                                        //         .audioCss{
                                        //             width:100%;
                                        //             height: 100%;
                                        //         }
                                        //     }
                                        // } 
                                        .title{
                                            width: 100px;
                                            text-align: center;
                                        }

                                        .audioBox{
                                            display: flex;
                                            flex-direction: row;
                                            justify-content: flex-start;
                                            align-items: flex-start;
                                            .btuDiv{
                                                margin: 0 15px;
                                            }
                                            .uploadCsgBox{
                                                .listDiv{
                                                    .listTitle{
                                                        display: flex;
                                                        flex-direction: row;
                                                        justify-content:space-between;
                                                        align-items: center; 
                                                        padding:15px 0;
                                                        div{
                                                            font-size: 15px;
                                                        }
                                                        i{
                                                            font-size: 20px;
                                                        }
                                                    }
                                                    .contentBox{
                                                        padding:0 20px 20px;
                                                        border: 1px solid #999;
                                                        margin-bottom: 15px;
                                                        border-radius:4px;
                                                        .box1{
                                                            .imgstyle{
                                                                width: 216px;
                                                                height:100px;
                                                                position: relative;
                                                                div{
                                                                    width: 100%;
                                                                    height: 100%;
                                                                    overflow: hidden;
                                                                    border: 1px solid #ccc;
                                                                    border-radius: 3px;
                                                                    text-align: center;
                                                                    line-height: 81px;                            
                                                                }
                                                            }                                                        
                                                        }
                                                        .box1,.box3{
                                                            display: flex;
                                                            flex-direction: row;
                                                            justify-content:flex-start;
                                                            align-items: flex-start; 
                                                            margin-top:20px;                                                   
                                                        }
                                                        .box3{
                                                            .imgDiv{
                                                                .imgDivFirst{
                                                                    width:300px;
                                                                    height: 32px;
                                                                    position: relative;
                                                                    .audioCss{
                                                                        width:100%;
                                                                        height: 100%;
                                                                    }
                                                                }
                                                            }      
                                                        }
                                                        .box2{
                                                            display: flex;
                                                            flex-direction: row;
                                                            justify-content:space-between;
                                                            align-items: center; 
                                                            margin-top:20px; 
                                                            .title{
                                                                // width:110px;
                                                                text-align: center;
                                                                margin-right: 20px;
                                                            }        
                                                        }
                                                    }
                                                }
                                            }
                                        } 
                                    }
                                }     
                                .box-bottom{
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: flex-start;
                                    align-items: flex-start;
                                    margin-top: 10px;
                                    padding:20px 0;
                                    .audioBox{
                                        >.box1{
                                            display: flex;
                                            flex-direction: row;
                                            -ms-flex-align: start;
                                            align-items: flex-start;
                                            .imgstyle{
                                                width: 216px;
                                                height:100px;
                                                position: relative;
                                                margin-left: 10px;
                                                div{
                                                    width: 100%;
                                                    height: 100%;
                                                    overflow: hidden;
                                                    border: 1px solid #ccc;
                                                    border-radius: 3px;
                                                    text-align: center;
                                                    line-height: 81px;                            
                                                }
                                            }                                                                                    
                                        }
                                        .newCss{
                                            display: flex;
                                            flex-direction: row;
                                            justify-content: flex-start;
                                            align-items: flex-start;
                                            margin-top: 20px;
                                            .btuDiv{
                                                margin: 0 15px;
                                            }
                                            .uploadCsgBox{
                                                .listDiv{
                                                    .listTitle{
                                                        display: flex;
                                                        flex-direction: row;
                                                        justify-content:space-between;
                                                        align-items: center; 
                                                        padding:5px 0;
                                                        div{
                                                            font-size: 15px;
                                                        }
                                                        i{
                                                            font-size: 20px;
                                                        }
                                                    }
                                                    .contentBox{
                                                        padding:0 20px 20px;
                                                        border: 1px solid #999;
                                                        margin-bottom: 15px;
                                                        border-radius:4px;
                                                        .box1{
                                                            .imgstyle{
                                                                width: 216px;
                                                                height:100px;
                                                                position: relative;
                                                                div{
                                                                    width: 100%;
                                                                    height: 100%;
                                                                    overflow: hidden;
                                                                    border: 1px solid #ccc;
                                                                    border-radius: 3px;
                                                                    text-align: center;
                                                                    line-height: 81px;                            
                                                                }
                                                            }                                                        
                                                        }
                                                        .box1,.box3{
                                                            display: flex;
                                                            flex-direction: row;
                                                            justify-content:flex-start;
                                                            align-items: flex-start; 
                                                            margin-top:20px;                                                   
                                                        }
                                                        .box3{
                                                            .imgDiv{
                                                                .imgDivFirst{
                                                                    width:300px;
                                                                    height: 32px;
                                                                    position: relative;
                                                                    .audioCss{
                                                                        width:100%;
                                                                        height: 100%;
                                                                    }
                                                                }
                                                            }     
                                                            .audioBox{
                                                                display: flex;
                                                                -ms-flex-direction: row;
                                                                flex-direction: row;
                                                                justify-content: flex-start;
                                                                align-items: flex-start;
                                                            } 
                                                        }
                                                        .box2{
                                                            display: flex;
                                                            flex-direction: row;
                                                            justify-content:space-between;
                                                            align-items: center; 
                                                            margin-top:20px; 
                                                            .title{
                                                                // width:110px;
                                                                text-align: center;
                                                                margin-right: 20px;
                                                            }        
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } 
                                    .title{
                                        width:100px;
                                        text-align:center;
                                    }
                                }                  
                            }
                        }         
                        .contentThree{
                            .dcg-box{
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: flex-start;
                                    align-items: flex-start;
                                    margin-top: 10px;
                                    padding:20px 0; 
                                    .audioBox{
                                        display: flex;
                                        flex-direction: row;
                                        justify-content: flex-start;
                                        align-items: flex-start;
                                        .btuDiv{
                                            margin: 0 15px;
                                        }
                                        .uploadCsgBox{
                                            .listDiv{
                                                .listTitle{
                                                    display: flex;
                                                    flex-direction: row;
                                                    justify-content:space-between;
                                                    align-items: center; 
                                                    padding:5px 0;
                                                    div{
                                                        font-size: 15px;
                                                    }
                                                    i{
                                                        font-size: 20px;
                                                    }
                                                }
                                                .contentBox{
                                                    padding:0 20px 20px;
                                                    border: 1px solid #999;
                                                    margin-bottom: 15px;
                                                    border-radius:4px;
                                                    .box1{
                                                        .imgstyle{
                                                            height:100px;
                                                            width: 108px;
                                                            position: relative;
                                                            div{
                                                                width: 100%;
                                                                height: 100%;
                                                                overflow: hidden;
                                                                border: 1px solid #ccc;
                                                                border-radius: 3px;
                                                                text-align: center;
                                                                line-height: 81px;                            
                                                            }
                                                        }        
                                                    }
                                                    .box1,.box3{
                                                        display: flex;
                                                        flex-direction: row;
                                                        justify-content:flex-start;
                                                        align-items: flex-start; 
                                                        margin-top:20px;                                                   
                                                    }
                                                    .box3{
                                                            .btuDiv{
                                                                margin: 0 15px;
                                                            }
                                                            .imgDiv{
                                                                .imgDivFirst{
                                                                    width:300px;
                                                                    height: 32px;
                                                                    position: relative;
                                                                    .audioCss{
                                                                        width:100%;
                                                                        height: 100%;
                                                                    }
                                                                }
                                                            }
                                                    }
                                                }
                                            }
                                        }
                                       
                                    }                                
                            }
                        }             
                    }
                    .imgSection{
                        padding:20px 0;
                        cursor: pointer;
                        .uploadBox{
                            padding:20px 0;
                        }
                        .imgStyle1{
                            position: relative;
                            width: 200px;
                            height: 112px;
                            background: #f4f4f4;
                            margin: 20px 0px;
                            img{
                                display: block;
                                width: 100%;
                                height: 100%;
                            }
                            i{
                                position: absolute;
                                right: -20px;
                                font-size: 14px;
                                top:0
                            }            
                        }                        
                    }
                }

            }

        }        
    }
</style>

