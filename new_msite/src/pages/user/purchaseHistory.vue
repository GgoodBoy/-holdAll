<template>
	<div class="purchase">
		<Header :name="'购课记录'"/>
		<van-list
                class="comment-list"
                v-model="loading"
                :finished="finished"
                @load="onLoad"
            >
			<ul>
				<li v-for="(item,i) in list" :key="i" @click="goCourse(item)">
					<div class="course-info course-title">
						<div class="c3a">
							<p>{{item.commodityTitle}}</p>
							<p class="timeLimitDiscount" v-if="item.timeLimitDiscount<0">{{item.timeLimitDiscount==-1?'( 秒杀 )':'( 拼团 )'}}</p>
						</div>
						<div>{{item.commodityPrice?item.commodityPrice.toFixed(2):''}}</div>
					</div>
					<div class="course-info indent-time">
						<div class="time">{{item.createdAt}}</div>
						<div class="discount">
							<p v-if="item.couponsPrice!='0.00'">优惠券：{{item.couponsPrice}}</p>
							<p v-if="item.reducePrice>0">减价：{{item.reducePrice}}元</p>
							<p v-if="item.integralDeDuctionPrice>0">积分抵扣：{{item.integralDeDuctionPrice}}.00</p>
						</div>
					</div>
					<div class="course-info">
						<div class="indent-num">订单号：<span class="c9a">{{item.orderId}}</span></div>
						<div class="coin" >{{item.paymentTypeName}}：{{item.payPrice&&item.payPrice>0?item.payPrice.toFixed(2):0}}</div>
					</div>
				</li>
			</ul>
			<div class="empty"  v-show="list.length==0&&finished">
				<img :src="img"/>
				<p>您还没有购买过课程~</p>
			</div>
		</van-list>	
	</div>
</template>

<script>
import img from '@/assets/image/no_buy.png'
import Header from '@/components/Header.vue'
const paymentTypeArr = ['','夫子币','微信','支付宝','苹果支付','微信','华为支付','oppo支付','vivo支付','小米支付']
export default {
	data(){
		return {
			loading:false,
			finished:false,
			currentPage:0,
			pageSize:10,
			list:[],
			img:img,
		}
	},
	components:{Header},
	created(){
	
	},
	methods:{
		onLoad(){
            this.currentPage >= 1 ? this.currentPage++ : this.currentPage = 1;
            let data = {
                currentPage:this.currentPage,
                pageSize:this.pageSize,
            }
            setTimeout(() => {
                this.$http.post(this.$server.getCourseOrderList,data).then(res =>{
                    if(res.data.status == 200){
						res.data.content.list.forEach(item=>{
							item.paymentTypeName = paymentTypeArr[item.paymentType];
						})
						if(res.data.content.list.length == 0){
                        	this.finished = true;
						}
						this.loading = false;
                        this.list= [...this.list,...res.data.content.list];
                        this.currentPage = res.data.content.pageNum;
                        this.loading = false;
                    }else {
                        this.loading = false;
                        this.finished = true;
                    }
                })
            }, 500);
		},
		gofind(){
			this.$router.push('/')
		},
		goCourse(obj){
			if(obj.commodityId){
				this.$router.push(`/course/${obj.commodityId}`)
			}
		}
	}
}

</script>

<style lang="scss" scoped>
.coin,.timeLimitDiscount{
		font-size: .24rem;
		color: #D49698;
	}
ul{
	padding: 0 .3rem;
	li{
		padding: .35rem 0;
		border-bottom: 1px solid #F3F3F3;
		.course-info{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin:0.1rem 0;
			.discount{
				font-size: .24rem;
				color: #C30D20;
				p{
					line-height: 0.35rem;
					text-align: right;
					margin:0.05rem 0;
				}
			}
			.time{
				font-size: .24rem;
				color:#666;
			}
			.coin{
				font-size: .24rem;
				color:#C30D20;
			}
			.indent-num{
				font-size: .26rem;
				span{
					color:#333;
				}
			}
		}
		.course-title{
			font-size: .3rem;
			color:#C30D20;
			p{
				display: inline-block;
				vertical-align: middle;
			}
			.timeLimitDiscount{
				color:#18a418;
				font-size: 0.24rem;
			}
		}
		.indent-time{
			
		}
	}
}
.go-find{
	background: #B5292F;
	color:#fff;
	border-radius: 4px;
	padding:0.2rem 0rem;
	width: 3rem;
	display: inline-block;
	font-size: 0.28rem;
	margin-top: 1rem;
}
.course-title{
	.c3a{
		font-weight: 700;
	}
}

</style>