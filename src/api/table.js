import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/web/database/list',
        method: 'get',
        params: query
    })
}

export function optimizeTable(data) {
    return request({
        url: '/web/database/optimize-table',
        method: 'post',
        data
    })
}

export function repairTable(data) {
    return request({
        url: '/web/database/repair-table',
        method: 'post',
        data
    })
}
