<template>
	<view class="my-page" :style="{paddingTop:lowerVersion?'44px':paddingTop+'px'}">
         <!-- v-if="!lowerVersion" -->
        <view class="header">
            <view class="status-bar" :style="{height:statusBarHeight+'px'}"></view>
            <view class="newTitle">我的</view>
            <view class="userSrearch">
                <view class="icons leftPxs2" :style="{top:`${statusBarHeight}px`}">
                    <image class="search-icon" webp lazy-load :src="searchIcon" @tap="goSearch"></image>
                </view>            
            </view>
        </view>
        <view class="card-mode" :style="{top:topTitle+'px'}">
            <view class="card-box">
                <image class="image1" :src="userInfoById.avatar" webp lazy-load></image>
                <view class="card-info">
                    <text class="text1">{{userInfoById.nickname}}</text>
                    <view class="card-imgs">
                        <image :src="userInfoById.medalIconUrl" webp lazy-load></image>                      
                        <text class="text2">{{userInfoById.medalName}}</text>
                    </view>
                </view>
            </view>
            <view class="card-num">
                <view class="numBox1">
                    <view class="viewText1">{{userInfoById.availableNum}}</view>
                    <view class="viewText2">积分</view>
                </view>
                <view class="culouseSolid"></view>
                <view class="numBox1">
                    <view class="viewText1" v-if='userInfoById.coinBalance'>{{Number(userInfoById.coinBalance).toFixed(2)}}</view>
                    <view class="viewText1" v-else>0.00</view>
                    <view class="viewText2">账户</view>                           
                </view>
            </view>            
            <!-- <view class="textCss">修改个人信息、享积分抵现，请下载“学国学网”APP</view> -->
        </view>        
        <view class="tabber-pluge"  :style="{top:topTitle1+'rpx'}"> 
            <view class="tabber-same-css" :class="{'activeIsYes':isActive==index,'activeIsNo':isActive!=index}" @click="tabberSelect(item,index)" v-for="(item,index) in tabberList" :key="index">
                <view>{{item.name}}</view>
                <view :class="{'underlineYes':isActive==index,'underlineNo':isActive!=index}"></view>
            </view>     
        </view>    
        <view class="info-list" v-if="tabberType" :style="{top:topTitle2+'rpx'}">          
            <view v-if="longType" class="longCss">
                数据加载中...
            </view> 
            <view v-else>
                <scroll-view class="scrollViewHeight" scroll-y="true" lower-threshold='100' @scrolltolower="scrollEventBotton"  v-if="infoList.length">
                    <view class="list-box" v-for="(item,index) in infoList" :key='index' @click="toCourseDetail(item)">
                        <view class="listBoxTitleCss">
                            <view class="titleText">{{item.commodityTitle}}</view>
                        </view> 
                        <view class="listBoxTimeCss">
                            <view class="titleText">{{item.createdAt}}</view>
                            <view class="butText" v-if="Number(item.assembleType)>0?true:false">拼团</view> 
                        </view> 
                        <view class="layout-row">
                            <view class="title">
                                <view class="startBox">订</view>
                                <view class="cenetrBox">单</view>
                                <view class="endBox">号</view>
                            </view> 
                            <view>: {{item.orderId}}</view>
                        </view> 
                        <view class="layout-row">
                            <view class="title">
                                <view class="startBox">支</view>
                                <view class="cenetrBox1">付</view>
                                <view class="cenetrBox2">金</view>
                                <view class="endBox">额</view>
                            </view>                              
                            <view>: {{(item.payPrice?item.payPrice.toFixed(2):'')||0}}元</view>
                        </view> 
                        <view class="layout-row" v-if="Number(item.couponsPrice)>0">
                            <view class="title">
                                <view class="startBox">优</view>
                                <view class="cenetrBox">惠</view>
                                <view class="endBox">券</view>  
                            </view>                           
                            <view>: {{item.couponsPrice}}元</view>
                        </view>        
                        <view class="layout-row" v-if="Number(item.reducePrice)>0">
                            <view class="title"> 
                                <view class="startBox">减</view>
                                <view class="endBox">价</view>
                            </view>                             
                            <view>: {{item.reducePrice}}元</view>
                        </view>      
                        <view class="layout-row" v-if="Number(item.timeLimitDiscount)>0">
                            <view class="title"> 
                                <view class="startBox">折</view>
                                <view class="endBox">扣</view>
                            </view>                             
                            <view>: {{item.timeLimitDiscount}}折</view>
                        </view> 
                        <view class="layout-row" v-if="Number(item.integralNum)>0">
                            <view class="title">
                                <view class="startBox">积</view> 
                                <view class="endBox">分</view> 
                            </view> 
                            <view>: {{item.integralNum}}积分</view>
                        </view>                                    
                    </view>
                    <view class="text" v-if="finished">{{'没有更多数据了~'}}</view>
                </scroll-view>
                <view class="textTips" v-else>
                    <image :src="noDataIcon"></image>
                    <view>你还没有购买过课程</view>
                </view>                
            </view>
        </view>         
        <view v-else class="course-list" :style="{top:topTitle2+'rpx'}">
            <view v-if="longType" class="longCss">
                数据加载中...
            </view> 
            <view v-else>            
                <scroll-view class="scrollViewHeight" scroll-y="true" lower-threshold='100' @scrolltolower="scrollEventBotton" v-if="courseList.length">
                    <view class="list-box2" v-for="(item,index) in courseList" :key='index' @click="goPage(item)">
                        <image :src="item.surfacePlot" webp lazy-load /> 
                        <view class="list-box2-title">{{item.title}}</view>
                        <view class="list-box2-details">{{item.intro}}</view> 
                        <view class="list-box2-progress">学习进度{{item.studyedNum}}/{{item.planPeriodNum}}节</view>    
                    </view>
                    <view class="text" v-if="finished" >{{'没有更多数据了~'}}</view>
                </scroll-view>
                <view class="textTips" v-else>
                    <image :src="noDataIcon"></image>
                    <view>你还没有购买过课程</view>                
                </view>
            </view>
        </view>
	</view>
