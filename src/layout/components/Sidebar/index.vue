<template>
    <div :class="{'has-logo':showLogo}">
        <logo v-if="showLogo" :collapse="isCollapse"/>
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="variables.menuBg"
                :text-color="variables.menuText"
                :unique-opened="false"
                :active-text-color="variables.menuActiveText"
                :collapse-transition="false"
                mode="vertical"
            >
                <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
    components: { SidebarItem, Logo },
    computed: {
        ...mapGetters([
            'permission_routes',
            'sidebar'
        ]),
        routes() {
            console.log('【./src/layout/components/Sidebar/index.vue】8、展示路由表：',this.permission_routes)
            return this.permission_routes
        },
        activeMenu() {
            const route = this.$route
            console.log('【./src/layout/components/Sidebar/index.vue】9、当前激活的菜单：',route)
            const { meta, path } = route
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu
            }
            return path
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo
        },
        variables() {
            return variables
        },
        isCollapse() {
            return !this.sidebar.opened
        }
    }
}
</script>
