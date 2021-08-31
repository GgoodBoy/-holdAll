<template>
    <div class="download" v-if="isShow">
        <van-icon name="close" class="close-download" @click.native="closeDownload"/>
        <div>
            <img :src="logo" alt="">
        </div>
        <div class="keyword">
            专注优秀传统文化教育与传播
        </div>
        <a class="down-btn" v-if="isWx" :href="isIos?'https://itunes.apple.com/cn/app/id1447039784?ls=1&mt=8':'http://a.app.qq.com/o/simple.jsp?pkgname=com.xueguoxue.xgxw2018'">
            APP下载
        </a>
        <a class="down-btn" v-else  @click="openApp">
            APP下载
        </a>
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
import Logo from '@/assets/image/logo.png'
const iosDown = 'https://itunes.apple.com/cn/app/id1447039784?ls=1&mt=8'
const androidDown = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.xueguoxue.xgxw2018';
const excludePath = ['/receiveCoupon','/receiveCouponH5','/user/receiveLearnCard','/activity','/user/share']//不显示下载header
export default {
    data(){
        return {
            logo:Logo,
            isShow:false
        }
    },
    computed:{
        ...mapState(['isWx','isIos']),
    },
    created(){
            
    },
    watch:{
        $route(cur,old){
            this.judgeShow()
        }
    },
    mounted(){
        
    },
    methods:{
        ...mapActions(['setOpenAppFlag']),
        judgeShow(){
            let index = excludePath.findIndex(item=>item==this.$route.path)
            this.isShow = !index>=0;
        },
        closeDownload(){
            this.setOpenAppFlag(false)
        },
        openApp(){
            const url = this.isIos?'xueguoxuewang://':'xgx://into/index'
            window.location.href=url
            setTimeout(()=>{
                var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden
                if(typeof hidden =="undefined" || hidden ==false){
                    window.location.href = this.$server.downLoad;
                }
            }, 2500);
            // let d = new Date();
            // let t0 = d.getTime();
            // this.$toast.loading();
            // var delay = setInterval(function(){
            //     var d = new Date();
            //     var t1 = d.getTime();
            //     if( t1-t0<5000 && t1-t0>4000){
            //         window.location.href = this.isIOS?iosDown:androidDown;
            //     }
            //     if(t1-t0>=5000){
            //         clearInterval(delay);
            //     }
            // },1000);
        }
    }
}
</script>
<style lang="scss" scoped>
    .download{
        position: fixed;
        top:0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 414px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background:#f9e5e8;
		height: .98rem;
        padding: 0 .2rem;
        z-index: 100;
        .close-download{
            font-size: 0.4rem;
        }
		img{
			width: 1.7rem;
            height: .6rem;
            margin-top:0.05rem;
		}
		.keyword{
			font-size: .24rem;
			color: #3A3A3A;
		}
		.down-btn{
			width: 1.5rem;
            width: 1.2rem;
			height: .6rem;
			border-radius: .3rem;
			background: #C30D23;
			font-size: .24rem;
			color: #fff;
			text-align: center;
			line-height: .6rem;
		}
	}
</style>
