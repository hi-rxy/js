<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <!--  搜索开始  -->
                    <div class="filter-container" style="margin-bottom: 15px;">
                        <el-input v-model="listQuery.username" placeholder="管理员名称" style="width: 200px;"
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
                        max-height="750"
                        @sort-change="sortChange"
                    >
                        <!--  字段开始    -->
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80"
                                         :class-name="getSortClass('id')"
                        >
                            <template slot-scope="{row}">
                                <span>{{ row.id }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="账号" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.username }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="邮箱" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.email }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="头像" align="center">
                            <template slot-scope="{row}">
                                <img :src="row.face" width="40"/>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="角色" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.role }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center" class-name="status-col">
                            <template slot-scope="{row}">
                                <el-tag :type="row.status | statusFilter">
                                    {{ row.status }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="创建时间" align="center" sortable="custom" prop="created_at" :class-name="getSortClass('created_at')">
                            <template slot-scope="{row}">
                                <span>{{ row.created_at }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="登录时间" align="center" sortable="custom" prop="last_time" :class-name="getSortClass('last_time')">
                            <template slot-scope="{row}">
                                <span>{{ row.last_time }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="上次登录ip" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.last_ip }}</span>
                            </template>
                        </el-table-column>
                        <!--  字段结束   -->
                        <!--  操作开始   -->
                        <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
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
            <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="70px"
                     style="width: 400px; margin-left:50px;"
            >
                <el-form-item label="头像" prop="face">
                    <el-upload
                        v-if="isDefaultUpload"
                        class="avatar-uploader"
                        action="/common/upload?field=face&scope=avatar"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" style="display: block;" alt="">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div v-else>
                        <pan-thumb style="border-radius: 50%;" :image="imageUrl"/>
                        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">
                            上传
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item label="账号" prop="username">
                    <el-input v-model="form.username"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input ref="email" v-model="form.email"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="form.password"/>
                </el-form-item>
                <el-form-item label="确认密码" prop="rePassword">
                    <el-input type="password" ref="rePassword" v-model="form.rePassword"/>
                </el-form-item>
                <el-form-item v-if="!isSuper" label="角色" prop="role">
                    <el-select multiple v-model="form.role" class="filter-item" placeholder="Please select">
                        <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="form.status" class="filter-item" placeholder="Please select">
                        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
                    </el-select>
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

        <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :width="300"
            :height="300"
            url="/common/upload?field=face&scope=avatar"
            lang-type="en"
            @close="close"
            @crop-upload-success="cropSuccess"
        />
    </div>
</template>
<style>
.avatar {
    width: 100px;
    height: 100px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
</style>
<script>
import { fetchList, createAdmin, updateAdmin, deleteAdmin, adminState, roleList,fileUpload } from '@/api/admin'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { validEmail } from '@/utils/validate'

export default {
    name: 'Admin',
    components: { ImageCropper, Pagination, PanThumb },
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
        const defaultAvatar = 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'

        const validateEmail = (rule, value, callback) => {
            if (value && !validEmail(value)) {
                return callback(new Error('邮箱格式错误！！！'))
            } else {
                return callback()
            }
        };

        const validatePassword = (rule, value, callback) => {
            //console.log(typeof value)
            if ((typeof value != 'undefined') && value.length < 6) {
                return callback(new Error('密码不能小于6位！！！'))
            } else if (value && this.form.password && value !== this.form.password) {
                return callback(new Error('两次输入的密码不一致！！！'))
            } else {
                return callback()
            }
        };

        const validateRoles = (rule, value, callback) => {
            if (value.length <= 0) {
                return callback(new Error('角色 is required！！！'))
            } else {
                return callback()
            }
        };

        return {
            tableKey: 0,
            total: 0,
            imagecropperKey: 0,
            // 默认头像地址
            defaultAvatar:defaultAvatar,
            // 查询
            listQuery: {
                page: 1,
                limit: 10,
                sort: '-id'
            },
            // 表单
            form: {
                id: 0,
                username: '',
                email: '',
                face: '',
                role: [],
                status: 'enable',
                password:'',
                rePassword:''
            },
            // 状态值
            statusOptions: ['enable', 'disable'],
            // 表单按钮
            textMap: {
                update: '编辑',
                create: '添加'
            },
            // 图片地址
            imageUrl: '',
            // 分页数据
            list: null,
            // 角色列表
            roleOptions:null,
            // 表单操作类型
            dialogStatus: '',
            // 分页数据加载状态
            listLoading: true,
            // 默认表单弹窗-隐藏
            dialogFormVisible: false,
            // 上传组件状态
            isDefaultUpload:true,
            // 表单提交按钮状态
            buttonStatus:false,
            // 是否超管状态
            isSuper:false,
            // 裁剪状态
            imagecropperShow: false,
            // 下载状态
            downloadLoading: false,
            // 表单验证规则
            rules: {
                username: [{ required: true, message: '账号 is required', trigger: 'blur' }],
                role: [{ required: true, trigger: 'change',validator: validateRoles }],
                email: [{ required: true,trigger: 'blur' ,validator: validateEmail }],
                rePassword: [{ trigger: 'blur' ,validator: validatePassword }]
            }
        }
    },
    watch: {

    },
    created() {
        this.getList()
        this.getRoleList()
    },
    methods: {
        getList() {
            // 管理员列表
            this.listLoading = true
            fetchList(this.listQuery).then(response => {
                this.list = response.data.items
                this.total = response.data.total
                this.listLoading = false
            },error => {
                this.listLoading = false
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
        getRoleList() {
            // 获取角色列表
            roleList().then(response => {
                this.roleOptions = response.data
            },error => {
                console.log('获取角色集合失败')
            })
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
        handleAvatarSuccess(res, file) {
            //this.imageUrl = URL.createObjectURL(file.raw)
            if (res.code == 500) {
                this.$message.error(res.message);
            } else {
                this.imageUrl = res.data.src
                this.form.face = res.data.src
            }
        },
        beforeAvatarUpload(file) {
            console.log(file)
        },
        cropSuccess(resData) {
            // 上传头像
            this.imagecropperShow = false
            this.imagecropperKey = this.imagecropperKey + 1
            this.imageUrl = resData.src
            this.form.face = resData.src
        },
        close() {
            this.imagecropperShow = false
        },
        resetTemp() {
            // 重置表单
            this.form = {
                id: 0,
                username: '',
                email: '',
                face: '',
                role: [],
                status: 'enable',
                password:'',
                rePassword:''
            }
        },
        handleModifyStatus(row, status) {
            // 修改状态
            this.form = Object.assign({}, row, { status: status }) // copy obj
            adminState(this.form).then((res) => {
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
            this.imageUrl = this.defaultAvatar
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
            this.buttonStatus = false
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        createData() {
            // 添加管理员
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.buttonStatus = true
                    createAdmin(this.form).then((res) => {
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
            // 唤醒修改管理员
            this.form = Object.assign({}, row) // copy obj
            this.form.role = row.role.split(',')
            this.imageUrl = row.face || this.defaultAvatar
            this.isSuper = row.isSuper
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.buttonStatus = false
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        updateData() {
            // 修改管理员
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const tempData = Object.assign({}, this.form)
                    this.buttonStatus = true
                    updateAdmin(tempData).then((res) => {
                        // const index = this.list.findIndex(v => v.id === this.form.id)
                        // this.list.splice(index, 1, this.form)
                        this.dialogFormVisible = false
                        this.$notify({
                            title: 'Success',
                            message: 'Update Successfully',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList();
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
            this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.form = Object.assign({}, row)
                deleteAdmin(this.form).then((res) => {
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
