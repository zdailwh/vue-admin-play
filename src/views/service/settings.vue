<template>
  <div class="dashboard-container">
    <div>
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="Jobs" :name="'/service/index/' + type" />
        <el-tab-pane label="Status" name="/service/status" />
        <el-tab-pane label="Settings" name="/service/settings" />
      </el-tabs>
    </div>
    <div>
      <el-table
        :data="networks"
        style="width: 100%"
      >
        <el-table-column prop="name" label="网卡" width="180" />
        <el-table-column prop="ip" label="IP" width="180" />
        <el-table-column prop="netmask" label="netmask" width="180" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="toEdit(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="编辑网卡" :visible.sync="showEdit" width="400px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="IP">
          <el-input v-model="editForm.ip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="netmask">
          <el-input v-model="editForm.netmask" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="doEdit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      activeTab: '/service/settings',
      showEdit: false,
      editForm: {}
    }
  },
  computed: {
    ...mapState({
      networks: state => state.service.networks,
      type: state => state.service.type
    })
  },
  watch: {
    activeTab(val) {
      this.$router.push({ path: val })
    }
  },
  mounted() {
    this.getNetworkList()
  },
  methods: {
    getNetworkList() {
      this.$store.dispatch('service/getNetworks').then(() => {
      }).catch(() => {
      })
    },
    toEdit(item) {
      this.editForm = item
      this.showEdit = true
    },
    doEdit() {
      var params = {
        name: this.editForm.name,
        ip: this.editForm.ip,
        netmask: this.editForm.netmask
      }
      console.log(params)
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/updateNetwork', params).then(() => {
        this.$message({
          message: '网卡编辑成功！',
          type: 'success'
        })
        this.loading = false
        this.showEdit = false
      }).catch((e) => {
        this.$message({
          message: e.response.data || '网卡编辑失败！',
          type: 'error'
        })
        this.loading = false
        this.showEdit = false
      })
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 0 20px;
}
</style>

