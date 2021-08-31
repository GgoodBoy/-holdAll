<template>
	<div class="course-wrap header-nav">
		<!-- <div class="null" v-show="emptyFlag">暂无课程</div> -->
		<Header :name="'我的课程'"/>
		<div class="empty" v-show="finished&&BoughtData==''">
			<p>您还没有购买任何课程</p>
			<a @click="goHome">去发现</a>
			<!-- <img :src="img"/>
			<p>对不起！没有数据哦！</p> -->
		</div>
		<div v-if="BoughtData && BoughtData.purchasedCourseList && BoughtData.purchasedCourseList.length>0">
			<div class="title">
				<div>
					<i></i><span>已购课程</span>
				</div>
				<div>
					<router-link to="/course/list?type=alreadyBuy&courseType=1" class="c9a" >查看全部</router-link>
				</div>
			</div>
			<commonCourse v-for="(item,i) in BoughtData.purchasedCourseList"
						  :key="i"
						  :isnormal="false"
						  :courseItem="item"></commonCourse>
		</div>
		<div v-if="BoughtData && BoughtData.freeCourseList && BoughtData.freeCourseList.length>0">
			<div class="title">
				<div>
					<i></i><span>免费课程</span>
				</div>
				<div>
					<router-link to="/course/list?type=freeCourse&courseType=2" class="c9a" >查看全部</router-link>
				</div>
			</div>
			<commonCourse v-for="(item,i) in BoughtData.freeCourseList"
						  :key="i"
						  :isnormal="false"
						  :courseItem="item"></commonCourse>
		</div>
		<div v-if="assembleRecordList.length>0">
			<div class="title">
				<div>
					<i></i><span>我的拼团</span>
				</div>
				<div>
					<router-link to="/assemble/myAssembleList" class="c9a" >查看全部</router-link>
				</div>
			</div>
			<div class="list">
				<AssembleItem v-for="(item,index) in assembleRecordList" :key="index" :item="item"></AssembleItem>
			</div>
		</div>
		<div v-if="BoughtData && BoughtData.browsingHistoryList && BoughtData.browsingHistoryList.length>0">
			<div class="title">
				<div>
					<i></i><span>浏览记录</span>
				</div>
				<div>
					<router-link to="/course/list?type=browseHistory" class="c9a" >查看全部</router-link>
				</div>
			</div>
			<div>
				<ul>
					<li v-for="(item,i) in BoughtData.browsingHistoryList" :key="i" @click="goCourse(item)">
						<div class="img-wrap">
							<img class="course-img" :src="item.teacherAvatar" alt="">
							<!-- <img class="course-type" v-if="item.courseType == 1" src="./../../../static/img/common/video.png" alt=""> -->
							<!-- <img class="course-type" v-else src="./../../../static/img/common/voice.png" alt=""> -->
						</div>
						<div class="course-content">
							<p class="textEllipsis course-title">{{item.title}}</p>
							<p class="textEllipsis c9a">{{item.intro}}</p>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="card-tip-wrap" :class="receiveLearnCard?'show':''">
			<div class="box">
				<img :src="tipIcon"/>
				<p>{{tipText}}</p>
			</div>
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex'
import commonCourse from "../../components/commonCourse.vue"
import AssembleItem from '../../components/assembleItem.vue'
import noData from '@/assets/image/no_data.png'
import tipIcon from '@/assets/image/tip_icon.png'
import Header from "@/components/Header.vue";
export default {
	data(){
		return {
			isVideo:true,
			courseList:'',
			BoughtData:'',
			finished:false,
			img:noData,
			tipIcon:tipIcon,
			receiveLearnCard:false,
			tipText:'',
			assembleRecordList:[]
		}
	},
	components:{
		commonCourse,
		AssembleItem,
		Header
	},
	computed:{
		...mapState(['hasOpenApp']),
	},
	methods:{
		goHome(){
			this.$router.push("/")
		},
		onClickLeft(){
			this.$router.push("/search");
		},
		/**
		 * 获取已购模块数据
		 */
		getPurchasedPageList(){
			this.$http.post(this.$server.getPurchasedPageList,{}).then(res =>{
				this.finished = true
				if(res.data.status == 200){
					this.assembleRecordList = res.data.content.assembleRecordList||[]
					let browsingHistoryList = res.data.content.browsingHistoryList;
					let freeCourseList = res.data.content.freeCourseList;
					let purchasedCourseList = res.data.content.purchasedCourseList
					if(browsingHistoryList.length==0&&freeCourseList.length==0&&purchasedCourseList.length==0&&this.assembleRecordList.length==0){
						this.BoughtData = ''
					}else
						this.BoughtData = res.data.content;	
				}
				let receiveLearnCard = sessionStorage.getItem('receiveLearnCard')
				if(receiveLearnCard){
					sessionStorage.removeItem('receiveLearnCard')
					setTimeout(()=>{
						this.receiveLearnCard = true;
					},500)
					setTimeout(()=>{
						
						this.receiveLearnCard = false
					},3000)
					if(receiveLearnCard=='success'){
						this.tipText = '学习礼包领取成功，现在就开启学习之旅吧！'
					}else if(receiveLearnCard=='fail'){
						this.tipText = '学习卡已过期'
					}
				}
			})
		},
		goCourse(obj){
			if(obj.id){
				this.$router.push(`/course/${obj.id}`)
			}
		}
	},
	created(){
		this.getPurchasedPageList()
	},
	mounted(){
	}
}

