import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/web/authority/list',
        method: 'get',
        params: query
    })
}

export function createAuthority(data) {
    return request({
        url: '/web/authority/add',
        method: 'post',
        data
    })
}

export function updateAuthority(data) {
    return request({
        url: '/web/authority/edit',
        method: 'put',
        data
    })
}

export function deleteAuthority(data) {
    return request({
        url: '/web/authority/del',
        method: 'delete',
        data
    })
}
