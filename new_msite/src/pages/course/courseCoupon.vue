<template>
	<div class="course-coupon" :class="{'show':showCourseCoupon}">
        <div class="unused" v-if="finished">  
            <div class="item" v-for="(item,index) in list" :key="index" :class="item.couponType != 2 ?'all-reduction':'money-off'" @click="chioceItem($event,item)">
                <div class="coupon-container">
                    <div class="price" :class="item.couponType!=3?'status0':''">{{item.reducedPrice}}<span>元</span></div>
                    <div class="info" :class="item.couponType!=3?'status0':''">
                        <p class="coupon-type" v-if="item.couponType==2">满{{item.couponsMinAmount}}减{{item.reducedPrice}}元券</p>
                        <p class="coupon-type" v-else>无门槛优惠券</p>
                        <p class="coupon-time" v-show="item.couponType==3">{{item.beginAtStr}}-{{item.endAtStr}}</p>
                        <p class="card-number">{{item.couponCode}}</p>
                    </div>
                    <i class="chioce-item active" v-if="couponId==item.id" ></i>
                    <i class="chioce-item" v-else></i>
                    <transition name="switchShade">
                        <div class="coupon-shade-wrap" v-show="item.flag==true">
                            <div class="coupon-shade"></div>
                            <div class="coupon-shade-box">{{item.useCourseTitle}}</div>
                        </div>     
                    </transition>
                </div>
                <div class="coupon-explain clearfix" v-if="item.couponType==3">
                    <p class="coupon-course textEllipsis" @click="textShow($event,index)">{{item.useCourseTitle}}</p>
                </div>
                <div class="coupon-explain clearfix" v-else>
                    <p class="coupon-course">有效期：{{item.beginAtStr}}-{{item.endAtStr}}</p>
                </div>
            </div>
        </div>
		<!-- <div v-else class="null" ><van-loading type="spinner" /></div> -->
	</div>
</template>

<script>
import {mapState} from 'vuex'
export default {
	props:["couponId" , "showCourseCoupon","courseId","couponPrice"],
	data(){
		return {
            loading:false,
			finished:false,
			currentPage:0,
			pageSize:10,
            list:[]
		}
    },
    computed:{
		...mapState(['hasOpenApp']),
	},
    created(){
        this.getUserCouponsListForBuyCourse()
    },
	methods:{
        textShow(e,index){
            return;
            if(e.target.scrollWidth<=e.target.offsetWidth)return false;
            this.list[index].flag = !this.list[index].flag;
            e.stopPropagation();
        },
		onClickLeft(){
			this.$emit("update:showCourseCoupon" , false);
		},
		chioceItem(e,item){
            if(item.id == this.couponId){
                this.$emit("update:couponId" ,'');
                this.$emit("update:couponPrice",0)
            }else{
                this.$emit("update:couponId" , item.id);
                this.$emit("update:couponPrice",item.reducedPrice)
            }
			// this.$emit("update:showCourseCoupon" , false);
        },
        getUserCouponsListForBuyCourse(){
            if(!this.courseId) return;
            let query = {
                courseId:this.courseId
            }
            this.$http.post(this.$server.getUserCouponsListForBuyCourse,query).then(res=>{
                if(res.data.status == 200){
                    this.finished = true;
                    let arr = [...res.data.content]
                    arr.forEach(item=>{
                        item.beginAtStr = item.beginAtStr.replace(/\-/g,'.')
                        item.endAtStr = item.endAtStr.replace(/\-/g,'.')
                        item.flag = false;
                    })
                    this.list = arr;
                }
            })
        },
	}
}

</script>

<style lang="scss" scoped>
.course-coupon{
    overflow-x: scroll;
    position: relative;
    height: 2.5rem;
    margin:-0.5rem 0;
    visibility: hidden;
    opacity: 0;
    &.show{
        visibility:visible;
        opacity: 1;
        transition: visibility 1ms ease 0.3s,opacity 0.3s ease 1ms;
    }
    .price{
        padding-top:0.48rem!important;
        &.status0{
             padding-top:0.78rem!important;
        }
    }
}
.van-loading{
    display: inline-block
}
.go-back{
	width: .5rem;
	height: .5rem;
	vertical-align: middle;
}
.main {
    margin-top: .2rem;
    background: RGBA(255, 255, 255, 1);
    height: 100%;
    flex: 1;
    padding: 0 .3rem;
    padding-bottom: .2rem;
}

