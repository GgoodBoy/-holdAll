import Service from '../utils/request'
export default class datalist {
    constructor() {
        this.pageAllObj = {
            pageAtion: {},
            tableObj: {}
        };
    }
    tableHead = {
        timelimit: ["id", "courseTitle", "validTime","type", "discount", "mtype","seckillPrice","sellStatus","sort","endAt"],
        coupon: ["id", "title", "reducedPrice", "validTime","couponType", "totalNumStr", "totalNum","receiveNum", "creatorName", "usedNum", "copyUrl", "status","remarks"],
        // "sourceClientType"
        couponDetails: ["userPhone", "sourceClientTypeName", "useCourseTitle", "used", "couponCode", "reducedPrice","createdAt"],
        // orderRecord: ['userPhone', 'orderId', 'returnId','originName','commodityTitle', 'orderStatus', 'paymentTypeStatus2','pipelineName', 'commodityPrice', 'couponDetailljm','payPrice','proportion','payProportion','bonusRatio','createdAt','discountInfo','cellphoneProvinceName','cellphoneCityName'],
        orderRecord:[],
        comment: ['id', 'commentUserPhone', 'commentUserName', 'courseTitle', 'content', 'updatedAt', 'show', 'isElite'],
        moneyRecord: ['userPhone', 'orderId', 'returnId', 'orderStatus','originName', 'paymentTypeStatus2', 'commodityPrice', 'payPrice', 'createdAt','paymentType','cellphoneProvinceName','cellphoneCityName'],
        userFiles: ['id', 'avatar', 'disableMark', 'cellphone','registerSourceName', 'registerType','interestNames','nickname', ,'channelName','originName', 'gender','operator', 'inviteNum', 'birthDate', 'education','occupation','industry','coinBalance','createdAt','lastLoginAt','userType','areaName','schooleName','gradeName','studyDurationText','studyDuration','cellphoneProvinceName','cellphoneCityName','cellphoneOperator','integralNum'],
        inside: ['id', 'cellphone', 'avatar', 'nickname'],
        daemonBug: ['id','phone', 'deviceType', 'phoneModel', 'content', 'updatedAt', 'isRead'],
        hotWork: ["id", "name","type","mtypeName"],
        history:['msgType','userPhone','sendType','targetType','content','updatedAt','msgSendType'],
        activity: ['id','title','reducedPrice','validTime','couponType','source','receiveNum','usedNum','status','remarks']
        }
    filterData(data,obhArr,modleType) {
        var self = this;
        let list = data.list || data.items;
        self.pageAllObj.pageAtion["pageNum"] = data.pageNum||data.currentPage;//当前页;
        self.pageAllObj.pageAtion['pageTotal'] = data.total || data.totalNum; //总的数量
        self.pageAllObj.pageAtion['pageSize'] = data.pageSize //设定的每页的数量
        self.pageAllObj.tableObj['tableData']=[];
        list.forEach(element => {
            let val ={};
            for (const item of obhArr) {
                // 1 未开始
                // 2 领取中
                // 3 已领完
                // 4 已结束
               
                switch (item) {
                    case 'validTime':
                        if (modleType == 'activity') {
                            val["validTime"] = element.validDays == 0 ? "长期" : element.validDays;
                        }else{
                            val["validTime"] = element['beginAt']+' - '+element['endAt'];
                        }
                        break;
                    case 'updatedAt':
                        val["updatedAt"] =  element.updatedAt||element.createdAt
                        break;
                    case 'couponDetailljm':
                            val["couponDetailljm"] =  element['couponDetail']
                        break;
                    case 'copyUrl':
                        val['copyUrl'] = "copyUrl";
                        break;
                    case 'source':
                          if(modleType=='activity'||modleType=='coupon'){//1通用 2满减 3指定课程  4注册 5 分享
                            switch(element[item]){
                                case 1:
                                    val['source'] = "通用"
                                    val['sourceNum'] = element[item]
                                break;
                                case 2:
                                    val['source'] = "注册 "
                                    val['sourceNum'] = element[item]
                                break;
                                case 3:
                                    val['source'] = "分享"
                                    val['sourceNum'] = element[item]
                                break;
                            }
                          }else{
                            val[item] =  element[item]
                          }
                        break;
                    case 'couponType':
                        if(modleType=='activity'||modleType=='coupon'){//1通用 2满减 3指定课程  4注册 5 分享
                          switch(element[item]){
                                case 1:
                                    val['couponType'] = "通用优惠券"
                                    val['couponTypeNum'] = element[item]
                                break;
                                case 2:
                                    val['couponType'] = "满减优惠券"
                                    val['couponTypeNum'] = element[item]
                                    break;
                                case 3:
                                    val['couponType'] = "指定课程"
                                    val['couponTypeNum'] = element[item]
                                  break;
                              break;
                          }
                        }else{
                          val[item] =  element[item]
                        }
                        break;                    
                    case 'reducedPrice':
                            if(modleType=='activity'||modleType=='coupon'){//1通用 2满减 3指定课程  4注册 5 分享
                                val['reducedPrice'] = "reducedPrice"
                                val['reducedPriceNum'] = element[item]
                            }else{
                                val[item] =  element[item]
                            }
                        break;
                    case 'registerType':
                            switch (element['registerType']) {
                                case 1:
                                    val['registerType'] = "自动"
                                    val['registerTypes'] = 1
                                    break;
                                case 2:
                                    val['registerType'] = "手动"
                                    val['registerTypes'] = 0
                                    break;
                                default:
                                    console.log("数据错误");
                                    break;
                            }
                            break;
                    case 'status':
                        switch (element['status']) {
                            case 1:
                                val['status'] = "未开始"
                                val['status1'] = 1
                                break;
                            case 2:
                                val['status'] = "领取中"
                                val['status1'] = 2
                                break;
                            case 3:
                                val['status'] = "已领完"
                                val['status1'] = 3
                                break;
                            case 4:
                                val['status'] = "已结束"
                                val['status1'] = 4
                                break;
                            default:
                                console.log("数据错误");
                                break;
                            }
                            break;
                    case 'sellStatus':
                        switch (element['sellStatus']) {
                            case 1:
                                val['sellStatus'] = "已上架"
                                val['status1'] = 1
                                break;
                            case 0:
                                val['sellStatus'] = "已下架"
                                val['status1'] = 0
                                break;
                            default:
                                console.log("数据错误");
                                break;
                        }
                        break;
                    case 'mtype':
                        switch (element['mtype']) {
                            case 1:
                                val['mtype'] = "成人"
                                val['mtype1'] = 1
                                break;
                            case 2:
                                val['mtype'] = "少儿"
                                val['mtype1'] = 2
                                break;
                            default:
                                console.log("数据错误");
                                break;
                        }
                        break;
                    case 'type':
                        switch (element['type']) {
                            case 1:
                                val['type'] = "打折"
                                val['status1'] = 0
                                break;
                            case 0:
                                val['type'] = "免费"
                                val['status1'] = 1
                                break;
                            case 2:
                                val['type'] = "秒杀"
                                val['status1'] = 2
                                break;
                            default:
                                console.log("数据错误");
                                break;
                        }
                        break;
                    case 'used':
                        switch (element['used']) {
                            case 0:
                                val['used'] = "未使用"
                                val['status1'] = 0
                                break;
                            case 1:
                                val['used'] = "已使用"
                                val['status1'] = 1
                                break;
                            case 2:
                                val['used'] = "已锁定"
                                val['status1'] = 2
                                break;
                            default:
                                console.log("数据错误");
                                break;
                        }
                        break;
                    case 'orderStatus':
                        switch (element['orderStatus']) {
                            case 0:
                                val['orderStatus'] = "支付取消"
                                val['status1'] = 0
                                break;
                            case 1:
                                val['orderStatus'] = "支付成功"
                                val['status1'] = 1
                                break;
                            default:
                                console.log("数据错误");
                                break;
                        }
                        break;
                    case 'paymentTypeStatus2':
                        switch (element['paymentType']) {
                            case 1:
                                val['paymentType'] =element['paymentType']
                                val['paymentTypeStatus2'] = "夫子币余额"
                                break;
                            case 2:
                            case 5:
                                val['paymentType'] = element['paymentType']
                                val['paymentTypeStatus2'] = "微信"
                                break;
                            case 3:
                                val['paymentType'] = element['paymentType']
                                val['paymentTypeStatus2'] = "支付宝"
                                break;
                            case 4:
                                val['paymentType'] =element['paymentType']
                                val['paymentTypeStatus2'] = "apple充值"
                                break;
                            case 6:
                                val['paymentType'] =element['paymentType']
                                val['paymentTypeStatus2'] = "华为支付"
                                break;
                            case 7:
                                val['paymentType'] =element['paymentType']
                                val['paymentTypeStatus2'] = "oppo支付"
                                break;
                            case 8:
                                val['paymentType'] =element['paymentType']
                                val['paymentTypeStatus2'] = "vivo支付"
                                break;  
                            case 9:
                                val['paymentType'] =element['paymentType']
                                val['paymentTypeStatus2'] = "小米支付"
                                break;     
                            case 10:
                                val['paymentType'] =element['paymentType']
                                val['paymentTypeStatus2'] = "工行卡支付"
                                break;                            
                            default:
                                console.log("数据错误");
                                break;
                        }
                        break;
                    case 'registerSource':
                        switch (element['registerSource']) {
                            case 1:
                                val['registerSource'] = "ios"
                                val['status1'] = 1
                                break;
                            case 2:
                                val['registerSource'] = "android"
                                val['status1'] = 2
                                break;
                            case 3:
                                val['registerSource'] = "web"
                                val['status1'] = 3
                                break;
                            default:
                                console.log("数据错误");
                                break;
                        }
                        break;
                    case 'gender':
                        switch (element['gender']) {
                            case 0:
                                val['gender'] = "女"
                                val['status2'] = 0
                                break;
                            case 1:
                                val['gender'] = "男"
                                val['status2'] = 1
                                break;
                            case 2:
                                val['gender'] = "保密"
                                val['status2'] = 2
                                break;
                            default:
                                console.log("数据错误");
                                break;
                        }
                        break;
                    case 'content':
                         if(modleType=='historyRecord'){
                            val['contenthistoryRecord']= "historyRecord";
                            val['content']=element['content']
                         }else{
                            val['content'] = element[item];
                         }
                         break;
                    case 'msgType':
                        switch (element['msgType']) { //1:充值成功，2:购课成功，3:课程更新，4:小喇叭
                            case 1:
                                val['msgType'] = "充值成功"
                                val['msgTypeCopy'] = 1
                                break;
                            case 2:
                                val['msgType'] = "购课成功"
                                val['msgTypeCopy'] = 2
                                break;
                            case 3:
                                val['msgType'] = "课程更新"
                                val['msgTypeCopy'] = 3
                                break;
                            case 4:
                                val['msgType'] = "小喇叭"
                                val['msgTypeCopy'] = 4
                                break;
                            default:
                                console.log("数据错误");
                                break;
                        }
                        break;
                    default:
                        val[item] =  element[item]
                        break;
                }
            }
            self.pageAllObj.tableObj.tableData.push(val);
        });
        return self.pageAllObj
    }
    getData(url,paramsObj,ajaxType,type){
        var deferred = $.Deferred();
        if (!ajaxType) {
            if (paramsObj) {
                Service.get(url, { params: paramsObj })
                    .then(res => {
                        if (res.status === 200) {
                            deferred.resolve(res.content);//触发, 并传递数据
                        }
                    }).catch(res => {
                        deferred.reject(res);
                    });
            } else {
                Service.get(url)
                    .then(res => {
                        if (res.status === 200) {
                            deferred.resolve(res.content);//触发, 并传递数据
                        }
                    }).catch(res => {
                        deferred.reject(res);
                    });
            }
        } else if (ajaxType == "post") {
            if (paramsObj) {
                Service.post(url, paramsObj)
                    .then(res => {
                        if (res.status === 200) {
                            deferred.resolve(res.content);//触发, 并传递数据
                        }
                    }).catch(res => {
                        deferred.reject(res);
                    });

            } else {
                Service.post(url)
                    .then(res => {
                        if (res.status === 200) {
                            deferred.resolve(res);//触发, 并传递数据
                        }
                    }).catch(res => {
                        deferred.reject(res);
                    });
            }
        } else if (ajaxType == "delete") {
            var deferred = $.Deferred();
            Service.delete(url)
                .then(res => {
                    if (res.status === 200) {
                        deferred.resolve(res);
                    }
                })
                .catch(err => {
                    deferred.reject(res);
                    console.log(err);
                });

        } else if (ajaxType == "put") {
            var deferred = $.Deferred();
            if (paramsObj) {
                    Service.put(url,paramsObj)
                    .then(res => {
                        if (res.status === 200) {
                            deferred.resolve(res);
                        }
                    })
                    .catch(err => {
                        deferred.reject(res);
                        console.log(err);
                    });
             } else {
                Service.put(url)
                .then(res => {
                    if (res.status === 200) {
                        deferred.resolve(res);
                    }
                })
                .catch(err => {
                    deferred.reject(res);
                    console.log(err);
                });
            }

        }
        return deferred;
    }
    formatDate(date,type){
        if(date){
            date = new Date(date);
            var y=date.getFullYear();
            var m=date.getMonth()+1;
            var d=date.getDate();
            var h=date.getHours();
            var m1=date.getMinutes();
            var s=date.getSeconds();
            m = m<10?("0"+m):m;
            d = d<10?("0"+d):d;
            if(type=="end"){
                h = 23;
                m1 = 59;
                s = 59;                
            }else{
                h = h<10?("0"+h):h;
                m1 = m1<10?("0"+m1):m1;
                s = s < 10 ? ("0" + s) : s;
            }
            return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
        }else{
            return '';
        }
    }
    timesUpData(){
        setTimeout(()=>{
            window.location.reload();
        },100);
    }
}
