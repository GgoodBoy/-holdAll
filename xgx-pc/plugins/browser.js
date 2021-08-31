export default (context)=>{
    const getQueryString = (key)=>{
        var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
        var result = window.location.search.substr(1).match(reg);
        return result?decodeURIComponent(result[2]):null;
    }
    if (navigator.userAgent.match(/(phone|iPhone|ios|Android|BlackBerry|Symbian|Windows Phone)/i)){
        let courseFlag = window.location.href.includes('/course/details');
        if(courseFlag){
            let id = getQueryString('id')
            let url = window.location.origin=='https://dev.xueguoxue.com'?`https://scm.youfushuyuan.com/#/course/${id}`:`https://xgxm.xueguoxue.com/#/course/${id}`
            window.location.replace(url)
        }
        let informationFlag = window.location.href.includes('/information');
        if(informationFlag){
            let id = Number(window.location.pathname.split('/')[2]);
            let url = window.location.origin=='https://dev.xueguoxue.com'?`https://scm.youfushuyuan.com/#/infromation/infromDetails/${id}`:`https://xgxm.xueguoxue.com/#/infromation/infromDetails/${id}`
            window.location.replace(url)
        }
    }
}