</template>  

<script>
    const app = getApp()
    import userIcon from '../../static/user-icon.png';
    import searchIcon from '../../static/search-icon.png'
    import searchIcon1 from '../../static/search-icon-1.png'
    import shareImg from '../../static/courseDetail/share.png' 
    import noDataIcon from '../../static/noDataIcon.png'
	export default {
		data() {
			return {
                lowerVersion:false,
                paddingTop:0,
                userIcon:userIcon,
                searchIcon:searchIcon,
                searchIcon1:searchIcon1,
                noDataIcon:noDataIcon,
                shareImg:shareImg,
                authed:false,
                isActive:0,
                currentPage:1,
                pageSize:1000,
                userinfos:'',
                tabberList:[
                    {
                        name:'我的课程',
                        id:1
                    },
                    {
                        name:'我的订单',
                        id:2
                    }
                ],
                tabberType:false,
                courseList:[],
                infoList:[],
                userInfoById:{},
                finished:false,
                selectId:1,
                statusBarHeight:20,
                topTitle:92,
                topTitle1:628,
                topTitle2:700,
                longType:true,
                routeUrl:'',
                routeUrl1:'' 
			}
		},
		props:[],
		created(){},
		onLoad(){
            var widths = wx.getSystemInfoSync().windowWidth;
            this.statusBarHeight = app.globalData.statusBarHeight;
            this.paddingTop = app.globalData.statusBarHeight+68;          
            this.lowerVersion = app.globalData.lowerVersion;
            var unms = this.statusBarHeight-20;
            var rpxNum = unms/widths*750;
            this.topTitle = unms>0?this.topTitle+unms:this.topTitle-unms;
            this.topTitle1 = unms>0?this.topTitle1+rpxNum:this.topTitle1-rpxNum;
            this.topTitle2 = unms>0?this.topTitle2+rpxNum:this.topTitle2-rpxNum;
        },  
        onShow(){
			// this.getUserInfoEven();
            this.userInfoById = {};
            // this.tabberType = !this.tabberType;
            this.currentPage =1;
            this.infoList = [];
            this.courseList =[];
            this.finished = false;
            let userInfo = wx.getStorageSync('userInfo')
            if(!userInfo){
                if(this.lowerVersion){
                    var authReturn  = wx.getStorageSync('authFirst');
                    if(authReturn){
                        wx.removeStorageSync('authFirst');
                        wx.switchTab({
                            url: '/pages/index/index'
                        })
                    }else{
                        uni.navigateTo({
                            url: `/pages/auth/index?isUserType=1`
                        });
                    }
                }else{
                    uni.navigateTo({
                        url: `/pages/auth/index?isUserType=1`
                    });
                }
            }else{
                this.userinfos = JSON.parse(wx.getStorageSync('userInfo'));
                this.getChildInfo();
                this.scrollEventBotton();
            }
		},	              
		mounted(){},
		components:{},
		computed:{},
		methods: {
			getUserInfoEven(){
				let users = wx.getStorageSync('userInfo');
				let userinfos = wx.getStorageSync('userInfo');
				if(!users){
					wx.showToast({
							title: userinfos.nickname||'无2',
							icon: 'none',
							mask:false,
							duration: 1500//持续的时间
					}) 	
				}else{
					wx.showToast({
							title: userinfos.nickname||'有2',
							icon: 'none',
							mask:false,
							duration: 1500//持续的时间
					})					
				}				
			},            
            toCourseDetail(data){
                uni.navigateTo({
                    url: `/pages/courseDetail/index?id=${data.commodityId}`
                });
            },
            goPage(data){
                uni.navigateTo({
                    url: `/pages/courseDetail/index?id=${data.id}`
                });                
            },
            getChildInfo(){
                let query = {
                    userId:this.userinfos.userId,
                    token:this.userinfos.token
                }
                this.$http.post(this.$server.getUserChildrenInfo,query).then(res=>{
                    this.loading = false;
                    if(res.data.status==200){
                        this.userInfoById = res.data.content;
                    }
                })                
            },
            getList1(){
                var self = this;
                let query = {
                    currentPage:this.currentPage,
                    pageSize:this.pageSize,
                    userId:this.userinfos.userId,
                    token:this.userinfos.token
                }
                this.longType = true;
                this.$http.post(this.$server.getWechatCourseOrderList,query).then(res=>{
                    this.loading = false;
                    if(res.data.status==200){
                        this.infoList = [...this.infoList,...res.data.content.list];
                        this.finished = res.data.content.isLastPage;
                        if(this.currentPage!=this.finished){
                            this.currentPage++;
                        }
                        this.$nextTick(()=>{
                            self.longType = false;
                        })
                    }
                })
            }, 
            getList2(){
                var self = this;
                let query = {
                    userId:this.userinfos.userId,
                    currentPage:this.currentPage,
                    pageSize:this.pageSize
                }
                this.longType = true;
                this.$http.post(this.$server.getWechatPurchasedCourseList,query,{urlType:true}).then(res=>{
                    if(res.data.status==200){
                        this.courseList = [...this.courseList,...res.data.content.list]
                        this.courseList.forEach(item=>{
                            item.classifyNameTemp = item.classifyName&&item.classifyName.length>0?item.classifyName.substr(0,2):''
                        })
                        this.finished = res.data.content.isLastPage;
                        if(this.currentPage!=this.finished){
                            this.currentPage++;
                        }
                        this.$nextTick(()=>{
                            self.longType = false;
                        })                        
                    }
                })
            },                       
            scrollEventBotton(){
                if(this.tabberType){                   
                    if(this.currentPage!=this.finished){
                        this.getList1();
                    }
                }else{
                    if(this.currentPage!=this.finished){
                        this.getList2();
                    }     
                }
            },           
            tabberSelect(data,index){
                this.isActive = index;
                if(this.selectId!=data.id){
                    this.selectId = data.id;
                    this.tabberType = !this.tabberType;
                    this.currentPage =1;
                    this.infoList = [];
                    this.courseList =[];
                    this.finished = false;
                    this.scrollEventBotton();
                }
            },      
			goSearch(){
				uni.navigateTo({
                    url: '/pages/search/index'
                });
            }                       
		}
	}
