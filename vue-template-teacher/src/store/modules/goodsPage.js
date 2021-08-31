export default{
    state:{
        //不要问我这块的注释，自己去看首页的
        render:false,
        config:[],
        editData:[],//左侧
        moduleChildData:[],//右侧
        cloumnId:''
    },
    mutations:{
        SETRENDER(state,payload){
            state.render = payload
        },
        SETCONFIG(state,payload){
            state.config = payload
        },
        SETEDITDATA(state,payload){
            state.editData = payload
        },
        SETMODULECHILDDATA(state,payload){
            state.moduleChildData = payload
        },
        SETCLOUMNID(state,payload){
            state.homeCloumnId = payload
        }
    },
    actions: {
        setRender({commit},payload){
            commit('SETRENDER',payload)
        },
        setConfig({commit},payload){
            commit('SETCONFIG',payload)
        },
        setEditData({commit},payload){
            commit('SETEDITDATA',payload)
        },
        setModuleChildData({commit},payload){
            commit('SETMODULECHILDDATA',payload)
        },
        setCloumnId({commit},payload){
            commit('SETCLOUMNID',payload)
        }
    }
}