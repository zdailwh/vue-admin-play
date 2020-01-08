<template>
  <el-dialog
    title="台标管理"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <div class="dialogBody">
      <div class="imgList clearfix">
        <div v-for="(l, index) in logoLists" :key="index" class="imgItem">
          <img :src="l.thumb" @click="checkLogo(index, l)">
          <i v-if="checkedlogo.id && l.id === checkedlogo.id" class="el-icon-circle-check check" />
          <!-- <i class="el-icon-remove del" @click="delLogo(index, l)" /> -->
        </div>
      </div>
      <Upload @uploadlogo="uploadLogo($event)" />
    </div>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import Upload from './upload.vue'
export default {
  components: { Upload },
  props: {
    checkedlogo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapState({
      logoLists: state => state.service.logos
    })
  },
  methods: {
    uploadLogo(logo) {
      this.$emit('uploadlogo', logo)
      console.log(logo)
    },
    checkLogo(index, logo) {
      this.$emit('checklogo', { index: index, logo: logo })
    },
    delLogo(index, logo) {
      this.$emit('dellogo', { index: index, id: logo.id })
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
.imgList {
  margin-bottom: 15px;
}
.imgList .imgItem {
  float: left;
  position: relative;
  width: 106px;
  height: 106px;
  padding: 3px;
  margin: 3px;
  border-radius: 3px;
  border: 1px solid #909399;
}
.imgList .imgItem img {
  max-width: 100px;
  max-height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  cursor: pointer;
}
.imgList .imgItem .check {
  position: absolute;
  top: 3px;
  right: 3px;
  font-size: 20px;
  color: #67C23A;
}
.imgList .imgItem .del {
  position: absolute;
  bottom: 3px;
  right: 3px;
  font-size: 20px;
  color: #F56C6C;
  cursor: pointer;
}
</style>
