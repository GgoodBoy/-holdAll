const Model = require('../model/information.model')

class Common {
    geinformationTopInfo(req,res,next){
        let params = req.query;//获取传递参数
        Model.getInformationTopEven(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }
    getInformationPageInfo(req,res,next){
        let params = req.query;//获取传递参数
        Model.getInformationPageEven(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }    
    getInformationViewInfo(req,res,next){
        let params = req.query;//获取传递参数
        Model.getInformationViewEven(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }
    addInformationComment(req,res){
        let query = req.body;
        Model.addInformationComment(query).then(data=>{
            res.json(data)
        })
    }
    getInformationCommentList(req,res){
        let query = req.body;
        Model.getInformationCommentList(query).then(data=>{
            res.json(data)
        })
    }
    addInformationCommentLike(req,res){
        let query = req.body;
        Model.addInformationCommentLike(query).then(data=>{
            res.json(data)
        })
    }
}
module.exports = new Common();