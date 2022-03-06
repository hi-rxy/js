<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <template>
                        <el-tabs class="config-group" editable v-model="activeName" @tab-click="handlePaneTabClick"
                                 @edit="handlePaneTabsEdit"
                        >
                            <el-tab-pane v-for="item in configGroupList" :key="item.id" :label="item.title"
                                         :name="item.name"
                            >
                                <el-col :span="8">
                                    <el-card class="box-card">
                                        <el-form :model="configGroupData" label-position="right" label-width="90px">
                                            <el-form-item label="名称(英文)" prop="name">
                                                <el-input v-model="configGroupData.name"/>
                                            </el-form-item>
                                            <el-form-item label="名称(中文)" prop="title">
                                                <el-input v-model="configGroupData.title"/>
                                            </el-form-item>
                                            <el-form-item label="状态" prop="status">
                                                <el-select v-model="configGroupData.status" class="filter-item"
                                                           placeholder="Please select"
                                                >
                                                    <el-option v-for="value in statusOptions" :key="value"
                                                               :label="value" :value="value"
                                                    />
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="排序" prop="sort">
                                                <el-input v-model="configGroupData.sort"/>
                                            </el-form-item>
                                            <el-form-item>
                                                <el-button type="primary" :disabled="buttonStatus" @click="updateData">
                                                    保存
                                                </el-button>
                                            </el-form-item>
                                        </el-form>
                                    </el-card>
                                </el-col>
                                <el-col :span="16">
                                    <el-card class="box-card">
                                        <!--  搜索开始  -->
                                        <div class="filter-container" style="margin-bottom: 15px;">
                                            <el-input v-model="listQuery.keyword" placeholder="关键字" style="width: 200px;"
                                                      class="filter-item" @keyup.enter.native="handleFilter"
                                            />
                                            <el-button v-waves class="filter-item" style="margin-left: 10px;"
                                                       type="primary"
                                                       icon="el-icon-search" @click="handleFilter"
                                            >
                                                搜索
                                            </el-button>
                                            <el-button v-waves class="filter-item" style="margin-left: 10px;"
                                                       type="primary"
                                                       icon="el-icon-refresh" @click="resetFilter"
                                            >
                                                清除
                                            </el-button>
                                            <el-button class="filter-item" style="margin-left: 10px;" type="primary"
                                                       icon="el-icon-edit"
                                                       @click="handleConfigCreate"
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
                                            :data="configGroupFields"
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
                                                width="55">
                                            </el-table-column>
                                            <el-table-column show-overflow-tooltip label="英文名称" prop="name" align="center">
                                                <template slot-scope="{row}">
                                                    <span>{{ row.name }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column show-overflow-tooltip label="中文名称" align="center">
                                                <template slot-scope="{row}">
                                                    <span>{{ row.title }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="状态" align="center" class-name="status-col">
                                                <template slot-scope="{row}">
                                                    <el-tag :type="row.status | statusFilter">
                                                        {{ row.status }}
                                                    </el-tag>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="排序" align="center" sortable="custom" prop="sort"
                                                             :class-name="getSortClass('sort')"
                                            >
                                                <template slot-scope="{row}">
                                                    <span>{{ row.sort }}</span>
                                                </template>
                                            </el-table-column>
                                            <!--  字段结束   -->
                                            <!--  操作开始   -->
                                            <el-table-column label="操作" align="center" width="150px"
                                                             class-name="small-padding fixed-width"
                                            >
                                                <template slot-scope="{row,$index}">
                                                    <el-button type="primary" size="mini"
                                                               @click="handleConfigUpdate(row)"
                                                    >
                                                        编辑
                                                    </el-button>
                                                    <el-button size="mini" type="danger"
                                                               @click="handleConfigDelete(row,$index)"
                                                    >
                                                        删除
                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                            <!--  操作结束   -->
                                        </el-table>
                                        <!--  表格结束  -->

                                        <!--  分页开始  -->
                                        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page"
                                                    :limit.sync="listQuery.limit" @pagination="getFieldList"
                                        />
                                        <!--  分页结束  -->
                                    </el-card>
                                </el-col>
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                </el-card>
            </el-col>
        </el-row>

        <!-- form 表单 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="90px"
                     style="width: 400px; margin-left:50px;"
            >
                <el-form-item label="名称(英文)" prop="name">
                    <el-input v-model="form.name"/>
                </el-form-item>
                <el-form-item label="名称(中文)" prop="title">
                    <el-input v-model="form.title"/>
                </el-form-item>
                <el-form-item v-if="dialogStatus !== 'create'" label="字段说明" prop="message">
                    <el-input v-model="form.message"/>
                </el-form-item>
                <el-form-item v-if="dialogStatus !== 'create'" label="参数类型" prop="type">
                    <el-select v-model="form.type" class="filter-item" placeholder="Please select">
                        <el-option v-for="item in configTypeOptions" :key="item" :label="item" :value="item"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="dialogStatus !== 'create'" label="参数说明" prop="info">
                    <el-input v-model="form.info"/>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="form.status" class="filter-item" placeholder="Please select">
                        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="form.sort"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" :disabled="buttonStatus"
                           @click="dialogStatus==='create'?createData():(dialogStatus==='createConfig'?createConfigData():updateConfigData())"
                >
                    确认
                </el-button>
            </div>
        </el-dialog>
        <!-- form 表单 -->
    </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'// secondary package based on el-pagination
import {
    fetchConfigGroupList,
    fetchConfigGroupOne,
    createConfigGroup,
    updateConfigGroup,
    deleteConfigGroup,
    fetchConfigList,
    createConfig,
    updateConfig,
    deleteConfig
} from '@/api/config'

export default {
    name: 'ConfigGroup',
    components: { Pagination },
    directives: { waves },
    filters: {
        statusFilter(status) {
            const statusMap = {
                enable: 'success',
                disable: 'danger'
            }
            return statusMap[status]
        }
    },
    data() {
        return {
            tableKey: 0,
            // 分页数据总数
            total: 0,
            // 配置组 标签页集合
            configGroupList: null,
            // 配置组表单数据
            configGroupData: null,
            // 配置组字段集合数据
            configGroupFields: null,
            // 当前活动的标签页
            activeName: '',
            // 查询参数
            listQuery: {
                page: 1,
                limit: 10,
                sort: '-id'
            },
            // 表单字段
            form: {
                id: 0,
                group_id: 0,
                name: '',
                title: '',
                message: '',
                info: '',
                sort: 1,
                status: 'enable',
                type: 'text'
            },
            // 表单操作类型
            dialogStatus: '',
            // 分页数据加载状态
            listLoading: true,
            // 默认表单弹窗-隐藏
            dialogFormVisible: false,
            // 表单提交按钮状态
            buttonStatus: false,
            // 状态值
            statusOptions: ['enable', 'disable'],
            // 配置类型值
            configTypeOptions: ['text', 'radio', 'textarea', 'select', 'file'],
            // 表单按钮
            textMap: {
                create: '添加配置组',
                update: '编辑配置组',
                createConfig: '添加配置字段',
                updateConfig: '编辑配置字段'
            },
            // 表单验证规则
            rules: {
                name: [{ required: true, message: '名称(英文) is required', trigger: 'blur' }],
                title: [{ required: true, message: '名称(中文) is required', trigger: 'blur' }]
            }
        }
    },
    watch: {},
    created() {
        this.getList()
    },
    methods: {
        getList() {
            // 配置组列表
            fetchConfigGroupList(this.listQuery).then(response => {
                this.configGroupList = response.data.items
                this.configGroupData = Object.assign({}, this.configGroupList[0])
                this.activeName = this.configGroupData.name
                this.total = response.data.total
                this.getFieldList()
            }, error => {
                console.log('查询失败')
            })
        },
        getConfigGroupOne(name) {
            let loadingInstance = this.$loading({
                'text': '加载中',
                'target': document.querySelector('.config-group'),
                'fullscreen': false,
                'spinner': 'el-icon-loading',
                'background': 'rgba(245, 247, 250, 1)'
            })
            // 配置组详情
            fetchConfigGroupOne({ name: name }).then(response => {
                this.configGroupData = response.data
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close()
                })
            }, error => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close()
                })
                console.log('查询失败')
            })
        },
        getFieldList() {
            // 配置组字段列表
            fetchConfigList(Object.assign({},{ name: this.activeName },this.listQuery)).then((res) => {
                this.configGroupFields = res.data.items
                this.total = res.data.total
                this.listLoading = false
            }, error => {
                this.listLoading = false
                console.log('查询配置组字段失败')
            })
        },
        resetFilter() {
            // 重置查询
            this.listQuery = {
                page: 1,
                limit: 10,
                sort: '-id'
            }
            this.getFieldList()
        },
        handleFilter() {
            // 点击查询
            this.listQuery.page = 1
            this.getFieldList()
        },
        resetTemp() {
            // 重置左侧表单
            this.form = {
                id: 0,
                group_id: 0,
                type: 'text',
                name: '',
                title: '',
                message: '',
                info: '',
                sort: 1,
                status: 'enable'
            }
        },
        sortChange(data) {
            // 表格排序事件
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
        getSortClass: function(key) {
            // 设置排序字段
            const sort = this.listQuery.sort
            return sort === `+${key}` ? 'ascending' : 'descending'
        },
        handlePaneTabClick(obj, action) {
            // 标签页点击事件
            this.activeName = obj.name
            this.listLoading = true
            this.getFieldList()
            this.getConfigGroupOne(obj.name)
        },
        handlePaneTabsEdit(targetName, action) {
            // 标签页 按钮事件 添加与删除
            if (action === 'add') {
                this.handleCreate()
            }
            if (action === 'remove') {
                this.handleDelete(targetName)
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
            // 添加配置组
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.buttonStatus = true
                    createConfigGroup(Object.assign({}, this.form)).then((res) => {
                        this.dialogFormVisible = false
                        this.$notify({
                            title: 'Success',
                            message: 'Created Successfully',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList()
                        this.buttonStatus = false
                    }, error => {
                        this.dialogFormVisible = false
                        this.buttonStatus = true
                    })
                }
            })
        },
        updateData() {
            // 修改配置组
            this.buttonStatus = true
            updateConfigGroup(Object.assign({}, this.configGroupData)).then((res) => {
                this.dialogFormVisible = false
                this.$notify({
                    title: 'Success',
                    message: 'Update Successfully',
                    type: 'success',
                    duration: 2000
                })
                this.getList()
                this.buttonStatus = false
            }, error => {
                this.dialogFormVisible = false
                this.buttonStatus = true
            })
        },
        handleDelete(name) {
            // 确认删除
            this.$confirm('此操作将删除 "' + name + '" 配置组, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteConfigGroup(this.configGroupData).then((res) => {
                    this.$notify({
                        title: 'Success',
                        message: 'Delete Successfully',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
                }, error => {
                    console.log('删除失败')
                })
            })
        },
        handleConfigCreate() {
            // 唤醒添加弹窗
            this.resetTemp()
            this.dialogStatus = 'createConfig'
            this.dialogFormVisible = true
            this.buttonStatus = false
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        createConfigData() {
            // 添加配置组
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.buttonStatus = true
                    createConfig(Object.assign({}, this.form, { group_id: this.configGroupData.id })).then((res) => {
                        this.dialogFormVisible = false
                        this.$notify({
                            title: 'Success',
                            message: 'Created Successfully',
                            type: 'success',
                            duration: 2000
                        })
                        this.getFieldList()
                        this.buttonStatus = false
                    }, error => {
                        this.dialogFormVisible = false
                        this.buttonStatus = true
                    })
                }
            })
        },
        handleConfigUpdate(row) {
            // 唤醒修改
            this.form = Object.assign({}, row) // copy obj
            this.dialogStatus = 'updateConfig'
            this.dialogFormVisible = true
            this.buttonStatus = false
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        updateConfigData() {
            // 修改配置组
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.buttonStatus = true
                    updateConfig(Object.assign({}, this.form)).then((res) => {
                        this.dialogFormVisible = false
                        this.$notify({
                            title: 'Success',
                            message: 'Created Successfully',
                            type: 'success',
                            duration: 2000
                        })
                        this.getFieldList()
                        this.buttonStatus = false
                    }, error => {
                        this.dialogFormVisible = false
                        this.buttonStatus = true
                    })
                }
            })
        },
        handleConfigDelete(row, index) {
            // 确认删除
            this.$confirm('此操作将删除该字段“' + row.name + '”, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.form = Object.assign({}, row)
                deleteConfig(this.form).then((res) => {
                    this.$notify({
                        title: 'Success',
                        message: 'Delete Successfully',
                        type: 'success',
                        duration: 2000
                    })
                    this.getFieldList()
                }, error => {
                    console.log('删除失败')
                })
            })
        }
    }
}
</script>
