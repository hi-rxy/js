import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/web/database/list',
        method: 'get',
        params: query
    })
}

export function getBackupProgress(query) {
    return request({
        url: '/web/database/backup',
        method: 'get',
        params: query
    })
}

export function backupTable(data) {
    return request({
        url: '/web/database/backup',
        method: 'post',
        data
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
