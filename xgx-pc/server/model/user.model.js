const Fetch = require('../http/http')
let http = new Fetch();
const config = {
    verifyCellphone:'/user/verifyCellphone',//验证电话号码是否存在创
    signUp:'/user/signUp',//用户-注册
    loginByPwd:'/user/loginByPwd',//密码登录
    changePassword:'/user/changePassword',//修改密码
    loginBySms:'/user/loginBySms',//短信登录
    loginByThird:'/user/loginByThird',//第三方登录
    relatedCellphone:'/user/relatedCellphone',//关联手机号
    getEducationList:'/user/getEducationList',//查询学历列表
    getIndustryList:'/user/getIndustryList',//查询行业列表
    getSchoolList:'/schoole/getList',//获取学校列表
    getRegionList:'/region/getList',//获取地区列表
    getGradeList:'/schoole/getGradeList',//获取年级
    getOccupationList:'/user/getOccupationList',//查询职业列表
    getInterestList:'/user/getInterestList',//查询兴趣列表
    updateInfo:'/user/updateInfo',//编辑用户资料
    getInfo:'/user/getInfo',//获取用户资料
    loginOut:'/user/loginOut',//退出
    thumbsUp:'/user/thumbsUp',//点赞
    addComment: '/user/addComment',//添加评论
    getVerifityMechanism: '/mechanism/verifityMechanism',
    getSaveMechanism:'/mechanism/saveMechanism',
    loginByUserId:'/user/loginByUserId'
}
class Model{
    verifyCellphone(params){
        return new Promise((resolve,reject)=>{
            http.get(config.verifyCellphone,params,(res=>{
                resolve(res)
            }))
        })
    }
    signUp(query){
        return new Promise((resolve,reject)=>{
            http.post(config.signUp,query,(res=>{
                resolve(res)
            }))
        })
    }
    loginByPwd(query){
        return new Promise((resolve,reject)=>{
            http.post(config.loginByPwd,query,(res=>{
                resolve(res)
            }))
        })
    }
    changePassword(query){
        return new Promise((resolve,reject)=>{
            http.post(config.changePassword,query,(res=>{
                resolve(res)
            }))
        })
    }
    loginBySms(query){
        return new Promise((resolve,reject)=>{
            http.post(config.loginBySms,query,(res=>{
                resolve(res)
            }))
        })
    }
    loginByThird(query){
        return new Promise((resolve,reject)=>{
            http.post(config.loginByThird,query,(res=>{
                resolve(res)
            }))
        })
    }
    relatedCellphone(query){
        return new Promise((resolve,reject)=>{
            http.post(config.relatedCellphone,query,(res=>{
                resolve(res)
            }))
        })
    }
    getEducationList(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getEducationList,params,(res=>{
                resolve(res)
            }))
        })
    }
    getIndustryList(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getIndustryList,params,(res=>{
                resolve(res)
            }))
        })
    }
    getOccupationList(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getOccupationList,params,(res=>{
                resolve(res)
            }))
        })
    }
    getInterestList(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getInterestList,params,(res=>{
                resolve(res)
            }))
        })
    }
    getSchoolList(query){
        return new Promise((resolve,reject)=>{
            http.post(config.getSchoolList,query,(res=>{
                resolve(res)
            }))
        })
    }
    getRegionList(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getRegionList,params,(res=>{
                resolve(res)
            }))
        })
    }
    getGradeList(params){
        return new Promise((resolve,reject)=>{
            http.get(config.getGradeList,params,(res=>{
                resolve(res)
            }))
        })
    }
    updateInfo(query,params){
        return new Promise((resolve,reject)=>{
            http.post(`${config.updateInfo}/${params}`,query,(res=>{
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
    loginOut(params,id){
        return new Promise((resolve,reject)=>{
            http.get(`${config.loginOut}/${id}`,params,(res=>{
                resolve(res)
            }))
        })
    }
    thumbsUp(query){
        return new Promise((resolve,reject)=>{
            http.post(config.thumbsUp,query,(res=>{
                resolve(res)
            }))
        })
    }
    addComment(query){
        return new Promise((resolve,reject)=>{
            http.post(config.addComment,query,(res=>{
                resolve(res)
            }))
        })
    }
    getVerifityMechanism(query){
        return new Promise((resolve,reject)=>{
            http.post(config.getVerifityMechanism,query,(res=>{
                resolve(res)
            }))
        })
    }
    getSaveMechanism(query){
        return new Promise((resolve,reject)=>{
            http.post(config.getSaveMechanism,query,(res=>{
                resolve(res)
            }))
        })
    }
    loginByUserId(query){
        return new Promise((resolve,reject)=>{
            http.post(config.loginByUserId,query,(res=>{
                resolve(res)
            }))
        })
    }
    
}
module.exports = new Model();