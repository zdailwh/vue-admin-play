<template>
  <div>
    <el-upload
      :action="actionUrl"
      :on-remove="handleLogoRemove"
      :file-list="fileList"
      :show-file-list="false"
      :on-success="handleLogoSuccess"
      :on-error="handleLogoError"
      :before-upload="beforeLogoUpload"
      name="imagefile"
    >
      <!-- <i class="el-icon-plus" /> -->
      <el-button type="primary" icon="el-icon-upload">上传台标</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg 或 png文件，且不超过2MB</div>
    </el-upload>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fileList: [],
      actionUrl: '/api/admin/ecs/v1/logos'
    }
  },
  methods: {
    handleLogoRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleLogoSuccess(res, file) {
      console.log('上传返回')
      console.log(res)
      console.log(file)
      // var imageUrl = URL.createObjectURL(file.raw)
      this.$emit('uploadlogo', file)
    },
    handleLogoError() {
      console.log('error')
    },
    beforeLogoUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      // if (!isPNG) {
      //   this.$message.error('上传头像图片只能是 PNG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    }
  }
}
</script>
<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