.unused{
    position: absolute;
    top:0;
    left: 0;
    display: flex;
    transform: scale(0.5);
    height: 2.5rem;
    transform-origin: left;                                                               
}
.item {
    border-radius: .1rem; 
    position: relative;
    float: left;
    width: 6.7rem;
    margin-right: 0.3rem;
    &.money-off {
        background: RGBA(219, 110, 110, 1) url('../../assets/image/unused-1.png') no-repeat top left 100%/100%;
    }
    &.all-reduction {
        background: RGBA(209, 149, 86, 1) url('../../assets/image/unused-2.png') no-repeat top left 100%/100%;
    }
    .coupon-container {
        height: 1.8rem;
        display: flex;
        position: relative;
        overflow: hidden;
        border-radius:4px 4px 0 0;
        .price {
            height: 100%;
            padding-top: .88rem;
            align-self: center;
            padding-left: .3rem;
            width: 2.1rem;
            font-size:.6rem;
            color: RGBA(255, 255, 255, 1);
            span:last-child {
                font-size: .36rem;
                margin-left: .1rem;
                vertical-align: middle;
            }
        }
        .info {
            font-size:.24rem;
            color:rgba(255,255,255,1);
            margin-left: .1rem;
            padding: 0.25rem 0;
            &.status0{
                padding: 0.5rem 0;
                p{line-height: 0.54rem}
            }
            p{
                line-height: 0.44rem
            }
        }
        .choose-icon{
            position:absolute;
            top:0;
            right: 0;
            width: 0.9rem;
        }
        .coupon-type {
            // margin-top: .53rem;
        }
        .time {
            font-size: .26rem;
            margin-top: .25rem;
        }

        .card-number {
            // margin-top: .32rem;
        }
    }
    .coupon-explain {
        min-height: .7rem;
        word-break: break-all;
        font-size:.26rem;
        padding: 0 .26rem;
        color: #ffffff;
        border-radius: 0 0 .1rem .1rem;
        p {
            line-height:.38rem;
            margin: .16rem 0;
        }
    }
    
}
.chioce-item{
	position: absolute;
	right: -.02rem;
	top: 0;
	background: url('../../assets/image/no-choice-coupon.png') no-repeat center center;
	background-size: 100% 100%;
	width: .92rem;
	height: .92rem;
    &.active{
        background: url('../../assets/image/choice-coupon.png') no-repeat center center;
	    background-size: 100% 100%;
    }
}
.coupon-shade-wrap{
        position: absolute;
        top:0;
        left: 0;
        z-index: 10;
        width:100%;
        height: 100%;
        border-radius:4px 4px 0 0;
        overflow: hidden;
        .coupon-shade{
            position: absolute;
            top:0;
            left: 0;
            z-index: 11;
            width:100%;
            height: 100%;
            background: #323232;
            opacity: 0.7;
            border-radius:4px 4px 0 0;
            // background-image:-webkit-gradient(
            //     linear,//表示渐变的为直线 另外一个值是radial
            //     50% 0,//直线型渐变的起点位置 后边有一个属性background-size规定背景的大小，30 X 15px  50% 0 都是乘以父元素的宽高。 
            //     0 100%,//结束点的位置 和上类似
            //     from(transparent),//起点的颜色
            //     color-stop(.5,transparent), //中间某一个点必须达到这个颜色，表示变化过程  .5b表示这个渐变范围长度的总长的50%
            //     color-stop(.5,#d86707),//同上
            //     to(#d86707)),//结束段的颜色
            //     //一个背景块的分为两个15X 15  组成。

            //     -webkit-gradient(linear,50% 0,100% 100%,from(transparent), 
            //     color-stop(.5,transparent),
            //     color-stop(.5,#d86707),
            //     to(#d86707));
            //     background-size:10px 6px;
            //     background-repeat:repeat-x;
            //     background-position:0 100%; 
            }
        .coupon-shade-box{
            position: absolute;
            top:0;
            left: 0;
            z-index: 12;
            width:100%;
            height: 100%;
            padding: 0.25rem;
            color:#fff;
            font-size: 0.26rem;
            line-height: 0.52rem;
        }
    }
    .switchShade-enter-active, .switchShade-leave-active {
        transition:all 0.3s;
    }
    .switchShade-enter, .switchShade-leave-to /* .fade-leave-active below version 2.1.8 */ { 
        transform: translateY(-100%)
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