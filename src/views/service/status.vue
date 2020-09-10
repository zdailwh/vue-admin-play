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
      <el-row :gutter="20">
        <el-col :span="6" style="margin-bottom:15px;">
          <el-card :body-style="{ padding: '0px', paddingTop: '15px', textAlign: 'center' }">
            <el-progress type="circle" :percentage="percentage1" :color="percentage1 | getColor" />
            <p class="percentName">CPU使用率</p>
          </el-card>
        </el-col>
        <el-col :span="6" style="margin-bottom:15px;">
          <el-card :body-style="{ padding: '0px', paddingTop: '15px', textAlign: 'center' }">
            <el-progress type="circle" :percentage="percentage2" :color="percentage2 | getColor" />
            <p class="percentName">CPU使用率</p>
          </el-card>
        </el-col>
        <el-col :span="6" style="margin-bottom:15px;">
          <el-card :body-style="{ padding: '0px', paddingTop: '15px', textAlign: 'center' }">
            <el-progress type="circle" :percentage="percentage3" :color="percentage3 | getColor" />
            <p class="percentName">CPU使用率</p>
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
      activeTab: '/service/status',
      percentage1: 10,
      percentage2: 40,
      percentage3: 90
    }
  },
  computed: {
    ...mapState({
      type: state => state.service.type
    })
  },
  watch: {
    activeTab(val) {
      this.$router.push({ path: val })
    }
  },
  methods: {
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
