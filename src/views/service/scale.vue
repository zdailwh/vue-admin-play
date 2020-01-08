<template>
  <el-row :gutter="0">
    <el-col v-show="url !== ''" :span="24">
      <el-form :model="formLogo" label-width="120px">
        <!-- <el-form-item label="大小(%)">
          <el-slider v-model="formLogo.size" show-input />
        </el-form-item>
        <el-form-item label="透明度(%)">
          <el-slider v-model="formLogo.opacity" show-input />
        </el-form-item> -->
        <el-form-item label="距离上边缘(px)">
          <el-input v-model="formLogo.top" style="width: 100px" />
        </el-form-item>
        <el-form-item label="距离左边缘(px)">
          <el-input v-model="formLogo.left" style="width: 100px" />
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <div id="father">
        <div id="box">
          <img id="logo" src="">
          <!-- <div id="scale" /> -->
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
// import tb from '@/assets/play/tb.png'
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    fatherw: {
      type: String,
      default: '1920'
    },
    fatherh: {
      type: String,
      default: '1080'
    },
    leftpercent: {
      type: Number,
      default: 50
    },
    toppercent: {
      type: Number,
      default: 50
    },
    widthpercent: {
      type: Number,
      default: 0
    },
    heightpercent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      WHRatio: '',
      scaleRatio: 1,
      formLogo: {
        width: 0,
        height: 0,
        size: 0,
        opacity: 100,
        left: 0,
        top: 0
      }
    }
  },
  watch: {
    // 'formLogo.size': function(val, oldVal) {
    //   var fa = document.getElementById('father')
    //   var box = document.getElementById('box')
    //   box.style.width = fa.offsetWidth * val / 100 + 'px'
    //   box.style.height = fa.offsetWidth * val / 100 / this.WHRatio + 'px'
    // },
    'formLogo.opacity': function(val, oldVal) {
      var logo = document.getElementById('logo')
      logo.style.opacity = val / 100
    },
    'formLogo.left': function(val, oldVal) {
      var box = document.getElementById('box')
      // box.style.left = val + 'px'
      box.style.left = val / this.scaleRatio + 'px'
    },
    'formLogo.top': function(val, oldVal) {
      var box = document.getElementById('box')
      // box.style.top = val + 'px'
      box.style.top = val / this.scaleRatio + 'px'
    },
    url: function(val, oldVal) {
      var self = this
      var logo = document.getElementById('logo')
      logo.setAttribute('src', val)
      logo.onload = function(ev) {
        var w = ev.target.width
        var h = ev.target.height
        self.formLogo.width = w
        self.formLogo.height = h
        self.WHRatio = w / h
        // self.formLogo.size = 100
        // logo.style.width = w / self.scaleRatio + 'px'
        // logo.style.height = h / self.scaleRatio + 'px'
        self.formLogo.top = 50
        self.formLogo.left = 50
      }
    }
    // fatherw: function(val, oldVal) {
    //   var fa = document.getElementById('father')
    //   if (val < 1000) {
    //     this.scaleRatio = 2
    //   }
    //   if (val > 1000) {
    //     this.scaleRatio = 5
    //   }
    //   if (val > 2000) {
    //     this.scaleRatio = 10
    //   }
    //   if (val > 3000) {
    //     this.scaleRatio = 15
    //   }
    //   if (val > 4000) {
    //     this.scaleRatio = 20
    //   }
    //   if (val > 7000) {
    //     this.scaleRatio = 30
    //   }
    //   fa.style.width = val / this.scaleRatio + 'px'
    // },
    // fatherh: function(val, oldVal) {
    //   var fa = document.getElementById('father')
    //   fa.style.height = val / this.scaleRatio + 'px'
    // }
  },
  mounted() {
    var self = this
    // box是装图片的容器,fa是图片移动缩放的范围,scale是控制缩放的小图标
    var box = document.getElementById('box')
    var fa = document.getElementById('father')
    // var scale = document.getElementById('scale')
    var logo = document.getElementById('logo')
    // fa.style.height = fa.offsetWidth * 9 / 16 + 'px'
    // fa.style.width = this.fatherw + 'px'
    // fa.style.height = this.fatherh + 'px'
    logo.setAttribute('src', this.url)
    logo.onload = function(ev) {
      var w = ev.target.width
      var h = ev.target.height
      self.formLogo.width = self.widthpercent || w
      self.formLogo.height = self.heightpercent || h
      self.WHRatio = w / h
      // self.formLogo.size = 100
      // logo.style.width = (self.widthpercent || w) / self.scaleRatio + 'px'
      // logo.style.height = (self.heightpercent || h) / self.scaleRatio + 'px'
      self.formLogo.top = self.toppercent || 50
      self.formLogo.left = self.leftpercent || 50
    }
    // 图片移动效果
    box.onmousedown = function(ev) {
      var oEvent = ev
      // 浏览器有一些图片的默认事件,这里要阻止
      oEvent.preventDefault()
      var disX = oEvent.clientX - box.offsetLeft
      var disY = oEvent.clientY - box.offsetTop
      fa.onmousemove = function(ev) {
        oEvent = ev
        oEvent.preventDefault()
        var x = oEvent.clientX - disX
        var y = oEvent.clientY - disY

        // 图形移动的边界判断
        x = x <= 0 ? 0 : x
        x = x >= fa.offsetWidth - box.offsetWidth ? fa.offsetWidth - box.offsetWidth : x
        y = y <= 0 ? 0 : y
        y = y >= fa.offsetHeight - box.offsetHeight ? fa.offsetHeight - box.offsetHeight : y
        // box.style.left = x + 'px'
        // box.style.top = y + 'px'

        self.formLogo.left = x
        self.formLogo.top = y
        // self.formLogo.top = y / self.scaleRatio
        // self.formLogo.left = x / self.scaleRatio
      }
      // 图形移出父盒子取消移动事件,防止移动过快触发鼠标移出事件,导致鼠标弹起事件失效
      fa.onmouseleave = function() {
        fa.onmousemove = null
        fa.onmouseup = null
      }
      // 鼠标弹起后停止移动
      fa.onmouseup = function() {
        fa.onmousemove = null
        fa.onmouseup = null
      }
    }
    // 图片缩放效果
    // scale.onmousedown = function(e) {
    //   // 阻止冒泡,避免缩放时触发移动事件
    //   e.stopPropagation()
    //   e.preventDefault()
    //   var pos = {
    //     'w': box.offsetWidth,
    //     'h': box.offsetHeight,
    //     'x': e.clientX,
    //     'y': e.clientY
    //   }
    //   fa.onmousemove = function(ev) {
    //     ev.preventDefault()
    //     // 设置图片的最小缩放为30*30
    //     var w = Math.max(30, ev.clientX - pos.x + pos.w)
    //     // var h = Math.max(30, ev.clientY - pos.y + pos.h)

    //     // 设置图片的最大宽高
    //     w = w >= fa.offsetWidth - box.offsetLeft ? fa.offsetWidth - box.offsetLeft : w
    //     // h = h >= fa.offsetHeight - box.offsetTop ? fa.offsetHeight - box.offsetTop : h
    //     // box.style.width = w + 'px'
    //     // box.style.height = h + 'px'
    //     self.formLogo.size = w / fa.offsetWidth * 100
    //   }
    //   fa.onmouseleave = function() {
    //     fa.onmousemove = null
    //     fa.onmouseup = null
    //   }
    //   fa.onmouseup = function() {
    //     fa.onmousemove = null
    //     fa.onmouseup = null
    //   }
    // }
  }
}
</script>
<style scoped>
  #box {
/*    width: 60px;
    min-height: 60px;*/
    position: absolute;
  }
  #father {
    background-color: rgb(226, 117, 184);
    position: relative;
    width: 400px;
    height: 250px;
  }
  #logo {
    /*width: 100%;*/
    height: auto;
    cursor: move;
  }
  #scale {
    width: 10px;
    height: 10px;
    overflow: hidden;
    cursor: se-resize;
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: rgb(122, 191, 238);
  }
</style>
