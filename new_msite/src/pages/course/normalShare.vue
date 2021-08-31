<template>
    <div class="normal-share-wrap" @click.stop="test">
        <div class="type-list">
            <input class="copy-target" id="input" :value="link" readonly/>
            <div v-if="support" @click="shareTo('wechatFriend')">
                <img :src="wxIcon" alt="">
                <p>微信</p>
            </div>
            <div class="wechatTimeline" v-if="support" @click="shareTo('wechatTimeline')">
                <img :src="wxCircleIcon" alt="">
                <p>朋友圈</p>
            </div>
            <div @click="shareTo('qqFriend')">
                <img :src="qqIcon" alt="">
                <p>QQ</p>
            </div>
            <div @click="shareTo('weibo')">
                <img :src="weiboIcon" alt="">
                <p>微博</p>
            </div>
            <div class="copy-link"  ref="copyBtn" data-clipboard-action="copy" :data-clipboard-target="`#input`" @click="copy">
                <img :src="copyIcon" alt=""/>
                <p>复制链接</p>
            </div>
        </div>
        <div class="cancel" @click="hideShare">
            <p>取消分享</p>
        </div>
    </div>
</template>
<script>
import Clipboard from 'clipboard'
import img1 from '@/assets/image/wechat.png'
import img2 from '@/assets/image/wechat-circle.png'
import img3 from '@/assets/image/qq.png'
import img4 from '@/assets/image/weibo.png'
import img5 from '@/assets/image/copy.png'
import {mapState,mapActions} from 'vuex'
export default {
    data(){
        return{
            wxIcon:img1,
            wxCircleIcon:img2,
            qqIcon:img3,
            weiboIcon:img4,
            copyIcon:img5,
            nativeShare:'',
			support:'',
			link:'',
            clipboard:null,
        }
    },
    props:['shareFlag'],
    computed:{
		...mapState(['shareType','courseShareData','periodShareData','isSetCommission','cooperativePlatformsData']),
	},
    created(){
		this.nativeShare = new NativeShare()
		this.browserSupport()
        this.link = window.location.href;
    },
    mounted(){
        if(this.$refs.copyBtn)
            this.clipboard = new Clipboard(this.$refs.copyBtn);
	},
    methods:{
        test(){

        },
        copy(){
			let clipboard = this.clipboard;
            clipboard.on('success',()=>{
                this.$toast('复制成功,快去分享给好友吧')
            });
            clipboard.on('error',()=>{
                this.$toast('该浏览器不支持自动复制，请手动复制页面链接');
            });
        },
        /**
		 * 浏览器是否支持微信、朋友圈分享
		 */
		browserSupport(){
			let UA = navigator.appVersion;
			let uc = UA.split('UCBrowser/').length > 1 ? 1 : 0;
			let qq = UA.split('MQQBrowser/').length > 1 ? 2 : 0;
			let wx = /micromessenger/i.test(UA);
			if(uc||qq||wx){
				this.support = true;
			}else{
				this.support = false;
			}
        },
        shareTo(command){
            this.$toast.loading({
                mask: false,
                loadingType:'spinner'
            });
			let query = {
                courseId:this.courseShareData.courseId
            }
			this.$http.post(this.$server.getCourseState,query).then(res=>{
				if(res.data.status == 200){
					let shareData = {
                        title:this.courseShareData.teacherName+":"+this.courseShareData.title,
                        desc:this.courseShareData.introduce,
                        link:this.link,
                        icon:this.courseShareData.surfacePlot,
                        success:()=>{
                            let query = {type:5}
                            this.$http.post(this.$server.addIntegral,query).then(res=>{

                            })
                        },
                        fail:()=>{
                            this.$toast('当前浏览器不支持分享！')
                        }
                    }
					this.nativeShare.setShareData(shareData)
					try {
						let query = {type:5}
                        this.$http.post(this.$server.addIntegral,query).then(res=>{

                        })
						this.nativeShare.call(command)
					} catch(err) {

					}
				}
			})
        },
        hideShare(){
            this.$emit('update:shareFlag',false)
        }			
    }
}
</script>
<style lang="scss" scoped>
    .normal-share-wrap{
        height: 100vh;
        background: rgba(0, 0, 0, .6);
        position: fixed;
        left: 50%;
        bottom: 0;
        width: 100%;
        z-index: 1000;
        max-width: 414px;
        transform: translateX(-50%);
        #input{
            position: absolute;
            left: 0;
            top:0;
            opacity: 0;
            z-index: -1;
        }
        .type-list{
            width: 100%;
            height: 3rem;
            background-color: rgba(255, 255, 255, 1);
            position: absolute;
            left: 0;
            bottom: 1rem;
            display: flex;
            justify-content: space-around;
            padding: 0 .6rem;
            align-items: center;
            text-align: center;
            >div{
                width: 0.7rem;
                &.wechatTimeline{
                    width: 0.9rem;
                }
            }
            .copy-link p{
                width: 1.4rem;
                margin-left: -0.35rem;
            }
            img{
                width: .7rem;
                height: .7rem;
            }
            p{
                margin-top: .15rem;
                color: #9A9A9A;
                font-size: .26rem;
            }
        }
        .cancel{
			height: 1.1rem;
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 1.1rem;
			background-color: #fff;
			text-align: center;
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			border-top:1px solid #e9e9e9;
			font-size: 0.32rem;
			letter-spacing: 1px;
			color:#ccc;
			p{
				background: #B4272D;
				width:2.4rem;
				height: 0.7rem;
				line-height: 0.7rem;
				border-radius: 25px;
				color:#fff;
			}
		}
    }
</style>