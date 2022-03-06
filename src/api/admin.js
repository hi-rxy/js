import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/web/admin/list',
        method: 'get',
        params: query
    })
}

export function createAdmin(data) {
    return request({
        url: '/web/admin/add',
        method: 'post',
        data
    })
}

export function updateAdmin(data) {
    return request({
        url: '/web/admin/edit',
        method: 'put',
        data
    })
}

export function deleteAdmin(data) {
    return request({
        url: '/web/admin/del',
        method: 'delete',
        data
    })
}

export function adminState(data) {
    return request({
        url: '/web/admin/state',
        method: 'put',
        data
    })
}

export function fileUpload(data) {
    return request({
        url: '/common/upload',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

export function roleList() {
    return request({
        url: '/web/admin/roles',
        method: 'get'
    })
}
