<template>
  <div class="dashboard-container">
    <div>
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="Jobs" :name="'/service/index/' + type" />
        <el-tab-pane label="Status" name="/service/status" />
        <el-tab-pane label="Settings" name="/service/settings" />
      </el-tabs>
    </div>
    <div v-show="status.cpu && status.cpu.used && status.mem && status.mem.used">
      <el-row :gutter="20">
        <el-col :span="8" style="margin-bottom:15px;">
          <el-card :body-style="{ padding: '0px', paddingTop: '15px', textAlign: 'center' }">
            <p style="width: 126px;height: 126px;line-height: 126px;margin: 0 auto;">{{ status.uptime }}</p>
            <p class="percentName">运行时间</p>
          </el-card>
        </el-col>
        <el-col :span="8" style="margin-bottom:15px;">
          <el-card :body-style="{ padding: '0px', paddingTop: '15px', textAlign: 'center' }">
            <el-progress type="circle" :percentage="status.cpu.used" :color="status.cpu.used | getColor" />
            <p class="percentName">CPU使用率</p>
          </el-card>
        </el-col>
        <el-col :span="8" style="margin-bottom:15px;">
          <el-card :body-style="{ padding: '0px', paddingTop: '15px', textAlign: 'center' }">
            <el-progress type="circle" :percentage="parseInt(status.mem.used / status.mem.total * 100)" :color="(status.mem.used / status.mem.total * 100) | getColor" />
            <p class="percentName">内存使用率</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    window.clearInterval(window.timer)
    next()
  },
  filters: {
    getColor(percentage) {
      if (percentage >= 80) {
        return '#f56c6c'
      }
      if (percentage >= 60) {
        return '#e6a23c'
      }
      if (percentage >= 40) {
        return '#5cb87a'
      }
      if (percentage >= 20) {
        return '#1989fa'
      } else {
        return '#6f7ad3'
      }
    }
  },
  data() {
    return {
      loading: false,
      activeTab: '/service/status'
      // 运行时间，CPU使用率，内存 （总数、已用）大小
      // status: {
      //   uptime: '3 days, 23:42',
      //   cpu: {
      //     used: 25,
      //     unit: '%'
      //   },
      //   mem: {
      //     total: 32618664,
      //     used: 20867212,
      //     unit: 'KB'
      //   }
      // }
    }
  },
  computed: {
    ...mapState({
      status: state => state.service.status,
      type: state => state.service.type
    })
  },
  watch: {
    activeTab(val) {
      this.$router.push({ path: val })
    }
  },
  mounted() {
    this.getStatus()
    var self = this
    window.timer = window.setInterval(function() {
      self.getStatus()
    }, 1000)
  },
  methods: {
    getStatus() {
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/getStatus').then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 0 20px;
}
.percentName {
}
</style>
