const Model = require('../model/course.model')

class Course {
    search(req,res){
        let params = req.query;
        Model.search(params).then(data=>{
            res.json(data)
        })
    }
    getclassifyList(req,res){
        let params = req.query;
        Model.getclassifyList(params).then(data=>{
            res.json(data)
        })
    }
    getCourseListByClassify(req,res){
        let id = req.params.id;
        let params = req.query;
        Model.getCourseListByClassify(params,id).then(data=>{
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
    getPeriodList(req,res){
        let id = req.params.id;
        let params = req.query;
        Model.getPeriodList(params,id).then(data=>{
            res.json(data)
        })
    }
    getEssenceCommentList(req,res){
        let id = req.params.id;
        let params = req.query;
        Model.getEssenceCommentList(params,id).then(data=>{
            res.json(data)
        })
    }
    getCommenList(req,res){
        let id = req.params.id;
        let params = req.query;
        Model.getCommenList(params,id).then(data=>{
            res.json(data)
        })
    }
    getRelationList(req,res){
        let id = req.params.id;
        let params = req.query;
        Model.getRelationList(params,id).then(data=>{
            res.json(data)
        })
    }
    getResourcesUrl(req,res){
        let id = req.params.id;
        let params = req.query;
        Model.getResourcesUrl(params,id).then(data=>{
            res.json(data)
        })
    }
    getPeriodInfo(req,res){
        let id = req.params.id;
        let params = req.query;
        Model.getPeriodInfo(params,id).then(data=>{
            res.json(data)
        })
    }
    getAvailableList(req,res){
        let params = req.query;
        Model.getAvailableList(params).then(data=>{
            res.json(data)
        })
    }
    buy(req,res){
        let query = req.body;
        Model.buy(query).then(data=>{
            res.json(data)
        })
    }
    getBuyOrderState(req,res){
        let id = req.params.id;
        let params = req.query;
        Model.getBuyOrderState(params,id).then(data=>{
            res.json(data)
        })
    }
    saveLearningProgress(req,res){
        let query = req.body;
        Model.saveLearningProgress(query).then(data=>{
            res.json(data)
        })
    }
    saveStudyBehavior(req,res){
        let query = req.body;
        Model.saveStudyBehavior(query).then(data=>{
            res.json(data)
        })
    }
    getHotList(req,res){
        let params = req.query;
        Model.getHotList(params).then(data=>{
            res.json(data)
        })
    }
    getClassifyListByParentId(req,res){
        let params = req.query;
        Model.getClassifyListByParentId(params).then(data=>{
            res.json(data)
        })
    }
    verifyProhibitedWord(req,res){
        let query = req.body;
        Model.verifyProhibitedWord(query).then(data=>{
            res.json(data)
        })
    }
    searchCourseList(req,res){
        let query = req.body;
        Model.searchCourseList(query).then(data=>{
            res.json(data)
        })
    }
    getCouponInfo(req,res){
        let query = req.body;
        Model.getCouponInfo(query).then(data=>{
            res.json(data)
        })
    }
    receiveCoupon(req,res){
        let query = req.body;
        Model.receiveCoupon(query).then(data=>{
            res.json(data)
        })
    }
}
module.exports = new Course();