const Fetch = require('../http/http')
let http = new Fetch();
const config = {
    getAboutUsView:'/aboutUs/view',//关于我们-->详情
    getAboutUsProblemPage: '/aboutUs/getCommonProblemPage',//常见问题列表  /aboutUs/getCommonProblemPage
    getHandleDateList:'/aboutUs/getPage'
}
class Model{
    getAboutUsView(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getAboutUsView,params,(res=>{
                resolve(res)
            }))
        })
    }
    getAboutUsProblemPage(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getAboutUsProblemPage,params,(res=>{
                resolve(res)
            }))
        })
    }
    gethandLeListImg(params) {
        return new Promise((resolve,reject)=>{
            http.get(config.getHandleDateList,params,(res=>{
                resolve(res)
            }))
        })
    }
}
module.exports = new Model();
