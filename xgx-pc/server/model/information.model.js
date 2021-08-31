const Fetch = require('../http/http')
let http = new Fetch();
const config = { 
    getInformationTop:'/information/getTopPage',//关于我们-->详情 
    getInformationPage:'/information/getPage',//常见问题列表  /aboutUs/getCommonProblemPage
    getInformationView:'/information/view',
    addInformationComment:'/information/view/addComment',//添加资讯评论
    getInformationCommentList:'/information/view/getCommentList',//获取资讯列表
    addInformationCommentLike:'/information/view/addCommentLike',//资讯评论点赞
}
class Model{
    getInformationTopEven(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getInformationTop,params,(res=>{
                resolve(res)
            }))
        })
    }
    getInformationPageEven(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getInformationPage,params,(res=>{
                resolve(res)
            }))
        })
    }
    getInformationViewEven(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getInformationView,params,(res=>{
                resolve(res)
            }))
        })
    }
    addInformationComment(query){
        return new Promise((resolve,reject)=>{
            http.post(config.addInformationComment,query,(res=>{
                resolve(res)
            }))
        })
    }
    getInformationCommentList(query){
        return new Promise((resolve,reject)=>{
            http.post(config.getInformationCommentList,query,(res=>{
                resolve(res)
            }))
        })
    }
    addInformationCommentLike(query){
        return new Promise((resolve,reject)=>{
            http.post(config.addInformationCommentLike,query,(res=>{
                resolve(res)
            }))
        })
    }
}
module.exports = new Model();