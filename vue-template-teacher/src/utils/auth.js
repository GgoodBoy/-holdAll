import Cookies from 'js-cookie'
import {
    Base64
} from 'js-base64';


const TokenKey = 'xgx-user-tk'

export function getToken() {
    const token = Cookies.get(TokenKey);
    if (token) {
        try {
            return Base64.decode(token)
        } catch (e) {
            return '';
        }
    }
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    if (token) {
        return Cookies.set(TokenKey, Base64.encode(token));
    }
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
export function getPermissions(routes,currentPath){
    let permissions = JSON.parse(window.localStorage.getItem('permissions'))
    let currentRouteObj;
    routes.forEach(item=>{
        if(item.children){
            let temp = item.children.find(option=>currentPath.includes(option.path))
            if(temp)
                currentRouteObj = temp
        }
    })
    let auth = []
    permissions.forEach((item)=>{
        item.includes(currentRouteObj.meta.code) && auth.push(item)
    })
    if (permissions.includes('common:export')) { 
        auth.push('common:export');
    }
    // if(auth.length==1){
    //     return false;
    // }else{
        return auth;
    // }
}
/**
 * 功能权限判断
 */
export function authJudge(code){
    let all = JSON.parse(localStorage.getItem('permissions'));
    let index = all.findIndex(item=>item==code)
    return index>=0;
}
export function getUserRoutes(permissions,data,arr){
    let i = -1;
    data.forEach((item,index)=>{
        if(item.meta&&item.meta.code){
            if(permissions.includes(item.meta.code)){
                arr.push({
                    path:item.path,
                    component:item.component,
                    hidden:item.hidden||false,
                    meta:item.meta,
                    name:item.name
                })
                i++;
            }
            if(item.children&&item.children.length>0){
                let childArr = getUserRoutes(permissions,item.children, []) 
                if (arr[i] && childArr.length > 0) {
                    arr[i].children = childArr;                   
                }
            }              
        }                         
    })
    // console.log("authArr",arr);
    return arr;
}
