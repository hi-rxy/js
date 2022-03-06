import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/web/role/list',
        method: 'get',
        params: query
    })
}

export function fetchAuthList(query) {
    return request({
        url: '/web/role/auth',
        method: 'get',
        params: query
    })
}

export function createRole(data) {
    return request({
        url: '/web/role/add',
        method: 'post',
        data
    })
}

export function saveRolePermission(data) {
    return request({
        url: '/web/role/save-role-permission',
        method: 'post',
        data
    })
}

export function updateRole(data) {
    return request({
        url: '/web/role/edit',
        method: 'put',
        data
    })
}

export function deleteRole(data) {
    return request({
        url: '/web/role/del',
        method: 'delete',
        data
    })
}
