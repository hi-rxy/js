import Layout from "@/layout";
const systemRouter = {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    name: 'System',
    meta: {
        title: '后台管理',
        icon: 'dashboard'
    },
    children: [
        {
            path: 'menu',
            name: 'TreeMenu',
            component: () => import('@/views/system/tree-menu'),
            meta: {
                title: '菜单管理',
                roles: ['admin','editor']
            }
        },
        {
            path: 'admin',
            name: 'Admin',
            component: () => import('@/views/system/admin'),
            meta: {
                title: '用户管理',
                roles: ['admin','editor']
            }
        },
        {
            path: 'role',
            name: 'Role',
            component: () => import('@/views/system/role'),
            meta: {
                title: '角色管理',
                roles: ['admin','editor']
            }
        },
        {
            path: 'permission',
            name: 'Permission',
            component: () => import('@/views/system/permission'),
            meta: {
                title: '权限管理',
                roles: ['admin','editor']
            }
        },
        {
            path: 'table',
            name: 'Table',
            component: () => import('@/views/system/table'),
            meta: {
                title: '数据管理',
                roles: ['admin','editor']
            }
        },
        {
            path: 'config-group',
            name: 'ConfigGroup',
            component: () => import('@/views/system/config-group'),
            meta: {
                title: '配置管理',
                roles: ['admin','editor']
            }
        },
        {
            path: 'configs',
            name: 'Configs',
            component: () => import('@/views/system/configs'),
            meta: {
                title: '同步配置',
                roles: ['admin','editor']
            }
        },
    ]
}
export default systemRouter;
