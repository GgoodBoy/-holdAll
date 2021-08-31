<template>
    <div class="player-page">
        <div class="player-container">
            <div class="player-top clearfix">
                <div class="course-base-info">
                    <p class="course-title"  @click="returnDetails">{{courseData.title}}</p>
                    <div class="period-info">
                        <i class="el-icon-arrow-right"></i>
                        <p class="sort">第{{sort}}节</p>
                        <p class="period-title">{{periodData.title}}</p>
                    </div>
                </div>
                <div class="course-other-info">
                    <div class="praise-num">
                        <i></i>
                        <p>{{courseData.courseUserLikeCount>10000?'1万+':courseData.courseUserLikeCount}}</p>
                    </div>
                    <div class="catalog" @click="periodListFlag=!periodListFlag">
                        <p>课程目录</p>
                        <i class="el-icon-arrow-up" :class="periodListFlag?'open':'close'"></i>
                    </div>
                </div>
            </div>
            <div class="player-main" @click="playEvent($event)">

                <div class="period-list-box" :class="periodListFlag?'open':'close'">
                    <div class="list">
                        <div class="line"></div>
                        <div class="item clearfix" v-for="(item,index) in periodList" :key="index" :class="{'active':item.id==periodId}" @click="playPeriod(item)">
                            <p class="sort">第{{item.sort}}节</p>
                            <el-tooltip class="title textEllipsis" effect="light" :content="item.title" placement="top-start" >
                                <p>{{item.title}}</p>
                            </el-tooltip>
                            <p v-if="userData.isVip>0||courseData.isBuy>0"></p>
                            <p class="is-try" v-else v-show="item.isTry>0">{{courseData.courseType==1?'试看':'试听'}}</p>
                        </div>
                    </div>
                </div>
                <div id="player-box" :style="{'width':periodListFlag?'920px!important':'100%'}">
                    <img :src="courseData.surfacePlot" class="surface" v-if="!resourceReady"/>
                    <i class="player-btn" :class="playerBtnState?'play':'pause'" v-if="resourceReady"></i>
                    <div id="player">
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            :title="dialogTitle"
            custom-class="player-dialog"
            :visible.sync="dialogVisible"
            width="590"
            :modal = "modal"
            center>
            <div class="content">
                <span>{{dialogContent}}</span>
            </div>
            <div class="dialog-btns-box">
                <div class="dialog-btns">
                    <el-button class="cancel" @click="closeDialog">{{cancelText}}</el-button>
                    <el-button type="primary" :style="{'width':cancelText=='试看其他课程'?'138px':'auto'}" class="confirm" @click="buyCourse">{{confirmText}}</el-button>
                </div>
            </div>
        </el-dialog>
        <transition name="el-fade-in">
            <div class="play-done-dialog show" v-if="normalPeriodFinish">
                <div class="box">
                    <p class="reload" @click="playerReload" ref="playerReloadDom"><i></i>重新播放</p>
                    <p class="next" @click="goNextPeriod" ref="goNextPeriodDom"><i></i>播放下一节</p>
                    <!-- <p class="zan" :class="thumbsUpPeriodFlag?'active':''" @click="praise"><i></i>支持一下</p> -->
                </div>
            </div>
        </transition>
    </div>
