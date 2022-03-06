<template>
    <el-form>
        <el-form-item label="Name">
            <el-input v-model.trim="user.name"/>
        </el-form-item>
        <el-form-item label="Email">
            <el-input v-model.trim="user.email"/>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit">Update</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateAdmin } from '@/api/admin'
import { getInfo } from '@/api/user'

export default {
    props: {
        user: {
            type: Object,
            default: () => {
                return {
                    name: '',
                    email: ''
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'token'
        ])
    },
    methods: {
        async userInfo() {
            return await getInfo(this.token)
        },
        submit() {
            this.userInfo().then(res => {
                let data = res.data
                data = Object.assign({}, { name: this.user.name, email: this.user.email }, { id: data.id,status:data.status })

                updateAdmin(data).then((res) => {
                        if (res.code == 200) {
                            this.$message({
                                message: 'User information has been updated successfully',
                                type: 'success',
                                duration: 2 * 1000
                            })
                        }
                }).catch((response) => {
                    console.log(response.error)
                })
            })
        }
    }
}
</script>
