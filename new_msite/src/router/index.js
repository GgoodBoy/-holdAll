import Vue from 'vue'
import Router from 'vue-router'
import {
  SetCookies,
  GetCookies
} from '../utils/setCookies.js'
let isLogin = () => { //判断是否登录
  try {
  let cookie = GetCookies('uInfo');
      let userInfo = JSON.parse(cookie);
      return !!(userInfo && userInfo.accessToken);
  } catch (e) {
      return false;
  }
}
let limitNotLogin = (to, from, next) => {
  if (isLogin()) {
      next('/user');
  } else {
      next();
  }
};
const Index = () => import(/* webpackChunkName: "index" */ '@/pages/index/index')//首页
const Auth = () => import(/* webpackChunkName: "auth" */ '@/pages/auth/auth')//短信登录页
const Login = () => import(/* webpackChunkName: "login" */ '@/pages/auth/login')//密码登录页
const UserWrap = () => import(/* webpackChunkName: "userWrap" */ '@/pages/user/UserWrap')//我的(容器)
const Bought = () => import(/* webpackChunkName: "bought" */ '@/pages/course/indexMoney')//已购
const Register = () => import(/* webpackChunkName: "register" */ '@/pages/auth/Register')//注册
const Forget = () => import(/* webpackChunkName: "forget" */ '@/pages/auth/Forget')//忘记密码
const User = () => import(/* webpackChunkName: "user" */ '@/pages/user/user')//忘记密码
const PurchaseHistory = () => import(/* webpackChunkName: "purchaseHistory" */ '@/pages/user/purchaseHistory')//购课记录
const Search = () => import(/* webpackChunkName: "search" */ '@/pages/search/Index')//搜索
const Result = () => import(/* webpackChunkName: "searchResult" */ '@/pages/search/Result')//搜索结果
const AssembleList = () => import(/* webpackChunkName: "assembleList" */ '@/pages/assemble/list.vue')//拼团列表
const OpenAssemble = () => import(/* webpackChunkName: "openAssemble" */ '@/pages/assemble/open.vue')//开团
const JoinAssemble = () => import(/* webpackChunkName: "joinAssemble" */ '@/pages/assemble/join.vue')//参团
const MyAssembleList = () => import(/* webpackChunkName: "myAssembleList" */ '@/pages/assemble/myAssembleList.vue')//参团
const SpecialArea = () => import(/* webpackChunkName: "myAssembleList" */ '@/pages/courseList/specialArea.vue')//专区列表

const ShortVideo = () => import(/* webpackChunkName: "shortVideo" */ '@/pages/shortVideo/index')//搜索页面；
const Course = () => import(/* webpackChunkName: "course" */ '@/pages/course/index.vue')//课程详情
const Classify = () => import(/* webpackChunkName: "classify" */ '@/pages/classify/index.vue')//搜索页面；
const CourseOrder = () => import(/* webpackChunkName: "courseOrder" */ '@/pages/course/CourseOrder')//课程下单页面
const CourseOrderSuccess = () => import(/* webpackChunkName: "courseOrderSuccess" */ '@/pages/course/courseOrderSuccess')//购买成功
const CollectionOrder = () => import(/* webpackChunkName: "collectionOrder" */ '@/pages/course/collectionOrder')//合集下单页面
const CollectionOrderSuccess = () => import(/* webpackChunkName: "collectionOrderSuccess" */ '@/pages/course/collectionOrderSuccess')//合集购买成功
const CourseList = () => import(/* webpackChunkName: "courseList" */ '@/pages/course/courseList')//课程列表
const ShareImgWrap = () => import(/* webpackChunkName: "shareImgWrap" */ '@/pages/user/shareImgWrap')//二维码分享图片容器页面
const InformationDetaul = () => import(/* webpackChunkName: "informationDetaul" */ '@/pages/infoPage/informationDetaul.vue')//资讯详情
const PraiseVideo = () => import(/* webpackChunkName: "bought" */ '@/pages/courseTypePage/praiseVideo')//短视频分享
const Account = () => import(/* webpackChunkName: "account" */ '@/pages/account/Account')//我的账户
const Detail = () => import(/* webpackChunkName: "accountDetail" */ '@/pages/account/Detail')//充值记录
const ReceiveCouponH5 = () => import(/* webpackChunkName: "receiveCouponH5" */ '@/pages/coupon/coupon')//领取优惠券H5
const CouponCourse = () => import(/* webpackChunkName: "couponCourse" */ '@/pages/coupon/couponCourse')//指定课程优惠券课程列表页
const error = () => import(/* webpackChunkName: "error" */ '@/components/error.vue')//404