</template>
<script lang="ts">
import {Component,Vue,Watch} from 'vue-property-decorator'
import {mapState,mapActions} from 'vuex'
import { setTimeout } from 'timers';
@Component({
    computed:{
        ...mapState(['userData'])
    },
    beforeRouteLeave (to, from, next) {
        this.init = false;
        next()
    }
})
export default class Player extends Vue{
    isLogin = false
    init = false
    playAddress = ''//地址
    courseData = {}//课程信息
    periodData = {}//课时信息
    courseId = ''//课程ID
    periodId = ''//课时id
    targetId = ''//资源id
    resourceReady = false//播放器是否加载完成
    sort = 0//课程排序
    definitionType = 0//资源类型
    playerBtnState = false//播放按钮
    player = {}//播放器
    isGoing = false//是否继续播放（针对切换清晰度，继续自动播放）
    currentTime = 0 //当前播放进度
    periodListFlag = true //是否展开课时目录
    periodList = []//课时目录
    normalPeriodFinish = false //拥有课程，播放完毕弹窗
    dialogVisible = false //未拥有课程，播放完毕弹窗
    dialogTitle = '' //弹窗标题
    dialogContent = '' //弹窗内容
    cancelText = '' //取消按钮文案
    confirmText = '' //确定按钮文案
    trySeePeriodId = -1; //试看课时ID
    thumbsUpPeriodFlag = false //是否点赞
    replayFlag = false//重复播放
    modal = false
    fullScreenFlag = false
    addplayDoneDialogFlag = false
    studyBehaviorTimer = null
    studyDuration = 0
    @Watch("$route")
    onRouteChanged(val,old){
        if(!this.init) return;
        if(val.name=='index-course-player'){
            this.periodId = val.query.periodId;
            this.targetId = val.query.targetId;
            this.currentTime = 0;
            this.isGoing = true;
            let loadingInstance = this.$loading.service({
                target:document.getElementsByClassName('player-main')[0],
                background:'rgba(0,0,0,0.95)'
            });
            this.getPeriodInfo()
            this.getResoursePlayUrl()
            loadingInstance.close()
        }
    }
    head(){
        return {
            title:`${this.periodData.title||''} | 学国学网`
        }
    }
    created(){
        if(this.$route.query){
            this.courseId = this.$route.query.courseId
            this.periodId = this.$route.query.periodId
            this.targetId = this.$route.query.targetId
        }
    }
    mounted(){
        if(process.client){
            this.init = true;
            let user = this.$getCookie('xgx_user')?this.$getCookie('xgx_user'):null;
            if(user){
                this.isLogin = true;
            }
            let loadingInstance = this.$loading.service({
                target:document.getElementsByClassName('player-page')[0],
                background:'rgba(0,0,0,1)'
            });
            this.getCourseInfo();
            this.getPeriodInfo()
            this.getPeriodList();

            loadingInstance.close()
        }
    }
    returnDetails(){
        this.$router.go(-1)
    }
    /**
     * 获取课程信息
     */
    async getCourseInfo(){
        let query = {
            params:{}
        }
        let res = await this.$axios.$get(`${this.$server.getCourseInfo}/${this.courseId}`,query)
        if(res.status==200){
            this.courseData = res.content;
            this.definitionType = res.content.courseType;
            this.getResoursePlayUrl();
        }
    }
    /**
     * 获取课时详情
     */
    async getPeriodInfo(){
        let query = {
            params:{

            }
        }
        let res = await this.$axios.$get(`${this.$server.getPeriodInfo}/${this.periodId}`,query)
        if(res.status==200){
            this.periodData = res.content;
            this.thumbsUpPeriodFlag = res.content.thumbsUpPeriodFlag>0?true:false;
        }
    }
    /**
     * 获取课时列表
     */
    async getPeriodList(){
        let query = {
            params:{}
        }
        let res = await this.$axios.$get(`${this.$server.getPeriodList}/${this.courseId}`,query)
        if(res.status==200){
            this.periodList = res.content;
            let obj = res.content.find(item=>item.id == this.periodId)
            this.sort = obj.sort;
        }
    }
    /**
     * 获取播放地址
     */
    async getResoursePlayUrl(){
        let query = {
            params:{
                courseId:this.courseId,
                periodId:this.periodId,
                definitionType:this.definitionType
            }
        }
        let res = await this.$axios.$get(`${this.$server.getResourcesUrl}/${this.targetId}`,query)
        if(res.status==200){
            this.resourceReady = true;
            this.playAddress = res.content.playAddress;
            this.$nextTick(()=>{
                let dom = document.querySelector('#player');
                if(dom&&dom.innerHTML.length>0){
                    this.player.loadByUrl(this.playAddress,this.currentTime)
                }else{
                    this.createPlayer()
                }
            })
        }else{
            if(res.message=='尚未购买该课程'){
                if(this.userData&&this.userData.userId){
                    this.dialogVisible = true
                    this.dialogTitle = ''
                    this.dialogContent = '当前节是收费课程，需购买后观看'
                    this.cancelText = '试看其他课程'
                    this.confirmText = '立即购买'
                }else{
                    this.dialogVisible = true
                    this.dialogTitle = ''
                    this.dialogContent = '登录到学国学网'
                    this.cancelText = '试看其他课程'
                    this.confirmText = '立即登录'
                }
            }else{
                this.$message.error(res.message)
            }
        }
    }
    /**
     * 播放课时
     */
    playPeriod(obj){
        if(this.userData&&this.userData.userId){
            if(this.userData.isVip&&this.userData.isVip>0){
                this.sort = obj.sort;
                let path = `/course/player?courseId=${this.courseId}&periodId=${obj.id}&targetId=${obj.targetId}`
                this.$router.replace(path)
            }else{
                if(this.courseData.isBuy>0){
                    this.sort = obj.sort;
                    let path = `/course/player?courseId=${this.courseId}&periodId=${obj.id}&targetId=${obj.targetId}`
                    this.$router.replace(path)
                }else{
                    if(this.courseData.isFree>0){
                        this.sort = obj.sort;
                        let path = `/course/player?courseId=${this.courseId}&periodId=${obj.id}&targetId=${obj.targetId}`
                        this.$router.replace(path)
                    }else{
                        if(obj.isTry>0){
                            this.sort = obj.sort;
                            let path = `/course/player?courseId=${this.courseId}&periodId=${obj.id}&targetId=${obj.targetId}`
                            this.$router.replace(path)
                        }else{
                            this.dialogVisible = true
                            this.dialogTitle = ''
                            this.dialogContent = '当前节是收费课程，需购买后观看'
                            this.cancelText = '试看其他课程'
                            this.confirmText = '立即购买'
                        }
                    }
                }
            }
        }else{
            if(obj.isTry>0||this.courseData.isFree>0){
                let path = `/course/player?courseId=${this.courseId}&periodId=${obj.id}&targetId=${obj.targetId}`
                this.$router.replace(path)
            }else{
                this.dialogVisible = true
                this.dialogTitle = ''
                this.dialogContent = '登录到学国学网'
                this.cancelText = '试看其他课程'
                this.confirmText = '立即登录'
            }
        }
    }
    /**
     * 关闭dialog
     */
    closeDialog(){
        this.dialogVisible = false;
        this.$router.push('/course/courseList?id=0&sortType=1&pageNo=1&pageSize=12&freeType=2')
    }
    /**
     * 创建播放器
     */
    createPlayer(){
        let props = {
            "id": "player",
            "source": this.playAddress,
            "width": "100%",
            "height": "100%",
            "autoplay": false,
            "isLive": false,
            "cover": this.courseData.surfacePlot||"",
            "mediaType":this.definitionType==1?'video':'audio',
            "rePlay": false,
            "videoHeight": "",
            "playsinline": true,
            "preload": true,
            "autoPlayDelay": "",
            "autoPlayDelayDisplayText": "",
            "loadDataTimeout": "",
            "controlBarVisibility": "hover",
            "videoWidth": "",
            "useH5Prism": true,
        };
        this.player = new window.Aliplayer(props,(player)=>{
           this.addQualityDom()
           
           this.playerBtnState = true;
        });
        this.player.on('ready',(e)=>{
            this.player.play()
            this.player.on('play',(e)=>{
                this.normalPeriodFinish = false;
                this.dialogVisible = false;
                this.playerBtnState = true;
                let currentTime = this.player.getCurrentTime()
                this.saveLearningProgress(currentTime)
                if(this.periodId==this.trySeePeriodId){
                    this.dialogVisible = true;
                    this.player.pause()
                }
                setTimeout(()=>{
                    this.replayFlag = false;
                },3000)
            })
            this.player.on('pause',(e)=>{
                this.playerBtnState = false;
                let currentTime = this.player.getCurrentTime()
                this.saveLearningProgress(currentTime)
                if(this.isGoing){
                    this.player.play();
                    this.isGoing = false;
                }
                this.saveStudyBehavior()
            })
            this.player.on('canplay',(e)=>{
                // if(this.playerBtnState) return;
                this.playerBtnState = true;
            })
            this.player.on('playing',(e)=>{
                // if(this.playerBtnState) return;
                this.playerBtnState = true;
                if(this.isLogin){
                    clearInterval(this.studyBehaviorTimer);
                    this.studyBehaviorTimer = setInterval(()=>{
                        this.studyDuration++;
                    },1000)
                }
            })
            this.player.on('requestFullScreen',(e)=>{
                this.fullScreenFlag = true;
            })
            this.player.on('cancelFullScreen',(e)=>{
                this.fullScreenFlag = false
                let parentDom = document.querySelector("#player");
                let dom = parentDom.querySelector('.play-done-dialog')
                if(dom){
                    parentDom.removeChild(dom)
                    this.addplayDoneDialogFlag = false
                }      
            })
            this.player.on('ended',(e)=>{
                if(this.replayFlag){
                    this.replayFlag = false;
                    this.player.replay()
                    return;
                }
                if(this.userData&&this.userData.userId){
                    let currentTime = this.player.getCurrentTime()
                    this.saveLearningProgress(currentTime)
                    if(this.userData.isVip&&this.userData.isVip>0){
                       this.normalPeriodFinish = true;
                       if(this.fullScreenFlag){
                           this.addplayDoneDialog()
                       }
                    }else{
                        if(this.courseData.isFree>0){
                            this.normalPeriodFinish = true;
                            if(this.fullScreenFlag){
                                this.addplayDoneDialog()
                            }
                        }else{
                            if(this.courseData.isBuy>0){
                                this.normalPeriodFinish = true;
                                if(this.fullScreenFlag){
                                    this.addplayDoneDialog()
                                }
                            }
                            else{
                                this.dialogVisible = true
                                this.dialogTitle = '试看已结束'
                                this.dialogContent = '是否立即购买该课程'
                                this.cancelText = '我再想想'
                                this.confirmText = '立即购买'
                            }
                        }
                    }
                }else{
                    if(this.courseData.isFree>0){
                        this.normalPeriodFinish = true;
                        if(this.fullScreenFlag){
                            this.addplayDoneDialog()
                        }                      
                    }else{
                        this.trySeePeriodId = this.periodId;
                        this.dialogVisible = true
                        this.dialogTitle = '试看已结束'
                        this.dialogContent = '是否立即登录购买该课程'
                        this.cancelText = '我再想想'
                        this.confirmText = '立即登录'
                    }
                }
            })
        })
    }
    addplayDoneDialog(){
        let parentDom = document.querySelector("#player");
        if(this.addplayDoneDialogFlag) return false;
        let html = ` <div class="box">
                        <p class="reload"><i></i>重新播放</p>
                        <p class="next"><i></i>播放下一节</p>
                    </div>`
        let div = document.createElement('div');
        div.innerHTML = html;    
        div.className = 'play-done-dialog'  
        this.addplayDoneDialogFlag = true      
        setTimeout(()=>{
            parentDom.appendChild(div)
        },1)
        setTimeout(()=>{
            parentDom.querySelector('.reload').addEventListener('click',()=>{
               this.addplayDoneDialogFlag = false
               this.$refs.playerReloadDom.click()
               parentDom.removeChild(div)
            })
            parentDom.querySelector('.next').addEventListener('click',()=>{
                this.addplayDoneDialogFlag = false
                this.$refs.goNextPeriodDom.click()
                parentDom.removeChild(div)
            })
        },300)            
    }
    /**
     * 自定义dom,添加到播放器UI下
     */
    addQualityDom(){
        let parentDom = document.querySelector('.prism-controlbar');
        let html = '';
        let sourceFormat=['流畅','标清','高清']
        let ulChild = '',speedUlChild = ''
        for(let i in sourceFormat){
            ulChild+=`<li class="definition-item" data-quality=${i}>${sourceFormat[i]}</li>`
        }
        let speedArr = ['2x','1.5x','1.25x','1x']
        for(let i in speedArr){
            speedUlChild+=`<li class="speed-item">${speedArr[i]}</li>`
        }
        html+=`<div class="speed-box"><p class="speed-cur">正常</p><ul class="speed-list hidden">${speedUlChild}</ul></div><div class="definition"><p class="definition-cur">流畅</p><ul class="definition-list hidden">${ulChild}</ul></div>`
        let div = document.createElement('div');
        div.innerHTML = html;

        setTimeout(()=>{
            parentDom.appendChild(div)
        },1)

        if(this.definitionType==2){
            let img = document.createElement('img')
            img.src = this.courseData.surfacePlot
            img.className = 'audio-surface'
            let parent = document.querySelector("#player")
            setTimeout(()=>{
                parent.appendChild(img)
            },1)
        }
    }
    /**
     * 切换播放
     */
    playEvent(e){
        if(e.target.className.includes('prism-cover')||e.target.className.includes('player-btn')||e.target.nodeName.toLocaleLowerCase()=='video'){
            // this.periodListFlag = false
            if(!this.playerBtnState){
                this.playerBtnState = true;
                this.player.play()
                return;
            }else{
                this.playerBtnState = false;
                this.player.pause()
                return;
            }
        }
        let speedListDom = document.getElementsByClassName('speed-list')[0]
        let definitionListDom = document.getElementsByClassName('definition-list')[0]
        //倍速框显示隐藏
        if(e.target.className=='speed-cur'){
            definitionListDom.classList.add('hidden');
            if(speedListDom.className.includes('hidden')){
                speedListDom.classList.remove('hidden');
            }else{
                speedListDom.classList.add('hidden');
            }
        }
        //清晰度框显示隐藏
        if(e.target.className=='definition-cur'){
            speedListDom.classList.add('hidden');
            if(definitionListDom.className.includes('hidden')){
                definitionListDom.classList.remove('hidden');
            }else{
                definitionListDom.classList.add('hidden');
            }
        }
        //切换倍速
        if(e.target.className.includes('speed-item')){
            speedListDom.classList.add('hidden');
            let dom = document.getElementsByClassName('speed-cur')[0];
            if((e.target.innerText==dom.innerText)||(e.target.innerText=='1x'&&dom.innerText=='正常')){
                return;
            }
            dom.innerText = e.target.innerText=='1x'?'正常':e.target.innerText;
            let speed = Number(e.target.innerText.split('x')[0]);
            this.player.setSpeed(speed)
        }
        if(e.target.className.includes('definition-item')){
            definitionListDom.classList.add('hidden');
            let dom = document.getElementsByClassName('definition-cur')[0];
            if(e.target.innerText==dom.innerText) return;
            dom.innerText = e.target.innerText
            if(e.target.innerText=='流畅'){
                this.definitionType = 1;
            }else if(e.target.innerText=='标清'){
                this.definitionType = 2;
            }else if(e.target.innerText=='高清'){
                this.definitionType = 3;
            }
            this.isGoing = true;
            this.currentTime = this.player.getCurrentTime()
            this.$nextTick(()=>{
                let loadingInstance = this.$loading.service({
                    target:document.getElementsByClassName('player-main')[0],
                    background:'rgba(0,0,0,1)'
                });
                this.getResoursePlayUrl()
                loadingInstance.close()
            })
        }
    }
    /**
     * 去购买课程
     */
    buyCourse(){
        this.closeDialog()
        if(this.userData&&this.userData.userId){
            if(this.userData.cellphone){
                this.$router.push({
                    path:`/course/order`,
                    query:{
                       id:this.courseData.id
                    }
                })
            }else{
                // let url = this.$route.fullPath
                let url = `/course/order?id=${this.courseData.id}`
                sessionStorage.setItem('redirectUrl',url)
                this.$router.push({
                    path:'/auth/bindPhone'
                })
            }
        }else{
            let url = this.$route.fullPath
            //  let url = `/course/order?id=${this.courseData.id}`
            sessionStorage.setItem('redirectUrl',url)
            this.$router.push({
                path:'/auth/login'
            })
        }
    }
    /**
     *  重播
     */
    playerReload(){
        this.currentTime = 0;
        this.normalPeriodFinish = false
        this.player.seek(0)
        setTimeout(()=>{
            this.player.play()
        },500)
        // this.player.replay();
        this.replayFlag = true;
    }
    /**
     *  下一节
     */
    goNextPeriod(){
        let index = this.periodList.findIndex(item=>item.id==this.periodId);
        if(index==this.periodList.length-1){
            if(this.periodList.length==1){
                this.playerReload()
            }else{
                this.periodId = this.periodList[0].id;
                this.targetId = this.periodList[0].targetId;
                this.sort = this.periodList[0].sort
            }
        }else{
            this.periodId = this.periodList[index+1].id;
            this.targetId = this.periodList[index+1].targetId;
            this.sort = this.periodList[index+1].sort;
        }
        this.$nextTick(()=>{
            let loadingInstance = this.$loading.service({
                target:document.getElementsByClassName('player-page')[0],
                background:'rgba(0,0,0,1)'
            });
            this.normalPeriodFinish = false
            let path = `/course/player?courseId=${this.courseId}&periodId=${this.periodId}&targetId=${this.targetId}`
            this.$router.replace(path)
        })
    }
    /**
     * 点赞
     */
    praise(){
        if(this.thumbsUpPeriodFlag){
            this.$message('您已点赞，请勿重复点赞')
        }else{
            this.thumbsUpPeriodFlag = true;
            let query = {
                type:1,
                courseId:this.courseId,
                periodId:this.periodId
            }
            this.$axios.$post(this.$server.thumbsUp.query);
            this.courseData.courseUserLikeCount++;
        }
        this.normalPeriodFinish = false
    }
    /**
     * 保存学习进度
     */
    saveLearningProgress(learnRate){
        if(!this.isLogin)return false;
        let query = {
            periodId:this.periodId,
            courseId:this.courseId,
            learnRate:Math.ceil(learnRate)
        }
        this.$axios.$post(this.$server.saveLearningProgress,query)
    }
    /**
     * 保存用户学习路径
     */
    saveStudyBehavior(){
        if (this.isLogin) {
            clearInterval(this.studyBehaviorTimer);
            const query = {
                courseId:this.courseId,
                type:3,
                studyDuration:this.studyDuration,
            } 
            this.studyDuration = 0;
            this.$axios.$post(this.$server.saveStudyBehavior,query).then(res=>{
                if(res.status==200){
                    
                }
            })     
        }           
    }
    beforeDestroy(){
        let currentTime = this.player.getCurrentTime()
        this.saveLearningProgress(currentTime)
    }
}
</script>
<style lang="scss" scoped>
    .player-page{
        background: #282828;
        height: 900px;
        padding-bottom:30px;
        position: relative;
        margin-top:-100px;
        padding-top:100px;
        .player-container{
            // position: absolute;
            // top:50%;
            // left: 50%;
            // transform: translate(-50%,-50%);
            width: 1200px;
            margin:0 auto;
            // height: 810px;
            .player-top{
                height: 80px;
                padding: 30px 30px 30px 0;
                color:#fff;
                .course-base-info{
                    float: left;
                    font-size: 0;
                    .course-title,.period-info{
                        display: inline-block;
                        vertical-align: middle;
                        line-height: 20px;
                    }
                    .course-title{
                        cursor: pointer;
                    }
                    .period-info{
                        font-size: 0;
                    }
                    i{
                        margin:0 5px;
                    }
                    i,p{
                        color:#fff;
                        font-size: 18px;
                        display: inline-block;
                        vertical-align: middle;
                        line-height: 20px;
                    }
                    .sort{
                        margin:0 20px 0 0;
                    }
                }
                .course-other-info{
                    float: right;
                    font-size: 0;
                    line-height: 20px;
                    .praise-num{
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 50px;
                        font-size: 0;
                        display: none;
                        i,p{
                            display: inline-block;
                            vertical-align: top;
                            font-size: 18px;
                        }
                        i{
                            margin-right: 9px;
                            width: 18px;
                            height: 18px;
                            background: url('../../../assets/images/praise_icon.png')no-repeat 50% 50% / cover;
                        }
                    }
                    .catalog{
                        display: inline-block;
                        vertical-align: middle;
                        cursor: pointer;
                        i,p{
                            color:#fff;
                            font-size: 18px;
                            display: inline-block;
                            vertical-align: middle;
                            line-height: 20px;
                        }
                        i{
                            transition: transform 0.3s;
                            transform-origin: center;
                            &.close{
                                transform: rotate(180deg);
                                margin-top:4px;
                            }
                        }
                    }
                }
            }
            .player-main{
                height:675px;
                background: #fff;
                position: relative;
                overflow: hidden;
                background: #000;
                #player-box{
                    height: 100%;
                    position: absolute;
                    top:0;
                    left: 0;
                    transition: width 0.3s ease-in;
                    z-index: 3;
                }
                .surface{
                    width:100%;
                    height: 100%;
                }
                .period-list-box{
                    position: absolute;
                    width: 280px;
                    height: 100%;
                    right: 0;
                    top:0;
                    background: #222222;
                    z-index: 2;
                    padding: 0 14px;
                    // transition: all 0.3s ease-in;
                    overflow: auto;
                    &.close{
                        // visibility: hidden;
                    }
                    .list{
                        position: relative;
                        padding: 13px 0;
                        .line{
                            background: #666666;
                            width: 2px;
                            position: absolute;
                            left: 0;
                            top:10px;
                            height: 98%;
                            min-height: 650px;
                        }
                        .item{
                            padding:12px 0;
                            font-size: 0;
                            cursor: pointer;
                            position: relative;
                            &::before{
                                content:'';
                                width: 10px;
                                height: 10px;
                                background: #666666;
                                border-radius: 50%;
                                position: absolute;
                                top:14px;
                                left: -4px;
                                display: block;
                            }
                            &.active{
                                color:#C30D23!important;
                                .sort,.title,.is-try{
                                    color:#C30D23!important;
                                }
                                &::before{
                                    background: #C30D23!important;
                                }
                            }
                            .sort,.title,.is-try{
                                float: left;
                                color:#CCCCCC;
                                line-height: 14px;
                                height: 14px;
                                font-size: 14px;
                            }
                            .sort{
                                margin:0 10px 0 14px;
                                // width: 50px;
                                text-align: left;
                            }
                            .title{
                                width:130px;
                                margin-right: 10px;
                            }
                            .is-try{
                                color:#C30D23;
                            }
                        }
                    }

                }
            }
            .player-btn{
                width: 72px;
                height: 72px;
                position: absolute;
                top:50%;
                left: 50%;
                margin:-36px 0 0 -36px;
                background: url('../../../assets/images/play_icon.png')no-repeat 50% 50%/cover;
                z-index: 9;
                &.play{
                    transform: scale(2);
                    opacity: 0;
                    visibility: hidden;
                    transition: visibility 1ms ease 0.3s,transform 0.3s ,opacity 0.3s;
                }
                &.pause{
                    transform: scale(1);
                    opacity: 1;
                    visibility: visible;
                    transition: visibility 1ms,transform 0.3s ,opacity 0.3s;
                }
            }
        }
        .player-dialog{
            .content{
                text-align: center;
            }
            .dialog-btns-box{
                margin-top:36px;
                text-align: center;
                .dialog-btns{
                    display: inline-block;
                    .cancel{
                        margin-right: 69px;
                        border-color: #C30D23;
                        color:#C30D23;
                    }
                }
            }
        }
        // .play-done-dialog{
        //     position: fixed;
        //     z-index: 99;
        //     background: rgba(0,0,0,0.7);
        //     width: 100%;
        //     height:100%;
        //     left: 0;
        //     top:0;
        //     .box{
        //         position: absolute;
        //         top:50%;
        //         left: 50%;
        //         background:rgba(255,255,255,1);
        //         border-radius:6px;
        //         padding: 59px;
        //         font-size: 0;
        //         transform: translate(-50%,-50%);
        //         p{
        //             display: inline-block;
        //             font-size: 18px;
        //             color:#333333;
        //             margin-right: 45px;
        //             cursor: pointer;
        //             &:hover{
        //                 opacity: 0.85;
        //             }
        //             &:last-child{
        //                 margin:0;
        //             }
        //             i{
        //                 display: inline-block;
        //                 vertical-align: text-top;
        //                 width: 24px;
        //                 height: 24px;
        //                 margin-right: 8px;
        //             }
        //             &.reload i{background: url('../../../assets/images/reload.png')no-repeat 50% 50% /cover;}
        //             &.next i{background: url('../../../assets/images/period_next.png')no-repeat 50% 50% /cover;}
        //             &.zan{
        //                 i{background: url('../../../assets/images/period_zan.png')no-repeat 50% 50% /cover;}
        //                 &.active{
        //                     i{
        //                         background: url('../../../assets/images/period_zan_active.png')no-repeat 50% 50% / cover;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
    }
