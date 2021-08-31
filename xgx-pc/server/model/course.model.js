const Fetch = require('../http/http')
let http = new Fetch();
const config = {
    search:'/pcCourse/search',//搜索课程
    getclassifyList:'/pcCourse/getclassifyList',//获取课程分类列表
    getCourseListByClassify:'/pcCourse/getCourseListByClassify',//根据课程分类查询课程列表
    getInfo:'/pcCourse/getInfo',//查询课程详情
    getPeriodList:'/pcCourse/getPeriodList',//根据课程id查询课时目录
    getEssenceCommentList:'/pcCourse/getEssenceCommentList',//根据课程id查询精华评论列表
    getCommenList:'/pcCourse/getCommenList',//根据课程id查询评论列表
    getRelationList:'/pcCourse/getRelationList',//根据课程id关联课程列表
    getResourcesUrl:'/pcCourse/getResourcesUrl',//获取播放地址
    getPeriodInfo:'/pcCourse/getPeriodInfo',//获取课时详情
    getAvailableList:'/pcCourse/getAvailableList',//买课程页面查询可用优惠券列表
    buy:'/pcCourse/buy',//购买课程
    getBuyOrderState:'/pcCourse/getBuyOrderState',//查询微信支付购买课程订单状态创 
    saveLearningProgress:'/pcCourse/saveLearningProgress',//保存学习进度
    saveStudyBehavior:'/pcCourse/saveStudyBehavior',
    getHotList:'/pcCourse/getHotList',//获取热门课程
    getClassifyListByParentId:'/classify/getClassifyListByParentId',
    verifyProhibitedWord:'/comment/verifyProhibitedWord',
    searchCourseList:'/doubleEleven/searchCourseList',
    getCouponInfo:'/doubleEleven/getCouponInfo',
    receiveCoupon:'/doubleEleven/receiveCoupon'
}
class Model{
    search(params){
        return new Promise((resolve,reject)=>{
            http.get(config.search,params,(res=>{
                resolve(res)
            }))
        })
    }
    getclassifyList(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getclassifyList,params,(res=>{
                resolve(res)
            }))
        })
    }
    getCourseListByClassify(params,id){
        return new Promise((resolve,reject)=>{
            http.get(`${config.getCourseListByClassify}/${id}`,params,(res=>{
                resolve(res)
            }))
        })
    }
    getInfo(params,id){
        return new Promise((resolve,reject)=>{
            http.get(`${config.getInfo}/${id}`,params,(res=>{
                resolve(res)
            }))
        })
    }
    getPeriodList(params,id){
        return new Promise((resolve,reject)=>{
            http.get(`${config.getPeriodList}/${id}`,params,(res=>{
                resolve(res)
            }))
        })
    }
    getEssenceCommentList(params,id){
        return new Promise((resolve,reject)=>{
            http.get(`${config.getEssenceCommentList}/${id}`,params,(res=>{
                resolve(res)
            }))
        })
    }
    getCommenList(params,id){
        return new Promise((resolve,reject)=>{
            http.get(`${config.getCommenList}/${id}`,params,(res=>{
                resolve(res)
            }))
        })
    }
    getRelationList(params,id){
        return new Promise((resolve,reject)=>{
            http.get(`${config.getRelationList}/${id}`,params,(res=>{
                resolve(res)
            }))
        })
    }
    getResourcesUrl(params,id){
        return new Promise((resolve,reject)=>{
            http.get(`${config.getResourcesUrl}/${id}`,params,(res=>{
                resolve(res)
            }))
        })
    }
    getPeriodInfo(params,id){
        return new Promise((resolve,reject)=>{
            http.get(`${config.getPeriodInfo}/${id}`,params,(res=>{
                resolve(res)
            }))
        })
    }
    getAvailableList(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getAvailableList,params,(res=>{
                resolve(res)
            }))
        })
    }
    buy(query){
        return new Promise((resolve,reject)=>{
            http.post(config.buy,query,(res=>{
                resolve(res)
            }))
        })
    }
    getBuyOrderState(params,id){
        return new Promise((resolve,reject)=>{
            http.get(`${config.getBuyOrderState}/${id}`,params,(res=>{
                resolve(res)
            }))
        })
    }
    saveLearningProgress(query){
        return new Promise((resolve,reject)=>{
            http.post(config.saveLearningProgress,query,(res=>{
                resolve(res)
            }))
        })
    }
    saveStudyBehavior(query){
        return new Promise((resolve,reject)=>{
            http.post(config.saveStudyBehavior,query,(res=>{
                resolve(res)
            }))
        })
    }
    getHotList(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getHotList,params,(res=>{
                resolve(res)
            }))
        })
    }
    getClassifyListByParentId(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getClassifyListByParentId,params,(res=>{
                resolve(res)
            }))
        })
    }
    verifyProhibitedWord(query){
        return new Promise((resolve,reject)=>{
            http.post(config.verifyProhibitedWord,query,(res=>{
                resolve(res)
            }))
        })
    }
    searchCourseList(query){
        return new Promise((resolve,reject)=>{
            http.post(config.searchCourseList,query,(res=>{
                resolve(res)
            }))
        })
    }
    getCouponInfo(query){
        return new Promise((resolve,reject)=>{
            http.post(config.getCouponInfo,query,(res=>{
                resolve(res)
            }))
        })
    }
    receiveCoupon(query){
        return new Promise((resolve,reject)=>{
            http.post(config.receiveCoupon,query,(res=>{
                resolve(res)
            }))
        })
    }
}
module.exports = new Model();