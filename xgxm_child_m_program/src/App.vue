<script>
    import http from './http/index'
    import serverConfig from './http/serverConfig'
    function compareVersion(v1, v2) {
		v1 = v1.split('.')
		v2 = v2.split('.')
		const len = Math.max(v1.length, v2.length)
		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}
		for (let i = 0; i < len; i++) {
			const num1 = parseInt(v1[i])
			const num2 = parseInt(v2[i])
			if (num1 > num2) {
			return 1
			} else if (num1 < num2) {
			return -1
			}
		}
		return 0
	}
    export default {
        onLaunch: function(){
            wx.getSystemInfo({
                success:(res)=>{
                    this.$scope.globalData.statusBarHeight = res.statusBarHeight;
                    this.$scope.globalData.windowHeight = res.windowHeight;
                    const version = res.SDKVersion;
                    if (compareVersion(version, '2.5.0') >= 0){
                        this.$scope.globalData.lowerVersion = false;
                    }else{
                        this.$scope.globalData.lowerVersion = true;
                    }
                }
            })
        },
        onShow:function(){ 
            wx.checkSession({
                success () {
                    let userInfo = wx.getStorageSync('userInfo')
                    if(userInfo) return;
                    let code = wx.getStorageSync('code')
                    if(!code){
                        wx.login({
                            success (res) {
                                if (res.code) {
                                    wx.setStorageSync('code',res.code)
                                } else {
                                    console.log('登录失败2！' )
                                }
                            }
                        })
                    }
                },
                fail () {
                    wx.login({
                        success (res) {
                            if (res.code) {
                                wx.setStorageSync('code',res.code)
                                // uni.navigateTo({
                                //     url: `/pages/auth/index`
                                // });
                            } else {
                                console.log('登录失败4！')
                            }
                        }
                    })
                }
            })
        },
        onHide: function() {
            
        },
        globalData:{
            statusBarHeight:20,
            windowHeight:0,
            lowerVersion:false
        }
    }
</script>
<style>
@import "/wxcomponents/vant/common/index.wxss";
</style>
<style lang="scss">
    .textEllipsis{
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        line-clamp: 1;
    }
</style>

