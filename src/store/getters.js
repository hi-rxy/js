const getters = {
    // store/modules/app.js
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,

    // store/modules/user.js
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    email: state => state.user.email,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,

    // store/modules/tagsView.js
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,

    // store/modules/permission.js
    permission_routes: state => state.permission.routes,// 全部路由（包含权限路由）
    permission_addRoutes: state => state.permission.addRoutes,

    // store/modules/errorLog.js
    errorLogs: state => state.errorLog.logs
}
export default getters