</style>
<style lang="scss">
.player-dialog{
    width: 590px;
    height: 230px;
    margin:0!important;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
}
.prism-player .prism-big-play-btn,.prism-player .prism-animation{
    display: none!important;
}
.prism-player .prism-controlbar{
    height: 60px!important;
    background: #333;
    bottom: -1px!important;
    // display: block!important;
}
.prism-player .prism-fullscreen-btn.fullscreen{
    background: url('../../../assets/images/cancel-full-screen.png')no-repeat 50% 50% / cover!important;
}
.prism-controlbar-bg{
    height: 60px!important;
}
.prism-player .prism-progress{
    bottom:60px!important;
}
.prism-player .prism-liveshift-progress .prism-progress-cursor, .prism-player .prism-progress .prism-progress-cursor{
    top: -2px!important;
    display: block!important;
    width: 10px;
    height: 10px;
    background: #fff;
}
.prism-player .prism-liveshift-progress .prism-progress-cursor, .prism-player .prism-progress-hover .prism-progress-cursor{
    width: 20px!important;
    height: 20px!important;
    top:-6px!important;
}
.prism-player .prism-liveshift-progress .prism-progress-cursor img, .prism-player .prism-progress .prism-progress-cursor img{
    display: none!important;
}
.prism-player .prism-loading{
    position: absolute;
    top:50%;
    left: 50%;
    width: 72px;
    height: 72px;
    transform: translate(-50%,-50%);
    margin:0!important;
}
.prism-player .prism-loading .circle{
    width: 72px;
    height: 72px;
}

