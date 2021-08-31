<template>
    <view class="my-course-page">
        <List :loading="loading" :text="'没有更多数据了~'" :finished="finished" :height="height" @load="getList">
            <view class="list">
                <view class="item" v-for="(item,index) in list" :key="index" @tap="goCourse(item)">
                    <view class="top">
                        <image class="course-surface" :src="item.surfacePlot" webp lazy-load></image>
                        <!-- <view class="course-surface" :style="{background:`url(${item.surfacePlot}) 50% 50%/cover`}"></view> -->
                    </view>
                    <view class="bottom">
                        <text class="title">{{item.title}}</text>
                        <text class="intro">{{item.intro}}</text>
                        <view class="data">
                            <view class="tag" v-if="item.classifyNameTemp.length>0">{{item.classifyNameTemp}}</view>
                            <view class="teacher-name textEllipsis">{{item.lectureTeacherList[0].name}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </List>
    </view>
</template>
<script>
import CourseItem2 from '../../wxcomponents/CourseItem2.vue'
import List from '../../wxcomponents/MyList'
export default {
    data(){
        return{
            list:[],
            height:'auto',
            loading:false,
            finished:false,
            currentPage:1,
            pageSize:10,
            userId:1389
        }
    },
    components:{
        CourseItem2,List
    },
    created(){
        this.getList()
    },
    mounted(){
        setTimeout(()=>{
            const query = wx.createSelectorQuery()
            query.select('.component').boundingClientRect(res=>{
                if(res){
                    this.height = res.height - 10;
                }
            }).exec()
        },500)
    },
    methods:{
        getList(){
            if(this.loading) return;
            this.loading = true;
            let query = {
                userId:this.userId,
                currentPage:this.currentPage,
                pageSize:this.pageSize
            }
            this.$http.post(this.$server.getWechatPurchasedCourseList,query,{urlType:true}).then(res=>{
                this.loading = false;
                if(res.data.status==200){
                    this.list = [...this.list,...res.data.content.list]
                    this.list.forEach(item=>{
                        item.classifyNameTemp = item.classifyName&&item.classifyName.length>0?item.classifyName.substr(0,2):''
                    })
                    this.currentPage++;
                    this.finished = res.data.content.isLastPage;
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        goCourse(obj){
            uni.navigateTo({
                url: `/pages/courseDetail/index?id=${obj.id}`
            });
        }
    } 
}
</script>
<style lang="scss">
    .my-course-page{
        padding: 30rpx;
        .list{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .item{
                width: 332rpx;
                background: #fff;
                margin-top:20rpx;
                border-radius: 12rpx;
                overflow: hidden;
                &:nth-child(1),&:nth-child(2){
                    margin-top:0;
                }
                .top{
                    width: 332rpx;
                    height:186rpx;
                    position: relative;
                    .course-surface{
                        height: 100%;
                        width: 100%;
                        display: block;
                    }
                }
                .bottom{
                    height: 210rpx;
                    box-sizing: border-box  ;
                    position: relative;
                    padding: 10rpx 20rpx;
                    display: flex;
                    align-content: space-between;
                    flex-wrap:wrap;
                    .title{
                        font-size: 30rpx;
                        line-height: 42rpx;
                        color:#000;
                        width: 100%;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        font-weight: 500;
                    }
                    .intro{
                        font-size: 24rpx;
                        color:#999;
                        width: 100%;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                    }
                    .data{
                        width: 100%;
                        line-height: 48rpx;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .tag{
                            color:#C30D23;
                            font-size: 20rpx;
                            width: 60rpx;
                            line-height: 30rpx;
                            height: 30rpx;
                            margin-right: 6rpx;
                            text-align: center;
                            border-radius: 20rpx;
                            border:1px solid #C30D23;
                            box-sizing: border-box;
                        }
                        .teacher-name{
                            color:#999;
                            font-size: 26rpx;
                            flex: 1;
                        }
                    }
                }
            }
        }
    }
</style>