const router = require('express').Router()
const check = require('../middleware/check.middleware')
const home = require('../controllers/home.controller')
const common = require('../controllers/common.controller')
const user = require('../controllers/user.controller')
const about = require('../controllers/aboutUs.contraller')
const inforamtion = require('../controllers/information.contraller')
const models = require('../controllers/minorityApiList.contraller')
const course = require('../controllers/course.controller')


const multer =require('multer')

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate.toString();
}
var datatime = __dirname+'../../static/upload'+getNowFormatDate();

var storage = multer.diskStorage({
    destination: datatime,
    filename: function (req, file, cb) {
        cb(null,  file.originalname);
     }
});
var upload = multer({
    storage: storage
});

router
    .get('/common/getImgCode',common.getImgCode)
    .post('/common/verifyImgCode',common.verifyImgCode)
    .get('/common/getSmsCode',common.getSmsCode)
    .get('/user/verifyCellphone',user.verifyCellphone)
    .get('/about/getAboutUsInfo',about.getAboutUsTypeInfo)
    .get('/about/getAboutUsProblemPageInfo',about.getAboutUsProblemPageInfo)
    .get('/informations/informationBannerTopInfo',inforamtion.geinformationTopInfo)
    .get('/informations/informationListInfo',inforamtion.getInformationPageInfo)
    .get('/informations/informationDetailInfo',inforamtion.getInformationViewInfo)
    .post('/information/addComment',check.auth('token'),inforamtion.addInformationComment)
    .post('/information/getCommentList',inforamtion.getInformationCommentList)
    .post('/information/addCommentLike',check.auth('token'),inforamtion.addInformationCommentLike)
    .post('/user/signUp',user.signUp)
    .post('/user/loginByPwd',user.loginByPwd)
    .post('/user/changePassword',user.changePassword)
    .post('/common/verifySmsCode',common.verifySmsCode)
    .post('/user/loginBySms',user.loginBySms)
    .post('/user/loginByThird',user.loginByThird)
    .post('/user/relatedCellphone',check.auth('token'),user.relatedCellphone)
    .get('/user/getEducationList',check.auth('token'),user.getEducationList)
    .get('/user/getIndustryList',check.auth('token'),user.getIndustryList)
    .post('/school/getList',check.auth('token'),user.getSchoolList)
    .get('/region/getList',check.auth('token'),user.getRegionList)
    .get('/school/getGradeList',check.auth('token'),user.getGradeList)
    .get('/models/modelSelectAll', models.getModelData)
    .get('/message/getPage', check.auth('token'), models.getMyInfoListConter)
    .get('/user/getUserCoinsPage',check.auth('token'),models.getMyBalanceData)
    .get('/user/getUserOrdersPage',check.auth('token'),models.getMyUserdersData)

    .post('/user/addUserFeedBacks',check.auth('token'),models.getMyFeedBacksData)
    .get('/user/accountBalance',check.auth('token'),models.getMyAccountDetailData)
    .get('/user/getOccupationList',check.auth('token'),user.getOccupationList)
    .get('/user/getInterestList',check.auth('token'),user.getInterestList)
    .post('/common/uploadForOSS',upload.single('file'),common.uploadForOSS)
    .post('/user/updateInfo/:id',check.auth('token'),user.updateInfo)
    .get('/user/getInfo/:id',check.auth('token'),user.getInfo)
    .get('/common/getHotWordList',common.getHotWordList)
    .get('/pcCourse/search',course.search)
    .get('/user/loginOut/:id',check.auth('token'),user.loginOut)
    .get('/pcCourse/getclassifyList',course.getclassifyList)
    .get('/pcCourse/getCourseListByClassify/:id',course.getCourseListByClassify)
    .get('/pcCourse/getInfo/:id',course.getInfo)
    .get('/pcCourse/getPeriodList/:id',course.getPeriodList)
    .get('/pcCourse/getEssenceCommentList/:id',course.getEssenceCommentList)
    .get('/pcCourse/getCommenList/:id',course.getCommenList)
    .get('/pcCourse/getRelationList/:id',course.getRelationList)
    .get('/user/loginOut/:id', check.auth('token'), user.loginOut)
    .get('/pcCourse/getPurchasedCourseList', check.auth('token'), models.getMyCourseList)
    .get('/aboutUsHoer/getPage',about.gethandLeListImg)
    .get('/message/getMsgTypeNum', check.auth('token'),models.getMyUnreadNum)
    .get('/pcCourse/getResourcesUrl/:id', course.getResourcesUrl)
    .get('/pcCourse/getPeriodInfo/:id',course.getPeriodInfo)
    .get('/user/getUserCouponsList', check.auth('token'), models.getMyCouponDataList)
    .get('/user/getCourseList',check.auth('token'), models.getDetailDataList)
    .get('/pcCourse/getAvailableList',check.auth('token'),course.getAvailableList)
    .post('/pcCourse/buy',check.auth('token'),course.buy)
    .get('/pcCourse/getBuyOrderState/:id', check.auth('token'),course.getBuyOrderState)
    .post('/user/thumbsUp',check.auth('token'),user.thumbsUp)
    .post('/user/addComment',check.auth('token'),user.addComment)
    .post('/pcCourse/saveLearningProgress',check.auth('token'),course.saveLearningProgress)
    .post('/pcCourse/saveStudyBehavior',check.auth('token'),course.saveStudyBehavior)
    .get('/pcCourse/getHotList',course.getHotList)
    .get('/aboutUs/getThemeInfo', home.getThemeInfo)
    .post('/mechanism/verifityMechanism', check.auth('token'), user.getVerifityMechanism)
    .post('/mechanism/saveMechanism',check.auth('token'),user.getSaveMechanism)
    .get('/classify/getClassifyListByParentId',course.getClassifyListByParentId)
    .post('/comment/verifyProhibitedWord',check.auth('token'),course.verifyProhibitedWord)
    .post('/user/loginByUserId',user.loginByUserId)
    .post('/doubleEleven/searchCourseList',course.searchCourseList)
    .post('/doubleEleven/getCouponInfo',course.getCouponInfo)
    .post('/doubleEleven/receiveCoupon',course.receiveCoupon)

module.exports = router
