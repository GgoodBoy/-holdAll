const Model = require('../model/user.model')

class User {
    verifyCellphone(req,res,next){
        let params = req.query;
        Model.verifyCellphone(params).then(data=>{
            res.json(data)
        })
    }
    signUp(req,res){
        let query = req.body;
        Model.signUp(query).then(data=>{
            res.json(data)
        })
    }
    loginOut(req,res){
        let id = req.params.id;
        let params = req.query;
        Model.loginOut(params,id).then(data=>{
            res.json(data)
        })
    }
    loginByPwd(req,res){
        let query = req.body;
        Model.loginByPwd(query).then(data=>{
            res.json(data)
        })
    }
    changePassword(req,res){
        let query = req.body;
        Model.changePassword(query).then(data=>{
            res.json(data)
        })
    }
    loginBySms(req,res){
        let query = req.body;
        Model.loginBySms(query).then(data=>{
            res.json(data)
        })
    }
    loginByThird(req,res){
        let query = req.body;
        Model.loginByThird(query).then(data=>{
            res.json(data)
        })
    }
    relatedCellphone(req,res){
        let query = req.body;
        Model.relatedCellphone(query).then(data=>{
            res.json(data)
        })
    }
    getEducationList(req,res){
        let params = req.query;
        Model.getEducationList(params).then(data=>{
            res.json(data)
        })
    }
    getIndustryList(req,res){
        let params = req.query;
        Model.getIndustryList(params).then(data=>{
            res.json(data)
        })
    }
    getOccupationList(req,res){
        let params = req.query;
        Model.getOccupationList(params).then(data=>{
            res.json(data)
        })
    }
    getInterestList(req,res){
        let params = req.query;
        Model.getInterestList(params).then(data=>{
            res.json(data)
        })
    }
    getSchoolList(req,res){
        let query = req.body;
        Model.getSchoolList(query).then(data=>{
            res.json(data)
        })
    }
    getRegionList(req,res){
        let params = req.query;
        Model.getRegionList(params).then(data=>{
            res.json(data)
        })
    }
    getGradeList(req,res){
        let params = req.query;
        Model.getGradeList(params).then(data=>{
            res.json(data)
        })
    }
    updateInfo(req,res){
        let id = req.params.id;
        let query = req.body;
        Model.updateInfo(query,id).then(data=>{
            res.json(data)
        })
    }
    getInfo(req,res){
        let id = req.params.id;
        let params = req.query;
        Model.getInfo(params,id).then(data=>{
            res.json(data)
        })
    }
    thumbsUp(req,res){
        let query = req.body;
        Model.thumbsUp(query).then(data=>{
            res.json(data)
        })
    }
    addComment(req,res){
        let query = req.body;
        Model.addComment(query).then(data=>{
            res.json(data)
        })
    }
    getVerifityMechanism(req,res){
        let query = req.body;
        Model.getVerifityMechanism(query).then(data=>{
            res.json(data)
        })
    }
    getSaveMechanism(req,res){
        let query = req.body;
        Model.getSaveMechanism(query).then(data=>{
            res.json(data)
        })
    }
    loginByUserId(req,res){
        let query = req.body;
        Model.loginByUserId(query).then(data=>{
            res.json(data)
        })
    }
}
module.exports = new User();