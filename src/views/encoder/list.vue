<template>
  <div class="dashboard-container">
    <el-table
      :data="tableData"
      style="width: 100%"
      size="small"
    >
      <el-table-column label="ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="IP">
        <template slot-scope="scope">
          {{ scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="'/encoder/item/' + scope.row.id + '/services'">
            <el-button type="text">查看service</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          id: 11,
          ip: '192.168.5.10'
        },
        {
          id: 12,
          ip: '192.168.5.11'
        },
        {
          id: 13,
          ip: '192.168.5.12'
        },
        {
          id: 14,
          ip: '192.168.5.13'
        },
        {
          id: 15,
          ip: '192.168.5.14'
        }
      ]
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
</style>
