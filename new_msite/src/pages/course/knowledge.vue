<template>
    <div class="knowledge-wrap" v-if="knowledgeList.length>0">
        <p class="title">课程知识点</p>
        <div class="knowledge-box">
            <div class="scroll-box">
                <div class="list">
                    <div class="item" v-for="(item,index) in knowledgeList" :key="index" @click="playKnowledge(item)">
                        <img :src="item.videoImage"/>
                        <div class="player-btn-icon" v-show="item.videoId!=knowledgeIdInCourse">
                            <van-icon name="play" />
                        </div>
                        <p class="textEllipsis name">{{item.videoName}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
export default {
    data(){
        return {
            knowledgeList:[]
        }
    },
    inject:['reload'],
    props:['courseData','currentPeriodId'],
	computed:{
		...mapState(['knowledgeIdInCourse']),
    },
    created(){
        this.getCourseShortVideoList()
    },
    methods:{
        ...mapActions(['setAudioData','setKnowledgeIdInCourse']),
		/**
		 * 获取短视频列表
		 */
		getCourseShortVideoList(){
			let query = {
				courseId:this.courseData.id
			}
			this.$http.post(this.$server.getCourseShortVideoList,query).then(res=>{
				if(res.data.status==200){
					this.knowledgeList = res.data.content;
				}
			})
		},
		playKnowledge(obj){
			this.$emit("update:currentPeriodId",-3)
			setTimeout(()=>{
				this.setKnowledgeIdInCourse(obj.videoId)
			},1)
			// this.$nextTick(()=>{
			// 	this.reload()
			// })
		}
    }
}
</script>
<style lang="scss" scoped>
    .knowledge-wrap{
		padding: .3rem 0;
		background: #fff;
		margin:0.1rem 0;
		.title{
			color:#333333;
			font-size: 0.3rem;
			line-height: 0.3rem;
			padding:0 0.18rem;
			position: relative;
			margin:0 0.3rem 0.32rem;
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
		.knowledge-box{
			overflow: hidden;
			height: 0.9rem;
			.scroll-box{
				overflow-x:scroll;
				overflow-y:hidden;
				-webkit-overflow-scrolling: touch;
				position: relative;
				height: 1.2rem;
			}
			.list{
				display: flex;
				height: 0.9rem;
				position: absolute;
				top:0;
				left: 0;
				padding: 0 0.3rem;
				.item{
					width: 1.6rem;
					height: 0.9rem;
					position: relative;
					margin-right:0.16rem;
					text-align: center;
					font-size: 0;
					&:last-child{
						margin-right: 0;
					}
					img{
						position: absolute;
						top:0;
						left: 0;
						width: 100%;
						height: 100%;
						z-index: 1;
					}
					.player-btn-icon{
						background: rgba(0,0,0,.3);
						border-radius: 50%;
						width: 0.36rem;
						height: 0.36rem;
						margin-top:0.14rem;
						display: inline-block;
						position: relative;
						z-index: 2;
						i{
							font-size: 0.28rem;
							color:#fff;
							margin-top:0.04rem;
						}
					}
					.name{
						background: rgba(0,0,0,0.6);
						color:#fff;
						line-height: 0.3rem;
						font-size: 0.2rem;
						text-align: center;
						position: absolute;
						bottom: 0;
						left: 0;
						z-index: 2;
						width: 100%;
						padding: 0 0.04rem;
					}
				}
			}
		}
	}
</style>