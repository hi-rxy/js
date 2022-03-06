import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/web/site/admin-login',
        method: 'post',
        data
    })
}

export function getInfo(token) {
    return request({
        url: '/web/admin/admin-info',
        method: 'get',
        params: { token }
    })
}

export function logout() {
    return request({
        url: '/web/admin/admin-logout',
        method: 'post'
    })
}
