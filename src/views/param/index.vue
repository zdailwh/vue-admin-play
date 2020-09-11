<template>
  <div class="dashboard-container">
    <div>
      <p><el-button type="primary" size="medium" icon="el-icon-plus" plain @click="newData()">添加编码配置</el-button></p>
      <el-table v-if="paramList && paramList.length" :data="paramList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="ID："><span>{{ scope.row.id }}</span></el-form-item>
              <el-form-item v-if="scope.row.log" label="log："><span>{{ scope.row.log }}</span></el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50" />
        <el-table-column label="视频编码">
          <template slot-scope="scope">{{ v_codec_obj[scope.row.v_codec] }}</template>
        </el-table-column>
        <el-table-column label="视频宽高">
          <template slot-scope="scope">{{ scope.row.v_resolution_w }} * {{ scope.row.v_resolution_h }}</template>
        </el-table-column>
        <el-table-column label="视频码率">
          <template slot-scope="scope">{{ scope.row.v_bitrate }}</template>
        </el-table-column>
        <el-table-column label="视频帧率">
          <template slot-scope="scope">{{ scope.row.v_framerate }}</template>
        </el-table-column>
        <el-table-column label="profile">
          <template slot-scope="scope">{{ scope.row.v_profile }}</template>
        </el-table-column>
        <el-table-column label="预设值">
          <template slot-scope="scope">{{ scope.row.v_preset }}</template>
        </el-table-column>
        <el-table-column label="音频编码">
          <template slot-scope="scope">{{ scope.row.a_codec }}</template>
        </el-table-column>
        <el-table-column label="音频采样率">
          <template slot-scope="scope">{{ scope.row.a_samplerate }}</template>
        </el-table-column>
        <el-table-column label="音频码率">
          <template slot-scope="scope">{{ scope.row.a_bitrate }}</template>
        </el-table-column>
        <el-table-column label="输出码率">
          <template slot-scope="scope">{{ scope.row.muxrate }}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{ scope.row.statusstr }}</template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" icon="el-icon-edit" round @click.stop="toEdit(scope.$index, scope.row)" />
              <el-button v-if="scope.row.used === 0" size="mini" type="danger" icon="el-icon-delete" round @click.stop="delParam(scope.$index, scope.row.id)" />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="formEncode.id ? '编辑编码配置': '添加编码配置'" :visible.sync="showEdit">
      <div class="grid-form">
        <el-form ref="formEncode" :model="formEncode" label-width="120px" :rules="rules">
          <el-form-item label="视频编码" prop="v_codec">
            <el-select v-model="formEncode.v_codec" placeholder="请选择视频编码">
              <el-option v-for="(v, k) in v_codec_obj" :key="k" :label="v" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="分辨率" prop="v_resolution">
            <el-select v-model="formEncode.v_resolution" placeholder="请选择分辨率">
              <el-option label="auto" value="" />
              <el-option label="7680x4320" value="7680x4320" />
              <el-option label="3840x2160" value="3840x2160" />
              <el-option label="1920x1080" value="1920x1080" />
              <el-option label="1280x720" value="1280x720" />
              <el-option label="640x360" value="640x360" />
              <el-option label="Custom" value="Custom" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="formEncode.v_resolution === 'Custom'" label="自定义分辨率">
            <el-col :span="11">
              <el-input v-model="formEncode.v_resolution_w" placeholder="宽" style="width: 100%;" />
            </el-col>
            <el-col class="line" :span="2" style="text-align: center;">×</el-col>
            <el-col :span="11">
              <el-input v-model="formEncode.v_resolution_h" placeholder="高" style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="视频码率" prop="v_bitrate">
            <el-input v-model="formEncode.v_bitrate" placeholder="请输入视频码率">
              <template slot="append">kbps</template>
            </el-input>
          </el-form-item>
          <el-form-item label="视频帧率" prop="v_framerate">
            <el-select v-model="formEncode.v_framerate" placeholder="请选择视频帧率">
              <el-option label="auto" value="" />
              <el-option label="60" value="60" />
              <el-option label="59.94" value="59.94" />
              <el-option label="50" value="50" />
              <el-option label="30" value="30" />
              <el-option label="29.97" value="29.97" />
              <el-option label="25" value="25" />
              <el-option label="24" value="24" />
              <el-option label="23.98" value="23.98" />
            </el-select>
          </el-form-item>
          <el-form-item label="profile" prop="v_profile">
            <el-select v-model="formEncode.v_profile" placeholder="请选择profile">
              <el-option label="auto" value="" />
              <el-option label="rext" value="rext" />
              <el-option label="main" value="main" />
              <el-option label="high" value="high" />
              <el-option label="main10" value="main10" />
              <el-option label="high10" value="high10" />
            </el-select>
          </el-form-item>
          <el-form-item label="预设值" prop="v_preset">
            <el-select v-model="formEncode.v_preset" placeholder="请选择预设值">
              <el-option label="auto" value="" />
              <template v-if="formEncode.v_codec === 'libx264' || formEncode.v_codec === 'libx265'">
                <el-option label="ultrafast" value="ultrafast" />
                <el-option label="superfast" value="superfast" />
                <el-option label="veryfast" value="veryfast" />
                <el-option label="faster" value="faster" />
                <el-option label="fast" value="fast" />
                <el-option label="medium" value="medium" />
                <el-option label="slow" value="slow" />
                <el-option label="slower" value="slower" />
                <el-option label="veryslow" value="veryslow" />
                <el-option label="placebo" value="placebo" />
              </template>
              <template v-else-if="formEncode.v_codec === 'h264_nvenc' || formEncode.v_codec === 'hevc_nvenc'">
                <el-option label="slow" value="slow" />
                <el-option label="medium" value="medium" />
                <el-option label="fast" value="fast" />
                <el-option label="hp" value="hp" />
                <el-option label="hq" value="hq" />
                <el-option label="bd" value="bd" />
                <el-option label="ll" value="ll" />
                <el-option label="llhq" value="llhq" />
                <el-option label="llhp" value="llhp" />
                <el-option label="lossless" value="lossless" />
                <el-option label="losslesshp" value="losslesshp" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="音频编码" prop="a_codec">
            <el-select v-model="formEncode.a_codec" placeholder="请选择音频编码">
              <el-option label="PASS" value="copy" />
              <el-option label="aac" value="aac" />
              <el-option label="mp2" value="mp2" />
              <el-option label="mp3" value="mp3" />
            </el-select>
          </el-form-item>
          <el-form-item label="音频采样率" prop="a_samplerate">
            <el-select v-model="formEncode.a_samplerate" placeholder="请选择音频采样率">
              <el-option label="auto" value="" />
              <el-option label="44100" value="44100" />
              <el-option label="48000" value="48000" />
              <el-option label="32000" value="32000" />
            </el-select>
          </el-form-item>
          <el-form-item label="音频码率" prop="a_bitrate">
            <el-select v-model="formEncode.a_bitrate" placeholder="请选择音频码率">
              <el-option label="384k" value="384k" />
              <el-option label="192k" value="192k" />
              <el-option label="128k" value="128k" />
              <el-option label="自定义" value="自定义" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="customBitrate" label="自定义音频码率" prop="a_bitrate_custom">
            <el-input v-model="formEncode.a_bitrate_custom" placeholder="请输入音频码率" />
          </el-form-item>
          <el-form-item label="视频像素格式" prop="v_format" style="display: none">
            <el-input v-model="formEncode.v_format" placeholder="" />
          </el-form-item>
          <!-- <el-form-item label="视频像素格式" prop="v_format">
            <el-select v-model="formEncode.v_format" placeholder="请选择视频像素格式">
              <el-option label="auto" value="" />
              <el-option label="yuv420p" value="yuv420p" />
              <el-option label="yuyv422" value="yuyv422" />
              <el-option label="uyvy422" value="uyvy422" />
              <el-option label="444p" value="444p" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="输出码率" prop="muxrate">
            <el-input v-model="formEncode.muxrate" placeholder="请输入输出码率" />
          </el-form-item>
          <el-form-item label="自定义参数" prop="custom">
            <el-input v-model="formEncode.custom" placeholder="请输入自定义参数" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitOutput">{{ formEncode.id ? '更 新': '添 加' }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  filters: {
    formatUrl(val) {
      if (val.indexOf('?') > 0) {
        return val.substring(0, val.indexOf('?'))
      } else {
        return val
      }
    }
  },
  data() {
    return {
      loading: false,
      showEdit: false,
      formEncode: {
        left_percent: 0, // Logo左边距 百分比 可选，上面Logo对象存在时必选----左边距百分比
        top_percent: 0, // Logo顶部边距 百分比 可选，上面Logo对象存在时必选----上边距百分比
        width_percent: 0, // Logo相对宽度 百分比 可选，上面Logo对象存在时必选----宽度百分比
        height_percent: 0, // Logo相对高度 百分比 可选，上面Logo对象存在时必选----高度百分比
        v_codec: 'hevc_nvenc', // 必选 ，copy/libx265/hevc_nvenc/libx264/h264_nvenc 必须----视频编码
        v_resolution: '',
        v_resolution_w: '', // 可选 7840x4320/ 3920x2160 / 1960x1080 / 1280x720 / 640 x 360 / Custom (w,hCustom)----视频宽度
        v_resolution_h: '', // 可选 可为空 或为 -1 ，w、h 必须同时存在或为空，不能同时为-1----视频高度
        v_bitrate: 10000, // 正整数 必选----视频码率
        v_framerate: '', // 60, 50, 30, 25, 24  可选，可为空，或列表选择----视频帧率
        v_profile: 'rext', // BaseLine/Main/High/Main10/High10 可选 ,可输入或列表，也可为空----profile
        v_preset: 'slow', // 可选----预设值
        // (libx264,libx265) ultrafast\superfast\veryfast\faster\fast\medium\slow\slower\veryslow\placebo
        // (h264_nvenc,hevc_nvenc) slow\medium\fast\hp\hq\bd\ll\llhq\llhp\lossless\losslesshp
        a_codec: 'aac', // copy /aac/mp2/mp3 必选----音频编码
        a_samplerate: '48000', // 44100 48000 32000 可选----音频采样率
        a_bitrate: '192k', // 正整数 必选----音频码率
        v_format: 'yuv420p', // 420p yuyv422 uyvy422 444p 可选----输出格式
        a_bitrate_custom: ''
      },
      customBitrate: false,
      rules: {
        v_codec: [
          { required: true, message: '请选择视频编码', trigger: 'change' }
        ],
        v_bitrate: [
          { required: true, message: '请输入视频码率', trigger: 'blur' }
        ],
        a_codec: [
          { required: true, message: '请选择音频编码', trigger: 'change' }
        ],
        a_bitrate: [
          { required: true, message: '请输入音频码率', trigger: 'change' }
        ],
        a_bitrate_custom: [
          { required: true, message: '请输入自定义音频码率', trigger: 'blur' }
        ]
      },
      v_codec_obj: {
        'copy': 'PASS',
        'libx265': 'HEVC',
        'hevc_nvenc': 'HEVC硬编',
        'libx264': 'H264',
        'h264_nvenc': 'H264硬编'
      }
    }
  },
  computed: {
    ...mapState({
      paramList: state => state.service.params
    })
  },
  watch: {
    'formEncode.v_resolution': function(val, oldVal) {
      if (val) {
        if (val.indexOf('x') > 0) {
          var arr = val.split('x')
          this.formEncode.v_resolution_w = arr[0]
          this.formEncode.v_resolution_h = arr[1]
        } else {
          this.formEncode.v_resolution_w = ''
          this.formEncode.v_resolution_h = ''
        }
      } else {
        this.formEncode.v_resolution_w = ''
        this.formEncode.v_resolution_h = ''
      }
    },
    'formEncode.v_resolution_w': function(val, oldVal) {
      if (val) {
        this.v_resolution_w = String(val) || '1920'
      }
    },
    'formEncode.v_resolution_h': function(val, oldVal) {
      if (val) {
        this.v_resolution_h = String(val) || '1080'
      }
    },
    'formEncode.a_bitrate': function(val, oldVal) {
      if (val === '自定义') {
        this.customBitrate = true
      } else {
        this.customBitrate = false
      }
    }
  },
  mounted() {
    this.getParamList()
  },
  methods: {
    getParamList() {
      this.$store.dispatch('service/getParams').then(() => {
      }).catch(() => {
      })
    },
    toEdit(index, item) {
      this.editIdx = index
      this.formEncode = item
      this.showEdit = true
    },
    onSubmitOutput() {
      this.$refs.formEncode.validate((valid) => {
        if (valid) {
          if (this.formEncode.id) {
            this.doEdit()
          } else {
            this.doAdd()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    doEdit() {
      var params = this.formEncode
      params.index = this.editIdx
      console.log(params)
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/updateParam', params).then(() => {
        this.$message({
          message: '编码配置更新成功！',
          type: 'success'
        })
        this.loading = false
        this.showEdit = false
      }).catch((e) => {
        this.$message({
          message: e.response.data || '编码配置更新失败！',
          type: 'error'
        })
        this.loading = false
        this.showEdit = false
      })
    },
    doAdd() {
      var params = this.formEncode
      console.log(params)
      // 创建
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/addParam', params).then((response) => {
        this.$message({
          message: '编码配置添加成功！',
          type: 'success'
        })
        this.loading = false
        this.showEdit = false
      }).catch((e) => {
        this.$message({
          message: e.response.data || '编码配置添加失败！',
          type: 'error'
        })
        this.loading = false
        this.showEdit = false
      })
    },
    newData() {
      this.showEdit = true
    },
    delParam(index, id) {
      var params = {
        id: id,
        index: index
      }
      this.$confirm('确定要删除此编码配置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('service/delParam', params).then(() => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        }).catch((e) => {
          this.$message({
            message: e.response.data || '删除失败！',
            type: 'error'
          })
        })
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

