const Fetch = require('../http/http')
let http = new Fetch();
const config = { 
    modelList: '/pcIndexConfigs/selectAll',//首页所有模板数据 
    myInfoList: '/message/getPage',//我的消息
    myFeedBacks: '/user/addUserFeedBacks',//提交反馈
    myBalance: '/user/accountBalance',//账户余额 user/accountBalance
    myAccountDetail: '/user/getUserCoinsPage',//账户明细
    myUserders: '/user/getUserOrdersPage',//我的订单
    myCourseList: '/pcCourse/getPurchasedCourseList',
    myUnreadNum:'/message/getMsgTypeNum',
    myCouponList: '/user/getUserCouponsList',
    myCouponDetail:'/user/getCourseList'
}
class Model{
    getModelListData(params){
        return new Promise((resolve,reject)=>{
            http.get(config.modelList,params,(res=>{
                resolve(res)
            }))
        })
    }
    getMyUnreadNum(params){
        return new Promise((resolve,reject)=>{
            http.get(config.myUnreadNum,params,(res=>{
                resolve(res)
            }))
        })
    }    
    getMyInfoListData(params){
        return new Promise((resolve,reject)=>{
            http.get(config.myInfoList,params,(res=>{
                resolve(res)
            }))
        })
    }    
    getMyFeedBacksData(params){
        return new Promise((resolve,reject)=>{
            http.post(config.myFeedBacks,params,(res=>{
                resolve(res)
            }))
        })
    }    
    getMyBalanceData(params){
        return new Promise((resolve,reject)=>{
            http.get(config.myAccountDetail,params,(res=>{
                resolve(res)
            }))
        })
    } 
    getMyUserdersData(params){
        return new Promise((resolve,reject)=>{
            http.get(config.myUserders,params,(res=>{
                resolve(res)
            }))
        })
    }  
    // getMyAccountDetailData(params,id) {
    //     return new Promise((resolve,reject)=>{
    //         http.get(`${config.myBalance}/${id}`,params,(res=>{
    //             resolve(res)
    //         }))
    //     })
    // }
    getMyAccountDetailData(params) {
        return new Promise((resolve,reject)=>{
            http.get(config.myBalance,params,(res=>{
                resolve(res)
            }))
        })
    }    
    getMyCourseList(params) { 
        return new Promise((resolve,reject)=>{
            http.get(config.myCourseList,params,(res=>{
                resolve(res)
            }))
        })
    }
    getMyCouponDataList(params) { 
        return new Promise((resolve,reject)=>{
            http.get(config.myCouponList,params,(res=>{
                resolve(res)
            }))
        })
    } 
    getDetailDataList(params) { 
        return new Promise((resolve,reject)=>{
            http.get(config.myCouponDetail,params,(res=>{
                resolve(res)
            }))
        })
    }
    
}
module.exports = new Model();