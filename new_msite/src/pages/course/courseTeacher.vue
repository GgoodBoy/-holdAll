<template>
	<div class="common-intor-wrap">
		<div class="teacher-box" v-if="courseData.lectureTeacherList">
			<p class="title">授课老师</p>
			<div class="teacher-content one" v-if="courseData.lectureTeacherList.length == 1">
				<div class="teacher-avatar">
					<img :src="courseData.lectureTeacherList[0].avatar"/>
				</div>
				<div class="teacher-info" :class="infoOpen?'open':''">
					<div class="s-btn" :class="infoOpen?'open':''" @click="infoOpen=!infoOpen"><van-icon name="arrow-down"/></div>
					<p class="teacher-name textEllipsis">{{courseData.lectureTeacherList[0].name}}</p>
					<p class="teacher-professional">{{courseData.lectureTeacherList[0].professionalTitle}}</p>
					<p class="teacher-introduce" v-html="courseData.lectureTeacherList[0].intro.replace(/\n/g,'<br/>')"></p>
				</div>
			</div>
			<div v-else class="teacher-content more">
				<div class="more-teacher">
					<div v-for="(item,i) in courseData.lectureTeacherList"
						:key="i"
						class="teacher-item">
						<img :src="item.avatar" alt="">
						<p class="textEllipsis">{{item.name}}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
export default {
	props:['courseData'],
	data(){
		return {
			infoOpen:false,//单个老师，老师介绍展开
		}
	},
}

</script>

<style lang="scss" scoped>
.common-intor-wrap{
	background: #F2F2F2;
	position: relative;
	.teacher-box{
		padding:0.3rem 0;
		background: #fff;
		.title{
			color:#333333;
			font-size: 0.3rem;
			line-height: 0.3rem;
			padding:0 0.18rem;
			position: relative;
			margin:0 0.3rem 0.3rem 0.3rem;
			
			&::before{
				content:'';
				display: block;
				width: 0.04rem;
				height: 0.28rem;
				background: #CC0033;
				position: absolute;
				top:0;
				left: 0;
			}
		}
		.teacher-content{
			font-size: 0;
			&.one{
				padding: 0 0.3rem;
				.teacher-avatar{
					display: inline-block;
					vertical-align: top;
					margin-right: 0.3rem;
					img{
						width: 1rem;
						height: 1rem;
						border-radius: 50%;
					}
				}
				.teacher-info{
					display: inline-block;
					vertical-align: top;
					height: 1.2rem;
					width: calc(100% - 1.36rem);
					overflow: hidden;
					position: relative;
					&.open{
						height: auto;
						overflow: auto;
						.teacher-introduce::before{
							display: none;
						}
					}
					// &::after{
					// 	content:'';
					// 	display: block;
					// 	width: 140%;
					// 	height: 1rem;
					// 	background: rgba(255,255,255,0.7);
					// 	top:1.5rem;
					// 	left: -20%;
					// 	position: absolute;
					// 	box-shadow: 0 -0.7rem 1.2rem #fffdfd;
					// 	z-index: 2;
					// 	border-radius: 30%;
					// }
					.teacher-name{
						color:#333333;
						font-size: 0.28rem;
						font-weight: bold;
					}
					.teacher-professional{
						font-size: 0.26rem;
						color:#666666;
						line-height: 0.26rem;
						height: 0.26rem;
						margin:0.16rem 0 0.1rem 0;
					}
					.teacher-introduce{
						font-size: 0.24rem;
						color:#666666;
						position: relative;
						&::before{
							content:'';
							height: 1rem;
							top:-0.6rem;
							left: 0;
							width: 100%;
							background-image:linear-gradient(-180deg,rgba(255,255,255,0),#fff);
							position: absolute;
						}
					}
					.s-btn{
						position: absolute;
						right: 0;
						top:-0.05rem;
						padding: 0.1rem;
						transition: all 0.3s;
						transform-origin: center;
						i{
							font-size: 0.24rem;
							color:#666;
						}
						&.open{
							transform: rotate(180deg);
						}
					}
				}
			}
			&.more{
				position: relative;
				height: 1.6rem;
				overflow-x: scroll;
				-webkit-overflow-scrolling: touch;
				.more-teacher{
					position: absolute;
					left: 0;
					top: 0;
					display: flex;
					padding: 0 0.3rem;
					.teacher-item{
						min-width: 1rem;
						margin-right: .4rem;
						display: block;
						text-align: center;
					}
					.teacher-list:last-child{
						margin-right: 0;
					}
					img{
						width: 1rem;
						height: 1rem;
						border-radius: 50%;
						display: inline-block;
					}
					p{
						color: #333333;
						font-size: .26rem;
						margin-top:0.1rem;
					}
				}
			}
		}
	}
}
</style>