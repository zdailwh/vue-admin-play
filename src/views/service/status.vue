<template>
  <div class="dashboard-container">
    <div>
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="Jobs" :name="'/service/index/' + type" />
        <el-tab-pane label="Status" name="/service/status" />
        <el-tab-pane label="Settings" name="/service/settings" />
      </el-tabs>
    </div>
    <div v-show="status.mem.used">
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
  },
  methods: {
    getStatus() {
      this.$store.dispatch('service/getStatus').then(() => {
        console.log(this.$store.state.service.status)
      }).catch(() => {
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
