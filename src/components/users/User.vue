<template>
  <div class="page">
    <!-- 面包屑状态行区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索用于区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserInfo"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserInfo"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="isDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格显示区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>

        <!-- 切换用户状态 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeUserState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
                      effect="dark"
                      content="分配角色"
                      placement="top"
                      :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="isDialogVisible"
      width="50%"
      @close="addDialogClose">
      <!-- 输入数据区域 -->
      <el-form :model="addForm" 
               :rules="addFormRules" 
               ref="addFormRef" 
               label-width="70px"
               status-icon >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" 
               :visible.sync="editDialogVisible" 
               width="50%" 
               @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" 
               :visible.sync="setRoleDialogVisible" 
               width="50%" 
               @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer"> 
        <el-button @click="setRoleDialogVisible = false">取消</el-button>
        <el-button @click="saveRoleInfo" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  components: {},
  data() {

    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      isDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        email: [
          { required: true, message: '请输入邮箱账户', trigger: 'blur'},
          { validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur'},
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱账户', trigger: 'blur'},
          { validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur'},
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      setRoleDialogVisible: false,
      userInfo: {},
      // 说有角色的数据列表
      roleList: [],
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据失败')
      }
      this.total = res.data.total
      this.userList = res.data.users
    },
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getUserInfo()
    },
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getUserInfo()
    },
    // 切换用户状态
    async changeUserState(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('改变用户状态失败')
      }
      console.log(res)
      this.$message.success('切换用户状态成功')
    },
    // 重置添加用户对话框
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击添加用户按钮
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res);
        
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 隐藏对话框
        this.isDialogVisible = false
        // 重新请求数据
        this.getUserInfo()
      })
    },
    // 点击编辑按钮显示编辑对话框
    async showEditDialog(userId) {
      const { data: res } = await this.$http.get('users/' + userId)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 点击编辑对话框确定按钮
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res} = await this.$http.put(
          'users/' + this.editForm.id,
          {
            eamil: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据
        this.getUserInfo()
        // 提示修改成功
        this.$message.success('更新用户信息成功')
      })
    },
    // 点击编辑对话框取消按钮
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击移除用户按钮
    async removeUserById(id) {
      // console.log(id);
      
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.$message.success('删除用户成功！')
      this.queryInfo.pagenum = 1
      this.getUserInfo()
    },
    // 点击分配角色按钮
    async setRole(userInfo) {
      this.userInfo = userInfo

      // 获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {rid: this.selectedRoleId}
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }
      this.$message.success('更新角色成功')
      this.getUserInfo()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed() {
      this.selectedRoleId = '',
      this.userInfo = {}
    }
  }
}
</script>

<style scoped>
.el-dialog p {
  margin: 8px;
}
</style>
