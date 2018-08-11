<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col :span="24">
        <el-input
          v-model="searchValue"
          clearable
          placeholder="请输入内容"
          class="searchInput">
          <el-button
            @click="handleSearch"
            slot="append"
            icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="addUsertianjia" type="success" plain>添加</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
     <el-table
     v-loading="loading"
      border
      stripe
      :data="data"
      style="width: 100%">
      <!-- 序号 -->
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        
        label="时间"
        width="180">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        
        label="用户状态"
        width="80">
        <template slot-scope="scope">
          <!-- {{ scope.row.mg_state }} -->
          <el-switch
            @change="handleChange(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <!-- scope.row 是当前行绑定的数据对象 -->
          <!-- {{ scope.$index }} -->
          <el-button
            @click="openEditDialog(scope.row)"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain>
          </el-button>
          <el-button
            @click="handleDelete(scope.row.id)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain>
          </el-button>
          <el-button
            @click="handleOpenSetRoleDialog(scope.row)"
            type="success"
            icon="el-icon-check"
            size="mini"
            plain>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 看elementui文档 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      :page-sizes="[2, 4, 6, 8]"
      :pager-count="9"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count">
    </el-pagination>
     <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogFormVisible">
      <el-form
        ref="addForm"
        :rules="rules"
        label-width="80px"
        :model="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
     <!-- 编辑用户的对话框 -->
    <el-dialog
      @close="handleEditDialogClose"
      title="修改用户"
      :visible.sync="editUserDialogFormVisible">
      <el-form
        ref="editForm"
        label-width="80px"
        :model="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" readonly auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>

     <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogFormVisible">
      <el-form
        label-width="100px">
        <el-form-item label="用户名">
          {{ currentName }}
        </el-form-item>
        <el-form-item label="请选择角色">
          <el-select v-model="currentRoleId">
            <el-option label="请选择" :value="-1" disabled></el-option>
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleDialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

export default {
  data() {
    return {
      // 用户列表
      data: [],
      // 页码
      pagenum: 1,
      // 每页显示多少条
      pagesize: 2,
      // 总条数
      count: 0,
      // 绑定搜索文本框
      searchValue: '',
      // 控制添加用户的对话框的显示隐藏
      addUserDialogFormVisible: false,
      // 表单数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 加载动画
      loading: true,
       // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ],
        
      },
      // 控制编辑用户的对话框的显示隐藏
      editUserDialogFormVisible: false,
       // 控制分配角色的对话框的显示隐藏
      setRoleDialogFormVisible: false,
      // 分配角色需要的数据
      currentName: '',
      // 绑定下拉框
      currentRoleId: -1,
      currentUserId: -1,
      // 角色列表
      roles: []
    }
  },
  
  
  created() {
    this.loadData();
  },
  
  methods: {
    async loadData () {
      // 发送请求额时候，要在请求头中添加Authorization=token
      var token = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = token

      var response = await this.$http.get(`users?pagenum=${ this.pagenum }&pagesize=${ this.pagesize }&query=${ this.searchValue }`)

      // 结束加载动画
      this.loading = false

      var { meta: { status, msg } } = response.data
      if (status === 200) {
        // 获取总共多少条数据
        this.count = response.data.data.total
        this.data = response.data.data.users
      }else{
        this.$message.error(msg)
      }
    },
    
    // 显示个数发生改变时触发
    handleSizeChange(val) {
      this.pagesize = val
      this.loadData()
    },
    // 页码改变时触发
    handleCurrentChange(val) {
      this.pagenum = val
      this.loadData()
    },
    // 搜索
    handleSearch() {
      this.loadData()
    },

    // 点击添加按钮上来先清空表单
    addUsertianjia() {
      this.addUserDialogFormVisible = true
      // 清空表单数据
      for(var key in this.form) {
        this.form[key] = ''
      }
    },

    // 添加用户数据
    async handleAdd () {
      // 表单验证
      this.$refs.addForm.validate(async (valid) => {
          if (valid) {
            const response =await this.$http.post('users',this.form)
            const { data: { meta: { status, msg } } } = response
            if (status === 201) {
              // 添加成功提示
              // 提示
              this.$message.success(msg)
              // 关闭对话框
              this.addUserDialogFormVisible = false
              // 重心加载数据
              this.loadData()
              // 还原表单的默认值 
              // 清空表单数据
              // for(var key in this.form) {
              //   this.form[key] = ''
              // }
            }else{
              this.$message.error(msg)
            }
          }else{
          this.$message.warning('表单验证失败')
          }
      })
    },

    // addUserquxiao() {
    //     this.addUserDialogFormVisible = false

    //     // 清空表单数据
    //         for(var key in this.form) {
    //           this.form[key] = ''
    //         }
    // },

    // 点击编辑按钮
    openEditDialog(user) {
      // 显示对话框
      this.editUserDialogFormVisible = true
      this.form.username = user.username
      this.form.mobile = user.mobile
      this.form.email = user.email
      this.form.id = user.id
    },

    // 点击编辑窗口的确定按钮
    async handleEdit() {
      const response = await this.$http.put(`users/${ this.form.id }`, {
        email: this.form.email,
        mobile: this.form.mobile
      })

      // 判断是否成功
      const { meta: { status, msg } } = response.data
      if (status === 200) {
        // 修改成功
        // 提示
        this.$message.success(msg)
        // 关闭窗口
        this.editUserDialogFormVisible = false
        // 重置菜单
        // this.$refs.editForm.resetFields()
        // 重心加载数据
        this.loadData()
        // 清空表单数据
        for(var key in this.form) {
          this.form[key] = ''
        }
      }else{
        this.$message.error(msg)
      }
    },

    handleEditDialogClose() {
      // 清空表单数据
      for(var key in this.form) {
        this.form[key] = ''
      }
    },
    // 删除提示
    async handleDelete(id) {
       // 删除提示
      this.$confirm('是否删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 点击确定按钮执行
          const response = await this.$http.delete(`users/${id}`)

          // 判断删除是否成功
          const { meta: { status, msg } } = response.data;
          if (status === 200) {
            // 判断当前页是否只有一条数据，并且当前不是第一页
            if (this.data.length === 1 && this.pagenum !== 1) {
              // 如果当前页只有一条数据，删除之后，要让pagenum--
              this.pagenum--
              // 重新加载数据
              this.loadData()
            }
            // 重新加载列表
            this.loadData()
            // 提示
            this.$message.success(msg)
            
          } else {
            this.$message.error(msg)
          }
        }).catch(() => {
          // 点击取消按钮执行
          this.$message({
            type: 'info',
            message: '已取消删除'
          })          
        })
    },
    // 当用户状态改变的时候，修改用户的状态
    async handleChange(user) {
      const response = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)

      const { meta: { status, msg } } = response.data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },

     // 点击按钮显示分配角色的对话框
    async handleOpenSetRoleDialog(user) {
      this.setRoleDialogFormVisible = true
      // 获取用户名和用户id
      this.currentName = user.username
      this.currentUserId = user.id

      // 显示角色列表（下拉框）
      const response = await this.$http.get('roles')
      this.roles = response.data.data

      
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.searchInput {
  width: 300px;
}
.searchRow {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>

