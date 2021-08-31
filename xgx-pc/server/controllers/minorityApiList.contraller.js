const Model = require('../model/minorityApiList.model')

class Common {
    getModelData(req,res,next){
        let params = req.query;//获取传递参数
        Model.getModelListData(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }   
    //getMyInfoListData
    getMyInfoListConter(req,res,next){
        let params = req.query;//获取传递参数
        Model.getMyInfoListData(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }  
    getMyFeedBacksData(req,res){
        let query = req.body;
        Model.getMyFeedBacksData(query).then(data=>{
            res.json(data)
        })

    }
    getMyBalanceData(req,res,next){
        let params = req.query;//获取传递参数
        Model.getMyBalanceData(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }
    getMyUnreadNum(req,res,next){
        let params = req.query;//获取传递参数
        Model.getMyUnreadNum(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }    
    getMyUserdersData(req,res,next){
        let params = req.query;//获取传递参数
        Model.getMyUserdersData(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }
    // getMyAccountDetailData(req, res, next) {
    //     let id = req.params.id;
    //     let params = req.query;//获取传递参数
    //     Model.getMyAccountDetailData(params,id).then(data=>{
    //         res.json(data) //输出值的JSON对象
    //     })
    // }
    getMyAccountDetailData(req, res, next) {
        // let id = req.params.id;
        let params = req.query;//获取传递参数
        Model.getMyAccountDetailData(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }    
    getMyCourseList(req, res, next) { 
        let params = req.query;
        Model.getMyCourseList(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }
    getMyCouponDataList(req, res, next) { 
        let params = req.query;
        Model.getMyCouponDataList(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }   
    getDetailDataList(req, res, next) { 
        let params = req.query;
        Model.getDetailDataList(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })        
    }
}
module.exports = new Common();