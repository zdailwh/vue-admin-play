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
        <el-table-column prop="name" label="网卡" width="150" />
        <el-table-column prop="ip" label="IP" width="150" />
        <el-table-column prop="netmask" label="netmask" width="150" />
        <el-table-column prop="gateway" label="网关" width="150" />
        <el-table-column prop="dns" label="DNS">
          <template slot-scope="scope">
            <p v-for="(item, k) in scope.row.dnsArr" :key="k">{{ item }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="on" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.on" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" :disabled="!scope.row.on" @click="toEdit(scope.row)">编辑</el-button>
            <el-button v-if="!scope.row.on" type="success" size="small" @click="enable(scope.row)">启用</el-button>
            <el-button v-if="scope.row.on" type="danger" size="small" @click="disable(scope.row)">禁用</el-button>
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
        <el-form-item label="网关">
          <el-input v-model="editForm.gateway" autocomplete="off" />
        </el-form-item>
        <el-form-item label="DNS">
          <!-- <el-input v-model="editForm.dns" autocomplete="off" /> -->
          <el-tag
            v-for="tag in dnsArr"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="delDns(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="taginputVisible"
            ref="saveTagInput"
            v-model="taginputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+添加</el-button>
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
import { Message } from 'element-ui'
export default {
  data() {
    return {
      loading: false,
      activeTab: '/service/settings',
      showEdit: false,
      editForm: {},
      dnsArr: [],
      taginputVisible: false,
      taginputValue: ''
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
      // var item = {
      //   name: 'enp3s0f0',
      //   ip: '192.168.5.101',
      //   netmask: '255.255.255.0',
      //   gateway: '',
      //   dns: '',
      //   on: 1
      // }
      this.editForm = item
      this.dnsArr = item.dns.length ? item.dns.split(',') : []
      this.showEdit = true
    },
    doEdit() {
      var params = {
        name: this.editForm.name,
        ip: this.editForm.ip,
        netmask: this.editForm.netmask,
        gateway: this.editForm.gateway,
        dns: this.dnsArr.join(',') || ''
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
    },
    disable(item) {
      if (this.loading) return
      var _this = this
      var params = {
        name: item.name
      }
      this.loading = true
      this.$store.dispatch('service/networkDisable', params).then((res) => {
        console.log(res)
        if (res) {
          Message({
            message: '已禁用',
            type: 'success',
            duration: 2 * 1000,
            onClose() {
              _this.loading = false
            }
          })
        } else {
          Message({
            message: '操作失败',
            type: 'error',
            duration: 2 * 1000,
            onClose() {
              _this.loading = false
            }
          })
        }
      }).catch(() => {
        this.loading = false
      })
    },
    enable(item) {
      if (this.loading) return
      var _this = this
      var params = {
        name: item.name
      }
      this.loading = true
      this.$store.dispatch('service/networkEnable', params).then((res) => {
        console.log(res)
        if (res) {
          Message({
            message: '已启用',
            type: 'success',
            duration: 2 * 1000,
            onClose() {
              _this.loading = false
            }
          })
        } else {
          Message({
            message: '操作失败',
            type: 'error',
            duration: 2 * 1000,
            onClose() {
              _this.loading = false
            }
          })
        }
      }).catch(() => {
        this.loading = false
      })
    },

    delDns(tag) {
      this.dnsArr.splice(this.dnsArr.indexOf(tag), 1)
    },

    showInput() {
      this.taginputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      var inputValue = this.taginputValue
      if (inputValue) {
        this.dnsArr.push(inputValue)
      }
      this.taginputVisible = false
      this.taginputValue = ''
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 0 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 140px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

