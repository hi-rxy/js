import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
    console.log('==>路由钩子开始[./src/permission.js]')
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in
    const hasToken = getToken()
    console.log('【./src/permission.js】1、读取token：',hasToken)
    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({ path: '/' })
            NProgress.done()
        } else {
            const hasGetUserInfo = store.getters.name
            //console.log('【./src/permission.js】2、vuex state user.name ：',hasGetUserInfo,typeof (hasGetUserInfo))
            if (hasGetUserInfo) {
                next()
            } else {
                try {
                    // async函数的执行会返回一个promise 对象，并且把内部的值进行promise的封装。
                    // 如果promise对象通过then或catch方法又注册了回调函数，async函数执行完以后，注册的回调函数就会放到异步队列中，等待执行。
                    // await的含义为等待。意思就是代码需要等待await后面的函数运行完并且有了返回结果之后，才继续执行下面的代码，同步的效果

                    // get user info
                    let result = await store.dispatch('user/getInfo' )
                    console.log('【./src/permission.js】2、拉取最新用户信息：',result)

                    const roles = result.roles
                    console.log('【./src/permission.js】3、获取用户所属角色：',roles)

                    store.dispatch('permission/generateRoutes', {roles} ).then((res) => {
                        let accessRoutes = store.getters.permission_addRoutes
                        console.log('【./src/permission.js】7、使用 router.addRouters 方法 添加可访问的路由表：',accessRoutes)

                        router.addRoutes(accessRoutes) // 动态添加可访问路由表
                        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                    }).catch(err => {
                        console.log(err);
                    });

                    next()
                } catch (error) {
                    // remove token and go to login page to re-login
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    // next(`/login?redirect=${to.path}`)
                    next({ path: '/login', query: { redirect: to.path, ...to.query }})
                    NProgress.done()
                }
            }
        }
    } else {
        /* has no token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            //next(`/login?redirect=${to.path}`)
            next({ path: '/login', query: { redirect: to.path, ...to.query }})
            NProgress.done()
        }
    }
    console.log('==>路由钩子结束[./src/permission.js]')
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
