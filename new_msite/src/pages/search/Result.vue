<template>
	<div>
		<Header :name="'搜索'"></Header>
		<van-list
                class="comment-list"
                v-model="loading"
                :finished="finished"
                @load="getCourseList"
            >
			<div v-if="list.length>0">
				<div class="result-item" v-for="(item,index) in list" :key="index">
					<div class="clearfix" @click="goCourse(item)">
						<div class="img-box" v-lazy:background-image="lazyBgImg">
							<img :src="item.surfacePlot" class="surface-plot"/>
							<img class="course-type" v-if="item.courseType == 1" :src="img1" alt="">
                			<img class="course-type" v-else :src="img2" alt="">							
						</div>
						<div class="result-info">
							<p class="course-title textEllipsis">{{item.title}}</p>
							<div class="teacher-info">
								<div class="one-teacher" style="position: relative;">
									<div class="head" :style="{'background':`url(${teacherIcon})no-repeat 50% 50% / cover`}"></div>
									<p class="name">{{item.lectureTeacherList[0].name}}</p>
									<p class="waitCss" v-if="item.lectureTeacherList.length>1?true:false">等</p>
								</div>
							</div>
							<div class="course-info">
								<p>{{item.planPeriodNum}}节</p><p>{{item.courseBrowsCount>10000?(item.courseBrowsCount/10000).toFixed(1)+'w+':item.courseBrowsCount}}人学习</p>
							</div>
						</div>
					</div>
					<div class="period-list" :class="item.periodsListFlag=='close'?'close':'open'" v-if="item.periodsList.length>0">
						<div class="period-info" v-for="(option,i) in item.periodsList" :key="i" @click="goCoursePlay(item,option)">
							<van-icon name="play-circle-o" />
							<p class="sort">第{{option.sort}}节</p>
							<p class="title textEllipsis">{{option.title}}</p>
						</div>
					</div>
					<div class="more" v-if="item.periodsList.length>1" @click="openPeriodList(item)">
						<p>{{item.periodsListFlag=='close'?'查看更多':'收起'}}</p>
						<van-icon name="arrow-down" :class="item.periodsListFlag=='close'?'close':'open'"/>
					</div>
				</div>
			</div>
			<div class="empty" v-show="list.length==0&&finished">
				<img :src="img"/>
				<p>没有找到您想要的内容~</p>
			</div>
		</van-list>	
		<div class="recommend-list" v-if="list.length==0&&finished">
			<p class="title">推荐课程</p>
			<commonCourse v-for="(item,index) in recommendList" :key="index" :courseItem="item" :isnormal="true"></commonCourse>
		</div>
	</div>
</template>
<script>
import commonCourse from "@/components/commonCourse.vue"
import img from '@/assets/image/no_content.png'
import teacherIcon from '@/assets/image/teacherImgIcon.png'
import Header from '@/components/Header.vue'
import img1 from '@/assets/image/looks.png'
import img2 from '@/assets/image/hears.png'
import img3 from '@/assets/image/lazy-bg-2.png'
import {mapActions} from 'vuex'
export default {
	data(){
		return {
			img1:img1,
			img2:img2,
			currentPage:1,
			pageSize:10,
			searchContent:'',
			loading:false,
			finished:false,
			list:[],
			tips:'',
			img:img,
			lazyBgImg:img3,
			teacherIcon:teacherIcon,
			recommendList:[]
		}
	},
	components:{
		commonCourse,Header
	},
	created(){
		this.getRecommendList()
	},
	methods:{
		...mapActions(['setSearchToast']),
		getCourseList(){
			if(!this.$route.params.keywords)return;
			let keywords = this.$route.params.keywords;
			let query = {
				currentPage:this.currentPage,
				pageSize:this.pageSize,
				searchContent:keywords
			}
			setTimeout(()=>{
				this.$http.post(this.$server.searchCourseList,query).then(res=>{
					if(res.data.status == 200){
						let temp = [...this.list,...res.data.content.list];
						let fontSize = Number(window.getComputedStyle(document.documentElement).fontSize.split("px")[0]);
						temp.forEach(item=>{
							if(item.lectureTeacherList&&item.lectureTeacherList.length>1){
								if(item.lectureTeacherList.length>10){
									item.lectureTeacherList.splice(10,item.lectureTeacherList.length-1)
								}
								item.lectureTeacherList.forEach((option,i)=>{
									let left = i*fontSize*0.5*0.6;
									option.style = {
										'left':`${left}px`,
										'zIndex':i+1,
										'visibility':'visible',
										'background':`url(${option.avatar})no-repeat 50% 50% / cover`
									}
								})
							}
							item.periodsListFlag = 'close'
						})
						this.list = temp;
                        this.currentPage++;
                        this.loading = false;
						this.finished = res.data.content.isLastPage ? true : false;
						this.tips = res.data.content.isLastPage?'没有相关课程':''
					}else {
                        this.$toast(res.data.message);
                        this.loading = false;
                        this.finished = true;
                    }
				})
			},1000)
		},
		getRecommendList(){
			let query = {
				size:3
			}
			this.$http.post(this.$server.getRecommendList,query).then(res=>{
				if(res.data.status==200){
					this.recommendList = res.data.content
				}
			})
		},
		openPeriodList(obj){
			if(obj.periodsListFlag=='close'){
				obj.periodsListFlag = 'open';
				return;
			}else{
				obj.periodsListFlag = 'close';
				return;
			}
		},
		goCourse(obj){
			this.$router.push(`/course/${obj.id}`)
		},
		goCoursePlay(courseData,periodData){
			this.setSearchToast(true)
			this.$router.push({
				path:`/course/${courseData.id}`,
				query:{
					periodId:periodData.id
				}
			})
		}
	}
}

