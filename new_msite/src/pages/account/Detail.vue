<template>
	<div>
		<van-list
                class="comment-list"
                v-model="loading"
                :finished="finished"
                @load="onLoad"
            >
			<ul>
				<li class="detail-list" v-for="(item,i) in list" :key="i">
					<div class="way">
						<p class="way-title c3a" v-show="item.paymentType==2">微信充值</p>
						<p class="way-title c3a" v-show="item.paymentType==3">支付宝充值</p>
						<p class="way-title c3a" v-show="item.paymentType==4">appStore充值</p>
						<p class="time c9a">{{item.createdAt}}</p>
					</div>
					<div class="way-num">
						{{item.commodityPrice?'+'+item.commodityPrice.toFixed(2):''}}
					</div>
				</li>
			</ul>
			<div class="empty" v-show="list.length==0&&finished">
				<img :src="img"/>
				<p>您还没有进行过充值~</p>
			</div>
			<!-- <div class="null" v-show="list.length==0&&finished">暂无记录</div> -->
		</van-list>
		
	</div>
</template>

<script>
import img from '@/assets/image/no_recharge.png'
export default {
	data(){
		return {
			loading:false,
			finished:false,
			currentPage:0,
			pageSize:10,
			list:[],
			img:img
		}
	},
	methods:{
		onLoad(){
            this.currentPage >= 1 ? this.currentPage++ : this.currentPage = 1;
            let data = {
                currentPage:this.currentPage,
                pageSize:this.pageSize,
            }
            setTimeout(() => {
                this.$http.post(this.$server.getRechargeRecords,data).then(res =>{
                    if(res.data.status == 200){
						if(res.data.content.list.length == 0){
                        	this.finished = true;
						}
						this.loading = false;
						this.list= [...this.list,...res.data.content.list];
						this.list.forEach(item=>{
							let paymentTypeStr = ''
							if(item.paymentType==2)
								paymentTypeStr = '微信充值';
							else if(item.paymentType==3){
								paymentTypeStr = '支付宝充值';
							}else if(item.paymentType==4){
								paymentTypeStr = 'apple充值';
							}		
						})
                        this.currentPage = res.data.content.pageNum;
                        this.loading = false;
                    }else {
                        this.loading = false;
                        this.finished = true;
                    }
                })
            }, 500);
		}
	}
}

</script>

<style lang="scss" scoped>
.detail-list{
	display: flex;
	justify-content:space-between;
	align-items: center;
	margin:0 .3rem;
	padding: .25rem 0;
	box-sizing: border-box;
	border-bottom: 1px solid #F3F3F3;
	.way-title{
		font: normal .26rem/.36rem "";
	}
	.time{
		font: normal .26rem/.35rem "";
	}
	.way-num{
		font-size: .3rem;
		color: #B4272D;
	}
}
</style>