export default class datalist {
    constructor() { }
    formHeadName = {
        //优惠券
        coupon: [
            {
                date: 'sortId',
                label: '序号',
                width: 50
            },
            {
                date: 'title',
                label: '名称',
                width: 120
            },
            {
                date: 'reducedPrice',
                label: '面额(元)',
                width: 90
            },
            {
                date: 'validTime',
                label: '领取时间',
                width: 220
            },
            {
                date: 'totalNumStr', 
                label: '发行量',
                width: 100
            },
            {
                date: 'receiveNum',
                label: '已领用',
                width: 100
            },
            {
                date: 'usedNum',
                label: '已使用',
                width: 100
            },
            {
                date: 'creatorName',
                label: '创建者',
                width: 120
            },
            {
                date: 'status',
                label: '状态',
                width: 80
            },
            {
                date: 'remarks',
                label: '备注',
                width: 100,
            }
        ],
        //活动优惠券
        activity: [
            {
                date: 'sortId',
                label: '序号',
                width: 50
            },
            {
                date: 'title',
                label: '名称',
                width: 80
            },
            {
                date: 'reducedPrice',
                label: '面额(元)',
                width: 90
            },
            {
                date: 'validTime',
                label: '有效期(天)',
                width: 60
            },
            {
                date: 'source',
                label: '类型',
                width: 60
            },
            {
                date: 'couponType',
                label: '使用条件',
                width: 60
            },
            {
                date: 'receiveNum',
                label: '已领用',
                width: 60
            },
            {
                date: 'usedNum',
                label: '已使用',
                width: 60
            },
            {
                date: 'status',
                label: '状态',
                width: 80
            },
            {
                date: 'remarks',
                label: '备注',
                width: 100,
            },
        ],
        // //限时购
        // timelimit: [
        //     {
        //         date: 'sortId',
        //         label: '序号',
        //         width: 50
        //     },
        //     {
        //         date: 'courseTitle',
        //         label: '名称',
        //         width: 80
        //     },
        //     {
        //         date: 'validTime',
        //         label: '限时时间',
        //         width: 220
        //     },
        //     {
        //         date: 'type',
        //         label: '方式',
        //         width: 60
        //     },
        //     {
        //         date: 'discount',
        //         label: '折扣',
        //         width: 60
        //     },
        //     {
        //         date: 'mtype',
        //         label: '类型',
        //         width: 60
        //     },
        //     {
        //         date: 'seckillPrice',
        //         label: '价格',
        //         width: 80
        //     },
        //     {
        //         date: 'sellStatus',
        //         label: '状态',
        //         width: 60
        //     }
        // ],
        // 优惠券详情


        /**
         *
         * couponCode: "201812204669297687"
reducedPrice: 20
sourceClientType: 1
status1: 0
useCourseTitle: null
used: "未使用"
userPhone: "183****4669"
         */
        activityDetails: [
            {
                date: 'userPhone',
                label: '用户账户',
                width: 130,
            },
            // {
            //     date:'sourceClientType',
            //     label:'用户来源',
            //     width:80,
            // },
            {
                date: 'sourceClientTypeName',
                label: '用户来源',
                width: 80,
            },
            {
                date: 'useCourseTitle',
                label: '课程名称',
                width: 140,
            },
            {
                date: 'used',
                label: '状态',
                width: 80,
            },
            {
                date: 'couponCode',
                label: '劵码',
                width: 180,
            },
            {
                date: 'reducedPrice',
                label: '金额',
                width: 150,
            }
        ],
        // couponDetails: [
        //     {
        //         date: 'userPhone',
        //         label: '用户账户',
        //         width: 130,
        //     },
        //     {
        //         date: 'sourceClientTypeName',
        //         label: '用户来源',
        //         width: 80,
        //     },
        //     {
        //         date: 'useCourseTitle',
        //         label: '课程名称',
        //         width: 140,
        //     },
        //     {
        //         date: 'used',
        //         label: '状态',
        //         width: 80,
        //     },
        //     {
        //         date: 'couponCode',
        //         label: '劵码',
        //         width: 180,
        //     },
        //     {
        //         date: 'reducedPrice',
        //         label: '金额',
        //         width: 150,
        //     }
        // ],
        //后台-不给反馈
        bugs: [
            {
                date: 'id',
                label: '账号',
                width: 80,
            },
            {
                date: 'deviceType',
                label: '设备类型',
                width: 120,
            },
            {
                date: 'phoneModel',
                label: '手机型号',
                width: 100,
            },
            {
                date: 'content',
                label: '反馈内容',
                width: 180,
            },
            {
                date: 'makeData',
                label: '反馈日期',
                width: 150,
            },
            {
                date: 'makeData',
                label: '标记',
                width: 80,
            }
        ],
        //订单详情
        //订单号、课程名称、状态、支付方式、应付、实付、省、市、来源、第三方订单号、佣金、渠道费用、分成比例、优惠、付款日期、渠道”
        // orderRecord: [
        //     // {
        //     //     date:'userPhone',
        //     //     label:'付款账号',
        //     //     width:100,
        //     // },
        //     {
        //         date: 'orderId',
        //         label: '订单号',
        //         width: 150,
        //     },  
        //     {
        //         date: 'commodityTitle',
        //         label: '课程名称',
        //         width: 120,
        //     },  
        //     {
        //         date: 'orderStatus',
        //         label: '状态',
        //         width: 80,
        //     },            
        //     {
        //         date: 'paymentTypeStatus2',
        //         label: '支付方式',
        //         width: 100,
        //     },  
        //     {
        //         date: 'commodityPrice',
        //         label: '应付',
        //         width: 60,
        //     }, 
        //     {
        //         date: 'payPrice',
        //         label: '实付',
        //         width: 60,
        //     },            
        //     {
        //         date: 'cellphoneProvinceName',
        //         label: '省/直辖市',
        //         width: 100
        //     },
        //     {
        //         date: 'cellphoneCityName',
        //         label: '市',
        //         width: 100
        //     },    
        //     {
        //         date: 'originName',
        //         label: '来源',
        //         width: 150,
        //     },            
        //     {
        //         date: 'returnId',
        //         label: '第三方订单号',
        //         width: 150,
        //     },                                      
        //     {
        //         date: 'proportion',
        //         label: '佣金',
        //         width: 100,
        //     },
        //     {
        //         date: 'payProportion',
        //         label: '渠道费用',
        //         width: 100,
        //     },
        //     {
        //         date: 'bonusRatio',
        //         label: '分成比例',
        //         width: 100,
        //     },
        //     {
        //         date: 'couponDetailljm',
        //         label: '优惠',
        //         width: 150,
        //     },
        //     {
        //         date: 'createdAt',
        //         label: '付款日期',
        //         width: 130,
        //     },
        //     {
        //         date: 'pipelineName',
        //         label: '渠道',
        //         width: 100,
        //     }           
        // ],
        //评论管理
        comment: [
            {
                date: 'id',
                label: '序号',
                width: 40
            },
            {
                date: 'commentUserPhone',
                label: '账号',
                width: 50
            },
            {
                date: 'commentUserName',
                label: '昵称',
                width: 60
            },
            {
                date: 'courseTitle',
                label: '评论来源',
                width: 60
            },
            {
                date: 'content',
                label: '评论内容',
                width: 120
            },
            {
                date: 'updatedAt',
                label: '评论日期',
                width: 70
            }
        ],
        // //充值管理
        // moneyRecord: [
        //     {
        //         date: 'orderId',
        //         label: '订单号',
        //         width: 100
        //     },
        //     {
        //         date: 'returnId',
        //         label: '第三方订单id',
        //         width: 100
        //     },       
        //     {
        //         date: 'originName',
        //         label: '来源',
        //         width: 150,
        //     },            
        //     {
        //         date: 'orderStatus',
        //         label: '订单状态 ',
        //         width: 50
        //     },
        //     {
        //         date: 'paymentTypeStatus2',
        //         label: '支付方式',
        //         width: 50
        //     },
        //     {
        //         date: 'commodityPrice',
        //         label: '充值金额',
        //         width: 40
        //     },
        //     {
        //         date: 'payPrice',
        //         label: '实付金额',
        //         width: 40
        //     },
        //     {
        //         date: 'createdAt',
        //         label: '充值日期',
        //         width: 80
        //     },
        //     {
        //         date: 'cellphoneProvinceName',
        //         label: '省/直辖市',
        //         width: 80
        //     },
        //     {
        //         date: 'cellphoneCityName',
        //         label: '市',
        //         width: 80
        //     }
        // ],
        //用户管理；
        userFiles: [
            {
                date: 'sortId',
                label: '序号',
                width: 60
            },
            {
                date: 'avatar',
                label: '头像',
                width: 80
            },
            {
                date: 'cellphone',
                label: '账号',
                width: 120
            },
            {
                date: 'cellphoneProvinceName',
                label: '省/直辖市',
                width: 120
            },
            {
                date: 'cellphoneCityName',
                label: '市',
                width: 80
            },            
            {
                date: 'nickname', 
                label: '昵称',
                width: 120
            },
            {
                date: 'originName',
                label: '来源',
                width: 60
            },
            {
                date: 'registerSourceName',
                label: '注册来源',
                width: 120
            },
            {
                date: 'registerType',
                label: '注册类型',
                width: 120
            },
            {
                date: 'gender',
                label: '性别',
                width: 60
            },
            {
                date: 'uTypeText',
                label: '身份',
                width: 60
            },
            // {
            //     date: 'createdAt',
            //     label: '注册时间',
            //     width:160
            // },
            // {
            //     date: 'lastLoginAt',
            //     label: '最后登录时间',
            //     width:160
            // },
            // {
            //     date: 'channelName',
            //     label: '渠道',
            //     width:100
            // },
            // {
            //     date: 'inviteNum',
            //     label: '邀请',
            //     width:60
            // },
            // {
            //     date: 'birthDate',
            //     label: '出生日期',
            //     width:160
            // },
            // {
            //     date: 'education',
            //     label: '学历',
            //     width:60
            // },
            // {
            //     date: 'occupation',
            //     label: '职业',
            //     width:100
            // },
            // {
            //     date: 'industry',
            //     label: '行业',
            //     width:100
            // },
            {
                date: 'cellphoneOperator',
                label: '手机运营商',
                width: 120
            },            
            {
                date: 'coinBalance',
                label: '夫子币',
                width: 80
            },            
            {
                date: 'operator',
                label: '运营商标志',
                width: 120
            },
            {
                date: 'interestNames',
                label: '兴趣',
                width: 100
            },        
        ],
        //站内信;
        inside: [
            {
                date: 'sortId',
                label: '序号',
                width: 40
            },
            {
                date: 'cellphone',
                label: '账号',
                width: 100
            },
            {
                date: 'avatar',
                label: '头像',
                width: 80
            },
            {
                date: 'nickname',
                label: '昵称',
                width: 80
            }
        ],
        //bug反馈;
        daemonBug: [
            {
                date: 'phone',
                label: '账号',
                width: 50
            },
            {
                date: 'deviceType',
                label: '设备类型',
                width: 40
            },
            {
                date: 'phoneModel',
                label: '手机型号',
                width: 80
            },
            {
                date: 'content',
                label: '反馈内容',
                width: 180
            },
            {
                date: 'updatedAt',
                label: '反馈日期',
                width: 80
            }
        ],
        //意见反馈
        feedback: [
            {
                date: 'phone',
                label: '账号',
                width: 50
            },
            {
                date: 'deviceType',
                label: '设备类型',
                width: 40
            },
            {
                date: 'phoneModel',
                label: '手机型号',
                width: 80
            },
            {
                date: 'content',
                label: '反馈内容',
                width: 150
            },
            {
                date: 'updatedAt',
                label: '反馈日期',
                width: 80
            }
        ],
        // //热词搜索
        // hotWork: [
        //     {
        //         date: 'sortId',
        //         label: '序号',
        //         width: 50
        //     },
        //     {
        //         date: 'name',
        //         label: '热词名称',
        //         width: 200
        //     },
        //     {
        //         date: 'mtypeName',
        //         label: '热词类型',
        //         width: 120                
        //     }
        // ],
        //站内信 / 历史消息
        historyRecord: [
            {
                date: 'msgType',
                label: '分类',
                width: 40
            },
            {
                date: 'userPhone',
                label: '账户',
                width: 80
            },
            {
                date: 'sendType',
                label: '发送类型',
                width: 40
            },
            {
                date: 'content',
                label: '消息内容',
                width: 160
            },
            {
                date: 'updatedAt',
                label: '发送时间',
                width: 60
            }
        ]
    };
    telePhoneList = [
        18581552762,
        18283584088,
        13088085950,
        17771003079,
        17610426177,
        17600382177,
        13811111111,
        13911111111,
        13910843977,
        17313115223,
        15690848380,
        18381076757,
        15884406155,
        18683620401,
        13810769135,
        18147277806,
        13161675756
    ]
}
