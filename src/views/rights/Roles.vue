
<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <!-- 添加按钮 -->
    <el-row class="add-row">
      <el-col :span="24">
        <el-button type="success" plain>添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      stripe
      border
      :data="data"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
           <!-- scope.row 当前行的角色对象，roleName, roleDesc, children -->
          <!-- 一级权限 -->
          <el-row
            class="level1"
            v-for="level1 in scope.row.children"
            :key="level1.id">
            <el-col :span="4">
              <!-- 显示一级权限的名称 -->
              <el-tag
                closable>
                {{ level1.authName }}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row
                v-for="level2 in level1.children"
                :key="level2.id">
                <el-col :span="4">
                  <!-- 显示二级权限的名称 -->
                  <el-tag
                    type="success"
                    closable>
                    {{ level2.authName }}
                  </el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                  <el-tag
                    class="level3"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    closable
                    type="warning">
                    {{ level3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">没有权限</el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="220">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="220">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain>
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain>
          </el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      loading: true
    };
  },
  created() {
    // 组件创建完毕，发送请求，获取数据
    this.loadData();
  },
  methods: {
    async loadData() {
      const response = await this.$http.get('roles')

      // 等请求结束，关闭loading
      this.loading = false

      const { meta: { status, msg } } = response.data
      if (status === 200) {
        this.data = response.data.data;
      } else {
        this.$message.error(msg);
      }
    }
  }
}
</script>

<style>
.card {
  height: 100%;
}
.add-row {
  margin-top: 10px;
  margin-bottom: 10px;
}

.level3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
.level1 {
  margin-bottom: 10px;
}
</style>