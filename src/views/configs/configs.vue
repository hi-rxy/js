<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <template>
                        <el-tabs class="config-group-fields" v-model="activeName" @tab-click="handlePaneTabClick">
                            <el-tab-pane v-for="item in configGroupList" :key="item.id" :label="item.title"
                                         :name="item.name"
                            >
                                <el-col :span="24">
                                    <el-card class="box-card">
                                        <el-form ref="dataForm" :model="form"
                                                 label-position="right" label-width="220px"
                                                 style="width: 1000px; "
                                        >
                                            <el-form-item v-for="(item,index) in configGroupFields"
                                                          :label="item.title" :prop="item.name" :key="item.id"
                                                          style="margin-bottom:10px;"
                                            >
                                                <el-input
                                                    v-if="item.type === 'textarea'"
                                                    type="textarea"
                                                    :rows="2"
                                                    placeholder="请输入内容"
                                                    v-model="item.value">
                                                </el-input>

                                                <el-switch
                                                    v-model="item.value"
                                                    v-else-if="item.type === 'radio'"
                                                    active-color="#13ce66"
                                                    inactive-color="#ff4949">
                                                </el-switch>

                                                <el-input v-else v-model="item.value"/>
                                                <span style="font-size: 8px;color: #97a8be;margin-left:15px;" v-if="item.message !== ''">{{item.message}}</span>
                                            </el-form-item>
                                            <el-form-item>
                                                <el-button type="primary" :disabled="buttonStatus" @click="updateConfigData(item.id)">
                                                    保存
                                                </el-button>
                                            </el-form-item>
                                        </el-form>
                                    </el-card>
                                </el-col>
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<style>
.config-group-fields .el-input--medium {
    width:350px !important;
}
.config-group-fields .el-input {
    width:350px !important;
}
</style>
<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'// secondary package based on el-pagination
import {
    fetchConfigGroupList,
    fetchConfigGroupFields,
    updateConfigFields
} from '@/api/config'

export default {
    name: 'Configs',
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
            // 配置组集合
            configGroupList: null,
            // 当前选中的配置组字段集合数据
            configGroupFields: null,
            // 当前选中的配置组表单字段
            form: null,
            // 当前活动的标签页
            activeName: '',
            // 表单操作类型
            dialogStatus: '',
            // 默认表单弹窗-隐藏
            dialogFormVisible: false,
            // 表单提交按钮状态
            buttonStatus: false,
            // 状态值
            statusOptions: ['enable', 'disable'],
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
                let configGroupData = Object.assign({}, this.configGroupList[0])
                this.activeName = configGroupData.name
                this.getConfigGroupData()
            }, error => {
                console.log('查询失败')
            })
        },
        getConfigGroupData() {
            // 配置组字段列表
            let loadingInstance = this.$loading({
                'text': '加载中',
                'target': document.querySelector('.config-group-fields'),
                'fullscreen': false,
                'spinner': 'el-icon-loading',
                'background': 'rgba(245, 247, 250, 1)'
            })
            fetchConfigGroupFields({ name: this.activeName }).then((res) => {
                this.form = res.data.form
                this.configGroupFields = res.data.fields
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close()
                })
            }, error => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close()
                })
                console.log('查询配置组字段失败')
            })
        },
        handlePaneTabClick(obj, action) {
            // 标签页点击事件
            this.activeName = obj.name
            this.getConfigGroupData()
        },
        resetTemp() {
            // 重置左侧表单
            this.form = {}
        },
        updateConfigData(id) {
            // 修改配置组
            this.buttonStatus = true
            updateConfigFields(Object.assign({}, this.configGroupFields)).then((res) => {
                this.$notify({
                    title: 'Success',
                    message: 'Created Successfully',
                    type: 'success',
                    duration: 2000
                })
                this.getConfigGroupData()
                this.buttonStatus = false
            }, error => {
                this.buttonStatus = false
            })
        }
    }
}
</script>