//补漏；
const ReceiveLearnCard = () => import(/* webpackChunkName: "receiveLearnCard" */ '@/pages/learningCard/receiveLearnCard')//领取学习卡
Vue.use(Router)

export default new Router({
  routes: [
    {
			path:'/error',
			component:error
		},
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      beforeEnter: limitNotLogin,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: limitNotLogin,
    },
    {
      path:'/register',
      component: Register,
      beforeEnter: limitNotLogin,
      name:'Register'
    },
    {
      path:'/forget',
      component: Forget,
      beforeEnter: limitNotLogin,
      name:'Forget',
    },
    {
      path: '/user',
      name: 'User',
      component: User,
    },
    {
      path: '/bought',
      component: UserWrap,
      children:[
        {
          path: '/',
          name: 'Bought',
          component: Bought,
          // beforeEnter: limitLogin,
          meta:{
          showMenu: true,
          current: 'bought',
        }
        },
      ]
    },    
    {
      path: '/user/purchaseHistory',
      name: 'PurchaseHistory',
      component: PurchaseHistory,
    },
    {
      path: '/user/share/imgwrap',
      name: 'shareImgWrap',
      component: ShareImgWrap,
    },
    {
      path:'/search',
      name:'Search',
      component: Search,
    },
    {
      path: '/search/result/:keywords',
      name:'Result',
      component: Result,
    },
    {
      path: '/user/receiveLearnCard',
      name: 'receiveLearnCard',
      component: ReceiveLearnCard,
    },    
    {
      path:'/assemble/list',
      name:'assembleList',
      component:AssembleList,
      meta:{
        current: 'assemble',
      },
    },
    {
      path:'/assemble/openAssemble/:assembleId',
      name:'openAssemble',
      component:OpenAssemble
    },
    {
      path:'/assemble/joinAssemble/:assembleId',
      name:'openAssemble',
      component:JoinAssemble
    },
    {
      path:'/assemble/myAssembleList',
      name:'myAssembleList',
      component:MyAssembleList
    },
    {
      //小视频
      path: '/shortVideo',
      name: 'shortVideo',
      component: ShortVideo
    },
    {
      path:'/course/:courseId',
      name:'course',
      component:Course
    },
    {
      path:'/course/order/:courseId',
      name:'courseOrder',
      component:CourseOrder,
    },
    {
      path:'/course/order/Success/:courseId',
      name:'courseOrderSuccess',
      component:CourseOrderSuccess
    },
    {
      path:'/collection/order',
      name:'collectionOrder',
      component:CollectionOrder,
    },
    {
      path:'/collection/order/success',
      name:'collectionOrderSuccess',
      component:CollectionOrderSuccess,
    },
    {
      path:'/courseList',
      name:'CourseList',
      component:CourseList,
    },
    {
      path: '/user/account',
      name: 'Account',
      component: Account,
    },
    {
      path: '/user/detail',
      name: 'Detail',
      component: Detail,
      meta:{
        headerTitle:'充值记录'
      }
    },
    {
      //分类
      path: '/classify',
      name: 'classify',
      component: Classify
    },
    {
      //专区列表
      path: '/specialArea',
      name: 'specialArea',
      component: SpecialArea
    },
    // {
    //   //轮播图资讯
    //   path: '/informationDetaul',
    //   name: 'informationDetaul',
    //   component: InformationDetaul
    // },
    {
      path:'/infromation/infromDetails/:informationId',
      name:'infromDetails',
      component:InformationDetaul,
    },
    {
      path: '/praiseVideo/:id',
      component: PraiseVideo,
      meta:{
        showMenu: true,
        current: 'praiseVideo',
      }
    },
    {
      path:'/ReceiveCouponH5',
      name:'ReceiveCouponH5',
      component: ReceiveCouponH5,
    },
    {
			path:'/couponCourse',
      name:'couponCourse',
      component: CouponCourse,
		},
  ]
})
