<template>
  <div class="dashboard-container">
    <div>
      <p><el-button type="primary" size="medium" icon="el-icon-plus" plain @click="newData()">添加输出配置</el-button></p>
      <el-table v-if="outputList && outputList.length" :data="outputList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="ID："><span>{{ scope.row.id }}</span></el-form-item>
              <el-form-item v-if="scope.row.log" label="log："><span>{{ scope.row.log }}</span></el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50" />
        <el-table-column label="类型名称">
          <template slot-scope="scope">{{ scope.row.typename }}</template>
        </el-table-column>
        <el-table-column label="链接地址">
          <template slot-scope="scope">{{ scope.row.url | formatUrl }}</template>
        </el-table-column>
        <el-table-column label="输出格式">
          <template slot-scope="scope">{{ scope.row.format }}</template>
        </el-table-column>
        <el-table-column label="协议">
          <template slot-scope="scope">{{ scope.row.protocol }}</template>
        </el-table-column>
        <el-table-column label="ts信息">
          <template slot-scope="scope">{{ scope.row.tsinfo }}</template>
        </el-table-column>
        <el-table-column label="参数">
          <template slot-scope="scope">
            <p v-if="scope.row.para_name1">{{ scope.row.para_name1 }}：{{ scope.row.para_value1 }}</p>
            <p v-if="scope.row.para_name2">{{ scope.row.para_name2 }}：{{ scope.row.para_value2 }}</p>
            <p v-if="scope.row.para_name3">{{ scope.row.para_name3 }}：{{ scope.row.para_value3 }}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{ scope.row.statusstr }}</template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" icon="el-icon-edit" round @click.stop="toEdit(scope.$index, scope.row)" />
              <el-button v-if="scope.row.used === 0" size="mini" type="danger" icon="el-icon-delete" round @click.stop="delOutput(scope.$index, scope.row.id)" />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="formOutput.id ? '编辑输出配置': '添加输出配置'" :visible.sync="showEdit">
      <div class="grid-form">
        <el-form ref="formOutput" :model="formOutput" label-width="120px" :rules="rules">
          <!-- <el-form-item label="名称" prop="outputName">
            <el-input v-model="formOutput.outputName" placeholder="请输入名称" />
          </el-form-item> -->
          <el-form-item label="类型" prop="type">
            <el-select v-model="formOutput.type" placeholder="请选择类型">
              <!-- <el-option label="设备" :value="0" /> -->
              <el-option label="网络" :value="1" />
              <el-option label="文件" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="协议" prop="protocol">
            <el-select v-model="formOutput.protocol" placeholder="请选择协议">
              <template v-if="formOutput.type === 1">
                <el-option label="UDP" value="UDP" />
                <el-option label="RTMP" value="RTMP" />
                <el-option label="RTP" value="RTP" />
                <el-option label="DASH" value="DASH" />
                <el-option label="HLS" value="HLS" />
              </template>
              <template v-else>
                <el-option label="FILE" value="FILE" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="链接地址" prop="url">
            <el-input v-model="formOutput.url" placeholder="请输入链接地址" />
          </el-form-item>
          <el-form-item label="输出格式" prop="format">
            <el-input v-model="formOutput.format" placeholder="请输入输出格式" />
          </el-form-item>
          <el-form-item label="ts信息" prop="tsinfo">
            <el-input v-model="formOutput.tsinfo" placeholder="请输入ts信息" />
          </el-form-item>
          <el-form-item label="参数1">
            <el-col :span="11">
              <el-input v-model="formOutput.para_name1" placeholder="请输入参数名称" />
            </el-col>
            <el-col class="line" :span="2" />
            <el-col :span="11">
              <el-input v-model="formOutput.para_value1" placeholder="请输入参数值" />
            </el-col>
          </el-form-item>
          <el-form-item label="参数2">
            <el-col :span="11">
              <el-input v-model="formOutput.para_name2" placeholder="请输入参数名称" />
            </el-col>
            <el-col class="line" :span="2" />
            <el-col :span="11">
              <el-input v-model="formOutput.para_value2" placeholder="请输入参数值" />
            </el-col>
          </el-form-item>
          <el-form-item label="参数3">
            <el-col :span="11">
              <el-input v-model="formOutput.para_name3" placeholder="请输入参数名称" />
            </el-col>
            <el-col class="line" :span="2" />
            <el-col :span="11">
              <el-input v-model="formOutput.para_value3" placeholder="请输入参数值" />
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitOutput">{{ formOutput.id ? '更 新': '添 加' }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      formOutput: {
        // outputName: '',
        type: '',
        protocol: '',
        url: '',
        tsinfo: '',
        para_name1: '',
        para_value1: '',
        para_name2: '',
        para_value2: '',
        para_name3: '',
        para_value3: ''
      },
      rules: {
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        protocol: [
          { required: true, message: '请选择协议', trigger: 'change' }
        ],
        url: [
          { required: true, message: '请输入链接地址', trigger: 'blur' }
        ],
        format: [
          { required: true, message: '请输入输出格式', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      outputList: 'service/outputsTypeNot2'
    })
  },
  watch: {
    'formOutput.type': function(val, oldVal) {
      var typeArr = ['设备', '网络', '文件']
      if (val) {
        this.formOutput.typename = typeArr[val]
      }
    }
  },
  mounted() {
    this.getOutputList()
  },
  methods: {
    getOutputList() {
      this.$store.dispatch('service/getOutputs').then(() => {
      }).catch(() => {
      })
    },
    toEdit(index, item) {
      this.editIdx = index
      this.formOutput = item
      this.showEdit = true
    },
    onSubmitOutput() {
      this.$refs.formOutput.validate((valid) => {
        if (valid) {
          if (this.formOutput.id) {
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
      var params = this.formOutput
      params.index = this.editIdx
      console.log(params)
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/updateOutput', params).then(() => {
        this.$message({
          message: '输出配置更新成功！',
          type: 'success'
        })
        this.loading = false
        this.showEdit = false
      }).catch((e) => {
        this.$message({
          message: e.response.data || '输出配置更新失败！',
          type: 'error'
        })
        this.loading = false
        this.showEdit = false
      })
    },
    doAdd() {
      var params = this.formOutput
      console.log(params)
      // 创建
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/addOutput', params).then((response) => {
        this.$message({
          message: '输出配置添加成功！',
          type: 'success'
        })
        this.loading = false
        this.showEdit = false
      }).catch((e) => {
        this.$message({
          message: e.response.data || '输出配置添加失败！',
          type: 'error'
        })
        this.loading = false
        this.showEdit = false
      })
    },
    newData() {
      this.formOutput = { type: 1 }
      this.showEdit = true
    },
    delOutput(index, id) {
      var params = {
        id: id,
        index: index
      }
      this.$confirm('确定要删除此输出配置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('service/delOutput', params).then(() => {
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

