
import Layout from '../views/layout/Layout'
import EmptyLayout from '../views/layout/empty'
export const staticRoutes = [
    {
        path: '/login',
        component: () =>import('@/views/login/index'),
        hidden: true,
        meta:{}
    },
    {
        path: '/',
        component: Layout,
        redirect: '/appManagementHome',
        meta:{}
    },
    {
        path: '/appManagementHomeManage',
        component: Layout,
        meta:{
            childrenLength:1
        },
        children: [
            {
                path: '/appManagementHome',
                component: () =>import('@/views/app/appHome'),
                name: 'appManagementHome',
                hidden:false,
                meta: {
                    title: '首页',
                    icon: 'icon-home',
                    type: 'appManagementHome',
                },
            }
        ]
    },
    {
        path: '/404',
        component: () =>import('@/views/404'),
        hidden: true,
        meta:{}
    }
]
export const dynamicRoutes = [
    {
        path: '/courseManage',
        component: Layout,
        meta: {
            title: '课程',
            icon: 'icon-course',
            code:'course',
            childrenLength:11
        },
        children: [
            {
                path: '/courseCopy',
                component: () =>import('@/views/course/courseList/indexCopy'),
                name: 'courseList',
                hidden:false,
                meta: {
                    title: '课程管理',
                    code:'course:course'
                },
            },
            {
                path: '/courseChannel',
                component: () =>import('@/views/course/courseList/channel'),
                name: 'courseList',
                hidden:false,
                meta: {
                    title: '课程渠道设置',
                    code:'course:channel'
                },
            },
            {
                path: '/courseIDmatch',
                component: () =>import('@/views/course/courseList/courseIDmatching'),
                name: 'courseIDmatch',
                hidden:false,
                meta: {
                    title: '小鹅通课程ID匹配',
                    code:'course:xiaoerelation'
                },
            },
            {
                path: '/courseIDmatchHw',
                component: () =>import('@/views/course/courseList/courseIDmatchingHw'),
                name: 'courseIDmatchHw',
                hidden:true,
                meta: {
                    title: '华为教育课程ID匹配',
                    code:'course:xiaoerelation'
                },
            },
            {
                path: '/courseprogress',
                component: () =>import('@/views/course/courseList/progressPage'),
                name: 'courseprogress',
                hidden:true,
                meta: {
                    title: '进度查询',
                    code:'course:course'
                },
            },
            {
                path: '/courseLableModel',
                component: () =>import('@/views/course/courseList/courseLableModel'),
                name: 'courseList',
                hidden:true,
                meta: {
                    title: '课程标签',
                    code:'course:course'
                },
            },
            {
                path: '/course/manageCopy/:id',
                component: () =>import('@/views/course/create/courseDetailsCopy'),
                name: 'courseDetails',
                hidden:true,
                meta: {
                    title: '课程详情',
                    code:'course:course'
                }
            },
            {
                path: '/course/manageCopy/:id/handle-period',
                component: () =>import('@/views/course/create/createPeriodCopy'),
                name: 'createPeriod',
                hidden:true,
                meta: {
                    title: '新增课时',
                    code:'course:course'
                }
            },
            {
                path: '/course/manageCopy/:id/handle-period/:pid',
                component: () =>import('@/views/course/create/createPeriodCopy'),
                name: 'editorPeriod',
                hidden:true,
                meta: {
                    title: '编辑课时',
                    code:'course:course'
                }
            },
            {
                path: '/course/manageCopy/:id/:pid',
                component: () =>import('@/views/course/create/createPeriodCopy'),
                name: 'editorPeriod',
                hidden:true,
                meta: {
                    title: '新增课时',
                    code:'course:course'
                }
            },
            {
                path: '/course/manageCopy/:id/period-preview/:pid',
                component: () =>import('@/views/course/create/periodPreviewCopy'),
                name: 'periodPreview',
                hidden:true,
                meta: {
                    title: '课时预览',
                    code:'course:course'
                }
            },
            {
                path: '/course/editorCopy/:id',
                component: () =>import('@/views/course/create/indexCopy'),
                name: 'courseEditor',
                hidden: true,
                meta: {
                    title: '编辑课程',
                    code:'course:course'
                }
            },
            {
                path: '/course/createCopy',
                component: () =>import('@/views/course/create/indexCopy'),
                name: 'courseCreate',
                hidden: true,
                meta: {
                    title: '新建课程',
                    code:'course:course'
                }
            },
        ],
    },
    {
        path: '/resourceManage',
        component: Layout,
        meta: {
            title: '素材',
            icon: 'icon-resource',
            code:'source',
            childrenLength:11
        },
        children:[
            {
                path: '/resource/teacher',
                component: () => import('@/views/resource/teacher/index'),
                name: 'teacherResourceList',
                hidden:false,
                meta: {
                    title: '教师库',
                    code:'source:teacher'
                }
            },
            {
                path: '/resource/teacher/create',
                component: () =>import('@/views/resource/teacher/createTeacher'),
                name: 'teacherResourceAdd',
                hidden: true,
                meta: {
                    title: '添加新教师',
                    code:'source:teacher'
                }
            },
            {
                path: '/resource/teacher/:id',
                component: () =>import('@/views/resource/teacher/createTeacher'),
                name: 'teacherResourceEditor',
                hidden: true,
                meta: {
                    title: '编辑教师',
                    code:'source:teacher'
                }
            },
            {
                path: '/resource/video',
                component: () =>import('@/views/resource/video/index'),
                name: 'videoResourceList',
                hidden:false,
                meta: {
                    title: '视频库',
                    code:'source:video'
                }
            },
            {
                path: '/resource/video/uploadMedia',
                component: () =>import('@/views/resource/video/uploadMedia'),
                name: 'videoResourceAdd',
                hidden: true,
                meta: {
                    title: '添加新视频',
                    code:'source:video'
                }
            },
            {
                path: '/resource/video/create',
                component: () =>import('@/views/resource/video/createVideo'),
                name: 'videoResourceAdd',
                hidden: true,
                meta: {
                    title: '添加新视频',
                    code:'source:video'
                }
            },
            //视频上传新方法---ljm
            {
                path: '/resource/video/createAli',
                component: () =>import('@/views/resource/video/createVideoAli'),
                name: 'videoResourceAdd',
                hidden: true,
                meta: {
                    title: '添加新视频',
                    code:'source:video'
                }
            },
            {
                path: '/resource/video/:id',
                component: () =>import('@/views/resource/video/createVideo'),
                name: 'videoResourceEditor',
                hidden: true,
                meta: {
                    title: '编辑视频',
                    code:'source:video'
                }
            },
            {
                path: '/resource/shortVideo',
                component: () =>import('@/views/resource/shortVideo/index'),
                name: 'videoResourceList',
                hidden:false,
                meta: {
                    title: '短视频库',
                    code:'source:shortvideo'
                }
            },
            {
                path: '/resource/shortVideoCreate',
                component: () =>import('@/views/resource/shortVideo/createVideo'),
                name: 'videoResourceAdd',
                hidden:true,
                meta: {
                    title: '添加短视频',
                    code:'source:shortvideo'
                }
            },
            {
                path: '/resource/shortVideoCreateByAli',
                component: () =>import('@/views/resource/shortVideo/createVideoAli'),
                name: 'videoResourceAdd',
                hidden:true,
                meta: {
                    title: '添加短视频',
                    code:'source:shortvideo'
                }
            },
            {
                path: '/resource/audio',
                component: () =>import('@/views/resource/audio/index'),
                name: 'audioResourceList',
                hidden:false,
                meta: {
                    title: '音频库',
                    code:'source:audio'
                }
            },
            {
                path: '/resource/audio/create',
                component: () =>import('@/views/resource/audio/createAudio'),
                name: 'audioResourceAdd',
                hidden: true,
                meta: {
                    title: '添加新音频',
                    code:'source:audio'
                }
            },
            {
                path: '/resource/audio/createByAli',
                component: () =>import('@/views/resource/audio/createAudioAli'),
                name: 'audioResourceAdd',
                hidden: true,
                meta: {
                    title: '添加新音频',
                    code:'source:audio'
                }
            },
            {
                path: '/resource/mouldList/exerciseModul',
                component: () =>import('@/views/resource/mouldList/exerciseModul'),
                name: 'videoReExerciseModul',
                hidden:false,
                meta: {
                    title: '分享模板',
                    code:'source:sharemould'
                }
            }
        ],
    },
    {
        path: '/talentShowManage',
        component: Layout,
        meta: {
            title: '国学达人计划',
            icon: 'icon-card',
            code:'expertplan',
            childrenLength:3
        },
        children: [
            {
                path: '/talentShow/talentCourseSet',
                component: () =>import('@/views/talentShow/talentCourseSet'),
                name: 'programList',
                hidden:false,
                meta: {
                    title: '成为达人课程设置',
                    icon: 'icon-comment',
                    code:'expertplan:course'
                },
            },
            {
                path: '/talentShow/carnival',
                component: () =>import('@/views/talentShow/carnival'),
                name: 'programList',
                hidden:false,
                meta: {
                    title: '达人狂欢节课程设置',
                    icon: 'icon-comment',
                    code:'expertplan:carnival'
                },
            },
            {
                path: '/talentShow/ambassadorUser',
                component: () =>import('@/views/talentShow/ambassadoruser'),
                name: 'programList',
                hidden:false,
                meta: {
                    title: '达人/大使用户管理',
                    icon: 'icon-comment',
                    code:'expertplan:user'
                },
            },
            {
                path:'/talentShow/addCarnival',
                component: () =>import('@/views/talentShow/addCarnival'),
                name:'commodity',
                hidden:true,
                meta: { 
                    title: '添加狂欢节',
                    icon: 'icon-order',
                    code:'goodsthings:goods'
                }
            },
            {
                path:'/talentShow/equity',
                component: () =>import('@/views/talentShow/equity'),
                name:'commodity',
                hidden:false,
                meta: { 
                    title: '达人/大使权益管理',
                    icon: 'icon-order',
                    code:'expertplan:potence'
                }
            },
            {
                path:'/talentShow/removeList',
                component: () =>import('@/views/talentShow/removeList'),
                name:'creatCommodity',
                hidden:true,
                meta: {
                    title: '用户列表页',
                    icon: 'icon-order',
                    code:'expertplan:user'
                }
            },
            {
                path:'/talentShow/removeTableList',
                component: () =>import('@/views/talentShow/removeTableList'),
                name:'creatCommodity',
                hidden:true,
                meta: {
                    title: '清理记录',
                    icon: 'icon-order',
                    code:'expertplan:user'
                }
            }
        ]
    },


    // {
    //     path:'/goods',
    //     component:Layout,
    //     meta:{
    //         title: '国学好物',
    //         icon: 'icon-resource',
    //         code:'homeset',
    //         childrenLength:2
    //     },
    //     children:[
    //         {
    //             path:'/goodsPageSetting',
    //             component: () =>import('@/views/app/goodsPageSetting'),
    //             hidden:false,
    //             meta:{
    //                 title:'商品页管理',
    //                 icon:'icon-resource',
    //                 code:'homeset:appadult',
    //                 module:[
    //                     {
    //                         des:'',
    //                         tips:[],
    //                         type:'1',
    //                         flag:'goods',
    //                         list:[
    //                             {key:'banner',value:'banner设置'},
    //                             {key:'goods',value:'商品'},
    //                         ]
    //                     },
    //                 ]
    //             },
    //             children: [
    //                 {
    //                     path: '/goods/goodsPageSetting',
    //                     component: () =>import('@/views/app/goodsPageSetting'),
    //                     meta: {
    //                         title: '',
    //                         code:'homeset:appadult'
    //                     }
    //                 }
    //             ]
    //         },
    //     ]
    // },


    {
        path: '/homeCreatManage',
        component: Layout,
        meta: {
            title: '首页设置',
            icon: 'icon-resource',
            code:'homeset',
            childrenLength:5
        },
        children:[
            {
                path:'/adultHomeSetting',
                component: () =>import('@/views/app/adultHomeSetting'),
                hidden:false,
                meta:{
                    title:'APP成人版系统设置',
                    icon:'icon-resource',
                    code:'homeset:appadult',
                    module:[
                        {
                            des:'模块一',
                            tips:['该模块主要是无二级列表模块，','包含：banner、分类/标签导航、通栏广告、通栏课、自定义模块；','可根据模块中不同样式组合不同展示效果。'],
                            type:'1',
                            flag:'appAdult',
                            list:[
                                {key:'banner',value:'banner设置'},
                                {key:'classifyNav',value:'分类导航'},
                                {key:'advertising',value:'通栏广告'},
                                {key:'live',value:'课程直播'},
                                {key:'columnsCourse',value:'通栏课'},
                                {key:'guessLike',value:'猜你喜欢'},
                                {key:'customize',value:'自定义'},
                                {key:'ranking',value:'榜单课程'},
                                {key:'giveLesson',value:'赠课活动'}
                            ]
                        },
                        {
                            des:'模块二',
                            tips:['该模块主要是有固定二级列表模块，','包含：限时专区、热门课程、免费专区、资讯、专题、分类/标签模块；','可根据模块中不同样式组合不同展示效果。','限时专区和资讯模块支持手动二级列表展示内容的设置，','该设置需到限时购和资讯列表中设置。'],
                            type:'2',
                            flag:'appAdult',
                            list:[
                                {key:'timeZone',value:'限时专区'},
                                {key:'freeZone',value:'免费专区'},
                                {key:'popularCourses',value:'热门课程'},
                                {key:'consult',value:'资讯'},
                                {key:'special',value:'专题'},
                                {key:'classify',value:'分类'},
                                {key:'tag',value:'标签'},
                                {key:'knowledge',value:'知识点'},
                                {key:'assemble',value:'拼团专区'},
                                {key:'goods',value:'商品'}
                            ]
                        }
                    ]
                },
                children: [
                    {
                        path: '/homeCreatManage/adultHomeSetting',
                        component: () =>import('@/views/app/adultHomeSetting'),
                        meta: {
                            title: '',
                            code:'homeset:appadult'
                        }
                    }
                ]
            },
            {
                path:'/childHomeSetting',
                component: () =>import('@/views/app/childHomeSetting'),
                hidden:false,
                meta:{
                    title:'APP少儿版系统设置',
                    icon:'icon-resource',
                    code:'homeset:appchildren',
                    module:[
                        {
                            des:'模块一',
                            type:'1',
                            flag:'appChild',
                            tips:['该模块主要是无二级列表模块,','包含：banner、分类/标签导航、最新上线、专题、免费课程、热门话题、限时专区模块；','可根据模块中不同样式组合不同展示效果。'],
                            list:[
                                {key:'banner',value:'banner设置'},
                                {key:'classifyNav',value:'分类导航'},
                                {key:'newOnline',value:'最新上线'},
                                {key:'timeZone',value:'限时专区'},
                                {key:'freeCourse',value:'免费课程'},
                                {key:'hotTopic',value:'热门话题'},
                                {key:'special',value:'专题'},
                                {key:'advertising',value:'通栏广告'},
                                {key:'live',value:'课程直播'},
                                {key:'seriesCourse',value:'系列课程'},
                                {key:'giveLesson',value:'赠课活动'}
                            ]
                        },
                        {
                            des:'模块二',
                            type:'2',
                            flag:'appChild',
                            tips:['该模块主要是有固定二级列表模块，','包含：免费专区、名师推荐、分类、标签；','可根据模块中不同样式组合不同展示效果。'],
                            list:[
                                {key:'freeZone',value:'免费专区'},
                                {key:'commend',value:'名师推荐'},
                                {key:'classify',value:'分类'},
                                {key:'tag',value:'标签'},
                                {key:'knowledge',value:'知识点'},
                                {key:'assemble',value:'拼团专区'},
                                {key:'goods',value:'商品'}
                            ]
                        }
                    ]
                },
                children: [
                    {
                        path: '/homeCreatManage/childHomeSetting',
                        component: () =>import('@/views/app/childHomeSetting'),
                        meta: {
                            title: '',
                            code:'homeset:appchildren'
                        }
                    }
                ]
            },
            {
                path:'/mpAdultHomeSetting',
                component: () =>import('@/views/app/mpWeixinAdultHomeSetting'),
                hidden:false,
                meta:{
                    title:'小程序成人首页设置',
                    icon:'icon-resource',
                    code:'homeset:appadult',
                    module:[
                        {
                            des:'模块一',
                            tips:['该模块主要是无二级列表模块，','包含：banner、分类/标签导航、通栏广告、通栏课、自定义模块；','可根据模块中不同样式组合不同展示效果。'],
                            type:'1',
                            flag:'appAdult',
                            list:[
                                {key:'banner',value:'banner设置'},
                                {key:'classifyNav',value:'分类导航'},
                                {key:'advertising',value:'通栏广告'},
                                {key:'columnsCourse',value:'通栏课'},
                                {key:'customize',value:'自定义'},
                            ]
                        },
                        {
                            des:'模块二',
                            tips:['该模块主要是有固定二级列表模块，','包含：限时专区、热门课程、免费专区、分类/标签模块；','可根据模块中不同样式组合不同展示效果。','限时专区和资讯模块支持手动二级列表展示内容的设置，','该设置需到限时购和资讯列表中设置。'],
                            type:'2',
                            flag:'appAdult',
                            list:[
                                {key:'timeZone',value:'限时专区'},
                                {key:'freeZone',value:'免费专区'},
                                {key:'popularCourses',value:'热门课程'},
                                {key:'classify',value:'分类'},
                                {key:'tag',value:'标签'},
                                {key:'assemble',value:'拼团专区'},
                            ]
                        }
                    ]
                },
                children: [
                    {
                        path: '/homeCreatManage/mpAdultHomeSetting',
                        component: () =>import('@/views/app/mpWeixinAdultHomeSetting'),
                        meta: {
                            title: '',
                            code:'homeset:appadult'
                        }
                    }
                ]
            },
            {
                path:'/mpChildHomeSetting',
                component: () =>import('@/views/app/mpWeixinChildHomeSetting'),
                hidden:false,
                meta:{
                    title:'小程序少儿首页设置',
                    icon:'icon-resource',
                    code:'homeset:appletchildren',
                    module:[
                        {
                            des:'模块一',
                            type:'1',
                            flag:'appChild',
                            tips:['该模块主要是无二级列表模块,','包含:分类导航、通栏广告','可根据模块中不同样式组合不同展示效果。'],
                            list:[
                                {key:'classifyNav',value:'分类导航'},
                                {key:'advertising',value:'通栏广告'},
                            ]
                        },
                        {
                            des:'模块二',
                            type:'2',
                            flag:'appChild',
                            tips:['该模块主要是有固定二级列表模块，','包含：名师推荐、分类','可根据模块中不同样式组合不同展示效果。'],
                            list:[
                                {key:'classify',value:'分类'},
                                {key: 'commend', value: '名师推荐' },
                                {key:'timeZone',value:'限时专区'},
                                {key:'assemble',value:'拼团专区'},
                            ]
                        }
                    ]
                },
                children: [
                    {
                        path: '/homeCreatManage/mpChildHomeSetting',
                        component: () =>import('@/views/app/mpWeixinChildHomeSetting'),
                        meta: {
                            title: '',
                            code:'homeset:appletchildren'
                        }
                    }
                ]
            },
            {
                path: '/homeCreatManage/pcPageHome',
                component: () =>import('@/views/app/pcPageHome'),
                name: 'pcPageHome',
                hidden:false,
                meta: {
                    title: 'PC成人版在线系统设置',
                    code:'homeset:pcadult'
                }
            },
            {
                path: '/homeCreatManage/pcChildrenPageHome',
                component: () =>import('@/views/app/pcChildrenPageHome'),
                name: 'pcChildrenPageHome',
                hidden:false,
                meta: {
                    title: 'PC少儿版在线系统设置',
                    code:'homeset:pcchildren'
                }
            }
        ],
    },
    {
        path: '/wechatH5Manage',
        component: Layout,
        meta: {
            title: '微页面',
            icon: 'icon-resource',
            code:'micropage',
            childrenLength:2
        },
        children:[
            {
                path:'/wechatH5/creatWechatPage',
                component: () =>import('@/views/wechatH5/creatWechatPage'),
                hidden:false,
                meta:{
                    title:'模块组件',
                    icon:'icon-resource',
                    code:'micropage:collocation',
                    module:[
                        {
                            des:'',
                            tips:[''],
                            type:'1',
                            flag:'wxModel',
                            list:[
                                {key:1,value:'标题'},
                                {key:2,value:'图片'},
                                {key:3,value:'课程'},
                                {key:4,value:'课程分组'},
                                {key:5,value:'魔方'},
                                {key:6,value:'视频'}
                            ]
                        }
                    ]
                },
                children: [
                    {
                        path: '/wechatH5/creatWechatPage',
                        component: () =>import('@/views/wechatH5/creatWechatPage'),
                        meta: {
                            title: '',
                            code:'homeset:appadult'
                        }
                    }
                ]
            },
            {
                path: '/wechatH5/tableList',
                component: () => import('@/views/wechatH5/tableList'),
                name: 'wxTableList',
                hidden: false,
                meta: {
                    title: "微页面表单",
                    code:'micropage:micropage'
                }
            }
            // {
            //     path: '/wechatH5/creatWechatPage',
            //     component: () => import('@/views/wechatH5/creatWechatPage'),
            //     name: 'creatWechatPage',
            //     hidden: true,
            //     meta: {
            //         title: "微页面",
            //         code:'admin:appversion:add'
            //     }
            // }
        ],
    },
    {
        path: '/screenIndexManage',
        component: Layout,
        meta:{
            code:'activity',
            childrenLength:1
        },
        children: [
            {
                path: '/screenIndex/equite',
                component: () =>import('@/views/screenSetUp/index'),
                name: 'screenIndex',
                hidden:false,
                meta: {
                    title: '大屏设置',
                    icon: 'icon-marketelist',
                    code:'wisdomscreen'
                }
            },
            {
                path: '/screenIndex/screenHome',
                component: () =>import('@/views/screenSetUp/screenHome'),
                name: 'screenHome',
                hidden:true,
                meta: {
                    title: '首页设置',
                    icon: 'icon-user',
                    code:'wisdomscreen'
                }
            },
            {
                path: '/screenIndex/screenSetUp',
                component: () =>import('@/views/screenSetUp/setUpPage'),
                name: 'screenSetUp',
                hidden:true,
                meta: {
                    title: '开屏',
                    icon: 'icon-user',
                    code:'wisdomscreen'
                }
            }
        ]
    },
    {
        path: '/alumniCircleManage',
        component: Layout,
        meta:{
            code:'alumnicircle',
            childrenLength:3,
            title: '学友圈',
            icon: 'icon-comment',
        },
        children: [
            {
                path: '/alumniCircle/saySomething',
                component: () =>import('@/views/contentManage/index'),
                hidden:false,
                name: 'comment',
                meta: {
                    title: '说说管理',
                    icon: 'icon-comment',
                    type: 'comment',
                    code:'alumnicircle:classmatesmsg'
                },
            },
            {
                path: '/alumniCircle/topicManagementList',
                component: () =>import('@/views/topicManagement/topicManagementList'),
                name: 'topicManagementList',
                hidden:false,
                meta: {
                    title: '话题管理',
                    icon: 'icon-marketelist',
                    code:'alumnicircle:topic'
                }
            },
            {
                path: '/alumniCircle/appCommentManagement',
                component: () =>import('@/views/comment/AppCommentManagement'),
                name: 'appCommentManagement',
                hidden:false,
                meta: {
                    title: '学友圈评论',
                    icon: 'icon-moneyrecord',
                    code:'alumnicircle:classmatesmsgcomment'
                }
            },
            {
                path: '/alumniCircle/reportDetails',
                component: () =>import('@/views/contentManage/complain'),
                hidden:true,
                name: 'complain',
                meta: {
                    title: '举报',
                    icon: 'icon-comment',
                    type: 'complain',
                    code:'alumnicircle:classmatesmsg'
                },
            },
            {
                path: '/alumniCircle/topicManage/addTopic',
                component: () =>import('@/views/topicManagement/addTopicManagement'),
                name: 'addTopicManagement',
                hidden:true,
                meta: {
                    title: '话题设置',
                    icon: 'icon-user',
                    code:'alumnicircle:topic'
                }
            }
        ]
    },
    {
        path: '/classifyManage',
        component: Layout,
        meta:{
            title: '分类管理',
            icon: 'icon-classify',
            code:'classify',
            childrenLength:3
        },
        children: [
            {
                path: '/classifyAdd',
                component: () =>import('@/views/classifyManage/index'),
                name: 'classify',
                hidden:false,
                meta: {
                    title: '添加分类',
                    code:'classify:classify'
                }
            },
            {
                path: '/classifiyTwoLevelAdult',
                component: () =>import('@/views/classifyManage/adultTwoLevelSetting'),
                name: 'classifiy',
                hidden:true,
                meta: {
                    title: 'APP成人二级页分类设置',
                    code:'classify:appadultsecond'
                }
            },
            {
                path: '/classifiyTwoLevelChild',
                component: () =>import('@/views/classifyManage/childTwoLevelSetting'),
                name: 'classifiy',
                hidden:true,
                meta: {
                    title: 'APP少儿二级页分类设置',
                    code:'classify:appchildrensecond'
                }
            },
            {
                path: '/classifiyTwoPage/:id',
                component: () =>import('@/views/classifyManage/classlyTwoPage'),
                name: 'classifiy',
                hidden:true,
                meta: {
                    title: '二级分类',
                    code:'classify:appchildrensecond'
                }
            }
        ]
    },
    {
        path: '/labelManage',
        component: Layout,
        meta:{
            title: '标签管理',
            icon: 'icon-classify',
            code:'label',
            childrenLength:3
        },
        children: [
            {
                path: '/labelsAdd',
                component: () =>import('@/views/labelManage/index'),
                name: 'labels',
                hidden:false,
                meta: {
                    title: '添加标签',
                    code:'label:label'
                }
            },
            {
                path: '/labelsTwoLevelAdult',
                component: () =>import('@/views/labelManage/adultTwoLevelTagSetting'),
                name: 'labels',
                hidden:true,
                meta: {
                    title: 'APP成人二级页标签设置',
                    code:'label:appadultsecond'
                }
            },
            {
                path: '/labelsTwoLevelChild',
                component: () =>import('@/views/labelManage/childTwoLevelTagSetting'),
                name: 'labels',
                hidden:true,
                meta: {
                    title: 'APP少儿二级页标签设置',
                    code:'label:appchildrensecond'
                }
            }
        ]
    },
    {
        path: '/questionBank',
        component: Layout,
        meta:{
            code:'questionbank',
            childrenLength:1
        },
        children: [
            {
                path: '/questionBank',
                component: () =>import('@/views/questionBankManagement/list'),
                name: 'schoolManage',
                hidden:false,
                meta: {
                    title: '题库管理',
                    icon: 'icon-classify',
                    code:'questionbank'
                }
            },
            {
                path: '/questionBank/update',
                component: () =>import('@/views/questionBankManagement/update'),
                name: 'schoolEditList',
                hidden:true,
                meta: {
                    title: '添加题目',
                    icon: 'icon-classify',
                    code:'questionbank'
                }
            },
            {
                path: '/questionBank/checkList',
                component: () =>import('@/views/questionBankManagement/checkList'),
                name: 'schoolEditList',
                hidden:true,
                meta: {
                    title: '添加题目',
                    icon: 'icon-classify',
                    code:'questionbank'
                }
            }
        ]
    },
    {
        path: '/xgxWisdomManage',
        component: Layout,
        meta: {
            title: '国学智慧平台',
            icon: 'icon-card',
            code:'wisdomplatform',
            childrenLength:3
        },
        children: [
            {
                path: '/xgxWisdom/indexxOne',
                component: () =>import('@/views/xgxWisdom/indexxOne'),
                name: 'programList',
                hidden:false,
                meta: {
                    title: 'B端课程管理',
                    icon: 'icon-comment',
                    code:'wisdomplatform:course'
                },
            },
            {
                path: '/xgxWisdom/indexxTwo',
                component: () =>import('@/views/xgxWisdom/indexxTwo'),
                name: 'programList',
                hidden:false,
                meta: {
                    title: '国学智慧名句',
                    icon: 'icon-comment',
                    code:'wisdomplatform:sentence'
                },
            },
            {
                path: '/xgxWisdom/indexxThree',
                component: () =>import('@/views/xgxWisdom/indexxThree'),
                name: 'programList',
                hidden:false,
                meta: {
                    title: '账号续费订单',
                    icon: 'icon-comment',
                    code:'wisdomplatform:order'
                },
            },
            {
                path:'/xgxWisdom/creatWisdom',
                component: () =>import('@/views/xgxWisdom/creatWisdom'),
                name:'commodity',
                hidden:true,
                meta: { 
                    title: '创建B端课程',
                    icon: 'icon-order',
                    code:'wisdomplatform:course'
                }
            },
            {
                path:'/xgxWisdom/indexxFour',
                component: () =>import('@/views/xgxWisdom/indexxFour'),
                name:'commodity',
                hidden:false,
                meta: { 
                    title: '账号续费设置',
                    icon: 'icon-order',
                    code:'wisdomplatform:renew'
                }
            },
            {
                path:'/xgxWisdom/userList',
                component: () =>import('@/views/xgxWisdom/userList'),
                name:'creatCommodity',
                hidden:true,
                meta: {
                    title: '用户列表页',
                    icon: 'icon-order',
                    code:'wisdomplatform:course'
                }
            },
            {
                path:'/xgxWisdom/typeList',
                component: () =>import('@/views/xgxWisdom/typeList'),
                name:'creatCommodity',
                hidden:false,
                meta: {
                    title: '分类管理',
                    icon: 'icon-order',
                    code:'wisdomplatform:classifies'
                }
            },
            {
                path:'/xgxWisdom/styleList',
                component: () =>import('@/views/xgxWisdom/styleList'),
                name:'creatCommodity',
                hidden:true,
                meta: {
                    title: '分类列表',
                    icon: 'icon-order',
                    code:'wisdomplatform:course'
                }
            }
        ]
    },
    {
        path: '/classificationManage',
        component: Layout,
        meta: {
            title: '国学好物',
            icon: 'icon-card',
            code:'goodsthings',
            childrenLength:4
        },
        children: [
            {
                path:'/classification/goodsPageSetting',
                component: () =>import('@/views/goodThings/goodsPageSetting'),
                hidden:false,
                meta:{
                    title:'商品页管理',
                    icon:'icon-resource',
                    code:'goodsthings:goodspage',
                    module:[
                        {
                            des:'',
                            tips:[],
                            type:'1',
                            flag:'goods',
                            list:[
                                {key:'banner',value:'banner设置'},
                                {key:'goods',value:'商品'},
                            ]
                        },
                    ]
                },
                children: [
                    {
                        path: '/goods/goodsPageSetting',
                        component: () =>import('@/views/goodThings/goodsPageSetting'),
                        meta: {
                            title: '',
                            code:'goodsthings:goodspage'
                        }
                    }
                ]
            },
            {
                path: '/classification/commodityClassification',
                component: () =>import('@/views/goodThings/commodityClassification'),
                name: 'programList',
                hidden:false,
                meta: {
                    title: '商品分类管理',
                    icon: 'icon-comment',
                    code:'goodsthings:goodsclassify'
                },
            },
            // {
            //     path:'/commedOrder',
            //     component: () =>import('@/views/goodThings/commedOrder'),
            //     name:'commedOrder',
            //     hidden:false,
            //     meta: {
            //         title: '商品订单',
            //         icon: 'icon-order',
            //         code:'record:monthmember'
            //     }
            // },
            {
                path:'/classification/commodity',
                component: () =>import('@/views/goodThings/commodityManage'),
                name:'commodity',
                hidden:false,
                meta: {
                    title: '商品管理',
                    icon: 'icon-order',
                    code:'goodsthings:goods'
                }
            },
            {
                path:'/classification/creatCommodity',
                component: () =>import('@/views/goodThings/creatCommodity'),
                name:'creatCommodity',
                hidden:true,
                meta: {
                    title: '商品管理',
                    icon: 'icon-order',
                    code:'record:monthmember'
                }
            }
        ]
    },
    {
        path: '/exchangeManage',
        component: Layout,
        meta: {
            title: '兑换商城',
            icon: 'icon-card',
            code:'goodsthings',
            childrenLength:4
        },
        children: [
            {
                path: '/exchange/indexList',
                component: () =>import('@/views/exchange/indexList'),
                name: 'programList',
                hidden:false,
                meta: {
                    title: '商品列表',
                    icon: 'icon-comment',
                    code:'goodsthings:goodsclassify'
                },
            },
            {
                path:'/exchange/exchangeList',
                component: () =>import('@/views/exchange/exchangeList'),
                name:'commodity',
                hidden:false,
                meta: {
                    title: '兑换订单',
                    icon: 'icon-order',
                    code:'goodsthings:goods'
                }
            },
            {
                path:'/exchange/creatExchange',
                component: () =>import('@/views/exchange/creatExchange'),
                name:'creatCommodity',
                hidden:true,
                meta: {
                    title: '创建商品',
                    icon: 'icon-order',
                    code:'record:monthmember'
                }
            }
        ]
    },
    // {
    //     path: '/H5Manage',
    //     component: Layout,
    //     meta: {
    //         title: 'H5课程管理',
    //         icon: 'icon-card',
    //         code:'interact',
    //         childrenLength:4
    //     },
    //     children: [
    //         {
    //             path: '/H5WebView/index',
    //             component: () =>import('@/views/H5/index'),
    //             name: 'programList',
    //             hidden:false,
    //             meta: {
    //                 title: 'H5课程',
    //                 icon: 'icon-comment',
    //                 code:'interact:activity'
    //             },
    //         },
    //         {
    //             path:'/H5WebView/H5Creat/:id',
    //             component: () =>import('@/views/H5/H5Creat'),
    //             name:'commodity',
    //             hidden:true,
    //             meta: {
    //                 title: '创建H5课程',
    //                 icon: 'icon-order',
    //                 code:'interact:activity'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5CreatCourse',
    //             component: () =>import('@/views/H5/H5CreatCourse'),
    //             name:'creatCommodity',
    //             hidden:true,
    //             meta: {
    //                 title: '创建课程',
    //                 icon: 'icon-order',
    //                 code:'interact:activity'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5IntelligenceVal',
    //             component: () =>import('@/views/H5/H5IntelligenceVal'),
    //             name:'creatCommodity',
    //             hidden:true,
    //             meta: {
    //                 title: '孚星/智力值',
    //                 icon: 'icon-order',
    //                 code:'interact:activity'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5Medals',
    //             component: () =>import('@/views/H5/H5Medals'),
    //             name:'creatCommodity',
    //             hidden:true,
    //             meta: {
    //                 title: '勋章设置',
    //                 icon: 'icon-order',
    //                 code:'interact:activity'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5Section/:id/:courseId',
    //             component: () =>import('@/views/H5/H5Section'),
    //             name:'creatCommodity',
    //             hidden:true,
    //             meta: {
    //                 title: '小节管理',
    //                 icon: 'icon-order',
    //                 code:'interact:activity'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5SectionNew/:id/:courseId',
    //             component: () =>import('@/views/H5/H5SectionNew'),
    //             name:'creatCommodity',
    //             hidden:true,
    //             meta: {
    //                 title: '小节管理2',
    //                 icon: 'icon-order',
    //                 code:'interact:activity'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5SectionVersionNew',
    //             component: () =>import('@/views/H5/H5SectionVersionNew'),
    //             name:'creatCommodity',
    //             hidden:true,
    //             meta: {
    //                 title: '版本',
    //                 icon: 'icon-order',
    //                 code:'interact:activity'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5CreatSection',
    //             component: () =>import('@/views/H5/H5CreatSection'),
    //             name:'creatCommodity',
    //             hidden:true,
    //             meta: {
    //                 title: '新建小节',
    //                 icon: 'icon-order',
    //                 code:'interact:activity'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5CreatSectionNew',
    //             component: () =>import('@/views/H5/H5CreatSectionNew'),
    //             name:'creatCommodity',
    //             hidden:true,
    //             meta: {
    //                 title: '新建小节2',
    //                 icon: 'icon-order',
    //                 code:'interact:activity'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5CreatAllSection',
    //             component: () =>import('@/views/H5/H5CreatAllSection'),
    //             name:'creatCommodity',
    //             hidden:true,
    //             meta: {
    //                 title: '新建总结',
    //                 icon: 'icon-order',
    //                 code:'interact:activity'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5SetUp',
    //             component: () =>import('@/views/H5/H5SetUp'),
    //             name:'creatCommodity',
    //             hidden:false,
    //             meta: {
    //                 title: '设置',
    //                 icon: 'icon-order',
    //                 code:'interact:currency'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5UserManage',
    //             component: () =>import('@/views/H5/H5UserManage'),
    //             name:'creatCommodity',
    //             hidden:false,
    //             meta: {
    //                 title: '用户管理',
    //                 icon: 'icon-order',
    //                 code:'interact:userList'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5OrderManage',
    //             component: () =>import('@/views/H5/H5OrderManage'),
    //             name:'creatCommodity',
    //             hidden:false,
    //             meta: {
    //                 title: '订单管理',
    //                 icon: 'icon-order',
    //                 code:'interact:order'
    //             }
    //         },
    //         {
    //             path:'/H5WebView/H5Mail',
    //             component: () =>import('@/views/H5/H5Mail'),
    //             name:'creatCommodity',
    //             hidden:true,
    //             meta: {
    //                 title: '邮寄',
    //                 icon: 'icon-order',
    //                 code:'interact:order'
    //             }
    //         }
    //     ]
    // },
    {
        path: '/schoolManage',
        component: Layout,
        meta:{
            code:'school',
            childrenLength:1
        },
        children: [
            {
                path: '/schoolManage',
                component: () =>import('@/views/schoolManage/index'),
                name: 'schoolManage',
                hidden:false,
                meta: {
                    title: '学校管理',
                    icon: 'icon-classify',
                    code:'school'
                }
            },
            {
                path: '/schoolManage/schoolList',
                component: () =>import('@/views/schoolManage/schoolList'),
                name: 'schoolEditList',
                hidden:true,
                meta: {
                    title: '详情',
                    icon: 'icon-classify',
                    code:'school'
                }
            }
        ]
    },
    {
        path: '/shortVideoManage',
        component: Layout,
        meta:{
            code:'shortvideo',
            childrenLength:1
        },
        children: [
            {
                path: '/shortVideo/list',
                component: () =>import('@/views/shortVideo/list'),
                name: 'shortVideoList',
                hidden:false,
                meta: {
                    title: '短视频系统',
                    icon: 'icon-classify',
                    code:'shortvideo'
                }
            },
        ]
    },
    {
        path: '/liantongManage',
        component: Layout,
        meta:{
            code:'unicom',
            childrenLength:1
        },
        children: [
            {
                path: '/liantongManage/list',
                component: () =>import('@/views/liantong/list'),
                name: 'liantongList',
                hidden:false,
                meta: {
                    title: '联通会员管理',
                    icon: 'icon-classify',
                    code:'unicom:select'
                }
            },
            {
                path: '/liantongManage/data/:id',
                component: () =>import('@/views/liantong/data'),
                name: 'liantongData',
                hidden:true,
                meta: {
                    title: '联通会员管理数据',
                    icon: 'icon-classify',
                    code:'unicom:detail'
                }
            },
            {
                path: '/liantongManage/order/:id',
                component: () =>import('@/views/liantong/order'),
                name: 'liantongOrder',
                hidden:true,
                meta: {
                    title: '联通会员管理订单',
                    icon: 'icon-classify',
                    code:'unicom:order'
                }
            },
            {
                path: '/liantongManage/detail/:id',
                component: () =>import('@/views/liantong/detail'),
                name: 'liantongdetail',
                hidden:true,
                meta: {
                    title: '联通会员管理明细',
                    icon: 'icon-classify',
                    code:'unicom:detail'
                }
            },
        ]
    },
    {
        path: '/isCourseCountManage',
        component: Layout,
        meta: {
            title: '移动积分管理',
            icon: 'icon-hot',
            code:'mobileactivity',
            childrenLength:2
        },
        children:[
            {
                path:'/moveCount/giveMobileMall',
                component: () =>import('@/views/giveLesson/giveMobileMall'),
                name:'giveMobileMall',
                hidden:false,
                meta: {
                    title: '移动积分活动',
                    code:'mobileactivity:activity'
                }
            },
            {
                path: '/moveCount/merchantIDBinde',
                component: () =>import('@/views/giveLesson/merchantIDBinde'),
                name: 'merchantIDBinde',
                hidden:false,
                meta: {
                    title: '商户ID绑定',
                    code:'mobileactivity:relation'
                }
            },
            {
                path: '/moveCount/integralDataStatistics',
                component: () =>import('@/views/giveLesson/integralDataStatistics'),
                name: 'integralDataStatistics',
                hidden:false,
                meta: {
                    title: '积分数据统计',
                    code:'mobileactivity:statistics'
                }
            },
            {
                path: '/moveCount/integralDataSort',
                component: () =>import('@/views/giveLesson/integralDataSort'),
                name: 'integralDataSort',
                hidden:true,
                meta: {
                    title: '观看排行',
                    code:'mobileactivity:statistics'
                }
            },
            {
                path: '/moveCount/integralDetail',
                component: () =>import('@/views/giveLesson/integralDetail'),
                name: 'integralDetail',
                hidden:true,
                meta: {
                    title: '排行详情',
                    code:'mobileactivity:statistics'
                }
            },
            {
                path: '/moveCount/mobilAllDetail',
                component: () =>import('@/views/giveLesson/mobilAllDetail'),
                name: 'mobilAllDetail',
                hidden:false,
                meta: {
                    title: '移动合集订单',
                    code:'mobileactivity:mobilePopupOrder'
                }
            }
        ],
    },
    {
        path: '/shortVideoUpdateManage',
        component: Layout,
        meta:{
            code:'shortvideo',
            childrenLength:1
        },
        children: [
            {
                path: '/shortVideo/update',
                component: () =>import('@/views/shortVideo/update'),
                name: 'shortVideoUpdate',
                hidden:true,
                meta: {
                    title: '新建短视频',
                    icon: 'icon-classify',
                    code:'shortvideo'
                },
            }
        ]
    },
    {
        path: '/commerceManage',
        component: Layout,
        meta:{
            code:'cooperation',
            childrenLength:1
        },
        children: [
            {
                path: '/commerce',
                component: () =>import('@/views/syntheticFiles/commerce'),
                name: 'commerceCooperation',
                hidden:false,
                meta: {
                    title: '商务合作',
                    icon: 'icon-hezuowork',
                    code:'cooperation'
                }
            }
        ]
    },
    {
        path: '/marketeManage',
        component: Layout,
        meta:{
            code:'market',
            childrenLength:1
        },
        children: [
            {
                path: '/marketelistlist',
                component: () =>import('@/views/marketing/marketelistlist'),
                name: 'marketelist',
                hidden:false,
                meta: {
                    title: '系统合集',
                    icon: 'icon-marketelist',
                    code:'market'
                }
            },
            {
                path:'/marketelist/coupon',
                component: () =>import('@/views/marketing/coupon/coupon'),
                name:'markCoupons',
                hidden:true,
                meta: {
                    title: '优惠券',
                    type:'coupon',
                    code:'market:coupon'
                }
            },
            {
                path: '/marketelist/coupon/details',
                component: () => import('@/views/marketing/coupon/couponDetails'),
                name: 'couponDetails',
                hidden: true,
                meta: {
                    title: '优惠券详情',
                    type:'couponDetails',
                    code:'market:coupon'
                }
            },
            {
                path: '/marketelist/coupon/webCoupon',
                component: () =>import('@/views/marketing/coupon/newWebCoupon'),
                name: 'webCoupon',
                hidden: true,
                meta: {
                    title: "新建网站优惠券",
                    type:'webCoupon',
                    code:'market:coupon'
                }
            },
            {
                path: '/marketelist/coupon/appCoupon',
                component: () => import('@/views/marketing/coupon/newAppCoupon'),
                name: 'appCoupon',
                hidden: true,
                meta: {
                    title: "新建课程优惠券",
                    type:'appCoupon',
                    code:'market:coupon'
                }
            },
            {
                path:'/marketelist/activity',
                component: () =>import('@/views/marketing/coupon/couponActivity'),
                name:'couponActivity',
                hidden:true,
                meta: {
                    title: '活动优惠券',
                    type:'activity',
                    code:'market:activitycoupon'
                }
            },
            {
                path: '/marketelist/activity/activityDetails',
                component: () => import('@/views/marketing/coupon/couponActivityDetails'),
                name: 'activityDetails',
                hidden: true,
                meta: {
                    title: '活动优惠券详情',
                    type:'activityDetails',
                    code:'market:activitycoupon:info'
                }
            },
            {
                path: '/marketelist/activity/newActivity',
                component: () => import('@/views/marketing/coupon/couponActivityNew'),
                name: 'newActivity',
                hidden: true,
                meta: {
                    title: '新建活动优惠券',
                    type:'newActivity',
                    code:'market:activitycoupon:add'
                }
            },
            // {
            //     path: '/marketelist/timelimit',
            //     component: () =>import('@/views/marketing/timeLimit/timeLimit'),
            //     name: 'markTimeLimit',
            //     // hidden:false,
            //     hidden:true,
            //     meta: {
            //         title: '限时购1',
            //         type:'timelimit',
            //         code:'market:limited'
            //     }
            // },
            {
                path: '/marketelist/timelimitNew',
                component: () =>import('@/views/marketing/timeLimit/timeLimitNew'),
                name: 'markTimeLimit',
                // hidden:false,
                hidden:true,
                meta: {
                    title: '限时购2',
                    type:'timelimit',
                    code:'market:discounts'
                }
            },
            {
                path: '/marketelist/timelimit/addCourse',
                component: () =>import('@/views/marketing/timeLimit/addCourse'),
                hidden: true,
                name: 'addCourse',
                meta: {
                    title: "新建限时课程1",
                    type:'addCourse',
                    code:'market:limited'
                }
            },
            {
                path: '/marketelist/timelimit/timeLimitNewEdit',
                component: () =>import('@/views/marketing/timeLimit/timeLimitNewEdit'),
                hidden: true,
                name: 'addCourse',
                meta: {
                    title: "新建限时课程2",
                    type:'addCourse',
                    code:'market:discounts'
                }
            },
            {
                path: '/marketelist/timelimit/timeLimitNewSee',
                component: () =>import('@/views/marketing/timeLimit/timeLimitNewSee'),
                hidden: true,
                name: 'addCourse',
                meta: {
                    title: "限时课程查看",
                    type:'addCourse',
                    code:'market:discounts'
                }
            },
            {
                path: '/marketelist/learningCard',
                component: () =>import('@/views/learnCard/learningCard'),
                name: 'userFilesOne',
                // hidden:false,
                hidden:true,
                meta: {
                    title: '学习卡',
                    icon: 'icon-card',
                    code:'market:studycard'
                }
            },
            {
                path: '/marketelist/learningCard/creatLearningCard',
                component: () =>import('@/views/learnCard/creatLearningCard'),
                name: 'userFilesTwo',
                hidden:true,
                meta: {
                    title: '生成学卡',
                    icon: 'icon-user',
                    code:'market:studycard'
                }
            },
            {
                path: '/marketelist/customLearnCard',
                component: () =>import('@/views/learnCard/customLearnCard'),
                name: 'userFilesThree',
                // hidden:false,
                hidden:true,
                meta: {
                    title: '定制精品课系统',
                    icon: 'icon-card',
                    code:'market:studycard'
                }
            },
            {
                path: '/marketelist/customLearnCard/creatCustomLearnCard',
                component: () =>import('@/views/learnCard/creatCustomLearnCard'),
                name: 'userFilesFour',
                hidden:true,
                meta: {
                    title: '生成定制学习卡',
                    icon: 'icon-user',
                    code:'market:studycard'
                }
            },
            {
                path: '/marketelist/member/memberCard',
                component: () =>import('@/views/member/memberCard'),
                hidden:true,
                name: 'member',
                meta: {
                    title: '会员卡',
                    icon: 'icon-comment',
                    type: 'comment',
                    code:'market:member'
                },
            },
            {
                path: '/marketelist/member/memberNew',
                component: () =>import('@/views/member/memberNew'),
                hidden:true,
                name: 'memberNew',
                meta: {
                    title: '生成会员卡',
                    icon: 'icon-comment',
                    type: 'comment',
                    code:'market:member'
                },
            },
            {
                path: '/marketelist/member/customizedCard',
                component: () =>import('@/views/member/customizedCard'),
                hidden:true,
                name: 'customizedCard',
                meta: {
                    title: '定制会员卡',
                    icon: 'icon-comment',
                    type: 'comment',
                    code:'market:membermake'
                },
            },
            {
                path: '/marketelist/member/keyAccountCard',
                component: () =>import('@/views/member/keyAccountCard'),
                hidden:true,
                name: 'keyAccountCard',
                meta: {
                    title: '大客户免费课系统',
                    icon: 'icon-comment',
                    type: 'comment',
                    code:'market:customer'
                },
            },
            {
                path: '/marketelist/member/creatKeyAccountCard',
                component: () =>import('@/views/member/creatKeyAccountCard'),
                hidden:true,
                name: 'creatKeyAccountCard',
                meta: {
                    title: '定制大客户课程包',
                    code:'market:customer:add'
                },
            },
            {
                path: '/marketelist/member/keyAccounDetail',
                component: () =>import('@/views/member/keyAccounDetail'),
                hidden:true,
                name: 'keyAccounDetail',
                meta: {
                    title: '大客户详情',
                    code:'market:customer:findItem'
                },
            },
            {
                path: '/marketelist/member/unIconCard',
                component: () =>import('@/views/marketing/unIconCard/unIconCard'),
                hidden:true,
                name: 'unIconCard',
                meta: {
                    title: '月度定制会员卡',
                    code:'market:customer:findItem'
                },
            },
            {
                path: '/marketelist/member/unIconCardList',
                component: () =>import('@/views/marketing/unIconCard/uniconCardList'),
                hidden:true,
                name: 'unIconCardList',
                meta: {
                    title: '月度定制会员卡列表',
                    code:'market:customer:findItem'
                },
            },
            {
                path: '/marketelist/commissionManage/commission',
                component: () =>import('@/views/commissionObj/commission'),
                hidden:true,
                name: 'commission',
                meta: {
                    title: '佣金设置',
                    icon: 'icon-comment',
                    type: 'comment',
                    code:'market:commission'
                },
            },
            {
                path: '/marketelist/friendinviteManage/invite',
                component: () =>import('@/views/friendinvite/invite'),
                name: 'invite',
                hidden:true,
                meta: {
                    title: '好友邀请',
                    icon: 'icon-comment',
                    code:'market:invitationfriend'
                },
            },
            {
                path: '/marketelist/inviteQrCode/qrCode',
                component: () =>import('@/views/inviteQrCode/qrCode'),
                name: 'qrCode',
                hidden:true,
                meta: {
                    title: '邀请码设置',
                    icon: 'icon-comment',
                    code:'market:invitationcode'
                },
            },
            {
                path: '/marketelist/assemble',
                component: () =>import('@/views/AssembleObj/assemble'),
                name: 'creatposters',
                hidden:true,
                meta: {
                    title: '拼团',
                    icon: 'icon-hezuowork',
                    code:'market:assemble'
                }
            },
            {
                path: '/marketelist/assemble/detailed',
                component: () =>import('@/views/AssembleObj/assembleDetailed'),
                name: 'assembleDetailed',
                hidden:true,
                meta: {
                    title: '拼团明细',
                    icon: 'icon-hezuowork',
                    code:'market:assemble'
                }
            },
            {
                path: '/marketelist/activitiesCard/activiesLearningCard',
                component: () =>import('@/views/marketing/activitiesCard/activiesLearningCard'),
                hidden:true,
                name: 'activiesLearningCard',
                meta: {
                    title: '活动学习卡系统',
                    code:'market:activitystudycard'
                },
            },
            {
                path: '/marketelist/activitiesCard/creatActivitiesLearnCard',
                component: () =>import('@/views/marketing/activitiesCard/creatActivitiesLearnCard'),
                hidden:true,
                name: 'creatActivitiesLearnCard',
                meta: {
                    title: '活动学习卡系统',
                    code:'market:activitystudycard'
                },
            }
        ]
    },
    {
        path: '/activityObjManage',
        component: Layout,
        meta:{
            code:'activity',
            childrenLength:1
        },
        children: [
            {
                path: '/activityObjList',
                component: () =>import('@/views/activityObj/activityList'),
                name: 'activityObj',
                hidden:false,
                meta: {
                    title: '活动',
                    icon: 'icon-marketelist',
                    code:'activity'
                }
            },
            {
                path: '/activityObj/specialList',
                component: () =>import('@/views/special/specialList'),
                name: 'specialList',
                hidden:true,
                meta: {
                    title: '专题列表',
                    icon: 'icon-user',
                    code:'activity:thematic'
                }
            },
            {
                path: '/activityObj/specialCreat',
                component: () =>import('@/views/special/specialCreat'),
                name: 'userFilesFour',
                hidden:true,
                meta: {
                    title: '专题创建',
                    icon: 'icon-user',
                    code:'activity:thematic'
                }
            },
            {
                path: '/activityObj/cooperativeList',
                component: () =>import('@/views/cooperativePlatforms/index'),
                name: 'cooperativePlatforms',
                hidden:true,
                meta: {
                    title: '合作平台',
                    icon: 'icon-user',
                    code:'activity:cooperation'
                }
            },
            {
                path: '/activityObj/addcourseSystem',
                component: () =>import('@/views/giveLesson/addcourseSystem'),
                name: 'addcourseSystem',
                hidden:true,
                meta: {
                    title: '合作平台',
                    icon: 'icon-user',
                    code:'activity:cooperation'
                }
            },
            {
                path: '/activityObj/cooperativeUpdate',
                component: () =>import('@/views/cooperativePlatforms/update'),
                name: 'cooperativePlatformsUpdate',
                hidden:true,
                meta: {
                    title: '添加合作平台/编辑',
                    icon: 'icon-user',
                    code:'activity:cooperation'
                }
            },
            {
                path: '/activityObj/giftPackList',
                component: () =>import('@/views/giftPack/list'),
                name: 'giftPackList',
                hidden:true,
                meta: {
                    title: '国学大礼包',
                    icon: 'icon-user',
                    code:'activity:gift'
                }
            },
            {
                path: '/activityObj/giftPackUpdate',
                component: () =>import('@/views/giftPack/update'),
                name: 'giftPackUpdate',
                hidden:true,
                meta: {
                    title: '国学大礼包',
                    icon: 'icon-user',
                    code:'activity:gift'
                }
            },
            {
                path: '/activityObj/giftPackDetails',
                component: () =>import('@/views/giftPack/details'),
                name: 'giftPackUpdate',
                hidden:true,
                meta: {
                    title: '国学大礼包',
                    icon: 'icon-user',
                    code:'activity:gift'
                }
            },
            {
                path: '/activityObj/giveLessonList',
                component: () =>import('@/views/giveLesson/list'),
                name: 'giveLessonList',
                hidden:true,
                meta: {
                    title: '新用户赠课',
                    icon: 'icon-user',
                    code:'activity:givecourse'
                }
            },
            {
                path: '/activityObj/giveCourseSystem',
                component: () =>import('@/views/giveLesson/courseSystem'),
                name: 'giveLessonList',
                hidden:true,
                meta: {
                    title: '赠课注册系统',
                    icon: 'icon-user',
                    code:'activity:activityregister'
                }
            },
            {
                path: '/activityObj/mobileFreeCourse',
                component: () =>import('@/views/giveLesson/mobileFreeCourse'),
                name: 'mobileFreeCourse',
                hidden:true,
                meta: {
                    title: '移动用户赠课弹框',
                    icon: 'icon-user',
                    code:'activity:mobilePopup'
                }
            },
            {
                path: '/activityObj/creatMoveDialog',
                component: () =>import('@/views/giveLesson/creatMoveDialog'),
                name: 'creatMoveDialog',
                hidden:true,
                meta: {
                    title: '赠课注册系统弹框',
                    icon: 'icon-user',
                    code:'activity:activityregister'
                }
            },
            {
                path: '/activityObj/giveLessonUpdate',
                component: () =>import('@/views/giveLesson/update'),
                name: 'giveLessonUpdate',
                hidden:true,
                meta: {
                    title: '新用户赠课',
                    icon: 'icon-user',
                    code:'activity:givecourse'
                }
            },
            {
                path: '/activityObj/giveLessonDetails',
                component: () =>import('@/views/giveLesson/details'),
                name: 'giveLessonDetails',
                hidden:true,
                meta: {
                    title: '新用户赠课',
                    icon: 'icon-user',
                    code:'activity:givecourse'
                }
            },
        ]
    },
    {
        path: '/isCourseCountManage',
        component: Layout,
        meta: {
            title: '统计',
            icon: 'icon-hot',
            code:'statistics',
            childrenLength:4
        },
        children:[
            {
                path:'/isCourseCount/count',
                component: () =>import('@/views/courseCount/count'),
                name:'countCoupons',
                hidden:false,
                meta: {
                    title: '课程销售排行榜',
                    code:'statistics:coursesaletop'
                }
            },
            {
                path: '/isCourseCount/statistics',
                component: () =>import('@/views/courseCount/statistics'),
                name: 'statistics',
                hidden:false,
                meta: {
                    title: '课程销售统计',
                    code:'statistics:coursesale'
                }
            },
            {
                path: '/isCourseCount/visit',
                component: () =>import('@/views/courseCount/visit'),
                name: 'visit',
                hidden:false,
                meta: {
                    title: '课程访问统计',
                    code:'statistics:coursevisit'
                }
            },
            {
                path: '/activityStatistics',
                component: () =>import('@/views/activityStatisticsObj/tabsModelList'),
                name: 'activityObj',
                hidden:false,
                meta: {
                    title: '活动数据统计',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/newYearAction/activityStatistics',
                component: () =>import('@/views/activityStatisticsObj/newYearAction/activityStatistics'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '元旦活动',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },,
            {
                path: '/activityStatistics/worldBookDay/worldBookDayOne',
                component: () =>import('@/views/activityStatisticsObj/worldBookDay/worldBookDayOne'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '4.23世界读书日',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/worldBookDay/buttonClick',
                component: () =>import('@/views/activityStatisticsObj/worldBookDay/buttonClick'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: 'Button打点数据列表',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/worldBookDay/dataDetail/:selectId/:pid',
                component: () =>import('@/views/activityStatisticsObj/worldBookDay/dataDetail'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '用户详情',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/worldBookDay/visitUserDetail',
                component: () =>import('@/views/activityStatisticsObj/worldBookDay/visitUserDetail'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '访问用户详情',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/springFestival/index',
                component: () =>import('@/views/activityStatisticsObj/springFestival/index'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '新年福包活动',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/springFestival/buttonClick',
                component: () =>import('@/views/activityStatisticsObj/springFestival/buttonClick'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: 'Button打点数据列表',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/springFestival/dataDetail',
                component: () =>import('@/views/activityStatisticsObj/springFestival/dataDetail'),
                name: 'specialList',
                hidden:true,
                meta: {
                    title: '用户详情',
                    icon: 'icon-user',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/newYearAction/buttonClick',
                component: () =>import('@/views/activityStatisticsObj/newYearAction/buttonClick'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: 'Button打点数据列表',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/newYearAction/dataDetail',
                component: () =>import('@/views/activityStatisticsObj/newYearAction/dataDetail'),
                name: 'specialList',
                hidden:true,
                meta: {
                    title: '用户详情',
                    icon: 'icon-user',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/twelveActivity/activityStatistics',
                component: () =>import('@/views/activityStatisticsObj/twelveActivity/activityStatistics'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '十二月活动数据统计',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/twelveActivity/buttonClick',
                component: () =>import('@/views/activityStatisticsObj/twelveActivity/buttonClick'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: 'Button打点数据列表',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/twelveActivity/userInfo',
                component: () =>import('@/views/activityStatisticsObj/twelveActivity/userInfo'),
                name: 'specialList',
                hidden:true,
                meta: {
                    title: '用户详情',
                    icon: 'icon-user',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/caigenTan/cgtActivity',
                component: () =>import('@/views/activityStatisticsObj/caigenTan/cgtActivity'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '菜根谭活动数据统计',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/caigenTan/cgtButton',
                component: () =>import('@/views/activityStatisticsObj/caigenTan/cgtButton'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '菜根谭Button打点数据列表',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/caigenTan/dataDetail',
                component: () =>import('@/views/activityStatisticsObj/caigenTan/dataDetail'),
                name: 'specialList',
                hidden:true,
                meta: {
                    title: '菜根谭购买用户邮寄详情',
                    icon: 'icon-user',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/idioms/index',
                component: () =>import('@/views/activityStatisticsObj/idioms/index'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '成语猜猜猜',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/packet/index',
                component: () =>import('@/views/activityStatisticsObj/packet/index'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '阅读节活动',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/packet/packetDetail/:id',
                component: () =>import('@/views/activityStatisticsObj/packet/packetDetail'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '阅读节详情',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/packet/teamIsInDetail/:id',
                component: () =>import('@/views/activityStatisticsObj/packet/teamIsInDetail'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '正在组队中详情',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/packet/teamIsInsuccess/:id',
                component: () =>import('@/views/activityStatisticsObj/packet/teamIsInsuccess'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '组队成功详情',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/packet/teamSuccessDetail/:id',
                component: () =>import('@/views/activityStatisticsObj/packet/teamSuccessDetail'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '组队详情',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/packet/detail',
                component: () =>import('@/views/activityStatisticsObj/packet/detail'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '阅读节活动详情',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/packet/buttonClick',
                component: () =>import('@/views/activityStatisticsObj/packet/buttonClick'),
                name: 'activityObj',
                hidden:true,
                meta: {
                    title: '阅读节活动Button打点数据列表',
                    icon: 'icon-marketelist',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/idioms/idiomsDetail/:id',
                component: () =>import('@/views/activityStatisticsObj/idioms/idiomsDetail'),
                name: 'specialList',
                hidden:true,
                meta: {
                    title: '成语猜猜猜详情',
                    icon: 'icon-user',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/idioms/detail',
                component: () =>import('@/views/activityStatisticsObj/idioms/detail'),
                name: 'specialList',
                hidden:true,
                meta: {
                    title: '详情数据详情',
                    icon: 'icon-user',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/idioms/buttonClick',
                component: () =>import('@/views/activityStatisticsObj/idioms/buttonClick'),
                name: 'specialList',
                hidden:true,
                meta: {
                    title: '成语Button打点数据列表',
                    icon: 'icon-user',
                    code:'statistics:activities'
                }
            },
            {
                path: '/activityStatistics/cpa/index',
                component: () =>import('@/views/activityStatisticsObj/cpa/index'),
                name: 'specialList',
                hidden:false,
                meta: {
                    title: 'CPA活动统计',
                    icon: 'icon-user',
                    code:'statistics:cpa'
                }
            },
            {
                path: '/activityStatistics/cpa/detail',
                component: () =>import('@/views/activityStatisticsObj/cpa/detail'),
                name: 'specialList',
                hidden:true,
                meta: {
                    title: 'CPA活动统计详情',
                    icon: 'icon-user',
                    code:'statistics:cpa'
                }
            },
            {
                path: '/activityStatistics/cpaTwo/index',
                component: () =>import('@/views/activityStatisticsObj/cpaTwo/index'),
                name: 'specialList',
                hidden:true,
                meta: {
                    title: '活动统计目录',
                    icon: 'icon-user',
                    code:'statistics:cpa'
                }
            },
            {
                path: '/activityStatistics/cpaTwo/cpaList',
                component: () =>import('@/views/activityStatisticsObj/cpaTwo/cpaList'),
                name: 'specialList',
                hidden:true,
                meta: {
                    title: 'CPA活动统计',
                    icon: 'icon-user',
                    code:'statistics:cpa'
                }
            }
        ],
    },
    {
        path: '/integralManage',
        component: Layout,
        meta: {
            title: '积分',
            icon: 'icon-marketelist',
            code:'integral',
            childrenLength:4
        },
        children:[
            {
                path:'/integralManage/source',
                component: () =>import('@/views/integral/integralSource'),
                name:'markCoupons',
                hidden:false,
                meta: {
                    title: '积分来源',
                    code:'integral:source'
                }
            },
            {
                path:'/integralManage/community',
                component: () =>import('@/views/integral/community'),
                name:'markCoupons',
                hidden:false,
                meta: {
                    title: '社群积分',
                    code:'integral:source'
                }
            },
            {
                path: '/integralManage/query',
                component: () =>import('@/views/integral/integralQuery'),
                name: 'markTimeLimit',
                hidden:false,
                meta: {
                    title: '积分查询',
                    code:'integral:select'
                }
            },
            {
                path:'/integralManage/medal',
                component: () =>import('@/views/integral/integralMedal'),
                name:'markCoupons',
                hidden:false,
                meta: {
                    title: '勋章管理',
                    code:'integral:medal'
                }
            },
            {
                path:'/integralManage/exchange',
                component: () =>import('@/views/integral/integralExchange'),
                name:'markCoupons',
                hidden:false,
                meta: {
                    title: '积分兑换',
                    code:'integral:exchange'
                }
            },
            {
                path: '/integralList',
                component: () =>import('@/views/backstage/integralList'),
                name: 'integralList',
                hidden:false,
                meta: {
                    title: '积分活动',
                    icon: 'icon-marketelist',
                    code:'integral:activitymanage'
                },
            }
        ],
    },
    {
        path: '/hotWorkManage',
        component: Layout,
        meta:{
            code:'hotword',
            childrenLength:1
        },
        children: [
            {
                path: '/hotWork',
                component: () =>import('@/views/syntheticFiles/hotWordSearch'),
                name: 'hotWort',
                hidden:false,
                meta: {
                    title: '热词搜索',
                    icon: 'icon-hot',
                    code: 'hotword',
                    type: 'hotWork'
                },
            }
        ]
    },
    {
        path: '/hotWorkManage',
        component: Layout,
        meta:{
            code:'hotword',
            childrenLength:1
        },
        children: [
            {
                path: '/searchHeat',
                component: () =>import('@/views/syntheticFiles/searchHeat'),
                name: 'hotWort',
                hidden:true,
                meta: {
                    title: '查看热度',
                    icon: 'icon-hot',
                    code: 'hotword',
                    type: 'hotWork'
                }
            }
        ]
    },
    {
        path: '/userFilesManage',
        component: Layout,
        meta: {
            title: '用户管理系统',
            code: 'user',
            icon: 'icon-user',
            childrenLength:2
        },
        children: [
            {
                path: '/userFilesHome',
                component: () =>import('@/views/syntheticFiles/userFiles'),
                name: 'userFiles',
                hidden:false,
                meta: {
                    title: '用户管理',
                    type:'userFiles',
                    code:'user:users'
                }
            },
            {
                path: '/userFilesRegistered',
                component: () =>import('@/views/syntheticFiles/userFilesRegistered'),
                name: 'userSource',
                hidden:false,
                meta: {
                    title: '手动注册用户',
                    code:'user:register'
                }
            },
            {
                path: '/userFilesSource',
                component: () =>import('@/views/syntheticFiles/userSource'),
                name: 'userSource',
                hidden:false,
                meta: {
                    title: '管理来源',
                    code:'user:origin'
                }
            },
            {
                path: '/userFilesNewListPage',
                component: () =>import('@/views/syntheticFiles/newCoursePage'),
                name: 'userNewListPageSource',
                hidden:true,
                meta: {
                    title: '拉新',
                    code:'user:origin'
                }
            }
        ]
    },
    {
        path: '/happyManage',
        component: Layout,
        meta:{
            code:'interest',
            childrenLength:1
        },
        children: [
            {
                path: '/happy',
                component: () =>import('@/views/happyManage/happy'),
                name: 'userFilesHappy',
                hidden:false,
                meta: {
                    title: '兴趣管理',
                    icon: 'icon-card',
                    code:'interest'
                }
            }
        ]
    },
    {
        path: '/channelManage',
        component: Layout,
        meta:{
            code:'channel',
            childrenLength:1
        },
        children: [
            {
                path: '/channelManage',
                component: () =>import('@/views/channelType/channelManage'),
                name: 'userFilesChanne',
                hidden:false,
                meta: {
                    title: '渠道管理',
                    icon: 'icon-classify',
                    code:'channel'
                }
            }
        ]
    },
    {
        path: '/recordManage',
        component: Layout,
        meta: {
            title: '订单管理系统',
            icon: 'icon-marketelist',
            code:'record',
            childrenLength:4
        },
        children:[
            {
                path:'/record/moneyRecord',
                component: () =>import('@/views/syntheticFiles/moneyRecord'),
                name:'moneyRecord',
                hidden:false,
                meta: {
                    title: '充值记录',
                    icon: 'icon-moneyrecord',
                    type:'moneyRecord',
                    code:'record:recharge'
                }
            },
            {
                path:'/record/orderRecord',
                component: () =>import('@/views/syntheticFiles/orderRecord'),
                name:'orderRecord',
                hidden:false,
                meta: {
                    title: '订单记录',
                    icon: 'icon-order',
                    type:'orderRecord',
                    code:'record:order'
                }
            },
            {
                path:'/record/memberRecord',
                component: () =>import('@/views/member/memberRecord'),
                name:'memberRecord',
                hidden:false,
                meta: {
                    title: '会员记录',
                    icon: 'icon-order',
                    type:'orderRecord',
                    code:'record:member'
                }
            },
            {
                path:'/record/monthMemberRecord',
                component: () =>import('@/views/member/monthMemberRecord'),
                name:'monthMemberRecord',
                hidden:false,
                meta: {
                    title: '月度会员记录',
                    icon: 'icon-order',
                    type:'orderRecord',
                    code:'record:monthmember'
                }
            },
            {
                path:'/record/collectionOrder',
                component: () =>import('@/views/member/collectionOrder'),
                name:'collectionOrder',
                hidden:false,
                meta: {
                    title: '合集订单',
                    icon: 'icon-order',
                    type:'orderRecord',
                    code:'record:collectionorder'
                }
            }
        ],
    },
    {
        path: '/commentManage',
        component: Layout,
        meta:{
            code:'comment',
            childrenLength:2,
            title: '评论管理',
            icon: 'icon-comment',
        },
        children: [
            {
                path: '/comment',
                component: () =>import('@/views/comment/commentFiles'),
                hidden:false,
                name: 'comment',
                meta: {
                    title: '评论管理',
                    icon: 'icon-comment',
                    type: 'comment',
                    code:'comment:manage'
                },
            },
            {
                path: '/prohibitedWords',
                component: () =>import('@/views/comment/prohibitedWords'),
                hidden:false,
                name: 'comment',
                meta: {
                    title: '违禁词管理',
                    icon: 'icon-comment',
                    type: 'comment',
                    code:'comment:prohibited'
                },
            },
            {
                path: '/complain',
                component: () =>import('@/views/comment/complain'),
                hidden:true,
                name: 'complain',
                meta: {
                    title: '举报',
                    icon: 'icon-comment',
                    type: 'complain',
                    code:'comment:manage'
                },
            },
            // {
            //     path: '/appCommentManagement',
            //     component: () =>import('@/views/comment/AppCommentManagement'),
            //     name: 'appCommentManagement',
            //     hidden:false,
            //     meta: {
            //         title: '学友圈评论管理',
            //         icon: 'icon-moneyrecord',
            //         code:'comment:classmatesmsgcomment'
            //     },
            // }
        ]
    },
    {
        path: '/moneyManage',
        component: Layout,
        meta:{
            code:'finance',
            childrenLength:1
        },
        children: [
            {
                path: '/moneyManage',
                component: () =>import('@/views/moneyObj/moneyManage'),
                name: 'moneyManage',
                hidden:false,
                meta: {
                    title: '财务管理',
                    icon: 'icon-moneyrecord',
                    code:'finance',
                    type:'moneyManage'
                },
            }
        ]
    },
    {
        path: '/advertCopyManage',
        component: Layout,
        meta:{
            code:'screen',
            childrenLength:1
        },
        children: [
            {
                path: '/advert',
                component: () =>import('@/views/syntheticFiles/advertBeat'),
                name: 'advert',
                hidden:true,
                meta: {
                    title: '闪屏广告',
                    icon: 'icon-marketelist',
                    code:'screen'
                },
            }
        ]
    },
    {
        path: '/advertManage',
        component: Layout,
        meta:{
            code:'screen',
            childrenLength:1
        },
        children: [
            {
                path: '/advertBeatList',
                component: () =>import('@/views/syntheticFiles/advertBeatList'),
                name: 'advertBeatList',
                hidden:false,
                meta: {
                    title: '闪屏管理',
                    icon: 'icon-marketelist',
                    code:'flash'
                },
            },
            {
                path: '/advertNew',
                component: () =>import('@/views/syntheticFiles/advertBeatNew'),
                name: 'advertNew',
                hidden:true,
                meta: {
                    title: '闪屏广告设置',
                    icon: 'icon-marketelist',
                    code:'flash'
                },
            }
        ]
    },
    {
        path: '/specialAccountManage',
        component: Layout,
        meta:{
            code:'accounts',
            childrenLength:1
        },
        children: [
            {
                path: '/specialAccount',
                component: () =>import('@/views/specialAccount/specialAccount'),
                name: 'specialAccount',
                hidden:false,
                meta: {
                    title: '特殊账户',
                    icon: 'icon-marketelist',
                    code:'accounts'
                },
            }
        ]
    },
    {
        path: '/informationListManage',
        component: Layout,
        meta:{
            code:'information',
            childrenLength:1
        },
        children: [
            {
                path: '/informationList',
                component: () =>import('@/views/informationObj/informationList'),
                name: 'informationList',
                hidden:false,
                meta: {
                    title: '资讯管理系统',
                    icon: 'icon-marketelist',
                    code:'information'
                },
            },
            {
                path: '/informationList/creatInformation',
                component: () =>import('@/views/informationObj/creatInformation'),
                name: 'creatInformation',
                hidden:true,
                meta: {
                    title: '新建资讯管理',
                    icon: 'icon-marketelist',
                    code:'information'
                }
            }
        ]
    },
    {
        path: '/smallProgramManage',
        component: Layout,
        meta: {
            title: '小程序',
            icon: 'icon-card',
            code:'applat',
            childrenLength:4
        },
        children: [
            {
                path: '/smallProgram/programList',
                component: () =>import('@/views/smallProgram/programList'),
                name: 'programList',
                hidden:false,
                meta: {
                    title: '课程匹配',
                    icon: 'icon-comment',
                    code:'applat:matching'
                },
            },
            {
                path: '/smallProgram/creatProgram',
                component: () =>import('@/views/smallProgram/creatPragram'),
                name: 'creatProgram',
                hidden:true,
                meta: {
                    title: '创建诗词',
                    icon: 'icon-comment',
                    code:'applat:matching'
                },
            },
            {
                path: '/smallProgram/pragramImgList',
                component: () =>import('@/views/smallProgram/pragramImgList'),
                name: 'pragramImgList',
                hidden:false,
                meta: {
                    title: '背景列表',
                    icon: 'icon-comment',
                    code:'applat:background'
                },
            },
            {
                path: '/smallProgram/creatImgPragram',
                component: () =>import('@/views/smallProgram/creatImgPragram'),
                name: 'creatImgPragram',
                hidden:true,
                meta: {
                    title: '创建背景',
                    icon: 'icon-comment',
                    code:'applat:background'
                },
            },
            // {
            //     path: '/smallProgram/game/answer',
            //     component: () =>import('@/views/smallProgram/game/answer'),
            //     name: 'creatImgPragram',
            //     hidden:false,
            //     meta: {
            //         title: '小程序游戏答题',
            //         icon: 'icon-comment',
            //         code:'applat:background'
            //     },
            // },
            // {
            //     path: '/smallProgram/game/users',
            //     component: () =>import('@/views/smallProgram/game/users'),
            //     name: 'creatImgPragram',
            //     hidden:false,
            //     meta: {
            //         title: '小程序游戏用户管理',
            //         icon: 'icon-comment',
            //         code:'applat:background'
            //     },
            // },
            // {
            //     path: '/smallProgram/game/levelAwards',
            //     component: () =>import('@/views/smallProgram/game/levelAwards'),
            //     name: 'creatImgPragram',
            //     hidden:false,
            //     meta: {
            //         title: '小程序游戏关卡奖项',
            //         icon: 'icon-comment',
            //         code:'applat:background'
            //     },
            // },
            // {
            //     path: '/smallProgram/game/appletSet',
            //     component: () =>import('@/views/smallProgram/game/appletSet'),
            //     name: 'creatImgPragram',
            //     hidden:false,
            //     meta: {
            //         title: '小程序游戏设置',
            //         icon: 'icon-comment',
            //         code:'applat:background'
            //     },
            // },
            // {
            //     path: '/smallProgram/game/edit',
            //     component: () =>import('@/views/smallProgram/game/edit'),
            //     name: 'creatImgPragram',
            //     hidden:true,
            //     meta: {
            //         title: '小程序游戏编辑',
            //         icon: 'icon-comment',
            //         code:'applat:background'
            //     },
            // },
            // {
            //     path: '/smallProgram/game/gameSee',
            //     component: () =>import('@/views/smallProgram/game/gameSee'),
            //     name: 'creatImgPragram',
            //     hidden:true,
            //     meta: {
            //         title: '小程序游戏预览',
            //         icon: 'icon-comment',
            //         code:'applat:background'
            //     },
            // },
            // {
            //     path: '/smallProgram/game/detail',
            //     component: () =>import('@/views/smallProgram/game/detail'),
            //     name: 'creatImgPragram',
            //     hidden:true,
            //     meta: {
            //         title: '小程序游戏详情',
            //         icon: 'icon-comment',
            //         code:'applat:background'
            //     },
            // },
            // {
            //     path: '/smallProgram/game/detailOne',
            //     component: () =>import('@/views/smallProgram/game/detailOne'),
            //     name: 'creatImgPragram',
            //     hidden:true,
            //     meta: {
            //         title: '小程序游戏错题本',
            //         icon: 'icon-comment',
            //         code:'applat:background'
            //     },
            // },
            // {
            //     path: '/smallProgram/game/detailTwo',
            //     component: () =>import('@/views/smallProgram/game/detailTwo'),
            //     name: 'creatImgPragram',
            //     hidden:true,
            //     meta: {
            //         title: '小程序游戏领取奖项',
            //         icon: 'icon-comment',
            //         code:'applat:background'
            //     },
            // },
            // {
            //     path: '/smallProgram/game/detailThree',
            //     component: () =>import('@/views/smallProgram/game/detailThree'),
            //     name: 'creatImgPragram',
            //     hidden:true,
            //     meta: {
            //         title: '小程序游戏金币明细',
            //         icon: 'icon-comment',
            //         code:'applat:background'
            //     },
            // }
        ]
    },
    {
        path: '/answerMiniProgram',
        component: Layout,
        meta: {
            title: '小程序知识达人王者',
            icon: 'icon-card',
            code:'thekingofknowledge',
            childrenLength:4
        },
        children:[
            {
                path: '/answerMiniProgram/addQuestion',
                component: () =>import('@/views/answerMiniProgram/addQuestion'),
                name: 'miniProgramSetting_add',
                hidden:false,
                meta: {
                    title: '添加题库',
                    icon: 'icon-comment',
                    code:'thekingofknowledge:bank'
                },
            },
            {
                path: '/answerMiniProgram/addQuestion/edit',
                component: () =>import('@/views/answerMiniProgram/addQuestionEdit'),
                name: 'miniProgramSetting_add_edit',
                hidden:true,
                meta: {
                    title: '添加题库',
                    icon: 'icon-comment',
                    code:'thekingofknowledge:bank:edit'
                },
            },
            {
                path: '/answerMiniProgram/addQuestion/details',
                component: () =>import('@/views/answerMiniProgram/addQuestionDetails'),
                name: 'miniProgramSetting_add_details',
                hidden:true,
                meta: {
                    title: '添加题库',
                    icon: 'icon-comment',
                    code:'thekingofknowledge:bank:detail'
                },
            },
            {
                path: '/answerMiniProgram/awardSetting',
                component: () =>import('@/views/answerMiniProgram/awardSetting'),
                name: 'awardSetting',
                hidden:false,
                meta: {
                    title: '关卡奖项设置',
                    icon: 'icon-comment',
                    code:'thekingofknowledge:hurdle'
                },
            },
            {
                path: '/answerMiniProgram/miniProgramSetting',
                component: () =>import('@/views/answerMiniProgram/miniProgramSetting'),
                name: 'miniProgramSetting',
                hidden:false,
                meta: {
                    title: '小程序设置',
                    icon: 'icon-comment',
                    code:'thekingofknowledge:setting'
                },
            },
            {
                path: '/answerMiniProgram/userManage',
                component: () =>import('@/views/answerMiniProgram/userManage'),
                name: 'userManage',
                hidden:false,
                meta: {
                    title: '用户管理',
                    icon: 'icon-comment',
                    code:'thekingofknowledge:user'
                },
            },
            {
                path: '/answerMiniProgram/userManageAward',
                component: () =>import('@/views/answerMiniProgram/userManageAward'),
                name: 'userManageAward',
                hidden:true,
                meta: {
                    title: '用户管理',
                    icon: 'icon-comment',
                    code:'thekingofknowledge:user:receivedetail'
                },
            },
            {
                path: '/answerMiniProgram/userManageError',
                component: () =>import('@/views/answerMiniProgram/userManageError'),
                name: 'userManageError',
                hidden:true,
                meta: {
                    title: '用户管理',
                    icon: 'icon-comment',
                    code:'thekingofknowledge:user:wrongbook'
                },
            },
            {
                path: '/answerMiniProgram/userManageGoldDetails',
                component: () =>import('@/views/answerMiniProgram/userManageGoldDetails'),
                name: 'userManageGoldDetails',
                hidden:true,
                meta: {
                    title: '用户管理',
                    icon: 'icon-comment',
                    code:'thekingofknowledge:user:golddetail'
                },
            },
        ]
    },
    {
        path: '/companySynopsisManage',
        component: Layout,
        meta: {
            title: '网站管理系统',
            icon: 'icon-card',
            code:'set',
            childrenLength:7
        },
        children: [
            {
                path: '/companySynopsis/themeColor',
                component: () =>import('@/views/companyList/companyThemeColor'),
                name: 'themeColor',
                hidden:false,
                meta: {
                    title: '主题色设置',
                    icon: 'icon-marketelist',
                    code:'set:theme'
                },
            },
            {
                path: '/companySynopsis/aboutInfo',
                component: () =>import('@/views/companyList/companySynopsis'),
                name: 'companySynopsis',
                hidden:false,
                meta: {
                    title: '公司简介',
                    icon: 'icon-marketelist',
                    code:'set:profile'
                },
            },
            {
                path: '/companySynopsis/companyEven',
                component: () =>import('@/views/companyList/companyEven'),
                name: 'companyEven',
                hidden:false,
                meta: {
                    title: '大事记',
                    icon: 'icon-marketelist',
                    code:'set:bigevent'
                },
            },
            {
                path: '/companySynopsis/companyJoinUs',
                component: () =>import('@/views/companyList/companyJoinUs'),
                name: 'companyJoinUs',
                hidden:false,
                meta: {
                    title: '加入我们',
                    icon: 'icon-marketelist',
                    code:'set:joinus'
                },
            },
            {
                path: '/companySynopsis/companyHonor',
                component: () =>import('@/views/companyList/companyHonor'),
                name: 'companyHonor',
                hidden:false,
                meta: {
                    title: '合作平台',
                    icon: 'icon-marketelist',
                    code:'set:honor'
                },
            },
            {
                path: '/companySynopsis/companyContact',
                component: () =>import('@/views/companyList/companyContact'),
                name: 'companyContact',
                hidden:false,
                meta: {
                    title: '联系我们',
                    icon: 'icon-marketelist',
                    code:'set:contactus'
                },
            },
            {
                path: '/companySynopsis/companyPrivacy',
                component: () =>import('@/views/companyList/companyPrivacy'),
                name: 'companyPrivacy',
                hidden:false,
                meta: {
                    title: '关于隐私',
                    icon: 'icon-marketelist',
                    code:'set:privacy'
                },
            },
            {
                path: '/companySynopsis/companyDuty',
                component: () =>import('@/views/companyList/companyDuty'),
                name: 'companyDuty',
                hidden:false,
                meta: {
                    title: '免责声明',
                    icon: 'icon-marketelist',
                    code:'set:disclaimer'
                },
            }
        ],
    },
    {
        path: '/backstageManage',
        component: Layout,
        meta: {
            title: 'APP管理系统',
            icon: 'icon-backstage',
            code:'admin',
            childrenLength:14
        },
        children: [
{
                path: '/backstage/roleManage',
                component: () =>import('@/views/backstage/roleManage/index'),
                name: 'list',
                hidden:false,
                meta: {
                    title: '角色管理',
                    code:'admin:rolemanager'
                }
            },
            {
                path: '/backstage/appImgUpload',
                component: () =>import('@/views/backstage/roleManage/appImgUpload'),
                name: 'list',
                hidden:false,
                meta: {
                    title: 'APP顶部特色',
                    code:'admin:topfeatures'
                }
            },{
                path: '/backstage/authManage',
                component: () =>import('@/views/backstage/authManage'),
                name: 'list',
                hidden:false,
                meta: {
                    title: '权限管理',
                    code:'admin:authority'
                }
            },
            {
                path: '/backstage/roleManage/authCenter/:id',
                component: () =>import('@/views/backstage/roleManage/authCenter'),
                name: 'auth',
                hidden:true,
                meta: {
                    title: '权限中心',
                    code:'admin:rolemanager'
                },
            },
            {
                path: '/backstage/systemUser',
                component: () =>import('@/views/backstage/systemUser/list'),
                name: 'systemUserList',
                hidden:false,
                meta: {
                    title: '后台账户管理',
                    code:'admin:account'
                }
            },
            {
                path: '/backstage/cooperativeTeacher',
                component: () =>import('@/views/backstage/cooperativeTeacher/index'),
                name: 'teacherList',
                hidden:false,
                meta: {
                    title: '老师账户管理',
                    code:'admin:teacheraccount'
                },
            },
            {
                path: '/backstage/cooperativeTeacher/incomeDetail',
                component: () =>import('@/views/backstage/cooperativeTeacher/incomeDetail'),
                name: 'incomeDetail',
                hidden:true,
                meta: {
                    title: '收入概况',
                    code:'admin:teacheraccount'
                }
            },
            {
                path: '/backstage/cooperativeTeacher/saleDetail',
                component: () =>import('@/views/backstage/cooperativeTeacher/saleDetail'),
                name: 'saleDetail',
                hidden: true,
                meta: {
                    title: '销售数据',
                    code:'admin:teacheraccount'
                }
            },
            {
                path: '/backstage/widhdrawCash',
                component: () =>import('@/views/backstage/withdrawCash/index'),
                name: 'widhdrawCashList',
                hidden:true,
                meta: {
                    title: '提现申请',
                    code:'admin:teacheraccount'
                }
            },
            {
                path: '/backstage/daemonBug',
                component: () =>import('@/views/marketing/daemon/bugReturn'),
                name: 'daemonBug',
                hidden:true,
                meta: {
                    title: 'bug反馈',
                    code: 'admin:feedback',
                    type: 'feedback'
                },
            },
            {
                path: '/backstage/proposal',
                component: () =>import('@/views/marketing/daemon/proposalPage'),
                name: 'proposal',
                hidden:false,
                meta: {
                    title: '建议反馈',
                    code: 'admin:feedback',
                    type: 'feedback'
                },
            },
            {
                path: '/backstage/inside',
                component: () =>import('@/views/marketing/insideMessage/insideInit'),
                name: 'inside',
                hidden:false,
                meta: {
                    title: '站内信',
                    code: 'admin:mail',
                    type: 'inside'
                },
            },
            {
                path: '/oldUserObj/oldUsers',
                component: () =>import('@/views/marketing/oldUserObj/oldUsers'),
                name: 'oldUsers',
                hidden:false,
                meta: {
                    title: '疯狂追单',
                    code: 'admin:recall',
                    type: 'oldUsers'
                },
            },
            {
                path: '/oldUserObj/historyList',
                component: () =>import('@/views/marketing/oldUserObj/historyList'),
                name: 'historyRecord',
                hidden: true,
                meta: {
                    title: "历史记录",
                    type:'historyList',
                    code:'admin:recall'
                }
            },
            {
                path: '/backstage/inside/msg',
                component: () =>import('@/views/marketing/insideMessage/msg'),
                name: 'inside',
                hidden:true,
                meta: {
                    title: '站内信',
                    code: 'admin:mail',
                    type: 'inside'
                },
            },
            {
                path: '/backstage/inside/historyRecord',
                component: () =>import('@/views/marketing/insideMessage/historyRecord'),
                name: 'historyRecord',
                hidden: true,
                meta: {
                    title: "历史记录",
                    type:'historyRecord',
                    code:'admin:mail'
                }
            },
            {
                path: '/backstage/updateApp',
                component: () =>import('@/views/updateApp/updateAppindex'),
                name: 'updateApp',
                hidden:false,
                meta: {
                    title:'版本更新',
                    code:'admin:appversion',
                },
            },
            {
                path: '/backstage/updateApp/Release',
                component: () => import('@/views/updateApp/updateAppRelease'),
                name: 'Release',
                hidden: true,
                meta: {
                    title: "发布版本",
                    code:'admin:appversion:add'
                }
            }
        ]
    },
    {
        path: '/activityAnswer',
        component: Layout,
        meta:{
            code:'activity:webactivity',
            childrenLength:5
        },
        children: [
            {
                path: '/activityObj/answer',
                component: () =>import('@/views/activityObj/H5_answer'),
                name: 'H5Answer',
                hidden:true,
                meta: {
                    title: '测评管理',
                    icon: 'icon-hezuowork',
                    code:'activity:webactivity:evaluation'
                }
            },
            {
                path: '/activityObj/itemBank',
                component: () =>import('@/views/activityObj/itemBank'),
                name: 'itemBank',
                hidden:true,
                meta: {
                    title: '题目库',
                    icon: 'icon-hezuowork',
                    code:'activity:webactivity:question'
                }
            },
            {
                path: '/activityObj/poetryLibrary',
                component: () =>import('@/views/activityObj/poetryLibrary'),
                name: 'poetryLibrary',
                hidden:true,
                meta: {
                    title: '诗词库',
                    icon: 'icon-hezuowork',
                    code:'activity:webactivity:poetry'
                }
            },
            {
                path: '/activityObj/setUpGx',
                component: () =>import('@/views/activityObj/setUpGx'),
                name: 'setUpGx',
                hidden:true,
                meta: {
                    title: '设置',
                    icon: 'icon-hezuowork',
                    code:'activity:webactivity:set'
                }
            },
            {
                path: '/activityObj/gxStatistics',
                component: () =>import('@/views/activityObj/gxStatistics'),
                name: 'gxStatistics',
                hidden:true,
                meta: {
                    title: '统计',
                    icon: 'icon-hezuowork',
                    code:'activity:webactivity:statistics'
                }
            }
        ]
    },
    {
        path: '/activityShare',
        component: Layout,
        meta:{
            code:'activity:share',
            childrenLength:1
        },
        children: [
            {
                path: '/activityShare/share',
                component: () =>import('@/views/activityShare/share'),
                name: 'activityShare',
                hidden:true,
                meta: {
                    title: '活动分享',
                    icon: 'icon-hezuowork',
                    code:'activity:share'
                }
            }
        ]
    }
]
