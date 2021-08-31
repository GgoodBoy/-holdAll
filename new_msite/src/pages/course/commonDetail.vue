<template>
	<div class="comment-detail-next" :style="{top:hasOpenApp?'0.98rem':'0px'}">
        <div class="titleIcom">
            <van-icon name="cross" class="van-icon-close" @click="closeCommentDetail"/>
            <p>评论详情</p>
        </div>
        <div class="commentListBox" :style="{height:hasOpenApp?'calc(100vh - 2.8rem)':'calc(100vh - 1.8rem)'}">
            <div class="comment-redBtq-box" >
                <div class="comment-item">
                    <div class="user-com-info">
                        <div class="user-avator">
                            <img :src="commentDetailInfo.commentUserAvatar" alt="">
                        </div>
                    </div>
                    <div class="comment-content">
                        <p class="user-name textEllipsis">{{commentDetailInfo.commentUserName}}</p>
                        <p class="comment-time">{{commentDetailInfo.createdAt}}</p>
                        <p class="content"><img v-if="detailTitleimg" :src='detailTitleimg'/>{{commentDetailInfo.content}}</p>
                    </div>
                    <div class="select-behavior-like" @click="setCommonReport(commentDetailInfo,'recommendList')" v-if="commentDetailInfo.commentStatus!=1">
                        <i></i>
                    </div>                
                    <!-- <div class="comment-error-like" v-if="commentDetailInfo.commentStatus==3">
                        <i></i>
                        <span class="c9a">很遗憾该条评论未通过审核。</span>
                    </div>	 -->
                    <div class="comment-error-like" v-if="commentDetailInfo.prohibitedFlag==1">
                        <i></i>
                        <span class="c9a">该条评论含有违禁词汇，违禁部分已隐藏。</span>
                    </div>  
                    <div v-if="commentDetailInfo.commentStatus==2" class="comment-like">
                        <div class="icon-like iconShare" @click="replyUserComment('propsData')">
                            <i></i>
                            <span class="c9a">{{commentDetailInfo.replyNum}}</span>
                        </div>                    
                        <div class="icon-like iconLike" @click="setComentPoint(commentDetailInfo.id,'',commentDetailInfo.thumbsUpPeriodFlag,'recommendList')">
                            <i :class="commentDetailInfo.thumbsUpPeriodFlag?'praised':''"></i>
                            <span class="c9a">{{commentDetailInfo.praisePoint}}</span>
                        </div>
                    </div>					                  
                </div>   			          
            </div>
            <van-list
                class="comment-list"
                v-model="loading"
                :finished="finished"
                @load="onLoad"
            > 
                <div class="comment-item" v-for="(item,i) in courseCommentsList" :key="i">
                    <div class="user-com-info">
                        <div class="user-avator">
                            <img :src="item.commentUserAvatar" alt="">
                        </div>
                    </div>
                    <div class="comment-content">
                        <p class="user-name textEllipsis">{{item.commentUserName}}</p>
                        <p class="comment-time">{{item.createdAt}}</p>
                        <p class="content"><span v-if="item.replyUserName&&item.replyUserName.length>0">回复{{item.replyUserName}}</span>: {{item.content}}</p>
                    </div>
                    <div class="select-behavior-like" @click="setCommonReport(item,'commentList')" v-if="item.commentStatus!=1">
                        <i></i>
                    </div>          
                    <div class="comment-error-like" v-if="item.commentStatus==3">
                        <i></i>
                        <span class="c9a">很遗憾该条评论未通过审核。</span>
                    </div>	
                    <div class="comment-error-like" v-if="item.prohibitedFlag==1">
                        <i></i>
                        <span class="c9a">该条评论含有违禁词汇，违禁部分已隐藏。</span>
                    </div>					      
                    <div v-if="item.commentStatus==2" class="comment-like">
                        <div class="icon-like iconShare" @click="replyUserComment('listData',item)">
                            <i></i>
                            <span>回复</span>
                        </div>                    
                        <div class="icon-like iconLike" @click="setComentPoint(item.id,i,item.thumbsUpPeriodFlag,'commentList')">
                            <i :class="item.thumbsUpPeriodFlag?'praised':''"></i>
                            <span class="c9a">{{item.praisePoint}}</span>
                        </div>
                    </div>
                </div>
                <!-- <p class="noDatalist" v-show="!courseCommentsList.length" >还没有人评论，快来发表你的意见。</p>
                <p class="noDatalist" v-show="finished&&courseCommentsList.length>0">已经全部加载完毕</p> -->
				<p class="download" @click="goApp">下载学国学网APP发表你的评论</p>
			</van-list>
        </div>
        <div class="comment-area">
            <div class="shade" v-show="shadeFlag" @click="close"></div>
            <div class="comment-input-area" ref="commentArea">
                <div class="comment-box" :style="{padding:(!heightFocus)?'0.1rem':'0.5rem 0 0.1rem 0'}">
                    <div class="textareaCopyCss" v-if="!heightFocus" @click="focusEventNext()">回复楼主~</div>
                    <!-- <textarea v-show="heightFocus" type="textarea" ref="commentInput" v-model="commentContent" :style="{height:heightFocus?'3.75rem':'0.7rem'}" class="comment-input" maxlength="200" placeholder="说点什么～" @focus="focusEvent($event)" @blur="blurEvent"></textarea> -->
                    <textarea v-show="heightFocus" type="textarea" ref="commentInput" v-model="commentContent" class="comment-input" maxlength="500" placeholder="说点什么～" @focus="focusEvent($event)" @blur="blurEvent"></textarea>
					<div class="numWordcss">{{commentContent.length}}/500</div>
                    <div class="comment-send" @click="sendComment" v-show="heightFocus">
                        发表
                    </div>
                    <div class="comment-remove" @click="sendCommentRemove" v-show="heightFocus">
                        取消
                    </div>                    
                </div>
            </div>
        </div>
        <van-dialog
            v-model="deleteShow"
            class="common-remove-dialog"
            :show-cancel-button="false"
            :show-confirm-button="false"
            >
            <div class="dialogContent">删除该评论</div>
            <div class="dialogButBox">
                <div @click="confirmEven('remove')">确定</div>
                <div @click="cancelEven('remove')">取消</div>
            </div>
        </van-dialog>
        <van-dialog
            v-model="errorShow"
            class="common-error-dialog"
            :show-cancel-button="false"
            :show-confirm-button="false"
            >
            <div class="dialogimgBox">
				<img :src="img1"/>
				<p class="p1">评论发表失败</p>
				<p class="p2">该条评论含有如下违禁词汇</p>
				<p class="p3">{{prohibitWord}}</p>
				<p class="p4" @click="errorShow=false">返回重新编辑</p>				
            </div>
        </van-dialog>		
        <van-popup
        v-model="vanPopupShow"
        closeable
        class="comment-popup"
        position="bottom"
        :style="{ height: heightPopupStyle }"
        >	
        <!-- :style="{ height: '3.75rem' }" -->
            <div class="behaviorBox">
                    <ul class="behaviorContent">
                        <li v-if="vanPopupListShow" @click="reporteven(1)">垃圾广告</li>
                        <li v-if="vanPopupListShow" @click="reporteven(2)">低俗色情</li>
                        <li v-if="vanPopupListShow" @click="reporteven(3)">人身攻击</li>
                        <li v-if="vanPopupListShow" @click="reporteven(4)">其他有害</li>
                        <li v-if="vanPopupDeliteShow" @click="reporteven(5)"><img :src="img2"></li>
                    </ul>				
            </div>		
        </van-popup>			
	</div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import img1 from '../../assets/image/n-error.png'
