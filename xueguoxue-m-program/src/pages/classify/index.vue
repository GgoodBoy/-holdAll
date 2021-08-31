<template>
	<view class="index-page" :style="{paddingTop:lowerVersion?'0':paddingTop+'px'}">
		<Header :title="'分类'"></Header>
        <view class="content">
            <scroll-view class="left-nav" scroll-y="true" :scroll-top="scrollTop" :style="{height:leftHeight+'px'}">
                <Loading v-if="loading1"></Loading>
                <view class="nav-item" v-for="(item,index) in firstClassifyList" :key="index" :class="item.active?'active':''" @click="chooseFirst(item)">{{item.name}}</view>
            </scroll-view>
            <view class="right-box">
                <view class="second-classify-box" v-if="secondClassifyList.length>0">
                    <view class="item" v-for="(item,index) in secondClassifyList" :key="index" :class="item.active?'active':''"  @click="chooseSecond(item)">{{item.name}}</view>
                </view>
                <view class="sort-box">
                    <view class="item" :class="{'active':item.active,'sort1':item.isSort=='1','sort2':item.isSort=='2'}" v-for="(item,index) in sort" :key="index" @click="sortEvent(item)">
                        <text class="text-css">{{item.name}}</text>
                        <view class="icon" v-if="item.isSort">
                            <view class="high"></view>
                            <view class="low"></view>
                        </view>
                    </view>
                </view>
                <List :loading="loading" :text="list.length==0&&finished?' ':'没有更多数据了~'" :finished="finished" :className="'course-list'" :height="rightHeight" @load="getCourseList" @pullRefresh="refresh" >
                    <view class="course-item" v-for="(item,index) in list" :key="index" @tap="goCourse(item)">
                        <!-- <view class="surfacePlot" :style="{background:`url(${item.surfacePlot}) 50% 50%/cover`}"></view> -->
                        <image class="surfacePlot" :src="item.surfacePlot" webp lazy-load></image>
                        <view class="info">
                            <view class="title">{{item.title}}</view>
                            <view class="intro">{{item.intro}}</view>
                            <view class="data">
                                <text class="teacher">{{item.lectureTeacherList.length>1?item.lectureTeacherList[0].name+' 等':item.lectureTeacherList[0].name}}</text>
                                <text class="study">{{item.courseBrowsCount>10000?Math.floor((item.courseBrowsCount/10000) * 100) / 100+'W':item.courseBrowsCount}}人学习</text>
                            </view>
                        </view>
                    </view>
                    <view class="empty" v-if="list.length==0&&finished">暂时没有课程哦</view>
                </List>
            </view>
        </view>
        <MiniAudio v-if="audioData.show" :cur="cur" :curList="curList"></MiniAudio>
	</view>
