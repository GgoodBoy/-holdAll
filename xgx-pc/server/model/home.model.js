const Fetch = require('../http/http')
let http = new Fetch();
const config = {
    getAppIndexConfigs:'/home/getAppIndexConfigs',
    getThemeInfo:'/aboutUs/getThemeInfo'
}
class Model{
    getHomeConfig(query){
        return new Promise((resolve,reject)=>{
            http.post(config.getAppIndexConfigs,query,(res=>{
                resolve(res)
            }))
        })
    }
    getThemeInfo(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getThemeInfo,params,(res=>{
                resolve(res)
            }))
        })
    }
}
module.exports = new Model();