<template>
    <view class="assemble-list-page" :style="{paddingTop:lowerVersion?'0':paddingTop+'px'}">
        <Header :title="title" :returnBools="true"></Header>
        <List :className="'list-box'" :loading="loading" :finished="finished" :height="height" @load="getList">
            <view class="list">
                <view class="item" v-for="(item,index) in list" :key="index" @tap="goCourse(item)">
                        <image class="course-surface" :src="item.courseSurfacePlot" webp lazy-load></image>
                        <view class="info">
                            <view class="info_title">{{item.courseTitle}}</view>
                            <view class="info_moneys">
                                <view class="moneys_1">拼团价:{{item.assemblePrice||0}}币</view>
                                <view class="moneys_2">拼团</view>
                            </view>
                        </view>                    
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
            // targetId:'',
            type:'',
            timer:null,
            cur:'0',
            curList:[],
            firsterBool:true,//定时器第一次锁
            clearIntervalbool:true,
            lowerVersion:false,
            queryUrlType:false
        }
    },
    computed:{
        ...mapState(['audioData','timeArry'])
    },
    components:{Header,List,MiniAudio},
    onLoad(options){
        this.lowerVersion = app.globalData.lowerVersion;
        console.log('options',options);
        if(options.type){
            switch(Number(options.type)){
                case 1:
                    this.api = this.$server.getAssembleCourseLists;
                    this.title = options.name || '拼团';
                    this.tgId = options.tgId;
                    this.queryUrlType = false;
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
                currentPage :this.pageNo,
                pageSize:this.pageSize,
                type:1
            }
            if(!self.queryUrlType){
                console.log('this.api',this.api);
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
            }
        },
        goCourse(dataItem){
            let userInfo = wx.getStorageSync('userInfo')
            if(userInfo){
                if(dataItem.targetId){
                    uni.navigateTo({
                        url: `/pages/courseDetail/index?id=${dataItem.targetId}`
                    });
                }else{
                    uni.navigateTo({
                        url: `/pages/courseDetail/index?id=${dataItem.courseId}`
                    });
                }
            }else{
                if(dataItem.targetId){
                    uni.navigateTo({
                        url: `/pages/auth/index?id=${dataItem.targetId}`
                    });
                }else{
                    uni.navigateTo({
                        url: `/pages/auth/index?id=${dataItem.id}`
                    });
                }
            }
        }        
    }
}
</script>
<style lang="scss">
.assemble-list-page{
    background: #f4f4f4;
    .list{
        padding:40rpx 30rpx 0;
        box-sizing: border-box;
        .item{
            padding:20rpx 20rpx;
            background: #fff;
            margin-bottom: 26rpx;
            border-radius: 12rpx;
            display: flex;
            &:last-child{
                border-bottom:none;
            }
            .course-surface{
                width: 306rpx;
                height: 172rpx;
                border-radius: 12rpx 0 0 12rpx;                  
            }
            .info{
                flex: 1;
                overflow: hidden;
                margin-left: 20rpx;
                position: relative;
                background: #fff;
                .info_title{
                    font-size: 30rpx;
                    font-weight: 500;
                    display: -webkit-box;
                    -webkit-line-clamp:2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;                        
                };
                .info_moneys{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;   
                    position: absolute;
                    width: 100%;
                    bottom: 0;
                    .moneys_1{
                        font-size: 24rpx;
                        color: #666;
                    }   
                    .moneys_2{
                        width: 78rpx;
                        height: 40rpx;
                        text-align: center;
                        background: #C30D20;
                        border-radius: 40rpx;
                        color: #fff;
                        line-height: 40rpx;
                        font-size: 22rpx;
                    }                     
                }
            }
        }
    }
}
</style>