import img2 from '../../assets/image/n-remove.png'
import essence from '../../assets/image/n-essence.png';
import recommend from '../../assets/image/n-recommend.png';
export default {
	props:['courseData',"dataItem"],
	data(){
		return {
			img1:img1,
			img2:img2,
			loading:false,
			finished:false,
			currentPage:1,
			pageSize:10,
			total:-1,
			courseCommentsList:[],
			commentContent:'',
			timer:null,
			focusFlag:false,
			// quickFlag:false,
			shadeFlag:false,
			// quickWords:['老师讲的很好','讲解专业','太好了，正是我想要的','长知识了','已下单，支持一下','值得推荐','赞'],
			deleteShow:false, //删除弹框
			errorShow:false,//评论发表失败
			vanPopupShow:false, //举报下滑弹框
			vanPopupListShow:true,//举报弹框内容的的实现隐藏
			vanPopupDeliteShow:true,//举报弹框删除的实现隐藏
			heightPopupStyle:'3.75rem',//举报下滑弹框高度设置；
			selectData:'',//选中的评论；
			userId:'',//用户id
			courseSelectType:'',//推荐，精华，普通评论的选中类型
            prohibitWord:'',//违禁词展示
            commentDetailInfo:'',//评论详情对象；
            essence:essence, //图标精华
            recommend:recommend,//图标推荐
            detailTitleimg:'',//图片绑定字段,
            heightFocus:false, //输入框的高度
            
		}
	},
	computed:{
		...mapState(['audioData','isVip','hasOpenApp','videoShowHideStore']),
	},
	watch:{
		focusFlag(cur,old){
			if(cur){
				this.shadeFlag = true;
			}else{
				setTimeout(()=>{
					this.shadeFlag = false;
				},1)
			}
		}
	},
	created(){
		let cookie = this.$getCookie('uInfo');
        this.userId = cookie ? JSON.parse(cookie).userid  : '';		
        this.commentDetailInfo = this.dataItem.data;
        switch (this.dataItem.type) {
            case 'recommendList':
                this.detailTitleimg = this.recommend;
                break;
            case 'essenceList':
                this.detailTitleimg = this.essence;
                break;
            case 'commentList':
                this.detailTitleimg = '';
                break;                        
            default:
                break;
        } 
	},
	mounted(){
		window.addEventListener('scroll', ()=>{
			let dom = document.querySelector('.second-introduce');
			if(!dom) return;
			if(this.focusFlag){
				dom.style.display = 'none';
				dom.style.opacity = '0';
			}else{
				dom.style.display = 'block';
				dom.style.opacity = '1';
			}
		});
	},
	methods:{
		...mapActions(['setAudioData','setCourseShowheaders','setheightVideoStore','setVideShowHideStoreData','setDownLoadFlag']),
		//举报删除滑动框
		setCommonReport(data,type){
			this.vanPopupShow=true;
			this.courseSelectType=type;
			this.selectData=data;
			if(data.commentStatus==2){
				this.vanPopupListShow = true;
				this.vanPopupDeliteShow=false;
				this.heightPopupStyle='3rem'
			}else if(data.commentStatus==3){
				this.vanPopupDeliteShow=true;
				this.vanPopupListShow = false;
				this.heightPopupStyle='0.75rem'
			}
			
		},
		/**
		 * 举报事件
		 */
		reporteven(num){
			this.vanPopupShow = false;
			this.setDownLoadFlag(true);
			return;		
			if(num!=5){
				let data = {
					commentId:this.selectData.id,
					userId:this.userId,
					reportType:num
				};		
				this.$http.post(this.$server.commentReportComment,data).then(res =>{
					if(res.data.status == 200){
						this.vanPopupShow = false;
						this.$toast({
							message:`我们已收到您的举报，会尽快处理！ 感谢您对学国学网的支持`
						})
					}
				})
			}else{
				this.vanPopupShow = false;
				setTimeout(()=>{
					this.deleteShow = true;
				});
			}
		},
		//删除评论
		reportevenDel(){
			let data = {
				commentId:this.selectData.id,
				userId:this.userId
			};		
			this.$http.post(this.$server.commentDel,data).then(res =>{
				if(res.data.status == 200){
					this.deleteShow = false;
					this.dbjListFilter();
				}
			})
		},
		//删除后对应的列表的列表过滤;
		dbjListFilter(){
			var newList =[];
			var ids = this.selectData.id;
			function removespliceEven(data){
				return ids!=data.id;
			}			
			switch (this.courseSelectType) {
				case "commentList":
					newList = this.courseCommentsList.filter(removespliceEven);
					this.courseCommentsList = newList;
					this.total =this.total-1;					
					break;								
				default:
					break;
			}
		},
		//下拉加载
		onLoad() {
			this.getCommentList();
		},
		//删除弹框事件
		confirmEven(type){
			switch (type) {
				case 'remove':
					this.reportevenDel();
					break;
			
				default:
					break;
			}
		},
		cancelEven(type){
			switch (type) {
				case 'remove':
					this.deleteShow = false;
					break;
			
				default:
					break;
			}
        },
        //点击评论
        focusEventNext(){
			this.setDownLoadFlag(true);
			return;
            if(this.userId){
                this.heightFocus = true;
                setTimeout(()=>{
                    this.$refs.commentInput.focus();
                },100); 
            }else{
	            sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
				return;                
            }
        },
        //获取焦点
		focusEvent(e){
			this.focusFlag = true;
            this.shadeFlag = true;
            document.body.scrollTop=document.body.scrollHeight;
            this.heightFocus = true;
		},
		blurEvent(){
            this.focusFlag = false;
            this.heightFocus = false;
			let dom = document.querySelector('.second-introduce');
			if(!dom) return;
			dom.style.display = 'block';
            dom.style.opacity = '1';
		},
		close(){
			document.activeElement.blur();
			// this.quickFlag = false;
			this.shadeFlag = false;
        },
        replyUserComment(type,data){
			this.setDownLoadFlag(true);
			return;
			if(this.userId){
				if(type=='listData'){
					this.selectData=data;
				}else{
					this.selectData='';
				}
				this.heightFocus = true;
				setTimeout(()=>{
					this.$refs.commentInput.focus();
				},100);
			}else{
	            sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
				return; 
			} 
        },
		/**
		 * 下拉刷新
		 */
		onRefresh(){
			this.getCommentList()
		},	
		/**
		 * 获取课程评论
		 */
		getCommentList(num){
			if(num>0){
				this.currentPage=num;
			}
			if(num==1){
				this.courseCommentsList =[];
			}            
			// if(this.total>-1){
			// 	let temp = Math.ceil(this.total/this.pageSize) 
			// 	if(temp==this.currentPage){
			// 		this.loading = false;
			// 		this.finished = true;
			// 		return false;
			// 	}
            // }	
            let data ={};

            if(this.userId){
                data = {
                    userId:this.userId,
                    commentId:this.commentDetailInfo.id,
                    pageNo:this.currentPage,
                    pageSize:this.pageSize
                }
            }else{
               data = {
                    commentId:this.commentDetailInfo.id,
                    pageNo:this.currentPage,
                    pageSize:this.pageSize
                }
            }
            this.$http.post(this.$server.commentFindCommentInfoPage,data).then(res =>{
				if(res.data.status == 200){
					this.loading = false;
					this.courseCommentsList= [...this.courseCommentsList,...res.data.content.list];
					this.currentPage++;
					this.total = res.data.content.total;
					this.finished = res.data.content.isLastPage ?true : false;
				}else {
					this.loading = false;
					this.finished = true;
				}
			})
		},
		/**
		 * 评论点赞
		 */
		setComentPoint(commentId,index,thumbsUpPeriodFlag,type){
			this.setDownLoadFlag(true);
			return;
			let login = this.$getCookie('uInfo');
			if(!login){
				sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
				return;
			}
			if(!thumbsUpPeriodFlag){ //0:未点赞，1:已点赞
				this.$http.post(this.$server.setComentPoint,{
					commentId:commentId
				}).then(res =>{
					if(res.data.status == 200){
						switch (type) {
							case "commentList":
								this.courseCommentsList[index].thumbsUpPeriodFlag = true;
								this.courseCommentsList[index].praisePoint++;					
								break;	
							case "recommendList":
								this.commentDetailInfo.thumbsUpPeriodFlag=true;		
								this.commentDetailInfo.praisePoint++;		
								break;															
							default:
								break;
						}
					}
				})
			}else {
				this.$toast("您已点赞，不能重复点赞")
			}
		},
		/*
		发送评论接口触发
		*/
		sendAjaxCommment(){
            var parems ='';            
            if(this.selectData){
                parems = {
                    /*
                        userId 必须 用户id	
                        content	必须 评论内容	
                        courseId 必须 课程id	
                        commentType	必须 评论类型 1评论2回复	
                        parentId 非必须 父评论ID	
                        atUserId 非必须 被回复者用户ID				
                    */
                    userId:this.userId,
                    commentType:2,
                    courseId:this.courseData.id,
                    content:this.commentContent,
                    parentId:this.commentDetailInfo.id,
                    atUserId:this.selectData.userId
                };
            }else{
                parems = {
                    userId:this.userId,
                    commentType:2,
                    courseId:this.courseData.id,
                    content:this.commentContent,
                    parentId:this.commentDetailInfo.id,
                    atUserId:this.dataItem.data.id
                };                
            }

			this.$http.post(this.$server.commentSendComment,parems).then(res =>{
				if(res.data.status == 200){
					// this.$toast("评论成功")
					// let uInfo  = JSON.parse(this.$getCookie('uInfo'));
					// let data = {
					// 	commentUserName:uInfo.nickname,
					// 	commentUserAvatar:uInfo.avatar,
					// 	content:this.commentContent,
					// 	createdAt:this.$utils.timeFormDate(new Date(),'date','flag'),
					// 	thumbsUpPeriodFlag:0,
					// 	id:res.data.content.courseCommentId,
					// 	commentRepliesList:[],
                    //     praisePoint:0,
                    //     replyUserName:this.dataItem.data.commentUserName,//被回复者
                    //     commentStatus:1 //审核中
					// }
					// this.commentContent = ''
                    // this.courseCommentsList.splice(0,0,data);
					document.activeElement.blur();
					this.commentContent = '';
					this.heightFocus = false;
					this.quickWordsType = false;
					this.shadeFlag = false;
					window.scrollTo(0,0);                    
					if(res.data.content.totalNum&&res.data.content.totalNum>0){
						this.$rewardPointsToast({
							points:res.data.content.totalNum
						})
					}
                    this.getCommentList(1);	
					this.$nextTick(()=>{
						window.scrollTo(0,300);
					});
					
				}
			})
        },
        //关闭当前详情
        closeCommentDetail(){
			this.setCourseShowheaders(true);
            this.$emit("commentEmit");
            if(this.videoShowHideStore){
                this.setheightVideoStore(1);
            }else{
                this.setVideShowHideStoreData(true);
            }          
        },
        //取消发表
        sendCommentRemove(){
             this.$refs.commentInput.blur(); 
        },
		/**
		 * 发送评论
		 */
		sendComment(){
			if(this.commentContent.length==0){
				this.$toast('请输入评论内容')
				return false;
			}
			//违禁词的验证
            this.$http.post(this.$server.commentVerifyProhibitedWord,{content:this.commentContent}).then(res =>{
				if(res.data.status == 200){
					if(!(res.data.content&&res.data.content.length>0)){
						this.sendAjaxCommment();
					}else{
						this.prohibitWord = res.data.content;
						this.errorShow = true;
					}
				}
			});
		},
		goApp(){
			window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`
		}
	}
}
</script>
<style lang="scss" scoped>
.comment-detail-next{
    position: fixed;
    bottom: 0;
    left: 50%;
    z-index: 15;
	padding: .3rem 0.3rem 1.1rem 0.3rem;
	background: #fff;
	width:100%;
	max-width: 414px;
	transform: translateX(-50%);
    .titleIcom{
        display: -webkit-inline-box;
        .van-icon-close{
            font-size: .5rem;
        }
        p{
            width: 6rem;
            font-size: 0.36rem;
            font-weight: 700;
            text-align: center;            
        }
    }
	.common-remove-dialog{
		width: 6rem !important;
		.dialogContent{
			width: 100%;
			text-align: center;
			line-height: 1.5rem;
		}
		.dialogButBox{
			width: 4.68rem;
			height: 0.6rem;
			margin: 0 0 0.25rem 0;
			display:-webkit-inline-box;
			margin-left: 0.6rem;
			div{
				width: 2rem;
				height: 100%;
				line-height: 0.6rem;
				text-align: center;
			}
			div:nth-child(1){
				background: #CC0033;
				color: #fff;
				border-radius: 0.6rem;
			}
			div:nth-child(2){
				background: #fff;
				color: #CC0033;
				margin-left: 0.6rem;
				border-radius: 0.6rem;
				border:0.02rem solid #CC0033;
			}			
		}
	}
	.common-error-dialog{
		.dialogimgBox{
			margin: 0 0 0.4rem 0;
			img{
				display: block;
				width: 1.03rem;
				height: 0.98rem;
				margin: 0.6rem auto 0.2rem auto;
			}
			p{
				width: 100%;
				text-align: center;
			}
			.p1{
				color: #333333;
				font-size: 0.4rem;
			}
			.p2{
				color: #333333;
				font-size: 0.28rem;
				margin-top: 0.4rem;
			}
			.p3{
				color: #C30D23;
				font-size: 0.3rem;
				margin-top: 0.1rem;
			}	
			.p4{
				color: #C30D23;
				font-size: 0.3rem;
				margin-top: 0.1rem;
				text-decoration:underline;
			}		
		}
	}

	.comment-list{
		.new-comment-list{
			font-size: 0.3rem;
			height: 0.3rem;
			line-height: 0.3rem;
			font-weight: 500;
			border-left: 0.06rem solid #CC0033;
			padding: 0 0.4rem;
			margin: 0.6rem 0;
			color: #333333;
		}
		.comment-item{
			.comment-like{
				.iconShare{
					i{
						background: url('../../assets/image/n-keyboard.png')no-repeat 50% 50% / cover;
					}                
				}            
			}            
		}        
	}
    .commentListBox{
        position: relative;
        overflow-y: auto;
    }
	.comment-redBtq-box{
		.comment-item{
			.comment-content{
				.content{
					img{
						width: 0.78rem;
						height: 0.35rem;
						margin-right: 0.1rem;
					}
				}
			}
			.comment-like{
				.iconShare{
					i{
						background: url('../../assets/image/n-short.png')no-repeat 50% 50% / cover;
					}                
				}            
			}            
		}
	}
	.comment-list,.comment-redBtq-box {
		.comment-item{
			position: relative;
			font-size: 0;
			padding-bottom: 0.2rem;
			margin-top: 0.3rem;
			border-bottom: 0.02rem solid #F4F4F4;
			.user-com-info{
				display: inline-block;
				vertical-align: top;
			}
			.user-avator{
				font-size: 0;
				width: .6rem;
				height: .6rem;            
				img{
					width: .6rem;
					height: .6rem;
					border-radius: .1rem;
					overflow: hidden;
					display: inline-block;
					vertical-align: middle;
					// margin-right: .2rem;s
				}
			}
			.comment-content{
				display: inline-block;
				vertical-align: top;
				width: calc(100% - 0.7rem);
				margin-left: 0.1rem;
				.user-name{
					font-size: 0.3rem;
					line-height: 0.3rem;
					color:#333333;
					font-weight: 700;
					// margin-top:-0.05rem;
				}
				.comment-time{
					font-size: 0.24rem;
					color:#999999;
					line-height: 0.24rem;
					margin:0.1rem 0;
				}
				.content{
					font-size: 0.28rem;
					color:#333333;
					line-height: 0.48rem;
					margin-bottom:0.3rem;
					margin-top:-0.1rem;
					word-break:break-all; 
					padding: 0.1rem 0.4rem 0 0;
				}
			}
			.select-behavior-like{
				position: absolute;
				right: 0.1rem;
				top:0;
				z-index: 1;
				i{
					display: inline-block;
					width: .3rem;
					height: .3rem;
					vertical-align: middle;
					background: url('../../assets/image/n-ellipsisIcon.png')no-repeat 50% 50% / cover;
				}           
			}
			.comment-like{
				overflow: auto;
				.icon-like{
					float: right;
					margin-left: 0.4rem;
					i{
						display: inline-block;
						width: .4rem;
						height: .4rem;
						vertical-align: middle;
					}
					span{
						display: inline-block;
						vertical-align: bottom;
						font-size: .3rem;
						color:#999999;
						margin-left: 0.05rem;
					}
				}
				.iconLike{
					i{
						background: url('../../assets/image/praise.png')no-repeat 50% 50% / cover;
						&.praised{
							background: url('../../assets/image/course-like.png')no-repeat 50% 50% / cover;
						}
					}
				}            
			}
			.comment-error-like{
				padding: 0 0 0.1rem 0.6rem;
				i{
					display: inline-block;
					width: .48rem;
					height: .42rem;
					vertical-align: middle;
					background: url('../../assets/image/n-warry.png')no-repeat 50% 50% / cover;
				}
				span{
					display: inline-block;
					vertical-align: bottom;
					width: 5.36rem;
					line-height: 0.43rem;
					border-radius: 0.06rem;
					font-size: .24rem;
					background: #E18691;
					color:#fff;
					margin-left: 0.05rem;
					padding: 0 0.2rem;
				}			
			}
		}
        .noDatalist{
			width: 100%;
			line-height: 0.7rem;
			color: #333333;
			text-align: center;
		}
		.download{
			font-size: 0.3rem;
			color:#333;
			margin:0.4rem 0;
			text-align: center;
			text-decoration: underline;
		}
	}
	.comment-area{
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 0;
		background: #fff;
		z-index: 13;
		.comment-input-area{
			background-color: rgba(255, 255, 255, 1);
			box-shadow: 0 -1px 0 rgba(250, 250, 250, .2);
			position: relative;
			z-index: 1002;
			padding: .1rem .2rem .1rem .3rem;
		}
		.shade{
			position: fixed;
			top:0;
			left: 0;
			height: 100vh;
			width: 100%;
			z-index: 1000;
			background: rgba(0,0,0,0.65);
		}
		// .comment-box{
		// 	display: flex;
		// 	justify-content: space-between;
		// 	align-items: center;
		// 	position: relative;
		// 	z-index: 1001;
        //     .textareaCopyCss{
        //         width: 6.9rem;
        //         line-height: .7rem;
        //         background: #f2f2f2;
        //         padding: 0 0.3rem;
        //         border-radius: 0.7rem;
        //     }
        //     .comment-input{
        //         width: 4.5rem;
        //         // height: .7rem;
        //         line-height: .7rem;
        //         border-radius:5px;
        //         background:rgba(244,244,244,1);
        //         font-size:0.28rem;
        //         padding:0 .25rem;
        //         border: none;
        //         margin:0 0.33rem 0 1.26rem;
        //     }
        //     .comment-send{
        //         font-size: .32rem;
        //         width: 1.36rem;
        //         height: .7rem;
        //         text-align: center;
        //         line-height: .7rem;
        //         color: #d92f37;
        //         position: absolute;
        //         top: 0;
        //         right: 0;
        //     } 
        //     .comment-remove{
		// 		font-size: .32rem;
		// 		width: 1.36rem;
		// 		height: .7rem;
		// 		line-height: .7rem;
		// 		color: #666666;
		// 		position: absolute;
		// 		top: 0;
		// 		left: 0;
		// 		text-align: center;                
        //     }                       
		// }
        .comment-box{
			position: relative;
            .textareaCopyCss{
                width: 6.9rem;
                line-height: .7rem;
                background: #f2f2f2;
                padding: 0 0.3rem;
                border-radius: 0.7rem;
            }            
			.comment-input{
				max-height: 1.4rem;
				width: 100%;
				margin: 0.2rem 0;
				border-radius: 0.1rem;
				background: #f4f4f4;
				border: 0;
				padding: 0.1rem;				
			}	
			.comment-send{
				font-size: .32rem;
				width: 1.36rem;
				height: .7rem;
				line-height: .7rem;
				color: #d92f37;
				position: absolute;
				top: 0;
				right: 0;
				text-align: center;				
			}     
            .comment-remove{
				font-size: .32rem;
				width: 1.36rem;
				height: .7rem;
				line-height: .7rem;
				color: #666666;
				position: absolute;
				top: 0;
				left: 0;
				text-align: center;                
            }       
			.numWordcss{
				position: absolute;
				right: 0rem;
    			top: 1.6rem;
			}
        }
		.edit{
			font-size: 0.48rem;
			position: absolute;
			top:0.45rem;
			left: 0.4rem;
			color:#999;
		}
	}
.comment-popup{
	.behaviorBox{
		.titleImg{
			width: 100%;
			height: 0.8rem;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.behaviorContent{
			li{
				width: 100%;
				height: 0.75rem;
				background: #fff;
				color: #333333;
				text-align: center;
				line-height: 0.75rem;
				font-size: 0.28rem;
			}
			li:not(:first-child){
				border-top:0.02rem solid #f4f4f4;
			}
			li:last-child{
				img{
					width: 100%;
					height: 100%;
					}
				}
			}
		}
	}
}
</style>