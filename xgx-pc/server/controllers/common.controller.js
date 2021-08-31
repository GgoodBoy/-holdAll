const Model = require('../model/common.model')
const formData = require('form-data');
const fs = require('fs');
const http = require('http');
class Common {
    getImgCode(req,res,next){
        let params = req.query;
        Model.getImgCode(params).then(data=>{
            res.json(data)
        })
    }
    verifyImgCode(req,res){
        let query = req.body;
        Model.verifyImgCode(query).then(data=>{
            res.json(data)
        })
    }
    getSmsCode(req,res,next){
        let params = req.query;
        Model.getSmsCode(params).then(data=>{
            res.json(data)
        })
    }
    verifySmsCode(req,res){
        let query = req.body;
        Model.verifySmsCode(query).then(data=>{
            res.json(data)
        })
    }
    // uploadForOSS(req,res){
    //     let query = req.body;
    //     Model.uploadForOSS(query).then(data=>{
    //         res.json(data)
    //     })
    // }
    getHotWordList(req,res){
        let params = req.query;
        Model.getHotWordList(params).then(data=>{
            res.json(data)
        })
    }
    uploadForOSS(req,res){
        var form = new formData();
        let {userId,imgType} = req.body;
        form.append('file', fs.createReadStream(req.file.path));
        form.append('userId', userId);
        form.append('imgType',imgType);
        var headers = form.getHeaders();
        headers.token = req.headers.token;
        headers.userId = userId;
        var request = http.request({
            method: 'POST',
            hostname: 'xgxapi.xueguoxue.com',
            path: '/common/upload/img',
            headers: headers
        },function(response){
            var str='';
            response.on('data',function(buffer){
                str+=buffer;//用字符串拼接
            }
            );
            response.on('end',()=>{
                var result = JSON.parse(str);
                res.json(result)
            //上传之后result就是返回的结果
            });
        });
        form.pipe(request);
    }
}
module.exports = new Common();