<template>
	<div>
		<header>
			<div class="search">
				<form action="javascript:return true">
					<van-icon name="search" />
					<input type="search" v-model="keywords" @keydown.13="search" autofocus placeholder="请输入要搜索的内容" maxlength="6">
				</form>
			</div>
			<div class="cancel c3a" @click="$router.go(-1)">取消</div>
		</header>
		<div class="history-record" v-show="historyList.length>0">
			<div class="clearfix">
				<div class="title">搜索历史</div>
				<van-icon name="delete" class="empty-btn" @click="empty"/>
			</div>
			<div class="history-list clearfix">
				<div class="history-item" v-for="(item,index) in historyList.slice(0,10)" :key="index" @click="goViews(item)">
					<p>{{item.name}}</p>
				</div>
			</div>
		</div>
		<div class="hot-search-title">
			<div class="title">大家都在搜</div>
			<div class="loading-wrap" v-show="loading">
				<van-loading type="spinner" />
			</div>
			<ul v-show="!loading" class="clearfix">
				<li class="c9a" v-for="(item,i) in hotList" :key="i" @click="goDetail(item)">{{item.name}}</li>
			</ul>
		</div>
	</div>
</template>

<script>

export default {
	data(){
		return {
			historyList:[],
			loading:true,
			hotList:[],
			keywords:''
		}
	},
	created(){
		this.getHotWords()
		this.getHistory()
	},
	methods:{
		search(){
			let keywords = this.keywords;
			if(keywords=='')return false;
			let historyList = [...this.historyList];
			let temp = {
				name:keywords
			}
			if(historyList.length>0){
				let index = historyList.findIndex(item=>item.name==keywords);
				if(index>=0){
					historyList.splice(index,1);
				}
				historyList.unshift(temp)
			}else{
				historyList.push(temp)
			}
			window.localStorage.setItem('history',JSON.stringify(historyList))
			this.$router.push(`/search/result/${keywords}`)
		},
		/**
		 * 获取搜索记录
		 */
		getHistory(){
			let historyList = window.localStorage.getItem('history')?JSON.parse(window.localStorage.getItem('history')):[];
			this.historyList = historyList;
		},
		/**
		 * 清除一项历史记录
		 */
		emptySingle(obj){
			let historyList = [...this.historyList];
			let index = historyList.findIndex(item=>item.name==obj.name);
			historyList.splice(index,1);
			window.localStorage.setItem('history',JSON.stringify(historyList))
			this.historyList = historyList;
		},
		/**
		 * 清空所有历史记录
		 */
		empty(){
			this.$dialog.confirm({
				confirmButtonColor:"#D40015",
				message: "确定清空所有历史数据吗",
			}).then(() => {
				this.historyList = [ ]
				window.localStorage.setItem('history',JSON.stringify(this.historyList))
			}).catch(() => {

			});
		},
		/**
		 * 点击历史记录去列表页
		 */
		goViews(obj){
			let historyList = [...this.historyList];
			if(historyList.length>0){
				let index = historyList.findIndex(item=>item.name==obj.name);
				if(index>=0){
					historyList.splice(index,1);
				}
				historyList.unshift(obj)
			}else{
				historyList.push(obj)
			}
			window.localStorage.setItem('history',JSON.stringify(historyList))
			this.$router.push(`/search/result/${obj.name}`)
		},
		/**
		 * 获取搜索热词
		 */
		getHotWords(){
			this.$http.post(this.$server.getHotWordList,{}).then(res=>{
				if(res.data.status == 200){
					this.hotList = res.data.content;
					this.loading = false;
				}
			})
		},
		/**
		 * 点击去详情页并保存记录
		 */
		goDetail(obj){
			let historyList = [...this.historyList];

			if(historyList.length>0){
				let index = historyList.findIndex(item=>item.name==obj.name);
				if(index>=0){
					historyList.splice(index,1)
				}
				historyList.unshift(obj)
			}else{
				historyList.push(obj)
			}
			window.localStorage.setItem('history',JSON.stringify(historyList))
			this.$router.push(`/search/result/${obj.name}`)
		}
	}
}

</script>

<style lang="scss" scoped>
.loading-wrap{
	text-align: center;
}
.van-loading{
	display: inline-block;
}
header{
	padding: 0 0 0 .3rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.search{
		position: relative;
		i{
			position: absolute;
			font-size: 0.4rem;
			color:#9A9A9A;
			top:0.5rem;
			left: 0.2rem;
		}
		input{
			width: 6rem;
			margin: .3rem 0;
			font-size: 0.28rem;
			line-height: 0.4rem;
			padding: 0.2rem 0;
			background-color: #EDEDED;
			border-radius:12px;
			outline: none;
			border: none;
			padding-left: .7rem;
		}
		input[type="search"]{-webkit-appearance:none;}
	}
	.cancel{
		flex: 1;
		font-size: .32rem;
		text-align: center;
		color:#333;
		height: .8rem;
		line-height: .8rem;
	}
}

.history-record{
	padding: 0 0.3rem;
	.title{
		float: left;
		padding: 0 .1rem 0 .1rem;
		line-height: .32rem;
		font-size: .32rem;
		margin: 0.3rem 0.3rem 0rem 0;
		color: #333;
		border-left: 0.06rem solid #C30D23;
	}
	.empty-btn{
		font-size: .36rem;
		float: right;
		line-height: .32rem;
		color:#636060;
		margin-top:0.3rem;
	}
	.history-list{
		margin-top:0.5rem;
	}
	.history-item{
		margin:0 0.3rem 0.5rem 0;
		height: 0.6rem;
		line-height: 0.6rem;
		padding: 0 0.2rem;
		background: #F4F4F4;
		border-radius: 25px;
		float: left;
		p{
			font-size: 0.28rem;
			text-align: center;
			color:#9A9A9A;
		}
	}
}
.hot-search-title{
	.title{
		padding: 0 .1rem 0 .1rem;
		line-height: .32rem;
		font-size: .32rem;
		margin: 0.1rem 0.3rem 0rem 0.3rem;
		color: #333;
		border-left: 0.06rem solid #C30D23;
	}
	ul{
		padding: 0 .3rem;
		margin-top:0.5rem;
		li{
			font-size: 0.28rem;
			line-height: 0.28rem;
			color:#9A9A9A;
			// margin-bottom:0.5rem;
			float: left;
			// width:50%;
			margin: 0 0.2rem 0.46rem 0;
			padding: 0.2rem;
			background: #f4f4f4;
			border-radius: 0.5rem;
		}
	}
}

</style>
