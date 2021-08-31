import http from './http/index'
import serverConfig from './http/serverConfig'

const login = (data,from)=>{
    wx.checkSession({
        success:()=>{
            wx.showLoading({
                mask:true
            })
            let code = wx.getStorageSync('code');
            let query = {
                code:code,
                origin:14,
                encryptedData:data.encryptedData,
                iv:data.iv,
                type:2
            }
            http.post(serverConfig.loginWeChatGetUserInfo,query).then(resp=>{
                wx.hideLoading()
                if(resp.data.status==200){
                    wx.setStorageSync('userInfo', JSON.stringify(resp.data.content));
                    console.log('JSON.stringify(resp.data.content)',JSON.stringify(resp.data.content));
                    if(from&&from.length>0){
                        wx.setStorageSync('from',from)
                    }
                    wx.navigateBack()
                }else{
                    if(resp.data.message=='请上传微信CODE'){
                        wx.login({
                            success (res) {
                                if (res.code) {
                                    wx.setStorageSync('code',res.code)
                                    wx.showToast({
                                        title:'登录失败，请重新登录',
                                        icon:'none',
                                        mask:true,
                                        duration:3000
                                    })
                                } else {
                                    console.log('登录失败！' + res.errMsg)
                                }
                            }
                        })
                    }else{
                        wx.showToast({
                            title:resp.data.message,
                            icon:'none',
                            mask:true,
                            duration:3000
                        })
                    }
                }
            }).catch(()=>{
                wx.showToast({
                    title:'登录失败，请重新登录',
                    icon:'none',
                    mask:true,
                    duration:3000
                })
            })
        },
        fail:()=>{
            console.log('登录态过期')
        }
    })
}
export default login