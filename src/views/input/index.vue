<template>
  <div class="dashboard-container">
    <div>
      <p><el-button type="primary" size="medium" icon="el-icon-plus" plain @click="newData()">添加输入配置</el-button></p>
      <el-table v-if="inputList && inputList.length" :data="inputList">
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
          <template slot-scope="scope">{{ scope.row.url }}</template>
        </el-table-column>
        <el-table-column label="协议">
          <template slot-scope="scope">{{ scope.row.protocol }}</template>
        </el-table-column>
        <!-- <el-table-column label="解码格式">
          <template v-if="scope.row.decoder" slot-scope="scope">{{ decoder_obj[scope.row.decoder] }}</template>
          <template v-else>PASS</template>
        </el-table-column> -->
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
              <el-button v-if="scope.row.used === 0" size="mini" type="danger" icon="el-icon-delete" round @click.stop="delInput(scope.$index, scope.row.id)" />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="formInput.id ? '编辑输入配置': '添加输入配置'" :visible.sync="showEdit">
      <div class="grid-form">
        <el-form ref="formInput" :model="formInput" label-width="120px" :rules="rules">
          <el-form-item label="类型" prop="type">
            <el-select v-model="formInput.type" placeholder="请选择类型">
              <!-- <el-option label="设备" :value="0" /> -->
              <el-option label="网络" :value="1" />
              <el-option label="文件" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="协议" prop="protocol">
            <el-select v-model="formInput.protocol" placeholder="请选择协议">
              <template v-if="formInput.type === 1">
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
            <el-input v-model="formInput.url" placeholder="请输入链接地址" />
          </el-form-item>
          <!-- <el-form-item label="解码格式" prop="decoder">
            <el-select v-model="formInput.decoder" placeholder="请选择解码格式">
              <el-option label="PASS" value="" />
              <el-option v-for="(v, k) in decoder_obj" :key="k" :label="v" :value="k" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="参数1">
            <el-col :span="11">
              <el-input v-model="formInput.para_name1" placeholder="请输入参数名称" />
            </el-col>
            <el-col class="line" :span="2" />
            <el-col :span="11">
              <el-input v-model="formInput.para_value1" placeholder="请输入参数值" />
            </el-col>
          </el-form-item>
          <el-form-item label="参数2">
            <el-col :span="11">
              <el-input v-model="formInput.para_name2" placeholder="请输入参数名称" />
            </el-col>
            <el-col class="line" :span="2" />
            <el-col :span="11">
              <el-input v-model="formInput.para_value2" placeholder="请输入参数值" />
            </el-col>
          </el-form-item>
          <el-form-item label="参数3">
            <el-col :span="11">
              <el-input v-model="formInput.para_name3" placeholder="请输入参数名称" />
            </el-col>
            <el-col class="line" :span="2" />
            <el-col :span="11">
              <el-input v-model="formInput.para_value3" placeholder="请输入参数值" />
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitInput">{{ formInput.id ? '更 新': '添 加' }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      showEdit: false,
      formInput: {
        // inputName: '',
        type: '',
        protocol: '',
        url: '',
        decoder: 'hevc',
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
        ]
      }
      // decoder_obj: {
      //   // '': 'PASS',
      //   'hevc': 'HEVC',
      //   'hevc_cuvid': 'HEVC硬解',
      //   'h264': 'H264',
      //   'h264_cuvid': 'H264硬解'
      // }
    }
  },
  computed: {
    ...mapGetters({
      inputList: 'service/inputsTypeNot2'
    })
  },
  watch: {
    'formInput.type': function(val, oldVal) {
      var typeArr = ['设备', '网络', '文件']
      if (val) {
        this.formInput.typename = typeArr[val]
      }
    }
  },
  mounted() {
    this.getInputList()
  },
  methods: {
    getInputList() {
      this.$store.dispatch('service/getInputs').then(() => {
      }).catch(() => {
      })
    },
    toEdit(index, item) {
      this.editIdx = index
      this.formInput = item
      this.showEdit = true
    },
    onSubmitInput() {
      this.$refs.formInput.validate((valid) => {
        if (valid) {
          if (this.formInput.id) {
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
      var params = this.formInput
      params.index = this.editIdx
      console.log(params)
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/updateInput', params).then(() => {
        this.$message({
          message: '输入配置更新成功！',
          type: 'success'
        })
        this.loading = false
        this.showEdit = false
      }).catch((e) => {
        this.$message({
          message: e.response.data || '输入配置更新失败！',
          type: 'error'
        })
        this.loading = false
        this.showEdit = false
      })
    },
    doAdd() {
      var params = this.formInput
      console.log(params)
      // 创建
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/addInput', params).then((response) => {
        this.$message({
          message: '输入配置添加成功！',
          type: 'success'
        })
        this.loading = false
        this.showEdit = false
      }).catch((e) => {
        this.$message({
          message: e.response.data || '输入配置添加失败！',
          type: 'error'
        })
        this.loading = false
        this.showEdit = false
      })
    },
    newData() {
      // this.formInput = { type: 1, decoder: 'hevc' }
      this.formInput = { type: 1 }
      this.showEdit = true
    },
    delInput(index, id) {
      var params = {
        id: id,
        index: index
      }
      this.$confirm('确定要删除此输入配置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('service/delInput', params).then(() => {
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

