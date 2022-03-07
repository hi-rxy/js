import { fetchRoleMenuList } from '@/api/menu'
import { asyncRoutes, constantRoutes,map } from '@/router'
// import exportDefaultRouter from "@/router/export-modules-router";//本地开发

// 将本地routerMap映射到ajax获取到的serverRouterMap;
function generateAsyncRouter(routerMap, serverRouterMap) {
    serverRouterMap.forEach(function (item, index) {
        item.component = routerMap[item.component]
        if(item.children && item.children.length > 0){
            generateAsyncRouter(routerMap, item.children)
        }
    })
    return serverRouterMap;
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    generateRoutes({ commit }, res) {
        return new Promise(resolve => {
            let accessedRoutes
            let roles = res['roles']
            fetchRoleMenuList({roles:roles}).then(response => {
                console.log('【./src/store/modules/permission.js】4、根据角色从后端拉取对应菜单：',response.data)
                let serverRouters = generateAsyncRouter(map, response.data)
                let routers = serverRouters.concat(asyncRoutes)
                if (roles.includes('administrator')) {
                    console.log('【./src/store/modules/permission.js】5、当前用户是超级管理员角色，拥有全部权限：',routers)
                    accessedRoutes = routers || []
                } else {
                    console.log('【./src/store/modules/permission.js】5、当前用户不是超级管理员角色，需要过滤路由表：',routers)
                    accessedRoutes = filterAsyncRoutes(routers, roles)
                }
                commit('SET_ROUTES', accessedRoutes)
                console.log('【./src/store/modules/permission.js】6、将过滤后的路由存入 vuex state SET_ROUTES：',accessedRoutes)
                resolve(accessedRoutes)
            },error => {
                console.log('拉取角色菜单失败',error.message())
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
console.log('==>vuex路由[./src/state/modules/permission.js]')