.prism-player .prism-liveshift-progress .prism-progress-played, .prism-player .prism-progress .prism-progress-played{
    background: #C30D23!important;
}
.prism-cc-btn,.prism-setting-btn,.prism-player .prism-volume .volume-icon .short-horizontal,.prism-player .prism-volume .volume-icon .long-horizontal{
    display: none!important;
}
.speed-box,.definition{
    position: absolute;
    width: 60px;
    height: 24px;
    line-height: 24px;
    color:#fff;
    font-size: 14px;
    top:18px;
    background: #666666;
    border-radius: 20px;
    text-align: center;
    cursor: pointer;
}
.speed-box{
    right: 206px;
}
.speed-box p,.definition p{font-size: 14px}
.speed-list,.definition-list{
    position: absolute;
    bottom:50px;
    width: 100%;
    left: 0;
}
.hidden{
    display: none;
}
.speed-list li,.definition-list li{
    font-size: 14px;
    height: 28px;
    line-height: 28px;
    color:#fff;
    background: rgba(0,0,0,0.55);
    margin:2px 0;
}
.definition{
    right: 122px;
}
.prism-player .prism-volume .volume-icon{
    background: url('../../../assets/images/voice_icon.png')no-repeat 50% 50% / cover;
    width: 18px;
    height: 18px;
}
.prism-player .prism-volume{
    position: absolute;
    right: 80px;
    top:21px;
    margin:0!important;
}
.prism-player .prism-fullscreen-btn{
    background: url('../../../assets/images/full_screen_icon.png')no-repeat 50% 50%;
    height: 18px;
    width: 18px;
    margin:0!important;
    position: absolute;
    top:21px;
    right: 43px;
}
.prism-player .prism-loading .circle{
    border-color:rgba(195,13,35,.2) rgba(195,13,35,.5) rgba(195,13,35,.7) rgba(195,13,35,.1)
}
.prism-player video{
    top:49.9%!important;
}
.prism-player .prism-volume-control{
    right: 64px!important;
    left: auto!important;
    background: rgba(0,0,0,0.55)!important;
    z-index: 2;
    /* width: 40px!important;
    margin:10px 10px 0 0!important; */
}
.prism-player .prism-tooltip{
    display: none!important;
}
.prism-player .prism-volume-control .volume-range{
    margin-left: -2px;
}
.prism-player .prism-volume-control .volume-value,.prism-player .prism-volume-control .volume-cursor:hover{
    background: #C30D23;
}
.audio-surface{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    max-width: 875px;
}
.play-done-dialog{
    position: fixed;
    z-index: 99;
    background: rgba(0,0,0,0.7);
    width: 100%;
    height:100%;
    left: 0;
    top:0;
    .box{
        position: absolute;
        top:50%;
        left: 50%;
        background:rgba(255,255,255,1);
        border-radius:6px;
        padding: 59px;
        font-size: 0;
        transform: translate(-50%,-50%);
        p{
            display: inline-block;
            font-size: 18px;
            color:#333333;
            margin-right: 45px;
            cursor: pointer;
            &:hover{
                opacity: 0.85;
            }
            &:last-child{
                margin:0;
            }
            i{
                display: inline-block;
                vertical-align: text-top;
                width: 24px;
                height: 24px;
                margin-right: 8px;
            }
            &.reload i{background: url('../../../assets/images/reload.png')no-repeat 50% 50% /cover;}
            &.next i{background: url('../../../assets/images/period_next.png')no-repeat 50% 50% /cover;}
            &.zan{
                i{background: url('../../../assets/images/period_zan.png')no-repeat 50% 50% /cover;}
                &.active{
                    i{
                        background: url('../../../assets/images/period_zan_active.png')no-repeat 50% 50% / cover;
                    }
                }
            }
        }
    }
}
</style>
