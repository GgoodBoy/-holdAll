<template>
    <view class="search-page" :style="{paddingTop:lowerVersion?'94px':paddingTop+'px'}">
        <Header :title="'搜索'" :returnBools="true" :searchUserIconType='1' :padTop="paddingTop"></Header>
        <view class="content">
            <view class="search-area">
                <input class="input" type="text" focus :placeholder="keywords||'请输入要搜索的内容'" v-model="keywords" confirm-type="search" @confirm="searchEvent" @input="inputEvent"/>
                <icon class="icon" type="search" @tap="tapSearch"/>
            </view>
            <view class="result" v-if="searchFlag">
                <view class="result-list" :class="loading2?'loading':''">
                    <view class="tips">以下是关于“ {{tempKeywords}} ”的搜索结果</view>
                    <List :loading="loading2" :text="text" :textFlag="true" :finished="finished" :height="height" @load="getResult">
                        <view class="result-item" v-for="(item,index) in resultList" :key="index">
                            <!-- <view class="img" :style="{background:`url(${item.surfacePlot}) 50% 50%/cover`}" @click="goCourse(item)"></view> -->
                            <image class="img" :src="item.surfacePlot" webp lazy-load @click="goCourse(item)"></image>
                            <view class="title" @click="goCourse(item)">{{item.title}}</view>
                            <view class="period-list" v-if="item.periodsList.length>0" :style="{height:item.height}" @click="goCourse(item)">
                                <view class="period-item" v-for="(option,i) in item.periodsList" :key="i">
                                    <view class="icon"></view>
                                    <view class="num" v-show="option.sort">第{{option.sort}}节</view>
                                    <view class="name textEllipsis">{{option.title}}</view>
                                </view>
                            </view>
                            <view class="more" :class="item.height=='auto'?'show':''" v-if="item.periodsList.length>1" @click.stop="getMore(item,index)">
                                <text class="more-text">{{item.height=='auto'?'收起':'查看更多'}}</text>
                                <image class="more-arrow" :src="arrow"></image>
                            </view>
                        </view>
                        <view class="empty" v-if="resultList.length!=0&&finished">
                            已经全部加载完毕~
                        </view>                         
                    </List>
                    <view class="empty" v-if="resultList.length==0&&finished">
                        暂无查询结果，换个关键词试试
                    </view>
                </view>
            </view>
            <block v-else>
                <view class="history" v-if="historyList.length>0">
                    <view class="title">
                        <text class="name">搜索历史</text>
                        <view class="del" @tap="empty"></view>
                    </view>
                    <view class="list">
                        <view class="item" v-for="(item,index) in historyList" :key="index" @tap="search(item.name)">{{item.name}}</view>
                    </view>
                </view>
                <view class="hot-words">
                    <view class="title">大家都在搜</view>
                    <view class="list">
                        <Loading v-if="loading1"/>
                        <text class="item" v-for="(item,index) in hotWords" :key="index" @tap="search(item.name)">{{item.name}}</text>
                    </view>
                </view>
            </block>
        </view>
        <MiniAudio v-if="audioData.show" :cur="cur" :curList="curList"></MiniAudio>
    </view>    
