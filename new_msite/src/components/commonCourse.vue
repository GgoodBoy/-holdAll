<template>
	<div>
		<ul>
			<li @click="goCourse(courseItem.id)">
				<div class="img-wrap" v-lazy:background-image="lazyBgImg">
					<img class="course-img" :src="courseItem.surfacePlot" alt="">
					<img class="course-free" v-show="courseItem.timeLimitType==0" :src="img1" alt="">
					<img class="course-free" v-show="courseItem.timeLimitType==1" :src="img2" alt="">
					<img class="course-free" v-show="courseItem.timeLimitType==2" :src="img3" alt="">
					<img class="course-type1" v-if="courseItem.courseType == 1" :src="img4" alt="">
					<img class="course-type1" v-if="courseItem.courseType == 2" :src="img5" alt="">
					<img class="course-goosePass" v-if="courseItem.type == 1 "  :src="img6" alt="">					
				</div>
				<div class="course-content">
					<p class="course-title textEllipsis">{{courseItem.title}}</p>
					<div class="teacher-info">
						<div class="one-teacher">
							<div class="head" :style="{'background':`url(${teacherIcon})no-repeat 50% 50% / cover`}"></div>
							<p class="name">{{courseItem.lectureTeacherList[0].name}}</p>
							<p class="waitCss" v-if="courseItem.lectureTeacherList.length>1?true:false">等</p>
						</div>
						<p class="period-num">{{courseItem.planPeriodNum}}节</p>
					</div>
					<div class="course-info clearfix">
						<div class="course-rate" v-if="($route.name=='Bought'||$route.name=='CourseList')&&browseHistory!='browseHistory'">{{courseItem.progress == '0%' ? '还未学' : courseItem.progress == '100%' ? '已学完' : courseItem.progress}}</div>
						<div class="course-rate" v-else>
							<p v-if="courseItem.isVip==1">VIP</p>
							<p v-else>{{courseItem.sellingPrice==0?'免费':`${courseItem.sellingPrice}币`}}</p>
						</div>
						<p class="browscount">{{courseItem.courseBrowsCount>10000?(courseItem.courseBrowsCount/10000).toFixed(1)+'w+':courseItem.courseBrowsCount}}人学习</p>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import {mapState} from 'vuex'
import teacherIcon from '@/assets/image/teacherImgIcon.png'
import img1 from '@/assets/image/xsmf.png'
import img2 from '@/assets/image/xszk.png'
import img3 from '@/assets/image/sec_kill.png'
import img4 from '@/assets/image/looks.png'
import img5 from '@/assets/image/hears.png'
import img6 from '@/assets/image/goosePass.png'
import img7 from '@/assets/image/lazy-bg-2.png'
export default {
	props:["courseItem","isnormal"],
	data(){
		return {
			img1:img1,
			img2:img2,
			img3:img3,
			img4:img4,
			img5:img5,
			img6:img6,
			isVideo:false,
			teacherIcon:teacherIcon,
			rate:false,
			lazyBgImg:img7,
			browseHistory:''
		}
	},
	watch:{
		courseItem(cur,old){
			if(cur.lectureTeacherList&&cur.lectureTeacherList.length>1){
				if(cur.lectureTeacherList.length>10){
					cur.lectureTeacherList.splice(10,cur.lectureTeacherList.length-1)
				}
				let fontSize = Number(window.getComputedStyle(document.documentElement).fontSize.split("px")[0]);
				cur.lectureTeacherList.forEach((option,i)=>{
					let left = i*fontSize*0.5*0.6;
					option.style = {
						'left':`${left}px`,
						'zIndex':i+1,
						'visibility':'visible',
						'background':`url(${option.avatar})no-repeat 50% 50% / cover`
					}
				})
			}
		}
	},
	methods:{
		goCourse(id){
			this.$router.push(`/course/${id}`)
		}
	},
	computed:{
        ...mapState(['isVip']),
	},
	created(){
		this.browseHistory = this.$route.query.type;
		if(this.courseItem.lectureTeacherList&&this.courseItem.lectureTeacherList.length>1){
			if(this.courseItem.lectureTeacherList.length>10){
				this.courseItem.lectureTeacherList.splice(10,this.courseItem.lectureTeacherList.length-1)
			}
			let fontSize = Number(window.getComputedStyle(document.documentElement).fontSize.split("px")[0]);
			this.courseItem.lectureTeacherList.forEach((option,i)=>{
				let left = i*fontSize*0.5*0.6;
				option.style = {
					'left':`${left}px`,
					'zIndex':i+1,
					'visibility':'visible',
					'background':`url(${option.avatar})no-repeat 50% 50% / cover`
				}
			})
		}
	}
}

</script>

<style lang="scss" scoped>
ul{
	padding: 0 .2rem;
	li{
		padding: .2rem 0;
		display: flex;
		border-bottom: 1px solid #F3F3F3;
		.img-wrap{
			position: relative;
			width: 2.6rem;
			height: 1.6rem;
			border-radius: .08rem;
			overflow: hidden;
			background-size: 100% 100%;
			.course-goosePass{
				position: absolute;
				top: 0;
				right: 0;
				width: 0.65rem;
				height: 0.65rem;
			}
			.course-img{
				width: 100%;
				height: 100%;
			}
			.course-type{
				width: .5rem;
				height: .5rem;
				position: absolute;
				left: .1rem;
				bottom: .1rem;
			}
			.course-type1{
				width: 0.52rem;
				height: 0.3rem;
				position: absolute;
				left: .1rem;
				bottom: .1rem;
			}			
			.course-free{
				width: 1.2rem;
				height: .5rem;
				position: absolute;
				left: 0;
				top: 0;
			}
		}
		.course-content{
			margin-left: .2rem;
			width: calc( 100% - 2.8rem);
			display: flex;
			flex-wrap: wrap;
			height:1.6rem;
			align-items:center;
			.course-title{
				font-size: .32rem;
				color: #1A1A1A;
				line-height:0.4rem;
				width: 100%;
				margin-top:-0.03rem;
			}
			.teacher-info{
				font-size: 0;
				width: 100%;
				position: relative;
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
					max-width: 50%;
					display: inline-block;
					vertical-align: middle;
					margin-left: 0.2rem;
					font-size:0.28rem;
					color:#666666;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap; 										
				}
				.waitCss{
					font-size:0.28rem;
					color:#666666;
					display: inline-block;
					vertical-align: middle;
					margin-left: 0.2rem;					
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
				.period-num{
					position: absolute;
					right: 0;
					bottom: -0.1rem;
					font-size:0.24rem;
					color:#9A9A9A;
					line-height: 0.6rem;
				}
			}
			.course-info{
				width: 100%;
				.course-rate{
					float: left;
					p{
						font-size: 0.28rem;
						color:#C30725;
						line-height: 0.28rem;
					}
				}
				.browscount{
					float: right;
					font-size: 0.24rem;
					line-height: 0.28rem;
					color:#9A9A9A;
				}
			}
			.course-people{
				font-size: .24rem;
				line-height: .4rem;
				/* margin: .18rem 0; */
				img{
					height: .4rem;
					width: .4rem;
					margin-left: .3rem;
					vertical-align: middle;
				}
				span{
					display: inline-block;
					vertical-align: middle;
				}
				span:first-child{
					min-width: 30%;
				}
			}
			.course-rate{
				font-size: .26rem;
				color: #C30725;
			}
		}
	}
}
</style>