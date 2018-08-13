export default {
  data() {
    return {
      // 用户列表
      data: [],
      // 分页相关数据
      // 页码
      pagenum: 1,
      // 每页显示多少条数据
      pagesize: 4,
      // 总共多少条数据
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
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ]
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
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 1 发送请求，获取用户列表
    async loadData() {
      // 发送请求的时候，要在请求头中添加Authorization=token
      // var token = sessionStorage.getItem('token');
      // this.$http.defaults.headers.common['Authorization'] = token;

      var response = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`);

      // Vue.prototype.$http = axios; 在main.js中
      // this.$http.get()

      // response => { data: { data: { users: [] }, meta: { status: [] } }}
      var { meta: { status, msg } } = response.data;
      if (status === 200) {
        // 获取总共多少条数据
        this.count = response.data.data.total;
        this.data = response.data.data.users;
      } else {
        this.$message.error(msg);
      }
    },
    // 分页的方法
    handleSizeChange(val) {
      // 每页条数发生变化
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // 页码发生变化
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    // 搜索的方法
    handleSearch() {
      // this.searchValue
      this.loadData();
    },
    // handleAdd 添加用户
    async handleAdd() {
      // 表单验证
      this.$refs.addForm.validate(async (valid) => {
        // valid 是否验证成功
        if (valid) {
          const response = await this.$http.post('users', this.form);
          // 判断添加是否成功
          const { data: { meta: { status, msg } } } = response;
          if (status === 201) {
            // 添加成功
            // 提示
            this.$message.success(msg);
            // 关闭对话框
            this.addUserDialogFormVisible = false;
            // 重新加载数据
            this.loadData();
            // 还原表达的默认值
            this.$refs.addForm.resetFields();
          } else {
            // 添加失败
            this.$message.error(msg);
          }
        } else {
          this.$message.warning('表单验证失败');
        }
      });
    },
    // 点击编辑按钮
    openEditDialog(user) {
      // 显示对话框
      this.editUserDialogFormVisible = true;
      // console.log(user);
      this.form.username = user.username;
      this.form.mobile = user.mobile;
      this.form.email = user.email;
      // 存储用户的id
      this.form.id = user.id;
    },
    // 点击编辑窗口的确定按钮，修改数据
    async handleEdit() {
      const response = await this.$http.put(`users/${this.form.id}`, {
        email: this.form.email,
        mobile: this.form.mobile
      });

      // 判断是否成功
      // response -> { data: { data: {} , meta: { status: 200, msg: '' } } }
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        // 修改成功
        // 提示
        this.$message.success(msg);
        // 关闭窗口
        this.editUserDialogFormVisible = false;
        // 重置表单
        // this.$refs.editForm.resetFields();
        // 重新加载数据
        this.loadData();
        // 清空表单
        // this.form = {};

        for (var key in this.form) {
          this.form[key] = '';
        }
      } else {
        // 修改失败
        this.$message.error(msg);
      }
    },
    // 关闭编辑对话框的时候执行
    handleEditDialogClose() {
      console.log('123');
      // this.editUserDialogFormVisible = false;
      // 清空表单数据
      for (var key in this.form) {
        this.form[key] = '';
      }
    },
    // 点击删除按钮
    async handleDelete(id) {
      // 删除提示
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击确定按钮执行
        const response = await this.$http.delete(`users/${id}`);

        // 判断删除是否成功
        const { meta: { status, msg } } = response.data;
        if (status === 200) {
          // 判断当前页是否只有一条数据，并且当前不是第一页
          if (this.data.length === 1 && this.pagenum !== 1) {
            // 如果当前页只有一条数据，删除之后，要让pagenum--
            this.pagenum--;
          }
          // 重新加载数据
          this.loadData();
          // 提示
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      }).catch(() => {
        // 点击取消按钮执行
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 当用户状态改变的时候，修改用户的状态
    async handleChange(user) {
      const response = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);

      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 点击按钮显示分配角色的对话框
    async handleOpenSetRoleDialog(user) {
      this.setRoleDialogFormVisible = true;
      // 获取用户名和用户id
      this.currentName = user.username;
      this.currentUserId = user.id;

      // 显示角色列表（下拉框）
      const response = await this.$http.get('roles');
      this.roles = response.data.data;

      // 角色id怎么办？？
      const userResponse = await this.$http.get(`users/${user.id}`);
      this.currentRoleId = userResponse.data.data.rid;
      // console.log(userResponse);
    },
    // 实现分配角色
    async handleSetRole() {
      const response = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId
      });

      // 判断成功还是失败
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
        this.setRoleDialogFormVisible = false;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
