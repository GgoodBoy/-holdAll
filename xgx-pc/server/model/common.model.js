const Fetch = require('../http/http')
let http = new Fetch();
const config = {
    getImgCode:'/common/getImgCode',//获取图形验证码
    verifyImgCode:'/common/verifyImgCode',//验证图形验证码
    getSmsCode:'/common/getSmsCode',//获取短信验证码
    verifySmsCode:'/common/verifySmsCode',//验证短信验证码
    uploadForOSS:'/common/uploadForOSS',//上传图片到OSS
    getHotWordList:'/common/getHotWordList',//查询热门搜索词列表创 
}
class Model{
    getImgCode(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getImgCode,params,(res=>{
                resolve(res)
            }))
        })
    }
    verifyImgCode(query){
        return new Promise((resolve,reject)=>{
            http.post(config.verifyImgCode,query,(res=>{
                resolve(res)
            }))
        })
    }
    getSmsCode(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getSmsCode,params,(res=>{
                resolve(res)
            }))
        })
    }
    verifySmsCode(query){
        return new Promise((resolve,reject)=>{
            http.post(config.verifySmsCode,query,(res=>{
                resolve(res)
            }))
        })
    }
    uploadForOSS(query){
        return new Promise((resolve,reject)=>{
            http.post(config.uploadForOSS,query,(res=>{
                resolve(res)
            }))
        })
    }
    getHotWordList(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getHotWordList,params,(res=>{
                resolve(res)
            }))
        })
    }
}
module.exports = new Model();