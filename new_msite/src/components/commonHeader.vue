<template>
	<div class="common-header">
		<van-nav-bar
			:style="{top:hasOpenApp?'0.98rem':'0px'}"
		  	:title="headerTitle"
		  	@click-left="onClickLeft">
			<img class="go-back" src="'../assets/image/go-left.png'" alt="" slot="left">
		</van-nav-bar>
	</div>
</template>

<script>
import {mapState} from 'vuex'
export default {
	props:['headerTitle'],
	data(){
		return {

		}
	},
	computed:{
		...mapState(['hasOpenApp']),
	},
	methods:{
		onClickLeft(){
			this.$router.go(-1);
		}
	}
}

</script>

<style lang="scss" scoped>
.go-back{
	width: .5rem;
	height: .5rem;
	vertical-align: middle;
}
</style>
<style lang="scss">
	.common-header {
		// background:red;
		.van-hairline--bottom::after{
			width: 0;
		}
		.van-nav-bar__title{
			font: normal .32rem/.88rem "";
		}
		
	}
	.header-nav .van-nav-bar, .common-header .van-nav-bar{
		z-index: 20!important;
	}
</style>