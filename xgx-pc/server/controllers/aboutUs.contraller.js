const Model = require('../model/aboutUs.model')

class Common {
    getAboutUsTypeInfo(req,res,next){
        let params = req.query;//获取传递参数
        Model.getAboutUsView(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }
    getAboutUsProblemPageInfo(req,res,next){
        let params = req.query;//获取传递参数
        Model.getAboutUsProblemPage(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }
    gethandLeListImg(req,res,next) {
        let params = req.query;//获取传递参数
        Model.gethandLeListImg(params).then(data=>{
            res.json(data) //输出值的JSON对象
        })
    }
}
module.exports = new Common();
