<template>
    <div class="assemble-course-bottom" v-if="courseData.isVip!=1">
        <!-- <div class="btns-area">
            <button class="original" @click="toOrder">单独购买（{{courseData.sellingPrice.toFixed(2)}}币）</button>
            <button class="assemble" @click="goPay">我要开团（{{courseData.assemblePrice.toFixed(2)}}币）</button>
        </div> -->
        <div class="btn-area">
			<div class="item zixun" @click="openCustumer">
				<i></i>
				<p>咨询</p>
			</div>
			<div class="item commen normal" @click="goComment('focus')">
				<i></i>
				<p>评论</p>
			</div>			
			<div class="item original" @click="toOrder">
				<p>原价({{parseFloat(courseData.sellingPrice)}}币)</p>
			</div>
			<div class="item assemble" @click="goPay">
				<p>拼团({{parseFloat(courseData.assemblePrice)}}币)</p>
			</div>
		</div>
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
export default {
    data(){
        return{
			isLogin:''
        }
    },
    props:['courseData','isCurrent','isCurrentTypeFocus','channelAvaliDayPrice',"buyType","assembleQuery"],
    created(){
		this.isLogin=this.$getCookie('uInfo');
    },
    mounted(){
        
    },
    computed:{
        ...mapState(['isVip'])
    },
    methods:{
		/**
		 * 去评论标签页
		 */
		goComment(type){
			if(!this.isLogin){
				sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
			}else{
				localStorage.setItem("commonButtonType","assemble");
				localStorage.setItem("updateIsCurrentType",type);
				this.$emit("update:isCurrent","comment");
				this.$emit("update:isCurrentTypeFocus",type);
			}
		},
        openCustumer(){
            window.qimoChatClick();
        },
        /**
         * 原价购买
         */
        toOrder(){
            let uInfo = this.$getCookie('uInfo');
			if(!uInfo){
                sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
			}else{
                let params = {
                    courseId:this.courseData.id
                }
                this.$http.post(this.$server.verifyUserAssemble,params).then(res=>{
                    if(res.data.status==200){
                        if(res.data.content.isJoin==0){
							this.$emit('update:channelAvaliDayPrice',parseFloat(this.courseData.sellingPrice))	
							this.$emit('update:buyType','0')
							localStorage.setItem('aboutCourse',this.$route.path)
							this.$router.push(`/course/order/${this.$route.params.courseId}`) 
                        }else if(res.data.content.isJoin==1){
                            this.$toast('您已参加过该团购')
                        }
                    }    
                })
            }
        },
        /**
         * 去开团
         */
        goPay(){
            let uInfo = this.$getCookie('uInfo');
			if(!uInfo){
                sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
            }else{
                let params = {
                    courseId:this.courseData.id
                }
                this.$http.post(this.$server.verifyUserAssemble,params).then(res=>{
                    if(res.data.status==200){
                        if(res.data.content.isJoin==0){
							this.$emit('update:channelAvaliDayPrice',parseFloat(this.courseData.assemblePrice))
                            localStorage.setItem('aboutCourse',this.$route.path)
                            let query = {
                                buyType:2,
                                assembleType:1,
                                assembleId:this.courseData.assembleCourseId,
                                assemblePrice:this.courseData.assemblePrice
							}
							this.$emit('update:buyType','2')
							this.$emit('update:assembleQuery',JSON.stringify(query))
                            this.$router.push({path:`/course/order/${this.$route.params.courseId}`,query:query})
                        }else if(res.data.content.isJoin==1){
                            this.$toast('您已参加过该团购')
                        }
                    }    
                })
            }
        }
        
    }
}
</script>
<style lang="scss" scoped>
    .assemble-course-bottom{
        position: fixed;
        bottom:0;
        left: 50%;
        z-index: 15;
        height: 1rem;
        width: 100%;
        background: #fff;
        border-top:1px solid #f5eded;
		max-width: 414px;
        transform: translateX(-50%);
        // .btns-area{
        //     display: flex;
        //     align-items: center;
        //     justify-content:space-between;
        //     margin:0.16rem 0;
        //     button{
        //         outline: none;
        //         border-radius: 25px;
        //         width: 3.3rem;
        //         height: 0.68rem;
        //         line-height: 0.68rem;
        //         text-align: center;
        //         font-size: 0.32rem;
        //         &.original{
        //             border:1px solid #AA2E2E;
        //             color:#AA2E2E;
        //             background: #fff;
        //             box-shadow:1px 2px 9px 0px rgba(197,197,197,0.46);
        //             &:active{
        //                 background: #f8f5f5;
        //             }
        //         }
        //         &.assemble{
        //             border:1px solid #AA2E2E;
        //             color:#fff;
        //             background: #AA2E2E;
        //             box-shadow:0px 2px 9px 0px rgba(166,52,51,0.46);
        //             &:active{
        //                background: #8b1b1f; 
        //             }
        //         }
        //     }
        // }
        .btn-area{
			height:1rem;
			line-height: 1rem;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			&.can-learn{
				background: #f4f4f4;
				border:1px solid rgba(204,204,204,1);
				border-radius:10px
			}
			.item{
				text-align: center;
				height: 100%;
				font-size: 0;
			}
			.zixun{
				width: 1.4rem;
				// flex:1;
				border-right: none;
				&.normal{
					border-right: 1px solid #333333;
				}
				&:active{
					background: #f4f4f4;
				}
				i{
					display: inline-block;
					vertical-align: middle;
					width: 0.48rem;
					height: 0.48rem;
					background: url('../../assets/customer-service.png')no-repeat 50% 50% /cover;
					margin-right: 0.1rem;
				}
				p{
					display: inline-block;
					vertical-align: middle;
					color:#333;
					font-size: 0.32rem;
					line-height: 0.36rem;
					height: 0.36rem;
				}
			}
			.commen:before{
				content: "";   
				display: block;   
				width: 0.02rem;   
				height: 0.6rem; 
				background: rgb(238, 235, 235);
				position: absolute;
				top: 0.2rem;
				left: 0rem;
			}			
			.commen{
				// flex:1;
				position: relative;
				width: 1.4rem;
				padding: 0 0 0 0.1rem;
				border-right: none;
				border-top:1px solid #f2f2f2;
				&.normal{
					// border-right: 1px solid #dfdfdf;
					text-align: left;
					// padding:  0 0.6rem;
				}
				&:active{
					background: #f4f4f4;
				}
				i{
					display: inline-block;
					vertical-align: middle;
					width: 0.48rem;
					height: 0.48rem;
					background: url('../../../static/img/course/n-short.png')no-repeat 50% 50% /cover;
					margin-right: 0.1rem;
				}
				p{
					display: inline-block;
					vertical-align: middle;
					color:#333;
					font-size: 0.32rem;
					line-height: 0.36rem;
					height: 0.36rem;
				}				
			}		
			.original:before{
				content: "";   
				display: block;   
				width: 0.02rem;   
				height: 0.6rem; 
				background: rgb(238, 235, 235);
				position: absolute;
				top: 0.2rem;
				left: 0rem;
			}				
			.original{
				position: relative;
				flex: 1;
				&:active{
					background: #f4f4f4;
				}
				p{
					color:#333;
					font-size: 0.32rem;
					line-height: 1rem;
					height: 1rem;
				}
			}
			.assemble{
				flex: 1;
				border-radius: 0.7rem;
				height: 0.7rem;
				line-height: 0.7rem;				
				background: #CC0033;
				border:1px solid #CC0033;
				&.normal{
					width: 50%;
				}
				&:active{
					background: #d92f37;
				}
				p{
					color:#fff;
					font-size: 0.32rem;
				}
			}
			.comment,.praise,.share{
				flex: 1;
				font-size: 0;
				i{
					height: 0.36rem;
					width: 0.36rem;
					display: inline-block;
					vertical-align: middle;
					margin-right: 0.06rem;
				}
				p{
					display: inline-block;
					vertical-align: middle;
					color:#333;
					font-size: 0.24rem;
					line-height: 0.36rem;
					height: 0.36rem;
				}
			}
			.comment{
				i{
					background:url('../../assets/course_comment.png')no-repeat 50% 50% /cover;
				}
			}
			.praise{
				i{
					background:url('../../assets/praise.png')no-repeat 50% 50% /cover;
				}
				&.praised{
					i{
						background:url('../../assets/course-like.png')no-repeat 50% 50% /cover;
					}
				}
			}
			.share i{
				background:url('../../assets/course_bottom_share.png')no-repeat 50% 50% /cover;
			}
		}
    }
</style>