</template>
<script>
    import {mapState,mapActions} from 'vuex'
    import Header from '../../wxcomponents/Header'
    import List from '../../wxcomponents/MyList'
    import Loading from '../../wxcomponents/Loading'
    import MiniAudio from '../../wxcomponents/miniAudio.vue'
	const app = getApp()
	export default {
		data() {
			return {
                paddingTop:0,
                scrollTop:0,
                leftHeight:1000,
                rightHeight:1000,
                firstClassifyList:[],
                secondClassifyList:[],
                sort:[
                    {name:'综合',active:true,sortType:1},
                    {name:'按热度',active:false,isSort:'0',sortType:2},
                    {name:'按时间',active:false,isSort:'0',sortType:3},
                ], 
                list:[], 
                tempId:'',        
                targetId:'',
                finished: false,
                loading1:false,
                loading:false,
                pageNo:1,
                pageSize:10,
                timer:null,
                cur:'0',
                curList:[],
                firsterBool:true,//定时器第一次锁
                clearIntervalbool:true,
                lowerVersion:false      
			}
		},
		created(){
            this.paddingTop = app.globalData.statusBarHeight+44;
            this.leftHeight = app.globalData.lowerVersion?app.globalData.windowHeight:app.globalData.windowHeight-this.paddingTop;
            this.getAllClassify()
		},
		onLoad(options){
            this.lowerVersion = app.globalData.lowerVersion;
            if(options.targetId){
                this.tempId = options.targetId
            }
		},
		onShow(){
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
		mounted(){
			
		},
		onReady(){

		},
		components:{
            Header,List,MiniAudio,Loading
		},
		computed:{
			...mapState(['audioData','timeArry'])
        },
        watch:{
            targetId(cur,old){
                if(cur<0) return;
                this.pageNo = 1;
                this.loading = true;
                this.finished = false;
                this.list = [ ];
                this.$nextTick(()=>{
                    const query = wx.createSelectorQuery()
                    query.select('.second-classify-box').boundingClientRect(res=>{
                        const query1 = wx.createSelectorQuery()
                        query1.select('.sort-box').boundingClientRect(res1=>{
                            if(res){
                                this.rightHeight = this.leftHeight - res1.height - res.height;
                            }else{
                                this.rightHeight = this.leftHeight - res1.height;
                            }
                            this.getCourseList();
                        }).exec()
                    }).exec()
                })
            }
        },
		methods: {
            /**
             * 获取所有分类
             */
			getAllClassify(){
                let query = {
                    type:1
                }
                this.loading1 = true;
                this.$http.post(this.$server.getWechatAllClassify,query).then(res=>{
                    this.loading1 = false;
                    if(res.data.status==200){
                        this.firstClassifyList = res.data.content;
                        if(this.tempId=='0'){
                            this.firstClassifyList.unshift({
                                name:'全部',
                                id:0,
                                childrenVos:[],
                                active:true
                            })
                            this.secondClassifyList = [];
                            this.targetId = 0;
                        }else{
                            for(let i in this.firstClassifyList){
                                if(this.firstClassifyList[i].id==this.tempId){
                                    this.firstClassifyList[i].active = true;
                                    this.secondClassifyList = this.firstClassifyList[i].childrenVos;
                                    this.firstClassifyList.unshift({
                                        name:'全部',
                                        id:0,
                                        childrenVos:[],
                                        active:false
                                    })
                                    this.targetId = this.tempId;
                                    break;
                                }else{
                                    if(this.firstClassifyList[i].childrenVos.length>0){
                                        let arr = this.firstClassifyList[i].childrenVos;
                                        for(let j in arr){
                                            if(arr[j].id==this.tempId){
                                                this.firstClassifyList[i].active = true;
                                                this.firstClassifyList.unshift({
                                                    name:'全部',
                                                    id:0,
                                                    childrenVos:[],
                                                    active:false
                                                })
                                                arr[j].active = true;
                                                this.secondClassifyList = arr;
                                                this.targetId = this.tempId;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        this.$nextTick(()=>{
                            const query = wx.createSelectorQuery()
                            query.select('.nav-item.active').boundingClientRect(res=>{
                                this.scrollTop = res.top-this.paddingTop-30;
                            }).exec()
                        })
					}
                }).catch(()=>{
                    this.loading1 = true;
                })
            },
            /**
             * 选择一级分类
             */
            chooseFirst(obj){
                if(obj.active) return;
                this.targetId = obj.id;
                this.secondClassifyList = obj.childrenVos||[]
                this.firstClassifyList.forEach(item=>item.active=false);
                this.secondClassifyList.forEach(item=>item.active=false);
                obj.active = true;
                this.sort = [
                    {name:'综合',active:true,sortType:1},
                    {name:'按热度',active:false,isSort:'0',sortType:2},
                    {name:'按时间',active:false,isSort:'0',sortType:3},
                ]    
            },
            /**
             * 选择二级分类
             */
            chooseSecond(obj){
                if(obj.active) return;
                this.targetId = obj.id;
                this.secondClassifyList.forEach(item=>item.active=false);
                obj.active = true;
                this.sort = [
                    {name:'综合',active:true,sortType:1},
                    {name:'按热度',active:false,isSort:'0',sortType:2},
                    {name:'按时间',active:false,isSort:'0',sortType:3},
                ]  
            },
            /**
             * 排序
             */
            sortEvent(obj){
                if(obj.active){
                    if(obj.isSort=='1'){
                        obj.isSort = '2'
                    }
                    else if(obj.isSort=='2'){
                        obj.isSort = '1'
                    }
                }
                else{
                    this.sort.forEach(item=>{
                        if(item.isSort){
                            item.isSort = '0'
                        }
                        item.active = false
                    })
                    if(obj.isSort){
                        obj.isSort = '1';
                    }
                    obj.active = true;
                }
                let temp = this.targetId;
                this.targetId = -1;
                this.$nextTick(()=>{
                    this.targetId = temp;
                })           
            },
            /**
             * 获取分类ID获取课程列表
             */
            getCourseList(callback){
                if(this.targetId<0) return;
                this.loading = callback&&typeof callback === 'function'?false:true
                let obj = this.sort.find(item=>item.active==true)
                let query = {
                    targetId:this.targetId,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    mtype:1,
                    sortType:obj.sortType
                }
                if(obj.isSort){
                    query.updown = obj.isSort
                }
                this.$http.post(this.$server.getWechatListByNavigation,query,{urlType:true}).then(res=>{
                    if(res.data.status==200){
                        this.list = [...this.list,...res.data.content.list];
                        this.pageNo++;
                        this.loading = false;
                        this.finished = res.data.content.isLastPage;
                        if(callback){
                            callback()
                        }
                    }
                })
            },
            /**
             * 下拉刷新
             */
            refresh(callback){
                this.pageNo = 1;
                this.finished = false;
                this.list = [ ];
                this.getCourseList(callback)
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

<style lang="scss">
    page{
        background:#fff;
    }
	.index-page{
		.content{
            display: flex;
            border-top:1px solid #f2f2f2;
            .left-nav{
                width: 180rpx;
                background: rgba(242,242,242,1);
                padding: 30rpx 0 0 0;
                box-sizing: border-box;
                .nav-item{
                    margin-bottom:60rpx;
                    color:#333333;
                    font-size: 30rpx;
                    padding-left:30rpx;
                    &.active{
                        color: #C30D23;
                        font-weight: 700;
                    }
                }
            }
            .right-box{
                flex: 1;
                .second-classify-box{
                    display: flex;
                    flex-wrap: wrap;
                    padding:20rpx;
                    border-bottom:1px solid #f2f2f2;
                    box-sizing: border-box;
                    .item{
                        font-size: 28rpx;
                        color:#666;
                        padding: 5rpx 10rpx;
                        &.active{
                            color: #C30D23;
                            font-weight: 700;
                        }
                    }
                }
                .sort-box{
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding:20rpx 0;
                    .item{
                        width: 150rpx;
                        padding: 10rpx 0;
                        position: relative;
                        border-radius: 40rpx;         
                        display: flex;
                        align-items: center;
                        justify-content:center;
                        &.active{
                            background: #f2f2f2;
                        }
                        &.sort1{
                            .high{
                                position: absolute;
                                margin:auto!important;
                                bottom:4rpx;
                                top:0;
                                left: 0;
                                right: 0;
                                border-color: transparent transparent #888!important;
                            }
                            .low{
                                display: none;
                            }
                        }
                        &.sort2{
                            .low{
                                position: absolute;
                                margin:auto!important;
                                top:10rpx;
                                left: 0;
                                bottom:0;
                                right: 0;
                                border-color: #888 transparent transparent!important;
                            }
                            .high{
                                display: none;
                            }
                        }
                        .text-css{
                            font-size: 28rpx;
                        }
                        .icon{
                            margin-left: 4rpx;
                            height: 40rpx;
                            position: relative;
                            span{
                                display: block;
                                height: 20rpx;
                            }
                            .high{
                                width: 0;
                                height: 0;
                                border: 6rpx solid;
                                border-color: transparent transparent #ddd;
                                margin:6rpx 0;
                            }
                            .low{
                                width: 0;
                                height: 0;
                                border: 6rpx solid;
                                border-color: #ddd transparent transparent;
                            }
                        }
                    }
                }
                .course-list{
                    .course-item{
                        padding: 30rpx;
                        border-bottom:1px solid #f2f2f2;
                        .surfacePlot{
                            height: 286rpx;
                            width: 100%;
                            border-radius: 10rpx;
                            background-color:#dfdfdf;
                        }
                        .info{
                            .title{
                                color:#333333;
                                font-size: 30rpx;
                                margin:20rpx 0;
                                font-weight: 500;
                                font-family: 'PingFangSC-Medium';
                            }
                            .intro{
                                color:#666;
                                font-size: 22rpx;
                                margin:20rpx 0;
                                background: #f4f4f4;
                                padding: 10rpx;
                                border-radius: 12rpx;

                            }
                            .data{
                                display: flex;
                                align-items: center;
                                justify-content: space-between; 
                                font-size: 24rpx;
                                color:#999;
                                line-height: 24rpx;
                                .teacher{
                                    color:#999;
                                }
                            }
                        }
                    }
                }
                .empty{
                    color:#999;
                    text-align: center;
                    padding: 40rpx 0;
                    font-size: 28rpx;
                }
            }
        }
	}
</style>