</script>

<style lang="scss" scoped>
@keyframes yaobai{
	0%{
		transform: rotate(-15deg)
	}
	10%{
		transform: rotate(15deg)
	}
	20%{
		transform: rotate(-15deg)
	}
	30%{
		transform: rotate(15deg)
	}
	40%{
		transform: rotate(-15deg)
	}
	50%{
		transform: rotate(15deg)
	}
	60%{
		transform: rotate(-15deg)
	}
	70%{
		transform: rotate(15deg)
	}
	80%{
		transform: rotate(-15deg)
	}
	90%{
		transform: rotate(15deg)
	}
	100%{
		transform: rotate(-15deg)
	}
}
.card-tip-wrap{
	position: fixed;
	width: 80%;
	height: 30%;
	z-index: 11;
	background: rgba(223,223,223,0.8);
	text-align: center;
	top:30%;
	left: 10%;
	border-radius: 5px;
	transform: scale(0);
	transition: all 0.3s;
	&.show{
		transform: scale(1)
	}
	.box{
		transform: translate(-50%,-50%);
		top:50%;
		left: 50%;
		position: absolute;
		width: 100%;
		p{
			color:#dd1717;
			font-size: 0.28rem;
			margin-top:0.1rem;
		}
	}
	img{
		transform-origin:bottom;
		animation: yaobai 6s linear infinite;
	}
}
.empty{
	p{
		font-size: 0.28rem;
	}
	a{
		    background: #B5292F;
			color: #fff;
			border-radius: 5px;
			font-size: 0.28rem;
			padding: 0.2rem 0.6rem;
			margin-top: 0.2rem;
			line-height: 1.6rem;
	}
}
.go-back{
	width: .5rem;
	height: .5rem;
	vertical-align: middle;
}
.course-wrap{
	padding-bottom: 1rem;
}
.title{
	padding: .43rem .3rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	>div{
		display: inline-block;
	}
	i{
		display: inline-block;
		margin-right: .2rem;
		width: .08rem;
		height: .3rem;
		background-color: #B5292F;
		box-shadow: 1px 2px 6px #C52D3B;
		border-radius: .04rem;
	}
	span{
		font-size: .32rem;
		color: #1A1A1A;
	}
	p{
		font-size: .26rem;
	}
}
ul li{
	padding: .4rem .3rem;
	display: flex;
	.img-wrap{
		width: 1rem;
		height: 1rem;
		position: relative;
		.course-img{
			width: 1rem;
			height: 1rem;
			border-radius: 50%;
			overflow: hidden;
		}
		.course-type{
			width: .4rem;
			height: .4rem;
			position: absolute;
			right: 0;
			bottom: 0;
			transform: translateX(50%);
		}
	}
	.course-content{
		margin-left: .2rem;
		width: 5.5rem;
		height: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: .24rem;
		.course-title{
			font-size: .28rem;
			color: #1A1A1A;
		}
	}
}
</style>
<style lang="scss">
	.header-nav {
		.van-hairline--bottom::after{
			width: 0;
		}
		.van-nav-bar__title{
			font: normal .32rem/.88rem "";
		}
	}
	
</style>