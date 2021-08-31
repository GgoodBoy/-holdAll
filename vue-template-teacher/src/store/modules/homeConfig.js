export default {
    state:{
        adultHomeRender:false,//APP成人版首页是否渲染
        adultHomeConfig:[
            // {moduleType,moduleName}
        ],//APP成人首页模块配置数据，主要是点击菜单上模块，记录添加的模块类型和名称
        adultHomeEditData:[
            // {tabId:1,tabName:'测试',data:[],active:true},
            // {
            //     id:'number',//模块id
            //     homeCloumnId:'number',//栏目表id
            //     name:'string',//模块名称
            //     styleImgUrl:'string',//样式图片
            //     localId:'number',//定位id,
            //     isFocus:'boolean',//模块是否选中,
            //     moduleName:'string'//模块名，定位VUE文件
            // }
        ],//APP成人首页模块编辑数据
        adultHomeModuleChildData:[],//APP成人首页每个模块下面的编辑数据,父级为adultHomeEditData中localId那一列(单模块)
        childHomeRender:false,//APP少儿版首页是否渲染
        childHomeConfig:[
            // {moduleType,moduleName}
        ],//APP少儿首页模块配置数据，主要是点击菜单上模块，记录添加的模块类型和名称
        childHomeEditData:[
            {tabId:2,tabName:'',data:[],active:true},
            {tabId:3,tabName:'',data:[],active:false},
            {tabId:4,tabName:'',data:[],active:false},
        ],//APP少儿首页模块编辑数据，分为3个标签页
        childHomeModuleChildData:[],//APP少儿首页每个模块下面的编辑数据(单模块)
        homeCloumnId:'',//保存临时新增的栏目ID
    },
    mutations:{
        SETADULTHOMERENDER(state,payload){
            state.adultHomeRender = payload;
        },
        SETCHILDHOMERENDER(state,payload){
            state.childHomeRender = payload;
        },
        SETADULTHOMECONFIG(state,payload){
            state.adultHomeConfig = payload;
        },
        SETADULTHOMEEDITDATA(state,payload){
            state.adultHomeEditData = payload;
        },
        SETADULTHOMEMODULECHILDDATA(state,payload){
            state.adultHomeModuleChildData = payload;
        },
        SETCHILDHOMECONFIG(state,payload){
            state.childHomeConfig = payload;
        },
        SETCHILDHOMEEDITDATA(state,payload){
            state.childHomeEditData = payload;
        },
        SETCHILDHOMEMODULECHILDDATA(state,payload){
            state.childHomeModuleChildData = payload;
        },
        SETHOMECLOUMNID(state,payload){
            state.homeCloumnId = payload;
        }
    },
    actions:{
        setAdultHomeRender({commit},payload){
            commit('SETADULTHOMERENDER',payload)
        },
        setChildHomeRender({commit},payload){
            commit('SETCHILDHOMERENDER',payload)
        },
        setAdultHomeConfig({commit},payload){
            commit('SETADULTHOMECONFIG',payload)
        },
        setAdultHomeEditData({commit},payload){
            commit('SETADULTHOMEEDITDATA',payload)
        },
        setAdultHomeModuleChildData({commit},payload){
            commit('SETADULTHOMEMODULECHILDDATA',payload)
        },
        setChildHomeConfig({commit},payload){
            commit('SETCHILDHOMECONFIG',payload)
        },
        setChildHomeEditData({commit},payload){
            commit('SETCHILDHOMEEDITDATA',payload)
        },
        setChildHomeModuleChildData({commit},payload){
            commit('SETCHILDHOMEMODULECHILDDATA',payload)
        },
        setHomeCloumnId({commit},payload){
            commit('SETHOMECLOUMNID',payload)
        }
    }
}