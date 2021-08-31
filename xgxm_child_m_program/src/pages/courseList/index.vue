<template>
    <view class="course-list-page" :style="{paddingTop:lowerVersion?'0':paddingTop+'px'}">
        <Header :title="title" :returnBools="true"></Header>
        <List :className="'list-box'" :loading="loading" :finished="finished" :height="height" @load="getList">
            <view class="list">
                <view class="item" v-for="(item,index) in list" :key="index">
                    <CourseItem1 :courseData="item" :type="limitType"/>
                </view>
            </view>
        </List>
        <MiniAudio v-if="audioData.show" :cur="cur"></MiniAudio>
    </view>   
</template>
<script>
import {mapState,mapActions} from 'vuex'
import Header from '../../wxcomponents/Header'
import List from '../../wxcomponents/MyList'
import CourseItem1 from '../../wxcomponents/CourseItem1'
import MiniAudio from '../../wxcomponents/miniAudio.vue'
const app = getApp()
export default {
    data(){
        return{
            paddingTop:0,
            api:'',
            title:'',
            loading:false,
            finished:false,
            pageNo:1,
            pageSize:10,
            list:[],
            tgId:'',
            height:'auto',
            targetId:'',
            type:'',
            timer:null,
            cur:'0',
            curList:[],
            firsterBool:true,//定时器第一次锁
            clearIntervalbool:true,
            limitType:'',
            lowerVersion:false,
            queryUrlType:false
        }
    },
    computed:{
        ...mapState(['audioData','timeArry'])
    },
    components:{Header,List,CourseItem1,MiniAudio},
    onLoad(options){
        this.lowerVersion = app.globalData.lowerVersion;
        if(options.type){
            switch(true){
                case options.type==1:
                    this.api = this.$server.getWechatList;
                    this.title = options.name || '限时购';
                    this.limitType = 'limit';
                    this.tgId = options.tgId;
                    this.queryUrlType = false;
                    break;
                case options.type==2:
                    this.api = this.$server.getWechatFreeList;
                    this.title = options.name || '免费专区';
                    this.queryUrlType = true;
                    break;
                case options.type==3:
                    this.api = this.$server.getWechatHotList;
                    this.title = options.name || '热门课程';
                    this.queryUrlType = true;
                    break;   
                case options.type==4||options.type==5:
                    this.api = this.$server.getWechatListByClassifyIdLabelId;
                    this.title = options.name?options.name:options.type==4?'分类':'标签';
                    this.targetId = options.targetId;
                    this.type = options.type==4?1:2;
                    this.queryUrlType = true;
                    break;       
            }
            wx.setNavigationBarTitle({
                title:this.title
            })
        }
    },
    created(){
        this.paddingTop = app.globalData.statusBarHeight+68;
        wx.getSystemInfo({
            success:(res)=>{
                this.height = res.windowHeight - this.paddingTop;
            }
        })
    },
    onShow(){
        this.curList = this.$store.state.timeArry;
        clearInterval(this.timer);
        this.clearIntervalbool=true;
        const backgroundAudioManager = wx.getBackgroundAudioManager();
        if(this.audioData.show){
            this.timer = setInterval(() => {
                if(this.clearIntervalbool){
                    if(this.firsterBool){
                        this.cur = Math.floor(backgroundAudioManager.currentTime);
                        var firster=this.curList[this.curList.length-1];
                        if(this.cur>firster){
                            var nums = this.cur-firster;
                            if(nums>0){
                                for (var i = 0; i < nums; i++) { 
                                    this.curList.push(firster+i);
                                }
                            }
                        }
                        this.firsterBool = false;
                    }else{
                        this.cur = Math.floor(backgroundAudioManager.currentTime);
                        if(this.cur!=this.curList[this.curList.length-1]){
                            this.curList.push(this.cur);
                        }
                    }
                }else{
                    clearInterval(this.timer);
                }                  
            }, 1000);
        }
    },
    onHide(){
        clearInterval(this.timer);
        this.clearIntervalbool = false;
    },
    onUnload(){
        clearInterval(this.timer);
        this.clearIntervalbool = false;
    },     
    mounted(){
        this.getList()
    },
    methods:{
        getList(){
            var self = this;
            this.loading = true;
            let query = {
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                type:2
            }
            if(this.targetId!=''){
                query.mtype = 1;
                query.type = this.type;
                query.targetId = this.targetId;
            }
            if(!self.queryUrlType){
                query['discountsActivityId'] =this.tgId;
                this.$http.post(this.api,query,{urlType:self.queryUrlType}).then(res=>{
                    this.loading = false;
                    if(res.data.status==200){
                        this.list = [...this.list,...res.data.content.list];
                        this.list.forEach(item=>{
                            item.imgUrl = item.surfacePlot;
                        })
                        this.pageNo++;
                        this.finished = res.data.content.isLastPage;
                    }else{ 
                        uni.navigateBack({
                            delta: 1,
                            success(){
                                uni.showToast({
                                    title: res.data.message,
                                    icon: 'none',
                                    duration: 2000
                                })                                 
                            }
                        }); 
                    }
                })               
            }else{
                this.$http.post(this.api,query,{urlType:self.queryUrlType}).then(res=>{
                    this.loading = false;
                    if(res.data.status==200){
                        this.list = [...this.list,...res.data.content.list];
                        this.list.forEach(item=>{
                            item.imgUrl = item.surfacePlot;
                        })
                        this.pageNo++;
                        this.finished = res.data.content.isLastPage;
                    }
                })
            }




        }
    }
}
</script>
<style lang="scss">
    .list{
        padding:0 30rpx;
        box-sizing: border-box;
        .item{
            padding: 30rpx 0;
            border-bottom: 1px solid #dfdfdf;
        }
    }
</style>