</script>

<style lang="scss">
.my-page{
    height: calc(100vh - 64px);
	background:rgba(244,244,244,1);    
    .page-title{
        text-align: center;
        font-size: 18px;
        font-weight: 700;
        height: 40rpx;
        line-height: 40rpx;
        margin: 40rpx auto;
    }
    .tabber-pluge{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        overflow-x: auto;
        border-bottom: 1px solid #f4f4f4;
        // margin:30rpx 0;
        position: fixed;
        left: 132rpx;
        top: 640rpx;
        z-index: 11;
        .tabber-same-css{
            // height: 60rpx;
            width: 130rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .tabber-same-css:nth-child(2){
                margin-left: 228rpx;
                }        
    }
    .card-mode{
        width: 680rpx;
        padding: 10rpx;
        border-radius: 40rpx;
        background: #fff;
        position: fixed;
        left: 25rpx;
        top: 196rpx;
        z-index: 11;
        .card-box{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            padding: 44rpx 40rpx;
            .image1{
                width: 120rpx;
                height: 120rpx;
                border-radius: 50%;
                box-shadow: 0px 20px 20px -20px #5E5E5E;
            }
            .card-info{
                width: 400rpx;
                padding: 0 0 0 40rpx;
                .text1{
                    font-size: 36rpx;
                    color: #333333;
                }
                .card-imgs{
                    display: flex;
                    flex-direction: row;    
                    justify-content: flex-start;
                    align-items: center;
                    margin-top: 10rpx;
                    image{
                        width: 40rpx;
                        height: 40rpx;
                        border-radius: 50%;
                    }  
                    .text2{
                        line-height: 60rpx;
                        font-size: 26rpx;
                        color:#666;
                        margin-left: 10rpx;
                    }       
                }
            }
        }
        .card-num{
            padding: 20rpx 0 40rpx 0;
            // display: flex;
            // flex-direction: row;  
            // align-items: center;
            // justify-content:space-around;  
            position: relative;
            overflow: hidden;
            .culouseSolid{
                height: 56rpx;
                width: 2rpx;
                background:#E5E5E5;
                position: absolute;
                left: 340rpx;
                top: 50rpx;
            }
            .numBox1{
                position: relative;
                float: left;
                width: 50%;
                // .borderNumber{
                //     height: 56rpx;
                //     width: 2rpx;
                //     position: absolute;
                //     left: -130rpx;
                //     top: 20rpx;
                //     background:#E5E5E5;             
                // }                
                .viewText1{
                    color: #333333;
                    font-size: 56rpx;
                    text-align: center;
                }
                .viewText2{
                    color: #999;
                    font-size: 32rpx;
                    text-align: center;
                }                
            }                           
        }         
    } 
    .course-list{
        width: 100%;
        background: #fff;
        position: fixed;
        left: 0;
        border-radius: 50rpx;
        z-index: 11;   
        .longCss{
            text-align: center;
            padding: 280rpx 0;
            font-size: 24rpx;
            color: #666;
        }             
        .textTips{
            padding: 200rpx 0 300rpx 0;
            image{
                width: 260rpx;
                height: 198rpx;
                margin: 0 auto;
                display: block;
            }
            view{
                text-align: center;
                color:#999; 
                font-size: 28rpx;  
                padding-top: 20rpx;             
            }
        }
        .scrollViewHeight{
            height: calc(100vh - 700rpx);
            .list-box2{
                width: 690rpx;
                margin:30rpx auto;
                border-radius: 16rpx;
                border: 2rpx solid #E5E5E5;
                image{
                    width: 100%;
                    border-top-left-radius:16rpx; 
                    border-top-right-radius: 16rpx;
                    height: 388rpx;
                }
                .list-box2-title{
                    font-size: 30rpx;
                    font-weight: 800;
                    padding: 0 20rpx;
                    font-family: 500;
                }
                .list-box2-details{
                    font-size: 24rpx;
                    padding: 0 20rpx;
                    color: #666;
                    display: -webkit-box;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp: 2;
                    overflow:hidden; //超出一行文字自动隐藏
                    text-overflow:ellipsis;//文字隐藏后添加省略号    
                    background: #f4f4f4;
                    padding: 8rpx;         
                    margin: 10rpx 20rpx;
                }
                .list-box2-progress{
                    text-align: left;
                    padding: 10px;
                    font-size: 26rpx;
                    color: #C30D20;
                }
            }
            .text{
                margin:20rpx 0;
                color:#999;
                font-size: 28rpx;
                text-align: center;
            }             
        }       
    }
    .info-list{
        width: 100%;
        overflow-y:auto;
        background: #fff;
        position: fixed;
        left: 0;
        border-radius: 50rpx;
        z-index: 11;
        .longCss{
            text-align: center;
            padding: 280rpx 0;
            font-size: 24rpx;
            color: #666;            
        }
        .textTips{
            padding: 200rpx 0;
            image{
                width: 260rpx;
                height: 198rpx;
                margin: 0 auto;
                display: block;
            }
            view{
                text-align: center;
                color:#999; 
                font-size: 28rpx;  
                padding-top: 20rpx;             
            }
        }
                
        .scrollViewHeight{
            height: calc(100vh - 700rpx);
            .list-box{
                width: 680rpx;
                margin:20rpx auto;
                padding: 30rpx 0;
                margin-bottom: 20rpx;
                border-radius: 12rpx;
                border: 2rpx solid #E5E5E5;
                .layout-row{
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    padding:10rpx 30rpx;
                    view{
                        font-size: 28rpx;
                        color: #333333;
                    }
                    .title{
                        width: 134rpx;
                        position: relative;
                        height: 28rpx;
                        .startBox{
                            position: absolute;
                            left: 0;
                            height: 28rpx;
                            line-height: 28rpx;
                        }
                        .endBox{
                            position: absolute;
                            right: 8rpx;
                            top: 0;
                            height: 28rpx;
                            line-height: 28rpx;                            
                        }
                        .cenetrBox{
                            text-align: center;
                            height: 28rpx;
                            line-height: 28rpx;                            
                        }
                        .cenetrBox1{
                            position: absolute;
                            height: 28rpx;
                            line-height: 28rpx;  
                            left: 34rpx;                          
                        }
                        .cenetrBox2{
                            position: absolute;
                            height: 28rpx;
                            line-height: 28rpx;  
                            right: 41rpx;                          
                        }                        
                    }
                }
                .listBoxTitleCss{
                    padding:10rpx 30rpx;  
                    font-size:34rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp:2;
                    -webkit-box-orient: vertical;
                    color: #333333;
                }
                .listBoxTimeCss{
                    padding:10rpx 30rpx; 
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-direction: row;
                    .titleText{
                        font-size: 28rpx;
                        color: #333333; 
                    }          
                    .butText{
                        font-size:30rpx;
                        color: #C30D20;
                    } 


                }
            }   
        .text{
                margin:20rpx 0;
                color:#999;
                font-size: 28rpx;
                text-align: center;
            }             
        }

    }  

    .header{
        width: 100%;
        background: #fff;
        position: fixed;
        top:0;
        left: 0;
        height:220px;
        z-index: 10;
        background: url('../../static/headerBagTwo.png') no-repeat;
        // background-size: cover;
        background-size:100% 100%; 
        .newTitle{
           text-align: center;
           margin-top: 44px;
           font-weight: 700;
        } 
        .userSrearch{
            .icons{
                position: fixed;
                top:30px;
                width: 30%;
                z-index: 1000;
                padding: 0 25rpx;
                line-height: 44px;
                height: 44px;
                display: flex;
                // background: #fff;
                align-items: center;
                &.long{
                    width: 100%;
                    box-sizing: border-box;
                }
                .search-icon-box{
                    flex:1;
                    border:1px solid #dfdfdf;
                    height: 60rpx;
                    border-radius: 30rpx;
                    padding: 0 20rpx;
                    display: flex;
                    align-items: center;
                    .icon{
                        height: 36rpx;
                        width: 36rpx;
                    }
                }
                .search-icon{
                    width: 56rpx;
                    height: 56rpx;
                    margin-right: 10rpx;
                }
                .auth-btn{
                    position: absolute;
                    opacity: 0;
                    z-index: 2;
                    width: 68rpx;
                    height: 68rpx;
                    left: 30rpx;
                    bottom:10rpx;
                }
            }            
        }
    }    

}
</style>
<style>
    .underlineYes{
        height: 6rpx;
        width: 120rpx;
        background-color: #AE0C33;
        border-radius: 6rpx;
        margin-top: 24rpx;
    }
    .underlineNo{
        height: 6rpx;
        width: 120rpx;
        background-color: #f4f4f4;
        margin-top: 24rpx;
    }
    .activeIsYes{
        font-size: 32rpx;
        font-weight: 900;
        color: #C30D20;
    }
    .activeIsNo{
        font-size: 32rpx; 
        color: #666666FF;    
    }
    /* .scrollViewHeight{ */
        /* height: calc(100vh - 680rpx); */
    /* } */
    ::-webkit-scrollbar{
        width: 0;
        height: 0;
        color: transparent;
    }  
    .leftPxs2{
        left:0;
    }      
</style>