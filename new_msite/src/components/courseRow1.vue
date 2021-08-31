<template>
	<div :class="className" class="one-course-item">
		<ul>
			<li @click="goCourse(data.id)">
				<div class="img-wrap" v-lazy:background-image="lazyBgImg">
					<img class="course-img" :src="data.surfacePlot" alt="">
					<img class="course-free" v-show="data.timeLimitType==0" :src="img1" alt="">
					<img class="course-free" v-show="data.timeLimitType==1" :src="img2" alt="">
					<img class="course-free" v-show="data.timeLimitType==2" :src="img3" alt="">
					<img class="course-type" v-if="data.courseType == 1" :src="looks" alt="">
					<img class="course-type" v-if="data.courseType == 2" :src="hears" alt="">
				</div>
				<div class="course-content">
					<p class="course-title textEllipsis">{{data.title}}</p>
					<p class="course-intro c9a textEllipsis">{{data.intro}}</p>
					<p class="course-people c9a"><span>{{data.courseBrowsCount>10000?(data.courseBrowsCount/10000).toFixed(1)+'w+':data.courseBrowsCount}}人看过</span><span>{{data.courseUserLikeCount}}赞</span></p>
					<p class="course-rate" v-if="data.isVip==1">VIP</p>
					<p class="course-rate" v-else>{{data.sellingPrice==0?'免费':`${data.sellingPrice}币`}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import looks from '@/assets/image/looks.png'
import hears from '@/assets/image/hears.png'
import img1 from '@/assets/image/xsmf.png'
import img2 from '@/assets/image/xszk.png'
import img3 from '@/assets/image/sec_kill.png'
import img4 from '@/assets/image/lazy-bg-2.png'
export default {
	props:["data",'className'],
	data(){
		return {
			img1:img1,
			img2:img2,
			img3:img3,
			isVideo:false,
            looks:looks,
            hears:hears,   			
			lazyBgImg:img4,
		}
	},
	methods:{
		...mapActions(['setKnowledgeIdInCourse']),
        goCourse(id){
            this.setKnowledgeIdInCourse('')
            this.$nextTick(()=>{
                this.$router.push(`/course/${id}`)
            })
        }
	},
	computed:{
        ...mapState(['isVip']),
    },
}

</script>

<style lang="scss" scoped>
.one-course-item{
	&.hasBorder{
		.img-wrap{
			border-radius: 0.1rem 0 0 0.1rem;
			border-top:1px solid #E3E3E5;
			border-left:1px solid #E3E3E5;
			border-bottom:1px solid #E3E3E5;
		}
		.course-content{
			border-top:1px solid #E3E3E5;
			border-right:1px solid #E3E3E5;
			border-bottom:1px solid #E3E3E5;
			border-radius: 0 0.1rem 0.1rem 0;
		}
	}
}

ul{
	li{
		padding: .1rem;
		display: flex;
		.img-wrap{
			position: relative;
			width: 3.45rem;
			height: 2rem;
			border-radius: .1rem;
			overflow: hidden;
			background-size: 100% 100%;
			.course-img{
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
			.course-free{
				width: 1.2rem;
				height: .5rem;
				position: absolute;
				left: 0;
				top: 0;
			}
		}
		.course-content{
			padding-left: .2rem;
			width: calc(100% - 3.45rem);
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.course-title{
				font-size: .3rem;
				color: #1A1A1A;
				width: 3rem;
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
					width: 50%;
				}
				span:first-child{
					min-width: 50%;
				}
			}
			.course-rate{
				font-size: .28rem;
				color: #C30725;
			}
		}
	}
}
</style>
