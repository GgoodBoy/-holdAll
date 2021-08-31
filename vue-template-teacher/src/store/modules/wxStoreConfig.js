export default {
    state: {
        //样式切换
        wxLeftData: [],//微页面左侧数据保存，实时接收右边变化的数据而进行变化;
        wxRightData: [],//微页面右侧数据保存,实时控制左边的变化;
        wxBufferData: '',//微页面右边点击保存后的最真实前端保存值；在左边点击保存时，这里的值将是被提交给后台的值;
        // wxSelectModelInfo:[]//模块选中状态与否,包含模块id和选中状态
        wxModelValeType: '',//监听左侧点击组件的
        wxComponentNameType: '',//左侧组件关闭
        wxSavePageIsState:false//监测当前页面有没有操作行为；
    },
    mutations:{
        SETWXRIGHTDATA(state,payload){
            state.wxRightData = payload;
        },
        SETWXLEFTDATA(state,payload){
            state.wxLeftData = payload;
        },
        SETWXBUFFERDATA(state,payload){
            state.wxBufferData = payload;
        },
        SETWXMODELVALEYPE(state,payload){
            state.wxModelValeType = payload;
        },
        SETWXCOMPONENTNAMETYPE(state,payload){
            state.wxComponentNameType = payload;
        },
        SETWXSAVEPAGEISSTATE(state,payload){
            state.wxSavePageIsState = payload;
        }
        // SETWXSELECTMODELINFO(state,payload){
        //     state.wxSelectModelInfo = payload;
        // }

    },
    actions:{
        setWxRightData({commit},payload){
            commit('SETWXRIGHTDATA',payload)
        },
        setWxLeftData({commit},payload){
            commit('SETWXLEFTDATA',payload)
        },
        setWxBufferData({commit},payload){
            commit('SETWXBUFFERDATA',payload)
        },
        setwxModelValeType({commit},payload){
            commit('SETWXMODELVALEYPE',payload)
        },
        setwxComponentNameType({commit},payload){
            commit('SETWXCOMPONENTNAMETYPE',payload)
        },
        setwxSavePageIsState({commit},payload){
            commit('SETWXSAVEPAGEISSTATE',payload)
        }
        // setWxSelectModelInfo({commit},payload){
        //     commit('SETWXSELECTMODELINFO',payload)
        // }
    }
}