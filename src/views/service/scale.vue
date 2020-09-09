<template>
  <el-row :gutter="0">
    <el-col v-show="url !== ''" :span="24">
      <el-form :model="formLogo" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="缩放比例(%)">
              <el-slider v-model="formLogo.size" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="宽度(px)">
              <el-input-number v-model="formLogo.width" size="small" :precision="0" style="width: 120px" @blur="widthBlur" @change="widthChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高度(px)">
              <el-input-number v-model="formLogo.height" size="small" :precision="0" style="width: 120px" @blur="heightBlur" @change="heightChange" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上边距(px)">
              <el-input-number v-model="formLogo.top" size="small" style="width: 120px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="左边距(px)">
              <el-input-number v-model="formLogo.left" size="small" style="width: 120px" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="透明度(%)">
          <el-slider v-model="formLogo.opacity" show-input />
        </el-form-item> -->
      </el-form>
    </el-col>
    <el-col :span="24">
      <div id="father">
        <div id="box">
          <img id="logo" src="">
          <!-- <div v-show="url" id="scale" /> -->
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
// import tb from '@/assets/play/tbx5.png'
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    fatherw: {
      type: String,
      default: ''
    },
    fatherh: {
      type: String,
      default: ''
    },
    leftpercent: {
      type: Number,
      default: 0
    },
    toppercent: {
      type: Number,
      default: 0
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
      },
      logoOriginW: 0,
      logoOriginH: 0
    }
  },
  watch: {
    'formLogo.size': function(val, oldVal) {
      var box = document.getElementById('box')
      var logo = document.getElementById('logo')

      logo.style.width = this.logoOriginW * val / 100 / this.scaleRatio + 'px'
      logo.style.height = this.logoOriginH * val / 100 / this.scaleRatio + 'px'
      box.style.width = this.logoOriginW * val / 100 / this.scaleRatio + 'px'
      box.style.height = this.logoOriginH * val / 100 / this.scaleRatio + 'px'
      this.formLogo.width = this.logoOriginW * val / 100
      this.formLogo.height = this.logoOriginH * val / 100
    },
    'formLogo.opacity': function(val, oldVal) {
      var logo = document.getElementById('logo')
      logo.style.opacity = val / 100
    },
    'formLogo.left': function(val, oldVal) {
      var box = document.getElementById('box')
      box.style.left = val / this.scaleRatio + 'px'
    },
    'formLogo.top': function(val, oldVal) {
      var box = document.getElementById('box')
      box.style.top = val / this.scaleRatio + 'px'
    },
    url: function(val, oldVal) {
      this.initLogo(val)
    },
    fatherw: function(val, oldVal) {
      this.initScaleRatio(val)
    },
    fatherh: function(val, oldVal) {
      var fa = document.getElementById('father')
      fa.style.height = val / this.scaleRatio + 'px'
    }
  },
  mounted() {
    var self = this
    // box是装图片的容器,fa是图片移动缩放的范围,scale是控制缩放的小图标
    var box = document.getElementById('box')
    var fa = document.getElementById('father')
    // var scale = document.getElementById('scale')
    // var logo = document.getElementById('logo')

    this.initScaleRatio(this.fatherw)
    fa.style.height = this.fatherh / this.scaleRatio + 'px'

    this.initLogo(this.url)

    // 图片移动效果
    box.onmousedown = function(ev) {
      var oEvent = ev
      // 浏览器有一些图片的默认事件,这里要阻止
      oEvent.preventDefault()
      var disX = oEvent.clientX - box.offsetLeft
      var disY = oEvent.clientY - box.offsetTop

      fa.onmousemove = function(ev) {
        ev.preventDefault()
        var x = (ev.clientX - disX) * self.scaleRatio
        var y = (ev.clientY - disY) * self.scaleRatio

        // 图形移动的边界判断
        x = x <= 0 ? 0 : x
        // x = x >= fa.offsetWidth - box.offsetWidth ? fa.offsetWidth - box.offsetWidth : x
        y = y <= 0 ? 0 : y
        // y = y >= fa.offsetHeight - box.offsetHeight ? fa.offsetHeight - box.offsetHeight : y

        self.formLogo.left = x
        self.formLogo.top = y
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
  },
  methods: {
    initScaleRatio(val) {
      var fa = document.getElementById('father')
      if (val < 1000) {
        this.scaleRatio = 1.5
      }
      if (val > 1000) {
        this.scaleRatio = 3
      }
      if (val > 2000) {
        this.scaleRatio = 5
      }
      if (val > 3000) {
        this.scaleRatio = 8
      }
      if (val > 4000) {
        this.scaleRatio = 12
      }
      if (val > 7000) {
        this.scaleRatio = 15
      }
      fa.style.width = val / this.scaleRatio + 'px'

      var box = document.getElementById('box')
      var logo = document.getElementById('logo')
      logo.style.width = this.logoOriginW * this.formLogo.size / 100 / this.scaleRatio + 'px'
      logo.style.height = this.logoOriginH * this.formLogo.size / 100 / this.scaleRatio + 'px'
      box.style.width = this.logoOriginW * this.formLogo.size / 100 / this.scaleRatio + 'px'
      box.style.height = this.logoOriginH * this.formLogo.size / 100 / this.scaleRatio + 'px'
      box.style.left = this.formLogo.left / this.scaleRatio + 'px'
      box.style.top = this.formLogo.top / this.scaleRatio + 'px'
      this.formLogo.width = this.logoOriginW * this.formLogo.size / 100
      this.formLogo.height = this.logoOriginH * this.formLogo.size / 100
    },
    initLogo(url) {
      var self = this
      var box = document.getElementById('box')
      var logo = document.getElementById('logo')
      logo.setAttribute('src', url)
      logo.onload = function(ev) {
        var w = logo.naturalWidth || logo.width
        var h = logo.naturalHeight || logo.height

        self.logoOriginW = w
        self.logoOriginH = h

        // self.WHRatio = w / h
        self.formLogo.size = parseInt(self.widthpercent / w * 100) || 100
        self.formLogo.top = self.toppercent || 0
        self.formLogo.left = self.leftpercent || 0
        logo.style.width = (self.widthpercent || w) * self.formLogo.size / 100 / self.scaleRatio + 'px'
        logo.style.height = (self.heightpercent || h) * self.formLogo.size / 100 / self.scaleRatio + 'px'
        box.style.width = (self.widthpercent || w) * self.formLogo.size / 100 / self.scaleRatio + 'px'
        box.style.height = (self.heightpercent || h) * self.formLogo.size / 100 / self.scaleRatio + 'px'
        self.formLogo.width = self.logoOriginW * self.formLogo.size / 100
        self.formLogo.height = self.logoOriginH * self.formLogo.size / 100
      }
    },
    widthBlur(e) {
      var w = e.target.value || this.logoOriginW
      this.formLogo.width = w
      this.formLogo.size = parseInt(w / this.logoOriginW * 100)
    },
    heightBlur(e) {
      var h = e.target.value || this.logoOriginH
      this.formLogo.width = h
      this.formLogo.size = parseInt(h / this.logoOriginH * 100)
    },
    widthChange(val, oldVal) {
      var w = val || this.logoOriginW
      this.formLogo.width = w
      this.formLogo.size = parseInt(w / this.logoOriginW * 100)
    },
    heightChange(val, oldVal) {
      var h = val || this.logoOriginH
      this.formLogo.width = h
      this.formLogo.size = parseInt(h / this.logoOriginH * 100)
    }
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
    background: url(../../assets/play/bg1.jpg) no-repeat scroll center;
    background-size: cover;
    position: relative;
    width: 400px;
    height: 250px;
  }
  #logo {
    /*width: 100%;*/
    height: auto;
    cursor: move;
    display: block;
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
