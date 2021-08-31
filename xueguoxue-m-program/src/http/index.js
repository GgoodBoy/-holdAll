// let baseUrl = process.env.NODE_ENV === 'development' ? 'http://172.16.120.6:8764' : 'http://172.16.120.6:8764'
// let baseUrl = process.env.NODE_ENV === 'development' ? 'https://appletapi.xueguoxue.com' : 'https://appletapi.xueguoxue.com'
// let baseUrl = process.env.NODE_ENV === 'development'?'https://appletapi.youfushuyuan.com':'https://appletapi.xueguoxue.com'
let showModalFlag = false;
function requestApi(method, path, data, config) {
    let baseUrl = '';
    if (config && config.urlType) {
      baseUrl = process.env.NODE_ENV === 'development' ? 'https://courseapi.youfushuyuan.com' : 'https://courseapi.xueguoxue.com';
    } else { 
      baseUrl = process.env.NODE_ENV === 'development' ? 'https://appletapi.youfushuyuan.com' : 'https://appletapi.xueguoxue.com';  
    }  
    let userInfo = wx.getStorageSync('userInfo')//youfushuyuan
    return new Promise((resolve, reject) => {
      if (userInfo) {
        data.userId = JSON.parse(userInfo).userId;
      }
      uni.request({
        url: baseUrl+path,
        data: data,
        method:method,
        header: {
          'token':userInfo?JSON.parse(userInfo).token:'',
          // 'content-Type': 'application/json;charset=utf-8'
          'Content-Type': 'application/json;charset=utf-8'
        }||config.header,  
        success: function (res) {
          resolve(res)
        },
        fail: function (res) {
          reject(res);
          if(!showModalFlag){
            showModalFlag = true;
            setTimeout(()=>{
              wx.showModal({
                title:'提示',
                content:'网络异常,请检查手机网络状态',
                showCancel:false,
                success:()=>{
                  showModalFlag = false;
                }
              })
            },300)
          }
        },
        complete: function () {
        }
      })
    })
  }
  export default {
    get(path,data,config = null){
      return requestApi('GET',path,data,config)
    },
    post(path,data,config = null){
      return requestApi('POST',path,data,config)
    }
  }