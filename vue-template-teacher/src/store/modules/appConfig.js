import editimg1 from "../../../static/images/4.jpg"
import classifyMap from '../../assets/images/pc_classify_bgd.png'
import {
    Message
} from 'element-ui'
const appConfig = {
    namespaced: true,
    state: {
        // type: '', //当前点击的是哪个类型模块；
        appStore: {
            type: "",//选中的类型
            soleid: "",//选中的额唯一id;
            courseDivStyle: false,//表示点击推存弹框的,
            boolpluginForDetail: false
        },
        alldata: [], //初始化渲染所有组件；
        idAlllist: [], //所有类型列表的唯一id,
        idInitlist: [],
        chooseModelName: '',
        loading: true,
        isDisabled: false,
        chooseIdlists: [],
        //标签列表；
        cuouseLabelObj: {
            selectList: [],
            selectListLabel: []
        }
    },
    mutations: {
        SAVE_USER_NAME: (state, name) => {
            state.uerNameInfo = name;
        },
        //数据拆分
        // banner: [], //bannner:数据结构；        
        // columnsCourse: [], //通栏课
        // classify: [],//导航分类
        // popularCourses: [],//热门课程
        // featured: [], //推荐位
        // timeZone: [], //限时专区
        // guessLike: [], //猜你喜欢
        // advertising: [] //通栏图
        appHomePageData(state, content) {
            state.idInitlist = [];
            // state.alldata = [];
            for (var val of content) {
                switch (val.moduleType) {
                    case "banner":
                        val.list.forEach(function (element, index) {
                            if (!element.hasOwnProperty('id')) {
                                element.id = index + 1;
                            }
                        });
                        state.idInitlist.push(val.id);
                        break;
                    case "columnsCourse":
                        val.list.forEach(function (element, index) {
                            if (!element.hasOwnProperty('id')) {
                                element.id = index + 1;
                            }
                        });
                        state.idInitlist.push(val.id);
                        break;
                    case "classify":
                        val.list.forEach(function (element, index) {
                            if (!element.hasOwnProperty('id')) {
                                element.id = index + 1;
                            }
                        });
                        state.idInitlist.push(val.id);
                        break;
                    case "popularCourses":
                        var objarr = val.list.map(function (item, index) {
                            if (!item.hasOwnProperty('id')) {
                                return {
                                    courseBrowsCount: item.courseBrowsCount,
                                    courseUserLikeCount: item.courseUserLikeCount,
                                    sellingPrice: item.sellingPrice,
                                    surfacePlot: item.surfacePlot,
                                    title: item.title,
                                    id: index + 1
                                }
                            } else {
                                return {
                                    courseBrowsCount: item.courseBrowsCount,
                                    courseUserLikeCount: item.courseUserLikeCount,
                                    sellingPrice: item.sellingPrice,
                                    surfacePlot: item.surfacePlot,
                                    title: item.title,
                                    id: item.id
                                };
                            }
                        })
                        val.list = objarr;
                        state.idInitlist.push(val.id);
                        break;
                    case "featured":
                        var objarr = val.list.map(function (item, index) {
                            if (!item.hasOwnProperty('id')) {
                                return {
                                    content: item.id,
                                    courseName: item.title,
                                    sellingPrice: item.sellingPrice,
                                    no: 0,
                                    surfacePlot: item.surfacePlot,
                                    title: item.title,
                                    courseBrowsCount: item.courseBrowsCount,
                                    courseUserLikeCount: item.courseUserLikeCount,
                                    originalPrice: item.originalPrice,
                                    type: 2,
                                    id: index + 1
                                }
                            } else {
                                return {
                                    content: item.id,
                                    courseName: item.title,
                                    sellingPrice: item.sellingPrice,
                                    title: item.title,
                                    courseBrowsCount: item.courseBrowsCount,
                                    courseUserLikeCount: item.courseUserLikeCount,
                                    originalPrice: item.originalPrice,
                                    no: 0,
                                    type: 2,
                                    surfacePlot: item.surfacePlot,
                                    id: item.id
                                };
                            }
                        })
                        val.list = objarr;
                        state.idInitlist.push(val.id);
                        break;
                    case "timeZone":
                        var objarr = val.list.map(function (item, index) {
                            if (!item.hasOwnProperty('id')) {
                                return {
                                    courseBrowsCount: item.courseBrowsCount,
                                    courseUserLikeCount: item.courseUserLikeCount,
                                    sellingPrice: item.sellingPrice,
                                    surfacePlot: item.surfacePlot,
                                    title: item.title,
                                    id: index + 1
                                }
                            } else {
                                return {
                                    courseBrowsCount: item.courseBrowsCount,
                                    courseUserLikeCount: item.courseUserLikeCount,
                                    sellingPrice: item.sellingPrice,
                                    surfacePlot: item.surfacePlot,
                                    title: item.title,
                                    id: item.id
                                };
                            }
                        })
                        val.list = objarr;
                        state.idInitlist.push(val.id);
                        break;
                    case "guessLike":
                        var objarr = val.list.map(function (item, index) {
                            if (!item.hasOwnProperty('id')) {
                                return {
                                    courseBrowsCount: item.courseBrowsCount,
                                    courseUserLikeCount: item.courseUserLikeCount,
                                    sellingPrice: item.sellingPrice,
                                    originalPrice: item.originalPrice,
                                    surfacePlot: item.surfacePlot,
                                    title: item.title,
                                    id: index + 1
                                }
                            } else {
                                return {
                                    courseBrowsCount: item.courseBrowsCount,
                                    courseUserLikeCount: item.courseUserLikeCount,
                                    sellingPrice: item.sellingPrice,
                                    originalPrice: item.originalPrice,
                                    surfacePlot: item.surfacePlot,
                                    title: item.title,
                                    id: item.id
                                };
                            }
                        })
                        val.list = objarr;
                        state.idInitlist.push(val.id);
                        break;
                    case "advertising":
                        val.list.forEach(function (element, index) {
                            if (!element.hasOwnProperty('id')) {
                                element.id = index + 1;
                            }
                        });
                        state.idInitlist.push(val.id);
                        break;
                    case "freeCourses":
                        state.idInitlist.push(val.id);
                        break;
                    case "freeGoodCourse":
                        state.idInitlist.push(val.id);
                        break;        
                    case "teacherRecommend":
                        state.idInitlist.push(val.id);
                        break;  
                    default:
                        console.log("数据不对")
                        break;
                }
            }
            state.alldata = content
        },
        mobiledChangeTypeNo(state) {
            state.appStore.type = '';
        },
        //banner数据操作
        bannerAction(state, object) {
            state.banner = object
        },
        //推存位title
        setTitileEven(state, titleName) {
            for (let item of state.alldata) {
                if (item.id === state.appStore.soleid) {
                    item.moduleName = titleName;
                }
            }
        },
        setLabelOrCourseData(state, data) {
            if (data.type == 2) {
                state.cuouseLabelObj.selectListLabel = data.data;
            } else { 
                state.cuouseLabelObj.selectList = data.data;
            }
        },
        loadingBool(state, objVal) { 
            state.loading = objVal;
        },
        dataChangeEven(state, objVal) { 
                for (let item of state.alldata) { 
                    if (item.id === state.appStore.soleid) { 
                        for (let conId of item.list) { 
                            if (conId.id === objVal.id) { 
                                switch (objVal.num) {
                                    case "1":
                                            conId.type =parseInt(objVal.changeType);
                                        break;
                                    case "2": 
                                            conId.content = objVal.changeVal;   
                                        break;
                                    case "3":
                                        conId.title = objVal.changeTitle;    
                                        break;   
                                    case "4":
                                        conId.name = objVal.name;
                                        break;    
                                    case "5":
                                        if(objVal.name){
                                            conId.name = objVal.name;
                                        }
                                        conId.classifyId = objVal.classifyId;
                                        conId.type = objVal.type;
                                        conId.childrenClassifyId = objVal.childrenClassifyId;
                                        conId.levelTwoName = objVal.levelTwoName || '';
                                        break;                                                                                                                                                      
                                    default:
                                        conId.picUrl = objVal.changeImg;    
                                        break;
                                }
                                break;
                            }
                        }
                        break;
                    }
                }              
            
        },
        moveModeleEven(state, strings) { 
            let obj1 = [];
            let obj2 = {};
            let obj3 = {};
            for (let i = 0; i < state.alldata.length;i++) { 
                if (state.alldata[i].id === state.appStore.soleid) {
                    if (strings === 'top') {
                        if (i>1) { 
                            obj1 = state.alldata.splice(i, 1)
                            obj2 = obj1[0]
                            state.alldata.splice(i - 1, 0, obj2)
                        }else{
                            if(state.alldata[0].moduleType=='banner'&&i==1){
                                Message.error('第一条必须是banner');
                                return;
                            }
                        }
                    } else {
                        if (i>0||i==state.alldata.length) { 
                            obj1 = state.alldata.splice(i, 1)
                            obj2 = obj1[0]
                            state.alldata.splice(i + 1, 0, obj2)
                        }
                        else{
                            if(state.alldata[0].moduleType=='banner'&&i==0){
                                Message.error('第一条必须是banner');
                                return;
                            }
                        }    
                    }
                    break;
                }
            }
        },
        typeAction(state, obj) {
            state.chooseModelName = obj.moduleType;
            console.log(obj)
            state.appStore.type = obj.moduleType;
            state.appStore.soleid = obj.id;
            for (const iterator of state.alldata) {
                if (iterator.id == state.appStore.soleid) { 
                    iterator.list.forEach(function (element,index) { 
                        if(!element['id']){
                            element['id'] = index+1;
                        }
                    });
                    break;
                }
            }
        },
        setModelnameNull(state) {
            state.chooseModelName = ''
         },
        idArrObjFun(state, obj) { 
            state.idAlllist = state.idAlllist.concat(obj)
        },
        modelMeDelete(state, id) {
            state.alldata.forEach(function (element,index) { 
                if (element.id==id&&index!=0) { 
                    state.alldata.splice(index, 1);
                    state.chooseModelName = '';
                    state.appStore.type = '';
                }
            });
        },
        addAppList(state, numId) {
            switch (state.appStore.type) {
                case "banner":                      
                    for (const iterator1 of state.alldata) {
                        if (state.appStore.soleid === iterator1.id && iterator1.list.length < 6) {
                            iterator1.list.push({
                                type: 1, 
                                content: "", 
                                title:"课程1",
                                picUrl: "", 
                                id:numId                                
                            })
                        }
                    }
                    break;
                case "columnsCourse":
                    for (const iterator1 of state.alldata) {
                        if (state.appStore.soleid === iterator1.id && iterator1.list.length < 2) {
                            iterator1.list.push({
                                name: "", //模块名称	
                                picUrl: '', //通栏图	
                                title: "", //标题
                                type:2 ,// 课程
                                content:"2",
                                id:new Date().getTime()                          
                            })
                        }
                    }
                    break;
                case "classify":
                    for (const iterator1 of state.alldata) {
                        if (state.appStore.soleid === iterator1.id && iterator1.list.length < 100) {
                            iterator1.list.push({
                                classifyId: '', //分类Id
                                no: 0, //序号
                                picUrl: classifyMap, //分类图
                                id: new Date().getTime(),
                                type:''
                            })
                        }
                    }
                    break;
                case "popularCourses":
                    for (const iterator1 of state.alldata) {
                        if (state.appStore.soleid === iterator1.id && iterator1.list.length < 6) {
                            iterator1.list.push({
                                courseBrowsCount:0,
                                courseUserLikeCount:0,
                                sellingPrice:'',
                                // surfacePlot:editimg3,
                                surfacePlot:'',
                                id:new Date().getTime()                          
                            })
                        }
                    }
                    break;
                case "featured":
                    for (const iterator1 of state.alldata) {
                        if (state.appStore.soleid === iterator1.id && iterator1.list.length < 8) {
                            iterator1.list.push({
                                content: 1, //课程id
                                courseName: "时间简史", //课程名称
                                no: 0, //序号,
                                type:2,
                                picUrl:editimg1,
                                id:new Date().getTime()                        
                            })
                        }
                    }
                    break;
                case "timeZone":
                    for (const iterator1 of state.alldata) {
                        if (state.appStore.soleid === iterator1.id && iterator1.list.length < 6) {
                            iterator1.list.push({
                                courseBrowsCount:0,
                                courseUserLikeCount:0,
                                sellingPrice:'',
                                // surfacePlot: editimg3,
                                surfacePlot:'',
                                content: "",
                                id:new Date().getTime()                           
                            })
                        }
                    }
                    break;
                case "guessLike":
                    for (const iterator1 of state.alldata) {
                        if (state.appStore.soleid === iterator1.id && iterator1.list.length < 6) {
                            iterator1.list.push({
                                courseBrowsCount:0,
                                courseUserLikeCount:0,
                                sellingPrice:'',
                                // surfacePlot:editimg3,
                                surfacePlot:'',
                                content: "",
                                id:new Date().getTime()                         
                            })
                        }
                    }
                    break;
                case "advertising":
                    for (const iterator1 of state.alldata) {
                        if (state.appStore.soleid === iterator1.id && iterator1.list.length < 1) {
                            iterator1.list.push({
                                content: "2", //活动id	
                                picUrl: '', //通栏图
                                title: "", //标题
                                type: 2, //类型：1活动 2课程 3链接 4无链接  
                                id:new Date().getTime()                          
                            })
                        }
                    }
                    break;
                default:
                    console.log("123")
                    break;
            }
            console.log(state.alldata);
        },
        removeAction(state, objs) {
            objs.removeBanner(state.alldata, state.appStore.soleid, objs.soleid)
        },
        isOkOrAddEvent(state, objs) { 
            state.appStore.courseDivStyle = objs.bool;
            if (objs.datas.length>0&&objs.bools===undefined) { 
                for (const iterator of state.alldata) {
                    if (iterator.id == state.appStore.soleid) { 
                        objs.datas.forEach(function (element, index) {
                            if (!element.hasOwnProperty('id')) {
                                element.id = element.content;
                            }
                        });                        
                        iterator.list = objs.datas;
                        break;
                    }
                }
            }else if(objs.datas.length>0&&objs.bools==true){
                state.chooseIdlists = objs.datas;               
            }
        }        
    },
    actions: {}
}
export default appConfig