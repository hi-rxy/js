import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/web/menu/list',
        method: 'get',
        params: query
    })
}

export function fetchTreeList(query) {
    return request({
        url: '/web/menu/trees',
        method: 'get',
        params: query || {}
    })
}

export function fetchRoleMenuList(data) {
    return request({
        url: '/web/menu/role-menu',
        method: 'post',
        data
    })
}

export function fetchMenu(id) {
    return request({
        url: '/web/menu/detail',
        method: 'get',
        params: { id }
    })
}

export function createMenu(data) {
    return request({
        url: '/web/menu/add',
        method: 'post',
        data
    })
}

export function updateMenu(data) {
    return request({
        url: '/web/menu/edit',
        method: 'put',
        data
    })
}

export function deleteMenu(data) {
    return request({
        url: '/web/menu/del',
        method: 'delete',
        data
    })
}

export function menuState(data) {
    return request({
        url: '/web/menu/state',
        method: 'put',
        data
    })
}
