import request from '@/utils/request'

export function login(userName, password) {
    return request({
        url: '/login/cms',
        method: 'post',
        data: {
            userName,
            password
        }
    })
}

export function getInfo(token) {
    return request({
        url: '/user/info',
        method: 'get',
        params: {
            token
        }
    })
}

export function logout() {
    return request({
        url: '/login/logout',
        method: 'post'
    })
}
