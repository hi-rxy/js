import request from '@/utils/request'

export function fetchConfigGroupList(query) {
    return request({
        url: '/web/config-group/list',
        method: 'get',
        params: query
    })
}

export function fetchConfigGroupOne(query) {
    return request({
        url: '/web/config-group/detail',
        method: 'get',
        params: query
    })
}

export function fetchConfigGroupFields(query) {
    return request({
        url: '/web/configs/fields',
        method: 'get',
        params: query
    })
}

export function fetchConfigList(query) {
    return request({
        url: '/web/configs/list',
        method: 'get',
        params: query
    })
}

export function createConfigGroup(data) {
    return request({
        url: '/web/config-group/add',
        method: 'post',
        data
    })
}

export function updateConfigGroup(data) {
    return request({
        url: '/web/config-group/edit',
        method: 'put',
        data
    })
}

export function deleteConfigGroup(data) {
    return request({
        url: '/web/config-group/del',
        method: 'delete',
        data
    })
}

export function createConfig(data) {
    return request({
        url: '/web/configs/add',
        method: 'post',
        data
    })
}

export function updateConfig(data) {
    return request({
        url: '/web/configs/edit',
        method: 'put',
        data
    })
}

export function updateConfigFields(data) {
    return request({
        url: '/web/configs/save-configs-fields',
        method: 'put',
        data
    })
}

export function deleteConfig(data) {
    return request({
        url: '/web/configs/del',
        method: 'delete',
        data
    })
}
