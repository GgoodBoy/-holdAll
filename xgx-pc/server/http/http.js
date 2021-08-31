const http = require('https');
const qs = require('querystring');
const e = require('express');

let options = {
    hostname: '',
    // hostname: 'pcapi.xueguoxue.com',
    strictSSL: false,
    rejectUnauthorized: false
};

class HttpServer{
    get(url,params,callback){
        let httpOption;
        if(params.token){
            let token = params.token;
            let userId = params.userId;
            delete params.token;
            let content = qs.stringify(params);
            httpOption = {
                method:'GET',
                path: `${url}?${content}`,
                headers:{
                    token:token,
                    userId:userId
                }
            }
        }else{
            let content = qs.stringify(params);
            httpOption = {
                method:'GET',
                path: `${url}?${content}`,
            }
        }
        if(url.includes('pcCourse')){
            options.hostname = process.env.ENVIRONMENT == 'production'?'courseapi.xueguoxue.com':'courseapi.youfushuyuan.com';
        }else{
            options.hostname = process.env.ENVIRONMENT == 'production'?'pcapi.xueguoxue.com':'scpc.youfushuyuan.com';
        }
        let httpOptions = Object.assign({}, options, httpOption)
        let req = http.request(httpOptions, apacheRes=> {
            apacheRes.setEncoding('utf8');
            let data = '';
            apacheRes.on('data',chunk=>{
                data+=chunk;
            });
            apacheRes.on('end', () => {
                callback(JSON.parse(data))
            })
        }).on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });
        req.end();
    }
    post(url,query,callback){
        let token,type,userId
        if(query.token){
            token = query.token;
            userId = query.userId;
        }
        let content = JSON.stringify(query);
        if(url.includes('pcCourse')){
            options.hostname = process.env.ENVIRONMENT == 'production'?'courseapi.xueguoxue.com':'courseapi.youfushuyuan.com';
        }else{
            options.hostname = process.env.ENVIRONMENT == 'production'?'pcapi.xueguoxue.com':'scpc.youfushuyuan.com';
        }
        let httpOptions = Object.assign({},options,{
            method:'POST',
            json: true,
            path: url,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                token:token?token:null,
                userId:userId?userId:null
            }
        })
        let req = http.request(httpOptions,apacheRes=>{
            apacheRes.setEncoding('utf8');
            let data = '';
            apacheRes.on('data', chunk=>{
                data+=chunk;
            });
            apacheRes.on('end',()=>{
                callback(JSON.parse(data))
            })
          });
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });
        req.write(content);
        req.end();
    }
}

module.exports = HttpServer;