</template>
<script>
import {mapState,mapActions} from 'vuex'
import arrow from '../../static/arrow.png'
import Header from '../../wxcomponents/Header'
import Loading from '../../wxcomponents/Loading'
import List from '../../wxcomponents/MyList'
import MiniAudio from '../../wxcomponents/miniAudio.vue'
const app = getApp()
export default {
    data(){
        return{
            arrow:arrow,
            height:'auto',
            paddingTop:0,
            loading1:false,
            hotWords:[],
            historyList:[],
            searchFlag:false,
            keywords:'',
            tempKeywords:'',
            loading2:false,
            finished:false,
            pageSize:10,
            pageNo:1,
            resultList:[],
            text:'',
            timer:null,
            cur:'0',
            curList:[],
            firsterBool:true,//定时器第一次锁
            clearIntervalbool:true,
            lowerVersion:false
        }
    },
    onLoad(options){
        this.getWechatDefaultHotWords();
        this.getHotWordList()
        this.lowerVersion = app.globalData.lowerVersion;
        if(options.teacherName){
            this.keywords = options.teacherName;
            this.search(this.keywords);           
        }    
    },
    onShow(){
        if(this.lowerVersion){
            var authReturn  = wx.getStorageSync('authFirst');
            if(authReturn){
                wx.removeStorageSync('authFirst');
            }
        }
        this.curList = this.$store.state.timeArry;;
        this.clearIntervalbool=true;
        clearInterval(this.timer);
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
    onShareAppMessage(res){
        return {
            title: '学国学网小程序',
            path: '/pages/index/index',
            imageUrl:'../../static/courseDetail/share.png'
        }
    },    
    created(){
        this.paddingTop = app.globalData.statusBarHeight+68;
        let historyList = wx.getStorageSync('history')?JSON.parse(wx.getStorageSync('history')):[];
        this.historyList = historyList;
    },
    computed:{
        ...mapState(['audioData','timeArry'])
    },
    components:{
        Header,Loading,List,MiniAudio
    },
    methods:{
        /**
         * 获取热词
         */
        getHotWordList(){
            let query = {}
            this.loading1 = true;
            this.$http.post(this.$server.getWechatHotWordList,query).then(res=>{
                this.loading1 = false;
                if(res.data.status==200){
                    this.hotWords = res.data.content
                }
            }).catch(()=>{
                this.loading1 = false;
            })
        },
        /**
         * 获取默认词
         */
        getWechatDefaultHotWords(){
            let query = {
                mtype:4
            }
            this.$http.post(this.$server.getWechatDefaultHotWords,query).then(res=>{
                if(res.data.status==200){
                    if(!this.keywords){
                        this.keywords = res.data.content
                    };
                }
            })
        },
        inputEvent(e){
            let {value} = e.detail;
            if(value==''){
                this.searchFlag = false;
            }
        },
        /**
         * 搜索
         */
        searchEvent(e){
            let {value} = e.detail;
            if(value=='') return;
            this.search(value)
        },
        search(value){
            this.keywords = value;
            this.tempKeywords = value;
            let historyList = [...this.historyList];
			let temp = {
				name:value
			}
			if(historyList.length>0){
				let index = historyList.findIndex(item=>item.name==value);
				if(index>=0){
					historyList.splice(index,1);
                }
                if(historyList.length==10){
                    historyList.splice(9,1);
                }
                historyList.unshift(temp)
			}else{
				historyList.push(temp)
            }
            this.historyList = historyList;
            wx.setStorageSync('history',JSON.stringify(historyList))
            this.resultList = [];
            this.text = '';
            this.pageNo = 1;
            this.finished = false;
            this.getResult()
        },
        tapSearch(){
            if(this.keywords.length>0){
                this.search(this.keywords)
            }
        },
        getResult(){
            var self = this;
            if(this.keywords.length==0||this.loading2==true) return;
            this.loading2 = true;
            this.searchFlag = true;
            let query = {
                searchContent:this.keywords,
                pageSize:this.pageSize,
                currentPage:this.pageNo,
                type:2
            }
            this.$http.post(this.$server.getSearchChildCourseList,query,{urlType:true}).then(res=>{
                this.loading2 = false;
                if(res.data.status==200){
                    this.resultList = [...this.resultList,...res.data.content.list];
                    this.pageNo++;
                    this.finished = res.data.content.isLastPage;
                    if(this.finished){
                        this.text = '没有更多数据了~';
                    }
                    this.resultList.forEach(item=>{
                        item.height = '150rpx';
                    })
                    this.$nextTick(()=>{
                        const query = wx.createSelectorQuery()
                        query.select('.result-list').boundingClientRect(res=>{
                            if(res){
                                this.height = res.height-20;
                            }
                        }).exec()
                    })
                }else{
                    this.resultList = [];
                    this.finished = true;
                }
            }).catch(()=>{
                this.loading2 = false;
            })
        },
        empty(){
			wx.showModal({
                content: '确定清空所有历史数据吗',
                success:(res)=>{
                    if (res.confirm) {
                        this.historyList = [ ]
				        wx.setStorageSync('history',JSON.stringify(this.historyList))
                    } else if (res.cancel) {
                    
                    }
                }
            })
        },
        getMore(obj,index){
            let temp = [...this.resultList]
            if(temp[index].height!='auto'){
                temp[index].height = 'auto';
            }else{
                temp[index].height = '150rpx'
            }
            this.resultList = temp
        },
        goCourse(obj){
            let userInfo = wx.getStorageSync('userInfo')
            if(userInfo){
                uni.navigateTo({
                    url: `/pages/courseDetail/index?id=${obj.id}`
                });
            }else{
                uni.navigateTo({
                    url: `/pages/auth/index?id=${obj.id}`
                });
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .search-page{
        background:#f5f5f5;
        height: 100vh;
        box-sizing: border-box;
        .result{
            height: calc(100% - 66rpx);
            .tips{
                color:#333333;
                font-size: 28rpx;
                margin: 30rpx 0;
                height: 30rpx;
            }
            .result-list{
                height: calc(100% - 60rpx);
                &.loading{
                }
                .empty{
                    font-size: 28rpx;
                    color:#999;
                    margin:100rpx 0;
                    text-align: center;                    
                }
                .result-item{
                    padding: 30rpx;
                    background: #fff;
                    margin-bottom: 30rpx;
                    border-radius: 10rpx;
                    .img{
                        width: 100%;
                        height: 350rpx;
                        border-radius: 10rpx;
                    }
                    .title{
                        font-size: 30rpx;
                        color:#333333;
                        margin:20rpx 0 0 0;
                    }
                    .period-list{
                        margin-top:20rpx;
                        overflow: hidden;
                        .period-item{
                            display: flex;
                            align-items: center;
                            padding: 20rpx 10rpx;
                            background: #F2F2F2;
                            border-radius: 10rpx;
                            box-sizing: border-box;
                            height: 70rpx;
                            margin-bottom: 20rpx;
                            &:last-child{
                                margin-bottom: 0;
                            }
                            .icon{
                                border:1px solid #999;
                                height: 32rpx;
                                width: 32rpx;
                                border-radius: 50%;
                                position: relative;
                                &::after{
                                    content:'';
                                    position: absolute;
                                    width: 0;
                                    height: 0;
                                    border-top:10rpx solid transparent;
                                    border-bottom:10rpx solid transparent;
                                    border-left:12rpx solid #999;
                                    top:50%;
                                    left: 50%;
                                    transform: translate(-50%,-50%);
                                    margin-bottom: 2rpx;
                                }
                            }
                            .num,.name{
                                color:#666;
                                font-size: 28rpx;
                                margin:0 0 0 20rpx;
                            }
                            .num{
                                width:120rpx;
                            }
                            .name{
                                width: 420rpx;
                            }
                        }
                    }
                    .more{
                        margin-top:30rpx;
                        text-align: center;
                        color:#333333;
                        font-size: 24rpx;
                        .more-text{
                            display: inline-block;
                            vertical-align: middle;
                        }
                        .more-arrow{
                            display: inline-block;
                            vertical-align: middle;
                            height: 32rpx;
                            width: 32rpx;
                            transform: rotate(180deg);
                        }
                        &.show{
                            .more-arrow{
                                transform: rotate(0deg);
                            }
                        }
                    }
                }
            }
            .empty{
                font-size: 28rpx;
                color:#999;
                margin:100rpx 0;
                text-align: center;
            }
        }
        .content{
            padding: 30rpx;
            box-sizing: border-box;
            height: 100%;
            .search-area{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .input{
                    width: 584rpx;
                    height: 66rpx;
                    line-height: 66rpx;
                    padding: 0 20rpx;
                    color:#9A9A9A;
                    font-size: 28rpx;
                    border-radius: 10rpx;
                    background: #E4E4E4;
                }
                .icon{
                    width: 42rpx;
                    height: 42rpx;
                    overflow: hidden;
                }
            }
            .history{
                .title{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin:40rpx 0;
                    .name{
                        font-size: 32rpx;
                        padding: 0 10rpx;
                        color:#333;
                        border-left: 6rpx solid #C30D23;
                        display: inline-block;
                        line-height: 40rpx;
                    }
                    .del{
                        height: 30rpx;
                        width: 30rpx;
                        background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/m/mp/del.png')no-repeat 50% 50% / cover;
                    }
                }
                .list{
                    .item{
                        margin:0 30rpx 30rpx 0;
                        border-radius: 40rpx;
                        background: rgba(232,232,232,1);
                        color:#666;
                        font-size: 28rpx;
                        padding: 10rpx 20rpx;
                        display: inline-block;
                        min-width: 56rpx;
                        text-align: center;
                    }
                }
            }
            .hot-words{
                .title{
                    font-size: 32rpx;
                    padding: 0 10rpx;
                    color:#333;
                    border-left: 6rpx solid #C30D23;
                    margin:40rpx 0;
                    line-height: 40rpx;
                }
                .list{
                    .item{
                        margin:0 30rpx 30rpx 0;
                        border-radius: 40rpx;
                        background: rgba(232,232,232,1);
                        color:#666;
                        font-size: 28rpx;
                        padding: 10rpx 20rpx;
                        display: inline-block;
                    }
                }
            }
        }
    }
    
</style>