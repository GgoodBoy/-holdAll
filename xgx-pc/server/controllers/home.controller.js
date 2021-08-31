const Model = require('../model/home.model')

class Home {
    getHomeConfig(req,res,next){
        let query = req.body;
        Model.getHomeConfig(query).then(data=>{
            res.json(data)
        })
    }
    getThemeInfo(req,res,next){
        let params = req.query;
        Model.getThemeInfo(params).then(data=>{
            res.json(data)
        })
    }
}
module.exports = new Home();