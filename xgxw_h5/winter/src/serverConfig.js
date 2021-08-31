let env,appId
if (process.env.NODE_ENV == 'development'){
    env = 'dev';
}
else{
    if(process.env.argv=='beta'){
        env = 'beta';
        appId='wxfd920b9cc0f222c4'//仿生 
    }else{
        env = 'prod';
        appId = 'wx44e94e1ef84f486e' //线上
    }
}
export default{
    env,
    appId,
    getclassifyId:'/warmheart/getclassifyId',
    searchCourseList:'/warmheart/searchCourseList',
    pointButton:'/warmheart/pointButton',
    pointChannel:'/warmheart/pointChannel',
}