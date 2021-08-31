const setCookie = (key,value,day=30)=>{
    const exp = new Date();    
    exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
    document.cookie = key + '=' + value + ';expires=' + exp.toGMTString()+';path=/';
}
const getCookie=(key)=>{
    let arr = '';
    const reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
    if (document.cookie.match(reg)){
        arr = document.cookie.match(reg)
        return unescape(arr[2]);
    }
    else
        return null;
}
export default {
    saveUser(user){
        const Days = 2; 
        const exp = new Date();    
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        let userInfo = JSON.stringify(user);
        userInfo = encodeURI(userInfo);
        document.cookie = 'activityUser=' + userInfo + ';expires=' + exp.toGMTString()+';path=/';
    },
    getUser(){
        let user = getCookie('activityUser');
        if(!user) return false;
        user = decodeURI(user);
        return JSON.parse(user);
    },
    delUser(){
        const time = new Date(0);
        time.setDate(time.getDate() - 1); 
        document.cookie = 'activityUser=;path=/;expires=' + time.toGMTString();
    }
}
