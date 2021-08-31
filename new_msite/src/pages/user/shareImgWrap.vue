<template>
    <div class="share-img-wrap">
        <img :src="url" :style="styles"/>
    </div>
</template>
<script>

function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
export default {
    data(){
        return {
            url:'',
            styles:{}
        }       
    },
    created(){
        this.url = getQueryString('img')
        let styles = getQueryString('styles')
        if(styles){
            this.styles = JSON.parse(styles)
        }
        this.wxshare();
    },
    methods:{
        wxshare(){
            let url = encodeURIComponent(window.location.href.split('#')[0])
            let cookie = this.$getCookie('uInfo');
			let userId = cookie ? JSON.parse(cookie).userid  : '';
			this.$http.get(`${this.$server.getWxConfig}?url=${url}&userId=${userId}`).then(res=>{
				if(res.data.status == 200){
                    let data = res.data.content;
                    let title = "免费领取【学国学网】优惠券，学习中华优秀传统文化"
                    let desc = "学国学网专注优秀传统文化教育"
                    let link = window.location.href
                    let imgUrl = "http://xgxw-pic.oss-cn-beijing.aliyuncs.com/hp/logo.png"
                    let shareInfo = getQueryString('shareInfo')
                    if(shareInfo){
                        let info = JSON.parse(shareInfo);
                        title = info.title?info.title:title;
                        desc = info.desc?info.desc:desc;
                        imgUrl = info.icon?info.icon:imgUrl
                    }
                    wx.config({
                        debug:false,
                        appId:data['appId'],
                        timestamp:data['timeStamp'],
                        nonceStr:data['nonceStr'],
                        signature:data['signature'],
                        jsApiList: [
                            'checkJsApi',
                            'updateAppMessageShareData',
                            'updateTimelineShareData',
                            'onMenuShareAppMessage',
                            'onMenuShareTimeline',
                            'onMenuShareQQ'
                        ]
                    }); 
                    wx.ready(function() {
                        wx.onMenuShareAppMessage({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                            // 用户点击了分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareTimeline({
                            title: title, // 分享标题
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            success: function () {
                            // 用户点击了分享后执行的回调函数
                            },
                        })
                        wx.onMenuShareQQ({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: link, // 分享链接
                            imgUrl: imgUrl, // 分享图标
                            success: function () {
                            // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                            // 用户取消分享后执行的回调函数
                            }
                        });
                    })
                }
            })
            return;
		}
    }
}
</script>
<style lang="scss">
    .share-img-wrap{
        padding: 0;
        margin:0;
        position: relative;
        min-height: 100vh;
        width: 100%;
        img{
            width: 100vw;
            height: 100vh;
        }
    }
</style>
