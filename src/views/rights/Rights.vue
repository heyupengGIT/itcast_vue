<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="data"
      border
      stripe
      style="width: 100%; margin-top: 10px">
      <el-table-column
        label="#"
        type="index"
        width="80">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        label="层级">
         <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else-if="scope.row.level === '2'">三级</span>
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
    }
  },
  created() {
    // 组件创建完毕，发送请求获取数据
    this.loadData();
  },
  methods: {
    async loadData() {
      const response = await this.$http.get('rights/list')

      // 请求结束
      this.loading = false

      const { meta: { status, msg } } = response.data;
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

</style>