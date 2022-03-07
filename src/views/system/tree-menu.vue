<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <!--  搜索开始  -->
                    <div class="filter-container" style="margin-bottom: 15px;">
                        <el-input v-model="listQuery.menu_name" placeholder="菜单名称" style="width: 200px;"
                                  class="filter-item" @keyup.enter.native="handleFilter"
                        />
                        <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary"
                                   icon="el-icon-search" @click="handleFilter"
                        >
                            搜索
                        </el-button>
                        <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary"
                                   icon="el-icon-refresh" @click="resetFilter"
                        >
                            清除
                        </el-button>
                        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                                   @click="handleCreate"
                        >
                            增加
                        </el-button>
                    </div>
                    <!--  搜索结束  -->

                    <!--  表格开始  -->
                    <el-table
                        row-key="id"
                        v-loading="listLoading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(245, 247, 250, 1)"
                        :data="list"
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                        border
                        fit
                        highlight-current-row
                        style="width: 100%;"
                        max-height="750"
                        @sort-change="sortChange"
                    >
                        <!--  字段开始    -->
                        <el-table-column
                            type="selection"
                            width="40">
                        </el-table-column>
                        <el-table-column label="菜单" align="center" width="180">
                            <template slot-scope="{row}">
                                <span>{{ row.menu_name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="排序" align="center" width="80" prop="sort" sortable="custom"
                                         :class-name="getSortClass('sort')"
                        >
                            <template slot-scope="{row}">
                                <span>{{ row.sort }}</span>
                                <!--<el-input v-model="form.sort" @change="handleCurrentChange(row)" />-->
                            </template>
                        </el-table-column>
                        <el-table-column label="图标" align="center" width="80">
                            <template slot-scope="{row}">
                                <span><svg-icon :icon-class="row.icons" class-name="card-panel-icon"/></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="地址" align="center" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <span>{{ row.url }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="路由名称" align="center" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <span>{{ row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="路径" align="center" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <span>{{ row.path }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="缓存" align="center" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <el-tag :type="row.no_cache | boolFilter">
                                    {{ row.no_cache }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="面包屑" align="center" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <el-tag :type="row.breadcrumb | boolFilter">
                                    {{ row.breadcrumb }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="固定" align="center" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <el-tag :type="row.affix | boolFilter">
                                    {{ row.affix }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center" width="100" class-name="status-col">
                            <template slot-scope="{row}">
                                <el-tag :type="row.status | statusFilter">
                                    {{ row.status }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <!--  字段结束   -->
                        <!--  操作开始   -->
                        <el-table-column label="操作" align="center" width="240px" class-name="small-padding fixed-width">
                            <template slot-scope="{row,$index}">
                                <el-button type="primary" size="mini" @click="handleUpdate(row)">
                                    编辑
                                </el-button>
                                <el-button v-if="row.status!=='enable'" size="mini" type="success"
                                           @click="handleModifyStatus(row,'enable')"
                                >
                                    开启
                                </el-button>
                                <el-button v-if="row.status!=='disable'" size="mini"
                                           @click="handleModifyStatus(row,'disable')"
                                >
                                    禁用
                                </el-button>
                                <el-button v-if="row.status!=='enable'" size="mini" type="danger"
                                           @click="handleDelete(row,$index)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                        <!--  操作结束   -->
                    </el-table>
                    <!--  表格结束  -->
                </el-card>
            </el-col>
        </el-row>
        <!-- form 表单 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="70px"
            >
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="上级" prop="pid">
                            <el-cascader
                                :options="trees"
                                v-model="form.pid"
                                :props="{
                      checkStrictly: true,
                      emitPath: false,
                      label: 'menu_name',
                      value: 'id',
                      children: 'children'
                    }"
                                :show-all-levels="false"
                                placeholder="父级菜单"
                                collapse-tags
                                clearable
                                @change="changeParent"
                                clearable
                            ></el-cascader>
                        </el-form-item>
                        <el-form-item label="名称" prop="menu_name">
                            <el-input v-model="form.menu_name"/>
                        </el-form-item>
                        <el-form-item label="图标" prop="icons">
                            <el-input v-model="form.icons"/>
                        </el-form-item>
                        <el-form-item label="地址" prop="url">
                            <el-input v-model="form.url"/>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="form.status" class="filter-item" placeholder="Please select">
                                <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-input v-model="form.sort"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="路由名称" prop="name">
                            <el-input v-model="form.name"/>
                        </el-form-item>
                        <el-form-item label="路径" prop="path">
                            <el-input v-model="form.path"/>
                        </el-form-item>
                        <el-form-item label="缓存" prop="no_cache">
                            <el-select v-model="form.no_cache" class="filter-item" placeholder="Please select">
                                <el-option v-for="item in boolOptions" :key="item" :label="item" :value="item"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="面包屑" prop="breadcrumb">
                            <el-select v-model="form.breadcrumb" class="filter-item" placeholder="Please select">
                                <el-option v-for="item in boolOptions" :key="item" :label="item" :value="item"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="固定" prop="affix">
                            <el-select v-model="form.affix" class="filter-item" placeholder="Please select">
                                <el-option v-for="item in boolOptions" :key="item" :label="item" :value="item"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" :disabled="buttonStatus" @click="dialogStatus==='create'?createData():updateData()">
                    确认
                </el-button>
            </div>
        </el-dialog>
        <!-- form 表单 -->
    </div>
</template>

<script>
import { fetchTreeList, createMenu, updateMenu, deleteMenu, menuState } from '@/api/menu'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
    name: 'TreeMenu',
    components: { Pagination },
    directives: { waves },
    filters: {
        statusFilter(status) {
            const statusMap = {
                enable: 'success',
                disable: 'danger'
            }
            return statusMap[status]
        },
        boolFilter(value) {
            const statusMap = {
                show: 'success',
                hidden: 'danger'
            }
            return statusMap[value]
        }
    },
    data() {
        return {
            tableKey: 0,
            total: 0,
            // 查询
            listQuery: {
                page: 1,
                limit: 10,
                sort: '-id'
            },
            // 表单
            form: {
                id: 0,
                menu_name: '',
                icons: '',
                url: '',
                sort: 1,
                pid: 0,
                status: 'enable',
                text: '',
                name:'',
                path:'',
                no_cache:'hidden',
                breadcrumb:'show',
                affix:'hidden',
            },
            // 分页数据
            list: [],
            // 左侧树数据
            trees: null,
            // 表单操作类型
            dialogStatus: '',
            // 左侧菜单关键字筛选
            filterText: '',
            // 状态值
            statusOptions: ['enable', 'disable'],
            // 状态值
            boolOptions: ['show', 'hidden'],
            // 表单按钮
            textMap: {
                update: '编辑',
                create: '添加'
            },
            // 分页数据加载状态
            listLoading: true,
            // 默认表单弹窗-隐藏
            dialogFormVisible: false,
            // 下载状态
            downloadLoading: false,
            // 表单提交按钮状态
            buttonStatus:false,
            // 表单验证规则
            rules: {
                menu_name: [{ required: true, message: '栏目名称 is required', trigger: 'blur' }]
            }
        }
    },
    watch: {
    },
    created() {
        this.getList()
        this.getTreeList()
    },
    methods: {
        getList() {
            // 菜单列表
            this.listLoading = true
            fetchTreeList(this.listQuery).then(response => {
                this.list = response.data
                // this.total = response.data.total
                this.listLoading = false
            },error => {
                this.listLoading = false
            })
        },
        getTreeList() {
            // 菜单树形列表
            fetchTreeList().then(response => {
                this.trees = response.data
            },error => {
                console.log('请求出错')
            })
        },
        resetFilter() {
            // 重置查询
            this.listQuery = {
                page: 1,
                limit: 10,
                sort: '-id'
            }
            this.getList()
        },
        handleFilter() {
            // 点击查询
            this.listQuery.page = 1
            this.getList()
        },
        changeParent(e) {
            // 显示级联菜单名称
            if (e) {
                const node = this.$refs.parentTree.getCheckedNodes()[0].data
                this.form.text = node.name
            }
        },
        sortChange(data) {
            // 设置排序
            const { prop, order } = data
            this.sortByColumn(order, prop)
        },
        sortByColumn(order, prop) {
            if (order === 'ascending') {
                this.listQuery.sort = '+' + prop
            } else {
                this.listQuery.sort = '-' + prop
            }
            this.handleFilter()
        },
        handleCurrentChange(row) {
            console.log(row)
        },
        resetTemp() {
            // 重置表单
            this.form = {
                id: 0,
                menu_name: '',
                icons: '',
                url: '',
                sort: 1,
                pid: 0,
                status: 'enable',
                text: '',
                name:'',
                path:'',
                no_cache:'hidden',
                breadcrumb:'show',
                affix:'hidden',
            }
        },
        handleModifyStatus(row, status) {
            // 修改状态
            this.form = Object.assign({}, row, { status: status }) // copy obj
            menuState(this.form).then((res) => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                row.status = status
            },error => {
                console.log('修改状态失败')
            })
        },
        handleCreate() {
            // 唤醒添加弹窗
            this.resetTemp()
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
            this.buttonStatus = false
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        createData() {
            // 添加菜单
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.buttonStatus = true
                    createMenu(this.form).then((res) => {
                        // this.form.id = res.data.id
                        // this.list.unshift(this.form)
                        this.dialogFormVisible = false
                        this.$notify({
                            title: 'Success',
                            message: 'Created Successfully',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList()
                        this.buttonStatus = false
                    },error => {
                        this.dialogFormVisible = false
                        this.buttonStatus = true
                    })
                }
            })
        },
        handleUpdate(row) {
            // 唤醒修改菜单
            this.form = Object.assign({}, row) // copy obj
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.buttonStatus = false
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        updateData() {
            // 修改菜单
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.buttonStatus = true
                    const tempData = Object.assign({}, this.form)
                    updateMenu(tempData).then((res) => {
                        // const index = this.list.findIndex(v => v.id === this.form.id)
                        // this.list.splice(index, 1, this.form)
                        this.dialogFormVisible = false
                        this.$notify({
                            title: 'Success',
                            message: 'Update Successfully',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList()
                        this.buttonStatus = false
                    },error => {
                        this.dialogFormVisible = false
                        this.buttonStatus = true
                    })
                }
            })
        },
        handleDelete(row, index) {
            // 确认删除
            this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.form = Object.assign({}, row)
                deleteMenu(this.form).then((res) => {
                    this.$notify({
                        title: 'Success',
                        message: 'Delete Successfully',
                        type: 'success',
                        duration: 2000
                    })
                    // this.list.splice(index, 1)
                    this.getList()
                },error => {
                    console.log('删除失败')
                })
            })
        },
        handleDownload() {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
                const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
                const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
                const data = this.formatJson(filterVal)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: 'table-list'
                })
                this.downloadLoading = false
            })
        },
        formatJson(filterVal) {
            return this.list.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
        getSortClass: function(key) {
            // 排序
            const sort = this.listQuery.sort
            return sort === `+${key}` ? 'ascending' : 'descending'
        }
    }
}
</script>
