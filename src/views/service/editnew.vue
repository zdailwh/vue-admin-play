<template>
  <div class="dashboard-container">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <span>service设置</span>
      </div>
      <el-form ref="formService" :model="formService" label-width="120px" :rules="rules">
        <el-form-item label="类型 " prop="type" :disabled="flag === 'edit'">
          <el-select v-model="formService.type" placeholder="请选择类型">
            <el-option label="编码器" :value="0" />
            <!-- <el-option label="解码器" :value="1" /> -->
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="formService.name" placeholder="请输入频道名称" />
        </el-form-item>
        <el-form-item label="输入配置" prop="input">
          <el-checkbox-group v-model="checkInput">
            <el-checkbox v-for="item in inputList" :key="item.id" :label="item.id">({{ item.typename }}) {{ item.url }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="编码配置" prop="input">
          <p v-for="(item, key) in paramTreeData" :key="key">
            {{ item.name }}
            <el-tree :data="item.children" show-checkbox node-key="id" :props="paramTreeProps" :default-checked-keys="checkParam[item.id]" @check="treeCheck" />
          </p>
        </el-form-item>
        <!-- <el-form-item label="台标">
          <p>
            <el-button v-if="!v_resolution_w || !v_resolution_h" type="primary" @click="$message({ message: '请选择分辨率！', type: 'error' })">选择台标</el-button>
            <el-button v-else type="primary" @click="$refs.logoDialog.dialogVisible = true">选择台标</el-button>
            <el-button v-show="checkedLogo && checkedLogo.id" type="danger" @click="cleanLogo">取消选择</el-button>
          </p>
          <Scale ref="logoScale" :url="checkedLogo.url || ''" :fatherw="v_resolution_w" :fatherh="v_resolution_h" :toppercent="formService.top_percent" :leftpercent="formService.left_percent" :widthpercent="formService.width_percent" :heightpercent="formService.height_percent" />
        </el-form-item> -->
        <el-form-item>
          <el-button v-if="channel.status !== 1" type="warning" @click="onSubmitService('formService')">保存配置</el-button>
          <a href="javascript:window.history.go(-1);">
            <el-button>取消</el-button>
          </a>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- <Logos ref="logoDialog" :checkedlogo="checkedLogo" @uploadlogo="uploadLogo($event)" @checklogo="checkLogo($event)" @dellogo="delLogo($event)" /> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
// import Scale from './scale.vue'
// import Logos from './logos.vue'

export default {
  // components: { Logos, Scale },
  filters: {
    ArrToStr(val) {
      if (val && val.length) {
        return val.join('-')
      }
    },
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
      flag: 'add', // add or edit
      formService: {
        type: null,
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入频道名称', trigger: 'blur' }
        ]
      },
      checkInput: [],
      checkParam: {},
      paramTreeProps: {
        children: 'children',
        label: 'name'
      },
      paramWithOutputMap: []
    }
  },
  computed: {
    ...mapGetters({
      inputList: 'service/inputsTypeNot2',
      outputList: 'service/outputsTypeNot2',
      inputWithNameList: 'service/inputsWithName',
      outputWithNameList: 'service/outputsWithName',
      paramWithNameList: 'service/paramsWithName'
    }),
    ...mapState({
      channel: state => state.service.channel,
      paramList: state => state.service.params,
      // inputList: state => state.service.inputs,
      // outputList: state => state.service.outputs,
      logoList: state => state.service.logos
    }),
    paramTreeData() {
      var self = this
      if (!this.paramWithNameList.length) return
      if (!this.outputWithNameList.length) return
      // var data = this.paramWithNameList
      // var parent
      // for (var i = 0; i < data.length; i++) {
      //   parent = data[i]
      //   var subOutputs = self.outputWithNameList
      //   for (var j = 0; j < subOutputs.length; j++) {
      //     subOutputs[j].parent = parent
      //   }
      //   data[i].children = subOutputs
      // }
      var param = {}
      var subOutputs = []
      var output = {}
      var parentId = null
      var formatdata = this.paramWithNameList.map((item, key, array) => {
        param = item
        parentId = item.id
        subOutputs = self.outputWithNameList.map((it, k, arr) => {
          output = it
          output.parent = param
          output.parent_id = parentId
          return output
        })
        param.children = subOutputs
        return param
      })
      console.log(formatdata)
      return formatdata
    }
  },
  mounted() {
    this.getOutputList()
    this.getInputList()
    this.getParamList()
    this.getLogoList()
    if (this.$route.params.sid) {
      this.flag = 'edit'
      this.getChannel()
    } else {
      this.flag = 'add'
      this.$store.commit('service/SET_CHANNEL', {})
    }
  },
  methods: {
    newData(item) {
    },
    onSubmitService(formName) {
      this.$refs.formService.validate((valid) => {
        if (valid) {
          if (this.checkInput.length !== 1) {
            this.$message.error('请选择一个输入配置！')
            return
          }
          // if (this.paramWithOutputMap.length < 1 || this.paramWithOutputMa.length > 3) {
          //   this.$message.error('请选择1到3个编码配置！')
          //   return
          // }
          if (this.formService.type === 0) {
            this.$refs.formService.validate((valid2) => {
              if (valid2) {
                if (this.flag === 'edit' && this.channel.id) {
                  this.editChannel()
                } else {
                  this.addChannel()
                }
              } else {
                this.curr = 'encode'
                this.handle = 'form'
                this.$message.error('请完善编码配置！')
              }
            })
          } else {
            if (this.flag === 'edit' && this.channel.id) {
              this.editChannel()
            } else {
              this.addChannel()
            }
          }
        } else {
          this.$message.error('请完善service设置！')
          return false
        }
      })
    },
    addChannel() {
      var params = {}
      if (this.formService.type === 0) {
        params = this.formService
      }
      params.name = this.formService.name
      params.type = this.formService.type
      // params.input_class = this.input.class
      params.input_id = this.checkInput[0]
      // params.param_class = this.param[0].class
      params.param_ids = this.paramWithOutputMap

      console.log(params)
      // 创建
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/addChannel', params).then((response) => {
        this.$message({
          message: '频道添加成功！',
          type: 'success'
        })
        this.loading = false
        this.handle = 'view'
        this.$router.push({ path: '/service/index/' + this.formService.type })
      }).catch((e) => {
        this.$message({
          message: e.response.data || '频道添加失败！',
          type: 'error'
        })
        this.loading = false
      })
    },
    editChannel() {
      var params = {}
      if (this.formService.type === 0) {
        params = this.formService
      }
      params.name = this.formService.name
      // params.input_class = this.input.class
      params.input_id = this.checkInput[0]
      // params.param_class = this.param[0].class
      params.param_ids = this.paramWithOutputMap

      console.log(params)
      if (this.loading) return
      this.loading = true
      this.$store.dispatch('service/updateChannel', params).then(() => {
        this.$message({
          message: '频道更新成功！',
          type: 'success'
        })
        this.loading = false
        this.handle = 'view'
        this.$router.push({ path: '/service/index/' + this.formService.type })
      }).catch((e) => {
        this.$message({
          message: e.response.data || '频道更新失败！',
          type: 'error'
        })
        this.loading = false
      })
    },
    getChannel() {
      var self = this
      this.$store.dispatch('service/getChannel', { id: this.$route.params.sid }).then((response) => {
        this.formService = response
        if (this.formService.input.id) {
          this.checkInput = [this.formService.input.id]
        }
        if (this.formService.param.length) {
          for (var i = 0; i < this.formService.param.length; i++) {
            var item = this.formService.param[i]
            var paramId = item.id
            var outputs = item.output
            self.checkParam[paramId] = outputs
          }
        }
      }).catch(() => {
      })
    },
    getInputList() {
      this.$store.dispatch('service/getInputs').then(() => {
      }).catch(() => {
      })
    },
    getOutputList() {
      this.$store.dispatch('service/getOutputs').then(() => {
      }).catch(() => {
      })
    },
    getParamList() {
      this.$store.dispatch('service/getParams').then(() => {
      }).catch(() => {
      })
    },
    getLogoList() {
      this.$store.dispatch('service/getLogos').then(() => {
      }).catch(() => {
      })
    },
    treeCheck(currNode, checkedObj) {
      console.log(checkedObj)
      var paramObj = currNode.parent
      var outputIdArr = checkedObj.checkedKeys
      var hasIndex = ''
      var has = this.paramWithOutputMap.find((item, index, array) => {
        if (item.param_id === paramObj.id) {
          hasIndex = index
          return true
        } else {
          return false
        }
      })
      if (has) {
        if (outputIdArr.length) {
          // this.paramWithOutputMap[hasIndex].param_id = paramObj.id
          this.paramWithOutputMap[hasIndex].output_ids = outputIdArr
        } else {
          this.paramWithOutputMap.splice(hasIndex, 1)
        }
      } else {
        if (outputIdArr.length) {
          this.paramWithOutputMap.push({
            param_id: paramObj.id,
            output_ids: outputIdArr
          })
        }
      }
      console.log(this.paramWithOutputMap)
    }
    // inputChange(input) {
    //   this.input = input
    // },
    // outputChange(event, output, index) {
    //   if (event) {
    //     this.output.push(output)
    //   } else {
    //     var delIdx = ''
    //     for (var i = 0; i < this.output.length; i++) {
    //       var item = this.output[i]
    //       if (item.id === output.id) {
    //         delIdx = i
    //       }
    //     }
    //     if (delIdx !== '') {
    //       this.output.splice(delIdx, 1)
    //     }
    //   }
    // },
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.btnEdit {
  float: right;
  padding: 3px 0;
}
.cardHeader {
  cursor: pointer;
}
.cardHeader.current {
  color: #409EFF;
}
.cardHeader .el-button {
  float: right;
  padding: 3px 0;
}
.formInfo img {
  max-width: 100px;
  height: auto;
}
.formInfo p {
  margin: 7px 0;
}
.formInfo + .formInfo {
  border-top: 1px solid #666;
}

.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-select {
  width: 100%;
}
</style>
