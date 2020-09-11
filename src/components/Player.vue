<template>
  <div id="id_test_video" />
</template>
<script>
import { TcPlayer } from 'tcplayer'

export default {
  props: {
    previewurl: {
      type: String,
      default: ''
    }
  },
  mounted() {
    var videoUrl = this.previewurl
    // var demo = 'rtmp://aliplay.evereasycom.cn/cibn_live_2500k/malasong?auth_key=1605085670-0-0-7256bc52eb5ec875badba49481caca93'
    var player = new TcPlayer('id_test_video', {
      rtmp: videoUrl, // 请替换成实际可用的播放地址
      autoplay: true, // iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
      width: '640', // 视频的显示宽度，请尽量使用视频分辨率宽度
      height: '360' // 视频的显示高度，请尽量使用视频分辨率高度
    })
    console.log(videoUrl)
    console.log(player)
  }
}
</script>
<style scoped>
#dplayer {
  width: 100%;
  height: auto;
}
</style>
