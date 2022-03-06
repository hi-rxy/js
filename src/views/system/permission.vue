<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="4">
                <el-card class="box-card">
                    <el-input
                        v-model="filterText"
                        placeholder="输入关键字进行过滤"
                    >
                    </el-input>

                    <el-tree
                        class="filter-tree"
                        v-loading="treeListLoading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(245, 247, 250, 1)"
                        :data="trees"
                        :props="{
              label: 'menu_name',
              children: 'children'
            }"
                        node-key="id"
                        highlight-current
                        accordion
                        :filter-node-method="filterNode"
                        @node-click="clickTreeNode"
                        ref="tree"
                    >
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="20">
                <el-card class="box-card">
                    <!--  搜索开始  -->
                    <div class="filter-container" style="margin-bottom: 15px;">
                        <el-input v-model="listQuery.name" placeholder="权限名称" style="width: 200px;"
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
                        :key="tableKey"
                        v-loading="listLoading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(245, 247, 250, 1)"
                        :data="list"
                        border
                        fit
                        highlight-current-row
                        style="width: 100%;"
                        max-height="600"
                        @sort-change="sortChange"
                    >
                        <!--  字段开始    -->
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="路径" prop="name"  align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="描述" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.description }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="创建时间" align="center" sortable="custom" prop="created_at" :class-name="getSortClass('created_at')">
                            <template slot-scope="{row}">
                                <span>{{ row.created_at }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="修改时间" align="center" sortable="custom" prop="updated_at" :class-name="getSortClass('updated_at')">
                            <template slot-scope="{row}">
                                <span>{{ row.updated_at }}</span>
                            </template>
                        </el-table-column>
                        <!--  字段结束   -->
                        <!--  操作开始   -->
                        <el-table-column label="操作" align="center" width="260px" class-name="small-padding fixed-width">
                            <template slot-scope="{row,$index}">
                                <el-button type="primary" size="mini" @click="handleUpdate(row)">
                                    编辑
                                </el-button>
                                <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                        <!--  操作结束   -->
                    </el-table>
                    <!--  表格结束  -->

                    <!--  分页开始  -->
                    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page"
                                :limit.sync="listQuery.limit" @pagination="getList"
                    />
                    <!--  分页结束  -->
                </el-card>
            </el-col>
        </el-row>
        <!-- form 表单 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="80px"
                     style="width: 400px; margin-left:50px;"
            >
                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="form.name"/>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入描述"
                        v-model="form.description">
                    </el-input>
                </el-form-item>
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
import { fetchList,createAuthority, updateAuthority, deleteAuthority } from '@/api/authority'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { fetchTreeList } from '@/api/menu' // secondary package based on el-pagination

export default {
    name: 'Permission',
    components: { Pagination },
    directives: { waves },
    data() {
        return {
            tableKey: 0,
            total: 0,
            // 查询
            listQuery: {
                page: 1,
                limit: 10,
                sort: '-created_at'
            },
            // 表单
            form: {
                name: '',
                description: '',
            },
            // 表单按钮
            textMap: {
                update: '编辑',
                create: '添加'
            },
            // 分页数据
            list: null,
            // 左侧树数据
            trees: null,
            // 表单操作类型
            dialogStatus: '',
            // 左侧菜单关键字筛选
            filterText: '',
            // 分页数据加载状态
            listLoading: true,
            // 左侧树加载状态
            treeListLoading: true,
            // 默认表单弹窗-隐藏
            dialogFormVisible: false,
            // 下载状态
            downloadLoading: false,
            // 表单提交按钮状态
            buttonStatus:false,
            // 表单验证规则
            rules: {
                name: [{ required: true, message: '权限名称 is required', trigger: 'blur' }],
                description: [{ required: true, message: '描述 is required', trigger: 'blur' }]
            },
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val)
        }
    },
    created() {
        this.getList()
        this.getTreeList()
    },
    methods: {
        getList() {
            // 权限列表
            this.listLoading = true
            fetchList(this.listQuery).then(response => {
                this.list = response.data.items
                this.total = response.data.total
                this.listLoading = false
            },error => {
                this.listLoading = false
            })
        },
        getTreeList() {
            // 菜单树形列表
            this.treeListLoading = true
            fetchTreeList().then(response => {
                this.trees = response.data
                this.treeListLoading = false
            },error => {
                this.treeListLoading = false
            })
        },
        resetFilter() {
            // 重置查询
            this.listQuery = {
                page: 1,
                limit: 10,
                sort: '-created_at'
            }
            this.getList()
        },
        handleFilter() {
            // 点击查询
            this.listQuery.page = 1
            this.getList()
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
        clickTreeNode(e) {
            console.log(e)
            if (e.pid != '0') {
                // 点击左侧菜单查询
                this.listQuery.id = e.id
                this.getList()
            }
        },
        filterNode(value, data) {
            if (!value) return true
            return data.text.indexOf(value) !== -1
        },
        resetTemp() {
            // 重置表单
            this.form = {
                name: '',
                description: '',
            }
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
            // 添加权限
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.buttonStatus = true
                    this.form.newName = this.form.name
                    createAuthority(this.form).then((res) => {
                        //this.list.unshift(this.form)
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
            // 唤醒修改权限
            this.form = Object.assign({}, row) // copy obj
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.buttonStatus = false
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        updateData() {
            // 修改权限
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.buttonStatus = true
                    this.form.newName = this.form.name
                    const tempData = Object.assign({}, this.form)
                    updateAuthority(tempData).then((res) => {
                        // const index = this.list.findIndex(v => v.name === this.form.name)
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
            this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.form = Object.assign({}, row)
                deleteAuthority(this.form).then((res) => {
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
