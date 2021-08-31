<template>
	<view class="index-page" :style="{paddingTop:lowerVersion?'94px':paddingTop+'px'}">
		<Header :title="firstChooseTitle" :returnBools="true"></Header>
        <view class="content">
            <scroll-view class="left-nav" scroll-y="true" :scroll-top="scrollTop" :style="{height:leftHeight+'px'}">
                <Loading v-if="loading1"></Loading>
                <view class="nav-item" v-for="(item,index) in firstClassifyList" :key="index" :class="item.active?'active':''" @click="chooseFirst(item)">{{item.name}}</view>
            </scroll-view>
            <view class="right-box">
                <!-- <view class="second-classify-box" v-if="secondClassifyList.length>0">
                    <view class="item" v-for="(item,index) in secondClassifyList" :key="index" :class="item.active?'active':''"  @click="chooseSecond(item)">{{item.name}}</view>
                </view> -->
                <view class="second-classify-box" v-if="secondClassifyList.length>0"> 
                    <scroll-view scroll-x>
                        <view class="item" v-for="(item,index) in secondClassifyList" :key="index" :class="item.active?'active':''"  @click="chooseSecond(item)">
                            {{item.name}}
                        </view>
                    </scroll-view>
                </view>                
                <!-- <view class="sort-box">
                    <view class="item" :class="{'active':item.active,'sort1':item.isSort=='1','sort2':item.isSort=='2'}" v-for="(item,index) in sort" :key="index" @click="sortEvent(item)">
                        <text>{{item.name}}</text>
                        <view class="icon" v-if="item.isSort">
                            <view class="high"></view>
                            <view class="low"></view>
                        </view>
                    </view>
                </view> -->
                <List :loading="loading" :text="list.length==0&&finished?' ':'已经全部加载完毕~'" :finished="finished" :className="'course-list'" :height="rightHeight" @load="getCourseList" @pullRefresh="refresh" >
                    <view class="course-item" v-for="(item,index) in list" :key="index" @tap="goCourse(item)">
                        <!-- <view class="surfacePlot" :style="{background:`url(${item.surfacePlot}) 50% 50%/cover`}"></view> -->
                        <image class="surfacePlot" :src="item.surfacePlot" webp lazy-load></image>
                        <view class="info">
                            <view class="title">{{item.title}}</view>
                            <view class="intro">{{item.intro}}</view>
                            <view class="data">
                                <text class="teacher"></text>
                                <view class="studyBox">
                                    <image :src="eyes"></image>
                                    <text class="study">{{item.courseBrowsCount>9999?Math.floor((item.courseBrowsCount/10000) * 100) / 100+'W':item.courseBrowsCount}}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="empty" v-if="list.length==0&&finished">
                        <image :src="noDataIcon"></image>
                        <view>暂时没有课程哦</view>
                    </view>
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
    import eyes from '../../static/eyes.png'
    import noDataIcon from '../../static/noDataIcon.png' 
	const app = getApp()
	export default {
		data() {
			return {
                paddingTop:0,
                scrollTop:0,
                leftHeight:1000,
                rightHeight:1000,
                eyes:eyes,
                noDataIcon:noDataIcon,
                firstClassifyList:[],
                secondClassifyList:[],
                // sort:[
                //     {name:'综合',active:true,sortType:1},
                //     {name:'按热度',active:true,isSort:'0',sortType:2},
                //     {name:'按时间',active:false,isSort:'0',sortType:3},
                // ], 
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
                lowerVersion:false,
                firstChooseTitle:'' 
			}
		},
		created(){
            this.paddingTop = app.globalData.statusBarHeight+68;
            this.leftHeight = app.globalData.lowerVersion?app.globalData.windowHeight-49:app.globalData.windowHeight-this.paddingTop+45;
            this.getAllClassify()
		},
		onLoad(options){
            this.lowerVersion = app.globalData.lowerVersion;
            if(options.targetId){
                this.tempId = options.targetId
            }
            if(options.titleName){
                this.firstChooseTitle = options.titleName;
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
		onShareAppMessage(res){
			return {
				title: '学国学网小程序',
				path: '/pages/index/index',
				imageUrl:'../../static/courseDetail/share.png'
			}
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
                this.list = [];
                this.$nextTick(()=>{
                    const query = wx.createSelectorQuery();
                    query.select('.second-classify-box').boundingClientRect(res=>{
                        // const query1 = wx.createSelectorQuery()
                        // query1.select('.sort-box').boundingClientRect(res1=>{
                        //     if(res){
                        //         this.rightHeight = this.leftHeight - res1.height - res.height;
                        //     }else{
                        //         this.rightHeight = this.leftHeight - res1.height;
                        //     }
                            if(res){
                                this.rightHeight = this.leftHeight - res.height;
                            }else{
                                this.rightHeight = this.leftHeight;
                            }                        
                        this.getCourseList();
                        // }).exec()
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
                    type:2
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
                this.firstChooseTitle = obj.name;
                // this.sort = [
                //     {name:'综合',active:true,sortType:1},
                //     {name:'按热度',active:true,isSort:'0',sortType:2},
                //     {name:'按时间',active:false,isSort:'0',sortType:3},
                // ]    
            },
            /**
             * 选择二级分类
             */
            chooseSecond(obj){
                if(obj.active) return;
                this.targetId = obj.id;
                this.secondClassifyList.forEach(item=>item.active=false);
                obj.active = true;
                // this.sort = [
                //     {name:'综合',active:true,sortType:1},
                //     {name:'按热度',active:true,isSort:'0',sortType:2},
                //     {name:'按时间',active:false,isSort:'0',sortType:3},
                // ]  
            },
            /**
             * 排序
             */
            // sortEvent(obj){
            //     if(obj.active){
            //         if(obj.isSort=='1'){
            //             obj.isSort = '2'
            //         }
            //         else if(obj.isSort=='2'){
            //             obj.isSort = '1'
            //         }
            //     }
            //     else{
            //         this.sort.forEach(item=>{
            //             if(item.isSort){
            //                 item.isSort = '0'
            //             }
            //             item.active = false
            //         })
            //         if(obj.isSort){
            //             obj.isSort = '1';
            //         }
            //         obj.active = true;
            //     }
            //     let temp = this.targetId;
            //     this.targetId = -1;
            //     this.$nextTick(()=>{
            //         this.targetId = temp;
            //     })           
            // },
            /**
             * 获取分类ID获取课程列表
             */
            getCourseList(callback){
                if(this.targetId<0) return;
                this.loading = callback&&typeof callback === 'function'?false:true;
                // let obj = this.sort.find(item=>item.active==true);
                // var index = this.sort.findIndex((item,index)=>{
                //         return item.active==true;
                // });     
                // let obj =this.sort[index];         
                let query = {
                    targetId:this.targetId,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    mtype:2,
                    sortType:3,
                    updown:2
                }
                // if(obj.isSort){
                    // query.updown = obj.isSort
                // }
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
                this.list = [];
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
                width: 120rpx;
                background: rgba(242,242,242,1);
                padding: 30rpx 0 0 0;
                box-sizing: border-box;                
                .nav-item{
                    margin-bottom:60rpx;
                    // margin-left: 10rpx;
                    color:#333333;
                    font-size: 30rpx;
                    padding: 0 30rpx;
                    // width:80rpx;
                    text-align: center;
                    word-wrap: break-word;
                    word-break: break-all;                    
                    &.active{
                        color: #C30D23;
                        font-weight: 700;
                    }
                }
            }
            .right-box{
                flex: 1;
                width: calc(100% - 100px);
                .second-classify-box{
                    // display: flex;
                    // flex-wrap: wrap;
                    // padding:20rpx;
                    // border-bottom:1px solid #f2f2f2;
                    // box-sizing: border-box;
                        width: 100%;
                        margin: 44rpx auto 10rpx;
                        // height: 70rpx;
                        overflow: hidden;
                        background: #fff;
                        white-space: nowrap;
                        // background: rgba(0,0,0,0.1);     
                        scroll-view{
                            height: 100%;
                            width: auto;
                            overflow:hidden;
                            .item{
                                font-size: 28rpx;
                                color:#666666;
                                // width: 30%;
                                padding:14rpx 20rpx;
                                margin-left: 20rpx;
                                // height: 66rpx;
                                text-align: center;
                                // line-height: 66rpx;
                                border-radius: 66rpx;
                                display: inline-block;
                                border:2rpx solid #999999;
                                &.active{
                                    color: #fff;
                                    font-weight: 700;
                                    background: #C30D20;
                                    border:1px solid#C30D20;
                                }
                            }                            
                        }                                       
                }                
                // .sort-box{
                //     display: flex;
                //     justify-content: space-around;
                //     align-items: center;
                //     padding:20rpx 0;
                //     .item{
                //         width: 150rpx;
                //         padding: 10rpx 0;
                //         position: relative;
                //         border-radius: 40rpx;         
                //         display: flex;
                //         align-items: center;
                //         justify-content:center;
                //         &.active{
                //             background: #f2f2f2;
                //         }
                //         &.sort1{
                //             .high{
                //                 position: absolute;
                //                 margin:auto!important;
                //                 bottom:4rpx;
                //                 top:0;
                //                 left: 0;
                //                 right: 0;
                //                 border-color: transparent transparent #888!important;
                //             }
                //             .low{
                //                 display: none;
                //             }
                //         }
                //         &.sort2{
                //             .low{
                //                 position: absolute;
                //                 margin:auto!important;
                //                 top:10rpx;
                //                 left: 0;
                //                 bottom:0;
                //                 right: 0;
                //                 border-color: #888 transparent transparent!important;
                //             }
                //             .high{
                //                 display: none;
                //             }
                //         }
                //         text{
                //             font-size: 28rpx;
                //         }
                //         .icon{
                //             margin-left: 4rpx;
                //             height: 40rpx;
                //             position: relative;
                //             span{
                //                 display: block;
                //                 height: 20rpx;
                //             }
                //             .high{
                //                 width: 0;
                //                 height: 0;
                //                 border: 6rpx solid;
                //                 border-color: transparent transparent #ddd;
                //                 margin:6rpx 0;
                //             }
                //             .low{
                //                 width: 0;
                //                 height: 0;
                //                 border: 6rpx solid;
                //                 border-color: #ddd transparent transparent;
                //             }
                //         }
                //     }
                // }
                .course-list{
                    .course-item{
                        box-shadow: 0px 0px 5px 2px #f4f4f4;
                        width: 90%;
                        margin: 30rpx auto 0;
                        padding-bottom: 30rpx;
                        border-radius: 14rpx;
                        .surfacePlot{
                            height: 320rpx;
                            width: 570rpx;
                            border-radius: 10rpx;
                            background-color:#dfdfdf;
                        }
                        .info{
                            padding: 0 30rpx;
                            .title{
                                color:#333333;
                                font-size: 30rpx;
                                margin:20rpx 0;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp:2;
                                font-weight: 500;
                                -webkit-box-orient: vertical;                                   
                            }
                            .intro{
                                color:#666;
                                font-size: 22rpx;
                                margin:20rpx 0;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp:2;
                                -webkit-box-orient: vertical;                                   
                            }
                            .data{
                                display: flex;
                                align-items: center;
                                justify-content:flex-start;
                                font-size: 24rpx;
                                color:#999;
                                line-height: 24rpx;
                                .teacher{
                                    color:#666;
                                }
                                .studyBox{
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: space-between;
                                    align-items: center;
                                    image{
                                        width: 36rpx;
                                        height: 36rpx;
                                    }
                                    text{
                                        padding: 0 10rpx;
                                        height: 36rpx;
                                        line-height: 36rpx;
                                        line-height: 36rpx;
                                        font-size: 28rpx;
                                    }                                    
                                }
                            }
                        }
                    }
                }
                .empty{
                    color:#999;
                    text-align: center;
                    padding: 200rpx 0;
                    font-size: 28rpx;
                    image{
                        width: 260rpx;
                        height: 198rpx;
                        margin: 0 auto;
                        display: block;
                    }
                    view{
                        color:#999;
                        text-align: center;
                        padding: 40rpx 0;
                        font-size: 28rpx;           
                    }


                }
            }
        }
	}
</style>
<style>
::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
}
</style>