</script>

<style lang="scss" scoped>
	.tips{
		color:#999999;
		text-align: center;
		margin:0.2rem 0;
	}
	.comment-list{
		padding: 0 0.3rem;
	}
	.result-item{
		padding: 0.4rem 0;
		border-bottom:1px solid #F4F4F4;
		.img-box{
			float: left;
			width: 3rem;
			height: 1.68rem;
			border-radius: 4px;
			background-size: 100% 100%;
			overflow: hidden;
			position: relative;
			.surface-plot{
				width: 100%;
				height: 100%;
			}
			.course-type{
				width: 0.52rem;
				height: 0.3rem;
				position: absolute;
				left: .1rem;
				bottom: .1rem;
			}
		}
		.result-info{
			float: left;
			width: calc(100% - 3rem);
			padding-left: 0.2rem;
			display: flex;
			flex-wrap: wrap;
			height:1.68rem;
			align-items:center;
			.course-title{
				color:#1A1A1A;
				font-size: 0.32rem;
				line-height:0.4rem;
				margin-top:-0.03rem;
				width: 100%;
			}
			.teacher-info{
				font-size: 0;
				width: 100%;
				.head{
					height: 0.4rem;
					width: 0.4rem;
					border-radius: 50%;
					display: inline-block;
					vertical-align: middle;
				}
				.name{
					font-size:0.28rem;
					color:#666666;
					display: inline-block;
					vertical-align: middle;
					margin-left: 0.2rem;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					max-width: 50%;					
				}
				.waitCss{
					font-size:0.28rem;
					color:#666666;
					display: inline-block;
					vertical-align: middle;
					margin-left: 0.2rem;	
					display: inline-block;
					font-size: 0.28rem;
					position: absolute;
					bottom: 0.01rem;									
				}				
				.more-teacher{
					height: 0.6rem;
					position: relative;
					.head{
						position: absolute;
						visibility: hidden;
						top:0;
					}
				}
			}
			.course-info{
				width: 100%;
				p{
					color:#9A9A9A;
					font-size: 0.24rem;
					display: inline-block;
					vertical-align: middle;
					padding: 0 0.15rem;
					position: relative;
					line-height: 0.2rem;
					&:first-child{
						padding-left: 0;
						border-right: 1px solid #999999;	
					}
				}
			}
		}
		.period-list{
			margin-top:0.4rem;
			&.close{
				height: 0.7rem;
				overflow: hidden;
			}
			&.open{
				height: auto;
				overflow: initial;
			}
		}
		.period-info{
			margin-bottom:0.4rem;
			height: 0.7rem;
			line-height: 0.7rem;
			background: #F2F2F2;
			border-radius: 4px;
			font-size: 0;
			&:last-child{
				margin:0;
			}
			i,p{
				display: inline-block;
				vertical-align: middle;
			}
			i{
				font-size: 0.48rem;
				color:#999999;
				margin: 0 0.2rem;
			}
			p{
				font-size: .28rem;
				margin-right: 0.2rem;
				&.title{
					width: 4.7rem;
				}
			}
		}
		.more{
			text-align: center;
			line-height: 0.24rem;
			margin-top:0.3rem;
			p,i{
				display: inline-block;
				vertical-align: middle;
			}
			i{
				font-size: 0.36rem;
				color:#595656;
				line-height: 0.24rem;
				&.open{
					transform: rotate(180deg)
				}
			}
			p{
				font-size: 0.24rem;
				letter-spacing: 1px;
			}
		}
	}
	.recommend-list{
		margin-top:6.5rem;
		.title{
			padding: 0 0.2rem;
			font-size: 0.32rem;
			font-weight: bold;
			line-height: 0.32rem;
			margin: 0.3rem 0;
		}
	}
	.empty{
		top:5rem!important;
	}
</style>