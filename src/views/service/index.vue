<template>
  <div class="dashboard-container">
    <div>
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="Jobs" :name="$route.path" />
        <el-tab-pane label="Status" name="/service/status" />
        <el-tab-pane label="Settings" name="/service/settings" />
      </el-tabs>
    </div>
    <el-row :gutter="20">
      <el-col v-for="(o, index) in serviceList" :key="index" :span="6" style="margin-bottom:15px;" class="channelWrap">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <span>{{ o.name }}</span>
          </div>
          <div class="card">
            <div style="min-height: 120px;padding: 0 20px;">
              <p>{{ o.input.url }}</p>
              <p>{{ vcodecObj[o.v_codec] }} <span style="margin-left: 20px;">{{ o.v_bitrate }}</span></p>
              <p v-for="(out, idx) in o.output" :key="idx">{{ out.url }}</p>
            </div>
            <!-- <img src="@/assets/play/tb.png" class="logo"> -->
            <div class="opeBtns">
              <el-button v-if="o.status === 0" size="small" style="color: #67C23A;" @click="changeStatus(index, o.id, 'start')">启动</el-button>
              <el-button v-if="o.status === 1" size="small" style="color: #F56C6C;" @click="changeStatus(index, o.id, 'stop')">停止</el-button>
              <el-button v-if="o.status !== 2" size="small" style="color: #F56C6C;" @click="changeStatus(index, o.id, 'disable')">禁用</el-button>
              <el-button v-if="o.status === 2" size="small" style="color: #F56C6C;" @click="changeStatus(index, o.id, 'enable')">恢复</el-button>
              <!-- <el-button size="small" @click="delService(index, o)">删除</el-button> -->
              <el-button size="small" @click="getLogList(o.id);currChannelId = o.id; logVisible = true">日志</el-button>
              <!-- <el-button size="small" @click="previewurl = o.previewurl; dialogVisible = true;">预览</el-button> -->
              <a v-show="o.type === 0" :href="'/preview.html?previewurl=' + o.previewurl" target="_blank">
                <el-button size="small">预览</el-button>
              </a>
              <router-link :to="'/service/edit/'+o.id">
                <el-button size="small">编辑</el-button>
              </router-link>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card :body-style="{ padding: '0px' }" class="cardPlus">
          <router-link to="/service/add">
            <i class="el-icon-plus" /> 添加service
          </router-link>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="日志"
      :visible.sync="logVisible"
      width="680px"
    >
      <div style="height: 500px;overflow-y: scroll;">
        <div class="logs">
          <p v-for="(l, idx) in logList" :key="idx">{{ l }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logVisible = false">关 闭</el-button>
        <el-button type="primary" @click="getLogList(currChannelId)">刷 新</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      width="680px"
    >
      <div class="dialogBody">
        <Player :previewurl="previewurl" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { Message } from 'element-ui'
import Player from '@/components/Player'

// const STATUS_STOPPED = 0 // '停止的'
// const STATUS_RUNNING = 1 // '运行中'
// const STATUS_DISABLED = 2 // '已禁止'

export default {
  components: { Player },
  data() {
    return {
      activeTab: '/service/index',
      statusArr: ['停止', '运行中', '已禁止'],
      dialogVisible: false,
      previewurl: '',
      vcodecObj: {
        'copy': 'PASS',
        'libx265': 'HEVC',
        'hevc_nvenc': 'HEVC硬编',
        'libx264': 'H264',
        'h264_nvenc': 'H264硬编'
      },
      logVisible: false,
      logList: [],
      currChannelId: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    ...mapState({
      serviceList: state => state.service.channels,
      type: state => state.service.type
    })
  },
  watch: {
    activeTab(val) {
      this.$router.push({ path: val })
    },
    $route(val) {
      if (val.path) {
        this.activeTab = val.path
      }
    }
  },
  mounted() {
    if (this.$route.path) {
      this.activeTab = this.$route.path
    }
    if (this.$route.params.type) {
      this.$store.dispatch('service/changeType', this.$route.params.type)
    } else {
      alert('无效类型')
    }
    // this.getChannelList()
  },
  methods: {
    // getChannelList() {
    //   this.$store.dispatch('service/getChannels').then(() => {
    //   }).catch(() => {
    //   })
    // },
    changeStatus(index, id, status) {
      if (this.loading) return
      var _this = this
      var params = {
        id: id,
        index: index
      }
      if (status === 'start') {
        // 去启动
        this.loading = true
        this.$store.dispatch('service/channelStart', params).then(() => {
          Message({
            message: '已启动',
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              _this.loading = false
            }
          })
        }).catch(() => {
          this.loading = false
        })
      } else if (status === 'stop') {
        // 去停止
        this.loading = true
        this.$store.dispatch('service/channelStop', params).then(() => {
          Message({
            message: '已停止',
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              _this.loading = false
            }
          })
        }).catch(() => {
          this.loading = false
        })
      } else if (status === 'disable') {
        // 去禁用
        this.loading = true
        this.$store.dispatch('service/channelDisable', params).then(() => {
          Message({
            message: '已禁用',
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              _this.loading = false
            }
          })
        }).catch(() => {
          this.loading = false
        })
      } else if (status === 'enable') {
        // 去恢复
        this.loading = true
        this.$store.dispatch('service/channelEnable', params).then(() => {
          Message({
            message: '已恢复',
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              _this.loading = false
            }
          })
        }).catch(() => {
          this.loading = false
        })
      }
    },
    delService(index, item) {
      this.serviceList.splice(index, 1)
    },
    getLogList(id) {
      this.$store.dispatch('service/getLogs', { id: id }).then((res) => {
        this.logList = res
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
.card {
  position: relative;
}
.card img.bg {
  width: 100%;
  height: auto;
}
.card img.logo {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: auto;
}
.opeBtns {
  padding: 10px;
}
.opeBtns .el-button {
  margin-bottom: 5px;
}
.opeBtns .el-button + .el-button {
  margin-left: 0;
}

.cardPlus a {
  display: block;
  padding: 20px;
  line-height: 50px;
  text-align: center;
}
.cardPlus .el-icon-plus {
  font-size: 20px;
  color: #333;
  font-weight: 700;
}
</style>
