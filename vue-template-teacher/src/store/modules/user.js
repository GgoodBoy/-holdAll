import {
    login,
    logout,
    getInfo
} from '@/api/login'
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        permissions:[],
        addRouteFlag:false
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_AUTHTREE(state,data){
            state.permissions = data;
        },
        SETADDROUTEFLAG(state,data){
            state.addRouteFlag = data;
        }
    },

    actions: {
        // 登录
        Login({
            commit
        }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(response => {
                    const data = response.content;
                    setToken(data.token)
                    commit('SET_AUTHTREE',data.permissions)
                    commit('SET_TOKEN', data.token)
                    let permissions = data.permissions.map(item=>{
                        return item.replace(/\./g,':');
                    })
                    window.localStorage.setItem('permissions', JSON.stringify(permissions))
                    window.localStorage.setItem('permissionName',JSON.stringify(data.userName))
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(response => {
                    const data = response.data
                    if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', data.roles)
                    } else {
                        reject('getInfo: roles must be a non-null array !')
                    }
                    commit('SET_NAME', data.name)
                    commit('SET_AVATAR', data.avatar)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        LogOut({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    removeToken()
                })
            })
        },

        // 前端 登出
        FedLogOut({
            commit
        }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        },
        setAddRouteFlag({commit},data){
            commit('SETADDROUTEFLAG',data)
        }
    }
}

export default user
