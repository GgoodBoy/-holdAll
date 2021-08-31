import { Base64 } from 'js-base64';
import localStore from './cookies.js'
var ls = new localStore;
export const SetCookies = (name,value)=>{
  ls.set(name, Base64.encode(value));
}
export const GetCookies = (name)=>{
    try {
       let val = ls.get(name);
       if (val) {
           return Base64.decode(val)
       }else {
            return null;
       }
    }catch(e) {
        console.log(e , new Date().getTime() , '获取cookie失败');
        return null;
    }
}
export const DelCookies = (name)=>{
    ls.del(name);
}
export function setLocalStorage(key, value) {
    var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列 
    var valueDate = JSON.stringify({
        val: value,
        timer: curtime
    });
    try {
        localStorage.setItem(key, valueDate);
    } catch(e) {
        // 兼容性写法
        if(isQuotaExceeded(e)) {
            console.log("Error: 本地存储超过限制");
            localStorage.clear();
        } else {
            console.log("Error: 保存到本地存储失败");
        }
    }
}

function isQuotaExceeded(e) {
    var quotaExceeded = false;
    if(e) {
        if(e.code) {
            switch(e.code) {
                case 22:
                    quotaExceeded = true;
                    break;
                case 1014: // Firefox 
                    if(e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                        quotaExceeded = true;
                    }
                    break;
            }
        } else if(e.number === -2147024882) { // IE8 
            quotaExceeded = true;
        }
    }
    return quotaExceeded;
}

export function getLocalStorage(key) {
    var exp = 1000* 60 * 30;//半小时
    if(localStorage.getItem(key)) {
        var vals = localStorage.getItem(key); 
        var dataObj = JSON.parse(vals); 
        var isTimed = (new Date().getTime() - dataObj.timer) > exp;
        if(isTimed) {
            localStorage.removeItem(key);
            return null;
        } else {
            var newValue = dataObj.val;
        }
        return newValue;
    } else {
        return null;
    }
}
