<template>
    <div class="course-intro" :class="show?'more':''">
        <p class="title">课程介绍</p>
		<div class="s-btn" v-if="show" :class="open?'open':''" @click="open=!open"><van-icon name="arrow-down"/></div>
        <div class="intro-box" ref="introBox" :class="open?'open':''" v-html="courseData.introduce"></div>
    </div>
</template>
<script>
export default {
	props:['courseData'],
	data(){
		return{
			open:false,
			show:false,
			timer:null
		}
	},
	mounted(){
		this.timer = setTimeout(()=>{
			this.show = this.$refs.introBox.scrollHeight>100
		},2000)
	},
	beforeDestroy(){
		clearTimeout(this.timer)
	}
}
</script>
<style lang="scss" scoped>
    .course-intro{
		padding: .3rem;
		background: #fff;
		margin-bottom: 0.1rem;
		position: relative;
		&.more{
			padding:0.3rem 0.3rem 0.6rem 0.3rem;
		}
		.s-btn{
			position: absolute;
			right: 0.36rem;
			bottom:0;
			padding: 0.1rem;
			transition: all 0.3s;
			transform-origin: center;
			font-size: 0;
			i{
				font-size: 0.24rem;
				color:#666;
			}
			&.open{
				transform: rotate(180deg);
			}
		}
		.title{
			color:#333333;
			font-size: 0.3rem;
			line-height: 0.3rem;
			padding:0 0.18rem;
			position: relative;
			margin-bottom:0.3rem;
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
		.intro-box{
			max-height: 100px;
			overflow: hidden;
			&.open{
				max-height: none;
				height: auto;
				overflow: auto;
			}
		}
	}
</style>