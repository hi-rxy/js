<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <!--  搜索开始  -->
                    <div class="filter-container" style="margin-bottom: 15px;">
                        <el-input v-model="listQuery.Name" placeholder="表名称" style="width: 200px;"
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
                                   @click="handleBackup"
                        >
                            备份
                        </el-button>
                    </div>
                    <!--  搜索结束  -->

                    <!--  表格开始  -->
                    <el-table
                        :key="0"
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
                        @selection-change="handleSelectionChange"
                    >
                        <!--  字段开始    -->
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="表名" prop="Name"  align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.Name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="存储引擎" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.Engine }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="行格式" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.Row_format }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="表中的行数" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.Rows }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="整个表的数据量" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.Data_length }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="下一个自增的值" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.Auto_increment }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="注释" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.Comment }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="字符集" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.Collation }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="创建时间" align="center" sortable="custom" prop="Create_time" :class-name="getSortClass('Create_time')">
                            <template slot-scope="{row}">
                                <span>{{ row.Create_time }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="修改时间" align="center" sortable="custom" prop="Update_time" :class-name="getSortClass('Update_time')">
                            <template slot-scope="{row}">
                                <span>{{ row.Update_time }}</span>
                            </template>
                        </el-table-column>
                        <!--  字段结束   -->
                        <!--  操作开始   -->
                        <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width">
                            <template slot-scope="{row,$index}">
                                <el-button round type="primary" size="mini" @click="handleOptimize(row)">
                                    优化
                                </el-button>
                                <el-button round size="mini" type="danger" @click="handleRepair(row,$index)">
                                    修复
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
    </div>
</template>

<script>
import { fetchList,optimizeTable,repairTable } from '@/api/table'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

export default {
    name: 'Table',
    components: { Pagination },
    directives: { waves },
    data() {
        return {
            total: 0,
            // 查询
            listQuery: {
                page: 1,
                limit: 10,
                sort: '-Create_time'
            },
            // 分页数据
            list: null,
            // 分页数据加载状态
            listLoading: true
        }
    },
    watch: {},
    created() {
        this.getList()
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
        resetFilter() {
            // 重置查询
            this.listQuery = {
                page: 1,
                limit: 10,
                sort: '-Create_time'
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
        getSortClass: function(key) {
            // 排序
            const sort = this.listQuery.sort
            return sort === `+${key}` ? 'ascending' : 'descending'
        },
        handleBackup () {

        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val;
        },
        handleOptimize (row) {
            // 优化
            this.$confirm('此操作将优化'+row.Name+'表, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                optimizeTable({ name:row.Name }).then((res) => {
                    this.$notify({
                        title: 'Success',
                        message: 'Delete Successfully',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
                },error => {
                    console.log('优化失败')
                })
            })
        },
        handleRepair (row) {
            // 修复
            this.$confirm('此操作将修复'+row.Name+'表, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                repairTable({ name:row.Name }).then((res) => {
                    this.$notify({
                        title: 'Success',
                        message: 'Delete Successfully',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
                },error => {
                    console.log('修复失败')
                })
            })
        },
    }
}
</script>
